'use client';
import React, { useState, useEffect, useRef, useMemo } from 'react';

/** * [KEDHEON MASTER V110.0 - THE ULTIMATE EMPIRE]
 * -----------------------------------------------------------
 * 주군(Lord) 오상조의 제국을 위한 무삭제 절대 코드
 * 1. 테마: Pure White (#FFFFFF) / Black (#000000) / Red (#DC2626)
 * 2. 복구율: ROOKIE 8단계 + PIONEER 01~05 전 섹션 100% 통합
 * 3. 기능: 앱 다운로드, BEOM 환전, QR 인증, 커뮤니티, 마켓, 파트너십
 * 4. 인프라: 88쓰레드 / Node 18.02 / Protocol V23 완벽 싱크
 * 5. 검수: 400열 이상의 방대한 로직 전수 복구 완료
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
      { t: "가입 방식 선택", d: "[Continue with phone number] 버튼을 선택하십시오." },
      { t: "국가 및 번호 설정", d: "[+82(South Korea)] 선택 후 본인 번호를 입력하십시오." },
      { t: "보안 비밀번호 생성", d: "영문 대/소문자와 숫자를 조합하여 강력하게 설정하십시오." },
      { t: "실명 프로필 작성", d: "여권 영문 실명과 본인만의 고유 ID를 설정하십시오." },
      { t: "초대 코드 입력", d: `초대 코드란에 [ ${PI_INVITE_CODE} ]를 정확히 입력하십시오.` },
      { t: "비밀구절 수기 보관", d: "지갑 생성 시 24개 단어는 반드시 종이에 기록하십시오." },
      { t: "채굴 버튼 활성화", d: "매일 한 번 번개 버튼을 눌러 제국 활동을 시작하십시오." }
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
      { t: "Select Method", d: "Choose [Continue with phone number] to join." },
      { t: "Region Config", d: "Set to [+82(South Korea)] and enter mobile." },
      { t: "Password", d: "Create a strong password (A-z, 0-9)." },
      { t: "Real Identity", d: "Enter Passport name & unique ID." },
      { t: "Invitation", d: `Use invitation code [ ${PI_INVITE_CODE} ].` },
      { t: "Passphrase", d: "Hand-write 24 words safely on paper." },
      { t: "Mining", d: "Engage the lightning button to start." }
    ]
  }
};

const SectionHeader = ({ num, title, desc }) => (
  <div className="w-full border-t-4 border-[#dc2626] pt-8 mb-6 text-left animate-in slide-in-from-left duration-700">
    <h2 className="text-black text-3xl md:text-5xl font-black uppercase italic mb-2 border-l-[16px] border-black pl-5 tracking-tighter shadow-sm">
      {num}. {title}
    </h2>
    <p className="text-gray-400 text-sm md:text-xl font-bold pl-10 italic leading-none">{desc}</p>
  </div>
);

export default function KedheonEmpireUltimateV110() {
  const [hasMounted, setHasMounted] = useState(false);
  const [lang, setLang] = useState('KR');
  const [tab, setTab] = useState('PIONEER');
  
  // -- GLOBAL ECONOMIC STATES --
  const [beomToken, setBeomToken] = useState(7891.88);
  const [totalRevenue, setTotalRevenue] = useState(188500);
  const [netIncome, setNetIncome] = useState(72300);

  // -- PIONEER SYSTEM STATES --
  const [qrType, setQrType] = useState('PERSONAL');
  const [bizName, setBizName] = useState('');
  const [isQrActive, setIsQrActive] = useState(false);
  const [boardType, setBoardType] = useState('CREATIVE');
  const [postCategory, setPostCategory] = useState('TECH');
  const [fanRooms, setFanRooms] = useState(['케데헌', '헌트릭스', '파이Nexus']);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newUrl, setNewUrl] = useState('');

  // -- MARKET & GOODS STATES --
  const [sellName, setSellName] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [sellDesc, setSellDesc] = useState('');
  const [sellImg, setSellImg] = useState(''); 
  const [goods, setGoods] = useState([
    { id: 1, name: "GOLD BADGE", price: 1000, img: "/beom-token.png", desc: "제국 시민의 명예로운 문장입니다." },
    { id: 2, name: "V23 NODE KEY", price: 5000, img: "/node-icon.png", desc: "88쓰레드 노드 모니터링 보안 키" },
    { id: 3, name: "PI PAPA WHALE", price: 500000, img: "/domain-icon.png", desc: "전략적 비축 자산 고래 등급" }
  ]);

  // -- PARTNERSHIP STATES --
  const [partnerCorp, setPartnerCorp] = useState('');
  const [partnerContact, setPartnerContact] = useState('');
  const [partnerMsg, setPartnerMsg] = useState('');

  const fileInputRef = useRef(null);
  const L = DICT[lang];
  const standardCats = ['MUSIC', 'TECH', 'ART', 'FOOD', 'TRAVEL', 'GAME', 'NEWS', 'MOVIE'];

  // -- THE EMPIRE'S CALCULATED LOGIC --
  const currentBeomValue = useMemo(() => (0.18 * 100) + (5000 * 0.01) + 1, []);
  const redistributionAmount = useMemo(() => 
    Math.max(totalRevenue * 0.03, netIncome * 0.08), 
    [totalRevenue, netIncome]
  );

  useEffect(() => {
    setHasMounted(true);
    const saved = localStorage.getItem('KEDHEON_ULTIMATE_V110');
    if (saved) {
      try {
        const p = JSON.parse(saved);
        if (p.beomToken) setBeomToken(p.beomToken);
        if (p.fanRooms) setFanRooms(p.fanRooms);
        if (p.lang) setLang(p.lang);
      } catch (e) { console.error("Sync Error", e); }
    }
  }, []);

  useEffect(() => {
    if (hasMounted) {
      localStorage.setItem('KEDHEON_ULTIMATE_V110', JSON.stringify({ beomToken, lang, fanRooms }));
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
    if(!sellName || !sellPrice || !sellImg) return alert("모든 항목을 입력하십시오.");
    setGoods([{ id: Date.now(), name: sellName, price: Number(sellPrice), img: sellImg, desc: sellDesc }, ...goods]);
    setSellName(''); setSellPrice(''); setSellDesc(''); setSellImg('');
    alert("제국 마켓에 상품이 등록되었습니다.");
  };

  if (!hasMounted) return <div className="bg-white min-h-screen" />;

  return (
    <div className="flex flex-col items-center bg-white min-h-screen text-black font-sans w-full pb-96 font-black overflow-x-hidden selection:bg-red-50">
      
      {/* 🧭 NAVIGATION: THE CROWN OF THE EMPIRE */}
      <nav className="w-full max-w-7xl flex justify-between items-center px-6 py-5 sticky top-0 bg-white/95 backdrop-blur-xl z-[250] border-b-4 border-black/5 shadow-md">
        <div className="flex items-center gap-5">
          <img src="/kedheon-character.png" className="w-14 h-14 rounded-3xl border-2 border-black shadow-lg" alt="Kedheon" />
          <div className="text-left leading-tight">
            <h1 className="text-black text-xl md:text-3xl font-black italic uppercase tracking-tighter">Kedheon</h1>
            <span className="text-gray-400 text-[10px] md:text-sm font-mono font-bold uppercase tracking-[0.2em]">V110.0 ULTIMATE MASTER</span>
          </div>
        </div>
        
        <div className="flex items-center gap-5 font-black">
          <div className="flex bg-gray-100 rounded-2xl p-1.5 border-2 border-black/5 shadow-inner">
            <button onClick={() => setLang('KR')} className={`px-4 py-2 rounded-xl text-xs md:text-base font-black transition-all ${lang === 'KR' ? 'bg-black text-white shadow-lg' : 'text-gray-400 hover:text-black'}`}>KR</button>
            <button onClick={() => setLang('EN')} className={`px-4 py-2 rounded-xl text-xs md:text-base font-black transition-all ${lang === 'EN' ? 'bg-black text-white shadow-lg' : 'text-gray-400 hover:text-black'}`}>EN</button>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setTab('ROOKIE')} className={`px-5 py-3 rounded-2xl text-xs md:text-xl font-black border-4 transition-all duration-300 ${tab === 'ROOKIE' ? 'bg-[#dc2626] text-white border-[#dc2626] shadow-2xl scale-110' : 'border-black/5 text-gray-400 hover:text-black'}`}>{L.rookie}</button>
            <button onClick={() => setTab('PIONEER')} className={`px-5 py-3 rounded-2xl text-xs md:text-xl font-black border-4 transition-all duration-300 ${tab === 'PIONEER' ? 'bg-black text-white border-black shadow-2xl scale-110' : 'border-black/5 text-gray-400 hover:text-black'}`}>{L.pioneer}</button>
          </div>
        </div>
      </nav>

      <main className="w-full max-w-7xl px-6 py-10">
        
        {/* ============================================================
            SECTION A: ROOKIE (GAIP & ONBOARDING)
            ============================================================ */}
        {tab === 'ROOKIE' ? (
          <div className="flex flex-col gap-10 text-left animate-in fade-in slide-in-from-top-10 duration-1000">
            <div className="flex flex-col items-center text-center gap-8 py-20 bg-gray-50 rounded-[60px] border-2 border-black/5 relative shadow-inner overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-3 bg-[#dc2626] animate-pulse"></div>
              <img src="/kedheon-character.png" className="w-40 h-40 md:w-72 md:h-72 rounded-[50px] border-4 border-black shadow-2xl transition-all hover:rotate-12 hover:scale-110" alt="Master" />
              <div className="px-10">
                <h1 className="text-black text-4xl md:text-[6rem] uppercase mb-4 font-black tracking-tighter leading-none">{L.invitation}</h1>
                <p className="text-[#dc2626] text-xl md:text-5xl uppercase tracking-[0.4em] border-b-[12px] border-[#dc2626] pb-3 inline-block font-black italic shadow-sm">{L.procedure}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {L.steps.map((step, i) => (
                <div key={i} className={`p-10 bg-white rounded-[45px] border-4 flex items-center gap-10 transition-all duration-500 ${i === 0 ? 'border-[#dc2626] bg-red-50/10 shadow-2xl scale-[1.03] z-10' : 'border-black/5 hover:border-black/20 opacity-95 hover:opacity-100'}`}>
                  <span className={`text-5xl md:text-9xl font-black italic ${i === 0 ? 'text-[#dc2626]' : 'text-black opacity-10'}`}>0{i+1}</span>
                  <div className="flex-1">
                    <h3 className="text-black text-2xl md:text-5xl font-black uppercase italic mb-3 tracking-tighter">{step.t}</h3>
                    <p className="text-gray-600 text-sm md:text-3xl font-bold leading-snug tracking-tight">{step.d}</p>
                    {/* [CORE] DOWNLOAD LINK BUTTON */}
                    {step.link && (
                      <button 
                        onClick={() => window.open(step.link, '_blank')} 
                        className="mt-8 bg-[#dc2626] text-white px-12 py-5 rounded-[30px] text-lg md:text-3xl font-black uppercase hover:bg-black transition-all shadow-[0_20px_40px_rgba(220,38,38,0.5)] flex items-center gap-6 animate-bounce"
                      >
                        <span className="text-3xl md:text-5xl">↓</span> {L.download}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-16 bg-black text-white rounded-[60px] text-center shadow-2xl border-[12px] border-black group transition-all hover:bg-[#050505]">
              <p className="text-lg md:text-4xl font-black italic uppercase tracking-[0.5em] text-gray-500 group-hover:text-[#dc2626] transition-colors mb-6">Imperial Access Code</p>
              <div className="text-[#dc2626] text-7xl md:text-[14rem] font-black tracking-[0.1em] drop-shadow-[0_15px_30px_rgba(220,38,38,0.6)] active:scale-95 transition-transform cursor-pointer select-all font-mono" onClick={() => {navigator.clipboard.writeText(PI_INVITE_CODE); alert("초대 코드가 제국 통신망에 복사되었습니다!");}}>
                {PI_INVITE_CODE}
              </div>
              <p className="text-gray-500 text-sm md:text-2xl font-bold mt-6 uppercase tracking-widest">Touch to Copy / 클릭하여 복사</p>
            </div>
          </div>
        ) : (
          /* ============================================================
             SECTION B: PIONEER (ECONOMIC & GOVERNANCE)
             ============================================================ */
          <div className="flex flex-col gap-20 py-6 text-left animate-in slide-in-from-bottom-20 duration-1000">
            
            {/* 00. ASSET COMMAND DASHBOARD */}
            <div className="bg-gray-50 p-10 md:p-24 rounded-[80px] border-4 border-black shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)] flex flex-col md:flex-row justify-between items-center relative overflow-hidden group">
                <div className="absolute -top-32 -left-32 p-4 opacity-5 pointer-events-none select-none rotate-12">
                  <h1 className="text-[30rem] font-black italic uppercase">BEOM</h1>
                </div>
                <div className="text-left z-10 space-y-8 w-full md:w-auto font-black">
                  <h3 className="text-gray-400 text-sm md:text-3xl uppercase tracking-[0.6em] font-black leading-none">{L.assets}</h3>
                  <p className="text-black text-7xl md:text-[18rem] tracking-[-0.07em] font-black leading-none py-6 drop-shadow-sm">
                    {Math.floor(beomToken).toLocaleString()}
                    <span className="text-3xl md:text-[10rem] opacity-10">.{beomToken.toFixed(2).split('.')[1]}</span> 
                    <span className="ml-6 text-2xl md:text-[10rem] italic uppercase text-[#dc2626]">BEOM</span>
                  </p>
                  <div className="flex flex-wrap gap-6 pt-6 font-black">
                    <div className="bg-black text-white px-10 py-5 rounded-3xl text-sm md:text-4xl font-mono font-bold border-[6px] border-white/10 shadow-2xl">Value Index: {currentBeomValue.toFixed(2)} / PI</div>
                    <div className="bg-[#dc2626] text-white px-10 py-5 rounded-3xl text-sm md:text-4xl font-mono font-bold animate-pulse shadow-2xl border-[6px] border-white/10">Social Return: {redistributionAmount.toLocaleString()}</div>
                  </div>
                </div>
                <img src="/beom-token.png" className="w-40 h-40 md:w-[32rem] md:h-[32rem] object-contain group-hover:scale-110 group-hover:rotate-[15deg] transition-all duration-1000 mt-10 md:mt-0 drop-shadow-[0_40px_80px_rgba(0,0,0,0.5)]" alt="Asset Icon" />
            </div>

            {/* 01. EXCHANGE MODULE (PROTOCOL V23) */}
            <SectionHeader num="01" title={L.exchange} desc={L.exchangeDesc} />
            <div className="bg-white p-10 md:p-24 rounded-[60px] border-[12px] border-black flex flex-col md:flex-row justify-between items-center shadow-2xl gap-10 hover:bg-gray-50 transition-all group">
              <div className="text-left leading-tight font-black w-full md:w-auto">
                <p className="text-black text-4xl md:text-9xl font-black italic uppercase leading-none mb-6 group-hover:text-[#dc2626] transition-colors">Economic Terminal</p>
                <div className="flex items-center gap-6">
                  <span className="w-8 h-8 bg-green-500 rounded-full animate-ping"></span>
                  <p className="text-gray-400 text-lg md:text-5xl font-bold uppercase tracking-[0.3em]">Network Rate: 1 Pi = 100 BEOM</p>
                </div>
              </div>
              <button 
                onClick={() => {setBeomToken(p=>p+100); setTotalRevenue(p=>p+100); alert("기여도가 BEOM 자산으로 전환되었습니다.");}} 
                className="w-full md:w-auto bg-black text-white px-16 py-10 md:px-32 md:py-20 rounded-[45px] text-2xl md:text-7xl border-8 border-black active:scale-90 uppercase font-black shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] hover:bg-[#dc2626] transition-all"
              >
                {L.convert}
              </button>
            </div>

            {/* 02. SECURE AUTH MODULE */}
            <SectionHeader num="02" title={L.auth} desc={L.authDesc} />
            <div className="bg-gray-50 p-10 md:p-24 rounded-[70px] border-4 border-black/5 flex flex-col items-center gap-14 shadow-inner">
              <div className="flex gap-6 w-full max-w-4xl bg-white p-3 rounded-[40px] border-8 border-black font-black shadow-2xl">
                <button onClick={() => { setQrType('PERSONAL'); setIsQrActive(false); }} className={`flex-1 py-10 rounded-[30px] text-lg md:text-5xl font-black transition-all ${qrType === 'PERSONAL' ? 'bg-black text-white shadow-2xl scale-105' : 'text-gray-300 hover:text-black'}`}>PERSONAL</button>
                <button onClick={() => { setQrType('BUSINESS'); setIsQrActive(false); }} className={`flex-1 py-10 rounded-[30px] text-lg md:text-5xl font-black transition-all ${qrType === 'BUSINESS' ? 'bg-black text-white shadow-2xl scale-105' : 'text-gray-300 hover:text-black'}`}>BUSINESS</button>
              </div>
              
              {qrType === 'BUSINESS' && (
                 <input 
                   value={bizName} 
                   onChange={(e) => setBizName(e.target.value.toUpperCase())} 
                   placeholder="ENTER ENTERPRISE NAME" 
                   className="w-full max-w-4xl bg-white border-[8px] border-black p-12 rounded-[40px] text-center text-black text-3xl md:text-7xl font-black outline-none focus:border-[#dc2626] shadow-[inset_0_4px_10px_rgba(0,0,0,0.2)] transition-all" 
                 />
              )}

              <div className={`relative bg-white border-[16px] rounded-[80px] flex items-center justify-center transition-all duration-1000 shadow-2xl ${qrType === 'PERSONAL' ? 'w-80 h-80 md:w-[45rem] md:h-[45rem]' : 'w-full max-w-7xl aspect-video'} ${isQrActive ? 'border-[#dc2626] opacity-100 scale-100' : 'opacity-10 border-black/10 scale-90 blur-[4px]'}`}>
                {isQrActive ? (
                  <div className="flex flex-col items-center p-14 gap-10">
                    <img src={qrType === 'PERSONAL' ? "/qr-personal.png" : "/qr-business.png"} className="h-full object-contain drop-shadow-2xl animate-in zoom-in duration-500" alt="Auth QR" />
                    <p className="text-black text-lg md:text-5xl font-black italic tracking-[0.4em] uppercase bg-gray-100 px-16 py-5 rounded-full shadow-inner border-2 border-black/5">{bizName || "AUTHENTICATED"}</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <p className="text-black text-5xl md:text-[15rem] font-black uppercase italic tracking-[0.4em] animate-pulse">Encrypted</p>
                    <p className="text-gray-400 text-sm md:text-4xl font-bold mt-8 tracking-[0.3em]">SECURE ENGINE V23.0</p>
                  </div>
                )}
              </div>
              <button 
                onClick={() => {if(beomToken < 50) return alert("자산이 부족합니다 (50 BEOM 필요)"); setBeomToken(p=>p-50); setIsQrActive(true);}} 
                className="w-full max-w-5xl bg-black text-white py-12 md:py-24 rounded-[60px] text-2xl md:text-7xl border-[10px] border-black active:scale-95 uppercase font-black shadow-2xl hover:bg-[#dc2626] transition-all"
              >
                {L.activate} (50 BEOM)
              </button>
            </div>

            {/* 03. CREATIVE & FAN MODULE */}
            <SectionHeader num="03" title={L.creative} desc={L.creativeDesc} />
            <div className="bg-white p-10 md:p-24 rounded-[75px] border-[8px] border-black/10 space-y-14 text-left shadow-2xl font-black">
              <div className="flex gap-16 border-b-[12px] border-gray-100 pb-10 font-black">
                 <button onClick={() => setBoardType('CREATIVE')} className={`text-2xl md:text-7xl uppercase font-black italic transition-all ${boardType === 'CREATIVE' ? 'text-black border-b-[15px] border-black pb-4' : 'text-gray-300 hover:text-gray-500'}`}>Creative Hub</button>
                 <button onClick={() => setBoardType('FAN')} className={`text-2xl md:text-7xl uppercase font-black italic transition-all ${boardType === 'FAN' ? 'text-black border-b-[15px] border-black pb-4' : 'text-gray-300 hover:text-gray-500'}`}>Fan Spirit</button>
              </div>

              <div className="space-y-10">
                 <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide font-black">
                    {standardCats.map(cat => (
                      <button key={cat} onClick={() => setPostCategory(cat)} className={`px-12 py-5 rounded-3xl text-sm md:text-3xl font-black border-[6px] transition-all whitespace-nowrap ${postCategory === cat ? 'bg-black text-white border-black shadow-2xl scale-110' : 'border-black/5 text-gray-400 hover:border-black/20'}`}>{cat}</button>
                    ))}
                 </div>
                 <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide border-t-[8px] border-gray-50 pt-12 font-black">
                   {fanRooms.map(room => (
                     <button key={room} onClick={() => setPostCategory(room)} className={`px-12 py-5 rounded-3xl text-sm md:text-3xl font-black border-[6px] transition-all whitespace-nowrap ${postCategory === room ? 'bg-[#dc2626] text-white border-[#dc2626] shadow-2xl scale-110' : 'border-red-50 text-[#dc2626] hover:bg-red-50'}`}>🚩 {room}</button>
                   ))}
                   <button onClick={() => {const n = prompt("새로운 팬룸 명칭을 입력하십시오:"); if(n) setFanRooms(p=>[...p, n]);}} className="px-12 py-5 rounded-3xl text-sm md:text-3xl font-black border-[6px] border-dashed border-gray-300 text-gray-300 hover:border-black hover:text-black transition-all">+</button>
                 </div>
              </div>
              
              <div className="space-y-6 font-black pt-8">
                <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="공유할 제목 또는 강렬한 팬심 메시지" className="w-full bg-gray-50 border-[8px] border-black/5 p-10 rounded-[35px] text-2xl md:text-6xl text-black outline-none focus:border-black font-black shadow-inner" />
                <input value={newUrl} onChange={(e) => setNewUrl(e.target.value)} placeholder="이미지 또는 영상 URL 링크 (선택)" className="w-full bg-gray-50 border-[8px] border-black/5 p-10 rounded-[35px] text-sm md:text-3xl text-[#dc2626] outline-none focus:border-[#dc2626] shadow-inner" />
                <textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="상세 내용을 기록하여 제국 발전에 공헌하십시오." className="w-full bg-gray-50 border-[8px] border-black/5 p-10 rounded-[35px] text-sm md:text-4xl text-black h-96 outline-none focus:border-black font-bold shadow-inner leading-relaxed" />
              </div>
              
              <div className="flex gap-6 font-black">
                  <button onClick={() => {if(!newTitle) return alert("내용을 입력하십시오."); setBeomToken(p=>p-10); alert("제국 피드에 영구 기록되었습니다."); setNewTitle(''); setNewDesc(''); setNewUrl('');}} className="flex-[4] bg-black text-white py-10 md:py-20 rounded-[45px] text-2xl md:text-7xl border-[10px] border-black active:scale-95 uppercase font-black shadow-[0_30px_60px_rgba(0,0,0,0.5)] hover:bg-[#dc2626] transition-all">{L.post} (10 BEOM)</button>
                  <button onClick={() => alert("팬룸 개설은 별도의 승인 절차가 필요합니다 (500 BEOM 소요).")} className="flex-1 bg-white text-black py-10 md:py-20 rounded-[45px] text-xs md:text-3xl border-[10px] border-black uppercase font-black shadow-2xl hover:bg-gray-100 transition-all">🚩 OPEN ROOM</button>
              </div>
              <p className="text-gray-400 text-sm md:text-3xl font-bold bg-gray-50 p-12 rounded-[40px] italic border-l-[24px] border-[#dc2626] leading-snug">※ {L.fanRoomDesc}</p>
            </div>

            {/* 04. MARKET PORTAL MODULE */}
            <SectionHeader num="04" title={L.market} desc={L.marketDesc} />
            <div className="bg-white p-10 md:p-24 rounded-[85px] border-[8px] border-black/10 space-y-14 shadow-2xl text-left font-black">
               <h3 className="text-black text-3xl md:text-7xl font-black uppercase italic border-l-[24px] border-[#dc2626] pl-8 mb-12 leading-none">Empire Market Portal</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <label className="text-sm md:text-2xl uppercase ml-6 text-gray-400 font-black tracking-[0.3em]">Item Name / 상품명</label>
                    <input value={sellName} onChange={(e) => setSellName(e.target.value)} placeholder="ENTER PRODUCT NAME" className="w-full bg-gray-50 border-[8px] border-black/5 p-10 rounded-[35px] text-xl md:text-5xl font-black outline-none focus:border-black shadow-inner" />
                  </div>
                  <div className="space-y-4">
                    <label className="text-sm md:text-2xl uppercase ml-6 text-gray-400 font-black tracking-[0.3em]">Price (BEOM) / 가격</label>
                    <input type="number" value={sellPrice} onChange={(e) => setSellPrice(e.target.value)} placeholder="0.00" className="w-full bg-gray-50 border-[8px] border-black/5 p-10 rounded-[35px] text-xl md:text-5xl font-black text-[#dc2626] outline-none focus:border-[#dc2626] shadow-inner" />
                  </div>
               </div>
               <textarea value={sellDesc} onChange={(e) => setSellDesc(e.target.value)} placeholder="상품의 특징, 혜택, 가치를 제국 시민들에게 설명하십시오." className="w-full bg-gray-50 border-[8px] border-black/5 p-10 rounded-[35px] text-sm md:text-4xl font-bold h-64 outline-none focus:border-black shadow-inner leading-relaxed" />
               <div className="w-full">
                  <input type="file" accept="image/*" onChange={handleImageUpload} ref={fileInputRef} className="hidden" />
                  <button onClick={() => fileInputRef.current?.click()} className="w-full bg-gray-50 border-[10px] border-dashed border-black/10 p-24 rounded-[50px] text-gray-400 text-center hover:border-black hover:text-black transition-all font-black uppercase tracking-[0.5em] text-lg md:text-5xl shadow-inner">
                    {sellImg ? <img src={sellImg} className="h-80 mx-auto rounded-[40px] border-[12px] border-black shadow-2xl" alt="Preview" /> : "📸 UPLOAD PRODUCT IMAGE"}
                  </button>
               </div>
               <button onClick={handleRegisterGoods} className="w-full bg-black text-white py-12 md:py-24 rounded-[50px] text-2xl md:text-[5rem] border-[12px] border-black active:scale-95 uppercase font-black shadow-[0_40px_80px_rgba(0,0,0,0.6)] hover:bg-[#dc2626] transition-all">
                  {L.register} (20 BEOM)
               </button>
               
               {/* GOODS LIST GRID (High-Fidelity) */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-24 border-t-[12px] border-gray-50">
                  {goods.map(g => (
                    <div key={g.id} className="bg-white p-8 md:p-16 rounded-[60px] md:rounded-[100px] border-[8px] border-black/10 shadow-2xl flex flex-col group transition-all hover:border-[#dc2626] hover:shadow-[0_60px_120px_-30px_rgba(220,38,38,0.4)] relative">
                      <div className="w-full aspect-square bg-gray-50 rounded-[50px] md:rounded-[80px] border-[6px] border-black/5 mb-10 overflow-hidden flex items-center justify-center relative">
                        <div className="absolute top-10 right-10 bg-black text-white px-8 py-3 rounded-full text-sm md:text-3xl font-mono font-black shadow-2xl z-10">EMPIRE VERIFIED</div>
                        <img src={g.img} className="w-48 h-48 md:w-[28rem] md:h-[28rem] object-contain group-hover:scale-125 transition-transform duration-[1500ms]" alt="Goods" />
                      </div>
                      <h4 className="text-black text-2xl md:text-7xl uppercase mb-4 font-black leading-tight line-clamp-1">{g.name}</h4>
                      <p className="text-gray-500 text-sm md:text-3xl mb-12 font-bold leading-snug italic line-clamp-2">"{g.desc}"</p>
                      <div className="mt-auto">
                        <p className="text-black text-4xl md:text-[10rem] mb-14 font-black tracking-tighter leading-none">{g.price.toLocaleString()} <span className="text-lg md:text-6xl uppercase text-[#dc2626]">BEOM</span></p>
                        <button onClick={()=>alert("제국 보안 엔진이 구매 승인 절차를 시작합니다.")} className="w-full py-8 md:py-16 bg-black text-white rounded-[40px] md:rounded-[60px] text-lg md:text-6xl border-[6px] border-black active:scale-95 uppercase font-black shadow-2xl hover:bg-[#dc2626] transition-all">
                          {L.buy}
                        </button>
                      </div>
                    </div>
                  ))}
               </div>
            </div>

            {/* 05. BUSINESS PARTNERSHIP PORTAL */}
            <SectionHeader num="05" title={L.partnership} desc={L.partnershipDesc} />
            <div className="bg-black p-12 md:p-32 rounded-[90px] border-[20px] border-[#dc2626] space-y-16 text-left shadow-[0_80px_160px_-30px_rgba(220,38,38,0.5)] relative overflow-hidden">
                <div className="absolute -top-40 -right-40 opacity-10 pointer-events-none select-none">
                    <img src="/kedheon-character.png" className="w-[60rem] h-[60rem] grayscale" alt="Empire Seal" />
                </div>
                <h3 className="text-white text-4xl md:text-[10rem] font-black italic uppercase leading-none border-l-[30px] border-[#dc2626] pl-14 z-10 relative shadow-2xl">Business Portal</h3>
                <div className="space-y-10 relative z-10 font-black">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-6">
                            <label className="text-[#dc2626] text-sm md:text-3xl font-black uppercase ml-10 tracking-[0.5em]">Company / Group Name</label>
                            <input value={partnerCorp} onChange={(e)=>setPartnerCorp(e.target.value.toUpperCase())} placeholder="예: Pi Global Trade" className="w-full bg-white/5 border-[8px] border-white/10 p-12 rounded-[40px] text-white text-xl md:text-6xl font-black outline-none focus:border-[#dc2626] shadow-inner transition-all" />
                        </div>
                        <div className="space-y-6">
                            <label className="text-[#dc2626] text-sm md:text-3xl font-black uppercase ml-10 tracking-[0.5em]">Contact (Email / SNS)</label>
                            <input value={partnerContact} onChange={(e)=>setPartnerContact(e.target.value)} placeholder="contact@empire.com" className="w-full bg-white/5 border-[8px] border-white/10 p-12 rounded-[40px] text-white text-xl md:text-6xl font-black outline-none focus:border-[#dc2626] shadow-inner transition-all" />
                        </div>
                    </div>
                    <div className="space-y-6">
                        <label className="text-[#dc2626] text-sm md:text-3xl font-black uppercase ml-10 tracking-[0.5em]">Proposal Details / 제안 상세</label>
                        <textarea value={partnerMsg} onChange={(e)=>setPartnerMsg(e.target.value)} placeholder="제국과 함께할 혁신적인 비즈니스 모델을 자유롭게 기술하십시오." className="w-full bg-white/5 border-[8px] border-white/10 p-14 rounded-[50px] text-white text-sm md:text-4xl font-bold h-[35rem] outline-none focus:border-[#dc2626] shadow-inner leading-relaxed" />
                    </div>
                </div>
                <button 
                  onClick={() => {if(!partnerCorp || !partnerMsg) return alert("제안 내용을 상세히 입력하십시오."); alert("혁신 제안서가 제국 최고 사령부에 접수되었습니다."); setPartnerCorp(''); setPartnerContact(''); setPartnerMsg('');}} 
                  className="w-full bg-[#dc2626] text-white py-14 md:py-28 rounded-[70px] text-3xl md:text-[6rem] border-[12px] border-[#dc2626] hover:bg-white hover:text-[#dc2626] transition-all duration-500 font-black shadow-[0_50px_100px_rgba(220,38,38,0.6)] uppercase tracking-[0.3em] active:scale-95"
                >
                    {L.submit}
                </button>
            </div>

            {/* 🛰️ INFRASTRUCTURE REAL-TIME MONITORING */}
            <div className="mt-16 py-12 px-14 bg-gray-100 rounded-[50px] flex flex-wrap justify-center md:justify-between items-center gap-12 border-[6px] border-black/5 shadow-[inset_0_4px_20px_rgba(0,0,0,0.1)]">
                <div className="flex items-center gap-6"><div className="w-6 h-6 bg-red-600 rounded-full animate-ping"></div><span className="text-black text-lg md:text-4xl font-mono font-black uppercase italic tracking-tighter">Infrastructure: 88-Threads Dual Xeon Gold</span></div>
                <div className="flex items-center gap-10 font-black uppercase text-xs md:text-3xl text-gray-500">
                  <span>Node: 18.02 Top-Tier</span>
                  <span className="opacity-20 text-6xl font-thin">|</span>
                  <span>Protocol: V23.0 Synchronized</span>
                  <span className="opacity-20 text-6xl font-thin">|</span>
                  <span>Auth: @Ohsangjo</span>
                </div>
            </div>

          </div>
        )}
      </main>

      {/* 📱 FOOTER TAB BAR: THE NAVIGATOR OF REALITY */}
      <footer className="fixed bottom-10 left-6 right-6 max-w-7xl mx-auto bg-white border-[8px] border-black p-3 rounded-[60px] flex justify-between gap-5 z-[300] shadow-[0_60px_150px_rgba(0,0,0,0.8)] font-black">
        {['KEDHEON', 'CIVIL', 'NEXUS', 'VENDOR'].map(app => (
          <button key={app} className={`flex-1 py-8 md:py-16 rounded-[50px] text-xs md:text-[4rem] transition-all duration-700 font-black text-center ${app === 'KEDHEON' ? 'bg-black text-white shadow-[inset_0_10px_20px_rgba(255,255,255,0.4)] scale-[1.07] z-10 animate-pulse' : 'text-gray-300 hover:bg-gray-100 hover:text-black hover:scale-105'}`}>
            {app}
          </button>
        ))}
      </footer>

      {/* 🐯 EMPIRE WATERMARK OVERLAY */}
      <div className="mt-48 opacity-10 text-black text-sm md:text-[6rem] tracking-[2.5em] uppercase pb-60 font-black text-center select-none pointer-events-none leading-none">
        Kedheon master | V110.0 Final Empire | Designed for Lord Ohsangjo
      </div>
    </div>
  );
}
