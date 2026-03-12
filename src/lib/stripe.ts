import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-02-25.clover",
      typescript: true,
    });
  }
  return _stripe;
}

export const PLANS = {
  monthly: {
    name: "Pro Monthly",
    price: 900, // £9.00 in pence
    interval: "month" as const,
    priceId: process.env.STRIPE_PRICE_MONTHLY ?? "",
  },
  annual: {
    name: "Pro Annual",
    price: 7900, // £79.00 in pence
    interval: "year" as const,
    priceId: process.env.STRIPE_PRICE_ANNUAL ?? "",
  },
  lifetime: {
    name: "Lifetime Access",
    price: 14900, // £149.00 in pence
    interval: null,
    priceId: process.env.STRIPE_PRICE_LIFETIME ?? "",
  },
} as const;
