/**
 * config/db.js — MongoDB connection helper.
 *
 * Reads MONGO_URI from environment variables and connects
 * using Mongoose. Exits the process on connection failure
 * so the app doesn't silently run without a database.
 */

const mongoose = require('mongoose');

async function connectDB() {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    } catch (err) {
        console.error(`❌ MongoDB connection error: ${err.message}`);
        process.exit(1);
    }
}

module.exports = connectDB;
