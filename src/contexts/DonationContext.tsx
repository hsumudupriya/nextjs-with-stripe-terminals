// ==============================================================================
// FILE: contexts/DonationContext.tsx
// DESC: Manages the global state for the multi-step donation flow.
// ==============================================================================

'use client';

import React, {
    createContext,
    useState,
    useContext,
    ReactNode,
    FC,
} from 'react';
import {
    DonationData,
    PaymentStatus,
    StepId,
    DonationContextType,
} from '@/lib/types';

const DonationContext = createContext<DonationContextType | undefined>(
    undefined
);

const FAILED_PAYMENT_CHANCE = 0.25; // 25% chance of failure for demo

const initialData: DonationData = {
    fullName: '',
    email: '',
    newsletter: true,
    amount: 10,
    isRecurring: true,
    coverFee: true,
};

export const DonationProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [step, setStep] = useState<StepId>('userInfo');
    const [donationData, setDonationDataState] =
        useState<DonationData>(initialData);
    const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const setDonationData = (data: Partial<DonationData>) => {
        setDonationDataState((prev) => ({ ...prev, ...data }));
    };

    const processDonation = async () => {
        if (isProcessing) return;

        setIsProcessing(true);
        setStep('processing');
        console.log('Processing donation...', donationData);

        // Simulate backend call
        await new Promise((resolve) => setTimeout(resolve, 3000));

        // const isSuccess = Math.random() > FAILED_PAYMENT_CHANCE;
        const isSuccess = true; // Force success for demo

        setPaymentStatus(isSuccess ? 'success' : 'failed');
        setIsProcessing(false);
        setStep('result');
    };

    const resetFlow = () => {
        setStep('userInfo');
        setPaymentStatus(null);
        setDonationDataState(initialData);
    };

    const tryAgain = () => {
        setPaymentStatus(null);
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
};

export const useDonation = (): DonationContextType => {
    const context = useContext(DonationContext);

    if (context === undefined) {
        throw new Error('useDonation must be used within a DonationProvider');
    }

    return context;
};
