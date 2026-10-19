import React from 'react';
import { StickerItem } from '../data/hangulData';
import { Award, Sparkles, CheckCircle2, Lock } from 'lucide-react';
import { speakKorean, playSuccessChime, playClickBeep } from '../utils/sound';
import confetti from 'canvas-confetti';

interface StickerBoardProps {
  stickers: StickerItem[];
  onGoToGame: (tabKey: string) => void;
}

export const StickerBoard: React.FC<StickerBoardProps> = ({ stickers, onGoToGame }) => {
  const unlockedCount = stickers.filter((s) => s.unlocked).length;

  const handleTapSticker = (sticker: StickerItem) => {
    if (sticker.unlocked) {
      playSuccessChime();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
      speakKorean(`참 잘했어요! ${sticker.title}! ${sticker.description}`);
    } else {
      playClickBeep();
      speakKorean(`이 스티커는 ${sticker.description} 성공하면 받을 수 있어요!`);
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-300 rounded-3xl p-6 sm:p-8 border-4 border-amber-300 shadow-md text-amber-950 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/80 rounded-full text-xs font-black text-amber-900 shadow-2xs">
            <Sparkles className="w-4 h-4 text-amber-600 fill-amber-500" />
            <span>참 잘했어요 칭찬 보관함</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-amber-950">
            나의 반짝반짝 스티커판 ⭐
          </h2>

          <p className="text-amber-900/90 text-sm sm:text-base font-bold">
            놀이를 하나씩 완료할 때마다 예쁜 칭찬 스티커를 받아요!
          </p>

          <div className="pt-2">
            <span className="inline-block px-4 py-1.5 rounded-2xl bg-white/95 text-amber-900 font-black text-sm shadow-xs">
              모은 스티커: {unlockedCount} / {stickers.length}개
            </span>
          </div>
        </div>

        {/* Badge Mascot Visual */}
        <div className="w-32 h-32 sm:w-36 sm:h-36 shrink-0 relative">
          <img
            src="/src/assets/images/sticker_praise_badge_1792379580562.jpg"
            alt="황금 칭찬 별 훈장"
            className="w-full h-full object-contain filter drop-shadow-md animate-bounce-short"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* Stickers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {stickers.map((sticker) => {
          return (
            <div
              key={sticker.id}
              onClick={() => handleTapSticker(sticker)}
              className={`relative rounded-3xl p-5 border-3 transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-2xs ${
                sticker.unlocked
                  ? 'bg-white border-amber-300 hover:border-amber-400 hover:shadow-md transform hover:-translate-y-1'
                  : 'bg-slate-100/80 border-slate-200 opacity-70 hover:opacity-90'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-xs ${
                      sticker.unlocked
                        ? 'bg-amber-100 text-amber-900'
                        : 'bg-slate-200 text-slate-400'
                    }`}
                  >
                    <span>{sticker.icon}</span>
                  </div>

                  {sticker.unlocked ? (
                    <span className="inline-flex items-center gap-1 text-xs font-black text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      획득!
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">
                      <Lock className="w-3.5 h-3.5" />
                      도전 중
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    {sticker.title}
                  </h3>
                  <p className="text-slate-600 text-xs font-medium mt-1 leading-snug">
                    {sticker.description}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 mt-3 text-right">
                <span className="text-xs font-bold text-amber-800">
                  {sticker.unlocked ? '콕 누르면 칭찬 듣기 🔊' : '놀이하러 가기 👉'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
