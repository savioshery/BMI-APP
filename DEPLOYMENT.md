# Deployment Guide - BMI Calculator App

## Prerequisites
- GitHub account
- MongoDB Atlas account (free tier)
- Render account (free tier)

## Step-by-Step Deployment

### 1. Set Up MongoDB Atlas (Cloud Database)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Create a free account and log in
3. Create a new cluster (M0 Free tier)
4. Once created, click **"Connect"**
5. Choose **"Connect your application"**
6. Copy the connection string (looks like):
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
7. Replace `<password>` with your database password
8. Add `/bmi_app` before the `?` to specify database name:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/bmi_app?retryWrites=true&w=majority
   ```

**Important:** In Atlas, go to **Network Access** and add `0.0.0.0/0` to allow connections from anywhere (required for Render).

### 2. Push Your Code to GitHub

Make sure all your latest changes are pushed:

```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### 3. Deploy to Render

1. Go to [Render](https://render.com) and sign up (use GitHub to sign in)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository: `savioshery/BMI-APP`
4. Configure the service:
   - **Name**: `bmi-calculator-app` (or any name you prefer)
   - **Region**: Choose closest to your location
   - **Branch**: `main`
   - **Root Directory**: Leave empty
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

5. Add Environment Variables (click **"Advanced"**):
   - `PORT` = `10000` (Render uses this port)
   - `MONGO_URI` = Your MongoDB Atlas connection string from Step 1
   - `JWT_SECRET` = A strong random secret (generate one with a password generator)
   - `JWT_EXPIRES_IN` = `7d`
   - `NODE_ENV` = `production`

6. Click **"Create Web Service"**

7. Wait for deployment (5-10 minutes). Render will:
   - Clone your repository
   - Install dependencies
   - Start your server

8. Once deployed, you'll get a URL like: `https://bmi-calculator-app.onrender.com`

### 4. Test Your Deployment

Visit your Render URL and test:
- Registration
- Login
- BMI calculation
- History tracking

## Alternative Deployment Options

### Option 2: Railway
- Similar to Render
- Free tier available
- Easy MongoDB integration
- Visit: https://railway.app

### Option 3: Heroku
- Requires credit card (even for free tier)
- Visit: https://heroku.com

### Option 4: Vercel (with serverless functions)
- Free tier
- Requires restructuring as serverless
- Visit: https://vercel.com

## Troubleshooting

### App crashes on Render
- Check logs in Render dashboard
- Verify MongoDB Atlas connection string
- Ensure Network Access is configured in Atlas

### MongoDB connection timeout
- Check MongoDB Atlas **Network Access**
- Add `0.0.0.0/0` to IP whitelist

### Environment variables not working
- Double-check variable names (case-sensitive)
- Ensure no extra spaces in values
- Redeploy after changing variables

### CORS issues
- Your app already has CORS enabled
- If issues persist, update CORS config in `server.js`

## Free Tier Limitations

**Render Free Tier:**
- Spins down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds
- 750 hours/month free

**MongoDB Atlas Free Tier:**
- 512MB storage
- Shared RAM
- No backups
- Perfect for development/small apps

## Production Checklist

- ✅ Strong JWT_SECRET (not the default one)
- ✅ MongoDB Atlas connection string configured
- ✅ Environment variables set in Render
- ✅ GitHub repository is up to date
- ✅ Network Access configured in MongoDB Atlas
- ✅ HTTPS enabled (automatic with Render)

## Support

If you encounter issues:
1. Check Render logs
2. Check MongoDB Atlas monitoring
3. Test locally first with MongoDB Atlas connection string

---

**Your app will be live at:** `https://your-app-name.onrender.com`
