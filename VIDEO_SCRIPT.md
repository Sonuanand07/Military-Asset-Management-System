# Military Asset Management System - Screen Demo Video Script (3-5 min)

## Video Structure (Record in order)

**0:00 - 0:30 Intro & Overview (30s)**
[Screen: Project folder VSCode]
"Hi, I'm [Your Name]. This is the Military Asset Management System built with React frontend, Node.js/Express backend, MongoDB. Features RBAC (Admin/Commander/Officer), asset tracking (purchases/transfers/assignments), dashboard with filters/pop-up.

**Tech:** React Router/Axios/chart.js front, Express/Mongoose/JWT/bcrypt backend, Mongo Atlas DB.

Live demo at localhost:3000"

**0:30 - 1:30 Setup Demo (1min)**
[Screen: Terminal]
"Backend: cd backend, npm i, .env (Mongo URI, JWT), node seed.js (demo data/users).
Frontend: cd frontend, npm i, npm start.

Servers: Backend 5000, Frontend 3000 (proxy)."

**1:30 - 3:30 Feature Demo (2min)**
[Screen: Browser app]
"Login as Admin (admin@military.com/password123). 

Dashboard: Metrics (balances/net), assets table, filter base/date, Net Movement pop-up (Purchases/Transfers details).

Purchases: Record new purchase (asset/base/quantity/cost) → updates asset balance.

Transfers: Initiate transfer (from/to base/quantity/reason), status update.

Assignments: Assign to personnel, record expenditure.

Logout → Login Commander (base-restricted).

RBAC: Middleware checks role/base. Logs all actions."

**3:30 - 4:30 Code Walkthrough (1min)**
[Screen: VSCode]
"Backend: models (Asset/Base/User), routes (CRUD + auth), middleware/auth (JWT/RBAC), logger.

Frontend: App.js (Router/ProtectedRoute localStorage), Login (token save), Dashboard (charts/filters/API).

DB: Assets with balances, populated Bases/Users.

Seed.js demo data."

**4:30 - 5:00 Wrap-up (30s)**
"Deployment ready (Render/Netlify). GitHub [link]. Questions?"

**Total:** ~5min. Screen record with voiceover."

