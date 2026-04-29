'use client';
import React, { useState, useEffect } from 'react';

/** * [KEDHEON EMPIRE V70.0 PRESTIGE LEGACY]
 * -----------------------------------------------------------
 * 디자인 규격 지침:
 * 1. LARGE  : text-4xl (섹션 대제목, 자산 지표, 대문 타이틀)
 * 2. MEDIUM : text-xl  (버튼 텍스트, 입력창 라벨, 리스트 타이틀)
 * 3. SMALL  : text-sm  (상세 가이드, 설명 문구, 푸터 데이터)
 * -----------------------------------------------------------
 */

const PI_INVITE_CODE = 'ohsangjo'; 
const PI_APP_STORE_URL = 'https://apps.apple.com/app/pi-network/id1445472541';
const PI_PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.blockchainvault';
const PI_TO_BEOM_RATIO = 100; 

const COSTS_BEOM = {
  POST_CREATION: 10,
  SUPPORT: 100,
  CREATE_FAN_ROOM: 500,
  SELL_ITEM: 20,
  ACTIVATE_QR: 50
};

// --- [인터페이스 정의] ---
interface Review { id: number; user: string; text: string; timestamp: string; }
interface Asset { id: number; title: string; desc: string; category: string; type: 'CREATION' | 'POST'; beomSupport: number; timestamp: string; url?: string; }
interface Good { id: number; name: string; price: number; img: string; seller: string; desc: string; reviews: Review[]; }

