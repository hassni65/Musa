# Stage 1: Frontend bauen
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

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
COPY --from=frontend-builder /app/backend/static ./static

EXPOSE 8000

CMD ["python", "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
