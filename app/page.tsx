'use client';
import React, { useState, useEffect } from 'react';

/** * [KEDHEON MASTER V92.0 ULTIMATE COMPLETE]
 * -----------------------------------------------------------
 * 1. 무회색 정책 (Zero Grey): 모든 보조 텍스트까지 순수 화이트 적용
 * 2. 루키 가이드 복구: 8단계 상세 설명 수직 1열 배치 + 스토어 버튼
 * 3. 기업형 QR: "케데헌까페" 예시 적용 및 와이드 오버레이 로직
 * 4. 마켓 시스템: 상품 등록 박스 + 상품 리스트 + 후기 게시판 완결
 * 5. 컴팩트 비례: 화면 과부하를 막는 최적화된 마진 및 패딩
 * -----------------------------------------------------------
 */

// --- [상수 및 환경설정] ---
const PI_INVITE_CODE = 'ohsangjo';
const PI_APP_STORE = 'https://apps.apple.com/app/pi-network/id1445472541';
const PI_PLAY_STORE = 'https://play.google.com/store/apps/details?id=com.blockchainvault';
const RATIO = 100;

const DICT = {
  KR: {
    rookie: "ROOKIE", pioneer: "PIONEER", exchange: "EXCHANGE", auth: "SECURE AUTH", creative: "CREATIVE", market: "MARKET",
    invitation: "Web3 초대합니다.", procedure: "가입절차 안내", assets: "ASSETS", activate: "보안 QR 활성화",
    convert: "1 PI 환전", post: "피드 등록", praise: "호응하기", buy: "구매하기", register: "상품 등록",
    stepDesc: "제국 시민권을 위한 친절한 8단계 가이드입니다.",
    exchangeDesc: "보유하신 채굴 기여도를 제국 통화인 BEOM으로 즉시 전환하십시오.",
    authDesc: "개인 및 비즈니스용 큐알코드를 발급받아 보안 인증 수단으로 사용하십시오.",
    creativeDesc: "창작물을 게시하여 팬심을 증명하고 파이오니어들의 호응을 이끌어내십시오.",
    marketDesc: "다양한 GOODS를 거래하고 실제 사용 후기를 확인하십시오.",
    steps: [
      { t: "애플리케이션 설치", d: "스토어에서 [Pi Network] 공식 앱을 검색하여 설치하십시오." },
      { t: "가입 방식 선택", d: "[Continue with phone number] 보안 가입을 선택하십시오." },
      { t: "국가 및 번호 설정", d: "국가를 [+82(South Korea)]로 설정 후 번호를 입력하십시오." },
      { t: "보안 비밀번호 생성", d: "영문 대/소문자와 숫자를 조합하여 강력한 암호를 만드십시오." },
      { t: "실명 프로필 작성", d: "여권 영문 실명을 입력하고 고유 ID를 설정하십시오." },
      { t: "초대 코드 입력", d: `초대 코드 [ ${PI_INVITE_CODE} ]를 정확히 기입하십시오.` },
      { t: "비밀구절 수기 보관", d: "지갑 생성 시 주어지는 24개 단어는 반드시 종이에 기록하십시오." },
      { t: "채굴 버튼 활성화", d: "번개 버튼을 눌러 정식 활동을 시작하십시오." }
    ]
  },
  EN: {
    rookie: "ROOKIE", pioneer: "PIONEER", exchange: "EXCHANGE", auth: "SECURE AUTH", creative: "CREATIVE", market: "MARKET",
    invitation: "WEB3 INVITATION", procedure: "REGISTRATION GUIDE", assets: "ASSETS", activate: "ACTIVATE QR",
    convert: "CONVERT 1 PI", post: "POST FEED", praise: "PRAISE", buy: "BUY NOW", register: "REGISTER",
    stepDesc: "Friendly 8-step guide to join the ecosystem.",
    exchangeDesc: "Convert your mining efforts into BEOM tokens immediately.",
    authDesc: "Issue personal or business QR codes for secure authentication.",
    creativeDesc: "Post your digital creations and earn support from the community.",
    marketDesc: "Trade unique goods and check verified user reviews.",
    steps: [
      { t: "Install App", d: "Download the official [Pi Network] app from stores." },
      { t: "Select Method", d: "Choose [Continue with phone number] for security." },
      { t: "Region Config", d: "Set to [+82(South Korea)] and enter number." },
      { t: "Password", d: "Create a strong alphanumeric password." },
      { t: "Real Identity", d: "Enter Passport name and set a unique ID." },
      { t: "Invitation", d: `Use invitation code [ ${PI_INVITE_CODE} ] to join.` },
      { t: "Passphrase", d: "Hand-write the 24 words and store them safely." },
      { t: "Mining", d: "Engage the lightning button to start mining." }
    ]
  }
};

