'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';

/** 
 * [KEDHEON MASTER V160.0 - SUPREME FULL EDITION]
 * -----------------------------------------------------------
 * 1. 복구: 한/영 언어 토글 (KR/EN)
 * 2. 복구: 섹션 03 크리에이티브 카테고리 (TECH, ART, MUSIC 등)
 * 3. 추가: BEOM 토큰 구매(Buy) 및 자산 관리 박스
 * 4. 강화: 케데헌 대표 캐릭터 및 비주얼 스케일 확대
 * 5. 규격: Next.js 16 Turbopack + TypeScript 완벽 준수
 * -----------------------------------------------------------
 */

// --- Types ---
type Lang = 'KR' | 'EN';
interface Step { t: string; d: string; link?: string; }
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
    invitation: "Web3 제국 초대장", procedure: "파이코인 가입 절차", assets: "보유 자산",
    activate: "QR 활성화", convert: "1 PI 전환", post: "피드 업로드",
    buy: "구매하기", register: "상품 등록", submit: "제안 제출", download: "공식 앱 다운로드",
    buyBeom: "BEOM 구매", piJoinDesc: "인류 최대의 네트워크, 파이 생태계에 합류하십시오.",
    exchangeDesc: "채굴 기여도를 BEOM으로 전환하여 가치를 보존하십시오.",
    authDesc: "제국 시민을 위한 고유 보안 QR 코드를 발급받으십시오.",
    creativeDesc: "창작물을 공유하고 팬덤 수익을 창출하십시오.",
    fanRoomDesc: "팬룸 입장(500 BEOM): 수익의 90%가 창작자에게 반환됩니다.",
    marketDesc: "검증된 제국의 물품을 안전하게 거래하십시오.",
    partnershipDesc: "미래 제국을 함께 건설할 글로벌 파트너를 찾습니다.",
    steps: [
      { t: "애플리케이션 설치", d: "[Pi Network] 공식 앱을 앱스토어에서 설치하십시오.", link: "https://minepi.com/#download" },
      { t: "가입 방식 선택", d: "Continue with phone number 가입 방식을 선택하십시오." },
      { t: "국가 및 번호 설정", d: "+82(South Korea) 선택 후 본인의 번호를 입력하십시오." },
      { t: "비밀번호 설정", d: "영문 대/소문자와 숫자를 조합하여 8자리 이상 설정하십시오." },
      { t: "프로필 작성", d: "여권 영문 성함과 본인만의 고유 ID를 설정하십시오." },
      { t: "초대코드 입력", d: "초대코드 [ ohsangjo ]를 정확히 입력하여 합류하십시오." },
      { t: "비밀구절 보관", d: "지갑 생성 시 나오는 24개 단어는 반드시 종이에 수기 보관하십시오." },
      { t: "채굴 시작", d: "24시간마다 번개 버튼을 눌러 채굴 활동을 증명하십시오." }
    ]
  },
  EN: {
    rookie: "ROOKIE", pioneer: "PIONEER", exchange: "EXCHANGE", auth: "SECURE AUTH",
    creative: "CREATIVE", market: "MARKET", partnership: "PARTNERSHIP",
    invitation: "Web3 Empire Invitation", procedure: "Pi Network Join Guide", assets: "ASSETS",
    activate: "ACTIVATE QR", convert: "1 PI CONVERT", post: "POST FEED",
    buy: "BUY NOW", register: "REGISTER", submit: "SUBMIT", download: "Download App",
    buyBeom: "BUY BEOM", piJoinDesc: "Join the largest network in human history.",
    exchangeDesc: "Convert mining contribution to BEOM.",
    authDesc: "Get your secure QR code for the Empire.",
    creativeDesc: "Share your creations and fan spirit.",
    fanRoomDesc: "Fan Room (500 BEOM): 90% Revenue Return.",
    marketDesc: "Trade verified products in the Empire.",
    partnershipDesc: "Global partners for the future Empire.",
    steps: [
      { t: "Install App", d: "Install [Pi Network] from App Store.", link: "https://minepi.com/#download" },
      { t: "Choose Login", d: "Select 'Continue with phone number'." },
      { t: "Country & Phone", d: "Select +82 and enter your phone number." },
      { t: "Set Password", d: "Combine upper/lowercase and numbers." },
      { t: "Set Profile", d: "Enter your name as in passport and set Unique ID." },
      { t: "Invitation Code", d: "Enter [ ohsangjo ] correctly." },
      { t: "Passphrase", d: "Handwrite 24 words on paper. Never lose them." },
      { t: "Start Mining", d: "Tap the lightning bolt every 24 hours." }
    ]
  }
};

