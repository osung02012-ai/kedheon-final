export const metadata = { robots: { index: false, follow: false } };

// 임시 검수용 — /vendor를 390px iframe으로 감싸 실화면을 캡처한다. 캡처 후 삭제한다.
export default function ShotCheck() {
  return (
    <div style={{ background: '#d4d4d4', width: 390, margin: 0 }}>
      <div style={{ height: 20, fontSize: 12, color: '#555', paddingLeft: 4 }}>full</div>
      <iframe id="full" src="/vendor" style={{ width: 390, height: 2200, border: 0, display: 'block' }} />
      <div style={{ height: 20, fontSize: 12, color: '#555', paddingLeft: 4 }}>phone</div>
      <iframe id="phone" src="/vendor" style={{ width: 390, height: 844, border: 0, display: 'block' }} />
    </div>
  );
}
