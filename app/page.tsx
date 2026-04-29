'use client';
import React, { useState, useEffect } from 'react';

/** * [제국 중앙 설정 및 경제 데이터] 
 * 1 Pi = 100 BEOM 표준 비율 적용
 */
const PI_INVITE_CODE = 'ohsangjo'; 
const PI_APP_STORE_URL = 'https://apps.apple.com/app/pi-network/id1445472541';
const PI_PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.blockchainvault';

const PI_TO_BEOM_RATIO = 100; 

const COSTS_PI = {
  POST_CREATION: 0.1,    // 팬심/창작 피드 등록
  SUPPORT: 1.0,          // 찬양/후원
  CREATE_FAN_ROOM: 5.0,  // 팬방(아지트) 개설
  SELL_ITEM: 0.2,        // 마켓 상품 등록
  WRITE_REVIEW: 0.05     // 리뷰 작성
};

const COSTS_BEOM = {
  POST_CREATION: Math.floor(COSTS_PI.POST_CREATION * PI_TO_BEOM_RATIO),
  SUPPORT: Math.floor(COSTS_PI.SUPPORT * PI_TO_BEOM_RATIO),
  CREATE_FAN_ROOM: Math.floor(COSTS_PI.CREATE_FAN_ROOM * PI_TO_BEOM_RATIO),
  SELL_ITEM: Math.floor(COSTS_PI.SELL_ITEM * PI_TO_BEOM_RATIO),
  WRITE_REVIEW: Math.floor(COSTS_PI.WRITE_REVIEW * PI_TO_BEOM_RATIO)
};

// --- [인터페이스 정의] ---
interface Review { id: number; user: string; text: string; rating: number; timestamp: string; }
interface Asset { id: number; title: string; desc: string; category: string; type: 'CREATION' | 'VIDEO'; beomSupport: number; timestamp: string; url?: string; }
interface Good { id: number; name: string; price: number; img: string; seller: string; desc: string; reviews: Review[]; }

