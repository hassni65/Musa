# Lernplan-Generator (Komplett Lokal)

PDF hochladen → KI analysiert → Lernplan fertig. Läuft **komplett offline** auf deinem MacBook — kein API-Schlüssel, kein Internet nötig.

## Starten (MacBook)

```bash
git clone https://github.com/hassni65/Musa.git
cd Musa
git checkout claude/nice-gauss-d2u0y6
bash start-lokal.sh
```

Das Skript installiert automatisch alles:
- Node.js, Python, Ollama
- KI-Modell `llama3` (~4 GB, nur beim ersten Mal)

Am Ende zeigt es die URL für das iPad an.

## iPad

MacBook und iPad müssen im **selben WLAN** sein.  
Die angezeigte URL (z.B. `http://192.168.1.42:5173`) im Safari eingeben.

## Nutzung

1. PDF hochladen (bis 20 MB)
2. Text prüfen, Titel anpassen
3. „Lernplan generieren" klicken
4. Plan ansehen: Übersicht · Themen · Wochenplan · Meilensteine · Ressourcen
5. Als JSON herunterladen

## Technik

| Teil | Technologie |
|------|-------------|
| KI | Ollama + llama3 (lokal, offline) |
| Backend | Python FastAPI |
| Frontend | React + Vite + Tailwind CSS |
| PDF | pdfplumber + PyPDF2 |
