'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('donations', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
            },
            fullName: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            newsletter: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
            },
            amount: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            isRecurring: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
            },
            coverFee: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
            },
            feeAmount: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            finalAmount: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            stripePaymentIntentId: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            stripeSubscriptionId: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            stripeCustomerId: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            status: {
                type: Sequelize.ENUM('pending', 'succeeded', 'failed'),
                allowNull: false,
                defaultValue: 'pending',
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('donations');
    },
};
