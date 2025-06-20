'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.renameColumn('donations', 'fullName', 'firstName');
        await queryInterface.addColumn('donations', 'lastName', {
            type: Sequelize.STRING,
            allowNull: false,
            after: 'firstName',
        });
    },

    async down(queryInterface) {
        await queryInterface.renameColumn('donations', 'firstName', 'fullName');
        await queryInterface.removeColumn('donations', 'lastName');
    },
};
