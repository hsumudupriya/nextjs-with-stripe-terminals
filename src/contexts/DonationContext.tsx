// ==============================================================================
// FILE: contexts/DonationContext.tsx
// DESC: Manages the global state for the multi-step donation flow.
// ==============================================================================

'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';
import {
    DonationData,
    DonationStatus,
    StepId,
    DonationContextType,
} from '@/lib/types';
import { DONATION_STATUS, STRIPE_READER_ACTION_STATUS } from '@/lib/constants';

type DonationProviderProps = {
    children: ReactNode;
};

const DonationContext = createContext<DonationContextType | undefined>(
    undefined
);
const initialData: DonationData = {
    id: null,
    fullName: '',
    email: '',
    newsletter: true,
    amount: 10,
    amountReceived: 0,
    isRecurring: true,
    coverFee: true,
    stripePaymentIntentId: null,
};

export function DonationProvider({ children }: DonationProviderProps) {
    const [step, setStep] = useState<StepId>('userInfo');
    const [donationData, setDonationDataState] =
        useState<DonationData>(initialData);
    const [paymentStatus, setPaymentStatus] = useState<DonationStatus>(
        DONATION_STATUS.PENDING
    );
    const [isProcessing, setIsProcessing] = useState(false);
    const [isCapturing, setIsCapturing] = useState(false);

    const setDonationData = (data: Partial<DonationData>) => {
        setDonationDataState((prev) => ({ ...prev, ...data }));
    };

    const processDonation = async () => {
        if (isProcessing) return;
        setIsProcessing(true);
        setStep('processing');

        try {
            // Step 1: Create a pending donation record in our database
            const createResponse = await fetch('/api/donations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(donationData),
            });
            const createResult = await createResponse.json();

            if (!createResponse.ok) {
                throw new Error(
                    createResult.error || 'Failed to create donation record.'
                );
            }
            console.log(
                'Using Payment Intent for Terminal:',
                createResult.stripePaymentIntentId
            );

            setDonationData({
                id: createResult.id,
                stripePaymentIntentId: createResult.stripePaymentIntentId,
            });

            // Step 2: Process the payment on the Stripe Terminal reader
            setStep('processing');

            const processResponse = await fetch(
                '/api/terminal/process-payment',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        paymentIntentId: createResult.stripePaymentIntentId,
                    }),
                }
            );
            const result = await processResponse.json();

            if (!processResponse.ok) {
                throw new Error(
                    result.error || 'Failed to process payment on terminal.'
                );
            }

            if (result.status === STRIPE_READER_ACTION_STATUS.FAILED) {
                setPaymentStatus(DONATION_STATUS.FAILED);
            }
        } catch (error) {
            console.error(error);

            setPaymentStatus(DONATION_STATUS.FAILED);
            setStep('result');
        } finally {
            setIsProcessing(false);
        }
    };

    const captureDonation = async () => {
        if (isCapturing) return;
        setIsCapturing(true);

        try {
            // Step 1: Create a pending donation record in our database
            const response = await fetch('/api/donations/capture', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    paymentIntentId: donationData.stripePaymentIntentId,
                }),
            });
            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.error || 'Failed to capture the donation.'
                );
            }

            setPaymentStatus(
                result.status === DONATION_STATUS.SUCCEEDED
                    ? DONATION_STATUS.SUCCEEDED
                    : DONATION_STATUS.FAILED
            );
        } catch (error) {
            console.error(error);
            setPaymentStatus(DONATION_STATUS.FAILED);
        } finally {
            setStep('result');
            setIsCapturing(false);
        }
    };

    const resetFlow = () => {
        setStep('userInfo');
        setPaymentStatus(DONATION_STATUS.PENDING);
        setDonationDataState(initialData);
    };

    const tryAgain = () => {
        setStep('processing');
    };

    const value = {
        step,
        donationData,
        paymentStatus,
        isProcessing,
        isCapturing,
        setStep,
        setDonationData,
        processDonation,
        captureDonation,
        resetFlow,
        tryAgain,
    };

    return (
        <DonationContext.Provider value={value}>
            {children}
        </DonationContext.Provider>
    );
}

export const useDonation = (): DonationContextType => {
    const context = useContext(DonationContext);

    if (context === undefined) {
        throw new Error('useDonation must be used within a DonationProvider');
    }

    return context;
};
