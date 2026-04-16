# Quick Start Guide - Military Asset Management System

## 5-Minute Setup

### Prerequisites
- Node.js installed (v16+)
- MongoDB Atlas account (free tier available)

### Quick Start Steps

#### 1. Get MongoDB Connection String (1 min)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create new cluster  
4. Click "Connect" and copy connection string
5. Replace `<password>` with your password

#### 2. Setup Backend (2 min)
```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` file:
- Replace `MONGODB_URI` with your MongoDB connection string
- Keep `JWT_SECRET` as is for development
- Keep `PORT=5000`

Seed the database with demo data:
```bash
node seed.js
```

Start server:
```bash
npm run dev
```

Expected: `✓ Server is running on http://localhost:5000`

#### 3. Setup Frontend (2 min)
In a new terminal:
```bash
cd frontend
npm install
npm start
```

Expected: Browser opens to `http://localhost:3000`

### Login
Use these credentials:
- **Email**: admin@military.com
- **Password**: password123

### Explore Features
- **Dashboard**: View assets and summary
- **Purchases**: Record new asset purchases
- **Transfers**: Move assets between bases
- **Assignments**: Assign assets to personnel

## Troubleshooting

### MongoDB Connection Error
- Check connection string in `.env`
- Ensure MongoDB cluster is active
- Whitelist your IP in MongoDB Atlas

### Port Already in Use
```bash
# Find and kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### npm install fails
```bash
rm -rf node_modules package-lock.json
npm install
```

## Next Steps
1. Read DOCUMENTATION.md for complete API reference
2. Customize demo data in backend/seed.js
3. Modify styling in CSS files
4. Deploy to production (see README.md)

Happy coding! 🚀
