"use client";

import { X } from "lucide-react";
import { useState } from "react";
import { removeFromWishlist } from "@/lib/actions/wishlist";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export interface RemoveFromWishlistButtonProps {
    productId: string;
}

export default function RemoveFromWishlistButton({ productId }: RemoveFromWishlistButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleRemove = async (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigation if button is inside a link
        e.stopPropagation();

        setIsLoading(true);

        const result = await removeFromWishlist(productId);

        if (result.success) {
            toast.success("Removed from wishlist", {
                duration: 2000,
            });
            // Refresh the page to show updated wishlist
            router.refresh();
        } else {
            toast.error(result.error || "Failed to remove from wishlist", {
                duration: 3000,
            });
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleRemove}
            disabled={isLoading}
            className={`rounded-full bg-[--color-dark-900]/90 backdrop-blur-sm border border-[--color-dark-700] p-2 transition-all hover:bg-[--color-neon-red]/20 hover:border-[--color-neon-red] hover:scale-110 focus:outline-none ${isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
            aria-label="Remove from wishlist"
        >
            <X className="h-4 w-4 text-white" />
        </button>
    );
}
