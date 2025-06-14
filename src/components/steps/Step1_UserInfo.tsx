// ==============================================================================
// FILE: components/steps/Step1_UserInfo.tsx
// DESC: Component for the first step of the donation flow.
// ==============================================================================

'use client';

import React, { useState } from 'react';
import { useDonation } from '@/contexts/DonationContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronRight } from 'lucide-react';
import { UserInfoErrors } from '@/lib/types';

export const Step1_UserInfo = () => {
    const { donationData, setDonationData, setStep } = useDonation();
    const [errors, setErrors] = useState<UserInfoErrors>({});

    const validate = () => {
        const newErrors: UserInfoErrors = {};

        if (!donationData.fullName)
            newErrors.fullName = 'Full name is required.';
        if (!donationData.email) {
            newErrors.email = 'Email is required.';
        } else if (
            !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
                donationData.email
            )
        ) {
            newErrors.email = 'Email address is invalid.';
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validate()) {
            setStep('donationAmount');
        }
    };

    return (
        <form onSubmit={handleSubmit} className='space-y-6 md:space-y-8'>
            <h2 className='text-2xl md:text-4xl font-semibold text-gray-800'>
                Thank you for supporting our organization!
            </h2>
            <div className='space-y-4'>
                <Input
                    type='text'
                    placeholder='Enter Your Full Name'
                    value={donationData.fullName}
                    onChange={(e) =>
                        setDonationData({ fullName: e.target.value })
                    }
                    className={errors.fullName ? 'border-red-500' : ''}
                />
                {errors.fullName && (
                    <p className='text-red-500 text-xs text-left'>
                        {errors.fullName}
                    </p>
                )}
                <Input
                    type='email'
                    placeholder='Enter Your Email'
                    value={donationData.email}
                    onChange={(e) => setDonationData({ email: e.target.value })}
                    className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                    <p className='text-red-500 text-xs text-left'>
                        {errors.email}
                    </p>
                )}
            </div>
            <div className='flex items-center space-x-2'>
                <Checkbox
                    id='newsletter'
                    checked={donationData.newsletter}
                    onCheckedChange={(checked) =>
                        setDonationData({ newsletter: !!checked })
                    }
                />
                <label
                    htmlFor='newsletter'
                    className='text-md font-medium leading-none'
                >
                    Subscribe to newsletter
                </label>
            </div>
            <Button type='submit' size='lg' className='w-md'>
                Next <ChevronRight className='ml-2 h-5 w-5' />
            </Button>
        </form>
    );
};
