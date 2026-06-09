#!/bin/bash
set -e

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

# Homebrew
if ! command -v brew &>/dev/null; then
  echo "==> Homebrew installieren..."
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
  [ -f /opt/homebrew/bin/brew ] && eval "$(/opt/homebrew/bin/brew shellenv)"
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

# Ollama
if ! command -v ollama &>/dev/null; then
  echo "==> Ollama installieren..."
  brew install ollama
fi
echo -e "${GREEN}✓ Ollama installiert${NC}"

# Python-Pakete
echo "==> Python-Pakete installieren..."
pip3 install -q fastapi uvicorn python-multipart pdfplumber PyPDF2 requests python-dotenv
echo -e "${GREEN}✓ Python-Pakete${NC}"

# Frontend-Pakete
echo "==> Frontend-Pakete installieren..."
cd "$(dirname "$0")/frontend"
npm install --silent
cd ..
echo -e "${GREEN}✓ Frontend-Pakete${NC}"

# Ollama starten
echo "==> Ollama starten..."
ollama serve &>/tmp/ollama.log &
OLLAMA_PID=$!
sleep 3

# Modell prüfen / laden
MODEL="llama3.2:1b"
if ! ollama list 2>/dev/null | grep -q "llama3.2:1b"; then
  echo -e "${YELLOW}==> KI-Modell wird heruntergeladen (~1.3 GB, einmalig)...${NC}"
  ollama pull $MODEL
fi
echo -e "${GREEN}✓ Modell '$MODEL' bereit${NC}"

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

# Lokale IP ermitteln
LOCAL_IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || echo "DEINE-IP")

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  ✅ App läuft – kein Internet nötig!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "  💻 MacBook:  ${BLUE}http://localhost:5173${NC}"
echo -e "  📱 iPad:     ${BLUE}http://${LOCAL_IP}:5173${NC}"
echo ""
echo -e "  ℹ️  MacBook und iPad müssen im selben WLAN sein."
echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo "Drücke Ctrl+C zum Beenden."

trap "echo ''; echo 'Beende...'; kill $BACKEND_PID $FRONTEND_PID $OLLAMA_PID 2>/dev/null" EXIT INT TERM
wait
