// ==============================================================================
// FILE: pages/api/donations/index.ts
// DESC: API route to handle creating a new donation record.
// ==============================================================================

import type { NextApiRequest, NextApiResponse } from 'next';
import Donation from '@/models/donation';
import { PAYMENT_FEE_RATE, DONATION_STATUS } from '@/lib/constants';
import { stripe } from '@/lib/stripe';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        const { fullName, email, newsletter, amount, isRecurring, coverFee } =
            req.body;

        if (!fullName || !email || !amount) {
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

        // For recurring payments, we need to save the payment method for future use.
        const setupFutureUsage = isRecurring ? 'off_session' : undefined;

        const paymentIntent = await stripe.paymentIntents.create({
            amount: finalAmountInCents,
            currency: 'usd',
            payment_method_types: ['card_present'],
            setup_future_usage: setupFutureUsage,
            capture_method: 'manual',
            receipt_email: email,
            description: `Donation to ${process.env
                .FOUNDATION_NAME!} - ${fullName}`,
        });

        const donation = await Donation.create({
            fullName,
            email,
            newsletter,
            amount: baseAmountInCents,
            feeAmount: feeAmountInCents,
            isRecurring,
            coverFee,
            finalAmount: finalAmountInCents,
            amountReceived: 0, // Initially 0 until payment is captured
            stripePaymentIntentId: paymentIntent.id,
            status: DONATION_STATUS.PENDING,
        });

        return res.status(201).json(donation);
    } catch (error) {
        console.error('Failed to create donation:', error);
        const errorMessage =
            error instanceof Error ? error.message : 'Internal server error';

        return res.status(500).json({ error: errorMessage });
    }
}
