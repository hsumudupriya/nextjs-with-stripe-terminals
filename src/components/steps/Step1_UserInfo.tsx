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
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { UserInfoErrors } from '@/lib/types';

export const Step1_UserInfo = () => {
    const { donationData, setDonationData, setStep } = useDonation();
    const [errors, setErrors] = useState<UserInfoErrors>({});

    const validate = () => {
        const newErrors: UserInfoErrors = {};

        if (!donationData.firstName)
            newErrors.firstName = 'First name is required.';
        if (!donationData.lastName)
            newErrors.lastName = 'Last name is required.';
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
            setStep('confirmation');
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
                    placeholder='Enter Your First Name'
                    value={donationData.firstName}
                    onChange={(e) =>
                        setDonationData({ firstName: e.target.value })
                    }
                    className={errors.firstName ? 'border-red-500' : ''}
                />
                {errors.firstName && (
                    <p className='text-red-500 text-xs text-left'>
                        {errors.firstName}
                    </p>
                )}
                <Input
                    type='text'
                    placeholder='Enter Your Last Name'
                    value={donationData.lastName}
                    onChange={(e) =>
                        setDonationData({ lastName: e.target.value })
                    }
                    className={errors.lastName ? 'border-red-500' : ''}
                />
                {errors.lastName && (
                    <p className='text-red-500 text-xs text-left'>
                        {errors.lastName}
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
            <div className='mb-4'>
                <Button
                    type='submit'
                    size='lg'
                    disabled={!donationData.amount || donationData.amount <= 0}
                >
                    Next <ChevronRight className='ml-2 h-5 w-5' />
                </Button>
            </div>
            <div>
                <Button
                    onClick={() => setStep('donationAmount')}
                    variant='outline'
                    size='lg'
                >
                    Previous <ChevronLeft className='ml-2 h-5 w-5' />
                </Button>
            </div>
        </form>
    );
};
