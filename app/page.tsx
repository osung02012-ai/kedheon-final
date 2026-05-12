'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';

/** * [KEDHEON MASTER V185.0 - GLOBAL STANDARD]
 * -----------------------------------------------------------
 * 1. 직관적 언어: "프로토콜", "제국" 등 난해한 단어 삭제 -> 쉬운 우리말/영어 적용
 * 2. 01. 기능 상세: 앱에서 할 수 있는 5가지 핵심 기능 설명 추가
 * 3. 02. QR 인증: 지갑 주소 보호 목적 명시 및 [개인용 / 기업용] 선택 기능 복구
 * 4. 04. 굿즈 등록: 상품명, 가격 외에 [상세 설명, 이미지 업로드] 추가
 * 5. 03. 카테고리: CCM, 뮤지션 항목 최상단 배치
 * -----------------------------------------------------------
 */

type Lang = 'KR' | 'EN';
interface Step { t: string; d: string; links?: { AOS: string; iOS: string; }; }
interface GoodsItem { id: number; name: string; price: number; img: string; desc: string; }
interface Dictionary {
  rookie: string; pioneer: string; exchange: string; auth: string; creative: string;
  market: string; partnership: string; assets: string; activate: string; convert: string; 
  post: string; buy: string; register: string; submit: string; downloadAOS: string; 
  downloadiOS: string; buyBeom: string; invitation: string; procedure: string;
  corpName: string; email: string; contact: string; manager: string; vision: string;
  itemName: string; itemPrice: string; itemDesc: string;
  exList: string[];
}

const PI_INVITE_CODE = 'ohsangjo';
const CATS = ['CCM', '뮤지션', 'MUSIC', 'TECH', 'ART', 'FOOD', 'TRAVEL', 'GAME', 'NEWS', 'MOVIE'];
const FANS = ['케데헌', '헌트릭스', 'BTS'];

const DICT: Record<Lang, Dictionary> = {
  KR: {
    rookie: "가입 가이드", pioneer: "파이오니어", exchange: "01. 코인 전환 및 기능", auth: "02. 안전 QR 결제",
    creative: "03. 크리에이티브 & 팬", market: "04. 굿즈 장터", partnership: "05. 비즈니스 파트너십",
    invitation: "Web3 초대장", procedure: "파이코인 시작하기", assets: "내 자산",
    activate: "안전 QR 활성화 (50 BEOM)", convert: "1 PI 전환하기", post: "게시글 올리기 (10 BEOM)",
    buy: "구매하기", register: "내 물건 판매하기", submit: "제안서 보내기", 
    downloadAOS: "안드로이드 앱 다운로드", downloadiOS: "아이폰 앱 다운로드", buyBeom: "BEOM 포인트 구매",
    corpName: "회사/단체명", email: "이메일", contact: "연락처", manager: "담당자 이름", vision: "협력 제안 내용",
    itemName: "상품 이름", itemPrice: "판매 가격 (BEOM)", itemDesc: "상품 상세 설명",
    exList: [
      "1. 내가 채굴한 파이코인을 BEOM 포인트로 즉시 바꿀 수 있습니다.",
      "2. 노드 운영 보상과 내 모든 포인트를 한곳에서 관리합니다.",
      "3. 앱 내에서 포인트의 가치가 떨어지지 않게 안전하게 보관합니다.",
      "4. 향후 파이코인 메인넷과 내 자산을 연동하도록 준비합니다.",
      "5. 개인 지갑을 연결하여 포인트를 더 안전하게 보호합니다."
    ],
    steps: [
      { t: "공식 앱 설치", d: "사용 중인 스마트폰에 맞는 앱을 먼저 설치하세요.", links: { AOS: "https://play.google.com/store/apps/details?id=com.blockchainvault", iOS: "https://apps.apple.com/us/app/pi-network/id1445472543" } },
      { t: "가입하기", d: "핸드폰 번호(Phone number)로 가입하는 것을 권장합니다." },
      { t: "국가 선택", d: "목록에서 South Korea(+82)를 찾아서 선택하세요." },
      { t: "비밀번호 설정", d: "영문 대문자, 소문자, 숫자를 섞어서 만드세요." },
      { t: "이름 입력", d: "여권에 적힌 영문 이름과 사용할 ID를 입력하세요." },
      { t: "추천인 입력", d: "추천인 코드에 ohsangjo 를 입력하면 시작 보상을 받습니다." },
      { t: "비밀번호 보관", d: "가입 후 나오는 24개 단어는 꼭 종이에 적어두세요." },
      { t: "채굴 버튼 클릭", d: "매일 한 번씩 번개 모양 버튼을 누르면 채굴이 시작됩니다." }
    ]
  },
  EN: {
    rookie: "GUIDE", pioneer: "PIONEER", exchange: "01. APP FEATURES", auth: "02. SECURE QR PAY",
    creative: "03. CREATIVE & FAN", market: "04. GOODS", partnership: "05. PARTNERSHIP",
    invitation: "Web3 Invitation", procedure: "How to Join", assets: "MY ASSETS",
    activate: "ACTIVATE QR (50 BEOM)", convert: "CONVERT 1 PI", post: "UPLOAD (10 BEOM)",
    buy: "BUY", register: "SELL ITEM", submit: "SUBMIT",
    downloadAOS: "Android", downloadiOS: "iOS", buyBeom: "BUY BEOM",
    corpName: "Company Name", email: "Email", contact: "Contact", manager: "Manager", vision: "Proposal",
    itemName: "Item Name", itemPrice: "Price (BEOM)", itemDesc: "Description",
    exList: [
      "1. Convert your mined Pi coins to BEOM points instantly.",
      "2. Manage your node rewards and assets in one dashboard.",
      "3. Keep your point value safe and secure within the app.",
      "4. Prepare for the Pi Mainnet migration and asset sync.",
      "5. Connect external wallets for enhanced security."
    ],
    steps: [
      { t: "Install App", d: "Download the official Pi App for your phone.", links: { AOS: "https://minepi.com/#download", iOS: "https://minepi.com/#download" } },
      { t: "Login", d: "We recommend joining via your Phone number." },
      { t: "Country", d: "Select +82 (South Korea) or your country code." },
      { t: "Password", d: "Combine Upper, Lowercase letters, and Numbers." },
      { t: "Name", d: "Enter your real name and create a Unique ID." },
      { t: "Invite Code", d: "Enter [ ohsangjo ] to get your start bonus." },
      { t: "Passphrase", d: "Write down the 24 words on paper and hide it." },
      { t: "Mining", d: "Tap the lightning bolt icon every 24 hours." }
    ]
  }
};