export default function KedheonPortal() {
  const [hasMounted, setHasMounted] = useState(false);
  const [lang, setLang] = useState<'KO' | 'EN'>('KO');
  const [tab, setTab] = useState<'ROOKIE' | 'PIONEER'>('PIONEER');
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  // 핵심 자산 (중요 수치 유지)
  const [beomToken, setBeomToken] = useState(7991.88); 
  
  const [qrType, setQrType] = useState<'PERSONAL' | 'BUSINESS'>('PERSONAL');
  const [bizName, setBizName] = useState('');
  const [isQrActive, setIsQrActive] = useState(false);
  
  const [category, setCategory] = useState('ALL');
  const [postType, setPostType] = useState<'CREATION' | 'VIDEO'>('VIDEO');
  const [assets, setAssets] = useState<Asset[]>([]); 
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newUrl, setNewUrl] = useState('');

  const [goods, setGoods] = useState<Good[]>([
    { 
      id: 1, name: "EMPIRE GOLD BADGE", price: 10 * PI_TO_BEOM_RATIO, img: "/beom-token.png", seller: "Imperial", desc: "제국 공인 고유 황금 뱃지", 
      reviews: [{ id: 1, user: "Pioneer_K", text: "실물이 훨씬 웅장합니다!", rating: 5, timestamp: "2026.04.28" }] 
    }
  ]);
  const [showSellModal, setShowSellModal] = useState(false);
  const [sellName, setSellName] = useState('');
  const [sellPrice, setSellPrice] = useState(0);
  const [sellDesc, setSellDesc] = useState('');

  const [showReviewModal, setShowReviewModal] = useState<{open: boolean, goodId: number | null}>({open: false, goodId: null});
  const [reviewText, setReviewText] = useState('');
  const [showFanRoomModal, setShowFanRoomModal] = useState(false);
  const [fanRoomName, setFanRoomName] = useState('');

  const cats = ['MUSIC', 'SPORTS', 'ANIME', 'DRAMA', 'MOVIE', 'ESPORTS', 'COMEDY', 'TRAVEL', 'FOOD', 'BEAUTY', 'FASHION', 'TECH'];

  // --- [데이터 영속성] ---
  useEffect(() => {
    setHasMounted(true);
    const saved = localStorage.getItem('kedheon_v62_master');
    if (saved) {
      try {
        const p = JSON.parse(saved);
        if (p.token !== undefined) setBeomToken(p.token);
        if (Array.isArray(p.assets)) setAssets(p.assets);
        if (Array.isArray(p.goods)) setGoods(p.goods);
      } catch (e) { console.error("Restore Error", e); }
    }
  }, []);

  useEffect(() => {
    if (hasMounted) {
      localStorage.setItem('kedheon_v62_master', JSON.stringify({ token: beomToken, assets, goods }));
    }
  }, [beomToken, assets, goods, hasMounted]);

  // --- [핸들러 로직] ---
  const postCreation = () => {
    if(!newTitle.trim()) return alert("제목을 입력하십시오.");
    if(beomToken < COSTS_BEOM.POST_CREATION) return alert(`자산 부족 (필요: ${COSTS_BEOM.POST_CREATION} BEOM)`);
    const newAsset: Asset = { id: Date.now(), title: newTitle, desc: newDesc, category, type: postType, beomSupport: 0, timestamp: new Date().toLocaleDateString(), url: newUrl };
    setAssets([newAsset, ...assets]);
    setBeomToken(p => p - COSTS_BEOM.POST_CREATION);
    setNewTitle(''); setNewDesc(''); setNewUrl('');
    alert("피드에 등록되었습니다.");
  };

  const createFanRoom = () => {
    if(!fanRoomName.trim()) return alert("명칭을 입력하십시오.");
    if(beomToken < COSTS_BEOM.CREATE_FAN_ROOM) return alert(`자산 부족 (필요: ${COSTS_BEOM.CREATE_FAN_ROOM} BEOM)`);
    setBeomToken(p => p - COSTS_BEOM.CREATE_FAN_ROOM);
    alert(`[${fanRoomName}] 팬방이 개설되었습니다. 제국 경제에 기여해주셔서 감사합니다.`);
    setShowFanRoomModal(false); setFanRoomName('');
  };

  const postGood = () => {
    if(!sellName.trim() || sellPrice <= 0) return alert("상품 정보를 정확히 입력하십시오.");
    if(beomToken < COSTS_BEOM.SELL_ITEM) return alert(`등록 자산 부족 (필요: ${COSTS_BEOM.SELL_ITEM} BEOM)`);
    const newGood: Good = { id: Date.now(), name: sellName, price: sellPrice, img: "/kedheon-character.png", seller: "Citizen", desc: sellDesc, reviews: [] };
    setGoods([newGood, ...goods]);
    setBeomToken(p => p - COSTS_BEOM.SELL_ITEM);
    setSellName(''); setSellPrice(0); setSellDesc(''); setShowSellModal(false);
    alert("시장에 물품이 등록되었습니다.");
  };

  const postReview = () => {
    if(!reviewText.trim()) return alert("후기를 입력하십시오.");
    if(beomToken < COSTS_BEOM.WRITE_REVIEW) return alert(`자산 부족 (필요: ${COSTS_BEOM.WRITE_REVIEW} BEOM)`);
    const newReview: Review = { id: Date.now(), user: "Pioneer", text: reviewText, rating: 5, timestamp: new Date().toLocaleDateString() };
    setGoods(goods.map(g => g.id === showReviewModal.goodId ? { ...g, reviews: [newReview, ...g.reviews] } : g));
    setBeomToken(p => p - COSTS_BEOM.WRITE_REVIEW);
    setReviewText(''); setShowReviewModal({ open: false, goodId: null });
    alert("후기가 기록되었습니다.");
  };

  const supportPost = (id: number) => {
    if (beomToken < COSTS_BEOM.SUPPORT) return alert("자산이 부족합니다.");
    setBeomToken(p => p - COSTS_BEOM.SUPPORT);
    setAssets(assets.map(a => a.id === id ? { ...a, beomSupport: a.beomSupport + COSTS_BEOM.SUPPORT } : a));
  };

  const activateQr = () => {
    if (beomToken < 50) return alert("자산이 부족합니다.");
    setBeomToken(p => p - 50);
    setIsQrActive(true);
  };

  // --- [UI 컴포넌트] ---
  const SectionHeader = ({ num, title, desc, topText }: { num: string; title: string; desc: string, topText?: string }) => (
    <div className="w-full border-t-2 border-white/20 pt-10 mb-6 text-left font-black">
      {topText && <p className="text-white text-xl md:text-4xl uppercase tracking-tighter mb-2 font-black drop-shadow-lg">{topText}</p>}
      <h3 className="text-[#daa520] text-xl md:text-3xl uppercase border-l-4 border-[#daa520] pl-3 leading-none italic tracking-tighter mb-2">
        {num}. 🌐 {title}
      </h3>
      <p className="text-white/60 text-[11px] md:text-base pl-4 italic font-bold tracking-tight break-keep leading-relaxed">{desc}</p>
    </div>
  );

  if (!hasMounted) return null;

  return (
    <div className="flex flex-col items-center bg-black min-h-screen text-white font-sans w-full pb-40 overflow-x-hidden text-center font-black">
      
      {/* GNB */}
      <div className="w-full max-w-4xl flex justify-between items-center p-3 md:p-5 sticky top-0 bg-black/95 backdrop-blur-md z-[150] border-b-2 border-[#daa520]">
        <div className="flex items-center gap-2">
          <button onClick={() => setLang(l => l === 'KO' ? 'EN' : 'KO')} className="text-[#daa520] border border-[#daa520] px-3 py-1 rounded-full text-[10px] font-bold uppercase">{lang === 'KO' ? "EN" : "KO"}</button>
          <span className="text-white/30 text-[10px] font-mono tracking-tighter px-2 border-l border-white/10 italic">v62.0</span>
        </div>
        <div className="flex gap-1.5">
          <button onClick={() => setTab('ROOKIE')} className={`px-4 py-1.5 rounded-md text-[10px] border transition-all ${tab === 'ROOKIE' ? 'bg-[#daa520] text-black border-[#daa520]' : 'bg-black text-white border-white/20'}`}>ROOKIE</button>
          <button onClick={() => setTab('PIONEER')} className={`px-4 py-1.5 rounded-md text-[10px] border transition-all ${tab === 'PIONEER' ? 'bg-[#daa520] text-black border-[#daa520]' : 'bg-black text-white border-white/20'}`}>PIONEER</button>
        </div>
      </div>

      <div className="w-full max-w-4xl px-4">
        {tab === 'ROOKIE' ? (
          <div className="flex flex-col items-center py-12 animate-in fade-in duration-500">
            <img src="/kedheon-character.png" className="w-24 h-24 md:w-44 md:h-44 rounded-3xl mb-6 border-4 border-[#daa520] shadow-[0_0_50px_rgba(218,165,32,0.3)]" alt="K" />
            <h1 className="text-4xl md:text-6xl text-[#daa520] italic uppercase mb-2 tracking-tighter">Kedheon Empire</h1>
            <p className="text-white text-sm md:text-xl font-black mb-10 uppercase tracking-widest border-b border-[#daa520]/30 pb-2">웹3 초대합니다. 파이코인 가입.</p>
            
            {!showOnboarding ? (
              <button onClick={() => setShowOnboarding(true)} className="bg-white text-black px-12 py-5 rounded-full text-lg border-4 border-[#daa520] active:scale-95 mb-12 uppercase font-black shadow-xl">제국 시민권 획득 절차 안내</button>
            ) : (
              <div className="w-full bg-[#0a0a0a] p-6 md:p-12 rounded-[40px] border-2 border-[#daa520] space-y-10 mb-16 text-left animate-in slide-in-from-top-10 shadow-2xl">
                <h2 className="text-[#daa520] text-2xl md:text-5xl uppercase italic font-black text-center mb-8">Onboarding Guide</h2>
                <div className="grid gap-8 text-base md:text-xl font-bold text-white/90">
                  <div className="border-l-4 border-white/20 pl-5">
                    <p className="text-[#daa520] text-xs uppercase mb-1 font-black">Step 01. Download App</p>
                    <p>스토어에서 [ <span className="text-[#daa520] underline">Pi Network</span> ] 앱을 설치하십시오.</p>
                  </div>
                  <div className="border-l-4 border-[#daa520] pl-5 bg-[#daa520]/10 py-4 rounded-r-2xl">
                    <p className="text-[#daa520] text-[12px] uppercase mb-1 font-black underline">Step 04. Invitation Code (CRITICAL)</p>
                    <p>초대 코드 입력란에 [ <span className="text-[#daa520] text-3xl underline decoration-double">{PI_INVITE_CODE}</span> ]를 반드시 기입하십시오.</p>
                  </div>
                  <div className="border-l-4 border-red-600 pl-5 bg-red-600/10 py-5 rounded-r-2xl border-dashed">
                    <p className="text-red-500 text-[12px] uppercase mb-2 font-black italic">Step 05. Security: Passphrase (WARNING)</p>
                    <p className="text-white font-black italic underline leading-tight text-lg md:text-2xl">비밀구절 24단어는 제국의 금고 열쇠입니다. 노출 시 모든 자산을 잃게 됩니다.</p>
                  </div>
                </div>
                <div className="flex gap-4 pt-6">
                  <button onClick={() => window.open(PI_APP_STORE_URL)} className="flex-1 bg-white text-black py-5 rounded-2xl text-xs md:text-sm font-black uppercase shadow-lg border-2 border-[#daa520]">App Store</button>
                  <button onClick={() => window.open(PI_PLAY_STORE_URL)} className="flex-1 bg-white text-black py-5 rounded-2xl text-xs md:text-sm font-black uppercase shadow-lg border-2 border-[#daa520]">Play Store</button>
                </div>
              </div>
            )}
            <SectionHeader num="00" title="LIVE FEED" desc="시민권을 획득한 파이오니어들의 창의적 활동을 관찰하십시오." />
          </div>
        ) : (
          <div className="flex flex-col gap-8 py-8 animate-in slide-in-from-bottom-5">
            
            {/* 자산 대시보드 - 소수점 시인성 개선 */}
            <div className="bg-[#111] p-8 md:p-12 rounded-[50px] border-4 border-[#daa520] shadow-[0_0_60px_rgba(218,165,32,0.2)] flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden">
                <div className="text-center md:text-left flex-1 font-black z-10">
                  <h3 className="text-white/30 text-[11px] md:text-[14px] uppercase tracking-[0.4em] mb-2">Imperial Assets</h3>
                  <p className="text-[#daa520] text-5xl md:text-8xl tracking-tighter leading-none font-black">
                    {Math.floor(beomToken).toLocaleString()}
                    <span className="text-xl md:text-4xl opacity-60">.{beomToken.toFixed(2).split('.')[1]}</span> 
                    <span className="text-2xl md:text-4xl ml-2">BEOM</span>
                  </p>
                  <div className="mt-5 bg-black/70 backdrop-blur-xl px-6 py-2.5 rounded-xl border border-white/20 inline-block text-[14px] md:text-xl font-mono text-white/70 italic font-black">≈ {(beomToken / PI_TO_BEOM_RATIO).toFixed(4)} Pi</div>
                </div>
                <div className="flex items-center gap-6 z-10">
                  <img src="/kedheon-character.png" className="w-20 h-20 md:w-32 md:h-32 rounded-[30px] border-2 border-white/20 shadow-2xl" alt="K" />
                  <img src="/beom-token.png" className="w-18 h-18 md:w-32 md:h-32 object-contain animate-pulse shadow-[0_0_40px_rgba(218,165,32,0.4)]" alt="B" />
                </div>
            </div>

            {/* 01. 환전 */}
            <SectionHeader num="01" title="ACQUIRE BEOM" topText="누리고 참여하고 보상받으세요" desc="파이 네트워크의 가치를 제국의 범(BEOM) 토큰으로 전환하십시오." />
            <div className="bg-[#111] p-8 rounded-[40px] border-2 border-white/10 shadow-2xl grid md:grid-cols-2 gap-8 items-center">
              <div className="text-left font-black"><p className="text-white text-xl md:text-3xl uppercase italic leading-tight mb-1">PI TO BEOM EXCHANGE</p><p className="text-[#daa520] text-sm md:text-lg italic font-black">1 Pi = {PI_TO_BEOM_RATIO} BEOM</p></div>
              <button onClick={() => setBeomToken(p => p + PI_TO_BEOM_RATIO)} className="w-full bg-[#daa520] text-black py-5 rounded-2xl text-lg md:text-2xl border-4 border-white active:scale-95 uppercase font-black shadow-xl font-sans">EXCHANGE 1 PI</button>
            </div>

            {/* 02. 보안 인증 */}
            <SectionHeader num="02" title="SECURE AUTH" desc="고유한 디지털 지문을 통해 신분을 증명하십시오." />
            <div className="bg-[#111] p-6 rounded-[40px] border-2 border-white/10 flex flex-col items-center gap-8 shadow-xl">
              <div className="flex gap-3 w-full max-w-sm bg-black p-2 rounded-2xl border border-white/10">
                <button onClick={() => { setQrType('PERSONAL'); setIsQrActive(false); }} className={`flex-1 py-4 rounded-xl text-xs md:text-base transition-all font-black ${qrType === 'PERSONAL' ? 'bg-[#daa520] text-black border-2 border-white' : 'bg-black text-white/20'}`}>PERSONAL</button>
                <button onClick={() => { setQrType('BUSINESS'); setIsQrActive(false); }} className={`flex-1 py-4 rounded-xl text-xs md:text-base transition-all font-black ${qrType === 'BUSINESS' ? 'bg-[#daa520] text-black border-2 border-white' : 'bg-black text-white/20'}`}>BUSINESS</button>
              </div>
              <div className={`p-5 bg-black border-2 rounded-[40px] transition-all flex items-center justify-center min-w-[240px] min-h-[240px] ${isQrActive ? 'border-[#daa520] shadow-[0_0_50px_rgba(218,165,32,0.3)]' : 'opacity-10 border-white'}`}>
                {isQrActive ? <img src={qrType === 'PERSONAL' ? "/qr-personal.png" : "/qr-business.png"} className="w-56 h-56 md:w-72 md:h-72 rounded-xl object-contain animate-in zoom-in-50" alt="QR" />
                : <div className="w-48 h-48 flex items-center justify-center text-white/5 text-2xl italic uppercase tracking-[0.4em] font-black">Locked</div>}
              </div>
              <button onClick={activateQr} className="bg-[#daa520] text-black px-12 py-5 rounded-2xl text-lg md:text-xl border-4 border-white active:scale-95 uppercase font-black shadow-lg font-sans">인증 활성화 (50 BEOM)</button>
            </div>

            {/* 03. 팬심 & 창작 (영상 시청 활성화) */}
            <SectionHeader num="03" title="FAN & CREATIVE HIDEOUT" desc="영상과 창작물을 공유하여 팬심을 증명하고, 독자적인 팬방을 개설하십시오." />
            <div className="w-full bg-[#111] p-6 md:p-8 rounded-[40px] border-2 border-[#daa520]/50 space-y-6 mb-6 shadow-2xl text-left font-sans font-black">
              <div className="flex gap-3 p-1.5 bg-black rounded-2xl border border-white/10">
                <button onClick={() => setPostType('VIDEO')} className={`flex-1 py-4 rounded-xl text-xs md:text-base font-black transition-all ${postType === 'VIDEO' ? 'bg-[#daa520] text-black border-2 border-white shadow-lg' : 'bg-black text-white/30'}`}>영상/소개글</button>
                <button onClick={() => setPostType('CREATION')} className={`flex-1 py-4 rounded-xl text-xs md:text-base font-black transition-all ${postType === 'CREATION' ? 'bg-[#daa520] text-black border-2 border-white shadow-lg' : 'bg-black text-white/30'}`}>개인 창작물</button>
              </div>
              <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="제목 및 핵심 카테고리" className="bg-[#050505] border-2 border-white/10 p-5 rounded-xl w-full text-lg text-white font-black outline-none focus:border-[#daa520] transition-all" />
              <input type="text" value={newUrl} onChange={(e) => setNewUrl(e.target.value)} placeholder="영상 링크 혹은 이미지 URL (선택사항)" className="bg-[#050505] border-2 border-white/10 p-5 rounded-xl w-full text-sm text-[#daa520] font-black outline-none focus:border-[#daa520]" />
              <textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="당신의 팬심 혹은 창작 의도를 기록하십시오" className="bg-[#050505] border-2 border-white/10 p-5 rounded-xl w-full text-sm text-white/80 h-36 resize-none outline-none focus:border-[#daa520] font-black" />
              
              <div className="flex gap-4 pt-4">
                <button onClick={postCreation} className="flex-[2] py-5 rounded-2xl bg-[#daa520] text-black text-lg border-2 border-white uppercase shadow-xl font-black active:scale-95 font-sans">피드 등록 ({COSTS_BEOM.POST_CREATION} BEOM)</button>
                <button onClick={() => setShowFanRoomModal(true)} className="flex-1 py-5 rounded-2xl bg-white text-black text-[11px] md:text-sm border-2 border-[#daa520] uppercase font-black active:scale-95 leading-tight font-sans">🚩 팬방 개설<br/>({COSTS_BEOM.CREATE_FAN_ROOM} BEOM)</button>
              </div>
            </div>
            
            {/* 3번 피드 리스트 (영상 시청 버튼 추가) */}
            <div className="space-y-8">
              {assets.filter(a => category === 'ALL' || a.category === category).map(a => (
                <div key={a.id} className="bg-[#111] rounded-[45px] border-2 p-8 md:p-10 shadow-2xl border-white/10 relative text-left hover:border-[#daa520] transition-all group font-black">
                  <div className="flex justify-between items-start mb-6">
                    <div><span className="text-[10px] md:text-sm bg-white text-black px-4 py-1 rounded-full uppercase mr-2 font-black">{a.category}</span><h4 className="text-3xl md:text-4xl text-[#daa520] tracking-tighter uppercase mt-3">{a.title}</h4></div>
                    <span className="text-white/20 text-[12px] md:text-base font-mono">{a.timestamp}</span>
                  </div>

                  {/* 영상 시인성 강화 UI */}
                  {a.url && (
                    <div className="mb-6 p-4 bg-black rounded-2xl border border-[#daa520]/30 flex justify-between items-center">
                      <div className="truncate pr-4 text-[#daa520] text-xs font-mono opacity-60 italic">{a.url}</div>
                      <button onClick={() => window.open(a.url, '_blank')} className="bg-[#daa520] text-black px-5 py-2 rounded-xl text-[10px] md:text-xs font-black uppercase whitespace-nowrap active:scale-95 font-sans">WATCH VIDEO 📺</button>
                    </div>
                  )}

                  <p className="text-white/90 text-lg md:text-2xl italic leading-relaxed mb-8 font-sans">"{a.desc}"</p>
                  <div className="pt-8 border-t border-white/5 flex justify-between items-center">
                    <button onClick={() => supportPost(a.id)} className="bg-[#daa520] text-black px-10 py-4 rounded-2xl text-sm md:text-lg border-2 border-white active:scale-95 font-black uppercase shadow-lg font-sans">👑 Praise ({COSTS_BEOM.SUPPORT})</button>
                    <p className="text-[#daa520] text-3xl md:text-6xl tracking-tighter font-black">{a.beomSupport.toLocaleString()} <span className="text-sm md:text-xl">BEOM</span></p>
                  </div>
                </div>
              ))}
            </div>

            {/* 04. 제국 시장 */}
            <SectionHeader num="04" title="MERCHANT SQUARE & REVIEWS" desc="제국의 희귀 굿즈를 거래하십시오." />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 text-left font-black">
              {goods.map(g => (
                <div key={g.id} className="bg-[#111] rounded-[45px] border-2 border-white/10 p-8 shadow-2xl flex flex-col gap-6 relative">
                  <div className="absolute top-6 right-6 bg-[#daa520] text-black px-4 py-1.5 rounded-full text-[10px] border-2 border-white font-black italic">SELLER: {g.seller}</div>
                  <img src={g.img} className="w-full h-48 md:h-72 object-contain bg-black rounded-[40px] border border-white/5 shadow-inner" alt="G" />
                  <div><h4 className="text-white text-2xl md:text-3xl uppercase tracking-tighter font-black">{g.name}</h4><p className="text-[#daa520] text-3xl md:text-4xl mt-1 font-black">{g.price.toLocaleString()} BEOM</p></div>
                  <div className="mt-4 pt-6 border-t border-white/10 space-y-4">
                    <div className="flex justify-between items-center font-sans"><p className="text-[#daa520] text-[12px] uppercase font-bold tracking-widest">Reviews</p><button onClick={() => setShowReviewModal({ open: true, goodId: g.id })} className="text-white/40 text-[10px] underline font-bold">후기 작성</button></div>
                    {g.reviews.map(r => (
                      <div key={r.id} className="bg-black/50 p-5 rounded-2xl border border-white/5 shadow-inner">
                        <p className="text-white/80 text-sm md:text-lg font-black italic font-sans">"{r.text}"</p>
                        <p className="text-[#daa520] text-[10px] md:text-sm mt-2 italic font-black font-sans">- {r.user} ({r.timestamp})</p>
                      </div>
                    ))}
                  </div>
                  <button className="w-full py-5 rounded-3xl bg-white text-black text-lg md:text-xl border-4 border-[#daa520] font-black uppercase active:scale-95 shadow-xl font-sans">BUY NOW (COMING SOON)</button>
                </div>
              ))}
            </div>
            <button onClick={() => setShowSellModal(true)} className="w-full py-7 rounded-[40px] bg-[#daa520] text-black font-black text-xl md:text-3xl border-4 border-white uppercase shadow-[0_0_60px_rgba(218,165,32,0.4)] active:scale-95 italic font-sans">➕ 제국 시장에 상품 등록 ({COSTS_BEOM.SELL_ITEM} BEOM)</button>
          </div>
        )}
      </div>

      {/* 앱 스위처 */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-black/95 border-2 border-[#daa520] p-2 rounded-3xl flex gap-4 z-[200] shadow-[0_0_60px_rgba(218,165,32,0.5)] backdrop-blur-2xl font-black font-sans">
        {['KEDHEON', 'CIVIL', 'NEXUS', 'VENDOR'].map(app => (
          <button key={app} className={`px-5 py-3 rounded-2xl text-[11px] md:text-sm transition-all ${app === 'KEDHEON' ? 'bg-[#daa520] text-black shadow-lg scale-110' : 'text-white/40 hover:text-white'}`}>{app}</button>
        ))}
      </div>

      {/* [모달: 팬방 개설] */}
      {showFanRoomModal && (
        <div className="fixed inset-0 bg-black/98 backdrop-blur-3xl z-[300] flex items-center justify-center p-4 animate-in zoom-in-95 font-black font-sans">
          <div className="bg-[#111] p-10 rounded-[50px] border-4 border-[#daa520] w-full max-w-md text-center shadow-2xl">
            <h3 className="text-[#daa520] text-3xl mb-8 italic uppercase font-black">New Fan Hideout</h3>
            <input type="text" value={fanRoomName} onChange={(e) => setFanRoomName(e.target.value)} placeholder="아지트 명칭 입력" className="bg-black border-2 border-white p-5 rounded-2xl w-full text-2xl text-center text-white mb-8 outline-none font-black focus:border-[#daa520]" />
            <div className="flex gap-4"><button onClick={() => setShowFanRoomModal(false)} className="flex-1 py-4 rounded-xl bg-white/10 text-white uppercase text-sm font-black">Cancel</button><button onClick={createFanRoom} className="flex-1 py-4 rounded-xl bg-[#daa520] text-black border-2 border-white uppercase shadow-lg text-sm font-black">Create ({COSTS_BEOM.CREATE_FAN_ROOM} BEOM)</button></div>
          </div>
        </div>
      )}

      {/* [모달: 리뷰 작성] */}
      {showReviewModal.open && (
        <div className="fixed inset-0 bg-black/98 backdrop-blur-3xl z-[300] flex items-center justify-center p-4 animate-in zoom-in-95 font-black font-sans">
          <div className="bg-[#111] p-10 rounded-[50px] border-4 border-white w-full max-w-md text-center shadow-2xl">
            <h3 className="text-white text-2xl mb-8 italic uppercase tracking-widest">Purchase Review</h3>
            <textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} placeholder="구매 경험을 정직하게 기록하십시오" className="bg-black border-2 border-white p-5 rounded-2xl w-full text-lg text-white mb-8 h-44 outline-none font-black shadow-inner focus:border-[#daa520]" />
            <div className="flex gap-4"><button onClick={() => setShowReviewModal({ open: false, goodId: null })} className="flex-1 py-4 rounded-xl bg-white/10 text-white uppercase text-sm font-black">Cancel</button><button onClick={postReview} className="flex-1 py-4 rounded-xl bg-[#daa520] text-black border-2 border-white uppercase shadow-lg text-sm font-black">Post</button></div>
          </div>
        </div>
      )}

      {/* [모달: 상품 등록] */}
      {showSellModal && (
        <div className="fixed inset-0 bg-black/98 backdrop-blur-3xl z-[300] flex items-center justify-center p-4 animate-in zoom-in-95 font-black font-sans">
          <div className="bg-[#111] p-10 rounded-[50px] border-4 border-[#daa520] w-full max-w-md text-center shadow-2xl">
            <h3 className="text-[#daa520] text-2xl mb-8 italic uppercase font-black">Market Registration</h3>
            <div className="space-y-4">
              <input type="text" value={sellName} onChange={(e) => setSellName(e.target.value)} placeholder="상품명" className="bg-black border-2 border-white p-4 rounded-2xl w-full text-white text-lg outline-none" />
              <input type="number" value={sellPrice} onChange={(e) => setSellPrice(Number(e.target.value))} placeholder="가격 (BEOM)" className="bg-black border-2 border-white p-4 rounded-2xl w-full text-[#daa520] text-lg outline-none font-black" />
              <textarea value={sellDesc} onChange={(e) => setSellDesc(e.target.value)} placeholder="상품 상세 설명" className="bg-black border-2 border-white p-4 rounded-2xl w-full text-white/60 text-sm h-28 outline-none" />
            </div>
            <div className="flex gap-4 mt-8">
              <button onClick={() => setShowSellModal(false)} className="flex-1 py-4 rounded-xl bg-white/10 text-white uppercase text-sm">Cancel</button>
              <button onClick={postGood} className="flex-1 py-4 rounded-xl bg-[#daa520] text-black border-2 border-white uppercase shadow-lg text-sm">Post Sale</button>
            </div>
          </div>
        </div>
      )}

      {/* 푸터 */}
      <div className="mt-36 opacity-20 text-center w-full pb-16 font-mono text-white text-[10px] md:text-[14px] tracking-[1.2em] uppercase font-black">KEDHEON EMPIRE | V62.0 FINAL MASTER | ohsangjo</div>
    </div>
  );
}
