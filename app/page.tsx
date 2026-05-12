'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';

/** * [KEDHEON MASTER V181.0 - PIONEER & GOODS]
 * -----------------------------------------------------------
 * 1. 수정: "04. 마켓" -> "04. 굿즈" 명칭 변경 및 테마 정립
 * 2. 유지: PIONEER 탭 명칭 및 범토큰 이미지 선명도 확보
 * 3. 유지: 섹션 03 CCM, 뮤지션 카테고리 포함
 * 4. 유지: 섹션 01 앱 기능 상세 나열 (1~5번)
 * 5. 유지: 섹션 02 QR 코드 보안 인증 시스템
 * -----------------------------------------------------------
 */

type Lang = 'KR' | 'EN';
interface Step { t: string; d: string; links?: { AOS: string; iOS: string; }; }
interface GoodsItem { id: number; name: string; price: number; img: string; seller: string; }
interface Dictionary {
  rookie: string; pioneer: string; exchange: string; auth: string; creative: string;
  market: string; partnership: string; invitation: string; procedure: string;
  assets: string; activate: string; convert: string; post: string; buy: string;
  register: string; submit: string; downloadAOS: string; downloadiOS: string; buyBeom: string;
  exchangeDesc: string; authDesc: string; creativeDesc: string; fanRoomDesc: string;
  marketDesc: string; partnershipDesc: string; piJoinDesc: string; steps: Step[];
  corpName: string; email: string; contact: string; manager: string; vision: string;
  itemName: string; itemPrice: string;
  exList: string[];
}

const PI_INVITE_CODE = 'ohsangjo';
const CATS = ['CCM', '뮤지션', 'MUSIC', 'TECH', 'ART', 'FOOD', 'TRAVEL', 'GAME', 'NEWS', 'MOVIE'];
const FANS = ['케데헌', '헌트릭스', 'BTS'];

