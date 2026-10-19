import React, { useState, useEffect, useRef } from 'react';
import { CONSONANTS, VOWELS, HangulLetter } from '../data/hangulData';
import { Volume2, Sparkles, RefreshCw, Trophy, Star } from 'lucide-react';
import { speakKorean, playPopSound, playSuccessChime, playCheerFanfare, playClickBeep } from '../utils/sound';
import confetti from 'canvas-confetti';

interface BalloonItem {
  id: string;
  char: string;
  name: string;
  color: string;
  x: number; // percentage 10% to 85%
  speed: number;
  isPopping: boolean;
}

interface BalloonPopModeProps {
  onWinGame?: () => void;
}

const BALLOON_COLORS = [
  'from-rose-400 to-red-500 border-rose-300',
  'from-amber-400 to-orange-500 border-amber-300',
  'from-emerald-400 to-teal-500 border-emerald-300',
  'from-sky-400 to-blue-500 border-sky-300',
  'from-purple-400 to-indigo-500 border-purple-300',
  'from-pink-400 to-rose-500 border-pink-300',
];

export const BalloonPopMode: React.FC<BalloonPopModeProps> = ({ onWinGame }) => {
  const [targetLetter, setTargetLetter] = useState<HangulLetter>(CONSONANTS[0]);
  const [balloons, setBalloons] = useState<BalloonItem[]>([]);
  const [poppedCount, setPoppedCount] = useState<number>(0);
  const [targetGoal] = useState<number>(5);
  const [isVictory, setIsVictory] = useState<boolean>(false);
  const animationFrameRef = useRef<number | null>(null);

  // Initialize mission
  useEffect(() => {
    startNewMission();
  }, []);

  const startNewMission = () => {
    setIsVictory(false);
    setPoppedCount(0);

    // Pick random target consonant or vowel
    const pool = [...CONSONANTS.slice(0, 10), ...VOWELS.slice(0, 5)];
    const chosen = pool[Math.floor(Math.random() * pool.length)];
    setTargetLetter(chosen);

    // Spawn 8 balloons initially
    generateBalloons(chosen);

    speakKorean(`미션 시작! '${chosen.char}' 풍선을 다섯 개 터뜨려보세요!`);
  };

  const generateBalloons = (target: HangulLetter) => {
    const lettersPool = [...CONSONANTS.slice(0, 8), ...VOWELS.slice(0, 5)];
    const newBalloons: BalloonItem[] = [];

    // Ensure at least 3 target balloons exist
    for (let i = 0; i < 8; i++) {
      const isTarget = i < 3;
      const letter = isTarget
        ? target
        : lettersPool[Math.floor(Math.random() * lettersPool.length)];

      newBalloons.push({
        id: `balloon_${Date.now()}_${i}_${Math.random()}`,
        char: letter.char,
        name: letter.name,
        color: BALLOON_COLORS[i % BALLOON_COLORS.length],
        x: 10 + (i * 11) % 75,
        speed: 0.8 + Math.random() * 0.5,
        isPopping: false,
      });
    }

    setBalloons(newBalloons);
  };

  const handlePop = (balloon: BalloonItem) => {
    if (balloon.isPopping || isVictory) return;

    playPopSound();

    // Mark as popping
    setBalloons((prev) =>
      prev.map((b) => (b.id === balloon.id ? { ...b, isPopping: true } : b))
    );

    if (balloon.char === targetLetter.char) {
      // Correct!
      const nextCount = poppedCount + 1;
      setPoppedCount(nextCount);
      playSuccessChime();

      if (nextCount >= targetGoal) {
        setIsVictory(true);
        playCheerFanfare();
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.5 },
        });
        speakKorean(`만세! '${targetLetter.char}' 풍선 5개를 모두 터뜨렸어요! 대단해요!`);
        if (onWinGame) onWinGame();
      } else {
        speakKorean(`팡! '${balloon.char}'!`);
      }
    } else {
      speakKorean(`이건 '${balloon.char}' 풍선이에요! '${targetLetter.char}' 풍선을 찾아봐요!`);
    }

    // Replace popped balloon after brief explosion
    setTimeout(() => {
      setBalloons((prev) => {
        const remaining = prev.filter((b) => b.id !== balloon.id);
        const lettersPool = [...CONSONANTS.slice(0, 8), ...VOWELS.slice(0, 5)];
        const shouldBeTarget = Math.random() > 0.4;
        const newLetter = shouldBeTarget
          ? targetLetter
          : lettersPool[Math.floor(Math.random() * lettersPool.length)];

        return [
          ...remaining,
          {
            id: `balloon_${Date.now()}_${Math.random()}`,
            char: newLetter.char,
            name: newLetter.name,
            color: BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)],
            x: 10 + Math.random() * 75,
            speed: 0.8 + Math.random() * 0.5,
            isPopping: false,
          },
        ];
      });
    }, 300);
  };

  const handleSpeakMission = () => {
    playClickBeep();
    speakKorean(`'${targetLetter.char}' 풍선을 찾아 콕 눌러 터뜨려보세요!`);
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Mission HUD Header */}
      <div className="bg-white rounded-3xl p-5 border-2 border-amber-300 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-16 h-16 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center text-4xl font-black shadow-xs">
            {targetLetter.char}
          </div>

          <div>
            <div className="inline-flex items-center gap-2">
              <span className="text-xs font-black text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                목표 글자
              </span>
              <button
                onClick={handleSpeakMission}
                className="p-1 rounded-full bg-amber-50 text-amber-800 hover:bg-amber-100 cursor-pointer"
                title="미션 다시 듣기"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
            <h2 className="text-2xl font-black text-slate-900">
              '{targetLetter.char}' 풍선을 터뜨려요!
            </h2>
          </div>
        </div>

        {/* Progress Stars */}
        <div className="flex items-center gap-2">
          {Array.from({ length: targetGoal }).map((_, i) => (
            <div
              key={i}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                i < poppedCount
                  ? 'bg-amber-400 text-amber-950 shadow-xs scale-110 animate-bounce-short'
                  : 'bg-slate-100 text-slate-300'
              }`}
            >
              <Star className={`w-5 h-5 ${i < poppedCount ? 'fill-amber-900 text-amber-900' : ''}`} />
            </div>
          ))}
        </div>
      </div>

      {/* Floating Balloon Sky Canvas Arena */}
      <div className="relative h-[480px] rounded-3xl bg-gradient-to-b from-sky-200 via-sky-100 to-emerald-100 border-4 border-sky-300 shadow-inner overflow-hidden select-none">
        {/* Sky Background Clouds */}
        <div className="absolute top-6 left-12 text-6xl opacity-40 pointer-events-none">☁️</div>
        <div className="absolute top-16 right-16 text-5xl opacity-40 pointer-events-none">☁️</div>
        <div className="absolute bottom-10 left-1/4 text-6xl opacity-30 pointer-events-none">☁️</div>

        {/* Floating Balloons */}
        {balloons.map((balloon) => {
          return (
            <div
              key={balloon.id}
              onClick={() => handlePop(balloon)}
              style={{
                left: `${balloon.x}%`,
                top: `${20 + (balloon.x * 3.7) % 55}%`,
              }}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform duration-200 ${
                balloon.isPopping ? 'scale-150 opacity-0' : 'hover:scale-110 active:scale-95 animate-float'
              }`}
            >
              {/* Balloon Shape */}
              <div
                className={`relative w-20 h-24 sm:w-24 sm:h-28 rounded-[50%] bg-gradient-to-br ${balloon.color} border-2 shadow-lg flex items-center justify-center text-white`}
              >
                {/* Balloon Highlight Shine */}
                <div className="absolute top-3 left-4 w-4 h-6 rounded-[50%] bg-white/40 transform -rotate-25 pointer-events-none"></div>

                <span className="text-3xl sm:text-4xl font-black drop-shadow-md">
                  {balloon.char}
                </span>

                {/* Balloon Knot & String */}
                <div className="absolute -bottom-2 w-3 h-2 bg-amber-700/60 rounded-xs"></div>
                <div className="absolute -bottom-7 w-0.5 h-6 bg-slate-400/80"></div>
              </div>
            </div>
          );
        })}

        {/* Victory Celebration Overlay */}
        {isVictory && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center z-30 space-y-4 animate-bounce-short">
            <div className="w-20 h-20 rounded-3xl bg-amber-400 text-amber-950 flex items-center justify-center text-5xl shadow-md">
              🏆
            </div>

            <div className="space-y-1">
              <h3 className="text-3xl font-black text-slate-900">
                풍선 팡팡 미션 성공!
              </h3>
              <p className="text-slate-600 text-base font-bold">
                '{targetLetter.char}' 풍선을 5개 모두 터뜨렸어요!
              </p>
            </div>

            <button
              onClick={startNewMission}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-lg shadow-md cursor-pointer flex items-center gap-2 transform hover:scale-105 transition-all"
            >
              <RefreshCw className="w-5 h-5" />
              <span>다음 미션 도전하기!</span>
            </button>
          </div>
        )}
      </div>

      {/* Helper controls */}
      <div className="flex items-center justify-between px-2">
        <span className="text-xs text-slate-500 font-medium">
          🎈 풍선을 손가락이나 마우스로 콕 누르면 팡 터져요!
        </span>

        <button
          onClick={startNewMission}
          className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>새로운 글자 찾기</span>
        </button>
      </div>
    </div>
  );
};
