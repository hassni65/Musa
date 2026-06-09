#!/bin/bash
set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}"
echo "╔══════════════════════════════════════╗"
echo "║     Lernplan-Generator (Lokal)       ║"
echo "╚══════════════════════════════════════╝"
echo -e "${NC}"

# API Key abfragen
if [ -z "$ANTHROPIC_API_KEY" ]; then
  echo -e "${BLUE}Anthropic API-Schlüssel eingeben (von console.anthropic.com):${NC}"
  read -r -s ANTHROPIC_API_KEY
  export ANTHROPIC_API_KEY
  echo ""
fi

if [ -z "$ANTHROPIC_API_KEY" ]; then
  echo -e "${RED}Fehler: Kein API-Schlüssel eingegeben.${NC}"
  exit 1
fi

# Abhängigkeiten prüfen & installieren
echo "==> Pakete prüfen..."
pip3 install -q fastapi uvicorn python-multipart pdfplumber PyPDF2 anthropic python-dotenv
cd "$(dirname "$0")/frontend" && npm install --silent && cd ..
echo -e "${GREEN}✓ Alles installiert${NC}"

# Lokale IP-Adresse ermitteln
LOCAL_IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || echo "localhost")

# Backend starten
echo "==> Backend starten..."
cd "$(dirname "$0")/backend"
uvicorn main:app --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!
cd ..
sleep 2
echo -e "${GREEN}✓ Backend läuft${NC}"

# Frontend starten
echo "==> Frontend starten..."
cd "$(dirname "$0")/frontend"
npm run dev -- --host &
FRONTEND_PID=$!
cd ..
sleep 3

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  App läuft!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "  MacBook:  ${BLUE}http://localhost:5173${NC}"
echo -e "  iPad:     ${BLUE}http://${LOCAL_IP}:5173${NC}  ← diese URL im Safari eingeben"
echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "Drücke Ctrl+C zum Beenden."

trap "echo ''; echo 'Beende...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null" EXIT INT TERM
wait
