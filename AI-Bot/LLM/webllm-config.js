/**
 * WebLLM Configuration
 * Zentrale Einstellungen für WebLLM Integration
 * 
 * CDN URLs (aktualisiert January 3, 2026):
 * - Primary: https://esm.run/@mlc-ai/web-llm@0.2.80 (ESM Import)
 * - Fallback: jsdelivr CDN ESM
 * - Fallback: unpkg CDN ESM
 */

const WebLLMConfig = {
    // Modell-Auswahl (MUSS in WebLLM's prebuiltAppConfig sein!)
    // Offizielle Liste: https://github.com/mlc-ai/web-llm/blob/main/src/config.ts
    // WICHTIG: Model IDs benötigen die "-MLC" suffix!
    model: 'Llama-3.2-1B-Instruct-q4f32_1-MLC',
    
    // Modell-Optionen (von der offiziellen WebLLM v0.2.80 Liste)
    modelOptions: {
        'Llama-3.2-1B (Empfohlen)': 'Llama-3.2-1B-Instruct-q4f32_1-MLC',     // ~1.1 GB, Schnell ✅
        'Phi-3.5-mini': 'Phi-3.5-mini-instruct-q4f32_1-MLC',                 // ~2.5 GB, Gut
        'Llama-3.1-8B': 'Llama-3.1-8B-Instruct-q4f32_1-MLC',                 // ~6.6 GB, Sehr gut
        'Mistral-7B': 'Mistral-7B-Instruct-v0.3-q4f32_1-MLC',               // ~5 GB, Excellent
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
    
    // CDN-Einstellungen (für Fehlerdiagnose)
    cdnUrls: [
        'https://esm.run/@mlc-ai/web-llm@0.2.80',           // Haupt-ESM URL
        'https://cdn.jsdelivr.net/npm/@mlc-ai/web-llm@0.2.80/+esm',
        'https://unpkg.com/@mlc-ai/web-llm@0.2.80/+esm'
    ],
    
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
