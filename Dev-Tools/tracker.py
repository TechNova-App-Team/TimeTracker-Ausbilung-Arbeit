import os
import sys
from collections import defaultdict

# --- Konfiguration ---
# Ordner, die fast immer ignoriert werden sollen (z.B. große Abhängigkeitsordner oder VCS)
EXCLUDED_FOLDERS = ('.git', '.venv', 'node_modules', '.idea', '__pycache__', 'dist', 'build', 'temp', 'vendor')

# Dateiendungen, die fast immer binär oder unwichtig sind (keine Code- oder Textdateien)
EXCLUDED_EXTENSIONS = ('.pyc', '.zip', '.png', '.jpg', '.jpeg', '.gif', '.pdf', '.exe', '.ico', '.lock', '.svg', '.woff', '.ttf', '.eot')

def count_project_stats(root_dir="."):
    """
    Zählt rekursiv Zeilen und Zeichen, aggregiert nach Dateiendung und identifiziert Top-Dateien.
    
    Returns:
        tuple: (total_lines, total_chars, stats_by_extension, top_10_files)
    """
    total_lines = 0
    total_chars = 0
    
    # Speichert Zähler pro Dateiendung: {'html': (lines, chars, count)}
    stats_by_extension = defaultdict(lambda: [0, 0, 0])
    
    # Speichert Informationen für die Top-Liste: [(lines, filepath), ...]
    top_files_list = []
    
    # os.walk geht rekursiv durch alle Verzeichnisse
    for dirpath, dirnames, filenames in os.walk(root_dir):
        # Ordner von der Rekursion ausschließen
        dirnames[:] = [d for d in dirnames if d not in EXCLUDED_FOLDERS]
        
        for filename in filenames:
            # Ignoriere ausgeschlossene Dateiendungen
            file_extension = os.path.splitext(filename)[1].lower()
            if file_extension in EXCLUDED_EXTENSIONS or filename.startswith('.'):
                continue
            
            filepath = os.path.join(dirpath, filename)
            
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                    
                    lines = content.count('\n') + 1
                    chars = len(content)
                    
                    # 1. Globale Zähler aktualisieren
                    total_lines += lines
                    total_chars += chars
                    
                    # 2. Statistik nach Erweiterung aktualisieren
                    stats_by_extension[file_extension][0] += lines
                    stats_by_extension[file_extension][1] += chars
                    stats_by_extension[file_extension][2] += 1
                    
                    # 3. Top-Liste aktualisieren
                    top_files_list.append((lines, filepath.replace(root_dir, '...')))
                    
            except UnicodeDecodeError:
                # Binäre oder nicht lesbare Dateien leise überspringen
                pass
            except Exception as e:
                print(f"Warnung: Fehler beim Lesen von {filepath}")

    # Sortiere die Top-Liste absteigend und nimm die ersten 10
    top_10_files = sorted(top_files_list, key=lambda x: x[0], reverse=True)[:10]
    
    return total_lines, total_chars, stats_by_extension, top_10_files

def format_number(num):
    """Gibt eine Zahl mit Tausender-Trennzeichen als String zurück (z.B. 123.456)."""
    return f"{num:,}".replace(",", ".")

# --- Hauptteil des Skripts und Ausgabe ---
if __name__ == "__main__":
    # Ermittelt den Startpfad: entweder das erste Argument oder der aktuelle Ordner
    if len(sys.argv) > 1:
        project_path = sys.argv[1]
    else:
        project_path = "."
        
    print(f"✨ Starte erweiterte Code-Analyse in: {os.path.abspath(project_path)}\n")
    
    lines, chars, extension_stats, top_files = count_project_stats(project_path)
    
    print("======================================================")
    print("          📊 Projektzusammenfassung (LoC) 📊           ")
    print("======================================================")
    print(f"Gesamte Zeilen (LoC): **{format_number(lines)}**")
    print(f"Gesamte Zeichen:      **{format_number(chars)}**")
    print("------------------------------------------------------")

    ## 1. Statistik nach Dateityp (Extension Summary)
    print("\n### 📋 Statistik nach Dateityp (Top 5)")
    
    # Sortiere nach Zeilenanzahl absteigend
    sorted_stats = sorted(extension_stats.items(), key=lambda item: item[1][0], reverse=True)
    
    # Erstelle eine formatierte Tabelle
    print("Erweiterung | Dateien | Zeilen (LoC) | % des Gesamten")
    print("------------|---------|--------------|---------------")
    
    for i, (ext, (ext_lines, ext_chars, ext_count)) in enumerate(sorted_stats):
        if ext == '':
            ext_display = "(Ohne Endung)"
        else:
            ext_display = ext
            
        percentage = (ext_lines / lines) * 100 if lines > 0 else 0
        
        print(f"{ext_display.ljust(11)} | {str(ext_count).center(7)} | {format_number(ext_lines).ljust(12)} | {percentage:.2f}%")
        
        if i >= 4: # Zeige maximal 5 Dateitypen an
            break
            
    ## 2. Top 10 Größte Dateien
    print("\n### 🏆 Top 10 größte Dateien (nach Zeilenanzahl)")
    
    if top_files:
        print("Zeilen (LoC) | Pfad")
        print("-------------|-------------------------------------------------------")
        for file_lines, filepath in top_files:
            print(f"{format_number(file_lines).ljust(12)} | {filepath}")
    else:
        print("Keine relevanten Dateien gefunden.")
        
    print("\n======================================================")