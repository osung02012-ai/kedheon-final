'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function KedheonImperialPortal() {
  const [userName, setUserName] = useState("Imperial Pioneer");
  const [storeName, setStoreName] = useState("Kedheon Store #1");

  const coreApps = [
    "KEDHEON.PI", "PI Nexus.PI", "Nexus AI", "Pi Vendor",
    "Pi Civil", "Fact-Filter", "Pi Papa", "Pi 6G Network"
  ];

  return (
    <main style={{
      backgroundColor: '#000', color: '#fff', minHeight: '100vh',
      padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      
      {/* [33번 공정] 범토큰 국장 - PNG 파일명 일치 완료 */}
      <div style={{ marginBottom: '20px' }}>
        <Image src="/beom-token.png" alt="Beom Token Seal" width={80} height={80} priority />
      </div>

      {/* [31번 공정] 국보 캐릭터 - kedheon-character.png 로 수정 완료 */}
      <div style={{ maxWidth: '700px', width: '100%', marginBottom: '30px' }}>
        <Image 
          src="/kedheon-character.png" 
          alt="Kedheon Empire Guardian" 
          width={700} height={700} 
          style={{ width: '100%', height: 'auto', borderRadius: '25px' }}
        />
      </div>

      <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', fontWeight: '900', color: '#ffcc00' }}>
        KEDHEON EMPIRE
      </h1>
      <p style={{ color: '#666', fontSize: '1.2rem', letterSpacing: '5px' }}>v3.0 SYSTEM START</p>

      {/* [41번 공정] QR 이원화 섹션 - 영문 파일명 일치 완료 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px', width: '100%', maxWidth: '850px', margin: '40px 0' }}>
        
        <div style={{ padding: '30px', backgroundColor: '#111', borderRadius: '25px', border: '1px dashed #333', textAlign: 'center' }}>
          <p style={{ fontSize: '0.7rem', color: '#666' }}>PERSONAL QR</p>
          <h2 style={{ fontSize: '1.5rem', margin: '10px 0' }}>{userName}</h2>
          <div style={{ background: '#fff', padding: '15px', borderRadius: '20px', display: 'inline-block' }}>
            <Image src="/qr-personal.png" alt="Personal QR" width={150} height={150} />
          </div>
          <input 
            style={{ marginTop: '15px', width: '80%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '10px' }}
            placeholder="Edit Nickname"
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>

        <div style={{ padding: '30px', backgroundColor: '#111', borderRadius: '25px', border: '2px solid #ffcc00', textAlign: 'center' }}>
          <p style={{ fontSize: '0.7rem', color: '#ffcc00' }}>BUSINESS QR</p>
          <h2 style={{ fontSize: '1.5rem', margin: '10px 0', color: '#ffcc00' }}>{storeName}</h2>
          <div style={{ background: '#fff', padding: '15px', borderRadius: '20px', display: 'inline-block' }}>
            <Image src="/qr-business.png" alt="Business QR" width={150} height={150} />
          </div>
          <input 
            style={{ marginTop: '15px', width: '80%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '10px' }}
            placeholder="Edit Store Name"
            onChange={(e) => setStoreName(e.target.value)}
          />
        </div>

      </div>

      {/* [47번 공정] 8대 연동 앱 리스트 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', width: '100%', maxWidth: '850px', marginBottom: '50px' }}>
        {coreApps.map(app => (
          <div key={app} style={{ padding: '12px', border: '1px solid #222', borderRadius: '8px', fontSize: '0.7rem', color: '#888', textAlign: 'center' }}>
            {app}
          </div>
        ))}
      </div>

      <footer style={{ width: '100%', maxWidth: '850px', borderTop: '1px solid #222', paddingTop: '20px', color: '#444', fontSize: '0.8rem' }}>
        <p>Redistribution: max(3% Income, 8% Revenue)</p>
        <p>Verified by 88-Thread Dual Node | Protocol v20.2</p>
      </footer>
    </main>
  );
}
