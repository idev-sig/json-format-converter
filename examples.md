# Format Examples

This document shows examples of the different JSON formats supported by the converter.

## JSON (Standard)

```json
{
  "name": "JSON Format Converter",
  "version": "1.0.0",
  "description": "Convert between JSON formats",
  "features": [
    "JSON to JSONC conversion",
    "JSONC to JSON5 conversion",
    "JSON5 to JSON conversion"
  ],
  "config": {
    "indentSize": 4,
    "allowComments": false,
    "trailingCommas": false
  },
  "author": {
    "name": "Developer",
    "email": "dev@example.com"
  }
}
```

## JSONC (JSON with Comments)

```jsonc
{
  // Application metadata
  "name": "JSON Format Converter",
  "version": "1.0.0",
  "description": "Convert between JSON formats",
  
  /* 
   * Supported features list
   * Add new features here
   */
  "features": [
    "JSON to JSONC conversion",
    "JSONC to JSON5 conversion", 
    "JSON5 to JSON conversion", // Core functionality
  ],
  
  // Configuration options
  "config": {
    "indentSize": 4,
    "allowComments": true, // JSONC supports comments
    "trailingCommas": true, // Trailing commas allowed
  },
  
  "author": {
    "name": "Developer",
    "email": "dev@example.com", // Contact information
  },
}
```

## JSON5 (JSON for Humans)

```json5
{
  // Application metadata (single-line comment)
  name: "JSON Format Converter", // Unquoted property names
  version: "1.0.0",
  description: 'Convert between JSON formats', // Single quotes allowed
  
  /* 
   * Multi-line comment
   * Supported features list
   */
  features: [
    "JSON to JSONC conversion",
    'JSONC to JSON5 conversion', // Mixed quotes
    `JSON5 to JSON conversion`, // Template literals
    // Trailing comma in array
  ],
  
  // Configuration with various number formats
  config: {
    indentSize: 4, // Decimal
    hexValue: 0xFF, // Hexadecimal
    allowComments: true,
    trailingCommas: true,
    infinity: Infinity, // Special values
    notANumber: NaN,
  },
  
  author: {
    name: "Developer",
    email: "dev@example.com",
    bio: 'A developer who loves \
clean and readable code', // Multi-line string
  },
  
  // Trailing comma in object
}
```

## Key Differences

| Feature | JSON | JSONC | JSON5 |
|---------|------|-------|-------|
| Comments | ❌ | ✅ | ✅ |
| Trailing commas | ❌ | ✅ | ✅ |
| Unquoted keys | ❌ | ❌ | ✅ |
| Single quotes | ❌ | ❌ | ✅ |
| Multi-line strings | ❌ | ❌ | ✅ |
| Hex numbers | ❌ | ❌ | ✅ |
| Special values (Infinity, NaN) | ❌ | ❌ | ✅ |

## Use Cases

### JSON
- API responses and requests
- Configuration files for strict parsers
- Data exchange between systems
- When maximum compatibility is required

### JSONC
- Configuration files (VS Code settings, tsconfig.json)
- Documentation-heavy configs
- When you need comments but want to stay close to JSON

### JSON5
- Human-readable configuration files
- Development and debugging
- When you want maximum flexibility and readability
- Modern JavaScript applications
