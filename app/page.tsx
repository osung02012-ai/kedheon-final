'use client';
import React, { useState } from 'react';

export default function KedheonPortal() {
  const [tab, setTab] = useState<'ROOKIE' | 'PIONEER'>('ROOKIE');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const myReferralCode = "ohsangjo";
  const piInvitationUrl = `https://minepi.com/${myReferralCode}`;
  const empireUrl = "https://kedheon.com";
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(empireUrl)}`;

  return (
    <div className="flex flex-col items-center justify-start bg-black min-h-screen w-full text-white p-6 font-sans">
      
      {/* 1. 상단 이원화 탭 메뉴 */}
      <div className="flex gap-4 mb-10 mt-10">
        <button onClick={() => setTab('ROOKIE')} className={`px-8 py-2 rounded-full font-bold transition-all ${tab === 'ROOKIE' ? 'bg-[#daa520] text-black' : 'bg-white/10'}`}>ROOKIE</button>
        <button onClick={() => setTab('PIONEER')} className={`px-8 py-2 rounded-full font-bold transition-all ${tab === 'PIONEER' ? 'bg-[#daa520] text-black' : 'bg-white/10'}`}>PIONEER</button>
      </div>

      <div className="flex flex-col items-center w-full max-w-2xl">
        {tab === 'ROOKIE' ? (
          /* [웹2 유저 모드] 가이드 */
          <div className="flex flex-col items-center text-center">
            <img src="/kedheon-character.png" alt="Kedheon" className="w-full max-w-[300px] drop-shadow-[0_0_40px_rgba(255,255,255,0.15)]" />
            <h1 className="text-3xl font-black mt-6 tracking-[0.2em] text-[#daa520]">KEDHEON EMPIRE</h1>
            <button onClick={() => setIsModalOpen(true)} className="mt-10 bg-gradient-to-r from-[#b8860b] to-[#8b4513] px-12 py-5 rounded-2xl text-xl font-black hover:scale-105 transition-transform">제국 시민권 신청 (어흥!)</button>
          </div>
        ) : (
          /* [웹3 유저 모드] 8대 앱 연동 + 팬심 + UGC + QR + 토큰 경제 */
          <div className="w-full bg-[#111] p-8 rounded-3xl border border-white/10 shadow-[0_0_30px_rgba(218,165,32,0.1)]">
            
            {/* [팬심 레이어] */}
            <div className="mb-8 p-6 bg-gradient-to-b from-[#daa520]/20 to-transparent rounded-2xl text-center border border-[#daa520]/30">
              <h3 className="text-[#daa520] font-black text-xl mb-1">🔥 주군을 향한 팬심 지수</h3>
              <p className="text-white text-3xl font-black">Lv. 88 (Royal Pioneer)</p>
            </div>

            <h2 className="text-2xl font-bold mb-6 text-[#daa520] border-b border-white/10 pb-4">PIONEER DASHBOARD</h2>
            
            {/* [8대 앱 연동 허브] */}
            <div className="mb-8 bg-black p-6 rounded-2xl border border-[#daa520]/30">
              <h3 className="text-[#daa520] font-black text-sm mb-4 text-center">🌐 제국 제휴 생태계 (8대 앱)</h3>
              <div className="grid grid-cols-4 gap-2 text-center">
                {['KEDHEON', 'NEXUS', 'AI', 'VENDOR', 'CIVIL', 'FILTER', 'PAPA', '6G'].map((app) => (
                  <div key={app} className="flex flex-col items-center"><div className="w-10 h-10 bg-white/5 rounded-full mb-1 border border-white/10" /><span className="text-[9px] text-gray-400">{app}</span></div>
                ))}
              </div>
            </div>

            {/* [서비스 카드 레이어] */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="bg-black p-4 border border-[#daa520] rounded-xl"><h3 className="text-[#daa520] font-bold text-xs">🚀 노드 서비스</h3></div>
              <div className="bg-black p-4 border border-[#daa520] rounded-xl"><h3 className="text-[#daa520] font-bold text-xs">🐯 범(Beom) 토큰</h3></div>
              <div className="bg-black p-4 border border-[#daa520] rounded-xl"><h3 className="text-[#daa520] font-bold text-xs">🌐 도메인 자산</h3></div>
              <div className="bg-black p-4 border border-[#daa520] rounded-xl"><h3 className="text-[#daa520] font-bold text-xs">💎 VIP 멤버십</h3></div>
            </div>

            {/* [토큰 구매 및 UGC 창작자 센터] */}
            <div className="mb-8 bg-gradient-to-r from-[#daa520]/20 to-black p-6 rounded-2xl border border-[#daa520]/30 text-center">
              <h3 className="text-[#daa520] font-black text-lg mb-2">💎 범(Beom) 토큰 경제</h3>
              <button className="w-full bg-white text-black py-2 rounded-lg font-bold mb-6">구매 대기열 등록</button>
              <h3 className="text-[#daa520] font-black mb-2">🎤 제국 창작자 센터 (UGC)</h3>
              <button className="w-full bg-[#daa520] text-black py-2 rounded-lg font-bold">내 자산 업로드</button>
            </div>

            {/* [고유 QR 발급 노드] */}
            <div className="bg-black p-6 rounded-2xl border border-white/5 text-center">
              <h3 className="text-[#daa520] font-bold mb-4">내 고유 제국 QR</h3>
              <img src={qrImageUrl} className="w-24 h-24 mx-auto rounded-lg bg-white p-1" />
            </div>
          </div>
        )}
      </div>

      {/* 레퍼럴 모달 */}
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
