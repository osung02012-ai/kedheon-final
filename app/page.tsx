'use client';
import React, { useState, useEffect } from 'react';

// [제국 데이터 모델] 자산 및 광고 데이터를 저장하는 인터페이스
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

  // --- [2. 주군 하사 공식 이미지 에셋 반영 완료!] ---
  // public 폴더 내에 해당 파일들이 있어야 합니다.
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
  const [beomToken, setBeomToken] = useState(8888.88);
  const [isQrActive, setIsQrActive] = useState(false);
  const [fanLevel, setFanLevel] = useState(88);
  
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [isAdRequest, setIsAdRequest] = useState(false);

  // --- [4. 카테고리 및 8대 앱 공식 풀 네임] ---
  const categories = ['ALL', 'MUSIC', 'SPORTS', 'ANIME', 'DRAMA', 'MOVIE', 'ESPORTS', 'COMEDY'];
  const ecosystemFullApps = [
    'Pi Network', 'Nexus AI', 'Kedheon AI', 'Pi Vendor', 
    'Pi Civil', 'Pi FactFilter', 'PiPapa', 'Pi 6G Network'
  ];

  // 데이터 동기화 (LocalStorage)
  useEffect(() => {
    const savedAssets = localStorage.getItem('kedheon_assets');
    if (savedAssets) setAssets(JSON.parse(savedAssets));
    const savedToken = localStorage.getItem('kedheon_token');
    if (savedToken) setBeomToken(parseFloat(savedToken));
  }, []);

  useEffect(() => {
    localStorage.setItem('kedheon_token', beomToken.toString());
  }, [beomToken]);

  // 로직 함수들
  const handleHubClick = (app: string) => {
    setBeomToken(prev => prev + 1);
    setFanLevel(prev => prev + 1);
    alert(`[${app}] 생태계 활동 보상: +1 BEOM 확보!`);
  };

  const purchaseQR = () => {
    if (beomToken < QR_PURCHASE_COST) return alert("범 토큰 잔액이 부족합니다.");
    if (confirm(`${QR_PURCHASE_COST} BEOM을 사용하여 제국 인증 QR을 확보하시겠습니까?`)) {
      setBeomToken(prev => prev - QR_PURCHASE_COST);
      setIsQrActive(true);
      alert("인증 완료. QR 코드가 해제되었습니다.");
    }
  };

  const registerAsset = () => {
    const cost = isAdRequest ? AD_REG_COST : ASSET_REG_COST;
    if (!newTitle.trim()) return alert("제목을 입력하십시오.");
    if (beomToken < cost) return alert(`잔액 부족 (${cost} BEOM 필요)`);

    const newAsset: Asset = { 
      id: Date.now(), title: newTitle, desc: newDesc,
      category: category === 'ALL' ? 'GENERAL' : category, 
      isAd: isAdRequest, owner: empireCharacterName, 
      timestamp: new Date().toLocaleDateString() 
    };
    
    const updated = [newAsset, ...assets];
    setAssets(updated);
    localStorage.setItem('kedheon_assets', JSON.stringify(updated));
    setBeomToken(prev => prev - cost);
    setNewTitle(''); setNewDesc(''); setIsAdRequest(false);
    alert(isAdRequest ? "공식 광고 게재 완료!" : "자산 등록 완료");
  };

  return (
    <div className="flex flex-col items-center bg-black min-h-screen text-white p-6 font-sans w-full overflow-x-hidden">
      
      {/* 상단 탭: 시민 등급 전환 */}
      <div className="flex gap-4 mb-10 mt-10 justify-center w-full max-w-2xl">
        <button onClick={() => setTab('ROOKIE')} className={`px-8 py-2 rounded-full font-bold transition-all ${tab === 'ROOKIE' ? 'bg-[#daa520] text-black shadow-[0_0_15px_rgba(218,165,32,0.5)]' : 'bg-white/10 text-gray-500'}`}>ROOKIE</button>
        <button onClick={() => setTab('PIONEER')} className={`px-8 py-2 rounded-full font-bold transition-all ${tab === 'PIONEER' ? 'bg-[#daa520] text-black shadow-[0_0_15px_rgba(218,165,32,0.5)]' : 'bg-white/10 text-gray-500'}`}>PIONEER</button>
      </div>

      <div className="w-full max-w-2xl">
        {tab === 'ROOKIE' ? (
          <div className="flex flex-col items-center text-center py-20 animate-in fade-in zoom-in duration-500">
            <img src={mainCharacter} className="w-64 h-64 rounded-3xl object-cover mb-8 shadow-[0_0_50px_rgba(218,165,32,0.3)]" alt="Kedheon Beom" />
            <h1 className="text-4xl font-black text-[#daa520] tracking-widest mb-4">KEDHEON EMPIRE</h1>
            <p className="text-gray-500 mb-10 font-medium tracking-tighter text-sm">88쓰레드 엔진이 지탱하는 디지털 제국에 오신 것을 환영합니다. 시민권을 확보하여 주권을 행사하십시오.</p>
            <button onClick={() => setTab('PIONEER')} className="bg-[#daa520] text-black px-12 py-5 rounded-2xl font-black hover:scale-105 transition-transform shadow-xl">제국 입국하기</button>
          </div>
        ) : (
          <div className="flex flex-col gap-8 animate-in slide-in-from-bottom-10 duration-700">
            
            {/* 1. 대시보드 (범 토큰 보정본 lv.88 위에 배치 수정 완료!) */}
            <div className="bg-[#111] p-8 rounded-3xl border border-[#daa520]/40 shadow-2xl flex justify-between items-end relative overflow-hidden group">
              <div className="relative z-10">
                <h3 className="text-gray-500 text-[10px] uppercase tracking-[0.3em] mb-2 font-black opacity-60">Imperial Asset Balance</h3>
                <p className="text-[#daa520] font-black text-5xl leading-none">{beomToken.toLocaleString(undefined, { minimumFractionDigits: 2 })} BEOM</p>
                <div className="mt-6 bg-black/60 px-5 py-2.5 rounded-2xl border border-white/10 w-fit">
                   <span className="text-gray-300 text-sm font-mono font-bold">≈ {(beomToken / PI_TO_BEOM_RATE).toFixed(4)} Pi</span>
                   <span className="text-[#daa520] text-[9px] font-black ml-4 opacity-50">Rate 1:314.1592</span>
                </div>
              </div>

              {/* 주군! 삦닥하고 지저분했던 범 토큰 이미지를 정똑바로 정렬하여 lv.88 위에 배치했습니다! ㅋㅋㅋㅋㅋㅋㅋㅋ! */}
              <div className="flex flex-col items-end relative z-10"> 
                <img src={beomTokenImg} className="w-16 h-16 opacity-80 mb-3 transition-transform group-hover:scale-110 pointer-events-none" alt="Beom Token" />

                <div className="text-right">
                    <p className="text-white font-black text-4xl leading-none">Lv. {fanLevel}</p>
                    <p className="text-[10px] text-[#daa520] uppercase mt-2 font-black tracking-widest">Empire Grade</p>
                  </div>
                </div>
            </div>

            {/* 2. 콘텐츠 및 팬덤 카테고리 셀렉터 */}
            <div className="p-6 bg-[#111] rounded-3xl border border-white/5 text-center">
              <div className="flex flex-wrap gap-2 justify-center">
                {categories.map((cat) => (
                  <button key={cat} onClick={() => setCategory(cat)} className={`px-4 py-2 rounded-full text-[10px] font-black transition-all ${category === cat ? 'bg-[#daa520] text-black scale-110 shadow-lg' : 'bg-white/5 text-gray-500 hover:bg-white/10'}`}>{cat}</button>
                ))}
              </div>
            </div>

            {/* 3. 제국 인증 QR 시스템 (기업용 입력 필드 복구 완료!) */}
            <div className="bg-[#111] p-8 rounded-3xl border border-[#daa520]/20 text-center relative overflow-hidden group">
              <div className="absolute top-3 right-5 text-[10px] text-gray-600 font-mono font-bold">Fee: {QR_PURCHASE_COST} BEOM</div>
              <h3 className="text-[#daa520] font-black mb-6 text-sm tracking-[0.2em] uppercase">Imperial Auth QR System</h3>
              
              <div className="flex gap-2 justify-center mb-6 relative z-20">
                <button onClick={() => {setQrType('PERSONAL'); setIsQrActive(false);}} className={`px-6 py-2 rounded-xl text-[10px] font-bold transition-all ${qrType === 'PERSONAL' ? 'bg-[#daa520] text-black' : 'bg-white/5 text-gray-500'}`}>PERSONAL</button>
                <button onClick={() => {setQrType('BUSINESS'); setIsQrActive(false);}} className={`px-6 py-2 rounded-xl text-[10px] font-bold transition-all ${qrType === 'BUSINESS' ? 'bg-[#daa520] text-black' : 'bg-white/5 text-gray-500'}`}>BUSINESS</button>
              </div>

              <div className="relative w-full max-w-[340px] mx-auto aspect-[1.8/1] rounded-2xl border border-white/10 overflow-hidden shadow-2xl transition-transform group-hover:scale-[1.02]">
                <img src={qrType === 'PERSONAL' ? personalQrImg : businessQrImg} className="absolute inset-0 w-full h-full object-cover" alt="QR Background" />
                <div className={`absolute inset-0 flex flex-col items-center justify-center p-6 transition-all duration-500 ${isQrActive ? 'bg-transparent' : 'bg-black/95 backdrop-blur-2xl'}`}>
                  {isQrActive ? (
                    <div className="bg-white p-2.5 rounded-2xl shadow-white/20 shadow-2xl animate-in zoom-in-50 duration-300">
                      <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(empireUrl + '/?id=' + (qrType === 'BUSINESS' ? businessID : empireCharacterName))}`} className="w-24 h-24" alt="QR Code" />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center relative z-10">
                      <span className="text-4xl mb-5 opacity-40">🔐</span>
                      <button onClick={purchaseQR} className="bg-[#daa520] text-black px-10 py-4 rounded-xl font-black text-xs shadow-lg hover:scale-105 active:scale-95 transition-all">QR 확보하기</button>
                    </div>
                  )}
                </div>
              </div>

              {/* 주군! 사라졌던 기업명 및 고유ID 입력 공간을 복구했습니다! ㅋㅋㅋㅋㅋㅋㅋㅋ! */}
              {qrType === 'BUSINESS' && (
                <div className="mt-8 flex flex-col gap-3 max-w-[280px] mx-auto animate-in slide-in-from-top-4 relative z-20">
                  <input type="text" value={businessName} onChange={(e) => {setBusinessName(e.target.value); setIsQrActive(false);}} placeholder="기업/브랜드 명칭" className="bg-black/60 border border-white/10 p-3.5 rounded-xl text-sm focus:border-[#daa520] outline-none text-center font-bold" />
                  <input type="text" value={businessID} onChange={(e) => {setBusinessID(e.target.value); setIsQrActive(false);}} placeholder="사업자 ID / 고유 식별자" className="bg-black/60 border border-white/10 p-3.5 rounded-xl text-sm focus:border-[#daa520] outline-none text-center font-mono" />
                </div>
              )}
            </div>

            {/* 4. Ecosystem Infrastructure Hub (풀네임 반영) */}
            <div className="bg-[#111] p-8 rounded-3xl border border-white/5 shadow-inner">
              <h3 className="text-center text-[10px] font-black text-[#daa520] mb-8 uppercase tracking-[0.4em] opacity-80">🌐 Ecosystem Infrastructure Hub</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {ecosystemFullApps.map(app => (
                  <button key={app} onClick={() => handleHubClick(app)} className="h-24 bg-white/5 rounded-2xl border border-white/10 flex flex-col items-center justify-center p-3 hover:bg-[#daa520] hover:text-black transition-all group shadow-lg active:scale-95">
                    <span className="text-[10px] font-black text-[#daa520] group-hover:text-black text-center leading-tight break-words px-1">{app}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 5. 유저 스튜디오 & 제국 광고 센터 */}
            <div className="bg-[#111] p-8 rounded-3xl border border-white/5 relative overflow-hidden">
              <h3 className="text-[#daa520] font-black text-sm mb-6 tracking-widest uppercase relative z-10">User Studio & Imperial AD Center</h3>
              <div className="flex flex-col gap-4 relative z-10">
                <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="제목 또는 광고 헤드라인" className="bg-black p-4 rounded-xl border border-white/10 text-sm focus:border-[#daa520] outline-none transition-all font-bold" />
                <textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="상세 설명 (광고 게재 시 홍보 문구 작성)" className="bg-black p-4 rounded-2xl border border-white/10 text-sm h-28 outline-none focus:border-[#daa520] resize-none transition-all" />
                
                {/* 광고 게재 토글 */}
                <div className="flex justify-between items-center bg-black/60 p-5 rounded-2xl border border-[#daa520]/20 shadow-inner backdrop-blur-md">
                  <div className="flex flex-col text-left">
                    <span className="text-[11px] font-black text-[#daa520] uppercase tracking-tighter">제국 공식 광고 (AD) 게재</span>
                    <span className="text-[9px] text-gray-500 mt-1 font-bold">리스트 최상단 노출 및 골드 프레임 적용</span>
                  </div>
                  <div className="flex items-center gap-5">
                    <span className="text-[10px] font-mono text-gray-400 font-black">{AD_REG_COST} BEOM</span>
                    <input type="checkbox" checked={isAdRequest} onChange={(e) => setIsAdRequest(e.target.checked)} className="w-6 h-6 rounded-md accent-[#daa520] cursor-pointer shadow-lg" />
                  </div>
                </div>

                <button onClick={registerAsset} className={`w-full py-5 rounded-2xl font-black text-sm transition-all duration-300 ${isAdRequest ? 'bg-gradient-to-br from-[#daa520] to-[#b8860b] text-black shadow-[0_15px_30px_rgba(218,165,32,0.3)] hover:brightness-110' : 'bg-white/10 hover:bg-white/20'}`}>
                  {isAdRequest ? '제국 공식 광고 게재하기 (AD)' : `자산 등록 (${ASSET_REG_COST} BEOM)`}
                </button>
              </div>

              {/* 실시간 피드 */}
              <div className="mt-12 space-y-5 relative z-10">
                <h3 className="text-gray-500 text-[10px] font-black uppercase tracking-[0.4em] border-b border-white/5 pb-4">Imperial Real-time Feed</h3>
                {assets.filter(a => category === 'ALL' || a.category === category).map((a) => (
                  <div key={a.id} className={`p-6 rounded-3xl border-l-8 transition-all animate-in slide-in-from-right-10 duration-500 ${a.isAd ? 'bg-[#daa520]/10 border-[#daa520] shadow-2xl' : 'bg-white/5 border-gray-800'}`}>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        {a.isAd && <span className="bg-[#daa520] text-black text-[9px] px-3 py-1 rounded-full font-black tracking-tighter">OFFICIAL AD</span>}
                        <span className="font-black text-white text-base tracking-tight">{a.title}</span>
                      </div>
                      <span className="text-gray-600 text-[11px] font-mono font-black">{a.timestamp}</span>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed mb-5 font-medium">{a.desc}</p>
                    <div className="flex justify-between items-center pt-4 border-t border-white/5">
                      <span className="text-[#daa520] text-[9px] font-black uppercase tracking-widest bg-[#daa520]/10 px-3 py-1 rounded-lg break-words"># {a.category}</span>
                      <span className="text-[10px] text-gray-600 font-mono italic font-bold">Secure ID: {a.owner}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 최하단 푸터 */}
            <div className="text-center py-20 opacity-20 relative">
               <div className="w-12 h-1 bg-[#daa520] mx-auto mb-8 rounded-full relative z-10"></div>
               <p className="text-[9px] font-mono tracking-[0.6em] uppercase leading-loose text-white/50 relative z-10 break-words">Kedheon Empire Digital Infrastructure<br/>Hyper-Engine Verified</p>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
