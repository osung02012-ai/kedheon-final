'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';

/** * [KEDHEON MASTER V170.0 - SUPREME TOTAL EDITION]
 * -----------------------------------------------------------
 * 1. 버전 관리: V160.0의 혼란을 끝내고 V170.0으로 정식 격상
 * 2. 가독성 복구: V105.4의 콤팩트한 간격과 폰트 비율 100% 재현
 * 3. 03번 섹션: 스크린샷 UI 완벽 구현 (Hub/Spirit 탭, 카테고리 칩, 플래그)
 * 4. 전체 기능: KR/EN 토글, 8단계 가이드, BEOM 구매 박스, 마켓, 파트너십
 * -----------------------------------------------------------
 */

// --- Types ---
type Lang = 'KR' | 'EN';
interface Step { t: string; d: string; link?: string; }
interface GoodsItem { id: number; name: string; price: number | string; img: string; desc: string; }
interface Dictionary {
  rookie: string; pioneer: string; exchange: string; auth: string; creative: string;
  market: string; partnership: string; invitation: string; procedure: string;
  assets: string; activate: string; convert: string; post: string; buy: string;
  register: string; submit: string; download: string; buyBeom: string;
  exchangeDesc: string; authDesc: string; creativeDesc: string; fanRoomDesc: string;
  marketDesc: string; partnershipDesc: string; piJoinDesc: string; steps: Step[];
}

const PI_INVITE_CODE = 'ohsangjo';
const CATS = ['MUSIC', 'TECH', 'ART', 'FOOD', 'TRAVEL', 'GAME', 'NEWS', 'MOVIE'];
const FANS = ['케데헌', '헌트릭스', 'BTS'];

const DICT: Record<Lang, Dictionary> = {
  KR: {
    rookie: "ROOKIE", pioneer: "PIONEER", exchange: "EXCHANGE", auth: "SECURE AUTH",
    creative: "CREATIVE & FAN", market: "MARKET", partnership: "PARTNERSHIP",
    invitation: "Web3 제국 초대장", procedure: "파이코인 가입 가이드", assets: "보유 자산",
    activate: "QR 활성화", convert: "1 PI 환전", post: "피드 등록 (10 BEOM)",
    buy: "구매", register: "등록", submit: "제안 제출", download: "공식 앱 다운로드",
    buyBeom: "BEOM 구매", piJoinDesc: "인류 최대의 생태계에 합류하십시오.",
    exchangeDesc: "채굴 기여도를 BEOM으로 즉시 전환하십시오.",
    authDesc: "제국 시민 보안 QR 코드를 발급받으십시오.",
    creativeDesc: "창작물과 팬심을 공유하고 호응을 이끌어내십시오.",
    fanRoomDesc: "※ 🚩 팬룸 개설(500 BEOM): 90% 수익 환원 및 거버넌스 권한.",
    marketDesc: "검증된 제국 물품을 안전하게 거래하십시오.",
    partnershipDesc: "글로벌 파트너를 찾습니다.",
    steps: [
      { t: "애플리케이션 설치", d: "Pi Network 공식 앱을 설치하십시오.", link: "https://minepi.com/#download" },
      { t: "가입 방식 선택", d: "Continue with phone number 방식을 선택하십시오." },
      { t: "국가 및 번호 설정", d: "+82(South Korea)를 선택하십시오." },
      { t: "보안 비밀번호 생성", d: "영문 대/소문자와 숫자를 조합하십시오." },
      { t: "실명 프로필 작성", d: "여권 영문 실명과 고유 ID를 설정하십시오." },
      { t: "초대 코드 입력", d: "초대 코드 [ ohsangjo ] 를 입력하십시오." },
      { t: "비밀구절 수기 보관", d: "24개 단어는 반드시 종이에 수기 기록하십시오." },
      { t: "채굴 버튼 활성화", d: "매일 번개 버튼을 눌러 활동을 시작하십시오." }
    ]
  },
  EN: {
    rookie: "ROOKIE", pioneer: "PIONEER", exchange: "EXCHANGE", auth: "AUTH",
    creative: "CREATIVE & FAN", market: "MARKET", partnership: "PARTNER",
    invitation: "Empire Invitation", procedure: "Join Guide", assets: "ASSETS",
    activate: "ACTIVATE", convert: "1 PI CONVERT", post: "POST (10 BEOM)",
    buy: "BUY", register: "REGISTER", submit: "SUBMIT", download: "Download",
    buyBeom: "BUY BEOM", piJoinDesc: "Join the largest Web3 network.",
    exchangeDesc: "Convert your mining contribution instantly.",
    authDesc: "Get your secure QR code.",
    creativeDesc: "Share creations and fan spirit.",
    fanRoomDesc: "※ 🚩 Fan Room (500 BEOM): 90% Return.",
    marketDesc: "Trade verified products.",
    partnershipDesc: "Global partners needed.",
    steps: [
      { t: "Install", d: "Install [Pi Network] App.", link: "https://minepi.com/#download" },
      { t: "Login", d: "Continue with phone number." },
      { t: "Country", d: "Select +82 (South Korea)." },
      { t: "Password", d: "Upper/Lower/Numbers." },
      { t: "Profile", d: "Use passport name and unique ID." },
      { t: "Invite Code", d: "Enter [ ohsangjo ] to join." },
      { t: "Passphrase", d: "Handwrite 24 words on paper." },
      { t: "Mining", d: "Tap lightning bolt every 24h." }
    ]
  }
};

