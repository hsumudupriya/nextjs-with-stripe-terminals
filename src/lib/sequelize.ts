// ==============================================================================
// FILE: lib/sequelize.ts
// DESC: Initializes the Sequelize instance for use in the application.
// ==============================================================================

import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
    process.env.DB_NAME!,
    process.env.DB_USER!,
    process.env.DB_PASS!,
    {
        host: process.env.DB_HOST!,
        dialect: 'mysql',
        port: Number(process.env.DB_PORT) || 3306,
    }
);

export default sequelize;
