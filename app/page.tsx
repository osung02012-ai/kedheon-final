import React from 'react';

export default function KedheonPortal() {
  // 제국 데이터 주소
  const empireUrl = "https://kedheon.com";
  // 별도 설치 없이 큐알을 생성하는 온라인 엔진 사용
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(empireUrl)}`;

  return (
    <div className="flex flex-col items-center justify-start bg-black min-h-screen w-full text-white overflow-x-hidden pb-10" style={{ fontFamily: 'sans-serif' }}>
      
      <div className="h-10 w-full" />

      {/* 1. 메인 캐릭터 */}
      <div className="relative flex flex-col items-center w-full max-w-4xl px-4">
        <img 
          src="/kedheon-character.png" 
          alt="Kedheon" 
          className="w-full max-w-[450px] h-auto transition-all duration-500"
          style={{ filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.2))' }}
        />
      </div>

      {/* 2. 메인 버튼 */}
      <div className="mt-8">
        <button className="bg-[#1a2332] text-white px-16 py-4 rounded-full text-2xl font-black border-2 border-[#4fc3f7] shadow-[0_0_15px_rgba(79,195,247,0.3)]">
          KEDHEON.PI
        </button>
      </div>

      {/* 3. 하단 자산 노드 (범 토큰 & QR 코드) */}
      <div className="mt-16 flex flex-row items-end justify-center w-full max-w-2xl gap-10 md:gap-20 px-6">
        
        {/* 범 토큰: 하단 배치 및 투명도 보정 */}
        <div className="flex flex-col items-center">
          <img 
            src="/beom-token.png" 
            alt="Beom Token" 
            className="w-28 h-28 md:w-40 md:h-40 object-contain"
            style={{ mixBlendMode: 'normal' }} 
          />
          <span className="text-[#ffd700] mt-3 font-mono text-xs font-bold tracking-widest">BEOM TOKEN</span>
        </div>

        {/* QR 코드: 외부 엔진 기반 */}
        <div className="flex flex-col items-center">
          <div className="bg-white p-2 rounded-xl shadow-lg">
            <img 
              src={qrImageUrl} 
              alt="QR Code" 
              className="w-28 h-28 md:w-32 md:h-32"
            />
          </div>
          <span className="text-gray-400 mt-4 font-mono text-[10px] tracking-[0.3em]">ENTRY CODE</span>
        </div>

      </div>

      <div className="mt-auto pt-10 text-[10px] text-gray-700 font-mono">
        KEDHEON EMPIRE v1.0.88-STABLE
      </div>
    </div>
  );
}
