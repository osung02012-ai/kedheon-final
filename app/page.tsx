'use client';
import React, { useState, useEffect } from 'react';

// --- [1. 데이터 모델] ---
interface Asset { id: number; title: string; desc: string; category: string; beomSupport: number; timestamp: string; }
interface Project { id: number; name: string; target: number; current: number; status: string; }

export default function KedheonPortal() {
  const empireCharacterName = 'CHEOREOM_88';
  const [hasMounted, setHasMounted] = useState(false);
  const [lang, setLang] = useState<'KO' | 'EN'>('KO');
  const [tab, setTab] = useState<'ROOKIE' | 'PIONEER'>('PIONEER');
  const [beomToken, setBeomToken] = useState(8141.88);
  const [stakedBeom, setStakedBeom] = useState(0);
  const [qrType, setQrType] = useState<'PERSONAL' | 'BUSINESS'>('PERSONAL');
  const [isQrActive, setIsQrActive] = useState(false);
  const [category, setCategory] = useState('ALL');
  const [assets, setAssets] = useState<Asset[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [createTitle, setCreateTitle] = useState('');
  const project: Project = { id: 1, name: "PI-VENDORS-HUB", target: 1000000, current: 958000, status: "OPEN" };
  const cats = ['MUSIC', 'SPORTS', 'ANIME', 'DRAMA', 'MOVIE', 'ESPORTS', 'COMEDY', 'TRAVEL', 'FOOD', 'BEAUTY', 'FASHION', 'TECH'];

  const t = lang === 'KO' ? {
    authT: "IMPERIAL SECURE AUTH", authD: "제국 공식 보안 신분 인증 및 익명 결제 시스템을 가동합니다.",
    launchT: "TERRITORY EXPANSION", launchD: "제국의 영토 확장 프로젝트를 지원하고 초기 권한을 확보하십시오.",
    conT: "CONTRIBUTION REWARD", conD: "제국 인프라 기여 보상을 확인하고 BEOM을 예치하십시오.",
    fanT: "IMPERIAL FANDOM TERRITORY", fanD: "제국 공식 영토 혹은 시민들이 개척한 자치령 팬방에 진입하십시오.",
    postBtn: "제국 피드에 방송하기", supportBtn: "👑 황금 찬양", enterBtn: "제국 입국하기", createBtn: "➕ 새로운 영토 선포"
  } : {
    authT: "IMPERIAL SECURE AUTH", authD: "Activate secure identity auth and anonymous payment system.",
    launchT: "TERRITORY EXPANSION", launchD: "Support expansion projects and gain early access rights.",
    conT: "CONTRIBUTION REWARD", conD: "Deposit BEOM to sustain rewards.",
    fanT: "IMPERIAL FANDOM TERRITORY", fanD: "Enter official territories or autonomous fan rooms.",
    postBtn: "Broadcast to Feed", supportBtn: "👑 Praise", enterBtn: "ENTER EMPIRE", createBtn: "➕ Proclaim"
  };

  useEffect(() => {
    setHasMounted(true);
    const saved = localStorage.getItem('k_v34_final');
    if (saved) {
      const p = JSON.parse(saved);
      setBeomToken(p.token || 8141.88); setAssets(p.assets || []); setStakedBeom(p.staked || 0);
    }
  }, []);

  useEffect(() => {
    if (hasMounted) localStorage.setItem('k_v34_final', JSON.stringify({ token: beomToken, assets, staked: stakedBeom }));
  }, [beomToken, assets, stakedBeom, hasMounted]);

  if (!hasMounted) return null;

  const handleSupportProject = () => { if (beomToken < 1000) return alert("잔액 부족!"); setBeomToken(p => p - 1000); alert("지원 완료!"); };
  const handleCreateRoom = () => { if (beomToken < 500) return alert("잔액 부족!"); alert("개척 선포!"); setBeomToken(p => p - 500); setShowModal(false); setCreateTitle(''); };
  const postBroadcast = () => { if (!newTitle.trim()) return alert("제목 필수!"); setAssets([{ id: Date.now(), title: newTitle, desc: newDesc, category, beomSupport: 0, timestamp: new Date().toLocaleDateString() }, ...assets]); setBeomToken(p => p - 10); setNewTitle(''); setNewDesc(''); };
  const supportAsset = (id: number) => { if (beomToken < 100) return alert("잔액 부족!"); setAssets(assets.map(a => a.id === id ? { ...a, beomSupport: a.beomSupport + 100 } : a)); setBeomToken(p => p - 100); };

  const SectionHeader = ({ num, title, desc, icon }: any) => (
    <div className="w-full flex flex-col items-start gap-4 mb-10 pt-20 border-t border-white/5">
      <div className="flex items-center gap-4">
        <span className="text-[#daa520] font-black text-4xl md:text-6xl opacity-10 italic select-none font-serif">{num}</span>
        <div className="flex items-center gap-4">
          {icon && <span className="text-3xl md:text-5xl">{icon}</span>}
          {/* Level 3: 중간 타이틀 (데스크탑 text-5xl, 모바일 text-2xl) */}
          <h3 className="text-[#daa520] font-black text-2xl md:text-5xl tracking-widest uppercase border-l-4 border-[#daa520] pl-4 leading-none">{title}</h3>
        </div>
      </div>
      {/* Level 2: 설명 (데스크탑 text-xl, 모바일 text-sm) */}
      <p className="text-gray-500 font-bold text-sm md:text-xl opacity-80 pl-2 md:pl-14 max-w-4xl leading-relaxed">{desc}</p>
    </div>
  );

  return (
    <div className="flex flex-col items-center bg-black min-h-screen text-white font-sans w-full overflow-x-hidden pb-40">
      
      <div className="w-full max-w-6xl flex justify-between items-center p-6 md:p-10 sticky top-0 bg-black/90 backdrop-blur-xl z-[150] border-b border-white/5 shadow-2xl">
        <button onClick={() => setLang(l => l === 'KO' ? 'EN' : 'KO')} className="text-[#daa520] font-black text-xs md:text-sm border border-[#daa520]/40 px-6 py-2 rounded-full hover:bg-[#daa520] hover:text-black transition-all">{lang === 'KO' ? "ENGLISH" : "한국어"}</button>
        <div className="flex gap-4">
          <button onClick={() => setTab('ROOKIE')} className={`px-4 py-2 md:px-8 md:py-2 rounded-xl font-black text-xs md:text-base ${tab === 'ROOKIE' ? 'bg-[#daa520] text-black shadow-lg shadow-[#daa520]/20' : 'bg-[#111] text-gray-500'}`}>ROOKIE</button>
          <button onClick={() => setTab('PIONEER')} className={`px-4 py-2 md:px-8 md:py-2 rounded-xl font-black text-xs md:text-base ${tab === 'PIONEER' ? 'bg-[#daa520] text-black shadow-lg shadow-[#daa520]/20' : 'bg-[#111] text-gray-500'}`}>PIONEER</button>
        </div>
      </div>

      <div className="w-full max-w-6xl flex flex-col gap-20 md:gap-32 px-6 md:px-10 mt-10 md:mt-20">
        
        {tab === 'ROOKIE' ? (
          <div className="flex flex-col items-center text-center py-40 animate-in fade-in duration-1000">
            <img src="/kedheon-character.png" className="w-48 h-48 md:w-80 md:h-80 rounded-[40px] object-cover mb-10 shadow-3xl border-4 border-[#daa520]/10" alt="K" />
            {/* Level 4: 큰 타이틀 (데스크탑 text-7xl) */}
            <h1 className="text-4xl md:text-7xl font-black text-[#daa520] tracking-widest italic mb-10 leading-none uppercase">Kedheon Empire</h1>
            <button onClick={() => setTab('PIONEER')} className="bg-[#daa520] text-black px-12 py-5 md:px-24 md:py-10 rounded-full font-black text-xl md:text-4xl shadow-2xl hover:scale-105 active:scale-95 transition-all uppercase">{t.enterBtn}</button>
          </div>
        ) : (
          <div className="flex flex-col gap-24 md:gap-40 animate-in slide-in-from-bottom-10 duration-700">
            
            <div className="bg-[#111] p-8 md:p-16 rounded-[40px] md:rounded-[80px] border border-[#daa520]/30 shadow-2xl flex flex-col md:flex-row justify-between items-center gap-10 relative overflow-hidden">
               <div className="flex flex-col items-center md:items-start gap-4 md:gap-8 z-10 text-center md:text-left flex-1">
                  <h3 className="text-gray-500 text-xs md:text-xl font-black opacity-60">BALANCE | Lv. 88</h3>
                  {/* Level 4: 가장 큰 숫자 (데스크탑 text-7xl) */}
                  <p className="text-[#daa520] font-black text-4xl md:text-7xl lg:text-8xl leading-none tracking-tighter">{beomToken.toLocaleString()} BEOM</p>
                  <div className="bg-black/60 px-6 py-3 md:px-10 md:py-5 rounded-2xl border border-white/5 shadow-2xl text-xl md:text-4xl font-mono text-gray-400 italic">≈ 25.9164 Pi</div>
               </div>
               <div className="flex items-center gap-6 md:gap-10 z-10 flex-shrink-0">
                  <img src="/kedheon-character.png" className="w-24 h-24 md:w-56 md:h-56 rounded-3xl md:rounded-[50px] object-cover border-4 border-white/5 shadow-3xl" alt="Char" />
                  <div className="flex flex-col items-center gap-4">
                    <img src="/beom-token.png" className="w-28 h-28 md:w-64 md:h-64 object-contain" alt="Token" />
                    <p className="bg-[#daa520] text-black px-6 py-2 md:px-10 md:py-3 rounded-full font-black text-xs md:text-2xl shadow-xl italic tracking-tighter">KEDHEON.PI</p>
                  </div>
               </div>
            </div>

            <div className="flex flex-col w-full">
              <SectionHeader num="01" title={t.authT} desc={t.authD} />
              <div className="w-full bg-[#111] p-10 md:p-24 rounded-[40px] md:rounded-[80px] flex flex-col items-center gap-12 md:gap-24 shadow-inner border border-white/5">
                <div className="flex gap-4 md:gap-10 bg-black p-4 md:p-6 rounded-2xl md:rounded-[60px] w-full max-w-4xl shadow-3xl font-black">
                  <button onClick={() => {setQrType('PERSONAL'); setIsQrActive(false);}} className={`flex-1 py-4 md:py-10 rounded-xl md:rounded-[45px] text-sm md:text-3xl transition-all ${qrType === 'PERSONAL' ? 'bg-[#daa520] text-black scale-105' : 'text-gray-500'}`}>개인용</button>
                  <button onClick={() => {setQrType('BUSINESS'); setIsQrActive(false);}} className={`flex-1 py-4 md:py-10 rounded-xl md:rounded-[45px] text-sm md:text-3xl transition-all ${qrType === 'BUSINESS' ? 'bg-[#daa520] text-black scale-105' : 'text-gray-500'}`}>기업용</button>
                </div>
                <div className={`p-10 md:p-20 rounded-[40px] md:rounded-[90px] bg-black border-2 md:border-8 transition-all shadow-[0_0_100px_rgba(0,0,0,0.8)] ${isQrActive ? 'border-[#daa520]' : 'opacity-20'}`}>
                  {isQrActive ? (
                    <img src={qrType === 'PERSONAL' ? "/qr-personal.png" : "/qr-business.png"} onError={(e:any) => { e.target.src = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=KEDHEON_${qrType}`; }} className="w-40 h-40 md:w-[35rem] md:h-[35rem] rounded-2xl md:rounded-[60px]" alt="QR" />
                  ) : (
                    <div className="w-40 h-40 md:w-[35rem] md:h-[35rem] flex items-center justify-center text-gray-800 text-5xl md:text-9xl font-black italic">SECURE</div>
                  )}
                </div>
                <button onClick={() => {setBeomToken(p => p-50); setIsQrActive(true);}} className="bg-[#daa520] text-black px-12 py-5 md:px-24 md:py-8 rounded-2xl md:rounded-[40px] font-black text-xl md:text-4xl shadow-2xl active:scale-95 transition-all uppercase">{isQrActive ? "ACTIVE" : "인증 시작 (50 BEOM)"}</button>
              </div>
            </div>

            <div className="flex flex-col w-full">
              <SectionHeader num="02" title={t.launchT} desc={t.launchD} />
              <div className="w-full bg-[#111] p-10 md:p-24 rounded-[40px] md:rounded-[80px] border border-[#daa520]/20 shadow-3xl space-y-10 text-left relative overflow-hidden">
                 <h4 className="text-white font-black text-2xl md:text-6xl uppercase tracking-tighter leading-none">🚀 {project.name}</h4>
                 <div className="space-y-6 md:space-y-12">
                    <div className="flex justify-between text-xl md:text-3xl font-black text-gray-500 uppercase"><span>STATUS</span><span className="text-[#daa520] text-2xl md:text-6xl">{Math.round((project.current / project.target) * 100)}%</span></div>
                    <div className="w-full h-8 md:h-16 bg-white/5 rounded-full overflow-hidden border border-white/5 shadow-inner"><div className="h-full bg-gradient-to-r from-[#b8860b] to-[#daa520] transition-all duration-1000 shadow-[0_0_50px_rgba(218,165,32,0.8)]" style={{ width: `${(project.current / project.target) * 100}%` }}></div></div>
                 </div>
                 <button onClick={handleSupportProject} className="w-full py-10 md:py-20 rounded-3xl md:rounded-[100px] bg-white text-black font-black text-3xl md:text-8xl hover:bg-[#daa520] transition-all uppercase shadow-3xl active:scale-95">개척 지원 (1,000 BEOM)</button>
              </div>
            </div>

            <div className="flex flex-col w-full">
              <SectionHeader num="03" title={t.conT} desc={t.conD} />
              <div className="w-full bg-[#111] p-10 md:p-24 rounded-[50px] border border-[#daa520]/20 flex flex-col items-center gap-10 md:gap-20 shadow-3xl relative overflow-hidden group text-center">
                 <p className="text-gray-500 font-black text-xl md:text-4xl uppercase tracking-widest opacity-60 italic">STAKED LOYALTY</p>
                 <p className="text-white font-black text-5xl md:text-8xl lg:text-[10rem] tracking-tighter leading-none select-none">{stakedBeom.toLocaleString()} <span className="text-3xl md:text-[6rem] text-[#daa520]">BEOM</span></p>
                 <button onClick={() => {setBeomToken(p => p-1000); setStakedBeom(p => p+1000);}} className="bg-gradient-to-br from-[#daa520] to-[#b8860b] text-black px-16 py-8 md:px-64 md:py-20 rounded-2xl md:rounded-[80px] font-black text-2xl md:text-7xl shadow-3xl hover:scale-105 active:scale-95 transition-all uppercase tracking-widest">EXECUTE</button>
              </div>
            </div>

            <div className="flex flex-col w-full">
              <SectionHeader num="04" title={t.fanT} desc={t.fanD} icon="🌐" />
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-6 w-full mb-10 md:mb-20">
                {cats.map(cat => (
                  <button key={cat} onClick={() => setCategory(cat)} className={`py-6 md:py-10 rounded-2xl md:rounded-[40px] font-black text-[10px] md:text-xl tracking-widest border-2 transition-all ${category === cat ? 'bg-[#daa520] text-black border-[#daa520] shadow-3xl scale-110' : 'bg-[#111] text-gray-500 border-white/5'}`}>{cat}</button>
                ))}
              </div>
              <div className="w-full bg-[#111] p-8 md:p-16 rounded-[40px] md:rounded-[80px] border border-white/10 space-y-8 text-left mb-16 md:mb-32 shadow-3xl">
                <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="TITLE" className="bg-black p-6 md:p-10 rounded-2xl md:rounded-[40px] border border-white/5 w-full text-xl md:text-5xl outline-none focus:border-[#daa520] font-black text-white" />
                <textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="DETAILS" className="bg-black p-6 md:p-10 rounded-2xl border border-white/5 w-full text-lg md:text-3xl h-48 md:h-80 outline-none focus:border-[#daa520] resize-none text-gray-300 font-bold" />
                <button onClick={postBroadcast} className="w-full py-10 md:py-16 rounded-3xl md:rounded-[60px] font-black text-3xl md:text-6xl bg-gradient-to-r from-[#daa520] to-[#b8860b] text-black shadow-3xl uppercase tracking-widest transition-all">{t.postBtn}</button>
              </div>

              <div className="w-full space-y-24 md:space-y-48">
                <div className="flex flex-col md:flex-row gap-6 w-full mb-12 md:mb-20">
                  <button onClick={() => setCategory('ALL')} className={`flex-[2] py-8 md:py-14 rounded-3xl md:rounded-[60px] font-black text-2xl md:text-7xl border-4 transition-all ${category === 'ALL' ? 'border-[#daa520] text-[#daa520] bg-[#daa520]/5 shadow-3xl' : 'border-white/5 text-gray-600'}`}>전체 피드 진입</button>
                  <button onClick={() => setShowModal(true)} className="flex-1 py-8 md:py-14 rounded-3xl md:rounded-[60px] bg-white/5 border-4 border-white/10 text-gray-400 font-black text-xl md:text-4xl italic hover:bg-white/10 transition-all tracking-tighter"> {t.createBtn} </button>
                </div>
                {assets.filter(a => category === 'ALL' || a.category === category).map(a => (
                  <div key={a.id} className="bg-[#111] rounded-[60px] md:rounded-[150px] border border-white/5 shadow-2xl p-10 md:p-28 space-y-12 text-left relative animate-in slide-in-from-bottom-20 duration-1000">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                      <div className="space-y-6">
                        <p className="text-[#daa520] font-black text-base md:text-3xl tracking-[0.5em] uppercase opacity-60">[{a.category}]</p>
                        <h4 className="text-4xl md:text-7xl lg:text-9xl font-black text-white leading-tight tracking-tighter drop-shadow-2xl">{a.title}</h4>
                      </div>
                      <span className="text-gray-600 font-mono text-sm md:text-5xl font-bold md:border-l-[15px] border-gray-800 md:pl-10 h-fit py-4">{a.timestamp}</span>
                    </div>
                    <p className="text-gray-400 text-2xl md:text-[5rem] font-bold leading-relaxed px-4 md:px-20 italic max-w-7xl">"{a.desc}"</p>
                    <div className="pt-16 md:pt-40 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-12 md:gap-24">
                      <button onClick={() => supportAsset(a.id)} className="bg-gradient-to-r from-[#daa520] to-[#b8860b] text-black px-16 py-8 md:px-32 md:py-16 rounded-2xl md:rounded-[60px] font-black text-2xl md:text-6xl hover:scale-110 active:scale-95 transition-all shadow-3xl">{t.supportBtn}</button>
                      <p className="text-[#daa520] font-black text-[5rem] md:text-[14rem] tracking-tighter leading-none drop-shadow-2xl">{a.beomSupport.toLocaleString()} <span className="text-2xl md:text-8xl ml-8">BEOM</span></p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/98 backdrop-blur-3xl z-[300] flex items-center justify-center p-8 md:p-24 animate-in fade-in duration-300">
          <div className="bg-[#111] p-10 md:p-32 rounded-[60px] md:rounded-[120px] border border-[#daa520]/50 w-full max-w-7xl shadow-3xl text-center">
            <h3 className="text-[#daa520] font-black text-4xl md:text-[8rem] mb-12 uppercase italic leading-none">Proclaim Territory</h3>
            <input type="text" value={createTitle} onChange={(e) => setCreateTitle(e.target.value)} placeholder="NAME" className="bg-black p-10 md:p-24 rounded-2xl md:rounded-[100px] border border-white/10 w-full text-3xl md:text-8xl focus:border-[#daa520] outline-none font-black text-center mb-16 md:mb-32 text-white uppercase tracking-tighter" />
            <div className="flex gap-8 md:gap-20">
              <button onClick={() => setShowModal(false)} className="flex-1 py-10 md:py-24 rounded-2xl md:rounded-[80px] font-black text-2xl md:text-7xl bg-white/5 uppercase">CANCEL</button>
              <button onClick={handleCreateRoom} className="flex-1 py-10 md:py-24 rounded-2xl md:rounded-[80px] font-black text-2xl md:text-7xl bg-[#daa520] text-black shadow-2xl uppercase">PROCLAIM</button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-80 opacity-20 text-center w-full pb-80 font-mono tracking-[1em] md:tracking-[5em] uppercase text-white/50 text-[10px] md:text-2xl">Kedheon Empire | Final Master v34.0</div>
    </div>
  );
}

