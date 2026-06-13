import { useMemo } from 'react';
import { ALL_MATCHES, teamById } from '../data/wm2026Data';
import { calcPoints } from '../hooks/useTips';

function TipRow({ match, tip, pts }) {
  const h = teamById[match.home], a = teamById[match.away];
  const hasResult = match.result !== null;

  return (
    <div className="bg-gray-900 rounded-2xl p-3 mb-2 flex items-center gap-3">
      {/* Teams */}
      <div className="flex-1 min-w-0">
        <p className="text-gray-500 text-xs mb-1">{match.round}</p>
        <div className="flex items-center gap-1.5">
          <span className="text-lg">{h?.flag}</span>
          <span className="text-white text-xs font-medium truncate">{h?.name}</span>
          <span className="text-gray-600 text-xs">vs</span>
          <span className="text-white text-xs font-medium truncate">{a?.name}</span>
          <span className="text-lg">{a?.flag}</span>
        </div>
      </div>

      {/* Tipp */}
      <div className="text-center flex-shrink-0">
        <p className="text-gray-500 text-xs">Tipp</p>
        <p className="text-green-400 font-bold text-sm">{tip.home}:{tip.away}</p>
      </div>

      {/* Ergebnis + Punkte */}
      <div className="text-center flex-shrink-0 w-16">
        {hasResult ? (
          <>
            <p className="text-gray-500 text-xs">Ergebnis</p>
            <p className="text-white font-bold text-sm">{match.result.home}:{match.result.away}</p>
            <p className={`text-xs font-black mt-0.5 ${pts === 3 ? 'text-green-400' : pts === 1 ? 'text-yellow-400' : 'text-red-400'}`}>
              {pts === 3 ? '+3 ✓' : pts === 1 ? '+1 ~' : '+0 ✗'}
            </p>
          </>
        ) : (
          <>
            <p className="text-gray-500 text-xs">Ergebnis</p>
            <p className="text-gray-600 text-sm">–:–</p>
            <p className="text-gray-600 text-xs">offen</p>
          </>
        )}
      </div>
    </div>
  );
}

export default function MyTipsTab({ tips, stats }) {
  const s = stats();

  const tippedMatches = useMemo(() => {
    return ALL_MATCHES
      .filter(m => tips[m.id] && m.home !== 'tbd')
      .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  }, [tips]);

  const total = ALL_MATCHES.filter(m => m.home !== 'tbd').length;
  const pct = s.tipped > 0 ? Math.round((s.tipped / total) * 100) : 0;

  return (
    <div className="px-4 pb-2">
      {/* Statistik-Karte */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-5 mb-5 border border-gray-700">
        <h2 className="text-white font-black text-xl mb-4">Meine Statistik</h2>

        {/* Punkte gross */}
        <div className="flex items-end gap-2 mb-5">
          <span className="text-green-400 font-black text-5xl">{s.total}</span>
          <span className="text-gray-400 text-lg mb-1">Punkte</span>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <StatCard label="Tipps abgegeben" value={`${s.tipped}/${total}`} color="text-white" />
          <StatCard label="Exakte Treffer" value={s.exact} color="text-green-400" />
          <StatCard label="Richtige Tendenz" value={s.tendency} color="text-yellow-400" />
          <StatCard label="Danebengeppt" value={s.wrong} color="text-red-400" />
        </div>

        {/* Fortschrittsbalken */}
        <div>
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Tipp-Fortschritt</span>
            <span>{pct}%</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Liste meiner Tipps */}
      {tippedMatches.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-6xl mb-4">⭐</p>
          <p className="text-gray-400 font-semibold">Noch keine Tipps</p>
          <p className="text-gray-600 text-sm mt-2">Geh zu „Spiele" und tippe deine ersten Ergebnisse!</p>
        </div>
      ) : (
        <>
          <h3 className="text-white font-bold text-base mb-3">Alle meine Tipps ({s.tipped})</h3>
          {tippedMatches.map(m => (
            <TipRow
              key={m.id}
              match={m}
              tip={tips[m.id]}
              pts={calcPoints(tips[m.id], m.result)}
            />
          ))}
        </>
      )}
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div className="bg-gray-800 rounded-2xl px-4 py-3">
      <p className="text-gray-500 text-xs mb-1">{label}</p>
      <p className={`font-black text-2xl ${color}`}>{value}</p>
    </div>
  );
}
