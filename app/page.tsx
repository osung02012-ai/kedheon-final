'use client';
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';

/** 
 * [KEDHEON MASTER V160.0 - SUPREME INTEGRATED FINAL]
 * -----------------------------------------------------------
 * 1. 테마: Pure White / Black / Red (#DC2626)
 * 2. 수정보완: 루키 01단계 파이코인 앱 다운로드 박스 100% 복구
 * 3. 빌드최적화: Turbopack 충돌 방지를 위한 특수기호/핸들러 정제
 * -----------------------------------------------------------
 */

const PI_INVITE_CODE = 'ohsangjo';

const DICT = {
  KR: {
    rookie: "ROOKIE", pioneer: "PIONEER", exchange: "EXCHANGE", auth: "SECURE AUTH", creative: "CREATIVE & FAN", market: "MARKET", partnership: "PARTNERSHIP",
    invitation: "Web3 Invitation", procedure: "Join Guide", assets: "ASSETS", activate: "ACTIVATE QR",
    convert: "1 PI CONVERT", post: "POST FEED", buy: "BUY NOW", register: "REGISTER", submit: "SUBMIT", download: "공식 앱 다운로드",
    exchangeDesc: "채굴 기여도를 BEOM으로 즉시 전환하여 가치를 보존하십시오.",
    authDesc: "제국 시민을 위한 보안 QR코드를 발급받으십시오.",
    creativeDesc: "시민의 창작물과 팬심을 공유하십시오.",
    fanRoomDesc: "팬룸 개설(500 BEOM): 90% 수익 환원 및 거버넌스 권한 부여.",
    marketDesc: "검증된 다양한 GOODS를 거래하십시오.",
    partnershipDesc: "제국과 미래를 설계할 글로벌 기업 파트너를 기다립니다.",
    steps: [
      { t: "애플리케이션 설치", d: "[Pi Network] 공식 앱을 설치하십시오.", link: "https://minepi.com/#download" },
      { t: "가입 방식 선택", d: "[Continue with phone number]를 선택하십시오." },
      { t: "국가 및 번호 설정", d: "[+82(South Korea)] 선택 후 번호를 입력하십시오." },
      { t: "보안 비밀번호 생성", d: "영문 대/소문자와 숫자를 조합하십시오." },
      { t: "실명 프로필 작성", d: "여권 영문 실명과 고유 ID를 설정하십시오." },
      { t: "초대 코드 입력", d: "초대 코드 [ ohsangjo ]를 정확히 입력하십시오." },
      { t: "비밀구절 수기 보관", d: "24개 단어는 반드시 종이에 수기로 기록하십시오." },
      { t: "채굴 버튼 활성화", d: "매일 번개 버튼을 눌러 활동을 시작하십시오." }
    ]
  }
};

const SectionHeader = ({ num, title, desc }) => (
  <div className="w-full border-t-4 border-[#dc2626] pt-10 mb-8 text-left">
    <h2 className="text-black text-3xl md:text-5xl font-black uppercase italic mb-2 border-l-[20px] border-black pl-6 tracking-tighter">
      {num}. {title}
    </h2>
    <p className="text-gray-400 text-sm md:text-2xl font-bold pl-12 italic leading-none">{desc}</p>
  </div>
);

