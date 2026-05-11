'use client';
import React, { useState, useEffect, useRef, useMemo } from 'react';

/** * [KEDHEON MASTER V107.5 - THE ABSOLUTE FULL SYSTEM]
 * -----------------------------------------------------------
 * 1. 테마: Pure White / Black / Red (#DC2626)
 * 2. 기능: ROOKIE(8단계 가이드) + PIONEER(01~05 전 섹션) 통합 완료
 * 3. 경제: Max(3% Total Sales, 8% Net Profit) 사회적 환원 로직 장착
 * 4. 인프라: 88쓰레드 / Node 18.02 / Protocol V23 완벽 싱크
 * -----------------------------------------------------------
 */

const PI_INVITE = 'ohsangjo';
const DICT = {
  KR: {
    rookie: "ROOKIE", pioneer: "PIONEER", assets: "ASSETS", convert: "1 PI 환전", download: "공식 앱 다운로드",
    steps: [
      { t: "애플리케이션 설치", d: "[Pi Network] 공식 앱을 설치하십시오.", link: "https://minepi.com/#download" },
      { t: "가입 방식 선택", d: "[Continue with phone number] 가입." },
      { t: "국가 및 번호 설정", d: "[+82(South Korea)] 및 번호 입력." },
      { t: "보안 비밀번호 생성", d: "영문 대/소문자와 숫자를 조합하십시오." },
      { t: "실명 프로필 작성", d: "여권 영문 실명 및 고유 ID 설정." },
      { t: "초대 코드 입력", d: `초대 코드 [ ${PI_INVITE} ] 입력.` },
      { t: "비밀구절 수기 보관", d: "24개 단어는 반드시 종이에 기록하십시오." },
      { t: "채굴 버튼 활성화", d: "번개 버튼을 눌러 활동을 시작하십시오." }
    ]
  },
  EN: {
    rookie: "ROOKIE", pioneer: "PIONEER", assets: "ASSETS", convert: "CONVERT 1 PI", download: "DOWNLOAD APP",
    steps: [
      { t: "Install App", d: "Download [Pi Network] app.", link: "https://minepi.com/#download" },
      { t: "Select Method", d: "Choose [phone number]." },
      { t: "Region Config", d: "Set [+82(South Korea)]." },
      { t: "Password", d: "Create strong password." },
      { t: "Real Identity", d: "Passport name & ID." },
      { t: "Invitation", d: `Use code [ ${PI_INVITE} ].` },
      { t: "Passphrase", d: "Write 24 words safely." },
      { t: "Mining", d: "Engage lightning button." }
    ]
  }
};

const Header = ({ n, t, d }) => (
  <div className="w-full border-t-2 border-[#dc2626] pt-4 mb-3 text-left">
    <h2 className="text-black text-lg md:text-2xl font-black uppercase italic border-l-4 border-black pl-2">{n}. {t}</h2>
    <p className="text-gray-400 text-[10px] md:text-xs font-bold pl-4 italic">{d}</p>
  </div>
);

