/* ------------------------------------------------------------------
 * XAEA12 — story board data
 * 10-tuple order: KR EN CN JP ES VN FR PT RU ID
 *
 * 규칙(코어팀 가이드라인):
 *  - @username + 사연 요약 + 순수 Pi 단위 목표만. 실명·계좌·연락처 0건.
 *  - 유명인 이름·사진·인용 0건. 추첨·확률형 리워드 0건.
 * ------------------------------------------------------------------ */

import type { L10, UIKey } from './i18n';

export type CatKey = 'home' | 'gift' | 'shop' | 'travel' | 'life';

export interface Cat {
  key: CatKey;
  icon: string;
  labelKey: UIKey;
}

/** 필터 순서 — 전체는 별도로 앞에 붙인다. */
export const CATS: Cat[] = [
  { key: 'home', icon: '🏠', labelKey: 'catHome' },
  { key: 'gift', icon: '🎁', labelKey: 'catGift' },
  { key: 'shop', icon: '🛒', labelKey: 'catShop' },
  { key: 'travel', icon: '✈️', labelKey: 'catTravel' },
  { key: 'life', icon: '🏥', labelKey: 'catLife' }
];

export const CAT_ICON: Record<CatKey, string> = {
  home: '🏠', gift: '🎁', shop: '🛒', travel: '✈️', life: '🏥'
};

export interface Story {
  id: string;
  cat: CatKey;
  /** 사연이 시작된 생태계 앱 이름(고유명사 — 번역하지 않는다) */
  src: string;
  /** @ 를 뺀 Pi username */
  user: string;
  goal: number;
  raised: number;
  backers: number;
  title: L10;
  /** 방문자가 이 브라우저에서 올린 사연 */
  local?: boolean;
}