export default function KedheonPortal() {
  const [hasMounted, setHasMounted] = useState(false);
  const [tab, setTab] = useState<'ROOKIE' | 'PIONEER'>('ROOKIE');
  const [beomToken, setBeomToken] = useState(7991.88); 
  
  // 보안 및 비즈니스 상태
  const [qrType, setQrType] = useState<'PERSONAL' | 'BUSINESS'>('PERSONAL');
  const [bizName, setBizName] = useState('');
  const [isQrActive, setIsQrActive] = useState(false);
  
  // 창작 게시판 상태
  const [postCategory, setPostCategory] = useState('TECH');
  const [postType, setPostType] = useState<'CREATION' | 'POST'>('POST');
  const [assets, setAssets] = useState<Asset[]>([]); 
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newUrl, setNewUrl] = useState('');

  // 마켓 게시판 상태
  const [goods, setGoods] = useState<Good[]>([
    { 
      id: 1, name: "EMPIRE GOLD BADGE", price: 1000, img: "/beom-token.png", seller: "Imperial", desc: "제국 공인 고유 황금 뱃지", 
      reviews: [{ id: 1, user: "Citizen_Alpha", text: "실물이 훨씬 웅장하고 보안 각인이 훌륭합니다.", timestamp: "2026.04.29" }] 
    }
  ]);
  const [sellName, setSellName] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [sellDesc, setSellDesc] = useState('');
  const [sellImg, setSellImg] = useState('');

  const cats = ['MUSIC', 'SPORTS', 'ANIME', 'DRAMA', 'MOVIE', 'TECH', 'FOOD', 'TRAVEL', 'BEAUTY', 'FASHION', 'GAME', 'NEWS', 'ESPORTS', 'COMEDY'];

  // 데이터 영속성 (LocalStorage)
  useEffect(() => {
    setHasMounted(true);
    const saved = localStorage.getItem('kedheon_v70_master');
    if (saved) {
      try {
        const p = JSON.parse(saved);
        if (p.token) setBeomToken(p.token);
        if (p.assets) setAssets(p.assets);
        if (p.goods) setGoods(p.goods);
      } catch (e) { console.error("Restore Error", e); }
    }
  }, []);

  useEffect(() => {
    if (hasMounted) {
      localStorage.setItem('kedheon_v70_master', JSON.stringify({ token: beomToken, assets, goods }));
    }
  }, [beomToken, assets, goods, hasMounted]);

  // 핸들러 로직
  const handleExchange = () => setBeomToken(p => p + PI_TO_BEOM_RATIO);
  const handleSupport = (id: number) => {
    if (beomToken < COSTS_BEOM.SUPPORT) return alert("자산 부족");
    setBeomToken(p => p - COSTS_BEOM.SUPPORT);
    setAssets(assets.map(a => a.id === id ? { ...a, beomSupport: a.beomSupport + COSTS_BEOM.SUPPORT } : a));
  };
  const handlePost = () => {
    if(!newTitle.trim()) return alert("제목을 입력하십시오.");
    if(beomToken < COSTS_BEOM.POST_CREATION) return alert("자산 부족");
    const post: Asset = { id: Date.now(), title: newTitle, desc: newDesc, category: postCategory, type: postType, beomSupport: 0, timestamp: new Date().toLocaleDateString(), url: newUrl };
    setAssets([post, ...assets]);
    setBeomToken(p => p - COSTS_BEOM.POST_CREATION);
    setNewTitle(''); setNewDesc(''); setNewUrl('');
    alert("피드에 등록되었습니다.");
  };
  const handleSell = () => {
    if(!sellName.trim() || !sellPrice) return alert("상품 정보를 입력하십시오.");
    if(beomToken < COSTS_BEOM.SELL_ITEM) return alert("자산 부족");
    const newGood: Good = { 
      id: Date.now(), name: sellName, price: Number(sellPrice), 
      img: sellImg || "/kedheon-character.png", seller: "Pioneer", desc: sellDesc, reviews: [] 
    };
    setGoods([newGood, ...goods]);
    setBeomToken(p => p - COSTS_BEOM.SELL_ITEM);
    setSellName(''); setSellPrice(''); setSellDesc(''); setSellImg('');
    alert("시장에 상품이 등록되었습니다.");
  };

  const SectionHeader = ({ num, title, desc }: { num: string; title: string; desc: string }) => (
    <div className="w-full border-t-2 border-white/10 pt-6 mb-4 text-left font-black">
      <h2 className="text-[#daa520] text-4xl uppercase italic mb-1 tracking-tighter border-l-8 border-[#daa520] pl-4">
        {num}. 🌐 {title}
      </h2>
      <p className="text-white/40 text-sm italic pl-6 font-sans font-bold leading-tight">{desc}</p>
    </div>
  );

  if (!hasMounted) return null;

  return (
    <div className="flex flex-col items-center bg-black min-h-screen text-white font-sans w-full pb-40 font-black overflow-x-hidden">
      
      {/* --- [GNB: 고정 상단바] --- */}
      <div className="w-full max-w-4xl flex justify-between items-center p-4 sticky top-0 bg-black/95 backdrop-blur-md z-[150] border-b-2 border-[#daa520]">
        <div className="flex items-center gap-3">
          <img src="/kedheon-character.png" className="w-10 h-10 rounded-xl border-2 border-[#daa520]" alt="K" />
          <div className="text-left font-black">
            <h2 className="text-[#daa520] text-lg italic leading-none uppercase">Kedheon</h2>
            <span className="text-white/30 text-[9px] font-mono tracking-widest uppercase font-black">v70.0 Legacy</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setTab('ROOKIE')} className={`px-5 py-1.5 rounded-md text-sm border transition-all ${tab === 'ROOKIE' ? 'bg-[#daa520] text-black border-[#daa520]' : 'border-white/10 text-white/40 font-bold'}`}>ROOKIE</button>
          <button onClick={() => setTab('PIONEER')} className={`px-5 py-1.5 rounded-md text-sm border transition-all ${tab === 'PIONEER' ? 'bg-[#daa520] text-black border-[#daa520]' : 'border-white/10 text-white/40 font-bold'}`}>PIONEER</button>
        </div>
      </div>

      <div className="w-full max-w-4xl px-4 py-6">
        {tab === 'ROOKIE' ? (
          /* --- [ROOKIE: 8단계 가입 절차] --- */
          <div className="flex flex-col gap-8 animate-in fade-in text-left">
            <div className="flex flex-col items-center text-center gap-6 py-12 bg-[#111] rounded-[40px] border-4 border-[#daa520] shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 opacity-10 bg-[url('/kedheon-character.png')] bg-center bg-no-repeat bg-contain scale-150"></div>
              <img src="/kedheon-character.png" className="w-48 h-48 rounded-[40px] border-4 border-white shadow-2xl relative z-10" alt="Main" />
              <div className="relative z-10 px-6 font-black">
                <h1 className="text-[#daa520] text-4xl uppercase mb-1 tracking-tighter">Web3 초대합니다.</h1>
                <p className="text-white text-xl uppercase tracking-widest border-b-2 border-[#daa520] pb-2 inline-block font-black">파이코인 가입절차</p>
                <p className="text-white/40 text-sm mt-4 font-sans max-w-lg mx-auto leading-tight italic font-black">제국 시민이 되기 위한 가장 정확한 8단계 가이드를 확인하십시오.</p>
              </div>
            </div>

            <div className="grid gap-3">
              {[
                { s: "Step 01", t: "애플리케이션 설치", d: "스토어에서 [Pi Network] 공식 앱을 설치하십시오." },
                { s: "Step 02", t: "가입 방식 선택", d: "[Continue with phone number] 가입을 권장합니다." },
                { s: "Step 03", t: "국가 및 번호 설정", d: "국가 코드를 [+82(South Korea)]로 설정 후 본인 번호를 입력하십시오." },
                { s: "Step 04", t: "비밀번호 생성", d: "영문 대문자, 소문자, 숫자를 조합하여 강력한 암호를 만드십시오." },
                { s: "Step 05", t: "실명 프로필 작성", d: "여권 영문 실명을 입력하고 사용할 아이디(ID)를 설정하십시오." },
                { s: "Step 06", t: "웹3 초대 코드 입력", d: `초대 코드 [ ${PI_INVITE_CODE} ]를 반드시 입력하십시오.`, gold: true },
                { s: "Step 07", t: "비밀구절 수기 보관", d: "지갑의 24개 비밀구절은 오직 종이에만 기록하여 보관하십시오.", danger: true },
                { s: "Step 08", t: "채굴 버튼 활성화", d: "메인 화면의 번개 버튼을 눌러 정식 시민권을 획득하십시오.", gold: true }
              ].map((step, idx) => (
                <div key={idx} className={`p-4 bg-[#111] rounded-[20px] border-2 shadow-xl flex items-center gap-4 ${step.gold ? 'border-[#daa520] bg-[#daa520]/5' : step.danger ? 'border-red-600' : 'border-white/5'}`}>
                  <span className="text-[#daa520] text-xs uppercase font-sans whitespace-nowrap font-black">{step.s}</span>
                  <div className="flex flex-col">
                    <h3 className="text-white text-sm uppercase italic font-black">{step.t}</h3>
                    <p className="text-white/40 text-[11px] leading-tight font-sans font-bold font-black">{step.d}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4 font-sans pt-4 font-black">
              <button onClick={() => window.open(PI_APP_STORE_URL)} className="flex-1 bg-white text-black py-5 rounded-3xl text-xl font-black uppercase shadow-lg border-4 border-[#daa520] active:scale-95 transition-all">App Store</button>
              <button onClick={() => window.open(PI_PLAY_STORE_URL)} className="flex-1 bg-white text-black py-5 rounded-3xl text-xl font-black uppercase shadow-lg border-4 border-[#daa520] active:scale-95 transition-all">Play Store</button>
            </div>
          </div>
        ) : (
          /* --- [PIONEER: 핵심 기능 및 경제 시스템] --- */
          <div className="flex flex-col gap-8 py-2 text-left font-black animate-in slide-in-from-bottom-2">
            
            {/* 자산 대시보드 (LARGE) */}
            <div className="bg-[#111] p-8 rounded-[50px] border-4 border-[#daa520] shadow-2xl flex justify-between items-center relative overflow-hidden">
                <div className="text-left font-black z-10">
                  <h3 className="text-white/30 text-[10px] uppercase tracking-[0.4em] mb-2">Imperial Total Assets</h3>
                  <p className="text-[#daa520] text-4xl md:text-7xl tracking-tighter leading-none font-black">
                    {Math.floor(beomToken).toLocaleString()}
                    <span className="text-xl opacity-40">.{beomToken.toFixed(2).split('.')[1]}</span> 
                    <span className="ml-3 text-2xl">BEOM</span>
                  </p>
                  <div className="mt-4 bg-black/60 px-6 py-2 rounded-xl border border-white/10 inline-block text-lg font-mono italic text-white/50 font-black">
                    ≈ {(beomToken / PI_TO_BEOM_RATIO).toFixed(4)} Pi
                  </div>
                </div>
                <img src="/beom-token.png" className="w-20 h-20 md:w-32 md:h-32 object-contain animate-pulse" alt="B" />
            </div>

            {/* 🌐 01. 환전소 */}
            <SectionHeader num="01" title="BEOM EXCHANGE" desc="파이코인 채굴 기여도를 제국 통화인 범토큰(BEOM)으로 즉시 환전하여 경제권을 확보하십시오." />
            <div className="bg-[#111] p-8 rounded-[40px] border-2 border-[#daa520] flex flex-col md:flex-row justify-between items-center gap-6 shadow-2xl">
              <div className="text-left font-black font-sans">
                <p className="text-white text-xl uppercase italic mb-1 font-black">Conversion Terminal</p>
                <p className="text-[#daa520] text-sm font-black uppercase tracking-widest font-sans">고정 비율: 1 Pi = 100 BEOM</p>
              </div>
              <button onClick={handleExchange} className="w-full md:w-auto bg-[#daa520] text-black px-12 py-5 rounded-2xl text-xl border-4 border-white active:scale-95 uppercase font-black shadow-xl font-sans">1 Pi 즉시 환전</button>
            </div>

            {/* 🌐 02. 보안 인증 (QR 및 이미지) */}
            <SectionHeader num="02" title="SECURE AUTH" desc="고유 QR코드를 발급받아 개인 보안을 강화하고 제국 내 모든 서비스의 인증 수단으로 사용하십시오." />
            <div className="bg-[#111] p-8 rounded-[40px] border-2 border-white/10 flex flex-col items-center gap-8 shadow-xl">
              <div className="flex gap-4 w-full max-w-sm bg-black p-2 rounded-2xl border-2 border-white/5 font-black font-sans">
                <button onClick={() => { setQrType('PERSONAL'); setIsQrActive(false); }} className={`flex-1 py-3 rounded-xl text-xs transition-all ${qrType === 'PERSONAL' ? 'bg-[#daa520] text-black border-2 border-white shadow-lg' : 'text-white/20'}`}>PERSONAL</button>
                <button onClick={() => { setQrType('BUSINESS'); setIsQrActive(false); }} className={`flex-1 py-3 rounded-xl text-xs transition-all ${qrType === 'BUSINESS' ? 'bg-[#daa520] text-black border-2 border-white shadow-lg' : 'text-white/20'}`}>BUSINESS</button>
              </div>
              
              {qrType === 'BUSINESS' && (
                <div className="w-full max-w-sm animate-in fade-in slide-in-from-top-2 font-black">
                  <p className="text-[#daa520] text-sm uppercase mb-2 ml-2 tracking-widest font-black font-sans">Business Name</p>
                  <input type="text" value={bizName} onChange={(e) => setBizName(e.target.value.toUpperCase())} placeholder="비즈니스 명칭 입력" className="w-full bg-black border-2 border-[#daa520] p-5 rounded-3xl text-center text-[#daa520] text-xl outline-none font-black font-sans shadow-inner" />
                </div>
              )}

              <div className={`p-6 bg-black border-4 rounded-[60px] transition-all flex flex-col items-center justify-center w-72 h-72 ${isQrActive ? 'border-[#daa520] shadow-[0_0_50px_rgba(218,165,32,0.3)]' : 'opacity-10 border-white'}`}>
                {isQrActive ? (
                  <>
                    <img src={qrType === 'PERSONAL' ? "/qr-personal.png" : "/qr-business.png"} className="w-48 h-48 rounded-2xl mb-2 shadow-2xl" alt="QR" />
                    <span className="text-[#daa520] text-sm uppercase tracking-widest font-black italic font-sans">{qrType === 'BUSINESS' ? bizName : 'Personal Security'}</span>
                  </>
                ) : (
                  <p className="text-white/5 text-2xl italic uppercase font-black tracking-[0.5em] font-sans">Security Locked</p>
                )}
              </div>
              <button onClick={() => { if(qrType==='BUSINESS' && !bizName) return alert("기업명 필수"); setIsQrActive(true); setBeomToken(p => p - COSTS_BEOM.ACTIVATE_QR); }} className="w-full max-w-sm bg-[#daa520] text-black py-6 rounded-3xl text-xl border-4 border-white active:scale-95 uppercase font-black shadow-2xl font-sans">보안 QR 활성화 ({COSTS_BEOM.ACTIVATE_QR} BEOM)</button>
            </div>

            {/* 🌐 03. 창작 게시판 (피드 및 호응) */}
            <SectionHeader num="03" title="CREATIVE BOARD" desc="영상이나 창작물을 게시하여 팬심을 증명하고, 다른 파이오니어들의 BEOM 호응을 끌어내십시오." />
            <div className="bg-[#111] p-8 rounded-[40px] border-2 border-[#daa520]/30 space-y-6 shadow-2xl font-black text-left">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {cats.map(cat => (
                  <button key={cat} onClick={() => setPostCategory(cat)} className={`px-4 py-2 rounded-full text-[10px] font-black border-2 transition-all ${postCategory === cat ? 'bg-white text-black border-white' : 'border-white/10 text-white/40 hover:border-white/30'}`}>{cat}</button>
                ))}
              </div>
              <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="제목 (MEDIUM TEXT)" className="w-full bg-black border-2 border-white/10 p-5 rounded-xl text-xl text-white outline-none focus:border-[#daa520] font-black shadow-inner" />
              <input value={newUrl} onChange={(e) => setNewUrl(e.target.value)} placeholder="영상 또는 이미지 URL 링크 (SMALL TEXT)" className="w-full bg-black border-2 border-white/10 p-4 rounded-xl text-sm text-[#daa520] outline-none font-bold shadow-inner" />
              <textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="창작 의도 및 내용을 기록하십시오" className="w-full bg-black border-2 border-white/10 p-5 rounded-xl text-sm text-white/70 h-32 outline-none font-bold shadow-inner" />
              <div className="flex gap-3 pt-2">
                <button onClick={handlePost} className="flex-[2] bg-[#daa520] text-black py-5 rounded-2xl text-xl border-4 border-white uppercase font-black shadow-xl active:scale-95">피드 등록 ({COSTS_BEOM.POST_CREATION})</button>
                <button className="flex-1 bg-white text-black py-5 rounded-2xl text-[10px] border-2 border-[#daa520] uppercase font-black leading-tight shadow-xl">🚩 팬방 개설<br/>({COSTS_BEOM.CREATE_FAN_ROOM})</button>
              </div>
            </div>

            {/* 피드 리스트 */}
            <div className="space-y-6">
              {assets.map(a => (
                <div key={a.id} className="bg-[#111] p-8 rounded-[45px] border-2 border-white/5 shadow-2xl relative text-left">
                  <div className="flex justify-between items-start mb-6 font-black">
                    <div className="flex flex-col gap-2">
                      <span className="text-[10px] text-[#daa520] font-black uppercase tracking-widest bg-[#daa520]/10 px-3 py-1 rounded-full w-fit">{a.category}</span>
                      <h4 className="text-white text-2xl uppercase italic font-black underline underline-offset-8 decoration-[#daa520]/20">{a.title}</h4>
                    </div>
                    <span className="text-white/20 text-[10px] font-mono font-bold font-sans">{a.timestamp}</span>
                  </div>
                  {a.url && (
                    <div className="mb-6 p-4 bg-black rounded-2xl flex justify-between items-center border border-[#daa520]/20 font-sans font-bold">
                      <p className="text-[10px] text-[#daa520] truncate opacity-50 pr-6 italic">{a.url}</p>
                      <button onClick={() => window.open(a.url, '_blank')} className="bg-[#daa520] text-black px-5 py-2 rounded-xl text-[10px] font-black uppercase shadow-lg active:scale-95">Watch 📺</button>
                    </div>
                  )}
                  <p className="text-white/70 text-lg italic leading-relaxed mb-8 font-sans font-bold">"{a.desc}"</p>
                  <div className="flex justify-between items-center border-t border-white/5 pt-6 font-black">
                    <button onClick={() => handleSupport(a.id)} className="bg-[#daa520] text-black px-10 py-4 rounded-2xl text-[11px] border-2 border-white uppercase font-black active:scale-95 shadow-xl font-sans">👑 Praise ({COSTS_BEOM.SUPPORT})</button>
                    <p className="text-[#daa520] text-4xl tracking-tighter font-black font-sans">{a.beomSupport.toLocaleString()} <span className="text-sm font-black">BEOM</span></p>
                  </div>
                </div>
              ))}
            </div>

            {/* 🌐 04. 시장 및 후기 (판매 등록 박스 포함) */}
            <SectionHeader num="04" title="MERCHANT & REVIEWS" desc="제국의 희귀 굿즈를 거래하거나 판매 게시글을 직접 올려 상업적 주권을 행사하십시오." />
            
            {/* 판매 게시글 등록 박스 */}
            <div className="bg-[#111] p-8 rounded-[40px] border-2 border-[#daa520]/30 space-y-5 mb-10 shadow-2xl font-black text-left">
              <h3 className="text-white text-sm uppercase italic font-black border-l-4 border-[#daa520] pl-3 mb-4 font-sans">Register Sale Item</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input value={sellName} onChange={(e) => setSellName(e.target.value)} placeholder="판매 상품명 (MEDIUM TEXT)" className="w-full bg-black border-2 border-white/10 p-5 rounded-2xl text-xl text-white outline-none focus:border-[#daa520] font-sans font-black shadow-inner" />
                <input type="number" value={sellPrice} onChange={(e) => setSellPrice(e.target.value)} placeholder="판매 가격 (BEOM)" className="w-full bg-black border-2 border-white/10 p-5 rounded-2xl text-xl text-[#daa520] outline-none focus:border-[#daa520] font-sans font-black shadow-inner" />
              </div>
              <input value={sellImg} onChange={(e) => setSellImg(e.target.value)} placeholder="제품 이미지 URL (링크 주소 입력)" className="w-full bg-black border-2 border-white/10 p-4 rounded-2xl text-sm text-[#daa520] outline-none font-sans font-bold shadow-inner" />
              <textarea value={sellDesc} onChange={(e) => setSellDesc(e.target.value)} placeholder="상품에 대한 상세 설명을 입력하십시오" className="w-full bg-black border-2 border-white/10 p-5 rounded-2xl text-sm text-white/70 h-24 outline-none font-sans font-bold shadow-inner" />
              <button onClick={handleSell} className="w-full bg-[#daa520] text-black py-6 rounded-3xl text-xl border-4 border-white uppercase font-black shadow-xl active:scale-95 font-sans">상품 등록 ({COSTS_BEOM.SELL_ITEM} BEOM)</button>
            </div>

            <div className="grid md:grid-cols-2 gap-8 font-black text-left">
              {/* 판매 게시판 */}
              <div className="space-y-6">
                <h3 className="text-white text-sm uppercase border-b-2 border-white/10 pb-2 italic font-black font-sans tracking-widest">Sales Board</h3>
                {goods.map(g => (
                  <div key={g.id} className="bg-[#111] p-8 rounded-[45px] border-2 border-white/10 shadow-2xl text-center group font-black">
                    <img src={g.img} className="w-full h-48 object-contain bg-black rounded-[35px] mb-6 shadow-inner transition-transform group-hover:scale-105" alt="G" />
                    <h4 className="text-white text-xl uppercase mb-2 font-black leading-none">{g.name}</h4>
                    <p className="text-[#daa520] text-3xl mb-6 font-black font-sans">{g.price.toLocaleString()} <span className="text-sm font-black">BEOM</span></p>
                    <button className="w-full py-5 bg-white text-black rounded-2xl text-xl border-4 border-[#daa520] uppercase font-black active:scale-95 shadow-xl font-sans">Buy Now</button>
                  </div>
                ))}
              </div>
              {/* 후기 게시판 */}
              <div className="space-y-6 font-black">
                <h3 className="text-white text-sm uppercase border-b-2 border-white/10 pb-2 italic font-black font-sans tracking-widest">Review Board</h3>
                {goods[0].reviews.map(r => (
                  <div key={r.id} className="bg-black/50 p-6 rounded-[30px] border-2 border-white/5 shadow-inner font-black">
                    <p className="text-white/80 text-[11px] italic font-sans mb-3 font-bold leading-relaxed">"{r.text}"</p>
                    <div className="flex justify-between items-center text-[10px] font-mono text-[#daa520] font-black uppercase tracking-[0.2em] font-sans">
                      <span>- {r.user}</span>
                      <span className="text-white/20 font-sans">{r.timestamp}</span>
                    </div>
                  </div>
                ))}
                <button className="w-full py-5 border-2 border-dashed border-white/10 rounded-2xl text-[10px] text-white/30 uppercase font-black hover:border-[#daa520] hover:text-[#daa520] transition-all font-sans font-bold shadow-inner">Write Review</button>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* --- [하단 통합 네비게이션: 균등 간격] --- */}
      <div className="fixed bottom-6 left-4 right-4 max-w-4xl mx-auto bg-black/95 border-2 border-[#daa520] p-1.5 rounded-[25px] flex justify-between gap-1 z-[200] shadow-2xl backdrop-blur-2xl">
        {['KEDHEON', 'CIVIL', 'NEXUS', 'VENDOR'].map(app => (
          <button key={app} className={`flex-1 py-3 rounded-[20px] text-[10px] md:text-xs transition-all font-black text-center ${app === 'KEDHEON' ? 'bg-[#daa520] text-black shadow-inner scale-100' : 'text-white/30 hover:text-white'}`}>{app}</button>
        ))}
      </div>

      {/* 푸터 */}
      <div className="mt-40 opacity-20 text-[10px] tracking-[1.5em] uppercase pb-10 font-sans font-black text-center">
        Kedheon Empire | V70.0 Prestige Legacy | @Ohsangjo
      </div>
    </div>
  );
}
