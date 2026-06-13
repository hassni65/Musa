import { useState, useMemo } from 'react';
import { ALL_MATCHES, GROUPS } from '../data/wm2026Data';
import MatchCard from './MatchCard';

const ROUNDS = ['Alle', 'Gruppe', 'Achtelfinale', 'Viertelfinale', 'Halbfinale', 'Finale'];

function groupByDate(matches) {
  const map = {};
  for (const m of matches) {
    const key = m.date;
    if (!map[key]) map[key] = [];
    map[key].push(m);
  }
  return Object.entries(map).sort(([a], [b]) => a.localeCompare(b));
}

export default function ScheduleTab({ tips, onTip }) {
  const [roundFilter, setRoundFilter] = useState('Alle');
  const [groupFilter, setGroupFilter] = useState('Alle');
  const [statusFilter, setStatusFilter] = useState('Alle');

  const filtered = useMemo(() => {
    return ALL_MATCHES.filter(m => {
      if (roundFilter !== 'Alle') {
        if (roundFilter === 'Gruppe' && m.group === null) return false;
        if (roundFilter !== 'Gruppe' && m.round !== roundFilter) return false;
      }
      if (groupFilter !== 'Alle' && m.group !== groupFilter) return false;
      if (statusFilter === 'Bevorstehend' && m.status !== 'upcoming') return false;
      if (statusFilter === 'Beendet' && m.status !== 'finished') return false;
      return true;
    });
  }, [roundFilter, groupFilter, statusFilter]);

  const grouped = groupByDate(filtered);
  const untippedCount = filtered.filter(m => m.home !== 'tbd' && m.status !== 'finished' && !tips[m.id]).length;

  return (
    <div className="pb-2">
      {/* Filter-Leiste */}
      <div className="sticky top-0 z-10 bg-gray-950 px-4 pb-3 pt-2 space-y-2">
        {/* Runde */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {ROUNDS.map(r => (
            <button
              key={r}
              onClick={() => { setRoundFilter(r); if (r !== 'Gruppe') setGroupFilter('Alle'); }}
              className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                roundFilter === r ? 'bg-green-500 text-white' : 'bg-gray-800 text-gray-400'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Gruppe (nur wenn Gruppenfilter aktiv) */}
        {(roundFilter === 'Alle' || roundFilter === 'Gruppe') && (
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setGroupFilter('Alle')}
              className={`flex-shrink-0 px-3 py-1 rounded-lg text-xs font-bold ${groupFilter === 'Alle' ? 'bg-gray-600 text-white' : 'bg-gray-800 text-gray-500'}`}
            >
              Alle Gr.
            </button>
            {GROUPS.map(g => (
              <button
                key={g}
                onClick={() => setGroupFilter(g === groupFilter ? 'Alle' : g)}
                className={`flex-shrink-0 px-2.5 py-1 rounded-lg text-xs font-bold ${groupFilter === g ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-500'}`}
              >
                {g}
              </button>
            ))}
          </div>
        )}

        {/* Status */}
        <div className="flex gap-2">
          {['Alle', 'Bevorstehend', 'Beendet'].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`flex-shrink-0 px-3 py-1 rounded-lg text-xs font-semibold ${statusFilter === s ? 'bg-gray-600 text-white' : 'bg-gray-800 text-gray-500'}`}
            >
              {s}
            </button>
          ))}
          {untippedCount > 0 && (
            <span className="ml-auto text-xs text-yellow-400 font-semibold self-center">
              {untippedCount} ohne Tipp
            </span>
          )}
        </div>
      </div>

      {/* Spielliste */}
      <div className="px-4">
        {grouped.length === 0 && (
          <div className="text-center py-16 text-gray-600">Keine Spiele gefunden</div>
        )}
        {grouped.map(([date, matches]) => {
          const d = new Date(date + 'T12:00:00');
          const dateLabel = d.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
          return (
            <div key={date}>
              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-gray-800" />
                <span className="text-gray-500 text-xs font-semibold whitespace-nowrap">{dateLabel}</span>
                <div className="flex-1 h-px bg-gray-800" />
              </div>
              {matches.map(m => (
                <MatchCard key={m.id} match={m} tip={tips[m.id]} onTip={onTip} />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
