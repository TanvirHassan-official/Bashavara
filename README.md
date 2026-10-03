# 🏠 BashaVara — Student Housing & Roommate Matching Platform
[![Live Site](https://img.shields.io/badge/Visit-BashaVara-orange?style=for-the-badge)](https://bashavara.vercel.app)

## 📌 Overview

**BashaVara** is a modern student housing platform that connects verified university students with landlords and compatible roommates. Students can browse rental listings with real rent and campus-distance details, send contact requests, read honest reviews, and match with roommates based on lifestyle preferences. Landlords can post and manage listings and respond to student inquiries from their own dashboard.

The platform focuses on trust and simplicity: students must register with a `.edu` email, landlords post listings directly, and contact emails are only revealed after a request is accepted.

---

## 🎯 Purpose

The goal of **BashaVara** is to make off-campus housing safer, clearer, and easier for university students.

The platform aims to:

* Help students find affordable rentals near campus
* Give landlords direct access to a verified student community
* Match students with compatible roommates
* Protect user privacy until both sides agree to connect
* Build accountability through transparent student reviews

---

## ✨ Key Features

### 🏘️ 1. Listing Discovery System

Browse student rentals with:

* Monthly rent and utility charges
* Walking distance to campus
* Bedrooms, bathrooms, and amenities
* Department relevance and availability date
* Photos and full property descriptions

Users can:

* Search by title, address, or description
* Filter by max rent, distance, bedrooms, department, and amenities
* Sort by most recent, rent, distance, or highest rated
* Open a detailed page for each listing

---

### 📩 2. Contact Request System

* Students send a **Request Contact** to a landlord from a listing page
* Landlords accept or decline requests from their dashboard
* Contact emails stay **hidden while a request is pending**
* Emails are **unlocked for both sides once a request is accepted**
* Students can also send roommate connection requests

---

### 👥 3. Smart Roommate Matching

* Set your budget, department, sleep schedule, smoking preference, and bio
* Save preferences to your profile
* See other students ranked by a **compatibility score** (smoking preference, sleep schedule, budget, department)
* Connect with a single click

---

### ⭐ 4. Reviews & Ratings

* Students can rate and review listings (1–5 stars)
* One review per student per listing
* Landlords cannot review their own property
* Average rating and review count shown on every listing

---

### 🔒 5. Authentication & Role-Based Access

Secure authentication with:

* Email & Password registration and login (BetterAuth)
* **Student accounts** require a valid `.edu` email
* **Landlord accounts** require a phone number (business name optional)
* Session cookie authentication
* Server-side route guards for student and landlord areas
* Ownership checks so landlords can only edit or delete their own listings

---

### 📊 6. Dashboards

#### Student Dashboard

* View incoming and outgoing requests
* Accept or decline incoming requests
* See unlocked contact emails for accepted connections
* Quick links to listings and roommates

#### Landlord Dashboard

* View all your listings and their status
* Create, edit, pause, mark as rented, re-list, or delete listings
* Review and respond to student requests grouped by listing
* See stats such as total listings, pending inquiries, and accepted connections

---

### 🎨 7. User Experience

* Fully responsive design
* Loading screen and skeleton states
* Custom 404 and error pages
* Success and error feedback messages
* SEO metadata on every page

---

## 🛠️ Technologies Used

* **Next.js 16** — Frontend framework & App Router
* **React 19** — UI library (with React Compiler enabled)
* **Express.js** — Standalone backend REST API
* **MySQL 8** — Relational database (`mysql2`, parameterized queries only)
* **BetterAuth** — Authentication & session management
* **Zod** — Request validation
* **Tailwind CSS v4** — Utility-first styling
* **DaisyUI** — UI components
* **JavaScript (ES6+)** — Application logic

---

## 🎯 Project Features

✅ Responsive Navbar & Footer  
✅ Landing Page with Live Stats & Recent Listings  
✅ Listing Search, Filters & Sorting  
✅ Dynamic Listing Details Page  
✅ Contact Request Flow with Email Privacy  
✅ Roommate Matching with Compatibility Score  
✅ Reviews & Ratings  
✅ Student Dashboard  
✅ Landlord Dashboard (Create / Edit / Pause / Delete Listings)  
✅ Authentication System (Register / Login / Logout)  
✅ `.edu` Email Enforcement for Students  
✅ Role-Based Protected Routes  
✅ Rate Limiting & Security Headers  
✅ Loading Animation  
✅ Custom 404 & Error Pages  
✅ SEO Metadata  
✅ Mobile, Tablet & Desktop Responsive Design  

---

## 🚀 Pages Included

| Page | Description |
|-------|-------------|
| 🏠 Home | Hero section, features, recent listings, how it works |
| 🏘️ Listings | All active listings with search, filters, and sorting |
| 📄 Listing Details | Full property info, reviews, and request contact |
| 👥 Roommates | Preference profile and ranked roommate matches |
| 📊 Student Dashboard | Incoming and outgoing requests |
| 🧑‍💼 Landlord Dashboard | Manage listings and student requests |
| ➕ Create Listing | Landlord form to publish a new listing |
| ✏️ Edit Listing | Update an existing listing |
| 🔑 Login | Student / landlord login |
| 📝 Register | Student / landlord registration |
| ❌ Not Found | Invalid route handling |

---

## 🔌 API Overview

| Area | Endpoints |
|-------|-----------|
| Auth | `/api/auth/*` (BetterAuth) |
| Listings | `GET /api/listings`, `GET /api/listings/:id`, `POST`, `PATCH /:id`, `PATCH /:id/status`, `DELETE /:id` (landlord only for writes) |
| Requests | `POST /api/requests`, `GET /api/requests/incoming`, `GET /api/requests/outgoing`, `PATCH /api/requests/:id` |
| Reviews | `GET` / `POST /api/listings/:id/reviews` |
| Roommates | `GET /api/roommates`, `GET` / `PUT /api/me/profile` |
| Stats | `GET /api/stats`, `GET /api/stats/landlord` |
| Health | `GET /health` |

---

## ⚙️ Setup Process

### 1. Prerequisites

* **Node.js** v20.9 or newer
* **XAMPP** (provides the local MySQL server) — [download here](https://www.apachefriends.org/)
* **Git**

---

### 2. Start XAMPP (MySQL)

1. Open the **XAMPP Control Panel**.
2. Click **Start** next to **MySQL**. It should turn green and run on port `3306`.
3. (Optional) Click **Start** next to **Apache** if you want to use **phpMyAdmin** at `http://localhost/phpmyadmin` to inspect the database.

> ⚠️ **MySQL must be running before you run the migration, seed, or backend server.** Otherwise you will get a connection error.

By default, XAMPP's MySQL user is `root` with an **empty password**, which is what the connection string below uses.

---

### 3. Clone the Repository

```bash
git clone <your-repository-url>
cd bashavara
```

---

### 4. Backend API Setup (`bashavara-api/`)

1. Install dependencies:

   ```bash
   cd bashavara-api
   npm install
   ```

2. Create a `.env` file in `bashavara-api/` (you can copy `.env.example`):

   ```env
   PORT=5000
   DATABASE_URL=mysql://root:@localhost:3306/bashavara
   BETTER_AUTH_SECRET=your_super_secret_key_minimum_32_characters
   BETTER_AUTH_URL=http://localhost:5000
   FRONTEND_URL=http://localhost:3000
   NODE_ENV=development
   ```

   > If you set a password for the XAMPP `root` user, use `mysql://root:yourpassword@localhost:3306/bashavara`.

3. Create the database tables:

   ```bash
   npm run migrate
   ```

4. (Optional) Load demo listings, reviews, and requests:

   ```bash
   npm run seed
   ```

   > ⚠️ The seed script **clears existing data** in the tables before inserting demo data. Demo users are created without passwords, so to log in, **register a new account** from the Register page.

5. Start the API server:

   ```bash
   npm run dev
   ```

   The API runs at **http://localhost:5000**. You can verify it at `http://localhost:5000/health`.

---

### 5. Frontend Setup (project root)

1. Open a **new terminal** in the project root and install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env.local` file in the project root:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```

3. Start the Next.js dev server:

   ```bash
   npm run dev
   ```

   The app runs at **http://localhost:3000**.

---

### 6. Quick Start Checklist

1. ✅ Start **MySQL** in XAMPP
2. ✅ `cd bashavara-api` → `npm run migrate` → (`npm run seed`) → `npm run dev`
3. ✅ In the project root → `npm run dev`
4. ✅ Open **http://localhost:3000**

---

### 📜 Available Scripts

**Frontend (root)**

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js in development mode |
| `npm run build` | Create a production build |
| `npm start` | Run the production build |
| `npm run lint` | Run ESLint |

**Backend (`bashavara-api/`)**

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the API with auto-restart |
| `npm start` | Start the API |
| `npm run migrate` | Create database tables from `schema.sql` |
| `npm run seed` | Load demo data from `seed.sql` |
| `npm run test:db` | Test the MySQL connection |

---

## 🧪 Testing the Full User Flow

With the API running, you can run the end-to-end lifecycle and security test:

```bash
cd bashavara-api
node test-flow.js
```

It verifies student and landlord registration, listing creation, request and acceptance, reviews, role isolation (`403` for students on landlord routes), and ownership checks.

---

## 🌐 Deployment

* **Database:** Any hosted MySQL 8 provider (Aiven, Railway, PlanetScale)
* **Backend API:** Render or Railway (root directory `bashavara-api`, start command `npm start`)
* **Frontend:** Vercel (set `NEXT_PUBLIC_API_URL` to your deployed API URL)

Production API environment variables:

| Variable | Notes |
|----------|-------|
| `NODE_ENV` | `production` |
| `DATABASE_URL` | Hosted MySQL connection URL |
| `BETTER_AUTH_SECRET` | Random string, 32+ characters |
| `BETTER_AUTH_URL` | Public URL of the deployed API |
| `FRONTEND_URL` | Public URL of the deployed frontend |
| `COOKIE_SAME_SITE` | `none` (cross-site cookies) |
| `COOKIE_SECURE` | `true` |

---

## 📱 Responsive Design

BashaVara is optimized for:

✔ Desktop  
✔ Tablet  
✔ Mobile Devices  

---

## 💻 Repository

📁 GitHub Repository:  
`https://github.com/TanvirHassan-official/Bashavara`

---
