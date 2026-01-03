/**
 * WebLLM Configuration
 * Zentrale Einstellungen für WebLLM Integration
 */

const WebLLMConfig = {
    // Modell-Auswahl
    model: 'Llama-3.2-1B-Instruct-q4f32_1',
    
    // Modell-Optionen
    modelOptions: {
        'Llama-3.2-1B': 'Llama-3.2-1B-Instruct-q4f32_1',  // ~800 MB, Schnell, Kompakt
        'Llama-3.2-3B': 'Llama-3.2-3B-Instruct-q4f16_1',  // ~2.5 GB, Besser, Langsamer
        // 'Mistral-7B': 'Mistral-7B-Instruct-v0.2-q4f16_1' // ~5 GB, Sehr gut, Sehr langsam
    },
    
    // Chat-Parameter
    chat: {
        maxTokens: 500,
        temperature: 0.7,
        topP: 0.95,
        repeatPenalty: 1.0,
    },
    
    // UI-Einstellungen
    ui: {
        showProgressBar: true,
        showWarningModal: true,
        autoSaveHistory: true,
        maxHistoryLength: 50,
    },
    
    // Cache-Einstellungen
    cache: {
        enabled: true,
        autoCleanup: false, // Automatisches Löschen nach X Tagen
        maxCacheSize: 1000, // MB
    },
    
    // Debug-Modus
    debug: false,
    
    // Timeout (ms)
    loadTimeout: 600000, // 10 Minuten
    responseTimeout: 120000, // 2 Minuten
};

// Validierung und Logging
console.log('[WebLLM Config] Geladen:', {
    model: WebLLMConfig.model,
    debug: WebLLMConfig.debug,
    cacheEnabled: WebLLMConfig.cache.enabled
});

// Export für externe Nutzung
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WebLLMConfig;
}
