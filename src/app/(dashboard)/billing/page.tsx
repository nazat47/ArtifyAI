import { getCredits } from "@/actions/credit-actions";
import PlanSummary from "@/components/billing/plan-summary";
import BillingPricing from "@/components/billing/pricing";
import { getProducts, getSubscription, getUser } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

const BillingPage = async () => {
  const supabase = await createClient();

  const [user, products, subscription] = await Promise.all([
    getUser(supabase),
    getProducts(supabase),
    getSubscription(supabase),
  ]);

  if (!user) {
    return redirect(`/login`);
  }

  const { data: credits } = await getCredits();

  return (
    <section className="container mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Plans & Billing</h1>
        <p className="text-muted-foreground">
          Manage your subscription and billing information
        </p>
      </div>
      <div className="grid gap-6">
        <PlanSummary
          subscription={subscription}
          user={user}
          products={products || []}
          credits={credits}
        />
        {subscription?.status === "active" && (
          <BillingPricing
            user={user}
            products={products ?? []}
            subscription={subscription}
            showInterval={false}
            className="p-0 max-w-full"
            activeProduct={
              subscription?.prices?.products?.name.toLowerCase() || "pro"
            }
          />
        )}
      </div>
    </section>
  );
};

export default BillingPage;
