import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/server';
import { createOrderFromCheckout } from '@/lib/actions/order';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
        return NextResponse.json(
            { error: 'Missing stripe-signature header' },
            { status: 400 }
        );
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
        console.error('STRIPE_WEBHOOK_SECRET is not configured');
        return NextResponse.json(
            { error: 'Webhook secret not configured' },
            { status: 500 }
        );
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
        console.error('Webhook signature verification failed:', err);
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

                console.log('Checkout session completed:', session.id);

                // Extract metadata
                const userId = session.metadata?.userId;
                const cartId = session.metadata?.cartId;

                if (!userId || !cartId) {
                    console.error('Missing metadata in checkout session:', session.id);
                    return NextResponse.json(
                        { error: 'Missing required metadata' },
                        { status: 400 }
                    );
                }

                // Get the total amount from the session
                const totalAmount = session.amount_total ? session.amount_total / 100 : 0;

                // Create order in database
                const result = await createOrderFromCheckout(
                    userId,
                    cartId,
                    totalAmount,
                    session.id
                );

                if (!result.success) {
                    console.error('Failed to create order:', result.error);
                    return NextResponse.json(
                        { error: 'Failed to create order' },
                        { status: 500 }
                    );
                }

                console.log('Order created successfully:', result.orderId);
                break;
            }

            case 'payment_intent.payment_failed': {
                const paymentIntent = event.data.object as Stripe.PaymentIntent;
                console.error('Payment failed:', paymentIntent.id, paymentIntent.last_payment_error);
                // You could send an email notification here or log to a monitoring service
                break;
            }

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error('Error processing webhook:', error);
        return NextResponse.json(
            { error: 'Webhook processing failed' },
            { status: 500 }
        );
    }
}
