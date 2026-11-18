/* ------------------------------------------------------------------
 * Hangang — 클릭형 아코디언 UI 라벨 (10개국어 고정 10-tuple)
 * order: KR EN CN JP ES VN FR PT RU ID
 * ------------------------------------------------------------------ */

import type { L10 } from './i18n';

export const ACL = {
  /** 목록을 전부 펼치는 버튼 */
  showAll: [
    '전체 보기', 'Show all', '全部查看', 'すべて見る', 'Ver todo',
    'Xem tất cả', 'Tout voir', 'Ver tudo', 'Показать все', 'Lihat semua'
  ],
  /** 펼친 목록을 다시 접는 버튼 */
  showLess: [
    '접기', 'Show less', '收起', '閉じる', 'Mostrar menos',
    'Thu gọn', 'Réduire', 'Recolher', 'Свернуть', 'Tutup'
  ],
  /** 04 예매 — 10단계·규정 접힘 버튼 */
  rulesRow: [
    '예매 10단계 · 규정 보기', '10 steps & rules', '购票 10 步·规定', '予約10ステップ・規定',
    '10 pasos y normas', '10 bước & quy định', '10 étapes et règles', '10 passos e regras',
    '10 шагов и правила', '10 langkah & aturan'
  ],
  /** "막히면 이렇게"가 뜻하는 것 한 줄 */
  bypassHint: [
    '이 단계에서 막히면 위 방법으로 넘어가면 됩니다.',
    'If this step blocks you, one of these gets you through.',
    '这一步被卡住时，用上面的办法绕过去。',
    'ここで詰まったら、上の方法で先へ進めます。',
    'Si este paso te bloquea, una de estas vías te sirve.',
    'Nếu bước này chặn bạn, một trong các cách trên sẽ giúp.',
    'Si cette étape vous bloque, l’une de ces solutions passe.',
    'Se esta etapa travar, uma destas opções resolve.',
    'Если шаг недоступен, один из этих способов поможет.',
    'Kalau langkah ini terhambat, salah satu cara di atas membantu.'
  ]
} satisfies Record<string, L10>;
