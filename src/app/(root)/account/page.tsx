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
        </main >
    );
}
