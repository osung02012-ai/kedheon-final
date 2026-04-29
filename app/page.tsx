'use client';
import React, { useState, useEffect } from 'react';

/** * [KEDHEON EMPIRE V63.0 FINAL MASTER]
 * -----------------------------------------------------------
 * 텍스트 규격 (3-Tier Standard):
 * 1. LARGE  : text-4xl (대문 타이틀, 섹션 대제목, 자산 지표)
 * 2. MEDIUM : text-xl  (단계 제목, 버튼 텍스트, 입력창 라벨)
 * 3. SMALL  : text-sm  (상세 설명, 가이드 문구, 푸터 데이터)
 * -----------------------------------------------------------
 */

// --- [1. 정적 데이터 및 비용 설정] --- ⚙️
const PI_INVITE_CODE = 'ohsangjo'; 
const PI_APP_STORE_URL = 'https://apps.apple.com/app/pi-network/id1445472541';
const PI_PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.blockchainvault';
const PI_TO_BEOM_RATIO = 100; 

const COSTS_BEOM = {
  POST_CREATION: 10,
  SUPPORT: 100,
  CREATE_FAN_ROOM: 500,
  SELL_ITEM: 20,
  ACTIVATE_QR: 50
};

// --- [2. 인터페이스 정의] --- 🧠
interface Review { id: number; user: string; text: string; timestamp: string; }
interface Asset { id: number; title: string; desc: string; category: string; type: 'CREATION' | 'POST'; beomSupport: number; timestamp: string; url?: string; }
interface Good { id: number; name: string; price: number; img: string; seller: string; desc: string; reviews: Review[]; }

