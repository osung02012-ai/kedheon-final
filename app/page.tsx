'use client';
import React, { useState, useEffect } from 'react';

// --- [1. 데이터 모델 및 인터페이스] ---
interface Asset { 
  id: number; title: string; desc: string; category: string; 
  videoUrl?: string; beomSupport: number; isAd: boolean; 
  owner: string; timestamp: string; 
}
interface Territory { id: string; title: string; desc: string; creator: string; }
interface Project { id: number; name: string; target: number; current: number; status: string; }

// --- [2. 글로벌 다국어 엔진 (백서 준수 버전)] ---
const translations = {
  KO: {
    balance: "제국 자산 잔액", grade: "제국 등급",
    citizenshipTitle: "IMPERIAL CITIZENSHIP",
    citizenshipDesc: "개인 및 기업 시민권을 획득하여 제국의 정식 일원이 되십시오.",
    personal: "개인 시민", business: "기업 엔티티",
    authActive: "인증 완료", authInactive: "인증 필요 (50 BEOM)",
    launchTitle: "TERRITORY EXPANSION",
    launchDesc: "제국의 새로운 영토 개척 프로젝트를 지원하고 초기 권한을 확보하십시오.",
    launchStatus: "개척 진행률", supportProject: "개척 지원 (1,000 BEOM)",
    contributionTitle: "CONTRIBUTION REWARD",
    contributionDesc: "제국 인프라 유지에 BEOM을 예치하고 생태계 기여 보상을 받으십시오.",
    contributedBalance: "누적 기여 자산",
    contributeBtn: "기여 실행 (1,000 BEOM)",
    fandomTitle: "EMPIRE TERRITORIES",
    fandomDesc: "12대 공식 영토 및 시민 자치령 피드를 탐험하십시오.",
    enterAll: "전체 피드 진입", createRoom: "➕ 새로운 팬방 개척 (500 BEOM)",
    broadcastTitle: "BROADCAST CENTER",
    broadcastDesc: "영상을 박제하여 제국 전역에 전파하십시오.",
    postBtn: "피드에 방송하기", supportBtn: "👑 황금 찬양 (100 BEOM)", backBtn: "맨 위로 복귀"
  },
  EN: {
    balance: "Empire Balance", grade: "Empire Grade",
    citizenshipTitle: "IMPERIAL CITIZENSHIP",
    citizenshipDesc: "Obtain official citizenship and join the Empire.",
    personal: "Personal", business: "Business",
    authActive: "Authorized", authInactive: "Requires Auth (50 BEOM)",
    launchTitle: "TERRITORY EXPANSION",
    launchDesc: "Support new territory projects and gain early access.",
    launchStatus: "Expansion Progress", supportProject: "Support (1,000 BEOM)",
    contributionTitle: "CONTRIBUTION REWARD",
    contributionDesc: "Contribute assets to earn ecosystem rewards.",
    contributedBalance: "Staked Contribution",
    contributeBtn: "Execute Contribution",
    fandomTitle: "EMPIRE TERRITORIES",
    fandomDesc: "Explore the 12 Official Territories and Feeds.",
    enterAll: "ENTER ALL", createRoom: "➕ Create Territory (500 BEOM)",
    broadcastTitle: "BROADCAST CENTER",
    broadcastDesc: "Broadcast your video across the Empire.",
    postBtn: "Broadcast to Feed", supportBtn: "👑 Royal Praise", backBtn: "Back to Top"
  }
};

// --- [3. 수직 집중형 섹션 타이틀] ---
const SectionTitle = ({ title, desc }: { title: string; desc: string }) => (
  <div className="flex flex-col items-center py-24 gap-4 border-t border-white/5 w-full text-center">
    <div className="flex items-center gap-6">
      <span className="text-5xl">🏛️</span>
      <h3 className="text-[#daa520] font-black text-5xl tracking-[0.3em] uppercase leading-tight">{title}</h3>
    </div>
    <p className="text-gray-500 font-bold text-2xl tracking-wide opacity-80 max-w-3xl leading-relaxed">{desc}</p>
  </div>
);

