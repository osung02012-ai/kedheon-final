'use client';
import React, { useState, useEffect } from 'react';

// --- [1. 데이터 모델 정의] ---
interface Asset { id: number; title: string; desc: string; category: string; videoUrl?: string; beomSupport: number; owner: string; timestamp: string; }
interface Territory { id: string; title: string; desc: string; creator: string; }
interface Project { id: number; name: string; target: number; current: number; status: string; }

// --- [2. 글로벌 다국어 엔진 (누락 없는 풀 스캔)] ---
const translations = {
  KO: {
    balance: "제국 자산 잔액", grade: "제국 등급",
    citizenshipTitle: "IMPERIAL SECURE AUTH",
    citizenshipDesc: "제국 공식 보안 신분 인증 및 익명 결제 시스템을 가동합니다.",
    personal: "개인 보안 인증", business: "기업 비즈니스 인증",
    authActive: "보안망 연결됨", authInactive: "인증 대기 중 (50 BEOM)",
    launchTitle: "TERRITORY EXPANSION",
    launchDesc: "제국의 영토 확장 프로젝트를 지원하고 초기 기여 권한을 확보하십시오.",
    contributionTitle: "CONTRIBUTION REWARD",
    contributionDesc: "제국 인프라 기여 보상을 확인하고 BEOM을 예치하십시오.",
    fandomTitle: "IMPERIAL FANDOM TERRITORY",
    fandomDesc: "제국 공식 영토 혹은 시민들이 개척한 자치령 팬방에 진입하십시오.",
    enterAll: "전체 피드 진입", createRoom: "➕ 새로운 영토 개척 (500 BEOM)",
    postBtn: "제국 피드에 방송하기", supportBtn: "👑 황금 찬양", enterBtn: "제국 입국하기", backBtn: "TOP"
  },
  EN: {
    balance: "Empire Balance", grade: "Empire Grade",
    citizenshipTitle: "IMPERIAL SECURE AUTH",
    citizenshipDesc: "Activate official secure identity auth and anonymous payment system.",
    personal: "Personal Auth", business: "Business Auth",
    authActive: "Secure Link Active", authInactive: "Auth Required (50 BEOM)",
    launchTitle: "TERRITORY EXPANSION",
    launchDesc: "Support expansion projects and gain early access rights.",
    contributionTitle: "CONTRIBUTION REWARD",
    contributionDesc: "Deposit BEOM to sustain and earn ecosystem rewards.",
    fandomTitle: "IMPERIAL FANDOM TERRITORY",
    fandomDesc: "Enter official territories or user-created autonomous fan rooms.",
    postBtn: "Broadcast to Feed", supportBtn: "👑 Royal Praise", enterBtn: "ENTER EMPIRE", backBtn: "TOP"
  }
};

// --- [3. 시인성 강화 섹션 헤더 (지구본 아이콘 고정)] ---
const SectionHeader = ({ num, title, desc, icon }: { num: string, title: string; desc: string, icon?: string }) => (
  <div className="w-full flex flex-col items-start gap-6 mb-16 pt-32 border-t border-white/5 animate-in fade-in duration-1000">
    <div className="flex items-center gap-6">
      <span className="text-[#daa520] font-black text-7xl opacity-10 italic select-none">{num}</span>
      <div className="flex items-center gap-4">
        {icon && <span className="text-5xl">{icon}</span>}
        <h3 className="text-[#daa520] font-black text-5xl tracking-[0.25em] uppercase leading-none">{title}</h3>
      </div>
    </div>
    <p className="text-gray-500 font-bold text-2xl opacity-80 pl-2 pr-10 leading-relaxed max-w-5xl">{desc}</p>
  </div>
);

