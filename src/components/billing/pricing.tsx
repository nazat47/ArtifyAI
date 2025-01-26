"use client";
import React, { useState } from "react";
import AnimatedGradientText from "../ui/animated-gradient-text";
import { cn } from "@/lib/utils";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Tables } from "@datatypes.types";
import { Badge } from "../ui/badge";
import Link from "next/link";
import { Button } from "../ui/button";
import { Check } from "lucide-react";
import { User } from "@supabase/supabase-js";
import { usePathname, useRouter } from "next/navigation";
import { checkoutWithStripe, createStripePortal } from "@/lib/stripe/server";
import { getErrorRedirect } from "@/lib/helpers";
import { getStripe } from "@/lib/stripe/client";
import { toast } from "sonner";

type Product = Tables<"products">;
type Price = Tables<"prices">;

interface ProductWithPrices extends Product {
  prices: Price[];
}

type Subscription = Tables<"subscriptions">;

interface ProductWithPrices extends Product {
  prices: Price[];
}

interface PriceWithProduct extends Price {
  products: Product | null;
}

interface SubscriptionWithProduct extends Subscription {
  prices: PriceWithProduct | null;
}

interface PricingProps {
  subscription: SubscriptionWithProduct | null;
  user: User | null;
  products: ProductWithPrices[] | null;
  mostPopularProduct?: string;
  showInterval?: boolean;
  className?: string;
  activeProduct?: string;
}

const renderPricingButton = ({
  subscription,
  user,
  product,
  mostPopularProduct,
  price,
  handleStripeCheckout,
  handleStripePortalRequest,
}: {
  subscription: SubscriptionWithProduct | null;
  user: User | null;
  product: Product;
  mostPopularProduct: string;
  price: Price;
  handleStripeCheckout: (price: Price) => Promise<void>;
  handleStripePortalRequest: () => Promise<void>;
}) => {
  if (
    user &&
    subscription &&
    subscription.prices?.products?.name?.toLowerCase() ===
      product.name?.toLowerCase()
  ) {
    return (
      <Button
        className="mt-8 w-full font-semibold"
        variant={"default"}
        onClick={handleStripePortalRequest}
      >
        Manage Subsciption
      </Button>
    );
  }

  if (user && subscription) {
    return (
      <Button
        className="mt-8 w-full font-semibold"
        variant={"secondary"}
        onClick={handleStripePortalRequest}
      >
        Switch Plan
      </Button>
    );
  }

  if (user && !subscription) {
    return (
      <Button
        className="mt-8 w-full font-semibold"
        variant={
          product.name?.toLowerCase() === mostPopularProduct.toLowerCase()
            ? "default"
            : "secondary"
        }
        onClick={() => handleStripeCheckout(price)}
      >
        Subscribe
      </Button>
    );
  }

  <Button
    className="mt-8 w-full font-semibold"
    variant={
      product.name?.toLowerCase() === mostPopularProduct.toLowerCase()
        ? "default"
        : "secondary"
    }
    onClick={() => handleStripeCheckout(price)}
  >
    Subscribe
  </Button>;

  return null;
};

const BillingPricing = ({
  user,
  products,
  mostPopularProduct = "",
  subscription,
  showInterval = true,
  className,
  activeProduct = "",
}: PricingProps) => {
  const [billingInterval, setBillingInterval] = useState("month");
  const router = useRouter();
  const currentPath = usePathname();

  const handleStripeCheckout = async (price: Price) => {
    if (!user) {
      router.push("/login");
    }

    const { errorRedirect, sessionId } = await checkoutWithStripe(
      price,
      currentPath
    );
    if (errorRedirect) {
      return router.push(errorRedirect);
    }

    if (!sessionId) {
      return router.push(
        getErrorRedirect(
          currentPath,
          "Unknown error occured",
          "Please try again later or contact us."
        )
      );
    }

    const stripe = await getStripe();
    stripe?.redirectToCheckout({ sessionId });
  };

  const handleStripePortalRequest = async () => {
    toast.info("redirecting to stripe portal...");
    const redirectUrl = await createStripePortal(currentPath);
    return router.push(redirectUrl);
  };

  return (
    <section
      className={cn(
        "max-w-7xl mx-auto py-16 px-4 sm:px-56 lg:px-8 flex flex-col w-full",
        className
      )}
    >
      {showInterval && (
        <div className="flex justify-center items-center space-x-4 py-8">
          <Label htmlFor="pricing-switch" className="font-semibold text-base">
            Monthly
          </Label>
          <Switch
            id="pricing-switch"
            checked={billingInterval === "year"}
            onCheckedChange={(checked) =>
              setBillingInterval(checked ? "year" : "month")
            }
          />
          <Label htmlFor="pricing-switch" className="font-semibold text-base">
            Yearly
          </Label>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 place-items-center mx-auto gap-8 space-y-0">
        {products?.map((product) => {
          const price = product?.prices?.find(
            (price) => price.interval === billingInterval
          );
          if (!price) return null;

          const priceString = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: price.currency!,
            minimumFractionDigits: 0,
          }).format((price?.unit_amount || 0) / 100);

          return (
            <div
              key={product.id}
              className={cn(
                "border bg-background rounded-xl shadow-sm h-fit divide-y divide-border border-border",
                product.name?.toLowerCase() === activeProduct
                  ? "border-primary bg-background drop-shadow-md"
                  : "border-border"
              )}
            >
              <div className="p-6">
                <h2 className="text-2xl leading-6 font-semibold text-foreground flex items-center justify-between">
                  {product.name}
                  {product.name?.toLowerCase() ===
                  activeProduct.toLowerCase() ? (
                    <Badge className="border border-border font-semibold">
                      Selected
                    </Badge>
                  ) : null}
                  {product.name?.toLowerCase() ===
                  mostPopularProduct.toLowerCase() ? (
                    <Badge className="border border-border font-semibold">
                      Most Popular{" "}
                    </Badge>
                  ) : null}
                </h2>
                <p className="text-muted-foreground text-sm mt-4">
                  {product?.description}
                </p>
                <p className="mt-8">
                  <span className="text-4xl font-extrabold text-foreground">
                    {priceString}
                  </span>
                  <span className="text-base font-medium text-muted-foreground">
                    /{billingInterval}
                  </span>
                </p>
                {renderPricingButton({
                  subscription,
                  user,
                  price,
                  mostPopularProduct,
                  product,
                  handleStripeCheckout,
                  handleStripePortalRequest,
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default BillingPricing;
