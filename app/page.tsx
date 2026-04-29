'use client';
import React, { useState, useEffect } from 'react';

/** * [KEDHEON EMPIRE V72.0 ULTIMATE INTEGRATION MASTER]
 * -----------------------------------------------------------
 * 건축적 반응형 규격 (Architectural Standard):
 * 1. LARGE  : text-2xl md:text-4xl (섹션 대제목, 핵심 지표)
 * 2. MEDIUM : text-lg md:text-xl   (버튼, 입력 필드 라벨)
 * 3. SMALL  : text-[11px] md:text-sm (설명 문구, 가이드, 메타데이터)
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
  
  // 보안 및 비즈니스
  const [qrType, setQrType] = useState<'PERSONAL' | 'BUSINESS'>('PERSONAL');
  const [bizName, setBizName] = useState('');
  const [isQrActive, setIsQrActive] = useState(false);
  
  // 게시판
  const [postCategory, setPostCategory] = useState('TECH');
  const [assets, setAssets] = useState<Asset[]>([]); 
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newUrl, setNewUrl] = useState('');

  // 마켓
  const [goods, setGoods] = useState<Good[]>([
    { id: 1, name: "EMPIRE GOLD BADGE", price: 1000, img: "/beom-token.png", seller: "Imperial", desc: "제국 공인 황금 뱃지", reviews: [{ id: 1, user: "Citizen_Alpha", text: "실물 보안 각인이 훌륭합니다.", timestamp: "2026.04.29" }] }
  ]);
  const [sellName, setSellName] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [sellDesc, setSellDesc] = useState('');
  const [sellImg, setSellImg] = useState('');

  const cats = ['MUSIC', 'TECH', 'ART', 'FOOD', 'TRAVEL', 'GAME', 'NEWS', 'MOVIE'];

  useEffect(() => {
    setHasMounted(true);
    const saved = localStorage.getItem('kedheon_v72_final');
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
    if (hasMounted) localStorage.setItem('kedheon_v72_final', JSON.stringify({ token: beomToken, assets, goods }));
  }, [beomToken, assets, goods, hasMounted]);

  const handleExchange = () => setBeomToken(p => p + PI_TO_BEOM_RATIO);
  const handleSupport = (id: number) => {
    if (beomToken < COSTS_BEOM.SUPPORT) return alert("자산 부족");
    setBeomToken(p => p - COSTS_BEOM.SUPPORT);
    setAssets(assets.map(a => a.id === id ? { ...a, beomSupport: a.beomSupport + COSTS_BEOM.SUPPORT } : a));
  };
  const handlePost = () => {
    if(!newTitle.trim()) return alert("제목 필수");
    if(beomToken < COSTS_BEOM.POST_CREATION) return alert("자산 부족");
    const post: Asset = { id: Date.now(), title: newTitle, desc: newDesc, category: postCategory, type: 'POST', beomSupport: 0, timestamp: new Date().toLocaleDateString(), url: newUrl };
    setAssets([post, ...assets]);
    setBeomToken(p => p - COSTS_BEOM.POST_CREATION);
    setNewTitle(''); setNewDesc(''); setNewUrl('');
    alert("피드 등록 완료");
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

  const SectionHeader = ({ num, title, desc }: { num: string; title: string; desc: string }) => (
    <div className="w-full border-t border-white/10 pt-5 md:pt-10 mb-4 md:mb-8 text-left font-black">
      <h2 className="text-[#daa520] text-2xl md:text-4xl uppercase italic mb-1 border-l-4 border-[#daa520] pl-3 leading-tight tracking-tighter">
        {num}. 🌐 {title}
      </h2>
      <p className="text-white/40 text-[11px] md:text-sm font-sans font-bold leading-tight pl-4 italic">{desc}</p>
    </div>
  );

  if (!hasMounted) return null;

  return (
    <div className="flex flex-col items-center bg-black min-h-screen text-white font-sans w-full pb-32 font-black overflow-x-hidden">
      
      {/* --- [GNB: 최적화된 상단바] --- */}
      <div className="w-full max-w-4xl flex justify-between items-center px-4 py-3 md:p-5 sticky top-0 bg-black/95 backdrop-blur-md z-[150] border-b border-[#daa520]/30">
        <div className="flex items-center gap-2">
          <img src="/kedheon-character.png" className="w-9 h-9 md:w-12 md:h-12 rounded-lg border border-[#daa520]" alt="K" />
          <div className="text-left font-black leading-none">
            <h2 className="text-[#daa520] text-lg md:text-xl italic uppercase">Kedheon</h2>
            <span className="text-white/30 text-[8px] md:text-[10px] font-mono tracking-widest uppercase">v72.0 Ultimate</span>
          </div>
        </div>
        <div className="flex gap-1.5">
          <button onClick={() => setTab('ROOKIE')} className={`px-4 md:px-6 py-1.5 rounded-md text-[11px] md:text-sm border transition-all ${tab === 'ROOKIE' ? 'bg-[#daa520] text-black border-[#daa520]' : 'border-white/10 text-white/40'}`}>ROOKIE</button>
          <button onClick={() => setTab('PIONEER')} className={`px-4 md:px-6 py-1.5 rounded-md text-[11px] md:text-sm border transition-all ${tab === 'PIONEER' ? 'bg-[#daa520] text-black border-[#daa520]' : 'border-white/10 text-white/40'}`}>PIONEER</button>
        </div>
      </div>

      <div className="w-full max-w-4xl px-3 md:px-6 py-4 md:py-10">
        {tab === 'ROOKIE' ? (
          /* --- [ROOKIE: 상하 간격 압축 가이드] --- */
          <div className="flex flex-col gap-6 md:gap-12 animate-in fade-in text-left">
            <div className="flex flex-col items-center text-center gap-4 py-8 md:py-16 bg-[#111] rounded-[30px] md:rounded-[60px] border-2 md:border-4 border-[#daa520] shadow-2xl relative overflow-hidden">
              <img src="/kedheon-character.png" className="w-36 h-36 md:w-56 md:h-56 rounded-[35px] md:rounded-[50px] border-2 border-white shadow-xl relative z-10" alt="Main" />
              <div className="relative z-10 px-4 font-black">
                <h1 className="text-[#daa520] text-3xl md:text-6xl uppercase mb-1 tracking-tighter">Web3 초대합니다.</h1>
                <p className="text-white text-lg md:text-2xl uppercase tracking-widest border-b-2 border-[#daa520] pb-2 inline-block">파이코인 가입절차</p>
                <p className="text-white/40 text-[11px] md:text-sm mt-4 font-sans max-w-xs md:max-w-lg mx-auto leading-tight italic font-bold">제국 시민권 획득을 위한 가장 정교한 8단계 가이드를 완수하십시오.</p>
              </div>
            </div>

            <div className="grid gap-2.5 md:gap-4 font-black">
              {[
                { s: "01", t: "애플리케이션 설치", d: "스토어에서 [Pi Network] 공식 앱을 설치하십시오." },
                { s: "02", t: "가입 방식 선택", d: "[Continue with phone number]로 시작하십시오." },
                { s: "03", t: "국가 및 번호 설정", d: "[South Korea (+82)] 설정 후 번호를 입력하십시오." },
                { s: "04", t: "강력한 암호 생성", d: "영문 대/소문자와 숫자를 반드시 조합하십시오." },
                { s: "05", t: "실명 프로필 작성", d: "여권 영문 실명을 입력하고 고유 아이디를 정하십시오." },
                { s: "06", t: "초대 코드 입력", d: `초대 코드 [ ${PI_INVITE_CODE} ]를 정확히 기입하십시오.`, gold: true },
                { s: "07", t: "비밀구절 수기 보관", d: "24개 비밀구절은 절대 온라인에 저장하지 마십시오.", danger: true },
                { s: "08", t: "채굴 버튼 활성화", d: "번개 버튼을 눌러 정식 시민권을 획득하십시오.", gold: true }
              ].map((step, idx) => (
                <div key={idx} className={`p-4 md:p-5 bg-[#111] rounded-2xl md:rounded-3xl border flex items-center gap-4 md:gap-8 transition-all ${step.gold ? 'border-[#daa520] bg-[#daa520]/5' : step.danger ? 'border-red-600' : 'border-white/5'}`}>
                  <span className="text-[#daa520] text-[10px] md:text-sm font-black whitespace-nowrap">{step.s}</span>
                  <div className="flex flex-col">
                    <h3 className="text-white text-[13px] md:text-xl font-black">{step.t}</h3>
                    <p className="text-white/40 text-[10px] md:text-sm font-sans font-bold leading-none mt-1">{step.d}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2.5 pt-4">
              <button onClick={() => window.open(PI_APP_STORE_URL)} className="flex-1 bg-white text-black py-4 md:py-6 rounded-2xl md:rounded-3xl text-sm md:text-xl font-black uppercase border-2 border-[#daa520] active:scale-95 shadow-lg">App Store</button>
              <button onClick={() => window.open(PI_PLAY_STORE_URL)} className="flex-1 bg-white text-black py-4 md:py-6 rounded-2xl md:rounded-3xl text-sm md:text-xl font-black uppercase border-2 border-[#daa520] active:scale-95 shadow-lg">Play Store</button>
            </div>
          </div>
        ) : (
          /* --- [PIONEER: 건축적 조밀함 유지] --- */
          <div className="flex flex-col gap-6 md:gap-12 animate-in slide-in-from-bottom-2 text-left font-black">
            
            {/* 자산 대시보드 (반응형 최적화) */}
            <div className="bg-[#111] p-6 md:p-12 rounded-[40px] md:rounded-[60px] border-2 md:border-4 border-[#daa520] shadow-2xl flex justify-between items-center relative overflow-hidden">
                <div className="text-left font-black z-10">
                  <h3 className="text-white/30 text-[9px] md:text-[14px] uppercase tracking-widest mb-1">Imperial Assets</h3>
                  <p className="text-[#daa520] text-3xl md:text-8xl tracking-tighter leading-none font-black">
                    {Math.floor(beomToken).toLocaleString()}
                    <span className="text-sm md:text-3xl opacity-40">.{beomToken.toFixed(2).split('.')[1]}</span> 
                    <span className="ml-2 text-lg md:text-4xl">BEOM</span>
                  </p>
                  <div className="mt-2 text-[10px] md:text-xl font-mono italic text-white/50">≈ {(beomToken / PI_TO_BEOM_RATIO).toFixed(4)} Pi</div>
                </div>
                <img src="/beom-token.png" className="w-16 h-16 md:w-36 md:h-32 object-contain animate-pulse" alt="B" />
            </div>

            {/* 🌐 01. 환전소 */}
            <SectionHeader num="01" title="BEOM EXCHANGE" desc="파이코인 채굴 기여도를 제국 통화인 범토큰으로 환전하여 경제 주권을 확보하십시오." />
            <div className="bg-[#111] p-5 md:p-10 rounded-[30px] md:rounded-[45px] border border-[#daa520]/50 flex justify-between items-center gap-4 shadow-xl">
              <div className="font-sans text-left">
                <p className="text-white text-sm md:text-xl italic font-black uppercase">Conversion Terminal</p>
                <p className="text-[#daa520] text-[9px] md:text-sm font-black uppercase tracking-widest mt-1">Rate: 1 Pi = 100 BEOM</p>
              </div>
              <button onClick={handleExchange} className="bg-[#daa520] text-black px-6 md:px-16 py-3 md:py-6 rounded-xl md:rounded-3xl text-sm md:text-xl border-2 md:border-4 border-white active:scale-95 uppercase font-black">1 Pi 환전</button>
            </div>

            {/* 🌐 02. 보안 인증 (QR 구체화) */}
            <SectionHeader num="02" title="SECURE AUTH" desc="고유 QR코드를 발급받아 개인 보안을 강화하고 제국 내 모든 서비스의 인증 수단으로 사용하십시오." />
            <div className="bg-[#111] p-5 md:p-10 rounded-[30px] md:rounded-[45px] border border-white/10 flex flex-col items-center gap-6 md:gap-10 shadow-2xl">
              <div className="flex gap-2 w-full max-w-sm bg-black p-1.5 rounded-xl border border-white/5 font-black">
                <button onClick={() => { setQrType('PERSONAL'); setIsQrActive(false); }} className={`flex-1 py-2.5 md:py-4 rounded-lg text-[10px] md:text-sm transition-all ${qrType === 'PERSONAL' ? 'bg-[#daa520] text-black shadow-lg' : 'text-white/20'}`}>PERSONAL</button>
                <button onClick={() => { setQrType('BUSINESS'); setIsQrActive(false); }} className={`flex-1 py-2.5 md:py-4 rounded-lg text-[10px] md:text-sm transition-all ${qrType === 'BUSINESS' ? 'bg-[#daa520] text-black shadow-lg' : 'text-white/20'}`}>BUSINESS</button>
              </div>
              {qrType === 'BUSINESS' && (
                <input value={bizName} onChange={(e) => setBizName(e.target.value.toUpperCase())} placeholder="비즈니스 명칭 입력" className="w-full max-w-sm bg-black border-2 border-[#daa520] p-4 md:p-6 rounded-2xl text-center text-[#daa520] text-lg md:text-xl outline-none font-black shadow-inner" />
              )}
              <div className={`p-4 bg-black border-2 rounded-[40px] flex flex-col items-center justify-center w-56 h-56 md:w-80 md:h-80 transition-all ${isQrActive ? 'border-[#daa520] shadow-2xl' : 'opacity-10 border-white/10'}`}>
                {isQrActive ? <><img src={qrType === 'PERSONAL' ? "/qr-personal.png" : "/qr-business.png"} className="w-44 h-44 md:w-60 md:h-60 rounded-xl shadow-2xl mb-2" alt="QR" /><span className="text-[#daa520] text-[9px] md:text-[11px] uppercase tracking-widest font-black italic">{bizName || 'Imperial Verified'}</span></> 
                : <p className="text-white/5 text-lg md:text-2xl font-black uppercase tracking-[0.5em] italic">Locked</p>}
              </div>
              <button onClick={() => { if(qrType==='BUSINESS' && !bizName) return alert("명칭 필수"); setIsQrActive(true); setBeomToken(p => p - COSTS_BEOM.ACTIVATE_QR); }} className="w-full max-w-sm bg-[#daa520] text-black py-4 md:py-7 rounded-xl md:rounded-3xl text-sm md:text-xl border-2 md:border-4 border-white active:scale-95 uppercase font-black shadow-2xl">보안 QR 활성화 ({COSTS_BEOM.ACTIVATE_QR})</button>
            </div>

            {/* 🌐 03. 창작 게시판 (호응 인터랙션) */}
            <SectionHeader num="03" title="CREATIVE BOARD" desc="영상이나 창작물을 게시하여 팬심을 증명하고 파이오니어들의 호응을 이끌어내십시오." />
            <div className="bg-[#111] p-5 md:p-10 rounded-[30px] md:rounded-[45px] border border-[#daa520]/30 space-y-4 shadow-2xl font-black">
              <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-hide">
                {cats.map(cat => (
                  <button key={cat} onClick={() => setPostCategory(cat)} className={`px-4 py-2 rounded-full text-[10px] md:text-xs font-black border-2 transition-all ${postCategory === cat ? 'bg-white text-black border-white shadow-md' : 'border-white/10 text-white/40'}`}>{cat}</button>
                ))}
              </div>
              <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="제목 (MEDIUM TEXT)" className="w-full bg-black border border-white/10 p-4 md:p-6 rounded-xl md:rounded-2xl text-lg md:text-xl text-white outline-none focus:border-[#daa520]" />
              <input value={newUrl} onChange={(e) => setNewUrl(e.target.value)} placeholder="이미지 또는 영상 URL (SMALL TEXT)" className="w-full bg-black border border-white/10 p-3 md:p-5 rounded-xl md:rounded-2xl text-xs md:text-sm text-[#daa520] outline-none" />
              <textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="상세 내용을 기록하십시오" className="w-full bg-black border border-white/10 p-4 md:p-6 rounded-xl md:rounded-2xl text-xs md:text-sm text-white/70 h-24 md:h-40 outline-none font-bold" />
              <div className="flex gap-3">
                <button onClick={handlePost} className="flex-[2] bg-[#daa520] text-black py-4 md:py-6 rounded-xl md:rounded-3xl text-sm md:text-xl border-2 md:border-4 border-white uppercase shadow-xl active:scale-95 transition-all">피드 등록 ({COSTS_BEOM.POST_CREATION})</button>
                <button className="flex-1 bg-white text-black py-4 md:py-6 rounded-xl md:rounded-3xl text-[9px] md:text-sm border-2 border-[#daa520] uppercase font-black leading-tight shadow-lg">🚩 팬방 개설<br/>({COSTS_BEOM.CREATE_FAN_ROOM})</button>
              </div>
            </div>

            {/* 피드 리스트 (Adaptive Praise) */}
            <div className="space-y-4 md:space-y-10">
              {assets.map(a => (
                <div key={a.id} className="bg-[#111] p-6 md:p-12 rounded-[40px] md:rounded-[60px] border border-white/5 relative shadow-2xl transition-all hover:border-[#daa520]/20">
                  <div className="flex justify-between items-start mb-4 md:mb-8 font-black">
                    <div className="flex flex-col gap-2">
                      <span className="text-[8px] md:text-[10px] text-[#daa520] font-black uppercase tracking-widest bg-[#daa520]/10 px-3 py-1 rounded-full w-fit">{a.category}</span>
                      <h4 className="text-white text-lg md:text-3xl uppercase italic font-black underline underline-offset-4 md:underline-offset-8 decoration-[#daa520]/20">{a.title}</h4>
                    </div>
                    <span className="text-white/20 text-[9px] md:text-sm font-mono font-bold font-sans">{a.timestamp}</span>
                  </div>
                  {a.url && (
                    <div className="mb-4 md:mb-8 p-3 md:p-6 bg-black rounded-xl md:rounded-[30px] flex justify-between items-center border border-[#daa520]/20 font-sans font-bold shadow-inner">
                      <p className="text-[9px] md:text-xs text-[#daa520] truncate opacity-50 pr-4 italic">{a.url}</p>
                      <button onClick={() => window.open(a.url, '_blank')} className="bg-[#daa520] text-black px-4 py-2 rounded-xl text-[9px] md:text-sm font-black uppercase whitespace-nowrap active:scale-95 shadow-xl">Watch 📺</button>
                    </div>
                  )}
                  <p className="text-white/70 text-sm md:text-xl italic leading-relaxed mb-6 md:mb-10 font-sans font-bold">"{a.desc}"</p>
                  <div className="flex justify-between items-center border-t border-white/5 pt-4 md:pt-10">
                    <button onClick={() => handleSupport(a.id)} className="bg-[#daa520] text-black px-6 py-2.5 rounded-xl md:rounded-3xl text-[10px] md:text-sm border-2 border-white uppercase font-black active:scale-95 shadow-2xl">👑 Praise ({COSTS_BEOM.SUPPORT})</button>
                    <p className="text-[#daa520] text-2xl md:text-5xl tracking-tighter font-black font-sans">{a.beomSupport.toLocaleString()} <span className="text-[10px] md:text-sm">BEOM</span></p>
                  </div>
                </div>
              ))}
            </div>

            {/* 🌐 04. 시장 및 후기 (제품 이미지 등록 추가) */}
            <SectionHeader num="04" title="MERCHANT & REVIEWS" desc="제국의 희귀 굿즈를 거래하거나 판매 글을 작성하십시오. 이미지 링크 등록이 가능합니다." />
            
            <div className="bg-[#111] p-5 md:p-10 rounded-[35px] md:rounded-[50px] border border-[#daa520]/30 space-y-4 md:space-y-6 mb-6 shadow-2xl text-left font-black">
              <h3 className="text-white text-[11px] md:text-sm uppercase italic font-black border-l-2 border-[#daa520] pl-2 font-sans mb-2">Register New Sale Item</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <input value={sellName} onChange={(e) => setSellName(e.target.value)} placeholder="상품명 (MEDIUM)" className="w-full bg-black border border-white/10 p-4 rounded-xl text-sm md:text-xl text-white outline-none focus:border-[#daa520] font-black shadow-inner" />
                <input type="number" value={sellPrice} onChange={(e) => setSellPrice(e.target.value)} placeholder="가격 (BEOM)" className="w-full bg-black border border-white/10 p-4 rounded-xl text-sm md:text-xl text-[#daa520] outline-none focus:border-[#daa520] font-black shadow-inner" />
              </div>
              <input value={sellImg} onChange={(e) => setSellImg(e.target.value)} placeholder="제품 이미지 URL (링크 주소 복사/붙여넣기)" className="w-full bg-black border border-white/10 p-3 md:p-5 rounded-xl text-xs md:text-sm text-[#daa520] outline-none font-sans font-bold shadow-inner" />
              <textarea value={sellDesc} onChange={(e) => setSellDesc(e.target.value)} placeholder="상세 설명을 기록하십시오" className="w-full bg-black border border-white/10 p-4 md:p-6 rounded-xl text-[11px] md:text-sm text-white/70 h-20 md:h-32 outline-none font-bold shadow-inner" />
              <button onClick={handleSell} className="w-full bg-[#daa520] text-black py-4 md:py-7 rounded-2xl md:rounded-3xl text-sm md:text-xl border-2 md:border-4 border-white uppercase font-black shadow-xl active:scale-95 transition-all">시장에 상품 등록 ({COSTS_BEOM.SELL_ITEM} BEOM)</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 font-black text-left">
              {/* 판매 게시판 */}
              <div className="space-y-4 md:space-y-8">
                <h3 className="text-white text-[11px] md:text-sm uppercase border-b border-white/10 pb-1 italic font-black font-sans tracking-widest">Sales Board</h3>
                {goods.map(g => (
                  <div key={g.id} className="bg-[#111] p-6 md:p-10 rounded-[35px] md:rounded-[60px] border border-white/10 shadow-2xl text-center group transition-all hover:border-[#daa520]/20 font-black">
                    <img src={g.img} className="w-full h-44 md:h-64 object-contain bg-black rounded-[30px] md:rounded-[45px] mb-4 md:mb-8 shadow-inner transition-transform group-hover:scale-105" alt="G" />
                    <h4 className="text-white text-sm md:text-2xl uppercase mb-1 md:mb-3 font-black leading-tight">{g.name}</h4>
                    <p className="text-[#daa520] text-2xl md:text-5xl mb-4 md:mb-8 font-black font-sans leading-none">{g.price.toLocaleString()} <span className="text-[10px] md:text-sm">BEOM</span></p>
                    <button className="w-full py-3.5 md:py-6 bg-white text-black rounded-xl md:rounded-[30px] text-xs md:text-xl border-2 md:border-4 border-[#daa520] uppercase font-black active:scale-95 shadow-xl transition-all">Buy Now</button>
                  </div>
                ))}
              </div>
              {/* 후기 게시판 */}
              <div className="space-y-4 md:space-y-8 font-black">
                <h3 className="text-white text-[11px] md:text-sm uppercase border-b border-white/10 pb-1 italic font-black font-sans tracking-widest">Review Board</h3>
                {goods[0].reviews.map(r => (
                  <div key={r.id} className="bg-black/50 p-5 md:p-8 rounded-[25px] md:rounded-[40px] border-2 border-white/5 shadow-inner font-black transition-all hover:border-[#daa520]/20">
                    <p className="text-white/80 text-[11px] md:text-sm italic font-sans mb-2 md:mb-4 font-bold leading-relaxed">"{r.text}"</p>
                    <div className="flex justify-between items-center text-[9px] md:text-[11px] font-mono text-[#daa520] font-black uppercase tracking-[0.2em]">
                      <span>- {r.user}</span>
                      <span className="text-white/20">{r.timestamp}</span>
                    </div>
                  </div>
                ))}
                <button className="w-full py-4 md:py-6 border-2 border-dashed border-white/10 rounded-xl md:rounded-[30px] text-[10px] md:text-sm text-white/30 uppercase font-black hover:border-[#daa520] hover:text-[#daa520] transition-all font-sans font-bold shadow-inner">Write Experience Review</button>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* --- [하단 통합 네비게이션: 간격 균등화] --- */}
      <div className="fixed bottom-6 left-4 right-4 max-w-4xl mx-auto bg-black/95 border-2 border-[#daa520] p-1.5 rounded-[25px] flex justify-between gap-1 z-[200] shadow-[0_0_50px_rgba(218,165,32,0.6)] backdrop-blur-2xl font-black">
        {['KEDHEON', 'CIVIL', 'NEXUS', 'VENDOR'].map(app => (
          <button key={app} className={`flex-1 py-3.5 md:py-4 rounded-[20px] text-[10px] md:text-xs transition-all font-black text-center ${app === 'KEDHEON' ? 'bg-[#daa520] text-black shadow-inner' : 'text-white/30 hover:text-white'}`}>{app}</button>
        ))}
      </div>

      {/* --- [푸터] --- */}
      <div className="mt-20 opacity-20 text-[9px] md:text-[11px] tracking-[1.5em] uppercase pb-10 font-sans font-black text-center">
        Kedheon Empire | V72.0 Ultimate | @Ohsangjo
      </div>
    </div>
  );
}
