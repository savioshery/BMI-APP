// Import dependencies
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Authentication middleware - protects routes
const auth = async (req, res, next) => {
    try {
        // Get token from Authorization header
        const authHeader = req.header('Authorization');

        // Check if token exists
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
        }

        // Extract token (remove 'Bearer ' prefix)
        const token = authHeader.replace('Bearer ', '');

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if user still exists
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found. Token invalid.'
            });
        }

        // Attach user id to request object
        req.userId = decoded.userId;

        // Continue to next middleware/route handler
        next();
    } catch (error) {
        // Handle token verification errors
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token.'
            });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expired. Please login again.'
            });
        }

        // Other errors
        res.status(500).json({
            success: false,
            message: 'Authentication failed.'
        });
    }
};

module.exports = auth;
