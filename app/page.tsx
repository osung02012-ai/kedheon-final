'use client';

import { useState } from 'react';
import Image from 'next/image';
import Head from 'next/head';

export default function KedheonImperialPortal() {
  // [5번/41번/46번 공정] 아이덴티티 및 브랜드 실시간 관리
  const [userName, setUserName] = useState("Imperial Pioneer");
  const [storeName, setStoreName] = useState("Kedheon Store #1");
  const [musicStatus, setMusicStatus] = useState("No track uploaded");

  const coreApps = [
    "KEDHEON.PI", "PI Nexus.PI", "Nexus AI", "Pi Vendor",
    "Pi Civil", "Fact-Filter", "Pi Papa", "Pi 6G Network"
  ];

  // [24번 공정] AI 에이전트를 위한 구조화된 데이터 (JSON-LD)
  const aiLdData = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    "name": "Kedheon Empire",
    "description": "AI-to-AI Commerce & Fandom Playground",
    "potentialAction": {
      "@type": "TradeAction",
      "priceCurrency": "PI",
      "price": "dynamic"
    },
    "redistributionPolicy": "max(3% Income, 8% Revenue)"
  };

  return (
    <main style={{
      backgroundColor: '#000', color: '#fff', minHeight: '100vh',
      padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center',
      fontFamily: 'system-ui, -apple-system, sans-serif', lineBreak: 'anywhere'
    }}>
      {/* [24번 공정] AI Crawlers 전용 메타데이터 주입 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aiLdData) }}
      />

      {/* [33번 공정] 제국 국장 (PNG 교체 완료) */}
      <div style={{ marginBottom: '20px' }}>
        <Image src="/beom-token.png" alt="Beom Token Seal" width={80} height={80} priority />
      </div>

      {/* [31번 공정] 국보 캐릭터 (갓 쓴 흑표범) */}
      <div style={{ maxWidth: '700px', width: '100%', marginBottom: '30px', boxShadow: '0 0 50px rgba(255,204,0,0.1)' }}>
        <Image 
          src="/09.케데헌.png" 
          alt="Kedheon Empire Guardian" 
          width={700} height={700} 
          style={{ width: '100%', height: 'auto', borderRadius: '25px' }}
        />
      </div>

      <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', fontWeight: '900', color: '#ffcc00' }}>
        KEDHEON
      </h1>
      <p style={{ color: '#666', fontSize: '1.2rem', marginTop: '-10px', letterSpacing: '5px' }}>EMPIRE OS v3.0</p>

      {/* [팬덤/뮤직 플레이그라운드] 유저 참여 섹션 */}
      <section style={{ width: '100%', maxWidth: '850px', margin: '40px 0', padding: '30px', backgroundColor: '#0a0a0a', border: '1px solid #222', borderRadius: '30px' }}>
        <h3 style={{ color: '#ffcc00', marginBottom: '20px' }}>🐯 Imperial Music & Fan Chamber</h3>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <button 
            onClick={() => setMusicStatus("Track: 'Pioneer's Roar' Uploaded")}
            style={{ padding: '15px 25px', backgroundColor: '#222', border: '1px solid #444', color: '#fff', borderRadius: '15px', cursor: 'pointer' }}
          >
            Upload Music (MP3/WAV)
          </button>
          <button style={{ padding: '15px 25px', backgroundColor: '#ffcc00', border: 'none', color: '#000', fontWeight: 'bold', borderRadius: '15px' }}>
            Open Fan Chamber
          </button>
        </div>
        <p style={{ marginTop: '15px', color: '#888', fontSize: '0.9rem' }}>Status: {musicStatus}</p>
      </section>

      {/* [41번 공정] QR 이원화 및 AI 결제 브릿지 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px', width: '100%', maxWidth: '850px' }}>
        
        {/* 개인용 ID/QR */}
        <div style={{ padding: '30px', backgroundColor: '#111', borderRadius: '25px', border: '1px dashed #333' }}>
          <span style={{ fontSize: '0.7rem', color: '#666' }}>[5] PERSONAL IDENTITY</span>
          <input 
            value={userName} onChange={(e) => setUserName(e.target.value)}
            style={{ display: 'block', width: '100%', background: 'none', border: 'none', color: '#fff', fontSize: '1.8rem', fontWeight: 'bold', margin: '10px 0' }}
          />
          <div style={{ background: '#fff', padding: '15px', borderRadius: '20px', display: 'inline-block' }}>
            <Image src="/qr-personal.png" alt="Personal QR" width={150} height={150} />
          </div>
        </div>

        {/* 기업용 STORE/QR */}
        <div style={{ padding: '30px', backgroundColor: '#111', borderRadius: '25px', border: '2px solid #ffcc00' }}>
          <span style={{ fontSize: '0.7rem', color: '#ffcc00' }}>[46] BUSINESS ACCOUNT</span>
          <input 
            value={storeName} onChange={(e) => setStoreName(e.target.value)}
            style={{ display: 'block', width: '100%', background: 'none', border: 'none', color: '#ffcc00', fontSize: '1.8rem', fontWeight: 'bold', margin: '10px 0' }}
          />
          <div style={{ background: '#fff', padding: '15px', borderRadius: '20px', display: 'inline-block' }}>
            <Image src="/qr-business.png" alt="Business QR" width={150} height={150} />
          </div>
        </div>

      </div>

      {/* [47번 공정] 8대 연동 앱 인터페이스 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', width: '100%', maxWidth: '850px', margin: '50px 0' }}>
        {coreApps.map(app => (
          <div key={app} style={{ padding: '12px', border: '1px solid #222', borderRadius: '8px', fontSize: '0.7rem', color: '#888', textAlign: 'center' }}>
            {app}
          </div>
        ))}
      </div>

      {/* [44번/4번 공정] 사회적 환원 및 세무 로직 명시 */}
      <footer style={{ width: '100%', maxWidth: '850px', borderTop: '1px solid #222', paddingTop: '30px', textAlign: 'left' }}>
        <p style={{ color: '#ffcc00', fontSize: '0.9rem', fontWeight: 'bold' }}>
          Redistribution Algorithm: $$ \max(3\% \cdot \text{Net Income}, 8\% \cdot \text{Total Revenue}) $$
        </p>
        <p style={{ color: '#444', fontSize: '0.8rem', marginTop: '10px' }}>
          [Predict] Tax Optimized at 22% | Fact-Filter Active | 88-Thread Dual Node Verified
        </p>
      </footer>
    </main>
  );
}
     
