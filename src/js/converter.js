/**
 * JSON Format Converter
 * Handles conversion between JSON, JSONC, and JSON5 formats
 */

class JSONConverter {
    constructor() {
        this.options = {
            minify: false,
            sortKeys: false,
            sortOrder: 'asc', // 'asc' or 'desc'
            deepSort: false,
            indentSize: 4
        };
    }

    /**
     * Parse JSONC (JSON with Comments)
     */
    parseJSONC(text) {
        // Remove single-line comments
        let cleaned = text.replace(/\/\/.*$/gm, '');
        
        // Remove multi-line comments
        cleaned = cleaned.replace(/\/\*[\s\S]*?\*\//g, '');
        
        // Remove trailing commas
        cleaned = cleaned.replace(/,(\s*[}\]])/g, '$1');
        
        return JSON.parse(cleaned);
    }

    /**
     * Convert to JSONC format
     */
    toJSONC(obj, options = {}) {
        const indent = this.getIndentString(options.indentSize || this.options.indentSize);
        const minify = options.minify || this.options.minify;

        if (minify) {
            return JSON.stringify(obj);
        }

        // Just return formatted JSON without adding comments
        // Comments should be preserved by special conversion methods
        return JSON.stringify(obj, null, indent);
    }

    /**
     * Parse input based on format
     */
    parseInput(text, format) {
        text = text.trim();
        if (!text) {
            throw new Error('Input is empty');
        }

        switch (format) {
            case 'json':
                return JSON.parse(text);
            case 'jsonc':
                return this.parseJSONC(text);
            case 'json5':
                if (typeof JSON5 === 'undefined') {
                    throw new Error('JSON5 library not loaded');
                }
                return JSON5.parse(text);
            default:
                throw new Error(`Unsupported input format: ${format}`);
        }
    }

    /**
     * Convert to output format
     */
    convertToFormat(obj, format, options = {}) {
        const indent = this.getIndentString(options.indentSize || this.options.indentSize);
        const minify = options.minify || this.options.minify;
        const sortKeys = options.sortKeys || this.options.sortKeys;

        // Sort keys if requested
        if (sortKeys) {
            obj = this.sortObjectKeys(obj, options.sortOrder || this.options.sortOrder, options.deepSort || this.options.deepSort);
        }

        switch (format) {
            case 'json':
                return minify ? JSON.stringify(obj) : JSON.stringify(obj, null, indent);
            case 'jsonc':
                return this.toJSONC(obj, { indentSize: options.indentSize, minify });
            case 'json5':
                if (typeof JSON5 === 'undefined') {
                    throw new Error('JSON5 library not loaded');
                }
                return minify ? JSON5.stringify(obj) : JSON5.stringify(obj, null, indent);
            default:
                throw new Error(`Unsupported output format: ${format}`);
        }
    }

    /**
     * Main conversion method
     */
    convert(inputText, inputFormat, outputFormat, options = {}) {
        try {
            // Update options
            this.options = { ...this.options, ...options };

            // Special handling for comment-preserving conversions
            if (inputFormat === 'jsonc' && outputFormat === 'json5') {
                return this.convertJSONCToJSON5(inputText, options);
            }

            if (inputFormat === 'json5' && outputFormat === 'jsonc') {
                return this.convertJSON5ToJSONC(inputText, options);
            }

            // Same format conversions (preserve comments and formatting)
            if (inputFormat === outputFormat && (inputFormat === 'jsonc' || inputFormat === 'json5')) {
                return this.formatSameType(inputText, inputFormat, options);
            }

            // Parse input
            const parsed = this.parseInput(inputText, inputFormat);

            // Convert to output format
            const result = this.convertToFormat(parsed, outputFormat, options);

            return {
                success: true,
                result: result,
                error: null
            };
        } catch (error) {
            return {
                success: false,
                result: null,
                error: error.message
            };
        }
    }

    /**
     * Format/prettify input
     */
    format(inputText, format, options = {}) {
        try {
            const parsed = this.parseInput(inputText, format);
            const formatted = this.convertToFormat(parsed, format, options);
            
            return {
                success: true,
                result: formatted,
                error: null
            };
        } catch (error) {
            return {
                success: false,
                result: null,
                error: error.message
            };
        }
    }

    /**
     * Get indent string based on size
     */
    getIndentString(size) {
        if (size === 'tab') {
            return '\t';
        }
        return ' '.repeat(parseInt(size) || 4);
    }

    /**
     * Recursively sort object keys
     */
    sortObjectKeys(obj, order = 'asc', deep = false) {
        if (Array.isArray(obj)) {
            return deep ? obj.map(item => this.sortObjectKeys(item, order, deep)) : obj;
        } else if (obj !== null && typeof obj === 'object') {
            const sorted = {};
            const keys = Object.keys(obj);
            const sortedKeys = order === 'desc' ? keys.sort().reverse() : keys.sort();

            sortedKeys.forEach(key => {
                sorted[key] = deep ? this.sortObjectKeys(obj[key], order, deep) : obj[key];
            });
            return sorted;
        }
        return obj;
    }

    /**
     * Compress/Minify JSON
     */
    compress(inputText, format) {
        try {
            const parsed = this.parseInput(inputText, format);
            return {
                success: true,
                result: JSON.stringify(parsed),
                error: null
            };
        } catch (error) {
            return {
                success: false,
                result: null,
                error: error.message
            };
        }
    }

    /**
     * Escape JSON string
     */
    escapeJson(inputText) {
        try {
            // If it's already a JSON string, parse it first
            let content = inputText;
            try {
                const parsed = JSON.parse(inputText);
                content = JSON.stringify(parsed);
            } catch (e) {
                // If not valid JSON, treat as plain text
            }

            const escaped = JSON.stringify(content);
            return {
                success: true,
                result: escaped,
                error: null
            };
        } catch (error) {
            return {
                success: false,
                result: null,
                error: error.message
            };
        }
    }

    /**
     * Unescape JSON string
     */
    unescapeJson(inputText) {
        try {
            const unescaped = JSON.parse(inputText);
            return {
                success: true,
                result: typeof unescaped === 'string' ? unescaped : JSON.stringify(unescaped, null, 2),
                error: null
            };
        } catch (error) {
            return {
                success: false,
                result: null,
                error: error.message
            };
        }
    }

    /**
     * Convert numbers to strings
     */
    numbersToStrings(inputText, format) {
        try {
            const parsed = this.parseInput(inputText, format);
            const converted = this.convertNumbersToStrings(parsed);
            const result = this.convertToFormat(converted, format, this.options);

            return {
                success: true,
                result: result,
                error: null
            };
        } catch (error) {
            return {
                success: false,
                result: null,
                error: error.message
            };
        }
    }

    /**
     * Convert strings to numbers
     */
    stringsToNumbers(inputText, format) {
        try {
            const parsed = this.parseInput(inputText, format);
            const converted = this.convertStringsToNumbers(parsed);
            const result = this.convertToFormat(converted, format, this.options);

            return {
                success: true,
                result: result,
                error: null
            };
        } catch (error) {
            return {
                success: false,
                result: null,
                error: error.message
            };
        }
    }

    /**
     * Recursively convert numbers to strings
     */
    convertNumbersToStrings(obj) {
        if (Array.isArray(obj)) {
            return obj.map(item => this.convertNumbersToStrings(item));
        } else if (obj !== null && typeof obj === 'object') {
            const result = {};
            Object.keys(obj).forEach(key => {
                result[key] = this.convertNumbersToStrings(obj[key]);
            });
            return result;
        } else if (typeof obj === 'number') {
            return obj.toString();
        }
        return obj;
    }

    /**
     * Recursively convert numeric strings to numbers
     */
    convertStringsToNumbers(obj) {
        if (Array.isArray(obj)) {
            return obj.map(item => this.convertStringsToNumbers(item));
        } else if (obj !== null && typeof obj === 'object') {
            const result = {};
            Object.keys(obj).forEach(key => {
                result[key] = this.convertStringsToNumbers(obj[key]);
            });
            return result;
        } else if (typeof obj === 'string') {
            // Try to convert string to number if it's a valid number
            const num = Number(obj);
            if (!isNaN(num) && isFinite(num) && obj.trim() !== '') {
                // Check if it's an integer or float
                return obj.includes('.') ? parseFloat(obj) : parseInt(obj, 10);
            }
        }
        return obj;
    }

    /**
     * Convert JSONC to JSON5 while preserving comments
     */
    convertJSONCToJSON5(inputText, options = {}) {
        try {
            const minify = options.minify || this.options.minify;

            if (minify) {
                // For minified output, parse and stringify without comments
                const parsed = this.parseJSONC(inputText);
                return {
                    success: true,
                    result: JSON5.stringify(parsed),
                    error: null
                };
            }

            // Convert JSONC syntax to JSON5 syntax while preserving comments
            let result = inputText;

            // Convert quoted property names to unquoted (JSON5 feature)
            // Only convert simple property names (alphanumeric + underscore)
            result = result.replace(/"([a-zA-Z_$][a-zA-Z0-9_$]*)"\s*:/g, '$1:');

            // Allow trailing commas (JSON5 feature) - no change needed
            // JSON5 supports both single-line and multi-line comments - no change needed

            return {
                success: true,
                result: result,
                error: null
            };
        } catch (error) {
            return {
                success: false,
                result: null,
                error: error.message
            };
        }
    }

    /**
     * Convert JSON5 to JSONC while preserving comments
     */
    convertJSON5ToJSONC(inputText, options = {}) {
        try {
            const minify = options.minify || this.options.minify;

            if (minify) {
                // For minified output, parse and stringify without comments
                const parsed = JSON5.parse(inputText);
                return {
                    success: true,
                    result: JSON.stringify(parsed),
                    error: null
                };
            }

            // Convert JSON5 syntax to JSONC syntax while preserving comments
            let result = inputText;

            // Convert unquoted property names to quoted (JSONC requirement)
            result = result.replace(/([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g, '"$1":');

            // Remove trailing commas (not allowed in JSONC)
            result = result.replace(/,(\s*[}\]])/g, '$1');

            return {
                success: true,
                result: result,
                error: null
            };
        } catch (error) {
            return {
                success: false,
                result: null,
                error: error.message
            };
        }
    }

    /**
     * Format same type while preserving comments (JSONC → JSONC, JSON5 → JSON5)
     */
    formatSameType(inputText, format, options = {}) {
        try {
            const minify = options.minify || this.options.minify;
            const sortKeys = options.sortKeys || this.options.sortKeys;

            if (minify) {
                // For minified output, parse and stringify without comments
                const parsed = this.parseInput(inputText, format);
                const sorted = sortKeys ? this.sortObjectKeys(parsed, options.sortOrder || this.options.sortOrder, options.deepSort || this.options.deepSort) : parsed;
                return {
                    success: true,
                    result: format === 'json5' ? JSON5.stringify(sorted) : JSON.stringify(sorted),
                    error: null
                };
            }

            // For non-minified output, preserve comments and formatting
            let result = inputText;

            // If sorting is requested, we need to parse and reformat
            if (sortKeys) {
                const parsed = this.parseInput(inputText, format);
                const sorted = this.sortObjectKeys(parsed, options.sortOrder || this.options.sortOrder, options.deepSort || this.options.deepSort);
                const indent = this.getIndentString(options.indentSize || this.options.indentSize);
                result = format === 'json5' ? JSON5.stringify(sorted, null, indent) : JSON.stringify(sorted, null, indent);
            } else {
                // Just preserve the original formatting and comments
                // Only adjust indentation if different from current
                const currentIndent = this.detectIndentation(inputText);
                const targetIndent = this.getIndentString(options.indentSize || this.options.indentSize);

                if (currentIndent !== targetIndent) {
                    result = this.adjustIndentation(inputText, currentIndent, targetIndent);
                }
            }

            return {
                success: true,
                result: result,
                error: null
            };
        } catch (error) {
            return {
                success: false,
                result: null,
                error: error.message
            };
        }
    }

    /**
     * Detect current indentation in text
     */
    detectIndentation(text) {
        const lines = text.split('\n');
        for (const line of lines) {
            const match = line.match(/^(\s+)/);
            if (match) {
                const indent = match[1];
                if (indent.includes('\t')) {
                    return '\t';
                } else {
                    return ' '.repeat(indent.length);
                }
            }
        }
        return '    '; // Default to 4 spaces
    }

    /**
     * Adjust indentation in text
     */
    adjustIndentation(text, currentIndent, targetIndent) {
        const lines = text.split('\n');
        return lines.map(line => {
            if (line.trim() === '') return line;

            // Count current indentation level
            let level = 0;
            let i = 0;
            while (i < line.length) {
                if (currentIndent === '\t') {
                    if (line[i] === '\t') {
                        level++;
                        i++;
                    } else {
                        break;
                    }
                } else {
                    const currentIndentLength = currentIndent.length;
                    if (line.substr(i, currentIndentLength) === currentIndent) {
                        level++;
                        i += currentIndentLength;
                    } else {
                        break;
                    }
                }
            }

            // Apply new indentation
            const content = line.substr(i);
            return targetIndent.repeat(level) + content;
        }).join('\n');
    }

    /**
     * Validate JSON format
     */
    validate(text, format) {
        try {
            this.parseInput(text, format);
            return { valid: true, error: null };
        } catch (error) {
            return { valid: false, error: error.message };
        }
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = JSONConverter;
} else {
    window.JSONConverter = JSONConverter;
}
