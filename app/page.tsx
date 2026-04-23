'use client';

import React, { useState, useEffect } from 'react';

// 1. 데이터 모델 정의
interface Asset { 
  id: number; 
  title: string; 
  owner: string; 
  timestamp: string; 
}

export default function KedheonPortal() {
  const [view, setView] = useState<'FAN' | 'STUDIO'>('FAN');
  const [assets, setAssets] = useState<Asset[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [userId] = useState('USER_888');

  // 2. 데이터 영속성 결속
  useEffect(() => {
    const saved = localStorage.getItem('kedheon_assets');
    if (saved) setAssets(JSON.parse(saved));
  }, []);

  const registerAsset = () => {
    if (!newTitle.trim()) return;
    const newAsset: Asset = { 
      id: Date.now(),
      title: newTitle, 
      owner: userId, 
      timestamp: new Date().toLocaleDateString() 
    };
    const updated = [...assets, newAsset];
    setAssets(updated);
    localStorage.setItem('kedheon_assets', JSON.stringify(updated));
    setNewTitle('');
  };

  return (
    <div className="bg-black min-h-screen text-white p-6 font-sans w-full max-w-2xl mx-auto">
      {/* 경제 대시보드 */}
      <div className="bg-gradient-to-br from-[#daa520]/20 to-black p-6 rounded-3xl border border-[#daa520]/30 mb-8 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-gray-400 text-xs uppercase tracking-widest">Imperial Token</h3>
            <p className="text-[#daa520] font-black text-3xl">8,888.88 BEOM</p>
          </div>
          <button className="bg-[#daa520] text-black px-6 py-2 rounded-xl font-bold">Buy Token</button>
        </div>
      </div>

      {/* 탭 컨트롤 */}
      <div className="flex gap-4 mb-8">
        <button onClick={() => setView('FAN')} className={`flex-1 py-3 font-bold rounded-xl transition-all ${view === 'FAN' ? 'bg-[#daa520] text-black' : 'bg-white/10'}`}>
          Community
        </button>
        <button onClick={() => setView('STUDIO')} className={`flex-1 py-3 font-bold rounded-xl transition-all ${view === 'STUDIO' ? 'bg-[#daa520] text-black' : 'bg-white/10'}`}>
          User Studio
        </button>
      </div>

      {/* 뷰 레이어 */}
      {view === 'FAN' ? (
        <section className="p-6 border border-white/10 rounded-2xl bg-[#111]">
          <h2 className="text-[#daa520] font-black mb-4">📢 Community Hub</h2>
          <p className="text-gray-400 text-sm italic">유저 활동 데이터가 범 토큰 채굴의 근간이 됩니다.</p>
        </section>
      ) : (
        <section className="p-6 border border-[#daa520]/30 rounded-2xl bg-[#111]">
          <h2 className="text-[#daa520] font-black mb-4">🏆 {userId}'s Asset Registry</h2>
          
          <div className="bg-black p-4 rounded-xl border border-white/10 mb-6 text-center">
            <p className="text-xs text-[#daa520] mb-2 font-bold">QR AUTH NODE ACTIVE</p>
            <div className="w-20 h-20 bg-white mx-auto mb-2 rounded border border-[#daa520]" />
            <p className="text-[10px] text-gray-400 font-mono">AUTH: {userId}</p>
          </div>

          <div className="flex gap-2 mb-6">
            <input 
              value={newTitle} 
              onChange={(e) => setNewTitle(e.target.value)} 
              placeholder="Asset Name..." 
              className="bg-black p-3 rounded-lg w-full border border-white/10 focus:border-[#daa520] outline-none" 
            />
            <button onClick={registerAsset} className="bg-[#daa520] text-black font-bold px-6 rounded-lg">
              Certify
            </button>
          </div>

          <div className="space-y-2">
            {assets.map((a) => (
              <div key={a.id} className="p-3 bg-white/5 rounded-lg text-sm border-l-4 border-[#daa520] flex justify-between items-center">
                <span className="font-medium">{a.title}</span>
                <span className="text-[#daa520] text-xs font-mono">{a.timestamp}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
