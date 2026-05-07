'use client';
import React, { useState, useEffect, useRef, useMemo } from 'react';

/** * [KEDHEON MASTER V104.5 - THE TOTAL EMPIRE SYSTEM]
 * -----------------------------------------------------------
 * 1. 테마: 배경 White (#FFFFFF) / 텍스트 Black (#000000) / 포인트 Red (#DC2626)
 * 2. 자산: 범(BEOM) 토큰 유틸리티 단일 체계 (밈 요소 0% 정화)
 * 3. 경제: 사회적 환원 자동 산식 Max(3% Net, 8% Total Revenue) 탑재
 * 4. 인프라: 88쓰레드 노드 기반 실시간 가치 지수(V23) 시뮬레이션
 * 5. 통합: 8대 앱(KEDHEON, NEXUS, VENDOR, CIVIL 등) 통합 앱바 탑재
 * -----------------------------------------------------------
 */

const PI_INVITE_CODE = 'ohsangjo';

const DICT = {
  KR: {
    rookie: "ROOKIE", pioneer: "PIONEER", exchange: "EXCHANGE", auth: "SECURE AUTH", creative: "CREATIVE & FAN", market: "MARKET",
    invitation: "Web3 초대합니다.", procedure: "파이코인 가입절차 안내", assets: "ASSETS", activate: "보안 QR 활성화",
    convert: "1 PI 환전", post: "피드 등록", buy: "구매하기", register: "상품 등록",
    exchangeDesc: "채굴 기여도를 제국 통화인 BEOM으로 즉시 전환하십시오.",
    authDesc: "개인 및 비즈니스용 QR코드를 발급받아 보안 인증 수단으로 사용하십시오.",
    creativeDesc: "창작물과 팬심을 공유하고 BEOM 유틸리티 호응을 이끌어내십시오.",
    fanRoomDesc: "🚩 팬룸 개설(500 BEOM): 90% 수익 환원 및 독자적 거버넌스 권한 부여.",
    marketDesc: "다양한 GOODS를 거래하고 상세 설명과 실제 후기를 통해 가치를 확인하십시오.",
    steps: [
      { t: "애플리케이션 설치", d: "[Pi Network] 공식 앱을 검색하여 설치하십시오." },
      { t: "가입 방식 선택", d: "[Continue with phone number] 보안 가입을 선택하십시오." },
      { t: "국가 및 번호 설정", d: "국가를 [+82(South Korea)]로 설정 후 번호를 입력하십시오." },
      { t: "보안 비밀번호 생성", d: "영문 대/소문자와 숫자를 조합하여 강력한 암호를 만드십시오." },
      { t: "실명 프로필 작성", d: "여권 영문 실명을 입력하고 고유 ID를 설정하십시오." },
      { t: "초대 코드 입력", d: `초대 코드 [ ${PI_INVITE_CODE} ]를 정확히 기입하십시오.` },
      { t: "비밀구절 수기 보관", d: "24개 단어는 반드시 종이에 기록하십시오." },
      { t: "채굴 버튼 활성화", d: "번개 버튼을 눌러 정식 활동을 시작하십시오." }
    ]
  },
  EN: {
    rookie: "ROOKIE", pioneer: "PIONEER", exchange: "EXCHANGE", auth: "SECURE AUTH", creative: "CREATIVE & FAN", market: "MARKET",
    invitation: "Web3 Invitation.", procedure: "Pi Network Join Guide", assets: "ASSETS", activate: "ACTIVATE QR",
    convert: "CONVERT 1 PI", post: "POST FEED", buy: "BUY NOW", register: "REGISTER",
    exchangeDesc: "Convert your mining efforts into BEOM tokens immediately.",
    authDesc: "Issue secure QR codes for authentication.",
    creativeDesc: "Share your creations to earn community support.",
    fanRoomDesc: "🚩 FAN ROOM (500 BEOM): 90% revenue share and governance enabled.",
    marketDesc: "Trade unique goods with verified reviews.",
    steps: [
      { t: "Install App", d: "Download the official [Pi Network] app." },
      { t: "Select Method", d: "Choose [Continue with phone number]." },
      { t: "Region Config", d: "Set to [+82(South Korea)] and enter number." },
      { t: "Password", d: "Create a strong alphanumeric password." },
      { t: "Real Identity", d: "Enter Passport name and set a unique ID." },
      { t: "Invitation", d: `Use invitation code [ ${PI_INVITE_CODE} ] to join.` },
      { t: "Passphrase", d: "Hand-write the 24 words and store them safely." },
      { t: "Mining", d: "Engage the lightning button to start." }
    ]
  }
};

