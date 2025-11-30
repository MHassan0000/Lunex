"use client";

import { useEffect, useRef } from "react";
import { useWishlistStore } from "@/store/wishlist";
import { addToWishlist, getWishlist } from "@/lib/actions/wishlist";

export function useWishlistSync(isAuthenticated: boolean) {
    const { items, syncWithBackend } = useWishlistStore();
    const hasSynced = useRef(false);

    useEffect(() => {
        if (isAuthenticated && !hasSynced.current) {
            const migrateWishlist = async () => {
                try {
                    const guestItems = Array.from(items);

                    // Add all guest items to backend
                    if (guestItems.length > 0) {
                        console.log('[Wishlist] Migrating guest items:', guestItems);
                        for (const productId of guestItems) {
                            await addToWishlist(productId);
                        }
                    }

                    // Fetch backend wishlist and sync
                    const { items: backendItems } = await getWishlist();
                    const backendProductIds = backendItems.map(item => item.productId);

                    console.log('[Wishlist] Syncing with backend:', backendProductIds);

                    // Update local state with backend data
                    syncWithBackend(backendProductIds);

                    hasSynced.current = true;
                } catch (error) {
                    console.error('[Wishlist] Migration error:', error);
                }
            };

            migrateWishlist();
        }
    }, [isAuthenticated, items, syncWithBackend]);
}

export function WishlistSyncProvider({
    children,
    isAuthenticated
}: {
    children: React.ReactNode;
    isAuthenticated: boolean;
}) {
    useWishlistSync(isAuthenticated);
    return <>{children}</>;
}
