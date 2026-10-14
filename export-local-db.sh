#!/bin/bash

# Script to export local MongoDB data for migration to cloud

echo "🔄 Exporting local MongoDB data..."
echo ""

# Check if MongoDB tools are installed
if ! command -v mongoexport &> /dev/null; then
    echo "❌ mongoexport not found!"
    echo "Please install MongoDB Database Tools:"
    echo "https://www.mongodb.com/try/download/database-tools"
    exit 1
fi

# Create exports directory
mkdir -p db-exports
cd db-exports

# Export users collection
echo "📤 Exporting users collection..."
mongoexport --uri="mongodb://127.0.0.1:27017/bmi_app" --collection=users --out=users.json

if [ $? -eq 0 ]; then
    echo "✅ Users exported successfully"
else
    echo "❌ Failed to export users"
fi

# Export bmirecords collection
echo "📤 Exporting bmirecords collection..."
mongoexport --uri="mongodb://127.0.0.1:27017/bmi_app" --collection=bmirecords --out=bmirecords.json

if [ $? -eq 0 ]; then
    echo "✅ BMI records exported successfully"
else
    echo "❌ Failed to export bmirecords"
fi

# Show summary
echo ""
echo "📊 Export Summary:"
echo "Location: $(pwd)"
ls -lh *.json 2>/dev/null || echo "No files exported"

echo ""
echo "✨ Next steps:"
echo "1. Set up MongoDB Atlas (free): https://www.mongodb.com/cloud/atlas/register"
echo "2. Get your Atlas connection string"
echo "3. Run: bash import-to-atlas.sh 'your-connection-string'"