/** 샘플 사연 — 1단계(Test-Pi) 리허설 보드. */
export const SAMPLE_STORIES: Story[] = [
  {
    id: 'bnpi-lease',
    cat: 'home',
    src: 'BNPi',
    user: 'hana_pioneer',
    goal: 20,
    raised: 13,
    backers: 9,
    title: [
      'BNPi 매물 계약까지 딱 20 Pi 부족합니다 🏠',
      'Just 20 Pi short of signing a BNPi lease 🏠',
      'BNPi 房源签约还差 20 Pi 🏠',
      'BNPi 物件の契約まであと20 Pi 🏠',
      'Faltan 20 Pi para firmar un alquiler en BNPi 🏠',
      'Thiếu đúng 20 Pi để ký hợp đồng BNPi 🏠',
      'Il manque 20 Pi pour signer un bail BNPi 🏠',
      'Faltam 20 Pi para assinar um aluguel na BNPi 🏠',
      'Не хватает 20 Pi до договора на BNPi 🏠',
      'Kurang 20 Pi untuk kontrak sewa di BNPi 🏠'
    ]
  },
  {
    id: 'hangang-jeju',
    cat: 'travel',
    src: 'Hangang',
    user: 'jeju_walker',
    goal: 12,
    raised: 12,
    backers: 11,
    title: [
      'Hangang 제주 3일 패스, 딱 12 Pi 부족했습니다 ✈️',
      'Hangang Jeju 3-day pass — was 12 Pi short ✈️',
      'Hangang 济州 3 日通票，当时差 12 Pi ✈️',
      'Hangang 済州3日パス、あと12 Pi でした ✈️',
      'Pase Hangang Jeju 3 días: faltaban 12 Pi ✈️',
      'Pass Hangang Jeju 3 ngày — từng thiếu 12 Pi ✈️',
      'Pass Hangang Jeju 3 jours : il manquait 12 Pi ✈️',
      'Passe Hangang Jeju 3 dias: faltavam 12 Pi ✈️',
      'Пасс Hangang Чеджу на 3 дня — не хватало 12 Pi ✈️',
      'Pass Hangang Jeju 3 hari — kurang 12 Pi ✈️'
    ]
  },
  {
    id: 'gift-mother',
    cat: 'gift',
    src: 'Kedheon',
    user: 'miso_k',
    goal: 6,
    raised: 2,
    backers: 2,
    title: [
      '어머니 생신 선물, 6 Pi만 보태면 완성됩니다 🎁',
      'A birthday gift for my mother — 6 Pi completes it 🎁',
      '给妈妈的生日礼物，再补 6 Pi 就完成 🎁',
      '母の誕生日プレゼント、あと6 Pi で完成 🎁',
      'Un regalo de cumpleaños para mi madre: 6 Pi lo completan 🎁',
      'Quà sinh nhật cho mẹ, thêm 6 Pi là đủ 🎁',
      'Un cadeau d’anniversaire pour ma mère : 6 Pi le complètent 🎁',
      'Um presente de aniversário para minha mãe: 6 Pi completam 🎁',
      'Подарок маме на день рождения — не хватает 6 Pi 🎁',
      'Hadiah ulang tahun untuk ibu, kurang 6 Pi 🎁'
    ]
  },
  {
    id: 'farm-rice',
    cat: 'shop',
    src: 'Kedheon',
    user: 'green_farm',
    goal: 8,
    raised: 5,
    backers: 4,
    title: [
      '농가 직거래 쌀 5kg 첫 주문, 8 Pi 부족 🛒',
      'First 5 kg direct-from-farm rice order — 8 Pi short 🛒',
      '农户直供大米 5kg 首单，差 8 Pi 🛒',
      '農家直送米5kgの初回注文、8 Pi 不足 🛒',
      'Primer pedido de 5 kg de arroz directo del campo: faltan 8 Pi 🛒',
      'Đơn gạo 5kg thẳng từ nông trại, thiếu 8 Pi 🛒',
      'Première commande de 5 kg de riz à la ferme : 8 Pi manquent 🛒',
      'Primeiro pedido de 5 kg de arroz direto da fazenda: faltam 8 Pi 🛒',
      'Первый заказ 5 кг риса от фермера — не хватает 8 Pi 🛒',
      'Pesanan pertama beras 5 kg langsung petani, kurang 8 Pi 🛒'
    ]
  },
  {
    id: 'clinic-ride',
    cat: 'life',
    src: 'FactFilter',
    user: 'care_neo',
    goal: 4,
    raised: 1,
    backers: 1,
    title: [
      '병원 왕복 교통비, 4 Pi만 있으면 됩니다 🏥',
      'Round-trip fare to the clinic needs only 4 Pi 🏥',
      '往返医院的交通费，只差 4 Pi 🏥',
      '病院までの往復交通費、あと4 Pi 🏥',
      'El viaje de ida y vuelta a la clínica: solo 4 Pi 🏥',
      'Tiền xe khứ hồi tới phòng khám, chỉ 4 Pi 🏥',
      'Le trajet aller-retour à la clinique : 4 Pi suffisent 🏥',
      'A ida e volta à clínica: só 4 Pi 🏥',
      'Дорога до клиники и обратно — нужно лишь 4 Pi 🏥',
      'Ongkos pulang-pergi ke klinik, cukup 4 Pi 🏥'
    ]
  },
  {
    id: 'studio-deposit',
    cat: 'home',
    src: 'BNPi',
    user: 'studio_han',
    goal: 30,
    raised: 21,
    backers: 15,
    title: [
      '설계 작업실 보증금 30 Pi, 21 Pi까지 모였습니다 🏠',
      'Deposit for a design studio: 21 of 30 Pi gathered 🏠',
      '设计工作室押金 30 Pi，已筹到 21 Pi 🏠',
      '設計スタジオの保証金30 Pi、21 Pi まで集まりました 🏠',
      'Depósito de un estudio de diseño: 21 de 30 Pi 🏠',
      'Tiền cọc xưởng thiết kế: đã góp 21/30 Pi 🏠',
      'Dépôt d’un studio de design : 21 Pi sur 30 🏠',
      'Depósito de um estúdio de design: 21 de 30 Pi 🏠',
      'Залог за мастерскую: собрано 21 из 30 Pi 🏠',
      'Deposit studio desain: terkumpul 21 dari 30 Pi 🏠'
    ]
  },
  {
    id: 'busan-pass',
    cat: 'travel',
    src: 'Hangang',
    user: 'surf_busan',
    goal: 15,
    raised: 6,
    backers: 5,
    title: [
      '부산 KTX+숙소 묶음, 15 Pi 부족 ✈️',
      'Busan KTX plus stay bundle — 15 Pi short ✈️',
      '釜山 KTX+住宿套票，差 15 Pi ✈️',
      '釜山 KTX＋宿泊セット、15 Pi 不足 ✈️',
      'Pack KTX y alojamiento en Busan: faltan 15 Pi ✈️',
      'Combo KTX và lưu trú Busan: thiếu 15 Pi ✈️',
      'Forfait KTX et séjour à Busan : 15 Pi manquent ✈️',
      'Combo KTX e hospedagem em Busan: faltam 15 Pi ✈️',
      'Пакет KTX и жильё в Пусане — не хватает 15 Pi ✈️',
      'Paket KTX dan penginapan Busan, kurang 15 Pi ✈️'
    ]
  },
  {
    id: 'book-shelf',
    cat: 'shop',
    src: 'Kedheon',
    user: 'page_turner',
    goal: 5,
    raised: 3,
    backers: 3,
    title: [
      '동네 서점 첫 진열대, 5 Pi 부족 🛒',
      'First shelf for a neighbourhood bookshop — 5 Pi short 🛒',
      '社区书店第一个书架，差 5 Pi 🛒',
      '町の書店の最初の棚、5 Pi 不足 🛒',
      'Primera estantería de una librería de barrio: faltan 5 Pi 🛒',
      'Kệ sách đầu tiên của hiệu sách nhỏ: thiếu 5 Pi 🛒',
      'Première étagère d’une librairie de quartier : 5 Pi manquent 🛒',
      'Primeira estante de uma livraria de bairro: faltam 5 Pi 🛒',
      'Первая полка книжной лавки — не хватает 5 Pi 🛒',
      'Rak pertama toko buku lingkungan, kurang 5 Pi 🛒'
    ]
  }
];

