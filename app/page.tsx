'use client';
import React, { useState, useEffect, useRef, useMemo } from 'react';

/** * [KEDHEON MASTER V108.8 - THE GRAND FINALE]
 * -----------------------------------------------------------
 * 1. 테마: Pure White (#FFFFFF) / Black (#000000) / Red (#DC2626)
 * 2. 전수복구: ROOKIE(8단계) + PIONEER(01~05 전 섹션) 100% 무삭제 통합
 * 3. 기능: 앱 설치 링크, BEOM 환전, QR 인증, 커뮤니티, 마켓, 파트너십
 * 4. 경제: Max(매출 3%, 순이익 8%) 사회적 환원 자동 계산 로직
 * 5. 인프라: 88쓰레드 / Node 18.02 / Protocol V23 완벽 싱크
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
    fanRoomDesc: "🚩 팬룸 개설(500 BEOM): 90% 수익 환원 및 거버넌스 권한.",
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
  <div className="w-full border-t-2 border-[#dc2626] pt-6 mb-4 text-left">
    <h2 className="text-black text-xl md:text-3xl font-black uppercase italic mb-1 border-l-8 border-black pl-3 tracking-tighter">
      {num}. {title}
    </h2>
    <p className="text-gray-400 text-xs md:text-sm font-bold pl-6 italic leading-none">{desc}</p>
  </div>
);

export default function KedheonEmpireFinalMaster() {
  const [hasMounted, setHasMounted] = useState(false);
  const [lang, setLang] = useState('KR');
  const [tab, setTab] = useState('PIONEER');
  
  // -- ASSET STATES --
  const [beomToken, setBeomToken] = useState(7891.88);
  const [totalRevenue, setTotalRevenue] = useState(188500);
  const [netIncome, setNetIncome] = useState(72300);

  // -- QR AUTH STATES --
  const [qrType, setQrType] = useState('PERSONAL');
  const [bizName, setBizName] = useState('');
  const [isQrActive, setIsQrActive] = useState(false);

  // -- CREATIVE & FAN STATES --
  const [boardType, setBoardType] = useState('CREATIVE');
  const [postCategory, setPostCategory] = useState('TECH');
  const [fanRooms, setFanRooms] = useState(['케데헌', '헌트릭스', '파이Nexus']);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newUrl, setNewUrl] = useState('');

  // -- MARKET STATES --
  const [sellName, setSellName] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [sellDesc, setSellDesc] = useState('');
  const [sellImg, setSellImg] = useState(''); 
  const [goods, setGoods] = useState([
    { id: 1, name: "GOLD BADGE", price: 1000, img: "/beom-token.png", desc: "제국 시민의 명예로운 문장입니다." },
    { id: 2, name: "V23 NODE KEY", price: 5000, img: "/node-icon.png", desc: "프로토콜 보안 키" }
  ]);

  // -- PARTNERSHIP STATES --
  const [partnerCorp, setPartnerCorp] = useState('');
  const [partnerContact, setPartnerContact] = useState('');
  const [partnerMsg, setPartnerMsg] = useState('');

  const fileInputRef = useRef(null);
  const L = DICT[lang];
  const standardCats = ['MUSIC', 'TECH', 'ART', 'FOOD', 'TRAVEL', 'GAME', 'NEWS', 'MOVIE'];

  // -- CALCULATION LOGIC --
  const currentBeomValue = useMemo(() => (0.18 * 100) + (5000 * 0.01) + 1, []);
  const redistributionAmount = useMemo(() => 
    Math.max(totalRevenue * 0.03, netIncome * 0.08), 
    [totalRevenue, netIncome]
  );

  useEffect(() => {
    setHasMounted(true);
    const saved = localStorage.getItem('KEDHEON_V108_8');
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
      localStorage.setItem('KEDHEON_V108_8', JSON.stringify({ beomToken, lang, fanRooms }));
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
    const newGoods = {
      id: Date.now(),
      name: sellName,
      price: Number(sellPrice),
      img: sellImg,
      desc: sellDesc
    };
    setGoods([newGoods, ...goods]);
    setSellName('');
    setSellPrice('');
    setSellDesc('');
    setSellImg('');
    alert("제국 마켓에 성공적으로 등록되었습니다.");
  };

  if (!hasMounted) return <div className="bg-white min-h-screen" />;

  return (
    <div className="flex flex-col items-center bg-white min-h-screen text-black font-sans w-full pb-64 font-black overflow-x-hidden selection:bg-red-50">
      
      {/* GLOBAL NAVIGATION BAR */}
      <nav className="w-full max-w-7xl flex justify-between items-center px-4 py-3 sticky top-0 bg-white/95 backdrop-blur-md z-[250] border-b-2 border-black/5">
        <div className="flex items-center gap-3">
          <img src="/kedheon-character.png" className="w-10 h-10 rounded-xl border-2 border-black shadow-sm" alt="K" />
          <div className="text-left leading-tight">
            <h1 className="text-black text-base md:text-xl font-black italic uppercase tracking-tighter">Kedheon</h1>
            <span className="text-gray-400 text-[8px] font-mono font-bold uppercase">V108.8 MASTER EMPIRE</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3 font-black">
          <div className="flex bg-gray-100 rounded-lg p-0.5 border border-black/5">
            <button onClick={() => setLang('KR')} className={`px-2.5 py-1 rounded-md text-[10px] md:text-xs font-black transition-all ${lang === 'KR' ? 'bg-black text-white' : 'text-gray-400'}`}>KR</button>
            <button onClick={() => setLang('EN')} className={`px-2.5 py-1 rounded-md text-[10px] md:text-xs font-black transition-all ${lang === 'EN' ? 'bg-black text-white' : 'text-gray-400'}`}>EN</button>
          </div>
          <div className="flex gap-1.5">
            <button onClick={() => setTab('ROOKIE')} className={`px-3 py-1.5 rounded-lg text-[10px] md:text-sm font-black border-2 transition-all ${tab === 'ROOKIE' ? 'bg-[#dc2626] text-white border-[#dc2626] shadow-md scale-105' : 'border-black/5 text-gray-400 hover:text-black'}`}>{L.rookie}</button>
            <button onClick={() => setTab('PIONEER')} className={`px-3 py-1.5 rounded-lg text-[10px] md:text-sm font-black border-2 transition-all ${tab === 'PIONEER' ? 'bg-black text-white border-black shadow-md scale-105' : 'border-black/5 text-gray-400 hover:text-black'}`}>{L.pioneer}</button>
          </div>
        </div>
      </nav>

      <main className="w-full max-w-5xl px-4 py-6">
        
        {/* =============================================
            TAB 01: ROOKIE (GAIP GUIDE)
            ============================================= */}
        {tab === 'ROOKIE' ? (
          <div className="flex flex-col gap-6 text-left animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex flex-col items-center text-center gap-4 py-12 bg-gray-50 rounded-[40px] border border-black/5 relative shadow-inner overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#dc2626] animate-pulse"></div>
              <img src="/kedheon-character.png" className="w-28 h-28 md:w-40 md:h-40 rounded-[30px] border-4 border-black shadow-2xl transition-transform hover:rotate-3" alt="Master" />
              <div className="px-4">
                <h1 className="text-black text-2xl md:text-5xl uppercase mb-1 font-black tracking-tighter">{L.invitation}</h1>
                <p className="text-[#dc2626] text-sm md:text-2xl uppercase tracking-[0.2em] border-b-4 border-[#dc2626] pb-1 inline-block font-black italic">{L.procedure}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {L.steps.map((step, i) => (
                <div key={i} className={`p-6 bg-white rounded-[25px] border-2 flex items-center gap-6 transition-all duration-300 ${i === 0 ? 'border-[#dc2626] bg-red-50/5 shadow-lg scale-[1.02]' : 'border-black/5 hover:border-black/20 opacity-90'}`}>
                  <span className={`text-2xl md:text-4xl font-black italic ${i === 0 ? 'text-[#dc2626]' : 'text-black opacity-20'}`}>0{i+1}</span>
                  <div className="flex-1">
                    <h3 className="text-black text-sm md:text-2xl font-black uppercase italic mb-1">{step.t}</h3>
                    <p className="text-gray-600 text-[11px] md:text-base font-bold leading-tight tracking-tight">{step.d}</p>
                    {/* [강조] 공식 앱 다운로드 버튼 (01단계 고정) */}
                    {step.link && (
                      <button 
                        onClick={() => window.open(step.link, '_blank')} 
                        className="mt-4 bg-[#dc2626] text-white px-8 py-3 rounded-2xl text-xs md:text-lg font-black uppercase hover:bg-black transition-all shadow-xl flex items-center gap-3 animate-bounce"
                      >
                        <span className="text-xl">↓</span> {L.download}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-8 bg-black text-white rounded-[30px] text-center shadow-2xl border-4 border-black group">
              <p className="text-xs md:text-xl font-black italic uppercase tracking-widest text-gray-400 group-hover:text-white transition-colors">Invitation Code / 초대 코드</p>
              <div className="text-[#dc2626] text-4xl md:text-7xl font-black mt-2 tracking-[0.1em] drop-shadow-lg active:scale-95 transition-transform cursor-pointer" onClick={() => {navigator.clipboard.writeText(PI_INVITE_CODE); alert("Copied!");}}>
                {PI_INVITE_CODE}
              </div>
            </div>
          </div>
        ) : (
          /* =============================================
             TAB 02: PIONEER (ECONOMIC SYSTEM)
             ============================================= */
          <div className="flex flex-col gap-10 py-2 text-left animate-in slide-in-from-bottom-6 duration-500">
            
            {/* 00. ASSET DASHBOARD */}
            <div className="bg-gray-50 p-6 md:p-14 rounded-[45px] border-4 border-black shadow-2xl flex flex-col md:flex-row justify-between items-center relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none select-none">
                  <h1 className="text-9xl font-black italic">BEOM</h1>
                </div>
                <div className="text-left z-10 space-y-4 w-full md:w-auto font-black">
                  <h3 className="text-gray-400 text-[10px] md:text-sm uppercase tracking-[0.3em] font-black leading-none">{L.assets}</h3>
                  <p className="text-black text-5xl md:text-[10rem] tracking-tighter font-black leading-none py-2">
                    {Math.floor(beomToken).toLocaleString()}
                    <span className="text-xl md:text-6xl opacity-20">.{beomToken.toFixed(2).split('.')[1]}</span> 
                    <span className="ml-3 text-lg md:text-6xl italic uppercase text-[#dc2626]">BEOM</span>
                  </p>
                  <div className="flex flex-wrap gap-3 pt-2 font-black">
                    <div className="bg-black text-white px-5 py-2.5 rounded-xl text-[10px] md:text-2xl font-mono font-bold border-2 border-white/10 shadow-lg">Index: {currentBeomValue.toFixed(2)} / PI</div>
                    <div className="bg-[#dc2626] text-white px-5 py-2.5 rounded-xl text-[10px] md:text-2xl font-mono font-bold animate-pulse shadow-xl border-2 border-white/10">Social Return: {redistributionAmount.toLocaleString()}</div>
                  </div>
                </div>
                <img src="/beom-token.png" className="w-24 h-24 md:w-64 md:h-64 object-contain group-hover:rotate-12 transition-transform duration-500 mt-4 md:mt-0 drop-shadow-2xl" alt="Beom Asset" />
            </div>

            {/* 01. EXCHANGE TERMINAL */}
            <SectionHeader num="01" title={L.exchange} desc={L.exchangeDesc} />
            <div className="bg-white p-6 md:p-14 rounded-[35px] border-4 border-black flex flex-col md:flex-row justify-between items-center shadow-xl gap-6 hover:shadow-2xl transition-all">
              <div className="text-left leading-tight font-black w-full md:w-auto">
                <p className="text-black text-2xl md:text-5xl font-black italic uppercase leading-none mb-2">Mainnet Terminal</p>
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 bg-green-500 rounded-full animate-ping"></span>
                  <p className="text-gray-400 text-xs md:text-xl font-bold uppercase tracking-widest">Rate Fix: 1 Pi = 100 BEOM</p>
                </div>
              </div>
              <button 
                onClick={() => {setBeomToken(p=>p+100); setTotalRevenue(p=>p+100); alert("1 PI -> 100 BEOM 환전 완료");}} 
                className="w-full md:w-auto bg-black text-white px-10 py-5 md:px-20 md:py-10 rounded-[25px] text-sm md:text-3xl border-4 border-black active:scale-95 uppercase font-black shadow-2xl hover:bg-[#dc2626] transition-all"
              >
                {L.convert}
              </button>
            </div>

            {/* 02. SECURE AUTH MODULE */}
            <SectionHeader num="02" title={L.auth} desc={L.authDesc} />
            <div className="bg-gray-50 p-6 md:p-14 rounded-[40px] border-2 border-black/5 flex flex-col items-center gap-6 shadow-inner">
              <div className="flex gap-3 w-full max-w-md bg-white p-1.5 rounded-2xl border-4 border-black font-black">
                <button onClick={() => { setQrType('PERSONAL'); setIsQrActive(false); }} className={`flex-1 py-4 rounded-xl text-xs md:text-lg font-black transition-all ${qrType === 'PERSONAL' ? 'bg-black text-white' : 'text-gray-400 hover:text-black'}`}>PERSONAL</button>
                <button onClick={() => { setQrType('BUSINESS'); setIsQrActive(false); }} className={`flex-1 py-4 rounded-xl text-xs md:text-lg font-black transition-all ${qrType === 'BUSINESS' ? 'bg-black text-white' : 'text-gray-400 hover:text-black'}`}>BUSINESS</button>
              </div>
              
              {qrType === 'BUSINESS' && (
                 <input 
                   value={bizName} 
                   onChange={(e) => setBizName(e.target.value.toUpperCase())} 
                   placeholder="ENTER BUSINESS NAME" 
                   className="w-full max-w-md bg-white border-4 border-black p-5 rounded-2xl text-center text-black text-base md:text-2xl font-black outline-none focus:border-[#dc2626] shadow-xl" 
                 />
              )}

              <div className={`relative bg-white border-8 rounded-[40px] flex items-center justify-center transition-all duration-700 shadow-2xl ${qrType === 'PERSONAL' ? 'w-48 h-48 md:w-96 md:h-96' : 'w-full max-w-3xl aspect-video'} ${isQrActive ? 'border-[#dc2626] opacity-100 scale-100' : 'opacity-20 border-black/10 scale-95'}`}>
                {isQrActive ? (
                  <div className="flex flex-col items-center p-6 gap-4">
                    <img src={qrType === 'PERSONAL' ? "/qr-personal.png" : "/qr-business.png"} className="h-full object-contain drop-shadow-md" alt="QR Code" />
                    <p className="text-black text-xs md:text-xl font-black italic tracking-widest uppercase bg-gray-100 px-4 py-1 rounded-full">{bizName || "AUTHENTICATED"}</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <p className="text-black text-2xl md:text-8xl font-black uppercase italic tracking-[0.2em] animate-pulse">Locked</p>
                    <p className="text-gray-400 text-[10px] md:text-sm font-bold mt-2">SECURE ENGINE V23</p>
                  </div>
                )}
              </div>
              <button 
                onClick={() => {if(beomToken < 50) return alert("BEOM 토큰이 부족합니다."); setBeomToken(p=>p-50); setIsQrActive(true);}} 
                className="w-full max-w-xl bg-black text-white py-5 md:py-10 rounded-[30px] text-sm md:text-3xl border-4 border-black active:scale-95 uppercase font-black shadow-2xl hover:bg-[#dc2626] transition-all"
              >
                {L.activate} (50 BEOM)
              </button>
            </div>

            {/* 03. CREATIVE & FAN MODULE */}
            <SectionHeader num="03" title={L.creative} desc={L.creativeDesc} />
            <div className="bg-white p-6 md:p-14 rounded-[40px] border-4 border-black/10 space-y-6 text-left shadow-xl font-black">
              <div className="flex gap-8 border-b-4 border-gray-100 pb-4 font-black">
                 <button onClick={() => setBoardType('CREATIVE')} className={`text-base md:text-3xl uppercase font-black italic transition-all ${boardType === 'CREATIVE' ? 'text-black border-b-4 border-black pb-1' : 'text-gray-300 hover:text-gray-500'}`}>Creative Hub</button>
                 <button onClick={() => setBoardType('FAN')} className={`text-base md:text-3xl uppercase font-black italic transition-all ${boardType === 'FAN' ? 'text-black border-b-4 border-black pb-1' : 'text-gray-300 hover:text-gray-500'}`}>Fan Spirit</button>
              </div>

              <div className="space-y-4">
                 <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide font-black">
                    {standardCats.map(cat => (
                      <button key={cat} onClick={() => setPostCategory(cat)} className={`px-5 py-2.5 rounded-full text-[10px] md:text-lg font-black border-4 transition-all whitespace-nowrap ${postCategory === cat ? 'bg-black text-white border-black shadow-lg scale-105' : 'border-black/5 text-gray-400 hover:border-black/20'}`}>{cat}</button>
                    ))}
                 </div>
                 <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide border-t-4 border-gray-50 pt-4 font-black">
                   {fanRooms.map(room => (
                     <button key={room} onClick={() => setPostCategory(room)} className={`px-5 py-2.5 rounded-full text-[10px] md:text-lg font-black border-4 transition-all whitespace-nowrap ${postCategory === room ? 'bg-[#dc2626] text-white border-[#dc2626] shadow-lg scale-105' : 'border-red-50 text-[#dc2626] hover:bg-red-50'}`}>🚩 {room}</button>
                   ))}
                   <button onClick={() => {const n = prompt("새로운 팬룸 이름을 입력하십시오."); if(n) setFanRooms(p=>[...p, n]);}} className="px-5 py-2.5 rounded-full text-[10px] md:text-lg font-black border-4 border-dashed border-gray-300 text-gray-300 hover:border-black hover:text-black transition-all">+</button>
                 </div>
              </div>
              
              <div className="space-y-3 font-black pt-2">
                <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="공유할 제목 또는 팬심 메시지" className="w-full bg-gray-50 border-4 border-black/5 p-5 rounded-2xl text-base md:text-2xl text-black outline-none focus:border-black font-black shadow-inner" />
                <input value={newUrl} onChange={(e) => setNewUrl(e.target.value)} placeholder="이미지 또는 영상 URL (Link)" className="w-full bg-gray-50 border-4 border-black/5 p-5 rounded-2xl text-xs md:text-lg text-[#dc2626] outline-none focus:border-[#dc2626]" />
                <textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="상세 내용을 기록하여 제국에 공헌하십시오." className="w-full bg-gray-50 border-4 border-black/5 p-5 rounded-2xl text-xs md:text-xl text-black h-40 outline-none focus:border-black font-bold shadow-inner" />
              </div>
              
              <div className="flex gap-3 font-black">
                  <button onClick={() => {if(!newTitle) return alert("내용을 입력하십시오."); setBeomToken(p=>p-10); alert("제국 피드에 등록되었습니다."); setNewTitle(''); setNewDesc(''); setNewUrl('');}} className="flex-[3] bg-black text-white py-5 md:py-10 rounded-[25px] text-base md:text-3xl border-4 border-black active:scale-95 uppercase font-black shadow-2xl hover:bg-[#dc2626] transition-all">{L.post} (10 BEOM)</button>
                  <button onClick={() => alert("팬룸 개설은 500 BEOM이 소요되며, 현재 승인 대기 중입니다.")} className="flex-1 bg-white text-black py-5 md:py-10 rounded-[25px] text-[10px] md:text-xl border-4 border-black uppercase font-black shadow-lg hover:bg-gray-50 transition-all">🚩 OPEN ROOM</button>
              </div>
              <p className="text-gray-400 text-[10px] md:text-lg font-bold bg-gray-50 p-5 rounded-2xl italic border-l-8 border-[#dc2626] leading-snug">※ {L.fanRoomDesc}</p>
            </div>

            {/* 04. MARKET MODULE */}
            <SectionHeader num="04" title={L.market} desc={L.marketDesc} />
            <div className="bg-white p-6 md:p-14 rounded-[40px] border-4 border-black/10 space-y-6 shadow-2xl text-left font-black">
               <h3 className="text-black text-base md:text-3xl font-black uppercase italic border-l-8 border-[#dc2626] pl-4 mb-4 leading-none">Empire Registration</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase ml-2 text-gray-400">Item Name</label>
                    <input value={sellName} onChange={(e) => setSellName(e.target.value)} placeholder="PRODUCT NAME" className="w-full bg-gray-50 border-4 border-black/5 p-5 rounded-2xl text-sm md:text-xl font-black outline-none focus:border-black shadow-inner" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase ml-2 text-gray-400">Price (BEOM)</label>
                    <input type="number" value={sellPrice} onChange={(e) => setSellPrice(e.target.value)} placeholder="0.00" className="w-full bg-gray-50 border-4 border-black/5 p-5 rounded-2xl text-sm md:text-xl font-black text-[#dc2626] outline-none focus:border-[#dc2626] shadow-inner" />
                  </div>
               </div>
               <textarea value={sellDesc} onChange={(e) => setSellDesc(e.target.value)} placeholder="PRODUCT DESCRIPTION (FEATURES, BENEFITS)" className="w-full bg-gray-50 border-4 border-black/5 p-5 rounded-2xl text-xs md:text-lg font-bold h-32 outline-none focus:border-black shadow-inner" />
               <div className="w-full">
                  <input type="file" accept="image/*" onChange={handleImageUpload} ref={fileInputRef} className="hidden" />
                  <button onClick={() => fileInputRef.current?.click()} className="w-full bg-gray-50 border-4 border-dashed border-black/10 p-12 rounded-[30px] text-gray-400 text-center hover:border-black hover:text-black transition-all font-black uppercase tracking-widest">
                    {sellImg ? <img src={sellImg} className="h-40 mx-auto rounded-2xl border-4 border-black shadow-md" alt="Preview" /> : "📸 UPLOAD PRODUCT PHOTO"}
                  </button>
               </div>
               <button onClick={handleRegisterGoods} className="w-full bg-black text-white py-6 md:py-10 rounded-[30px] text-base md:text-3xl border-4 border-black active:scale-95 uppercase font-black shadow-2xl hover:bg-[#dc2626] transition-all">{L.register} (20 BEOM)</button>
               
               {/* GOODS GRID VIEW */}
               <div className="grid grid-cols-2 md:grid-cols-2 gap-4 pt-8 border-t-4 border-gray-50">
                  {goods.map(g => (
                    <div key={g.id} className="bg-white p-4 md:p-10 rounded-[35px] md:rounded-[50px] border-4 border-black/10 shadow-lg flex flex-col group transition-all hover:border-[#dc2626] hover:shadow-2xl">
                      <div className="w-full aspect-square bg-gray-50 rounded-[25px] md:rounded-[40px] border-2 border-black/5 mb-4 overflow-hidden flex items-center justify-center relative">
                        <div className="absolute top-3 right-3 bg-black text-white px-3 py-1 rounded-full text-[8px] md:text-xs font-mono font-black">VERIFIED</div>
                        <img src={g.img} className="w-28 h-28 md:w-56 md:h-56 object-contain group-hover:scale-110 transition-transform duration-500" alt="Goods" />
                      </div>
                      <h4 className="text-black text-xs md:text-3xl uppercase mb-1 font-black leading-tight line-clamp-1">{g.name}</h4>
                      <p className="text-gray-500 text-[10px] md:text-lg mb-4 font-bold leading-tight italic line-clamp-2">"{g.desc}"</p>
                      <p className="text-black text-xl md:text-6xl mb-6 font-black tracking-tighter leading-none">{g.price.toLocaleString()} <span className="text-[10px] md:text-2xl uppercase">BEOM</span></p>
                      <button onClick={()=>alert("구매 시스템 준비 중입니다.")} className="w-full py-4 md:py-8 bg-black text-white rounded-2xl md:rounded-[30px] text-xs md:text-2xl border-2 border-black active:scale-95 uppercase font-black shadow-xl hover:bg-[#dc2626] transition-all">{L.buy}</button>
                    </div>
                  ))}
               </div>
            </div>

            {/* 05. BUSINESS PARTNERSHIP MODULE */}
            <SectionHeader num="05" title={L.partnership} desc={L.partnershipDesc} />
            <div className="bg-black p-6 md:p-16 rounded-[45px] border-8 border-[#dc2626] space-y-8 text-left shadow-[0_35px_60px_-15px_rgba(220,38,38,0.3)] relative overflow-hidden">
                <div className="absolute -top-10 -right-10 opacity-10 pointer-events-none select-none">
                    <img src="/kedheon-character.png" className="w-80 h-80 grayscale" alt="K" />
                </div>
                <h3 className="text-white text-2xl md:text-6xl font-black italic uppercase leading-none border-l-[12px] border-[#dc2626] pl-6 z-10 relative">Business Portal</h3>
                <div className="space-y-6 relative z-10 font-black">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <label className="text-[#dc2626] text-[10px] md:text-sm font-black uppercase ml-3 tracking-[0.2em]">Company / Group Name</label>
                            <input value={partnerCorp} onChange={(e)=>setPartnerCorp(e.target.value.toUpperCase())} placeholder="예: Pi Global Commerce" className="w-full bg-white/5 border-4 border-white/10 p-6 rounded-2xl text-white text-base md:text-3xl font-black outline-none focus:border-[#dc2626] shadow-inner" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[#dc2626] text-[10px] md:text-sm font-black uppercase ml-3 tracking-[0.2em]">Contact (Email / SNS)</label>
                            <input value={partnerContact} onChange={(e)=>setPartnerContact(e.target.value)} placeholder="contact@example.com" className="w-full bg-white/5 border-4 border-white/10 p-6 rounded-2xl text-white text-base md:text-3xl font-black outline-none focus:border-[#dc2626] shadow-inner" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[#dc2626] text-[10px] md:text-sm font-black uppercase ml-3 tracking-[0.2em]">Proposal Details</label>
                        <textarea value={partnerMsg} onChange={(e)=>setPartnerMsg(e.target.value)} placeholder="제국과 함께할 혁신적인 비즈니스 모델을 제안하십시오." className="w-full bg-white/5 border-4 border-white/10 p-6 rounded-2xl text-white text-xs md:text-2xl font-bold h-56 outline-none focus:border-[#dc2626] shadow-inner" />
                    </div>
                </div>
                <button 
                  onClick={() => {if(!partnerCorp || !partnerMsg) return alert("제안 내용을 입력하십시오."); alert("Proposal Submitted. 제국의 검토 후 연락드리겠습니다."); setPartnerCorp(''); setPartnerContact(''); setPartnerMsg('');}} 
                  className="w-full bg-[#dc2626] text-white py-6 md:py-12 rounded-3xl text-lg md:text-4xl border-4 border-[#dc2626] hover:bg-white hover:text-[#dc2626] transition-all font-black shadow-2xl uppercase tracking-widest active:scale-95"
                >
                    {L.submit}
                </button>
            </div>

            {/* INFRASTRUCTURE MONITORING BAR */}
            <div className="mt-6 py-4 px-6 bg-gray-100 rounded-2xl flex flex-wrap justify-center md:justify-between items-center gap-6 border-2 border-black/5 shadow-inner">
                <div className="flex items-center gap-2"><div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div><span className="text-black text-[9px] md:text-sm font-mono font-black uppercase italic">Infr: 88-Threads Dual Xeon</span></div>
                <div className="flex items-center gap-2 font-black uppercase text-[9px] md:text-sm text-gray-500">
                  <span>Node: 18.02 Top-Tier</span>
                  <span className="hidden md:inline mx-2 opacity-20">|</span>
                  <span>Protocol: V23.0 Sync</span>
                  <span className="hidden md:inline mx-2 opacity-20">|</span>
                  <span>Dev: @Ohsangjo</span>
                </div>
            </div>

          </div>
        )}
      </main>

      {/* FOOTER TAB BAR (GLOBAL APP NAVIGATION) */}
      <footer className="fixed bottom-6 left-4 right-4 max-w-5xl mx-auto bg-white border-4 border-black p-1.5 rounded-[40px] flex justify-between gap-2 z-[300] shadow-[0_20px_50px_rgba(0,0,0,0.5)] font-black">
        {['KEDHEON', 'CIVIL', 'NEXUS', 'VENDOR'].map(app => (
          <button key={app} className={`flex-1 py-4 md:py-8 rounded-[30px] text-[11px] md:text-3xl transition-all font-black text-center ${app === 'KEDHEON' ? 'bg-black text-white shadow-inner scale-[1.03] animate-in' : 'text-gray-300 hover:bg-gray-50 hover:text-black'}`}>
            {app}
          </button>
        ))}
      </footer>

      {/* COPYRIGHT OVERLAY */}
      <div className="mt-24 opacity-20 text-black text-[10px] md:text-2xl tracking-[1.5em] uppercase pb-32 font-black text-center select-none">
        Kedheon master | V108.8 Final Empire | @Ohsangjo
      </div>
    </div>
  );
}
