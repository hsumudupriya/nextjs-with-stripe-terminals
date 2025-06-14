// ==============================================================================
// FILE: contexts/DonationContext.tsx
// DESC: Manages the global state for the multi-step donation flow.
// ==============================================================================

'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';
import {
    DonationData,
    PaymentStatus,
    StepId,
    DonationContextType,
} from '@/lib/types';
import { PAYMENT_STATUS } from '@/lib/constants';

type DonationProviderProps = {
    children: ReactNode;
};

const DonationContext = createContext<DonationContextType | undefined>(
    undefined
);
const initialData: DonationData = {
    fullName: '',
    email: '',
    newsletter: true,
    amount: 10,
    isRecurring: true,
    coverFee: true,
};

export function DonationProvider({ children }: DonationProviderProps) {
    const [step, setStep] = useState<StepId>('userInfo');
    const [donationData, setDonationDataState] =
        useState<DonationData>(initialData);
    const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(
        PAYMENT_STATUS.PENDING
    );
    const [isProcessing, setIsProcessing] = useState(false);

    const setDonationData = (data: Partial<DonationData>) => {
        setDonationDataState((prev) => ({ ...prev, ...data }));
    };

    const processDonation = async () => {
        if (isProcessing) return;
        setIsProcessing(true);
        setStep('processing');

        try {
            // Step 1: Create a pending donation record in our database
            const response = await fetch('/api/donations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(donationData),
            });

            if (!response.ok) {
                throw new Error('Failed to create donation record');
            }

            const dbRecord = await response.json();
            console.log('Created DB record:', dbRecord);

            // Step 2: In a real app, use dbRecord.id to initiate Stripe Terminal payment
            // For now, we simulate the payment process
            console.log('Simulating Stripe Terminal payment...');
            await new Promise((resolve) => setTimeout(resolve, 4000));

            const isSuccess = false;

            // Step 3: Update the record in the DB with the result (not shown here for brevity)
            console.log(
                `Donation ${dbRecord.id} status is now ${
                    isSuccess ? PAYMENT_STATUS.SUCCEEDED : PAYMENT_STATUS.FAILED
                }`
            );

            setPaymentStatus(
                isSuccess ? PAYMENT_STATUS.SUCCEEDED : PAYMENT_STATUS.FAILED
            );
            setStep('result');
        } catch (error) {
            console.error(error);
            setPaymentStatus(PAYMENT_STATUS.FAILED);
            setStep('result');
        } finally {
            setIsProcessing(false);
        }
    };

    const resetFlow = () => {
        setStep('userInfo');
        setPaymentStatus(PAYMENT_STATUS.PENDING);
        setDonationDataState(initialData);
    };

    const tryAgain = () => {
        setPaymentStatus(PAYMENT_STATUS.PENDING);
        setStep('confirmation');
    };

    const value = {
        step,
        donationData,
        paymentStatus,
        isProcessing,
        setStep,
        setDonationData,
        processDonation,
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
