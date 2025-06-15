// ==============================================================================
// FILE: lib/constants.ts (NEW)
// DESC: Central location for shared application constants.
// ==============================================================================

export const DONATION_STATUS = {
    PENDING: 'pending',
    SUCCEEDED: 'succeeded',
    FAILED: 'failed',
} as const; // 'as const' makes the object properties readonly and their values literal types

// 6% fee rate for covering transaction fees
export const PAYMENT_FEE_RATE = 0.06;

export const STRIPE_PAYMENT_INTENT_STATUS = {
    SUCCEEDED: 'succeeded',
    CANCELED: 'canceled',
} as const;

export const STRIPE_READER_ACTION_TYPE = {
    PROCESS_PAYMENT_INTENT: 'process_payment_intent',
} as const;

export const STRIPE_READER_ACTION_STATUS = {
    FAILED: 'failed',
    IN_PROGRESS: 'in_progress',
    SUCCEEDED: 'succeeded',
} as const;
