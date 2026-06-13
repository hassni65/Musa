import { ALL_MATCHES, teamById } from '../data/wm2026Data';
import { calcPoints } from '../hooks/useTips';

const TODAY = '2026-06-13';

function TodayMatchCard({ match, tip, onTip }) {
  const h = teamById[match.home], a = teamById[match.away];
  return (
    <div className="bg-gray-900 rounded-2xl p-4 mb-2">
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-500 text-xs">{match.round} · {match.time} Uhr</span>
        {tip && <span className="text-green-400 text-xs font-medium">Tipp: {tip.home}:{tip.away}</span>}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{h?.flag}</span>
          <span className="text-white font-semibold text-sm">{h?.name}</span>
        </div>
        <span className="text-gray-600 font-bold">vs</span>
        <div className="flex items-center gap-2 flex-row-reverse">
          <span className="text-2xl">{a?.flag}</span>
          <span className="text-white font-semibold text-sm text-right">{a?.name}</span>
        </div>
      </div>
      <button
        onClick={() => onTip(match)}
        className={`w-full mt-3 py-2 rounded-xl text-sm font-medium transition-colors ${
          tip ? 'bg-green-900 text-green-300 border border-green-700' : 'bg-green-500 text-white active:bg-green-600'
        }`}
      >
        {tip ? 'Tipp ändern' : 'Jetzt tippen!'}
      </button>
    </div>
  );
}

function RecentCard({ match, tip }) {
  const h = teamById[match.home], a = teamById[match.away];
  const pts = calcPoints(tip, match.result);
  return (
    <div className="bg-gray-900 rounded-2xl p-3 mb-2 flex items-center gap-3">
      <div className="flex-1 flex items-center gap-2 min-w-0">
        <span className="text-xl">{h?.flag}</span>
        <span className="text-white text-sm truncate">{h?.name}</span>
      </div>
      <div className="text-center flex-shrink-0">
        <div className="bg-gray-800 rounded-lg px-3 py-1 text-white font-bold text-sm">
          {match.result?.home}:{match.result?.away}
        </div>
        {tip && pts !== null && (
          <div className={`text-xs mt-1 font-bold ${pts === 3 ? 'text-green-400' : pts === 1 ? 'text-yellow-400' : 'text-red-400'}`}>
            {pts === 3 ? '3 Pkt ✓' : pts === 1 ? '1 Pkt ~' : '0 Pkt ✗'}
          </div>
        )}
      </div>
      <div className="flex-1 flex items-center gap-2 justify-end min-w-0">
        <span className="text-white text-sm truncate text-right">{a?.name}</span>
        <span className="text-xl">{a?.flag}</span>
      </div>
    </div>
  );
}

function UpcomingCard({ match, tip, onTip }) {
  const h = teamById[match.home], a = teamById[match.away];
  const dateStr = new Date(match.date + 'T12:00:00').toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric', month: 'short' });
  return (
    <div className="bg-gray-900 rounded-2xl p-3 mb-2 flex items-center gap-3">
      <div className="flex-1 flex items-center gap-2 min-w-0">
        <span className="text-xl">{h?.flag}</span>
        <span className="text-white text-sm truncate">{h?.name}</span>
      </div>
      <div className="text-center flex-shrink-0">
        <div className="text-gray-500 text-xs">{dateStr}</div>
        <div className="text-gray-400 text-xs">{match.time}</div>
        {!tip
          ? <button onClick={() => onTip(match)} className="mt-1 text-xs text-green-400 font-medium">tippen</button>
          : <div className="text-green-400 text-xs font-bold mt-1">{tip.home}:{tip.away}</div>
        }
      </div>
      <div className="flex-1 flex items-center gap-2 justify-end min-w-0">
        <span className="text-white text-sm truncate text-right">{a?.name}</span>
        <span className="text-xl">{a?.flag}</span>
      </div>
    </div>
  );
}

export default function HomeTab({ tips, onTip, stats }) {
  const s = stats();

  const todayMatches = ALL_MATCHES.filter(m => m.date === TODAY && m.home !== 'tbd');
  const tippedToday = todayMatches.filter(m => tips[m.id]).length;

  const recent = ALL_MATCHES
    .filter(m => m.status === 'finished')
    .sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time))
    .slice(0, 4);

  const upcoming = ALL_MATCHES
    .filter(m => m.status === 'upcoming' && m.home !== 'tbd' && m.date !== TODAY)
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
    .slice(0, 3);

  return (
    <div className="px-4 pb-2">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 rounded-3xl p-6 mb-5 relative overflow-hidden">
        <div className="absolute -top-2 -right-4 text-9xl opacity-10 select-none pointer-events-none">⚽</div>
        <p className="text-green-300 text-sm font-semibold mb-1 uppercase tracking-wide">FIFA Weltmeisterschaft</p>
        <h1 className="text-white text-4xl font-black mb-1">WM 2026</h1>
        <p className="text-green-200 text-sm mb-5">11. Jun – 19. Jul · USA · Kanada · Mexiko</p>
        <div className="flex gap-3">
          <StatPill label="Tipps" value={s.tipped} />
          <StatPill label="Punkte" value={s.total} highlight />
          <StatPill label="Exakt" value={s.exact} />
        </div>
      </div>

      {/* Heutige Spiele */}
      {todayMatches.length > 0 && (
        <section className="mb-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-white font-bold text-base">Heute spielen</h2>
            <span className="text-green-400 text-xs font-semibold bg-green-900/50 px-2 py-1 rounded-full">
              {tippedToday}/{todayMatches.length} getippt
            </span>
          </div>
          {todayMatches.map(m => <TodayMatchCard key={m.id} match={m} tip={tips[m.id]} onTip={onTip} />)}
        </section>
      )}

      {/* Letzte Ergebnisse */}
      {recent.length > 0 && (
        <section className="mb-5">
          <h2 className="text-white font-bold text-base mb-3">Letzte Ergebnisse</h2>
          {recent.map(m => <RecentCard key={m.id} match={m} tip={tips[m.id]} />)}
        </section>
      )}

      {/* Nächste Spiele */}
      {upcoming.length > 0 && (
        <section className="mb-5">
          <h2 className="text-white font-bold text-base mb-3">Nächste Spiele</h2>
          {upcoming.map(m => <UpcomingCard key={m.id} match={m} tip={tips[m.id]} onTip={onTip} />)}
        </section>
      )}

      {/* Punktesystem */}
      <div className="bg-gray-900 rounded-2xl p-4 mb-4">
        <h3 className="text-white font-semibold mb-3">Punktesystem</h3>
        <div className="space-y-2.5">
          {[
            { label: 'Exaktes Ergebnis', pts: '3 Punkte', color: 'text-green-400' },
            { label: 'Richtige Tendenz (Sieg / Unentschieden)', pts: '1 Punkt', color: 'text-yellow-400' },
            { label: 'Falsche Tendenz', pts: '0 Punkte', color: 'text-red-400' },
          ].map(r => (
            <div key={r.label} className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">{r.label}</span>
              <span className={`font-bold text-sm ${r.color}`}>{r.pts}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatPill({ label, value, highlight }) {
  return (
    <div className={`flex-1 rounded-2xl px-3 py-2 text-center ${highlight ? 'bg-green-600' : 'bg-black/25'}`}>
      <div className="text-white text-2xl font-black leading-none">{value}</div>
      <div className="text-green-200 text-xs mt-0.5">{label}</div>
    </div>
  );
}
