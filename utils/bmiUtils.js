/**
 * utils/bmiUtils.js — Pure BMI calculation and classification functions.
 *
 * Kept free of side-effects so they are easy to unit-test
 * and can be shared between server logic and future CLI tools.
 */

/**
 * Calculate BMI from height in centimetres and weight in kilograms.
 * Formula: weight / (height_m)^2, rounded to 1 decimal place.
 */
function calculateBMI(heightCm, weightKg) {
    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * heightM);
    return parseFloat(bmi.toFixed(1));
}

/**
 * Map a BMI value to its WHO category string.
 */
function getCategory(bmi) {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25)   return 'Normal';
    if (bmi < 30)   return 'Overweight';
    return 'Obese';
}

/**
 * Return a human-readable health-risk description for the given category.
 */
function getRiskLevel(category) {
    const levels = {
        Underweight:
            'Moderate – Being underweight can lead to nutrient deficiencies, weakened immunity, and bone loss.',
        Normal:
            'Low – Your weight is within the healthy range. Maintain balanced habits to stay here.',
        Overweight:
            'Increased – Being overweight raises the risk of heart disease, type 2 diabetes, and joint problems.',
        Obese:
            'High – Obesity significantly increases the risk of cardiovascular disease, diabetes, sleep apnea, and certain cancers.'
    };
    return levels[category] || 'Unknown';
}

/**
 * Calculate the healthy weight range (BMI 18.5–24.9) for a given height in cm.
 * Returns { min, max } in kilograms, each rounded to 1 decimal.
 */
function getHealthyRange(heightCm) {
    const heightM = heightCm / 100;
    const min = parseFloat((18.5 * heightM * heightM).toFixed(1));
    const max = parseFloat((24.9 * heightM * heightM).toFixed(1));
    return { min, max };
}

/**
 * Determine how much weight to gain or lose to reach the healthy range.
 * Returns { action: 'gain' | 'lose' | 'none', amount: number (kg, 1 decimal) }.
 */
function getWeightChange(weightKg, healthyMin, healthyMax) {
    if (weightKg < healthyMin) {
        return { action: 'gain', amount: parseFloat((healthyMin - weightKg).toFixed(1)) };
    }
    if (weightKg > healthyMax) {
        return { action: 'lose', amount: parseFloat((weightKg - healthyMax).toFixed(1)) };
    }
    return { action: 'none', amount: 0 };
}

/**
 * Recommended daily water intake based on ~35 ml per kg of body weight.
 * Returns litres rounded to 1 decimal.
 */
function getWaterIntake(weightKg) {
    return parseFloat(((weightKg * 35) / 1000).toFixed(1));
}

module.exports = {
    calculateBMI,
    getCategory,
    getRiskLevel,
    getHealthyRange,
    getWeightChange,
    getWaterIntake
};
