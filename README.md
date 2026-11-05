# Laporan Express X Database

Express API using Prisma ORM 7 and PostgreSQL.

## Requirements

- Node.js `20.19+`, `22.12+`, or `24+`
- PostgreSQL

## Setup

1. Create a PostgreSQL database for this project.
2. Copy `.env.example` to `.env`, then set `DATABASE_URL` to your PostgreSQL connection string:

   ```text
   postgresql://USER:PASSWORD@localhost:5432/DATABASE?schema=public
   ```

3. Install dependencies and prepare the database:

   ```bash
   npm install
   npm run db:migrate
   npm run db:generate
   ```

4. Start the API:

   ```bash
   npm run dev
   ```

The API listens on `http://localhost:3000` by default. Set `PORT` in `.env` to use another port.

## Product API

- `GET /products` — list products
- `GET /products/:id` — get a product
- `POST /products` — create a product with JSON `{"name":"Notebook","price":12000}`
- `PUT /products/:id` — replace a product using the same JSON shape
- `DELETE /products/:id` — delete a product

Use `npm run db:studio` to inspect the database or `npm run typecheck` to check the TypeScript sources.
