#!/usr/bin/env node

/**
 * Extension Signing Script
 * Signs Chrome and Firefox extension packages
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');

// Configuration
const CHROME_EXTENSION_ZIP = 'json-format-converter-chrome.zip';
const FIREFOX_EXTENSION_ZIP = 'json-format-converter-firefox.zip';
const PRIVATE_KEY_PATH = process.env.EXTENSION_PRIVATE_KEY || 'private-key.pem';

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

function log(message, color = colors.reset) {
    console.log(`${color}${message}${colors.reset}`);
}

function createZip(sourceDir, outputPath) {
    try {
        if (process.platform === 'win32') {
            execSync(`powershell -Command "if (Test-Path '${outputPath}') { Remove-Item -Path '${outputPath}' -Force } ; Compress-Archive -Path '${sourceDir}/*' -DestinationPath '${outputPath}' -Force"`, { stdio: 'inherit' });
        } else {
            execSync(`cd "${sourceDir}" && zip -r "../${require('path').basename(outputPath)}" . -x "*.DS_Store"`, { stdio: 'inherit' });
        }
        return true;
    } catch (e) {
        log(`⚠️  Failed to create zip ${outputPath}: ${e.message}`, colors.yellow);
        return false;
    }
}

function generatePrivateKey() {
    log('🔑 Generating RSA private key...', colors.blue);
    
    try {
        execSync(`openssl genrsa -out ${PRIVATE_KEY_PATH} 2048`, { stdio: 'inherit' });
        log('✅ Private key generated successfully', colors.green);
        return true;
    } catch (error) {
        // Fallback: use Node.js crypto if openssl is unavailable
        log(`⚠️  OpenSSL not available or failed (${error.message}). Falling back to Node.js crypto...`, colors.yellow);
        try {
            const { generateKeyPairSync } = require('crypto');
            const { privateKey } = generateKeyPairSync('rsa', {
                modulusLength: 2048,
                publicExponent: 0x10001,
                publicKeyEncoding: { type: 'spki', format: 'pem' },
                // Use PKCS#1 to match "openssl genrsa" output style
                privateKeyEncoding: { type: 'pkcs1', format: 'pem' }
            });
            fs.writeFileSync(PRIVATE_KEY_PATH, privateKey, 'utf8');
            log('✅ Private key generated successfully via Node.js crypto', colors.green);
            return true;
        } catch (fallbackError) {
            log(`❌ Failed to generate private key via Node.js crypto: ${fallbackError.message}`, colors.red);
            return false;
        }
    }
}

function signChromeExtension() {
    log('🌐 Signing Chrome extension...', colors.yellow);
    
    if (!fs.existsSync(CHROME_EXTENSION_ZIP)) {
        log(`❌ Chrome extension ZIP not found: ${CHROME_EXTENSION_ZIP}`, colors.red);
        return false;
    }
    
    if (!fs.existsSync(PRIVATE_KEY_PATH)) {
        log(`❌ Private key not found: ${PRIVATE_KEY_PATH}`, colors.red);
        log('💡 Run with --generate-key to create a new private key', colors.yellow);
        return false;
    }
    
    try {
        // Resolve crx3 command (prefer global, else fallback to npx)
        let crxCmd = 'crx3';
        try {
            execSync('crx3 --version', { stdio: 'ignore' });
        } catch {
            crxCmd = 'npx crx3';
            log('ℹ️  Using npx to run crx3 (no global install required)', colors.yellow);
        }
        
        // Extract ZIP to temporary directory
        const tempDir = 'temp-chrome-extension';
        if (fs.existsSync(tempDir)) {
            fs.rmSync(tempDir, { recursive: true, force: true });
        }
        
        // Extract ZIP
        if (process.platform === 'win32') {
            execSync(`powershell -Command "Expand-Archive -Path '${CHROME_EXTENSION_ZIP}' -DestinationPath '${tempDir}' -Force"`, { stdio: 'inherit' });
        } else {
            execSync(`unzip -q "${CHROME_EXTENSION_ZIP}" -d "${tempDir}"`, { stdio: 'inherit' });
        }
        
        // Get version from package.json
        const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        const version = packageJson.version;
        
        // Create CRX file
        const crxFileName = `json-format-converter-chrome-v${version}.crx`;
        execSync(`${crxCmd} -p "${PRIVATE_KEY_PATH}" -o "${crxFileName}" "${tempDir}"`, { stdio: 'inherit' });
        
        // Clean up
        fs.rmSync(tempDir, { recursive: true, force: true });
        
        log(`✅ Chrome extension signed: ${crxFileName}`, colors.green);
        // Remove original unsigned ZIP after successful signing
        try {
            if (fs.existsSync(CHROME_EXTENSION_ZIP)) {
                fs.unlinkSync(CHROME_EXTENSION_ZIP);
                log(`🗑️  Removed unsigned package: ${CHROME_EXTENSION_ZIP}`, colors.yellow);
            }
        } catch (e) {
            log(`⚠️  Failed to remove ${CHROME_EXTENSION_ZIP}: ${e.message}`, colors.yellow);
        }

        // Also create a Chrome Web Store ZIP from unpacked extension directory
        try {
            const storeZipName = `json-format-converter-chrome-store-v${version}.zip`;
            const chromeDir = require('path').join('dist', 'chrome');
            if (fs.existsSync(chromeDir)) {
                if (createZip(chromeDir, storeZipName)) {
                    log(`📦 Chrome Web Store package created: ${storeZipName}`, colors.green);
                }
            } else {
                log(`⚠️  Chrome directory not found for store packaging: ${chromeDir}`, colors.yellow);
            }
        } catch (e) {
            log(`⚠️  Failed to create Chrome Store ZIP: ${e.message}`, colors.yellow);
        }
        return true;
        
    } catch (error) {
        log(`❌ Failed to sign Chrome extension: ${error.message}`, colors.red);
        return false;
    }
}

function signFirefoxExtension() {
    log('🦊 Signing Firefox extension...', colors.yellow);
    
    if (!fs.existsSync(FIREFOX_EXTENSION_ZIP)) {
        log(`❌ Firefox extension ZIP not found: ${FIREFOX_EXTENSION_ZIP}`, colors.red);
        return false;
    }
    
    // Firefox extensions need to be signed by Mozilla
    // For development, we can create a self-signed version
    log('📝 Firefox extensions require Mozilla signing for distribution', colors.yellow);
    log('💡 For development testing:', colors.blue);
    log('   1. Open about:debugging in Firefox', colors.blue);
    log('   2. Click "This Firefox"', colors.blue);
    log('   3. Click "Load Temporary Add-on"', colors.blue);
    log(`   4. Select the ${FIREFOX_EXTENSION_ZIP} file`, colors.blue);
    
    // Create a development-signed version with checksum
    try {
        const zipContent = fs.readFileSync(FIREFOX_EXTENSION_ZIP);
        const hash = crypto.createHash('sha256').update(zipContent).digest('hex');
        
        const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        const version = packageJson.version;
        
        const signedFileName = `json-format-converter-firefox-v${version}-dev.zip`;
        fs.copyFileSync(FIREFOX_EXTENSION_ZIP, signedFileName);
        
        // Create checksum file
        const checksumFileName = `${signedFileName}.sha256`;
        fs.writeFileSync(checksumFileName, `${hash}  ${signedFileName}\n`);
        
        log(`✅ Firefox extension prepared: ${signedFileName}`, colors.green);
        log(`✅ Checksum created: ${checksumFileName}`, colors.green);
        log(`📋 SHA256: ${hash}`, colors.blue);
        // Remove original unsigned ZIP after preparing dev-signed package
        try {
            if (fs.existsSync(FIREFOX_EXTENSION_ZIP)) {
                fs.unlinkSync(FIREFOX_EXTENSION_ZIP);
                log(`🗑️  Removed unsigned package: ${FIREFOX_EXTENSION_ZIP}`, colors.yellow);
            }
        } catch (e) {
            log(`⚠️  Failed to remove ${FIREFOX_EXTENSION_ZIP}: ${e.message}`, colors.yellow);
        }
        
        return true;
        
    } catch (error) {
        log(`❌ Failed to prepare Firefox extension: ${error.message}`, colors.red);
        return false;
    }
}

function createSignatureInfo() {
    log('📋 Creating signature information...', colors.blue);
    
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const version = packageJson.version;
    const timestamp = new Date().toISOString();
    
    let signatureInfo = `JSON Format Converter - Signature Information
=========================================================

Version: ${version}
Signed: ${timestamp}
Platform: ${process.platform}
Node.js: ${process.version}

Files:
`;

    // Check for signed files
    const chromeFile = `json-format-converter-chrome-v${version}.crx`;
    const firefoxFile = `json-format-converter-firefox-v${version}-dev.zip`;
    const firefoxChecksum = `${firefoxFile}.sha256`;
    
    if (fs.existsSync(chromeFile)) {
        const stats = fs.statSync(chromeFile);
        signatureInfo += `- ${chromeFile} (${(stats.size / 1024).toFixed(1)} KB)\n`;
    }
    
    if (fs.existsSync(firefoxFile)) {
        const stats = fs.statSync(firefoxFile);
        signatureInfo += `- ${firefoxFile} (${(stats.size / 1024).toFixed(1)} KB)\n`;
    }
    
    if (fs.existsSync(firefoxChecksum)) {
        const checksum = fs.readFileSync(firefoxChecksum, 'utf8').trim();
        signatureInfo += `- ${firefoxChecksum}\n`;
        signatureInfo += `  ${checksum}\n`;
    }
    
    signatureInfo += `
Installation Instructions:
=========================

Chrome Extension (CRX):
1. Open chrome://extensions/
2. Enable Developer mode
3. Drag and drop the .crx file to install

Firefox Extension (Development):
1. Open about:debugging in Firefox
2. Click "This Firefox"
3. Click "Load Temporary Add-on"
4. Select the .zip file

Security Notes:
==============
- Chrome CRX files are signed with a private key
- Firefox extensions for production must be signed by Mozilla
- Development versions are for testing only
- Verify checksums before installation

Private Key Security:
- Keep your private key secure and never share it
- Use environment variable EXTENSION_PRIVATE_KEY to specify key path
- Generate new keys for different projects
`;

    fs.writeFileSync('SIGNATURE_INFO.txt', signatureInfo);
    log('✅ Signature information created: SIGNATURE_INFO.txt', colors.green);
}

// Main signing function
function sign(options = {}) {
    log('🔐 Extension Signing Tool', colors.cyan);
    log('========================', colors.cyan);
    
    let success = true;
    
    // Generate private key if requested
    if (options.generateKey) {
        if (!generatePrivateKey()) {
            success = false;
        }
    }
    
    // Sign Chrome extension
    if (options.chrome !== false) {
        if (!signChromeExtension()) {
            success = false;
        }
    }
    
    // Sign Firefox extension
    if (options.firefox !== false) {
        if (!signFirefoxExtension()) {
            success = false;
        }
    }
    
    // Create signature info
    createSignatureInfo();
    
    if (success) {
        log('🎉 Signing completed successfully!', colors.green);
    } else {
        log('⚠️  Signing completed with some errors', colors.yellow);
    }
    
    return success;
}

// CLI handling
if (require.main === module) {
    const args = process.argv.slice(2);
    const options = {
        generateKey: args.includes('--generate-key'),
        chrome: !args.includes('--no-chrome'),
        firefox: !args.includes('--no-firefox')
    };
    
    if (args.includes('--help') || args.includes('-h')) {
        console.log(`
Extension Signing Tool

Usage: node scripts/sign.js [options]

Options:
  --generate-key    Generate a new private key
  --no-chrome      Skip Chrome extension signing
  --no-firefox     Skip Firefox extension preparation
  --help, -h       Show this help message

Environment Variables:
  EXTENSION_PRIVATE_KEY    Path to private key file (default: private-key.pem)

Examples:
  node scripts/sign.js                    # Sign both extensions
  node scripts/sign.js --generate-key     # Generate key and sign
  node scripts/sign.js --no-firefox       # Sign Chrome only
`);
        process.exit(0);
    }
    
    const success = sign(options);
    process.exit(success ? 0 : 1);
}

module.exports = { sign };