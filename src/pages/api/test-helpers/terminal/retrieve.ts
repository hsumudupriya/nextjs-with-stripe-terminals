// ==============================================================================
// FILE: pages/api/terminal/simulate-payment.ts
// DESC: Simulate a payment on a Stripe Terminal reader.
// ==============================================================================
import type { NextApiRequest, NextApiResponse } from 'next';
import { stripe } from '@/lib/stripe';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const reader = await stripe.terminal.readers.retrieve(
            process.env.STRIPE_TERMINAL_READER_ID!
        );

        res.json(reader);
    } catch (error) {
        res.status(500).json({
            error: 'Failed to retrieve the reader.',
            ...(error as Error),
        });
    }
}
