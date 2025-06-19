// ==============================================================================
// FILE: components/steps/Step4_Processing.tsx
// DESC: Component for the fourth step, simulating card reader interaction.
// ==============================================================================

'use client';

import React, { useEffect, useRef } from 'react';
import { CreditCard, Loader2 } from 'lucide-react';
import { useDonation } from '@/contexts/DonationContext';
import { Button } from '../ui/button';

export const Step4_Processing: React.FC = () => {
    const { donationData, isResetting, setStep, captureDonation, resetFlow } =
        useDonation();
    const pollingInterval = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const pollStatus = async () => {
            if (!donationData.stripePaymentIntentId) return;

            try {
                if (await captureDonation(true)) {
                    setStep('result');
                }
            } catch (error) {
                console.error('Polling error:', error);

                if (pollingInterval.current) {
                    clearInterval(pollingInterval.current);
                }
            }
        };

        // Start polling every 3 seconds (3000 milliseconds)
        pollingInterval.current = setInterval(pollStatus, 3000);

        // Cleanup function: this runs when the component is unmounted
        return () => {
            if (pollingInterval.current) {
                clearInterval(pollingInterval.current);
            }
        };
    }, [donationData.stripePaymentIntentId, setStep, captureDonation]);

    return (
        <div className='space-y-8 flex flex-col items-center justify-center min-h-[300px] text-center'>
            <div className='animate-pulse'>
                <CreditCard className='h-20 w-20 md:h-24 md:w-24 text-gray-400' />
            </div>
            <h2 className='text-2xl md:text-4xl font-semibold text-gray-800'>
                Please follow prompt on card reader
                <br />
                to complete transaction.
            </h2>
            <Button
                onClick={resetFlow}
                variant='outline'
                size='lg'
                className='w-md'
                disabled={isResetting}
            >
                {isResetting ? (
                    <>
                        <Loader2 className='mr-2 h-5 w-5 animate-spin' />
                        Wait for Resetting...
                    </>
                ) : (
                    'Cancel Donation <'
                )}
            </Button>
        </div>
    );
};
