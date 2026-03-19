# ThinkBox - Learning Management System API

A robust education platform API built with Node.js, Express, and MongoDB for managing courses, enrollments, and user interactions.

## Features

- **Authentication & Authorization** — JWT-based auth with 7-day token expiry
- **User Management** — Student, Teacher, and Admin roles with role-based access control
- **Course Management** — Full CRUD with ownership checks
- **Enrollment System** — Enroll / unenroll with duplicate protection
- **Payment Integration** — Session creation (Razorpay integration coming soon)
- **Security Hardened** — Helmet, rate limiting, CORS restrictions, field whitelisting
- **Structured Logging** — Pino logger with pretty-print in development
- **Linting & Testing** — ESLint (flat config) and Jest unit tests

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js |
| Framework | Express |
| Database | MongoDB + Mongoose |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| Security | Helmet, express-rate-limit, CORS |
| Logging | Pino + pino-pretty |
| Validation | express-validator |
| Testing | Jest |
| Linting | ESLint v9 (flat config) |

## Project Structure

```
src/
├── app.js                  # Express app entry point
├── config/
│   ├── database.js         # MongoDB connection
│   └── database.test.js    # Connection unit tests
├── controllers/
│   ├── authController.js   # Register, login, logout, getMe
│   ├── courseController.js  # CRUD for courses
│   ├── enrollmentController.js
│   ├── instructorController.js
│   ├── paymentController.js
│   └── userController.js
├── middleware/
│   ├── auth.js             # JWT authentication
│   ├── errorHandler.js     # Centralized error handling
│   └── roleMiddleware.js   # Role-based access control
├── models/
│   ├── Course.js
│   ├── Enrollment.js
│   ├── Payment.js
│   └── User.js
├── routes/
│   ├── auth.js
│   ├── courses.js
│   ├── enrollments.js
│   ├── instructors.js
│   ├── payments.js
│   └── users.js
├── services/
│   └── paymentService.js   # Payment logic (WIP)
└── utils/
    ├── jwtUtils.js         # Token generation & verification
    ├── logger.js           # Pino logger configuration
    └── passwordUtils.js    # bcrypt hashing helpers
```

## Getting Started

### Prerequisites

- Node.js >= 18
- MongoDB (local or Atlas)

### Installation

```bash
git clone <repository-url>
cd Thinkbox-backend
npm install
```

### Environment Setup

Create a `.env` file in the root directory:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_here
CORS_ORIGIN=http://localhost:3000
LOG_LEVEL=info
NODE_ENV=development
```

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `MONGO_URI` | MongoDB connection string (also accepts `MONGODB_URI` or `MONGODB_URL`) | — |
| `JWT_SECRET` | Secret key for signing JWTs | — |
| `CORS_ORIGIN` | Allowed origin for CORS | `*` |
| `LOG_LEVEL` | Pino log level (`debug`, `info`, `warn`, `error`) | `info` |
| `NODE_ENV` | Environment (`development` / `production`) | — |

### Running

```bash
# Development (with hot reload)
npm run dev

# Production
npm start
```

### Testing

```bash
npm test
```

### Linting

```bash
npm run lint
```

## API Endpoints

### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register a new student account |
| POST | `/api/auth/login` | No | Login and receive JWT |
| POST | `/api/auth/logout` | No | Logout |
| GET | `/api/auth/me` | Yes | Get current authenticated user |

### Users

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/users/:id` | Yes | Get user profile |
| PUT | `/api/users/:id` | Yes | Update user profile (own or admin) |
| DELETE | `/api/users/:id` | Yes | Delete user account (own or admin) |

### Courses

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/api/courses` | No | — | List all courses |
| GET | `/api/courses/:id` | No | — | Get course details |
| POST | `/api/courses` | Yes | Teacher/Admin | Create a course |
| PUT | `/api/courses/:id` | Yes | Teacher/Admin | Update a course |
| DELETE | `/api/courses/:id` | Yes | Teacher/Admin | Delete a course |

### Enrollments

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/enrollments` | Yes | Get user's enrollments |
| POST | `/api/enrollments/:courseId` | Yes | Enroll in a course |
| DELETE | `/api/enrollments/:courseId` | Yes | Cancel enrollment |

### Instructors

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/instructors` | No | List all instructors |
| GET | `/api/instructors/:id` | No | Get instructor profile & courses |

### Payments

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/payments/create-session` | Yes | Create a payment session (WIP) |

## Security

This API implements the following security measures:

- **Helmet** — Sets secure HTTP headers
- **Rate limiting** — 50 requests per 15 minutes on auth endpoints
- **CORS** — Configurable allowed origins via `CORS_ORIGIN`
- **JWT expiration** — Tokens expire after 7 days
- **Password hashing** — bcrypt with salt rounds of 10
- **Field whitelisting** — Registration, user updates, and course updates only accept allowed fields (prevents mass assignment / role escalation)
- **Error sanitization** — Internal error details are never exposed to clients
- **Body size limit** — JSON payloads limited to 1 MB

## Data Models

### User

| Field | Type | Notes |
|-------|------|-------|
| name | String | Required |
| email | String | Required, validated |
| password_hash | String | Never returned in API responses |
| role | Enum | `student` (default), `teacher`, `admin` |
| image | String | Optional, validated URL |
| expertise | String | Optional |
| rating | Number | 0–5 |
| bio / about | String | Optional |
| achievements | [String] | Optional |
| socialLinks | Object | linkedin, twitter URLs |

### Course

| Field | Type | Notes |
|-------|------|-------|
| title | String | Required |
| description | String | Required |
| category | String | Required |
| image | String | Required |
| duration | String | Required |
| price | Number | Required |
| modules | [Module] | Each contains lessons |
| instructor | ObjectId | Ref to User |

### Enrollment

| Field | Type | Notes |
|-------|------|-------|
| user | ObjectId | Ref to User |
| course | ObjectId | Ref to Course |
| enrolledAt | Date | Auto-set |
| completedAt | Date | Optional |

### Payment

| Field | Type | Notes |
|-------|------|-------|
| user | ObjectId | Ref to User |
| course | ObjectId | Ref to Course |
| amount | Number | Required |
| status | Enum | `pending`, `completed`, `failed` |

## Future Updates

- Quiz section after each lecture
- Comprehensive weekly performance reports
- Admin dashboard
- Teacher dashboard
- Full Razorpay payment integration

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a pull request

## Contact

For any inquiries, please contact [pranay.vishwakarma7400@gmail.com](mailto:pranay.vishwakarma7400@gmail.com).
