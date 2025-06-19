// ==============================================================================
// FILE: pages/api/terminal/process-payment.ts
// DESC: Processes the payment on a Stripe Terminal reader.
// ==============================================================================
import type { NextApiRequest, NextApiResponse } from 'next';
import { stripe } from '@/lib/stripe';
import Donation from '@/models/donation';
import {
    DONATION_STATUS,
    STRIPE_PAYMENT_INTENT_STATUS,
    STRIPE_READER_ACTION_STATUS,
} from '@/lib/constants';
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
    let donationStatus: DonationStatus = DONATION_STATUS.PENDING;

    if (!donation) {
        return res.status(400).json({
            error: 'Donation record not found for this payment intent.',
        });
    }

    let attempt = 0;
    const tries = 3;

    while (true) {
        attempt++;

        try {
            // Process the payment on the physical reader. This authorizes the payment.
            const reader = await stripe.terminal.readers.processPaymentIntent(
                readerId,
                {
                    payment_intent: paymentIntentId,
                    process_config: {
                        allow_redisplay: 'always',
                    },
                }
            );
            const actionStatus = reader.action?.status as string;
            console.log(
                'Stripe Reader Object:',
                JSON.stringify(reader, null, 2)
            );

            if (actionStatus === STRIPE_READER_ACTION_STATUS.FAILED) {
                console.log('Terminal failed to process the Payment Intent.');
                donationStatus = DONATION_STATUS.FAILED;

                throw new Error(
                    'Terminal failed to process the Payment Intent. Please try again.'
                );
            }

            return res
                .status(
                    actionStatus === STRIPE_READER_ACTION_STATUS.FAILED
                        ? 400
                        : 200
                )
                .json({ status: actionStatus });
        } catch (error) {
            console.error('Error processing the payment:', error);
            donationStatus = DONATION_STATUS.FAILED;

            if (
                error !== null &&
                typeof error === 'object' &&
                'code' in error
            ) {
                if (
                    error.code === 'terminal_reader_timeout' &&
                    attempt < tries
                ) {
                    // Temporary networking blip, automatically retry a few times.
                    continue;
                }

                if (error.code === 'intent_invalid_state') {
                    const paymentIntent = await stripe.paymentIntents.retrieve(
                        paymentIntentId
                    );
                    console.log(
                        `PaymentIntent is in ${paymentIntent.status} state.`
                    );

                    if (
                        paymentIntent.status ===
                        STRIPE_PAYMENT_INTENT_STATUS.SUCCEEDED
                    ) {
                        donationStatus = DONATION_STATUS.SUCCEEDED;
                    }
                }
            }

            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Internal server error';

            return res.status(500).json({
                error: errorMessage,
                status: DONATION_STATUS.FAILED,
            });
        } finally {
            await Donation.update(
                { status: donationStatus },
                { where: { stripePaymentIntentId: paymentIntentId } }
            );
        }
    }
}
