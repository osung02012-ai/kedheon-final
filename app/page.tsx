'use client';
import React, { useState, useEffect } from 'react';

// --- [1. 데이터 모델 정의] ---
interface Asset { 
  id: number; title: string; desc: string; category: string; 
  videoUrl?: string; beomSupport: number; owner: string; timestamp: string; 
}
interface Territory { id: string; title: string; desc: string; creator: string; }
interface Project { id: number; name: string; target: number; current: number; status: string; }

// --- [2. 글로벌 다국어 사전 (누락 없는 풀 스펙)] ---
const translations = {
  KO: {
    balance: "제국 자산 잔액", grade: "제국 등급",
    authTitle: "IMPERIAL SECURE AUTH",
    authDesc: "제국 공식 보안 신분 인증 및 익명 결제 시스템을 가동합니다.",
    personal: "개인 보안 인증", business: "기업 비즈니스 인증",
    authActive: "보안망 가동 중", authInactive: "인증 대기 (50 BEOM)",
    launchTitle: "TERRITORY EXPANSION",
    launchDesc: "제국의 영토 확장 프로젝트를 지원하고 초기 기여 권한을 확보하십시오.",
    launchStatus: "개척 진행률", supportProject: "개척 지원 (1,000 BEOM)",
    conTitle: "CONTRIBUTION REWARD",
    conDesc: "제국 인프라 기여 보상을 확인하고 BEOM을 예치하십시오.",
    conBal: "누적 기여 자산", conBtn: "기여 실행 (1,000 BEOM)",
    fandomTitle: "IMPERIAL FANDOM TERRITORY",
    fandomDesc: "제국 공식 영토 혹은 시민들이 개척한 자치령 팬방에 진입하십시오.",
    enterAll: "전체 피드 진입", createRoom: "➕ 새로운 영토 선포 (500 BEOM)",
    broadcastTitle: "BROADCAST CENTER",
    broadcastDesc: "제국 전역에 당신의 영상을 박제하여 존재감을 증명하십시오.",
    postBtn: "제국 피드에 방송하기", supportBtn: "👑 황금 찬양", enterBtn: "제국 입국하기", backBtn: "TOP"
  },
  EN: {
    balance: "Empire Balance", grade: "Empire Grade",
    authTitle: "IMPERIAL SECURE AUTH",
    authDesc: "Activate official secure identity auth and anonymous payment system.",
    personal: "Personal Auth", business: "Business Auth",
    authActive: "Secure Link Active", authInactive: "Auth Required (50 BEOM)",
    launchTitle: "TERRITORY EXPANSION",
    launchDesc: "Support expansion projects and gain early access rights.",
    launchStatus: "Progress", supportProject: "Support (1,000 BEOM)",
    conTitle: "CONTRIBUTION REWARD",
    conDesc: "Deposit BEOM to sustain and earn ecosystem rewards.",
    conBal: "Staked Assets", conBtn: "Execute Contribution",
    fandomTitle: "IMPERIAL FANDOM TERRITORY",
    fandomDesc: "Enter official territories or user-created autonomous fan rooms.",
    enterAll: "ENTER ALL", createRoom: "➕ Proclaim (500 BEOM)",
    broadcastTitle: "BROADCAST CENTER",
    broadcastDesc: "Broadcast your video across the Empire and prove your status.",
    postBtn: "Broadcast to Feed", supportBtn: "👑 Royal Praise", enterBtn: "ENTER EMPIRE", backBtn: "TOP"
  }
};

