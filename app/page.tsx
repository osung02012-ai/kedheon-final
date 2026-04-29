'use client';
import React, { useState, useEffect } from 'react';

/** * [KEDHEON MASTER V87.0 ARCHITECTURAL INTEGRITY]
 * -----------------------------------------------------------
 * [타이포그래피 4단계 고정 규격]
 * T1 (Main)   : text-2xl md:text-5xl (자산, 대제목)
 * T2 (Section): text-lg  md:text-2xl (섹션 제목, 카드 타이틀)
 * T3 (Action) : text-sm   md:text-lg  (버튼, 입력 필드, 단계 제목)
 * T4 (Info)   : text-[10px] md:text-sm (설명 문구, 메타데이터, 푸터)
 * -----------------------------------------------------------
 */

const PI_INVITE_CODE = 'ohsangjo';
const PI_APP_STORE_URL = 'https://apps.apple.com/app/pi-network/id1445472541';
const PI_PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.blockchainvault';

const DICT = {
  KR: {
    rookie: "ROOKIE", pioneer: "PIONEER", exchange: "EXCHANGE", auth: "SECURE AUTH", creative: "CREATIVE", market: "MARKET",
    invitation: "Web3 초대합니다.", procedure: "가입절차 안내", assets: "ASSETS", activate: "인증 활성화",
    convert: "1 PI 환전", post: "피드 등록", praise: "호응하기", buy: "구매하기", register: "상품 등록",
    stepDesc: "가입을 위한 친절한 8단계 가이드입니다.",
    steps: [
      { t: "애플리케이션 설치", d: "스토어에서 [Pi Network] 공식 앱을 검색하여 설치하십시오." },
      { t: "가입 방식 선택", d: "[Continue with phone number] 보안 가입을 선택하십시오." },
      { t: "국가 및 번호 설정", d: "국가를 [+82(South Korea)]로 설정 후 본인 번호를 입력하십시오." },
      { t: "보안 비밀번호 생성", d: "영문 대/소문자와 숫자를 조합하여 강력한 암호를 만드십시오." },
      { t: "실명 프로필 작성", d: "여권 영문 실명을 입력하고 고유 ID를 설정하십시오." },
      { t: "웹3 초대 코드 입력", d: `초대 코드 [ ${PI_INVITE_CODE} ]를 정확히 입력하십시오.` },
      { t: "비밀구절 수기 보관", d: "지갑의 24개 비밀구절은 오직 종이에만 기록하여 보관하십시오." },
      { t: "채굴 버튼 활성화", d: "번개 버튼을 눌러 정식 활동을 시작하십시오." }
    ]
  },
  EN: {
    rookie: "ROOKIE", pioneer: "PIONEER", exchange: "EXCHANGE", auth: "SECURE AUTH", creative: "CREATIVE", market: "MARKET",
    invitation: "WEB3 INVITATION", procedure: "REGISTRATION GUIDE", assets: "ASSETS", activate: "ACTIVATE QR",
    convert: "CONVERT 1 PI", post: "POST FEED", praise: "PRAISE", buy: "BUY NOW", register: "REGISTER",
    stepDesc: "Friendly 8-step guide to join the ecosystem.",
    steps: [
      { t: "App Installation", d: "Install the official [Pi Network] app from stores." },
      { t: "Select Method", d: "Use [Continue with phone number] for security." },
      { t: "Region Config", d: "Set to [+82(South Korea)] and enter number." },
      { t: "Password", d: "Create a strong alphanumeric password." },
      { t: "Real Identity", d: "Enter Passport name and set your unique ID." },
      { t: "Invitation", d: `Use invitation code [ ${PI_INVITE_CODE} ] to join.` },
      { t: "Passphrase", d: "Hand-write the 24 words on physical paper." },
      { t: "Mining Activation", d: "Engage the lightning button to start mining." }
    ]
  }
};

interface Review { id: number; user: string; text: string; time: string; }
interface Asset { id: number; title: string; desc: string; category: string; beom: number; time: string; }
interface Good { id: number; name: string; price: number; img: string; reviews: Review[]; }

