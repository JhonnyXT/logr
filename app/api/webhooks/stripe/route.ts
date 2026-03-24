import { headers } from "next/headers";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

async function syncSubscriptionToProfile(subscription: Stripe.Subscription) {
  const supabase = createAdminClient();
  const customerId = subscription.customer as string;
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .maybeSingle();

  if (!profile) return;

  const active =
    subscription.status === "active" || subscription.status === "trialing";
  const periodEnd = subscription.current_period_end
    ? new Date(subscription.current_period_end * 1000).toISOString()
    : null;

  await supabase
    .from("profiles")
    .update({
      subscription_tier: active ? "pro" : "free",
      subscription_ends_at: active ? periodEnd : periodEnd ?? new Date().toISOString(),
    })
    .eq("id", profile.id);
}

export async function POST(request: Request) {
  if (!webhookSecret) {
    return new Response("STRIPE_WEBHOOK_SECRET is not configured", { status: 500 });
  }

  const body = await request.text();
  const headerList = await headers();
  const signature = headerList.get("stripe-signature");
  if (!signature) {
    return new Response("Missing stripe-signature", { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  const supabase = createAdminClient();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.supabase_user_id;
        const customerId =
          typeof session.customer === "string" ? session.customer : null;
        if (!userId || !customerId) break;

        let subscriptionEndsAt: string | null = null;
        const subId =
          typeof session.subscription === "string" ? session.subscription : null;
        if (subId) {
          const sub = await stripe.subscriptions.retrieve(subId);
          subscriptionEndsAt = sub.current_period_end
            ? new Date(sub.current_period_end * 1000).toISOString()
            : null;
        }

        await supabase
          .from("profiles")
          .update({
            stripe_customer_id: customerId,
            subscription_tier: "pro",
            subscription_ends_at: subscriptionEndsAt,
          })
          .eq("id", userId);
        break;
      }
      case "customer.subscription.updated": {
        await syncSubscriptionToProfile(
          event.data.object as Stripe.Subscription
        );
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("stripe_customer_id", customerId)
          .maybeSingle();
        if (!profile) break;
        await supabase
          .from("profiles")
          .update({
            subscription_tier: "free",
            subscription_ends_at: new Date().toISOString(),
          })
          .eq("id", profile.id);
        break;
      }
      default:
        break;
    }
  } catch (err) {
    console.error("Stripe webhook handler error:", err);
    return new Response("Webhook handler failed", { status: 500 });
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
