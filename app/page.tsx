'use client';
import React, { useState, useEffect } from 'react';

// --- [1. 데이터 모델] ---
interface Asset { id: number; title: string; desc: string; category: string; beomSupport: number; timestamp: string; }
interface Project { id: number; name: string; target: number; current: number; status: string; }

export default function KedheonPortal() {
  const [hasMounted, setHasMounted] = useState(false);
  const [lang, setLang] = useState<'KO' | 'EN'>('KO');
  const [tab, setTab] = useState<'ROOKIE' | 'PIONEER'>('PIONEER');
  const [beomToken, setBeomToken] = useState(8141.88);
  const [contributedBeom, setContributedBeom] = useState(0);
  const [qrType, setQrType] = useState<'PERSONAL' | 'BUSINESS'>('PERSONAL');
  const [isQrActive, setIsQrActive] = useState(false);
  const [category, setCategory] = useState('ALL');
  const [assets, setAssets] = useState<Asset[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [project, setProject] = useState<Project>({ id: 1, name: "PI-VENDORS-NODE", target: 1000000, current: 915000, status: "OPEN" });

  const cats = ['MUSIC', 'SPORTS', 'ANIME', 'DRAMA', 'MOVIE', 'ESPORTS', 'COMEDY', 'TRAVEL', 'FOOD', 'BEAUTY', 'FASHION', 'TECH'];
  const t = lang === 'KO' ? {
    balance: "제국 자산 잔액", grade: "제국 등급",
    authT: "IMPERIAL SECURE AUTH", authD: "제국 공식 보안 신분 인증 및 익명 결제 시스템을 가동합니다.",
    launchT: "TERRITORY EXPANSION", launchD: "제국의 영토 확장 프로젝트를 지원하고 초기 권한을 확보하십시오.",
    conT: "CONTRIBUTION REWARD", conD: "제국 인프라 기여 보상을 확인하고 BEOM을 예치하십시오.",
    fanT: "IMPERIAL FANDOM TERRITORY", fanD: "제국 공식 영토 혹은 시민들이 개척한 자치령 팬방에 진입하십시오.",
    postBtn: "피드에 방송하기", supportBtn: "👑 황금 찬양", enterBtn: "제국 입국하기"
  } : {
    balance: "Empire Balance", grade: "Empire Grade",
    authT: "IMPERIAL SECURE AUTH", authD: "Activate official secure identity auth and anonymous payment system.",
    launchT: "TERRITORY EXPANSION", launchD: "Support expansion projects and gain early access rights.",
    conT: "CONTRIBUTION REWARD", conD: "Deposit BEOM to sustain and earn ecosystem rewards.",
    fanT: "IMPERIAL FANDOM TERRITORY", fanD: "Enter official territories or user-created autonomous fan rooms.",
    postBtn: "Broadcast to Feed", supportBtn: "👑 Royal Praise", enterBtn: "ENTER EMPIRE"
  };

  useEffect(() => {
    setHasMounted(true);
    const saved = localStorage.getItem('k_v14_final');
    if (saved) {
      const p = JSON.parse(saved);
      setBeomToken(p.token); setAssets(p.assets || []); setContributedBeom(p.contributed || 0);
    }
  }, []);

  useEffect(() => {
    if (hasMounted) localStorage.setItem('k_v14_final', JSON.stringify({ token: beomToken, assets, contributed: contributedBeom }));
  }, [beomToken, assets, contributedBeom, hasMounted]);

  if (!hasMounted) return null;

  const SectionHeader = ({ num, title, desc, icon }: any) => (
    <div className="w-full flex flex-col items-start gap-6 mb-20 pt-32 border-t border-white/5 animate-in fade-in duration-1000">
      <div className="flex items-center gap-8">
        <span className="text-[#daa520] font-black text-8xl opacity-10 italic select-none">{num}</span>
        <div className="flex items-center gap-6">
          {icon && <span className="text-6xl">{icon}</span>}
          <h3 className="text-[#daa520] font-black text-6xl tracking-widest uppercase">{title}</h3>
        </div>
      </div>
      <p className="text-gray-500 font-bold text-3xl opacity-80 pl-4 max-w-5xl leading-relaxed">{desc}</p>
    </div>
  );

  return (
    <div className="flex flex-col items-center bg-black min-h-screen text-white font-sans w-full overflow-x-hidden pb-60">
      
      {/* 1. 와이드 글로벌 헤더 */}
      <div className="w-full max-w-6xl flex justify-between items-center p-12 sticky top-0 bg-black/90 backdrop-blur-2xl z-[150] border-b border-white/5">
        <button onClick={() => setLang(l => l === 'KO' ? 'EN' : 'KO')} className="text-[#daa520] font-black text-lg border-2 border-[#daa520]/40 px-10 py-3 rounded-full hover:bg-[#daa520] hover:text-black transition-all">
          {lang === 'KO' ? "ENGLISH" : "한국어"}
        </button>
        <div className="flex gap-8">
          <button onClick={() => setTab('ROOKIE')} className={`px-12 py-3 rounded-2xl font-black text-xl ${tab === 'ROOKIE' ? 'bg-[#daa520] text-black shadow-2xl scale-110' : 'bg-[#111] text-gray-500'}`}>ROOKIE</button>
          <button onClick={() => setTab('PIONEER')} className={`px-12 py-3 rounded-2xl font-black text-xl ${tab === 'PIONEER' ? 'bg-[#daa520] text-black shadow-2xl scale-110' : 'bg-[#111] text-gray-500'}`}>PIONEER</button>
        </div>
      </div>

      <div className="w-full max-w-6xl flex flex-col gap-40 px-10 mt-24">
        {tab === 'ROOKIE' ? (
          <div className="flex flex-col items-center text-center py-60 animate-in fade-in zoom-in duration-1000">
            <img src="/kedheon-character.png" className="w-[30rem] h-[30rem] rounded-[100px] object-cover mb-20 shadow-3xl border-8 border-[#daa520]/10" alt="K" />
            <h1 className="text-[10rem] font-black text-[#daa520] tracking-widest italic mb-20 leading-none">Kedheon Empire</h1>
            <button onClick={() => setTab('PIONEER')} className="bg-[#daa520] text-black px-60 py-20 rounded-[80px] font-black text-7xl shadow-3xl hover:scale-105 active:scale-95 transition-all uppercase">{t.enterBtn}</button>
          </div>
        ) : (
          <div className="flex flex-col gap-60 animate-in slide-in-from-bottom-20 duration-1000">
            
            {/* 00. 대시보드 - 와이드 레이아웃 */}
            <div className="bg-[#111] p-24 rounded-[100px] border border-[#daa520]/40 shadow-2xl flex flex-col md:flex-row justify-between items-center gap-24 relative overflow-hidden group">
               <div className="flex flex-col items-start gap-12 z-10 text-left">
                  <h3 className="text-gray-500 text-2xl uppercase tracking-[0.8em] font-black opacity-60">{t.balance}</h3>
                  <p className="text-[#daa520] font-black text-[12rem] tracking-tighter leading-none">{beomToken.toLocaleString()} BEOM</p>
                  <div className="bg-black/60 px-16 py-8 rounded-[45px] border border-white/5 shadow-2xl text-5xl font-mono text-gray-400">≈ {(beomToken / 314.1592).toFixed(4)} Pi</div>
               </div>
               <div className="flex items-center gap-16 z-10">
                  <img src="/kedheon-character.png" className="w-80 h-80 rounded-[80px] object-cover border-8 border-white/5 shadow-3xl group-hover:scale-110 transition-transform duration-1000" alt="Char" />
                  <div className="flex flex-col items-center gap-8">
                    <img src="/beom-token.png" className="w-[22rem] h-[24rem] object-contain transform group-hover:rotate-12 transition-transform duration-1000" alt="Beom" />
                    <p className="bg-[#daa520] text-black px-16 py-6 rounded-full font-black text-5xl shadow-2xl italic">Lv. 88</p>
                  </div>
               </div>
            </div>

            {/* 01. 보안 신분 인증 */}
            <div className="flex flex-col w-full">
              <SectionHeader num="01" title={t.authT} desc={t.authD} />
              <div className="w-full bg-[#111] p-24 rounded-[100px] flex flex-col items-center gap-24 shadow-inner border border-white/5">
                <div className="flex gap-10 bg-black p-6 rounded-[60px] w-full max-w-4xl">
                  <button onClick={() => {setQrType('PERSONAL'); setIsQrActive(false);}} className={`flex-1 py-10 rounded-[45px] font-black text-3xl transition-all ${qrType === 'PERSONAL' ? 'bg-[#daa520] text-black scale-105' : 'text-gray-500'}`}>{t.personal === "개인 보안 인증" ? "개인" : "Personal"}</button>
                  <button onClick={() => {setQrType('BUSINESS'); setIsQrActive(false);}} className={`flex-1 py-10 rounded-[45px] font-black text-3xl transition-all ${qrType === 'BUSINESS' ? 'bg-[#daa520] text-black scale-105' : 'text-gray-500'}`}>{t.business === "기업 비즈니스 인증" ? "기업" : "Business"}</button>
                </div>
                <div className={`p-20 rounded-[90px] bg-black border-4 transition-all shadow-3xl ${isQrActive ? 'border-[#daa520]' : 'border-white/5 opacity-20'}`}>
                  {isQrActive ? <img src={qrType === 'PERSONAL' ? "/qr-personal.png" : "/qr-business.png"} onError={(e) => { e.currentTarget.src = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=KEDHEON_${qrType}`; }} className="w-[30rem] h-[30rem] rounded-[60px]" alt="QR" /> : <div className="w-[30rem] h-[30rem] flex items-center justify-center text-gray-800 text-9xl italic font-black">SECURE</div>}
                </div>
                <button onClick={() => {setBeomToken(p => p-50); setIsQrActive(true);}} className="bg-[#daa520] text-black px-40 py-16 rounded-[60px] font-black text-5xl shadow-2xl active:scale-95 transition-all">{isQrActive ? "ACTIVE" : t.authInactive}</button>
              </div>
            </div>

            {/* 02. 런치패드 */}
            <div className="flex flex-col w-full">
              <SectionHeader num="02" title={t.launchT} desc={t.launchD} />
              <div className="w-full bg-gradient-to-br from-[#111] to-black p-24 rounded-[100px] border border-[#daa520]/20 shadow-3xl space-y-24 text-left">
                 <h4 className="text-white font-black text-7xl italic uppercase">🚀 {project.name}</h4>
                 <div className="space-y-12">
                    <div className="flex justify-between text-3xl font-black text-gray-500 uppercase"><span>STATUS</span><span className="text-[#daa520] text-6xl">{Math.round((project.current / project.target) * 100)}%</span></div>
                    <div className="w-full h-16 bg-white/5 rounded-full overflow-hidden border border-white/5"><div className="h-full bg-gradient-to-r from-[#b8860b] to-[#daa520] shadow-[0_0_50px_rgba(218,165,32,0.8)] transition-all duration-1000" style={{ width: `${(project.current / project.target) * 100}%` }}></div></div>
                 </div>
                 <button onClick={() => {setBeomToken(p => p-1000); setProject(p => ({...p, current: p.current+1000}));}} className="w-full py-16 rounded-[70px] bg-white text-black font-black text-6xl hover:bg-[#daa520] transition-all uppercase shadow-3xl active:scale-95">{t.supportProject}</button>
              </div>
            </div>

            {/* 03. 기여 보상 */}
            <div className="flex flex-col w-full">
              <SectionHeader num="03" title={t.conT} desc={t.conD} />
              <div className="w-full bg-[#111] p-24 rounded-[120px] border border-[#daa520]/20 flex flex-col items-center gap-20 shadow-3xl relative overflow-hidden group">
                 <p className="text-gray-500 font-black text-3xl uppercase tracking-[0.6em] opacity-60">STAKED LOYALTY</p>
                 <p className="text-white font-black text-[15rem] tracking-tighter leading-none">{contributedBeom.toLocaleString()} <span className="text-6xl text-[#daa520]">BEOM</span></p>
                 <button onClick={() => {setBeomToken(p => p-1000); setContributedBeom(p => p+1000);}} className="bg-gradient-to-br from-[#daa520] to-[#b8860b] text-black px-60 py-16 rounded-[60px] font-black text-5xl shadow-3xl active:scale-95 transition-all uppercase">EXECUTE</button>
              </div>
            </div>

            {/* 04. 시민 영토 & 방송 */}
            <div className="flex flex-col w-full">
              <SectionHeader num="04" title={t.fanT} desc={t.fanD} icon="🌐" />
              <div className="grid grid-cols-3 md:grid-cols-6 gap-8 w-full mb-32">
                {cats.map(cat => (
                  <button key={cat} onClick={() => setCategory(cat)} className={`py-14 rounded-[55px] font-black text-2xl tracking-widest border-2 transition-all ${category === cat ? 'bg-[#daa520] text-black border-[#daa520] shadow-3xl scale-110' : 'bg-[#111] text-gray-500 border-white/5 hover:border-[#daa520]/50'}`}>{cat}</button>
                ))}
              </div>
              <div className="w-full bg-[#111] p-24 rounded-[120px] border border-white/10 space-y-16 text-left mb-40 shadow-3xl">
                <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="TITLE" className="bg-black p-14 rounded-[65px] border border-white/5 w-full text-5xl outline-none focus:border-[#daa520] font-black text-white" />
                <textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="DETAILS" className="bg-black p-14 rounded-[65px] border border-white/5 w-full text-4xl h-80 outline-none focus:border-[#daa520] resize-none text-gray-300 font-bold" />
                <button onClick={() => { if(!newTitle.trim()) return alert("제목!"); setAssets([{id: Date.now(), title: newTitle, desc: newDesc, category, beomSupport: 0, timestamp: new Date().toLocaleDateString()}, ...assets]); setBeomToken(p=>p-10); setNewTitle(''); setNewDesc(''); }} className="w-full py-16 rounded-[80px] font-black text-6xl bg-gradient-to-r from-[#daa520] to-[#b8860b] text-black shadow-3xl uppercase transition-all">{t.postBtn}</button>
              </div>
              <div className="w-full space-y-48">
                <button onClick={() => setCategory('ALL')} className={`w-full py-16 rounded-[70px] font-black text-5xl border-4 transition-all mb-24 ${category === 'ALL' ? 'border-[#daa520] text-[#daa520] bg-[#daa520]/5 shadow-3xl' : 'border-white/5 text-gray-600'}`}>ENTER ALL FEED</button>
                {assets.filter(a => category === 'ALL' || a.category === category).map(a => (
                  <div key={a.id} className="bg-[#111] rounded-[150px] border border-white/5 shadow-2xl p-28 space-y-20 text-left relative animate-in slide-in-from-bottom-20 duration-1000">
                    <div className="flex justify-between items-start">
                      <div className="space-y-8"><p className="text-[#daa520] font-black text-2xl tracking-[0.6em] uppercase opacity-60">[{a.category}]</p><h4 className="text-[8rem] font-black text-white leading-tight tracking-tighter">{a.title}</h4></div>
                      <span className="text-gray-600 font-mono text-4xl font-bold border-l-[12px] border-gray-800 pl-12 h-fit py-4">{a.timestamp}</span>
                    </div>
                    <p className="text-gray-400 text-[3.5rem] font-bold leading-relaxed px-12 italic">"{a.desc}"</p>
                    <div className="pt-24 border-t border-white/5 flex justify-between items-center px-12">
                      <button onClick={() => { if(beomToken<100) return alert("!"); setAssets(assets.map(i=>i.id===a.id?{...i, beomSupport:i.beomSupport+100}:i)); setBeomToken(p=>p-100); }} className="bg-gradient-to-r from-[#daa520] to-[#b8860b] text-black px-24 py-12 rounded-[50px] font-black text-4xl hover:scale-110 shadow-3xl">{t.supportBtn}</button>
                      <p className="text-[#daa520] font-black text-[10rem] tracking-tighter leading-none">{a.beomSupport.toLocaleString()} <span className="text-6xl ml-6">BEOM</span></p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="mt-80 opacity-20 text-center w-full pb-60 font-mono tracking-[4em] uppercase text-white/50 text-xl">Kedheon Empire | Grand Master v14.0 Verified</div>
    </div>
  );
}
