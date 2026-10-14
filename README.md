# ShopSphere

A full-stack e-commerce web application built with **React** (frontend), **Node.js / Express** (backend) and **PostgreSQL on Neon** (database).

## Features

- **Authentication**: register, log in/out, JWT sessions, profile and password management
- **Catalog**: categories, featured products, product details with stock status
- **Search & filters**: keyword search, category, price range, in-stock, featured, 5 sort orders, pagination (all kept in the URL)
- **Cart**: works for guests (browser storage) and signed-in users (database); guest cart merges on login
- **Checkout & orders**: transactional checkout with stock locking, order history, order tracking, cancellation with stock restore
- **Reviews**: 1–5 star ratings with comments, average rating on cards
- **Admin dashboard**: revenue and order stats, low-stock alerts, product/category CRUD, order status management, user roles
- **UI**: responsive design, sticky navbar with search, footer with links and newsletter, accessible forms (labels, `id`, `name`, `placeholder`, ARIA)

## Project structure

```
com-e/
├── client/                 React + Vite frontend
│   └── src/
│       ├── api/            Axios client and API services
│       ├── components/     Reusable UI (layout, product, cart, admin, ui)
│       ├── context/        Auth and cart state
│       ├── hooks/          useAsync, useForm, useDebounce
│       ├── pages/          Route pages (and pages/admin)
│       ├── styles/         Design tokens and CSS
│       └── utils/          Formatting, constants, error helpers
└── server/                 Express REST API
    └── src/
        ├── config/         Environment and database pool
        ├── db/             schema.sql, migrate and seed scripts
        ├── middlewares/    Auth, validation, rate limiting, errors
        ├── modules/        Feature modules: routes → controller → service
        └── utils/          Shared helpers
```

## Getting started

### Prerequisites

- Node.js 20 or newer
- A free [Neon](https://neon.tech) PostgreSQL project

### 1. Backend

```bash
cd server
cp .env.example .env        # then fill in DATABASE_URL and JWT_SECRET
npm install
npm run db:migrate          # creates the tables
npm run db:seed             # adds categories, products and demo accounts
npm run dev                 # http://localhost:5000/api
```

Copy the connection string from the Neon dashboard (**Connection Details**). It must end with `?sslmode=require`.

### 2. Frontend

```bash
cd client
cp .env.example .env        # VITE_API_URL=http://localhost:5000/api
npm install
npm run dev                 # http://localhost:5173
```

### Demo accounts (created by the seed)

| Role     | Email                   | Password      |
| -------- | ----------------------- | ------------- |
| Admin    | ======   | ======  |
| Customer | ====== | ===== |

Change the admin credentials with `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `server/.env` before seeding.

## Environment variables

**server/.env**

| Variable         | Description                                  |
| ---------------- | -------------------------------------------- |
| `DATABASE_URL`   | Neon connection string (`sslmode=require`)   |
| `DB_POOL_MAX`    | Max database connections (default 10)        |
| `JWT_SECRET`     | Long random string used to sign tokens       |
| `JWT_EXPIRES_IN` | Token lifetime (default `7d`)                |
| `CLIENT_URL`     | Allowed frontend origin(s), comma-separated  |
| `ADMIN_EMAIL`    | Seeded admin email                           |
| `ADMIN_PASSWORD` | Seeded admin password                        |

**client/.env**

| Variable       | Description          |
| -------------- | -------------------- |
| `VITE_API_URL` | Base URL of the API  |

## API overview

| Method | Endpoint                     | Access      |
| ------ | ---------------------------- | ----------- |
| POST   | `/api/auth/register`         | Public      |
| POST   | `/api/auth/login`            | Public      |
| GET    | `/api/auth/me`               | User        |
| GET    | `/api/categories`            | Public      |
| GET    | `/api/products`              | Public      |
| GET    | `/api/products/:slug`        | Public      |
| POST   | `/api/products`              | Admin       |
| PUT    | `/api/products/:id`          | Admin       |
| DELETE | `/api/products/:id`          | Admin       |
| GET    | `/api/cart`                  | User        |
| POST   | `/api/orders`                | User        |
| GET    | `/api/admin/stats`           | Admin       |

See the requirements document for the complete endpoint list.
