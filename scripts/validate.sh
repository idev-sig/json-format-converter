#!/bin/bash

# Validation script for JSON Format Converter

echo "🔍 JSON Format Converter - Validation Script"
echo "============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
TOTAL_CHECKS=0
PASSED_CHECKS=0
FAILED_CHECKS=0

# Function to run a check
check() {
    local description="$1"
    local command="$2"
    
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    echo -n "  Checking $description... "
    
    if eval "$command" >/dev/null 2>&1; then
        echo -e "${GREEN}✅ PASS${NC}"
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
    else
        echo -e "${RED}❌ FAIL${NC}"
        FAILED_CHECKS=$((FAILED_CHECKS + 1))
    fi
}

# Function to check file exists
check_file() {
    local file="$1"
    local description="$2"
    check "$description" "[ -f '$file' ]"
}

# Function to check directory exists
check_dir() {
    local dir="$1"
    local description="$2"
    check "$description" "[ -d '$dir' ]"
}

echo -e "${BLUE}📁 Checking project structure...${NC}"

# Check source directories
check_dir "src" "src directory exists"
check_dir "src/html" "src/html directory exists"
check_dir "src/css" "src/css directory exists"
check_dir "src/js" "src/js directory exists"
check_dir "src/lib" "src/lib directory exists"
check_dir "src/icons" "src/icons directory exists"

# Check source files
check_file "src/manifest.json" "manifest.json exists"
check_file "src/html/popup.html" "popup.html exists"
check_file "src/html/standalone.html" "standalone.html exists"
check_file "src/html/help.html" "help.html exists"
check_file "src/css/styles.css" "styles.css exists"
check_file "src/js/i18n.js" "i18n.js exists"
check_file "src/js/converter.js" "converter.js exists"
check_file "src/js/popup.js" "popup.js exists"

# Check library files
check_file "src/lib/codemirror.min.js" "CodeMirror library exists"
check_file "src/lib/javascript.min.js" "JavaScript mode exists"
check_file "src/lib/json5.min.js" "JSON5 library exists"
check_file "src/lib/codemirror.min.css" "CodeMirror CSS exists"

# Check icon files
check_file "src/icons/icon16.png" "16px icon exists"
check_file "src/icons/icon32.png" "32px icon exists"
check_file "src/icons/icon48.png" "48px icon exists"
check_file "src/icons/icon128.png" "128px icon exists"
check_file "src/icons/icon.svg" "SVG icon exists"

echo ""
echo -e "${BLUE}🔧 Checking build system...${NC}"

# Check scripts
check_dir "scripts" "scripts directory exists"
check_file "scripts/build.sh" "build script exists"
check_file "scripts/dev-server.sh" "dev server script exists"
check "build script is executable" "[ -x 'scripts/build.sh' ]"
check "dev server script is executable" "[ -x 'scripts/dev-server.sh' ]"

# Check configuration files
check_file "justfile" "justfile exists"
check_file "package.json" "package.json exists"
check_file "project.config.js" "project config exists"

echo ""
echo -e "${BLUE}🧪 Checking test files...${NC}"

check_dir "tests" "tests directory exists"
check_file "tests/test.html" "main test file exists"
check_file "tests/i18n-test.html" "i18n test file exists"
check_file "tests/error-check.html" "error check file exists"

echo ""
echo -e "${BLUE}📦 Checking build outputs...${NC}"

if [ -d "dist" ]; then
    check_dir "dist/extension" "extension build directory exists"
    check_dir "dist/standalone" "standalone build directory exists"
    check_file "dist/build-info.txt" "build info file exists"
    
    if [ -d "dist/extension" ]; then
        check_file "dist/extension/manifest.json" "extension manifest exists"
        check_file "dist/extension/popup.html" "extension popup exists"
        check_dir "dist/extension/js" "extension js directory exists"
        check_dir "dist/extension/css" "extension css directory exists"
        check_dir "dist/extension/lib" "extension lib directory exists"
        check_dir "dist/extension/icons" "extension icons directory exists"
    fi
    
    if [ -d "dist/standalone" ]; then
        check_file "dist/standalone/index.html" "standalone index exists"
        check_file "dist/standalone/help.html" "standalone help exists"
        check_dir "dist/standalone/js" "standalone js directory exists"
        check_dir "dist/standalone/css" "standalone css directory exists"
        check_dir "dist/standalone/lib" "standalone lib directory exists"
        check_dir "dist/standalone/icons" "standalone icons directory exists"
    fi
else
    echo -e "  ${YELLOW}⚠️  No build outputs found. Run 'just build-new' first.${NC}"
fi

echo ""
echo -e "${BLUE}📋 Checking package files...${NC}"

if [ -f "json-format-converter-extension.zip" ]; then
    check_file "json-format-converter-extension.zip" "extension package exists"
    check "extension package is not empty" "[ -s 'json-format-converter-extension.zip' ]"
else
    echo -e "  ${YELLOW}⚠️  Extension package not found${NC}"
fi

if [ -f "json-format-converter-standalone.zip" ]; then
    check_file "json-format-converter-standalone.zip" "standalone package exists"
    check "standalone package is not empty" "[ -s 'json-format-converter-standalone.zip' ]"
else
    echo -e "  ${YELLOW}⚠️  Standalone package not found${NC}"
fi

echo ""
echo -e "${BLUE}🔍 Checking file syntax...${NC}"

# Check JSON syntax
if command -v node >/dev/null 2>&1; then
    check "manifest.json syntax" "node -e 'JSON.parse(require(\"fs\").readFileSync(\"src/manifest.json\", \"utf8\"))'"
    check "package.json syntax" "node -e 'JSON.parse(require(\"fs\").readFileSync(\"package.json\", \"utf8\"))'"
else
    echo -e "  ${YELLOW}⚠️  Node.js not available, skipping JSON syntax checks${NC}"
fi

# Check JavaScript syntax (basic)
if command -v node >/dev/null 2>&1; then
    check "i18n.js syntax" "node -c src/js/i18n.js"
    check "converter.js syntax" "node -c src/js/converter.js"
    check "popup.js syntax" "node -c src/js/popup.js"
else
    echo -e "  ${YELLOW}⚠️  Node.js not available, skipping JavaScript syntax checks${NC}"
fi

echo ""
echo "============================================="
echo -e "${BLUE}📊 Validation Summary${NC}"
echo "============================================="
echo "Total checks: $TOTAL_CHECKS"
echo -e "Passed: ${GREEN}$PASSED_CHECKS${NC}"
echo -e "Failed: ${RED}$FAILED_CHECKS${NC}"

if [ $FAILED_CHECKS -eq 0 ]; then
    echo ""
    echo -e "${GREEN}🎉 All checks passed! Project is ready for deployment.${NC}"
    exit 0
else
    echo ""
    echo -e "${RED}❌ Some checks failed. Please review the issues above.${NC}"
    exit 1
fi
