import { NextRequest } from 'next/server';

/**
 * Pi 도메인 소유 확인 키 — 호스트마다 다른 키를 내려준다.
 *  - kedheon.com            : Kedheon  (Mainnet/Production 신규 앱 6affc2a676eaf0f7bf35708c)
 *  - factfilter.kedheon.com : FactFilter (Mainnet 6affc2b1680643343acf8fca)
 *  - hangang.kedheon.com    : Hangang   (Mainnet 6affc2b924af9accabf93615)
 *  - civil / xaea12         : 기존 Testnet 앱 검증 유지
 *  - test.*                 : 위 3개의 옛 Testnet 앱(중복) 자리 — Mainnet 앱과 같은 호스트를 쓸 수 없어 분리
 * Pi 개발자 콘솔은 https://<앱 도메인>/validation-key.txt 의 본문이 앱별 키와
 * 정확히 일치하는지 확인한다. 한 도메인에 여러 앱을 올릴 수 없어 서브도메인별로 나눈다.
 */

// --- Mainnet(Production) 앱 키 ---
const MAINNET_KEDHEON_KEY =
  'edf94868a4c716f8a7bcb32ad247e8dc3e84896b477f7ad3190f8e5fcced28dc383352982b662fdad903bfc75142668ad5bc0a0da9403c7a5b096f42a94877ea';
const MAINNET_FACTFILTER_KEY =
  '363238ffaf2e1f3403d0c74bbaa7ad4f525c1e683a61c14f5eaa664bba1c80e2f4805631de38f026db42015aa4db1db68fa0336f6d75434c3ce14df062f1e829';
const MAINNET_HANGANG_KEY =
  '5aa5bc393977ed4d23d642ac05074aa2013e66c2140b58c5df5514843d905663df35652d42d972ecd42312c29ff93696e8ac20819e92ed6d8ba55511b958db20';

// --- 옛 Testnet(Staging) 앱 키 ---
const KEDHEON_TESTNET_KEY =
  '4fa8ac6e21aeec56f8a0dc8172091a189a9de03fb76726197606599b223f51dc76b3a2d8b8338ba3da69aaab62c7768b32a95c288d7ee4c4bbd50a7f67e46b81';
const CIVIL_KEY =
  '75db3851371090b5af0657e0deb64dc1b611c0963a5591534e964aaafe97e5d8cdb3eda22aab8c61d0b2820df0ae52b0f2a9ec298f881bd5e35afed7f8f7ff3a';
const FACTFILTER_TESTNET_KEY =
  '6a7d23a8ad325063a2d4cf4886fab190e6092439b1c6fd0407b36193c880ca80136548afe43cfc3db0d52fce568aa9ab4b54445bbb3ca35db117b043753ce663';
const HANGANG_TESTNET_KEY =
  '244a3b2ae912a076e9e6d9158f3b897cf0f618ff02b2892a419ee7424f50a6bb9cd696d0a70f6ecb0e1a2ecd022a5f90da71790d97232e4316937e6f0e0d483d';
const XAEA12_KEY =
  '20ef166646111fb87ee1bb45ac9a0ce65ea9643cd9095138a63b5ed30ee95f5bf12bead657ab2392b0f2a2931b1e95371b7a88defee2e9f1a427cad238e8a85b';

const KEYS: Record<string, string> = {
  'kedheon.com': MAINNET_KEDHEON_KEY,
  'www.kedheon.com': MAINNET_KEDHEON_KEY,
  'factfilter.kedheon.com': MAINNET_FACTFILTER_KEY,
  'hangang.kedheon.com': MAINNET_HANGANG_KEY,
  'civil.kedheon.com': CIVIL_KEY,
  'xaea12.kedheon.com': XAEA12_KEY,
  'test.kedheon.com': KEDHEON_TESTNET_KEY,
  'test-factfilter.kedheon.com': FACTFILTER_TESTNET_KEY,
  'test-hangang.kedheon.com': HANGANG_TESTNET_KEY
};

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const forwarded = (req.headers.get('x-forwarded-host') || '').split(',')[0];
  const host = (req.headers.get('host') || forwarded || '').toLowerCase().split(':')[0].trim();
  const key = KEYS[host] || KEDHEON_TESTNET_KEY;
  return new Response(key, {
    status: 200,
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'public, max-age=0, must-revalidate'
    }
  });
}