export default function KedheonMasterV107_5() {
  const [mt, setMt] = useState(false);
  const [lang, setLang] = useState('KR');
  const [tab, setTab] = useState('PIONEER');
  
  // -- GLOBAL STATES --
  const [token, setToken] = useState(7891.88);
  const [rev, setRev] = useState(188500);
  const [inc, setInc] = useState(72300);

  // -- PIONEER SECTIONS STATES --
  const [qr, setQr] = useState({ type: 'PERSONAL', active: false, biz: '' });
  const [post, setPost] = useState({ type: 'CREATIVE', cat: 'TECH', title: '', desc: '', url: '' });
  const [rooms, setRooms] = useState(['케데헌', '헌트릭스', '파이Nexus']);
  const [mkt, setMkt] = useState({ name: '', price: '', img: '', desc: '' });
  const [goods, setGoods] = useState([
    { id: 1, name: "GOLD BADGE", price: 1000, img: "/beom-token.png", desc: "제국 시민의 명예로운 문장입니다." },
    { id: 2, name: "NODE ACCESS", price: 5000, img: "/node-icon.png", desc: "88쓰레드 노드 모니터링 권한" }
  ]);
  const [corp, setCorp] = useState({ name: '', contact: '', msg: '' });

  const fileRef = useRef(null);
  const L = DICT[lang];
  const cats = ['MUSIC', 'TECH', 'ART', 'FOOD', 'TRAVEL', 'GAME', 'NEWS', 'MOVIE'];
  
  // -- CALCULATED LOGIC --
  const redist = useMemo(() => Math.max(rev * 0.03, inc * 0.08), [rev, inc]);
  const piRate = 100; // 1 PI = 100 BEOM

  useEffect(() => { 
    setMt(true);
    const saved = localStorage.getItem('KEDHEON_V107_5');
    if (saved) {
      const p = JSON.parse(saved);
      if (p.token) setToken(p.token);
    }
  }, []);

  useEffect(() => {
    if (mt) localStorage.setItem('KEDHEON_V107_5', JSON.stringify({ token }));
  }, [token, mt]);

  if (!mt) return <div className="bg-white min-h-screen" />;

  return (
    <div className="flex flex-col items-center bg-white min-h-screen text-black font-sans w-full pb-64 font-black overflow-x-hidden">
      {/* NAVIGATION BAR */}
      <nav className="w-full max-w-7xl flex justify-between items-center px-3 py-2 sticky top-0 bg-white/95 backdrop-blur-md z-[250] border-b-2 border-black/5">
        <div className="flex items-center gap-2">
          <img src="/kedheon-character.png" className="w-8 h-8 rounded-lg border border-black shadow-sm" alt="K" />
          <div className="text-left leading-tight">
            <h1 className="text-black text-sm md:text-lg font-black italic uppercase">Kedheon</h1>
            <span className="text-gray-400 text-[7px] font-mono">V107.5 MASTER</span>
          </div>
        </div>
        <div className="flex gap-1 font-black">
          <button onClick={() => setTab('ROOKIE')} className={`px-2 py-1 rounded text-[8px] md:text-xs border transition-all ${tab === 'ROOKIE' ? 'bg-[#dc2626] text-white border-[#dc2626]' : 'text-gray-400 border-black/5'}`}>{L.rookie}</button>
          <button onClick={() => setTab('PIONEER')} className={`px-2 py-1 rounded text-[8px] md:text-xs border transition-all ${tab === 'PIONEER' ? 'bg-black text-white border-black' : 'text-gray-400 border-black/5'}`}>{L.pioneer}</button>
          <div className="ml-2 flex bg-gray-100 rounded p-0.5 border border-black/5">
            <button onClick={() => setLang('KR')} className={`px-1.5 py-0.5 rounded text-[8px] ${lang === 'KR' ? 'bg-black text-white' : 'text-gray-400'}`}>KR</button>
            <button onClick={() => setLang('EN')} className={`px-1.5 py-0.5 rounded text-[8px] ${lang === 'EN' ? 'bg-black text-white' : 'text-gray-400'}`}>EN</button>
          </div>
        </div>
      </nav>

      <main className="w-full max-w-4xl px-3 py-4">
        {tab === 'ROOKIE' ? (
          <div className="flex flex-col gap-4 animate-in fade-in">
            {/* ROOKIE TOP */}
            <div className="flex flex-col items-center py-8 bg-gray-50 rounded-[30px] border border-black/5 relative shadow-inner">
              <img src="/kedheon-character.png" className="w-24 md:w-32 rounded-2xl border-2 border-black mb-2 shadow-xl" alt="M" />
              <h1 className="text-black text-xl md:text-3xl font-black uppercase tracking-tighter">{L.invitation}</h1>
              <p className="text-[#dc2626] text-sm md:text-xl border-b-2 border-[#dc2626] font-black italic leading-none pb-1">{L.procedure}</p>
            </div>
            {/* ROOKIE 8 STEPS */}
            <div className="grid grid-cols-1 gap-2">
              {L.steps.map((s, i) => (
                <div key={i} className={`p-4 bg-white rounded-xl border-2 flex items-center gap-4 transition-all ${i === 0 ? 'border-[#dc2626] bg-red-50/5 shadow-md scale-[1.01]' : 'border-black/5 opacity-80'}`}>
                  <span className={`text-lg md:text-2xl font-black italic ${i === 0 ? 'text-[#dc2626]' : 'text-black'}`}>0{i+1}</span>
                  <div className="flex-1 text-left">
                    <h3 className="text-black text-xs md:text-lg font-black uppercase italic mb-0.5">{s.t}</h3>
                    <p className="text-gray-600 text-[10px] md:text-sm font-bold leading-tight">{s.d}</p>
                    {s.link && <button onClick={() => window.open(s.link, '_blank')} className="mt-3 bg-[#dc2626] text-white px-6 py-2 rounded-lg text-[10px] md:text-xs font-black uppercase hover:bg-black transition-all shadow-lg flex items-center gap-2 animate-pulse">↓ {L.download}</button>}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 bg-black text-white rounded-2xl text-center shadow-xl border-2 border-black">
              <p className="text-[10px] md:text-sm font-black italic">초대 코드(Invitation Code): <span className="text-[#dc2626] text-xl md:text-3xl ml-2 tracking-widest">{PI_INVITE}</span></p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-8 animate-in slide-in-from-bottom-2">
            
            {/* 00. ASSETS MODULE */}
            <div className="bg-gray-50 p-4 md:p-10 rounded-[35px] border-2 border-black shadow-xl flex flex-col md:flex-row justify-between items-center font-black relative overflow-hidden group">
              <div className="text-left w-full md:w-auto z-10 space-y-2">
                <h3 className="text-gray-400 text-[8px] md:text-xs uppercase tracking-widest leading-none font-black">{L.assets}</h3>
                <p className="text-black text-4xl md:text-8xl tracking-tighter leading-none font-black">
                  {Math.floor(token).toLocaleString()}
                  <span className="text-lg md:text-4xl opacity-30">.{token.toFixed(2).split('.')[1]}</span> 
                  <span className="ml-2 text-sm md:text-4xl italic uppercase">BEOM</span>
                </p>
                <div className="flex flex-wrap gap-2 pt-1 font-black">
                  <div className="bg-black text-white px-3 py-1.5 rounded-lg text-[8px] md:text-lg font-mono font-bold border border-white/20">Index: {piRate}.00 / PI</div>
                  <div className="bg-[#dc2626] text-white px-3 py-1.5 rounded-lg text-[8px] md:text-lg font-mono font-bold animate-pulse shadow-md border border-white/20">Social: {redist.toLocaleString()}</div>
                </div>
              </div>
              <img src="/beom-token.png" className="w-16 md:w-44 group-hover:scale-110 transition-transform mt-2 md:mt-0" alt="B" />
            </div>

            {/* 01. EXCHANGE MODULE */}
            <Header n="01" t="EXCHANGE TERMINAL" d="채굴 기여도를 BEOM 토큰으로 즉시 전환하십시오." />
            <div className="bg-white p-4 md:p-10 rounded-[25px] border-2 border-black flex justify-between items-center shadow-lg gap-4">
              <div className="text-left leading-tight font-black">
                <p className="text-black text-base md:text-3xl font-black italic uppercase leading-none">Mainnet Node</p>
                <p className="text-gray-400 text-[8px] md:text-sm font-bold mt-1 uppercase tracking-widest">Rate: 1 PI = 100 BEOM</p>
              </div>
              <button onClick={() => {setToken(p=>p+100); setRev(p=>p+100); alert("Exchange Success");}} className="bg-black text-white px-6 py-3 md:px-12 md:py-6 rounded-2xl text-[10px] md:text-xl border-2 border-black active:scale-95 uppercase font-black shadow-xl hover:bg-[#dc2626]">
                {L.convert}
              </button>
            </div>

            {/* 02. AUTH MODULE */}
            <Header n="02" t="SECURE AUTH" d="제국 활동을 위한 고유 보안 QR 코드를 발급받으십시오." />
            <div className="bg-gray-50 p-4 md:p-12 rounded-[30px] border border-black/5 flex flex-col items-center gap-4 shadow-inner">
              <div className="flex gap-2 w-full max-w-xs bg-white p-1 rounded-lg border-2 border-black font-black">
                <button onClick={() => setQr({ ...qr, type: 'PERSONAL', active: false })} className={`flex-1 py-2 rounded text-[9px] md:text-xs font-black transition-all ${qr.type === 'PERSONAL' ? 'bg-black text-white' : 'text-gray-400'}`}>PERSONAL</button>
                <button onClick={() => setQr({ ...qr, type: 'BUSINESS', active: false })} className={`flex-1 py-2 rounded text-[9px] md:text-xs font-black transition-all ${qr.type === 'BUSINESS' ? 'bg-black text-white' : 'text-gray-400'}`}>BUSINESS</button>
              </div>
              {qr.type === 'BUSINESS' && (
                 <input value={qr.biz} onChange={(e) => setQr({...qr, biz: e.target.value.toUpperCase()})} placeholder="BIZ NAME" className="w-full max-w-xs bg-white border-2 border-black p-3 rounded-xl text-center text-black text-sm font-black outline-none focus:border-[#dc2626] shadow-sm" />
              )}
              <div className={`relative bg-white border-4 rounded-[20px] flex items-center justify-center transition-all duration-500 shadow-xl ${qr.type === 'PERSONAL' ? 'w-40 h-40 md:w-80 md:h-80' : 'w-full max-w-2xl aspect-video'} ${qr.active ? 'border-[#dc2626]' : 'opacity-20 border-black/10'}`}>
                {qr.active ? (
                  <div className="flex flex-col items-center p-4">
                    <img src={qr.type === 'PERSONAL' ? "/qr-personal.png" : "/qr-business.png"} className="h-full object-contain" alt="QR" />
                    <p className="text-black text-[10px] font-black italic mt-2">{qr.biz || "AUTHENTICATED"}</p>
                  </div>
                ) : <p className="text-black text-lg md:text-6xl font-black italic tracking-widest animate-pulse">LOCKED</p>}
              </div>
              <button onClick={() => {if(token < 50) return alert("Beom Low"); setToken(p=>p-50); setQr({...qr, active: true});}} className="w-full max-w-md bg-black text-white py-4 md:py-8 rounded-2xl text-[10px] md:text-xl border-2 border-black active:scale-95 uppercase font-black shadow-xl">{L.activate} (50 BEOM)</button>
            </div>

            {/* 03. CREATIVE MODULE */}
            <Header n="03" t="CREATIVE & FAN" d="제국 시민의 창작물과 팬심을 공유하고 기여도를 높이십시오." />
            <div className="bg-white p-4 md:p-10 rounded-[30px] border-2 border-black/10 space-y-4 text-left shadow-lg font-black">
              <div className="flex gap-6 border-b-2 border-gray-100 pb-2 font-black">
                 <button onClick={() => setBoardType('CREATIVE')} className={`text-xs md:text-xl uppercase font-black italic transition-all ${boardType === 'CREATIVE' ? 'text-black border-b-2 border-black' : 'text-gray-300'}`}>Creative Hub</button>
                 <button onClick={() => setBoardType('FAN')} className={`text-xs md:text-xl uppercase font-black italic transition-all ${boardType === 'FAN' ? 'text-black border-b-2 border-black' : 'text-gray-300'}`}>Fan Spirit</button>
              </div>
              <div className="space-y-3">
                 <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide font-black">
                    {cats.map(cat => (
                      <button key={cat} onClick={() => setPost({...post, cat})} className={`px-4 py-1.5 rounded-full text-[9px] md:text-sm font-black border-2 transition-all whitespace-nowrap ${post.cat === cat ? 'bg-black text-white border-black shadow-md' : 'border-black/5 text-gray-400'}`}>{cat}</button>
                    ))}
                 </div>
                 <div className="flex gap-2 overflow-x-auto pb-1 border-t-2 border-gray-50 pt-3">
                   {rooms.map(room => (
                     <button key={room} onClick={() => setPost({...post, cat: room})} className={`px-4 py-1.5 rounded-full text-[9px] md:text-sm font-black border-2 transition-all whitespace-nowrap ${post.cat === room ? 'bg-[#dc2626] text-white border-[#dc2626] shadow-md' : 'border-red-50 text-[#dc2626]'}`}>🚩 {room}</button>
                   ))}
                   <button onClick={() => {const n = prompt("Room Name?"); if(n) setRooms(p=>[...p, n]);}} className="px-4 py-1.5 rounded-full text-[9px] md:text-sm font-black border-2 border-dashed border-gray-300 text-gray-400">+</button>
                 </div>
              </div>
              <div className="space-y-2">
                <input value={post.title} onChange={(e) => setPost({...post, title: e.target.value})} placeholder="SHARE YOUR THOUGHTS" className="w-full bg-gray-50 border-2 border-black/5 p-4 rounded-xl text-sm md:text-xl font-black outline-none focus:border-black shadow-sm" />
                <input value={post.url} onChange={(e) => setPost({...post, url: e.target.value})} placeholder="IMAGE / VIDEO URL" className="w-full bg-gray-50 border-2 border-black/5 p-4 rounded-xl text-[10px] md:text-lg text-[#dc2626] outline-none" />
                <textarea value={post.desc} onChange={(e) => setPost({...post, desc: e.target.value})} placeholder="WRITE DETAILS..." className="w-full bg-gray-50 border-2 border-black/5 p-4 rounded-xl text-[10px] md:text-base h-32 outline-none focus:border-black font-bold" />
              </div>
              <button onClick={() => {if(!post.title) return; setToken(p=>p-10); alert("Posted Successfully"); setPost({...post, title:'', desc:'', url:''});}} className="w-full bg-black text-white py-4 md:py-8 rounded-xl text-sm md:text-2xl border-2 border-black active:scale-95 uppercase font-black shadow-xl">{L.post} (10 BEOM)</button>
              <p className="text-gray-400 text-[8px] md:text-sm font-bold bg-gray-50 p-4 rounded-xl italic border-l-8 border-[#dc2626] leading-snug">※ 🚩 FAN ROOM 개설(500 BEOM): 창작 수익 90% 환원, 거버넌스 투표권 및 제국 시민권이 부여됩니다.</p>
            </div>

            {/* 04. MARKET MODULE */}
            <Header n="04" t="MARKET PORTAL" d="제국이 검증한 다양한 굿즈와 상품을 BEOM 토큰으로 거래하십시오." />
            <div className="bg-white p-4 md:p-10 rounded-[30px] border-2 border-black/10 space-y-4 shadow-xl text-left font-black">
               <h3 className="text-black text-sm md:text-2xl font-black uppercase italic border-l-4 border-[#dc2626] pl-2 mb-2 leading-none">Register Item</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <input value={mkt.name} onChange={(e) => setMkt({...mkt, name: e.target.value})} placeholder="PRODUCT NAME" className="w-full bg-gray-50 border-2 border-black/5 p-4 rounded-xl text-xs md:text-lg font-black outline-none focus:border-black" />
                  <input type="number" value={mkt.price} onChange={(e) => setMkt({...mkt, price: e.target.value})} placeholder="PRICE (BEOM)" className="w-full bg-gray-50 border-2 border-black/5 p-4 rounded-xl text-xs md:text-lg font-black text-[#dc2626] outline-none" />
               </div>
               <textarea value={mkt.desc} onChange={(e) => setMkt({...mkt, desc: e.target.value})} placeholder="PRODUCT DESCRIPTION" className="w-full bg-gray-50 border-2 border-black/5 p-4 rounded-xl text-[10px] md:text-base font-bold h-24 outline-none focus:border-black" />
               <div className="w-full">
                  <input type="file" accept="image/*" onChange={(e)=>{const f=e.target.files[0]; if(f){const r=new FileReader(); r.onloadend=()=>setMkt({...mkt, img: r.result}); r.readAsDataURL(f);}}} ref={fileRef} className="hidden" />
                  <button onClick={() => fileRef.current?.click()} className="w-full bg-gray-50 border-2 border-dashed border-black/10 p-10 rounded-xl text-gray-400 text-center hover:border-black transition-all font-black uppercase">
                    {mkt.img ? <img src={mkt.img} className="h-24 mx-auto rounded-xl border-2 border-black" alt="P" /> : "📸 UPLOAD PRODUCT PHOTO"}
                  </button>
               </div>
               <button onClick={() => {if(!mkt.name||!mkt.price||!mkt.img) return alert("Fill Fields"); setGoods([{id:Date.now(), name:mkt.name, price:Number(mkt.price), img:mkt.img, desc:mkt.desc}, ...goods]); setMkt({name:'',price:'',img:'',desc:''}); alert("Registered");}} className="w-full bg-black text-white py-4 md:py-8 rounded-xl text-sm md:text-2xl border-2 border-black active:scale-95 uppercase font-black shadow-xl">Register (20 BEOM)</button>
               
               <div className="grid grid-cols-2 gap-3 pt-6">
                  {goods.map(g => (
                    <div key={g.id} className="bg-white p-3 md:p-8 rounded-[30px] border-2 border-black/10 shadow-md flex flex-col group transition-all hover:border-[#dc2626]">
                      <div className="w-full aspect-square bg-gray-50 rounded-[20px] mb-2 flex items-center justify-center overflow-hidden border border-black/5">
                        <img src={g.img} className="w-24 md:w-48 group-hover:scale-110 transition-transform" alt="G" />
                      </div>
                      <h4 className="text-black text-[10px] md:text-2xl uppercase mb-0.5 font-black truncate">{g.name}</h4>
                      <p className="text-black text-lg md:text-5xl mb-3 font-black tracking-tighter leading-none">{g.price.toLocaleString()} <span className="text-[10px] md:text-xl uppercase">Beom</span></p>
                      <button className="w-full py-2 md:py-5 bg-black text-white rounded-xl text-[10px] md:text-xl border border-black active:scale-95 uppercase font-black shadow-lg">Buy Now</button>
                    </div>
                  ))}
               </div>
            </div>

            {/* 05. BUSINESS MODULE */}
            <Header n="05" t="BUSINESS PARTNERSHIP" d="제국과 미래를 함께할 글로벌 기업 파트너를 위한 공식 포털입니다." />
            <div className="bg-black p-4 md:p-12 rounded-[40px] border-4 border-[#dc2626] text-left shadow-2xl relative space-y-6 overflow-hidden">
                <div className="absolute -top-10 -right-10 opacity-10 pointer-events-none"><img src="/kedheon-character.png" className="w-64 h-64 grayscale" alt="K" /></div>
                <h3 className="text-white text-xl md:text-4xl font-black italic border-l-8 border-[#dc2626] pl-4 z-10 relative uppercase">Business Portal</h3>
                <div className="space-y-3 relative z-10 font-black">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <label className="text-[#dc2626] text-[8px] md:text-xs font-black uppercase ml-2">Company / Group Name</label>
                            <input value={corp.name} onChange={(e)=>setCorp({...corp, name: e.target.value.toUpperCase()})} placeholder="예: Pi Global Trade" className="w-full bg-white/5 border-2 border-white/10 p-4 rounded-xl text-white outline-none focus:border-[#dc2626]" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[#dc2626] text-[8px] md:text-xs font-black uppercase ml-2">Contact Info</label>
                            <input value={corp.contact} onChange={(e)=>setCorp({...corp, contact: e.target.value})} placeholder="contact@email.com" className="w-full bg-white/5 border-2 border-white/10 p-4 rounded-xl text-white outline-none focus:border-[#dc2626]" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[#dc2626] text-[8px] md:text-xs font-black uppercase ml-2">Proposal Details</label>
                        <textarea value={corp.msg} onChange={(e)=>setCorp({...corp, msg: e.target.value})} placeholder="제국과 함께할 미래 비즈니스 모델을 제안하십시오." className="w-full bg-white/5 border-2 border-white/10 p-4 rounded-xl text-white h-40 outline-none focus:border-[#dc2626] font-bold" />
                    </div>
                </div>
                <button onClick={() => {if(!corp.name||!corp.msg) return alert("Fill Fields"); alert("Proposal Submitted."); setCorp({name:'',contact:'',msg:''});}} className="w-full bg-[#dc2626] text-white py-5 md:py-10 rounded-2xl text-sm md:text-3xl font-black hover:bg-white hover:text-[#dc2626] transition-all uppercase shadow-xl">Submit Proposal</button>
            </div>

            {/* INFRA STATUS */}
            <div className="mt-8 flex justify-center gap-6 text-gray-300 text-[8px] md:text-xs font-mono font-black italic uppercase">
              <span>Infrastructure: 88-Threads Dual Xeon</span>
              <span>Node: 18.02 Top-Tier</span>
              <span>Protocol: V23.0 Sync</span>
              <span>Dev: @Ohsangjo</span>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER TAB BAR */}
      <footer className="fixed bottom-4 left-3 right-3 max-w-4xl mx-auto bg-white border-2 border-black p-1 rounded-[30px] flex justify-between gap-1 z-[300] shadow-2xl font-black">
        {['KEDHEON', 'CIVIL', 'NEXUS', 'VENDOR'].map(app => (
          <button key={app} className={`flex-1 py-4 md:py-6 rounded-[25px] text-[10px] md:text-xl font-black transition-all ${app === 'KEDHEON' ? 'bg-black text-white shadow-inner scale-[1.02]' : 'text-gray-300 hover:text-black'}`}>
            {app}
          </button>
        ))}
      </footer>

      <div className="mt-20 opacity-20 text-black text-[9px] md:text-xl tracking-[1em] pb-32 font-black text-center uppercase">Kedheon master | V107.5 Final Empire | @Ohsangjo</div>
    </div>
  );
}
