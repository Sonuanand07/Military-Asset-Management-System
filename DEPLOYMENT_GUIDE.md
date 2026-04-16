 # Deployment & Submission Guide

## Git Push
```
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/Sonuanand07/Military-Asset-Management-System.git
git push -u origin main
```

## MongoDB Atlas (Done)
- URI in backend/.env
- Data seeded

## Backend Deploy (Render)
1. render.com account/login
2. New > Web Service > Connect GitHub repo
3. Build: `npm install`
4. Start: `npm start`
5. Env Vars: MONGODB_URI, JWT_SECRET, NODE_ENV=production
6. Backend URL: [render-url]

## Frontend Deploy (Netlify)
1. netlify.com > New site > Deploy folder frontend
2. Build: `npm run build`
3. Proxy: Backend Render URL
4. Frontend URL: [netlify-url]

## Submission Files
1. **Zip:** Folder (git clone repo)
2. **PDF:** README + screenshots + specs match
3. **Video:** 3-5min (VIDEO_SCRIPT.md)
4. **Demo Links:** Frontend/Backend

Done!
