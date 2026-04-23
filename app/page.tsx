import React from 'react';

export default function KedheonPortal() {
  const empireUrl = "https://kedheon.com";
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(empireUrl)}`;

  return (
    <div className="flex flex-col items-center justify-center bg-black min-h-screen w-full text-white p-4" style={{ fontFamily: 'sans-serif' }}>
      
      {/* 1. 메인 캐릭터 (버튼 중복 제거를 위해 하단 버튼 삭제) */}
      <div className="relative flex flex-col items-center w-full max-w-[500px]">
        <img 
          src="/kedheon-character.png" 
          alt="Kedheon Main" 
          className="w-full h-auto drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]"
        />
        {/* 이미지 안에 글자가 있으므로 별도 버튼은 배치하지 않음 */}
      </div>

      {/* 2. 하단 자산 영역 (범 토큰 & QR 코드) */}
      <div className="mt-12 flex flex-row items-center justify-center w-full max-w-2xl gap-8 md:gap-16">
        
        {/* [팩트] 범 토큰: 격자무늬가 보이지 않도록 원형 프레임 강제 적용 */}
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-yellow-600 shadow-[0_0_15px_rgba(255,215,0,0.2)]">
            <img 
              src="/beom-token.png" 
              alt="Beom Token" 
              className="w-full h-full object-cover" 
            />
          </div>
          <span className="text-yellow-500 mt-3 font-mono text-xs font-bold">BEOM TOKEN</span>
        </div>

        {/* [팩트] QR 코드: 제국 입국 노드 */}
        <div className="flex flex-col items-center">
          <div className="bg-white p-2 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            <img 
              src={qrImageUrl} 
              alt="QR Code" 
              className="w-28 h-28 md:w-32 md:h-32"
            />
          </div>
          <span className="text-gray-400 mt-4 font-mono text-[10px] tracking-[0.3em]">ENTRY CODE</span>
        </div>

      </div>

      {/* 시스템 버전 하단 고정 */}
      <div className="mt-16 text-[10px] text-gray-800 font-mono">
        KEDHEON EMPIRE v1.0.99-FINAL_TUNING
      </div>
    </div>
  );
}
