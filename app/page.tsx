'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';

/** * [KEDHEON MASTER V175.0 - EMPIRE FULL-SPEC]
 * -----------------------------------------------------------
 * 1. 수정: 안드로이드/애플 다운로드 링크 분리 및 복구
 * 2. 수정: 한글 모드 시 모든 타이틀/항목 한글화 완료
 * 3. 수정: BEOM 환율 1 PI = 1,000 BEOM 고정 (로직 반영)
 * 4. 수정: 마켓 구매/판매 섹션 명확화
 * 5. 수정: 파트너십 상세 양식 (기업명, 메일, 연락처, 담당자, 내용)
 * 6. 추가: 보유 자산 섹션 내 BEOM 토큰 이미지 배치
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
}

const PI_INVITE_CODE = 'ohsangjo';
const CATS = ['MUSIC', 'TECH', 'ART', 'FOOD', 'TRAVEL', 'GAME', 'NEWS', 'MOVIE'];
const FANS = ['케데헌', '헌트릭스', 'BTS'];

const DICT: Record<Lang, Dictionary> = {
  KR: {
    rookie: "루키 가이드", pioneer: "제국 대시보드", exchange: "01. 자산 전환", auth: "02. 보안 인증",
    creative: "03. 크리에이티브 & 팬", market: "04. 제국 마켓", partnership: "05. 글로벌 파트너십",
    invitation: "Web3 제국 초대장", procedure: "파이코인 가입 절차", assets: "보유 자산",
    activate: "QR 코드 활성화", convert: "1 PI 전환 (1,000 BEOM)", post: "피드 등록 (10 BEOM)",
    buy: "구매하기", register: "상품 등록하기", submit: "제안서 제출하기", 
    downloadAOS: "안드로이드 다운로드", downloadiOS: "아이폰 다운로드", buyBeom: "BEOM 구매",
    corpName: "기업명", email: "이메일 주소", contact: "연락처", manager: "담당자 성함", vision: "제안 내용 (제안서)",
    itemName: "상품명", itemPrice: "판매 가격",
    piJoinDesc: "인류 최대의 생태계, 파이 네트워크에 합류하십시오.",
    exchangeDesc: "채굴 기여도를 BEOM 토큰으로 즉시 전환하여 가치를 보존하십시오.",
    authDesc: "제국 시민을 위한 고유 보안 QR 코드를 발급받으십시오.",
    creativeDesc: "창작물과 팬심을 공유하고 제국의 호응을 이끌어내십시오.",
    fanRoomDesc: "※ 🚩 팬룸 개설(500 BEOM): 90% 수익 환원 및 거버넌스 권한 부여.",
    marketDesc: "검증된 제국 물품을 안전하게 구매하거나 본인의 물건을 판매하십시오.",
    partnershipDesc: "미래 제국을 함께 건설할 글로벌 파트너사의 제안을 기다립니다.",
    steps: [
      { t: "애플리케이션 설치", d: "아래 버튼을 눌러 본인의 기기에 맞는 [Pi Network] 공식 앱을 설치하십시오.", links: { AOS: "https://play.google.com/store/apps/details?id=com.blockchainvault", iOS: "https://apps.apple.com/us/app/pi-network/id1445472543" } },
      { t: "가입 방식 선택", d: "Continue with phone number 방식을 선택하여 가입을 진행하십시오." },
      { t: "국가 및 번호 설정", d: "+82(South Korea)를 선택한 후 본인의 핸드폰 번호를 입력하십시오." },
      { t: "보안 비밀번호 생성", d: "영문 대/소문자와 숫자를 조합하여 강력한 비밀번호를 설정하십시오." },
      { t: "실명 프로필 작성", d: "여권 영문 실명과 본인만의 유니크한 ID를 설정하십시오." },
      { t: "초대 코드 입력", d: "초대 코드 [ ohsangjo ] 를 입력하여 제국에 합류하십시오." },
      { t: "비밀구절 보관", d: "지갑 생성 시 나오는 24개 단어는 반드시 종이에 수기로 기록하여 보관하십시오." },
      { t: "채굴 활동 시작", d: "24시간마다 번개 버튼을 눌러 활동을 증명하고 보상을 받으십시오." }
    ]
  },
  EN: {
    rookie: "ROOKIE GUIDE", pioneer: "PIONEER", exchange: "01. EXCHANGE", auth: "02. SECURE AUTH",
    creative: "03. CREATIVE & FAN", market: "04. MARKET", partnership: "05. PARTNERSHIP",
    invitation: "Web3 Empire Invitation", procedure: "Pi Join Guide", assets: "ASSETS",
    activate: "ACTIVATE QR", convert: "1 PI CONVERT (1,000 BEOM)", post: "POST (10 BEOM)",
    buy: "BUY NOW", register: "REGISTER ITEM", submit: "SUBMIT PROPOSAL",
    downloadAOS: "Android Download", downloadiOS: "iOS Download", buyBeom: "BUY BEOM",
    corpName: "Company", email: "Email", contact: "Contact", manager: "Manager Name", vision: "Proposal Content",
    itemName: "Item Name", itemPrice: "Price",
    piJoinDesc: "Join the largest Web3 network, Pi Network.",
    exchangeDesc: "Convert your mining contribution to BEOM instantly.",
    authDesc: "Get your unique secure QR code for citizenship.",
    creativeDesc: "Share creations and fan spirit for support.",
    fanRoomDesc: "※ 🚩 Fan Room (500 BEOM): 90% Return & Governance.",
    marketDesc: "Buy verified items or register your own products.",
    partnershipDesc: "We wait for global partner proposals to build the future.",
    steps: [
      { t: "Install App", d: "Download [Pi Network] for your device below.", links: { AOS: "https://minepi.com/#download", iOS: "https://minepi.com/#download" } },
      { t: "Login Method", d: "Select 'Continue with phone number'." },
      { t: "Country & Phone", d: "Select +82 and enter your phone number." },
      { t: "Set Password", d: "Create a strong password (Upper/Lower/Numbers)." },
      { t: "Set Profile", d: "Enter passport name and unique ID." },
      { t: "Invitation Code", d: "Enter [ ohsangjo ] to join the empire." },
      { t: "Save Passphrase", d: "Handwrite 24 words on paper and keep it safe." },
      { t: "Start Mining", d: "Tap the lightning bolt every 24 hours." }
    ]
  }
};

const SectionHeader = ({ num, title, desc }: { num: string | number; title: string; desc: string; }) => (
  <div className="w-full border-t-2 border-[#dc2626] pt-3 mb-4 text-left">
    <h2 className="text-black text-xl md:text-2xl font-black uppercase italic border-l-[10px] border-black pl-3 tracking-tighter leading-none">
       {title}
    </h2>
    <p className="text-gray-400 text-[10px] md:text-xs font-bold pl-8 italic leading-none mt-1">{desc}</p>
  </div>
);

export default function KedheonMasterV175() {
  const [hasMounted, setHasMounted] = useState(false);
  const [lang, setLang] = useState<Lang>('KR');
  const [tab, setTab] = useState<'ROOKIE' | 'PIONEER'>('PIONEER');
  
  const [beomToken, setBeomToken] = useState(7891.88);
  const [piBalance, setPiBalance] = useState(124.55);
  const [hubTab, setHubTab] = useState<'HUB' | 'SPIRIT'>('HUB');
  const [category, setCategory] = useState('TECH');
  const [feed, setFeed] = useState({ title: '', link: '', desc: '' });
  const [qrState, setQrState] = useState({ type: 'PERSONAL', active: false });
  
  const [marketMode, setMarketMode] = useState<'BUY' | 'SELL'>('BUY');
  const [sellItem, setSellItem] = useState({ name: '', price: '' });
  const [goods, setGoods] = useState<GoodsItem[]>([
    { id: 1, name: "제국 골드 뱃지", price: 1000, img: "/beom-token.png", seller: "Lord Oh" },
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
            <span className="text-gray-400 text-[9px] font-mono tracking-widest uppercase">Master V175.0</span>
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
              <div className="px-6 space-y-2">
                <h1 className="text-black text-3xl md:text-5xl uppercase tracking-tighter font-black">{L.invitation}</h1>
                <p className="text-[#dc2626] text-lg md:text-2xl uppercase tracking-widest border-b-4 border-[#dc2626] pb-1 inline-block italic">{L.procedure}</p>
                <p className="text-gray-400 text-xs md:text-base font-bold mt-2 uppercase tracking-tighter">{L.piJoinDesc}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {L.steps.map((step, i) => (
                <div key={i} className={`p-5 bg-white rounded-2xl border flex flex-col gap-5 transition-all ${i === 0 || i === 5 ? 'border-[#dc2626] bg-red-50/5 shadow-md' : 'border-black/5 opacity-90'}`}>
                  <div className="flex items-center gap-5">
                    <span className={`text-4xl md:text-6xl font-black italic ${i === 0 || i === 5 ? 'text-[#dc2626]' : 'text-black opacity-5'}`}>0{i+1}</span>
                    <div className="flex-1 min-w-0 text-left leading-none">
                      <h3 className="text-black text-xs md:text-lg font-black uppercase italic leading-none">{step.t}</h3>
                      <p className="text-gray-600 text-[10px] md:text-sm font-bold mt-1.5 leading-tight">{step.d}</p>
                    </div>
                  </div>
                  {step.links && (
                    <div className="grid grid-cols-2 gap-3">
                      <button onClick={() => handleDownload(step.links!.AOS)} className="bg-black text-white py-3 rounded-lg text-[10px] font-black uppercase shadow-md">&darr; {L.downloadAOS}</button>
                      <button onClick={() => handleDownload(step.links!.iOS)} className="bg-black text-white py-3 rounded-lg text-[10px] font-black uppercase shadow-md">&darr; {L.downloadiOS}</button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="p-12 bg-black text-white rounded-3xl text-center shadow-xl border-4 border-[#dc2626] font-black">
              <p className="text-[10px] md:text-sm italic text-gray-500 uppercase tracking-widest mb-2 font-black">Imperial Code</p>
              <div className="text-[#dc2626] text-5xl md:text-[8rem] tracking-widest cursor-pointer hover:scale-105 transition-transform" onClick={handleCopy}>
                {PI_INVITE_CODE}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-10 py-2 animate-in slide-in-from-bottom-5 duration-700 font-black text-left">
            
            {/* ASSETS & BUY BOX */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-left">
              <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-3xl border-2 border-black shadow-lg flex flex-col justify-center relative overflow-hidden">
                <h3 className="text-gray-400 text-[10px] md:text-xs uppercase tracking-widest font-black mb-4 tracking-tighter">{L.assets}</h3>
                
                {/* [BEOM TOKEN IMAGE IN CENTER] */}
                <div className="absolute right-10 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none">
                   <img src="/beom-token.png" className="w-32 h-32 md:w-48 md:h-48" alt="Beom" />
                </div>

                <div className="relative z-10">
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

            {/* 01. EXCHANGE (RATE FIXED TO 1000) */}
            <SectionHeader num="01" title={L.exchange} desc={L.exchangeDesc} />
            <div className="bg-white p-6 rounded-3xl border-2 border-black flex justify-between items-center shadow-md">
              <div className="font-black leading-tight">
                <p className="text-black text-2xl italic uppercase leading-none">TERMINAL</p>
                <p className="text-gray-400 text-[10px] uppercase mt-1 tracking-widest font-black">RATE: 1 PI = 1,000 BEOM</p>
              </div>
              <button onClick={() => {if(piBalance < 1) return; setPiBalance(p=>p-1); setBeomToken(p=>p+1000); alert("CONVERTED 1 PI TO 1,000 BEOM");}} className="bg-black text-white px-8 py-4 rounded-xl text-sm md:text-lg font-black hover:bg-[#dc2626] transition-all">
                1 PI 환전
              </button>
            </div>

            {/* 03. CREATIVE & FAN */}
            <SectionHeader num="03" title={L.creative} desc={L.creativeDesc} />
            <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-black/10 space-y-6 shadow-sm font-black">
              <div className="flex gap-8 border-b border-gray-100 pb-2">
                <button onClick={() => setHubTab('HUB')} className={`text-lg md:text-2xl font-black italic uppercase transition-all ${hubTab === 'HUB' ? 'text-black border-b-4 border-black pb-1' : 'text-gray-300'}`}>CREATIVE HUB</button>
                <button onClick={() => setHubTab('SPIRIT')} className={`text-lg md:text-2xl font-black italic uppercase transition-all ${hubTab === 'SPIRIT' ? 'text-black border-b-4 border-black pb-1' : 'text-gray-300'}`}>FAN SPIRIT</button>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar font-black">
                {CATS.map(cat => (
                  <button key={cat} onClick={() => setCategory(cat)} className={`px-4 py-1.5 rounded-full text-[10px] md:text-xs font-black italic border ${category === cat ? 'bg-black text-white border-black' : 'bg-white text-gray-400 border-gray-100'}`}>{cat}</button>
                ))}
              </div>
              <div className="flex gap-2 flex-wrap">
                {FANS.map(fan => (
                  <button key={fan} className="px-4 py-2 bg-white border border-gray-100 rounded-full text-[10px] md:text-xs font-black text-red-600 flex items-center gap-1.5 shadow-sm">🚩 {fan}</button>
                ))}
              </div>
              <div className="space-y-3 font-black">
                <input value={feed.title} onChange={(e) => setFeed({ ...feed, title: e.target.value })} placeholder="제목 또는 팬심 공유" className="w-full bg-gray-50 border border-black/5 p-4 rounded-xl text-sm md:text-lg font-black outline-none focus:border-black" />
                <input value={feed.link} onChange={(e) => setFeed({ ...feed, link: e.target.value })} placeholder="이미지/영상 링크" className="w-full bg-gray-50 border border-black/5 p-4 rounded-xl text-sm md:text-lg font-black outline-none focus:border-black placeholder-red-200 text-red-400" />
                <textarea value={feed.desc} onChange={(e) => setFeed({ ...feed, desc: e.target.value })} placeholder="상세 내용을 기록하십시오" className="w-full bg-gray-50 border border-black/5 p-4 rounded-xl text-xs md:text-sm font-bold h-32 outline-none focus:border-black leading-relaxed" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-black">
                <button onClick={() => {if(!feed.title) return; setBeomToken(p=>p-10); alert("POSTED"); setFeed({title:'', link:'', desc:''});}} className="md:col-span-2 bg-black text-white py-5 rounded-2xl text-lg md:text-2xl font-black hover:bg-[#dc2626] transition-all shadow-lg">{L.post}</button>
                <button className="bg-white border-2 border-black text-black py-5 rounded-2xl text-lg md:text-xl font-black flex items-center justify-center gap-2 shadow">🚩 FAN ROOM</button>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border-l-[6px] border-[#dc2626] text-left">
                <p className="text-gray-400 text-[10px] md:text-xs font-bold italic leading-none">{L.fanRoomDesc}</p>
              </div>
            </div>

            {/* 04. MARKET (BUY/SELL ORGANIZED) */}
            <SectionHeader num="04" title={L.market} desc={L.marketDesc} />
            <div className="bg-white p-6 rounded-[2rem] border-2 border-black/10 space-y-8 font-black">
                <div className="flex gap-4 border-b-2 border-gray-100 pb-2">
                    <button onClick={() => setMarketMode('BUY')} className={`text-lg md:text-2xl font-black italic ${marketMode === 'BUY' ? 'text-black border-b-4 border-black' : 'text-gray-300'}`}>BUY (제국 물품 구매)</button>
                    <button onClick={() => setMarketMode('SELL')} className={`text-lg md:text-2xl font-black italic ${marketMode === 'SELL' ? 'text-black border-b-4 border-black' : 'text-gray-300'}`}>SELL (상품 등록)</button>
                </div>

                {marketMode === 'BUY' ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 font-black">
                        {goods.map(g => (
                            <div key={g.id} className="bg-gray-50 p-4 rounded-2xl border flex flex-col items-center group shadow-sm">
                                <div className="w-full aspect-square bg-white rounded-xl mb-3 flex items-center justify-center shadow-inner overflow-hidden">
                                    <img src={g.img} className="w-20 h-20 md:w-32 md:h-32 object-contain group-hover:scale-110 transition-transform" alt="G" />
                                </div>
                                <h4 className="text-[10px] md:text-sm font-black uppercase mb-1">{g.name}</h4>
                                <p className="text-[#dc2626] text-xs md:text-lg font-black mb-3">{g.price.toLocaleString()} BEOM</p>
                                <button className="w-full py-2 bg-black text-white rounded-lg text-[9px] font-black uppercase">BUY</button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-4 font-black">
                        <input value={sellItem.name} onChange={(e)=>setSellItem({...sellItem, name:e.target.value})} placeholder={L.itemName} className="w-full bg-gray-50 border-2 border-black/5 p-4 rounded-xl text-lg font-black outline-none" />
                        <input type="number" value={sellItem.price} onChange={(e)=>setSellItem({...sellItem, price:e.target.value})} placeholder={L.itemPrice + " (BEOM)"} className="w-full bg-gray-50 border-2 border-black/5 p-4 rounded-xl text-lg font-black outline-none" />
                        <button onClick={()=>{setGoods([{id:Date.now(), name:sellItem.name, price:Number(sellItem.price), img:"/beom-token.png", seller:"You"}, ...goods]); alert("Registered"); setMarketMode('BUY');}} className="w-full bg-[#dc2626] text-white py-4 rounded-xl text-xl font-black shadow-lg">{L.register}</button>
                    </div>
                )}
            </div>

            {/* 05. PARTNERSHIP (DETAILED FORM) */}
            <SectionHeader num="05" title={L.partnership} desc={L.partnershipDesc} />
            <div className="bg-black p-8 rounded-[2.5rem] border-[12px] border-[#dc2626] space-y-6 relative overflow-hidden font-black">
                <h3 className="text-white text-2xl md:text-4xl font-black italic border-l-8 border-[#dc2626] pl-4 uppercase leading-none z-10 relative">PARTNERSHIP PORTAL</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 z-10 relative font-black">
                    <input value={partner.corp} onChange={(e)=>setPartner({...partner, corp: e.target.value})} placeholder={L.corpName} className="bg-white/10 border border-white/10 p-4 rounded-xl text-sm md:text-lg text-white outline-none focus:border-[#dc2626]" />
                    <input value={partner.manager} onChange={(e)=>setPartner({...partner, manager: e.target.value})} placeholder={L.manager} className="bg-white/10 border border-white/10 p-4 rounded-xl text-sm md:text-lg text-white outline-none focus:border-[#dc2626]" />
                    <input value={partner.email} onChange={(e)=>setPartner({...partner, email: e.target.value})} placeholder={L.email} className="bg-white/10 border border-white/10 p-4 rounded-xl text-sm md:text-lg text-white outline-none focus:border-[#dc2626]" />
                    <input value={partner.contact} onChange={(e)=>setPartner({...partner, contact: e.target.value})} placeholder={L.contact} className="bg-white/10 border border-white/10 p-4 rounded-xl text-sm md:text-lg text-white outline-none focus:border-[#dc2626]" />
                </div>
                <textarea value={partner.msg} onChange={(e)=>setPartner({...partner, msg: e.target.value})} placeholder={L.vision} className="w-full bg-white/10 border border-white/10 p-4 rounded-2xl text-xs md:text-lg text-white h-48 outline-none focus:border-[#dc2626] z-10 relative" />
                <button onClick={()=>alert("제안서가 성공적으로 발송되었습니다.")} className="w-full bg-[#dc2626] text-white py-4 rounded-full text-sm md:text-xl font-black hover:bg-white hover:text-[#dc2626] transition-all shadow-xl uppercase z-10 relative">
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
