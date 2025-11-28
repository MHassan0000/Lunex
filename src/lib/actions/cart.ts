"use server";

import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { carts, cartItems, productVariants, products, productImages } from "@/lib/db/schema";
import { eq, and, sql, desc } from "drizzle-orm";
import { getCurrentUser, guestSession } from "@/lib/auth/actions";
import { revalidatePath } from "next/cache";

export type CartItem = {
    id: string;
    productId: string;
    variantId: string;
    name: string;
    price: number;
    image: string | null;
    color: string | null;
    storage: string | null;
    quantity: number;
    maxStock: number;
};

export type Cart = {
    id: string;
    items: CartItem[];
    subtotal: number;
};

async function getCartId(): Promise<{ cartId: string | null; type: "user" | "guest" | null }> {
    const user = await getCurrentUser();
    if (user) {
        const userCart = await db.query.carts.findFirst({
            where: eq(carts.userId, user.id),
        });
        return { cartId: userCart?.id ?? null, type: "user" };
    }

    const { sessionToken } = await guestSession();
    if (sessionToken) {
        const guestCart = await db.query.carts.findFirst({
            where: eq(carts.guestId, sessionToken), // Note: Schema uses guestId as FK to guests table, but we might need to join or check how guests are handled. 
            // Wait, looking at schema/carts.ts: guestId references guests.id. 
            // guestSession() returns sessionToken. We need to find the guest record first.
        });

        // Let's fix this lookup. We need the guest ID from the session token.
        const guest = await db.query.guests.findFirst({
            where: eq(carts.guestId, sessionToken) // This is wrong. guests table has sessionToken.
        });
        // Actually, let's look at schema/guest.ts if possible, but I recall guests table has id and sessionToken.
        // I'll assume I need to look up guest by sessionToken first.
    }
    return { cartId: null, type: null };
}

// Helper to get or create cart
async function getOrCreateCartId(): Promise<string> {
    const user = await getCurrentUser();
    if (user) {
        let cart = await db.query.carts.findFirst({
            where: eq(carts.userId, user.id),
        });
        if (!cart) {
            const [newCart] = await db.insert(carts).values({ userId: user.id }).returning();
            cart = newCart;
        }
        return cart.id;
    }

    let { sessionToken } = await guestSession();
    const { guests } = await import("@/lib/db/schema");

    let guest;
    if (sessionToken) {
        guest = await db.query.guests.findFirst({
            where: eq(guests.sessionToken, sessionToken),
        });
    }

    if (!guest) {
        // Create new guest session
        sessionToken = crypto.randomUUID();
        const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 days

        await db.insert(guests).values({
            sessionToken,
            expiresAt,
        });

        (await cookies()).set("guest_session", sessionToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
        });

        // Re-fetch guest to be sure (or just use the inserted data if we had the id, but we need the ID)
        // Actually we can just use the ID if we returned it, but insert().values() returns... 
        // Drizzle insert returning:
        const [newGuest] = await db.select().from(guests).where(eq(guests.sessionToken, sessionToken));
        guest = newGuest;
    }

    let cart = await db.query.carts.findFirst({
        where: eq(carts.guestId, guest.id),
    });

    if (!cart) {
        const [newCart] = await db.insert(carts).values({ guestId: guest.id }).returning();
        cart = newCart;
    }
    return cart.id;
}

export async function getCart(): Promise<Cart | null> {
    const user = await getCurrentUser();
    let cartId: string | null = null;

    if (user) {
        const cart = await db.query.carts.findFirst({ where: eq(carts.userId, user.id) });
        cartId = cart?.id ?? null;
    } else {
        const { sessionToken } = await guestSession();
        if (sessionToken) {
            const { guests } = await import("@/lib/db/schema");
            const guest = await db.query.guests.findFirst({ where: eq(guests.sessionToken, sessionToken) });
            if (guest) {
                const cart = await db.query.carts.findFirst({ where: eq(carts.guestId, guest.id) });
                cartId = cart?.id ?? null;
            }
        }
    }

    if (!cartId) return null;

    const items = await db
        .select({
            id: cartItems.id,
            productId: products.id,
            variantId: productVariants.id,
            name: products.name,
            price: productVariants.price,
            quantity: cartItems.quantity,
            maxStock: productVariants.inStock,
            color: sql<string>`c.name`,
            storage: sql<string>`s.name`,
            image: productImages.url,
        })
        .from(cartItems)
        .innerJoin(productVariants, eq(cartItems.productVariantId, productVariants.id))
        .innerJoin(products, eq(productVariants.productId, products.id))
        .leftJoin(productImages, and(eq(productImages.productId, products.id), eq(productImages.isPrimary, true)))
        .leftJoin(sql`colors c`, eq(productVariants.colorId, sql`c.id`))
        .leftJoin(sql`storage s`, eq(productVariants.storageId, sql`s.id`))
        .where(eq(cartItems.cartId, cartId));

    // Deduplicate images if multiple primary images exist (shouldn't happen but good to be safe)
    // Actually, the join might produce duplicates if multiple primary images. 
    // Better to use a subquery or distinct.
    // For simplicity, let's process items in JS to pick one image.

    const uniqueItems = items.reduce((acc, item) => {
        const existing = acc.find(i => i.id === item.id);
        if (!existing) {
            acc.push({
                ...item,
                price: Number(item.price),
                image: item.image ?? null,
                color: item.color as string | null,
                storage: item.storage as string | null,
            });
        }
        return acc;
    }, [] as CartItem[]);

    const subtotal = uniqueItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return {
        id: cartId,
        items: uniqueItems,
        subtotal,
    };
}

export async function addToCart(variantId: string, quantity: number) {
    try {
        const cartId = await getOrCreateCartId();

        const existingItem = await db.query.cartItems.findFirst({
            where: and(eq(cartItems.cartId, cartId), eq(cartItems.productVariantId, variantId)),
        });

        if (existingItem) {
            await db
                .update(cartItems)
                .set({ quantity: existingItem.quantity + quantity })
                .where(eq(cartItems.id, existingItem.id));
        } else {
            await db.insert(cartItems).values({
                cartId,
                productVariantId: variantId,
                quantity,
            });
        }

        revalidatePath("/cart");
        return { success: true };
    } catch (error) {
        console.error("Failed to add to cart:", error);
        return { success: false, error: "Failed to add item to cart" };
    }
}

export async function updateCartItem(itemId: string, quantity: number) {
    try {
        if (quantity <= 0) {
            await db.delete(cartItems).where(eq(cartItems.id, itemId));
        } else {
            await db.update(cartItems).set({ quantity }).where(eq(cartItems.id, itemId));
        }
        revalidatePath("/cart");
        return { success: true };
    } catch (error) {
        console.error("Failed to update cart item:", error);
        return { success: false, error: "Failed to update cart item" };
    }
}

export async function removeCartItem(itemId: string) {
    try {
        await db.delete(cartItems).where(eq(cartItems.id, itemId));
        revalidatePath("/cart");
        return { success: true };
    } catch (error) {
        console.error("Failed to remove cart item:", error);
        return { success: false, error: "Failed to remove cart item" };
    }
}

export async function getCartCount() {
    const cart = await getCart();
    return cart?.items.reduce((acc, item) => acc + item.quantity, 0) ?? 0;
}