const SectionHeader = ({ title }: { title: string; }) => (
  <div className="w-full border-t-2 border-[#dc2626] pt-3 mb-4 text-left">
    <h2 className="text-black text-xl md:text-2xl font-black uppercase italic border-l-[10px] border-black pl-3 tracking-tighter leading-none">
       {title}
    </h2>
  </div>
);

export default function KedheonPioneerV185() {
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
    { id: 1, name: "Kedheon 기념 뱃지", price: 1000, desc: "한정판 실물 뱃지입니다.", img: "/beom-token.png" }
  ]);

  const L = DICT[lang];

  useEffect(() => { setHasMounted(true); }, []);

  const handleDownload = useCallback((url: string) => { if (typeof window !== 'undefined') window.open(url, '_blank'); }, []);
  const handleCopy = useCallback(() => { if (typeof window !== 'undefined') { navigator.clipboard.writeText(PI_INVITE_CODE); alert("초대 코드가 복사되었습니다!"); } }, []);

  if (!hasMounted) return <div className="bg-white min-h-screen" />;

  return (
    <div className="flex flex-col items-center bg-white min-h-screen text-black font-sans w-full pb-32 font-black selection:bg-red-50">
      
      {/* NAVIGATION */}
      <nav className="w-full max-w-6xl flex justify-between items-center px-4 py-3 sticky top-0 bg-white/95 backdrop-blur-sm z-[500] border-b border-black/5 shadow-sm">
        <div className="flex items-center gap-3">
          <img src="/kedheon-character.png" className="w-10 h-10 rounded-lg border-2 border-black" alt="K" />
          <div className="text-left leading-tight">
            <h1 className="text-black text-lg md:text-xl font-black italic uppercase">Kedheon</h1>
            <span className="text-gray-400 text-[8px] font-mono tracking-widest uppercase">V185.0 STANDARD</span>
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
            {/* HERO */}
            <div className="flex flex-col items-center text-center gap-6 py-10 bg-gray-50 rounded-3xl border border-black/5 relative shadow-inner overflow-hidden font-black">
              <div className="absolute top-0 left-0 w-full h-2 bg-[#dc2626]"></div>
              <img src="/kedheon-character.png" className="w-48 h-48 md:w-80 md:h-80 object-contain drop-shadow-2xl" alt="K" />
              <div className="px-6 space-y-2">
                <h1 className="text-black text-3xl md:text-5xl uppercase tracking-tighter">{L.procedure}</h1>
                <p className="text-[#dc2626] text-sm md:text-xl font-bold uppercase tracking-widest">{lang === 'KR' ? "아래 순서대로 따라하시면 쉽습니다." : "Follow the steps below to join."}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {L.steps.map((step, i) => (
                <div key={i} className={`p-5 bg-white rounded-2xl border flex flex-col gap-4 transition-all ${i === 0 || i === 5 ? 'border-[#dc2626] bg-red-50/5 shadow-md' : 'border-black/5 opacity-90'}`}>
                  <div className="flex items-center gap-4 text-left">
                    <span className={`text-4xl md:text-6xl font-black italic ${i === 0 || i === 5 ? 'text-[#dc2626]' : 'text-black opacity-5'}`}>0{i+1}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-black text-xs md:text-base font-black uppercase">{step.t}</h3>
                      <p className="text-gray-600 text-[10px] md:text-sm font-bold mt-1.5 leading-tight">{step.d}</p>
                    </div>
                  </div>
                  {step.links && (
                    <div className="grid grid-cols-2 gap-3">
                      <button onClick={() => handleDownload(step.links!.AOS)} className="bg-black text-white py-2 rounded-lg text-[9px] font-black uppercase">Android</button>
                      <button onClick={() => handleDownload(step.links!.iOS)} className="bg-black text-white py-2 rounded-lg text-[9px] font-black uppercase">iPhone</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="p-12 bg-black text-white rounded-3xl text-center shadow-xl border-4 border-[#dc2626] font-black" onClick={handleCopy} style={{cursor:'pointer'}}>
               <p className="text-[10px] md:text-sm italic text-gray-500 uppercase mb-2">복사하려면 아래 코드를 클릭하세요</p>
               <div className="text-[#dc2626] text-5xl md:text-[8rem] tracking-widest">{PI_INVITE_CODE}</div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-10 py-2 animate-in slide-in-from-bottom-5 duration-700 font-black text-left">
            
            {/* ASSETS BOX */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-3xl border-2 border-black shadow-lg flex flex-col justify-center relative overflow-hidden">
                <h3 className="text-gray-400 text-[10px] md:text-xs uppercase tracking-widest font-black mb-4">{L.assets}</h3>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-100 pointer-events-none">
                   <img src="/beom-token.png" className="w-32 h-32 md:w-56 md:h-56 object-contain drop-shadow-xl" alt="Token" />
                </div>
                <div className="relative z-10">
                    <p className="text-black text-4xl md:text-6xl tracking-tighter leading-none">
                      {Math.floor(beomToken).toLocaleString()}
                      <span className="text-xl opacity-20">.{beomToken.toFixed(2).split('.')[1]}</span> 
                      <span className="ml-2 text-xl md:text-3xl italic uppercase text-[#dc2626]">BEOM</span>
                    </p>
                    <p className="text-gray-400 text-sm md:text-lg font-black italic mt-1">≈ {piBalance.toLocaleString()} PI</p>
                    <div className="flex items-center gap-3 mt-4">
                      <div className="bg-black text-white px-3 py-1 rounded text-[9px] md:text-[10px] font-mono shadow-sm">NODE: 18.02 SCORE</div>
                      <div className="bg-[#dc2626] text-white px-3 py-1 rounded text-[9px] md:text-[10px] font-mono italic shadow-sm">RETURN: 3,500 BEOM</div>
                    </div>
                </div>
              </div>
              <div className="bg-[#dc2626] p-6 rounded-3xl border-2 border-black shadow-lg flex flex-col justify-center items-center text-center gap-3">
                <h4 className="text-white text-lg md:text-xl font-black uppercase italic leading-none">{L.buyBeom}</h4>
                <p className="text-white text-[11px] font-black uppercase bg-black/20 px-3 py-1 rounded-lg">1 PI = 1,000 BEOM</p>
                <button onClick={() => {if(piBalance < 1) return alert("잔액이 부족합니다."); setPiBalance(p=>p-1); setBeomToken(p=>p+1000); alert("구매 완료!");}} className="w-full bg-white text-black py-4 rounded-xl text-sm font-black shadow hover:scale-105 transition-all">구매하기</button>
              </div>
            </div>

            {/* 01. FEATURES */}
            <SectionHeader title={L.exchange} />
            <div className="bg-white p-6 rounded-3xl border-2 border-black space-y-6 shadow-md">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                     {L.exList.map((txt, idx) => <p key={idx} className="text-xs md:text-sm font-bold text-gray-700 border-b border-gray-50 pb-1">{txt}</p>)}
                  </div>
                  <div className="bg-gray-50 p-6 rounded-2xl flex flex-col items-center justify-center border border-black/5 text-center">
                     <p className="text-black text-lg font-black mb-1">1 PI를 지금 전환하시겠습니까?</p>
                     <p className="text-gray-400 text-[10px] mb-4 uppercase">1,000 BEOM 포인트가 적립됩니다.</p>
                     <button onClick={() => {if(piBalance<1) return alert("잔액부족"); setPiBalance(p=>p-1); setBeomToken(p=>p+1000); alert("전환 성공!");}} className="w-full bg-black text-white py-4 rounded-xl text-sm font-black hover:bg-[#dc2626] transition-all shadow-md">{L.convert}</button>
                  </div>
               </div>
            </div>

            {/* 02. SECURE QR */}
            <SectionHeader title={L.auth} />
            <div className="bg-gray-50 p-6 md:p-10 rounded-3xl border border-black/5 flex flex-col md:flex-row items-center gap-10 shadow-inner">
               <div className={`bg-white border-4 rounded-2xl flex flex-col items-center justify-center shadow-lg w-48 h-48 md:w-72 md:h-72 transition-all ${qrState.active ? 'border-[#dc2626]' : 'opacity-10 grayscale blur-sm'}`}>
                  {qrState.active ? (
                    <>
                      <img src={qrState.type === 'PERSONAL' ? "/qr-personal.png" : "/qr-business.png"} className="w-full h-full p-4 object-contain" alt="QR" />
                      <p className="text-[10px] font-black bg-gray-100 px-3 py-1 rounded-full mb-4 uppercase">{qrState.type}</p>
                    </>
                  ) : <p className="text-black text-xl font-black italic uppercase animate-pulse">QR 결제</p>}
               </div>
               <div className="flex-1 w-full space-y-6">
                  <div className="bg-white p-6 rounded-2xl border-2 border-black/10">
                     <p className="text-black text-sm md:text-lg font-black italic uppercase mb-4">지갑 주소 노출 없이 안전하게 거래하세요.</p>
                     <div className="flex gap-2 mb-4">
                        <button onClick={() => setQrState({...qrState, type:'PERSONAL'})} className={`flex-1 py-3 rounded-lg text-xs font-black border-2 transition-all ${qrState.type === 'PERSONAL' ? 'bg-black text-white border-black' : 'text-gray-300 border-gray-100'}`}>개인용</button>
                        <button onClick={() => setQrState({...qrState, type:'BUSINESS'})} className={`flex-1 py-3 rounded-lg text-xs font-black border-2 transition-all ${qrState.type === 'BUSINESS' ? 'bg-black text-white border-black' : 'text-gray-300 border-gray-100'}`}>기업/사업자용</button>
                     </div>
                     <div className="flex items-center gap-3">
                        <span className={`w-3 h-3 rounded-full ${qrState.active ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`}></span>
                        <p className="text-gray-500 text-xs md:text-sm font-bold uppercase">{qrState.active ? 'QR 서비스 이용 가능' : '활성화가 필요합니다'}</p>
                     </div>
                  </div>
                  <button onClick={() => {if(beomToken<50) return alert("포인트 부족"); setBeomToken(p=>p-50); setQrState({...qrState, active:true});}} className="w-full bg-black text-white py-4 rounded-xl text-sm font-black hover:bg-[#dc2626] transition-all shadow-md">{L.activate}</button>
               </div>
            </div>

            {/* 03. CREATIVE */}
            <SectionHeader title={L.creative} />
            <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-black/10 space-y-6 shadow-sm font-black">
              <div className="flex gap-8 border-b border-gray-100 pb-2">
                <button onClick={() => setHubTab('HUB')} className={`text-lg md:text-2xl font-black italic uppercase transition-all ${hubTab === 'HUB' ? 'text-black border-b-4 border-black pb-1' : 'text-gray-300'}`}>CREATIVE HUB</button>
                <button onClick={() => setHubTab('SPIRIT')} className={`text-lg md:text-2xl font-black italic uppercase transition-all ${hubTab === 'SPIRIT' ? 'text-black border-b-4 border-black pb-1' : 'text-gray-300'}`}>FAN SPIRIT</button>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {CATS.map(cat => <button key={cat} onClick={() => setCategory(cat)} className={`px-4 py-1.5 rounded-full text-[10px] md:text-xs font-black italic border transition-all whitespace-nowrap ${category === cat ? 'bg-black text-white border-black' : 'bg-white text-gray-400 border-gray-100'}`}>{cat}</button>)}
              </div>
              <div className="flex gap-2 flex-wrap">{FANS.map(fan => <button key={fan} className="px-4 py-2 bg-white border border-gray-100 rounded-full text-[10px] md:text-xs font-black text-red-600 flex items-center gap-1.5 shadow-sm">🚩 {fan}</button>)}</div>
              <div className="space-y-3">
                <input value={feed.title} onChange={(e) => setFeed({ ...feed, title: e.target.value })} placeholder="제목을 입력하세요" className="w-full bg-gray-50 border border-black/5 p-4 rounded-xl text-sm md:text-lg font-black outline-none focus:border-black placeholder-gray-400" />
                <input value={feed.link} onChange={(e) => setFeed({ ...feed, link: e.target.value })} placeholder="이미지 또는 영상 링크 (URL)" className="w-full bg-gray-50 border border-black/5 p-4 rounded-xl text-sm md:text-lg font-black outline-none focus:border-black placeholder-red-200 text-red-400" />
                <textarea value={feed.desc} onChange={(e) => setFeed({ ...feed, desc: e.target.value })} placeholder="내용을 기록하세요" className="w-full bg-gray-50 border border-black/5 p-4 rounded-xl text-xs md:text-sm font-bold h-32 outline-none focus:border-black leading-relaxed" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button onClick={() => {if(!feed.title) return; setBeomToken(p=>p-10); alert("성공!"); setFeed({title:'', link:'', desc:''});}} className="md:col-span-2 bg-black text-white py-5 rounded-2xl text-lg md:text-2xl font-black hover:bg-[#dc2626] transition-all shadow-lg">{L.post}</button>
                <button className="bg-white border-2 border-black text-black py-5 rounded-2xl text-lg md:text-xl font-black flex items-center justify-center gap-2">🚩 FAN ROOM</button>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border-l-[6px] border-[#dc2626]"><p className="text-gray-400 text-[10px] md:text-xs font-bold italic leading-none">{L.fanRoomDesc}</p></div>
            </div>

            {/* 04. GOODS */}
            <SectionHeader title={L.market} />
            <div className="bg-white p-6 rounded-[2rem] border-2 border-black/10 space-y-8 font-black">
                <div className="flex gap-4 border-b-2 border-gray-100 pb-2">
                    <button onClick={() => setMarketMode('BUY')} className={`text-lg md:text-2xl font-black italic ${marketMode === 'BUY' ? 'text-black border-b-4 border-black' : 'text-gray-300'}`}>BUY (상품 구매)</button>
                    <button onClick={() => setMarketMode('SELL')} className={`text-lg md:text-2xl font-black italic ${marketMode === 'SELL' ? 'text-black border-b-4 border-black' : 'text-gray-300'}`}>SELL (판매 등록)</button>
                </div>
                {marketMode === 'BUY' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {goods.map(g => (
                            <div key={g.id} className="bg-gray-50 p-6 rounded-2xl border flex gap-6 items-center group shadow-sm transition-all hover:border-[#dc2626]">
                                <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-xl flex items-center justify-center shadow-inner overflow-hidden shrink-0">
                                    <img src={g.img} className="w-20 h-20 object-contain group-hover:scale-110 transition-transform" alt="G" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm md:text-lg font-black uppercase mb-1">{g.name}</h4>
                                    <p className="text-gray-500 text-[10px] md:text-xs mb-3 font-bold">{g.desc}</p>
                                    <p className="text-[#dc2626] text-lg font-black mb-3">{g.price.toLocaleString()} BEOM</p>
                                    <button className="w-full py-2 bg-black text-white rounded-lg text-[10px] font-black uppercase hover:bg-[#dc2626] transition-all">구매 신청</button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-4">
                        <input value={sellItem.name} onChange={(e)=>setSellItem({...sellItem, name:e.target.value})} placeholder={L.itemName} className="w-full bg-gray-50 border-2 border-black/5 p-4 rounded-xl text-sm md:text-lg font-black outline-none focus:border-black" />
                        <input type="number" value={sellItem.price} onChange={(e)=>setSellItem({...sellItem, price:e.target.value})} placeholder={L.itemPrice} className="w-full bg-gray-50 border-2 border-black/5 p-4 rounded-xl text-sm md:text-lg font-black outline-none focus:border-black" />
                        <textarea value={sellItem.desc} onChange={(e)=>setSellItem({...sellItem, desc:e.target.value})} placeholder={L.itemDesc} className="w-full bg-gray-50 border-2 border-black/5 p-4 rounded-xl text-xs md:text-sm font-bold h-32 outline-none focus:border-black" />
                        <button onClick={()=>{setGoods([{id:Date.now(), name:sellItem.name, price:Number(sellItem.price), desc:sellItem.desc, img:"/beom-token.png"}, ...goods]); alert("상품이 등록되었습니다."); setMarketMode('BUY');}} className="w-full bg-[#dc2626] text-white py-4 rounded-xl text-lg font-black shadow-lg">상품 등록 완료</button>
                    </div>
                )}
            </div>

            {/* 05. PARTNERSHIP */}
            <SectionHeader title={L.partnership} />
            <div className="bg-black p-8 rounded-[2.5rem] border-[12px] border-[#dc2626] space-y-6 relative overflow-hidden font-black">
                <h3 className="text-white text-2xl md:text-4xl font-black italic border-l-8 border-[#dc2626] pl-4 uppercase leading-none z-10 relative">GLOBAL PARTNERSHIP</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 z-10 relative">
                    <input value={partner.corp} onChange={(e)=>setPartner({...partner, corp: e.target.value})} placeholder={L.corpName} className="bg-white/10 border border-white/10 p-4 rounded-xl text-xs md:text-lg text-white outline-none focus:border-[#dc2626] transition-all" />
                    <input value={partner.manager} onChange={(e)=>setPartner({...partner, manager: e.target.value})} placeholder={L.manager} className="bg-white/10 border border-white/10 p-4 rounded-xl text-xs md:text-lg text-white outline-none focus:border-[#dc2626] transition-all" />
                    <input value={partner.email} onChange={(e)=>setPartner({...partner, email: e.target.value})} placeholder={L.email} className="bg-white/10 border border-white/10 p-4 rounded-xl text-xs md:text-lg text-white outline-none focus:border-[#dc2626] transition-all" />
                    <input value={partner.contact} onChange={(e)=>setPartner({...partner, contact: e.target.value})} placeholder={L.contact} className="bg-white/10 border border-white/10 p-4 rounded-xl text-xs md:text-lg text-white outline-none focus:border-[#dc2626] transition-all" />
                </div>
                <textarea value={partner.msg} onChange={(e)=>setPartner({...partner, msg: e.target.value})} placeholder={L.vision} className="w-full bg-white/10 border border-white/10 p-4 rounded-2xl text-xs md:text-lg text-white h-32 outline-none focus:border-[#dc2626] transition-all z-10 relative" />
                <button onClick={()=>alert("제안서가 전송되었습니다.")} className="w-full bg-[#dc2626] text-white py-4 rounded-full text-sm md:text-xl font-black hover:bg-white hover:text-[#dc2626] transition-all shadow-xl uppercase z-10 relative">{L.submit}</button>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="fixed bottom-4 left-4 right-4 max-w-4xl mx-auto bg-white border-2 border-black p-1.5 rounded-2xl flex justify-between gap-1.5 z-[1000] shadow-2xl">
        {['KEDHEON', 'CIVIL', 'NEXUS', 'VENDOR'].map(app => (
          <button key={app} className={`flex-1 py-3.5 rounded-xl text-[10px] md:text-sm transition-all font-black text-center ${app === 'KEDHEON' ? 'bg-black text-white shadow-md' : 'text-gray-300'}`}>{app}</button>
        ))}
      </footer>
    </div>
  );
}
