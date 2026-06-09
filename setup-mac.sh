#!/bin/bash
set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}"
echo "╔══════════════════════════════════════╗"
echo "║     Lernplan-Generator Setup         ║"
echo "╚══════════════════════════════════════╝"
echo -e "${NC}"

# API Key abfragen
if [ -z "$ANTHROPIC_API_KEY" ]; then
  echo -e "${BLUE}Gib deinen Anthropic API-Schlüssel ein (von console.anthropic.com):${NC}"
  read -r -s ANTHROPIC_API_KEY
  export ANTHROPIC_API_KEY
  echo ""
fi

if [ -z "$ANTHROPIC_API_KEY" ]; then
  echo -e "${RED}Fehler: Kein API-Schlüssel eingegeben.${NC}"
  exit 1
fi

# Homebrew
if ! command -v brew &>/dev/null; then
  echo "==> Homebrew installieren..."
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
  # Apple Silicon
  if [ -f /opt/homebrew/bin/brew ]; then
    eval "$(/opt/homebrew/bin/brew shellenv)"
  fi
fi
echo -e "${GREEN}✓ Homebrew${NC}"

# Node.js
if ! command -v node &>/dev/null; then
  echo "==> Node.js installieren..."
  brew install node
fi
echo -e "${GREEN}✓ Node.js $(node --version)${NC}"

# Python
if ! command -v python3 &>/dev/null; then
  echo "==> Python installieren..."
  brew install python
fi
echo -e "${GREEN}✓ Python $(python3 --version)${NC}"

# ngrok
if ! command -v ngrok &>/dev/null; then
  echo "==> ngrok installieren..."
  brew install ngrok/ngrok/ngrok
fi
echo -e "${GREEN}✓ ngrok$(ngrok --version 2>/dev/null | head -1 | sed 's/ngrok//')${NC}"

# ngrok Token prüfen
if ! ngrok config check &>/dev/null 2>&1 || ! grep -q "authtoken" ~/.config/ngrok/ngrok.yml 2>/dev/null; then
  echo ""
  echo -e "${BLUE}ngrok Auth-Token eingeben (kostenlos auf ngrok.com → Your Authtoken):${NC}"
  read -r NGROK_TOKEN
  ngrok config add-authtoken "$NGROK_TOKEN"
fi
echo -e "${GREEN}✓ ngrok konfiguriert${NC}"

# Python-Abhängigkeiten
echo "==> Python-Pakete installieren..."
pip3 install -q fastapi uvicorn python-multipart pdfplumber PyPDF2 anthropic python-dotenv
echo -e "${GREEN}✓ Python-Pakete installiert${NC}"

# Frontend-Abhängigkeiten
echo "==> Frontend-Pakete installieren..."
cd "$(dirname "$0")/frontend"
npm install --silent
cd ..
echo -e "${GREEN}✓ Frontend-Pakete installiert${NC}"

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  Setup abgeschlossen! App wird gestartet...${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Backend starten
echo "==> Backend starten (Port 8000)..."
cd "$(dirname "$0")/backend"
uvicorn main:app --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!
cd ..

sleep 2

# Backend prüfen
if ! curl -s http://localhost:8000/health &>/dev/null; then
  echo -e "${RED}Backend konnte nicht gestartet werden.${NC}"
  kill $BACKEND_PID 2>/dev/null
  exit 1
fi
echo -e "${GREEN}✓ Backend läuft${NC}"

# Frontend starten
echo "==> Frontend starten (Port 5173)..."
cd "$(dirname "$0")/frontend"
npm run dev -- --host &
FRONTEND_PID=$!
cd ..

sleep 3

# ngrok starten
echo "==> ngrok-Tunnel öffnen..."
ngrok http 5173 --log=stdout > /tmp/ngrok.log 2>&1 &
NGROK_PID=$!

sleep 3

# ngrok-URL auslesen
NGROK_URL=$(curl -s http://localhost:4040/api/tunnels 2>/dev/null | python3 -c "import sys,json; data=json.load(sys.stdin); print(data['tunnels'][0]['public_url'])" 2>/dev/null)

echo ""
echo -e "${BLUE}╔══════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  App läuft!                                          ║${NC}"
echo -e "${BLUE}╠══════════════════════════════════════════════════════╣${NC}"
echo -e "${BLUE}║  MacBook:  http://localhost:5173                     ║${NC}"
if [ -n "$NGROK_URL" ]; then
echo -e "${BLUE}║  iPad:     ${NGROK_URL}${NC}"
else
echo -e "${BLUE}║  iPad-URL: http://localhost:4040 aufrufen            ║${NC}"
fi
echo -e "${BLUE}╚══════════════════════════════════════════════════════╝${NC}"
echo ""
echo "Drücke Ctrl+C zum Beenden."

trap "echo ''; echo 'Beende...'; kill $BACKEND_PID $FRONTEND_PID $NGROK_PID 2>/dev/null" EXIT INT TERM
wait
