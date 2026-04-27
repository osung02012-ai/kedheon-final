'use client';
import React, { useState, useEffect } from 'react';

// [제국 데이터 모델]
interface Asset { 
  id: number; title: string; desc: string; category: string; 
  isAd: boolean; owner: string; timestamp: string; 
}

export default function KedheonPortal() {
  // --- [1. 제국 핵심 환경 설정] ---
  const PI_TO_BEOM_RATE = 314.1592; 
  const QR_PURCHASE_COST = 50;      
  const ASSET_REG_COST = 10;        
  const AD_REG_COST = 500;          
  const empireCharacterName = 'CHEOREOM_88';
  const empireUrl = "https://kedheon.com";

  // --- [2. 주군 하사 공식 이미지 에셋] ---
  const mainCharacter = "/kedheon-character.png"; 
  const beomTokenImg = "/beom-token.png";
  const businessQrImg = "/qr-business.png";
  const personalQrImg = "/qr-personal.png";

  // --- [3. 제어 상태 관리] ---
  const [tab, setTab] = useState<'ROOKIE' | 'PIONEER'>('PIONEER');
  const [viewMode, setViewMode] = useState<'HUB' | 'BOARD'>('HUB'); 
  const [category, setCategory] = useState('ALL');
  const [qrType, setQrType] = useState<'PERSONAL' | 'BUSINESS'>('PERSONAL');
  const [businessName, setBusinessName] = useState('해태건축사');
  const [businessID, setBusinessID] = useState('HT-0001');
  
  const [assets, setAssets] = useState<Asset[]>([]);
  const [beomToken, setBeomToken] = useState(8791.88); 
  const [isQrActive, setIsQrActive] = useState(false);
  const [fanLevel, setFanLevel] = useState(88);
  
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [isAdRequest, setIsAdRequest] = useState(false);

  // --- [4. 8대 앱 공식 풀 네임] ---
  const categories = ['MUSIC', 'SPORTS', 'ANIME', 'DRAMA', 'MOVIE', 'ESPORTS', 'COMEDY'];
  const ecosystemFullApps = [
    'Pi Network', 'Nexus AI', 'Kedheon AI', 'Pi Vendor', 
    'Pi Civil', 'Pi FactFilter', 'PiPapa', 'Pi 6G Network'
  ];

  // 데이터 동기화
  useEffect(() => {
    const savedAssets = localStorage.getItem('kedheon_assets');
    if (savedAssets) setAssets(JSON.parse(savedAssets));
    const savedToken = localStorage.getItem('kedheon_token');
    if (savedToken) setBeomToken(parseFloat(savedToken));
  }, []);

  useEffect(() => {
    localStorage.setItem('kedheon_token', beomToken.toString());
  }, [beomToken]);

  // --- [5. 핵심 로직] ---
  const enterTerritory = (cat: string) => {
    setCategory(cat);
    setViewMode('BOARD');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleHubClick = (app: string) => {
    setBeomToken(prev => prev + 1);
    alert(`[${app}] 활동 보상 +1 BEOM 확보!`);
  };

  const registerAsset = () => {
    const cost = isAdRequest ? AD_REG_COST : ASSET_REG_COST;
    if (!newTitle.trim() || beomToken < cost) return alert("등록 불가");
    const newAsset: Asset = { 
      id: Date.now(), title: newTitle, desc: newDesc, category: category, 
      isAd: isAdRequest, owner: empireCharacterName, timestamp: new Date().toLocaleDateString() 
    };
    const updated = [newAsset, ...assets];
    setAssets(updated);
    localStorage.setItem('kedheon_assets', JSON.stringify(updated));
    setBeomToken(prev => prev - cost);
    setNewTitle(''); setNewDesc(''); setIsAdRequest(false);
  };

  // --- [6. 주군 맞춤 섹션 타이틀 (크기 2배 확장)] ---
  const SectionTitle = ({ title, desc }: { title: string; desc: string }) => (
    <div className="flex flex-col items-center mb-12 gap-4">
      <div className="flex items-center gap-6">
        <span className="text-5xl animate-pulse">🌐</span>
        <h3 className="text-[#daa520] font-black text-4xl tracking-[0.2em] uppercase leading-tight">
          {title}
        </h3>
      </div>
      <p className="text-gray-400 font-bold text-xl tracking-wide opacity-80">
        {desc}
      </p>
    </div>
  );

  return (
    <div className="flex flex-col items-center bg-black min-h-screen text-white p-6 font-sans w-full overflow-x-hidden">
      
      {/* 상단 탭 네비게이션 */}
      <div className="flex gap-4 mb-16 mt-10 justify-center w-full max-w-2xl">
        <button onClick={() => {setTab('ROOKIE'); setViewMode('HUB');}} className={`px-12 py-4 rounded-2xl font-black text-lg transition-all ${tab === 'ROOKIE' ? 'bg-[#daa520] text-black shadow-lg shadow-[#daa520]/20' : 'bg-[#111] text-gray-500 hover:text-white'}`}>ROOKIE</button>
        <button onClick={() => {setTab('PIONEER'); setViewMode('HUB');}} className={`px-12 py-4 rounded-2xl font-black text-lg transition-all ${tab === 'PIONEER' ? 'bg-[#daa520] text-black shadow-[0_0_30px_rgba(218,165,32,0.6)]' : 'bg-[#111] text-gray-500 hover:text-white'}`}>PIONEER</button>
      </div>

      <div className="w-full max-w-5xl">
        {tab === 'ROOKIE' ? (
          /* [ROOKIE VIEW] */
          <div className="flex flex-col items-center text-center py-20 animate-in fade-in zoom-in duration-500">
            <img src={mainCharacter} className="w-80 h-80 rounded-[50px] object-cover mb-10 shadow-2xl border-4 border-[#daa520]/20" alt="Kedheon Mascot" />
            <h1 className="text-6xl font-black text-[#daa520] tracking-widest mb-6">KEDHEON EMPIRE</h1>
            <button onClick={() => setTab('PIONEER')} className="bg-[#daa520] text-black px-20 py-8 rounded-3xl font-black text-2xl shadow-xl hover:scale-105 transition-transform">제국 입국하기</button>
          </div>
        ) : (
          /* [PIONEER VIEW] */
          <div className="flex flex-col gap-14 animate-in slide-in-from-bottom-10 duration-700">
            
            {viewMode === 'HUB' ? (
              <>
                {/* 1. 경제 대시보드 (범 토큰 정렬 및 보정) */}
                <div className="bg-[#111] p-12 rounded-[60px] border border-[#daa520]/40 shadow-2xl flex justify-between items-center relative overflow-hidden group">
                  <div className="relative z-10">
                    <h3 className="text-gray-500 text-xs uppercase tracking-[0.3em] mb-4 font-black opacity-60">Imperial Asset Balance</h3>
                    <p className="text-[#daa520] font-black text-6xl leading-none tracking-tighter">{beomToken.toLocaleString(undefined, { minimumFractionDigits: 2 })} BEOM</p>
                    <div className="mt-10 bg-black/60 px-8 py-4 rounded-2xl border border-white/10 w-fit backdrop-blur-md flex items-center gap-4">
                       <span className="text-gray-300 text-xl font-mono font-bold">≈ {(beomToken / PI_TO_BEOM_RATE).toFixed(4)} Pi</span>
                       <span className="text-[#daa520] text-xs font-black opacity-50 underline decoration-[#daa520]">1 Pi : {PI_TO_BEOM_RATE}</span>
                    </div>
                  </div>

                  {/* 범 토큰 보정: 원형 크롭 및 선명화 */}
                  <div className="flex flex-col items-end relative z-10"> 
                    <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-[#daa520] shadow-[0_0_35px_rgba(218,165,32,0.6)] mb-6 bg-black flex items-center justify-center">
                       <img src={beomTokenImg} className="w-full h-full object-cover scale-110" alt="Beom Token" />
                    </div>
                    <div className="text-right">
                        <p className="text-white font-black text-6xl leading-none tracking-tight">Lv. {fanLevel}</p>
                        <p className="text-sm text-[#daa520] uppercase mt-4 font-black tracking-[0.4em]">Empire Grade</p>
                    </div>
                  </div>
                </div>

                {/* 2. 팬덤 영토 선택 (게시판 진입) */}
                <div className="p-12 bg-[#111] rounded-[60px] border border-white/5 text-center">
                  <SectionTitle title="Imperial Fandom Territory" desc="활동 중인 팬덤 영토를 선택하여 실시간 게시판으로 진입하십시오." />
                  <div className="flex flex-wrap gap-4 justify-center">
                    <button onClick={() => {setCategory('ALL'); setViewMode('BOARD');}} className="px-10 py-5 rounded-3xl text-sm font-black bg-[#daa520] text-black shadow-lg hover:scale-105 transition-all">ENTER ALL FEED</button>
                    {categories.map((cat) => (
                      <button key={cat} onClick={() => enterTerritory(cat)} className="px-10 py-5 rounded-3xl text-sm font-black bg-[#1a1a1a] text-gray-500 border border-white/5 hover:text-[#daa520] hover:border-[#daa520]/40 transition-all">ENTER {cat}</button>
                    ))}
                  </div>
                </div>

                {/* 3. QR 시스템 (입력필드 포함) */}
                <div className="bg-[#111] p-12 rounded-[60px] border border-[#daa520]/20 text-center relative overflow-hidden">
                  <div className="absolute top-6 right-12 text-sm text-gray-600 font-mono font-bold">FEE: {QR_PURCHASE_COST} BEOM</div>
                  <SectionTitle title="Imperial Auth QR System" desc="제국 공식 신분 인증 및 결제용 QR을 활성화합니다." />
                  
                  <div className="flex gap-4 justify-center mb-12">
                    <button onClick={() => {setQrType('PERSONAL'); setIsQrActive(false);}} className={`px-12 py-5 rounded-2xl text-sm font-black transition-all ${qrType === 'PERSONAL' ? 'bg-[#daa520] text-black shadow-lg' : 'bg-[#1a1a1a] text-gray-500'}`}>PERSONAL AUTH</button>
                    <button onClick={() => {setQrType('BUSINESS'); setIsQrActive(false);}} className={`px-12 py-5 rounded-2xl text-sm font-black transition-all ${qrType === 'BUSINESS' ? 'bg-[#daa520] text-black shadow-lg' : 'bg-[#1a1a1a] text-gray-500'}`}>BUSINESS AUTH</button>
                  </div>

                  <div className="relative w-full max-w-[600px] mx-auto aspect-[1.8/1] rounded-[50px] border border-white/10 overflow-hidden shadow-2xl group">
                    <img src={qrType === 'PERSONAL' ? personalQrImg : businessQrImg} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="QR Background" />
                    <div className={`absolute inset-0 flex flex-col items-center justify-center p-10 transition-all duration-700 ${isQrActive ? 'bg-transparent' : 'bg-black/95 backdrop-blur-3xl'}`}>
                      {isQrActive ? (
                        <div className="bg-white p-5 rounded-[40px] shadow-2xl animate-in zoom-in-50 border-8 border-[#daa520]/30">
                          <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(empireUrl + '/?id=' + (qrType === 'BUSINESS' ? businessID : empireCharacterName))}`} className="w-40 h-40" alt="QR Code" />
                        </div>
                      ) : (
                        <button onClick={purchaseQR} className="bg-[#daa520] text-black px-16 py-7 rounded-3xl font-black text-xl shadow-xl hover:scale-105 active:scale-95 transition-all">QR 확보하기 (50 BEOM)</button>
                      )}
                    </div>
                  </div>

                  {qrType === 'BUSINESS' && (
                    <div className="mt-12 flex flex-col gap-5 max-w-sm mx-auto animate-in slide-in-from-top-4">
                      <input type="text" value={businessName} onChange={(e) => {setBusinessName(e.target.value); setIsQrActive(false);}} placeholder="기업/브랜드 명칭" className="bg-black/60 border border-white/10 p-6 rounded-3xl text-lg focus:border-[#daa520] outline-none text-center font-black backdrop-blur-md" />
                      <input type="text" value={businessID} onChange={(e) => {setBusinessID(e.target.value); setIsQrActive(false);}} placeholder="고유 식별 ID" className="bg-black/60 border border-white/10 p-6 rounded-3xl text-lg focus:border-[#daa520] outline-none text-center font-mono backdrop-blur-md" />
                    </div>
                  )}
                </div>

                {/* 4. Ecosystem Infrastructure Hub */}
                <div className="bg-[#111] p-12 rounded-[60px] border border-white/5">
                  <SectionTitle title="Ecosystem Infrastructure Hub" desc="제국의 8대 핵심 시스템 가동 상태를 확인하십시오." />
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                    {ecosystemFullApps.map(app => (
                      <button key={app} onClick={() => handleHubClick(app)} className="h-36 bg-[#1a1a1a] rounded-[40px] border border-white/5 flex flex-col items-center justify-center p-6 hover:bg-[#daa520] hover:text-black transition-all group active:scale-95 shadow-xl">
                        <span className="text-[12px] font-black text-[#daa520] group-hover:text-black text-center leading-tight break-words">{app}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              /* BOARD VIEW: 영토별 게시판 전용 화면 */
              <div className="flex flex-col gap-10 animate-in fade-in duration-500">
                <div className="flex justify-between items-center bg-[#111] p-8 rounded-[40px] border border-white/5">
                  <button onClick={() => setViewMode('HUB')} className="bg-[#1a1a1a] text-[#daa520] px-10 py-4 rounded-2xl font-black border border-[#daa520]/30 hover:bg-[#daa520] hover:text-black transition-all text-sm tracking-widest">← BACK TO HUB</button>
                  <div className="text-right">
                    <p className="text-[#daa520] font-black text-sm uppercase tracking-[0.4em] opacity-60">Connected Territory</p>
                    <p className="text-white font-black text-4xl uppercase tracking-tighter">{category}</p>
                  </div>
                </div>

                <div className="bg-[#111] p-16 rounded-[60px] border-b-8 border-[#daa520] shadow-inner text-center">
                  <SectionTitle title={`${category} TERRITORY BOARD`} desc={`[${category}] 영토에 확보된 시민들의 실시간 통신망입니다.`} />
                </div>

                <div className="bg-[#111] p-12 rounded-[60px] border border-white/5">
                  <h4 className="text-[#daa520] font-black text-xl mb-8 flex items-center gap-4 px-2">
                    <span className="text-3xl">✍️</span> NEW BROADCAST TO {category}
                  </h4>
                  <div className="flex flex-col gap-6">
                    <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="제목 (Headline)" className="bg-black p-6 rounded-3xl border border-white/10 text-lg focus:border-[#daa520] outline-none font-bold" />
                    <textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="내용을 박제하십시오 (Broadcast message...)" className="bg-black p-6 rounded-3xl border border-white/10 text-lg h-48 outline-none focus:border-[#daa520] resize-none" />
                    <div className="flex justify-between items-center bg-black/60 p-8 rounded-[40px] border border-[#daa520]/20 backdrop-blur-md">
                      <div className="flex flex-col"><span className="text-sm font-black text-[#daa520] uppercase tracking-widest">OFFICIAL AD ENFORCEMENT</span><span className="text-xs text-gray-500 mt-2 font-bold opacity-70">500 BEOM | TOP FEED PLACEMENT</span></div>
                      <input type="checkbox" checked={isAdRequest} onChange={(e) => setIsAdRequest(e.target.checked)} className="w-10 h-10 accent-[#daa520] cursor-pointer" />
                    </div>
                    <button onClick={registerAsset} className="w-full py-8 rounded-[40px] font-black text-2xl bg-gradient-to-br from-[#daa520] to-[#b8860b] text-black shadow-2xl hover:scale-[1.01] transition-all">POST TO {category} FEED</button>
                  </div>
                </div>

                <div className="mt-10 space-y-8">
                  {assets.filter(a => category === 'ALL' || a.category === category).map((a) => (
                    <div key={a.id} className={`p-10 rounded-[50px] border-l-[16px] transition-all duration-500 ${a.isAd ? 'bg-[#daa520]/10 border-[#daa520] shadow-2xl' : 'bg-white/5 border-gray-800'}`}>
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-6">
                          {a.isAd && <span className="bg-[#daa520] text-black text-[12px] px-4 py-1.5 rounded-full font-black tracking-tighter shadow-lg">AD</span>}
                          <span className="font-black text-white text-3xl tracking-tight leading-tight">{a.title}</span>
                        </div>
                        <span className="text-gray-600 text-sm font-mono font-black tracking-[0.2em]">{a.timestamp}</span>
                      </div>
                      <p className="text-xl text-gray-400 leading-relaxed font-medium mb-8 pl-2">{a.desc}</p>
                      <div className="flex justify-between items-center pt-8 border-t border-white/5">
                        <span className="text-[#daa520] text-sm font-black uppercase tracking-widest bg-[#daa520]/10 px-6 py-2 rounded-2xl border border-[#daa520]/20"># {a.category}</span>
                        <span className="text-sm text-gray-600 italic font-bold opacity-60">Citizen Secure ID: {a.owner}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="text-center py-32 opacity-20">
               <div className="w-32 h-1.5 bg-[#daa520] mx-auto mb-10 rounded-full"></div>
               <p className="text-xs font-mono tracking-[1em] uppercase leading-loose text-white/50">Kedheon Empire | 88-Threads Engine Verified</p>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
