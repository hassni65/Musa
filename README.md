# Lernplan-Generator

Eine Web-App, die aus PDF-Dateien strukturierte Lernpläne mit Claude KI generiert.

## Schnellstart (iPad via ngrok)

### 1. Voraussetzungen installieren
- [Node.js 18+](https://nodejs.org)
- [Python 3.9+](https://python.org)
- [ngrok](https://ngrok.com/download) + kostenloses Konto erstellen
- Anthropic API-Schlüssel: [console.anthropic.com](https://console.anthropic.com)

### 2. API-Schlüssel setzen
```bash
export ANTHROPIC_API_KEY=sk-ant-dein-schlüssel
```

### 3. App starten
```bash
chmod +x start.sh
./start.sh
```

### 4. iPad-URL herausfinden
Öffne im Browser: **http://localhost:4040**  
Dort steht die ngrok-URL, z.B. `https://abc123.ngrok-free.app`  
→ Diese URL auf dem iPad in Safari öffnen ✅

---

## Manueller Start (ohne start.sh)

```bash
# Terminal 1 – Backend
cd backend
pip install -r requirements.txt
export ANTHROPIC_API_KEY=sk-ant-...
uvicorn main:app --host 0.0.0.0 --port 8000 --reload

# Terminal 2 – Frontend
cd frontend
npm install
npm run dev -- --host

# Terminal 3 – ngrok
ngrok http 5173
```

---

## Nutzung

1. PDF hochladen (Drag & Drop, bis 20 MB)
2. Extrahierten Text prüfen, Titel anpassen
3. **„Lernplan generieren"** klicken
4. Plan in 5 Tabs ansehen: Übersicht · Themen · Wochenplan · Meilensteine · Ressourcen
5. Als JSON herunterladen oder kopieren

## Architektur

| Teil | Technologie |
|------|-------------|
| Frontend | React + Vite + Tailwind CSS |
| Backend | Python FastAPI |
| KI | Anthropic Claude (claude-sonnet-4-6) |
| PDF-Extraktion | pdfplumber + PyPDF2 (Fallback) |
| Tunnel | ngrok |