const DICT: Record<Lang, Dictionary> = {
  KR: {
    rookie: "루키 가이드", pioneer: "파이오니어", exchange: "01. 자산 전환 프로토콜", auth: "02. 보안 인증 (QR)",
    creative: "03. 크리에이티브 & 팬", market: "04. 굿즈", partnership: "05. 파트너십",
    invitation: "Web3 제국 초대장", procedure: "파이코인 가입 가이드", assets: "보유 자산",
    activate: "QR 활성화 (50 BEOM)", convert: "1 PI 환전 실행", post: "피드 등록 (10 BEOM)",
    buy: "구매", register: "굿즈 등록", submit: "제안 제출", 
    downloadAOS: "안드로이드 다운로드", downloadiOS: "아이폰 다운로드", buyBeom: "BEOM 구매",
    corpName: "기업명", email: "이메일", contact: "연락처", manager: "담당자", vision: "제안서 내용",
    itemName: "굿즈 명칭", itemPrice: "가격",
    piJoinDesc: "인류 최대의 생태계에 합류하십시오.",
    exchangeDesc: "채굴 기여도를 BEOM으로 전환하여 가치를 보존하십시오.",
    authDesc: "시민 보안 QR 코드를 발급받고 신분을 증명하십시오.",
    creativeDesc: "창작물과 팬심을 공유하고 호응을 이끌어내십시오.",
    fanRoomDesc: "※ 🚩 팬룸 개설(500 BEOM): 90% 수익 환원 및 거버넌스 권한 부여.",
    marketDesc: "제국 한정 굿즈를 소유하거나 본인의 아이템을 등록하십시오.",
    partnershipDesc: "글로벌 파트너를 찾습니다.",
    exList: [
      "1. 파이코인 채굴 기여도 실시간 BEOM 전환 기능",
      "2. 노드 운영 보상 및 가용 자산 통합 관리",
      "3. 제국 생태계 내 자산 보존 및 가치 방어 프로토콜",
      "4. 메인넷 마이그레이션 대비 자산 동기화 지원",
      "5. 외부 지갑 연동을 통한 제국 자산 안정성 확보"
    ],
    steps: [
      { t: "앱 설치", d: "기기에 맞는 공식 앱을 설치하십시오.", links: { AOS: "https://play.google.com/store/apps/details?id=com.blockchainvault", iOS: "https://apps.apple.com/us/app/pi-network/id1445472543" } },
      { t: "가입 방식", d: "Phone number 가입을 진행하십시오." },
      { t: "국가 설정", d: "+82(South Korea)를 선택하십시오." },
      { t: "비밀번호", d: "영문 대/소문자와 숫자를 조합하십시오." },
      { t: "프로필 작성", d: "여권 영문 실명과 ID를 설정하십시오." },
      { t: "초대 코드 입력", d: "초대 코드 ohsangjo 를 입력하십시오." },
      { t: "비밀구절", d: "24개 단어를 반드시 수기로 보관하십시오." },
      { t: "채굴 시작", d: "24시간마다 번개 버튼을 누르십시오." }
    ]
  },
  EN: {
    rookie: "ROOKIE", pioneer: "PIONEER", exchange: "01. ASSET CONVERSION", auth: "02. SECURE AUTH (QR)",
    creative: "03. CREATIVE & FAN", market: "04. GOODS", partnership: "05. PARTNERSHIP",
    invitation: "Empire Invitation", procedure: "Join Guide", assets: "ASSETS",
    activate: "ACTIVATE (50 BEOM)", convert: "CONVERT 1 PI", post: "POST (10 BEOM)",
    buy: "BUY", register: "REGISTER", submit: "SUBMIT",
    downloadAOS: "Android", downloadiOS: "iOS", buyBeom: "BUY BEOM",
    corpName: "Company", email: "Email", contact: "Contact", manager: "Manager", vision: "Proposal",
    itemName: "Goods Name", itemPrice: "Price",
    piJoinDesc: "Join the largest Web3 network.",
    exchangeDesc: "Convert your mining contribution to BEOM.",
    authDesc: "Get your secure QR code for citizenship.",
    creativeDesc: "Share creations and fan spirit.",
    fanRoomDesc: "※ 🚩 Fan Room (500 BEOM): 90% Return.",
    marketDesc: "Own exclusive empire goods or register items.",
    partnershipDesc: "Global partners needed.",
    exList: [
      "1. Real-time BEOM conversion for mining contribution",
      "2. Integrated management of node rewards",
      "3. Asset preservation protocol within the empire",
      "4. Support for mainnet migration synchronization",
      "5. Security assurance through external wallet linking"
    ],
    steps: [
      { t: "Install", d: "Download [Pi Network] App.", links: { AOS: "https://minepi.com/#download", iOS: "https://minepi.com/#download" } },
      { t: "Login", d: "Select 'Continue with phone number'." },
      { t: "Country", d: "Select +82 and enter your phone." },
      { t: "Password", d: "Combine Upper/Lower/Numbers." },
      { t: "Profile", d: "Enter passport name and ID." },
      { t: "Invite Code", d: "Enter [ ohsangjo ] to join." },
      { t: "Passphrase", d: "Handwrite 24 words on paper." },
      { t: "Mining", d: "Tap lightning bolt every 24h." }
    ]
  }
};

const SectionHeader = ({ title, desc }: { title: string; desc: string; }) => (
  <div className="w-full border-t-2 border-[#dc2626] pt-3 mb-4 text-left">
    <h2 className="text-black text-xl md:text-2xl font-black uppercase italic border-l-[10px] border-black pl-3 tracking-tighter leading-none">
       {title}
    </h2>
    <p className="text-gray-400 text-[10px] md:text-xs font-bold pl-8 italic leading-none mt-1">{desc}</p>
  </div>
);

