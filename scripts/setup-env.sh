#!/bin/bash

# Decast DID System Environment Setup Script
# This script helps you set up environment variables for the Decast DID system

set -e

echo "🔧 Decast DID System Environment Setup"
echo "======================================"

# Check if .env already exists
if [ -f ".env" ]; then
    echo "⚠️  .env file already exists!"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Setup cancelled."
        exit 0
    fi
fi

# Copy the example file
echo "📋 Copying environment template..."
cp env-example .env

echo "✅ Environment file created: .env"
echo ""
echo "📝 Please edit the .env file with your specific values:"
echo "   - GOOGLE_CLIENT_ID: Your Google OAuth Client ID"
echo "   - DID_BASE_URL: Your DID service URL"
echo "   - EXTENSION_ID: Your browser extension ID"
echo ""
echo "🔍 You can edit it with:"
echo "   nano .env"
echo "   # or"
echo "   vim .env"
echo "   # or"
echo "   code .env"
echo ""
echo "🚀 After editing, you can start the application with:"
echo "   # For local development:"
echo "   pnpm dev"
echo ""
echo "   # For Docker:"
echo "   docker-compose up -d"
echo ""
echo "📚 For more information, see the README.md file."
