'use client';
import React, { useState, useEffect } from 'react';

// --- [1. 데이터 모델 정의] ---
interface Asset { id: number; title: string; desc: string; category: string; videoUrl?: string; beomSupport: number; owner: string; timestamp: string; }
interface Territory { id: string; title: string; }
interface Project { id: number; name: string; target: number; current: number; status: string; }

// --- [2. 글로벌 다국어 사전 (에러 방지용 키 정렬)] ---
const translations = {
  KO: {
    balance: "제국 자산 잔액", grade: "제국 등급",
    citizenshipTitle: "IMPERIAL CITIZENSHIP",
    citizenshipDesc: "개인 및 기업 시민권을 획득하여 제국의 정식 일원이 되십시오.",
    personal: "개인 시민", business: "기업 시민",
    authActive: "인증 활성화됨", authInactive: "인증 필요 (50 BEOM)",
    launchTitle: "TERRITORY EXPANSION",
    launchDesc: "제국의 새로운 영토 개척을 지원하고 초기 권한을 확보하십시오.",
    launchStatus: "개척 진행률", supportProject: "개척 지원 (1,000 BEOM)",
    contributionTitle: "CONTRIBUTION REWARD",
    contributionDesc: "제국 인프라 유지에 BEOM을 기여하고 보상을 받으십시오.",
    contributedBalance: "누적 기여 자산",
    contributeBtn: "기여 실행 (1,000 BEOM)",
    fandomTitle: "EMPIRE TERRITORIES",
    fandomDesc: "12대 공식 영토 피드를 탐험하십시오.",
    broadcastTitle: "BROADCAST CENTER",
    postBtn: "피드에 방송 박제", supportBtn: "👑 황금 찬양", backBtn: "맨 위로"
  },
  EN: {
    balance: "Empire Balance", grade: "Empire Grade",
    citizenshipTitle: "IMPERIAL CITIZENSHIP",
    citizenshipDesc: "Obtain Personal/Business citizenship and join the Empire.",
    personal: "Personal", business: "Business",
    authActive: "Authorized", authInactive: "Requires Auth (50 BEOM)",
    launchTitle: "TERRITORY EXPANSION",
    launchDesc: "Support new territory expansion projects.",
    launchStatus: "Progress", supportProject: "Support (1,000 BEOM)",
    contributionTitle: "CONTRIBUTION REWARD",
    contributionDesc: "Deposit BEOM to sustain infrastructure and earn rewards.",
    contributedBalance: "Staked Contribution",
    contributeBtn: "Execute Contribution",
    fandomTitle: "EMPIRE TERRITORIES",
    fandomDesc: "Explore the 12 Official Territories.",
    broadcastTitle: "BROADCAST CENTER",
    postBtn: "Post to Feed", supportBtn: "👑 Royal Praise", backBtn: "Back to Top"
  }
};

// --- [3. 수직 집중형 섹션 타이틀 컴포넌트] ---
const SectionTitle = ({ title, desc }: { title: string; desc: string }) => (
  <div className="flex flex-col items-center py-20 gap-4 border-t border-white/5 w-full text-center">
    <h3 className="text-[#daa520] font-black text-4xl tracking-[0.3em] uppercase leading-tight">{title}</h3>
    <p className="text-gray-500 font-bold text-xl opacity-80 max-w-2xl leading-relaxed">{desc}</p>
  </div>
);

