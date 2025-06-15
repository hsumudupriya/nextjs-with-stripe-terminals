// ==============================================================================
// FILE: pages/api/terminal/process-payment.ts
// DESC: Processes the payment on a Stripe Terminal reader.
// ==============================================================================
import type { NextApiRequest, NextApiResponse } from 'next';
import { stripe } from '@/lib/stripe';
import Donation from '@/models/donation';
import { DONATION_STATUS, STRIPE_PAYMENT_INTENT_STATUS } from '@/lib/constants';
import Stripe from 'stripe';
import { DonationStatus } from '@/lib/types';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const { paymentIntentId } = req.body;

    if (!paymentIntentId) {
        return res.status(400).json({ error: 'Missing paymentIntentId' });
    }

    const donation = await Donation.findOne({
        where: { stripePaymentIntentId: paymentIntentId },
    });

    if (!donation) {
        return res.status(400).json({
            error: 'Donation record not found for this payment intent.',
        });
    }

    let amountReceived: number = 0;
    let finalStatus: DonationStatus = DONATION_STATUS.PENDING;
    let stripeSubscriptionId: string | null = null;
    let stripeCustomerId: string | null = null;

    try {
        // Capture the authorized payment to finalize the charge.
        const paymentIntent = await stripe.paymentIntents.capture(
            paymentIntentId
        );
        console.log(
            'Captured Payment Intent:',
            JSON.stringify(paymentIntent, null, 2)
        );

        const isSuccess =
            (paymentIntent.status as string) ===
            STRIPE_PAYMENT_INTENT_STATUS.SUCCEEDED;
        finalStatus = isSuccess
            ? DONATION_STATUS.SUCCEEDED
            : DONATION_STATUS.FAILED;
        amountReceived = paymentIntent.amount_received;

        // If successful and recurring, create the subscription now
        if (isSuccess && donation.isRecurring) {
            const chargeId = paymentIntent.latest_charge as string;
            const charge = await stripe.charges.retrieve(chargeId);
            const reusablePaymentMethodId =
                charge.payment_method_details?.card_present?.generated_card;

            if (!reusablePaymentMethodId) {
                throw new Error(
                    'No reusable payment method found for this charge.'
                );
            }

            // Find or create a Stripe Customer
            const customers = await stripe.customers.list({
                email: donation.email,
                limit: 1,
            });
            let customer: Stripe.Customer;

            if (customers.data.length > 0) {
                customer = customers.data[0];
                // Attach the new payment method to the existing customer
                await stripe.paymentMethods.attach(reusablePaymentMethodId, {
                    customer: customer.id,
                });
                // And set it as the default for invoices
                await stripe.customers.update(customer.id, {
                    invoice_settings: {
                        default_payment_method: reusablePaymentMethodId,
                    },
                });
            } else {
                customer = await stripe.customers.create({
                    email: donation.email,
                    name: donation.fullName,
                    payment_method: reusablePaymentMethodId,
                    invoice_settings: {
                        default_payment_method: reusablePaymentMethodId,
                    },
                });
            }

            stripeCustomerId = customer.id;
            // Calculate the start date for the next billing cycle (one month from now)
            const now = new Date();
            now.setMonth(now.getMonth() + 1);
            const anchorTimestamp = Math.floor(now.getTime() / 1000);

            // Create subscription with ad-hoc price
            const subscription = await stripe.subscriptions.create({
                customer: customer.id,
                items: [
                    {
                        price_data: {
                            currency: 'usd',
                            product: process.env.STRIPE_RECURRING_PRODUCT_ID!,
                            unit_amount: donation.finalAmount,
                            recurring: {
                                interval: 'month',
                            },
                        },
                        quantity: 1,
                    },
                ],
                billing_cycle_anchor: anchorTimestamp,
                proration_behavior: 'none', // Prevents immediate proration charges
            });
            stripeSubscriptionId = subscription.id;
        }

        return res.status(200).json({ status: finalStatus });
    } catch (error) {
        console.error('Error processing the payment:', error);
        const errorMessage =
            error instanceof Error ? error.message : 'Internal server error';

        return res.status(500).json({
            error: errorMessage,
        });
    } finally {
        console.log(
            `Processed donation ${donation.id} with status ${donation.status}`
        );

        await donation.update({
            amountReceived,
            status: finalStatus,
            stripeSubscriptionId,
            stripeCustomerId,
        });
    }
}
