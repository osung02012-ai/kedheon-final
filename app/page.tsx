import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

// [공정 13번] 무결성 영문 로직 재건
export default function KedheonPortal() {
  const empireUrl = "https://kedheon.com";

  return (
    <div className="flex flex-col items-center justify-start bg-black min-h-screen w-full font-sans text-white overflow-x-hidden pb-10">
      
      <div className="h-10 w-full" />

      {/* 메인 캐릭터 섹션 */}
      <div className="relative flex flex-col items-center w-full max-w-4xl px-4">
        <img 
          src="/kedheon-character.png" 
          alt="Kedheon Main Character" 
          className="w-full max-w-[500px] h-auto drop-shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-all duration-500"
        />
      </div>

      {/* 메인 버튼 */}
      <div className="mt-6">
        <button className="bg-[#1a2332] hover:bg-[#253347] text-white px-16 py-5 rounded-full text-2xl font-black tracking-widest border-2 border-[#4fc3f7] shadow-[0_0_15px_rgba(79,195,247,0.4)] transition-all active:scale-95">
          KEDHEON.PI
        </button>
      </div>

      {/* 하단 자산 노드 (범 토큰 & QR 코드) */}
      <div className="mt-16 flex flex-row items-end justify-center w-full max-w-2xl gap-12 md:gap-24 px-6">
        
        {/* 범 토큰: 하단 배치 및 투명도 보정 */}
        <div className="flex flex-col items-center group">
          <div className="relative">
            <img 
              src="/beom-token.png" 
              alt="Beom Token" 
              className="w-32 h-32 md:w-44 md:h-44 object-contain"
              style={{ 
                filter: 'drop-shadow(0 0 10px rgba(255,215,0,0.3))',
                mixBlendMode: 'normal'
              }} 
            />
          </div>
          <span className="text-[#ffd700] mt-3 font-mono text-sm font-bold tracking-tighter opacity-80 group-hover:opacity-100">
            BEOM TOKEN
          </span>
        </div>

        {/* QR 코드: 엔진 결속 */}
        <div className="flex flex-col items-center group">
          <div className="bg-white p-3 rounded-2xl shadow-[0_0_20px_rgba(255,255,255,0.2)] group-hover:scale-105 transition-transform">
            <QRCodeSVG 
              value={empireUrl} 
              size={120} 
              level="H"
              includeMargin={false}
            />
          </div>
          <span className="text-white mt-4 font-mono text-[11px] font-light tracking-[0.2em] opacity-60">
            ENTRY CODE
          </span>
        </div>

      </div>

      <div className="mt-auto pt-10 text-[10px] text-gray-600 font-mono">
        KEDHEON EMPIRE PORTAL v1.0.88-STABLE
      </div>
    </div>
  );
}
