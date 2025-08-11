#!/usr/bin/env node

/**
 * Test script for comment preservation functionality
 */

const fs = require('fs');
const path = require('path');

// Load the converter
const JSONConverter = require('../src/js/converter.js');

// Test data
const testJSONC = `{
    // This is a single-line comment
    "name": "JSON Format Converter",
    "version": "1.0.0",
    
    /* 
     * This is a multi-line comment
     * describing the features array
     */
    "features": [
        "JSON ↔ JSONC ↔ JSON5 conversion", // Feature 1
        "Real-time formatting and validation", // Feature 2
        "Copy and download functionality", // Feature 3
    ],
    
    // Configuration section
    "config": {
        "indentSize": 4, // Number of spaces
        "allowComments": true, // Enable comments
    },
}`;

const testJSON5 = `{
    // JSON5 example with unquoted keys
    name: "JSON Format Converter",
    version: "1.0.0",
    
    /* 
     * Features array with trailing comma
     */
    features: [
        "JSON ↔ JSONC ↔ JSON5 conversion", // Feature 1
        "Real-time formatting and validation", // Feature 2
        "Copy and download functionality", // Trailing comma allowed
    ],
    
    // Configuration with unquoted keys
    config: {
        indentSize: 4, // Unquoted key
        allowComments: true, // Another unquoted key
        hexNumber: 0xFF, // Hexadecimal number
    },
}`;

function extractComments(text) {
    const comments = [];
    
    // Single-line comments
    const singleLineMatches = text.match(/\/\/.*$/gm);
    if (singleLineMatches) {
        comments.push(...singleLineMatches.map(c => c.trim()));
    }
    
    // Multi-line comments
    const multiLineMatches = text.match(/\/\*[\s\S]*?\*\//g);
    if (multiLineMatches) {
        comments.push(...multiLineMatches.map(c => c.trim()));
    }
    
    return comments;
}

function testConversion(input, inputFormat, outputFormat, testName) {
    console.log(`\n🧪 Testing: ${testName}`);
    console.log(`   ${inputFormat.toUpperCase()} → ${outputFormat.toUpperCase()}`);
    
    const converter = new JSONConverter();
    const result = converter.convert(input, inputFormat, outputFormat);
    
    if (!result.success) {
        console.log(`   ❌ Conversion failed: ${result.error}`);
        return false;
    }
    
    const inputComments = extractComments(input);
    const outputComments = extractComments(result.result);
    
    console.log(`   📝 Input comments: ${inputComments.length}`);
    console.log(`   📝 Output comments: ${outputComments.length}`);
    
    if (inputComments.length === outputComments.length) {
        console.log(`   ✅ All comments preserved!`);
        return true;
    } else if (outputComments.length > 0) {
        console.log(`   ⚠️  Some comments preserved (${outputComments.length}/${inputComments.length})`);
        return false;
    } else {
        console.log(`   ❌ No comments preserved`);
        return false;
    }
}

function main() {
    console.log('🔄 JSON Format Converter - Comment Preservation Test');
    console.log('====================================================');
    
    let passed = 0;
    let total = 0;
    
    // Test 1: JSONC → JSON5
    total++;
    if (testConversion(testJSONC, 'jsonc', 'json5', 'JSONC to JSON5 conversion')) {
        passed++;
    }
    
    // Test 2: JSON5 → JSONC
    total++;
    if (testConversion(testJSON5, 'json5', 'jsonc', 'JSON5 to JSONC conversion')) {
        passed++;
    }
    
    // Test 3: JSONC → JSONC (should preserve comments)
    total++;
    if (testConversion(testJSONC, 'jsonc', 'jsonc', 'JSONC to JSONC conversion (same format)')) {
        passed++;
    }

    // Test 4: JSON5 → JSON5 (should preserve comments)
    total++;
    if (testConversion(testJSON5, 'json5', 'json5', 'JSON5 to JSON5 conversion (same format)')) {
        passed++;
    }

    // Test 5: JSON → JSONC (should not add extra comments)
    total++;
    console.log(`\n🧪 Testing: JSON to JSONC conversion (should not add extra comments)`);
    console.log(`   JSON → JSONC`);

    const testJSON = `{
  "name": "JSON Format Converter",
  "version": "1.0.0",
  "features": [
    "JSON conversion",
    "Real-time formatting"
  ]
}`;

    const converter = new JSONConverter();
    const jsonToJSONCResult = converter.convert(testJSON, 'json', 'jsonc');

    if (!jsonToJSONCResult.success) {
        console.log(`   ❌ Conversion failed: ${jsonToJSONCResult.error}`);
    } else {
        const inputComments = extractComments(testJSON);
        const outputComments = extractComments(jsonToJSONCResult.result);

        console.log(`   📝 Input comments: ${inputComments.length}`);
        console.log(`   📝 Output comments: ${outputComments.length}`);

        if (inputComments.length === 0 && outputComments.length === 0) {
            console.log(`   ✅ No extra comments added`);
            passed++;
        } else if (outputComments.length > inputComments.length) {
            console.log(`   ❌ Extra comments were added: ${outputComments.join(', ')}`);
        } else {
            console.log(`   ✅ Comments handled correctly`);
            passed++;
        }
    }

    // Test 6: JSONC → JSON (should remove comments)
    total++;
    console.log(`\n🧪 Testing: JSONC to JSON conversion (comments should be removed)`);
    console.log(`   JSONC → JSON`);

    const jsoncToJsonResult = converter.convert(testJSONC, 'jsonc', 'json');

    if (!jsoncToJsonResult.success) {
        console.log(`   ❌ Conversion failed: ${jsoncToJsonResult.error}`);
    } else {
        const inputComments = extractComments(testJSONC);
        const outputComments = extractComments(jsoncToJsonResult.result);

        console.log(`   📝 Input comments: ${inputComments.length}`);
        console.log(`   📝 Output comments: ${outputComments.length}`);

        if (outputComments.length === 0) {
            console.log(`   ✅ Comments correctly removed for JSON format`);
            passed++;
        } else {
            console.log(`   ❌ Comments should be removed for JSON format`);
        }
    }
    
    // Summary
    console.log('\n====================================================');
    console.log('📊 Test Summary');
    console.log('====================================================');
    console.log(`Total tests: ${total}`);
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${total - passed}`);
    
    if (passed === total) {
        console.log('\n🎉 All tests passed! Comment preservation is working correctly.');
        process.exit(0);
    } else {
        console.log('\n❌ Some tests failed. Please check the implementation.');
        process.exit(1);
    }
}

// Run tests
main();
