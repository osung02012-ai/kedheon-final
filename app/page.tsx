'use client';
import React, { useState, useEffect } from 'react';

// --- [1. 데이터 및 인터페이스 정의] ---
interface Asset { id: number; title: string; desc: string; category: string; beomSupport: number; owner: string; timestamp: string; }
interface Project { id: number; name: string; target: number; current: number; status: string; }

const translations = {
  KO: {
    balance: "제국 자산 잔액", grade: "제국 등급",
    0: "DASHBOARD", 1: "CITIZENSHIP", 2: "LAUNCHPAD", 3: "CONTRIBUTION", 4: "TERRITORIES", 5: "BROADCAST",
    cTitle: "IMPERIAL CITIZENSHIP", cDesc: "개인 및 기업 시민권을 획득하여 제국의 정식 일원이 되십시오.",
    lTitle: "TERRITORY EXPANSION", lDesc: "새로운 영토 개척 프로젝트를 지원하고 초기 권한을 확보하십시오.",
    conTitle: "CONTRIBUTION REWARD", conDesc: "제국 인프라 기여 보상을 확인하고 BEOM을 예치하십시오.",
    fTitle: "EMPIRE TERRITORIES", fDesc: "12대 공식 영토 피드를 정복하십시오.",
    bTitle: "BROADCAST CENTER", bDesc: "제국 전역에 당신의 영상을 박제하십시오.",
    personal: "개인 시민", business: "기업 엔티티", authActive: "인증 완료", authInactive: "인증 필요 (50 BEOM)",
    lStatus: "개척 진행률", lSupport: "개척 지원 (1,000 BEOM)",
    conBal: "누적 기여 자산", conBtn: "기여 실행 (1,000 BEOM)",
    enterAll: "전체 피드", postBtn: "피드에 방송하기", supportBtn: "👑 황금 찬양", enterBtn: "제국 입국하기"
  },
  EN: {
    balance: "Empire Balance", grade: "Empire Grade",
    0: "DASHBOARD", 1: "CITIZENSHIP", 2: "LAUNCHPAD", 3: "CONTRIBUTION", 4: "TERRITORIES", 5: "BROADCAST",
    cTitle: "IMPERIAL CITIZENSHIP", cDesc: "Obtain official citizenship and join the Empire.",
    lTitle: "TERRITORY EXPANSION", lDesc: "Support expansion projects and gain early rights.",
    conTitle: "CONTRIBUTION REWARD", conDesc: "Deposit BEOM to sustain and earn rewards.",
    fTitle: "EMPIRE TERRITORIES", fDesc: "Explore the 12 Official Territories.",
    bTitle: "BROADCAST CENTER", bDesc: "Broadcast your video across the Empire.",
    personal: "Personal", business: "Business", authActive: "Authorized", authInactive: "Auth Required",
    lStatus: "Progress", lSupport: "Support (1,000 BEOM)",
    conBal: "Staked Assets", conBtn: "Execute Contribution",
    enterAll: "ENTER ALL", postBtn: "Post to Feed", supportBtn: "👑 Royal Praise", enterBtn: "ENTER EMPIRE"
  }
};

