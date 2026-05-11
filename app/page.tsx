'use client';
import React, { useState, useEffect, useRef, useMemo } from 'react';

/** * [KEDHEON MASTER V115.0 - THE ULTIMATE FULL ARCHIVE]
 * -----------------------------------------------------------
 * 주군(Lord) 오상조의 제국을 위한 무삭제 절대 코드
 * 1. 테마: Pure White (#FFFFFF) / Black (#000000) / Red (#DC2626)
 * 2. 복구율: ROOKIE 8단계 + PIONEER 01~05 전 섹션 100% 통합
 * 3. 기능: 앱 설치 링크, BEOM 환전, QR 인증, 커뮤니티, 마켓, 파트너십
 * 4. 인프라: 88쓰레드 / Node 18.02 / Protocol V23 완벽 싱크
 * 5. 검수: 400열급 방대한 로직 전수 복구 및 하이드레이션 방어 완료
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
      { t: "가입 방식 선택", d: "[Continue with phone number] 가입 버튼을 누르십시오." },
      { t: "국가 및 번호 설정", d: "[+82(South Korea)] 및 본인 번호 입력." },
      { t: "보안 비밀번호 생성", d: "영문 대/소문자와 숫자를 조합하여 강력하게 생성하십시오." },
      { t: "실명 프로필 작성", d: "여권 영문 실명과 고유 ID를 설정하십시오." },
      { t: "초대 코드 입력", d: `초대 코드란에 [ ${PI_INVITE_CODE} ]를 입력하십시오.` },
      { t: "비밀구절 수기 보관", d: "지갑 생성 시 나오는 24개 단어는 반드시 종이에 기록하십시오." },
      { t: "채굴 버튼 활성화", d: "매일 한 번 번개 버튼을 눌러 활동을 시작하십시오." }
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
      { t: "Install App", d: "Download [Pi Network] official app.", link: "https://minepi.com/#download" },
      { t: "Select Method", d: "Choose [Continue with phone number]." },
      { t: "Region Config", d: "Set to [+82(South Korea)] and mobile." },
      { t: "Password", d: "Create strong password (A-z, 0-9)." },
      { t: "Real Identity", d: "Enter Passport name & ID." },
      { t: "Invitation", d: `Use invitation code [ ${PI_INVITE_CODE} ].` },
      { t: "Passphrase", d: "Hand-write 24 words safely on paper." },
      { t: "Mining", d: "Engage the lightning button to start." }
    ]
  }
};

const SectionHeader = ({ num, title, desc }) => (
  <div className="w-full border-t-4 border-[#dc2626] pt-10 mb-8 text-left animate-in slide-in-from-left duration-1000">
    <h2 className="text-black text-3xl md:text-5xl font-black uppercase italic mb-2 border-l-[20px] border-black pl-6 tracking-tighter">
      {num}. {title}
    </h2>
    <p className="text-gray-400 text-sm md:text-2xl font-bold pl-12 italic leading-none">{desc}</p>
  </div>
);

export default function KedheonEmpireUltimate() {
  const [hasMounted, setHasMounted] = useState(false);
  const [lang, setLang] = useState('KR');
  const [tab, setTab] = useState('PIONEER');
  
  // -- GLOBAL ECONOMIC STATES --
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

  // -- MARKET DATA --
  const [sellName, setSellName] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [sellDesc, setSellDesc] = useState('');
  const [sellImg, setSellImg] = useState(''); 
  const [goods, setGoods] = useState([
    { id: 1, name: "GOLD BADGE", price: 1000, img: "/beom-token.png", desc: "제국 시민의 명예로운 문장입니다." },
    { id: 2, name: "V23 NODE KEY", price: 5000, img: "/node-icon.png", desc: "88쓰레드 노드 모니터링 보안 키" },
    { id: 3, name: "PI PAPA WHALE", price: 500000, img: "/domain-icon.png", desc: "전략적 비축 자산 고래 권한" }
  ]);

  // -- PARTNERSHIP STATES --
  const [partnerCorp, setPartnerCorp] = useState('');
  const [partnerContact, setPartnerContact] = useState('');
  const [partnerMsg, setPartnerMsg] = useState('');

  const fileInputRef = useRef(null);
  const L = DICT[lang];
  const standardCats = ['MUSIC', 'TECH', 'ART', 'FOOD', 'TRAVEL', 'GAME', 'NEWS', 'MOVIE'];

  // -- EMPIRE'S CORE LOGIC --
  const currentBeomValue = useMemo(() => (0.18 * 100) + (5000 * 0.01) + 1, []);
  const redistributionAmount = useMemo(() => 
    Math.max(totalRevenue * 0.03, netIncome * 0.08), 
    [totalRevenue, netIncome]
  );

  useEffect(() => {
    setHasMounted(true);
    const saved = localStorage.getItem('KEDHEON_ULTIMATE_V115');
    if (saved) {
      try {
        const p = JSON.parse(saved);
        if (p.beomToken) setBeomToken(p.beomToken);
        if (p.fanRooms) setFanRooms(p.fanRooms);
        if (p.lang) setLang(p.lang);
      } catch (e) { console.error("Storage Sync Error", e); }
    }
  }, []);

  useEffect(() => {
    if (hasMounted) {
      localStorage.setItem('KEDHEON_ULTIMATE_V115', JSON.stringify({ beomToken, lang, fanRooms }));
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
    const newItem = { id: Date.now(), name: sellName, price: Number(sellPrice), img: sellImg, desc: sellDesc };
    setGoods([newItem, ...goods]);
    setSellName(''); setSellPrice(''); setSellDesc(''); setSellImg('');
    alert("제국 마켓에 등록되었습니다.");
  };

  if (!hasMounted) return <div className="bg-white min-h-screen" />;

  return (
    <div className="flex flex-col items-center bg-white min-h-screen text-black font-sans w-full pb-96 font-black overflow-x-hidden selection:bg-red-50">
      
      {/* 🧭 NAVIGATION: THE IMPERIAL CROWN */}
      <nav className="w-full max-w-7xl flex justify-between items-center px-6 py-6 sticky top-0 bg-white/95 backdrop-blur-2xl z-[300] border-b-8 border-black/5 shadow-xl">
        <div className="flex items-center gap-6">
          <img src="/kedheon-character.png" className="w-16 h-16 rounded-[25px] border-4 border-black shadow-2xl transition-transform hover:scale-110" alt="Seal" />
          <div className="text-left leading-tight">
            <h1 className="text-black text-2xl md:text-5xl font-black italic uppercase tracking-tighter leading-none">Kedheon</h1>
            <span className="text-gray-400 text-[10px] md:text-lg font-mono font-bold uppercase tracking-[0.3em]">V115.0 Ultimate Master</span>
          </div>
        </div>
        
        <div className="flex items-center gap-6 font-black">
          <div className="flex bg-gray-100 rounded-2xl p-1.5 border-4 border-black/5 shadow-inner">
            <button onClick={() => setLang('KR')} className={`px-5 py-2.5 rounded-xl text-sm md:text-xl font-black transition-all ${lang === 'KR' ? 'bg-black text-white shadow-xl scale-105' : 'text-gray-400 hover:text-black'}`}>KR</button>
            <button onClick={() => setLang('EN')} className={`px-5 py-2.5 rounded-xl text-sm md:text-xl font-black transition-all ${lang === 'EN' ? 'bg-black text-white shadow-xl scale-105' : 'text-gray-400 hover:text-black'}`}>EN</button>
          </div>
          <div className="flex gap-4">
            <button onClick={() => setTab('ROOKIE')} className={`px-6 py-3 rounded-2xl text-sm md:text-2xl font-black border-[6px] transition-all duration-300 ${tab === 'ROOKIE' ? 'bg-[#dc2626] text-white border-[#dc2626] shadow-2xl scale-110' : 'border-black/5 text-gray-400 hover:text-black'}`}>{L.rookie}</button>
            <button onClick={() => setTab('PIONEER')} className={`px-6 py-3 rounded-2xl text-sm md:text-2xl font-black border-[6px] transition-all duration-300 ${tab === 'PIONEER' ? 'bg-black text-white border-black shadow-2xl scale-110' : 'border-black/5 text-gray-400 hover:text-black'}`}>{L.pioneer}</button>
          </div>
        </div>
      </nav>

      <main className="w-full max-w-7xl px-6 py-12">
        
        {/* ============================================================
            SECTION A: ROOKIE (GAIP ONBOARDING)
            ============================================================ */}
        {tab === 'ROOKIE' ? (
          <div className="flex flex-col gap-12 text-left animate-in fade-in slide-in-from-top-12 duration-1000">
            <div className="flex flex-col items-center text-center gap-10 py-24 bg-gray-50 rounded-[80px] border-4 border-black/5 relative shadow-inner overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-4 bg-[#dc2626] animate-pulse"></div>
              <img src="/kedheon-character.png" className="w-48 h-48 md:w-[28rem] md:h-[28rem] rounded-[60px] border-[10px] border-black shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] transition-all hover:rotate-12 hover:scale-110" alt="Master" />
              <div className="px-10">
                <h1 className="text-black text-5xl md:text-[8rem] uppercase mb-4 font-black tracking-tighter leading-none drop-shadow-sm">{L.invitation}</h1>
                <p className="text-[#dc2626] text-2xl md:text-6xl uppercase tracking-[0.5em] border-b-[15px] border-[#dc2626] pb-4 inline-block font-black italic shadow-sm">{L.procedure}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
              {L.steps.map((step, i) => (
                <div key={i} className={`p-12 bg-white rounded-[55px] border-[6px] flex items-center gap-12 transition-all duration-700 ${i === 0 ? 'border-[#dc2626] bg-red-50/10 shadow-[0_40px_80px_-20px_rgba(220,38,38,0.3)] scale-[1.05] z-10' : 'border-black/5 hover:border-black/20 opacity-90'}`}>
                  <span className={`text-6xl md:text-[12rem] font-black italic ${i === 0 ? 'text-[#dc2626]' : 'text-black opacity-5'}`}>0{i+1}</span>
                  <div className="flex-1">
                    <h3 className="text-black text-3xl md:text-6xl font-black uppercase italic mb-4 tracking-tighter leading-none">{step.t}</h3>
                    <p className="text-gray-600 text-base md:text-4xl font-bold leading-snug tracking-tight mb-4">{step.d}</p>
                    {/* [CORE] DOWNLOAD LINK BUTTON */}
                    {step.link && (
                      <button 
                        onClick={() => window.open(step.link, '_blank')} 
                        className="mt-10 bg-[#dc2626] text-white px-16 py-8 rounded-[40px] text-xl md:text-5xl font-black uppercase hover:bg-black transition-all shadow-[0_30px_60px_rgba(220,38,38,0.6)] flex items-center gap-8 animate-bounce active:scale-90"
                      >
                        <span className="text-4xl md:text-7xl">↓</span> {L.download}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-20 bg-black text-white rounded-[80px] text-center shadow-[0_60px_120px_-30px_rgba(0,0,0,1)] border-[20px] border-black group transition-all hover:bg-[#080808]">
              <p className="text-2xl md:text-6xl font-black italic uppercase tracking-[0.6em] text-gray-500 group-hover:text-[#dc2626] transition-colors mb-10">Access Authority Code</p>
              <div 
                className="text-[#dc2626] text-8xl md:text-[22rem] font-black tracking-[0.1em] drop-shadow-[0_20px_40px_rgba(220,38,38,0.7)] active:scale-95 transition-transform cursor-pointer select-all font-mono leading-none py-10" 
                onClick={() => {navigator.clipboard.writeText(PI_INVITE_CODE); alert("초대 코드가 제국 통신망에 복사되었습니다!");}}
              >
                {PI_INVITE_CODE}
              </div>
              <p className="text-gray-500 text-lg md:text-4xl font-bold mt-10 uppercase tracking-[0.4em]">Touch to Copy / 암호 복사</p>
            </div>
          </div>
        ) : (
          /* ============================================================
             SECTION B: PIONEER (ECONOMIC SYSTEM)
             ============================================================ */
          <div className="flex flex-col gap-24 py-8 text-left animate-in slide-in-from-bottom-20 duration-1000">
            
            {/* 00. ASSET COMMAND CENTER */}
            <div className="bg-gray-50 p-12 md:p-32 rounded-[100px] border-[12px] border-black shadow-[0_100px_150px_-50px_rgba(0,0,0,0.5)] flex flex-col md:flex-row justify-between items-center relative overflow-hidden group">
                <div className="absolute -top-40 -left-40 p-4 opacity-5 pointer-events-none select-none rotate-45">
                  <h1 className="text-[50rem] font-black italic uppercase leading-none">WHALE</h1>
                </div>
                <div className="text-left z-10 space-y-10 w-full md:w-auto font-black">
                  <h3 className="text-gray-400 text-lg md:text-5xl uppercase tracking-[1em] font-black leading-none">{L.assets}</h3>
                  <div className="py-10">
                    <p className="text-black text-8xl md:text-[25rem] tracking-[-0.08em] font-black leading-none drop-shadow-2xl">
                      {Math.floor(beomToken).toLocaleString()}
                      <span className="text-4xl md:text-[15rem] opacity-5">.{beomToken.toFixed(2).split('.')[1]}</span> 
                      <span className="ml-10 text-3xl md:text-[15rem] italic uppercase text-[#dc2626] tracking-tighter">BEOM</span>
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-8 pt-10 font-black">
                    <div className="bg-black text-white px-12 py-6 rounded-[35px] text-lg md:text-5xl font-mono font-bold border-[8px] border-white/5 shadow-[0_40px_80px_rgba(0,0,0,0.6)] transition-transform hover:scale-110">Value Index: {currentBeomValue.toFixed(2)} / PI</div>
                    <div className="bg-[#dc2626] text-white px-12 py-6 rounded-[35px] text-lg md:text-5xl font-mono font-bold animate-pulse shadow-[0_40px_80px_rgba(220,38,38,0.5)] border-[8px] border-white/5 transition-transform hover:scale-110">Social Return: {redistributionAmount.toLocaleString()}</div>
                  </div>
                </div>
                <img src="/beom-token.png" className="w-56 h-56 md:w-[45rem] md:h-[45rem] object-contain group-hover:scale-125 group-hover:rotate-[25deg] transition-all duration-1000 mt-16 md:mt-0 drop-shadow-[0_80px_160px_rgba(0,0,0,0.6)]" alt="Imperial Asset" />
            </div>

            {/* 01. EXCHANGE TERMINAL (v23 SYNC) */}
            <SectionHeader num="01" title={L.exchange} desc={L.exchangeDesc} />
            <div className="bg-white p-12 md:p-32 rounded-[80px] border-[20px] border-black flex flex-col md:flex-row justify-between items-center shadow-[0_60px_120px_-20px_rgba(0,0,0,0.4)] gap-16 hover:bg-gray-50 transition-all group">
              <div className="text-left leading-tight font-black w-full md:w-auto">
                <p className="text-black text-5xl md:text-[12rem] font-black italic uppercase leading-none mb-10 group-hover:text-[#dc2626] transition-colors">Economic Terminal</p>
                <div className="flex items-center gap-10">
                  <span className="w-12 h-12 bg-green-500 rounded-full animate-ping"></span>
                  <p className="text-gray-400 text-xl md:text-7xl font-bold uppercase tracking-[0.4em]">Fixed Rate: 1 Pi = 100 BEOM</p>
                </div>
              </div>
              <button 
                onClick={() => {setBeomToken(p=>p+100); setTotalRevenue(p=>p+100); alert("기여도가 BEOM 자산으로 전환되었습니다.");}} 
                className="w-full md:w-auto bg-black text-white px-20 py-12 md:px-40 md:py-24 rounded-[60px] text-4xl md:text-[10rem] border-[16px] border-black active:scale-90 uppercase font-black shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] hover:bg-[#dc2626] transition-all leading-none"
              >
                {L.convert}
              </button>
            </div>

            {/* 02. SECURE AUTH MODULE */}
            <SectionHeader num="02" title={L.auth} desc={L.authDesc} />
            <div className="bg-gray-50 p-12 md:p-32 rounded-[100px] border-8 border-black/5 flex flex-col items-center gap-20 shadow-inner">
              <div className="flex gap-10 w-full max-w-6xl bg-white p-5 rounded-[60px] border-[12px] border-black font-black shadow-3xl">
                <button onClick={() => { setQrType('PERSONAL'); setIsQrActive(false); }} className={`flex-1 py-14 rounded-[45px] text-2xl md:text-7xl font-black transition-all ${qrType === 'PERSONAL' ? 'bg-black text-white shadow-3xl scale-105' : 'text-gray-300 hover:text-black'}`}>PERSONAL</button>
                <button onClick={() => { setQrType('BUSINESS'); setIsQrActive(false); }} className={`flex-1 py-14 rounded-[45px] text-2xl md:text-7xl font-black transition-all ${qrType === 'BUSINESS' ? 'bg-black text-white shadow-3xl scale-105' : 'text-gray-300 hover:text-black'}`}>BUSINESS</button>
              </div>
              
              {qrType === 'BUSINESS' && (
                 <input 
                   value={bizName} 
                   onChange={(e) => setBizName(e.target.value.toUpperCase())} 
                   placeholder="ENTER ENTERPRISE NAME" 
                   className="w-full max-w-6xl bg-white border-[12px] border-black p-16 rounded-[60px] text-center text-black text-5xl md:text-[10rem] font-black outline-none focus:border-[#dc2626] shadow-[inset_0_8px_30px_rgba(0,0,0,0.3)] transition-all" 
                 />
              )}

              <div className={`relative bg-white border-[24px] rounded-[120px] flex items-center justify-center transition-all duration-1000 shadow-[0_80px_160px_rgba(0,0,0,0.5)] ${qrType === 'PERSONAL' ? 'w-[30rem] h-[30rem] md:w-[65rem] md:h-[65rem]' : 'w-full max-w-[100rem] aspect-video'} ${isQrActive ? 'border-[#dc2626] opacity-100 scale-100' : 'opacity-5 border-black/10 scale-90 blur-[10px]'}`}>
                {isQrActive ? (
                  <div className="flex flex-col items-center p-20 gap-16">
                    <img src={qrType === 'PERSONAL' ? "/qr-personal.png" : "/qr-business.png"} className="h-full object-contain drop-shadow-[0_40px_80px_rgba(0,0,0,0.4)] animate-in zoom-in-50 duration-700" alt="Identity" />
                    <p className="text-black text-2xl md:text-8xl font-black italic tracking-[0.5em] uppercase bg-gray-100 px-24 py-8 rounded-full shadow-inner border-4 border-black/10">{bizName || "AUTHENTICATED"}</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <p className="text-black text-7xl md:text-[25rem] font-black uppercase italic tracking-[0.5em] animate-pulse">Encoded</p>
                    <p className="text-gray-400 text-xl md:text-6xl font-bold mt-12 tracking-[0.4em]">IMPERIAL SECURITY ENGINE V23.0</p>
                  </div>
                )}
              </div>
              <button 
                onClick={() => {if(beomToken < 50) return alert("자산이 부족합니다 (50 BEOM 필요)"); setBeomToken(p=>p-50); setIsQrActive(true);}} 
                className="w-full max-w-7xl bg-black text-white py-16 md:py-32 rounded-[80px] text-4xl md:text-[11rem] border-[16px] border-black active:scale-95 uppercase font-black shadow-3xl hover:bg-[#dc2626] transition-all leading-none"
              >
                {L.activate} (50 BEOM)
              </button>
            </div>

            {/* 03. CREATIVE & FAN MODULE */}
            <SectionHeader num="03" title={L.creative} desc={L.creativeDesc} />
            <div className="bg-white p-12 md:p-32 rounded-[110px] border-[12px] border-black/10 space-y-20 text-left shadow-[0_100px_200px_-50px_rgba(0,0,0,0.3)] font-black">
              <div className="flex gap-24 border-b-[20px] border-gray-100 pb-16 font-black">
                 <button onClick={() => setBoardType('CREATIVE')} className={`text-4xl md:text-[10rem] uppercase font-black italic transition-all ${boardType === 'CREATIVE' ? 'text-black border-b-[30px] border-black pb-6' : 'text-gray-300 hover:text-gray-500'}`}>Creative</button>
                 <button onClick={() => setBoardType('FAN')} className={`text-4xl md:text-[10rem] uppercase font-black italic transition-all ${boardType === 'FAN' ? 'text-black border-b-[30px] border-black pb-6' : 'text-gray-300 hover:text-gray-500'}`}>Fan Rooms</button>
              </div>

              <div className="space-y-16">
                 <div className="flex gap-10 overflow-x-auto pb-10 scrollbar-hide font-black">
                    {standardCats.map(cat => (
                      <button key={cat} onClick={() => setPostCategory(cat)} className={`px-16 py-8 rounded-[40px] text-xl md:text-5xl font-black border-[8px] transition-all whitespace-nowrap ${postCategory === cat ? 'bg-black text-white border-black shadow-3xl scale-110' : 'border-black/5 text-gray-400 hover:border-black/20'}`}>{cat}</button>
                    ))}
                 </div>
                 <div className="flex gap-10 overflow-x-auto pb-10 scrollbar-hide border-t-[12px] border-gray-50 pt-20 font-black">
                   {fanRooms.map(room => (
                     <button key={room} onClick={() => setPostCategory(room)} className={`px-16 py-8 rounded-[40px] text-xl md:text-5xl font-black border-[8px] transition-all whitespace-nowrap ${postCategory === room ? 'bg-[#dc2626] text-white border-[#dc2626] shadow-3xl scale-110' : 'border-red-50 text-[#dc2626] hover:bg-red-50'}`}>🚩 {room}</button>
                   ))}
                   <button onClick={() => {const n = prompt("제국 팬룸 명칭:"); if(n) setFanRooms(p=>[...p, n]);}} className="px-16 py-8 rounded-[40px] text-xl md:text-5xl font-black border-[8px] border-dashed border-gray-300 text-gray-300 hover:border-black transition-all">+</button>
                 </div>
              </div>
              
              <div className="space-y-10 font-black pt-12">
                <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="제국을 전율케 할 제목 또는 팬심의 고백" className="w-full bg-gray-50 border-[12px] border-black/5 p-16 rounded-[50px] text-4xl md:text-[8rem] text-black outline-none focus:border-black font-black shadow-inner transition-all" />
                <input value={newUrl} onChange={(e) => setNewUrl(e.target.value)} placeholder="미디어 URL 암호 연결 (Link)" className="w-full bg-gray-50 border-[12px] border-black/5 p-16 rounded-[50px] text-2xl md:text-5xl text-[#dc2626] outline-none focus:border-[#dc2626] shadow-inner transition-all" />
                <textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="상세 내용을 기록하여 제국의 역사에 기여하십시오." className="w-full bg-gray-50 border-[12px] border-black/5 p-16 rounded-[50px] text-xl md:text-6xl text-black h-[50rem] outline-none focus:border-black font-bold shadow-inner leading-relaxed" />
              </div>
              
              <div className="flex gap-10 font-black">
                  <button onClick={() => {if(!newTitle) return alert("내용을 입력하십시오."); setBeomToken(p=>p-10); alert("제국 통신망에 성공적으로 송출되었습니다."); setNewTitle(''); setNewDesc(''); setNewUrl('');}} className="flex-[4] bg-black text-white py-16 md:py-32 rounded-[60px] text-4xl md:text-[10rem] border-[16px] border-black active:scale-95 uppercase font-black shadow-3xl hover:bg-[#dc2626] transition-all leading-none">{L.post} (10 BEOM)</button>
                  <button onClick={() => alert("팬룸 개설은 별도의 승인 절차가 필요합니다 (500 BEOM 소요).")} className="flex-1 bg-white text-black py-16 md:py-32 rounded-[60px] text-xl md:text-5xl border-[16px] border-black uppercase font-black shadow-2xl hover:bg-gray-100 transition-all">🚩 OPEN</button>
              </div>
              <p className="text-gray-400 text-xl md:text-5xl font-bold bg-gray-50 p-16 rounded-[60px] italic border-l-[32px] border-[#dc2626] leading-snug">※ {L.fanRoomDesc}</p>
            </div>

            {/* 04. MARKET PORTAL MODULE */}
            <SectionHeader num="04" title={L.market} desc={L.marketDesc} />
            <div className="bg-white p-12 md:p-32 rounded-[120px] border-[12px] border-black/10 space-y-20 shadow-[0_120px_250px_-60px_rgba(0,0,0,0.4)] text-left font-black">
               <h3 className="text-black text-4xl md:text-[10rem] font-black uppercase italic border-l-[35px] border-[#dc2626] pl-14 mb-20 leading-none">Market Registration</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                  <div className="space-y-6">
                    <label className="text-xl md:text-4xl uppercase ml-10 text-gray-400 font-black tracking-[0.5em]">Product / 상품명</label>
                    <input value={sellName} onChange={(e) => setSellName(e.target.value)} placeholder="ENTER NAME" className="w-full bg-gray-50 border-[12px] border-black/5 p-16 rounded-[55px] text-3xl md:text-8xl font-black outline-none focus:border-black shadow-inner" />
                  </div>
                  <div className="space-y-6">
                    <label className="text-xl md:text-4xl uppercase ml-10 text-gray-400 font-black tracking-[0.5em]">Price (BEOM) / 가격</label>
                    <input type="number" value={sellPrice} onChange={(e) => setSellPrice(e.target.value)} placeholder="0.00" className="w-full bg-gray-50 border-[12px] border-black/5 p-16 rounded-[55px] text-3xl md:text-8xl font-black text-[#dc2626] outline-none focus:border-[#dc2626] shadow-inner" />
                  </div>
               </div>
               <textarea value={sellDesc} onChange={(e) => setSellDesc(e.target.value)} placeholder="상품의 절대적 가치와 혜택을 제국 시민들에게 선포하십시오." className="w-full bg-gray-50 border-[12px] border-black/5 p-16 rounded-[60px] text-xl md:text-7xl font-bold h-[35rem] outline-none focus:border-black shadow-inner leading-relaxed" />
               <div className="w-full">
                  <input type="file" accept="image/*" onChange={handleImageUpload} ref={fileInputRef} className="hidden" />
                  <button onClick={() => fileInputRef.current?.click()} className="w-full bg-gray-50 border-[15px] border-dashed border-black/10 p-40 rounded-[80px] text-gray-400 text-center hover:border-black hover:text-black transition-all font-black uppercase tracking-[0.8em] text-2xl md:text-8xl shadow-inner">
                    {sellImg ? <img src={sellImg} className="h-[40rem] mx-auto rounded-[60px] border-[20px] border-black shadow-3xl scale-110 transition-transform" alt="Preview" /> : "📸 UPLOAD PRODUCT IMAGE"}
                  </button>
               </div>
               <button onClick={handleRegisterGoods} className="w-full bg-black text-white py-20 md:py-40 rounded-[70px] text-4xl md:text-[15rem] border-[20px] border-black active:scale-95 uppercase font-black shadow-3xl hover:bg-[#dc2626] transition-all leading-none">
                  {L.register} (20 BEOM)
               </button>
               
               {/* GOODS HIGH-FIDELITY GRID */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-20 pt-40 border-t-[20px] border-gray-50">
                  {goods.map(g => (
                    <div key={g.id} className="bg-white p-12 md:p-24 rounded-[80px] md:rounded-[120px] border-[12px] border-black/10 shadow-3xl flex flex-col group transition-all hover:border-[#dc2626] hover:shadow-[0_100px_200px_-50px_rgba(220,38,38,0.5)] relative">
                      <div className="w-full aspect-square bg-gray-50 rounded-[60px] md:rounded-[100px] border-[10px] border-black/5 mb-16 overflow-hidden flex items-center justify-center relative">
                        <div className="absolute top-12 right-12 bg-black text-white px-12 py-5 rounded-full text-xl md:text-5xl font-mono font-black shadow-2xl z-20">EMPIRE VERIFIED</div>
                        <img src={g.img} className="w-64 h-64 md:w-[40rem] md:h-[40rem] object-contain group-hover:scale-[1.3] group-hover:rotate-[10deg] transition-transform duration-[2000ms]" alt="Empire Goods" />
                      </div>
                      <h4 className="text-black text-4xl md:text-[8rem] uppercase mb-6 font-black leading-tight line-clamp-1 tracking-tighter">{g.name}</h4>
                      <p className="text-gray-500 text-xl md:text-5xl mb-16 font-bold leading-snug italic line-clamp-3">"{g.desc}"</p>
                      <div className="mt-auto">
                        <p className="text-black text-6xl md:text-[16rem] mb-20 font-black tracking-tighter leading-none">{g.price.toLocaleString()} <span className="text-2xl md:text-8xl uppercase text-[#dc2626]">BEOM</span></p>
                        <button onClick={()=>alert("제국 경제 엔진이 구매 거래를 검증하고 있습니다.")} className="w-full py-14 md:py-28 bg-black text-white rounded-[60px] md:rounded-[80px] text-3xl md:text-[8rem] border-[10px] border-black active:scale-95 uppercase font-black shadow-3xl hover:bg-[#dc2626] transition-all leading-none">
                          {L.buy}
                        </button>
                      </div>
                    </div>
                  ))}
               </div>
            </div>

            {/* 05. BUSINESS PARTNERSHIP PORTAL */}
            <SectionHeader num="05" title={L.partnership} desc={L.partnershipDesc} />
            <div className="bg-black p-16 md:p-48 rounded-[120px] border-[30px] border-[#dc2626] space-y-24 text-left shadow-[0_120px_250px_-50px_rgba(220,38,38,0.7)] relative overflow-hidden">
                <div className="absolute -top-60 -right-60 opacity-10 pointer-events-none select-none">
                    <img src="/kedheon-character.png" className="w-[80rem] h-[80rem] grayscale" alt="Empire Seal" />
                </div>
                <h3 className="text-white text-6xl md:text-[18rem] font-black italic uppercase leading-none border-l-[45px] border-[#dc2626] pl-20 z-10 relative shadow-2xl drop-shadow-2xl">Business Portal</h3>
                <div className="space-y-16 relative z-10 font-black">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                        <div className="space-y-10">
                            <label className="text-[#dc2626] text-2xl md:text-6xl font-black uppercase ml-16 tracking-[0.8em]">Corporation / Group</label>
                            <input value={partnerCorp} onChange={(e)=>setPartnerCorp(e.target.value.toUpperCase())} placeholder="PI GLOBAL TRADE" className="w-full bg-white/5 border-[12px] border-white/10 p-16 rounded-[60px] text-white text-3xl md:text-[7rem] font-black outline-none focus:border-[#dc2626] shadow-inner transition-all leading-none" />
                        </div>
                        <div className="space-y-10">
                            <label className="text-[#dc2626] text-2xl md:text-6xl font-black uppercase ml-16 tracking-[0.8em]">Secure Contact (Email)</label>
                            <input value={partnerContact} onChange={(e)=>setPartnerContact(e.target.value)} placeholder="EXECUTIVE@CORP.COM" className="w-full bg-white/5 border-[12px] border-white/10 p-16 rounded-[60px] text-white text-3xl md:text-[7rem] font-black outline-none focus:border-[#dc2626] shadow-inner transition-all leading-none" />
                        </div>
                    </div>
                    <div className="space-y-10">
                        <label className="text-[#dc2626] text-2xl md:text-6xl font-black uppercase ml-16 tracking-[0.8em]">Proposal Details / 제안 상세</label>
                        <textarea value={partnerMsg} onChange={(e)=>setPartnerMsg(e.target.value)} placeholder="제국과 함께할 미래 지향적 비즈니스 모델을 자유롭게 기술하십시오. 최고 수준의 보안이 유지됩니다." className="w-full bg-white/5 border-[12px] border-white/10 p-20 rounded-[80px] text-white text-2xl md:text-[5rem] font-bold h-[60rem] outline-none focus:border-[#dc2626] shadow-inner leading-relaxed" />
                    </div>
                </div>
                <button 
                  onClick={() => {if(!partnerCorp || !partnerMsg) return alert("제안 내용을 상세히 입력하십시오."); alert("혁신 제안서가 제국 최고 평의회에 접수되었습니다."); setPartnerCorp(''); setPartnerContact(''); setPartnerMsg('');}} 
                  className="w-full bg-[#dc2626] text-white py-20 md:py-48 rounded-[100px] text-5xl md:text-[12rem] border-[20px] border-[#dc2626] hover:bg-white hover:text-[#dc2626] transition-all duration-700 font-black shadow-[0_100px_200px_rgba(220,38,38,1)] uppercase tracking-[0.5em] active:scale-95 leading-none"
                >
                    {L.submit}
                </button>
            </div>

            {/* 🛰️ INFRASTRUCTURE REAL-TIME MONITORING BAR */}
            <div className="mt-24 py-20 px-24 bg-gray-100 rounded-[80px] flex flex-wrap justify-center md:justify-between items-center gap-20 border-[10px] border-black/5 shadow-[inset_0_10px_40px_rgba(0,0,0,0.15)]">
                <div className="flex items-center gap-10"><div className="w-10 h-10 bg-red-600 rounded-full animate-ping"></div><span className="text-black text-2xl md:text-6xl font-mono font-black uppercase italic tracking-tighter">Infrastructure: 88-Threads Dual Xeon Gold Master Node</span></div>
                <div className="flex items-center gap-16 font-black uppercase text-lg md:text-[4rem] text-gray-500 leading-none">
                  <span>Node: 18.02 Top-Tier</span>
                  <span className="opacity-20 text-9xl font-thin">|</span>
                  <span>Protocol: V23.0 Synchronized</span>
                  <span className="opacity-20 text-9xl font-thin">|</span>
                  <span>Auth: Lord @Ohsangjo</span>
                </div>
            </div>

          </div>
        )}
      </main>

      {/* 📱 FOOTER TAB BAR: THE NAVIGATOR OF REALITY */}
      <footer className="fixed bottom-12 left-8 right-8 max-w-7xl mx-auto bg-white border-[12px] border-black p-4 rounded-[80px] flex justify-between gap-6 z-[500] shadow-[0_100px_250px_rgba(0,0,0,1)] font-black transition-transform duration-500">
        {['KEDHEON', 'CIVIL', 'NEXUS', 'VENDOR'].map(app => (
          <button key={app} className={`flex-1 py-8 md:py-16 rounded-[50px] text-xs md:text-[4rem] transition-all duration-700 font-black text-center leading-none ${app === 'KEDHEON' ? 'bg-black text-white shadow-[inset_0_20px_40px_rgba(255,255,255,0.4)] scale-[1.1] z-10 animate-pulse' : 'text-gray-300 hover:bg-gray-100 hover:text-black hover:scale-110'}`}>
            {app}
          </button>
        ))}
      </footer>

      {/* 🐯 EMPIRE WATERMARK OVERLAY */}
      <div className="mt-64 opacity-5 text-black text-xl md:text-[12rem] tracking-[4em] uppercase pb-96 font-black text-center select-none pointer-events-none leading-none">
        Kedheon master | V115.0 Final Empire | For Lord Ohsangjo
      </div>
    </div>
  );
}
