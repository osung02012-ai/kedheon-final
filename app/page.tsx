'use client';
import React, { useState } from 'react';

export default function KedheonPortal() {
  const [tab, setTab] = useState<'ROOKIE' | 'PIONEER'>('ROOKIE');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [category, setCategory] = useState('ALL');
  const [qrType, setQrType] = useState<'PERSONAL' | 'BUSINESS'>('PERSONAL');
  
  // 데이터 관리 상태값
  const [businessName, setBusinessName] = useState('해태건축사');
  const [businessID, setBusinessID] = useState('HT-0001'); // 고유 기업 식별자
  
  const empireCharacterName = 'Beom_Master'; // 주군의 절대 식별자
  const myReferralCode = "ohsangjo";
  const piInvitationUrl = `https://minepi.com/${myReferralCode}`;
  const empireUrl = "https://kedheon.com";
  
  // 에셋 경로
  const personalImage = '/qr-personal.png'; 
  const businessImage = '/qr-business.png';

  return (
    <div className="flex flex-col items-center bg-black min-h-screen text-white p-6 font-sans w-full">
      {/* 1. 상단 이원화 탭 */}
      <div className="flex gap-4 mb-10 mt-10 justify-center">
        <button onClick={() => setTab('ROOKIE')} className={`px-8 py-2 rounded-full font-bold transition-all ${tab === 'ROOKIE' ? 'bg-[#daa520] text-black' : 'bg-white/10'}`}>ROOKIE</button>
        <button onClick={() => setTab('PIONEER')} className={`px-8 py-2 rounded-full font-bold transition-all ${tab === 'PIONEER' ? 'bg-[#daa520] text-black' : 'bg-white/10'}`}>PIONEER</button>
      </div>

      <div className="w-full max-w-2xl">
        {tab === 'ROOKIE' ? (
          <div className="flex flex-col items-center text-center py-20">
            <img src="/kedheon-character.png" className="w-64" alt="Kedheon" />
            <h1 className="text-4xl font-black mt-6 text-[#daa520]">KEDHEON EMPIRE</h1>
            <button onClick={() => setIsModalOpen(true)} className="mt-10 bg-[#daa520] text-black px-12 py-5 rounded-2xl font-black hover:scale-105">제국 시민권 신청 (어흥!)</button>
          </div>
        ) : (
          <div className="bg-[#111] p-8 rounded-3xl border border-white/10 w-full shadow-[0_0_30px_rgba(218,165,32,0.1)]">
            {/* 팩트 데이터 레이어 */}
            <div className="mb-8 p-6 bg-gradient-to-b from-[#daa520]/20 to-transparent rounded-2xl text-center border border-[#daa520]/30">
              <h3 className="text-[#daa520] font-black text-xl">🔥 제국 활동 노드: {qrType === 'PERSONAL' ? empireCharacterName : businessName}</h3>
            </div>
            
            {/* [QR 발급 노드: 주군 고정 식별자 및 기업 ID/이미지 스위칭] */}
            <div className="bg-black p-6 rounded-2xl border border-[#daa520]/30 mb-8 text-center">
              <h3 className="text-[#daa520] font-bold mb-4">제국 인증 QR 발급</h3>
              <div className="flex gap-2 justify-center mb-4">
                <button onClick={() => setQrType('PERSONAL')} className={`px-4 py-1 rounded text-[10px] ${qrType === 'PERSONAL' ? 'bg-[#daa520] text-black' : 'bg-white/10'}`}>개인 신분</button>
                <button onClick={() => setQrType('BUSINESS')} className={`px-4 py-1 rounded text-[10px] ${qrType === 'BUSINESS' ? 'bg-[#daa520] text-black' : 'bg-white/10'}`}>기업/결제</button>
              </div>

              <div className="relative w-full max-w-[250px] mx-auto mb-4 aspect-square overflow-hidden rounded-xl border border-white/10">
                <img src={qrType === 'PERSONAL' ? personalImage : businessImage} className="absolute inset-0 w-full h-full object-cover" alt="QR Asset" />
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-4">
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(empireUrl + '/?type=' + qrType + '&id=' + (qrType === 'BUSINESS' ? businessID : empireCharacterName))}`} className="w-20 h-20 bg-white p-1 rounded" alt="QR" />
                  <p className="mt-2 text-[9px] font-bold text-[#daa520] truncate w-full px-2">
                    {qrType === 'BUSINESS' ? `${businessName} (${businessID})` : empireCharacterName}
                  </p>
                </div>
              </div>

              {qrType === 'BUSINESS' && (
                <div className="flex flex-col gap-2">
                  <input type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="기업명" className="w-full bg-[#1a1a1a] p-2 text-sm rounded border border-white/10" />
                  <input type="text" value={businessID} onChange={(e) => setBusinessID(e.target.value)} placeholder="기업 고유ID" className="w-full bg-[#1a1a1a] p-2 text-sm rounded border border-white/10" />
                </div>
              )}
            </div>

            {/* 허브 */}
            <div className="bg-black p-6 rounded-2xl border border-[#daa520]/30">
              <h3 className="text-center text-xs font-bold text-[#daa520] mb-4">🌐 8대 생태계 허브</h3>
              <div className="grid grid-cols-4 gap-4 text-center">{['PI', 'NEXUS', 'AI', 'VENDOR', 'CIVIL', 'FILTER', 'PAPA', '6G'].map(app => <div key={app} className="flex flex-col items-center"><div className="w-10 h-10 bg-white/5 rounded-full mb-1 border border-white/10" /><span className="text-[9px]">{app}</span></div>)}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
