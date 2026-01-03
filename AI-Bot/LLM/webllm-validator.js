/**
 * WebLLM Integration - Validation & Health Check
 * Überprüft ob alle Komponenten korrekt installiert sind
 */

class WebLLMValidator {
    constructor() {
        this.checks = {
            files: [],
            scripts: [],
            dom: [],
            storage: [],
            features: []
        };
        this.isValid = true;
    }

    /**
     * Führt alle Überprüfungen durch
     */
    async runAll() {
        console.log('%c🔍 WebLLM Validator starten...', 'color: #a855f7; font-weight: bold; font-size: 14px;');
        
        this.checkDOM();
        this.checkScripts();
        this.checkStorage();
        this.checkFeatures();
        await this.checkNetworkConnectivity();
        
        this.printReport();
        return this.isValid;
    }

    /**
     * Prüft Netzwerk-Konnektivität
     */
    async checkNetworkConnectivity() {
        console.log('\n%c🌐 Prüfe Netzwerk-Konnektivität...', 'color: #0891b2; font-size: 12px;');
        
        const cdnUrls = [
            'https://esm.run/@mlc-ai/web-llm@0.2.80',
            'https://cdn.jsdelivr.net/npm/@mlc-ai/web-llm@0.2.80/+esm',
            'https://unpkg.com/@mlc-ai/web-llm@0.2.80/+esm'
        ];
        
        for (const url of cdnUrls) {
            try {
                const response = await fetch(url, { method: 'HEAD', mode: 'no-cors', timeout: 5000 });
                console.log(`  ✅ ${url} - erreichbar`);
            } catch (err) {
                console.warn(`  ⚠️ ${url} - nicht erreichbar: ${err.message}`);
            }
        }
    }

    /**
     * Überprüft DOM-Elemente
     */
    checkDOM() {
        const checks = {
            'WebLLM Toggle Button': document.getElementById('webllm-toggle-btn'),
            'Modal Styles (CSS)': this.checkCSSClass('webllm-modal-box'),
            'Loading Bar Styles': this.checkCSSClass('webllm-loading-container'),
        };

        Object.entries(checks).forEach(([name, result]) => {
            this.checks.dom.push({
                name,
                status: result ? '✅' : '❌',
                passed: !!result
            });
            if (!result) this.isValid = false;
        });
    }

    /**
     * Überprüft ob CSS-Klasse existiert
     */
    checkCSSClass(className) {
        const div = document.createElement('div');
        div.className = className;
        document.body.appendChild(div);
        const style = window.getComputedStyle(div);
        const result = style.display !== null;
        document.body.removeChild(div);
        return result;
    }

    /**
     * Überprüft Skripte & Objekte
     */
    checkScripts() {
        const checks = {
            'WebLLMIntegration Klasse': typeof WebLLMIntegration !== 'undefined',
            'WebLLM globale Instanz': typeof window.webLLMIntegration !== 'undefined',
            'WebLLMConfig vorhanden': typeof WebLLMConfig !== 'undefined',
            'MLCEngine in Config': typeof WebLLMConfig !== 'undefined' && WebLLMConfig.model,
        };

        Object.entries(checks).forEach(([name, result]) => {
            this.checks.scripts.push({
                name,
                status: result ? '✅' : '❌',
                passed: result
            });
            if (!result) this.isValid = false;
        });
    }

    /**
     * Überprüft localStorage & IndexedDB
     */
    checkStorage() {
        const checks = {
            'localStorage verfügbar': this.checkLocalStorage(),
            'IndexedDB verfügbar': this.checkIndexedDB(),
            'WebLLM State speicherbar': this.checkStateStorage(),
        };

        Object.entries(checks).forEach(([name, result]) => {
            this.checks.storage.push({
                name,
                status: result ? '✅' : '❌',
                passed: result
            });
            if (!result) this.isValid = false;
        });
    }

    checkLocalStorage() {
        try {
            localStorage.setItem('webllm_test', 'test');
            localStorage.removeItem('webllm_test');
            return true;
        } catch (e) {
            return false;
        }
    }

    checkIndexedDB() {
        return !!(window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB);
    }

    checkStateStorage() {
        try {
            const testState = { test: true };
            localStorage.setItem('webllm_state_test', JSON.stringify(testState));
            const retrieved = JSON.parse(localStorage.getItem('webllm_state_test'));
            localStorage.removeItem('webllm_state_test');
            return retrieved.test === true;
        } catch (e) {
            return false;
        }
    }

    /**
     * Überprüft Funktionalität
     */
    checkFeatures() {
        const webllm = window.webLLMIntegration;
        
        const checks = {
            'toggleMode Funktion': typeof webllm?.toggleMode === 'function',
            'generateResponse Funktion': typeof webllm?.generateResponse === 'function',
            'clearCache Funktion': typeof webllm?.clearCache === 'function',
            'showWarningModal Funktion': typeof webllm?.showWarningModal === 'function',
            'updateProgress Funktion': typeof webllm?.updateProgress === 'function',
        };

        Object.entries(checks).forEach(([name, result]) => {
            this.checks.features.push({
                name,
                status: result ? '✅' : '❌',
                passed: result
            });
            if (!result) this.isValid = false;
        });
    }

