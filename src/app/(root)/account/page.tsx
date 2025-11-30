import { getCurrentUser } from "@/lib/auth/actions";
import { db } from "@/lib/db";
import { orders, orderItems, productVariants, products, productImages } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Package, MapPin, CreditCard } from "lucide-react";
import { SignOutButton } from "@/components/SignOutButton";
import DarkVeil from "@/components/DarkVeil";

export default async function AccountPage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/sign-in");
    }

    const userOrders = await db
        .select({
            id: orders.id,
            status: orders.status,
            totalAmount: orders.totalAmount,
            createdAt: orders.createdAt,
        })
        .from(orders)
        .where(eq(orders.userId, user.id))
        .orderBy(desc(orders.createdAt));

    // Fetch items for each order (could be optimized with a single query and grouping, but this is simple for now)
    const ordersWithItems = await Promise.all(
        userOrders.map(async (order) => {
            const items = await db
                .select({
                    id: orderItems.id,
                    name: products.name,
                    quantity: orderItems.quantity,
                    price: orderItems.priceAtPurchase,
                    image: productImages.url,
                })
                .from(orderItems)
                .innerJoin(productVariants, eq(orderItems.productVariantId, productVariants.id))
                .innerJoin(products, eq(productVariants.productId, products.id))
                .leftJoin(productImages, eq(productImages.productId, products.id)) // Simplified image fetch
                .where(eq(orderItems.orderId, order.id));

            // Deduplicate items if multiple images cause rows (simplified)
            const uniqueItems = items.reduce((acc, item) => {
                if (!acc.find(i => i.id === item.id)) {
                    acc.push(item);
                }
                return acc;
            }, [] as typeof items);

            return { ...order, items: uniqueItems };
        })
    );

    return (
        <main className="min-h-screen pt-20 pb-20 animate-fade-in relative">
            <div className="fixed inset-0 z-0">
                <DarkVeil />
            </div>
            {/* Background Texture */}
            <div className="absolute inset-0 bg-[url('/images/grid.png')] opacity-5 pointer-events-none fixed" />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-[300px_1fr]">
                    {/* Sidebar / Profile Info */}
                    <aside className="space-y-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
                        <div className="glass-panel-rpg p-6 text-center">
                            <div className="mx-auto mb-6 h-24 w-24 overflow-hidden rounded-full border-2 border-[--color-neon-blue] shadow-[0_0_20px_rgba(0,243,255,0.3)]">
                                {user.image ? (
                                    <Image src={user.image} alt={user.name} width={96} height={96} className="h-full w-full object-cover" />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-[--color-dark-800] text-3xl font-bold text-[--color-neon-blue] font-rajdhani">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <h1 className="font-rajdhani text-2xl font-bold text-white uppercase tracking-wider text-glow-purple">{user.name}</h1>
                            <p className="text-sm text-[--color-light-300] font-mono mt-1">{user.email}</p>

                            <div className="mt-8">
                                <SignOutButton />
                            </div>
                        </div>

                        <nav className="glass-panel-rpg p-4">
                            <ul className="space-y-2">
                                <li>
                                    <Link href="/account" className="flex items-center gap-3 rounded-sm bg-[--color-neon-blue]/10 border border-[--color-neon-blue]/30 px-4 py-3 text-[--color-neon-blue] transition-all hover:bg-[--color-neon-blue]/20 hover:shadow-[0_0_10px_rgba(0,243,255,0.2)]">
                                        <Package className="h-5 w-5" />
                                        <span className="font-bold uppercase tracking-wider text-sm">Orders</span>
                                    </Link>
                                </li>
                                <li>
                                    <button className="flex w-full items-center gap-3 rounded-sm border border-transparent px-4 py-3 text-[--color-light-300] hover:border-[--color-dark-700] hover:bg-[--color-dark-800] hover:text-white transition-all">
                                        <MapPin className="h-5 w-5" />
                                        <span className="font-bold uppercase tracking-wider text-sm">Addresses</span>
                                    </button>
                                </li>
                                <li>
                                    <button className="flex w-full items-center gap-3 rounded-sm border border-transparent px-4 py-3 text-[--color-light-300] hover:border-[--color-dark-700] hover:bg-[--color-dark-800] hover:text-white transition-all">
                                        <CreditCard className="h-5 w-5" />
                                        <span className="font-bold uppercase tracking-wider text-sm">Payment Methods</span>
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </aside>

                    {/* Main Content / Orders */}
                    <div className="space-y-6 animate-slide-in-right" style={{ animationDelay: "0.2s" }}>
                        <h2 className="font-rajdhani text-3xl font-bold text-white uppercase tracking-wider border-b border-[--color-dark-700] pb-4">Order History</h2>

                        {ordersWithItems.length === 0 ? (
                            <div className="glass-panel-rpg p-12 text-center">
                                <Package className="mx-auto h-16 w-16 text-[--color-dark-500] opacity-50" />
                                <h3 className="mt-6 text-xl font-bold text-white uppercase tracking-wider">No orders yet</h3>
                                <p className="mt-2 text-[--color-light-300]">When you acquire gear, it will be logged here.</p>
                                <Link href="/products" className="mt-8 inline-block rounded-sm bg-[--color-neon-blue] px-8 py-3 font-rajdhani font-bold text-black uppercase tracking-widest transition hover:bg-white hover:shadow-[0_0_20px_rgba(0,243,255,0.6)]">
                                    Start Shopping
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {ordersWithItems.map((order, index) => (
                                    <div
                                        key={order.id}
                                        className="overflow-hidden rounded-sm border border-[--color-dark-700] bg-[--color-dark-800]/50 hover:border-[--color-neon-blue]/50 transition-all duration-300 animate-slide-up group"
                                        style={{ animationDelay: `${0.3 + index * 0.1}s`, animationFillMode: 'both' }}
                                    >
                                        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[--color-dark-700] bg-[--color-dark-900]/80 p-4">
                                            <div className="flex flex-wrap gap-8 text-sm">
                                                <div>
                                                    <p className="text-[--color-dark-500] text-xs uppercase tracking-wider font-bold">Order Placed</p>
                                                    <p className="font-mono text-[--color-light-300] mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[--color-dark-500] text-xs uppercase tracking-wider font-bold">Total</p>
                                                    <p className="font-mono text-[--color-neon-blue] mt-1 text-glow-blue">${order.totalAmount}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[--color-dark-500] text-xs uppercase tracking-wider font-bold">Order ID</p>
                                                    <p className="font-mono text-[--color-light-300] mt-1">#{order.id.slice(0, 8)}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className={`rounded-sm px-3 py-1 text-xs font-bold uppercase tracking-wider border ${order.status === 'delivered' ? 'bg-green-500/10 text-green-500 border-green-500/30' :
                                                    order.status === 'shipped' ? 'bg-blue-500/10 text-blue-500 border-blue-500/30' :
                                                        'bg-yellow-500/10 text-yellow-500 border-yellow-500/30'
                                                    }`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <ul className="divide-y divide-[--color-dark-700]">
                                                {order.items.map((item) => (
                                                    <li key={item.id} className="flex gap-6 py-6 first:pt-0 last:pb-0">
                                                        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-sm border border-[--color-dark-700] bg-[--color-dark-900]">
                                                            {item.image && (
                                                                <Image src={item.image} alt={item.name} width={80} height={80} className="h-full w-full object-cover" />
                                                            )}
                                                        </div>
                                                        <div className="flex flex-1 flex-col justify-between sm:flex-row sm:items-center">
                                                            <div>
                                                                <h4 className="font-rajdhani text-lg font-bold text-white uppercase tracking-wide group-hover:text-[--color-neon-blue] transition-colors">{item.name}</h4>
                                                                <p className="mt-1 text-xs font-bold uppercase tracking-wider text-[--color-dark-500]">Qty: <span className="text-[--color-light-300] font-mono">{item.quantity}</span></p>
                                                            </div>
                                                            <p className="font-mono text-lg text-[--color-light-300] mt-2 sm:mt-0">${item.price}</p>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
