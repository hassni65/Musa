"""
PDF-basierter Lernplan-Generator - FastAPI Backend
"""

import os
import json
import logging
from io import BytesIO
from typing import Optional

import pdfplumber
import PyPDF2
import anthropic
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Lernplan-Generator API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))


class TextRequest(BaseModel):
    text: str
    title: Optional[str] = "Lernmaterial"


class LernplanRequest(BaseModel):
    extracted_text: str
    document_title: Optional[str] = "Lernmaterial"


def extract_text_with_pdfplumber(pdf_bytes: bytes) -> str:
    """Extrahiert Text aus PDF mit pdfplumber (bessere Qualität)."""
    text_parts = []
    with pdfplumber.open(BytesIO(pdf_bytes)) as pdf:
        for page_num, page in enumerate(pdf.pages, 1):
            page_text = page.extract_text()
            if page_text:
                text_parts.append(f"--- Seite {page_num} ---\n{page_text}")
    return "\n\n".join(text_parts)


def extract_text_with_pypdf2(pdf_bytes: bytes) -> str:
    """Fallback: Extrahiert Text mit PyPDF2."""
    text_parts = []
    reader = PyPDF2.PdfReader(BytesIO(pdf_bytes))
    for page_num, page in enumerate(reader.pages, 1):
        page_text = page.extract_text()
        if page_text:
            text_parts.append(f"--- Seite {page_num} ---\n{page_text}")
    return "\n\n".join(text_parts)


@app.get("/health")
async def health_check():
    return {"status": "ok", "message": "Lernplan-Generator API läuft"}


@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    """
    Nimmt eine PDF-Datei entgegen und extrahiert den Text.
    """
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Nur PDF-Dateien werden unterstützt."
        )

    pdf_bytes = await file.read()

    if len(pdf_bytes) > 20 * 1024 * 1024:  # 20 MB Limit
        raise HTTPException(
            status_code=400,
            detail="Datei ist zu groß. Maximale Größe: 20 MB."
        )

    extracted_text = ""
    method_used = ""

    try:
        extracted_text = extract_text_with_pdfplumber(pdf_bytes)
        method_used = "pdfplumber"
        logger.info(f"Text mit pdfplumber extrahiert: {len(extracted_text)} Zeichen")
    except Exception as e:
        logger.warning(f"pdfplumber fehlgeschlagen: {e}, versuche PyPDF2...")
        try:
            extracted_text = extract_text_with_pypdf2(pdf_bytes)
            method_used = "PyPDF2"
            logger.info(f"Text mit PyPDF2 extrahiert: {len(extracted_text)} Zeichen")
        except Exception as e2:
            logger.error(f"Textextraktion fehlgeschlagen: {e2}")
            raise HTTPException(
                status_code=422,
                detail=f"Text konnte nicht aus der PDF extrahiert werden: {str(e2)}"
            )

    if not extracted_text.strip():
        raise HTTPException(
            status_code=422,
            detail="Kein Text in der PDF gefunden. Die Datei könnte gescannt oder verschlüsselt sein."
        )

    # Kürze den Text für die Vorschau
    preview = extracted_text[:2000] + ("..." if len(extracted_text) > 2000 else "")

    return {
        "filename": file.filename,
        "extracted_text": extracted_text,
        "preview": preview,
        "char_count": len(extracted_text),
        "method": method_used,
        "success": True
    }


