/**
 * WebLLM Integration v1.0
 * Ermöglicht Umschaltung zwischen lokalem AI-Bot und browsergestütztem WebLLM
 * Mit IndexedDB Caching und Ladebalken-UI
 */

class WebLLMIntegration {
    constructor() {
        this.engine = null;
        this.isLoading = false;
        this.isWebLLMActive = false;
        // Nutze Config wenn verfügbar, sonst Fallback
        this.model = (typeof WebLLMConfig !== 'undefined' && WebLLMConfig.model) 
            ? WebLLMConfig.model 
            : 'Llama-3.2-1B-Instruct-q4f32_1';
        this.conversationHistory = [];
        this.loadState();
        this.logDebug('WebLLM Integration initialisiert');
    }

    /**
     * Debug-Logging (wenn aktiviert)
     */
    logDebug(message, data = null) {
        const debug = typeof WebLLMConfig !== 'undefined' && WebLLMConfig.debug;
        if (debug) {
            console.log('[WebLLM Debug]', message, data || '');
        }
    }

    /**
     * Lädt den State aus localStorage
     */
    loadState() {
        try {
            const saved = localStorage.getItem('webllm_state');
            if (saved) {
                const state = JSON.parse(saved);
                this.isWebLLMActive = state.isActive;
                this.conversationHistory = state.history || [];
            }
        } catch (e) {
            console.warn('[WebLLM] Fehler beim Laden des States:', e);
        }
    }

    /**
     * Speichert den aktuellen State
     */
    saveState() {
        localStorage.setItem('webllm_state', JSON.stringify({
            isActive: this.isWebLLMActive,
            history: this.conversationHistory
        }));
    }

    /**
     * Zeigt ein Warnung-Modal vor dem Laden von WebLLM
     */
    showWarningModal() {
        return new Promise((resolve) => {
            const modal = document.createElement('div');
            modal.className = 'webllm-warning-modal';
            modal.innerHTML = `
                <div class="webllm-modal-overlay" onclick="if(event.target === this) this.parentElement.remove()"></div>
                <div class="webllm-modal-box">
                    <div class="webllm-modal-header">
                        <h2>⚠️ WebLLM aktivieren?</h2>
                        <button class="webllm-close-btn" onclick="this.closest('.webllm-warning-modal').remove()">×</button>
                    </div>
                    <div class="webllm-modal-content">
                        <p>Beim ersten Laden werden etwa <strong>800 MB</strong> Daten in den Browser-Cache heruntergeladen.</p>
                        <ul>
                            <li>⏱️ Erstes Laden: 2-5 Minuten</li>
                            <li>📦 Speicherverbrauch: ~800 MB</li>
                            <li>💻 CPU-intensive Verarbeitung</li>
                            <li>✅ Danach im lokalen Cache verfügbar</li>
                        </ul>
                        <p style="color: var(--text-muted); font-size: 0.9rem; margin-top: 1rem;">
                            Das Modell bleibt nach dem Laden im IndexedDB Cache, sodass es beim nächsten Besuch viel schneller startet.
                        </p>
                    </div>
                    <div class="webllm-modal-actions">
                        <button class="webllm-btn-secondary" onclick="this.closest('.webllm-warning-modal').remove()">
                            Abbrechen
                        </button>
                        <button class="webllm-btn-primary" id="webllmConfirmBtn">
                            Ja, aktivieren
                        </button>
                    </div>
                </div>
            `;

            document.body.appendChild(modal);

            document.getElementById('webllmConfirmBtn').onclick = () => {
                modal.remove();
                resolve(true);
            };

            // Falls Modal geschlossen wird
            modal.querySelector('.webllm-close-btn').onclick = () => {
                resolve(false);
            };

            modal.querySelector('.webllm-modal-overlay').onclick = (e) => {
                if (e.target === modal.querySelector('.webllm-modal-overlay')) {
                    resolve(false);
                }
            };
        });
    }

    /**
     * Zeigt einen Ladebalken während WebLLM geladen wird
     */
    showLoadingBar() {
        const container = document.createElement('div');
        container.id = 'webllm-loading-container';
        container.className = 'webllm-loading-container';
        container.innerHTML = `
            <div class="webllm-loading-box">
                <div class="webllm-loading-icon">🚀</div>
                <h3>WebLLM wird geladen...</h3>
                <p id="webllm-loading-status">Modell wird heruntergeladen...</p>
                <div class="webllm-progress-bar">
                    <div class="webllm-progress-fill" id="webllm-progress"></div>
                </div>
                <p class="webllm-progress-text">
                    <span id="webllm-progress-percent">0%</span> • 
                    <span id="webllm-loading-time">0s</span>
                </p>
            </div>
        `;

        document.body.appendChild(container);
        return container;
    }

    /**
     * Aktualisiert den Ladebalken
     */
    updateProgress(percent, message = null) {
        const bar = document.getElementById('webllm-progress');
        const percentText = document.getElementById('webllm-progress-percent');

        if (bar) bar.style.width = percent + '%';
        if (percentText) percentText.textContent = Math.round(percent) + '%';
        if (message) {
            const status = document.getElementById('webllm-loading-status');
            if (status) status.textContent = message;
        }
    }

    /**
     * Entfernt den Ladebalken
     */
    removeLoadingBar() {
        const container = document.getElementById('webllm-loading-container');
        if (container) {
            container.style.opacity = '0';
            setTimeout(() => container.remove(), 300);
        }
    }

