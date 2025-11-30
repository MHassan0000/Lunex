"use client";

import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { useWishlistStore } from "@/store/wishlist";
import { toast } from "sonner";
import { isInWishlist } from "@/lib/actions/wishlist";

export interface AddToWishlistButtonProps {
    productId: string;
    className?: string;
    variant?: "icon" | "button";
    user?: { id: string } | null;
}

export default function AddToWishlistButton({
    productId,
    className = "",
    variant = "button",
    user,
}: AddToWishlistButtonProps) {
    const { hasItem, toggleItem, loadingItems } = useWishlistStore();
    const [isInWishlistState, setIsInWishlistState] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    const isAuthenticated = !!user;
    const isLoading = loadingItems.has(productId);
    const inWishlist = hasItem(productId);

    // Sync with backend on mount for authenticated users
    useEffect(() => {
        if (isAuthenticated && !isInitialized) {
            isInWishlist(productId).then(({ inWishlist }) => {
                setIsInWishlistState(inWishlist);
                if (inWishlist && !hasItem(productId)) {
                    useWishlistStore.getState().addItem(productId, false); // Add to local state without API call
                }
                setIsInitialized(true);
            });
        } else if (!isAuthenticated) {
            setIsInitialized(true);
        }
    }, [isAuthenticated, productId, isInitialized, hasItem]);

    const handleToggle = async () => {
        const result = await toggleItem(productId, isAuthenticated);

        if (result.success) {
            if (hasItem(productId)) {
                toast.success(result.message || "Added to wishlist", {
                    duration: 2000,
                });
            } else {
                toast.success(result.message || "Removed from wishlist", {
                    duration: 2000,
                });
            }
        } else {
            toast.error(result.error || "Failed to update wishlist", {
                duration: 3000,
            });
        }
    };

    if (variant === "icon") {
        return (
            <button
                onClick={handleToggle}
                disabled={isLoading}
                className={`group relative transition-all ${isLoading ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
                aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
            >
                <Heart
                    className={`h-5 w-5 transition-all ${inWishlist
                            ? "fill-white text-white"
                            : "text-[--color-neon-purple] group-hover:fill-[--color-neon-purple]/20"
                        }`}
                />
            </button>
        );
    }

    return (
        <button
            onClick={handleToggle}
            disabled={isLoading}
            className={`flex items-center justify-center gap-2 rounded-sm border border-[--color-neon-purple] bg-transparent px-4 sm:px-6 py-4 font-bold text-[--color-neon-purple] uppercase tracking-wide sm:tracking-widest transition-all hover:bg-[--color-neon-purple] hover:text-white hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] focus:outline-none text-sm sm:text-base ${isLoading ? "opacity-50 cursor-not-allowed" : ""
                } ${className}`}
            aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
            <Heart
                className={`h-5 w-5 transition-all ${inWishlist ? "fill-white" : ""
                    }`}
            />
            <span>{inWishlist ? "In Wishlist" : "Add to Wishlist"}</span>
        </button>
    );
}
