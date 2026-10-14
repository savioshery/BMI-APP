/**
 * middleware/errorHandler.js — Central error-handling middleware.
 *
 * Catches all errors passed via next(err) and returns a
 * consistent JSON shape: { success: false, message, errors? }.
 * Handles Mongoose-specific and JWT-specific error types.
 */

function errorHandler(err, _req, res, _next) {
    // Log the full error in development
    console.error('❌ Error:', err);

    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal server error';
    let errors = null;

    // Mongoose validation error (e.g. required field missing)
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = 'Validation failed';
        errors = Object.values(err.errors).map(e => ({
            field: e.path,
            message: e.message
        }));
    }

    // Mongoose duplicate key error (e.g. email already exists)
    if (err.code === 11000) {
        statusCode = 409;
        const field = Object.keys(err.keyPattern)[0];
        message = `A record with that ${field} already exists.`;
    }

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        statusCode = 400;
        message = `Invalid ${err.path}: ${err.value}`;
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid token.';
    }
    if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Token has expired.';
    }

    const body = { success: false, message };
    if (errors) body.errors = errors;

    res.status(statusCode).json(body);
}

module.exports = errorHandler;
