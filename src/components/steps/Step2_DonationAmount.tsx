// ==============================================================================
// FILE: components/steps/Step2_DonationAmount.tsx
// DESC: Component for the second step of the donation flow.
// ==============================================================================

'use client';

import React, { useState } from 'react';
import { useDonation } from '@/contexts/DonationContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { ChevronRight } from 'lucide-react';

export const Step2_DonationAmount: React.FC = () => {
    const predefinedAmounts = [1, 3, 5, 10];
    const { donationData, setDonationData, setStep } = useDonation();
    const [customAmount, setCustomAmount] = useState<number>(
        !predefinedAmounts.includes(donationData.amount)
            ? donationData.amount
            : 0
    );

    const handleAmountSelect = (value: string) => {
        if (!value) return;

        const amount = parseInt(value, 10);
        setDonationData({ amount });
        setCustomAmount(0);
    };

    const handleCustomAmountChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = e.target.value;
        const parsedValue = parseFloat(value);
        setCustomAmount(parsedValue);

        if (!isNaN(parsedValue) && parsedValue > 0) {
            setDonationData({ amount: parsedValue });
        } else if (value === '') {
            setDonationData({ amount: 0 });
        }
    };

    return (
        <div className='space-y-8'>
            <h2 className='text-2xl md:text-4xl font-semibold text-gray-800'>
                Donate Today! Choose an amount:
            </h2>
            <ToggleGroup
                type='single'
                variant='outline'
                size='lg'
                className='grid grid-cols-2 sm:grid-cols-4 w-full'
                value={
                    predefinedAmounts.includes(donationData.amount)
                        ? donationData.amount.toString()
                        : ''
                }
                onValueChange={handleAmountSelect}
            >
                {predefinedAmounts.map((amount) => (
                    <ToggleGroupItem key={amount} value={amount.toString()}>
                        ${amount}
                    </ToggleGroupItem>
                ))}
            </ToggleGroup>

            <div className='relative'>
                <span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'>
                    $
                </span>
                <Input
                    type='number'
                    placeholder='Other Amount'
                    value={customAmount || ''}
                    onChange={handleCustomAmountChange}
                    className='pl-8'
                />
            </div>

            <div className='flex flex-col sm:flex-row justify-around space-y-4 sm:space-y-0'>
                <div className='flex items-center space-x-2'>
                    <Checkbox
                        id='recurring'
                        checked={donationData.isRecurring}
                        onCheckedChange={(checked) =>
                            setDonationData({ isRecurring: !!checked })
                        }
                    />
                    <label htmlFor='recurring' className='text-md font-medium'>
                        Monthly recurring donation
                    </label>
                </div>
                <div className='flex items-center space-x-2'>
                    <Checkbox
                        id='coverFee'
                        checked={donationData.coverFee}
                        onCheckedChange={(checked) =>
                            setDonationData({ coverFee: !!checked })
                        }
                    />
                    <label htmlFor='coverFee' className='text-md font-medium'>
                        Cover processing fee (6%)
                    </label>
                </div>
            </div>

            <Button
                onClick={() => setStep('userInfo')}
                size='lg'
                disabled={!donationData.amount || donationData.amount <= 0}
            >
                Next <ChevronRight className='ml-2 h-5 w-5' />
            </Button>
        </div>
    );
};
