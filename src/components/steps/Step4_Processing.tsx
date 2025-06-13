// ==============================================================================
// FILE: components/steps/Step4_Processing.tsx
// DESC: Component for the fourth step, simulating card reader interaction.
// ==============================================================================

'use client';

import React from 'react';
import { CreditCard } from 'lucide-react';

export const Step4_Processing: React.FC = () => {
    return (
        <div className='space-y-8 flex flex-col items-center justify-center min-h-[300px] text-center'>
            <div className='animate-pulse'>
                <CreditCard className='h-20 w-20 md:h-24 md:w-24 text-gray-400' />
            </div>
            <h2 className='text-xl md:text-2xl font-semibold text-gray-800'>
                Please follow prompt on card reader
                <br />
                to complete transaction.
            </h2>
        </div>
    );
};
