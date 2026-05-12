'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';

/** * [KEDHEON MASTER V160.0 - THE TOTAL SUPREME EDITION]
 * -----------------------------------------------------------
 * 1. 완벽 복구: 한/영 언어 토글, 8단계 가입 가이드, 카테고리, 마켓
 * 2. 완벽 복구: BEOM 구매 박스 (1 PI = 1,000 BEOM) 및 자산 대시보드
 * 3. 최적화: 가독성을 고려한 폰트 스케일링 (이미지 스크린샷 에러 해결)
 * 4. 규격: Next.js 16 Turbopack + TypeScript 엄격 준수
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

const DICT: Record<Lang, Dictionary> = {
  KR: {
    rookie: "루키 가이드", pioneer: "파이오니어", exchange: "자산 전환", auth: "보안 인증",
    creative: "크리에이티브", market: "제국 마켓", partnership: "파트너십",
    invitation: "Web3 제국 초대장", procedure: "파이코인 가입 가이드", assets: "보유 자산",
    activate: "QR 활성화", convert: "1 PI 전환", post: "업로드",
    buy: "구매하기", register: "상품 등록", submit: "제안 제출", download: "공식 앱 다운로드",
    buyBeom: "BEOM 구매", piJoinDesc: "인류 최대의 생태계에 합류하십시오.",
    exchangeDesc: "채굴 기여도를 BEOM으로 전환하여 가치를 보존하십시오.",
    authDesc: "제국 시민 보안 QR 코드를 발급받으십시오.",
    creativeDesc: "창작물을 공유하고 수익을 창출하십시오.",
    fanRoomDesc: "팬룸 입장(500 BEOM): 수익 90% 반환.",
    marketDesc: "검증된 제국 물품을 안전하게 거래하십시오.",
    partnershipDesc: "글로벌 파트너를 찾습니다.",
    steps: [
      { t: "애플리케이션 설치", d: "[Pi Network] 공식 앱을 설치하십시오.", link: "https://minepi.com/#download" },
      { t: "가입 방식 선택", d: "Continue with phone number 방식을 선택하십시오." },
      { t: "국가 및 번호 설정", d: "+82(South Korea) 선택 후 번호를 입력하십시오." },
      { t: "보안 비밀번호 생성", d: "영문 대/소문자와 숫자를 조합하십시오." },
      { t: "실명 프로필 작성", d: "여권 영문 실명과 고유 ID를 설정하십시오." },
      { t: "초대 코드 입력", d: "초대 코드 ohsangjo를 입력하십시오." },
      { t: "비밀구절 수기 보관", d: "24개 단어는 반드시 종이에 수기 기록하십시오." },
      { t: "채굴 버튼 활성화", d: "매일 번개 버튼을 눌러 활동을 시작하십시오." }
    ]
  },
  EN: {
    rookie: "ROOKIE", pioneer: "PIONEER", exchange: "EXCHANGE", auth: "AUTH",
    creative: "CREATIVE", market: "MARKET", partnership: "PARTNERSHIP",
    invitation: "Empire Invitation", procedure: "Pi Join Guide", assets: "ASSETS",
    activate: "ACTIVATE", convert: "1 PI CONVERT", post: "POST",
    buy: "BUY", register: "REGISTER", submit: "SUBMIT", download: "Download",
    buyBeom: "BUY BEOM", piJoinDesc: "Join the largest Web3 network.",
    exchangeDesc: "Convert your mining contribution.",
    authDesc: "Get your secure QR code.",
    creativeDesc: "Share your creations.",
    fanRoomDesc: "Fan Room (500 BEOM): 90% Return.",
    marketDesc: "Trade verified products.",
    partnershipDesc: "Global partners needed.",
    steps: [
      { t: "Install App", d: "Install [Pi Network] App.", link: "https://minepi.com/#download" },
      { t: "Choose Login", d: "Continue with phone number." },
      { t: "Country", d: "Select +82 (South Korea)." },
      { t: "Password", d: "Upper/lowercase + numbers." },
      { t: "Profile", d: "Use passport name and unique ID." },
      { t: "Invite Code", d: "Enter [ ohsangjo ] to join." },
      { t: "Passphrase", d: "Handwrite 24 words on paper." },
      { t: "Mining", d: "Tap lightning bolt every 24h." }
    ]
  }
};

const SectionHeader = ({ num, title, desc }: { num: string | number; title: string; desc: string; }) => (
  <div className="w-full border-t-4 border-[#dc2626] pt-6 mb-8 text-left">
    <h2 className="text-black text-2xl md:text-5xl font-black uppercase italic mb-1 border-l-[20px] border-black pl-5 tracking-tighter leading-none">
      {num}. {title}
    </h2>
    <p className="text-gray-400 text-sm md:text-2xl font-bold pl-12 italic leading-none">{desc}</p>
  </div>
);

export default function KedheonEmpireTotal() {
  const [hasMounted, setHasMounted] = useState(false);
  const [lang, setLang] = useState<Lang>('KR');
  const [tab, setTab] = useState<'ROOKIE' | 'PIONEER'>('PIONEER');
  
  const [beomToken, setBeomToken] = useState(7891.88);
  const [piBalance, setPiBalance] = useState(124.55);
  const [category, setCategory] = useState('TECH');
  const [feed, setFeed] = useState({ title: '', desc: '' });
  const [qrState, setQrState] = useState({ type: 'PERSONAL', biz: '', active: false });
  const [partner, setPartner] = useState({ corp: '', contact: '', msg: '' });

  const [goods] = useState<GoodsItem[]>([
    { id: 1, name: "GOLD BADGE", price: 1000, img: "/beom-token.png", desc: "Empire Honor" },
    { id: 2, name: "V23 NODE KEY", price: 5000, img: "/node-icon.png", desc: "Node Key" }
  ]);

  const L = DICT[lang];

  useEffect(() => { setHasMounted(true); }, []);

  const handleDownload = useCallback((url?: string) => { if (typeof window !== 'undefined' && url) window.open(url, '_blank'); }, []);
  const handleCopy = useCallback(() => { if (typeof window !== 'undefined') { navigator.clipboard.writeText(PI_INVITE_CODE); alert("Imperial Code Copied!"); } }, []);

  if (!hasMounted) return <div className="bg-white min-h-screen" />;

  return (
    <div className="flex flex-col items-center bg-white min-h-screen text-black font-sans w-full pb-96 font-black overflow-x-hidden selection:bg-red-50">
      
      {/* NAVIGATION */}
      <nav className="w-full max-w-7xl flex justify-between items-center px-4 py-4 sticky top-0 bg-white/95 backdrop-blur-md z-[500] border-b-4 border-black/5 shadow-md">
        <div className="flex items-center gap-4">
          <img src="/kedheon-character.png" className="w-12 h-12 md:w-20 md:h-20 rounded-2xl border-4 border-black shadow-xl" alt="Kedheon" />
          <div className="text-left leading-tight font-black">
            <h1 className="text-black text-xl md:text-3xl italic uppercase">Kedheon</h1>
            <span className="text-gray-400 text-[10px] md:text-sm font-mono tracking-widest">V160.0 SUPREME</span>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <button onClick={() => setLang(lang === 'KR' ? 'EN' : 'KR')} className="px-3 py-2 md:px-5 md:py-3 rounded-xl bg-black text-white text-xs md:text-xl font-black hover:bg-[#dc2626] transition-all">
            {lang === 'KR' ? 'EN' : 'KR'}
          </button>
          <button onClick={() => setTab('ROOKIE')} className={`px-4 py-2 md:px-6 md:py-3 rounded-xl text-xs md:text-xl font-black border-2 transition-all ${tab === 'ROOKIE' ? 'bg-[#dc2626] text-white border-[#dc2626]' : 'text-gray-400 border-transparent'}`}>{L.rookie}</button>
          <button onClick={() => setTab('PIONEER')} className={`px-4 py-2 md:px-6 md:py-3 rounded-xl text-xs md:text-xl font-black border-2 transition-all ${tab === 'PIONEER' ? 'bg-black text-white border-black' : 'text-gray-400 border-transparent'}`}>{L.pioneer}</button>
        </div>
      </nav>

      <main className="w-full max-w-7xl px-4 py-10">
        {tab === 'ROOKIE' ? (
          <div className="flex flex-col gap-12 animate-in fade-in duration-700">
            {/* HERO SECTION - RECOVERED */}
            <div className="flex flex-col items-center text-center gap-8 py-20 bg-gray-50 rounded-[3rem] border-4 border-black/5 relative shadow-inner overflow-hidden font-black">
              <div className="absolute top-0 left-0 w-full h-4 bg-[#dc2626]"></div>
              <img src="/kedheon-character.png" className="w-48 h-48 md:w-[30rem] md:h-[30rem] object-contain drop-shadow-2xl" alt="Character" />
              <div className="px-6 space-y-4">
                <h1 className="text-black text-4xl md:text-7xl uppercase tracking-tighter leading-none">{L.invitation}</h1>
                <p className="text-[#dc2626] text-2xl md:text-4xl uppercase tracking-widest border-b-8 border-[#dc2626] pb-3 inline-block italic">{L.procedure}</p>
                <p className="text-gray-400 text-lg md:text-2xl font-bold">{L.piJoinDesc}</p>
              </div>
            </div>

            {/* JOIN STEPS */}
            <div className="grid grid-cols-1 gap-6">
              {L.steps.map((step, i) => (
                <div key={i} className={`p-8 bg-white rounded-3xl border-4 flex flex-col gap-6 transition-all ${i === 0 || i === 5 ? 'border-[#dc2626] bg-red-50/10' : 'border-black/5'}`}>
                  <div className="flex items-center gap-8">
                    <span className={`text-6xl md:text-9xl font-black italic ${i === 0 || i === 5 ? 'text-[#dc2626]' : 'text-black opacity-10'}`}>0{i+1}</span>
                    <div className="flex-1">
                      <h3 className="text-black text-xl md:text-4xl font-black uppercase italic mb-2">{step.t}</h3>
                      <p className="text-gray-600 text-sm md:text-2xl font-bold leading-tight">{step.d}</p>
                    </div>
                  </div>
                  {step.link && (
                    <div className="w-full p-6 bg-black rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
                      <p className="text-white text-lg md:text-3xl italic uppercase font-black">Official Sync Link</p>
                      <button onClick={() => handleDownload(step.link)} className="w-full md:w-auto bg-[#dc2626] text-white px-10 py-5 rounded-full text-xl md:text-3xl font-black shadow-xl hover:bg-white hover:text-black transition-all">
                        &darr; {L.download}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* INVITATION CODE */}
            <div className="p-16 md:p-32 bg-black text-white rounded-[3rem] text-center shadow-2xl border-[12px] border-[#dc2626] font-black">
              <p className="text-xl md:text-4xl italic text-gray-500 uppercase tracking-widest mb-6">Imperial Code</p>
              <div className="text-[#dc2626] text-5xl md:text-[10rem] tracking-widest cursor-pointer hover:scale-105 transition-transform leading-none font-black" onClick={handleCopy}>
                {PI_INVITE_CODE}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-20 py-6 animate-in slide-in-from-bottom-5 duration-700">
            
            {/* ASSET DASHBOARD & BUY BOX - RECOVERED */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-gray-50 p-10 md:p-16 rounded-[3rem] border-8 border-black shadow-xl flex flex-col justify-center relative overflow-hidden">
                <h3 className="text-gray-400 text-sm md:text-2xl uppercase tracking-widest font-black mb-8">{L.assets}</h3>
                <div className="space-y-4">
                  <p className="text-black text-5xl md:text-[6rem] tracking-tighter leading-none font-black">
                    {Math.floor(beomToken).toLocaleString()}
                    <span className="text-2xl opacity-10">.{beomToken.toFixed(2).split('.')[1]}</span> 
                    <span className="ml-4 text-3xl md:text-5xl italic uppercase text-[#dc2626]">BEOM</span>
                  </p>
                  <p className="text-gray-400 text-xl md:text-3xl font-black italic">
                    ≈ {piBalance.toLocaleString()} <span className="text-[#dc2626]">PI</span>
                  </p>
                </div>
                <div className="flex flex-wrap gap-4 mt-10">
                  <div className="bg-black text-white px-6 py-4 rounded-xl text-xs md:text-xl font-mono shadow-md">NODE: 18.02 SCORE</div>
                  <div className="bg-[#dc2626] text-white px-6 py-4 rounded-xl text-xs md:text-xl font-mono shadow-md">RETURN: 3,500 BEOM</div>
                </div>
              </div>
              <div className="bg-[#dc2626] p-10 rounded-[3rem] border-8 border-black shadow-xl flex flex-col justify-center items-center text-center gap-6 group">
                <h4 className="text-white text-3xl md:text-4xl font-black uppercase italic tracking-tighter">{L.buyBeom}</h4>
                <div className="bg-white/10 p-6 rounded-2xl w-full">
                  <p className="text-white text-lg md:text-2xl font-black tracking-tight">1 PI = 1,000 BEOM</p>
                </div>
                <button onClick={() => {if(piBalance < 1) return alert("Low Pi"); setPiBalance(p=>p-1); setBeomToken(p=>p+1000); alert("Purchased!");}} className="w-full bg-white text-black py-6 rounded-full text-2xl md:text-3xl font-black shadow-2xl hover:scale-105 transition-all">
                  {L.buyBeom}
                </button>
              </div>
            </div>

            {/* SECTION 01: EXCHANGE */}
            <SectionHeader num="01" title={L.exchange} desc={L.exchangeDesc} />
            <div className="bg-white p-12 rounded-[2.5rem] border-8 border-black flex flex-col md:flex-row justify-between items-center shadow-xl gap-10 group hover:bg-gray-50 transition-all">
              <div className="text-left font-black">
                <p className="text-black text-5xl md:text-[6rem] italic uppercase leading-none tracking-tighter group-hover:text-[#dc2626]">Terminal</p>
                <div className="flex items-center gap-4 mt-4">
                  <span className="w-5 h-5 bg-green-500 rounded-full animate-ping"></span>
                  <p className="text-gray-400 text-lg md:text-2xl uppercase tracking-widest">Protocol V23 Ready</p>
                </div>
              </div>
              <button onClick={() => {setBeomToken(p=>p+100); alert("CONVERTED");}} className="w-full md:w-auto bg-black text-white px-12 py-8 rounded-full text-2xl md:text-5xl font-black shadow-2xl hover:bg-[#dc2626] transition-all">
                {L.convert}
              </button>
            </div>

            {/* SECTION 02: AUTH */}
            <SectionHeader num="02" title={L.auth} desc={L.authDesc} />
            <div className="bg-gray-50 p-10 md:p-20 rounded-[3rem] border-4 border-black/5 flex flex-col items-center gap-10 shadow-inner font-black">
              <div className="flex gap-4 w-full max-w-3xl bg-white p-3 rounded-2xl border-4 border-black">
                <button onClick={() => setQrState({ ...qrState, type: 'PERSONAL', active: false })} className={`flex-1 py-6 rounded-xl text-lg md:text-2xl font-black transition-all ${qrState.type === 'PERSONAL' ? 'bg-black text-white' : 'text-gray-300'}`}>PERSONAL</button>
                <button onClick={() => setQrState({ ...qrState, type: 'BUSINESS', active: false })} className={`flex-1 py-6 rounded-xl text-lg md:text-2xl font-black transition-all ${qrState.type === 'BUSINESS' ? 'bg-black text-white' : 'text-gray-300'}`}>BUSINESS</button>
              </div>
              <div className={`relative bg-white border-8 rounded-3xl flex items-center justify-center shadow-2xl w-64 h-64 md:w-96 md:h-96 ${qrState.active ? 'border-[#dc2626]' : 'opacity-10 grayscale blur-sm'}`}>
                <p className="text-black text-2xl md:text-4xl font-black uppercase italic animate-pulse">Encoded</p>
              </div>
              <button onClick={() => {if(beomToken < 50) return alert("Low Asset"); setBeomToken(p=>p-50); setQrState({...qrState, active:true});}} className="w-full max-w-3xl bg-black text-white py-8 rounded-full text-2xl md:text-4xl font-black shadow-lg">
                {L.activate} (50 BEOM)
              </button>
            </div>

            {/* SECTION 03: CREATIVE (CATEGORY RECOVERED) */}
            <SectionHeader num="03" title={L.creative} desc={L.creativeDesc} />
            <div className="bg-white p-10 md:p-20 rounded-[3rem] border-4 border-black/10 space-y-12 shadow-xl">
              <div className="flex gap-8 overflow-x-auto pb-4 no-scrollbar border-b-4 border-gray-100">
                {CATS.map(cat => (
                  <button key={cat} onClick={() => setCategory(cat)} className={`text-2xl md:text-4xl font-black italic uppercase whitespace-nowrap transition-all ${category === cat ? 'text-[#dc2626] border-b-8 border-[#dc2626] pb-2' : 'text-gray-300 hover:text-black'}`}>
                    {cat}
                  </button>
                ))}
              </div>
              <div className="space-y-6">
                <input value={feed.title} onChange={(e) => setFeed({ ...feed, title: e.target.value })} placeholder="PROJECT TITLE" className="w-full bg-gray-50 border-4 border-black/5 p-8 rounded-2xl text-2xl md:text-4xl font-black outline-none focus:border-black transition-all" />
                <textarea value={feed.desc} onChange={(e) => setFeed({ ...feed, desc: e.target.value })} placeholder="EMPIRE VISION..." className="w-full bg-gray-50 border-4 border-black/5 p-8 rounded-2xl text-xl md:text-3xl font-bold h-64 outline-none focus:border-black leading-tight" />
              </div>
              <button onClick={() => {if(!feed.title) return alert("Empty"); setBeomToken(p=>p-10); alert("POSTED"); setFeed({title:'', desc:''});}} className="w-full bg-black text-white py-10 rounded-full text-3xl md:text-6xl font-black shadow-2xl hover:bg-[#dc2626] transition-all">
                {L.post} (10 BEOM)
              </button>
              <p className="text-gray-400 text-lg md:text-3xl font-bold bg-gray-50 p-10 rounded-2xl border-l-[25px] border-[#dc2626] italic">Note: {L.fanRoomDesc}</p>
            </div>

            {/* SECTION 04: MARKET */}
            <SectionHeader num="04" title={L.market} desc={L.marketDesc} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {goods.map(g => (
                <div key={g.id} className="bg-white p-8 rounded-[2.5rem] border-4 border-black/5 shadow-xl flex flex-col group transition-all hover:border-[#dc2626] relative overflow-hidden font-black">
                  <div className="w-full aspect-square bg-gray-100 rounded-2xl mb-8 flex items-center justify-center">
                    <img src={g.img} className="w-40 h-40 md:w-64 md:h-64 object-contain group-hover:scale-110 transition-transform duration-500" alt="Item" />
                  </div>
                  <h4 className="text-black text-2xl md:text-4xl uppercase mb-4 truncate">{g.name}</h4>
                  <p className="text-black text-3xl md:text-6xl mb-8 font-black leading-none">{Number(g.price).toLocaleString()} <span className="text-xl md:text-3xl text-[#dc2626]">BEOM</span></p>
                  <button onClick={()=>alert("Terminal Ready")} className="w-full py-6 bg-black text-white rounded-full text-xl md:text-3xl font-black shadow-lg"> {L.buy} </button>
                </div>
              ))}
            </div>

            {/* SECTION 05: PARTNERSHIP */}
            <SectionHeader num="05" title={L.partnership} desc={L.partnershipDesc} />
            <div className="bg-black p-12 md:p-24 rounded-[3.5rem] border-[25px] border-[#dc2626] space-y-12 relative overflow-hidden font-black">
                <div className="absolute -top-40 -right-40 opacity-10 pointer-events-none grayscale">
                  <img src="/kedheon-character.png" className="w-[40rem]" alt="Bg" />
                </div>
                <h3 className="text-white text-4xl md:text-[8rem] font-black italic border-l-[30px] border-[#dc2626] pl-10 z-10 relative uppercase leading-none">Empire Portal</h3>
                <div className="space-y-8 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-black">
                        <input value={partner.corp} onChange={(e)=>setPartner({...partner, corp: e.target.value.toUpperCase()})} placeholder="CORPORATION" className="w-full bg-white/10 border-4 border-white/10 p-8 rounded-2xl text-white text-xl md:text-4xl font-black outline-none focus:border-[#dc2626]" />
                        <input value={partner.contact} onChange={(e)=>setPartner({...partner, contact: e.target.value})} placeholder="CONTACT" className="w-full bg-white/10 border-4 border-white/10 p-8 rounded-2xl text-white text-xl md:text-4xl font-black outline-none focus:border-[#dc2626]" />
                    </div>
                    <textarea value={partner.msg} onChange={(e)=>setPartner({...partner, msg: e.target.value})} placeholder="PARTNERSHIP VISION..." className="w-full bg-white/10 border-4 border-white/10 p-8 rounded-3xl text-white text-lg md:text-3xl font-bold h-64 outline-none focus:border-[#dc2626]" />
                </div>
                <button onClick={()=>{if(!partner.corp || !partner.msg) return alert("Empty"); alert("SUBMITTED"); setPartner({corp:'', contact:'', msg:''});}} className="w-full bg-[#dc2626] text-white py-12 md:py-16 rounded-full text-3xl md:text-6xl border-8 border-[#dc2626] hover:bg-white hover:text-[#dc2626] transition-all font-black shadow-2xl leading-none uppercase">
                  {L.submit}
                </button>
            </div>

            {/* INFRA STATUS */}
            <div className="py-12 px-10 bg-gray-100 rounded-[2.5rem] flex flex-col md:flex-row justify-between items-center gap-8 border-4 border-black shadow-inner font-black">
                <div className="flex items-center gap-6">
                  <div className="w-8 h-8 bg-[#dc2626] rounded-full animate-ping"></div>
                  <span className="text-2xl md:text-5xl font-mono uppercase tracking-tighter">Infra: 88-Threads Node Server</span>
                </div>
                <div className="flex items-center gap-8 uppercase text-lg md:text-3xl text-gray-400">
                  <span>Reliability: 18.02</span>
                  <span>Master: Lord @Ohsangjo</span>
                </div>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER NAV - FIXED & OPTIMIZED */}
      <footer className="fixed bottom-10 left-4 right-4 max-w-5xl mx-auto bg-white border-8 border-black p-3 rounded-[2.5rem] flex justify-between gap-3 z-[1000] shadow-[0_40px_80px_rgba(0,0,0,0.3)]">
        {['KEDHEON', 'CIVIL', 'NEXUS', 'VENDOR'].map(app => (
          <button key={app} className={`flex-1 py-8 rounded-[1.5rem] text-xs md:text-3xl transition-all font-black text-center leading-none ${app === 'KEDHEON' ? 'bg-black text-white scale-[1.03] shadow-lg' : 'text-gray-300 hover:text-black'}`}>
            {app}
          </button>
        ))}
      </footer>

      {/* WATERMARK */}
      <div className="mt-40 opacity-[0.03] text-black text-5xl md:text-[10rem] tracking-[0.5em] uppercase pb-96 font-black text-center select-none pointer-events-none leading-none"> 
        KEDHEON MASTER 
      </div>
    </div>
  );
}
