"use client";

import { addToCart } from "@/lib/actions/cart";
import { useVariantStore } from "@/store/variant";
import { useCartStore } from "@/store/cart";
import { ShoppingBag, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Variant = {
    id: string;
    color?: { name: string } | null;
    storage?: { name: string } | null;
    ram?: string | null;
    inStock?: number | null;
};

type Props = {
    productId: string;
    variants: Variant[];
};

export default function AddToCartButton({ productId, variants }: Props) {
    const [loading, setLoading] = useState(false);
    const selection = useVariantStore((state) => state.getSelection(productId));
    const incrementCart = useCartStore((state) => state.increment);
    const router = useRouter();

    const handleAddToCart = async () => {
        setLoading(true);

        // Find the matching variant based on selections
        const selectedVariant = variants.find((v) => {
            const colorMatch = (v.color?.name ?? null) === selection.color;
            const storageMatch = (v.storage?.name ?? null) === selection.storage;
            const ramMatch = (v.ram ?? null) === selection.ram;

            return colorMatch && storageMatch && ramMatch;
        });

        // Fallback: If no exact match, try to find a variant that matches the non-null selections, 
        // or just the first one if nothing selected.
        const variantToAdd = selectedVariant || variants[0];

        if (!variantToAdd) {
            toast.error("Could not determine which item to add. Please select options.");
            setLoading(false);
            return;
        }

        if ((variantToAdd.inStock ?? 0) < 1) {
            toast.error("This item is out of stock.");
            setLoading(false);
            return;
        }

        const result = await addToCart(variantToAdd.id, 1);

        if (result.success) {
            toast.success("Added to cart");
            incrementCart(1);
            router.refresh();
        } else {
            toast.error(result.error || "Failed to add to cart");
        }
        setLoading(false);
    };

    return (
        <button
            onClick={handleAddToCart}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-md bg-[--color-neon-blue] px-6 py-4 font-rajdhani text-lg font-bold text-white hover:text-black transition-all hover:bg-white hover:shadow-[0_0_20px_rgba(0,243,255,0.5)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[--color-neon-blue] disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ShoppingBag className="h-5 w-5" />}
            Add to Cart
        </button>
    );
}
