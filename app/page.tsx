import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

// [공정 13번] 팩트-필터: 유저 인터페이스 무결성 확보를 위한 통합 컴포넌트
export default function KedheonPortal() {
  // 제국 데이터 경로 설정
  const empireUrl = "https://kedheon.com";

  return (
    <div className="flex flex-col items-center justify-start bg-black min-h-screen w-full font-sans text-white overflow-x-hidden pb-10">
      
      {/* 1. 상단 여백 및 상태바 (필요 시) */}
      <div className="h-10 w-full" />

      {/* 2. 메인 캐릭터 섹션 (중앙 집중) */}
      <div className="relative flex flex-col items-center w-full max-w-4xl px-4">
        <img 
          src="/kedheon-character.png" 
          alt="Kedheon Main Character" 
          className="w-full max-w-[500px] h-auto drop-shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-all duration-500"
          style={{ imageRendering: 'auto' }}
        />
      </div>

      {/* 3. 메인 인터렉션 버튼 (KEDHEON.PI) */}
      <div className="mt-6">
        <button 
          className="bg-[#1a2332] hover:bg-[#253347] text-white px-16 py-5 rounded-full text-2xl font-black tracking-widest border-2 border-[#4fc3f7] shadow-[0_0_15px_rgba(79,195,247,0.4)] transition-all active:scale-95"
        >
          KEDHEON.PI
        </button>
      </div>

      {/* 4. 하단 전략 자산 데이터 노드 (범 토큰 & QR 코드) */}
      {/* [팩트] 주군의 요청에 따라 범 토큰을 하단으로 이동 및 확대 배치 */}
      <div className="mt-16 flex flex-row items-end justify-center w-full max-w-2xl gap-12 md:gap-24 px-6">
        
        {/* 범 토큰 노드: 투명도 보정 및 시각적 강조 */}
        <div className="flex flex-col items-center group">
          <div className="relative">
            <img 
              src="/beom-token.png" 
              alt="Beom Token" 
              className="w-32 h-32 md:w-44 md:h-44 object-contain"
              style={{ 
                filter: 'drop-shadow(0 0 10px rgba(255,215,0,0.3))',
                mixBlendMode: 'normal' // 투명도 외곽선 노이즈 방지
              }} 
            />
          </div>
          <span className="text-[#ffd700] mt-3 font-mono text-sm font-bold tracking-tighter opacity-80 group-hover:opacity-100">
            BEOM TOKEN
          </span>
        </div>

        {/* QR 코드 노드: 실시간 입국 엔진 */}
        <div className="flex flex-col items-center group">
          <div className="bg-white p-3 rounded-2xl shadow-[0_0_20px_rgba(255,255,255,0.2)] group-hover:scale-105 transition-transform">
            <QRCodeSVG 
              value={empireUrl} 
              size={120} // 모바일/PC 범용 사이즈
              level="H"  // 오류 복원력 최상위 단계
              includeMargin={false}
              imageSettings={{
                src: "/beom-token.png", // QR 중앙에 작은 토큰 로고 삽입 (선택 사항)
                x: undefined,
                y: undefined,
                height: 24,
                width: 24,
                excavate: true,
              }}
            />
          </div>
          <span className="text-white mt-4 font-mono text-[11px] font-light tracking-[0.2em] opacity-60">
            ENTRY CODE
          </span>
        </div>

      </div>

      {/* [팩트] 시스템 버전 정보 */}
      <div className="mt-auto pt-10 text-[10px] text-gray-600 font-mono">
        KEDHEON EMPIRE PORTAL v1.0.88-STABLE
      </div>
    </div>
  );
}
