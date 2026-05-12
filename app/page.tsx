'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';

/** * [KEDHEON MASTER V290.0 - THE FINAL ECOSYSTEM SOURCE]
 * -----------------------------------------------------------
 * 1. 규모: 약 380열 규모의 통합 풀 소스 (Full Logic 포함)
 * 2. 구조: KEDHEON(자산), CIVIL(인증), NEXUS(AI), VENDOR(마켓) 완전 통합
 * 3. 디자인: Kedheon Red(#dc2626) & High-Contrast Black 테마
 * 4. 특징: 다국어 사전(KR/EN), 4대 앱 스위칭, 실시간 환전 및 검증 시뮬레이터
 * -----------------------------------------------------------
 */

// --- TYPES & INTERFACES ---
type AppType = 'KEDHEON' | 'CIVIL' | 'NEXUS' | 'VENDOR';
type Lang = 'KR' | 'EN';

interface Step { t: string; d: string; active?: boolean; }
interface GoodsItem { id: number; name: string; price: number; img: string; desc: string; tag: string; }

// --- CONSTANTS & DICTIONARY ---
const PI_INVITE_CODE = 'ohsangjo';
const CATEGORIES = ['CCM', '뮤지션', 'MUSIC', 'TECH', 'ART', 'NEWS'];

const DICT = {
  KR: {
    portalStatus: "현재 하위 각 앱으로의 연동이 진행 중인 통합 포털 앱입니다.",
    exchangeTitle: "01. 범토큰 전환 및 핵심 기능",
    exchangeDesc: "채굴한 파이코인을 범토큰으로 1,000배 가치로 전환하십시오.",
    authTitle: "02. 보안 큐알코드 (지갑보호)",
    authDesc: "지갑 주소 노출 없이 안전하게 결제하고 인증하십시오.",
    fandomTitle: "03. 팬심 토큰 보상 시스템",
    fandomDesc: "팬심을 공유하고 기여에 따른 범토큰 보상을 받으십시오.",
    marketTitle: "04. 굿즈 판매 및 구입",
    marketDesc: "한정판 굿즈를 거래하거나 본인의 아이템을 등록하십시오.",
    partnerTitle: "05. 글로벌 파트너십",
    partnerDesc: "B2B 협업 및 글로벌 비즈니스 제안을 접수합니다.",
    rookieTitle: "Web3 파이코인 시작하기",
    rookieDesc: "인류 최대의 네트워크 생태계에 합류하는 8단계 가이드",
    assetsLabel: "보유 자산 (ASSETS)",
    convertBtn: "지금 환전하기",
    nodeLabel: "노드 점수",
    rtLabel: "실시간 기여",
    steps: [
      { t: "공식 앱 설치", d: "스마트폰 스토어에서 Pi Network를 검색하세요." },
      { t: "가입 방식 선택", d: "Phone number 가입을 강력히 권장합니다." },
      { t: "국가 설정", d: "South Korea(+82) 선택 후 번호를 입력하세요." },
      { t: "비밀번호 설정", d: "영문 대/소문자와 숫자를 조합하여 설정하세요." },
      { t: "프로필 작성", d: "여권 영문 성함과 사용할 ID를 정확히 입력하세요." },
      { t: "초대 코드 입력", d: `초대 코드 [ ${PI_INVITE_CODE} ] 를 입력하세요.`, active: true },
      { t: "비밀구절 보관", d: "24개 단어는 반드시 종이에 수기 기록하여 보관하세요." },
      { t: "채굴 시작", d: "매일 24시간마다 번개 버튼을 눌러 채굴을 활성화하세요." }
    ]
  },
  EN: {
    portalStatus: "Integrated Portal App: Connectivity for sub-apps in progress.",
    exchangeTitle: "01. BEOM CONVERSION & CORE",
    exchangeDesc: "Convert your mined Pi into BEOM at 1,000x value.",
    authTitle: "02. SECURE QR CODE",
    authDesc: "Pay and authenticate safely without exposing address.",
    fandomTitle: "03. FANDOM REWARD SYSTEM",
    fandomDesc: "Share spirit and earn BEOM rewards based on contribution.",
    marketTitle: "04. GOODS MARKET",
    marketDesc: "Trade limited goods or register your own items.",
    partnerTitle: "05. GLOBAL PARTNERSHIP",
    partnerDesc: "Accepting B2B collaboration and global business proposals.",
    rookieTitle: "JOIN PI NETWORK GUIDE",
    rookieDesc: "8-step guide to join the world's largest ecosystem.",
    assetsLabel: "TOTAL ASSETS",
    convertBtn: "CONVERT NOW",
    nodeLabel: "NODE SCORE",
    rtLabel: "REAL-TIME",
    steps: [
      { t: "Install App", d: "Search for Pi Network on the App Store/Play Store." },
      { t: "Method", d: "We highly recommend signing up with a Phone Number." },
      { t: "Country", d: "Select South Korea(+82) and enter your phone." },
      { t: "Password", d: "Combine Upper/Lower case and Numbers." },
      { t: "Profile", d: "Enter your passport name and unique ID." },
      { t: "Invite Code", d: `Enter [ ${PI_INVITE_CODE} ] to join.`, active: true },
      { t: "Passphrase", d: "Handwrite 24 words on paper and store safely." },
      { t: "Mining", d: "Tap the lightning bolt every 24 hours to start." }
    ]
  }
};

