# Military Asset Management System

A comprehensive full-stack application for managing military assets across multiple bases, including tracking, transfers, assignments, and expenditures.

## Tech Stack

- **Frontend**: React 18
- **Backend**: Node.js with Express
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet, CORS, bcryptjs

## Project Structure

```
military-asset-management/
├── backend/
│   ├── config/
│   │   ├── database.js
│   │   └── logger.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Base.js
│   │   ├── Asset.js
│   │   ├── Purchase.js
│   │   ├── Transfer.js
│   │   └── Assignment.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── purchases.js
│   │   ├── transfers.js
│   │   ├── assignments.js
│   │   └── dashboard.js
│   ├── index.js
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Login.js
    │   │   ├── Dashboard.js
    │   │   ├── Purchases.js
    │   │   ├── Transfers.js
    │   │   ├── Assignments.js
    │   │   └── Navigation.js
    │   ├── services/
    │   │   └── api.js
    │   ├── App.js
    │   └── index.js
    ├── public/
    │   └── index.html
    └── package.json
```

## Installation & Setup

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/military_assets
JWT_SECRET=your_secret_key_here
PORT=5000
NODE_ENV=development
```

4. Start the backend server:
```bash
npm run dev
```

The server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the React development server:
```bash
npm start
```

The application will open on `http://localhost:3000`

## Features

### Dashboard
- Overview of assets across all bases
- Key metrics including closing balance, net movements, and assignments
- Filtering by date, base, and equipment type
- Detailed pop-up display of net movements (purchases, transfers in/out)

### Purchases
- Record new asset purchases
- Track vendor and cost information
- View purchase history with filters

### Transfers
- Initiate asset transfers between bases
- Track transfer status (Pending, In Transit, Delivered)
- Maintain complete transfer history

### Assignments & Expenditures
- Assign assets to personnel
- Record asset expenditures
- Track remaining available assets

## Role-Based Access Control

The system implements three user roles:

1. **Admin**
   - Full access to all data and operations
   - Can manage all bases and assets

2. **Base Commander**
   - Access limited to their assigned base
   - Can view and manage base-specific operations
   - Can approve transfers and assignments

3. **Logistics Officer**
   - Limited access to purchases and transfers
   - Can record purchases and initiate transfers
   - Cannot manage user accounts

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Purchases
- `GET /api/purchases` - Get all purchases (with filters)
- `POST /api/purchases` - Record a new purchase

### Transfers
- `GET /api/transfers` - Get all transfers (with filters)
- `POST /api/transfers` - Initiate a transfer
- `PUT /api/transfers/:id` - Update transfer status

### Assignments
- `GET /api/assignments` - Get all assignments
- `POST /api/assignments` - Assign an asset
- `PUT /api/assignments/:id/expend` - Record expenditure

### Dashboard
- `GET /api/dashboard/summary` - Get dashboard summary with filters

## Demo Credentials

```
Admin User:
Email: admin@military.com
Password: password123

Base Commander:
Email: commander@military.com
Password: password123

Logistics Officer:
Email: officer@military.com
Password: password123
```

## API Logging

All transactions are logged with:
- Timestamp
- User ID and role
- Action performed
- Data modified
- Success/failure status

Logs are stored in:
- `backend/logs/` directory
- Daily log files for each log level (INFO, ERROR, WARN, DEBUG, AUDIT)

## Database Schema

### User
- name, email, password (encrypted), role, base
- Tracks user registration and role assignments

### Base
- name, location, commander
- Represents military bases

### Asset
- name, type, base, openingBalance, closingBalance
- assigned, expended quantities
- unitCost, description

### Purchase
- asset, base, quantity, unitCost, totalCost
- purchaseDate, vendor, reference
- recordedBy (User)

### Transfer
- asset, fromBase, toBase, quantity
- transferDate, status, reason
- transferredBy (User)

### Assignment
- asset, assignedTo, quantity, assignmentDate
- base, status, expendedQuantity, expendedDate
- recordedBy (User)

## Deployment

### Backend Deployment (Render)
1. Create a Render account and new Web Service
2. Connect your GitHub repository
3. Set environment variables in Render dashboard
4. Deploy

### Frontend Deployment (Vercel/Netlify)
1. Build the React app: `npm run build`
2. Deploy build folder to Vercel or Netlify
3. Update API endpoint in frontend to point to deployed backend

## Environment Variables

### Backend (.env)
```
MONGODB_URI=<MongoDB connection string>
JWT_SECRET=<Your secret key>
PORT=5000
NODE_ENV=production
LOG_LEVEL=info
FRONTEND_URL=<Frontend URL for CORS>
```

## Support

For issues or questions, please contact the development team.

## License

This project is confidential and for authorized military use only.
