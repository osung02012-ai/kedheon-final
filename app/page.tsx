'use client';
import React, { useState, useEffect } from 'react';

// --- [1. 데이터 및 인터페이스 정의] ---
interface Asset { id: number; title: string; desc: string; category: string; videoUrl?: string; beomSupport: number; owner: string; timestamp: string; }
interface Territory { id: string; title: string; desc: string; creator: string; }
interface Project { id: number; name: string; target: number; current: number; status: string; }

export default function KedheonPortal() {
  const PI_TO_BEOM_RATE = 314.1592;
  const empireCharacterName = 'CHEOREOM_88';

  // --- [상태 관리: 350라인급 풀-로직] ---
  const [hasMounted, setHasMounted] = useState(false);
  const [lang, setLang] = useState<'KO' | 'EN'>('KO');
  const [tab, setTab] = useState<'ROOKIE' | 'PIONEER'>('PIONEER');
  const [beomToken, setBeomToken] = useState(8141.88);
  const [contributedBeom, setContributedBeom] = useState(0);
  const [qrType, setQrType] = useState<'PERSONAL' | 'BUSINESS'>('PERSONAL');
  const [isQrActive, setIsQrActive] = useState(false);
  const [category, setCategory] = useState('ALL');
  const [assets, setAssets] = useState<Asset[]>([]);
  const [userTerritories, setUserTerritories] = useState<Territory[]>([]);
  
  // 모달 및 입력 폼 상태
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createTitle, setCreateTitle] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');

  const [project, setProject] = useState<Project>({ id: 1, name: "PI-VENDORS-NODE", target: 1000000, current: 925000, status: "OPEN" });

  const cats = ['MUSIC', 'SPORTS', 'ANIME', 'DRAMA', 'MOVIE', 'ESPORTS', 'COMEDY', 'TRAVEL', 'FOOD', 'BEAUTY', 'FASHION', 'TECH'];
  
  // 주군 맞춤형 다국어 사전
  const t = lang === 'KO' ? {
    balance: "제국 자산 잔액", grade: "제국 등급",
    authT: "IMPERIAL SECURE AUTH", authD: "제국 공식 보안 신분 인증 및 익명 결제 시스템을 가동합니다.",
    launchT: "TERRITORY EXPANSION", launchD: "제국의 영토 확장 프로젝트를 지원하고 초기 권한을 확보하십시오.",
    conT: "CONTRIBUTION REWARD", conD: "제국 인프라 기여 보상을 확인하고 BEOM을 예치하십시오.",
    fanT: "IMPERIAL FANDOM TERRITORY", fanD: "제국 공식 영토 혹은 시민들이 개척한 자치령 팬방에 진입하십시오.",
    postBtn: "제국 피드에 방송하기", supportBtn: "👑 황금 찬양", enterBtn: "제국 입국하기", createBtn: "➕ 새로운 영토 선포 (500 BEOM)"
  } : {
    balance: "Empire Balance", grade: "Empire Grade",
    authT: "IMPERIAL SECURE AUTH", authD: "Activate official secure identity auth and anonymous payment system.",
    launchT: "TERRITORY EXPANSION", launchD: "Support expansion projects and gain early access rights.",
    conT: "CONTRIBUTION REWARD", conD: "Deposit BEOM to sustain and earn ecosystem rewards.",
    fanT: "IMPERIAL FANDOM TERRITORY", fanD: "Enter official territories or user-created autonomous fan rooms.",
    postBtn: "Broadcast to Feed", supportBtn: "👑 Royal Praise", enterBtn: "ENTER EMPIRE", createBtn: "➕ Proclaim (500 BEOM)"
  };

  // --- [데이터 처리 로직] ---
  useEffect(() => {
    setHasMounted(true);
    const saved = localStorage.getItem('k_empire_v16_final');
    if (saved) {
      try {
        const p = JSON.parse(saved);
        setBeomToken(p.token || 8141.88); setAssets(p.assets || []); 
        setUserTerritories(p.rooms || []); setContributedBeom(p.contributed || 0);
      } catch (e) { console.error("Data Load Error"); }
    }
    const script = document.createElement("script"); script.src = "https://sdk.minepi.com/pi-sdk.js"; script.async = true; document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (hasMounted) {
      localStorage.setItem('k_empire_v16_final', JSON.stringify({ 
        token: beomToken, assets, rooms: userTerritories, contributed: contributedBeom 
      }));
    }
  }, [beomToken, assets, userTerritories, contributedBeom, hasMounted]);

  if (!hasMounted) return null;

  // --- [액션 핸들러] ---
  const handleSupportProject = () => {
    if (beomToken < 1000) return alert("잔액 부족!");
    setBeomToken(p => p - 1000); setProject(p => ({ ...p, current: p.current + 1000 }));
  };

  const handleCreateRoom = () => {
    if (beomToken < 500) return alert("잔액 부족!");
    const n = { id: createTitle.toUpperCase(), title: createTitle.toUpperCase(), desc: "", creator: empireCharacterName };
    setUserTerritories([...userTerritories, n]); setBeomToken(p => p - 500);
    setShowCreateModal(false); setCreateTitle('');
  };

  const postBroadcast = () => {
    if (!newTitle.trim()) return alert("제목 필수!");
    const n: Asset = { id: Date.now(), title: newTitle, desc: newDesc, category, videoUrl: newVideoUrl, beomSupport: 0, owner: empireCharacterName, timestamp: new Date().toLocaleDateString() };
    setAssets([n, ...assets]); setBeomToken(p => p - 10);
    setNewTitle(''); setNewDesc(''); setNewVideoUrl('');
  };

  // --- [공통 컴포넌트: 반응형 와이드 헤더] ---
  const SectionHeader = ({ num, title, desc, icon }: any) => (
    <div className="w-full flex flex-col items-start gap-4 md:gap-8 mb-12 md:mb-24 pt-20 md:pt-40 border-t border-white/5 animate-in fade-in duration-1000">
      <div className="flex items-center gap-4 md:gap-10">
        <span className="text-[#daa520] font-black text-5xl md:text-9xl opacity-10 italic select-none">{num}</span>
        <div className="flex items-center gap-4 md:gap-8">
          {icon && <span className="text-4xl md:text-7xl filter drop-shadow-[0_0_20px_rgba(218,165,32,0.4)]">{icon}</span>}
          <h3 className="text-[#daa520] font-black text-2xl md:text-7xl tracking-tighter md:tracking-widest uppercase leading-none">{title}</h3>
        </div>
      </div>
      <p className="text-gray-500 font-bold text-sm md:text-3xl opacity-80 pl-2 md:pl-6 max-w-5xl leading-relaxed">{desc}</p>
    </div>
  );

  return (
    <div className="flex flex-col items-center bg-black min-h-screen text-white font-sans w-full overflow-x-hidden pb-80">
      
      {/* 1. 와이드 글로벌 네비게이션 */}
      <div className="w-full max-w-6xl flex justify-between items-center p-6 md:p-12 sticky top-0 bg-black/90 backdrop-blur-3xl z-[200] border-b border-white/5 shadow-2xl">
        <button onClick={() => setLang(l => l === 'KO' ? 'EN' : 'KO')} className="text-[#daa520] font-black text-xs md:text-lg border-2 border-[#daa520]/40 px-6 py-2 md:px-10 md:py-4 rounded-full hover:bg-[#daa520] hover:text-black transition-all">
          {lang === 'KO' ? "ENGLISH MODE" : "한국어 모드"}
        </button>
        <div className="flex gap-4 md:gap-10">
          <button onClick={() => setTab('ROOKIE')} className={`px-6 py-2 md:px-12 md:py-4 rounded-xl md:rounded-3xl font-black text-xs md:text-2xl transition-all ${tab === 'ROOKIE' ? 'bg-[#daa520] text-black shadow-xl' : 'bg-[#111] text-gray-500'}`}>ROOKIE</button>
          <button onClick={() => setTab('PIONEER')} className={`px-6 py-2 md:px-12 md:py-4 rounded-xl md:rounded-3xl font-black text-xs md:text-2xl transition-all ${tab === 'PIONEER' ? 'bg-[#daa520] text-black shadow-xl' : 'bg-[#111] text-gray-500'}`}>PIONEER</button>
        </div>
      </div>

      <div className="w-full max-w-6xl flex flex-col gap-24 md:gap-48 px-6 md:px-12 mt-12 md:mt-24">
        
        {tab === 'ROOKIE' ? (
          /* --- [입국 전: 루키 대문] --- */
          <div className="flex flex-col items-center text-center py-40 animate-in fade-in zoom-in duration-1000">
            <img src="/kedheon-character.png" className="w-64 h-64 md:w-[32rem] md:h-[32rem] rounded-[60px] md:rounded-[120px] object-cover mb-12 md:mb-24 shadow-3xl border-4 md:border-[12px] border-[#daa520]/10" alt="Kedheon" />
            <h1 className="text-5xl md:text-[11rem] font-black text-[#daa520] tracking-tighter md:tracking-[0.1em] italic mb-12 md:mb-24 leading-none uppercase">Kedheon Empire</h1>
            <button onClick={() => setTab('PIONEER')} className="bg-[#daa520] text-black px-12 py-6 md:px-64 md:py-20 rounded-[30px] md:rounded-[100px] font-black text-2xl md:text-8xl shadow-3xl hover:scale-105 active:scale-95 transition-all uppercase tracking-tighter">
              {t.enterBtn}
            </button>
          </div>
        ) : (
          /* --- [입국 후: 파이오니어 와이드 인프라] --- */
          <div className="flex flex-col gap-40 md:gap-80 animate-in slide-in-from-bottom-20 duration-1000">
            
            {/* 00. 메인 대시보드 */}
            <div className="bg-[#111] p-10 md:p-28 rounded-[60px] md:rounded-[120px] border border-[#daa520]/40 shadow-2xl flex flex-col lg:flex-row justify-between items-center gap-12 md:gap-24 relative overflow-hidden group">
               <div className="flex flex-col items-center lg:items-start gap-8 md:gap-14 z-10 text-center lg:text-left">
                  <h3 className="text-gray-500 text-sm md:text-3xl uppercase tracking-widest font-black opacity-60">{t.balance}</h3>
                  <p className="text-[#daa520] font-black text-5xl md:text-[13rem] tracking-tighter leading-none">{beomToken.toLocaleString()} BEOM</p>
                  <div className="bg-black/60 px-8 py-4 md:px-20 md:py-10 rounded-2xl md:rounded-[50px] border border-white/5 shadow-2xl text-xl md:text-6xl font-mono text-gray-400 italic">
                    ≈ {(beomToken / 314.1592).toFixed(4)} Pi
                  </div>
               </div>
               <div className="flex items-center gap-8 md:gap-20 z-10">
                  <img src="/kedheon-character.png" className="w-24 h-24 md:w-96 md:h-96 rounded-[30px] md:rounded-[100px] object-cover border-4 md:border-[10px] border-white/5 shadow-3xl transition-transform duration-1000 group-hover:scale-110" alt="Character" />
                  <div className="flex flex-col items-center gap-6 md:gap-12">
                    <img src="/beom-token.png" className="w-32 h-32 md:w-[26rem] md:h-[26rem] object-contain transform group-hover:rotate-12 transition-transform duration-1000 filter drop-shadow-[0_0_80px_rgba(218,165,32,0.3)]" alt="Token" />
                    <p className="bg-[#daa520] text-black px-8 py-3 md:px-24 md:py-8 rounded-full font-black text-xl md:text-7xl shadow-2xl italic">Lv. 88</p>
                  </div>
               </div>
            </div>

            {/* 01. 보안 신분 인증 */}
            <div className="flex flex-col w-full">
              <SectionHeader num="01" title={t.authT} desc={t.authD} />
              <div className="w-full bg-[#111] p-10 md:p-32 rounded-[60px] md:rounded-[120px] flex flex-col items-center gap-12 md:gap-32 shadow-inner border border-white/5">
                <div className="flex gap-4 md:gap-12 bg-black p-4 md:p-8 rounded-2xl md:rounded-[80px] w-full max-w-5xl shadow-3xl">
                  <button onClick={() => {setQrType('PERSONAL'); setIsQrActive(false);}} className={`flex-1 py-6 md:py-14 rounded-xl md:rounded-[60px] font-black text-sm md:text-5xl transition-all ${qrType === 'PERSONAL' ? 'bg-[#daa520] text-black scale-105' : 'text-gray-500'}`}>개인 / Personal</button>
                  <button onClick={() => {setQrType('BUSINESS'); setIsQrActive(false);}} className={`flex-1 py-6 md:py-14 rounded-xl md:rounded-[60px] font-black text-sm md:text-5xl transition-all ${qrType === 'BUSINESS' ? 'bg-[#daa520] text-black scale-105' : 'text-gray-500'}`}>기업 / Business</button>
                </div>
                <div className={`p-10 md:p-24 rounded-[40px] md:rounded-[110px] bg-black border-2 md:border-8 transition-all shadow-[0_0_150px_rgba(0,0,0,0.9)] ${isQrActive ? 'border-[#daa520]' : 'border-white/5 opacity-20'}`}>
                  {isQrActive ? (
                    <img src={qrType === 'PERSONAL' ? "/qr-personal.png" : "/qr-business.png"} 
                         onError={(e) => { e.currentTarget.src = `https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=KEDHEON_SECURE_${qrType}`; }} 
                         className="w-40 h-40 md:w-[40rem] md:h-[40rem] rounded-2xl md:rounded-[80px]" alt="QR" />
                  ) : (
                    <div className="w-40 h-40 md:w-[40rem] md:h-[40rem] flex items-center justify-center text-gray-800 text-3xl md:text-[10rem] font-black italic">SECURE</div>
                  )}
                </div>
                <button onClick={() => {setBeomToken(p => p-50); setIsQrActive(true);}} className="bg-[#daa520] text-black px-16 py-8 md:px-48 md:py-20 rounded-2xl md:rounded-[80px] font-black text-2xl md:text-7xl shadow-3xl hover:scale-105 active:scale-95 transition-all uppercase tracking-tighter">
                  {isQrActive ? "ACTIVE" : "인증 시작 (50 BEOM)"}
                </button>
              </div>
            </div>

            {/* 02. 영토 확장 지원 (런치패드) */}
            <div className="flex flex-col w-full">
              <SectionHeader num="02" title={t.launchT} desc={t.launchD} />
              <div className="w-full bg-gradient-to-br from-[#111] to-black p-12 md:p-32 rounded-[60px] md:rounded-[120px] border border-[#daa520]/20 shadow-3xl space-y-16 md:space-y-32 text-left relative overflow-hidden">
                 <h4 className="text-white font-black text-4xl md:text-9xl italic uppercase tracking-tighter">🚀 {project.name}</h4>
                 <div className="space-y-8 md:space-y-16">
                    <div className="flex justify-between text-xl md:text-5xl font-black text-gray-500 uppercase">
                      <span>STATUS</span>
                      <span className="text-[#daa520] text-3xl md:text-8xl">{Math.round((project.current / project.target) * 100)}%</span>
                    </div>
                    <div className="w-full h-10 md:h-24 bg-white/5 rounded-full overflow-hidden border border-white/5 shadow-inner">
                        <div className="h-full bg-gradient-to-r from-[#b8860b] to-[#daa520] transition-all duration-1000 shadow-[0_0_80px_rgba(218,165,32,0.8)]" style={{ width: `${(project.current / project.target) * 100}%` }}></div>
                    </div>
                 </div>
                 <button onClick={handleSupportProject} className="w-full py-10 md:py-20 rounded-3xl md:rounded-[100px] bg-white text-black font-black text-3xl md:text-8xl hover:bg-[#daa520] transition-all uppercase shadow-3xl active:scale-95">
                   {t.supportProject}
                 </button>
              </div>
            </div>

            {/* 03. 기여 보상 엔진 (기여 보상) */}
            <div className="flex flex-col w-full">
              <SectionHeader num="03" title={t.conT} desc={t.conD} />
              <div className="w-full bg-[#111] p-12 md:p-32 rounded-[60px] md:rounded-[140px] border border-[#daa520]/20 flex flex-col items-center gap-12 md:gap-32 shadow-3xl relative overflow-hidden group">
                 <p className="text-gray-500 font-black text-xl md:text-5xl uppercase tracking-[0.5em] opacity-60 italic">STAKED LOYALTY</p>
                 <p className="text-white font-black text-[6rem] md:text-[20rem] tracking-tighter leading-none select-none">
                   {contributedBeom.toLocaleString()} <span className="text-3xl md:text-[6rem] text-[#daa520]">BEOM</span>
                 </p>
                 <button onClick={() => {setBeomToken(p => p-1000); setContributedBeom(p => p+1000);}} className="bg-gradient-to-br from-[#daa520] to-[#b8860b] text-black px-16 py-8 md:px-64 md:py-20 rounded-2xl md:rounded-[80px] font-black text-2xl md:text-7xl shadow-3xl hover:scale-105 active:scale-95 transition-all uppercase tracking-widest">
                   EXECUTE
                 </button>
              </div>
            </div>

            {/* 04. 웅장한 시민 영토 & 방송 (Wide Stream 🌐) */}
            <div className="flex flex-col w-full">
              <SectionHeader num="04" title={t.fanT} desc={t.fanD} icon="🌐" />
              
              <div className="grid grid-cols-3 md:grid-cols-6 gap-6 md:gap-12 w-full mb-16 md:mb-40">
                {cats.map(cat => (
                  <button key={cat} onClick={() => setCategory(cat)} className={`py-8 md:py-20 rounded-2xl md:rounded-[70px] font-black text-[10px] md:text-3xl tracking-widest border-2 md:border-4 transition-all ${category === cat ? 'bg-[#daa520] text-black border-[#daa520] shadow-3xl scale-110' : 'bg-[#111] text-gray-500 border-white/5 hover:border-[#daa520]/50'}`}>{cat}</button>
                ))}
              </div>
              
              {/* 방송 등록 전광판 */}
              <div className="w-full bg-[#111] p-10 md:p-32 rounded-[50px] md:rounded-[140px] border border-white/10 space-y-12 md:space-y-24 text-left mb-24 md:mb-56 shadow-3xl relative">
                <div className="space-y-10 md:space-y-20 w-full">
                  <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="TITLE" className="bg-black p-8 md:p-20 rounded-2xl md:rounded-[80px] border border-white/5 w-full text-2xl md:text-7xl outline-none focus:border-[#daa520] font-black text-white shadow-inner" />
                  <textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="DETAILS" className="bg-black p-8 md:p-20 rounded-2xl md:rounded-[80px] border border-white/5 w-full text-xl md:text-6xl h-48 md:h-[30rem] outline-none focus:border-[#daa520] resize-none text-gray-300 font-bold" />
                </div>
                <button onClick={postBroadcast} className="w-full py-10 md:py-24 rounded-3xl md:rounded-[100px] font-black text-3xl md:text-9xl bg-gradient-to-r from-[#daa520] to-[#b8860b] text-black shadow-3xl uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all">
                  {t.postBtn}
                </button>
              </div>

              {/* 와이드 피드 리스트 */}
              <div className="w-full space-y-32 md:space-y-72">
                <div className="flex flex-col md:flex-row gap-8 md:gap-16 w-full mb-16 md:mb-32">
                  <button onClick={() => setCategory('ALL')} className={`flex-[2] py-10 md:py-24 rounded-3xl md:rounded-[100px] font-black text-3xl md:text-8xl border-4 md:border-8 transition-all ${category === 'ALL' ? 'border-[#daa520] text-[#daa520] bg-[#daa520]/5 shadow-3xl' : 'border-white/5 text-gray-600'}`}>ENTER ALL FEED</button>
                  <button onClick={() => setShowCreateModal(true)} className="flex-1 py-10 md:py-24 rounded-3xl md:rounded-[100px] bg-white/5 border-4 md:border-8 border-white/10 text-gray-400 font-black text-2xl md:text-6xl hover:bg-white/10 transition-all tracking-tighter italic">
                    {t.createBtn}
                  </button>
                </div>
                
                {assets.filter(a => category === 'ALL' || a.category === category).map(a => (
                  <div key={a.id} className="bg-[#111] rounded-[60px] md:rounded-[180px] border border-white/5 shadow-2xl p-12 md:p-40 space-y-16 md:space-y-32 text-left relative animate-in slide-in-from-bottom-20 duration-1000">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-8 md:gap-20">
                      <div className="space-y-6 md:space-y-12">
                        <p className="text-[#daa520] font-black text-base md:text-4xl tracking-[0.6em] uppercase opacity-60">[{a.category}]</p>
                        <h4 className="text-4xl md:text-[10rem] font-black text-white leading-tight tracking-tighter drop-shadow-2xl">{a.title}</h4>
                      </div>
                      <span className="text-gray-600 font-mono text-sm md:text-5xl font-bold md:border-l-[15px] border-gray-800 md:pl-16 h-fit py-4">{a.timestamp}</span>
                    </div>
                    <p className="text-gray-400 text-2xl md:text-[5rem] font-bold leading-relaxed px-4 md:px-20 italic max-w-7xl">"{a.desc}"</p>
                    <div className="pt-16 md:pt-40 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-12 md:gap-24">
                      <button onClick={() => {
                        if (beomToken < 100) return alert("!");
                        setAssets(assets.map(i => i.id === a.id ? { ...i, beomSupport: i.beomSupport + 100 } : i));
                        setBeomToken(p => p - 100);
                      }} className="bg-gradient-to-r from-[#daa520] to-[#b8860b] text-black px-16 py-8 md:px-32 md:py-16 rounded-2xl md:rounded-[60px] font-black text-2xl md:text-6xl hover:scale-110 active:scale-95 transition-all shadow-3xl">
                        {t.supportBtn}
                      </button>
                      <p className="text-[#daa520] font-black text-[5rem] md:text-[14rem] tracking-tighter leading-none drop-shadow-2xl">
                        {a.beomSupport.toLocaleString()} <span className="text-2xl md:text-8xl ml-8">BEOM</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 8. 자치령 개척 모달 */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/98 backdrop-blur-3xl z-[300] flex items-center justify-center p-8 md:p-24 text-center animate-in fade-in duration-300">
          <div className="bg-[#111] p-12 md:p-40 rounded-[60px] md:rounded-[150px] border border-[#daa520]/50 w-full max-w-7xl shadow-[0_0_300px_rgba(218,165,32,0.3)]">
            <h3 className="text-[#daa520] font-black text-4xl md:text-[8rem] mb-12 md:mb-24 uppercase tracking-widest leading-none">Proclaim Territory</h3>
            <input type="text" value={createTitle} onChange={(e) => setCreateTitle(e.target.value)} placeholder="NAME" className="bg-black p-10 md:p-24 rounded-2xl md:rounded-[100px] border border-white/10 w-full text-3xl md:text-8xl focus:border-[#daa520] outline-none font-black text-center mb-16 md:mb-32 text-white uppercase tracking-tighter" />
            <div className="flex gap-8 md:gap-20">
              <button onClick={() => setShowCreateModal(false)} className="flex-1 py-10 md:py-24 rounded-2xl md:rounded-[80px] font-black text-2xl md:text-6xl bg-white/5 uppercase">CANCEL</button>
              <button onClick={handleCreateRoom} className="flex-1 py-10 md:py-24 rounded-2xl md:rounded-[80px] font-black text-2xl md:text-6xl bg-[#daa520] text-black shadow-2xl uppercase">PROCLAIM</button>
            </div>
          </div>
        </div>
      )}

      {/* 최종 하단 */}
      <div className="mt-80 opacity-20 text-center w-full pb-80 font-mono tracking-[1em] md:tracking-[5em] uppercase text-white/50 text-[10px] md:text-2xl">
        Kedheon Empire | Ultimate Integrity Master Final v16.0
      </div>
    </div>
  );
}
