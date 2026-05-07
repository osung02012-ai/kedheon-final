'use client';
import React, { useState, useEffect, useRef, useMemo } from 'react';

/** * [KEDHEON MASTER V104.1 - EMPIRE TOTAL INTEGRATION]
 * -----------------------------------------------------------
 * 1. 테마: 배경 White / 텍스트 Black / 경계선 Red-600
 * 2. 철학: 밈(Meme) 요소 0%, 순수 유틸리티(BEOM Token) 100%
 * 3. 경제: Max(3% Net Income, 8% Total Revenue) 자동 환원 로직 내장
 * 4. 인프라: 88쓰레드 노드 기반 실시간 가치 산정 및 부하 분산 시뮬레이션
 * 5. 계층: 1.케데헌, 2.넥서스, 3.벤더, 4.시빌 통합 
 * -----------------------------------------------------------
 */

// [PART 1. 제국 경제 엔진 로직]
const IMPERIAL_ENGINE = {
  BASE_RATE: 100, // 1 PI = 100 BEOM
  NODE_TARGET_SCORE: 17.94,
  TOTAL_THREADS: 88,
  
  // 가이드라인 44번: 사회적 환원 자동 산식
  calculateRedistribution: (netIncome: number, totalRevenue: number) => {
    const fromNet = netIncome * 0.03;
    const fromRev = totalRevenue * 0.08;
    return Math.max(fromNet, fromRev);
  },

  // 가이드라인 41번: 유틸리티 변동 가치 산식
  calculateDynamicValue: (marketPrice: number, traffic: number, nodeScore: number) => {
    const utilityPremium = (traffic * 0.01) + (nodeScore / 17.94);
    return (marketPrice * 100) + utilityPremium;
  }
};

const PI_INVITE_CODE = 'ohsangjo';

