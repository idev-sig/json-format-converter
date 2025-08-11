#!/bin/bash

# Development Server Script for JSON Format Converter

set -e

echo "🚀 Starting JSON Format Converter Development Server"
echo "===================================================="

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PORT=${1:-8080}
SRC_DIR="src"

# Check if source directory exists
if [ ! -d "$SRC_DIR" ]; then
    echo "❌ Source directory '$SRC_DIR' not found!"
    echo "Please run this script from the project root directory."
    exit 1
fi

# Create temporary development directory
DEV_DIR="dev-server"
echo -e "${BLUE}📁 Setting up development environment...${NC}"

# Clean and create dev directory
rm -rf $DEV_DIR
mkdir -p $DEV_DIR

# Copy files with corrected paths for development
echo -e "${BLUE}📋 Copying source files...${NC}"

# Copy HTML files and fix paths
cp $SRC_DIR/html/popup.html $DEV_DIR/
cp $SRC_DIR/html/standalone.html $DEV_DIR/
cp $SRC_DIR/html/help.html $DEV_DIR/

# Fix paths in HTML files for development server
sed -i 's|../lib/|lib/|g' $DEV_DIR/*.html
sed -i 's|../css/|css/|g' $DEV_DIR/*.html
sed -i 's|../js/|js/|g' $DEV_DIR/*.html

# Copy assets
cp -r $SRC_DIR/lib $DEV_DIR/
cp -r $SRC_DIR/icons $DEV_DIR/
mkdir -p $DEV_DIR/css $DEV_DIR/js
cp $SRC_DIR/css/styles.css $DEV_DIR/css/
cp $SRC_DIR/js/*.js $DEV_DIR/js/

# Copy test files if they exist
if [ -d "tests" ]; then
    cp tests/*.html $DEV_DIR/ 2>/dev/null || true
fi

echo -e "${GREEN}✅ Development environment ready${NC}"
echo ""
echo -e "${YELLOW}🌐 Available URLs:${NC}"
echo "   - Main App: http://localhost:$PORT/standalone.html"
echo "   - Extension Popup: http://localhost:$PORT/popup.html"
echo "   - Help Page: http://localhost:$PORT/help.html"

# Check for test files
if [ -f "$DEV_DIR/test.html" ]; then
    echo "   - Function Tests: http://localhost:$PORT/test.html"
fi
if [ -f "$DEV_DIR/i18n-test.html" ]; then
    echo "   - I18n Tests: http://localhost:$PORT/i18n-test.html"
fi
if [ -f "$DEV_DIR/button-test.html" ]; then
    echo "   - Button Tests: http://localhost:$PORT/button-test.html"
fi
if [ -f "$DEV_DIR/comment-preservation-test.html" ]; then
    echo "   - Comment Tests: http://localhost:$PORT/comment-preservation-test.html"
fi
if [ -f "$DEV_DIR/error-check.html" ]; then
    echo "   - Error Check: http://localhost:$PORT/error-check.html"
fi

echo ""
echo -e "${BLUE}🔧 Development Tips:${NC}"
echo "   - Edit files in the 'src/' directory"
echo "   - Restart the server to see changes"
echo "   - Use Ctrl+C to stop the server"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo -e "${YELLOW}🧹 Cleaning up development environment...${NC}"
    rm -rf $DEV_DIR
    echo -e "${GREEN}✅ Cleanup completed${NC}"
}

# Set trap to cleanup on script exit
trap cleanup EXIT

# Start the development server
echo -e "${GREEN}🚀 Starting server on port $PORT...${NC}"
echo -e "${YELLOW}Press Ctrl+C to stop the server${NC}"
echo ""

cd $DEV_DIR

# Try different Python versions
if command -v python3 &> /dev/null; then
    python3 -m http.server $PORT
elif command -v python &> /dev/null; then
    python -m http.server $PORT
else
    echo "❌ Python not found! Please install Python to run the development server."
    exit 1
fi
