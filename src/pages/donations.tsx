// ==============================================================================
// FILE: pages/donations.tsx
// DESC: Frontend page to display the list of donations.
// ==============================================================================
import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import {
    Table,
    TableHeader,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
} from '@/components/ui/table';
import Link from 'next/link';
import { DONATION_STATUS } from '@/lib/constants';
import { Badge } from '@/components/ui/badge';

// Define the shape of a single donation object for the frontend
type Donation = {
    id: string;
    firstName: string;
    lastName: string;
    newsletter: boolean;
    email: string;
    zipCode: string;
    finalAmount: number;
    isRecurring: boolean;
    status: (typeof DONATION_STATUS)[keyof typeof DONATION_STATUS];
    createdAt: string; // Dates will be serialized as strings
};

type DonationsListPageProps = {
    donations: Donation[];
};

const DonationsListPage: NextPage<DonationsListPageProps> = ({ donations }) => {
    const getStatusVariant = (status: Donation['status']) => {
        switch (status) {
            case DONATION_STATUS.SUCCEEDED:
                return 'success';
            case DONATION_STATUS.FAILED:
                return 'destructive';
            default:
                return 'secondary';
        }
    };

    return (
        <>
            <Head>
                <title>All Donations</title>
            </Head>
            <div className='container mx-auto py-10 px-4'>
                <header className='flex justify-between items-center mb-8'>
                    <h1 className='text-3xl font-bold'>Donations</h1>
                    <Link
                        href='/'
                        passHref
                        className='text-blue-500 hover:underline'
                    >
                        ← Back to Donation Form
                    </Link>
                </header>

                <div className='bg-white rounded-lg shadow-md'>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Full Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Zip Code</TableHead>
                                <TableHead>Newsletter</TableHead>
                                <TableHead className='text-right'>
                                    Amount
                                </TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {donations.map((donation) => {
                                const createdAt = new Date(donation.createdAt);

                                return (
                                    <TableRow key={donation.id}>
                                        <TableCell>
                                            {createdAt.toLocaleDateString()}{' '}
                                            {createdAt.toLocaleTimeString()}
                                        </TableCell>
                                        <TableCell className='font-medium'>
                                            {donation.firstName}{' '}
                                            {donation.lastName}
                                        </TableCell>
                                        <TableCell>{donation.email}</TableCell>
                                        <TableCell>{donation.zipCode || '-'}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    donation.newsletter
                                                        ? 'success'
                                                        : 'secondary'
                                                }
                                            >
                                                {donation.newsletter
                                                    ? 'Subscribed'
                                                    : 'Not Subscribed'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className='text-right'>
                                            $
                                            {(
                                                donation.finalAmount / 100
                                            ).toFixed(2)}
                                        </TableCell>
                                        <TableCell>
                                            {donation.isRecurring
                                                ? 'Recurring'
                                                : 'One-Time'}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={getStatusVariant(
                                                    donation.status
                                                )}
                                            >
                                                {donation.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </>
    );
};

// Fetch data on the server side before rendering the page
export const getServerSideProps: GetServerSideProps = async () => {
    // In a real app, your domain would be an environment variable
    const res = await fetch(`${process.env.APP_URL}/api/donations/list`);
    const donations = await res.json();

    // The data needs to be serializable, so we ensure it's plain JSON
    // Dates are automatically serialized to strings by Next.js
    return {
        props: {
            donations,
        },
    };
};

export default DonationsListPage;
