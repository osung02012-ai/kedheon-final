'use client';
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';

/** 
 * [KEDHEON MASTER V160.0 - SUPREME STABLE FINAL]
 * -----------------------------------------------------------
 * 1. 테마: Pure White / Black / Red (#DC2626)
 * 2. 복구: 루키 01단계 파이코인 공식 앱 다운로드 박스 100% 포함
 * 3. 인프라: Next.js 16 Turbopack 빌드 규격 완전 준수
 * -----------------------------------------------------------
 */

const PI_INVITE_CODE = 'ohsangjo';

const DICT = {
  KR: {
    rookie: "ROOKIE",
    pioneer: "PIONEER",
    exchange: "EXCHANGE",
    auth: "SECURE AUTH",
    creative: "CREATIVE & FAN",
    market: "MARKET",
    partnership: "PARTNERSHIP",
    invitation: "Web3 Invitation",
    procedure: "Join Guide",
    assets: "ASSETS",
    activate: "ACTIVATE QR",
    convert: "1 PI CONVERT",
    post: "POST FEED",
    buy: "BUY NOW",
    register: "REGISTER",
    submit: "SUBMIT",
    download: "공식 앱 다운로드",
    exchangeDesc: "Convert mining contribution to BEOM and preserve value.",
    authDesc: "Get your secure QR code for the Empire.",
    creativeDesc: "Share your creations and fan spirit.",
    fanRoomDesc: "Fan Room (500 BEOM): 90% Revenue Return.",
    marketDesc: "Trade verified products in the Empire.",
    partnershipDesc: "Global partners for the future Empire.",
    steps: [
      { t: "애플리케이션 설치", d: "[Pi Network] 공식 앱을 설치하십시오.", link: "https://minepi.com/#download" },
      { t: "가입 방식 선택", d: "Continue with phone number 가입 방식을 선택하십시오." },
      { t: "국가 및 번호 설정", d: "+82(South Korea) 선택 후 번호를 입력하십시오." },
      { t: "보안 비밀번호 생성", d: "영문 대/소문자와 숫자를 조합하십시오." },
      { t: "실명 프로필 작성", d: "여권 영문 실명과 고유 ID를 설정하십시오." },
      { t: "초대 코드 입력", d: "초대 코드 ohsangjo를 정확히 입력하십시오." },
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
    { id: 1, name: "GOLD BADGE", price: 1000, img: "/beom-token.png", desc: "Empire Honor" },
    { id: 2, name: "V23 NODE KEY", price: 5000, img: "/node-icon.png", desc: "Node Key" }
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
      <nav className="w-full max-w-7xl flex justify-between items-center px-6 py-6 sticky top-0 bg-white/95 backdrop-blur-2xl z-[300] border-b-8 border-black/5 shadow-md">
        <div className="flex items-center gap-6">
          <img src="/kedheon-character.png" className="w-16 h-16 rounded-2xl border-4 border-black" alt="Empire" />
          <div className="text-left leading-tight font-black">
            <h1 className="text-black text-2xl md:text-4xl italic uppercase">Kedheon</h1>
            <span className="text-gray-400 text-xs md:text-sm font-mono tracking-widest">V160.0 FINAL</span>
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
            <div className="flex flex-col items-center text-center gap-10 py-24 bg-gray-50 rounded-3xl border-4 border-black/5 relative shadow-inner overflow-hidden font-black">
              <div className="absolute top-0 left-0 w-full h-4 bg-[#dc2626]"></div>
              <img src="/kedheon-character.png" className="w-48 h-48 md:w-80 md:h-96 rounded-2xl border-8 border-black shadow-xl" alt="Character" />
              <div className="px-10">
                <h1 className="text-black text-5xl md:text-8xl uppercase tracking-tighter leading-none">{L.invitation}</h1>
                <p className="text-[#dc2626] text-2xl md:text-6xl uppercase tracking-widest border-b-8 border-[#dc2626] pb-4 inline-block italic">{L.procedure}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-8">
              {L.steps.map((step, i) => (
                <div key={i} className={`p-10 bg-white rounded-3xl border-4 flex flex-col gap-6 transition-all ${i === 0 ? 'border-[#dc2626] bg-red-50/10 shadow-lg' : 'border-black/5 opacity-90'}`}>
                  <div className="flex items-center gap-10">
                    <span className={`text-6xl md:text-9xl font-black italic ${i === 0 ? 'text-[#dc2626]' : 'text-black opacity-10'}`}>0{i+1}</span>
                    <div className="flex-1">
                      <h3 className="text-black text-3xl md:text-6xl font-black uppercase italic mb-2">{step.t}</h3>
                      <p className="text-gray-600 text-base md:text-4xl font-bold leading-snug">{step.d}</p>
                    </div>
                  </div>
                  {/* [복구 완료] 파이코인 공식 앱 다운로드 박스 - 루키 01단계 필수 표시 */}
                  {step.link && (
                    <div className="w-full p-8 bg-gray-50 rounded-2xl border-4 border-dashed border-[#dc2626] flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="text-left font-black uppercase">
                        <p className="text-black text-xl md:text-4xl italic leading-none">Empire Sync Link</p>
                        <p className="text-gray-400 text-sm md:text-xl font-bold mt-2">Official App Download</p>
                      </div>
                      <button onClick={() => handleDownload(step.link)} className="w-full md:w-auto bg-[#dc2626] text-white px-10 py-5 rounded-full text-xl md:text-4xl font-black uppercase shadow-xl hover:bg-black transition-all">
                        &darr; {L.download}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="p-20 bg-black text-white rounded-3xl text-center shadow-2xl border-8 border-black font-black">
              <p className="text-2xl md:text-6xl italic text-gray-500 uppercase tracking-widest">Imperial Code</p>
              <div className="text-[#dc2626] text-6xl md:text-9xl tracking-widest cursor-pointer hover:scale-105 transition-transform" onClick={handleCopy}>
                {PI_INVITE_CODE}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-24 py-8 text-left animate-in slide-in-from-bottom-5 duration-500 font-black">
            {/* ASSET DASHBOARD */}
            <div className="bg-gray-50 p-12 md:p-32 rounded-3xl border-8 border-black shadow-2xl flex flex-col md:flex-row justify-between items-center relative group overflow-hidden">
                <div className="text-left z-10 space-y-10 w-full md:w-auto">
                  <h3 className="text-gray-400 text-lg md:text-5xl uppercase tracking-widest leading-none">{L.assets}</h3>
                  <p className="text-black text-7xl md:text-9xl tracking-tighter leading-none">
                    {Math.floor(beomToken).toLocaleString()}
                    <span className="text-4xl opacity-10">.{beomToken.toFixed(2).split('.')[1]}</span> 
                    <span className="ml-5 text-4xl md:text-8xl italic uppercase text-[#dc2626]">BEOM</span>
                  </p>
                  <div className="flex flex-wrap gap-8 pt-10 font-black">
                    <div className="bg-black text-white px-8 py-4 rounded-2xl text-sm md:text-4xl font-mono shadow-xl transition-transform hover:scale-105">NODE: 18.02 SCORE</div>
                    <div className="bg-[#dc2626] text-white px-8 py-4 rounded-2xl text-sm md:text-4xl font-mono shadow-xl transition-transform hover:scale-105">RETURN: {redistributionAmount.toLocaleString()}</div>
                  </div>
                </div>
                <img src="/beom-token.png" className="w-56 h-56 md:w-96 md:h-96 object-contain group-hover:rotate-6 transition-all duration-700 mt-10 md:mt-0" alt="Token" />
            </div>

            {/* EXCHANGE */}
            <SectionHeader num="01" title={L.exchange} desc={L.exchangeDesc} />
            <div className="bg-white p-12 md:p-24 rounded-3xl border-8 border-black flex flex-col md:flex-row justify-between items-center shadow-xl gap-16 group hover:bg-gray-50 transition-all">
              <div className="text-left leading-tight font-black w-full md:w-auto">
                <p className="text-black text-5xl md:text-8xl italic uppercase mb-6 group-hover:text-[#dc2626]">Terminal</p>
                <div className="flex items-center gap-4 font-black"><span className="w-6 h-6 bg-green-500 rounded-full animate-ping"></span><p className="text-gray-400 text-lg md:text-4xl uppercase tracking-widest">Protocol V23 Ready</p></div>
              </div>
              <button onClick={() => {setBeomToken(p=>p+100); setTotalRevenue(p=>p+100); alert("SUCCESS");}} className="w-full md:w-auto bg-black text-white px-16 py-10 md:py-16 rounded-full text-2xl md:text-6xl font-black shadow-2xl hover:bg-[#dc2626] transition-all">
                {L.convert}
              </button>
            </div>

            {/* AUTH */}
            <SectionHeader num="02" title={L.auth} desc={L.authDesc} />
            <div className="bg-gray-50 p-12 md:p-24 rounded-3xl border-4 border-black/5 flex flex-col items-center gap-16 shadow-inner font-black">
              <div className="flex gap-4 w-full max-w-4xl bg-white p-3 rounded-2xl border-4 border-black">
                <button onClick={() => setQrState({ ...qrState, type: 'PERSONAL', active: false })} className={`flex-1 py-10 rounded-xl text-xl md:text-4xl font-black transition-all ${qrState.type === 'PERSONAL' ? 'bg-black text-white' : 'text-gray-300'}`}>PERSONAL</button>
                <button onClick={() => setQrState({ ...qrState, type: 'BUSINESS', active: false })} className={`flex-1 py-10 rounded-xl text-xl md:text-4xl font-black transition-all ${qrState.type === 'BUSINESS' ? 'bg-black text-white' : 'text-gray-300'}`}>BUSINESS</button>
              </div>
              {qrState.type === 'BUSINESS' && (
                 <input value={qrState.biz} onChange={(e) => setQrState({ ...qrState, biz: e.target.value.toUpperCase() })} placeholder="BIZ NAME" className="w-full max-w-4xl bg-white border-4 border-black p-10 rounded-2xl text-center text-3xl md:text-6xl font-black outline-none" />
              )}
              <div className={`relative bg-white border-8 rounded-2xl flex items-center justify-center transition-all duration-700 shadow-2xl w-64 h-64 md:w-[40rem] md:h-[40rem] ${qrState.active ? 'border-[#dc2626] opacity-100' : 'opacity-10 grayscale blur-sm'}`}>
                {qrState.active ? (
                  <div className="flex flex-col items-center p-10 gap-6">
                    <img src={qrState.type === 'PERSONAL' ? "/qr-personal.png" : "/qr-business.png"} className="w-full h-full object-contain" alt="QR" />
                    <p className="text-black text-xl md:text-4xl font-black italic bg-gray-100 px-10 py-2 rounded-full">{qrState.biz || "AUTHENTICATED"}</p>
                  </div>
                ) : <p className="text-black text-4xl md:text-6xl font-black uppercase italic animate-pulse">Encoded</p>}
              </div>
              <button onClick={() => {if(beomToken < 50) return alert("LOW ASSETS"); setBeomToken(p=>p-50); setQrState({ ...qrState, active: true });}} className="w-full max-w-4xl bg-black text-white py-12 rounded-full text-2xl md:text-6xl font-black shadow-lg">
                {L.activate} (50 BEOM)
              </button>
            </div>

            {/* CREATIVE */}
            <SectionHeader num="03" title={L.creative} desc={L.creativeDesc} />
            <div className="bg-white p-12 md:p-24 rounded-3xl border-4 border-black/10 space-y-16 text-left shadow-xl font-black">
              <div className="flex gap-10 border-b-4 border-gray-100 pb-10">
                 <button onClick={() => setBoardType('CREATIVE')} className={`text-2xl md:text-6xl uppercase font-black italic ${boardType === 'CREATIVE' ? 'text-black border-b-8 border-black' : 'text-gray-300'}`}>Creative</button>
                 <button onClick={() => setBoardType('FAN')} className={`text-2xl md:text-6xl uppercase font-black italic ${boardType === 'FAN' ? 'text-black border-b-8 border-black' : 'text-gray-300'}`}>Fan Rooms</button>
              </div>
              <div className="space-y-6">
                <input value={feed.title} onChange={(e) => setFeed({ ...feed, title: e.target.value })} placeholder="TITLE" className="w-full bg-gray-50 border-4 border-black/5 p-8 rounded-2xl text-2xl md:text-5xl font-black outline-none focus:border-black" />
                <textarea value={feed.desc} onChange={(e) => setFeed({ ...feed, desc: e.target.value })} placeholder="WRITE SOMETHING..." className="w-full bg-gray-50 border-4 border-black/5 p-8 rounded-2xl text-xl md:text-4xl font-bold h-96 outline-none focus:border-black leading-relaxed" />
              </div>
              <button onClick={() => {if(!feed.title) return alert("EMPTY"); setBeomToken(p=>p-10); alert("POSTED"); setFeed({title:'', desc:'', url:''});}} className="w-full bg-black text-white py-12 rounded-full text-2xl md:text-6xl font-black shadow-xl hover:bg-[#dc2626] transition-all">{L.post} (10 BEOM)</button>
              <p className="text-gray-400 text-lg md:text-3xl font-bold bg-gray-50 p-8 rounded-2xl border-l-[24px] border-[#dc2626] italic">Note: {L.fanRoomDesc}</p>
            </div>

            {/* MARKET */}
            <SectionHeader num="04" title={L.market} desc={L.marketDesc} />
            <div className="bg-white p-12 md:p-24 rounded-3xl border-4 border-black/10 space-y-16 shadow-xl text-left font-black">
               <h3 className="text-black text-3xl md:text-7xl font-black uppercase italic border-l-[24px] border-[#dc2626] pl-10">Market</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10 font-black">
                  <input value={sellItem.name} onChange={(e) => setSellItem({ ...sellItem, name: e.target.value })} placeholder="ITEM NAME" className="w-full bg-gray-50 border-4 border-black/5 p-8 rounded-2xl text-xl md:text-4xl font-black outline-none" />
                  <input type="number" value={sellItem.price} onChange={(e) => setSellItem({ ...sellItem, price: e.target.value })} placeholder="PRICE" className="w-full bg-gray-50 border-4 border-black/5 p-8 rounded-2xl text-xl md:text-4xl font-black text-[#dc2626] outline-none" />
               </div>
               <div className="w-full">
                  <input type="file" accept="image/*" onChange={handleImageUpload} ref={fileInputRef} className="hidden" />
                  <button onClick={() => fileInputRef.current?.click()} className="w-full bg-gray-50 border-4 border-dashed border-black/10 p-20 rounded-3xl text-gray-400 text-center hover:border-black transition-all font-black text-xl md:text-6xl shadow-inner overflow-hidden">
                    {sellItem.img ? <img src={sellItem.img} className="h-64 md:h-96 mx-auto rounded-xl border-4 border-black shadow-lg" alt="Preview" /> : "UPLOAD PRODUCT IMAGE"}
                  </button>
               </div>
               <button onClick={()=>{
                 if(!sellItem.name || !sellItem.price || !sellItem.img) return alert("EMPTY"); 
                 setGoods([{...sellItem, id:Date.now(), price:Number(sellItem.price)}, ...goods]); 
                 setSellItem({name:'',price:'',desc:'',img:''}); 
                 alert("REGISTERED");
               }} className="w-full bg-black text-white py-12 rounded-full text-2xl md:text-6xl font-black shadow-lg">{L.register} (20 BEOM)</button>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-20 border-t-8 border-gray-50">
                  {goods.map(g => (
                    <div key={g.id} className="bg-white p-6 md:p-10 rounded-3xl border-4 border-black/5 shadow-xl flex flex-col group transition-all hover:border-[#dc2626] relative overflow-hidden font-black">
                      <div className="w-full aspect-square bg-gray-100 rounded-2xl mb-8 overflow-hidden flex items-center justify-center relative shadow-inner">
                        <div className="absolute top-6 right-6 bg-black text-white px-5 py-2 rounded-full text-xs md:text-2xl font-black shadow-lg z-20">VERIFIED</div>
                        <img src={g.img} className="w-48 h-48 md:w-80 md:h-80 object-contain group-hover:scale-110 transition-transform duration-700" alt="Item" />
                      </div>
                      <h4 className="text-black text-2xl md:text-5xl uppercase mb-4 font-black truncate">{g.name}</h4>
                      <div className="mt-auto">
                        <p className="text-black text-4xl md:text-7xl mb-10 font-black leading-none">{Number(g.price).toLocaleString()} <span className="text-xl md:text-4xl text-[#dc2626]">BEOM</span></p>
                        <button onClick={()=>alert("Connecting Terminal...")} className="w-full py-8 bg-black text-white rounded-full text-xl md:text-4xl font-black shadow-xl"> {L.buy} </button>
                      </div>
                    </div>
                  ))}
               </div>
            </div>

            {/* PARTNERSHIP */}
            <SectionHeader num="05" title={L.partnership} desc={L.partnershipDesc} />
            <div className="bg-black p-12 md:p-24 rounded-3xl border-[20px] border-[#dc2626] space-y-16 text-left shadow-2xl relative overflow-hidden font-black">
                <div className="absolute -top-40 -right-40 opacity-10 pointer-events-none select-none grayscale">
                  <img src="/kedheon-character.png" className="w-96 h-96" alt="Char" />
                </div>
                <h3 className="text-white text-4xl md:text-9xl font-black italic border-l-[32px] border-[#dc2626] pl-10 z-10 relative uppercase leading-none font-black">Portal</h3>
                <div className="space-y-10 relative z-10 font-black">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 font-black">
                        <input value={partner.corp} onChange={(e)=>setPartner({...partner, corp: e.target.value.toUpperCase()})} placeholder="CORP NAME" className="w-full bg-white/10 border-4 border-white/10 p-8 rounded-2xl text-white text-xl md:text-5xl font-black outline-none focus:border-[#dc2626]" />
                        <input value={partner.contact} onChange={(e)=>setPartner({...partner, contact: e.target.value})} placeholder="CONTACT" className="w-full bg-white/10 border-4 border-white/10 p-8 rounded-2xl text-white text-xl md:text-5xl font-black outline-none focus:border-[#dc2626]" />
                    </div>
                    <textarea value={partner.msg} onChange={(e)=>setPartner({...partner, msg: e.target.value})} placeholder="VISION..." className="w-full bg-white/10 border-4 border-white/10 p-10 rounded-3xl text-white text-lg md:text-4xl font-bold h-96 outline-none focus:border-[#dc2626] leading-relaxed" />
                </div>
                <button onClick={()=>{if(!partner.corp || !partner.msg) return alert("EMPTY"); alert("SUBMITTED"); setPartner({corp:'', contact:'', msg:''});}} className="w-full bg-[#dc2626] text-white py-12 md:py-20 rounded-full text-3xl md:text-8xl border-8 border-[#dc2626] hover:bg-white hover:text-[#dc2626] transition-all font-black shadow-2xl active:scale-95 leading-none uppercase">{L.submit}</button>
            </div>

            {/* INFRA BAR */}
            <div className="mt-20 py-12 px-16 bg-gray-100 rounded-3xl flex flex-wrap justify-center md:justify-between items-center gap-10 border-4 border-black/5 shadow-inner font-black">
                <div className="flex items-center gap-6 font-black">
                  <div className="w-8 h-8 bg-red-600 rounded-full animate-ping"></div>
                  <span className="text-black text-2xl md:text-5xl font-mono uppercase tracking-tighter font-black">Infrastructure: 88-Threads Node</span>
                </div>
                <div className="flex items-center gap-10 uppercase text-xs md:text-4xl text-gray-400 font-black">
                  <span>Reliability: 18.02</span>
                  <span>Master: Lord @Ohsangjo</span>
                </div>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="fixed bottom-10 left-6 right-6 max-w-7xl mx-auto bg-white border-8 border-black p-4 rounded-3xl flex justify-between gap-4 z-[500] shadow-2xl font-black">
        {['KEDHEON', 'CIVIL', 'NEXUS', 'VENDOR'].map(app => (
          <button key={app} className={`flex-1 py-12 rounded-2xl text-xs md:text-5xl transition-all font-black text-center leading-none ${app === 'KEDHEON' ? 'bg-black text-white scale-[1.05] shadow-lg' : 'text-gray-300'}`}>{app}</button>
        ))}
      </footer>

      {/* WATERMARK */}
      <div className="mt-40 opacity-5 text-black text-xl md:text-[10rem] tracking-[4em] uppercase pb-96 font-black text-center select-none pointer-events-none leading-none"> Kedheon Master | Lord Ohsangjo </div>
    </div>
  );
}
