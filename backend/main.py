"""
PDF-basierter Lernplan-Generator - FastAPI Backend (Ollama / lokal)
"""

import os
import json
import logging
import requests
from io import BytesIO
from typing import Optional

import pdfplumber
import PyPDF2
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Lernplan-Generator API", version="1.0.0")

OLLAMA_URL = os.environ.get("OLLAMA_URL", "http://localhost:11434")
OLLAMA_MODEL = os.environ.get("OLLAMA_MODEL", "llama3")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class LernplanRequest(BaseModel):
    extracted_text: str
    document_title: Optional[str] = "Lernmaterial"


def extract_text_with_pdfplumber(pdf_bytes: bytes) -> str:
    text_parts = []
    with pdfplumber.open(BytesIO(pdf_bytes)) as pdf:
        for page_num, page in enumerate(pdf.pages, 1):
            page_text = page.extract_text()
            if page_text:
                text_parts.append(f"--- Seite {page_num} ---\n{page_text}")
    return "\n\n".join(text_parts)


def extract_text_with_pypdf2(pdf_bytes: bytes) -> str:
    text_parts = []
    reader = PyPDF2.PdfReader(BytesIO(pdf_bytes))
    for page_num, page in enumerate(reader.pages, 1):
        page_text = page.extract_text()
        if page_text:
            text_parts.append(f"--- Seite {page_num} ---\n{page_text}")
    return "\n\n".join(text_parts)


def ask_ollama(prompt: str) -> str:
    try:
        response = requests.post(
            f"{OLLAMA_URL}/api/generate",
            json={"model": OLLAMA_MODEL, "prompt": prompt, "stream": False},
            timeout=300,
        )
        response.raise_for_status()
        return response.json()["response"]
    except requests.exceptions.ConnectionError:
        raise HTTPException(
            status_code=503,
            detail="Ollama läuft nicht. Starte es mit: ollama serve"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ollama Fehler: {str(e)}")


@app.get("/health")
async def health_check():
    # Prüfe ob Ollama erreichbar ist
    try:
        r = requests.get(f"{OLLAMA_URL}/api/tags", timeout=3)
        models = [m["name"] for m in r.json().get("models", [])]
        return {"status": "ok", "ollama": "verbunden", "modelle": models}
    except Exception:
        return {"status": "ok", "ollama": "nicht erreichbar – starte: ollama serve"}


@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Nur PDF-Dateien werden unterstützt.")

    pdf_bytes = await file.read()

    if len(pdf_bytes) > 20 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Datei zu groß. Maximal 20 MB.")

    try:
        extracted_text = extract_text_with_pdfplumber(pdf_bytes)
        method_used = "pdfplumber"
    except Exception as e:
        logger.warning(f"pdfplumber fehlgeschlagen: {e}")
        try:
            extracted_text = extract_text_with_pypdf2(pdf_bytes)
            method_used = "PyPDF2"
        except Exception as e2:
            raise HTTPException(status_code=422, detail=f"Text konnte nicht extrahiert werden: {e2}")

    if not extracted_text.strip():
        raise HTTPException(
            status_code=422,
            detail="Kein Text gefunden. Die PDF könnte gescannt oder verschlüsselt sein."
        )

    preview = extracted_text[:2000] + ("..." if len(extracted_text) > 2000 else "")
    return {
        "filename": file.filename,
        "extracted_text": extracted_text,
        "preview": preview,
        "char_count": len(extracted_text),
        "method": method_used,
        "success": True,
    }


@app.post("/generate-plan")
async def generate_learning_plan(request: LernplanRequest):
    if not request.extracted_text.strip():
        raise HTTPException(status_code=400, detail="Kein Text vorhanden.")

    text_to_process = request.extracted_text[:12000]

    prompt = f"""Du bist ein Lerncoach. Analysiere diesen Text und erstelle einen Lernplan auf Deutsch.
Antworte NUR mit einem gültigen JSON-Objekt, ohne Erklärungen, ohne Markdown.

DOKUMENT: {request.document_title}

TEXT:
{text_to_process}

JSON-Struktur:
{{
  "titel": "...",
  "zusammenfassung": "...",
  "gesamtdauer_wochen": 4,
  "schwierigkeitsgrad": "Anfänger",
  "themen": [
    {{
      "id": 1,
      "name": "...",
      "beschreibung": "...",
      "zeitschaetzung_stunden": 3,
      "lernziele": ["..."],
      "schluesselkonzepte": ["..."]
    }}
  ],
  "lernreihenfolge": [
    {{"schritt": 1, "thema_id": 1, "begruendung": "..."}}
  ],
  "wochenplan": [
    {{"woche": 1, "themen_ids": [1], "aktivitaeten": ["..."], "ziel": "..."}}
  ],
  "meilensteine": [
    {{"id": 1, "titel": "...", "beschreibung": "...", "woche": 2, "themen_ids": [1], "erfolgskriterien": ["..."]}}
  ],
  "lernressourcen": [
    {{"typ": "Übung", "titel": "...", "beschreibung": "...", "thema_id": 1}}
  ],
  "tipps": ["...", "...", "..."]
}}"""

    response_text = ask_ollama(prompt)
    logger.info(f"Ollama Antwort: {len(response_text)} Zeichen")

    # JSON aus Antwort extrahieren
    response_text = response_text.strip()
    if "```" in response_text:
        import re
        match = re.search(r"```(?:json)?\s*([\s\S]+?)```", response_text)
        if match:
            response_text = match.group(1).strip()

    # Ersten { bis letzten } ausschneiden
    start = response_text.find("{")
    end = response_text.rfind("}") + 1
    if start != -1 and end > start:
        response_text = response_text[start:end]

    try:
        lernplan = json.loads(response_text)
    except json.JSONDecodeError as e:
        logger.error(f"JSON-Fehler: {e}\nAntwort: {response_text[:300]}")
        raise HTTPException(
            status_code=500,
            detail="Das Modell hat kein gültiges JSON geliefert. Versuche es erneut."
        )

    return {"success": True, "lernplan": lernplan, "model": OLLAMA_MODEL}


# Gebautes Frontend ausliefern
static_dir = os.path.join(os.path.dirname(__file__), "static")
if os.path.isdir(static_dir):
    app.mount("/assets", StaticFiles(directory=os.path.join(static_dir, "assets")), name="assets")

    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        return FileResponse(os.path.join(static_dir, "index.html"))


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
