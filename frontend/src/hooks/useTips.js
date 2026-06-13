import { useState, useCallback } from 'react';
import { ALL_MATCHES } from '../data/wm2026Data';

const STORAGE_KEY = 'wm2026_tips';

function loadTips() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }
  catch { return {}; }
}

function saveTips(tips) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tips));
}

export function calcPoints(tip, result) {
  if (!tip || !result) return null;
  if (tip.home === result.home && tip.away === result.away) return 3;
  const tipSign = Math.sign(tip.home - tip.away);
  const resSign = Math.sign(result.home - result.away);
  return tipSign === resSign ? 1 : 0;
}

export default function useTips() {
  const [tips, setTipsState] = useState(loadTips);

  const setTip = useCallback((matchId, home, away) => {
    setTipsState(prev => {
      const next = { ...prev, [matchId]: { home, away } };
      saveTips(next);
      return next;
    });
  }, []);

  const removeTip = useCallback((matchId) => {
    setTipsState(prev => {
      const next = { ...prev };
      delete next[matchId];
      saveTips(next);
      return next;
    });
  }, []);

  const getTip = useCallback((matchId) => tips[matchId] || null, [tips]);

  const stats = useCallback(() => {
    let total = 0, exact = 0, tendency = 0, wrong = 0, tipped = 0;
    for (const m of ALL_MATCHES) {
      const tip = tips[m.id];
      if (!tip) continue;
      tipped++;
      if (!m.result) continue;
      const pts = calcPoints(tip, m.result);
      total += pts;
      if (pts === 3) exact++;
      else if (pts === 1) tendency++;
      else wrong++;
    }
    return { total, exact, tendency, wrong, tipped };
  }, [tips]);

  return { tips, setTip, removeTip, getTip, stats };
}
