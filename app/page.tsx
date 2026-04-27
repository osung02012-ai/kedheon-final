'use client';
import React, { useState, useEffect } from 'react';

// --- [1. 데이터 모델 및 인터페이스 정의] ---
interface Asset { id: number; title: string; desc: string; category: string; videoUrl?: string; beomSupport: number; owner: string; timestamp: string; }
interface Territory { id: string; title: string; desc: string; creator: string; }
interface Project { id: number; name: string; target: number; current: number; status: string; }

export default function KedheonPortal() {
  const PI_TO_BEOM_RATE = 314.1592;
  const empireCharacterName = 'CHEOREOM_88';

  // --- [상태 관리: 제국 통합 제어 시스템] ---
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
  
  // 모달 및 입력 폼
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createTitle, setCreateTitle] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');

  const project: Project = { id: 1, name: "PI-VENDORS-NODE", target: 1000000, current: 942000, status: "OPEN" };
  const cats = ['MUSIC', 'SPORTS', 'ANIME', 'DRAMA', 'MOVIE', 'ESPORTS', 'COMEDY', 'TRAVEL', 'FOOD', 'BEAUTY', 'FASHION', 'TECH'];

  const t = lang === 'KO' ? {
    authT: "IMPERIAL SECURE AUTH", authD: "제국 공식 보안 신분 인증 및 익명 결제 시스템을 가동합니다.",
    launchT: "TERRITORY EXPANSION", launchD: "제국의 영토 확장 프로젝트를 지원하고 초기 권한을 확보하십시오.",
    conT: "CONTRIBUTION REWARD", conD: "제국 인프라 기여 보상을 확인하고 BEOM을 예치하십시오.",
    fanT: "IMPERIAL FANDOM TERRITORY", fanD: "제국 공식 영토 혹은 시민들이 개척한 자치령 팬방에 진입하십시오.",
    postBtn: "피드에 방송하기", supportBtn: "👑 황금 찬양", enterBtn: "제국 입국하기", createBtn: "➕ 새로운 영토 선포 (500 BEOM)"
  } : {
    authT: "IMPERIAL SECURE AUTH", authD: "Activate official secure identity auth and anonymous payment system.",
    launchT: "TERRITORY EXPANSION", launchD: "Support expansion projects and gain early access rights.",
    conT: "CONTRIBUTION REWARD", conD: "Deposit BEOM to sustain and earn ecosystem rewards.",
    fanT: "IMPERIAL FANDOM TERRITORY", fanD: "Enter official territories or user-created autonomous fan rooms.",
    postBtn: "Broadcast to Feed", supportBtn: "👑 Royal Praise", enterBtn: "ENTER EMPIRE", createBtn: "➕ Proclaim (500 BEOM)"
  };

  // --- [데이터 처리 로직] ---
  useEffect(() => {
    setHasMounted(true);
    const saved = localStorage.getItem('k_empire_master_v22');
    if (saved) {
      try {
        const p = JSON.parse(saved);
        setBeomToken(p.token || 8141.88); setAssets(p.assets || []); 
        setUserTerritories(p.rooms || []); setContributedBeom(p.contributed || 0);
      } catch (e) { console.error("Integrity Glitch Fixed"); }
    }
  }, []);

  useEffect(() => {
    if (hasMounted) {
      localStorage.setItem('k_empire_master_v22', JSON.stringify({ token: beomToken, assets, rooms: userTerritories, contributed: contributedBeom }));
    }
  }, [beomToken, assets, userTerritories, contributedBeom, hasMounted]);

  if (!hasMounted) return null;

  // --- [비즈니스 로직 핸들러] ---
  const handleSupportProject = () => {
    if (beomToken < 1000) return alert("잔액 부족!");
    setBeomToken(p => p - 1000); alert("제국 영토 확장에 기여하셨습니다!");
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
    <div className="w-full flex flex-col items-start gap-4 md:gap-8 mb-12 md:mb-20 pt-20 md:pt-32 border-t border-white/5 animate-in fade-in duration-1000">
      <div className="flex items-center gap-4 md:gap-8">
        <span className="text-[#daa520] font-black text-4xl md:text-7xl opacity-10 italic select-none">{num}</span>
        <div className="flex items-center gap-4 md:gap-6">
          {icon && <span className="text-3xl md:text-5xl">{icon}</span>}
          <h3 className="text-[#daa520] font-black text-xl md:text-4xl tracking-widest uppercase leading-none">{title}</h3>
        </div>
      </div>
      <p className="text-gray-500 font-bold text-xs md:text-xl opacity-80 pl-2 md:pl-4 max-w-5xl leading-relaxed">{desc}</p>
    </div>
  );

  return (
    <div className="flex flex-col items-center bg-black min-h-screen text-white font-sans w-full overflow-x-hidden pb-60">
      
      {/* 1. 와이드 글로벌 헤더 */}
      <div className="w-full max-w-6xl flex justify-between items-center p-6 md:p-10 sticky top-0 bg-black/90 backdrop-blur-xl z-[150] border-b border-white/5">
        <button onClick={() => setLang(l => l === 'KO' ? 'EN' : 'KO')} className="text-[#daa520] font-black text-xs md:text-sm border border-[#daa520]/40 px-6 py-2 md:px-10 md:py-3 rounded-full hover:bg-[#daa520] hover:text-black transition-all">
          {lang === 'KO' ? "ENGLISH MODE" : "한국어 모드"}
        </button>
        <div className="flex gap-4">
          <button onClick={() => setTab('ROOKIE')} className={`px-6 py-2 rounded-xl font-black text-xs md:text-base transition-all ${tab === 'ROOKIE' ? 'bg-[#daa520] text-black shadow-xl' : 'bg-[#111] text-gray-500'}`}>ROOKIE</button>
          <button onClick={() => setTab('PIONEER')} className={`px-6 py-2 rounded-xl font-black text-xs md:text-base transition-all ${tab === 'PIONEER' ? 'bg-[#daa520] text-black shadow-xl' : 'bg-[#111] text-gray-500'}`}>PIONEER</button>
        </div>
      </div>

      <div className="w-full max-w-6xl flex flex-col gap-24 md:gap-40 px-6 md:px-10 mt-12 md:mt-24">
        
        {tab === 'ROOKIE' ? (
          /* --- [ROOKIE VIEW] --- */
          <div className="flex flex-col items-center text-center py-40 animate-in fade-in zoom-in duration-1000">
            <img src="/kedheon-character.png" className="w-64 h-64 md:w-80 md:h-80 rounded-[40px] md:rounded-[80px] object-cover mb-10 shadow-3xl border-4 border-[#daa520]/10" alt="K" />
            <h1 className="text-4xl md:text-8xl font-black text-[#daa520] tracking-widest italic mb-10 leading-none">Kedheon Empire</h1>
            <button onClick={() => setTab('PIONEER')} className="bg-[#daa520] text-black px-12 py-6 md:px-32 md:py-12 rounded-full font-black text-xl md:text-5xl shadow-2xl hover:scale-105 active:scale-95 transition-all uppercase">{t.enterBtn}</button>
          </div>
        ) : (
          /* --- [PIONEER VIEW: 6xl Wide] --- */
          <div className="flex flex-col gap-32 md:gap-60 animate-in slide-in-from-bottom-20 duration-1000">
            
            {/* 00. 메인 대시보드 */}
            <div className="bg-[#111] p-10 md:p-16 rounded-[40px] md:rounded-[80px] border border-[#daa520]/30 shadow-2xl flex flex-col lg:flex-row justify-between items-center gap-12 relative overflow-hidden group">
               <div className="flex flex-col items-center lg:items-start gap-6 md:gap-10 z-10 text-center lg:text-left">
                  <h3 className="text-gray-500 text-sm md:text-xl uppercase tracking-widest font-black opacity-60">BALANCE | Lv. 88</h3>
                  <p className="text-[#daa520] font-black text-5xl md:text-8xl lg:text-9xl tracking-tighter leading-none">{beomToken.toLocaleString()} BEOM</p>
                  <div className="bg-black/60 px-8 py-4 md:px-12 md:py-6 rounded-2xl border border-white/5 shadow-2xl text-xl md:text-4xl font-mono text-gray-400 italic">≈ 25.9164 Pi</div>
               </div>
               <div className="flex items-center gap-8 md:gap-12 z-10">
                  <img src="/kedheon-character.png" className="w-24 h-24 md:w-56 md:h-56 rounded-[30px] md:rounded-[50px] object-cover border-4 border-white/5 shadow-3xl transition-transform duration-1000 group-hover:scale-110" alt="Character" />
                  <div className="flex flex-col items-center gap-4">
                    <img src="/beom-token.png" className="w-32 h-32 md:w-64 md:h-64 object-contain filter drop-shadow-[0_0_50px_rgba(218,165,32,0.3)]" alt="Token" />
                    <p className="bg-[#daa520] text-black px-8 py-2 md:px-12 md:py-4 rounded-full font-black text-lg md:text-2xl shadow-2xl italic">KEDHEON.PI</p>
                  </div>
               </div>
            </div>

            {/* 01. 보안 신분 인증 */}
            <div className="flex flex-col w-full">
              <SectionHeader num="01" title={t.authT} desc={t.authD} />
              <div className="w-full bg-[#111] p-10 md:p-24 rounded-[50px] md:rounded-[100px] flex flex-col items-center gap-12 md:gap-20 shadow-inner border border-white/5">
                <div className="flex gap-4 md:gap-10 bg-black p-3 md:p-6 rounded-2xl md:rounded-[45px] w-full max-w-4xl shadow-3xl">
                  <button onClick={() => {setQrType('PERSONAL'); setIsQrActive(false);}} className={`flex-1 py-4 md:py-8 rounded-xl md:rounded-[35px] font-black text-sm md:text-2xl transition-all ${qrType === 'PERSONAL' ? 'bg-[#daa520] text-black' : 'text-gray-500 hover:text-white'}`}>개인 / Personal</button>
                  <button onClick={() => {setQrType('BUSINESS'); setIsQrActive(false);}} className={`flex-1 py-4 md:py-8 rounded-xl md:rounded-[35px] font-black text-sm md:text-2xl transition-all ${qrType === 'BUSINESS' ? 'bg-[#daa520] text-black' : 'text-gray-500'}`}>기업 / Business</button>
                </div>
                <div className={`p-10 md:p-20 rounded-[40px] md:rounded-[80px] bg-black border-2 md:border-4 transition-all shadow-3xl ${isQrActive ? 'border-[#daa520]' : 'border-white/5 opacity-20'}`}>
                  {isQrActive ? (
                    <img src={qrType === 'PERSONAL' ? "/qr-personal.png" : "/qr-business.png"} 
                         onError={(e:any) => { e.target.src = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=KEDHEON_SECURE_${qrType}`; }} 
                         className="w-40 h-40 md:w-80 md:h-80 rounded-2xl md:rounded-[40px]" alt="QR" />
                  ) : (
                    <div className="w-40 h-40 md:w-80 md:h-80 flex items-center justify-center text-gray-800 text-3xl md:text-8xl italic font-black select-none">SECURE</div>
                  )}
                </div>
                <button onClick={() => {setBeomToken(p => p-50); setIsQrActive(true);}} className="bg-[#daa520] text-black px-12 py-5 md:px-32 md:py-10 rounded-2xl md:rounded-[40px] font-black text-xl md:text-4xl shadow-2xl active:scale-95 transition-all uppercase">
                  {isQrActive ? "ACTIVE" : "인증 시작 (50 BEOM)"}
                </button>
              </div>
            </div>

            {/* 02. 영토 확장 지원 (런치패드) */}
            <div className="flex flex-col w-full">
              <SectionHeader num="02" title={t.launchT} desc={t.launchD} />
              <div className="w-full bg-gradient-to-br from-[#111] to-black p-12 md:p-24 rounded-[60px] border border-[#daa520]/20 shadow-3xl space-y-12 md:space-y-20 text-left relative overflow-hidden">
                 <h4 className="text-white font-black text-3xl md:text-6xl italic uppercase tracking-tighter leading-none">🚀 {project.name}</h4>
                 <div className="space-y-8">
                    <div className="flex justify-between text-lg md:text-2xl font-black text-gray-500 uppercase tracking-widest">
                       <span>STATUS</span>
                       <span className="text-[#daa520] text-2xl md:text-5xl">{Math.round((project.current / project.target) * 100)}%</span>
                    </div>
                    <div className="w-full h-8 md:h-12 bg-white/5 rounded-full overflow-hidden border border-white/5 shadow-inner">
                        <div className="h-full bg-gradient-to-r from-[#b8860b] to-[#daa520] shadow-[0_0_30px_rgba(218,165,32,0.6)] transition-all duration-1000" style={{ width: `${(project.current / project.target) * 100}%` }}></div>
                    </div>
                 </div>
                 <button onClick={handleSupportProject} className="w-full py-10 md:py-14 rounded-[40px] bg-white text-black font-black text-2xl md:text-5xl hover:bg-[#daa520] transition-all uppercase shadow-3xl active:scale-95">
                   개척 지원 (1,000 BEOM)
                 </button>
              </div>
            </div>

            {/* 03. 기여 보상 엔진 (스테이킹) */}
            <div className="flex flex-col items-start w-full">
              <SectionHeader num="03" title={t.conT} desc={t.conD} />
              <div className="w-full bg-[#111] p-16 md:p-24 rounded-[80px] border border-[#daa520]/20 flex flex-col items-center gap-10 md:gap-16 shadow-2xl relative overflow-hidden group">
                 <div className="text-center space-y-6">
                    <p className="text-gray-500 font-black text-lg md:text-2xl uppercase tracking-[0.6em] opacity-60">STAKED LOYALTY</p>
                    <p className="text-white font-black text-5xl md:text-9xl lg:text-[10rem] tracking-tighter leading-none select-none">
                      {contributedBeom.toLocaleString()} <span className="text-3xl md:text-6xl text-[#daa520]">BEOM</span>
                    </p>
                 </div>
                 <button onClick={() => {setBeomToken(p => p-1000); setContributedBeom(p => p+1000);}} className="bg-gradient-to-br from-[#daa520] to-[#b8860b] text-black px-16 py-8 md:px-48 md:py-12 rounded-2xl md:rounded-[50px] font-black text-2xl md:text-5xl shadow-3xl hover:scale-105 active:scale-95 transition-all uppercase">
                   EXECUTE (1,000 BEOM)
                 </button>
              </div>
            </div>

            {/* 04. 웅장한 시민 영토 & 방송 (Wide Stream 🌐) */}
            <div className="flex flex-col items-start w-full">
              <SectionHeader num="04" title={t.fanT} desc={t.fanD} icon="🌐" />
              
              <div className="grid grid-cols-3 md:grid-cols-6 gap-5 md:gap-8 w-full mb-16 md:mb-24">
                {cats.map(cat => (
                  <button key={cat} onClick={() => setCategory(cat)} className={`py-8 md:py-12 rounded-3xl font-black text-[10px] md:text-xl tracking-widest border-2 transition-all ${category === cat ? 'bg-[#daa520] text-black border-[#daa520] shadow-3xl' : 'bg-[#111] text-gray-500 border-white/5 hover:border-[#daa520]/50'}`}>{cat}</button>
                ))}
              </div>

              {/* 방송 등록 카드 */}
              <div className="w-full bg-[#111] p-12 md:p-24 rounded-[60px] md:rounded-[100px] border border-white/10 space-y-12 md:space-y-16 text-left mb-20 md:mb-32 shadow-3xl">
                <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="방송 제목 (Title)" className="bg-black p-8 md:p-14 rounded-2xl md:rounded-[50px] border border-white/5 w-full text-2xl md:text-5xl outline-none focus:border-[#daa520] font-black text-white" />
                <textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="상세 내용 (Details)" className="bg-black p-8 md:p-14 rounded-2xl md:rounded-[50px] border border-white/5 w-full text-xl md:text-3xl h-48 md:h-64 outline-none focus:border-[#daa520] resize-none text-gray-300 font-bold" />
                <button onClick={postBroadcast} className="w-full py-10 md:py-16 rounded-3xl md:rounded-[70px] font-black text-3xl md:text-6xl bg-gradient-to-r from-[#daa520] to-[#b8860b] text-black shadow-3xl uppercase tracking-widest hover:scale-[1.02] transition-all">
                  {t.postBtn} (10 BEOM)
                </button>
              </div>

              {/* 피드 리스트 */}
              <div className="w-full space-y-24 md:space-y-48">
                <div className="flex flex-col md:flex-row gap-6 w-full mb-12 md:mb-20">
                  <button onClick={() => setCategory('ALL')} className={`flex-[2] py-8 md:py-12 rounded-3xl md:rounded-[60px] font-black text-2xl md:text-5xl border-4 transition-all ${category === 'ALL' ? 'border-[#daa520] text-[#daa520] bg-[#daa520]/5 shadow-3xl' : 'border-white/5 text-gray-600'}`}> 전체 피드 진입 </button>
                  <button onClick={() => setShowCreateModal(true)} className="flex-1 py-8 md:py-12 rounded-3xl md:rounded-[60px] bg-white/5 border-4 border-white/10 text-gray-400 font-black text-xl md:text-4xl hover:bg-white/10 transition-all tracking-tighter italic">
                    {t.createBtn}
                  </button>
                </div>
                
                {assets.filter(a => category === 'ALL' || a.category === category).map(a => (
                  <div key={a.id} className="bg-[#111] rounded-[50px] md:rounded-[120px] border border-white/5 shadow-2xl p-12 md:p-24 space-y-12 md:space-y-16 text-left relative animate-in slide-in-from-bottom-20 duration-1000">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                      <div className="space-y-6">
                        <p className="text-[#daa520] font-black text-base md:text-3xl tracking-[0.5em] uppercase opacity-60">[{a.category}]</p>
                        <h4 className="text-4xl md:text-7xl lg:text-8xl font-black text-white leading-tight tracking-tighter drop-shadow-2xl">{a.title}</h4>
                      </div>
                      <span className="text-gray-600 font-mono text-sm md:text-3xl font-bold md:border-l-8 border-gray-800 md:pl-10 h-fit py-4">{a.timestamp}</span>
                    </div>
                    <p className="text-gray-400 text-2xl md:text-5xl font-bold leading-relaxed px-4 md:px-12 italic">"{a.desc}"</p>
                    <div className="pt-16 md:pt-24 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10">
                      <button onClick={() => { if (beomToken < 100) return alert("!"); setBeomToken(p => p - 100); }} 
                              className="bg-gradient-to-r from-[#daa520] to-[#b8860b] text-black px-12 py-5 md:px-24 md:py-12 rounded-2xl md:rounded-[50px] font-black text-2xl md:text-4xl hover:scale-110 active:scale-95 transition-all shadow-3xl">
                        후원 (100 BEOM)
                      </button>
                      <p className="text-[#daa520] font-black text-4xl md:text-8xl tracking-tighter leading-none drop-shadow-2xl">
                        {a.beomSupport.toLocaleString()} <span className="text-xl md:text-4xl ml-4">BEOM</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 8. 자치령 개척 모달 (Full Spec) */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/98 backdrop-blur-3xl z-[300] flex items-center justify-center p-8 md:p-24 text-center animate-in fade-in duration-300">
          <div className="bg-[#111] p-12 md:p-32 rounded-[60px] md:rounded-[120px] border border-[#daa520]/50 w-full max-w-7xl shadow-[0_0_300px_rgba(218,165,32,0.3)]">
            <h3 className="text-[#daa520] font-black text-4xl md:text-8xl mb-12 uppercase tracking-widest leading-none italic">Proclaim Territory</h3>
            <input type="text" value={createTitle} onChange={(e) => setCreateTitle(e.target.value)} placeholder="TERRITORY NAME" className="bg-black p-10 md:p-20 rounded-2xl md:rounded-[80px] border border-white/10 w-full text-3xl md:text-7xl focus:border-[#daa520] outline-none font-black text-center mb-16 md:mb-24 text-white uppercase tracking-tighter" />
            <div className="flex gap-8 md:gap-20">
              <button onClick={() => setShowCreateModal(false)} className="flex-1 py-10 md:py-20 rounded-2xl md:rounded-[80px] font-black text-2xl md:text-5xl bg-white/5 uppercase">CANCEL</button>
              <button onClick={handleCreateRoom} className="flex-1 py-10 md:py-20 rounded-2xl md:rounded-[80px] font-black text-2xl md:text-5xl bg-[#daa520] text-black shadow-2xl hover:scale-105 transition-all uppercase">PROCLAIM</button>
            </div>
          </div>
        </div>
      )}

      {/* 최종 하단 */}
      <div className="mt-80 opacity-20 text-center w-full pb-80 font-mono tracking-[1em] md:tracking-[4em] uppercase text-white/50 text-[10px] md:text-2xl">
        Kedheon Empire | Final Integrity Verified v22.0
      </div>
    </div>
  );
}
