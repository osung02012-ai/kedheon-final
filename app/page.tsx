'use client';
import React, { useState, useEffect } from 'react';

// --- [제국 핵심 및 경제 설정 데이터] ---
const PI_INVITE_CODE = 'ohsangjo'; 
const PI_APP_STORE_URL = 'https://apps.apple.com/app/pi-network/id1445472541';
const PI_PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.blockchainvault';

// [경제 시스템 변수] - 이 숫자만 수정하면 모든 계산이 연동됩니다.
const PI_TO_BEOM_RATIO = 100; 

interface Asset { id: number; title: string; desc: string; category: string; type: 'CREATION' | 'BROADCAST'; beomSupport: number; isPromoted: boolean; timestamp: string; }
interface Good { id: number; name: string; price: number; img: string; seller: string; }

export default function KedheonPortal() {
  const [hasMounted, setHasMounted] = useState(false);
  const [lang, setLang] = useState<'KO' | 'EN'>('KO');
  const [tab, setTab] = useState<'ROOKIE' | 'PIONEER'>('PIONEER');
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  // 초기 자산 설정
  const [beomToken, setBeomToken] = useState(8000.00); 
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

  const SectionHeader = ({ num, title, desc }: { num: string; title: string; desc: string }) => (
    <div className="w-full border-t-4 border-white pt-10 mb-8 text-left font-black">
      <h3 className="text-[#daa520] text-2xl md:text-4xl uppercase border-l-8 border-[#daa520] pl-4 leading-none italic tracking-tighter mb-2">
        {num}. 🌐 {title}
      </h3>
      <p className="text-white/60 text-sm md:text-lg pl-6 italic font-bold tracking-tight">{desc}</p>
    </div>
  );

  useEffect(() => {
    setHasMounted(true);
    const saved = localStorage.getItem('kedheon_v60_master');
    if (saved) {
      try {
        const p = JSON.parse(saved);
        setBeomToken(p.token || 8000.00);
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
    <div className="space-y-10">
      {assets.filter(a => category === 'ALL' || a.category === category).map(a => (
        <div key={a.id} className="bg-[#111] rounded-[40px] border-4 p-8 md:p-12 space-y-6 shadow-2xl relative transition-all border-white hover:border-[#daa520]">
          <div className="flex justify-between items-start font-black">
            <div className="space-y-2 text-left">
              <span className="bg-white text-black px-3 py-1 rounded-full text-[10px] uppercase font-sans">{a.type}</span>
              <h4 className="text-3xl md:text-5xl text-[#daa520] tracking-tighter uppercase leading-tight">{a.title}</h4>
            </div>
            <span className="text-white/20 font-mono text-sm">{a.timestamp}</span>
          </div>
          <p className="text-white text-xl md:text-2xl font-bold italic text-left leading-relaxed font-black">"{a.desc}"</p>
          <div className="pt-8 border-t-4 border-white/10 flex flex-wrap justify-between items-center gap-4 font-black">
            {showSupport ? (
              <button onClick={() => supportPost(a.id)} className="bg-[#daa520] text-black px-10 py-4 rounded-2xl text-xl border-4 border-white shadow-md active:scale-95">👑 찬양 (100 BEOM)</button>
            ) : (
              <div className="bg-white/5 px-6 py-2 rounded-xl border-2 border-white/10 text-white/30 text-sm">PIONEER 전용 찬양</div>
            )}
            <p className="text-[#daa520] text-4xl md:text-6xl tracking-tighter font-black">{a.beomSupport.toLocaleString()} <span className="text-xl">BEOM</span></p>
          </div>
        </div>
      ))}
      {assets.length === 0 && <p className="text-white/20 py-20 italic">현재 방송 중인 정보가 없습니다.</p>}
    </div>
  );

  if (!hasMounted) return null;

  return (
    <div className="flex flex-col items-center bg-black min-h-screen text-white font-sans w-full pb-20 overflow-x-hidden text-center font-black">
      
      {/* 글로벌 네비게이션 */}
      <div className="w-full max-w-5xl flex justify-between items-center p-4 md:p-6 sticky top-0 bg-black/95 backdrop-blur-md z-[150] border-b-4 border-[#daa520] shadow-2xl">
        <button onClick={() => setLang(l => l === 'KO' ? 'EN' : 'KO')} className="text-[#daa520] border-2 border-[#daa520] px-4 py-1.5 rounded-full text-xs uppercase">{lang === 'KO' ? "ENGLISH" : "한국어"}</button>
        <div className="flex gap-2">
          <button onClick={() => setTab('ROOKIE')} className={`px-4 py-1.5 rounded-lg text-xs border-2 transition-all ${tab === 'ROOKIE' ? 'bg-[#daa520] text-black border-[#daa520]' : 'bg-black text-white border-white'}`}>ROOKIE</button>
          <button onClick={() => setTab('PIONEER')} className={`px-4 py-1.5 rounded-lg text-xs border-2 transition-all ${tab === 'PIONEER' ? 'bg-[#daa520] text-black border-[#daa520]' : 'bg-black text-white border-white'}`}>PIONEER</button>
        </div>
      </div>

      <div className="w-full max-w-5xl px-4 md:px-6">
        
        {tab === 'ROOKIE' ? (
          <div className="flex flex-col items-center py-16 animate-in fade-in duration-700">
            <img src="/kedheon-character.png" className="w-32 h-32 md:w-56 md:h-56 rounded-3xl mb-8 border-4 border-[#daa520] shadow-2xl" alt="K" />
            <h1 className="text-4xl md:text-6xl text-[#daa520] italic uppercase mb-4 tracking-tighter">Kedheon Empire</h1>
            <p className="text-white text-lg md:text-2xl mb-12 border-y-2 border-white/20 py-3 px-6 uppercase italic">Kedheon Empire 웹3에 참여하세요</p>
            {!showOnboarding ? (
              <button onClick={() => setShowOnboarding(true)} className="bg-white text-black px-12 py-5 rounded-full text-xl md:text-2xl border-4 border-[#daa520] hover:scale-105 active:scale-95 shadow-2xl mb-20">시민권 획득 가이드</button>
            ) : (
              <div className="w-full bg-[#111] p-6 md:p-10 rounded-[40px] border-4 border-white shadow-2xl space-y-8 mb-20 animate-in slide-in-from-bottom-5">
                <h2 className="text-[#daa520] text-2xl md:text-4xl uppercase italic">Pioneer Onboarding</h2>
                <div className="space-y-4 text-left text-white text-lg font-bold font-sans">
                  <p>1. Pi Network 앱 설치 후 추천인 코드 [ <span className="text-[#daa520] underline">{PI_INVITE_CODE}</span> ] 입력</p>
                  <p>2. 채굴한 Pi를 범(BEOM) 토큰으로 환제하여 제국 입장</p>
                </div>
                <div className="flex gap-4 font-sans"><button onClick={() => window.open(PI_APP_STORE_URL)} className="flex-1 bg-white text-black py-4 rounded-xl border-4 border-[#daa520] uppercase font-black">App Store</button><button onClick={() => window.open(PI_PLAY_STORE_URL)} className="flex-1 bg-white text-black py-4 rounded-xl border-4 border-[#daa520] uppercase font-black">Play Store</button></div>
              </div>
            )}
            <SectionHeader num="00" title="EMPIRE LIVE FEED (VIEW ONLY)" desc="제국 시민들의 실시간 활동과 창작 방송을 관찰하십시오." />
            <div className="w-full text-left opacity-80 scale-95 pointer-events-none md:pointer-events-auto">
               <FeedList showSupport={false} />
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-12 py-10 animate-in slide-in-from-bottom-5">
            {/* 자산 대시보드 */}
            <div className="bg-[#111] p-8 rounded-[40px] border-4 border-[#daa520] shadow-2xl flex flex-col md:flex-row justify-between items-center gap-8">
               <div className="text-center md:text-left flex-1 font-black">
                  <h3 className="text-white/60 text-sm uppercase tracking-widest mb-2 font-sans">Imperial Assets</h3>
                  <p className="text-[#daa520] text-5xl md:text-8xl tracking-tighter leading-none font-sans font-black">{beomToken.toLocaleString()} BEOM</p>
                  <div className="mt-4 bg-black px-6 py-2 rounded-xl border-2 border-white inline-block text-xl font-mono text-white italic">
                    ≈ {(beomToken / PI_TO_BEOM_RATIO).toFixed(4)} Pi
                  </div>
               </div>
               <div className="flex items-center gap-6"><img src="/kedheon-character.png" className="w-24 h-24 md:w-32 md:h-32 rounded-3xl border-4 border-white shadow-xl" alt="Char" /><img src="/beom-token.png" className="w-20 h-20 md:w-32 md:h-32" alt="Token" /></div>
            </div>

            {/* 제국 선언문 */}
            <div className="w-full bg-[#111] p-8 md:p-12 rounded-[50px] border-4 border-[#daa520] shadow-2xl">
              <h2 className="text-[#daa520] text-3xl md:text-6xl uppercase italic mb-6 tracking-tighter font-sans font-black">누리고 즐기고 선점하세요</h2>
              <div className="space-y-4 text-white/90 text-lg md:text-2xl font-bold leading-relaxed tracking-tight font-black">
                <p>제국 시민은 익명 결제와 보안 인증을 마음껏 <span className="text-[#daa520]">누리고</span>,</p>
                <p>자신만의 창작물과 실시간 방송으로 생태계를 <span className="text-[#daa520]">즐기며</span>,</p>
                <p>강력한 <span className="text-[#daa520]">팬덤 결집</span>을 통해 공동체의 가치를 증폭시키고,</p>
                <p>한정된 자산과 기여 보상을 남보다 먼저 <span className="text-[#daa520]">선점</span>하여 주권을 확보합니다.</p>
              </div>
            </div>

            {/* 01. 범 환전 */}
            <div className="flex flex-col w-full">
              <SectionHeader num="01" title="ACQUIRE BEOM TOKEN" desc="제국 내 모든 활동에 필요한 범(BEOM) 토큰을 확보하여 주권을 행사하십시오." />
              <div className="bg-[#111] p-8 rounded-[40px] border-4 border-white shadow-2xl grid md:grid-cols-2 gap-8 items-center font-black font-sans">
                <div className="text-left space-y-2"><p className="text-white text-xl md:text-3xl uppercase italic leading-tight">파이를 범으로 환전하십시오</p>
                <p className="text-white/60 text-sm md:text-lg italic font-bold">1 Pi = {PI_TO_BEOM_RATIO} BEOM</p></div>
                <button onClick={() => setBeomToken(p => p + PI_TO_BEOM_RATIO)} className="w-full bg-[#daa520] text-black py-6 rounded-2xl text-xl md:text-2xl border-4 border-white shadow-xl hover:scale-105 active:scale-95 uppercase font-black">EXCHANGE PI TO BEOM</button>
              </div>
            </div>

            {/* 02. 보안 인증 */}
            <div className="flex flex-col w-full">
              <SectionHeader num="02" title="IMPERIAL SECURE AUTH" desc="고유한 QR 인증을 통해 제국 내에서 신분을 증명하고 안전한 익명 결제를 이용하십시오." />
              <div className="bg-[#111] p-6 md:p-10 rounded-[40px] border-4 border-white flex flex-col items-center gap-8 shadow-2xl">
                <div className="flex gap-2 w-full max-w-md bg-black p-2 rounded-2xl border-4 border-[#daa520] font-black font-sans">
                  <button onClick={() => { setQrType('PERSONAL'); setIsQrActive(false); }} className={`flex-1 py-3 rounded-xl transition-all ${qrType === 'PERSONAL' ? 'bg-[#daa520] text-black' : 'text-white/30'}`}>PERSONAL</button>
                  <button onClick={() => { setQrType('BUSINESS'); setIsQrActive(false); }} className={`flex-1 py-3 rounded-xl transition-all ${qrType === 'BUSINESS' ? 'bg-[#daa520] text-black' : 'text-white/30'}`}>BUSINESS</button>
                </div>
                {qrType === 'BUSINESS' && <input type="text" value={bizName} onChange={(e) => setBizName(e.target.value)} placeholder="ENTER BUSINESS NAME" className="w-full max-w-md bg-black border-4 border-[#daa520] p-4 rounded-xl text-center text-[#daa520] outline-none text-xl placeholder-[#daa520]/20 font-black" />}
                <div className={`p-6 md:p-8 bg-black border-4 rounded-[50px] shadow-[0_0_80px_rgba(218,165,32,0.5)] transition-all flex items-center justify-center ${isQrActive ? 'border-[#daa520]' : 'opacity-10 border-white'}`}>
                  {isQrActive ? (
                    <img src={qrType === 'PERSONAL' ? "/qr-personal.png" : "/qr-business.png"} className="w-full max-w-[500px] h-auto rounded-3xl" alt="QR" />
                  ) : ( <div className="w-64 h-64 md:w-96 md:h-96 flex items-center justify-center text-white/5 text-4xl md:text-8xl font-black italic uppercase">Secure</div> )}
                </div>
                <button onClick={() => { setIsQrActive(true); setBeomToken(p => p - 50); }} className="bg-[#daa520] text-black px-12 py-5 rounded-2xl text-xl md:text-3xl border-4 border-white shadow-2xl active:scale-95 transition-all uppercase font-black font-sans">인증 활성화 (50 BEOM)</button>
              </div>
            </div>

            {/* 03. 창작 및 방송 허브 */}
            <div className="flex flex-col w-full text-left">
              <SectionHeader num="03" title="CREATIVE & BROADCAST HUB" desc="본인의 창작물과 실시간 방송을 제국 전역에 송출하고 시민들의 찬양을 확보하십시오." />
              <div className="w-full bg-[#111] p-6 md:p-10 rounded-[40px] border-4 border-[#daa520] space-y-6 mb-12 shadow-xl">
                <div className="flex gap-4 mb-2"><button onClick={() => setPostType('BROADCAST')} className={`flex-1 py-4 rounded-xl font-black border-2 transition-all ${postType === 'BROADCAST' ? 'bg-[#daa520] text-black border-white shadow-lg' : 'bg-black text-white/40 border-white/20'}`}>게시용 방송</button><button onClick={() => setPostType('CREATION')} className={`flex-1 py-4 rounded-xl font-black border-2 transition-all ${postType === 'CREATION' ? 'bg-[#daa520] text-black border-white shadow-lg' : 'bg-black text-white/40 border-white/20'}`}>본인 창작물</button></div>
                <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder={`${postType === 'BROADCAST' ? '방송' : '창작물'} 제목`} className="bg-black border-4 border-white p-4 rounded-xl w-full text-lg md:text-2xl text-white outline-none focus:border-[#daa520] font-black font-sans" />
                <textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="제국 전역에 알릴 상세 내용" className="bg-black border-4 border-white p-4 rounded-xl w-full text-sm md:text-lg text-white/80 h-32 resize-none outline-none focus:border-[#daa520] font-bold" />
                <button onClick={postContent} className="w-full py-5 rounded-2xl bg-[#daa520] text-black text-xl md:text-2xl border-4 border-white shadow-lg active:scale-95 uppercase font-black font-sans">제국 피드 등록하기 (10 BEOM)</button>
              </div>
              <div className="grid grid-cols-4 md:grid-cols-6 gap-2 mb-8 font-black font-sans">{cats.map(cat => ( <button key={cat} onClick={() => setCategory(cat)} className={`py-4 rounded-xl text-[10px] md:text-xs border-2 transition-all ${category === cat ? 'bg-[#daa520] text-black border-[#daa520]' : 'bg-black text-white/40 border-white/20'}`}>{cat}</button> ))}</div>
              <FeedList showSupport={true} />
            </div>

            {/* 04. 팬덤 굿즈 */}
            <div className="flex flex-col w-full text-left">
              <SectionHeader num="04" title="IMPERIAL FANDOM GOODS" desc="제국의 상징물을 소유하고 강력한 팬덤의 일원이 되어 가치를 공유하십시오." />
              <div className="bg-[#daa520]/10 border-2 border-[#daa520] p-4 rounded-2xl mb-8">
                 <p className="text-[#daa520] text-center font-black md:text-xl italic">⚠️ 안내: 현재 표시된 상품은 운영 예시이며 실제 판매물이 아닙니다.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {goods.map(g => (
                  <div key={g.id} className="bg-[#111] rounded-[40px] border-4 border-white p-6 shadow-2xl flex flex-col items-center gap-4 relative font-black">
                    <div className="absolute top-6 right-6 bg-[#daa520] text-black px-4 py-1 rounded-full text-[10px] font-black italic border border-white">SAMPLE</div>
                    <img src={g.img} className="w-full h-48 object-contain bg-black rounded-3xl border-2 border-[#daa520]/20" alt="G" />
                    <div className="w-full text-left px-2">
                      <p className="text-[#daa520] text-xs uppercase opacity-60 font-black tracking-widest">Seller: {g.seller}</p>
                      <h4 className="text-white font-black text-xl md:text-2xl uppercase tracking-tighter font-sans">{g.name}</h4>
                      <p className="text-[#daa520] text-2xl md:text-3xl mt-2 font-sans">{g.price.toLocaleString()} BEOM</p>
                    </div>
                    <button className="w-full py-4 rounded-2xl bg-white text-black text-xl border-4 border-[#daa520] hover:bg-[#daa520] transition-all uppercase font-sans">COMING SOON</button>
                  </div>
                ))}
              </div>
              <button onClick={() => setShowCreateModal(true)} className="w-full py-6 mt-8 rounded-3xl bg-[#daa520] text-black font-black text-2xl border-4 border-white shadow-xl hover:scale-105 active:scale-95 transition-all uppercase italic font-black font-sans">➕ 새로운 팬방 영토 개설 (500 BEOM)</button>
            </div>
          </div>
        )}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/98 backdrop-blur-3xl z-[300] flex items-center justify-center p-6 animate-in zoom-in-95">
          <div className="bg-[#111] p-10 rounded-[50px] border-8 border-[#daa520] w-full max-w-2xl text-center shadow-2xl font-black">
            <h3 className="text-[#daa520] text-4xl mb-10 italic uppercase font-sans tracking-tighter">New Fan Territory</h3>
            <input type="text" value={createTitle} onChange={(e) => setCreateTitle(e.target.value)} placeholder="팬방 명칭 입력" className="bg-black border-4 border-white p-6 rounded-2xl w-full text-3xl text-center text-white mb-10 outline-none focus:border-[#daa520] font-black" />
            <div className="flex gap-4 font-sans"><button onClick={() => setShowCreateModal(false)} className="flex-1 py-5 rounded-2xl font-black text-xl bg-white/10 border-4 border-white uppercase font-black">Cancel</button><button onClick={() => { setShowCreateModal(false); setCreateTitle(''); alert("개설 완료"); }} className="flex-1 py-5 rounded-2xl font-black text-xl bg-[#daa520] text-black border-4 border-white shadow-xl uppercase transition-all font-black">Create</button></div>
          </div>
        </div>
      )}

      {/* 최종 푸터 */}
      <div className="mt-20 opacity-40 text-center w-full pb-10 font-mono text-white text-[10px] tracking-[1em] uppercase font-black">KEDHEON EMPIRE | INTEGRITY MASTER V60.1 | ohsangjo</div>
    </div>
  );
}