@app.post("/generate-plan")
async def generate_learning_plan(request: LernplanRequest):
    """
    Generiert einen strukturierten Lernplan aus dem extrahierten Text
    mithilfe der Claude API.
    """
    if not request.extracted_text.strip():
        raise HTTPException(
            status_code=400,
            detail="Kein Text zum Verarbeiten vorhanden."
        )

    # Text auf 50.000 Zeichen begrenzen
    text_to_process = request.extracted_text[:50000]
    if len(request.extracted_text) > 50000:
        text_to_process += "\n\n[Hinweis: Text wurde für die Verarbeitung gekürzt]"

    prompt = f"""Du bist ein erfahrener Bildungsexperte und Lerncoach. Analysiere den folgenden Text aus einem Lehrmaterial und erstelle einen detaillierten, strukturierten Lernplan auf Deutsch.

DOKUMENT: {request.document_title}

INHALT:
{text_to_process}

Erstelle einen umfassenden Lernplan als JSON-Objekt mit genau dieser Struktur:

{{
  "titel": "Titel des Lernplans",
  "zusammenfassung": "Kurze Zusammenfassung des Lernmaterials (2-3 Sätze)",
  "gesamtdauer_wochen": <Zahl>,
  "schwierigkeitsgrad": "Anfänger|Fortgeschritten|Experte",
  "themen": [
    {{
      "id": 1,
      "name": "Themenname",
      "beschreibung": "Detaillierte Beschreibung des Themas",
      "zeitschaetzung_stunden": <Zahl>,
      "lernziele": ["Lernziel 1", "Lernziel 2"],
      "schluesselkonzepte": ["Konzept 1", "Konzept 2"]
    }}
  ],
  "lernreihenfolge": [
    {{
      "schritt": 1,
      "thema_id": 1,
      "begruendung": "Warum dieses Thema zuerst gelernt werden sollte"
    }}
  ],
  "wochenplan": [
    {{
      "woche": 1,
      "themen_ids": [1, 2],
      "aktivitaeten": ["Aktivität 1", "Aktivität 2"],
      "ziel": "Was am Ende der Woche erreicht sein soll"
    }}
  ],
  "meilensteine": [
    {{
      "id": 1,
      "titel": "Meilensteintitel",
      "beschreibung": "Was bei diesem Meilenstein erreicht wird",
      "woche": <Zahl>,
      "themen_ids": [1, 2],
      "erfolgskriterien": ["Kriterium 1", "Kriterium 2"]
    }}
  ],
  "lernressourcen": [
    {{
      "typ": "Übung|Projekt|Lesen|Video|Quiz",
      "titel": "Ressourcentitel",
      "beschreibung": "Kurze Beschreibung",
      "thema_id": 1
    }}
  ],
  "tipps": ["Lerntipp 1", "Lerntipp 2", "Lerntipp 3"]
}}

WICHTIG:
- Antworte NUR mit dem JSON-Objekt, ohne Markdown-Formatierung oder Erklärungen
- Stelle sicher, dass das JSON gültig und vollständig ist
- Erstelle mindestens 3-7 Themen, 3-5 Meilensteine und einen vollständigen Wochenplan
- Beziehe dich konkret auf den Inhalt des Dokuments
- Alle Texte müssen auf Deutsch sein"""

    try:
        logger.info("Sende Anfrage an Claude API...")
        message = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=8000,
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        response_text = message.content[0].text.strip()
        logger.info(f"Claude Antwort erhalten: {len(response_text)} Zeichen")

        # Bereinige die Antwort falls nötig
        if response_text.startswith("```"):
            lines = response_text.split("\n")
            # Entferne erste und letzte Zeile (```json und ```)
            response_text = "\n".join(lines[1:-1])

        lernplan = json.loads(response_text)

        return {
            "success": True,
            "lernplan": lernplan,
            "model": "claude-sonnet-4-6",
            "tokens_used": message.usage.input_tokens + message.usage.output_tokens
        }

    except json.JSONDecodeError as e:
        logger.error(f"JSON-Parsing fehlgeschlagen: {e}")
        logger.error(f"Rohe Antwort: {response_text[:500]}")
        raise HTTPException(
            status_code=500,
            detail=f"Der Lernplan konnte nicht als JSON geparst werden: {str(e)}"
        )
    except anthropic.APIError as e:
        logger.error(f"Anthropic API Fehler: {e}")
        raise HTTPException(
            status_code=502,
            detail=f"Fehler bei der Kommunikation mit der KI: {str(e)}"
        )
    except Exception as e:
        logger.error(f"Unerwarteter Fehler: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Ein unerwarteter Fehler ist aufgetreten: {str(e)}"
        )


# Serve built frontend (production)
static_dir = os.path.join(os.path.dirname(__file__), "static")
if os.path.isdir(static_dir):
    app.mount("/assets", StaticFiles(directory=os.path.join(static_dir, "assets")), name="assets")

    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        index = os.path.join(static_dir, "index.html")
        return FileResponse(index)


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
