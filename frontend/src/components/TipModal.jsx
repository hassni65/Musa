import { useState, useEffect } from 'react';
import { teamById } from '../data/wm2026Data';

export default function TipModal({ match, existingTip, onSave, onClose }) {
  const [home, setHome] = useState(existingTip?.home ?? '');
  const [away, setAway] = useState(existingTip?.away ?? '');

  useEffect(() => {
    setHome(existingTip?.home ?? '');
    setAway(existingTip?.away ?? '');
  }, [existingTip, match]);

  const homeTeam = teamById[match.home];
  const awayTeam = teamById[match.away];
  const isValid = home !== '' && away !== '' && !isNaN(+home) && !isNaN(+away) && +home >= 0 && +away >= 0;

  function handleSave() {
    if (!isValid) return;
    onSave(match.id, +home, +away);
    onClose();
  }

  function ScoreBtn({ value, setter, current }) {
    return (
      <div className="flex items-center gap-3">
        <button
          onClick={() => setter(Math.max(0, (current === '' ? 0 : +current) - 1).toString())}
          className="w-10 h-10 rounded-full bg-gray-700 text-white text-xl flex items-center justify-center active:bg-gray-600"
        >−</button>
        <input
          type="number"
          min="0"
          max="20"
          value={current}
          onChange={e => setter(e.target.value.replace(/[^0-9]/g, ''))}
          className="w-14 h-14 rounded-xl bg-gray-800 text-white text-2xl font-bold text-center border border-gray-600 focus:border-green-400 focus:outline-none"
        />
        <button
          onClick={() => setter(((current === '' ? 0 : +current) + 1).toString())}
          className="w-10 h-10 rounded-full bg-gray-700 text-white text-xl flex items-center justify-center active:bg-gray-600"
        >+</button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end" onClick={onClose}>
      <div
        className="w-full bg-gray-900 rounded-t-3xl p-6 pb-10 shadow-2xl"
        onClick={e => e.stopPropagation()}
        style={{ paddingBottom: 'max(2.5rem, env(safe-area-inset-bottom))' }}
      >
        {/* Handle */}
        <div className="w-10 h-1 bg-gray-700 rounded-full mx-auto mb-6" />

        <p className="text-center text-gray-400 text-sm mb-1">{match.round}</p>
        <p className="text-center text-gray-500 text-xs mb-6">
          {new Date(match.date).toLocaleDateString('de-DE', { weekday:'short', day:'numeric', month:'long' })} · {match.time} Uhr
        </p>

        <div className="flex items-center justify-between gap-4 mb-8">
          {/* Heim */}
          <div className="flex-1 flex flex-col items-center gap-2">
            <span className="text-4xl">{homeTeam?.flag}</span>
            <span className="text-white font-semibold text-sm text-center leading-tight">{homeTeam?.name}</span>
            <ScoreBtn value={home} setter={setHome} current={home} />
          </div>

          <div className="text-gray-600 text-2xl font-bold pb-8">:</div>

          {/* Auswärts */}
          <div className="flex-1 flex flex-col items-center gap-2">
            <span className="text-4xl">{awayTeam?.flag}</span>
            <span className="text-white font-semibold text-sm text-center leading-tight">{awayTeam?.name}</span>
            <ScoreBtn value={away} setter={setAway} current={away} />
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={!isValid}
          className="w-full py-4 rounded-2xl font-bold text-lg bg-green-500 text-white disabled:opacity-40 disabled:cursor-not-allowed active:bg-green-600 transition-colors"
        >
          Tipp speichern
        </button>
        <button onClick={onClose} className="w-full py-3 mt-2 text-gray-500 text-sm">
          Abbrechen
        </button>
      </div>
    </div>
  );
}
