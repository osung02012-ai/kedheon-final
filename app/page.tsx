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
  // 2. 상태 관리 (팬심 데이터 vs 스튜디오 자산 분리)
  const [view, setView] = useState<'FAN' | 'STUDIO'>('FAN');
  const [assets, setAssets] = useState<Asset[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [userId] = useState('USER_888');
  const [beomToken] = useState(8888.88);
  const [fanLevel] = useState('Lv. 88');

  // 3. 데이터 영속성 결속 (LocalStorage)
  useEffect(() => {
    const saved = localStorage.getItem('kedheon_assets');
    if (saved) {
      try {
        setAssets(JSON.parse(saved));
      } catch (e) {
        console.error("데이터 노드 복구 실패");
      }
    }
  }, []);

  // 4. 자산 인증 및 등록 로직
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

  // 5. 렌더링
  return (
    <div className="bg-black min-h-screen text-white p-6 font-sans w-full max-w-2xl mx-auto">
      {/* 경제 대시보드 - 토큰 및 팬심 지수 */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-gradient-to-br from-[#daa520]/20 to-black p-5 rounded-2xl border border-[#daa520]/30 text-center">
          <h3 className="text-gray-400 text-[10px] uppercase tracking-widest">Imperial Token</h3>
          <p className="text-[#daa520] font-black text-xl">{beomToken.toLocaleString()} BEOM</p>
        </div>
        <div className="bg-gradient-to-br from-[#daa520]/20 to-black p-5 rounded-2xl border border-[#daa520]/30 text-center">
          <h3 className="text-gray-400 text-[10px] uppercase tracking-widest">Fan Level</h3>
          <p className="text-white font-black text-xl">{fanLevel}</p>
        </div>
      </div>

      {/* 데이터 레이어 선택 노드 */}
      <div className="flex gap-4 mb-8">
        <button 
          onClick={() => setView('FAN')} 
          className={`flex-1 py-3 font-bold rounded-xl transition-all ${view === 'FAN' ? 'bg-[#daa520] text-black' : 'bg-white/10'}`}
        >
          Community
        </button>
        <button 
          onClick={() => setView('STUDIO')} 
          className={`flex-1 py-3 font-bold rounded-xl transition-all ${view === 'STUDIO' ? 'bg-[#daa520] text-black' : 'bg-white/10'}`}
        >
          Studio
        </button>
      </div>

      {/* 뷰 레이어 컨텐츠 */}
      {view === 'FAN' ? (
        <section className="p-6 border border-white/10 rounded-2xl bg-[#111]">
          <h2 className="text-[#daa520] font-black mb-4">📢 Community Hub</h2>
          <p className="text-gray-400 text-sm italic">유저 활동 데이터가 범 토큰 채굴의 근간이 됩니다.</p>
        </section>
      ) : (
        <section className="p-6 border border-[#daa520]/30 rounded-2xl bg-[#111]">
          <h2 className="text-[#daa520] font-black mb-4">🏆 {userId}'s Asset Registry</h2>
          
          <div className="bg-black p-4 rounded-xl border border-white/10 mb-6 text-center">
            <p className="text-[9px] text-[#daa520] mb-2 font-bold tracking-widest">QR AUTH NODE</p>
            <div className="w-20 h-20 bg-white mx-auto mb-2 rounded border border-[#daa520]" />
            <p className="text-[9px] text-gray-500 font-mono">AUTH: {userId}</p>
          </div>

          <div className="flex gap-2 mb-6">
            <input 
              value={newTitle} 
              onChange={(e) => setNewTitle(e.target.value)} 
              placeholder="Asset Name..." 
              className="bg-black p-3 rounded-lg w-full border border-white/10 focus:border-[#daa520] outline-none" 
            />
            <button onClick={registerAsset} className="bg-[#daa520] text-black font-bold px-6 rounded-lg hover:bg-[#b8860b]">
              Certify
            </button>
          </div>

          <div className="space-y-2">
            {assets.map((a) => (
              <div key={a.id} className="p-3 bg-white/5 rounded-lg text-xs border-l-4 border-[#daa520] flex justify-between items-center">
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
