"use client";

import { XCircle, ArrowLeft, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

export const dynamic = 'force-dynamic';

function CancelContent() {
    return (
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
            <div className="glass-panel rounded-2xl p-8 md:p-12 text-center animate-fade-in">
                {/* Cancel Icon */}
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[--color-dark-700]">
                    <XCircle className="h-12 w-12 text-[--color-light-300]" />
                </div>

                {/* Cancel Message */}
                <h1 className="mb-4 font-rajdhani text-4xl md:text-5xl font-bold text-white">
                    Checkout Cancelled
                </h1>
                <p className="mb-8 text-lg text-[--color-light-300]">
                    Your payment was cancelled. Your cart items are still saved and waiting for you.
                </p>

                {/* Info Box */}
                <div className="mb-8 rounded-xl border border-[--color-dark-700] bg-[--color-dark-800] p-6">
                    <p className="text-[--color-light-300]">
                        No charges were made to your account. You can return to your cart to complete your purchase anytime.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/cart"
                        className="group flex items-center justify-center gap-2 rounded-lg bg-[--color-neon-blue] px-6 py-3 font-rajdhani font-bold text-white transition hover:bg-white hover:text-black hover:shadow-[0_0_20px_rgba(0,243,255,0.5)]"
                    >
                        <ShoppingCart className="h-4 w-4" />
                        Return to Cart
                    </Link>
                    <Link
                        href="/products"
                        className="flex items-center justify-center gap-2 rounded-lg border-2 border-[--color-dark-700] px-6 py-3 font-rajdhani font-bold text-[--color-light-300] transition hover:border-[--color-neon-blue] hover:text-white"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function CheckoutCancelPage() {
    return (
        <main className="min-h-screen bg-[--color-dark-950] pt-20 pb-20 flex items-center justify-center">
            <Suspense fallback={<div className="text-white">Loading...</div>}>
                <CancelContent />
            </Suspense>
        </main>
    );
}
