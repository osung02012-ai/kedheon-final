'use client';

import React, { useState } from 'react';

export default function CivilPage() {
  const [lang, setLang] = useState<'KO' | 'EN'>('KO');
  const [checkedIn, setCheckedIn] = useState(false);
  const [points, setPoints] = useState(847);
  const [voted, setVoted] = useState<Record<string, 'YES' | 'NO'>>({});
  const [demanded, setDemanded] = useState<Record<string, boolean>>({});

  const handleCheckin = () => {
    if (checkedIn) return alert('오늘은 이미 출석체크를 완료했습니다.');
    setCheckedIn(true);
    setPoints(p => p + 5);
    alert('출석체크 완료! +5 CP (기여 포인트)가 적립되었습니다.');
  };

  const handleVote = (id: string, choice: 'YES' | 'NO') => {
    if (voted[id]) return alert('이미 투표에 참여하셨습니다 (1인 1표 보장).');
    setVoted(v => ({ ...v, [id]: choice }));
    setPoints(p => p + 1);
    alert(`소중한 1표가 블록체인 원장에 안전하게 각인되었습니다! (+1 CP)`);
  };

  const handleDemand = (mall: string) => {
    if (demanded[mall]) return alert('이미 서명에 참여하셨습니다.');
    setDemanded(d => ({ ...d, [mall]: true }));
    setPoints(p => p + 1);
    alert(`[${mall}] 파이 결제 도입 청원 서명 완료! (+1 CP)`);
  };

  const malls = [
    { name: '쿠팡 (Coupang)', tag: '한국 1위', signers: 14205 },
    { name: '아마존 (Amazon)', tag: '글로벌 1위', signers: 38920 },
    { name: '알리익스프레스 (AliExpress)', tag: '해외직구', signers: 21450 },
    { name: '이베이 (eBay)', tag: '글로벌 P2P', signers: 9840 },
    { name: '테무 (Temu)', tag: '글로벌 커머스', signers: 15300 }
  ];

  return (
    <div className="flex flex-col items-center bg-[#090d16] min-h-screen text-white font-sans w-full pb-28">
      {/* Header */}
      <nav className="w-full max-w-4xl flex justify-between items-center px-4 py-3 sticky top-0 bg-[#090d16]/95 backdrop-blur-md z-50 border-b border-gray-800">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.location.href = '/'}>
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-black text-white text-lg shadow-lg">
            C
          </div>
          <div className="text-left">
            <h1 className="text-white text-base md:text-xl font-black tracking-tight leading-none">Civil</h1>
            <span className="text-blue-400 text-[10px] font-mono tracking-widest uppercase">KYC Voting Protocol</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCheckin}
            className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${checkedIn ? 'bg-gray-800 text-gray-500' : 'bg-blue-600 text-white hover:bg-blue-500 shadow-md active:scale-95'}`}
          >
            {checkedIn ? '출석 완료' : '⚡ 출석체크 (+5 CP)'}
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="px-3 py-1.5 rounded-lg text-xs font-black bg-gray-800 text-gray-300 hover:text-white"
          >
            케드헌 홈
          </button>
        </div>
      </nav>

      {/* Main Container */}
      <main className="w-full max-w-4xl px-4 py-5 space-y-5">
        {/* User Card */}
        <div className="bg-[#111827] border border-gray-800 p-5 rounded-2xl flex justify-between items-center shadow-xl">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
              <p className="text-gray-400 text-xs font-bold">인증된 글로벌 KYC 시민</p>
            </div>
            <h2 className="text-white text-xl md:text-2xl font-black mt-1">1인 1표 직접민주주의</h2>
          </div>
          <div className="text-right">
            <p className="text-gray-400 text-xs font-bold">보유 기여 점수</p>
            <p className="text-blue-400 text-2xl font-black">{points} <span className="text-sm text-gray-400">CP</span></p>
          </div>
        </div>

        {/* Voting Section */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-white text-lg font-black italic border-l-4 border-blue-500 pl-2">
              🛡️ 실시간 주권 투표 (KYC 1인 1표)
            </h3>
            <span className="text-gray-500 text-xs font-bold">위변조 불가 온체인 각인</span>
          </div>

          {/* Agenda 1 */}
          <div className="bg-[#111827] border border-gray-800 p-4 rounded-xl space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="bg-blue-900/50 text-blue-300 text-[10px] font-black px-2 py-0.5 rounded border border-blue-700/50">선거 공정성</span>
                <h4 className="text-white text-sm md:text-base font-black mt-1">
                  부정선거 및 개표 조작 방지를 위한 블록체인 실명 KYC 투표 의무화
                </h4>
              </div>
              <span className="text-gray-500 text-xs font-mono shrink-0">마감 D-4</span>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-blue-400">찬성 88%</span>
                <span className="text-red-400">반대 12%</span>
              </div>
              <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden flex">
                <div className="bg-blue-500 h-full w-[88%]"></div>
                <div className="bg-red-500 h-full w-[12%]"></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => handleVote('poll_1', 'YES')}
                className={`py-2 rounded-lg text-xs font-black transition-all ${voted['poll_1'] === 'YES' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
              >
                👍 찬성 투표
              </button>
              <button
                onClick={() => handleVote('poll_1', 'NO')}
                className={`py-2 rounded-lg text-xs font-black transition-all ${voted['poll_1'] === 'NO' ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
              >
                👎 반대 투표
              </button>
            </div>
          </div>

          {/* Agenda 2 - Tax Hunter */}
          <div className="bg-[#111827] border border-gray-800 p-4 rounded-xl space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="bg-red-900/50 text-red-300 text-[10px] font-black px-2 py-0.5 rounded border border-red-700/50">Tax Hunter</span>
                <h4 className="text-white text-sm md:text-base font-black mt-1">
                  세금 낭비 감시: 지자체 불요불급 전시성 공공 예산 100% 삭감 청원
                </h4>
              </div>
              <span className="text-gray-500 text-xs font-mono shrink-0">마감 D-12</span>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-blue-400">찬성 94%</span>
                <span className="text-red-400">반대 6%</span>
              </div>
              <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden flex">
                <div className="bg-blue-500 h-full w-[94%]"></div>
                <div className="bg-red-500 h-full w-[6%]"></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => handleVote('poll_2', 'YES')}
                className={`py-2 rounded-lg text-xs font-black transition-all ${voted['poll_2'] === 'YES' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
              >
                👍 찬성 투표
              </button>
              <button
                onClick={() => handleVote('poll_2', 'NO')}
                className={`py-2 rounded-lg text-xs font-black transition-all ${voted['poll_2'] === 'NO' ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
              >
                👎 반대 투표
              </button>
            </div>
          </div>
        </div>

        {/* 10 Malls Demand Section */}
        <div className="space-y-3 pt-2">
          <div className="flex justify-between items-center">
            <h3 className="text-white text-lg font-black italic border-l-4 border-amber-500 pl-2">
              🛍️ 글로벌 쇼핑몰 파이 결제 도입 청원
            </h3>
            <span className="text-amber-400 text-xs font-bold">+1 CP 적립</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {malls.map((m, i) => (
              <div key={i} className="bg-[#111827] border border-gray-800 p-3 rounded-xl flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] bg-gray-800 text-gray-300 px-1.5 py-0.5 rounded font-bold">{m.tag}</span>
                    <h5 className="text-white text-xs md:text-sm font-black">{m.name}</h5>
                  </div>
                  <p className="text-gray-500 text-[10px] font-mono mt-0.5">
                    서명 참여: {(m.signers + (demanded[m.name] ? 1 : 0)).toLocaleString()}명
                  </p>
                </div>
                <button
                  onClick={() => handleDemand(m.name)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${demanded[m.name] ? 'bg-gray-800 text-green-400' : 'bg-amber-600 text-white hover:bg-amber-500 active:scale-95 shadow'}`}
                >
                  {demanded[m.name] ? '서명완료 ✓' : '+1 Demand Pi'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Global Footer Navigation */}
      <footer className="fixed bottom-4 left-4 right-4 max-w-4xl mx-auto bg-black border-2 border-gray-800 p-1.5 rounded-2xl flex justify-between gap-1.5 z-50 shadow-2xl font-black">
        {[
          { label: 'KEDHEON', path: '/' },
          { label: 'CIVIL', path: '/civil' },
          { label: 'NEXUS', path: '#' },
          { label: 'VENDOR', path: '#' }
        ].map(item => (
          <button
            key={item.label}
            onClick={() => {
              if (item.path === '#') alert(item.label + ' 서비스 준비 중입니다.');
              else window.location.href = item.path;
            }}
            className={`flex-1 py-3.5 rounded-xl text-xs md:text-sm transition-all font-black text-center cursor-pointer ${item.label === 'CIVIL' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
          >
            {item.label}
          </button>
        ))}
      </footer>
    </div>
  );
}