export default function KedheonPioneerUltimate() {
  const [hasMounted, setHasMounted] = useState(false);
  const [lang, setLang] = useState<Lang>('KR');
  const [tab, setTab] = useState<'ROOKIE' | 'PIONEER'>('PIONEER');
  
  const [beomToken, setBeomToken] = useState(7891.88);
  const [piBalance, setPiBalance] = useState(124.55);
  const [hubTab, setHubTab] = useState<'HUB' | 'SPIRIT'>('HUB');
  const [category, setCategory] = useState('TECH');
  const [feed, setFeed] = useState({ title: '', link: '', desc: '' });
  const [qrState, setQrState] = useState({ active: false });
  
  const [goodsMode, setGoodsMode] = useState<'BUY' | 'SELL'>('BUY');
  const [sellItem, setSellItem] = useState({ name: '', price: '' });
  const [goods, setGoods] = useState<GoodsItem[]>([
    { id: 1, name: "제국 골드 뱃지", price: 1000, img: "/beom-token.png", seller: "System" },
    { id: 2, name: "V23 노드 활성키", price: 5000, img: "/node-icon.png", seller: "System" }
  ]);

  const [partner, setPartner] = useState({ corp: '', email: '', contact: '', manager: '', msg: '' });

  const L = DICT[lang];

  useEffect(() => { setHasMounted(true); }, []);

  const handleDownload = useCallback((url: string) => {
    if (typeof window !== 'undefined') window.open(url, '_blank');
  }, []);

  const handleCopy = useCallback(() => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(PI_INVITE_CODE);
      alert("Imperial Code Copied!");
    }
  }, []);

  if (!hasMounted) return <div className="bg-white min-h-screen" />;

  return (
    <div className="flex flex-col items-center bg-white min-h-screen text-black font-sans w-full pb-32 font-black selection:bg-red-50">
      
      {/* NAVIGATION */}
      <nav className="w-full max-w-6xl flex justify-between items-center px-4 py-3 sticky top-0 bg-white/95 backdrop-blur-sm z-[500] border-b border-black/5 shadow-sm">
        <div className="flex items-center gap-3">
          <img src="/kedheon-character.png" className="w-10 h-10 rounded-lg border-2 border-black shadow-lg" alt="K" />
          <div className="text-left leading-tight font-black">
            <h1 className="text-black text-lg md:text-xl italic uppercase">Kedheon</h1>
            <span className="text-gray-400 text-[8px] font-mono tracking-widest uppercase">PIONEER V181.0</span>
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
            <div className="flex flex-col items-center text-center gap-6 py-10 bg-gray-50 rounded-3xl border border-black/5 relative shadow-inner overflow-hidden font-black">
              <div className="absolute top-0 left-0 w-full h-2 bg-[#dc2626]"></div>
              <img src="/kedheon-character.png" className="w-48 h-48 md:w-80 md:h-80 object-contain drop-shadow-2xl" alt="K" />
              <div className="px-6 space-y-2 text-left">
                <h1 className="text-black text-3xl md:text-5xl uppercase tracking-tighter font-black">{L.invitation}</h1>
                <p className="text-[#dc2626] text-lg md:text-2xl uppercase tracking-widest border-b-4 border-[#dc2626] pb-1 inline-block italic font-black">{L.procedure}</p>
                <p className="text-gray-400 text-xs md:text-base font-bold mt-2">{L.piJoinDesc}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {L.steps.map((step, i) => (
                <div key={i} className={`p-5 bg-white rounded-2xl border flex flex-col gap-4 transition-all ${i === 0 || i === 5 ? 'border-[#dc2626] bg-red-50/5 shadow-md' : 'border-black/5 opacity-90'}`}>
                  <div className="flex items-center gap-4 text-left">
                    <span className={`text-4xl md:text-6xl font-black italic ${i === 0 || i === 5 ? 'text-[#dc2626]' : 'text-black opacity-5'}`}>0{i+1}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-black text-xs md:text-base font-black uppercase italic leading-none">{step.t}</h3>
                      <p className="text-gray-600 text-[10px] md:text-sm font-bold mt-1.5 leading-tight">{step.d}</p>
                    </div>
                  </div>
                  {step.links && (
                    <div className="grid grid-cols-2 gap-3">
                      <button onClick={() => handleDownload(step.links!.AOS)} className="bg-black text-white py-2 rounded-lg text-[9px] font-black uppercase">안드로이드 앱</button>
                      <button onClick={() => handleDownload(step.links!.iOS)} className="bg-black text-white py-2 rounded-lg text-[9px] font-black uppercase">애플 앱스토어</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-8 animate-in slide-in-from-bottom-5 duration-700 font-black text-left">
            
            {/* ASSETS BOX */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-3xl border-2 border-black shadow-lg flex flex-col justify-center relative overflow-hidden group">
                <h3 className="text-gray-400 text-[10px] md:text-xs uppercase tracking-widest font-black mb-4">{L.assets}</h3>
                
                {/* [BEOM TOKEN IMAGE - CLEAR & VIVID] */}
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                   <img src="/beom-token.png" className="w-32 h-32 md:w-56 md:h-56 object-contain shadow-2xl rounded-full" alt="Beom" />
                </div>

                <div className="relative z-10">
                    <p className="text-black text-4xl md:text-6xl tracking-tighter leading-none font-black">
                    {Math.floor(beomToken).toLocaleString()}
                    <span className="text-xl opacity-20">.{beomToken.toFixed(2).split('.')[1]}</span> 
                    <span className="ml-2 text-xl md:text-3xl italic uppercase text-[#dc2626]">BEOM</span>
                    </p>
                    <p className="text-gray-400 text-sm md:text-lg font-black italic mt-1">≈ {piBalance.toLocaleString()} PI</p>
                    <div className="flex items-center gap-3 mt-4">
                      <div className="bg-black text-white px-3 py-1 rounded text-[9px] md:text-[10px] font-mono">NODE: 18.02 SCORE</div>
                      <div className="bg-[#dc2626] text-white px-3 py-1 rounded text-[9px] md:text-[10px] font-mono italic">REDISTRIBUTION: 15,080</div>
                    </div>
                </div>
              </div>
              
              <div className="bg-[#dc2626] p-6 rounded-3xl border-2 border-black shadow-lg flex flex-col justify-center items-center text-center gap-3">
                <h4 className="text-white text-lg md:text-xl font-black uppercase italic leading-none">{L.buyBeom}</h4>
                <div className="bg-white/20 p-3 rounded-xl w-full border border-white/30 backdrop-blur-sm">
                  <p className="text-white text-xs md:text-sm font-black uppercase tracking-tighter">1 PI = 1,000 BEOM</p>
                </div>
                <button onClick={() => {if(piBalance < 1) return alert("Low Pi"); setPiBalance(p=>p-1); setBeomToken(p=>p+1000); alert("Purchased!");}} className="w-full bg-white text-black py-4 rounded-xl text-sm md:text-lg font-black shadow hover:scale-105 transition-all">
                   BEOM 구매
                </button>
              </div>
            </div>

            {/* 01. EXCHANGE */}
            <SectionHeader title={L.exchange} desc={L.exchangeDesc} />
            <div className="bg-white p-6 rounded-3xl border-2 border-black space-y-6 shadow-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                   {L.exList.map((item, idx) => (
                     <p key={idx} className="text-xs md:text-sm font-black text-gray-600 border-b border-gray-50 pb-1">{item}</p>
                   ))}
                </div>
                <div className="flex flex-col justify-center items-center bg-gray-50 rounded-2xl p-6 border border-black/5">
                   <p className="text-black text-xl font-black italic uppercase mb-2 leading-none tracking-tighter">TERMINAL GATE</p>
                   <p className="text-gray-400 text-[10px] uppercase mb-4 font-black">Fixed Rate: 1 PI = 1,000 BEOM</p>
                   <button onClick={() => {if(piBalance < 1) return alert("Low Pi"); setPiBalance(p=>p-1); setBeomToken(p=>p+1000); alert("CONVERTED");}} className="w-full bg-black text-white py-4 rounded-xl text-sm md:text-lg font-black hover:bg-[#dc2626] transition-all">
                    {L.convert}
                  </button>
                </div>
              </div>
            </div>

            {/* 02. SECURE AUTH */}
            <SectionHeader title={L.auth} desc={L.authDesc} />
            <div className="bg-gray-50 p-6 md:p-10 rounded-3xl border border-black/5 flex flex-col md:flex-row items-center gap-10 shadow-inner">
               <div className={`bg-white border-4 rounded-2xl flex items-center justify-center shadow-lg w-48 h-48 md:w-72 md:h-72 transition-all ${qrState.active ? 'border-[#dc2626] opacity-100' : 'opacity-10 grayscale blur-sm'}`}>
                  {qrState.active ? (
                    <img src="/qr-personal.png" className="w-full h-full p-4" alt="QR" />
                  ) : <p className="text-black text-xl font-black uppercase italic animate-pulse tracking-tighter">Encoded Identity</p>}
               </div>
               <div className="flex-1 space-y-6">
                  <div className="bg-white p-6 rounded-2xl border-2 border-black/10">
                     <p className="text-black text-sm md:text-lg font-black italic uppercase mb-2">Empire Protocol Status</p>
                     <div className="flex items-center gap-3">
                        <span className={`w-3 h-3 rounded-full ${qrState.active ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`}></span>
                        <p className="text-gray-500 text-xs md:text-sm font-bold uppercase">{qrState.active ? 'Citizen Verified' : 'Awaiting Activation'}</p>
                     </div>
                  </div>
                  <button onClick={() => {if(beomToken < 50) return alert("Low Beom"); setBeomToken(p=>p-50); setQrState({active:true}); alert("Verified!");}} className="w-full bg-black text-white py-4 rounded-xl text-sm md:text-lg font-black hover:bg-[#dc2626] transition-all">
                    {L.activate}
                  </button>
               </div>
            </div>

            {/* 03. CREATIVE & FAN */}
            <SectionHeader title={L.creative} desc={L.creativeDesc} />
            <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-black/10 space-y-6 shadow-sm font-black">
              <div className="flex gap-8 border-b border-gray-100 pb-2">
                <button onClick={() => setHubTab('HUB')} className={`text-lg md:text-2xl font-black italic uppercase transition-all ${hubTab === 'HUB' ? 'text-black border-b-4 border-black pb-1' : 'text-gray-300'}`}>CREATIVE HUB</button>
                <button onClick={() => setHubTab('SPIRIT')} className={`text-lg md:text-2xl font-black italic uppercase transition-all ${hubTab === 'SPIRIT' ? 'text-black border-b-4 border-black pb-1' : 'text-gray-300'}`}>FAN SPIRIT</button>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {CATS.map(cat => (
                  <button key={cat} onClick={() => setCategory(cat)} className={`px-4 py-1.5 rounded-full text-[10px] md:text-xs font-black italic border transition-all whitespace-nowrap ${category === cat ? 'bg-black text-white border-black' : 'bg-white text-gray-400 border-gray-100 hover:border-black'}`}>{cat}</button>
                ))}
              </div>
              <div className="flex gap-2 flex-wrap font-black">
                {FANS.map(fan => (
                  <button key={fan} className="px-4 py-2 bg-white border border-gray-100 rounded-full text-[10px] md:text-xs font-black text-red-600 flex items-center gap-1.5 shadow-sm">🚩 {fan}</button>
                ))}
              </div>
              <div className="space-y-3 font-black">
                <input value={feed.title} onChange={(e) => setFeed({ ...feed, title: e.target.value })} placeholder="제목 또는 팬심 공유" className="w-full bg-gray-50 border border-black/5 p-4 rounded-xl text-sm md:text-lg font-black outline-none focus:border-black shadow-inner" />
                <input value={feed.link} onChange={(e) => setFeed({ ...feed, link: e.target.value })} placeholder="이미지/영상 링크" className="w-full bg-gray-50 border border-black/5 p-4 rounded-xl text-sm md:text-lg font-black outline-none focus:border-black placeholder-red-200 text-red-400 shadow-inner" />
                <textarea value={feed.desc} onChange={(e) => setFeed({ ...feed, desc: e.target.value })} placeholder="상세 내용을 기록하십시오" className="w-full bg-gray-50 border border-black/5 p-4 rounded-xl text-xs md:text-sm font-bold h-32 outline-none focus:border-black leading-relaxed shadow-inner" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button onClick={() => {if(!feed.title) return; setBeomToken(p=>p-10); alert("피드 등록 성공"); setFeed({title:'', link:'', desc:''});}} className="md:col-span-2 bg-black text-white py-5 rounded-2xl text-lg md:text-2xl font-black hover:bg-[#dc2626] transition-all active:scale-95 shadow-lg">
                  {L.post}
                </button>
                <button className="bg-white border-2 border-black text-black py-5 rounded-2xl text-lg md:text-xl font-black flex items-center justify-center gap-2 shadow hover:bg-gray-50 transition-all active:scale-95">
                  🚩 FAN ROOM
                </button>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border-l-[6px] border-[#dc2626]">
                <p className="text-gray-400 text-[10px] md:text-xs font-bold italic leading-none">{L.fanRoomDesc}</p>
              </div>
            </div>

            {/* 04. GOODS (RENAMED & REFINED) */}
            <SectionHeader title={L.market} desc={L.marketDesc} />
            <div className="bg-white p-6 rounded-[2rem] border-2 border-black/10 space-y-8 font-black">
                <div className="flex gap-4 border-b-2 border-gray-100 pb-2">
                    <button onClick={() => setGoodsMode('BUY')} className={`text-lg md:text-2xl font-black italic ${goodsMode === 'BUY' ? 'text-black border-b-4 border-black' : 'text-gray-300'}`}>BUY (굿즈 구매)</button>
                    <button onClick={() => setGoodsMode('SELL')} className={`text-lg md:text-2xl font-black italic ${goodsMode === 'SELL' ? 'text-black border-b-4 border-black' : 'text-gray-300'}`}>SELL (굿즈 등록)</button>
                </div>

                {goodsMode === 'BUY' ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 font-black">
                        {goods.map(g => (
                            <div key={g.id} className="bg-gray-50 p-4 rounded-2xl border flex flex-col items-center group shadow-sm transition-all hover:border-[#dc2626]">
                                <div className="w-full aspect-square bg-white rounded-xl mb-3 flex items-center justify-center shadow-inner overflow-hidden relative">
                                    <img src={g.img} className="w-20 h-20 md:w-32 md:h-32 object-contain group-hover:scale-110 transition-transform" alt="G" />
                                    <div className="absolute top-2 right-2 bg-black text-white text-[8px] px-2 py-0.5 rounded-full font-black">EMPIRE EXCLUSIVE</div>
                                </div>
                                <h4 className="text-[10px] md:text-sm font-black uppercase mb-1 truncate w-full text-center">{g.name}</h4>
                                <p className="text-[#dc2626] text-xs md:text-lg font-black mb-3">{g.price.toLocaleString()} BEOM</p>
                                <button className="w-full py-2 bg-black text-white rounded-lg text-[9px] font-black uppercase hover:bg-[#dc2626] transition-all">BUY NOW</button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-4 font-black">
                        <input value={sellItem.name} onChange={(e)=>setSellItem({...sellItem, name:e.target.value})} placeholder={L.itemName} className="w-full bg-gray-50 border-2 border-black/5 p-4 rounded-xl text-lg font-black outline-none focus:border-black" />
                        <input type="number" value={sellItem.price} onChange={(e)=>setSellItem({...sellItem, price:e.target.value})} placeholder={L.itemPrice + " (BEOM)"} className="w-full bg-gray-50 border-2 border-black/5 p-4 rounded-xl text-lg font-black outline-none focus:border-black" />
                        <button onClick={()=>{setGoods([{id:Date.now(), name:sellItem.name, price:Number(sellItem.price), img:"/beom-token.png", seller:"User"}, ...goods]); alert("굿즈가 성공적으로 등록되었습니다."); setGoodsMode('BUY');}} className="w-full bg-[#dc2626] text-white py-4 rounded-xl text-xl font-black shadow-lg"> {L.register} </button>
                    </div>
                )}
            </div>

            {/* 05. PARTNERSHIP */}
            <SectionHeader title={L.partnership} desc={L.partnershipDesc} />
            <div className="bg-black p-8 rounded-[2.5rem] border-[12px] border-[#dc2626] space-y-6 relative overflow-hidden font-black">
                <div className="absolute -top-40 -right-40 opacity-10 pointer-events-none grayscale">
                   <img src="/kedheon-character.png" className="w-[40rem]" alt="Bg" />
                </div>
                <h3 className="text-white text-2xl md:text-4xl font-black italic border-l-8 border-[#dc2626] pl-4 uppercase leading-none z-10 relative">GLOBAL PORTAL</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 z-10 relative">
                    <input value={partner.corp} onChange={(e)=>setPartner({...partner, corp: e.target.value})} placeholder={L.corpName} className="bg-white/10 border border-white/10 p-4 rounded-xl text-xs md:text-lg text-white outline-none focus:border-[#dc2626] transition-all" />
                    <input value={partner.manager} onChange={(e)=>setPartner({...partner, manager: e.target.value})} placeholder={L.manager} className="bg-white/10 border border-white/10 p-4 rounded-xl text-xs md:text-lg text-white outline-none focus:border-[#dc2626] transition-all" />
                    <input value={partner.email} onChange={(e)=>setPartner({...partner, email: e.target.value})} placeholder={L.email} className="bg-white/10 border border-white/10 p-4 rounded-xl text-xs md:text-lg text-white outline-none focus:border-[#dc2626] transition-all" />
                    <input value={partner.contact} onChange={(e)=>setPartner({...partner, contact: e.target.value})} placeholder={L.contact} className="bg-white/10 border border-white/10 p-4 rounded-xl text-xs md:text-lg text-white outline-none focus:border-[#dc2626] transition-all" />
                </div>
                <textarea value={partner.msg} onChange={(e)=>setPartner({...partner, msg: e.target.value})} placeholder={L.vision} className="w-full bg-white/10 border border-white/10 p-4 rounded-2xl text-xs md:text-lg text-white h-48 outline-none focus:border-[#dc2626] z-10 relative" />
                <button onClick={()=>alert("제안서가 성공적으로 제출되었습니다.")} className="w-full bg-[#dc2626] text-white py-4 rounded-full text-sm md:text-xl font-black hover:bg-white hover:text-[#dc2626] transition-all shadow-xl uppercase z-10 relative">
                  {L.submit}
                </button>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="fixed bottom-4 left-4 right-4 max-w-4xl mx-auto bg-white border-2 border-black p-1.5 rounded-2xl flex justify-between gap-1.5 z-[1000] shadow-2xl">
        {['KEDHEON', 'CIVIL', 'NEXUS', 'VENDOR'].map(app => (
          <button key={app} className={`flex-1 py-3.5 rounded-xl text-[10px] md:text-sm transition-all font-black text-center ${app === 'KEDHEON' ? 'bg-black text-white shadow-md' : 'text-gray-300'}`}>
            {app}
          </button>
        ))}
      </footer>
    </div>
  );
}
