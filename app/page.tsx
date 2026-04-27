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
  const PI_TO_BEOM_RATE = 314.1592; // 제국 황금 환율 (1 Pi = 314.1592 BEOM)
  const QR_PURCHASE_COST = 50;      
  const ASSET_REG_COST = 10;        
  const AD_REG_COST = 500;          
  const empireCharacterName = 'CHEOREOM_88';
  const empireUrl = "https://kedheon.com";

  // --- [2. 주군 하사 공식 이미지 에셋 반영 완료!] ---
  // public 폴더 내에 해당 파일들이 있어야 합니다.
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
  const [beomToken, setBeomToken] = useState(8888.88);
  const [isQrActive, setIsQrActive] = useState(false);
  const [fanLevel, setFanLevel] = useState(88);
  
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [isAdRequest, setIsAdRequest] = useState(false);

  // --- [4. 카테고리 및 8대 앱 공식 풀 네임] ---
  const categories = ['ALL', 'MUSIC', 'SPORTS', 'ANIME', 'DRAMA', 'MOVIE', 'ESPORTS', 'COMEDY'];
  
  const ecosystemFullApps = [
    'Pi Network', 
    'Nexus AI', 
    'Kedheon AI', 
    'Pi Vendor', 
    'Pi Civil', 
    'Pi FactFilter', 
    'PiPapa', 
    'Pi 6G Network'
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

  // 로직 함수들
  const handleHubClick = (app: string) => {
    setBeomToken(prev => prev + 1);
    setFanLevel(prev => prev + 1);
    alert(`[${app}] 생태계 활동 보상: +1 BEOM 확보!`);
  };

  const purchaseQR = () => {
    if (beomToken < QR_PURCHASE_COST) return alert("범 토큰 잔액이 부족합니다.");
    if (confirm(`${QR_PURCHASE_COST} BEOM을 사용하여 제국 인증 QR을 확보하시겠습니까?`)) {
      setBeomToken(prev => prev - QR_PURCHASE_COST);
      setIsQrActive(true);
    }
  };

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
    
    setAssets([newAsset, ...assets]);
    localStorage.setItem('kedheon_assets', JSON.stringify([newAsset, ...assets]));
    setBeomToken(prev => prev - cost);
    setNewTitle(''); setNewDesc(''); setIsAdRequest(false);
    alert(isAdRequest ? "공식 광고 게재 완료!" : "자산 등록 완료");
  };

  return (
    <div className="flex flex-col items-center bg-black min-h-screen text-white p-6 font-sans w-full overflow-x-hidden">
      
      {/* 탭 네비게이션 */}
      <div className="flex gap-4 mb-10 mt-10 justify-center w-full max-w-2xl">
        <button onClick={() => setTab('ROOKIE')} className={`px-8 py-2 rounded-full font-bold transition-all ${tab === 'ROOKIE' ? 'bg-[#daa520] text-black shadow-[0_0_15px_rgba(218,165,32,0.5)]' : 'bg-white/10 text-gray-500'}`}>ROOKIE</button>
        <button onClick={() => setTab('PIONEER')} className={`px-8 py-2 rounded-full font-bold transition-all ${tab === 'PIONEER' ? 'bg-[#daa520] text-black shadow-[0_0_15px_rgba(218,165,32,0.5)]' : 'bg-white/10 text-gray-500'}`}>PIONEER</button>
      </div>

      <div className="w-full max-w-2xl">
        {tab === 'ROOKIE' ? (
          <div className="flex flex-col items-center text-center py-20 animate-in fade-in zoom-in duration-500">
            <img src={mainCharacter} className="w-64 h-64 rounded-3xl object-cover mb-8 shadow-[0_0_50px_rgba(218,165,32,0.3)]" alt="Kedheon" />
            <h1 className="text-4xl font-black text-[#daa520] tracking-widest mb-4">KEDHEON EMPIRE</h1>
            <p className="text-gray-500 mb-10 font-medium tracking-tighter text-sm">88쓰레드 엔진이 지탱하는 디지털 제국에 입국하십시오.</p>
            <button onClick={() => setTab('PIONEER')} className="bg-[#daa520] text-black px-12 py-5 rounded-2xl font-black hover:scale-105 transition-transform shadow-xl">제국 입국하기</button>
          </div>
        ) : (
          <div className="flex flex-col gap-8 animate-in slide-in-from-bottom-10 duration-700">
            
            {/* 1. 대시보드 (범 토큰 이미지 반영) */}
            <div className="bg-[#111] p-8 rounded-3xl border border-[#daa520]/30 shadow-2xl flex justify-between items-end relative overflow-hidden group">
              <img src={beomTokenImg} className="absolute -top-4 -left-4 w-24 h-24 opacity-20 rotate-12 transition-transform group-hover:scale-110" alt="Beom Token" />
              <div>
                <h3 className="text-gray-500 text-[10px] uppercase tracking-[0.3em] mb-2 font-black">Imperial Asset Balance</h3>
                <p className="text-[#daa520] font-black text-4xl leading-none">{beomToken.toLocaleString(undefined, { minimumFractionDigits: 2 })} BEOM</p>
                <div className="mt-5 bg-black/60 px-4 py-2 rounded-xl border border-white/5 w-fit">
                   <span className="text-gray-400 text-[12px] font-mono font-bold">≈ {(beomToken / PI_TO_BEOM_RATE).toFixed(4)} Pi</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white font-black text-3xl leading-none">Lv. {fanLevel}</p>
                <p className="text-[10px] text-[#daa520] uppercase mt-2 font-black tracking-widest">Empire Grade</p>
              </div>
            </div>

            {/* 2. 카테고리 셀렉터 */}
            <div className="p-6 bg-[#111] rounded-3xl border border-white/5 text-center">
              <div className="flex flex-wrap gap-2 justify-center">
                {categories.map((cat) => (
                  <button key={cat} onClick={() => setCategory(cat)} className={`px-4 py-2 rounded-full text-[10px] font-black transition-all ${category === cat ? 'bg-[#daa520] text-black scale-110 shadow-lg' : 'bg-white/5 text-gray-500 hover:bg-white/10'}`}>{cat}</button>
                ))}
              </div>
            </div>

            {/* 3. 제국 인증 QR 시스템 (2가지 버전 배경 반영) */}
            <div className="bg-[#111] p-8 rounded-3xl border border-[#daa520]/20 text-center relative overflow-hidden">
              <div className="absolute top-3 right-5 text-[10px] text-gray-600 font-mono font-bold">Fee: {QR_PURCHASE_COST} BEOM</div>
              <h3 className="text-[#daa520] font-black mb-6 text-sm tracking-[0.2em] uppercase">Imperial Auth QR System</h3>
              
              <div className="flex gap-2 justify-center mb-6">
                <button onClick={() => {setQrType('PERSONAL'); setIsQrActive(false);}} className={`px-6 py-2 rounded-xl text-[10px] font-black transition-all ${qrType === 'PERSONAL' ? 'bg-[#daa520] text-black' : 'bg-white/5 text-gray-500'}`}>PERSONAL</button>
                <button onClick={() => {setQrType('BUSINESS'); setIsQrActive(false);}} className={`px-6 py-2 rounded-xl text-[10px] font-black transition-all ${qrType === 'BUSINESS' ? 'bg-[#daa520] text-black' : 'bg-white/5 text-gray-500'}`}>BUSINESS</button>
              </div>

              <div className="relative w-full max-w-[340px] mx-auto aspect-[1.8/1] rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
                {/* 주군이 주신 2가지 버전의 QR 배경 이미지 */}
                <img src={qrType === 'PERSONAL' ? personalQrImg : businessQrImg} className="absolute inset-0 w-full h-full object-cover" alt="QR Background" />
                
                <div className={`absolute inset-0 flex flex-col items-center justify-center p-6 transition-all duration-700 ${isQrActive ? 'bg-transparent' : 'bg-black/95 backdrop-blur-3xl'}`}>
                  {isQrActive ? (
                    <div className="bg-white p-2 rounded-2xl shadow-2xl border-2 border-[#daa520]/30 animate-in zoom-in-50">
                      <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(empireUrl + '/?id=' + (qrType === 'BUSINESS' ? businessID : empireCharacterName))}`} className="w-24 h-24" alt="QR Code" />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <span className="text-5xl mb-5 opacity-40">🔐</span>
                      <button onClick={purchaseQR} className="bg-[#daa520] text-black px-10 py-4 rounded-2xl font-black text-xs shadow-lg hover:scale-105 active:scale-95 transition-all">QR 확보하기</button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 4. Ecosystem Infrastructure Hub (풀네임 반영) */}
            <div className="bg-[#111] p-8 rounded-3xl border border-white/5 shadow-inner">
              <h3 className="text-center text-[10px] font-black text-[#daa520] mb-8 uppercase tracking-[0.4em] opacity-80">🌐 Ecosystem Infrastructure Hub</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {ecosystemFullApps.map(app => (
                  <button key={app} onClick={() => handleHubClick(app)} className="h-24 bg-white/5 rounded-2xl border border-white/10 flex flex-col items-center justify-center p-3 hover:bg-[#daa520] hover:text-black transition-all group">
                    <span className="text-[10px] font-black text-[#daa520] group-hover:text-black text-center leading-tight break-words">{app}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 5. 유저 스튜디오 & 광고 센터 */}
            <div className="bg-[#111] p-8 rounded-3xl border border-white/5 relative">
              <h3 className="text-[#daa520] font-black text-sm mb-6 tracking-widest uppercase">User Studio & Imperial AD Center</h3>
              <div className="flex flex-col gap-4">
                <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="제목" className="bg-black p-4 rounded-2xl border border-white/10 text-sm focus:border-[#daa520] outline-none font-bold" />
                <textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="설명 (광고 게재 시 홍보 문구)" className="bg-black p-4 rounded-2xl border border-white/10 text-sm h-28 outline-none focus:border-[#daa520] resize-none" />
                
                <div className="flex justify-between items-center bg-black/60 p-5 rounded-2xl border border-[#daa520]/20 shadow-inner">
                  <div className="flex flex-col">
                    <span className="text-[11px] font-black text-[#daa520] uppercase tracking-tighter">제국 공식 광고 (AD) 게재</span>
                    <span className="text-[9px] text-gray-500 mt-1 font-bold">리스트 최상단 노출 프리미엄</span>
                  </div>
                  <div className="flex items-center gap-5">
                    <span className="text-[10px] font-mono text-gray-400 font-black">{AD_REG_COST} BEOM</span>
                    <input type="checkbox" checked={isAdRequest} onChange={(e) => setIsAdRequest(e.target.checked)} className="w-6 h-6 rounded-md accent-[#daa520] cursor-pointer" />
                  </div>
                </div>

                <button onClick={registerAsset} className={`w-full py-5 rounded-2xl font-black text-sm transition-all duration-300 ${isAdRequest ? 'bg-gradient-to-br from-[#daa520] to-[#b8860b] text-black shadow-lg' : 'bg-white/10 hover:bg-white/20'}`}>
                  {isAdRequest ? '제국 공식 광고 확보하기 (AD)' : `자산 등록 (${ASSET_REG_COST} BEOM)`}
                </button>
              </div>

              {/* 피드 */}
              <div className="mt-12 space-y-5">
                <h3 className="text-gray-500 text-[10px] font-black uppercase tracking-[0.4em] border-b border-white/5 pb-4">Imperial Real-time Feed</h3>
                {assets.filter(a => category === 'ALL' || a.category === category).map((a) => (
                  <div key={a.id} className={`p-6 rounded-3xl border-l-8 transition-all duration-500 ${a.isAd ? 'bg-[#daa520]/10 border-[#daa520] shadow-xl' : 'bg-white/5 border-gray-800'}`}>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        {a.isAd && <span className="bg-[#daa520] text-black text-[9px] px-3 py-1 rounded-full font-black tracking-tighter">AD</span>}
                        <span className="font-black text-white text-base tracking-tight">{a.title}</span>
                      </div>
                      <span className="text-gray-600 text-[11px] font-mono font-black">{a.timestamp}</span>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed mb-5 font-medium">{a.desc}</p>
                    <div className="flex justify-between items-center pt-4 border-t border-white/5">
                      <span className="text-[#daa520] text-[9px] font-black uppercase tracking-widest bg-[#daa520]/10 px-3 py-1 rounded-lg"># {a.category}</span>
                      <span className="text-[10px] text-gray-600 font-mono italic font-bold">Secure ID: {a.owner}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 푸터 */}
            <div className="text-center py-20 opacity-20">
               <div className="w-12 h-1 bg-[#daa520] mx-auto mb-8 rounded-full"></div>
               <p className="text-[9px] font-mono tracking-[0.6em] uppercase leading-loose">Kedheon Empire Digital Infrastructure<br/>Powered by 88-Threads Engine</p>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
