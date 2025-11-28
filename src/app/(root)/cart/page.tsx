import { getCart } from "@/lib/actions/cart";
import CartList from "@/components/CartList";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";

export default async function CartPage() {
    const cart = await getCart();
    const items = cart?.items ?? [];
    const subtotal = cart?.subtotal ?? 0;
    const shipping = subtotal > 100 ? 0 : 15;
    const total = subtotal + shipping;

    return (
        <main className="min-h-screen bg-[--color-dark-950] pt-20 pb-20 animate-fade-in">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <h1 className="mb-8 font-rajdhani text-4xl font-bold text-white text-center">Your Cart</h1>

                <div className={items.length > 0 ? "grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]" : "flex justify-center"}>
                    {/* Cart Items */}
                    <section className={`animate-slide-up ${items.length === 0 ? "w-full max-w-2xl" : ""}`} style={{ animationDelay: "0.1s" }}>
                        <CartList initialItems={items} />
                    </section>

                    {/* Summary */}
                    {items.length > 0 && (
                        <aside className="h-fit space-y-6 rounded-xl border border-[--color-dark-700] bg-[--color-dark-800] p-6 animate-slide-in-right" style={{ animationDelay: "0.2s" }}>
                            <h2 className="font-rajdhani text-xl font-bold text-white">Order Summary</h2>

                            <div className="space-y-4 border-b border-[--color-dark-700] pb-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-[--color-dark-500]">Subtotal</span>
                                    <span className="text-[--color-light-300]">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-[--color-dark-500]">Shipping</span>
                                    <span className="text-[--color-light-300]">{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                                </div>
                            </div>

                            <div className="flex justify-between text-lg font-bold text-white">
                                <span>Total</span>
                                <span>${total.toFixed(2)}</span>
                            </div>

                            <button className="flex w-full items-center justify-center gap-2 rounded-md bg-[--color-neon-blue] px-6 py-3 font-bold text-white hover:text-black transition hover:bg-white hover:shadow-[0_0_15px_rgba(0,243,255,0.5)]">
                                Checkout <ArrowRight className="h-4 w-4" />
                            </button>

                            <div className="flex items-center justify-center gap-2 text-xs text-[--color-dark-500]">
                                <ShieldCheck className="h-4 w-4 text-[--color-neon-green]" />
                                <span>Secure Checkout</span>
                            </div>
                        </aside>
                    )}
                </div>
            </div>
        </main>
    );
}
