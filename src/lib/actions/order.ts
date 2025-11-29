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