export default function KedheonPortal() {
  const PI_TO_BEOM_RATE = 314.1592;
  const TERRITORY_CREATE_COST = 500;
  const empireCharacterName = 'CHEOREOM_88';

  // --- [상태 관리] ---
  const [hasMounted, setHasMounted] = useState(false);
  const [lang, setLang] = useState<'KO' | 'EN'>('KO');
  const [beomToken, setBeomToken] = useState(8141.88);
  const [contributedBeom, setContributedBeom] = useState(0);
  const [qrType, setQrType] = useState<'PERSONAL' | 'BUSINESS'>('PERSONAL');
  const [isQrActive, setIsQrActive] = useState(false);
  const [category, setCategory] = useState('ALL');
  
  const [assets, setAssets] = useState<Asset[]>([]);
  const [userTerritories, setUserTerritories] = useState<Territory[]>([]);
  
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [createRoomTitle, setCreateRoomTitle] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // 런치패드 가상 프로젝트
  const [project, setProject] = useState<Project>({ id: 1, name: "PI-NEXUS-NODE", target: 1000000, current: 753000, status: "OPEN" });

  const t = translations[lang];
  const categories = ['MUSIC', 'SPORTS', 'ANIME', 'DRAMA', 'MOVIE', 'ESPORTS', 'COMEDY', 'TRAVEL', 'FOOD', 'BEAUTY', 'FASHION', 'TECH'];

  // --- [데이터 처리 로직] ---
  useEffect(() => {
    setHasMounted(true);
    const saved = localStorage.getItem('kedheon_empire_final_master');
    if (saved) {
      const p = JSON.parse(saved);
      setBeomToken(p.token || 8141.88);
      setAssets(p.assets || []);
      setUserTerritories(p.rooms || []);
      setContributedBeom(p.contributed || 0);
    }
  }, []);

  useEffect(() => {
    if (hasMounted) {
      localStorage.setItem('kedheon_empire_final_master', JSON.stringify({ 
        token: beomToken, assets, rooms: userTerritories, contributed: contributedBeom 
      }));
    }
  }, [beomToken, assets, userTerritories, contributedBeom, hasMounted]);

  if (!hasMounted) return null;

  const handleSupportProject = () => {
    if (beomToken < 1000) return alert("잔액 부족!");
    setBeomToken(p => p - 1000);
    setProject(p => ({ ...p, current: p.current + 1000 }));
    alert("영토 개척 지원 완료! 초기 권한을 확보했습니다.");
  };

  const handleCreateRoom = () => {
    if (beomToken < TERRITORY_CREATE_COST) return alert("잔액 부족!");
    const newRoom = { id: createRoomTitle.toUpperCase(), title: createRoomTitle.toUpperCase(), desc: "", creator: empireCharacterName };
    setUserTerritories([...userTerritories, newRoom]);
    setBeomToken(prev => prev - TERRITORY_CREATE_COST);
    setShowCreateModal(false); setCreateRoomTitle('');
  };

  const postBroadcast = () => {
    if (!newTitle.trim()) return alert("제목 필수!");
    const newAsset: Asset = { id: Date.now(), title: newTitle, desc: newDesc, category, videoUrl: newVideoUrl, beomSupport: 0, isAd: false, owner: empireCharacterName, timestamp: new Date().toLocaleDateString() };
    setAssets([newAsset, ...assets]);
    setBeomToken(prev => prev - 10);
    setNewTitle(''); setNewDesc(''); setNewVideoUrl('');
  };

  return (
    <div className="flex flex-col items-center bg-black min-h-screen text-white font-sans w-full overflow-x-hidden pb-80">
      
      {/* 1. 상단 고정 헤더 (원라인) */}
      <div className="w-full max-w-5xl flex justify-between items-center p-10 sticky top-0 bg-black/90 backdrop-blur-2xl z-[100] border-b border-white/10 shadow-2xl">
        <button onClick={() => setLang(l => l === 'KO' ? 'EN' : 'KO')} className="text-[#daa520] font-black text-sm tracking-[0.3em] border border-[#daa520]/40 px-8 py-3 rounded-full hover:bg-[#daa520] hover:text-black transition-all shadow-lg">
          {lang === 'KO' ? "ENGLISH" : "한국어"}
        </button>
        <h1 className="text-[#daa520] font-black text-4xl italic tracking-tighter leading-none">KEDHEON EMPIRE</h1>
        <div className="w-32 hidden md:block"></div>
      </div>

      <div className="w-full max-w-3xl flex flex-col gap-40 px-6 mt-20">
        
        {/* 2. 메인 대시보드 (선명한 범 토큰) */}
        <div className="bg-[#111] p-16 rounded-[80px] border border-[#daa520]/40 shadow-[0_0_80px_rgba(218,165,32,0.1)] flex flex-col items-center gap-14 text-center animate-in fade-in duration-1000">
          <div className="w-72 h-72 relative flex items-center justify-center overflow-visible">
            <img src="/beom-token.png" className="w-full h-full object-contain transform hover:scale-110 transition-transform duration-700" alt="Beom" />
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-[#daa520] text-black px-12 py-4 rounded-full font-black text-3xl shadow-2xl">Lv. 88</div>
          </div>
          <div className="space-y-6">
            <h3 className="text-gray-500 text-base uppercase tracking-[0.6em] font-black opacity-60">{t.balance}</h3>
            <p className="text-[#daa520] font-black text-9xl tracking-tighter leading-none">{beomToken.toLocaleString()} BEOM</p>
            <p className="text-gray-400 font-mono text-3xl opacity-60">≈ {(beomToken / PI_TO_BEOM_RATE).toFixed(4)} Pi</p>
          </div>
        </div>

        {/* 3. 시민권 & 기업 인증 (수직 집중형) */}
        <div className="flex flex-col items-center gap-14">
          <SectionTitle title={t.citizenshipTitle} desc={t.citizenshipDesc} />
          <div className="flex gap-6 bg-[#111] p-4 rounded-3xl border border-white/5">
            <button onClick={() => {setQrType('PERSONAL'); setIsQrActive(false);}} className={`px-14 py-6 rounded-2xl font-black text-xl transition-all ${qrType === 'PERSONAL' ? 'bg-[#daa520] text-black shadow-2xl' : 'text-gray-500 hover:text-white'}`}>{t.personal}</button>
            <button onClick={() => {setQrType('BUSINESS'); setIsQrActive(false);}} className={`px-14 py-6 rounded-2xl font-black text-xl transition-all ${qrType === 'BUSINESS' ? 'bg-[#daa520] text-black shadow-2xl' : 'text-gray-500 hover:text-white'}`}>{t.business}</button>
          </div>
          <div className="w-full bg-[#111] p-20 rounded-[70px] border border-white/5 flex flex-col items-center gap-12 shadow-inner">
            <div className={`p-12 rounded-[50px] bg-black border-2 transition-all ${isQrActive ? 'border-[#daa520] shadow-[0_0_40px_rgba(218,165,32,0.2)]' : 'border-white/5 opacity-50'}`}>
              {isQrActive ? (
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=KEDHEON_${qrType}`} className="w-56 h-56 rounded-3xl" alt="QR" />
              ) : (
                <div className="w-56 h-56 flex items-center justify-center text-gray-800 text-6xl italic font-black">QR</div>
              )}
            </div>
            <button onClick={() => {setBeomToken(p => p-50); setIsQrActive(true);}} className="bg-[#daa520] text-black px-24 py-8 rounded-3xl font-black text-3xl shadow-2xl hover:scale-105 active:scale-95 transition-all">
              {isQrActive ? t.authActive : t.authInactive}
            </button>
          </div>
        </div>

        {/* 4. 영토 확장 지원 (런치패드) */}
        <div className="flex flex-col items-center gap-14">
          <SectionTitle title={t.launchTitle} desc={t.launchDesc} />
          <div className="w-full bg-gradient-to-br from-[#111] to-black p-16 rounded-[70px] border border-[#daa520]/20 shadow-2xl space-y-12 text-left relative overflow-hidden">
             <div className="flex justify-between items-center">
                <h4 className="text-white font-black text-4xl tracking-tight italic">🚀 {project.name}</h4>
                <span className="bg-[#daa520]/20 text-[#daa520] px-6 py-2 rounded-full text-sm font-black uppercase border border-[#daa520]/40">{project.status}</span>
             </div>
             <div className="space-y-6">
                <div className="flex justify-between text-base font-black text-gray-500 uppercase tracking-widest">
                   <span>{t.launchStatus}</span>
                   <span className="text-[#daa520]">{Math.round((project.current / project.target) * 100)}%</span>
                </div>
                <div className="w-full h-6 bg-white/5 rounded-full overflow-hidden border border-white/5 shadow-inner">
                   <div className="h-full bg-gradient-to-r from-[#b8860b] to-[#daa520] shadow-[0_0_30px_rgba(218,165,32,0.6)] transition-all duration-1000" style={{ width: `${(project.current / project.target) * 100}%` }}></div>
                </div>
             </div>
             <button onClick={handleSupportProject} className="w-full py-10 rounded-[40px] bg-white text-black font-black text-3xl hover:bg-[#daa520] transition-all uppercase tracking-widest shadow-2xl active:scale-95">
               {t.supportProject}
             </button>
          </div>
        </div>

        {/* 5. 제국 기여 보상 (기여 보상 엔진) */}
        <div className="flex flex-col items-center gap-14">
          <SectionTitle title={t.contributionTitle} desc={t.contributionDesc} />
          <div className="w-full bg-[#111] p-16 rounded-[70px] border border-[#daa520]/20 flex flex-col items-center gap-12 shadow-2xl relative">
             <div className="absolute top-0 left-0 p-10 opacity-5 font-black text-8xl italic uppercase">Loyalty</div>
             <div className="text-center space-y-6">
                <p className="text-gray-500 font-black text-sm uppercase tracking-widest opacity-60">{t.contributedBalance}</p>
                <p className="text-white font-black text-8xl tracking-tighter leading-none">{contributedBeom.toLocaleString()} BEOM</p>
             </div>
             <button onClick={() => {setBeomToken(p => p-1000); setContributedBeom(p => p+1000);}} className="bg-gradient-to-br from-[#daa520] to-[#b8860b] text-black px-24 py-10 rounded-[35px] font-black text-3xl shadow-2xl hover:scale-105 active:scale-95 transition-all uppercase tracking-widest">
               {t.contributeBtn}
             </button>
          </div>
        </div>

        {/* 6. 팬덤 영토 (12대 카테고리 & 피드 선택) */}
        <div className="flex flex-col items-center gap-14">
          <SectionTitle title={t.fandomTitle} desc={t.fandomDesc} />
          <div className="grid grid-cols-3 md:grid-cols-4 gap-5 w-full">
            {categories.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)} className={`py-8 rounded-[35px] font-black text-sm tracking-widest border transition-all ${category === cat ? 'bg-[#daa520] text-black border-[#daa520] shadow-xl' : 'bg-[#111] text-gray-500 border-white/5 hover:border-[#daa520]/50'}`}>
                {cat}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-5 justify-center pt-10">
            <button onClick={() => setCategory('ALL')} className={`px-12 py-6 rounded-3xl font-black text-base border-2 transition-all ${category === 'ALL' ? 'border-[#daa520] text-[#daa520]' : 'border-white/5 text-gray-600'}`}>{t.enterAll}</button>
            {userTerritories.map(room => (
              <button key={room.id} onClick={() => setCategory(room.id)} className={`px-12 py-6 rounded-3xl font-black text-base border-2 border-[#daa520]/40 text-[#daa520] italic`}>👑 {room.title}</button>
            ))}
            <button onClick={() => setShowCreateModal(true)} className="px-12 py-6 rounded-3xl bg-white/5 border border-white/10 text-gray-500 font-bold text-base hover:bg-white/10 transition-all">{t.createRoom}</button>
          </div>
        </div>

        {/* 7. 브로드캐스트 센터 (통합 피드) */}
        <div className="flex flex-col items-center gap-20">
          <SectionTitle title={t.broadcastTitle} desc={t.broadcastDesc} />
          
          <div className="w-full bg-[#111] p-14 rounded-[70px] border border-white/10 space-y-10 shadow-2xl text-left">
            <div className="space-y-6">
              <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="방송 제목 (Broadcast Title)" className="bg-black p-10 rounded-[40px] border border-white/5 w-full text-3xl outline-none focus:border-[#daa520] font-black text-white" />
              <input type="text" value={newVideoUrl} onChange={(e) => setNewVideoUrl(e.target.value)} placeholder="YouTube URL (v=...)" className="bg-black p-10 rounded-[40px] border border-white/5 w-full text-2xl outline-none focus:border-[#daa520] font-mono text-[#daa520]" />
              <textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="방송 상세 내용 (Details)" className="bg-black p-10 rounded-[40px] border border-white/5 w-full text-2xl h-56 outline-none focus:border-[#daa520] resize-none text-gray-300" />
            </div>
            <button onClick={postBroadcast} className="w-full py-12 rounded-[50px] font-black text-4xl bg-gradient-to-r from-[#daa520] to-[#b8860b] text-black shadow-3xl uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all">
              {t.postBtn}
            </button>
          </div>

          <div className="w-full space-y-24">
            {assets.filter(a => category === 'ALL' || a.category === category).map(a => (
              <div key={a.id} className="bg-[#111] rounded-[80px] overflow-hidden border border-white/5 shadow-3xl animate-in slide-in-from-bottom-20 duration-1000">
                <div className="p-14 space-y-10 text-left">
                  <div className="flex justify-between items-start">
                    <div className="space-y-3">
                      <p className="text-[#daa520] font-black text-sm tracking-widest uppercase opacity-60">[{a.category}]</p>
                      <h4 className="text-6xl font-black text-white leading-tight tracking-tight">{a.title}</h4>
                    </div>
                    <span className="text-gray-600 font-mono text-xl font-bold">{a.timestamp}</span>
                  </div>
                  {a.videoUrl && a.videoUrl.includes('v=') && (
                    <div className="relative aspect-video rounded-[60px] overflow-hidden border-8 border-white/5 bg-black shadow-inner">
                      <iframe className="absolute inset-0 w-full h-full" src={`https://www.youtube.com/embed/${a.videoUrl.split('v=')[1]}`} frameBorder="0" allowFullScreen></iframe>
                    </div>
                  )}
                  <p className="text-gray-400 text-3xl font-bold leading-relaxed px-6 italic">"{a.desc}"</p>
                  <div className="pt-12 border-t border-white/5 flex justify-between items-center px-6">
                    <button onClick={() => {setBeomToken(p => p - 100); support(a.id);}} className="bg-gradient-to-r from-[#daa520] to-[#b8860b] text-black px-16 py-6 rounded-3xl font-black text-2xl hover:scale-110 active:scale-95 transition-all shadow-2xl">
                      {t.supportBtn}
                    </button>
                    <p className="text-[#daa520] font-black text-6xl tracking-tighter">{a.beomSupport.toLocaleString()} BEOM</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 8. 고정 하단 */}
      <div className="mt-80 opacity-20 text-center w-full">
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-[#daa520] font-black text-lg uppercase tracking-[1.5em] mb-12 hover:opacity-100 transition-opacity">
          {t.backBtn}
        </button>
        <p className="text-sm font-mono tracking-[2em] uppercase text-white/50">Kedheon Empire | Stable v6.1 Master Final</p>
      </div>

      {/* 영토 개척 모달 */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/99 backdrop-blur-3xl z-[200] flex items-center justify-center p-8 text-center animate-in fade-in duration-300">
          <div className="bg-[#111] p-20 rounded-[80px] border border-[#daa520]/50 w-full max-w-3xl shadow-[0_0_150px_rgba(218,165,32,0.2)]">
            <h3 className="text-[#daa520] font-black text-5xl mb-8 uppercase tracking-widest leading-none">Proclaim Territory</h3>
            <p className="text-gray-500 font-bold mb-16 text-2xl italic">"새로운 팬덤 영토를 선포하십시오."</p>
            <input type="text" value={createRoomTitle} onChange={(e) => setCreateRoomTitle(e.target.value)} placeholder="Territory Name" className="bg-black p-10 rounded-[40px] border border-white/10 w-full text-3xl focus:border-[#daa520] outline-none font-black text-center mb-14 text-white uppercase" />
            <div className="flex gap-8">
              <button onClick={() => setShowCreateModal(false)} className="flex-1 py-10 rounded-[40px] font-black text-2xl bg-white/5 hover:bg-white/10 transition-all uppercase">CANCEL</button>
              <button onClick={handleCreateRoom} className="flex-1 py-10 rounded-[40px] font-black text-2xl bg-[#daa520] text-black shadow-2xl hover:scale-105 active:scale-95 transition-all uppercase">PROCLAIM</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
