'use client';
import React, { useState, useEffect } from 'react';

/** * [KEDHEON EMPIRE V62.0 FINAL MASTER]
 * -----------------------------------------------------------
 * 텍스트 규격 (3-Tier Standard):
 * 1. LARGE  : text-4xl (섹션 타이틀, 핵심 지표)
 * 2. MEDIUM : text-xl  (단계 제목, 버튼 텍스트, 입력 필드)
 * 3. SMALL  : text-sm  (상세 설명, 메타 데이터, 푸터)
 * -----------------------------------------------------------
 */

const PI_INVITE_CODE = 'ohsangjo'; 
const PI_APP_STORE_URL = 'https://apps.apple.com/app/pi-network/id1445472541';
const PI_PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.blockchainvault';
const PI_TO_BEOM_RATIO = 100; 

const COSTS_BEOM = {
  POST_CREATION: 10,
  SUPPORT: 100,
  CREATE_FAN_ROOM: 500,
  SELL_ITEM: 20,
  ACTIVATE_QR: 50
};

interface Review { id: number; user: string; text: string; timestamp: string; }
interface Asset { id: number; title: string; desc: string; category: string; beomSupport: number; timestamp: string; url?: string; }
interface Good { id: number; name: string; price: number; img: string; seller: string; desc: string; reviews: Review[]; }

