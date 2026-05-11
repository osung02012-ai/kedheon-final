'use client';
import React, { useState, useEffect, useRef, useMemo } from 'react';

/** * [KEDHEON MASTER V109.0 - THE FINAL LEGACY]
 * -----------------------------------------------------------
 * 주군(Lord) 오상조의 제국을 위한 무삭제 전체 코드
 * 1. 테마: Pure White / Black / Red (#DC2626)
 * 2. 복구율: ROOKIE 8단계 + PIONEER 01~05 섹션 100% 통합
 * 3. 기능: 앱 다운로드, BEOM 환전, QR 인증, 커뮤니티, 마켓, 파트너십
 * 4. 인프라: 88쓰레드 / Node 18.02 / Protocol V23 완벽 싱크
 * -----------------------------------------------------------
 */

const PI_INVITE_CODE = 'ohsangjo';

const DICT = {
  KR: {
    rookie: "ROOKIE", pioneer: "PIONEER", exchange: "EXCHANGE", auth: "SECURE AUTH", creative: "CREATIVE & FAN", market: "MARKET", partnership: "PARTNERSHIP",
    invitation: "Web3 초대합니다.", procedure: "파이코인 가입절차 안내", assets: "ASSETS", activate: "보안 QR 활성화",
    convert: "1 PI 환전", post: "피드 등록", buy: "구매하기", register: "상품 등록", submit: "제안서 제출", download: "공식 앱 다운로드",
    exchangeDesc: "채굴 기여도를 BEOM으로 즉시 전환하십시오.",
    authDesc: "개인/비즈니스 보안 QR코드를 발급받으십시오.",
    creativeDesc: "창작물과 팬심을 공유하고 호응을 이끌어내십시오.",
    fanRoomDesc: "🚩 팬룸 개설(500 BEOM): 90% 수익 환원 및 거버넌스 권한 부여.",
    marketDesc: "다양한 GOODS를 거래하고 가치를 확인하십시오.",
    partnershipDesc: "제국과 미래를 함께할 기업 파트너를 기다립니다.",
    steps: [
      { t: "애플리케이션 설치", d: "[Pi Network] 공식 앱을 설치하십시오.", link: "https://minepi.com/#download" },
      { t: "가입 방식 선택", d: "[Continue with phone number] 가입." },
      { t: "국가 및 번호 설정", d: "[+82(South Korea)] 및 번호 입력." },
      { t: "보안 비밀번호 생성", d: "영문 대/소문자와 숫자를 조합하십시오." },
      { t: "실명 프로필 작성", d: "여권 영문 실명 및 고유 ID 설정." },
      { t: "초대 코드 입력", d: `초대 코드 [ ${PI_INVITE_CODE} ] 입력.` },
      { t: "비밀구절 수기 보관", d: "24개 단어는 반드시 종이에 기록하십시오." },
      { t: "채굴 버튼 활성화", d: "번개 버튼을 눌러 활동을 시작하십시오." }
    ]
  },
  EN: {
    rookie: "ROOKIE", pioneer: "PIONEER", exchange: "EXCHANGE", auth: "SECURE AUTH", creative: "CREATIVE & FAN", market: "MARKET", partnership: "PARTNERSHIP",
    invitation: "Web3 Invitation.", procedure: "Join Guide", assets: "ASSETS", activate: "ACTIVATE QR",
    convert: "CONVERT 1 PI", post: "POST FEED", buy: "BUY NOW", register: "REGISTER", submit: "SUBMIT PROPOSAL", download: "DOWNLOAD APP",
    exchangeDesc: "Convert mining efforts into BEOM tokens.",
    authDesc: "Issue secure QR codes for authentication.",
    creativeDesc: "Share creations to earn community support.",
    fanRoomDesc: "🚩 FAN ROOM (500 BEOM): 90% revenue & governance.",
    marketDesc: "Trade unique goods with verified reviews.",
    partnershipDesc: "Join the empire as a strategic business partner.",
    steps: [
      { t: "Install App", d: "Download [Pi Network] app.", link: "https://minepi.com/#download" },
      { t: "Select Method", d: "Choose [Continue with phone number]." },
      { t: "Region Config", d: "Set to [+82(South Korea)]." },
      { t: "Password", d: "Create a strong password." },
      { t: "Real Identity", d: "Enter Passport name & ID." },
      { t: "Invitation", d: `Use code [ ${PI_INVITE_CODE} ].` },
      { t: "Passphrase", d: "Hand-write 24 words safely." },
      { t: "Mining", d: "Engage the lightning button." }
    ]
  }
};

