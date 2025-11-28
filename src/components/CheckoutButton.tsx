"use client";

import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface CheckoutButtonProps {
    disabled?: boolean;
}

export default function CheckoutButton({ disabled }: CheckoutButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleCheckout = async () => {
        try {
            setIsLoading(true);

            // Call checkout API
            const response = await fetch("/api/checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 401) {
                    toast.error("Please sign in to checkout");
                    router.push("/sign-in?redirect=/cart");
                    return;
                }
                throw new Error(data.error || "Failed to create checkout session");
            }

            // Redirect to Stripe checkout
            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error("No checkout URL returned");
            }
        } catch (error) {
            console.error("Checkout error:", error);
            toast.error(error instanceof Error ? error.message : "Failed to start checkout");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleCheckout}
            disabled={disabled || isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-[--color-neon-blue] px-6 py-3 font-bold text-white hover:text-black transition hover:bg-white hover:shadow-[0_0_15px_rgba(0,243,255,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {isLoading ? (
                <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                </>
            ) : (
                <>
                    Checkout <ArrowRight className="h-4 w-4" />
                </>
            )}
        </button>
    );
}
