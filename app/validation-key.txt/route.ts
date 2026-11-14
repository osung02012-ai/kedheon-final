import { NextRequest } from 'next/server';

/**
 * Pi 도메인 소유 확인 키 — 호스트마다 다른 키를 내려준다.
 *  - kedheon.com            : Kedheon 앱 (기존 검증 유지)
 *  - civil.kedheon.com      : Civil 앱
 *  - factfilter.kedheon.com : FactFilter 앱
 * Pi 개발자 콘솔은 https://<앱 도메인>/validation-key.txt 의 본문이 앱별 키와
 * 정확히 일치하는지 확인한다. 한 도메인에 여러 앱을 올릴 수 없어 서브도메인별로 나눈다.
 */

const KEDHEON_KEY =
  '4fa8ac6e21aeec56f8a0dc8172091a189a9de03fb76726197606599b223f51dc76b3a2d8b8338ba3da69aaab62c7768b32a95c288d7ee4c4bbd50a7f67e46b81';
const CIVIL_KEY =
  '75db3851371090b5af0657e0deb64dc1b611c0963a5591534e964aaafe97e5d8cdb3eda22aab8c61d0b2820df0ae52b0f2a9ec298f881bd5e35afed7f8f7ff3a';
const FACTFILTER_KEY =
  '6a7d23a8ad325063a2d4cf4886fab190e6092439b1c6fd0407b36193c880ca80136548afe43cfc3db0d52fce568aa9ab4b54445bbb3ca35db117b043753ce663';

const KEYS: Record<string, string> = {
  'kedheon.com': KEDHEON_KEY,
  'www.kedheon.com': KEDHEON_KEY,
  'civil.kedheon.com': CIVIL_KEY,
  'factfilter.kedheon.com': FACTFILTER_KEY
};

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const host = (req.headers.get('host') || '').toLowerCase().split(':')[0];
  const key = KEYS[host] || KEDHEON_KEY;
  return new Response(key, {
    status: 200,
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'public, max-age=0, must-revalidate'
    }
  });
}
