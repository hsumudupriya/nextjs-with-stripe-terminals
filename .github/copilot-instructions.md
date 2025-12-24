# Copilot Instructions for Stripe Terminal Donation Platform

This project is a Next.js 15 application for collecting donations via Stripe Terminal (BBPOS WisePOS E). It uses a hybrid App Router/Pages Router architecture, Sequelize for MySQL, and Tailwind/Shadcn UI.

## 🏗 Architecture & Patterns

### Hybrid Routing

-   **Frontend**: Uses App Router (`src/app`) for the main donation wizard and layout.
-   **Backend**: Uses Pages Router API routes (`src/pages/api`) for all server-side logic, including Stripe interactions and database operations.
-   **Dashboard**: `src/pages/donations.tsx` serves as a server-rendered dashboard.

### State Management

-   **Donation Flow**: The multi-step wizard is driven by `DonationContext` (`src/contexts/DonationContext.tsx`).
-   **Steps**: Individual steps reside in `src/components/steps/`.
-   **Data Flow**: Frontend -> Context -> API Routes -> Sequelize -> MySQL.

### Database (Sequelize)

-   **ORM**: Sequelize is used for all database interactions.
-   **Migrations**: **CRITICAL**: All schema changes MUST be done via migrations (`migrations/`). Never modify the database schema directly.
-   **Models**: Defined in `src/models/`.

### Stripe Terminal Integration

-   **Server-Driven**: The payment flow is orchestrated server-side via `src/pages/api/terminal/`.
-   **Simulation**: Development relies on `src/pages/api/test-helpers/` to simulate terminal interactions (card taps, processing) without physical hardware.

## 🛠 Key Workflows & Commands

### Database Management

-   **Migrate**: `npm run db:migrate` (Run this after creating a new migration file).
-   **Undo**: `npm run db:migrate:undo`.
-   **Create Migration**: `npx sequelize-cli migration:generate --name <name>`.

### Development

-   **Start**: `npm run dev`.
-   **Environment**: Ensure `.env.local` is configured with Stripe keys and DB credentials.

## 📝 Coding Conventions

### File Structure

-   **Headers**: Include a standard file header comment describing the file's purpose (see `src/lib/sequelize.ts` or `src/contexts/DonationContext.tsx` for examples).
-   **UI Components**: Use Shadcn UI components from `src/components/ui/`.
-   **Types**: Define shared types in `src/lib/types.ts`.
-   **Constants**: Use `src/lib/constants.ts` for enums and configuration constants.

### Best Practices

-   **Stripe**: Always handle Stripe errors gracefully and log them. Use the `test-helpers` endpoints to verify flows in dev.
-   **Styling**: Use Tailwind CSS utility classes.
-   **Strict Mode**: TypeScript strict mode is enabled; avoid `any`.

## 🔍 Critical Files

-   `src/contexts/DonationContext.tsx`: Core logic for the donation wizard state.
-   `src/pages/api/terminal/process-payment.ts`: Handles the complex Stripe Terminal payment logic.
-   `src/lib/sequelize.ts`: Database connection setup.
-   `migrations/`: Source of truth for database schema.
