#!/usr/bin/env node

/**
 * Development Server for JSON Format Converter (Node.js version)
 * Cross-platform alternative to dev-server.sh
 */

const fs = require('fs-extra');
const path = require('path');
const http = require('http');
const handler = require('serve-handler');
const chalk = require('chalk');
const readline = require('readline');
const { execSync } = require('child_process');

// Configuration
const config = {
  port: process.argv[2] || 3000,
  srcDir: path.join(__dirname, '..', 'src'),
  devDir: path.join(process.cwd(), 'dev-server'),
  colors: {
    green: text => chalk.green(text),
    yellow: text => chalk.yellow(text),
    blue: text => chalk.blue(text),
    red: text => chalk.red(text),
    cyan: text => chalk.cyan(text)
  }
};

// Logging functions
const log = {
  info: (msg) => console.log(`${config.colors.blue('ℹ')} ${msg}`),
  success: (msg) => console.log(`${config.colors.green('✓')} ${msg}`),
  warning: (msg) => console.log(`${config.colors.yellow('⚠')} ${msg}`),
  error: (msg) => console.error(`${config.colors.red('✗')} ${msg}`),
  header: (msg) => {
    console.log('');
    console.log(config.colors.blue(msg));
    console.log('='.repeat(msg.length));
  }
};

// Clean up function
async function cleanup() {
  log.info('Cleaning up development environment...');
  try {
    await fs.remove(config.devDir);
    log.success('Cleanup completed');
  } catch (err) {
    log.error(`Failed to clean up: ${err.message}`);
  }
  process.exit(0);
}

// Setup cleanup handlers
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

