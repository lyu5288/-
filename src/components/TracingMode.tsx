import React, { useRef, useState, useEffect } from 'react';
import { CONSONANTS, VOWELS, HangulLetter } from '../data/hangulData';
import { Eraser, Sparkles, Volume2, ChevronLeft, ChevronRight, Check, Award } from 'lucide-react';
import { speakKorean, playSparkleSound, playSuccessChime, playCheerFanfare, playClickBeep } from '../utils/sound';
import confetti from 'canvas-confetti';

interface TracingModeProps {
  initialLetter?: HangulLetter;
  onCompleteTracing?: () => void;
}

export const TracingMode: React.FC<TracingModeProps> = ({ initialLetter, onCompleteTracing }) => {
  const allLetters = [...CONSONANTS, ...VOWELS];
  const [currentLetter, setCurrentLetter] = useState<HangulLetter>(initialLetter || CONSONANTS[0]);
  const [selectedColor, setSelectedColor] = useState<string>('rainbow');
  const [brushSize, setBrushSize] = useState<number>(24);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [hasDrawn, setHasDrawn] = useState<boolean>(false);
  const [hue, setHue] = useState<number>(0);
  const [completedLetters, setCompletedLetters] = useState<Set<string>>(new Set());

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const sparkleThrottleRef = useRef<number>(0);

  // Sync with prop when changed
  useEffect(() => {
    if (initialLetter) {
      setCurrentLetter(initialLetter);
      clearCanvas();
    }
  }, [initialLetter]);

  // Say letter on switch
  useEffect(() => {
    clearCanvas();
    speakKorean(`${currentLetter.char}! 따라 써보세요!`);
  }, [currentLetter]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const getCanvasCoordinates = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    e.preventDefault();
    setIsDrawing(true);
    setHasDrawn(true);
    const coords = getCanvasCoordinates(e);
    lastPosRef.current = coords;
  };

  const draw = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!isDrawing || !lastPosRef.current) return;
    e.preventDefault();

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const currentPos = getCanvasCoordinates(e);

    ctx.beginPath();
    ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
    ctx.lineTo(currentPos.x, currentPos.y);

    let strokeColor = selectedColor;
    if (selectedColor === 'rainbow') {
      strokeColor = `hsl(${hue}, 90%, 55%)`;
      setHue((prev) => (prev + 7) % 360);
    }

    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    lastPosRef.current = currentPos;

    // Periodic sparkle sound
    const now = Date.now();
    if (now - sparkleThrottleRef.current > 120) {
      playSparkleSound();
      sparkleThrottleRef.current = now;
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    lastPosRef.current = null;
  };

  const handleFinishLetter = () => {
    playCheerFanfare();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.5 },
    });

    const nextCompleted = new Set(completedLetters);
    nextCompleted.add(currentLetter.id);
    setCompletedLetters(nextCompleted);

    speakKorean(`우와! ${currentLetter.char} 글자를 참 멋지게 썼어요! 최고예요!`);

    if (onCompleteTracing) {
      onCompleteTracing();
    }
  };

  const handleNextLetter = () => {
    playClickBeep();
    const currentIndex = allLetters.findIndex((l) => l.id === currentLetter.id);
    const nextIndex = (currentIndex + 1) % allLetters.length;
    setCurrentLetter(allLetters[nextIndex]);
  };

  const handlePrevLetter = () => {
    playClickBeep();
    const currentIndex = allLetters.findIndex((l) => l.id === currentLetter.id);
    const prevIndex = (currentIndex - 1 + allLetters.length) % allLetters.length;
    setCurrentLetter(allLetters[prevIndex]);
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Top Controller Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-amber-200 shadow-xs flex items-center justify-between gap-3">
        <button
          onClick={handlePrevLetter}
          className="px-4 py-2.5 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold flex items-center gap-1 cursor-pointer transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="hidden sm:inline">이전 글자</span>
        </button>

        <div className="text-center">
          <div className="inline-flex items-center gap-2">
            <span className="text-3xl font-black text-amber-900">{currentLetter.char}</span>
            <span className="text-lg font-bold text-slate-700">({currentLetter.name})</span>
            <button
              onClick={() => {
                playClickBeep();
                speakKorean(`${currentLetter.char}! ${currentLetter.sampleWord}!`);
              }}
              className="p-1.5 rounded-full bg-amber-100 text-amber-800 hover:bg-amber-200 transition-colors"
              title="소리 듣기"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            {currentLetter.strokeHints[0]}
          </p>
        </div>

        <button
          onClick={handleNextLetter}
          className="px-4 py-2.5 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold flex items-center gap-1 cursor-pointer transition-colors"
        >
          <span className="hidden sm:inline">다음 글자</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Tracing Canvas Area */}
      <div className="relative bg-white rounded-3xl border-4 border-amber-300 shadow-lg p-4 sm:p-6 flex flex-col items-center">
        {/* Color Palette & Pen Tools */}
        <div className="w-full flex flex-wrap items-center justify-between gap-3 pb-4 mb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">펜 색깔:</span>
            {/* Rainbow pen */}
            <button
              onClick={() => {
                playClickBeep();
                setSelectedColor('rainbow');
              }}
              className={`px-3 py-1.5 rounded-xl font-black text-xs cursor-pointer transition-transform ${
                selectedColor === 'rainbow'
                  ? 'ring-3 ring-amber-400 scale-105 shadow-xs'
                  : 'opacity-80 hover:opacity-100'
              } bg-gradient-to-r from-red-400 via-yellow-400 via-green-400 to-blue-400 text-white drop-shadow-xs`}
            >
              🌈 무지개
            </button>

            {/* Color dots */}
            {[
              { id: '#ef4444', label: '빨강', bg: 'bg-red-500' },
              { id: '#f59e0b', label: '노랑', bg: 'bg-amber-500' },
              { id: '#10b981', label: '초록', bg: 'bg-emerald-500' },
              { id: '#3b82f6', label: '파랑', bg: 'bg-blue-500' },
              { id: '#8b5cf6', label: '보라', bg: 'bg-purple-500' },
            ].map((col) => (
              <button
                key={col.id}
                onClick={() => {
                  playClickBeep();
                  setSelectedColor(col.id);
                }}
                className={`w-7 h-7 rounded-full ${col.bg} transition-transform cursor-pointer ${
                  selectedColor === col.id ? 'ring-3 ring-amber-400 scale-110 shadow-xs' : 'hover:scale-105'
                }`}
                title={col.label}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                playClickBeep();
                clearCanvas();
              }}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Eraser className="w-3.5 h-3.5" />
              <span>지우개</span>
            </button>
          </div>
        </div>

        {/* Canvas Workspace Container */}
        <div className="relative w-full max-w-[420px] aspect-square rounded-2xl bg-amber-50/50 border-2 border-dashed border-amber-200 flex items-center justify-center overflow-hidden touch-none">
          {/* Faint Background Letter Guide */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
            <span
              className="text-[240px] sm:text-[270px] font-black text-amber-300/40 leading-none"
              style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
            >
              {currentLetter.char}
            </span>
          </div>

          {/* Canvas for kid's drawing */}
          <canvas
            ref={canvasRef}
            width={420}
            height={420}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="absolute inset-0 w-full h-full cursor-crosshair z-10"
          />

          {/* Stroke start indicator hint */}
          {!hasDrawn && (
            <div className="absolute top-4 left-4 z-20 pointer-events-none bg-white/90 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-bold text-amber-900 border border-amber-200 shadow-2xs animate-bounce">
              👆 손가락이나 마우스로 쓱싹 그어보세요!
            </div>
          )}
        </div>

        {/* Complete / Praise Button */}
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-3 w-full max-w-[420px]">
          <button
            onClick={handleFinishLetter}
            disabled={!hasDrawn}
            className={`w-full py-4 rounded-2xl font-black text-lg shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 ${
              hasDrawn
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white transform hover:scale-102'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Sparkles className="w-5 h-5" />
            <span>다 썼어요! 칭찬받기 🌟</span>
          </button>
        </div>
      </div>

      {/* Quick Select Letter Strip */}
      <div className="bg-white rounded-3xl p-4 border border-amber-200 shadow-xs space-y-2">
        <span className="text-xs font-bold text-slate-600 block">다른 글자 골라 쓰기:</span>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {allLetters.slice(0, 14).map((l) => (
            <button
              key={l.id}
              onClick={() => {
                playClickBeep();
                setCurrentLetter(l);
              }}
              className={`w-10 h-10 rounded-xl font-black text-base shrink-0 transition-transform cursor-pointer ${
                currentLetter.id === l.id
                  ? 'bg-amber-400 text-amber-950 scale-105 shadow-xs'
                  : 'bg-amber-50 text-slate-700 hover:bg-amber-100'
              }`}
            >
              {l.char}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
