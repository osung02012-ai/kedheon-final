/* ------------------------------------------------------------------
 * XAEA12 — game-point & gifting hub data
 * 10-tuple order: KR EN CN JP ES VN FR PT RU ID
 *
 * 규칙(코어팀 가이드라인):
 *  - @username + 사연 요약 + 앱의 게임 포인트 수량만. 실명·계좌·연락처 0건.
 *  - 유명인 이름·사진·인용 0건. 추첨·확률형 리워드 0건.
 *  - 파이 생태계 앱의 포인트(BOPIES · Sigil · Gems · BEOM 등)는 환전 대상이 아니다.
 * ------------------------------------------------------------------ */

import type { L10, UIKey } from './i18n';

export type AppKey = 'BOPI' | 'ELF' | 'HANGANG' | 'KEDHEON' | 'ETC';

export interface AppMeta {
  key: AppKey;
  /** 앱 고유명사 — 화면에서 translate="no" 로 둔다. */
  name: string;
  icon: string;
  /** 기본 재화 단위 (기타 앱은 사연 작성자가 직접 적는다) */
  unit: string;
  /** 필터 라벨 — 기타 앱만 번역이 필요하다. */
  labelKey?: UIKey;
}

export const APPS: AppMeta[] = [
  { key: 'BOPI', name: 'BoPi World', icon: '🏠', unit: 'BOPIES' },
  { key: 'ELF', name: 'Pi ELF', icon: '🧝', unit: 'Sigil' },
  { key: 'HANGANG', name: 'Hangang', icon: '✈️', unit: 'BEOM' },
  { key: 'KEDHEON', name: 'Kedheon', icon: '🐆', unit: 'BEOM' },
  { key: 'ETC', name: 'Other apps', icon: '🎮', unit: 'CREDIT', labelKey: 'appOther' }
];

export const APP_MAP: Record<AppKey, AppMeta> = APPS.reduce(
  (acc, app) => ({ ...acc, [app.key]: app }),
  {} as Record<AppKey, AppMeta>
);

export interface Story {
  id: string;
  /** 포인트가 필요한 생태계 앱 */
  app: AppKey;
  /** 재화 단위 — BOPIES · Sigil · Gems · BEOM · 사용자 입력 */
  unit: string;
  /** @ 를 뺀 Pi username */
  user: string;
  goal: number;
  raised: number;
  /** 선물을 기록한 사람 수 */
  gifters: number;
  /** BEOM 응원 수 */
  cheer: number;
  title: L10;
  /** 방문자가 이 브라우저에서 올린 사연 */
  local?: boolean;
}

