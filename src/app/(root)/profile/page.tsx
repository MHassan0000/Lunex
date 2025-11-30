import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/actions";
import { getWishlist } from "@/lib/actions/wishlist";
import { Card } from "@/components";
import { Heart, ShoppingBag } from "lucide-react";
import RemoveFromWishlistButton from "@/components/RemoveFromWishlistButton";
import GuestWishlist from "@/components/GuestWishlist";

export default async function ProfilePage() {
    const user = await getCurrentUser();

    // Show guest wishlist for non-authenticated users
    if (!user) {
        return <GuestWishlist />;
    }

    const { items } = await getWishlist();

    return (
        <main className="min-h-screen bg-[--color-dark-950] pb-20 relative">
            {/* Background Texture */}
            <div className="absolute inset-0 bg-[url('/images/grid.png')] opacity-5 pointer-events-none fixed" />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 pt-8">
                {/* Header */}
                <header className="mb-12">
                    <h1 className="font-rajdhani text-4xl sm:text-5xl font-bold text-white uppercase tracking-wide text-glow-purple">
                        My Profile
                    </h1>
                    <p className="mt-2 text-[--color-light-300]">Welcome back, {user.name || user.email}</p>
                </header>

                {/* Wishlist Section */}
                <section className="mb-16">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="font-rajdhani text-3xl font-bold text-white uppercase tracking-wider flex items-center gap-3">
                            <Heart className="h-8 w-8 text-[--color-neon-purple]" />
                            My Wishlist
                        </h2>
                        <span className="text-sm text-[--color-dark-500] font-mono">
                            {items.length} {items.length === 1 ? "item" : "items"}
                        </span>
                    </div>

                    {items.length === 0 ? (
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
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {items.map((item) => (
                                <div key={item.id} className="relative group">
                                    <Card
                                        title={item.productName}
                                        imageSrc={item.productImage || "/products/laptops/laptop1.png"}
                                        price={item.price ?? undefined}
                                        href={`/products/${item.productId}`}
                                        className="h-full"
                                    />
                                    <div className="absolute top-3 right-3 z-10">
                                        <RemoveFromWishlistButton productId={item.productId} />
                                    </div>
                                    <p className="mt-2 text-xs text-[--color-dark-500] font-mono">
                                        Added {new Date(item.addedAt).toLocaleDateString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Quick Actions */}
                <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
