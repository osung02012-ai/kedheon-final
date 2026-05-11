'use client';
import React, { useState, useEffect, useRef, useMemo } from 'react';

/** * [KEDHEON MASTER V111.0 - THE GRAND FINALE]
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
      { t: "Password", d: "Create strong password." },
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
  
  const [beomToken, setBeomToken] = useState(7891.88);
  const [totalRevenue, setTotalRevenue] = useState(188500);
  const [netIncome, setNetIncome] = useState(72300);

  const [qrType, setQrType] = useState('PERSONAL');
  const [bizName, setBizName] = useState('');
  const [isQrActive, setIsQrActive] = useState(false);
  const [boardType, setBoardType] = useState('CREATIVE');
  const [postCategory, setPostCategory] = useState('TECH');
  const [fanRooms, setFanRooms] = useState(['케데헌', '헌트릭스', '파이Nexus']);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newUrl, setNewUrl] = useState('');

  const [sellName, setSellName] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [sellDesc, setSellDesc] = useState('');
  const [sellImg, setSellImg] = useState(''); 
  const [goods, setGoods] = useState([
    { id: 1, name: "GOLD BADGE", price: 1000, img: "/beom-token.png", desc: "제국 시민의 명예로운 문장입니다." },
    { id: 2, name: "V23 NODE KEY", price: 5000, img: "/node-icon.png", desc: "프로토콜 보안 키" }
  ]);

  const [partnerCorp, setPartnerCorp] = useState('');
  const [partnerContact, setPartnerContact] = useState('');
  const [partnerMsg, setPartnerMsg] = useState('');

  const fileInputRef = useRef(null);
  const L = DICT[lang];
  const standardCats = ['MUSIC', 'TECH', 'ART', 'FOOD', 'TRAVEL', 'GAME', 'NEWS', 'MOVIE'];

  const currentBeomValue = useMemo(() => (0.18 * 100) + (5000 * 0.01) + 1, []);
  const redistributionAmount = useMemo(() => Math.max(totalRevenue * 0.03, netIncome * 0.08), [totalRevenue, netIncome]);

  useEffect(() => {
    setHasMounted(true);
    const saved = localStorage.getItem('KEDHEON_V111');
    if (saved) {
      try {
        const p = JSON.parse(saved);
        if (p.beomToken) setBeomToken(p.beomToken);
        if (p.fanRooms) setFanRooms(p.fanRooms);
        if (p.lang) setLang(p.lang);
      } catch (e) { console.error("Storage Error", e); }
    }
  }, []);

  useEffect(() => {
    if (hasMounted) {
      localStorage.setItem('KEDHEON_V111', JSON.stringify({ beomToken, lang, fanRooms }));
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
    setGoods([{id: Date.now(), name: sellName, price: Number(sellPrice), img: sellImg, desc: sellDesc}, ...goods]);
    setSellName(''); setSellPrice(''); setSellDesc(''); setSellImg('');
    alert("등록 완료.");
  };

  if (!hasMounted) return <div className="bg-white min-h-screen" />;

  return (
    <div className="flex flex-col items-center bg-white min-h-screen text-black font-sans w-full pb-64 font-black overflow-x-hidden selection:bg-red-50">
      
      {/* GLOBAL NAVIGATION */}
      <nav className="w-full max-w-7xl flex justify-between items-center px-4 py-3 sticky top-0 bg-white/95 backdrop-blur-md z-[250] border-b-2 border-black/5">
        <div className="flex items-center gap-3">
          <img src="/kedheon-character.png" className="w-10 h-10 rounded-xl border-2 border-black shadow-sm" alt="K" />
          <div className="text-left leading-tight">
            <h1 className="text-black text-base md:text-xl font-black italic uppercase tracking-tighter">Kedheon</h1>
            <span className="text-gray-400 text-[8px] font-mono font-bold uppercase">V111.0 MASTER</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 rounded-lg p-0.5 border border-black/5">
            <button onClick={() => setLang('KR')} className={`px-2.5 py-1 rounded-md text-[10px] md:text-xs font-black transition-all ${lang === 'KR' ? 'bg-black text-white' : 'text-gray-400'}`}>KR</button>
            <button onClick={() => setLang('EN')} className={`px-2.5 py-1 rounded-md text-[10px] md:text-xs font-black transition-all ${lang === 'EN' ? 'bg-black text-white' : 'text-gray-400'}`}>EN</button>
          </div>
          <div className="flex gap-1.5 font-black">
            <button onClick={() => setTab('ROOKIE')} className={`px-3 py-1.5 rounded-lg text-[10px] md:text-sm font-black border-2 transition-all ${tab === 'ROOKIE' ? 'bg-[#dc2626] text-white border-[#dc2626]' : 'border-black/5 text-gray-400'}`}>{L.rookie}</button>
            <button onClick={() => setTab('PIONEER')} className={`px-3 py-1.5 rounded-lg text-[10px] md:text-sm font-black border-2 transition-all ${tab === 'PIONEER' ? 'bg-black text-white border-black' : 'border-black/5 text-gray-400'}`}>{L.pioneer}</button>
          </div>
        </div>
      </nav>

      <main className="w-full max-w-5xl px-4 py-6">
        
        {tab === 'ROOKIE' ? (
          <div className="flex flex-col gap-6 text-left animate-in fade-in slide-in-from-top-4">
            <div className="flex flex-col items-center text-center gap-4 py-12 bg-gray-50 rounded-[40px] border border-black/5 relative shadow-inner">
              <img src="/kedheon-character.png" className="w-28 h-28 md:w-40 md:h-40 rounded-[30px] border-4 border-black shadow-2xl" alt="M" />
              <div className="px-4">
                <h1 className="text-black text-2xl md:text-5xl uppercase mb-1 font-black tracking-tighter">{L.invitation}</h1>
                <p className="text-[#dc2626] text-sm md:text-2xl uppercase tracking-[0.2em] border-b-4 border-[#dc2626] pb-1 inline-block font-black italic">{L.procedure}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {L.steps.map((step, i) => (
                <div key={i} className={`p-6 bg-white rounded-[25px] border-2 flex items-center gap-6 transition-all ${i === 0 ? 'border-[#dc2626] bg-red-50/5 shadow-lg scale-[1.02]' : 'border-black/5 opacity-90'}`}>
                  <span className={`text-2xl md:text-4xl font-black italic ${i === 0 ? 'text-[#dc2626]' : 'text-black opacity-20'}`}>0{i+1}</span>
                  <div className="flex-1">
                    <h3 className="text-black text-sm md:text-2xl font-black uppercase italic mb-1">{step.t}</h3>
                    <p className="text-gray-600 text-[11px] md:text-base font-bold leading-tight tracking-tight">{step.d}</p>
                    {step.link && (
                      <button onClick={() => window.open(step.link, '_blank')} className="mt-4 bg-[#dc2626] text-white px-8 py-3 rounded-2xl text-xs md:text-lg font-black uppercase hover:bg-black transition-all shadow-xl flex items-center gap-3 animate-bounce">
                        <span className="text-xl">↓</span> {L.download}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-8 bg-black text-white rounded-[30px] text-center shadow-2xl border-4 border-black">
              <p className="text-xs md:text-xl font-black italic uppercase tracking-widest text-gray-400">Invitation Code / 초대 코드</p>
              <div className="text-[#dc2626] text-4xl md:text-7xl font-black mt-2 tracking-[0.1em] drop-shadow-lg" onClick={() => {navigator.clipboard.writeText(PI_INVITE_CODE); alert("Copied!");}}>
                {PI_INVITE_CODE}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-10 py-2 text-left animate-in slide-in-from-bottom-6">
            
            {/* 00. ASSET DASHBOARD */}
            <div className="bg-gray-50 p-6 md:p-14 rounded-[45px] border-4 border-black shadow-2xl flex flex-col md:flex-row justify-between items-center relative overflow-hidden group">
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
                <img src="/beom-token.png" className="w-24 h-24 md:w-64 md:h-64 object-contain group-hover:rotate-12 transition-transform mt-4 md:mt-0 drop-shadow-2xl" alt="Beom" />
            </div>

            {/* 01. EXCHANGE TERMINAL */}
            <SectionHeader num="01" title={L.exchange} desc={L.exchangeDesc} />
            <div className="bg-white p-6 md:p-14 rounded-[35px] border-4 border-black flex flex-col md:flex-row justify-between items-center shadow-xl gap-6">
              <div className="text-left font-black w-full md:w-auto">
                <p className="text-black text-2xl md:text-5xl font-black italic uppercase mb-2 leading-none">Mainnet Node</p>
                <p className="text-gray-400 text-xs md:text-xl font-bold uppercase tracking-widest">Rate Fix: 1 Pi = 100 BEOM</p>
              </div>
              <button onClick={() => {setBeomToken(p=>p+100); setTotalRevenue(p=>p+100); alert("Exchange Success");}} className="w-full md:w-auto bg-black text-white px-10 py-5 md:px-20 md:py-10 rounded-[25px] text-sm md:text-3xl border-4 border-black active:scale-95 font-black shadow-2xl hover:bg-[#dc2626] transition-all">
                {L.convert}
              </button>
            </div>

            {/* 02. SECURE AUTH MODULE */}
            <SectionHeader num="02" title={L.auth} desc={L.authDesc} />
            <div className="bg-gray-50 p-6 md:p-14 rounded-[40px] border-2 border-black/5 flex flex-col items-center gap-6 shadow-inner">
              <div className="flex gap-3 w-full max-w-md bg-white p-1.5 rounded-2xl border-4 border-black font-black">
                <button onClick={() => { setQrType('PERSONAL'); setIsQrActive(false); }} className={`flex-1 py-4 rounded-xl text-xs md:text-lg font-black transition-all ${qrType === 'PERSONAL' ? 'bg-black text-white' : 'text-gray-400'}`}>PERSONAL</button>
                <button onClick={() => { setQrType('BUSINESS'); setIsQrActive(false); }} className={`flex-1 py-4 rounded-xl text-xs md:text-lg font-black transition-all ${qrType === 'BUSINESS' ? 'bg-black text-white' : 'text-gray-400'}`}>BUSINESS</button>
              </div>
              {qrType === 'BUSINESS' && (
                 <input value={bizName} onChange={(e) => setBizName(e.target.value.toUpperCase())} placeholder="ENTER BUSINESS NAME" className="w-full max-w-md bg-white border-4 border-black p-5 rounded-2xl text-center text-black text-base md:text-2xl font-black outline-none focus:border-[#dc2626]" />
              )}
              <div className={`relative bg-white border-8 rounded-[40px] flex items-center justify-center transition-all duration-700 shadow-2xl ${qrType === 'PERSONAL' ? 'w-48 h-48 md:w-96 md:h-96' : 'w-full max-w-3xl aspect-video'} ${isQrActive ? 'border-[#dc2626] opacity-100 scale-100' : 'opacity-20 border-black/10 scale-95'}`}>
                {isQrActive ? (
                  <div className="flex flex-col items-center p-6 gap-4">
                    <img src={qrType === 'PERSONAL' ? "/qr-personal.png" : "/qr-business.png"} className="h-full object-contain" alt="QR" />
                    <p className="text-black text-xs md:text-xl font-black italic tracking-widest uppercase">{bizName || "AUTHENTICATED"}</p>
                  </div>
                ) : <p className="text-black text-2xl md:text-[8rem] font-black uppercase italic tracking-[0.2em] animate-pulse">Locked</p>}
              </div>
              <button onClick={() => {if(beomToken < 50) return alert("BEOM Low"); setBeomToken(p=>p-50); setIsQrActive(true);}} className="w-full max-w-xl bg-black text-white py-5 md:py-10 rounded-[30px] text-sm md:text-3xl border-4 border-black active:scale-95 uppercase font-black shadow-2xl hover:bg-[#dc2626] transition-all">
                {L.activate} (50 BEOM)
              </button>
            </div>

            {/* 03. CREATIVE & FAN MODULE */}
            <SectionHeader num="03" title={L.creative} desc={L.creativeDesc} />
            <div className="bg-white p-6 md:p-14 rounded-[40px] border-4 border-black/10 space-y-6 text-left shadow-xl font-black">
              <div className="flex gap-8 border-b-4 border-gray-100 pb-4 font-black">
                 <button onClick={() => setBoardType('CREATIVE')} className={`text-base md:text-3xl uppercase font-black italic transition-all ${boardType === 'CREATIVE' ? 'text-black border-b-4 border-black pb-1' : 'text-gray-300'}`}>Creative Hub</button>
                 <button onClick={() => setBoardType('FAN')} className={`text-base md:text-3xl uppercase font-black italic transition-all ${boardType === 'FAN' ? 'text-black border-b-4 border-black pb-1' : 'text-gray-300'}`}>Fan Spirit</button>
              </div>
              <div className="space-y-4">
                 <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide font-black">
                    {standardCats.map(cat => (
                      <button key={cat} onClick={() => setPostCategory(cat)} className={`px-5 py-2.5 rounded-full text-[10px] md:text-lg font-black border-4 transition-all whitespace-nowrap ${postCategory === cat ? 'bg-black text-white border-black shadow-lg scale-105' : 'border-black/5 text-gray-400'}`}>{cat}</button>
                    ))}
                 </div>
                 <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide border-t-4 border-gray-50 pt-4 font-black">
                   {fanRooms.map(room => (
                     <button key={room} onClick={() => setPostCategory(room)} className={`px-5 py-2.5 rounded-full text-[10px] md:text-lg font-black border-4 transition-all whitespace-nowrap ${postCategory === room ? 'bg-[#dc2626] text-white border-[#dc2626] shadow-lg scale-105' : 'border-red-50 text-[#dc2626]'}`}>🚩 {room}</button>
                   ))}
                 </div>
              </div>
              <div className="space-y-3 font-black">
                <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="공유할 제목 또는 팬심 메시지" className="w-full bg-gray-50 border-4 border-black/5 p-5 rounded-2xl text-base md:text-2xl text-black outline-none focus:border-black font-black" />
                <textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="상세 내용을 기록하여 제국에 공헌하십시오." className="w-full bg-gray-50 border-4 border-black/5 p-5 rounded-2xl text-xs md:text-xl text-black h-40 outline-none focus:border-black font-bold" />
              </div>
              <button onClick={() => {if(!newTitle) return; setBeomToken(p=>p-10); alert("OK"); setNewTitle(''); setNewDesc('');}} className="w-full bg-black text-white py-5 md:py-10 rounded-[25px] text-base md:text-3xl border-4 border-black active:scale-95 uppercase font-black shadow-2xl hover:bg-[#dc2626] transition-all">{L.post} (10 BEOM)</button>
              <p className="text-gray-400 text-[10px] md:text-lg font-bold bg-gray-50 p-5 rounded-2xl italic border-l-8 border-[#dc2626]">※ {L.fanRoomDesc}</p>
            </div>

            {/* 04. MARKET MODULE */}
            <SectionHeader num="04" title={L.market} desc={L.marketDesc} />
            <div className="bg-white p-6 md:p-14 rounded-[40px] border-4 border-black/10 space-y-6 shadow-2xl text-left font-black">
               <h3 className="text-black text-base md:text-3xl font-black uppercase italic border-l-8 border-[#dc2626] pl-4 mb-4 leading-none font-black">Empire Registration</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-black">
                  <input value={sellName} onChange={(e) => setSellName(e.target.value)} placeholder="PRODUCT NAME" className="w-full bg-gray-50 border-4 border-black/5 p-5 rounded-2xl text-sm md:text-xl font-black outline-none" />
                  <input type="number" value={sellPrice} onChange={(e) => setSellPrice(e.target.value)} placeholder="PRICE" className="w-full bg-gray-50 border-4 border-black/5 p-5 rounded-2xl text-sm md:text-xl font-black text-[#dc2626] outline-none" />
               </div>
               <div className="w-full font-black">
                  <input type="file" accept="image/*" onChange={handleImageUpload} ref={fileInputRef} className="hidden" />
                  <button onClick={() => fileInputRef.current?.click()} className="w-full bg-gray-50 border-4 border-dashed border-black/10 p-12 rounded-[30px] text-gray-400 text-center hover:border-black font-black uppercase">
                    {sellImg ? <img src={sellImg} className="h-40 mx-auto rounded-2xl border-4 border-black shadow-md" alt="P" /> : "📸 PHOTO UPLOAD"}
                  </button>
               </div>
               <button onClick={handleRegisterGoods} className="w-full bg-black text-white py-6 md:py-10 rounded-[30px] text-base md:text-3xl border-4 border-black active:scale-95 uppercase font-black shadow-2xl">{L.register} (20 BEOM)</button>
               
               <div className="grid grid-cols-2 gap-4 pt-8 border-t-4 border-gray-50 font-black">
                  {goods.map(g => (
                    <div key={g.id} className="bg-white p-4 md:p-10 rounded-[35px] md:rounded-[50px] border-4 border-black/10 shadow-lg flex flex-col group transition-all hover:border-[#dc2626]">
                      <div className="w-full aspect-square bg-gray-50 rounded-[25px] md:rounded-[40px] border-2 border-black/5 mb-4 flex items-center justify-center overflow-hidden">
                        <img src={g.img} className="w-28 h-28 md:w-56 md:h-56 object-contain group-hover:scale-110 transition-transform" alt="G" />
                      </div>
                      <h4 className="text-black text-xs md:text-3xl uppercase mb-1 font-black leading-tight line-clamp-1">{g.name}</h4>
                      <p className="text-black text-xl md:text-[5rem] mb-6 font-black tracking-tighter leading-none">{g.price.toLocaleString()} <span className="text-[10px] md:text-2xl uppercase">BEOM</span></p>
                      <button className="w-full py-4 md:py-8 bg-black text-white rounded-2xl md:rounded-[30px] text-xs md:text-2xl border-2 border-black active:scale-95 uppercase font-black shadow-xl hover:bg-[#dc2626] transition-all">{L.buy}</button>
                    </div>
                  ))}
               </div>
            </div>

            {/* 05. BUSINESS PARTNERSHIP */}
            <SectionHeader num="05" title={L.partnership} desc={L.partnershipDesc} />
            <div className="bg-black p-6 md:p-16 rounded-[45px] border-8 border-[#dc2626] space-y-8 text-left shadow-2xl relative overflow-hidden font-black">
                <div className="absolute -top-10 -right-10 opacity-10 pointer-events-none"><img src="/kedheon-character.png" className="w-80 grayscale" alt="K" /></div>
                <h3 className="text-white text-2xl md:text-6xl font-black italic uppercase leading-none border-l-[12px] border-[#dc2626] pl-6 z-10 relative">Business Portal</h3>
                <div className="space-y-6 relative z-10 font-black">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <input value={partnerCorp} onChange={(e)=>setPartnerCorp(e.target.value.toUpperCase())} placeholder="CORP NAME" className="w-full bg-white/5 border-4 border-white/10 p-6 rounded-2xl text-white text-base md:text-3xl font-black outline-none focus:border-[#dc2626]" />
                        <input value={partnerContact} onChange={(e)=>setPartnerContact(e.target.value)} placeholder="CONTACT" className="w-full bg-white/5 border-4 border-white/10 p-6 rounded-2xl text-white text-base md:text-3xl font-black outline-none focus:border-[#dc2626]" />
                    </div>
                    <textarea value={partnerMsg} onChange={(e)=>setPartnerMsg(e.target.value)} placeholder="PROPOSAL DETAILS" className="w-full bg-white/5 border-4 border-white/10 p-6 rounded-2xl text-white text-xs md:text-2xl font-bold h-56 outline-none focus:border-[#dc2626]" />
                </div>
                <button onClick={() => {if(!partnerCorp || !partnerMsg) return alert("Fill All"); alert("Submitted."); setPartnerCorp(''); setPartnerContact(''); setPartnerMsg('');}} className="w-full bg-[#dc2626] text-white py-6 md:py-12 rounded-3xl text-lg md:text-4xl border-4 border-[#dc2626] hover:bg-white hover:text-[#dc2626] transition-all font-black shadow-2xl uppercase tracking-widest active:scale-95">{L.submit}</button>
            </div>

            <div className="mt-6 flex justify-center gap-8 text-gray-300 text-[9px] md:text-xl font-mono font-black italic uppercase font-black">
                <span>Infrastructure: 88-Threads</span><span>Node: 18.02</span><span>Protocol: V23.0 Sync</span>
            </div>

          </div>
        )}
      </main>

      <footer className="fixed bottom-6 left-4 right-4 max-w-5xl mx-auto bg-white border-4 border-black p-1.5 rounded-[40px] flex justify-between gap-2 z-[300] shadow-2xl font-black">
        {['KEDHEON', 'CIVIL', 'NEXUS', 'VENDOR'].map(app => (
          <button key={app} className={`flex-1 py-4 md:py-8 rounded-[30px] text-[11px] md:text-3xl transition-all font-black text-center ${app === 'KEDHEON' ? 'bg-black text-white shadow-inner scale-[1.03]' : 'text-gray-300 hover:text-black'}`}>{app}</button>
        ))}
      </footer>

      <div className="mt-24 opacity-20 text-black text-[10px] md:text-2xl tracking-[1.5em] uppercase pb-32 font-black text-center">Kedheon master | V111.0 Final Empire | @Ohsangjo</div>
    </div>
  );
}
