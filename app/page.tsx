'use client';
import React, { useState, useEffect } from 'react';

// 1. 자산 및 광고 데이터 모델
interface Asset { 
  id: number; 
  title: string; 
  desc: string;
  category: string; 
  isAd: boolean; // 광고 여부
  owner: string; 
  timestamp: string; 
}

export default function KedheonPortal() {
  // --- [상수 및 환경 설정] ---
  const PI_TO_BEOM_RATE = 314.1592; // 제국 황금 환율
  const QR_PURCHASE_COST = 50; 
  const ASSET_REG_COST = 10;
  const AD_REG_COST = 500; // 광고 등록 비용
  const empireCharacterName = 'USER_888';
  const empireUrl = "https://kedheon.com";

  // --- [상태 관리] ---
  const [tab, setTab] = useState<'ROOKIE' | 'PIONEER'>('PIONEER');
  const [category, setCategory] = useState('ALL');
  const [qrType, setQrType] = useState<'PERSONAL' | 'BUSINESS'>('PERSONAL');
  const [businessName, setBusinessName] = useState('해태건축사');
  const [businessID, setBusinessID] = useState('HT-0001');
  
  const [assets, setAssets] = useState<Asset[]>([]);
  const [beomToken, setBeomToken] = useState(8888.88);
  const [isQrActive, setIsQrActive] = useState(false);
  const [fanLevel, setFanLevel] = useState(88);
  
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [isAdRequest, setIsAdRequest] = useState(false);

  const categories = ['ALL', 'MUSIC', 'SPORTS', 'ANIME', 'DRAMA', 'MOVIE', 'ESPORTS', 'COMEDY'];
  const ecosystemApps = ['PI', 'NEXUS', 'AI', 'VENDOR', 'CIVIL', 'FILTER', 'PAPA', '6G'];

  // --- [데이터 영속성: LocalStorage] ---
  useEffect(() => {
    const savedAssets = localStorage.getItem('kedheon_assets');
    if (savedAssets) setAssets(JSON.parse(savedAssets));
    const savedToken = localStorage.getItem('kedheon_token');
    if (savedToken) setBeomToken(parseFloat(savedToken));
  }, []);

  useEffect(() => {
    localStorage.setItem('kedheon_token', beomToken.toString());
  }, [beomToken]);

  // --- [핵심 로직] ---
  
  // 1. 생태계 활동 채굴
  const handleHubClick = (app: string) => {
    setBeomToken(prev => prev + 1);
    setFanLevel(prev => prev + 1);
    alert(`[${app}] 생태계 활동이 확인되었습니다. +1 BEOM 확보!`);
  };

  // 2. 인증 QR 확보 (결제)
  const purchaseQR = () => {
    if (beomToken < QR_PURCHASE_COST) return alert("범 토큰 잔액이 부족합니다.");
    if (confirm(`${QR_PURCHASE_COST} BEOM을 지불하고 인증을 확보하시겠습니까?`)) {
      setBeomToken(prev => prev - QR_PURCHASE_COST);
      setIsQrActive(true);
      alert("제국 인증 QR이 활성화되었습니다.");
    }
  };

  // 3. 자산 및 광고 등록 (결제)
  const registerAsset = () => {
    const cost = isAdRequest ? AD_REG_COST : ASSET_REG_COST;
    if (!newTitle.trim()) return alert("제목을 입력하십시오.");
    if (beomToken < cost) return alert(`잔액 부족 (${cost} BEOM 필요)`);

    const newAsset: Asset = { 
      id: Date.now(), 
      title: newTitle, 
      desc: newDesc,
      category: category === 'ALL' ? 'GENERAL' : category, 
      isAd: isAdRequest,
      owner: empireCharacterName, 
      timestamp: new Date().toLocaleDateString() 
    };
    
    const updated = [newAsset, ...assets];
    setAssets(updated);
    localStorage.setItem('kedheon_assets', JSON.stringify(updated));
    setBeomToken(prev => prev - cost);
    setNewTitle(''); setNewDesc(''); setIsAdRequest(false);
    alert(isAdRequest ? "공식 광고가 게재되었습니다!" : "자산 등록이 완료되었습니다.");
  };

  return (
    <div className="flex flex-col items-center bg-black min-h-screen text-white p-6 font-sans w-full overflow-x-hidden">
      
      {/* 상단 탭: 시민 등급 구분 */}
      <div className="flex gap-4 mb-10 mt-10 justify-center w-full max-w-2xl">
        <button onClick={() => setTab('ROOKIE')} className={`px-8 py-2 rounded-full font-bold transition-all ${tab === 'ROOKIE' ? 'bg-[#daa520] text-black shadow-[0_0_15px_rgba(218,165,32,0.5)]' : 'bg-white/10 text-gray-500'}`}>ROOKIE</button>
        <button onClick={() => setTab('PIONEER')} className={`px-8 py-2 rounded-full font-bold transition-all ${tab === 'PIONEER' ? 'bg-[#daa520] text-black shadow-[0_0_15px_rgba(218,165,32,0.5)]' : 'bg-white/10 text-gray-500'}`}>PIONEER</button>
      </div>

      <div className="w-full max-w-2xl">
        {tab === 'ROOKIE' ? (
          /* 루키 화면: 시민권 신청 */
          <div className="flex flex-col items-center text-center py-20">
            <div className="w-48 h-48 bg-[#daa520]/10 rounded-full flex items-center justify-center border border-[#daa520]/30 mb-8 animate-pulse">
              <span className="text-6xl">🐯</span>
            </div>
            <h1 className="text-4xl font-black text-[#daa520] tracking-widest mb-4">KEDHEON EMPIRE</h1>
            <p className="text-gray-500 mb-10">제국의 시민이 되어 경제적 주권을 확보하십시오.</p>
            <button onClick={() => setTab('PIONEER')} className="bg-[#daa520] text-black px-12 py-5 rounded-2xl font-black hover:scale-105 transition-transform shadow-lg">시민권 획득하기</button>
          </div>
        ) : (
          /* 파이오니어 화면: 제국 통제실 */
          <div className="flex flex-col gap-8 animate-in fade-in duration-700">
            
            {/* 1. 경제 대시보드 (환율 시스템) */}
            <div className="bg-[#111] p-8 rounded-3xl border border-[#daa520]/30 shadow-[0_0_30px_rgba(218,165,32,0.1)] flex justify-between items-end">
              <div>
                <h3 className="text-gray-500 text-[10px] uppercase tracking-[0.2em] mb-2 font-bold">Imperial Asset Balance</h3>
                <p className="text-[#daa520] font-black text-3xl leading-none">{beomToken.toLocaleString(undefined, { minimumFractionDigits: 2 })} BEOM</p>
                <div className="flex items-center gap-2 mt-3 bg-black/40 px-3 py-1 rounded-lg border border-white/5 w-fit">
                   <span className="text-gray-500 text-[10px] font-mono">≈ {(beomToken / PI_TO_BEOM_RATE).toFixed(4)} Pi</span>
                   <span className="text-[#daa520] text-[9px] font-bold">RATE 1:{PI_TO_BEOM_RATE}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white font-black text-2xl leading-none">Lv. {fanLevel}</p>
                <p className="text-[10px] text-[#daa520] uppercase mt-2 font-bold tracking-tighter">Imperial Fan Grade</p>
              </div>
            </div>

            {/* 2. 팬덤 & 콘텐츠 카테고리 셀렉터 */}
            <div className="p-6 bg-[#111] rounded-3xl border border-white/5 text-center">
              <h3 className="text-[#daa520] font-bold text-[10px] uppercase tracking-widest mb-5">Fandom Territory</h3>
              <div className="flex flex-wrap gap-2 justify-center">
                {categories.map((cat) => (
                  <button key={cat} onClick={() => setCategory(cat)} className={`px-4 py-2 rounded-full text-[10px] font-black transition-all ${category === cat ? 'bg-[#daa520] text-black scale-110 shadow-md' : 'bg-white/5 text-gray-500 hover:bg-white/10'}`}>{cat}</button>
                ))}
              </div>
            </div>

            {/* 3. 제국 인증 QR 결제 시스템 */}
            <div className="bg-[#111] p-8 rounded-3xl border border-[#daa520]/20 text-center relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-3 text-[10px] text-gray-600 font-mono">Fee: {QR_PURCHASE_COST} BEOM</div>
              <h3 className="text-[#daa520] font-black mb-6 text-sm tracking-widest">IMPERIAL AUTH QR</h3>
              
              <div className="flex gap-2 justify-center mb-6">
                <button onClick={() => {setQrType('PERSONAL'); setIsQrActive(false);}} className={`px-5 py-1.5 rounded-lg text-[10px] font-bold ${qrType === 'PERSONAL' ? 'bg-[#daa520] text-black' : 'bg-white/5 text-gray-500'}`}>PERSONAL</button>
                <button onClick={() => {setQrType('BUSINESS'); setIsQrActive(false);}} className={`px-5 py-1.5 rounded-lg text-[10px] font-bold ${qrType === 'BUSINESS' ? 'bg-[#daa520] text-black' : 'bg-white/5 text-gray-500'}`}>BUSINESS</button>
              </div>

              <div className="relative w-full max-w-[220px] mx-auto aspect-square rounded-2xl border border-white/10 overflow-hidden shadow-inner">
                <div className={`absolute inset-0 flex flex-col items-center justify-center p-6 transition-all duration-500 ${isQrActive ? 'bg-black/20' : 'bg-black/90 backdrop-blur-xl'}`}>
                  {isQrActive ? (
                    <div className="bg-white p-2 rounded-xl shadow-2xl">
                      <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(empireUrl + '/?type=' + qrType + '&id=' + (qrType === 'BUSINESS' ? businessID : empireCharacterName))}`} className="w-28 h-28" alt="QR" />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <span className="text-3xl mb-4 opacity-50">🔒</span>
                      <button onClick={purchaseQR} className="bg-[#daa520] text-black px-6 py-3 rounded-xl font-black text-xs shadow-[0_5px_15px_rgba(218,165,32,0.3)] hover:scale-105 transition-transform">인증 QR 확보하기</button>
                    </div>
                  )}
                </div>
              </div>

              {qrType === 'BUSINESS' && (
                <div className="mt-6 flex flex-col gap-2">
                  <input type="text" value={businessName} onChange={(e) => {setBusinessName(e.target.value); setIsQrActive(false);}} placeholder="기업명" className="bg-black/50 border border-white/10 p-3 rounded-xl text-sm focus:border-[#daa520] outline-none" />
                  <input type="text" value={businessID} onChange={(e) => {setBusinessID(e.target.value); setIsQrActive(false);}} placeholder="고유 ID" className="bg-black/50 border border-white/10 p-3 rounded-xl text-sm focus:border-[#daa520] outline-none" />
                </div>
              )}
            </div>

            {/* 4. 8대 생태계 허브 (활동 채굴) */}
            <div className="bg-[#111] p-8 rounded-3xl border border-white/5">
              <h3 className="text-center text-[10px] font-black text-[#daa520] mb-6 uppercase tracking-[0.3em]">🌐 Ecosystem Infrastructure Hub</h3>
              <div className="grid grid-cols-4 gap-4">
                {ecosystemApps.map(app => (
                  <button key={app} onClick={() => handleHubClick(app)} className="flex flex-col items-center group">
                    <div className="w-12 h-12 bg-white/5 rounded-2xl mb-2 border border-white/10 flex items-center justify-center text-[10px] text-[#daa520] font-black group-hover:bg-[#daa520] group-hover:text-black transition-all duration-300">{app}</div>
                    <span className="text-[9px] text-gray-600 group-hover:text-white">{app}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 5. 유저 스튜디오 & 광고 센터 */}
            <div className="bg-[#111] p-8 rounded-3xl border border-white/5 relative">
              <h3 className="text-[#daa520] font-black text-sm mb-6 tracking-widest uppercase">User Studio & Imperial AD</h3>
              <div className="flex flex-col gap-4">
                <p className="text-[10px] text-gray-500">Target Fandom: <span className="text-[#daa520] font-bold">{category}</span></p>
                <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="제목" className="bg-black p-4 rounded-xl border border-white/10 text-sm focus:border-[#daa520] outline-none" />
                <textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="설명 (광고 게재 시 홍보 문구)" className="bg-black p-4 rounded-xl border border-white/10 text-sm h-20 outline-none focus:border-[#daa520] resize-none" />
                
                {/* 광고 토글 */}
                <div className="flex justify-between items-center bg-black/40 p-4 rounded-xl border border-[#daa520]/20">
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-[#daa520]">제국 공식 광고 게재</span>
                    <span className="text-[9px] text-gray-500">최상단 강조 노출 프리미엄</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono text-gray-400">{AD_REG_COST} BEOM</span>
                    <input type="checkbox" checked={isAdRequest} onChange={(e) => setIsAdRequest(e.target.checked)} className="w-5 h-5 accent-[#daa520]" />
                  </div>
                </div>

                <button onClick={registerAsset} className={`w-full py-4 rounded-xl font-black text-sm transition-all ${isAdRequest ? 'bg-gradient-to-r from-[#daa520] to-[#b8860b] text-black' : 'bg-white/10 text-white'}`}>
                  {isAdRequest ? '공식 광고 확보하기' : '자산 등록 (10 BEOM)'}
                </button>
              </div>

              {/* 실시간 피드: 광고 및 자산 */}
              <div className="mt-10 space-y-4">
                <h3 className="text-gray-500 text-[10px] font-bold uppercase tracking-widest border-b border-white/5 pb-2">Imperial Live Feed</h3>
                {assets.filter(a => category === 'ALL' || a.category === category).map((a) => (
                  <div key={a.id} className={`p-5 rounded-2xl border-l-4 transition-all animate-in slide-in-from-right duration-500 ${a.isAd ? 'bg-[#daa520]/10 border-[#daa520] shadow-lg' : 'bg-white/5 border-gray-800'}`}>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        {a.isAd && <span className="bg-[#daa520] text-black text-[8px] px-2 py-0.5 rounded-full font-black">AD</span>}
                        <span className="font-bold text-white text-sm">{a.title}</span>
                      </div>
                      <span className="text-gray-600 text-[10px] font-mono">{a.timestamp}</span>
                    </div>
                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{a.desc}</p>
                    <div className="mt-3 flex justify-between items-center">
                      <span className="text-[#daa520] text-[9px] font-black uppercase tracking-widest">{a.category}</span>
                      <span className="text-[8px] text-gray-600 font-mono">ID: {a.owner}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 하단 푸터 */}
            <div className="text-center py-10 opacity-30">
               <p className="text-[9px] font-mono tracking-[0.5em] uppercase">Kedheon Empire | 88-Threads Engine Verified</p>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
