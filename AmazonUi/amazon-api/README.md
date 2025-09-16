# 🛒 Amazon Clone Backend (`amazon-api`)

This folder contains the **backend API** for the Amazon Clone project, built with Node.js, Express, Prisma (SQLite for dev, Postgres/Supabase for deployment), Stripe, and Firebase Admin for authentication.

---

## 🛠️ Tech Stack

<p align="left">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js"/>
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma"/>
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase"/>
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL"/>
  <img src="https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white" alt="SQLite"/>
  <img src="https://img.shields.io/badge/Stripe-635BFF?style=for-the-badge&logo=stripe&logoColor=white" alt="Stripe"/>
  <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase"/>
</p>

---

## ✨ Features

- 🔐 User authentication with Firebase
- 🧾 Order creation & retrieval (with Stripe payment integration)
- 🗄️ SQLite (dev) / Postgres (prod) database via Prisma ORM
- 🌱 Supabase as a managed Postgres provider for easy cloud deployment
- ⚡ Powered by Prisma ORM for type-safe database access
- 🔒 Secure endpoints (orders are user-specific)

---

## ⚡ Prerequisites

- 🟢 Node.js (v18+ recommended)
- 📦 npm (v9+ recommended)
- 🔥 Firebase project (for authentication)
- 💳 Stripe account (for payments)
- 🐘 [PostgreSQL](https://www.postgresql.org/) (for production/deployment)
- 🟩 [Supabase](https://supabase.com/) (for managed Postgres hosting)

---

## 🚀 Setup Instructions

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Tesfamichael12/Amazon-Clone.git
cd Amazon-Clone/amazon-api
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Environment Variables

Create a `.env` file in the `amazon-api` folder with the following:

```env
STRIPE_SECRET_KEY=sk_test_...
FIREBASE_SERVICE_ACCOUNT_KEY=./serviceAccountKey.json
# For SQLite (development):
DATABASE_URL="file:./dev.db"
# For Postgres (production):
# DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
```

- `STRIPE_SECRET_KEY`: Your Stripe secret key
- `FIREBASE_SERVICE_ACCOUNT_KEY`: Path to your Firebase service account JSON file (download from Firebase Console > Project Settings > Service Accounts)
- `DATABASE_URL`: Connection string for your database (SQLite for dev, Postgres for prod)

### 4️⃣ Add Firebase Service Account

- Download your Firebase service account JSON file and place it in the `amazon-api` folder as `serviceAccountKey.json`.

### 5️⃣ Database Setup (Prisma)

#### Development (SQLite)

1. The project uses SQLite for local development. The schema is defined in `prisma/schema.prisma`.
2. To set up the database and generate the Prisma client:
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

#### Production (Postgres/Supabase)

1. Update your `.env` and `prisma/schema.prisma` to use your Postgres `DATABASE_URL` (can be a Supabase connection string).
2. Run:
   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```
3. If switching from SQLite to Postgres, delete the `prisma/migrations` folder and `prisma/migration_lock.toml` before running migrations.
4. For Supabase, use the connection pooler string for local development and direct connection for production if possible.

### 6️⃣ Start the Backend Server

```bash
npm start
```

- The server will run on [http://localhost:5000](http://localhost:5000) by default.

---

## 🚀 Production Deployment Checklist

- [ ] Set all environment variables in your production environment (see `.env.example`).
- [ ] Add your Firebase service account as a secret file (never commit it to git).
- [ ] Use a managed Postgres (e.g., Supabase) and update `DATABASE_URL` accordingly.
- [ ] Run `npx prisma migrate deploy` and `npx prisma generate` on your production server.
- [ ] Use HTTPS for all API endpoints (required for Stripe and secure auth).
- [ ] Set up CORS and rate limiting for security.
- [ ] Monitor logs and errors for any issues after deployment.

---

## 📡 API Endpoints

- `POST /api/orders` — Create a new order (requires Firebase auth and Stripe payment)
- `GET /api/orders` — Get all orders for the authenticated user

---

## 🛠️ Development Tips

- 🧪 Use [Postman](https://www.postman.com/) or [Insomnia](https://insomnia.rest/) to test endpoints.
- 🕵️‍♂️ Use [Prisma Studio](https://www.prisma.io/studio) to view your DB:

```bash
npx prisma studio
```

---

## 📝 Environment Example

Create a `.env.example` file for reference:

```env
STRIPE_SECRET_KEY=sk_test_...
FIREBASE_SERVICE_ACCOUNT_KEY=./serviceAccountKey.json
DATABASE_URL="file:./dev.db" # or your Postgres connection string
```

---

---

## ❓ Need Help?

For any issues, check the logs in your terminal or open an issue in the repository.
