'use client';
import React, { useState, useEffect } from 'react';

/** * [KEDHEON MASTER V90.0 ARCHITECTURAL PRECISION]
 * -----------------------------------------------------------
 * 1. 초밀도 레이아웃: 여백 낭비 제거 및 모바일 터치 영역 최적화
 * 2. 박스 가시성: 테두리 두께 및 명도 강화 (border-white/30)
 * 3. 텍스트 시인성: 비활성/플레이스홀더 명도 상향 (text-white/50)
 * 4. 기업용 QR: 기업명 입력 필드 및 와이드 프레임 동기화
 * -----------------------------------------------------------
 */

const PI_INVITE_CODE = 'ohsangjo';
const PI_APP_STORE = 'https://apps.apple.com/app/pi-network/id1445472541';
const PI_PLAY_STORE = 'https://play.google.com/store/apps/details?id=com.blockchainvault';

const DICT = {
  KR: {
    rookie: "ROOKIE", pioneer: "PIONEER", exchange: "EXCHANGE", auth: "SECURE AUTH", creative: "CREATIVE", market: "MARKET",
    invitation: "Web3 초대합니다.", procedure: "가입절차 가이드", assets: "ASSETS", activate: "보안 QR 활성화",
    convert: "1 PI 환전", post: "피드 등록", praise: "호응하기", buy: "구매하기", register: "상품 등록",
    stepDesc: "파이 생태계의 정식 시민이 되기 위한 8단계 표준 절차를 완수하십시오.",
    exchangeDesc: "보유하신 채굴 기여도를 제국 통화인 BEOM으로 즉시 전환하여 경제 주권을 행사하십시오.",
    authDesc: "개인 및 비즈니스용 큐알코드를 발급받아 보안 인증 및 거래 수단으로 사용하십시오.",
    creativeDesc: "영상이나 이미지 창작물을 게시하여 팬심을 증명하고 파이오니어들의 BEOM 호응을 이끌어내십시오.",
    marketDesc: "제국 내에서 유통되는 고유 굿즈를 거래하십시오. 실명 후기를 통해 신뢰도를 쌓을 수 있습니다.",
    steps: [
      { t: "애플리케이션 설치", d: "스토어에서 [Pi Network] 공식 앱을 설치하십시오." },
      { t: "가입 방식 선택", d: "[Continue with phone number] 보안 가입을 선택하십시오." },
      { t: "국가 및 번호 설정", d: "국가를 [+82(South Korea)]로 설정 후 번호를 입력하십시오." },
      { t: "보안 비밀번호 생성", d: "영문 대/소문자와 숫자를 조합하여 강력한 암호를 만드십시오." },
      { t: "실명 프로필 작성", d: "여권 영문 실명을 입력하고 고유 ID를 설정하십시오." },
      { t: "초대 코드 입력", d: `초대 코드 [ ${PI_INVITE_CODE} ]를 정확히 기입하십시오.` },
      { t: "비밀구절 수기 보관", d: "지갑 생성 시 주어지는 24개 단어는 반드시 종이에 기록하십시오." },
      { t: "채굴 버튼 활성화", d: "메인 화면의 번개 버튼을 눌러 정식 활동을 시작하십시오." }
    ]
  },
  EN: {
    rookie: "ROOKIE", pioneer: "PIONEER", exchange: "EXCHANGE", auth: "SECURE AUTH", creative: "CREATIVE", market: "MARKET",
    invitation: "WEB3 INVITATION", procedure: "REGISTRATION GUIDE", assets: "ASSETS", activate: "ACTIVATE QR",
    convert: "CONVERT 1 PI", post: "POST FEED", praise: "PRAISE", buy: "BUY NOW", register: "REGISTER",
    stepDesc: "Complete the 8-step protocol to become an official citizen of the ecosystem.",
    exchangeDesc: "Convert your mining efforts into BEOM tokens to exercise economic sovereignty.",
    authDesc: "Issue personal or business QR codes for secure authentication and transaction purposes.",
    creativeDesc: "Post your digital creations and earn BEOM support through community interaction.",
    marketDesc: "Trade unique goods within the empire and build trust through verified user reviews.",
    steps: [
      { t: "Install App", d: "Download the official [Pi Network] app from stores." },
      { t: "Select Method", d: "Choose [Continue with phone number] for device-level security." },
      { t: "Region Config", d: "Set to [+82(South Korea)] and enter your mobile number." },
      { t: "Password", d: "Create a strong alphanumeric password for account safety." },
      { t: "Real Identity", d: "Enter your real Passport name and set a unique Empire ID." },
      { t: "Invitation", d: `Use invitation code [ ${PI_INVITE_CODE} ] to join the network.` },
      { t: "Passphrase", d: "Hand-write the 24 recovery words and store them offline safely." },
      { t: "Mining", d: "Engage the lightning button to activate your daily mining session." }
    ]
  }
};

