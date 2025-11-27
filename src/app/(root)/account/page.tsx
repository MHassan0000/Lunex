import { getCurrentUser } from "@/lib/auth/actions";
import { db } from "@/lib/db";
import { orders, orderItems, productVariants, products, productImages } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Package, Calendar, MapPin, CreditCard } from "lucide-react";
import { SignOutButton } from "@/components/SignOutButton";

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
        <main className="min-h-screen bg-[--color-dark-950] pt-20 pb-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-[300px_1fr]">
                    {/* Sidebar / Profile Info */}
                    <aside className="space-y-6">
                        <div className="rounded-xl border border-[--color-dark-700] bg-[--color-dark-800] p-6 text-center">
                            <div className="mx-auto mb-4 h-24 w-24 overflow-hidden rounded-full border-2 border-[--color-neon-blue]">
                                {user.image ? (
                                    <Image src={user.image} alt={user.name} width={96} height={96} className="h-full w-full object-cover" />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-[--color-dark-700] text-3xl font-bold text-[--color-light-300]">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <h1 className="font-rajdhani text-2xl font-bold text-white">{user.name}</h1>
                            <p className="text-sm text-[--color-dark-500]">{user.email}</p>

                            <div className="mt-6">
                                <SignOutButton />
                            </div>
                        </div>

                        <nav className="rounded-xl border border-[--color-dark-700] bg-[--color-dark-800] p-4">
                            <ul className="space-y-1">
                                <li>
                                    <Link href="/account" className="flex items-center gap-3 rounded-lg bg-[--color-neon-blue]/10 px-4 py-2 text-[--color-neon-blue]">
                                        <Package className="h-5 w-5" />
                                        <span className="font-medium">Orders</span>
                                    </Link>
                                </li>
                                <li>
                                    <button className="flex w-full items-center gap-3 rounded-lg px-4 py-2 text-[--color-light-300] hover:bg-[--color-dark-700] hover:text-white transition">
                                        <MapPin className="h-5 w-5" />
                                        <span className="font-medium">Addresses</span>
                                    </button>
                                </li>
                                <li>
                                    <button className="flex w-full items-center gap-3 rounded-lg px-4 py-2 text-[--color-light-300] hover:bg-[--color-dark-700] hover:text-white transition">
                                        <CreditCard className="h-5 w-5" />
                                        <span className="font-medium">Payment Methods</span>
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </aside>

                    {/* Main Content / Orders */}
                    <div className="space-y-6">
                        <h2 className="font-rajdhani text-3xl font-bold text-white">Order History</h2>

                        {ordersWithItems.length === 0 ? (
                            <div className="rounded-xl border border-[--color-dark-700] bg-[--color-dark-800] p-12 text-center">
                                <Package className="mx-auto h-12 w-12 text-[--color-dark-500]" />
                                <h3 className="mt-4 text-lg font-medium text-white">No orders yet</h3>
                                <p className="mt-2 text-[--color-dark-500]">When you place an order, it will appear here.</p>
                                <Link href="/products" className="mt-6 inline-block rounded-md bg-[--color-neon-blue] px-6 py-2 font-bold text-black hover:bg-white transition">
                                    Start Shopping
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {ordersWithItems.map((order) => (
                                    <div key={order.id} className="overflow-hidden rounded-xl border border-[--color-dark-700] bg-[--color-dark-800]">
                                        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[--color-dark-700] bg-[--color-dark-900]/50 p-4">
                                            <div className="flex flex-wrap gap-6 text-sm">
                                                <div>
                                                    <p className="text-[--color-dark-500]">Order Placed</p>
                                                    <p className="font-medium text-[--color-light-300]">{new Date(order.createdAt).toLocaleDateString()}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[--color-dark-500]">Total</p>
                                                    <p className="font-medium text-[--color-light-300]">${order.totalAmount}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[--color-dark-500]">Order #</p>
                                                    <p className="font-medium text-[--color-light-300]">{order.id.slice(0, 8)}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${order.status === 'delivered' ? 'bg-green-500/10 text-green-500' :
                                                    order.status === 'shipped' ? 'bg-blue-500/10 text-blue-500' :
                                                        'bg-yellow-500/10 text-yellow-500'
                                                    }`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <ul className="divide-y divide-[--color-dark-700]">
                                                {order.items.map((item) => (
                                                    <li key={item.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                                                        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-[--color-dark-700] bg-[--color-dark-900]">
                                                            {item.image && (
                                                                <Image src={item.image} alt={item.name} width={80} height={80} className="h-full w-full object-cover" />
                                                            )}
                                                        </div>
                                                        <div className="flex flex-1 flex-col justify-between sm:flex-row">
                                                            <div>
                                                                <h4 className="font-medium text-white">{item.name}</h4>
                                                                <p className="mt-1 text-sm text-[--color-dark-500]">Qty: {item.quantity}</p>
                                                            </div>
                                                            <p className="font-medium text-[--color-light-300]">${item.price}</p>
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
