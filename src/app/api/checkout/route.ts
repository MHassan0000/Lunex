import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/server';
import { getCurrentUser } from '@/lib/auth/actions';
import { getCart } from '@/lib/actions/cart';
import Stripe from 'stripe';

export async function POST(_req: NextRequest) {
    try {
        // Check authentication
        const user = await getCurrentUser();
        if (!user) {
            console.error('[Checkout] Unauthenticated checkout attempt');
            return NextResponse.json(
                { error: 'Authentication required. Please sign in to checkout.' },
                { status: 401 }
            );
        }

        console.log('[Checkout] Processing checkout for user:', user.id);

        // Get cart
        const cart = await getCart();
        if (!cart || cart.items.length === 0) {
            console.error('[Checkout] Empty cart for user:', user.id);
            return NextResponse.json(
                { error: 'Your cart is empty' },
                { status: 400 }
            );
        }

        console.log('[Checkout] Cart retrieved:', {
            cartId: cart.id,
            itemCount: cart.items.length,
            subtotal: cart.subtotal,
        });

        // Calculate totals
        const subtotal = cart.subtotal;
        const shipping = subtotal > 100 ? 0 : 15;


        // Create line items for Stripe
        const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = cart.items.map((item) => {
            // Only include images if they are absolute URLs (start with http:// or https://)
            const images = item.image && (item.image.startsWith('http://') || item.image.startsWith('https://'))
                ? [item.image]
                : [];

            return {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item.name,
                        description: [item.color, item.storage].filter(Boolean).join(' - '),
                        images,
                    },
                    unit_amount: Math.round(item.price * 100), // Convert to cents
                },
                quantity: item.quantity,
            };
        });

        // Add shipping as a line item if applicable
        if (shipping > 0) {
            lineItems.push({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'Shipping',
                        description: 'Standard shipping',
                    },
                    unit_amount: Math.round(shipping * 100),
                },
                quantity: 1,
            });
        }

        // Create Stripe checkout session
        console.log('[Checkout] Creating Stripe session with metadata:', {
            userId: user.id,
            cartId: cart.id,
        });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout/cancel`,
            metadata: {
                userId: user.id,
                cartId: cart.id,
            },
            customer_email: user.email,
        });

        console.log('[Checkout] Stripe session created:', session.id);
        return NextResponse.json({ sessionId: session.id, url: session.url });
    } catch (error) {
        console.error('[Checkout] Error:', {
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
        });
        return NextResponse.json(
            { error: 'Failed to create checkout session' },
            { status: 500 }
        );
    }
}
