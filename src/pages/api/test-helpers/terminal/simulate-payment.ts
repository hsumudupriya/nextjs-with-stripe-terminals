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
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        const { card } = req.body;
        const reader =
            await stripe.testHelpers.terminal.readers.presentPaymentMethod(
                process.env.STRIPE_TERMINAL_READER_ID!,
                {
                    card_present: {
                        number: card,
                    },
                    type: 'card_present',
                }
            );

        res.json(reader);
    } catch (error) {
        res.status(500).json({
            error: 'Failed to simulate payment',
            ...(error as Error),
        });
    }
}
