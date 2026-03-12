import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { subscriptions, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import type Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("[stripe/webhook] signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      const plan = session.metadata?.plan as
        | "monthly"
        | "annual"
        | "lifetime"
        | undefined;

      if (!userId || !plan) break;

      if (plan === "lifetime") {
        // One-time payment — grant lifetime access
        await db.insert(subscriptions).values({
          userId,
          plan: "lifetime",
          status: "active",
          stripeSubscriptionId: session.payment_intent as string,
        });
        await db
          .update(users)
          .set({ role: "pro", updatedAt: new Date() })
          .where(eq(users.id, userId));
      } else if (session.subscription) {
        // Subscription — fetch details from Stripe
        const sub = await getStripe().subscriptions.retrieve(
          session.subscription as string
        );
        const item = sub.items.data[0];
        await db.insert(subscriptions).values({
          userId,
          plan,
          status: "active",
          stripeSubscriptionId: sub.id,
          stripePriceId: item?.price.id,
          currentPeriodStart: item ? new Date(item.current_period_start * 1000) : null,
          currentPeriodEnd: item ? new Date(item.current_period_end * 1000) : null,
        });
        await db
          .update(users)
          .set({ role: "pro", updatedAt: new Date() })
          .where(eq(users.id, userId));
      }
      break;
    }

    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      const existing = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.stripeSubscriptionId, sub.id))
        .limit(1);

      if (existing[0]) {
        const status = sub.status === "active" ? "active" :
          sub.status === "past_due" ? "past_due" :
          sub.status === "canceled" ? "cancelled" : "incomplete";

        const item = sub.items.data[0];
        await db
          .update(subscriptions)
          .set({
            status,
            currentPeriodStart: item ? new Date(item.current_period_start * 1000) : null,
            currentPeriodEnd: item ? new Date(item.current_period_end * 1000) : null,
            cancelAtPeriodEnd: sub.cancel_at_period_end,
            updatedAt: new Date(),
          })
          .where(eq(subscriptions.stripeSubscriptionId, sub.id));

        // Downgrade to free if cancelled
        if (status === "cancelled") {
          await db
            .update(users)
            .set({ role: "free", updatedAt: new Date() })
            .where(eq(users.id, existing[0].userId));
        }
      }
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const existing = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.stripeSubscriptionId, sub.id))
        .limit(1);

      if (existing[0]) {
        await db
          .update(subscriptions)
          .set({ status: "cancelled", updatedAt: new Date() })
          .where(eq(subscriptions.stripeSubscriptionId, sub.id));

        await db
          .update(users)
          .set({ role: "free", updatedAt: new Date() })
          .where(eq(users.id, existing[0].userId));
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
