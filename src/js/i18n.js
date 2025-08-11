/**
 * Internationalization (i18n) system for JSON Format Converter
 * Supports English (default) and Chinese
 */

class I18n {
    constructor() {
        this.translations = {
            en: {
                // Header
                title: "JSON Format Converter",
                subtitle: "Convert between JSON, JSONC, and JSON5 formats",
                helpLink: "📖 Help & Shortcuts",
                
                // Format labels
                inputFormat: "Input Format:",
                outputFormat: "Output Format:",
                
                // Options
                minify: "Minify",
                sortKeys: "Sort Keys",
                order: "Order:",
                orderAsc: "A-Z",
                orderDesc: "Z-A",
                deepSort: "Deep Sort",
                indent: "Indent:",
                indent2: "2",
                indent4: "4",
                indentTab: "Tab",
                
                // Button labels
                clear: "Clear",
                format: "Format",
                compress: "Compress",
                escape: "Escape",
                unescape: "Unescape",
                example: "Example",
                copy: "Copy",
                download: "Download",
                numToStr: "Num→Str",
                strToNum: "Str→Num",
                
                // Panel headers
                input: "Input",
                output: "Output",
                
                // Placeholders
                inputPlaceholder: "Paste your JSON, JSONC, or JSON5 here...",
                outputPlaceholder: "Converted output will appear here...",
                
                // Messages
                inputEmpty: "Input is empty",
                copied: "Copied to clipboard!",
                downloaded: "File downloaded!",
                
                // Footer
                footerText: "© 2025 JSON Format Converter. Built with ❤️ for developers.",
                
                // Language selector
                language: "Language",
                english: "English",
                chinese: "中文",
                
                // Sample data
                sampleComment: "JSON Format Converter Example",
                sampleDescription: "A powerful tool for converting between different JSON formats with ease",
                sampleFeatures: "Features supported by this converter",
                sampleFeature1: "JSON ↔ JSONC ↔ JSON5 conversion",
                sampleFeature2: "Real-time formatting and validation",
                sampleFeature3: "Copy and download functionality",
                sampleFeature4: "Customizable indentation",
                sampleConfig: "Configuration options",
                sampleAuthor: "Contact information",
                sampleBio: "A developer who loves clean and readable code"
            },
            zh: {
                // Header
                title: "JSON 格式转换器",
                subtitle: "在 JSON、JSONC 和 JSON5 格式之间转换",
                helpLink: "📖 帮助和快捷键",
                
                // Format labels
                inputFormat: "输入格式：",
                outputFormat: "输出格式：",
                
                // Options
                minify: "压缩",
                sortKeys: "排序键名",
                order: "顺序：",
                orderAsc: "A-Z",
                orderDesc: "Z-A",
                deepSort: "深度排序",
                indent: "缩进：",
                indent2: "2空格",
                indent4: "4空格",
                indentTab: "Tab",
                
                // Button labels
                clear: "清空",
                format: "格式化",
                compress: "压缩",
                escape: "转义",
                unescape: "反转义",
                example: "示例",
                copy: "复制",
                download: "下载",
                numToStr: "数字→字符串",
                strToNum: "字符串→数字",
                
                // Panel headers
                input: "输入",
                output: "输出",
                
                // Placeholders
                inputPlaceholder: "在此粘贴您的 JSON、JSONC 或 JSON5 数据...",
                outputPlaceholder: "转换后的输出将在此显示...",
                
                // Messages
                inputEmpty: "输入为空",
                copied: "已复制到剪贴板！",
                downloaded: "文件已下载！",
                
                // Footer
                footerText: "© 2025 JSON 格式转换器。为开发者用心打造。",
                
                // Language selector
                language: "语言",
                english: "English",
                chinese: "中文",
                
                // Sample data
                sampleComment: "JSON 格式转换器示例",
                sampleDescription: "一个强大的工具，可以轻松地在不同的 JSON 格式之间转换",
                sampleFeatures: "此转换器支持的功能",
                sampleFeature1: "JSON ↔ JSONC ↔ JSON5 转换",
                sampleFeature2: "实时格式化和验证",
                sampleFeature3: "复制和下载功能",
                sampleFeature4: "可自定义缩进",
                sampleConfig: "配置选项",
                sampleAuthor: "联系信息",
                sampleBio: "一个热爱简洁可读代码的开发者"
            }
        };

        // Initialize current language after translations are defined
        this.currentLanguage = this.detectLanguage();
    }
    
    detectLanguage() {
        // Check localStorage first
        const saved = localStorage.getItem('json-converter-language');
        if (saved && this.translations[saved]) {
            return saved;
        }
        
        // Check browser language
        const browserLang = navigator.language || navigator.userLanguage;
        if (browserLang.startsWith('zh')) {
            return 'zh';
        }
        
        return 'en'; // Default to English
    }
    
    setLanguage(lang) {
        if (this.translations[lang]) {
            this.currentLanguage = lang;
            localStorage.setItem('json-converter-language', lang);
            this.updateUI();
        }
    }
    
    t(key) {
        return this.translations[this.currentLanguage][key] || this.translations.en[key] || key;
    }
    