    /**
     * Lädt WebLLM und initialisiert das Modell
     */
    async loadWebLLM() {
        if (this.isLoading || this.isWebLLMActive) return;

        const confirmed = await this.showWarningModal();
        if (!confirmed) return;

        this.isLoading = true;
        const startTime = Date.now();
        this.showLoadingBar();

        try {
            // Lade WebLLM Bibliothek
            if (!window.mlc) {
                this.updateProgress(10, 'Läde WebLLM Bibliothek...');
                await this.loadScript('https://cdn.jsdelivr.net/npm/@mlc-ai/web-llm@0.2.10/dist/web-llm.js');
            }

            this.updateProgress(30, 'Initialisiere Modell...');

            // Initialisiere MLCEngine
            const { MLCEngine } = window.mlc;
            this.engine = new MLCEngine({
                model: this.model,
                logitProcessor: 'top_p',
            });

            // Überwache den Loading-Prozess
            let lastProgress = 30;
            const progressInterval = setInterval(() => {
                if (this.engine && this.engine.getEngineProgress) {
                    const progress = this.engine.getEngineProgress();
                    if (progress.progress > lastProgress && progress.progress < 100) {
                        lastProgress = progress.progress;
                        const message = `Lädt Modell ${progress.text}...`;
                        this.updateProgress(lastProgress, message);
                    }
                }
            }, 500);

            // Warte auf vollständiges Laden
            await this.engine.ready;
            clearInterval(progressInterval);

            this.updateProgress(100, 'WebLLM ist bereit!');
            this.isWebLLMActive = true;
            this.saveState();

            // Entferne Ladebalken nach kurzer Verzögerung
            setTimeout(() => {
                this.removeLoadingBar();
                this.showSuccessMessage();
                this.isLoading = false;
            }, 500);

        } catch (error) {
            console.error('[WebLLM] Fehler beim Laden:', error);
            this.removeLoadingBar();
            this.showErrorMessage(error.message);
            this.isLoading = false;
        }
    }

    /**
     * Lädt ein externes Script
     */
    loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    /**
     * Generiert eine Antwort mit WebLLM
     */
    async generateResponse(userMessage) {
        if (!this.isWebLLMActive || !this.engine) {
            return 'WebLLM ist nicht aktiv. Bitte aktiviere es zuerst.';
        }

        try {
            this.conversationHistory.push({
                role: 'user',
                content: userMessage
            });

            // Prepare prompt mit Konversationsverlauf
            const messages = this.conversationHistory.slice(-10); // Letzten 10 Messages

            // Generiere Antwort
            const response = await this.engine.chat.completions.create({
                messages: messages,
                max_tokens: 500,
                temperature: 0.7,
            });

            const assistantMessage = response.choices[0].message.content;

            this.conversationHistory.push({
                role: 'assistant',
                content: assistantMessage
            });

            this.saveState();
            return assistantMessage;

        } catch (error) {
            console.error('[WebLLM] Fehler bei Antwortgenerierung:', error);
            return `❌ Fehler bei der Antwortgenerierung: ${error.message}`;
        }
    }

    /**
     * Schaltet zwischen AI-Bot und WebLLM um
     */
    async toggleMode() {
        if (this.isWebLLMActive) {
            // Schalte zu lokalem Bot zurück
            this.isWebLLMActive = false;
            this.saveState();
            this.showCustomMessage('✅ Modus gewechselt', 'Zurück zum lokalen AI-Bot', 'success');
            this.updateButtonState();
        } else {
            // Lade WebLLM
            await this.loadWebLLM();
            this.updateButtonState();
        }
    }

    /**
     * Aktualisiert den Button-Status
     */
    updateButtonState() {
        const btn = document.getElementById('webllm-toggle-btn');
        if (btn) {
            btn.classList.toggle('active', this.isWebLLMActive);
            btn.setAttribute('aria-pressed', this.isWebLLMActive);
            btn.textContent = this.isWebLLMActive ? '🧠 WebLLM (aktiv)' : '🤖 Lokaler Bot';
            btn.title = this.isWebLLMActive 
                ? 'Klick um zum lokalen AI-Bot zu wechseln' 
                : 'Klick um WebLLM zu aktivieren';
        }
    }

    /**
     * Zeigt Erfolgsmeldung an
     */
    showSuccessMessage() {
        if (typeof showCustomMessage === 'function') {
            showCustomMessage(
                '✅ WebLLM erfolgreich geladen',
                'Das Modell ist nun im Browser-Cache verfügbar und wird beim nächsten Besuch schneller geladen.',
                'success'
            );
        }
    }

    /**
     * Zeigt Fehlermeldung an
     */
    showErrorMessage(error) {
        if (typeof showCustomMessage === 'function') {
            showCustomMessage(
                '❌ Fehler beim Laden',
                `WebLLM konnte nicht geladen werden: ${error}`,
                'danger'
            );
        }
    }

    /**
     * Gibt den aktuellen Modus zurück
     */
    getMode() {
        return this.isWebLLMActive ? 'webllm' : 'local';
    }

    /**
     * Löscht den Cache
     */
    async clearCache() {
        try {
            if (this.engine) {
                await this.engine.detach();
                this.engine = null;
            }
            this.isWebLLMActive = false;
            this.saveState();
            if (typeof showCustomMessage === 'function') {
                showCustomMessage('✅ Cache gelöscht', 'WebLLM Cache wurde geleert.', 'success');
            }
        } catch (error) {
            console.error('[WebLLM] Fehler beim Löschen des Cache:', error);
        }
    }
}

// Globale Instanz
window.webLLMIntegration = new WebLLMIntegration();

// Exportiere für externe Verwendung
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WebLLMIntegration;
}
