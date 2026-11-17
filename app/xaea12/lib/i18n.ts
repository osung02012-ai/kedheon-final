/* ------------------------------------------------------------------
 * XAEA12 — 10-language layer
 * KR · EN · CN · JP · ES · VN · FR · PT · RU · ID
 * Every string is a fixed 10-tuple so a missing language fails the build.
 * ------------------------------------------------------------------ */

export type Lang = 'KR' | 'EN' | 'CN' | 'JP' | 'ES' | 'VN' | 'FR' | 'PT' | 'RU' | 'ID';

export type L10 = readonly [
  string, string, string, string, string,
  string, string, string, string, string
];

export const LANG_ORDER: Lang[] = ['KR', 'EN', 'CN', 'JP', 'ES', 'VN', 'FR', 'PT', 'RU', 'ID'];

export const LANG_INDEX: Record<Lang, number> = {
  KR: 0, EN: 1, CN: 2, JP: 3, ES: 4, VN: 5, FR: 6, PT: 7, RU: 8, ID: 9
};

export const LANG_TAG: Record<Lang, string> = {
  KR: 'ko', EN: 'en', CN: 'zh', JP: 'ja', ES: 'es',
  VN: 'vi', FR: 'fr', PT: 'pt', RU: 'ru', ID: 'id'
};

export const LANGS: { code: Lang; flag: string; label: string }[] = [
  { code: 'KR', flag: '🇰🇷', label: 'KR' },
  { code: 'EN', flag: '🇺🇸', label: 'EN' },
  { code: 'CN', flag: '🇨🇳', label: 'CN' },
  { code: 'JP', flag: '🇯🇵', label: 'JP' },
  { code: 'ES', flag: '🇪🇸', label: 'ES' },
  { code: 'VN', flag: '🇻🇳', label: 'VN' },
  { code: 'FR', flag: '🇫🇷', label: 'FR' },
  { code: 'PT', flag: '🇵🇹', label: 'PT' },
  { code: 'RU', flag: '🇷🇺', label: 'RU' },
  { code: 'ID', flag: '🇮🇩', label: 'ID' }
];

/** Read one language out of a 10-tuple. */
export function tr(v: L10, lang: Lang): string {
  return v[LANG_INDEX[lang]] ?? v[1];
}

/** Detect the visitor's browser language once, on mount. */
export function detectLang(): Lang {
  if (typeof navigator === 'undefined') return 'EN';
  const list = (navigator.languages && navigator.languages.length
    ? navigator.languages
    : [navigator.language || 'en']
  ).map(l => l.toLowerCase());
  for (const raw of list) {
    const l = raw.split('-')[0];
    if (l === 'ko') return 'KR';
    if (l === 'en') return 'EN';
    if (l === 'zh') return 'CN';
    if (l === 'ja') return 'JP';
    if (l === 'es') return 'ES';
    if (l === 'vi') return 'VN';
    if (l === 'fr') return 'FR';
    if (l === 'pt') return 'PT';
    if (l === 'ru') return 'RU';
    if (l === 'id') return 'ID';
  }
  return 'EN';
}

/* ------------------------------------------------------------------
 * UI dictionary — one line per label, 10 languages each.
 * ------------------------------------------------------------------ */
