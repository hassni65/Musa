import { teamById } from '../data/wm2026Data';
import { calcPoints } from '../hooks/useTips';

function StatusBadge({ status }) {
  if (status === 'live') return <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-500 text-white animate-pulse">LIVE</span>;
  if (status === 'finished') return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-400">Beendet</span>;
  return null;
}

function PointsBadge({ pts }) {
  if (pts === null) return null;
  const colors = { 3: 'bg-green-500 text-white', 1: 'bg-yellow-500 text-black', 0: 'bg-red-500 text-white' };
  const labels = { 3: '3 Pkt ✓', 1: '1 Pkt ~', 0: '0 Pkt ✗' };
  return <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${colors[pts]}`}>{labels[pts]}</span>;
}

export default function MatchCard({ match, tip, onTip }) {
  const homeTeam = teamById[match.home];
  const awayTeam = teamById[match.away];
  const isKO = match.home === 'tbd';
  const pts = calcPoints(tip, match.result);
  const dateStr = new Date(match.date + 'T12:00:00').toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric', month: 'short' });

  return (
    <div className="bg-gray-900 rounded-2xl p-4 mb-3 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-gray-500 text-xs">{match.round}</span>
          {match.matchday && <span className="text-gray-600 text-xs">· ST{match.matchday}</span>}
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={match.status} />
          <PointsBadge pts={pts} />
          <span className="text-gray-600 text-xs">{dateStr} {match.time}</span>
        </div>
      </div>

      {/* Teams + Score */}
      <div className="flex items-center gap-3">
        {/* Heimteam */}
        <div className="flex-1 flex items-center gap-2 min-w-0">
          <span className="text-2xl flex-shrink-0">{isKO ? '❓' : homeTeam?.flag}</span>
          <span className="text-white font-semibold text-sm truncate">{isKO ? 'TBD' : homeTeam?.name}</span>
        </div>

        {/* Ergebnis / Tipp */}
        <div className="flex flex-col items-center gap-1 flex-shrink-0">
          {match.result ? (
            <div className="bg-gray-800 rounded-xl px-4 py-1.5 flex items-center gap-2">
              <span className="text-white font-bold text-lg">{match.result.home}</span>
              <span className="text-gray-500 text-sm">:</span>
              <span className="text-white font-bold text-lg">{match.result.away}</span>
            </div>
          ) : (
            <div className="bg-gray-800 rounded-xl px-4 py-1.5 flex items-center gap-2">
              <span className="text-gray-500 font-bold text-lg">–</span>
              <span className="text-gray-600 text-sm">:</span>
              <span className="text-gray-500 font-bold text-lg">–</span>
            </div>
          )}
          {tip && (
            <div className="text-xs text-gray-500">
              Tipp: <span className="text-green-400 font-medium">{tip.home}:{tip.away}</span>
            </div>
          )}
        </div>

        {/* Auswärtsteam */}
        <div className="flex-1 flex items-center gap-2 justify-end min-w-0">
          <span className="text-white font-semibold text-sm truncate text-right">{isKO ? 'TBD' : awayTeam?.name}</span>
          <span className="text-2xl flex-shrink-0">{isKO ? '❓' : awayTeam?.flag}</span>
        </div>
      </div>

      {/* Tipp-Button */}
      {!isKO && match.status !== 'finished' && (
        <button
          onClick={() => onTip(match)}
          className={`w-full mt-3 py-2 rounded-xl text-sm font-medium transition-colors ${
            tip
              ? 'bg-green-900 text-green-300 border border-green-700'
              : 'bg-gray-800 text-gray-300 border border-gray-700 active:bg-gray-700'
          }`}
        >
          {tip ? `Tipp ändern: ${tip.home}:${tip.away}` : '+ Tipp abgeben'}
        </button>
      )}

      {/* Venue */}
      <p className="text-gray-600 text-xs mt-2 text-center">{match.venue}</p>
    </div>
  );
}
