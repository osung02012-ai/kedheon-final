'use client';
import React, { useState, useEffect } from 'react';

// --- [제국 전략 데이터] ---
const PI_INVITE_CODE = 'ohsangjo'; 
const PI_APP_STORE_URL = 'https://apps.apple.com/app/pi-network/id1445472541';
const PI_PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.blockchainvault';

interface Asset { id: number; title: string; desc: string; category: string; beomSupport: number; owner: string; timestamp: string; }

export default function KedheonPortal() {
  const [hasMounted, setHasMounted] = useState(false);
  const [lang, setLang] = useState<'KO' | 'EN'>('KO');
  const [tab, setTab] = useState<'ROOKIE' | 'PIONEER'>('ROOKIE');
  const [isPioneer, setIsPioneer] = useState(false); // 시민권 획득 여부
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [passInput, setPassInput] = useState('');
  
  const [beomToken, setBeomToken] = useState(8141.88);
  const [contributedBeom, setContributedBeom] = useState(0);
  const [qrType, setQrType] = useState<'PERSONAL' | 'BUSINESS'>('PERSONAL');
  const [isQrActive, setIsQrActive] = useState(false);
  const [category, setCategory] = useState('ALL');
  const [assets, setAssets] = useState<Asset[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createTitle, setCreateTitle] = useState('');

  const cats = ['MUSIC', 'SPORTS', 'ANIME', 'DRAMA', 'MOVIE', 'ESPORTS', 'COMEDY', 'TRAVEL', 'FOOD', 'BEAUTY', 'FASHION', 'TECH'];

  const t = lang === 'KO' ? {
    welcomeD: "Kedheon Empire 웹3에 참여하세요",
    claimBtn: "시민권 획득하기",
    onboardH: "IMPERIAL ONBOARDING",
    step1: "1. 아래 버튼을 눌러 파이코인 앱을 설치하십시오.",
    step2: `2. 가입 시 추천인 코드 [ ${PI_INVITE_CODE} ]를 입력하십시오.`,
    step3: "3. 채굴 시작 후, 본인이 입력한 코드를 아래에 확인하십시오.",
    passPlaceholder: "추천인 코드를 입력하여 인증",
    entryBtn: "제국 입국 승인",
    securityM: "보안상 가입 의사가 있는 분에게만 정보를 공개합니다."
  } : {
    welcomeD: "Join the Kedheon Empire Web3 Ecosystem",
    claimBtn: "Claim Citizenship",
    onboardH: "IMPERIAL ONBOARDING",
    step1: "1. Install Pi App via the buttons below.",
    step2: `2. Use Invitation Code [ ${PI_INVITE_CODE} ] during signup.`,
    step3: "3. Start mining and enter the code to verify.",
    passPlaceholder: "Verify invitation code",
    entryBtn: "Authorize Entry",
    securityM: "Information is revealed only to seeking citizens."
  };

  // [중요] 마운트 시 시민권 여부 자동 확인 (여과 없는 진입 로직)
  useEffect(() => {
    setHasMounted(true);
    const saved = localStorage.getItem('kedheon_v45_integrity');
    if (saved) {
      try {
        const p = JSON.parse(saved);
        setBeomToken(p.token || 8141.88); 
        setAssets(p.assets || []); 
        setContributedBeom(p.staked || 0);
        
        if (p.isPioneer) {
          setIsPioneer(true);
          setTab('PIONEER'); // 이미 파이오니어라면 여과 없이 바로 진입
        }
      } catch (e) { console.error("Integrity check failed."); }
    }
  }, []);

  useEffect(() => {
    if (hasMounted) {
      localStorage.setItem('kedheon_v45_integrity', JSON.stringify({ 
        token: beomToken, assets, staked: contributedBeom, isPioneer 
      }));
    }
  }, [beomToken, assets, contributedBeom, hasMounted, isPioneer]);

  const handleEntry = () => {
    if (passInput.trim().toLowerCase() === PI_INVITE_CODE.toLowerCase()) {
      setIsPioneer(true);
      setTab('PIONEER');
    } else {
      alert(lang === 'KO' ? "코드가 일치하지 않습니다." : "Invalid Code.");
    }
  };

  if (!hasMounted) return null;

  return (
    <div className="flex flex-col items-center bg-black min-h-screen text-white font-sans w-full pb-20 overflow-x-hidden text-center">
      
      {/* 1. 상단 글로벌 네비게이션: 시민권자는 여과 없이 탭 이동 가능 */}
      <div className="w-full max-w-5xl flex justify-between items-center p-4 md:p-6 sticky top-0 bg-black/95 backdrop-blur-md z-[150] border-b-4 border-[#daa520] shadow-2xl">
        <button onClick={() => setLang(l => l === 'KO' ? 'EN' : 'KO')} className="text-[#daa520] font-black text-xs border-2 border-[#daa520] px-4 py-1.5 rounded-full uppercase">
          {lang === 'KO' ? "ENGLISH" : "한국어"}
        </button>
        <div className="flex gap-2">
          <button onClick={() => setTab('ROOKIE')} className={`px-4 py-1.5 rounded-lg font-black text-xs border-2 transition-all ${tab === 'ROOKIE' ? 'bg-[#daa520] text-black border-[#daa520]' : 'bg-black text-white border-white'}`}>ROOKIE</button>
          <button 
            onClick={() => isPioneer ? setTab('PIONEER') : alert("시민권 인증이 필요합니다.")} 
            className={`px-4 py-1.5 rounded-lg font-black text-xs border-2 transition-all ${tab === 'PIONEER' ? 'bg-[#daa520] text-black border-[#daa520]' : 'bg-black text-white/30 border-white/10'}`}
          >
            {isPioneer ? 'PIONEER' : '🔒 PIONEER'}
          </button>
        </div>
      </div>

      <div className="w-full max-w-5xl px-4 md:px-6">
        
        {/* [ROOKIE TAB] - 미인증 사용자 및 가이드 영역 */}
        {tab === 'ROOKIE' ? (
          <div className="flex flex-col items-center py-16 animate-in fade-in duration-700">
            <img src="/kedheon-character.png" className="w-32 h-32 md:w-56 md:h-56 rounded-3xl mb-8 border-4 border-[#daa520] shadow-[0_0_40px_rgba(218,165,32,0.4)]" alt="K" />
            <h1 className="text-4xl md:text-6xl font-black text-[#daa520] italic uppercase mb-4 tracking-tighter">Kedheon Empire</h1>
            <p className="text-white font-black text-lg md:text-2xl mb-12 border-y-2 border-white/20 py-2 px-6">{t.welcomeD}</p>

            {/* 시민권 미보유 시에만 가이드 제공 */}
            {!isPioneer ? (
              !showOnboarding ? (
                <div className="flex flex-col items-center gap-6">
                  <button onClick={() => setShowOnboarding(true)} className="bg-[#daa520] text-black px-12 py-5 rounded-full font-black text-2xl md:text-4xl shadow-2xl border-4 border-white hover:scale-105 active:scale-95 transition-all">
                    {t.claimBtn}
                  </button>
                  <p className="text-white/40 font-bold text-xs uppercase tracking-widest italic">{t.securityM}</p>
                </div>
              ) : (
                <div className="w-full space-y-12 animate-in slide-in-from-bottom-5">
                  <div className="w-full bg-[#111] p-6 md:p-10 rounded-[40px] border-4 border-white shadow-2xl space-y-8">
                    <h2 className="text-[#daa520] font-black text-2xl md:text-4xl uppercase italic">{t.onboardH}</h2>
                    <div className="space-y-4 text-left">
                      {[t.step1, t.step2, t.step3].map((step, i) => (
                        <div key={i} className="bg-black p-5 rounded-2xl border-2 border-white/20 flex items-center gap-4">
                          <span className="bg-[#daa520] text-black w-10 h-10 flex items-center justify-center rounded-full font-black text-xl flex-shrink-0">{i+1}</span>
                          <p className="text-white font-black text-sm md:text-xl leading-snug">{step}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-col md:flex-row gap-4 pt-4">
                      <button onClick={() => window.open(PI_APP_STORE_URL)} className="flex-1 bg-white text-black py-6 rounded-2xl font-black text-lg border-4 border-[#daa520] shadow-xl transition-all uppercase font-sans">iOS App Store</button>
                      <button onClick={() => window.open(PI_PLAY_STORE_URL)} className="flex-1 bg-white text-black py-6 rounded-2xl font-black text-lg border-4 border-[#daa520] shadow-xl transition-all uppercase font-sans">Google Play</button>
                    </div>
                  </div>
                  <div className="w-full max-w-md mx-auto bg-black/50 p-8 rounded-3xl border-4 border-[#daa520] shadow-2xl">
                    <input type="text" value={passInput} onChange={(e) => setPassInput(e.target.value)} placeholder={t.passPlaceholder} className="w-full bg-black border-2 border-white p-5 rounded-xl text-center font-black text-2xl text-[#daa520] mb-4 outline-none focus:border-[#daa520]" />
                    <button onClick={handleEntry} className="w-full bg-[#daa520] text-black py-5 rounded-full font-black text-xl border-4 border-white shadow-2xl transition-all uppercase">{t.entryBtn}</button>
                  </div>
                </div>
              )
            ) : (
              <div className="py-10">
                <p className="text-[#daa520] font-black text-2xl md:text-4xl italic mb-6 animate-pulse">CITIZENSHIP VERIFIED</p>
                <button onClick={() => setTab('PIONEER')} className="bg-white text-black px-12 py-5 rounded-full font-black text-xl border-4 border-[#daa520] shadow-2xl">제국 대시보드로 이동</button>
              </div>
            )}
          </div>
        ) : (
          /* [PIONEER TAB] - 인증된 시민 전용 구역 (여과 없는 진입) */
          <div className="flex flex-col gap-16 py-10 animate-in slide-in-from-bottom-5">
            {/* 00. 피오니어 대시보드 */}
            <div className="bg-[#111] p-8 rounded-[40px] border-4 border-[#daa520] shadow-2xl flex flex-col md:flex-row justify-between items-center gap-8">
               <div className="text-center md:text-left flex-1">
                  <h3 className="text-white/60 font-black text-sm uppercase tracking-widest mb-2">Imperial Assets</h3>
                  <p className="text-[#daa520] font-black text-5xl md:text-7xl tracking-tighter leading-none">{beomToken.toLocaleString()} BEOM</p>
                  <div className="mt-4 bg-black px-6 py-2 rounded-xl border-2 border-white inline-block text-xl font-mono text-white italic">≈ 25.9164 Pi</div>
               </div>
               <div className="flex items-center gap-6">
                  <img src="/kedheon-character.png" className="w-24 h-24 md:w-32 md:h-32 rounded-3xl border-4 border-white shadow-xl" alt="Char" />
                  <div className="flex flex-col items-center">
                    <img src="/beom-token.png" className="w-20 h-20 md:w-32 md:h-32" alt="Token" />
                    <p className="bg-[#daa520] text-black px-4 py-1 rounded-full font-black text-xs border-2 border-white uppercase tracking-tighter shadow-md">{PI_INVITE_CODE}.Pi</p>
                  </div>
               </div>
            </div>

            {/* 01. 보안 신분 인증 (QR 대형화) */}
            <div className="flex flex-col w-full text-left">
              <h3 className="text-[#daa520] font-black text-2xl md:text-4xl uppercase border-l-8 border-[#daa520] pl-4 mb-6 italic tracking-widest font-sans">01 Secure Authentication</h3>
              <div className="bg-[#111] p-6 md:p-10 rounded-[40px] border-4 border-white flex flex-col items-center gap-8 shadow-2xl">
                <div className="flex gap-2 w-full max-w-md bg-black p-2 rounded-2xl border-4 border-[#daa520]">
                  <button onClick={() => setQrType('PERSONAL')} className={`flex-1 py-3 rounded-xl font-black transition-all ${qrType === 'PERSONAL' ? 'bg-[#daa520] text-black' : 'text-white/30'}`}>PERSONAL</button>
                  <button onClick={() => setQrType('BUSINESS')} className={`flex-1 py-3 rounded-xl font-black transition-all ${qrType === 'BUSINESS' ? 'bg-[#daa520] text-black' : 'text-white/30'}`}>BUSINESS</button>
                </div>
                <div className={`p-6 bg-black border-4 rounded-[40px] shadow-2xl transition-all ${isQrActive ? 'border-[#daa520]' : 'opacity-20 border-white'}`}>
                  {isQrActive ? <img src={`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=KEDHEON_${qrType}_${PI_INVITE_CODE}`} className="w-64 h-64 md:w-96 md:h-96 rounded-2xl" alt="QR" /> : <div className="w-64 h-64 md:w-96 md:h-96 flex items-center justify-center text-white/10 text-4xl md:text-6xl font-black italic">ENCRYPTED</div>}
                </div>
                <button onClick={() => setIsQrActive(true)} className="bg-[#daa520] text-black px-12 py-5 rounded-2xl font-black text-xl md:text-3xl border-4 border-white shadow-2xl active:scale-95 transition-all uppercase">인증 활성화 (50 BEOM)</button>
              </div>
            </div>

            {/* 02. 팬방 영토 */}
            <div className="flex flex-col w-full text-left">
              <h3 className="text-[#daa520] font-black text-2xl md:text-4xl uppercase border-l-8 border-[#daa520] pl-4 mb-8 italic tracking-widest font-sans">02 Fandom Territories</h3>
              <div className="grid grid-cols-4 md:grid-cols-6 gap-2 mb-8">
                {cats.map(cat => (
                  <button key={cat} onClick={() => setCategory(cat)} className={`py-4 rounded-xl font-black text-[10px] md:text-xs border-2 transition-all ${category === cat ? 'bg-[#daa520] text-black border-[#daa520]' : 'bg-black text-white/40 border-white/20'}`}>{cat}</button>
                ))}
              </div>
              <button onClick={() => setShowCreateModal(true)} className="w-full py-6 rounded-3xl bg-white text-black font-black text-2xl border-4 border-[#daa520] mb-12 shadow-xl hover:bg-[#daa520] transition-all italic uppercase">➕ 팬방 개설 (500 BEOM)</button>
              
              <div className="space-y-12">
                {assets.filter(a => category === 'ALL' || a.category === category).map(a => (
                  <div key={a.id} className="bg-[#111] rounded-[50px] border-4 border-white p-8 md:p-12 space-y-8 shadow-2xl relative transition-all hover:border-[#daa520]">
                    <div className="flex justify-between items-start">
                      <h4 className="text-3xl md:text-5xl font-black text-[#daa520] tracking-tighter uppercase leading-none">{a.title}</h4>
                      <span className="text-white/20 font-mono text-sm tracking-widest">{a.timestamp}</span>
                    </div>
                    <p className="text-white text-xl md:text-3xl font-bold italic leading-relaxed">"{a.desc}"</p>
                    <div className="pt-8 border-t-4 border-white/10 flex justify-between items-center gap-4">
                      <button className="bg-white text-black px-10 py-4 rounded-2xl font-black text-xl border-4 border-[#daa520] shadow-md">👑 찬양</button>
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
        <div className="fixed inset-0 bg-black/98 backdrop-blur-3xl z-[300] flex items-center justify-center p-6">
          <div className="bg-[#111] p-10 rounded-[50px] border-8 border-[#daa520] w-full max-w-2xl text-center shadow-2xl">
            <h3 className="text-[#daa520] font-black text-4xl mb-10 italic uppercase tracking-widest font-sans">New Fan Territory</h3>
            <input type="text" value={createTitle} onChange={(e) => setCreateTitle(e.target.value)} placeholder="팬방 명칭 입력" className="bg-black border-4 border-white p-6 rounded-2xl w-full text-3xl text-center font-black text-white mb-10 outline-none focus:border-[#daa520]" />
            <div className="flex gap-4">
              <button onClick={() => setShowCreateModal(false)} className="flex-1 py-5 rounded-2xl font-black text-xl bg-white/10 border-4 border-white uppercase">Cancel</button>
              <button onClick={() => { setShowCreateModal(false); setCreateTitle(''); alert("개설 완료!"); }} className="flex-1 py-5 rounded-2xl font-black text-xl bg-[#daa520] text-black border-4 border-white shadow-xl uppercase">Create</button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-20 opacity-40 text-center w-full pb-10 font-mono text-white text-[10px] tracking-[1em] uppercase">
        KEDHEON EMPIRE | NO-FILTER ENTRY V45.0 | ohsangjo
      </div>
    </div>
  );
}
