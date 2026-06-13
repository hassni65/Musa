import { useState } from 'react';
import { GROUPS, calcGroupStandings, teamById } from '../data/wm2026Data';

function GroupTable({ group }) {
  const rows = calcGroupStandings(group);
  return (
    <div className="bg-gray-900 rounded-2xl mb-3 overflow-hidden">
      <div className="bg-gray-800 px-4 py-3 flex items-center gap-2">
        <span className="bg-green-500 text-white text-xs font-black px-2 py-0.5 rounded-md">Gruppe {group}</span>
      </div>
      <div className="px-4 pt-2 pb-3">
        {/* Header */}
        <div className="flex items-center text-gray-600 text-xs mb-2 px-1">
          <span className="w-5 text-center">#</span>
          <span className="flex-1 ml-2">Team</span>
          <span className="w-7 text-center">Sp</span>
          <span className="w-7 text-center">S</span>
          <span className="w-7 text-center">U</span>
          <span className="w-7 text-center">N</span>
          <span className="w-10 text-center">Tore</span>
          <span className="w-8 text-center font-bold">Pkt</span>
        </div>
        {rows.map((row, i) => {
          const team = teamById[row.id];
          const isQualified = i < 2;
          return (
            <div
              key={row.id}
              className={`flex items-center py-2 px-1 rounded-xl mb-0.5 ${isQualified ? 'bg-green-900/30' : ''}`}
            >
              <span className={`w-5 text-center text-sm font-bold ${isQualified ? 'text-green-400' : 'text-gray-500'}`}>
                {i + 1}
              </span>
              <div className="flex items-center gap-2 flex-1 ml-2 min-w-0">
                <span className="text-lg flex-shrink-0">{team?.flag}</span>
                <span className="text-white text-sm font-medium truncate">{team?.name}</span>
              </div>
              <span className="w-7 text-center text-gray-400 text-sm">{row.mp}</span>
              <span className="w-7 text-center text-gray-400 text-sm">{row.w}</span>
              <span className="w-7 text-center text-gray-400 text-sm">{row.d}</span>
              <span className="w-7 text-center text-gray-400 text-sm">{row.l}</span>
              <span className="w-10 text-center text-gray-400 text-sm">{row.gf}:{row.ga}</span>
              <span className={`w-8 text-center text-sm font-black ${isQualified ? 'text-green-400' : 'text-white'}`}>
                {row.pts}
              </span>
            </div>
          );
        })}
        <p className="text-gray-700 text-xs mt-2 text-center">Grün = direkte Qualifikation Achtelfinale</p>
      </div>
    </div>
  );
}

export default function GroupsTab() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="px-4 pb-2">
      <h2 className="text-white font-black text-xl mb-4">Gruppenphase</h2>

      {/* Gruppe schnell auswählen */}
      <div className="flex flex-wrap gap-2 mb-5">
        <button
          onClick={() => setSelected(null)}
          className={`px-3 py-1.5 rounded-xl text-sm font-bold transition-colors ${
            !selected ? 'bg-green-500 text-white' : 'bg-gray-800 text-gray-400'
          }`}
        >
          Alle
        </button>
        {GROUPS.map(g => (
          <button
            key={g}
            onClick={() => setSelected(g === selected ? null : g)}
            className={`px-3 py-1.5 rounded-xl text-sm font-bold transition-colors ${
              selected === g ? 'bg-green-500 text-white' : 'bg-gray-800 text-gray-400'
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      {(selected ? [selected] : GROUPS).map(g => <GroupTable key={g} group={g} />)}

      {/* Legende */}
      <div className="bg-gray-900 rounded-2xl p-4 mb-4">
        <h3 className="text-white font-semibold text-sm mb-3">KO-Runde Qualifikation</h3>
        <p className="text-gray-400 text-xs leading-relaxed">
          Die besten 2 Teams jeder der 12 Gruppen (24 Teams) sowie die 8 besten Drittplatzierten
          qualifizieren sich für das Achtelfinale (32 Teams). Das Finale findet am 19. Juli 2026
          im MetLife Stadium in New York statt.
        </p>
      </div>
    </div>
  );
}
