// ==============================================================================
// FILE: models/donation.ts
// DESC: Defines the Donation model and its schema.
// ==============================================================================

import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/sequelize';
import { PaymentStatus } from '@/lib/types';
import { PAYMENT_STATUS } from '@/lib/constants';

// These are all the attributes in the Donation model
interface DonationAttributes {
    id: string;
    fullName: string;
    email: string;
    newsletter: boolean;
    amount: number; // Stored in cents
    isRecurring: boolean;
    coverFee: boolean;
    feeAmount: number; // Stored in cents
    finalAmount: number; // Stored in cents
    stripePaymentIntentId: string | null;
    stripeSubscriptionId: string | null;
    stripeCustomerId: string | null;
    status: PaymentStatus;
}

// Some attributes are optional in `Donation.build` and `Donation.create` calls
type DonationCreationAttributes = Optional<
    DonationAttributes,
    | 'id'
    | 'stripePaymentIntentId'
    | 'stripeSubscriptionId'
    | 'stripeCustomerId'
    | 'status'
>;

class Donation
    extends Model<DonationAttributes, DonationCreationAttributes>
    implements DonationAttributes
{
    public id!: string;
    public fullName!: string;
    public email!: string;
    public newsletter!: boolean;
    public amount!: number;
    public isRecurring!: boolean;
    public coverFee!: boolean;
    public feeAmount!: number;
    public finalAmount!: number;
    public stripePaymentIntentId!: string | null;
    public stripeSubscriptionId!: string | null;
    public stripeCustomerId!: string | null;
    public status!: PaymentStatus;

    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Donation.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        fullName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true,
            },
        },
        newsletter: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        amount: {
            type: DataTypes.INTEGER, // Store amount in cents to avoid floating point issues
            allowNull: false,
        },
        isRecurring: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        coverFee: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        feeAmount: {
            type: DataTypes.INTEGER, // Store amount in cents to avoid floating point issues
            allowNull: false,
        },
        finalAmount: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        stripePaymentIntentId: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        stripeSubscriptionId: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        stripeCustomerId: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        status: {
            type: DataTypes.ENUM(...Object.values(PAYMENT_STATUS)),
            allowNull: false,
            defaultValue: 'pending',
        },
    },
    {
        sequelize,
        tableName: 'donations',
    }
);

export default Donation;
