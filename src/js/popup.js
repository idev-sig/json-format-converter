/**
 * Popup script for JSON Format Converter Chrome Extension
 */

document.addEventListener('DOMContentLoaded', function() {
    const converter = new JSONConverter();

    // Initialize i18n
    if (window.i18n && typeof window.i18n.updateUI === 'function') {
        window.i18n.updateUI();
    } else {
        console.warn('i18n not loaded properly');
    }

    // DOM elements
    const inputFormat = document.getElementById('input-format');
    const outputFormat = document.getElementById('output-format');
    const errorSection = document.getElementById('error-section');
    const errorMessage = document.getElementById('error-message');

    // Initialize CodeMirror editors
    const inputEditor = CodeMirror(document.getElementById('input-editor'), {
        mode: 'javascript',
        theme: 'default',
        lineNumbers: true,
        lineWrapping: true,
        autoCloseBrackets: true,
        matchBrackets: true,
        indentUnit: 4,
        tabSize: 4,
        placeholder: 'Paste your JSON, JSONC, or JSON5 here...'
    });

    const outputEditor = CodeMirror(document.getElementById('output-editor'), {
        mode: 'javascript',
        theme: 'default',
        lineNumbers: true,
        lineWrapping: true,
        readOnly: true,
        indentUnit: 4,
        tabSize: 4,
        placeholder: 'Converted output will appear here...'
    });
    
    // Buttons
    const clearInputBtn = document.getElementById('clear-input');
    const formatInputBtn = document.getElementById('format-input');
    const compressInputBtn = document.getElementById('compress-input');
    const escapeInputBtn = document.getElementById('escape-input');
    const unescapeInputBtn = document.getElementById('unescape-input');
    const loadExampleBtn = document.getElementById('load-example');
    const copyOutputBtn = document.getElementById('copy-output');
    const downloadOutputBtn = document.getElementById('download-output');
    const numbersToStringsBtn = document.getElementById('numbers-to-strings');
    const stringsToNumbersBtn = document.getElementById('strings-to-numbers');

    // Button state management
    function setButtonActive(button, duration = 1000) {
        if (!button) return;

        // Remove active state from all buttons in the same panel
        const panel = button.closest('.panel-buttons');
        if (panel) {
            panel.querySelectorAll('.btn').forEach(btn => {
                btn.classList.remove('btn-active', 'btn-success');
            });
        }

        // Add active state to clicked button
        button.classList.add('btn-active');

        // Remove active state after duration
        setTimeout(() => {
            if (button.classList.contains('btn-active')) {
                button.classList.remove('btn-active');
                button.classList.add('btn-success');

                // Remove success state after another duration
                setTimeout(() => {
                    button.classList.remove('btn-success');
                }, duration / 2);
            }
        }, duration / 2);
    }

    // Validate button elements exist
    if (!clearInputBtn) console.error('Clear input button not found');
    if (!formatInputBtn) console.error('Format input button not found');
    if (!compressInputBtn) console.error('Compress input button not found');
    if (!escapeInputBtn) console.error('Escape input button not found');
    if (!unescapeInputBtn) console.error('Unescape input button not found');
    if (!copyOutputBtn) console.error('Copy output button not found');
    if (!downloadOutputBtn) console.error('Download output button not found');
    if (!numbersToStringsBtn) console.error('Numbers to strings button not found');
    if (!stringsToNumbersBtn) console.error('Strings to numbers button not found');
    
    // Options
    const minifyOutput = document.getElementById('minify-output');
    const sortKeys = document.getElementById('sort-keys');
    const sortOrder = document.getElementById('sort-order');
    const deepSort = document.getElementById('deep-sort');
    const indentSize = document.getElementById('indent-size');

    // Language selector
    const languageSelect = document.getElementById('language-select');

    // Auto-convert on input change
    let convertTimeout;
    function autoConvert() {
        clearTimeout(convertTimeout);
        convertTimeout = setTimeout(() => {
            const inputValue = inputEditor.getValue().trim();
            if (inputValue) {
                performConversion();
            } else {
                outputEditor.setValue('');
                hideError();
            }
        }, 500);
    }

    // Perform conversion
    function performConversion() {
        const input = inputEditor.getValue();
        const inputFmt = inputFormat.value;
        const outputFmt = outputFormat.value;

        if (!input.trim()) {
            outputEditor.setValue('');
            hideError();
            return;
        }

        const options = {
            minify: minifyOutput.checked,
            sortKeys: sortKeys.checked,
            sortOrder: sortOrder.value,
            deepSort: deepSort.checked,
            indentSize: indentSize.value
        };

        const result = converter.convert(input, inputFmt, outputFmt, options);

        if (result.success) {
            outputEditor.setValue(result.result);
            hideError();
        } else {
            showError(result.error);
            outputEditor.setValue('');
        }
    }

    // Format input
    function formatInput() {
        const input = inputEditor.getValue();
        const inputFmt = inputFormat.value;

        if (!input.trim()) {
            return;
        }

        const options = {
            minify: false, // Always prettify when formatting
            sortKeys: sortKeys.checked,
            sortOrder: sortOrder.value,
            deepSort: deepSort.checked,
            indentSize: indentSize.value
        };

        const result = converter.format(input, inputFmt, options);

        if (result.success) {
            inputEditor.setValue(result.result);
            hideError();
            setButtonActive(formatInputBtn);
            // Trigger conversion after formatting
            performConversion();
        } else {
            showError(result.error);
        }
    }

    // Compress input
    function compressInput() {
        const input = inputEditor.getValue();
        const inputFmt = inputFormat.value;

        if (!input.trim()) {
            showError(window.i18n.t('inputEmpty'));
            return;
        }

        const result = converter.compress(input, inputFmt);

        if (result.success) {
            inputEditor.setValue(result.result);
            hideError();
            setButtonActive(compressInputBtn);
            // Don't auto-convert after compression, just update the input
        } else {
            showError(result.error);
        }
    }

    // Escape input
    function escapeInput() {
        const input = inputEditor.getValue();

        if (!input.trim()) {
            showError(window.i18n.t('inputEmpty'));
            return;
        }

        const result = converter.escapeJson(input);

        if (result.success) {
            inputEditor.setValue(result.result);
            hideError();
            setButtonActive(escapeInputBtn);
            // Don't auto-convert after escaping, as it's now a string
        } else {
            showError(result.error);
        }
    }

    // Unescape input
    function unescapeInput() {
        const input = inputEditor.getValue();

        if (!input.trim()) {
            showError('Input is empty');
            return;
        }

        const result = converter.unescapeJson(input);

        if (result.success) {
            inputEditor.setValue(result.result);
            hideError();
            setButtonActive(unescapeInputBtn);
            // Trigger conversion after unescaping since we now have valid JSON
            setTimeout(performConversion, 100);
        } else {
            showError(result.error);
        }
    }

    // Convert numbers to strings in output
    function convertNumbersToStrings() {
        const input = inputEditor.getValue();
        const inputFmt = inputFormat.value;

        if (!input.trim()) {
            return;
        }

        const result = converter.numbersToStrings(input, inputFmt);

        if (result.success) {
            outputEditor.setValue(result.result);
            hideError();
            setButtonActive(numbersToStringsBtn);
        } else {
            showError(result.error);
        }
    }

    // Convert strings to numbers in output
    function convertStringsToNumbers() {
        const input = inputEditor.getValue();
        const inputFmt = inputFormat.value;

        if (!input.trim()) {
            return;
        }

        const result = converter.stringsToNumbers(input, inputFmt);

        if (result.success) {
            outputEditor.setValue(result.result);
            hideError();
            setButtonActive(stringsToNumbersBtn);
        } else {
            showError(result.error);
        }
    }

    // Show error message
    function showError(message) {
        errorMessage.textContent = `❌ ${message}`;
        errorSection.style.display = 'block';
        // Auto-hide error after 5 seconds
        setTimeout(hideError, 5000);
    }

    // Hide error message
    function hideError() {
        errorSection.style.display = 'none';
    }

    // Copy to clipboard
    async function copyToClipboard() {
        const outputValue = outputEditor.getValue();
        if (!outputValue) {
            return;
        }

        try {
            await navigator.clipboard.writeText(outputValue);
            setButtonActive(copyOutputBtn);
            showSuccessMessage(window.i18n.t('copied'));
        } catch (err) {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = outputValue;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            setButtonActive(copyOutputBtn);
            showSuccessMessage(window.i18n.t('copied'));
        }
    }

    // Download as file
    function downloadOutput() {
        const outputValue = outputEditor.getValue();
        if (!outputValue) {
            return;
        }

        const outputFmt = outputFormat.value;
        const filename = `converted.${outputFmt}`;
        const blob = new Blob([outputValue], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        setButtonActive(downloadOutputBtn);
        showSuccessMessage(window.i18n.t('downloaded'));
    }

    // Show success message
    function showSuccessMessage(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = message;
        document.body.appendChild(successDiv);
        
        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.parentNode.removeChild(successDiv);
            }
        }, 3000);
    }

    // Event listeners
    inputEditor.on('change', autoConvert);
    inputFormat.addEventListener('change', () => {
        // If input is empty or contains only sample data, load new sample
        const inputValue = inputEditor.getValue();
        if (!inputValue.trim() || inputValue.includes('JSON Format Converter')) {
            loadSampleData();
        } else {
            autoConvert();
        }
    });
    outputFormat.addEventListener('change', autoConvert);
    minifyOutput.addEventListener('change', autoConvert);
    sortKeys.addEventListener('change', autoConvert);
    sortOrder.addEventListener('change', autoConvert);
    deepSort.addEventListener('change', autoConvert);
    indentSize.addEventListener('change', autoConvert);

    // Language selector
    if (languageSelect) {
        languageSelect.addEventListener('change', (e) => {
            window.i18n.setLanguage(e.target.value);
        });
    }

    clearInputBtn.addEventListener('click', () => {
        inputEditor.setValue('');
        outputEditor.setValue('');
        hideError();
        setButtonActive(clearInputBtn);
    });

    // Bind button events with existence checks
    if (formatInputBtn) {
        formatInputBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            formatInput();
        });
    }

    if (compressInputBtn) {
        compressInputBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            compressInput();
        });
    }

    if (escapeInputBtn) {
        escapeInputBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            escapeInput();
        });
    }

    if (unescapeInputBtn) {
        unescapeInputBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            unescapeInput();
        });
    }

    if (copyOutputBtn) {
        copyOutputBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            copyToClipboard();
        });
    }

    if (downloadOutputBtn) {
        downloadOutputBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            downloadOutput();
        });
    }

    if (numbersToStringsBtn) {
        numbersToStringsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            convertNumbersToStrings();
        });
    }

    if (stringsToNumbersBtn) {
        stringsToNumbersBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            convertStringsToNumbers();
        });
    }

    // Add load example button handler if it exists
    if (loadExampleBtn) {
        loadExampleBtn.addEventListener('click', () => {
            loadSampleData();
            setButtonActive(loadExampleBtn);
        });
    }

    // Load sample data for demonstration
    function loadSampleData() {
        const samples = window.i18n.getSampleData();
        const currentFormat = inputFormat.value;
        inputEditor.setValue(samples[currentFormat] || samples.json5);
        performConversion();
    }

    // Make loadSampleData available globally for i18n
    window.loadSampleData = loadSampleData;

    // Load sample data if input is empty
    if (!inputEditor.getValue().trim()) {
        loadSampleData();
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + Enter: Format input
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            formatInput();
        }
        // Ctrl/Cmd + Shift + C: Copy output
        else if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
            e.preventDefault();
            copyToClipboard();
        }
        // Ctrl/Cmd + Shift + D: Download output
        else if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
            e.preventDefault();
            downloadOutput();
        }
        // Escape: Clear input
        else if (e.key === 'Escape') {
            e.preventDefault();
            e.stopPropagation();
            inputEditor.setValue('');
            outputEditor.setValue('');
            hideError();
        }
    });

    // Focus on input
    inputEditor.focus();
});
