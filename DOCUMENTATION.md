# Military Asset Management System - Complete Documentation

## 1. Project Overview

### Description
The Military Asset Management System is a comprehensive web-based application designed to enable commanders and logistics personnel to manage critical military assets across multiple bases. The system tracks assets including vehicles, weapons, ammunition, and equipment, providing real-time visibility into opening balances, closing balances, net movements, assignments, and expenditures.

### Key Objectives
- **Transparency**: Provide clear visibility into asset movements across all bases
- **Accountability**: Maintain detailed audit logs of all transactions
- **Efficiency**: Streamline asset management and transfer processes
- **Security**: Implement role-based access control to protect sensitive data
- **Scalability**: Design for easy expansion to additional bases and asset types

### Assumptions
- Users are military personnel with valid credentials
- Assets are tracked at the base level
- All transactions must be logged for audit purposes
- Network connectivity to database is always available
- Administrators manage user accounts and initial setup

### Limitations
- Maximum 1000 concurrent users per deployment
- Asset tracking is at the batch level (not individual item level)
- No real-time GPS tracking of assets in transit
- Mobile application not included (web-responsive only)
- Reporting is real-time; historical data export requires separate process

---

## 2. Tech Stack & Architecture

### Frontend Architecture
- **Framework**: React 18.2.0
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Styling**: CSS3 with responsive design
- **State Management**: Local component state with local storage for session
- **Charts**: Chart.js with react-chartjs-2 (for future analytics)

### Why React?
- Component-based architecture for modularity
- Strong ecosystem with tools like React Router
- Easy to implement real-time updates and dynamic filtering
- Excellent performance with virtual DOM
- Active community and extensive documentation

### Backend Architecture
- **Runtime**: Node.js
- **Framework**: Express.js 4.18.2
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: 
  - Helmet.js for HTTP headers security
  - bcryptjs for password hashing
  - CORS with configurable origins
- **Logging**: Morgan + custom JSON file logging
- **Middleware**: body-parser, CORS, authentication

### Why Express & Node.js?
- Lightweight and fast
- Non-blocking I/O for handling concurrent requests
- JavaScript everywhere (same language frontend and backend)
- Rich middleware ecosystem
- Easy scalability with clustering

### Database Architecture
- **Choice**: MongoDB (NoSQL)
- **Driver**: Mongoose ODM
- **Connection**: Atlas cloud database

### Why MongoDB?
- **Flexible Schema**: Easy to add new fields without migrations
- **Asset Tracking**: Document structure naturally represents asset hierarchies
- **Scalability**: Horizontal scaling through sharding
- **Performance**: Faster read operations for dashboard queries
- **Audit Trail**: Embedded document history for tracking changes
- **JSON Native**: Direct mapping between frontend objects and database documents

### System Architecture Diagram

```
┌─────────────────────────┐
│   React Frontend        │
│  (Components & Pages)   │
└────────────┬────────────┘
             │ (HTTPS/Axios)
┌─────────────▼────────────┐
│   Express Server         │
│  (REST API Routes)       │
└────────────┬────────────┘
             │ (Mongoose ODM)
┌─────────────▼────────────┐
│   MongoDB Database       │
│  (Collections & Docs)    │
└─────────────────────────┘
```

---

## 3. Data Models / Schema

