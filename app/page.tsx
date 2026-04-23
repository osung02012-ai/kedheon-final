'use client';
import React, { useState } from 'react';

export default function KedheonPortal() {
  const [tab, setTab] = useState<'ROOKIE' | 'PIONEER'>('ROOKIE');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [category, setCategory] = useState('ALL');
  
  const myReferralCode = "ohsangjo";
  const piInvitationUrl = `https://minepi.com/${myReferralCode}`;
  const empireUrl = "https://kedheon.com";
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(empireUrl)}`;
  const categories = ['ALL', 'MUSIC', 'SPORTS', 'ACTOR', 'ESPORTS', 'COMEDY'];

  return (
    <div className="flex flex-col items-center bg-black min-h-screen text-white p-6 font-sans w-full">
      {/* 1. 이원화 탭 */}
      <div className="flex gap-4 mb-10 mt-10 w-full justify-center">
        <button onClick={() => setTab('ROOKIE')} className={`px-8 py-2 rounded-full font-bold transition-all ${tab === 'ROOKIE' ? 'bg-[#daa520] text-black' : 'bg-white/10'}`}>ROOKIE</button>
        <button onClick={() => setTab('PIONEER')} className={`px-8 py-2 rounded-full font-bold transition-all ${tab === 'PIONEER' ? 'bg-[#daa520] text-black' : 'bg-white/10'}`}>PIONEER</button>
      </div>

      <div className="w-full max-w-2xl">
        {tab === 'ROOKIE' ? (
          /* [ROOKIE 모드] */
          <div className="flex flex-col items-center text-center py-20">
            <img src="/kedheon-character.png" className="w-64" alt="Kedheon" />
            <h1 className="text-4xl font-black mt-6 text-[#daa520]">KEDHEON EMPIRE</h1>
            <button onClick={() => setIsModalOpen(true)} className="mt-10 bg-[#daa520] text-black px-12 py-5 rounded-2xl font-black hover:scale-105">시민권 신청 (어흥!)</button>
          </div>
        ) : (
          /* [PIONEER 모드] 완전 통합 마켓플레이스 */
          <div className="bg-[#111] p-8 rounded-3xl border border-white/10 w-full">
            <div className="mb-8 p-6 bg-gradient-to-b from-[#daa520]/20 to-transparent rounded-2xl text-center border border-[#daa520]/30">
              <h3 className="text-[#daa520] font-black text-xl">🔥 팬심 지수: Lv. 88</h3>
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
              {categories.map(cat => (
                <button key={cat} onClick={() => setCategory(cat)} className={`px-4 py-1 rounded-full text-xs font-bold whitespace-nowrap ${category === cat ? 'bg-[#daa520] text-black' : 'bg-white/10'}`}>{cat}</button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-black p-4 border border-[#daa520] rounded-xl text-center"><p className="text-[10px] text-gray-400">토큰 경제</p><button className="text-xs font-bold">구매 대기열</button></div>
              <div className="bg-black p-4 border border-[#daa520] rounded-xl text-center"><p className="text-[10px] text-gray-400">창작자 센터</p><button className="text-xs font-bold">자산 업로드</button></div>
            </div>

            <div className="bg-black p-6 rounded-2xl border border-[#daa520]/30 mb-8">
              <h3 className="text-center text-xs font-bold text-[#daa520] mb-4">🌐 8대 생태계 허브</h3>
              <div className="grid grid-cols-4 gap-4 text-center">{['PI', 'NEXUS', 'AI', 'VENDOR', 'CIVIL', 'FILTER', 'PAPA', '6G'].map(app => <div key={app} className="flex flex-col items-center"><div className="w-10 h-10 bg-white/5 rounded-full mb-1 border border-white/10" /><span className="text-[9px]">{app}</span></div>)}</div>
            </div>

            <div className="bg-black p-6 rounded-2xl text-center">
              <h3 className="text-[#daa520] font-bold mb-4">내 고유 제국 QR</h3>
              <img src={qrImageUrl} className="w-24 h-24 mx-auto rounded-lg bg-white p-1" />
              <button className="mt-4 text-[10px] underline">내 QR 다운로드</button>
            </div>
          </div>
        )}
      </div>

      {/* [레퍼럴 모달] 완벽 분리 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-6 z-50">
          <div className="bg-[#111] border border-[#daa520] p-8 rounded-2xl max-w-sm w-full text-center">
            <h2 className="text-xl font-bold text-white mb-4">시민권 신청 안내</h2>
            <p className="text-gray-400 text-sm mb-6">초대코드: <span className="text-[#daa520] font-bold">{myReferralCode}</span></p>
            <a href={piInvitationUrl} target="_blank" className="block bg-[#daa520] text-black py-3 rounded-lg font-bold mb-4">파이 네트워크 가입</a>
            <button onClick={() => setIsModalOpen(false)} className="text-gray-500 underline text-sm">닫기</button>
          </div>
        </div>
      )}
    </div>
  );
}
