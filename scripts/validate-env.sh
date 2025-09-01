#!/bin/bash

# Environment validation script for Decast DID System
# This script checks if all required environment variables are set

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Required environment variables
required_vars=(
    "GOOGLE_CLIENT_ID"
    "DID_BASE_URL"
    "EXTENSION_ID"
)

# Optional environment variables with defaults
optional_vars=(
    "NODE_ENV"
    "HOST"
    "PORT"
)

echo "🔍 Validating environment variables..."

# Load .env file if it exists
if [ -f ".env" ]; then
    echo "📄 Loading .env file..."
    export $(grep -v '^#' .env | xargs)
fi

# Check required variables
missing_vars=()
for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        missing_vars+=("$var")
    fi
done

# Report missing required variables
if [ ${#missing_vars[@]} -ne 0 ]; then
    echo -e "${RED}❌ Missing required environment variables:${NC}"
    for var in "${missing_vars[@]}"; do
        echo -e "  ${RED}• $var${NC}"
    done
    echo ""
    echo -e "${YELLOW}💡 To fix this:${NC}"
    echo "  1. Run: ./scripts/setup-env.sh"
    echo "  2. Edit .env and set the missing variables"
    echo "  3. Run this script again"
    exit 1
fi

# Check optional variables and provide defaults
echo -e "${GREEN}✅ All required environment variables are set:${NC}"
for var in "${required_vars[@]}"; do
    echo -e "  ${GREEN}• $var=${!var}${NC}"
done

echo ""
echo -e "${YELLOW}📋 Optional environment variables:${NC}"
for var in "${optional_vars[@]}"; do
    if [ -z "${!var}" ]; then
        case $var in
            "NODE_ENV")
                echo -e "  ${YELLOW}• $var (default: production)${NC}"
                ;;
            "HOST")
                echo -e "  ${YELLOW}• $var (default: 0.0.0.0)${NC}"
                ;;
            "PORT")
                echo -e "  ${YELLOW}• $var (default: 8080)${NC}"
                ;;
        esac
    else
        echo -e "  ${GREEN}• $var=${!var}${NC}"
    fi
done

echo ""
echo -e "${GREEN}🎉 Environment validation passed!${NC}"

# Additional checks
echo ""
echo "🔧 Additional checks:"

# Check if .env file exists
if [ -f ".env" ]; then
    echo -e "  ${GREEN}✅ .env file exists${NC}"
else
    echo -e "  ${YELLOW}⚠️  .env file not found (using system environment variables)${NC}"
fi

# Check if Docker is running (if docker command is available)
if command -v docker &> /dev/null; then
    if docker info &> /dev/null; then
        echo -e "  ${GREEN}✅ Docker is running${NC}"
    else
        echo -e "  ${YELLOW}⚠️  Docker is not running${NC}"
    fi
else
    echo -e "  ${YELLOW}⚠️  Docker not installed${NC}"
fi

# Check if pnpm is available
if command -v pnpm &> /dev/null; then
    echo -e "  ${GREEN}✅ pnpm is available${NC}"
else
    echo -e "  ${YELLOW}⚠️  pnpm not found${NC}"
fi

echo ""
echo -e "${GREEN}🚀 Ready to run Decast DID System!${NC}"
