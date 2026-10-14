// Import mongoose
const mongoose = require('mongoose');

// Define BMI Record Schema
const bmiRecordSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    heightCm: {
        type: Number,
        required: [true, 'Height is required'],
        min: [50, 'Height must be at least 50 cm'],
        max: [250, 'Height cannot exceed 250 cm']
    },
    weightKg: {
        type: Number,
        required: [true, 'Weight is required'],
        min: [10, 'Weight must be at least 10 kg'],
        max: [500, 'Weight cannot exceed 500 kg']
    },
    bmi: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        enum: ['underweight', 'normal', 'overweight', 'obese'],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true // Adds createdAt and updatedAt
});

// Export BmiRecord model
module.exports = mongoose.model('BmiRecord', bmiRecordSchema);
