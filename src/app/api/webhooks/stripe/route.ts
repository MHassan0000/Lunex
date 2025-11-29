import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/server';
import { createOrderFromCheckout } from '@/lib/actions/order';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    console.log('[Webhook] Received Stripe webhook request');

    if (!signature) {
        console.error('[Webhook] Missing stripe-signature header');
        return NextResponse.json(
            { error: 'Missing stripe-signature header' },
            { status: 400 }
        );
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
        console.error('[Webhook] STRIPE_WEBHOOK_SECRET is not configured');
        return NextResponse.json(
            { error: 'Webhook secret not configured' },
            { status: 500 }
        );
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
        console.log('[Webhook] Successfully verified signature for event:', event.type);
    } catch (err) {
        console.error('[Webhook] Signature verification failed:', err);
        return NextResponse.json(
            { error: 'Invalid signature' },
            { status: 400 }
        );
    }

    // Handle the event
    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session;

                console.log('[Webhook] Processing checkout.session.completed:', {
                    sessionId: session.id,
                    paymentStatus: session.payment_status,
                    metadata: session.metadata,
                });

                // Extract metadata
                const userId = session.metadata?.userId;
                const cartId = session.metadata?.cartId;

                if (!userId || !cartId) {
                    console.error('[Webhook] Missing metadata:', {
                        sessionId: session.id,
                        userId,
                        cartId,
                        allMetadata: session.metadata,
                    });
                    return NextResponse.json(
                        { error: 'Missing required metadata (userId or cartId)' },
                        { status: 400 }
                    );
                }

                // Get the total amount from the session
                const totalAmount = session.amount_total ? session.amount_total / 100 : 0;

                console.log('[Webhook] Creating order:', {
                    userId,
                    cartId,
                    totalAmount,
                    sessionId: session.id,
                });

                // Create order in database
                const result = await createOrderFromCheckout(
                    userId,
                    cartId,
                    totalAmount,
                    session.id
                );

                if (!result.success) {
                    console.error('[Webhook] Failed to create order:', {
                        error: result.error,
                        userId,
                        cartId,
                        sessionId: session.id,
                    });
                    return NextResponse.json(
                        { error: 'Failed to create order', details: result.error },
                        { status: 500 }
                    );
                }

                console.log('[Webhook] Order created successfully:', {
                    orderId: result.orderId,
                    sessionId: session.id,
                });
                break;
            }

            case 'payment_intent.payment_failed': {
                const paymentIntent = event.data.object as Stripe.PaymentIntent;
                console.error('[Webhook] Payment failed:', {
                    paymentIntentId: paymentIntent.id,
                    error: paymentIntent.last_payment_error,
                    metadata: paymentIntent.metadata,
                });
                break;
            }

            default:
                console.log(`[Webhook] Unhandled event type: ${event.type}`);
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error('[Webhook] Error processing webhook:', {
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
            eventType: event.type,
        });
        return NextResponse.json(
            { error: 'Webhook processing failed' },
            { status: 500 }
        );
    }
}
