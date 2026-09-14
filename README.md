# CareSlot

A simple appointment booking system

**Stack:** NestJS + TypeScript + PostgreSQL (Prisma) 

---

## Architecture Overview

### Backend
- **NestJS** modular architecture with clear separation of concerns
- **Prisma** as the ORM with PostgreSQL
- **JWT** authentication + role-based authorization (`CLIENT` / `PROVIDER`)
- Modules: `Auth`, `Users`, `Slots`, `Bookings`
- Global `ValidationPipe`, Swagger documentation, and structured error handling

### Core Design Decisions
- All timestamps stored and compared in **UTC**
- Booking concurrency safety is enforced at the **database level** using a unique constraint on `Booking.slotId` + transactions
- Soft cancellation (`status: CANCELLED`) so slots become available again
- Client self-registration is restricted to `CLIENT` role only (no privilege escalation)

## Tech Stack

| Layer       | Technology              |
|------------|-------------------------|
| Backend    | NestJS + TypeScript     |
| Database   | PostgreSQL + Prisma     |
| Auth       | JWT + bcrypt            |
| Validation | class-validator         |
| Docs       | Swagger / OpenAPI       |
| Frontend   | React or Next.js        |
| Infra      | Docker Compose          |

---

## Setup Instructions

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- npm or yarn

### 1. Clone the repository
```bash
git clone <repo-url>
cd care-slot
```

### 2. Backend Setup
```bash
cp .env.example .env
# Edit .env if needed
```

### 3. Start PostgreSQL
```bash
docker-compose up -d postgres
```

### 4. Install dependencies & run migrations
```bash
npm install
npx prisma migrate dev
npx prisma db seed
```

### 5. Start the backend
```bash
npm run start:dev
```

Backend will be available at: http://localhost:3000

Swagger docs: http://localhost:3000/api

