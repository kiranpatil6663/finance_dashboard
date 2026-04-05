# Finance Dashboard Backend

## Overview

Finance Dashboard Backend is a RESTful API backend built using the MERN Stack (MongoDB, Express.js, Node.js).

It powers a finance dashboard system where different users interact with financial records based on their role. The system supports storage and management of financial entries, user roles, permissions, and summary level analytics — designed to serve data to a frontend dashboard in a clean and efficient way.

Built as part of a backend assessment. I designed this system around fintech principles — audit logging, soft deletes, and strict role enforcement — because financial data requires traceability, not just functionality.

## Features

### Authentication and Authorization
- Secure role based login system for Admin, Analyst, and Viewer
- Implemented JWT and bcrypt for password encryption and session management
- Token expiry set to 7 days for security

### Admin Dashboard APIs
- Manage users and their roles
- Activate and deactivate user accounts
- Full access to all financial records

### Financial Records Management
- Create, view, update, and soft delete transactions
- Filter by type, category, and date range
- Pagination support for large datasets
- Soft delete used instead of hard delete — financial records are never permanently removed

### Dashboard Summary APIs
- Total income, total expense, net balance, savings rate
- Category wise spending and income totals
- Monthly income vs expense trends
- Recent activity feed

### Analyst Insights
- Highest spending category
- Highest income category
- Average transaction amounts
- Total transaction count

### Access Control
- Viewer: Can view transactions and dashboard data
- Analyst: Can view records, dashboard, and access insights
- Admin: Full access including create, update, delete, and user management

### Audit Logging
- Every critical action is logged — create, update, delete transactions, role changes, user activation and deactivation
- Each log stores who performed the action, what was done, and when

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| Authentication | JWT + bcryptjs |
| Deployment | Render |
| Version Control | Git, GitHub |

## Project Structure

\`\`\`
backend/
│
├── config/
│   └── db.js
│
├── controllers/
│   ├── authController.js
│   ├── adminController.js
│   ├── transactionController.js
│   ├── dashboardController.js
│   └── analystController.js
│
├── middleware/
│   ├── authAdmin.js
│   ├── authAnalyst.js
│   └── authViewer.js
│
├── models/
│   ├── User.js
│   ├── Transaction.js
│   └── AuditLog.js
│
├── routes/
│   ├── authRoute.js
│   ├── adminRoute.js
│   ├── transactionRoute.js
│   ├── dashboardRoute.js
│   └── analystRoute.js
│
├── utils/
│   └── apiResponse.js
│
├── .env.example
├── server.js
└── README.md
\`\`\`

## How to Run Locally

### 1. Clone the Repository
\`\`\`
git clone https://github.com/your-username/finance-dashboard.git
cd finance-dashboard
\`\`\`

### 2. Install Dependencies
\`\`\`
npm install
\`\`\`

### 3. Set Up Environment Variables
Create a \`.env\` file in the backend folder:
\`\`\`
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
\`\`\`

### 4. Run the Server
\`\`\`
npm run server
\`\`\`

Server runs at \`http://localhost:5000\`

## API Endpoints

### Auth Routes
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | /api/auth/register | Public | Register new user |
| POST | /api/auth/login | Public | Login and get token |

### Admin Routes
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | /api/admin/users | Admin | Get all users |
| POST | /api/admin/update-role | Admin | Update user role |
| POST | /api/admin/toggle-status | Admin | Activate or deactivate user |

### Transaction Routes
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | /api/transactions/create | Admin | Create transaction |
| GET | /api/transactions/list | All | Get transactions with filters |
| POST | /api/transactions/update | Admin | Update transaction |
| POST | /api/transactions/delete | Admin | Soft delete transaction |

### Dashboard Routes
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | /api/dashboard/summary | All | Total income, expense, balance, savings rate |
| GET | /api/dashboard/categories | All | Category wise totals |
| GET | /api/dashboard/trends | All | Monthly income vs expense trends |
| GET | /api/dashboard/recent | All | Last 5 transactions |

### Analyst Routes
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | /api/analyst/insights | Analyst and Admin | Spending and income insights |

## Role Based Access Control

| Action | Viewer | Analyst | Admin |
|---|---|---|---|
| View transactions | ✅ | ✅ | ✅ |
| View dashboard | ✅ | ✅ | ✅ |
| View insights | ❌ | ✅ | ✅ |
| Create transaction | ❌ | ❌ | ✅ |
| Update transaction | ❌ | ❌ | ✅ |
| Delete transaction | ❌ | ❌ | ✅ |
| Manage users | ❌ | ❌ | ✅ |

## Assumptions and Design Decisions

- Soft delete used for transactions — financial records should never be permanently deleted
- Audit logging implemented for all critical actions because financial systems require traceability
- JWT tokens expire in 7 days for security
- Deactivated users cannot login even with a valid token
- Analyst role inherits all viewer permissions
- Admin role inherits all analyst and viewer permissions
- Pagination defaults to 10 records per page

## Future Enhancements

- Add rate limiting to prevent API abuse
- Write unit tests for middleware and controllers
- Add refresh token support alongside current JWT implementation
- Export transactions to CSV or PDF
- Add email notifications for role changes and account deactivation

## Author

Kiran A Patil
