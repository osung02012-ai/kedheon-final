'use client';
import React, { useState } from 'react';

export default function KedheonPortal() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const myReferralCode = "osung02012";
  const piInvitationUrl = `https://minepi.com/${myReferralCode}`;
  const empireUrl = "https://kedheon.com";
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(empireUrl)}`;

  return (
    <div className="flex flex-col items-center justify-start bg-black min-h-screen w-full text-white p-4 overflow-x-hidden font-sans">
      
      <div className="h-10 w-full" />

      {/* 1. 제국 로비 메인 캐릭터 (독립 제국의 정체성) */}
      <div className="relative flex flex-col items-center w-full max-w-[450px]">
        <img 
          src="/kedheon-character.png" 
          alt="Kedheon Empire" 
          className="w-full h-auto drop-shadow-[0_0_40px_rgba(255,255,255,0.15)]"
        />
        <h1 className="text-3xl font-black mt-6 tracking-[0.2em] text-[#daa520]">KEDHEON EMPIRE</h1>
      </div>

      {/* 2. 시민권 신청 (레퍼럴 브릿지 - 팝업형 독립) */}
      <div className="mt-10">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-gradient-to-r from-[#b8860b] to-[#8b4513] text-white px-12 py-5 rounded-2xl text-xl font-black shadow-[0_0_20px_rgba(184,134,11,0.4)] hover:scale-105 transition-transform"
        >
          제국 시민권 신청 (어흥!)
        </button>
      </div>

      {/* 3. [공정 13번] 시민권 획득 가이드 */}
      <div className="mt-20 w-full max-w-2xl px-6 py-10 border-t border-gray-800">
        <h2 className="text-white text-xl font-bold mb-8 text-center uppercase tracking-widest">Empire Onboarding</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-400 text-xs text-center">
          <div className="bg-white/5 p-4 rounded-lg">1. 관문 통과: 파이 앱 설치 및 초대코드 입력</div>
          <div className="bg-white/5 p-4 rounded-lg">2. 신원 검증: KYC 준비 및 데이터 등록</div>
          <div className="bg-white/5 p-4 rounded-lg">3. 영토 진입: 닉네임 설정 및 QR 발급</div>
          <div className="bg-white/5 p-4 rounded-lg">4. 자산 활성화: 파이 생태계 내 활동 개시</div>
        </div>
      </div>

      {/* 4. 하단 자산 노드 (독립 제국 인증) */}
      <div className="mt-10 flex flex-row items-center justify-center gap-10 pb-20">
        <div className="w-24 h-24 rounded-full overflow-hidden border border-[#daa520] bg-black">
          <img src="/beom-token.png" alt="Beom" className="w-full h-full object-cover" />
        </div>
        <div className="bg-white p-2 rounded-xl">
          <img src={qrImageUrl} alt="Entry QR" className="w-24 h-24" />
        </div>
      </div>

      {/* 레퍼럴 모달창 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-6 z-50">
          <div className="bg-[#111] border border-[#daa520] p-8 rounded-2xl max-w-sm w-full text-center">
            <h2 className="text-xl font-bold text-white mb-4">시민권 신청 안내</h2>
            <p className="text-gray-400 text-sm mb-6">초대코드: <span className="text-[#daa520] font-bold">{myReferralCode}</span></p>
            <a href={piInvitationUrl} target="_blank" className="block bg-[#daa520] text-black py-3 rounded-lg font-bold mb-4">파이 네트워크 가입</a>
            <button onClick={() => setIsModalOpen(false)} className="text-gray-500 underline text-sm">닫기</button>
          </div>
        </div>
      )}
    </div>
  );
}
