'use client';
import React, { useState, useEffect } from 'react';

// --- [데이터 모델 정의] ---
interface Asset { 
  id: number; title: string; desc: string; category: string; 
  videoUrl?: string; beomSupport: number; isAd: boolean; 
  owner: string; timestamp: string; 
}

interface Territory {
  id: string; title: string; desc: string; creator: string;
}

// --- [글로벌 다국어 사전] ---
const translations = {
  KO: {
    hub: "제국 광장",
    balance: "제국 자산 잔액",
    grade: "제국 등급",
    territoryTitle: "Imperial Fandom Territory",
    territoryDesc: "제국 공식 영토 혹은 시민들이 개척한 자치령 팬방에 진입하십시오.",
    enterAll: "전체 피드 진입",
    createRoom: "➕ 새로운 팬방 개척하기 (500 BEOM)",
    qrTitle: "Imperial Auth QR System",
    qrDesc: "제국 공식 신분 인증 및 결제용 QR을 활성화합니다.",
    qrSecurity: [
      { t: "01. 익명성 보장", d: "개인 지갑 주소를 노출하지 않고 제국 전용 결제 ID로 안전하게 거래합니다." },
      { t: "02. 철통 방패", d: "모든 트랜잭션은 앱 지갑을 거점으로 보호되어 송금인의 직접 추적을 차단합니다." },
      { t: "03. 프라이버시", d: "상대방은 주군의 자산 잔액이나 과거 거래 내역을 결코 엿볼 수 없습니다." }
    ],
    qrAuth: "인증 확보 (보안 결제)",
    hubTitle: "🌐 Ecosystem Infrastructure Hub",
    hubDesc: "제국의 8대 핵심 시스템 가동 상태를 확인하십시오.",
    broadcastTitle: "BROADCAST CENTER",
    broadcastDesc: "영상을 박제하여 시민들의 BEOM 호응을 이끌어내십시오.",
    postBtn: "피드에 방송하기",
    supportBtn: "👑 황금 찬양 (100 BEOM)",
    backBtn: "← 광장으로 복귀",
    createModalTitle: "Expand Territory",
    createModalDesc: "새로운 팬덤 영토를 선포하십시오.",
    confirmCreate: "선포 (500 BEOM)",
    cancel: "취소"
  },
  EN: {
    hub: "Empire Hub",
    balance: "Imperial Balance",
    grade: "Empire Grade",
    territoryTitle: "Imperial Fandom Territory",
    territoryDesc: "Enter official territories or user-created autonomous fan rooms.",
    enterAll: "ENTER ALL FEED",
    createRoom: "➕ Create New Fan Room (500 BEOM)",
    qrTitle: "Imperial Auth QR System",
    qrDesc: "Activate official identification and payment QR for the Empire.",
    qrSecurity: [
      { t: "01. Anonymity", d: "Trade securely using an Empire-exclusive ID without exposing your wallet address." },
      { t: "02. Iron Shield", d: "All transactions are protected via the App Wallet to block direct tracking." },
      { t: "03. Privacy", d: "Others can never peek at your asset balance or past transaction history." }
    ],
    qrAuth: "Secure Auth (Encrypted)",
    hubTitle: "🌐 Ecosystem Infrastructure Hub",
    hubDesc: "Monitor the operational status of the Empire's 8 core systems.",
    broadcastTitle: "BROADCAST CENTER",
    broadcastDesc: "Broadcast videos and earn BEOM support from fellow citizens.",
    postBtn: "Broadcast to Feed",
    supportBtn: "👑 Royal Praise (100 BEOM)",
    backBtn: "← BACK TO HUB",
    createModalTitle: "Expand Territory",
    createModalDesc: "Proclaim a new fandom territory.",
    confirmCreate: "Proclaim (500 BEOM)",
    cancel: "Cancel"
  }
};

// --- [공통 섹션 타이틀 컴포넌트] ---
const SectionTitle = ({ title, desc }: { title: string; desc: string }) => (
  <div className="flex flex-col items-center mb-14 gap-4 px-4">
    <div className="flex items-center gap-6">
      <span className="text-6xl animate-pulse">🌐</span>
      <h3 className="text-[#daa520] font-black text-5xl tracking-[0.2em] uppercase leading-tight text-center">
        {title}
      </h3>
    </div>
    <p className="text-gray-400 font-bold text-2xl tracking-wide opacity-80 text-center max-w-5xl leading-relaxed">
      {desc}
    </p>
  </div>
);

