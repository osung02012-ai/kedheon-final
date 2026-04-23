import Image from 'next/image'; // 88쓰레드급 이미지 로딩 엔진 탑재

export default function Home() {
  return (
    <main style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#000',
      color: '#fff',
      flexDirection: 'column',
      textAlign: 'center',
      padding: '0 20px',
      fontFamily: 'sans-serif',
    }}>
      {/* 🐯 케데헌 제국 국장 (Beom Token) 주입 */}
      <div style={{
        marginBottom: '2rem',
        borderRadius: '50%',
        overflow: 'hidden',
        border: '4px solid #fff', // 위엄 있는 흰색 테두리
        boxShadow: '0 0 20px rgba(255, 255, 255, 0.5)', // 은은한 후광 효과
        width: 'clamp(100px, 20vw, 150px)', // 모바일 100px, PC 최대 150px
        height: 'clamp(100px, 20vw, 150px)', // 비율 유지
        position: 'relative' // Next.js Image 비율 유지를 위해 필요
      }}>
        <Image 
          src="/beom-token.jpg" // public 폴더의 이미지 경로
          alt="케데헌 제국 국장 - 범토큰"
          fill // 부모 div를 꽉 채움
          style={{ objectFit: 'cover' }} // 이미지가 찌그러지지 않게
        />
      </div>

      <h1 style={{ 
        fontSize: 'clamp(1.5rem, 8vw, 3rem)',
        fontWeight: 'bold', 
        marginBottom: '1rem',
        wordBreak: 'keep-all'
      }}>
        🐯 케데헌 제국 (Kedheon Empire)
      </h1>
      
      <p style={{ 
        fontSize: 'clamp(1rem, 4vw, 1.5rem)', 
        lineHeight: '1.4'
      }}>
        이곳은 케데헌 제국의 포털입니다.
      </p>
      
      <div style={{ 
        marginTop: '2rem', 
        color: '#888',
        fontSize: '0.9rem'
      }}>
        88 Threads Dual Node Powering...
      </div>
    </main>
  );
}
