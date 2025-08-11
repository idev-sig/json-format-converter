#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const LOCALES_DIR = path.join(__dirname, '../src/_locales');

// Footer text translations
const footerTexts = {
    'ko': '© 2025 JSON 형식 변환기. 개발자를 위해 ❤️로 제작되었습니다.',
    'ja': '© 2025 JSON形式コンバーター。開発者のために❤️で作られました。',
    'pt_BR': '© 2025 Conversor de Formato JSON. Feito com ❤️ para desenvolvedores.',
    'fr': '© 2025 Convertisseur de Format JSON. Fait avec ❤️ pour les développeurs.',
    'de': '© 2025 JSON-Format-Konverter. Mit ❤️ für Entwickler erstellt.',
    'ru': '© 2025 Конвертер JSON Форматов. Создано с ❤️ для разработчиков.',
    'es': '© 2025 Convertidor de Formato JSON. Hecho con ❤️ para desarrolladores.',
    'ar': '© 2025 محول تنسيق JSON. صُنع بـ ❤️ للمطورين.'
};

// Process each language
Object.entries(footerTexts).forEach(([lang, text]) => {
    const filePath = path.join(LOCALES_DIR, lang, 'messages.json');
    
    if (fs.existsSync(filePath)) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const messages = JSON.parse(content);
            
            // Add footerText if not exists
            if (!messages.footerText) {
                messages.footerText = {
                    "message": text,
                    "description": "Footer text"
                };
                
                // Write back with proper formatting
                const updatedContent = JSON.stringify(messages, null, 2);
                fs.writeFileSync(filePath, updatedContent, 'utf8');
                console.log(`✅ Added footerText to ${lang}`);
            } else {
                console.log(`⚠️  footerText already exists in ${lang}`);
            }
        } catch (error) {
            console.error(`❌ Error processing ${lang}:`, error.message);
        }
    } else {
        console.log(`⚠️  File not found: ${filePath}`);
    }
});

console.log('🎉 Footer text addition completed!');
