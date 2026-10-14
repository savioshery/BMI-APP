# BMI Calculator - Quick Start Guide

## 🚀 Quick Setup (5 minutes)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start MongoDB
Make sure MongoDB is running on your system:

**Windows:**
```bash
# MongoDB usually runs as a service automatically
# Check if it's running:
mongosh
```

**macOS:**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

### Step 3: Run the Application
```bash
# Development mode (auto-restart on changes)
npm run dev

# OR Production mode
npm start
```

### Step 4: Open Browser
Navigate to: **http://localhost:5000**

---

## 🎯 First Use

1. **Register** - Create a new account with your name, email, and password (min 6 characters)
2. **Calculate BMI** - Enter your height (cm) and weight (kg)
3. **View Report** - Get personalized health recommendations
4. **Track Progress** - All your BMI records are saved and displayed in a chart

---

## 🧪 Test the API

### Register a Test User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

Save the `token` from the response and use it in the next request.

### Calculate BMI
```bash
curl -X POST http://localhost:5000/api/bmi \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"heightCm":175,"weightKg":70}'
```

---

## 🔧 Troubleshooting

### MongoDB Connection Error
```
❌ MongoDB connection error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution:** Make sure MongoDB is installed and running.

**Install MongoDB:**
- Windows: https://www.mongodb.com/try/download/community
- macOS: `brew install mongodb-community`
- Linux: Follow official docs for your distro

### Port Already in Use
```
❌ Error: listen EADDRINUSE: address already in use :::5000
```

**Solution:** Change the port in `.env`:
```env
PORT=3000
```

### Dependencies Not Installed
```
❌ Error: Cannot find module 'express'
```

**Solution:** Run `npm install` first.

---

## 📁 Project Structure

```
bmi-app/
├── server.js              # Express server
├── .env                   # Configuration
├── models/
│   ├── User.js           # User schema
│   └── BmiRecord.js      # BMI record schema
├── routes/
│   ├── authRoutes.js     # Register, Login
│   └── bmiRoutes.js      # BMI CRUD operations
├── middleware/
│   └── auth.js           # JWT verification
└── public/               # Frontend
    ├── index.html
    ├── style.css
    └── script.js
```

---

## ✅ What's Working

- ✅ User registration and login
- ✅ JWT authentication with 7-day expiration
- ✅ Password hashing with bcryptjs
- ✅ BMI calculation and storage
- ✅ Progress tracking with charts
- ✅ Dark mode support
- ✅ Fully responsive design
- ✅ Individual record deletion
- ✅ Clear all history

---

## 📚 API Endpoints

### Public Routes
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login to account

### Protected Routes (require Bearer token)
- `POST /api/bmi` - Calculate and save BMI
- `GET /api/bmi` - Get all user's records
- `DELETE /api/bmi/:id` - Delete single record
- `DELETE /api/bmi` - Clear all records

---

## 🎓 Credits

**Department of Information Technology | 2026**

**Team:**
- Abhinav Bins
- Imran Sinaj
- Savio Shery
- Merin George
- Nesha Benny

---

**Need help? Check README.md for full documentation!**
