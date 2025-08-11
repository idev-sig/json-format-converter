/**
 * Dynamic i18n loader for standalone version
 * Loads translations from _locales directory
 */

class I18nLoader {
    constructor() {
        this.translations = {};
        this.currentLanguage = 'en';
        this.availableLanguages = ['en', 'zh_CN', 'zh_TW', 'ko', 'ja', 'pt_BR', 'fr', 'de', 'ru', 'es', 'ar'];
        this.isLoaded = false;
    }
    
    async loadTranslations() {
        try {
            // Load all available languages
            const loadPromises = this.availableLanguages.map(async (lang) => {
                try {
                    const response = await fetch(`_locales/${lang}/messages.json`);
                    if (response.ok) {
                        const messages = await response.json();
                        this.translations[lang] = {};
                        
                        // Convert Chrome i18n format to simple key-value
                        Object.keys(messages).forEach(key => {
                            this.translations[lang][key] = messages[key].message;
                        });
                        
                        console.log(`✅ Loaded ${lang} translations`);
                    }
                } catch (error) {
                    console.warn(`⚠️ Failed to load ${lang} translations:`, error);
                }
            });
            
            await Promise.all(loadPromises);
            this.isLoaded = true;
            
            // Detect and set initial language
            this.currentLanguage = this.detectLanguage();
            console.log(`🌍 i18n loaded with ${Object.keys(this.translations).length} languages`);
            
        } catch (error) {
            console.error('❌ Failed to load translations:', error);
            // Fallback to English
            this.currentLanguage = 'en';
        }
    }
    
    detectLanguage() {
        // Check localStorage first
        const saved = localStorage.getItem('json-converter-language');
        if (saved && this.translations[saved]) {
            return saved;
        }
        
        // Check browser language
        const browserLang = navigator.language || navigator.userLanguage;
        
        // Map browser language to our supported languages
        if (browserLang === 'zh-CN' || browserLang === 'zh_CN') return 'zh_CN';
        if (browserLang === 'zh-TW' || browserLang === 'zh_TW') return 'zh_TW';
        if (browserLang.startsWith('zh')) return 'zh_CN';
        if (browserLang.startsWith('ko')) return 'ko';
        if (browserLang.startsWith('ja')) return 'ja';
        if (browserLang.startsWith('pt')) return 'pt_BR';
        if (browserLang.startsWith('fr')) return 'fr';
        if (browserLang.startsWith('de')) return 'de';
        if (browserLang.startsWith('ru')) return 'ru';
        if (browserLang.startsWith('es')) return 'es';
        if (browserLang.startsWith('ar')) return 'ar';
        
        return 'en'; // Default to English
    }
    
    setLanguage(lang) {
        if (this.translations[lang]) {
            this.currentLanguage = lang;
            localStorage.setItem('json-converter-language', lang);
            this.updateUI();
            
            // Update language selector
            const languageSelect = document.getElementById('language-select');
            if (languageSelect) {
                languageSelect.value = lang;
            }
        }
    }
    
    t(key) {
        if (!this.isLoaded) {
            return key;
        }
        
        const translation = this.translations[this.currentLanguage];
        return translation && translation[key] ? translation[key] : key;
    }
    
    getMessage(key) {
        return this.t(key);
    }
    
    updateUI() {
        if (!this.isLoaded) return;
        
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.t(key);
            
            // Handle different element types
            if (element.tagName === 'INPUT' && (element.type === 'button' || element.type === 'submit')) {
                element.value = translation;
            } else if (element.tagName === 'INPUT' && element.placeholder !== undefined) {
                element.placeholder = translation;
            } else if (element.tagName === 'TEXTAREA' && element.placeholder !== undefined) {
                element.placeholder = translation;
            } else if (element.tagName === 'OPTION') {
                element.textContent = translation;
            } else {
                element.textContent = translation;
            }
        });
        
        // Update document title
        document.title = this.t('title');
    }
    
    getAvailableLanguages() {
        return this.availableLanguages;
    }
    
    getCurrentLanguage() {
        return this.currentLanguage;
    }
    
    getSampleData() {
        // Return simple English demo data for all languages
        return {
            json5: `{
    // Configuration file
    name: "JSON Format Converter",
    version: "1.0.0",
    port: 8080,
    timeout: 30000,
    features: {
        conversion: true,
        validation: true,
        formatting: true,
    },
    /* Multi-line comment
       describing the settings */
    settings: {
        theme: "light",
        language: "auto",
        maxFileSize: 1048576,
        retryCount: 3
    },
}`,
            jsonc: `{
    // Configuration file
    "name": "JSON Format Converter",
    "version": "1.0.0",
    "port": 8080,
    "timeout": 30000,
    "features": {
        "conversion": true,
        "validation": true,
        "formatting": true
    },
    /* Multi-line comment
       describing the settings */
    "settings": {
        "theme": "light",
        "language": "auto",
        "maxFileSize": 1048576,
        "retryCount": 3
    }
}`,
            json: `{
  "name": "JSON Format Converter",
  "version": "1.0.0",
  "port": 8080,
  "timeout": 30000,
  "features": {
    "conversion": true,
    "validation": true,
    "formatting": true
  },
  "settings": {
    "theme": "light",
    "language": "auto",
    "maxFileSize": 1048576,
    "retryCount": 3
  }
}`
        };
    }
}

// Initialize and export
window.i18nLoader = new I18nLoader();