<p align="center" style="background:#f3f4f6;padding:20px 0;border-radius:12px;">
  <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="Amazon Logo" width="200"/>
</p>

# 🛒 Amazon Clone

> A full-stack, production-grade Amazon e-commerce clone. Built with a modern React frontend (Vite, Material UI, Framer Motion), robust Node.js/Express backend, Prisma ORM, Supabase/PostgreSQL, Stripe payments, and Firebase authentication. Designed for scalability, security, and a seamless user experience—showcasing best practices for enterprise-level web applications.

---

## 🚀 Live Demo

- **Frontend:** [View Live Site](https://amazon-clone-frontend-phi.vercel.app/)
- **Backend:** [GitHub Backend API](https://github.com/Tesfamichael12/Amazon-Clone/tree/main/amazon-api)

---

## 🖥️ Tech Stack

### Frontend

<p align="left">
  <img src="https://skillicons.dev/icons?i=react,vite,js,css,materialui,redux" height="32" alt="Frontend stack"/>
  <img src="https://img.shields.io/badge/Framer%20Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion"/>
  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-1mMem06E8Ef9Esxqs9kg32G6Zxfq8EHF7Q&s" height="32" alt="Dribbble logo"/>
</p>

<sub><b>Some UI pages inspiration from <a href="https://dribbble.com/">Dribbble</a></b></sub>

- **React** (Vite, JSX, CSS Modules)
- **Material UI** (MUI)
- **Framer Motion** (animations)
- **React Toastify**, **SweetAlert2** (notifications)
- **React Context API** (state management)

### Backend

<p align="left">
  <img src="https://skillicons.dev/icons?i=nodejs,express,prisma,postgres,supabase,firebase,sqlite" height="32" alt="Backend stack"/>
  <img src="https://img.shields.io/badge/Stripe-635BFF?style=for-the-badge&logo=stripe&logoColor=white" alt="Stripe"/>
</p>

- **Node.js** & **Express** (API server)
- **Prisma ORM** (type-safe DB access)
- **PostgreSQL** (production DB)
- **Supabase** (managed Postgres hosting)
- **SQLite** (local dev DB)
- **Firebase Admin SDK** (authentication)
- **Stripe** (payments)

---

## ☁️ Deployment

<p align="left">
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel"/>
  <img src="https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white" alt="Render"/>
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase"/>
  <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase"/>
</p>

- **Frontend:** Deployed on [Vercel](https://vercel.com/) for instant, global static hosting and serverless functions.
- **Backend:** Deployed on [Render](https://render.com/) for scalable Node.js API hosting.
- **Database:** [Supabase](https://supabase.com/) (managed Postgres, connection pooling, secure cloud storage).
- **Authentication & Functions:** [Firebase](https://firebase.google.com/) (Auth, Admin SDK, and optional serverless functions).

---

## 🚦 Performance & SEO

![alt text](/img/light-house-ranking.png)

<ul>
  <li><b>Excellent Lighthouse SEO score (100)</b> and strong accessibility (96)</li>
  <li>Performance and Best Practices improved with <b>preconnect</b>, <b>preload</b>, and <b>optimized meta tags</b></li>
  <li>Open Graph and Twitter meta tags for rich social sharing</li>
  <li>robots.txt and meta description for search engine indexing</li>
  <li>Production security headers (CSP, HSTS, XFO, COOP) via <code>vercel.json</code></li>
  <li>Source maps enabled for production debugging</li>
  <li>Critical images preloaded and Google Fonts optimized with <code>display=swap</code></li>
  <li>Performance-optimized React code using <code>useMemo</code> and <code>useCallback</code> in key pages</li>
</ul>

## ✨ Features

- 🔐 **Secure Authentication:** Firebase Auth (email/password, Google sign-in)
- 🛍️ **Product Browsing:** Browse, search, and filter products by category
- 🛒 **Shopping Cart:** Add, remove, and update items in real time
- 💳 **Checkout & Payment:** Stripe integration for secure payments
- 🚚 **Order Tracking:** View order history and delivery status (orders saved to backend DB)
- 🎁 **Promo Codes & Discounts:** Apply discount codes at checkout
- 📦 **Shipping Details:** Full address, contact, and region support
- 🧾 **Order History:** Modern, responsive grid with clear labels and truncated titles
- 🧑‍💼 **User Account Page:** View and manage personal info, sign out, see order history
- 🛡️ **Backend Auth Middleware:** All order/payment endpoints protected by Firebase token verification
- 🗄️ **Persistent State:** Cart and user info saved in localStorage
- 📱 **Responsive Design:** Mobile-first, works on all devices
- ⚡ **Fast & Modern UI:** Built with Vite, React, modular CSS, and Framer Motion
- 🧑‍💻 **Admin-Ready:** Backend and DB structure ready for admin features, user management, and analytics

---

## 🛠️ Local Development & Setup

### 1. Clone the repo

```bash
git clone https://github.com/Tesfamichael12/Amazon-Clone.git
cd Amazon-Clone
```

### 2. Install dependencies (frontend)

```bash
npm install
```

### 3. Install dependencies (backend)

```bash
cd amazon-api
npm install
```

### 4. Environment Variables

#### Frontend (`.env` in root or `/src` if needed)

```
VITE_REACT_APP_BACKEND_URL=your_backend_url
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
```

#### Backend (`amazon-api/.env`)

```
STRIPE_SECRET_KEY=sk_test_...
CLIENT_URL=http://localhost:5173
PORT=5000
DATABASE_URL=your_database_url # SQLite for dev, Postgres/Supabase for prod
```

> See `amazon-api/README.md` for full backend setup, including Prisma migrations and Supabase/Postgres deployment.

### 5. Start the apps

- **Frontend:**
  ```bash
  npm run dev
  ```
- **Backend:**
  ```bash
  cd amazon-api
  npm start
  ```

---

---

## 🙌 Credits

- Built by [Tesfamichael Tafere](https://tesfamichael-tafre.netlify.app/)
- Inspired by Amazon.com UI/UX
- Some UI inspiration from [Dribbble](https://dribbble.com/)

---