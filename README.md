# Code Master Pro

A coding interview practice platform built with Next.js, TypeScript, and Prisma. Practice problems, track progress, and prepare for technical interviews.

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up database:**
   ```bash
   cp .env.example .env
   npm run db:push
   npm run db:seed
   ```

3. **Run the app:**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## 🗄️ Database

- Uses SQLite for local development
- Schema managed with Prisma
- Seeded with 1500+ coding problems

## 🛠️ Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS
- **UI:** shadcn/ui, Lucide icons, Framer Motion
- **Backend:** Prisma ORM, NextAuth.js
- **Database:** SQLite (local), PostgreSQL (production)

## 📁 Project Structure

```
src/
├── app/          # Next.js pages and API routes
├── components/   # Reusable UI components
├── hooks/        # Custom React hooks
└── lib/          # Utilities and configurations
```
