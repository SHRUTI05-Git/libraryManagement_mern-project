# LibraCore Pro — Industry-Level MERN Library Management System

## Stack
- MongoDB + Mongoose
- Express.js + Node.js
- React 18 + React Router
- JWT authentication + role-based access control
- Nodemailer email notifications
- PDFKit PDF reports
- Recharts analytics
- Responsive CSS with dark mode

## Major features
- Admin and Student roles
- Admin dashboard with analytics
- Student dashboard and profile
- Book CRUD
- Member/student CRUD
- Issue and return books
- Automatic fine calculation
- Fine payment/status tracking
- Book reservations / waitlist
- Reservation cancellation
- Email notifications for issue, return, due reminders and reservations
- PDF catalogue and transaction reports
- Search/filter/sort
- Dark/light theme persisted in localStorage
- MongoDB seed data
- Protected routes and role middleware
- Profile management and password change
- Activity/transaction history

## Requirements
- Node.js 18+
- MongoDB local or MongoDB Atlas
- npm

## Backend
```bash
cd backend
npm install
copy .env.example .env
npm run seed
npm run dev
```

PowerShell:
```powershell
Copy-Item .env.example .env
```

## Frontend
In a second terminal:
```bash
cd frontend
npm install
npm start
```

Open http://localhost:3000

## Seed credentials
Admin:
- Email: admin@libracore.com
- Password: Admin@123

Students:
- Email: student1@libracore.com
- Password: Student@123
- Email: student2@libracore.com
- Password: Student@123

Change these passwords before real deployment.

## Email setup
Email sending is optional. Configure SMTP in backend/.env:
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
MAIL_FROM=

If SMTP values are blank, the system logs a message instead of sending an email.

## Fine rules
Default:
- Grace period: 0 days
- Fine: ₹5 per overdue day
- Fine is calculated when a book is returned.
You can change FINE_PER_DAY in .env.

## PDF reports
Admin can download:
- Book catalogue PDF
- Transaction report PDF

Routes:
- GET /api/reports/books
- GET /api/reports/transactions

## API overview

Auth:
POST /api/auth/register
POST /api/auth/login
GET /api/auth/me
PUT /api/auth/profile
PUT /api/auth/password

Books:
GET /api/books
POST /api/books
PUT /api/books/:id
DELETE /api/books/:id

Students:
GET /api/students
POST /api/students
PUT /api/students/:id
DELETE /api/students/:id

Circulation:
GET /api/transactions
POST /api/transactions/issue
PUT /api/transactions/:id/return

Reservations:
GET /api/reservations
POST /api/reservations
DELETE /api/reservations/:id

Dashboard:
GET /api/dashboard/admin
GET /api/dashboard/student

Reports:
GET /api/reports/books
GET /api/reports/transactions

## Production notes
For deployment:
1. Use MongoDB Atlas.
2. Use a strong JWT_SECRET.
3. Configure HTTPS.
4. Configure real SMTP.
5. Restrict CORS to the frontend domain.
6. Store secrets in environment variables.
7. Add rate limiting and request logging before public deployment.
