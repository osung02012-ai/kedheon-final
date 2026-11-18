/**
 * Vendor — 거래 국가 목록.
 *
 * Civil·FactFilter와 같은 ISO 3166-1 238개국 목록을 그대로 쓴다(국가를 '컨택'해
 * 그 나라의 원장으로 들어가는 구조가 같아야 사용자가 헷갈리지 않는다).
 * 인도·나이지리아·케냐·가나·남아공 등 아프리카·아시아 전 국가가 모두 들어 있다.
 */
export {
  COUNTRIES,
  COUNTRY_MAP,
  GLOBAL_COUNTRY,
  searchCountries
} from '../civil/countries';
export type { Country } from '../civil/countries';

/**
 * 상단 가로 스트립에 먼저 보이는 주요국 — 세계 인구·Pi 사용자 분포가 큰 순서로
 * 아시아(인도·필리핀·인도네시아·베트남)와 아프리카(나이지리아·케냐·가나·남아공·이집트)를
 * 앞쪽에 둔다. 나머지 국가는 '국가 선택' 패널(238개국 검색)에서 고른다.
 */
export const QUICK_CODES: string[] = [
  'IN', 'NG', 'KE', 'KR', 'PH', 'ID', 'VN', 'GH', 'ZA', 'EG',
  'US', 'BR', 'CN', 'JP', 'TR', 'MX', 'PK', 'BD', 'TZ', 'UG'
];
