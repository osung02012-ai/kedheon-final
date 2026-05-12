'use client';
import React, { useState, useEffect, useRef, useMemo } from 'react';

/** * [KEDHEON MASTER V160.0 - THE SUPREME INTEGRATION]
 * -----------------------------------------------------------
 * 1. 테마: Pure White / Black / Red (#DC2626)
 * 2. 복구: ROOKIE 8단계 + PIONEER 01~05 전 섹션 100% 통합
 * 3. 수정: 누락되었던 boardType 및 postCategory 상태 연동 완료
 * 4. 경제: Max(매출 3%, 순이익 8%) 사회적 환원 자동 계산
 * -----------------------------------------------------------
 */

const PI_INVITE_CODE = 'ohsangjo';

const DICT = {
  KR: {
    rookie: "ROOKIE", pioneer: "PIONEER", exchange: "EXCHANGE", auth: "SECURE AUTH", creative: "CREATIVE & FAN", market: "MARKET", partnership: "PARTNERSHIP",
    invitation: "Web3 초대합니다.", procedure: "파이코인 가입절차 안내", assets: "ASSETS", activate: "보안 QR 활성화",
    convert: "1 PI 환전", post: "피드 등록", buy: "구매하기", register: "상품 등록", submit: "제안서 제출", download: "공식 앱 다운로드",
    exchangeDesc: "채굴 기여도를 BEOM으로 즉시 전환하여 가치를 보존하십시오.",
    authDesc: "제국 시민을 위한 개인/비즈니스 보안 QR코드를 발급받으십시오.",
    creativeDesc: "시민의 창작물과 팬심을 공유하고 호응을 이끌어내십시오.",
    fanRoomDesc: "🚩 팬룸 개설(500 BEOM): 90% 수익 환원 및 거버넌스 권한 부여.",
    marketDesc: "검증된 다양한 GOODS를 거래하고 가치를 확인하십시오.",
    partnershipDesc: "제국과 미래를 함께 설계할 글로벌 기업 파트너를 기다립니다.",
    steps: [
      { t: "애플리케이션 설치", d: "[Pi Network] 공식 앱을 설치하십시오.", link: "https://minepi.com/#download" },
      { t: "가입 방식 선택", d: "[Continue with phone number] 가입 방식을 선택하십시오." },
      { t: "국가 및 번호 설정", d: "[+82(South Korea)] 선택 후 번호를 입력하십시오." },
      { t: "보안 비밀번호 생성", d: "영문 대/소문자와 숫자를 조합하십시오." },
      { t: "실명 프로필 작성", d: "여권 영문 실명과 고유 ID를 설정하십시오." },
      { t: "초대 코드 입력", d: `초대 코드 [ ${PI_INVITE_CODE} ]를 정확히 입력하십시오.` },
      { t: "비밀구절 수기 보관", d: "24개 단어는 반드시 종이에 수기로 기록하십시오." },
      { t: "채굴 버튼 활성화", d: "매일 번개 버튼을 눌러 활동을 시작하십시오." }
    ]
  },
  EN: {
    rookie: "ROOKIE", pioneer: "PIONEER", exchange: "EXCHANGE", auth: "SECURE AUTH", creative: "CREATIVE & FAN", market: "MARKET", partnership: "PARTNERSHIP",
    invitation: "Web3 Invitation.", procedure: "Join Guide", assets: "ASSETS", activate: "ACTIVATE QR",
    convert: "CONVERT 1 PI", post: "POST FEED", buy: "BUY NOW", register: "REGISTER", submit: "SUBMIT", download: "DOWNLOAD APP",
    steps: [
      { t: "Install App", d: "Download [Pi Network] official app.", link: "https://minepi.com/#download" },
      { t: "Select Method", d: "Choose [Continue with phone number]." },
      { t: "Region Config", d: "Set to [+82(South Korea)] and mobile." },
      { t: "Password", d: "Create strong alphanumeric password." },
      { t: "Real Identity", d: "Enter Passport name & ID." },
      { t: "Invitation", d: `Use code [ ${PI_INVITE_CODE} ].` },
      { t: "Passphrase", d: "Hand-write 24 words safely on paper." },
      { t: "Mining", d: "Engage the lightning button to start." }
    ]
  }
};