const SectionHeader = ({ num, title, desc }: { num: string | number; title: string; desc: string; }) => (
  <div className="w-full border-t-2 border-[#dc2626] pt-3 mb-4 text-left">
    <h2 className="text-black text-xl md:text-2xl font-black uppercase italic border-l-[10px] border-black pl-3 tracking-tighter leading-none">
      {num}. {title}
    </h2>
    <p className="text-gray-400 text-[10px] md:text-xs font-bold pl-8 italic leading-none mt-1">{desc}</p>
  </div>
);

export default function KedheonSupremeTotal() {
  const [hasMounted, setHasMounted] = useState(false);
  const [lang, setLang] = useState<Lang>('KR');
  const [tab, setTab] = useState<'ROOKIE' | 'PIONEER'>('PIONEER');
  const [beomToken, setBeomToken] = useState(7891.88);
  const [piBalance, setPiBalance] = useState(124.55);
  const [hubTab, setHubTab] = useState<'HUB' | 'SPIRIT'>('HUB');
  const [category, setCategory] = useState('TECH');
  const [feed, setFeed] = useState({ title: '', link: '', desc: '' });
  const [qrState, setQrState] = useState({ type: 'PERSONAL', active: false });
  const [partner, setPartner] = useState({ corp: '', contact: '', msg: '' });

  const [goods] = useState<GoodsItem[]>([
    { id: 1, name: "GOLD BADGE", price: 1000, img: "/beom-token.png", desc: "" },
    { id: 2, name: "V23 NODE KEY", price: 5000, img: "/node-icon.png", desc: "" }
  ]);

  const L = DICT[lang];

  useEffect(() => { setHasMounted(true); }, []);

  const handleDownload = useCallback((url?: string) => { if (typeof window !== 'undefined' && url) window.open(url, '_blank'); }, []);
  const handleCopy = useCallback(() => { if (typeof window !== 'undefined') { navigator.clipboard.writeText(PI_INVITE_CODE); alert("Imperial Code Copied!"); } }, []);

  if (!hasMounted) return <div className="bg-white min-h-screen" />;

  return (
    <div className="flex flex-col items-center bg-white min-h-screen text-black font-sans w-full pb-32 font-black selection:bg-red-50">
      
      {/* NAVIGATION - V170.0 */}
      <nav className="w-full max-w-6xl flex justify-between items-center px-4 py-3 sticky top-0 bg-white/95 backdrop-blur-md z-[500] border-b border-black/5 shadow-sm">
        <div className="flex items-center gap-3">
          <img src="/kedheon-character.png" className="w-10 h-10 rounded-lg border-2 border-black" alt="K" />
          <div className="text-left leading-tight font-black">
            <h1 className="text-black text-lg md:text-xl italic uppercase">Kedheon</h1>
            <span className="text-gray-400 text-[8px] font-mono tracking-widest">MASTER V170.0</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-gray-100 p-1 rounded-lg flex gap-1">
            <button onClick={() => setLang('KR')} className={`px-2 py-1 rounded-md text-[10px] font-black ${lang === 'KR' ? 'bg-black text-white' : 'text-gray-400'}`}>KR</button>
            <button onClick={() => setLang('EN')} className={`px-2 py-1 rounded-md text-[10px] font-black ${lang === 'EN' ? 'bg-black text-white' : 'text-gray-400'}`}>EN</button>
          </div>
          <button onClick={() => setTab('ROOKIE')} className={`px-4 py-1.5 rounded-lg text-xs md:text-sm font-black border transition-all ${tab === 'ROOKIE' ? 'bg-[#dc2626] text-white border-[#dc2626]' : 'text-gray-300 border-transparent'}`}>{L.rookie}</button>
          <button onClick={() => setTab('PIONEER')} className={`px-4 py-1.5 rounded-lg text-xs md:text-sm font-black border transition-all ${tab === 'PIONEER' ? 'bg-black text-white border-black' : 'text-gray-300 border-transparent'}`}>{L.pioneer}</button>
        </div>
      </nav>

      <main className="w-full max-w-6xl px-4 py-6">
        {tab === 'ROOKIE' ? (
          <div className="flex flex-col gap-6 animate-in fade-in duration-500">
            {/* HERO BOX */}
            <div className="flex flex-col items-center text-center gap-6 py-10 bg-gray-50 rounded-3xl border border-black/5 relative shadow-inner overflow-hidden font-black">
              <div className="absolute top-0 left-0 w-full h-2 bg-[#dc2626]"></div>
              <img src="/kedheon-character.png" className="w-48 h-48 md:w-80 md:h-80 object-contain drop-shadow-2xl" alt="K" />
              <div className="px-6 space-y-2">
                <h1 className="text-black text-3xl md:text-5xl uppercase tracking-tighter leading-none">{L.invitation}</h1>
                <p className="text-[#dc2626] text-lg md:text-2xl uppercase tracking-widest border-b-4 border-[#dc2626] pb-1 inline-block italic">{L.procedure}</p>
                <p className="text-gray-400 text-xs md:text-base font-bold mt-2 uppercase tracking-tighter">{L.piJoinDesc}</p>
              </div>
            </div>

            {/* 8 STEPS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {L.steps.map((step, i) => (
                <div key={i} className={`p-5 bg-white rounded-2xl border flex items-center gap-5 transition-all ${i === 0 || i === 5 ? 'border-[#dc2626] bg-red-50/5' : 'border-black/5 opacity-90'}`}>
                  <span className={`text-4xl md:text-6xl font-black italic ${i === 0 || i === 5 ? 'text-[#dc2626]' : 'text-black opacity-5'}`}>0{i+1}</span>
                  <div className="flex-1 min-w-0 text-left leading-none">
                    <h3 className="text-black text-xs md:text-base font-black uppercase italic leading-none">{step.t}</h3>
                    <p className="text-gray-600 text-[10px] md:text-sm font-bold leading-tight mt-1.5">{step.d}</p>
                    {step.link && <button onClick={() => handleDownload(step.link)} className="mt-2 bg-black text-white px-3 py-1 rounded text-[9px] font-black uppercase tracking-tighter">APP DOWNLOAD</button>}
                  </div>
                </div>
              ))}
            </div>

            {/* INVITATION CODE */}
            <div className="p-12 bg-black text-white rounded-3xl text-center shadow-xl border-4 border-[#dc2626] font-black">
              <p className="text-[10px] md:text-sm italic text-gray-500 uppercase tracking-widest mb-2 font-black">Imperial Code</p>
              <div className="text-[#dc2626] text-5xl md:text-[8rem] tracking-widest cursor-pointer hover:scale-105 transition-transform font-black" onClick={handleCopy}>
                {PI_INVITE_CODE}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-10 py-2 animate-in slide-in-from-bottom-5 duration-700 font-black text-left">
            
            {/* ASSETS & BUY BOX (RATIO RECOVERED) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-3xl border-2 border-black shadow-lg flex flex-col justify-center relative overflow-hidden">
                <h3 className="text-gray-400 text-[10px] md:text-xs uppercase tracking-widest font-black mb-4 tracking-tighter">보유 자산 ASSETS</h3>
                <p className="text-black text-4xl md:text-6xl tracking-tighter leading-none font-black">
                  {Math.floor(beomToken).toLocaleString()}
                  <span className="text-xl opacity-10">.{beomToken.toFixed(2).split('.')[1]}</span> 
                  <span className="ml-2 text-xl md:text-3xl italic uppercase text-[#dc2626]">BEOM</span>
                </p>
                <p className="text-gray-400 text-sm md:text-lg font-black italic mt-1">≈ {piBalance.toLocaleString()} PI</p>
                <div className="flex items-center gap-3 mt-4">
                  <div className="bg-black text-white px-3 py-1 rounded text-[9px] md:text-[10px] font-mono">NODE: 18.02 SCORE</div>
                  <div className="bg-[#dc2626] text-white px-3 py-1 rounded text-[9px] md:text-[10px] font-mono italic">Redistribution: 15,080</div>
                </div>
              </div>
              <div className="bg-[#dc2626] p-6 rounded-3xl border-2 border-black shadow-lg flex flex-col justify-center items-center text-center gap-3">
                <h4 className="text-white text-lg md:text-xl font-black uppercase italic leading-none">{L.buyBeom}</h4>
                <div className="bg-white/10 p-3 rounded-xl w-full border border-white/10">
                  <p className="text-white text-xs md:text-sm font-black uppercase tracking-tighter">1 PI = 1,000 BEOM</p>
                </div>
                <button onClick={() => {if(piBalance < 1) return alert("Low Pi"); setPiBalance(p=>p-1); setBeomToken(p=>p+1000); alert("Purchased!");}} className="w-full bg-white text-black py-3 rounded-xl text-sm font-black shadow hover:scale-105 transition-all">
                  BEOM 구매
                </button>
              </div>
            </div>

            {/* 01. EXCHANGE */}
            <SectionHeader num="01" title={L.exchange} desc={L.exchangeDesc} />
            <div className="bg-white p-6 rounded-3xl border-2 border-black flex justify-between items-center shadow-md">
              <div className="font-black leading-tight">
                <p className="text-black text-2xl italic uppercase leading-none">TERMINAL</p>
                <p className="text-gray-400 text-[10px] uppercase mt-1 tracking-widest">RATE: 1 PI = 100 BEOM</p>
              </div>
              <button onClick={() => {setBeomToken(p=>p+100); alert("CONVERTED");}} className="bg-black text-white px-8 py-4 rounded-xl text-sm md:text-lg font-black hover:bg-[#dc2626] transition-all">
                1 PI 환전
              </button>
            </div>

            {/* 03. CREATIVE & FAN (스크린샷 UI 정밀 구현) */}
            <SectionHeader num="03" title={L.creative} desc={L.creativeDesc} />
            <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-black/10 space-y-6 shadow-sm font-black">
              <div className="flex gap-8 border-b border-gray-100 pb-2 font-black">
                <button onClick={() => setHubTab('HUB')} className={`text-lg md:text-2xl font-black italic uppercase transition-all ${hubTab === 'HUB' ? 'text-black border-b-4 border-black pb-1' : 'text-gray-300'}`}>CREATIVE HUB</button>
                <button onClick={() => setHubTab('SPIRIT')} className={`text-lg md:text-2xl font-black italic uppercase transition-all ${hubTab === 'SPIRIT' ? 'text-black border-b-4 border-black pb-1' : 'text-gray-300'}`}>FAN SPIRIT</button>
              </div>

              {/* Category Chips */}
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {CATS.map(cat => (
                  <button key={cat} onClick={() => setCategory(cat)} className={`px-4 py-1.5 rounded-full text-[10px] md:text-xs font-black italic uppercase border transition-all ${category === cat ? 'bg-black text-white border-black' : 'bg-white text-gray-400 border-gray-100 hover:border-black'}`}>
                    {cat}
                  </button>
                ))}
              </div>

              {/* Fan Flags */}
              <div className="flex gap-2 flex-wrap font-black">
                {FANS.map(fan => (
                  <button key={fan} className="px-4 py-2 bg-white border border-gray-100 rounded-full text-[10px] md:text-xs font-black text-red-600 flex items-center gap-1.5 shadow-sm">
                    🚩 {fan}
                  </button>
                ))}
              </div>

              {/* Inputs */}
              <div className="space-y-3 font-black">
                <input value={feed.title} onChange={(e) => setFeed({ ...feed, title: e.target.value })} placeholder="제목 또는 팬심 공유" className="w-full bg-gray-50 border border-black/5 p-4 rounded-xl text-sm md:text-lg font-black outline-none focus:border-black placeholder-gray-400" />
                <input value={feed.link} onChange={(e) => setFeed({ ...feed, link: e.target.value })} placeholder="이미지/영상 링크" className="w-full bg-gray-50 border border-black/5 p-4 rounded-xl text-sm md:text-lg font-black outline-none focus:border-black placeholder-red-200 text-red-400" />
                <textarea value={feed.desc} onChange={(e) => setFeed({ ...feed, desc: e.target.value })} placeholder="상세 내용을 기록하십시오" className="w-full bg-gray-50 border border-black/5 p-4 rounded-xl text-xs md:text-sm font-bold h-32 outline-none focus:border-black leading-relaxed" />
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button onClick={() => {if(!feed.title) return alert("내용을 입력하세요"); setBeomToken(p=>p-10); alert("피드 등록 완료"); setFeed({title:'', link:'', desc:''});}} className="md:col-span-2 bg-black text-white py-5 rounded-2xl text-lg md:text-2xl font-black hover:bg-[#dc2626] transition-all shadow-lg active:scale-95">
                  {L.post}
                </button>
                <button className="bg-white border-2 border-black text-black py-5 rounded-2xl text-lg md:text-xl font-black flex items-center justify-center gap-2 shadow transition-all active:scale-95">
                  🚩 FAN ROOM
                </button>
              </div>

              {/* Note */}
              <div className="bg-gray-50 p-4 rounded-xl border-l-[6px] border-[#dc2626] text-left">
                <p className="text-gray-400 text-[10px] md:text-xs font-bold italic">
                  {L.fanRoomDesc}
                </p>
              </div>
            </div>

            {/* 04. MARKET */}
            <SectionHeader num="04" title={L.market} desc={L.marketDesc} />
            <div className="grid grid-cols-2 gap-4">
              {goods.map(g => (
                <div key={g.id} className="bg-white p-4 rounded-3xl border-2 border-black/5 shadow-md flex flex-col items-center group transition-all hover:border-[#dc2626]">
                  <div className="w-full aspect-square bg-gray-50 rounded-2xl mb-4 flex items-center justify-center relative overflow-hidden shadow-inner">
                    <img src={g.img} className="w-24 h-24 md:w-32 md:h-32 object-contain group-hover:scale-110 transition-transform duration-500" alt="Item" />
                  </div>
                  <h4 className="text-black text-xs md:text-lg font-black uppercase mb-1 truncate w-full">{g.name}</h4>
                  <p className="text-[#dc2626] text-sm md:text-2xl font-black mb-4 leading-none">{Number(g.price).toLocaleString()} BEOM</p>
                  <button onClick={()=>alert("Connecting Terminal...")} className="w-full py-2.5 bg-black text-white rounded-full text-xs font-black shadow-lg">BUY NOW</button>
                </div>
              ))}
            </div>

            {/* 05. PARTNERSHIP */}
            <SectionHeader num="05" title={L.partnership} desc={L.partnershipDesc} />
            <div className="bg-black p-8 rounded-[2.5rem] border-[12px] border-[#dc2626] space-y-6 relative overflow-hidden font-black">
                <h3 className="text-white text-2xl md:text-4xl font-black italic border-l-8 border-[#dc2626] pl-4 uppercase leading-none z-10 relative">Empire Portal</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 z-10 relative">
                    <input value={partner.corp} onChange={(e)=>setPartner({...partner, corp: e.target.value.toUpperCase()})} placeholder="CORPORATION" className="bg-white/10 border border-white/10 p-4 rounded-xl text-xs md:text-lg text-white outline-none focus:border-[#dc2626] transition-all" />
                    <input value={partner.contact} onChange={(e)=>setPartner({...partner, contact: e.target.value})} placeholder="CONTACT INFO" className="bg-white/10 border border-white/10 p-4 rounded-xl text-xs md:text-lg text-white outline-none focus:border-[#dc2626] transition-all" />
                </div>
                <button onClick={()=>alert("제안이 제출되었습니다")} className="w-full bg-[#dc2626] text-white py-4 rounded-full text-sm md:text-2xl font-black hover:bg-white hover:text-[#dc2626] transition-all shadow-xl uppercase z-10 relative">
                  {L.submit}
                </button>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="fixed bottom-4 left-4 right-4 max-w-4xl mx-auto bg-white border-2 border-black p-1.5 rounded-2xl flex justify-between gap-1.5 z-[1000] shadow-2xl">
        {['KEDHEON', 'CIVIL', 'NEXUS', 'VENDOR'].map(app => (
          <button key={app} className={`flex-1 py-4 md:py-5 rounded-xl text-[10px] md:text-base transition-all font-black text-center leading-none ${app === 'KEDHEON' ? 'bg-black text-white shadow-md' : 'text-gray-300'}`}>
            {app}
          </button>
        ))}
      </footer>

      {/* WATERMARK */}
      <div className="mt-20 opacity-[0.03] text-black text-4xl md:text-8xl tracking-[0.5em] uppercase pb-24 font-black text-center select-none pointer-events-none leading-none"> 
        KEDHEON MASTER 
      </div>
    </div>
  );
}
