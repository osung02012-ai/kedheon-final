'use client';
import React, { useState, useEffect } from 'react';

// 제국 자산 데이터 모델
interface Asset { 
  id: number; 
  title: string; 
  desc: string;
  owner: string; 
  timestamp: string; 
}

export default function KedheonPortal() {
  // 1. 최상위 뼈대 상태 (이것이 삭제되어 화면이 달라보였던 것입니다)
  const [mainTab, setMainTab] = useState<'ROOKIE' | 'PIONEER'>('PIONEER');
  
  // 2. 데이터 레이어 분리 상태 (팬심 vs 창작물)
  const [subTab, setSubTab] = useState<'FAN' | 'STUDIO'>('FAN');
  
  // 3. UI 및 폼 상태
  const [category, setCategory] = useState('ALL');
  const [qrType, setQrType] = useState<'PERSONAL' | 'BUSINESS'>('PERSONAL');
  const [assets, setAssets] = useState<Asset[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  
  // 4. 고정 데이터
  const userId = 'USER_888';
  const beomToken = 8888.88;
  const categories = ['ALL', 'MUSIC', 'SPORTS', 'ACTOR', 'ESPORTS', 'COMEDY'];
  const ecosystemApps = ['PI', 'NEXUS', 'AI', 'VENDOR', 'CIVIL', 'FILTER', 'PAPA', '6G'];

  // 데이터 영속성 (새로고침 유지)
  useEffect(() => {
    const saved = localStorage.getItem('kedheon_assets');
    if (saved) setAssets(JSON.parse(saved));
  }, []);

  const registerAsset = () => {
    if (!newTitle.trim()) return;
    const newAsset: Asset = { 
      id: Date.now(), 
      title: newTitle, 
      desc: newDesc,
      owner: userId, 
      timestamp: new Date().toLocaleDateString() 
    };
    const updated = [...assets, newAsset];
    setAssets(updated);
    localStorage.setItem('kedheon_assets', JSON.stringify(updated));
    setNewTitle('');
    setNewDesc('');
  };

  return (
    <div className="flex flex-col items-center bg-black min-h-screen text-white p-6 font-sans w-full overflow-x-hidden">
      
      {/* 1. 최상위 프레임워크 (ROOKIE / PIONEER 탭 복원) */}
      <div className="flex gap-4 mb-10 mt-10 justify-center w-full max-w-2xl">
        <button onClick={() => setMainTab('ROOKIE')} className={`px-8 py-2 rounded-full font-bold transition-all ${mainTab === 'ROOKIE' ? 'bg-[#daa520] text-black shadow-[0_0_15px_rgba(218,165,32,0.5)]' : 'bg-white/10'}`}>ROOKIE</button>
        <button onClick={() => setMainTab('PIONEER')} className={`px-8 py-2 rounded-full font-bold transition-all ${mainTab === 'PIONEER' ? 'bg-[#daa520] text-black shadow-[0_0_15px_rgba(218,165,32,0.5)]' : 'bg-white/10'}`}>PIONEER</button>
      </div>

      <div className="w-full max-w-2xl">
        {mainTab === 'ROOKIE' ? (
          <div className="flex flex-col items-center text-center py-20">
            <div className="w-40 h-40 bg-white/10 rounded-full mb-6 border border-[#daa520]/50 flex items-center justify-center text-sm text-[#daa520]">CHARACTER</div>
            <h1 className="text-4xl font-black mt-6 text-[#daa520] tracking-widest">KEDHEON EMPIRE</h1>
            <button className="mt-10 bg-[#daa520] text-black px-12 py-5 rounded-2xl font-black shadow-[0_0_20px_rgba(218,165,32,0.3)]">시민권 신청</button>
          </div>
        ) : (
          <div className="bg-[#111] p-8 rounded-3xl border border-white/10 w-full shadow-[0_0_30px_rgba(218,165,32,0.1)] flex flex-col gap-8">
            
            {/* 2. 제국 통치 대시보드 (토큰) */}
            <div className="bg-gradient-to-r from-[#daa520]/20 to-transparent p-6 rounded-2xl border border-[#daa520]/30 flex justify-between items-center">
              <div>
                <h3 className="text-gray-400 text-xs uppercase tracking-widest mb-1">Imperial Asset</h3>
                <p className="text-[#daa520] font-black text-2xl">{beomToken.toLocaleString()} BEOM</p>
              </div>
              <div className="text-right">
                <h3 className="text-gray-400 text-xs uppercase mb-1">Fan Level</h3>
                <p className="text-white font-black text-xl">Lv. 88</p>
              </div>
            </div>

            {/* 3. 데이터 레이어 분리 서브탭 (팬심 vs 창작물) */}
            <div className="flex gap-2 p-1 bg-black rounded-xl border border-white/10">
              <button onClick={() => setSubTab('FAN')} className={`flex-1 py-2 font-bold rounded-lg text-sm ${subTab === 'FAN' ? 'bg-[#daa520] text-black' : 'text-gray-400'}`}>🔥 팬심 커뮤니티</button>
              <button onClick={() => setSubTab('STUDIO')} className={`flex-1 py-2 font-bold rounded-lg text-sm ${subTab === 'STUDIO' ? 'bg-[#daa520] text-black' : 'text-gray-400'}`}>🏆 창작 스튜디오</button>
            </div>

            {/* 4. 분리된 콘텐츠 렌더링 */}
            {subTab === 'FAN' ? (
              <div className="flex flex-col gap-8 animate-fadeIn">
                {/* 카테고리 노드 복원 */}
                <div className="p-6 bg-black rounded-2xl border border-white/5 text-center">
                  <h3 className="text-[#daa520] font-black text-sm mb-4">선택된 노드: {category}</h3>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {categories.map((cat) => (
                      <button key={cat} onClick={() => setCategory(cat)} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${category === cat ? 'bg-[#daa520] text-black' : 'bg-white/10 hover:bg-white/20'}`}>{cat}</button>
                    ))}
                  </div>
                </div>

                {/* 8대 생태계 허브 복원 */}
                <div className="bg-black p-6 rounded-2xl border border-white/5">
                  <h3 className="text-center text-xs font-bold text-[#daa520] mb-4">🌐 8대 생태계 허브</h3>
                  <div className="grid grid-cols-4 gap-4 text-center">
                    {ecosystemApps.map(app => (
                      <button key={app} className="flex flex-col items-center hover:scale-105 transition-transform">
                        <div className="w-12 h-12 bg-white/5 rounded-full mb-2 border border-white/10 flex items-center justify-center text-[10px] text-[#daa520] font-bold">{app}</div>
                        <span className="text-[10px] text-gray-400">{app}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-8 animate-fadeIn">
                {/* QR 인증 노드 복원 */}
                <div className="bg-black p-6 rounded-2xl border border-[#daa520]/30 text-center">
                  <h3 className="text-[#daa520] font-bold mb-4">제국 인증 QR</h3>
                  <div className="flex gap-2 justify-center mb-4">
                    <button onClick={() => setQrType('PERSONAL')} className={`px-4 py-1.5 rounded text-[10px] font-bold ${qrType === 'PERSONAL' ? 'bg-[#daa520] text-black' : 'bg-white/10'}`}>개인 신분</button>
                    <button onClick={() => setQrType('BUSINESS')} className={`px-4 py-1.5 rounded text-[10px] font-bold ${qrType === 'BUSINESS' ? 'bg-[#daa520] text-black' : 'bg-white/10'}`}>기업/결제</button>
                  </div>
                  <div className="w-24 h-24 bg-white mx-auto mb-2 p-1 rounded-lg border-2 border-[#daa520]" />
                  <p className="text-[10px] font-mono text-gray-400">ID: {userId}</p>
                </div>

                {/* 창작 스튜디오 폼 완전 복원 */}
                <div className="bg-black p-6 rounded-2xl border border-white/5 text-center">
                  <h3 className="text-[#daa520] font-black text-sm mb-4">자산 등록 (Certify)</h3>
                  <div className="flex flex-col gap-3">
                    <input type="file" className="w-full text-xs text-gray-400 file:bg-[#daa520] file:text-black file:border-0 file:px-4 file:py-1 file:rounded-full file:mr-2 file:font-bold" />
                    <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="창작물 제목 입력" className="w-full bg-[#1a1a1a] p-3 text-sm rounded-lg border border-white/10 focus:border-[#daa520] outline-none" />
                    <textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="창작물 설명" className="w-full h-20 bg-[#1a1a1a] p-3 text-sm rounded-lg border border-white/10 focus:border-[#daa520] outline-none" />
                    <button onClick={registerAsset} className="w-full bg-[#daa520] text-black py-3 rounded-lg font-black shadow-lg">제국 자산으로 등록</button>
                  </div>
                </div>

                {/* 등록된 자산 리스트 */}
                {assets.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-gray-400 text-xs font-bold mb-2">인증된 자산 목록</h3>
                    {assets.map((a) => (
                      <div key={a.id} className="p-4 bg-white/5 rounded-xl border-l-4 border-[#daa520] text-left">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-bold text-white text-sm">{a.title}</span>
                          <span className="text-[#daa520] text-[10px] font-mono">{a.timestamp}</span>
                        </div>
                        {a.desc && <p className="text-xs text-gray-500 line-clamp-2">{a.desc}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