### User Model
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (bcrypt hashed),
  role: String ['Admin', 'Base Commander', 'Logistics Officer'],
  base: ObjectId (ref: Base),
  createdAt: Date,
  updatedAt: Date
}
```

### Base Model
```javascript
{
  _id: ObjectId,
  name: String (unique),
  location: String,
  commander: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

### Asset Model
```javascript
{
  _id: ObjectId,
  name: String,
  type: String ['Vehicle', 'Weapon', 'Ammunition', 'Equipment', 'Other'],
  base: ObjectId (ref: Base),
  openingBalance: Number,
  closingBalance: Number,
  assigned: Number,
  expended: Number,
  unitCost: Number,
  description: String,
  lastUpdated: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Purchase Model
```javascript
{
  _id: ObjectId,
  asset: ObjectId (ref: Asset),
  base: ObjectId (ref: Base),
  quantity: Number,
  unitCost: Number,
  totalCost: Number (calculated),
  purchaseDate: Date,
  vendor: String,
  reference: String,
  recordedBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

### Transfer Model
```javascript
{
  _id: ObjectId,
  asset: ObjectId (ref: Asset),
  fromBase: ObjectId (ref: Base),
  toBase: ObjectId (ref: Base),
  quantity: Number,
  transferDate: Date,
  status: String ['Pending', 'In Transit', 'Delivered'],
  reason: String,
  transferredBy: ObjectId (ref: User),
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Assignment Model
```javascript
{
  _id: ObjectId,
  asset: ObjectId (ref: Asset),
  assignedTo: {
    name: String,
    rank: String
  },
  quantity: Number,
  assignmentDate: Date,
  base: ObjectId (ref: Base),
  status: String ['Assigned', 'Expended', 'Returned'],
  expendedQuantity: Number,
  expendedDate: Date,
  recordedBy: ObjectId (ref: User),
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Relationships
```
User ──┐
       ├─→ Base ──┐
       │          ├─→ Asset ──┐
       │          │           ├─→ Purchase
       │          │           ├─→ Transfer
       │          │           └─→ Assignment
       │          │
       └──────────┴─→ Purchase
                  └─→ Transfer
                  └─→ Assignment
```

---

## 4. RBAC Explanation

### Role Definitions

#### Admin Role
- **Access**: Full system access
- **Permissions**:
  - View all bases and assets
  - Manage user accounts
  - Perform all operations (purchases, transfers, assignments)
  - View audit logs
  - System configuration
  - No base restriction

#### Base Commander Role
- **Access**: Limited to assigned base
- **Permissions**:
  - View base-specific assets and inventory
  - Approve/initiate transfers
  - Assign assets to personnel
  - Record expenditures
  - View base reports
  - Cannot access other bases

#### Logistics Officer Role
- **Access**: Limited operations
- **Permissions**:
  - Record purchases
  - Initiate transfers (pending approval)
  - View inventory (read-only)
  - Cannot assign assets
  - Cannot create user accounts
  - Cannot view other bases' data

### Implementation Method

#### 1. JWT Token with Role Information
```javascript
Token Payload:
{
  id: User._id,
  role: 'Base Commander',
  base: Base._id,
  iat: timestamp,
  exp: timestamp + 24h
}
```

#### 2. Authentication Middleware
```javascript
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token' });
  
  const decoded = jwt.verify(token, JWT_SECRET);
  req.user = decoded;
  next();
};
```

#### 3. Authorization Middleware
```javascript
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    next();
  };
};
```

#### 4. Route-Level RBAC
```javascript
// Admin-only route
app.post('/api/users', auth, authorize('Admin'), createUser);

// Base Commander and Logistics Officer
app.post('/api/transfers', auth, authorize('Admin', 'Base Commander'), createTransfer);

// All authenticated users
app.get('/api/dashboard', auth, getDashboard);
```

#### 5. Base-Level Access Control
```javascript
const baseAccess = (req, res, next) => {
  const requestedBase = req.body.base || req.params.baseId;
  
  if (req.user.role === 'Admin') return next();
  
  if (req.user.role === 'Base Commander' && req.user.base === requestedBase) {
    return next();
  }
  
  return res.status(403).json({ message: 'Base access denied' });
};
```

### Access Matrix

| Operation | Admin | Base Commander | Logistics Officer |
|-----------|-------|-----------------|-------------------|
| View Dashboard | ✓ | ✓ (own base) | ✓ (own base) |
| Create Purchase | ✓ | ✓ (own base) | ✓ (own base) |
| Create Transfer | ✓ | ✓ (own base) | ✓ (pending) |
| Assign Asset | ✓ | ✓ (own base) | ✗ |
| Record Expenditure | ✓ | ✓ (own base) | ✗ |
| Manage Users | ✓ | ✗ | ✗ |
| View Audit Logs | ✓ | ✓ (own base) | ✓ (own base) |

---

## 5. API Logging

### Logging Strategy

All transactions are logged with comprehensive information for audit and debugging purposes.

### Log Levels
- **INFO**: General application events
- **ERROR**: Error conditions and exceptions
- **WARN**: Warning conditions that don't prevent operation
- **DEBUG**: Detailed developer information
- **AUDIT**: Critical business transactions

### Logged Information
```javascript
{
  timestamp: "2024-04-16T10:30:45.123Z",
  level: "AUDIT",
  message: "Purchase recorded",
  data: {
    userId: "507f1f77bcf86cd799439011",
    userName: "Captain Smith",
    userRole: "Logistics Officer",
    assetId: "507f1f77bcf86cd799439012",
    assetName: "Combat Vehicles",
    quantity: 5,
    unitCost: 500000,
    totalCost: 2500000,
    base: "Base Alpha"
  }
}
```

### Log Storage
- **Location**: `backend/logs/` directory
- **Format**: JSON, one entry per line
- **Rotation**: Daily (filename includes date)
- **Naming**: `{LEVEL}-{YYYY-MM-DD}.log`
  - Example: `audit-2024-04-16.log`

### Log Examples

#### Purchase Transaction
```
[AUDIT] Purchase recorded
{
  "timestamp": "2024-04-16T10:30:45Z",
  "purchaseId": "507f...",
  "assetId": "507f...",
  "quantity": 10,
  "userId": "507f...",
  "totalCost": 5000000
}
```

#### Transfer Initiation
```
[AUDIT] Transfer initiated
{
  "timestamp": "2024-04-16T11:15:22Z",
  "transferId": "507f...",
  "assetId": "507f...",
  "fromBase": "Base Alpha",
  "toBase": "Base Bravo",
  "quantity": 5,
  "transferredBy": "507f..."
}
```

#### Failed Access Attempt
```
[WARN] Unauthorized access - Insufficient permissions
{
  "timestamp": "2024-04-16T12:00:00Z",
  "userId": "507f...",
  "userRole": "Logistics Officer",
  "attemptedOperation": "Delete User",
  "requiredRole": "Admin"
}
```

### Log Analysis
Logs can be searched/analyzed for:
- User activity tracking
- Transaction history
- Error diagnosis
- Security audits
- Compliance reporting

---

## 6. Setup Instructions

### Prerequisites
- Node.js v16+
- MongoDB account (Atlas)
- Git
- npm or yarn

### Backend Setup

#### Step 1: Clone and Navigate
```bash
git clone <repository-url>
cd Military\ Asset\ Management\ System/backend
```

#### Step 2: Install Dependencies
```bash
npm install
```

#### Step 3: Environment Configuration
Create `.env` file:
```bash
cp .env.example .env
```

Edit `.env` with your MongoDB credentials:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/military_assets
JWT_SECRET=your_super_secret_key_change_in_production
PORT=5000
NODE_ENV=development
LOG_LEVEL=debug
FRONTEND_URL=http://localhost:3000
```

#### Step 4: Seed Database (Optional but Recommended)
```bash
node seed.js
```

This creates:
- 3 demo bases
- 3 demo users with different roles
- 4 demo assets

#### Step 5: Start Server
```bash
npm run dev
```

Expected output:
```
✓ Server is running on http://localhost:5000
MongoDB Connected: cluster0.mongodb.net
```

### Frontend Setup

#### Step 1: Navigate to Frontend
```bash
cd ../frontend
```

#### Step 2: Install Dependencies
```bash
npm install
```

#### Step 3: Start Development Server
```bash
npm start
```

The app opens automatically at `http://localhost:3000`

### Complete Setup Script

Create `setup.sh`:
```bash
#!/bin/bash

echo "Setting up Military Asset Management System..."

# Backend setup
cd backend
npm install
cp .env.example .env
echo "Please update backend/.env with your MongoDB credentials"
npm run dev &
BACKEND_PID=$!

# Frontend setup
cd ../frontend
npm install
npm start &

echo "Both servers are running!"
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:3000"
```

---

## 7. API Endpoints

### Authentication Endpoints

#### User Login
```
POST /api/auth/login
Content-Type: application/json

Request Body:
{
  "email": "admin@military.com",
  "password": "password123"
}

Response (200):
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Admin User",
    "email": "admin@military.com",
    "role": "Admin",
    "base": null
  }
}
```

#### User Registration
```
POST /api/auth/register
Content-Type: application/json

Request Body:
{
  "name": "Captain Johnson",
  "email": "johnson@military.com",
  "password": "password123",
  "role": "Base Commander",
  "base": "507f1f77bcf86cd799439012"
}

Response (201):
{
  "message": "User registered successfully"
}
```

### Dashboard Endpoints

#### Get Dashboard Summary
```
GET /api/dashboard/summary?base=507f1f77bcf86cd799439012&startDate=2024-01-01&endDate=2024-12-31
Authorization: Bearer {token}

Response (200):
{
  "summary": [
    {
      "id": "507f...",
      "name": "Combat Vehicles",
      "type": "Vehicle",
      "openingBalance": 50,
      "closingBalance": 55,
      "netMovement": 5,
      "assigned": 10,
      "expended": 2,
      "available": 43
    }
  ],
  "totals": {
    "totalAssets": 4,
    "totalOpeningBalance": 5250,
    "totalClosingBalance": 5260,
    "totalNetMovement": 10,
    "totalAssigned": 1085,
    "totalExpended": 507
  }
}
```

### Purchase Endpoints

#### Get All Purchases
```
GET /api/purchases?base=507f1f77bcf86cd799439012&startDate=2024-01-01&endDate=2024-12-31&assetType=Vehicle
Authorization: Bearer {token}

Response (200):
[
  {
    "_id": "507f...",
    "assetName": "Combat Vehicles",
    "quantity": 5,
    "unitCost": 500000,
    "totalCost": 2500000,
    "purchaseDate": "2024-04-16T10:30:00Z",
    "vendor": "Defense Corp",
    "recordedBy": "Captain Smith"
  }
]
```

#### Record Purchase
```
POST /api/purchases
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "asset": "507f1f77bcf86cd799439012",
  "base": "507f1f77bcf86cd799439013",
  "quantity": 5,
  "unitCost": 500000,
  "vendor": "Defense Corp",
  "reference": "POL-2024-001"
}

Response (201):
{
  "_id": "507f...",
  "asset": "507f1f77bcf86cd799439012",
  "quantity": 5,
  "totalCost": 2500000,
  "purchaseDate": "2024-04-16T10:30:00Z"
}
```

### Transfer Endpoints

#### Get All Transfers
```
GET /api/transfers?fromBase=507f1f77bcf86cd799439012&status=Pending
Authorization: Bearer {token}

Response (200):
[
  {
    "_id": "507f...",
    "assetName": "Combat Vehicles",
    "quantity": 3,
    "fromBase": "Base Alpha",
    "toBase": "Base Bravo",
    "status": "Pending",
    "transferDate": "2024-04-16T11:00:00Z"
  }
]
```

#### Initiate Transfer
```
POST /api/transfers
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "asset": "507f1f77bcf86cd799439012",
  "fromBase": "507f1f77bcf86cd799439013",
  "toBase": "507f1f77bcf86cd799439014",
  "quantity": 3,
  "reason": "Operational needs"
}

Response (201):
{
  "_id": "507f...",
  "status": "Pending",
  "transferDate": "2024-04-16T11:00:00Z"
}
```

#### Update Transfer Status
```
PUT /api/transfers/507f1f77bcf86cd799439020
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "status": "In Transit"
}

Response (200):
{
  "_id": "507f...",
  "status": "In Transit",
  "updatedAt": "2024-04-16T11:30:00Z"
}
```

### Assignment Endpoints

#### Get All Assignments
```
GET /api/assignments?base=507f1f77bcf86cd799439013&status=Assigned
Authorization: Bearer {token}

Response (200):
[
  {
    "_id": "507f...",
    "assetName": "Assault Rifles",
    "assignedTo": "Sergeant Davis",
    "quantity": 25,
    "assignmentDate": "2024-04-15T09:00:00Z",
    "status": "Assigned"
  }
]
```

#### Assign Asset
```
POST /api/assignments
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "asset": "507f1f77bcf86cd799439012",
  "base": "507f1f77bcf86cd799439013",
  "assignedTo": "Sergeant Davis",
  "quantity": 25
}

Response (201):
{
  "_id": "507f...",
  "status": "Assigned",
  "assignmentDate": "2024-04-16T12:00:00Z"
}
```

#### Record Expenditure
```
PUT /api/assignments/507f1f77bcf86cd799439025/expend
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "expendedQuantity": 10
}

Response (200):
{
  "_id": "507f...",
  "expendedQuantity": 10,
  "expendedDate": "2024-04-16T13:00:00Z",
  "status": "Assigned"
}
```

---

## 8. Login Credentials

### Demo Users

#### Admin
```
Email: admin@military.com
Password: password123
Role: Admin
Access: Full system access
```

#### Base Commander
```
Email: commander@military.com
Password: password123
Role: Base Commander
Base: Base Alpha
Access: Base-specific operations
```

#### Logistics Officer
```
Email: officer@military.com
Password: password123
Role: Logistics Officer
Base: Base Alpha
Access: Purchases and Transfers (limited)
```

### First-Time Login Steps
1. Navigate to `http://localhost:3000`
2. Enter credentials from above
3. Click "Login"
4. You'll be redirected to the Dashboard
5. Explore different sections based on your role

### Changing Passwords (When Deployed)
Contact your system administrator to change passwords in production environment.

### Forgot Password
Current system doesn't support password reset. Contact admin for account reset.

---

## System Flow Diagrams

### Login Flow
```
User Input (email/password)
         ↓
POST /api/auth/login
         ↓
Validate credentials
         ↓
Generate JWT token
         ↓
Store in localStorage
         ↓
Redirect to Dashboard
```

### Purchase Recording Flow
```
Officer enters purchase details
         ↓
Validate form
         ↓
POST /api/purchases
         ↓
Server validates authorization
         ↓
Create purchase record
         ↓
Update asset closing balance
         ↓
Log audit entry
         ↓
Return success
         ↓
Display notification
```

### Dashboard Data Flow
```
User requests dashboard
         ↓
GET /api/dashboard/summary
         ↓
Apply filters (base, date range, asset type)
         ↓
Query MongoDB
         ↓
Calculate totals
         ↓
Return summary with data
         ↓
Render dashboard with metrics
```

---

## Troubleshooting

### Backend Won't Start
- Check MongoDB connection string
- Ensure MongoDB is running/accessible
- Verify PORT 5000 is free

### Frontend Can't Connect
- Ensure backend is running on :5000
- Check CORS settings
- Clear browser cache

### Login Failed
- Verify MongoDB is seeded
- Check user email and password
- Check JWT_SECRET in .env

### Assets Not Showing
- Verify seed script was run
- Check MongoDB connection
- Look in error logs

---

End of Documentation
