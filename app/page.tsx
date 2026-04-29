'use client';
import React, { useState, useEffect } from 'react';

// --- [1. 제국 중앙 설정 및 경제 데이터] ---
const PI_INVITE_CODE = 'ohsangjo'; 
const PI_APP_STORE_URL = 'https://apps.apple.com/app/pi-network/id1445472541';
const PI_PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.blockchainvault';

/**
 * [경제 시스템 변수]
 * 100: 표준(100:1) | 파이 가치에 따라 이 숫자만 수정하면 전체 앱에 연동됩니다.
 */
const PI_TO_BEOM_RATIO = 100; 

/**
 * [서비스 비용 가이드라인 (Pi 기준)]
 * 파이의 실질적 가치에 맞춰 이 원가를 수정하면 BEOM 소모량이 자동 계산됩니다.
 */
const COSTS_PI = {
  POST_FEED: 0.1,         // 피드 등록 원가
  SUPPORT: 1.0,           // 찬양/후원 원가
  QR_AUTH: 0.5,           // QR 보안 인증 원가
  CREATE_TERRITORY: 5.0   // 신규 영토 개설 원가
};

// [자동 계산된 BEOM 소모량]
const COSTS_BEOM = {
  POST_FEED: COSTS_PI.POST_FEED * PI_TO_BEOM_RATIO,
  SUPPORT: COSTS_PI.SUPPORT * PI_TO_BEOM_RATIO,
  QR_AUTH: COSTS_PI.QR_AUTH * PI_TO_BEOM_RATIO,
  CREATE_TERRITORY: COSTS_PI.CREATE_TERRITORY * PI_TO_BEOM_RATIO
};

interface Asset { id: number; title: string; desc: string; category: string; type: 'CREATION' | 'BROADCAST'; beomSupport: number; isPromoted: boolean; timestamp: string; }
interface Good { id: number; name: string; price: number; img: string; seller: string; }