    updateUI() {
        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.t(key);
            
            if (element.tagName === 'INPUT' && element.type === 'text') {
                element.placeholder = translation;
            } else if (element.tagName === 'TEXTAREA') {
                element.placeholder = translation;
            } else if (element.tagName === 'OPTION') {
                element.textContent = translation;
            } else {
                element.textContent = translation;
            }
        });
        
        // Update language selector
        const languageSelect = document.getElementById('language-select');
        if (languageSelect) {
            languageSelect.value = this.currentLanguage;
        }
        
        // Trigger sample data reload if needed
        if (window.loadSampleData && typeof window.loadSampleData === 'function') {
            const inputEditor = window.inputEditor;
            if (inputEditor && (!inputEditor.getValue().trim() || inputEditor.getValue().includes('JSON Format Converter') || inputEditor.getValue().includes('JSON 格式转换器'))) {
                window.loadSampleData();
            }
        }
    }
    
    getSampleData() {
        const lang = this.currentLanguage;
        
        if (lang === 'zh') {
            return {
                json5: `{
    // ${this.t('sampleComment')} - JSON5 示例
    name: "${this.t('title')}",
    version: "1.0.0",
    description: '${this.t('sampleDescription')}',
    
    /* ${this.t('sampleFeatures')} */
    features: [
        "${this.t('sampleFeature1')}",
        "${this.t('sampleFeature2')}",
        "${this.t('sampleFeature3')}",
        "${this.t('sampleFeature4')}", // 尾随逗号
    ],
    
    // ${this.t('sampleConfig')}
    config: {
        indentSize: 4,
        allowComments: true,
        trailingCommas: true,
        hexNumbers: 0xFF, // 十六进制支持
        infinity: Infinity,
    },
    
    // ${this.t('sampleAuthor')}
    author: {
        name: "开发者",
        email: "dev@example.com",
        bio: '${this.t('sampleBio')}',
    },
}`,
                jsonc: `{
    // ${this.t('sampleComment')} - JSONC 示例
    "name": "${this.t('title')}",
    "version": "1.0.0",
    "description": "${this.t('sampleDescription')}",
    
    /* 
     * ${this.t('sampleFeatures')}
     * 在此添加新功能
     */
    "features": [
        "${this.t('sampleFeature1')}",
        "${this.t('sampleFeature2')}",
        "${this.t('sampleFeature3')}", // 核心功能
        "${this.t('sampleFeature4')}",
    ],
    
    // ${this.t('sampleConfig')}
    "config": {
        "indentSize": 4,
        "allowComments": true,
        "trailingCommas": true,
    },
    
    "author": {
        "name": "开发者",
        "email": "dev@example.com", // 联系信息
    },
}`,
                json: `{
  "name": "${this.t('title')}",
  "version": "1.0.0",
  "description": "${this.t('sampleDescription')}",
  "features": [
    "${this.t('sampleFeature1')}",
    "${this.t('sampleFeature2')}",
    "${this.t('sampleFeature3')}",
    "${this.t('sampleFeature4')}"
  ],
  "config": {
    "indentSize": 4,
    "allowComments": false,
    "trailingCommas": false
  },
  "author": {
    "name": "开发者",
    "email": "dev@example.com"
  }
}`
            };
        } else {
            return {
                json5: `{
    // ${this.t('sampleComment')} - More human-friendly JSON
    name: "${this.t('title')}",
    version: "1.0.0",
    description: '${this.t('sampleDescription')}',
    
    /* ${this.t('sampleFeatures')} */
    features: [
        "${this.t('sampleFeature1')}",
        "${this.t('sampleFeature2')}",
        "${this.t('sampleFeature3')}",
        "${this.t('sampleFeature4')}", // trailing comma
    ],
    
    // ${this.t('sampleConfig')}
    config: {
        indentSize: 4,
        allowComments: true,
        trailingCommas: true,
        hexNumbers: 0xFF, // hexadecimal support
        infinity: Infinity,
    },
    
    // ${this.t('sampleAuthor')}
    author: {
        name: "Developer",
        email: "dev@example.com",
        bio: '${this.t('sampleBio')}',
    },
}`,
                jsonc: `{
    // ${this.t('sampleComment')} - JSON with Comments
    "name": "${this.t('title')}",
    "version": "1.0.0",
    "description": "${this.t('sampleDescription')}",
    
    /* 
     * ${this.t('sampleFeatures')}
     * Add new features here
     */
    "features": [
        "${this.t('sampleFeature1')}",
        "${this.t('sampleFeature2')}",
        "${this.t('sampleFeature3')}", // Core functionality
        "${this.t('sampleFeature4')}",
    ],
    
    // ${this.t('sampleConfig')}
    "config": {
        "indentSize": 4,
        "allowComments": true,
        "trailingCommas": true,
    },
    
    "author": {
        "name": "Developer",
        "email": "dev@example.com", // Contact info
    },
}`,
                json: `{
  "name": "${this.t('title')}",
  "version": "1.0.0",
  "description": "${this.t('sampleDescription')}",
  "features": [
    "${this.t('sampleFeature1')}",
    "${this.t('sampleFeature2')}",
    "${this.t('sampleFeature3')}",
    "${this.t('sampleFeature4')}"
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
}`
            };
        }
    }
}

// Global i18n instance
window.i18n = new I18n();
