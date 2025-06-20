// ==============================================================================
// FILE: pages/api/donations/index.ts
// DESC: API route to handle creating a new donation record.
// ==============================================================================

import type { NextApiRequest, NextApiResponse } from 'next';
import Donation from '@/models/donation';
import {
    PAYMENT_FEE_RATE,
    DONATION_STATUS,
    STRIPE_PAYMENT_INTENT_STATUS,
} from '@/lib/constants';
import { stripe } from '@/lib/stripe';
import Stripe from 'stripe';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        const {
            id,
            firstName,
            lastName,
            email,
            newsletter,
            amount,
            isRecurring,
            coverFee,
            stripePaymentIntentId,
        } = req.body;

        if (!firstName || !lastName || !email || !amount) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Calculate final amount in cents
        // If coverFee is true, add 6% to the base amount
        // Otherwise, just use the base amount
        const baseAmountInCents = Math.round(amount * 100);
        const feeAmountInCents = coverFee
            ? Math.round(baseAmountInCents * PAYMENT_FEE_RATE)
            : 0;
        const finalAmountInCents = coverFee
            ? baseAmountInCents + feeAmountInCents
            : baseAmountInCents;
        let paymentIntent: Stripe.PaymentIntent | null = null;
        // For recurring payments, we need to save the payment method for future use.
        const setupFutureUsage = isRecurring ? 'off_session' : undefined;
        let donation: Donation | null = null;

        if (stripePaymentIntentId) {
            paymentIntent = await stripe.paymentIntents.retrieve(
                stripePaymentIntentId
            );
        }

        if (
            !stripePaymentIntentId ||
            paymentIntent?.status === STRIPE_PAYMENT_INTENT_STATUS.CANCELED
        ) {
            paymentIntent = await stripe.paymentIntents.create({
                amount: finalAmountInCents,
                currency: 'usd',
                payment_method_types: ['card_present'],
                setup_future_usage: setupFutureUsage,
                capture_method: 'manual',
                receipt_email: email,
                description: `Donation to ${process.env
                    .FOUNDATION_NAME!} - ${firstName} ${lastName}`,
            });
        }

        if (id) {
            donation = await Donation.findByPk(id);
        }

        if (!id || !donation) {
            donation = await Donation.create({
                firstName,
                lastName,
                email,
                newsletter,
                amount: baseAmountInCents,
                feeAmount: feeAmountInCents,
                isRecurring,
                coverFee,
                finalAmount: finalAmountInCents,
                amountReceived: 0, // Initially 0 until payment is captured
                stripePaymentIntentId: paymentIntent?.id,
                status: DONATION_STATUS.PENDING,
            });
        }

        return res.status(201).json(donation);
    } catch (error) {
        console.error('Failed to create donation:', error);
        const errorMessage =
            error instanceof Error ? error.message : 'Internal server error';

        return res.status(500).json({ error: errorMessage });
    }
}
