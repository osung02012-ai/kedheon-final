import { NextResponse } from 'next/server';

/**
 * GET /api/wolnambbong/config — 월남뽕 온라인 방(실시간) 접속 설정
 *
 *  - 공개 저장소(osung02012-ai/kedheon-final)에 키를 커밋하지 않기 위해, 브라우저에는
 *    **공개용 키(anon / publishable)** 만 서버 환경변수에서 읽어 내려준다.
 *  - service_role·secret 키는 절대 읽지도, 내보내지도 않는다(이 라우트에 이름조차 없다).
 *  - 키가 없는 환경(로컬 빌드·미연결)에서는 configured:false 를 돌려주고,
 *    화면은 온라인 모드를 조용히 비활성화한다(오프라인 모드는 그대로 동작).
 *  - 값은 매 요청 새로 읽고 캐시하지 않는다(배포 후 환경변수 변경이 바로 반영).
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const URL_ENVS = ['NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_URL'] as const;
const KEY_ENVS = [
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
  'SUPABASE_ANON_KEY',
  'SUPABASE_PUBLISHABLE_KEY'
] as const;

function firstEnv(names: readonly string[]): string {
  for (const name of names) {
    const value = process.env[name];
    if (value && value.trim()) return value.trim();
  }
  return '';
}

export async function GET() {
  const url = firstEnv(URL_ENVS).replace(/\/+$/, '');
  const key = firstEnv(KEY_ENVS);
  const configured = url.length > 0 && key.length > 0;

  return NextResponse.json(
    {
      ok: true,
      configured,
      // 브라우저에 내려가는 값은 공개 키뿐이다(RLS 로 보호되는 anon 권한).
      url: configured ? url : '',
      key: configured ? key : '',
      realtime: configured ? `${url.replace(/^http/, 'ws')}/realtime/v1/websocket` : '',
      ts: Date.now()
    },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}
