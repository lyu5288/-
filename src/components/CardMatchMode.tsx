import React, { useState, useEffect } from 'react';
import { CONSONANTS, HangulLetter } from '../data/hangulData';
import { Volume2, Sparkles, RefreshCw, Layers, CheckCircle2 } from 'lucide-react';
import { speakKorean, playClickBeep, playSuccessChime, playCheerFanfare, playGentleBoing } from '../utils/sound';
import confetti from 'canvas-confetti';

interface CardItem {
  uid: string;
  pairKey: string;
  display: string;
  subLabel: string;
  isImage: boolean;
  isFlipped: boolean;
  isMatched: boolean;
  bgColor: string;
}

interface CardMatchModeProps {
  onWinGame?: () => void;
}

export const CardMatchMode: React.FC<CardMatchModeProps> = ({ onWinGame }) => {
  const [difficulty, setDifficulty] = useState<4 | 6>(4); // 4 pairs or 6 pairs
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedUids, setFlippedUids] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isAllMatched, setIsAllMatched] = useState<boolean>(false);
  const [moveCount, setMoveCount] = useState<number>(0);

  useEffect(() => {
    startNewGame(difficulty);
  }, [difficulty]);

  const startNewGame = (pairCount: 4 | 6) => {
    setIsAllMatched(false);
    setFlippedUids([]);
    setIsProcessing(false);
    setMoveCount(0);

    // Pick random consonants for the pairs
    const shuffledConsonants = [...CONSONANTS].sort(() => Math.random() - 0.5);
    const selected = shuffledConsonants.slice(0, pairCount);

    const generatedCards: CardItem[] = [];

    selected.forEach((letter, idx) => {
      // 1. Letter Card
      generatedCards.push({
        uid: `card_letter_${letter.id}_${idx}`,
        pairKey: letter.id,
        display: letter.char,
        subLabel: letter.name,
        isImage: false,
        isFlipped: false,
        isMatched: false,
        bgColor: letter.bgColor,
      });

      // 2. Picture Word Card
      generatedCards.push({
        uid: `card_pic_${letter.id}_${idx}`,
        pairKey: letter.id,
        display: letter.sampleEmoji,
        subLabel: letter.sampleWord,
        isImage: true,
        isFlipped: false,
        isMatched: false,
        bgColor: 'bg-amber-50',
      });
    });

    // Shuffle cards
    const randomized = generatedCards.sort(() => Math.random() - 0.5);
    setCards(randomized);

    speakKorean('똑같은 글자와 그림 짝을 찾아보세요!');
  };

  const handleCardClick = (card: CardItem) => {
    if (isProcessing || card.isFlipped || card.isMatched) return;

    playClickBeep();

    const newFlipped = [...flippedUids, card.uid];

    // Flip this card
    setCards((prev) =>
      prev.map((c) => (c.uid === card.uid ? { ...c, isFlipped: true } : c))
    );

    if (newFlipped.length === 1) {
      setFlippedUids(newFlipped);
      // Speak card value
      speakKorean(card.subLabel || card.display);
    } else if (newFlipped.length === 2) {
      setIsProcessing(true);
      setMoveCount((prev) => prev + 1);

      const firstCard = cards.find((c) => c.uid === newFlipped[0]);
      const secondCard = card;

      if (firstCard && firstCard.pairKey === secondCard.pairKey) {
        // MATCH!
        playSuccessChime();
        speakKorean(`짝짝짝! ${secondCard.subLabel} 짝 맞추기 성공!`);

        setTimeout(() => {
          setCards((prev) => {
            const updated = prev.map((c) =>
              c.pairKey === secondCard.pairKey
                ? { ...c, isMatched: true, isFlipped: true }
                : c
            );

            // Check if all are matched
            const allDone = updated.every((c) => c.isMatched);
            if (allDone) {
              setIsAllMatched(true);
              playCheerFanfare();
              confetti({
                particleCount: 100,
                spread: 80,
                origin: { y: 0.5 },
              });
              speakKorean('우와! 모든 카드를 다 맞췄어요! 기억력 천재예요!');
              if (onWinGame) onWinGame();
            }
            return updated;
          });

          setFlippedUids([]);
          setIsProcessing(false);
        }, 500);
      } else {
        // NOT MATCHED
        playGentleBoing();
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.uid === newFlipped[0] || c.uid === newFlipped[1]
                ? { ...c, isFlipped: false }
                : c
            )
          );
          setFlippedUids([]);
          setIsProcessing(false);
        }, 900);
      }
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Top Controller */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-amber-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Difficulty Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">난이도:</span>
          <button
            onClick={() => {
              playClickBeep();
              setDifficulty(4);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-sm font-black transition-all cursor-pointer ${
              difficulty === 4
                ? 'bg-amber-400 text-amber-950 shadow-xs scale-105'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            🌱 쉬움 (4쌍)
          </button>
          <button
            onClick={() => {
              playClickBeep();
              setDifficulty(6);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-sm font-black transition-all cursor-pointer ${
              difficulty === 6
                ? 'bg-amber-400 text-amber-950 shadow-xs scale-105'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            🌿 보통 (6쌍)
          </button>
        </div>

        {/* Moves & Reset */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-500">
            시도: <strong className="text-amber-900">{moveCount}</strong>번
          </span>

          <button
            onClick={() => startNewGame(difficulty)}
            className="px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>새 게임</span>
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      <div
        className={`grid gap-3 sm:gap-4 ${
          difficulty === 4
            ? 'grid-cols-2 sm:grid-cols-4 max-w-2xl mx-auto'
            : 'grid-cols-3 sm:grid-cols-4'
        }`}
      >
        {cards.map((card) => {
          return (
            <div
              key={card.uid}
              onClick={() => handleCardClick(card)}
              className={`h-36 sm:h-40 rounded-3xl cursor-pointer transition-all duration-300 transform perspective-500 ${
                card.isMatched
                  ? 'ring-4 ring-emerald-400 scale-95 opacity-90'
                  : 'hover:scale-103'
              }`}
            >
              {card.isFlipped ? (
                /* Card Front (Revealed) */
                <div
                  className={`w-full h-full rounded-3xl ${card.bgColor} border-3 border-amber-300 shadow-md p-3 flex flex-col items-center justify-center text-center animate-bounce-short`}
                >
                  <span
                    className={`${
                      card.isImage ? 'text-5xl sm:text-6xl' : 'text-5xl sm:text-6xl font-black text-amber-950'
                    }`}
                  >
                    {card.display}
                  </span>
                  <span className="text-xs sm:text-sm font-black text-amber-900 mt-1">
                    {card.subLabel}
                  </span>
                </div>
              ) : (
                /* Card Back (Hidden) */
                <div className="w-full h-full rounded-3xl bg-gradient-to-br from-amber-400 to-orange-400 border-3 border-amber-300 shadow-sm p-3 flex flex-col items-center justify-center text-center text-white font-black group hover:from-amber-500 hover:to-orange-500">
                  <span className="text-3xl opacity-80 group-hover:scale-110 transition-transform">
                    ❓
                  </span>
                  <span className="text-xs text-amber-950 font-bold mt-1">
                    뒤집기
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Victory Banner */}
      {isAllMatched && (
        <div className="bg-emerald-50 border-3 border-emerald-300 rounded-3xl p-6 text-center space-y-3 animate-bounce-short max-w-md mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-emerald-400 text-white flex items-center justify-center text-3xl mx-auto shadow-sm">
            🎉
          </div>
          <h3 className="text-2xl font-black text-emerald-950">
            모든 짝을 다 찾았어요!
          </h3>
          <p className="text-sm font-bold text-emerald-800">
            {moveCount}번 만에 멋지게 성공했어요!
          </p>

          <button
            onClick={() => startNewGame(difficulty)}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-black text-base shadow-sm cursor-pointer flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            <span>한 번 더 신나게 하기!</span>
          </button>
        </div>
      )}
    </div>
  );
};
