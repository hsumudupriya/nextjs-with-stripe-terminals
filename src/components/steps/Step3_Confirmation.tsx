// ==============================================================================
// FILE: components/steps/Step3_Confirmation.tsx
// DESC: Component for the third step of the donation flow.
// ==============================================================================

'use client';

import React, { useMemo } from 'react';
import { useDonation } from '@/contexts/DonationContext';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export const Step3_Confirmation: React.FC = () => {
    const { donationData, processDonation, isProcessing } = useDonation();

    const finalAmount = useMemo(() => {
        return donationData.coverFee
            ? donationData.amount * 1.06
            : donationData.amount;
    }, [donationData.amount, donationData.coverFee]);

    return (
        <div className='space-y-8 flex flex-col items-center'>
            <h2 className='text-2xl md:text-4xl font-semibold text-gray-800'>
                Your donation total is:
            </h2>
            <div className='text-5xl md:text-6xl font-bold text-gray-900'>
                ${finalAmount.toFixed(2)}
                {donationData.isRecurring && (
                    <span className='text-2xl md:text-3xl font-semibold text-gray-500'>
                        /mo.
                    </span>
                )}
            </div>
            <Button
                onClick={processDonation}
                size='lg'
                className='w-md'
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
    );
};
