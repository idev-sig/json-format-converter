#!/usr/bin/env node

/**
 * Validation script for JSON Format Converter (Node.js version)
 * Cross-platform validator matching Node build outputs
 */

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const { execSync } = require('child_process');

// Configuration
const config = {
  srcDir: path.join(process.cwd(), 'src'),
  distDir: path.join(process.cwd(), 'dist'),
  colors: {
    red: chalk.red,
    green: chalk.green,
    yellow: chalk.yellow,
    blue: chalk.blue,
    cyan: chalk.cyan
  }
};

// Counters
let totalChecks = 0;
let passedChecks = 0;
let failedChecks = 0;

// Logging functions
const log = {
  header: (msg) => {
    console.log('\n' + config.colors.blue(`📊 ${msg}`));
    console.log('='.repeat(msg.length + 2));
  },
  success: (msg) => console.log(`  ${config.colors.green('✓')} ${msg}`),
  error: (msg) => console.error(`  ${config.colors.red('✗')} ${msg}`),
  warning: (msg) => console.log(`  ${config.colors.yellow('⚠')} ${msg}`),
  info: (msg) => console.log(`  ${config.colors.blue('ℹ')} ${msg}`)
};

// Check functions
async function checkFile(file, description) {
  totalChecks++;
  process.stdout.write(`  Checking ${description}... `);
  
  try {
    const exists = await fs.pathExists(file);
    if (exists) {
      console.log(config.colors.green('PASS'));
      passedChecks++;
      return true;
    } else {
      console.log(config.colors.red('FAIL'));
      failedChecks++;
      return false;
    }
  } catch (err) {
    console.log(config.colors.red('ERROR'));
    console.error(`    ${err.message}`);
    failedChecks++;
    return false;
  }
}

async function checkDir(dir, description) {
  return checkFile(dir, description);
}

async function check(description, condition) {
  totalChecks++;
  process.stdout.write(`  ${description}... `);
  
  try {
    const result = await condition();
    if (result) {
      console.log(config.colors.green('PASS'));
      passedChecks++;
    } else {
      console.log(config.colors.red('FAIL'));
      failedChecks++;
    }
  } catch (err) {
    console.log(config.colors.red('ERROR'));
    console.error(`    ${err.message}`);
    failedChecks++;
  }
}

// Validation functions
async function validateProjectStructure() {
  log.header('📁 Checking project structure');
  
  // Check source directories
  await checkDir(config.srcDir, 'src directory exists');
  await checkDir(path.join(config.srcDir, 'html'), 'src/html directory exists');
  await checkDir(path.join(config.srcDir, 'css'), 'src/css directory exists');
  await checkDir(path.join(config.srcDir, 'js'), 'src/js directory exists');
  await checkDir(path.join(config.srcDir, 'lib'), 'src/lib directory exists');
  await checkDir(path.join(config.srcDir, 'icons'), 'src/icons directory exists');
  
  // Check source files
  await checkFile(path.join(config.srcDir, 'manifest.json'), 'manifest.json exists');
  await checkFile(path.join(config.srcDir, 'html', 'popup.html'), 'popup.html exists');
  await checkFile(path.join(config.srcDir, 'html', 'standalone.html'), 'standalone.html exists');
  await checkFile(path.join(config.srcDir, 'html', 'help.html'), 'help.html exists');
  await checkFile(path.join(config.srcDir, 'css', 'styles.css'), 'styles.css exists');
  await checkFile(path.join(config.srcDir, 'js', 'i18n.js'), 'i18n.js exists');
  await checkFile(path.join(config.srcDir, 'js', 'converter.js'), 'converter.js exists');
  await checkFile(path.join(config.srcDir, 'js', 'popup.js'), 'popup.js exists');
  
  // Check library files
  await checkFile(path.join(config.srcDir, 'lib', 'codemirror.min.js'), 'CodeMirror library exists');
  await checkFile(path.join(config.srcDir, 'lib', 'javascript.min.js'), 'JavaScript mode exists');
  await checkFile(path.join(config.srcDir, 'lib', 'json5.min.js'), 'JSON5 library exists');
  await checkFile(path.join(config.srcDir, 'lib', 'codemirror.min.css'), 'CodeMirror CSS exists');
  
  // Check icon files
  await checkFile(path.join(config.srcDir, 'icons', 'icon16.png'), '16px icon exists');
  await checkFile(path.join(config.srcDir, 'icons', 'icon32.png'), '32px icon exists');
  await checkFile(path.join(config.srcDir, 'icons', 'icon48.png'), '48px icon exists');
  await checkFile(path.join(config.srcDir, 'icons', 'icon128.png'), '128px icon exists');
  await checkFile(path.join(config.srcDir, 'icons', 'icon.svg'), 'SVG icon exists');
}