const SectionHeader = ({ num, title, desc }) => (
  <div className="w-full border-t-4 border-[#dc2626] pt-6 mb-4 text-left">
    <h2 className="text-black text-2xl md:text-4xl font-black uppercase italic mb-1 border-l-[12px] border-black pl-4 tracking-tighter shadow-sm">
      {num}. {title}
    </h2>
    <p className="text-gray-400 text-xs md:text-lg font-bold pl-8 italic leading-none">{desc}</p>
  </div>
);

export default function KedheonEmpireFinalMaster() {
  const [hasMounted, setHasMounted] = useState(false);
  const [lang, setLang] = useState('KR');
  const [tab, setTab] = useState('PIONEER');
  
  // -- GLOBAL STATES (ECONOMIC) --
  const [beomToken, setBeomToken] = useState(7891.88);
  const [totalRevenue, setTotalRevenue] = useState(188500);
  const [netIncome, setNetIncome] = useState(72300);

  // -- PIONEER SECTIONS STATES --
  const [qrType, setQrType] = useState('PERSONAL');
  const [bizName, setBizName] = useState('');
  const [isQrActive, setIsQrActive] = useState(false);
  const [boardType, setBoardType] = useState('CREATIVE');
  const [postCategory, setPostCategory] = useState('TECH');
  const [fanRooms, setFanRooms] = useState(['케데헌', '헌트릭스', '파이Nexus']);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newUrl, setNewUrl] = useState('');

  // -- MARKET SECTIONS STATES --
  const [sellName, setSellName] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [sellDesc, setSellDesc] = useState('');
  const [sellImg, setSellImg] = useState(''); 
  const [goods, setGoods] = useState([
    { id: 1, name: "GOLD BADGE", price: 1000, img: "/beom-token.png", desc: "제국 시민의 명예로운 문장입니다." },
    { id: 2, name: "V23 NODE KEY", price: 5000, img: "/node-icon.png", desc: "88쓰레드 노드 모니터링 보안 키" },
    { id: 3, name: "PI PAPA DOMAIN", price: 100000, img: "/domain-icon.png", desc: "전략적 비축 자산 도메인" }
  ]);

  // -- PARTNERSHIP STATES --
  const [partnerCorp, setPartnerCorp] = useState('');
  const [partnerContact, setPartnerContact] = useState('');
  const [partnerMsg, setPartnerMsg] = useState('');

  const fileInputRef = useRef(null);
  const L = DICT[lang];
  const standardCats = ['MUSIC', 'TECH', 'ART', 'FOOD', 'TRAVEL', 'GAME', 'NEWS', 'MOVIE'];

  // -- CALCULATION LOGIC (THE EMPIRE'S MATH) --
  const currentBeomValue = useMemo(() => (0.18 * 100) + (5000 * 0.01) + 1, []);
  const redistributionAmount = useMemo(() => 
    Math.max(totalRevenue * 0.03, netIncome * 0.08), 
    [totalRevenue, netIncome]
  );

  useEffect(() => {
    setHasMounted(true);
    const saved = localStorage.getItem('KEDHEON_MASTER_V109');
    if (saved) {
      try {
        const p = JSON.parse(saved);
        if (p.beomToken) setBeomToken(p.beomToken);
        if (p.fanRooms) setFanRooms(p.fanRooms);
        if (p.lang) setLang(p.lang);
      } catch (e) { console.error("Data Sync Failure", e); }
    }
  }, []);

  useEffect(() => {
    if (hasMounted) {
      localStorage.setItem('KEDHEON_MASTER_V109', JSON.stringify({ beomToken, lang, fanRooms }));
    }
  }, [beomToken, lang, fanRooms, hasMounted]);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSellImg(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleRegisterGoods = () => {
    if(!sellName || !sellPrice || !sellImg) return alert("상품 정보를 모두 입력하십시오.");
    const newItem = {
      id: Date.now(),
      name: sellName,
      price: Number(sellPrice),
      img: sellImg,
      desc: sellDesc
    };
    setGoods([newItem, ...goods]);
    setSellName(''); setSellPrice(''); setSellDesc(''); setSellImg('');
    alert("제국 마켓에 성공적으로 등록되었습니다.");
  };

  if (!hasMounted) return <div className="bg-white min-h-screen" />;

  return (
    <div className="flex flex-col items-center bg-white min-h-screen text-black font-sans w-full pb-80 font-black overflow-x-hidden selection:bg-red-50">
      
      {/* 🧭 GLOBAL TOP NAVIGATION */}
      <nav className="w-full max-w-7xl flex justify-between items-center px-4 py-4 sticky top-0 bg-white/95 backdrop-blur-md z-[250] border-b-4 border-black/5 shadow-sm">
        <div className="flex items-center gap-4">
          <img src="/kedheon-character.png" className="w-12 h-12 rounded-2xl border-2 border-black shadow-md" alt="Logo" />
          <div className="text-left leading-tight">
            <h1 className="text-black text-lg md:text-2xl font-black italic uppercase tracking-tighter">Kedheon</h1>
            <span className="text-gray-400 text-[9px] md:text-xs font-mono font-bold uppercase tracking-widest">V109.0 MASTER LEGACY</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4 font-black">
          <div className="flex bg-gray-100 rounded-xl p-1 border-2 border-black/5 shadow-inner">
            <button onClick={() => setLang('KR')} className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-black transition-all ${lang === 'KR' ? 'bg-black text-white shadow-md' : 'text-gray-400 hover:text-black'}`}>KR</button>
            <button onClick={() => setLang('EN')} className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-black transition-all ${lang === 'EN' ? 'bg-black text-white shadow-md' : 'text-gray-400 hover:text-black'}`}>EN</button>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setTab('ROOKIE')} className={`px-4 py-2 rounded-xl text-xs md:text-base font-black border-4 transition-all duration-300 ${tab === 'ROOKIE' ? 'bg-[#dc2626] text-white border-[#dc2626] shadow-xl scale-110' : 'border-black/5 text-gray-400 hover:text-black'}`}>{L.rookie}</button>
            <button onClick={() => setTab('PIONEER')} className={`px-4 py-2 rounded-xl text-xs md:text-base font-black border-4 transition-all duration-300 ${tab === 'PIONEER' ? 'bg-black text-white border-black shadow-xl scale-110' : 'border-black/5 text-gray-400 hover:text-black'}`}>{L.pioneer}</button>
          </div>
        </div>
      </nav>

      <main className="w-full max-w-6xl px-4 py-8">
        
        {/* ============================================================
            TAB 01: ROOKIE (GAIP & ONBOARDING)
            ============================================================ */}
        {tab === 'ROOKIE' ? (
          <div className="flex flex-col gap-8 text-left animate-in fade-in slide-in-from-top-6 duration-700">
            <div className="flex flex-col items-center text-center gap-6 py-16 bg-gray-50 rounded-[50px] border-2 border-black/5 relative shadow-inner overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-[#dc2626] animate-pulse"></div>
              <img src="/kedheon-character.png" className="w-32 h-32 md:w-56 md:h-56 rounded-[40px] border-4 border-black shadow-2xl transition-all hover:rotate-6 hover:scale-105" alt="Master Kedheon" />
              <div className="px-6">
                <h1 className="text-black text-3xl md:text-7xl uppercase mb-2 font-black tracking-tighter">{L.invitation}</h1>
                <p className="text-[#dc2626] text-base md:text-4xl uppercase tracking-[0.3em] border-b-8 border-[#dc2626] pb-2 inline-block font-black italic shadow-sm">{L.procedure}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {L.steps.map((step, i) => (
                <div key={i} className={`p-8 bg-white rounded-[35px] border-4 flex items-center gap-8 transition-all duration-500 ${i === 0 ? 'border-[#dc2626] bg-red-50/5 shadow-2xl scale-[1.03] z-10' : 'border-black/5 hover:border-black/20 opacity-95 hover:opacity-100'}`}>
                  <span className={`text-4xl md:text-7xl font-black italic ${i === 0 ? 'text-[#dc2626]' : 'text-black opacity-10'}`}>0{i+1}</span>
                  <div className="flex-1">
                    <h3 className="text-black text-lg md:text-4xl font-black uppercase italic mb-2 tracking-tighter">{step.t}</h3>
                    <p className="text-gray-600 text-xs md:text-2xl font-bold leading-tight tracking-tight">{step.d}</p>
                    {/* [강조] 공식 다운로드 버튼 - 1단계 고정 */}
                    {step.link && (
                      <button 
                        onClick={() => window.open(step.link, '_blank')} 
                        className="mt-6 bg-[#dc2626] text-white px-10 py-4 rounded-3xl text-sm md:text-2xl font-black uppercase hover:bg-black transition-all shadow-[0_15px_30px_rgba(220,38,38,0.4)] flex items-center gap-4 animate-bounce"
                      >
                        <span className="text-2xl md:text-4xl">↓</span> {L.download}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-12 bg-black text-white rounded-[45px] text-center shadow-2xl border-8 border-black group transition-all hover:bg-[#111]">
              <p className="text-sm md:text-3xl font-black italic uppercase tracking-[0.4em] text-gray-500 group-hover:text-[#dc2626] transition-colors mb-4">Your Portal Access Code</p>
              <div className="text-[#dc2626] text-6xl md:text-[11rem] font-black tracking-[0.1em] drop-shadow-[0_10px_20px_rgba(220,38,38,0.5)] active:scale-95 transition-transform cursor-pointer select-all" onClick={() => {navigator.clipboard.writeText(PI_INVITE_CODE); alert("초대 코드가 복사되었습니다!");}}>
                {PI_INVITE_CODE}
              </div>
              <p className="text-gray-500 text-xs md:text-xl font-bold mt-4 uppercase">Click to Copy / 클릭하여 복사</p>
            </div>
          </div>
        ) : (
          /* ============================================================
             TAB 02: PIONEER (EMPIRE ECONOMIC DASHBOARD)
             ============================================================ */
          <div className="flex flex-col gap-14 py-4 text-left animate-in slide-in-from-bottom-10 duration-700">
            
            {/* 00. ASSET COMMAND CENTER */}
            <div className="bg-gray-50 p-8 md:p-20 rounded-[60px] border-4 border-black shadow-[0_40px_80px_-15px_rgba(0,0,0,0.3)] flex flex-col md:flex-row justify-between items-center relative overflow-hidden group">
                <div className="absolute -top-20 -left-20 p-4 opacity-5 pointer-events-none select-none rotate-12">
                  <h1 className="text-[20rem] font-black italic uppercase">BEOM</h1>
                </div>
                <div className="text-left z-10 space-y-6 w-full md:w-auto font-black">
                  <h3 className="text-gray-400 text-xs md:text-2xl uppercase tracking-[0.5em] font-black leading-none">{L.assets}</h3>
                  <p className="text-black text-6xl md:text-[14rem] tracking-[ -0.05em] font-black leading-none py-4 drop-shadow-sm">
                    {Math.floor(beomToken).toLocaleString()}
                    <span className="text-2xl md:text-8xl opacity-10">.{beomToken.toFixed(2).split('.')[1]}</span> 
                    <span className="ml-4 text-xl md:text-8xl italic uppercase text-[#dc2626]">BEOM</span>
                  </p>
                  <div className="flex flex-wrap gap-4 pt-4 font-black">
                    <div className="bg-black text-white px-8 py-4 rounded-2xl text-xs md:text-3xl font-mono font-bold border-4 border-white/10 shadow-2xl">Value Index: {currentBeomValue.toFixed(2)} / PI</div>
                    <div className="bg-[#dc2626] text-white px-8 py-4 rounded-2xl text-xs md:text-3xl font-mono font-bold animate-pulse shadow-2xl border-4 border-white/10">Social Redistribution: {redistributionAmount.toLocaleString()}</div>
                  </div>
                </div>
                <img src="/beom-token.png" className="w-32 h-32 md:w-80 md:h-80 object-contain group-hover:scale-125 group-hover:rotate-[360deg] transition-all duration-[2000ms] mt-8 md:mt-0 drop-shadow-[0_20px_40px_rgba(0,0,0,0.4)]" alt="Asset Icon" />
            </div>

            {/* 01. EXCHANGE TERMINAL (v23) */}
            <SectionHeader num="01" title={L.exchange} desc={L.exchangeDesc} />
            <div className="bg-white p-8 md:p-20 rounded-[45px] border-8 border-black flex flex-col md:flex-row justify-between items-center shadow-2xl gap-8 hover:bg-gray-50 transition-all group">
              <div className="text-left leading-tight font-black w-full md:w-auto">
                <p className="text-black text-3xl md:text-7xl font-black italic uppercase leading-none mb-4 group-hover:text-[#dc2626] transition-colors">Economic Bridge</p>
                <div className="flex items-center gap-5">
                  <span className="w-5 h-5 bg-green-500 rounded-full animate-ping"></span>
                  <p className="text-gray-400 text-sm md:text-3xl font-bold uppercase tracking-[0.2em]">Current Rate: 1 Pi = 100 BEOM</p>
                </div>
              </div>
              <button 
                onClick={() => {setBeomToken(p=>p+100); setTotalRevenue(p=>p+100); alert("[성공] 기여도가 BEOM 자산으로 전환되었습니다.");}} 
                className="w-full md:w-auto bg-black text-white px-14 py-8 md:px-28 md:py-14 rounded-[35px] text-lg md:text-5xl border-8 border-black active:scale-90 uppercase font-black shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] hover:bg-[#dc2626] transition-all"
              >
                {L.convert}
              </button>
            </div>

            {/* 02. SECURE AUTH MODULE */}
            <SectionHeader num="02" title={L.auth} desc={L.authDesc} />
            <div className="bg-gray-50 p-8 md:p-20 rounded-[50px] border-4 border-black/5 flex flex-col items-center gap-10 shadow-inner">
              <div className="flex gap-4 w-full max-w-2xl bg-white p-2 rounded-3xl border-4 border-black font-black shadow-lg">
                <button onClick={() => { setQrType('PERSONAL'); setIsQrActive(false); }} className={`flex-1 py-6 rounded-2xl text-sm md:text-3xl font-black transition-all ${qrType === 'PERSONAL' ? 'bg-black text-white shadow-xl' : 'text-gray-300 hover:text-black'}`}>PERSONAL</button>
                <button onClick={() => { setQrType('BUSINESS'); setIsQrActive(false); }} className={`flex-1 py-6 rounded-2xl text-sm md:text-3xl font-black transition-all ${qrType === 'BUSINESS' ? 'bg-black text-white shadow-xl' : 'text-gray-300 hover:text-black'}`}>BUSINESS</button>
              </div>
              
              {qrType === 'BUSINESS' && (
                 <input 
                   value={bizName} 
                   onChange={(e) => setBizName(e.target.value.toUpperCase())} 
                   placeholder="ENTER ENTERPRISE NAME" 
                   className="w-full max-w-2xl bg-white border-[6px] border-black p-8 rounded-3xl text-center text-black text-xl md:text-5xl font-black outline-none focus:border-[#dc2626] shadow-2xl transition-all" 
                 />
              )}

              <div className={`relative bg-white border-[12px] rounded-[60px] flex items-center justify-center transition-all duration-1000 shadow-2xl ${qrType === 'PERSONAL' ? 'w-64 h-64 md:w-[32rem] md:h-[32rem]' : 'w-full max-w-5xl aspect-video'} ${isQrActive ? 'border-[#dc2626] opacity-100 scale-100' : 'opacity-10 border-black/10 scale-90 blur-[2px]'}`}>
                {isQrActive ? (
                  <div className="flex flex-col items-center p-10 gap-6">
                    <img src={qrType === 'PERSONAL' ? "/qr-personal.png" : "/qr-business.png"} className="h-full object-contain drop-shadow-2xl animate-in zoom-in" alt="QR Code" />
                    <p className="text-black text-sm md:text-3xl font-black italic tracking-[0.3em] uppercase bg-gray-100 px-10 py-3 rounded-full shadow-inner">{bizName || "AUTHENTICATED"}</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <p className="text-black text-4xl md:text-[10rem] font-black uppercase italic tracking-[0.3em] animate-pulse">Encrypted</p>
                    <p className="text-gray-400 text-xs md:text-2xl font-bold mt-4 tracking-widest">PROTOCOL V23 SECURITY ENGINE</p>
                  </div>
                )}
              </div>
              <button 
                onClick={() => {if(beomToken < 50) return alert("자산이 부족합니다 (50 BEOM 필요)"); setBeomToken(p=>p-50); setIsQrActive(true);}} 
                className="w-full max-w-3xl bg-black text-white py-8 md:py-16 rounded-[40px] text-lg md:text-5xl border-8 border-black active:scale-95 uppercase font-black shadow-2xl hover:bg-[#dc2626] transition-all"
              >
                {L.activate} (50 BEOM)
              </button>
            </div>

            {/* 03. CREATIVE & FAN MODULE */}
            <SectionHeader num="03" title={L.creative} desc={L.creativeDesc} />
            <div className="bg-white p-8 md:p-20 rounded-[55px] border-[6px] border-black/10 space-y-10 text-left shadow-2xl font-black">
              <div className="flex gap-12 border-b-8 border-gray-100 pb-6 font-black">
                 <button onClick={() => setBoardType('CREATIVE')} className={`text-xl md:text-5xl uppercase font-black italic transition-all ${boardType === 'CREATIVE' ? 'text-black border-b-[10px] border-black pb-2' : 'text-gray-300 hover:text-gray-500'}`}>Creative Hub</button>
                 <button onClick={() => setBoardType('FAN')} className={`text-xl md:text-5xl uppercase font-black italic transition-all ${boardType === 'FAN' ? 'text-black border-b-[10px] border-black pb-2' : 'text-gray-300 hover:text-gray-500'}`}>Fan Spirit</button>
              </div>

              <div className="space-y-6">
                 <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide font-black">
                    {standardCats.map(cat => (
                      <button key={cat} onClick={() => setPostCategory(cat)} className={`px-8 py-3 rounded-2xl text-xs md:text-2xl font-black border-4 transition-all whitespace-nowrap ${postCategory === cat ? 'bg-black text-white border-black shadow-xl scale-110' : 'border-black/5 text-gray-400 hover:border-black/20'}`}>{cat}</button>
                    ))}
                 </div>
                 <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide border-t-4 border-gray-50 pt-8 font-black">
                   {fanRooms.map(room => (
                     <button key={room} onClick={() => setPostCategory(room)} className={`px-8 py-3 rounded-2xl text-xs md:text-2xl font-black border-4 transition-all whitespace-nowrap ${postCategory === room ? 'bg-[#dc2626] text-white border-[#dc2626] shadow-xl scale-110' : 'border-red-50 text-[#dc2626] hover:bg-red-50'}`}>🚩 {room}</button>
                   ))}
                   <button onClick={() => {const n = prompt("새로운 팬룸 명칭:"); if(n) setFanRooms(p=>[...p, n]);}} className="px-8 py-3 rounded-2xl text-xs md:text-2xl font-black border-4 border-dashed border-gray-300 text-gray-300 hover:border-black hover:text-black transition-all">+</button>
                 </div>
              </div>
              
              <div className="space-y-4 font-black pt-4">
                <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="공유할 제목 또는 강렬한 팬심 메시지" className="w-full bg-gray-50 border-[6px] border-black/5 p-8 rounded-3xl text-xl md:text-4xl text-black outline-none focus:border-black font-black shadow-inner" />
                <input value={newUrl} onChange={(e) => setNewUrl(e.target.value)} placeholder="이미지 또는 영상 URL 링크 (선택)" className="w-full bg-gray-50 border-[6px] border-black/5 p-8 rounded-3xl text-sm md:text-2xl text-[#dc2626] outline-none focus:border-[#dc2626] shadow-inner" />
                <textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="상세 내용을 기록하여 제국 발전에 공헌하십시오." className="w-full bg-gray-50 border-[6px] border-black/5 p-8 rounded-3xl text-sm md:text-3xl text-black h-60 outline-none focus:border-black font-bold shadow-inner" />
              </div>
              
              <div className="flex gap-4 font-black">
                  <button onClick={() => {if(!newTitle) return alert("내용을 입력하십시오."); setBeomToken(p=>p-10); alert("제국 피드에 영구 기록되었습니다."); setNewTitle(''); setNewDesc(''); setNewUrl('');}} className="flex-[3] bg-black text-white py-8 md:py-16 rounded-[40px] text-xl md:text-5xl border-8 border-black active:scale-95 uppercase font-black shadow-2xl hover:bg-[#dc2626] transition-all">{L.post} (10 BEOM)</button>
                  <button onClick={() => alert("팬룸 개설은 별도의 승인 절차가 필요합니다 (500 BEOM 소요).")} className="flex-1 bg-white text-black py-8 md:py-16 rounded-[40px] text-[10px] md:text-2xl border-8 border-black uppercase font-black shadow-lg hover:bg-gray-100 transition-all">🚩 OPEN ROOM</button>
              </div>
              <p className="text-gray-400 text-xs md:text-2xl font-bold bg-gray-50 p-8 rounded-[30px] italic border-l-[16px] border-[#dc2626] leading-snug">※ {L.fanRoomDesc}</p>
            </div>

            {/* 04. MARKET PORTAL MODULE */}
            <SectionHeader num="04" title={L.market} desc={L.marketDesc} />
            <div className="bg-white p-8 md:p-20 rounded-[60px] border-[6px] border-black/10 space-y-10 shadow-2xl text-left font-black">
               <h3 className="text-black text-2xl md:text-5xl font-black uppercase italic border-l-[16px] border-[#dc2626] pl-6 mb-8 leading-none">Register Empire Goods</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs md:text-lg uppercase ml-4 text-gray-400 font-black">Product Name / 상품명</label>
                    <input value={sellName} onChange={(e) => setSellName(e.target.value)} placeholder="ENTER NAME" className="w-full bg-gray-50 border-[6px] border-black/5 p-8 rounded-3xl text-lg md:text-3xl font-black outline-none focus:border-black shadow-inner" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs md:text-lg uppercase ml-4 text-gray-400 font-black">Price (BEOM) / 가격</label>
                    <input type="number" value={sellPrice} onChange={(e) => setSellPrice(e.target.value)} placeholder="0.00" className="w-full bg-gray-50 border-[6px] border-black/5 p-8 rounded-3xl text-lg md:text-3xl font-black text-[#dc2626] outline-none focus:border-[#dc2626] shadow-inner" />
                  </div>
               </div>
               <textarea value={sellDesc} onChange={(e) => setSellDesc(e.target.value)} placeholder="상품의 특징과 가치를 상세히 기술하십시오." className="w-full bg-gray-50 border-[6px] border-black/5 p-8 rounded-3xl text-sm md:text-2xl font-bold h-48 outline-none focus:border-black shadow-inner" />
               <div className="w-full">
                  <input type="file" accept="image/*" onChange={handleImageUpload} ref={fileInputRef} className="hidden" />
                  <button onClick={() => fileInputRef.current?.click()} className="w-full bg-gray-50 border-[6px] border-dashed border-black/10 p-20 rounded-[40px] text-gray-400 text-center hover:border-black hover:text-black transition-all font-black uppercase tracking-[0.3em] text-sm md:text-3xl">
                    {sellImg ? <img src={sellImg} className="h-60 mx-auto rounded-[30px] border-8 border-black shadow-2xl" alt="Preview" /> : "📸 UPLOAD PRODUCT IMAGE"}
                  </button>
               </div>
               <button onClick={handleRegisterGoods} className="w-full bg-black text-white py-10 md:py-20 rounded-[45px] text-xl md:text-6xl border-8 border-black active:scale-95 uppercase font-black shadow-2xl hover:bg-[#dc2626] transition-all">
                  {L.register} (20 BEOM)
               </button>
               
               {/* GOODS LIST GRID (Complex View) */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-16 border-t-8 border-gray-50">
                  {goods.map(g => (
                    <div key={g.id} className="bg-white p-6 md:p-12 rounded-[50px] md:rounded-[70px] border-[6px] border-black/10 shadow-xl flex flex-col group transition-all hover:border-[#dc2626] hover:shadow-[0_40px_80px_-20px_rgba(220,38,38,0.3)]">
                      <div className="w-full aspect-square bg-gray-50 rounded-[40px] md:rounded-[55px] border-4 border-black/5 mb-8 overflow-hidden flex items-center justify-center relative">
                        <div className="absolute top-6 right-6 bg-black text-white px-6 py-2 rounded-full text-xs md:text-xl font-mono font-black shadow-lg">EMPIRE VERIFIED</div>
                        <img src={g.img} className="w-40 h-40 md:w-80 md:h-80 object-contain group-hover:scale-125 transition-transform duration-700" alt="Goods Item" />
                      </div>
                      <h4 className="text-black text-lg md:text-5xl uppercase mb-3 font-black leading-tight line-clamp-1">{g.name}</h4>
                      <p className="text-gray-500 text-xs md:text-2xl mb-8 font-bold leading-tight italic line-clamp-2">"{g.desc}"</p>
                      <div className="mt-auto">
                        <p className="text-black text-3xl md:text-[6rem] mb-10 font-black tracking-tighter leading-none">{g.price.toLocaleString()} <span className="text-sm md:text-4xl uppercase text-[#dc2626]">BEOM</span></p>
                        <button onClick={()=>alert("구매 승인 대기 중...")} className="w-full py-6 md:py-12 bg-black text-white rounded-[30px] md:rounded-[45px] text-sm md:text-4xl border-4 border-black active:scale-95 uppercase font-black shadow-2xl hover:bg-[#dc2626] transition-all">
                          {L.buy}
                        </button>
                      </div>
                    </div>
                  ))}
               </div>
            </div>

            {/* 05. BUSINESS PARTNERSHIP PORTAL */}
            <SectionHeader num="05" title={L.partnership} desc={L.partnershipDesc} />
            <div className="bg-black p-10 md:p-24 rounded-[70px] border-[16px] border-[#dc2626] space-y-12 text-left shadow-[0_50px_100px_-20px_rgba(220,38,38,0.4)] relative overflow-hidden">
                <div className="absolute -top-20 -right-20 opacity-10 pointer-events-none select-none">
                    <img src="/kedheon-character.png" className="w-[40rem] h-[40rem] grayscale" alt="Empire" />
                </div>
                <h3 className="text-white text-3xl md:text-8xl font-black italic uppercase leading-none border-l-[24px] border-[#dc2626] pl-10 z-10 relative shadow-lg">Business Portal</h3>
                <div className="space-y-8 relative z-10 font-black">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <label className="text-[#dc2626] text-xs md:text-2xl font-black uppercase ml-6 tracking-[0.3em]">Company / Group Name</label>
                            <input value={partnerCorp} onChange={(e)=>setPartnerCorp(e.target.value.toUpperCase())} placeholder="예: Pi Global Trade" className="w-full bg-white/5 border-4 border-white/10 p-8 rounded-3xl text-white text-lg md:text-4xl font-black outline-none focus:border-[#dc2626] shadow-inner" />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[#dc2626] text-xs md:text-2xl font-black uppercase ml-6 tracking-[0.3em]">Contact (Email / SNS)</label>
                            <input value={partnerContact} onChange={(e)=>setPartnerContact(e.target.value)} placeholder="contact@empire.com" className="w-full bg-white/5 border-4 border-white/10 p-8 rounded-3xl text-white text-lg md:text-4xl font-black outline-none focus:border-[#dc2626] shadow-inner" />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <label className="text-[#dc2626] text-xs md:text-2xl font-black uppercase ml-6 tracking-[0.3em]">Proposal Details / 제안 내용</label>
                        <textarea value={partnerMsg} onChange={(e)=>setPartnerMsg(e.target.value)} placeholder="제국과 함께할 미래 지향적 비즈니스 모델을 자유롭게 기술하십시오." className="w-full bg-white/5 border-4 border-white/10 p-10 rounded-[40px] text-white text-sm md:text-3xl font-bold h-80 outline-none focus:border-[#dc2626] shadow-inner leading-relaxed" />
                    </div>
                </div>
                <button 
                  onClick={() => {if(!partnerCorp || !partnerMsg) return alert("내용을 채워주십시오."); alert("제안서가 제국 사령부에 접수되었습니다."); setPartnerCorp(''); setPartnerContact(''); setPartnerMsg('');}} 
                  className="w-full bg-[#dc2626] text-white py-10 md:py-20 rounded-[50px] text-xl md:text-6xl border-8 border-[#dc2626] hover:bg-white hover:text-[#dc2626] transition-all font-black shadow-2xl uppercase tracking-[0.2em] active:scale-95"
                >
                    {L.submit}
                </button>
            </div>

            {/* 🛰️ INFRASTRUCTURE MONITORING BAR */}
            <div className="mt-10 py-8 px-10 bg-gray-100 rounded-[35px] flex flex-wrap justify-center md:justify-between items-center gap-8 border-4 border-black/5 shadow-inner">
                <div className="flex items-center gap-4"><div className="w-4 h-4 bg-red-600 rounded-full animate-ping"></div><span className="text-black text-xs md:text-2xl font-mono font-black uppercase italic tracking-tighter">Infrastructure: 88-Threads Dual Xeon Gold</span></div>
                <div className="flex items-center gap-6 font-black uppercase text-[10px] md:text-xl text-gray-500">
                  <span>Node: 18.02 Top-Tier</span>
                  <span className="opacity-20 text-4xl">|</span>
                  <span>Protocol: V23.0 Synchronized</span>
                  <span className="opacity-20 text-4xl">|</span>
                  <span>Authority: @Ohsangjo</span>
                </div>
            </div>

          </div>
        )}
      </main>

      {/* 📱 FOOTER TAB BAR (ULTIMATE NAVIGATION) */}
      <footer className="fixed bottom-8 left-4 right-4 max-w-6xl mx-auto bg-white border-[6px] border-black p-2 rounded-[50px] flex justify-between gap-3 z-[300] shadow-[0_40px_100px_rgba(0,0,0,0.6)] font-black">
        {['KEDHEON', 'CIVIL', 'NEXUS', 'VENDOR'].map(app => (
          <button key={app} className={`flex-1 py-6 md:py-12 rounded-[40px] text-xs md:text-5xl transition-all duration-500 font-black text-center ${app === 'KEDHEON' ? 'bg-black text-white shadow-[inset_0_4px_10px_rgba(255,255,255,0.3)] scale-[1.05]' : 'text-gray-300 hover:bg-gray-100 hover:text-black hover:scale-105'}`}>
            {app}
          </button>
        ))}
      </footer>

      {/* 🐯 EMPIRE COPYRIGHT OVERLAY */}
      <div className="mt-32 opacity-10 text-black text-[12px] md:text-4xl tracking-[2em] uppercase pb-40 font-black text-center select-none pointer-events-none">
        Kedheon master | V109.0 Final Empire | Designed by Beom for Ohsangjo
      </div>
    </div>
  );
}
