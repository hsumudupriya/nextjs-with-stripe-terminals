// ==============================================================================
// FILE: lib/types.ts
// DESC: Central location for all TypeScript types used in the application.
// ==============================================================================

export type DonationData = {
    fullName: string;
    email: string;
    newsletter: boolean;
    amount: number;
    isRecurring: boolean;
    coverFee: boolean;
};

export type PaymentStatus = 'success' | 'failed' | null;

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
    setStep: (step: StepId) => void;
    setDonationData: (data: Partial<DonationData>) => void;
    processDonation: () => Promise<void>;
    resetFlow: () => void;
    tryAgain: () => void;
}