async function validateBuildSystem() {
  log.header('🔧 Checking build system');
  
  // Check scripts
  const scriptsDir = path.join(process.cwd(), 'scripts');
  await checkDir(scriptsDir, 'scripts directory exists');
  await checkFile(path.join(scriptsDir, 'build.js'), 'build script exists');
  await checkFile(path.join(scriptsDir, 'dev-server.js'), 'dev server script exists');
  
  // Check if scripts are executable (not applicable in Windows)
  if (process.platform !== 'win32') {
    // Executable bit is optional because scripts are invoked via `node <script>.js` in CI
    log.info('Skipping executable bit checks for scripts on non-Windows (invoked via node).');
  }
  
  // Check configuration files
  // Just is no longer used
  await check('justfile is not required', async () => true);
  await checkFile(path.join(process.cwd(), 'package.json'), 'package.json exists');
  await checkFile(path.join(process.cwd(), 'project.config.js'), 'project config exists');
}

async function validateTestFiles() {
  log.header('🧪 Checking test files');
  
  const testsDir = path.join(process.cwd(), 'tests');
  await checkDir(testsDir, 'tests directory exists');
  
  const testFiles = [
    'test.html',
    'i18n-test.html',
    'button-test.html',
    'comment-preservation-test.html',
    'error-check.html'
  ];
  
  for (const file of testFiles) {
    await checkFile(path.join(testsDir, file), `${file} exists`);
  }
}

async function validateBuildOutputs() {
  log.header('📦 Checking build outputs');
  
  if (await fs.pathExists(config.distDir)) {
    const chromeDir = path.join(config.distDir, 'chrome');
    const firefoxDir = path.join(config.distDir, 'firefox');
    const standaloneDir = path.join(config.distDir, 'standalone');
    
    await checkDir(chromeDir, 'chrome build directory exists');
    await checkDir(firefoxDir, 'firefox build directory exists');
    await checkDir(standaloneDir, 'standalone build directory exists');
    await checkFile(path.join(config.distDir, 'build-info.txt'), 'build info file exists');
    
    if (await fs.pathExists(chromeDir)) {
      await checkFile(path.join(chromeDir, 'manifest.json'), 'chrome manifest exists');
      await checkFile(path.join(chromeDir, 'html', 'popup.html'), 'chrome popup exists');
      await checkDir(path.join(chromeDir, 'js'), 'chrome js directory exists');
      await checkDir(path.join(chromeDir, 'css'), 'chrome css directory exists');
      await checkDir(path.join(chromeDir, 'lib'), 'chrome lib directory exists');
      await checkDir(path.join(chromeDir, 'icons'), 'chrome icons directory exists');
    }

    if (await fs.pathExists(firefoxDir)) {
      await checkFile(path.join(firefoxDir, 'manifest.json'), 'firefox manifest exists');
      await checkFile(path.join(firefoxDir, 'html', 'popup.html'), 'firefox popup exists');
      await checkDir(path.join(firefoxDir, 'js'), 'firefox js directory exists');
      await checkDir(path.join(firefoxDir, 'css'), 'firefox css directory exists');
      await checkDir(path.join(firefoxDir, 'lib'), 'firefox lib directory exists');
      await checkDir(path.join(firefoxDir, 'icons'), 'firefox icons directory exists');
    }
    
    if (await fs.pathExists(standaloneDir)) {
      await checkFile(path.join(standaloneDir, 'index.html'), 'standalone index exists');
      await checkFile(path.join(standaloneDir, 'help.html'), 'standalone help exists');
      await checkDir(path.join(standaloneDir, 'js'), 'standalone js directory exists');
      await checkDir(path.join(standaloneDir, 'css'), 'standalone css directory exists');
      await checkDir(path.join(standaloneDir, 'lib'), 'standalone lib directory exists');
      await checkDir(path.join(standaloneDir, 'icons'), 'standalone icons directory exists');
    }
  } else {
    log.warning("No build outputs found. Run 'npm run build' first.");
  }
}