export default function KedheonPortal() {
  // --- [1. 상수 및 환경 설정] ---
  const PI_TO_BEOM_RATE = 314.1592; 
  const QR_PURCHASE_COST = 50;
  const TERRITORY_CREATE_COST = 500;
  const empireCharacterName = 'CHEOREOM_88';
  const empireUrl = "https://kedheon.com";

  // 에셋 경로
  const mainCharacter = "/kedheon-character.png"; 
  const beomTokenImg = "/beom-token.png";
  const businessQrImg = "/qr-business.png";
  const personalQrImg = "/qr-personal.png";

  // 기본 고정 데이터
  const defaultCategories = ['MUSIC', 'SPORTS', 'ANIME', 'DRAMA', 'MOVIE', 'ESPORTS', 'COMEDY'];
  const ecosystemApps = ['Pi Network', 'Nexus AI', 'Kedheon AI', 'Pi Vendor', 'Pi Civil', 'Pi FactFilter', 'PiPapa', 'Pi 6G Network'];

  // --- [2. 상태 관리] ---
  const [hasMounted, setHasMounted] = useState(false);
  const [lang, setLang] = useState<'KO' | 'EN'>('KO');
  const [tab, setTab] = useState<'ROOKIE' | 'PIONEER'>('PIONEER');
  const [viewMode, setViewMode] = useState<'HUB' | 'BOARD'>('HUB'); 
  const [category, setCategory] = useState('ALL');
  
  const [beomToken, setBeomToken] = useState(8791.88); 
  const [assets, setAssets] = useState<Asset[]>([]);
  const [userTerritories, setUserTerritories] = useState<Territory[]>([]);
  
  const [qrType, setQrType] = useState<'PERSONAL' | 'BUSINESS'>('PERSONAL');
  const [isQrActive, setIsQrActive] = useState(false);
  const [businessName, setBusinessName] = useState('해태건축사');
  const [businessID, setBusinessID] = useState('HT-0001');

  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [createRoomTitle, setCreateRoomTitle] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const t = translations[lang];

  // --- [3. 라이프사이클 및 데이터 로드] ---
  useEffect(() => {
    setHasMounted(true);
    const savedAssets = localStorage.getItem('k_assets');
    const savedRooms = localStorage.getItem('k_rooms');
    const savedToken = localStorage.getItem('k_token');
    const savedLang = localStorage.getItem('k_lang');
    
    if (savedAssets) setAssets(JSON.parse(savedAssets));
    if (savedRooms) setUserTerritories(JSON.parse(savedRooms));
    if (savedToken) setBeomToken(parseFloat(savedToken));
    if (savedLang === 'KO' || savedLang === 'EN') setLang(savedLang);
  }, []);

  useEffect(() => {
    if (hasMounted) {
      localStorage.setItem('k_token', beomToken.toString());
      localStorage.setItem('k_assets', JSON.stringify(assets));
      localStorage.setItem('k_rooms', JSON.stringify(userTerritories));
      localStorage.setItem('k_lang', lang);
    }
  }, [beomToken, assets, userTerritories, lang, hasMounted]);

  if (!hasMounted) return null;

  // --- [4. 비즈니스 로직] ---
  const toggleLang = () => setLang(prev => prev === 'KO' ? 'EN' : 'KO');

  const handleCreateTerritory = () => {
    if (beomToken < TERRITORY_CREATE_COST) return alert(lang === 'KO' ? "잔액 부족" : "Insufficient Balance");
    if (!createRoomTitle.trim()) return alert(lang === 'KO' ? "이름을 입력하세요" : "Enter a name");
    
    const newRoom: Territory = { id: createRoomTitle.toUpperCase(), title: createRoomTitle.toUpperCase(), desc: "", creator: empireCharacterName };
    setUserTerritories([...userTerritories, newRoom]);
    setBeomToken(prev => prev - TERRITORY_CREATE_COST);
    setShowCreateModal(false); 
    setCreateRoomTitle('');
  };

  const registerAsset = () => {
    if (!newTitle.trim()) return alert(lang === 'KO' ? "제목 필수" : "Title required");
    if (beomToken < 10) return alert(lang === 'KO' ? "잔액 부족" : "Insufficient Balance");
    
    const newAsset: Asset = { 
      id: Date.now(), title: newTitle, desc: newDesc, category, videoUrl: newVideoUrl, 
      beomSupport: 0, isAd: false, owner: empireCharacterName, timestamp: new Date().toLocaleDateString() 
    };
    setAssets([newAsset, ...assets]);
    setBeomToken(prev => prev - 10);
    setNewTitle(''); setNewDesc(''); setNewVideoUrl('');
  };

  const support = (id: number, amt: number) => {
    if (beomToken < amt) return alert(lang === 'KO' ? "잔액 부족" : "Insufficient Balance");
    setAssets(assets.map(a => a.id === id ? { ...a, beomSupport: a.beomSupport + amt } : a));
    setBeomToken(prev => prev - amt);
  };

  return (
    <div className="flex flex-col items-center bg-black min-h-screen text-white p-6 font-sans w-full overflow-x-hidden">
      
      {/* 글로벌 헤더 */}
      <div className="w-full max-w-6xl flex justify-between items-center mt-6 mb-10">
        <button onClick={toggleLang} className="bg-[#daa520] text-black px-8 py-3 rounded-full font-black text-sm shadow-xl hover:scale-110 transition-all">
          {lang === 'KO' ? "ENGLISH MODE" : "한국어 모드"}
        </button>
        <div className="flex gap-4">
          <button onClick={() => {setTab('ROOKIE'); setViewMode('HUB');}} className={`px-10 py-3 rounded-2xl font-black text-lg transition-all ${tab === 'ROOKIE' ? 'bg-[#daa520] text-black' : 'bg-[#111] text-gray-500'}`}>ROOKIE</button>
          <button onClick={() => {setTab('PIONEER'); setViewMode('HUB');}} className={`px-10 py-3 rounded-2xl font-black text-lg transition-all ${tab === 'PIONEER' ? 'bg-[#daa520] text-black shadow-lg shadow-[#daa520]/20' : 'bg-[#111] text-gray-500'}`}>PIONEER</button>
        </div>
      </div>

      <div className="w-full max-w-6xl">
        {tab === 'ROOKIE' ? (
          <div className="flex flex-col items-center text-center py-20 animate-in fade-in zoom-in duration-500">
            <img src={mainCharacter} className="w-80 h-80 rounded-[60px] object-cover mb-12 shadow-2xl border-4 border-[#daa520]/20" alt="K" />
            <h1 className="text-7xl font-black text-[#daa520] tracking-widest mb-8 uppercase leading-none">Kedheon Empire</h1>
            <button onClick={() => setTab('PIONEER')} className="bg-[#daa520] text-black px-24 py-10 rounded-3xl font-black text-3xl shadow-2xl hover:scale-105 transition-transform">제국 입국하기</button>
          </div>
        ) : (
          <div className="flex flex-col gap-16 animate-in slide-in-from-bottom-10 duration-700">
            
            {viewMode === 'HUB' ? (
              <>
                {/* 1. 대시보드 */}
                <div className="bg-[#111] p-12 rounded-[60px] border border-[#daa520]/40 shadow-2xl flex justify-between items-center group relative overflow-hidden">
                  <div className="relative z-10 text-left">
                    <h3 className="text-gray-500 text-xs uppercase tracking-[0.4em] mb-4 font-black opacity-60">{t.balance}</h3>
                    <p className="text-[#daa520] font-black text-7xl leading-none tracking-tighter">{beomToken.toLocaleString()} BEOM</p>
                    <div className="mt-12 bg-black/60 px-8 py-4 rounded-2xl border border-white/10 w-fit backdrop-blur-md">
                       <span className="text-gray-200 text-xl font-mono font-bold">≈ {(beomToken / PI_TO_BEOM_RATE).toFixed(4)} Pi</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end relative z-10"> 
                    <div className="w-48 h-48 rounded-full overflow-hidden border-8 border-[#daa520]/50 shadow-[0_0_50px_rgba(218,165,32,0.6)] mb-8 bg-black">
                       <img src={beomTokenImg} className="w-full h-full object-cover scale-110" alt="Coin" />
                    </div>
                    <div className="text-right">
                        <p className="text-white font-black text-7xl leading-none">Lv. 88</p>
                        <p className="text-base text-[#daa520] uppercase mt-4 font-black tracking-[0.5em]">{t.grade}</p>
                    </div>
                  </div>
                </div>

                {/* 2. 영토 선택 */}
                <div className="p-16 bg-[#111] rounded-[60px] border border-white/5 text-center">
                  <SectionTitle title={t.territoryTitle} desc={t.territoryDesc} />
                  <div className="flex flex-wrap gap-5 justify-center mb-12">
                    <button onClick={() => {setCategory('ALL'); setViewMode('BOARD');}} className="px-12 py-6 rounded-3xl text-sm font-black bg-[#daa520] text-black shadow-lg hover:scale-105 transition-all">{t.enterAll}</button>
                    {defaultCategories.map(cat => (
                      <button key={cat} onClick={() => {setCategory(cat); setViewMode('BOARD');}} className="px-12 py-6 rounded-3xl text-sm font-black bg-[#1a1a1a] text-gray-500 border border-white/5 hover:border-[#daa520]/40 transition-all uppercase">ENTER {cat}</button>
                    ))}
                    {userTerritories.map(room => (
                      <button key={room.id} onClick={() => {setCategory(room.id); setViewMode('BOARD');}} className="px-12 py-6 rounded-3xl text-sm font-black bg-gradient-to-r from-[#daa520]/20 to-[#1a1a1a] text-[#daa520] border border-[#daa520]/30 shadow-xl hover:scale-105 transition-all uppercase font-bold">👑 {room.title}</button>
                    ))}
                  </div>
                  <button onClick={() => setShowCreateModal(true)} className="bg-white/5 text-white px-10 py-5 rounded-full border border-white/10 font-black hover:bg-white/10 transition-all">
                    {t.createRoom}
                  </button>
                </div>

                {/* 3. QR 시스템 */}
                <div className="bg-[#111] p-16 rounded-[60px] border border-[#daa520]/20 text-center relative overflow-hidden">
                  <SectionTitle title={t.qrTitle} desc={t.qrDesc} />
                  <div className="max-w-4xl mx-auto mb-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-left border-y border-white/5 py-10">
                    {t.qrSecurity.map((item, idx) => (
                      <div key={idx} className="space-y-3 px-4">
                        <p className="text-[#daa520] font-black text-xl italic">{item.t}</p>
                        <p className="text-gray-500 text-base font-medium leading-relaxed">{item.d}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-4 justify-center mb-12">
                    <button onClick={() => {setQrType('PERSONAL'); setIsQrActive(false);}} className={`px-12 py-5 rounded-2xl text-sm font-black transition-all ${qrType === 'PERSONAL' ? 'bg-[#daa520] text-black shadow-lg' : 'bg-[#1a1a1a] text-gray-500'}`}>PERSONAL AUTH</button>
                    <button onClick={() => {setQrType('BUSINESS'); setIsQrActive(false);}} className={`px-12 py-5 rounded-2xl text-sm font-black transition-all ${qrType === 'BUSINESS' ? 'bg-[#daa520] text-black shadow-lg' : 'bg-[#1a1a1a] text-gray-500'}`}>BUSINESS AUTH</button>
                  </div>
                  <div className="relative w-full max-w-[650px] mx-auto aspect-[1.8/1] rounded-[50px] border border-white/10 overflow-hidden shadow-2xl group mb-10">
                    <img src={qrType === 'PERSONAL' ? personalQrImg : businessQrImg} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="QR" />
                    <div className={`absolute inset-0 flex flex-col items-center justify-center p-12 transition-all ${isQrActive ? 'bg-transparent' : 'bg-black/95 backdrop-blur-3xl'}`}>
                      {isQrActive ? (
                        <div className="bg-white p-6 rounded-[50px] shadow-2xl border-8 border-[#daa520]/30 animate-in zoom-in-50">
                          <img src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(empireUrl + '/?id=' + empireCharacterName)}`} className="w-48 h-48" alt="QR" />
                        </div>
                      ) : (
                        <button onClick={() => {setBeomToken(beomToken-50); setIsQrActive(true);}} className="bg-[#daa520] text-black px-20 py-8 rounded-3xl font-black text-2xl shadow-xl hover:scale-105 transition-all uppercase tracking-widest">{t.qrAuth}</button>
                      )}
                    </div>
                  </div>
                  {qrType === 'BUSINESS' && (
                    <div className="flex flex-col gap-5 max-w-md mx-auto animate-in slide-in-from-top-6">
                      <input type="text" value={businessName} onChange={(e) => {setBusinessName(e.target.value); setIsQrActive(false);}} placeholder="Business Name" className="bg-black/60 border border-white/10 p-6 rounded-3xl text-xl focus:border-[#daa520] outline-none text-center font-black" />
                      <input type="text" value={businessID} onChange={(e) => {setBusinessID(e.target.value); setIsQrActive(false);}} placeholder="ID Number" className="bg-black/60 border border-white/10 p-6 rounded-3xl text-xl focus:border-[#daa520] outline-none text-center font-mono text-[#daa520]" />
                    </div>
                  )}
                </div>

                {/* 4. 에코 허브 */}
                <div className="bg-[#111] p-16 rounded-[60px] border border-white/5">
                  <SectionTitle title={t.hubTitle} desc={t.hubDesc} />
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {ecosystemApps.map(app => (
                      <button key={app} className="h-40 bg-[#1a1a1a] rounded-[50px] border border-white/5 flex items-center justify-center p-8 hover:bg-[#daa520] hover:text-black transition-all font-black text-sm text-[#daa520] text-center shadow-xl uppercase">{app}</button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              /* --- [BOARD VIEW] --- */
              <div className="flex flex-col gap-12 animate-in fade-in duration-500">
                <div className="flex justify-between items-center bg-[#111] p-10 rounded-[40px] border border-white/5">
                  <button onClick={() => setViewMode('HUB')} className="bg-[#1a1a1a] text-[#daa520] px-12 py-5 rounded-2xl font-black border border-[#daa520]/40 hover:bg-[#daa520] hover:text-black transition-all text-base tracking-widest">{t.backBtn}</button>
                  <p className="text-white font-black text-5xl uppercase tracking-tighter leading-none">{category}</p>
                </div>
                <div className="bg-[#111] p-16 rounded-[60px] border border-white/10 shadow-inner">
                  <SectionTitle title={`${category} ${t.broadcastTitle}`} desc={t.broadcastDesc} />
                  <div className="flex flex-col gap-6 max-w-4xl mx-auto text-left">
                    <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Title" className="bg-black p-8 rounded-[35px] border border-white/10 text-2xl focus:border-[#daa520] outline-none font-black" />
                    <input type="text" value={newVideoUrl} onChange={(e) => setNewVideoUrl(e.target.value)} placeholder="YouTube URL" className="bg-black p-8 rounded-[35px] border border-white/10 text-xl focus:border-[#daa520] outline-none font-mono text-[#daa520]" />
                    <textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="Description" className="bg-black p-8 rounded-[35px] border border-white/10 text-xl h-56 outline-none focus:border-[#daa520] resize-none" />
                    <button onClick={registerAsset} className="w-full py-10 rounded-[50px] font-black text-3xl bg-gradient-to-br from-[#daa520] to-[#b8860b] text-black shadow-2xl transition-all uppercase tracking-widest">{t.postBtn}</button>
                  </div>
                </div>
                {/* 피드 렌더링 */}
                <div className="space-y-16">
                  {assets.filter(a => category === 'ALL' || a.category === category).map((a) => (
                    <div key={a.id} className="p-12 rounded-[70px] bg-[#111] border-l-[24px] border-gray-800 shadow-xl text-left overflow-hidden">
                      <div className="flex justify-between items-start mb-10">
                        <h4 className="font-black text-white text-5xl tracking-tight leading-tight">{a.title}</h4>
                        <span className="text-gray-600 text-base font-mono font-black">{a.timestamp}</span>
                      </div>
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
        )}
      </div>

      {/* 영토 개척 모달 */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-6 text-center">
          <div className="bg-[#111] p-12 rounded-[50px] border border-[#daa520]/50 w-full max-w-2xl animate-in zoom-in-95">
            <SectionTitle title={t.createModalTitle} desc={t.createModalDesc} />
            <input type="text" value={createRoomTitle} onChange={(e) => setCreateRoomTitle(e.target.value)} placeholder="Territory Name" className="bg-black p-6 rounded-3xl border border-white/10 w-full text-xl focus:border-[#daa520] outline-none font-black text-center mb-8" />
            <div className="flex gap-4">
              <button onClick={() => setShowCreateModal(false)} className="flex-1 py-6 rounded-3xl font-black bg-white/5">{t.cancel}</button>
              <button onClick={handleCreateTerritory} className="flex-1 py-6 rounded-3xl font-black bg-[#daa520] text-black shadow-2xl">{t.confirmCreate}</button>
            </div>
          </div>
        </div>
      )}
      
      <div className="text-center py-40 opacity-10"><p className="text-sm font-mono tracking-[1.5em] uppercase text-white/50">Kedheon Empire | 88-Threads Engine Verified</p></div>
    </div>
  );
}