const DICT = {
  KR: {
    rookie: "ROOKIE", pioneer: "PIONEER", exchange: "EXCHANGE", auth: "SECURE AUTH", creative: "CREATIVE & FAN", market: "MARKET",
    invitation: "Web3 초대합니다.", procedure: "파이코인 가입절차 안내", assets: "ASSETS", activate: "보안 QR 활성화",
    convert: "1 PI 환전", post: "피드 등록", buy: "구매하기", register: "상품 등록",
    exchangeDesc: "보유하신 채굴 기여도를 제국 통화인 BEOM으로 즉시 전환하십시오.",
    authDesc: "개인 및 비즈니스용 큐알코드를 발급받아 보안 인증 수단으로 사용하십시오.",
    creativeDesc: "창작물과 팬심을 공유하고 파이오니어들의 BEOM 유틸리티 호응을 이끌어내십시오.",
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
    authDesc: "Issue personal or business QR codes for secure authentication.",
    creativeDesc: "Share your creations to earn support from the community.",
    fanRoomDesc: "🚩 FAN ROOM (500 BEOM): 90% revenue share and governance enabled.",
    marketDesc: "Trade unique goods with verified descriptions and reviews.",
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

interface Asset { id: number; title: string; desc: string; category: string; beom: number; time: string; url?: string; type: 'CREATIVE' | 'FAN'; }
interface Good { id: number; name: string; price: number; img: string; desc: string; reviews: any[]; }

export default function KedheonEmpireMaster() {
  // [SYSTEM STATE]
  const [hasMounted, setHasMounted] = useState(false);
  const [lang, setLang] = useState<'KR' | 'EN'>('KR');
  const [tab, setTab] = useState<'ROOKIE' | 'PIONEER'>('PIONEER');
  const [beomToken, setBeomToken] = useState(7891.88);
  const [totalRevenue, setTotalRevenue] = useState(120500); // 누적 매출 시뮬레이션
  const [netIncome, setNetIncome] = useState(45000); // 순이익 시뮬레이션
  
  // [APP STATE]
  const [qrType, setQrType] = useState<'PERSONAL' | 'BUSINESS'>('PERSONAL');
  const [isQrActive, setIsQrActive] = useState(false);
  const [postCategory, setPostCategory] = useState('TECH');
  const [fanRooms, setFanRooms] = useState<string[]>(['케데헌', '헌트릭스']);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [goods, setGoods] = useState<Good[]>([
    { id: 1, name: "GOLD BADGE", price: 1000, img: "/beom-token.png", desc: "순금 각인이 새겨진 제국 시민의 영광입니다.", reviews: [] }
  ]);

  const L = DICT[lang];
  const standardCats = ['MUSIC', 'TECH', 'ART', 'FOOD', 'TRAVEL', 'GAME', 'NEWS', 'MOVIE'];
  
  // [REAL-TIME CALCULATION]
  const currentBeomValue = useMemo(() => IMPERIAL_ENGINE.calculateDynamicValue(0.18, 5000, 17.94), []);
  const currentRedistribution = useMemo(() => IMPERIAL_ENGINE.calculateRedistribution(netIncome, totalRevenue), [netIncome, totalRevenue]);

  useEffect(() => {
    setHasMounted(true);
    const saved = localStorage.getItem('KEDHEON_EMPIRE_V104_FINAL');
    if (saved) {
      const p = JSON.parse(saved);
      if (p.beomToken) setBeomToken(p.beomToken);
      if (p.fanRooms) setFanRooms(p.fanRooms);
    }
  }, []);

  useEffect(() => {
    if (hasMounted) {
      localStorage.setItem('KEDHEON_EMPIRE_V104_FINAL', JSON.stringify({ beomToken, lang, fanRooms, assets }));
    }
  }, [beomToken, lang, fanRooms, assets, hasMounted]);

  const handleExchange = () => {
    setBeomToken(p => p + 100);
    setTotalRevenue(p => p + 100);
    alert(lang === 'KR' ? "1 PI가 100 BEOM으로 환전되었습니다." : "Converted 1 PI to 100 BEOM");
  };

  const handleCreateFanRoom = () => {
    const name = prompt(lang === 'KR' ? "개설할 팬룸 명칭을 입력하십시오." : "Enter Fan Room Name");
    if (name && name.trim()) {
      if (beomToken < 500) return alert("Insufficient BEOM");
      setBeomToken(p => p - 500);
      setFanRooms(prev => [...prev, name.trim()]);
    }
  };

  const SectionHeader = ({ num, title, desc }: { num: string; title: string; desc: string }) => (
    <div className="w-full border-t-2 border-red-600 pt-8 mb-4 text-left">
      <h2 className="text-black text-2xl md:text-4xl font-black uppercase italic mb-1 border-l-8 border-black pl-4 tracking-tighter">
        {num}. {title}
      </h2>
      <p className="text-gray-500 text-[12px] md:text-[14px] font-bold leading-tight pl-6 italic">{desc}</p>
    </div>
  );

  if (!hasMounted) return null;

  return (
    <div className="flex flex-col items-center bg-white min-h-screen text-black font-sans w-full pb-80 font-black overflow-x-hidden selection:bg-red-100">
      
      {/* GLOBAL NAVIGATION BAR */}
      <nav className="w-full max-w-7xl flex justify-between items-center px-6 py-5 sticky top-0 bg-white/95 backdrop-blur-xl z-[200] border-b-4 border-black">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center shadow-lg">
             <span className="text-white text-2xl font-black italic">K</span>
          </div>
          <div className="text-left leading-none">
            <h1 className="text-black text-2xl font-black italic uppercase tracking-tighter">Kedheon Empire</h1>
            <span className="text-gray-400 text-[10px] font-mono tracking-widest uppercase font-bold">V104.1 | 88-THREADS</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex bg-gray-100 rounded-xl p-1 border-2 border-black/5">
            <button onClick={() => setLang('KR')} className={`px-4 py-2 rounded-lg text-xs transition-all font-black ${lang === 'KR' ? 'bg-black text-white shadow-md' : 'text-gray-400'}`}>KR</button>
            <button onClick={() => setLang('EN')} className={`px-4 py-2 rounded-lg text-xs transition-all font-black ${lang === 'EN' ? 'bg-black text-white shadow-md' : 'text-gray-400'}`}>EN</button>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setTab('ROOKIE')} className={`px-5 py-2.5 rounded-xl text-xs font-black border-2 transition-all ${tab === 'ROOKIE' ? 'bg-black text-white border-black shadow-lg' : 'border-black/10 text-gray-400'}`}>{L.rookie}</button>
            <button onClick={() => setTab('PIONEER')} className={`px-5 py-2.5 rounded-xl text-xs font-black border-2 transition-all ${tab === 'PIONEER' ? 'bg-black text-white border-black shadow-lg' : 'border-black/10 text-gray-400'}`}>{L.pioneer}</button>
          </div>
        </div>
      </nav>

      <div className="w-full max-w-5xl px-4 py-10">
        {tab === 'ROOKIE' ? (
          <div className="flex flex-col gap-10 text-left animate-in fade-in duration-500">
            <div className="flex flex-col items-center text-center gap-6 py-16 bg-gray-50 rounded-[60px] border-4 border-black/5 relative overflow-hidden">
              <div className="w-48 h-48 bg-black rounded-[45px] flex items-center justify-center shadow-2xl relative z-10 border-4 border-white">
                 <span className="text-white text-8xl font-black italic">K</span>
              </div>
              <div className="relative z-10 px-4">
                <h1 className="text-black text-4xl md:text-6xl uppercase mb-2 tracking-tighter font-black">{L.invitation}</h1>
                <p className="text-black text-2xl md:text-3xl uppercase tracking-widest border-b-4 border-black pb-2 inline-block font-black">{L.procedure}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {L.steps.map((step: any, i: number) => (
                <div key={i} className={`p-8 bg-white rounded-[30px] border-4 flex items-center gap-8 transition-all hover:translate-x-2 ${i >= 5 ? 'border-red-600 bg-red-50/30' : 'border-black/5'}`}>
                  <span className="text-black text-3xl font-black italic">0{i+1}</span>
                  <div>
                    <h3 className="text-black text-xl font-black uppercase italic mb-1">{step.t}</h3>
                    <p className="text-gray-600 text-[15px] font-bold leading-snug">{step.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-20 py-2 text-left animate-in slide-in-from-bottom-4 duration-700">
            
            {/* [PART 5. 경제 및 사회적 환원 공정 실구현] */}
            <div className="bg-gray-50 p-10 md:p-16 rounded-[60px] border-4 border-black shadow-2xl flex flex-col md:flex-row justify-between items-center relative overflow-hidden group">
                <div className="text-left z-10 space-y-4">
                  <h3 className="text-gray-400 text-sm uppercase tracking-[0.3em] mb-1 font-black">{L.assets}</h3>
                  <p className="text-black text-6xl md:text-9xl tracking-tighter leading-none font-black">
                    {Math.floor(beomToken).toLocaleString()}
                    <span className="text-2xl md:text-5xl opacity-40">.{beomToken.toFixed(2).split('.')[1]}</span> 
                    <span className="ml-3 text-2xl md:text-5xl italic">BEOM</span>
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <div className="bg-black text-white px-6 py-3 rounded-2xl text-sm md:text-xl font-mono italic font-bold tracking-tight">
                      Index: {currentBeomValue.toFixed(2)} / PI
                    </div>
                    <div className="bg-red-600 text-white px-6 py-3 rounded-2xl text-sm md:text-xl font-mono italic font-bold tracking-tight shadow-lg animate-pulse">
                      Redistribution: {currentRedistribution.toLocaleString()} BEOM
                    </div>
                  </div>
                </div>
                <div className="mt-8 md:mt-0 w-32 h-32 md:w-64 md:h-64 bg-black rounded-full flex items-center justify-center opacity-5 group-hover:opacity-10 transition-opacity">
                   <span className="text-white text-[150px] font-black">B</span>
                </div>
            </div>

            {/* [PART 2. 인프라 최적화 정보] */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { l: "CPU THREADS", v: "88/88", c: "text-black" },
                { l: "NODE SCORE", v: "17.94", c: "text-black" },
                { l: "PROTOCOL", v: "V23 ACTIVE", c: "text-red-600" },
                { l: "RESERVE", v: "31.8B BEOM", c: "text-black" }
              ].map(stat => (
                <div key={stat.l} className="bg-white p-6 rounded-[30px] border-4 border-black shadow-md text-center">
                  <p className="text-gray-400 text-[10px] font-black uppercase mb-1 tracking-widest">{stat.l}</p>
                  <p className={`text-xl font-black ${stat.c}`}>{stat.v}</p>
                </div>
              ))}
            </div>

            <SectionHeader num="01" title={L.exchange} desc={L.exchangeDesc} />
            <div className="bg-white p-8 md:p-16 rounded-[50px] border-4 border-black flex flex-col md:flex-row justify-between items-center shadow-xl gap-8">
              <div className="text-left">
                <p className="text-black text-3xl md:text-5xl font-black italic uppercase leading-none">Terminal</p>
                <p className="text-gray-400 text-sm md:text-lg font-bold mt-3 uppercase tracking-widest">Fixed Rate: 1 Pi = 100 BEOM</p>
              </div>
              <button onClick={handleExchange} className="w-full md:w-auto bg-black text-white px-12 md:px-20 py-6 md:py-8 rounded-[35px] text-lg md:text-3xl border-4 border-black hover:bg-white hover:text-black transition-all active:scale-95 uppercase font-black shadow-2xl">
                {L.convert}
              </button>
            </div>

            <SectionHeader num="02" title={L.auth} desc={L.authDesc} />
            <div className="bg-gray-50 p-10 md:p-20 rounded-[60px] border-2 border-black/5 flex flex-col items-center gap-12">
              <div className="flex gap-4 w-full max-w-md bg-white p-2 rounded-2xl border-4 border-black shadow-lg">
                <button onClick={() => { setQrType('PERSONAL'); setIsQrActive(false); }} className={`flex-1 py-4 rounded-xl text-sm transition-all font-black ${qrType === 'PERSONAL' ? 'bg-black text-white shadow-inner' : 'text-gray-400'}`}>PERSONAL</button>
                <button onClick={() => { setQrType('BUSINESS'); setIsQrActive(false); }} className={`flex-1 py-4 rounded-xl text-sm transition-all font-black ${qrType === 'BUSINESS' ? 'bg-black text-white shadow-inner' : 'text-gray-400'}`}>BUSINESS</button>
              </div>
              <div className={`relative bg-white border-8 rounded-[60px] flex flex-col items-center justify-center transition-all duration-1000 overflow-hidden shadow-2xl ${qrType === 'PERSONAL' ? 'w-72 h-72 md:w-96 md:h-96' : 'w-full max-w-2xl aspect-video'} ${isQrActive ? 'border-red-600 rotate-0 scale-100' : 'opacity-20 border-black/10 rotate-3 scale-95'}`}>
                {isQrActive ? (
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-40 h-40 bg-black rounded-3xl flex items-center justify-center">
                       <span className="text-white text-6xl font-black">QR</span>
                    </div>
                    <p className="text-black text-2xl font-black italic uppercase tracking-[0.5em]">{qrType} ACTIVE</p>
                  </div>
                ) : <p className="text-black text-3xl md:text-6xl font-black uppercase italic tracking-[0.2em] animate-pulse">System Locked</p>}
              </div>
              <button onClick={() => {if(beomToken < 50) return; setBeomToken(p=>p-50); setIsQrActive(true);}} className="w-full max-w-lg bg-black text-white py-8 md:py-10 rounded-[50px] text-xl md:text-3xl border-4 border-black hover:bg-white hover:text-black transition-all uppercase font-black shadow-[0_20px_50px_rgba(0,0,0,0.2)]">
                보안 QR 활성화 (50 BEOM)
              </button>
            </div>

            <SectionHeader num="03" title={L.creative} desc={L.creativeDesc} />
            <div className="bg-white p-10 md:p-16 rounded-[60px] border-4 border-black shadow-xl space-y-12 text-left">
              <div className="flex gap-8 border-b-4 border-gray-100 pb-6">
                 <button onClick={() => setBoardType('CREATIVE')} className={`text-xl md:text-3xl uppercase font-black italic transition-all ${boardType === 'CREATIVE' ? 'text-black border-b-8 border-black' : 'text-gray-300'}`}>Creative Hub</button>
                 <button onClick={() => setBoardType('FAN')} className={`text-xl md:text-3xl uppercase font-black italic transition-all ${boardType === 'FAN' ? 'text-black border-b-8 border-black' : 'text-gray-300'}`}>Fan Spirit</button>
              </div>

              <div className="space-y-6">
                 <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                    {standardCats.map(cat => (
                      <button key={cat} onClick={() => setPostCategory(cat)} className={`px-6 py-3 rounded-2xl text-xs md:text-sm font-black border-4 transition-all whitespace-nowrap ${postCategory === cat ? 'bg-black text-white border-black shadow-lg' : 'border-black/5 text-gray-400'}`}>{cat}</button>
                    ))}
                 </div>
                 {fanRooms.length > 0 && (
                   <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide border-t-4 border-gray-50 pt-6">
                     {fanRooms.map(room => (
                       <button key={room} onClick={() => setPostCategory(room)} className={`px-6 py-3 rounded-2xl text-xs md:text-sm font-black border-4 transition-all whitespace-nowrap ${postCategory === room ? 'bg-red-600 text-white border-red-600 shadow-lg' : 'border-red-600/10 text-red-600'}`}>🚩 {room}</button>
                     ))}
                   </div>
                 )}
              </div>
              
              <div className="space-y-6">
                <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="제목 또는 팬심 공유" className="w-full bg-gray-50 border-4 border-black/5 p-8 rounded-3xl text-xl text-black outline-none focus:border-black placeholder:text-gray-300 font-black" />
                <textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="상세 내용을 자유롭게 기록하십시오" className="w-full bg-gray-50 border-4 border-black/5 p-8 rounded-3xl text-lg text-black h-48 outline-none focus:border-black font-bold placeholder:text-gray-300" />
              </div>
              
              <div className="flex flex-col md:flex-row gap-6">
                  <button onClick={() => {if(!newTitle) return; setBeomToken(p=>p-10); setTotalRevenue(p=>p+10); setNewTitle(''); setNewDesc(''); alert("등록 완료");}} className="flex-[2] bg-black text-white py-8 md:py-10 rounded-[50px] text-xl md:text-3xl border-4 border-black hover:bg-white hover:text-black transition-all uppercase font-black shadow-2xl">
                    {L.post} (10 BEOM)
                  </button>
                  <button onClick={handleCreateFanRoom} className="flex-1 bg-white text-black py-8 md:py-10 rounded-[50px] text-lg md:text-2xl border-4 border-black uppercase font-black hover:bg-gray-50 shadow-lg">
                    🚩 FAN ROOM
                  </button>
              </div>
              <p className="text-gray-400 text-sm md:text-base font-bold leading-tight bg-gray-50 p-6 rounded-[30px] italic border-l-8 border-red-600">
                ※ {L.fanRoomDesc}
              </p>
            </div>

          </div>
        )}
      </div>

      {/* FOOTER NAVIGATION - 가이드라인 47번 통합 앱바 */}
      <footer className="fixed bottom-8 left-4 right-4 max-w-5xl mx-auto bg-white border-4 border-black p-2 rounded-[45px] flex justify-between gap-2 z-[300] shadow-[0_30px_100px_rgba(0,0,0,0.3)]">
        {['KEDHEON', 'CIVIL', 'NEXUS', 'VENDOR'].map(app => (
          <button key={app} className={`flex-1 py-5 md:py-7 rounded-[35px] text-xs md:text-2xl transition-all font-black text-center ${app === 'KEDHEON' ? 'bg-black text-white shadow-inner scale-100' : 'text-gray-300 hover:bg-gray-100 hover:text-black'}`}>
            {app}
          </button>
        ))}
      </footer>

      <div className="mt-32 opacity-20 text-black text-[12px] md:text-2xl tracking-[1.5em] uppercase pb-24 font-black text-center">
        Kedheon master | V104.1 Empire Hierarchy | @Ohsangjo
      </div>
    </div>
  );
}
