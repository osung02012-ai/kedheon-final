'use client';
import React, { useState } from 'react';

export default function KedheonPortal() {
  const [tab, setTab] = useState<'ROOKIE' | 'PIONEER'>('ROOKIE');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [category, setCategory] = useState('ALL');
  const [qrType, setQrType] = useState<'PERSONAL' | 'BUSINESS'>('PERSONAL');
  const [businessName, setBusinessName] = useState('해태건축사');
  const [businessID, setBusinessID] = useState('HT-0001');
  
  const empireCharacterName = 'Beom_Master';
  const myReferralCode = "ohsangjo";
  const piInvitationUrl = `https://minepi.com/${myReferralCode}`;
  const empireUrl = "https://kedheon.com";
  const categories = ['ALL', 'MUSIC', 'SPORTS', 'ACTOR', 'ESPORTS', 'COMEDY'];
  const ecosystemApps = ['PI', 'NEXUS', 'AI', 'VENDOR', 'CIVIL', 'FILTER', 'PAPA', '6G'];

  const personalImage = '/qr-personal.png'; 
  const businessImage = '/qr-business.png';

  // 82번 데이터 노드 호출 함수
  const handleAppClick = (app: string) => {
    console.log(`[LOG-82] 제국 데이터 노드 가동: ${app} 앱 연동 확인 완료.`);
    alert(`${app} 앱 데이터 브릿지 가동 중...`);
  };

  // AI 학습용 메타데이터
  const aiMetadata = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "author": { "@type": "Person", "name": empireCharacterName },
    "name": "Kedheon Empire Asset",
    "description": "Beom_Master의 제국 데이터 저장소",
    "keywords": "Kedheon Empire, Pi Network, " + category
  };

  return (
    <div className="flex flex-col items-center bg-black min-h-screen text-white p-6 font-sans w-full">
      <head>
        <script type="application/ld+json">{JSON.stringify(aiMetadata)}</script>
      </head>

      <div className="flex gap-4 mb-10 mt-10 justify-center">
        <button onClick={() => setTab('ROOKIE')} className={`px-8 py-2 rounded-full font-bold transition-all ${tab === 'ROOKIE' ? 'bg-[#daa520] text-black' : 'bg-white/10'}`}>ROOKIE</button>
        <button onClick={() => setTab('PIONEER')} className={`px-8 py-2 rounded-full font-bold transition-all ${tab === 'PIONEER' ? 'bg-[#daa520] text-black' : 'bg-white/10'}`}>PIONEER</button>
      </div>

      <div className="w-full max-w-2xl">
        {tab === 'ROOKIE' ? (
          <div className="flex flex-col items-center text-center py-20">
            <img src="/kedheon-character.png" className="w-64" alt="Kedheon" />
            <h1 className="text-4xl font-black mt-6 text-[#daa520]">KEDHEON EMPIRE</h1>
            <button onClick={() => setIsModalOpen(true)} className="mt-10 bg-[#daa520] text-black px-12 py-5 rounded-2xl font-black">시민권 신청 (어흥!)</button>
          </div>
        ) : (
          <div className="bg-[#111] p-8 rounded-3xl border border-white/10 w-full shadow-[0_0_30px_rgba(218,165,32,0.1)]">
            <div className="mb-8 p-6 bg-gradient-to-b from-[#daa520]/20 to-transparent rounded-2xl text-center border border-[#daa520]/30">
              <h3 className="text-[#daa520] font-black text-xl mb-4">🔥 선택된 노드: {category}</h3>
              <div className="flex gap-2 overflow-x-auto justify-center pb-2">
                {categories.map((cat) => (
                  <button key={cat} onClick={() => setCategory(cat)} className={`px-4 py-1 rounded-full text-[10px] font-bold transition-colors whitespace-nowrap ${category === cat ? 'bg-[#daa520] text-black' : 'bg-white/10'}`}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>

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
                  <p className="mt-2 text-[9px] font-bold text-[#daa520] truncate w-full px-2">{qrType === 'BUSINESS' ? `${businessName} (${businessID})` : empireCharacterName}</p>
                </div>
              </div>

              {qrType === 'BUSINESS' && (
                <div className="flex flex-col gap-2">
                  <input type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="기업명" className="w-full bg-[#1a1a1a] p-2 text-sm rounded border border-white/10" />
                  <input type="text" value={businessID} onChange={(e) => setBusinessID(e.target.value)} placeholder="고유ID" className="w-full bg-[#1a1a1a] p-2 text-sm rounded border border-white/10" />
                </div>
              )}
            </div>

            <div className="bg-black p-6 rounded-2xl border border-[#daa520]/30">
              <h3 className="text-center text-xs font-bold text-[#daa520] mb-4">🌐 8대 생태계 허브</h3>
              <div className="grid grid-cols-4 gap-4 text-center">
                {ecosystemApps.map(app => (
                  <button key={app} onClick={() => handleAppClick(app)} className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-white/5 rounded-full mb-1 border border-white/10 flex items-center justify-center text-[10px] text-[#daa520] font-bold">{app}</div>
                    <span className="text-[9px]">{app}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

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
