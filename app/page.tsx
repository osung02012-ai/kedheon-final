'use client';

import React, { useState, useEffect } from 'react';

// 1. 제국 자산 데이터 모델
interface Asset { 
  id: number; 
  title: string; 
  desc: string;
  timestamp: string; 
}

export default function KedheonPortal() {
  const [mainTab, setMainTab] = useState<'ROOKIE' | 'PIONEER'>('PIONEER');
  const [subTab, setSubTab] = useState<'FAN' | 'STUDIO'>('FAN');
  const [category, setCategory] = useState('ALL');
  const [qrType, setQrType] = useState<'PERSONAL' | 'BUSINESS'>('PERSONAL');
  const [assets, setAssets] = useState<Asset[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const categories = ['ALL', 'MUSIC', 'SPORTS', 'ACTOR', 'ESPORTS', 'COMEDY'];
  const hubs = ['PI', 'NEXUS', 'AI', 'VENDOR', 'CIVIL', 'FILTER', 'PAPA', '6G'];

  useEffect(() => {
    const saved = localStorage.getItem('kedheon_assets');
    if (saved) setAssets(JSON.parse(saved));
  }, []);

  const registerAsset = () => {
    if (!newTitle.trim()) return;
    const newAsset = { id: Date.now(), title: newTitle, desc: newDesc, timestamp: new Date().toLocaleDateString() };
    const updated = [...assets, newAsset];
    setAssets(updated);
    localStorage.setItem('kedheon_assets', JSON.stringify(updated));
    setNewTitle('');
    setNewDesc('');
  };

  // 이미지 손실 방지를 위한 인라인 SVG 컴포넌트
  const BeomIcon = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#daa520" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  );

  return (
    <div className="flex flex-col items-center bg-black min-h-screen text-white p-6 font-sans w-full overflow-x-hidden">
      
      {/* 최상위 프레임워크: ROOKIE / PIONEER */}
      <div className="flex gap-4 mb-10 mt-10">
        <button onClick={() => setMainTab('ROOKIE')} className={`px-10 py-3 rounded-full font-black text-sm transition-all ${mainTab === 'ROOKIE' ? 'bg-[#daa520] text-black shadow-[0_0_20px_rgba(218,165,32,0.4)]' : 'bg-white/5 border border-white/10 text-gray-500'}`}>ROOKIE</button>
        <button onClick={() => setMainTab('PIONEER')} className={`px-10 py-3 rounded-full font-black text-sm transition-all ${mainTab === 'PIONEER' ? 'bg-[#daa520] text-black shadow-[0_0_20px_rgba(218,165,32,0.4)]' : 'bg-white/5 border border-white/10 text-gray-500'}`}>PIONEER</button>
      </div>

      <div className="w-full max-w-xl">
        {mainTab === 'ROOKIE' ? (
          <div className="flex flex-col items-center text-center py-24 animate-pulse">
            <div className="w-32 h-32 border-4 border-[#daa520] rounded-full flex items-center justify-center mb-8">
              <BeomIcon />
            </div>
            <h1 className="text-5xl font-black text-[#daa520] tracking-tighter mb-4">KEDHEON</h1>
            <p className="text-gray-500 text-sm tracking-[0.3em] uppercase">The Empire of Pioneers</p>
            <button className="mt-16 bg-[#daa520] text-black px-16 py-5 rounded-2xl font-black text-lg">ENTER EMPIRE</button>
          </div>
        ) : (
          <div className="bg-[#0a0a0a] p-8 rounded-[40px] border border-white/10 w-full flex flex-col gap-8 shadow-2xl">
            
            {/* 자산 대시보드 */}
            <div className="bg-gradient-to-br from-[#daa520]/20 to-transparent p-6 rounded-3xl border border-[#daa520]/30 flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-[10px] uppercase tracking-widest mb-1">Total Assets</p>
                <p className="text-[#daa520] font-black text-3xl">8,888.88 <span className="text-xs">BEOM</span></p>
              </div>
              <div className="text-right">
                <p className="text-gray-500 text-[10px] uppercase mb-1">Fan Grade</p>
                <p className="text-white font-black text-2xl">Lv. 88</p>
              </div>
            </div>

            {/* 서브 탭 컨트롤 */}
            <div className="flex gap-2 p-1.5 bg-black rounded-2xl border border-white/5">
              <button onClick={() => setSubTab('FAN')} className={`flex-1 py-3 font-bold rounded-xl text-xs transition-all ${subTab === 'FAN' ? 'bg-[#daa520] text-black' : 'text-gray-600'}`}>COMMUNITY</button>
              <button onClick={() => setSubTab('STUDIO')} className={`flex-1 py-3 font-bold rounded-xl text-xs transition-all ${subTab === 'STUDIO' ? 'bg-[#daa520] text-black' : 'text-gray-600'}`}>STUDIO</button>
            </div>

            {/* 데이터 레이어 콘텐츠 */}
            {subTab === 'FAN' ? (
              <div className="flex flex-col gap-8">
                {/* 1. 카테고리 셀렉터 */}
                <div className="flex flex-wrap gap-2 justify-center py-2">
                  {categories.map(c => (
                    <button key={c} onClick={() => setCategory(c)} className={`px-4 py-1.5 rounded-full text-[10px] font-bold transition-all ${category === c ? 'bg-[#daa520] text-black' : 'bg-white/5 text-gray-500'}`}>{c}</button>
                  ))}
                </div>

                {/* 2. QR 인증 시스템 (8대 허브 위로 재배치) */}
                <div className="bg-black p-8 rounded-3xl border border-[#daa520]/40 text-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-2 opacity-20"><BeomIcon /></div>
                  <h3 className="text-[#daa520] font-black text-xs mb-6 uppercase tracking-widest">Imperial Identity QR</h3>
                  <div className="flex gap-2 justify-center mb-6">
                    <button onClick={() => setQrType('PERSONAL')} className={`px-5 py-2 rounded-lg text-[10px] font-bold ${qrType === 'PERSONAL' ? 'bg-[#daa520] text-black' : 'bg-white/5'}`}>PERSONAL</button>
                    <button onClick={() => setQrType('BUSINESS')} className={`px-5 py-2 rounded-lg text-[10px] font-bold ${qrType === 'BUSINESS' ? 'bg-[#daa520] text-black' : 'bg-white/5'}`}>BUSINESS</button>
                  </div>
                  {/* 이미지 대신 CSS 패턴으로 구현한 QR 가이드 */}
                  <div className="w-28 h-28 bg-white mx-auto mb-4 rounded-xl p-2 flex items-center justify-center">
                    <div className="w-full h-full border-4 border-black border-dashed opacity-30 flex items-center justify-center text-[8px] text-black font-mono">GEN_QR_NODE</div>
                  </div>
                  <p className="text-[10px] font-mono text-gray-500">AUTH_TOKEN: HT-BEOM-888</p>
                </div>

                {/* 3. 8대 생태계 허브 */}
                <div className="grid grid-cols-4 gap-4">
                  {hubs.map(h => (
                    <button key={h} className="flex flex-col items-center gap-2 group">
                      <div className="w-12 h-12 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center text-[10px] text-[#daa520] font-black group-hover:border-[#daa520] transition-all">{h}</div>
                      <span className="text-[9px] text-gray-600 font-bold">{h}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {/* 자산 등록 노드 */}
                <div className="bg-black p-6 rounded-3xl border border-white/10">
                  <h3 className="text-[#daa520] font-black text-xs mb-6 text-center tracking-widest uppercase">Asset Certification</h3>
                  <div className="flex flex-col gap-4">
                    <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="IP 자산 명칭" className="bg-[#151515] p-4 text-sm rounded-xl border border-white/5 focus:border-[#daa520] outline-none" />
                    <textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="자산에 대한 상세 설명 및 데이터 속성" className="bg-[#151515] p-4 text-sm rounded-xl border border-white/5 h-28 focus:border-[#daa520] outline-none resize-none" />
                    <button onClick={registerAsset} className="bg-[#daa520] text-black py-4 rounded-2xl font-black text-sm shadow-xl">제국 공식 자산 등록</button>
                  </div>
                </div>

                {/* 인증 리스트 */}
                <div className="space-y-3">
                  <p className="text-gray-600 text-[10px] font-bold uppercase ml-2">Certified Assets</p>
                  {assets.length === 0 ? (
                    <div className="p-10 text-center text-gray-700 text-xs border border-dashed border-white/10 rounded-3xl">등록된 자산이 없습니다.</div>
                  ) : (
                    assets.map(a => (
                      <div key={a.id} className="bg-white/5 p-4 rounded-2xl border-l-4 border-[#daa520] flex flex-col gap-1">
                        <div className="flex justify-between items-center">
                          <span className="font-black text-sm">{a.title}</span>
                          <span className="text-[#daa520] text-[9px] font-mono">{a.timestamp}</span>
                        </div>
                        <p className="text-[11px] text-gray-500 line-clamp-1">{a.desc}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
