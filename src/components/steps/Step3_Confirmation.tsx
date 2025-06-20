// ==============================================================================
// FILE: components/steps/Step3_Confirmation.tsx
// DESC: Component for the third step of the donation flow.
// ==============================================================================

'use client';

import React, { useMemo } from 'react';
import { useDonation } from '@/contexts/DonationContext';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { PAYMENT_FEE_RATE } from '@/lib/constants';

export const Step3_Confirmation: React.FC = () => {
    const { donationData, processDonation, isProcessing, setStep } =
        useDonation();

    const finalAmount = useMemo(() => {
        return donationData.coverFee
            ? donationData.amount * (1 + PAYMENT_FEE_RATE)
            : donationData.amount;
    }, [donationData.amount, donationData.coverFee]);

    return (
        <div className='space-y-8 flex flex-col items-center'>
            <h2 className='text-2xl md:text-4xl font-semibold text-gray-800'>
                Your donation details are:
            </h2>
            <div className='text-xl md:text-2xl font-semibold text-gray-900'>
                {`${donationData.fullName} (${donationData.email})`}
            </div>
            <div className='text-5xl md:text-6xl font-bold text-gray-900'>
                ${finalAmount.toFixed(2)}
                {donationData.isRecurring && (
                    <span className='text-2xl md:text-3xl font-semibold text-gray-500'>
                        /mo.
                    </span>
                )}
            </div>

            <div className='mb-4'>
                <Button
                    onClick={processDonation}
                    size='lg'
                    disabled={isProcessing}
                >
                    {isProcessing ? (
                        <>
                            <Loader2 className='mr-2 h-5 w-5 animate-spin' />
                            Processing...
                        </>
                    ) : (
                        'Complete Donation >'
                    )}
                </Button>
            </div>
            <div>
                <Button
                    onClick={() => setStep('donationAmount')}
                    variant='outline'
                    size='lg'
                >
                    Previous <ChevronLeft className='ml-2 h-5 w-5' />
                </Button>
            </div>
        </div>
    );
};