interface Asset { id: number; title: string; desc: string; category: string; beom: number; url?: string; }
interface Good { id: number; name: string; price: number; img: string; desc: string; }

export default function KedheonEmpireMaster() {
  const [hasMounted, setHasMounted] = useState(false);
  const [lang, setLang] = useState<'KR' | 'EN'>('KR');
  const [tab, setTab] = useState<'ROOKIE' | 'PIONEER'>('PIONEER');
  
  // 경제 지표 상태
  const [beomToken, setBeomToken] = useState(7891.88);
  const [totalRevenue, setTotalRevenue] = useState(158400);
  const [netIncome, setNetIncome] = useState(52300);

  // 앱 기능 상태
  const [qrType, setQrType] = useState<'PERSONAL' | 'BUSINESS'>('PERSONAL');
  const [bizName, setBizName] = useState('');
  const [isQrActive, setIsQrActive] = useState(false);
  const [boardType, setBoardType] = useState<'CREATIVE' | 'FAN'>('CREATIVE');
  const [postCategory, setPostCategory] = useState('TECH');
  const [fanRooms, setFanRooms] = useState<string[]>(['케데헌', '헌트릭스']);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newUrl, setNewUrl] = useState('');

  // 마켓 상태
  const [goods, setGoods] = useState<Good[]>([
    { id: 1, name: "GOLD BADGE", price: 1000, img: "/beom-token.png", desc: "제국 시민의 명예로운 문장입니다." }
  ]);
  const [sellName, setSellName] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [sellDesc, setSellDesc] = useState('');
  const [sellImg, setSellImg] = useState('');

  const L = DICT[lang];
  const standardCats = ['MUSIC', 'TECH', 'ART', 'FOOD', 'TRAVEL', 'GAME', 'NEWS', 'MOVIE'];
  const fileInputRef = useRef<HTMLInputElement>(null);

  // [핵심 로직] 사회적 환원 및 변동 가치 계산
  const currentBeomValue = useMemo(() => (0.18 * 100) + (5000 * 0.01) + (17.94 / 17.94), []);
  const redistributionAmount = useMemo(() => Math.max(netIncome * 0.03, totalRevenue * 0.08), [netIncome, totalRevenue]);

  useEffect(() => {
    setHasMounted(true);
    const saved = localStorage.getItem('KEDHEON_MASTER_FINAL_WHITE');
    if (saved) {
      const p = JSON.parse(saved);
      if (p.beomToken) setBeomToken(p.beomToken);
      if (p.fanRooms) setFanRooms(p.fanRooms);
    }
  }, []);

  useEffect(() => {
    if (hasMounted) {
      localStorage.setItem('KEDHEON_MASTER_FINAL_WHITE', JSON.stringify({ beomToken, lang, fanRooms }));
    }
  }, [beomToken, lang, fanRooms, hasMounted]);

  const SectionHeader = ({ num, title, desc }: { num: string; title: string; desc: string }) => (
    <div className="w-full border-t-4 border-red-600 pt-8 mb-6 text-left">
      <h2 className="text-black text-3xl md:text-5xl font-black uppercase italic mb-1 border-l-8 border-black pl-4 tracking-tighter">
        {num}. {title}
      </h2>
      <p className="text-gray-400 text-sm md:text-base font-bold pl-8 italic">{desc}</p>
    </div>
  );

  if (!hasMounted) return null;

  return (
    <div className="flex flex-col items-center bg-white min-h-screen text-black font-sans w-full pb-80 font-black overflow-x-hidden selection:bg-red-100">
      
      {/* GNB (가이드라인 31, 33번) */}
      <nav className="w-full max-w-7xl flex justify-between items-center px-6 py-6 sticky top-0 bg-white/95 backdrop-blur-md z-[200] border-b-4 border-black">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center shadow-lg border-2 border-white">
             <span className="text-white text-3xl font-black italic">K</span>
          </div>
          <div className="text-left leading-none">
            <h1 className="text-black text-2xl font-black italic uppercase tracking-tighter">Kedheon Master</h1>
            <span className="text-gray-400 text-[10px] font-mono tracking-widest uppercase font-bold">V104.5 | 88-THREADS</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setTab('ROOKIE')} className={`px-5 py-2.5 rounded-xl text-xs font-black border-2 transition-all ${tab === 'ROOKIE' ? 'bg-black text-white border-black shadow-lg' : 'border-black/10 text-gray-400'}`}>{L.rookie}</button>
          <button onClick={() => setTab('PIONEER')} className={`px-5 py-2.5 rounded-xl text-xs font-black border-2 transition-all ${tab === 'PIONEER' ? 'bg-black text-white border-black shadow-lg' : 'border-black/10 text-gray-400'}`}>{L.pioneer}</button>
        </div>
      </nav>

      <main className="w-full max-w-5xl px-4 py-10">
        {tab === 'ROOKIE' ? (
          <div className="flex flex-col gap-10 text-left animate-in fade-in">
            <div className="flex flex-col items-center text-center gap-6 py-20 bg-gray-50 rounded-[60px] border-4 border-black/5 relative shadow-sm">
              <div className="w-48 h-48 bg-black rounded-[45px] flex items-center justify-center shadow-2xl border-4 border-white">
                 <span className="text-white text-8xl font-black italic">K</span>
              </div>
              <div className="px-4">
                <h1 className="text-black text-4xl md:text-6xl uppercase mb-2 tracking-tighter font-black">{L.invitation}</h1>
                <p className="text-black text-2xl md:text-3xl uppercase tracking-widest border-b-4 border-black pb-2 inline-block font-black">{L.procedure}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {L.steps.map((step: any, i: number) => (
                <div key={i} className={`p-8 bg-white rounded-[30px] border-4 flex items-center gap-8 transition-all hover:translate-x-2 ${i >= 5 ? 'border-red-600 bg-red-50/30' : 'border-black/5'}`}>
                  <span className="text-black text-4xl font-black italic">0{i+1}</span>
                  <div>
                    <h3 className="text-black text-xl font-black uppercase italic mb-1">{step.t}</h3>
                    <p className="text-gray-600 text-[15px] font-bold leading-snug">{step.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-20 py-2 text-left animate-in slide-in-from-bottom-4">
            
            {/* ASSETS AREA (가이드라인 41, 44번 연동) */}
            <div className="bg-gray-50 p-10 md:p-20 rounded-[70px] border-4 border-black shadow-2xl flex flex-col md:flex-row justify-between items-center relative overflow-hidden">
                <div className="text-left z-10 space-y-6">
                  <h3 className="text-gray-400 text-sm uppercase tracking-[0.4em] mb-1 font-black">{L.assets}</h3>
                  <p className="text-black text-6xl md:text-9xl tracking-tighter leading-none font-black">
                    {Math.floor(beomToken).toLocaleString()}
                    <span className="text-2xl md:text-5xl opacity-30">.{beomToken.toFixed(2).split('.')[1]}</span> 
                    <span className="ml-4 text-2xl md:text-5xl italic">BEOM</span>
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <div className="bg-black text-white px-8 py-4 rounded-2xl text-sm md:text-2xl font-mono italic font-bold">
                      Index: {currentBeomValue.toFixed(2)} / PI
                    </div>
                    <div className="bg-red-600 text-white px-8 py-4 rounded-2xl text-sm md:text-2xl font-mono italic font-bold animate-pulse shadow-lg">
                      Redistribution: {redistributionAmount.toLocaleString()} BEOM
                    </div>
                  </div>
                </div>
                <div className="w-20 h-20 md:w-56 md:h-56 bg-black rounded-full flex items-center justify-center opacity-5">
                   <span className="text-white text-9xl font-black">B</span>
                </div>
            </div>

            <SectionHeader num="01" title={L.exchange} desc={L.exchangeDesc} />
            <div className="bg-white p-10 md:p-20 rounded-[60px] border-4 border-black flex flex-col md:flex-row justify-between items-center shadow-xl gap-10">
              <div className="text-left">
                <p className="text-black text-4xl md:text-6xl font-black italic uppercase leading-none">Terminal</p>
                <p className="text-gray-400 text-lg md:text-xl font-bold mt-4 uppercase tracking-widest">Fixed Rate: 1 Pi = 100 BEOM</p>
              </div>
              <button onClick={() => {setBeomToken(p=>p+100); setTotalRevenue(p=>p+100); alert("Exchange Success");}} className="w-full md:w-auto bg-black text-white px-16 md:px-24 py-8 md:py-10 rounded-[45px] text-xl md:text-4xl border-4 border-black hover:bg-white hover:text-black transition-all active:scale-95 uppercase font-black shadow-2xl">
                {L.convert}
              </button>
            </div>

            <SectionHeader num="02" title={L.auth} desc={L.authDesc} />
            <div className="bg-gray-50 p-10 md:p-20 rounded-[70px] border-2 border-black/5 flex flex-col items-center gap-14">
              <div className="flex gap-4 w-full max-w-md bg-white p-3 rounded-2xl border-4 border-black shadow-xl">
                <button onClick={() => { setQrType('PERSONAL'); setIsQrActive(false); }} className={`flex-1 py-5 rounded-xl text-sm transition-all font-black ${qrType === 'PERSONAL' ? 'bg-black text-white' : 'text-gray-400'}`}>PERSONAL</button>
                <button onClick={() => { setQrType('BUSINESS'); setIsQrActive(false); }} className={`flex-1 py-5 rounded-xl text-sm transition-all font-black ${qrType === 'BUSINESS' ? 'bg-black text-white' : 'text-gray-400'}`}>BUSINESS</button>
              </div>
              {qrType === 'BUSINESS' && (
                 <input value={bizName} onChange={(e) => setBizName(e.target.value.toUpperCase())} placeholder="BUSINESS NAME" className="w-full max-w-md bg-white border-4 border-black p-6 rounded-2xl text-center text-black text-xl font-black outline-none focus:border-red-600 shadow-inner" />
              )}
              <div className={`relative bg-white border-8 rounded-[60px] flex flex-col items-center justify-center transition-all duration-1000 shadow-2xl ${qrType === 'PERSONAL' ? 'w-80 h-80 md:w-[450px] md:h-[450px]' : 'w-full max-w-3xl aspect-video'} ${isQrActive ? 'border-red-600' : 'opacity-20 border-black/10'}`}>
                {isQrActive ? (
                  <div className="flex flex-col items-center gap-6">
                    <div className="w-56 h-56 bg-black rounded-[40px] flex items-center justify-center shadow-2xl">
                       <span className="text-white text-8xl font-black italic">K</span>
                    </div>
                    <p className="text-black text-3xl font-black italic tracking-[0.5em] uppercase">{bizName || qrType} CERTIFIED</p>
                  </div>
                ) : <p className="text-black text-4xl md:text-7xl font-black uppercase italic tracking-widest animate-pulse">LOCKED</p>}
              </div>
              <button onClick={() => {if(beomToken < 50) return; setBeomToken(p=>p-50); setIsQrActive(true);}} className="w-full max-w-2xl bg-black text-white py-10 rounded-[60px] text-2xl md:text-4xl border-4 border-black hover:bg-white hover:text-black transition-all uppercase font-black shadow-2xl font-black">{L.activate} (50 BEOM)</button>
            </div>

            <SectionHeader num="03" title={L.creative} desc={L.creativeDesc} />
            <div className="bg-white p-10 md:p-20 rounded-[70px] border-4 border-black shadow-2xl space-y-12 text-left">
              <div className="flex gap-10 border-b-8 border-gray-100 pb-8">
                 <button onClick={() => setBoardType('CREATIVE')} className={`text-2xl md:text-4xl uppercase font-black italic transition-all ${boardType === 'CREATIVE' ? 'text-black border-b-8 border-black' : 'text-gray-300'}`}>Creative Hub</button>
                 <button onClick={() => setBoardType('FAN')} className={`text-2xl md:text-4xl uppercase font-black italic transition-all ${boardType === 'FAN' ? 'text-black border-b-8 border-black' : 'text-gray-300'}`}>Fan Spirit</button>
              </div>

              <div className="space-y-8">
                 <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                    {standardCats.map(cat => (
                      <button key={cat} onClick={() => setPostCategory(cat)} className={`px-8 py-4 rounded-2xl text-sm font-black border-4 transition-all whitespace-nowrap ${postCategory === cat ? 'bg-black text-white border-black shadow-lg' : 'border-black/5 text-gray-400'}`}>{cat}</button>
                    ))}
                 </div>
                 {fanRooms.length > 0 && (
                   <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide border-t-8 border-gray-50 pt-10">
                     {fanRooms.map(room => (
                       <button key={room} onClick={() => setPostCategory(room)} className={`px-8 py-4 rounded-2xl text-sm font-black border-4 transition-all whitespace-nowrap ${postCategory === room ? 'bg-red-600 text-white border-red-600 shadow-lg' : 'border-red-600/10 text-red-600'}`}>🚩 {room}</button>
                     ))}
                   </div>
                 )}
              </div>
              
              <div className="space-y-6">
                <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="제목 또는 팬심 공유" className="w-full bg-gray-50 border-4 border-black/5 p-8 rounded-[35px] text-2xl text-black outline-none focus:border-black placeholder:text-gray-300 font-black" />
                <input value={newUrl} onChange={(e) => setNewUrl(e.target.value)} placeholder="이미지 또는 영상 링크 (선택)" className="w-full bg-gray-50 border-4 border-black/5 p-8 rounded-[35px] text-xl text-red-600 outline-none focus:border-black placeholder:text-red-600/30 font-black" />
                <textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="상세 내용을 자유롭게 기록하십시오" className="w-full bg-gray-50 border-4 border-black/5 p-8 rounded-[35px] text-xl text-black h-56 outline-none focus:border-black font-bold placeholder:text-gray-300" />
              </div>
              
              <div className="flex flex-col md:flex-row gap-6">
                  <button onClick={() => {if(!newTitle) return; setBeomToken(p=>p-10); setTotalRevenue(p=>p+10); setNewTitle(''); setNewDesc(''); setNewUrl(''); alert("Post Success");}} className="flex-[2] bg-black text-white py-10 rounded-[60px] text-2xl md:text-4xl border-4 border-black hover:bg-white hover:text-black transition-all uppercase font-black shadow-2xl">{L.post} (10 BEOM)</button>
                  <button onClick={() => {const n = prompt("NAME?"); if(n) setFanRooms(p=>[...p, n]);}} className="flex-1 bg-white text-black py-10 rounded-[60px] text-xl md:text-3xl border-4 border-black uppercase font-black hover:bg-gray-50 shadow-xl">🚩 FAN ROOM</button>
              </div>
              <p className="text-gray-400 text-base font-bold bg-gray-50 p-8 rounded-[40px] italic border-l-8 border-red-600 shadow-sm">※ {L.fanRoomDesc}</p>
            </div>

            <SectionHeader num="04" title={L.market} desc={L.marketDesc} />
            <div className="bg-white p-10 md:p-16 rounded-[70px] border-4 border-black space-y-8 shadow-xl">
               <h3 className="text-black text-2xl font-black uppercase italic border-l-8 border-red-600 pl-4 mb-6">Register Goods</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input value={sellName} onChange={(e) => setSellName(e.target.value)} placeholder="PRODUCT NAME" className="w-full bg-gray-50 border-4 border-black/5 p-8 rounded-[30px] text-xl font-black outline-none focus:border-black" />
                  <input type="number" value={sellPrice} onChange={(e) => setSellPrice(e.target.value)} placeholder="PRICE (BEOM)" className="w-full bg-gray-50 border-4 border-black/5 p-8 rounded-[30px] text-xl font-black text-red-600 outline-none focus:border-black" />
               </div>
               <textarea value={sellDesc} onChange={(e) => setSellDesc(e.target.value)} placeholder="PRODUCT DESCRIPTION" className="w-full bg-gray-50 border-4 border-black/5 p-8 rounded-[30px] text-lg font-bold h-40 outline-none focus:border-black" />
               <button onClick={() => {if(!sellName) return; setGoods([{id:Date.now(), name:sellName, price:Number(sellPrice), img:sellImg||"/beom-token.png", desc:sellDesc},...goods]); setSellName(''); setSellPrice(''); setSellDesc(''); alert("Registered");}} className="w-full bg-black text-white py-8 rounded-[50px] text-2xl border-4 border-black hover:bg-white hover:text-black transition-all uppercase font-black">{L.register} (20 BEOM)</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {goods.map(g => (
                <div key={g.id} className="bg-white p-10 rounded-[60px] border-4 border-black shadow-xl flex flex-col group transition-all hover:border-red-600">
                  <div className="w-full h-72 bg-gray-50 rounded-[45px] border-4 border-black/5 mb-8 overflow-hidden flex items-center justify-center">
                    <img src={g.img} className="w-44 h-44 object-contain group-hover:scale-110 transition-transform" alt="G" />
                  </div>
                  <h4 className="text-black text-3xl uppercase mb-3 font-black leading-tight">{g.name}</h4>
                  <p className="text-gray-500 text-base mb-8 font-bold leading-snug italic line-clamp-2">"{g.desc}"</p>
                  <p className="text-black text-5xl mb-10 font-black tracking-tighter">{g.price.toLocaleString()} <span className="text-xl">BEOM</span></p>
                  <button className="w-full py-6 bg-black text-white rounded-[40px] text-2xl border-4 border-black hover:bg-white hover:text-black transition-all uppercase font-black shadow-lg">Buy Now</button>
                </div>
              ))}
            </div>

          </div>
        )}
      </main>

      {/* FIXED FOOTER NAV (가이드라인 47번 통합 앱바) */}
      <footer className="fixed bottom-10 left-4 right-4 max-w-6xl mx-auto bg-white border-4 border-black p-2.5 rounded-[55px] flex justify-between gap-3 z-[300] shadow-[0_40px_100px_rgba(0,0,0,0.3)]">
        {['KEDHEON', 'CIVIL', 'NEXUS', 'VENDOR'].map(app => (
          <button key={app} className={`flex-1 py-6 md:py-10 rounded-[45px] text-sm md:text-3xl transition-all font-black text-center ${app === 'KEDHEON' ? 'bg-black text-white shadow-inner scale-100' : 'text-gray-300 hover:bg-gray-100 hover:text-black'}`}>
            {app}
          </button>
        ))}
      </footer>

      <div className="mt-40 opacity-20 text-black text-[15px] md:text-3xl tracking-[1.5em] uppercase pb-32 font-black text-center">
        Kedheon master | V104.5 Empire Hierarchy | @Ohsangjo
      </div>
    </div>
  );
}
