'use client';
import React, { useState, useEffect } from 'react';

// --- [1. 제국 중앙 설정 및 경제 데이터] ---
const PI_INVITE_CODE = 'ohsangjo'; 
const PI_APP_STORE_URL = 'https://apps.apple.com/app/pi-network/id1445472541';
const PI_PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.blockchainvault';

/** * [경제 시스템 지표] 1:100 표준 비율 */
const PI_TO_BEOM_RATIO = 100; 

/** [서비스 원가 가이드라인 (Pi 기준)] */
const COSTS_PI = {
  POST_CREATION: 0.1,     // 팬심/창작 피드 등록 원가
  SUPPORT: 1.0,           // 찬양/후원 원가
  CREATE_FAN_ROOM: 5.0,   // 팬방(아지트) 개설 원가
  SELL_ITEM: 0.2,         // 마켓 상품 등록 원가
  WRITE_REVIEW: 0.05      // 리뷰 작성 원가
};

// [자동 계산된 BEOM 소비량]
const COSTS_BEOM = {
  POST_CREATION: Math.floor(COSTS_PI.POST_CREATION * PI_TO_BEOM_RATIO),
  SUPPORT: Math.floor(COSTS_PI.SUPPORT * PI_TO_BEOM_RATIO),
  CREATE_FAN_ROOM: Math.floor(COSTS_PI.CREATE_FAN_ROOM * PI_TO_BEOM_RATIO),
  SELL_ITEM: Math.floor(COSTS_PI.SELL_ITEM * PI_TO_BEOM_RATIO),
  WRITE_REVIEW: Math.floor(COSTS_PI.WRITE_REVIEW * PI_TO_BEOM_RATIO)
};

// --- [2. 인터페이스 정의] ---
interface Review { id: number; user: string; text: string; rating: number; timestamp: string; }
interface Asset { id: number; title: string; desc: string; category: string; type: 'CREATION' | 'VIDEO'; beomSupport: number; timestamp: string; url?: string; }
interface Good { id: number; name: string; price: number; img: string; seller: string; desc: string; reviews: Review[]; }

