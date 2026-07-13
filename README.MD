# Intern Project - User Management App

This project consists of a Node.js backend using Express and Prisma, and a React frontend built with Vite.

## Prerequisites

- Node.js (v18+ recommended)
- Database (Ensure you have a MariaDB/MySQL or PostgreSQL server running as configured in your `.env` file)

## Getting Started

### 1. Setup Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables by creating a `.env` file in the `backend` directory based on `.env.example`.
4. Run database migrations:
   ```bash
   npx prisma db push
   ```
5. Seed the database with initial data (this runs the script at `backend/prisma/seed.ts`):
   ```bash
   npx prisma db seed
   ```

6. Start the backend development server:
   ```bash
   npm run dev
   ```
   The backend server should now be running on port 3000 (or the port specified in your `.env`).

### 2. Setup Frontend

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```
   The frontend application will typically be available at `http://localhost:5173`.

## Default Credentials

If you ran the seed script, you can log in with the following admin credentials:

- **Username:** `admin`
- **Password:** `admin123`
