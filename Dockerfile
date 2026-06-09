# Stage 1: Frontend bauen
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
# Baue direkt in /app/static (nicht relativ zum Backend)
RUN npx vite build --outDir /app/static --emptyOutDir

# Stage 2: Python Backend + gebautes Frontend
FROM python:3.11-slim

WORKDIR /app

# System-Abhängigkeiten für pdfplumber
RUN apt-get update && apt-get install -y \
    libpoppler-cpp-dev \
    && rm -rf /var/lib/apt/lists/*

# Python-Abhängigkeiten
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Backend-Code
COPY backend/ ./

# Gebautes Frontend
COPY --from=frontend-builder /app/static ./static

EXPOSE 8000

CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"]
