import React from 'react';

export default function KedheonPortal() {
  const myReferralCode = "ohsangjo";
  const piInvitationUrl = `https://minepi.com/${myReferralCode}`;
  const empireUrl = "https://kedheon.com";
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(empireUrl)}`;

  return (
    <div className="flex flex-col items-center justify-start bg-black min-h-screen w-full text-white p-4 overflow-x-hidden" style={{ fontFamily: 'sans-serif' }}>
      
      <div className="h-10 w-full" />

      {/* 1. 메인 캐릭터 */}
      <div className="relative flex flex-col items-center w-full max-w-[500px]">
        <img 
          src="/kedheon-character.png" 
          alt="Kedheon Empire Main" 
          className="w-full h-auto drop-shadow-[0_0_40px_rgba(255,255,255,0.15)]"
        />
      </div>

      {/* 2. [Web2-Web3 인도교] 레퍼럴 버튼 */}
      <div className="mt-8 flex flex-col items-center gap-4 w-full max-w-sm">
        <a 
          href={piInvitationUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-full bg-gradient-to-r from-[#b8860b] to-[#8b4513] text-white text-center py-5 rounded-2xl text-xl font-black shadow-[0_0_20px_rgba(184,134,11,0.4)] hover:scale-105 transition-transform"
        >
          제국 시민권 신청 (어흥!)
          <p className="text-[10px] font-light mt-1 opacity-80 uppercase tracking-widest">Web2 to Web3 Bridge</p>
        </a>
        <div className="text-[#daa520] text-sm font-mono font-bold tracking-widest bg-white/5 px-4 py-1 rounded-full border border-white/10">
          초대코드: {myReferralCode}
        </div>
      </div>

      {/* 3. [공정 13번] 시민권 획득 4단계 가이드 */}
      <div className="mt-20 w-full max-w-2xl px-6 py-10 border-t border-gray-800">
        <h2 className="text-white text-2xl font-black mb-8 text-center">제국 시민권 획득 4단계 (어흥!)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-400 text-sm">
          <div className="bg-white/5 p-4 rounded-lg"><strong>1. 관문 통과:</strong> 파이 앱 설치 및 초대코드 입력</div>
          <div className="bg-white/5 p-4 rounded-lg"><strong>2. 신원 검증:</strong> KYC 준비 및 시민 데이터 등록</div>
          <div className="bg-white/5 p-4 rounded-lg"><strong>3. 영토 진입:</strong> 닉네임 설정 및 고유 QR 발급</div>
          <div className="bg-white/5 p-4 rounded-lg"><strong>4. 자산 활성화:</strong> 파이 생태계 내 상점/활동 개시</div>
        </div>
      </div>

      {/* 4. 하단 자산 노드 */}
      <div className="mt-16 flex flex-row items-center justify-center w-full max-w-2xl gap-10 md:gap-20 pb-20">
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-[#daa520] bg-black">
            <img src="/beom-token.png" alt="Beom Token" className="w-full h-full object-cover" />
          </div>
          <span className="text-[#daa520] mt-3 font-mono text-xs font-bold">BEOM TOKEN</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="bg-white p-2 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            <img src={qrImageUrl} alt="Entry QR" className="w-28 h-28 md:w-32 md:h-32" />
          </div>
          <span className="text-gray-400 mt-4 font-mono text-[10px] tracking-[0.3em]">ENTRY CODE</span>
        </div>
      </div>
    </div>
  );
}
