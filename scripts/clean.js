#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  blue: '\x1b[34m',
  green: '\x1b[32m',
  yellow: '\x1b[33m'
};

function log(msg, color = colors.reset) {
  console.log(`${color}${msg}${colors.reset}`);
}

function safeRm(targetPath) {
  try {
    if (!fs.existsSync(targetPath)) return;
    const stat = fs.statSync(targetPath);
    if (stat.isDirectory()) {
      fs.rmSync(targetPath, { recursive: true, force: true });
    } else {
      fs.unlinkSync(targetPath);
    }
    log(`🗑️  Removed: ${targetPath}`, colors.yellow);
  } catch (e) {
    log(`⚠️  Failed to remove ${targetPath}: ${e.message}`, colors.yellow);
  }
}

function globDelete(cwd, patterns) {
  const entries = fs.readdirSync(cwd);
  for (const name of entries) {
    const full = path.join(cwd, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      // recurse
      globDelete(full, patterns);
    }
  }
  // Top-level only patterns like *.zip etc apply in cwd
  for (const pat of patterns) {
    if (!pat.startsWith('*.')) continue;
    const suffix = pat.slice(1); // e.g. '.zip'
    for (const name of fs.readdirSync(cwd)) {
      if (name.endsWith(suffix)) safeRm(path.join(cwd, name));
    }
  }
}

(function main() {
  log('🧹 Cleaning build artifacts...', colors.blue);
  // Remove dist directory
  safeRm('dist');
  // Remove archives and signing outputs at project root
  const rootPatterns = ['*.zip', '*.crx', '*.xpi', '*.sha256'];
  globDelete(process.cwd(), rootPatterns);
  // Known extra files
  safeRm('SIGNATURE_INFO.txt');
  log('✅ Clean completed', colors.green);
})();