export default function KedheonPortal() {
  // --- [3. 상태 관리 (State Management)] ---
  const [hasMounted, setHasMounted] = useState(false);
  const [lang, setLang] = useState<'KO' | 'EN'>('KO');
  const [tab, setTab] = useState<'ROOKIE' | 'PIONEER'>('PIONEER');
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  const [beomToken, setBeomToken] = useState(7991.88); 
  
  // 보안 인증 상태
  const [qrType, setQrType] = useState<'PERSONAL' | 'BUSINESS'>('PERSONAL');
  const [bizName, setBizName] = useState('');
  const [isQrActive, setIsQrActive] = useState(false);
  
  // 팬심/창작 상태
  const [category, setCategory] = useState('ALL');
  const [postType, setPostType] = useState<'CREATION' | 'VIDEO'>('VIDEO');
  const [assets, setAssets] = useState<Asset[]>([]); 
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newUrl, setNewUrl] = useState('');

  // 마켓/상품 상태
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

  // 후기 및 팬방 모달
  const [showReviewModal, setShowReviewModal] = useState<{open: boolean, goodId: number | null}>({open: false, goodId: null});
  const [reviewText, setReviewText] = useState('');
  const [showFanRoomModal, setShowFanRoomModal] = useState(false);
  const [fanRoomName, setFanRoomName] = useState('');

  const cats = ['MUSIC', 'SPORTS', 'ANIME', 'DRAMA', 'MOVIE', 'ESPORTS', 'COMEDY', 'TRAVEL', 'FOOD', 'BEAUTY', 'FASHION', 'TECH'];

  // --- [4. 데이터 영속성 (Persistence)] ---
  useEffect(() => {
    setHasMounted(true);
    const saved = localStorage.getItem('kedheon_v61_master');
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
      localStorage.setItem('kedheon_v61_master', JSON.stringify({ token: beomToken, assets, goods }));
    }
  }, [beomToken, assets, goods, hasMounted]);

  // --- [5. 비즈니스 로직 핸들러] ---
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
    alert(`[${fanRoomName}] 팬방이 개설되었습니다.`);
    setShowFanRoomModal(false); setFanRoomName('');
  };

  const postGood = () => {
    if(!sellName.trim() || sellPrice <= 0) return alert("내용을 정확히 입력하십시오.");
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
    if (beomToken < COSTS_BEOM.QR_AUTH) return alert("자산이 부족합니다.");
    setBeomToken(p => p - COSTS_BEOM.QR_AUTH);
    setIsQrActive(true);
  };

  // --- [6. UI 렌더링 컴포넌트] ---
  const SectionHeader = ({ num, title, desc }: { num: string; title: string; desc: string }) => (
    <div className="w-full border-t-2 border-white/20 pt-8 mb-6 text-left font-black">
      <h3 className="text-[#daa520] text-xl md:text-3xl uppercase border-l-4 border-[#daa520] pl-3 leading-none italic tracking-tighter mb-2 font-sans">
        {num}. 🌐 {title}
      </h3>
      <p className="text-white/60 text-[11px] md:text-base pl-4 italic font-bold tracking-tight break-keep font-sans">{desc}</p>
    </div>
  );

  if (!hasMounted) return null;

  return (
    <div className="flex flex-col items-center bg-black min-h-screen text-white font-sans w-full pb-40 overflow-x-hidden text-center font-black">
      
      {/* GNB (상단 네비게이션) */}
      <div className="w-full max-w-4xl flex justify-between items-center p-3 md:p-5 sticky top-0 bg-black/95 backdrop-blur-md z-[150] border-b-2 border-[#daa520]">
        <div className="flex items-center gap-2">
          <button onClick={() => setLang(l => l === 'KO' ? 'EN' : 'KO')} className="text-[#daa520] border border-[#daa520] px-3 py-1 rounded-full text-[10px] font-bold uppercase">{lang === 'KO' ? "EN" : "KO"}</button>
          <span className="text-white/30 text-[10px] font-mono tracking-tighter px-2 border-l border-white/10 italic">v61.3</span>
        </div>
        <div className="flex gap-1.5 font-sans">
          <button onClick={() => setTab('ROOKIE')} className={`px-3 py-1 rounded-md text-[10px] border transition-all ${tab === 'ROOKIE' ? 'bg-[#daa520] text-black border-[#daa520]' : 'bg-black text-white border-white/20'}`}>ROOKIE</button>
          <button onClick={() => setTab('PIONEER')} className={`px-3 py-1 rounded-md text-[10px] border transition-all ${tab === 'PIONEER' ? 'bg-[#daa520] text-black border-[#daa520]' : 'bg-black text-white border-white/20'}`}>PIONEER</button>
        </div>
      </div>

      <div className="w-full max-w-4xl px-4">
        {tab === 'ROOKIE' ? (
          <div className="flex flex-col items-center py-10 animate-in fade-in duration-500">
            <img src="/kedheon-character.png" className="w-24 h-24 md:w-40 md:h-40 rounded-2xl mb-6 border-2 border-[#daa520] shadow-2xl" alt="K" />
            <h1 className="text-3xl md:text-5xl text-[#daa520] italic uppercase mb-2 tracking-tighter font-sans">Kedheon Empire</h1>
            {!showOnboarding ? <button onClick={() => setShowOnboarding(true)} className="bg-white text-black px-8 py-3 rounded-full text-base border-2 border-[#daa520] active:scale-95 mb-12 uppercase font-black">시민권 획득 가이드</button>
            : (
              <div className="w-full bg-[#111] p-6 rounded-[30px] border-2 border-white/20 space-y-6 mb-12 font-sans text-left">
                <h2 className="text-[#daa520] text-xl md:text-3xl uppercase italic font-black text-center">Onboarding</h2>
                <div className="space-y-3 text-sm md:text-base font-bold text-white/80">
                  <p>1. Pi 앱 설치 후 추천인 [ <span className="text-[#daa520] underline font-sans">{PI_INVITE_CODE}</span> ] 입력</p>
                  <p>2. Pi를 BEOM 토큰으로 환전하여 제국 입장</p>
                </div>
                <div className="flex gap-3"><button onClick={() => window.open(PI_APP_STORE_URL)} className="flex-1 bg-white text-black py-3 rounded-lg text-xs font-black uppercase">App Store</button><button onClick={() => window.open(PI_PLAY_STORE_URL)} className="flex-1 bg-white text-black py-3 rounded-lg text-xs font-black uppercase">Play Store</button></div>
              </div>
            )}
            <SectionHeader num="00" title="LIVE FEED" desc="제국 시민들의 실시간 활동과 팬덤의 열기를 관찰하십시오." />
            <div className="w-full opacity-30 italic py-10">시민권 획득 후 전체 기능이 활성화됩니다.</div>
          </div>
        ) : (
          <div className="flex flex-col gap-8 py-8 animate-in slide-in-from-bottom-5">
            
            {/* 자산 대시보드 */}
            <div className="bg-[#111] p-6 rounded-[30px] border-2 border-[#daa520] shadow-xl flex flex-col md:flex-row justify-between items-center gap-6">
               <div className="text-center md:text-left flex-1 font-black">
                  <h3 className="text-white/40 text-[10px] uppercase tracking-widest mb-1 font-sans">Imperial Assets</h3>
                  <p className="text-[#daa520] text-4xl md:text-7xl tracking-tighter leading-none font-black font-sans">{beomToken.toLocaleString()} BEOM</p>
                  <div className="mt-2 bg-black px-4 py-1 rounded-lg border border-white/20 inline-block text-[10px] font-mono text-white/60 italic">≈ {(beomToken / PI_TO_BEOM_RATIO).toFixed(4)} Pi</div>
               </div>
               <img src="/kedheon-character.png" className="w-16 h-16 md:w-24 md:h-24 rounded-xl border border-white/20 shadow-lg" alt="Char" />
            </div>

            {/* 01. 환전 */}
            <SectionHeader num="01" title="ACQUIRE BEOM" desc="파이 네트워크의 가치를 제국의 자산으로 전환하여, 경제적 주권을 확립하십시오." />
            <div className="bg-[#111] p-6 rounded-[30px] border-2 border-white/10 shadow-lg grid md:grid-cols-2 gap-6 items-center">
              <div className="text-left font-black"><p className="text-white text-base md:text-2xl uppercase italic">PI TO BEOM</p><p className="text-[#daa520] text-[10px] italic">1 Pi = {PI_TO_BEOM_RATIO} BEOM</p></div>
              <button onClick={() => setBeomToken(p => p + PI_TO_BEOM_RATIO)} className="w-full bg-[#daa520] text-black py-4 rounded-xl text-sm md:text-lg border-2 border-white active:scale-95 uppercase font-black">EXCHANGE 1 PI</button>
            </div>

            {/* 02. 보안 인증 (기업명 박스 탑재) */}
            <SectionHeader num="02" title="SECURE AUTH" desc="고유한 디지털 지문을 통해 신분을 증명하고 보안 익명 결제를 활성화하십시오." />
            <div className="bg-[#111] p-5 rounded-[30px] border-2 border-white/10 flex flex-col items-center gap-6 shadow-xl font-black">
              <div className="flex gap-1.5 w-full max-w-xs bg-black p-1.5 rounded-xl border-2 border-[#daa520]">
                <button onClick={() => { setQrType('PERSONAL'); setIsQrActive(false); }} className={`flex-1 py-2 rounded-lg text-[10px] transition-all ${qrType === 'PERSONAL' ? 'bg-[#daa520] text-black' : 'text-white/20'}`}>PERSONAL</button>
                <button onClick={() => { setQrType('BUSINESS'); setIsQrActive(false); }} className={`flex-1 py-2 rounded-lg text-[10px] transition-all ${qrType === 'BUSINESS' ? 'bg-[#daa520] text-black' : 'text-white/20'}`}>BUSINESS</button>
              </div>
              
              {qrType === 'BUSINESS' && (
                <input type="text" value={bizName} onChange={(e) => setBizName(e.target.value)} placeholder="ENTER BUSINESS NAME" className="w-full max-w-xs bg-black border-2 border-[#daa520] p-3 rounded-lg text-center text-[#daa520] text-sm outline-none shadow-inner animate-in fade-in" />
              )}

              <div className={`p-4 bg-black border-2 rounded-[30px] transition-all flex items-center justify-center min-w-[200px] min-h-[200px] ${isQrActive ? 'border-[#daa520] shadow-[0_0_40px_rgba(218,165,32,0.3)]' : 'opacity-10 border-white'}`}>
                {isQrActive ? <img src={qrType === 'PERSONAL' ? "/qr-personal.png" : "/qr-business.png"} className="w-48 h-48 md:w-64 md:h-64 rounded-xl object-contain" alt="QR" />
                : <div className="w-40 h-40 flex items-center justify-center text-white/5 text-xl italic uppercase tracking-widest">Locked</div>}
              </div>
              <button onClick={activateQr} className="bg-[#daa520] text-black px-8 py-3 rounded-xl text-sm md:text-lg border-2 border-white active:scale-95 uppercase font-black">인증 활성화 ({COSTS_BEOM.QR_AUTH} BEOM)</button>
            </div>

            {/* 03. 팬심 & 창작 아지트 */}
            <SectionHeader num="03" title="FAN & CREATIVE HIDEOUT" desc="영상과 창작물을 공유하여 팬심을 증명하십시오. 독자적인 팬방(아지트)을 개설하여 시민들의 찬양을 이끌어내십시오." />
            <div className="w-full bg-[#111] p-5 rounded-[30px] border-2 border-[#daa520]/30 space-y-4 mb-4 shadow-lg text-left font-sans">
              <div className="flex gap-2">
                <button onClick={() => setPostType('VIDEO')} className={`flex-1 py-3 rounded-lg text-[10px] font-black border ${postType === 'VIDEO' ? 'bg-[#daa520] text-black border-white' : 'bg-black text-white/20'}`}>영상/소개글</button>
                <button onClick={() => setPostType('CREATION')} className={`flex-1 py-3 rounded-lg text-[10px] font-black border ${postType === 'CREATION' ? 'bg-[#daa520] text-black border-white' : 'bg-black text-white/20'}`}>개인 창작물</button>
              </div>
              <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="제목 입력" className="bg-black border border-white/20 p-3 rounded-lg w-full text-sm text-white font-black outline-none focus:border-[#daa520]" />
              <input type="text" value={newUrl} onChange={(e) => setNewUrl(e.target.value)} placeholder="영상 링크 (선택사항)" className="bg-black border border-white/20 p-3 rounded-lg w-full text-xs text-white/40 outline-none" />
              <textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="당신의 영감 혹은 의도를 기록하십시오" className="bg-black border border-white/20 p-3 rounded-lg w-full text-xs text-white/60 h-24 resize-none outline-none focus:border-[#daa520]" />
              <div className="grid grid-cols-4 md:grid-cols-6 gap-1.5 py-2 font-bold uppercase">
                {cats.map(cat => ( <button key={cat} onClick={() => setCategory(cat)} className={`py-2 rounded-lg text-[8px] border transition-all ${category === cat ? 'bg-[#daa520] text-black border-[#daa520]' : 'bg-black text-white/20 border-white/10'}`}>{cat}</button> ))}
              </div>
              <div className="flex gap-3">
                <button onClick={postCreation} className="flex-[2] py-4 rounded-xl bg-[#daa520] text-black text-sm border-2 border-white uppercase shadow-lg active:scale-95 font-black">피드 등록 ({COSTS_BEOM.POST_CREATION} BEOM)</button>
                <button onClick={() => setShowFanRoomModal(true)} className="flex-1 py-4 rounded-xl bg-white text-black text-[10px] border-2 border-[#daa520] uppercase active:scale-95 font-black">🚩 팬방 개설</button>
              </div>
            </div>
            
            <div className="space-y-6">
              {assets.filter(a => category === 'ALL' || a.category === category).map(a => (
                <div key={a.id} className="bg-[#111] rounded-[30px] border-2 p-6 space-y-4 shadow-xl border-white/10 relative text-left hover:border-[#daa520] transition-all font-black">
                  <div className="flex justify-between items-start font-sans">
                    <div><span className="text-[8px] bg-white text-black px-2 py-0.5 rounded-full uppercase mr-2 font-black">{a.category}</span><h4 className="text-2xl text-[#daa520] tracking-tighter uppercase mt-1">{a.title}</h4></div>
                    <span className="text-white/20 text-[10px] font-mono">{a.timestamp}</span>
                  </div>
                  <p className="text-white/80 text-sm italic font-black font-sans leading-snug">"{a.desc}"</p>
                  <div className="pt-4 border-t-2 border-white/5 flex justify-between items-center">
                    <button onClick={() => supportPost(a.id)} className="bg-[#daa520] text-black px-6 py-2 rounded-xl text-xs border-2 border-white active:scale-95 uppercase font-black font-sans">👑 Praise ({COSTS_BEOM.SUPPORT})</button>
                    <p className="text-[#daa520] text-2xl md:text-4xl tracking-tighter font-sans">{a.beomSupport.toLocaleString()} <span className="text-[10px]">BEOM</span></p>
                  </div>
                </div>
              ))}
            </div>

            {/* 04. 제국 시장 & 후기 */}
            <SectionHeader num="04" title="MERCHANT SQUARE & REVIEWS" desc="제국의 희귀 굿즈를 거래하고 사용자 후기를 확인하십시오. 상업 주권을 행사하고 신뢰를 쌓으십시오." />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-left font-black font-sans">
              {goods.map(g => (
                <div key={g.id} className="bg-[#111] rounded-[30px] border-2 border-white/10 p-6 shadow-2xl flex flex-col gap-4 relative">
                  <div className="absolute top-4 right-4 bg-[#daa520] text-black px-3 py-1 rounded-full text-[8px] border border-white font-bold italic">SELLER: {g.seller}</div>
                  <img src={g.img} className="w-full h-40 object-contain bg-black rounded-2xl border border-white/5" alt="G" />
                  <div>
                    <h4 className="text-white text-xl uppercase tracking-tighter font-black">{g.name}</h4>
                    <p className="text-[#daa520] text-2xl mt-1 font-black">{g.price.toLocaleString()} BEOM</p>
                  </div>
                  
                  {/* 리뷰 리스트 */}
                  <div className="mt-2 pt-4 border-t border-white/10 space-y-3">
                    <div className="flex justify-between items-center"><p className="text-[#daa520] text-[10px] uppercase font-bold tracking-widest">Reviews</p><button onClick={() => setShowReviewModal({ open: true, goodId: g.id })} className="text-white/40 text-[9px] underline font-bold">후기 작성</button></div>
                    {g.reviews.map(r => (
                      <div key={r.id} className="bg-black/50 p-3 rounded-xl border border-white/5 font-sans">
                        <p className="text-white/80 text-[10px] font-bold">"{r.text}"</p>
                        <p className="text-[#daa520] text-[8px] mt-1 italic font-black">- {r.user} ({r.timestamp})</p>
                      </div>
                    ))}
                  </div>
                  <button className="w-full py-4 rounded-xl bg-white text-black text-sm border-2 border-[#daa520] font-black uppercase active:scale-95 shadow-md">BUY NOW</button>
                </div>
              ))}
            </div>
            <button onClick={() => setShowSellModal(true)} className="w-full py-5 rounded-2xl bg-[#daa520] text-black font-black text-lg border-2 border-white uppercase shadow-xl active:scale-95 italic">➕ 제국 시장에 상품 등록 ({COSTS_BEOM.SELL_ITEM} BEOM)</button>
          </div>
        )}
      </div>

      {/* 앱 스위처 (통합 네비게이션) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black/95 border-2 border-[#daa520] p-1.5 rounded-2xl flex gap-3 z-[200] shadow-[0_0_50px_rgba(218,165,32,0.4)] backdrop-blur-xl font-sans font-black">
        {['KEDHEON', 'CIVIL', 'NEXUS', 'VENDOR'].map(app => (
          <button key={app} className={`px-3 py-1.5 rounded-xl text-[9px] transition-all ${app === 'KEDHEON' ? 'bg-[#daa520] text-black shadow-lg' : 'text-white/40 hover:text-white'}`}>{app}</button>
        ))}
      </div>

      {/* [모달 섹션] */}
      {showFanRoomModal && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[300] flex items-center justify-center p-4 animate-in zoom-in-95 font-black">
          <div className="bg-[#111] p-8 rounded-[30px] border-4 border-[#daa520] w-full max-w-sm text-center shadow-2xl">
            <h3 className="text-[#daa520] text-xl mb-6 italic uppercase font-sans tracking-tighter">New Fan Hideout</h3>
            <input type="text" value={fanRoomName} onChange={(e) => setFanRoomName(e.target.value)} placeholder="아지트 명칭 입력" className="bg-black border-2 border-white p-4 rounded-xl w-full text-white text-center mb-6 outline-none font-black shadow-inner" />
            <div className="flex gap-2 font-sans"><button onClick={() => setShowFanRoomModal(false)} className="flex-1 py-3 rounded-lg text-xs bg-white/10 border border-white/20 uppercase">Cancel</button><button onClick={createFanRoom} className="flex-1 py-3 rounded-lg text-xs bg-[#daa520] text-black border-2 border-white uppercase shadow-lg">Create</button></div>
          </div>
        </div>
      )}

      {showReviewModal.open && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[300] flex items-center justify-center p-4 animate-in zoom-in-95 font-black font-sans">
          <div className="bg-[#111] p-8 rounded-[30px] border-4 border-white w-full max-w-sm text-center shadow-2xl">
            <h3 className="text-white text-xl mb-6 italic uppercase tracking-widest font-sans">Review Product</h3>
            <textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} placeholder="구매 경험을 기록하십시오" className="bg-black border-2 border-white p-4 rounded-xl w-full text-xs text-white mb-6 h-32 outline-none font-sans" />
            <div className="flex gap-2"><button onClick={() => setShowReviewModal({ open: false, goodId: null })} className="flex-1 py-3 rounded-lg text-xs bg-white/10 border border-white/20 uppercase font-black">Cancel</button><button onClick={postReview} className="flex-1 py-3 rounded-lg text-xs bg-[#daa520] text-black border-2 border-white uppercase shadow-lg">Post</button></div>
          </div>
        </div>
      )}

      {showSellModal && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[300] flex items-center justify-center p-4 animate-in zoom-in-95 font-black font-sans">
          <div className="bg-[#111] p-8 rounded-[30px] border-4 border-[#daa520] w-full max-w-sm text-center shadow-2xl">
            <h3 className="text-[#daa520] text-xl mb-6 italic uppercase font-sans">Merchant Registration</h3>
            <div className="space-y-4 font-black"><input type="text" value={sellName} onChange={(e) => setSellName(e.target.value)} placeholder="상품 명칭" className="bg-black border-2 border-white p-3 rounded-xl w-full text-white text-sm outline-none" /><input type="number" value={sellPrice} onChange={(e) => setSellPrice(Number(e.target.value))} placeholder="판매 가격 (BEOM)" className="bg-black border-2 border-white p-3 rounded-xl w-full text-[#daa520] text-sm outline-none font-black" /><textarea value={sellDesc} onChange={(e) => setSellDesc(e.target.value)} placeholder="상품 상세 설명" className="bg-black border-2 border-white p-3 rounded-xl w-full text-white/60 text-xs h-24 outline-none font-sans" /></div>
            <div className="flex gap-2 mt-6"><button onClick={() => setShowSellModal(false)} className="flex-1 py-3 rounded-lg text-xs bg-white/10 border border-white/20 uppercase font-black">Cancel</button><button onClick={postGood} className="flex-1 py-3 rounded-lg text-xs bg-[#daa520] text-black border-2 border-white uppercase shadow-lg font-black">Post Item</button></div>
          </div>
        </div>
      )}

      {/* 최종 푸터 */}
      <div className="mt-24 opacity-30 text-center w-full pb-10 font-mono text-white text-[8px] tracking-[0.8em] uppercase font-black font-sans">KEDHEON EMPIRE | V61.3 OVERLORD | ohsangjo</div>
    </div>
  );
}