const SectionHeader = ({ num, title, desc }) => (
  <div className="w-full border-t-4 border-[#dc2626] pt-10 mb-8 text-left">
    <h2 className="text-black text-3xl md:text-5xl font-black uppercase italic mb-2 border-l-[20px] border-black pl-6 tracking-tighter">
      {num}. {title}
    </h2>
    <p className="text-gray-400 text-sm md:text-2xl font-bold pl-12 italic leading-none">{desc}</p>
  </div>
);

export default function KedheonEmpireEternal() {
  const [hasMounted, setHasMounted] = useState(false);
  const [lang, setLang] = useState('KR');
  const [tab, setTab] = useState('PIONEER');
  
  // -- GLOBAL STATES --
  const [beomToken, setBeomToken] = useState(7891.88);
  const [totalRevenue, setTotalRevenue] = useState(188500);
  const [netIncome, setNetIncome] = useState(72300);

  // -- PIONEER STATES --
  const [qrState, setQrState] = useState({ type: 'PERSONAL', biz: '', active: false });
  const [boardType, setBoardType] = useState('CREATIVE');
  const [postCategory, setPostCategory] = useState('TECH');
  const [fanRooms, setFanRooms] = useState(['케데헌', '헌트릭스', '파이Nexus']);
  const [feed, setFeed] = useState({ title: '', desc: '', url: '' });

  // -- MARKET STATES --
  const [sellItem, setSellItem] = useState({ name: '', price: '', desc: '', img: '' });
  const [goods, setGoods] = useState([
    { id: 1, name: "GOLD BADGE", price: 1000, img: "/beom-token.png", desc: "제국 시민 명예 문장" },
    { id: 2, name: "V23 NODE KEY", price: 5000, img: "/node-icon.png", desc: "88쓰레드 노드 보안 키" }
  ]);

  // -- PARTNERSHIP STATES --
  const [partner, setPartner] = useState({ corp: '', contact: '', msg: '' });

  const fileInputRef = useRef(null);
  const L = DICT[lang];
  const cats = ['MUSIC', 'TECH', 'ART', 'FOOD', 'TRAVEL', 'GAME', 'NEWS', 'MOVIE'];

  const currentBeomValue = useMemo(() => (0.18 * 100) + (5000 * 0.01) + 1, []);
  const redistributionAmount = useMemo(() => 
    Math.max(totalRevenue * 0.03, netIncome * 0.08), 
    [totalRevenue, netIncome]
  );

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return <div className="bg-white min-h-screen" />;

  return (
    <div className="flex flex-col items-center bg-white min-h-screen text-black font-sans w-full pb-96 font-black overflow-x-hidden selection:bg-red-50">
      
      {/* 🧭 NAVIGATION */}
      <nav className="w-full max-w-7xl flex justify-between items-center px-6 py-6 sticky top-0 bg-white/95 backdrop-blur-2xl z-[300] border-b-8 border-black/5 shadow-xl">
        <div className="flex items-center gap-6">
          <img src="/kedheon-character.png" className="w-16 h-16 rounded-[25px] border-4 border-black" alt="S" />
          <div className="text-left leading-tight">
            <h1 className="text-black text-2xl md:text-4xl font-black italic uppercase">Kedheon</h1>
            <span className="text-gray-400 text-[10px] md:text-sm font-mono font-bold uppercase tracking-[0.3em]">V160.0 INTEGRATED</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setTab('ROOKIE')} className={`px-6 py-3 rounded-2xl text-sm md:text-2xl font-black border-[6px] transition-all ${tab === 'ROOKIE' ? 'bg-[#dc2626] text-white border-[#dc2626]' : 'text-gray-400'}`}>{L.rookie}</button>
          <button onClick={() => setTab('PIONEER')} className={`px-6 py-3 rounded-2xl text-sm md:text-2xl font-black border-[6px] transition-all ${tab === 'PIONEER' ? 'bg-black text-white border-black' : 'text-gray-400'}`}>{L.pioneer}</button>
        </div>
      </nav>

      <main className="w-full max-w-7xl px-6 py-12">
        {tab === 'ROOKIE' ? (
          <div className="flex flex-col gap-12 text-left animate-in fade-in slide-in-from-top-12 duration-1000">
            <div className="flex flex-col items-center text-center gap-10 py-24 bg-gray-50 rounded-[80px] border-4 border-black/5 relative shadow-inner overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-4 bg-[#dc2626] animate-pulse"></div>
              <img src="/kedheon-character.png" className="w-48 h-48 md:w-[20rem] md:h-[25rem] rounded-[60px] border-[10px] border-black shadow-2xl transition-all" alt="M" />
              <div className="px-10">
                <h1 className="text-black text-5xl md:text-[8rem] uppercase font-black tracking-tighter leading-none">{L.invitation}</h1>
                <p className="text-[#dc2626] text-2xl md:text-6xl uppercase tracking-[0.5em] border-b-[15px] border-[#dc2626] pb-4 inline-block font-black italic">{L.procedure}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-8">
              {L.steps.map((step, i) => (
                <div key={i} className={`p-12 bg-white rounded-[55px] border-[6px] flex items-center gap-12 transition-all ${i === 0 ? 'border-[#dc2626] bg-red-50/10 shadow-2xl scale-[1.05]' : 'border-black/5 opacity-90'}`}>
                  <span className={`text-6xl md:text-[12rem] font-black italic ${i === 0 ? 'text-[#dc2626]' : 'text-black opacity-5'}`}>0{i+1}</span>
                  <div className="flex-1">
                    <h3 className="text-black text-3xl md:text-6xl font-black uppercase italic mb-4">{step.t}</h3>
                    <p className="text-gray-600 text-base md:text-4xl font-bold leading-snug">{step.d}</p>
                    {step.link && (
                      <button onClick={() => window.open(step.link, '_blank')} className="mt-10 bg-[#dc2626] text-white px-16 py-8 rounded-[40px] text-xl md:text-5xl font-black uppercase hover:bg-black transition-all shadow-2xl flex items-center gap-8 animate-bounce">
                        ↓ {L.download}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-20 bg-black text-white rounded-[80px] text-center shadow-2xl border-[20px] border-black group">
              <p className="text-2xl md:text-6xl font-black italic text-gray-500 uppercase tracking-[0.6em]">Imperial Code</p>
              <div className="text-[#dc2626] text-8xl md:text-[20rem] font-black tracking-[0.1em] drop-shadow-2xl cursor-pointer" onClick={() => {navigator.clipboard.writeText(PI_INVITE_CODE); alert("Copied!");}}>
                {PI_INVITE_CODE}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-24 py-8 text-left animate-in slide-in-from-bottom-20 duration-1000">
            {/* 00. ASSET DASHBOARD */}
            <div className="bg-gray-50 p-12 md:p-32 rounded-[100px] border-[12px] border-black shadow-2xl flex flex-col md:flex-row justify-between items-center relative overflow-hidden group">
                <div className="text-left z-10 space-y-10 w-full md:w-auto font-black">
                  <h3 className="text-gray-400 text-lg md:text-5xl uppercase tracking-[1em] font-black leading-none">{L.assets}</h3>
                  <p className="text-black text-8xl md:text-[22rem] tracking-[-0.08em] font-black leading-none py-10">
                    {Math.floor(beomToken).toLocaleString()}
                    <span className="text-4xl md:text-[12rem] opacity-5">.{beomToken.toFixed(2).split('.')[1]}</span> 
                    <span className="ml-10 text-3xl md:text-[12rem] italic uppercase text-[#dc2626]">BEOM</span>
                  </p>
                  <div className="flex flex-wrap gap-8 pt-10 font-black">
                    <div className="bg-black text-white px-12 py-6 rounded-[35px] text-lg md:text-5xl font-mono font-bold shadow-2xl transition-transform hover:scale-110">Value Index: {currentBeomValue.toFixed(2)} / PI</div>
                    <div className="bg-[#dc2626] text-white px-12 py-6 rounded-[35px] text-lg md:text-5xl font-mono font-bold animate-pulse shadow-2xl border-[8px] border-white/5 transition-transform hover:scale-110">Social Return: {redistributionAmount.toLocaleString()}</div>
                  </div>
                </div>
                <img src="/beom-token.png" className="w-56 h-56 md:w-[40rem] md:h-[40rem] object-contain group-hover:scale-125 transition-all duration-1000 mt-16 md:mt-0 drop-shadow-[0_80px_160px_rgba(0,0,0,0.6)]" alt="Asset" />
            </div>

            {/* 01. EXCHANGE */}
            <SectionHeader num="01" title={L.exchange} desc={L.exchangeDesc} />
            <div className="bg-white p-12 md:p-32 rounded-[80px] border-[20px] border-black flex flex-col md:flex-row justify-between items-center shadow-2xl gap-16 hover:bg-gray-50 transition-all group">
              <div className="text-left leading-tight font-black w-full md:w-auto">
                <p className="text-black text-5xl md:text-[12rem] font-black italic uppercase leading-none mb-10 group-hover:text-[#dc2626] transition-colors">Economic Terminal</p>
                <div className="flex items-center gap-10"><span className="w-12 h-12 bg-green-500 rounded-full animate-ping"></span><p className="text-gray-400 text-xl md:text-7xl font-bold uppercase tracking-[0.4em]">Protocol V23 Synchronized</p></div>
              </div>
              <button onClick={() => {setBeomToken(p=>p+100); setTotalRevenue(p=>p+100); alert("전환 성공");}} className="w-full md:w-auto bg-black text-white px-20 py-12 md:px-40 md:py-24 rounded-[60px] text-4xl md:text-[10rem] border-[16px] border-black active:scale-90 font-black shadow-2xl hover:bg-[#dc2626] leading-none">
                {L.convert}
              </button>
            </div>

            {/* 02. AUTH */}
            <SectionHeader num="02" title={L.auth} desc={L.authDesc} />
            <div className="bg-gray-50 p-12 md:p-32 rounded-[100px] border-8 border-black/5 flex flex-col items-center gap-20 shadow-inner">
              <div className="flex gap-10 w-full max-w-6xl bg-white p-5 rounded-[60px] border-[12px] border-black font-black shadow-3xl">
                <button onClick={() => { setQrState({ ...qrState, type: 'PERSONAL', active: false }); }} className={`flex-1 py-14 rounded-[45px] text-2xl md:text-7xl font-black transition-all ${qrState.type === 'PERSONAL' ? 'bg-black text-white shadow-3xl' : 'text-gray-300 hover:text-black'}`}>PERSONAL</button>
                <button onClick={() => { setQrState({ ...qrState, type: 'BUSINESS', active: false }); }} className={`flex-1 py-14 rounded-[45px] text-2xl md:text-7xl font-black transition-all ${qrState.type === 'BUSINESS' ? 'bg-black text-white shadow-3xl' : 'text-gray-300 hover:text-black'}`}>BUSINESS</button>
              </div>
              {qrState.type === 'BUSINESS' && (
                 <input value={qrState.biz} onChange={(e) => setQrState({ ...qrState, biz: e.target.value.toUpperCase() })} placeholder="BIZ NAME" className="w-full max-w-6xl bg-white border-[12px] border-black p-16 rounded-[60px] text-center text-black text-5xl md:text-[10rem] font-black outline-none focus:border-[#dc2626] shadow-inner" />
              )}
              <div className={`relative bg-white border-[24px] rounded-[120px] flex items-center justify-center transition-all duration-1000 shadow-2xl ${qrState.type === 'PERSONAL' ? 'w-[30rem] h-[30rem] md:w-[60rem] md:h-[65rem]' : 'w-full max-w-[100rem] aspect-video'} ${qrState.active ? 'border-[#dc2626] opacity-100 scale-100' : 'opacity-5 blur-[10px]'}`}>
                {qrState.active ? (
                  <div className="flex flex-col items-center p-20 gap-16"><img src={qrState.type === 'PERSONAL' ? "/qr-personal.png" : "/qr-business.png"} className="h-full object-contain" alt="QR" /><p className="text-black text-2xl md:text-8xl font-black italic bg-gray-100 px-24 py-8 rounded-full border-4 border-black/10">{qrState.biz || "AUTHENTICATED"}</p></div>
                ) : <p className="text-black text-7xl md:text-[25rem] font-black uppercase italic tracking-[0.5em] animate-pulse">Encoded</p>}
              </div>
              <button onClick={() => {if(beomToken < 50) return alert("자산 부족"); setBeomToken(p=>p-50); setQrState({ ...qrState, active: true });}} className="w-full max-w-7xl bg-black text-white py-16 md:py-32 rounded-[80px] text-4xl md:text-[11rem] border-[16px] border-black active:scale-95 uppercase font-black shadow-3xl hover:bg-[#dc2626] leading-none">
                {L.activate} (50 BEOM)
              </button>
            </div>

            {/* 03. CREATIVE */}
            <SectionHeader num="03" title={L.creative} desc={L.creativeDesc} />
            <div className="bg-white p-12 md:p-32 rounded-[110px] border-[12px] border-black/10 space-y-20 text-left shadow-2xl font-black">
              <div className="flex gap-24 border-b-[20px] border-gray-100 pb-16 font-black">
                 <button onClick={() => setBoardType('CREATIVE')} className={`text-4xl md:text-[9rem] uppercase font-black italic transition-all ${boardType === 'CREATIVE' ? 'text-black border-b-[30px] border-black pb-6' : 'text-gray-300'}`}>Creative</button>
                 <button onClick={() => setBoardType('FAN')} className={`text-4xl md:text-[9rem] uppercase font-black italic transition-all ${boardType === 'FAN' ? 'text-black border-b-[30px] border-black pb-6' : 'text-gray-300'}`}>Fan Rooms</button>
              </div>
              <div className="space-y-16">
                 <div className="flex gap-10 overflow-x-auto pb-10 scrollbar-hide font-black">{cats.map(cat => (<button key={cat} onClick={() => setPostCategory(cat)} className={`px-16 py-8 rounded-[40px] text-xl md:text-5xl font-black border-[8px] transition-all whitespace-nowrap ${postCategory === cat ? 'bg-black text-white' : 'text-gray-400 border-black/5'}`}>{cat}</button>))}</div>
                 <div className="flex gap-10 overflow-x-auto pb-10 scrollbar-hide border-t-[12px] border-gray-50 pt-20 font-black">{fanRooms.map(room => (<button key={room} onClick={() => setPostCategory(room)} className={`px-16 py-8 rounded-[40px] text-xl md:text-5xl font-black border-[8px] transition-all whitespace-nowrap ${postCategory === room ? 'bg-[#dc2626] text-white shadow-3xl scale-110' : 'border-red-50 text-[#dc2626]'}`}>🚩 {room}</button>))}</div>
              </div>
              <div className="space-y-10 font-black pt-12">
                <input value={feed.title} onChange={(e) => setFeed({ ...feed, title: e.target.value })} placeholder="제목" className="w-full bg-gray-50 border-[12px] border-black/5 p-16 rounded-[50px] text-4xl md:text-[8rem] text-black outline-none focus:border-black font-black shadow-inner" />
                <textarea value={feed.desc} onChange={(e) => setFeed({ ...feed, desc: e.target.value })} placeholder="상세 내용..." className="w-full bg-gray-50 border-[12px] border-black/5 p-16 rounded-[50px] text-xl md:text-6xl text-black h-[50rem] outline-none focus:border-black font-bold shadow-inner leading-relaxed" />
              </div>
              <button onClick={() => {if(!feed.title) return alert("내용을 입력하십시오."); setBeomToken(p=>p-10); alert("등록 성공"); setFeed({title:'', desc:'', url:''});}} className="w-full bg-black text-white py-16 md:py-32 rounded-[60px] text-4xl md:text-[10rem] border-[16px] border-black active:scale-95 uppercase font-black shadow-3xl hover:bg-[#dc2626] leading-none">{L.post} (10 BEOM)</button>
              <p className="text-gray-400 text-xl md:text-5xl font-bold bg-gray-50 p-16 rounded-[60px] italic border-l-[32px] border-[#dc2626] leading-snug">※ {L.fanRoomDesc}</p>
            </div>

            {/* 04. MARKET */}
            <SectionHeader num="04" title={L.market} desc={L.marketDesc} />
            <div className="bg-white p-12 md:p-32 rounded-[120px] border-[12px] border-black/10 space-y-20 shadow-2xl text-left font-black">
               <h3 className="text-black text-4xl md:text-[10rem] font-black uppercase italic border-l-[35px] border-[#dc2626] pl-14 leading-none">Empire Market</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-16 font-black">
                  <input value={sellItem.name} onChange={(e) => setSellItem({ ...sellItem, name: e.target.value })} placeholder="상품명" className="w-full bg-gray-50 border-[12px] border-black/5 p-16 rounded-[55px] text-3xl md:text-8xl font-black outline-none" />
                  <input type="number" value={sellItem.price} onChange={(e) => setSellItem({ ...sellItem, price: e.target.value })} placeholder="가격 (BEOM)" className="w-full bg-gray-50 border-[12px] border-black/5 p-16 rounded-[55px] text-3xl md:text-8xl font-black text-[#dc2626] outline-none" />
               </div>
               <div className="w-full font-black">
                  <input type="file" accept="image/*" onChange={handleImageUpload} ref={fileInputRef} className="hidden" />
                  <button onClick={() => fileInputRef.current?.click()} className="w-full bg-gray-50 border-[15px] border-dashed border-black/10 p-40 rounded-[80px] text-gray-400 text-center hover:border-black transition-all font-black uppercase tracking-[0.8em] text-2xl md:text-8xl shadow-inner">
                    {sellItem.img ? <img src={sellItem.img} className="h-[40rem] mx-auto rounded-[60px] border-[20px] border-black" alt="P" /> : "📸 UPLOAD PRODUCT IMAGE"}
                  </button>
               </div>
               <button onClick={()=>{if(!sellItem.name||!sellItem.price||!sellItem.img)return alert("Empty"); setGoods([{...sellItem, id:Date.now(), price:Number(sellItem.price)}, ...goods]); setSellItem({name:'',price:'',desc:'',img:''}); alert("등록 완료");}} className="w-full bg-black text-white py-20 md:py-40 rounded-[70px] text-4xl md:text-[15rem] border-[20px] border-black uppercase font-black shadow-3xl hover:bg-[#dc2626] leading-none">{L.register} (20 BEOM)</button>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-20 pt-40 border-t-[20px] border-gray-50 font-black">
                  {goods.map(g => (
                    <div key={g.id} className="bg-white p-12 md:p-24 rounded-[80px] md:rounded-[120px] border-[12px] border-black/10 shadow-3xl flex flex-col group transition-all relative hover:border-[#dc2626]">
                      <div className="w-full aspect-square bg-gray-50 rounded-[60px] mb-16 overflow-hidden flex items-center justify-center relative shadow-inner">
                        <div className="absolute top-12 right-12 bg-black text-white px-12 py-5 rounded-full text-xl md:text-5xl font-mono font-black shadow-2xl z-20">VERIFIED</div>
                        <img src={g.img} className="w-64 h-64 md:w-[40rem] md:h-[40rem] object-contain group-hover:scale-[1.3] duration-[2000ms]" alt="G" />
                      </div>
                      <h4 className="text-black text-4xl md:text-[8rem] uppercase mb-6 font-black leading-tight line-clamp-1">{g.name}</h4>
                      <p className="text-gray-500 text-xl md:text-5xl mb-16 font-bold leading-snug italic line-clamp-3">"{g.desc}"</p>
                      <div className="mt-auto">
                        <p className="text-black text-6xl md:text-[16rem] mb-20 font-black tracking-tighter leading-none">{g.price.toLocaleString()} <span className="text-2xl md:text-8xl text-[#dc2626]">BEOM</span></p>
                        <button onClick={()=>alert("Imperial Engine Syncing...")} className="w-full py-14 md:py-28 bg-black text-white rounded-[60px] text-3xl md:text-[8rem] border-[10px] border-black uppercase font-black shadow-3xl hover:bg-[#dc2626] leading-none"> {L.buy} </button>
                      </div>
                    </div>
                  ))}
               </div>
            </div>

            {/* 05. PARTNERSHIP */}
            <SectionHeader num="05" title={L.partnership} desc={L.partnershipDesc} />
            <div className="bg-black p-16 md:p-48 rounded-[120px] border-[30px] border-[#dc2626] space-y-24 text-left shadow-2xl relative overflow-hidden font-black">
                <div className="absolute -top-60 -right-60 opacity-10 pointer-events-none select-none"><img src="/kedheon-character.png" className="w-[80rem] h-[80rem] grayscale" alt="E" /></div>
                <h3 className="text-white text-6xl md:text-[15rem] font-black italic border-l-[45px] border-[#dc2626] pl-20 z-10 relative uppercase">Business Portal</h3>
                <div className="space-y-16 relative z-10 font-black">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 font-black">
                        <input value={partner.corp} onChange={(e)=>setPartner({...partner, corp: e.target.value.toUpperCase()})} placeholder="CORP NAME" className="w-full bg-white/5 border-[12px] border-white/10 p-16 rounded-[60px] text-white text-3xl md:text-[7rem] font-black outline-none focus:border-[#dc2626] shadow-inner transition-all leading-none" />
                        <input value={partner.contact} onChange={(e)=>setPartner({...partner, contact: e.target.value})} placeholder="EMAIL / SNS" className="w-full bg-white/5 border-[12px] border-white/10 p-16 rounded-[60px] text-white text-3xl md:text-[7rem] font-black outline-none focus:border-[#dc2626] shadow-inner transition-all leading-none" />
                    </div>
                    <textarea value={partner.msg} onChange={(e)=>setPartner({...partner, msg: e.target.value})} placeholder="PROPOSAL DETAILS..." className="w-full bg-white/5 border-[12px] border-white/10 p-20 rounded-[80px] text-white text-2xl md:text-[4rem] font-bold h-[60rem] outline-none focus:border-[#dc2626] shadow-inner leading-relaxed" />
                </div>
                <button onClick={()=>{if(!partner.corp||!partner.msg)return alert("내용을 채워주십시오."); alert("제안서가 접수되었습니다."); setPartner({corp:'', contact:'', msg:''});}} className="w-full bg-[#dc2626] text-white py-20 md:py-48 rounded-[100px] text-5xl md:text-[12rem] border-[20px] border-[#dc2626] hover:bg-white hover:text-[#dc2626] transition-all font-black shadow-2xl uppercase tracking-[0.5em] active:scale-95 leading-none">{L.submit}</button>
            </div>

            {/* 🛰️ INFRA BAR */}
            <div className="mt-24 py-20 px-24 bg-gray-100 rounded-[80px] flex flex-wrap justify-center md:justify-between items-center gap-20 border-[10px] border-black/5 shadow-inner">
                <div className="flex items-center gap-10"><div className="w-10 h-10 bg-red-600 rounded-full animate-ping"></div><span className="text-black text-2xl md:text-6xl font-mono font-black uppercase italic tracking-tighter">Infrastructure: 88-Threads Dual Xeon Gold Node</span></div>
                <div className="flex items-center gap-16 font-black uppercase text-lg md:text-[4rem] text-gray-500 leading-none">
                  <span>Node: 18.02 Top-Tier</span><span className="opacity-20 text-9xl font-thin">|</span>
                  <span>Protocol: V23.0 Synchronized</span><span className="opacity-20 text-9xl font-thin">|</span>
                  <span>Auth: Lord @Ohsangjo</span>
                </div>
            </div>
          </div>
        )}
      </main>

      {/* 📱 FOOTER */}
      <footer className="fixed bottom-12 left-8 right-8 max-w-[110rem] mx-auto bg-white border-[12px] border-black p-4 rounded-[80px] flex justify-between gap-6 z-[500] shadow-[0_100px_250px_rgba(0,0,0,1)] font-black">
        {['KEDHEON', 'CIVIL', 'NEXUS', 'VENDOR'].map(app => (
          <button key={app} className={`flex-1 py-12 md:py-24 rounded-[65px] text-xs md:text-[6rem] transition-all duration-700 font-black text-center leading-none ${app === 'KEDHEON' ? 'bg-black text-white shadow-inner scale-[1.1] animate-pulse' : 'text-gray-300 hover:bg-gray-100 hover:text-black hover:scale-110'}`}>{app}</button>
        ))}
      </footer>

      {/* 🐯 WATERMARK */}
      <div className="mt-64 opacity-5 text-black text-xl md:text-[12rem] tracking-[4em] uppercase pb-96 font-black text-center select-none pointer-events-none leading-none"> Kedheon Master | Final Legacy | Lord Ohsangjo </div>
    </div>
  );
}
