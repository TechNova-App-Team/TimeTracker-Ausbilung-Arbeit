# WebLLM Integration v1.0

Eine vollständige Integration von WebLLM (MLCEngine) in deine TimeTracker-App mit nahtlosem Umschalten zwischen lokalem AI-Bot und browsergestütztem LLM.

## 🎯 Features

### 1. **Modell-Umschaltung**
- Button in der Header-Navigation zum Wechsel zwischen lokalem Bot und WebLLM
- Visuelles Feedback für aktiven Modus (Button-Farbe ändert sich)
- Schneller, einfacher Switch ohne Neustart

### 2. **Warnungs-Modal**
Benutzer werden vor der Aktivierung informiert:
- ⏱️ Erstes Laden dauert 2-5 Minuten
- 📦 ~800 MB Speicherverbrauch
- 💻 CPU-intensive Verarbeitung erforderlich
- ✅ Danach schneller Zugriff aus Cache

### 3. **Ladebalken mit Fortschritt**
- Visueller Fortschrittsbalken während des Modell-Downloads
- Live-Statusmeldungen (z.B. "Modell wird heruntergeladen...")
- Prozentanzeige und Zeitangabe
- Smooth Animations

### 4. **Browser Cache (IndexedDB)**
- Automatisches Speichern des geladenen Modells
- Beim nächsten Besuch sofort verfügbar (viel schneller!)
- Keine Wiederholung des Downloads
- Basis auf [WebLLM Caching](https://mlc.ai/mlc-llm/)

## 📁 Dateistruktur

```
Assets/js/
├── webllm-integration.js  ← Neue Integration
index.html
├── CSS für WebLLM Komponenten (inline)
├── Script-Referenz zu webllm-integration.js
└── Aktualisierte sendAIBotMessage() Funktion
```

## 🚀 Verwendung

### Button klicken
```
[🤖 Lokaler Bot] ← Click hier um zu WebLLM zu wechseln
```

### Warnung bestätigen
```
Dialog erscheint:
"Achtung: Lädt ca. 800MB Daten..."
[Abbrechen] [Ja, aktivieren]
```

### Während des Ladens
```
Ladebalken wird angezeigt:
🚀 WebLLM wird geladen...
[████████░░░░░░░░░░░░░░░] 35%
Lädt Modell (0/4000)...
```

### Nach erfolgreichem Laden
```
Button ändert Farbe:
[🧠 WebLLM (aktiv)] ← Gradient-Hintergrund
Chat-Nachrichten verwenden nun das WebLLM-Modell
```

## ⚙️ Technische Details

### Modell
- **Name**: Llama-3.2-1B-Instruct-q4f32_1
- **Größe**: ~800 MB (quantisiert)
- **Kontext**: 2048 Tokens
- **Latenz**: ~1-3 Sekunden pro Antwort (abhängig vom Device)

### APIs
- **[MLCEngine](https://mlc.ai/mlc-llm/)** - Browser-basiertes LLM-Engine
- **IndexedDB** - Lokale Persistierung
- **localStorage** - State-Management

### Integration in `sendAIBotMessage()`
```javascript
if (window.webLLMIntegration.isWebLLMActive) {
    // Nutze WebLLM
    await window.webLLMIntegration.generateResponse(message)
} else {
    // Nutze lokalen AI-Bot
    aiBotEnginePro.generateResponse(message)
}
```

## 🔒 Sicherheit & Datenschutz

✅ **100% lokal** - Keine Daten verlassen den Browser
✅ **Keine API-Aufrufe** - Alles läuft im Browser
✅ **Privat** - Nur deine Daten, keine Cloud
✅ **Offline-fähig** - Funktioniert ohne Internet (nach initialem Laden)

## 📊 Cache-Verwaltung

### Cache Locations
- **IndexedDB** - WebLLM Modell-Daten
- **localStorage** - WebLLM State & Konversationsverlauf

### Cache löschen
```javascript
// Manuell über DevTools-Konsole:
window.webLLMIntegration.clearCache()
```

Oder Browser-Cache über DevTools -> Application -> IndexedDB

## 🎨 UI Komponenten

### Styles
- **CSS-Variablen** nutzen vorhandene Design-Systeme
- **Responsive** - Mobile und Desktop optimiert
- **Animations** - Smooth Übergänge und Ladespinner
- **Accessibility** - Keyboard-Support und ARIA-Labels

### Dark Mode
- Standardmäßig auf Dark Theme ausgelegt
- `--bg-glass`, `--primary`, `--text-main` Variablen

## 🛠️ Entwickler-Notes

### Installation
1. `webllm-integration.js` muss nach Supabase-Config geladen werden
2. `index.html` enthält alle CSS-Stile inline (für Offline-Support)
3. Button wird automatisch initialisiert durch die Klasse-Instanz

### State Persistence
```javascript
localStorage.getItem('webllm_state')
// {
//   isActive: boolean,
//   history: array
// }
```

### Fehlerbehandlung
- Try-Catch in `generateResponse()` fängt Errors ab
- Benutzer sehen Fehlermeldungen in Chat
- Console-Logs für Debugging verfügbar

## ⚡ Performance

| Operation | Zeit | Cache? |
|-----------|------|--------|
| Erstes Laden | 2-5 Min | Nein |
| Nachfolgende Starts | <5 Sek | Ja |
| Generiere Antwort | 1-3 Sek | N/A |
| Chat-Switch | <100ms | N/A |

## 🐛 Bekannte Limitationen

- **Speicher**: Benötigt mindestens 1-2 GB freien RAM
- **Browser**: Chrome/Edge/Firefox (neueste Versionen)
- **Mobile**: Funktioniert, aber ressourcenintensiv
- **Modell-Größe**: 1B Parameter = schnell aber weniger komplex

## 📚 Weitere Ressourcen

- [WebLLM Dokumentation](https://mlc.ai/mlc-llm/docs/get_started/webllm.html)
- [MLCEngine API Referenz](https://mlc.ai/mlc-llm/docs/api/python.html)
- [Lokale LLM Modelle](https://huggingface.co/models?library=gguf&sort=downloads)

## 🔄 Zukünftige Verbesserungen

- [ ] Modellwahl (Llama 7B, Mistral, etc.)
- [ ] Streaming-Antworten
- [ ] Konversationsverlauf Export
- [ ] Custom System Prompts
- [ ] Multi-Language Support

---

**Version**: 1.0  
**Letzte Aktualisierung**: Januar 2026  
**Status**: Production Ready ✅