export default function KedheonPortal() {
  // --- [2. 상태 관리 (State)] ---
  const [hasMounted, setHasMounted] = useState(false);
  const [lang, setLang] = useState<'KO' | 'EN'>('KO');
  const [tab, setTab] = useState<'ROOKIE' | 'PIONEER'>('PIONEER');
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  const [beomToken, setBeomToken] = useState(7991.88); 
  const [qrType, setQrType] = useState<'PERSONAL' | 'BUSINESS'>('PERSONAL');
  const [bizName, setBizName] = useState('');
  const [isQrActive, setIsQrActive] = useState(false);
  const [category, setCategory] = useState('ALL');
  const [postType, setPostType] = useState<'CREATION' | 'BROADCAST'>('BROADCAST');
  
  const [assets, setAssets] = useState<Asset[]>([]); 
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createTitle, setCreateTitle] = useState('');

  const [goods] = useState<Good[]>([
    { id: 1, name: "EMPIRE GOLD BADGE (SAMPLE)", price: 10 * PI_TO_BEOM_RATIO, img: "/beom-token.png", seller: "예사" },
    { id: 2, name: "KEDHEON T-SHIRT (SAMPLE)", price: 25 * PI_TO_BEOM_RATIO, img: "/kedheon-character.png", seller: "예사" }
  ]);

  const cats = ['MUSIC', 'SPORTS', 'ANIME', 'DRAMA', 'MOVIE', 'ESPORTS', 'COMEDY', 'TRAVEL', 'FOOD', 'BEAUTY', 'FASHION', 'TECH'];

  // --- [3. 라이프사이클 및 데이터 복구] ---
  useEffect(() => {
    setHasMounted(true);
    const saved = localStorage.getItem('kedheon_v60_master');
    if (saved) {
      try {
        const p = JSON.parse(saved);
        setBeomToken(p.token || 7991.88);
        if (Array.isArray(p.assets)) setAssets(p.assets);
      } catch (e) { console.error("Restore Error"); }
    }
  }, []);

  useEffect(() => {
    if (hasMounted) {
      localStorage.setItem('kedheon_v60_master', JSON.stringify({ token: beomToken, assets }));
    }
  }, [beomToken, assets, hasMounted]);

  // --- [4. 비즈니스 로직 (Handlers)] ---
  const postContent = () => {
    if(!newTitle.trim()) return alert("제목을 입력하십시오.");
    if(beomToken < COSTS_BEOM.POST_FEED) return alert(`BEOM 부족 (${COSTS_BEOM.POST_FEED} 필요)`);
    setAssets([{ id: Date.now(), title: newTitle, desc: newDesc, category, type: postType, beomSupport: 0, isPromoted: false, timestamp: new Date().toLocaleDateString() }, ...assets]);
    setBeomToken(p => p - COSTS_BEOM.POST_FEED); setNewTitle(''); setNewDesc('');
    alert(`피드 등록 성공 (${COSTS_BEOM.POST_FEED} BEOM 소모)`);
  };

  const supportPost = (id: number) => {
    if (tab === 'ROOKIE') return alert("PIONEER 전용 기능입니다.");
    if (beomToken < COSTS_BEOM.SUPPORT) return alert(`BEOM 부족 (${COSTS_BEOM.SUPPORT} 필요)`);
    setBeomToken(p => p - COSTS_BEOM.SUPPORT);
    setAssets(assets.map(a => a.id === id ? { ...a, beomSupport: a.beomSupport + COSTS_BEOM.SUPPORT } : a));
  };

  const activateQr = () => {
    if (beomToken < COSTS_BEOM.QR_AUTH) return alert(`BEOM 부족 (${COSTS_BEOM.QR_AUTH} 필요)`);
    setBeomToken(p => p - COSTS_BEOM.QR_AUTH);
    setIsQrActive(true);
  };

  // --- [5. 서브 컴포넌트 (Renderers)] ---
  const SectionHeader = ({ num, title, desc }: { num: string; title: string; desc: string }) => (
    <div className="w-full border-t-2 border-white/20 pt-8 mb-6 text-left font-black">
      <h3 className="text-[#daa520] text-xl md:text-3xl uppercase border-l-4 border-[#daa520] pl-3 leading-none italic tracking-tighter mb-2 font-sans">
        {num}. 🌐 {title}
      </h3>
      <p className="text-white/50 text-xs md:text-base pl-4 italic font-bold tracking-tight">{desc}</p>
    </div>
  );

  const FeedList = ({ showSupport = true }: { showSupport?: boolean }) => (
    <div className="space-y-6 w-full">
      {assets.filter(a => category === 'ALL' || a.category === category).map(a => (
        <div key={a.id} className="bg-[#111] rounded-[30px] border-2 p-6 space-y-4 shadow-xl relative border-white/10 hover:border-[#daa520] transition-all text-left">
          <div className="flex justify-between items-start font-black">
            <div className="space-y-1"><span className="bg-white text-black px-2 py-0.5 rounded-full text-[8px] uppercase">{a.type}</span><h4 className="text-2xl text-[#daa520] tracking-tighter uppercase leading-tight font-sans">{a.title}</h4></div>
            <span className="text-white/20 font-mono text-[10px]">{a.timestamp}</span>
          </div>
          <p className="text-white/90 text-sm md:text-lg font-bold italic leading-snug font-black font-sans">"{a.desc}"</p>
          <div className="pt-4 border-t-2 border-white/5 flex justify-between items-center">
            {showSupport ? (
              <button onClick={() => supportPost(a.id)} className="bg-[#daa520] text-black px-6 py-2 rounded-xl text-xs border-2 border-white active:scale-95 font-black uppercase">👑 Praise ({COSTS_BEOM.SUPPORT})</button>
            ) : <div className="text-white/20 text-[10px] font-sans">PIONEER ONLY</div>}
            <p className="text-[#daa520] text-2xl md:text-4xl tracking-tighter font-black font-sans">{a.beomSupport.toLocaleString()} <span className="text-[10px]">BEOM</span></p>
          </div>
        </div>
      ))}
      {assets.length === 0 && <p className="text-white/20 py-10 italic font-sans text-center">송출 중인 방송이 없습니다.</p>}
    </div>
  );

  if (!hasMounted) return null;

  return (
    <div className="flex flex-col items-center bg-black min-h-screen text-white font-sans w-full pb-32 overflow-x-hidden text-center font-black">
      
      {/* 글로벌 네비게이션 */}
      <div className="w-full max-w-4xl flex justify-between items-center p-3 md:p-5 sticky top-0 bg-black/95 backdrop-blur-md z-[150] border-b-2 border-[#daa520]">
        <button onClick={() => setLang(l => l === 'KO' ? 'EN' : 'KO')} className="text-[#daa520] border border-[#daa520] px-3 py-1 rounded-full text-[10px] uppercase font-bold">{lang === 'KO' ? "EN" : "KO"}</button>
        <div className="flex gap-1.5 font-sans">
          <button onClick={() => setTab('ROOKIE')} className={`px-3 py-1 rounded-md text-[10px] border transition-all ${tab === 'ROOKIE' ? 'bg-[#daa520] text-black border-[#daa520]' : 'bg-black text-white border-white/20'}`}>ROOKIE</button>
          <button onClick={() => setTab('PIONEER')} className={`px-3 py-1 rounded-md text-[10px] border transition-all ${tab === 'PIONEER' ? 'bg-[#daa520] text-black border-[#daa520]' : 'bg-black text-white border-white/20'}`}>PIONEER</button>
        </div>
      </div>

      <div className="w-full max-w-4xl px-4">
        {tab === 'ROOKIE' ? (
          <div className="flex flex-col items-center py-10 animate-in fade-in duration-500">
            <img src="/kedheon-character.png" className="w-24 h-24 md:w-40 md:h-40 rounded-2xl mb-6 border-2 border-[#daa520]" alt="K" />
            <h1 className="text-3xl md:text-5xl text-[#daa520] italic uppercase mb-2 tracking-tighter font-sans">Kedheon Empire</h1>
            <p className="text-white/40 text-sm md:text-lg mb-8 uppercase italic font-bold">Join the Integration</p>
            {!showOnboarding ? <button onClick={() => setShowOnboarding(true)} className="bg-white text-black px-8 py-3 rounded-full text-base border-2 border-[#daa520] active:scale-95 mb-12 uppercase font-black">시민권 획득 가이드</button>
            : (
              <div className="w-full bg-[#111] p-6 rounded-[30px] border-2 border-white/20 space-y-6 mb-12">
                <h2 className="text-[#daa520] text-xl md:text-3xl uppercase italic font-black">Onboarding</h2>
                <div className="space-y-3 text-left text-sm md:text-base font-bold text-white/80 font-sans">
                  <p>1. Pi 앱 설치 후 추천인 [ <span className="text-[#daa520] underline font-sans">{PI_INVITE_CODE}</span> ] 입력</p>
                  <p>2. Pi를 BEOM 토큰으로 환전하여 제국 입장</p>
                </div>
                <div className="flex gap-3"><button onClick={() => window.open(PI_APP_STORE_URL)} className="flex-1 bg-white text-black py-3 rounded-lg text-xs font-black uppercase font-sans">App Store</button><button onClick={() => window.open(PI_PLAY_STORE_URL)} className="flex-1 bg-white text-black py-3 rounded-lg text-xs font-black uppercase font-sans">Play Store</button></div>
              </div>
            )}
            <SectionHeader num="00" title="LIVE FEED" desc="제국 시민들의 실시간 방송 관찰." />
            <div className="w-full opacity-50 scale-95 pointer-events-none"><FeedList showSupport={false} /></div>
          </div>
        ) : (
          <div className="flex flex-col gap-8 py-8 animate-in slide-in-from-bottom-5">
            {/* 자산 대시보드 */}
            <div className="bg-[#111] p-6 rounded-[30px] border-2 border-[#daa520] shadow-xl flex flex-col md:flex-row justify-between items-center gap-6">
               <div className="text-center md:text-left flex-1 font-black">
                  <h3 className="text-white/40 text-[10px] uppercase mb-1 font-sans tracking-widest">Imperial Assets</h3>
                  <p className="text-[#daa520] text-4xl md:text-7xl tracking-tighter leading-none font-black font-sans">{beomToken.toLocaleString()} BEOM</p>
                  <div className="mt-2 bg-black px-4 py-1 rounded-lg border border-white/20 inline-block text-[10px] font-mono text-white/60 italic">
                    ≈ {(beomToken / PI_TO_BEOM_RATIO).toFixed(4)} Pi (Rate 1:{PI_TO_BEOM_RATIO})
                  </div>
               </div>
               <div className="flex items-center gap-4"><img src="/kedheon-character.png" className="w-16 h-16 md:w-24 md:h-24 rounded-xl border border-white/20 shadow-lg" alt="C" /><img src="/beom-token.png" className="w-14 h-14 md:w-24 md:h-24" alt="T" /></div>
            </div>

            {/* 제국 선언문 */}
            <div className="w-full bg-[#111] p-6 md:p-10 rounded-[40px] border-2 border-[#daa520]/50 shadow-lg font-sans">
              <h2 className="text-[#daa520] text-xl md:text-4xl uppercase italic mb-5 tracking-tighter font-black">누리고 즐기고 선점하세요</h2>
              <div className="space-y-3 text-white/80 text-sm md:text-xl font-bold leading-relaxed tracking-tight">
                <p>익명 결제와 보안 인증을 <span className="text-[#daa520]">누리고</span>, 창작물과 실시간 방송을 <span className="text-[#daa520]">즐기며</span>, 강력한 <span className="text-[#daa520]">팬덤 결집</span>으로 보상을 <span className="text-[#daa520]">선점</span>하십시오.</p>
              </div>
            </div>

            {/* 01. 환전 (비율 연동) */}
            <div className="flex flex-col w-full">
              <SectionHeader num="01" title="ACQUIRE BEOM" desc="통합 비율에 따른 토큰 확보." />
              <div className="bg-[#111] p-6 rounded-[30px] border-2 border-white/10 shadow-lg grid md:grid-cols-2 gap-6 items-center">
                <div className="text-left font-black font-sans"><p className="text-white text-base md:text-2xl uppercase italic font-sans">파이를 범으로 환전</p><p className="text-[#daa520] text-[10px] italic">1 Pi = {PI_TO_BEOM_RATIO} BEOM</p></div>
                <button onClick={() => setBeomToken(p => p + PI_TO_BEOM_RATIO)} className="w-full bg-[#daa520] text-black py-4 rounded-xl text-sm md:text-lg border-2 border-white active:scale-95 uppercase font-black font-sans">EXCHANGE 1 PI</button>
              </div>
            </div>

            {/* 02. 인증 (비용 자동 계산) */}
            <div className="flex flex-col w-full">
              <SectionHeader num="02" title="SECURE AUTH" desc="제국 공인 QR 인증 시스템." />
              <div className="bg-[#111] p-5 rounded-[30px] border-2 border-white/10 flex flex-col items-center gap-6">
                <div className="flex gap-1.5 w-full max-w-xs bg-black p-1.5 rounded-xl border-2 border-[#daa520]">
                  <button onClick={() => { setQrType('PERSONAL'); setIsQrActive(false); }} className={`flex-1 py-2 rounded-lg text-[10px] font-black transition-all ${qrType === 'PERSONAL' ? 'bg-[#daa520] text-black' : 'text-white/20'}`}>PERSONAL</button>
                  <button onClick={() => { setQrType('BUSINESS'); setIsQrActive(false); }} className={`flex-1 py-2 rounded-lg text-[10px] font-black transition-all ${qrType === 'BUSINESS' ? 'bg-[#daa520] text-black' : 'text-white/20'}`}>BUSINESS</button>
                </div>
                {qrType === 'BUSINESS' && <input type="text" value={bizName} onChange={(e) => setBizName(e.target.value)} placeholder="ENTER BUSINESS NAME" className="w-full max-w-xs bg-black border-2 border-[#daa520] p-3 rounded-lg text-center text-[#daa520] text-sm outline-none font-black font-sans" />}
                <div className={`p-4 bg-black border-2 rounded-[30px] transition-all flex items-center justify-center ${isQrActive ? 'border-[#daa520] shadow-[0_0_40px_rgba(218,165,32,0.3)]' : 'opacity-10 border-white'}`}>
                  {isQrActive ? <div className="w-40 h-40 bg-[#daa520]/10 rounded-xl flex items-center justify-center text-[#daa520] text-[10px] font-sans">QR ACTIVE</div> : <div className="w-40 h-40 flex items-center justify-center text-white/5 text-xl italic uppercase font-sans">Secure</div>}
                </div>
                <button onClick={activateQr} className="bg-[#daa520] text-black px-8 py-3 rounded-xl text-sm md:text-lg border-2 border-white active:scale-95 uppercase font-black font-sans">인증 활성화 ({COSTS_BEOM.QR_AUTH} BEOM)</button>
              </div>
            </div>

            {/* 03. 창작 허브 (비용 자동 계산) */}
            <div className="flex flex-col w-full text-left">
              <SectionHeader num="03" title="CREATIVE HUB" desc="제국 통합 피드 송출." />
              <div className="w-full bg-[#111] p-5 rounded-[30px] border-2 border-[#daa520]/30 space-y-4 mb-8 shadow-lg font-sans">
                <div className="flex gap-2"><button onClick={() => setPostType('BROADCAST')} className={`flex-1 py-3 rounded-lg text-xs font-black border transition-all ${postType === 'BROADCAST' ? 'bg-[#daa520] text-black border-white shadow-md' : 'bg-black text-white/20 border-white/10'}`}>방송</button><button onClick={() => setPostType('CREATION')} className={`flex-1 py-3 rounded-lg text-xs font-black border transition-all ${postType === 'CREATION' ? 'bg-[#daa520] text-black border-white shadow-md' : 'bg-black text-white/20 border-white/10'}`}>창작</button></div>
                <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="제목 입력" className="bg-black border border-white/20 p-3 rounded-lg w-full text-sm text-white outline-none focus:border-[#daa520] font-black font-sans" />
                <textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="상세 내용" className="bg-black border border-white/20 p-3 rounded-lg w-full text-xs text-white/60 h-24 resize-none outline-none focus:border-[#daa520] font-bold" />
                <button onClick={postContent} className="w-full py-3.5 rounded-xl bg-[#daa520] text-black text-sm border-2 border-white active:scale-95 uppercase font-black font-sans">피드 등록 ({COSTS_BEOM.POST_FEED} BEOM)</button>
              </div>
              <div className="grid grid-cols-4 md:grid-cols-6 gap-1.5 mb-6 font-sans">{cats.map(cat => ( <button key={cat} onClick={() => setCategory(cat)} className={`py-2.5 rounded-lg text-[8px] md:text-[10px] border transition-all font-black font-sans ${category === cat ? 'bg-[#daa520] text-black border-[#daa520]' : 'bg-black text-white/20 border-white/10'}`}>{cat}</button> ))}</div>
              <FeedList />
            </div>

            {/* 04. 굿즈 및 영토 */}
            <div className="flex flex-col w-full text-left">
              <SectionHeader num="04" title="IMPERIAL ASSETS" desc="전략적 자산 소유." />
              <div className="grid grid-cols-2 gap-4 mb-8">
                {goods.map(g => (
                  <div key={g.id} className="bg-[#111] rounded-[25px] border border-white/20 p-4 shadow-lg flex flex-col items-center gap-3 relative font-black font-sans">
                    <div className="absolute top-3 right-3 bg-[#daa520] text-black px-2 py-0.5 rounded-full text-[6px] italic font-sans border border-white">SAMPLE</div>
                    <img src={g.img} className="w-full h-24 md:h-32 object-contain bg-black rounded-xl border border-white/5" alt="G" />
                    <div className="w-full text-left">
                      <h4 className="text-white text-xs md:text-base uppercase tracking-tighter truncate font-sans">{g.name}</h4>
                      <p className="text-[#daa520] text-sm md:text-xl font-sans">{g.price.toLocaleString()} <span className="text-[8px]">BEOM</span></p>
                    </div>
                    <button className="w-full py-2 rounded-lg bg-white/5 text-white/30 text-[10px] border border-white/10 uppercase font-black font-sans">COMING SOON</button>
                  </div>
                ))}
              </div>
              <button onClick={() => setShowCreateModal(true)} className="w-full py-4 rounded-xl bg-[#daa520] text-black font-black text-base border-2 border-white shadow-lg active:scale-95 uppercase italic font-black font-sans">➕ 신규 영토 개설 ({COSTS_BEOM.CREATE_TERRITORY} BEOM)</button>
            </div>
          </div>
        )}
      </div>

      {/* 앱 스위처 (통합 네비게이션) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black/95 border-2 border-[#daa520] p-1.5 rounded-2xl flex gap-3 z-[200] shadow-[0_0_50px_rgba(218,165,32,0.4)] backdrop-blur-xl animate-in slide-in-from-bottom-10">
        {['KEDHEON', 'CIVIL', 'NEXUS', 'VENDOR'].map(app => (
          <button key={app} className={`px-3 py-1.5 rounded-xl text-[9px] font-black transition-all font-sans ${app === 'KEDHEON' ? 'bg-[#daa520] text-black' : 'text-white/40 hover:text-white'}`}>{app}</button>
        ))}
      </div>

      {/* 모달: 영토 개설 */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[300] flex items-center justify-center p-4 animate-in zoom-in-95">
          <div className="bg-[#111] p-8 rounded-[30px] border-4 border-[#daa520] w-full max-w-sm text-center font-black">
            <h3 className="text-[#daa520] text-xl mb-6 italic uppercase font-sans">New Territory</h3>
            <input type="text" value={createTitle} onChange={(e) => setCreateTitle(e.target.value)} placeholder="명칭 입력" className="bg-black border-2 border-white p-4 rounded-xl w-full text-xl text-center text-white mb-6 outline-none focus:border-[#daa520] font-black font-sans" />
            <div className="flex gap-2 font-sans"><button onClick={() => setShowCreateModal(false)} className="flex-1 py-3 rounded-lg text-xs bg-white/5 border border-white/20 uppercase font-black font-sans">Cancel</button><button onClick={() => { setShowCreateModal(false); setBeomToken(p => p - COSTS_BEOM.CREATE_TERRITORY); setCreateTitle(''); alert("개설 완료"); }} className="flex-1 py-3 rounded-lg text-xs bg-[#daa520] text-black border-2 border-white font-black uppercase font-sans">Create</button></div>
          </div>
        </div>
      )}

      {/* 최종 푸터 */}
      <div className="mt-20 opacity-30 text-center w-full pb-10 font-mono text-white text-[8px] tracking-[0.8em] uppercase font-black">KEDHEON EMPIRE | V60.5 ABSOLUTE MASTER | ohsangjo</div>
    </div>
  );
}