interface Review { id: number; user: string; text: string; time: string; }
interface Asset { id: number; title: string; desc: string; category: string; beom: number; time: string; }
interface Good { id: number; name: string; price: number; img: string; reviews: Review[]; }

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
    { id: 1, name: "GOLD BADGE", price: 1000, img: "/beom-token.png", reviews: [{ id: 1, user: "Citizen_Alpha", text: "상당히 정교한 마감입니다.", time: "2026.04.29" }] }
  ]);
  const [sellName, setSellName] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [sellImg, setSellImg] = useState('');

  const L = DICT[lang];
  const cats = ['MUSIC', 'TECH', 'ART', 'FOOD', 'TRAVEL', 'GAME', 'NEWS', 'MOVIE'];

  useEffect(() => {
    setHasMounted(true);
    const saved = localStorage.getItem('kedheon_v90_prec');
    if (saved) {
      try {
        const p = JSON.parse(saved);
        if (p.token !== undefined) setBeomToken(p.token);
        if (p.lang) setLang(p.lang);
        if (Array.isArray(p.assets)) setAssets(p.assets);
      } catch (e) { console.error(e); }
    }
  }, []);

  useEffect(() => {
    if (hasMounted) localStorage.setItem('kedheon_v90_prec', JSON.stringify({ token: beomToken, lang, assets }));
  }, [beomToken, lang, assets, hasMounted]);

  const SectionHeader = ({ num, title, desc }: { num: string; title: string; desc: string }) => (
    <div className="w-full border-t border-white/20 pt-5 md:pt-8 mb-4 text-left font-black">
      <h2 className="text-[#daa520] text-xl md:text-2xl uppercase italic mb-1 border-l-4 border-[#daa520] pl-3 leading-tight tracking-tighter">
        {num}. {title}
      </h2>
      <p className="text-white/60 text-[10px] md:text-sm font-sans font-bold leading-tight pl-4 italic">{desc}</p>
    </div>
  );

  if (!hasMounted) return null;

  return (
    <div className="flex flex-col items-center bg-black min-h-screen text-white font-sans w-full pb-80 font-black overflow-x-hidden">
      
      {/* GNB */}
      <div className="w-full max-w-5xl flex justify-between items-center px-4 py-3 md:py-4 sticky top-0 bg-black/95 backdrop-blur-xl z-[150] border-b border-[#daa520]/30">
        <div className="flex items-center gap-2">
          <img src="/kedheon-character.png" className="w-8 h-8 md:w-10 md:h-10 rounded-lg border border-[#daa520]/50" alt="K" />
          <div className="text-left font-black leading-tight">
            <h2 className="text-[#daa520] text-lg md:text-xl italic uppercase tracking-tighter">Kedheon</h2>
            <span className="text-white/40 text-[8px] md:text-[10px] font-mono tracking-widest uppercase">v90.0 Precision</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex bg-[#111] rounded-lg p-0.5 border border-white/20">
            <button onClick={() => setLang('KR')} className={`px-2 py-0.5 rounded-md text-[9px] md:text-[11px] transition-all ${lang === 'KR' ? 'bg-[#daa520] text-black shadow-sm' : 'text-white/30'}`}>KR</button>
            <button onClick={() => setLang('EN')} className={`px-2 py-0.5 rounded-md text-[9px] md:text-[11px] transition-all ${lang === 'EN' ? 'bg-[#daa520] text-black shadow-sm' : 'text-white/30'}`}>EN</button>
          </div>
          <div className="flex gap-1.5 font-black">
            <button onClick={() => setTab('ROOKIE')} className={`px-3 py-1.5 rounded-lg text-[10px] md:text-xs border transition-all ${tab === 'ROOKIE' ? 'bg-[#daa520] text-black border-white' : 'border-white/5 text-white/30'}`}>{L.rookie}</button>
            <button onClick={() => setTab('PIONEER')} className={`px-3 py-1.5 rounded-lg text-[10px] md:text-xs border transition-all ${tab === 'PIONEER' ? 'bg-[#daa520] text-black border-white' : 'border-white/5 text-white/30'}`}>{L.pioneer}</button>
          </div>
        </div>
      </div>

      <div className="w-full max-w-4xl px-4 py-4 md:py-8">
        {tab === 'ROOKIE' ? (
          /* ROOKIE SECTION */
          <div className="flex flex-col gap-6 animate-in fade-in text-left">
            <div className="flex flex-col items-center text-center gap-4 py-8 bg-[#111] rounded-[30px] border border-[#daa520]/40 shadow-xl relative overflow-hidden">
              <img src="/kedheon-character.png" className="w-32 h-32 md:w-44 md:h-44 rounded-[30px] border border-white/50 shadow-xl relative z-10" alt="Main" />
              <div className="relative z-10 px-4">
                <h1 className="text-[#daa520] text-2xl md:text-4xl uppercase mb-1 tracking-tighter drop-shadow-md">{L.invitation}</h1>
                <p className="text-white text-base md:text-2xl uppercase tracking-widest border-b-2 border-[#daa520] pb-2 inline-block font-black">{L.procedure}</p>
                <p className="text-white/40 text-[10px] md:text-sm mt-3 italic font-sans">{L.stepDesc}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2 md:gap-3 font-black">
              {L.steps.map((step: any, i: number) => (
                <div key={i} className={`p-4 bg-[#111] rounded-2xl border-2 flex items-center gap-4 md:gap-8 transition-all ${i >= 5 ? 'border-[#daa520]/50 bg-[#daa520]/5' : 'border-white/10'}`}>
                  <span className="text-[#daa520] text-sm md:text-xl font-black italic opacity-80 whitespace-nowrap">0{i+1}</span>
                  <div>
                    <h3 className="text-white text-sm md:text-lg font-black uppercase italic mb-0.5">{step.t}</h3>
                    <p className="text-white/40 text-[10px] md:text-[13px] font-sans font-bold leading-snug">{step.d}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-4">
              <button onClick={() => window.open(PI_APP_STORE)} className="flex-1 bg-white text-black py-4 rounded-xl text-sm md:text-lg font-black border-2 border-[#daa520] active:scale-95 shadow-md">App Store</button>
              <button onClick={() => window.open(PI_PLAY_STORE)} className="flex-1 bg-white text-black py-4 rounded-xl text-sm md:text-lg font-black border-2 border-[#daa520] active:scale-95 shadow-md">Play Store</button>
            </div>
          </div>
        ) : (
          /* PIONEER SECTION */
          <div className="flex flex-col gap-6 md:gap-10 py-2 text-left font-black animate-in slide-in-from-bottom-2">
            
            {/* ASSETS DASHBOARD */}
            <div className="bg-[#111] p-5 md:p-8 rounded-[35px] md:rounded-[45px] border-2 border-[#daa520] shadow-xl flex justify-between items-center relative overflow-hidden">
                <div className="text-left font-black z-10">
                  <h3 className="text-white/40 text-[9px] md:text-[11px] uppercase tracking-widest mb-1 font-sans">{L.assets}</h3>
                  <p className="text-[#daa520] text-2xl md:text-6xl tracking-tighter leading-none font-black drop-shadow-lg">
                    {Math.floor(beomToken).toLocaleString()}
                    <span className="text-sm md:text-2xl opacity-60">.{beomToken.toFixed(2).split('.')[1]}</span> 
                    <span className="ml-2 text-lg md:text-3xl">BEOM</span>
                  </p>
                  <div className="mt-2 text-[10px] md:text-lg font-mono italic text-white/30 font-black">≈ {(beomToken / 100).toFixed(4)} Pi</div>
                </div>
                <img src="/beom-token.png" className="w-16 h-16 md:w-28 md:h-28 object-contain animate-pulse" alt="B" />
            </div>

            {/* 01. EXCHANGE */}
            <SectionHeader num="01" title={L.exchange} desc={L.exchangeDesc} />
            <div className="bg-[#151515] p-5 md:p-8 rounded-[30px] border border-white/20 flex justify-between items-center shadow-lg">
              <div className="font-sans text-left">
                <p className="text-white text-sm md:text-lg font-black italic uppercase">Terminal</p>
                <p className="text-[#daa520] text-[9px] md:text-xs font-black uppercase tracking-widest mt-1">1 Pi = 100 BEOM</p>
              </div>
              <button onClick={() => setBeomToken(p=>p+100)} className="bg-[#daa520] text-black px-6 md:px-10 py-3 md:py-5 rounded-xl text-sm md:text-xl border-2 border-white active:scale-95 uppercase font-black">{L.convert}</button>
            </div>

            {/* 02. AUTH */}
            <SectionHeader num="02" title={L.auth} desc={L.authDesc} />
            <div className="bg-[#151515] p-5 md:p-10 rounded-[35px] border border-white/20 flex flex-col items-center gap-6 shadow-xl">
              <div className="flex gap-2 w-full max-w-sm bg-black p-1 rounded-xl border border-white/20 font-black">
                <button onClick={() => { setQrType('PERSONAL'); setIsQrActive(false); }} className={`flex-1 py-2 md:py-3 rounded-lg text-[10px] md:text-sm font-black transition-all ${qrType === 'PERSONAL' ? 'bg-[#daa520] text-black border border-white' : 'text-white/30'}`}>PERSONAL</button>
                <button onClick={() => { setQrType('BUSINESS'); setIsQrActive(false); }} className={`flex-1 py-2 md:py-3 rounded-lg text-[10px] md:text-sm font-black transition-all ${qrType === 'BUSINESS' ? 'bg-[#daa520] text-black border border-white' : 'text-white/30'}`}>BUSINESS</button>
              </div>
              
              {/* [복구] 기업명 입력 박스 */}
              {qrType === 'BUSINESS' && (
                <div className="w-full max-w-sm space-y-1.5 animate-in slide-in-from-top-1">
                   <p className="text-white/50 text-[10px] uppercase font-black pl-2">Enterprise Name</p>
                   <input value={bizName} onChange={(e) => setBizName(e.target.value.toUpperCase())} placeholder="건축사무소 명칭 입력" className="w-full bg-black border-2 border-[#daa520]/50 p-4 rounded-xl text-center text-[#daa520] text-lg outline-none font-black placeholder:text-[#daa520]/20 shadow-inner" />
                </div>
              )}

              <div className={`relative bg-black border-2 rounded-[30px] flex flex-col items-center justify-center transition-all duration-500 overflow-hidden shadow-xl
                ${qrType === 'PERSONAL' ? 'w-52 h-52 md:w-64 md:h-64' : 'w-full max-w-md aspect-video'} 
                ${isQrActive ? 'border-[#daa520] opacity-100' : 'opacity-20 border-white/20'}`}
              >
                {isQrActive ? (
                  <>
                    <img src={qrType === 'PERSONAL' ? "/qr-personal.png" : "/qr-business.png"} className={`w-full h-full ${qrType === 'PERSONAL' ? 'object-contain' : 'object-cover'}`} alt="QR" />
                    <div className="absolute bottom-4 bg-black/80 px-6 py-1.5 rounded-full border border-[#daa520]/50 backdrop-blur-md">
                      <span className="text-[#daa520] text-[10px] md:text-sm font-black tracking-widest italic uppercase">{bizName || (lang==='KR'?"미입력":"NAME")}</span>
                    </div>
                  </>
                ) : <p className="text-white/10 text-xl md:text-3xl font-black uppercase italic tracking-widest">Locked</p>}
              </div>
              <button onClick={() => setIsQrActive(true)} className="w-full max-w-xs bg-[#daa520] text-black py-4 md:py-6 rounded-xl md:rounded-3xl text-sm md:text-xl border-2 border-white active:scale-95 uppercase font-black shadow-lg">{L.activate} (50)</button>
            </div>

            {/* 03. CREATIVE */}
            <SectionHeader num="03" title={L.creative} desc={L.creativeDesc} />
            <div className="bg-[#151515] p-5 md:p-8 rounded-[35px] border border-white/20 space-y-4 shadow-xl text-left font-black">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {cats.map(cat => (
                  <button key={cat} onClick={() => setPostCategory(cat)} className={`px-4 py-2 rounded-full text-[9px] md:text-[11px] font-black border transition-all ${postCategory === cat ? 'bg-white text-black border-[#daa520]' : 'border-white/10 text-white/30'}`}>{cat}</button>
                ))}
              </div>
              <div className="space-y-2.5">
                <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="제목을 입력하십시오" className="w-full bg-black border-2 border-white/20 p-4 rounded-xl text-sm md:text-lg text-white outline-none focus:border-[#daa520] placeholder:text-white/50" />
                <textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="상세 내용을 기록하십시오" className="w-full bg-black border-2 border-white/20 p-4 rounded-xl text-[11px] md:text-sm text-white/70 h-24 outline-none font-bold placeholder:text-white/50" />
              </div>
              <div className="flex gap-3 pt-1">
                <button onClick={() => {if(!newTitle) return; setAssets([{id:Date.now(), title:newTitle, desc:newDesc, category:postCategory, beom:0, time:"NOW"},...assets]); setNewTitle(''); setNewDesc('');}} className="flex-[2] bg-[#daa520] text-black py-4 rounded-xl md:rounded-2xl text-sm md:text-lg border-2 border-white uppercase font-black shadow-md active:scale-95">{L.post} (10)</button>
                <button className="flex-1 bg-white text-black py-4 rounded-xl md:rounded-2xl text-[10px] md:text-xs border border-[#daa520] uppercase font-black leading-tight shadow-md">🚩 FAN ROOM</button>
              </div>
            </div>

            {/* 04. MARKET */}
            <SectionHeader num="04" title={L.market} desc={L.marketDesc} />
            
            {/* [복구] 판매 상품 등록 박스 */}
            <div className="bg-[#151515] p-5 md:p-8 rounded-[30px] border border-[#daa520]/40 space-y-4 mb-4 shadow-xl text-left font-black animate-in fade-in">
              <h3 className="text-white text-xs md:text-sm uppercase italic font-black border-l-2 border-[#daa520] pl-2 font-sans">Register Item</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <input value={sellName} onChange={(e) => setSellName(e.target.value)} placeholder="상품명" className="w-full bg-black border-2 border-white/20 p-4 rounded-xl text-sm text-white outline-none focus:border-[#daa520] placeholder:text-white/50" />
                <input type="number" value={sellPrice} onChange={(e) => setSellPrice(e.target.value)} placeholder="가격 (BEOM)" className="w-full bg-black border-2 border-white/20 p-4 rounded-xl text-sm text-[#daa520] outline-none placeholder:text-[#daa520]/40" />
              </div>
              <input value={sellImg} onChange={(e) => setSellImg(e.target.value)} placeholder="제품 이미지 URL (링크)" className="w-full bg-black border-2 border-white/20 p-4 rounded-xl text-[10px] md:text-xs text-white/50 outline-none" />
              <button onClick={() => {
                if(!sellName || !sellPrice) return alert("항목을 모두 입력하십시오.");
                const ng: Good = { id: Date.now(), name: sellName, price: Number(sellPrice), img: sellImg || "/beom-token.png", reviews: [] };
                setGoods([ng, ...goods]); setBeomToken(p=>p-20); setSellName(''); setSellPrice(''); setSellImg('');
                alert("Listed successfully");
              }} className="w-full bg-[#daa520] text-black py-4 rounded-xl text-sm md:text-lg border-2 border-white uppercase font-black shadow-md active:scale-95">{L.register} (20)</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 font-black text-left font-sans items-start">
              {/* 상품 리스트 */}
              <div className="space-y-3">
                <h3 className="text-white text-[10px] md:text-xs uppercase border-b border-white/10 pb-1 italic font-black tracking-widest pl-1">GOODS LIST</h3>
                <div className="grid grid-cols-1 gap-4">
                  {goods.map(g => (
                    <div key={g.id} className="bg-[#111] p-5 md:p-6 rounded-[30px] border border-white/20 shadow-lg text-center group transition-all hover:border-[#daa520]/40">
                      <img src={g.img} className="w-full h-32 md:h-48 object-contain bg-black rounded-[20px] border border-white/5 mb-4 shadow-inner transition-transform group-hover:scale-105" alt="G" />
                      <h4 className="text-white text-sm md:text-lg uppercase mb-1 font-black leading-tight">{g.name}</h4>
                      <p className="text-[#daa520] text-xl md:text-3xl mb-4 font-black tracking-tighter">{g.price.toLocaleString()} <span className="text-[10px] md:text-sm font-black">BEOM</span></p>
                      <button className="w-full py-2.5 md:py-4 bg-white text-black rounded-xl md:rounded-2xl text-xs md:text-sm border-2 border-[#daa520] uppercase font-black active:scale-95 shadow-md">Buy Now</button>
                    </div>
                  ))}
                </div>
              </div>

              {/* [복구] 구매 후기 게시판 */}
              <div className="space-y-3">
                <h3 className="text-white text-[10px] md:text-xs uppercase border-b border-white/10 pb-1 italic font-black tracking-widest pl-1">REVIEWS</h3>
                <div className="space-y-3">
                  {goods[0]?.reviews.map(r => (
                    <div key={r.id} className="bg-black/50 p-4 md:p-5 rounded-[25px] border border-white/10 shadow-inner transition-all hover:border-[#daa520]/20 font-black">
                      <p className="text-white/70 text-[10px] md:text-[13px] italic font-sans mb-3 leading-relaxed">"{r.text}"</p>
                      <div className="flex justify-between items-center text-[9px] md:text-[10px] font-mono text-[#daa520] font-black uppercase tracking-widest">
                        <span>- {r.user}</span>
                        <span className="text-white/30">{r.time}</span>
                      </div>
                    </div>
                  ))}
                  <button className="w-full py-4 border border-dashed border-white/10 rounded-xl text-[10px] md:text-xs text-white/30 uppercase font-black hover:border-[#daa520] hover:text-[#daa520] transition-all font-sans">Write Review</button>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* FOOTER NAVIGATION */}
      <div className="fixed bottom-4 left-3 right-3 max-w-4xl mx-auto bg-black/98 border-2 border-[#daa520]/50 p-1 rounded-[25px] flex justify-between gap-1 z-[200] shadow-[0_0_50px_rgba(218,165,32,0.4)] backdrop-blur-3xl font-black">
        {['KEDHEON', 'CIVIL', 'NEXUS', 'VENDOR'].map(app => (
          <button key={app} className={`flex-1 py-3 md:py-4 rounded-[20px] text-[9px] md:text-xs transition-all font-black text-center ${app === 'KEDHEON' ? 'bg-[#daa520] text-black border border-white shadow-inner scale-100' : 'text-white/30 hover:text-white'}`}>{app}</button>
        ))}
      </div>

      <div className="mt-20 opacity-20 text-[9px] md:text-[11px] tracking-[1.5em] uppercase pb-10 font-sans font-black text-center">
        Kedheon master | V90.0 PRECISION | @Ohsangjo
      </div>
    </div>
  );
}