/** 샘플 사연 — 1단계(게임 포인트 & 선물하기 매칭) 보드. */
export const SAMPLE_STORIES: Story[] = [
  {
    id: 'bopi-house',
    app: 'BOPI',
    unit: 'BOPIES',
    user: 'bopi_hanul',
    goal: 200,
    raised: 128,
    gifters: 7,
    cheer: 41,
    title: [
      'BoPi World에서 집 사려는데 200 BOPIES 부족 🏠',
      'Buying a home in BoPi World — 200 BOPIES short 🏠',
      '想买 BoPi World 的房子，差 200 BOPIES 🏠',
      'BoPi World で家を買いたいのに 200 BOPIES 不足 🏠',
      'Quiero comprar casa en BoPi World: faltan 200 BOPIES 🏠',
      'Muốn mua nhà trong BoPi World, thiếu 200 BOPIES 🏠',
      'Acheter une maison dans BoPi World : 200 BOPIES manquent 🏠',
      'Quero comprar casa no BoPi World: faltam 200 BOPIES 🏠',
      'Хочу дом в BoPi World — не хватает 200 BOPIES 🏠',
      'Mau beli rumah di BoPi World, kurang 200 BOPIES 🏠'
    ]
  },
  {
    id: 'elf-kitchen',
    app: 'ELF',
    unit: 'Sigil',
    user: 'elf_mint',
    goal: 35,
    raised: 21,
    gifters: 5,
    cheer: 18,
    title: [
      'Pi ELF Kitchen Book 사는데 35 Sigil 모자람 📚',
      'Pi ELF Kitchen Book — 35 Sigil short 📚',
      '买 Pi ELF Kitchen Book 差 35 Sigil 📚',
      'Pi ELF Kitchen Book を買うのに 35 Sigil 足りません 📚',
      'El Kitchen Book de Pi ELF: faltan 35 Sigil 📚',
      'Mua Kitchen Book của Pi ELF, thiếu 35 Sigil 📚',
      'Le Kitchen Book de Pi ELF : 35 Sigil manquants 📚',
      'Kitchen Book do Pi ELF: faltam 35 Sigil 📚',
      'Kitchen Book в Pi ELF — не хватает 35 Sigil 📚',
      'Kitchen Book Pi ELF kurang 35 Sigil 📚'
    ]
  },
  {
    id: 'hangang-jeju',
    app: 'HANGANG',
    unit: 'BEOM',
    user: 'han_river',
    goal: 15,
    raised: 9,
    gifters: 6,
    cheer: 27,
    title: [
      'Hangang 제주 패스 15 BEOM 부족 ✈️',
      'Hangang Jeju pass — 15 BEOM short ✈️',
      'Hangang 济州通票差 15 BEOM ✈️',
      'Hangang 済州パス、15 BEOM 不足 ✈️',
      'Pase Jeju de Hangang: faltan 15 BEOM ✈️',
      'Pass Jeju của Hangang thiếu 15 BEOM ✈️',
      'Pass Jeju Hangang : 15 BEOM manquants ✈️',
      'Passe Jeju do Hangang: faltam 15 BEOM ✈️',
      'Пас Jeju в Hangang — не хватает 15 BEOM ✈️',
      'Pass Jeju Hangang kurang 15 BEOM ✈️'
    ]
  },
  {
    id: 'bopi-furniture',
    app: 'BOPI',
    unit: 'BOPIES',
    user: 'bopi_nabi',
    goal: 90,
    raised: 90,
    gifters: 4,
    cheer: 12,
    title: [
      'BoPi World 가구 꾸미기 90 BOPIES, 선물로 채웠습니다 🛋️',
      'My BoPi World furniture — 90 BOPIES fully gifted 🛋️',
      'BoPi World 家具 90 BOPIES，已由赠送补齐 🛋️',
      'BoPi World の家具 90 BOPIES、ギフトで満額に 🛋️',
      'Mis muebles de BoPi World: 90 BOPIES completados 🛋️',
      'Nội thất BoPi World 90 BOPIES đã được tặng đủ 🛋️',
      'Mes meubles BoPi World : 90 BOPIES complétés 🛋️',
      'Meus móveis no BoPi World: 90 BOPIES completos 🛋️',
      'Мебель в BoPi World — 90 BOPIES собраны 🛋️',
      'Furnitur BoPi World 90 BOPIES sudah terpenuhi 🛋️'
    ]
  },
  {
    id: 'elf-seed',
    app: 'ELF',
    unit: 'Gems',
    user: 'elf_seed',
    goal: 12,
    raised: 4,
    gifters: 2,
    cheer: 5,
    title: [
      'Pi ELF 씨앗 상점 12 Gems 부족 🌱',
      'Pi ELF seed shop — 12 Gems short 🌱',
      'Pi ELF 种子商店差 12 Gems 🌱',
      'Pi ELF の種ショップ、12 Gems 不足 🌱',
      'Tienda de semillas Pi ELF: faltan 12 Gems 🌱',
      'Cửa hàng hạt giống Pi ELF thiếu 12 Gems 🌱',
      'Boutique de graines Pi ELF : 12 Gems manquants 🌱',
      'Loja de sementes Pi ELF: faltam 12 Gems 🌱',
      'Магазин семян Pi ELF — не хватает 12 Gems 🌱',
      'Toko bibit Pi ELF kurang 12 Gems 🌱'
    ]
  },
  {
    id: 'kedheon-goods',
    app: 'KEDHEON',
    unit: 'BEOM',
    user: 'ked_rookie',
    goal: 40,
    raised: 25,
    gifters: 3,
    cheer: 9,
    title: [
      'Kedheon 루키 굿즈 40 BEOM 부족 🐆',
      'Kedheon rookie goods — 40 BEOM short 🐆',
      'Kedheon 新秀周边差 40 BEOM 🐆',
      'Kedheon ルーキーグッズ、40 BEOM 不足 🐆',
      'Artículos rookie de Kedheon: faltan 40 BEOM 🐆',
      'Đồ rookie Kedheon thiếu 40 BEOM 🐆',
      'Goods rookie Kedheon : 40 BEOM manquants 🐆',
      'Itens rookie Kedheon: faltam 40 BEOM 🐆',
      'Товары rookie в Kedheon — не хватает 40 BEOM 🐆',
      'Merch rookie Kedheon kurang 40 BEOM 🐆'
    ]
  },
  {
    id: 'bopi-dog',
    app: 'BOPI',
    unit: 'BOPIES',
    user: 'bopi_sora',
    goal: 60,
    raised: 18,
    gifters: 3,
    cheer: 6,
    title: [
      'BoPi World 강아지 집 60 BOPIES 모자람 🐶',
      'A dog house in BoPi World — 60 BOPIES short 🐶',
      'BoPi World 小狗屋差 60 BOPIES 🐶',
      'BoPi World の犬小屋、60 BOPIES 不足 🐶',
      'Casa de perro en BoPi World: faltan 60 BOPIES 🐶',
      'Nhà cho cún trong BoPi World thiếu 60 BOPIES 🐶',
      'Une niche dans BoPi World : 60 BOPIES manquants 🐶',
      'Casinha no BoPi World: faltam 60 BOPIES 🐶',
      'Собачья будка в BoPi World — не хватает 60 BOPIES 🐶',
      'Rumah anjing di BoPi World kurang 60 BOPIES 🐶'
    ]
  },
  {
    id: 'pi-arcade',
    app: 'ETC',
    unit: 'CREDIT',
    user: 'pi_arcade',
    goal: 300,
    raised: 120,
    gifters: 6,
    cheer: 14,
    title: [
      '새로 나온 파이 게임 300 크레딧 부족 🎮',
      'New Pi game — 300 credits short 🎮',
      '新上的 Pi 游戏差 300 积分 🎮',
      '新作パイゲーム、300 クレジット不足 🎮',
      'Nuevo juego Pi: faltan 300 créditos 🎮',
      'Game Pi mới thiếu 300 credit 🎮',
      'Nouveau jeu Pi : 300 crédits manquants 🎮',
      'Novo jogo Pi: faltam 300 créditos 🎮',
      'Новая игра Pi — не хватает 300 кредитов 🎮',
      'Game Pi baru kurang 300 kredit 🎮'
    ]
  }
];

