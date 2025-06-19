// ==============================================================================
// FILE: pages/api/terminal/process-payment.ts
// DESC: Processes the payment on a Stripe Terminal reader.
// ==============================================================================
import type { NextApiRequest, NextApiResponse } from 'next';
import { stripe } from '@/lib/stripe';
import Donation from '@/models/donation';
import { DONATION_STATUS } from '@/lib/constants';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const { paymentIntentId } = req.body;
    const readerId = process.env.STRIPE_TERMINAL_READER_ID;

    if (!paymentIntentId || !readerId) {
        return res.status(!paymentIntentId ? 400 : 500).json({
            error: `Missing ${
                !paymentIntentId ? 'paymentIntentId' : 'readerId'
            }`,
        });
    }

    const donation = await Donation.findOne({
        where: { stripePaymentIntentId: paymentIntentId },
    });

    if (!donation) {
        return res.status(400).json({
            error: 'Donation record not found for this payment intent.',
        });
    }

    try {
        // Cancel the current action on the reader.
        const reader = await stripe.terminal.readers.cancelAction(readerId);
        console.log('Stripe Reader Object:', JSON.stringify(reader, null, 2));

        if (reader.action !== null) {
            console.log('Terminal failed to cancel the action.');

            throw new Error(
                'Terminal failed to cancel the action. Please try again.'
            );
        }

        if (donation.status !== DONATION_STATUS.SUCCEEDED) {
            // Update the donation status to failed.
            await Donation.update(
                { status: DONATION_STATUS.FAILED },
                { where: { stripePaymentIntentId: paymentIntentId } }
            );
        }

        return res
            .status(200)
            .json({ message: 'Payment processing cancelled successfully.' });
    } catch (error) {
        console.error('Error cancelling the terminal action:', error);
        const errorMessage =
            error instanceof Error ? error.message : 'Internal server error';

        return res.status(500).json({
            error: errorMessage,
        });
    }
}
