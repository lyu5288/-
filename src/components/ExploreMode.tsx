import React, { useState } from 'react';
import { CONSONANTS, VOWELS, HangulLetter } from '../data/hangulData';
import { Volume2, Sparkles, Pencil, RotateCcw, CheckCircle2 } from 'lucide-react';
import { speakKorean, playSuccessChime, playClickBeep } from '../utils/sound';
import confetti from 'canvas-confetti';

interface ExploreModeProps {
  onGoToTracing: (letter: HangulLetter) => void;
  onLetterLearned?: () => void;
}

export const ExploreMode: React.FC<ExploreModeProps> = ({ onGoToTracing, onLetterLearned }) => {
  const [filterType, setFilterType] = useState<'consonant' | 'double_consonant' | 'vowel'>('consonant');
  const [selectedLetter, setSelectedLetter] = useState<HangulLetter>(CONSONANTS[0]);
  const [speechRate, setSpeechRate] = useState<number>(0.8);
  const [learnedIds, setLearnedIds] = useState<Set<string>>(new Set(['c1']));

  const currentList =
    filterType === 'vowel'
      ? VOWELS
      : CONSONANTS.filter((item) => item.type === filterType);

  const handleSelectAndSpeak = (letter: HangulLetter) => {
    setSelectedLetter(letter);
    playSuccessChime();

    // Mark as explored
    if (!learnedIds.has(letter.id)) {
      const next = new Set(learnedIds);
      next.add(letter.id);
      setLearnedIds(next);
      if (onLetterLearned) onLetterLearned();
    }

    // Pronunciation script for toddler
    const textToSpeak =
      letter.type === 'vowel'
        ? `${letter.char}! ${letter.sampleWord}! ${letter.soundDescription}`
        : `${letter.name}! ${letter.phonics}! ${letter.sampleWord}의 ${letter.char}! ${letter.soundDescription}`;

    speakKorean(textToSpeak, speechRate);
  };

  const handleRepeatVoice = () => {
    playClickBeep();
    const textToSpeak =
      selectedLetter.type === 'vowel'
        ? `${selectedLetter.char}! ${selectedLetter.sampleWord}`
        : `${selectedLetter.name}! ${selectedLetter.phonics}! ${selectedLetter.sampleWord}`;
    speakKorean(textToSpeak, speechRate);
  };

  const triggerCelebrate = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Category Tabs & Speech Pace Settings */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-amber-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category Selector */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              playClickBeep();
              setFilterType('consonant');
              setSelectedLetter(CONSONANTS[0]);
            }}
            className={`px-4 py-2 rounded-2xl text-base font-black transition-all cursor-pointer ${
              filterType === 'consonant'
                ? 'bg-amber-400 text-amber-950 shadow-xs scale-105'
                : 'bg-amber-50 text-slate-700 hover:bg-amber-100'
            }`}
          >
            기본 자음 (14자)
          </button>

          <button
            onClick={() => {
              playClickBeep();
              setFilterType('vowel');
              setSelectedLetter(VOWELS[0]);
            }}
            className={`px-4 py-2 rounded-2xl text-base font-black transition-all cursor-pointer ${
              filterType === 'vowel'
                ? 'bg-rose-400 text-white shadow-xs scale-105'
                : 'bg-rose-50 text-slate-700 hover:bg-rose-100'
            }`}
          >
            모음 (10자)
          </button>

          <button
            onClick={() => {
              playClickBeep();
              setFilterType('double_consonant');
              setSelectedLetter(CONSONANTS[14]);
            }}
            className={`px-4 py-2 rounded-2xl text-base font-black transition-all cursor-pointer ${
              filterType === 'double_consonant'
                ? 'bg-emerald-400 text-emerald-950 shadow-xs scale-105'
                : 'bg-emerald-50 text-slate-700 hover:bg-emerald-100'
            }`}
          >
            쌍자음 (5자)
          </button>
        </div>

        {/* Speed Controller */}
        <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
          <span className="text-xs text-slate-500">목소리 속도:</span>
          <button
            onClick={() => {
              playClickBeep();
              setSpeechRate(0.65);
            }}
            className={`px-3 py-1 rounded-xl text-xs font-black transition-colors ${
              speechRate <= 0.7 ? 'bg-amber-500 text-white shadow-2xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            🐢 천천히
          </button>
          <button
            onClick={() => {
              playClickBeep();
              setSpeechRate(0.85);
            }}
            className={`px-3 py-1 rounded-xl text-xs font-black transition-colors ${
              speechRate > 0.7 ? 'bg-amber-500 text-white shadow-2xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            🐰 보통
          </button>
        </div>
      </div>

      {/* Main Focus Detail Card */}
      <div className="bg-white rounded-3xl border-2 border-amber-300 shadow-md p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left z-10">
          {/* Big Letter Block */}
          <div
            className={`w-32 h-32 sm:w-36 sm:h-36 rounded-3xl ${selectedLetter.bgColor} border-4 ${selectedLetter.borderColor} flex items-center justify-center text-7xl sm:text-8xl font-black ${selectedLetter.color} shadow-sm transform hover:scale-105 transition-transform duration-200 animate-bounce-short`}
          >
            {selectedLetter.char}
          </div>

          {/* Letter Info & Phonics */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-xs font-black text-amber-800">
              <span>이름: {selectedLetter.name}</span>
              <span>·</span>
              <span>소리값: [{selectedLetter.phonics}]</span>
            </div>

            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <span className="text-4xl">{selectedLetter.sampleEmoji}</span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
                {selectedLetter.sampleWord}
              </h2>
            </div>

            <p className="text-slate-600 text-base sm:text-lg font-medium">
              {selectedLetter.soundDescription}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row md:flex-col gap-3 w-full md:w-auto shrink-0 z-10">
          <button
            onClick={handleRepeatVoice}
            className="px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-lg shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Volume2 className="w-6 h-6" />
            <span>소리 다시 듣기</span>
          </button>

          <button
            onClick={() => {
              playClickBeep();
              triggerCelebrate();
              onGoToTracing(selectedLetter);
            }}
            className="px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-lg shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Pencil className="w-5 h-5" />
            <span>직접 따라 쓰기</span>
          </button>
        </div>

        {/* Subtle decorative background circle */}
        <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-amber-50 pointer-events-none -z-0"></div>
      </div>

      {/* Grid of All Letters in Category */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <span>글자를 콕 눌러보세요!</span>
            <span className="text-sm font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              {learnedIds.size}개 확인 완료
            </span>
          </h3>
          <span className="text-xs text-slate-500">누르면 또박또박 읽어줘요</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-3 sm:gap-4">
          {currentList.map((item) => {
            const isSelected = selectedLetter.id === item.id;
            const isLearned = learnedIds.has(item.id);

            return (
              <button
                key={item.id}
                onClick={() => handleSelectAndSpeak(item)}
                className={`relative group p-3.5 rounded-3xl border-2 transition-all duration-200 cursor-pointer flex flex-col items-center justify-center gap-1.5 shadow-2xs hover:shadow-md ${
                  isSelected
                    ? `${item.bgColor} ${item.borderColor} ring-4 ring-amber-400/50 scale-105`
                    : 'bg-white border-slate-200 hover:border-amber-300 hover:bg-amber-50/40'
                }`}
              >
                {/* Learned check badge */}
                {isLearned && (
                  <div className="absolute top-2 right-2 text-emerald-500">
                    <CheckCircle2 className="w-4 h-4 fill-emerald-100" />
                  </div>
                )}

                <span className={`text-4xl sm:text-5xl font-black ${item.color} leading-none`}>
                  {item.char}
                </span>

                <div className="text-center">
                  <span className="text-xs font-bold text-slate-700 block">
                    {item.name}
                  </span>
                  <span className="text-xs text-slate-500 flex items-center justify-center gap-1">
                    <span>{item.sampleEmoji}</span>
                    <span>{item.sampleWord}</span>
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
