
# JSON Format Converter - GitHub Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview

This is a **JSON Format Converter** project - a Chrome extension and standalone web application for converting between JSON, JSONC (JSON with Comments), and JSON5 formats with advanced editing features and comment preservation.

## Project Structure

```
json-format-converter/
├── src/                    # Source code
│   ├── html/              # HTML files (popup.html, standalone.html, help.html)
│   ├── css/               # Stylesheets (styles.css)
│   ├── js/                # JavaScript files (converter.js, popup.js, i18n.js)
│   ├── lib/               # Third-party libraries (CodeMirror, JSON5)
│   ├── icons/             # Icon files (SVG and PNG)
│   └── manifest.json      # Chrome extension manifest
├── scripts/               # Build and development scripts
├── tests/                 # Test files
├── .github/               # GitHub Actions workflows
├── dist/                  # Build output (generated)
└── justfile              # Just command runner configuration
```

## Development Guidelines

### Technology Stack
- **Vanilla JavaScript**: No framework dependencies for maximum compatibility
- **CodeMirror 5**: Advanced code editor with syntax highlighting
- **JSON5**: Extended JSON parsing with comment support
- **CSS3**: Modern styling with flexbox and grid layouts
- **Just**: Modern command runner for development tasks
- **Python HTTP Server**: Built-in development server

### Key Features to Maintain
1. **Smart Format Conversion**: JSON ↔ JSONC ↔ JSON5 with comment preservation
2. **Advanced Editor**: CodeMirror with syntax highlighting and line numbers
3. **Multi-language Support**: English and Chinese interfaces
4. **Comment Preservation**: Maintains comments during JSONC ↔ JSON5 conversion
5. **Processing Tools**: Format, compress, escape, and data type conversion
6. **Keyboard Shortcuts**: Productivity-focused hotkeys

### Build System
- Use `just build-new` for production builds
- Use `just dev` for development server
- Use `just test-comments` for testing comment preservation
- Use `just check-all` for complete project validation

### Code Style Guidelines
- Follow existing code style and conventions
- Use meaningful variable and function names
- Add comments for complex logic, especially in converter.js
- Maintain consistent indentation (4 spaces)
- Keep functions focused and modular

### Testing Guidelines
- Test all conversion scenarios (JSON ↔ JSONC ↔ JSON5)
- Verify comment preservation in JSONC ↔ JSON5 conversions
- Test both Chrome extension and standalone versions
- Validate multi-language functionality
- Ensure keyboard shortcuts work correctly

### File Modification Guidelines

#### Core Files (Handle with Care)
- **src/js/converter.js**: Core conversion logic, comment preservation system
- **src/js/popup.js**: Main UI logic and event handlers
- **src/js/i18n.js**: Internationalization system (English/Chinese)
- **src/css/styles.css**: Main stylesheet with responsive design
- **src/manifest.json**: Chrome extension configuration

#### When Adding New Features
1. **Conversion Features**: Add to converter.js with proper error handling
2. **UI Features**: Update popup.js and corresponding HTML files
3. **Styling**: Use existing CSS classes and maintain responsive design
4. **Internationalization**: Add translations to both English and Chinese in i18n.js
5. **Testing**: Create test cases in tests/ directory

#### When Fixing Bugs
1. **Identify Root Cause**: Check converter.js for logic issues
2. **Test Thoroughly**: Use `just test-comments` and manual testing
3. **Maintain Compatibility**: Ensure both extension and standalone versions work
4. **Update Documentation**: Modify README files if behavior changes

### Common Development Tasks

#### Starting Development
```bash
just dev          # Start development server on port 8080
just dev 8081     # Start on custom port
```

#### Building and Testing
```bash
just build-new    # Build production packages
just test-comments # Test comment preservation
just check-all    # Run complete validation (59 checks)
```

#### Adding New Conversion Logic
1. Add conversion method to `JSONConverter` class in converter.js
2. Update format detection logic if needed
3. Add UI controls in popup.html if required
4. Update i18n.js with new translation keys
5. Test with various input formats

#### Debugging Common Issues
- **Comment Loss**: Check comment preservation methods in converter.js
- **UI Layout**: Verify CSS flexbox/grid layouts in styles.css
- **Language Issues**: Check i18n.js translation keys and popup.js language handling
- **Build Failures**: Run `just check-all` to identify missing files or syntax errors

### Browser Compatibility
- **Chrome Extension**: Chrome 88+ (Manifest V3 compatible)
- **Standalone Web App**: All modern browsers supporting ES6+
- **CodeMirror**: Version 5.x for maximum compatibility
- **JSON5**: Latest version for extended JSON parsing

### License and Attribution
- **License**: Apache 2.0
- **Author**: Jetsung Chan <i@jetsung.com>
- **Dependencies**: CodeMirror, JSON5 (see package.json for versions)
