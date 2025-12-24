'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('donations', 'zipCode', {
            type: Sequelize.STRING,
            allowNull: true, // Nullable to avoid conflicts with existing rows
            after: 'email',
        });
    },

    async down(queryInterface) {
        await queryInterface.removeColumn('donations', 'zipCode');
    },
};