    /**
     * Gibt einen schönen Report aus
     */
    printReport() {
        const sections = [
            { title: '🏗️ DOM-Struktur', items: this.checks.dom },
            { title: '📦 Skripte & Objekte', items: this.checks.scripts },
            { title: '💾 Speicher', items: this.checks.storage },
            { title: '⚙️ Funktionen', items: this.checks.features },
        ];

        let allPassed = 0;
        let allFailed = 0;

        console.log('\n' + '='.repeat(60));
        console.log('%c📋 WebLLM Validation Report', 'color: #a855f7; font-weight: bold; font-size: 16px;');
        console.log('='.repeat(60) + '\n');

        sections.forEach(section => {
            console.log(`%c${section.title}`, 'color: #a855f7; font-weight: bold; font-size: 12px;');
            section.items.forEach(item => {
                console.log(`${item.status} ${item.name}`);
                if (item.passed) allPassed++;
                else allFailed++;
            });
            console.log('');
        });

        const total = allPassed + allFailed;
        const percentage = ((allPassed / total) * 100).toFixed(1);
        
        console.log('='.repeat(60));
        console.log(`%c✅ ${allPassed}/${total} Checks bestanden (${percentage}%)`, 
            this.isValid ? 'color: #10b981; font-weight: bold;' : 'color: #ef4444; font-weight: bold;'
        );
        
        if (this.isValid) {
            console.log('%c🚀 WebLLM Integration ist vollständig und bereit!', 'color: #10b981; font-weight: bold;');
        } else {
            console.log('%c⚠️ Fehler gefunden! Siehe oben für Details.', 'color: #ef4444; font-weight: bold;');
        }
        console.log('='.repeat(60) + '\n');

        return this.isValid;
    }

    /**
     * Gibt Debugging-Informationen aus
     */
    printDebug() {
        console.log('\n%c🔧 WebLLM Debug-Informationen', 'color: #a855f7; font-weight: bold; font-size: 14px;');
        
        const webllm = window.webLLMIntegration;
        
        console.log('📊 State:');
        console.log('  isWebLLMActive:', webllm?.isWebLLMActive);
        console.log('  isLoading:', webllm?.isLoading);
        console.log('  model:', webllm?.model);
        console.log('  engine:', webllm?.engine ? 'initialisiert' : 'nicht initialisiert');
        
        console.log('\n📝 Konversationsverlauf:');
        console.log('  Länge:', webllm?.conversationHistory?.length || 0);
        console.log('  Letzte Nachricht:', webllm?.conversationHistory?.[webllm.conversationHistory.length - 1]?.content?.substring(0, 50) + '...' || 'keine');
        
        console.log('\n💾 Storage:');
        const webllmState = localStorage.getItem('webllm_state');
        console.log('  localStorage.webllm_state:', webllmState ? '✅ gespeichert' : '❌ nicht gefunden');
        if (webllmState) {
            const state = JSON.parse(webllmState);
            console.log('    - isActive:', state.isActive);
            console.log('    - history length:', state.history?.length || 0);
        }
        
        console.log('\n⚙️ Config:');
        console.log('  Modell:', WebLLMConfig?.model);
        console.log('  Max Tokens:', WebLLMConfig?.chat?.maxTokens);
        console.log('  Cache enabled:', WebLLMConfig?.cache?.enabled);
        console.log('  Debug mode:', WebLLMConfig?.debug);
        
        console.log('\n');
    }

    /**
     * Bereitet Testdaten vor (nur für Testing)
     */
    setupTestData() {
        console.log('%c🧪 Richte Test-Daten auf...', 'color: #f59e0b; font-weight: bold;');
        
        const testState = {
            isActive: false,
            history: [
                { role: 'user', content: 'Test Nachricht' },
                { role: 'assistant', content: 'Test Antwort' }
            ]
        };
        
        localStorage.setItem('webllm_state', JSON.stringify(testState));
        console.log('✅ Test-Daten gespeichert');
    }

    /**
     * Simuliert WebLLM-Aktivierung (nur für Testing)
     */
    simulateLoad() {
        console.log('%c🚀 Simuliere WebLLM-Laden...', 'color: #f59e0b; font-weight: bold;');
        
        const webllm = window.webLLMIntegration;
        webllm.isLoading = true;
        
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 30;
            if (progress >= 100) {
                webllm.isLoading = false;
                webllm.isWebLLMActive = true;
                clearInterval(interval);
                console.log('✅ Simulation abgeschlossen');
            } else {
                webllm.updateProgress(progress, `Simuliertes Laden... ${Math.round(progress)}%`);
            }
        }, 500);
    }
}

// Globale Instanz
window.webLLMValidator = new WebLLMValidator();

// Auto-Run bei Page Load (optional)
window.addEventListener('load', () => {
    // Nur bei Debug=true auführen
    if (typeof WebLLMConfig !== 'undefined' && WebLLMConfig.debug) {
        window.webLLMValidator.runAll();
        window.webLLMValidator.printDebug();
    }
});

// Console-Helper
console.log('%c💡 WebLLM Validator verfügbar: window.webLLMValidator', 'color: #64748b;');
console.log('%c   - runAll() - Führe alle Tests durch', 'color: #64748b;');
console.log('%c   - printDebug() - Zeige Debug-Infos', 'color: #64748b;');
console.log('%c   - setupTestData() - Erstelle Test-Daten', 'color: #64748b;');
console.log('%c   - simulateLoad() - Simuliere WebLLM-Laden', 'color: #64748b;');
