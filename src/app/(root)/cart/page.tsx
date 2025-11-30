import { getCart } from "@/lib/actions/cart";
import CartList from "@/components/CartList";
import CheckoutButton from "@/components/CheckoutButton";
import { ShieldCheck } from "lucide-react";
import DarkVeil from "@/components/DarkVeil";

export default async function CartPage() {
    const cart = await getCart();
    const items = cart?.items ?? [];
    const subtotal = cart?.subtotal ?? 0;
    const shipping = subtotal > 100 ? 0 : 15;
    const total = subtotal + shipping;

    return (
        <main className="min-h-screen pt-20 pb-20 animate-fade-in relative">
            <div className="fixed inset-0 z-0">
                <DarkVeil />
            </div>
            {/* Background Texture */}
            <div className="absolute inset-0 bg-[url('/images/grid.png')] opacity-5 pointer-events-none fixed" />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
                <h1 className="mb-8 font-rajdhani text-5xl font-bold text-white text-center uppercase tracking-wider text-glow-purple">Your Cart</h1>

                <div className={items.length > 0 ? "grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]" : "flex justify-center"}>
                    {/* Cart Items */}
                    <section className={`animate-slide-up ${items.length === 0 ? "w-full max-w-2xl" : ""}`} style={{ animationDelay: "0.1s" }}>
                        <CartList initialItems={items} />
                    </section>

                    {/* Summary */}
                    {items.length > 0 && (
                        <aside className="h-fit space-y-6 rounded-xl glass-panel-rpg p-8 animate-slide-in-right" style={{ animationDelay: "0.2s" }}>
                            <h2 className="font-rajdhani text-2xl font-bold text-white uppercase tracking-wider border-b border-[--color-dark-700] pb-4">Order Summary</h2>

                            <div className="space-y-4 border-b border-[--color-dark-700] pb-4">
                                <div className="flex justify-between text-sm font-medium">
                                    <span className="text-[--color-dark-500] uppercase tracking-wide">Subtotal</span>
                                    <span className="text-[--color-light-300] font-mono">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm font-medium">
                                    <span className="text-[--color-dark-500] uppercase tracking-wide">Shipping</span>
                                    <span className="text-[--color-neon-green] font-mono">{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
                                </div>
                            </div>

                            <div className="flex justify-between text-xl font-bold text-white">
                                <span className="uppercase tracking-wider">Total</span>
                                <span className="text-glow-purple font-rajdhani">${total.toFixed(2)}</span>
                            </div>

                            <CheckoutButton />

                            <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-[--color-dark-500]">
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