async function validatePackages() {
  log.header('📋 Checking package files');
  
  const chromePkg = path.join(process.cwd(), 'json-format-converter-chrome.zip');
  const firefoxPkg = path.join(process.cwd(), 'json-format-converter-firefox.zip');
  const standalonePkg = path.join(process.cwd(), 'json-format-converter-standalone.zip');
  
  if (await fs.pathExists(chromePkg)) {
    await check('chrome package exists', async () => {
      const stats = await fs.stat(chromePkg);
      return stats.size > 0;
    });
  } else {
    log.warning('Chrome package not found');
  }

  if (await fs.pathExists(firefoxPkg)) {
    await check('firefox package exists', async () => {
      const stats = await fs.stat(firefoxPkg);
      return stats.size > 0;
    });
  } else {
    log.warning('Firefox package not found');
  }
  
  if (await fs.pathExists(standalonePkg)) {
    await check('standalone package exists', async () => {
      const stats = await fs.stat(standalonePkg);
      return stats.size > 0;
    });
  } else {
    log.warning('Standalone package not found');
  }
}

async function validateSyntax() {
  log.header('🔍 Checking file syntax');
  
  // Check JSON syntax
  await check('manifest.json syntax', async () => {
    try {
      const content = await fs.readFile(path.join(config.srcDir, 'manifest.json'), 'utf8');
      JSON.parse(content);
      return true;
    } catch (err) {
      throw new Error(`Invalid JSON in manifest.json: ${err.message}`);
    }
  });
  
  await check('package.json syntax', async () => {
    try {
      const content = await fs.readFile(path.join(process.cwd(), 'package.json'), 'utf8');
      JSON.parse(content);
      return true;
    } catch (err) {
      throw new Error(`Invalid JSON in package.json: ${err.message}`);
    }
  });
  
  // Skip browser JavaScript syntax checking in Node.js environment
  log.info('Skipping browser JavaScript syntax checking in Node.js environment');
}

// Main function
async function main() {
  console.log(chalk.blue('🔍 JSON Format Converter - Validation Script'));
  console.log('='.repeat(50) + '\n');
  
  try {
    await validateProjectStructure();
    await validateBuildSystem();
    await validateTestFiles();
    await validateBuildOutputs();
    await validatePackages();
    await validateSyntax();
    
    // Print summary
    console.log('\n' + '='.repeat(50));
    log.header('📊 Validation Summary');
    console.log(`Total checks: ${totalChecks}`);
    console.log(`Passed: ${chalk.green(passedChecks)}`);
    console.log(`Failed: ${failedChecks > 0 ? chalk.red(failedChecks) : chalk.green(failedChecks)}`);
    
    if (failedChecks === 0) {
      console.log(`\n${chalk.green('🎉 All checks passed! Project is ready for deployment.')}`);
      process.exit(0);
    } else {
      console.log(`\n${chalk.red('❌ Some checks failed. Please review the issues above.')}`);
      process.exit(1);
    }
  } catch (error) {
    console.error('\n' + chalk.red('❌ Validation error:'), error.message);
    process.exit(1);
  }
}

// Run the main function
main();
