#!/bin/bash

# Script to import data to MongoDB Atlas

if [ -z "$1" ]; then
    echo "❌ Usage: bash import-to-atlas.sh 'mongodb+srv://username:password@cluster.mongodb.net/bmi_app'"
    echo ""
    echo "Example:"
    echo "bash import-to-atlas.sh 'mongodb+srv://admin:mypassword@cluster0.abcde.mongodb.net/bmi_app'"
    exit 1
fi

ATLAS_URI="$1"

echo "🔄 Importing data to MongoDB Atlas..."
echo ""

# Check if MongoDB tools are installed
if ! command -v mongoimport &> /dev/null; then
    echo "❌ mongoimport not found!"
    echo "Please install MongoDB Database Tools:"
    echo "https://www.mongodb.com/try/download/database-tools"
    exit 1
fi

# Check if export files exist
if [ ! -d "db-exports" ]; then
    echo "❌ No db-exports folder found!"
    echo "Run 'bash export-local-db.sh' first"
    exit 1
fi

cd db-exports

# Import users
if [ -f "users.json" ]; then
    echo "📥 Importing users..."
    mongoimport --uri="$ATLAS_URI" --collection=users --file=users.json
    if [ $? -eq 0 ]; then
        echo "✅ Users imported successfully"
    else
        echo "❌ Failed to import users"
    fi
else
    echo "⚠️  users.json not found, skipping"
fi

echo ""

# Import bmirecords
if [ -f "bmirecords.json" ]; then
    echo "📥 Importing BMI records..."
    mongoimport --uri="$ATLAS_URI" --collection=bmirecords --file=bmirecords.json
    if [ $? -eq 0 ]; then
        echo "✅ BMI records imported successfully"
    else
        echo "❌ Failed to import bmirecords"
    fi
else
    echo "⚠️  bmirecords.json not found, skipping"
fi

echo ""
echo "✨ Import complete!"
echo ""
echo "🔍 Verify in MongoDB Compass:"
echo "1. Click 'New Connection'"
echo "2. Paste: $ATLAS_URI"
echo "3. Click 'Connect'"
echo "4. Check bmi_app database"
