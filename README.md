# **Full-Stack Stripe Terminal Donation Platform**

This is a comprehensive, full-stack web application designed to collect donations through a modern, multi-step user interface. It handles both one-time and recurring monthly donations via a physical Stripe BBPOS WisePOS E terminal, providing a seamless in-person payment experience.

The application is built with a production-ready stack, featuring a Next.js frontend, a Node.js backend with API routes, a MySQL database managed by Sequelize, and a robust, server-driven Stripe integration. It also includes a separate, server-rendered page for viewing all donation records.

## **Features**

-   **Multi-Step Donation Form:** A clean, user-friendly interface that guides donors through the process.
-   **Dynamic Donation Amounts:** Supports both predefined and custom donation amounts.
-   **One-Time & Recurring Donations:** Users can choose between a single donation or a monthly subscription.
-   **Stripe Terminal Integration:** Processes payments in-person using the BBPOS WisePOS E reader with a secure, server-driven flow.
-   **Subscription Management:** Correctly handles the creation of Stripe Subscriptions from a physical card tap without double-charging the user.
-   **Database Persistence:** All donation records are stored in a MySQL database.
-   **Schema Management:** Uses Sequelize migrations for safe and version-controlled database schema changes.
-   **Donations Dashboard:** A separate, server-rendered page to view a list of all successful, pending, and failed donations.
-   **Responsive Design:** Optimized for a clean user experience on desktop, tablet, and mobile devices.

## **Tech Stack**

-   **Framework:** Next.js (Pages Router)
-   **Language:** TypeScript
-   **Styling:** Tailwind CSS
-   **UI Components:** Shadcn UI
-   **Backend:** Node.js (via Next.js API Routes)
-   **Database ORM:** Sequelize
-   **Database:** MySQL
-   **Payments:** Stripe (Payments, Subscriptions, and Terminal)

## **Getting Started**

Follow these instructions to get the project running on your local machine for development and testing purposes.

### **1. Prerequisites**

-   Node.js (v18.x or later)
-   npm or yarn
-   A local MySQL server instance
-   A Stripe account with access to the Terminal

### **2. Clone the Repository**

```shell
git clone git@github.com:hsumudupriya/nextjs-with-stripe-terminals.git
cd nextjs-with-stripe-terminals
```

### **3. Install Dependencies**

```shell
npm install
```

### **4. Set Up Environment Variables**

Create a `.env.local` file in the root of your project by copying the example file:

```shell
cp .env.example .env.local
```

Now, open `.env.local` and fill in the values:

```
# MySQL Database Connection Details
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=your_local_mysql_user
DB_PASS=your_local_mysql_password
DB_NAME=donations_db

# Stripe API Keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test*...
STRIPE_SECRET_KEY=sk_test...

# Stripe Terminal Reader ID (use a simulated reader for testing)
STRIPE_TERMINAL_READER_ID=tmr...
```

### **5. Configure the Database**

You also need a configuration file for the Sequelize CLI. Copy the example:

```shell
cp config/config.json.example config/config.json
```

Open `config/config.json` and update the development section with your local database credentials.

### **6. Create and Migrate the Database**

Run the following scripts to create the database in MySQL and apply the table schemas:

```shell
npm run db:create
npm run db:migrate
```

### **7. Run the Development Server**

You're all set! Start the Next.js development server:

```shell
npm run dev
```

### **8. Simulate the card payments on the Stripe terminal**

Make a `POST` request to the `api/test-helpers/terminal/simulate-payment` API endpoint with a test card number to simulate a card payment on the terminal:

```shell
curl --location 'http://localhost:3000/api/terminal/simulate-payment' \
--header 'Accept: application/json' \
--data '{
    "card": "378282246310005"
}'
```

The application should now be running at http://localhost:3000.

## **Available Scripts**

-   `npm run dev`: Starts the application in development mode.
-   `npm run build`: Creates an optimized production build of the application.
-   `npm run start`: Starts the production server (requires a build to be run first).
-   `npm run db:create`: Creates the database specified in your config.json.
-   `npm run db:migrate`: Runs all pending database migrations.
-   `npm run db:migrate:undo`: Rolls back the most recent database migration.

