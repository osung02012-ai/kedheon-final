'use client';
import React, { useState, useEffect } from 'react';

/**
 * [제국 데이터 모델]
 * 자산 및 광고 정보를 저장하는 인터페이스
 */
interface Asset { 
  id: number; 
  title: string; 
  desc: string;
  category: string; 
  isAd: boolean; 
  owner: string; 
  timestamp: string; 
}

export default function KedheonPortal() {
  // --- [1. 제국 핵심 환경 설정] ---
  const PI_TO_BEOM_RATE = 314.1592; // 제국 황금 환율 (1 Pi = 314.1592 BEOM)
  const QR_PURCHASE_COST = 50;      // QR 인증 확보 비용
  const ASSET_REG_COST = 10;        // 일반 자산 등록 비용
  const AD_REG_COST = 500;          // 제국 공식 광고 등록 비용
  const empireCharacterName = 'CHEOREOM_88';
  const empireUrl = "https://kedheon.com";

  // --- [2. 주군 하사 공식 이미지 경로 확정] ---
  // public 폴더 내에 해당 파일들이 반드시 존재해야 합니다.
  const mainCharacter = "/kedheon-character.png"; 
  const beomTokenImg = "/beom-token.png";
  const businessQrImg = "/qr-business.png";
  const personalQrImg = "/qr-personal.png";

  // --- [3. 제어 상태 관리] ---
  const [tab, setTab] = useState<'ROOKIE' | 'PIONEER'>('PIONEER');
  const [category, setCategory] = useState('ALL');
  const [qrType, setQrType] = useState<'PERSONAL' | 'BUSINESS'>('PERSONAL');
  const [businessName, setBusinessName] = useState('해태건축사');
  const [businessID, setBusinessID] = useState('HT-0001');
  
  const [assets, setAssets] = useState<Asset[]>([]);
  const [beomToken, setBeomToken] = useState(8891.88); // 실시간 잔액 반영
  const [isQrActive, setIsQrActive] = useState(false);
  const [fanLevel, setFanLevel] = useState(88);
  
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [isAdRequest, setIsAdRequest] = useState(false);

  // --- [4. 카테고리 및 8대 앱 공식 풀 네임] ---
  const categories = ['ALL', 'MUSIC', 'SPORTS', 'ANIME', 'DRAMA', 'MOVIE', 'ESPORTS', 'COMEDY'];
  
  const ecosystemFullApps = [
    'Pi Network', 
    'Nexus AI', 
    'Kedheon AI', 
    'Pi Vendor', 
    'Pi Civil', 
    'Pi FactFilter', 
    'PiPapa', 
    'Pi 6G Network'
  ];

  // 데이터 영속성 유지
  useEffect(() => {
    const savedAssets = localStorage.getItem('kedheon_assets');
    if (savedAssets) setAssets(JSON.parse(savedAssets));
    const savedToken = localStorage.getItem('kedheon_token');
    if (savedToken) setBeomToken(parseFloat(savedToken));
  }, []);

  useEffect(() => {
    localStorage.setItem('kedheon_token', beomToken.toString());
  }, [beomToken]);

  // --- [5. 제국 비즈니스 로직] ---

  const handleHubClick = (app: string) => {
    setBeomToken(prev => prev + 1);
    setFanLevel(prev => prev + 1);
    alert(`[${app}] 활동이 88쓰레드 엔진에 기록되었습니다. +1 BEOM 확보!`);
  };

  const purchaseQR = () => {
    if (beomToken < QR_PURCHASE_COST) return alert("범 토큰 잔액이 부족합니다.");
    if (confirm(`${QR_PURCHASE_COST} BEOM을 사용하여 제국 인증 QR을 확보하시겠습니까?`)) {
      setBeomToken(prev => prev - QR_PURCHASE_COST);
      setIsQrActive(true);
      alert("인증 완료. 제국 QR 데이터가 해제되었습니다.");
    }
  };

  const registerAsset = () => {
    const cost = isAdRequest ? AD_REG_COST : ASSET_REG_COST;
    if (!newTitle.trim()) return alert("제목을 입력하십시오.");
    if (beomToken < cost) return alert(`잔액 부족 (${cost} BEOM 필요)`);

    const newAsset: Asset = { 
      id: Date.now(), 
      title: newTitle, 
      desc: newDesc,
      category: category === 'ALL' ? 'GENERAL' : category, 
      isAd: isAdRequest,
      owner: empireCharacterName, 
      timestamp: new Date().toLocaleDateString() 
    };
    
    const updated = [newAsset, ...assets];
    setAssets(updated);
    localStorage.setItem('kedheon_assets', JSON.stringify(updated));
    setBeomToken(prev => prev - cost);
    setNewTitle(''); setNewDesc(''); setIsAdRequest(false);
    alert(isAdRequest ? "제국 공식 광고가 게재되었습니다!" : "자산 등록이 완료되었습니다.");
  };

  return (
    <div className="flex flex-col items-center bg-black min-h-screen text-white p-6 font-sans w-full overflow-x-hidden">
      
      {/* [TAB] Rookie / Pioneer 전환 */}
      <div className="flex gap-4 mb-10 mt-10 justify-center w-full max-w-2xl">
        <button onClick={() => setTab('ROOKIE')} className={`px-10 py-3 rounded-2xl font-black transition-all ${tab === 'ROOKIE' ? 'bg-[#daa520] text-black shadow-[0_0_20px_rgba(218,165,32,0.6)]' : 'bg-[#111] text-gray-500'}`}>ROOKIE</button>
        <button onClick={() => setTab('PIONEER')} className={`px-10 py-3 rounded-2xl font-black transition-all ${tab === 'PIONEER' ? 'bg-[#daa520] text-black shadow-[0_0_20px_rgba(218,165,32,0.6)]' : 'bg-[#111] text-gray-500'}`}>PIONEER</button>
      </div>

      <div className="w-full max-w-3xl">
        {tab === 'ROOKIE' ? (
          /* 루키 화면: 캐릭터 대문 */
          <div className="flex flex-col items-center text-center py-20 animate-in fade-in zoom-in duration-500">
            <img src={mainCharacter} className="w-72 h-72 rounded-[40px] object-cover mb-8 shadow-[0_0_50px_rgba(218,165,32,0.4)] border-4 border-[#daa520]/20" alt="Kedheon" />
            <h1 className="text-4xl font-black text-[#daa520] tracking-widest mb-4">KEDHEON EMPIRE</h1>
            <button onClick={() => setTab('PIONEER')} className="bg-[#daa520] text-black px-12 py-5 rounded-2xl font-black hover:scale-105 transition-transform shadow-xl">제국 입국하기</button>
          </div>
        ) : (
          /* 파이오니어 화면: 제국 통제실 */
          <div className="flex flex-col gap-10 animate-in slide-in-from-bottom-10 duration-700">
            
            {/* 1. 경제 대시보드 (범 토큰 이미지 배경) */}
            <div className="bg-[#111] p-10 rounded-[40px] border border-[#daa520]/40 shadow-2xl flex justify-between items-end relative overflow-hidden group">
              <img src={beomTokenImg} className="absolute -top-6 -left-6 w-32 h-32 opacity-30 rotate-12 transition-transform group-hover:scale-110 pointer-events-none" alt="Beom Token" />
              <div className="relative z-10">
                <h3 className="text-gray-500 text-[10px] uppercase tracking-[0.3em] mb-2 font-black">Imperial Asset Balance</h3>
                <p className="text-[#daa520] font-black text-5xl leading-none">{beomToken.toLocaleString(undefined, { minimumFractionDigits: 2 })} BEOM</p>
                <div className="mt-6 bg-black/60 px-5 py-2.5 rounded-2xl border border-white/10 w-fit">
                   <span className="text-gray-300 text-sm font-mono font-black">≈ {(beomToken / PI_TO_BEOM_RATE).toFixed(4)} Pi</span>
                   <span className="text-[#daa520] text-[9px] font-black ml-4 opacity-60">1 Pi : {PI_TO_BEOM_RATE}</span>
                </div>
              </div>
              <div className="text-right relative z-10">
                <p className="text-white font-black text-4xl leading-none">Lv. {fanLevel}</p>
                <p className="text-xs text-[#daa520] uppercase mt-2 font-black tracking-widest">Empire Grade</p>
              </div>
            </div>

            {/* 2. 콘텐츠 카테고리 셀렉터 */}
            <div className="p-4 bg-[#111] rounded-[30px] border border-white/5 flex flex-wrap gap-2 justify-center">
              {categories.map((cat) => (
                <button key={cat} onClick={() => setCategory(cat)} className={`px-6 py-2.5 rounded-2xl text-[11px] font-black transition-all ${category === cat ? 'bg-[#daa520] text-black shadow-lg scale-105' : 'bg-[#1a1a1a] text-gray-500 hover:text-white'}`}>{cat}</button>
              ))}
            </div>

            {/* 3. 제국 인증 QR 시스템 (주군 하사 배경 이미지 반영) */}
            <div className="bg-[#111] p-10 rounded-[40px] border border-[#daa520]/20 text-center relative overflow-hidden">
              <div className="absolute top-4 right-8 text-xs text-gray-600 font-mono font-bold tracking-widest">Fee: {QR_PURCHASE_COST} BEOM</div>
              <h3 className="text-[#daa520] font-black mb-8 text-lg tracking-[0.3em] uppercase">Imperial Auth QR System</h3>
              
              <div className="flex gap-3 justify-center mb-10">
                <button onClick={() => {setQrType('PERSONAL'); setIsQrActive(false);}} className={`px-8 py-3 rounded-2xl text-[11px] font-black transition-all ${qrType === 'PERSONAL' ? 'bg-[#daa520] text-black shadow-lg' : 'bg-[#1a1a1a] text-gray-500'}`}>PERSONAL</button>
                <button onClick={() => {setQrType('BUSINESS'); setIsQrActive(false);}} className={`px-8 py-3 rounded-2xl text-[11px] font-black transition-all ${qrType === 'BUSINESS' ? 'bg-[#daa520] text-black shadow-lg' : 'bg-[#1a1a1a] text-gray-500'}`}>BUSINESS</button>
              </div>

              <div className="relative w-full max-w-[500px] mx-auto aspect-[1.8/1] rounded-[40px] border border-white/10 overflow-hidden shadow-2xl group">
                {/* 배경 이미지 레이어 */}
                <img 
                  src={qrType === 'PERSONAL' ? personalQrImg : businessQrImg} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                  alt="QR Background" 
                />
                
                {/* 오버레이 레이어 */}
                <div className={`absolute inset-0 flex flex-col items-center justify-center p-8 transition-all duration-700 ${isQrActive ? 'bg-black/10 backdrop-blur-none' : 'bg-black/95 backdrop-blur-3xl'}`}>
                  {isQrActive ? (
                    <div className="bg-white p-3 rounded-[30px] shadow-2xl border-4 border-[#daa520]/50 animate-in zoom-in-50">
                      <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(empireUrl + '/?id=' + (qrType === 'BUSINESS' ? businessID : empireCharacterName))}`} className="w-32 h-32" alt="Empire QR" />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <span className="text-5xl mb-6 opacity-30 animate-pulse">🔐</span>
                      <button onClick={purchaseQR} className="bg-[#daa520] text-black px-12 py-5 rounded-3xl font-black text-sm shadow-[0_15px_35px_rgba(218,165,32,0.4)] hover:scale-105 transition-transform">QR 확보하기</button>
                      <p className="text-[10px] text-gray-500 mt-5 font-bold uppercase tracking-widest opacity-60">제국 인증 데이터 활성화 대기 중</p>
                    </div>
                  )}
                </div>
              </div>

              {qrType === 'BUSINESS' && (
                <div className="mt-10 flex flex-col gap-4 max-w-sm mx-auto animate-in slide-in-from-top-4">
                  <input type="text" value={businessName} onChange={(e) => {setBusinessName(e.target.value); setIsQrActive(false);}} placeholder="기업/브랜드 명칭" className="bg-black/60 border border-white/10 p-4 rounded-2xl text-sm focus:border-[#daa520] outline-none text-center font-black" />
                  <input type="text" value={businessID} onChange={(e) => {setBusinessID(e.target.value); setIsQrActive(false);}} placeholder="사업자 ID / 고유 식별자" className="bg-black/60 border border-white/10 p-4 rounded-2xl text-sm focus:border-[#daa520] outline-none text-center font-mono" />
                </div>
              )}
            </div>

            {/* 4. [풀 네임] Ecosystem Infrastructure Hub */}
            <div className="bg-[#111] p-10 rounded-[40px] border border-white/5">
              <h3 className="text-center text-xs font-black text-[#daa520] mb-10 uppercase tracking-[0.5em] opacity-80">🌐 Ecosystem Infrastructure Hub</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
                {ecosystemFullApps.map(app => (
                  <button key={app} onClick={() => handleHubClick(app)} className="h-28 bg-[#1a1a1a] rounded-[30px] border border-white/5 flex flex-col items-center justify-center p-5 hover:bg-[#daa520] hover:text-black transition-all group shadow-lg">
                    <span className="text-[11px] font-black text-[#daa520] group-hover:text-black text-center leading-tight break-words">{app}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 5. 유저 스튜디오 & 제국 광고 센터 */}
            <div className="bg-[#111] p-10 rounded-[40px] border border-white/5 relative overflow-hidden">
              <img src={mainCharacter} className="absolute -bottom-10 -right-10 w-48 h-48 opacity-10 pointer-events-none grayscale" alt="Bg Decor" />
              <h3 className="text-[#daa520] font-black text-base mb-8 tracking-widest uppercase">User Studio & Imperial AD Center</h3>
              <div className="flex flex-col gap-5 relative z-10">
                <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="제목 또는 광고 헤드라인" className="bg-black p-5 rounded-2xl border border-white/10 text-sm focus:border-[#daa520] outline-none transition-all font-bold" />
                <textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="상세 설명 (광고 게재 시 홍보 문구 작성)" className="bg-black p-5 rounded-2xl border border-white/10 text-sm h-32 outline-none focus:border-[#daa520] resize-none transition-all" />
                
                {/* 광고 게재 토글 */}
                <div className="flex justify-between items-center bg-black/60 p-6 rounded-3xl border border-[#daa520]/20 shadow-inner">
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-[#daa520] uppercase tracking-tighter">제국 공식 광고 (AD) 게재</span>
                    <span className="text-[10px] text-gray-500 mt-1 font-bold">리스트 최상단 고정 및 골드 프레임 적용</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-xs font-mono text-gray-400 font-black">{AD_REG_COST} BEOM</span>
                    <input type="checkbox" checked={isAdRequest} onChange={(e) => setIsAdRequest(e.target.checked)} className="w-7 h-7 rounded-lg accent-[#daa520] cursor-pointer shadow-lg" />
                  </div>
                </div>

                <button onClick={registerAsset} className={`w-full py-6 rounded-3xl font-black text-base transition-all duration-300 ${isAdRequest ? 'bg-gradient-to-br from-[#daa520] to-[#b8860b] text-black shadow-[0_20px_40px_rgba(218,165,32,0.4)]' : 'bg-white/5 hover:bg-white/10'}`}>
                  {isAdRequest ? '제국 공식 광고 확보하기 (AD)' : `자산 등록 (${ASSET_REG_COST} BEOM)`}
                </button>
              </div>

              {/* 실시간 피드 */}
              <div className="mt-14 space-y-6 relative z-10">
                <h3 className="text-gray-500 text-xs font-black uppercase tracking-[0.4em] border-b border-white/5 pb-6">Imperial Real-time Feed</h3>
                {assets.filter(a => category === 'ALL' || a.category === category).length > 0 ? (
                  assets.filter(a => category === 'ALL' || a.category === category).map((a) => (
                    <div key={a.id} className={`p-8 rounded-[40px] border-l-[12px] transition-all duration-500 ${a.isAd ? 'bg-[#daa520]/10 border-[#daa520] shadow-2xl' : 'bg-white/5 border-gray-800'}`}>
                      <div className="flex justify-between items-start mb-5">
                        <div className="flex items-center gap-4">
                          {a.isAd && <span className="bg-[#daa520] text-black text-[10px] px-3 py-1 rounded-full font-black">OFFICIAL AD</span>}
                          <span className="font-black text-white text-xl tracking-tight">{a.title}</span>
                        </div>
                        <span className="text-gray-600 text-xs font-mono font-black">{a.timestamp}</span>
                      </div>
                      <p className="text-sm text-gray-400 leading-relaxed mb-6 font-medium">{a.desc}</p>
                      <div className="flex justify-between items-center pt-5 border-t border-white/5">
                        <span className="text-[#daa520] text-xs font-black uppercase tracking-widest bg-[#daa520]/10 px-4 py-1.5 rounded-xl"># {a.category}</span>
                        <span className="text-xs text-gray-600 font-mono italic font-bold tracking-tighter">Owner Secure ID: {a.owner}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/10 rounded-[40px] bg-black/40">
                    <span className="text-5xl mb-6 opacity-10">🐯</span>
                    <p className="text-center text-gray-700 text-xs uppercase font-black tracking-widest">현재 영토에 확보된 데이터가 없습니다</p>
                  </div>
                )}
              </div>
            </div>

            {/* [FOOTER] 제국 인프라 인증 */}
            <div className="text-center py-24 opacity-20">
               <div className="w-20 h-1 bg-[#daa520] mx-auto mb-10 rounded-full"></div>
               <p className="text-[10px] font-mono tracking-[0.8em] uppercase leading-loose text-white/50">Kedheon Empire Digital Infrastructure<br/>88-Threads Engine Verified</p>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
