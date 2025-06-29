// ==============================================================================
// FILE: components/steps/Step5_Result.tsx
// DESC: Component for the fifth and final step, displaying transaction result.
// ==============================================================================

'use client';

import React, { useEffect } from 'react';
import { useDonation } from '@/contexts/DonationContext';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { DONATION_STATUS } from '@/lib/constants';

export const Step5_Result: React.FC = () => {
    const { paymentStatus, isResetting, resetFlow, tryAgain } = useDonation();

    useEffect(() => {
        // Only set the timer if the payment was successful
        if (paymentStatus === DONATION_STATUS.SUCCEEDED) {
            const timer = setTimeout(() => {
                resetFlow();
            }, 6000);

            // Cleanup function: clear the timer if the component unmounts
            return () => clearTimeout(timer);
        }
    }, [paymentStatus, resetFlow]); // Dependency array ensures effect runs when paymentStatus changes

    if (paymentStatus === DONATION_STATUS.SUCCEEDED) {
        return (
            <div className='space-y-8 flex flex-col items-center justify-center min-h-[300px] text-center'>
                <CheckCircle2 className='h-20 w-20 md:h-24 md:w-24 text-green-500' />
                <h2 className='text-2xl md:text-4xl font-bold text-green-600'>
                    Thank you, your transaction was successful!
                </h2>
                <Button onClick={resetFlow} variant='outline' size='lg'>
                    Return Home
                </Button>
            </div>
        );
    }

    if (paymentStatus === DONATION_STATUS.FAILED) {
        return (
            <div className='space-y-6 flex flex-col items-center justify-center min-h-[300px] text-center'>
                <XCircle className='h-20 w-20 md:h-24 md:w-24 text-red-500' />
                <h2 className='text-2xl md:text-4xl font-bold text-red-600'>
                    Sorry, your transaction was not successful
                </h2>
                <div className='w-full space-y-3'>
                    <div>
                        <Button
                            onClick={tryAgain}
                            variant='primary'
                            size='lg'
                            disabled={isResetting}
                        >
                            {isResetting ? (
                                <>
                                    <Loader2 className='mr-2 h-5 w-5 animate-spin' />
                                    Wait...
                                </>
                            ) : (
                                'Try Again <'
                            )}
                        </Button>
                    </div>
                    <div>
                        <Button
                            onClick={resetFlow}
                            variant='outline'
                            size='lg'
                            disabled={isResetting}
                        >
                            {isResetting ? (
                                <>
                                    <Loader2 className='mr-2 h-5 w-5 animate-spin' />
                                    Wait for Resetting...
                                </>
                            ) : (
                                'Return Home <'
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    // This part should ideally not be reached if the flow is correct.
    return (
        <div className='space-y-8 flex flex-col items-center justify-center min-h-[300px] text-center'>
            <h2 className='text-xl font-semibold text-gray-500'>
                Loading result...
            </h2>
        </div>
    );
};
