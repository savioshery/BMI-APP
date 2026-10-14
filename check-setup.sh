#!/bin/bash

# BMI Calculator - Test Script
# This script tests if all components are working

echo "╔══════════════════════════════════════════════════════════╗"
echo "║        BMI Calculator - System Check                     ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

# Check Node.js
echo "🔍 Checking Node.js..."
if command -v node &> /dev/null
then
    NODE_VERSION=$(node -v)
    echo "✅ Node.js installed: $NODE_VERSION"
else
    echo "❌ Node.js not found. Please install from https://nodejs.org/"
    exit 1
fi

# Check npm
echo ""
echo "🔍 Checking npm..."
if command -v npm &> /dev/null
then
    NPM_VERSION=$(npm -v)
    echo "✅ npm installed: $NPM_VERSION"
else
    echo "❌ npm not found. Please install Node.js"
    exit 1
fi

# Check MongoDB
echo ""
echo "🔍 Checking MongoDB..."
if command -v mongosh &> /dev/null || command -v mongo &> /dev/null
then
    echo "✅ MongoDB CLI installed"

    # Test MongoDB connection
    echo "🔍 Testing MongoDB connection..."
    if mongosh --eval "db.runCommand({ ping: 1 })" mongodb://127.0.0.1:27017/test --quiet &> /dev/null || mongo --eval "db.runCommand({ ping: 1 })" mongodb://127.0.0.1:27017/test --quiet &> /dev/null
    then
        echo "✅ MongoDB is running and accepting connections"
    else
        echo "⚠️  MongoDB is not running. Please start MongoDB:"
        echo "   Windows: Start MongoDB service"
        echo "   macOS: brew services start mongodb-community"
        echo "   Linux: sudo systemctl start mongod"
    fi
else
    echo "⚠️  MongoDB CLI not found. Please install from https://www.mongodb.com/try/download/community"
fi

# Check if node_modules exists
echo ""
echo "🔍 Checking dependencies..."
if [ -d "node_modules" ]
then
    echo "✅ Dependencies installed"
else
    echo "⚠️  Dependencies not installed. Run: npm install"
fi

# Check if .env exists
echo ""
echo "🔍 Checking configuration..."
if [ -f ".env" ]
then
    echo "✅ Configuration file (.env) exists"
    if grep -q "JWT_SECRET=your_secret_change_this_in_production" .env
    then
        echo "⚠️  WARNING: Using default JWT_SECRET. Change this for production!"
    fi
else
    echo "❌ .env file not found"
fi

# Check if required files exist
echo ""
echo "🔍 Checking project files..."
FILES=("server.js" "package.json" "models/User.js" "models/BmiRecord.js" "routes/authRoutes.js" "routes/bmiRoutes.js" "middleware/auth.js" "public/index.html" "public/style.css" "public/script.js")

ALL_FILES_EXIST=true
for file in "${FILES[@]}"
do
    if [ -f "$file" ]
    then
        echo "✅ $file"
    else
        echo "❌ $file - MISSING!"
        ALL_FILES_EXIST=false
    fi
done

# Summary
echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║                    SUMMARY                               ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

if [ "$ALL_FILES_EXIST" = true ]
then
    echo "✅ All project files are in place"
else
    echo "❌ Some files are missing"
fi

echo ""
echo "📋 Next steps:"
echo "   1. Ensure MongoDB is running"
echo "   2. Run: npm install (if not done)"
echo "   3. Run: npm run dev"
echo "   4. Open: http://localhost:5000"
echo ""
echo "🎉 You're ready to go!"
