import { XCircle, ArrowLeft, ShoppingCart } from "lucide-react";
import Link from "next/link";

export default function CheckoutCancelPage() {
    return (
        <main className="min-h-screen bg-[--color-dark-950] pt-20 pb-20 flex items-center justify-center relative">
            {/* Background Texture */}
            <div className="absolute inset-0 bg-[url('/images/grid.png')] opacity-5 pointer-events-none fixed" />

            <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="glass-panel-rpg p-8 md:p-12 text-center animate-fade-in">
                    {/* Cancel Icon */}
                    <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-[--color-neon-red]/10 border-2 border-[--color-neon-red] shadow-[0_0_30px_rgba(255,59,48,0.3)]">
                        <XCircle className="h-12 w-12 text-[--color-neon-red]" />
                    </div>

                    {/* Cancel Message */}
                    <h1 className="mb-4 font-rajdhani text-4xl md:text-6xl font-bold text-white uppercase tracking-widest text-glow-red">
                        Checkout Aborted
                    </h1>
                    <p className="mb-10 text-lg text-[--color-light-300] font-medium">
                        Transaction cancelled. Your gear is safe in the cart.
                    </p>

                    {/* Info Box */}
                    <div className="mb-10 rounded-sm border border-[--color-neon-red]/30 bg-[--color-dark-800]/50 p-6 backdrop-blur-sm">
                        <p className="text-[--color-light-300] font-mono text-sm">
                            No credits deducted. Return to base to retry.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/cart"
                            className="group flex items-center justify-center gap-2 rounded-sm bg-[--color-neon-blue] px-8 py-4 font-rajdhani font-bold text-black uppercase tracking-widest transition hover:bg-white hover:shadow-[0_0_20px_rgba(0,243,255,0.6)]"
                        >
                            <ShoppingCart className="h-5 w-5" />
                            Return to Cart
                        </Link>
                        <Link
                            href="/products"
                            className="flex items-center justify-center gap-2 rounded-sm border-2 border-[--color-dark-700] px-8 py-4 font-rajdhani font-bold text-[--color-light-300] uppercase tracking-widest transition hover:border-[--color-neon-blue] hover:text-white hover:shadow-[0_0_15px_rgba(0,243,255,0.3)]"
                        >
                            <ArrowLeft className="h-5 w-5" />
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