export default function KedheonEmpireEternal() {
  const [hasMounted, setHasMounted] = useState(false);
  const [tab, setTab] = useState('PIONEER');
  
  const [beomToken, setBeomToken] = useState(7891.88);
  const [totalRevenue, setTotalRevenue] = useState(188500);
  const [netIncome] = useState(72300);

  const [qrState, setQrState] = useState({ type: 'PERSONAL', biz: '', active: false });
  const [boardType, setBoardType] = useState('CREATIVE');
  const [postCategory, setPostCategory] = useState('TECH');
  const [fanRooms] = useState(['케데헌', '헌트릭스', '파이Nexus']);
  const [feed, setFeed] = useState({ title: '', desc: '', url: '' });

  const [sellItem, setSellItem] = useState({ name: '', price: '', desc: '', img: '' });
  const [goods, setGoods] = useState([
    { id: 1, name: "GOLD BADGE", price: 1000, img: "/beom-token.png", desc: "Empire Citizen Honor" },
    { id: 2, name: "V23 NODE KEY", price: 5000, img: "/node-icon.png", desc: "88-Thread Node Key" }
  ]);

  const [partner, setPartner] = useState({ corp: '', contact: '', msg: '' });

  const fileInputRef = useRef(null);
  const L = DICT['KR'];
  const cats = ['MUSIC', 'TECH', 'ART', 'FOOD', 'TRAVEL', 'GAME', 'NEWS', 'MOVIE'];

  const redistributionAmount = useMemo(() => 
    Math.max(totalRevenue * 0.03, netIncome * 0.08), 
    [totalRevenue, netIncome]
  );

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const handleImageUpload = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSellItem(prev => ({ ...prev, img: reader.result?.toString() || '' }));
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleDownload = useCallback((url) => {
    if (typeof window !== 'undefined') {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }, []);

  const handleCopy = useCallback(() => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(PI_INVITE_CODE);
      alert("Imperial Code Copied!");
    }
  }, []);

  if (!hasMounted) return <div className="bg-white min-h-screen" />;

  return (
    <div className="flex flex-col items-center bg-white min-h-screen text-black font-sans w-full pb-96 font-black overflow-x-hidden selection:bg-red-50">
      
      {/* NAVIGATION */}
      <nav className="w-full max-w-7xl flex justify-between items-center px-6 py-6 sticky top-0 bg-white/95 backdrop-blur-2xl z-[300] border-b-8 border-black/5 shadow-lg">
        <div className="flex items-center gap-6">
          <img src="/kedheon-character.png" className="w-16 h-16 rounded-2xl border-4 border-black" alt="Empire Logo" />
          <div className="text-left leading-tight">
            <h1 className="text-black text-2xl md:text-4xl font-black italic uppercase">Kedheon</h1>
            <span className="text-gray-400 text-[10px] md:text-sm font-mono font-bold uppercase tracking-widest">V160.0 INTEGRATED</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setTab('ROOKIE')} className={`px-6 py-3 rounded-2xl text-sm md:text-2xl font-black border-4 transition-all ${tab === 'ROOKIE' ? 'bg-[#dc2626] text-white border-[#dc2626]' : 'text-gray-400 border-transparent'}`}>{L.rookie}</button>
          <button onClick={() => setTab('PIONEER')} className={`px-6 py-3 rounded-2xl text-sm md:text-2xl font-black border-4 transition-all ${tab === 'PIONEER' ? 'bg-black text-white border-black' : 'text-gray-400 border-transparent'}`}>{L.pioneer}</button>
        </div>
      </nav>

      <main className="w-full max-w-7xl px-6 py-12">
        {tab === 'ROOKIE' ? (
          <div className="flex flex-col gap-12 text-left animate-in fade-in duration-500">
            <div className="flex flex-col items-center text-center gap-10 py-24 bg-gray-50 rounded-[60px] border-4 border-black/5 relative shadow-inner overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-4 bg-[#dc2626] animate-pulse"></div>
              <img src="/kedheon-character.png" className="w-48 h-48 md:w-80 md:h-96 rounded-[40px] border-8 border-black shadow-2xl" alt="Character" />
              <div className="px-10">
                <h1 className="text-black text-5xl md:text-8xl uppercase font-black tracking-tighter leading-none">{L.invitation}</h1>
                <p className="text-[#dc2626] text-2xl md:text-6xl uppercase tracking-widest border-b-8 border-[#dc2626] pb-4 inline-block font-black italic">{L.procedure}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-8">
              {L.steps.map((step, i) => (
                <div key={i} className={`p-12 bg-white rounded-[40px] border-4 flex items-center gap-12 transition-all ${i === 0 ? 'border-[#dc2626] bg-red-50/10 shadow-xl' : 'border-black/5 opacity-90'}`}>
                  <span className={`text-6xl md:text-9xl font-black italic ${i === 0 ? 'text-[#dc2626]' : 'text-black opacity-10'}`}>0{i+1}</span>
                  <div className="flex-1">
                    <h3 className="text-black text-3xl md:text-6xl font-black uppercase italic mb-4">{step.t}</h3>
                    <p className="text-gray-600 text-base md:text-4xl font-bold leading-snug">{step.d}</p>
                    {/* [복구 완료] 파이코인 앱 다운로드 박스 */}
                    {step.link && (
                      <div className="mt-10 p-10 bg-gray-50 rounded-[30px] border-4 border-dashed border-[#dc2626] flex flex-col md:flex-row items-center justify-between gap-8">
                         <p className="text-black text-xl md:text-3xl font-black uppercase italic">Official Link Synchronized</p>
                         <button onClick={() => handleDownload(step.link)} className="bg-[#dc2626] text-white px-12 py-6 rounded-full text-xl md:text-4xl font-black uppercase shadow-2xl hover:bg-black transition-all">
                           &darr; {L.download}
                         </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-20 bg-black text-white rounded-[60px] text-center shadow-2xl border-8 border-black">
              <p className="text-2xl md:text-6xl font-black italic text-gray-500 uppercase tracking-widest">Imperial Code</p>
              <div className="text-[#dc2626] text-6xl md:text-9xl font-black tracking-widest cursor-pointer" onClick={handleCopy}>
                {PI_INVITE_CODE}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-24 py-8 text-left animate-in slide-in-from-bottom-10 duration-500">
            {/* 00. ASSET DASHBOARD */}
            <div className="bg-gray-50 p-12 md:p-32 rounded-[80px] border-8 border-black shadow-2xl flex flex-col md:flex-row justify-between items-center relative group overflow-hidden">
                <div className="text-left z-10 space-y-10 w-full md:w-auto font-black">
                  <h3 className="text-gray-400 text-lg md:text-5xl uppercase tracking-widest leading-none">{L.assets}</h3>
                  <p className="text-black text-7xl md:text-[10rem] tracking-tighter leading-none">
                    {Math.floor(beomToken).toLocaleString()}
                    <span className="text-4xl opacity-10">.{beomToken.toFixed(2).split('.')[1]}</span> 
                    <span className="ml-5 text-4xl md:text-8xl italic uppercase text-[#dc2626]">BEOM</span>
                  </p>
                  <div className="flex flex-wrap gap-8 pt-10">
                    <div className="bg-black text-white px-8 py-4 rounded-3xl text-sm md:text-4xl font-mono shadow-xl">NODE: 18.02 SCORE</div>
                    <div className="bg-[#dc2626] text-white px-8 py-4 rounded-3xl text-sm md:text-4xl font-mono animate-pulse shadow-xl">RETURN: {redistributionAmount.toLocaleString()}</div>
                  </div>
                </div>
                <img src="/beom-token.png" className="w-56 h-56 md:w-96 md:h-96 object-contain group-hover:rotate-12 transition-all duration-700 mt-10 md:mt-0" alt="Beom" />
            </div>

            {/* 01. EXCHANGE */}
            <SectionHeader num="01" title={L.exchange} desc={L.exchangeDesc} />
            <div className="bg-white p-12 md:p-24 rounded-[60px] border-8 border-black flex flex-col md:flex-row justify-between items-center shadow-2xl gap-16 group hover:bg-gray-50 transition-all">
              <div className="text-left font-black w-full md:w-auto">
                <p className="text-black text-5xl md:text-8xl font-black italic uppercase leading-none mb-6">Terminal</p>
                <div className="flex items-center gap-4"><span className="w-6 h-6 bg-green-500 rounded-full animate-ping"></span><p className="text-gray-400 text-lg md:text-4xl font-bold uppercase tracking-widest">Protocol V23 Ready</p></div>
              </div>
              <button onClick={() => {setBeomToken(p=>p+100); setTotalRevenue(p=>p+100); alert("CONVERT SUCCESS");}} className="w-full md:w-auto bg-black text-white px-16 py-10 md:py-16 rounded-full text-2xl md:text-6xl font-black shadow-2xl hover:bg-[#dc2626] transition-all">
                {L.convert}
              </button>
            </div>

            {/* 02. AUTH */}
            <SectionHeader num="02" title={L.auth} desc={L.authDesc} />
            <div className="bg-gray-50 p-12 md:p-24 rounded-[60px] border-4 border-black/5 flex flex-col items-center gap-16 shadow-inner">
              <div className="flex gap-4 w-full max-w-4xl bg-white p-3 rounded-[40px] border-4 border-black font-black">
                <button onClick={() => setQrState({ ...qrState, type: 'PERSONAL', active: false })} className={`flex-1 py-10 rounded-3xl text-xl md:text-4xl font-black transition-all ${qrState.type === 'PERSONAL' ? 'bg-black text-white shadow-xl' : 'text-gray-300'}`}>PERSONAL</button>
                <button onClick={() => setQrState({ ...qrState, type: 'BUSINESS', active: false })} className={`flex-1 py-10 rounded-3xl text-xl md:text-4xl font-black transition-all ${qrState.type === 'BUSINESS' ? 'bg-black text-white shadow-xl' : 'text-gray-300'}`}>BUSINESS</button>
              </div>
              {qrState.type === 'BUSINESS' && (
                 <input value={qrState.biz} onChange={(e) => setQrState({ ...qrState, biz: e.target.value.toUpperCase() })} placeholder="BIZ NAME" className="w-full max-w-4xl bg-white border-4 border-black p-10 rounded-3xl text-center text-3xl md:text-6xl font-black outline-none focus:border-[#dc2626]" />
              )}
              <div className={`relative bg-white border-8 rounded-[40px] flex items-center justify-center transition-all duration-700 shadow-2xl w-64 h-64 md:w-[40rem] md:h-[40rem] ${qrState.active ? 'border-[#dc2626] opacity-100' : 'opacity-10 grayscale blur-sm'}`}>
                {qrState.active ? (
                  <div className="flex flex-col items-center p-10 gap-6">
                    <img src={qrState.type === 'PERSONAL' ? "/qr-personal.png" : "/qr-business.png"} className="w-full h-full object-contain" alt="Citizen QR" />
                    <p className="text-black text-xl md:text-4xl font-black italic bg-gray-100 px-10 py-2 rounded-full">{qrState.biz || "AUTHENTICATED"}</p>
                  </div>
                ) : <p className="text-black text-4xl md:text-6xl font-black uppercase italic animate-pulse">Encoded</p>}
              </div>
              <button onClick={() => {if(beomToken < 50) return alert("LOW ASSETS"); setBeomToken(p=>p-50); setQrState({ ...qrState, active: true });}} className="w-full max-w-4xl bg-black text-white py-12 rounded-full text-2xl md:text-6xl font-black shadow-2xl hover:bg-[#dc2626] transition-all">
                {L.activate} (50 BEOM)
              </button>
            </div>

            {/* 03. CREATIVE */}
            <SectionHeader num="03" title={L.creative} desc={L.creativeDesc} />
            <div className="bg-white p-12 md:p-24 rounded-[60px] border-4 border-black/10 space-y-16 text-left shadow-2xl font-black">
              <div className="flex gap-10 border-b-4 border-gray-100 pb-10">
                 <button onClick={() => setBoardType('CREATIVE')} className={`text-2xl md:text-6xl uppercase font-black italic transition-all ${boardType === 'CREATIVE' ? 'text-black border-b-8 border-black pb-2' : 'text-gray-300'}`}>Creative</button>
                 <button onClick={() => setBoardType('FAN')} className={`text-2xl md:text-6xl uppercase font-black italic transition-all ${boardType === 'FAN' ? 'text-black border-b-8 border-black pb-2' : 'text-gray-300'}`}>Fan Rooms</button>
              </div>
              <div className="space-y-10 overflow-hidden">
                 <div className="flex gap-4 overflow-x-auto pb-4">{cats.map(cat => (<button key={cat} onClick={() => setPostCategory(cat)} className={`px-8 py-3 rounded-2xl text-lg md:text-3xl font-black border-2 whitespace-nowrap transition-all ${postCategory === cat ? 'bg-black text-white border-black shadow-lg' : 'text-gray-400 border-gray-100'}`}>{cat}</button>))}</div>
                 <div className="flex gap-4 overflow-x-auto pb-4 border-t-2 border-gray-50 pt-10">{fanRooms.map(room => (<button key={room} onClick={() => setPostCategory(room)} className={`px-8 py-3 rounded-2xl text-lg md:text-3xl font-black border-2 whitespace-nowrap transition-all ${postCategory === room ? 'bg-[#dc2626] text-white border-[#dc2626] shadow-lg' : 'text-[#dc2626] border-red-50'}`}>&nbsp;🚩 {room}</button>))}</div>
              </div>
              <div className="space-y-6">
                <input value={feed.title} onChange={(e) => setFeed({ ...feed, title: e.target.value })} placeholder="TITLE" className="w-full bg-gray-50 border-4 border-black/5 p-8 rounded-3xl text-2xl md:text-5xl font-black outline-none focus:border-black transition-all" />
                <textarea value={feed.desc} onChange={(e) => setFeed({ ...feed, desc: e.target.value })} placeholder="WRITE SOMETHING..." className="w-full bg-gray-50 border-4 border-black/5 p-8 rounded-3xl text-xl md:text-4xl font-bold h-96 outline-none focus:border-black transition-all leading-relaxed" />
              </div>
              <button onClick={() => {if(!feed.title) return alert("EMPTY"); setBeomToken(p=>p-10); alert("POSTED"); setFeed({title:'', desc:'', url:''});}} className="w-full bg-black text-white py-12 rounded-full text-2xl md:text-6xl font-black shadow-2xl hover:bg-[#dc2626] transition-all">{L.post} (10 BEOM)</button>
            </div>

            {/* 04. MARKET */}
            <SectionHeader num="04" title={L.market} desc={L.marketDesc} />
            <div className="bg-white p-12 md:p-24 rounded-[60px] border-4 border-black/10 space-y-16 shadow-2xl text-left font-black">
               <h3 className="text-black text-3xl md:text-7xl font-black uppercase italic border-l-[24px] border-[#dc2626] pl-10">Empire Market</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10 font-black">
                  <input value={sellItem.name} onChange={(e) => setSellItem({ ...sellItem, name: e.target.value })} placeholder="ITEM NAME" className="w-full bg-gray-50 border-4 border-black/5 p-8 rounded-3xl text-xl md:text-4xl font-black outline-none focus:border-black" />
                  <input type="number" value={sellItem.price} onChange={(e) => setSellItem({ ...sellItem, price: e.target.value })} placeholder="PRICE (BEOM)" className="w-full bg-gray-50 border-4 border-black/5 p-8 rounded-3xl text-xl md:text-4xl font-black text-[#dc2626] outline-none" />
               </div>
               <div className="w-full">
                  <input type="file" accept="image/*" onChange={handleImageUpload} ref={fileInputRef} className="hidden" />
                  <button onClick={() => fileInputRef.current?.click()} className="w-full bg-gray-50 border-4 border-dashed border-black/10 p-20 rounded-[40px] text-gray-400 text-center hover:border-black hover:text-black transition-all font-black text-xl md:text-6xl shadow-inner overflow-hidden">
                    {sellItem.img ? <img src={sellItem.img} className="h-64 md:h-96 mx-auto rounded-3xl border-4 border-black shadow-lg" alt="Preview" /> : "📸 UPLOAD PRODUCT IMAGE"}
                  </button>
               </div>
               <button onClick={()=>{
                 if(!sellItem.name || !sellItem.price || !sellItem.img) return alert("FILL ALL"); 
                 setGoods([{...sellItem, id:Date.now(), price:Number(sellItem.price)}, ...goods]); 
                 setSellItem({name:'',price:'',desc:'',img:''}); 
                 alert("REGISTERED");
               }} className="w-full bg-black text-white py-12 rounded-full text-2xl md:text-6xl font-black shadow-2xl hover:bg-[#dc2626] transition-all">{L.register} (20 BEOM)</button>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-20 border-t-8 border-gray-50">
                  {goods.map(g => (
                    <div key={g.id} className="bg-white p-6 md:p-10 rounded-[50px] border-4 border-black/5 shadow-2xl flex flex-col group transition-all hover:border-[#dc2626] relative overflow-hidden">
                      <div className="w-full aspect-square bg-gray-100 rounded-[40px] mb-8 overflow-hidden flex items-center justify-center relative shadow-inner">
                        <div className="absolute top-6 right-6 bg-black text-white px-5 py-2 rounded-full text-xs md:text-2xl font-black shadow-lg z-20">VERIFIED</div>
                        <img src={g.img} className="w-48 h-48 md:w-80 md:h-80 object-contain group-hover:scale-110 transition-transform duration-700" alt="Item" />
                      </div>
                      <h4 className="text-black text-2xl md:text-5xl uppercase mb-4 font-black truncate">{g.name}</h4>
                      <div className="mt-auto">
                        <p className="text-black text-4xl md:text-7xl mb-10 font-black">{Number(g.price).toLocaleString()} <span className="text-xl md:text-4xl text-[#dc2626]">BEOM</span></p>
                        <button onClick={()=>alert("Connecting Terminal...")} className="w-full py-8 bg-black text-white rounded-full text-xl md:text-4xl font-black shadow-xl hover:bg-[#dc2626] transition-all"> {L.buy} </button>
                      </div>
                    </div>
                  ))}
               </div>
            </div>

            {/* 05. PARTNERSHIP */}
            <SectionHeader num="05" title={L.partnership} desc={L.partnershipDesc} />
            <div className="bg-black p-12 md:p-24 rounded-[60px] border-[24px] border-[#dc2626] space-y-16 text-left shadow-2xl relative overflow-hidden font-black">
                <div className="absolute -top-40 -right-40 opacity-10 pointer-events-none select-none">
                  <img src="/kedheon-character.png" className="w-[40rem] h-[40rem] grayscale" alt="Char" />
                </div>
                <h3 className="text-white text-4xl md:text-9xl font-black italic border-l-[32px] border-[#dc2626] pl-10 z-10 relative uppercase">Portal</h3>
                <div className="space-y-10 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <input value={partner.corp} onChange={(e)=>setPartner({...partner, corp: e.target.value.toUpperCase()})} placeholder="CORP NAME" className="w-full bg-white/10 border-4 border-white/10 p-8 rounded-3xl text-white text-xl md:text-5xl font-black outline-none focus:border-[#dc2626]" />
                        <input value={partner.contact} onChange={(e)=>setPartner({...partner, contact: e.target.value})} placeholder="CONTACT INFO" className="w-full bg-white/10 border-4 border-white/10 p-8 rounded-3xl text-white text-xl md:text-5xl font-black outline-none focus:border-[#dc2626]" />
                    </div>
                    <textarea value={partner.msg} onChange={(e)=>setPartner({...partner, msg: e.target.value})} placeholder="DESCRIBE YOUR VISION..." className="w-full bg-white/10 border-4 border-white/10 p-10 rounded-[50px] text-white text-lg md:text-4xl font-bold h-96 outline-none focus:border-[#dc2626] transition-all leading-relaxed" />
                </div>
                <button onClick={()=>{if(!partner.corp || !partner.msg) return alert("EMPTY"); alert("SUBMITTED"); setPartner({corp:'', contact:'', msg:''});}} className="w-full bg-[#dc2626] text-white py-12 md:py-20 rounded-full text-3xl md:text-8xl border-8 border-[#dc2626] hover:bg-white hover:text-[#dc2626] transition-all font-black shadow-2xl active:scale-95 leading-none uppercase">{L.submit}</button>
            </div>

            {/* 🛰️ INFRA BAR */}
            <div className="mt-20 py-12 px-16 bg-gray-100 rounded-[50px] flex flex-wrap justify-center md:justify-between items-center gap-10 border-4 border-black/5 shadow-inner font-black">
                <div className="flex items-center gap-6">
                  <div className="w-8 h-8 bg-red-600 rounded-full animate-ping"></div>
                  <span className="text-black text-2xl md:text-5xl font-mono uppercase tracking-tighter">Infrastructure: 88-Threads Xeon Node</span>
                </div>
                <div className="flex items-center gap-10 uppercase text-xs md:text-4xl text-gray-400 font-black">
                  <span>Reliability: 18.02</span>
                  <span>Master: Lord @Ohsangjo</span>
                </div>
            </div>
          </div>
        )}
      </main>

      {/* 📱 FOOTER */}
      <footer className="fixed bottom-10 left-6 right-6 max-w-7xl mx-auto bg-white border-8 border-black p-4 rounded-[60px] flex justify-between gap-4 z-[500] shadow-2xl font-black">
        {['KEDHEON', 'CIVIL', 'NEXUS', 'VENDOR'].map(app => (
          <button key={app} className={`flex-1 py-12 rounded-[45px] text-xs md:text-5xl transition-all font-black text-center leading-none ${app === 'KEDHEON' ? 'bg-black text-white scale-[1.05] shadow-lg' : 'text-gray-300 hover:text-black hover:scale-105'}`}>{app}</button>
        ))}
      </footer>

      {/* 🐯 WATERMARK */}
      <div className="mt-40 opacity-5 text-black text-xl md:text-[10rem] tracking-[4em] uppercase pb-96 font-black text-center select-none pointer-events-none leading-none"> Kedheon Master | Lord Ohsangjo </div>
    </div>
  );
}
