'use client';
import React, { useState, useEffect } from 'react';

/** * [KEDHEON EMPIRE V64.0 FINAL MASTER]
 * -----------------------------------------------------------
 * 텍스트 규격 (3-Tier Standard):
 * 1. LARGE  : text-4xl (섹션 대제목, 자산 지표, 대문 타이틀)
 * 2. MEDIUM : text-xl  (단계 제목, 버튼 텍스트, 입력창 라벨)
 * 3. SMALL  : text-sm  (상세 가이드, 설명 문구, 푸터 데이터)
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
interface Asset { id: number; title: string; desc: string; category: string; type: 'CREATION' | 'POST'; beomSupport: number; timestamp: string; url?: string; }
interface Good { id: number; name: string; price: number; img: string; seller: string; desc: string; reviews: Review[]; }

export default function KedheonPortal() {
  const [hasMounted, setHasMounted] = useState(false);
  const [tab, setTab] = useState<'ROOKIE' | 'PIONEER'>('ROOKIE');
  const [beomToken, setBeomToken] = useState(7991.88); 
  
  // 보안 및 비즈니스 상태 🛡️
  const [qrType, setQrType] = useState<'PERSONAL' | 'BUSINESS'>('PERSONAL');
  const [bizName, setBizName] = useState('');
  const [isQrActive, setIsQrActive] = useState(false);
  
  // 창작 및 게시판 상태 🎨
  const [postCategory, setPostCategory] = useState('TECH');
  const [postType, setPostType] = useState<'CREATION' | 'POST'>('POST');
  const [assets, setAssets] = useState<Asset[]>([]); 
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newUrl, setNewUrl] = useState('');

  const [goods] = useState<Good[]>([
    { id: 1, name: "EMPIRE GOLD BADGE", price: 1000, img: "/beom-token.png", seller: "Imperial", desc: "제국 공인 고유 황금 뱃지", reviews: [{ id: 1, user: "Citizen_K", text: "실물이 훨씬 웅장합니다.", timestamp: "2026.04.29" }] }
  ]);

  const cats = ['MUSIC', 'SPORTS', 'ANIME', 'DRAMA', 'MOVIE', 'TECH', 'FOOD', 'TRAVEL', 'BEAUTY', 'FASHION'];

  useEffect(() => {
    setHasMounted(true);
    const saved = localStorage.getItem('kedheon_v64_master');
    if (saved) {
      try {
        const p = JSON.parse(saved);
        if (p.token) setBeomToken(p.token);
        if (p.assets) setAssets(p.assets);
      } catch (e) { console.error("Restore Error", e); }
    }
  }, []);

  useEffect(() => {
    if (hasMounted) {
      localStorage.setItem('kedheon_v64_master', JSON.stringify({ token: beomToken, assets }));
    }
  }, [beomToken, assets, hasMounted]);

  // 로직 핸들러
  const handleExchange = () => setBeomToken(p => p + PI_TO_BEOM_RATIO);
  const handleSupport = (id: number) => {
    if (beomToken < COSTS_BEOM.SUPPORT) return alert("자산이 부족합니다.");
    setBeomToken(p => p - COSTS_BEOM.SUPPORT);
    setAssets(assets.map(a => a.id === id ? { ...a, beomSupport: a.beomSupport + COSTS_BEOM.SUPPORT } : a));
  };
  const handlePost = () => {
    if(!newTitle.trim()) return alert("제목을 입력하십시오.");
    if(beomToken < COSTS_BEOM.POST_CREATION) return alert("자산 부족");
    const post: Asset = { id: Date.now(), title: newTitle, desc: newDesc, category: postCategory, type: postType, beomSupport: 0, timestamp: new Date().toLocaleDateString(), url: newUrl };
    setAssets([post, ...assets]);
    setBeomToken(p => p - COSTS_BEOM.POST_CREATION);
    setNewTitle(''); setNewDesc(''); setNewUrl('');
    alert("피드에 등록되었습니다.");
  };

  const SectionHeader = ({ num, title, desc }: { num: string; title: string; desc: string }) => (
    <div className="w-full border-t border-white/10 pt-10 mb-8 text-left">
      <h2 className="text-[#daa520] text-4xl uppercase italic mb-3 font-black tracking-tighter leading-none">
        {num}. 🌐 {title}
      </h2>
      <p className="text-white/40 text-sm italic font-bold pl-1 font-sans">{desc}</p>
    </div>
  );

  if (!hasMounted) return null;

  return (
    <div className="flex flex-col items-center bg-black min-h-screen text-white font-sans w-full pb-40 font-black overflow-x-hidden">
      
      {/* --- [GNB: 버전 정보 및 로고] --- */}
      <div className="w-full max-w-4xl flex justify-between items-center p-5 sticky top-0 bg-black/95 backdrop-blur-md z-[150] border-b-2 border-[#daa520]">
        <div className="flex items-center gap-3">
          <img src="/kedheon-character.png" className="w-10 h-10 rounded-xl border-2 border-[#daa520]" alt="K" />
          <div className="text-left">
            <h2 className="text-[#daa520] text-xl italic leading-none">KEDHEON EMPIRE</h2>
            <span className="text-white/30 text-[10px] font-mono tracking-widest uppercase font-black">v64.0 Final Master</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setTab('ROOKIE')} className={`px-5 py-2 rounded-md text-sm border transition-all ${tab === 'ROOKIE' ? 'bg-[#daa520] text-black border-[#daa520]' : 'border-white/10'}`}>ROOKIE</button>
          <button onClick={() => setTab('PIONEER')} className={`px-5 py-2 rounded-md text-sm border transition-all ${tab === 'PIONEER' ? 'bg-[#daa520] text-black border-[#daa520]' : 'border-white/10'}`}>PIONEER</button>
        </div>
      </div>

      <div className="w-full max-w-4xl px-4 py-10">
        {tab === 'ROOKIE' ? (
          /* --- [ROOKIE: 대문 및 웹3 초대 가이드] --- */
          <div className="flex flex-col gap-12 animate-in fade-in text-left">
            <div className="flex flex-col items-center text-center gap-8 py-12 bg-[#111] rounded-[60px] border-4 border-[#daa520] shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 opacity-5 bg-[url('/kedheon-character.png')] bg-center bg-no-repeat bg-contain scale-150"></div>
              <img src="/kedheon-character.png" className="w-48 h-48 rounded-[40px] border-4 border-white shadow-2xl relative z-10" alt="Main" />
              <div className="relative z-10 px-6">
                <h1 className="text-[#daa520] text-4xl md:text-6xl italic uppercase mb-4 tracking-tighter">Web3 Invitation</h1>
                <p className="text-white text-xl uppercase tracking-widest border-b border-white/20 pb-4 inline-block">케데헌 제국 입국 및 시민권 획득 안내</p>
                <p className="text-white/40 text-sm mt-6 font-sans max-w-lg mx-auto leading-relaxed font-bold italic">파이 네트워크의 가치를 제국에서 실현하십시오. 아래 8단계 절차를 통해 정식 시민권을 획득할 수 있습니다.</p>
              </div>
            </div>

            <div className="grid gap-6">
              {[
                { s: "Step 01", t: "App Installation", d: "스토어에서 [Pi Network] 공식 앱을 설치하십시오." },
                { s: "Step 02", t: "Sign Up Method", d: "[Continue with phone number]로 보안 가입을 진행하십시오." },
                { s: "Step 03", t: "Region Selection", d: "국가 코드를 [South Korea (+82)]로 설정하고 번호를 입력하십시오." },
                { s: "Step 04", t: "Account Security", d: "비밀번호를 설정하십시오. (영문 대/소문자 및 숫자 조합 필수)" },
                { s: "Step 05", t: "Identity Profile", d: "여권 영문 실명을 입력하고 사용할 고유 ID를 설정하십시오." },
                { s: "Step 06", t: "Web3 Invitation Code", d: `초대 코드 [ ${PI_INVITE_CODE} ]를 입력하여 제국 입장을 승인받으십시오.`, gold: true },
                { s: "Step 07", t: "Secret Passphrase", d: "지갑 생성 시 주어지는 24개 단어를 반드시 수기로 기록하여 보관하십시오.", danger: true },
                { s: "Step 08", t: "Mining Activation", d: "번개 버튼을 눌러 채굴을 시작하고 시민권을 정식 활성화하십시오.", gold: true }
              ].map((step, idx) => (
                <div key={idx} className={`p-6 bg-[#111] rounded-[30px] border-2 shadow-xl ${step.gold ? 'border-[#daa520]' : step.danger ? 'border-red-600' : 'border-white/5'}`}>
                  <p className="text-[#daa520] text-sm uppercase mb-1 tracking-widest">{step.s}</p>
                  <h3 className="text-white text-xl uppercase italic mb-2">{step.t}</h3>
                  <p className="text-white/40 text-sm leading-relaxed font-sans font-bold">{step.d}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-4 font-sans">
              <button onClick={() => window.open(PI_APP_STORE_URL)} className="flex-1 bg-white text-black py-6 rounded-2xl text-xl font-black uppercase shadow-lg border-4 border-[#daa520] active:scale-95 transition-all">App Store</button>
              <button onClick={() => window.open(PI_PLAY_STORE_URL)} className="flex-1 bg-white text-black py-6 rounded-2xl text-xl font-black uppercase shadow-lg border-4 border-[#daa520] active:scale-95 transition-all">Play Store</button>
            </div>
          </div>
        ) : (
          /* --- [PIONEER: 경제 및 게시판 복구] --- */
          <div className="flex flex-col gap-10 py-8 animate-in slide-in-from-bottom-5">
            
            {/* 자산 대시보드 (LARGE) */}
            <div className="bg-[#111] p-10 rounded-[60px] border-4 border-[#daa520] shadow-2xl flex flex-col md:flex-row justify-between items-center gap-10">
                <div className="text-center md:text-left flex-1">
                  <h3 className="text-white/30 text-sm uppercase tracking-[0.4em] mb-4">Imperial Total Assets</h3>
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
                  <img src="/kedheon-character.png" className="w-20 h-20 md:w-32 md:h-32 rounded-[30px] border-2 border-white/10" alt="K" />
                  <img src="/beom-token.png" className="w-16 h-16 md:w-28 md:h-28 object-contain animate-pulse" alt="B" />
                </div>
            </div>

            {/* 범토큰 환전소 복구 (MEDIUM) */}
            <div className="bg-[#111] p-10 rounded-[40px] border-2 border-[#daa520]/30 flex flex-col md:flex-row justify-between items-center gap-6 shadow-2xl">
              <div className="text-left"><h3 className="text-white text-xl uppercase italic mb-1">BEOM Token Exchange</h3><p className="text-[#daa520] text-sm font-bold">환전 비율: 1 Pi = {PI_TO_BEOM_RATIO} BEOM</p></div>
              <button onClick={handleExchange} className="w-full md:w-auto bg-[#daa520] text-black px-12 py-5 rounded-2xl text-xl border-4 border-white active:scale-95 uppercase font-black font-sans">Convert 1 Pi</button>
            </div>

            {/* 01. 보안 인증 (QR 복구 및 설명글) */}
            <SectionHeader num="01" title="SECURE AUTH" desc="제국 시민의 신분을 증명하고 보안 익명 결제를 활성화하십시오." />
            <div className="bg-[#111] p-10 rounded-[40px] border-2 border-white/10 flex flex-col items-center gap-8 shadow-xl">
              <div className="flex gap-4 w-full max-w-sm bg-black p-2 rounded-2xl border border-white/10 font-black">
                <button onClick={() => { setQrType('PERSONAL'); setIsQrActive(false); }} className={`flex-1 py-4 rounded-xl text-sm transition-all ${qrType === 'PERSONAL' ? 'bg-[#daa520] text-black border border-white' : 'text-white/20'}`}>PERSONAL</button>
                <button onClick={() => { setQrType('BUSINESS'); setIsQrActive(false); }} className={`flex-1 py-4 rounded-xl text-sm transition-all ${qrType === 'BUSINESS' ? 'bg-[#daa520] text-black border border-white' : 'text-white/20'}`}>BUSINESS</button>
              </div>
              
              {qrType === 'BUSINESS' && (
                <div className="w-full max-w-sm animate-in fade-in">
                  <p className="text-[#daa520] text-sm uppercase mb-2 ml-2 tracking-widest font-black">Enterprise Name</p>
                  <input type="text" value={bizName} onChange={(e) => setBizName(e.target.value.toUpperCase())} placeholder="ENTER BUSINESS NAME" className="w-full bg-black border-2 border-[#daa520] p-5 rounded-2xl text-center text-[#daa520] text-xl outline-none font-black font-sans" />
                </div>
              )}

              <div className={`p-6 bg-black border-4 rounded-[60px] transition-all flex flex-col items-center justify-center w-72 h-72 ${isQrActive ? 'border-[#daa520] shadow-[0_0_50px_rgba(218,165,32,0.3)]' : 'opacity-10 border-white'}`}>
                {isQrActive ? (
                  <>
                    <img src={qrType === 'PERSONAL' ? "/qr-personal.png" : "/qr-business.png"} className="w-48 h-48 rounded-xl mb-2" alt="QR" />
                    <span className="text-[#daa520] text-[10px] uppercase font-black tracking-tighter">Verified Identity</span>
                  </>
                ) : (
                  <p className="text-white/5 text-xl italic uppercase font-black">Locked</p>
                )}
              </div>
              <button onClick={() => { if(qrType==='BUSINESS' && !bizName) return alert("기업명을 입력하십시오."); setIsQrActive(true); setBeomToken(p => p - COSTS_BEOM.ACTIVATE_QR); }} className="w-full max-w-sm bg-[#daa520] text-black py-6 rounded-2xl text-xl border-4 border-white active:scale-95 uppercase font-black shadow-xl">인증 활성화 ({COSTS_BEOM.ACTIVATE_QR} BEOM)</button>
            </div>

            {/* 02. 창작 게시판 (카테고리 및 호응 버튼 복구) */}
            <SectionHeader num="02" title="CREATIVE BOARD" desc="영상과 창작물을 공유하여 팬심을 증명하고 보상을 획득하십시오." />
            <div className="bg-[#111] p-8 rounded-[40px] border-2 border-[#daa520]/30 space-y-4 mb-10 text-left shadow-2xl">
              <div className="flex gap-2 p-1 bg-black rounded-xl border border-white/10 font-black">
                <button onClick={() => setPostType('POST')} className={`flex-1 py-3 rounded-lg text-sm transition-all ${postType === 'POST' ? 'bg-[#daa520] text-black' : 'text-white/30'}`}>일반 게시물</button>
                <button onClick={() => setPostType('CREATION')} className={`flex-1 py-3 rounded-lg text-sm transition-all ${postType === 'CREATION' ? 'bg-[#daa520] text-black' : 'text-white/30'}`}>개인 창작물</button>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {cats.map(cat => (
                  <button key={cat} onClick={() => setPostCategory(cat)} className={`px-4 py-2 rounded-full text-xs font-black whitespace-nowrap border transition-all ${postCategory === cat ? 'bg-white text-black border-white' : 'border-white/20 text-white/50'}`}>{cat}</button>
                ))}
              </div>
              <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="제목을 입력하십시오 (MEDIUM TEXT)" className="w-full bg-black border border-white/10 p-5 rounded-xl text-xl text-white outline-none focus:border-[#daa520] font-sans font-black" />
              <input value={newUrl} onChange={(e) => setNewUrl(e.target.value)} placeholder="영상 또는 이미지 URL 링크 (SMALL TEXT)" className="w-full bg-black border border-white/10 p-5 rounded-xl text-sm text-[#daa520] outline-none font-sans font-bold" />
              <textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="창작 의도 및 상세 내용을 기록하십시오" className="w-full bg-black border border-white/10 p-5 rounded-xl text-sm text-white/70 h-32 outline-none font-sans font-bold" />
              <div className="flex gap-4">
                <button onClick={handlePost} className="flex-[2] bg-[#daa520] text-black py-6 rounded-2xl text-xl border-2 border-white uppercase shadow-xl font-black active:scale-95">피드 등록 ({COSTS_BEOM.POST_CREATION})</button>
                <button className="flex-1 bg-white text-black py-6 rounded-2xl text-sm border-2 border-[#daa520] uppercase font-black font-sans leading-tight active:scale-95 shadow-xl">🚩 팬방 개설<br/>({COSTS_BEOM.CREATE_FAN_ROOM})</button>
              </div>
            </div>

            {/* 사용자 게시글 피드 (호응 로직 포함) */}
            <div className="space-y-8 text-left">
              {assets.map(a => (
                <div key={a.id} className="bg-[#111] p-10 rounded-[50px] border-2 border-white/5 shadow-2xl relative transition-all hover:border-[#daa520]/30">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex flex-col gap-2">
                      <span className="text-[10px] text-[#daa520] font-black uppercase tracking-widest bg-[#daa520]/10 px-3 py-1 rounded-full w-fit">[{a.type}] {a.category}</span>
                      <h4 className="text-white text-2xl uppercase italic underline underline-offset-8 decoration-white/10">{a.title}</h4>
                    </div>
                    <span className="text-white/20 text-sm font-mono">{a.timestamp}</span>
                  </div>
                  {a.url && (
                    <div className="mb-6 p-5 bg-black rounded-2xl flex justify-between items-center border border-[#daa520]/20 font-sans font-bold">
                      <p className="text-xs text-[#daa520] truncate opacity-50 pr-6 italic">{a.url}</p>
                      <button onClick={() => window.open(a.url, '_blank')} className="bg-[#daa520] text-black px-6 py-2 rounded-xl text-sm font-black uppercase whitespace-nowrap active:scale-95 shadow-lg">Watch Video 📺</button>
                    </div>
                  )}
                  <p className="text-white/80 text-xl italic leading-relaxed mb-8 font-sans font-bold">"{a.desc}"</p>
                  <div className="flex justify-between items-center border-t border-white/5 pt-8">
                    <button onClick={() => handleSupport(a.id)} className="bg-[#daa520] text-black px-10 py-4 rounded-xl text-sm border-2 border-white uppercase font-black active:scale-95 shadow-lg">👑 Praise ({COSTS_BEOM.SUPPORT})</button>
                    <p className="text-[#daa520] text-4xl tracking-tighter font-black">{a.beomSupport.toLocaleString()} <span className="text-sm">BEOM</span></p>
                  </div>
                </div>
              ))}
            </div>

            {/* 03. 제국 시장 및 후기 게시판 복구 */}
            <SectionHeader num="03" title="MERCHANT & REVIEWS" desc="제국의 희귀 굿즈를 거래하고 파이오니어들의 정직한 후기를 확인하십시오." />
            <div className="grid md:grid-cols-2 gap-10 text-left">
              <div className="space-y-6">
                <h3 className="text-white text-xl uppercase border-b border-white/10 pb-2 italic">Market Square</h3>
                {goods.map(g => (
                  <div key={g.id} className="bg-[#111] p-8 rounded-[50px] border-2 border-white/10 shadow-2xl text-center group">
                    <img src={g.img} className="w-full h-56 object-contain bg-black rounded-[40px] mb-6 shadow-inner transition-transform group-hover:scale-105" alt="G" />
                    <h4 className="text-white text-xl uppercase mb-2">{g.name}</h4>
                    <p className="text-[#daa520] text-4xl mb-6 font-black">{g.price.toLocaleString()} <span className="text-sm">BEOM</span></p>
                    <button className="w-full py-5 bg-white text-black rounded-3xl text-xl border-4 border-[#daa520] uppercase font-black active:scale-95 shadow-xl">Buy Now</button>
                  </div>
                ))}
              </div>
              <div className="space-y-6">
                <h3 className="text-white text-xl uppercase border-b border-white/10 pb-2 italic">Review Board</h3>
                {goods[0].reviews.map(r => (
                  <div key={r.id} className="bg-black/50 p-6 rounded-[30px] border border-white/5 shadow-inner transition-all hover:border-[#daa520]/20">
                    <p className="text-white/80 text-sm italic font-sans mb-3 font-bold">"{r.text}"</p>
                    <div className="flex justify-between items-center text-[10px] font-mono text-[#daa520] font-black uppercase tracking-widest">
                      <span>- {r.user}</span>
                      <span className="text-white/20">{r.timestamp}</span>
                    </div>
                  </div>
                ))}
                <button className="w-full py-5 border-2 border-dashed border-white/10 rounded-2xl text-sm text-white/30 uppercase font-black hover:border-[#daa520] hover:text-[#daa520] transition-all font-sans font-bold">Write Experience Review</button>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* --- [하단 통합 네비게이션] --- */}
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
              <button onClick={() => { if(!fanRoomName) return; setBeomToken(p => p - COSTS_BEOM.CREATE_FAN_ROOM); setShowFanRoomModal(false); setFanRoomName(''); alert("개설 신청 완료"); }} className="flex-1 py-5 bg-[#daa520] text-black rounded-2xl text-sm border-2 border-white uppercase font-black shadow-lg">Create ({COSTS_BEOM.CREATE_FAN_ROOM})</button>
            </div>
          </div>
        </div>
      )}

      {/* 푸터 */}
      <div className="mt-32 opacity-20 text-sm tracking-[1.5em] uppercase pb-20 font-sans font-black">
        KEDHEON EMPIRE | V64.0 FINAL MASTER | @OHSANGJO
      </div>
    </div>
  );
}
