import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  typescript: true,
});

export type CreateCheckoutSessionParams = {
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  customerId?: string;
  clientReferenceId?: string;
  metadata?: Record<string, string>;
};

export async function createCheckoutSession(params: CreateCheckoutSessionParams) {
  return stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: params.priceId, quantity: 1 }],
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    customer: params.customerId,
    client_reference_id: params.clientReferenceId,
    metadata: params.metadata,
    subscription_data: params.metadata ? { metadata: params.metadata } : undefined,
  });
}

export async function createBillingPortalSession(params: {
  customerId: string;
  returnUrl: string;
}) {
  return stripe.billingPortal.sessions.create({
    customer: params.customerId,
    return_url: params.returnUrl,
  });
}

export async function getSubscription(subscriptionId: string) {
  return stripe.subscriptions.retrieve(subscriptionId);
}
