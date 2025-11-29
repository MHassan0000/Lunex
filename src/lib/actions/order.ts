"use server";

import { db } from "@/lib/db";
import { orders, orderItems, payments, cartItems, productVariants } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth/actions";
import { revalidatePath } from "next/cache";

export type OrderWithDetails = {
    id: string;
    status: string;
    totalAmount: number;
    createdAt: Date;
    items: Array<{
        id: string;
        productVariantId: string;
        quantity: number;
        priceAtPurchase: number;
    }>;
    payment?: {
        id: string;
        method: string;
        status: string;
        transactionId: string | null;
        paidAt: Date | null;
    };
};

export async function createOrderFromCheckout(
    userId: string,
    cartId: string,
    totalAmount: number,
    stripeSessionId: string
) {
    try {
        // Get cart items first (outside transaction to validate)
        const items = await db.query.cartItems.findMany({
            where: eq(cartItems.cartId, cartId),
            with: {
                variant: true,
            },
        });

        if (items.length === 0) {
            console.error('Cart is empty for cartId:', cartId);
            return { success: false, error: "Cart is empty" };
        }

        // Validate stock availability before creating order
        for (const item of items) {
            if (item.variant.inStock < item.quantity) {
                console.error(`Insufficient stock for variant ${item.productVariantId}: requested ${item.quantity}, available ${item.variant.inStock}`);
                return {
                    success: false,
                    error: `Insufficient stock for ${item.variant.sku}. Only ${item.variant.inStock} available.`
                };
            }
        }

        // Use transaction to ensure atomicity
        const result = await db.transaction(async (tx) => {
            // Create order
            const [order] = await tx
                .insert(orders)
                .values({
                    userId,
                    status: "paid",
                    totalAmount: totalAmount.toString(),
                })
                .returning();

            // Create order items with price snapshots
            const orderItemsData = items.map((item) => ({
                orderId: order.id,
                productVariantId: item.productVariantId,
                quantity: item.quantity,
                priceAtPurchase: item.variant.price,
            }));

            await tx.insert(orderItems).values(orderItemsData);

            // Create payment record
            await tx.insert(payments).values({
                orderId: order.id,
                method: "stripe",
                status: "completed",
                transactionId: stripeSessionId,
                paidAt: new Date(),
            });

            // Update product variant stock levels
            for (const item of items) {
                const newStock = item.variant.inStock - item.quantity;
                if (newStock < 0) {
                    throw new Error(`Stock would go negative for variant ${item.productVariantId}`);
                }

                await tx
                    .update(productVariants)
                    .set({
                        inStock: newStock,
                    })
                    .where(eq(productVariants.id, item.productVariantId));
            }

            // Clear cart items
            await tx.delete(cartItems).where(eq(cartItems.cartId, cartId));

            return order.id;
        });

        revalidatePath("/cart");
        revalidatePath("/account");
        revalidatePath("/orders");

        console.log('Order created successfully:', result);
        return { success: true, orderId: result };
    } catch (error) {
        console.error("Failed to create order:", error);
        return { success: false, error: error instanceof Error ? error.message : "Failed to create order" };
    }
}

export async function getOrderById(orderId: string): Promise<OrderWithDetails | null> {
    try {
        const user = await getCurrentUser();
        if (!user) return null;

        const order = await db.query.orders.findFirst({
            where: and(eq(orders.id, orderId), eq(orders.userId, user.id)),
            with: {
                items: true,
            },
        });

        if (!order) return null;

        const payment = await db.query.payments.findFirst({
            where: eq(payments.orderId, orderId),
        });

        return {
            id: order.id,
            status: order.status,
            totalAmount: Number(order.totalAmount),
            createdAt: order.createdAt,
            items: order.items.map((item) => ({
                id: item.id,
                productVariantId: item.productVariantId,
                quantity: item.quantity,
                priceAtPurchase: Number(item.priceAtPurchase),
            })),
            payment: payment
                ? {
                    id: payment.id,
                    method: payment.method,
                    status: payment.status,
                    transactionId: payment.transactionId,
                    paidAt: payment.paidAt,
                }
                : undefined,
        };
    } catch (error) {
        console.error("Failed to get order:", error);
        return null;
    }
}

export async function getUserOrders() {
    try {
        const user = await getCurrentUser();
        if (!user) return [];

        const userOrders = await db.query.orders.findMany({
            where: eq(orders.userId, user.id),
            orderBy: [desc(orders.createdAt)],
            with: {
                items: true,
            },
        });

        return userOrders.map((order) => ({
            id: order.id,
            status: order.status,
            totalAmount: Number(order.totalAmount),
            createdAt: order.createdAt,
            itemCount: order.items.length,
        }));
    } catch (error) {
        console.error("Failed to get user orders:", error);
        return [];
    }
}
