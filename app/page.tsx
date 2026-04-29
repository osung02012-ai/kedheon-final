'use client';
import React, { useState, useEffect } from 'react';

// --- [제국 핵심 및 경제 설정 데이터] ---
const PI_INVITE_CODE = 'ohsangjo'; 
const PI_APP_STORE_URL = 'https://apps.apple.com/app/pi-network/id1445472541';
const PI_PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.blockchainvault';

// [경제 시스템 변수] 1 Pi = 100 BEOM
const PI_TO_BEOM_RATIO = 100; 

interface Asset { id: number; title: string; desc: string; category: string; type: 'CREATION' | 'BROADCAST'; beomSupport: number; isPromoted: boolean; timestamp: string; }
interface Good { id: number; name: string; price: number; img: string; seller: string; }

export default function KedheonPortal() {
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

  const [goods] = useState<Good[]>([
    { id: 1, name: "EMPIRE GOLD BADGE (SAMPLE)", price: 1000, img: "/beom-token.png", seller: "예사" },
    { id: 2, name: "KEDHEON T-SHIRT (SAMPLE)", price: 2500, img: "/kedheon-character.png", seller: "예사" }
  ]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createTitle, setCreateTitle] = useState('');

  const cats = ['MUSIC', 'SPORTS', 'ANIME', 'DRAMA', 'MOVIE', 'ESPORTS', 'COMEDY', 'TRAVEL', 'FOOD', 'BEAUTY', 'FASHION', 'TECH'];

  // [수정] 섹션 헤더 크기 하향 조정 (text-xl md:text-2xl)
  const SectionHeader = ({ num, title, desc }: { num: string; title: string; desc: string }) => (
    <div className="w-full border-t-2 border-white/20 pt-8 mb-6 text-left font-black">
      <h3 className="text-[#daa520] text-xl md:text-3xl uppercase border-l-4 border-[#daa520] pl-3 leading-none italic tracking-tighter mb-2">
        {num}. 🌐 {title}
      </h3>
      <p className="text-white/50 text-xs md:text-base pl-4 italic font-bold tracking-tight">{desc}</p>
    </div>
  );

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

  const postContent = () => {
    if(!newTitle.trim()) return alert("제목 필수");
    if(beomToken < 10) return alert("BEOM 토큰이 부족합니다.");
    setAssets([{ id: Date.now(), title: newTitle, desc: newDesc, category, type: postType, beomSupport: 0, isPromoted: false, timestamp: new Date().toLocaleDateString() }, ...assets]);
    setBeomToken(p => p - 10); setNewTitle(''); setNewDesc('');
    alert("피드 등록 성공 (10 BEOM 소모)");
  };

  const supportPost = (id: number) => {
    if (tab === 'ROOKIE') return alert("찬양은 피오니어만 가능합니다.");
    if (beomToken < 100) return alert("BEOM 토큰이 부족합니다.");
    setBeomToken(p => p - 100);
    setAssets(assets.map(a => a.id === id ? { ...a, beomSupport: a.beomSupport + 100 } : a));
  };

  const FeedList = ({ showSupport = true }: { showSupport?: boolean }) => (
    <div className="space-y-6">
      {assets.filter(a => category === 'ALL' || a.category === category).map(a => (
        <div key={a.id} className="bg-[#111] rounded-[30px] border-2 p-6 md:p-10 space-y-4 shadow-xl relative transition-all border-white/20 hover:border-[#daa520]">
          <div className="flex justify-between items-start font-black">
            <div className="space-y-1 text-left">
              <span className="bg-white text-black px-2 py-0.5 rounded-full text-[8px] uppercase font-sans">{a.type}</span>
              <h4 className="text-2xl md:text-4xl text-[#daa520] tracking-tighter uppercase leading-tight">{a.title}</h4>
            </div>
            <span className="text-white/20 font-mono text-[10px]">{a.timestamp}</span>
          </div>
          <p className="text-white text-base md:text-xl font-bold italic text-left leading-snug font-black">"{a.desc}"</p>
          <div className="pt-4 border-t-2 border-white/5 flex justify-between items-center font-black">
            {showSupport ? (
              <button onClick={() => supportPost(a.id)} className="bg-[#daa520] text-black px-6 py-2 rounded-xl text-sm border-2 border-white active:scale-95">👑 찬양 (100)</button>
            ) : (
              <div className="text-white/20 text-[10px]">PIONEER 전용</div>
            )}
            <p className="text-[#daa520] text-2xl md:text-4xl tracking-tighter font-black">{a.beomSupport.toLocaleString()} <span className="text-xs">BEOM</span></p>
          </div>
        </div>
      ))}
    </div>
  );

  if (!hasMounted) return null;

  return (
    <div className="flex flex-col items-center bg-black min-h-screen text-white font-sans w-full pb-20 overflow-x-hidden text-center font-black">
      
      {/* 네비게이션 크기 최적화 */}
      <div className="w-full max-w-4xl flex justify-between items-center p-3 md:p-5 sticky top-0 bg-black/95 backdrop-blur-md z-[150] border-b-2 border-[#daa520]">
        <button onClick={() => setLang(l => l === 'KO' ? 'EN' : 'KO')} className="text-[#daa520] border border-[#daa520] px-3 py-1 rounded-full text-[10px] uppercase font-bold">{lang === 'KO' ? "EN" : "KO"}</button>
        <div className="flex gap-1.5">
          <button onClick={() => setTab('ROOKIE')} className={`px-3 py-1 rounded-md text-[10px] border transition-all ${tab === 'ROOKIE' ? 'bg-[#daa520] text-black border-[#daa520]' : 'bg-black text-white border-white/20'}`}>ROOKIE</button>
          <button onClick={() => setTab('PIONEER')} className={`px-3 py-1 rounded-md text-[10px] border transition-all ${tab === 'PIONEER' ? 'bg-[#daa520] text-black border-[#daa520]' : 'bg-black text-white border-white/20'}`}>PIONEER</button>
        </div>
      </div>

      <div className="w-full max-w-4xl px-4">
        
        {tab === 'ROOKIE' ? (
          <div className="flex flex-col items-center py-10">
            <img src="/kedheon-character.png" className="w-24 h-24 md:w-40 md:h-40 rounded-2xl mb-6 border-2 border-[#daa520]" alt="K" />
            <h1 className="text-3xl md:text-5xl text-[#daa520] italic uppercase mb-2 tracking-tighter">Kedheon Empire</h1>
            <p className="text-white/60 text-sm md:text-lg mb-8 uppercase italic">Join the Web3 Empire</p>
            {!showOnboarding ? (
              <button onClick={() => setShowOnboarding(true)} className="bg-white text-black px-8 py-3 rounded-full text-base border-2 border-[#daa520] active:scale-95 mb-12">시민권 획득 가이드</button>
            ) : (
              <div className="w-full bg-[#111] p-6 rounded-[30px] border-2 border-white/20 space-y-6 mb-12">
                <h2 className="text-[#daa520] text-xl md:text-3xl uppercase italic font-black">Onboarding</h2>
                <div className="space-y-3 text-left text-sm md:text-base font-bold text-white/80">
                  <p>1. Pi 앱 설치 후 추천인 [ <span className="text-[#daa520] underline">{PI_INVITE_CODE}</span> ] 입력</p>
                  <p>2. Pi를 BEOM 토큰으로 환전하여 제국 입장</p>
                </div>
                <div className="flex gap-3"><button onClick={() => window.open(PI_APP_STORE_URL)} className="flex-1 bg-white text-black py-3 rounded-lg text-xs font-black uppercase">App Store</button><button onClick={() => window.open(PI_PLAY_STORE_URL)} className="flex-1 bg-white text-black py-3 rounded-lg text-xs font-black uppercase">Play Store</button></div>
              </div>
            )}
            <SectionHeader num="00" title="LIVE FEED" desc="시민들의 실시간 창작 방송 관찰." />
            <div className="w-full opacity-70 scale-95 pointer-events-none md:pointer-events-auto">
               <FeedList showSupport={false} />
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-8 py-8">
            
            {/* [수정] 자산 대시보드 크기 하향 (text-4xl md:text-7xl) */}
            <div className="bg-[#111] p-6 rounded-[30px] border-2 border-[#daa520] shadow-xl flex flex-col md:flex-row justify-between items-center gap-6">
               <div className="text-center md:text-left flex-1">
                  <h3 className="text-white/40 text-[10px] uppercase tracking-widest mb-1">Imperial Assets</h3>
                  <p className="text-[#daa520] text-4xl md:text-7xl tracking-tighter leading-none font-black">{beomToken.toLocaleString()} BEOM</p>
                  <div className="mt-2 bg-black px-4 py-1 rounded-lg border border-white/20 inline-block text-xs font-mono text-white/60 italic">
                    ≈ {(beomToken / PI_TO_BEOM_RATIO).toFixed(4)} Pi
                  </div>
               </div>
               <div className="flex items-center gap-4"><img src="/kedheon-character.png" className="w-16 h-16 md:w-24 md:h-24 rounded-xl border border-white/20" alt="C" /><img src="/beom-token.png" className="w-14 h-14 md:w-24 md:h-24" alt="T" /></div>
            </div>

            {/* [수정] 제국 선언문 크기 하향 (text-xl md:text-3xl / body text-sm md:text-lg) */}
            <div className="w-full bg-[#111] p-6 md:p-10 rounded-[40px] border-2 border-[#daa520]/50 shadow-lg">
              <h2 className="text-[#daa520] text-xl md:text-4xl uppercase italic mb-5 tracking-tighter font-black">누리고 즐기고 선점하세요</h2>
              <div className="space-y-3 text-white/80 text-sm md:text-xl font-bold leading-relaxed tracking-tight">
                <p>익명 결제와 보안 인증을 <span className="text-[#daa520]">누리고</span>,</p>
                <p>창작물과 실시간 방송을 <span className="text-[#daa520]">즐기며</span>,</p>
                <p>강력한 <span className="text-[#daa520]">팬덤 결집</span>으로 가치를 증폭시키고,</p>
                <p>기여 보상을 남보다 먼저 <span className="text-[#daa520]">선점</span>하십시오.</p>
              </div>
            </div>

            {/* 01. 범 환전 */}
            <div className="flex flex-col w-full">
              <SectionHeader num="01" title="ACQUIRE BEOM" desc="범(BEOM) 토큰을 확보하여 주권을 행사하십시오." />
              <div className="bg-[#111] p-6 rounded-[30px] border-2 border-white/10 shadow-lg grid md:grid-cols-2 gap-6 items-center">
                <div className="text-left"><p className="text-white text-base md:text-2xl uppercase italic leading-tight font-black">파이를 범으로 환전</p>
                <p className="text-white/40 text-[10px] md:text-sm italic font-bold">1 Pi = {PI_TO_BEOM_RATIO} BEOM</p></div>
                <button onClick={() => setBeomToken(p => p + PI_TO_BEOM_RATIO)} className="w-full bg-[#daa520] text-black py-4 rounded-xl text-sm md:text-lg border-2 border-white active:scale-95 uppercase font-black">EXCHANGE NOW</button>
              </div>
            </div>

            {/* 02. 보안 인증 */}
            <div className="flex flex-col w-full">
              <SectionHeader num="02" title="SECURE AUTH" desc="QR 인증을 통해 신분을 증명하고 익명 결제를 이용하십시오." />
              <div className="bg-[#111] p-5 rounded-[30px] border-2 border-white/10 flex flex-col items-center gap-6">
                <div className="flex gap-1.5 w-full max-w-xs bg-black p-1.5 rounded-xl border-2 border-[#daa520]">
                  <button onClick={() => { setQrType('PERSONAL'); setIsQrActive(false); }} className={`flex-1 py-2 rounded-lg text-[10px] font-black transition-all ${qrType === 'PERSONAL' ? 'bg-[#daa520] text-black' : 'text-white/20'}`}>PERSONAL</button>
                  <button onClick={() => { setQrType('BUSINESS'); setIsQrActive(false); }} className={`flex-1 py-2 rounded-lg text-[10px] font-black transition-all ${qrType === 'BUSINESS' ? 'bg-[#daa520] text-black' : 'text-white/20'}`}>BUSINESS</button>
                </div>
                <div className={`p-4 bg-black border-2 rounded-[30px] transition-all flex items-center justify-center ${isQrActive ? 'border-[#daa520] shadow-[0_0_40px_rgba(218,165,32,0.3)]' : 'opacity-10 border-white'}`}>
                  {isQrActive ? (
                    <img src={qrType === 'PERSONAL' ? "/qr-personal.png" : "/qr-business.png"} className="w-48 h-48 md:w-72 md:h-72 rounded-xl" alt="QR" />
                  ) : ( <div className="w-40 h-40 md:w-64 md:h-64 flex items-center justify-center text-white/5 text-xl font-black italic uppercase tracking-widest">Secure</div> )}
                </div>
                <button onClick={() => { setIsQrActive(true); setBeomToken(p => p - 50); }} className="bg-[#daa520] text-black px-8 py-3 rounded-xl text-sm md:text-lg border-2 border-white active:scale-95 uppercase font-black">인증 활성화 (50 BEOM)</button>
              </div>
            </div>

            {/* 03. 허브 */}
            <div className="flex flex-col w-full text-left">
              <SectionHeader num="03" title="CREATIVE HUB" desc="창작물을 제국 전역에 송출하십시오." />
              <div className="w-full bg-[#111] p-5 rounded-[30px] border-2 border-[#daa520]/30 space-y-4 mb-8">
                <div className="flex gap-2"><button onClick={() => setPostType('BROADCAST')} className={`flex-1 py-3 rounded-lg text-xs font-black border transition-all ${postType === 'BROADCAST' ? 'bg-[#daa520] text-black border-white' : 'bg-black text-white/20 border-white/10'}`}>방송</button><button onClick={() => setPostType('CREATION')} className={`flex-1 py-3 rounded-lg text-xs font-black border transition-all ${postType === 'CREATION' ? 'bg-[#daa520] text-black border-white' : 'bg-black text-white/20 border-white/10'}`}>창작</button></div>
                <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="제목 입력" className="bg-black border border-white/20 p-3 rounded-lg w-full text-sm text-white outline-none focus:border-[#daa520] font-black" />
                <textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="상세 내용" className="bg-black border border-white/20 p-3 rounded-lg w-full text-xs text-white/60 h-24 resize-none outline-none focus:border-[#daa520]" />
                <button onClick={postContent} className="w-full py-3.5 rounded-xl bg-[#daa520] text-black text-sm border-2 border-white active:scale-95 uppercase font-black">피드 등록 (10 BEOM)</button>
              </div>
              <div className="grid grid-cols-4 md:grid-cols-6 gap-1.5 mb-6">{cats.map(cat => ( <button key={cat} onClick={() => setCategory(cat)} className={`py-2.5 rounded-lg text-[8px] md:text-[10px] border transition-all font-black ${category === cat ? 'bg-[#daa520] text-black border-[#daa520]' : 'bg-black text-white/20 border-white/10'}`}>{cat}</button> ))}</div>
              <FeedList showSupport={true} />
            </div>

            {/* 04. 굿즈 */}
            <div className="flex flex-col w-full text-left">
              <SectionHeader num="04" title="FANDOM GOODS" desc="제국의 상징물을 소유하십시오." />
              <div className="grid grid-cols-2 gap-4 mb-8">
                {goods.map(g => (
                  <div key={g.id} className="bg-[#111] rounded-[25px] border border-white/20 p-4 shadow-lg flex flex-col items-center gap-3 relative">
                    <div className="absolute top-3 right-3 bg-[#daa520] text-black px-2 py-0.5 rounded-full text-[6px] font-black italic">SAMPLE</div>
                    <img src={g.img} className="w-full h-24 md:h-32 object-contain bg-black rounded-xl" alt="G" />
                    <div className="w-full text-left">
                      <h4 className="text-white font-black text-xs md:text-base uppercase tracking-tighter truncate">{g.name}</h4>
                      <p className="text-[#daa520] text-sm md:text-xl font-black">{g.price.toLocaleString()} <span className="text-[8px]">BEOM</span></p>
                    </div>
                    <button className="w-full py-2 rounded-lg bg-white/5 text-white/30 text-[10px] border border-white/10 uppercase font-black">COMING SOON</button>
                  </div>
                ))}
              </div>
              <button onClick={() => setShowCreateModal(true)} className="w-full py-4 rounded-xl bg-[#daa520] text-black font-black text-base border-2 border-white active:scale-95 uppercase italic">➕ 신규 영토 개설 (500 BEOM)</button>
            </div>
          </div>
        )}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[300] flex items-center justify-center p-4">
          <div className="bg-[#111] p-8 rounded-[30px] border-4 border-[#daa520] w-full max-w-sm text-center font-black">
            <h3 className="text-[#daa520] text-xl mb-6 italic uppercase">New Territory</h3>
            <input type="text" value={createTitle} onChange={(e) => setCreateTitle(e.target.value)} placeholder="명칭 입력" className="bg-black border-2 border-white p-4 rounded-xl w-full text-xl text-center text-white mb-6 outline-none focus:border-[#daa520] font-black" />
            <div className="flex gap-2"><button onClick={() => setShowCreateModal(false)} className="flex-1 py-3 rounded-lg text-xs bg-white/5 border border-white/20 uppercase font-black">Cancel</button><button onClick={() => { setShowCreateModal(false); setCreateTitle(''); alert("개설 완료"); }} className="flex-1 py-3 rounded-lg text-xs bg-[#daa520] text-black border-2 border-white font-black uppercase">Create</button></div>
          </div>
        </div>
      )}

      {/* 푸터 최적화 */}
      <div className="mt-16 opacity-30 text-center w-full pb-8 font-mono text-white text-[8px] tracking-[0.8em] uppercase font-black">KEDHEON EMPIRE | V60.2 MOBILE | ohsangjo</div>
    </div>
  );
}
