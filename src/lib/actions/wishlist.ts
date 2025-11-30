"use server";

import { headers } from "next/headers";
import { db } from "@/lib/db";
import { wishlists, products, productImages, productVariants } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq, and, desc, isNull, sql } from "drizzle-orm";

export async function addToWishlist(productId: string) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user) {
            return {
                success: false,
                error: "Please sign in to add items to your wishlist"
            };
        }

        // Check if already in wishlist
        const existing = await db.query.wishlists.findFirst({
            where: and(
                eq(wishlists.userId, session.user.id),
                eq(wishlists.productId, productId)
            ),
        });

        if (existing) {
            return {
                success: true,
                message: "Already in wishlist",
                alreadyExists: true
            };
        }

        // Add to wishlist
        await db.insert(wishlists).values({
            userId: session.user.id,
            productId,
        });

        return {
            success: true,
            message: "Added to wishlist"
        };
    } catch (error) {
        console.error("[Wishlist] Add error:", error);
        return {
            success: false,
            error: "Failed to add to wishlist"
        };
    }
}

export async function removeFromWishlist(productId: string) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user) {
            return {
                success: false,
                error: "Please sign in"
            };
        }

        await db
            .delete(wishlists)
            .where(
                and(
                    eq(wishlists.userId, session.user.id),
                    eq(wishlists.productId, productId)
                )
            );

        return {
            success: true,
            message: "Removed from wishlist"
        };
    } catch (error) {
        console.error("[Wishlist] Remove error:", error);
        return {
            success: false,
            error: "Failed to remove from wishlist"
        };
    }
}

export async function isInWishlist(productId: string) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user) {
            return { inWishlist: false };
        }

        const item = await db.query.wishlists.findFirst({
            where: and(
                eq(wishlists.userId, session.user.id),
                eq(wishlists.productId, productId)
            ),
        });

        return { inWishlist: !!item };
    } catch (error) {
        console.error("[Wishlist] Check error:", error);
        return { inWishlist: false };
    }
}

export type WishlistItem = {
    id: string;
    productId: string;
    productName: string;
    productImage: string | null;
    price: number | null;
    addedAt: Date;
};

export async function getWishlist(): Promise<{ items: WishlistItem[] }> {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user) {
            return { items: [] };
        }

        const rows = await db
            .select({
                id: wishlists.id,
                productId: products.id,
                productName: products.name,
                addedAt: wishlists.addedAt,
                price: sql<number | null>`min(${productVariants.price}::numeric)`,
                imageUrl: sql<string | null>`max(case when ${productImages.isPrimary} = true then ${productImages.url} else null end)`,
            })
            .from(wishlists)
            .innerJoin(products, eq(products.id, wishlists.productId))
            .leftJoin(productVariants, eq(productVariants.productId, products.id))
            .leftJoin(
                productImages,
                and(
                    eq(productImages.productId, products.id),
                    isNull(productImages.variantId)
                )
            )
            .where(eq(wishlists.userId, session.user.id))
            .groupBy(wishlists.id, products.id, products.name, wishlists.addedAt)
            .orderBy(desc(wishlists.addedAt));

        const items: WishlistItem[] = rows.map((row) => ({
            id: row.id,
            productId: row.productId,
            productName: row.productName,
            productImage: row.imageUrl,
            price: row.price ? Number(row.price) : null,
            addedAt: row.addedAt,
        }));

        return { items };
    } catch (error) {
        console.error("[Wishlist] Get error:", error);
        return { items: [] };
    }
}

export async function toggleWishlist(productId: string) {
    const { inWishlist } = await isInWishlist(productId);

    if (inWishlist) {
        return await removeFromWishlist(productId);
    } else {
        return await addToWishlist(productId);
    }
}
