# JSON Format Converter - Development Guide

## 🏗️ Project Structure

This project follows a modern, organized structure with source code separated from build outputs:

```
json-format-converter/
├── src/                    # 📁 Source code (edit these files)
│   ├── html/              # HTML templates
│   ├── css/               # Stylesheets
│   ├── js/                # JavaScript modules
│   ├── lib/               # Third-party libraries
│   ├── icons/             # Extension icons
│   └── manifest.json      # Extension manifest
├── scripts/               # 🔧 Build and development scripts
├── tests/                 # 🧪 Test files
├── dist/                  # 📦 Build outputs (auto-generated)
├── justfile              # ⚡ Command runner configuration
└── project.config.js     # ⚙️ Project configuration
```

## 🚀 Quick Start

### Prerequisites
- Python 3 (for development server)
- [Just](https://github.com/casey/just) command runner (recommended)
- Modern web browser

### Development Commands

```bash
# Start development server
just dev [port]           # Default port: 8080
just serve                # Quick start on port 8080

# Build for production
just build-new            # Creates dist/ and .zip files

# Testing
just test                 # Start test server on port 8081

# Utilities
just clean                # Clean build files
just check-structure      # Verify project structure
```

### Without Just

```bash
# Development server
./scripts/dev-server.sh [port]

# Production build
./scripts/build.sh

# Clean up
rm -rf dist dev-server *.zip
```

## 🛠️ Development Workflow

### 1. Edit Source Files
- HTML: `src/html/`
- CSS: `src/css/`
- JavaScript: `src/js/`
- Icons: `src/icons/`

### 2. Test Changes
```bash
just dev
# Open http://localhost:8080/standalone.html
```

### 3. Build for Production
```bash
just build-new
# Creates:
# - dist/extension/ (Chrome extension)
# - dist/standalone/ (Web app)
# - *.zip files for distribution
```

## 📁 Source Code Organization

### HTML Files (`src/html/`)
- `popup.html` - Chrome extension popup
- `standalone.html` - Standalone web application
- `help.html` - Help documentation

### JavaScript Modules (`src/js/`)
- `i18n.js` - Internationalization system
- `converter.js` - Core JSON conversion logic
- `popup.js` - UI interaction and event handling

### Stylesheets (`src/css/`)
- `styles.css` - Main stylesheet with responsive design

### Libraries (`src/lib/`)
- `codemirror.min.js` - Code editor
- `javascript.min.js` - JavaScript syntax highlighting
- `json5.min.js` - JSON5 parser

## 🔧 Build System

### Development Server (`scripts/dev-server.sh`)
- Creates temporary `dev-server/` directory
- Copies and processes source files
- Fixes relative paths for development
- Starts Python HTTP server
- Auto-cleanup on exit

### Production Build (`scripts/build.sh`)
- Creates `dist/extension/` for Chrome extension
- Creates `dist/standalone/` for web application
- Processes HTML files for correct paths
- Generates distribution ZIP files
- Creates build information file

## 🧪 Testing

### Test Files (`tests/`)
- `test.html` - Core functionality tests
- `i18n-test.html` - Internationalization tests
- `button-test.html` - Button functionality tests
- `button-state-test.html` - Button state management tests
- `escape-test.html` - Escape key behavior tests

### Running Tests
```bash
just test
# or
./scripts/dev-server.sh 8081
# Then visit http://localhost:8081/test.html
```

## 🌍 Internationalization

### Adding New Languages
1. Edit `src/js/i18n.js`
2. Add translations to the `translations` object
3. Add sample data in `getSampleData()` method
4. Update language selector in HTML files

### Current Languages
- English (en) - Default
- Chinese (zh) - 中文

## 📦 Distribution

### Chrome Extension
- File: `json-format-converter-extension.zip`
- Install: Load unpacked in `chrome://extensions/`

### Standalone Web App
- File: `json-format-converter-standalone.zip`
- Deploy: Upload to any web server

## 🔍 Debugging

### Development Tips
- Use browser developer tools
- Check console for JavaScript errors
- Test in different browsers
- Verify responsive design on mobile

### Common Issues
- Path errors: Check relative paths in HTML files
- Missing files: Ensure all dependencies are in `src/lib/`
- Build failures: Check script permissions and dependencies

## 📋 Code Style

### HTML
- Use semantic HTML5 elements
- Include `data-i18n` attributes for translatable text
- Maintain consistent indentation

### CSS
- Use BEM-like naming conventions
- Mobile-first responsive design
- CSS custom properties for theming

### JavaScript
- ES6+ features
- Modular design
- Comprehensive error handling
- JSDoc comments for functions

## 🚀 Deployment

### Chrome Web Store
1. Build extension: `just build-new`
2. Upload `json-format-converter-extension.zip`
3. Follow Chrome Web Store guidelines

### Web Hosting
1. Build standalone: `just build-new`
2. Extract `json-format-converter-standalone.zip`
3. Upload to web server
4. Access via `index.html`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes in `src/` directory
4. Test with `just dev`
5. Build with `just build-new`
6. Submit pull request

## 📄 License

MIT License - See LICENSE file for details
