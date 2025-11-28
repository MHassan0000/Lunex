"use client";

import { CheckCircle, Package, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { toast } from "sonner";

export default function CheckoutSuccessPage() {
    useEffect(() => {
        toast.success("Payment successful! Your order has been confirmed.");
    }, []);

    return (
        <main className="min-h-screen bg-[--color-dark-950] pt-20 pb-20 flex items-center justify-center">
            <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
                <div className="glass-panel rounded-2xl p-8 md:p-12 text-center animate-fade-in">
                    {/* Success Icon */}
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[--color-neon-green]/20">
                        <CheckCircle className="h-12 w-12 text-[--color-neon-green]" />
                    </div>

                    {/* Success Message */}
                    <h1 className="mb-4 font-rajdhani text-4xl md:text-5xl font-bold text-white">
                        Payment Successful!
                    </h1>
                    <p className="mb-8 text-lg text-[--color-light-300]">
                        Thank you for your order. We've received your payment and will process your order shortly.
                    </p>

                    {/* Order Info */}
                    <div className="mb-8 rounded-xl border border-[--color-dark-700] bg-[--color-dark-800] p-6">
                        <div className="flex items-center justify-center gap-3 text-[--color-light-300]">
                            <Package className="h-5 w-5 text-[--color-neon-blue]" />
                            <p>
                                You'll receive an email confirmation with your order details shortly.
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/products"
                            className="group flex items-center justify-center gap-2 rounded-lg bg-[--color-neon-blue] px-6 py-3 font-rajdhani font-bold text-white transition hover:bg-white hover:text-black hover:shadow-[0_0_20px_rgba(0,243,255,0.5)]"
                        >
                            Continue Shopping <ArrowRight className="h-4 w-4" />
                        </Link>
                        <Link
                            href="/"
                            className="rounded-lg border-2 border-[--color-dark-700] px-6 py-3 font-rajdhani font-bold text-[--color-light-300] transition hover:border-[--color-neon-blue] hover:text-white"
                        >
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
