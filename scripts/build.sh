#!/bin/bash

# JSON Format Converter Build Script

set -e

echo "🚀 JSON Format Converter Build Script"
echo "======================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BUILD_DIR="dist"
SRC_DIR="src"
EXTENSION_NAME="json-format-converter-extension"
STANDALONE_NAME="json-format-converter-standalone"

# Clean previous builds
echo -e "${BLUE}🧹 Cleaning previous builds...${NC}"
rm -rf $BUILD_DIR
rm -f *.zip

# Create build directories
echo -e "${BLUE}📁 Creating build directories...${NC}"
mkdir -p $BUILD_DIR/extension
mkdir -p $BUILD_DIR/standalone

# Build Chrome Extension
echo -e "${YELLOW}📦 Building Chrome extension...${NC}"

# Copy manifest
cp $SRC_DIR/manifest.json $BUILD_DIR/extension/

# Copy and process HTML files for extension
cp $SRC_DIR/html/popup.html $BUILD_DIR/extension/
# Fix paths in popup.html for extension
sed -i 's|../lib/|lib/|g' $BUILD_DIR/extension/popup.html
sed -i 's|../css/|css/|g' $BUILD_DIR/extension/popup.html
sed -i 's|../js/|js/|g' $BUILD_DIR/extension/popup.html

# Copy assets
cp -r $SRC_DIR/lib $BUILD_DIR/extension/
cp -r $SRC_DIR/icons $BUILD_DIR/extension/
mkdir -p $BUILD_DIR/extension/css $BUILD_DIR/extension/js
cp $SRC_DIR/css/styles.css $BUILD_DIR/extension/css/
cp $SRC_DIR/js/*.js $BUILD_DIR/extension/js/

# Copy documentation
cp README.md $BUILD_DIR/extension/
cp README_zh.md $BUILD_DIR/extension/

echo -e "${GREEN}✅ Chrome extension built successfully${NC}"

# Build Standalone Version
echo -e "${YELLOW}🌐 Building standalone version...${NC}"

# Copy and process HTML files for standalone
cp $SRC_DIR/html/standalone.html $BUILD_DIR/standalone/index.html
cp $SRC_DIR/html/help.html $BUILD_DIR/standalone/

# Fix paths in standalone files
sed -i 's|../lib/|lib/|g' $BUILD_DIR/standalone/index.html
sed -i 's|../css/|css/|g' $BUILD_DIR/standalone/index.html
sed -i 's|../js/|js/|g' $BUILD_DIR/standalone/index.html

# Copy assets
cp -r $SRC_DIR/lib $BUILD_DIR/standalone/
cp -r $SRC_DIR/icons $BUILD_DIR/standalone/
mkdir -p $BUILD_DIR/standalone/css $BUILD_DIR/standalone/js
cp $SRC_DIR/css/styles.css $BUILD_DIR/standalone/css/
cp $SRC_DIR/js/*.js $BUILD_DIR/standalone/js/

# Copy documentation
cp README.md $BUILD_DIR/standalone/
cp README_zh.md $BUILD_DIR/standalone/
cp package.json $BUILD_DIR/standalone/

echo -e "${GREEN}✅ Standalone version built successfully${NC}"

# Create distribution packages
echo -e "${YELLOW}🗜️  Creating distribution packages...${NC}"

# Create extension zip
cd $BUILD_DIR/extension
zip -r "../../${EXTENSION_NAME}.zip" . -x "*.DS_Store"
cd ../..

# Create standalone zip
cd $BUILD_DIR/standalone
zip -r "../../${STANDALONE_NAME}.zip" . -x "*.DS_Store"
cd ../..

echo -e "${GREEN}✅ Distribution packages created${NC}"

# Generate build info
echo -e "${BLUE}📋 Generating build information...${NC}"
cat > $BUILD_DIR/build-info.txt << EOF
JSON Format Converter - Build Information
=========================================

Build Date: $(date)
Build Version: $(grep '"version"' package.json | head -1 | cut -d'"' -f4)
Git Commit: $(git rev-parse --short HEAD 2>/dev/null || echo "N/A")

Files Generated:
- ${EXTENSION_NAME}.zip (Chrome Extension)
- ${STANDALONE_NAME}.zip (Standalone Web App)

Directory Structure:
- dist/extension/ (Chrome extension files)
- dist/standalone/ (Standalone web app files)

Installation Instructions:
=========================

Chrome Extension:
1. Extract ${EXTENSION_NAME}.zip
2. Open chrome://extensions/
3. Enable Developer mode
4. Click 'Load unpacked' and select the extracted folder

Standalone Web App:
1. Extract ${STANDALONE_NAME}.zip
2. Upload files to your web server
3. Access index.html in your browser

EOF

echo -e "${GREEN}🎉 Build completed successfully!${NC}"
echo ""
echo -e "${BLUE}📋 Generated files:${NC}"
echo "   - ${EXTENSION_NAME}.zip (Chrome extension package)"
echo "   - ${STANDALONE_NAME}.zip (Standalone web app)"
echo "   - dist/extension/ (Chrome extension files)"
echo "   - dist/standalone/ (Standalone web app files)"
echo "   - dist/build-info.txt (Build information)"
echo ""
echo -e "${YELLOW}📊 Package sizes:${NC}"
if [ -f "${EXTENSION_NAME}.zip" ]; then
    echo "   - Extension: $(du -h ${EXTENSION_NAME}.zip | cut -f1)"
fi
if [ -f "${STANDALONE_NAME}.zip" ]; then
    echo "   - Standalone: $(du -h ${STANDALONE_NAME}.zip | cut -f1)"
fi
echo ""
echo -e "${GREEN}🚀 Ready for deployment!${NC}"