const SectionHeader = ({ num, title, desc }: { num: string | number; title: string; desc: string; }) => (
  <div className="w-full border-t-8 border-[#dc2626] pt-10 mb-12 text-left">
    <h2 className="text-black text-4xl md:text-6xl font-black uppercase italic mb-2 border-l-[30px] border-black pl-8 tracking-tighter">
      {num}. {title}
    </h2>
    <p className="text-gray-400 text-lg md:text-3xl font-bold pl-20 italic leading-none">{desc}</p>
  </div>
);

export default function KedheonEmpireSupreme() {
  const [hasMounted, setHasMounted] = useState(false);
  const [lang, setLang] = useState<Lang>('KR');
  const [tab, setTab] = useState<'ROOKIE' | 'PIONEER'>('PIONEER');
  
  const [beomToken, setBeomToken] = useState(7891.88);
  const [piBalance, setPiBalance] = useState(124.55);
  const [totalRevenue] = useState(188500);
  const [netIncome] = useState(72300);

  const [qrState, setQrState] = useState({ type: 'PERSONAL', biz: '', active: false });
  const [category, setCategory] = useState('TECH');
  const [feed, setFeed] = useState({ title: '', desc: '' });
  const [partner, setPartner] = useState({ corp: '', contact: '', msg: '' });

  const L = DICT[lang];
  const redistributionAmount = useMemo(() => Math.max(totalRevenue * 0.03, netIncome * 0.08), [totalRevenue, netIncome]);

  useEffect(() => { setHasMounted(true); }, []);

  const handleDownload = useCallback((url?: string) => { if (typeof window !== 'undefined' && url) window.open(url, '_blank'); }, []);
  const handleCopy = useCallback(() => { if (typeof window !== 'undefined') { navigator.clipboard.writeText(PI_INVITE_CODE); alert("Imperial Code Copied!"); } }, []);

  if (!hasMounted) return <div className="bg-white min-h-screen" />;

  return (
    <div className="flex flex-col items-center bg-white min-h-screen text-black font-sans w-full pb-96 font-black overflow-x-hidden selection:bg-red-50">
      
      {/* NAVIGATION */}
      <nav className="w-full max-w-7xl flex justify-between items-center px-6 py-8 sticky top-0 bg-white/95 backdrop-blur-2xl z-[500] border-b-[12px] border-black/5 shadow-2xl">
        <div className="flex items-center gap-8">
          <img src="/kedheon-character.png" className="w-20 h-20 md:w-28 md:h-28 rounded-3xl border-8 border-black shadow-2xl" alt="Lord Kedheon" />
          <div className="text-left leading-tight">
            <h1 className="text-black text-3xl md:text-5xl italic uppercase font-black">Kedheon</h1>
            <span className="text-gray-400 text-sm md:text-lg font-mono tracking-[0.3em]">EMPIRE MASTER V160.0</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setLang(lang === 'KR' ? 'EN' : 'KR')} className="px-6 py-4 rounded-2xl bg-black text-white text-xl font-black border-4 border-black hover:bg-[#dc2626] transition-all">
            {lang === 'KR' ? 'EN' : 'KR'}
          </button>
          <button onClick={() => setTab('ROOKIE')} className={`px-8 py-4 rounded-2xl text-xl md:text-3xl font-black border-4 transition-all ${tab === 'ROOKIE' ? 'bg-[#dc2626] text-white border-[#dc2626]' : 'text-gray-400 border-transparent'}`}>{L.rookie}</button>
          <button onClick={() => setTab('PIONEER')} className={`px-8 py-4 rounded-2xl text-xl md:text-3xl font-black border-4 transition-all ${tab === 'PIONEER' ? 'bg-black text-white border-black' : 'text-gray-400 border-transparent'}`}>{L.pioneer}</button>
        </div>
      </nav>

      <main className="w-full max-w-7xl px-6 py-20">
        {tab === 'ROOKIE' ? (
          <div className="flex flex-col gap-16 text-left animate-in fade-in duration-700">
            {/* HERO SECTION */}
            <div className="flex flex-col items-center text-center gap-12 py-32 bg-gray-50 rounded-[4rem] border-8 border-black/5 relative shadow-inner overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-8 bg-[#dc2626]"></div>
              <img src="/kedheon-character.png" className="w-64 h-64 md:w-[32rem] md:h-[32rem] object-contain drop-shadow-[0_35px_35px_rgba(0,0,0,0.25)]" alt="Kedheon" />
              <div className="px-10 space-y-4">
                <h1 className="text-black text-6xl md:text-[8rem] uppercase tracking-tighter leading-none font-black">{L.invitation}</h1>
                <p className="text-[#dc2626] text-2xl md:text-5xl uppercase tracking-widest border-b-[12px] border-[#dc2626] pb-6 inline-block italic font-black">{L.procedure}</p>
                <p className="text-gray-400 text-xl md:text-3xl font-bold mt-10">{L.piJoinDesc}</p>
              </div>
            </div>

            {/* STEPS */}
            <div className="grid grid-cols-1 gap-12">
              {L.steps.map((step, i) => (
                <div key={i} className={`p-12 bg-white rounded-[3rem] border-8 flex flex-col gap-10 transition-all ${i === 0 || i === 5 ? 'border-[#dc2626] bg-red-50/10 shadow-2xl' : 'border-black/5'}`}>
                  <div className="flex items-center gap-12">
                    <span className={`text-8xl md:text-[12rem] font-black italic ${i === 0 || i === 5 ? 'text-[#dc2626]' : 'text-black opacity-10'}`}>0{i+1}</span>
                    <div className="flex-1">
                      <h3 className="text-black text-3xl md:text-6xl font-black uppercase italic mb-4">{step.t}</h3>
                      <p className="text-gray-600 text-xl md:text-4xl font-bold leading-tight">{step.d}</p>
                    </div>
                  </div>
                  {step.link && (
                    <div className="w-full p-10 bg-black rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-8">
                      <div className="text-left font-black uppercase text-white">
                        <p className="text-2xl md:text-5xl italic leading-none">Empire Sync</p>
                        <p className="text-gray-500 text-sm md:text-xl font-bold mt-4">Official Node Network</p>
                      </div>
                      <button onClick={() => handleDownload(step.link)} className="w-full md:w-auto bg-[#dc2626] text-white px-16 py-8 rounded-full text-2xl md:text-5xl font-black uppercase shadow-2xl hover:bg-white hover:text-black transition-all">
                        &darr; {L.download}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {/* INVITATION CODE */}
            <div className="p-32 bg-black text-white rounded-[4rem] text-center shadow-2xl border-[16px] border-[#dc2626] font-black">
              <p className="text-3xl md:text-6xl italic text-gray-500 uppercase tracking-[0.5em] mb-10">Imperial Code</p>
              <div className="text-[#dc2626] text-7xl md:text-[15rem] tracking-widest cursor-pointer hover:scale-105 transition-transform leading-none" onClick={handleCopy}>
                {PI_INVITE_CODE}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-32 py-10 animate-in slide-in-from-bottom-10 duration-700">
            {/* ASSET DASHBOARD & BUY BOX */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 bg-gray-50 p-16 rounded-[3rem] border-8 border-black shadow-2xl flex flex-col justify-between relative overflow-hidden">
                <h3 className="text-gray-400 text-2xl md:text-5xl uppercase tracking-widest leading-none font-black mb-10">{L.assets}</h3>
                <div className="space-y-4">
                  <p className="text-black text-7xl md:text-[10rem] tracking-tighter leading-none font-black">
                    {Math.floor(beomToken).toLocaleString()}
                    <span className="text-4xl opacity-10">.{beomToken.toFixed(2).split('.')[1]}</span> 
                    <span className="ml-6 text-4xl md:text-8xl italic uppercase text-[#dc2626]">BEOM</span>
                  </p>
                  <p className="text-gray-400 text-3xl md:text-5xl font-black italic">
                    ≈ {piBalance.toLocaleString()} <span className="text-[#dc2626]">PI</span>
                  </p>
                </div>
                <div className="flex flex-wrap gap-6 mt-16">
                  <div className="bg-black text-white px-10 py-6 rounded-2xl text-xl md:text-4xl font-mono shadow-xl">NODE: 18.02 SCORE</div>
                  <div className="bg-[#dc2626] text-white px-10 py-6 rounded-2xl text-xl md:text-4xl font-mono shadow-xl">RETURN: {redistributionAmount.toLocaleString()}</div>
                </div>
              </div>
              
              <div className="bg-[#dc2626] p-12 rounded-[3rem] border-8 border-black shadow-2xl flex flex-col justify-center items-center text-center gap-10 group">
                <h4 className="text-white text-4xl md:text-6xl font-black uppercase italic tracking-tighter">{L.buyBeom}</h4>
                <div className="bg-white/10 p-8 rounded-3xl w-full border-4 border-white/20">
                  <p className="text-white/60 text-xl font-bold uppercase mb-2">Exchange Rate</p>
                  <p className="text-white text-3xl md:text-5xl font-black">1 PI = 1,000 BEOM</p>
                </div>
                <button onClick={() => {if(piBalance < 1) return alert("Low Pi"); setPiBalance(p=>p-1); setBeomToken(p=>p+1000); alert("Purchased!");}} className="w-full bg-white text-black py-10 rounded-full text-3xl md:text-5xl font-black shadow-2xl group-hover:scale-105 transition-all">
                  {L.buyBeom}
                </button>
              </div>
            </div>

            {/* SECTION 01: EXCHANGE */}
            <SectionHeader num="01" title={L.exchange} desc={L.exchangeDesc} />
            <div className="bg-white p-16 md:p-32 rounded-[3rem] border-[12px] border-black flex flex-col md:flex-row justify-between items-center shadow-2xl gap-20 group hover:bg-gray-50 transition-all">
              <div className="text-left font-black">
                <p className="text-black text-6xl md:text-[8rem] italic uppercase mb-8 group-hover:text-[#dc2626] transition-colors leading-none tracking-tighter">Terminal</p>
                <div className="flex items-center gap-6">
                  <span className="w-8 h-8 bg-green-500 rounded-full animate-ping"></span>
                  <p className="text-gray-400 text-2xl md:text-5xl uppercase tracking-[0.2em] font-black">Protocol V23 Ready</p>
                </div>
              </div>
              <button onClick={() => {setBeomToken(p=>p+100); alert("CONVERTED");}} className="w-full md:w-auto bg-black text-white px-24 py-16 rounded-full text-4xl md:text-7xl font-black shadow-2xl hover:bg-[#dc2626] transition-all">
                {L.convert}
              </button>
            </div>

            {/* SECTION 03: CREATIVE (카테고리 복구) */}
            <SectionHeader num="03" title={L.creative} desc={L.creativeDesc} />
            <div className="bg-white p-12 md:p-24 rounded-[3.5rem] border-8 border-black/10 space-y-20 shadow-2xl">
              <div className="flex flex-col gap-12 border-b-8 border-gray-100 pb-12">
                 <div className="flex gap-12 overflow-x-auto pb-4 no-scrollbar">
                    {CATS.map(cat => (
                      <button key={cat} onClick={() => setCategory(cat)} className={`text-3xl md:text-6xl font-black italic uppercase whitespace-nowrap transition-all ${category === cat ? 'text-[#dc2626] border-b-[12px] border-[#dc2626] pb-2' : 'text-gray-300 hover:text-black'}`}>
                        {cat}
                      </button>
                    ))}
                 </div>
              </div>
              <div className="space-y-10">
                <input value={feed.title} onChange={(e) => setFeed({ ...feed, title: e.target.value })} placeholder="PROJECT TITLE" className="w-full bg-gray-50 border-8 border-black/5 p-12 rounded-[2rem] text-3xl md:text-6xl font-black outline-none focus:border-black transition-all" />
                <textarea value={feed.desc} onChange={(e) => setFeed({ ...feed, desc: e.target.value })} placeholder="EMPIRE VISION..." className="w-full bg-gray-50 border-8 border-black/5 p-12 rounded-[2rem] text-2xl md:text-5xl font-bold h-[30rem] outline-none focus:border-black leading-tight" />
              </div>
              <button onClick={() => {if(!feed.title) return alert("Empty"); setBeomToken(p=>p-10); alert("UPLOADED"); setFeed({title:'', desc:''});}} className="w-full bg-black text-white py-16 rounded-full text-4xl md:text-8xl font-black shadow-2xl hover:bg-[#dc2626] transition-all">
                {L.post} (10 BEOM)
              </button>
              <p className="text-gray-400 text-2xl md:text-4xl font-bold bg-gray-50 p-12 rounded-[2rem] border-l-[30px] border-[#dc2626] italic">Note: {L.fanRoomDesc}</p>
            </div>

            {/* SECTION 05: PARTNERSHIP */}
            <SectionHeader num="05" title={L.partnership} desc={L.partnershipDesc} />
            <div className="bg-black p-16 md:p-32 rounded-[4rem] border-[30px] border-[#dc2626] space-y-20 relative overflow-hidden font-black">
                <div className="absolute -top-60 -right-60 opacity-10 pointer-events-none grayscale">
                  <img src="/kedheon-character.png" className="w-[50rem]" alt="Bg" />
                </div>
                <h3 className="text-white text-6xl md:text-[10rem] font-black italic border-l-[40px] border-[#dc2626] pl-12 z-10 relative uppercase leading-none">Empire Portal</h3>
                <div className="space-y-12 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 font-black">
                        <input value={partner.corp} onChange={(e)=>setPartner({...partner, corp: e.target.value.toUpperCase()})} placeholder="CORPORATION" className="w-full bg-white/10 border-4 border-white/10 p-12 rounded-[2rem] text-white text-3xl md:text-6xl font-black outline-none focus:border-[#dc2626]" />
                        <input value={partner.contact} onChange={(e)=>setPartner({...partner, contact: e.target.value})} placeholder="CONTACT INFO" className="w-full bg-white/10 border-4 border-white/10 p-12 rounded-[2rem] text-white text-3xl md:text-6xl font-black outline-none focus:border-[#dc2626]" />
                    </div>
                    <textarea value={partner.msg} onChange={(e)=>setPartner({...partner, msg: e.target.value})} placeholder="PARTNERSHIP VISION..." className="w-full bg-white/10 border-4 border-white/10 p-12 rounded-[3rem] text-white text-2xl md:text-5xl font-bold h-96 outline-none focus:border-[#dc2626]" />
                </div>
                <button onClick={()=>{if(!partner.corp || !partner.msg) return alert("Empty"); alert("SUBMITTED"); setPartner({corp:'', contact:'', msg:''});}} className="w-full bg-[#dc2626] text-white py-16 md:py-24 rounded-full text-4xl md:text-[7rem] border-8 border-[#dc2626] hover:bg-white hover:text-[#dc2626] transition-all font-black shadow-2xl leading-none uppercase">
                  {L.submit}
                </button>
            </div>

            {/* INFRA BAR */}
            <div className="py-16 px-12 bg-gray-100 rounded-[3rem] flex flex-col md:flex-row justify-between items-center gap-12 border-8 border-black shadow-inner font-black">
                <div className="flex items-center gap-8 font-black text-black">
                  <div className="w-12 h-12 bg-[#dc2626] rounded-full animate-ping"></div>
                  <span className="text-3xl md:text-6xl font-mono uppercase tracking-tighter">Infrastructure: 88-Threads Dual Xeon</span>
                </div>
                <div className="flex items-center gap-12 uppercase text-xl md:text-4xl text-gray-400">
                  <span>Reliability: 18.02</span>
                  <span>Master: Lord @Ohsangjo</span>
                </div>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER NAV */}
      <footer className="fixed bottom-12 left-6 right-6 max-w-7xl mx-auto bg-white border-[12px] border-black p-4 rounded-[3rem] flex justify-between gap-4 z-[1000] shadow-[0_50px_100px_rgba(0,0,0,0.4)]">
        {['KEDHEON', 'CIVIL', 'NEXUS', 'VENDOR'].map(app => (
          <button key={app} className={`flex-1 py-12 rounded-[2rem] text-xl md:text-6xl transition-all font-black text-center leading-none ${app === 'KEDHEON' ? 'bg-black text-white scale-[1.05] shadow-2xl' : 'text-gray-300 hover:text-black'}`}>
            {app}
          </button>
        ))}
      </footer>

      {/* WATERMARK */}
      <div className="mt-60 opacity-[0.03] text-black text-[15rem] tracking-[0.2em] uppercase pb-96 font-black text-center select-none pointer-events-none leading-none"> 
        KEDHEON MASTER | LORD OHSANGJO 
      </div>
    </div>
  );
}