export default function KedheonPortal() {
  const [hasMounted, setHasMounted] = useState(false);
  const [tab, setTab] = useState<'ROOKIE' | 'PIONEER'>('ROOKIE');
  const [beomToken, setBeomToken] = useState(7991.88); 
  
  // 보안 및 비즈니스 상태 🛡️
  const [qrType, setQrType] = useState<'PERSONAL' | 'BUSINESS'>('PERSONAL');
  const [bizName, setBizName] = useState('');
  const [isQrActive, setIsQrActive] = useState(false);
  
  // 창작 게시판 상태 🎨
  const [postCategory, setPostCategory] = useState('TECH');
  const [postType, setPostType] = useState<'CREATION' | 'POST'>('POST');
  const [assets, setAssets] = useState<Asset[]>([]); 
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newUrl, setNewUrl] = useState('');

  // 마켓 데이터 🛒
  const [goods] = useState<Good[]>([
    { 
      id: 1, 
      name: "EMPIRE GOLD BADGE", 
      price: 1000, 
      img: "/beom-token.png", 
      seller: "Imperial", 
      desc: "제국 공인 고유 황금 뱃지", 
      reviews: [{ id: 1, user: "Citizen_A", text: "실물 퀄리티가 압도적입니다.", timestamp: "2026.04.29" }] 
    }
  ]);

  const categories = ['MUSIC', 'SPORTS', 'ANIME', 'DRAMA', 'MOVIE', 'TECH', 'FOOD'];

  useEffect(() => {
    setHasMounted(true);
    const saved = localStorage.getItem('kedheon_v63_master');
    if (saved) {
      try {
        const p = JSON.parse(saved);
        if (p.token) setBeomToken(p.token);
        if (p.assets) setAssets(p.assets);
      } catch (e) { console.error("Restore Error", e); }
    }
  }, []);

  useEffect(() => {
    if (hasMounted) {
      localStorage.setItem('kedheon_v63_master', JSON.stringify({ token: beomToken, assets }));
    }
  }, [beomToken, assets, hasMounted]);

  // 로직 핸들러 🛠️
  const handlePost = () => {
    if(!newTitle.trim()) return alert("제목을 입력하십시오.");
    if(beomToken < COSTS_BEOM.POST_CREATION) return alert("자산이 부족합니다.");
    const post: Asset = { 
      id: Date.now(), title: newTitle, desc: newDesc, category: postCategory, 
      type: postType, beomSupport: 0, timestamp: new Date().toLocaleDateString(), url: newUrl 
    };
    setAssets([post, ...assets]);
    setBeomToken(p => p - COSTS_BEOM.POST_CREATION);
    setNewTitle(''); setNewDesc(''); setNewUrl('');
    alert("피드에 등록되었습니다.");
  };

  if (!hasMounted) return null;

  return (
    <div className="flex flex-col items-center bg-black min-h-screen text-white font-sans w-full pb-40 font-black overflow-x-hidden">
      
      {/* --- [GNB: 버전 정보 포함] --- 🏷️ */}
      <div className="w-full max-w-4xl flex justify-between items-center p-5 sticky top-0 bg-black/95 backdrop-blur-md z-[150] border-b-2 border-[#daa520]">
        <div className="flex items-center gap-3">
          <img src="/kedheon-character.png" className="w-10 h-10 rounded-xl border-2 border-[#daa520]" alt="K" />
          <div className="text-left">
            <h2 className="text-[#daa520] text-xl italic leading-none uppercase font-black">Kedheon Empire</h2>
            <span className="text-white/30 text-[10px] font-mono tracking-widest uppercase">v63.0 Final Master</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setTab('ROOKIE')} className={`px-5 py-2 rounded-md text-sm border transition-all ${tab === 'ROOKIE' ? 'bg-[#daa520] text-black border-[#daa520]' : 'border-white/10'}`}>ROOKIE</button>
          <button onClick={() => setTab('PIONEER')} className={`px-5 py-2 rounded-md text-sm border transition-all ${tab === 'PIONEER' ? 'bg-[#daa520] text-black border-[#daa520]' : 'border-white/10'}`}>PIONEER</button>
        </div>
      </div>

      <div className="w-full max-w-4xl px-4 py-10">
        {tab === 'ROOKIE' ? (
          /* --- [ROOKIE: 대문 및 8단계 가입 절차] --- 🚀 */
          <div className="flex flex-col gap-12 animate-in fade-in text-left">
            
            {/* 대문 이미지 영역 (LARGE TEXT) */}
            <div className="flex flex-col items-center text-center gap-6 py-10 bg-[#111] rounded-[60px] border-4 border-[#daa520] shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 opacity-10 bg-[url('/kedheon-character.png')] bg-center bg-no-repeat bg-contain scale-150"></div>
              <img src="/kedheon-character.png" className="w-48 h-48 rounded-[40px] border-4 border-white shadow-2xl relative z-10" alt="Main" />
              <div className="relative z-10">
                <h1 className="text-[#daa520] text-4xl md:text-6xl italic uppercase mb-2 tracking-tighter">Web3 Invitation</h1>
                <p className="text-white text-xl uppercase tracking-widest border-b border-white/20 pb-4 inline-block">케데헌 제국 입국 및 시민권 안내</p>
                <p className="text-white/50 text-sm mt-4 font-sans px-10 leading-relaxed">
                  파이 네트워크 기반의 독창적 경제 생태계에 오신 것을 환영합니다.<br/>
                  아래 8단계 절차를 통해 정식 시민권을 획득하십시오.
                </p>
              </div>
            </div>

            {/* 8단계 가입 절차 (MEDIUM & SMALL TEXT) */}
            <div className="grid gap-6">
              {[
                { s: "Step 01", t: "App Download", d: "스토어에서 [Pi Network] 공식 앱을 설치하십시오." },
                { s: "Step 02", t: "Registration", d: "휴대폰 가입을 권장하며 [Continue with phone number]를 선택하십시오." },
                { s: "Step 03", t: "Region Setup", d: "국가 코드를 [South Korea (+82)]로 정확히 설정하십시오." },
                { s: "Step 04", t: "Security Set", d: "대/소문자 및 숫자를 조합하여 강력한 비밀번호를 생성하십시오." },
                { s: "Step 05", t: "Identity Entry", d: "여권 영문 실명을 입력하고 사용할 고유 ID를 설정하십시오." },
                { s: "Step 06", t: "Invitation Protocol", d: `초대 코드 [ ${PI_INVITE_CODE} ]를 반드시 입력하십시오.`, gold: true },
                { s: "Step 07", t: "Secret Vault", d: "지갑 생성 시 나오는 24개 비밀구절을 수기로 기록하여 보관하십시오.", danger: true },
                { s: "Step 08", t: "Mining Activation", d: "번개 버튼을 눌러 채굴을 시작하면 시민권이 활성화됩니다.", gold: true }
              ].map((step, idx) => (
                <div key={idx} className={`p-6 bg-[#111] rounded-[30px] border-2 shadow-xl ${step.gold ? 'border-[#daa520]' : step.danger ? 'border-red-600' : 'border-white/5'}`}>
                  <p className="text-[#daa520] text-sm uppercase mb-1 tracking-widest font-sans">{step.s}</p>
                  <h3 className="text-white text-xl uppercase italic mb-2">{step.t}</h3>
                  <p className="text-white/50 text-sm leading-relaxed font-sans">{step.d}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-4 font-sans">
              <button onClick={() => window.open(PI_APP_STORE_URL)} className="flex-1 bg-white text-black py-6 rounded-2xl text-xl font-black uppercase shadow-lg border-4 border-[#daa520]">App Store</button>
              <button onClick={() => window.open(PI_PLAY_STORE_URL)} className="flex-1 bg-white text-black py-6 rounded-2xl text-xl font-black uppercase shadow-lg border-4 border-[#daa520]">Play Store</button>
            </div>
          </div>
        ) : (
          /* --- [PIONEER: 자산 및 핵심 기능] --- 🪙 */
          <div className="flex flex-col gap-14 py-8 animate-in slide-in-from-bottom-5 text-left">
            
            {/* 자산 대시보드 (LARGE TEXT) */}
            <div className="bg-[#111] p-10 rounded-[60px] border-4 border-[#daa520] shadow-2xl flex flex-col md:flex-row justify-between items-center gap-10">
                <div className="text-center md:text-left flex-1 font-black">
                  <h3 className="text-white/30 text-sm uppercase tracking-[0.4em] mb-4">Imperial Assets</h3>
                  <p className="text-[#daa520] text-4xl md:text-7xl tracking-tighter leading-none">
                    {Math.floor(beomToken).toLocaleString()}
                    <span className="text-xl opacity-40">.{beomToken.toFixed(2).split('.')[1]}</span> 
                    <span className="ml-3 text-2xl">BEOM</span>
                  </p>
                  <div className="mt-6 bg-black/60 px-6 py-2 rounded-xl border border-white/10 inline-block text-xl font-mono italic text-white/50">
                    ≈ {(beomToken / PI_TO_BEOM_RATIO).toFixed(4)} Pi
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <img src="/kedheon-character.png" className="w-20 h-20 md:w-32 md:h-32 rounded-[30px] border-2 border-white/10" alt="K" />
                  <img src="/beom-token.png" className="w-16 h-16 md:w-28 md:h-28 object-contain animate-pulse shadow-[0_0_30px_rgba(218,165,32,0.4)]" alt="B" />
                </div>
            </div>

            {/* 01. 보안 인증 (QR 및 비즈니스 입력창) 🛡️ */}
            <div className="space-y-6">
              <h2 className="text-[#daa520] text-4xl uppercase italic border-l-4 border-[#daa520] pl-4">01. Secure Auth</h2>
              <div className="bg-[#111] p-10 rounded-[40px] border-2 border-white/10 flex flex-col items-center gap-8 shadow-2xl font-black">
                <div className="flex gap-4 w-full max-w-sm bg-black p-2 rounded-2xl border border-white/10">
                  <button onClick={() => { setQrType('PERSONAL'); setIsQrActive(false); }} className={`flex-1 py-4 rounded-xl text-sm transition-all ${qrType === 'PERSONAL' ? 'bg-[#daa520] text-black' : 'text-white/20'}`}>PERSONAL</button>
                  <button onClick={() => { setQrType('BUSINESS'); setIsQrActive(false); }} className={`flex-1 py-4 rounded-xl text-sm transition-all ${qrType === 'BUSINESS' ? 'bg-[#daa520] text-black' : 'text-white/20'}`}>BUSINESS</button>
                </div>
                
                {qrType === 'BUSINESS' && (
                  <div className="w-full max-w-sm animate-in fade-in">
                    <p className="text-[#daa520] text-sm uppercase mb-2 ml-2 tracking-widest">Enterprise Identity</p>
                    <input type="text" value={bizName} onChange={(e) => setBizName(e.target.value.toUpperCase())} placeholder="ENTER BUSINESS NAME" className="w-full bg-black border-2 border-[#daa520] p-5 rounded-2xl text-center text-[#daa520] text-xl outline-none" />
                  </div>
                )}

                <div className={`p-6 bg-black border-4 rounded-[60px] transition-all flex flex-col items-center justify-center w-72 h-72 ${isQrActive ? 'border-[#daa520] shadow-[0_0_50px_rgba(218,165,32,0.3)]' : 'opacity-10 border-white'}`}>
                  {isQrActive ? (
                    <>
                      <img src="/qr-business.png" className="w-48 h-48 rounded-xl mb-2" alt="QR" />
                      <span className="text-[#daa520] text-[10px] uppercase tracking-widest">Imperial Verified</span>
                    </>
                  ) : (
                    <p className="text-white/5 text-xl italic uppercase">Locked</p>
                  )}
                </div>
                <button onClick={() => { if(qrType==='BUSINESS' && !bizName) return alert("기업명을 입력하십시오."); setIsQrActive(true); setBeomToken(p => p - COSTS_BEOM.ACTIVATE_QR); }} className="w-full max-w-sm bg-[#daa520] text-black py-6 rounded-2xl text-xl border-4 border-white active:scale-95 uppercase shadow-xl font-sans">인증 활성화 ({COSTS_BEOM.ACTIVATE_QR} BEOM)</button>
              </div>
            </div>

            {/* 02. 창작 게시판 (카테고리 및 타입) 🎨 */}
            <div className="space-y-6">
              <h2 className="text-[#daa520] text-4xl uppercase italic border-l-4 border-[#daa520] pl-4">02. Creative Board</h2>
              <div className="bg-[#111] p-8 rounded-[40px] border-2 border-[#daa520]/30 space-y-4 mb-10 shadow-2xl">
                <div className="flex gap-2 p-1 bg-black rounded-xl border border-white/10 font-black">
                  <button onClick={() => setPostType('POST')} className={`flex-1 py-3 rounded-lg text-sm ${postType === 'POST' ? 'bg-[#daa520] text-black' : 'text-white/30'}`}>일반 게시물</button>
                  <button onClick={() => setPostType('CREATION')} className={`flex-1 py-3 rounded-lg text-sm ${postType === 'CREATION' ? 'bg-[#daa520] text-black' : 'text-white/30'}`}>개인 창작물</button>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {categories.map(cat => (
                    <button key={cat} onClick={() => setPostCategory(cat)} className={`px-4 py-2 rounded-full text-xs font-black whitespace-nowrap border transition-all ${postCategory === cat ? 'bg-white text-black border-white' : 'border-white/20 text-white/50 hover:border-white'}`}>{cat}</button>
                  ))}
                </div>
                <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="제목을 입력하십시오 (MEDIUM TEXT)" className="w-full bg-black border border-white/10 p-5 rounded-xl text-xl text-white outline-none focus:border-[#daa520] font-sans" />
                <input value={newUrl} onChange={(e) => setNewUrl(e.target.value)} placeholder="영상 또는 이미지 링크 URL (SMALL TEXT)" className="w-full bg-black border border-white/10 p-5 rounded-xl text-sm text-[#daa520] outline-none font-sans" />
                <textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="창작 의도를 기록하십시오" className="w-full bg-black border border-white/10 p-5 rounded-xl text-sm text-white/70 h-32 outline-none font-sans" />
                <div className="flex gap-4">
                  <button onClick={handlePost} className="flex-[2] bg-[#daa520] text-black py-6 rounded-2xl text-xl border-2 border-white uppercase shadow-xl font-black active:scale-95">피드 등록 ({COSTS_BEOM.POST_CREATION})</button>
                  <button className="flex-1 bg-white text-black py-6 rounded-2xl text-sm border-2 border-[#daa520] uppercase font-black font-sans leading-tight active:scale-95">🚩 팬방 개설<br/>({COSTS_BEOM.CREATE_FAN_ROOM})</button>
                </div>
              </div>

              {/* 피드 리스트 */}
              <div className="space-y-8">
                {assets.map(a => (
                  <div key={a.id} className="bg-[#111] p-10 rounded-[50px] border-2 border-white/5 shadow-2xl relative">
                    <div className="flex justify-between items-start mb-6 font-black">
                      <div className="flex flex-col gap-2">
                        <span className="text-[10px] text-[#daa520] uppercase tracking-widest bg-[#daa520]/10 px-3 py-1 rounded-full w-fit">[{a.type}] {a.category}</span>
                        <h4 className="text-white text-2xl uppercase italic underline underline-offset-8 decoration-white/10">{a.title}</h4>
                      </div>
                      <span className="text-white/20 text-sm font-mono">{a.timestamp}</span>
                    </div>
                    {a.url && (
                      <div className="mb-6 p-5 bg-black rounded-2xl flex justify-between items-center border border-[#daa520]/20 font-sans">
                        <p className="text-xs text-[#daa520] truncate opacity-50 pr-6 italic">{a.url}</p>
                        <button onClick={() => window.open(a.url, '_blank')} className="bg-[#daa520] text-black px-6 py-2 rounded-xl text-sm font-black uppercase whitespace-nowrap shadow-lg active:scale-95">Watch 📺</button>
                      </div>
                    )}
                    <p className="text-white/70 text-xl italic leading-relaxed mb-8 font-sans">"{a.desc}"</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 03. 시장 및 후기 게시판 🛒 */}
            <div className="space-y-6">
              <h2 className="text-[#daa520] text-4xl uppercase italic border-l-4 border-[#daa520] pl-4">03. Market & Reviews</h2>
              <div className="grid md:grid-cols-2 gap-10">
                {/* 판매 섹션 */}
                <div className="space-y-6">
                  <h3 className="text-white text-xl uppercase border-b border-white/10 pb-2 font-black italic">Sales Board</h3>
                  {goods.map(g => (
                    <div key={g.id} className="bg-[#111] p-8 rounded-[50px] border-2 border-white/10 shadow-2xl text-center font-black transition-transform hover:scale-[1.02]">
                      <img src={g.img} className="w-full h-48 object-contain bg-black rounded-3xl mb-6 shadow-inner" alt="G" />
                      <h4 className="text-white text-xl uppercase mb-2">{g.name}</h4>
                      <p className="text-[#daa520] text-4xl mb-6">{g.price.toLocaleString()} <span className="text-sm">BEOM</span></p>
                      <button className="w-full py-5 bg-white text-black rounded-2xl text-xl border-4 border-[#daa520] uppercase shadow-lg active:scale-95">Buy Now</button>
                    </div>
                  ))}
                </div>
                {/* 후기 섹션 */}
                <div className="space-y-6">
                  <h3 className="text-white text-xl uppercase border-b border-white/10 pb-2 font-black italic">Review Board</h3>
                  {goods[0].reviews.map(r => (
                    <div key={r.id} className="bg-black/50 p-6 rounded-[30px] border border-white/5 shadow-inner">
                      <p className="text-white/80 text-sm italic font-sans mb-3 font-black">"{r.text}"</p>
                      <div className="flex justify-between items-center text-[10px] font-mono text-[#daa520] uppercase tracking-widest font-black">
                        <span>- {r.user}</span>
                        <span className="text-white/20">{r.timestamp}</span>
                      </div>
                    </div>
                  ))}
                  <button className="w-full py-5 border-2 border-dashed border-white/10 rounded-2xl text-sm text-white/30 uppercase font-black font-sans hover:border-[#daa520] hover:text-[#daa520] transition-all">Write Experience Review</button>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* --- [하단 네비게이션] --- 🧭 */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-black/95 border-2 border-[#daa520] p-2 rounded-3xl flex gap-4 z-[200] shadow-[0_0_60px_rgba(218,165,32,0.5)] backdrop-blur-2xl">
        {['KEDHEON', 'CIVIL', 'NEXUS', 'VENDOR'].map(app => (
          <button key={app} className={`px-6 py-3 rounded-2xl text-sm transition-all font-black ${app === 'KEDHEON' ? 'bg-[#daa520] text-black scale-110 shadow-lg' : 'text-white/30 hover:text-white'}`}>{app}</button>
        ))}
      </div>

      {/* --- [푸터] --- 🏷️ */}
      <div className="mt-32 opacity-20 text-sm tracking-[1.5em] uppercase pb-20 font-sans font-black">
        Kedheon Empire | V63.0 Final Master | @Ohsangjo
      </div>
    </div>
  );
}
