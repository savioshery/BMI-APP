// Import dependencies
const express = require('express');
const BmiRecord = require('../models/BmiRecord');
const auth = require('../middleware/auth');

const router = express.Router();

// Helper function to calculate BMI
const calculateBMI = (heightCm, weightKg) => {
    const heightM = heightCm / 100; // Convert cm to meters
    const bmi = weightKg / (heightM * heightM);
    return Math.round(bmi * 10) / 10; // Round to 1 decimal place
};

// Helper function to get BMI category
const getCategory = (bmi) => {
    if (bmi < 18.5) return 'underweight';
    if (bmi >= 18.5 && bmi < 25) return 'normal';
    if (bmi >= 25 && bmi < 30) return 'overweight';
    return 'obese';
};

// POST /api/bmi - Create new BMI record (Protected)
router.post('/', auth, async (req, res) => {
    try {
        const { heightCm, weightKg } = req.body;

        // Validate input
        if (!heightCm || !weightKg) {
            return res.status(400).json({
                success: false,
                message: 'Please provide both height and weight.'
            });
        }

        // Validate ranges
        if (heightCm < 50 || heightCm > 250) {
            return res.status(400).json({
                success: false,
                message: 'Height must be between 50 and 250 cm.'
            });
        }

        if (weightKg < 10 || weightKg > 500) {
            return res.status(400).json({
                success: false,
                message: 'Weight must be between 10 and 500 kg.'
            });
        }

        // Calculate BMI and category
        const bmi = calculateBMI(heightCm, weightKg);
        const category = getCategory(bmi);

        // Create BMI record
        const record = await BmiRecord.create({
            user: req.userId,
            heightCm,
            weightKg,
            bmi,
            category
        });

        res.status(201).json({
            success: true,
            message: 'BMI calculated successfully.',
            data: {
                id: record._id,
                heightCm: record.heightCm,
                weightKg: record.weightKg,
                bmi: record.bmi,
                category: record.category,
                createdAt: record.createdAt
            }
        });
    } catch (error) {
        console.error('BMI calculation error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to calculate BMI. Please try again.'
        });
    }
});

// GET /api/bmi - Get all BMI records for logged-in user (Protected)
router.get('/', auth, async (req, res) => {
    try {
        // Find all records for the logged-in user, sorted by newest first
        const records = await BmiRecord.find({ user: req.userId })
            .sort({ createdAt: -1 })
            .select('-user -__v'); // Exclude user field and version key

        res.status(200).json({
            success: true,
            count: records.length,
            data: records
        });
    } catch (error) {
        console.error('Fetch records error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch BMI records.'
        });
    }
});

// DELETE /api/bmi/:id - Delete a specific BMI record (Protected)
router.delete('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;

        // Find record
        const record = await BmiRecord.findById(id);

        // Check if record exists
        if (!record) {
            return res.status(404).json({
                success: false,
                message: 'BMI record not found.'
            });
        }

        // Check if record belongs to logged-in user
        if (record.user.toString() !== req.userId) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to delete this record.'
            });
        }

        // Delete record
        await BmiRecord.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'BMI record deleted successfully.'
        });
    } catch (error) {
        console.error('Delete record error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete BMI record.'
        });
    }
});

// DELETE /api/bmi - Clear all BMI records for logged-in user (Protected)
router.delete('/', auth, async (req, res) => {
    try {
        // Delete all records for the logged-in user
        const result = await BmiRecord.deleteMany({ user: req.userId });

        res.status(200).json({
            success: true,
            message: `All BMI records cleared successfully. (${result.deletedCount} records deleted)`,
            deletedCount: result.deletedCount
        });
    } catch (error) {
        console.error('Clear history error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to clear BMI history.'
        });
    }
});

module.exports = router;
