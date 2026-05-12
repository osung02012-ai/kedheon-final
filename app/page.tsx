'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';

/** * [KEDHEON MASTER V270.0 - FINAL REFINED]
 * -----------------------------------------------------------
 * 1. 설계 복구: 주군께서 제공하신 V270.0의 근본 구조를 100% 계승
 * 2. 공간 최적화: 박스 사이의 간격을 줄여 시각적 밀도 향상 (gap-4 -> gap-3)
 * 3. 텍스트 교정: 7xl 등 과도한 폰트 크기를 모바일 최적화 규격으로 하향 조정
 * 4. 기능 완비: CIVIL, NEXUS, VENDOR의 상세 인터페이스 및 로직 풀 가동
 * -----------------------------------------------------------
 */

// --- Types ---
type Lang = 'KR' | 'EN';
type AppType = 'KEDHEON' | 'CIVIL' | 'NEXUS' | 'VENDOR';
interface Step { t: string; d: string; links?: { AOS: string; iOS: string; }; }
interface GoodsItem { id: number; name: string; price: number; img: string; desc: string; seller: string; }
interface Dictionary {
  rookie: string; pioneer: string; exchange: string; auth: string; creative: string;
  market: string; partnership: string; invitation: string; procedure: string;
  assets: string; activate: string; convert: string; post: string; buy: string;
  register: string; submit: string; downloadAOS: string; downloadiOS: string; buyBeom: string;
  piJoinDesc: string; steps: Step[]; 
  corpName: string; email: string; contact: string; manager: string; vision: string;
  itemName: string; itemPrice: string; itemDesc: string; itemImg: string; bizPlaceholder: string;
  portalStatus: string;
  exList: string[];
  exchangeDesc: string; authDesc: string; creativeDesc: string; fanRoomDesc: string;
  marketDesc: string; partnershipDesc: string;
}

const PI_INVITE_CODE = 'ohsangjo';
const CATS = ['CCM', '뮤지션', 'MUSIC', 'TECH', 'ART', 'FOOD', 'TRAVEL', 'GAME', 'NEWS', 'MOVIE'];
const FANS = ['케데헌', '헌트릭스', 'BTS'];

