'use client';
import React, { useState, useEffect, useRef } from 'react';

/** * [KEDHEON MASTER V104.0 ARCHITECTURAL HIERARCHY]
 * -----------------------------------------------------------
 * 1. 팬룸 예시 적용: '케데헌', '헌트릭스'를 팬룸 전용 카테고리 라인에 기본 배치
 * 2. 카테고리 이층 구조: 일반 카테고리(Tier 1) vs 독립 팬룸(Tier 2) 명확한 격리
 * 3. 레드 디바이더: 섹션 상단 border-red-600 경계선으로 시각적 질서 확립
 * 4. 무회색 정책: 모든 텍스트 및 입력창 플레이스홀더 100% 순수 화이트
 * 5. 슬림 네비게이션: 하단 앱바 부피 최소화로 콘텐츠 가독성 극대화
 * -----------------------------------------------------------
 */

const PI_INVITE_CODE = 'ohsangjo';
const PI_APP_STORE = 'https://apps.apple.com/app/pi-network/id1445472541';
const PI_PLAY_STORE = 'https://play.google.com/store/apps/details?id=com.blockchainvault';

const DICT = {
  KR: {
    rookie: "ROOKIE", pioneer: "PIONEER", exchange: "EXCHANGE", auth: "SECURE AUTH", creative: "CREATIVE & FAN", market: "MARKET",
    invitation: "Web3 초대합니다.", procedure: "파이코인 가입절차 안내", assets: "ASSETS", activate: "보안 QR 활성화",
    convert: "1 PI 환전", post: "피드 등록", praise: "호응하기", buy: "구매하기", register: "상품 등록",
    exchangeDesc: "보유하신 채굴 기여도를 제국 통화인 BEOM으로 즉시 전환하십시오.",
    authDesc: "개인 및 비즈니스용 큐알코드를 발급받아 보안 인증 수단으로 사용하십시오.",
    creativeDesc: "창작물과 팬심을 자유롭게 공유하고 파이오니어들의 BEOM 호응을 이끌어내십시오.",
    fanRoomDesc: "🚩 팬룸 개설(500 BEOM): 코어 팬 전용 허브가 생성됩니다. '호응(Praise)' 수익의 90%가 창작자에게 환원되며, 독자적인 거버넌스 투표권이 부여됩니다.",
    marketDesc: "다양한 GOODS를 거래하고 상세 설명과 실제 후기를 통해 가치를 확인하십시오.",
    steps: [
      { t: "애플리케이션 설치", d: "스토어에서 [Pi Network] 공식 앱을 검색하여 설치하십시오." },
      { t: "가입 방식 선택", d: "[Continue with phone number] 보안 가입을 선택하십시오." },
      { t: "국가 및 번호 설정", d: "국가를 [+82(South Korea)]로 설정 후 번호를 입력하십시오." },
      { t: "보안 비밀번호 생성", d: "영문 대/소문자와 숫자를 조합하여 강력한 암호를 만드십시오." },
      { t: "실명 프로필 작성", d: "여권 영문 실명을 입력하고 고유 ID를 설정하십시오." },
      { t: "초대 코드 입력", d: `초대 코드 [ ${PI_INVITE_CODE} ]를 정확히 기입하십시오.` },
      { t: "비밀구절 수기 보관", d: "지갑 생성 시 주어지는 24개 단어는 반드시 종이에 기록하십시오." },
      { t: "채굴 버튼 활성화", d: "번개 버튼을 눌러 정식 활동을 시작하십시오." }
    ]
  },
  EN: {
    rookie: "ROOKIE", pioneer: "PIONEER", exchange: "EXCHANGE", auth: "SECURE AUTH", creative: "CREATIVE & FAN", market: "MARKET",
    invitation: "Web3 Invitation.", procedure: "Pi Network Join Guide", assets: "ASSETS", activate: "ACTIVATE QR",
    convert: "CONVERT 1 PI", post: "POST FEED", praise: "PRAISE", buy: "BUY NOW", register: "REGISTER",
    exchangeDesc: "Convert your mining efforts into BEOM tokens immediately.",
    authDesc: "Issue personal or business QR codes for secure authentication.",
    creativeDesc: "Share your creations and fan spirit to earn support from the community.",
    fanRoomDesc: "🚩 FAN ROOM (500 BEOM): Establish a private hub. 90% revenue share and governance rights enabled.",
    marketDesc: "Trade unique goods and check verified descriptions and reviews.",
    steps: [
      { t: "Install App", d: "Download the official [Pi Network] app from stores." },
      { t: "Select Method", d: "Choose [Continue with phone number] for security." },
      { t: "Region Config", d: "Set to [+82(South Korea)] and enter number." },
      { t: "Password", d: "Create a strong alphanumeric password." },
      { t: "Real Identity", d: "Enter Passport name and set a unique ID." },
      { t: "Invitation", d: `Use invitation code [ ${PI_INVITE_CODE} ] to join.` },
      { t: "Passphrase", d: "Hand-write the 24 words and store them safely." },
      { t: "Mining", d: "Engage the lightning button to start mining." }
    ]
  }
};

