// ==============================================================================
// FILE: app/page.tsx
// DESC: Main entry point that renders the current step based on context.
// ==============================================================================

'use client';

import { DonationProvider, useDonation } from '@/contexts/DonationContext';
import Image from 'next/image';
import { Step1_UserInfo } from '@/components/steps/Step1_UserInfo';
import { Step2_DonationAmount } from '@/components/steps/Step2_DonationAmount';
import { Step3_Confirmation } from '@/components/steps/Step3_Confirmation';
import { Step4_Processing } from '@/components/steps/Step4_Processing';
import { Step5_Result } from '@/components/steps/Step5_Result';
import Link from 'next/link';

const DonationFlowManager: React.FC = () => {
    const { step } = useDonation();

    const renderStep = () => {
        switch (step) {
            case 'userInfo':
                return <Step1_UserInfo />;
            case 'donationAmount':
                return <Step2_DonationAmount />;
            case 'confirmation':
                return <Step3_Confirmation />;
            case 'processing':
                return <Step4_Processing />;
            case 'result':
                return <Step5_Result />;
            default:
                return <Step1_UserInfo />;
        }
    };

    return (
        <div className='bg-gray-50 font-sans flex items-center justify-center min-h-screen p-4'>
            <div className='w-full max-w-5xl mx-auto p-8 md:p-12 space-y-6 text-center'>
                <header className='flex justify-center mb-6'>
                    <div className='flex items-center space-x-3'>
                        <Link href={'https://joantrumpauermulholland.org/'}>
                            <Image
                                src='/jtmf-logo.png'
                                alt='Foundation Logo'
                                className='h-10 w-75 object-contain'
                                width={300}
                                height={40}
                            />
                        </Link>
                    </div>
                </header>
                <div className='transition-all duration-300'>
                    {renderStep()}
                </div>
            </div>
        </div>
    );
};

const HomePage: React.FC = () => {
    return (
        <DonationProvider>
            <DonationFlowManager />
        </DonationProvider>
    );
};

export default HomePage;
