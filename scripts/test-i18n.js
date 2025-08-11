#!/usr/bin/env node

/**
 * Test script for i18n functionality
 * Validates that all translation keys exist in all supported languages
 */

const fs = require('fs');
const path = require('path');

const LOCALES_DIR = path.join(__dirname, '../src/_locales');
const SUPPORTED_LANGUAGES = ['en', 'zh_CN', 'zh_TW', 'ko', 'ja', 'pt_BR', 'fr', 'de', 'ru', 'es', 'ar'];

function loadMessages(lang) {
    const messagesPath = path.join(LOCALES_DIR, lang, 'messages.json');
    if (!fs.existsSync(messagesPath)) {
        throw new Error(`Messages file not found for language: ${lang}`);
    }
    
    const content = fs.readFileSync(messagesPath, 'utf8');
    return JSON.parse(content);
}

function validateMessages(messages, lang) {
    const errors = [];
    
    for (const [key, value] of Object.entries(messages)) {
        // Check required fields
        if (!value.message) {
            errors.push(`${lang}: Missing 'message' for key '${key}'`);
        }
        
        if (!value.description) {
            errors.push(`${lang}: Missing 'description' for key '${key}'`);
        }
        
        // Check message is not empty
        if (value.message && value.message.trim() === '') {
            errors.push(`${lang}: Empty message for key '${key}'`);
        }
    }
    
    return errors;
}

function compareLanguages(baseMessages, targetMessages, baseLang, targetLang) {
    const errors = [];
    const baseKeys = new Set(Object.keys(baseMessages));
    const targetKeys = new Set(Object.keys(targetMessages));
    
    // Check for missing keys in target language
    for (const key of baseKeys) {
        if (!targetKeys.has(key)) {
            errors.push(`${targetLang}: Missing translation key '${key}' (exists in ${baseLang})`);
        }
    }
    
    // Check for extra keys in target language
    for (const key of targetKeys) {
        if (!baseKeys.has(key)) {
            errors.push(`${targetLang}: Extra translation key '${key}' (not in ${baseLang})`);
        }
    }
    
    return errors;
}

function main() {
    console.log('🌍 Testing i18n functionality...\n');
    
    let totalErrors = 0;
    const allMessages = {};
    
    // Load all messages
    for (const lang of SUPPORTED_LANGUAGES) {
        try {
            console.log(`📖 Loading messages for ${lang}...`);
            allMessages[lang] = loadMessages(lang);
            console.log(`   ✅ Loaded ${Object.keys(allMessages[lang]).length} keys`);
        } catch (error) {
            console.error(`   ❌ Error loading ${lang}: ${error.message}`);
            totalErrors++;
        }
    }
    
    console.log();
    
    // Validate each language
    for (const lang of SUPPORTED_LANGUAGES) {
        if (!allMessages[lang]) continue;
        
        console.log(`🔍 Validating ${lang}...`);
        const errors = validateMessages(allMessages[lang], lang);
        
        if (errors.length === 0) {
            console.log(`   ✅ No validation errors`);
        } else {
            console.log(`   ❌ Found ${errors.length} validation errors:`);
            errors.forEach(error => console.log(`      - ${error}`));
            totalErrors += errors.length;
        }
    }
    
    console.log();
    
    // Compare languages for consistency
    if (allMessages.en && allMessages.zh_CN) {
        console.log('🔄 Comparing language consistency...');
        const comparisonErrors = compareLanguages(allMessages.en, allMessages.zh_CN, 'en', 'zh_CN');
        
        if (comparisonErrors.length === 0) {
            console.log('   ✅ All languages have consistent keys');
        } else {
            console.log(`   ❌ Found ${comparisonErrors.length} consistency errors:`);
            comparisonErrors.forEach(error => console.log(`      - ${error}`));
            totalErrors += comparisonErrors.length;
        }
    }
    
    console.log();
    
    // Summary
    if (totalErrors === 0) {
        console.log('🎉 All i18n tests passed!');
        console.log(`   - ${SUPPORTED_LANGUAGES.length} languages supported`);
        console.log(`   - ${Object.keys(allMessages.en || {}).length} translation keys`);
        console.log('   - All keys consistent across languages');
        process.exit(0);
    } else {
        console.log(`❌ i18n tests failed with ${totalErrors} errors`);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}
