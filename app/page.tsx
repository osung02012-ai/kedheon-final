'use client';
import React, { useState, useEffect } from 'react';

// 제국 데이터 모델 및 타입 정의
interface Asset { id: number; title: string; owner: string; timestamp: string; }

export default function KedheonPortal() {
  const [view, setView] = useState<'FAN' | 'STUDIO'>('FAN');
  const [beomToken, setBeomToken] = useState<number>(8888.88);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [newTitle, setNewTitle] = useState<string>('');
  const [userId] = useState<string>('USER_888');

  // 데이터 영속성 노드: 브라우저 로컬 저장소 결속
  useEffect(() => {
    const saved = localStorage.getItem('kedheon_assets');
    if (saved) setAssets(JSON.parse(saved));
  }, []);

  // 자산 등록 로직: 인증 ID 부여 및 데이터 영속화
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
    <div className="bg-black min-h-screen text-white p-6 font-sans w-full max-w-4xl mx-auto">
      {/* 1. 제국 통치 경제 대시보드 */}
      <header className="bg-gradient-to-r from-[#daa520]/20 to-black p-8 rounded-3xl border border-[#daa520]/30 mb-10 shadow-[0_0_20px_rgba(218,165,32,0.1)]">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-gray-400 text-xs uppercase tracking-[0.2em] mb-1">Imperial Currency</h3>
            <p className="text-[#daa520] font-black text-4xl">{beomToken.toLocaleString()} BEOM</p>
          </div>
          <button className="bg-[#daa520] text-black px-8 py-3 rounded-xl font-black hover:scale-105 transition-transform">
            BUY BEOM TOKEN
          </button>
        </div>
      </header>

      {/* 2. 데이터 레이어 선택 노드 */}
      <nav className="flex gap-4 mb-10">
        <button 
          onClick={() => setView('FAN')} 
          className={`flex-1 py-4 font-bold rounded-2xl transition-all ${view === 'FAN' ? 'bg-[#daa520] text-black' : 'bg-white/5 hover:bg-white/10'}`}
        >
          FAN COMMUNITY
        </button>
        <button 
          onClick={() => setView('STUDIO')} 
          className={`flex-1 py-4 font-bold rounded-2xl transition-all ${view === 'STUDIO' ? 'bg-[#daa520] text-black' : 'bg-white/5 hover:bg-white/10'}`}
        >
          USER STUDIO
        </button>
      </nav>

      {/* 3. 뷰 레이어 컨텐츠 */}
      <main className="min-h-[400px]">
        {view === 'FAN' ? (
          <section className="p-8 border border-white/10 rounded-3xl bg-[#111]">
            <h2 className="text-[#daa520] font-black text-2xl mb-4">📢 제국 소통 노드</h2>
            <p className="text-gray-500 italic">유저 활동 데이터가 범 토큰 채굴과 직접 연결됩니다.</p>
          </section>
        ) : (
          <section className="p-8 border border-[#daa520]/30 rounded-3xl bg-[#111]">
            <h2 className="text-[#daa520] font-black text-2xl mb-6">🏆 {userId}'s Assets</h2>
            <div className="flex gap-4 mb-8">
              <input 
                value={newTitle} 
                onChange={(e) => setNewTitle(e.target.value)} 
                placeholder="Enter Asset Name..." 
                className="bg-black p-4 rounded-xl w-full border border-white/10 focus:border-[#daa520] outline-none" 
              />
              <button 
                onClick={registerAsset} 
                className="bg-[#daa520] text-black font-black px-8 py-4 rounded-xl whitespace-nowrap"
              >
                CERTIFY ASSET
              </button>
            </div>
            
            <div className="space-y-3">
              {assets.length === 0 ? (
                <p className="text-gray-600 text-center py-10">인증된 자산이 없습니다.</p>
              ) : (
                assets.map((a) => (
                  <div key={a.id} className="p-4 bg-white/5 rounded-2xl border border-white/5 flex justify-between items-center">
                    <span className="font-bold">{a.title}</span>
                    <span className="text-[#daa520] text-xs font-mono">{a.timestamp}</span>
                  </div>
                ))
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
