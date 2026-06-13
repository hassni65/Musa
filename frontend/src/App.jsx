import { useState } from 'react';
import BottomNav from './components/BottomNav';
import HomeTab from './components/HomeTab';
import GroupsTab from './components/GroupsTab';
import ScheduleTab from './components/ScheduleTab';
import MyTipsTab from './components/MyTipsTab';
import TipModal from './components/TipModal';
import useTips from './hooks/useTips';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [tipMatch, setTipMatch] = useState(null);
  const { tips, setTip, getTip, stats } = useTips();

  const tabProps = { tips, onTip: setTipMatch, stats };

  return (
    <div
      className="min-h-screen bg-gray-950 text-white max-w-lg mx-auto relative"
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
    >
      {/* Header */}
      <header className="px-4 pt-4 pb-3 flex items-center justify-between sticky top-0 bg-gray-950 z-20">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-green-500 rounded-xl flex items-center justify-center text-xl">⚽</div>
          <div>
            <h1 className="text-white font-black text-lg leading-none">WM 2026</h1>
            <p className="text-gray-500 text-xs">Tippspiel</p>
          </div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl px-3 py-1.5 flex items-center gap-2">
          <span className="text-green-400 font-black text-sm">{stats().total}</span>
          <span className="text-gray-500 text-xs">Punkte</span>
        </div>
      </header>

      {/* Tab Content */}
      <main className="overflow-y-auto pb-28">
        {activeTab === 'home' && <HomeTab {...tabProps} />}
        {activeTab === 'gruppen' && <GroupsTab />}
        {activeTab === 'spielplan' && <ScheduleTab {...tabProps} />}
        {activeTab === 'mytipps' && <MyTipsTab tips={tips} stats={stats} />}
      </main>

      {/* Bottom Navigation */}
      <BottomNav active={activeTab} onChange={setActiveTab} />

      {/* Tipp-Modal Overlay */}
      {tipMatch && (
        <>
          <div className="fixed inset-0 bg-black/60 z-40" onClick={() => setTipMatch(null)} />
          <TipModal
            match={tipMatch}
            existingTip={getTip(tipMatch.id)}
            onSave={(matchId, home, away) => {
              setTip(matchId, home, away);
              setTipMatch(null);
            }}
            onClose={() => setTipMatch(null)}
          />
        </>
      )}
    </div>
  );
}
