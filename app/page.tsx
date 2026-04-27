'use client';
import React, { useState, useEffect } from 'react';

interface Asset { id: number; title: string; desc: string; category: string; beomSupport: number; owner: string; timestamp: string; }

export default function KedheonPortal() {
  const empireCharacterName = 'CHEOREOM_88';

  const [hasMounted, setHasMounted] = useState(false);
  const [lang, setLang] = useState<'KO' | 'EN'>('KO');
  const [tab, setTab] = useState<'ROOKIE' | 'PIONEER'>('PIONEER');
  const [beomToken, setBeomToken] = useState(8141.88);
  const [contributedBeom, setContributedBeom] = useState(0);
  const [qrType, setQrType] = useState<'PERSONAL' | 'BUSINESS'>('PERSONAL');
  const [bizName, setBizName] = useState('');
  const [isQrActive, setIsQrActive] = useState(false);
  const [category, setCategory] = useState('ALL');
  const [assets, setAssets] = useState<Asset[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createTitle, setCreateTitle] = useState('');

  const cats = ['MUSIC', 'SPORTS', 'ANIME', 'DRAMA', 'MOVIE', 'ESPORTS', 'COMEDY', 'TRAVEL', 'FOOD', 'BEAUTY', 'FASHION', 'TECH'];

  const t = lang === 'KO' ? {
    welcomeD: "Kedheon Empire 웹3에 참여하세요",
    authT: "IMPERIAL SECURE AUTH", authD: "보안 신분 인증 및 익명 결제 시스템을 가동합니다.",
    conT: "CONTRIBUTION REWARD", conD: "제국 인프라 기여 보상을 확인하십시오.",
    fanT: "IMPERIAL FANDOM TERRITORY", fanD: "공식 영토 혹은 시민 자치 팬방에 진입하십시오.",
    postBtn: "제국 피드 방송", supportBtn: "👑 찬양", enterBtn: "제국 입국", createBtn: "➕ 팬방 개설"
  } : {
    welcomeD: "Join the Kedheon Empire Web3 Ecosystem",
    authT: "SECURE AUTH", authD: "Activate secure identity and payment system.",
    conT: "REWARD", conD: "Check your infrastructure contribution rewards.",
    fanT: "TERRITORY", fanD: "Enter official or autonomous Fan Rooms.",
    postBtn: "Broadcast", supportBtn: "👑 Praise", enterBtn: "ENTER", createBtn: "➕ Create Fan Room"
  };

  useEffect(() => {
    setHasMounted(true);
    const saved = localStorage.getItem('kedheon_v38_final');
    if (saved) {
      try {
        const p = JSON.parse(saved);
        setBeomToken(p.token || 8141.88); setAssets(p.assets || []); setContributedBeom(p.staked || 0);
      } catch (e) { console.error("Integrity Glitch Fixed"); }
    }
  }, []);

  useEffect(() => {
    if (hasMounted) localStorage.setItem('kedheon_v38_final', JSON.stringify({ token: beomToken, assets, staked: contributedBeom }));
  }, [beomToken, assets, contributedBeom, hasMounted]);

  if (!hasMounted) return null;

  const SectionHeader = ({ num, title, desc, icon }: any) => (
    <div className="w-full flex flex-col items-start gap-2 mb-6 pt-12 border-t-4 border-white animate-in fade-in duration-500">
      <div className="flex items-center gap-3">
        <span className="text-[#daa520] font-black text-3xl md:text-4xl opacity-50 italic select-none">{num}</span>
        <div className="flex items-center gap-3">
          {icon && <span className="text-xl md:text-3xl">{icon}</span>}
          <h3 className="text-[#daa520] font-black text-xl md:text-3xl tracking-widest uppercase border-l-4 border-[#daa520] pl-3 leading-none">{title}</h3>
        </div>
      </div>
      <p className="text-white font-bold text-sm md:text-base pl-1 md:pl-10 max-w-2xl">{desc}</p>
    </div>
  );

  return (
    <div className="flex flex-col items-center bg-black min-h-screen text-white font-sans w-full overflow-x-hidden pb-20">
      
      {/* 1. 상단 글로벌 네비게이션 */}
      <div className="w-full max-w-5xl flex justify-between items-center p-4 md:p-6 sticky top-0 bg-black/95 backdrop-blur-xl z-[150] border-b-4 border-[#daa520] shadow-xl">
        <button onClick={() => setLang(l => l === 'KO' ? 'EN' : 'KO')} className="text-[#daa520] font-black text-[10px] md:text-xs border-2 border-[#daa520] px-4 py-1.5 rounded-full hover:bg-[#daa520] hover:text-black transition-all">
          {lang === 'KO' ? "ENGLISH" : "한국어"}
        </button>
        <div className="flex gap-2 md:gap-4">
          <button onClick={() => setTab('ROOKIE')} className={`px-4 py-1.5 rounded-lg font-black text-[10px] md:text-sm transition-all border-2 ${tab === 'ROOKIE' ? 'bg-[#daa520] text-black border-[#daa520]' : 'bg-[#111] text-white border-white'}`}>ROOKIE</button>
          <button onClick={() => setTab('PIONEER')} className={`px-4 py-1.5 rounded-lg font-black text-[10px] md:text-sm transition-all border-2 ${tab === 'PIONEER' ? 'bg-[#daa520] text-black border-[#daa520]' : 'bg-[#111] text-white border-white'}`}>PIONEER</button>
        </div>
      </div>

      <div className="w-full max-w-5xl flex flex-col gap-12 md:gap-20 px-4 md:px-6 mt-6 md:mt-10">
        
        {tab === 'ROOKIE' ? (
          <div className="flex flex-col items-center text-center py-20 animate-in zoom-in-95 duration-500">
            <img src="/kedheon-character.png" className="w-32 h-32 md:w-56 md:h-56 rounded-3xl object-cover mb-8 shadow-[0_0_30px_rgba(218,165,32,0.3)] border-4 border-[#daa520]" alt="K" />
            <h1 className="text-4xl md:text-6xl font-black text-[#daa520] tracking-widest italic mb-4 leading-none uppercase">Kedheon Empire</h1>
            
            {/* 추가된 웹3 참여 설명문 */}
            <p className="text-white font-black text-lg md:text-2xl mb-10 tracking-tighter border-y-2 border-white/20 py-2 px-6">
              {t.welcomeD}
            </p>

            <button onClick={() => setTab('PIONEER')} className="bg-[#daa520] text-black px-12 py-4 md:px-20 md:py-6 rounded-full font-black text-xl md:text-3xl shadow-2xl border-4 border-white hover:scale-105 active:scale-95 transition-all">
              {t.enterBtn}
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-16 md:gap-24 animate-in slide-in-from-bottom-5 duration-500">
            
            {/* 대시보드 - 경계선 강화 */}
            <div className="bg-[#111] p-6 md:p-10 rounded-3xl md:rounded-[40px] border-4 border-[#daa520] shadow-2xl flex flex-col md:flex-row justify-between items-center gap-8 relative">
               <div className="flex flex-col items-center md:items-start gap-3 md:gap-5 z-10 text-center md:text-left flex-1">
                  <h3 className="text-white/70 text-[10px] md:text-sm uppercase font-black tracking-tighter">제국 자산 잔액 | Lv. 88</h3>
                  <p className="text-[#daa520] font-black text-4xl md:text-5xl lg:text-6xl leading-none tracking-tighter">{beomToken.toLocaleString()} BEOM</p>
                  <div className="bg-black/80 px-4 py-2 md:px-6 md:py-3 rounded-xl border-2 border-white text-sm md:text-xl font-mono text-white italic">≈ 25.9164 Pi</div>
               </div>
               <div className="flex items-center gap-4 md:gap-6 z-10 flex-shrink-0">
                  <img src="/kedheon-character.png" className="w-16 h-16 md:w-32 md:h-32 rounded-2xl md:rounded-3xl object-cover border-2 border-white shadow-xl" alt="Char" />
                  <div className="flex flex-col items-center gap-2">
                    <img src="/beom-token.png" className="w-20 h-20 md:w-32 md:h-32 object-contain" alt="Token" />
                    <p className="bg-[#daa520] text-black px-4 py-1 rounded-full font-black text-[10px] md:text-sm italic border-2 border-white">KEDHEON.PI</p>
                  </div>
               </div>
            </div>

            {/* 보안 신분 인증 - QR 영역 유지 */}
            <div className="flex flex-col w-full">
              <SectionHeader num="01" title={t.authT} desc={t.authD} />
              <div className="w-full bg-[#111] p-6 md:p-10 rounded-3xl flex flex-col items-center gap-6 md:gap-8 border-4 border-white/40">
                <div className="flex gap-2 md:gap-4 bg-black p-1.5 md:p-3 rounded-xl w-full max-w-md font-black border-2 border-[#daa520]">
                  <button onClick={() => {setQrType('PERSONAL'); setIsQrActive(false);}} className={`flex-1 py-2 md:py-3 rounded-lg text-[10px] md:text-sm transition-all ${qrType === 'PERSONAL' ? 'bg-[#daa520] text-black' : 'text-white/60'}`}>개인인증</button>
                  <button onClick={() => {setQrType('BUSINESS'); setIsQrActive(false);}} className={`flex-1 py-2 md:py-3 rounded-lg text-[10px] md:text-sm transition-all ${qrType === 'BUSINESS' ? 'bg-[#daa520] text-black' : 'text-white/60'}`}>기업인증</button>
                </div>

                {qrType === 'BUSINESS' && (
                  <input type="text" value={bizName} onChange={(e) => setBizName(e.target.value)} placeholder="ENTER BUSINESS NAME (기업명)" className="w-full max-w-md bg-black border-4 border-[#daa520] p-4 rounded-xl text-center font-black text-[#daa520] outline-none text-lg" />
                )}

                <div className={`p-6 md:p-10 rounded-3xl bg-black border-4 transition-all shadow-2xl ${isQrActive ? 'border-[#daa520]' : 'opacity-20 border-white'}`}>
                  {isQrActive ? (
                    <img src={qrType === 'PERSONAL' ? "/qr-personal.png" : "/qr-business.png"} 
                         onError={(e:any) => { e.target.src = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=KEDHEON_${qrType}_${bizName || 'SECURE'}`; }} 
                         className="w-48 h-48 md:w-80 md:h-80 rounded-xl" alt="QR" />
                  ) : (
                    <div className="w-48 h-48 md:w-80 md:h-80 flex items-center justify-center text-white/20 text-3xl md:text-5xl font-black italic uppercase">Secure Auth</div>
                  )}
                </div>
                <button onClick={() => {setBeomToken(p => p-50); setIsQrActive(true);}} className="bg-[#daa520] text-black px-10 py-4 md:px-16 md:py-5 rounded-xl font-black text-md md:text-xl shadow-lg border-4 border-white active:scale-95 transition-all">
                  {isQrActive ? "인증 활성화 중" : "인증 시작 (50 BEOM)"}
                </button>
              </div>
            </div>

            {/* 기여 보상 엔진 */}
            <div className="flex flex-col w-full">
              <SectionHeader num="02" title={t.conT} desc={t.conD} />
              <div className="w-full bg-[#111] p-8 md:p-12 rounded-3xl flex flex-col items-center gap-6 shadow-xl border-4 border-white">
                 <p className="text-[#daa520] font-black text-[10px] md:text-sm uppercase tracking-widest">STAKED LOYALTY</p>
                 <p className="text-white font-black text-4xl md:text-6xl tracking-tighter leading-none">{contributedBeom.toLocaleString()} <span className="text-lg md:text-3xl text-[#daa520]">BEOM</span></p>
                 <button onClick={() => {setBeomToken(p => p-1000); setContributedBeom(p => p+1000);}} className="bg-[#daa520] text-black px-10 py-3 md:px-16 md:py-4 rounded-xl font-black text-sm md:text-lg shadow-lg border-2 border-white active:scale-95 transition-all uppercase">Execute Stake</button>
              </div>
            </div>

            {/* 팬방 및 방송 */}
            <div className="flex flex-col items-start w-full">
              <SectionHeader num="03" title={t.fanT} desc={t.fanD} icon="🌐" />
              <div className="grid grid-cols-4 md:grid-cols-6 gap-2 md:gap-4 w-full mb-8 md:mb-12">
                {cats.map(cat => (
                  <button key={cat} onClick={() => setCategory(cat)} className={`py-3 md:py-5 rounded-xl font-black text-[8px] md:text-xs tracking-widest border-2 transition-all ${category === cat ? 'bg-[#daa520] text-black border-[#daa520]' : 'bg-[#111] text-white border-white/40'}`}>{cat}</button>
                ))}
              </div>

              {/* 방송 등록 카드 */}
              <div className="w-full bg-[#111] p-6 md:p-8 rounded-3xl border-4 border-[#daa520] space-y-4 text-left mb-12 shadow-xl">
                <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="TITLE" className="bg-black p-3 md:p-4 rounded-xl border-2 border-white w-full text-sm md:text-lg outline-none focus:border-[#daa520] font-black text-white" />
                <textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="DETAILS" className="bg-black p-3 md:p-4 rounded-xl border-2 border-white w-full text-xs md:text-sm h-24 outline-none focus:border-[#daa520] resize-none text-white font-bold" />
                <button onClick={() => { if(!newTitle.trim()) return alert("제목!"); setAssets([{id: Date.now(), title: newTitle, desc: newDesc, category, beomSupport: 0, owner: empireCharacterName, timestamp: new Date().toLocaleDateString()}, ...assets]); setBeomToken(p=>p-10); setNewTitle(''); setNewDesc(''); }} className="w-full py-3 md:py-4 rounded-xl font-black text-sm md:text-lg bg-[#daa520] text-black shadow-md border-2 border-white active:scale-95 transition-all uppercase">
                  {t.postBtn} (10 BEOM)
                </button>
              </div>

              {/* 피드 리스트 */}
              <div className="w-full space-y-12">
                <div className="flex flex-col md:flex-row gap-3 w-full mb-6">
                  <button onClick={() => setCategory('ALL')} className={`flex-[2] py-3 md:py-4 rounded-xl font-black text-sm md:text-lg border-4 transition-all ${category === 'ALL' ? 'border-[#daa520] text-[#daa520] bg-[#daa520]/10' : 'border-white text-white/60'}`}>전체 피드 입장</button>
                  <button onClick={() => setShowCreateModal(true)} className="flex-1 py-3 md:py-4 rounded-xl bg-white/10 border-4 border-white text-white font-black text-xs md:text-sm italic hover:bg-white/20 transition-all">{t.createBtn}</button>
                </div>
                {assets.filter(a => category === 'ALL' || a.category === category).map(a => (
                  <div key={a.id} className="bg-[#111] rounded-[30px] border-4 border-white shadow-xl p-6 md:p-10 space-y-6 text-left relative animate-in slide-in-from-bottom-5 duration-500">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                      <div className="space-y-2">
                        <p className="text-[#daa520] font-black text-[10px] md:text-xs tracking-widest uppercase">[{a.category}]</p>
                        <h4 className="text-xl md:text-3xl font-black text-white leading-tight tracking-tighter">{a.title}</h4>
                      </div>
                      <span className="text-white font-mono text-[10px] md:text-sm font-bold border-l-4 border-[#daa520] pl-4 h-fit py-2">{a.timestamp}</span>
                    </div>
                    <p className="text-white/90 text-sm md:text-lg font-bold leading-relaxed italic">"{a.desc}"</p>
                    <div className="pt-6 border-t-2 border-white/20 flex flex-col md:flex-row justify-between items-center gap-6">
                      <button onClick={() => { if (beomToken < 100) return alert("!"); setBeomToken(p => p - 100); setAssets(assets.map(i => i.id === a.id ? { ...i, beomSupport: i.beomSupport + 100 } : i)); }} 
                              className="bg-[#daa520] text-black px-8 py-2.5 md:px-12 md:py-4 rounded-xl font-black text-xs md:text-lg border-2 border-white hover:scale-110 active:scale-95 transition-all shadow-lg">
                        {t.supportBtn}
                      </button>
                      <p className="text-[#daa520] font-black text-2xl md:text-5xl tracking-tighter">
                        {a.beomSupport.toLocaleString()} <span className="text-sm md:text-xl ml-2 text-white/60">BEOM 찬양금</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 팬방 개설 모달 */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/98 backdrop-blur-3xl z-[300] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-[#111] p-8 md:p-12 rounded-[40px] border-4 border-[#daa520] w-full max-w-lg shadow-2xl text-center">
            <h3 className="text-[#daa520] font-black text-2xl md:text-3xl mb-8 uppercase italic leading-none">Create Fan Room</h3>
            <input type="text" value={createTitle} onChange={(e) => setCreateTitle(e.target.value)} placeholder="팬방 이름 (NAME)" className="bg-black p-4 rounded-xl border-4 border-white w-full text-lg md:text-2xl focus:border-[#daa520] outline-none font-black text-center mb-8 text-white uppercase" />
            <div className="flex gap-4">
              <button onClick={() => setShowCreateModal(false)} className="flex-1 py-4 rounded-xl font-black text-sm md:text-lg bg-white/10 border-2 border-white uppercase">CANCEL</button>
              <button onClick={() => { if(beomToken<500) return alert("!"); setBeomToken(p=>p-500); setShowCreateModal(false); setCreateTitle(''); alert("팬방 개설 완료!"); }} className="flex-1 py-4 rounded-xl font-black text-sm md:text-lg bg-[#daa520] text-black shadow-lg border-2 border-white uppercase">CREATE</button>
            </div>
            <p className="mt-4 text-[#daa520] font-black text-xs">COST: 500 BEOM</p>
          </div>
        </div>
      )}

      <div className="mt-20 opacity-30 text-center w-full pb-10 font-mono tracking-[0.5em] md:tracking-[1em] uppercase text-white text-[8px] md:text-xs">
        Kedheon Empire | Final v38.0 Integrity Master
      </div>
    </div>
  );
}
