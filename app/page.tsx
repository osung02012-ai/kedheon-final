'use client';
import React, { useState, useEffect } from 'react';

/** * [KEDHEON EMPIRE V84.0 ARCHITECTURAL ULTIMATE FINAL]
 * -----------------------------------------------------------
 * [타이포그래피 4단계 규격 고정]
 * T1 (Huge)   : text-4xl md:text-8xl (자산 수치, 메인 대제목)
 * T2 (Large)  : text-2xl md:text-4xl (섹션 제목, 카드 타이틀)
 * T3 (Medium) : text-lg  md:text-xl  (버튼, 입력 필드, 단계 제목)
 * T4 (Small)  : text-[10px] md:text-sm (상세 가이드, 메타데이터, 푸터)
 * -----------------------------------------------------------
 */

const PI_INVITE_CODE = 'ohsangjo';
const PI_TO_BEOM_RATIO = 100;

const DICT = {
  KR: {
    rookie: "ROOKIE", pioneer: "PIONEER", exchange: "환전소", auth: "보안 인증", creative: "창작 게시판", market: "제국 시장",
    invitation: "Web3 초대합니다.", procedure: "파이코인 가입절차", assets: "제국 총 자산", activate: "인증 활성화",
    convert: "1 PI 환전", post: "피드 등록", praise: "호응하기", buy: "구매하기", register: "상품 등록",
    stepDesc: "제국 시민권을 획득하기 위한 가장 정확한 8단계 가이드입니다.",
    steps: [
      { t: "애플리케이션 설치", d: "스토어에서 [Pi Network] 공식 앱을 검색하여 설치하십시오." },
      { t: "가입 방식 선택", d: "보안성이 높은 [Continue with phone number]를 선택하십시오." },
      { t: "국가 및 번호 설정", d: "국가를 [+82(South Korea)]로 설정 후 본인 번호를 입력하십시오." },
      { t: "보안 비밀번호 생성", d: "영문 대/소문자와 숫자를 조합하여 강력한 암호를 만드십시오." },
      { t: "실명 프로필 작성", d: "여권 영문 실명을 입력하고 제국 전용 고유 ID를 설정하십시오." },
      { t: "웹3 초대 코드 입력", d: `입국 승인을 위해 초대 코드 [ ${PI_INVITE_CODE} ]를 입력하십시오.` },
      { t: "비밀구절 수기 보관", d: "지갑 생성 시 주어지는 24개 비밀구절은 오직 종이에만 보관하십시오." },
      { t: "채굴 버튼 활성화", d: "번개 버튼을 눌러 정식 시민권을 획득하고 활동을 시작하십시오." }
    ]
  },
  EN: {
    rookie: "ROOKIE", pioneer: "PIONEER", exchange: "EXCHANGE", auth: "SECURE AUTH", creative: "CREATIVE", market: "MARKET",
    invitation: "WEB3 INVITATION", procedure: "PI NETWORK GUIDE", assets: "IMPERIAL ASSETS", activate: "ACTIVATE QR",
    convert: "CONVERT 1 PI", post: "POST FEED", praise: "PRAISE", buy: "BUY NOW", register: "REGISTER",
    stepDesc: "The most precise 8-step guide to acquiring your Imperial citizenship.",
    steps: [
      { t: "App Installation", d: "Search and install the official [Pi Network] app from the store." },
      { t: "Select Method", d: "Select [Continue with phone number] for enhanced security." },
      { t: "Region Config", d: "Set country to [+82(South Korea)] and enter your mobile number." },
      { t: "Create Password", d: "Create a strong password using letters and numbers." },
      { t: "Real Identity", d: "Enter your real English name and set a unique Empire ID." },
      { t: "Invitation Code", d: `Enter [ ${PI_INVITE_CODE} ] to validate your entry code.` },
      { t: "Vault Keeper", d: "Hand-write the 24-word recovery phrase only on physical paper." },
      { t: "Mining Activation", d: "Engage the lightning button to activate your citizenship." }
    ]
  }
};

