'use client';
import React, { useState, useEffect } from 'react';

/**
 * [제국 데이터 모델]
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

  // --- [4. 카테고리 및 8대 앱 공식 풀 네임] ---
  const categories = ['ALL', 'MUSIC', 'SPORTS', 'ANIME', 'DRAMA', 'MOVIE', 'ESPORTS', 'COMEDY'];
  const ecosystemFullApps = [
    'Pi Network', 'Nexus AI', 'Kedheon AI', 'Pi Vendor', 
    'Pi Civil', 'Pi FactFilter', 'PiPapa', 'Pi 6G Network'
  ];

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
    alert(`[${app}] 활동 보상 +1 BEOM 확보!`);
  };

  const purchaseQR = () => {
    if (beomToken < QR_PURCHASE_COST) return alert("범 토큰 잔액 부족");
    if (confirm("BEOM 토큰으로 제국 인증 QR을 확보하시겠습니까?")) {
      setBeomToken(prev => prev - QR_PURCHASE_COST);
      setIsQrActive(true);
    }
  };

  const registerAsset = () => {
    const cost = isAdRequest ? AD_REG_COST : ASSET_REG_COST;
    if (!newTitle.trim() || beomToken < cost) return alert("등록 불가");
    const newAsset: Asset = { 
      id: Date.now(), title: newTitle, desc: newDesc,
      category: category === 'ALL' ? 'GENERAL' : category, 
      isAd: isAdRequest, owner: empireCharacterName, 
      timestamp: new Date().toLocaleDateString() 
    };
    setAssets([newAsset, ...assets]);
    setBeomToken(prev => prev - cost);
    setNewTitle(''); setNewDesc(''); setIsAdRequest(false);
  };

  // --- [5. 주군 맞춤형 섹션 타이틀 컴포넌트 (크기 및 아이콘 반영)] ---
  // 타이틀 크기(text-3xl)와 설명 크기(text-lg)의 황금 비율 적용
  const SectionTitle = ({ title, desc }: { title: string; desc: string }) => (
    <div className="flex flex-col items-center mb-10 gap-2">
      <div className="flex items-center gap-4">
        <span className="text-4xl animate-pulse">🌐</span>
        <h3 className="text-[#daa520] font-black text-3xl tracking-[0.2em] uppercase leading-tight">
          {title}
        </h3>
      </div>
      <p className="text-gray-400 font-bold text-lg tracking-wide opacity-80">
        {desc}
      </p>
    </div>
  );

  return (
    <div className="flex flex-col items-center bg-black min-h-screen text-white p-6 font-sans w-full overflow-x-hidden">
      
      {/* 상단 네비게이션 */}
      <div className="flex gap-4 mb-14 mt-10 justify-center w-full max-w-2xl">
        <button onClick={() => setTab('ROOKIE')} className={`px-10 py-3 rounded-2xl font-black transition-all ${tab === 'ROOKIE' ? 'bg-[#daa520] text-black shadow-lg' : 'bg-[#111] text-gray-500 hover:text-white'}`}>ROOKIE</button>
        <button onClick={() => setTab('PIONEER')} className={`px-10 py-3 rounded-2xl font-black transition-all ${tab === 'PIONEER' ? 'bg-[#daa520] text-black shadow-[0_0_20px_rgba(218,165,32,0.6)]' : 'bg-[#111] text-gray-500 hover:text-white'}`}>PIONEER</button>
      </div>

      <div className="w-full max-w-5xl">
        {tab === 'ROOKIE' ? (
          <div className="flex flex-col items-center text-center py-20 animate-in fade-in duration-500">
            <img src={mainCharacter} className="w-80 h-80 rounded-[50px] object-cover mb-10 shadow-2xl border-4 border-[#daa520]/20" alt="Kedheon" />
            <h1 className="text-5xl font-black text-[#daa520] tracking-widest mb-6">KEDHEON EMPIRE</h1>
            <button onClick={() => setTab('PIONEER')} className="bg-[#daa520] text-black px-16 py-6 rounded-3xl font-black text-xl shadow-xl hover:scale-105 transition-transform">제국 입국하기</button>
          </div>
        ) : (
          <div className="flex flex-col gap-12 animate-in slide-in-from-bottom-10 duration-700">
            
            {/* 1. 경제 대시보드 */}
            <div className="bg-[#111] p-10 rounded-[50px] border border-[#daa520]/40 shadow-2xl relative overflow-hidden group">
              <SectionTitle title="Imperial Asset Balance" desc="제국의 범 토큰 및 파이 자산 현황을 관리합니다." />
              <div className="flex justify-between items-end mt-4">
                <div className="relative z-10">
                  <p className="text-[#daa520] font-black text-6xl leading-none tracking-tighter">{beomToken.toLocaleString(undefined, { minimumFractionDigits: 2 })} BEOM</p>
                  <div className="mt-8 bg-black/60 px-6 py-3 rounded-2xl border border-white/10 w-fit backdrop-blur-md flex items-center gap-4">
                     <span className="text-gray-300 text-lg font-mono font-bold">≈ {(beomToken / PI_TO_BEOM_RATE).toFixed(4)} Pi</span>
                     <span className="text-[#daa520] text-[10px] font-black opacity-50 underline">RATE 1:{PI_TO_BEOM_RATE}</span>
                  </div>
                </div>

                <div className="flex flex-col items-end relative z-10"> 
                  <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-[#daa520] shadow-[0_0_30px_rgba(218,165,32,0.5)] mb-4 bg-black">
                     <img src={beomTokenImg} className="w-full h-full object-cover scale-110" alt="Beom Token" />
                  </div>
                  <div className="text-right">
                      <p className="text-white font-black text-5xl leading-none">Lv. {fanLevel}</p>
                      <p className="text-sm text-[#daa520] uppercase mt-3 font-black tracking-widest">Empire Grade</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. 콘텐츠 및 팬덤 카테고리 (수정 반영) */}
            <div className="p-10 bg-[#111] rounded-[50px] border border-white/5 text-center">
              <SectionTitle title="Imperial Fandom Territory" desc="활동하고 계신 소속 팬덤 영토를 선택하십시오." />
              <div className="flex flex-wrap gap-3 justify-center">
                {categories.map((cat) => (
                  <button key={cat} onClick={() => setCategory(cat)} className={`px-8 py-3.5 rounded-2xl text-xs font-black transition-all ${category === cat ? 'bg-[#daa520] text-black shadow-lg scale-110' : 'bg-[#1a1a1a] text-gray-500 hover:text-white hover:bg-[#222]'}`}>{cat}</button>
                ))}
              </div>
            </div>

            {/* 3. 제국 인증 QR 시스템 (수정 반영) */}
            <div className="bg-[#111] p-10 rounded-[50px] border border-[#daa520]/20 text-center relative overflow-hidden">
              <div className="absolute top-5 right-10 text-sm text-gray-600 font-mono font-bold tracking-widest">FEE: {QR_PURCHASE_COST} BEOM</div>
              <SectionTitle title="Imperial Auth QR System" desc="제국 공식 신분 인증 및 결제용 QR을 활성화합니다." />
              
              <div className="flex gap-4 justify-center mb-10">
                <button onClick={() => {setQrType('PERSONAL'); setIsQrActive(false);}} className={`px-10 py-4 rounded-2xl text-xs font-black transition-all ${qrType === 'PERSONAL' ? 'bg-[#daa520] text-black shadow-lg' : 'bg-[#1a1a1a] text-gray-500'}`}>PERSONAL AUTH</button>
                <button onClick={() => {setQrType('BUSINESS'); setIsQrActive(false);}} className={`px-10 py-4 rounded-2xl text-xs font-black transition-all ${qrType === 'BUSINESS' ? 'bg-[#daa520] text-black shadow-lg' : 'bg-[#1a1a1a] text-gray-500'}`}>BUSINESS AUTH</button>
              </div>

              <div className="relative w-full max-w-[550px] mx-auto aspect-[1.8/1] rounded-[45px] border border-white/10 overflow-hidden shadow-2xl group">
                <img src={qrType === 'PERSONAL' ? personalQrImg : businessQrImg} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="QR Background" />
                <div className={`absolute inset-0 flex flex-col items-center justify-center p-8 transition-all duration-700 ${isQrActive ? 'bg-transparent' : 'bg-black/95 backdrop-blur-3xl'}`}>
                  {isQrActive ? (
                    <div className="bg-white p-4 rounded-[35px] shadow-2xl animate-in zoom-in-50 border-4 border-[#daa520]/40">
                      <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(empireUrl + '/?id=' + (qrType === 'BUSINESS' ? businessID : empireCharacterName))}`} className="w-36 h-36" alt="QR Code" />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="w-24 h-24 bg-[#daa520]/10 rounded-full flex items-center justify-center mb-6 border border-[#daa520]/20"><span className="text-5xl">🔐</span></div>
                      <button onClick={purchaseQR} className="bg-[#daa520] text-black px-14 py-6 rounded-3xl font-black text-base shadow-xl hover:scale-105 transition-all">인증 확보하기</button>
                    </div>
                  )}
                </div>
              </div>

              {qrType === 'BUSINESS' && (
                <div className="mt-10 flex flex-col gap-4 max-w-sm mx-auto animate-in slide-in-from-top-4">
                  <input type="text" value={businessName} onChange={(e) => {setBusinessName(e.target.value); setIsQrActive(false);}} placeholder="기업/브랜드 명칭" className="bg-black/60 border border-white/10 p-5 rounded-2xl text-sm focus:border-[#daa520] outline-none text-center font-black backdrop-blur-md" />
                  <input type="text" value={businessID} onChange={(e) => {setBusinessID(e.target.value); setIsQrActive(false);}} placeholder="사업자 고유 식별 ID" className="bg-black/60 border border-white/10 p-5 rounded-2xl text-sm focus:border-[#daa520] outline-none text-center font-mono backdrop-blur-md" />
                </div>
              )}
            </div>

            {/* 4. Ecosystem Infrastructure Hub (수정 반영) */}
            <div className="bg-[#111] p-10 rounded-[50px] border border-white/5 shadow-inner">
              <SectionTitle title="Ecosystem Infrastructure Hub" desc="제국의 8대 핵심 인프라를 통해 활동 보상을 획득하십시오." />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-4">
                {ecosystemFullApps.map(app => (
                  <button key={app} onClick={() => handleHubClick(app)} className="h-32 bg-[#1a1a1a] rounded-[30px] border border-white/5 flex flex-col items-center justify-center p-5 hover:bg-[#daa520] hover:text-black transition-all group active:scale-95 shadow-lg">
                    <span className="text-xs font-black text-[#daa520] group-hover:text-black text-center leading-tight break-words">{app}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 5. 유저 스튜디오 & 광고 센터 (수정 반영) */}
            <div className="bg-[#111] p-10 rounded-[50px] border border-white/5 relative">
              <SectionTitle title="User Studio & Imperial AD Center" desc="개인 자산을 등록하거나 제국 전역에 공식 광고를 게재합니다." />
              <div className="flex flex-col gap-5 relative z-10">
                <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="제목 또는 광고 헤드라인" className="bg-black p-6 rounded-2xl border border-white/10 text-sm focus:border-[#daa520] outline-none font-bold" />
                <textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="상세 설명 (광고 게재 시 홍보 문구 작성)" className="bg-black p-6 rounded-2xl border border-white/10 text-sm h-40 outline-none focus:border-[#daa520] resize-none" />
                
                <div className="flex justify-between items-center bg-black/60 p-8 rounded-[35px] border border-[#daa520]/20 shadow-inner backdrop-blur-md">
                  <div className="flex flex-col text-left">
                    <span className="text-sm font-black text-[#daa520] uppercase tracking-tighter">제국 공식 광고 (AD) 게재</span>
                    <span className="text-xs text-gray-500 mt-2 font-bold opacity-70">리스트 최상단 노출 및 골드 프레임 프리미엄 적용</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-sm font-mono text-gray-400 font-black">{AD_REG_COST} BEOM</span>
                    <input type="checkbox" checked={isAdRequest} onChange={(e) => setIsAdRequest(e.target.checked)} className="w-8 h-8 accent-[#daa520] cursor-pointer shadow-lg" />
                  </div>
                </div>

                <button onClick={registerAsset} className={`w-full py-7 rounded-[35px] font-black text-lg transition-all duration-300 ${isAdRequest ? 'bg-gradient-to-br from-[#daa520] to-[#b8860b] text-black shadow-2xl shadow-[#daa520]/30 hover:brightness-110' : 'bg-white/10 hover:bg-white/20'}`}>
                  {isAdRequest ? '공식 광고 확보하기 (AD)' : `자산 등록 (${ASSET_REG_COST} BEOM)`}
                </button>
              </div>

              {/* 피드 리스트 */}
              <div className="mt-16 space-y-6">
                {assets.filter(a => category === 'ALL' || a.category === category).map((a) => (
                  <div key={a.id} className={`p-8 rounded-[40px] border-l-[12px] transition-all duration-500 ${a.isAd ? 'bg-[#daa520]/10 border-[#daa520] shadow-2xl animate-in slide-in-from-right-5' : 'bg-white/5 border-gray-800'}`}>
                    <div className="flex justify-between mb-5">
                      <div className="flex items-center gap-4">
                        {a.isAd && <span className="bg-[#daa520] text-black text-[10px] px-3 py-1 rounded-full font-black tracking-tighter">OFFICIAL AD</span>}
                        <span className="font-black text-white text-xl tracking-tight">{a.title}</span>
                      </div>
                      <span className="text-gray-600 text-xs font-mono font-bold tracking-widest">{a.timestamp}</span>
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed font-medium mb-6">{a.desc}</p>
                    <div className="mt-4 flex justify-between items-center border-t border-white/5 pt-5">
                      <span className="text-[#daa520] text-xs font-black uppercase tracking-widest bg-[#daa520]/10 px-4 py-1.5 rounded-xl"># {a.category}</span>
                      <span className="text-xs text-gray-600 italic font-bold">Secure ID: {a.owner}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center py-24 opacity-10">
               <div className="w-20 h-1 bg-[#daa520] mx-auto mb-10 rounded-full"></div>
               <p className="text-xs font-mono tracking-[0.8em] uppercase leading-loose text-white/50">Kedheon Empire | 88-Threads Engine Verified</p>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
