'use client';
import React, { useState, useEffect } from 'react';

/** * [KEDHEON EMPIRE V78.0 FINAL LEGACY MASTER]
 * -----------------------------------------------------------
 * 1. 모바일 가시성: 모든 박스 경계 border-white/30~40 상향 (경계 명확화)
 * 2. 와이드 QR: BUSINESS 선택 시 16:9 비율 전환 및 실시간 네이밍 오버레이
 * 3. 통합 로직: 환전, 인증, 창작 피드, 이미지 등록 마켓, 호응 시스템 완결
 * 4. 앱 스위처: 하단 네비게이션 flex-1 균등 간격 재배치
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

// --- [데이터 인터페이스] ---
interface Review { id: number; user: string; text: string; timestamp: string; }
interface Asset { id: number; title: string; desc: string; category: string; type: string; beomSupport: number; timestamp: string; url?: string; }
interface Good { id: number; name: string; price: number; img: string; seller: string; desc: string; reviews: Review[]; }

export default function KedheonPortal() {
  const [hasMounted, setHasMounted] = useState(false);
  const [tab, setTab] = useState<'ROOKIE' | 'PIONEER'>('ROOKIE');
  const [beomToken, setBeomToken] = useState(7991.88); 
  
  // 보안 및 비즈니스 인증 상태
  const [qrType, setQrType] = useState<'PERSONAL' | 'BUSINESS'>('PERSONAL');
  const [bizName, setBizName] = useState('');
  const [isQrActive, setIsQrActive] = useState(false);
  
  // 창작 게시판 상태
  const [postCategory, setPostCategory] = useState('TECH');
  const [assets, setAssets] = useState<Asset[]>([]); 
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newUrl, setNewUrl] = useState('');

  // 마켓 게시판 상태
  const [goods, setGoods] = useState<Good[]>([
    { id: 1, name: "EMPIRE GOLD BADGE", price: 1000, img: "/beom-token.png", seller: "Imperial", desc: "제국 공인 고유 황금 뱃지", reviews: [{ id: 1, user: "Citizen_Alpha", text: "실물 보안 각인이 훌륭합니다.", timestamp: "2026.04.29" }] }
  ]);
  const [sellName, setSellName] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [sellDesc, setSellDesc] = useState('');
  const [sellImg, setSellImg] = useState('');

  const cats = ['MUSIC', 'TECH', 'ART', 'FOOD', 'TRAVEL', 'GAME', 'NEWS', 'MOVIE'];

  // --- [Persistence: 로컬 저장소 연동] ---
  useEffect(() => {
    setHasMounted(true);
    const saved = localStorage.getItem('kedheon_v78_master');
    if (saved) {
      try {
        const p = JSON.parse(saved);
        if (p.token !== undefined) setBeomToken(p.token);
        if (p.assets) setAssets(p.assets);
        if (p.goods) setGoods(p.goods);
        if (p.isQrActive !== undefined) setIsQrActive(p.isQrActive);
      } catch (e) { console.error(e); }
    }
  }, []);

  useEffect(() => {
    if (hasMounted) {
      localStorage.setItem('kedheon_v78_master', JSON.stringify({ token: beomToken, assets, goods, isQrActive }));
    }
  }, [beomToken, assets, goods, isQrActive, hasMounted]);

  // --- [로직 핸들러] ---
  const handleExchange = () => {
    setBeomToken(prev => prev + PI_TO_BEOM_RATIO);
    alert("환전 완료");
  };

  const handleActivateQr = () => {
    if (qrType === 'BUSINESS' && !bizName.trim()) return alert("기업명을 입력하십시오.");
    if (beomToken < COSTS_BEOM.ACTIVATE_QR) return alert("자산 부족");
    setBeomToken(prev => prev - COSTS_BEOM.ACTIVATE_QR);
    setIsQrActive(true);
  };

  const handlePost = () => {
    if(!newTitle.trim()) return alert("제목 필수");
    if(beomToken < COSTS_BEOM.POST_CREATION) return alert("자산 부족");
    const post: Asset = { id: Date.now(), title: newTitle, desc: newDesc, category: postCategory, type: 'POST', beomSupport: 0, timestamp: new Date().toLocaleDateString(), url: newUrl };
    setAssets([post, ...assets]);
    setBeomToken(p => p - COSTS_BEOM.POST_CREATION);
    setNewTitle(''); setNewDesc(''); setNewUrl('');
    alert("등록 완료");
  };

  const handleSupport = (id: number) => {
    if (beomToken < COSTS_BEOM.SUPPORT) return alert("호응 자산 부족");
    setBeomToken(p => p - COSTS_BEOM.SUPPORT);
    setAssets(assets.map(a => a.id === id ? { ...a, beomSupport: a.beomSupport + COSTS_BEOM.SUPPORT } : a));
  };

  const handleSell = () => {
    if(!sellName.trim() || !sellPrice) return alert("정보 입력 필수");
    if(beomToken < COSTS_BEOM.SELL_ITEM) return alert("자산 부족");
    const newGood: Good = { id: Date.now(), name: sellName, price: Number(sellPrice), img: sellImg || "/kedheon-character.png", seller: "Pioneer", desc: sellDesc, reviews: [] };
    setGoods([newGood, ...goods]);
    setBeomToken(p => p - COSTS_BEOM.SELL_ITEM);
    setSellName(''); setSellPrice(''); setSellDesc(''); setSellImg('');
    alert("상품 등록 완료");
  };

  // 공통 섹션 헤더
  const SectionHeader = ({ num, title, desc }: { num: string; title: string; desc: string }) => (
    <div className="w-full border-t-2 border-white/20 pt-6 md:pt-10 mb-4 md:mb-8 text-left font-black">
      <h2 className="text-[#daa520] text-3xl md:text-4xl uppercase italic mb-1 border-l-4 border-[#daa520] pl-3 leading-tight tracking-tighter shadow-sm">
        {num}. 🌐 {title}
      </h2>
      <p className="text-white/60 text-[12px] md:text-sm font-sans font-bold leading-tight pl-4 italic">{desc}</p>
    </div>
  );

  if (!hasMounted) return null;

  return (
    <div className="flex flex-col items-center bg-black min-h-screen text-white font-sans w-full pb-40 font-black overflow-x-hidden">
      
      {/* --- [GNB: 버전 및 상단 고정] --- */}
      <div className="w-full max-w-4xl flex justify-between items-center px-4 py-4 md:p-5 sticky top-0 bg-black/95 backdrop-blur-xl z-[150] border-b-2 border-[#daa520]/40 shadow-2xl">
        <div className="flex items-center gap-2">
          <img src="/kedheon-character.png" className="w-10 h-10 rounded-lg border-2 border-[#daa520]" alt="K" />
          <div className="text-left font-black leading-tight">
            <h2 className="text-[#daa520] text-xl italic uppercase tracking-tighter">Kedheon</h2>
            <span className="text-white/50 text-[9px] font-mono tracking-widest uppercase">v78.0 Legacy Master</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setTab('ROOKIE')} className={`px-4 py-2 rounded-lg text-xs border-2 transition-all ${tab === 'ROOKIE' ? 'bg-[#daa520] text-black border-white shadow-lg' : 'border-white/10 text-white/40 font-bold'}`}>ROOKIE</button>
          <button onClick={() => setTab('PIONEER')} className={`px-4 py-2 rounded-lg text-xs border-2 transition-all ${tab === 'PIONEER' ? 'bg-[#daa520] text-black border-white shadow-lg' : 'border-white/10 text-white/40 font-bold'}`}>PIONEER</button>
        </div>
      </div>

      <div className="w-full max-w-4xl px-4 py-6 md:py-10">
        {tab === 'ROOKIE' ? (
          /* --- [ROOKIE: 가입 절차] --- */
          <div className="flex flex-col gap-8 md:gap-12 animate-in fade-in text-left">
            <div className="flex flex-col items-center text-center gap-6 py-12 bg-[#111] rounded-[40px] border-4 border-[#daa520] shadow-2xl relative overflow-hidden font-black">
              <img src="/kedheon-character.png" className="w-44 h-44 rounded-[40px] border-2 border-white shadow-xl relative z-10" alt="Main" />
              <div className="relative z-10 px-6">
                <h1 className="text-[#daa520] text-4xl uppercase mb-1 tracking-tighter drop-shadow-md">Web3 초대합니다.</h1>
                <p className="text-white text-xl uppercase tracking-widest border-b-2 border-[#daa520] pb-2 inline-block">파이코인 가입절차</p>
                <p className="text-white/40 text-[11px] md:text-sm mt-4 font-sans max-w-xs md:max-w-lg mx-auto italic font-bold">제국 시민권을 획득하기 위한 8단계 가이드입니다.</p>
              </div>
            </div>

            <div className="grid gap-3 md:gap-4 font-black">
              {["애플리케이션 설치", "가입 방식 선택", "국가 및 번호 설정", "강력한 암호 생성", "실명 프로필 작성", "초대 코드 입력", "비밀구절 수기 보관", "채굴 버튼 활성화"].map((t, i) => (
                <div key={i} className={`p-4 md:p-6 bg-[#111] rounded-2xl md:rounded-3xl border-2 flex items-center gap-5 transition-all shadow-lg ${i >= 5 ? 'border-[#daa520] bg-[#daa520]/5' : 'border-white/20'}`}>
                  <span className="text-[#daa520] text-xs md:text-sm font-black font-sans">0{i+1}</span>
                  <h3 className="text-white text-[15px] md:text-xl font-black">{t}</h3>
                </div>
              ))}
            </div>

            <div className="flex gap-3 pt-4 font-black font-sans">
              <button onClick={() => window.open(PI_APP_STORE_URL)} className="flex-1 bg-white text-black py-5 rounded-2xl md:rounded-3xl text-sm md:text-xl border-4 border-[#daa520] active:scale-95 shadow-xl uppercase">App Store</button>
              <button onClick={() => window.open(PI_PLAY_STORE_URL)} className="flex-1 bg-white text-black py-5 rounded-2xl md:rounded-3xl text-sm md:text-xl border-4 border-[#daa520] active:scale-95 shadow-xl uppercase">Play Store</button>
            </div>
          </div>
        ) : (
          /* --- [PIONEER: 핵심 경제 및 인증] --- */
          <div className="flex flex-col gap-8 md:gap-16 py-2 text-left font-black animate-in slide-in-from-bottom-2">
            
            {/* 자산 대시보드 (HIGH-CONTRAST) */}
            <div className="bg-[#1a1a1a] p-8 md:p-14 rounded-[50px] md:rounded-[70px] border-4 border-[#daa520] shadow-[0_0_60px_rgba(218,165,32,0.3)] flex justify-between items-center relative overflow-hidden">
                <div className="text-left font-black z-10">
                  <h3 className="text-white/40 text-[10px] md:text-[14px] uppercase tracking-[0.4em] mb-2 font-sans">Imperial Assets</h3>
                  <p className="text-[#daa520] text-4xl md:text-8xl tracking-tighter leading-none font-black drop-shadow-xl">
                    {Math.floor(beomToken).toLocaleString()}
                    <span className="text-lg md:text-4xl opacity-50">.{beomToken.toFixed(2).split('.')[1]}</span> 
                    <span className="ml-3 text-xl md:text-5xl font-black">BEOM</span>
                  </p>
                  <div className="mt-4 md:mt-8 bg-black/70 px-6 py-2 rounded-xl border border-white/20 inline-block text-sm md:text-2xl font-mono italic text-white/50">
                    ≈ {(beomToken / PI_TO_BEOM_RATIO).toFixed(4)} Pi
                  </div>
                </div>
                <img src="/beom-token.png" className="w-20 h-20 md:w-44 md:h-44 object-contain animate-pulse shadow-[0_0_40px_rgba(218,165,32,0.4)]" alt="B" />
            </div>

            {/* 🌐 01. 환전소 */}
            <SectionHeader num="01" title="BEOM EXCHANGE" desc="파이코인 채굴 기여도를 제국 통화인 범토큰(BEOM)으로 즉시 환전하여 경제권을 확보하십시오." />
            <div className="bg-[#111] p-6 md:p-12 rounded-[40px] border-2 border-white/30 flex flex-col md:flex-row justify-between items-center gap-6 shadow-2xl transition-all hover:border-[#daa520]">
              <div className="text-left font-sans font-black">
                <p className="text-white text-lg md:text-2xl italic uppercase mb-1">Conversion Terminal</p>
                <p className="text-[#daa520] text-xs md:text-sm font-black uppercase tracking-widest">Ratio: 1 Pi = 100 BEOM</p>
              </div>
              <button onClick={handleExchange} className="w-full md:w-auto bg-[#daa520] text-black px-12 md:px-20 py-5 rounded-2xl md:rounded-[30px] text-lg md:text-2xl border-4 border-white active:scale-95 uppercase font-black shadow-2xl">1 Pi 즉시 환전</button>
            </div>

            {/* 🌐 02. 보안 인증 (WIDE 비율 및 텍스트 오버레이 복구) */}
            <SectionHeader num="02" title="SECURE AUTH" desc="고유 QR코드를 발급받아 개인 보안을 강화하십시오. 기업형은 와이드 비율로 자동 전환됩니다." />
            <div className="bg-[#111] p-8 md:p-14 rounded-[45px] border-2 border-white/20 flex flex-col items-center gap-10 shadow-2xl font-black">
              <div className="flex gap-3 w-full max-w-sm bg-black p-2 rounded-2xl border-2 border-white/10">
                <button onClick={() => { setQrType('PERSONAL'); setIsQrActive(false); }} className={`flex-1 py-3 md:py-5 rounded-xl text-xs md:text-sm transition-all font-black border-2 ${qrType === 'PERSONAL' ? 'bg-[#daa520] text-black border-white shadow-xl' : 'border-transparent text-white/40'}`}>PERSONAL</button>
                <button onClick={() => { setQrType('BUSINESS'); setIsQrActive(false); }} className={`flex-1 py-3 md:py-5 rounded-xl text-xs md:text-sm transition-all font-black border-2 ${qrType === 'BUSINESS' ? 'bg-[#daa520] text-black border-white shadow-xl' : 'border-transparent text-white/40'}`}>BUSINESS</button>
              </div>
              {qrType === 'BUSINESS' && (
                <input value={bizName} onChange={(e) => setBizName(e.target.value.toUpperCase())} placeholder="비즈니스 명칭 입력" className="w-full max-w-sm bg-black border-2 border-[#daa520] p-5 rounded-3xl text-center text-[#daa520] text-xl outline-none font-black font-sans shadow-inner shadow-[#daa520]/10" />
              )}
              
              {/* QR 프레임: BUSINESS 시 와이드(16:9) 비율로 확장 */}
              <div className={`relative bg-black border-4 rounded-[50px] flex flex-col items-center justify-center transition-all duration-500 overflow-hidden shadow-2xl
                ${qrType === 'PERSONAL' ? 'w-64 h-64 md:w-80 md:h-80' : 'w-full max-w-lg aspect-video'} 
                ${isQrActive ? 'border-[#daa520] opacity-100' : 'opacity-20 border-white/20'}`}
              >
                {isQrActive ? (
                  <>
                    <img 
                      src={qrType === 'PERSONAL' ? "/qr-personal.png" : "/qr-business.png"} 
                      className={`w-full h-full ${qrType === 'PERSONAL' ? 'object-contain' : 'object-cover'}`} 
                      alt="QR" 
                    />
                    {/* [오버레이] 이미지 위에 입력한 네이밍 반영 */}
                    <div className="absolute bottom-6 bg-black/80 px-6 py-2 rounded-full border border-[#daa520]/50 backdrop-blur-md shadow-2xl">
                      <span className="text-[#daa520] text-sm md:text-xl font-black tracking-widest italic uppercase font-sans">
                        {qrType === 'BUSINESS' ? (bizName || "ENTER NAME") : "IMPERIAL PERSONAL"}
                      </span>
                    </div>
                  </>
                ) : (
                  <p className="text-white/10 text-lg md:text-2xl font-black uppercase italic tracking-[0.5em] font-sans">Security Locked</p>
                )}
              </div>
              <button onClick={handleActivateQr} className="w-full max-w-xs bg-[#daa520] text-black py-5 md:py-8 rounded-2xl md:rounded-[40px] text-lg md:text-2xl border-4 border-white active:scale-95 uppercase font-black shadow-2xl">보안 QR 활성화 (50)</button>
            </div>

            {/* 🌐 03. 창작 게시판 (Praise 호응) */}
            <SectionHeader num="03" title="CREATIVE BOARD" desc="창작물을 게시하고 다른 파이오니어들의 BEOM 호응을 끌어내십시오." />
            <div className="bg-[#111] p-6 md:p-12 rounded-[45px] border-2 border-white/20 space-y-6 shadow-2xl font-black text-left">
              <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
                {cats.map(cat => (
                  <button key={cat} onClick={() => setPostCategory(cat)} className={`px-5 py-2.5 rounded-full text-[10px] md:text-xs font-black border-2 transition-all ${postCategory === cat ? 'bg-white text-black border-[#daa520] shadow-lg' : 'border-white/20 text-white/40 hover:border-white/40'}`}>{cat}</button>
                ))}
              </div>
              <div className="space-y-4">
                <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="제목 (MEDIUM TEXT)" className="w-full bg-[#1a1a1a] border-2 border-white/30 p-5 rounded-2xl text-lg md:text-xl text-white outline-none focus:border-[#daa520] font-black" />
                <input value={newUrl} onChange={(e) => setNewUrl(e.target.value)} placeholder="이미지 또는 영상 URL (링크 주소)" className="w-full bg-[#1a1a1a] border-2 border-white/30 p-4 rounded-2xl text-sm text-[#daa520] outline-none font-bold" />
                <textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="창작 내용을 기록하십시오" className="w-full bg-[#1a1a1a] border-2 border-white/30 p-5 rounded-2xl text-sm md:text-lg text-white/70 h-32 md:h-44 outline-none font-bold shadow-inner" />
              </div>
              <div className="flex gap-4 pt-2">
                <button onClick={handlePost} className="flex-[2] bg-[#daa520] text-black py-5 md:py-7 rounded-2xl md:rounded-[40px] text-lg md:text-2xl border-4 border-white uppercase font-black shadow-xl active:scale-95 transition-all">피드 등록 (10)</button>
                <button className="flex-1 bg-white text-black py-5 md:py-7 rounded-2xl md:rounded-[40px] text-[10px] md:text-sm border-2 border-[#daa520] uppercase font-black leading-tight shadow-xl">🚩 팬방 개설<br/>(500)</button>
              </div>
            </div>

            {/* 창작물 피드 리스트 */}
            <div className="space-y-6 md:space-y-12">
              {assets.map(a => (
                <div key={a.id} className="bg-[#111] p-8 md:p-14 rounded-[50px] md:rounded-[70px] border-2 border-white/10 shadow-2xl relative transition-all hover:border-[#daa520]/40 text-left font-black">
                  <div className="flex justify-between items-start mb-8 font-black">
                    <div className="flex flex-col gap-3">
                      <span className="text-[10px] text-[#daa520] font-black uppercase tracking-widest bg-[#daa520]/10 px-4 py-1.5 rounded-full w-fit border border-[#daa520]/20">{a.category}</span>
                      <h4 className="text-white text-2xl md:text-4xl uppercase italic font-black underline underline-offset-[14px] decoration-[#daa520]/30">{a.title}</h4>
                    </div>
                    <span className="text-white/30 text-[10px] md:text-sm font-mono font-bold font-sans">{a.timestamp}</span>
                  </div>
                  {a.url && (
                    <div className="mb-8 p-4 md:p-8 bg-black rounded-3xl flex justify-between items-center border-2 border-[#daa520]/30 font-sans font-bold shadow-inner">
                      <p className="text-[10px] md:text-sm text-[#daa520] truncate opacity-50 pr-8 italic font-sans">{a.url}</p>
                      <button onClick={() => window.open(a.url, '_blank')} className="bg-[#daa520] text-black px-6 md:px-10 py-3 md:py-4 rounded-xl md:rounded-2xl text-[10px] md:text-sm font-black uppercase whitespace-nowrap active:scale-95 shadow-2xl">Watch 📺</button>
                    </div>
                  )}
                  <p className="text-white/70 text-lg md:text-2xl italic leading-relaxed mb-10 font-sans font-bold">"{a.desc}"</p>
                  <div className="flex justify-between items-center border-t-2 border-white/5 pt-10">
                    <button onClick={() => handleSupport(a.id)} className="bg-[#daa520] text-black px-10 md:px-16 py-4 md:py-6 rounded-2xl md:rounded-[40px] text-xs md:text-lg border-2 border-white uppercase font-black active:scale-95 shadow-2xl hover:scale-105">👑 Praise (100)</button>
                    <p className="text-[#daa520] text-4xl md:text-7xl tracking-tighter font-black font-sans">{a.beomSupport.toLocaleString()} <span className="text-sm md:text-2xl font-black">BEOM</span></p>
                  </div>
                </div>
              ))}
            </div>

            {/* 🌐 04. 시장 및 후기 (제품 이미지 등록) */}
            <SectionHeader num="04" title="MERCHANT & REVIEWS" desc="제국의 희귀 굿즈를 거래하거나 판매 글을 올리십시오. 이미지 등록이 지원됩니다." />
            
            <div className="bg-[#111] p-8 md:p-14 rounded-[45px] border-2 border-[#daa520]/50 space-y-6 md:space-y-10 mb-10 shadow-2xl font-black text-left">
              <h3 className="text-white text-sm md:text-xl uppercase italic font-black border-l-4 border-[#daa520] pl-3 font-sans tracking-[0.2em]">Register New Item</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-black">
                <input value={sellName} onChange={(e) => setSellName(e.target.value)} placeholder="상품명 (MEDIUM TEXT)" className="w-full bg-[#1a1a1a] border-2 border-white/30 p-5 rounded-2xl text-xl text-white outline-none focus:border-[#daa520] font-black shadow-inner" />
                <input type="number" value={sellPrice} onChange={(e) => setSellPrice(e.target.value)} placeholder="가격 (BEOM)" className="w-full bg-[#1a1a1a] border-2 border-white/30 p-5 rounded-2xl text-xl text-[#daa520] outline-none focus:border-[#daa520] font-black shadow-inner" />
              </div>
              <input value={sellImg} onChange={(e) => setSellImg(e.target.value)} placeholder="제품 이미지 URL (링크 주소 붙여넣기)" className="w-full bg-[#1a1a1a] border-2 border-white/30 p-4 rounded-2xl text-sm text-[#daa520] outline-none font-bold shadow-inner" />
              <textarea value={sellDesc} onChange={(e) => setSellDesc(e.target.value)} placeholder="상품 상세 설명을 입력하십시오" className="w-full bg-[#1a1a1a] border-2 border-white/30 p-5 rounded-2xl text-sm md:text-lg text-white/70 h-32 md:h-44 outline-none font-bold shadow-inner" />
              <button onClick={handleSell} className="w-full bg-[#daa520] text-black py-5 md:py-8 rounded-2xl md:rounded-[40px] text-lg md:text-2xl border-4 border-white uppercase font-black shadow-2xl active:scale-95 transition-all">시장에 상품 등록 (20 BEOM)</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 font-black text-left font-sans">
              <div className="space-y-6 md:space-y-10">
                <h3 className="text-white text-sm md:text-xl uppercase border-b-4 border-white/10 pb-2 italic font-black font-sans tracking-[0.2em]">Sales Board</h3>
                {goods.map(g => (
                  <div key={g.id} className="bg-[#111] p-8 md:p-12 rounded-[50px] border-2 border-white/10 shadow-2xl text-center group transition-all hover:border-[#daa520]/30 font-black">
                    <img src={g.img} className="w-full h-48 md:h-72 object-contain bg-black rounded-[40px] border-2 border-white/10 mb-8 shadow-inner transition-transform group-hover:scale-105" alt="G" />
                    <h4 className="text-white text-xl md:text-3xl uppercase mb-1 md:mb-3 font-black leading-none">{g.name}</h4>
                    <p className="text-[#daa520] text-3xl md:text-6xl mb-8 font-black font-sans tracking-tighter">{g.price.toLocaleString()} <span className="text-sm md:text-xl">BEOM</span></p>
                    <button className="w-full py-4 md:py-7 bg-white text-black rounded-2xl md:rounded-[40px] text-lg md:text-2xl border-4 border-[#daa520] uppercase font-black active:scale-95 shadow-2xl font-sans">Buy Now</button>
                  </div>
                ))}
              </div>
              <div className="space-y-6 md:space-y-10 font-black">
                <h3 className="text-white text-sm md:text-xl uppercase border-b-4 border-white/10 pb-2 italic font-black font-sans tracking-[0.2em]">Review Board</h3>
                {goods[0].reviews.map(r => (
                  <div key={r.id} className="bg-black/50 p-6 md:p-10 rounded-[35px] border-2 border-white/10 shadow-inner font-black transition-all hover:border-[#daa520]/20">
                    <p className="text-white/80 text-[12px] md:text-lg italic font-sans mb-4 md:mb-6 font-bold leading-relaxed font-black">"{r.text}"</p>
                    <div className="flex justify-between items-center text-[10px] md:text-sm font-mono text-[#daa520] font-black uppercase tracking-widest font-sans">
                      <span>- {r.user}</span>
                      <span className="text-white/20">{r.timestamp}</span>
                    </div>
                  </div>
                ))}
                <button className="w-full py-5 md:py-8 border-4 border-dashed border-white/10 rounded-[30px] md:rounded-[50px] text-[10px] md:text-sm text-white/40 uppercase font-black hover:border-[#daa520] hover:text-[#daa520] transition-all font-sans">Write Experience Review</button>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* --- [하단 통합 네비게이션: 간격 균등 분할] --- */}
      <div className="fixed bottom-6 left-4 right-4 max-w-4xl mx-auto bg-black/95 border-2 border-[#daa520] p-1.5 rounded-[30px] flex justify-between gap-1 z-[200] shadow-[0_0_60px_rgba(218,165,32,0.6)] backdrop-blur-3xl font-black">
        {['KEDHEON', 'CIVIL', 'NEXUS', 'VENDOR'].map(app => (
          <button key={app} className={`flex-1 py-4 md:py-5 rounded-[25px] text-[11px] md:text-xs transition-all font-black text-center ${app === 'KEDHEON' ? 'bg-[#daa520] text-black border-2 border-white shadow-inner scale-100 font-black' : 'text-white/40 hover:text-white'}`}>{app}</button>
        ))}
      </div>

      {/* --- [푸터: 버전 및 마스터 정보] --- */}
      <div className="mt-40 opacity-20 text-[10px] md:text-[14px] tracking-[1.5em] uppercase pb-20 font-sans font-black text-center">
        Kedheon Empire | V78.0 Legacy Master | @Ohsangjo
      </div>
    </div>
  );
}