/* ------------------------------------------------------------------
 * 명예의 전당 — 상품·추첨 없음. 앱별 단위가 달라 수량은 합산하지 않고
 * 오직 '선물 기록 건수'와 'BEOM 포인트'만 집계한다.
 * ------------------------------------------------------------------ */
export type HallTab = 'today' | 'total' | 'beom';

export interface HallRow {
  user: string;
  value: number;
}

export const HALL_SEED: Record<HallTab, HallRow[]> = {
  today: [
    { user: 'pioneer_0721', value: 12 },
    { user: 'bopi_hanul', value: 9 },
    { user: 'wallet_angel', value: 8 },
    { user: 'elf_mint', value: 6 },
    { user: 'han_river', value: 4 }
  ],
  total: [
    { user: 'kedheon_guardian', value: 214 },
    { user: 'wallet_angel', value: 186 },
    { user: 'pioneer_0721', value: 151 },
    { user: 'elf_mint', value: 98 },
    { user: 'bopi_nabi', value: 74 }
  ],
  beom: [
    { user: 'wallet_angel', value: 520 },
    { user: 'kedheon_guardian', value: 480 },
    { user: 'bopi_hanul', value: 310 },
    { user: 'elf_mint', value: 260 },
    { user: 'han_river', value: 190 }
  ]
};

/** 유명인 이름 차단 목록 — 사연 등록 단계에서 거절한다. */
export const CELEB_BLOCKLIST = [
  'musk', 'elon', '일론', '머스크',
  'trump', '트럼프', 'biden', '바이든',
  'taylor swift', '테일러 스위프트', 'bts', 'beatles', '비틀즈',
  'zuckerberg', '저커버그', 'bill gates', '빌 게이츠'
];

/**
 * 금액 표기 차단 — 원화·달러·Pi·GCV 금액을 접수 단계에서 막는다.
 * ('지원'·'원룸' 같은 낱말을 막지 않도록 통화 기호·금액 패턴만 본다.)
 */
export const FIAT_PATTERNS: RegExp[] = [
  /[₩$€]\s?\d/,
  /\d[\d,.]*\s*(원|달러|만원|억원|usd|krw)/i,
  /\b(gcv|usd|krw)\b/i,
  /\b\d[\d,.]*\s*pi\b/i,
  /\bpi\s?\d/i
];

/** 재화 단위로 쓸 수 없는 표기 (환전·법정화폐 오해) */
const FORBIDDEN_UNITS = ['pi', 'krw', 'usd', 'gcv', 'won', 'dollar'];

export function validUnit(raw: string): string | null {
  const unit = raw.trim().toUpperCase();
  if (!/^[A-Z][A-Z0-9]{1,9}$/.test(unit)) return null;
  if (FORBIDDEN_UNITS.includes(unit.toLowerCase())) return null;
  return unit;
}

/** 단위 표기 정규화 — BOPIES 처럼 이미 대문자면 그대로, Sigil 같은 표기는 살린다. */
export function cleanUnit(raw: string): string {
  return raw.trim().replace(/\s+/g, '').slice(0, 10);
}
