"use client";

import { CheckCircle, Package, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, Suspense } from "react";
import { toast } from "sonner";

function SuccessContent() {
    useEffect(() => {
        toast.success("Payment successful! Your order has been confirmed.");
    }, []);

    return (
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="glass-panel-rpg p-8 md:p-12 text-center animate-fade-in">
                {/* Success Icon */}
                <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-[--color-neon-green]/10 border-2 border-[--color-neon-green] shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                    <CheckCircle className="h-12 w-12 text-[--color-neon-green]" />
                </div>

                {/* Success Message */}
                <h1 className="mb-4 font-rajdhani text-4xl md:text-6xl font-bold text-white uppercase tracking-widest text-glow-green">
                    Payment Successful
                </h1>
                <p className="mb-10 text-lg text-[--color-light-300] font-medium">
                    Mission Accomplished. Your gear is being secured.
                </p>

                {/* Order Info */}
                <div className="mb-10 rounded-sm border border-[--color-neon-blue]/30 bg-[--color-dark-800]/50 p-6 backdrop-blur-sm">
                    <div className="flex items-center justify-center gap-4 text-[--color-light-300]">
                        <Package className="h-6 w-6 text-[--color-neon-blue]" />
                        <p className="font-mono text-sm">
                            Confirmation sequence sent to your email.
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/products"
                        className="group flex items-center justify-center gap-2 rounded-sm bg-[--color-neon-blue] px-8 py-4 font-rajdhani font-bold text-black uppercase tracking-widest transition hover:bg-white hover:shadow-[0_0_20px_rgba(0,243,255,0.6)]"
                    >
                        Continue Shopping <ArrowRight className="h-5 w-5" />
                    </Link>
                    <Link
                        href="/"
                        className="rounded-sm border-2 border-[--color-dark-700] px-8 py-4 font-rajdhani font-bold text-[--color-light-300] uppercase tracking-widest transition hover:border-[--color-neon-blue] hover:text-white hover:shadow-[0_0_15px_rgba(0,243,255,0.3)]"
                    >
                        Back to Base
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function CheckoutSuccessPage() {
    return (
        <main className="min-h-screen bg-[--color-dark-950] pt-20 pb-20 flex items-center justify-center relative">
            {/* Background Texture */}
            <div className="absolute inset-0 bg-[url('/images/grid.png')] opacity-5 pointer-events-none fixed" />

            <Suspense fallback={<div className="text-white font-rajdhani animate-pulse">Loading...</div>}>
                <SuccessContent />
            </Suspense>
        </main>
    );
}
