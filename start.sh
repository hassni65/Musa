#!/bin/bash
# Lernplan-Generator starten + ngrok-Tunnel öffnen

# Prüfe ob ANTHROPIC_API_KEY gesetzt ist
if [ -z "$ANTHROPIC_API_KEY" ]; then
  echo "Fehler: ANTHROPIC_API_KEY nicht gesetzt."
  echo "Führe aus: export ANTHROPIC_API_KEY=sk-ant-..."
  exit 1
fi

# Prüfe ob ngrok installiert ist
if ! command -v ngrok &> /dev/null; then
  echo "ngrok nicht gefunden. Installiere es von: https://ngrok.com/download"
  exit 1
fi

echo "==> Backend starten..."
cd backend
pip install -r requirements.txt -q
uvicorn main:app --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!
cd ..

echo "==> Frontend bauen und starten..."
cd frontend
npm install -q
npm run dev -- --host &
FRONTEND_PID=$!
cd ..

echo "==> Warte kurz bis Services bereit sind..."
sleep 4

echo "==> ngrok-Tunnel für Frontend (Port 5173) öffnen..."
ngrok http 5173 &
NGROK_PID=$!

echo ""
echo "✅ App läuft!"
echo "   Lokale URL:  http://localhost:5173"
echo "   iPad-URL:    → ngrok-URL im Browser unter http://localhost:4040 nachschauen"
echo ""
echo "Drücke Ctrl+C zum Beenden."

# Aufräumen beim Beenden
trap "kill $BACKEND_PID $FRONTEND_PID $NGROK_PID 2>/dev/null" EXIT
wait
