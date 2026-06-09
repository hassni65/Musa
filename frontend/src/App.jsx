import { useState } from 'react'
import PDFUpload from './components/PDFUpload'
import LearningPlan from './components/LearningPlan'

export default function App() {
  const [extractedText, setExtractedText] = useState('')
  const [documentTitle, setDocumentTitle] = useState('')
  const [lernplan, setLernplan] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState('upload') // 'upload' | 'preview' | 'plan'

  const handleTextExtracted = (text, filename) => {
    setExtractedText(text)
    setDocumentTitle(filename.replace('.pdf', '').replace(/_/g, ' '))
    setStep('preview')
    setError('')
  }

  const handleGeneratePlan = async () => {
    if (!extractedText) return
    setIsGenerating(true)
    setError('')
    try {
      const res = await fetch('/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ extracted_text: extractedText, document_title: documentTitle }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.detail || 'Fehler beim Generieren des Lernplans.')
      }
      const data = await res.json()
      setLernplan(data.lernplan)
      setStep('plan')
    } catch (e) {
      setError(e.message)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleReset = () => {
    setExtractedText('')
    setDocumentTitle('')
    setLernplan(null)
    setError('')
    setStep('upload')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">L</div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Lernplan-Generator</h1>
              <p className="text-xs text-gray-500">PDF zu strukturiertem Lernplan</p>
            </div>
          </div>
          {step !== 'upload' && (
            <button onClick={handleReset} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
              ← Neue PDF hochladen
            </button>
          )}
        </div>
      </header>

      {/* Step indicator */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex items-center gap-2 mb-8">
          {['PDF hochladen', 'Text prüfen', 'Lernplan'].map((label, i) => {
            const stepKey = ['upload', 'preview', 'plan'][i]
            const active = step === stepKey
            const done = (['upload', 'preview', 'plan'].indexOf(step)) > i
            return (
              <div key={i} className="flex items-center gap-2">
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${active ? 'bg-indigo-600 text-white' : done ? 'bg-green-100 text-green-700' : 'bg-white text-gray-400 border'}`}>
                  <span>{done ? '✓' : i + 1}</span>
                  <span>{label}</span>
                </div>
                {i < 2 && <div className="w-6 h-px bg-gray-300" />}
              </div>
            )
          })}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {step === 'upload' && (
          <PDFUpload onTextExtracted={handleTextExtracted} />
        )}

        {step === 'preview' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Extrahierter Text</h2>
            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-1">Dokumenttitel</label>
              <input
                type="text"
                value={documentTitle}
                onChange={(e) => setDocumentTitle(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto text-sm text-gray-700 font-mono whitespace-pre-wrap border mb-6">
              {extractedText.slice(0, 3000)}{extractedText.length > 3000 ? '\n\n[... weiterer Text ...]' : ''}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">{extractedText.length.toLocaleString()} Zeichen extrahiert</span>
              <button
                onClick={handleGeneratePlan}
                disabled={isGenerating}
                className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Lernplan wird erstellt…
                  </>
                ) : 'Lernplan generieren →'}
              </button>
            </div>
          </div>
        )}

        {step === 'plan' && lernplan && (
          <LearningPlan lernplan={lernplan} documentTitle={documentTitle} />
        )}
      </div>
    </div>
  )
}
