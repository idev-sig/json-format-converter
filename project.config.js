/**
 * JSON Format Converter - Project Configuration
 * This file contains build and development configuration
 */

module.exports = {
  // Project metadata
  name: 'JSON Format Converter',
  version: '0.1.0',
  description: 'Convert between JSON, JSONC, and JSON5 formats',
  author: 'Jetsung Chan <i@jetsung.com>',
  repository: 'https://github.com/idev-sig/json-format-converter',
  
  // Directory structure
  directories: {
    src: 'src',
    build: 'dist',
    scripts: 'scripts',
    temp: 'dev-server'
  },
  
  // Source file structure
  src: {
    html: 'src/html',
    css: 'src/css',
    js: 'src/js',
    lib: 'src/lib',
    icons: 'src/icons',
    manifest: 'src/manifest.json'
  },
  
  // Build configuration
  build: {
    extension: {
      name: 'json-format-converter-extension',
      output: 'dist/extension',
      files: [
        'manifest.json',
        'popup.html',
        'css/',
        'js/',
        'lib/',
        'icons/'
      ]
    },
    standalone: {
      name: 'json-format-converter-standalone',
      output: 'dist/standalone',
      files: [
        'index.html', // renamed from standalone.html
        'help.html',
        'css/',
        'js/',
        'lib/',
        'icons/'
      ]
    }
  },
  
  // Development server configuration
  devServer: {
    port: 8080,
    host: 'localhost',
    openBrowser: false,
    watchFiles: true
  },
  
  // Supported languages
  i18n: {
    defaultLanguage: 'en',
    supportedLanguages: ['en', 'zh'],
    fallbackLanguage: 'en'
  },
  
  // Feature flags
  features: {
    syntaxHighlighting: true,
    lineNumbers: true,
    multiLanguage: true,
    compression: true,
    escaping: true,
    sorting: true,
    dataTypeConversion: true,
    keyboardShortcuts: true,
    buttonStateManagement: true
  },
  
  // External dependencies
  dependencies: {
    codemirror: '5.65.16',
    json5: '2.2.3'
  },
  
  // Browser compatibility
  browserSupport: {
    chrome: '88+',
    firefox: '55+',
    safari: '12+',
    edge: '79+'
  },
  
  // Build optimization
  optimization: {
    minifyHTML: false, // Keep readable for development
    minifyCSS: false,
    minifyJS: false,
    compressImages: true,
    generateSourceMaps: false
  }
};
