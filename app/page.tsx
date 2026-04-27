'use client';
import React, { useState, useEffect } from 'react';

// --- [1. 데이터 모델] ---
interface Asset { id: number; title: string; desc: string; category: string; beomSupport: number; timestamp: string; }
interface Project { id: number; name: string; target: number; current: number; status: string; }

export default function KedheonPortal() {
  const empireCharacterName = 'CHEOREOM_88';

  // --- [2. 상태 관리] ---
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
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createTitle, setCreateTitle] = useState('');

  const [project] = useState<Project>({ id: 1, name: "PI-VENDORS-HUB", target: 1000000, current: 958000, status: "OPEN" });
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
    conT: "CONTRIBUTION REWARD", conD: "Deposit BEOM to sustain rewards.",
    fanT: "IMPERIAL FANDOM TERRITORY", fanD: "Enter official territories or autonomous fan rooms.",
    postBtn: "Post to Feed", supportBtn: "👑 Praise", enterBtn: "ENTER EMPIRE"
  };

  useEffect(() => {
    setHasMounted(true);
    const saved = localStorage.getItem('k_v33_final');
    if (saved) {
      try {
        const p = JSON.parse(saved);
        setBeomToken(p.token || 8141.88); setAssets(p.assets || []); setContributedBeom(p.staked || 0);
      } catch (e) { console.error("Integrity Glitch Fixed"); }
    }
  }, []);

  useEffect(() => {
    if (hasMounted) localStorage.setItem('k_v33_final', JSON.stringify({ token: beomToken, assets, staked: contributedBeom }));
  }, [beomToken, assets, contributedBeom, hasMounted]);

  if (!hasMounted) return null;

  const SectionHeader = ({ num, title, desc, icon }: any) => (
    <div className="w-full flex flex-col items-start gap-4 mb-10 pt-20 border-t border-white/5">
      <div className="flex items-center gap-4">
        <span className="text-[#daa520] font-black text-4xl md:text-5xl opacity-10 italic">{num}</span>
        <div className="flex items-center gap-4">
          {icon && <span className="text-2xl md:text-4xl">{icon}</span>}
          {/* Level 3: 중간 타이틀 */}
          <h3 className="text-[#daa520] font-black text-xl md:text-4xl tracking-widest uppercase border-l-4 border-[#daa520] pl-4 leading-none">{title}</h3>
        </div>
      </div>
      {/* Level 2: 설명 */}
      <p className="text-gray-500 font-bold text-sm md:text-lg opacity-80 pl-2 md:pl-14 max-w-4xl">{desc}</p>
    </div>
  );

  return (
    <div className="flex flex-col items-center bg-black min-h-screen text-white font-sans w-full overflow-x-hidden pb-40">
      
      {/* 글로벌 네비 */}
      <div className="w-full max-w-6xl flex justify-between items-center p-6 md:p-10 sticky top-0 bg-black/90 backdrop-blur-xl z-[150] border-b border-white/5 shadow-2xl">
        <button onClick={() => setLang(l => l === 'KO' ? 'EN' : 'KO')} className="text-[#daa520] font-black text-xs md:text-sm border border-[#daa520]/40 px-6 py-2 rounded-full hover:bg-[#daa520] hover:text-black transition-all">
          {lang === 'KO' ? "ENGLISH" : "한국어"}
        </button>
        <div className="flex gap-4">
          <button onClick={() => setTab('ROOKIE')} className={`px-4 py-2 rounded-xl font-black text-xs md:text-base ${tab === 'ROOKIE' ? 'bg-[#daa520] text-black shadow-lg shadow-[#daa520]/20' : 'bg-[#111] text-gray-500'}`}>ROOKIE</button>
          <button onClick={() => setTab('PIONEER')} className={`px-4 py-2 rounded-xl font-black text-xs md:text-base ${tab === 'PIONEER' ? 'bg-[#daa520] text-black shadow-lg shadow-[#daa520]/20' : 'bg-[#111] text-gray-500'}`}>PIONEER</button>
        </div>
      </div>

      <div className="w-full max-w-6xl flex flex-col gap-20 md:gap-32 px-6 md:px-10 mt-10 md:mt-20">
        
        {tab === 'ROOKIE' ? (
          <div className="flex flex-col items-center text-center py-40">
            <img src="/kedheon-character.png" className="w-48 h-48 md:w-80 md:h-80 rounded-[40px] object-cover mb-10 shadow-3xl border-4 border-[#daa520]/10" alt="K" />
            {/* Level 4: 최고 타이틀 */}
            <h1 className="text-4xl md:text-6xl font-black text-[#daa520] tracking-widest italic mb-10 leading-none uppercase">Kedheon Empire</h1>
            <button onClick={() => setTab('PIONEER')} className="bg-[#daa520] text-black px-12 py-5 md:px-24 md:py-8 rounded-full font-black text-xl md:text-3xl shadow-2xl uppercase">{t.enterBtn}</button>
          </div>
        ) : (
          <div className="flex flex-col gap-24 md:gap-40 animate-in slide-in-from-bottom-10 duration-700">
            
            {/* 00. 대시보드 */}
            <div className="bg-[#111] p-8 md:p-16 rounded-[40px] md:rounded-[80px] border border-[#daa520]/30 shadow-2xl flex flex-col md:flex-row justify-between items-center gap-10 relative overflow-hidden">
               <div className="flex flex-col items-center md:items-start gap-4 md:gap-8 z-10 text-center md:text-left flex-1">
                  <h3 className="text-gray-500 text-xs md:text-base uppercase font-black opacity-60">BALANCE | Lv. 88</h3>
                  {/* Level 4: 제국 최대 글씨 */}
                  <p className="text-[#daa520] font-black text-4xl md:text-7xl lg:text-8xl leading-none tracking-tighter">{beomToken.toLocaleString()} BEOM</p>
                  <div className="bg-black/60 px-6 py-3 md:px-10 md:py-5 rounded-2xl border border-white/5 text-lg md:text-3xl font-mono text-gray-400">≈ 25.9164 Pi</div>
               </div>
               <div className="flex items-center gap-6 md:gap-10 z-10 flex-shrink-0">
                  <img src="/kedheon-character.png" className="w-24 h-24 md:w-56 md:h-56 rounded-3xl md:rounded-[50px] object-cover border-4 border-white/5 shadow-3xl" alt="Char" />
                  <div className="flex flex-col items-center gap-4">
                    <img src="/beom-token.png" className="w-28 h-28 md:w-64 md:h-64 object-contain" alt="Token" />
                    <p className="bg-[#daa520] text-black px-6 py-2 md:px-10 md:py-3 rounded-full font-black text-xs md:text-2xl italic tracking-tighter">KEDHEON.PI</p>
                  </div>
               </div>
            </div>

            {/* 01. 보안 인증 (QR 부활) */}
            <div className="flex flex-col w-full">
              <SectionHeader num="01" title={t.authT} desc={t.authD} />
              <div className="w-full bg-[#111] p-10 md:p-16 rounded-[40px] flex flex-col items-center gap-10 shadow-inner border border-white/5">
                <div className="flex gap-4 bg-black p-2 md:p-4 rounded-xl w-full max-w-2xl font-black">
                  <button onClick={() => {setQrType('PERSONAL'); setIsQrActive(false);}} className={`flex-1 py-3 md:py-6 rounded-lg text-sm md:text-xl transition-all ${qrType === 'PERSONAL' ? 'bg-[#daa520] text-black' : 'text-gray-500'}`}>개인용</button>
                  <button onClick={() => {setQrType('BUSINESS'); setIsQrActive(false);}} className={`flex-1 py-3 md:py-6 rounded-lg text-sm md:text-xl transition-all ${qrType === 'BUSINESS' ? 'bg-[#daa520] text-black' : 'text-gray-500'}`}>기업용</button>
                </div>
                <div className={`p-8 md:p-16 rounded-[40px] bg-black border-2 transition-all ${isQrActive ? 'border-[#daa520]' : 'opacity-20'}`}>
                  {isQrActive ? (
                    <img src={qrType === 'PERSONAL' ? "/qr-personal.png" : "/qr-business.png"} onError={(e:any) => { e.target.src = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=KEDHEON_${qrType}`; }} className="w-40 h-40 md:w-80 md:h-80 rounded-2xl md:rounded-[40px]" alt="QR" />
                  ) : (
                    <div className="w-40 h-40 md:w-80 md:h-80 flex items-center justify-center text-gray-800 text-3xl md:text-6xl font-black italic">SECURE</div>
                  )}
                </div>
                <button onClick={() => {setBeomToken(p => p-50); setIsQrActive(true);}} className="bg-[#daa520] text-black px-12 py-5 md:px-24 md:py-8 rounded-2xl font-black text-lg md:text-2xl shadow-2xl active:scale-95 transition-all">{isQrActive ? "ACTIVE" : "인증 시작 (50 BEOM)"}</button>
              </div>
            </div>

            {/* 02. 런치패드 */}
            <div className="flex flex-col w-full">
              <SectionHeader num="02" title={t.launchT} desc={t.launchD} />
              <div className="w-full bg-[#111] p-10 md:p-16 rounded-[40px] border border-[#daa520]/20 shadow-3xl space-y-8 text-left">
                 <h4 className="text-white font-black text-xl md:text-4xl italic uppercase">🚀 {project.name}</h4>
                 <div className="space-y-4">
                    <div className="flex justify-between text-sm md:text-lg font-black text-gray-500 uppercase"><span>STATUS</span><span className="text-[#daa520]">{Math.round((project.current / project.target) * 100)}%</span></div>
                    <div className="w-full h-4 md:h-8 bg-white/5 rounded-full overflow-hidden border border-white/5"><div className="h-full bg-gradient-to-r from-[#b8860b] to-[#daa520] transition-all duration-1000 shadow-[0_0_20px_rgba(218,165,32,0.5)]" style={{ width: `${(project.current / project.target) * 100}%` }}></div></div>
                 </div>
                 <button onClick={() => {setBeomToken(p => p-1000); alert("지원 완료!");}} className="w-full py-8 md:py-12 rounded-3xl md:rounded-[50px] bg-white text-black font-black text-lg md:text-2xl hover:bg-[#daa520] transition-all uppercase shadow-3xl">개척 지원 (1,000 BEOM)</button>
              </div>
            </div>

            {/* 03. 기여 보상 */}
            <div className="flex flex-col w-full">
              <SectionHeader num="03" title={t.conT} desc={t.conD} />
              <div className="w-full bg-[#111] p-10 md:p-24 rounded-[50px] flex flex-col items-center gap-10 shadow-3xl relative overflow-hidden group text-center">
                 <p className="text-gray-500 font-black text-lg md:text-2xl uppercase tracking-widest opacity-60 italic">STAKED LOYALTY</p>
                 {/* Level 4 */}
                 <p className="text-white font-black text-5xl md:text-8xl lg:text-9xl leading-none select-none">{contributedBeom.toLocaleString()} <span className="text-2xl md:text-6xl text-[#daa520]">BEOM</span></p>
                 <button onClick={() => {setBeomToken(p => p-1000); setContributedBeom(p => p+1000);}} className="bg-gradient-to-br from-[#daa520] to-[#b8860b] text-black px-12 py-5 md:px-32 md:py-10 rounded-2xl md:rounded-[60px] font-black text-xl md:text-4xl shadow-2xl active:scale-95 transition-all uppercase">EXECUTE</button>
              </div>
            </div>

            {/* 04. 영토 및 방송 (Globe Icon) */}
            <div className="flex flex-col w-full">
              <SectionHeader num="04" title={t.fanT} desc={t.fanD} icon="🌐" />
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-6 w-full mb-10 md:mb-20">
                {cats.map(cat => (
                  <button key={cat} onClick={() => setCategory(cat)} className={`py-6 md:py-10 rounded-2xl md:rounded-[40px] font-black text-[10px] md:text-base tracking-widest border-2 transition-all ${category === cat ? 'bg-[#daa520] text-black border-[#daa520] shadow-3xl' : 'bg-[#111] text-gray-500 border-white/5'}`}>{cat}</button>
                ))}
              </div>
              
              <div className="w-full bg-[#111] p-8 md:p-16 rounded-[40px] border border-white/10 space-y-8 text-left mb-16 md:mb-32 shadow-3xl">
                <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="TITLE" className="bg-black p-6 md:p-10 rounded-2xl border border-white/5 w-full text-lg md:text-3xl outline-none focus:border-[#daa520] font-black text-white shadow-inner" />
                <textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="DETAILS" className="bg-black p-6 md:p-10 rounded-2xl border border-white/5 w-full text-sm md:text-xl h-32 md:h-64 outline-none focus:border-[#daa520] resize-none text-gray-300 font-bold" />
                <button onClick={() => { if(!newTitle.trim()) return alert("!"); setAssets([{id: Date.now(), title: newTitle, desc: newDesc, category, beomSupport: 0, owner: empireCharacterName, timestamp: new Date().toLocaleDateString()}, ...assets]); setBeomToken(p=>p-10); setNewTitle(''); setNewDesc(''); }} className="w-full py-10 md:py-16 rounded-3xl md:rounded-[60px] font-black text-3xl md:text-6xl bg-gradient-to-r from-[#daa520] to-[#b8860b] text-black shadow-3xl uppercase transition-all">{t.postBtn}</button>
              </div>

              <div className="w-full space-y-24 md:space-y-48">
                <div className="flex flex-col md:flex-row gap-6 w-full mb-12 md:mb-20">
                  <button onClick={() => setCategory('ALL')} className={`flex-[2] py-8 md:py-16 rounded-3xl md:rounded-[60px] font-black text-2xl md:text-5xl border-4 transition-all ${category === 'ALL' ? 'border-[#daa520] text-[#daa520] bg-[#daa520]/5 shadow-3xl' : 'border-white/5 text-gray-600'}`}>ENTER ALL FEED</button>
                  <button onClick={() => setShowCreateModal(true)} className="flex-1 py-8 md:py-16 rounded-3xl md:rounded-[60px] bg-white/5 border-4 border-white/10 text-gray-400 font-black text-xl md:text-4xl italic hover:bg-white/10 transition-all uppercase tracking-tighter">➕ 영토 선포</button>
                </div>
                
                {assets.filter(a => category === 'ALL' || a.category === category).map(a => (
                  <div key={a.id} className="bg-[#111] rounded-[60px] md:rounded-[120px] border border-white/5 shadow-2xl p-10 md:p-28 space-y-12 text-left relative animate-in slide-in-from-bottom-20 duration-1000">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                      <div className="space-y-4">
                        <p className="text-[#daa520] font-black text-xs md:text-lg tracking-widest uppercase opacity-60">[{a.category}]</p>
                        {/* Level 3 */}
                        <h4 className="text-4xl md:text-7xl lg:text-8xl font-black text-white leading-tight tracking-tighter drop-shadow-2xl">{a.title}</h4>
                      </div>
                      <span className="text-gray-600 font-mono text-sm md:text-3xl font-bold md:border-l-15 border-gray-800 md:pl-10 h-fit py-4">{a.timestamp}</span>
                    </div>
                    {/* Level 2 */}
                    <p className="text-gray-400 text-2xl md:text-4xl font-bold leading-relaxed px-4 md:px-12 italic max-w-7xl">"{a.desc}"</p>
                    <div className="pt-16 md:pt-32 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-12 md:gap-24">
                      <button onClick={() => supportAsset(a.id)} className="bg-gradient-to-r from-[#daa520] to-[#b8860b] text-black px-16 py-8 md:px-32 md:py-16 rounded-2xl md:rounded-[60px] font-black text-2xl md:text-5xl hover:scale-110 active:scale-95 transition-all shadow-3xl">{t.supportBtn}</button>
                      <p className="text-[#daa520] font-black text-[5rem] md:text-[10rem] tracking-tighter leading-none drop-shadow-2xl">{a.beomSupport.toLocaleString()} <span className="text-2xl md:text-6xl ml-4">BEOM</span></p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 8. 자치령 모달 (전체 복구) */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/98 backdrop-blur-3xl z-[300] flex items-center justify-center p-8 md:p-24 animate-in fade-in duration-300">
          <div className="bg-[#111] p-10 md:p-32 rounded-[60px] md:rounded-[120px] border border-[#daa520]/50 w-full max-w-7xl shadow-3xl text-center">
            <h3 className="text-[#daa520] font-black text-4xl md:text-6xl mb-12 uppercase italic leading-none">Proclaim Territory</h3>
            <input type="text" value={createTitle} onChange={(e) => setCreateTitle(e.target.value)} placeholder="NAME" className="bg-black p-10 md:p-24 rounded-2xl md:rounded-[100px] border border-white/10 w-full text-3xl md:text-7xl focus:border-[#daa520] outline-none font-black text-center mb-16 md:mb-32 text-white uppercase" />
            <div className="flex gap-8 md:gap-20">
              <button onClick={() => setShowCreateModal(false)} className="flex-1 py-10 md:py-24 rounded-2xl md:rounded-[80px] font-black text-2xl md:text-6xl bg-white/5 uppercase">CANCEL</button>
              <button onClick={handleCreateRoom} className="flex-1 py-10 md:py-24 rounded-2xl md:rounded-[80px] font-black text-2xl md:text-6xl bg-[#daa520] text-black shadow-2xl uppercase">PROCLAIM</button>
            </div>
          </div>
        </div>
      )}

      {/* 최종 하단 고정 */}
      <div className="mt-80 opacity-20 text-center w-full pb-80 font-mono tracking-[1em] md:tracking-[4em] uppercase text-white/50 text-[10px] md:text-2xl">Kedheon Empire | Final v33.0 Full Master</div>
    </div>
  );
}