// Main function
async function main() {
  log.header('🚀 Starting JSON Format Converter Development Server');
  
  try {
    // Log Node.js version and platform
    console.log(`Node.js ${process.version} on ${process.platform} ${process.arch}`);
    console.log(`Current working directory: ${process.cwd()}`);
    // Check if source directory exists
    if (!await fs.pathExists(config.srcDir)) {
      throw new Error(`Source directory '${config.srcDir}' not found!`);
    }

    // Clean and create dev directory
    log.info('Setting up development environment...');
    await fs.remove(config.devDir);
    await fs.mkdirp(config.devDir);

    // Copy and process files
    log.info('Copying source files...');
    
    // Create necessary directories
    await fs.ensureDir(path.join(config.devDir, 'lib'));
    await fs.ensureDir(path.join(config.devDir, '_locales'));
    
    // Define all copy operations
    const copyTasks = [
      // Copy HTML files from html directory
      fs.copy(path.join(config.srcDir, 'html'), config.devDir, {
        filter: src => !src.includes('node_modules')
      }),
      // Copy other assets
      fs.copy(path.join(config.srcDir, 'css'), path.join(config.devDir, 'css')),
      fs.copy(path.join(config.srcDir, 'icons'), path.join(config.devDir, 'icons')),
      fs.copy(path.join(config.srcDir, 'js'), path.join(config.devDir, 'js')),
      fs.copy(path.join(config.srcDir, 'lib'), path.join(config.devDir, 'lib')),
      fs.copy(path.join(config.srcDir, '_locales'), path.join(config.devDir, '_locales'))
    ];
    
    // Execute all copy operations in parallel
    await Promise.all(copyTasks);
    
    // Fix paths in HTML files after they've been copied
    const htmlFiles = await fs.readdir(config.devDir);
    for (const file of htmlFiles) {
      if (file.endsWith('.html')) {
        try {
          const filePath = path.join(config.devDir, file);
          let content = await fs.readFile(filePath, 'utf8');
          content = content
            .replace(/\.\.\/lib\//g, 'lib/')
            .replace(/\.\.\/css\//g, 'css/')
            .replace(/\.\.\/js\//g, 'js/');
          await fs.writeFile(filePath, content, 'utf8');
        } catch (error) {
          log.warning(`Failed to process ${file}: ${error.message}`);
        }
      }
    }
    
    log.success('Development environment setup completed');

    // Copy test files if they exist
    const testsDir = path.join(process.cwd(), 'tests');
    if (await fs.pathExists(testsDir)) {
      const testFiles = await fs.readdir(testsDir);
      for (const file of testFiles) {
        if (file.endsWith('.html')) {
          await fs.copy(
            path.join(testsDir, file),
            path.join(config.devDir, file)
          );
        }
      }
    }

    log.success('Development environment ready\n');
    
    // Display available URLs
    log.header('🌐 Available URLs:');
    console.log(`   - Main App: ${config.colors.cyan(`http://localhost:${config.port}/standalone.html`)}`);
    console.log(`   - Extension Popup: ${config.colors.cyan(`http://localhost:${config.port}/popup.html`)}`);
    console.log(`   - Help Page: ${config.colors.cyan(`http://localhost:${config.port}/help.html`)}`);

    // Check for test files
    const testFiles = await fs.readdir(config.devDir);
    const testUrls = {
      'test.html': 'Function Tests',
      'i18n-test.html': 'I18n Tests',
      'button-test.html': 'Button Tests',
      'comment-preservation-test.html': 'Comment Tests',
      'error-check.html': 'Error Check'
    };

    for (const [file, description] of Object.entries(testUrls)) {
      if (testFiles.includes(file)) {
        console.log(`   - ${description}: ${config.colors.cyan(`http://localhost:${config.port}/${file}`)}`);
      }
    }

    // Display development tips
    log.header('🔧 Development Tips:');
    console.log('   - Edit files in the \'src/\' directory');
    console.log('   - Restart the server to see changes');
    console.log(`   - Press ${config.colors.yellow('Ctrl+C')} to stop the server\n`);

    // Create HTTP server
    log.info(`Creating HTTP server on port ${config.port}...`);
    
    try {
      const server = http.createServer((request, response) => {
        log.info(`[${new Date().toISOString()}] ${request.method} ${request.url}`);
        
        // Special handling for _locales directory
        if (request.url.startsWith('/_locales/')) {
          const filePath = path.join(config.srcDir, request.url);
          return fs.readFile(filePath, 'utf8')
            .then(data => {
              response.setHeader('Content-Type', 'application/json');
              response.end(data);
            })
            .catch(() => {
              response.statusCode = 404;
              response.end('Not found');
            });
        }
        
        // Default handler for other files
        return handler(request, response, {
          public: config.devDir,
          cleanUrls: false
        });
      });

      // Start the server
      server.listen(config.port, '0.0.0.0', () => {
        log.success(`Server is running at http://localhost:${config.port}`);
        log.success(`Serving files from: ${config.devDir}`);
      });

      // Handle server errors
      server.on('error', (error) => {
        log.error(`Server error: ${error.code || error.message}`);
        if (error.code === 'EADDRINUSE') {
          log.error(`Port ${config.port} is already in use. Please try a different port.`);
          log.info('You can specify a different port by running: node scripts/dev-server.js [port]');
        } else if (error.code === 'EACCES') {
          log.error(`Permission denied: Port ${config.port} requires elevated privileges`);
          log.info('Try running with administrator privileges or use a port number above 1024');
        } else {
          log.error(`Server error: ${error.stack || error}`);
        }
        process.exit(1);
      });

      // Handle process termination
      process.on('SIGINT', () => {
        log.info('\nShutting down server...');
        server.close(() => {
          log.success('Server stopped');
          process.exit(0);
        });
      });

      // Start listening
      log.info(`Starting server on port ${config.port}...`);
      server.listen(config.port, 'localhost', () => {
        const address = server.address();
        const actualPort = typeof address === 'string' ? config.port : address.port;
        
        log.success(`Server running at http://localhost:${actualPort}`);
        log.info(`Serving files from: ${config.devDir}`);
        log.info(`Press ${chalk.yellow('Ctrl+C')} to stop the server\n`);
        
        // Log available URLs
        log.header('🌐 Available URLs:');
        console.log(`   - Main App: ${chalk.cyan(`http://localhost:${actualPort}/standalone.html`)}`);
        console.log(`   - Extension Popup: ${chalk.cyan(`http://localhost:${actualPort}/popup.html`)}`);
        console.log(`   - Help Page: ${chalk.cyan(`http://localhost:${actualPort}/help.html`)}`);
      });
      
    } catch (error) {
      log.error(`Failed to create server: ${error.message}`);
      throw error;
    }

  } catch (error) {
    log.error(error.message);
    process.exit(1);
  }
}

// Run the main function
main().catch(error => {
  console.error('Unhandled error in main:', error);
  process.exit(1);
});
