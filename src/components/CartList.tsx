"use client";

import { CartItem, updateCartItem, removeCartItem } from "@/lib/actions/cart";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type Props = {
    initialItems: CartItem[];
};

export default function CartList({ initialItems }: Props) {
    const [items, setItems] = useState(initialItems);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
        if (newQuantity < 1) return;

        // Optimistic update
        setItems((prev) =>
            prev.map((item) =>
                item.id === itemId ? { ...item, quantity: newQuantity } : item
            )
        );

        startTransition(async () => {
            const result = await updateCartItem(itemId, newQuantity);
            if (!result.success) {
                // Revert on failure (simplified, ideally re-fetch)
                router.refresh();
            }
        });
    };

    const handleRemoveItem = async (itemId: string) => {
        // Optimistic update
        setItems((prev) => prev.filter((item) => item.id !== itemId));

        startTransition(async () => {
            const result = await removeCartItem(itemId);
            if (!result.success) {
                router.refresh();
            }
        });
    };

    if (items.length === 0) {
        return (
            <div className="rounded-xl border border-[--color-dark-700] bg-[--color-dark-800] p-12 text-center">
                <h2 className="font-rajdhani text-2xl font-bold text-white">Your cart is empty</h2>
                <p className="mt-2 text-[--color-dark-500]">Looks like you haven't added any gear yet.</p>
                <Link
                    href="/products"
                    className="mt-6 inline-block rounded-md bg-[--color-neon-blue] px-6 py-3 font-bold text-black transition hover:bg-white hover:shadow-[0_0_15px_rgba(0,243,255,0.5)]"
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
                    className="flex flex-col gap-4 rounded-xl border border-[--color-dark-700] bg-[--color-dark-800] p-4 sm:flex-row sm:items-center"
                >
                    <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border border-[--color-dark-700] bg-[--color-dark-900]">
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
                        <div className="space-y-1">
                            <Link href={`/products/${item.productId}`} className="font-rajdhani text-lg font-bold text-white hover:text-[--color-neon-blue]">
                                {item.name}
                            </Link>
                            <div className="flex flex-wrap gap-2 text-xs text-[--color-dark-500]">
                                {item.color && <span>{item.color}</span>}
                                {item.storage && (
                                    <>
                                        <span className="text-[--color-dark-700]">•</span>
                                        <span>{item.storage}</span>
                                    </>
                                )}
                            </div>
                            <p className="font-medium text-[--color-light-300]">${item.price.toFixed(2)}</p>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="flex items-center rounded-lg border border-[--color-dark-700] bg-[--color-dark-900]">
                                <button
                                    onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                    disabled={item.quantity <= 1 || isPending}
                                    className="p-2 text-[--color-light-300] hover:text-white disabled:opacity-50"
                                    aria-label="Decrease quantity"
                                >
                                    <Minus className="h-4 w-4" />
                                </button>
                                <span className="w-8 text-center text-sm font-medium text-white">{item.quantity}</span>
                                <button
                                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                    disabled={item.quantity >= item.maxStock || isPending}
                                    className="p-2 text-[--color-light-300] hover:text-white disabled:opacity-50"
                                    aria-label="Increase quantity"
                                >
                                    <Plus className="h-4 w-4" />
                                </button>
                            </div>

                            <button
                                onClick={() => handleRemoveItem(item.id)}
                                disabled={isPending}
                                className="text-[--color-dark-500] hover:text-[--color-neon-red] transition-colors"
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
