'use client';
import React, { useState, useEffect } from 'react';

// --- [1. 데이터 모델 정의] ---
interface Asset { id: number; title: string; desc: string; category: string; beomSupport: number; owner: string; timestamp: string; }
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
    authT: "IMPERIAL SECURE AUTH", authD: "보안 신분 인증 및 익명 결제 시스템을 가동합니다.",
    launchT: "TERRITORY EXPANSION", launchD: "제국의 영토 확장 프로젝트를 지원하십시오.",
    conT: "CONTRIBUTION REWARD", conD: "제국 인프라 기여 보상을 확인하십시오.",
    fanT: "IMPERIAL FANDOM TERRITORY", fanD: "공식 영토 혹은 시민 자치령에 진입하십시오.",
    postBtn: "제국 피드 방송", supportBtn: "👑 찬양", enterBtn: "제국 입국", createBtn: "➕ 영토 선포"
  } : {
    authT: "SECURE AUTH", authD: "Activate secure identity and payment system.",
    launchT: "EXPANSION", launchD: "Support empire expansion projects.",
    conT: "REWARD", conD: "Check your infrastructure contribution rewards.",
    fanT: "TERRITORY", fanD: "Enter official or autonomous territories.",
    postBtn: "Broadcast", supportBtn: "👑 Praise", enterBtn: "ENTER", createBtn: "➕ Proclaim"
  };

  useEffect(() => {
    setHasMounted(true);
    const saved = localStorage.getItem('kedheon_v35_final');
    if (saved) {
      try {
        const p = JSON.parse(saved);
        setBeomToken(p.token || 8141.88); setAssets(p.assets || []); setContributedBeom(p.staked || 0);
      } catch (e) { console.error("Integrity Glitch Fixed"); }
    }
  }, []);

  useEffect(() => {
    if (hasMounted) localStorage.setItem('kedheon_v35_final', JSON.stringify({ token: beomToken, assets, staked: contributedBeom }));
  }, [beomToken, assets, contributedBeom, hasMounted]);

  if (!hasMounted) return null;

  // --- [주군의 4:3:2 절대 비율 섹션 헤더] ---
  const SectionHeader = ({ num, title, desc, icon }: any) => (
    <div className="w-full flex flex-col items-start gap-2 mb-6 pt-12 border-t border-white/10 animate-in fade-in duration-500">
      <div className="flex items-center gap-3">
        <span className="text-[#daa520] font-black text-3xl md:text-4xl opacity-10 italic select-none">{num}</span>
        <div className="flex items-center gap-3">
          {icon && <span className="text-xl md:text-3xl">{icon}</span>}
          {/* Level 3: 중간 타이틀 (데스크탑 3xl, 모바일 2xl) */}
          <h3 className="text-[#daa520] font-black text-xl md:text-3xl tracking-widest uppercase border-l-4 border-[#daa520] pl-3 leading-none">{title}</h3>
        </div>
      </div>
      {/* Level 2: 설명 (데스크탑 base, 모바일 sm) */}
      <p className="text-gray-500 font-bold text-sm md:text-base opacity-80 pl-1 md:pl-10 max-w-2xl">{desc}</p>
    </div>
  );

  return (
    <div className="flex flex-col items-center bg-black min-h-screen text-white font-sans w-full overflow-x-hidden pb-20">
      
      {/* 1. 상단 글로벌 네비게이션 */}
      <div className="w-full max-w-5xl flex justify-between items-center p-4 md:p-6 sticky top-0 bg-black/90 backdrop-blur-xl z-[150] border-b border-white/5 shadow-xl">
        <button onClick={() => setLang(l => l === 'KO' ? 'EN' : 'KO')} className="text-[#daa520] font-black text-[10px] md:text-xs border border-[#daa520]/40 px-4 py-1.5 rounded-full hover:bg-[#daa520] hover:text-black transition-all">
          {lang === 'KO' ? "ENGLISH" : "한국어"}
        </button>
        <div className="flex gap-2 md:gap-4">
          <button onClick={() => setTab('ROOKIE')} className={`px-4 py-1.5 rounded-lg font-black text-[10px] md:text-sm transition-all ${tab === 'ROOKIE' ? 'bg-[#daa520] text-black shadow-md' : 'bg-[#111] text-gray-500'}`}>ROOKIE</button>
          <button onClick={() => setTab('PIONEER')} className={`px-4 py-1.5 rounded-lg font-black text-[10px] md:text-sm transition-all ${tab === 'PIONEER' ? 'bg-[#daa520] text-black shadow-md' : 'bg-[#111] text-gray-500'}`}>PIONEER</button>
        </div>
      </div>

      <div className="w-full max-w-5xl flex flex-col gap-12 md:gap-20 px-4 md:px-6 mt-6 md:mt-10">
        
        {tab === 'ROOKIE' ? (
          <div className="flex flex-col items-center text-center py-20">
            <img src="/kedheon-character.png" className="w-32 h-32 md:w-56 md:h-56 rounded-3xl object-cover mb-6 shadow-2xl border-2 border-[#daa520]/20" alt="K" />
            <h1 className="text-3xl md:text-5xl font-black text-[#daa520] tracking-widest italic mb-6 leading-none uppercase">Kedheon Empire</h1>
            <button onClick={() => setTab('PIONEER')} className="bg-[#daa520] text-black px-10 py-3 md:px-16 md:py-4 rounded-full font-black text-lg md:text-2xl shadow-xl hover:scale-105 active:scale-95 transition-all">{t.enterBtn}</button>
          </div>
        ) : (
          <div className="flex flex-col gap-16 md:gap-24 animate-in slide-in-from-bottom-5 duration-500">
            
            {/* 00. 대시보드 - 틈새 탈출 & 비율 교정 완료 */}
            <div className="bg-[#111] p-6 md:p-10 rounded-3xl md:rounded-[40px] border border-[#daa520]/30 shadow-2xl flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden">
               <div className="flex flex-col items-center md:items-start gap-3 md:gap-5 z-10 text-center md:text-left flex-1">
                  <h3 className="text-gray-500 text-[10px] md:text-sm uppercase font-black opacity-60 tracking-tighter">제국 자산 잔액 | Lv. 88</h3>
                  {/* Level 4: 제국 최대 크기 (데스크탑 5xl, 모바일 4xl) */}
                  <p className="text-[#daa520] font-black text-4xl md:text-5xl lg:text-6xl leading-none tracking-tighter">{beomToken.toLocaleString()} BEOM</p>
                  <div className="bg-black/60 px-4 py-2 md:px-6 md:py-3 rounded-xl border border-white/5 text-sm md:text-xl font-mono text-gray-400 italic">≈ 25.9164 Pi</div>
               </div>
               <div className="flex items-center gap-4 md:gap-6 z-10 flex-shrink-0">
                  <img src="/kedheon-character.png" className="w-16 h-16 md:w-32 md:h-32 rounded-2xl md:rounded-3xl object-cover border-2 border-white/5 shadow-xl" alt="Char" />
                  <div className="flex flex-col items-center gap-2">
                    <img src="/beom-token.png" className="w-20 h-20 md:w-32 md:h-32 object-contain" alt="Token" />
                    <p className="bg-[#daa520] text-black px-4 py-1 rounded-full font-black text-[10px] md:text-sm italic tracking-tighter">KEDHEON.PI</p>
                  </div>
               </div>
            </div>

            {/* 01. 보안 신분 인증 - QR 이미지 부활 */}
            <div className="flex flex-col w-full">
              <SectionHeader num="01" title={t.authT} desc={t.authD} />
              <div className="w-full bg-[#111] p-6 md:p-10 rounded-3xl flex flex-col items-center gap-6 md:gap-8 shadow-inner border border-white/5">
                <div className="flex gap-2 md:gap-4 bg-black p-1.5 md:p-3 rounded-xl w-full max-w-md font-black">
                  <button onClick={() => {setQrType('PERSONAL'); setIsQrActive(false);}} className={`flex-1 py-2 md:py-3 rounded-lg text-[10px] md:text-sm transition-all ${qrType === 'PERSONAL' ? 'bg-[#daa520] text-black' : 'text-gray-500'}`}>개인인증</button>
                  <button onClick={() => {setQrType('BUSINESS'); setIsQrActive(false);}} className={`flex-1 py-2 md:py-3 rounded-lg text-[10px] md:text-sm transition-all ${qrType === 'BUSINESS' ? 'bg-[#daa520] text-black' : 'text-gray-500'}`}>기업인증</button>
                </div>
                <div className={`p-4 md:p-6 rounded-2xl bg-black border-2 transition-all shadow-xl ${isQrActive ? 'border-[#daa520]' : 'opacity-20'}`}>
                  {isQrActive ? (
                    <img src={qrType === 'PERSONAL' ? "/qr-personal.png" : "/qr-business.png"} 
                         onError={(e:any) => { e.target.src = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=KEDHEON_SECURE_${qrType}`; }} 
                         className="w-32 h-32 md:w-56 md:h-56 rounded-xl" alt="QR" />
                  ) : (
                    <div className="w-32 h-32 md:w-56 md:h-56 flex items-center justify-center text-gray-800 text-xl md:text-3xl font-black italic">SECURE</div>
                  )}
                </div>
                {/* Level 2: 버튼 크기 다이어트 완료 */}
                <button onClick={() => {setBeomToken(p => p-50); setIsQrActive(true);}} className="bg-[#daa520] text-black px-8 py-3 md:px-12 md:py-4 rounded-xl font-black text-sm md:text-lg shadow-lg active:scale-95 transition-all">
                  {isQrActive ? "인증 활성화 중" : "인증 시작 (50 BEOM)"}
                </button>
              </div>
            </div>

            {/* 02. 영토 확장 지원 */}
            <div className="flex flex-col w-full">
              <SectionHeader num="02" title={t.launchT} desc={t.launchD} />
              <div className="w-full bg-[#111] p-6 md:p-10 rounded-3xl border border-[#daa520]/20 shadow-xl space-y-6 text-left">
                 <h4 className="text-white font-black text-lg md:text-2xl italic uppercase tracking-tighter">🚀 {project.name}</h4>
                 <div className="space-y-3">
                    <div className="flex justify-between text-[10px] md:text-xs font-black text-gray-500 uppercase"><span>STATUS</span><span className="text-[#daa520]">{Math.round((project.current / project.target) * 100)}%</span></div>
                    <div className="w-full h-2 md:h-3 bg-white/5 rounded-full overflow-hidden border border-white/5"><div className="h-full bg-gradient-to-r from-[#b8860b] to-[#daa520] transition-all duration-1000 shadow-[0_0_15px_rgba(218,165,32,0.4)]" style={{ width: `${(project.current / project.target) * 100}%` }}></div></div>
                 </div>
                 <button onClick={() => {setBeomToken(p => p-1000); alert("지원 완료!");}} className="w-full py-3 md:py-4 rounded-xl bg-white text-black font-black text-sm md:text-lg hover:bg-[#daa520] transition-all shadow-md active:scale-95 uppercase">개척 지원 (1,000 BEOM)</button>
              </div>
            </div>

            {/* 03. 기여 보상 엔진 */}
            <div className="flex flex-col w-full">
              <SectionHeader num="03" title={t.conT} desc={t.conD} />
              <div className="w-full bg-[#111] p-8 md:p-12 rounded-3xl flex flex-col items-center gap-6 shadow-xl relative overflow-hidden group text-center border border-white/5">
                 <p className="text-gray-500 font-black text-[10px] md:text-sm uppercase tracking-widest opacity-60">STAKED LOYALTY</p>
                 {/* Level 4 */}
                 <p className="text-white font-black text-4xl md:text-6xl tracking-tighter leading-none select-none">{contributedBeom.toLocaleString()} <span className="text-lg md:text-3xl text-[#daa520]">BEOM</span></p>
                 <button onClick={() => {setBeomToken(p => p-1000); setContributedBeom(p => p+1000);}} className="bg-gradient-to-br from-[#daa520] to-[#b8860b] text-black px-10 py-3 md:px-16 md:py-4 rounded-xl font-black text-sm md:text-lg shadow-lg active:scale-95 transition-all">EXECUTE</button>
              </div>
            </div>

            {/* 04. 시민 영토 및 방송 (Globe 🌐) */}
            <div className="flex flex-col items-start w-full">
              <SectionHeader num="04" title={t.fanT} desc={t.fanD} icon="🌐" />
              <div className="grid grid-cols-4 md:grid-cols-6 gap-2 md:gap-4 w-full mb-8 md:mb-12">
                {cats.map(cat => (
                  <button key={cat} onClick={() => setCategory(cat)} className={`py-3 md:py-5 rounded-xl font-black text-[8px] md:text-xs tracking-widest border transition-all ${category === cat ? 'bg-[#daa520] text-black border-[#daa520] shadow-lg' : 'bg-[#111] text-gray-500 border-white/10'}`}>{cat}</button>
                ))}
              </div>

              {/* 방송 등록 카드 - 버튼 크기 정상화 */}
              <div className="w-full bg-[#111] p-6 md:p-8 rounded-3xl border border-white/10 space-y-4 text-left mb-12 shadow-xl">
                <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="TITLE" className="bg-black p-3 md:p-4 rounded-xl border border-white/5 w-full text-sm md:text-lg outline-none focus:border-[#daa520] font-black text-white" />
                <textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="DETAILS" className="bg-black p-3 md:p-4 rounded-xl border border-white/5 w-full text-xs md:text-sm h-24 outline-none focus:border-[#daa520] resize-none text-gray-300 font-bold" />
                <button onClick={() => { if(!newTitle.trim()) return alert("제목!"); setAssets([{id: Date.now(), title: newTitle, desc: newDesc, category, beomSupport: 0, owner: empireCharacterName, timestamp: new Date().toLocaleDateString()}, ...assets]); setBeomToken(p=>p-10); setNewTitle(''); setNewDesc(''); }} className="w-full py-3 md:py-4 rounded-xl font-black text-sm md:text-lg bg-gradient-to-r from-[#daa520] to-[#b8860b] text-black shadow-md uppercase active:scale-95 transition-all">
                  {t.postBtn} (10 BEOM)
                </button>
              </div>

              {/* 피드 리스트 - 글자 폭탄 제거 완료 */}
              <div className="w-full space-y-12 md:space-y-20">
                <div className="flex flex-col md:flex-row gap-3 w-full mb-6">
                  <button onClick={() => setCategory('ALL')} className={`flex-[2] py-3 md:py-4 rounded-xl font-black text-sm md:text-lg border-2 transition-all ${category === 'ALL' ? 'border-[#daa520] text-[#daa520] bg-[#daa520]/5 shadow-lg' : 'border-white/10 text-gray-600'}`}>전체 피드 입장</button>
                  <button onClick={() => setShowCreateModal(true)} className="flex-1 py-3 md:py-4 rounded-xl bg-white/5 border-2 border-white/10 text-gray-500 font-black text-xs md:text-sm italic hover:bg-white/10 transition-all">{t.createBtn}</button>
                </div>
                {assets.filter(a => category === 'ALL' || a.category === category).map(a => (
                  <div key={a.id} className="bg-[#111] rounded-[30px] md:rounded-[40px] border border-white/5 shadow-xl p-6 md:p-10 space-y-6 text-left relative animate-in slide-in-from-bottom-5 duration-500 overflow-hidden">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                      <div className="space-y-2">
                        <p className="text-[#daa520] font-black text-[10px] md:text-xs tracking-widest uppercase opacity-60">[{a.category}]</p>
                        {/* Level 3: 피드 제목 */}
                        <h4 className="text-xl md:text-3xl font-black text-white leading-tight tracking-tighter">{a.title}</h4>
                      </div>
                      <span className="text-gray-600 font-mono text-[10px] md:text-sm font-bold md:border-l-4 border-gray-800 md:pl-4 h-fit py-2">{a.timestamp}</span>
                    </div>
                    {/* Level 2: 피드 본문 */}
                    <p className="text-gray-400 text-sm md:text-lg font-bold leading-relaxed italic max-w-2xl">"{a.desc}"</p>
                    <div className="pt-6 md:pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                      <button onClick={() => { if (beomToken < 100) return alert("!"); setBeomToken(p => p - 100); setAssets(assets.map(i => i.id === a.id ? { ...i, beomSupport: i.beomSupport + 100 } : i)); }} 
                              className="bg-gradient-to-r from-[#daa520] to-[#b8860b] text-black px-8 py-2.5 md:px-12 md:py-4 rounded-xl font-black text-xs md:text-lg hover:scale-110 active:scale-95 transition-all shadow-lg">
                        {t.supportBtn}
                      </button>
                      <p className="text-[#daa520] font-black text-2xl md:text-5xl tracking-tighter leading-none">
                        {a.beomSupport.toLocaleString()} <span className="text-sm md:text-xl ml-2">BEOM 찬양금</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 8. 자치령 개척 모달 - 비율 정상화 */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/98 backdrop-blur-3xl z-[300] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-[#111] p-8 md:p-12 rounded-[40px] border border-[#daa520]/50 w-full max-w-lg shadow-2xl text-center">
            <h3 className="text-[#daa520] font-black text-2xl md:text-3xl mb-8 uppercase italic leading-none">Proclaim Territory</h3>
            <input type="text" value={createTitle} onChange={(e) => setCreateTitle(e.target.value)} placeholder="영토 이름 (NAME)" className="bg-black p-4 rounded-xl border border-white/10 w-full text-lg md:text-2xl focus:border-[#daa520] outline-none font-black text-center mb-8 text-white uppercase" />
            <div className="flex gap-4">
              <button onClick={() => setShowCreateModal(false)} className="flex-1 py-3 rounded-xl font-black text-sm md:text-lg bg-white/5 uppercase">CANCEL</button>
              <button onClick={() => { if(beomToken<500) return alert("!"); setBeomToken(p=>p-500); setShowCreateModal(false); setCreateTitle(''); alert("개척 완료!"); }} className="flex-1 py-3 rounded-xl font-black text-sm md:text-lg bg-[#daa520] text-black shadow-lg uppercase">PROCLAIM</button>
            </div>
          </div>
        </div>
      )}

      {/* 최종 하단 */}
      <div className="mt-20 opacity-20 text-center w-full pb-10 font-mono tracking-[0.5em] md:tracking-[1em] uppercase text-white/50 text-[8px] md:text-xs">
        Kedheon Empire | Final v35.0 Integrity Master
      </div>
    </div>
  );
}

