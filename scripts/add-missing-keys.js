#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const LOCALES_DIR = path.join(__dirname, '../src/_locales');

// Missing translation keys that need to be added
const missingKeys = {
    'en': {
        'clear': 'Clear',
        'example': 'Example',
        'minify': 'Minify',
        'sortKeys': 'Sort Keys',
        'order': 'Order',
        'orderAsc': 'A-Z',
        'orderDesc': 'Z-A',
        'deepSort': 'Deep Sort',
        'indent': 'Indent',
        'indent2': '2',
        'indent4': '4',
        'indentTab': 'Tab',
        'input': 'Input',
        'output': 'Output'
    },
    'zh_CN': {
        'clear': '清空',
        'example': '示例',
        'minify': '压缩',
        'sortKeys': '排序键',
        'order': '顺序',
        'orderAsc': 'A-Z',
        'orderDesc': 'Z-A',
        'deepSort': '深度排序',
        'indent': '缩进',
        'indent2': '2',
        'indent4': '4',
        'indentTab': 'Tab',
        'input': '输入',
        'output': '输出'
    },
    'zh_TW': {
        'clear': '清空',
        'example': '示例',
        'minify': '壓縮',
        'sortKeys': '排序鍵',
        'order': '順序',
        'orderAsc': 'A-Z',
        'orderDesc': 'Z-A',
        'deepSort': '深度排序',
        'indent': '縮排',
        'indent2': '2',
        'indent4': '4',
        'indentTab': 'Tab',
        'input': '輸入',
        'output': '輸出'
    },
    'ko': {
        'clear': '지우기',
        'example': '예제',
        'minify': '압축',
        'sortKeys': '키 정렬',
        'order': '순서',
        'orderAsc': 'A-Z',
        'orderDesc': 'Z-A',
        'deepSort': '깊은 정렬',
        'indent': '들여쓰기',
        'indent2': '2',
        'indent4': '4',
        'indentTab': 'Tab',
        'input': '입력',
        'output': '출력'
    },
    'ja': {
        'clear': 'クリア',
        'example': '例',
        'minify': '圧縮',
        'sortKeys': 'キーソート',
        'order': '順序',
        'orderAsc': 'A-Z',
        'orderDesc': 'Z-A',
        'deepSort': '深いソート',
        'indent': 'インデント',
        'indent2': '2',
        'indent4': '4',
        'indentTab': 'Tab',
        'input': '入力',
        'output': '出力'
    },
    'pt_BR': {
        'clear': 'Limpar',
        'example': 'Exemplo',
        'minify': 'Minificar',
        'sortKeys': 'Ordenar Chaves',
        'order': 'Ordem',
        'orderAsc': 'A-Z',
        'orderDesc': 'Z-A',
        'deepSort': 'Ordenação Profunda',
        'indent': 'Indentação',
        'indent2': '2',
        'indent4': '4',
        'indentTab': 'Tab',
        'input': 'Entrada',
        'output': 'Saída'
    },
    'fr': {
        'clear': 'Effacer',
        'example': 'Exemple',
        'minify': 'Minifier',
        'sortKeys': 'Trier les Clés',
        'order': 'Ordre',
        'orderAsc': 'A-Z',
        'orderDesc': 'Z-A',
        'deepSort': 'Tri Profond',
        'indent': 'Indentation',
        'indent2': '2',
        'indent4': '4',
        'indentTab': 'Tab',
        'input': 'Entrée',
        'output': 'Sortie'
    },
    'de': {
        'clear': 'Löschen',
        'example': 'Beispiel',
        'minify': 'Minimieren',
        'sortKeys': 'Schlüssel sortieren',
        'order': 'Reihenfolge',
        'orderAsc': 'A-Z',
        'orderDesc': 'Z-A',
        'deepSort': 'Tiefe Sortierung',
        'indent': 'Einrückung',
        'indent2': '2',
        'indent4': '4',
        'indentTab': 'Tab',
        'input': 'Eingabe',
        'output': 'Ausgabe'
    },
    'ru': {
        'clear': 'Очистить',
        'example': 'Пример',
        'minify': 'Минимизировать',
        'sortKeys': 'Сортировать ключи',
        'order': 'Порядок',
        'orderAsc': 'А-Я',
        'orderDesc': 'Я-А',
        'deepSort': 'Глубокая сортировка',
        'indent': 'Отступ',
        'indent2': '2',
        'indent4': '4',
        'indentTab': 'Tab',
        'input': 'Ввод',
        'output': 'Вывод'
    },
    'es': {
        'clear': 'Limpiar',
        'example': 'Ejemplo',
        'minify': 'Minificar',
        'sortKeys': 'Ordenar Claves',
        'order': 'Orden',
        'orderAsc': 'A-Z',
        'orderDesc': 'Z-A',
        'deepSort': 'Ordenación Profunda',
        'indent': 'Sangría',
        'indent2': '2',
        'indent4': '4',
        'indentTab': 'Tab',
        'input': 'Entrada',
        'output': 'Salida'
    },
    'ar': {
        'clear': 'مسح',
        'example': 'مثال',
        'minify': 'ضغط',
        'sortKeys': 'ترتيب المفاتيح',
        'order': 'ترتيب',
        'orderAsc': 'أ-ي',
        'orderDesc': 'ي-أ',
        'deepSort': 'ترتيب عميق',
        'indent': 'مسافة بادئة',
        'indent2': '2',
        'indent4': '4',
        'indentTab': 'Tab',
        'input': 'إدخال',
        'output': 'إخراج'
    }
};

// Process each language
Object.entries(missingKeys).forEach(([lang, keys]) => {
    const filePath = path.join(LOCALES_DIR, lang, 'messages.json');
    
    if (fs.existsSync(filePath)) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const messages = JSON.parse(content);
            
            let added = 0;
            Object.entries(keys).forEach(([key, message]) => {
                if (!messages[key]) {
                    messages[key] = {
                        "message": message,
                        "description": `${key} button/label`
                    };
                    added++;
                }
            });
            
            if (added > 0) {
                // Write back with proper formatting
                const updatedContent = JSON.stringify(messages, null, 2);
                fs.writeFileSync(filePath, updatedContent, 'utf8');
                console.log(`✅ Added ${added} missing keys to ${lang}`);
            } else {
                console.log(`⚠️  No missing keys in ${lang}`);
            }
        } catch (error) {
            console.error(`❌ Error processing ${lang}:`, error.message);
        }
    } else {
        console.log(`⚠️  File not found: ${filePath}`);
    }
});

console.log('🎉 Missing keys addition completed!');
