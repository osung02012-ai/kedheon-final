'use client';
import React, { useState, useEffect, useRef, useMemo } from 'react';

/** * [KEDHEON MASTER V107.0 - FULL COMMAND CENTER]
 * -----------------------------------------------------------
 * 1. 테마: Pure White (#FFFFFF) / Black (#000000) / Red (#DC2626)
 * 2. 기능: ROOKIE(다운로드 포함 8단계) + PIONEER(자산/환전/인증/커뮤니티/마켓/파트너십)
 * 3. 인프라: 88쓰레드 / Node 18.02 / Protocol V23 완벽 싱크
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
    <h2 className="text-black text-lg md:text-2xl font-black uppercase italic border-l-4 border-black pl-2 tracking-tighter">{n}. {t}</h2>
    <p className="text-gray-400 text-[10px] md:text-xs font-bold pl-4 italic leading-none">{d}</p>
  </div>
);

export default function KedheonMasterV107() {
  const [mt, setMt] = useState(false);
  const [lang, setLang] = useState('KR');
  const [tab, setTab] = useState('PIONEER');
  const [token, setToken] = useState(7891.88);
  const [rev, setRev] = useState(188500);
  const [inc, setInc] = useState(72300);
  const [qr, setQr] = useState({ type: 'PERSONAL', active: false, biz: '' });
  const [post, setPost] = useState({ type: 'CREATIVE', cat: 'TECH', title: '', desc: '' });
  const [rooms, setRooms] = useState(['케데헌', '헌트릭스']);
  const [mkt, setMkt] = useState({ name: '', price: '', img: '', desc: '' });
  const [goods, setGoods] = useState([{ id: 1, name: "GOLD BADGE", price: 1000, img: "/beom-token.png", desc: "제국 시민의 명예로운 문장" }]);
  const [corp, setCorp] = useState({ name: '', contact: '', msg: '' });

  const fileRef = useRef(null);
  const L = DICT[lang];
  const cats = ['MUSIC', 'TECH', 'ART', 'FOOD', 'TRAVEL', 'GAME', 'NEWS', 'MOVIE'];
  const redist = useMemo(() => Math.max(rev * 0.03, inc * 0.08), [rev, inc]);

  useEffect(() => { setMt(true); }, []);
  if (!mt) return null;

  return (
    <div className="flex flex-col items-center bg-white min-h-screen text-black font-sans w-full pb-64 font-black overflow-x-hidden selection:bg-red-50">
      <nav className="w-full max-w-7xl flex justify-between items-center px-3 py-2 sticky top-0 bg-white/95 backdrop-blur-md z-[250] border-b-2 border-black/5">
        <div className="flex items-center gap-2">
          <img src="/kedheon-character.png" className="w-8 h-8 rounded-lg border border-black" alt="K" />
          <div className="text-left leading-tight"><h1 className="text-black text-sm md:text-lg font-black italic uppercase">Kedheon</h1><span className="text-gray-400 text-[7px] font-mono">V107.0 MASTER</span></div>
        </div>
        <div className="flex gap-1">
          <button onClick={() => setTab('ROOKIE')} className={`px-2 py-1 rounded text-[8px] md:text-xs font-black border ${tab === 'ROOKIE' ? 'bg-[#dc2626] text-white' : 'text-gray-400'}`}>{L.rookie}</button>
          <button onClick={() => setTab('PIONEER')} className={`px-2 py-1 rounded text-[8px] md:text-xs font-black border ${tab === 'PIONEER' ? 'bg-black text-white' : 'text-gray-400'}`}>{L.pioneer}</button>
        </div>
      </nav>

      <main className="w-full max-w-4xl px-3 py-4">
        {tab === 'ROOKIE' ? (
          <div className="flex flex-col gap-4 animate-in fade-in">
            <div className="flex flex-col items-center py-8 bg-gray-50 rounded-[30px] border border-black/5">
              <img src="/kedheon-character.png" className="w-24 rounded-2xl border-2 border-black mb-2 shadow-lg" alt="M" />
              <h1 className="text-xl md:text-3xl font-black uppercase italic">{L.invitation}</h1>
              <p className="text-[#dc2626] text-sm md:text-xl border-b-2 border-[#dc2626] font-black italic">파이코인 가입 절차 안내</p>
            </div>
            {L.steps.map((s, i) => (
              <div key={i} className={`p-4 bg-white rounded-xl border-2 flex items-center gap-4 ${i === 0 ? 'border-[#dc2626] bg-red-50/5 shadow-md' : 'border-black/5'}`}>
                <span className={`text-lg md:text-2xl font-black italic ${i === 0 ? 'text-[#dc2626]' : 'text-black'}`}>0{i+1}</span>
                <div className="flex-1 text-left">
                  <h3 className="text-xs md:text-lg font-black uppercase">{s.t}</h3>
                  <p className="text-gray-600 text-[10px] md:text-sm font-bold leading-tight">{s.d}</p>
                  {s.link && <button onClick={() => window.open(s.link)} className="mt-2 bg-[#dc2626] text-white px-5 py-2 rounded-lg text-[10px] font-black uppercase shadow-lg flex items-center gap-2">↓ {L.download}</button>}
                </div>
              </div>
            ))}
            <div className="p-4 bg-black text-white rounded-2xl text-center font-black shadow-xl">초대 코드: <span className="text-[#dc2626] text-2xl ml-2 tracking-widest">{PI_INVITE}</span></div>
          </div>
        ) : (
          <div className="flex flex-col gap-8 animate-in slide-in-from-bottom-2">
            <div className="bg-gray-50 p-4 md:p-10 rounded-[35px] border-2 border-black shadow-xl flex flex-col md:flex-row justify-between items-center font-black relative overflow-hidden group">
              <div className="text-left w-full md:w-auto z-10">
                <h3 className="text-gray-400 text-[8px] uppercase tracking-widest leading-none">{L.assets}</h3>
                <p className="text-4xl md:text-8xl tracking-tighter leading-none">{Math.floor(token).toLocaleString()}<span className="text-lg opacity-30">.{token.toFixed(2).split('.')[1]}</span> <span className="text-sm md:text-4xl italic">BEOM</span></p>
                <div className="flex gap-2 pt-2"><div className="bg-black text-white px-3 py-1 rounded-lg text-[8px] md:text-base font-mono">1 PI = 100 BEOM</div><div className="bg-[#dc2626] text-white px-3 py-1 rounded-lg text-[8px] md:text-base animate-pulse shadow-md">Social: {redist.toLocaleString()}</div></div>
              </div>
              <img src="/beom-token.png" className="w-16 md:w-44 group-hover:rotate-12 transition-all" alt="B" />
            </div>

            <Header n="01" t="EXCHANGE" d="채굴 기여도를 BEOM으로 즉시 전환" />
            <div className="bg-white p-4 md:p-10 rounded-[25px] border-2 border-black flex justify-between items-center shadow-lg">
              <div className="text-left font-black"><p className="text-base md:text-3xl italic leading-none">TERMINAL</p><p className="text-gray-400 text-[8px] uppercase mt-1">Status: Operational</p></div>
              <button onClick={() => {setToken(p=>p+100); setRev(p=>p+100); alert("OK");}} className="bg-black text-white px-8 py-4 md:px-16 md:py-8 rounded-2xl text-[10px] md:text-2xl font-black uppercase active:scale-95 shadow-xl">{L.convert}</button>
            </div>

            <Header n="02" t="SECURE AUTH" d="보안 QR 코드를 발급받으십시오" />
            <div className="bg-gray-50 p-4 md:p-12 rounded-[30px] border border-black/5 flex flex-col items-center gap-4 shadow-inner">
              <div className="flex gap-2 w-full max-w-xs bg-white p-1 rounded-lg border-2 border-black">
                <button onClick={() => setQr({ ...qr, type: 'PERSONAL', active: false })} className={`flex-1 py-2 rounded text-[9px] font-black ${qr.type === 'PERSONAL' ? 'bg-black text-white' : 'text-gray-400'}`}>PERSONAL</button>
                <button onClick={() => setQr({ ...qr, type: 'BUSINESS', active: false })} className={`flex-1 py-2 rounded text-[9px] font-black ${qr.type === 'BUSINESS' ? 'bg-black text-white' : 'text-gray-400'}`}>BUSINESS</button>
              </div>
              {qr.type === 'BUSINESS' && <input value={qr.biz} onChange={(e)=>setQr({...qr, biz: e.target.value.toUpperCase()})} placeholder="BIZ NAME" className="w-full max-w-xs p-3 rounded-xl border-2 border-black text-center font-black focus:border-[#dc2626] outline-none" />}
              <div className={`bg-white border-4 rounded-[20px] flex items-center justify-center transition-all ${qr.type === 'PERSONAL' ? 'w-40 h-40 md:w-80 md:h-80' : 'w-full max-w-2xl aspect-video'} ${qr.active ? 'border-[#dc2626]' : 'opacity-20 border-black/10'}`}>
                {qr.active ? <div className="flex flex-col items-center p-4"><img src={qr.type === 'PERSONAL' ? "/qr-personal.png" : "/qr-business.png"} className="h-full object-contain" alt="Q" /><p className="text-black text-[10px] font-black italic mt-2">{qr.biz}</p></div> : <p className="text-lg md:text-6xl font-black italic tracking-widest">LOCKED</p>}
              </div>
              <button onClick={() => {if(token < 50) return alert("Low Beom"); setToken(p=>p-50); setQr({...qr, active: true});}} className="w-full max-w-md bg-black text-white py-4 md:py-8 rounded-2xl text-[10px] md:text-xl font-black uppercase shadow-xl">활성화 (50 BEOM)</button>
            </div>

            <Header n="03" t="CREATIVE & FAN" d="팬심과 창작을 제국에 공유" />
            <div className="bg-white p-4 md:p-10 rounded-[30px] border-2 border-black/10 space-y-4 text-left shadow-lg font-black">
              <div className="flex gap-4 border-b pb-2"><button onClick={() => setPost({...post, type: 'CREATIVE'})} className={`text-sm md:text-xl italic font-black ${post.type === 'CREATIVE' ? 'text-black border-b-2 border-black' : 'text-gray-300'}`}>Creative Hub</button><button onClick={() => setPost({...post, type: 'FAN'})} className={`text-sm md:text-xl italic font-black ${post.type === 'FAN' ? 'text-black border-b-2 border-black' : 'text-gray-300'}`}>Fan Spirit</button></div>
              <div className="flex gap-2 overflow-x-auto pb-1">{cats.map(c => <button key={c} onClick={() => setPost({...post, cat: c})} className={`px-4 py-1.5 rounded-full text-[9px] font-black border-2 whitespace-nowrap ${post.cat === c ? 'bg-black text-white shadow-md' : 'text-gray-400 border-black/5'}`}>{c}</button>)}</div>
              <div className="space-y-2"><input value={post.title} onChange={(e)=>setPost({...post, title: e.target.value})} placeholder="TITLE" className="w-full bg-gray-50 p-4 rounded-xl border-2 border-black/5 font-black outline-none" /><textarea value={post.desc} onChange={(e)=>setPost({...post, desc: e.target.value})} placeholder="DETAILS..." className="w-full bg-gray-50 p-4 rounded-xl border-2 border-black/5 h-32 font-bold outline-none" /></div>
              <button onClick={() => {if(!post.title) return; setToken(p=>p-10); alert("Posted"); setPost({...post, title: '', desc: ''})}} className="w-full bg-black text-white py-4 md:py-8 rounded-xl text-sm md:text-2xl font-black shadow-xl uppercase">피드 등록 (10 BEOM)</button>
              <p className="text-gray-400 text-[8px] md:text-sm font-bold bg-gray-50 p-3 rounded-lg italic border-l-4 border-[#dc2626]">※ FAN ROOM 개설(500 BEOM): 수익 90% 환원 및 제국 시민권 부여.</p>
            </div>

            <Header n="04" t="MARKET" d="검증된 상품을 안전하게 거래" />
            <div className="bg-white p-4 md:p-10 rounded-[30px] border-2 border-black/10 shadow-xl text-left space-y-4 font-black">
               <div className="grid grid-cols-2 gap-2"><input value={mkt.name} onChange={(e)=>setMkt({...mkt, name: e.target.value})} placeholder="PRODUCT NAME" className="p-4 bg-gray-50 rounded-xl border-2 border-black/5 outline-none" /><input type="number" value={mkt.price} onChange={(e)=>setMkt({...mkt, price: e.target.value})} placeholder="PRICE" className="p-4 bg-gray-50 rounded-xl border-2 border-black/5 font-black text-[#dc2626] outline-none" /></div>
               <button onClick={()=>fileRef.current.click()} className="w-full bg-gray-50 border-2 border-dashed border-black/20 p-8 rounded-xl text-gray-400 font-black hover:border-black transition-all">📸 {mkt.img ? "PHOTO READY" : "UPLOAD PHOTO"}</button><input type="file" onChange={(e)=>{const f=e.target.files[0]; if(f){const r=new FileReader(); r.onloadend=()=>setMkt({...mkt, img: r.result}); r.readAsDataURL(f);}}} ref={fileRef} className="hidden" />
               <button onClick={() => {if(!mkt.name||!mkt.price||!mkt.img) return alert("Fill Fields"); setGoods([{id:Date.now(), name:mkt.name, price:Number(mkt.price), img:mkt.img, desc:mkt.desc}, ...goods]); setMkt({name:'',price:'',img:'',desc:''}); alert("Registered");}} className="w-full bg-black text-white py-4 md:py-8 rounded-xl text-sm md:text-2xl font-black shadow-xl uppercase">Register (20 BEOM)</button>
               <div className="grid grid-cols-2 gap-3 pt-6">{goods.map(g => (<div key={g.id} className="bg-white p-3 md:p-6 rounded-[25px] border-2 border-black/10 shadow-md flex flex-col group transition-all hover:border-[#dc2626]"><div className="w-full aspect-square bg-gray-50 rounded-xl md:rounded-[30px] mb-2 flex items-center justify-center overflow-hidden"><img src={g.img} className="w-24 md:w-48 group-hover:scale-110 transition-all" alt="G" /></div><h4 className="text-black text-[10px] md:text-xl font-black truncate uppercase leading-none mb-1">{g.name}</h4><p className="text-black text-lg md:text-4xl font-black tracking-tighter mb-2">{g.price.toLocaleString()} <span className="text-[10px] md:text-xl uppercase">Beom</span></p><button className="w-full py-2 md:py-4 bg-black text-white rounded-xl text-[10px] md:text-lg font-black shadow-md">BUY NOW</button></div>))}</div>
            </div>

            <Header n="05" t="PARTNERSHIP" d="제국과 함께할 미래 기업 포털" />
            <div className="bg-black p-4 md:p-12 rounded-[35px] border-4 border-[#dc2626] text-left shadow-2xl relative space-y-6 overflow-hidden font-black">
                <div className="absolute -top-10 -right-10 opacity-10"><img src="/kedheon-character.png" className="w-48 h-48 grayscale" alt="K" /></div>
                <h3 className="text-white text-xl md:text-4xl font-black italic border-l-8 border-[#dc2626] pl-4 z-10 relative uppercase">Business Portal</h3>
                <div className="space-y-3 relative z-10"><div className="grid grid-cols-1 md:grid-cols-2 gap-3"><input value={corp.name} onChange={(e)=>setCorp({...corp, name: e.target.value.toUpperCase()})} placeholder="COMPANY NAME" className="bg-white/5 border-2 border-white/10 p-4 rounded-xl text-white outline-none focus:border-[#dc2626]" /><input value={corp.contact} onChange={(e)=>setCorp({...corp, contact: e.target.value})} placeholder="CONTACT" className="bg-white/5 border-2 border-white/10 p-4 rounded-xl text-white outline-none focus:border-[#dc2626]" /></div><textarea value={corp.msg} onChange={(e)=>setCorp({...corp, msg: e.target.value})} placeholder="PROPOSAL DETAILS..." className="w-full bg-white/5 border-2 border-white/10 p-4 rounded-xl text-white h-40 outline-none focus:border-[#dc2626] font-bold" /></div>
                <button onClick={() => {alert("Submitted."); setCorp({name:'',contact:'',msg:''});}} className="w-full bg-[#dc2626] text-white py-4 md:py-8 rounded-2xl text-sm md:text-2xl font-black hover:bg-white hover:text-[#dc2626] transition-all uppercase shadow-xl">제안서 제출하기</button>
            </div>

            <div className="mt-8 flex justify-center gap-6 text-gray-300 text-[8px] md:text-xs font-mono font-black italic uppercase"><span>Infrastructure: 88-Threads</span><span>Node: 18.02</span><span>Protocol: V23.0 Sync</span></div>
          </div>
        )}
      </main>

      <footer className="fixed bottom-4 left-3 right-3 max-w-4xl mx-auto bg-white border-2 border-black p-1 rounded-[30px] flex justify-between gap-1 z-[300] shadow-2xl font-black">
        {['KEDHEON', 'CIVIL', 'NEXUS', 'VENDOR'].map(app => (<button key={app} className={`flex-1 py-4 md:py-6 rounded-[25px] text-[10px] md:text-xl font-black transition-all ${app === 'KEDHEON' ? 'bg-black text-white shadow-inner scale-[1.02]' : 'text-gray-300 hover:text-black'}`}>{app}</button>))}
      </footer>

      <div className="mt-20 opacity-20 text-black text-[9px] md:text-xl tracking-[1em] pb-32 font-black text-center uppercase">Kedheon master | V107.0 Final Empire | @Ohsangjo</div>
    </div>
  );
}
