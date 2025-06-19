// ==============================================================================
// FILE: components/steps/Step4_Processing.tsx
// DESC: Component for the fourth step, simulating card reader interaction.
// ==============================================================================

'use client';

import React from 'react';
import { ChevronLeft, CreditCard, Loader2 } from 'lucide-react';
import { useDonation } from '@/contexts/DonationContext';
import { Button } from '../ui/button';

export const Step4_Processing: React.FC = () => {
    const { isProcessing, isCapturing, captureDonation, resetFlow } =
        useDonation();

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

            <div className='mb-4'>
                <Button
                    onClick={captureDonation}
                    size='lg'
                    className='w-md'
                    disabled={isProcessing || isCapturing}
                >
                    {isProcessing || isCapturing ? (
                        <>
                            <Loader2 className='mr-2 h-5 w-5 animate-spin' />
                            {isProcessing
                                ? 'Wait for Processing...'
                                : 'Wait for Capturing...'}
                        </>
                    ) : (
                        'Capture Donation >'
                    )}
                </Button>
            </div>
            <div>
                <Button
                    onClick={resetFlow}
                    variant='outline'
                    size='lg'
                    className='w-md'
                >
                    Cancel Donation <ChevronLeft className='ml-2 h-5 w-5' />
                </Button>
            </div>
        </div>
    );
};
