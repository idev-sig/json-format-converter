/**
 * Chrome Extension Standard i18n support for JSON Format Converter
 * Uses Chrome's built-in i18n API with _locales directory structure
 */

class ChromeI18n {
    constructor() {
        this.isExtension = typeof chrome !== 'undefined' && chrome.i18n;
        this.currentLanguage = this.detectLanguage();
        this.manualLanguage = null; // For manual language override
        this.translations = {}; // Cache for manual translations
    }
    
    detectLanguage() {
        if (this.isExtension) {
            // Use Chrome extension's detected language
            const uiLang = chrome.i18n.getUILanguage();

            // Map Chrome language codes to our supported languages
            if (uiLang === 'zh-CN' || uiLang === 'zh_CN') return 'zh_CN';
            if (uiLang === 'zh-TW' || uiLang === 'zh_TW') return 'zh_TW';
            if (uiLang.startsWith('zh')) return 'zh_CN'; // Default Chinese to simplified
            if (uiLang.startsWith('ko')) return 'ko';
            if (uiLang.startsWith('ja')) return 'ja';
            if (uiLang.startsWith('pt')) return 'pt_BR';
            if (uiLang.startsWith('fr')) return 'fr';
            if (uiLang.startsWith('de')) return 'de';
            if (uiLang.startsWith('ru')) return 'ru';
            if (uiLang.startsWith('es')) return 'es';
            if (uiLang.startsWith('ar')) return 'ar';

            return 'en'; // Default to English
        } else {
            // For standalone version, delegate to original i18n system
            return 'en';
        }
    }
    
    async setLanguage(lang) {
        if (this.isExtension) {
            // In Chrome extension, manually load and cache translations
            console.log('Manually switching language to:', lang);
            this.manualLanguage = lang;

            try {
                // Load translation file for the selected language
                const response = await fetch(`_locales/${lang}/messages.json`);
                if (response.ok) {
                    const messages = await response.json();
                    this.translations[lang] = {};

                    // Convert Chrome i18n format to simple key-value
                    Object.keys(messages).forEach(key => {
                        this.translations[lang][key] = messages[key].message;
                    });

                    console.log(`✅ Loaded ${lang} translations for manual switching`);
                    this.updateUI();
                } else {
                    console.warn(`⚠️ Failed to load ${lang} translations`);
                }
            } catch (error) {
                console.error(`❌ Error loading ${lang} translations:`, error);
            }
        } else {
            // For standalone version, delegate to original i18n system
            if (window.i18n && window.i18n.setLanguage) {
                window.i18n.setLanguage(lang);
            }
        }
    }

    getMessage(key, substitutions) {
        if (this.isExtension) {
            // Check if manual language is set and translation is available
            if (this.manualLanguage && this.translations[this.manualLanguage] && this.translations[this.manualLanguage][key]) {
                return this.translations[this.manualLanguage][key];
            }
            // Fallback to Chrome's i18n API
            return chrome.i18n.getMessage(key, substitutions) || key;
        } else {
            // For standalone version, delegate to original i18n system
            if (window.i18n && window.i18n.t) {
                return window.i18n.t(key);
            }
            return key;
        }
    }
    
    // Alias for getMessage to match Chrome API
    t(key, substitutions) {
        return this.getMessage(key, substitutions);
    }

    // Check if running in extension context
    isExtensionContext() {
        return this.isExtension;
    }

    // Get current language
    getCurrentLanguage() {
        return this.manualLanguage || this.currentLanguage;
    }

    updateUI() {
        if (this.isExtension) {
            // In Chrome extension, update UI with Chrome i18n messages
            const elements = document.querySelectorAll('[data-i18n]');
            elements.forEach(element => {
                const key = element.getAttribute('data-i18n');
                const translation = this.getMessage(key);

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
            document.title = this.getMessage('title');
        } else {
            // For standalone version, delegate to original i18n system
            if (window.i18n && window.i18n.updateUI) {
                window.i18n.updateUI();
            }
        }
    }
    
    updateUI() {
        // Update all elements with data-i18n attribute
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.getMessage(key);
            
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
        
        // Update language selector (only for standalone version)
        if (!this.isExtension) {
            const languageSelect = document.getElementById('language-select');
            if (languageSelect) {
                languageSelect.value = this.currentLanguage;
            }
        }
        
        // Update document title
        document.title = this.getMessage('title');
    }
    
    // Get available languages
    getAvailableLanguages() {
        if (this.isExtension) {
            return ['en', 'zh_CN', 'zh_TW', 'ko', 'ja', 'pt_BR', 'fr', 'de', 'ru', 'es', 'ar']; // Based on available _locales
        } else {
            // For standalone version, delegate to original i18n system
            if (window.i18n && window.i18n.getAvailableLanguages) {
                return window.i18n.getAvailableLanguages();
            }
            return ['en'];
        }
    }
    
    // Get current language
    getCurrentLanguage() {
        return this.currentLanguage;
    }
    
    // Get language display name
    getLanguageDisplayName(lang) {
        const displayNames = {
            'en': 'English',
            'zh': '中文',
            'zh_CN': '简体中文',
            'zh_TW': '繁體中文',
            'ko': '한국어',
            'ja': '日本語',
            'pt_BR': 'Português (Brasil)',
            'fr': 'Français',
            'de': 'Deutsch',
            'ru': 'Русский',
            'es': 'Español',
            'ar': 'العربية'
        };
        return displayNames[lang] || lang;
    }
    
    // Check if running in extension context
    isExtensionContext() {
        return this.isExtension;
    }
    
    // Get UI language (Chrome extension API)
    getUILanguage() {
        if (this.isExtension) {
            return chrome.i18n.getUILanguage();
        } else {
            return navigator.language || navigator.userLanguage || 'en';
        }
    }
}

// Create global instance
window.chromeI18n = new ChromeI18n();

// Auto-initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.chromeI18n.updateUI();
    });
} else {
    window.chromeI18n.updateUI();
}
