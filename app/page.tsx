'use client';
import React, { useState, useEffect } from 'react';

// --- [데이터 모델 정의] ---
interface Asset { 
  id: number; title: string; desc: string; category: string; 
  videoUrl?: string; beomSupport: number; isAd: boolean; 
  owner: string; timestamp: string; 
}

interface Territory {
  id: string; title: string; desc: string; creator: string;
}

// --- [공통 섹션 타이틀: 타이틀(3) : 설명(2) 황금 비율] ---
const SectionTitle = ({ title, desc }: { title: string; desc: string }) => (
  <div className="flex flex-col items-center mb-14 gap-4">
    <div className="flex items-center gap-6">
      <span className="text-6xl animate-pulse">🌐</span>
      <h3 className="text-[#daa520] font-black text-5xl tracking-[0.2em] uppercase leading-tight text-center">
        {title}
      </h3>
    </div>
    <p className="text-gray-400 font-bold text-2xl tracking-wide opacity-80 text-center max-w-4xl">
      {desc}
    </p>
  </div>
);

export default function KedheonPortal() {
  // --- [1. 제국 환경 설정] ---
  const PI_TO_BEOM_RATE = 314.1592; 
  const QR_PURCHASE_COST = 50;
  const TERRITORY_CREATE_COST = 500;
  const AD_REG_COST = 500;
  const empireCharacterName = 'CHEOREOM_88';
  const empireUrl = "https://kedheon.com";

  // --- [2. 이미지 에셋] ---
  const mainCharacter = "/kedheon-character.png"; 
  const beomTokenImg = "/beom-token.png";
  const businessQrImg = "/qr-business.png";
  const personalQrImg = "/qr-personal.png";

  // --- [3. 상태 관리] ---
  const [hasMounted, setHasMounted] = useState(false);
  const [tab, setTab] = useState<'ROOKIE' | 'PIONEER'>('PIONEER');
  const [viewMode, setViewMode] = useState<'HUB' | 'BOARD'>('HUB'); 
  const [category, setCategory] = useState('ALL');
  
  // 데이터 상태
  const [beomToken, setBeomToken] = useState(8791.88); 
  const [assets, setAssets] = useState<Asset[]>([]);
  const [userTerritories, setUserTerritories] = useState<Territory[]>([]);
  
  // QR 관련 상태
  const [qrType, setQrType] = useState<'PERSONAL' | 'BUSINESS'>('PERSONAL');
  const [isQrActive, setIsQrActive] = useState(false);
  const [businessName, setBusinessName] = useState('해태건축사');
  const [businessID, setBusinessID] = useState('HT-0001');

  // 입력 폼 상태
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [isAdRequest, setIsAdRequest] = useState(false);
  const [createRoomTitle, setCreateRoomTitle] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // 초기 데이터 및 로직
  const defaultTerritories = ['MUSIC', 'SPORTS', 'ANIME', 'DRAMA', 'MOVIE', 'ESPORTS', 'COMEDY'];
  const ecosystemApps = ['Pi Network', 'Nexus AI', 'Kedheon AI', 'Pi Vendor', 'Pi Civil', 'Pi FactFilter', 'PiPapa', 'Pi 6G Network'];

  useEffect(() => {
    setHasMounted(true);
    const savedAssets = localStorage.getItem('k_assets');
    const savedRooms = localStorage.getItem('k_rooms');
    const savedToken = localStorage.getItem('k_token');
    if (savedAssets) setAssets(JSON.parse(savedAssets));
    if (savedRooms) setUserTerritories(JSON.parse(savedRooms));
    if (savedToken) setBeomToken(parseFloat(savedToken));
  }, []);

  useEffect(() => {
    if (hasMounted) {
      localStorage.setItem('k_token', beomToken.toString());
      localStorage.setItem('k_assets', JSON.stringify(assets));
      localStorage.setItem('k_rooms', JSON.stringify(userTerritories));
    }
  }, [beomToken, assets, userTerritories, hasMounted]);

  if (!hasMounted) return null;

  // --- [비즈니스 로직 함수] ---
  const handleCreateTerritory = () => {
    if (beomToken < TERRITORY_CREATE_COST) return alert("잔액 부족");
    const newRoom = { id: createRoomTitle.toUpperCase(), title: createRoomTitle.toUpperCase(), desc: "", creator: empireCharacterName };
    setUserTerritories([...userTerritories, newRoom]);
    setBeomToken(prev => prev - TERRITORY_CREATE_COST);
    setShowCreateModal(false); setCreateRoomTitle('');
  };

  const purchaseQR = () => {
    if (beomToken < QR_PURCHASE_COST) return alert("잔액 부족");
    setBeomToken(prev => prev - QR_PURCHASE_COST);
    setIsQrActive(true);
  };

  const registerAsset = () => {
    const cost = isAdRequest ? AD_REG_COST : 10;
    if (beomToken < cost) return alert("잔액 부족");
    const newAsset: Asset = { 
      id: Date.now(), title: newTitle, desc: newDesc, category, videoUrl: newVideoUrl, 
      beomSupport: 0, isAd: isAdRequest, owner: empireCharacterName, timestamp: new Date().toLocaleDateString() 
    };
    setAssets([newAsset, ...assets]);
    setBeomToken(prev => prev - cost);
    setNewTitle(''); setNewDesc(''); setNewVideoUrl('');
  };

  return (
    <div className="flex flex-col items-center bg-black min-h-screen text-white p-6 font-sans w-full overflow-x-hidden">
      
      {/* 탭 네비게이션 */}
      <div className="flex gap-6 mb-16 mt-10 justify-center w-full max-w-2xl">
        <button onClick={() => {setTab('ROOKIE'); setViewMode('HUB');}} className={`px-12 py-5 rounded-2xl font-black text-xl transition-all ${tab === 'ROOKIE' ? 'bg-[#daa520] text-black shadow-lg' : 'bg-[#111] text-gray-500'}`}>ROOKIE</button>
        <button onClick={() => {setTab('PIONEER'); setViewMode('HUB');}} className={`px-12 py-5 rounded-2xl font-black text-xl transition-all ${tab === 'PIONEER' && viewMode === 'HUB' ? 'bg-[#daa520] text-black shadow-lg' : 'bg-[#111] text-gray-500'}`}>PIONEER</button>
      </div>

      <div className="w-full max-w-6xl">
        {tab === 'ROOKIE' ? (
          <div className="flex flex-col items-center text-center py-20 animate-in fade-in duration-500">
            <img src={mainCharacter} className="w-80 h-80 rounded-[60px] object-cover mb-12 shadow-2xl border-4 border-[#daa520]/20" alt="K" />
            <h1 className="text-7xl font-black text-[#daa520] tracking-widest mb-8 uppercase">Kedheon Empire</h1>
            <button onClick={() => setTab('PIONEER')} className="bg-[#daa520] text-black px-24 py-10 rounded-3xl font-black text-3xl shadow-xl hover:scale-105 transition-transform">제국 입국하기</button>
          </div>
        ) : (
          <div className="flex flex-col gap-16 animate-in slide-in-from-bottom-10 duration-700">
            
            {viewMode === 'HUB' ? (
              <>
                {/* 1. 대시보드 (범 토큰 정렬) */}
                <div className="bg-[#111] p-12 rounded-[60px] border border-[#daa520]/40 shadow-2xl flex justify-between items-center group">
                  <div className="relative z-10 text-left">
                    <h3 className="text-gray-500 text-xs uppercase tracking-[0.4em] mb-4 font-black opacity-60">Imperial Balance</h3>
                    <p className="text-[#daa520] font-black text-7xl leading-none tracking-tighter">{beomToken.toLocaleString()} BEOM</p>
                    <div className="mt-12 bg-black/60 px-8 py-4 rounded-2xl border border-white/10 w-fit backdrop-blur-md">
                       <span className="text-gray-200 text-xl font-mono font-bold tracking-tight">≈ {(beomToken / PI_TO_BEOM_RATE).toFixed(4)} Pi</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end relative z-10"> 
                    <div className="w-48 h-48 rounded-full overflow-hidden border-8 border-[#daa520]/50 shadow-[0_0_50px_rgba(218,165,32,0.6)] mb-8 bg-black">
                       <img src={beomTokenImg} className="w-full h-full object-cover scale-110" alt="Coin" />
                    </div>
                    <div className="text-right">
                        <p className="text-white font-black text-7xl leading-none tracking-tighter">Lv. 88</p>
                        <p className="text-base text-[#daa520] uppercase mt-4 font-black tracking-[0.5em]">Empire Grade</p>
                    </div>
                  </div>
                </div>

                {/* 2. 영토 선택 및 자치령 생성 */}
                <div className="p-16 bg-[#111] rounded-[60px] border border-white/5 text-center">
                  <SectionTitle title="Imperial Fandom Territory" desc="제국의 영토 혹은 시민들이 개척한 자치령 팬방에 진입하십시오." />
                  <div className="flex flex-wrap gap-5 justify-center mb-12">
                    <button onClick={() => {setCategory('ALL'); setViewMode('BOARD');}} className="px-12 py-6 rounded-3xl text-sm font-black bg-[#daa520] text-black shadow-lg">ENTER ALL FEED</button>
                    {defaultTerritories.map(cat => (
                      <button key={cat} onClick={() => {setCategory(cat); setViewMode('BOARD');}} className="px-12 py-6 rounded-3xl text-sm font-black bg-[#1a1a1a] text-gray-500 border border-white/5 hover:border-[#daa520]/40 transition-all font-bold">ENTER {cat}</button>
                    ))}
                    {userTerritories.map(room => (
                      <button key={room.id} onClick={() => {setCategory(room.id); setViewMode('BOARD');}} className="px-12 py-6 rounded-3xl text-sm font-black bg-gradient-to-r from-[#daa520]/20 to-[#1a1a1a] text-[#daa520] border border-[#daa520]/30 shadow-xl font-bold">👑 {room.title}</button>
                    ))}
                  </div>
                  <button onClick={() => setShowCreateModal(true)} className="bg-white/5 text-white px-10 py-5 rounded-full border border-white/10 font-black hover:bg-white/10 transition-all">➕ 새로운 팬방 개척하기 (500 BEOM)</button>
                </div>

                {/* 3. 복구된 QR 시스템 */}
                <div className="bg-[#111] p-16 rounded-[60px] border border-[#daa520]/20 text-center relative overflow-hidden">
                  <div className="absolute top-8 right-12 text-sm text-gray-600 font-mono font-bold tracking-[0.2em]">FEE: 50 BEOM</div>
                  <SectionTitle title="Imperial Auth QR System" desc="제국 공식 신분 인증 및 결제용 QR을 활성화합니다." />
                  <div className="flex gap-4 justify-center mb-14">
                    <button onClick={() => {setQrType('PERSONAL'); setIsQrActive(false);}} className={`px-12 py-5 rounded-2xl text-sm font-black transition-all ${qrType === 'PERSONAL' ? 'bg-[#daa520] text-black shadow-lg' : 'bg-[#1a1a1a] text-gray-500'}`}>PERSONAL AUTH</button>
                    <button onClick={() => {setQrType('BUSINESS'); setIsQrActive(false);}} className={`px-12 py-5 rounded-2xl text-sm font-black transition-all ${qrType === 'BUSINESS' ? 'bg-[#daa520] text-black shadow-lg' : 'bg-[#1a1a1a] text-gray-500'}`}>BUSINESS AUTH</button>
                  </div>
                  <div className="relative w-full max-w-[650px] mx-auto aspect-[1.8/1] rounded-[50px] border border-white/10 overflow-hidden shadow-2xl group mb-10">
                    <img src={qrType === 'PERSONAL' ? personalQrImg : businessQrImg} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="QR" />
                    <div className={`absolute inset-0 flex flex-col items-center justify-center p-12 transition-all ${isQrActive ? 'bg-transparent' : 'bg-black/95 backdrop-blur-3xl'}`}>
                      {isQrActive ? (
                        <div className="bg-white p-6 rounded-[50px] shadow-2xl border-8 border-[#daa520]/30 animate-in zoom-in-50">
                          <img src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(empireUrl + '/?id=' + (qrType === 'BUSINESS' ? businessID : empireCharacterName))}`} className="w-40 h-40" alt="QR" />
                        </div>
                      ) : (
                        <button onClick={purchaseQR} className="bg-[#daa520] text-black px-20 py-8 rounded-3xl font-black text-2xl shadow-xl hover:scale-105 active:scale-95 transition-all">QR 확보하기</button>
                      )}
                    </div>
                  </div>
                  {qrType === 'BUSINESS' && (
                    <div className="flex flex-col gap-5 max-w-md mx-auto animate-in slide-in-from-top-6">
                      <input type="text" value={businessName} onChange={(e) => {setBusinessName(e.target.value); setIsQrActive(false);}} placeholder="기업 명칭" className="bg-black/60 border border-white/10 p-6 rounded-3xl text-xl focus:border-[#daa520] outline-none text-center font-black" />
                      <input type="text" value={businessID} onChange={(e) => {setBusinessID(e.target.value); setIsQrActive(false);}} placeholder="고유 식별 ID" className="bg-black/60 border border-white/10 p-6 rounded-3xl text-xl focus:border-[#daa520] outline-none text-center font-mono text-[#daa520]" />
                    </div>
                  )}
                </div>

                {/* 4. 에코시스템 허브 */}
                <div className="bg-[#111] p-16 rounded-[60px] border border-white/5">
                  <SectionTitle title="🌐 Ecosystem Infrastructure Hub" desc="제국의 8대 핵심 시스템 가동 상태를 확인하십시오." />
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {ecosystemApps.map(app => (
                      <button key={app} className="h-40 bg-[#1a1a1a] rounded-[50px] border border-white/5 flex flex-col items-center justify-center p-8 hover:bg-[#daa520] hover:text-black transition-all font-black text-sm text-[#daa520] text-center shadow-xl">{app}</button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              /* --- [BOARD VIEW] --- */
              <div className="flex flex-col gap-12 animate-in fade-in duration-500">
                <div className="flex justify-between items-center bg-[#111] p-10 rounded-[40px] border border-white/5">
                  <button onClick={() => setViewMode('HUB')} className="bg-[#1a1a1a] text-[#daa520] px-12 py-5 rounded-2xl font-black border border-[#daa520]/40 hover:bg-[#daa520] hover:text-black transition-all">← BACK TO HUB</button>
                  <p className="text-white font-black text-5xl uppercase tracking-tighter">{category}</p>
                </div>
                <div className="bg-[#111] p-16 rounded-[60px] border border-white/10">
                  <SectionTitle title={`${category} BROADCAST`} desc="영상을 박제하여 시민들의 BEOM 호응을 이끌어내십시오." />
                  <div className="flex flex-col gap-6 max-w-4xl mx-auto text-left">
                    <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="제목 (Headline)" className="bg-black p-8 rounded-[35px] border border-white/10 text-2xl focus:border-[#daa520] outline-none font-black" />
                    <input type="text" value={newVideoUrl} onChange={(e) => setNewVideoUrl(e.target.value)} placeholder="YouTube URL" className="bg-black p-8 rounded-[35px] border border-white/10 text-xl focus:border-[#daa520] outline-none font-mono text-[#daa520]" />
                    <textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="내용 설명" className="bg-black p-8 rounded-[35px] border border-white/10 text-xl h-56 outline-none focus:border-[#daa520] resize-none" />
                    <button onClick={registerAsset} className="w-full py-10 rounded-[50px] font-black text-3xl bg-gradient-to-br from-[#daa520] to-[#b8860b] text-black shadow-2xl transition-all uppercase tracking-widest">Broadcast to Feed</button>
                  </div>
                </div>
                <div className="space-y-16">
                  {assets.filter(a => category === 'ALL' || a.category === category).map((a) => (
                    <div key={a.id} className="p-12 rounded-[70px] bg-[#111] border-l-[24px] border-gray-800 shadow-xl text-left">
                      <div className="flex justify-between items-start mb-10">
                        <h4 className="font-black text-white text-5xl tracking-tight leading-tight">{a.title}</h4>
                        <span className="text-gray-600 text-base font-mono font-black">{a.timestamp}</span>
                      </div>
                      {a.videoUrl && (
                        <div className="relative w-full aspect-video rounded-[50px] overflow-hidden mb-10 border-8 border-white/5 bg-black">
                           <iframe className="absolute inset-0 w-full h-full" src={`https://www.youtube.com/embed/${a.videoUrl.split('v=')[1]}`} frameBorder="0" allowFullScreen></iframe>
                        </div>
                      )}
                      <p className="text-2xl text-gray-400 leading-relaxed mb-12 pl-4">{a.desc}</p>
                      <div className="flex justify-between items-center pt-10 border-t border-white/5">
                        <button onClick={() => setBeomToken(beomToken - 100)} className="bg-[#daa520] text-black px-12 py-5 rounded-3xl font-black text-xl">👑 황금 찬양 (100 BEOM)</button>
                        <p className="text-[#daa520] font-black text-4xl">{a.beomSupport.toLocaleString()} BEOM</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 영토 개척 모달 */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-6 text-center">
          <div className="bg-[#111] p-12 rounded-[50px] border border-[#daa520]/50 w-full max-w-2xl">
            <SectionTitle title="Expand Territory" desc="새로운 팬덤 영토를 선포하십시오." />
            <input type="text" value={createRoomTitle} onChange={(e) => setCreateRoomTitle(e.target.value)} placeholder="영토 명칭" className="bg-black p-6 rounded-3xl border border-white/10 w-full text-xl focus:border-[#daa520] outline-none font-black text-center mb-8" />
            <div className="flex gap-4">
              <button onClick={() => setShowCreateModal(false)} className="flex-1 py-6 rounded-3xl font-black bg-white/5">취소</button>
              <button onClick={handleCreateTerritory} className="flex-1 py-6 rounded-3xl font-black bg-[#daa520] text-black">선포 (500 BEOM)</button>
            </div>
          </div>
        </div>
      )}
      
      <div className="text-center py-40 opacity-10"><p className="text-sm font-mono tracking-[1.5em] uppercase text-white/50">Kedheon Empire | 88-Threads Engine Verified</p></div>
    </div>
  );
}
