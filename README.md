# 🏠 BashaVara (বাসাভাড়া) — Student Housing & Roommate Matching Platform

> **A modern, secure student housing platform tailored for verified university communities.**  
> Built with **Next.js 16 (React 19)**, a standalone **Express.js API**, **BetterAuth**, and a **MySQL** relational database.

---

## 📐 System Architecture Diagram

```mermaid
graph TD
    subgraph Client ["Client Browser (localhost:3000 / Vercel)"]
        UI["Next.js 16 UI<br/>(Tailwind CSS & DaisyUI)"]
        ClientAuth["BetterAuth Client<br/>(credentials: 'include')"]
        UniversalAPI["lib/api.js Fetch Wrapper<br/>(Cookie Forwarding)"]
    end

    subgraph ServerApp ["Next.js Server (SSR / Server Components)"]
        SessionHelper["lib/session.js<br/>(Server getSession)"]
        RouteGuards["Role Route Guards<br/>(Student & Landlord Layouts)"]
    end

    subgraph BackendAPI ["Express API Server (localhost:5000 / Render / Railway)"]
        ReverseProxy["trust proxy (1)"]
        HelmetMW["Helmet Security Headers"]
        RateLimiters["Global, Write & Auth Rate Limiters"]
        BetterAuthServer["BetterAuth Handler<br/>(/api/auth/*splat)"]
        AuthMiddleware["requireAuth & requireRole Middleware"]
        ListingsRoute["routes/listings.js"]
        RequestsRoute["routes/requests.js"]
        ReviewsRoute["routes/reviews.js"]
        RoommatesRoute["routes/roommates.js"]
        StatsRoute["routes/stats.js"]
        ErrorHandler["Centralized Express Error Handler"]
    end

    subgraph DatabaseEngine ["MySQL Database (localhost:3306 / Aiven / Railway / PlanetScale)"]
        DB[("MySQL 8 Database<br/>• user & session<br/>• roommate_profiles<br/>• listings & amenities<br/>• requests (unified)<br/>• reviews")]
    end

    UI --> ClientAuth & UniversalAPI
    UniversalAPI --> ServerApp
    ServerApp --> ReverseProxy
    ClientAuth --> ReverseProxy
    ReverseProxy --> HelmetMW --> RateLimiters --> BetterAuthServer & AuthMiddleware
    AuthMiddleware --> ListingsRoute & RequestsRoute & ReviewsRoute & RoommatesRoute & StatsRoute
    ListingsRoute & RequestsRoute & ReviewsRoute & RoommatesRoute & StatsRoute --> DB
    BetterAuthServer --> DB
    ListingsRoute & RequestsRoute & ReviewsRoute & RoommatesRoute & StatsRoute --> ErrorHandler
```

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | [Next.js 16](https://nextjs.org/) (App Router), React 19, Tailwind CSS v4, DaisyUI |
| **Backend API** | [Express.js](https://expressjs.com/), [BetterAuth](https://www.better-auth.com/), Helmet, Express-Rate-Limit |
| **Database & ORM** | [MySQL 8](https://www.mysql.com/), `mysql2/promise` (Parameterized queries only) |
| **Validation** | [Zod](https://zod.dev/) for strict runtime request schema validation |
| **Authentication** | Session cookie-based authentication with role enforcement (`student` / `landlord`) |

---

## 🚀 Local Development Setup

### 1. Prerequisites
- **Node.js**: v18+ (v20+ recommended)
- **MySQL Server**: running locally on port `3306` (or a remote MySQL connection URL)

---

### 2. Backend API Setup (`bashavara-api/`)

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd bashavara-api
   npm install
   ```

2. Configure environment variables in `bashavara-api/.env`:
   ```env
   PORT=5000
   DATABASE_URL=mysql://root:password@localhost:3306/bashavara
   BETTER_AUTH_SECRET=your_32_char_secret_key_here_12345678
   BETTER_AUTH_URL=http://localhost:5000
   FRONTEND_URL=http://localhost:3000
   NODE_ENV=development
   ```

3. Initialize and seed the MySQL database:
   ```bash
   # Create database tables (schema.sql)
   npm run migrate

   # Populate with demo student & landlord listings, requests, and reviews (seed.sql)
   npm run seed
   ```

4. Start the backend API dev server:
   ```bash
   npm run dev
   # API running on http://localhost:5000
   ```

---

### 3. Frontend Next.js Setup

1. In the project root directory, install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables in `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```

3. Start the Next.js development server:
   ```bash
   npm run dev
   # Frontend running on http://localhost:3000
   ```

---

## 🌐 Production Deployment Guide

### A. Database Deployment (Aiven, Railway, or PlanetScale)
1. Provision a **MySQL 8** database instance on [Aiven](https://aiven.io/), [Railway](https://railway.app/), or [PlanetScale](https://planetscale.com/).
2. Copy the connection URI (e.g. `mysql://user:pass@host:port/dbname?ssl-mode=REQUIRED`).
3. Run migrations and seeds against your production database:
   ```bash
   DATABASE_URL="your-production-database-url" npm run migrate
   DATABASE_URL="your-production-database-url" npm run seed
   ```

---

### B. Backend API Deployment (Render or Railway)

#### Deploying on Render:
1. Connect your Git repository to **[Render](https://render.com/)**.
2. Create a new **Web Service** with the Root Directory set to `bashavara-api`.
3. Set the Build Command to `npm install` and Start Command to `npm start`.
4. Add the following **Environment Variables**:
   | Variable | Example Value | Notes |
   |---|---|---|
   | `NODE_ENV` | `production` | Enables secure cookies & production optimizations |
   | `PORT` | `5000` | Port used by Express |
   | `DATABASE_URL` | `mysql://...` | Connection URI from your hosted database |
   | `BETTER_AUTH_SECRET` | *(Random 32+ char string)* | Encryption secret for BetterAuth |
   | `BETTER_AUTH_URL` | `https://bashavara-api.onrender.com` | Public URL of your deployed API |
   | `FRONTEND_URL` | `https://bashavara.vercel.app` | Public URL of your deployed Next.js app |
   | `COOKIE_SAME_SITE` | `none` | Required for cross-site cookie transmission |
   | `COOKIE_SECURE` | `true` | Requires HTTPS for cookie transmission |

---

### C. Frontend Deployment (Vercel)
1. Import the root repository to **[Vercel](https://vercel.com/)**.
2. Framework Preset: **Next.js**.
3. Add the Environment Variable:
   - `NEXT_PUBLIC_API_URL`: `https://bashavara-api.onrender.com` (Your deployed API URL).
4. Deploy!

---

## 🍪 Cross-Site Cookies & Troubleshooting in Production

When the frontend and backend are hosted on different domains (e.g., `bashavara.vercel.app` and `bashavara-api.onrender.com`):

1. **`SameSite: None` and `Secure: true`**:
   The backend BetterAuth configuration automatically enables `sameSite: "none"` and `secure: true` when `NODE_ENV=production` or `COOKIE_SAME_SITE=none`.
2. **Reverse Proxy Trust**:
   `app.set("trust proxy", 1)` is enabled in [`index.js`](file:///f:/BashaVara%20-%20Web/bashavara/bashavara-api/index.js) so Express correctly identifies HTTPS headers forwarded by Render/Railway.
3. **CORS Headers**:
   The backend sends `Access-Control-Allow-Origin: https://bashavara.vercel.app` and `Access-Control-Allow-Credentials: true`.
4. **Fetch Credentials**:
   All client fetch calls use `credentials: "include"`, and server-side components forward cookies through [`src/lib/session.js`](file:///f:/BashaVara%20-%20Web/bashavara/src/lib/session.js) and [`src/lib/api.js`](file:///f:/BashaVara%20-%20Web/bashavara/src/lib/api.js).

---

## 🧪 Automated End-to-End User Flow & Security Verification

You can test the entire lifecycle (Student registration, Landlord registration, listing creation, request sending/accepting, verified reviews, and route guard isolation) using the built-in test suite:

```bash
cd bashavara-api
# Test against local server
node test-flow.js

# Or test against deployed production API
API_URL=https://bashavara-api.onrender.com node test-flow.js
```

### Verified Lifecycle Steps:
- [x] **Student Registration**: Validates `.edu` domain requirement.
- [x] **Landlord Registration**: Validates required `phone` and `businessName`.
- [x] **Listing Creation**: Landlord creates property with Zod schema validation.
- [x] **Contact Request**: Student submits inquiry; contact email remains private (`pending`).
- [x] **Request Acceptance**: Landlord accepts request; contact email is unlocked (`accepted`).
- [x] **Tenant Review**: Student submits 1–5 star review and feedback.
- [x] **Security Guard Check**: Confirms student cannot access landlord endpoints (`403 Forbidden`).
- [x] **Ownership Check**: Confirms landlord cannot modify another landlord's listing (`403 Forbidden`).

---

## 📄 License & Attribution
MIT License © 2026 BashaVara. Student housing, simplified.
