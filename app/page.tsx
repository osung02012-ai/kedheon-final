'use client';
import React, { useState, useEffect } from 'react';

/** * [KEDHEON EMPIRE V75.0 PRESTIGE LEGACY MASTER]
 * -----------------------------------------------------------
 * 1. 고대비(High-Contrast): 모든 박스 경계 border-white/40 적용 (모바일 가시성 확보)
 * 2. 기능 통합: Pi 환전, 개인/기업 QR 분리, 이미지 마켓, 호응 시스템 완결
 * 3. 텍스트 규격: Large(4xl/2xl), Medium(xl/lg), Small(sm/11px) 엄격 적용
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

// --- [데이터 스키마] ---
interface Review { id: number; user: string; text: string; timestamp: string; }
interface Asset { id: number; title: string; desc: string; category: string; type: string; beomSupport: number; timestamp: string; url?: string; }
interface Good { id: number; name: string; price: number; img: string; seller: string; desc: string; reviews: Review[]; }

export default function KedheonPortal() {
  const [hasMounted, setHasMounted] = useState(false);
  const [tab, setTab] = useState<'ROOKIE' | 'PIONEER'>('ROOKIE');
  const [beomToken, setBeomToken] = useState(7991.88); 
  
  // 보안 및 비즈니스 상태
  const [qrType, setQrType] = useState<'PERSONAL' | 'BUSINESS'>('PERSONAL');
  const [bizName, setBizName] = useState('');
  const [isQrActive, setIsQrActive] = useState(false);
  
  // 게시판 상태
  const [postCategory, setPostCategory] = useState('TECH');
  const [assets, setAssets] = useState<Asset[]>([]); 
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newUrl, setNewUrl] = useState('');

  // 마켓 상태
  const [goods, setGoods] = useState<Good[]>([
    { id: 1, name: "EMPIRE GOLD BADGE", price: 1000, img: "/beom-token.png", seller: "Imperial", desc: "제국 공인 고유 황금 뱃지", reviews: [{ id: 1, user: "Pioneer_Alpha", text: "실물 보안 각인이 매우 정교합니다.", timestamp: "2026.04.29" }] }
  ]);
  const [sellName, setSellName] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [sellDesc, setSellDesc] = useState('');
  const [sellImg, setSellImg] = useState('');

  const cats = ['MUSIC', 'TECH', 'ART', 'FOOD', 'TRAVEL', 'GAME', 'NEWS', 'MOVIE', 'ESPORTS', 'COMEDY'];

  // --- [Persistence: 데이터 저장 및 복구] ---
  useEffect(() => {
    setHasMounted(true);
    const saved = localStorage.getItem('kedheon_v75_final');
    if (saved) {
      try {
        const p = JSON.parse(saved);
        if (p.token !== undefined) setBeomToken(p.token);
        if (Array.isArray(p.assets)) setAssets(p.assets);
        if (Array.isArray(p.goods)) setGoods(p.goods);
        if (p.isQrActive !== undefined) setIsQrActive(p.isQrActive);
      } catch (e) { console.error("Data Restore Error", e); }
    }
  }, []);

  useEffect(() => {
    if (hasMounted) {
      localStorage.setItem('kedheon_v75_final', JSON.stringify({ token: beomToken, assets, goods, isQrActive }));
    }
  }, [beomToken, assets, goods, isQrActive, hasMounted]);

  // --- [핵심 비즈니스 로직] ---
  const handleExchange = () => setBeomToken(prev => prev + PI_TO_BEOM_RATIO);

  const handleActivateQr = () => {
    if (qrType === 'BUSINESS' && !bizName.trim()) return alert("기업명을 정확히 입력하십시오.");
    if (beomToken < COSTS_BEOM.ACTIVATE_QR) return alert("자산이 부족합니다.");
    setBeomToken(prev => prev - COSTS_BEOM.ACTIVATE_QR);
    setIsQrActive(true);
    alert("보안 QR코드가 활성화되었습니다.");
  };

  const handlePost = () => {
    if(!newTitle.trim()) return alert("제목을 입력하십시오.");
    if(beomToken < COSTS_BEOM.POST_CREATION) return alert("자산 부족");
    const post: Asset = { id: Date.now(), title: newTitle, desc: newDesc, category: postCategory, type: 'CREATION', beomSupport: 0, timestamp: new Date().toLocaleDateString(), url: newUrl };
    setAssets([post, ...assets]);
    setBeomToken(p => p - COSTS_BEOM.POST_CREATION);
    setNewTitle(''); setNewDesc(''); setNewUrl('');
    alert("피드가 등록되었습니다.");
  };

  const handleSupport = (id: number) => {
    if (beomToken < COSTS_BEOM.SUPPORT) return alert("호응 자산 부족");
    setBeomToken(p => p - COSTS_BEOM.SUPPORT);
    setAssets(assets.map(a => a.id === id ? { ...a, beomSupport: a.beomSupport + COSTS_BEOM.SUPPORT } : a));
  };

  const handleSell = () => {
    if(!sellName.trim() || !sellPrice) return alert("정보 입력 필수");
    if(beomToken < COSTS_BEOM.SELL_ITEM) return alert("자산 부족");
    const newGood: Good = { id: Date.now(), name: sellName, price: Number(sellPrice), img: sellImg || "/kedheon-character.png", seller: "Citizen", desc: sellDesc, reviews: [] };
    setGoods([newGood, ...goods]);
    setBeomToken(p => p - COSTS_BEOM.SELL_ITEM);
    setSellName(''); setSellPrice(''); setSellDesc(''); setSellImg('');
    alert("상품이 등록되었습니다.");
  };

  // --- [공통 UI 컴포넌트] ---
  const SectionHeader = ({ num, title, desc }: { num: string; title: string; desc: string }) => (
    <div className="w-full border-t-2 border-white/20 pt-6 md:pt-10 mb-4 md:mb-8 text-left font-black">
      <h2 className="text-[#daa520] text-2xl md:text-4xl uppercase italic mb-1 border-l-4 border-[#daa520] pl-3 leading-tight tracking-tighter drop-shadow-lg">
        {num}. 🌐 {title}
      </h2>
      <p className="text-white/60 text-[11px] md:text-sm font-sans font-bold leading-tight pl-4 italic">{desc}</p>
    </div>
  );

  if (!hasMounted) return null;

  return (
    <div className="flex flex-col items-center bg-black min-h-screen text-white font-sans w-full pb-40 font-black overflow-x-hidden">
      
      {/* --- [GNB: 버전 정보 및 상단 고정] --- */}
      <div className="w-full max-w-4xl flex justify-between items-center px-4 py-3 md:p-5 sticky top-0 bg-black/95 backdrop-blur-xl z-[150] border-b-2 border-[#daa520]/50 shadow-2xl">
        <div className="flex items-center gap-2">
          <img src="/kedheon-character.png" className="w-9 h-9 md:w-12 md:h-12 rounded-lg border-2 border-[#daa520]" alt="K" />
          <div className="text-left font-black leading-none">
            <h2 className="text-[#daa520] text-lg md:text-xl italic uppercase tracking-tighter">Kedheon</h2>
            <span className="text-white/50 text-[8px] md:text-[10px] font-mono tracking-widest uppercase">v75.0 Legacy Master</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setTab('ROOKIE')} className={`px-4 md:px-6 py-2 rounded-lg text-[11px] md:text-sm border-2 transition-all ${tab === 'ROOKIE' ? 'bg-[#daa520] text-black border-white' : 'border-white/10 text-white/40'}`}>ROOKIE</button>
          <button onClick={() => setTab('PIONEER')} className={`px-4 md:px-6 py-2 rounded-lg text-[11px] md:text-sm border-2 transition-all ${tab === 'PIONEER' ? 'bg-[#daa520] text-black border-white' : 'border-white/10 text-white/40'}`}>PIONEER</button>
        </div>
      </div>

      <div className="w-full max-w-4xl px-3 md:px-6 py-4 md:py-8">
        {tab === 'ROOKIE' ? (
          /* --- [ROOKIE: 가입 절차 섹션] --- */
          <div className="flex flex-col gap-6 md:gap-12 animate-in fade-in text-left">
            <div className="flex flex-col items-center text-center gap-6 py-12 bg-[#111] rounded-[40px] border-4 border-[#daa520] shadow-2xl relative overflow-hidden">
              <img src="/kedheon-character.png" className="w-40 h-40 md:w-56 md:h-56 rounded-[40px] border-2 border-white shadow-2xl relative z-10" alt="Main" />
              <div className="relative z-10 px-6 font-black">
                <h1 className="text-[#daa520] text-3xl md:text-6xl uppercase mb-1 tracking-tighter">Web3 초대합니다.</h1>
                <p className="text-white text-lg md:text-2xl uppercase tracking-widest border-b-2 border-[#daa520] pb-2 inline-block font-black">파이코인 가입절차</p>
                <p className="text-white/40 text-[11px] md:text-sm mt-4 font-sans max-w-lg mx-auto leading-tight italic font-bold">제국 시민권 획득을 위한 가장 정밀한 8단계 가이드를 확인하십시오.</p>
              </div>
            </div>

            <div className="grid gap-3 md:gap-4 font-black">
              {[
                { s: "STEP 01", t: "애플리케이션 설치", d: "스토어에서 [Pi Network] 공식 앱을 검색하여 설치하십시오." },
                { s: "STEP 02", t: "가입 방식 선택", d: "보안성이 검증된 [Continue with phone number]를 선택하십시오." },
                { s: "STEP 03", t: "국가 코드 설정", d: "국가 코드를 [+82(South Korea)]로 설정 후 본인 번호를 입력하십시오." },
                { s: "STEP 04", t: "보안 비밀번호 생성", d: "영문 대/소문자와 숫자를 조합하여 강력한 암호를 만드십시오." },
                { s: "STEP 05", t: "여권 영문 실명 입력", d: "실명 프로필을 작성하고 제국에서 사용할 유일한 아이디(ID)를 정하십시오." },
                { s: "STEP 06", t: "초대 코드 입력", d: `입국 승인을 위해 초대 코드 [ ${PI_INVITE_CODE} ]를 정확히 입력하십시오.`, gold: true },
                { s: "STEP 07", t: "비밀구절 수기 보관", d: "지갑 생성 시 부여되는 24개 단어를 오직 종이에만 기록하십시오.", danger: true },
                { s: "STEP 08", t: "채굴 활성화", d: "메인 화면의 번개 버튼을 눌러 정식 시민권을 활성화하십시오.", gold: true }
              ].map((step, idx) => (
                <div key={idx} className={`p-4 md:p-6 bg-[#111] rounded-2xl md:rounded-3xl border-2 shadow-xl flex items-center gap-4 md:gap-8 transition-all ${step.gold ? 'border-[#daa520] bg-[#daa520]/5 shadow-[#daa520]/10' : step.danger ? 'border-red-600 shadow-red-900/10' : 'border-white/20'}`}>
                  <span className="text-[#daa520] text-xs md:text-sm font-black whitespace-nowrap">{step.s}</span>
                  <div className="flex flex-col">
                    <h3 className="text-white text-[14px] md:text-xl font-black">{step.t}</h3>
                    <p className="text-white/40 text-[10px] md:text-sm font-sans font-bold leading-tight mt-1">{step.d}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3 pt-4">
              <button onClick={() => window.open(PI_APP_STORE_URL)} className="flex-1 bg-white text-black py-4 md:py-6 rounded-2xl md:rounded-3xl text-sm md:text-xl font-black uppercase border-4 border-[#daa520] active:scale-95 shadow-xl">App Store</button>
              <button onClick={() => window.open(PI_PLAY_STORE_URL)} className="flex-1 bg-white text-black py-4 md:py-6 rounded-2xl md:rounded-3xl text-sm md:text-xl font-black uppercase border-4 border-[#daa520] active:scale-95 shadow-xl">Play Store</button>
            </div>
          </div>
        ) : (
          /* --- [PIONEER: 핵심 경제 및 인터랙션 섹션] --- */
          <div className="flex flex-col gap-10 md:gap-16 py-2 text-left font-black animate-in slide-in-from-bottom-2">
            
            {/* 자산 대시보드 (HIGH-CONTRAST) */}
            <div className="bg-[#1a1a1a] p-8 md:p-14 rounded-[50px] md:rounded-[70px] border-4 border-[#daa520] shadow-[0_0_60px_rgba(218,165,32,0.2)] flex justify-between items-center relative overflow-hidden">
                <div className="text-left font-black z-10">
                  <h3 className="text-white/50 text-[10px] md:text-[14px] uppercase tracking-[0.4em] mb-2 font-sans">Imperial Assets</h3>
                  <p className="text-[#daa520] text-4xl md:text-8xl tracking-tighter leading-none font-black drop-shadow-xl">
                    {Math.floor(beomToken).toLocaleString()}
                    <span className="text-lg md:text-4xl opacity-50">.{beomToken.toFixed(2).split('.')[1]}</span> 
                    <span className="ml-3 text-xl md:text-5xl">BEOM</span>
                  </p>
                  <div className="mt-4 md:mt-8 bg-black/70 px-6 py-2 rounded-xl border border-white/20 inline-block text-sm md:text-2xl font-mono italic text-white/60">
                    ≈ {(beomToken / PI_TO_BEOM_RATIO).toFixed(4)} Pi
                  </div>
                </div>
                <img src="/beom-token.png" className="w-20 h-20 md:w-44 md:h-44 object-contain animate-pulse shadow-[0_0_40px_rgba(218,165,32,0.4)]" alt="B" />
            </div>

            {/* 🌐 01. 환전소 섹션 */}
            <SectionHeader num="01" title="BEOM EXCHANGE" desc="파이코인 채굴 기여도를 제국 통화인 범토큰(BEOM)으로 즉시 환전하여 경제 주권을 행사하십시오." />
            <div className="bg-[#111] p-6 md:p-12 rounded-[40px] border-2 border-white/30 flex flex-col md:flex-row justify-between items-center gap-6 shadow-2xl transition-all hover:border-[#daa520]">
              <div className="text-left font-sans">
                <p className="text-white text-lg md:text-2xl italic font-black uppercase mb-1">Conversion Terminal</p>
                <p className="text-[#daa520] text-xs md:text-sm font-black uppercase tracking-widest">Fixed Ratio: 1 Pi = 100 BEOM</p>
              </div>
              <button onClick={handleExchange} className="w-full md:w-auto bg-[#daa520] text-black px-12 md:px-20 py-4 md:py-7 rounded-2xl md:rounded-[30px] text-lg md:text-2xl border-4 border-white active:scale-95 uppercase font-black shadow-2xl">1 Pi 즉시 환전</button>
            </div>

            {/* 🌐 02. 보안 인증 섹션 (고유 QR코드 발급) */}
            <SectionHeader num="02" title="SECURE AUTH" desc="큐알코드를 발급받아 개인 보안을 강화하고 제국 내 모든 서비스의 인증 수단으로 사용하십시오." />
            <div className="bg-[#111] p-8 md:p-14 rounded-[45px] border-2 border-white/20 flex flex-col items-center gap-10 shadow-2xl">
              <div className="flex gap-3 w-full max-w-sm bg-black p-2 rounded-2xl border-2 border-white/10 font-black">
                <button onClick={() => { setQrType('PERSONAL'); setIsQrActive(false); }} className={`flex-1 py-3 md:py-5 rounded-xl text-xs md:text-sm transition-all font-black border-2 ${qrType === 'PERSONAL' ? 'bg-[#daa520] text-black border-white shadow-xl' : 'border-transparent text-white/40'}`}>PERSONAL</button>
                <button onClick={() => { setQrType('BUSINESS'); setIsQrActive(false); }} className={`flex-1 py-3 md:py-5 rounded-xl text-xs md:text-sm transition-all font-black border-2 ${qrType === 'BUSINESS' ? 'bg-[#daa520] text-black border-white shadow-xl' : 'border-transparent text-white/40'}`}>BUSINESS</button>
              </div>
              {qrType === 'BUSINESS' && (
                <input value={bizName} onChange={(e) => setBizName(e.target.value.toUpperCase())} placeholder="비즈니스 명칭 입력" className="w-full max-w-sm bg-black border-2 border-[#daa520] p-5 rounded-3xl text-center text-[#daa520] text-xl outline-none font-black font-sans shadow-inner shadow-[#daa520]/10 transition-all focus:shadow-[#daa520]/30" />
              )}
              <div className={`p-6 bg-black border-4 rounded-[60px] flex flex-col items-center justify-center w-64 h-64 md:w-80 md:h-80 transition-all duration-500 ${isQrActive ? 'border-[#daa520] shadow-[0_0_80px_rgba(218,165,32,0.3)]' : 'opacity-10 border-white/30'}`}>
                {isQrActive ? (
                  <>
                    <img src={qrType === 'PERSONAL' ? "/qr-personal.png" : "/qr-business.png"} className="w-48 h-48 md:w-60 md:h-60 rounded-xl shadow-2xl mb-4 border border-white/10" alt="QR" />
                    <span className="text-[#daa520] text-[10px] md:text-sm uppercase tracking-widest font-black italic drop-shadow-md">{bizName || 'Imperial Verified'}</span>
                  </>
                ) : (
                  <p className="text-white/10 text-lg md:text-2xl font-black uppercase italic tracking-[0.5em] font-sans">Security Locked</p>
                )}
              </div>
              <button onClick={handleActivateQr} className="w-full max-w-xs bg-[#daa520] text-black py-5 md:py-8 rounded-2xl md:rounded-[40px] text-lg md:text-2xl border-4 border-white active:scale-95 uppercase font-black shadow-2xl hover:scale-105 transition-transform">보안 QR 활성화 (50)</button>
            </div>

            {/* 🌐 03. 창작 게시판 섹션 (카테고리 필터 및 호응) */}
            <SectionHeader num="03" title="CREATIVE BOARD" desc="영상이나 창작물을 게시하여 팬심을 증명하고 파이오니어들의 호응을 이끌어내 보상을 획득하십시오." />
            <div className="bg-[#111] p-6 md:p-12 rounded-[45px] border-2 border-white/20 space-y-6 shadow-2xl text-left">
              <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
                {cats.map(cat => (
                  <button key={cat} onClick={() => setPostCategory(cat)} className={`px-5 py-2.5 rounded-full text-[10px] md:text-xs font-black border-2 transition-all ${postCategory === cat ? 'bg-white text-black border-[#daa520] shadow-lg' : 'border-white/10 text-white/40'}`}>{cat}</button>
                ))}
              </div>
              <div className="space-y-4">
                <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="제목을 입력하십시오 (MEDIUM TEXT)" className="w-full bg-[#1a1a1a] border-2 border-white/30 p-5 rounded-2xl text-lg md:text-xl text-white outline-none focus:border-[#daa520] transition-all font-black" />
                <input value={newUrl} onChange={(e) => setNewUrl(e.target.value)} placeholder="영상 또는 이미지 URL 링크 (SMALL TEXT)" className="w-full bg-[#1a1a1a] border-2 border-white/30 p-4 rounded-2xl text-sm text-[#daa520] outline-none font-bold" />
                <textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="창작 의도 및 상세 내용을 기록하십시오" className="w-full bg-[#1a1a1a] border-2 border-white/30 p-5 rounded-2xl text-sm md:text-lg text-white/70 h-32 md:h-44 outline-none font-bold" />
              </div>
              <div className="flex gap-4">
                <button onClick={handlePost} className="flex-[2] bg-[#daa520] text-black py-5 md:py-7 rounded-2xl md:rounded-[40px] text-lg md:text-2xl border-4 border-white uppercase font-black shadow-xl active:scale-95 transition-all">피드 등록 (10)</button>
                <button className="flex-1 bg-white text-black py-5 md:py-7 rounded-2xl md:rounded-[40px] text-[10px] md:text-sm border-2 border-[#daa520] uppercase font-black leading-tight shadow-xl">🚩 팬방 개설<br/>(500)</button>
              </div>
            </div>

            {/* 창작물 피드 리스트 (Adaptive Praise) */}
            <div className="space-y-6 md:space-y-12">
              {assets.map(a => (
                <div key={a.id} className="bg-[#111] p-8 md:p-14 rounded-[50px] md:rounded-[70px] border-2 border-white/10 shadow-2xl relative transition-all hover:border-[#daa520]/40">
                  <div className="flex justify-between items-start mb-8 font-black">
                    <div className="flex flex-col gap-3">
                      <span className="text-[10px] text-[#daa520] font-black uppercase tracking-widest bg-[#daa520]/10 px-4 py-1.5 rounded-full w-fit border border-[#daa520]/20">{a.category}</span>
                      <h4 className="text-white text-2xl md:text-4xl uppercase italic font-black underline underline-offset-[14px] decoration-[#daa520]/30">{a.title}</h4>
                    </div>
                    <span className="text-white/30 text-[10px] md:text-sm font-mono font-bold font-sans">{a.timestamp}</span>
                  </div>
                  {a.url && (
                    <div className="mb-8 p-4 md:p-8 bg-black rounded-3xl flex justify-between items-center border-2 border-[#daa520]/30 font-sans font-bold shadow-inner shadow-[#daa520]/5">
                      <p className="text-[10px] md:text-sm text-[#daa520] truncate opacity-50 pr-8 italic font-sans">{a.url}</p>
                      <button onClick={() => window.open(a.url, '_blank')} className="bg-[#daa520] text-black px-6 md:px-10 py-3 md:py-4 rounded-xl md:rounded-2xl text-[10px] md:text-sm font-black uppercase whitespace-nowrap active:scale-95 shadow-2xl">Watch 📺</button>
                    </div>
                  )}
                  <p className="text-white/70 text-lg md:text-2xl italic leading-relaxed mb-10 font-sans font-bold">"{a.desc}"</p>
                  <div className="flex justify-between items-center border-t-2 border-white/5 pt-10 font-black">
                    <button onClick={() => handleSupport(a.id)} className="bg-[#daa520] text-black px-10 md:px-16 py-4 md:py-6 rounded-2xl md:rounded-[40px] text-xs md:text-lg border-2 border-white uppercase font-black active:scale-95 shadow-2xl hover:scale-105">👑 Praise (100)</button>
                    <p className="text-[#daa520] text-4xl md:text-7xl tracking-tighter font-black font-sans">{a.beomSupport.toLocaleString()} <span className="text-sm md:text-2xl font-black">BEOM</span></p>
                  </div>
                </div>
              ))}
            </div>

            {/* 🌐 04. 시장 및 후기 섹션 (이미지 등록 포함) */}
            <SectionHeader num="04" title="MERCHANT & REVIEWS" desc="제국의 희귀 굿즈를 거래하거나 판매 글을 직접 올려 상업 주권을 행사하십시오. 이미지 등록이 가능합니다." />
            
            <div className="bg-[#111] p-8 md:p-14 rounded-[45px] border-2 border-[#daa520]/50 space-y-6 md:space-y-10 mb-10 shadow-2xl font-black">
              <h3 className="text-white text-sm md:text-xl uppercase italic font-black border-l-4 border-[#daa520] pl-3 mb-4 font-sans tracking-widest">Register Sale Item</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input value={sellName} onChange={(e) => setSellName(e.target.value)} placeholder="상품명 (MEDIUM TEXT)" className="w-full bg-[#1a1a1a] border-2 border-white/30 p-5 rounded-2xl text-xl text-white outline-none focus:border-[#daa520] font-black shadow-inner" />
                <input type="number" value={sellPrice} onChange={(e) => setSellPrice(e.target.value)} placeholder="판매 가격 (BEOM)" className="w-full bg-[#1a1a1a] border-2 border-white/30 p-5 rounded-2xl text-xl text-[#daa520] outline-none focus:border-[#daa520] font-black shadow-inner" />
              </div>
              <input value={sellImg} onChange={(e) => setSellImg(e.target.value)} placeholder="제품 이미지 URL (링크 주소 붙여넣기)" className="w-full bg-[#1a1a1a] border-2 border-white/30 p-4 rounded-2xl text-sm text-[#daa520] outline-none font-bold shadow-inner" />
              <textarea value={sellDesc} onChange={(e) => setSellDesc(e.target.value)} placeholder="상품에 대한 상세 설명을 기록하십시오" className="w-full bg-[#1a1a1a] border-2 border-white/30 p-5 rounded-2xl text-sm md:text-lg text-white/70 h-32 md:h-44 outline-none font-bold shadow-inner" />
              <button onClick={handleSell} className="w-full bg-[#daa520] text-black py-5 md:py-8 rounded-2xl md:rounded-[40px] text-lg md:text-2xl border-4 border-white uppercase font-black shadow-2xl active:scale-95 transition-all">시장에 상품 등록 (20 BEOM)</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 font-black text-left">
              {/* 판매 보드 */}
              <div className="space-y-6 md:space-y-10">
                <h3 className="text-white text-sm md:text-xl uppercase border-b-4 border-white/10 pb-2 italic font-black font-sans tracking-[0.2em]">Sales Board</h3>
                {goods.map(g => (
                  <div key={g.id} className="bg-[#111] p-8 md:p-12 rounded-[50px] border-2 border-white/10 shadow-2xl text-center group font-black transition-all hover:border-[#daa520]/40">
                    <img src={g.img} className="w-full h-48 md:h-72 object-contain bg-black rounded-[40px] border-2 border-white/10 mb-8 shadow-inner transition-transform group-hover:scale-105" alt="G" />
                    <h4 className="text-white text-xl md:text-3xl uppercase mb-1 md:mb-3 font-black leading-none">{g.name}</h4>
                    <p className="text-[#daa520] text-3xl md:text-6xl mb-8 font-black font-sans tracking-tighter">{g.price.toLocaleString()} <span className="text-sm md:text-xl">BEOM</span></p>
                    <button className="w-full py-4 md:py-7 bg-white text-black rounded-2xl md:rounded-[40px] text-lg md:text-2xl border-4 border-[#daa520] uppercase font-black active:scale-95 shadow-2xl transition-all">Buy Now</button>
                  </div>
                ))}
              </div>
              {/* 후기 보드 */}
              <div className="space-y-6 md:space-y-10">
                <h3 className="text-white text-sm md:text-xl uppercase border-b-4 border-white/10 pb-2 italic font-black font-sans tracking-[0.2em]">Review Board</h3>
                {goods[0].reviews.map(r => (
                  <div key={r.id} className="bg-black/50 p-6 md:p-10 rounded-[35px] border-2 border-white/10 shadow-inner font-black transition-all hover:border-[#daa520]/20">
                    <p className="text-white/80 text-[12px] md:text-lg italic font-sans mb-4 md:mb-6 font-bold leading-relaxed">"{r.text}"</p>
                    <div className="flex justify-between items-center text-[10px] md:text-sm font-mono text-[#daa520] font-black uppercase tracking-widest">
                      <span>- {r.user}</span>
                      <span className="text-white/20">{r.timestamp}</span>
                    </div>
                  </div>
                ))}
                <button className="w-full py-5 md:py-8 border-4 border-dashed border-white/10 rounded-[30px] md:rounded-[50px] text-[10px] md:text-sm text-white/40 uppercase font-black hover:border-[#daa520] hover:text-[#daa520] transition-all font-sans shadow-inner">Write Experience Review</button>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* --- [하단 통합 네비게이션: 간격 균등화 및 터치 최적화] --- */}
      <div className="fixed bottom-6 left-4 right-4 max-w-4xl mx-auto bg-black/95 border-2 border-[#daa520] p-1.5 rounded-[30px] flex justify-between gap-1 z-[200] shadow-[0_0_60px_rgba(218,165,32,0.6)] backdrop-blur-3xl font-black">
        {['KEDHEON', 'CIVIL', 'NEXUS', 'VENDOR'].map(app => (
          <button key={app} className={`flex-1 py-4 md:py-5 rounded-[25px] text-[11px] md:text-sm transition-all font-black text-center ${app === 'KEDHEON' ? 'bg-[#daa520] text-black border-2 border-white shadow-inner scale-100' : 'text-white/40 hover:text-white'}`}>{app}</button>
        ))}
      </div>

      {/* --- [푸터: 버전 정보 명시] --- */}
      <div className="mt-40 opacity-20 text-[10px] md:text-[14px] tracking-[1.5em] uppercase pb-20 font-sans font-black text-center">
        Kedheon Empire | V75.0 Legacy Master | @Ohsangjo
      </div>
    </div>
  );
}
