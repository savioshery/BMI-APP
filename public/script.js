// API Base URL
const API_URL = 'http://localhost:5000/api';

// DOM Elements - Auth
const authModal = document.getElementById('authModal');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const toggleAuthMode = document.getElementById('toggleAuthMode');
const authToggleText = document.getElementById('authToggleText');
const authTitle = document.getElementById('authTitle');
const authMessage = document.getElementById('authMessage');
const userInfo = document.getElementById('userInfo');
const userName = document.getElementById('userName');
const logoutBtn = document.getElementById('logoutBtn');

// DOM Elements - BMI Form
const bmiForm = document.getElementById('bmiForm');
const heightInput = document.getElementById('height');
const weightInput = document.getElementById('weight');
const heightError = document.getElementById('heightError');
const weightError = document.getElementById('weightError');
const resultsSection = document.getElementById('results');
const bmiValue = document.getElementById('bmiValue');
const bmiCategory = document.getElementById('bmiCategory');
const gaugeMarker = document.getElementById('gaugeMarker');
const healthRisk = document.getElementById('healthRisk');
const dietSuggestions = document.getElementById('dietSuggestions');
const exerciseSuggestions = document.getElementById('exerciseSuggestions');
const waterIntake = document.getElementById('waterIntake');
const weightGoal = document.getElementById('weightGoal');

// DOM Elements - Progress
const darkModeToggle = document.getElementById('darkModeToggle');
const progressData = document.getElementById('progressData');
const noData = document.getElementById('noData');
const historyTableBody = document.getElementById('historyTableBody');
const clearHistoryBtn = document.getElementById('clearHistory');

// State
let currentUser = null;
let isLoginMode = true;
let bmiChart = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadDarkModePreference();
    checkAuth();
    setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
    // Auth events
    loginForm.addEventListener('submit', handleLogin);
    registerForm.addEventListener('submit', handleRegister);
    toggleAuthMode.addEventListener('click', switchAuthMode);
    logoutBtn.addEventListener('click', handleLogout);

    // BMI form events
    bmiForm.addEventListener('submit', handleSubmit);
    bmiForm.addEventListener('reset', handleReset);
    heightInput.addEventListener('input', () => validateInput(heightInput, heightError, 50, 250, 'Height'));
    weightInput.addEventListener('input', () => validateInput(weightInput, weightError, 10, 500, 'Weight'));

    // Other events
    darkModeToggle.addEventListener('click', toggleDarkMode);
    clearHistoryBtn.addEventListener('click', clearHistory);
}

// ==================== AUTH FUNCTIONS ====================

// Check if user is authenticated
function checkAuth() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token && user) {
        currentUser = JSON.parse(user);
        showApp();
        loadHistory();
    } else {
        showAuthModal();
    }
}

// Show auth modal
function showAuthModal() {
    authModal.hidden = false;
    userInfo.hidden = true;
}

// Show app (hide auth modal)
function showApp() {
    authModal.hidden = true;
    userInfo.hidden = false;
    userName.textContent = currentUser.name;
}

// Switch between login and register
function switchAuthMode(e) {
    e.preventDefault();
    isLoginMode = !isLoginMode;

    if (isLoginMode) {
        authTitle.textContent = 'Welcome Back';
        loginForm.hidden = false;
        registerForm.hidden = true;
        authToggleText.innerHTML = `Don't have an account? <a href="#" id="toggleAuthMode">Register here</a>`;
    } else {
        authTitle.textContent = 'Create Account';
        loginForm.hidden = true;
        registerForm.hidden = false;
        authToggleText.innerHTML = `Already have an account? <a href="#" id="toggleAuthMode">Login here</a>`;
    }

    // Re-attach event listener
    document.getElementById('toggleAuthMode').addEventListener('click', switchAuthMode);
    hideAuthMessage();
}

// Handle Login
async function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
        showAuthMessage('Please fill in all fields', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            currentUser = data.user;

            showAuthMessage('Login successful!', 'success');
            setTimeout(() => {
                showApp();
                loadHistory();
                loginForm.reset();
            }, 1000);
        } else {
            showAuthMessage(data.message || 'Login failed', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showAuthMessage('Network error. Please try again.', 'error');
    }
}

// Handle Register
async function handleRegister(e) {
    e.preventDefault();

    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;

    if (!name || !email || !password) {
        showAuthMessage('Please fill in all fields', 'error');
        return;
    }

    if (password.length < 6) {
        showAuthMessage('Password must be at least 6 characters', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            currentUser = data.user;

            showAuthMessage('Registration successful!', 'success');
            setTimeout(() => {
                showApp();
                loadHistory();
                registerForm.reset();
            }, 1000);
        } else {
            showAuthMessage(data.message || 'Registration failed', 'error');
        }
    } catch (error) {
        console.error('Register error:', error);
        showAuthMessage('Network error. Please try again.', 'error');
    }
}