export default function KedheonPortal() {
  const [hasMounted, setHasMounted] = useState(false);
  const [lang, setLang] = useState<'KR' | 'EN'>('KR');
  const [tab, setTab] = useState<'ROOKIE' | 'PIONEER'>('PIONEER');
  const [beomToken, setBeomToken] = useState(7891.88);
  const [qrType, setQrType] = useState<'PERSONAL' | 'BUSINESS'>('PERSONAL');
  const [bizName, setBizName] = useState('');
  const [isQrActive, setIsQrActive] = useState(false);
  const [postCategory, setPostCategory] = useState('TECH');
  const [assets, setAssets] = useState<Asset[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [goods, setGoods] = useState<Good[]>([
    { id: 1, name: "GOLD BADGE", price: 1000, img: "/beom-token.png", reviews: [{ id: 1, user: "Alpha", text: "정교한 비례의 굿즈입니다.", time: "2026.04.29" }] }
  ]);
  const [sellName, setSellName] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [sellImg, setSellImg] = useState('');

  const L = DICT[lang];
  const cats = ['MUSIC', 'TECH', 'ART', 'FOOD', 'TRAVEL', 'GAME', 'NEWS', 'MOVIE'];

  useEffect(() => {
    setHasMounted(true);
    const saved = localStorage.getItem('kedheon_v87_final');
    if (saved) {
      try {
        const p = JSON.parse(saved);
        if (p.token !== undefined) setBeomToken(p.token);
        if (p.lang) setLang(p.lang);
        if (Array.isArray(p.assets)) setAssets(p.assets);
      } catch (e) { console.error(e); }
    }
  }, []);

  useEffect(() => {
    if (hasMounted) localStorage.setItem('kedheon_v87_final', JSON.stringify({ token: beomToken, lang, assets }));
  }, [beomToken, lang, assets, hasMounted]);

  const SectionHeader = ({ num, title, desc }: { num: string; title: string; desc: string }) => (
    <div className="w-full border-t border-white/10 pt-6 md:pt-8 mb-4 text-left font-black">
      <h2 className="text-[#daa520] text-xl md:text-2xl uppercase italic mb-1 border-l-4 border-[#daa520] pl-3 leading-tight tracking-tighter">
        {num}. {title}
      </h2>
      <p className="text-white/40 text-[10px] md:text-sm font-sans font-bold leading-tight pl-4 italic">{desc}</p>
    </div>
  );

  if (!hasMounted) return null;

  return (
    <div className="flex flex-col items-center bg-black min-h-screen text-white font-sans w-full pb-80 font-black overflow-x-hidden">
      
      {/* --- [GNB: 상단바] --- */}
      <div className="w-full max-w-5xl flex justify-between items-center px-4 py-3 md:p-4 sticky top-0 bg-black/95 backdrop-blur-xl z-[150] border-b border-[#daa520]/20 shadow-lg">
        <div className="flex items-center gap-2">
          <img src="/kedheon-character.png" className="w-8 h-8 md:w-10 md:h-10 rounded-lg border border-[#daa520]/50" alt="K" />
          <div className="text-left font-black leading-tight">
            <h2 className="text-[#daa520] text-lg md:text-xl italic uppercase tracking-tighter">Kedheon</h2>
            <span className="text-white/40 text-[8px] md:text-[10px] font-mono tracking-widest uppercase">v87.0 Integrity</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex bg-[#111] rounded-lg p-0.5 border border-white/10 font-black">
            <button onClick={() => setLang('KR')} className={`px-2 py-1 rounded-md text-[9px] md:text-[11px] transition-all ${lang === 'KR' ? 'bg-[#daa520] text-black shadow-sm' : 'text-white/30'}`}>KR</button>
            <button onClick={() => setLang('EN')} className={`px-2 py-1 rounded-md text-[9px] md:text-[11px] transition-all ${lang === 'EN' ? 'bg-[#daa520] text-black shadow-sm' : 'text-white/30'}`}>EN</button>
          </div>
          <div className="flex gap-1.5">
            <button onClick={() => setTab('ROOKIE')} className={`px-3 py-1.5 rounded-lg text-[10px] md:text-xs border transition-all font-black ${tab === 'ROOKIE' ? 'bg-[#daa520] text-black border-white shadow-md' : 'border-white/5 text-white/30'}`}>{L.rookie}</button>
            <button onClick={() => setTab('PIONEER')} className={`px-3 py-1.5 rounded-lg text-[10px] md:text-xs border transition-all font-black ${tab === 'PIONEER' ? 'bg-[#daa520] text-black border-white shadow-md' : 'border-white/5 text-white/30'}`}>{L.pioneer}</button>
          </div>
        </div>
      </div>

      <div className="w-full max-w-4xl px-4 py-4 md:py-8">
        {tab === 'ROOKIE' ? (
          /* --- [ROOKIE: 수직 배치 복구] --- */
          <div className="flex flex-col gap-6 md:gap-10 animate-in fade-in text-left">
            <div className="flex flex-col items-center text-center gap-4 py-8 bg-[#111] rounded-[30px] border-2 border-[#daa520]/40 shadow-2xl relative overflow-hidden">
              <img src="/kedheon-character.png" className="w-32 h-32 md:w-44 md:h-44 rounded-[30px] border-2 border-white/50 shadow-xl relative z-10" alt="Main" />
              <div className="relative z-10 px-4 font-black">
                <h1 className="text-[#daa520] text-2xl md:text-5xl uppercase mb-1 tracking-tighter drop-shadow-md">{L.invitation}</h1>
                <p className="text-white text-lg md:text-2xl uppercase tracking-widest border-b-2 border-[#daa520] pb-2 inline-block font-black">{L.procedure}</p>
                <p className="text-white/40 text-[11px] md:text-sm mt-3 italic font-sans">{L.stepDesc}</p>
              </div>
            </div>

            {/* 수직형 가이드 리스트 */}
            <div className="grid grid-cols-1 gap-2 md:gap-3 font-black">
              {L.steps.map((step: any, i: number) => (
                <div key={i} className={`p-4 md:p-5 bg-[#111] rounded-2xl border flex items-center gap-4 md:gap-8 transition-all ${i >= 5 ? 'border-[#daa520]/40 bg-[#daa520]/5' : 'border-white/10'}`}>
                  <span className="text-[#daa520] text-sm md:text-2xl font-black font-sans italic opacity-80 whitespace-nowrap">0{i+1}</span>
                  <div>
                    <h3 className="text-white text-sm md:text-lg font-black uppercase italic mb-0.5">{step.t}</h3>
                    <p className="text-white/40 text-[10px] md:text-[13px] font-sans font-bold leading-snug">{step.d}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* [복구] 앱 다운로드 경로 */}
            <div className="flex gap-2 pt-4">
              <button onClick={() => window.open(PI_APP_STORE_URL)} className="flex-1 bg-white text-black py-4 rounded-xl text-sm md:text-lg font-black uppercase border-2 border-[#daa520] active:scale-95 shadow-md transition-all">App Store</button>
              <button onClick={() => window.open(PI_PLAY_STORE_URL)} className="flex-1 bg-white text-black py-4 rounded-xl text-sm md:text-lg font-black uppercase border-2 border-[#daa520] active:scale-95 shadow-md transition-all">Play Store</button>
            </div>
          </div>
        ) : (
          /* --- [PIONEER: 핵심 인터페이스] --- */
          <div className="flex flex-col gap-6 md:gap-10 py-2 text-left font-black animate-in slide-in-from-bottom-2">
            
            {/* 자산 대시보드 (컴팩트 최적화) */}
            <div className="bg-[#111] p-6 md:p-10 rounded-[35px] md:rounded-[50px] border-2 border-[#daa520] shadow-xl flex justify-between items-center relative overflow-hidden">
                <div className="text-left font-black z-10">
                  <h3 className="text-white/40 text-[9px] md:text-[12px] uppercase tracking-widest mb-1 font-sans">{L.assets}</h3>
                  <p className="text-[#daa520] text-3xl md:text-6xl tracking-tighter leading-none font-black drop-shadow-lg">
                    {Math.floor(beomToken).toLocaleString()}
                    <span className="text-sm md:text-2xl opacity-60">.{beomToken.toFixed(2).split('.')[1]}</span> 
                    <span className="ml-2 text-lg md:text-3xl">BEOM</span>
                  </p>
                  <div className="mt-2 text-[10px] md:text-lg font-mono italic text-white/40">≈ {(beomToken / PI_TO_BEOM_RATIO).toFixed(4)} Pi</div>
                </div>
                <img src="/beom-token.png" className="w-16 h-16 md:w-32 md:h-32 object-contain animate-pulse" alt="B" />
            </div>

            {/* 01. EXCHANGE */}
            <SectionHeader num="01" title={L.exchange} desc="채굴 기여도를 전환하십시오." />
            <div className="bg-[#1a1a1a] p-5 md:p-8 rounded-[30px] border border-white/10 flex justify-between items-center shadow-lg transition-all hover:border-[#daa520]/50">
              <div className="font-sans text-left">
                <p className="text-white text-sm md:text-lg font-black italic uppercase">Terminal</p>
                <p className="text-[#daa520] text-[9px] md:text-xs font-black uppercase">Rate: 1 Pi = 100 BEOM</p>
              </div>
              <button onClick={() => setBeomToken(p=>p+100)} className="bg-[#daa520] text-black px-6 md:px-12 py-3 md:py-5 rounded-xl md:rounded-2xl text-sm md:text-xl border-2 border-white active:scale-95 uppercase font-black transition-transform shadow-md">{L.convert}</button>
            </div>

            {/* 02. AUTH (WIDE QR + Overlay) */}
            <SectionHeader num="02" title={L.auth} desc="보안 인증을 완료하십시오." />
            <div className="bg-[#1a1a1a] p-6 md:p-10 rounded-[35px] border border-white/10 flex flex-col items-center gap-6 shadow-xl">
              <div className="flex gap-2 w-full max-w-sm bg-black p-1 rounded-xl border border-white/10 font-black">
                <button onClick={() => { setQrType('PERSONAL'); setIsQrActive(false); }} className={`flex-1 py-2 md:py-4 rounded-lg text-[10px] md:text-sm font-black transition-all ${qrType === 'PERSONAL' ? 'bg-[#daa520] text-black border border-white shadow-md' : 'text-white/30'}`}>PERSONAL</button>
                <button onClick={() => { setQrType('BUSINESS'); setIsQrActive(false); }} className={`flex-1 py-2 md:py-4 rounded-lg text-[10px] md:text-sm font-black transition-all ${qrType === 'BUSINESS' ? 'bg-[#daa520] text-black border border-white shadow-md' : 'text-white/30'}`}>BUSINESS</button>
              </div>
              <div className={`relative bg-black border-2 rounded-[30px] flex flex-col items-center justify-center transition-all duration-500 overflow-hidden shadow-xl
                ${qrType === 'PERSONAL' ? 'w-56 h-56 md:w-72 md:h-72' : 'w-full max-w-md aspect-video'} 
                ${isQrActive ? 'border-[#daa520] opacity-100' : 'opacity-20 border-white/10'}`}
              >
                {isQrActive ? (
                  <>
                    <img src={qrType === 'PERSONAL' ? "/qr-personal.png" : "/qr-business.png"} className={`w-full h-full ${qrType === 'PERSONAL' ? 'object-contain' : 'object-cover'}`} alt="QR" />
                    <div className="absolute bottom-4 bg-black/80 px-6 py-1.5 rounded-full border border-[#daa520]/50 backdrop-blur-md">
                      <span className="text-[#daa520] text-[10px] md:text-sm font-black tracking-widest italic uppercase">{bizName || "NAME"}</span>
                    </div>
                  </>
                ) : <p className="text-white/10 text-xl md:text-3xl font-black uppercase italic tracking-widest">Locked</p>}
              </div>
              <button onClick={() => setIsQrActive(true)} className="w-full max-w-xs bg-[#daa520] text-black py-4 md:py-6 rounded-xl md:rounded-3xl text-sm md:text-xl border-2 border-white active:scale-95 uppercase font-black shadow-lg">{L.activate} (50)</button>
            </div>

            {/* 03. CREATIVE */}
            <SectionHeader num="03" title={L.creative} desc="영상을 게시하고 호응을 받으십시오." />
            <div className="bg-[#1a1a1a] p-5 md:p-8 rounded-[35px] border border-white/10 space-y-4 shadow-xl text-left font-black">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {cats.map(cat => (
                  <button key={cat} onClick={() => setPostCategory(cat)} className={`px-4 py-2 rounded-full text-[9px] md:text-[11px] font-black border transition-all ${postCategory === cat ? 'bg-white text-black border-[#daa520] shadow-sm' : 'border-white/10 text-white/30'}`}>{cat}</button>
                ))}
              </div>
              <div className="space-y-3 font-black">
                <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="TITLE" className="w-full bg-black border border-white/10 p-4 rounded-xl text-sm md:text-lg text-white outline-none focus:border-[#daa520] transition-all" />
                <textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="DESCRIPTION" className="w-full bg-black border border-white/10 p-4 rounded-xl text-[11px] md:text-sm text-white/70 h-24 outline-none font-bold" />
              </div>
              <div className="flex gap-3">
                <button onClick={() => {
                   if(!newTitle) return;
                   const post = { id: Date.now(), title: newTitle, desc: newDesc, category: postCategory, beom: 0, time: "NOW" };
                   setAssets([post, ...assets]); setNewTitle(''); setNewDesc('');
                }} className="flex-[2] bg-[#daa520] text-black py-4 rounded-xl md:rounded-2xl text-sm md:text-lg border-2 border-white uppercase font-black shadow-md active:scale-95">{L.post} (10)</button>
                <button className="flex-1 bg-white text-black py-4 rounded-xl md:rounded-2xl text-[10px] md:text-xs border border-[#daa520] uppercase font-black leading-tight shadow-md transition-all">🚩 FAN ROOM</button>
              </div>
            </div>

            {/* 04. MARKET (판매등록 및 구매후기 완전 복구) */}
            <SectionHeader num="04" title={L.market} desc="GOODS를 거래하고 후기를 남기십시오." />
            
            {/* [복구] 판매 게시물 등록 박스 */}
            <div className="bg-[#1a1a1a] p-5 md:p-8 rounded-[30px] border border-[#daa520]/30 space-y-4 mb-6 shadow-xl text-left font-black animate-in fade-in">
              <h3 className="text-white text-xs md:text-sm uppercase italic font-black border-l-2 border-[#daa520] pl-2 font-sans">Register New Goods</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <input value={sellName} onChange={(e) => setSellName(e.target.value)} placeholder="ITEM NAME" className="w-full bg-black border border-white/10 p-4 rounded-xl text-sm text-white outline-none focus:border-[#daa520]" />
                <input type="number" value={sellPrice} onChange={(e) => setSellPrice(e.target.value)} placeholder="PRICE (BEOM)" className="w-full bg-black border border-white/10 p-4 rounded-xl text-sm text-[#daa520] outline-none" />
              </div>
              <input value={sellImg} onChange={(e) => setSellImg(e.target.value)} placeholder="IMAGE URL (LINK)" className="w-full bg-black border border-white/10 p-4 rounded-xl text-[10px] md:text-xs text-white/50 outline-none" />
              <button onClick={() => {
                if(!sellName || !sellPrice) return alert("항목을 모두 입력하십시오.");
                const ng: Good = { id: Date.now(), name: sellName, price: Number(sellPrice), img: sellImg || "/beom-token.png", reviews: [] };
                setGoods([ng, ...goods]); setBeomToken(p=>p-20); setSellName(''); setSellPrice(''); setSellImg('');
                alert("상품 등록 완료");
              }} className="w-full bg-[#daa520] text-black py-4 rounded-xl text-sm md:text-lg border-2 border-white uppercase font-black shadow-md active:scale-95 transition-transform">{L.register} (20)</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 font-black text-left font-sans">
              {/* 상품 리스트 */}
              <div className="space-y-4">
                <h3 className="text-white text-[10px] md:text-[12px] uppercase border-b border-white/10 pb-1 italic font-black tracking-widest">GOODS LIST</h3>
                <div className="grid grid-cols-1 gap-4">
                  {goods.map(g => (
                    <div key={g.id} className="bg-[#111] p-5 md:p-8 rounded-[35px] border border-white/10 shadow-lg text-center group transition-all hover:border-[#daa520]/30">
                      <img src={g.img} className="w-full h-40 md:h-56 object-contain bg-black rounded-[25px] border border-white/5 mb-6 shadow-inner transition-transform group-hover:scale-105" alt="G" />
                      <h4 className="text-white text-sm md:text-xl uppercase mb-1 font-black">{g.name}</h4>
                      <p className="text-[#daa520] text-2xl md:text-4xl mb-4 font-black tracking-tighter">{g.price.toLocaleString()} <span className="text-[10px] md:text-lg font-black">BEOM</span></p>
                      <button className="w-full py-3 md:py-5 bg-white text-black rounded-xl md:rounded-2xl text-xs md:text-lg border-2 border-[#daa520] uppercase font-black active:scale-95 shadow-md">Buy Now</button>
                    </div>
                  ))}
                </div>
              </div>

              {/* [복구] 구매 후기 게시판 */}
              <div className="space-y-4">
                <h3 className="text-white text-[10px] md:text-[12px] uppercase border-b border-white/10 pb-1 italic font-black tracking-widest">USER REVIEWS</h3>
                <div className="space-y-3">
                  {goods[0]?.reviews.map(r => (
                    <div key={r.id} className="bg-black/50 p-4 md:p-6 rounded-[25px] border border-white/10 shadow-inner transition-all hover:border-[#daa520]/20 font-black">
                      <p className="text-white/70 text-[10px] md:text-[13px] italic font-sans mb-3 leading-relaxed">"{r.text}"</p>
                      <div className="flex justify-between items-center text-[9px] md:text-[11px] font-mono text-[#daa520] font-black uppercase tracking-widest">
                        <span>- {r.user}</span>
                        <span className="text-white/30">{r.time}</span>
                      </div>
                    </div>
                  ))}
                  <button className="w-full py-4 border border-dashed border-white/10 rounded-xl text-[10px] md:text-xs text-white/30 uppercase font-black hover:border-[#daa520] hover:text-[#daa520] transition-all font-sans shadow-sm">Write Review</button>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* --- [하단 네비게이션: 콘텐츠 침범 방지pb-80 대응] --- */}
      <div className="fixed bottom-6 left-4 right-4 max-w-5xl mx-auto bg-black/98 border-2 border-[#daa520]/50 p-1 rounded-[25px] flex justify-between gap-1 z-[200] shadow-[0_0_60px_rgba(218,165,32,0.5)] backdrop-blur-3xl">
        {['KEDHEON', 'CIVIL', 'NEXUS', 'VENDOR'].map(app => (
          <button key={app} className={`flex-1 py-4 md:py-6 rounded-[20px] text-[9px] md:text-xs transition-all font-black text-center ${app === 'KEDHEON' ? 'bg-[#daa520] text-black border border-white shadow-inner scale-100 font-black' : 'text-white/30 hover:text-white'}`}>{app}</button>
        ))}
      </div>

      {/* --- [푸터] --- */}
      <div className="mt-20 opacity-20 text-[9px] md:text-[11px] tracking-[1.5em] uppercase pb-10 font-sans font-black text-center">
        Kedheon Master | V87.0 Integrity | @Ohsangjo
      </div>
    </div>
  );
}
