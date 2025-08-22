#!/usr/bin/env node

/**
 * JSON Format Converter Build Script
 * Cross-platform Node.js build script for Windows, Linux, and macOS
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const BUILD_DIR = 'dist';
const SRC_DIR = 'src';
const EXTENSION_NAME = 'json-format-converter-chrome';
const FIREFOX_EXTENSION_NAME = 'json-format-converter-firefox';
const STANDALONE_NAME = 'json-format-converter-standalone';

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

// Utility functions
function log(message, color = colors.reset) {
    console.log(`${color}${message}${colors.reset}`);
}

function readJSON(filePath) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJSON(filePath, obj) {
    ensureDir(path.dirname(filePath));
    fs.writeFileSync(filePath, JSON.stringify(obj, null, 2), 'utf8');
}

function ensureDir(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

function copyFile(src, dest) {
    const destDir = path.dirname(dest);
    ensureDir(destDir);
    
    // Check if source file exists before copying
    if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest);
    } else {
        log(`Warning: Source file not found: ${src}`, colors.yellow);
    }
}

function copyDir(src, dest) {
    ensureDir(dest);
    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            copyFile(srcPath, destPath);
        }
    }
}

function replaceInFile(filePath, replacements) {
    let content = fs.readFileSync(filePath, 'utf8');

    for (const [search, replace] of replacements) {
        content = content.replace(new RegExp(search, 'g'), replace);
    }

    fs.writeFileSync(filePath, content, 'utf8');
}

function createZip(sourceDir, outputPath) {
    try {
        // Try using built-in zip command (available on most systems)
        if (process.platform === 'win32') {
            // Use PowerShell on Windows
            execSync(`powershell -Command "Compress-Archive -Path '${sourceDir}/*' -DestinationPath '${outputPath}' -Force"`, { stdio: 'inherit' });
        } else {
            // Use zip command on Unix-like systems
            execSync(`cd "${sourceDir}" && zip -r "../${path.basename(outputPath)}" . -x "*.DS_Store"`, { stdio: 'inherit' });
        }
    } catch (error) {
        log(`Warning: Could not create zip file ${outputPath}. Please install zip utility.`, colors.yellow);
        log(`You can manually zip the contents of ${sourceDir}`, colors.yellow);
    }
}

function cleanBuild() {
    log('🧹 Cleaning previous builds...', colors.blue);

    // Remove build directory
    try {
        if (fs.existsSync(BUILD_DIR)) {
            fs.rmSync(BUILD_DIR, { recursive: true, force: true });
        }
    } catch (error) {
        log(`Warning: Could not remove build directory: ${error.message}`, colors.yellow);
        log('Continuing with build...', colors.yellow);
    }

    // Remove zip files
    const zipFiles = [
        `${EXTENSION_NAME}.zip`,
        `${FIREFOX_EXTENSION_NAME}.zip`,
        `${STANDALONE_NAME}.zip`
    ];

    zipFiles.forEach(file => {
        if (fs.existsSync(file)) {
            fs.unlinkSync(file);
        }
    });
}

function createBuildDirs() {
    log('📁 Creating build directories...', colors.blue);
    ensureDir(path.join(BUILD_DIR, 'chrome'));
    ensureDir(path.join(BUILD_DIR, 'firefox'));
    ensureDir(path.join(BUILD_DIR, 'standalone'));
}

function buildChrome() {
    log('📦 Building Chrome extension...', colors.yellow);

    const chromeDir = path.join(BUILD_DIR, 'chrome');

    // Copy base manifest as-is for Chrome (MV3)
    copyFile(path.join(SRC_DIR, 'manifest.json'), path.join(chromeDir, 'manifest.json'));

    // Create HTML directory and copy files
    ensureDir(path.join(chromeDir, 'html'));
    copyFile(path.join(SRC_DIR, 'html', 'popup.html'), path.join(chromeDir, 'html', 'popup.html'));

    // Fix paths in popup.html for Chrome extension (paths stay relative)
    replaceInFile(path.join(chromeDir, 'html', 'popup.html'), [
        ['../lib/', '../lib/'],
        ['../css/', '../css/'],
        ['../js/', '../js/']
    ]);

    // Copy assets
    copyDir(path.join(SRC_DIR, 'lib'), path.join(chromeDir, 'lib'));
    copyDir(path.join(SRC_DIR, 'icons'), path.join(chromeDir, 'icons'));
    copyDir(path.join(SRC_DIR, '_locales'), path.join(chromeDir, '_locales'));

    // Copy CSS and JS
    ensureDir(path.join(chromeDir, 'css'));
    ensureDir(path.join(chromeDir, 'js'));
    copyFile(path.join(SRC_DIR, 'css', 'styles.css'), path.join(chromeDir, 'css', 'styles.css'));

    // Copy all JS files
    const jsFiles = fs.readdirSync(path.join(SRC_DIR, 'js'));
    jsFiles.forEach(file => {
        if (file.endsWith('.js')) {
            copyFile(path.join(SRC_DIR, 'js', file), path.join(chromeDir, 'js', file));
        }
    });

    // Copy documentation
    copyFile('README.md', path.join(chromeDir, 'README.md'));

    log('✅ Chrome extension built successfully', colors.green);
}

function buildFirefox() {
    log('🦊 Building Firefox extension...', colors.yellow);

    const firefoxDir = path.join(BUILD_DIR, 'firefox');

    // Derive Firefox manifest from base manifest.json
    const baseManifest = readJSON(path.join(SRC_DIR, 'manifest.json'));

    // Clone and transform for Firefox
    const ff = JSON.parse(JSON.stringify(baseManifest));

    // Background: replace MV3 service_worker with MV2 scripts for your current validator
    if (ff.background && ff.background.service_worker) {
        ff.background = { scripts: [ff.background.service_worker] };
    }

    // Ensure browser_specific_settings for Firefox
    ff.browser_specific_settings = ff.browser_specific_settings || {};
    ff.browser_specific_settings.gecko = Object.assign({}, ff.browser_specific_settings.gecko, {
        id: 'json-format-converter@jetsung.com',
        strict_min_version: '128.0'
    });

    // Write transformed manifest
    writeJSON(path.join(firefoxDir, 'manifest.json'), ff);

    // Create HTML directory and copy files
    ensureDir(path.join(firefoxDir, 'html'));
    copyFile(path.join(SRC_DIR, 'html', 'popup.html'), path.join(firefoxDir, 'html', 'popup.html'));

    // Fix paths in popup.html (paths stay relative for Firefox)
    replaceInFile(path.join(firefoxDir, 'html', 'popup.html'), [
        ['../lib/', '../lib/'],
        ['../css/', '../css/'],
        ['../js/', '../js/']
    ]);

    // Copy assets
    copyDir(path.join(SRC_DIR, 'lib'), path.join(firefoxDir, 'lib'));
    copyDir(path.join(SRC_DIR, 'icons'), path.join(firefoxDir, 'icons'));
    copyDir(path.join(SRC_DIR, '_locales'), path.join(firefoxDir, '_locales'));

    // Copy CSS and JS
    ensureDir(path.join(firefoxDir, 'css'));
    ensureDir(path.join(firefoxDir, 'js'));
    copyFile(path.join(SRC_DIR, 'css', 'styles.css'), path.join(firefoxDir, 'css', 'styles.css'));

    // Copy all JS files
    const jsFiles = fs.readdirSync(path.join(SRC_DIR, 'js'));
    jsFiles.forEach(file => {
        if (file.endsWith('.js')) {
            copyFile(path.join(SRC_DIR, 'js', file), path.join(firefoxDir, 'js', file));
        }
    });

    // Copy documentation
    copyFile('README.md', path.join(firefoxDir, 'README.md'));

    log('✅ Firefox extension built successfully', colors.green);
}

function buildStandalone() {
    log('🌐 Building standalone version...', colors.yellow);

    const standaloneDir = path.join(BUILD_DIR, 'standalone');

    // Copy and process HTML files
    copyFile(path.join(SRC_DIR, 'html', 'standalone.html'), path.join(standaloneDir, 'index.html'));
    copyFile(path.join(SRC_DIR, 'html', 'help.html'), path.join(standaloneDir, 'help.html'));

    // Fix paths in standalone files
    replaceInFile(path.join(standaloneDir, 'index.html'), [
        ['../lib/', 'lib/'],
        ['../css/', 'css/'],
        ['../js/', 'js/']
    ]);

    // Copy assets
    copyDir(path.join(SRC_DIR, 'lib'), path.join(standaloneDir, 'lib'));
    copyDir(path.join(SRC_DIR, 'icons'), path.join(standaloneDir, 'icons'));
    copyDir(path.join(SRC_DIR, '_locales'), path.join(standaloneDir, '_locales'));

    // Copy CSS and JS
    ensureDir(path.join(standaloneDir, 'css'));
    ensureDir(path.join(standaloneDir, 'js'));
    copyFile(path.join(SRC_DIR, 'css', 'styles.css'), path.join(standaloneDir, 'css', 'styles.css'));
    // Copy standalone-specific stylesheet
    copyFile(path.join(SRC_DIR, 'css', 'standalone.css'), path.join(standaloneDir, 'css', 'standalone.css'));

    // Copy all JS files
    const jsFiles = fs.readdirSync(path.join(SRC_DIR, 'js'));
    jsFiles.forEach(file => {
        if (file.endsWith('.js')) {
            copyFile(path.join(SRC_DIR, 'js', file), path.join(standaloneDir, 'js', file));
        }
    });

    // Copy documentation and package.json
    copyFile('README.md', path.join(standaloneDir, 'README.md'));
    copyFile('package.json', path.join(standaloneDir, 'package.json'));

    log('✅ Standalone version built successfully', colors.green);
}

function createPackages(target) {
    log('🗜️  Creating distribution packages...', colors.yellow);

    if (target === 'all' || target === 'chrome') {
        createZip(path.join(BUILD_DIR, 'chrome'), `${EXTENSION_NAME}.zip`);
    }

    if (target === 'all' || target === 'firefox') {
        createZip(path.join(BUILD_DIR, 'firefox'), `${FIREFOX_EXTENSION_NAME}.zip`);
    }

    if (target === 'all' || target === 'standalone') {
        createZip(path.join(BUILD_DIR, 'standalone'), `${STANDALONE_NAME}.zip`);
    }

    log('✅ Distribution packages created', colors.green);
}

function generateBuildInfo(target) {
    log('📋 Generating build information...', colors.blue);

    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const version = packageJson.version;

    let buildInfo = `JSON Format Converter - Build Information
=========================================

Build Date: ${new Date().toISOString()}
Build Version: ${version}
Target: ${target}
Platform: ${process.platform}
Node.js: ${process.version}

Files Generated:
`;

    if (target === 'all' || target === 'chrome') {
        buildInfo += `- ${EXTENSION_NAME}.zip (Chrome Extension)\n`;
    }
    if (target === 'all' || target === 'firefox') {
        buildInfo += `- ${FIREFOX_EXTENSION_NAME}.zip (Firefox Extension)\n`;
    }
    if (target === 'all' || target === 'standalone') {
        buildInfo += `- ${STANDALONE_NAME}.zip (Standalone Web App)\n`;
    }

    buildInfo += `
Directory Structure:
- dist/chrome/ (Chrome extension files)
- dist/firefox/ (Firefox extension files)
- dist/standalone/ (Standalone web app files)

Installation Instructions:
=========================

Chrome Extension:
1. Extract ${EXTENSION_NAME}.zip
2. Open chrome://extensions/
3. Enable Developer mode
4. Click 'Load unpacked' and select the extracted folder

Firefox Extension:
1. Extract ${FIREFOX_EXTENSION_NAME}.zip
2. Open about:debugging in Firefox
3. Click 'This Firefox'
4. Click 'Load Temporary Add-on' and select manifest.json from extracted folder

Standalone Web App:
1. Extract ${STANDALONE_NAME}.zip
2. Upload files to your web server
3. Access index.html in your browser
`;

    fs.writeFileSync(path.join(BUILD_DIR, 'build-info.txt'), buildInfo, 'utf8');
}

function showResults(target) {
    log('🎉 Build completed successfully!', colors.green);
    log('');
    log('📋 Generated files:', colors.blue);

    if (target === 'all' || target === 'chrome') {
        log(`   - ${EXTENSION_NAME}.zip (Chrome extension package)`);
    }
    if (target === 'all' || target === 'firefox') {
        log(`   - ${FIREFOX_EXTENSION_NAME}.zip (Firefox extension package)`);
    }
    if (target === 'all' || target === 'standalone') {
        log(`   - ${STANDALONE_NAME}.zip (Standalone web app)`);
    }

    log('   - dist/chrome/ (Chrome extension files)');
    log('   - dist/firefox/ (Firefox extension files)');
    log('   - dist/standalone/ (Standalone web app files)');
    log('   - dist/build-info.txt (Build information)');
    log('');

    log('📊 Package sizes:', colors.yellow);

    const zipFiles = [
        { name: 'Chrome Extension', file: `${EXTENSION_NAME}.zip`, condition: target === 'all' || target === 'chrome' },
        { name: 'Firefox Extension', file: `${FIREFOX_EXTENSION_NAME}.zip`, condition: target === 'all' || target === 'firefox' },
        { name: 'Standalone', file: `${STANDALONE_NAME}.zip`, condition: target === 'all' || target === 'standalone' }
    ];

    zipFiles.forEach(({ name, file, condition }) => {
        if (condition && fs.existsSync(file)) {
            const stats = fs.statSync(file);
            const sizeKB = (stats.size / 1024).toFixed(1);
            log(`   - ${name}: ${sizeKB} KB`);
        }
    });

    log('');
    log('🚀 Ready for deployment!', colors.green);
}

// Main build function
function build(target = 'all') {
    log('🚀 JSON Format Converter Build Script', colors.cyan);
    log('======================================', colors.cyan);
    log(`Target: ${target}`, colors.yellow);
    log(`Platform: ${process.platform}`, colors.yellow);
    log('');

    try {
        cleanBuild();
        createBuildDirs();

        if (target === 'all' || target === 'chrome') {
            buildChrome();
        }

        if (target === 'all' || target === 'firefox') {
            buildFirefox();
        }

        if (target === 'all' || target === 'standalone') {
            buildStandalone();
        }

        createPackages(target);
        generateBuildInfo(target);
        showResults(target);

    } catch (error) {
        log(`❌ Build failed: ${error.message}`, colors.red);
        process.exit(1);
    }
}

// CLI handling
if (require.main === module) {
    const target = process.argv[2] || 'all';
    const validTargets = ['all', 'chrome', 'firefox', 'standalone'];

    if (!validTargets.includes(target)) {
        log(`❌ Invalid target: ${target}`, colors.red);
        log(`Valid targets: ${validTargets.join(', ')}`, colors.yellow);
        process.exit(1);
    }

    build(target);
}

module.exports = { build };