// Handle Logout
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        currentUser = null;
        resultsSection.hidden = true;
        bmiForm.reset();
        showAuthModal();
    }
}

// Show auth message
function showAuthMessage(message, type) {
    authMessage.textContent = message;
    authMessage.className = `auth-message ${type}`;
    authMessage.hidden = false;
}

// Hide auth message
function hideAuthMessage() {
    authMessage.hidden = true;
}

// Get auth headers
function getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token || ''}`
    };
}
// ==================== BMI CALCULATION FUNCTIONS ====================

// Validate Input
function validateInput(input, errorElement, min, max, fieldName) {
    const value = parseFloat(input.value);

    if (!input.value.trim()) {
        errorElement.textContent = `${fieldName} is required`;
        input.classList.add('error');
        return false;
    }

    if (isNaN(value)) {
        errorElement.textContent = `Please enter a valid number`;
        input.classList.add('error');
        return false;
    }

    if (value < min || value > max) {
        errorElement.textContent = `${fieldName} must be between ${min} and ${max}`;
        input.classList.add('error');
        return false;
    }

    errorElement.textContent = '';
    input.classList.remove('error');
    return true;
}

// Handle Form Submit
async function handleSubmit(e) {
    e.preventDefault();

    const heightValid = validateInput(heightInput, heightError, 50, 250, 'Height');
    const weightValid = validateInput(weightInput, weightError, 10, 500, 'Weight');

    if (heightValid && weightValid) {
        const heightCm = parseFloat(heightInput.value);
        const weightKg = parseFloat(weightInput.value);

        try {
            // Send to backend
            const response = await fetch(`${API_URL}/bmi`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ heightCm, weightKg })
            });

            const data = await response.json();

            if (response.ok) {
                const { bmi, category } = data.data;
                const recommendations = getRecommendations(category);
                const healthyRange = getHealthyRange(heightCm, weightKg);
                const water = calculateWaterIntake(weightKg);

                displayResults(bmi, category, recommendations, healthyRange, water);
                loadHistory(); // Refresh history
            } else {
                if (response.status === 401) {
                    alert('Session expired. Please login again.');
                    handleLogout();
                } else {
                    alert(data.message || 'Failed to calculate BMI');
                }
            }
        } catch (error) {
            console.error('BMI calculation error:', error);
            alert('Network error. Please try again.');
        }
    }
}

// Handle Form Reset
function handleReset() {
    heightError.textContent = '';
    weightError.textContent = '';
    heightInput.classList.remove('error');
    weightInput.classList.remove('error');
    resultsSection.hidden = true;
}

// Get BMI Category Display Name
function getCategoryDisplayName(category) {
    const names = {
        'underweight': 'Underweight',
        'normal': 'Normal Weight',
        'overweight': 'Overweight',
        'obese': 'Obese'
    };
    return names[category];
}

// Get Health Recommendations
function getRecommendations(category) {
    const recommendations = {
        underweight: {
            risk: 'Moderate risk. Being underweight may indicate malnutrition, osteoporosis, or other health issues. Consult a healthcare professional.',
            diet: 'Focus on nutrient-dense, calorie-rich foods: nuts, nut butters, avocados, whole grains, lean proteins, full-fat dairy, healthy oils. Eat 5-6 smaller meals throughout the day. Add protein shakes or smoothies with fruits and nut butter.',
            exercise: 'Strength training 3-4 times per week to build muscle mass. Light cardio for cardiovascular health. Avoid excessive cardio that burns too many calories. Focus on compound movements like squats, deadlifts, and bench press.',
        },
        normal: {
            risk: 'Low risk. You are within a healthy weight range. Maintain your current lifestyle with balanced nutrition and regular physical activity.',
            diet: 'Maintain a balanced diet with a variety of fruits, vegetables, whole grains, lean proteins, and healthy fats. Practice portion control. Stay hydrated. Limit processed foods, added sugars, and excessive sodium.',
            exercise: 'Aim for 150 minutes of moderate aerobic activity or 75 minutes of vigorous activity per week. Include strength training 2-3 times per week. Mix cardio (running, cycling, swimming) with resistance exercises.',
        },
        overweight: {
            risk: 'Moderate to high risk. Being overweight increases risk of type 2 diabetes, high blood pressure, heart disease, and certain cancers. Weight reduction is recommended.',
            diet: 'Create a moderate calorie deficit (300-500 calories below maintenance). Focus on whole foods: vegetables, fruits, lean proteins, whole grains. Reduce refined carbohydrates, sugary drinks, and processed foods. Increase fiber intake. Practice mindful eating and portion control.',
            exercise: 'Aim for 200-300 minutes of moderate activity per week for weight loss. Combine cardio (brisk walking, jogging, cycling, swimming) with strength training 3-4 times per week. Start gradually and increase intensity over time. Consider HIIT workouts.',
        },
        obese: {
            risk: 'High risk. Obesity significantly increases risk of heart disease, stroke, type 2 diabetes, certain cancers, sleep apnea, and joint problems. Medical consultation strongly recommended.',
            diet: 'Consult a registered dietitian for a personalized meal plan. Create a calorie deficit under professional guidance. Focus on nutrient-dense, low-calorie foods: vegetables, lean proteins, whole grains. Eliminate sugary drinks and highly processed foods. Consider meal prepping. Track food intake.',
            exercise: 'Start with low-impact activities: walking, swimming, cycling, or water aerobics. Begin with 10-15 minutes daily and gradually increase. Add strength training once comfortable with cardio. Consider working with a personal trainer. Focus on consistency over intensity. Consult a doctor before starting any exercise program.',
        }
    };

    return recommendations[category];
}

// Calculate Water Intake
function calculateWaterIntake(weightKg) {
    const mlPerKg = 35;
    const totalMl = Math.round(weightKg * mlPerKg);
    const liters = (totalMl / 1000).toFixed(1);
    const cups = Math.round(totalMl / 240);
    return { ml: totalMl, liters, cups };
}

// Get Healthy Weight Range
function getHealthyRange(heightCm, currentWeight) {
    const heightM = heightCm / 100;
    const minHealthyWeight = 18.5 * (heightM * heightM);
    const maxHealthyWeight = 24.9 * (heightM * heightM);

    const minRounded = Math.round(minHealthyWeight * 10) / 10;
    const maxRounded = Math.round(maxHealthyWeight * 10) / 10;

    let message = `Your healthy weight range is <strong>${minRounded} - ${maxRounded} kg</strong>. `;

    if (currentWeight < minHealthyWeight) {
        const toGain = Math.round((minHealthyWeight - currentWeight) * 10) / 10;
        message += `You need to gain approximately <strong>${toGain} kg</strong> to reach the minimum healthy weight.`;
    } else if (currentWeight > maxHealthyWeight) {
        const toLose = Math.round((currentWeight - maxHealthyWeight) * 10) / 10;
        message += `You need to lose approximately <strong>${toLose} kg</strong> to reach the maximum healthy weight range.`;
    } else {
        message += `🎉 Congratulations! You are already within the healthy weight range. Keep up the great work!`;
    }

    return message;
}

// Display Results
function displayResults(bmi, category, recommendations, healthyRange, water) {
    bmiValue.textContent = bmi.toFixed(1);

    const categoryName = getCategoryDisplayName(category);
    bmiCategory.innerHTML = `<span class="badge badge-${category}">${categoryName}</span>`;

    positionGaugeMarker(bmi);

    healthRisk.textContent = recommendations.risk;
    dietSuggestions.textContent = recommendations.diet;
    exerciseSuggestions.textContent = recommendations.exercise;
    waterIntake.innerHTML = `You should drink approximately <strong>${water.liters} liters</strong> (${water.cups} cups or ${water.ml} ml) of water per day based on your body weight.`;
    weightGoal.innerHTML = healthyRange;

    resultsSection.hidden = false;
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Position Gauge Marker
function positionGaugeMarker(bmi) {
    let percentage;

    if (bmi < 18.5) {
        percentage = Math.min((bmi / 18.5) * 25, 25);
    } else if (bmi < 25) {
        percentage = 25 + ((bmi - 18.5) / (25 - 18.5)) * 25;
    } else if (bmi < 30) {
        percentage = 50 + ((bmi - 25) / (30 - 25)) * 25;
    } else {
        percentage = 75 + Math.min(((bmi - 30) / 20) * 25, 25);
    }

    gaugeMarker.style.left = `${percentage}%`;
}

// ==================== PROGRESS TRACKING FUNCTIONS ====================

// Load History from Backend
async function loadHistory() {
    try {
        const response = await fetch(`${API_URL}/bmi`, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        const data = await response.json();

        if (response.ok) {
            if (data.count === 0) {
                noData.hidden = false;
                progressData.hidden = true;
                return;
            }

            noData.hidden = true;
            progressData.hidden = false;

            renderHistory(data.data);
            drawChart(data.data);
        } else {
            if (response.status === 401) {
                handleLogout();
            }
        }
    } catch (error) {
        console.error('Load history error:', error);
    }
}

// Render History Table
function renderHistory(history) {
    historyTableBody.innerHTML = '';

    history.forEach(entry => {
        const row = document.createElement('tr');

        const date = new Date(entry.createdAt);
        const formattedDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const categoryName = getCategoryDisplayName(entry.category);

        row.innerHTML = `
            <td>${formattedDate}</td>
            <td>${entry.weightKg.toFixed(1)}</td>
            <td>${entry.bmi.toFixed(1)}</td>
            <td><span class="badge badge-${entry.category}">${categoryName}</span></td>
            <td><button class="btn-delete" onclick="deleteRecord('${entry._id}')">Delete</button></td>
        `;

        historyTableBody.appendChild(row);
    });
}

// Delete Single Record
async function deleteRecord(id) {
    if (!confirm('Delete this BMI record?')) return;

    try {
        const response = await fetch(`${API_URL}/bmi/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });

        const data = await response.json();

        if (response.ok) {
            loadHistory(); // Refresh history
        } else {
            alert(data.message || 'Failed to delete record');
        }
    } catch (error) {
        console.error('Delete record error:', error);
        alert('Network error. Please try again.');
    }
}

