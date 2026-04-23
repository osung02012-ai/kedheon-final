'use client';
import React, { useState } from 'react';

export default function KedheonPortal() {
  const [tab, setTab] = useState<'ROOKIE' | 'PIONEER'>('ROOKIE');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const myReferralCode = "ohsangjo";
  const piInvitationUrl = `https://minepi.com/${myReferralCode}`;
  const empireUrl = "https://kedheon.com";
  // [팩트] 시스템 전역 QR 노드
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(empireUrl)}`;

  return (
    <div className="flex flex-col items-center justify-start bg-black min-h-screen w-full text-white p-6 font-sans">
      
      {/* 1. 상단 이원화 탭 */}
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
            <button onClick={() => setIsModalOpen(true)} className="mt-10 bg-gradient-to-r from-[#b8860b] to-[#8b4513] px-12 py-5 rounded-2xl text-xl font-black hover:scale-105 transition-transform">
              제국 시민권 신청 (어흥!)
            </button>
          </div>
        ) : (
          /* [웹3 유저 모드] 대시보드 및 서비스 */
          <div className="w-full bg-[#111] p-8 rounded-3xl border border-white/10">
            <h2 className="text-2xl font-bold mb-6 text-[#daa520] border-b border-white/10 pb-4">PIONEER DASHBOARD</h2>
            
            {/* 서비스 카드 섹션 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="bg-black p-4 border border-[#daa520] rounded-xl"><h3 className="text-[#daa520] font-bold text-sm">🚀 제국 노드 서비스</h3><p className="text-[10px] text-gray-400">고성능 노드 운영 보상</p></div>
              <div className="bg-black p-4 border border-[#daa520] rounded-xl"><h3 className="text-[#daa520] font-bold text-sm">🐯 범(Beom) 토큰</h3><p className="text-[10px] text-gray-400">자산 순환 및 거버넌스</p></div>
              <div className="bg-black p-4 border border-[#daa520] rounded-xl"><h3 className="text-[#daa520] font-bold text-sm">🌐 도메인 자산</h3><p className="text-[10px] text-gray-400">핵심 도메인 포트폴리오</p></div>
              <div className="bg-black p-4 border border-[#daa520] rounded-xl"><h3 className="text-[#daa520] font-bold text-sm">💎 VIP 멤버십</h3><p className="text-[10px] text-gray-400">독점 프로젝트 참여권</p></div>
            </div>

            {/* UGC 창작자 센터 */}
            <div className="bg-[#1a1a1a] p-6 rounded-2xl border-2 border-dashed border-[#daa520]/50 text-center">
              <h3 className="text-[#daa520] font-black mb-2">🎤 제국 창작자 센터 (UGC)</h3>
              <p className="text-
