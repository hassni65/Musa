# Lernplan-Generator

Eine Full-Stack-Web-App, die aus PDF-Dateien strukturierte Lernpläne mit Hilfe der Claude KI generiert.

## Voraussetzungen

- Python 3.9+
- Node.js 18+
- Anthropic API-Schlüssel

## Setup

### Backend

```bash
cd backend
pip install -r requirements.txt
export ANTHROPIC_API_KEY=dein_api_schlüssel
uvicorn main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Die App ist dann unter http://localhost:5173 erreichbar.

## Nutzung

1. PDF hochladen (bis 20 MB)
2. Extrahierten Text prüfen und Dokumenttitel anpassen
3. Lernplan generieren – Claude analysiert den Inhalt und erstellt:
   - Themenübersicht mit Zeitschätzungen
   - Wochenplan
   - Meilensteine
   - Lernressourcen
   - Lerntipps
4. Lernplan als JSON herunterladen oder in die Zwischenablage kopieren

## Architektur

- **Frontend**: React + Vite + Tailwind CSS (Port 5173)
- **Backend**: Python FastAPI (Port 8000)
- **KI**: Anthropic Claude (`claude-sonnet-4-6`)
- **PDF-Extraktion**: pdfplumber (primär), PyPDF2 (Fallback)
