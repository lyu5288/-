import React, { useState, useEffect } from 'react';
import { WORD_PUZZLES, WordPuzzleItem } from '../data/hangulData';
import { Volume2, Sparkles, RefreshCw, ChevronRight, CheckCircle, Lightbulb } from 'lucide-react';
import { speakKorean, playClickBeep, playSuccessChime, playGentleBoing } from '../utils/sound';
import confetti from 'canvas-confetti';

interface WordPuzzleModeProps {
  onCompleteWord?: () => void;
}

export const WordPuzzleMode: React.FC<WordPuzzleModeProps> = ({ onCompleteWord }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const [placedSyllables, setPlacedSyllables] = useState<(string | null)[]>([]);
  const [availableBlocks, setAvailableBlocks] = useState<{ id: string; text: string }[]>([]);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [solvedWordsCount, setSolvedWordsCount] = useState<number>(0);

  // Filtered puzzle list
  const filteredPuzzles =
    selectedCategory === '전체'
      ? WORD_PUZZLES
      : WORD_PUZZLES.filter((p) => p.category === selectedCategory);

  const currentPuzzle: WordPuzzleItem = filteredPuzzles[currentIndex] || WORD_PUZZLES[0];

  // Initialize or reset puzzle round
  useEffect(() => {
    initRound(currentPuzzle);
  }, [currentIndex, selectedCategory]);

  const initRound = (puzzle: WordPuzzleItem) => {
    setIsSuccess(false);
    setPlacedSyllables(new Array(puzzle.syllables.length).fill(null));

    // Scramble syllables with unique IDs
    const blocks = puzzle.syllables.map((s, idx) => ({
      id: `${puzzle.id}_${idx}_${s}`,
      text: s,
    }));

    // Fisher-Yates shuffle
    const shuffled = [...blocks].sort(() => Math.random() - 0.5);
    setAvailableBlocks(shuffled);

    // Speak initial hint
    speakKorean(`${puzzle.hint} 어떤 글자일까요?`);
  };

  const handleBlockClick = (block: { id: string; text: string }) => {
    if (isSuccess) return;

    // Find first empty slot
    const firstEmptyIndex = placedSyllables.findIndex((slot) => slot === null);
    if (firstEmptyIndex === -1) return;

    playClickBeep();

    const newPlaced = [...placedSyllables];
    newPlaced[firstEmptyIndex] = block.text;
    setPlacedSyllables(newPlaced);

    // Remove from available
    setAvailableBlocks((prev) => prev.filter((b) => b.id !== block.id));

    // Check if fully placed
    const allFilled = newPlaced.every((s) => s !== null);
    if (allFilled) {
      const assembledWord = newPlaced.join('');
      if (assembledWord === currentPuzzle.word) {
        // SUCCESS!
        setIsSuccess(true);
        setSolvedWordsCount((prev) => prev + 1);
        playSuccessChime();
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
        });
        speakKorean(`딩동댕! 정답이에요! ${currentPuzzle.word}! ${currentPuzzle.hint}`);

        if (onCompleteWord) {
          onCompleteWord();
        }
      } else {
        // Try again
        playGentleBoing();
        speakKorean('다시 한번 순서를 맞춰볼까요?');
      }
    }
  };

  const handleSlotClick = (slotIndex: number) => {
    if (isSuccess) return;
    const item = placedSyllables[slotIndex];
    if (!item) return;

    playClickBeep();

    // Return to available pool
    setAvailableBlocks((prev) => [...prev, { id: `${currentPuzzle.id}_return_${Date.now()}_${item}`, text: item }]);

    const newPlaced = [...placedSyllables];
    newPlaced[slotIndex] = null;
    setPlacedSyllables(newPlaced);
  };

  const handleNextPuzzle = () => {
    playClickBeep();
    const nextIdx = (currentIndex + 1) % filteredPuzzles.length;
    setCurrentIndex(nextIdx);
  };

  const handleSpeakHint = () => {
    playClickBeep();
    speakKorean(`${currentPuzzle.word}! ${currentPuzzle.hint}`);
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Category Tabs & Stats */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-amber-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto">
          {['전체', '동물', '과일·음식', '탈것·물건'].map((cat) => (
            <button
              key={cat}
              onClick={() => {
                playClickBeep();
                setSelectedCategory(cat);
                setCurrentIndex(0);
              }}
              className={`px-3.5 py-1.5 rounded-xl font-bold text-sm whitespace-nowrap cursor-pointer transition-colors ${
                selectedCategory === cat
                  ? 'bg-amber-400 text-amber-950 shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-bold text-slate-500">맞춘 낱말:</span>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-black text-sm">
            🎉 {solvedWordsCount}개 성공
          </span>
        </div>
      </div>

      {/* Main Puzzle Card */}
      <div className="bg-white rounded-3xl border-4 border-amber-300 shadow-md p-6 sm:p-8 flex flex-col items-center relative overflow-hidden">
        {/* Item Picture & Hint */}
        <div className="text-center space-y-3">
          <div className="relative inline-block">
            <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-3xl bg-amber-50 border-4 border-amber-200 flex items-center justify-center text-7xl sm:text-8xl shadow-xs animate-bounce-short">
              {currentPuzzle.emoji}
            </div>
            <button
              onClick={handleSpeakHint}
              className="absolute -bottom-2 -right-2 p-2 rounded-2xl bg-amber-400 hover:bg-amber-500 text-amber-950 shadow-xs cursor-pointer transition-transform hover:scale-110"
              title="힌트 소리 듣기"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-1">
            <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-100 px-3 py-0.5 rounded-full">
              <Lightbulb className="w-3.5 h-3.5" />
              {currentPuzzle.category}
            </span>
            <p className="text-slate-700 text-base sm:text-lg font-bold">
              {currentPuzzle.hint}
            </p>
          </div>
        </div>

        {/* Target Empty Slots Area */}
        <div className="my-8">
          <div className="flex items-center justify-center gap-3 sm:gap-4">
            {placedSyllables.map((syllable, index) => {
              const isFilled = syllable !== null;
              return (
                <button
                  key={index}
                  onClick={() => handleSlotClick(index)}
                  className={`w-20 h-20 sm:w-24 sm:h-24 rounded-3xl border-3 flex items-center justify-center text-4xl sm:text-5xl font-black transition-all cursor-pointer ${
                    isFilled
                      ? 'bg-amber-100 border-amber-400 text-amber-950 shadow-sm scale-105'
                      : 'bg-amber-50/50 border-dashed border-amber-300 text-slate-300 hover:border-amber-400'
                  }`}
                  title={isFilled ? '누르면 되돌려요' : '글자가 들어올 자리'}
                >
                  {isFilled ? syllable : index + 1}
                </button>
              );
            })}
          </div>
          <p className="text-center text-xs text-slate-500 font-medium mt-2">
            빈 네모 칸을 채워 단어를 완성해보세요!
          </p>
        </div>

        {/* Available Syllable Blocks Pool */}
        <div className="w-full pt-4 border-t border-slate-100 flex flex-col items-center space-y-3">
          <span className="text-xs font-bold text-slate-500">
            아래 글자 블록을 콕 눌러주세요:
          </span>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 min-h-20">
            {availableBlocks.map((block) => (
              <button
                key={block.id}
                onClick={() => handleBlockClick(block)}
                className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-400 hover:from-amber-500 hover:to-yellow-500 text-amber-950 border-2 border-amber-300 shadow-sm font-black text-3xl sm:text-4xl flex items-center justify-center cursor-pointer transform hover:scale-110 active:scale-95 transition-all"
              >
                {block.text}
              </button>
            ))}

            {availableBlocks.length === 0 && !isSuccess && (
              <span className="text-sm font-bold text-slate-400">
                모든 글자를 넣었어요! 틀렸다면 글자를 눌러 빼보세요.
              </span>
            )}
          </div>
        </div>

        {/* Success Modal / Banner */}
        {isSuccess && (
          <div className="mt-6 w-full max-w-md bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-4 text-center space-y-3 animate-bounce-short">
            <div className="inline-flex items-center gap-1.5 text-emerald-800 font-black text-lg">
              <CheckCircle className="w-6 h-6 text-emerald-600 fill-emerald-200" />
              <span>정답이에요! 참 잘했어요!</span>
            </div>

            <p className="text-emerald-700 text-sm font-bold">
              '{currentPuzzle.word}' 완성! 다음 단어도 도전해볼까요?
            </p>

            <button
              onClick={handleNextPuzzle}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-black text-base shadow-sm cursor-pointer flex items-center justify-center gap-2"
            >
              <span>다음 낱말 맞추기</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Bottom controls: Reset / Skip */}
        {!isSuccess && (
          <div className="mt-6 flex items-center gap-3">
            <button
              onClick={() => {
                playClickBeep();
                initRound(currentPuzzle);
              }}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>다시 하기</span>
            </button>

            <button
              onClick={handleNextPuzzle}
              className="px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <span>다른 낱말 보기</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
