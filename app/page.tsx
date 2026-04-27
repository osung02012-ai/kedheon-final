'use client';
import React, { useState, useEffect } from 'react';

// --- [제국 설정 데이터] ---
const PI_INVITE_CODE = 'ohsangjo'; 
const PI_APP_STORE_URL = 'https://apps.apple.com/app/pi-network/id1445472541';
const PI_PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.blockchainvault';

interface Asset { id: number; title: string; desc: string; category: string; type: 'CREATION' | 'BROADCAST'; beomSupport: number; isPromoted: boolean; timestamp: string; }
interface Good { id: number; name: string; price: number; img: string; seller: string; }

export default function KedheonPortal() {
  const [hasMounted, setHasMounted] = useState(false);
  const [lang, setLang] = useState<'KO' | 'EN'>('KO');
  const [tab, setTab] = useState<'ROOKIE' | 'PIONEER'>('PIONEER');
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  const [beomToken, setBeomToken] = useState(8141.88);
  const [qrType, setQrType] = useState<'PERSONAL' | 'BUSINESS'>('PERSONAL');
  const [bizName, setBizName] = useState('');
  const [isQrActive, setIsQrActive] = useState(false);
  const [category, setCategory] = useState('ALL');
  const [postType, setPostType] = useState<'CREATION' | 'BROADCAST'>('BROADCAST');
  
  const [assets, setAssets] = useState<Asset[]>([]); 
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');

  // 굿즈 관련 상태
  const [goods, setGoods] = useState<Good[]>([
    { id: 1, name: "EMPIRE GOLD BADGE", price: 1000, img: "/beom-token.png", seller: "OFFICIAL" },
    { id: 2, name: "KEDHEON CHARACTER T-SHIRT", price: 2500, img: "/kedheon-character.png", seller: "OFFICIAL" }
  ]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createTitle, setCreateTitle] = useState('');

  const cats = ['MUSIC', 'SPORTS', 'ANIME', 'DRAMA', 'MOVIE', 'ESPORTS', 'COMEDY', 'TRAVEL', 'FOOD', 'BEAUTY', 'FASHION', 'TECH'];

  const SectionHeader = ({ num, title }: { num: string; title: string }) => (
    <div className="w-full border-t-4 border-white pt-10 mb-8 text-left">
      <h3 className="text-[#daa520] font-black text-2xl md:text-4xl uppercase border-l-8 border-[#daa520] pl-4 leading-none italic tracking-tighter">
        {num}. 🌐 {title}
      </h3>
    </div>
  );

  useEffect(() => {
    setHasMounted(true);
    const saved = localStorage.getItem('kedheon_v56_final');
    if (saved) {
      try {
        const p = JSON.parse(saved);
        setBeomToken(p.token || 8141.88);
        if (Array.isArray(p.assets)) setAssets(p.assets);
      } catch (e) { console.error("Integrity check failed."); }
    }
  }, []);

  useEffect(() => {
    if (hasMounted) {
      localStorage.setItem('kedheon_v56_final', JSON.stringify({ token: beomToken, assets }));
    }
  }, [beomToken, assets, hasMounted]);

  const postContent = () => {
    if(!newTitle.trim()) return alert("제목을 입력하십시오.");
    setAssets([{ id: Date.now(), title: newTitle, desc: newDesc, category, type: postType, beomSupport: 0, isPromoted: false, timestamp: new Date().toLocaleDateString() }, ...assets]);
    setBeomToken(p => p - 10); setNewTitle(''); setNewDesc('');
    alert("제국 피드 등록 완료");
  };

  const buyGood = (price: number) => {
    if (beomToken < price) return alert("BEOM 토큰이 부족합니다.");
    setBeomToken(p => p - price);
    alert("굿즈 구매가 완료되었습니다. 보관함을 확인하세요.");
  };

  if (!hasMounted) return null;

  return (
    <div className="flex flex-col items-center bg-black min-h-screen text-white font-sans w-full pb-20 overflow-x-hidden text-center">
      
      {/* 1. 상단 글로벌 네비게이션 */}
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
          <div className="flex flex-col items-center py-16 animate-in fade-in duration-700">
            <img src="/kedheon-character.png" className="w-32 h-32 md:w-56 md:h-56 rounded-3xl mb-8 border-4 border-[#daa520] shadow-2xl" alt="K" />
            <h1 className="text-4xl md:text-6xl font-black text-[#daa520] italic uppercase mb-4 tracking-tighter leading-none">Kedheon Empire</h1>
            <p className="text-white font-black text-lg md:text-2xl mb-12 border-y-2 border-white/20 py-3 px-6">Kedheon Empire 웹3에 참여하세요</p>
            {!showOnboarding ? (
              <button onClick={() => setShowOnboarding(true)} className="bg-white text-black px-12 py-5 rounded-full font-black text-xl md:text-2xl border-4 border-[#daa520] hover:scale-105 shadow-2xl">시민권 획득 가이드</button>
            ) : (
              <div className="w-full bg-[#111] p-6 md:p-10 rounded-[40px] border-4 border-white shadow-2xl space-y-8">
                <h2 className="text-[#daa520] font-black text-2xl md:text-4xl uppercase italic">Pioneer Onboarding</h2>
                <div className="space-y-4 text-left font-bold text-white text-lg">
                  <p>1. Pi Network 앱 설치 후 추천인 코드 [ <span className="text-[#daa520] underline font-black">{PI_INVITE_CODE}</span> ] 입력</p>
                  <p>2. 채굴한 Pi를 범(BEOM) 토큰으로 환전하여 제국 입장</p>
                </div>
                <div className="flex gap-4"><button onClick={() => window.open(PI_APP_STORE_URL)} className="flex-1 bg-white text-black py-4 rounded-xl font-black border-4 border-[#daa520]">iOS</button><button onClick={() => window.open(PI_PLAY_STORE_URL)} className="flex-1 bg-white text-black py-4 rounded-xl font-black border-4 border-[#daa520]">Android</button></div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-16 py-10 animate-in slide-in-from-bottom-5">
            {/* 자산 대시보드 */}
            <div className="bg-[#111] p-8 rounded-[40px] border-4 border-[#daa520] shadow-2xl flex flex-col md:flex-row justify-between items-center gap-8">
               <div className="text-center md:text-left flex-1">
                  <h3 className="text-white/60 font-black text-sm uppercase tracking-widest mb-2 font-sans">Assets Balance</h3>
                  <p className="text-[#daa520] font-black text-5xl md:text-8xl tracking-tighter leading-none font-sans font-black">{beomToken.toLocaleString()} BEOM</p>
                  <div className="mt-4 bg-black px-6 py-2 rounded-xl border-2 border-white inline-block text-xl font-mono text-white italic">≈ 25.9164 Pi</div>
               </div>
               <div className="flex items-center gap-6"><img src="/kedheon-character.png" className="w-24 h-24 md:w-32 md:h-32 rounded-3xl border-4 border-white shadow-xl" alt="Char" /><img src="/beom-token.png" className="w-20 h-20 md:w-32 md:h-32" alt="Token" /></div>
            </div>

            {/* 슬로건 및 팬덤 선언 */}
            <div className="w-full bg-[#111] p-8 md:p-12 rounded-[50px] border-4 border-[#daa520] shadow-2xl">
              <h2 className="text-[#daa520] font-black text-3xl md:text-6xl uppercase italic tracking-tighter mb-6 font-sans">누리고 즐기고 선점하세요</h2>
              <div className="space-y-4 text-white/90 text-lg md:text-2xl font-bold leading-relaxed tracking-tight">
                <p>제국 시민은 익명 결제와 보안 인증을 마음껏 <span className="text-[#daa520]">누리고</span>,</p>
                <p>자신만의 창작물과 실시간 방송으로 생태계를 <span className="text-[#daa520]">즐기며</span>,</p>
                <p>강력한 <span className="text-[#daa520]">팬덤 결집</span>을 통해 공동체의 가치를 증폭시키고,</p>
                <p>한정된 자산과 기여 보상을 남보다 먼저 <span className="text-[#daa520]">선점</span>하여 주권을 확보합니다.</p>
              </div>
            </div>

            {/* 01. 범 환전 */}
            <div className="flex flex-col w-full">
              <SectionHeader num="01" title="ACQUIRE BEOM TOKEN" />
              <div className="bg-[#111] p-8 rounded-[40px] border-4 border-white shadow-2xl grid md:grid-cols-2 gap-8 items-center">
                <div className="text-left space-y-2"><p className="text-white text-xl md:text-3xl font-black uppercase italic">파이를 범으로 환전하십시오</p><p className="text-white/60 text-sm md:text-lg italic font-bold">1 Pi = 314.159 BEOM</p></div>
                <button onClick={() => setBeomToken(p => p + 314.15)} className="w-full bg-[#daa520] text-black py-6 rounded-2xl font-black text-xl md:text-2xl border-4 border-white shadow-xl hover:scale-105 transition-all">BUY BEOM WITH PI</button>
              </div>
            </div>

            {/* 02. 보안 인증 및 고유 QR */}
            <div className="flex flex-col w-full">
              <SectionHeader num="02" title="IMPERIAL SECURE AUTH" />
              <div className="bg-[#111] p-6 md:p-10 rounded-[40px] border-4 border-white flex flex-col items-center gap-8 shadow-2xl">
                <div className="flex gap-2 w-full max-w-md bg-black p-2 rounded-2xl border-4 border-[#daa520] font-black">
                  <button onClick={() => { setQrType('PERSONAL'); setIsQrActive(false); }} className={`flex-1 py-3 rounded-xl transition-all ${qrType === 'PERSONAL' ? 'bg-[#daa520] text-black' : 'text-white/30'}`}>PERSONAL</button>
                  <button onClick={() => { setQrType('BUSINESS'); setIsQrActive(false); }} className={`flex-1 py-3 rounded-xl transition-all ${qrType === 'BUSINESS' ? 'bg-[#daa520] text-black' : 'text-white/30'}`}>BUSINESS</button>
                </div>
                <div className={`p-8 bg-black border-4 rounded-[50px] shadow-[0_0_80px_rgba(218,165,32,0.4)] transition-all flex items-center justify-center ${isQrActive ? 'border-[#daa520]' : 'opacity-10 border-white'}`}>
                  {isQrActive ? (
                    <div className="p-4 border-2 border-white rounded-[40px]"><img src={qrType === 'PERSONAL' ? "/qr-personal.png" : "/qr-business.png"} className="w-64 h-64 md:w-96 md:h-96 rounded-3xl" alt="QR" /></div>
                  ) : ( <div className="w-64 h-64 md:w-96 md:h-96 flex items-center justify-center text-white/5 text-4xl md:text-8xl font-black italic uppercase">Secure</div> )}
                </div>
                <button onClick={() => { setIsQrActive(true); setBeomToken(p => p - 50); }} className="bg-[#daa520] text-black px-12 py-5 rounded-2xl font-black text-xl md:text-3xl border-4 border-white shadow-2xl active:scale-95 transition-all uppercase">인증 활성화 (50 BEOM)</button>
              </div>
            </div>

            {/* 03. 창작물 및 방송 허브 */}
            <div className="flex flex-col w-full text-left">
              <SectionHeader num="03" title="CREATIVE & BROADCAST HUB" />
              <div className="w-full bg-[#111] p-6 md:p-10 rounded-[40px] border-4 border-[#daa520] space-y-6 mb-12 shadow-xl">
                <div className="flex gap-4 mb-2"><button onClick={() => setPostType('BROADCAST')} className={`flex-1 py-4 rounded-xl font-black border-2 transition-all ${postType === 'BROADCAST' ? 'bg-[#daa520] text-black border-white shadow-lg' : 'bg-black text-white/40 border-white/20'}`}>게시용 방송</button><button onClick={() => setPostType('CREATION')} className={`flex-1 py-4 rounded-xl font-black border-2 transition-all ${postType === 'CREATION' ? 'bg-[#daa520] text-black border-white shadow-lg' : 'bg-black text-white/40 border-white/20'}`}>본인 창작물</button></div>
                <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder={`${postType === 'BROADCAST' ? '방송' : '창작물'} 제목`} className="bg-black border-4 border-white p-4 rounded-xl w-full text-lg md:text-2xl font-black text-white outline-none focus:border-[#daa520]" />
                <textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="제국 전역에 알릴 상세 내용" className="bg-black border-4 border-white p-4 rounded-xl w-full text-sm md:text-lg font-bold text-white/80 h-32 resize-none outline-none focus:border-[#daa520]" />
                <button onClick={postContent} className="w-full py-5 rounded-2xl bg-[#daa520] text-black font-black text-xl md:text-2xl border-4 border-white shadow-lg active:scale-95 transition-all uppercase">제국 피드 등록하기 (10 BEOM)</button>
              </div>
              <div className="grid grid-cols-4 md:grid-cols-6 gap-2 mb-8">{cats.map(cat => ( <button key={cat} onClick={() => setCategory(cat)} className={`py-4 rounded-xl font-black text-[10px] md:text-xs border-2 transition-all ${category === cat ? 'bg-[#daa520] text-black border-[#daa520]' : 'bg-black text-white/40 border-white/20'}`}>{cat}</button> ))}</div>
            </div>

            {/* 04. 🌐 팬덤 굿즈 마켓 (New Section) */}
            <div className="flex flex-col w-full text-left">
              <SectionHeader num="04" title="IMPERIAL FANDOM GOODS" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {goods.map(g => (
                  <div key={g.id} className="bg-[#111] rounded-[40px] border-4 border-white p-6 shadow-2xl flex flex-col items-center gap-4">
                    <img src={g.img} className="w-full h-48 object-contain bg-black rounded-3xl border-2 border-[#daa520]/20" alt="G" />
                    <div className="w-full text-left px-2">
                      <p className="text-[#daa520] font-black text-xs uppercase opacity-60">Seller: {g.seller}</p>
                      <h4 className="text-white font-black text-xl md:text-2xl uppercase tracking-tighter">{g.name}</h4>
                      <p className="text-[#daa520] font-black text-2xl md:text-3xl mt-2">{g.price.toLocaleString()} BEOM</p>
                    </div>
                    <button onClick={() => buyGood(g.price)} className="w-full py-4 rounded-2xl bg-white text-black font-black text-xl border-4 border-[#daa520] hover:bg-[#daa520] transition-all uppercase">BUY NOW</button>
                  </div>
                ))}
              </div>
              {/* 굿즈 판매 등록 버튼 */}
              <button onClick={() => alert("굿즈 등록 신청이 마스터에게 전달됩니다.")} className="w-full py-6 rounded-3xl bg-[#daa520] text-black font-black text-2xl border-4 border-white shadow-xl hover:scale-105 active:scale-95 transition-all uppercase italic">➕ 본인 굿즈 판매 등록 (100 BEOM)</button>
            </div>
            
            {/* 팬방/게시물 피드 리스트 */}
            <div className="w-full space-y-12">
               <button onClick={() => setShowCreateModal(true)} className="w-full py-6 rounded-3xl bg-white text-black font-black text-2xl border-4 border-[#daa520] shadow-xl hover:bg-[#daa520] transition-all uppercase italic">➕ 팬방 개설 (500 BEOM)</button>
               {assets.filter(a => category === 'ALL' || a.category === category).map(a => (
                <div key={a.id} className={`bg-[#111] rounded-[50px] border-4 p-8 md:p-12 space-y-8 shadow-2xl relative transition-all ${a.isPromoted ? 'border-[#daa520] ring-8 ring-[#daa520]/10' : 'border-white hover:border-[#daa520]'}`}>
                  <div className="flex justify-between items-start font-black">
                    <div className="space-y-3"><span className="bg-white text-black px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">{a.type}</span><h4 className="text-3xl md:text-5xl font-black text-[#daa520] tracking-tighter uppercase leading-tight font-sans font-black">{a.title}</h4></div>
                    <span className="text-white/20 font-mono text-sm tracking-widest">{a.timestamp}</span>
                  </div>
                  <p className="text-white text-xl md:text-3xl font-bold italic text-left font-black">"{a.desc}"</p>
                  <div className="pt-8 border-t-4 border-white/10 flex flex-wrap justify-between items-center gap-4 font-black">
                    <div className="flex gap-2"><button onClick={() => setBeomToken(p => p - 100)} className="bg-white text-black px-10 py-4 rounded-2xl font-black text-xl border-4 border-[#daa520] shadow-md hover:bg-[#daa520] transition-all uppercase font-black">👑 찬양</button></div>
                    <p className="text-[#daa520] font-black text-4xl md:text-7xl tracking-tighter font-sans font-black">{a.beomSupport.toLocaleString()} <span className="text-xl">BEOM</span></p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 팬방 모달 */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/98 backdrop-blur-3xl z-[300] flex items-center justify-center p-6 animate-in zoom-in-95">
          <div className="bg-[#111] p-10 rounded-[50px] border-8 border-[#daa520] w-full max-w-2xl text-center shadow-2xl">
            <h3 className="text-[#daa520] font-black text-4xl mb-10 italic uppercase font-sans">New Fan Territory</h3>
            <input type="text" value={createTitle} onChange={(e) => setCreateTitle(e.target.value)} placeholder="팬방 명칭 입력" className="bg-black border-4 border-white p-6 rounded-2xl w-full text-3xl text-center font-black text-white mb-10 outline-none focus:border-[#daa520]" />
            <div className="flex gap-4">
              <button onClick={() => setShowCreateModal(false)} className="flex-1 py-5 rounded-2xl font-black text-xl bg-white/10 border-4 border-white uppercase">Cancel</button>
              <button onClick={() => { setShowCreateModal(false); setCreateTitle(''); alert("팬방 개설 완료"); }} className="flex-1 py-5 rounded-2xl font-black text-xl bg-[#daa520] text-black border-4 border-white uppercase transition-all">Create</button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-20 opacity-40 text-center w-full pb-10 font-mono text-white text-[10px] tracking-[1em] uppercase font-black">KEDHEON EMPIRE | INTEGRITY MASTER V56.0 | ohsangjo</div>
    </div>
  );
}