interface Asset { id: number; title: string; desc: string; category: string; beom: number; time: string; url?: string; type: 'CREATIVE' | 'FAN'; }
interface Good { id: number; name: string; price: number; img: string; desc: string; reviews: any[]; }

export default function KedheonPortal() {
  const [hasMounted, setHasMounted] = useState(false);
  const [lang, setLang] = useState<'KR' | 'EN'>('KR');
  const [tab, setTab] = useState<'ROOKIE' | 'PIONEER'>('PIONEER');
  const [beomToken, setBeomToken] = useState(7891.88);
  
  const [qrType, setQrType] = useState<'PERSONAL' | 'BUSINESS'>('PERSONAL');
  const [bizName, setBizName] = useState('');
  const [isQrActive, setIsQrActive] = useState(false);
  
  const [boardType, setBoardType] = useState<'CREATIVE' | 'FAN'>('CREATIVE');
  const [postCategory, setPostCategory] = useState('TECH');
  const [assets, setAssets] = useState<Asset[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newUrl, setNewUrl] = useState('');

  // [수정] 팬룸 예시 카테고리 기본값 설정
  const [fanRooms, setFanRooms] = useState<string[]>(['케데헌', '헌트릭스']);

  const [goods, setGoods] = useState<Good[]>([
    { id: 1, name: "GOLD BADGE", price: 1000, img: "/beom-token.png", desc: "순금 각인이 새겨진 제국 시민의 영광입니다.", reviews: [] }
  ]);
  const [sellName, setSellName] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [sellDesc, setSellDesc] = useState('');
  const [sellImg, setSellImg] = useState<string>(''); 

  const fileInputRef = useRef<HTMLInputElement>(null);
  const L = DICT[lang];
  const standardCats = ['MUSIC', 'TECH', 'ART', 'FOOD', 'TRAVEL', 'GAME', 'NEWS', 'MOVIE'];

  useEffect(() => {
    setHasMounted(true);
    const saved = localStorage.getItem('kedheon_v104_final');
    if (saved) {
      try {
        const p = JSON.parse(saved);
        if (p.token !== undefined) setBeomToken(p.token);
        if (p.lang) setLang(p.lang);
        if (Array.isArray(p.assets)) setAssets(p.assets);
        if (Array.isArray(p.fanRooms)) setFanRooms(p.fanRooms);
      } catch (e) { console.error(e); }
    }
  }, []);

  useEffect(() => {
    if (hasMounted) localStorage.setItem('kedheon_v104_final', JSON.stringify({ token: beomToken, lang, assets, fanRooms }));
  }, [beomToken, lang, assets, fanRooms, hasMounted]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSellImg(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleCreateFanRoom = () => {
    const name = prompt(lang === 'KR' ? "개설할 팬룸 명칭을 입력하십시오." : "Enter Fan Room Name");
    if (name && name.trim()) {
      if (beomToken < 500) return alert(lang === 'KR' ? "범토큰이 부족합니다." : "Insufficient BEOM");
      setBeomToken(p => p - 500);
      setFanRooms(prev => [...prev, name.trim()]);
      alert(lang === 'KR' ? `${name} 팬룸이 개설되었습니다.` : `${name} Fan Room Created.`);
    }
  };

  const SectionHeader = ({ num, title, desc }: { num: string; title: string; desc: string }) => (
    <div className="w-full border-t-2 border-red-600 pt-6 md:pt-8 mb-4 text-left font-black">
      <h2 className="text-[#daa520] text-xl md:text-3xl uppercase italic mb-1 border-l-4 border-[#daa520] pl-3 leading-tight tracking-tighter">
        {num}. {title}
      </h2>
      <p className="text-white text-[10px] md:text-[13px] font-sans font-bold leading-tight pl-4 italic">{desc}</p>
    </div>
  );

  if (!hasMounted) return null;

  return (
    <div className="flex flex-col items-center bg-black min-h-screen text-white font-sans w-full pb-80 font-black overflow-x-hidden">
      
      {/* GNB */}
      <div className="w-full max-w-6xl flex justify-between items-center px-4 py-3 md:py-4 sticky top-0 bg-black/95 backdrop-blur-xl z-[150] border-b-2 border-white/20">
        <div className="flex items-center gap-2">
          <img src="/kedheon-character.png" className="w-8 h-8 md:w-10 md:h-10 rounded-lg border-2 border-white" alt="K" />
          <div className="text-left font-black leading-tight">
            <h2 className="text-[#daa520] text-lg md:text-xl italic uppercase font-black">Kedheon</h2>
            <span className="text-white text-[8px] md:text-[10px] font-mono tracking-widest uppercase font-bold">v104.0 Final</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-white/5 rounded-lg p-0.5 border border-white/20 font-black">
            <button onClick={() => setLang('KR')} className={`px-2.5 py-0.5 rounded-md text-[9px] md:text-[11px] transition-all font-black ${lang === 'KR' ? 'bg-[#daa520] text-black shadow-sm' : 'text-white'}`}>KR</button>
            <button onClick={() => setLang('EN')} className={`px-2.5 py-1 rounded-md text-[9px] md:text-[11px] transition-all font-black ${lang === 'EN' ? 'bg-[#daa520] text-black' : 'text-white'}`}>EN</button>
          </div>
          <div className="flex gap-1.5 font-black">
            <button onClick={() => setTab('ROOKIE')} className={`px-3 py-1.5 rounded-lg text-[10px] md:text-xs border-2 transition-all font-black ${tab === 'ROOKIE' ? 'bg-[#daa520] text-black border-white shadow-md' : 'border-white/10 text-white'}`}>{L.rookie}</button>
            <button onClick={() => setTab('PIONEER')} className={`px-3 py-1.5 rounded-lg text-[10px] md:text-xs border-2 transition-all font-black ${tab === 'PIONEER' ? 'bg-[#daa520] text-black border-white shadow-md' : 'border-white/10 text-white'}`}>{L.pioneer}</button>
          </div>
        </div>
      </div>

      <div className="w-full max-w-4xl px-4 py-4 md:py-8">
        {tab === 'ROOKIE' ? (
          <div className="flex flex-col gap-6 md:gap-10 animate-in fade-in text-left">
            <div className="flex flex-col items-center text-center gap-4 py-10 bg-[#111] rounded-[30px] border border-white/10 shadow-xl relative overflow-hidden font-black">
              <img src="/kedheon-character.png" className="w-32 h-32 md:w-44 md:h-44 rounded-[30px] border-4 border-white shadow-xl relative z-10" alt="Main" />
              <div className="relative z-10 px-4 font-black">
                <h1 className="text-[#daa520] text-2xl md:text-5xl uppercase mb-1 tracking-tighter font-black">{L.invitation}</h1>
                <p className="text-white text-base md:text-2xl uppercase tracking-widest border-b-2 border-white pb-2 inline-block font-black">{L.procedure}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-2 md:gap-3 font-black">
              {L.steps.map((step: any, i: number) => (
                <div key={i} className={`p-4 md:p-6 bg-[#111] rounded-2xl border flex items-center gap-5 transition-all ${i >= 5 ? 'border-[#daa520] bg-[#daa520]/5' : 'border-white/5'}`}>
                  <span className="text-[#daa520] text-base md:text-2xl font-black italic font-sans">0{i+1}</span>
                  <div>
                    <h3 className="text-white text-sm md:text-lg font-black uppercase italic mb-0.5 font-black">{step.t}</h3>
                    <p className="text-white text-[10px] md:text-[13px] font-sans font-bold leading-snug">{step.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-8 md:gap-14 py-2 text-left font-black animate-in slide-in-from-bottom-2">
            
            {/* ASSETS */}
            <div className="bg-[#111] p-6 md:p-12 rounded-[40px] md:rounded-[60px] border border-white/10 shadow-xl flex justify-between items-center relative overflow-hidden font-black font-black">
                <div className="text-left font-black z-10">
                  <h3 className="text-white text-[9px] md:text-[13px] uppercase tracking-widest mb-1 font-sans font-bold">{L.assets}</h3>
                  <p className="text-[#daa520] text-3xl md:text-7xl tracking-tighter leading-none font-black drop-shadow-lg font-black">
                    {Math.floor(beomToken).toLocaleString()}
                    <span className="text-lg md:text-4xl opacity-90">.{beomToken.toFixed(2).split('.')[1]}</span> 
                    <span className="ml-2 text-lg md:text-4xl font-black font-black">BEOM</span>
                  </p>
                  <div className="mt-4 bg-black/60 px-5 py-2 rounded-xl border-2 border-white inline-block text-xs md:text-2xl font-mono italic text-white font-black font-sans">≈ {(beomToken / 100).toFixed(4)} Pi</div>
                </div>
                <img src="/beom-token.png" className="w-16 h-16 md:w-44 md:h-44 object-contain animate-pulse" alt="B" />
            </div>

            <SectionHeader num="01" title={L.exchange} desc={L.exchangeDesc} />
            <div className="bg-black p-5 md:p-10 rounded-[35px] border border-white/5 flex justify-between items-center shadow-md font-black font-black">
              <div className="font-sans text-left font-black">
                <p className="text-white text-sm md:text-2xl font-black italic uppercase leading-none font-black">Terminal</p>
                <p className="text-white text-[9px] md:text-sm font-black mt-2 uppercase tracking-widest opacity-90 font-black">Rate: 1 Pi = 100 BEOM</p>
              </div>
              <button onClick={() => {setBeomToken(p=>p+100); alert("환전 완료");}} className="bg-[#daa520] text-black px-6 md:px-14 py-4 md:py-6 rounded-xl md:rounded-[30px] text-sm md:text-2xl border-4 border-white active:scale-95 uppercase font-black shadow-lg">{L.convert}</button>
            </div>

            <SectionHeader num="02" title={L.auth} desc={L.authDesc} />
            <div className="bg-black p-6 md:p-12 rounded-[40px] border border-white/5 flex flex-col items-center gap-8 shadow-md font-black font-black">
              <div className="flex gap-2 w-full max-w-sm bg-white/5 p-1.5 rounded-xl border border-white/10 font-black font-black">
                <button onClick={() => { setQrType('PERSONAL'); setIsQrActive(false); }} className={`flex-1 py-2 md:py-4 rounded-lg text-[10px] md:text-sm transition-all border-2 font-black ${qrType === 'PERSONAL' ? 'bg-[#daa520] text-black border-white shadow-md' : 'border-transparent text-white'}`}>PERSONAL</button>
                <button onClick={() => { setQrType('BUSINESS'); setIsQrActive(false); }} className={`flex-1 py-2 md:py-4 rounded-lg text-[10px] md:text-sm transition-all border-2 font-black ${qrType === 'BUSINESS' ? 'bg-[#daa520] text-black border-white shadow-md' : 'border-transparent text-white'}`}>BUSINESS</button>
              </div>
              {qrType === 'BUSINESS' && (
                <div className="w-full max-w-sm space-y-2 animate-in slide-in-from-top-1 font-black">
                   <p className="text-white text-[10px] md:text-xs uppercase font-black pl-2 font-black">Enterprise Name</p>
                   <input value={bizName} onChange={(e) => setBizName(e.target.value.toUpperCase())} placeholder="케데헌까페 명칭 입력" className="w-full bg-black border-4 border-white p-4 md:p-5 rounded-2xl text-center text-white text-lg md:text-2xl outline-none font-black placeholder:text-white/30 font-black" />
                </div>
              )}
              <div className={`relative bg-black border-4 rounded-[40px] flex flex-col items-center justify-center transition-all duration-700 overflow-hidden shadow-2xl ${qrType === 'PERSONAL' ? 'w-56 h-56 md:w-80 md:h-80' : 'w-full max-w-xl aspect-video'} ${isQrActive ? 'border-[#daa520] opacity-100' : 'opacity-20 border-white'}`}>
                {isQrActive ? (
                  <>
                    <img src={qrType === 'PERSONAL' ? "/qr-personal.png" : "/qr-business.png"} className={`w-full h-full ${qrType === 'PERSONAL' ? 'object-contain' : 'object-cover'}`} alt="QR" />
                    <div className="absolute bottom-5 bg-black/90 px-8 py-2 rounded-full border-2 border-[#daa520] backdrop-blur-md font-black">
                      <span className="text-[#daa520] text-[10px] md:text-xl font-black italic uppercase tracking-widest font-black">{bizName || "KEDHEON CAFE"}</span>
                    </div>
                  </>
                ) : <p className="text-white text-xl md:text-5xl font-black uppercase italic tracking-widest font-black">Locked</p>}
              </div>
              <button onClick={() => setIsQrActive(true)} className="w-full max-w-md bg-[#daa520] text-black py-5 md:py-8 rounded-2xl md:rounded-[40px] text-lg md:text-2xl border-4 border-white active:scale-95 uppercase font-black shadow-2xl font-black font-black">보안 QR 활성화 (50)</button>
            </div>

            <SectionHeader num="03" title={L.creative} desc={L.creativeDesc} />
            <div className="bg-black p-6 md:p-10 rounded-[40px] border border-white/5 space-y-6 shadow-md text-left font-black">
              
              <div className="flex gap-4 border-b border-white/10 pb-4 font-black">
                 <button onClick={() => setBoardType('CREATIVE')} className={`text-sm md:text-lg uppercase font-black italic transition-all ${boardType === 'CREATIVE' ? 'text-[#daa520] border-b-4 border-[#daa520]' : 'text-white/40'}`}>Creative Hub</button>
                 <button onClick={() => setBoardType('FAN')} className={`text-sm md:text-lg uppercase font-black italic transition-all ${boardType === 'FAN' ? 'text-[#daa520] border-b-4 border-[#daa520]' : 'text-white/40'}`}>Fan Spirit</button>
              </div>

              {/* [수정] 이층 구조 카테고리 선택기 (예시: 케데헌, 헌트릭스 포함) */}
              <div className="space-y-4 font-black">
                 <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide font-black">
                    {standardCats.map(cat => (
                      <button key={cat} onClick={() => setPostCategory(cat)} className={`px-4 py-2 rounded-full text-[10px] md:text-sm font-black border-2 transition-all ${postCategory === cat ? 'bg-white text-black border-white shadow-md' : 'border-white/10 text-white'}`}>{cat}</button>
                    ))}
                 </div>
                 {fanRooms.length > 0 && (
                   <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide font-black border-t border-white/5 pt-2">
                     {fanRooms.map(room => (
                       <button key={room} onClick={() => setPostCategory(room)} className={`px-4 py-2 rounded-full text-[10px] md:text-sm font-black border-2 transition-all ${postCategory === room ? 'bg-[#daa520] text-black border-white shadow-md' : 'border-[#daa520]/20 text-[#daa520]'}`}>🚩 {room}</button>
                     ))}
                   </div>
                 )}
              </div>
              
              <div className="space-y-4 font-black">
                <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="제목 또는 팬심 공유" className="w-full bg-black border-4 border-white p-5 rounded-2xl text-base md:text-xl text-white outline-none focus:border-[#daa520] placeholder:text-white/40 font-black" />
                <input value={newUrl} onChange={(e) => setNewUrl(e.target.value)} placeholder="영상 또는 이미지 링크 첨부" className="w-full bg-black border-4 border-white p-5 rounded-2xl text-sm md:text-lg text-[#daa520] outline-none focus:border-[#daa520] placeholder:text-[#daa520]/30 font-black" />
                <textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="상세 내용을 자유롭게 기록하십시오" className="w-full bg-black border-4 border-white p-5 rounded-2xl text-[12px] md:text-base text-white h-28 outline-none font-bold placeholder:text-white/40 font-black" />
              </div>
              
              <div className="space-y-4 font-black">
                <div className="flex gap-4 font-black">
                    <button onClick={() => {if(!newTitle) return; setAssets([{id:Date.now(), title:newTitle, desc:newDesc, category:postCategory, beom:0, time:"NOW", url:newUrl, type:boardType},...assets]); setNewTitle(''); setNewDesc(''); setNewUrl('');}} className="flex-[2] bg-[#daa520] text-black py-5 md:py-7 rounded-2xl md:rounded-[40px] text-lg md:text-2xl border-4 border-white uppercase font-black shadow-xl active:scale-95 font-black">{L.post} (10)</button>
                    <button onClick={handleCreateFanRoom} className="flex-1 bg-white text-black py-5 md:py-7 rounded-2xl md:rounded-[40px] text-sm md:text-lg border-4 border-[#daa520] uppercase font-black shadow-xl active:scale-95 transition-all">🚩 FAN ROOM</button>
                </div>
                <p className="text-white text-[10px] md:text-sm font-bold leading-tight bg-white/5 p-4 rounded-xl border border-white/10 italic font-black">{L.fanRoomDesc}</p>
              </div>
            </div>

            <SectionHeader num="04" title={L.market} desc={L.marketDesc} />
            <div className="bg-black p-6 md:p-10 rounded-[40px] border border-white/20 space-y-6 mb-6 shadow-md text-left font-black animate-in fade-in">
              <h3 className="text-white text-sm md:text-2xl uppercase italic font-black border-l-4 border-[#daa520] pl-3 mb-4 font-sans leading-none font-black font-black">Register Goods</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-black">
                <input value={sellName} onChange={(e) => setSellName(e.target.value)} placeholder="상품명을 입력하십시오" className="w-full bg-black border-4 border-white p-5 rounded-2xl text-base md:text-xl text-white outline-none focus:border-[#daa520] placeholder:text-white/40 font-black" />
                <input type="number" value={sellPrice} onChange={(e) => setSellPrice(e.target.value)} placeholder="가격 (BEOM)" className="w-full bg-black border-4 border-white p-5 rounded-2xl text-base md:text-xl text-[#daa520] outline-none placeholder:text-[#daa520]/30 font-black" />
              </div>
              <textarea value={sellDesc} onChange={(e) => setSellDesc(e.target.value)} placeholder="판매 상품에 대한 상세 정보를 입력하십시오" className="w-full bg-black border-4 border-white p-5 rounded-2xl text-[12px] md:text-base text-white h-32 outline-none font-bold placeholder:text-white/40 font-black" />
              <div className="w-full font-black font-black">
                <input type="file" accept="image/*" onChange={handleImageUpload} ref={fileInputRef} className="hidden" />
                <button onClick={() => fileInputRef.current?.click()} className="w-full bg-black border-4 border-dashed border-white/20 p-6 rounded-2xl text-white text-center hover:border-white transition-all shadow-inner font-black">
                  {sellImg ? (
                    <div className="flex flex-col items-center gap-3 font-black">
                      <img src={sellImg} className="h-24 md:h-36 object-contain rounded-lg border-2 border-white shadow-lg font-black" alt="Preview" />
                      <span className="text-white text-[10px] md:text-sm font-bold uppercase font-black">사진 교체하기</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 py-4 font-black">
                      <span className="text-3xl md:text-5xl font-black">📸</span>
                      <span className="text-white text-sm md:text-lg uppercase tracking-widest font-black">제품 사진 업로드</span>
                    </div>
                  )}
                </button>
              </div>
              <button onClick={() => {
                if(!sellName || !sellPrice || !sellImg || !sellDesc) return alert("항목을 모두 입력하십시오.");
                setGoods([{ id: Date.now(), name: sellName, price: Number(sellPrice), img: sellImg, desc: sellDesc, reviews: [] }, ...goods]);
                setBeomToken(p=>p-20); setSellName(''); setSellPrice(''); setSellImg(''); setSellDesc('');
              }} className="w-full bg-[#daa520] text-black py-5 md:py-8 rounded-2xl md:rounded-[40px] text-lg md:text-2xl border-4 border-white uppercase font-black shadow-xl active:scale-95 font-black font-black font-black">{L.register} (20)</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 font-black text-left items-start">
              <div className="space-y-4 font-black font-sans font-black">
                <h3 className="text-white text-xs md:text-lg uppercase border-b-2 border-white pb-1 italic font-black tracking-widest pl-2 font-black font-black">GOODS LIST</h3>
                {goods.map(g => (
                  <div key={g.id} className="bg-[#111] p-6 md:p-8 rounded-[40px] border border-white/10 shadow-lg text-left group transition-all hover:border-[#daa520] font-black">
                    <img src={g.img} className="w-full h-40 md:h-64 object-contain bg-black rounded-[30px] border-2 border-white mb-6 shadow-inner transition-transform group-hover:scale-105" alt="G" />
                    <h4 className="text-white text-lg md:text-2xl uppercase mb-1 font-black leading-tight font-black font-black">{g.name}</h4>
                    <p className="text-white text-[10px] md:text-[13px] mb-4 font-bold leading-snug line-clamp-3 italic font-black font-black">"{g.desc}"</p>
                    <p className="text-[#daa520] text-2xl md:text-5xl mb-6 font-black tracking-tighter leading-none font-black font-black">{g.price.toLocaleString()} <span className="text-sm md:text-2xl font-black font-black">BEOM</span></p>
                    <button className="w-full py-4 md:py-6 bg-white text-black rounded-2xl md:rounded-[40px] text-sm md:text-xl border-4 border-[#daa520] uppercase font-black active:scale-95 shadow-md font-black font-black font-black">Buy Now</button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>

      {/* FOOTER NAVIGATION */}
      <div className="fixed bottom-4 left-3 right-3 max-w-4xl mx-auto bg-black border-2 border-white/20 p-1 rounded-[25px] flex justify-between gap-1 z-[200] shadow-[0_0_60px_rgba(255,255,255,0.1)] backdrop-blur-3xl font-black font-black">
        {['KEDHEON', 'CIVIL', 'NEXUS', 'VENDOR'].map(app => (
          <button key={app} className={`flex-1 py-3 md:py-4 rounded-[20px] text-[10px] md:text-2xl transition-all font-black text-center font-black ${app === 'KEDHEON' ? 'bg-[#daa520] text-black border-2 border-white shadow-inner scale-100 font-black' : 'text-white/40 hover:bg-white/10 hover:text-white font-black'}`}>{app}</button>
        ))}
      </div>

      <div className="mt-20 opacity-60 text-white text-[10px] md:text-xl tracking-[1.5em] uppercase pb-20 font-sans font-black text-center font-black">
        Kedheon master | V104.0 Hierarchy | @Ohsangjo
      </div>
    </div>
  );
}