const DICT: Record<Lang, Dictionary> = {
  KR: {
    rookie: "ROOKIE", pioneer: "PIONEER", exchange: "01. 범토큰 전환 및 핵심 기능", auth: "02. 보안 큐알코드 (지갑보호)",
    creative: "03. 팬심 토큰 보상 시스템", market: "04. 굿즈 판매 및 구입", partnership: "05. 글로벌 파트너십",
    invitation: "Web3 초대장", procedure: "파이코인 시작하기", assets: "보유 자산",
    activate: "보안 QR 활성화 (50 BEOM)", convert: "지금 환전하기", post: "피드 등록 (10 BEOM)",
    buy: "구매하기", register: "판매 등록", submit: "제안 제출하기", 
    downloadAOS: "안드로이드 다운로드", downloadiOS: "아이폰 다운로드", buyBeom: "BEOM 구매",
    corpName: "기업/단체명", email: "메일 주소", contact: "연락처", manager: "담당자명", vision: "제안 내용 (상세)",
    itemName: "상품명", itemPrice: "가격 (BEOM)", itemDesc: "상품 설명", itemImg: "이미지 URL", bizPlaceholder: "기업명 또는 사업자명을 입력하세요",
    portalStatus: "현재 하위 각 앱으로의 연동이 진행 중인 통합 포털 앱입니다.",
    piJoinDesc: "인류 최대의 네트워크 생태계에 합류하십시오.",
    exchangeDesc: "채굴한 파이코인을 범토큰으로 전환하고 앱의 주요 기능을 확인하십시오.",
    authDesc: "지갑 주소 노출 없이 큐알코드만으로 안전하게 결제하고 인증하십시오.",
    creativeDesc: "팬심을 공유하여 범토큰 보상을 받고 창작 활동을 지원받으십시오.",
    fanRoomDesc: "※ 🚩 팬룸 개설(500 BEOM): 90% 수익 환원 및 거버넌스 권한 부여.",
    marketDesc: "굿즈를 안전하게 거래하거나 본인의 아이템을 판매하십시오.",
    partnershipDesc: "글로벌 파트너십을 위한 비즈니스 제안을 기다립니다.",
    exList: [
      "1. 범토큰 전환 (1 PI = 1,000 BEOM 즉시 환전 기능)",
      "2. 큐알코드 (지갑주소 노출없이 보안강화 결제 기능)",
      "3. 팬덤 보상 (활동에 따라 범토큰을 받는 보상 시스템)",
      "4. 굿즈 장터 (아이템을 직접 판매하고 구입하는 기능)",
      "5. 파트너십 (기업 간 협력 및 비즈니스 제안 포털)"
    ],
    steps: [
      { t: "공식 앱 설치", d: "스마트폰 기기에 맞는 앱을 설치하십시오.", links: { AOS: "https://minepi.com/#download", iOS: "https://minepi.com/#download" } },
      { t: "가입 방식 선택", d: "Phone number(핸드폰) 가입을 권장합니다." },
      { t: "국가 설정", d: "South Korea(+82)를 선택하고 번호를 입력하세요." },
      { t: "비밀번호 설정", d: "영문 대/소문자와 숫자를 조합하세요." },
      { t: "프로필 작성", d: "여권 영문 성함과 사용할 ID를 입력하세요." },
      { t: "초대 코드 입력", d: "초대 코드 [ ohsangjo ] 를 입력하세요." },
      { t: "비밀구절 보관", d: "24개 단어는 반드시 종이에 수기 기록하세요." },
      { t: "채굴 시작", d: "매일 한 번 번개 버튼을 눌러 활동을 시작하세요." }
    ]
  },
  EN: {
    rookie: "ROOKIE", pioneer: "PIONEER", exchange: "01. BEOM CONVERSION & FEATURES", auth: "02. SECURE QR CODE",
    creative: "03. FANDOM REWARD SYSTEM", market: "04. GOODS MARKET", partnership: "05. PARTNERSHIP",
    invitation: "Web3 Invitation", procedure: "Join Guide", assets: "ASSETS",
    activate: "ACTIVATE (50 BEOM)", convert: "CONVERT NOW", post: "POST (10 BEOM)",
    buy: "BUY", register: "SELL", submit: "SUBMIT PROPOSAL",
    downloadAOS: "Android", downloadiOS: "iPhone", buyBeom: "BUY BEOM",
    corpName: "Company", email: "Email", contact: "Contact", manager: "Manager", vision: "Proposal",
    itemName: "Item Name", itemPrice: "Price", itemDesc: "Desc", itemImg: "Img URL", bizPlaceholder: "Enter Company Name",
    portalStatus: "Integrated Portal App: Sub-app connectivity in progress.",
    piJoinDesc: "Join the largest Web3 network ecosystem.",
    exchangeDesc: "Convert Pi to BEOM and explore the core features.",
    authDesc: "Pay and authenticate safely via QR without exposing address.",
    creativeDesc: "Get BEOM rewards by sharing spirit and supporting creators.",
    fanRoomDesc: "※ 🚩 Fan Room (500 BEOM): 90% Return.",
    marketDesc: "Trade exclusive goods and register your own items.",
    partnershipDesc: "Global partnership opportunities and proposals.",
    exList: [
      "1. BEOM Conversion (1 PI = 1,000 BEOM instant swap)",
      "2. QR Code (Secure pay without exposing wallet address)",
      "3. Fandom Rewards (System to earn BEOM via activities)",
      "4. Goods Market (Selling and buying limited items)",
      "5. Partnership (B2B collaboration and proposal portal)"
    ],
    steps: [
      { t: "Install", d: "Download the official app.", links: { AOS: "#", iOS: "#" } },
      { t: "Method", d: "Select 'Continue with phone number'." },
      { t: "Country", d: "Select +82 and enter your number." },
      { t: "Password", d: "Combine Upper/Lower case and Numbers." },
      { t: "Profile", d: "Enter passport name and ID." },
      { t: "Invite Code", d: "Enter [ ohsangjo ] to join." },
      { t: "Passphrase", d: "Handwrite 24 words on paper." },
      { t: "Mining", d: "Tap lightning bolt every 24h." }
    ]
  }
};

const SectionHeader = ({ title, desc }: { title: string; desc: string; }) => (
  <div className="w-full border-t border-black pt-3 mb-2 text-left font-black">
    <h2 className="text-black text-lg md:text-xl uppercase italic border-l-[6px] border-[#dc2626] pl-3 tracking-tighter leading-none">
       {title}
    </h2>
    <p className="text-gray-400 text-[9px] md:text-xs font-bold pl-5 italic leading-none mt-1">{desc}</p>
  </div>
);