// --- [3. 수직 집중형 와이드 섹션 헤더] ---
const SectionHeader = ({ num, title, desc, icon }: { num: string, title: string; desc: string, icon?: string }) => (
  <div className="w-full flex flex-col items-start gap-6 mb-20 pt-36 border-t border-white/5 animate-in fade-in duration-1000">
    <div className="flex items-center gap-8">
      <span className="text-[#daa520] font-black text-8xl opacity-10 italic select-none font-serif">{num}</span>
      <div className="flex items-center gap-6">
        {icon && <span className="text-6xl filter drop-shadow-[0_0_20px_rgba(218,165,32,0.4)]">{icon}</span>}
        <h3 className="text-[#daa520] font-black text-6xl tracking-[0.25em] uppercase leading-none">{title}</h3>
      </div>
    </div>
    <p className="text-gray-500 font-bold text-3xl opacity-80 pl-4 max-w-5xl leading-relaxed">{desc}</p>
  </div>
);

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

  // 런치패드 프로젝트 상태
  const [project, setProject] = useState<Project>({ id: 1, name: "PI-COMMERCE-NODE", target: 1000000, current: 912000, status: "OPEN" });

  const t = translations[lang];
  const cats = ['MUSIC', 'SPORTS', 'ANIME', 'DRAMA', 'MOVIE', 'ESPORTS', 'COMEDY', 'TRAVEL', 'FOOD', 'BEAUTY', 'FASHION', 'TECH'];

  // --- [데이터 처리 및 SDK 로드] ---
  useEffect(() => {
    setHasMounted(true);
    const saved = localStorage.getItem('kedheon_empire_v13_master');
    if (saved) {
      try {
        const p = JSON.parse(saved);
        setBeomToken(p.token || 8141.88); setAssets(p.assets || []); 
        setUserTerritories(p.rooms || []); setContributedBeom(p.contributed || 0);
      } catch (e) { console.error("Integrity Error: Data Reset"); }
    }
    const script = document.createElement("script");
    script.src = "https://sdk.minepi.com/pi-sdk.js";
    script.async = true;
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (hasMounted) {
      localStorage.setItem('kedheon_empire_v13_master', JSON.stringify({ 
        token: beomToken, assets, rooms: userTerritories, contributed: contributedBeom 
      }));
    }
  }, [beomToken, assets, userTerritories, contributedBeom, hasMounted]);

  if (!hasMounted) return null;

  // --- [비즈니스 로직 핸들러] ---
  const handleSupportProject = () => {
    if (beomToken < 1000) return alert("잔액 부족!");
    setBeomToken(p => p - 1000); setProject(p => ({ ...p, current: p.current + 1000 }));
  };

  const handleContribution = () => {
    if (beomToken < 1000) return alert("잔액 부족!");
    setBeomToken(p => p - 1000); setContributedBeom(p => p + 1000);
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

  const supportAsset = (id: number) => {
    if (beomToken < 100) return alert("잔액 부족!");
    setAssets(assets.map(a => a.id === id ? { ...a, beomSupport: a.beomSupport + 100 } : a));
    setBeomToken(p => p - 100);
  };

  return (
    <div className="flex flex-col items-center bg-black min-h-screen text-white font-sans w-full overflow-x-hidden pb-80">
      
      {/* 1. 글로벌 헤더 (Wide 6xl) */}
      <div className="w-full max-w-6xl flex justify-between items-center p-12 sticky top-0 bg-black/90 backdrop-blur-2xl z-[150] border-b border-white/5 shadow-2xl">
        <button onClick={() => setLang(l => l === 'KO' ? 'EN' : 'KO')} className="text-[#daa520] font-black text-base border-2 border-[#daa520]/40 px-10 py-4 rounded-full hover:bg-[#daa520] hover:text-black transition-all shadow-lg">
          {lang === 'KO' ? "ENGLISH MODE" : "한국어 모드"}
        </button>
        <div className="flex gap-8">
          <button onClick={() => setTab('ROOKIE')} className={`px-12 py-4 rounded-2xl font-black text-lg transition-all ${tab === 'ROOKIE' ? 'bg-[#daa520] text-black shadow-xl shadow-[#daa520]/30 scale-110' : 'bg-[#111] text-gray-500'}`}>ROOKIE</button>
          <button onClick={() => setTab('PIONEER')} className={`px-12 py-4 rounded-2xl font-black text-lg transition-all ${tab === 'PIONEER' ? 'bg-[#daa520] text-black shadow-xl shadow-[#daa520]/30 scale-110' : 'bg-[#111] text-gray-500'}`}>PIONEER</button>
        </div>
      </div>

      <div className="w-full max-w-6xl flex flex-col gap-40 px-10 mt-24">
        
        {tab === 'ROOKIE' ? (
          /* --- [ROOKIE VIEW] --- */
          <div className="flex flex-col items-center text-center py-60 animate-in fade-in zoom-in duration-1000">
            <img src="/kedheon-character.png" className="w-[30rem] h-[30rem] rounded-[100px] object-cover mb-20 shadow-[0_0_150px_rgba(218,165,32,0.2)] border-8 border-[#daa520]/10" alt="Kedheon" />
            <h1 className="text-[10rem] font-black text-[#daa520] tracking-widest mb-20 uppercase italic leading-none">Kedheon Empire</h1>
            <button onClick={() => setTab('PIONEER')} className="bg-[#daa520] text-black px-60 py-20 rounded-[80px] font-black text-7xl shadow-3xl hover:scale-105 active:scale-95 transition-all uppercase tracking-tighter">
              {t.enterBtn}
            </button>
          </div>
        ) : (
          /* --- [PIONEER VIEW: 수직 통합 와이드 인프라] --- */
          <div className="flex flex-col gap-60 animate-in slide-in-from-bottom-20 duration-1000">
            
            {/* 00. 대시보드 - 시원한 와이드 & 캐릭터 박제 */}
            <div className="bg-[#111] p-24 rounded-[100px] border border-[#daa520]/40 shadow-[0_0_150px_rgba(218,165,32,0.1)] flex flex-col md:flex-row justify-between items-center gap-24 relative overflow-hidden group">
               <div className="flex flex-col items-start gap-12 z-10 text-left">
                  <h3 className="text-gray-500 text-2xl uppercase tracking-[0.8em] font-black opacity-60">{t.balance}</h3>
                  <p className="text-[#daa520] font-black text-[12rem] tracking-tighter leading-none">{beomToken.toLocaleString()} BEOM</p>
                  <div className="bg-black/60 px-16 py-8 rounded-[45px] border border-white/5 flex items-center gap-8 shadow-2xl">
                     <span className="text-gray-400 font-mono text-5xl font-bold italic">≈ {(beomToken / PI_TO_BEOM_RATE).toFixed(4)} Pi</span>
                  </div>
               </div>
               <div className="flex items-center gap-16 z-10">
                  <img src="/kedheon-character.png" className="w-80 h-80 rounded-[80px] object-cover border-8 border-white/5 shadow-3xl transition-transform duration-1000 group-hover:scale-110" alt="Character" />
                  <div className="flex flex-col items-center gap-8">
                    <img src="/beom-token.png" className="w-[24rem] h-[24rem] object-contain transform group-hover:rotate-12 transition-transform duration-1000 filter drop-shadow-[0_0_50px_rgba(218,165,32,0.3)]" alt="Beom" />
                    <p className="bg-[#daa520] text-black px-16 py-6 rounded-full font-black text-5xl shadow-2xl italic">Lv. 88</p>
                  </div>
               </div>
            </div>

            {/* 01. 보안 신분 인증 (IMPERIAL SECURE AUTH) */}
            <div className="flex flex-col items-start w-full">
              <SectionHeader num="01" title={t.authTitle} desc={t.authDesc} />
              <div className="w-full bg-[#111] p-24 rounded-[100px] border border-white/5 flex flex-col items-center gap-24 shadow-inner">
                <div className="flex gap-10 bg-black p-6 rounded-[60px] w-full max-w-4xl shadow-3xl">
                  <button onClick={() => {setQrType('PERSONAL'); setIsQrActive(false);}} className={`flex-1 py-10 rounded-[45px] font-black text-3xl transition-all ${qrType === 'PERSONAL' ? 'bg-[#daa520] text-black shadow-2xl scale-105' : 'text-gray-500 hover:text-white'}`}>{t.personal}</button>
                  <button onClick={() => {setQrType('BUSINESS'); setIsQrActive(false);}} className={`flex-1 py-10 rounded-[45px] font-black text-3xl transition-all ${qrType === 'BUSINESS' ? 'bg-[#daa520] text-black shadow-2xl scale-105' : 'text-gray-500 hover:text-white'}`}>{t.business}</button>
                </div>
                <div className={`p-20 rounded-[90px] bg-black border-4 transition-all shadow-[0_0_120px_rgba(0,0,0,0.9)] ${isQrActive ? 'border-[#daa520]' : 'border-white/5 opacity-20'}`}>
                  {isQrActive ? (
                    <img src={qrType === 'PERSONAL' ? "/qr-personal.png" : "/qr-business.png"} 
                         onError={(e) => { e.currentTarget.src = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=KEDHEON_SECURE_${qrType}`; }} 
                         className="w-[30rem] h-[30rem] rounded-[60px]" alt="QR" />
                  ) : (
                    <div className="w-[30rem] h-[30rem] flex items-center justify-center text-gray-800 text-9xl italic font-black select-none">SECURE</div>
                  )}
                </div>
                <button onClick={() => {setBeomToken(p => p-50); setIsQrActive(true);}} className="bg-[#daa520] text-black px-40 py-16 rounded-[60px] font-black text-5xl shadow-3xl hover:scale-105 active:scale-95 transition-all uppercase tracking-tighter">
                  {isQrActive ? t.authActive : t.authInactive}
                </button>
              </div>
            </div>

            {/* 02. 영토 확장 지원 (LAUNCHPAD) */}
            <div className="flex flex-col items-start w-full">
              <SectionHeader num="02" title={t.launchTitle} desc={t.launchDesc} />
              <div className="w-full bg-gradient-to-br from-[#111] to-black p-24 rounded-[100px] border border-[#daa520]/20 shadow-3xl space-y-24 text-left relative overflow-hidden group">
                 <div className="flex justify-between items-center z-10 relative">
                    <h4 className="text-white font-black text-7xl italic tracking-tighter uppercase leading-none">🚀 {project.name}</h4>
                    <span className="bg-[#daa520]/10 text-[#daa520] px-12 py-5 rounded-full text-2xl font-black uppercase border border-[#daa520]/30">{project.status}</span>
                 </div>
                 <div className="space-y-12 z-10 relative">
                    <div className="flex justify-between text-3xl font-black text-gray-500 uppercase tracking-[0.4em]">
                       <span>{t.launchStatus}</span>
                       <span className="text-[#daa520] text-5xl">{Math.round((project.current / project.target) * 100)}%</span>
                    </div>
                    <div className="w-full h-14 bg-white/5 rounded-full overflow-hidden border border-white/5 shadow-inner">
                        <div className="h-full bg-gradient-to-r from-[#b8860b] to-[#daa520] shadow-[0_0_50px_rgba(218,165,32,0.8)] transition-all duration-1000" style={{ width: `${(project.current / project.target) * 100}%` }}></div>
                    </div>
                 </div>
                 <button onClick={handleSupportProject} className="w-full py-16 rounded-[70px] bg-white text-black font-black text-6xl hover:bg-[#daa520] transition-all uppercase shadow-3xl active:scale-95 z-10 relative">
                   {t.supportProject}
                 </button>
              </div>
            </div>

            {/* 03. 기여 보상 엔진 (CONTRIBUTION) */}
            <div className="flex flex-col items-start w-full">
              <SectionHeader num="03" title={t.conTitle} desc={t.conDesc} />
              <div className="w-full bg-[#111] p-24 rounded-[120px] border border-[#daa520]/20 flex flex-col items-center gap-20 shadow-3xl relative overflow-hidden group">
                 <div className="absolute top-0 left-0 p-20 opacity-5 font-black text-[20rem] italic uppercase select-none pointer-events-none group-hover:scale-110 transition-transform duration-1000">LOYALTY</div>
                 <div className="text-center space-y-12 z-10 relative">
                    <p className="text-gray-500 font-black text-3xl uppercase tracking-[0.6em] opacity-60">{t.conBal}</p>
                    <p className="text-white font-black text-[15rem] tracking-tighter leading-none">{contributedBeom.toLocaleString()} <span className="text-6xl text-[#daa520]">BEOM</span></p>
                 </div>
                 <button onClick={handleContribution} className="bg-gradient-to-br from-[#daa520] to-[#b8860b] text-black px-60 py-16 rounded-[60px] font-black text-5xl shadow-3xl hover:scale-105 active:scale-95 transition-all uppercase z-10 relative">
                   {t.conBtn}
                 </button>
              </div>
            </div>

            {/* 04. 웅장한 시민 영토 (Globe Icon 🌐) */}
            <div className="flex flex-col items-start w-full">
              <SectionHeader num="04" title={t.fandomTitle} desc={t.fandomDesc} icon="🌐" />
              
              <div className="grid grid-cols-3 md:grid-cols-6 gap-8 w-full mb-32">
                {cats.map(cat => (
                  <button key={cat} onClick={() => setCategory(cat)} className={`py-14 rounded-[55px] font-black text-2xl tracking-widest border-2 transition-all ${category === cat ? 'bg-[#daa520] text-black border-[#daa520] shadow-3xl scale-110' : 'bg-[#111] text-gray-500 border-white/5 hover:border-[#daa520]/50'}`}>{cat}</button>
                ))}
              </div>

              {/* 방송 센터 (브로드캐스트) */}
              <div className="w-full bg-[#111] p-24 rounded-[120px] border border-white/10 space-y-16 text-left mb-40 shadow-3xl relative overflow-hidden">
                <SectionHeader num="POST" title={t.broadcastTitle} desc={t.broadcastDesc} />
                <div className="space-y-10 w-full">
                  <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="방송 제목 (Broadcast Title)" className="bg-black p-14 rounded-[65px] border border-white/5 w-full text-5xl outline-none focus:border-[#daa520] font-black text-white shadow-inner" />
                  <textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="상세 내용 (Broadcast Description)" className="bg-black p-14 rounded-[65px] border border-white/5 w-full text-4xl h-80 outline-none focus:border-[#daa520] resize-none text-gray-300 font-bold" />
                </div>
                <button onClick={postBroadcast} className="w-full py-16 rounded-[80px] font-black text-6xl bg-gradient-to-r from-[#daa520] to-[#b8860b] text-black shadow-3xl uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all">
                  {t.postBtn}
                </button>
              </div>

              {/* 피드 한 줄 리스트 (Wide Stream) */}
              <div className="w-full space-y-48">
                <div className="flex gap-10 w-full mb-24">
                  <button onClick={() => setCategory('ALL')} className={`flex-[2] py-16 rounded-[70px] font-black text-5xl border-4 transition-all ${category === 'ALL' ? 'border-[#daa520] text-[#daa520] bg-[#daa520]/5 shadow-3xl' : 'border-white/5 text-gray-600'}`}>{t.enterAll}</button>
                  <button onClick={() => setShowCreateModal(true)} className="flex-1 py-16 rounded-[70px] bg-white/5 border-4 border-white/10 text-gray-400 font-black text-4xl hover:bg-white/10 transition-all tracking-tighter italic">{t.createRoom}</button>
                </div>
                
                {assets.filter(a => category === 'ALL' || a.category === category).map(a => (
                  <div key={a.id} className="bg-[#111] rounded-[150px] overflow-hidden border border-white/5 shadow-3xl p-28 space-y-20 text-left relative group animate-in slide-in-from-bottom-20 duration-1000">
                    <div className="absolute top-0 right-0 p-24 opacity-5 font-black text-[25rem] italic uppercase select-none group-hover:opacity-10 transition-opacity pointer-events-none">EMPIRE</div>
                    <div className="flex justify-between items-start z-10 relative">
                      <div className="space-y-8">
                        <p className="text-[#daa520] font-black text-2xl tracking-[0.6em] uppercase opacity-60">[{a.category} Territory]</p>
                        <h4 className="text-[8rem] font-black text-white leading-tight tracking-tighter drop-shadow-xl">{a.title}</h4>
                      </div>
                      <span className="text-gray-600 font-mono text-4xl font-bold border-l-[12px] border-gray-800 pl-12 h-fit py-4">{a.timestamp}</span>
                    </div>
                    <p className="text-gray-400 text-[3.5rem] font-bold leading-relaxed px-12 italic z-10 relative max-w-6xl">"{a.desc}"</p>
                    <div className="pt-24 border-t border-white/5 flex justify-between items-center z-10 relative">
                      <button onClick={() => supportAsset(a.id)} className="bg-gradient-to-r from-[#daa520] to-[#b8860b] text-black px-24 py-12 rounded-[50px] font-black text-4xl hover:scale-110 active:scale-95 transition-all shadow-3xl">
                        {t.supportBtn}
                      </button>
                      <p className="text-[#daa520] font-black text-[10rem] tracking-tighter leading-none drop-shadow-2xl">{a.beomSupport.toLocaleString()} <span className="text-6xl ml-6">BEOM</span></p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>

      {/* 8. 자치령 개척 모달 (Full Logic) */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/98 backdrop-blur-3xl z-[300] flex items-center justify-center p-16 text-center animate-in fade-in duration-300">
          <div className="bg-[#111] p-32 rounded-[120px] border border-[#daa520]/50 w-full max-w-5xl shadow-[0_0_300px_rgba(218,165,32,0.3)]">
            <h3 className="text-[#daa520] font-black text-7xl mb-12 uppercase tracking-widest leading-none">Proclaim Territory</h3>
            <p className="text-gray-500 font-bold mb-24 text-4xl italic">"제국의 역사에 당신만의 영토를 각인하십시오."</p>
            <input type="text" value={createTitle} onChange={(e) => setCreateTitle(e.target.value)} placeholder="TERRITORY NAME" className="bg-black p-16 rounded-[65px] border border-white/10 w-full text-5xl focus:border-[#daa520] outline-none font-black text-center mb-24 text-white uppercase tracking-tighter" />
            <div className="flex gap-12">
              <button onClick={() => setShowCreateModal(false)} className="flex-1 py-16 rounded-[65px] font-black text-4xl bg-white/5 hover:bg-white/10 transition-all uppercase">CANCEL</button>
              <button onClick={handleCreateRoom} className="flex-1 py-16 rounded-[65px] font-black text-4xl bg-[#daa520] text-black shadow-2xl hover:scale-105 active:scale-95 transition-all uppercase">PROCLAIM</button>
            </div>
          </div>
        </div>
      )}

      {/* 고정 하단 */}
      <div className="mt-80 opacity-20 text-center w-full pb-60">
        <p className="text-sm font-mono tracking-[4em] uppercase text-white/50">Kedheon Empire | Final v13.0 Wide Integrity Verified</p>
      </div>
    </div>
  );
}