// --- COMPONENTS ---
const SectionHeader = ({ title, desc }: { title: string; desc: string; }) => (
  <div className="w-full border-t-2 border-[#dc2626] pt-4 mb-4 text-left">
    <div className="flex items-center gap-2 mb-1.5">
      <div className="w-1.5 h-7 bg-black"></div>
      <h2 className="text-black text-xl md:text-2xl font-black italic uppercase tracking-tighter leading-none">{title}</h2>
    </div>
    <p className="text-gray-400 text-[10px] md:text-xs font-bold pl-4 italic leading-none">{desc}</p>
  </div>
);

export default function KedheonMasterSystem() {
  const [hasMounted, setHasMounted] = useState(false);
  const [lang, setLang] = useState<Lang>('KR');
  const [app, setApp] = useState<AppType>('KEDHEON');
  const [tab, setTab] = useState<'MAIN' | 'ROOKIE'>('MAIN');
  const [beomBalance, setBeomBalance] = useState(7891.88);
  const [piBalance, setPiBalance] = useState(124.55);
  const [qrActive, setQrActive] = useState(false);

  useEffect(() => { setHasMounted(true); }, []);

  const handleCopy = useCallback(() => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(PI_INVITE_CODE);
      alert("Pioneer Invite Code Copied!");
    }
  }, []);

  const L = DICT[lang];

  // --- APP-SPECIFIC CONTENT MAPPING ---
  const renderContent = useMemo(() => {
    if (tab === 'ROOKIE') {
      return (
        <div className="flex flex-col gap-3 animate-in fade-in duration-700">
          <div className="bg-gray-50 p-6 rounded-[2.5rem] border border-black/5 flex flex-col items-center gap-4 mb-2 shadow-inner">
             <img src="/kedheon-character.png" className="w-32 h-32 md:w-48 md:h-48 drop-shadow-2xl" alt="K" />
             <div className="text-center">
               <h3 className="text-black text-xl md:text-2xl font-black italic uppercase">{L.rookieTitle}</h3>
               <p className="text-[#dc2626] text-[10px] md:text-xs font-bold uppercase mt-1">{L.rookieDesc}</p>
             </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {L.steps.map((s, i) => (
              <div key={i} className={`p-5 rounded-3xl border flex items-center gap-5 transition-all ${s.active ? 'border-[#dc2626] bg-red-50/10 shadow-md' : 'bg-white border-gray-50'}`}>
                <span className={`text-4xl font-black italic tracking-tighter ${s.active ? 'text-[#dc2626]' : 'text-gray-100'}`}>0{i + 1}</span>
                <div className="text-left">
                  <h4 className="text-black text-xs font-black italic leading-tight mb-1">{s.t}</h4>
                  <p className="text-gray-400 text-[10px] font-bold leading-tight">{s.d}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-8 bg-black text-white rounded-[2.5rem] text-center border-4 border-[#dc2626] shadow-2xl group cursor-pointer active:scale-95 transition-all" onClick={handleCopy}>
            <p className="text-[10px] italic text-gray-500 font-black mb-2 tracking-[0.3em] uppercase">CLICK TO COPY CODE</p>
            <div className="text-[#dc2626] text-5xl md:text-7xl font-black italic tracking-tighter leading-none group-hover:scale-105 transition-transform">{PI_INVITE_CODE}</div>
          </div>
        </div>
      );
    }

    switch (app) {
      case 'KEDHEON':
        return (
          <div className="flex flex-col gap-6 animate-in slide-in-from-bottom-5 duration-700">
            {/* ASSET BOX */}
            <div className="w-full bg-white p-7 rounded-[3rem] border-2 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,0.05)] relative overflow-hidden group">
              <h3 className="text-gray-300 text-[10px] uppercase tracking-[0.25em] font-black mb-4">{L.assetsLabel}</h3>
              <div className="relative z-10 text-left">
                <div className="flex items-baseline gap-1">
                  <span className="text-black text-5xl md:text-7xl font-black tracking-tighter">{Math.floor(beomBalance).toLocaleString()}</span>
                  <span className="text-2xl text-gray-200 font-black">.{beomBalance.toFixed(2).split('.')[1]}</span>
                  <span className="ml-3 text-3xl italic font-black text-[#dc2626]">BEOM</span>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div>
                    <p className="text-gray-400 text-sm font-black italic">≈ {piBalance.toLocaleString()} PI</p>
                    <div className="flex gap-2 mt-4">
                      <span className="bg-black text-white px-3 py-1 rounded-md text-[9px] font-mono font-black">{L.nodeLabel}: 18.02</span>
                      <span className="bg-[#dc2626] text-white px-3 py-1 rounded-md text-[9px] font-mono font-black italic">{L.rtLabel}: 15,080</span>
                    </div>
                  </div>
                  <img src="/beom-token.png" className="w-28 h-28 md:w-44 md:h-44 opacity-90 group-hover:rotate-12 transition-all duration-700" alt="B" />
                </div>
              </div>
            </div>

            {/* PORTAL STATUS */}
            <div className="w-full bg-gray-900 py-2.5 px-5 rounded-2xl flex items-center justify-center gap-3">
               <span className="w-2 h-2 bg-red-600 rounded-full animate-ping shadow-[0_0_10px_#dc2626]"></span>
               <p className="text-white text-[10px] md:text-xs font-black leading-none uppercase tracking-tight opacity-90">{L.portalStatus}</p>
            </div>

            {/* EXCHANGE SECTION */}
            <SectionHeader title={L.exchangeTitle} desc={L.exchangeDesc} />
            <div className="bg-white p-6 rounded-[2rem] border border-black/5 shadow-inner flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5 text-left border-r border-gray-50 pr-4">
                   {["1. 실시간 1,000배 전환", "2. 보안 암호화 결제", "3. 생태계 기여 보상"].map((txt, i) => (
                     <p key={i} className="text-[11px] font-black text-gray-700 leading-none">▶ {txt}</p>
                   ))}
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-2xl">
                   <p className="text-black text-xs font-black italic mb-2">1 PI = 1,000 BEOM</p>
                   <button onClick={() => { if(piBalance < 1) return; setPiBalance(p=>p-1); setBeomBalance(p=>p+1000); }} 
                           className="w-full bg-[#dc2626] text-white py-3 rounded-xl text-xs font-black shadow-xl hover:bg-black transition-all">
                     {L.convertBtn}
                   </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'CIVIL':
        return (
          <div className="flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-500">
            <SectionHeader title={L.authTitle} desc={L.authDesc} />
            <div className="bg-gray-50 p-8 rounded-[3rem] border border-black/5 flex flex-col items-center shadow-inner">
               <div className={`w-48 h-48 md:w-64 md:h-64 bg-white border-2 rounded-3xl flex items-center justify-center shadow-2xl transition-all ${qrActive ? 'border-[#dc2626]' : 'opacity-10 grayscale blur-lg'}`}>
                  {qrActive ? <img src="/qr-personal.png" className="w-full h-full p-4" alt="QR" /> : <p className="text-black font-black italic">ENCRYPTED</p>}
               </div>
               <button onClick={() => { if(beomBalance < 50) return; setBeomBalance(p=>p-50); setQrActive(true); }}
                       className="mt-8 w-full max-w-xs bg-black text-white py-4 rounded-2xl text-sm font-black shadow-xl hover:bg-[#dc2626] transition-all uppercase tracking-widest">
                 보안 QR 활성화 (50 BEOM)
               </button>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-black/5 text-left">
               <h4 className="text-black text-sm font-black italic mb-2 border-l-4 border-[#dc2626] pl-3 uppercase">KaaS Verification System</h4>
               <p className="text-gray-400 text-[10px] font-bold leading-relaxed italic">파이오니어님의 검증 데이터는 암호화되어 분산 처리됩니다. 현재까지 2,341건의 검증 보상이 확정되었습니다.</p>
            </div>
          </div>
        );

      case 'NEXUS':
        return (
          <div className="flex flex-col gap-6 animate-in slide-in-from-right-5 duration-700">
            <SectionHeader title="NEXUS AI ANALYTICS" desc="인공지능 기반 실시간 노드 지표 분석" />
            <div className="grid grid-cols-2 gap-4">
               <div className="bg-white p-6 rounded-[2rem] border-2 border-black shadow-lg text-left">
                  <p className="text-[9px] text-gray-300 font-black uppercase mb-1">Node Score</p>
                  <p className="text-4xl font-black italic tracking-tighter">18.02</p>
               </div>
               <div className="bg-black p-6 rounded-[2rem] text-left shadow-xl">
                  <p className="text-[9px] text-gray-500 font-black uppercase mb-1">Efficiency</p>
                  <p className="text-4xl font-black italic tracking-tighter text-[#dc2626]">98%</p>
               </div>
            </div>
            <div className="bg-gray-950 p-8 rounded-[3rem] text-left relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-[#dc2626] blur-[70px] opacity-20"></div>
               <h4 className="text-white text-lg font-black italic mb-4 border-b border-white/10 pb-2">AI 진단 리포트</h4>
               <div className="space-y-4 relative z-10">
                  {["하드웨어 성능 최적화 완료", "네트워크 지연율 0.02ms 탐지", "분산 연산 가중치 1.5배 적용"].map((t, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-[#dc2626] rounded-full shadow-[0_0_10px_#dc2626]"></div>
                      <p className="text-gray-400 text-xs font-bold italic">{t}</p>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        );

      case 'VENDOR':
        return (
          <div className="flex flex-col gap-6 animate-in slide-in-from-left-5 duration-700">
            <SectionHeader title={L.marketTitle} desc={L.marketDesc} />
            <div className="grid grid-cols-2 gap-4">
              {[
                { n: "골드 뱃지", p: 1000, i: "/beom-token.png", t: "LIMITED" },
                { n: "노드 키", p: 5000, i: "/node-icon.png", t: "TECH" },
                { n: "마스터 굿즈", p: 2500, i: "/kedheon-character.png", t: "EXCLUSIVE" },
                { n: "기념 주화", p: 1500, i: "/beom-token.png", t: "COLLECT" }
              ].map((g, i) => (
                <div key={i} className="bg-white p-5 rounded-[2.5rem] border border-black/5 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
                   <span className="absolute top-4 right-4 bg-black text-white text-[8px] font-black px-2 py-0.5 rounded-full z-10">{g.t}</span>
                   <div className="w-full aspect-square bg-gray-50 rounded-3xl mb-4 flex items-center justify-center p-4 shadow-inner group-hover:scale-105 transition-transform">
                      <img src={g.i} className="w-16 h-16 drop-shadow-xl opacity-90" alt="G" />
                   </div>
                   <div className="text-left">
                      <h5 className="text-[11px] font-black uppercase mb-1 truncate">{g.n}</h5>
                      <p className="text-[#dc2626] text-sm font-black italic leading-none">{g.p.toLocaleString()} <span className="text-[8px]">BEOM</span></p>
                      <button className="w-full mt-3 py-2 bg-black text-white rounded-xl text-[9px] font-black uppercase shadow-lg active:scale-90 transition-transform">BUY</button>
                   </div>
                </div>
              ))}
            </div>
            <button className="w-full border-2 border-black py-4 rounded-[2rem] text-xs font-black italic hover:bg-black hover:text-white transition-all">+ SELL YOUR ITEM</button>
          </div>
        );
    }
  }, [app, tab, beomBalance, piBalance, qrActive, lang, L]);

  if (!hasMounted) return <div className="bg-white min-h-screen" />;

  return (
    <div className="flex flex-col items-center bg-white min-h-screen text-black font-sans w-full pb-36 font-black selection:bg-red-50 overflow-x-hidden">
      
      {/* NAVIGATION */}
      <nav className="w-full max-w-lg flex justify-between items-center px-8 py-6 sticky top-0 bg-white/90 backdrop-blur-xl z-[500] border-b border-gray-50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center shadow-2xl border-2 border-white transform hover:rotate-6 transition-transform">
            <img src="/kedheon-character.png" className="w-9 h-9" alt="K" />
          </div>
          <div className="text-left leading-none">
            <h1 className="text-black text-lg font-black italic uppercase tracking-tighter">{app}</h1>
            <span className="text-gray-300 text-[9px] font-mono tracking-[0.4em] uppercase">V290.0 MASTER</span>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="bg-gray-100 p-1 rounded-xl flex gap-1 border border-black/5">
             <button onClick={() => setLang('KR')} className={`px-2.5 py-1 rounded-lg text-[9px] font-black ${lang === 'KR' ? 'bg-black text-white' : 'text-gray-400'}`}>KR</button>
             <button onClick={() => setLang('EN')} className={`px-2.5 py-1 rounded-lg text-[9px] font-black ${lang === 'EN' ? 'bg-black text-white' : 'text-gray-400'}`}>EN</button>
          </div>
          <button onClick={() => setTab(tab === 'MAIN' ? 'ROOKIE' : 'MAIN')} 
                  className={`px-5 py-2.5 rounded-xl text-[10px] font-black border-2 transition-all shadow-lg active:scale-95 ${tab === 'ROOKIE' ? 'bg-[#dc2626] text-white border-[#dc2626]' : 'bg-black text-white border-black'}`}>
            {tab === 'ROOKIE' ? 'MAIN' : 'ROOKIE'}
          </button>
        </div>
      </nav>

      {/* DYNAMIC CONTENT AREA */}
      <main className="w-full max-w-md px-8 pt-4 flex flex-col gap-6 min-h-[70vh]">
        {renderContent}
      </main>

      {/* OMNI-PORTAL FOOTER */}
      <footer className="fixed bottom-10 left-1/2 -translate-x-1/2 w-[92%] max-w-md bg-white border-2 border-black p-2 rounded-[2.5rem] flex justify-between gap-2 z-[1000] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.35)]">
        {(['KEDHEON', 'CIVIL', 'NEXUS', 'VENDOR'] as AppType[]).map(type => (
          <button 
            key={type} 
            onClick={() => { setApp(type); setTab('MAIN'); }}
            className={`flex-1 py-4.5 rounded-[1.8rem] text-[10px] font-black transition-all text-center tracking-tighter leading-none relative overflow-hidden group
              ${app === type ? 'bg-black text-white shadow-2xl scale-[1.05] z-10' : 'text-gray-300 hover:text-gray-500'}`}
          >
            {app === type && <span className="absolute top-0 left-0 w-full h-1 bg-[#dc2626]"></span>}
            <span className="relative z-10">{type}</span>
          </button>
        ))}
      </footer>

      {/* BACKGROUND ELEMENTS */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 opacity-[0.03]">
        <div className="absolute top-1/4 -left-32 w-[30rem] h-[30rem] bg-[#dc2626] rounded-full blur-[180px]"></div>
        <div className="absolute bottom-1/4 -right-32 w-[30rem] h-[30rem] bg-black rounded-full blur-[180px]"></div>
      </div>
    </div>
  );
}
