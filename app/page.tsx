'use client';
import React, { useState, useEffect } from 'react';

// --- [1. 데이터 모델 정의] ---
interface Asset { 
  id: number; title: string; desc: string; category: string; 
  videoUrl?: string; beomSupport: number; isAd: boolean; 
  owner: string; timestamp: string; 
}
interface Territory { 
  id: string; title: string; desc: string; creator: string; 
}

// --- [2. 글로벌 다국어 엔진 (i18n)] ---
const translations = {
  KO: {
    hub: "제국 광장",
    staking: "제국 국고 투자",
    board: "영토 게시판",
    balance: "제국 자산 잔액",
    grade: "제국 등급",
    territoryTitle: "Imperial Fandom Territory",
    territoryDesc: "제국 공식 영토 혹은 시민들이 개척한 자치령 팬방에 진입하십시오.",
    enterAll: "전체 피드 진입",
    createRoom: "➕ 새로운 팬방 개척하기 (500 BEOM)",
    qrTitle: "Imperial Auth QR System",
    qrDesc: "지갑 주소 노출 없는 제국 전용 보안 인증 결제망을 가동합니다.",
    qrSecurity: [
      { t: "01. 익명성 보장", d: "개인 지갑 주소를 노출하지 않고 제국 전용 결제 ID로 안전하게 거래합니다." },
      { t: "02. 철통 방패", d: "모든 트랜잭션은 앱 지갑을 거점으로 보호되어 송금인의 직접 추적을 차단합니다." },
      { t: "03. 프라이버시", d: "상대방은 주군의 자산 잔액이나 과거 거래 내역을 결코 엿볼 수 없습니다." }
    ],
    qrAuth: "보안 인증 확보",
    stakingTitle: "Imperial Staking Reserve",
    stakingDesc: "제국의 번영에 베팅하십시오. 스테이킹된 BEOM은 제국의 인프라 확장에 사용됩니다.",
    stakedBalance: "현재 투자 중인 자산",
    stakeBtn: "투자 실행 (스테이킹)",
    roi30: "30일 (수익률 3.14%)",
    roi180: "180일 (수익률 15.0%)",
    roi365: "365일 (수익률 44.0%)",
    broadcastTitle: "BROADCAST CENTER",
    broadcastDesc: "영상을 박제하여 시민들의 BEOM 호응을 이끌어내십시오.",
    postBtn: "피드에 방송하기",
    supportBtn: "👑 황금 찬양 (100 BEOM)",
    backBtn: "← 광장 복귀"
  },
  EN: {
    hub: "Empire Hub",
    staking: "Imperial Staking",
    board: "Territory Board",
    balance: "Empire Balance",
    grade: "Empire Grade",
    territoryTitle: "Imperial Fandom Territory",
    territoryDesc: "Enter official territories or user-created autonomous fan rooms.",
    enterAll: "ENTER ALL FEED",
    createRoom: "➕ Create New Fan Room (500 BEOM)",
    qrTitle: "Imperial Auth QR System",
    qrDesc: "Activate secure payment network without exposing wallet addresses.",
    qrSecurity: [
      { t: "01. Anonymity", d: "Trade securely using an Empire-exclusive ID without exposing your wallet address." },
      { t: "02. Iron Shield", d: "All transactions are protected via the App Wallet to block direct tracking." },
      { t: "03. Privacy", d: "Others can never peek at your asset balance or past transaction history." }
    ],
    qrAuth: "Secure Auth",
    stakingTitle: "Imperial Staking Reserve",
    stakingDesc: "Bet on the Empire's prosperity. Staked BEOM fuels our infrastructure expansion.",
    stakedBalance: "Current Staked Balance",
    stakeBtn: "Execute Investment",
    roi30: "30 Days (ROI 3.14%)",
    roi180: "180 Days (ROI 15.0%)",
    roi365: "365 Days (ROI 44.0%)",
    broadcastTitle: "BROADCAST CENTER",
    broadcastDesc: "Broadcast videos and earn BEOM support from fellow citizens.",
    postBtn: "Broadcast to Feed",
    supportBtn: "👑 Royal Praise (100 BEOM)",
    backBtn: "← Back to Hub"
  }
};

