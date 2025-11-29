"use client";

import { CartItem, updateCartItem, removeCartItem } from "@/lib/actions/cart";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart";

type Props = {
    initialItems: CartItem[];
};

export default function CartList({ initialItems }: Props) {
    const [items, setItems] = useState(initialItems);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const incrementCart = useCartStore((state) => state.increment);

    const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
        if (newQuantity < 1) return;

        const item = items.find(i => i.id === itemId);
        if (!item) return;
        const diff = newQuantity - item.quantity;

        // Optimistic update
        setItems((prev) =>
            prev.map((item) =>
                item.id === itemId ? { ...item, quantity: newQuantity } : item
            )
        );

        startTransition(async () => {
            const result = await updateCartItem(itemId, newQuantity);
            if (result.success) {
                incrementCart(diff);
                router.refresh();
            } else {
                // Revert on failure (simplified, ideally re-fetch)
                router.refresh();
            }
        });
    };

    const handleRemoveItem = async (itemId: string) => {
        const item = items.find(i => i.id === itemId);
        if (!item) return;

        // Optimistic update
        setItems((prev) => prev.filter((item) => item.id !== itemId));

        startTransition(async () => {
            const result = await removeCartItem(itemId);
            if (result.success) {
                incrementCart(-item.quantity);
                router.refresh();
            } else {
                router.refresh();
            }
        });
    };

    if (items.length === 0) {
        return (
            <div className="rounded-xl glass-panel-rpg p-12 text-center">
                <h2 className="font-rajdhani text-3xl font-bold text-white uppercase tracking-wider text-glow">Your cart is empty</h2>
                <p className="mt-4 text-[--color-light-300]">Looks like you haven&apos;t added any gear yet.</p>
                <Link
                    href="/products"
                    className="mt-8 inline-block rounded-sm bg-[--color-neon-blue] px-8 py-3 font-rajdhani font-bold text-black uppercase tracking-widest transition hover:bg-white hover:shadow-[0_0_20px_rgba(0,243,255,0.6)]"
                >
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {items.map((item) => (
                <div
                    key={item.id}
                    className="flex flex-col gap-6 rounded-xl border border-[--color-dark-700] bg-[--color-dark-800]/50 p-6 sm:flex-row sm:items-center transition-all hover:border-[--color-neon-blue]/30 hover:bg-[--color-dark-800]"
                >
                    <div className="relative h-28 w-28 flex-shrink-0 overflow-hidden rounded-sm border border-[--color-dark-700] bg-[--color-dark-900]">
                        {item.image ? (
                            <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center bg-[--color-dark-800] text-[--color-dark-500]">
                                No Image
                            </div>
                        )}
                    </div>

                    <div className="flex flex-1 flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div className="space-y-2">
                            <Link href={`/products/${item.productId}`} className="font-rajdhani text-xl font-bold text-white uppercase tracking-wide hover:text-[--color-neon-blue] transition-colors">
                                {item.name}
                            </Link>
                            <div className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-wider text-[--color-dark-500]">
                                {item.color && <span className="text-[--color-light-300]">{item.color}</span>}
                                {item.storage && (
                                    <>
                                        <span className="text-[--color-dark-700]">/</span>
                                        <span className="text-[--color-light-300]">{item.storage}</span>
                                    </>
                                )}
                            </div>
                            <p className="font-rajdhani text-lg font-bold text-[--color-neon-blue] text-glow-blue">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>

                        <div className="flex items-center gap-8">
                            <div className="flex items-center rounded-sm border border-[--color-dark-700] bg-[--color-dark-900]">
                                <button
                                    onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                    disabled={item.quantity <= 1 || isPending}
                                    className="p-3 text-[--color-light-300] hover:text-[--color-neon-blue] hover:bg-[--color-dark-800] disabled:opacity-50 transition-colors"
                                    aria-label="Decrease quantity"
                                >
                                    <Minus className="h-4 w-4" />
                                </button>
                                <span className="w-10 text-center text-sm font-bold text-white font-mono">{item.quantity}</span>
                                <button
                                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                    disabled={item.quantity >= item.maxStock || isPending}
                                    className="p-3 text-[--color-light-300] hover:text-[--color-neon-blue] hover:bg-[--color-dark-800] disabled:opacity-50 transition-colors"
                                    aria-label="Increase quantity"
                                >
                                    <Plus className="h-4 w-4" />
                                </button>
                            </div>

                            <button
                                onClick={() => handleRemoveItem(item.id)}
                                disabled={isPending}
                                className="text-[--color-dark-500] hover:text-[--color-neon-red] transition-colors p-2 hover:bg-[--color-neon-red]/10 rounded-full"
                                aria-label="Remove item"
                            >
                                {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Trash2 className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
