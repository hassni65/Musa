#!/bin/bash

GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}"
echo "╔══════════════════════════════════════╗"
echo "║     ⚽  WM 2026 Tippspiel           ║"
echo "╚══════════════════════════════════════╝"
echo -e "${NC}"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# ── Node.js prüfen ────────────────────────────────────────────────────────────
if ! command -v node &>/dev/null; then
  echo -e "${RED}✗ Node.js fehlt.${NC}"
  echo "Bitte installieren: https://nodejs.org/de  (LTS-Version)"
  open "https://nodejs.org/de" 2>/dev/null
  exit 1
fi
echo -e "${GREEN}✓ Node.js $(node --version)${NC}"

# ── Abhängigkeiten installieren ───────────────────────────────────────────────
cd "$SCRIPT_DIR/frontend"
if [ ! -d "node_modules" ]; then
  echo "==> Pakete installieren (einmalig)..."
  npm install --silent
fi
echo -e "${GREEN}✓ Pakete bereit${NC}"

# ── IP-Adresse ermitteln ──────────────────────────────────────────────────────
LOCAL_IP=$(ipconfig getifaddr en0 2>/dev/null \
  || ipconfig getifaddr en1 2>/dev/null \
  || echo "DEINE-IP")

echo ""
echo -e "${GREEN}==> App startet ...${NC}"
echo ""
echo -e "  💻 MacBook:  ${BLUE}http://localhost:5173${NC}"
echo -e "  📱 iPhone:   ${BLUE}http://${LOCAL_IP}:5173${NC}"
echo ""
echo -e "  ${YELLOW}Tipp: Im iPhone Safari öffnen → Teilen → 'Zum Home-Bildschirm'${NC}"
echo -e "  ${YELLOW}→ App wird wie eine native App installiert!${NC}"
echo ""
echo "Drücke Ctrl+C zum Beenden."
echo ""

# ── Dev-Server starten ────────────────────────────────────────────────────────
npm run dev -- --host