interface Asset { id: number; title: string; desc: string; category: string; beom: number; time: string; }
interface Good { id: number; name: string; price: number; img: string; }

export default function KedheonPortal() {
  const [hasMounted, setHasMounted] = useState(false);
  const [lang, setLang] = useState<'KR' | 'EN'>('KR');
  const [tab, setTab] = useState<'ROOKIE' | 'PIONEER'>('PIONEER');
  const [beomToken, setBeomToken] = useState(7891.88);
  
  const [qrType, setQrType] = useState<'PERSONAL' | 'BUSINESS'>('PERSONAL');
  const [bizName, setBizName] = useState('');
  const [isQrActive, setIsQrActive] = useState(false);
  
  const [postCategory, setPostCategory] = useState('TECH');
  const [assets, setAssets] = useState<Asset[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const [goods, setGoods] = useState<Good[]>([
    { id: 1, name: "EMPIRE GOLD BADGE", price: 1000, img: "/beom-token.png" }
  ]);
  const [sellName, setSellName] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [sellImg, setSellImg] = useState('');

  const L = DICT[lang];
  const cats = ['MUSIC', 'TECH', 'ART', 'FOOD', 'TRAVEL', 'GAME', 'NEWS', 'MOVIE'];

  useEffect(() => {
    setHasMounted(true);
    const saved = localStorage.getItem('kedheon_v84_master');
    if (saved) {
      try {
        const p = JSON.parse(saved);
        if (p.token !== undefined) setBeomToken(p.token);
        if (p.lang) setLang(p.lang);
        if (Array.isArray(p.assets)) setAssets(p.assets);
      } catch (e) { console.error("Restore Error", e); }
    }
  }, []);

  useEffect(() => {
    if (hasMounted) {
      localStorage.setItem('kedheon_v84_master', JSON.stringify({ token: beomToken, lang, assets }));
    }
  }, [beomToken, lang, assets, hasMounted]);

  const handleExchange = () => { setBeomToken(p => p + 100); alert("Success"); };
  const handleActivateQr = () => {
    if (qrType === 'BUSINESS' && !bizName.trim()) return alert("Name Required");
    setBeomToken(p => p - 50); setIsQrActive(true);
  };
  const handlePost = () => {
    if(!newTitle.trim()) return;
    const post: Asset = { id: Date.now(), title: newTitle, desc: newDesc, category: postCategory, beom: 0, time: new Date().toLocaleDateString() };
    setAssets([post, ...assets]); setBeomToken(p => p - 10); setNewTitle(''); setNewDesc('');
  };

  const SectionHeader = ({ num, title, desc }: { num: string; title: string; desc: string }) => (
    <div className="w-full border-t-2 border-white/30 pt-10 md:pt-16 mb-8 text-left font-black">
      <h2 className="text-[#daa520] text-3xl md:text-5xl uppercase italic mb-3 border-l-8 border-[#daa520] pl-5 leading-none tracking-tighter">
        {num}. {title}
      </h2>
      <p className="text-white/70 text-[12px] md:text-lg font-sans font-bold leading-tight pl-8 italic">{desc}</p>
    </div>
  );

  if (!hasMounted) return null;

  return (
    <div className="flex flex-col items-center bg-black min-h-screen text-white font-sans w-full pb-40 font-black overflow-x-hidden">
      
      {/* --- [GNB: 고정 상단바 & 언어 변환] --- */}
      <div className="w-full max-w-6xl flex justify-between items-center px-4 py-4 md:p-6 sticky top-0 bg-black/95 backdrop-blur-xl z-[150] border-b-2 border-[#daa520]/40 shadow-2xl">
        <div className="flex items-center gap-3">
          <img src="/kedheon-character.png" className="w-10 h-10 md:w-14 md:h-12 rounded-lg border-2 border-[#daa520]" alt="K" />
          <div className="text-left font-black leading-tight">
            <h2 className="text-[#daa520] text-xl md:text-2xl italic uppercase tracking-tighter">Kedheon</h2>
            <span className="text-white/50 text-[9px] md:text-[11px] font-mono tracking-widest uppercase font-black">v84.0 ULTIMATE</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex bg-[#1a1a1a] rounded-xl p-1 border-2 border-white/10 font-black">
            <button onClick={() => setLang('KR')} className={`px-4 py-1.5 rounded-lg text-xs md:text-sm transition-all ${lang === 'KR' ? 'bg-[#daa520] text-black shadow-lg' : 'text-white/40'}`}>KR</button>
            <button onClick={() => setLang('EN')} className={`px-4 py-1.5 rounded-lg text-xs md:text-sm transition-all ${lang === 'EN' ? 'bg-[#daa520] text-black shadow-lg' : 'text-white/40'}`}>EN</button>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setTab('ROOKIE')} className={`px-4 py-2 md:px-6 md:py-3 rounded-xl text-xs md:text-sm border-2 transition-all font-black ${tab === 'ROOKIE' ? 'bg-[#daa520] text-black border-white shadow-xl' : 'border-white/10 text-white/40'}`}>{L.rookie}</button>
            <button onClick={() => setTab('PIONEER')} className={`px-4 py-2 md:px-6 md:py-3 rounded-xl text-xs md:text-sm border-2 transition-all font-black ${tab === 'PIONEER' ? 'bg-[#daa520] text-black border-white shadow-xl' : 'border-white/10 text-white/40'}`}>{L.pioneer}</button>
          </div>
        </div>
      </div>

      <div className="w-full max-w-5xl px-4 py-8 md:py-16">
        {tab === 'ROOKIE' ? (
          /* --- [ROOKIE: 8단계 상세 설명 복구] --- */
          <div className="flex flex-col gap-10 md:gap-16 animate-in fade-in text-left">
            <div className="flex flex-col items-center text-center gap-8 py-16 bg-[#111] rounded-[60px] border-4 border-[#daa520] shadow-2xl relative overflow-hidden font-black">
              <img src="/kedheon-character.png" className="w-48 h-48 md:w-64 md:h-64 rounded-[50px] border-2 border-white shadow-xl relative z-10" alt="Main" />
              <div className="relative z-10 px-6 font-black">
                <h1 className="text-[#daa520] text-4xl md:text-8xl uppercase mb-3 tracking-tighter font-black drop-shadow-xl">{L.invitation}</h1>
                <p className="text-white text-xl md:text-4xl uppercase tracking-widest border-b-4 border-[#daa520] pb-4 inline-block">{L.procedure}</p>
                <p className="text-white/60 text-sm md:text-2xl mt-6 italic font-sans max-w-2xl mx-auto">{L.stepDesc}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {L.steps.map((step: any, i: number) => (
                <div key={i} className={`p-8 md:p-10 bg-[#111] rounded-[40px] border-2 shadow-2xl flex flex-col gap-4 transition-all hover:scale-[1.02] ${i >= 5 ? 'border-[#daa520] bg-[#daa520]/5' : 'border-white/20'}`}>
                  <div className="flex items-center gap-4">
                    <span className="text-[#daa520] text-2xl md:text-4xl font-black font-sans italic">0{i+1}</span>
                    <h3 className="text-white text-xl md:text-2xl font-black uppercase italic">{step.t}</h3>
                  </div>
                  <p className="text-white/60 text-[13px] md:text-lg font-sans font-bold leading-relaxed">{step.d}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* --- [PIONEER: 핵심 경제 레이아웃] --- */
          <div className="flex flex-col gap-12 md:gap-24 text-left font-black animate-in slide-in-from-bottom-2">
            
            {/* T1 규격: 자산 대시보드 */}
            <div className="bg-[#1a1a1a] p-10 md:p-20 rounded-[60px] md:rounded-[100px] border-4 border-[#daa520] shadow-[0_0_80px_rgba(218,165,32,0.3)] flex justify-between items-center relative overflow-hidden">
                <div className="text-left font-black z-10">
                  <h3 className="text-white/40 text-[10px] md:text-xl uppercase tracking-[0.6em] mb-6 font-sans">{L.assets}</h3>
                  <p className="text-[#daa520] text-4xl md:text-9xl tracking-tighter leading-none font-black drop-shadow-2xl">
                    {Math.floor(beomToken).toLocaleString()}
                    <span className="text-xl md:text-5xl opacity-50">.{beomToken.toFixed(2).split('.')[1]}</span> 
                    <span className="ml-4 text-2xl md:text-6xl font-black">BEOM</span>
                  </p>
                  <div className="mt-8 md:mt-12 bg-black/70 px-10 py-3 rounded-2xl border-2 border-white/20 inline-block text-sm md:text-3xl font-mono italic text-white/60">
                    ≈ {(beomToken / PI_TO_BEOM_RATIO).toFixed(4)} Pi
                  </div>
                </div>
                <img src="/beom-token.png" className="w-24 h-24 md:w-64 md:h-64 object-contain animate-pulse" alt="B" />
            </div>

            {/* 🌐 01. 환전소 */}
            <SectionHeader num="01" title={L.exchange} desc="기여도를 제국 통화로 전환하십시오." />
            <div className="bg-[#111] p-10 md:p-16 rounded-[50px] border-2 border-white/40 flex flex-col md:flex-row justify-between items-center gap-8 shadow-xl hover:border-[#daa520] transition-all">
              <div className="text-left font-sans font-black">
                <p className="text-white text-xl md:text-3xl italic uppercase mb-2">Conversion Terminal</p>
                <p className="text-[#daa520] text-sm md:text-xl font-black uppercase tracking-widest">Rate: 1 Pi = 100 BEOM</p>
              </div>
              <button onClick={handleExchange} className="w-full md:w-auto bg-[#daa520] text-black px-12 md:px-24 py-6 md:py-10 rounded-2xl md:rounded-[50px] text-xl md:text-3xl border-4 border-white active:scale-95 font-black shadow-2xl">{L.convert}</button>
            </div>

            {/* 🌐 02. 보안 인증 (WIDE 비율 및 텍스트 오버레이 복구) */}
            <SectionHeader num="02" title={L.auth} desc="큐알코드를 발급받아 개인 보안을 강화하십시오." />
            <div className="bg-[#111] p-10 md:p-20 rounded-[60px] border-2 border-white/30 flex flex-col items-center gap-12 shadow-2xl">
              <div className="flex gap-4 w-full max-w-xl bg-black p-2 rounded-2xl border-4 border-white/10 font-black">
                <button onClick={() => { setQrType('PERSONAL'); setIsQrActive(false); }} className={`flex-1 py-4 md:py-8 rounded-xl text-sm md:text-xl transition-all font-black border-2 ${qrType === 'PERSONAL' ? 'bg-[#daa520] text-black border-white shadow-2xl scale-105' : 'border-transparent text-white/30'}`}>PERSONAL</button>
                <button onClick={() => { setQrType('BUSINESS'); setIsQrActive(false); }} className={`flex-1 py-4 md:py-8 rounded-xl text-sm md:text-xl transition-all font-black border-2 ${qrType === 'BUSINESS' ? 'bg-[#daa520] text-black border-white shadow-2xl scale-105' : 'border-transparent text-white/30'}`}>BUSINESS</button>
              </div>
              {qrType === 'BUSINESS' && (
                <input value={bizName} onChange={(e) => setBizName(e.target.value.toUpperCase())} placeholder="ENTER FIRM NAME (T2)" className="w-full max-w-xl bg-black border-4 border-[#daa520] p-6 md:p-10 rounded-3xl text-center text-[#daa520] text-2xl md:text-4xl outline-none font-black font-sans shadow-inner" />
              )}
              
              <div className={`relative bg-black border-4 rounded-[60px] flex flex-col items-center justify-center transition-all duration-700 overflow-hidden shadow-2xl
                ${qrType === 'PERSONAL' ? 'w-72 h-72 md:w-[500px] md:h-[500px]' : 'w-full max-w-4xl aspect-video'} 
                ${isQrActive ? 'border-[#daa520] opacity-100' : 'opacity-20 border-white/20'}`}
              >
                {isQrActive ? (
                  <>
                    <img src={qrType === 'PERSONAL' ? "/qr-personal.png" : "/qr-business.png"} className={`w-full h-full ${qrType === 'PERSONAL' ? 'object-contain' : 'object-cover'}`} alt="QR" />
                    <div className="absolute bottom-10 bg-black/90 px-12 py-4 rounded-full border-2 border-[#daa520] backdrop-blur-2xl shadow-xl">
                      <span className="text-[#daa520] text-lg md:text-3xl font-black tracking-[0.4em] italic uppercase font-sans">
                        {qrType === 'BUSINESS' ? (bizName || "IMPERIAL FIRM") : "PERSONAL ID"}
                      </span>
                    </div>
                  </>
                ) : <p className="text-white/10 text-4xl md:text-7xl font-black uppercase italic tracking-[0.5em] font-sans">Locked</p>}
              </div>
              <button onClick={handleActivateQr} className="w-full max-w-xl bg-[#daa520] text-black py-8 md:py-14 rounded-3xl md:rounded-[60px] text-2xl md:text-4xl border-4 border-white active:scale-95 uppercase font-black shadow-2xl">{L.activate} (50)</button>
            </div>

            {/* 🌐 03. 창작 게시판 */}
            <SectionHeader num="03" title={L.creative} desc="영상이나 창작물을 게시하고 BEOM 호응을 끌어내십시오." />
            <div className="bg-[#111] p-10 md:p-20 rounded-[60px] border-2 border-white/20 space-y-10 shadow-2xl font-black text-left">
              <div className="flex gap-3 overflow-x-auto pb-6 scrollbar-hide">
                {cats.map(cat => (
                  <button key={cat} onClick={() => setPostCategory(cat)} className={`px-8 py-4 rounded-full text-xs md:text-lg font-black border-2 transition-all whitespace-nowrap ${postCategory === cat ? 'bg-white text-black border-[#daa520]' : 'border-white/10 text-white/30'}`}>{cat}</button>
                ))}
              </div>
              <div className="space-y-6 font-black">
                <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="TITLE (T2 TEXT)" className="w-full bg-[#1a1a1a] border-4 border-white/30 p-8 md:p-12 rounded-[40px] text-2xl md:text-5xl text-white outline-none focus:border-[#daa520]" />
                <textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="DESCRIPTION (T3 TEXT)" className="w-full bg-[#1a1a1a] border-4 border-white/30 p-8 md:p-12 rounded-[40px] text-lg md:text-2xl text-white/70 h-48 md:h-80 outline-none font-bold shadow-inner" />
              </div>
              <div className="flex gap-8">
                <button onClick={handlePost} className="flex-[2] bg-[#daa520] text-black py-8 md:py-14 rounded-3xl md:rounded-[60px] text-2xl md:text-5xl border-4 border-white active:scale-95 shadow-xl font-black">{L.post} (10)</button>
                <button className="flex-1 bg-white text-black py-8 md:py-14 rounded-3xl md:rounded-[60px] text-sm md:text-2xl border-4 border-[#daa520] uppercase font-black leading-tight shadow-xl">🚩 FAN ROOM<br/>(500)</button>
              </div>
            </div>

            {/* 피드 리스트 (Praise 호응) */}
            <div className="space-y-10 md:space-y-20">
              {assets.map(a => (
                <div key={a.id} className="bg-[#111] p-10 md:p-20 rounded-[70px] border-4 border-white/10 shadow-2xl relative text-left transition-all hover:border-[#daa520]/40">
                  <div className="flex justify-between items-start mb-10 font-black">
                    <div className="flex flex-col gap-4">
                      <span className="text-[12px] md:text-xl text-[#daa520] font-black uppercase tracking-widest bg-[#daa520]/10 px-6 py-2 rounded-full w-fit border-2 border-[#daa520]/20">{a.category}</span>
                      <h4 className="text-white text-3xl md:text-6xl uppercase italic font-black underline underline-offset-[20px] decoration-[#daa520]/30">{a.title}</h4>
                    </div>
                    <span className="text-white/30 text-xs md:text-xl font-mono">{a.time}</span>
                  </div>
                  <p className="text-white/70 text-xl md:text-4xl italic leading-relaxed mb-14 font-bold font-sans">"{a.desc}"</p>
                  <div className="flex justify-between items-center border-t-4 border-white/5 pt-12">
                    <button onClick={() => {
                        setAssets(assets.map(item => item.id === a.id ? {...item, beom: item.beom + 100} : item));
                        setBeomToken(p => p - 100);
                    }} className="bg-[#daa520] text-black px-14 md:px-24 py-6 md:py-10 rounded-2xl md:rounded-[50px] text-lg md:text-3xl border-4 border-white uppercase font-black shadow-2xl hover:scale-105 transition-all">👑 {L.praise} (100)</button>
                    <p className="text-[#daa520] text-5xl md:text-9xl tracking-tighter font-black font-sans">{a.beom.toLocaleString()} <span className="text-sm md:text-4xl font-black">BEOM</span></p>
                  </div>
                </div>
              ))}
            </div>

            {/* 🌐 04. 시장 */}
            <SectionHeader num="04" title={L.market} desc="제국 희귀 굿즈를 거래하십시오." />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20">
              {goods.map(g => (
                <div key={g.id} className="bg-[#111] p-12 md:p-20 rounded-[70px] border-4 border-white/20 shadow-2xl text-center group transition-all hover:border-[#daa520]/40">
                  <img src={g.img} className="w-full h-72 md:h-[500px] object-contain bg-black rounded-[60px] border-2 border-white/10 mb-12 shadow-inner transition-transform group-hover:scale-105" alt="G" />
                  <h4 className="text-white text-3xl md:text-5xl uppercase mb-4 font-black">{g.name}</h4>
                  <p className="text-[#daa520] text-4xl md:text-8xl mb-12 font-black tracking-tighter">{g.price.toLocaleString()} <span className="text-sm md:text-4xl font-black">BEOM</span></p>
                  <button className="w-full py-6 md:py-12 bg-white text-black rounded-3xl md:rounded-[60px] text-xl md:text-4xl border-8 border-[#daa520] uppercase font-black active:scale-95 shadow-2xl">{L.buy}</button>
                </div>
              ))}
            </div>

          </div>
        )}
      </div>

      {/* 하단 네비게이션: 간격 균등화 */}
      <div className="fixed bottom-6 left-4 right-4 max-w-6xl mx-auto bg-black/95 border-4 border-[#daa520] p-2 rounded-[35px] flex justify-between gap-1 z-[200] shadow-[0_0_80px_rgba(218,165,32,0.6)] backdrop-blur-3xl font-black">
        {['KEDHEON', 'CIVIL', 'NEXUS', 'VENDOR'].map(app => (
          <button key={app} className={`flex-1 py-6 md:py-10 rounded-[30px] text-[10px] md:text-xl transition-all font-black text-center ${app === 'KEDHEON' ? 'bg-[#daa520] text-black border-2 border-white shadow-inner scale-100 font-black' : 'text-white/40 hover:text-white'}`}>{app}</button>
        ))}
      </div>

      <div className="mt-48 opacity-30 text-[10px] md:text-xl tracking-[1.5em] uppercase pb-20 font-sans font-black text-center">
        Kedheon Empire | V84.0 ULTIMATE | @Ohsangjo
      </div>
    </div>
  );
}
