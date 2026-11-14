import type { NextConfig } from "next";

/**
 * KEDHEON · Civil · FactFilter · Hangang 단일 Next.js 앱 설정
 *  - 서브도메인 라우팅은 middleware.ts 가 담당한다.
 *  - 타입 검사는 실제로 통과해야 한다(app/page.tsx 10개국어 사전 포함).
 *    빌드에서 타입을 숨기지 않는다.
 */
const nextConfig: NextConfig = {};

export default nextConfig;
