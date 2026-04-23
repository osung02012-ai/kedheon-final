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
      fontFamily: 'sans-serif'
    }}>
      <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem' }}>
        🐯 케데헌 제국 (Kedheon Empire)
      </h1>
      <p style={{ fontSize: '1.5rem' }}>
        이곳은 케데헌 제국의 포털입니다.
      </p>
      <div style={{ marginTop: '2rem', color: '#888' }}>
        88 Threads Dual Node Powering...
      </div>
    </main>
  );
}
