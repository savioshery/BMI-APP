# Quick Start Guide

## Get Your BMI Calculator Running in 5 Minutes

### Step 1: Install Dependencies
```bash
cd bmi-app
npm install
```

### Step 2: Set Up Environment
Create a `.env` file:
```bash
cp .env.example .env
```

**For local MongoDB:**
The default settings in `.env.example` work out of the box if you have MongoDB running locally.

**For MongoDB Atlas (recommended):**
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get your connection string
4. Update `MONGO_URI` in `.env`:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/bmi-calculator
```

### Step 3: Start the Server
```bash
npm run dev
```

You should see:
```
✓ MongoDB Connected
✓ Server running on port 5000
```

### Step 4: Open in Browser
Navigate to: **http://localhost:5000**

### Step 5: Try It Out!

1. **Click "Sign Up"** to create an account
2. **Enter your height and weight** to calculate BMI
3. **View your personalized health report**
4. **Check the Progress section** to see your history and chart

---

## Quick Test with cURL

**Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@test.com","password":"test1234"}'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com","password":"test1234"}'
```

Copy the `token` from the response, then:

**Calculate BMI:**
```bash
curl -X POST http://localhost:5000/api/bmi \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"heightCm":170,"weightKg":65}'
```

---

## Troubleshooting

**"MongoNetworkError" or "ECONNREFUSED":**
- MongoDB isn't running. Start it with `mongod` or use MongoDB Atlas

**"Port 5000 already in use":**
- Change `PORT=5001` in your `.env` file

**Can't see the website:**
- Make sure you're going to `http://localhost:5000` (not 3000 or 8080)
- Check the terminal — the server must be running

---

## What's Next?

- ✅ The app works in **guest mode** (no login required, but history isn't saved)
- ✅ **Sign up** to track your BMI over time across devices
- ✅ Toggle **dark mode** with the 🌙 button
- ✅ View your **progress chart** in the Progress section
- ✅ **Delete individual records** or clear all history

---

**Need help?** Check the full `README.md` for API documentation and deployment guides.

**Happy tracking! 💪**
