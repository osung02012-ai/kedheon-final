'use client';
import React, { useState, useEffect } from 'react';

// 제국 데이터 모델
interface Asset { id: number; title: string; owner: string; timestamp: string; }

export default function KedheonPortal() {
  const [view, setView] = useState<'FAN' | 'STUDIO'>('FAN');
  const [assets, setAssets] = useState<Asset[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [userId] = useState('USER_888');

  useEffect(() => {
    const saved = localStorage.getItem('kedheon_assets');
    if (saved) setAssets(JSON.parse(saved));
  }, []);

  const registerAsset = () => {
    if (!newTitle.trim()) return;
    const newAsset = { id: Date.now(), title: newTitle, owner: userId, timestamp: new Date().toLocaleDateString() };
    const updated = [...assets, newAsset];
    setAssets(updated);
    localStorage.setItem('kedheon_assets', JSON.stringify(updated));
    setNewTitle('');
  };

  return (
    <div className="bg-black min-h-screen text-white p-6 font-sans w-full max-w-2xl mx-auto">
      {/* 1. 경제 및 상태 대시보드 */}
      <div className="bg-gradient-to-br from-[#daa520]/20 to-black p-6 rounded-3xl border border-[#daa520]/30 mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-gray-400 text-xs uppercase tracking-widest">Imperial Token</h3>
            <p className="text-[#daa520] font-black text-3xl">8,888.88 BEOM</p>
          </div>
          <button className="bg-[#daa520] text-black px-6 py-2 rounded-xl font-bold">Buy Token</button>
        </div>
      </div>

      {/* 2. 탭 통합 제어 */}
      <div className="flex gap-4 mb-8">
        <button onClick={() => setView('FAN')} className={`flex-1 py-3 font-bold rounded-xl ${view === 'FAN' ? 'bg-[#daa520] text-black' : 'bg-white/10'}`}>Fan Community</button>
        <button onClick={() => setView('STUDIO')} className={`flex-1 py-3 font-bold rounded-xl ${view === 'STUDIO' ? 'bg-[#daa520] text-black' : 'bg-white/10'}`}>User Studio</button>
      </div>

      {/* 3. 콘텐츠 레이어 */}
      {view === 'FAN' ? (
        <section className="p-6 border border-white/10 rounded-2xl bg-[#111]">
          <h2 className="text-[#daa520] font-black mb-4">📢 Community Hub</h2>
          <p className="text-gray-500 text-sm">유저 활동이 범 토큰 채굴의 근간이 됩니다.</p>
        </section>
      ) : (
        <section className="p-6 border border-[#daa520]/30 rounded-2xl bg-[#111]">
          <h2 className="text-[#daa520] font-black mb-4">🏆 {userId}'s Asset Registry</h2>
          
          {/* QR 및 자산 인증 노드 통합 */}
          <div className="bg-black p-4 rounded-xl border border-white/10 mb-6 text-center">
            <p className="text-xs text-[#daa520] mb-2">QR 인증 노드 가동 중</p>
            <div className="w-20 h-20 bg-white mx-auto mb-2" /> 
            <p className="text-[10px] text-gray-400">인증 코드: {userId}</p>
          </div>

          <div className="flex gap-2 mb-6">
            <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Asset Name..." className="bg-black p-3 rounded-lg w-full border border-white/10" />
            <button onClick={registerAsset} className="bg-[#daa520] text-black font-bold px-6 rounded-lg">Certify</button>
          </div>

          <div className="space-y-2">
            {assets.map((a) => (
              <div key={a.id} className="p-3 bg-white/5 rounded-lg text-sm border-l-4 border-[#daa520] flex justify-between">
                <span>{a.title}</span>
                <span className="text-[#daa520]">{a.timestamp}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