/* ------------------------------------------------------------------
 * 놀이터 명예의 전당 — 상품·추첨 없음. 순수 명예 기록.
 * ------------------------------------------------------------------ */
export type HallTab = 'today' | 'total' | 'beom';

export interface HallRow {
  user: string;
  value: number;
}

export const HALL_SEED: Record<HallTab, HallRow[]> = {
  today: [
    { user: 'pioneer_0721', value: 14 },
    { user: 'hana_pioneer', value: 9 },
    { user: 'wallet_angel', value: 7 },
    { user: 'green_farm', value: 6 },
    { user: 'jeju_walker', value: 4 }
  ],
  total: [
    { user: 'kedheon_guardian', value: 240 },
    { user: 'wallet_angel', value: 186 },
    { user: 'pioneer_0721', value: 151 },
    { user: 'care_neo', value: 98 },
    { user: 'miso_k', value: 74 }
  ],
  beom: [
    { user: 'wallet_angel', value: 520 },
    { user: 'kedheon_guardian', value: 480 },
    { user: 'hana_pioneer', value: 310 },
    { user: 'page_turner', value: 260 },
    { user: 'studio_han', value: 190 }
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
 * 순수 Pi 단위만 — 원화·달러·GCV 금액 표기를 접수 단계에서 막는다.
 * ('지원'·'원룸' 같은 낱말을 막지 않도록 통화 기호·금액 패턴만 본다.)
 */
export const FIAT_PATTERNS: RegExp[] = [
  /[₩$]\s?\d/,
  /\d[\d,.]*\s*(원|달러|만원|억원|usd|krw)/i,
  /\b(gcv|usd|krw)\b/i
];
