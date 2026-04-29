'use client';
import React, { useState, useEffect } from 'react';

/** * [KEDHEON EMPIRE V68.0 PRESTIGE MASTER]
 * -----------------------------------------------------------
 * 텍스트 규격 지침:
 * 1. LARGE  : text-4xl (섹션 대제목, 핵심 자산 지표, 대문 타이틀)
 * 2. MEDIUM : text-xl  (버튼 텍스트, 입력창 라벨, 리스트 타이틀)
 * 3. SMALL  : text-sm  (상세 가이드, 섹션 설명글, 푸터, 메타데이터)
 * -----------------------------------------------------------
 */

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

interface Review { id: number; user: string; text: string; timestamp: string; }
interface Asset { id: number; title: string; desc: string; category: string; type: 'CREATION' | 'POST'; beomSupport: number; timestamp: string; url?: string; }
interface Good { id: number; name: string; price: number; img: string; seller: string; desc: string; reviews: Review[]; }

export default function KedheonPortal() {
  const [hasMounted, setHasMounted] = useState(false);
  const [tab, setTab] = useState<'ROOKIE' | 'PIONEER'>('ROOKIE');
  const [beomToken, setBeomToken] = useState(7991.88); 
  
  // 보안 및 비즈니스 상태
  const [qrType, setQrType] = useState<'PERSONAL' | 'BUSINESS'>('PERSONAL');
  const [bizName, setBizName] = useState('');
  const [isQrActive, setIsQrActive] = useState(false);
  
  // 창작 게시판 상태
  const [postCategory, setPostCategory] = useState('TECH');
  const [postType, setPostType] = useState<'CREATION' | 'POST'>('POST');
  const [assets, setAssets] = useState<Asset[]>([]); 
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newUrl, setNewUrl] = useState('');

  // 마켓 게시판 상태
  const [goods, setGoods] = useState<Good[]>([
    { 
      id: 1, name: "EMPIRE GOLD BADGE", price: 1000, img: "/beom-token.png", seller: "Imperial", desc: "제국 공인 고유 황금 뱃지", 
      reviews: [{ id: 1, user: "Citizen_Alpha", text: "실물이 훨씬 웅장하고 보안 각인이 훌륭합니다.", timestamp: "2026.04.29" }] 
    }
  ]);
  const [sellName, setSellName] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [sellDesc, setSellDesc] = useState('');

  const cats = ['MUSIC', 'SPORTS', 'ANIME', 'DRAMA', 'MOVIE', 'TECH', 'FOOD', 'TRAVEL', 'BEAUTY', 'FASHION', 'GAME', 'NEWS', 'ESPORTS', 'COMEDY'];

  useEffect(() => {
    setHasMounted(true);
    const saved = localStorage.getItem('kedheon_v68_master');
    if (saved) {
      try {
        const p = JSON.parse(saved);
        if (p.token) setBeomToken(p.token);
        if (p.assets) setAssets(p.assets);
        if (p.goods) setGoods(p.goods);
      } catch (e) { console.error(e); }
    }
  }, []);

  useEffect(() => {
    if (hasMounted) {
      localStorage.setItem('kedheon_v68_master', JSON.stringify({ token: beomToken, assets, goods }));
    }
  }, [beomToken, assets, goods, hasMounted]);

  const handleExchange = () => setBeomToken(p => p + PI_TO_BEOM_RATIO);
  const handleSupport = (id: number) => {
    if (beomToken < COSTS_BEOM.SUPPORT) return alert("자산 부족");
    setBeomToken(p => p - COSTS_BEOM.SUPPORT);
    setAssets(assets.map(a => a.id === id ? { ...a, beomSupport: a.beomSupport + COSTS_BEOM.SUPPORT } : a));
  };
  const handlePost = () => {
    if(!newTitle.trim()) return alert("제목을 입력하십시오.");
    if(beomToken < COSTS_BEOM.POST_CREATION) return alert("자산 부족");
    const post: Asset = { id: Date.now(), title: newTitle, desc: newDesc, category: postCategory, type: postType, beomSupport: 0, timestamp: new Date().toLocaleDateString(), url: newUrl };
    setAssets([post, ...assets]);
    setBeomToken(p => p - COSTS_BEOM.POST_CREATION);
    setNewTitle(''); setNewDesc(''); setNewUrl('');
    alert("피드에 등록되었습니다.");
  };
  const handleSell = () => {
    if(!sellName.trim() || !sellPrice) return alert("상품 정보를 입력하십시오.");
    if(beomToken < COSTS_BEOM.SELL_ITEM) return alert("자산 부족");
    const newGood: Good = { id: Date.now(), name: sellName, price: Number(sellPrice), img: "/kedheon-character.png", seller: "Pioneer", desc: sellDesc, reviews: [] };
    setGoods([newGood, ...goods]);
    setBeomToken(p => p - COSTS_BEOM.SELL_ITEM);
    setSellName(''); setSellPrice(''); setSellDesc('');
    alert("시장에 상품이 등록되었습니다.");
  };

  const SectionHeader = ({ num, title, desc }: { num: string; title: string; desc: string }) => (
    <div className="w-full border-t-2 border-white/10 pt-10 mb-8 text-left font-black">
      <h2 className="text-[#daa520] text-4xl uppercase italic mb-3 tracking-tighter border-l-8 border-[#daa520] pl-4">
        {num}. 🌐 {title}
      </h2>
      <p className="text-white/40 text-sm italic pl-6 font-sans font-bold leading-relaxed">{desc}</p>
    </div>
  );

  if (!hasMounted) return null;

  return (
    <div className="flex flex-col items-center bg-black min-h-screen text-white font-sans w-full pb-40 font-black overflow-x-hidden">
      
      {/* --- [GNB: 고정 상단바] --- */}
      <div className="w-full max-w-4xl flex justify-between items-center p-5 sticky top-0 bg-black/95 backdrop-blur-md z-[150] border-b-2 border-[#daa520]">
        <div className="flex items-center gap-3">
          <img src="/kedheon-character.png" className="w-12 h-12 rounded-xl border-2 border-[#daa520]" alt="K" />
          <div className="text-left font-black">
            <h2 className="text-[#daa520] text-xl italic leading-none uppercase">Kedheon Empire</h2>
            <span className="text-white/30 text-[10px] font-mono tracking-widest uppercase font-black">v68.0 Prestige Master</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setTab('ROOKIE')} className={`px-6 py-2 rounded-md text-sm border transition-all ${tab === 'ROOKIE' ? 'bg-[#daa520] text-black border-[#daa520]' : 'border-white/10 text-white/40 font-bold'}`}>ROOKIE</button>
          <button onClick={() => setTab('PIONEER')} className={`px-6 py-2 rounded-md text-sm border transition-all ${tab === 'PIONEER' ? 'bg-[#daa520] text-black border-[#daa520]' : 'border-white/10 text-white/40 font-bold'}`}>PIONEER</button>
        </div>
      </div>

      <div className="w-full max-w-4xl px-4 py-10">
        {tab === 'ROOKIE' ? (
          /* --- [ROOKIE: 명확한 가입 절차] --- */
          <div className="flex flex-col gap-12 animate-in fade-in text-left">
            <div className="flex flex-col items-center text-center gap-8 py-16 bg-[#111] rounded-[60px] border-4 border-[#daa520] shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 opacity-10 bg-[url('/kedheon-character.png')] bg-center bg-no-repeat bg-contain scale-150"></div>
              <img src="/kedheon-character.png" className="w-56 h-56 rounded-[50px] border-4 border-white shadow-2xl relative z-10" alt="Main" />
              <div className="relative z-10 px-8 font-black">
                <h1 className="text-[#daa520] text-4xl md:text-6xl italic uppercase mb-4 tracking-tighter">Web3 초대합니다.</h1>
                <p className="text-white text-xl uppercase tracking-widest border-b-2 border-[#daa520] pb-4 inline-block font-black">파이코인 가입절차</p>
                <p className="text-white/40 text-sm mt-8 font-sans max-w-lg mx-auto leading-relaxed font-bold italic font-black">제국 시민이 되기 위한 가장 빠르고 정확한 8단계 가이드를 확인하십시오.</p>
              </div>
            </div>

            <div className="grid gap-6">
              {[
                { s: "Step 01", t: "애플리케이션 설치", d: "스토어에서 [Pi Network] 공식 앱을 설치하고 시작하십시오." },
                { s: "Step 02", t: "가입 방식 선택", d: "보안성이 높은 [Continue with phone number]를 선택하십시오." },
                { s: "Step 03", t: "국가 및 번호 설정", d: "국가 코드를 [+82(South Korea)]로 설정 후 본인 번호를 입력하십시오." },
                { s: "Step 04", t: "비밀번호 생성", d: "영문 대문자, 소문자, 숫자를 조합하여 강력한 암호를 만드십시오." },
                { s: "Step 05", t: "실명 프로필 작성", d: "여권 영문 실명을 입력하고, 제국에서 사용할 고유 ID를 설정하십시오." },
                { s: "Step 06", t: "웹3 초대 코드 입력", d: `입국 승인을 위해 초대 코드 [ ${PI_INVITE_CODE} ]를 반드시 입력하십시오.`, gold: true },
                { s: "Step 07", t: "비밀구절 수기 보관", d: "지갑의 열쇠인 24개 비밀구절은 오직 종이에만 기록하여 보관하십시오.", danger: true },
                { s: "Step 08", t: "채굴 버튼 활성화", d: "메인 화면의 번개 버튼을 눌러 정식 시민권을 획득하십시오.", gold: true }
              ].map((step, idx) => (
                <div key={idx} className={`p-6 bg-[#111] rounded-[30px] border-2 shadow-xl ${step.gold ? 'border-[#daa520] bg-[#daa520]/5' : step.danger ? 'border-red-600' : 'border-white/5'}`}>
                  <p className="text-[#daa520] text-sm uppercase mb-1 tracking-widest font-black font-sans">{step.s}</p>
                  <h3 className="text-white text-xl uppercase italic mb-2 font-black">{step.t}</h3>
                  <p className="text-white/40 text-sm leading-relaxed font-sans font-bold font-black">{step.d}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-4 font-sans pt-6 font-black">
              <button onClick={() => window.open(PI_APP_STORE_URL)} className="flex-1 bg-white text-black py-6 rounded-3xl text-xl font-black uppercase shadow-lg border-4 border-[#daa520] active:scale-95 transition-all">App Store</button>
              <button onClick={() => window.open(PI_PLAY_STORE_URL)} className="flex-1 bg-white text-black py-6 rounded-3xl text-xl font-black uppercase shadow-lg border-4 border-[#daa520] active:scale-95 transition-all">Play Store</button>
            </div>
          </div>
        ) : (
          /* --- [PIONEER: 제국 핵심 기능] --- */
          <div className="flex flex-col gap-14 py-8 animate-in slide-in-from-bottom-5 text-left font-black">
            
            {/* 자산 대시보드 (LARGE) */}
            <div className="bg-[#111] p-12 rounded-[60px] border-4 border-[#daa520] shadow-2xl flex flex-col md:flex-row justify-between items-center gap-10 relative overflow-hidden">
                <div className="text-center md:text-left flex-1 font-black z-10">
                  <h3 className="text-white/30 text-sm uppercase tracking-[0.4em] mb-4">Imperial Total Assets</h3>
                  <p className="text-[#daa520] text-4xl md:text-8xl tracking-tighter leading-none font-black">
                    {Math.floor(beomToken).toLocaleString()}
                    <span className="text-xl md:text-3xl opacity-40">.{beomToken.toFixed(2).split('.')[1]}</span> 
                    <span className="ml-4 text-3xl">BEOM</span>
                  </p>
                  <div className="mt-8 bg-black/60 px-8 py-3 rounded-2xl border border-white/10 inline-block text-xl font-mono italic text-white/50 font-black">
                    ≈ {(beomToken / PI_TO_BEOM_RATIO).toFixed(4)} Pi
                  </div>
                </div>
                <div className="flex items-center gap-8 z-10">
                  <img src="/kedheon-character.png" className="w-24 h-24 md:w-40 md:h-40 rounded-[40px] border-2 border-white/10 shadow-2xl" alt="K" />
                  <img src="/beom-token.png" className="w-20 h-20 md:w-32 md:h-32 object-contain animate-pulse" alt="B" />
                </div>
            </div>

            {/* 🌐 01. 범토큰 환전소 (명확한 설명) */}
            <SectionHeader num="01" title="BEOM EXCHANGE" desc="파이코인 채굴 기여도를 제국 통화인 범토큰(BEOM)으로 즉시 환전하여 경제권을 확보하십시오." />
            <div className="bg-[#111] p-10 rounded-[45px] border-2 border-[#daa520] flex flex-col md:flex-row justify-between items-center gap-8 shadow-2xl">
              <div className="text-left font-black font-sans">
                <p className="text-white text-xl uppercase italic mb-2 font-black">Conversion Terminal</p>
                <p className="text-[#daa520] text-sm font-black uppercase tracking-widest font-sans">고정 비율: 1 Pi = 100 BEOM</p>
              </div>
              <button onClick={handleExchange} className="w-full md:w-auto bg-[#daa520] text-black px-16 py-6 rounded-3xl text-xl border-4 border-white active:scale-95 uppercase font-black shadow-xl font-sans">1 Pi 즉시 환전</button>
            </div>

            {/* 🌐 02. 보안 인증 (구체적인 설명 및 이미지 분리) */}
            <SectionHeader num="02" title="SECURE AUTH" desc="고유 QR코드를 발급받아 개인 보안을 강화하고 제국 내 모든 서비스의 인증 수단으로 사용하십시오." />
            <div className="bg-[#111] p-10 rounded-[45px] border-2 border-white/10 flex flex-col items-center gap-10 shadow-xl">
              <div className="flex gap-4 w-full max-w-sm bg-black p-2 rounded-2xl border-2 border-white/5 font-black font-sans">
                <button onClick={() => { setQrType('PERSONAL'); setIsQrActive(false); }} className={`flex-1 py-4 rounded-xl text-sm transition-all ${qrType === 'PERSONAL' ? 'bg-[#daa520] text-black border-2 border-white shadow-lg' : 'text-white/20'}`}>PERSONAL</button>
                <button onClick={() => { setQrType('BUSINESS'); setIsQrActive(false); }} className={`flex-1 py-4 rounded-xl text-sm transition-all ${qrType === 'BUSINESS' ? 'bg-[#daa520] text-black border-2 border-white shadow-lg' : 'text-white/20'}`}>BUSINESS</button>
              </div>
              
              {qrType === 'BUSINESS' && (
                <div className="w-full max-w-sm animate-in fade-in slide-in-from-top-2 font-black">
                  <p className="text-[#daa520] text-sm uppercase mb-3 ml-2 tracking-widest font-black font-sans font-bold">Enterprise Identity Name</p>
                  <input type="text" value={bizName} onChange={(e) => setBizName(e.target.value.toUpperCase())} placeholder="비즈니스 명칭 입력" className="w-full bg-black border-2 border-[#daa520] p-6 rounded-3xl text-center text-[#daa520] text-xl outline-none font-black font-sans shadow-inner font-bold" />
                </div>
              )}

              <div className={`p-8 bg-black border-4 rounded-[70px] transition-all flex flex-col items-center justify-center w-80 h-80 ${isQrActive ? 'border-[#daa520] shadow-[0_0_60px_rgba(218,165,32,0.4)]' : 'opacity-10 border-white'}`}>
                {isQrActive ? (
                  <>
                    <img src={qrType === 'PERSONAL' ? "/qr-personal.png" : "/qr-business.png"} className="w-56 h-56 rounded-2xl mb-4 shadow-2xl" alt="QR" />
                    <span className="text-[#daa520] text-sm uppercase tracking-widest font-black italic font-sans">{qrType === 'BUSINESS' ? bizName : 'Imperial Personal Security'}</span>
                  </>
                ) : (
                  <p className="text-white/5 text-2xl italic uppercase font-black tracking-[0.5em] font-sans">Security Locked</p>
                )}
              </div>
              <button onClick={() => { if(qrType==='BUSINESS' && !bizName) return alert("기업명을 입력하십시오."); setIsQrActive(true); setBeomToken(p => p - COSTS_BEOM.ACTIVATE_QR); }} className="w-full max-w-sm bg-[#daa520] text-black py-7 rounded-3xl text-xl border-4 border-white active:scale-95 uppercase font-black shadow-2xl font-sans">보안 QR 활성화 ({COSTS_BEOM.ACTIVATE_QR} BEOM)</button>
            </div>

            {/* 🌐 03. 창작 게시판 (카테고리 및 Praise 버튼) */}
            <SectionHeader num="03" title="CREATIVE BOARD" desc="영상이나 창작물을 게시하여 팬심을 증명하고, 다른 파이오니어들의 BEOM 호응을 끌어내십시오." />
            <div className="bg-[#111] p-10 rounded-[45px] border-2 border-[#daa520]/30 space-y-6 shadow-2xl font-black">
              <div className="flex gap-2 p-1 bg-black rounded-2xl border border-white/10 font-black">
                <button onClick={() => setPostType('POST')} className={`flex-1 py-4 rounded-xl text-sm transition-all ${postType === 'POST' ? 'bg-[#daa520] text-black border border-white' : 'text-white/30'}`}>일반 게시글</button>
                <button onClick={() => setPostType('CREATION')} className={`flex-1 py-4 rounded-xl text-sm transition-all ${postType === 'CREATION' ? 'bg-[#daa520] text-black border border-white' : 'text-white/30'}`}>개인 창작물</button>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
                {cats.map(cat => (
                  <button key={cat} onClick={() => setPostCategory(cat)} className={`px-5 py-2.5 rounded-full text-xs font-black whitespace-nowrap border-2 transition-all ${postCategory === cat ? 'bg-white text-black border-white' : 'border-white/10 text-white/40 hover:border-white/30'}`}>{cat}</button>
                ))}
              </div>
              <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="제목을 입력하십시오 (MEDIUM TEXT)" className="w-full bg-black border-2 border-white/10 p-6 rounded-2xl text-xl text-white outline-none focus:border-[#daa520] font-sans font-black shadow-inner" />
              <input value={newUrl} onChange={(e) => setNewUrl(e.target.value)} placeholder="영상(YouTube) 또는 이미지 링크 URL (SMALL TEXT)" className="w-full bg-black border-2 border-white/10 p-4 rounded-2xl text-sm text-[#daa520] outline-none font-sans font-bold shadow-inner" />
              <textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="창작 의도 및 상세 내용을 기록하십시오" className="w-full bg-black border-2 border-white/10 p-6 rounded-2xl text-sm text-white/70 h-40 outline-none font-sans font-bold shadow-inner" />
              <div className="flex gap-4">
                <button onClick={handlePost} className="flex-[2] bg-[#daa520] text-black py-6 rounded-3xl text-xl border-4 border-white uppercase shadow-xl font-black active:scale-95">피드 등록 ({COSTS_BEOM.POST_CREATION} BEOM)</button>
                <button className="flex-1 bg-white text-black py-6 rounded-3xl text-sm border-2 border-[#daa520] uppercase font-black font-sans leading-tight shadow-xl active:scale-95">🚩 팬방 개설<br/>({COSTS_BEOM.CREATE_FAN_ROOM} BEOM)</button>
              </div>
            </div>

            {/* 피드 리스트 (Praise 호응) */}
            <div className="space-y-10">
              {assets.map(a => (
                <div key={a.id} className="bg-[#111] p-12 rounded-[60px] border-2 border-white/5 shadow-2xl relative transition-all hover:border-[#daa520]/40 text-left font-black">
                  <div className="flex justify-between items-start mb-8 font-black">
                    <div className="flex flex-col gap-3">
                      <span className="text-[10px] text-[#daa520] font-black uppercase tracking-widest bg-[#daa520]/10 px-4 py-1.5 rounded-full w-fit">[{a.type}] {a.category}</span>
                      <h4 className="text-white text-3xl uppercase italic font-black underline underline-offset-[12px] decoration-[#daa520]/20">{a.title}</h4>
                    </div>
                    <span className="text-white/20 text-sm font-mono font-bold font-sans">{a.timestamp}</span>
                  </div>
                  {a.url && (
                    <div className="mb-8 p-6 bg-black rounded-[30px] flex justify-between items-center border-2 border-[#daa520]/20 font-sans font-bold shadow-inner">
                      <p className="text-xs text-[#daa520] truncate opacity-50 pr-8 italic font-sans">{a.url}</p>
                      <button onClick={() => window.open(a.url, '_blank')} className="bg-[#daa520] text-black px-8 py-3 rounded-2xl text-sm font-black uppercase whitespace-nowrap active:scale-95 shadow-xl font-sans">Watch Video 📺</button>
                    </div>
                  )}
                  <p className="text-white/70 text-xl italic leading-relaxed mb-10 font-sans font-bold">"{a.desc}"</p>
                  <div className="flex justify-between items-center border-t border-white/5 pt-10 font-black">
                    <button onClick={() => handleSupport(a.id)} className="bg-[#daa520] text-black px-12 py-5 rounded-3xl text-sm border-2 border-white uppercase font-black active:scale-95 shadow-2xl font-sans">👑 Praise ({COSTS_BEOM.SUPPORT})</button>
                    <p className="text-[#daa520] text-5xl tracking-tighter font-black font-sans">{a.beomSupport.toLocaleString()} <span className="text-sm font-black">BEOM</span></p>
                  </div>
                </div>
              ))}
            </div>

            {/* 🌐 04. 시장 및 후기 (판매 등록 박스 복구) */}
            <SectionHeader num="04" title="MERCHANT & REVIEWS" desc="제국의 희귀 굿즈를 거래하거나 판매 게시글을 직접 올려 상업적 주권을 행사하십시오." />
            
            {/* 판매 게시글 등록 박스 */}
            <div className="bg-[#111] p-10 rounded-[45px] border-2 border-[#daa520]/30 space-y-6 mb-12 shadow-2xl font-black">
              <h3 className="text-white text-xl uppercase italic font-black border-l-4 border-[#daa520] pl-4 mb-4 font-sans">Register Sale Item</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <input value={sellName} onChange={(e) => setSellName(e.target.value)} placeholder="판매 상품명 (MEDIUM TEXT)" className="w-full bg-black border-2 border-white/10 p-5 rounded-2xl text-xl text-white outline-none focus:border-[#daa520] font-sans font-black shadow-inner" />
                <input type="number" value={sellPrice} onChange={(e) => setSellPrice(e.target.value)} placeholder="판매 가격 (BEOM)" className="w-full bg-black border-2 border-white/10 p-5 rounded-2xl text-xl text-[#daa520] outline-none focus:border-[#daa520] font-sans font-black shadow-inner" />
              </div>
              <textarea value={sellDesc} onChange={(e) => setSellDesc(e.target.value)} placeholder="상품에 대한 상세 설명을 입력하십시오" className="w-full bg-black border-2 border-white/10 p-5 rounded-2xl text-sm text-white/70 h-32 outline-none font-sans font-bold shadow-inner" />
              <button onClick={handleSell} className="w-full bg-[#daa520] text-black py-6 rounded-3xl text-xl border-4 border-white uppercase font-black shadow-xl active:scale-95 font-sans">제국 시장에 상품 등록 ({COSTS_BEOM.SELL_ITEM} BEOM)</button>
            </div>

            <div className="grid md:grid-cols-2 gap-12 font-black text-left">
              <div className="space-y-8 font-black">
                <h3 className="text-white text-xl uppercase border-b-2 border-white/10 pb-3 italic font-black font-sans tracking-widest">Sales Board</h3>
                {goods.map(g => (
                  <div key={g.id} className="bg-[#111] p-10 rounded-[60px] border-2 border-white/10 shadow-2xl text-center group transition-all hover:border-[#daa520]/30 font-black">
                    <img src={g.img} className="w-full h-64 object-contain bg-black rounded-[45px] mb-8 shadow-inner transition-transform group-hover:scale-105" alt="G" />
                    <h4 className="text-white text-2xl uppercase mb-3 font-black">{g.name}</h4>
                    <p className="text-[#daa520] text-5xl mb-8 font-black font-sans">{g.price.toLocaleString()} <span className="text-sm">BEOM</span></p>
                    <button className="w-full py-6 bg-white text-black rounded-[30px] text-xl border-4 border-[#daa520] uppercase font-black active:scale-95 shadow-xl font-sans">Buy Now</button>
                  </div>
                ))}
              </div>
              <div className="space-y-8 font-black">
                <h3 className="text-white text-xl uppercase border-b-2 border-white/10 pb-3 italic font-black font-sans tracking-widest">Review Board</h3>
                {goods[0].reviews.map(r => (
                  <div key={r.id} className="bg-black/50 p-8 rounded-[40px] border-2 border-white/5 shadow-inner transition-all hover:border-[#daa520]/20 font-black">
                    <p className="text-white/80 text-sm italic font-sans mb-4 font-bold leading-relaxed font-sans font-black">"{r.text}"</p>
                    <div className="flex justify-between items-center text-[11px] font-mono text-[#daa520] font-black uppercase tracking-[0.2em] font-sans font-black">
                      <span>- {r.user}</span>
                      <span className="text-white/20 font-sans">{r.timestamp}</span>
                    </div>
                  </div>
                ))}
                <button className="w-full py-6 border-2 border-dashed border-white/10 rounded-[30px] text-sm text-white/30 uppercase font-black hover:border-[#daa520] hover:text-[#daa520] transition-all font-sans font-bold shadow-inner">Write Experience Review</button>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* --- [하단 통합 네비게이션: 고정형] --- */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-black/95 border-2 border-[#daa520] p-2 rounded-[30px] flex gap-4 z-[200] shadow-[0_0_60px_rgba(218,165,32,0.6)] backdrop-blur-2xl font-black font-sans">
        {['KEDHEON', 'CIVIL', 'NEXUS', 'VENDOR'].map(app => (
          <button key={app} className={`px-8 py-4 rounded-2xl text-sm transition-all font-black ${app === 'KEDHEON' ? 'bg-[#daa520] text-black scale-110 shadow-lg' : 'text-white/30 hover:text-white'}`}>{app}</button>
        ))}
      </div>

      {/* 푸터: 버전 정보 명시 */}
      <div className="mt-40 opacity-20 text-sm tracking-[1.5em] uppercase pb-20 font-sans font-black text-center">
        Kedheon Empire | V68.0 Prestige Master | @Ohsangjo
      </div>
    </div>
  );
}
