import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getStripe, PLANS } from "@/lib/stripe";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || !session.user.email) {
      return NextResponse.json({ error: "Sign in required" }, { status: 401 });
    }

    const body = await req.json();
    const { plan, locale = "en" } = body as {
      plan: "monthly" | "annual" | "lifetime";
      locale?: string;
    };

    const planConfig = PLANS[plan];
    if (!planConfig || !planConfig.priceId) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    // Get or create Stripe customer
    const [user] = await db
      .select({ stripeCustomerId: users.stripeCustomerId })
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1);

    let customerId = user?.stripeCustomerId;

    if (!customerId) {
      const customer = await getStripe().customers.create({
        email: session.user.email,
        name: session.user.name ?? undefined,
        metadata: { userId: session.user.id },
      });
      customerId = customer.id;

      await db
        .update(users)
        .set({ stripeCustomerId: customerId })
        .where(eq(users.id, session.user.id));
    }

    const basePath = locale === "en" ? "" : `/${locale}`;

    // Create checkout session
    const checkoutSession = await getStripe().checkout.sessions.create({
      customer: customerId,
      mode: plan === "lifetime" ? "payment" : "subscription",
      line_items: [{ price: planConfig.priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL ?? "https://aieducademy.org"}${basePath}/dashboard?payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL ?? "https://aieducademy.org"}${basePath}/pricing?payment=cancelled`,
      metadata: {
        userId: session.user.id,
        plan,
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err) {
    console.error("[stripe/checkout] error:", err);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
