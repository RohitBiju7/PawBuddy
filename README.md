# PawBuddy 🐾

PawBuddy is a **Pet Adoption Management System** developed as part of the ICTAK Full Stack Development with Gen AI course.

The project is designed to help adopters discover pets, allow shelter staff to manage pet records and adoption-related activities, and provide administrators with user and system management features.

## Problem Statement

Pet adoption processes are often handled through disconnected communication channels and manual record keeping. This can make it difficult for adopters, shelter staff, and administrators to efficiently manage pets, users, adoption requests, appointments, and related activities.

PawBuddy aims to provide a centralized web-based system for managing the pet adoption workflow.

## Target Users

- **Admin**
- **Shelter Staff**
- **Adopters**

## Main Features

### Authentication & User Management
- Adopter registration
- Login
- Password hashing using bcryptjs
- JWT-based authentication
- Protected routes
- Role-based authorization
- Logged-in user profile
- Admin creation of Shelter Staff accounts
- Admin view of all users
- Admin activation/deactivation of users

### Pet Management
- Add pets
- View all pets
- View individual pet details
- Update pet details
- Delete pets
- Filter pets by species, gender, and status
- Search pets by name or breed
- Staff/Admin-only pet management operations

### Planned Features
- Adoption application management
- Appointment scheduling for adoption/site visits
- Email notifications
- Adoption fee payments
- Donations
- Admin dashboard and statistics
- React frontend integration

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- bcryptjs
- JSON Web Token (JWT)
- CORS
- dotenv
- Nodemon

### Frontend
Planned using:

- React
- Vite
- Axios

The frontend authentication setup will use an Axios interceptor file named:

`axiosInterceptor.js`

## Project Structure

```text
PawBuddy/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── userController.js
│   │   └── petController.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── roleMiddleware.js
│   │
│   ├── models/
│   │   ├── userModel.js
│   │   └── petModel.js
│   │
│   ├── routes/
│   │   ├── userRoutes.js
│   │   └── petRoutes.js
│   │
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
└── README.md
```

## Environment Variables

Create a `.env` file inside the `backend` folder.

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

> Do not upload the `.env` file to GitHub.

## Installation and Setup

### 1. Clone the repository

```bash
git clone <your-repository-url>
```

### 2. Open the backend folder

```bash
cd PawBuddy/backend
```

### 3. Install dependencies

```bash
npm install
```

### 4. Create the `.env` file

Add:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### 5. Start the development server

```bash
npm run dev
```

The backend should run at:

```text
http://localhost:5000
```

## API Overview

### Authentication & User Management

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/users/register` | Public | Register a new adopter |
| POST | `/api/users/login` | Public | Login and receive JWT |
| GET | `/api/users/profile` | Authenticated | Get logged-in user profile |
| POST | `/api/users/staff` | Admin | Create Shelter Staff account |
| GET | `/api/users` | Admin | View all users |
| PATCH | `/api/users/:id/status` | Admin | Activate or deactivate a user |

### Pet Management

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/pets` | Admin / Staff | Add a new pet |
| GET | `/api/pets` | Public | View all pets |
| GET | `/api/pets/:id` | Public | View a single pet |
| PATCH | `/api/pets/:id` | Admin / Staff | Update pet details |
| DELETE | `/api/pets/:id` | Admin / Staff | Delete a pet |

### Pet Filtering and Search

Examples:

```text
GET /api/pets?species=dog
GET /api/pets?status=available
GET /api/pets?species=cat&gender=female
GET /api/pets?search=bruno
GET /api/pets?search=labrador
GET /api/pets?species=dog&status=available&search=labrador
```

## Authentication Flow

```text
Login
  ↓
Credentials verified
  ↓
JWT generated
  ↓
Client sends token in Authorization header
  ↓
Authentication middleware verifies token
  ↓
Logged-in user attached to req.user
  ↓
Role middleware checks permissions
  ↓
Protected controller executes
```

Protected API requests use:

```text
Authorization: Bearer <JWT_TOKEN>
```

## Current Development Status

### Authentication & User Management
- ✅ User model
- ✅ Adopter registration
- ✅ Login
- ✅ JWT generation
- ✅ Authentication middleware
- ✅ Logged-in user profile
- ✅ Role-based authorization
- ✅ Admin creates Shelter Staff
- ✅ Admin views users
- ✅ Admin activates/deactivates users
- ✅ API testing completed

### Pet Management
- ✅ Pet model
- ✅ Add pet
- ✅ View all pets
- ✅ View single pet
- ✅ Update pet
- ✅ Delete pet
- ✅ Filter/search pets
- ✅ Staff/Admin route protection
- ✅ CRUD API testing completed

## API Testing

Backend APIs have been tested using **Thunder Client**.

Testing includes:

- Successful and failed registration
- Email format validation
- Password validation
- Duplicate account prevention
- Login success/failure
- JWT-protected routes
- Role-based access checks
- Staff account creation
- User activation/deactivation
- Full Pet CRUD operations
- Pet filtering and search

## Database Models

Currently implemented:

- `User`
- `Pet`

Planned:

- `Adoption`
- `Appointment`
- `Payment/Donation`

## Review 1 Progress

The current project includes:

- Node.js + Express backend setup
- MongoDB/Mongoose connection
- User and Pet schemas/models
- Authentication APIs
- JWT authentication and authorization middleware
- Full Pet Management CRUD APIs
- Request validation and basic error handling
- Thunder Client API testing
- Database/schema planning
- Major frontend page and backend API planning

## Author

Developed as part of the ICTAK Full Stack Development with Gen AI project.

## License

This project is currently intended for educational purposes.
