import React from 'react';
import { Volume2, VolumeX, Sparkles, Award } from 'lucide-react';
import { playClickBeep } from '../utils/sound';

export type ActiveTab = 'home' | 'explore' | 'tracing' | 'puzzle' | 'balloon' | 'match' | 'stickers';

interface HeaderProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  unlockedStickersCount: number;
  totalStickersCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  soundEnabled,
  onToggleSound,
  unlockedStickersCount,
  totalStickersCount,
}) => {
  const navItems: { key: ActiveTab; label: string }[] = [
    { key: 'home', label: '놀이터 홈' },
    { key: 'explore', label: '소리 탐험' },
    { key: 'tracing', label: '따라 쓰기' },
    { key: 'puzzle', label: '낱말 퍼즐' },
    { key: 'balloon', label: '풍선 팡팡' },
    { key: 'match', label: '짝 맞추기' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4 md:gap-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => {
            playClickBeep();
            onSelectTab('home');
          }}
          className="flex items-center gap-2.5 text-left group cursor-pointer shrink-0"
        >
          <div className="w-10 h-10 rounded-2xl bg-amber-400 flex items-center justify-center text-2xl shadow-sm transform group-hover:scale-105 transition-transform">
            🐯
          </div>
          <div>
            <span className="text-xl sm:text-2xl font-black tracking-tight text-amber-900 block leading-none">
              한글 팡팡!
            </span>
            <span className="text-[11px] font-bold text-amber-600 block mt-0.5">
              유아 한글 놀이터
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links (Single-line whitespace-nowrap) */}
        <nav className="hidden lg:flex items-center gap-1.5 shrink-0">
          {navItems.map((item) => {
            const isActive = activeTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => {
                  playClickBeep();
                  onSelectTab(item.key);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-base font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-400 text-amber-950 shadow-xs scale-105'
                    : 'text-slate-600 hover:text-amber-800 hover:bg-amber-50'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Action & Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            title={soundEnabled ? '소리 끄기' : '소리 켜기'}
            className="w-10 h-10 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 flex items-center justify-center transition-colors cursor-pointer border border-amber-200"
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 text-slate-400" />}
          </button>

          {/* Stickers Award Button */}
          <button
            onClick={() => {
              playClickBeep();
              onSelectTab('stickers');
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-500 hover:to-yellow-500 text-amber-950 font-bold text-sm shadow-xs transition-transform hover:scale-105 cursor-pointer whitespace-nowrap"
          >
            <Award className="w-4 h-4 text-amber-900" />
            <span className="hidden sm:inline">칭찬 스티커</span>
            <span className="bg-white/80 px-1.5 py-0.5 rounded-md text-xs text-amber-900 font-black">
              {unlockedStickersCount}/{totalStickersCount}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar for Quick Tap */}
      <div className="lg:hidden flex items-center gap-1 px-3 py-1.5 overflow-x-auto no-scrollbar border-t border-amber-50 bg-amber-50/50">
        {navItems.map((item) => {
          const isActive = activeTab === item.key;
          return (
            <button
              key={item.key}
              onClick={() => {
                playClickBeep();
                onSelectTab(item.key);
              }}
              className={`px-3 py-1 rounded-lg text-sm font-bold whitespace-nowrap transition-colors cursor-pointer ${
                isActive
                  ? 'bg-amber-400 text-amber-950 shadow-xs'
                  : 'text-slate-600 hover:bg-amber-100/70'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
