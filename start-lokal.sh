#!/bin/bash

GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}"
echo "╔══════════════════════════════════════╗"
echo "║   Lernplan-Generator – Komplett lokal ║"
echo "╚══════════════════════════════════════╝"
echo -e "${NC}"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
FEHLER=0

# ── Node.js ──────────────────────────────────────────────────────────────────
if ! command -v node &>/dev/null; then
  echo -e "${YELLOW}Node.js fehlt.${NC}"
  echo "Bitte installiere Node.js von: https://nodejs.org/de"
  echo "Lade die LTS-Version (.pkg) herunter und installiere sie."
  echo ""
  echo "Danach dieses Skript erneut starten."
  open "https://nodejs.org/de" 2>/dev/null
  FEHLER=1
else
  echo -e "${GREEN}✓ Node.js $(node --version)${NC}"
fi

# ── Python ────────────────────────────────────────────────────────────────────
if ! command -v python3 &>/dev/null; then
  echo -e "${YELLOW}Python fehlt.${NC}"
  echo "Bitte installiere Python von: https://www.python.org/downloads/"
  open "https://www.python.org/downloads/" 2>/dev/null
  FEHLER=1
else
  echo -e "${GREEN}✓ Python $(python3 --version)${NC}"
fi

# ── Ollama ────────────────────────────────────────────────────────────────────
if ! command -v ollama &>/dev/null; then
  echo -e "${YELLOW}Ollama fehlt.${NC}"
  echo "Bitte installiere Ollama von: https://ollama.com/download"
  echo "Nach der Installation Ollama einmal starten, dann dieses Skript neu starten."
  open "https://ollama.com/download" 2>/dev/null
  FEHLER=1
else
  echo -e "${GREEN}✓ Ollama$(ollama --version 2>/dev/null | grep -o ' [0-9.]*' | head -1)${NC}"
fi

if [ "$FEHLER" -eq 1 ]; then
  echo ""
  echo -e "${RED}Bitte fehlende Programme installieren und dieses Skript erneut starten.${NC}"
  exit 1
fi

# ── Python-Pakete ─────────────────────────────────────────────────────────────
echo "==> Python-Pakete installieren..."
pip3 install -q fastapi "uvicorn[standard]" python-multipart pdfplumber PyPDF2 requests python-dotenv
echo -e "${GREEN}✓ Python-Pakete${NC}"

# ── Frontend-Pakete ───────────────────────────────────────────────────────────
echo "==> Frontend-Pakete installieren..."
cd "$SCRIPT_DIR/frontend"
npm install --silent
cd "$SCRIPT_DIR"
echo -e "${GREEN}✓ Frontend-Pakete${NC}"

# ── Ollama starten ────────────────────────────────────────────────────────────
echo "==> Ollama starten..."
ollama serve &>/tmp/ollama.log &
sleep 3

# ── Modell laden ─────────────────────────────────────────────────────────────
MODEL="llama3.2:1b"
if ! ollama list 2>/dev/null | grep -q "llama3.2:1b"; then
  echo -e "${YELLOW}==> KI-Modell wird heruntergeladen (~1.3 GB, nur einmalig)...${NC}"
  ollama pull $MODEL
fi
echo -e "${GREEN}✓ Modell bereit${NC}"

# ── Backend starten ───────────────────────────────────────────────────────────
echo "==> Backend starten..."
cd "$SCRIPT_DIR/backend"
python3 -m uvicorn main:app --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!
cd "$SCRIPT_DIR"
sleep 2
echo -e "${GREEN}✓ Backend läuft${NC}"

# ── Frontend starten ──────────────────────────────────────────────────────────
echo "==> Frontend starten..."
cd "$SCRIPT_DIR/frontend"
npm run dev -- --host &
FRONTEND_PID=$!
cd "$SCRIPT_DIR"
sleep 3

# ── IP-Adresse ermitteln ──────────────────────────────────────────────────────
LOCAL_IP=$(ipconfig getifaddr en0 2>/dev/null \
  || ipconfig getifaddr en1 2>/dev/null \
  || echo "DEINE-IP")

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  ✅ App läuft!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "  💻 MacBook:  ${BLUE}http://localhost:5173${NC}"
echo -e "  📱 iPad:     ${BLUE}http://${LOCAL_IP}:5173${NC}"
echo ""
echo -e "  MacBook und iPad müssen im selben WLAN sein."
echo ""
echo "Drücke Ctrl+C zum Beenden."

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo 'Beendet.'" EXIT INT TERM
wait