// Clear All History
async function clearHistory() {
    if (!confirm('Are you sure you want to clear all BMI history? This action cannot be undone.')) return;

    try {
        const response = await fetch(`${API_URL}/bmi`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });

        const data = await response.json();

        if (response.ok) {
            loadHistory(); // Refresh history
        } else {
            alert(data.message || 'Failed to clear history');
        }
    } catch (error) {
        console.error('Clear history error:', error);
        alert('Network error. Please try again.');
    }
}

// Draw BMI Chart
function drawChart(history) {
    const canvas = document.getElementById('bmiChart');
    const ctx = canvas.getContext('2d');

    if (bmiChart) {
        bmiChart.destroy();
    }

    // Reverse to show oldest first in chart
    const reversed = [...history].reverse();

    const labels = reversed.map(entry => {
        const date = new Date(entry.createdAt);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });

    const bmiData = reversed.map(entry => entry.bmi);

    const isDarkMode = document.body.classList.contains('dark-mode');
    const textColor = isDarkMode ? '#cbd5e1' : '#64748b';
    const gridColor = isDarkMode ? '#334155' : '#e2e8f0';

    bmiChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'BMI Over Time',
                data: bmiData,
                borderColor: '#14b8a6',
                backgroundColor: 'rgba(20, 184, 166, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 5,
                pointHoverRadius: 7,
                pointBackgroundColor: '#14b8a6',
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: textColor,
                        font: {
                            size: 14,
                            weight: '600'
                        }
                    }
                },
                tooltip: {
                    backgroundColor: isDarkMode ? '#1e293b' : '#fff',
                    titleColor: textColor,
                    bodyColor: textColor,
                    borderColor: gridColor,
                    borderWidth: 1,
                    padding: 12,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return `BMI: ${context.parsed.y.toFixed(1)}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: 'BMI',
                        color: textColor,
                        font: {
                            size: 14,
                            weight: '600'
                        }
                    },
                    ticks: {
                        color: textColor
                    },
                    grid: {
                        color: gridColor
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Date',
                        color: textColor,
                        font: {
                            size: 14,
                            weight: '600'
                        }
                    },
                    ticks: {
                        color: textColor,
                        maxRotation: 45,
                        minRotation: 45
                    },
                    grid: {
                        color: gridColor
                    }
                }
            }
        }
    });
}

// ==================== DARK MODE FUNCTIONS ====================

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');

    darkModeToggle.querySelector('.icon').textContent = isDark ? '☀️' : '🌙';

    try {
        localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
    } catch (error) {
        console.warn('Unable to save dark mode preference:', error);
    }

    if (bmiChart) {
        loadHistory(); // Redraw chart with new colors
    }
}

function loadDarkModePreference() {
    try {
        const darkMode = localStorage.getItem('darkMode');
        if (darkMode === 'enabled') {
            document.body.classList.add('dark-mode');
            darkModeToggle.querySelector('.icon').textContent = '☀️';
        }
    } catch (error) {
        console.warn('Unable to load dark mode preference:', error);
    }
}
