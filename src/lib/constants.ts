// ==============================================================================
// FILE: lib/constants.ts (NEW)
// DESC: Central location for shared application constants.
// ==============================================================================

export const PAYMENT_STATUS = {
    PENDING: 'pending',
    SUCCEEDED: 'succeeded',
    FAILED: 'failed',
} as const; // 'as const' makes the object properties readonly and their values literal types
