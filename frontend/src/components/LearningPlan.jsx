import { useState } from 'react'

const difficultyColors = {
  'Anfänger': 'bg-green-100 text-green-700',
  'Fortgeschritten': 'bg-yellow-100 text-yellow-700',
  'Experte': 'bg-red-100 text-red-700',
}

export default function LearningPlan({ lernplan, documentTitle }) {
  const [activeTab, setActiveTab] = useState('uebersicht')
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(lernplan, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(lernplan, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `lernplan-${documentTitle.replace(/\s+/g, '-').toLowerCase()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const tabs = [
    { id: 'uebersicht', label: 'Übersicht' },
    { id: 'themen', label: 'Themen' },
    { id: 'wochenplan', label: 'Wochenplan' },
    { id: 'meilensteine', label: 'Meilensteine' },
    { id: 'ressourcen', label: 'Ressourcen' },
  ]

  return (
    <div className="space-y-4">
      {/* Header card */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">{lernplan.titel}</h2>
            <p className="text-gray-600 mb-3">{lernplan.zusammenfassung}</p>
            <div className="flex flex-wrap gap-3 text-sm">
              <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-medium">
                {lernplan.gesamtdauer_wochen} Wochen
              </span>
              <span className={`px-3 py-1 rounded-full font-medium ${difficultyColors[lernplan.schwierigkeitsgrad] || 'bg-gray-100 text-gray-700'}`}>
                {lernplan.schwierigkeitsgrad}
              </span>
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                {lernplan.themen?.length || 0} Themen
              </span>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-sm border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 text-gray-600"
            >
              {copied ? '✓ Kopiert' : 'JSON kopieren'}
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 text-sm bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700"
            >
              Herunterladen
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="flex border-b overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'border-b-2 border-indigo-600 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Übersicht */}
          {activeTab === 'uebersicht' && (
            <div className="space-y-6">
              {/* Lernreihenfolge */}
              {lernplan.lernreihenfolge?.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Empfohlene Lernreihenfolge</h3>
                  <div className="space-y-2">
                    {lernplan.lernreihenfolge.map((item) => {
                      const thema = lernplan.themen?.find((t) => t.id === item.thema_id)
                      return (
                        <div key={item.schritt} className="flex gap-3 items-start">
                          <div className="w-7 h-7 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center shrink-0 mt-0.5">
                            {item.schritt}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800 text-sm">{thema?.name || `Thema ${item.thema_id}`}</p>
                            <p className="text-xs text-gray-500">{item.begruendung}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Tipps */}
              {lernplan.tipps?.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Lerntipps</h3>
                  <ul className="space-y-2">
                    {lernplan.tipps.map((tipp, i) => (
                      <li key={i} className="flex gap-2 text-sm text-gray-700">
                        <span className="text-indigo-500 shrink-0">•</span>
                        {tipp}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Themen */}
          {activeTab === 'themen' && (
            <div className="grid gap-4 sm:grid-cols-2">
              {lernplan.themen?.map((thema) => (
                <div key={thema.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 text-sm">{thema.name}</h3>
                    <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full shrink-0 ml-2">
                      {thema.zeitschaetzung_stunden}h
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mb-3">{thema.beschreibung}</p>
                  {thema.lernziele?.length > 0 && (
                    <div className="mb-2">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Lernziele</p>
                      <ul className="space-y-0.5">
                        {thema.lernziele.map((z, i) => (
                          <li key={i} className="text-xs text-gray-600 flex gap-1.5">
                            <span className="text-green-500 shrink-0">✓</span>{z}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {thema.schluesselkonzepte?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {thema.schluesselkonzepte.map((k, i) => (
                        <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{k}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Wochenplan */}
          {activeTab === 'wochenplan' && (
            <div className="space-y-4">
              {lernplan.wochenplan?.map((woche) => (
                <div key={woche.woche} className="border rounded-lg overflow-hidden">
                  <div className="bg-indigo-50 px-4 py-2 flex items-center justify-between">
                    <span className="font-semibold text-indigo-800 text-sm">Woche {woche.woche}</span>
                    {woche.themen_ids?.length > 0 && (
                      <span className="text-xs text-indigo-600">
                        {woche.themen_ids.map((id) => {
                          const t = lernplan.themen?.find((th) => th.id === id)
                          return t?.name || `Thema ${id}`
                        }).join(', ')}
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Ziel: <span className="font-normal text-gray-600">{woche.ziel}</span></p>
                    {woche.aktivitaeten?.length > 0 && (
                      <ul className="space-y-1">
                        {woche.aktivitaeten.map((a, i) => (
                          <li key={i} className="text-sm text-gray-600 flex gap-2">
                            <span className="text-indigo-400 shrink-0">→</span>{a}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Meilensteine */}
          {activeTab === 'meilensteine' && (
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-indigo-100" />
              <div className="space-y-6 pl-12">
                {lernplan.meilensteine?.map((ms) => (
                  <div key={ms.id} className="relative">
                    <div className="absolute -left-8 w-4 h-4 rounded-full bg-indigo-600 border-2 border-white shadow" />
                    <div className="bg-white border rounded-lg p-4 shadow-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">Woche {ms.woche}</span>
                        <h3 className="font-semibold text-gray-900 text-sm">{ms.titel}</h3>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{ms.beschreibung}</p>
                      {ms.erfolgskriterien?.length > 0 && (
                        <ul className="space-y-0.5">
                          {ms.erfolgskriterien.map((k, i) => (
                            <li key={i} className="text-xs text-gray-600 flex gap-1.5">
                              <span className="text-green-500 shrink-0">✓</span>{k}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ressourcen */}
          {activeTab === 'ressourcen' && (
            <div className="grid gap-3 sm:grid-cols-2">
              {lernplan.lernressourcen?.map((res, i) => {
                const typeColors = {
                  'Übung': 'bg-orange-50 text-orange-600',
                  'Projekt': 'bg-purple-50 text-purple-600',
                  'Lesen': 'bg-blue-50 text-blue-600',
                  'Video': 'bg-red-50 text-red-600',
                  'Quiz': 'bg-green-50 text-green-600',
                }
                return (
                  <div key={i} className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeColors[res.typ] || 'bg-gray-100 text-gray-600'}`}>
                        {res.typ}
                      </span>
                    </div>
                    <h3 className="font-medium text-gray-900 text-sm mb-1">{res.titel}</h3>
                    <p className="text-xs text-gray-500">{res.beschreibung}</p>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
