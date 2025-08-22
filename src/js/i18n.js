/**
 * Internationalization (i18n) system for JSON Format Converter
 * Supports English (default) and Chinese
 */

class I18n {
    constructor() {
        this.translations = {};

        // Initialize current language after translations are defined
        this.currentLanguage = this.detectLanguage();
    }
    
    detectLanguage() {
        // Check localStorage first
        const saved = localStorage.getItem('json-converter-language');
        if (saved && this.translations[saved]) {
            return saved;
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
