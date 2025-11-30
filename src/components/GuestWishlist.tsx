"use client";

import Link from "next/link";
import { useWishlistStore } from "@/store/wishlist";
import { Heart, ShoppingBag, LogIn } from "lucide-react";
import { useEffect, useState } from "react";

export default function GuestWishlist() {
    const { items } = useWishlistStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <main className="min-h-screen bg-[--color-dark-950] pb-20 relative">
                <div className="absolute inset-0 bg-[url('/images/grid.png')] opacity-5 pointer-events-none fixed" />
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 pt-8">
                    <div className="glass-panel-rpg rounded-xl p-12 text-center">
                        <p className="text-[--color-light-300]">Loading...</p>
                    </div>
                </div>
            </main>
        );
    }

    const wishlistCount = items.size;

    return (
        <main className="min-h-screen bg-[--color-dark-950] pb-20 relative">
            {/* Background Texture */}
            <div className="absolute inset-0 bg-[url('/images/grid.png')] opacity-5 pointer-events-none fixed" />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 pt-8">
                {/* Header */}
                <header className="mb-12">
                    <h1 className="font-rajdhani text-4xl sm:text-5xl font-bold text-white uppercase tracking-wide text-glow-purple">
                        My Wishlist
                    </h1>
                    <p className="mt-2 text-[--color-light-300]">
                        {wishlistCount} {wishlistCount === 1 ? "item" : "items"} saved
                    </p>
                </header>

                {/* Sign In Prompt */}
                {wishlistCount > 0 && (
                    <div className="glass-panel-rpg rounded-xl p-6 mb-8 border-2 border-[--color-neon-purple]">
                        <div className="flex items-start gap-4">
                            <LogIn className="h-6 w-6 text-[--color-neon-purple] flex-shrink-0 mt-1" />
                            <div className="flex-1">
                                <h3 className="font-rajdhani text-xl font-bold text-white uppercase tracking-wider mb-2">
                                    Sign in to save your wishlist
                                </h3>
                                <p className="text-[--color-light-300] mb-4">
                                    Your wishlist is currently saved locally. Sign in to access it from any device and never lose your favorite items.
                                </p>
                                <Link
                                    href="/sign-in?redirect=/profile"
                                    className="inline-flex items-center gap-2 rounded-sm bg-[--color-neon-purple] px-6 py-3 font-bold text-white uppercase tracking-wider transition-all hover:bg-[--color-neon-blue] hover:shadow-[0_0_20px_rgba(0,243,255,0.4)]"
                                >
                                    <LogIn className="h-5 w-5" />
                                    Sign In
                                </Link>
                            </div>
                        </div>
                    </div>
                )}

                {/* Wishlist Items */}
                {wishlistCount === 0 ? (
                    <div className="glass-panel-rpg rounded-xl p-12 text-center">
                        <Heart className="h-16 w-16 text-[--color-dark-700] mx-auto mb-4" />
                        <h3 className="font-rajdhani text-2xl font-bold text-white uppercase tracking-wider mb-2">
                            Your wishlist is empty
                        </h3>
                        <p className="text-[--color-light-300] mb-6">
                            Start adding products you love to your wishlist
                        </p>
                        <Link
                            href="/products"
                            className="inline-flex items-center gap-2 rounded-sm bg-[--color-neon-purple] px-6 py-3 font-bold text-white uppercase tracking-wider transition-all hover:bg-[--color-neon-blue] hover:shadow-[0_0_20px_rgba(0,243,255,0.4)]"
                        >
                            <ShoppingBag className="h-5 w-5" />
                            Browse Products
                        </Link>
                    </div>
                ) : (
                    <div className="glass-panel-rpg rounded-xl p-6">
                        <p className="text-[--color-light-300] mb-4">
                            You have <span className="text-[--color-neon-purple] font-bold">{wishlistCount}</span> {wishlistCount === 1 ? "item" : "items"} in your wishlist.
                        </p>
                        <p className="text-sm text-[--color-dark-500]">
                            Sign in to view your wishlist items and manage them across all your devices.
                        </p>
                    </div>
                )}

                {/* Quick Actions */}
                <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
                    <Link
                        href="/products"
                        className="glass-panel-rpg rounded-xl p-6 transition-all hover:border-[--color-neon-blue] group"
                    >
                        <ShoppingBag className="h-8 w-8 text-[--color-neon-blue] mb-3 group-hover:scale-110 transition-transform" />
                        <h3 className="font-rajdhani text-xl font-bold text-white uppercase tracking-wider mb-2">
                            Continue Shopping
                        </h3>
                        <p className="text-sm text-[--color-light-300]">
                            Discover more amazing products
                        </p>
                    </Link>

                    <Link
                        href="/cart"
                        className="glass-panel-rpg rounded-xl p-6 transition-all hover:border-[--color-neon-purple] group"
                    >
                        <ShoppingBag className="h-8 w-8 text-[--color-neon-purple] mb-3 group-hover:scale-110 transition-transform" />
                        <h3 className="font-rajdhani text-xl font-bold text-white uppercase tracking-wider mb-2">
                            View Cart
                        </h3>
                        <p className="text-sm text-[--color-light-300]">
                            Check out your cart items
                        </p>
                    </Link>
                </section>
            </div>
        </main>
    );
}
