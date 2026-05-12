'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';

/** * [KEDHEON MASTER V220.0 - CLEAN PIONEER]
 * -----------------------------------------------------------
 * 1. 금기어 삭제: "제국", "제국 한정판", "Empire" 관련 모든 표현 전면 삭제
 * 2. 01. 기능: 주군께서 명령하신 1~5번 항목 토씨 하나 틀리지 않고 그대로 적용
 * 3. 02. QR보안: 지갑 주소 노출 방지 목적 명시 및 [개인용 / 기업용] 선택 복구
 * 4. 03. 팬덤: CCM, 뮤지션 카테고리 최상단 배치 및 스크린샷 UI 구현
 * 5. 04. 굿즈: 굿즈 판매 및 구입으로 명칭 통일, 상세 등록 시스템 (이름/가격/설명/이미지)
 * 6. 05. 파트너십: 상세 비즈니스 제안 양식 완비
 * -----------------------------------------------------------
 */

type Lang = 'KR' | 'EN';
interface Step { t: string; d: string; links?: { AOS: string; iOS: string; }; }
interface GoodsItem { id: number; name: string; price: number; img: string; desc: string; seller: string; }
interface Dictionary {
  rookie: string; pioneer: string; exchange: string; auth: string; creative: string;
  market: string; partnership: string; invitation: string; procedure: string;
  assets: string; activate: string; convert: string; post: string; buy: string;
  register: string; submit: string; downloadAOS: string; downloadiOS: string; buyBeom: string;
  piJoinDesc: string; steps: Step[]; 
  corpName: string; email: string; contact: string; manager: string; vision: string;
  itemName: string; itemPrice: string; itemDesc: string; itemImg: string;
  exList: string[];
}

const PI_INVITE_CODE = 'ohsangjo';
const CATS = ['CCM', '뮤지션', 'MUSIC', 'TECH', 'ART', 'FOOD', 'TRAVEL', 'GAME', 'NEWS', 'MOVIE'];
const FANS = ['케데헌', '헌트릭스', 'BTS'];

