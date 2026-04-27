'use client';
import React, { useState, useEffect } from 'react';

/**
 * [제국 데이터 모델]
 */
interface Asset { 
  id: number; 
  title: string; 
  desc: string;
  category: string; 
  isAd: boolean; 
  owner: string; 
  timestamp: string; 
}

export default function KedheonPortal() {
  // --- [1. 제국 핵심 환경 설정] ---
  const PI_TO_BEOM_RATE = 314.1592; // $1 \text{ Pi} = 314.1592 \text{ BEOM}$
  const QR_PURCHASE_COST = 50;      
  const ASSET_REG_COST = 10;        
  const AD_REG_COST = 500;          
  const empireCharacterName = 'CHEOREOM_88';
  const empireUrl = "https://kedheon.com";

  // --- [2. 주군 하사 공식 이미지 에셋] ---
  const mainCharacter = "/kedheon-character.png"; 
  const beomTokenImg = "/beom-token.png";
  const businessQrImg = "/qr-business.png";
  const personalQrImg = "/qr-personal.png";

  // --- [3. 제어 상태 관리] ---
  const [tab, setTab] = useState<'ROOKIE' | 'PIONEER'>('PIONEER');
  const [category, setCategory] = useState('ALL');
  const [qrType, setQrType] = useState<'PERSONAL' | 'BUSINESS'>('PERSONAL');
  const [businessName, setBusinessName] = useState('해태건축사');
  const [businessID, setBusinessID] = useState('HT-0001');
  
  const [assets, setAssets] = useState<Asset[]>([]);
  const [beomToken, setBeomToken] = useState(8791.88); // 주군의 최신 잔액 반영
  const [isQrActive, setIsQrActive] = useState(false);
  const [fanLevel, setFanLevel] = useState(88);
  
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [isAdRequest, setIsAdRequest] = useState(false);

  // --- [4. 카테고리 및 8대 앱 공식 풀 네임] ---
  const categories = ['ALL', 'MUSIC', 'SPORTS', 'ANIME', 'DRAMA', 'MOVIE', 'ESPORTS', 'COMEDY'];
  const ecosystemFullApps = [
    'Pi Network', 'Nexus AI', 'Kedheon AI', 'Pi Vendor', 
    'Pi Civil', 'Pi FactFilter', 'PiPapa', 'Pi 6G Network'
  ];

  // 데이터 동기화
  useEffect(() => {
    const savedAssets = localStorage.getItem('kedheon_assets');
    if (savedAssets) setAssets(JSON.parse(savedAssets));
    const savedToken = localStorage.getItem('kedheon_token');
    if (savedToken) setBeomToken(parseFloat(savedToken));
  }, []);

  useEffect(() => {
    localStorage.setItem('kedheon_token', beomToken.toString());
  }, [beomToken]);

  // 로직 함수
  const handleHubClick = (app: string) => {
    setBeomToken(prev => prev + 1);
    setFanLevel(prev => prev + 1);
    alert(`[${app}] 활동 보상 +1 BEOM 확보!`);
  };

  const purchaseQR = () => {
    if (beomToken < QR_PURCHASE_COST) return alert("잔액 부족");
    if (confirm("BEOM 토큰으로 제국 인증 QR을 확보하시겠습니까?")) {
      setBeomToken(prev => prev - QR_PURCHASE_COST);
      setIsQrActive(true);
    }
  };

  const registerAsset = () => {
    const cost = isAdRequest ? AD_REG_COST : ASSET_REG_COST;
    if (!newTitle.trim() || beomToken < cost) return alert("등록 불가 (제목 확인 또는 잔액 부족)");
    const newAsset: Asset = { 
      id: Date.now(), title: newTitle, desc: newDesc,
      category: category === 'ALL' ? 'GENERAL' : category, 
      isAd: isAdRequest, owner: empireCharacterName, 
      timestamp: new Date().toLocaleDateString() 
    };
    setAssets([newAsset, ...assets]);
    setBeomToken(prev => prev - cost);
    setNewTitle(''); setNewDesc(''); setIsAdRequest(false);
  };

  return (
    <div className="flex flex-col items-center bg-black min-h-screen text-white p-6 font-sans w-full overflow-x-hidden">
      
      {/* 상단 탭 */}
      <div className="flex gap-4 mb-10 mt-10 justify-center w-full max-w-2xl">
        <button onClick={() => setTab('ROOKIE')} className={`px-10 py-3 rounded-2xl font-black transition-all ${tab === 'ROOKIE' ? 'bg-[#daa520] text-black shadow-lg' : 'bg-[#111] text-gray-500'}`}>ROOKIE</button>
        <button onClick={() => setTab('PIONEER')} className={`px-10 py-3 rounded-2xl font-black transition-all ${tab === 'PIONEER' ? 'bg-[#daa520] text-black shadow-[0_0_20px_rgba(218,165,32,0.6)]' : 'bg-[#111] text-gray-500'}`}>PIONEER</button>
      </div>

      <div className="w-full max-w-4xl">
        {tab === 'ROOKIE' ? (
          <div className="flex flex-col items-center text-center py-20 animate-in fade-in duration-500">
            <img src={mainCharacter} className="w-72 h-72 rounded-[40px] object-cover mb-8 shadow-2xl border-4 border-[#daa520]/20" alt="Kedheon" />
            <h1 className="text-4xl font-black text-[#daa520] tracking-widest mb-4">KEDHEON EMPIRE</h1>
            <button onClick={() => setTab('PIONEER')} className="bg-[#daa520] text-black px-12 py-5 rounded-2xl font-black shadow-xl">제국 입국하기</button>
          </div>
        ) : (
          <div className="flex flex-col gap-10 animate-in slide-in-from-bottom-10 duration-700">
            
            {/* 1. 경제 대시보드 (범 토큰 크기 및 투명도 보정 완료) */}
            <div className="bg-[#111] p-10 rounded-[40px] border border-[#daa520]/40 shadow-2xl flex justify-between items-center relative overflow-hidden group">
              <div className="relative z-10">
                <h3 className="text-gray-500 text-xs uppercase tracking-[0.3em] mb-3 font-black opacity-60">Imperial Asset Balance</h3>
                <p className="text-[#daa520] font-black text-5xl leading-none tracking-tighter">{beomToken.toLocaleString(undefined, { minimumFractionDigits: 2 })} BEOM</p>
                <div className="mt-6 bg-black/60 px-5 py-2.5 rounded-2xl border border-white/10 w-fit backdrop-blur-md">
                   <span className="text-gray-300 text-sm font-mono font-bold">≈ {(beomToken / PI_TO_BEOM_RATE).toFixed(4)} Pi</span>
                   <span className="text-[#daa520] text-[9px] font-black ml-4 opacity-50">1 Pi : {PI_TO_BEOM_RATE}</span>
                </div>
              </div>

              {/* [수정 포인트] 범 토큰 이미지: 크기 확대(w-32) 및 투명도 제거(opacity-100) */}
              <div className="flex flex-col items-end relative z-10"> 
                <div className="bg-[#daa520]/10 p-2 rounded-full border border-[#daa520]/20 mb-4 shadow-inner">
                   <img src={beomTokenImg} className="w-32 h-32 opacity-100 transition-transform group-hover:scale-110 pointer-events-none object-contain" alt="Beom Token" />
                </div>
                <div className="text-right">
                    <p className="text-white font-black text-4xl leading-none">Lv. {fanLevel}</p>
                    <p className="text-xs text-[#daa520] uppercase mt-2 font-black tracking-widest">Empire Grade</p>
                </div>
              </div>
            </div>

            {/* 2. 카테고리 셀렉터 */}
            <div className="p-4 bg-[#111] rounded-[30px] border border-white/5 flex flex-wrap gap-2 justify-center">
              {categories.map((cat) => (
                <button key={cat} onClick={() => setCategory(cat)} className={`px-6 py-2.5 rounded-2xl text-[11px] font-black transition-all ${category === cat ? 'bg-[#daa520] text-black shadow-lg' : 'bg-[#1a1a1a] text-gray-500 hover:text-white'}`}>{cat}</button>
              ))}
            </div>

            {/* 3. 제국 인증 QR 시스템 */}
            <div className="bg-[#111] p-10 rounded-[40px] border border-[#daa520]/20 text-center relative overflow-hidden">
              <div className="absolute top-4 right-8 text-xs text-gray-600 font-mono font-bold">Fee: {QR_PURCHASE_COST} BEOM</div>
              <h3 className="text-[#daa520] font-black mb-8 text-lg tracking-[0.3em] uppercase">Imperial Auth QR System</h3>
              
              <div className="flex gap-3 justify-center mb-10">
                <button onClick={() => {setQrType('PERSONAL'); setIsQrActive(false);}} className={`px-8 py-3 rounded-2xl text-[11px] font-black transition-all ${qrType === 'PERSONAL' ? 'bg-[#daa520] text-black' : 'bg-[#1a1a1a] text-gray-500'}`}>PERSONAL</button>
                <button onClick={() => {setQrType('BUSINESS'); setIsQrActive(false);}} className={`px-8 py-3 rounded-2xl text-[11px] font-black transition-all ${qrType === 'BUSINESS' ? 'bg-[#daa520] text-black' : 'bg-[#1a1a1a] text-gray-500'}`}>BUSINESS</button>
              </div>

              <div className="relative w-full max-w-[500px] mx-auto aspect-[1.8/1] rounded-[40px] border border-white/10 overflow-hidden shadow-2xl">
                <img src={qrType === 'PERSONAL' ? personalQrImg : businessQrImg} className="absolute inset-0 w-full h-full object-cover" alt="QR Background" />
                <div className={`absolute inset-0 flex flex-col items-center justify-center p-6 transition-all duration-700 ${isQrActive ? 'bg-transparent' : 'bg-black/95 backdrop-blur-3xl'}`}>
                  {isQrActive ? (
                    <div className="bg-white p-3 rounded-[30px] shadow-2xl animate-in zoom-in-50">
                      <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(empireUrl + '/?id=' + (qrType === 'BUSINESS' ? businessID : empireCharacterName))}`} className="w-32 h-32" alt="QR Code" />
                    </div>
                  ) : (
                    <button onClick={purchaseQR} className="bg-[#daa520] text-black px-12 py-5 rounded-3xl font-black text-sm shadow-xl hover:scale-105 transition-all">QR 확보하기</button>
                  )}
                </div>
              </div>
            </div>

            {/* 4. Ecosystem Infrastructure Hub (풀네임 반영) */}
            <div className="bg-[#111] p-10 rounded-[40px] border border-white/5">
              <h3 className="text-center text-xs font-black text-[#daa520] mb-8 uppercase tracking-[0.4em] opacity-80">🌐 Ecosystem Infrastructure Hub</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
                {ecosystemFullApps.map(app => (
                  <button key={app} onClick={() => handleHubClick(app)} className="h-28 bg-[#1a1a1a] rounded-[30px] border border-white/5 flex flex-col items-center justify-center p-4 hover:bg-[#daa520] hover:text-black transition-all group active:scale-95">
                    <span className="text-[11px] font-black text-[#daa520] group-hover:text-black text-center leading-tight break-words">{app}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 5. 유저 스튜디오 & 광고 센터 */}
            <div className="bg-[#111] p-10 rounded-[40px] border border-white/5 relative">
              <h3 className="text-[#daa520] font-black text-base mb-8 tracking-widest uppercase">User Studio & Imperial AD Center</h3>
              <div className="flex flex-col gap-4">
                <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="제목" className="bg-black p-5 rounded-2xl border border-white/10 text-sm focus:border-[#daa520] outline-none font-bold" />
                <textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="설명 (광고 게재 시 홍보 문구)" className="bg-black p-5 rounded-2xl border border-white/10 text-sm h-32 outline-none focus:border-[#daa520] resize-none" />
                <div className="flex justify-between items-center bg-black/60 p-6 rounded-3xl border border-[#daa520]/20">
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-[#daa520] uppercase">제국 공식 광고 (AD) 게재</span>
                    <span className="text-[10px] text-gray-500 mt-1 font-bold">리스트 최상단 노출 프리미엄</span>
                  </div>
                  <div className="flex items-center gap-5">
                    <span className="text-xs font-mono text-gray-400 font-black">{AD_REG_COST} BEOM</span>
                    <input type="checkbox" checked={isAdRequest} onChange={(e) => setIsAdRequest(e.target.checked)} className="w-7 h-7 accent-[#daa520] cursor-pointer" />
                  </div>
                </div>
                <button onClick={registerAsset} className={`w-full py-6 rounded-3xl font-black text-base transition-all duration-300 ${isAdRequest ? 'bg-gradient-to-br from-[#daa520] to-[#b8860b] text-black shadow-lg' : 'bg-white/10'}`}>
                  {isAdRequest ? '공식 광고 확보하기 (AD)' : `자산 등록 (${ASSET_REG_COST} BEOM)`}
                </button>
              </div>
            </div>

            <div className="text-center py-20 opacity-20">
               <p className="text-[10px] font-mono tracking-[0.6em] uppercase leading-loose text-white/50">Kedheon Empire Digital Infrastructure<br/>Powered by 88-Threads Engine</p>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
