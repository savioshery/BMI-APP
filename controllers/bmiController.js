/**
 * BMI Controller
 * Handles BMI record creation, history retrieval, stats, and deletion.
 * Calculations are performed server-side using pure functions from bmiUtils.
 */

const { validationResult, body } = require('express-validator');
const BmiRecord = require('../models/BmiRecord');
const {
    calculateBMI,
    getCategory,
    getRiskLevel,
    getHealthyRange,
    getWaterIntake,
    getWeightChange
} = require('../utils/bmiUtils');

/**
 * Shared validation rules for height and weight inputs.
 */
const bmiValidation = [
    body('heightCm')
        .isFloat({ min: 50, max: 250 })
        .withMessage('Height must be between 50 and 250 cm'),
    body('weightKg')
        .isFloat({ min: 10, max: 500 })
        .withMessage('Weight must be between 10 and 500 kg')
];

/**
 * Build a full BMI result object from height and weight inputs.
 * Shared by both createRecord and calculateGuest.
 */
function buildBmiResult(heightCm, weightKg) {
    const bmi = calculateBMI(heightCm, weightKg);
    const category = getCategory(bmi);
    const riskLevel = getRiskLevel(category);
    const { min: healthyWeightMin, max: healthyWeightMax } = getHealthyRange(heightCm);
    const { amount } = getWeightChange(weightKg, healthyWeightMin, healthyWeightMax);
    const waterIntakeLitres = getWaterIntake(weightKg);

    return {
        heightCm,
        weightKg,
        bmi,
        category,
        riskLevel,
        healthyWeightMin,
        healthyWeightMax,
        weightChangeNeeded: amount,
        waterIntakeLitres
    };
}

/**
 * @desc    Calculate BMI and save a record for the logged-in user
 * @route   POST /api/bmi
 * @access  Private
 */
const createRecord = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array().map(e => e.msg)
            });
        }

        const { heightCm, weightKg } = req.body;
        const result = buildBmiResult(heightCm, weightKg);

        // Save to database linked to the authenticated user
        const record = await BmiRecord.create({
            user: req.user.id,
            ...result
        });

        res.status(201).json({
            success: true,
            data: record
        });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc    Get the user's BMI history, newest first
 * @route   GET /api/bmi
 * @query   ?limit=N  — max number of records (default: all)
 *          ?from=DATE&to=DATE — filter by date range (ISO strings)
 * @access  Private
 */
const getHistory = async (req, res, next) => {
    try {
        const { limit, from, to } = req.query;

        // Build the filter: always scoped to the current user
        const filter = { user: req.user.id };

        // Optional date range filter
        if (from || to) {
            filter.createdAt = {};
            if (from) filter.createdAt.$gte = new Date(from);
            if (to) filter.createdAt.$lte = new Date(to);
        }

        let query = BmiRecord.find(filter).sort({ createdAt: -1 });

        // Optional limit
        if (limit && !isNaN(parseInt(limit))) {
            query = query.limit(parseInt(limit));
        }

        const records = await query;

        res.json({
            success: true,
            count: records.length,
            data: records
        });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc    Get aggregated BMI stats for the progress dashboard
 * @route   GET /api/bmi/stats
 * @access  Private
 */
const getStats = async (req, res, next) => {
    try {
        const records = await BmiRecord.find({ user: req.user.id })
            .sort({ createdAt: -1 });

        if (records.length === 0) {
            return res.json({
                success: true,
                data: {
                    latest: null,
                    change: 0,
                    average: 0,
                    totalRecords: 0
                }
            });
        }

        const latest = records[0];
        const oldest = records[records.length - 1];
        const change = parseFloat((latest.bmi - oldest.bmi).toFixed(1));
        const sum = records.reduce((acc, r) => acc + r.bmi, 0);
        const average = parseFloat((sum / records.length).toFixed(1));

        res.json({
            success: true,
            data: {
                latest: {
                    bmi: latest.bmi,
                    category: latest.category,
                    date: latest.createdAt
                },
                change,
                average,
                totalRecords: records.length
            }
        });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc    Delete a single BMI record (only if it belongs to the user)
 * @route   DELETE /api/bmi/:id
 * @access  Private
 */
const deleteRecord = async (req, res, next) => {
    try {
        const record = await BmiRecord.findById(req.params.id);

        if (!record || record.user.toString() !== req.user.id) {
            return res.status(404).json({
                success: false,
                message: 'Record not found'
            });
        }

        await record.deleteOne();

        res.json({
            success: true,
            message: 'Record deleted'
        });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc    Clear all BMI history for the logged-in user
 * @route   DELETE /api/bmi
 * @access  Private
 */
const clearHistory = async (req, res, next) => {
    try {
        const result = await BmiRecord.deleteMany({ user: req.user.id });

        res.json({
            success: true,
            message: `Deleted ${result.deletedCount} record(s)`
        });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc    Calculate BMI without authentication or saving (guest mode)
 * @route   POST /api/bmi/calculate
 * @access  Public
 */
const calculateGuest = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array().map(e => e.msg)
            });
        }

        const { heightCm, weightKg } = req.body;
        const result = buildBmiResult(heightCm, weightKg);

        res.json({
            success: true,
            data: result
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    createRecord,
    getHistory,
    getStats,
    deleteRecord,
    clearHistory,
    calculateGuest,
    bmiValidation
};
