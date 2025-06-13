// ==============================================================================
// FILE: app/page.tsx
// DESC: Main entry point that renders the current step based on context.
// ==============================================================================

'use client';

import { DonationProvider, useDonation } from '@/contexts/DonationContext';
import { Step1_UserInfo } from '@/components/steps/Step1_UserInfo';
import Image from 'next/image';
// Import other step components here
// import { Step2_DonationAmount } from '@/components/steps/Step2_DonationAmount';
// import { Step3_Confirmation } from '@/components/steps/Step3_Confirmation';
// import { Step4_Processing } from '@/components/steps/Step4_Processing';
// import { Step5_Result } from '@/components/steps/Step5_Result';

const DonationFlowManager: React.FC = () => {
    const { step } = useDonation();

    const renderStep = () => {
        switch (step) {
            case 'userInfo':
                return <Step1_UserInfo />;
            // case 'donationAmount':
            //     return <Step2_DonationAmount />;
            // case 'confirmation':
            //     return <Step3_Confirmation />;
            // case 'processing':
            //     return <Step4_Processing />;
            // case 'result':
            //     return <Step5_Result />;
            default:
                return <Step1_UserInfo />;
        }
    };

    return (
        <div className='bg-gray-50 font-sans flex items-center justify-center min-h-screen p-4'>
            <div className='w-full max-w-lg mx-auto bg-white rounded-2xl shadow-xl p-8 md:p-12 space-y-6 text-center'>
                <header className='flex justify-center mb-4'>
                    <div className='flex items-center space-x-3'>
                        <Image
                            src='https://logo.clearbit.com/uncf.org'
                            alt='Foundation Logo'
                            className='h-12 w-12 object-contain'
                            width={48}
                            height={48}
                        />
                        <span className='font-semibold text-gray-700 text-lg'>
                            The Joan Trumpauer
                            <br />
                            Mulholland Foundation
                        </span>
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