export default function KedheonPortal() {
  const PI_TO_BEOM_RATE = 314.1592;
  const empireCharacterName = 'CHEOREOM_88';

  // --- [상태 관리] ---
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
  
  // 모달 및 입력 상태
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createTitle, setCreateTitle] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');

  const [project, setProject] = useState<Project>({ id: 1, name: "PI-VENDORS-HUB", target: 1000000, current: 898000, status: "OPEN" });

  const t = translations[lang];
  const cats = ['MUSIC', 'SPORTS', 'ANIME', 'DRAMA', 'MOVIE', 'ESPORTS', 'COMEDY', 'TRAVEL', 'FOOD', 'BEAUTY', 'FASHION', 'TECH'];

  // --- [데이터 처리 로직] ---
  useEffect(() => {
    setHasMounted(true);
    const saved = localStorage.getItem('k_empire_grand_v12');
    if (saved) {
      try {
        const p = JSON.parse(saved);
        setBeomToken(p.token || 8141.88); setAssets(p.assets || []); 
        setUserTerritories(p.rooms || []); setContributedBeom(p.contributed || 0);
      } catch (e) { console.error("Data Load Error"); }
    }
  }, []);

  useEffect(() => {
    if (hasMounted) {
      localStorage.setItem('k_empire_grand_v12', JSON.stringify({ 
        token: beomToken, assets, rooms: userTerritories, contributed: contributedBeom 
      }));
    }
  }, [beomToken, assets, userTerritories, contributedBeom, hasMounted]);

  if (!hasMounted) return null;

  // --- [비즈니스 로직] ---
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

  return (
    <div className="flex flex-col items-center bg-black min-h-screen text-white font-sans w-full overflow-x-hidden pb-60">
      
      {/* 1. 글로벌 헤더 (Wide 6xl) */}
      <div className="w-full max-w-6xl flex justify-between items-center p-10 sticky top-0 bg-black/90 backdrop-blur-xl z-[150] border-b border-white/5 shadow-2xl">
        <button onClick={() => setLang(l => l === 'KO' ? 'EN' : 'KO')} className="text-[#daa520] font-black text-sm border-2 border-[#daa520]/40 px-8 py-3 rounded-full hover:bg-[#daa520] hover:text-black transition-all">
          {lang === 'KO' ? "ENGLISH" : "한국어"}
        </button>
        <div className="flex gap-6">
          <button onClick={() => setTab('ROOKIE')} className={`px-10 py-3 rounded-2xl font-black text-base ${tab === 'ROOKIE' ? 'bg-[#daa520] text-black shadow-lg shadow-[#daa520]/30' : 'bg-[#111] text-gray-500'}`}>ROOKIE</button>
          <button onClick={() => setTab('PIONEER')} className={`px-10 py-3 rounded-2xl font-black text-base ${tab === 'PIONEER' ? 'bg-[#daa520] text-black shadow-lg shadow-[#daa520]/30' : 'bg-[#111] text-gray-500'}`}>PIONEER</button>
        </div>
      </div>

      <div className="w-full max-w-6xl flex flex-col gap-40 px-8 mt-24">
        
        {tab === 'ROOKIE' ? (
          <div className="flex flex-col items-center text-center py-40 animate-in fade-in duration-700">
            <img src="/kedheon-character.png" className="w-96 h-96 rounded-[80px] object-cover mb-16 shadow-[0_0_80px_rgba(218,165,32,0.3)] border-4 border-[#daa520]/20" alt="Kedheon" />
            <h1 className="text-9xl font-black text-[#daa520] tracking-widest mb-16 uppercase italic leading-none">Kedheon Empire</h1>
            <button onClick={() => setTab('PIONEER')} className="bg-[#daa520] text-black px-40 py-14 rounded-[50px] font-black text-5xl shadow-2xl hover:scale-105 transition-all">{t.enterBtn}</button>
          </div>
        ) : (
          <div className="flex flex-col gap-48 animate-in slide-in-from-bottom-20 duration-1000">
            
            {/* 00. 대시보드 - Wide & Character */}
            <div className="bg-[#111] p-20 rounded-[80px] border border-[#daa520]/40 shadow-[0_0_120px_rgba(218,165,32,0.1)] flex flex-col md:flex-row justify-between items-center gap-16 relative overflow-hidden group">
               <div className="flex flex-col items-start gap-10 z-10 text-left">
                  <h3 className="text-gray-500 text-lg uppercase tracking-[0.6em] font-black opacity-60">{t.balance}</h3>
                  <p className="text-[#daa520] font-black text-[10rem] tracking-tighter leading-none">{beomToken.toLocaleString()} BEOM</p>
                  <div className="bg-black/60 px-12 py-6 rounded-[35px] border border-white/5 flex items-center gap-6">
                     <span className="text-gray-400 font-mono text-4xl">≈ {(beomToken / PI_TO_BEOM_RATE).toFixed(4)} Pi</span>
                  </div>
               </div>
               <div className="flex items-center gap-14 z-10">
                  <img src="/kedheon-character.png" className="w-64 h-64 rounded-[60px] object-cover border-4 border-white/10 shadow-3xl" alt="K" />
                  <div className="flex flex-col items-center gap-6">
                    <img src="/beom-token.png" className="w-80 h-80 object-contain transform group-hover:rotate-6 transition-transform duration-1000" alt="Beom" />
                    <p className="bg-[#daa520] text-black px-12 py-4 rounded-full font-black text-4xl shadow-2xl italic">Lv. 88</p>
                  </div>
               </div>
            </div>

            {/* 01. 보안 신분 인증 (QR 인프라) */}
            <div className="flex flex-col items-start w-full">
              <SectionHeader num="01" title={t.citizenshipTitle} desc={t.citizenshipDesc} />
              <div className="w-full bg-[#111] p-20 rounded-[80px] border border-white/5 flex flex-col items-center gap-20 shadow-inner">
                <div className="flex gap-8 bg-black p-5 rounded-[45px] w-full max-w-3xl shadow-3xl">
                  <button onClick={() => {setQrType('PERSONAL'); setIsQrActive(false);}} className={`flex-1 py-7 rounded-[35px] font-black text-2xl transition-all ${qrType === 'PERSONAL' ? 'bg-[#daa520] text-black shadow-2xl' : 'text-gray-500 hover:text-white'}`}>{t.personal}</button>
                  <button onClick={() => {setQrType('BUSINESS'); setIsQrActive(false);}} className={`flex-1 py-7 rounded-[35px] font-black text-2xl transition-all ${qrType === 'BUSINESS' ? 'bg-[#daa520] text-black shadow-2xl' : 'text-gray-500 hover:text-white'}`}>{t.business}</button>
                </div>
                <div className={`p-16 rounded-[70px] bg-black border-4 transition-all shadow-[0_0_100px_rgba(0,0,0,0.8)] ${isQrActive ? 'border-[#daa520]' : 'border-white/5 opacity-30'}`}>
                  {isQrActive ? (
                    <img src={qrType === 'PERSONAL' ? "/qr-personal.png" : "/qr-business.png"} 
                         onError={(e) => { e.currentTarget.src = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=KEDHEON_SECURE_${qrType}`; }} 
                         className="w-80 h-80 rounded-[40px]" alt="QR" />
                  ) : (
                    <div className="w-80 h-80 flex items-center justify-center text-gray-800 text-8xl italic font-black">SECURE</div>
                  )}
                </div>
                <button onClick={() => {setBeomToken(p => p-50); setIsQrActive(true);}} className="bg-[#daa520] text-black px-32 py-12 rounded-[45px] font-black text-4xl shadow-2xl hover:scale-105 active:scale-95 transition-all uppercase tracking-tighter">
                  {isQrActive ? t.authActive : t.authInactive}
                </button>
              </div>
            </div>

            {/* 02. 영토 확장 지원 (런치패드) */}
            <div className="flex flex-col items-start w-full">
              <SectionHeader num="02" title={t.launchTitle} desc={t.launchDesc} />
              <div className="w-full bg-gradient-to-br from-[#111] to-black p-20 rounded-[80px] border border-[#daa520]/20 shadow-2xl space-y-20 text-left">
                 <div className="flex justify-between items-center">
                    <h4 className="text-white font-black text-6xl italic tracking-tighter uppercase">🚀 {project.name}</h4>
                    <span className="bg-[#daa520]/10 text-[#daa520] px-10 py-4 rounded-full text-xl font-black uppercase border border-[#daa520]/20">{project.status}</span>
                 </div>
                 <div className="space-y-10">
                    <div className="flex justify-between text-2xl font-black text-gray-500 uppercase tracking-[0.3em]"><span>{t.launchStatus}</span><span className="text-[#daa520] text-4xl">{Math.round((project.current / project.target) * 100)}%</span></div>
                    <div className="w-full h-10 bg-white/5 rounded-full overflow-hidden border border-white/5 shadow-inner">
                        <div className="h-full bg-gradient-to-r from-[#b8860b] to-[#daa520] shadow-[0_0_40px_rgba(218,165,32,0.6)] transition-all duration-1000" style={{ width: `${(project.current / project.target) * 100}%` }}></div>
                    </div>
                 </div>
                 <button onClick={handleSupportProject} className="w-full py-14 rounded-[60px] bg-white text-black font-black text-5xl hover:bg-[#daa520] transition-all uppercase shadow-3xl active:scale-95">
                   {t.supportProject}
                 </button>
              </div>
            </div>

            {/* 03. 기여 보상 엔진 (스테이킹) */}
            <div className="flex flex-col items-start w-full">
              <SectionHeader num="03" title={t.contributionTitle} desc={t.contributionDesc} />
              <div className="w-full bg-[#111] p-24 rounded-[100px] border border-[#daa520]/20 flex flex-col items-center gap-16 shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-0 left-0 p-16 opacity-5 font-black text-[15rem] italic uppercase select-none pointer-events-none group-hover:scale-110 transition-transform duration-1000">BEOM</div>
                 <div className="text-center space-y-8 z-10 relative">
                    <p className="text-gray-500 font-black text-2xl uppercase tracking-[0.5em] opacity-60">{t.contributedBalance}</p>
                    <p className="text-white font-black text-[12rem] tracking-tighter leading-none">{contributedBeom.toLocaleString()} BEOM</p>
                 </div>
                 <button onClick={() => {setBeomToken(p => p-1000); setContributedBeom(p => p+1000);}} className="bg-gradient-to-br from-[#daa520] to-[#b8860b] text-black px-40 py-12 rounded-[50px] font-black text-4xl shadow-3xl hover:scale-105 active:scale-95 transition-all uppercase z-10 relative">
                   {t.contributeBtn}
                 </button>
              </div>
            </div>

            {/* 04 & 05. 와이드 시민 영토 및 방송 피드 통합 */}
            <div className="flex flex-col items-start w-full">
              <SectionHeader num="04" title={t.fandomTitle} desc={t.fandomDesc} icon="🌐" />
              
              <div className="grid grid-cols-3 md:grid-cols-6 gap-6 w-full mb-24">
                {cats.map(cat => (
                  <button key={cat} onClick={() => setCategory(cat)} className={`py-10 rounded-[45px] font-black text-lg tracking-widest border transition-all ${category === cat ? 'bg-[#daa520] text-black border-[#daa520] shadow-2xl scale-105' : 'bg-[#111] text-gray-500 border-white/5 hover:border-[#daa520]/40'}`}>{cat}</button>
                ))}
              </div>

              <div className="w-full bg-[#111] p-20 rounded-[100px] border border-white/10 space-y-12 text-left mb-32 shadow-3xl relative">
                <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="방송 제목 (Broadcast Title)" className="bg-black p-12 rounded-[55px] border border-white/5 w-full text-4xl outline-none focus:border-[#daa520] font-black text-white" />
                <textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="방송 상세 내용 (Broadcast Description)" className="bg-black p-12 rounded-[55px] border border-white/5 w-full text-3xl h-64 outline-none focus:border-[#daa520] resize-none text-gray-300 font-bold" />
                <button onClick={postBroadcast} className="w-full py-14 rounded-[70px] font-black text-5xl bg-gradient-to-r from-[#daa520] to-[#b8860b] text-black shadow-3xl uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all">
                  {t.postBtn}
                </button>
              </div>

              <div className="w-full space-y-40">
                <div className="flex gap-6 w-full mb-16">
                  <button onClick={() => setCategory('ALL')} className={`flex-1 py-12 rounded-[55px] font-black text-4xl border-4 transition-all ${category === 'ALL' ? 'border-[#daa520] text-[#daa520] bg-[#daa520]/5' : 'border-white/5 text-gray-600'}`}>{t.enterAll}</button>
                  <button onClick={() => setShowCreateModal(true)} className="flex-1 py-12 rounded-[55px] bg-white/5 border-4 border-white/10 text-gray-400 font-black text-3xl hover:bg-white/10 transition-all tracking-tighter">{t.createRoom}</button>
                </div>
                
                {assets.filter(a => category === 'ALL' || a.category === category).map(a => (
                  <div key={a.id} className="bg-[#111] rounded-[120px] overflow-hidden border border-white/5 shadow-2xl p-24 space-y-16 text-left relative group animate-in slide-in-from-bottom-20 duration-1000">
                    <div className="absolute top-0 right-0 p-20 opacity-5 font-black text-[15rem] italic uppercase select-none group-hover:opacity-10 transition-opacity pointer-events-none">WIDE</div>
                    <div className="flex justify-between items-start z-10 relative">
                      <div className="space-y-6">
                        <p className="text-[#daa520] font-black text-xl tracking-[0.5em] uppercase opacity-60">[{a.category} TERRITORY]</p>
                        <h4 className="text-[6rem] font-black text-white leading-tight tracking-tighter">{a.title}</h4>
                      </div>
                      <span className="text-gray-600 font-mono text-3xl font-bold border-l-8 border-gray-800 pl-10 h-fit py-2">{a.timestamp}</span>
                    </div>
                    {a.videoUrl && a.videoUrl.includes('v=') && (
                      <div className="relative aspect-video rounded-[80px] overflow-hidden border-[12px] border-white/5 bg-black shadow-3xl">
                        <iframe className="absolute inset-0 w-full h-full" src={`https://www.youtube.com/embed/${a.videoUrl.split('v=')[1]}`} frameBorder="0" allowFullScreen></iframe>
                      </div>
                    )}
                    <p className="text-gray-400 text-5xl font-bold leading-relaxed px-10 italic z-10 relative max-w-6xl">"{a.desc}"</p>
                    <div className="pt-20 border-t border-white/5 flex justify-between items-center z-10 relative">
                      <button onClick={() => { if (beomToken < 100) return alert("잔액 부족!"); setAssets(assets.map(i => i.id === a.id ? {...i, beomSupport: i.beomSupport+100} : i)); setBeomToken(p => p-100); }} 
                              className="bg-gradient-to-r from-[#daa520] to-[#b8860b] text-black px-24 py-10 rounded-[35px] font-black text-3xl hover:scale-110 active:scale-95 transition-all shadow-3xl">{t.supportBtn}</button>
                      <p className="text-[#daa520] font-black text-[9rem] tracking-tighter leading-none">{a.beomSupport.toLocaleString()} <span className="text-5xl ml-4">BEOM</span></p>
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
        <div className="fixed inset-0 bg-black/98 backdrop-blur-3xl z-[200] flex items-center justify-center p-12 text-center animate-in fade-in duration-300">
          <div className="bg-[#111] p-24 rounded-[100px] border border-[#daa520]/50 w-full max-w-4xl shadow-[0_0_200px_rgba(218,165,32,0.3)]">
            <h3 className="text-[#daa520] font-black text-6xl mb-10 uppercase tracking-widest leading-none">Proclaim Territory</h3>
            <p className="text-gray-500 font-bold mb-20 text-3xl italic">"새로운 영토를 선포하여 역사를 기록하십시오."</p>
            <input type="text" value={createTitle} onChange={(e) => setCreateTitle(e.target.value)} placeholder="TERRITORY NAME" className="bg-black p-12 rounded-[50px] border border-white/10 w-full text-4xl focus:border-[#daa520] outline-none font-black text-center mb-20 text-white uppercase tracking-tighter" />
            <div className="flex gap-10">
              <button onClick={() => setShowCreateModal(false)} className="flex-1 py-12 rounded-[50px] font-black text-3xl bg-white/5 hover:bg-white/10 transition-all uppercase">CANCEL</button>
              <button onClick={handleCreateRoom} className="flex-1 py-12 rounded-[50px] font-black text-3xl bg-[#daa520] text-black shadow-2xl hover:scale-105 active:scale-95 transition-all uppercase">PROCLAIM</button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-80 opacity-20 text-center w-full pb-40">
        <p className="text-sm font-mono tracking-[4em] uppercase text-white/50">Kedheon Empire | Final v12.0 Full Integrity Master</p>
      </div>
    </div>
  );
}
