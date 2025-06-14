// ==============================================================================
// FILE: lib/types.ts
// DESC: Central location for all TypeScript types used in the application.
// ==============================================================================

import { PAYMENT_STATUS } from './constants';

export type DonationData = {
    fullName: string;
    email: string;
    newsletter: boolean;
    amount: number;
    isRecurring: boolean;
    coverFee: boolean;
};

export type PaymentStatus =
    (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];

export type StepId =
    | 'userInfo'
    | 'donationAmount'
    | 'confirmation'
    | 'processing'
    | 'result';

export type UserInfoErrors = {
    fullName?: string;
    email?: string;
};

export interface DonationContextType {
    step: StepId;
    donationData: DonationData;
    paymentStatus: PaymentStatus;
    isProcessing: boolean;
    setStep: (step: StepId) => void;
    setDonationData: (data: Partial<DonationData>) => void;
    processDonation: () => Promise<void>;
    resetFlow: () => void;
    tryAgain: () => void;
}
