'use client';
import React, { useState } from 'react';

export default function KedheonPortal() {
  const [tab, setTab] = useState<'ROOKIE' | 'PIONEER'>('ROOKIE');
  const [category, setCategory] = useState('ALL');
  const [qrType, setQrType] = useState<'PERSONAL' | 'BUSINESS'>('PERSONAL');
  const [businessName, setBusinessName] = useState('해태건축사');
  const [businessID, setBusinessID] = useState('HT-0001');
  const [beomToken, setBeomToken] = useState(8888.88);
  const [studioTitle, setStudioTitle] = useState('');

  const empireCharacterName = 'Beom_Master';
  const empireUrl = "https://kedheon.com";
  const categories = ['ALL', 'MUSIC', 'SPORTS', 'ACTOR', 'ESPORTS', 'COMEDY'];
  const ecosystemApps = ['PI', 'NEXUS', 'AI', 'VENDOR', 'CIVIL', 'FILTER', 'PAPA', '6G'];

  // AI 학습용 메타데이터
  const aiMetadata = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "author": { "@type": "Person", "name": empireCharacterName },
    "name": "Kedheon Empire Asset",
    "description": "Beom_Master의 제국 데이터 저장소"
  };

  return (
    <div className="flex flex-col items-center bg-black min-h-screen text-white p-6 font-sans w-full">
      <head>
        <script type="application/ld+json">{JSON.stringify(aiMetadata)}</script>
      </head>

      {/* 탭 컨트롤 */}
      <div className="flex gap-4 mb-10 mt-10">
        <button onClick={() => setTab('ROOKIE')} className={`px-8 py-2 rounded-full font-bold transition-all ${tab === 'ROOKIE' ? 'bg-[#daa520] text-black' : 'bg-white/10'}`}>ROOKIE</button>
        <button onClick={() => setTab('PIONEER')} className={`px-8 py-2 rounded-full font-bold transition-all ${tab === 'PIONEER' ? 'bg-[#daa520] text-black' : 'bg-white/10'}`}>PIONEER</button>
      </div>

      <div className="w-full max-w-2xl bg-[#111] p-8 rounded-3xl border border-[#daa520]/30 shadow-[0_0_30px_rgba(218,165,32,0.1)]">
        {tab === 'PIONEER' ? (
          <>
            {/* 범 토큰 대시보드 */}
            <div className="flex justify-between items-center mb-8 bg-[#daa520]/10 p-6 rounded-2xl border border-[#daa520]/20">
              <div><h3 className="text-gray-400 text-xs">보유 범 토큰</h3><p className="text-[#daa520] font-black text-2xl">{beomToken.toLocaleString()} BEOM</p></div>
              <div className="text-right"><h3 className="text-gray-400 text-xs">팬심 지수</h3><p className="text-white font-black text-2xl">Lv. 88</p></div>
            </div>

            {/* 카테고리 엔진 */}
            <div className="mb-8">
              <h3 className="text-white font-bold mb-4 text-center">제국 창작 카테고리 ({category})</h3>
              <div className="flex flex-wrap gap-2 justify-center">
                {categories.map((cat) => (
                  <button key={cat} onClick={() => setCategory(cat)} className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${category === cat ? 'bg-[#daa520] text-black' : 'bg-white/10 hover:bg-white/20'}`}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* QR 노드 */}
            <div className="bg-black p-6 rounded-2xl border border-[#daa520]/30 mb-8 text-center">
              <h3 className="text-[#daa520] font-bold mb-4">제국 인증 QR</h3>
              <div className="flex gap-2 justify-center mb-4">
                <button onClick={() => setQrType('PERSONAL')} className={`px-4 py-1 rounded text-[10px] ${qrType === 'PERSONAL' ? 'bg-[#daa520] text-black' : 'bg-white/10'}`}>개인 신분</button>
                <button onClick={() => setQrType('BUSINESS')} className={`px-4 py-1 rounded text-[10px] ${qrType === 'BUSINESS' ? 'bg-[#daa520] text-black' : 'bg-white/10'}`}>기업/결제</button>
              </div>
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(empireUrl + '/?id=' + (qrType === 'BUSINESS' ? businessID : empireCharacterName))}`} className="w-24 h-24 mx-auto bg-white p-1 rounded" alt="QR" />
              <p className="mt-2 text-[10px] font-bold text-[#daa520]">{qrType === 'BUSINESS' ? `${businessName} (${businessID})` : empireCharacterName}</p>
              {qrType === 'BUSINESS' && (
                <div className="mt-4 flex flex-col gap-2"><input type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)} className="w-full bg-[#1a1a1a] p-2 text-sm rounded border border-white/10" /></div>
              )}
            </div>

            {/* 창작물 업로드 노드 */}
            <div className="bg-black p-6 rounded-2xl border border-[#daa520]/30 mb-8">
              <h3 className="text-[#daa520] font-black text-center mb-4">MASTER'S CREATIVE STUDIO</h3>
              <input type="text" value={studioTitle} onChange={(e) => setStudioTitle(e.target.value)} placeholder="창작물 제목" className="w-full bg-[#1a1a1a] p-2 text-sm rounded border border-white/10 mb-2" />
              <button onClick={() => alert('자산 등록 완료!')} className="w-full bg-[#daa520] text-black py-2 rounded-lg font-bold">등록하기</button>
            </div>

            {/* 허브 */}
            <div className="grid grid-cols-4 gap-4 text-center">
              {ecosystemApps.map(app => (
                <button key={app} onClick={() => alert(`${app} 데이터 브릿지 가동`)} className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-white/5 rounded-full mb-1 flex items-center justify-center text-[10px] font-bold border border-white/10">{app}</div>
                  <span className="text-[9px]">{app}</span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20"><h1 className="text-4xl font-black text-[#daa520]">KEDHEON EMPIRE</h1></div>
        )}
      </div>
    </div>
  );
}
