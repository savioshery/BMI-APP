# BMI Calculator with Authentication

A full-stack BMI (Body Mass Index) Calculator web application with user authentication and progress tracking. Built with Node.js, Express, MongoDB, and vanilla JavaScript.

## Features

### User Authentication
- ✅ User registration with email validation
- ✅ Secure login with JWT tokens
- ✅ Password hashing with bcryptjs
- ✅ Protected API routes

### BMI Calculation
- ✅ Height and weight input with validation
- ✅ Server-side BMI calculation
- ✅ Four-tier classification (Underweight, Normal, Overweight, Obese)
- ✅ Visual BMI gauge with marker
- ✅ Personalized health recommendations
- ✅ Healthy weight goal calculations
- ✅ Water intake recommendations

### Progress Tracking
- ✅ Save BMI records to MongoDB
- ✅ View history in table format
- ✅ Interactive line chart (Chart.js)
- ✅ Delete individual records
- ✅ Clear all history
- ✅ Data persistence across sessions

### Design
- ✅ Fully responsive design
- ✅ Dark mode support
- ✅ Smooth animations
- ✅ Accessible (ARIA labels, semantic HTML)
- ✅ Mobile-first approach

## Tech Stack

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- CORS

**Frontend:**
- HTML5
- CSS3 (Custom properties, Grid, Flexbox)
- Vanilla JavaScript (ES6+)
- Chart.js

## Folder Structure

```
bmi-app/
├── server.js              # Express server entry point
├── .env                   # Environment variables
├── package.json           # Dependencies and scripts
├── models/
│   ├── User.js           # User model schema
│   └── BmiRecord.js      # BMI record schema
├── routes/
│   ├── authRoutes.js     # Authentication endpoints
│   └── bmiRoutes.js      # BMI CRUD endpoints
├── middleware/
│   └── auth.js           # JWT authentication middleware
└── public/               # Frontend files
    ├── index.html        # Main HTML file
    ├── style.css         # Styles and dark mode
    └── script.js         # Frontend logic
```

## Setup Instructions

### Prerequisites

- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (v4 or higher) - [Download here](https://www.mongodb.com/try/download/community)

### Installation

1. **Navigate to the project folder:**
   ```bash
   cd bmi-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   
   The `.env` file is already created with default values:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/bmi_app
   JWT_SECRET=your_secret_change_this_in_production_2026
   JWT_EXPIRES_IN=7d
   ```

   **⚠️ Important:** Change `JWT_SECRET` before deploying to production!

4. **Start MongoDB:**

   Make sure MongoDB is running on your system:
   
   **Windows:**
   ```bash
   # MongoDB should be running as a service, or start it with:
   mongod
   ```

   **macOS (with Homebrew):**
   ```bash
   brew services start mongodb-community
   ```

   **Linux:**
   ```bash
   sudo systemctl start mongod
   ```

5. **Run the application:**

   **Development mode (with auto-restart):**
   ```bash
   npm run dev
   ```

   **Production mode:**
   ```bash
   npm start
   ```

6. **Open your browser:**
   
   Navigate to: **http://localhost:5000**

## API Endpoints

### Authentication (Public)

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### BMI Records (Protected - Requires JWT)

#### Calculate BMI
```http
POST /api/bmi
Authorization: Bearer <token>
Content-Type: application/json

{
  "heightCm": 175,
  "weightKg": 70
}
```

**Response:**
```json
{
  "success": true,
  "message": "BMI calculated successfully.",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "heightCm": 175,
    "weightKg": 70,
    "bmi": 22.9,
    "category": "normal",
    "createdAt": "2026-10-08T13:11:19.844Z"
  }
}
```

#### Get All Records
```http
GET /api/bmi
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "heightCm": 175,
      "weightKg": 70,
      "bmi": 22.9,
      "category": "normal",
      "createdAt": "2026-10-08T13:11:19.844Z"
    }
  ]
}
```

#### Delete Single Record
```http
DELETE /api/bmi/:id
Authorization: Bearer <token>
```

#### Clear All Records
```http
DELETE /api/bmi
Authorization: Bearer <token>
```

## Error Codes

- **400** - Bad Request (Invalid input)
- **401** - Unauthorized (Missing or invalid token)
- **403** - Forbidden (Not allowed to access resource)
- **404** - Not Found (Resource doesn't exist)
- **409** - Conflict (Email already registered)
- **500** - Internal Server Error

## Security Features

- ✅ Passwords hashed with bcryptjs (10 salt rounds)
- ✅ JWT tokens with expiration (7 days default)
- ✅ Password never sent in API responses
- ✅ Protected routes with authentication middleware
- ✅ User-specific data isolation
- ✅ Input validation on both client and server

## Development Notes

### Testing the API with curl

**Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

**Calculate BMI:**
```bash
curl -X POST http://localhost:5000/api/bmi \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"heightCm":175,"weightKg":70}'
```

### MongoDB Connection Issues

If you encounter MongoDB connection errors:

1. Make sure MongoDB is running
2. Check the connection string in `.env`
3. Try connecting to MongoDB directly:
   ```bash
   mongosh mongodb://127.0.0.1:27017/bmi_app
   ```

### Port Already in Use

If port 5000 is already in use, change it in `.env`:
```env
PORT=3000
```

## Credits

**Department of Information Technology | 2026**

**Development Team:**
- Abhinav Bins
- Imran Sinaj
- Savio Shery
- Merin George
- Nesha Benny

## License

ISC License - Free to use for educational purposes.

## Future Enhancements

- 📧 Email verification for new users
- 🔑 Password reset functionality
- 📊 Advanced analytics and insights
- 🎯 Goal setting and tracking
- 📱 Progressive Web App (PWA) support
- 🌐 Multi-language support
- 📤 Export data as PDF/CSV
- 👥 Social features (optional sharing)

---

**Happy Coding! 🚀**