// --- [데이터 타입] ---
interface Review { id: number; user: string; text: string; time: string; }
interface Asset { id: number; title: string; desc: string; category: string; beom: number; time: string; }
interface Good { id: number; name: string; price: number; img: string; reviews: Review[]; }

export default function KedheonPortal() {
  const [hasMounted, setHasMounted] = useState(false);
  const [lang, setLang] = useState<'KR' | 'EN'>('KR');
  const [tab, setTab] = useState<'ROOKIE' | 'PIONEER'>('PIONEER');
  const [beomToken, setBeomToken] = useState(7891.88);
  
  // 인증/보안 상태
  const [qrType, setQrType] = useState<'PERSONAL' | 'BUSINESS'>('PERSONAL');
  const [bizName, setBizName] = useState('');
  const [isQrActive, setIsQrActive] = useState(false);
  
  // 피드 상태
  const [postCategory, setPostCategory] = useState('TECH');
  const [assets, setAssets] = useState<Asset[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');

  // 마켓 상태
  const [goods, setGoods] = useState<Good[]>([
    { id: 1, name: "GOLD BADGE", price: 1000, img: "/beom-token.png", reviews: [{ id: 1, user: "Citizen_Alpha", text: "상당히 정교한 마감입니다.", time: "2026.04.29" }] }
  ]);
  const [sellName, setSellName] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [sellImg, setSellImg] = useState('');

  const L = DICT[lang];
  const cats = ['MUSIC', 'TECH', 'ART', 'FOOD', 'TRAVEL', 'GAME', 'NEWS', 'MOVIE'];

  useEffect(() => {
    setHasMounted(true);
    const saved = localStorage.getItem('kedheon_v92_complete');
    if (saved) {
      try {
        const p = JSON.parse(saved);
        if (p.token !== undefined) setBeomToken(p.token);
        if (p.lang) setLang(p.lang);
        if (Array.isArray(p.assets)) setAssets(p.assets);
      } catch (e) { console.error(e); }
    }
  }, []);

  useEffect(() => {
    if (hasMounted) localStorage.setItem('kedheon_v92_complete', JSON.stringify({ token: beomToken, lang, assets }));
  }, [beomToken, lang, assets, hasMounted]);

  // 로직 핸들러
  const handleExchange = () => { setBeomToken(p => p + 100); alert("환전 완료"); };
  const handleActivateQr = () => {
    if (qrType === 'BUSINESS' && !bizName.trim()) return alert("기업명을 입력하십시오.");
    setBeomToken(p => p - 50); setIsQrActive(true);
  };
  const handlePost = () => {
    if(!newTitle.trim()) return;
    setAssets([{id:Date.now(), title:newTitle, desc:newDesc, category:postCategory, beom:0, time:"NOW"},...assets]);
    setBeomToken(p => p - 10); setNewTitle(''); setNewDesc('');
  };

  const SectionHeader = ({ num, title, desc }: { num: string; title: string; desc: string }) => (
    <div className="w-full border-t-2 border-white pt-6 md:pt-8 mb-4 text-left font-black">
      <h2 className="text-[#daa520] text-xl md:text-3xl uppercase italic mb-1 border-l-4 border-[#daa520] pl-3 tracking-tighter">
        {num}. {title}
      </h2>
      <p className="text-white text-[10px] md:text-[13px] font-sans font-bold leading-tight pl-4 italic opacity-90">{desc}</p>
    </div>
  );

  if (!hasMounted) return null;

  return (
    <div className="flex flex-col items-center bg-black min-h-screen text-white font-sans w-full pb-96 font-black overflow-x-hidden">
      
      {/* --- [GNB: 최적 비례 상단바] --- */}
      <div className="w-full max-w-6xl flex justify-between items-center px-4 py-3 md:py-4 sticky top-0 bg-black/95 backdrop-blur-xl z-[150] border-b-2 border-white shadow-xl">
        <div className="flex items-center gap-2">
          <img src="/kedheon-character.png" className="w-8 h-8 md:w-10 md:h-10 rounded-lg border-2 border-white" alt="K" />
          <div className="text-left font-black leading-tight">
            <h2 className="text-[#daa520] text-lg md:text-xl italic uppercase tracking-tighter">Kedheon</h2>
            <span className="text-white text-[8px] md:text-[10px] font-mono tracking-widest uppercase font-bold">v92.0 Ultimate</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex bg-[#111] rounded-lg p-0.5 border-2 border-white">
            <button onClick={() => setLang('KR')} className={`px-2 py-0.5 rounded-md text-[9px] md:text-[11px] transition-all font-black ${lang === 'KR' ? 'bg-[#daa520] text-black shadow-sm' : 'text-white'}`}>KR</button>
            <button onClick={() => setLang('EN')} className={`px-2 py-0.5 rounded-md text-[9px] md:text-[11px] transition-all font-black ${lang === 'EN' ? 'bg-[#daa520] text-black shadow-sm' : 'text-white'}`}>EN</button>
          </div>
          <div className="flex gap-1.5 font-black">
            <button onClick={() => setTab('ROOKIE')} className={`px-3 py-1.5 rounded-lg text-[10px] md:text-xs border-2 transition-all ${tab === 'ROOKIE' ? 'bg-[#daa520] text-black border-white' : 'border-white text-white'}`}>{L.rookie}</button>
            <button onClick={() => setTab('PIONEER')} className={`px-3 py-1.5 rounded-lg text-[10px] md:text-xs border-2 transition-all ${tab === 'PIONEER' ? 'bg-[#daa520] text-black border-white' : 'border-white text-white'}`}>{L.pioneer}</button>
          </div>
        </div>
      </div>

      <div className="w-full max-w-4xl px-4 py-4 md:py-8">
        {tab === 'ROOKIE' ? (
          /* --- [ROOKIE: 수직 구조 및 상세 설명] --- */
          <div className="flex flex-col gap-6 md:gap-10 animate-in fade-in text-left">
            <div className="flex flex-col items-center text-center gap-4 py-10 bg-[#111] rounded-[30px] border-4 border-white shadow-2xl relative overflow-hidden">
              <img src="/kedheon-character.png" className="w-32 h-32 md:w-44 md:h-44 rounded-[30px] border-4 border-white shadow-xl relative z-10" alt="Main" />
              <div className="relative z-10 px-4 font-black">
                <h1 className="text-[#daa520] text-2xl md:text-5xl uppercase mb-1 tracking-tighter drop-shadow-md">{L.invitation}</h1>
                <p className="text-white text-base md:text-2xl uppercase tracking-widest border-b-2 border-white pb-2 inline-block font-black">{L.procedure}</p>
                <p className="text-white text-[10px] md:text-[13px] mt-4 italic font-sans font-bold">{L.stepDesc}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2 md:gap-3 font-black">
              {L.steps.map((step: any, i: number) => (
                <div key={i} className={`p-4 md:p-6 bg-[#111] rounded-2xl border-4 flex items-center gap-5 transition-all ${i >= 5 ? 'border-[#daa520] bg-[#daa520]/10' : 'border-white'}`}>
                  <span className="text-[#daa520] text-base md:text-2xl font-black italic opacity-100 whitespace-nowrap">0{i+1}</span>
                  <div>
                    <h3 className="text-white text-sm md:text-lg font-black uppercase italic mb-0.5">{step.t}</h3>
                    <p className="text-white text-[10px] md:text-[13px] font-sans font-bold leading-snug">{step.d}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3 pt-4">
              <button onClick={() => window.open(PI_APP_STORE)} className="flex-1 bg-white text-black py-4 rounded-2xl text-sm md:text-lg font-black uppercase border-4 border-[#daa520] active:scale-95 shadow-md">App Store</button>
              <button onClick={() => window.open(PI_PLAY_STORE)} className="flex-1 bg-white text-black py-4 rounded-2xl text-sm md:text-lg font-black border-4 border-[#daa520] active:scale-95 shadow-md">Play Store</button>
            </div>
          </div>
        ) : (
          /* --- [PIONEER: 초정밀 컴팩트 레이아웃] --- */
          <div className="flex flex-col gap-8 md:gap-14 py-2 text-left font-black animate-in slide-in-from-bottom-2">
            
            {/* ASSETS (Full White Tech Text) */}
            <div className="bg-[#111] p-6 md:p-12 rounded-[40px] md:rounded-[60px] border-4 border-[#daa520] shadow-xl flex justify-between items-center relative overflow-hidden">
                <div className="text-left font-black z-10">
                  <h3 className="text-white text-[9px] md:text-[13px] uppercase tracking-widest mb-1 font-sans font-bold">{L.assets}</h3>
                  <p className="text-[#daa520] text-3xl md:text-7xl tracking-tighter leading-none font-black drop-shadow-lg">
                    {Math.floor(beomToken).toLocaleString()}
                    <span className="text-lg md:text-4xl opacity-90">.{beomToken.toFixed(2).split('.')[1]}</span> 
                    <span className="ml-2 text-lg md:text-4xl">BEOM</span>
                  </p>
                  <div className="mt-4 bg-black/60 px-5 py-2 rounded-xl border-2 border-white inline-block text-xs md:text-2xl font-mono italic text-white font-black">
                    ≈ {(beomToken / 100).toFixed(4)} Pi
                  </div>
                </div>
                <img src="/beom-token.png" className="w-16 h-16 md:w-44 md:h-44 object-contain animate-pulse" alt="B" />
            </div>

            {/* 01. EXCHANGE */}
            <SectionHeader num="01" title={L.exchange} desc={L.exchangeDesc} />
            <div className="bg-[#151515] p-5 md:p-10 rounded-[35px] border-4 border-white flex justify-between items-center shadow-xl transition-all hover:border-[#daa520]">
              <div className="font-sans text-left">
                <p className="text-white text-sm md:text-2xl font-black italic uppercase">Terminal</p>
                <p className="text-white text-[9px] md:text-sm font-black mt-2 uppercase tracking-widest">Rate: 1 Pi = 100 BEOM</p>
              </div>
              <button onClick={handleExchange} className="bg-[#daa520] text-black px-6 md:px-14 py-4 md:py-6 rounded-xl md:rounded-[30px] text-sm md:text-2xl border-4 border-white active:scale-95 uppercase font-black">{L.convert}</button>
            </div>

            {/* 02. AUTH (Custom: 케데헌까페) */}
            <SectionHeader num="02" title={L.auth} desc={L.authDesc} />
            <div className="bg-[#151515] p-6 md:p-12 rounded-[40px] border-4 border-white flex flex-col items-center gap-8 shadow-xl">
              <div className="flex gap-2 w-full max-w-sm bg-black p-1.5 rounded-xl border-2 border-white font-black">
                <button onClick={() => { setQrType('PERSONAL'); setIsQrActive(false); }} className={`flex-1 py-2 md:py-4 rounded-lg text-[10px] md:text-sm transition-all border-2 ${qrType === 'PERSONAL' ? 'bg-[#daa520] text-black border-white' : 'border-transparent text-white'}`}>PERSONAL</button>
                <button onClick={() => { setQrType('BUSINESS'); setIsQrActive(false); }} className={`flex-1 py-2 md:py-4 rounded-lg text-[10px] md:text-sm transition-all border-2 ${qrType === 'BUSINESS' ? 'bg-[#daa520] text-black border-white' : 'border-transparent text-white'}`}>BUSINESS</button>
              </div>
              
              {qrType === 'BUSINESS' && (
                <div className="w-full max-w-sm space-y-2 animate-in slide-in-from-top-1">
                   <p className="text-white text-[10px] md:text-xs uppercase font-black pl-2">Enterprise Name</p>
                   <input value={bizName} onChange={(e) => setBizName(e.target.value.toUpperCase())} placeholder="케데헌까페 명칭 입력" className="w-full bg-black border-4 border-[#daa520] p-4 md:p-5 rounded-2xl text-center text-[#daa520] text-lg md:text-2xl outline-none font-black placeholder:text-[#daa520]/30 shadow-inner" />
                </div>
              )}

              <div className={`relative bg-black border-4 rounded-[40px] flex flex-col items-center justify-center transition-all duration-700 overflow-hidden shadow-2xl
                ${qrType === 'PERSONAL' ? 'w-56 h-56 md:w-80 md:h-80' : 'w-full max-w-xl aspect-video'} 
                ${isQrActive ? 'border-[#daa520] opacity-100' : 'opacity-20 border-white'}`}
              >
                {isQrActive ? (
                  <>
                    <img src={qrType === 'PERSONAL' ? "/qr-personal.png" : "/qr-business.png"} className={`w-full h-full ${qrType === 'PERSONAL' ? 'object-contain' : 'object-cover'}`} alt="QR" />
                    <div className="absolute bottom-5 bg-black/90 px-8 py-2 rounded-full border-2 border-[#daa520] backdrop-blur-md">
                      <span className="text-[#daa520] text-[10px] md:text-xl font-black italic uppercase tracking-widest">{bizName || "KEDHEON CAFE"}</span>
                    </div>
                  </>
                ) : <p className="text-white text-xl md:text-5xl font-black uppercase italic tracking-widest">Locked</p>}
              </div>
              <button onClick={() => setIsQrActive(true)} className="w-full max-w-md bg-[#daa520] text-black py-5 md:py-8 rounded-2xl md:rounded-[40px] text-lg md:text-2xl border-4 border-white active:scale-95 uppercase font-black shadow-2xl">보안 QR 활성화 (50)</button>
            </div>

            {/* 03. CREATIVE */}
            <SectionHeader num="03" title={L.creative} desc={L.creativeDesc} />
            <div className="bg-[#151515] p-6 md:p-10 rounded-[40px] border-4 border-white space-y-6 shadow-xl text-left font-black">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {cats.map(cat => (
                  <button key={cat} onClick={() => setPostCategory(cat)} className={`px-5 py-2.5 rounded-full text-[10px] md:text-sm font-black border-2 transition-all ${postCategory === cat ? 'bg-white text-black border-[#daa520]' : 'border-white text-white'}`}>{cat}</button>
                ))}
              </div>
              <div className="space-y-4">
                <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="제목을 입력하십시오 (WHITE)" className="w-full bg-black border-4 border-white p-5 rounded-2xl text-base md:text-xl text-white outline-none focus:border-[#daa520] placeholder:text-white" />
                <textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="상세 내용을 기록하십시오 (WHITE)" className="w-full bg-black border-4 border-white p-5 rounded-2xl text-[12px] md:text-base text-white h-28 outline-none font-bold placeholder:text-white" />
              </div>
              <div className="flex gap-4">
                <button onClick={handlePost} className="flex-[2] bg-[#daa520] text-black py-5 md:py-7 rounded-2xl md:rounded-[40px] text-lg md:text-2xl border-4 border-white uppercase font-black shadow-xl active:scale-95">{L.post} (10)</button>
                <button className="flex-1 bg-white text-black py-5 md:py-7 rounded-2xl md:rounded-[40px] text-sm md:text-lg border-4 border-[#daa520] uppercase font-black leading-tight shadow-xl">🚩 FAN ROOM</button>
              </div>
            </div>

            {/* 04. MARKET (Complete Integration) */}
            <SectionHeader num="04" title={L.market} desc={L.marketDesc} />
            
            {/* [복구] 판매 게시 박스 */}
            <div className="bg-[#151515] p-6 md:p-10 rounded-[40px] border-4 border-[#daa520] space-y-6 mb-6 shadow-2xl text-left font-black animate-in fade-in">
              <h3 className="text-white text-sm md:text-2xl uppercase italic font-black border-l-4 border-[#daa520] pl-3 font-sans leading-none">Register New Goods</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input value={sellName} onChange={(e) => setSellName(e.target.value)} placeholder="상품명을 입력하십시오" className="w-full bg-black border-4 border-white p-5 rounded-2xl text-base md:text-xl text-white outline-none focus:border-[#daa520] placeholder:text-white" />
                <input type="number" value={sellPrice} onChange={(e) => setSellPrice(e.target.value)} placeholder="가격 (BEOM)" className="w-full bg-black border-4 border-white p-5 rounded-2xl text-base md:text-xl text-[#daa520] outline-none placeholder:text-[#daa520]" />
              </div>
              <input value={sellImg} onChange={(e) => setSellImg(e.target.value)} placeholder="제품 이미지 URL 링크를 입력하십시오" className="w-full bg-black border-4 border-white p-5 rounded-2xl text-[12px] md:text-base text-white outline-none placeholder:text-white" />
              <button onClick={() => {
                if(!sellName || !sellPrice) return alert("필수 항목을 모두 채워주십시오.");
                const ng: Good = { id: Date.now(), name: sellName, price: Number(sellPrice), img: sellImg || "/beom-token.png", reviews: [] };
                setGoods([ng, ...goods]); setBeomToken(p=>p-20); setSellName(''); setSellPrice(''); setSellImg('');
                alert("Listed Successfully");
              }} className="w-full bg-[#daa520] text-black py-5 md:py-8 rounded-2xl md:rounded-[40px] text-lg md:text-2xl border-4 border-white uppercase font-black shadow-xl active:scale-95">{L.register} (20)</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 font-black text-left items-start">
              {/* 상품 리스트 */}
              <div className="space-y-4">
                <h3 className="text-white text-xs md:text-lg uppercase border-b-2 border-white pb-1 italic font-black tracking-widest pl-2">GOODS LIST</h3>
                {goods.map(g => (
                  <div key={g.id} className="bg-[#111] p-6 md:p-8 rounded-[40px] border-4 border-white shadow-lg text-center group transition-all hover:border-[#daa520]">
                    <img src={g.img} className="w-full h-40 md:h-64 object-contain bg-black rounded-[30px] border-2 border-white mb-6 shadow-inner transition-transform group-hover:scale-105" alt="G" />
                    <h4 className="text-white text-lg md:text-2xl uppercase mb-1 font-black leading-tight">{g.name}</h4>
                    <p className="text-[#daa520] text-2xl md:text-5xl mb-6 font-black tracking-tighter leading-none">{g.price.toLocaleString()} <span className="text-sm md:text-2xl">BEOM</span></p>
                    <button className="w-full py-4 md:py-6 bg-white text-black rounded-2xl md:rounded-[40px] text-sm md:text-xl border-4 border-[#daa520] uppercase font-black active:scale-95 shadow-md">Buy Now</button>
                  </div>
                ))}
              </div>

              {/* [복구] 구매 후기 게시판 */}
              <div className="space-y-4">
                <h3 className="text-white text-xs md:text-lg uppercase border-b-2 border-white pb-1 italic font-black tracking-widest pl-2">REVIEWS</h3>
                <div className="space-y-4">
                  {goods[0]?.reviews.map(r => (
                    <div key={r.id} className="bg-black/80 p-5 md:p-8 rounded-[35px] border-4 border-white shadow-inner transition-all hover:border-[#daa520] font-black">
                      <p className="text-white text-xs md:text-xl italic font-sans mb-4 leading-relaxed font-bold">"{r.text}"</p>
                      <div className="flex justify-between items-center text-[10px] md:text-sm font-mono text-[#daa520] font-black uppercase tracking-widest">
                        <span>- {r.user}</span>
                        <span className="text-white">{r.time}</span>
                      </div>
                    </div>
                  ))}
                  <button className="w-full py-6 md:py-10 border-4 border-dashed border-white rounded-2xl md:rounded-[40px] text-xs md:text-lg text-white uppercase font-black hover:border-[#daa520] hover:text-[#daa520] transition-all font-sans shadow-md">Write Review</button>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* --- [하단 네비게이션: 콘텐츠 침범 원천 차단] --- */}
      <div className="fixed bottom-6 left-4 right-4 max-w-6xl mx-auto bg-black border-4 border-white p-1.5 rounded-[30px] flex justify-between gap-1 z-[200] shadow-[0_0_80px_rgba(255,255,255,0.2)] backdrop-blur-3xl font-black">
        {['KEDHEON', 'CIVIL', 'NEXUS', 'VENDOR'].map(app => (
          <button key={app} className={`flex-1 py-4 md:py-8 rounded-[25px] text-[10px] md:text-2xl transition-all font-black text-center ${app === 'KEDHEON' ? 'bg-[#daa520] text-black border-2 border-white shadow-inner scale-100' : 'text-white hover:bg-white/10'}`}>{app}</button>
        ))}
      </div>

      <div className="mt-20 opacity-50 text-white text-[10px] md:text-xl tracking-[1.5em] uppercase pb-20 font-sans font-black text-center">
        Kedheon master | V92.0 Complete | @Ohsangjo
      </div>
    </div>
  );
}
