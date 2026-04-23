'use client';
import React, { useState } from 'react';

export default function KedheonPortal() {
  const [tab, setTab] = useState<'ROOKIE' | 'PIONEER'>('ROOKIE');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const myReferralCode = "ohsangjo";
  const piInvitationUrl = `https://minepi.com/${myReferralCode}`;
  const empireUrl = "https://kedheon.com";
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(empireUrl)}`;

  return (
    <div className="flex flex-col items-center justify-start bg-black min-h-screen w-full text-white p-6 font-sans">
      
      {/* 1. 상단 이원화 탭 메뉴 */}
      <div className="flex gap-4 mb-10 mt-10">
        <button 
          onClick={() => setTab('ROOKIE')} 
          className={`px-8 py-2 rounded-full font-bold transition-all ${tab === 'ROOKIE' ? 'bg-[#daa520] text-black' : 'bg-white/10 hover:bg-white/20'}`}
        >
          ROOKIE
        </button>
        <button 
          onClick={() => setTab('PIONEER')} 
          className={`px-8 py-2 rounded-full font-bold transition-all ${tab === 'PIONEER' ? 'bg-[#daa520] text-black' : 'bg-white/10 hover:bg-white/20'}`}
        >
          PIONEER
        </button>
      </div>

      {/* 2. 메인 컨텐츠 영역 (분기 로직) */}
      <div className="flex flex-col items-center w-full max-w-2xl">
        {tab === 'ROOKIE' ? (
          /* [웹2 유저 모드] 인도 가이드 */
          <div className="flex flex-col items-center text-center">
            <img src="/kedheon-character.png" alt="Kedheon Empire" className="w-full max-w-[300px] drop-shadow-[0_0_40px_rgba(255,255,255,0.15)]" />
            <h1 className="text-3xl font-black mt-6 tracking-[0.2em] text-[#daa520]">KEDHEON EMPIRE</h1>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="mt-10 bg-gradient-to-r from-[#b8860b] to-[#8b4513] text-white px-12 py-5 rounded-2xl text-xl font-black shadow-[0_0_20px_rgba(184,134,11,0.4)] hover:scale-105 transition-transform"
            >
              제국 시민권 신청 (어흥!)
            </button>
          </div>
        ) : (
          /* [웹3 유저 모드] 전문 대시보드 & 서비스 섹션 */
          <div className="w-full bg-[#111] p-8 rounded-3xl border border-white/10 shadow-[0_0_30px_rgba(218,165,32,0.1)]">
            <h2 className="text-2xl font-bold mb-6 text-[#daa520] border-b border-white/10 pb-4">PIONEER DASHBOARD</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="bg-black p-5 rounded-xl border border-white/5">
                <p className="text-gray-500 text-xs uppercase">Node Status</p>
                <p className="text-green-500 font-bold mt-1 text-lg">ACTIVE (Score: 17.16)</p>
              </div>
              <div className="bg-black p-5 rounded-xl border border-white/5">
                <p className="text-gray-500 text-xs uppercase">Network</p>
                <p className="text-blue-500 font-bold mt-1 text-lg">CONNECTED</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-black p-5 border border-[#daa520] rounded-xl">
                <h3 className="text-[#daa520] font-bold">🚀 제국 노드 서비스</h3>
                <p className="text-gray-400 text-[11px] mt-1">고성능 노드 운영 보상 및 검증 데이터</p>
              </div>
              <div className="bg-black p-5 border border-[#daa520] rounded-xl">
                <h3 className="text-[#daa520] font-bold">🐯 범(Beom) 토큰</h3>
                <p className="text-gray-400 text-[11px] mt-1">제국 내 자산 순환 및 거버넌스 투표권</p>
              </div>
              <div className="bg-black p-5 border border-[#daa520] rounded-xl">
                <h3 className="text-[#daa520] font-bold">🌐 도메인 자산</h3>
                <p className="text-gray-400 text-[11px] mt-1">파이 생태계 핵심 도메인 포트폴리오</p>
              </div>
              <div className="bg-black p-5 border border-[#daa520] rounded-xl">
                <h3 className="text-[#daa520] font-bold">💎 VIP 멤버십</h3>
                <p className="text-gray-400 text-[11px] mt-1">독점 프로젝트 조기 참여권</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. 하단 공통 푸터 (QR 및 인증) */}
      <div className="mt-auto pt-20 pb-10 flex items-center gap-10">
        <div className="w-20 h-20 rounded-full border border-[#daa520] bg-black overflow-hidden">
          <img src="/beom-token.png" alt="Beom" className="w-full h-full object-cover" />
        </div>
        <div className="bg-white p-2 rounded-xl">
          <img src={qrImageUrl} alt="QR" className="w-20 h-20" />
        </div>
      </div>

      {/* 4. 레퍼럴 모달 */}
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
