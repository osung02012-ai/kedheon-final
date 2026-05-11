'use client';
import React, { useState, useEffect, useRef, useMemo } from 'react';

/** * [KEDHEON MASTER V106.1 - THE ABSOLUTE FULL EDITION]
 * -----------------------------------------------------------
 * 1. 테마: Pure White (#FFFFFF) / Black (#000000) / Red (#DC2626)
 * 2. 레이아웃: 모바일 최적화 촘촘한(Compact) 구조
 * 3. 기능: ROOKIE 가이드 + PIONEER 경제/커뮤니티/마켓/파트너십 100% 통합
 * 4. 경제: Max(3% Revenue, 8% Net Profit) 사회적 환원 자동 계산
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

// 유틸리티 헤더
const SectionHeader = ({ num, title, desc }) => (
  <div className="w-full border-t-2 border-[#dc2626] pt-4 mb-3 text-left">
    <h2 className="text-black text-lg md:text-2xl font-black uppercase italic mb-0.5 border-l-4 border-black pl-2 tracking-tighter">
      {num}. {title}
    </h2>
    <p className="text-gray-400 text-[10px] md:text-xs font-bold pl-4 italic leading-none">{desc}</p>
  </div>
);

export default function KedheonEmpireAbsoluteMaster() {
  const [hasMounted, setHasMounted] = useState(false);
  const [lang, setLang] = useState('KR');
  const [tab, setTab] = useState('PIONEER');
  
  // 글로벌 경제 상태
  const [beomToken, setBeomToken] = useState(7891.88);
  const [totalRevenue, setTotalRevenue] = useState(188500);
  const [netIncome, setNetIncome] = useState(72300);

  // 기능별 상태
  const [qrType, setQrType] = useState('PERSONAL');
  const [bizName, setBizName] = useState('');
  const [isQrActive, setIsQrActive] = useState(false);
  const [boardType, setBoardType] = useState('CREATIVE');
  const [postCategory, setPostCategory] = useState('TECH');
  const [fanRooms, setFanRooms] = useState(['케데헌', '헌트릭스']);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newUrl, setNewUrl] = useState('');

  // 마켓 상태
  const [sellName, setSellName] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [sellDesc, setSellDesc] = useState('');
  const [sellImg, setSellImg] = useState(''); 
  const [goods, setGoods] = useState([
    { id: 1, name: "GOLD BADGE", price: 1000, img: "/beom-token.png", desc: "제국 시민의 명예로운 문장입니다." }
  ]);

  // 파트너십 상태
  const [partnerCorp, setPartnerCorp] = useState('');
  const [partnerContact, setPartnerContact] = useState('');
  const [partnerMsg, setPartnerMsg] = useState('');

  const fileInputRef = useRef(null);
  const L = DICT[lang];
  const standardCats = ['MUSIC', 'TECH', 'ART', 'FOOD', 'TRAVEL', 'GAME', 'NEWS', 'MOVIE'];

  const redistributionAmount = useMemo(() => Math.max(totalRevenue * 0.03, netIncome * 0.08), [totalRevenue, netIncome]);
  const currentBeomValue = useMemo(() => (0.18 * 100) + (5000 * 0.01) + 1, []);

  useEffect(() => {
    setHasMounted(true);
    const saved = localStorage.getItem('KEDHEON_ABSOLUTE_MASTER');
    if (saved) {
      try {
        const p = JSON.parse(saved);
        if (p.beomToken) setBeomToken(p.beomToken);
        if (p.fanRooms) setFanRooms(p.fanRooms);
        if (p.lang) setLang(p.lang);
      } catch (e) { console.error(e); }
    }
  }, []);

  useEffect(() => {
    if (hasMounted) {
      localStorage.setItem('KEDHEON_ABSOLUTE_MASTER', JSON.stringify({ beomToken, lang, fanRooms }));
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

  if (!hasMounted) return <div className="bg-white min-h-screen" />;

  return (
    <div className="flex flex-col items-center bg-white min-h-screen text-black font-sans w-full pb-64 font-black overflow-x-hidden selection:bg-red-50">
      
      {/* GNB */}
      <nav className="w-full max-w-7xl flex justify-between items-center px-3 py-2 sticky top-0 bg-white/95 backdrop-blur-md z-[250] border-b-2 border-black/5">
        <div className="flex items-center gap-2">
          <img src="/kedheon-character.png" className="w-8 h-8 rounded-lg border border-black shadow-sm" alt="K" />
          <div className="text-left leading-tight">
            <h1 className="text-black text-sm md:text-lg font-black italic uppercase tracking-tighter">Kedheon</h1>
            <span className="text-gray-400 text-[7px] font-mono font-bold uppercase">V106.1 ABSOLUTE</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex bg-gray-100 rounded p-0.5 border border-black/5">
            <button onClick={() => setLang('KR')} className={`px-2 py-0.5 rounded text-[8px] md:text-xs font-black transition-all ${lang === 'KR' ? 'bg-black text-white' : 'text-gray-400'}`}>KR</button>
            <button onClick={() => setLang('EN')} className={`px-2 py-0.5 rounded text-[8px] md:text-xs font-black transition-all ${lang === 'EN' ? 'bg-black text-white' : 'text-gray-400'}`}>EN</button>
          </div>
          <div className="flex gap-1">
            <button onClick={() => setTab('ROOKIE')} className={`px-2 py-1 rounded-md text-[8px] md:text-xs font-black border transition-all ${tab === 'ROOKIE' ? 'bg-[#dc2626] text-white border-[#dc2626]' : 'border-black/5 text-gray-400'}`}>{L.rookie}</button>
            <button onClick={() => setTab('PIONEER')} className={`px-2 py-1 rounded-md text-[8px] md:text-xs font-black border transition-all ${tab === 'PIONEER' ? 'bg-black text-white border-black' : 'border-black/5 text-gray-400'}`}>{L.pioneer}</button>
          </div>
        </div>
      </nav>

      <main className="w-full max-w-4xl px-3 py-4">
        {tab === 'ROOKIE' ? (
          <div className="flex flex-col gap-4 text-left animate-in fade-in slide-in-from-top-4">
            {/* 루키 헤드 */}
            <div className="flex flex-col items-center text-center gap-3 py-8 bg-gray-50 rounded-[30px] border border-black/5">
              <img src="/kedheon-character.png" className="w-24 h-24 md:w-32 md:h-32 rounded-2xl border-2 border-black shadow-lg" alt="M" />
              <div>
                <h1 className="text-black text-xl md:text-3xl uppercase font-black">{L.invitation}</h1>
                <p className="text-[#dc2626] text-sm md:text-xl uppercase tracking-widest border-b-2 border-[#dc2626] pb-0.5 inline-block font-black">{L.procedure}</p>
              </div>
            </div>

            {/* 루키 단계 - 무삭제 8단계 */}
            <div className="grid grid-cols-1 gap-2">
              {L.steps.map((step, i) => (
                <div key={i} className={`p-4 bg-white rounded-xl border-2 flex items-center gap-4 transition-all ${i === 0 ? 'border-[#dc2626] bg-red-50/5 shadow-md scale-[1.01]' : 'border-black/5'}`}>
                  <span className={`text-lg md:text-2xl font-black italic ${i === 0 ? 'text-[#dc2626]' : 'text-black'}`}>0{i+1}</span>
                  <div className="flex-1">
                    <h3 className="text-black text-xs md:text-lg font-black uppercase italic mb-0.5">{step.t}</h3>
                    <p className="text-gray-600 text-[10px] md:text-sm font-bold leading-tight">{step.d}</p>
                    {step.link && (
                      <button onClick={() => window.open(step.link, '_blank')} className="mt-3 bg-[#dc2626] text-white px-6 py-2.5 rounded-xl text-[10px] md:text-sm font-black uppercase hover:bg-black transition-all shadow-lg flex items-center gap-2">
                        <span className="animate-bounce">↓</span> {L.download}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 bg-black text-white rounded-2xl text-center shadow-lg">
              <p className="text-[10px] md:text-sm font-black italic">초대 코드(Invitation Code): <span className="text-[#dc2626] text-lg md:text-2xl ml-2 tracking-widest">{PI_INVITE_CODE}</span></p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-8 py-1 text-left animate-in slide-in-from-bottom-2">
            
            {/* 00. ASSETS SECTION (무삭제) */}
            <div className="bg-gray-50 p-4 md:p-10 rounded-[35px] border-2 border-black shadow-lg flex flex-col md:flex-row justify-between items-center relative overflow-hidden group">
                <div className="text-left z-10 space-y-2 w-full md:w-auto font-black">
                  <h3 className="text-gray-400 text-[8px] md:text-xs uppercase tracking-widest font-black leading-none">{L.assets}</h3>
                  <p className="text-black text-4xl md:text-8xl tracking-tighter font-black leading-none">
                    {Math.floor(beomToken).toLocaleString()}
                    <span className="text-lg md:text-4xl opacity-30">.{beomToken.toFixed(2).split('.')[1]}</span> 
                    <span className="ml-2 text-sm md:text-4xl italic uppercase">BEOM</span>
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1 font-black">
                    <div className="bg-black text-white px-3 py-1.5 rounded-lg text-[9px] md:text-lg font-mono font-bold">Index: {currentBeomValue.toFixed(2)} / PI</div>
                    <div className="bg-[#dc2626] text-white px-3 py-1.5 rounded-lg text-[9px] md:text-lg font-mono font-bold animate-pulse shadow-md">Redistribution: {redistributionAmount.toLocaleString()}</div>
                  </div>
                </div>
                <img src="/beom-token.png" className="w-16 h-16 md:w-44 md:h-44 object-contain mt-2 md:mt-0" alt="B" />
            </div>

            {/* 01. EXCHANGE SECTION (무삭제) */}
            <SectionHeader num="01" title={L.exchange} desc={L.exchangeDesc} />
            <div className="bg-white p-4 md:p-10 rounded-[25px] border-2 border-black flex justify-between items-center shadow-md gap-4">
              <div className="text-left font-black">
                <p className="text-black text-base md:text-3xl font-black italic uppercase leading-none">Terminal</p>
                <p className="text-gray-400 text-[8px] md:text-sm font-bold mt-1 uppercase tracking-widest">Rate: 1 Pi = 100 BEOM</p>
              </div>
              <button onClick={() => {setBeomToken(p=>p+100); setTotalRevenue(p=>p+100); alert("Exchange Success");}} className="bg-black text-white px-6 py-3 md:px-12 md:py-6 rounded-2xl text-[10px] md:text-xl border-2 border-black active:scale-95 uppercase font-black shadow-lg">
                {L.convert}
              </button>
            </div>

            {/* 02. SECURE AUTH SECTION (무삭제) */}
            <SectionHeader num="02" title={L.auth} desc={L.authDesc} />
            <div className="bg-gray-50 p-4 md:p-12 rounded-[30px] border border-black/5 flex flex-col items-center gap-4">
              <div className="flex gap-2 w-full max-w-xs bg-white p-1 rounded-lg border-2 border-black font-black">
                <button onClick={() => { setQrType('PERSONAL'); setIsQrActive(false); }} className={`flex-1 py-2 rounded text-[9px] md:text-xs font-black transition-all ${qrType === 'PERSONAL' ? 'bg-black text-white' : 'text-gray-400'}`}>PERSONAL</button>
                <button onClick={() => { setQrType('BUSINESS'); setIsQrActive(false); }} className={`flex-1 py-2 rounded text-[9px] md:text-xs font-black transition-all ${qrType === 'BUSINESS' ? 'bg-black text-white' : 'text-gray-400'}`}>BUSINESS</button>
              </div>
              {qrType === 'BUSINESS' && (
                 <input value={bizName} onChange={(e) => setBizName(e.target.value.toUpperCase())} placeholder="ENTER BUSINESS NAME" className="w-full max-w-xs bg-white border-2 border-black p-3 rounded-xl text-center text-black text-sm font-black outline-none focus:border-[#dc2626]" />
              )}
              <div className={`relative bg-white border-4 rounded-[20px] flex items-center justify-center transition-all duration-500 shadow-xl ${qrType === 'PERSONAL' ? 'w-40 h-40 md:w-80 md:h-80' : 'w-full max-w-2xl aspect-video'} ${isQrActive ? 'border-[#dc2626] opacity-100' : 'border-black/10 opacity-20'}`}>
                {isQrActive ? (
                  <div className="flex flex-col items-center gap-2">
                    <img src={qrType === 'PERSONAL' ? "/qr-personal.png" : "/qr-business.png"} className="h-full object-contain p-2" alt="QR" />
                    {qrType === 'BUSINESS' && <p className="text-black text-[10px] md:text-sm font-black italic">{bizName || "ENTERPRISE"}</p>}
                  </div>
                ) : <p className="text-black text-lg md:text-5xl font-black uppercase italic tracking-widest">LOCKED</p>}
              </div>
              <button onClick={() => {if(beomToken < 50) return alert("Beom Low"); setBeomToken(p=>p-50); setIsQrActive(true);}} className="w-full max-w-md bg-black text-white py-3 md:py-6 rounded-[20px] text-[10px] md:text-xl border-2 border-black active:scale-95 uppercase font-black shadow-lg">
                {L.activate} (50 BEOM)
              </button>
            </div>

            {/* 03. CREATIVE & FAN SECTION (무삭제) */}
            <SectionHeader num="03" title={L.creative} desc={L.creativeDesc} />
            <div className="bg-white p-4 md:p-10 rounded-[30px] border-2 border-black/10 space-y-4 text-left shadow-lg">
              <div className="flex gap-6 border-b-2 border-gray-100 pb-2 font-black">
                 <button onClick={() => setBoardType('CREATIVE')} className={`text-xs md:text-xl uppercase font-black italic transition-all ${boardType === 'CREATIVE' ? 'text-black border-b-2 border-black' : 'text-gray-300'}`}>Creative Hub</button>
                 <button onClick={() => setBoardType('FAN')} className={`text-xs md:text-xl uppercase font-black italic transition-all ${boardType === 'FAN' ? 'text-black border-b-2 border-black' : 'text-gray-300'}`}>Fan Spirit</button>
              </div>
              <div className="space-y-3 font-black">
                 <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    {standardCats.map(cat => (
                      <button key={cat} onClick={() => setPostCategory(cat)} className={`px-4 py-1.5 rounded-full text-[9px] md:text-sm font-black border-2 transition-all whitespace-nowrap ${postCategory === cat ? 'bg-black text-white border-black shadow-md' : 'border-black/5 text-gray-400'}`}>{cat}</button>
                    ))}
                 </div>
                 <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide border-t-2 border-gray-50 pt-3">
                   {fanRooms.map(room => (
                     <button key={room} onClick={() => setPostCategory(room)} className={`px-4 py-1.5 rounded-full text-[9px] md:text-sm font-black border-2 transition-all whitespace-nowrap ${postCategory === room ? 'bg-[#dc2626] text-white border-[#dc2626] shadow-md' : 'border-red-50 text-[#dc2626]'}`}>🚩 {room}</button>
                   ))}
                 </div>
              </div>
              <div className="space-y-2 font-black">
                <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="제목 또는 팬심 공유" className="w-full bg-gray-50 border-2 border-black/5 p-3 rounded-xl text-sm md:text-xl outline-none focus:border-black font-black" />
                <input value={newUrl} onChange={(e) => setNewUrl(e.target.value)} placeholder="이미지/영상 링크" className="w-full bg-gray-50 border-2 border-black/5 p-3 rounded-xl text-[10px] md:text-lg text-[#dc2626] outline-none" />
                <textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="상세 내용을 기록하십시오" className="w-full bg-gray-50 border-2 border-black/5 p-3 rounded-xl text-[10px] md:text-base h-24 outline-none focus:border-black font-bold" />
              </div>
              <div className="flex gap-2 font-black">
                  <button onClick={() => {if(!newTitle) return; setBeomToken(p=>p-10); alert("Posted"); setNewTitle(''); setNewDesc('');}} className="flex-[2] bg-black text-white py-3 md:py-6 rounded-xl text-sm md:text-2xl border-2 border-black active:scale-95 uppercase font-black shadow-lg">{L.post} (10 BEOM)</button>
                  <button onClick={() => {const n = prompt("New Fan Room?"); if(n) setFanRooms(p=>[...p, n]);}} className="flex-1 bg-white text-black py-3 md:py-6 rounded-xl text-[10px] md:text-lg border-2 border-black uppercase font-black">🚩 CREATE</button>
              </div>
              <p className="text-gray-400 text-[8px] md:text-sm font-bold bg-gray-50 p-3 rounded-lg italic border-l-4 border-[#dc2626]">※ {L.fanRoomDesc}</p>
            </div>

            {/* 04. MARKET SECTION (무삭제) */}
            <SectionHeader num="04" title={L.market} desc={L.marketDesc} />
            <div className="bg-white p-4 md:p-10 rounded-[30px] border-2 border-black/10 space-y-4 shadow-lg text-left">
               <h3 className="text-black text-sm md:text-2xl font-black uppercase italic border-l-4 border-[#dc2626] pl-2 mb-2 leading-none font-black">Register</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-2 font-black">
                  <input value={sellName} onChange={(e) => setSellName(e.target.value)} placeholder="PRODUCT NAME" className="w-full bg-gray-50 border-2 border-black/5 p-3 rounded-xl text-xs md:text-lg outline-none focus:border-black font-black" />
                  <input type="number" value={sellPrice} onChange={(e) => setSellPrice(e.target.value)} placeholder="PRICE (BEOM)" className="w-full bg-gray-50 border-2 border-black/5 p-3 rounded-xl text-xs md:text-lg text-[#dc2626] outline-none focus:border-black font-black" />
               </div>
               <textarea value={sellDesc} onChange={(e) => setSellDesc(e.target.value)} placeholder="DESCRIPTION" className="w-full bg-gray-50 border-2 border-black/5 p-3 rounded-xl text-[10px] md:text-base font-bold h-24 outline-none focus:border-black" />
               <div className="w-full font-black">
                  <input type="file" accept="image/*" onChange={handleImageUpload} ref={fileInputRef} className="hidden" />
                  <button onClick={() => fileInputRef.current?.click()} className="w-full bg-gray-50 border-2 border-dashed border-black/10 p-6 rounded-xl text-gray-400 text-center hover:border-black transition-all">
                    {sellImg ? <img src={sellImg} className="h-20 mx-auto rounded-lg border-2 border-black" alt="P" /> : "📸 PHOTO UPLOAD"}
                  </button>
               </div>
               <button onClick={() => {if(!sellName||!sellPrice||!sellImg) return alert("Fill All Fields"); setGoods([{id:Date.now(), name:sellName, price:Number(sellPrice), img:sellImg, desc:sellDesc},...goods]); setSellName(''); setSellImg(''); alert("Registered Successfully");}} className="w-full bg-black text-white py-3 md:py-6 rounded-xl text-sm md:text-2xl border-2 border-black active:scale-95 uppercase font-black shadow-lg">{L.register} (20 BEOM)</button>
            </div>

            <div className="grid grid-cols-2 gap-3 pb-4">
              {goods.map(g => (
                <div key={g.id} className="bg-white p-3 md:p-8 rounded-[25px] md:rounded-[40px] border-2 border-black/10 shadow-md flex flex-col group transition-all hover:border-[#dc2626]">
                  <div className="w-full h-32 md:h-64 bg-gray-50 rounded-xl md:rounded-[30px] border border-black/5 mb-2 overflow-hidden flex items-center justify-center">
                    <img src={g.img} className="w-20 h-20 md:w-44 md:h-44 object-contain group-hover:scale-110 transition-transform" alt="G" />
                  </div>
                  <h4 className="text-black text-[10px] md:text-2xl uppercase font-black leading-tight line-clamp-1">{g.name}</h4>
                  <p className="text-black text-lg md:text-5xl mb-3 font-black tracking-tighter leading-none">{g.price.toLocaleString()} <span className="text-[10px] md:text-xl">BEOM</span></p>
                  <button className="w-full py-2 md:py-5 bg-black text-white rounded-lg md:rounded-[25px] text-[10px] md:text-xl border border-black active:scale-95 uppercase font-black shadow-md">Buy Now</button>
                </div>
              ))}
            </div>

            {/* 05. BUSINESS PARTNERSHIP SECTION (무삭제) */}
            <SectionHeader num="05" title={L.partnership} desc={L.partnershipDesc} />
            <div className="bg-black p-4 md:p-12 rounded-[35px] border-4 border-[#dc2626] space-y-6 text-left shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                    <img src="/kedheon-character.png" className="w-40 h-40 grayscale" alt="K" />
                </div>
                <h3 className="text-white text-xl md:text-4xl font-black italic uppercase leading-none border-l-8 border-[#dc2626] pl-4 font-black">Business Portal</h3>
                <div className="space-y-3 relative z-10 font-black">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <label className="text-[#dc2626] text-[8px] md:text-xs font-black uppercase ml-2">Company Name</label>
                            <input value={partnerCorp} onChange={(e)=>setPartnerCorp(e.target.value.toUpperCase())} placeholder="COMPANY NAME" className="w-full bg-white/5 border-2 border-white/10 p-4 rounded-xl text-white text-sm md:text-xl font-black outline-none focus:border-[#dc2626]" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[#dc2626] text-[8px] md:text-xs font-black uppercase ml-2">Contact Info</label>
                            <input value={partnerContact} onChange={(e)=>setPartnerContact(e.target.value)} placeholder="contact@example.com" className="w-full bg-white/5 border-2 border-white/10 p-4 rounded-xl text-white text-sm md:text-xl font-black outline-none focus:border-[#dc2626]" />
                        </div>
                    </div>
                    <textarea value={partnerMsg} onChange={(e)=>setPartnerMsg(e.target.value)} placeholder="PROPOSAL DETAILS" className="w-full bg-white/5 border-2 border-white/10 p-4 rounded-xl text-white text-xs md:text-lg h-32 outline-none focus:border-[#dc2626] font-bold" />
                </div>
                <button onClick={() => {if(!partnerCorp || !partnerMsg) return alert("Empty Fields"); alert("Proposal Submitted."); setPartnerCorp(''); setPartnerContact(''); setPartnerMsg('');}} className="w-full bg-[#dc2626] text-white py-4 md:py-8 rounded-2xl text-sm md:text-2xl border-2 border-[#dc2626] hover:bg-white hover:text-[#dc2626] transition-all font-black uppercase shadow-lg">
                    {L.submit}
                </button>
            </div>

            <div className="mt-4 flex justify-center gap-4 text-gray-300 text-[8px] md:text-xs font-mono font-black italic uppercase">
                <span>Infrastructure: 88-Threads</span>
                <span>Node Score: 18.02</span>
                <span>Protocol: V23.0 Sync</span>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER NAVIGATION (무삭제) */}
      <footer className="fixed bottom-4 left-3 right-3 max-w-4xl mx-auto bg-white border-2 border-black p-1 rounded-[30px] flex justify-between gap-1 z-[300] shadow-2xl font-black">
        {['KEDHEON', 'CIVIL', 'NEXUS', 'VENDOR'].map(app => (
          <button key={app} className={`flex-1 py-3 md:py-5 rounded-[20px] text-[10px] md:text-xl transition-all font-black text-center ${app === 'KEDHEON' ? 'bg-black text-white shadow-inner scale-100' : 'text-gray-300 hover:bg-gray-100 hover:text-black'}`}>
            {app}
          </button>
        ))}
      </footer>

      <div className="mt-20 opacity-20 text-black text-[9px] md:text-xl tracking-[1em] uppercase pb-20 font-black text-center">
        Kedheon master | V106.1 Final Empire | @Ohsangjo
      </div>
    </div>
  );
}