const DICT: Record<Lang, Dictionary> = {
  KR: {
    rookie: "가입 가이드", pioneer: "파이오니어", exchange: "01. 범토큰 전환 및 핵심 기능", auth: "02. 보안 큐알코드 (지갑보호)",
    creative: "03. 크리에이티브 & 팬", market: "04. 굿즈 판매 및 구입", partnership: "05. 글로벌 파트너십",
    invitation: "Web3 초대장", procedure: "파이코인 시작하기", assets: "보유 자산",
    activate: "보안 QR 활성화 (50 BEOM)", convert: "1 PI 환전 실행", post: "피드 등록 (10 BEOM)",
    buy: "구매하기", register: "판매 등록", submit: "제안 제출", 
    downloadAOS: "안드로이드 다운로드", downloadiOS: "아이폰 다운로드", buyBeom: "BEOM 구매",
    corpName: "기업/단체명", email: "메일 주소", contact: "연락처", manager: "담당자 이름", vision: "제안 내용",
    itemName: "굿즈 이름", itemPrice: "판매 가격", itemDesc: "상세 설명", itemImg: "이미지 링크",
    piJoinDesc: "인류 최대의 네트워크 생태계에 합류하십시오.",
    exList: [
      "1. 범토큰 전환 (1 PI = 1,000 BEOM 즉시 환전)",
      "2. 큐알코드 (지갑주소 노출없이 보안강화 결제)",
      "3. 팬덤으로 범토큰 받기 등 활동 보상 시스템",
      "4. 굿즈 판매 및 구입 (한정판 굿즈 장터)",
      "5. 글로벌 파트너십 (비즈니스 협력 및 제안)"
    ],
    steps: [
      { t: "공식 앱 설치", d: "기기에 맞는 앱을 설치하세요.", links: { AOS: "https://minepi.com/#download", iOS: "https://minepi.com/#download" } },
      { t: "가입 방식 선택", d: "Phone number 가입을 권장합니다." },
      { t: "국가 설정", d: "South Korea(+82)를 선택하세요." },
      { t: "비밀번호 설정", d: "영문 대/소문자와 숫자를 조합하세요." },
      { t: "프로필 작성", d: "여권 영문 성함과 ID를 입력하세요." },
      { t: "초대 코드 입력", d: "초대 코드 [ ohsangjo ] 를 입력하세요." },
      { t: "비밀구절 보관", d: "24개 단어를 반드시 종이에 수기 기록하세요." },
      { t: "채굴 시작", d: "매일 번개 버튼을 눌러 활동을 시작하세요." }
    ]
  },
  EN: {
    rookie: "GUIDE", pioneer: "PIONEER", exchange: "01. KEY FEATURES", auth: "02. SECURE QR CODE",
    creative: "03. CREATIVE & FAN", market: "04. GOODS MARKET", partnership: "05. PARTNERSHIP",
    invitation: "Web3 Invitation", procedure: "How to Join", assets: "ASSETS",
    activate: "ACTIVATE QR (50 BEOM)", convert: "CONVERT 1 PI", post: "POST (10 BEOM)",
    buy: "BUY", register: "SELL", submit: "SUBMIT",
    downloadAOS: "Android", downloadiOS: "iPhone", buyBeom: "BUY BEOM",
    corpName: "Company", email: "Email", contact: "Contact", manager: "Manager", vision: "Proposal",
    itemName: "Goods Name", itemPrice: "Price", itemDesc: "Desc", itemImg: "Img URL",
    piJoinDesc: "Join the largest Web3 network ecosystem.",
    exList: [
      "1. BEOM Token Conversion (1 PI = 1,000 BEOM)",
      "2. QR Code (Secure pay without exposing address)",
      "3. Receive BEOM via Fandom activities",
      "4. Goods Selling and Buying",
      "5. Global Partnership Portal"
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

const SectionHeader = ({ title }: { title: string; }) => (
  <div className="w-full border-t-2 border-[#dc2626] pt-3 mb-4 text-left font-black">
    <h2 className="text-black text-xl md:text-2xl uppercase italic border-l-[10px] border-black pl-3 tracking-tighter leading-none">
       {title}
    </h2>
  </div>
);

export default function KedheonMasterV220() {
  const [hasMounted, setHasMounted] = useState(false);
  const [lang, setLang] = useState<Lang>('KR');
  const [tab, setTab] = useState<'ROOKIE' | 'PIONEER'>('PIONEER');
  
  const [beomToken, setBeomToken] = useState(7891.88);
  const [piBalance, setPiBalance] = useState(124.55);
  const [hubTab, setHubTab] = useState<'HUB' | 'SPIRIT'>('HUB');
  const [category, setCategory] = useState('CCM');
  const [feed, setFeed] = useState({ title: '', link: '', desc: '' });
  const [qrState, setQrState] = useState({ type: 'PERSONAL', active: false });
  const [marketMode, setMarketMode] = useState<'BUY' | 'SELL'>('BUY');
  const [sellItem, setSellItem] = useState({ name: '', price: '', desc: '', img: '' });
  const [goods, setGoods] = useState<GoodsItem[]>([
    { id: 1, name: "기념 골드 뱃지", price: 1000, desc: "한정판 실물 뱃지입니다.", img: "/beom-token.png", seller: "System" },
    { id: 2, name: "V23 노드 마스터키", price: 5000, desc: "노드 운영용 디지털 키입니다.", img: "/node-icon.png", seller: "System" }
  ]);
  const [partner, setPartner] = useState({ corp: '', email: '', contact: '', manager: '', msg: '' });

  const L = DICT[lang];

  useEffect(() => { setHasMounted(true); }, []);

  const handleDownload = useCallback((url: string) => { if (typeof window !== 'undefined') window.open(url, '_blank'); }, []);
  const handleCopy = useCallback(() => { if (typeof window !== 'undefined') { navigator.clipboard.writeText(PI_INVITE_CODE); alert("초대 코드가 복사되었습니다!"); } }, []);

  if (!hasMounted) return <div className="bg-white min-h-screen" />;

  return (
    <div className="flex flex-col items-center bg-white min-h-screen text-black font-sans w-full pb-32 font-black selection:bg-red-50">
      
      {/* NAVIGATION */}
      <nav className="w-full max-w-6xl flex justify-between items-center px-4 py-2 sticky top-0 bg-white/95 backdrop-blur-sm z-[500] border-b border-black/5 shadow-sm">
        <div className="flex items-center gap-3">
          <img src="/kedheon-character.png" className="w-10 h-10 rounded-lg border-2 border-black" alt="K" />
          <div className="text-left leading-tight">
            <h1 className="text-black text-sm md:text-lg font-black italic uppercase leading-none">Kedheon</h1>
            <span className="text-gray-400 text-[8px] font-mono tracking-widest uppercase">V220.0 MASTER</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-gray-100 p-1 rounded-lg flex gap-1">
            <button onClick={() => setLang('KR')} className={`px-2 py-1 rounded-md text-[10px] font-black ${lang === 'KR' ? 'bg-black text-white' : 'text-gray-400'}`}>KR</button>
            <button onClick={() => setLang('EN')} className={`px-2 py-1 rounded-md text-[10px] font-black ${lang === 'EN' ? 'bg-black text-white' : 'text-gray-400'}`}>EN</button>
          </div>
          <button onClick={() => setTab('ROOKIE')} className={`px-3 py-1.5 rounded-lg text-[10px] md:text-sm font-black border transition-all ${tab === 'ROOKIE' ? 'bg-[#dc2626] text-white border-[#dc2626]' : 'text-gray-300 border-transparent'}`}>{L.rookie}</button>
          <button onClick={() => setTab('PIONEER')} className={`px-3 py-1.5 rounded-lg text-[10px] md:text-sm font-black border transition-all ${tab === 'PIONEER' ? 'bg-black text-white border-black' : 'text-gray-300 border-transparent'}`}>{L.pioneer}</button>
        </div>
      </nav>

      <main className="w-full max-w-5xl px-4 py-4">
        {tab === 'ROOKIE' ? (
          <div className="flex flex-col gap-6 animate-in fade-in duration-500 font-black">
            <div className="flex flex-col items-center text-center gap-4 py-8 bg-gray-50 rounded-3xl border border-black/5 relative shadow-inner overflow-hidden font-black text-left">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-[#dc2626]"></div>
              <img src="/kedheon-character.png" className="w-40 h-40 md:w-72 md:h-72 object-contain drop-shadow-2xl" alt="K" />
              <div className="px-4">
                <h1 className="text-black text-2xl md:text-4xl uppercase tracking-tighter">{L.procedure}</h1>
                <p className="text-[#dc2626] text-xs md:text-lg font-bold mt-1 tracking-tight">{L.piJoinDesc}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {L.steps.map((s, i) => (
                <div key={i} className={`p-4 bg-white rounded-2xl border flex flex-col gap-3 transition-all ${i === 0 || i === 5 ? 'border-[#dc2626] bg-red-50/5 shadow-md' : 'border-black/5 opacity-90'}`}>
                  <div className="flex items-center gap-4 text-left">
                    <span className={`text-3xl md:text-5xl font-black italic ${i === 0 || i === 5 ? 'text-[#dc2626]' : 'text-black opacity-5'}`}>0{i+1}</span>
                    <div className="flex-1 min-w-0"><h3 className="text-black text-[11px] md:text-sm font-black uppercase">{s.t}</h3><p className="text-gray-600 text-[9px] md:text-xs font-bold leading-tight mt-1">{s.d}</p></div>
                  </div>
                  {s.links && (
                    <div className="grid grid-cols-2 gap-2">
                      <button onClick={() => handleDownload(s.links!.AOS)} className="bg-black text-white py-2 rounded-lg text-[9px] font-black uppercase">Android</button>
                      <button onClick={() => handleDownload(s.links!.iOS)} className="bg-black text-white py-2 rounded-lg text-[9px] font-black uppercase">iPhone</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="p-8 bg-black text-white rounded-2xl text-center shadow-xl border-4 border-[#dc2626] cursor-pointer" onClick={handleCopy}>
               <p className="text-[10px] md:text-xs italic text-gray-500 mb-1">클릭하여 초대 코드 복사</p>
               <div className="text-[#dc2626] text-4xl md:text-[6rem] tracking-widest font-black leading-none">{PI_INVITE_CODE}</div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-8 py-2 animate-in slide-in-from-bottom-5 duration-700 font-black text-left">
            
            {/* ASSETS BOX */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 font-black">
              <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-3xl border-2 border-black shadow-lg flex flex-col justify-center relative overflow-hidden group">
                <h3 className="text-gray-400 text-[9px] md:text-[11px] uppercase tracking-widest font-black mb-3">{L.assets}</h3>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none transition-transform group-hover:scale-105">
                   <img src="/beom-token.png" className="w-28 h-28 md:w-48 md:h-48 object-contain shadow-2xl" alt="Beom" />
                </div>
                <div className="relative z-10">
                    <p className="text-black text-4xl md:text-6xl tracking-tighter leading-none font-black">
                      {Math.floor(beomToken).toLocaleString()}
                      <span className="text-xl opacity-20">.{beomToken.toFixed(2).split('.')[1]}</span> 
                      <span className="ml-2 text-xl md:text-3xl italic uppercase text-[#dc2626]">BEOM</span>
                    </p>
                    <p className="text-gray-400 text-xs md:text-lg font-black italic mt-1">≈ {piBalance.toLocaleString()} PI</p>
                    <div className="flex items-center gap-2 mt-4">
                      <div className="bg-black text-white px-3 py-1 rounded text-[8px] md:text-[10px] font-mono">NODE: 18.02 SCORE</div>
                      <div className="bg-[#dc2626] text-white px-3 py-1 rounded text-[8px] md:text-[10px] font-mono italic">RT: 15,080</div>
                    </div>
                </div>
              </div>
              <div className="bg-[#dc2626] p-6 rounded-3xl border-2 border-black shadow-lg flex flex-col justify-center items-center text-center gap-3">
                <h4 className="text-white text-lg md:text-xl font-black uppercase italic leading-none">{L.buyBeom}</h4>
                <div className="bg-white/20 p-2.5 rounded-xl w-full border border-white/30">
                  <p className="text-white text-[10px] md:text-[12px] font-black uppercase tracking-tight">1 PI = 1,000 BEOM</p>
                </div>
                <button onClick={() => {if(piBalance < 1) return alert("PI 부족"); setPiBalance(p=>p-1); setBeomToken(p=>p+1000); alert("구매 완료!");}} className="w-full bg-white text-black py-3.5 rounded-xl text-xs md:text-sm font-black shadow hover:scale-105 transition-all">구매하기</button>
              </div>
            </div>

            {/* 01. 핵심 기능 (주군 명령 리스트) */}
            <SectionHeader title={L.exchange} />
            <div className="bg-white p-5 rounded-3xl border-2 border-black space-y-4 shadow-sm">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 border-r border-gray-100 pr-4 font-black">
                     {L.exList.map((txt, idx) => <p key={idx} className="text-[10px] md:text-xs font-black text-gray-800 leading-tight">{txt}</p>)}
                  </div>
                  <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-2xl text-center font-black">
                     <p className="text-black text-sm md:text-lg font-black mb-3">전환 실행 (1:1000)</p>
                     <button onClick={() => {if(piBalance<1) return alert("PI 부족"); setPiBalance(p=>p-1); setBeomToken(p=>p+1000); alert("성공!");}} className="w-full bg-black text-white py-3 rounded-xl text-xs md:text-sm font-black hover:bg-[#dc2626] transition-all shadow-md">{L.convert}</button>
                  </div>
               </div>
            </div>

            {/* 02. 보안 큐알코드 */}
            <SectionHeader title={L.auth} />
            <div className="bg-gray-50 p-6 md:p-8 rounded-3xl border border-black/5 flex flex-col md:flex-row items-center gap-6 shadow-inner font-black">
               <div className={`bg-white border-4 rounded-2xl flex flex-col items-center justify-center shadow-lg w-48 h-48 md:w-64 md:h-64 transition-all ${qrState.active ? 'border-[#dc2626]' : 'opacity-10 grayscale blur-sm'}`}>
                  {qrState.active ? (
                    <>
                      <img src={qrState.type === 'PERSONAL' ? "/qr-personal.png" : "/qr-business.png"} className="w-full h-full p-4 object-contain" alt="QR" />
                      <p className="text-[9px] font-black bg-gray-100 px-2 py-0.5 rounded-full mb-2 uppercase">{qrState.type === 'PERSONAL' ? '개인 보안' : '기업 보안'}</p>
                    </>
                  ) : <p className="text-black text-sm md:text-lg font-black italic uppercase animate-pulse">Encoded QR</p>}
               </div>
               <div className="flex-1 w-full space-y-4">
                  <div className="bg-white p-5 rounded-2xl border-2 border-black/10">
                     <p className="text-black text-xs md:text-sm font-black italic uppercase mb-4">지갑 주소를 노출하지 않고 안전하게 결제하세요.</p>
                     <div className="flex gap-2 mb-4 font-black">
                        <button onClick={() => setQrState({...qrState, type:'PERSONAL'})} className={`flex-1 py-2.5 rounded-lg text-[10px] md:text-xs font-black border-2 transition-all ${qrState.type === 'PERSONAL' ? 'bg-black text-white border-black shadow-md' : 'text-gray-300 border-gray-100'}`}>개인용</button>
                        <button onClick={() => setQrState({...qrState, type:'BUSINESS'})} className={`flex-1 py-2.5 rounded-lg text-[10px] md:text-xs font-black border-2 transition-all ${qrState.type === 'BUSINESS' ? 'bg-black text-white border-black shadow-md' : 'text-gray-300 border-gray-100'}`}>기업/사업자용</button>
                     </div>
                  </div>
                  <button onClick={() => {if(beomToken<50) return alert("BEOM 부족"); setBeomToken(p=>p-50); setQrState({...qrState, active:true}); alert("활성화 완료!");}} className="w-full bg-black text-white py-3.5 rounded-xl text-xs md:text-sm font-black hover:bg-[#dc2626] transition-all shadow-md">{L.activate}</button>
               </div>
            </div>

            {/* 03. 크리에이티브 & 팬 (UI 복구) */}
            <SectionHeader title={L.creative} />
            <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-black/10 space-y-6 shadow-sm font-black">
              <div className="flex gap-8 border-b border-gray-100 pb-2 font-black">
                <button onClick={() => setHubTab('HUB')} className={`text-sm md:text-xl font-black italic uppercase ${hubTab === 'HUB' ? 'text-black border-b-4 border-black pb-1' : 'text-gray-300'}`}>HUB</button>
                <button onClick={() => setHubTab('SPIRIT')} className={`text-sm md:text-xl font-black italic uppercase ${hubTab === 'SPIRIT' ? 'text-black border-b-4 border-black pb-1' : 'text-gray-300'}`}>FAN SPIRIT</button>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar font-black">
                {CATS.map(c => <button key={c} onClick={() => setCategory(c)} className={`px-4 py-1.5 rounded-full text-[10px] md:text-xs font-black italic border transition-all whitespace-nowrap ${category === c ? 'bg-black text-white border-black shadow-md' : 'bg-white text-gray-400'}`}>{c}</button>)}
              </div>
              <div className="flex gap-2 flex-wrap font-black">{FANS.map(f => <button key={f} className="px-3 py-1.5 bg-white border border-gray-100 rounded-full text-[9px] md:text-xs font-black text-red-600 shadow-sm">🚩 {f}</button>)}</div>
              <div className="space-y-3 font-black">
                <input value={feed.title} onChange={e => setFeed({...feed, title: e.target.value})} placeholder="제목 또는 팬심 공유" className="w-full bg-gray-50 border border-black/5 p-4 rounded-xl text-xs md:text-sm font-black outline-none focus:border-black shadow-inner placeholder-gray-400" />
                <input value={feed.link} onChange={e => setFeed({...feed, link: e.target.value})} placeholder="이미지/영상 링크 (URL)" className="w-full bg-gray-50 border border-black/5 p-4 rounded-xl text-xs md:text-sm font-black outline-none focus:border-black text-red-400 placeholder-red-200" />
                <textarea value={feed.desc} onChange={e => setFeed({...feed, desc: e.target.value})} placeholder="상세 내용을 기록하십시오" className="w-full bg-gray-50 border border-black/5 p-4 rounded-xl text-[10px] md:text-xs font-bold h-32 outline-none focus:border-black leading-relaxed shadow-inner" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-black">
                <button onClick={() => {if(!feed.title) return; setBeomToken(p=>p-10); alert("피드 등록 성공"); setFeed({title:'', link:'', desc:''});}} className="md:col-span-2 bg-black text-white py-5 rounded-2xl text-sm md:text-lg font-black hover:bg-[#dc2626] transition-all shadow-lg active:scale-95">피드 등록 (10 BEOM)</button>
                <button className="bg-white border-2 border-black text-black py-5 rounded-2xl text-xs md:text-sm font-black flex items-center justify-center gap-1.5 shadow active:scale-95">🚩 FAN ROOM</button>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl border-l-[6px] border-[#dc2626] text-left font-black"><p className="text-gray-400 text-[9px] md:text-xs font-bold italic">{L.fanRoomDesc}</p></div>
            </div>

            {/* 04. 굿즈 판매 및 구입 */}
            <SectionHeader title={L.market} />
            <div className="bg-white p-6 rounded-[2rem] border-2 border-black/10 space-y-6 font-black text-left">
                <div className="flex gap-4 border-b-2 border-gray-100 pb-1.5 font-black">
                    <button onClick={() => setMarketMode('BUY')} className={`text-sm md:text-lg font-black italic ${marketMode === 'BUY' ? 'text-black border-b-4 border-black' : 'text-gray-300'}`}>굿즈 구매</button>
                    <button onClick={() => setMarketMode('SELL')} className={`text-sm md:text-lg font-black italic ${marketMode === 'SELL' ? 'text-black border-b-4 border-black' : 'text-gray-300'}`}>굿즈 등록</button>
                </div>
                {marketMode === 'BUY' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-black">
                        {goods.map(g => (
                            <div key={g.id} className="bg-gray-50 p-4 rounded-3xl border flex gap-4 items-center group shadow-sm transition-all hover:border-[#dc2626]">
                                <div className="w-20 h-20 md:w-28 md:h-28 bg-white rounded-xl flex items-center justify-center overflow-hidden shrink-0 shadow-inner"><img src={g.img} className="w-16 h-16 object-contain group-hover:scale-110 transition-transform" alt="G" /></div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-xs md:text-sm font-black uppercase mb-1 truncate">{g.name}</h4>
                                    <p className="text-gray-500 text-[9px] md:text-[11px] mb-2 font-bold line-clamp-1">{g.desc}</p>
                                    <p className="text-[#dc2626] text-sm md:text-lg font-black mb-2">{g.price.toLocaleString()} BEOM</p>
                                    <button className="w-full py-1.5 bg-black text-white rounded-lg text-[9px] font-black uppercase">구매하기</button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-3 font-black">
                        <input value={sellItem.name} onChange={e => setSellItem({...sellItem, name:e.target.value})} placeholder={L.itemName} className="w-full bg-gray-50 border border-black/5 p-4 rounded-xl text-xs md:text-sm font-black outline-none focus:border-black shadow-inner" />
                        <div className="grid grid-cols-2 gap-4">
                            <input type="number" value={sellItem.price} onChange={e => setSellItem({...sellItem, price:e.target.value})} placeholder={L.itemPrice} className="w-full bg-gray-50 border border-black/5 p-4 rounded-xl text-xs md:text-sm font-black outline-none focus:border-black shadow-inner" />
                            <input value={sellItem.img} onChange={e => setSellItem({...sellItem, img:e.target.value})} placeholder={L.itemImg} className="w-full bg-gray-50 border border-black/5 p-4 rounded-xl text-xs md:text-sm font-black outline-none focus:border-black shadow-inner" />
                        </div>
                        <textarea value={sellItem.desc} onChange={e => setSellItem({...sellItem, desc:e.target.value})} placeholder={L.itemDesc} className="w-full bg-gray-50 border border-black/5 p-4 rounded-xl text-[10px] md:text-xs font-bold h-24 outline-none focus:border-black leading-relaxed shadow-inner" />
                        <button onClick={() => {if(!sellItem.name) return; setGoods([{id:Date.now(), ...sellItem, price:Number(sellItem.price), seller:"User"}, ...goods]); alert("등록 완료"); setMarketMode('BUY');}} className="w-full bg-[#dc2626] text-white py-3 rounded-xl text-sm font-black shadow-lg">굿즈 판매 시작하기</button>
                    </div>
                )}
            </div>

            {/* 05. 글로벌 파트너십 */}
            <SectionHeader title={L.partnership} />
            <div className="bg-black p-6 rounded-[2rem] border-[8px] border-[#dc2626] space-y-4 relative overflow-hidden font-black">
                <h3 className="text-white text-lg md:text-3xl font-black italic border-l-4 border-[#dc2626] pl-3 uppercase leading-none z-10 relative">PARTNERSHIP</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 z-10 relative font-black">
                    <input value={partner.corp} onChange={e=>setPartner({...partner, corp: e.target.value})} placeholder={L.corpName} className="bg-white/10 border border-white/10 p-4 rounded-xl text-xs md:text-sm text-white outline-none focus:border-[#dc2626] transition-all" />
                    <input value={partner.manager} onChange={e=>setPartner({...partner, manager: e.target.value})} placeholder={L.manager} className="bg-white/10 border border-white/10 p-4 rounded-xl text-xs md:text-sm text-white outline-none focus:border-[#dc2626] transition-all" />
                    <input value={partner.email} onChange={e=>setPartner({...partner, email: e.target.value})} placeholder={L.email} className="bg-white/10 border border-white/10 p-4 rounded-xl text-xs md:text-sm text-white outline-none focus:border-[#dc2626] transition-all" />
                    <input value={partner.contact} onChange={e=>setPartner({...partner, contact: e.target.value})} placeholder={L.contact} className="bg-white/10 border border-white/10 p-4 rounded-xl text-xs md:text-sm text-white outline-none focus:border-[#dc2626] transition-all" />
                </div>
                <textarea value={partner.msg} onChange={e=>setPartner({...partner, msg: e.target.value})} placeholder={L.vision} className="w-full bg-white/10 border border-white/10 p-4 rounded-2xl text-xs md:text-sm text-white h-32 outline-none focus:border-[#dc2626] z-10 relative" />
                <button onClick={()=>alert("제안서가 전송되었습니다.")} className="w-full bg-[#dc2626] text-white py-3.5 rounded-full text-sm md:text-lg font-black hover:bg-white hover:text-[#dc2626] transition-all uppercase z-10 relative active:scale-95 font-black">
                  제안 제출하기
                </button>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="fixed bottom-4 left-4 right-4 max-w-4xl mx-auto bg-white border-2 border-black p-1.5 rounded-2xl flex justify-between gap-1.5 z-[1000] shadow-2xl font-black">
        {['KEDHEON', 'CIVIL', 'NEXUS', 'VENDOR'].map(app => (
          <button key={app} className={`flex-1 py-4 rounded-xl text-[10px] md:text-sm transition-all font-black text-center ${app === 'KEDHEON' ? 'bg-black text-white shadow-md' : 'text-gray-300'}`}>
            {app}
          </button>
        ))}
      </footer>

      {/* WATERMARK */}
      <div className="mt-20 opacity-[0.02] text-black text-4xl md:text-8xl tracking-[0.5em] uppercase pb-24 font-black text-center select-none pointer-events-none leading-none"> 
        KEDHEON MASTER 
      </div>
    </div>
  );
}
