#!/bin/bash

# Decast DID Web Application - Performance Testing Script
# This script installs dependencies and runs performance tests

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
check_node() {
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js >= 18.0.0"
        exit 1
    fi
    
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18 or higher is required. Current version: $(node --version)"
        exit 1
    fi
    
    print_success "Node.js version: $(node --version)"
}

# Check if npm is installed
check_npm() {
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm"
        exit 1
    fi
    
    print_success "npm version: $(npm --version)"
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    if [ ! -f "package.json" ]; then
        print_error "package.json not found. Please run this script from the test/performance directory"
        exit 1
    fi
    
    npm install
    
    if [ $? -eq 0 ]; then
        print_success "Dependencies installed successfully"
    else
        print_error "Failed to install dependencies"
        exit 1
    fi
}

# Run tests
run_tests() {
    local test_type=${1:-"all"}
    local target_url=${2:-"https://did.decast.live"}
    
    print_status "Running $test_type tests against $target_url"
    
    case $test_type in
        "latency")
            npm run test:latency -- --url "$target_url"
            ;;
        "all"|*)
            npm test -- --url "$target_url"
            ;;
    esac
    
    if [ $? -eq 0 ]; then
        print_success "Tests completed successfully"
    else
        print_error "Tests failed"
        exit 1
    fi
}

# Show help
show_help() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -t, --type TYPE       Type of test to run (latency, all) [default: all]"
    echo "  -u, --url URL         Target URL for testing [default: https://did.decast.live]"
    echo "  -i, --install-only    Only install dependencies, don't run tests"
    echo "  -h, --help            Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                                    # Run all tests against default URL"
    echo "  $0 -t latency                         # Run only latency tests"
    echo "  $0 -t latency -u https://example.com     # Run latency tests against custom URL"
    echo "  $0 -i                                 # Only install dependencies"
}

# Parse command line arguments
TEST_TYPE="all"
TARGET_URL="https://did.decast.live"
INSTALL_ONLY=false

while [[ $# -gt 0 ]]; do
    case $1 in
        -t|--type)
            TEST_TYPE="$2"
            shift 2
            ;;
        -u|--url)
            TARGET_URL="$2"
            shift 2
            ;;
        -i|--install-only)
            INSTALL_ONLY=true
            shift
            ;;
        -h|--help)
            show_help
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

# Main execution
main() {
    print_status "Starting Decast DID Web Application Performance Tests"
    print_status "=================================================="
    
    # Check prerequisites
    check_node
    check_npm
    
    # Install dependencies
    install_dependencies
    
    # Run tests if not install-only
    if [ "$INSTALL_ONLY" = false ]; then
        run_tests "$TEST_TYPE" "$TARGET_URL"
    else
        print_success "Dependencies installed. Run tests manually with: npm test"
    fi
    
    print_success "Script completed successfully!"
}

# Run main function
main

