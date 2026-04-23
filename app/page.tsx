'use client';
import React, { useState, useEffect } from 'react';

export default function KedheonPortal() {
  const [view, setView] = useState<'FAN' | 'STUDIO'>('FAN');
  const [category, setCategory] = useState('ALL');
  const [assets, setAssets] = useState<{id: number, title: string}[]>([]);
  const [newTitle, setNewTitle] = useState('');
  
  const categories = ['ALL', 'MUSIC', 'SPORTS', 'ACTOR', 'ESPORTS', 'COMEDY'];
  const hubs = ['PI', 'NEXUS', 'AI', 'VENDOR', 'CIVIL', 'FILTER', 'PAPA', '6G'];

  useEffect(() => {
    const saved = localStorage.getItem('kedheon_assets');
    if (saved) setAssets(JSON.parse(saved));
  }, []);

  const registerAsset = () => {
    if (!newTitle.trim()) return;
    const updated = [...assets, { id: Date.now(), title: newTitle }];
    setAssets(updated);
    localStorage.setItem('kedheon_assets', JSON.stringify(updated));
    setNewTitle('');
  };

  return (
    <div className="bg-black min-h-screen text-white p-6 font-sans w-full max-w-2xl mx-auto">
      {/* 1. 상단 통치 대시보드 */}
      <div className="bg-[#daa520]/10 p-6 rounded-3xl border border-[#daa520]/30 mb-8 flex justify-between">
        <div><h3 className="text-xs text-gray-400">보유 범 토큰</h3><p className="text-[#daa520] font-black text-2xl">8,888.88 BEOM</p></div>
        <button className="bg-[#daa520] text-black px-6 py-2 rounded-xl font-bold">Buy Token</button>
      </div>

      {/* 2. 메인 탭 */}
      <div className="flex gap-4 mb-8">
        <button onClick={() => setView('FAN')} className={`flex-1 py-3 font-bold rounded-xl ${view === 'FAN' ? 'bg-[#daa520] text-black' : 'bg-white/10'}`}>Community</button>
        <button onClick={() => setView('STUDIO')} className={`flex-1 py-3 font-bold rounded-xl ${view === 'STUDIO' ? 'bg-[#daa520] text-black' : 'bg-white/10'}`}>Studio</button>
      </div>

      {/* 3. 통합 콘텐츠 레이어 */}
      {view === 'FAN' ? (
        <section className="space-y-8">
          {/* 카테고리 선택 노드 */}
          <div className="p-6 border border-white/10 rounded-3xl bg-[#111]">
            <h3 className="text-[#daa520] font-bold text-center mb-4">선택된 노드: {category}</h3>
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map(c => <button key={c} onClick={() => setCategory(c)} className={`px-4 py-1 rounded-full text-xs font-bold ${category === c ? 'bg-[#daa520] text-black' : 'bg-white/10'}`}>{c}</button>)}
            </div>
          </div>
          
          {/* 8대 생태계 허브 */}
          <div className="grid grid-cols-4 gap-4">
            {hubs.map(h => <div key={h} className="bg-white/5 p-4 rounded-2xl text-center text-[10px] font-bold border border-white/10">{h}</div>)}
          </div>
        </section>
      ) : (
        <section className="p-6 border border-[#daa520]/30 rounded-3xl bg-[#111]">
          {/* QR 및 스튜디오 통합 */}
          <div className="text-center mb-8">
             <div className="w-24 h-24 bg-white mx-auto mb-2 rounded" />
             <p className="text-[10px] text-[#daa520] font-bold">QR AUTH NODE ACTIVE</p>
          </div>
          <div className="flex gap-2 mb-6">
            <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Asset Name..." className="bg-black p-3 rounded-lg w-full border border-white/10" />
            <button onClick={registerAsset} className="bg-[#daa520] text-black font-bold px-6 rounded-lg">Certify</button>
          </div>
          {assets.map(a => <div key={a.id} className="p-3 bg-white/5 rounded-lg text-xs mb-2 border-l-4 border-[#daa520]">{a.title}</div>)}
        </section>
      )}
    </div>
  );
}
