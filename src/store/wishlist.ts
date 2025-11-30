"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { addToWishlist, removeFromWishlist, isInWishlist } from "@/lib/actions/wishlist";

type WishlistState = {
    items: Set<string>; // product IDs
    isLoading: boolean;
    loadingItems: Set<string>; // track which items are being added/removed

    // Actions
    addItem: (productId: string, isAuthenticated: boolean) => Promise<{ success: boolean; message?: string; error?: string }>;
    removeItem: (productId: string, isAuthenticated: boolean) => Promise<{ success: boolean; message?: string; error?: string }>;
    toggleItem: (productId: string, isAuthenticated: boolean) => Promise<{ success: boolean; message?: string; error?: string }>;
    hasItem: (productId: string) => boolean;
    setItems: (items: Set<string>) => void;
    syncWithBackend: (productIds: string[]) => void;
    clearGuestWishlist: () => void;
};

export const useWishlistStore = create<WishlistState>()(
    persist(
        (set, get) => ({
            items: new Set<string>(),
            isLoading: false,
            loadingItems: new Set<string>(),

            addItem: async (productId: string, isAuthenticated: boolean) => {
                // Optimistic update
                const currentItems = new Set(get().items);
                const loadingItems = new Set(get().loadingItems);

                if (currentItems.has(productId)) {
                    return { success: true, message: "Already in wishlist" };
                }

                // Add to loading state
                loadingItems.add(productId);
                set({ loadingItems });

                // Add optimistically
                currentItems.add(productId);
                set({ items: currentItems });

                if (isAuthenticated) {
                    // Call backend
                    const result = await addToWishlist(productId);

                    // Remove from loading
                    loadingItems.delete(productId);
                    set({ loadingItems });

                    if (!result.success) {
                        // Revert on error
                        currentItems.delete(productId);
                        set({ items: currentItems });
                        return { success: false, error: result.error };
                    }

                    return { success: true, message: result.message };
                } else {
                    // Guest - just use localStorage (handled by persist middleware)
                    loadingItems.delete(productId);
                    set({ loadingItems });
                    return { success: true, message: "Added to wishlist" };
                }
            },

            removeItem: async (productId: string, isAuthenticated: boolean) => {
                const currentItems = new Set(get().items);
                const loadingItems = new Set(get().loadingItems);

                if (!currentItems.has(productId)) {
                    return { success: true, message: "Not in wishlist" };
                }

                // Add to loading state
                loadingItems.add(productId);
                set({ loadingItems });

                // Remove optimistically
                currentItems.delete(productId);
                set({ items: currentItems });

                if (isAuthenticated) {
                    // Call backend
                    const result = await removeFromWishlist(productId);

                    // Remove from loading
                    loadingItems.delete(productId);
                    set({ loadingItems });

                    if (!result.success) {
                        // Revert on error
                        currentItems.add(productId);
                        set({ items: currentItems });
                        return { success: false, error: result.error };
                    }

                    return { success: true, message: result.message };
                } else {
                    // Guest - just use localStorage
                    loadingItems.delete(productId);
                    set({ loadingItems });
                    return { success: true, message: "Removed from wishlist" };
                }
            },

            toggleItem: async (productId: string, isAuthenticated: boolean) => {
                const hasItem = get().items.has(productId);

                if (hasItem) {
                    return await get().removeItem(productId, isAuthenticated);
                } else {
                    return await get().addItem(productId, isAuthenticated);
                }
            },

            hasItem: (productId: string) => {
                return get().items.has(productId);
            },

            setItems: (items: Set<string>) => {
                set({ items });
            },

            syncWithBackend: (productIds: string[]) => {
                // Replace current items with backend data
                set({ items: new Set(productIds) });
            },

            clearGuestWishlist: () => {
                set({ items: new Set() });
            },
        }),
        {
            name: "wishlist-storage",
            // Only persist for guests (authenticated users use backend)
            partialize: (state) => ({ items: Array.from(state.items) }),
            // Custom serialization for Set
            storage: {
                getItem: (name) => {
                    const str = localStorage.getItem(name);
                    if (!str) return null;
                    const { state } = JSON.parse(str);
                    return {
                        state: {
                            ...state,
                            items: new Set(state.items || []),
                        },
                    };
                },
                setItem: (name, value) => {
                    const str = JSON.stringify({
                        state: {
                            ...value.state,
                            items: Array.from(value.state.items),
                        },
                    });
                    localStorage.setItem(name, str);
                },
                removeItem: (name) => localStorage.removeItem(name),
            },
        }
    )
);