export default function KedheonPortal() {
  const [hasMounted, setHasMounted] = useState(false);
  const [tab, setTab] = useState<'ROOKIE' | 'PIONEER'>('ROOKIE');
  const [beomToken, setBeomToken] = useState(7991.88); 
  
  // 보안 및 비즈니스 상태
  const [qrType, setQrType] = useState<'PERSONAL' | 'BUSINESS'>('PERSONAL');
  const [bizName, setBizName] = useState('');
  const [isQrActive, setIsQrActive] = useState(false);
  
  // 창작 및 시장 데이터
  const [assets, setAssets] = useState<Asset[]>([]); 
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [showFanRoomModal, setShowFanRoomModal] = useState(false);
  const [fanRoomName, setFanRoomName] = useState('');

  const [goods] = useState<Good[]>([
    { id: 1, name: "EMPIRE GOLD BADGE", price: 1000, img: "/beom-token.png", seller: "Imperial", desc: "제국 공인 고유 황금 뱃지", reviews: [] }
  ]);

  useEffect(() => {
    setHasMounted(true);
    const saved = localStorage.getItem('kedheon_v62_master_final');
    if (saved) {
      const p = JSON.parse(saved);
      if (p.token) setBeomToken(p.token);
      if (p.assets) setAssets(p.assets);
    }
  }, []);

  useEffect(() => {
    if (hasMounted) {
      localStorage.setItem('kedheon_v62_master_final', JSON.stringify({ token: beomToken, assets }));
    }
  }, [beomToken, assets, hasMounted]);

  // 핸들러 로직
  const handleExchange = () => setBeomToken(p => p + PI_TO_BEOM_RATIO);
  const handleSupport = (id: number) => {
    if(beomToken < COSTS_BEOM.SUPPORT) return alert("자산 부족");
    setAssets(assets.map(a => a.id === id ? { ...a, beomSupport: a.beomSupport + COSTS_BEOM.SUPPORT } : a));
    setBeomToken(p => p - COSTS_BEOM.SUPPORT);
  };
  const handlePost = () => {
    if(!newTitle.trim()) return alert("제목을 입력하십시오.");
    if(beomToken < COSTS_BEOM.POST_CREATION) return alert("자산 부족");
    const post: Asset = { id: Date.now(), title: newTitle, desc: newDesc, category: 'TECH', beomSupport: 0, timestamp: new Date().toLocaleDateString(), url: newUrl };
    setAssets([post, ...assets]);
    setBeomToken(p => p - COSTS_BEOM.POST_CREATION);
    setNewTitle(''); setNewDesc(''); setNewUrl('');
  };

  if (!hasMounted) return null;

  return (
    <div className="flex flex-col items-center bg-black min-h-screen text-white font-sans w-full pb-40 font-black overflow-x-hidden">
      
      {/* --- [1. GNB: 상단바 버전 정보 복구] --- */}
      <div className="w-full max-w-4xl flex justify-between items-center p-5 sticky top-0 bg-black/95 backdrop-blur-md z-[150] border-b-2 border-[#daa520]">
        <div className="flex items-center gap-3">
          <img src="/kedheon-character.png" className="w-8 h-8 rounded-lg border border-[#daa520]" alt="K" />
          <div>
            <h2 className="text-[#daa520] text-xl italic leading-none">KEDHEON EMPIRE</h2>
            <span className="text-white/30 text-[10px] font-mono tracking-widest uppercase">v62.0 Final Master</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setTab('ROOKIE')} className={`px-5 py-2 rounded-md text-sm border transition-all ${tab === 'ROOKIE' ? 'bg-[#daa520] text-black border-[#daa520]' : 'border-white/10'}`}>ROOKIE</button>
          <button onClick={() => setTab('PIONEER')} className={`px-5 py-2 rounded-md text-sm border transition-all ${tab === 'PIONEER' ? 'bg-[#daa520] text-black border-[#daa520]' : 'border-white/10'}`}>PIONEER</button>
        </div>
      </div>

      <div className="w-full max-w-4xl px-4 py-10">
        {tab === 'ROOKIE' ? (
          /* --- [2. ROOKIE: 8단계 가입 절차] --- */
          <div className="flex flex-col gap-12 animate-in fade-in text-left">
            <div className="text-center">
              <h1 className="text-[#daa520] text-4xl md:text-6xl italic uppercase mb-4">Onboarding</h1>
              <p className="text-xl uppercase border-b border-[#daa520]/30 pb-4 inline-block">시민권 획득 8단계 표준 가이드</p>
            </div>

            <div className="grid gap-6">
              {[
                { s: "Step 01", t: "App Install", d: "스토어에서 [Pi Network] 공식 애플리케이션을 설치하십시오." },
                { s: "Step 02", t: "Method", d: "[Continue with phone number] 옵션을 선택하십시오." },
                { s: "Step 03", t: "Country Code", d: "국가 코드를 [South Korea (+82)]로 지정하고 번호를 입력하십시오." },
                { s: "Step 04", t: "Password", d: "영문 대/소문자, 숫자가 포함된 강력한 비밀번호를 생성하십시오." },
                { s: "Step 05", t: "Identity", d: "여권 영문 실명을 입력하고 제국에서 사용할 고유 ID를 설정하십시오." },
                { s: "Step 06", t: "Invitation", d: `초대 코드 [ ${PI_INVITE_CODE} ]를 입력하여 소속을 증명하십시오.`, gold: true },
                { s: "Step 07", t: "Secret Vault", d: "지갑 생성 시 나오는 24개 단어를 수기로 기록하여 금고에 보관하십시오.", danger: true },
                { s: "Step 08", t: "Activation", d: "번개 버튼을 눌러 채굴을 시작하고 정식 시민권을 획득하십시오.", gold: true }
              ].map((step, idx) => (
                <div key={idx} className={`p-6 bg-[#111] rounded-[30px] border-2 shadow-xl ${step.gold ? 'border-[#daa520]' : step.danger ? 'border-red-600' : 'border-white/5'}`}>
                  <p className="text-[#daa520] text-sm uppercase mb-1 tracking-tighter">{step.s}</p>
                  <h3 className="text-white text-xl uppercase italic mb-2">{step.t}</h3>
                  <p className="text-white/50 text-sm leading-relaxed font-sans">{step.d}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-4 font-sans">
              <button onClick={() => window.open(PI_APP_STORE_URL)} className="flex-1 bg-white text-black py-5 rounded-2xl text-xl font-black uppercase shadow-lg border-2 border-[#daa520]">App Store</button>
              <button onClick={() => window.open(PI_PLAY_STORE_URL)} className="flex-1 bg-white text-black py-5 rounded-2xl text-xl font-black uppercase shadow-lg border-2 border-[#daa520]">Play Store</button>
            </div>
          </div>
        ) : (
          /* --- [3. PIONEER: 자산 및 기능 대시보드] --- */
          <div className="flex flex-col gap-14 py-8 animate-in slide-in-from-bottom-5">
            
            {/* 자산 현황 (Large Text) */}
            <div className="bg-[#111] p-10 rounded-[60px] border-4 border-[#daa520] shadow-[0_0_50px_rgba(218,165,32,0.1)] flex flex-col md:flex-row justify-between items-center gap-10 relative">
                <div className="text-center md:text-left flex-1">
                  <h3 className="text-white/30 text-sm uppercase tracking-[0.4em] mb-4">Imperial Assets</h3>
                  <p className="text-[#daa520] text-4xl md:text-7xl tracking-tighter leading-none font-black">
                    {Math.floor(beomToken).toLocaleString()}
                    <span className="text-xl opacity-40">.{beomToken.toFixed(2).split('.')[1]}</span> 
                    <span className="ml-3 text-2xl">BEOM</span>
                  </p>
                  <div className="mt-6 bg-black/60 px-6 py-2 rounded-xl border border-white/10 inline-block text-xl font-mono italic text-white/50">
                    ≈ {(beomToken / PI_TO_BEOM_RATIO).toFixed(4)} Pi
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <img src="/kedheon-character.png" className="w-20 h-20 md:w-32 md:h-32 rounded-[30px] border-2 border-white/10 shadow-2xl" alt="K" />
                  <img src="/beom-token.png" className="w-16 h-16 md:w-28 md:h-28 object-contain animate-pulse" alt="B" />
                </div>
            </div>

            {/* 01. 환전 (Medium Text) */}
            <div className="text-left">
              <h2 className="text-[#daa520] text-4xl uppercase italic border-l-4 border-[#daa520] pl-4 mb-6">01. Exchange</h2>
              <div className="bg-[#111] p-10 rounded-[40px] border-2 border-white/10 flex flex-col md:flex-row justify-between items-center gap-8 shadow-2xl">
                <p className="text-white text-xl uppercase italic">Pi Network 기여도를 BEOM으로 전환하십시오.</p>
                <button onClick={handleExchange} className="w-full md:w-auto bg-[#daa520] text-black px-12 py-5 rounded-2xl text-xl border-4 border-white active:scale-95 uppercase">Exchange 1 Pi</button>
              </div>
            </div>

            {/* 02. 보안 인증 (Business Input 포함) */}
            <div className="text-left">
              <h2 className="text-[#daa520] text-4xl uppercase italic border-l-4 border-[#daa520] pl-4 mb-6">02. Secure Auth</h2>
              <div className="bg-[#111] p-10 rounded-[40px] border-2 border-white/10 flex flex-col items-center gap-8 shadow-2xl">
                <div className="flex gap-4 w-full max-w-sm bg-black p-2 rounded-2xl border border-white/10">
                  <button onClick={() => { setQrType('PERSONAL'); setIsQrActive(false); }} className={`flex-1 py-4 rounded-xl text-sm transition-all ${qrType === 'PERSONAL' ? 'bg-[#daa520] text-black font-black' : 'text-white/20'}`}>PERSONAL</button>
                  <button onClick={() => { setQrType('BUSINESS'); setIsQrActive(false); }} className={`flex-1 py-4 rounded-xl text-sm transition-all ${qrType === 'BUSINESS' ? 'bg-[#daa520] text-black font-black' : 'text-white/20'}`}>BUSINESS</button>
                </div>
                
                {qrType === 'BUSINESS' && (
                  <div className="w-full max-w-sm animate-in fade-in slide-in-from-top-2">
                    <p className="text-[#daa520] text-sm uppercase mb-2 ml-2 tracking-widest">Enterprise Identity</p>
                    <input 
                      type="text" value={bizName} onChange={(e) => setBizName(e.target.value.toUpperCase())} 
                      placeholder="ENTER BUSINESS NAME" 
                      className="w-full bg-black border-2 border-[#daa520] p-5 rounded-2xl text-center text-[#daa520] text-xl outline-none font-black"
                    />
                  </div>
                )}

                <div className={`p-6 bg-black border-2 rounded-[50px] transition-all flex items-center justify-center w-72 h-72 ${isQrActive ? 'border-[#daa520] shadow-[0_0_50px_rgba(218,165,32,0.3)]' : 'opacity-10'}`}>
                  {isQrActive ? <div className="text-[#daa520] text-sm animate-pulse uppercase tracking-[0.5em]">QR Active</div> : <p className="text-white/5 text-xl italic uppercase font-black">Locked</p>}
                </div>
                
                <button onClick={() => { if(qrType==='BUSINESS' && !bizName) return alert("기업명을 입력하십시오."); setIsQrActive(true); setBeomToken(p => p - COSTS_BEOM.ACTIVATE_QR); }} className="w-full max-w-sm bg-[#daa520] text-black py-5 rounded-2xl text-xl border-4 border-white active:scale-95 uppercase shadow-xl font-sans">인증 활성화 ({COSTS_BEOM.ACTIVATE_QR} BEOM)</button>
              </div>
            </div>

            {/* 03. 팬심 & 창작 (영상 시청 버튼 포함) */}
            <div className="text-left">
              <h2 className="text-[#daa520] text-4xl uppercase italic border-l-4 border-[#daa520] pl-4 mb-6">03. Creative</h2>
              <div className="bg-[#111] p-8 rounded-[40px] border-2 border-[#daa520]/30 space-y-4 mb-10 shadow-2xl">
                <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="제목 및 카테고리" className="w-full bg-black border border-white/10 p-5 rounded-xl text-xl text-white outline-none focus:border-[#daa520] font-sans" />
                <input value={newUrl} onChange={(e) => setNewUrl(e.target.value)} placeholder="영상 또는 이미지 URL" className="w-full bg-black border border-white/10 p-5 rounded-xl text-sm text-[#daa520] outline-none font-sans" />
                <textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="창작 의도 및 메시지" className="w-full bg-black border border-white/10 p-5 rounded-xl text-sm text-white/70 h-36 outline-none focus:border-[#daa520] font-sans" />
                <div className="flex gap-4">
                  <button onClick={handlePost} className="flex-[2] bg-[#daa520] text-black py-5 rounded-2xl text-xl border-2 border-white uppercase shadow-xl active:scale-95">피드 등록 ({COSTS_BEOM.POST_CREATION})</button>
                  <button onClick={() => setShowFanRoomModal(true)} className="flex-1 bg-white text-black py-5 rounded-2xl text-sm border-2 border-[#daa520] uppercase leading-tight active:scale-95 font-sans">🚩 팬방 개설<br/>({COSTS_BEOM.CREATE_FAN_ROOM})</button>
                </div>
              </div>

              {/* 창작 피드 리스트 */}
              <div className="space-y-8">
                {assets.map(a => (
                  <div key={a.id} className="bg-[#111] p-10 rounded-[50px] border-2 border-white/5 shadow-2xl relative">
                    <div className="flex justify-between items-start mb-6">
                      <h4 className="text-[#daa520] text-xl uppercase italic underline decoration-white/20 underline-offset-8">{a.title}</h4>
                      <span className="text-white/20 text-sm font-mono">{a.timestamp}</span>
                    </div>
                    {a.url && (
                      <div className="mb-6 p-5 bg-black rounded-2xl flex justify-between items-center border border-[#daa520]/20 font-sans">
                        <p className="text-xs text-[#daa520] truncate opacity-50 pr-6 italic">{a.url}</p>
                        <button onClick={() => window.open(a.url, '_blank')} className="bg-[#daa520] text-black px-6 py-2 rounded-xl text-sm font-black uppercase whitespace-nowrap active:scale-95 shadow-lg">Watch Video 📺</button>
                      </div>
                    )}
                    <p className="text-white/80 text-xl italic leading-relaxed mb-8 font-sans">"{a.desc}"</p>
                    <div className="flex justify-between items-center border-t border-white/5 pt-8">
                      <button onClick={() => handleSupport(a.id)} className="bg-[#daa520] text-black px-10 py-4 rounded-xl text-sm border-2 border-white uppercase font-black active:scale-95">👑 Praise ({COSTS_BEOM.SUPPORT})</button>
                      <p className="text-[#daa520] text-4xl tracking-tighter font-black">{a.beomSupport} <span className="text-sm">BEOM</span></p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 04. 제국 시장 */}
            <div className="text-left">
              <h2 className="text-[#daa520] text-4xl uppercase italic border-l-4 border-[#daa520] pl-4 mb-6">04. Merchant Square</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {goods.map(g => (
                  <div key={g.id} className="bg-[#111] p-8 rounded-[50px] border-2 border-white/10 shadow-2xl text-center group">
                    <img src={g.img} className="w-full h-64 object-contain bg-black rounded-[40px] mb-6 border border-white/5 shadow-inner transition-transform group-hover:scale-105" alt="G" />
                    <h4 className="text-white text-xl uppercase mb-2">{g.name}</h4>
                    <p className="text-[#daa520] text-4xl mb-6 font-black">{g.price.toLocaleString()} <span className="text-sm uppercase tracking-widest">Beom</span></p>
                    <button className="w-full py-5 bg-white text-black rounded-3xl text-xl border-4 border-[#daa520] uppercase font-black active:scale-95">Buy Now (Coming Soon)</button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>

      {/* --- [4. 앱 스위처: 고정 네비게이션] --- */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-black/95 border-2 border-[#daa520] p-2 rounded-3xl flex gap-4 z-[200] shadow-[0_0_60px_rgba(218,165,32,0.5)] backdrop-blur-2xl">
        {['KEDHEON', 'CIVIL', 'NEXUS', 'VENDOR'].map(app => (
          <button key={app} className={`px-6 py-3 rounded-2xl text-sm transition-all font-black ${app === 'KEDHEON' ? 'bg-[#daa520] text-black scale-110 shadow-lg' : 'text-white/30 hover:text-white'}`}>{app}</button>
        ))}
      </div>

      {/* 모달: 팬방 개설 */}
      {showFanRoomModal && (
        <div className="fixed inset-0 bg-black/98 backdrop-blur-2xl z-[300] flex items-center justify-center p-4 animate-in zoom-in-95">
          <div className="bg-[#111] p-12 rounded-[60px] border-4 border-[#daa520] w-full max-w-md text-center shadow-2xl">
            <h3 className="text-[#daa520] text-4xl mb-8 italic uppercase font-black">New Hideout</h3>
            <input value={fanRoomName} onChange={(e) => setFanRoomName(e.target.value)} placeholder="아지트 명칭 입력" className="bg-black border-2 border-white p-6 rounded-2xl w-full text-2xl text-white mb-8 outline-none text-center font-black focus:border-[#daa520]" />
            <div className="flex gap-4">
              <button onClick={() => setShowFanRoomModal(false)} className="flex-1 py-5 bg-white/10 text-white rounded-2xl text-sm font-black uppercase">Cancel</button>
              <button onClick={() => { if(!fanRoomName) return; setBeomToken(p => p - COSTS_BEOM.CREATE_FAN_ROOM); setShowFanRoomModal(false); setFanRoomName(''); alert("개설 신청이 접수되었습니다."); }} className="flex-1 py-5 bg-[#daa520] text-black rounded-2xl text-sm border-2 border-white uppercase font-black shadow-lg">Create ({COSTS_BEOM.CREATE_FAN_ROOM})</button>
            </div>
          </div>
        </div>
      )}

      {/* --- [5. 푸터: 버전 정보 명시] --- */}
      <div className="mt-32 opacity-20 text-sm tracking-[1.5em] uppercase pb-20 font-sans">
        KEDHEON EMPIRE | V62.0 FINAL MASTER | @OHSANGJO
      </div>
    </div>
  );
}
