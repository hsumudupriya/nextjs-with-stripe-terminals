// ==============================================================================
// FILE: lib/types.ts
// DESC: Central location for all TypeScript types used in the application.
// ==============================================================================

import { DONATION_STATUS } from './constants';

export type DonationData = {
    id: string | null;
    fullName: string;
    email: string;
    newsletter: boolean;
    amount: number;
    amountReceived: number;
    isRecurring: boolean;
    coverFee: boolean;
    stripePaymentIntentId?: string | null;
};

export type DonationStatus =
    (typeof DONATION_STATUS)[keyof typeof DONATION_STATUS];

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
    paymentStatus: DonationStatus;
    isProcessing: boolean;
    isCapturing: boolean;
    isResetting: boolean;
    setStep: (step: StepId) => void;
    setDonationData: (data: Partial<DonationData>) => void;
    processDonation: () => Promise<void>;
    captureDonation: (isPolling: boolean) => Promise<void | boolean>;
    resetFlow: () => void;
    tryAgain: () => void;
}
