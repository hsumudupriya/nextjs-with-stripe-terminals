// ==============================================================================
// FILE: lib/stripe.ts (NEW)
// DESC: Initializes the Stripe Node.js SDK instance.
// ==============================================================================
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    typescript: true,
});
