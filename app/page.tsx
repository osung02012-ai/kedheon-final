'use client';
import React, { useState, useEffect } from 'react';

// --- [제국 핵심 설정] ---
const PI_INVITE_CODE = 'ohsangjo'; 
const PI_APP_STORE_URL = 'https://apps.apple.com/app/pi-network/id1445472541';
const PI_PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.blockchainvault';

interface Asset { 
  id: number; 
  title: string; 
  desc: string; 
  category: string; 
  beomSupport: number; 
  owner: string; 
  timestamp: string; 
}

export default function KedheonPortal() {
  const [hasMounted, setHasMounted] = useState(false);
  const [lang, setLang] = useState<'KO' | 'EN'>('KO');
  const [tab, setTab] = useState<'ROOKIE' | 'PIONEER'>('PIONEER');
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  const [beomToken, setBeomToken] = useState(8141.88);
  const [contributedBeom, setContributedBeom] = useState(0);
  const [qrType, setQrType] = useState<'PERSONAL' | 'BUSINESS'>('PERSONAL');
  const [bizName, setBizName] = useState('');
  const [isQrActive, setIsQrActive] = useState(false);
  const [category, setCategory] = useState('ALL');
  
  const [assets, setAssets] = useState<Asset[]>([]); 
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createTitle, setCreateTitle] = useState('');

  const cats = ['MUSIC', 'SPORTS', 'ANIME', 'DRAMA', 'MOVIE', 'ESPORTS', 'COMEDY', 'TRAVEL', 'FOOD', 'BEAUTY', 'FASHION', 'TECH'];

  const t = lang === 'KO' ? {
    welcomeD: "Kedheon Empire 웹3에 참여하세요",
    guideBtn: "신규 시민 가이드 (파이 가입)",
    onboardH: "IMPERIAL ONBOARDING",
    step1: "1. 하단 버튼으로 Pi Network 설치",
    step2: `2. 가입 시 추천인 코드 [ ${PI_INVITE_CODE} ] 입력`,
    step3: "3. 채굴한 Pi를 BEOM 토큰으로 환전하여 이용",
    authT: "IMPERIAL SECURE AUTH",
    buyT: "ACQUIRE BEOM TOKEN",
    fanT: "IMPERIAL FANDOM & FEED",
    postBtn: "제국 피드 방송 (10 BEOM)",
    supportBtn: "👑 찬양"
  } : {
    welcomeD: "Join the Kedheon Empire Web3 Ecosystem",
    guideBtn: "New Citizen Guide (Sign up Pi)",
    onboardH: "IMPERIAL ONBOARDING",
    step1: "1. Install Pi Network via buttons",
    step2: `2. Use Invitation Code [ ${PI_INVITE_CODE} ]`,
    step3: "3. Exchange Pi to BEOM and Enjoy",
    authT: "SECURE AUTH",
    buyT: "ACQUIRE BEOM TOKEN",
    fanT: "IMPERIAL FANDOM & FEED",
    postBtn: "Broadcast Feed (10 BEOM)",
    supportBtn: "👑 Praise"
  };

  useEffect(() => {
    setHasMounted(true);
    const saved = localStorage.getItem('kedheon_v49_master');
    if (saved) {
      try {
        const p = JSON.parse(saved);
        setBeomToken(p.token || 8141.88);
        if (Array.isArray(p.assets)) setAssets(p.assets);
      } catch (e) { console.error("Integrity check."); }
    }
  }, []);

  useEffect(() => {
    if (hasMounted) {
      localStorage.setItem('kedheon_v49_master', JSON.stringify({ token: beomToken, assets }));
    }
  }, [beomToken, assets, hasMounted]);

  if (!hasMounted) return null;

  return (
    <div className="flex flex-col items-center bg-black min-h-screen text-white font-sans w-full pb-20 overflow-x-hidden text-center">
      
      {/* 1. 상단 네비게이션 */}
      <div className="w-full max-w-5xl flex justify-between items-center p-4 md:p-6 sticky top-0 bg-black/95 backdrop-blur-md z-[150] border-b-4 border-[#daa520] shadow-2xl">
        <button onClick={() => setLang(l => l === 'KO' ? 'EN' : 'KO')} className="text-[#daa520] font-black text-xs border-2 border-[#daa520] px-4 py-1.5 rounded-full uppercase">
          {lang === 'KO' ? "ENGLISH" : "한국어"}
        </button>
        <div className="flex gap-2">
          <button onClick={() => setTab('ROOKIE')} className={`px-4 py-1.5 rounded-lg font-black text-xs border-2 transition-all ${tab === 'ROOKIE' ? 'bg-[#daa520] text-black border-[#daa520]' : 'bg-black text-white border-white'}`}>ROOKIE</button>
          <button onClick={() => setTab('PIONEER')} className={`px-4 py-1.5 rounded-lg font-black text-xs border-2 transition-all ${tab === 'PIONEER' ? 'bg-[#daa520] text-black border-[#daa520]' : 'bg-black text-white border-white'}`}>PIONEER</button>
        </div>
      </div>

      <div className="w-full max-w-5xl px-4 md:px-6">
        
        {tab === 'ROOKIE' ? (
          /* [ROOKIE] 가이드 섹션 - 고정 */
          <div className="flex flex-col items-center py-16 animate-in fade-in duration-700">
            <img src="/kedheon-character.png" className="w-32 h-32 md:w-56 md:h-56 rounded-3xl mb-8 border-4 border-[#daa520] shadow-[0_0_40px_rgba(218,165,32,0.4)]" alt="K" />
            <h1 className="text-4xl md:text-6xl font-black text-[#daa520] italic uppercase mb-4 tracking-tighter">Kedheon Empire</h1>
            <p className="text-white font-black text-lg md:text-2xl mb-12 border-y-2 border-white/20 py-2 px-6 font-sans">{t.welcomeD}</p>

            {!showOnboarding ? (
              <button onClick={() => setShowOnboarding(true)} className="bg-white text-black px-12 py-5 rounded-full font-black text-xl md:text-2xl border-4 border-[#daa520] hover:scale-105 active:scale-95 transition-all shadow-2xl">
                {t.guideBtn}
              </button>
            ) : (
              <div className="w-full bg-[#111] p-6 md:p-10 rounded-[40px] border-4 border-white shadow-2xl space-y-8 animate-in slide-in-from-bottom-5">
                <h2 className="text-[#daa520] font-black text-2xl md:text-4xl uppercase italic">{t.onboardH}</h2>
                <div className="space-y-4 text-left font-bold">
                  {[t.step1, t.step2, t.step3].map((step, i) => (
                    <div key={i} className="bg-black p-5 rounded-2xl border-2 border-white/20 flex items-center gap-4">
                      <span className="bg-[#daa520] text-black w-10 h-10 flex items-center justify-center rounded-full font-black text-xl flex-shrink-0">{i+1}</span>
                      <p className="text-sm md:text-xl text-white leading-snug">{step}</p>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col md:flex-row gap-4 pt-4">
                  <button onClick={() => window.open(PI_APP_STORE_URL)} className="flex-1 bg-white text-black py-6 rounded-2xl font-black text-lg border-4 border-[#daa520] hover:scale-105 uppercase transition-all">App Store</button>
                  <button onClick={() => window.open(PI_PLAY_STORE_URL)} className="flex-1 bg-white text-black py-6 rounded-2xl font-black text-lg border-4 border-[#daa520] hover:scale-105 uppercase transition-all">Play Store</button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* [PIONEER] 메인 에코시스템 */
          <div className="flex flex-col gap-16 py-10 animate-in slide-in-from-bottom-5">
            
            {/* 00. 대시보드 - ohsangjo.pi 삭제 완료 */}
            <div className="bg-[#111] p-8 rounded-[40px] border-4 border-[#daa520] shadow-2xl flex flex-col md:flex-row justify-between items-center gap-8">
               <div className="text-center md:text-left flex-1">
                  <h3 className="text-white/60 font-black text-sm uppercase tracking-widest mb-2">Imperial Assets</h3>
                  <p className="text-[#daa520] font-black text-5xl md:text-7xl tracking-tighter leading-none font-sans font-black">{beomToken.toLocaleString()} BEOM</p>
                  <div className="mt-4 bg-black px-6 py-2 rounded-xl border-2 border-white inline-block text-xl font-mono text-white italic">≈ 25.9164 Pi</div>
               </div>
               <div className="flex items-center gap-6">
                  <img src="/kedheon-character.png" className="w-24 h-24 md:w-32 md:h-32 rounded-3xl border-4 border-white shadow-xl" alt="Char" />
                  <img src="/beom-token.png" className="w-20 h-20 md:w-32 md:h-32" alt="Token" />
               </div>
            </div>

            {/* 01. 범토큰 구입 섹션 - 신설 */}
            <div className="flex flex-col w-full text-left">
              <h3 className="text-[#daa520] font-black text-2xl md:text-4xl uppercase border-l-8 border-[#daa520] pl-4 mb-6 italic tracking-widest font-sans font-black">01 {t.buyT}</h3>
              <div className="bg-[#111] p-8 rounded-[40px] border-4 border-white shadow-2xl grid md:grid-cols-2 gap-8 items-center">
                <div className="text-left space-y-4">
                  <p className="text-white text-lg font-bold">제국의 모든 서비스는 BEOM 토큰으로 작동합니다.</p>
                  <p className="text-white/60 text-sm italic font-bold leading-relaxed">파이(Pi)를 제국 금고로 전송하여 BEOM 토큰을 획득하십시오. (환율: 1 Pi = 314.159 BEOM)</p>
                </div>
                <button onClick={() => alert("Pi 결제창으로 연결됩니다.")} className="w-full bg-[#daa520] text-black py-6 rounded-2xl font-black text-2xl border-4 border-white shadow-xl hover:scale-105 active:scale-95 transition-all">
                  BUY BEOM WITH PI
                </button>
              </div>
            </div>

            {/* 02. 보안 신분 인증 - QR 복구 완료 */}
            <div className="flex flex-col w-full text-left">
              <h3 className="text-[#daa520] font-black text-2xl md:text-4xl uppercase border-l-8 border-[#daa520] pl-4 mb-6 italic tracking-widest font-sans font-black">02 {t.authT}</h3>
              <div className="bg-[#111] p-6 md:p-10 rounded-[40px] border-4 border-white flex flex-col items-center gap-8 shadow-2xl">
                <div className="flex gap-2 w-full max-w-md bg-black p-2 rounded-2xl border-4 border-[#daa520]">
                  <button onClick={() => { setQrType('PERSONAL'); setIsQrActive(false); }} className={`flex-1 py-3 rounded-xl font-black transition-all ${qrType === 'PERSONAL' ? 'bg-[#daa520] text-black' : 'text-white/30'}`}>PERSONAL</button>
                  <button onClick={() => { setQrType('BUSINESS'); setIsQrActive(false); }} className={`flex-1 py-3 rounded-xl font-black transition-all ${qrType === 'BUSINESS' ? 'bg-[#daa520] text-black' : 'text-white/30'}`}>BUSINESS</button>
                </div>
                {qrType === 'BUSINESS' && <input type="text" value={bizName} onChange={(e) => setBizName(e.target.value)} placeholder="ENTER BUSINESS NAME" className="w-full max-w-md bg-black border-4 border-[#daa520] p-4 rounded-xl text-center font-black text-[#daa520] outline-none text-xl" />}
                
                {/* QR 이미지 표시 영역 - 복구 및 대형화 */}
                <div className={`p-6 bg-black border-4 rounded-[40px] shadow-2xl transition-all ${isQrActive ? 'border-[#daa520]' : 'opacity-20 border-white'}`}>
                  {isQrActive ? (
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=KEDHEON_${qrType}_${bizName || PI_INVITE_CODE}`} 
                      className="w-64 h-64 md:w-96 md:h-96 rounded-2xl shadow-[0_0_50px_rgba(218,165,32,0.4)]" 
                      alt="SECURE_QR" 
                    />
                  ) : (
                    <div className="w-64 h-64 md:w-96 md:h-96 flex items-center justify-center text-white/10 text-4xl md:text-6xl font-black italic">ENCRYPTED</div>
                  )}
                </div>
                <button onClick={() => { setIsQrActive(true); setBeomToken(p => p - 50); }} className="bg-[#daa520] text-black px-12 py-5 rounded-2xl font-black text-xl md:text-3xl border-4 border-white shadow-2xl active:scale-95 transition-all uppercase">인증 활성화 (50 BEOM)</button>
              </div>
            </div>

            {/* 03. 팬덤 게시물 및 창작 허브 - 부활 */}
            <div className="flex flex-col w-full text-left">
              <h3 className="text-[#daa520] font-black text-2xl md:text-4xl uppercase border-l-8 border-[#daa520] pl-4 mb-8 italic tracking-widest font-sans font-black">03 {t.fanT}</h3>
              
              {/* 창작물 등록 섹션 */}
              <div className="w-full bg-[#111] p-6 md:p-8 rounded-[40px] border-4 border-[#daa520] space-y-4 mb-12 shadow-xl">
                <input 
                  type="text" 
                  value={newTitle} 
                  onChange={(e) => setNewTitle(e.target.value)} 
                  placeholder="방송 제목 (TITLE)" 
                  className="bg-black border-4 border-white p-4 rounded-xl w-full text-lg md:text-2xl font-black text-white outline-none focus:border-[#daa520]" 
                />
                <textarea 
                  value={newDesc} 
                  onChange={(e) => setNewDesc(e.target.value)} 
                  placeholder="본인 창작물 및 방송 내용 (DETAILS)" 
                  className="bg-black border-4 border-white p-4 rounded-xl w-full text-sm md:text-lg font-bold text-white/80 h-32 resize-none outline-none focus:border-[#daa520]" 
                />
                <button 
                  onClick={() => {
                    if(!newTitle.trim()) return alert("제목을 입력하세요!");
                    setAssets([{ id: Date.now(), title: newTitle, desc: newDesc, category, beomSupport: 0, owner: 'MASTER', timestamp: new Date().toLocaleDateString() }, ...assets]);
                    setBeomToken(p => p - 10); setNewTitle(''); setNewDesc('');
                  }}
                  className="w-full py-5 rounded-2xl bg-[#daa520] text-black font-black text-xl md:text-2xl border-4 border-white shadow-lg active:scale-95 transition-all uppercase"
                >
                  {t.postBtn}
                </button>
              </div>

              {/* 카테고리 필터 */}
              <div className="grid grid-cols-4 md:grid-cols-6 gap-2 mb-8">
                {cats.map(cat => (
                  <button key={cat} onClick={() => setCategory(cat)} className={`py-4 rounded-xl font-black text-[10px] md:text-xs border-2 transition-all ${category === cat ? 'bg-[#daa520] text-black border-[#daa520]' : 'bg-black text-white/40 border-white/20'}`}>{cat}</button>
                ))}
              </div>
              
              <button onClick={() => setShowCreateModal(true)} className="w-full py-6 rounded-3xl bg-white text-black font-black text-2xl border-4 border-[#daa520] mb-12 shadow-xl hover:bg-[#daa520] hover:text-black transition-all italic uppercase">➕ 팬방 개설 (500 BEOM)</button>
              
              <div className="space-y-12">
                {assets.filter(a => category === 'ALL' || a.category === category).map(a => (
                  <div key={a.id} className="bg-[#111] rounded-[50px] border-4 border-white p-8 md:p-12 space-y-8 shadow-2xl relative transition-all hover:border-[#daa520]">
                    <div className="flex justify-between items-start">
                      <h4 className="text-3xl md:text-5xl font-black text-[#daa520] tracking-tighter uppercase leading-none">{a.title}</h4>
                      <span className="text-white/20 font-mono text-sm tracking-widest">{a.timestamp}</span>
                    </div>
                    <p className="text-white text-xl md:text-3xl font-bold italic leading-relaxed text-left">"{a.desc}"</p>
                    <div className="pt-8 border-t-4 border-white/10 flex justify-between items-center gap-4">
                      <button onClick={() => setBeomToken(p => p - 100)} className="bg-white text-black px-10 py-4 rounded-2xl font-black text-xl border-4 border-[#daa520] shadow-md hover:bg-[#daa520] transition-all">👑 찬양</button>
                      <p className="text-[#daa520] font-black text-4xl md:text-7xl tracking-tighter">{a.beomSupport.toLocaleString()} <span className="text-xl">BEOM</span></p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 팬방 개설 모달 */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/98 backdrop-blur-3xl z-[300] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-[#111] p-10 rounded-[50px] border-8 border-[#daa520] w-full max-w-2xl text-center shadow-2xl">
            <h3 className="text-[#daa520] font-black text-4xl mb-10 italic uppercase tracking-widest font-sans">New Fan Territory</h3>
            <input type="text" value={createTitle} onChange={(e) => setCreateTitle(e.target.value)} placeholder="팬방 명칭 입력" className="bg-black border-4 border-white p-6 rounded-2xl w-full text-3xl text-center font-black text-white mb-10 outline-none focus:border-[#daa520]" />
            <div className="flex gap-4">
              <button onClick={() => setShowCreateModal(false)} className="flex-1 py-5 rounded-2xl font-black text-xl bg-white/10 border-4 border-white uppercase">Cancel</button>
              <button onClick={() => { setShowCreateModal(false); setCreateTitle(''); alert("개설 완료!"); }} className="flex-1 py-5 rounded-2xl font-black text-xl bg-[#daa520] text-black border-4 border-white shadow-xl uppercase transition-all">Create</button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-20 opacity-40 text-center w-full pb-10 font-mono text-white text-[10px] tracking-[1em] uppercase">
        KEDHEON EMPIRE | INTEGRITY MASTER V49.0 | ohsangjo
      </div>
    </div>
  );
}
