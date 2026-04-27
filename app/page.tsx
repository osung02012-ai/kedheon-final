'use client';
import React, { useState, useEffect } from 'react';

// --- [1. 데이터 모델 및 인터페이스] ---
interface Asset { id: number; title: string; desc: string; category: string; videoUrl?: string; beomSupport: number; owner: string; timestamp: string; }
interface Project { id: number; name: string; target: number; current: number; status: string; }

export default function KedheonPortal() {
  const empireCharacterName = 'CHEOREOM_88';

  // --- [2. 상태 관리 시스템] ---
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
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [project, setProject] = useState<Project>({ id: 1, name: "PI-VENDORS-HUB", target: 1000000, current: 958000, status: "OPEN" });

  const cats = ['MUSIC', 'SPORTS', 'ANIME', 'DRAMA', 'MOVIE', 'ESPORTS', 'COMEDY', 'TRAVEL', 'FOOD', 'BEAUTY', 'FASHION', 'TECH'];
  
  const t = lang === 'KO' ? {
    authT: "IMPERIAL SECURE AUTH", authD: "제국 공식 보안 신분 인증 및 익명 결제 시스템을 가동합니다.",
    launchT: "TERRITORY EXPANSION", launchD: "제국의 영토 확장 프로젝트를 지원하고 초기 권한을 확보하십시오.",
    conT: "CONTRIBUTION REWARD", conD: "제국 인프라 기여 보상을 확인하고 BEOM을 예치하십시오.",
    fanT: "IMPERIAL FANDOM TERRITORY", fanD: "제국 공식 영토 혹은 시민들이 개척한 자치령 팬방에 진입하십시오.",
    postBtn: "제국 피드에 방송하기", supportBtn: "👑 황금 찬양", enterBtn: "제국 입국하기"
  } : {
    authT: "IMPERIAL SECURE AUTH", authD: "Activate official secure identity auth and anonymous payment system.",
    launchT: "TERRITORY EXPANSION", launchD: "Support expansion projects and gain early access rights.",
    conT: "CONTRIBUTION REWARD", conD: "Deposit BEOM to sustain ecosystem rewards.",
    fanT: "IMPERIAL FANDOM TERRITORY", fanD: "Enter official territories or autonomous fan rooms.",
    postBtn: "Broadcast to Feed", supportBtn: "👑 Praise", enterBtn: "ENTER EMPIRE"
  };

  // --- [3. 데이터 영속성 엔진] ---
  useEffect(() => {
    setHasMounted(true);
    const saved = localStorage.getItem('k_v32_final');
    if (saved) {
      try {
        const p = JSON.parse(saved);
        setBeomToken(p.token || 8141.88); setAssets(p.assets || []); setContributedBeom(p.staked || 0);
      } catch (e) { console.error("Integrity Glitch Fixed"); }
    }
  }, []);

  useEffect(() => {
    if (hasMounted) {
      localStorage.setItem('k_v32_final', JSON.stringify({ token: beomToken, assets, staked: contributedBeom }));
    }
  }, [beomToken, assets, contributedBeom, hasMounted]);

  if (!hasMounted) return null;

  // --- [4. 비즈니스 로직 핸들러] ---
  const handleSupportProject = () => {
    if (beomToken < 1000) return alert("잔액 부족!");
    setBeomToken(p => p - 1000); setProject(prev => ({ ...prev, current: prev.current + 1000 }));
    alert("지원 완료!");
  };

  const postBroadcast = () => {
    if (!newTitle.trim()) return alert("제목 필수!");
    const n: Asset = { id: Date.now(), title: newTitle, desc: newDesc, category, videoUrl: newVideoUrl, beomSupport: 0, owner: empireCharacterName, timestamp: new Date().toLocaleDateString() };
    setAssets([n, ...assets]); setBeomToken(p => p - 10); setNewTitle(''); setNewDesc(''); setNewVideoUrl('');
  };

  const supportAsset = (id: number) => {
    if (beomToken < 100) return alert("잔액 부족!");
    setAssets(assets.map(a => a.id === id ? { ...a, beomSupport: a.beomSupport + 100 } : a));
    setBeomToken(p => p - 100);
  };

  // --- [5. 주군 전용 4:3:2 비율 헤더] ---
  const SectionHeader = ({ num, title, desc, icon }: any) => (
    <div className="w-full flex flex-col items-start gap-4 mb-10 pt-20 border-t border-white/5 animate-in fade-in duration-700">
      <div className="flex items-center gap-4">
        <span className="text-[#daa520] font-black text-4xl md:text-5xl opacity-10 italic select-none">{num}</span>
        <div className="flex items-center gap-4">
          {icon && <span className="text-3xl md:text-4xl">{icon}</span>}
          <h3 className="text-[#daa520] font-black text-2xl md:text-5xl tracking-widest uppercase border-l-4 border-[#daa520] pl-4 leading-none">{title}</h3>
        </div>
      </div>
      <p className="text-gray-500 font-bold text-sm md:text-xl opacity-80 pl-2 md:pl-14 max-w-4xl leading-relaxed">{desc}</p>
    </div>
  );

  return (
    <div className="flex flex-col items-center bg-black min-h-screen text-white font-sans w-full overflow-x-hidden pb-40">
      
      {/* 1. 상단 글로벌 네비게이션 */}
      <div className="w-full max-w-6xl flex justify-between items-center p-6 md:p-10 sticky top-0 bg-black/90 backdrop-blur-xl z-[150] border-b border-white/5 shadow-2xl">
        <button onClick={() => setLang(l => l === 'KO' ? 'EN' : 'KO')} className="text-[#daa520] font-black text-xs md:text-sm border border-[#daa520]/40 px-6 py-2 rounded-full hover:bg-[#daa520] hover:text-black transition-all">
          {lang === 'KO' ? "ENGLISH" : "한국어"}
        </button>
        <div className="flex gap-4">
          <button onClick={() => setTab('ROOKIE')} className={`px-4 py-2 md:px-8 md:py-2 rounded-xl font-black text-xs md:text-base ${tab === 'ROOKIE' ? 'bg-[#daa520] text-black shadow-lg shadow-[#daa520]/20' : 'bg-[#111] text-gray-500'}`}>ROOKIE</button>
          <button onClick={() => setTab('PIONEER')} className={`px-4 py-2 md:px-8 md:py-2 rounded-xl font-black text-xs md:text-base ${tab === 'PIONEER' ? 'bg-[#daa520] text-black shadow-lg shadow-[#daa520]/20' : 'bg-[#111] text-gray-500'}`}>PIONEER</button>
        </div>
      </div>

      <div className="w-full max-w-6xl flex flex-col gap-20 md:gap-32 px-6 md:px-10 mt-10 md:mt-20">
        
        {tab === 'ROOKIE' ? (
          <div className="flex flex-col items-center text-center py-40 animate-in fade-in duration-1000">
            <img src="/kedheon-character.png" className="w-48 h-48 md:w-80 md:h-80 rounded-[40px] object-cover mb-10 shadow-3xl border-4 border-[#daa520]/10" alt="K" />
            <h1 className="text-4xl md:text-7xl font-black text-[#daa520] tracking-widest italic mb-10 leading-none uppercase">Kedheon Empire</h1>
            <button onClick={() => setTab('PIONEER')} className="bg-[#daa520] text-black px-12 py-5 md:px-24 md:py-8 rounded-full font-black text-xl md:text-4xl shadow-2xl hover:scale-105 active:scale-95 transition-all uppercase">{t.enterBtn}</button>
          </div>
        ) : (
          <div className="flex flex-col gap-24 md:gap-40 animate-in slide-in-from-bottom-10 duration-700">
            
            {/* 00. 메인 대시보드 - 이미지 틈새 구출 & 비율 4:2 적용 */}
            <div className="bg-[#111] p-8 md:p-16 rounded-[40px] md:rounded-[80px] border border-[#daa520]/30 shadow-2xl flex flex-col lg:flex-row justify-between items-center gap-12 relative overflow-hidden">
               <div className="flex flex-col items-center lg:items-start gap-6 md:gap-10 z-10 text-center lg:text-left flex-1">
                  <h3 className="text-gray-500 text-xs md:text-xl uppercase tracking-widest font-black opacity-60">BALANCE | Lv. 88</h3>
                  <p className="text-[#daa520] font-black text-4xl md:text-7xl lg:text-8xl leading-none tracking-tighter">{beomToken.toLocaleString()} BEOM</p>
                  <div className="bg-black/60 px-6 py-3 md:px-12 md:py-6 rounded-2xl border border-white/5 shadow-2xl text-xl md:text-4xl font-mono text-gray-400 italic">≈ 25.9164 Pi</div>
               </div>
               <div className="flex items-center gap-6 md:gap-10 z-10 flex-shrink-0">
                  <img src="/kedheon-character.png" className="w-24 h-24 md:w-64 md:h-64 rounded-2xl md:rounded-[50px] object-cover border-4 border-white/5 shadow-3xl" alt="Char" />
                  <div className="flex flex-col items-center gap-4">
                    <img src="/beom-token.png" className="w-28 h-28 md:w-72 md:h-72 object-contain" alt="Token" />
                    <p className="bg-[#daa520] text-black px-6 py-2 md:px-12 md:py-4 rounded-full font-black text-sm md:text-2xl shadow-xl italic tracking-tighter">KEDHEON.PI</p>
                  </div>
               </div>
            </div>

            {/* 01. 보안 신분 인증 - QR 인프라 광장급 부활 */}
            <div className="flex flex-col w-full">
              <SectionHeader num="01" title={t.authT} desc={t.authD} />
              <div className="w-full bg-[#111] p-10 md:p-24 rounded-[40px] md:rounded-[80px] flex flex-col items-center gap-12 md:gap-24 shadow-inner border border-white/5">
                <div className="flex gap-4 md:gap-10 bg-black p-4 md:p-6 rounded-2xl md:rounded-[60px] w-full max-w-4xl shadow-3xl font-black text-center">
                  <button onClick={() => {setQrType('PERSONAL'); setIsQrActive(false);}} className={`flex-1 py-4 md:py-10 rounded-xl md:rounded-[45px] text-sm md:text-3xl transition-all ${qrType === 'PERSONAL' ? 'bg-[#daa520] text-black scale-105' : 'text-gray-500'}`}>개인용 보안망</button>
                  <button onClick={() => {setQrType('BUSINESS'); setIsQrActive(false);}} className={`flex-1 py-4 md:py-10 rounded-xl md:rounded-[45px] text-sm md:text-3xl transition-all ${qrType === 'BUSINESS' ? 'bg-[#daa520] text-black scale-105' : 'text-gray-500'}`}>기업용 보안망</button>
                </div>
                <div className={`p-10 md:p-20 rounded-[40px] md:rounded-[90px] bg-black border-2 md:border-8 transition-all shadow-[0_0_100px_rgba(0,0,0,0.8)] ${isQrActive ? 'border-[#daa520]' : 'opacity-20'}`}>
                  {isQrActive ? (
                    <img src={qrType === 'PERSONAL' ? "/qr-personal.png" : "/qr-business.png"} onError={(e:any) => { e.target.src = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=KEDHEON_SECURE_${qrType}`; }} className="w-40 h-40 md:w-[35rem] md:h-[35rem] rounded-2xl md:rounded-[60px]" alt="QR" />
                  ) : (
                    <div className="w-40 h-40 md:w-[35rem] md:h-[35rem] flex items-center justify-center text-gray-800 text-5xl md:text-9xl italic font-black select-none">SECURE</div>
                  )}
                </div>
                <button onClick={() => {setBeomToken(p => p-50); setIsQrActive(true);}} className="bg-[#daa520] text-black px-12 py-5 md:px-40 md:py-16 rounded-2xl md:rounded-[60px] font-black text-xl md:text-5xl shadow-2xl active:scale-95 transition-all uppercase">{isQrActive ? "보안망 가동 중" : "인증 시작 (50 BEOM)"}</button>
              </div>
            </div>

            {/* 02. 영토 확장 지원 (런치패드) */}
            <div className="flex flex-col w-full">
              <SectionHeader num="02" title={t.launchT} desc={t.launchD} />
              <div className="w-full bg-gradient-to-br from-[#111] to-black p-10 md:p-24 rounded-[40px] md:rounded-[80px] border border-[#daa520]/20 shadow-3xl space-y-10 text-left relative overflow-hidden">
                 <h4 className="text-white font-black text-3xl md:text-7xl italic uppercase tracking-tighter leading-none">🚀 {project.name}</h4>
                 <div className="space-y-6 md:space-y-12">
                    <div className="flex justify-between text-xl md:text-3xl font-black text-gray-500 uppercase"><span>STATUS</span><span className="text-[#daa520] text-2xl md:text-6xl">{Math.round((project.current / project.target) * 100)}%</span></div>
                    <div className="w-full h-8 md:h-16 bg-white/5 rounded-full overflow-hidden border border-white/5 shadow-inner"><div className="h-full bg-gradient-to-r from-[#b8860b] to-[#daa520] transition-all duration-1000 shadow-[0_0_50px_rgba(218,165,32,0.8)]" style={{ width: `${(project.current / project.target) * 100}%` }}></div></div>
                 </div>
                 <button onClick={handleSupportProject} className="w-full py-10 md:py-20 rounded-3xl md:rounded-[100px] bg-white text-black font-black text-3xl md:text-8xl hover:bg-[#daa520] transition-all uppercase shadow-3xl active:scale-95">개척 지원 (1,000 BEOM)</button>
              </div>
            </div>

            {/* 03. 기여 보상 엔진 (기여 보상) */}
            <div className="flex flex-col w-full">
              <SectionHeader num="03" title={t.conT} desc={t.conD} />
              <div className="w-full bg-[#111] p-10 md:p-24 rounded-[60px] md:rounded-[140px] border border-[#daa520]/20 flex flex-col items-center gap-10 md:gap-20 shadow-3xl relative overflow-hidden group text-center">
                 <p className="text-gray-500 font-black text-xl md:text-5xl uppercase tracking-[0.5em] opacity-60 italic">STAKED LOYALTY</p>
                 <p className="text-white font-black text-5xl md:text-[14rem] tracking-tighter leading-none select-none">
                   {contributedBeom.toLocaleString()} <span className="text-3xl md:text-[6rem] text-[#daa520]">BEOM</span>
                 </p>
                 <button onClick={() => {setBeomToken(p => p-1000); setContributedBeom(p => p+1000);}} className="bg-gradient-to-br from-[#daa520] to-[#b8860b] text-black px-16 py-8 md:px-64 md:py-20 rounded-2xl md:rounded-[80px] font-black text-2xl md:text-7xl shadow-3xl hover:scale-105 active:scale-95 transition-all uppercase tracking-widest">EXECUTE</button>
              </div>
            </div>

            {/* 04. 웅장한 시민 영토 & 방송 피드 (🌐 Globe Icon) */}
            <div className="flex flex-col items-start w-full">
              <SectionHeader num="04" title={t.fanT} desc={t.fanD} icon="🌐" />
              
              <div className="grid grid-cols-3 md:grid-cols-6 gap-4 md:gap-8 w-full mb-16 md:mb-32">
                {cats.map(cat => (
                  <button key={cat} onClick={() => setCategory(cat)} className={`py-6 md:py-14 rounded-2xl md:rounded-[55px] font-black text-[10px] md:text-2xl tracking-widest border-2 md:border-4 transition-all ${category === cat ? 'bg-[#daa520] text-black border-[#daa520] shadow-3xl scale-110' : 'bg-[#111] text-gray-500 border-white/5 hover:border-[#daa520]/40'}`}>{cat}</button>
                ))}
              </div>

              {/* 방송 등록 카드 */}
              <div className="w-full bg-[#111] p-10 md:p-24 rounded-[40px] md:rounded-[100px] border border-white/10 space-y-10 md:space-y-20 text-left mb-20 md:mb-40 shadow-3xl relative overflow-hidden">
                <div className="space-y-10 w-full">
                  <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="TITLE" className="bg-black p-8 md:p-14 rounded-2xl md:rounded-[65px] border border-white/5 w-full text-2xl md:text-5xl outline-none focus:border-[#daa520] font-black text-white shadow-inner" />
                  <textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="DETAILS" className="bg-black p-8 md:p-14 rounded-2xl md:rounded-[65px] border border-white/5 w-full text-xl md:text-4xl h-48 md:h-[30rem] outline-none focus:border-[#daa520] resize-none text-gray-300 font-bold" />
                </div>
                <button onClick={postBroadcast} className="w-full py-10 md:py-20 rounded-3xl md:rounded-[100px] font-black text-3xl md:text-8xl bg-gradient-to-r from-[#daa520] to-[#b8860b] text-black shadow-3xl uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all">
                  {t.postBtn}
                </button>
              </div>

              {/* 피드 한 줄 리스트 */}
              <div className="w-full space-y-32 md:space-y-64">
                <button onClick={() => setCategory('ALL')} className={`w-full py-10 md:py-20 rounded-3xl md:rounded-[100px] font-black text-3xl md:text-8xl border-4 transition-all mb-12 md:mb-24 ${category === 'ALL' ? 'border-[#daa520] text-[#daa520] bg-[#daa520]/5 shadow-3xl' : 'border-white/5 text-gray-600'}`}>전체 피드 입장</button>
                {assets.filter(a => category === 'ALL' || a.category === category).map(a => (
                  <div key={a.id} className="bg-[#111] rounded-[60px] md:rounded-[150px] border border-white/5 shadow-2xl p-12 md:p-40 space-y-16 md:space-y-32 text-left relative animate-in slide-in-from-bottom-20 duration-1000">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-8 md:gap-20">
                      <div className="space-y-6 md:space-y-12">
                        <p className="text-[#daa520] font-black text-base md:text-4xl tracking-[0.6em] uppercase opacity-60">[{a.category}]</p>
                        <h4 className="text-4xl md:text-[8rem] font-black text-white leading-tight tracking-tighter drop-shadow-2xl">{a.title}</h4>
                      </div>
                      <span className="text-gray-600 font-mono text-sm md:text-5xl font-bold md:border-l-[15px] border-gray-800 md:pl-16 h-fit py-4">{a.timestamp}</span>
                    </div>
                    {a.videoUrl && a.videoUrl.includes('v=') && (
                      <div className="relative aspect-video rounded-[80px] overflow-hidden border-[12px] border-white/5 bg-black shadow-3xl"><iframe className="absolute inset-0 w-full h-full" src={`https://www.youtube.com/embed/${a.videoUrl.split('v=')[1]}`} frameBorder="0" allowFullScreen></iframe></div>
                    )}
                    <p className="text-gray-400 text-2xl md:text-[5rem] font-bold leading-relaxed px-4 md:px-20 italic max-w-7xl">"{a.desc}"</p>
                    <div className="pt-16 md:pt-40 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-12 md:gap-24">
                      <button onClick={() => supportAsset(a.id)} className="bg-gradient-to-r from-[#daa520] to-[#b8860b] text-black px-16 py-8 md:px-32 md:py-16 rounded-2xl md:rounded-[60px] font-black text-2xl md:text-6xl hover:scale-110 active:scale-95 transition-all shadow-3xl">
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

      {/* 최종 하단 */}
      <div className="mt-80 opacity-20 text-center w-full pb-80 font-mono tracking-[1em] md:tracking-[5em] uppercase text-white/50 text-[10px] md:text-2xl">
        Kedheon Empire | Final Integrity Full Master v32.0 Verified
      </div>
    </div>
  );
}
