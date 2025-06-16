// ==============================================================================
// FILE: lib/sequelize.ts
// DESC: Initializes the Sequelize instance for use in the application.
// ==============================================================================

import { Dialect, Sequelize } from 'sequelize';

let sequelize: Sequelize;

if (process.env.NODE_ENV === 'production' && process.env.DATABASE_URL) {
    // In production, use the DATABASE_URL
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: process.env.DB_DIALECT! as Dialect,
        // It's good practice to configure connection pooling for production
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
    });
} else {
    // In development, use individual environment variables from .env.local
    sequelize = new Sequelize(
        process.env.DB_NAME!,
        process.env.DB_USER!,
        process.env.DB_PASS!,
        {
            host: process.env.DB_HOST!,
            dialect: process.env.DB_DIALECT! as Dialect,
            port: Number(process.env.DB_PORT) || 3306,
        }
    );
}

export default sequelize;
