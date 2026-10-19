import React from 'react';
import { ActiveTab } from './Header';
import { Volume2, Sparkles, Pencil, Puzzle, CircleDot, Layers, Award, ArrowRight } from 'lucide-react';
import { speakKorean, playClickBeep, playSuccessChime } from '../utils/sound';

interface HomeViewProps {
  onSelectTab: (tab: ActiveTab) => void;
  unlockedStickersCount: number;
}

export const HomeView: React.FC<HomeViewProps> = ({ onSelectTab, unlockedStickersCount }) => {
  const handleGreeting = () => {
    playSuccessChime();
    speakKorean('안녕! 호랑이 친구와 함께 신나고 재미있는 한글 놀이터로 떠나볼까?');
  };

  const activities = [
    {
      id: 'explore',
      title: '자음·모음 소리 탐험',
      subtitle: '기역, 니은, 디귿! 소리 듣고 단어 알기',
      icon: Volume2,
      badgeText: '기초 다지기',
      color: 'from-amber-400 to-orange-400',
      textColor: 'text-amber-950',
      borderColor: 'border-amber-200',
      sampleLetters: ['ㄱ', 'ㄴ', 'ㄷ', 'ㅏ', 'ㅑ'],
      emoji: '📢',
    },
    {
      id: 'tracing',
      title: '쓱싹쓱싹 따라 쓰기',
      subtitle: '알록달록 무지개 펜으로 글씨 써보기',
      icon: Pencil,
      badgeText: '손가락 쓰기',
      color: 'from-emerald-400 to-teal-400',
      textColor: 'text-emerald-950',
      borderColor: 'border-emerald-200',
      sampleLetters: ['획순', '무지개펜', '반짝이'],
      emoji: '🎨',
    },
    {
      id: 'puzzle',
      title: '낱말 블록 맞추기',
      subtitle: '글자 블록을 착착 맞춰 사과, 바나나 완성!',
      icon: Puzzle,
      badgeText: '인기 놀이',
      color: 'from-sky-400 to-blue-400',
      textColor: 'text-sky-950',
      borderColor: 'border-sky-200',
      sampleLetters: ['사', '과', '기', '차'],
      emoji: '🧩',
    },
    {
      id: 'balloon',
      title: '통통 풍선 터뜨리기',
      subtitle: '둥실둥실 떠오르는 글자 풍선을 팡팡!',
      icon: CircleDot,
      badgeText: '신나는 게임',
      color: 'from-pink-400 to-rose-400',
      textColor: 'text-pink-950',
      borderColor: 'border-pink-200',
      sampleLetters: ['팡!', '톡!', '별★'],
      emoji: '🎈',
    },
    {
      id: 'match',
      title: '그림 짝 맞추기',
      subtitle: '카드 뒤집어서 똑같은 글자와 그림 찾기',
      icon: Layers,
      badgeText: '두뇌 쑥쑥',
      color: 'from-purple-400 to-indigo-400',
      textColor: 'text-purple-950',
      borderColor: 'border-purple-200',
      sampleLetters: ['카드', '기억력', '쏙쏙'],
      emoji: '🃏',
    },
    {
      id: 'stickers',
      title: '칭찬 스티커 모음판',
      subtitle: '참 잘했어요! 예쁜 황금 별 스티커 모으기',
      icon: Award,
      badgeText: `현재 ${unlockedStickersCount}개 획득`,
      color: 'from-yellow-400 to-amber-300',
      textColor: 'text-amber-950',
      borderColor: 'border-yellow-300',
      sampleLetters: ['참잘했어요', '최고야'],
      emoji: '⭐',
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Wonderland Showcase */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-amber-100 via-orange-50 to-amber-50 border border-amber-200 shadow-sm p-6 sm:p-8 lg:p-10">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/90 rounded-full border border-amber-200 text-amber-900 text-sm font-bold shadow-2xs">
              <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
              <span>3세~7세 맞춤 유아 한글 교육 놀이터</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-amber-950 tracking-tight leading-tight">
              놀면서 쑥쑥 익히는 <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600">
                한글 팡팡 놀이터!
              </span>
            </h1>

            <p className="text-slate-700 text-base sm:text-lg leading-relaxed font-medium">
              보고, 듣고, 손으로 만지며 즐겁게 배우는 한글! <br className="hidden sm:inline" />
              자음과 모음 소리부터 신나는 풍선 팡팡, 낱말 맞추기까지 우리 아이 첫 한글을 함께해요.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  playClickBeep();
                  onSelectTab('explore');
                }}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-lg shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-2 transform hover:-translate-y-0.5"
              >
                <span>지금 시작하기</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={handleGreeting}
                className="px-5 py-3.5 rounded-2xl bg-white hover:bg-amber-50 text-amber-900 border border-amber-200 font-bold text-base shadow-2xs transition-all cursor-pointer flex items-center gap-2"
              >
                <Volume2 className="w-5 h-5 text-amber-600" />
                <span>호랑이 친구 목소리 듣기</span>
              </button>
            </div>
          </div>

          {/* Hero Mascot & Banner Artwork */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-amber-300 to-orange-300 rounded-3xl blur-md opacity-40 group-hover:opacity-70 transition-opacity"></div>
              <div className="relative overflow-hidden rounded-2xl border-4 border-white shadow-xl bg-white max-w-xs sm:max-w-sm">
                <img
                  src="/src/assets/images/mascot_korean_buddy_1792379578534.jpg"
                  alt="한글 호랑이 친구 호야"
                  className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="p-3 bg-amber-50/90 text-center border-t border-amber-100">
                  <span className="text-sm font-black text-amber-900">
                    🐯 안녕! 내 이름은 호야야! 같이 놀자!
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scenic Background Banner Strip */}
        <div className="mt-8 rounded-2xl overflow-hidden border-2 border-amber-200/70 shadow-xs max-h-48 relative">
          <img
            src="/src/assets/images/hangul_wonderland_banner_1792379580230.jpg"
            alt="가나다 놀이터 풍경"
            className="w-full h-48 object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-end p-4">
            <span className="text-white text-sm sm:text-base font-bold drop-shadow-md">
              🌈 신나는 가나다 놀이터에서 오늘 배울 글자를 골라보세요!
            </span>
          </div>
        </div>
      </section>

      {/* Main 5 Activities Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              무엇을 하고 놀까요? 🎈
            </h2>
            <p className="text-slate-600 text-sm font-medium mt-0.5">
              마음에 드는 놀이를 콕 누르면 바로 시작돼요!
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {activities.map((activity) => {
            const IconComponent = activity.icon;
            return (
              <div
                key={activity.id}
                onClick={() => {
                  playClickBeep();
                  onSelectTab(activity.id as ActiveTab);
                }}
                className={`relative group bg-white rounded-3xl p-6 border-2 ${activity.borderColor} hover:border-amber-400 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden transform hover:-translate-y-1`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${activity.color} flex items-center justify-center text-3xl shadow-sm text-white`}
                    >
                      <span>{activity.emoji}</span>
                    </div>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                      {activity.badgeText}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-black text-slate-900 group-hover:text-amber-800 transition-colors">
                      {activity.title}
                    </h3>
                    <p className="text-slate-600 text-sm font-medium mt-1 leading-snug">
                      {activity.subtitle}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold">
                    {activity.sampleLetters.map((s, i) => (
                      <span key={i} className="bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                        {s}
                      </span>
                    ))}
                  </div>

                  <span className="flex items-center gap-1 font-black text-amber-800 group-hover:translate-x-1 transition-transform">
                    놀기 <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Parental & Toddler Learning Advice Note */}
      <section className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5 text-amber-950 flex flex-col sm:flex-row items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-200 flex items-center justify-center text-2xl shrink-0">
          💡
        </div>
        <div className="text-sm font-medium space-y-0.5 text-center sm:text-left">
          <p className="font-bold text-amber-900">부모님 & 선생님 도움말:</p>
          <p className="text-amber-800/90 leading-relaxed">
            아이와 함께 소리를 들으며 입 모양을 따라 해보세요. 글자를 틀려도 괜찮아요! 
            충분한 칭찬과 격려가 아이의 한글 자신감을 키워줍니다.
          </p>
        </div>
      </section>
    </div>
  );
};
