'use client';
import React, { useState, useEffect } from 'react';

// 자산 데이터 모델
interface Asset { 
  id: number; 
  title: string; 
  desc: string;
  owner: string; 
  timestamp: string; 
}

export default function KedheonPortal() {
  // 1. 프레임워크 상태
  const [tab, setTab] = useState<'ROOKIE' | 'PIONEER'>('PIONEER');
  
  // 2. UI 및 데이터 상태
  const [category, setCategory] = useState('ALL');
  const [qrType, setQrType] = useState<'PERSONAL' | 'BUSINESS'>('PERSONAL');
  const [businessName, setBusinessName] = useState('해태건축사');
  const [businessID, setBusinessID] = useState('HT-0001');
  const [assets, setAssets] = useState<Asset[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');

  // --- [신규 추가] QR 구매 상태 ---
  const [isQrActive, setIsQrActive] = useState(false);
  const QR_PURCHASE_COST = 50; 
  
  // 3. 범 토큰 경제 상태
  const [beomToken, setBeomToken] = useState(8888.88);
  const [fanLevel, setFanLevel] = useState(88);
  
  // 4. 고정 데이터
  const empireCharacterName = 'USER_888';
  const empireUrl = "https://kedheon.com";
  const categories = ['ALL', 'MUSIC', 'SPORTS', 'ACTOR', 'ESPORTS', 'COMEDY'];
  const ecosystemApps = ['PI', 'NEXUS', 'AI', 'VENDOR', 'CIVIL', 'FILTER', 'PAPA', '6G'];

  // 5. 로컬 이미지 경로
  const personalImage = '/qr-personal.png'; 
  const businessImage = '/qr-business.png';

  useEffect(() => {
    const savedAssets = localStorage.getItem('kedheon_assets');
    if (savedAssets) setAssets(JSON.parse(savedAssets));

    const savedToken = localStorage.getItem('kedheon_token');
    if (savedToken) setBeomToken(parseFloat(savedToken));
  }, []);

  useEffect(() => {
    localStorage.setItem('kedheon_token', beomToken.toString());
  }, [beomToken]);

  const handleHubClick = (app: string) => {
    setBeomToken(prev => prev + 1);
    setFanLevel(prev => prev + 1);
    alert(`[${app}] 생태계 활동 보상: +1 BEOM 지급 완료.`);
  };

  // --- [신규 추가] QR 구매/갱신 로직 ---
  const purchaseQR = () => {
    if (beomToken < QR_PURCHASE_COST) {
      alert(`범 토큰이 부족합니다. (필요: ${QR_PURCHASE_COST} BEOM)`);
      return;
    }
    
    if (confirm(`${QR_PURCHASE_COST} BEOM을 사용하여 인증 QR을 발급/갱신하시겠습니까?`)) {
      setBeomToken(prev => prev - QR_PURCHASE_COST);
      setIsQrActive(true);
      alert("제국 인증 QR이 성공적으로 확보되었습니다! (유효기간: 무제한)");
    }
  };

  const registerAsset = () => {
    if (!newTitle.trim()) { alert("창작물 제목을 입력하십시오."); return; }
    if (beomToken < 10) { alert("범 토큰 잔액이 부족합니다. (10 BEOM 필요)"); return; }

    const newAsset: Asset = { 
      id: Date.now(), 
      title: newTitle, 
      desc: newDesc,
      owner: empireCharacterName, 
      timestamp: new Date().toLocaleDateString() 
    };
    
    const updated = [...assets, newAsset];
    setAssets(updated);
    localStorage.setItem('kedheon_assets', JSON.stringify(updated));
    setBeomToken(prev => prev - 10);
    setNewTitle('');
    setNewDesc('');
    alert(`제국 자산으로 공식 등록되었습니다.`);
  };

  return (
    <div className="flex flex-col items-center bg-black min-h-screen text-white p-6 font-sans w-full overflow-x-hidden">
      
      {/* 1. 최상위 프레임워크 */}
      <div className="flex gap-4 mb-10 mt-10 justify-center w-full max-w-2xl">
        <button onClick={() => setTab('ROOKIE')} className={`px-8 py-2 rounded-full font-bold transition-all ${tab === 'ROOKIE' ? 'bg-[#daa520] text-black shadow-[0_0_15px_rgba(218,165,32,0.5)]' : 'bg-white/10'}`}>ROOKIE</button>
        <button onClick={() => setTab('PIONEER')} className={`px-8 py-2 rounded-full font-bold transition-all ${tab === 'PIONEER' ? 'bg-[#daa520] text-black shadow-[0_0_15px_rgba(218,165,32,0.5)]' : 'bg-white/10'}`}>PIONEER</button>
      </div>

      <div className="w-full max-w-2xl">
        {tab === 'ROOKIE' ? (
          <div className="flex flex-col items-center text-center py-20">
            <img src="/kedheon-character.png" className="w-64 mb-6 object-contain" alt="Kedheon Character" />
            <h1 className="text-4xl font-black mt-6 text-[#daa520] tracking-widest">KEDHEON EMPIRE</h1>
            <button className="mt-10 bg-[#daa520] text-black px-12 py-5 rounded-2xl font-black hover:scale-105 transition-transform">시민권 신청</button>
          </div>
        ) : (
          <div className="bg-[#111] p-8 rounded-3xl border border-white/10 w-full shadow-[0_0_30px_rgba(218,165,32,0.1)] flex flex-col gap-8">
            
            {/* 2. 경제 대시보드 */}
            <div className="bg-gradient-to-r from-[#daa520]/20 to-transparent p-6 rounded-2xl border border-[#daa520]/30 flex justify-between items-center transition-all">
              <div>
                <h3 className="text-gray-400 text-xs uppercase tracking-widest mb-1">Imperial Token</h3>
                <p className="text-[#daa520] font-black text-2xl">{beomToken.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} BEOM</p>
              </div>
              <div className="text-right">
                <h3 className="text-gray-400 text-xs uppercase mb-1">Fan Level</h3>
                <p className="text-white font-black text-xl">Lv. {fanLevel}</p>
              </div>
            </div>

            {/* 4. 제국 인증 QR 시스템 (수정됨) */}
            <div className="bg-black p-6 rounded-2xl border border-[#daa520]/30 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 text-[10px] text-gray-600 font-mono">-{QR_PURCHASE_COST} BEOM / 발급</div>
              <h3 className="text-[#daa520] font-bold mb-4">제국 인증 QR 시스템</h3>
              
              <div className="flex gap-2 justify-center mb-4">
                <button onClick={() => {setQrType('PERSONAL'); setIsQrActive(false);}} className={`px-4 py-1 rounded text-[10px] ${qrType === 'PERSONAL' ? 'bg-[#daa520] text-black' : 'bg-white/10'}`}>개인 신분</button>
                <button onClick={() => {setQrType('BUSINESS'); setIsQrActive(false);}} className={`px-4 py-1 rounded text-[10px] ${qrType === 'BUSINESS' ? 'bg-[#daa520] text-black' : 'bg-white/10'}`}>기업/결제</button>
              </div>

              <div className="relative w-full max-w-[250px] mx-auto mb-4 aspect-square overflow-hidden rounded-xl border border-white/10 group">
                <img src={qrType === 'PERSONAL' ? personalImage : businessImage} className="absolute inset-0 w-full h-full object-cover" alt="QR Background" />
                
                {/* QR 활성화 여부에 따른 오버레이 */}
                <div className={`absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-4 transition-all ${isQrActive ? 'backdrop-blur-0' : 'backdrop-blur-md'}`}>
                  {isQrActive ? (
                    <>
                      <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(empireUrl + '/?type=' + qrType + '&id=' + (qrType === 'BUSINESS' ? businessID : empireCharacterName))}`} className="w-20 h-20 bg-white p-1 rounded animate-pulse" alt="QR Code" />
                      <p className="mt-2 text-[9px] font-bold text-[#daa520] truncate w-full px-2">{qrType === 'BUSINESS' ? `${businessName} (${businessID})` : empireCharacterName}</p>
                    </>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="text-3xl mb-2">🔒</div>
                      <p className="text-[10px] text-gray-400 mb-4">인증이 만료되었거나 발급되지 않았습니다.</p>
                      <button onClick={purchaseQR} className="bg-[#daa520] text-black px-4 py-2 rounded text-[10px] font-black hover:scale-105 transition-transform">QR 확보하기 ({QR_PURCHASE_COST} BEOM)</button>
                    </div>
                  )}
                </div>
              </div>

              {qrType === 'BUSINESS' && (
                <div className="flex flex-col gap-2 mt-4">
                  <input type="text" value={businessName} onChange={(e) => {setBusinessName(e.target.value); setIsQrActive(false);}} placeholder="기업명" className="w-full bg-[#1a1a1a] p-2 text-sm rounded border border-white/10 focus:border-[#daa520] outline-none" />
                  <input type="text" value={businessID} onChange={(e) => {setBusinessID(e.target.value); setIsQrActive(false);}} placeholder="고유ID" className="w-full bg-[#1a1a1a] p-2 text-sm rounded border border-white/10 focus:border-[#daa520] outline-none" />
                </div>
              )}
            </div>

            {/* 5. 8대 생태계 허브 */}
            <div className="bg-black p-6 rounded-2xl border border-white/5">
              <h3 className="text-center text-xs font-bold text-[#daa520] mb-4">🌐 8대 생태계 허브 (활동 채굴)</h3>
              <div className="grid grid-cols-4 gap-4 text-center">
                {ecosystemApps.map(app => (
                  <button key={app} onClick={() => handleHubClick(app)} className="flex flex-col items-center hover:scale-105 transition-transform group">
                    <div className="w-12 h-12 bg-white/5 rounded-full mb-2 border border-white/10 flex items-center justify-center text-[10px] text-[#daa520] font-bold group-hover:bg-[#daa520]/20 transition-colors">{app}</div>
                    <span className="text-[10px] text-gray-400 group-hover:text-white transition-colors">{app}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 6. 유저 창작 스튜디오 */}
            <div className="bg-black p-6 rounded-2xl border border-white/5 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 text-[10px] text-gray-600 font-mono">-10 BEOM / 등록</div>
              <h3 className="text-[#daa520] font-black text-sm mb-4">USER STUDIO (제국 자산 등록)</h3>
              <div className="flex flex-col gap-3">
                <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="창작물 제목 입력" className="w-full bg-[#1a1a1a] p-3 text-sm rounded-lg border border-white/10 focus:border-[#daa520] outline-none" />
                <textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="창작물 상세 설명" className="w-full h-20 bg-[#1a1a1a] p-3 text-sm rounded-lg border border-white/10 focus:border-[#daa520] outline-none resize-none" />
                <button onClick={registerAsset} className="w-full bg-[#daa520] text-black py-3 rounded-lg font-black shadow-lg hover:bg-[#b8860b] transition-colors">자산 등록 (10 BEOM 결제)</button>
              </div>

              {/* 인증된 자산 리스트 */}
              {assets.length > 0 && (
                <div className="mt-6 space-y-3 text-left">
                  <h3 className="text-gray-400 text-xs font-bold mb-2">인증된 자산 목록</h3>
                  {assets.map((a) => (
                    <div key={a.id} className="p-4 bg-white/5 rounded-xl border-l-4 border-[#daa520]">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-bold text-white text-sm">{a.title}</span>
                        <span className="text-[#daa520] text-[10px] font-mono">{a.timestamp}</span>
                      </div>
                      {a.desc && <p className="text-xs text-gray-500 line-clamp-2">{a.desc}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
