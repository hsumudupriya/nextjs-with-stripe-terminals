// ==============================================================================
// FILE: pages/api/donations/list.ts
// DESC: API endpoint to fetch all donation records from the database.
// ==============================================================================
import type { NextApiRequest, NextApiResponse } from 'next';
import Donation from '@/models/donation';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        const donations = await Donation.findAll({
            order: [['createdAt', 'DESC']],
        });

        return res.status(200).json(donations);
    } catch (error) {
        console.error('Failed to fetch donations:', error);
        const errorMessage =
            error instanceof Error ? error.message : 'Internal server error';
        return res.status(500).json({ error: errorMessage });
    }
}
