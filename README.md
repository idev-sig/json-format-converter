# JSON Format Converter

[![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)](https://github.com/idev-sig/json-format-converter)
[![License](https://img.shields.io/badge/license-Apache_2.0-green.svg)](LICENSE)
[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-orange.svg)](https://chromewebstore.google.com/detail/hmjkpcfhmideofmhbcejbpilnonoladc)

**[English](README.md) | [中文](README_zh.md)**

A powerful Chrome extension and standalone web application for converting between JSON, JSONC (JSON with Comments), and JSON5 formats with advanced editing features and comment preservation.

## 🚀 Quick Start

### Chrome Extension
[![Chrome Web Store](https://img.shields.io/badge/Chrome%20Web%20Store-Install-blue?logo=google-chrome)](https://chromewebstore.google.com/detail/hmjkpcfhmideofmhbcejbpilnonoladc)

**Install from Chrome Web Store**: [JSON Format Converter](https://chromewebstore.google.com/detail/hmjkpcfhmideofmhbcejbpilnonoladc)

1. Click the link above or visit the Chrome Web Store
2. Click "Add to Chrome"
3. Click the extension icon in your toolbar to start converting

### Online Web App
[![Live Demo](https://img.shields.io/badge/Live%20Demo-Try%20Now-green?logo=github)](https://idev-sig.github.io/json-format-converter/)

**Try Online**: [https://idev-sig.github.io/json-format-converter/](https://idev-sig.github.io/json-format-converter/)

No installation required - use directly in your browser!

## Features

### 🎨 **Advanced Editor**
- **Syntax Highlighting**: CodeMirror editor with JSON syntax highlighting
- **Line Numbers**: Easy navigation and debugging
- **Auto-completion**: Smart bracket matching and auto-closing
- **Real-time Validation**: Instant error detection and highlighting

### 🔄 **Smart Format Conversion**
- **Bidirectional Conversion**: JSON ↔ JSONC ↔ JSON5
- **Comment Preservation**: Maintains comments when converting between JSONC and JSON5
- **Same-Format Processing**: JSONC → JSONC and JSON5 → JSON5 preserve all comments and formatting
- **Intelligent Syntax Handling**: Automatic property name quoting/unquoting
- **Real-time Conversion**: Instant conversion as you type

### 🛠️ **Processing Tools**
- **Format & Prettify**: Beautify and format JSON data
- **Compress/Minify**: Remove all unnecessary whitespace
- **Escape/Unescape**: Handle JSON string escaping for embedding
- **Data Type Conversion**: Convert numbers ↔ strings

### 📊 **Advanced Sorting**
- Sort object keys alphabetically (A-Z or Z-A)
- Deep sorting for nested objects
- Preserve or reorganize data structure

### 💾 **File Operations**
- Copy to clipboard with one click
- Download converted files
- Support for multiple file formats

### ⚙️ **Customizable Options**
- Configurable indentation (2 spaces, 4 spaces, or tabs)
- Multiple sorting options
- Real-time preview of changes

### 🌐 **Dual Mode**
- Chrome extension for quick access
- Standalone web page for full-featured editing
- Responsive design for desktop and mobile

### ⌨️ **Productivity Features**
- Keyboard shortcuts for common actions
- Auto-conversion on input change
- Comprehensive help documentation

### 🌍 **Multi-language Support**
- **English (Default)**, **Chinese (中文)**, **Japanese (日本語)**, **Korean (한국어)**, **German (Deutsch)**, **French (Français)**, **Spanish (Español)**, **Russian (Русский)**, **Arabic (العربية)**, **Portuguese (Português)** interface
- **Automatic Language Detection**: Detects browser language preference
- **Persistent Settings**: Language choice saved in localStorage
- **Localized Content**: Sample data, help text, and error messages
- **Real-time Switching**: Change language without page reload
- **Help Documentation**: Multi-language help and keyboard shortcuts

### 💬 **Comment Preservation**
- **JSONC ↔ JSON5**: Preserves all comments during conversion
- **Same Format**: JSONC → JSONC and JSON5 → JSON5 maintain formatting
- **Smart Processing**: Removes comments only when converting to standard JSON
- **Multiple Comment Types**: Supports `//` single-line and `/* */` multi-line comments

## Supported Formats

### JSON (JavaScript Object Notation)
Standard JSON format with strict syntax rules.

### JSONC (JSON with Comments)
JSON format that supports:
- Single-line comments (`//`)
- Multi-line comments (`/* */`)
- Trailing commas

### JSON5 (JSON for Humans)
Extended JSON format that supports:
- Comments (single and multi-line)
- Trailing commas
- Unquoted property names
- Single-quoted strings
- Multi-line strings
- Additional number formats

## Installation

### 📦 **Pre-built Packages**

Download the latest release from [GitHub Releases](https://github.com/idev-sig/json-format-converter/releases):

#### Chrome Extension
1. Download `json-format-converter-chrome.zip`
2. Extract the ZIP file
3. Open Chrome and navigate to `chrome://extensions/`
4. Enable "Developer mode" in the top right
5. Click "Load unpacked" and select the extracted folder
6. The extension will appear in your toolbar

#### Standalone Web App
1. Download `json-format-converter-standalone.zip`
2. Extract the ZIP file to your web server
3. Open `index.html` in any modern web browser
4. Or deploy the files to any web hosting service

### 🛠️ **Build from Source**

```bash
# Clone the repository
git clone https://github.com/idev-sig/json-format-converter.git
cd json-format-converter

# Build all targets (Chrome, Firefox, Standalone)
npm run build

# Or build specific targets
npm run build:chrome      # Chrome extension only
npm run build:firefox     # Firefox extension only
npm run build:standalone  # Standalone web app only

# Files will be generated in dist/ directory
# - dist/chrome/ (Chrome extension)
# - dist/firefox/ (Firefox extension)
# - dist/standalone/ (Web app)
# - *.zip files (Distribution packages)
```

## Usage

### 🎯 **Quick Start**

#### Chrome Extension
1. Click the extension icon in your toolbar
2. Paste your JSON, JSONC, or JSON5 data in the input panel
3. Select the input and output formats from the dropdowns
4. The conversion happens automatically in real-time
5. Use the panel buttons for additional processing
6. Copy or download the result from the output panel

#### Standalone Web App
1. Open the web app in your browser
2. Use the same interface with a wider, more comfortable layout
3. Perfect for complex editing tasks and bookmarking
4. Access comprehensive help documentation

### 🔄 **Conversion Examples**

#### Comment Preservation
```
// JSONC → JSON5 (preserves comments)
{
    // Configuration settings
    "name": "My App",
    "version": "1.0.0", // Current version
}

// Converts to:
{
    // Configuration settings
    name: "My App",
    version: "1.0.0", // Current version
}
```

#### Same Format Processing
```
// JSONC → JSONC (preserves all comments and formatting)
// JSON5 → JSON5 (preserves all comments and formatting)
```

### 🎛️ **Button Functions**

#### Input Panel
- **Clear**: Remove all content from input editor
- **Format**: Beautify and format the input JSON with proper indentation
- **Compress**: Minify the input JSON (remove all whitespace)
- **Escape**: Escape JSON string for safe embedding in code
- **Unescape**: Remove escape characters from JSON string
- **Example**: Load localized sample data for the current format

#### Output Panel
- **Copy**: Copy formatted output to clipboard with success feedback
- **Download**: Save output as `.json` file with automatic naming
- **Num→Str**: Convert all numeric values to string format
- **Str→Num**: Convert numeric strings back to number format

### ⌨️ **Keyboard Shortcuts**
- **Ctrl/Cmd + Enter**: Format and beautify input
- **Ctrl/Cmd + Shift + C**: Copy output to clipboard
- **Ctrl/Cmd + Shift + D**: Download output as file
- **Escape**: Clear all input and output
- **F1**: Open help documentation with keyboard shortcuts

### 🎨 **Visual Feedback**
- **Button States**: Active (green) → Success (green) → Normal state transitions
- **Real-time Validation**: Instant error highlighting and syntax checking
- **Status Messages**: Clear success/error notifications
- **Language Switching**: Seamless interface language changes

## Project Structure

```
json-format-converter/
├── src/                    # Source code directory
│   ├── manifest.json       # Chrome extension manifest
│   ├── html/               # HTML files
│   │   ├── popup.html      # Extension popup interface
│   │   ├── standalone.html # Standalone web page
│   │   └── help.html       # Help documentation
│   ├── css/                # Stylesheets
│   │   └── styles.css      # Main stylesheet
│   ├── js/                 # JavaScript files
│   │   ├── i18n.js         # Internationalization
│   │   ├── converter.js    # Core conversion logic
│   │   └── popup.js        # UI interaction logic
│   ├── lib/                # Third-party libraries
│   │   ├── codemirror.min.js
│   │   ├── javascript.min.js
│   │   └── json5.min.js
│   └── icons/              # Extension icons
│       ├── icon.svg        # Source icon
│       ├── icon16.png      # 16x16 icon
│       ├── icon32.png      # 32x32 icon
│       ├── icon48.png      # 48x48 icon
│       └── icon128.png     # 128x128 icon
├── scripts/                # Node-based build and dev scripts
│   ├── build.js            # Production builder (Chrome/Firefox/Standalone)
│   ├── dev-server.js       # Lightweight dev server
│   ├── clean.js            # Clean artifacts
│   └── update-libs.js      # Update vendored libs (JSON5/CodeMirror)
├── dist/                   # Build output directory
│   ├── chrome/             # Chrome extension build
│   ├── firefox/            # Firefox extension build
│   └── standalone/         # Standalone web app build
├── package.json           # Project metadata
├── .gitignore            # Git ignore rules
└── README.md             # This file
```

## Development

### Prerequisites
- Node.js 18+ and npm
- Modern web browser
- ImageMagick (only if you want to rebuild icons)

### 🚀 **Quick Start**
```bash
# Clone the repository
git clone https://github.com/idev-sig/json-format-converter.git
cd json-format-converter

# Start development server
npm run dev

# Build for production (Chrome + Firefox + Standalone)
npm run build

# Build a specific target
npm run build:chrome
npm run build:firefox
npm run build:standalone

# Update vendored libraries (JSON5/CodeMirror)
npm run update:libs

# Clean artifacts
npm run clean
```

### 🔧 **Development Workflow**
1. **Edit Source**: Modify files in the `src/` directory
2. **Live Development**: `npm run dev` then open `http://localhost:8080/standalone.html`
3. **Extension Testing**: Build first, then load in `chrome://extensions/` or `about:debugging`
4. **Package**: Zip files are produced automatically in project root

### 📋 **Available Commands**
```bash
# Development
npm run dev               # Start development server (default: 8080)

# Building
npm run build             # Build all targets
npm run build:chrome
npm run build:firefox
npm run build:standalone

# Utilities
npm run update:libs       # Update JSON5/CodeMirror from jsDelivr
npm run clean             # Remove dist and archives
```

### 🎨 **Building Icons**
If you need to regenerate icons from the SVG source:
```bash
# Requires ImageMagick
cd src/icons
convert icon.svg -resize 16x16 icon16.png
convert icon.svg -resize 32x32 icon32.png
convert icon.svg -resize 48x48 icon48.png
convert icon.svg -resize 128x128 icon128.png
```

## 🛠️ **Technology Stack**

### Core Technologies
- **Vanilla JavaScript**: No framework dependencies for maximum compatibility
- **CodeMirror 5**: Advanced code editor with syntax highlighting
- **JSON5**: Extended JSON parsing with comment support
- **CSS3**: Modern styling with flexbox and grid layouts

### Build System
- **Node.js**: Cross-platform build system (Windows, Linux, macOS)
- **NPM Scripts**: Standard package management and build commands

### Browser APIs
- **Chrome/Firefox Extension APIs**
- **Web APIs**: Clipboard, File Download, LocalStorage
- **ES6+ Features**: Modern JavaScript with broad browser support

## 📦 Third-party Libraries & CDN

- **JSON5** — Parser used for JSON5/JSONC compatibility.
  - Repo: https://github.com/json5/json5
  - File: `src/lib/json5.min.js`
  - Source CDN: https://cdn.jsdelivr.net/npm/json5@<version>/dist/index.min.js
- **CodeMirror 5** — Editor used for syntax highlighting.
  - Site: https://codemirror.net/
  - Files: `src/lib/codemirror.min.js`, `src/lib/codemirror.min.css`, `src/lib/javascript.min.js`
  - Source CDN: https://cdn.jsdelivr.net/npm/codemirror@<version>/(lib|mode/javascript)/...

Update these assets using:

```bash
npm run update:libs
# or specify versions
node scripts/update-libs.js --json5 2.2.3 --cm 5.65.16
```

All third‑party files are vendored under `src/lib/` for offline/packaged usage.

## 🌐 **Browser Compatibility**

- **Chrome Extension**: Chrome 88+ (Manifest V3)
- **Standalone Web App**: ES6+ modern browsers
  - Chrome 88+ ✅
  - Firefox 128+ ✅
  - Safari 14+ ✅
  - Edge 88+ ✅
  - Opera 74+ ✅

## 🤝 **Contributing**

We welcome contributions! Please follow these steps:

1. **Fork** the repository on GitHub
2. **Clone** your fork locally
3. **Create** a feature branch: `git checkout -b feature/amazing-feature`
4. **Make** your changes and test thoroughly
5. **Run** validation: `node scripts/validate.js`
6. **Commit** your changes: `git commit -m 'Add amazing feature'`
7. **Push** to your branch: `git push origin feature/amazing-feature`
8. **Submit** a pull request

### 📝 **Development Guidelines**
- Follow existing code style and conventions
- Add tests for new features
- Update documentation as needed
- Ensure all validation checks pass
- Test in both extension and standalone modes

## 📄 **License**

Apache 2.0 License - feel free to use this project for personal or commercial purposes.

See [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- [CodeMirror](https://codemirror.net/) - Excellent code editor component
- [JSON5](https://json5.org/) - JSON for humans specification and parser

## 📞 **Support**

- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/idev-sig/json-format-converter/issues)
- 💡 **Feature Requests**: [GitHub Discussions](https://github.com/idev-sig/json-format-converter/discussions)
- 📧 **Contact**: Create an issue for any questions

---

**© 2025 JSON Format Converter.**
