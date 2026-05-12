'use client';
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';

/** * [KEDHEON MASTER V160.0 - SUPREME STABLE]
 * -----------------------------------------------------------
 * 1. 테마: Pure White / Black / Red (#DC2626)
 * 2. 수정: 비표준 Tailwind 클래스 제거 및 특수문자 이스케이프
 * 3. 인프라: Next.js 16 Turbopack 빌드 규격 100% 준수
 * -----------------------------------------------------------
 */

const PI_INVITE_CODE = 'ohsangjo';

const DICT = {
  KR: {
    rookie: "ROOKIE", pioneer: "PIONEER", exchange: "EXCHANGE", auth: "SECURE AUTH", creative: "CREATIVE & FAN", market: "MARKET", partnership: "PARTNERSHIP",
    invitation: "Web3 Invitation", procedure: "Join Guide", assets: "ASSETS", activate: "ACTIVATE QR",
    convert: "1 PI CONVERT", post: "POST FEED", buy: "BUY NOW", register: "REGISTER", submit: "SUBMIT", download: "DOWNLOAD APP",
    exchangeDesc: "Convert mining contribution to BEOM and preserve value.",
    authDesc: "Get your personal/business secure QR code for the Empire.",
    creativeDesc: "Share your creations and fan spirit with citizens.",
    fanRoomDesc: "Fan Room (500 BEOM): 90% Revenue Return & Governance.",
    marketDesc: "Trade verified GOODS and confirm their value.",
    partnershipDesc: "Global partners to design the future with the Empire.",
    steps: [
      { t: "Install App", d: "Install the official [Pi Network] app.", link: "https://minepi.com/#download" },
      { t: "Select Method", d: "Choose [Continue with phone number]." },
      { t: "Config Region", d: "Select [+82(South Korea)] and enter number." },
      { t: "Security PW", d: "Combine uppercase, lowercase, and numbers." },
      { t: "Profile", d: "Set Passport name and unique ID." },
      { t: "Invite Code", d: `Enter [ ${PI_INVITE_CODE} ] accurately.` },
      { t: "Passphrase", d: "Write 24 words manually on paper." },
      { t: "Activate", d: "Tap the lightning button daily to start." }
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

  if (!hasMounted) return <div className="bg-white min-h-screen" />;

  return (
    <div className="flex flex-col items-center bg-white min-h-screen text-black font-sans w-full pb-96 font-black overflow-x-hidden selection:bg-red-50">
      
      {/* NAVIGATION */}
      <nav className="w-full max-w-7xl flex justify-between items-center px-6 py-6 sticky top-0 bg-white/95 backdrop-blur-2xl z-[300] border-b-8 border-black/5 shadow-md">
        <div className="flex items-center gap-6">
          <img src="/kedheon-character.png" className="w-16 h-16 rounded-3xl border-4 border-black" alt="Logo" />
          <div className="text-left leading-tight">
            <h1 className="text-black text-2xl md:text-4xl font-black italic uppercase">Kedheon</h1>
            <span className="text-gray-400 text-[10px] md:text-sm font-mono font-bold uppercase tracking-widest">V160.0 STABLE</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setTab('ROOKIE')} className={`px-6 py-3 rounded-2xl text-sm md:text-2xl font-black border-4 transition-all ${tab === 'ROOKIE' ? 'bg-[#dc2626] text-white border-[#dc2626]' : 'text-gray-400 border-transparent'}`}>{L.rookie}</button>
          <button onClick={() => setTab('PIONEER')} className={`px-6 py-3 rounded-2xl text-sm md:text-2xl font-black border-4 transition-all ${tab === 'PIONEER' ? 'bg-black text-white border-black' : 'text-gray-400 border-transparent'}`}>{L.pioneer}</button>
        </div>
      </nav>

      <main className="w-full max-w-7xl px-6 py-12">
        {tab === 'ROOKIE' ? (
          <div className="flex flex-col gap-12 text-left">
            <div className="flex flex-col items-center text-center gap-10 py-24 bg-gray-50 rounded-[60px] border-4 border-black/5 relative shadow-inner overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-4 bg-[#dc2626]"></div>
              <img src="/kedheon-character.png" className="w-48 h-48 md:w-80 md:h-96 rounded-[40px] border-8 border-black shadow-xl" alt="Character" />
              <div className="px-10">
                <h1 className="text-black text-5xl md:text-8xl uppercase font-black tracking-tighter leading-none">{L.invitation}</h1>
                <p className="text-[#dc2626] text-2xl md:text-6xl uppercase tracking-widest border-b-8 border-[#dc2626] pb-4 inline-block font-black italic">{L.procedure}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-8">
              {L.steps.map((step, i) => (
                <div key={i} className={`p-12 bg-white rounded-[40px] border-4 flex items-center gap-12 transition-all ${i === 0 ? 'border-[#dc2626] bg-red-50/10 shadow-lg' : 'border-black/5 opacity-90'}`}>
                  <span className={`text-6xl md:text-9xl font-black italic ${i === 0 ? 'text-[#dc2626]' : 'text-black opacity-10'}`}>0{i+1}</span>
                  <div className="flex-1">
                    <h3 className="text-black text-3xl md:text-6xl font-black uppercase italic mb-4">{step.t}</h3>
                    <p className="text-gray-600 text-base md:text-4xl font-bold leading-snug">{step.d}</p>
                    {step.link && (
                      <button onClick={() => window.open(step.link, '_blank')} className="mt-10 bg-[#dc2626] text-white px-10 py-5 rounded-full text-xl md:text-4xl font-black uppercase shadow-lg">
                        &darr; {L.download}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-20 bg-black text-white rounded-[60px] text-center shadow-xl border-8 border-black">
              <p className="text-2xl md:text-6xl font-black italic text-gray-500 uppercase">Imperial Code</p>
              <div className="text-[#dc2626] text-6xl md:text-9xl font-black tracking-widest cursor-pointer" onClick={() => {if(typeof window !== 'undefined'){navigator.clipboard.writeText(PI_INVITE_CODE); alert("Copied!");}}}>
                {PI_INVITE_CODE}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-24 py-8 text-left">
            {/* ASSET DASHBOARD */}
            <div className="bg-gray-50 p-12 md:p-32 rounded-[80px] border-8 border-black shadow-xl flex flex-col md:flex-row justify-between items-center relative group">
                <div className="text-left z-10 space-y-10 w-full md:w-auto font-black">
                  <h3 className="text-gray-400 text-lg md:text-5xl uppercase tracking-widest">{L.assets}</h3>
                  <p className="text-black text-7xl md:text-9xl tracking-tighter font-black leading-none">
                    {Math.floor(beomToken).toLocaleString()}
                    <span className="text-4xl opacity-10">.{beomToken.toFixed(2).split('.')[1]}</span> 
                    <span className="ml-5 text-4xl md:text-8xl italic uppercase text-[#dc2626]">BEOM</span>
                  </p>
                  <div className="flex flex-wrap gap-8 pt-10">
                    <div className="bg-black text-white px-8 py-4 rounded-3xl text-sm md:text-4xl font-mono">NODE: 18.02</div>
                    <div className="bg-[#dc2626] text-white px-8 py-4 rounded-3xl text-sm md:text-4xl font-mono animate-pulse">RETURN: {redistributionAmount.toLocaleString()}</div>
                  </div>
                </div>
                <img src="/beom-token.png" className="w-48 h-48 md:w-96 md:h-96 object-contain" alt="Token" />
            </div>

            {/* EXCHANGE */}
            <SectionHeader num="01" title={L.exchange} desc={L.exchangeDesc} />
            <div className="bg-white p-12 md:p-24 rounded-[60px] border-8 border-black flex flex-col md:flex-row justify-between items-center shadow-xl gap-16">
              <div className="text-left font-black w-full md:w-auto">
                <p className="text-black text-4xl md:text-8xl font-black italic uppercase leading-none mb-6">Terminal</p>
                <div className="flex items-center gap-4"><span className="w-6 h-6 bg-green-500 rounded-full animate-ping"></span><p className="text-gray-400 text-lg md:text-4xl font-bold uppercase">Protocol V23 Ready</p></div>
              </div>
              <button onClick={() => {setBeomToken(p=>p+100); setTotalRevenue(p=>p+100); alert("Success");}} className="w-full md:w-auto bg-black text-white px-16 py-10 rounded-full text-2xl md:text-6xl font-black shadow-lg hover:bg-[#dc2626]">
                {L.convert}
              </button>
            </div>

            {/* AUTH */}
            <SectionHeader num="02" title={L.auth} desc={L.authDesc} />
            <div className="bg-gray-50 p-12 md:p-24 rounded-[60px] border-4 border-black/5 flex flex-col items-center gap-16 shadow-inner">
              <div className="flex gap-4 w-full max-w-4xl bg-white p-3 rounded-[40px] border-4 border-black">
                <button onClick={() => setQrState({ ...qrState, type: 'PERSONAL', active: false })} className={`flex-1 py-10 rounded-3xl text-xl md:text-4xl font-black ${qrState.type === 'PERSONAL' ? 'bg-black text-white' : 'text-gray-300'}`}>PERSONAL</button>
                <button onClick={() => setQrState({ ...qrState, type: 'BUSINESS', active: false })} className={`flex-1 py-10 rounded-3xl text-xl md:text-4xl font-black ${qrState.type === 'BUSINESS' ? 'bg-black text-white' : 'text-gray-300'}`}>BUSINESS</button>
              </div>
              {qrState.type === 'BUSINESS' && (
                 <input value={qrState.biz} onChange={(e) => setQrState({ ...qrState, biz: e.target.value.toUpperCase() })} placeholder="BIZ NAME" className="w-full max-w-4xl bg-white border-4 border-black p-10 rounded-3xl text-center text-3xl md:text-6xl font-black outline-none" />
              )}
              <div className={`relative bg-white border-8 rounded-[40px] flex items-center justify-center transition-all duration-700 shadow-xl w-64 h-64 md:w-[40rem] md:h-[40rem] ${qrState.active ? 'border-[#dc2626]' : 'opacity-10 grayscale'}`}>
                {qrState.active ? (
                  <div className="flex flex-col items-center p-10 gap-6">
                    <img src={qrState.type === 'PERSONAL' ? "/qr-personal.png" : "/qr-business.png"} className="w-full h-full object-contain" alt="QR" />
                    <p className="text-black text-xl md:text-4xl font-black italic">{qrState.biz || "AUTHED"}</p>
                  </div>
                ) : <p className="text-black text-4xl md:text-6xl font-black uppercase italic animate-pulse">Encoded</p>}
              </div>
              <button onClick={() => {if(beomToken < 50) return alert("Low Assets"); setBeomToken(p=>p-50); setQrState({ ...qrState, active: true });}} className="w-full max-w-4xl bg-black text-white py-10 rounded-full text-2xl md:text-6xl font-black shadow-lg">
                {L.activate} (50 BEOM)
              </button>
            </div>

            {/* CREATIVE */}
            <SectionHeader num="03" title={L.creative} desc={L.creativeDesc} />
            <div className="bg-white p-12 md:p-24 rounded-[60px] border-4 border-black/10 space-y-16 text-left shadow-lg font-black">
              <div className="flex gap-10 border-b-4 border-gray-100 pb-10">
                 <button onClick={() => setBoardType('CREATIVE')} className={`text-2xl md:text-6xl uppercase font-black italic ${boardType === 'CREATIVE' ? 'text-black border-b-8 border-black pb-2' : 'text-gray-300'}`}>Creative</button>
                 <button onClick={() => setBoardType('FAN')} className={`text-2xl md:text-6xl uppercase font-black italic ${boardType === 'FAN' ? 'text-black border-b-8 border-black pb-2' : 'text-gray-300'}`}>Fan Rooms</button>
              </div>
              <div className="space-y-10">
                 <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">{cats.map(cat => (<button key={cat} onClick={() => setPostCategory(cat)} className={`px-8 py-3 rounded-2xl text-lg md:text-3xl font-black border-2 whitespace-nowrap ${postCategory === cat ? 'bg-black text-white border-black' : 'text-gray-400 border-gray-100'}`}>{cat}</button>))}</div>
                 <div className="flex gap-4 overflow-x-auto pb-4 border-t-2 border-gray-50 pt-10">{fanRooms.map(room => (<button key={room} onClick={() => setPostCategory(room)} className={`px-8 py-3 rounded-2xl text-lg md:text-3xl font-black border-2 whitespace-nowrap ${postCategory === room ? 'bg-[#dc2626] text-white border-[#dc2626]' : 'text-[#dc2626] border-red-50'}`}>Room: {room}</button>))}</div>
              </div>
              <div className="space-y-6">
                <input value={feed.title} onChange={(e) => setFeed({ ...feed, title: e.target.value })} placeholder="TITLE" className="w-full bg-gray-50 border-4 border-black/5 p-8 rounded-3xl text-2xl md:text-5xl font-black outline-none" />
                <textarea value={feed.desc} onChange={(e) => setFeed({ ...feed, desc: e.target.value })} placeholder="DETAILS..." className="w-full bg-gray-50 border-4 border-black/5 p-8 rounded-3xl text-xl md:text-4xl font-bold h-96 outline-none leading-relaxed" />
              </div>
              <button onClick={() => {if(!feed.title) return alert("Empty"); setBeomToken(p=>p-10); alert("Posted"); setFeed({title:'', desc:'', url:''});}} className="w-full bg-black text-white py-10 rounded-full text-2xl md:text-6xl font-black shadow-lg hover:bg-[#dc2626]">{L.post} (10 BEOM)</button>
              <p className="text-gray-400 text-lg md:text-3xl font-bold bg-gray-50 p-8 rounded-3xl border-l-[16px] border-[#dc2626] italic">Note: {L.fanRoomDesc}</p>
            </div>

            {/* MARKET */}
            <SectionHeader num="04" title={L.market} desc={L.marketDesc} />
            <div className="bg-white p-12 md:p-24 rounded-[60px] border-4 border-black/10 space-y-16 shadow-lg text-left font-black">
               <h3 className="text-black text-3xl md:text-7xl font-black uppercase italic border-l-[16px] border-[#dc2626] pl-10">Market</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10 font-black">
                  <input value={sellItem.name} onChange={(e) => setSellItem({ ...sellItem, name: e.target.value })} placeholder="NAME" className="w-full bg-gray-50 border-4 border-black/5 p-8 rounded-3xl text-xl md:text-4xl outline-none" />
                  <input type="number" value={sellItem.price} onChange={(e) => setSellItem({ ...sellItem, price: e.target.value })} placeholder="PRICE (BEOM)" className="w-full bg-gray-50 border-4 border-black/5 p-8 rounded-3xl text-xl md:text-4xl text-[#dc2626] outline-none" />
               </div>
               <div className="w-full">
                  <input type="file" accept="image/*" onChange={handleImageUpload} ref={fileInputRef} className="hidden" />
                  <button onClick={() => fileInputRef.current?.click()} className="w-full bg-gray-50 border-4 border-dashed border-black/10 p-20 rounded-[40px] text-gray-400 text-center hover:border-black transition-all font-black text-xl md:text-6xl shadow-inner">
                    {sellItem.img ? <img src={sellItem.img} className="h-64 mx-auto rounded-3xl" alt="Preview" /> : "UPLOAD IMAGE"}
                  </button>
               </div>
               <button onClick={()=>{
                 if(!sellItem.name||!sellItem.price||!sellItem.img)return alert("Empty"); 
                 setGoods([{...sellItem, id:Date.now(), price:Number(sellItem.price)}, ...goods]); 
                 setSellItem({name:'',price:'',desc:'',img:''}); 
                 alert("Registered");
               }} className="w-full bg-black text-white py-10 rounded-full text-2xl md:text-6xl font-black shadow-lg hover:bg-[#dc2626]">{L.register} (20 BEOM)</button>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-20 border-t-4 border-gray-50">
                  {goods.map(g => (
                    <div key={g.id} className="bg-white p-6 md:p-12 rounded-[40px] border-4 border-black/5 shadow-lg flex flex-col group transition-all hover:border-[#dc2626]">
                      <div className="w-full aspect-square bg-gray-50 rounded-3xl mb-8 overflow-hidden flex items-center justify-center relative shadow-inner">
                        <div className="absolute top-4 right-4 bg-black text-white px-4 py-2 rounded-full text-xs md:text-xl font-black shadow-md z-20">VERIFIED</div>
                        <img src={g.img} className="w-48 h-48 md:w-80 md:h-80 object-contain group-hover:scale-105 duration-700" alt="Item" />
                      </div>
                      <h4 className="text-black text-2xl md:text-5xl uppercase mb-4 font-black truncate">{g.name}</h4>
                      <p className="text-gray-500 text-sm md:text-2xl mb-10 font-bold italic line-clamp-2">&quot;Certified Asset&quot;</p>
                      <div className="mt-auto">
                        <p className="text-black text-4xl md:text-7xl mb-10 font-black">{Number(g.price).toLocaleString()} <span className="text-lg md:text-3xl text-[#dc2626]">BEOM</span></p>
                        <button onClick={()=>alert("Connecting Terminal...")} className="w-full py-6 bg-black text-white rounded-full text-xl md:text-4xl font-black shadow-lg hover:bg-[#dc2626]"> {L.buy} </button>
                      </div>
                    </div>
                  ))}
               </div>
            </div>

            {/* PARTNERSHIP */}
            <SectionHeader num="05" title={L.partnership} desc={L.partnershipDesc} />
            <div className="bg-black p-12 md:p-24 rounded-[60px] border-8 border-[#dc2626] space-y-16 text-left shadow-xl relative overflow-hidden font-black">
                <div className="absolute -top-40 -right-40 opacity-5 pointer-events-none select-none">
                  <img src="/kedheon-character.png" className="w-96 h-96 grayscale" alt="Character" />
                </div>
                <h3 className="text-white text-4xl md:text-8xl font-black italic border-l-[16px] border-[#dc2626] pl-10 z-10 relative uppercase">Portal</h3>
                <div className="space-y-10 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <input value={partner.corp} onChange={(e)=>setPartner({...partner, corp: e.target.value.toUpperCase()})} placeholder="CORP NAME" className="w-full bg-white/5 border-4 border-white/10 p-8 rounded-3xl text-white text-xl md:text-4xl font-black outline-none focus:border-[#dc2626] transition-all" />
                        <input value={partner.contact} onChange={(e)=>setPartner({...partner, contact: e.target.value})} placeholder="CONTACT" className="w-full bg-white/5 border-4 border-white/10 p-8 rounded-3xl text-white text-xl md:text-4xl font-black outline-none focus:border-[#dc2626] transition-all" />
                    </div>
                    <textarea value={partner.msg} onChange={(e)=>setPartner({...partner, msg: e.target.value})} placeholder="PROPOSAL..." className="w-full bg-white/5 border-4 border-white/10 p-8 rounded-[40px] text-white text-lg md:text-3xl font-bold h-80 outline-none focus:border-[#dc2626] leading-relaxed" />
                </div>
                <button onClick={()=>{if(!partner.corp||!partner.msg)return alert("Empty"); alert("Submitted"); setPartner({corp:'', contact:'', msg:''});}} className="w-full bg-[#dc2626] text-white py-10 rounded-full text-3xl md:text-7xl border-4 border-[#dc2626] hover:bg-white hover:text-[#dc2626] transition-all font-black shadow-lg active:scale-95 leading-none">{L.submit}</button>
            </div>

            {/* INFRA BAR */}
            <div className="mt-20 py-10 px-12 bg-gray-100 rounded-[40px] flex flex-wrap justify-center md:justify-between items-center gap-10 border-4 border-black/5 shadow-inner font-black">
                <div className="flex items-center gap-4"><div className="w-6 h-6 bg-red-600 rounded-full animate-ping"></div><span className="text-black text-xl md:text-4xl font-mono uppercase tracking-tighter">Infrastructure: 88-Threads</span></div>
                <div className="flex items-center gap-10 uppercase text-xs md:text-3xl text-gray-400">
                  <span>Node: 18.02</span>
                  <span>Auth: Lord @Ohsangjo</span>
                </div>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="fixed bottom-10 left-6 right-6 max-w-6xl mx-auto bg-white border-8 border-black p-4 rounded-[60px] flex justify-between gap-4 z-[500] shadow-2xl font-black">
        {['KEDHEON', 'CIVIL', 'NEXUS', 'VENDOR'].map(app => (
          <button key={app} className={`flex-1 py-10 rounded-[40px] text-xs md:text-4xl transition-all font-black text-center ${app === 'KEDHEON' ? 'bg-black text-white' : 'text-gray-300 hover:text-black'}`}>{app}</button>
        ))}
      </footer>

      {/* WATERMARK */}
      <div className="mt-40 opacity-5 text-black text-xl md:text-9xl tracking-[4em] uppercase pb-96 font-black text-center select-none pointer-events-none leading-none"> Kedheon Master | Lord Ohsangjo </div>
    </div>
  );
}
