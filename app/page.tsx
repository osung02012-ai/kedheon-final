'use client';
import React, { useState, useEffect } from 'react';

/** * [KEDHEON MASTER V89.0 ARCHITECTURAL PRESTIGE COMPACT]
 * -----------------------------------------------------------
 * [텍스트 4단계 고정 규격]
 * T1 (Huge)   : text-2xl md:text-5xl (자산 수치, 대제목)
 * T2 (Large)  : text-lg  md:text-2xl (섹션 제목, 카드 타이틀)
 * T3 (Medium) : text-sm   md:text-lg  (버튼, 입력 필드, 단계 제목)
 * T4 (Small)  : text-[10px] md:text-[13px] (설명 문구, 메타데이터, 푸터)
 * -----------------------------------------------------------
 */

const PI_INVITE_CODE = 'ohsangjo';
const PI_APP_STORE = 'https://apps.apple.com/app/pi-network/id1445472541';
const PI_PLAY_STORE = 'https://play.google.com/store/apps/details?id=com.blockchainvault';

const DICT = {
  KR: {
    rookie: "ROOKIE", pioneer: "PIONEER", exchange: "EXCHANGE", auth: "AUTH", creative: "CREATIVE", market: "MARKET",
    invitation: "Web3 초대합니다.", procedure: "가입절차 안내", assets: "ASSETS", activate: "QR 활성화",
    convert: "1 PI 환전", post: "피드 등록", praise: "호응하기", buy: "구매하기", register: "상품 등록",
    stepDesc: "가입을 위한 친절한 8단계 가이드입니다.",
    steps: [
      { t: "앱 설치", d: "스토어에서 [Pi Network] 공식 앱을 설치하십시오." },
      { t: "가입 방식", d: "[Continue with phone number]를 선택하십시오." },
      { t: "국가 설정", d: "국가를 [+82(South Korea)]로 설정하십시오." },
      { t: "암호 생성", d: "영문 대/소문자와 숫자를 조합하십시오." },
      { t: "프로필 작성", d: "여권 영문 실명과 고유 ID를 설정하십시오." },
      { t: "초대 코드", d: `초대 코드 [ ${PI_INVITE_CODE} ]를 입력하십시오.` },
      { t: "비밀구절", d: "24개 단어를 종이에만 기록하여 보관하십시오." },
      { t: "채굴 시작", d: "번개 버튼을 눌러 활동을 시작하십시오." }
    ]
  },
  EN: {
    rookie: "ROOKIE", pioneer: "PIONEER", exchange: "EXCHANGE", auth: "AUTH", creative: "CREATIVE", market: "MARKET",
    invitation: "WEB3 INVITATION", procedure: "REGISTRATION", assets: "ASSETS", activate: "ACTIVATE QR",
    convert: "CONVERT 1 PI", post: "POST FEED", praise: "PRAISE", buy: "BUY NOW", register: "REGISTER",
    stepDesc: "Friendly 8-step guide to join.",
    steps: [
      { t: "Install App", d: "Download the [Pi Network] app." },
      { t: "Method", d: "Use [Continue with phone number]." },
      { t: "Region", d: "Set to [+82(South Korea)]." },
      { t: "Password", d: "Create a secure password." },
      { t: "Identity", d: "Enter English name and ID." },
      { t: "Invitation", d: `Use code [ ${PI_INVITE_CODE} ].` },
      { t: "Passphrase", d: "Write down 24 words on paper." },
      { t: "Mining", d: "Click lightning to start." }
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
    { id: 1, name: "GOLD BADGE", price: 1000, img: "/beom-token.png", reviews: [{ id: 1, user: "Alpha", text: "상당히 정교한 마감입니다.", time: "2026.04.29" }] }
  ]);
  const [sellName, setSellName] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [sellImg, setSellImg] = useState('');

  const L = DICT[lang];
  const cats = ['MUSIC', 'TECH', 'ART', 'FOOD', 'TRAVEL', 'GAME', 'NEWS', 'MOVIE'];

  useEffect(() => {
    setHasMounted(true);
    const saved = localStorage.getItem('kedheon_v89_final');
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
    if (hasMounted) localStorage.setItem('kedheon_v89_final', JSON.stringify({ token: beomToken, lang, assets }));
  }, [beomToken, lang, assets, hasMounted]);

  const SectionHeader = ({ num, title, desc }: { num: string; title: string; desc: string }) => (
    <div className="w-full border-t border-white/10 pt-6 md:pt-8 mb-4 text-left font-black">
      <h2 className="text-[#daa520] text-xl md:text-3xl uppercase italic mb-1 border-l-4 border-[#daa520] pl-3 tracking-tighter">
        {num}. {title}
      </h2>
      <p className="text-white/40 text-[10px] md:text-sm font-sans font-bold leading-tight pl-4 italic">{desc}</p>
    </div>
  );

  if (!hasMounted) return null;

  return (
    <div className="flex flex-col items-center bg-black min-h-screen text-white font-sans w-full pb-96 font-black overflow-x-hidden">
      
      {/* --- [GNB: 고밀도 상단바] --- */}
      <div className="w-full max-w-6xl flex justify-between items-center px-4 py-3 md:px-8 md:py-4 sticky top-0 bg-black/95 backdrop-blur-xl z-[150] border-b border-[#daa520]/30 shadow-xl">
        <div className="flex items-center gap-2">
          <img src="/kedheon-character.png" className="w-8 h-8 md:w-10 md:h-10 rounded-lg border border-[#daa520]/50" alt="K" />
          <div className="text-left font-black leading-tight">
            <h2 className="text-[#daa520] text-lg md:text-xl italic uppercase tracking-tighter">Kedheon</h2>
            <span className="text-white/30 text-[8px] md:text-[10px] font-mono tracking-widest uppercase">v89.0 Prestige</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex bg-[#111] rounded-lg p-0.5 border border-white/10 font-black">
            <button onClick={() => setLang('KR')} className={`px-2.5 py-1 rounded-md text-[9px] md:text-[11px] transition-all ${lang === 'KR' ? 'bg-[#daa520] text-black' : 'text-white/30'}`}>KR</button>
            <button onClick={() => setLang('EN')} className={`px-2.5 py-1 rounded-md text-[9px] md:text-[11px] transition-all ${lang === 'EN' ? 'bg-[#daa520] text-black' : 'text-white/30'}`}>EN</button>
          </div>
          <div className="flex gap-1.5">
            <button onClick={() => setTab('ROOKIE')} className={`px-3 py-1.5 rounded-lg text-[10px] md:text-xs border transition-all font-black ${tab === 'ROOKIE' ? 'bg-[#daa520] text-black border-white' : 'border-white/5 text-white/30'}`}>{L.rookie}</button>
            <button onClick={() => setTab('PIONEER')} className={`px-3 py-1.5 rounded-lg text-[10px] md:text-xs border transition-all font-black ${tab === 'PIONEER' ? 'bg-[#daa520] text-black border-white' : 'border-white/5 text-white/30'}`}>{L.pioneer}</button>
          </div>
        </div>
      </div>

      <div className="w-full max-w-4xl px-4 py-4 md:py-8">
        {tab === 'ROOKIE' ? (
          /* --- [ROOKIE: 수직 구조 및 앱 다운로드 경로] --- */
          <div className="flex flex-col gap-6 md:gap-10 animate-in fade-in text-left">
            <div className="flex flex-col items-center text-center gap-4 py-10 bg-[#111] rounded-[35px] border-2 border-[#daa520]/30 shadow-2xl relative overflow-hidden font-black">
              <img src="/kedheon-character.png" className="w-32 h-32 md:w-44 md:h-44 rounded-[35px] border-2 border-white/50 shadow-xl relative z-10" alt="Main" />
              <div className="relative z-10 px-6 font-black">
                <h1 className="text-[#daa520] text-2xl md:text-5xl uppercase mb-1 tracking-tighter">{L.invitation}</h1>
                <p className="text-white text-lg md:text-2xl uppercase tracking-widest border-b-2 border-[#daa520] pb-2 inline-block">{L.procedure}</p>
                <p className="text-white/40 text-[10px] md:text-sm mt-4 font-sans italic">{L.stepDesc}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2 md:gap-3 font-black">
              {L.steps.map((step: any, i: number) => (
                <div key={i} className={`p-4 md:p-6 bg-[#111] rounded-2xl border flex items-center gap-5 md:gap-8 transition-all ${i >= 5 ? 'border-[#daa520]/40 bg-[#daa520]/5' : 'border-white/10'}`}>
                  <span className="text-[#daa520] text-base md:text-2xl font-black font-sans italic opacity-80">0{i+1}</span>
                  <div>
                    <h3 className="text-white text-sm md:text-lg font-black uppercase italic mb-0.5">{step.t}</h3>
                    <p className="text-white/40 text-[10px] md:text-[13px] font-sans font-bold leading-snug">{step.d}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-4">
              <button onClick={() => window.open(PI_APP_STORE)} className="flex-1 bg-white text-black py-4 rounded-xl text-sm md:text-lg font-black border-2 border-[#daa520] active:scale-95 shadow-md">App Store</button>
              <button onClick={() => window.open(PI_PLAY_STORE)} className="flex-1 bg-white text-black py-4 rounded-xl text-sm md:text-lg font-black border-2 border-[#daa520] active:scale-95 shadow-md">Play Store</button>
            </div>
          </div>
        ) : (
          /* --- [PIONEER: 핵심 경제 인터페이스] --- */
          <div className="flex flex-col gap-8 md:gap-14 py-2 text-left font-black animate-in slide-in-from-bottom-2">
            
            {/* ASSETS (T1 규격 고정) */}
            <div className="bg-[#111] p-6 md:p-12 rounded-[40px] md:rounded-[60px] border-4 border-[#daa520] shadow-[0_0_50px_rgba(218,165,32,0.2)] flex justify-between items-center relative overflow-hidden">
                <div className="text-left font-black z-10">
                  <h3 className="text-white/40 text-[9px] md:text-[13px] uppercase tracking-[0.5em] mb-1 font-sans">{L.assets}</h3>
                  <p className="text-[#daa520] text-3xl md:text-7xl tracking-tighter leading-none font-black drop-shadow-lg">
                    {Math.floor(beomToken).toLocaleString()}
                    <span className="text-lg md:text-3xl opacity-50">.{beomToken.toFixed(2).split('.')[1]}</span> 
                    <span className="ml-3 text-xl md:text-4xl font-black">BEOM</span>
                  </p>
                  <div className="mt-4 bg-black/60 px-6 py-2 rounded-xl border border-white/10 inline-block text-xs md:text-2xl font-mono italic text-white/50 font-black">
                    ≈ {(beomToken / 100).toFixed(4)} Pi
                  </div>
                </div>
                <img src="/beom-token.png" className="w-16 h-16 md:w-44 md:h-44 object-contain animate-pulse" alt="B" />
            </div>

            {/* 01. EXCHANGE */}
            <SectionHeader num="01" title={L.exchange} desc="기여도를 전환하십시오." />
            <div className="bg-[#1a1a1a] p-6 md:p-10 rounded-[40px] border border-white/10 flex justify-between items-center shadow-xl transition-all hover:border-[#daa520]/50">
              <div className="font-sans text-left font-black">
                <p className="text-white text-sm md:text-2xl font-black italic uppercase leading-none">Terminal</p>
                <p className="text-[#daa520] text-[9px] md:text-sm font-black mt-2">1 Pi = 100 BEOM</p>
              </div>
              <button onClick={() => { setBeomToken(p=>p+100); alert("Success"); }} className="bg-[#daa520] text-black px-8 py-4 md:px-14 md:py-6 rounded-xl md:rounded-[30px] text-sm md:text-2xl border-2 border-white active:scale-95 uppercase font-black shadow-lg">{L.convert}</button>
            </div>

            {/* 02. AUTH (Wide QR 최적화) */}
            <SectionHeader num="02" title={L.auth} desc="보안 인증을 진행하십시오." />
            <div className="bg-[#1a1a1a] p-6 md:p-10 rounded-[40px] border border-white/10 flex flex-col items-center gap-8 shadow-xl">
              <div className="flex gap-3 w-full max-w-md bg-black p-1.5 rounded-2xl border-2 border-white/10 font-black">
                <button onClick={() => { setQrType('PERSONAL'); setIsQrActive(false); }} className={`flex-1 py-3 md:py-5 rounded-xl text-xs md:text-sm transition-all font-black border-2 ${qrType === 'PERSONAL' ? 'bg-[#daa520] text-black border-white shadow-xl' : 'border-transparent text-white/30'}`}>PERSONAL</button>
                <button onClick={() => { setQrType('BUSINESS'); setIsQrActive(false); }} className={`flex-1 py-3 md:py-5 rounded-xl text-xs md:text-sm transition-all font-black border-2 ${qrType === 'BUSINESS' ? 'bg-[#daa520] text-black border-white shadow-xl' : 'border-transparent text-white/30'}`}>BUSINESS</button>
              </div>
              
              <div className={`relative bg-black border-4 rounded-[40px] flex flex-col items-center justify-center transition-all duration-700 overflow-hidden shadow-2xl
                ${qrType === 'PERSONAL' ? 'w-64 h-64 md:w-80 md:h-80' : 'w-full max-w-xl aspect-video'} 
                ${isQrActive ? 'border-[#daa520] opacity-100' : 'opacity-20 border-white/10'}`}
              >
                {isQrActive ? (
                  <>
                    <img src={qrType === 'PERSONAL' ? "/qr-personal.png" : "/qr-business.png"} className={`w-full h-full ${qrType === 'PERSONAL' ? 'object-contain' : 'object-cover'}`} alt="QR" />
                    <div className="absolute bottom-6 bg-black/80 px-8 py-2 rounded-full border border-[#daa520]/50 backdrop-blur-md">
                      <span className="text-[#daa520] text-xs md:text-xl font-black tracking-widest italic uppercase">{bizName || "NAME"}</span>
                    </div>
                  </>
                ) : <p className="text-white/10 text-2xl md:text-5xl font-black uppercase italic tracking-widest font-sans">Locked</p>}
              </div>
              <button onClick={() => setIsQrActive(true)} className="w-full max-w-md bg-[#daa520] text-black py-4 md:py-8 rounded-2xl md:rounded-[40px] text-lg md:text-2xl border-4 border-white active:scale-95 uppercase font-black shadow-2xl">{L.activate} (50)</button>
            </div>

            {/* 03. CREATIVE */}
            <SectionHeader num="03" title={L.creative} desc="영상과 창작물을 게시하십시오." />
            <div className="bg-[#1a1a1a] p-6 md:p-10 rounded-[40px] border border-white/10 space-y-6 shadow-xl text-left font-black">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {cats.map(cat => (
                  <button key={cat} onClick={() => setPostCategory(cat)} className={`px-5 py-2.5 rounded-full text-[10px] md:text-sm font-black border transition-all whitespace-nowrap ${postCategory === cat ? 'bg-white text-black border-[#daa520] shadow-md' : 'border-white/10 text-white/30 hover:text-white'}`}>{cat}</button>
                ))}
              </div>
              <div className="space-y-4">
                <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="TITLE (T2)" className="w-full bg-black border border-white/20 p-5 rounded-2xl text-lg md:text-2xl text-white outline-none focus:border-[#daa520] font-black" />
                <textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="DESCRIPTION (T3)" className="w-full bg-black border border-white/20 p-5 rounded-2xl text-sm md:text-xl text-white/70 h-32 outline-none font-bold shadow-inner" />
              </div>
              <div className="flex gap-4">
                <button onClick={() => {if(!newTitle) return; setAssets([{id:Date.now(), title:newTitle, desc:newDesc, category:postCategory, beom:0, time:"NOW"},...assets]); setNewTitle(''); setNewDesc('');}} className="flex-[2] bg-[#daa520] text-black py-5 md:py-8 rounded-2xl md:rounded-[40px] text-lg md:text-3xl border-4 border-white uppercase font-black shadow-xl active:scale-95">{L.post} (10)</button>
                <button className="flex-1 bg-white text-black py-5 md:py-8 rounded-2xl md:rounded-[40px] text-sm md:text-lg border-2 border-[#daa520] uppercase font-black leading-tight shadow-xl">🚩 FAN ROOM</button>
              </div>
            </div>

            {/* 04. MARKET (판매등록/상품리스트/구매후기 통합 복구) */}
            <SectionHeader num="04" title={L.market} desc="GOODS를 거래하고 후기를 남기십시오." />
            
            {/* [복구] 판매 게시물 등록 박스 */}
            <div className="bg-[#1a1a1a] p-6 md:p-10 rounded-[40px] border border-[#daa520]/40 space-y-6 md:space-y-8 mb-6 shadow-2xl text-left font-black animate-in fade-in">
              <h3 className="text-white text-sm md:text-2xl uppercase italic font-black border-l-4 border-[#daa520] pl-3 mb-4 font-sans tracking-widest leading-none">Register New Goods</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input value={sellName} onChange={(e) => setSellName(e.target.value)} placeholder="ITEM NAME" className="w-full bg-black border border-white/20 p-5 rounded-2xl text-lg md:text-xl text-white outline-none focus:border-[#daa520] font-black" />
                <input type="number" value={sellPrice} onChange={(e) => setSellPrice(e.target.value)} placeholder="PRICE (BEOM)" className="w-full bg-black border border-white/20 p-5 rounded-2xl text-lg md:text-xl text-[#daa520] outline-none font-black" />
              </div>
              <input value={sellImg} onChange={(e) => setSellImg(e.target.value)} placeholder="IMAGE URL (LINK)" className="w-full bg-black border border-white/20 p-5 rounded-2xl text-sm md:text-lg text-white/50 outline-none font-black" />
              <button onClick={() => {
                if(!sellName || !sellPrice) return alert("All fields required");
                const ng: Good = { id: Date.now(), name: sellName, price: Number(sellPrice), img: sellImg || "/beom-token.png", reviews: [] };
                setGoods([ng, ...goods]); setBeomToken(p=>p-20); setSellName(''); setSellPrice(''); setSellImg('');
                alert("Listed successfully");
              }} className="w-full bg-[#daa520] text-black py-5 md:py-8 rounded-2xl md:rounded-[40px] text-lg md:text-2xl border-4 border-white uppercase font-black shadow-xl active:scale-95">{L.register} (20)</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 font-black text-left font-sans">
              {/* 상품 리스트 */}
              <div className="space-y-6">
                <h3 className="text-white text-xs md:text-sm uppercase border-b-2 border-white/10 pb-2 italic font-black tracking-widest">GOODS LIST</h3>
                <div className="grid grid-cols-1 gap-6">
                  {goods.map(g => (
                    <div key={g.id} className="bg-[#111] p-6 md:p-10 rounded-[45px] border border-white/10 shadow-2xl text-center group transition-all hover:border-[#daa520]/40">
                      <img src={g.img} className="w-full h-44 md:h-64 object-contain bg-black rounded-[35px] border border-white/5 mb-8 shadow-inner transition-transform group-hover:scale-105" alt="G" />
                      <h4 className="text-white text-lg md:text-2xl uppercase mb-2 font-black leading-none">{g.name}</h4>
                      <p className="text-[#daa520] text-3xl md:text-5xl mb-6 font-black tracking-tighter leading-none">{g.price.toLocaleString()} <span className="text-sm md:text-xl">BEOM</span></p>
                      <button className="w-full py-4 md:py-6 bg-white text-black rounded-2xl md:rounded-[40px] text-sm md:text-2xl border-4 border-[#daa520] uppercase font-black active:scale-95 shadow-xl transition-all">Buy Now</button>
                    </div>
                  ))}
                </div>
              </div>

              {/* [복구] 구매 후기 게시판 */}
              <div className="space-y-6">
                <h3 className="text-white text-xs md:text-sm uppercase border-b-2 border-white/10 pb-2 italic font-black tracking-widest">USER REVIEWS</h3>
                <div className="space-y-4">
                  {goods[0]?.reviews.map(r => (
                    <div key={r.id} className="bg-black/50 p-6 md:p-8 rounded-[35px] border border-white/10 shadow-inner transition-all hover:border-[#daa520]/20 font-black">
                      <p className="text-white/70 text-xs md:text-lg italic font-sans mb-4 leading-relaxed font-bold">"{r.text}"</p>
                      <div className="flex justify-between items-center text-[10px] md:text-sm font-mono text-[#daa520] font-black uppercase tracking-widest">
                        <span>- {r.user}</span>
                        <span className="text-white/30">{r.time}</span>
                      </div>
                    </div>
                  ))}
                  <button className="w-full py-6 md:py-10 border-4 border-dashed border-white/10 rounded-2xl md:rounded-[40px] text-xs md:text-lg text-white/30 uppercase font-black hover:border-[#daa520] hover:text-[#daa520] transition-all font-sans shadow-inner">Write Experience Review</button>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* --- [하단 통합 네비게이션: 간격 균등화 및 침범 차단 pb-96 대응] --- */}
      <div className="fixed bottom-6 left-4 right-4 max-w-6xl mx-auto bg-black/98 border-2 border-[#daa520]/50 p-2 rounded-[30px] flex justify-between gap-1 z-[200] shadow-[0_0_60px_rgba(218,165,32,0.4)] backdrop-blur-3xl font-black">
        {['KEDHEON', 'CIVIL', 'NEXUS', 'VENDOR'].map(app => (
          <button key={app} className={`flex-1 py-5 md:py-8 rounded-[25px] text-[10px] md:text-xl transition-all font-black text-center ${app === 'KEDHEON' ? 'bg-[#daa520] text-black border border-white shadow-inner scale-100 font-black' : 'text-white/30 hover:text-white'}`}>{app}</button>
        ))}
      </div>

      <div className="mt-40 opacity-20 text-[10px] md:text-sm tracking-[1.5em] uppercase pb-20 font-sans font-black text-center">
        Kedheon master | V89.0 Prestige | @Ohsangjo
      </div>
    </div>
  );
}