const SectionTitle = ({ title, desc }: { title: string; desc: string }) => (
  <div className="flex flex-col items-center mb-14 gap-4 px-4 text-center">
    <div className="flex items-center gap-6">
      <span className="text-6xl animate-pulse">🏛️</span>
      <h3 className="text-[#daa520] font-black text-5xl tracking-[0.2em] uppercase leading-tight">{title}</h3>
    </div>
    <p className="text-gray-400 font-bold text-2xl tracking-wide opacity-80 max-w-5xl leading-relaxed">{desc}</p>
  </div>
);

export default function KedheonPortal() {
  const PI_TO_BEOM_RATE = 314.1592;
  const TERRITORY_CREATE_COST = 500;
  const empireCharacterName = 'CHEOREOM_88';
  const empireUrl = "https://kedheon.com";

  // 상태 관리
  const [hasMounted, setHasMounted] = useState(false);
  const [lang, setLang] = useState<'KO' | 'EN'>('KO');
  const [tab, setTab] = useState<'ROOKIE' | 'PIONEER'>('PIONEER');
  const [viewMode, setViewMode] = useState<'HUB' | 'STAKING' | 'BOARD'>('HUB'); 
  const [category, setCategory] = useState('ALL');
  
  const [beomToken, setBeomToken] = useState(8141.88);
  const [stakedBeom, setStakedBeom] = useState(0);
  const [stakeDuration, setStakeDuration] = useState(30);
  
  const [assets, setAssets] = useState<Asset[]>([]);
  const [userTerritories, setUserTerritories] = useState<Territory[]>([]);
  
  const [isQrActive, setIsQrActive] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [createRoomTitle, setCreateRoomTitle] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const t = translations[lang];
  const beomTokenImg = "/beom-token.png";

  // 데이터 로드 및 SDK 준비
  useEffect(() => {
    setHasMounted(true);
    const savedAssets = localStorage.getItem('k_assets');
    const savedRooms = localStorage.getItem('k_rooms');
    const savedToken = localStorage.getItem('k_token');
    if (savedAssets) setAssets(JSON.parse(savedAssets));
    if (savedRooms) setUserTerritories(JSON.parse(savedRooms));
    if (savedToken) setBeomToken(parseFloat(savedToken));

    const script = document.createElement("script");
    script.src = "https://sdk.minepi.com/pi-sdk.js";
    script.async = true;
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (hasMounted) {
      localStorage.setItem('k_token', beomToken.toString());
      localStorage.setItem('k_assets', JSON.stringify(assets));
      localStorage.setItem('k_rooms', JSON.stringify(userTerritories));
    }
  }, [beomToken, assets, userTerritories, hasMounted]);

  if (!hasMounted) return null;

  // 비즈니스 로직
  const handleStaking = () => {
    if (beomToken < 1000) return alert("잔액 부족!");
    setBeomToken(prev => prev - 1000);
    setStakedBeom(prev => prev + 1000);
    alert("1,000 BEOM이 예치되었습니다!");
  };

  const handleCreateTerritory = () => {
    if (beomToken < TERRITORY_CREATE_COST) return alert("잔액 부족!");
    const newRoom = { id: createRoomTitle.toUpperCase(), title: createRoomTitle.toUpperCase(), desc: "", creator: empireCharacterName };
    setUserTerritories([...userTerritories, newRoom]);
    setBeomToken(prev => prev - TERRITORY_CREATE_COST);
    setShowCreateModal(false); setCreateRoomTitle('');
  };

  const registerAsset = () => {
    if (beomToken < 10) return alert("잔액 부족!");
    const newAsset: Asset = { id: Date.now(), title: newTitle, desc: newDesc, category, videoUrl: newVideoUrl, beomSupport: 0, isAd: false, owner: empireCharacterName, timestamp: new Date().toLocaleDateString() };
    setAssets([newAsset, ...assets]);
    setBeomToken(prev => prev - 10);
    setNewTitle(''); setNewDesc(''); setNewVideoUrl('');
  };

  const support = (id: number, amt: number) => {
    if (beomToken < amt) return alert("잔액 부족!");
    setAssets(assets.map(a => a.id === id ? { ...a, beomSupport: a.beomSupport + amt } : a));
    setBeomToken(prev => prev - amt);
  };

  return (
    <div className="flex flex-col items-center bg-black min-h-screen text-white p-6 font-sans w-full overflow-x-hidden">
      
      {/* 네비게이션 */}
      <div className="w-full max-w-6xl flex justify-between items-center mt-6 mb-12">
        <button onClick={() => setLang(l => l === 'KO' ? 'EN' : 'KO')} className="bg-[#daa520] text-black px-8 py-3 rounded-full font-black text-sm shadow-xl hover:scale-110 transition-all">
          {lang === 'KO' ? "ENGLISH MODE" : "한국어 모드"}
        </button>
        <div className="flex gap-4">
          <button onClick={() => {setTab('HUB'); setViewMode('HUB');}} className={`px-8 py-3 rounded-2xl font-black text-lg transition-all ${viewMode === 'HUB' ? 'bg-[#daa520] text-black shadow-lg' : 'bg-[#111] text-gray-500'}`}>HUB</button>
          <button onClick={() => setViewMode('STAKING')} className={`px-8 py-3 rounded-2xl font-black text-lg transition-all ${viewMode === 'STAKING' ? 'bg-[#daa520] text-black shadow-lg' : 'bg-[#111] text-gray-500'}`}>STAKING</button>
          <button onClick={() => setViewMode('BOARD')} className={`px-8 py-3 rounded-2xl font-black text-lg transition-all ${viewMode === 'BOARD' ? 'bg-[#daa520] text-black shadow-lg' : 'bg-[#111] text-gray-500'}`}>TERRITORY</button>
        </div>
      </div>

      <div className="w-full max-w-6xl space-y-16">
        
        {/* 대시보드 - 선명한 범 토큰 (Glow 제거 버전) */}
        <div className="bg-[#111] p-12 rounded-[60px] border border-[#daa520]/40 shadow-2xl flex justify-between items-center group relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-gray-500 text-xs uppercase tracking-[0.4em] mb-4 font-black">{t.balance}</h3>
            <p className="text-[#daa520] font-black text-7xl tracking-tighter">{beomToken.toLocaleString()} BEOM</p>
            <div className="mt-8 bg-black/40 px-6 py-3 rounded-xl border border-white/5 w-fit">
              <span className="text-gray-400 font-mono">≈ {(beomToken / PI_TO_BEOM_RATE).toFixed(4)} Pi</span>
            </div>
          </div>
          <div className="flex flex-col items-end z-10">
            <div className="w-64 h-64 flex items-center justify-center overflow-visible relative">
              <img src={beomTokenImg} className="w-full h-full object-contain transform hover:scale-110 transition-transform duration-500" alt="Beom Medallion" />
            </div>
            <p className="text-white font-black text-8xl mt-4 leading-none tracking-tighter">Lv. 88</p>
            <p className="text-base text-[#daa520] uppercase mt-2 font-black tracking-[0.5em]">{t.grade}</p>
          </div>
        </div>

        {/* --- 뷰 모드 전환 --- */}

        {viewMode === 'HUB' && (
          <div className="animate-in fade-in duration-700 space-y-16">
            <SectionTitle title={t.qrTitle} desc={t.qrDesc} />
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-left border-y border-white/5 py-10 mb-12">
              {t.qrSecurity.map((item, idx) => (
                <div key={idx} className="space-y-3 px-4">
                  <p className="text-[#daa520] font-black text-xl italic">{item.t}</p>
                  <p className="text-gray-500 text-base font-medium leading-relaxed">{item.d}</p>
                </div>
              ))}
            </div>
            <div className="bg-[#111] p-16 rounded-[60px] border border-white/5 text-center">
               {isQrActive ? (
                 <div className="bg-white p-6 rounded-[50px] inline-block shadow-2xl border-8 border-[#daa520]/30 animate-in zoom-in-50">
                   <img src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(empireUrl + '/?id=' + empireCharacterName)}`} className="w-48 h-48" alt="QR" />
                 </div>
               ) : (
                 <button onClick={() => {setBeomToken(beomToken-50); setIsQrActive(true);}} className="bg-[#daa520] text-black px-24 py-10 rounded-3xl font-black text-3xl shadow-2xl hover:scale-105 transition-all uppercase">{t.qrAuth}</button>
               )}
            </div>
          </div>
        )}

        {viewMode === 'STAKING' && (
          <div className="animate-in zoom-in-95 duration-700 space-y-12">
            <SectionTitle title={t.stakingTitle} desc={t.stakingDesc} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-[#111] p-12 rounded-[50px] border border-white/5">
                <p className="text-gray-500 font-black mb-4 uppercase tracking-widest">{t.stakedBalance}</p>
                <p className="text-white font-black text-6xl tracking-tighter">{stakedBeom.toLocaleString()} BEOM</p>
              </div>
              <div className="bg-[#111] p-12 rounded-[50px] border border-[#daa520]/20 flex flex-col justify-center gap-6">
                <select onChange={(e) => setStakeDuration(Number(e.target.value))} className="bg-black text-[#daa520] p-6 rounded-3xl border border-white/10 font-black text-xl outline-none">
                  <option value="30">{t.roi30}</option>
                  <option value="180">{t.roi180}</option>
                  <option value="365">{t.roi365}</option>
                </select>
                <button onClick={handleStaking} className="bg-[#daa520] text-black py-8 rounded-3xl font-black text-2xl shadow-2xl hover:bg-white transition-all uppercase">{t.stakeBtn}</button>
              </div>
            </div>
          </div>
        )}

        {viewMode === 'BOARD' && (
          <div className="animate-in slide-in-from-right-8 duration-700 space-y-12">
            <SectionTitle title={t.territoryTitle} desc={t.territoryDesc} />
            <div className="flex flex-wrap gap-4 justify-center">
              <button onClick={() => setCategory('ALL')} className={`px-8 py-4 rounded-2xl font-black ${category === 'ALL' ? 'bg-[#daa520] text-black' : 'bg-[#111] text-gray-500'}`}>{t.enterAll}</button>
              {['MUSIC', 'SPORTS', 'ANIME', 'DRAMA', 'MOVIE'].map(cat => (
                <button key={cat} onClick={() => setCategory(cat)} className={`px-8 py-4 rounded-2xl font-black ${category === cat ? 'bg-[#daa520] text-black' : 'bg-[#111] text-gray-500'}`}>ENTER {cat}</button>
              ))}
              {userTerritories.map(room => (
                <button key={room.id} onClick={() => setCategory(room.id)} className={`px-8 py-4 rounded-2xl font-black border border-[#daa520]/40 ${category === room.id ? 'bg-[#daa520] text-black' : 'text-[#daa520]'}`}>👑 {room.title}</button>
              ))}
              <button onClick={() => setShowCreateModal(true)} className="bg-white/5 text-white px-8 py-4 rounded-2xl border border-white/10 font-black tracking-tighter">{t.createRoom}</button>
            </div>

            {/* 방송 등록 폼 */}
            <div className="bg-[#111] p-16 rounded-[60px] border border-white/10 max-w-4xl mx-auto space-y-6 text-left">
              <SectionTitle title={t.broadcastTitle} desc={t.broadcastDesc} />
              <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Title" className="bg-black p-8 rounded-[35px] border border-white/10 w-full text-2xl outline-none focus:border-[#daa520] font-black" />
              <input type="text" value={newVideoUrl} onChange={(e) => setNewVideoUrl(e.target.value)} placeholder="YouTube URL" className="bg-black p-8 rounded-[35px] border border-white/10 w-full text-xl outline-none focus:border-[#daa520] font-mono text-[#daa520]" />
              <textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="Description" className="bg-black p-8 rounded-[35px] border border-white/10 w-full text-xl h-48 outline-none focus:border-[#daa520] resize-none" />
              <button onClick={registerAsset} className="w-full py-10 rounded-[50px] font-black text-3xl bg-gradient-to-br from-[#daa520] to-[#b8860b] text-black shadow-2xl uppercase tracking-widest">{t.postBtn}</button>
            </div>

            {/* 피드 렌더링 */}
            <div className="space-y-16 max-w-4xl mx-auto">
              {assets.filter(a => category === 'ALL' || a.category === category).map((a) => (
                <div key={a.id} className="p-12 rounded-[70px] bg-[#111] border-l-[24px] border-gray-800 shadow-xl text-left overflow-hidden">
                  <div className="flex justify-between items-start mb-10"><h4 className="font-black text-white text-5xl tracking-tight leading-tight">{a.title}</h4><span className="text-gray-600 text-base font-mono font-black">{a.timestamp}</span></div>
                  {a.videoUrl && a.videoUrl.includes('v=') && (
                    <div className="relative w-full aspect-video rounded-[50px] overflow-hidden mb-10 border-8 border-white/5 bg-black">
                       <iframe className="absolute inset-0 w-full h-full" src={`https://www.youtube.com/embed/${a.videoUrl.split('v=')[1]}`} frameBorder="0" allowFullScreen></iframe>
                    </div>
                  )}
                  <p className="text-2xl text-gray-400 leading-relaxed mb-12 pl-4">{a.desc}</p>
                  <div className="flex justify-between items-center pt-10 border-t border-white/5">
                    <button onClick={() => support(a.id, 100)} className="bg-[#daa520] text-black px-12 py-5 rounded-3xl font-black text-xl hover:scale-110 active:scale-95 transition-all shadow-xl">{t.supportBtn}</button>
                    <p className="text-[#daa520] font-black text-4xl tracking-tighter">{a.beomSupport.toLocaleString()} BEOM</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* 모달: 영토 개척 */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-6 text-center">
          <div className="bg-[#111] p-12 rounded-[50px] border border-[#daa520]/50 w-full max-w-2xl animate-in zoom-in-95">
            <h3 className="text-[#daa520] font-black text-3xl mb-4">EXPAND TERRITORY</h3>
            <input type="text" value={createRoomTitle} onChange={(e) => setCreateRoomTitle(e.target.value)} placeholder="Territory Name" className="bg-black p-6 rounded-3xl border border-white/10 w-full text-xl focus:border-[#daa520] outline-none font-black text-center mb-8" />
            <div className="flex gap-4">
              <button onClick={() => setShowCreateModal(false)} className="flex-1 py-6 rounded-3xl font-black bg-white/5">CANCEL</button>
              <button onClick={handleCreateTerritory} className="flex-1 py-6 rounded-3xl font-black bg-[#daa520] text-black shadow-2xl">PROCLAIM (500 BEOM)</button>
            </div>
          </div>
        </div>
      )}
      
      <div className="text-center py-40 opacity-10"><p className="text-sm font-mono tracking-[1.5em] uppercase text-white/50">Kedheon Empire | Unified .pi Codebase v2.0</p></div>
    </div>
  );
}
