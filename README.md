# PawBuddy 🐾

PawBuddy is a full-stack pet adoption management system built with the MERN stack. It helps adopters discover pets, apply for adoption, schedule visits, and support shelters through donations, while giving staff and administrators tools to manage listings, applications, appointments, and user access.

## Overview

The platform is designed to centralize pet adoption workflows that are often scattered across manual communication, spreadsheets, and fragmented records. PawBuddy brings the workflow into one app with:

- a public pet catalog for adopters
- secure authentication and role-based access
- adoption application tracking
- staff/admin management tools
- appointment and complaint workflows
- donation and payment integration
- dashboard metrics for administrative oversight

## Target Users

- Adopters
- Shelter staff
- Administrators

## Key Features

### For Adopters
- Register and log in securely
- Browse all available pets
- Search and filter pets by species, gender, status, and name/breed
- View pet details and adoption readiness
- Submit adoption applications
- Track personal adoption requests and status
- Request pet visit appointments
- View profile and update personal details
- Make adoption fee and donation payments through Razorpay
- Submit complaints or feedback

### For Shelter Staff
- Add, update, and remove pet listings
- Manage adoption applications and staff notes
- Review and update appointment statuses
- View adoption and appointment reports
- Manage completed appointments and adoption-related records

### For Admins
- Create and manage staff accounts
- View all registered users
- Activate or deactivate user accounts
- Monitor adoption, appointment, and donation activity
- Review complaints submitted by adopters
- View system dashboard statistics

## Tech Stack

### Frontend
- React
- Vite
- React Router DOM
- Axios
- Material UI
- Recharts

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT for authentication
- bcryptjs for password hashing
- CORS
- dotenv
- Razorpay integration
- Nodemailer support
- Multer for file uploads

## Project Structure

```text
PawBuddy/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── .env
│   ├── createAdmin.js
│   ├── package.json
│   ├── server.js
│   └── ...
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   ├── vite.config.js
│   └── ...
├── docs/
│   └── project documentation files
├── .gitignore
├── README.md
└── package-lock.json (if present at repo root)
```

## Prerequisites

Before running the app, make sure you have:

- Node.js v18 or later
- npm
- MongoDB running locally or a MongoDB Atlas connection string

## Installation

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd PawBuddy
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Install frontend dependencies

```bash
cd ../frontend
npm install
```

## Environment Variables

Create a `.env` file in the `backend` folder and add the following:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/pawbuddy
JWT_SECRET=your_jwt_secret
CLIENT_ORIGIN=http://localhost:5173
```

You may also configure payment or mail-related environment variables if your deployment uses Razorpay or email notifications.

> Do not commit your `.env` file to GitHub.

## Running the Project

### Start the backend

```bash
cd backend
npm run dev
```

The backend will run at:

```text
http://localhost:5000
```

### Start the frontend

```bash
cd frontend
npm run dev
```

The frontend will run at:

```text
http://localhost:5173
```

### Create a default admin account

```bash
cd backend
node createAdmin.js
```

This creates a default admin user with:

- email: `admin@pawbuddy.com`
- password: `admin123`

## Authentication and Roles

PawBuddy uses JWT-based authentication with role-based access control.

Roles:
- `adopter`
- `staff`
- `admin`

Protected routes validate the token and enforce role permissions before allowing access.

## API Overview

### Authentication and User Management

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/users/register` | Public | Register a new adopter |
| POST | `/api/users/login` | Public | Log in and receive a JWT |
| GET | `/api/users/profile` | Authenticated | View logged-in user profile |
| PATCH | `/api/users/profile` | Adopter / Staff | Update user profile |
| POST | `/api/users/staff` | Admin | Create a staff account |
| GET | `/api/users` | Admin | View all users |
| PATCH | `/api/users/:id/status` | Admin | Activate or deactivate a user |

### Pet Management

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/pets` | Staff / Admin | Add a new pet |
| GET | `/api/pets` | Public | View all pets |
| GET | `/api/pets/:id` | Public | View pet details |
| PATCH | `/api/pets/:id` | Staff / Admin | Update a pet |
| DELETE | `/api/pets/:id` | Staff / Admin | Remove a pet |

### Adoption Management

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/adoptions` | Adopter | Apply for adoption |
| GET | `/api/adoptions/my` | Adopter | View own applications |
| GET | `/api/adoptions` | Staff / Admin | View all applications |
| PATCH | `/api/adoptions/:id/status` | Staff / Admin | Update application status |
| PATCH | `/api/adoptions/:id/notes` | Staff / Admin | Add staff notes |
| PATCH | `/api/adoptions/:id/complete` | Staff / Admin | Mark adoption as completed |
| DELETE | `/api/adoptions/:id` | Adopter | Cancel an application |

### Appointments

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/appointments` | Adopter | Request a visit appointment |
| GET | `/api/appointments/my` | Adopter | View own appointments |
| GET | `/api/appointments` | Staff / Admin | View all appointments |
| PATCH | `/api/appointments/:id/status` | Staff / Admin | Approve or reject appointment |
| PATCH | `/api/appointments/:id/complete` | Staff / Admin | Mark appointment as completed |
| PATCH | `/api/appointments/:id/cancel` | Adopter | Cancel own pending appointment |
| DELETE | `/api/appointments/:id` | Staff / Admin | Remove completed appointment |

### Payments and Donations

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/payments/adoption/create-order` | Adopter | Create Razorpay adoption fee order |
| POST | `/api/payments/adoption/verify` | Adopter | Verify adoption fee payment |
| GET | `/api/payments/adoption/:adoptionId` | Adopter | View adoption payment status |
| GET | `/api/payments/adoption/:adoptionId/staff` | Staff / Admin | View staff payment status |
| POST | `/api/payments/donation/create-order` | Adopter | Create donation order |
| POST | `/api/payments/donation/verify` | Adopter | Verify donation payment |
| GET | `/api/payments/donation/my` | Adopter | View own donations |
| GET | `/api/payments/donation` | Admin | View all successful donations |

### Complaints and Feedback

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/complaints` | Adopter | Submit feedback or complaint |
| GET | `/api/complaints/my` | Adopter | View own complaints |
| GET | `/api/complaints` | Admin | View all complaints |
| DELETE | `/api/complaints/:id` | Adopter | Delete own complaint |
| DELETE | `/api/complaints/:id/admin` | Admin | Delete complaint |

### Dashboard

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/dashboard/admin` | Admin | View summary metrics and system stats |

## Frontend Routes

The frontend application includes protected routes for each user type and role-specific dashboard pages:

- `/` — Home
- `/login` — Login
- `/register` — Registration
- `/pets` — Pet listing
- `/pets/:id` — Pet details
- `/profile` — User profile
- `/donate` — Donation page
- `/admin` — Admin dashboard
- `/admin/users` — User management
- `/admin/create-staff` — Staff creation
- `/admin/complaints` — Complaint management
- `/staff` — Staff dashboard
- `/staff/pets` — Pet management
- `/my-applications` — Adopter applications
- `/manage-adoptions` — Adoption management
- `/my-appointments` — Adopter appointments
- `/manage-appointments` — Staff/admin appointments
- `/my-complaints` — Adopter complaints

## Current Status

This project includes a working full-stack implementation with:

- secure user authentication and role management
- pet CRUD operations
- adoption lifecycle management
- appointment handling
- payment and donation workflows
- admin dashboard metrics
- frontend pages for adopter, staff, and admin roles

## Project Contributors

Developed as part of the ICTAK Full Stack Development with Gen AI project.

## License

This project is intended for educational and portfolio purposes.