export default function KedheonPortal() {
  const PI_TO_BEOM_RATE = 314.1592;

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
  
  // 런치패드 프로젝트
  const [project, setProject] = useState<Project>({ id: 1, name: "PI-VENDORS-HUB", target: 1000000, current: 782000, status: "OPEN" });

  const t = translations[lang];
  const categories = ['MUSIC', 'SPORTS', 'ANIME', 'DRAMA', 'MOVIE', 'ESPORTS', 'COMEDY', 'TRAVEL', 'FOOD', 'BEAUTY', 'FASHION', 'TECH'];

  // --- [데이터 처리 및 에러 방지] ---
  useEffect(() => {
    setHasMounted(true);
    const saved = localStorage.getItem('kedheon_v65_final');
    if (saved) {
      try {
        const p = JSON.parse(saved);
        setBeomToken(p.token || 8141.88);
        setAssets(p.assets || []);
        setUserTerritories(p.rooms || []);
        setContributedBeom(p.contributed || 0);
      } catch (e) { console.error("JSON Parse Error"); }
    }
  }, []);

  useEffect(() => {
    if (hasMounted) {
      localStorage.setItem('kedheon_v65_final', JSON.stringify({ token: beomToken, assets, rooms: userTerritories, contributed: contributedBeom }));
    }
  }, [beomToken, assets, userTerritories, contributedBeom, hasMounted]);

  if (!hasMounted) return null;

  // --- [액션 로직] ---
  const handleSupportProject = () => {
    if (beomToken < 1000) return alert("잔액 부족!");
    setBeomToken(p => p - 1000);
    setProject(p => ({ ...p, current: p.current + 1000 }));
  };

  const handleContribution = () => {
    if (beomToken < 1000) return alert("잔액 부족!");
    setBeomToken(p => p - 1000);
    setContributedBeom(p => p + 1000);
  };

  return (
    <div className="flex flex-col items-center bg-black min-h-screen text-white font-sans w-full overflow-x-hidden pb-80">
      
      {/* 1. 상단 고정 헤더 */}
      <div className="w-full max-w-4xl flex justify-between items-center p-8 sticky top-0 bg-black/90 backdrop-blur-xl z-50 border-b border-white/10 shadow-2xl">
        <button onClick={() => setLang(l => l === 'KO' ? 'EN' : 'KO')} className="text-[#daa520] font-black text-xs tracking-widest border border-[#daa520]/40 px-6 py-2 rounded-full hover:bg-[#daa520] hover:text-black transition-all">
          {lang === 'KO' ? "ENGLISH" : "한국어"}
        </button>
        <h1 className="text-[#daa520] font-black text-2xl italic tracking-tighter">KEDHEON EMPIRE</h1>
        <div className="w-20"></div>
      </div>

      <div className="w-full max-w-3xl flex flex-col gap-32 px-6 mt-16">
        
        {/* 2. 대시보드 - 선명한 범 토큰 */}
        <div className="bg-[#111] p-12 rounded-[70px] border border-[#daa520]/40 shadow-2xl flex flex-col items-center gap-12 text-center">
          <div className="w-64 h-64 relative flex items-center justify-center">
            <img src="/beom-token.png" className="w-full h-full object-contain transform hover:scale-110 transition-transform duration-500" alt="Beom" />
            <div className="absolute -bottom-6 bg-[#daa520] text-black px-10 py-3 rounded-full font-black text-2xl shadow-2xl">Lv. 88</div>
          </div>
          <div className="space-y-4">
            <h3 className="text-gray-500 text-sm uppercase tracking-[0.5em] font-black opacity-60">{t.balance}</h3>
            <p className="text-[#daa520] font-black text-8xl tracking-tighter leading-none">{beomToken.toLocaleString()} BEOM</p>
            <p className="text-gray-400 font-mono text-2xl opacity-60">≈ {(beomToken / PI_TO_BEOM_RATE).toFixed(4)} Pi</p>
          </div>
        </div>

        {/* 3. 시민권 & 기업 인증 (수직 원라인 정렬) */}
        <div className="flex flex-col items-center gap-12">
          <SectionTitle title={t.citizenshipTitle} desc={t.citizenshipDesc} />
          <div className="flex gap-4 bg-[#111] p-3 rounded-3xl border border-white/5">
            <button onClick={() => {setQrType('PERSONAL'); setIsQrActive(false);}} className={`px-12 py-5 rounded-2xl font-black text-base transition-all ${qrType === 'PERSONAL' ? 'bg-[#daa520] text-black shadow-xl' : 'text-gray-500'}`}>{t.personal}</button>
            <button onClick={() => {setQrType('BUSINESS'); setIsQrActive(false);}} className={`px-12 py-5 rounded-2xl font-black text-base transition-all ${qrType === 'BUSINESS' ? 'bg-[#daa520] text-black shadow-xl' : 'text-gray-500'}`}>{t.business}</button>
          </div>
          <div className="w-full bg-[#111] p-16 rounded-[60px] border border-white/5 flex flex-col items-center gap-10 text-center">
            <div className={`p-10 rounded-[40px] bg-black border-2 transition-all ${isQrActive ? 'border-[#daa520]' : 'border-white/5 opacity-50'}`}>
              {isQrActive ? (
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=KEDHEON_${qrType}`} className="w-48 h-48 rounded-2xl" alt="QR" />
              ) : (
                <div className="w-48 h-48 flex items-center justify-center text-gray-700 text-5xl italic font-black">QR</div>
              )}
            </div>
            <button onClick={() => {setBeomToken(p => p-50); setIsQrActive(true);}} className="bg-[#daa520] text-black px-16 py-6 rounded-2xl font-black text-2xl shadow-2xl hover:scale-105 transition-all">
              {isQrActive ? t.authActive : t.authInactive}
            </button>
          </div>
        </div>

        {/* 4. 영토 확장 지원 (런치패드) */}
        <div className="flex flex-col items-center gap-12">
          <SectionTitle title={t.launchTitle} desc={t.launchDesc} />
          <div className="w-full bg-[#111] p-12 rounded-[60px] border border-[#daa520]/20 shadow-2xl space-y-10 text-left">
             <div className="flex justify-between items-center">
                <h4 className="text-white font-black text-3xl italic">🚀 {project.name}</h4>
                <span className="bg-[#daa520]/10 text-[#daa520] px-4 py-1 rounded-full text-xs font-black uppercase">{project.status}</span>
             </div>
             <div className="space-y-4">
                <div className="flex justify-between text-sm font-black text-gray-500 uppercase tracking-widest">
                   <span>{t.launchStatus}</span>
                   <span className="text-[#daa520]">{Math.round((project.current / project.target) * 100)}%</span>
                </div>
                <div className="w-full h-4 bg-white/5 rounded-full overflow-hidden">
                   <div className="h-full bg-[#daa520] shadow-[0_0_20px_rgba(218,165,32,0.5)] transition-all duration-1000" style={{ width: `${(project.current / project.target) * 100}%` }}></div>
                </div>
             </div>
             <button onClick={handleSupportProject} className="w-full py-8 rounded-[35px] bg-white text-black font-black text-2xl hover:bg-[#daa520] transition-all uppercase tracking-widest shadow-2xl">
               {t.supportProject}
             </button>
          </div>
        </div>

        {/* 5. 제국 기여 보상 (스테이킹) */}
        <div className="flex flex-col items-center gap-12">
          <SectionTitle title={t.contributionTitle} desc={t.contributionDesc} />
          <div className="w-full bg-[#111] p-12 rounded-[60px] border border-[#daa520]/20 flex flex-col items-center gap-10 shadow-2xl">
             <div className="text-center space-y-4">
                <p className="text-gray-500 font-black text-xs uppercase tracking-widest">{t.contributedBalance}</p>
                <p className="text-white font-black text-7xl tracking-tighter leading-none">{contributedBeom.toLocaleString()} BEOM</p>
             </div>
             <button onClick={handleContribution} className="bg-gradient-to-br from-[#daa520] to-[#b8860b] text-black px-20 py-8 rounded-3xl font-black text-2xl shadow-2xl hover:scale-105 active:scale-95 transition-all uppercase tracking-widest">
               {t.contributeBtn}
             </button>
          </div>
        </div>

        {/* 6. 팬덤 영토 (12대 카테고리) */}
        <div className="flex flex-col items-center gap-12">
          <SectionTitle title={t.fandomTitle} desc={t.fandomDesc} />
          <div className="grid grid-cols-3 md:grid-cols-4 gap-4 w-full">
            {categories.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)} className={`py-6 rounded-3xl font-black text-xs tracking-widest border transition-all ${category === cat ? 'bg-[#daa520] text-black border-[#daa520]' : 'bg-[#111] text-gray-500 border-white/5 hover:border-[#daa520]/40'}`}>
                {cat}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-4 justify-center pt-8">
            <button onClick={() => setCategory('ALL')} className={`px-10 py-5 rounded-2xl font-black text-sm border-2 transition-all ${category === 'ALL' ? 'border-[#daa520] text-[#daa520]' : 'border-white/5 text-gray-600'}`}>{t.enterAll}</button>
            {userTerritories.map(room => (
              <button key={room.id} onClick={() => setCategory(room.id)} className={`px-10 py-5 rounded-2xl font-black text-sm border-2 border-[#daa520]/40 text-[#daa520]`}>👑 {room.title}</button>
            ))}
          </div>
        </div>

        {/* 7. 브로드캐스트 센터 (통합 피드) */}
        <div className="flex flex-col items-center gap-16">
          <SectionTitle title={t.broadcastTitle} desc="제국의 모든 목소리를 한 줄로 연결합니다." />
          <div className="w-full bg-[#111] p-12 rounded-[60px] border border-white/10 space-y-8 shadow-2xl text-left">
            <input type="text" placeholder="제목 (Title)" className="bg-black p-8 rounded-[35px] border border-white/5 w-full text-2xl outline-none focus:border-[#daa520] font-black text-white" />
            <textarea placeholder="상세 내용 (Details)" className="bg-black p-8 rounded-[35px] border border-white/5 w-full text-xl h-48 outline-none focus:border-[#daa520] resize-none text-gray-300" />
            <button className="w-full py-10 rounded-[50px] font-black text-3xl bg-[#daa520] text-black uppercase tracking-widest shadow-2xl">
              {t.postBtn}
            </button>
          </div>
          <div className="w-full space-y-20">
            {assets.filter(a => category === 'ALL' || a.category === category).map(a => (
              <div key={a.id} className="bg-[#111] rounded-[70px] overflow-hidden border border-white/5 shadow-2xl animate-in fade-in duration-1000">
                <div className="p-12 space-y-8 text-left">
                  <div className="flex justify-between items-start">
                    <h4 className="text-5xl font-black text-white leading-tight tracking-tight">{a.title}</h4>
                    <span className="text-gray-600 font-mono text-base font-bold">{a.timestamp}</span>
                  </div>
                  <p className="text-gray-400 text-2xl font-bold leading-relaxed px-4 italic">"{a.desc}"</p>
                  <div className="pt-10 border-t border-white/5 flex justify-between items-center px-4">
                    <button className="bg-[#daa520] text-black px-12 py-5 rounded-2xl font-black text-xl hover:scale-110 active:scale-95 transition-all shadow-xl">{t.supportBtn}</button>
                    <p className="text-[#daa520] font-black text-5xl tracking-tighter">{a.beomSupport.toLocaleString()} BEOM</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      <div className="mt-80 opacity-20 text-center w-full">
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-[#daa520] font-black text-sm uppercase tracking-[1em] mb-10">
          {t.backBtn}
        </button>
        <p className="text-xs font-mono tracking-[1.5em] uppercase text-white/50">Kedheon Empire | Stable v6.5 Master Final</p>
      </div>
    </div>
  );
}