## **Deployment**

This application is designed to be deployed to modern cloud platforms like Render or traditional hosting environments like cPanel.

### **Option 1: Deploying to Render (Recommended)**

Render is a modern cloud platform that makes deployment simple.

1. **Deploy a MySQL Database:** On Render, create a new **Private Service** using the `mysql:latest` Docker image. Add a persistent disk mounted to `/var/lib/mysql` and configure your database credentials as environment variables.
2. **Deploy the Web Service:**
    - Create a new **Web Service** and connect it to your Git repository.
    - Set the **Runtime** to `Node`.
    - Use the following **Build Command**: \
      `cp config/config.json.example config/config.json; npm install --production=false; npm run build; npm run db:migrate`
    - Use `npm start` as the **Start Command**.
    - Add all necessary environment variables, using the **Internal Connection URL** from your database service for the `DATABASE_URL`.
3. Render will automatically build, migrate the database, and deploy your application.

### **Option 2: Deploying to cPanel**

This requires a custom server file and .htaccess configuration.

1. **Configure basePath:** If deploying to a subdirectory (e.g., `/app/donate`), set the `basePath` in `next.config.js`: \
   `basePath: process.env.NODE_ENV === 'production' ? '/app/donate' : ''`
2. **Create `server.js`:** Create a custom `server.js` file in your project root to act as an adapter for cPanel's environment. \
   `cp server.example.js server.js`
3. **Setup Node.js App:** Use the "Setup Node.js App" tool in cPanel, pointing it to your `server.js` file.
4. **Upload Files:** Build the app locally (`npm run build`), then upload the `.next`, `node_modules`, `public`, `package.json`, and `server.js` files and folders.
5. **Configure `.htaccess`:** Add RewriteRules to your root `.htaccess` file to proxy requests for the subdirectory to your running Node.js application. Use the `.htaccess.example` file for inspiration.

## **Key Concepts & Learnings**

-   **Server-Driven Stripe Flow:** All sensitive Stripe operations are handled on the backend via API routes. The frontend never touches the secret key, making the application secure.
-   **Manual Payment Capture for Terminals:** To reliably process terminal payments, the flow must be:
    1. Create a Payment Intent with `capture_method: 'manual'`.
    2. Process the payment on the reader (authorizes the card).
    3. Capture the Payment Intent on the server to finalize the charge.
-   **Starting Subscriptions from a Terminal Payment:** To avoid double-charging, the initial terminal payment is treated as the first payment of the subscription. The subscription is then created with a `billing_cycle_anchor` set one month in the future.
-   **Environment-Specific Configuration:** Using `NODE_ENV` checks and a `use_env_variable` key in `config/config.json` allows the application to adapt its configuration for development, production, and different deployment targets.
-   **Atomic Deployments:** By including `npm run db:migrate` in the build command on Render, we ensure that the database schema is always in sync with the application code, making deployments safer and more reliable.

## **Pages**

### **Page 1**

![Page 1](https://github.com/hsumudupriya/nextjs-with-stripe-terminals/raw/main/public/images/pages/page_1.jpg 'Page 1')

### **Page 2**

![Page 2](https://github.com/hsumudupriya/nextjs-with-stripe-terminals/raw/main/public/images/pages/page_2.jpg 'Page 2')

### **Page 3**

![Page 3](https://github.com/hsumudupriya/nextjs-with-stripe-terminals/raw/main/public/images/pages/page_3.jpg 'Page 3')

### **Page 4**

![Page 4](https://github.com/hsumudupriya/nextjs-with-stripe-terminals/raw/main/public/images/pages/page_4.jpg 'Page 4')

### **Page 5 - Donation Successful**

![Page 5 - Donation Successful](https://github.com/hsumudupriya/nextjs-with-stripe-terminals/raw/main/public/images/pages/page_5-successful.jpg 'Page 5 - Donation Successful')

### **Page 5 - Donation Failed**

![Page 5 - Donation Failed](https://github.com/hsumudupriya/nextjs-with-stripe-terminals/raw/main/public/images/pages/page_5-failed.jpg 'Page 5 - Donation Failed')
