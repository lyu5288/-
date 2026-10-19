/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header, ActiveTab } from './components/Header';
import { HomeView } from './components/HomeView';
import { ExploreMode } from './components/ExploreMode';
import { TracingMode } from './components/TracingMode';
import { WordPuzzleMode } from './components/WordPuzzleMode';
import { BalloonPopMode } from './components/BalloonPopMode';
import { CardMatchMode } from './components/CardMatchMode';
import { StickerBoard } from './components/StickerBoard';
import { INITIAL_STICKERS, HangulLetter, StickerItem } from './data/hangulData';
import { speakKorean, playCheerFanfare, playSuccessChime } from './utils/sound';
import confetti from 'canvas-confetti';

const STORAGE_STICKERS_KEY = 'hangul_pangpang_stickers_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [tracingLetter, setTracingLetter] = useState<HangulLetter | undefined>(undefined);
  const [stickers, setStickers] = useState<StickerItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_STICKERS_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return INITIAL_STICKERS;
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync stickers to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_STICKERS_KEY, JSON.stringify(stickers));
    } catch {
      // ignore
    }
  }, [stickers]);

  // Unlock sticker helper
  const unlockSticker = (stickerId: string) => {
    setStickers((prev) => {
      const target = prev.find((s) => s.id === stickerId);
      if (!target || target.unlocked) return prev;

      const updated = prev.map((s) =>
        s.id === stickerId ? { ...s, unlocked: true, unlockedAt: '오늘' } : s
      );

      // Show praise toast
      setToastMessage(`🎉 칭찬 스티커 획득! [${target.title}]`);
      playCheerFanfare();
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.3 },
      });
      speakKorean(`축하해요! 새로운 칭찬 스티커 '${target.title}'를 획득했어요!`);

      setTimeout(() => {
        setToastMessage(null);
      }, 4000);

      // Check if all primary are unlocked, then unlock superstar
      const nonSuperstar = updated.filter((s) => s.id !== 'stk_hangul_superstar');
      const allDone = nonSuperstar.every((s) => s.unlocked);
      if (allDone) {
        const superstar = updated.find((s) => s.id === 'stk_hangul_superstar');
        if (superstar && !superstar.unlocked) {
          setTimeout(() => {
            unlockSticker('stk_hangul_superstar');
          }, 3000);
        }
      }

      return updated;
    });
  };

  const handleToggleSound = () => {
    setSoundEnabled((prev) => !prev);
  };

  const handleGoToTracingFromExplore = (letter: HangulLetter) => {
    setTracingLetter(letter);
    setActiveTab('tracing');
  };

  const unlockedCount = stickers.filter((s) => s.unlocked).length;

  return (
    <div className="min-h-screen bg-[#FFFDF7] flex flex-col font-sans selection:bg-amber-200">
      {/* Toast Alert for Unlocking Stickers */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 transform -translate-x-1/2 z-50 bg-amber-400 text-amber-950 px-6 py-3 rounded-full font-black text-sm shadow-lg border-2 border-amber-300 animate-bounce flex items-center gap-2">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Top Header */}
      <Header
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        unlockedStickersCount={unlockedCount}
        totalStickersCount={stickers.length}
      />

      {/* Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6">
        {activeTab === 'home' && (
          <HomeView
            onSelectTab={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            unlockedStickersCount={unlockedCount}
          />
        )}

        {activeTab === 'explore' && (
          <ExploreMode
            onGoToTracing={handleGoToTracingFromExplore}
            onLetterLearned={() => unlockSticker('stk_first_step')}
          />
        )}

        {activeTab === 'tracing' && (
          <TracingMode
            initialLetter={tracingLetter}
            onCompleteTracing={() => unlockSticker('stk_trace_master')}
          />
        )}

        {activeTab === 'puzzle' && (
          <WordPuzzleMode
            onCompleteWord={() => unlockSticker('stk_puzzle_champ')}
          />
        )}

        {activeTab === 'balloon' && (
          <BalloonPopMode
            onWinGame={() => unlockSticker('stk_balloon_hero')}
          />
        )}

        {activeTab === 'match' && (
          <CardMatchMode
            onWinGame={() => unlockSticker('stk_memory_king')}
          />
        )}

        {activeTab === 'stickers' && (
          <StickerBoard
            stickers={stickers}
            onGoToGame={(tab) => setActiveTab(tab as ActiveTab)}
          />
        )}
      </main>

      {/* Quiet Footer */}
      <footer className="mt-auto border-t border-amber-100 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-2">
            <span className="font-bold text-amber-900">한글 팡팡! 유아 한글 놀이터</span>
            <span>·</span>
            <span>즐거운 첫 한글 학습 프로그램</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>자음·모음 소리 탐험</span>
            <span>·</span>
            <span>따라 쓰기</span>
            <span>·</span>
            <span>낱말 퍼즐</span>
            <span>·</span>
            <span>풍선 팡팡</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
