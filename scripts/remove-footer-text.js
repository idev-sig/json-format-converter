#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const LOCALES_DIR = path.join(__dirname, '../src/_locales');
const SUPPORTED_LANGUAGES = ['en', 'zh_CN', 'zh_TW', 'ko', 'ja', 'pt_BR', 'fr', 'de', 'ru', 'es', 'ar'];

// Process each language
SUPPORTED_LANGUAGES.forEach(lang => {
    const filePath = path.join(LOCALES_DIR, lang, 'messages.json');
    
    if (fs.existsSync(filePath)) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const messages = JSON.parse(content);
            
            if (messages.footerText) {
                delete messages.footerText;
                
                // Write back with proper formatting
                const updatedContent = JSON.stringify(messages, null, 2);
                fs.writeFileSync(filePath, updatedContent, 'utf8');
                console.log(`✅ Removed footerText from ${lang}`);
            } else {
                console.log(`⚠️  footerText not found in ${lang}`);
            }
        } catch (error) {
            console.error(`❌ Error processing ${lang}:`, error.message);
        }
    } else {
        console.log(`⚠️  File not found: ${filePath}`);
    }
});

console.log('🎉 footerText removal completed!');
