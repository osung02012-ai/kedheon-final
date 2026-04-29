'use client';
import React, { useState, useEffect } from 'react';

/** * [KEDHEON EMPIRE V62.0 FINAL MASTER]
 * 경제 지표: 1 Pi = 100 BEOM
 * 텍스트 규격: 
 * - Large: text-4xl (섹션 대제목, 핵심 지표)
 * - Medium: text-xl (단계 타이틀, 버튼 텍스트, 입력창)
 * - Small: text-sm (상세 가이드, 보조 설명, 푸터)
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
  WRITE_REVIEW: 5,
  ACTIVATE_QR: 50
};

// --- [인터페이스 정의] ---
interface Review { id: number; user: string; text: string; timestamp: string; }
interface Asset { id: number; title: string; desc: string; category: string; beomSupport: number; timestamp: string; url?: string; }
interface Good { id: number; name: string; price: number; img: string; seller: string; desc: string; reviews: Review[]; }

export default function KedheonPortal() {
  const [hasMounted, setHasMounted] = useState(false);
  const [tab, setTab] = useState<'ROOKIE' | 'PIONEER'>('ROOKIE');
  const [beomToken, setBeomToken] = useState(7991.88); 
  
  // 상태 관리
  const [qrType, setQrType] = useState<'PERSONAL' | 'BUSINESS'>('PERSONAL');
  const [bizName, setBizName] = useState('');
  const [isQrActive, setIsQrActive] = useState(false);
  const [assets, setAssets] = useState<Asset[]>([]); 
  const [goods, setGoods] = useState<Good[]>([
    { id: 1, name: "EMPIRE GOLD BADGE", price: 1000, img: "/beom-token.png", seller: "Imperial", desc: "제국 공인 고유 황금 뱃지", reviews: [] }
  ]);

  // 입력 필드 상태
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [showFanRoomModal, setShowFanRoomModal] = useState(false);
  const [fanRoomName, setFanRoomName] = useState('');

  // 데이터 영속성
  useEffect(() => {
    setHasMounted(true);
    const saved = localStorage.getItem('kedheon_master_v62');
    if (saved) {
      const p = JSON.parse(saved);
      if (p.token) setBeomToken(p.token);
      if (p.assets) setAssets(p.assets);
    }
  }, []);

  useEffect(() => {
    if (hasMounted) {
      localStorage.setItem('kedheon_master_v62', JSON.stringify({ token: beomToken, assets }));
    }
  }, [beomToken, assets, hasMounted]);

  // 로직 핸들러
  const handleExchange = () => setBeomToken(p => p + PI_TO_BEOM_RATIO);
  const handlePost = () => {
    if(!newTitle) return alert("제목 필수");
    if(beomToken < COSTS_BEOM.POST_CREATION) return alert("자산 부족");
    const post: Asset = { id: Date.now(), title: newTitle, desc: newDesc, category: 'TECH', beomSupport: 0, timestamp: '2026.04.29', url: newUrl };
    setAssets([post, ...assets]);
    setBeomToken(p => p - COSTS_BEOM.POST_CREATION);
    setNewTitle(''); setNewDesc(''); setNewUrl('');
  };
  const handleSupport = (id: number) => {
    if(beomToken < COSTS_BEOM.SUPPORT) return alert("자산 부족");
    setAssets(assets.map(a => a.id === id ? { ...a, beomSupport: a.beomSupport + COSTS_BEOM.SUPPORT } : a));
    setBeomToken(p => p - COSTS_BEOM.SUPPORT);
  };

  if (!hasMounted) return null;

  return (
    <div className="flex flex-col items-center bg-black min-h-screen text-white font-sans w-full pb-40 font-black">
      
      {/* GNB */}
      <div className="w-full max-w-4xl flex justify-between items-center p-5 sticky top-0 bg-black/95 backdrop-blur-md z-[150] border-b-2 border-[#daa520]">
        <h2 className="text-[#daa520] text-xl italic tracking-tighter">KEDHEON EMPIRE</h2>
        <div className="flex gap-2">
          <button onClick={() => setTab('ROOKIE')} className={`px-6 py-2 rounded-md text-sm border ${tab === 'ROOKIE' ? 'bg-[#daa520] text-black' : 'border-white/20'}`}>ROOKIE</button>
          <button onClick={() => setTab('PIONEER')} className={`px-6 py-2 rounded-md text-sm border ${tab === 'PIONEER' ? 'bg-[#daa520] text-black' : 'border-white/20'}`}>PIONEER</button>
        </div>
      </div>

      <div className="w-full max-w-4xl px-4 py-10">
        {tab === 'ROOKIE' ? (
          /* --- [ROOKIE: 8단계 가입 절차] --- */
          <div className="flex flex-col gap-10 animate-in fade-in">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl text-[#daa520] italic uppercase mb-4">Onboarding</h1>
              <p className="text-xl uppercase border-b border-[#daa520]/30 pb-4">제국 시민권 획득 8단계 표준 절차</p>
            </div>

            <div className="grid gap-4 text-left">
              {[
                { s: "Step 01", t: "Download", d: "앱스토어/플레이스토어에서 [Pi Network] 검색 후 설치하십시오." },
                { s: "Step 02", t: "Phone Auth", d: "[Continue with phone number]를 선택하여 가입을 시작하십시오." },
                { s: "Step 03", t: "Region", d: "국가를 [South Korea (+82)]로 설정하고 전화번호를 입력하십시오." },
                { s: "Step 04", t: "Security", d: "비밀번호를 설정하십시오. (영문 대문자, 소문자, 숫자 조합 필수)" },
                { s: "Step 05", t: "Name", d: "이름은 여권 영문 실명을 권장하며, 사용할 ID를 입력하십시오." },
                { s: "Step 06", t: "Protocol", d: `초대 코드 [ ${PI_INVITE_CODE} ]를 입력하여 제국 시민권을 활성화하십시오.` },
                { s: "Step 07", t: "Vault", d: "지갑 생성 시 나오는 24개 비밀구절은 절대 분실하지 않도록 수기로 기록하십시오." },
                { s: "Step 08", t: "Action", d: "메인 화면의 번개 버튼을 눌러 채굴을 활성화하십시오." }
              ].map((step, i) => (
                <div key={i} className={`p-6 bg-[#111] rounded-3xl border-2 transition-all ${i >= 5 ? 'border-[#daa520]' : 'border-white/5'}`}>
                  <p className="text-[#daa520] text-sm uppercase tracking-widest">{step.s}</p>
                  <h3 className="text-xl uppercase italic mb-2">{step.t}</h3>
                  <p className="text-white/60 text-sm leading-relaxed font-sans">{step.d}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <button onClick={() => window.open(PI_APP_STORE_URL)} className="flex-1 bg-white text-black py-5 rounded-2xl text-xl uppercase border-2 border-[#daa520]">App Store</button>
              <button onClick={() => window.open(PI_PLAY_STORE_URL)} className="flex-1 bg-white text-black py-5 rounded-2xl text-xl uppercase border-2 border-[#daa520]">Play Store</button>
            </div>
          </div>
        ) : (
          /* --- [PIONEER: 핵심 기능 통합] --- */
          <div className="flex flex-col gap-12 animate-in slide-in-from-bottom-5">
            
            {/* 자산 대시보드 (Large Text) */}
            <div className="bg-[#111] p-10 rounded-[50px] border-4 border-[#daa520] shadow-2xl relative overflow-hidden">
              <p className="text-white/30 text-sm uppercase tracking-[0.3em] mb-4">Imperial Total Assets</p>
              <h2 className="text-[#daa520] text-4xl md:text-6xl tracking-tighter leading-none mb-6">
                {Math.floor(beomToken).toLocaleString()}
                <span className="text-xl opacity-50">.{beomToken.toFixed(2).split('.')[1]}</span> 
                <span className="ml-4 text-2xl">BEOM</span>
              </h2>
              <div className="bg-black/50 px-6 py-2 rounded-xl border border-white/10 inline-block text-xl font-mono text-white/70 italic font-sans">
                ≈ {(beomToken / PI_TO_BEOM_RATIO).toFixed(4)} Pi
              </div>
            </div>

            {/* 01. 환전 (Medium Text) */}
            <div className="text-left">
              <h2 className="text-[#daa520] text-4xl uppercase italic border-l-4 border-[#daa520] pl-4 mb-6">01. Exchange</h2>
              <div className="bg-[#111] p-8 rounded-[40px] border-2 border-white/10 flex justify-between items-center gap-6">
                <p className="text-white text-xl uppercase font-sans">1 Pi = {PI_TO_BEOM_RATIO} BEOM</p>
                <button onClick={handleExchange} className="bg-[#daa520] text-black px-10 py-5 rounded-2xl text-xl border-4 border-white active:scale-95 uppercase">Exchange 1 Pi</button>
              </div>
            </div>

            {/* 02. 보안 인증 (기업명 박스 포함) */}
            <div className="text-left">
              <h2 className="text-[#daa520] text-4xl uppercase italic border-l-4 border-[#daa520] pl-4 mb-6">02. Secure Auth</h2>
              <div className="bg-[#111] p-8 rounded-[40px] border-2 border-white/10 flex flex-col items-center gap-6">
                <div className="flex gap-3 w-full max-w-sm bg-black p-2 rounded-2xl border border-white/10">
                  <button onClick={() => { setQrType('PERSONAL'); setIsQrActive(false); }} className={`flex-1 py-4 rounded-xl text-sm ${qrType === 'PERSONAL' ? 'bg-[#daa520] text-black' : 'text-white/20'}`}>PERSONAL</button>
                  <button onClick={() => { setQrType('BUSINESS'); setIsQrActive(false); }} className={`flex-1 py-4 rounded-xl text-sm ${qrType === 'BUSINESS' ? 'bg-[#daa520] text-black' : 'text-white/20'}`}>BUSINESS</button>
                </div>

                {qrType === 'BUSINESS' && (
                  <input 
                    type="text" value={bizName} onChange={(e) => setBizName(e.target.value.toUpperCase())} 
                    placeholder="ENTER BUSINESS NAME"
                    className="w-full max-w-sm bg-black border-2 border-[#daa520] p-5 rounded-xl text-center text-[#daa520] text-xl outline-none font-black font-sans"
                  />
                )}

                <div className={`p-4 bg-black border-2 rounded-[40px] transition-all flex items-center justify-center w-64 h-64 ${isQrActive ? 'border-[#daa520] shadow-[0_0_40px_rgba(218,165,32,0.3)]' : 'opacity-10'}`}>
                  {isQrActive ? <div className="text-[#daa520] text-sm animate-pulse">QR ACTIVATED</div> : <p className="text-white/10 text-xl italic uppercase">Locked</p>}
                </div>
                
                <button onClick={() => { if(qrType==='BUSINESS' && !bizName) return alert("기업명 필수"); setIsQrActive(true); setBeomToken(p => p - COSTS_BEOM.ACTIVATE_QR); }} className="w-full max-w-sm bg-[#daa520] text-black py-5 rounded-2xl text-xl border-4 border-white active:scale-95 uppercase shadow-xl font-sans">인증 활성화 ({COSTS_BEOM.ACTIVATE_QR} BEOM)</button>
              </div>
            </div>

            {/* 03. 팬심 & 창작 (영상 시청 버튼 포함) */}
            <div className="text-left">
              <h2 className="text-[#daa520] text-4xl uppercase italic border-l-4 border-[#daa520] pl-4 mb-6">03. Creative</h2>
              <div className="bg-[#111] p-8 rounded-[40px] border-2 border-[#daa520]/30 space-y-4 mb-8">
                <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="제목 및 핵심 카테고리" className="w-full bg-black border border-white/10 p-5 rounded-xl text-xl text-white outline-none focus:border-[#daa520] font-sans" />
                <input value={newUrl} onChange={(e) => setNewUrl(e.target.value)} placeholder="영상/이미지 링크 (선택사항)" className="w-full bg-black border border-white/10 p-5 rounded-xl text-sm text-[#daa520] outline-none font-sans" />
                <textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="창작 의도를 기록하십시오" className="w-full bg-black border border-white/10 p-5 rounded-xl text-sm text-white/70 h-32 outline-none focus:border-[#daa520] font-sans" />
                <div className="flex gap-4">
                  <button onClick={handlePost} className="flex-[2] bg-[#daa520] text-black py-5 rounded-2xl text-xl border-2 border-white uppercase shadow-xl">피드 등록 ({COSTS_BEOM.POST_CREATION})</button>
                  <button onClick={() => setShowFanRoomModal(true)} className="flex-1 bg-white text-black py-5 rounded-2xl text-sm border-2 border-[#daa520] uppercase leading-tight font-sans">🚩 팬방 개설<br/>({COSTS_BEOM.CREATE_FAN_ROOM})</button>
                </div>
              </div>

              {/* 피드 리스트 */}
              <div className="space-y-6">
                {assets.map(a => (
                  <div key={a.id} className="bg-[#111] p-8 rounded-[40px] border-2 border-white/5 relative shadow-xl">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-[#daa520] text-xl uppercase italic">{a.title}</h4>
                      <span className="text-white/20 text-sm font-mono">{a.timestamp}</span>
                    </div>
                    {a.url && (
                      <div className="mb-4 p-4 bg-black rounded-xl flex justify-between items-center border border-[#daa520]/20">
                        <p className="text-xs text-[#daa520] truncate opacity-50 pr-4 italic font-sans">{a.url}</p>
                        <button onClick={() => window.open(a.url, '_blank')} className="bg-[#daa520] text-black px-4 py-2 rounded-lg text-sm font-black uppercase whitespace-nowrap">Watch Video 📺</button>
                      </div>
                    )}
                    <p className="text-white/80 text-sm leading-relaxed mb-6 font-sans">"{a.desc}"</p>
                    <div className="flex justify-between items-center border-t border-white/5 pt-6">
                      <button onClick={() => handleSupport(a.id)} className="bg-[#daa520] text-black px-8 py-3 rounded-xl text-sm border-2 border-white uppercase">Praise ({COSTS_BEOM.SUPPORT})</button>
                      <p className="text-[#daa520] text-4xl tracking-tighter">{a.beomSupport} <span className="text-sm">BEOM</span></p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 04. 제국 시장 */}
            <div className="text-left">
              <h2 className="text-[#daa520] text-4xl uppercase italic border-l-4 border-[#daa520] pl-4 mb-6">04. Market</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {goods.map(g => (
                  <div key={g.id} className="bg-[#111] p-6 rounded-[40px] border-2 border-white/10 shadow-2xl relative">
                    <img src={g.img} className="w-full h-48 object-contain bg-black rounded-3xl mb-4 border border-white/5" alt="G" />
                    <h4 className="text-white text-xl uppercase mb-2">{g.name}</h4>
                    <p className="text-[#daa520] text-4xl mb-4">{g.price} <span className="text-sm">BEOM</span></p>
                    <button className="w-full py-4 bg-white text-black rounded-2xl text-xl border-2 border-[#daa520] uppercase">Buy Now</button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>

      {/* 앱 스위처 (고정 하단) */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-black/95 border-2 border-[#daa520] p-2 rounded-3xl flex gap-4 z-[200] shadow-[0_0_60px_rgba(218,165,32,0.5)] backdrop-blur-2xl">
        {['KEDHEON', 'CIVIL', 'NEXUS', 'VENDOR'].map(app => (
          <button key={app} className={`px-6 py-3 rounded-2xl text-sm transition-all ${app === 'KEDHEON' ? 'bg-[#daa520] text-black font-black scale-105' : 'text-white/40 hover:text-white'}`}>{app}</button>
        ))}
      </div>

      {/* 모달: 팬방 개설 */}
      {showFanRoomModal && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[300] flex items-center justify-center p-4 animate-in zoom-in-95 font-sans">
          <div className="bg-[#111] p-10 rounded-[40px] border-4 border-[#daa520] w-full max-w-md text-center shadow-2xl">
            <h3 className="text-[#daa520] text-4xl mb-6 italic uppercase">New Fan Hideout</h3>
            <input value={fanRoomName} onChange={(e) => setFanRoomName(e.target.value)} placeholder="아지트 명칭" className="bg-black border-2 border-white p-5 rounded-2xl w-full text-xl text-white mb-6 outline-none text-center" />
            <div className="flex gap-4">
              <button onClick={() => setShowFanRoomModal(false)} className="flex-1 py-4 bg-white/10 text-white rounded-xl text-sm">CANCEL</button>
              <button onClick={() => { if(!fanRoomName) return; setBeomToken(p => p - COSTS_BEOM.CREATE_FAN_ROOM); setShowFanRoomModal(false); setFanRoomName(''); alert("개설 완료"); }} className="flex-1 py-4 bg-[#daa520] text-black rounded-xl text-sm border-2 border-white uppercase">CREATE ({COSTS_BEOM.CREATE_FAN_ROOM})</button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-20 opacity-20 text-sm tracking-[1.2em] uppercase pb-10 font-sans">KEDHEON EMPIRE | V62.0 MASTER | ohsangjo</div>
    </div>
  );
}
