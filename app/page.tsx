'use client';
import React, { useState, useEffect } from 'react';

// --- [1. 데이터 모델 정의] ---
interface Asset { id: number; title: string; desc: string; category: string; beomSupport: number; owner: string; timestamp: string; }
interface Territory { id: string; title: string; }
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
  const [project, setProject] = useState<Project>({ id: 1, name: "PI-VENDORS-HUB", target: 1000000, current: 932000, status: "OPEN" });

  const cats = ['MUSIC', 'SPORTS', 'ANIME', 'DRAMA', 'MOVIE', 'ESPORTS', 'COMEDY', 'TRAVEL', 'FOOD', 'BEAUTY', 'FASHION', 'TECH'];
  const t = lang === 'KO' ? {
    authT: "IMPERIAL SECURE AUTH", authD: "제국 공식 보안 신분 인증 및 익명 결제 시스템을 가동합니다.",
    launchT: "TERRITORY EXPANSION", launchD: "제국의 영토 확장 프로젝트를 지원하고 초기 권한을 확보하십시오.",
    conT: "CONTRIBUTION REWARD", conD: "제국 인프라 기여 보상을 확인하고 BEOM을 예치하십시오.",
    fanT: "IMPERIAL FANDOM TERRITORY", fanD: "제국 공식 영토 혹은 시민들이 개척한 자치령 팬방에 진입하십시오.",
    postBtn: "제국 피드에 방송하기", supportBtn: "👑 황금 찬양", enterBtn: "제국 입국하기"
  } : {
    authT: "IMPERIAL SECURE AUTH", authD: "Official secure identity auth and anonymous payment system.",
    launchT: "TERRITORY EXPANSION", launchD: "Support expansion projects and gain early access rights.",
    conT: "CONTRIBUTION REWARD", conD: "Deposit BEOM to sustain and earn ecosystem rewards.",
    fanT: "IMPERIAL FANDOM TERRITORY", fanD: "Enter official territories or autonomous fan rooms.",
    postBtn: "Broadcast", supportBtn: "👑 Praise", enterBtn: "ENTER EMPIRE"
  };

  useEffect(() => {
    setHasMounted(true);
    const saved = localStorage.getItem('kedheon_v19_final');
    if (saved) {
      const p = JSON.parse(saved);
      setBeomToken(p.token || 8141.88); setAssets(p.assets || []); setContributedBeom(p.contributed || 0);
    }
  }, []);

  useEffect(() => {
    if (hasMounted) localStorage.setItem('kedheon_v19_final', JSON.stringify({ token: beomToken, assets, contributed: contributedBeom }));
  }, [beomToken, assets, contributedBeom, hasMounted]);

  if (!hasMounted) return null;

  const SectionHeader = ({ num, title, desc, icon }: any) => (
    <div className="w-full flex flex-col items-start gap-4 md:gap-6 mb-12 md:mb-20 pt-20 md:pt-32 border-t border-white/5">
      <div className="flex items-center gap-4 md:gap-8">
        <span className="text-[#daa520] font-black text-5xl md:text-8xl opacity-10 italic">{num}</span>
        <div className="flex items-center gap-4 md:gap-6">
          {icon && <span className="text-3xl md:text-6xl">{icon}</span>}
          <h3 className="text-[#daa520] font-black text-2xl md:text-6xl tracking-widest uppercase">{title}</h3>
        </div>
      </div>
      <p className="text-gray-500 font-bold text-sm md:text-2xl opacity-80 pl-2 md:pl-4 max-w-5xl">{desc}</p>
    </div>
  );

  return (
    <div className="flex flex-col items-center bg-black min-h-screen text-white font-sans w-full overflow-x-hidden pb-40">
      <div className="w-full max-w-6xl flex justify-between items-center p-6 md:p-12 sticky top-0 bg-black/90 backdrop-blur-xl z-[150] border-b border-white/5">
        <button onClick={() => setLang(l => l === 'KO' ? 'EN' : 'KO')} className="text-[#daa520] font-black text-xs md:text-base border-2 border-[#daa520]/40 px-6 py-2 rounded-full">
          {lang === 'KO' ? "ENGLISH" : "한국어"}
        </button>
        <div className="flex gap-4 md:gap-8">
          <button onClick={() => setTab('ROOKIE')} className={`px-6 py-2 md:px-12 md:py-3 rounded-xl font-black text-xs md:text-xl ${tab === 'ROOKIE' ? 'bg-[#daa520] text-black shadow-xl' : 'bg-[#111] text-gray-500'}`}>ROOKIE</button>
          <button onClick={() => setTab('PIONEER')} className={`px-6 py-2 md:px-12 md:py-3 rounded-xl font-black text-xs md:text-xl ${tab === 'PIONEER' ? 'bg-[#daa520] text-black shadow-xl' : 'bg-[#111] text-gray-500'}`}>PIONEER</button>
        </div>
      </div>

      <div className="w-full max-w-6xl flex flex-col gap-24 md:gap-40 px-6 md:px-10 mt-12 md:mt-24">
        {tab === 'ROOKIE' ? (
          <div className="flex flex-col items-center text-center py-40 animate-in fade-in duration-700">
            <img src="/kedheon-character.png" className="w-64 h-64 md:w-96 md:h-96 rounded-[60px] object-cover mb-12 shadow-3xl border-4 md:border-8 border-[#daa520]/10" alt="K" />
            <h1 className="text-5xl md:text-9xl font-black text-[#daa520] tracking-widest italic mb-12 uppercase leading-none">Kedheon Empire</h1>
            <button onClick={() => setTab('PIONEER')} className="bg-[#daa520] text-black px-12 py-6 md:px-40 md:py-16 rounded-full font-black text-2xl md:text-6xl shadow-2xl transition-all uppercase">{t.enterBtn}</button>
          </div>
        ) : (
          <div className="flex flex-col gap-32 md:gap-60">
            <div className="bg-[#111] p-10 md:p-24 rounded-[50px] md:rounded-[100px] border border-[#daa520]/40 shadow-2xl flex flex-col lg:flex-row justify-between items-center gap-12 relative overflow-hidden">
               <div className="flex flex-col items-center lg:items-start gap-6 md:gap-12 z-10 text-center lg:text-left">
                  <h3 className="text-gray-500 text-sm md:text-2xl uppercase tracking-widest font-black opacity-60">BALANCE | Lv. 88</h3>
                  <p className="text-[#daa520] font-black text-5xl md:text-[10rem] lg:text-[11rem] leading-none">{beomToken.toLocaleString()} BEOM</p>
                  <div className="bg-black/60 px-8 py-4 md:px-16 md:py-8 rounded-2xl md:rounded-[45px] border border-white/5 text-xl md:text-5xl font-mono text-gray-400 italic">≈ {(beomToken / 314.1592).toFixed(4)} Pi</div>
               </div>
               <div className="flex items-center gap-6 md:gap-16 z-10">
                  <img src="/kedheon-character.png" className="w-24 h-24 md:w-80 md:h-80 rounded-[30px] md:rounded-[80px] object-cover border-4 border-white/5 shadow-3xl" alt="Char" />
                  <img src="/beom-token.png" className="w-32 h-32 md:w-[22rem] md:h-[24rem] object-contain transform hover:rotate-12 transition-all duration-1000" alt="Beom" />
               </div>
            </div>

            <div className="flex flex-col w-full">
              <SectionHeader num="01" title={t.authT} desc={t.authD} />
              <div className="w-full bg-[#111] p-10 md:p-24 rounded-[50px] md:rounded-[100px] flex flex-col items-center gap-12 md:gap-24 border border-white/5 shadow-inner">
                <div className="flex gap-4 md:gap-10 bg-black p-3 md:p-6 rounded-2xl md:rounded-[60px] w-full max-w-4xl font-black">
                  <button onClick={() => {setQrType('PERSONAL'); setIsQrActive(false);}} className={`flex-1 py-4 md:py-10 rounded-xl md:rounded-[45px] text-sm md:text-3xl ${qrType === 'PERSONAL' ? 'bg-[#daa520] text-black scale-105' : 'text-gray-500'}`}>개인</button>
                  <button onClick={() => {setQrType('BUSINESS'); setIsQrActive(false);}} className={`flex-1 py-4 md:py-10 rounded-xl md:rounded-[45px] text-sm md:text-3xl ${qrType === 'BUSINESS' ? 'bg-[#daa520] text-black scale-105' : 'text-gray-500'}`}>기업</button>
                </div>
                <div className={`p-10 md:p-20 rounded-[40px] md:rounded-[90px] bg-black border-2 md:border-4 ${isQrActive ? 'border-[#daa520]' : 'opacity-20'}`}>
                  {isQrActive ? <img src={qrType === 'PERSONAL' ? "/qr-personal.png" : "/qr-business.png"} onError={(e:any) => { e.target.src = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=KEDHEON_${qrType}`; }} className="w-40 h-40 md:w-[30rem] md:h-[30rem] rounded-2xl md:rounded-[60px]" alt="QR" /> : <div className="w-40 h-40 md:w-[30rem] md:h-[30rem] flex items-center justify-center text-gray-800 text-3xl md:text-9xl italic font-black">SECURE</div>}
                </div>
                <button onClick={() => {setBeomToken(p => p-50); setIsQrActive(true);}} className="bg-[#daa520] text-black px-12 py-6 md:px-40 md:py-16 rounded-2xl md:rounded-[60px] font-black text-xl md:text-5xl shadow-2xl active:scale-95 transition-all">{isQrActive ? "ACTIVE" : "인증 시작 (50 BEOM)"}</button>
              </div>
            </div>

            <div className="flex flex-col w-full">
              <SectionHeader num="02" title={t.launchT} desc={t.launchD} />
              <div className="w-full bg-[#111] p-10 md:p-24 rounded-[50px] md:rounded-[100px] border border-[#daa520]/20 shadow-3xl space-y-12 md:space-y-24 text-left">
                 <h4 className="text-white font-black text-3xl md:text-7xl italic uppercase">🚀 {project.name}</h4>
                 <div className="space-y-6 md:space-y-12">
                    <div className="flex justify-between text-lg md:text-3xl font-black text-gray-500 uppercase"><span>STATUS</span><span className="text-[#daa520] text-2xl md:text-6xl">{Math.round((project.current / project.target) * 100)}%</span></div>
                    <div className="w-full h-8 md:h-16 bg-white/5 rounded-full overflow-hidden border border-white/5"><div className="h-full bg-gradient-to-r from-[#b8860b] to-[#daa520] transition-all duration-1000 shadow-[0_0_50px_rgba(218,165,32,0.8)]" style={{ width: `${(project.current / project.target) * 100}%` }}></div></div>
                 </div>
                 <button onClick={() => {setBeomToken(p => p-1000); alert("지원 완료!");}} className="w-full py-8 md:py-16 rounded-3xl md:rounded-[70px] bg-white text-black font-black text-xl md:text-6xl hover:bg-[#daa520] transition-all uppercase shadow-3xl">개척 지원 (1,000 BEOM)</button>
              </div>
            </div>

            <div className="flex flex-col w-full">
              <SectionHeader num="03" title={t.conT} desc={t.conD} />
              <div className="w-full bg-[#111] p-10 md:p-24 rounded-[50px] md:rounded-[120px] border border-[#daa520]/20 flex flex-col items-center gap-10 md:gap-20 shadow-3xl relative overflow-hidden">
                 <p className="text-gray-500 font-black text-lg md:text-3xl uppercase tracking-widest opacity-60">STAKED LOYALTY</p>
                 <p className="text-white font-black text-5xl md:text-[14rem] tracking-tighter leading-none">{contributedBeom.toLocaleString()} <span className="text-2xl md:text-6xl text-[#daa520]">BEOM</span></p>
                 <button onClick={() => {setBeomToken(p => p-1000); setContributedBeom(p => p+1000);}} className="bg-gradient-to-br from-[#daa520] to-[#b8860b] text-black px-12 py-6 md:px-60 md:py-16 rounded-2xl md:rounded-[60px] font-black text-xl md:text-5xl shadow-2xl active:scale-95 transition-all uppercase">EXECUTE</button>
              </div>
            </div>

            <div className="flex flex-col w-full">
              <SectionHeader num="04" title={t.fanT} desc={t.fanD} icon="🌐" />
              <div className="grid grid-cols-3 md:grid-cols-6 gap-4 md:gap-8 w-full mb-16 md:mb-32">
                {cats.map(cat => (
                  <button key={cat} onClick={() => setCategory(cat)} className={`py-6 md:py-14 rounded-2xl md:rounded-[55px] font-black text-[10px] md:text-2xl tracking-widest border-2 transition-all ${category === cat ? 'bg-[#daa520] text-black border-[#daa520] shadow-3xl' : 'bg-[#111] text-gray-500 border-white/5 hover:border-[#daa520]/40'}`}>{cat}</button>
                ))}
              </div>
              <div className="w-full bg-[#111] p-10 md:p-24 rounded-[40px] md:rounded-[120px] border border-white/10 space-y-10 md:space-y-16 text-left mb-20 md:mb-40 shadow-3xl">
                <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="TITLE" className="bg-black p-6 md:p-14 rounded-2xl md:rounded-[65px] border border-white/5 w-full text-xl md:text-5xl outline-none focus:border-[#daa520] font-black text-white" />
                <textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="DETAILS" className="bg-black p-6 md:p-14 rounded-2xl md:rounded-[65px] border border-white/5 w-full text-lg md:text-4xl h-40 md:h-80 outline-none focus:border-[#daa520] resize-none text-gray-300 font-bold" />
                <button onClick={() => { if(!newTitle.trim()) return alert("!"); setAssets([{id: Date.now(), title: newTitle, desc: newDesc, category, beomSupport: 0, owner: 'CHEOREOM_88', timestamp: new Date().toLocaleDateString()}, ...assets]); setBeomToken(p=>p-10); setNewTitle(''); setNewDesc(''); }} className="w-full py-8 md:py-16 rounded-[30px] md:rounded-[80px] font-black text-2xl md:text-6xl bg-[#daa520] text-black shadow-3xl uppercase">{t.postBtn}</button>
              </div>
              <div className="w-full space-y-24 md:space-y-48">
                <button onClick={() => setCategory('ALL')} className={`w-full py-8 md:py-16 rounded-3xl md:rounded-[70px] font-black text-2xl md:text-5xl border-4 ${category === 'ALL' ? 'border-[#daa520] text-[#daa520] bg-[#daa520]/5' : 'border-white/5 text-gray-600'}`}>ENTER ALL FEED</button>
                {assets.filter(a => category === 'ALL' || a.category === category).map(a => (
                  <div key={a.id} className="bg-[#111] rounded-[50px] md:rounded-[150px] border border-white/5 shadow-2xl p-10 md:p-28 space-y-10 md:space-y-20 text-left relative animate-in slide-in-from-bottom-20 duration-1000">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                      <div className="space-y-4"><p className="text-[#daa520] font-black text-xs md:text-2xl tracking-widest uppercase opacity-60">[{a.category}]</p><h4 className="text-3xl md:text-[8rem] font-black text-white leading-tight tracking-tighter">{a.title}</h4></div>
                      <span className="text-gray-600 font-mono text-xs md:text-4xl font-bold md:border-l-[12px] border-gray-800 md:pl-12 h-fit py-2 md:py-4">{a.timestamp}</span>
                    </div>
                    <p className="text-gray-400 text-lg md:text-[3.5rem] font-bold leading-relaxed px-2 md:px-12 italic">"{a.desc}"</p>
                    <div className="pt-10 md:pt-24 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                      <button onClick={() => { if(beomToken<100) return alert("!"); setAssets(assets.map(i=>i.id===a.id?{...i, beomSupport:i.beomSupport+100}:i)); setBeomToken(p=>p-100); }} className="bg-white text-black px-12 py-5 md:px-24 md:py-12 rounded-2xl md:rounded-[50px] font-black text-xl md:text-4xl hover:scale-110 shadow-3xl">{t.supportBtn}</button>
                      <p className="text-[#daa520] font-black text-4xl md:text-[11rem] tracking-tighter leading-none">{a.beomSupport.toLocaleString()} <span className="text-xl md:text-6xl ml-4">BEOM</span></p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="mt-80 opacity-20 text-center w-full pb-60 font-mono tracking-[1em] md:tracking-[3em] uppercase text-white/50 text-xs md:text-xl">Kedheon Empire | Final v19.0 Full Master</div>
    </div>
  );
}
