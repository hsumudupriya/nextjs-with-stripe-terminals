// ==============================================================================
// FILE: pages/api/donations/index.ts
// DESC: API route to handle creating a new donation record.
// ==============================================================================

import type { NextApiRequest, NextApiResponse } from 'next';
import Donation from '@/models/donation';
import { PAYMENT_STATUS } from '@/lib/constants';

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
            ? Math.round(baseAmountInCents * 0.06)
            : 0;
        const finalAmountInCents = coverFee
            ? baseAmountInCents + feeAmountInCents
            : baseAmountInCents;

        const donation = await Donation.create({
            fullName,
            email,
            newsletter,
            amount: baseAmountInCents,
            feeAmount: feeAmountInCents,
            isRecurring,
            coverFee,
            finalAmount: finalAmountInCents,
            status: PAYMENT_STATUS.PENDING,
        });

        // Here you would create a Stripe PaymentIntent and interact with the Terminal
        // For now, we'll just return the created donation record

        return res.status(201).json(donation);
    } catch (error) {
        console.error('Failed to create donation:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