export const UI = {
  heroTitle: [
    '딱 N Pi 모자란 순간, 파이오니어가 채웁니다',
    'When you are N Pi short, pioneers fill the gap',
    '只差 N Pi 的那一刻，先锋为你补上',
    'あと N Pi 足りない瞬間、パイオニアが埋めます',
    'Cuando te faltan N Pi, los pioneros lo completan',
    'Khi thiếu đúng N Pi, các pioneer lấp đầy',
    'Quand il manque N Pi, les pionniers complètent',
    'Quando faltam N Pi, os pioneiros completam',
    'Когда не хватает N Pi, пионеры дополнят',
    'Saat kurang N Pi, para pioneer menutupnya'
  ],
  heroDesc: [
    'BNPi 주거·Hangang 여행·커머스·생활 결제 직전에 부족한 Pi를, 여유 있는 파이오니어가 1 Pi씩 보태거나 원탭으로 완납하는 상호부조 놀이터.',
    'Before a BNPi home, a Hangang trip, a commerce order or a daily emergency, pioneers with spare Pi chip in 1 Pi or finish the gap in one tap.',
    '在 BNPi 住房、Hangang 旅行、商城下单或生活急需之前，有余力的先锋可 1 Pi 相助或一键补齐缺口。',
    'BNPi の住まい・Hangang 旅行・コマース・生活の支払い直前、余裕のあるパイオニアが 1 Pi ずつ足すかワンタップで不足分を完済します。',
    'Antes de una vivienda en BNPi, un viaje Hangang, una compra o una urgencia diaria, quien tiene Pi de sobra aporta 1 Pi o cubre el hueco de un toque.',
    'Trước khi chốt nhà BNPi, chuyến đi Hangang, đơn hàng hay việc gấp, pioneer dư Pi góp 1 Pi hoặc lấp đủ thiếu hụt bằng một chạm.',
    'Avant un logement BNPi, un voyage Hangang, une commande ou une urgence, ceux qui ont du Pi ajoutent 1 Pi ou comblent le manque en un geste.',
    'Antes de uma casa na BNPi, uma viagem Hangang, um pedido ou uma urgência, quem tem Pi sobrando entra com 1 Pi ou cobre a falta num toque.',
    'Перед покупкой жилья на BNPi, поездкой Hangang, заказом или срочной нуждой пионеры с запасом Pi добавляют 1 Pi или закрывают нехватку одним нажатием.',
    'Sebelum rumah BNPi, trip Hangang, pesanan, atau kebutuhan mendesak, pioneer yang punya sisa Pi menambah 1 Pi atau menutup kekurangan sekali ketuk.'
  ],
  heroTag1: [
    '1단계 · Test-Pi 리허설', 'Stage 1 · Test-Pi rehearsal', '第一阶段 · Test-Pi 演练', 'ステージ1 · Test-Pi リハーサル',
    'Fase 1 · ensayo Test-Pi', 'Bước 1 · diễn tập Test-Pi', 'Étape 1 · répétition Test-Pi',
    'Fase 1 · ensaio Test-Pi', 'Этап 1 · репетиция Test-Pi', 'Tahap 1 · latihan Test-Pi'
  ],
  heroTag2: [
    '실제 금전 정산 아님', 'no real money settles', '不作真实结算', '実際の決済なし',
    'sin liquidación real', 'không quyết toán thật', 'aucun règlement réel',
    'sem liquidação real', 'без реальных расчётов', 'tanpa penyelesaian nyata'
  ],
  statFee: [
    '보태기 수수료 0%', '0% chip-in fee', '相助手续费 0%', '参加手数料 0%',
    '0 % de comisión', '0% phí góp', '0 % de frais', '0% de taxa', '0% комиссии', '0% biaya'
  ],
  statStage: [
    '2단계 시나리오', '2-stage roadmap', '两阶段路线', '2段階シナリオ',
    'Plan de 2 fases', 'Lộ trình 2 bước', 'Feuille de route en 2 étapes', 'Roteiro em 2 fases',
    'Сценарий из 2 этапов', 'Peta jalan 2 tahap'
  ],
  statBeom: [
    'BEOM 포인트', 'BEOM points', 'BEOM 积分', 'BEOM ポイント',
    'puntos BEOM', 'điểm BEOM', 'points BEOM', 'pontos BEOM', 'баллы BEOM', 'poin BEOM'
  ],
  statAuto: [
    '100% 자동 마감', 'auto-close at 100%', '100% 自动关闭', '100% で自動締切',
    'cierre automático al 100 %', 'tự đóng khi 100%', 'clôture auto à 100 %',
    'fecha automática em 100%', 'автозакрытие при 100%', 'tutup otomatis di 100%'
  ],
  statFeeS: ['수수료', 'fee', '手续费', '手数料', 'comisión', 'phí', 'frais', 'taxa', 'комиссия', 'biaya'],
  statStageS: ['1단계', 'stage 1', '第一阶段', 'ステージ1', 'fase 1', 'bước 1', 'étape 1', 'fase 1', 'этап 1', 'tahap 1'],
  statBeomS: ['BEOM', 'BEOM', 'BEOM', 'BEOM', 'BEOM', 'BEOM', 'BEOM', 'BEOM', 'BEOM', 'BEOM'],
  statAutoS: ['자동마감', 'auto-close', '自动关闭', '自動締切', 'cierre auto', 'tự đóng', 'clôture auto', 'fecha auto', 'автозакрытие', 'tutup auto'],

  secStageTitle: [
    '2단계 시나리오', 'The two stages', '两阶段路线', '2段階シナリオ',
    'Las dos fases', 'Hai giai đoạn', 'Les deux étapes', 'As duas fases',
    'Два этапа', 'Dua tahap'
  ],
  secStageDesc: [
    '지금은 Test-Pi로 규칙을 익히는 1단계, Mainnet에서 실제 Pi로 이어지는 2단계입니다. 두 단계 모두 명예 배지는 승계됩니다.',
    'Stage 1 rehearses the rules in Test-Pi. Stage 2 carries the same stories onto real Pi on Mainnet — and your honour badges follow you.',
    '第一阶段用 Test-Pi 熟悉规则，第二阶段在主网以真实 Pi 继续，荣誉徽章全部继承。',
    'ステージ1は Test-Pi でルールを練習し、ステージ2はメインネットで実際の Pi に引き継がれます。名誉バッジはそのまま継承されます。',
    'La fase 1 ensaya las reglas con Test-Pi; la fase 2 las lleva al Pi real en Mainnet y conserva tus insignias de honor.',
    'Bước 1 tập quy tắc bằng Test-Pi, bước 2 chuyển sang Pi thật trên Mainnet và giữ nguyên huy hiệu danh dự.',
    'L’étape 1 répète les règles en Test-Pi, l’étape 2 les prolonge en Pi réel sur Mainnet — vos badges d’honneur suivent.',
    'A fase 1 ensaia as regras em Test-Pi, a fase 2 leva tudo ao Pi real na Mainnet — seus selos de honra continuam.',
    'Этап 1 отрабатывает правила в Test-Pi, этап 2 переносит их на реальные Pi в Mainnet, а ваши знаки чести сохраняются.',
    'Tahap 1 melatih aturan dengan Test-Pi, tahap 2 berlanjut ke Pi nyata di Mainnet, dan lencana kehormatan Anda tetap terbawa.'
  ],
  stage1Label: [
    '1단계 · 지금 여기', 'Stage 1 · live now', '第一阶段 · 现在', 'ステージ1 · 現在',
    'Fase 1 · ahora', 'Bước 1 · hiện tại', 'Étape 1 · maintenant', 'Fase 1 · agora',
    'Этап 1 · сейчас', 'Tahap 1 · sekarang'
  ],
  stage1Title: [
    'Testnet 리허설 놀이터', 'Testnet rehearsal playground', '测试网演练场', 'テストネット・リハーサル広場',
    'Patio de ensayo Testnet', 'Sân diễn tập Testnet', 'Terrain de répétition Testnet',
    'Pátio de ensaio Testnet', 'Репетиционная площадка Testnet', 'Taman latihan Testnet'
  ],
  stage1Desc: [
    'Test-Pi 체험판으로 사연·보태기·완납 흐름을 미리 익힙니다. 🐾 BEOM 포인트와 선구자 배지가 쌓이고, Pi 알림 센터 자리를 지금 선점합니다.',
    'Learn the story, chip-in and full-rescue flow with Test-Pi. You stack 🐾 BEOM points and pioneer badges, and reserve your place in the Pi notification centre now.',
    '用 Test-Pi 体验版预先熟悉发愿、相助与补齐的流程。🐾 BEOM 积分与先驱徽章累积，并先行占位 Pi 通知中心。',
    'Test-Pi 体験版でストーリー・参加・完済の流れを先に練習します。🐾 BEOM ポイントと先駆者バッジが貯まり、Pi 通知センターの席を今押さえます。',
    'Aprende con Test-Pi el flujo de relato, aporte y rescate total. Acumulas 🐾 BEOM, insignias de pionero y reservas tu lugar en el centro de notificaciones Pi.',
    'Học trước luồng đăng câu chuyện, góp và trả nốt bằng Test-Pi. Bạn tích 🐾 BEOM, huy hiệu tiên phong và giữ chỗ ở trung tâm thông báo Pi.',
    'Apprenez le parcours récit, contribution et sauvetage complet en Test-Pi. Vous accumulez 🐾 BEOM, badges de pionnier et réservez votre place au centre de notifications Pi.',
    'Aprenda com Test-Pi o fluxo de relato, contribuição e resgate total. Você acumula 🐾 BEOM, selos de pioneiro e reserva seu lugar no centro de notificações Pi.',
    'Освойте на Test-Pi сценарий «история — вклад — полное спасение». Копятся 🐾 BEOM, знаки первопроходца, и вы заранее бронируете место в центре уведомлений Pi.',
    'Pelajari alur cerita, bantu, dan lunasi penuh lewat Test-Pi. Anda mengumpulkan 🐾 BEOM, lencana perintis, dan memesan tempat di pusat notifikasi Pi.'
  ],
  stage1b1: [
    'Test-Pi 체험판 — 실제 Pi가 오가지 않습니다',
    'Test-Pi sandbox — no real Pi moves',
    'Test-Pi 体验版 — 不流动真实 Pi',
    'Test-Pi 体験版 — 実際の Pi は動きません',
    'Sandbox Test-Pi: no se mueve Pi real',
    'Bản Test-Pi: không có Pi thật',
    'Bac à sable Test-Pi : aucun Pi réel',
    'Sandbox Test-Pi: nenhum Pi real',
    'Песочница Test-Pi: реальные Pi не двигаются',
    'Sandbox Test-Pi: tidak ada Pi nyata'
  ],
  stage1b2: [
    '🐾 BEOM 포인트 · 선구자 배지 적립',
    '🐾 BEOM points · pioneer badges',
    '🐾 BEOM 积分 · 先驱徽章',
    '🐾 BEOM ポイント・先駆者バッジ',
    '🐾 puntos BEOM · insignias de pionero',
    '🐾 điểm BEOM · huy hiệu tiên phong',
    '🐾 points BEOM · badges de pionnier',
    '🐾 pontos BEOM · selos de pioneiro',
    '🐾 баллы BEOM · знаки первопроходца',
    '🐾 poin BEOM · lencana perintis'
  ],
  stage1b3: [
    'Pi 알림 센터 선점 (Mainnet 전환 시 이어짐)',
    'Pi notification-centre slot reserved for Mainnet',
    '先行占位 Pi 通知中心（主网上线延续）',
    'Pi 通知センターの席を確保（メインネットに継承）',
    'Reserva en el centro de notificaciones Pi para Mainnet',
    'Giữ chỗ trung tâm thông báo Pi cho Mainnet',
    'Place réservée au centre de notifications Pi pour Mainnet',
    'Vaga reservada no centro de notificações Pi para a Mainnet',
    'Место в центре уведомлений Pi закреплено за Mainnet',
    'Slot pusat notifikasi Pi dipesan untuk Mainnet'
  ],
  stage1Note: [
    '※ 1단계의 모든 수치는 연습 기록입니다. 실제 금전 정산이 아닙니다.',
    '※ Every figure in Stage 1 is a practice record, not a real settlement.',
    '※ 第一阶段所有数值均为练习记录，不作真实结算。',
    '※ ステージ1の数値はすべて練習記録で、実際の決済ではありません。',
    '※ Todas las cifras de la fase 1 son registro de práctica, no liquidación real.',
    '※ Mọi con số ở bước 1 chỉ là bản ghi luyện tập, không phải quyết toán thật.',
    '※ Tous les chiffres de l’étape 1 sont un relevé d’entraînement, pas un règlement réel.',
    '※ Todos os números da fase 1 são registro de treino, não liquidação real.',
    '※ Все цифры этапа 1 — учебная запись, а не реальный расчёт.',
    '※ Semua angka tahap 1 adalah catatan latihan, bukan penyelesaian nyata.'
  ],
  stage2Label: [
    '2단계 · Mainnet 실전', 'Stage 2 · Mainnet', '第二阶段 · 主网实战', 'ステージ2 · メインネット',
    'Fase 2 · Mainnet', 'Bước 2 · Mainnet', 'Étape 2 · Mainnet', 'Fase 2 · Mainnet',
    'Этап 2 · Mainnet', 'Tahap 2 · Mainnet'
  ],
  stage2Title: [
    'Pi 온체인 실전 집계', 'Live on-chain Pi settlement', 'Pi 链上实战记账', 'Pi オンチェーン実集計',
    'Liquidación real on-chain', 'Quyết toán on-chain thật', 'Règlement on-chain réel',
    'Liquidação on-chain real', 'Реальные ончейн-расчёты', 'Penyelesaian on-chain nyata'
  ],
  stage2Desc: [
    '실제 Pi 결제로 전환되면 보태기·완납이 온체인 해시로 투명하게 집계됩니다. 100% 달성 시 자동 마감되고, 1단계 명예 배지는 그대로 승계됩니다.',
    'On real Pi, every chip-in and rescue is tallied by on-chain hash. A story closes automatically at 100%, and your Stage 1 honour badges carry over.',
    '转为真实 Pi 支付后，相助与补齐都以链上哈希透明记账。达 100% 自动关闭，第一阶段的荣誉徽章照常继承。',
    '実際の Pi 決済に移行すると、参加・完済はオンチェーンハッシュで透明に集計されます。100% で自動締切、ステージ1の名誉バッジはそのまま継承されます。',
    'Con Pi real, cada aporte y rescate se registra por hash on-chain. El relato se cierra al 100 % y las insignias de la fase 1 se conservan.',
    'Khi dùng Pi thật, mỗi lần góp và trả nốt được ghi bằng hash on-chain. Câu chuyện tự đóng ở 100% và huy hiệu bước 1 được giữ nguyên.',
    'En Pi réel, chaque contribution et sauvetage est enregistré par hash on-chain. Le récit se clôture à 100 % et les badges de l’étape 1 sont conservés.',
    'Com Pi real, cada contribuição e resgate fica registrado por hash on-chain. O relato fecha ao 100% e os selos da fase 1 permanecem.',
    'На реальных Pi каждый вклад и спасение фиксируются ончейн-хешем. История закрывается на 100%, а знаки этапа 1 сохраняются.',
    'Dengan Pi nyata, setiap bantuan dan pelunasan dicatat lewat hash on-chain. Cerita tertutup di 100% dan lencana tahap 1 tetap berlaku.'
  ],
  stage2b1: [
    '실제 Pi 온체인 해시 투명 집계',
    'Real Pi tallied by on-chain hash',
    '真实 Pi 以链上哈希透明记账',
    '実際の Pi をオンチェーンハッシュで透明集計',
    'Pi real contado por hash on-chain',
    'Pi thật ghi bằng hash on-chain',
    'Pi réel compté par hash on-chain',
    'Pi real contado por hash on-chain',
    'Реальные Pi учтены ончейн-хешем',
    'Pi nyata dihitung lewat hash on-chain'
  ],
  stage2b2: [
    '100% 달성 시 자동 마감 (초과 수취 없음)',
    'Auto-close at 100 % — never over-collects',
    '达 100% 自动关闭，绝不超额收取',
    '100% で自動締切（超過受取なし）',
    'Cierre al 100 %: nunca cobra de más',
    'Tự đóng ở 100% — không thu vượt',
    'Clôture à 100 % — jamais de surplus',
    'Fecha em 100% — nunca cobra a mais',
    'Автозакрытие на 100% — без перебора',
    'Tutup di 100% — tidak pernah lebih'
  ],
  stage2b3: [
    '1단계 🐾 BEOM · 명예 배지 승계',
    'Stage 1 🐾 BEOM and honour badges carry over',
    '第一阶段的 🐾 BEOM 与荣誉徽章继承',
    'ステージ1の 🐾 BEOM・名誉バッジを継承',
    '🐾 BEOM e insignias de la fase 1 se conservan',
    '🐾 BEOM và huy hiệu bước 1 được giữ',
    '🐾 BEOM et badges de l’étape 1 conservés',
    '🐾 BEOM e selos da fase 1 permanecem',
    '🐾 BEOM и знаки этапа 1 сохраняются',
    '🐾 BEOM dan lencana tahap 1 tetap terbawa'
  ],

  secSafetyTitle: [
    '코어팀 가이드라인 3대 안전장치', 'Three safety rails from the Core Team guidelines',
    '核心团队指南三大安全装置', 'コアチーム指針の3大安全装置',
    'Tres barandillas de las directrices del Core Team', 'Ba chốt an toàn theo hướng dẫn Core Team',
    'Trois garde-fous des règles du Core Team', 'Três travas das diretrizes do Core Team',
    'Три предохранителя из правил Core Team', 'Tiga pengaman pedoman Core Team'
  ],
  secSafetyDesc: [
    '파이 생태계 규정을 화면 설계와 접수 검증으로 지킵니다. 사연 보드·등록 폼·랭킹 어디에도 예외는 없습니다.',
    'Pi ecosystem rules are enforced in the design and in intake validation — on the board, the form and the ranking alike.',
    '以界面设计与受理校验落实 Pi 生态规定，看板、表单与排行榜无一例外。',
    'Pi エコシステムの規律を画面設計と受付検証で守ります。ボード・投稿フォーム・ランキングに例外はありません。',
    'Las reglas del ecosistema Pi se aplican en el diseño y en la validación del formulario: tablero, alta y ranking.',
    'Quy định hệ sinh thái Pi được thực thi trong thiết kế và khâu xét duyệt: bảng, biểu mẫu, bảng xếp hạng.',
    'Les règles de l’écosystème Pi sont appliquées au design et à la validation : tableau, formulaire, classement.',
    'As regras do ecossistema Pi valem no design e na validação: painel, formulário e ranking.',
    'Правила экосистемы Pi заложены в дизайн и в проверку заявок: доска, форма, рейтинг.',
    'Aturan ekosistem Pi diterapkan pada desain dan validasi: papan, formulir, peringkat.'
  ],
  safe1Title: ['유명인 0건', 'Zero celebrities', '零名人', '著名人 0 件', 'Cero famosos', 'Không có người nổi tiếng', 'Aucune célébrité', 'Zero celebridades', 'Ноль знаменитостей', 'Nol selebriti'],
  safe1Body: [
    '일론 머스크 등 유명인의 이름·사진·인용은 한 건도 등재하지 않습니다. 이름을 넣은 사연은 접수 단계에서 거절됩니다.',
    'No celebrity name, photo or quote — Musk included — appears anywhere. A story naming one is rejected at intake.',
    '马斯克等名人的姓名、照片、引用一律不收录，含姓名的故事在受理阶段即被拒绝。',
    'イーロン・マスクら著名人の氏名・写真・引用は一件も載せません。名前を含むストーリーは受付で拒否されます。',
    'Ningún nombre, foto o cita de famosos —Musk incluido— aparece aquí. Un relato que los nombre se rechaza al recibirlo.',
    'Không có tên, ảnh hay câu trích của người nổi tiếng (kể cả Musk). Câu chuyện nêu tên sẽ bị từ chối khi tiếp nhận.',
    'Aucun nom, photo ou citation de célébrité — Musk compris — n’apparaît. Un récit qui en nomme une est refusé à la réception.',
    'Nenhum nome, foto ou citação de celebridade — Musk incluído — aparece. Relato que os cite é recusado no recebimento.',
    'Ни имени, ни фото, ни цитаты знаменитостей (включая Маска) здесь нет. История с таким именем отклоняется при приёме.',
    'Tidak ada nama, foto, atau kutipan selebriti (termasuk Musk). Cerita yang menyebutnya ditolak saat diterima.'
  ],
  safe2Title: ['실명·계좌 0건', 'Zero real names or accounts', '零实名与账号', '実名・口座 0 件', 'Cero nombres o cuentas', 'Không tên thật hay tài khoản', 'Aucun nom ni compte', 'Zero nomes ou contas', 'Ноль имён и счетов', 'Nol nama atau rekening'],
  safe2Body: [
    '실명·계좌번호·연락처는 받지도 보여 주지도 않습니다. 오직 @username, 사연 요약, 순수 Pi 단위 목표만 표기하며 원화·달러·GCV 표기는 0건입니다.',
    'Real names, bank accounts and phone numbers are neither collected nor shown. Only @username, a story summary and a goal in pure Pi — no KRW, USD or GCV figures.',
    '不收集也不显示实名、账号与联系方式。只显示 @username、故事摘要与纯 Pi 单位目标，韩元、美元、GCV 标注为零。',
    '実名・口座番号・連絡先は受け取らず表示もしません。@username、ストーリー要約、純粋な Pi 単位の目標のみ。ウォン・ドル・GCV 表記は 0 件です。',
    'No se recogen ni se muestran nombres, cuentas ni teléfonos. Solo @username, resumen y meta en Pi puro, sin cifras en KRW, USD ni GCV.',
    'Không thu thập hay hiển thị tên thật, số tài khoản, liên hệ. Chỉ @username, tóm tắt và mục tiêu bằng Pi thuần — không KRW, USD hay GCV.',
    'Ni noms réels, ni comptes, ni téléphones. Seuls @username, un résumé et un objectif en Pi pur — aucun montant en KRW, USD ou GCV.',
    'Nada de nomes, contas ou telefones. Só @username, resumo e meta em Pi puro — sem valores em KRW, USD ou GCV.',
    'Имена, счета и телефоны не собираются и не показываются. Только @username, краткая история и цель в чистых Pi — без вон, долларов и GCV.',
    'Nama asli, rekening, dan kontak tidak diambil maupun ditampilkan. Hanya @username, ringkasan, dan target dalam Pi murni — tanpa KRW, USD, atau GCV.'
  ],
  safe3Title: ['추첨·확률 0건', 'Zero draws or odds', '零抽奖与概率', '抽選・確率 0 件', 'Cero sorteos o azar', 'Không bốc thăm, không may rủi', 'Aucun tirage ni hasard', 'Zero sorteio ou azar', 'Ноль лотерей и шансов', 'Nol undian atau peluang'],
  safe3Body: [
    '추첨·복권·확률형 리워드는 없습니다. 보상은 순수 명예 배지, 구원자 랭킹, 🐾 BEOM 포인트뿐입니다.',
    'No draws, lotteries or chance-based rewards. The only rewards are honour badges, the rescuer ranking and 🐾 BEOM points.',
    '没有抽奖、彩票或概率型奖励，只有荣誉徽章、救助者排行与 🐾 BEOM 积分。',
    '抽選・宝くじ・確率型リワードはありません。報酬は名誉バッジ、救済者ランキング、🐾 BEOM ポイントだけです。',
    'Sin sorteos, loterías ni recompensas aleatorias. Solo insignias de honor, ranking de rescatistas y 🐾 BEOM.',
    'Không bốc thăm, vé số hay thưởng theo xác suất. Chỉ có huy hiệu danh dự, bảng cứu trợ và 🐾 BEOM.',
    'Ni tirage, ni loterie, ni récompense aléatoire. Seulement badges d’honneur, classement des sauveteurs et 🐾 BEOM.',
    'Sem sorteio, loteria ou recompensa aleatória. Apenas selos de honra, ranking de salvadores e 🐾 BEOM.',
    'Ни розыгрышей, ни лотерей, ни случайных наград. Только знаки чести, рейтинг спасателей и 🐾 BEOM.',
    'Tanpa undian, lotre, atau hadiah berbasis peluang. Hanya lencana kehormatan, peringkat penyelamat, dan 🐾 BEOM.'
  ],

  secBoardTitle: [
    '사연 보드 · Short by N Pi', 'Story board · Short by N Pi', '故事看板 · Short by N Pi', 'ストーリーボード · Short by N Pi',
    'Tablón de relatos · Short by N Pi', 'Bảng câu chuyện · Short by N Pi', 'Tableau des récits · Short by N Pi',
    'Painel de relatos · Short by N Pi', 'Доска историй · Short by N Pi', 'Papan cerita · Short by N Pi'
  ],
  secBoardDesc: [
    '카테고리를 고르고 1 Pi를 보태거나 원탭으로 완납하세요. 진행률과 랭킹은 즉시 반영됩니다.',
    'Pick a category, chip in 1 Pi or finish it in one tap. Progress and ranking update instantly.',
    '选择分类，1 Pi 相助或一键补齐。进度与排行即时更新。',
    'カテゴリを選び、1 Pi を足すかワンタップで完済。進捗とランキングは即時反映されます。',
    'Elige categoría, aporta 1 Pi o completa de un toque. El progreso y el ranking se actualizan al instante.',
    'Chọn danh mục, góp 1 Pi hoặc trả nốt một chạm. Tiến độ và xếp hạng cập nhật ngay.',
    'Choisissez une catégorie, ajoutez 1 Pi ou complétez d’un geste. Progression et classement se mettent à jour aussitôt.',
    'Escolha a categoria, entre com 1 Pi ou complete num toque. Progresso e ranking atualizam na hora.',
    'Выберите категорию, добавьте 1 Pi или закройте сбор одним нажатием. Прогресс и рейтинг обновляются сразу.',
    'Pilih kategori, tambah 1 Pi, atau lunasi sekali ketuk. Progres dan peringkat langsung berubah.'
  ],
  filterAll: ['전체', 'All', '全部', 'すべて', 'Todo', 'Tất cả', 'Tout', 'Todos', 'Все', 'Semua'],
  catHome: ['부동산·주거', 'Property & housing', '房产·居住', '不動産・住まい', 'Vivienda', 'Nhà ở', 'Logement', 'Moradia', 'Жильё', 'Properti & hunian'],
  catGift: ['선물·위시', 'Gifts & wishes', '礼物·心愿', 'ギフト・ウィッシュ', 'Regalos y deseos', 'Quà tặng & ước nguyện', 'Cadeaux et vœux', 'Presentes e desejos', 'Подарки и желания', 'Hadiah & harapan'],
  catShop: ['생태계 커머스', 'Ecosystem commerce', '生态商城', 'エコシステム・コマース', 'Comercio del ecosistema', 'Thương mại hệ sinh thái', 'Commerce de l’écosystème', 'Comércio do ecossistema', 'Коммерция экосистемы', 'Komersial ekosistem'],
  catTravel: ['여행', 'Travel', '旅行', '旅行', 'Viajes', 'Du lịch', 'Voyage', 'Viagem', 'Путешествия', 'Perjalanan'],
  catLife: ['생활·긴급', 'Daily & urgent', '生活·紧急', '生活・緊急', 'Vida diaria y urgencias', 'Sinh hoạt & khẩn cấp', 'Quotidien et urgences', 'Dia a dia e urgência', 'Быт и срочное', 'Harian & darurat'],
  backersUnit: ['명 참여', 'backers', '人参与', '人参加', 'participantes', 'người góp', 'participants', 'apoiadores', 'участников', 'pendukung'],
  chipBtn: ['1 Pi 보태기', 'Add 1 Pi', '相助 1 Pi', '1 Pi 足す', 'Aportar 1 Pi', 'Góp 1 Pi', 'Ajouter 1 Pi', 'Aportar 1 Pi', 'Добавить 1 Pi', 'Tambah 1 Pi'],
  rescueBtn: ['원탭 완납', 'Full rescue', '一键补齐', 'ワンタップ完済', 'Rescate total', 'Trả nốt', 'Sauvetage complet', 'Resgate total', 'Полное спасение', 'Lunasi penuh'],
  closedBadge: ['마감 · 100% 완납', 'Closed · 100 % rescued', '已关闭 · 100% 补齐', '締切 · 100% 完済', 'Cerrado · 100 % rescatado', 'Đã đóng · trả đủ 100%', 'Clos · 100 % sauvé', 'Fechado · 100% resgatado', 'Закрыто · 100% спасено', 'Tutup · 100% lunas'],
  leftLabel: ['남은', 'left', '余', '残り', 'faltan', 'còn', 'reste', 'faltam', 'осталось', 'sisa'],
  goalLabel: ['목표', 'goal', '目标', '目標', 'meta', 'mục tiêu', 'objectif', 'meta', 'цель', 'target'],
  testChip: ['Test-Pi 리허설', 'Test-Pi rehearsal', 'Test-Pi 演练', 'Test-Pi リハーサル', 'Ensayo Test-Pi', 'Diễn tập Test-Pi', 'Répétition Test-Pi', 'Ensaio Test-Pi', 'Репетиция Test-Pi', 'Latihan Test-Pi'],
  localBadge: ['내가 올린 사연', 'my story', '我发布的故事', '自分のストーリー', 'mi relato', 'câu chuyện của tôi', 'mon récit', 'meu relato', 'моя история', 'cerita saya'],
  emptyBoard: [
    '이 카테고리에는 아직 사연이 없습니다. 첫 사연을 올려 보세요.',
    'No stories in this category yet — be the first.',
    '此分类暂无故事，来发第一个吧。',
    'このカテゴリにはまだストーリーがありません。最初の投稿をどうぞ。',
    'Aún no hay relatos en esta categoría. Sé el primero.',
    'Danh mục này chưa có câu chuyện. Hãy là người đầu tiên.',
    'Aucun récit dans cette catégorie — soyez le premier.',
    'Ainda não há relatos nesta categoria. Seja o primeiro.',
    'В этой категории пока нет историй. Станьте первым.',
    'Belum ada cerita di kategori ini. Jadilah yang pertama.'
  ],
  boardFoot: [
    '모든 사연은 @username과 순수 Pi 단위로만 표기됩니다. 실명·계좌·연락처는 표시되지 않습니다.',
    'Every story shows only an @username and pure Pi amounts. No real names, accounts or phone numbers.',
    '所有故事仅显示 @username 与纯 Pi 金额，不显示实名、账号与联系方式。',
    'すべてのストーリーは @username と純粋な Pi 単位のみ。実名・口座・連絡先は表示されません。',
    'Cada relato muestra solo un @username y Pi puro. Sin nombres, cuentas ni teléfonos.',
    'Mỗi câu chuyện chỉ hiện @username và Pi thuần. Không tên thật, tài khoản hay liên hệ.',
    'Chaque récit n’affiche qu’un @username et des Pi purs. Aucun nom, compte ni téléphone.',
    'Cada relato mostra só @username e Pi puro. Sem nomes, contas ou telefones.',
    'В каждой истории только @username и чистые Pi. Без имён, счетов и телефонов.',
    'Setiap cerita hanya menampilkan @username dan Pi murni. Tanpa nama asli, rekening, atau kontak.'
  ],
  notifyBtn: [
    'Pi 알림 센터 선점 (+1 🐾)', 'Reserve my Pi notification slot (+1 🐾)', '先行占位 Pi 通知中心 (+1 🐾)', 'Pi 通知センターの席を確保 (+1 🐾)',
    'Reservar mi lugar en Pi (+1 🐾)', 'Giữ chỗ trung tâm Pi (+1 🐾)', 'Réserver ma place Pi (+1 🐾)',
    'Reservar minha vaga Pi (+1 🐾)', 'Занять место в центре Pi (+1 🐾)', 'Pesan slot pusat Pi (+1 🐾)'
  ],
  notifyDone: [
    '선점 완료 · Mainnet에서 알려 드립니다', 'Slot reserved — we will ping you on Mainnet', '已占位 · 主网上线时通知您', '確保済み · メインネットでお知らせします',
    'Lugar reservado: te avisamos en Mainnet', 'Đã giữ chỗ — sẽ báo khi lên Mainnet', 'Place réservée — nous vous préviendrons sur Mainnet',
    'Vaga reservada — avisamos na Mainnet', 'Место занято — сообщим на Mainnet', 'Slot dipesan — kami kabari di Mainnet'
  ],

  formOpen: ['사연 올리기', 'Post a story', '发布故事', 'ストーリーを投稿', 'Publicar relato', 'Đăng câu chuyện', 'Publier un récit', 'Publicar relato', 'Опубликовать историю', 'Unggah cerita'],
  formTitle: ['사연 올리기', 'Post a story', '发布故事', 'ストーリーを投稿', 'Publicar relato', 'Đăng câu chuyện', 'Publier un récit', 'Publicar relato', 'Опубликовать историю', 'Unggah cerita'],
  formDesc: [
    '개인정보 없이 @username, 사연 요약, 목표 Pi만 적습니다. 사연은 즉시 보드에 반영됩니다.',
    'Only an @username, a summary and a Pi goal — no personal data. Your story appears on the board at once.',
    '只写 @username、故事摘要与目标 Pi，不含个人信息，发布后立即出现在看板。',
    '@username、ストーリー要約、目標 Pi のみ。個人情報は不要で、投稿はすぐボードに反映されます。',
    'Solo @username, resumen y meta en Pi, sin datos personales. El relato aparece al instante.',
    'Chỉ @username, tóm tắt và mục tiêu Pi, không dữ liệu cá nhân. Câu chuyện hiện ngay.',
    'Uniquement @username, résumé et objectif Pi, sans données personnelles. Le récit s’affiche aussitôt.',
    'Só @username, resumo e meta em Pi, sem dados pessoais. O relato aparece na hora.',
    'Только @username, краткая история и цель в Pi, без личных данных. История сразу на доске.',
    'Hanya @username, ringkasan, dan target Pi, tanpa data pribadi. Cerita langsung tampil.'
  ],
  formUser: ['@username', '@username', '@username', '@username', '@username', '@username', '@username', '@username', '@username', '@username'],
  formGoal: ['목표 (Pi)', 'Goal (Pi)', '目标 (Pi)', '目標 (Pi)', 'Meta (Pi)', 'Mục tiêu (Pi)', 'Objectif (Pi)', 'Meta (Pi)', 'Цель (Pi)', 'Target (Pi)'],
  formStory: ['사연 요약', 'Story summary', '故事摘要', 'ストーリー要約', 'Resumen del relato', 'Tóm tắt câu chuyện', 'Résumé du récit', 'Resumo do relato', 'Краткая история', 'Ringkasan cerita'],
  formStoryPh: [
    '예: BNPi 매물 계약까지 딱 20 Pi 부족합니다',
    'e.g. 20 Pi short of signing a BNPi lease',
    '例：BNPi 房源签约还差 20 Pi',
    '例：BNPi 物件の契約まであと20 Pi',
    'Ej.: faltan 20 Pi para firmar en BNPi',
    'VD: thiếu 20 Pi để ký hợp đồng BNPi',
    'Ex. : il manque 20 Pi pour signer sur BNPi',
    'Ex.: faltam 20 Pi para assinar na BNPi',
    'Напр.: не хватает 20 Pi до договора BNPi',
    'Contoh: kurang 20 Pi untuk kontrak BNPi'
  ],
  formCat: ['카테고리', 'Category', '分类', 'カテゴリ', 'Categoría', 'Danh mục', 'Catégorie', 'Categoria', 'Категория', 'Kategori'],
  formSafe: [
    '실명·계좌·연락처·유명인 이름을 넣지 않았습니다.',
    'I included no real name, account, phone number or celebrity name.',
    '我未填入实名、账号、联系方式或名人姓名。',
    '実名・口座・連絡先・著名人の氏名を入れていません。',
    'No incluí nombres, cuentas, teléfonos ni nombres de famosos.',
    'Tôi không điền tên thật, tài khoản, liên hệ hay tên người nổi tiếng.',
    'Je n’ai mis aucun nom, compte, téléphone ni nom de célébrité.',
    'Não incluí nomes, contas, telefones ou celebridades.',
    'Я не указал имя, счёт, телефон или имя знаменитости.',
    'Saya tidak mencantumkan nama asli, rekening, kontak, atau selebriti.'
  ],
  formSubmit: ['사연 등록 (+2 🐾)', 'Post story (+2 🐾)', '发布 (+2 🐾)', '投稿する (+2 🐾)', 'Publicar (+2 🐾)', 'Đăng (+2 🐾)', 'Publier (+2 🐾)', 'Publicar (+2 🐾)', 'Опубликовать (+2 🐾)', 'Unggah (+2 🐾)'],
  formCancel: ['닫기', 'Close', '关闭', '閉じる', 'Cerrar', 'Đóng', 'Fermer', 'Fechar', 'Закрыть', 'Tutup'],
  formPIIhelp: [
    '연락처·계좌는 받지 않습니다. 약속은 Pi 결제로만 이뤄집니다.',
    'We never take contacts or account numbers — the promise is settled in Pi only.',
    '不收集联系方式与账号，约定只用 Pi 支付完成。',
    '連絡先・口座は受け取りません。約束は Pi 決済でのみ成立します。',
    'No pedimos contactos ni cuentas: el acuerdo se cierra solo en Pi.',
    'Không lấy liên hệ hay tài khoản — cam kết chỉ hoàn tất bằng Pi.',
    'Ni contacts ni comptes : la promesse se règle uniquement en Pi.',
    'Não pedimos contatos nem contas: a promessa se fecha só em Pi.',
    'Контакты и счета не нужны — договорённость закрывается только в Pi.',
    'Kontak dan rekening tidak diminta — janji hanya tuntas dalam Pi.'
  ],
  formAlertUser: [
    '@username은 영문·숫자·밑줄 3~20자로 적어 주세요.',
    'Use an @username of 3–20 letters, digits or underscores.',
    '@username 请用 3~20 位字母、数字或下划线。',
    '@username は英数字とアンダースコア 3〜20 文字で入力してください。',
    'Usa un @username de 3–20 letras, números o guiones bajos.',
    '@username gồm 3–20 chữ, số hoặc gạch dưới.',
    'Utilisez un @username de 3 à 20 lettres, chiffres ou tirets bas.',
    'Use um @username de 3–20 letras, números ou sublinhados.',
    '@username — 3–20 латинских букв, цифр или подчёркиваний.',
    'Gunakan @username 3–20 huruf, angka, atau garis bawah.'
  ],
  formAlertGoal: [
    '목표는 1~500 Pi 사이 정수로 적어 주세요.',
    'Set a whole-number goal between 1 and 500 Pi.',
    '目标请填 1~500 Pi 的整数。',
    '目標は 1〜500 Pi の整数で入力してください。',
    'La meta debe ser un entero entre 1 y 500 Pi.',
    'Mục tiêu là số nguyên từ 1 đến 500 Pi.',
    'L’objectif doit être un entier entre 1 et 500 Pi.',
    'A meta deve ser inteiro entre 1 e 500 Pi.',
    'Цель — целое число от 1 до 500 Pi.',
    'Target berupa bilangan bulat 1–500 Pi.'
  ],
  formAlertStory: [
    '사연은 5~90자로 요약해 주세요.',
    'Keep the summary between 5 and 90 characters.',
    '摘要请控制在 5~90 字。',
    '要約は 5〜90 文字にしてください。',
    'Resume el relato en 5–90 caracteres.',
    'Tóm tắt trong 5–90 ký tự.',
    'Résumez en 5 à 90 caractères.',
    'Resuma em 5–90 caracteres.',
    'Кратко: от 5 до 90 символов.',
    'Ringkas 5–90 karakter.'
  ],
  formAlertSafe: [
    '개인정보 미포함 확인에 체크해 주세요.',
    'Please tick the no-personal-data confirmation.',
    '请勾选“未含个人信息”。',
    '個人情報なしの確認にチェックしてください。',
    'Marca la confirmación de que no hay datos personales.',
    'Hãy tích xác nhận không có dữ liệu cá nhân.',
    'Cochez la confirmation d’absence de données personnelles.',
    'Marque a confirmação de que não há dados pessoais.',
    'Отметьте подтверждение об отсутствии личных данных.',
    'Centang konfirmasi tanpa data pribadi.'
  ],
  formAlertPII: [
    '전화번호·이메일처럼 보이는 값은 넣을 수 없습니다.',
    'A value that looks like a phone number or email cannot be posted.',
    '不能填写像电话或邮箱的内容。',
    '電話番号・メールに見える値は投稿できません。',
    'No se puede publicar algo que parezca un teléfono o un correo.',
    'Không thể đăng nội dung giống số điện thoại hay email.',
    'Impossible de publier ce qui ressemble à un téléphone ou un e-mail.',
    'Não é possível publicar algo que pareça telefone ou e-mail.',
    'Нельзя указать то, что похоже на телефон или e-mail.',
    'Tidak boleh memuat hal yang tampak seperti telepon atau email.'
  ],
  formAlertFiat: [
    '원화·달러·GCV 금액은 표기할 수 없습니다. 순수 Pi 단위로만 적어 주세요.',
    'KRW, USD and GCV amounts cannot be posted — use pure Pi only.',
    '不能填写韩元、美元或 GCV 金额，只用纯 Pi 单位。',
    'ウォン・ドル・GCV の金額は掲載できません。純粋な Pi 単位のみです。',
    'No se pueden publicar importes en KRW, USD ni GCV: solo Pi puro.',
    'Không thể đăng số tiền KRW, USD hay GCV — chỉ dùng Pi thuần.',
    'Les montants en KRW, USD ou GCV sont interdits : uniquement du Pi pur.',
    'Não é possível publicar valores em KRW, USD ou GCV: apenas Pi puro.',
    'Суммы в вонах, долларах и GCV запрещены — только чистые Pi.',
    'Nominal KRW, USD, atau GCV tidak boleh — hanya Pi murni.'
  ],
  formAlertCeleb: [
    '유명인 이름·인용은 등재할 수 없습니다 (코어팀 가이드라인).',
    'Celebrity names or quotes cannot be posted (Core Team guidelines).',
    '不能收录名人姓名或引用（核心团队指南）。',
    '著名人の氏名・引用は掲載できません（コアチーム指針）。',
    'No se pueden publicar nombres ni citas de famosos (directrices del Core Team).',
    'Không thể đăng tên hay câu trích của người nổi tiếng (hướng dẫn Core Team).',
    'Noms et citations de célébrités interdits (règles du Core Team).',
    'Nomes ou citações de celebridades não podem ser publicados (diretrizes do Core Team).',
    'Имена и цитаты знаменитостей запрещены (правила Core Team).',
    'Nama atau kutipan selebriti tidak boleh diunggah (pedoman Core Team).'
  ],
  formSuccess: [
    '사연이 보드에 올라갔습니다. +2 🐾',
    'Your story is on the board. +2 🐾',
    '故事已发布到看板。+2 🐾',
    'ストーリーを掲載しました。+2 🐾',
    'Tu relato está en el tablón. +2 🐾',
    'Câu chuyện đã lên bảng. +2 🐾',
    'Votre récit est publié. +2 🐾',
    'Seu relato está no painel. +2 🐾',
    'История на доске. +2 🐾',
    'Cerita sudah tampil. +2 🐾'
  ],

  hallTitle: [
    '놀이터 명예의 전당', 'Playground hall of honour', '游乐场荣誉殿堂', '広場の名誉の殿堂',
    'Salón de honor del patio', 'Bảng danh dự sân chơi', 'Panthéon du terrain de jeu',
    'Salão de honra do pátio', 'Зал чести площадки', 'Aula kehormatan taman'
  ],
  hallDesc: [
    '오늘의 구원자·누적 완납·BEOM 포인트로 이어지는 명예 랭킹입니다. 상품도 추첨도 없습니다.',
    'An honour ranking of today’s rescuers, lifetime rescues and BEOM points. No prizes, no draws.',
    '今日救助者、累计补齐与 BEOM 积分构成的荣誉排行，无奖品、无抽奖。',
    '今日の救済者・累計完済・BEOM ポイントの名誉ランキング。賞品も抽選もありません。',
    'Ranking de honor: rescatistas de hoy, rescates totales y BEOM. Sin premios ni sorteos.',
    'Bảng danh dự: người cứu hôm nay, tổng đã trả nốt, điểm BEOM. Không giải thưởng, không bốc thăm.',
    'Classement d’honneur : sauveteurs du jour, sauvetages cumulés, BEOM. Ni prix ni tirage.',
    'Ranking de honra: salvadores de hoje, resgates totais e BEOM. Sem prêmios nem sorteios.',
    'Рейтинг чести: спасатели дня, всего спасено, баллы BEOM. Без призов и розыгрышей.',
    'Peringkat kehormatan: penyelamat hari ini, total pelunasan, poin BEOM. Tanpa hadiah, tanpa undian.'
  ],
  hallTabToday: ['오늘의 구원자', 'Today’s rescuers', '今日救助者', '今日の救済者', 'Rescatistas de hoy', 'Người cứu hôm nay', 'Sauveteurs du jour', 'Salvadores de hoje', 'Спасатели дня', 'Penyelamat hari ini'],
  hallTabTotal: ['누적 완납', 'Lifetime rescues', '累计补齐', '累計完済', 'Rescates acumulados', 'Tổng trả nốt', 'Sauvetages cumulés', 'Resgates acumulados', 'Всего спасено', 'Total pelunasan'],
  hallTabBeom: ['BEOM 포인트', 'BEOM points', 'BEOM 积分', 'BEOM ポイント', 'Puntos BEOM', 'Điểm BEOM', 'Points BEOM', 'Pontos BEOM', 'Баллы BEOM', 'Poin BEOM'],
  hallYou: ['나', 'you', '我', 'あなた', 'tú', 'bạn', 'vous', 'você', 'вы', 'Anda'],
  hallEmpty: [
    '아직 기록이 없습니다. 첫 1 Pi를 보태 보세요.',
    'No records yet — be the first to add 1 Pi.',
    '暂无记录，来做第一个相助者。',
    'まだ記録がありません。最初の 1 Pi を。',
    'Aún no hay registros. Aporta el primer 1 Pi.',
    'Chưa có ghi nhận. Hãy góp 1 Pi đầu tiên.',
    'Aucun record. Ajoutez le premier 1 Pi.',
    'Sem registros. Aporte o primeiro 1 Pi.',
    'Записей нет. Внесите первый 1 Pi.',
    'Belum ada catatan. Tambah 1 Pi pertama.'
  ],
  unitCount: ['건', 'times', '次', '件', 'veces', 'lần', 'fois', 'vezes', 'раз', 'kali'],

  toastTest: [
    'Test-Pi 리허설로 기록했습니다 · 실제 정산 아님',
    'Recorded as a Test-Pi rehearsal · no real settlement',
    '已记为 Test-Pi 演练 · 不作真实结算',
    'Test-Pi リハーサルとして記録 · 実際の決済なし',
    'Registrado como ensayo Test-Pi · sin liquidación real',
    'Đã ghi là diễn tập Test-Pi · không quyết toán thật',
    'Enregistré comme répétition Test-Pi · aucun règlement',
    'Registrado como ensaio Test-Pi · sem liquidação',
    'Записано как репетиция Test-Pi · без расчёта',
    'Dicatat sebagai latihan Test-Pi · tanpa penyelesaian'
  ],
  toastPaid: [
    'Pi 결제가 온체인에 기록되었습니다',
    'Your Pi payment is recorded on-chain',
    'Pi 支付已记录上链',
    'Pi 決済をオンチェーンに記録しました',
    'Tu pago en Pi quedó registrado on-chain',
    'Thanh toán Pi đã ghi on-chain',
    'Votre paiement Pi est enregistré on-chain',
    'Seu pagamento em Pi foi registrado on-chain',
    'Платёж Pi записан ончейн',
    'Pembayaran Pi tercatat on-chain'
  ],
  toastCancel: [
    '보태기를 취소했습니다.', 'Chip-in cancelled.', '已取消相助。', '参加をキャンセルしました。',
    'Aporte cancelado.', 'Đã huỷ góp.', 'Contribution annulée.', 'Contribuição cancelada.', 'Вклад отменён.', 'Bantuan dibatalkan.'
  ],
  toastFail: [
    '결제가 완료되지 않았습니다. 잠시 후 다시 시도해 주세요.',
    'The payment did not complete. Please try again shortly.',
    '支付未完成，请稍后重试。',
    '決済が完了しませんでした。しばらくして再度お試しください。',
    'El pago no se completó. Inténtalo de nuevo en un momento.',
    'Thanh toán chưa hoàn tất. Vui lòng thử lại sau.',
    'Le paiement n’a pas abouti. Réessayez dans un instant.',
    'O pagamento não foi concluído. Tente novamente em instantes.',
    'Платёж не прошёл. Попробуйте чуть позже.',
    'Pembayaran belum selesai. Coba lagi sebentar lagi.'
  ],
  toastClosed: [
    '100% 달성 — 자동 마감되었습니다.',
    '100 % reached — the story closed automatically.',
    '已达 100% — 自动关闭。',
    '100% 達成 — 自動で締め切りました。',
    '100 % alcanzado: cerrado automáticamente.',
    'Đã đạt 100% — tự động đóng.',
    '100 % atteint — clôturé automatiquement.',
    '100% atingido — fechado automaticamente.',
    'Достигнуто 100% — закрыто автоматически.',
    '100% tercapai — tertutup otomatis.'
  ],
  webHint: [
    'Pi 결제는 Pi Browser 앱 안에서만 진행됩니다. 지금은 Test-Pi 리허설로 기록됩니다.',
    'Pi payments run only inside the Pi Browser app; for now this is recorded as a Test-Pi rehearsal.',
    'Pi 支付仅在 Pi Browser 内进行，现在按 Test-Pi 演练记录。',
    'Pi 決済は Pi Browser アプリ内のみ。現在は Test-Pi リハーサルとして記録します。',
    'Los pagos Pi solo funcionan en Pi Browser; ahora se registra como ensayo Test-Pi.',
    'Thanh toán Pi chỉ chạy trong Pi Browser; hiện ghi là diễn tập Test-Pi.',
    'Les paiements Pi passent uniquement par Pi Browser ; ici c’est une répétition Test-Pi.',
    'Pagamentos Pi só no Pi Browser; aqui fica como ensaio Test-Pi.',
    'Платежи Pi работают только в Pi Browser; сейчас это репетиция Test-Pi.',
    'Pembayaran Pi hanya di Pi Browser; sekarang dicatat sebagai latihan Test-Pi.'
  ],

  footerTag: [
    '케데헌 생태계 상호부조 놀이터', 'the mutual-aid playground of the Kedheon ecosystem',
    'Kedheon 生态互助游乐场', 'Kedheon エコシステムの相互扶助広場',
    'el patio de ayuda mutua del ecosistema Kedheon', 'sân chơi tương trợ của hệ sinh thái Kedheon',
    'le terrain d’entraide de l’écosystème Kedheon', 'o pátio de ajuda mútua do ecossistema Kedheon',
    'площадка взаимопомощи экосистемы Kedheon', 'taman gotong royong ekosistem Kedheon'
  ],
  imgAlt: [
    'XAEA12 히어로 — 네온 서클 앞의 흑표범, 가슴에 X 엠블럼과 PIONEER, 손에 금화 더미, 하단 xaea12.pi 명패',
    'XAEA12 hero — a black panther before a neon ring, X emblem and PIONEER across its chest, a handful of gold coins, xaea12.pi nameplate at the bottom',
    'XAEA12 主视觉——霓虹圆环前的黑豹，胸前 X 徽记与 PIONEER，爪中金币，底部 xaea12.pi 铭牌',
    'XAEA12 ヒーロー — ネオンリングの前の黒豹、胸に X エンブレムと PIONEER、手に金貨、下部に xaea12.pi の銘板',
    'Héroe XAEA12: pantera negra ante un anillo de neón, emblema X y PIONEER en el pecho, monedas de oro en la garra y placa xaea12.pi',
    'Hình chủ đạo XAEA12 — báo đen trước vòng neon, huy hiệu X và PIONEER trên ngực, nắm đồng vàng, bảng tên xaea12.pi',
    'Visuel XAEA12 — panthère noire devant un anneau néon, emblème X et PIONEER sur la poitrine, pièces d’or, plaque xaea12.pi',
    'Herói XAEA12 — pantera negra diante de um anel neon, emblema X e PIONEER no peito, moedas de ouro na pata e placa xaea12.pi',
    'Герой XAEA12 — чёрная пантера перед неоновым кольцом, эмблема X и PIONEER на груди, золотые монеты, табличка xaea12.pi',
    'Hero XAEA12 — macan kumbang di depan cincin neon, emblem X dan PIONEER di dada, koin emas di cakar, papan nama xaea12.pi'
  ],
  imgCaption: [
    '흑표범 · XAEA12 Guardian', 'Neon panther · XAEA12 Guardian', '黑豹 · XAEA12 Guardian', '黒豹 · XAEA12 Guardian',
    'Pantera de neón · XAEA12 Guardian', 'Báo đen neon · XAEA12 Guardian', 'Panthère néon · XAEA12 Guardian',
    'Pantera neon · XAEA12 Guardian', 'Неоновая пантера · XAEA12 Guardian', 'Macan neon · XAEA12 Guardian'
  ],
  alertSoon: [
    ' 서비스 준비 중입니다.', ' service is coming soon.', ' 服务正在准备中。', ' サービスは準備中です。',
    ' en preparación.', ' đang được chuẩn bị.', ' bientôt disponible.', ' em preparação.', ' скоро появится.', ' segera hadir.'
  ]
} satisfies Record<string, L10>;

export type UIKey = keyof typeof UI;

export function ui(key: UIKey, lang: Lang): string {
  return tr(UI[key], lang);
}