// --- [2. 시인성 강화 섹션 타이틀] ---
const SectionHeader = ({ num, title, desc }: { num: string, title: string; desc: string }) => (
  <div className="w-full flex flex-col items-start gap-4 mb-16 pt-20 border-t border-white/5">
    <div className="flex items-center gap-4">
      <span className="text-[#daa520] font-black text-5xl opacity-20 italic">{num}</span>
      <h3 className="text-[#daa520] font-black text-3xl tracking-[0.2em] uppercase border-l-4 border-[#daa520] pl-6">{title}</h3>
    </div>
    <p className="text-gray-500 font-bold text-lg opacity-80 pl-14 max-w-2xl">{desc}</p>
  </div>
);

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
  const [project, setProject] = useState<Project>({ id: 1, name: "PI-VENDORS-HUB", target: 1000000, current: 875000, status: "OPEN" });

  const t = translations[lang];
  const cats = ['MUSIC', 'SPORTS', 'ANIME', 'DRAMA', 'MOVIE', 'ESPORTS', 'COMEDY', 'TRAVEL', 'FOOD', 'BEAUTY', 'FASHION', 'TECH'];

  useEffect(() => {
    setHasMounted(true);
    const saved = localStorage.getItem('k_empire_v8');
    if (saved) {
      const p = JSON.parse(saved);
      setBeomToken(p.token || 8141.88); setAssets(p.assets || []); setContributedBeom(p.contributed || 0);
    }
  }, []);

  useEffect(() => {
    if (hasMounted) {
      localStorage.setItem('k_empire_v8', JSON.stringify({ token: beomToken, assets, contributed: contributedBeom }));
    }
  }, [beomToken, assets, contributedBeom, hasMounted]);

  if (!hasMounted) return null;

  const support = (id: number) => {
    if (beomToken < 100) return alert("잔액 부족!");
    setAssets(assets.map(a => a.id === id ? { ...a, beomSupport: a.beomSupport + 100 } : a));
    setBeomToken(p => p - 100);
  };

  return (
    <div className="flex flex-col items-center bg-black min-h-screen text-white font-sans w-full overflow-x-hidden pb-40">
      
      {/* 글로벌 헤더 */}
      <div className="w-full max-w-4xl flex justify-between items-center p-8 sticky top-0 bg-black/90 backdrop-blur-xl z-[100] border-b border-white/10">
        <button onClick={() => setLang(l => l === 'KO' ? 'EN' : 'KO')} className="text-[#daa520] font-black text-xs tracking-widest border border-[#daa520]/40 px-6 py-2 rounded-full hover:bg-[#daa520] hover:text-black transition-all">
          {lang === 'KO' ? "ENGLISH" : "한국어"}
        </button>
        <div className="flex gap-4">
          <button onClick={() => setTab('ROOKIE')} className={`px-6 py-2 rounded-xl font-black text-xs transition-all ${tab === 'ROOKIE' ? 'bg-[#daa520] text-black shadow-lg' : 'bg-[#111] text-gray-500'}`}>ROOKIE</button>
          <button onClick={() => setTab('PIONEER')} className={`px-6 py-2 rounded-xl font-black text-xs transition-all ${tab === 'PIONEER' ? 'bg-[#daa520] text-black shadow-lg' : 'bg-[#111] text-gray-500'}`}>PIONEER</button>
        </div>
      </div>

      <div className="w-full max-w-2xl flex flex-col gap-32 px-4 mt-16">
        {tab === 'ROOKIE' ? (
          <div className="flex flex-col items-center text-center py-20 animate-in fade-in duration-700">
            <h1 className="text-6xl font-black text-[#daa520] tracking-widest mb-12 uppercase italic">Kedheon Empire</h1>
            <button onClick={() => setTab('PIONEER')} className="bg-[#daa520] text-black px-20 py-8 rounded-3xl font-black text-2xl shadow-2xl hover:scale-105 transition-all uppercase">{t.enterBtn}</button>
          </div>
        ) : (
          <div className="flex flex-col gap-40 animate-in slide-in-from-bottom-10 duration-700">
            
            {/* 00. 대시보드 */}
            <div className="bg-[#111] p-12 rounded-[60px] border border-[#daa520]/40 shadow-2xl flex flex-col items-center gap-10 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-5 font-black text-6xl italic uppercase">{t[0]}</div>
               <img src="/beom-token.png" className="w-56 h-56 object-contain transform hover:scale-110 transition-transform duration-500" alt="Beom" />
               <div className="text-center space-y-4">
                 <h3 className="text-gray-500 text-xs uppercase tracking-[0.5em] font-black opacity-60">{t.balance} | Lv. 88</h3>
                 <p className="text-[#daa520] font-black text-7xl tracking-tighter leading-none">{beomToken.toLocaleString()} BEOM</p>
                 <p className="text-gray-400 font-mono text-xl opacity-60">≈ {(beomToken / 314.1592).toFixed(4)} Pi</p>
               </div>
            </div>

            {/* 01. 시민권 */}
            <div className="flex flex-col items-start">
              <SectionHeader num="01" title={t.cTitle} desc={t.cDesc} />
              <div className="w-full bg-[#111] p-10 rounded-[50px] flex flex-col items-center gap-8 border border-white/5">
                <div className="flex gap-2 bg-black p-2 rounded-2xl w-full">
                  <button onClick={() => {setQrType('PERSONAL'); setIsQrActive(false);}} className={`flex-1 py-4 rounded-xl font-black text-sm transition-all ${qrType === 'PERSONAL' ? 'bg-[#daa520] text-black' : 'text-gray-500'}`}>{t.personal}</button>
                  <button onClick={() => {setQrType('BUSINESS'); setIsQrActive(false);}} className={`flex-1 py-4 rounded-xl font-black text-sm transition-all ${qrType === 'BUSINESS' ? 'bg-[#daa520] text-black' : 'text-gray-500'}`}>{t.business}</button>
                </div>
                <div className={`p-8 rounded-[40px] bg-black border-2 transition-all ${isQrActive ? 'border-[#daa520]' : 'border-white/5 opacity-30'}`}>
                  {isQrActive ? <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=KEDHEON_${qrType}`} className="w-40 h-40 rounded-2xl" alt="QR" /> : <div className="w-40 h-40 flex items-center justify-center text-gray-800 text-5xl italic font-black">QR</div>}
                </div>
                <button onClick={() => {setBeomToken(p => p-50); setIsQrActive(true);}} className="bg-[#daa520] text-black px-12 py-5 rounded-2xl font-black text-xl shadow-2xl transition-all uppercase">{isQrActive ? t.authActive : t.authInactive}</button>
              </div>
            </div>

            {/* 02. 런치패드 */}
            <div className="flex flex-col items-start">
              <SectionHeader num="02" title={t.lTitle} desc={t.lDesc} />
              <div className="w-full bg-gradient-to-br from-[#111] to-black p-12 rounded-[50px] border border-[#daa520]/20 space-y-10 shadow-xl">
                 <h4 className="text-white font-black text-2xl italic uppercase tracking-tighter">🚀 {project.name}</h4>
                 <div className="space-y-4">
                    <div className="flex justify-between text-xs font-black text-gray-500 uppercase"><span>{t.lStatus}</span><span className="text-[#daa520]">{Math.round((project.current / project.target) * 100)}%</span></div>
                    <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-[#daa520] transition-all duration-1000" style={{ width: `${(project.current / project.target) * 100}%` }}></div></div>
                 </div>
                 <button onClick={() => {setBeomToken(p => p-1000); setProject(p => ({...p, current: p.current+1000}));}} className="w-full py-6 rounded-2xl bg-white text-black font-black text-xl hover:bg-[#daa520] transition-all uppercase">{t.lSupport}</button>
              </div>
            </div>

            {/* 03. 기여 보상 */}
            <div className="flex flex-col items-start">
              <SectionHeader num="03" title={t.conTitle} desc={t.conDesc} />
              <div className="w-full bg-[#111] p-12 rounded-[50px] border border-[#daa520]/20 flex flex-col items-center gap-8 shadow-xl">
                 <p className="text-white font-black text-6xl tracking-tighter">{contributedBeom.toLocaleString()} BEOM</p>
                 <button onClick={() => {setBeomToken(p => p-1000); setContributedBeom(p => p+1000);}} className="bg-[#daa520] text-black px-16 py-6 rounded-2xl font-black text-xl shadow-2xl transition-all uppercase">{t.conBtn}</button>
              </div>
            </div>

            {/* 04. 영토 피드 */}
            <div className="flex flex-col items-start">
              <SectionHeader num="04" title={t.fTitle} desc={t.fDesc} />
              <div className="grid grid-cols-3 gap-3 w-full mb-8">
                {cats.map(cat => (
                  <button key={cat} onClick={() => setCategory(cat)} className={`py-4 rounded-2xl font-black text-[10px] tracking-widest border transition-all ${category === cat ? 'bg-[#daa520] text-black border-[#daa520]' : 'bg-[#111] text-gray-500 border-white/5'}`}>{cat}</button>
                ))}
              </div>
              <button onClick={() => setCategory('ALL')} className={`w-full py-5 rounded-2xl font-black text-sm border-2 transition-all ${category === 'ALL' ? 'border-[#daa520] text-[#daa520]' : 'border-white/5 text-gray-600'}`}>{t.enterAll}</button>
            </div>

            {/* 05. 브로드캐스트 센터 */}
            <div className="flex flex-col items-start">
              <SectionHeader num="05" title={t.bTitle} desc={t.bDesc} />
              <div className="w-full bg-[#111] p-10 rounded-[50px] border border-white/10 space-y-6 text-left mb-16 shadow-2xl">
                <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="방송 제목" className="bg-black p-6 rounded-2xl border border-white/5 w-full text-xl outline-none focus:border-[#daa520] font-black text-white" />
                <textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="상세 내용" className="bg-black p-6 rounded-2xl border border-white/5 w-full text-lg h-32 outline-none focus:border-[#daa520] resize-none text-gray-300" />
                <button onClick={() => {
                  if (!newTitle.trim()) return alert("제목 필수!");
                  setAssets([{ id: Date.now(), title: newTitle, desc: newDesc, category, beomSupport: 0, owner: empireCharacterName, timestamp: new Date().toLocaleDateString() }, ...assets]);
                  setBeomToken(p => p - 10); setNewTitle(''); setNewDesc('');
                }} className="w-full py-8 rounded-3xl font-black text-2xl bg-[#daa520] text-black shadow-2xl uppercase transition-all">{t.postBtn}</button>
              </div>

              <div className="w-full space-y-16">
                {assets.filter(a => category === 'ALL' || a.category === category).map(a => (
                  <div key={a.id} className="bg-[#111] rounded-[60px] overflow-hidden border border-white/5 shadow-2xl animate-in fade-in duration-700 p-10 space-y-6 text-left">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1"><p className="text-[#daa520] font-black text-[10px] tracking-widest uppercase opacity-60">[{a.category}]</p><h4 className="text-4xl font-black text-white leading-tight">{a.title}</h4></div>
                      <span className="text-gray-600 font-mono text-sm">{a.timestamp}</span>
                    </div>
                    <p className="text-gray-400 text-xl font-bold leading-relaxed italic">"{a.desc}"</p>
                    <div className="pt-6 border-t border-white/5 flex justify-between items-center px-2">
                      <button onClick={() => support(a.id)} className="bg-white text-black px-10 py-4 rounded-xl font-black text-sm hover:bg-[#daa520] transition-all shadow-xl">{t.supportBtn}</button>
                      <p className="text-[#daa520] font-black text-4xl tracking-tighter">{a.beomSupport.toLocaleString()} BEOM</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="mt-40 opacity-20 text-center w-full"><p className="text-xs font-mono tracking-[2em] uppercase text-white/50">Kedheon Empire | Final v8.0 Stable</p></div>
    </div>
  );
}
