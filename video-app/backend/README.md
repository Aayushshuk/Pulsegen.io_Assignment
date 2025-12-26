# Backend

## Setup
```bash
cd backend
cp .env.example .env
npm i
npm run dev
```
Seed an admin:
```bash
curl -X POST http://localhost:4000/api/auth/seed-admin
# login: admin@example.com / admin123
```
