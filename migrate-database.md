# Migrate MongoDB from Local (Compass) to Cloud (Atlas)

## Why You Need Cloud MongoDB for Deployment

Your local MongoDB Compass database is on your computer. When you deploy your app to Render/Heroku, the server needs to connect to a database that's accessible over the internet. Your local database is not accessible from the cloud.

**Solution:** Use MongoDB Atlas (which you can ALSO access with MongoDB Compass locally)

## Step-by-Step Migration

### Step 1: Export Your Local Data

Open your terminal and run:

```bash
# Export users collection
mongoexport --uri="mongodb://127.0.0.1:27017/bmi_app" --collection=users --out=users.json

# Export bmirecords collection
mongoexport --uri="mongodb://127.0.0.1:27017/bmi_app" --collection=bmirecords --out=bmirecords.json
```

This creates JSON files with your data.

### Step 2: Set Up MongoDB Atlas

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create free account
3. Create M0 Free cluster (512MB free forever)
4. Wait 3-5 minutes for cluster creation
5. Click "Connect" → Choose "Drivers"
6. Copy connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
7. Replace `<password>` with your actual password
8. Add `/bmi_app` before the `?`:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/bmi_app?retryWrites=true&w=majority
   ```

### Step 3: Configure Network Access

In MongoDB Atlas:
1. Go to "Network Access" (left sidebar)
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (adds 0.0.0.0/0)
4. Confirm

### Step 4: Connect MongoDB Compass to Atlas

Yes! You can use Compass with Atlas:

1. Open MongoDB Compass
2. Click "New Connection"
3. Paste your Atlas connection string
4. Click "Connect"
5. You'll see your cloud database in Compass!

### Step 5: Import Your Local Data to Atlas

```bash
# Import users to Atlas
mongoimport --uri="mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/bmi_app" --collection=users --file=users.json

# Import bmirecords to Atlas
mongoimport --uri="mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/bmi_app" --collection=bmirecords --file=bmirecords.json
```

Replace the connection string with your actual Atlas connection string.

### Step 6: Test Connection Locally

Update your local `.env` file temporarily:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/bmi_app?retryWrites=true&w=majority
JWT_SECRET=your_secret_change_this_in_production_2026
```

Run your app:
```bash
npm start
```

If it works, your Atlas database is ready!

### Step 7: Deploy with Atlas Connection

Now deploy to Render with the Atlas connection string as your `MONGO_URI` environment variable.

---

## Alternative: Keep Using Local MongoDB (Development Only)

If you want to keep developing locally with Compass:

1. **For local development**: Keep using `mongodb://127.0.0.1:27017/bmi_app`
2. **For deployment**: Use Atlas with the cloud connection string

You can manage BOTH:
- Local database: for development and testing
- Atlas database: for production deployment

Both can be accessed through MongoDB Compass!

---

## Quick Commands Reference

### Check what's in your local database:
```bash
mongosh mongodb://127.0.0.1:27017/bmi_app --eval "db.users.countDocuments()"
mongosh mongodb://127.0.0.1:27017/bmi_app --eval "db.bmirecords.countDocuments()"
```

### Backup your local database:
```bash
mongodump --uri="mongodb://127.0.0.1:27017/bmi_app" --out=backup
```

### Restore to Atlas:
```bash
mongorestore --uri="mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/bmi_app" backup/bmi_app
```

---

## Summary

✅ MongoDB Compass = GUI tool (works with local AND cloud databases)  
✅ MongoDB Atlas = Cloud-hosted MongoDB (accessible from anywhere)  
✅ You can use Compass to connect to BOTH local and Atlas databases  
✅ For deployment, you MUST use a cloud database like Atlas