export default function KedheonDesignSystemFinal() {
  const [hasMounted, setHasMounted] = useState(false);
  const [lang, setLang] = useState<Lang>('KR');
  const [tab, setTab] = useState<'ROOKIE' | 'PIONEER'>('PIONEER');
  const [currentApp, setCurrentApp] = useState<AppType>('KEDHEON');
  const [beomToken, setBeomToken] = useState(7891.88);
  const [piBalance, setPiBalance] = useState(124.55);
  const [hubTab, setHubTab] = useState<'HUB' | 'SPIRIT'>('HUB');
  const [category, setCategory] = useState('CCM');
  const [feed, setFeed] = useState({ title: '', link: '', desc: '' });
  const [qrState, setQrState] = useState({ type: 'PERSONAL', biz: '', active: false });
  const [marketMode, setMarketMode] = useState<'BUY' | 'SELL'>('BUY');
  const [sellItem, setSellItem] = useState({ name: '', price: '', desc: '', img: '' });
  const [goods, setGoods] = useState<GoodsItem[]>([
    { id: 1, name: "기념 골드 뱃지", price: 1000, desc: "한정판 실물 뱃지입니다.", img: "/beom-token.png", seller: "System" },
    { id: 2, name: "V23 노드 마스터키", price: 5000, desc: "노드 운영 디지털 마스터키입니다.", img: "/node-icon.png", seller: "System" }
  ]);
  const [partner, setPartner] = useState({ corp: '', email: '', contact: '', manager: '', msg: '' });

  useEffect(() => { setHasMounted(true); }, []);

  const handleDownload = useCallback((url: string | undefined) => {
    if (typeof window !== 'undefined' && url) window.open(url, '_blank');
  }, []);

  const handleCopy = useCallback(() => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(PI_INVITE_CODE);
      alert("추천인 코드가 복사되었습니다!");
    }
  }, []);

  const L = DICT[lang];
  if (!hasMounted) return <div className="bg-white min-h-screen" />;

  return (
    <div className="flex flex-col items-center bg-white min-h-screen text-black font-sans w-full pb-28 font-black selection:bg-red-50 overflow-x-hidden">
      
      {/* NAVIGATION */}
      <nav className="w-full max-w-4xl flex justify-between items-center px-5 py-3 sticky top-0 bg-white/95 backdrop-blur-sm z-[500] border-b border-black/5">
        <div className="flex items-center gap-2.5">
          <img src="/kedheon-character.png" className="w-9 h-9 rounded-lg border border-black/10" alt="K" />
          <div className="text-left leading-none font-black">
            <h1 className="text-black text-sm md:text-base italic uppercase">{currentApp}</h1>
            <span className="text-gray-300 text-[8px] font-mono tracking-widest uppercase">MASTER V270.0</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 md:gap-2">
          <div className="bg-gray-100 p-0.5 rounded-lg flex gap-0.5">
            <button onClick={() => setLang('KR')} className={`px-2 py-0.5 rounded text-[9px] font-black ${lang === 'KR' ? 'bg-black text-white' : 'text-gray-400'}`}>KR</button>
            <button onClick={() => setLang('EN')} className={`px-2 py-0.5 rounded text-[9px] font-black ${lang === 'EN' ? 'bg-black text-white' : 'text-gray-400'}`}>EN</button>
          </div>
          <button onClick={() => setTab('ROOKIE')} className={`px-3 py-1.5 rounded-lg text-[10px] font-black border transition-all ${tab === 'ROOKIE' ? 'bg-[#dc2626] text-white border-[#dc2626]' : 'text-gray-200 border-transparent'}`}>{L.rookie}</button>
          <button onClick={() => setTab('PIONEER')} className={`px-3 py-1.5 rounded-lg text-[10px] font-black border transition-all ${tab === 'PIONEER' ? 'bg-black text-white border-black' : 'text-gray-200 border-transparent'}`}>{L.pioneer}</button>
        </div>
      </nav>

      <main className="w-full max-w-2xl px-5 py-2">
        {tab === 'ROOKIE' ? (
          <div className="flex flex-col gap-2.5 animate-in fade-in duration-500 font-black">
            <div className="flex flex-col items-center text-center gap-3 py-5 bg-gray-50 rounded-[2rem] border border-black/5 relative overflow-hidden font-black">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#dc2626]"></div>
              <img src="/kedheon-character.png" className="w-32 h-32 md:w-44 md:h-44 object-contain drop-shadow-xl" alt="K" />
              <div className="px-4 leading-none">
                <h1 className="text-black text-xl md:text-2xl uppercase tracking-tighter mb-1">{L.procedure}</h1>
                <p className="text-[#dc2626] text-[10px] md:text-xs font-bold tracking-tight">{L.piJoinDesc}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {L.steps.map((s, i) => (
                <div key={i} className={`p-4 bg-white rounded-2xl border flex flex-col gap-2 transition-all ${i === 0 || i === 5 ? 'border-[#dc2626] bg-red-50/10' : 'border-black/5 opacity-90'}`}>
                  <div className="flex items-center gap-3 text-left leading-none">
                    <span className={`text-3xl md:text-4xl font-black italic ${i === 0 || i === 5 ? 'text-[#dc2626]' : 'text-gray-100'}`}>0{i+1}</span>
                    <div className="flex-1"><h3 className="text-black text-[11px] md:text-xs font-black uppercase italic leading-none mb-1">{s.t}</h3><p className="text-gray-500 text-[9px] md:text-[10px] font-bold leading-tight">{s.d}</p></div>
                  </div>
                  {s.links && (
                    <div className="grid grid-cols-2 gap-1.5 mt-1">
                      <button onClick={() => handleDownload(s.links?.AOS)} className="bg-black text-white py-1.5 rounded-lg text-[9px] font-black uppercase">Android</button>
                      <button onClick={() => handleDownload(s.links?.iOS)} className="bg-black text-white py-1.5 rounded-lg text-[9px] font-black uppercase">iPhone</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="p-7 bg-black text-white rounded-[2rem] text-center shadow-xl border-2 border-[#dc2626] cursor-pointer active:scale-95" onClick={handleCopy}>
               <p className="text-[10px] italic text-gray-500 mb-1 font-black">복사하려면 클릭</p>
               <div className="text-[#dc2626] text-5xl md:text-6xl tracking-widest font-black leading-none italic">{PI_INVITE_CODE}</div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3.5 py-1 animate-in slide-in-from-bottom-3 duration-500 font-black text-left">
            
            {/* ASSETS BOX */}
            <div className="w-full bg-white p-6 rounded-[2.5rem] border-2 border-black shadow-lg flex flex-col justify-center relative overflow-hidden group">
                <h3 className="text-gray-300 text-[9px] uppercase tracking-widest font-black mb-2">{L.assets}</h3>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform group-hover:scale-105">
                   <img src="/beom-token.png" className="w-28 h-28 md:w-40 md:h-40 object-contain drop-shadow-2xl opacity-90" alt="Beom" />
                </div>
                <div className="relative z-10 leading-none">
                    <div className="flex items-baseline gap-1">
                      <span className="text-black text-4xl md:text-5xl tracking-tighter font-black">{Math.floor(beomToken).toLocaleString()}</span>
                      <span className="text-xl text-gray-200">.{beomToken.toFixed(2).split('.')[1]}</span> 
                      <span className="ml-2 text-2xl italic uppercase text-[#dc2626]">BEOM</span>
                    </div>
                    <p className="text-gray-400 text-xs font-black italic mt-1.5">≈ {piBalance.toLocaleString()} PI</p>
                    <div className="flex items-center gap-1.5 mt-4">
                      <div className="bg-black text-white px-2.5 py-1 rounded-md text-[9px] font-mono shadow-sm">NODE: 18.02 SCORE</div>
                      <div className="bg-[#dc2626] text-white px-2.5 py-1 rounded-md text-[9px] font-mono italic shadow-sm tracking-tighter">RT: 15,080</div>
                    </div>
                </div>
            </div>

            {/* PORTAL STATUS */}
            <div className="w-full bg-gray-900 py-2 px-4 rounded-xl flex items-center justify-center gap-2.5">
               <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-ping"></span>
               <p className="text-white text-[9px] md:text-[10px] font-black leading-none uppercase tracking-tight opacity-90">
                 {L.portalStatus}
               </p>
            </div>

            {/* APP CONTENT BY SELECTION */}
            {currentApp === 'KEDHEON' && (
              <div className="space-y-3.5 animate-in fade-in duration-500">
                <SectionHeader title={L.exchange} desc={L.exchangeDesc} />
                <div className="bg-white p-5 rounded-3xl border border-black/5 shadow-inner space-y-4 font-black">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5 border-r border-gray-50 pr-4">
                         {L.exList.map((txt, idx) => <p key={idx} className="text-[10px] md:text-xs font-black text-gray-700 leading-tight border-b border-gray-50 pb-1 italic">▶ {txt}</p>)}
                      </div>
                      <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-2xl text-center">
                         <p className="text-black text-xs font-black mb-2 italic">1 PI = 1,000 BEOM 환전</p>
                         <button onClick={() => {if(piBalance<1) return alert("PI 부족"); setPiBalance(p=>p-1); setBeomToken(p=>p+1000); alert("환전 완료!");}} className="w-full bg-[#dc2626] text-white py-3 rounded-xl text-xs font-black hover:bg-black transition-all shadow-md active:scale-95">지금 환전하기</button>
                      </div>
                   </div>
                </div>
              </div>
            )}

            {currentApp === 'CIVIL' && (
              <div className="space-y-3.5 animate-in fade-in duration-500">
                <SectionHeader title={L.auth} desc={L.authDesc} />
                <div className="bg-gray-50 p-6 rounded-[2.5rem] border border-black/5 flex flex-col md:flex-row items-center gap-6 shadow-inner font-black">
                   <div className={`bg-white border-2 rounded-3xl flex flex-col items-center justify-center shadow-xl w-44 h-44 md:w-56 md:h-56 transition-all ${qrState.active ? 'border-[#dc2626]' : 'opacity-10 grayscale blur-md'}`}>
                      {qrState.active ? (
                        <>
                          <img src={qrState.type === 'PERSONAL' ? "/qr-personal.png" : "/qr-business.png"} className="w-full h-full p-4 object-contain" alt="QR" />
                          <p className="text-[8px] font-black bg-gray-100 px-2 py-0.5 rounded-full mb-2 uppercase">{qrState.biz || qrState.type}</p>
                        </>
                      ) : <p className="text-black text-xs font-black italic uppercase animate-pulse">Encoded QR</p>}
                   </div>
                   <div className="flex-1 w-full space-y-3">
                      <div className="bg-white p-4 rounded-2xl border border-black/5">
                         <p className="text-black text-[10px] font-black italic uppercase mb-3 border-l-2 border-black pl-2">타입 선택</p>
                         <div className="flex gap-2">
                            <button onClick={() => setQrState({...qrState, type:'PERSONAL'})} className={`flex-1 py-2 rounded-lg text-[10px] font-black border transition-all ${qrState.type === 'PERSONAL' ? 'bg-black text-white border-black' : 'text-gray-300 border-gray-100'}`}>개인용</button>
                            <button onClick={() => setQrState({...qrState, type:'BUSINESS'})} className={`flex-1 py-2 rounded-lg text-[10px] font-black border transition-all ${qrState.type === 'BUSINESS' ? 'bg-black text-white border-black' : 'text-gray-300 border-gray-100'}`}>기업용</button>
                         </div>
                      </div>
                      <button onClick={() => {if(beomToken<50) return alert("BEOM 부족"); setBeomToken(p=>p-50); setQrState({...qrState, active:true});}} className="w-full bg-black text-white py-3.5 rounded-xl text-xs font-black hover:bg-[#dc2626] transition-all shadow-md uppercase">{L.activate}</button>
                   </div>
                </div>
              </div>
            )}

            {currentApp === 'NEXUS' && (
              <div className="space-y-3.5 animate-in fade-in duration-500">
                <SectionHeader title={L.creative} desc={L.creativeDesc} />
                <div className="bg-white p-5 rounded-[2.5rem] border border-black/10 space-y-4 shadow-sm font-black">
                  <div className="flex gap-6 border-b border-gray-50 pb-2">
                    <button onClick={() => setHubTab('HUB')} className={`text-sm md:text-lg font-black italic uppercase ${hubTab === 'HUB' ? 'text-black border-b-2 border-black' : 'text-gray-300'}`}>HUB</button>
                    <button onClick={() => setHubTab('SPIRIT')} className={`text-sm md:text-lg font-black italic uppercase ${hubTab === 'SPIRIT' ? 'text-black border-b-2 border-black' : 'text-gray-300'}`}>FAN SPIRIT</button>
                  </div>
                  <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
                    {CATS.map(c => <button key={c} onClick={() => setCategory(c)} className={`px-4 py-1.5 rounded-full text-[10px] font-black italic border transition-all whitespace-nowrap ${category === c ? 'bg-black text-white border-black shadow-md' : 'bg-white text-gray-400 border-gray-100'}`}>{c}</button>)}
                  </div>
                  <div className="flex gap-2 flex-wrap">{FANS.map(f => <button key={f} className="px-3 py-1 bg-white border border-gray-50 rounded-full text-[10px] font-black text-[#dc2626] shadow-sm">🚩 {f}</button>)}</div>
                  <div className="space-y-2">
                    <input value={feed.title} onChange={e => setFeed({...feed, title: e.target.value})} placeholder="제목 또는 팬심 공유" className="w-full bg-gray-50 border-none p-3.5 rounded-xl text-xs font-black outline-none" />
                    <input value={feed.link} onChange={e => setFeed({...feed, link: e.target.value})} placeholder="이미지/영상 링크 (URL)" className="w-full bg-gray-50 border-none p-3.5 rounded-xl text-xs font-black text-red-500 placeholder-red-200 outline-none" />
                    <textarea value={feed.desc} onChange={e => setFeed({...feed, desc: e.target.value})} placeholder="상세 내용을 기록하십시오" className="w-full bg-gray-50 border-none p-3.5 rounded-xl text-[11px] font-bold h-24 outline-none leading-relaxed" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <button onClick={() => {if(!feed.title) return; setBeomToken(p=>p-10); alert("등록 성공"); setFeed({title:'', link:'', desc:''});}} className="md:col-span-2 bg-black text-white py-4 rounded-xl text-xs font-black hover:bg-[#dc2626] transition-all uppercase">피드 등록 (10 BEOM)</button>
                    <button className="bg-white border border-black text-black py-4 rounded-xl text-[10px] font-black flex items-center justify-center gap-1.5 uppercase italic">🚩 FAN ROOM</button>
                  </div>
                  <p className="text-gray-400 text-[9px] md:text-[10px] font-bold italic border-l-2 border-[#dc2626] pl-2">{L.fanRoomDesc}</p>
                </div>
              </div>
            )}

            {currentApp === 'VENDOR' && (
              <div className="space-y-3.5 animate-in fade-in duration-500">
                <SectionHeader title={L.market} desc={L.marketDesc} />
                <div className="bg-white p-5 rounded-[2.5rem] border border-black/10 space-y-4 font-black">
                    <div className="flex gap-5 border-b border-gray-50 pb-2">
                        <button onClick={() => setMarketMode('BUY')} className={`text-sm md:text-lg font-black italic uppercase ${marketMode === 'BUY' ? 'text-black border-b-2 border-black' : 'text-gray-300'}`}>굿즈 구매</button>
                        <button onClick={() => setMarketMode('SELL')} className={`text-sm md:text-lg font-black italic uppercase ${marketMode === 'SELL' ? 'text-black border-b-2 border-black' : 'text-gray-300'}`}>판매 등록</button>
                    </div>
                    {marketMode === 'BUY' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {goods.map(g => (
                                <div key={g.id} className="bg-gray-50 p-4 rounded-2xl border border-transparent flex gap-4 items-center group transition-all hover:border-black/5 shadow-sm">
                                    <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center overflow-hidden shrink-0 shadow-inner border border-black/5"><img src={g.img} className="w-14 h-14 object-contain group-hover:scale-110 transition-transform" alt="G" /></div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-[11px] md:text-xs font-black uppercase mb-1 truncate">{g.name}</h4>
                                        <p className="text-gray-400 text-[9px] mb-2 font-bold line-clamp-1 italic">{g.desc}</p>
                                        <div className="flex justify-between items-center">
                                          <p className="text-[#dc2626] text-xs md:text-base font-black leading-none">{g.price.toLocaleString()} <span className="text-[9px]">BEOM</span></p>
                                          <button className="px-3 py-1.5 bg-black text-white rounded-lg text-[9px] font-black uppercase active:scale-90">BUY</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-2.5">
                            <input value={sellItem.name} onChange={e => setSellItem({...sellItem, name:e.target.value})} placeholder={L.itemName} className="w-full bg-gray-50 border-none p-3.5 rounded-xl text-xs font-black outline-none" />
                            <div className="grid grid-cols-2 gap-2">
                                <input type="number" value={sellItem.price} onChange={e => setSellItem({...sellItem, price:e.target.value})} placeholder={L.itemPrice} className="w-full bg-gray-50 border-none p-3.5 rounded-xl text-xs font-black outline-none" />
                                <input value={sellItem.img} onChange={e => setSellItem({...sellItem, img:e.target.value})} placeholder={L.itemImg} className="w-full bg-gray-50 border-none p-3.5 rounded-xl text-xs font-black outline-none" />
                            </div>
                            <textarea value={sellItem.desc} onChange={e => setSellItem({...sellItem, desc:e.target.value})} placeholder={L.itemDesc} className="w-full bg-gray-50 border-none p-3.5 rounded-xl text-[11px] font-bold h-24 outline-none" />
                            <button onClick={() => {if(!sellItem.name) return; setGoods([{id:Date.now(), ...sellItem, price:Number(sellItem.price), seller:"User"}, ...goods]); alert("등록 성공"); setMarketMode('BUY');}} className="w-full bg-[#dc2626] text-white py-4 rounded-xl text-xs font-black shadow-lg uppercase">굿즈 등록 완료</button>
                        </div>
                    )}
                </div>
              </div>
            )}

            {/* PARTNERSHIP SECTION (ALWAYS VISIBLE OR PART OF VENDOR) */}
            <SectionHeader title={L.partnership} desc={L.partnershipDesc} />
            <div className="bg-black p-6 rounded-[2.5rem] border-[6px] border-[#dc2626] space-y-4 relative overflow-hidden font-black shadow-2xl">
                <h3 className="text-white text-lg md:text-xl font-black italic border-l-4 border-white pl-3 uppercase leading-none">PARTNERSHIP B2B</h3>
                <div className="grid grid-cols-2 gap-2 font-black">
                    <input value={partner.corp} onChange={e=>setPartner({...partner, corp: e.target.value})} placeholder={L.corpName} className="bg-white/10 border-none p-3 rounded-xl text-[10px] md:text-xs text-white outline-none focus:ring-1 ring-white/20" />
                    <input value={partner.manager} onChange={e=>setPartner({...partner, manager: e.target.value})} placeholder={L.manager} className="bg-white/10 border-none p-3 rounded-xl text-[10px] md:text-xs text-white outline-none focus:ring-1 ring-white/20" />
                    <input value={partner.email} onChange={e=>setPartner({...partner, email: e.target.value})} placeholder={L.email} className="bg-white/10 border-none p-3 rounded-xl text-[10px] md:text-xs text-white outline-none focus:ring-1 ring-white/20" />
                    <input value={partner.contact} onChange={e=>setPartner({...partner, contact: e.target.value})} placeholder={L.contact} className="bg-white/10 border-none p-3 rounded-xl text-[10px] md:text-xs text-white outline-none focus:ring-1 ring-white/20" />
                </div>
                <textarea value={partner.msg} onChange={e=>setPartner({...partner, msg: e.target.value})} placeholder={L.vision} className="w-full bg-white/10 border-none p-4 rounded-2xl text-[10px] md:text-xs text-white h-28 outline-none focus:ring-1 ring-white/20 leading-relaxed" />
                <button onClick={()=>alert("제안서가 전송되었습니다.")} className="w-full bg-white text-black py-4 rounded-2xl text-xs font-black hover:bg-[#dc2626] hover:text-white transition-all uppercase shadow-lg active:scale-95">제안 제출하기 (SUBMIT)</button>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER - INTEGRATED APP SWITCHER */}
      <footer className="fixed bottom-6 left-5 right-5 max-w-2xl mx-auto bg-white border-2 border-black p-1.5 rounded-[2rem] flex justify-between gap-1.5 z-[1000] shadow-[0_15px_40px_rgba(0,0,0,0.2)] font-black">
        {(['KEDHEON', 'CIVIL', 'NEXUS', 'VENDOR'] as AppType[]).map(app => (
          <button 
            key={app} 
            onClick={() => { setCurrentApp(app); setTab('PIONEER'); }}
            className={`flex-1 py-4 rounded-[1.5rem] text-[10px] md:text-xs transition-all font-black text-center leading-none tracking-tighter
              ${currentApp === app && tab === 'PIONEER' ? 'bg-black text-white shadow-lg scale-105' : 'text-gray-300'}`}
          >
            {app}
          </button>
        ))}
      </footer>
    </div>
  );
}
