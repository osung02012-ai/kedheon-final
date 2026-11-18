import type { L10, UIKey } from './i18n';

/* ------------------------------------------------------------------
 * Vendor — 3대 거래 레일 · 상태기계 · 초기 원장(seed)
 *
 * 0단계 원칙 (설계서 docs/vendor-karrot-upgrade.md 6~8장):
 *  · 거래는 '상태'를 가진다 — 모집(open) → 예약중(reserved) → 완료(done).
 *  · 이행(handoff)과 정산(settle)은 서로 다른 축이다. 같은 물건이라도 만나서 주면
 *    즉시 정산, 택배면 수령 확인 후, 컨테이너면 30/70 분할이다.
 *  · 신뢰는 '측정값'만 적는다. 완료율(dev) 같은 지어낸 숫자는 삭제했고,
 *    시드(예시) 데이터는 발자국 0 · 실거래 인증 0 으로 표시한다.
 *  · 보관형 에스크로는 아직 작동하지 않는다 → 화면에는 '준비 중'으로만 쓴다.
 * 초기 목록은 인도·아프리카·동남아·한국·미주에 고르게 배치했다.
 * ------------------------------------------------------------------ */

export type RailKey = 'WORK' | 'LOCAL' | 'B2B';

/** 레일 안의 두 방향. WORK는 '일감 올리기 ↔ 내 기술·시간' 양방향이다. */
export type SideKey = 'gig' | 'skill' | 'sell' | 'want' | 'free' | 'rfq';

/** 거래방식(정산 축). escrow는 여기 없다 — 아직 '준비 중'이기 때문이다. */
export type DealMode = 'pi' | 'milestone' | 'barter' | 'free' | 'offer';

/** 이행 축 */
export type Handoff = 'meet' | 'delivery' | 'freight' | 'remote';

export type ListingStatus = 'open' | 'reserved' | 'done';

/** 판매자 검증 등급 (L0 Pi KYC 개인 → L3 B2B 법인) */
export type Tier = 0 | 1 | 2 | 3;

export type TagKey =
  | 'translate' | 'data' | 'repair' | 'dev' | 'support'
  | 'goods' | 'barter' | 'equip' | 'energy' | 'telecom' | 'agri';

/** 수량 구간 단가 (B2B) */
export type PriceBreak = { label: string; price: number };

export type Listing = {
  id: string;
  rail: RailKey;
  side: SideKey;
  /** ISO 3166-1 alpha-2, 'GLOBAL' */
  country: string;
  /** 도시·지역 — 고유명사라 번역하지 않는다 */
  city: string;
  /** 동네·거점 (생활권 반경 '동네'의 기준) */
  place?: string;
  tag: TagKey;
  title: L10 | string;
  detail: L10 | string;
  /** 이행 조건(배송비·출고·반품 / MOQ·선적항·검수 / 납품물·마일스톤) */
  terms?: string;
  mode: DealMode;
  handoff: Handoff;
  /** 고정가 */
  pi?: number;
  /** 범위 (0.5~50 Pi 같은 소액 일감) */
  piMin?: number;
  piMax?: number;
  /** 수량·규모 표기 (500건 · ×5대) */
  qty?: string;
  priceBreaks?: PriceBreak[];
  moq?: number;
  /** 보관형 에스크로가 아직 '준비 중'임을 표기 (기능 아님) */
  escrowSoon?: boolean;
  tier: Tier;
  status: ListingStatus;
  /** 올라온 시각 (ISO) — 상대 시간은 ageLabel()이 계산한다 */
  createdAt: string;
  /** 시드(예시) 데이터 — 실거래가 아니다 */
  demo?: boolean;
  /** 이 기기에서 올린 글 */
  mine?: boolean;
  bumpCount?: number;
  bumpAt?: string;
  reservedUntil?: string;
  /* ── 신뢰 원장: 정산까지 끝난 거래만 센다 (시드는 0) ── */
  dealsDone: number;
  dealsClosed: number;
  reviews: number;
  stars?: number;
  reDeal?: number;
  disputes: number;
};

export const TAGS: Record<TagKey, { icon: string; label: L10 }> = {
  translate: {
    icon: '📄',
    label: ['번역·통역', 'Translation', '翻译·口译', '翻訳・通訳', 'Traducción', 'Biên dịch', 'Traduction', 'Tradução', 'Перевод', 'Terjemahan']
  },
  data: {
    icon: '🧮',
    label: ['데이터', 'Data entry', '数据录入', 'データ入力', 'Datos', 'Nhập liệu', 'Saisie de données', 'Entrada de dados', 'Данные', 'Entri data']
  },
  repair: {
    icon: '🔧',
    label: ['수리·설치', 'Repair & install', '维修安装', '修理・設置', 'Reparación', 'Sửa chữa', 'Réparation', 'Reparo', 'Ремонт', 'Servis']
  },
  dev: {
    icon: '💻',
    label: ['개발', 'Development', '开发', '開発', 'Desarrollo', 'Phát triển', 'Développement', 'Desenvolvimento', 'Разработка', 'Pengembangan']
  },
  support: {
    icon: '🎧',
    label: ['고객지원', 'Support', '客服', 'サポート', 'Soporte', 'Hỗ trợ', 'Support client', 'Suporte', 'Поддержка', 'Dukungan']
  },
  goods: {
    icon: '📦',
    label: ['중고·생필품', 'Used & daily goods', '二手·日用', '中古・日用品', 'Segunda mano', 'Đồ cũ', 'Occasion', 'Usados', 'Б/у товары', 'Barang bekas']
  },
  barter: {
    icon: '🔁',
    label: ['물물교환', 'Barter', '物物交换', '物々交換', 'Trueque', 'Trao đổi', 'Troc', 'Troca', 'Обмен', 'Barter']
  },
  equip: {
    icon: '🏭',
    label: ['산업 설비', 'Industrial gear', '工业设备', '産業設備', 'Equipo industrial', 'Thiết bị CN', 'Équipement ind.', 'Equipamento ind.', 'Промоборудование', 'Peralatan industri']
  },
  energy: {
    icon: '🔆',
    label: ['에너지 설비', 'Energy equipment', '能源设备', 'エネルギー設備', 'Energía', 'Thiết bị năng lượng', 'Énergie', 'Energia', 'Энергетика', 'Energi']
  },
  telecom: {
    icon: '📡',
    label: ['통신·위성', 'Telecom & satellite', '通信·卫星', '通信・衛星', 'Telecom', 'Viễn thông', 'Télécom', 'Telecom', 'Связь и спутники', 'Telekomunikasi']
  },
  agri: {
    icon: '🚜',
    label: ['농기계', 'Agri machinery', '农机', '農機具', 'Maquinaria agrícola', 'Máy nông nghiệp', 'Machinisme agricole', 'Máquinas agrícolas', 'Сельхозтехника', 'Mesin pertanian']
  }
};

export const RAILS: { key: RailKey; icon: string; title: UIKey; short: UIKey; desc: UIKey }[] = [
  { key: 'WORK', icon: '👷', title: 'rail1', short: 'rail1S', desc: 'rail1D' },
  { key: 'LOCAL', icon: '🥕', title: 'rail2', short: 'rail2S', desc: 'rail2D' },
  { key: 'B2B', icon: '🛰️', title: 'rail3', short: 'rail3S', desc: 'rail3D' }
];


/** 레일별 서브칩 — 상시 요소 2번째 줄. WORK는 양방향(일감 ↔ 내 기술·시간)이다. */
export const RAIL_SIDES: Record<RailKey, { key: SideKey; label: UIKey }[]> = {
  WORK: [
    { key: 'gig', label: 'sideWork' },
    { key: 'skill', label: 'sideSkill' }
  ],
  LOCAL: [
    { key: 'sell', label: 'sideSell' },
    { key: 'want', label: 'sideWant' },
    { key: 'free', label: 'sideFree' }
  ],
  B2B: [
    { key: 'sell', label: 'sideSell' },
    { key: 'rfq', label: 'sideRfq' }
  ]
};

export const HANDOFFS: { key: Handoff; label: UIKey; icon: string }[] = [
  { key: 'meet', label: 'handoffMeet', icon: '🤝' },
  { key: 'delivery', label: 'handoffDelivery', icon: '📦' },
  { key: 'freight', label: 'handoffFreight', icon: '🚢' },
  { key: 'remote', label: 'handoffRemote', icon: '💻' }
];

/** 거래방식 5종 — 정산 축. 보관형 에스크로는 목록에 없다(준비 중). */
export const DEAL_MODES: { key: DealMode; label: UIKey }[] = [
  { key: 'pi', label: 'modePi' },
  { key: 'milestone', label: 'settleMilestone' },
  { key: 'barter', label: 'modeBarter' },
  { key: 'free', label: 'sideFree' },
  { key: 'offer', label: 'modeOffer' }
];

export const STATUS_LABEL: Record<ListingStatus, UIKey> = {
  open: 'statusOpen',
  reserved: 'statusReserved',
  done: 'statusDone'
};

/** 판매자 등급 — 글자로만 표기한다(색만으로 뜻을 전하지 않는다). */
export const TIER_BADGE: Record<Tier, string> = {
  0: 'L0 · KYC',
  1: 'L1 · 사업자',
  2: 'L2 · 장인',
  3: 'L3 · B2B'
};

/* ------------------------------------------------------------------
 * 시드 원장 — 시드 자체는 '예시'다. 제목·설명은 10개국어 원문을 그대로 두고,
 * 상태·이행·정산·등급 같은 구조 정보만 SEED_META에서 붙인다.
 * ------------------------------------------------------------------ */

type RawSeed = {
  id: string;
  rail: RailKey;
  country: string;
  city: string;
  tag: TagKey;
  title: L10 | string;
  detail: L10 | string;
  mode: 'pi' | 'barter' | 'quote';
  pi?: number;
  piMin?: number;
  piMax?: number;
  /** 과거 필드 — 신뢰는 이제 원장에서만 계산하므로 쓰지 않는다 */
  dev: number;
  escrow?: boolean;
  posted: string;
};

const SEED_RAW: RawSeed[] = [
  /* ── 👷 인력·소액 일감 ─────────────────────────────────────────── */
  {
    id: 'wk-in-1', rail: 'WORK', country: 'IN', city: 'Bengaluru', tag: 'data',
    title: [
      '영-힌디 음성 데이터 라벨링 500건',
      'English–Hindi voice data labelling, 500 clips',
      '英印地语音数据标注 500 条',
      '英・ヒンディー音声データのラベリング 500件',
      'Etiquetado de voz inglés–hindi, 500 clips',
      'Gán nhãn dữ liệu giọng nói Anh–Hindi, 500 mẫu',
      'Étiquetage vocal anglais–hindi, 500 extraits',
      'Rotulagem de voz inglês–hindi, 500 clipes',
      'Разметка аудио англ.–хинди, 500 клипов',
      'Pelabelan data suara Inggris–Hindi, 500 klip'
    ],
    detail: [
      '벵갈루루 스튜디오에서 주 3회 납품. 정확도 98% 이상, 재작업 무료.',
      'Delivered three times a week from a Bengaluru studio. 98%+ accuracy, free rework.',
      '班加罗尔工作室每周交付三次，准确率 98% 以上，免费返工。',
      'ベンガルールのスタジオから週3回納品。精度98%以上、手直し無料。',
      'Entrega tres veces por semana desde un estudio de Bangalore. Precisión superior al 98%, retrabajo gratis.',
      'Giao 3 lần mỗi tuần từ studio Bengaluru. Độ chính xác trên 98%, sửa lại miễn phí.',
      'Livraison trois fois par semaine depuis un studio de Bangalore. Précision >98 %, reprise gratuite.',
      'Entrega três vezes por semana de um estúdio em Bengaluru. Precisão acima de 98%, retrabalho grátis.',
      'Доставка трижды в неделю из студии в Бенгалуру. Точность выше 98%, правки бесплатно.',
      'Dikirim tiga kali seminggu dari studio Bengaluru. Akurasi di atas 98%, revisi gratis.'
    ],
    mode: 'pi', piMin: 0.5, piMax: 2, dev: 96, posted: '2h'
  },
  {
    id: 'wk-ng-1', rail: 'WORK', country: 'NG', city: 'Lagos', tag: 'repair',
    title: [
      '스마트폰 액정 교체·당일 수리 (라고스 아일랜드)',
      'Phone screen replacement, same-day (Lagos Island)',
      '手机换屏·当日维修（拉各斯岛）',
      'スマホ画面交換・即日修理（ラゴス島）',
      'Cambio de pantalla, mismo día (Isla de Lagos)',
      'Thay màn hình điện thoại trong ngày (Đảo Lagos)',
      'Remplacement d’écran le jour même (Lagos Island)',
      'Troca de tela no mesmo dia (Ilha de Lagos)',
      'Замена экрана в тот же день (остров Лагос)',
      'Ganti layar ponsel hari yang sama (Pulau Lagos)'
    ],
    detail: [
      '정품·호환 부품 선택 가능. 부품값 별도, 공임 1.5 Pi 고정.',
      'Original or compatible parts, your choice. Parts billed separately; 1.5 Pi labour fixed.',
      '可选原装或兼容配件，配件另计，人工费固定 1.5 Pi。',
      '純正・互換部品を選択可。部品代は別、工賃は1.5 Pi固定。',
      'Piezas originales o compatibles. La pieza se cobra aparte; mano de obra 1,5 Pi fijos.',
      'Chọn linh kiện chính hãng hoặc tương thích. Linh kiện tính riêng, công 1,5 Pi cố định.',
      'Pièces d’origine ou compatibles. Pièces facturées à part, main-d’œuvre 1,5 Pi fixe.',
      'Peças originais ou compatíveis. Peça cobrada à parte; mão de obra 1,5 Pi fixa.',
      'Оригинальные или совместимые детали. Деталь оплачивается отдельно, работа — 1,5 Pi.',
      'Suku cadang asli atau kompatibel. Biaya part terpisah, jasa 1,5 Pi tetap.'
    ],
    mode: 'pi', pi: 1.5, dev: 93, posted: '5h'
  },
  {
    id: 'wk-ke-1', rail: 'WORK', country: 'KE', city: 'Nairobi', tag: 'translate',
    title: [
      '스와힐리어↔영어 번역·검수 2,000단어',
      'Swahili↔English translation & proofreading, 2,000 words',
      '斯瓦希里语↔英语翻译校对 2,000 词',
      'スワヒリ語↔英語の翻訳・校正 2,000語',
      'Traducción y corrección suajili↔inglés, 2.000 palabras',
      'Dịch và hiệu đính Swahili↔Anh, 2.000 từ',
      'Traduction et relecture swahili↔anglais, 2 000 mots',
      'Tradução e revisão suaíli↔inglês, 2.000 palavras',
      'Перевод и вычитка суахили↔английский, 2000 слов',
      'Terjemahan & penyuntingan Swahili↔Inggris, 2.000 kata'
    ],
    detail: [
      '나이로비 대학 출신 번역가 2인이 교차 검수. 48시간 납품.',
      'Two Nairobi-trained translators cross-check. 48-hour delivery.',
      '两位内罗毕出身译者交叉校对，48 小时交付。',
      'ナイロビ出身の訳者2名が相互校正。48時間で納品。',
      'Dos traductores formados en Nairobi se revisan entre sí. Entrega en 48 h.',
      'Hai dịch giả tốt nghiệp Nairobi kiểm chéo. Giao trong 48 giờ.',
      'Deux traducteurs formés à Nairobi se relisent. Livraison en 48 h.',
      'Dois tradutores formados em Nairóbi fazem revisão cruzada. Entrega em 48 h.',
      'Два переводчика с образованием в Найроби сверяют друг друга. Срок — 48 часов.',
      'Dua penerjemah lulusan Nairobi memeriksa silang. Selesai dalam 48 jam.'
    ],
    mode: 'pi', pi: 3, dev: 97, posted: '1d'
  },
  {
    id: 'wk-ph-1', rail: 'WORK', country: 'PH', city: 'Manila', tag: 'support',
    title: [
      '영어 고객지원 야간 시프트 (주 20시간)',
      'English customer support, night shift (20 h/week)',
      '英语客服夜班（每周 20 小时）',
      '英語カスタマーサポート夜勤（週20時間）',
      'Atención al cliente en inglés, turno de noche (20 h/sem)',
      'Hỗ trợ khách hàng tiếng Anh, ca đêm (20 giờ/tuần)',
      'Support client en anglais, équipe de nuit (20 h/sem.)',
      'Suporte ao cliente em inglês, turno da noite (20 h/semana)',
      'Поддержка клиентов на английском, ночная смена (20 ч/нед.)',
      'Dukungan pelanggan bahasa Inggris, shift malam (20 jam/minggu)'
    ],
    detail: [
      '마닐라 콜센터 경력 3년 이상, 미주 시간대 대응. 주 단위 정산.',
      '3+ years Manila call-centre experience, covers US hours. Paid weekly.',
      '马尼拉呼叫中心 3 年以上经验，对接美洲时段，按周结算。',
      'マニラのコールセンター経験3年以上、米州時間帯対応。週単位精算。',
      'Más de 3 años en call center de Manila, cubre horario americano. Pago semanal.',
      'Trên 3 năm kinh nghiệm call center Manila, trực giờ châu Mỹ. Thanh toán theo tuần.',
      'Plus de 3 ans en centre d’appels à Manille, couvre les heures US. Paiement hebdomadaire.',
      'Mais de 3 anos em call center em Manila, cobre horário americano. Pagamento semanal.',
      'Опыт колл-центра в Маниле более 3 лет, работа по времени США. Оплата еженедельно.',
      'Pengalaman call center Manila 3+ tahun, melayani jam Amerika. Dibayar mingguan.'
    ],
    mode: 'pi', pi: 45, dev: 91, posted: '1d'
  },
  {
    id: 'wk-kr-1', rail: 'WORK', country: 'KR', city: '서울', tag: 'translate',
    title: [
      '한↔영 계약서 번역·감수 (10쪽)',
      'Korean↔English contract translation & review (10 pages)',
      '韩↔英合同翻译审校（10 页）',
      '韓↔英 契約書の翻訳・監修（10ページ）',
      'Traducción y revisión de contratos coreano↔inglés (10 pág.)',
      'Dịch và thẩm định hợp đồng Hàn↔Anh (10 trang)',
      'Traduction et relecture de contrats coréen↔anglais (10 p.)',
      'Tradução e revisão de contratos coreano↔inglês (10 págs.)',
      'Перевод и проверка договоров кор.↔англ. (10 стр.)',
      'Terjemahan & telaah kontrak Korea↔Inggris (10 halaman)'
    ],
    detail: [
      '법무 통역 경력 7년. 조항별 대조표 첨부, 수정 2회 포함.',
      'Seven years in legal interpreting. Clause-by-clause table included, two revision rounds.',
      '7 年法律口译经验，附逐条对照表，含两次修改。',
      '法務通訳7年。条項別対照表を添付、修正2回込み。',
      'Siete años en interpretación jurídica. Tabla cláusula por cláusula y dos rondas de revisión.',
      '7 năm phiên dịch pháp lý. Kèm bảng đối chiếu từng điều khoản, sửa 2 lần.',
      'Sept ans d’interprétation juridique. Tableau clause par clause, deux séries de corrections.',
      'Sete anos em interpretação jurídica. Tabela cláusula a cláusula e duas rodadas de revisão.',
      'Семь лет юридического перевода. Таблица по пунктам, две итерации правок.',
      'Tujuh tahun interpretasi hukum. Dilengkapi tabel per pasal, dua kali revisi.'
    ],
    mode: 'pi', pi: 12, dev: 99, posted: '3h'
  },
  {
    id: 'wk-vn-1', rail: 'WORK', country: 'VN', city: 'Hanoi', tag: 'translate',
    title: [
      '한국어 통역 (하노이 시내, 1일)',
      'Korean interpreter (central Hanoi, one day)',
      '韩语口译（河内市区，1 天）',
      '韓国語通訳（ハノイ市内・1日）',
      'Intérprete de coreano (centro de Hanói, 1 día)',
      'Phiên dịch tiếng Hàn (nội thành Hà Nội, 1 ngày)',
      'Interprète coréen (centre de Hanoï, 1 jour)',
      'Intérprete de coreano (centro de Hanói, 1 dia)',
      'Переводчик с корейского (центр Ханоя, 1 день)',
      'Penerjemah lisan Korea (pusat Hanoi, 1 hari)'
    ],
    detail: [
      '공장·시장 방문 동행. 8시간 기준, 이동·식사 포함.',
      'Accompanies factory and market visits. Eight hours, transport and meals included.',
      '陪同参观工厂与市场，8 小时计，含交通餐费。',
      '工場・市場訪問に同行。8時間基準、移動・食事込み。',
      'Acompaña visitas a fábricas y mercados. Ocho horas con transporte y comidas.',
      'Đi cùng thăm nhà máy, chợ. Tính 8 giờ, gồm đi lại và ăn uống.',
      'Accompagne les visites d’usines et de marchés. Huit heures, déplacement et repas inclus.',
      'Acompanha visitas a fábricas e mercados. Oito horas com transporte e refeições.',
      'Сопровождает на заводы и рынки. Восемь часов, проезд и питание включены.',
      'Mendampingi kunjungan pabrik dan pasar. Delapan jam, termasuk transport dan makan.'
    ],
    mode: 'pi', pi: 18, dev: 95, posted: '6h'
  },
  {
    id: 'wk-eg-1', rail: 'WORK', country: 'EG', city: 'Cairo', tag: 'translate',
    title: [
      '아랍어 자막 번역 (10분 영상)',
      'Arabic subtitle translation (10-minute video)',
      '阿拉伯语字幕翻译（10 分钟视频）',
      'アラビア語字幕翻訳（10分動画）',
      'Traducción de subtítulos al árabe (vídeo de 10 min)',
      'Dịch phụ đề tiếng Ả Rập (video 10 phút)',
      'Traduction de sous-titres en arabe (vidéo de 10 min)',
      'Tradução de legendas em árabe (vídeo de 10 min)',
      'Перевод субтитров на арабский (видео 10 минут)',
      'Terjemahan subtitel bahasa Arab (video 10 menit)'
    ],
    detail: [
      '카이로 번역팀, 표준 아랍어·이집트 방언 선택. 타임코드 포함.',
      'Cairo team; choose Modern Standard or Egyptian dialect. Timecodes included.',
      '开罗团队，可选标准阿拉伯语或埃及方言，含时间码。',
      'カイロのチーム。標準アラビア語かエジプト方言を選択。タイムコード付き。',
      'Equipo de El Cairo; árabe estándar o dialecto egipcio. Con códigos de tiempo.',
      'Nhóm Cairo; chọn tiếng Ả Rập chuẩn hoặc phương ngữ Ai Cập. Có mã thời gian.',
      'Équipe du Caire ; arabe standard ou dialecte égyptien. Timecodes inclus.',
      'Equipe do Cairo; árabe padrão ou dialeto egípcio. Com timecodes.',
      'Команда в Каире; стандартный арабский или египетский диалект. С таймкодами.',
      'Tim Kairo; pilih Arab standar atau dialek Mesir. Termasuk timecode.'
    ],
    mode: 'pi', pi: 4, dev: 92, posted: '9h'
  },
  {
    id: 'wk-us-1', rail: 'WORK', country: 'US', city: 'Austin', tag: 'dev',
    title: [
      '랜딩페이지 수정 (React, 3일)',
      'Landing page fixes (React, three days)',
      '落地页修改（React，3 天）',
      'ランディングページ修正（React・3日）',
      'Ajustes de landing page (React, tres días)',
      'Sửa landing page (React, 3 ngày)',
      'Retouches de page d’atterrissage (React, trois jours)',
      'Ajustes de landing page (React, três dias)',
      'Правки лендинга (React, три дня)',
      'Perbaikan landing page (React, tiga hari)'
    ],
    detail: [
      '성능·접근성 점검 포함. 결과물은 저장소 PR로 전달.',
      'Performance and accessibility pass included. Delivered as a repository pull request.',
      '含性能与无障碍检查，以仓库 PR 交付。',
      'パフォーマンス・アクセシビリティ確認込み。成果物はリポジトリのPRで納品。',
      'Incluye revisión de rendimiento y accesibilidad. Se entrega como pull request.',
      'Gồm kiểm tra hiệu năng và trợ năng. Giao bằng pull request trên repo.',
      'Audit performance et accessibilité inclus. Livré en pull request.',
      'Inclui revisão de desempenho e acessibilidade. Entregue como pull request.',
      'Включает проверку скорости и доступности. Результат — pull request в репозитории.',
      'Termasuk audit performa dan aksesibilitas. Dikirim sebagai pull request.'
    ],
    mode: 'pi', pi: 50, dev: 98, posted: '1d'
  },

  /* ── 🥕 동네 당근·바터 ────────────────────────────────────────── */
  {
    id: 'lc-in-1', rail: 'LOCAL', country: 'IN', city: 'Mumbai', tag: 'goods',
    title: [
      '아이폰 12 128GB (배터리 87%)',
      'iPhone 12 128GB (battery 87%)',
      'iPhone 12 128GB（电池 87%）',
      'iPhone 12 128GB（バッテリー87%）',
      'iPhone 12 128GB (batería 87 %)',
      'iPhone 12 128GB (pin 87%)',
      'iPhone 12 128GB (batterie 87 %)',
      'iPhone 12 128GB (bateria 87%)',
      'iPhone 12 128GB (АКБ 87%)',
      'iPhone 12 128GB (baterai 87%)'
    ],
    detail: [
      '뭄바이 안드헤리 직거래. 잔기스 2곳, 케이스·충전기 포함.',
      'Direct handover in Andheri, Mumbai. Two light scratches, case and charger included.',
      '孟买安德里当面交易，两处轻微划痕，含保护壳与充电器。',
      'ムンバイ・アンデリで直接受け渡し。小傷2か所、ケース・充電器付き。',
      'Entrega en mano en Andheri, Bombay. Dos arañazos leves, funda y cargador incluidos.',
      'Giao trực tiếp ở Andheri, Mumbai. Hai vết xước nhẹ, kèm ốp và sạc.',
      'Remise en main propre à Andheri, Bombay. Deux micro-rayures, coque et chargeur inclus.',
      'Entrega em mãos em Andheri, Mumbai. Dois riscos leves, capa e carregador inclusos.',
      'Личная передача в Андхери, Мумбаи. Две мелкие царапины, чехол и зарядка в комплекте.',
      'Serah terima langsung di Andheri, Mumbai. Dua lecet halus, termasuk casing dan charger.'
    ],
    mode: 'pi', pi: 45, dev: 94, posted: '4h'
  },
  {
    id: 'lc-ng-1', rail: 'LOCAL', country: 'NG', city: 'Lagos', tag: 'goods',
    title: [
      '중고 노트북 HP i5 8GB (2021)',
      'Used HP laptop, i5 8GB (2021)',
      '惠普二手笔记本 i5 8GB（2021）',
      '中古HPノートPC i5 8GB（2021）',
      'Portátil HP usado, i5 8GB (2021)',
      'Laptop HP cũ i5 8GB (2021)',
      'Portable HP d’occasion, i5 8GB (2021)',
      'Notebook HP usado, i5 8GB (2021)',
      'Б/у ноутбук HP, i5 8GB (2021)',
      'Laptop HP bekas, i5 8GB (2021)'
    ],
    detail: [
      '라고스 수루레레. 배터리 3시간, 윈도우 11 설치됨. 충전기 포함.',
      'Surulere, Lagos. Three-hour battery, Windows 11 installed, charger included.',
      '拉各斯苏鲁莱雷，续航 3 小时，已装 Windows 11，含充电器。',
      'ラゴス・スルレレ。バッテリー3時間、Windows 11導入済み、充電器付き。',
      'Surulere, Lagos. Batería de tres horas, Windows 11 instalado, cargador incluido.',
      'Surulere, Lagos. Pin 3 giờ, đã cài Windows 11, kèm sạc.',
      'Surulere, Lagos. Autonomie trois heures, Windows 11 installé, chargeur inclus.',
      'Surulere, Lagos. Bateria de três horas, Windows 11 instalado, carregador incluso.',
      'Сурулере, Лагос. Батарея на три часа, Windows 11 установлена, зарядка в комплекте.',
      'Surulere, Lagos. Baterai tiga jam, Windows 11 terpasang, termasuk charger.'
    ],
    mode: 'pi', pi: 28, dev: 90, posted: '7h'
  },
  {
    id: 'lc-ke-1', rail: 'LOCAL', country: 'KE', city: 'Nairobi', tag: 'goods',
    title: [
      '2도어 냉장고 (정상 작동)',
      'Two-door refrigerator (working)',
      '双门冰箱（正常运转）',
      '2ドア冷蔵庫（正常動作）',
      'Frigorífico de dos puertas (funciona)',
      'Tủ lạnh 2 cánh (hoạt động tốt)',
      'Réfrigérateur deux portes (en état)',
      'Geladeira duas portas (funcionando)',
      'Двухдверный холодильник (рабочий)',
      'Kulkas dua pintu (berfungsi)'
    ],
    detail: [
      '나이로비 카사라니. 220L, 직접 운반 필요. 현장 시험 가동 가능.',
      'Kasarani, Nairobi. 220 L; buyer collects. Can be test-run on site.',
      '内罗毕卡萨拉尼，220 升，需自取，可现场试机。',
      'ナイロビ・カサラニ。220L、引き取り必要、現地で試運転可。',
      'Kasarani, Nairobi. 220 L; el comprador lo recoge. Se puede probar allí.',
      'Kasarani, Nairobi. 220 L, người mua tự vận chuyển. Có thể chạy thử tại chỗ.',
      'Kasarani, Nairobi. 220 L ; enlèvement par l’acheteur. Essai possible sur place.',
      'Kasarani, Nairóbi. 220 L; retirada pelo comprador. Pode ser testado no local.',
      'Казарани, Найроби. 220 л; самовывоз. Можно проверить на месте.',
      'Kasarani, Nairobi. 220 L; diambil sendiri. Bisa dicoba di tempat.'
    ],
    mode: 'pi', pi: 22, dev: 88, posted: '1d'
  },
  {
    id: 'lc-gh-1', rail: 'LOCAL', country: 'GH', city: 'Accra', tag: 'barter',
    title: [
      '쌀 25kg ↔ 중고 스마트폰 교환',
      '25 kg rice ↔ used smartphone swap',
      '25 公斤大米 ↔ 二手智能手机交换',
      '米25kg ↔ 中古スマホ交換',
      'Saco de arroz 25 kg ↔ móvil usado',
      'Gạo 25kg ↔ đổi điện thoại cũ',
      'Sac de riz 25 kg ↔ smartphone d’occasion',
      'Saco de arroz 25 kg ↔ celular usado',
      'Мешок риса 25 кг ↔ б/у смартфон',
      'Beras 25 kg ↔ tukar ponsel bekas'
    ],
    detail: [
      '아크라 마디나. 국산 쌀 미개봉, 안드로이드 8 이상 스마트폰과 교환 원함.',
      'Madina, Accra. Unopened local rice; looking for an Android 8 or newer phone.',
      '阿克拉马迪纳。本地大米未开封，想换安卓 8 以上手机。',
      'アクラ・マディナ。地元産米の未開封品。Android 8以上の端末と交換希望。',
      'Madina, Accra. Arroz local sin abrir; busca un Android 8 o superior.',
      'Madina, Accra. Gạo địa phương chưa mở; muốn đổi điện thoại Android 8 trở lên.',
      'Madina, Accra. Riz local non ouvert ; recherche un Android 8 ou plus récent.',
      'Madina, Acra. Arroz local lacrado; procura Android 8 ou superior.',
      'Мадина, Аккра. Местный рис, упаковка целая; нужен Android 8 или новее.',
      'Madina, Accra. Beras lokal belum dibuka; ingin tukar Android 8 ke atas.'
    ],
    mode: 'barter', dev: 89, posted: '1d'
  },
  {
    id: 'lc-za-1', rail: 'LOCAL', country: 'ZA', city: 'Johannesburg', tag: 'goods',
    title: [
      '중고 타이어 4본 (17인치)',
      'Four used tyres (17-inch)',
      '二手轮胎 4 条（17 英寸）',
      '中古タイヤ4本（17インチ）',
      'Cuatro neumáticos usados (17 pulgadas)',
      'Bốn lốp cũ (17 inch)',
      'Quatre pneus d’occasion (17 pouces)',
      'Quatro pneus usados (17 polegadas)',
      'Четыре б/у шины (17 дюймов)',
      'Empat ban bekas (17 inci)'
    ],
    detail: [
      '요하네스버그 소웨토. 트레드 6mm 이상, 1본 예비 포함.',
      'Soweto, Johannesburg. Tread above 6 mm; one spare included.',
      '约翰内斯堡索韦托，胎纹 6 毫米以上，含一条备用。',
      'ヨハネスブルグ・ソウェト。溝6mm以上、予備1本付き。',
      'Soweto, Johannesburgo. Dibujo de más de 6 mm; incluye una de repuesto.',
      'Soweto, Johannesburg. Gai lốp trên 6 mm; kèm một lốp dự phòng.',
      'Soweto, Johannesbourg. Sculptures supérieures à 6 mm ; un pneu de secours inclus.',
      'Soweto, Joanesburgo. Sulco acima de 6 mm; inclui um estepe.',
      'Соуэто, Йоханнесбург. Протектор больше 6 мм; одно колесо в запас.',
      'Soweto, Johannesburg. Tapak di atas 6 mm; termasuk satu cadangan.'
    ],
    mode: 'pi', pi: 9, dev: 87, posted: '2d'
  },
  {
    id: 'lc-id-1', rail: 'LOCAL', country: 'ID', city: 'Jakarta', tag: 'goods',
    title: [
      '오토바이 혼다 베어 (2019)',
      'Honda BeAT scooter (2019)',
      '本田 BeAT 摩托车（2019）',
      'ホンダ BeAT バイク（2019）',
      'Moto Honda BeAT (2019)',
      'Xe Honda BeAT (2019)',
      'Scooter Honda BeAT (2019)',
      'Moto Honda BeAT (2019)',
      'Скутер Honda BeAT (2019)',
      'Motor Honda BeAT (2019)'
    ],
    detail: [
      '자카르타 남부. 주행 2만km, 정비 이력 있음. 명의 이전 협조.',
      'South Jakarta. 20,000 km, service history available. Owner will assist with transfer.',
      '雅加达南部，行驶 2 万公里，有保养记录，可协助过户。',
      '南ジャカルタ。走行2万km、整備履歴あり。名義変更に協力。',
      'Yakarta Sur. 20.000 km, con historial de mantenimiento. Ayuda en el traspaso.',
      'Nam Jakarta. Chạy 20.000 km, có lịch sử bảo dưỡng. Hỗ trợ sang tên.',
      'Jakarta-Sud. 20 000 km, entretien suivi. Aide au transfert de carte grise.',
      'Jacarta Sul. 20.000 km, com histórico de revisões. Ajuda na transferência.',
      'Южная Джакарта. 20 000 км, есть история обслуживания. Поможет с переоформлением.',
      'Jakarta Selatan. 20.000 km, ada riwayat servis. Dibantu proses balik nama.'
    ],
    mode: 'pi', pi: 120, dev: 86, posted: '2d'
  },
  {
    id: 'lc-kr-1', rail: 'LOCAL', country: 'KR', city: '부산', tag: 'goods',
    title: [
      '중고 세탁기 9kg (설치 포함)',
      'Used washing machine, 9 kg (installation included)',
      '二手洗衣机 9 公斤（含安装）',
      '中古洗濯機 9kg（設置込み）',
      'Lavadora usada de 9 kg (instalación incluida)',
      'Máy giặt cũ 9 kg (kèm lắp đặt)',
      'Lave-linge d’occasion 9 kg (installation incluse)',
      'Máquina de lavar usada 9 kg (instalação inclusa)',
      'Б/у стиральная машина 9 кг (с установкой)',
      'Mesin cuci bekas 9 kg (termasuk pemasangan)'
    ],
    detail: [
      '부산 해운대. 3년 사용, 호스·배수관 새것으로 교체해 설치.',
      'Haeundae, Busan. Three years of use; hose and drain replaced with new parts at install.',
      '釜山海云台，使用 3 年，安装时更换全新水管与排水管。',
      '釜山・海雲台。3年使用、設置時にホース・排水管を新品交換。',
      'Haeundae, Busan. Tres años de uso; manguera y desagüe nuevos al instalar.',
      'Haeundae, Busan. Dùng 3 năm; thay ống cấp và thoát mới khi lắp.',
      'Haeundae, Busan. Trois ans d’usage ; tuyau et évacuation neufs à l’installation.',
      'Haeundae, Busan. Três anos de uso; mangueira e dreno novos na instalação.',
      'Хаундэ, Пусан. Три года эксплуатации; шланг и слив меняются на новые при установке.',
      'Haeundae, Busan. Dipakai tiga tahun; selang dan pembuangan diganti baru saat pasang.'
    ],
    mode: 'pi', pi: 15, dev: 96, posted: '3h'
  },
  {
    id: 'lc-br-1', rail: 'LOCAL', country: 'BR', city: 'São Paulo', tag: 'barter',
    title: [
      '중고 자전거 ↔ 전동 공구 교환',
      'Used bicycle ↔ power tools swap',
      '二手自行车 ↔ 电动工具交换',
      '中古自転車 ↔ 電動工具交換',
      'Bicicleta usada ↔ herramientas eléctricas',
      'Xe đạp cũ ↔ đổi dụng cụ điện',
      'Vélo d’occasion ↔ outils électriques',
      'Bicicleta usada ↔ ferramentas elétricas',
      'Б/у велосипед ↔ электроинструмент',
      'Sepeda bekas ↔ tukar perkakas listrik'
    ],
    detail: [
      '상파울루 빌라 마달레나. 21단 산악 자전거, 그라인더·드릴 세트와 교환 희망.',
      'Vila Madalena, São Paulo. 21-speed mountain bike; wants a grinder and drill set.',
      '圣保罗维拉马达莱纳，21 速山地车，想换角磨机与电钻套装。',
      'サンパウロ・ヴィラ・マダレーナ。21段MTB、グラインダー・ドリルセットと交換希望。',
      'Vila Madalena, São Paulo. Bici de montaña de 21 marchas; busca amoladora y taladro.',
      'Vila Madalena, São Paulo. Xe đạp leo núi 21 tốc độ; muốn đổi máy mài và khoan.',
      'Vila Madalena, São Paulo. VTT 21 vitesses ; échange contre meuleuse et perceuse.',
      'Vila Madalena, São Paulo. Bike de 21 marchas; quer trocar por esmerilhadeira e furadeira.',
      'Вила-Мадалена, Сан-Паулу. Горный велосипед на 21 скорость; нужен УШМ и дрель.',
      'Vila Madalena, São Paulo. Sepeda gunung 21 gigi; ingin tukar gerinda dan bor.'
    ],
    mode: 'barter', dev: 91, posted: '1d'
  },

  /* ── 🛰️ B2B·대형 실물 ────────────────────────────────────────── */
  {
    id: 'b2-in-1', rail: 'B2B', country: 'IN', city: 'Bengaluru', tag: 'energy',
    title: [
      '산업용 인버터 100kW ×5대 견적',
      'Industrial inverters 100 kW ×5 — quote',
      '工业逆变器 100kW ×5 报价',
      '産業用インバーター 100kW ×5台 見積',
      'Inversores industriales 100 kW ×5 — cotización',
      'Báo giá biến tần công nghiệp 100 kW ×5',
      'Onduleurs industriels 100 kW ×5 — devis',
      'Inversores industriais 100 kW ×5 — cotação',
      'Промышленные инверторы 100 кВт ×5 — расчёт',
      'Penawaran inverter industri 100 kW ×5'
    ],
    detail: [
      '벵갈루루 공장 직접 공급. 설치·시운전 포함, 90일 보증. 분할 지급(30/70).',
      'Supplied direct from a Bengaluru plant. Install, commissioning and 90-day warranty; split payment (30/70).',
      '班加罗尔工厂直供，含安装调试与 90 天保修，分期付款（30/70）。',
      'ベンガルール工場から直送。設置・試運転込み、90日保証。分割支払い(30/70)。',
      'Suministro directo desde planta de Bangalore. Instalación, puesta en marcha y garantía de 90 días; pago dividido (30/70).',
      'Cung cấp trực tiếp từ nhà máy Bengaluru. Gồm lắp đặt, chạy thử, bảo hành 90 ngày; thanh toán chia đợt (30/70).',
      'Fourni directement par l’usine de Bangalore. Installation, mise en service et garantie 90 jours ; paiement échelonné (30/70).',
      'Fornecido direto da fábrica em Bengaluru. Instalação, comissionamento e garantia de 90 dias; pagamento dividido (30/70).',
      'Поставка напрямую с завода в Бенгалуру. Монтаж, пуск, гарантия 90 дней; оплата частями (30/70).',
      'Dipasok langsung dari pabrik Bengaluru. Termasuk pemasangan, uji jalan, garansi 90 hari; pembayaran bertahap (30/70).'
    ],
    mode: 'pi', pi: 900, dev: 97, escrow: true, posted: '5h'
  },
  {
    id: 'b2-ng-1', rail: 'B2B', country: 'NG', city: 'Lagos', tag: 'energy',
    title: [
      '태양광 배터리 48V 200Ah ×20세트',
      'Solar batteries 48 V 200 Ah ×20 sets',
      '太阳能电池 48V 200Ah ×20 组',
      '太陽光バッテリー 48V 200Ah ×20セット',
      'Baterías solares 48 V 200 Ah ×20 juegos',
      'Pin mặt trời 48V 200Ah ×20 bộ',
      'Batteries solaires 48 V 200 Ah ×20',
      'Baterias solares 48 V 200 Ah ×20 conjuntos',
      'Солнечные АКБ 48 В 200 А·ч ×20 комплектов',
      'Baterai surya 48V 200Ah ×20 set'
    ],
    detail: [
      '라고스 이케자 물류센터 인도. 리튬인산철, 6,000사이클. 하자 2년.',
      'Delivery at an Ikeja, Lagos warehouse. LiFePO4, 6,000 cycles, two-year defect cover.',
      '拉各斯伊凯贾物流中心交货，磷酸铁锂，6000 次循环，两年质保。',
      'ラゴス・イケジャの物流センター渡し。リン酸鉄リチウム、6,000サイクル、2年保証。',
      'Entrega en almacén de Ikeja, Lagos. LiFePO4, 6.000 ciclos, dos años de garantía.',
      'Giao tại kho Ikeja, Lagos. LiFePO4, 6.000 chu kỳ, bảo hành lỗi 2 năm.',
      'Livraison en entrepôt à Ikeja, Lagos. LiFePO4, 6 000 cycles, garantie deux ans.',
      'Entrega em armazém em Ikeja, Lagos. LiFePO4, 6.000 ciclos, dois anos de garantia.',
      'Доставка на склад в Икедже, Лагос. LiFePO4, 6000 циклов, гарантия два года.',
      'Pengiriman di gudang Ikeja, Lagos. LiFePO4, 6.000 siklus, garansi dua tahun.'
    ],
    mode: 'pi', pi: 640, dev: 93, escrow: true, posted: '1d'
  },
  {
    id: 'b2-za-1', rail: 'B2B', country: 'ZA', city: 'Johannesburg', tag: 'equip',
    title: [
      '광산 컨베이어 벨트 부품 (롤러·베어링)',
      'Mine conveyor parts (rollers, bearings)',
      '矿山输送带配件（托辊·轴承）',
      '鉱山コンベヤ部品（ローラー・ベアリング）',
      'Repuestos de cinta transportadora minera (rodillos, rodamientos)',
      'Phụ tùng băng tải mỏ (con lăn, vòng bi)',
      'Pièces de convoyeur minier (rouleaux, roulements)',
      'Peças de correia transportadora de mina (roletes, rolamentos)',
      'Детали шахтного конвейера (ролики, подшипники)',
      'Suku cadang konveyor tambang (roler, bearing)'
    ],
    detail: [
      '요하네스버그 창고 재고, 48시간 내 출고. 규격 도면 첨부 요청.',
      'Stocked in a Johannesburg warehouse, dispatched within 48 hours. Send your spec drawing.',
      '约翰内斯堡仓库现货，48 小时内出库，请附规格图纸。',
      'ヨハネスブルグ倉庫在庫、48時間以内に出荷。規格図面をご送付ください。',
      'En stock en Johannesburgo, sale en 48 h. Envíe su plano de especificaciones.',
      'Có sẵn tại kho Johannesburg, xuất trong 48 giờ. Vui lòng gửi bản vẽ quy cách.',
      'En stock à Johannesbourg, expédié sous 48 h. Merci d’envoyer le plan de spécification.',
      'Em estoque em Joanesburgo, despacho em 48 h. Envie o desenho de especificação.',
      'На складе в Йоханнесбурге, отгрузка в течение 48 часов. Пришлите чертёж.',
      'Stok di gudang Johannesburg, keluar dalam 48 jam. Kirim gambar spesifikasi.'
    ],
    mode: 'pi', pi: 1200, dev: 95, escrow: true, posted: '1d'
  },
  {
    id: 'b2-eg-1', rail: 'B2B', country: 'EG', city: 'Cairo', tag: 'telecom',
    title: [
      '통신 기지국 안테나 12기 (교체)',
      'Telecom base-station antennas ×12 (replacement)',
      '通信基站天线 12 面（更换）',
      '通信基地局アンテナ 12基（交換）',
      'Antenas de estación base ×12 (sustitución)',
      'Anten gốc trạm BTS ×12 (thay thế)',
      'Antennes de station de base ×12 (remplacement)',
      'Antenas de estação-base ×12 (substituição)',
      'Антенны базовых станций ×12 (замена)',
      'Antena base transceiver ×12 (penggantian)'
    ],
    detail: [
      '카이로 교외 사이트 3곳. 철거·설치 인력 포함, 야간 작업 가능.',
      'Three suburban Cairo sites. Removal and install crew included; night work possible.',
      '开罗郊区三个站点，含拆卸与安装人员，可夜间施工。',
      'カイロ郊外3サイト。撤去・設置の人員込み、夜間作業可。',
      'Tres emplazamientos en las afueras de El Cairo. Con equipo de desmontaje e instalación; turno de noche posible.',
      'Ba trạm ngoại ô Cairo. Gồm đội tháo lắp; có thể làm ban đêm.',
      'Trois sites en banlieue du Caire. Équipe de dépose et pose incluse ; travail de nuit possible.',
      'Três locais na periferia do Cairo. Com equipe de remoção e instalação; trabalho noturno disponível.',
      'Три площадки под Каиром. Бригада демонтажа и монтажа включена; возможна ночная работа.',
      'Tiga lokasi pinggiran Kairo. Termasuk tim bongkar-pasang; bisa kerja malam.'
    ],
    mode: 'pi', pi: 780, dev: 90, escrow: true, posted: '2d'
  },
  {
    id: 'b2-kr-1', rail: 'B2B', country: 'KR', city: '인천', tag: 'energy',
    title: [
      '공장 지붕 태양광 300kW 설계·시공',
      'Factory rooftop solar 300 kW — design & build',
      '工厂屋顶光伏 300kW 设计施工',
      '工場屋根太陽光 300kW 設計・施工',
      'Solar en cubierta industrial 300 kW — diseño y obra',
      'Điện mặt trời mái nhà xưởng 300 kW — thiết kế và thi công',
      'Solaire en toiture d’usine 300 kW — étude et travaux',
      'Solar em telhado de fábrica 300 kW — projeto e obra',
      'Солнечная станция на крыше завода 300 кВт — проект и монтаж',
      'PLTS atap pabrik 300 kW — desain dan pemasangan'
    ],
    detail: [
      '인천 남동공단. 구조 안전진단·인허가 대행 포함. 발전량 보증 20년, 임대 조건 협의.',
      'Namdong complex, Incheon. Structural check and permits included. 20-year yield guarantee; lease terms negotiable.',
      '仁川南洞工团，含结构安全评估与许可代办，20 年发电量保证，租赁条件可议。',
      '仁川南洞工団。構造安全診断・許認可代行込み。発電量20年保証、リース条件は協議可。',
      'Complejo Namdong, Incheon. Incluye revisión estructural y permisos. Garantía de producción 20 años; condiciones de arriendo negociables.',
      'Khu công nghiệp Namdong, Incheon. Gồm kiểm tra kết cấu và xin phép. Bảo đảm sản lượng 20 năm; điều kiện thuê thương lượng.',
      'Complexe de Namdong, Incheon. Contrôle structurel et permis inclus. Garantie de production 20 ans ; conditions de location négociables.',
      'Complexo Namdong, Incheon. Inclui laudo estrutural e licenças. Garantia de geração de 20 anos; condições de locação negociáveis.',
      'Комплекс Намдон, Инчхон. Включает проверку конструкций и оформление разрешений. Гарантия выработки 20 лет; условия аренды обсуждаемы.',
      'Kawasan Namdong, Incheon. Termasuk cek struktur dan perizinan. Garansi produksi 20 tahun; syarat sewa bisa dinegosiasi.'
    ],
    mode: 'quote', dev: 99, escrow: true, posted: '4h'
  },
  {
    id: 'b2-vn-1', rail: 'B2B', country: 'VN', city: 'Hai Phong', tag: 'equip',
    title: [
      '조립 라인 컨베이어 2라인',
      'Assembly-line conveyors, two lines',
      '装配线输送带 2 条',
      '組立ライン コンベヤ2ライン',
      'Cintas de línea de montaje, dos líneas',
      'Băng tải dây chuyền lắp ráp 2 line',
      'Convoyeurs de ligne d’assemblage, deux lignes',
      'Esteiras de linha de montagem, duas linhas',
      'Конвейеры сборочной линии, две линии',
      'Konveyor lini perakitan, dua lini'
    ],
    detail: [
      '하이퐁 공단. 폭 600mm, 길이 24m. 전장·제어반 포함, 6주 납기.',
      'Hai Phong industrial park. 600 mm wide, 24 m long. Electrics and control panel included; six-week lead time.',
      '海防工业区，宽 600 毫米、长 24 米，含电气与控制柜，交期 6 周。',
      'ハイフォン工業団地。幅600mm・長さ24m。電気・制御盤込み、納期6週間。',
      'Parque industrial de Hai Phong. 600 mm de ancho, 24 m de largo. Eléctrico y cuadro de control incluidos; plazo de seis semanas.',
      'Khu công nghiệp Hải Phòng. Rộng 600 mm, dài 24 m. Gồm điện và tủ điều khiển; giao trong 6 tuần.',
      'Parc industriel de Hai Phong. 600 mm de large, 24 m de long. Électrique et armoire inclus ; délai de six semaines.',
      'Distrito industrial de Hai Phong. 600 mm de largura, 24 m de comprimento. Elétrica e painel incluídos; prazo de seis semanas.',
      'Промзона Хайфона. Ширина 600 мм, длина 24 м. Электрика и шкаф управления включены; срок шесть недель.',
      'Kawasan industri Hai Phong. Lebar 600 mm, panjang 24 m. Termasuk kelistrikan dan panel kontrol; pengiriman enam minggu.'
    ],
    mode: 'pi', pi: 1050, dev: 94, escrow: true, posted: '2d'
  },
  {
    id: 'b2-global-1', rail: 'B2B', country: 'GLOBAL', city: 'Asia · Africa', tag: 'telecom',
    title: [
      '위성 통신 대역폭 36MHz (연간)',
      'Satellite bandwidth 36 MHz (annual)',
      '卫星通信带宽 36MHz（年）',
      '衛星通信帯域 36MHz（年間）',
      'Ancho de banda satelital 36 MHz (anual)',
      'Băng thông vệ tinh 36 MHz (năm)',
      'Bande passante satellite 36 MHz (annuel)',
      'Largura de banda de satélite 36 MHz (anual)',
      'Спутниковая полоса 36 МГц (год)',
      'Bandwidth satelit 36 MHz (tahunan)'
    ],
    detail: [
      'C·Ku 밴드 선택, 아시아·아프리카 커버리지. 계약 후 월 단위 정산.',
      'C or Ku band, Asia and Africa coverage. Contract with monthly settlement.',
      '可选 C 或 Ku 波段，覆盖亚洲与非洲，签约后按月结算。',
      'Cバンド・Kuバンド選択可、アジア・アフリカをカバー。契約後の月次精算。',
      'Banda C o Ku, cobertura Asia y África. Contrato con liquidación mensual.',
      'Chọn băng C hoặc Ku, phủ châu Á và châu Phi. Hợp đồng và thanh toán theo tháng.',
      'Bande C ou Ku, couverture Asie et Afrique. Contrat avec règlement mensuel.',
      'Banda C ou Ku, cobertura Ásia e África. Contrato com liquidação mensal.',
      'Диапазон C или Ku, покрытие Азии и Африки. Договор с ежемесячным расчётом.',
      'Pilih pita C atau Ku, cakupan Asia dan Afrika. Kontrak dengan penyelesaian bulanan.'
    ],
    mode: 'pi', pi: 8800, dev: 96, escrow: true, posted: '3d'
  },
  {
    id: 'b2-ke-1', rail: 'B2B', country: 'KE', city: 'Nairobi', tag: 'energy',
    title: [
      '태양광 미니그리드 20kW (마을 단위)',
      'Solar mini-grid 20 kW (village scale)',
      '光伏微电网 20kW（村级）',
      '太陽光ミニグリッド 20kW（村落規模）',
      'Minirred solar de 20 kW (escala de aldea)',
      'Lưới điện mini mặt trời 20 kW (cấp thôn)',
      'Mini-réseau solaire 20 kW (échelle village)',
      'Minirrede solar de 20 kW (escala de vila)',
      'Солнечная мини-сеть 20 кВт (на село)',
      'Microgrid surya 20 kW (skala desa)'
    ],
    detail: [
      '나이로비 외곽 3개 마을. 계량기·관리 앱 포함, 유지보수 3년 계약.',
      'Three villages outside Nairobi. Meters and a management app included; three-year maintenance contract.',
      '内罗毕郊外三个村庄，含电表与管理应用，三年维护合同。',
      'ナイロビ郊外3村。メーターと管理アプリ込み、3年保守契約。',
      'Tres aldeas a las afueras de Nairobi. Contadores y app de gestión incluidos; mantenimiento por tres años.',
      'Ba ngôi làng ngoại ô Nairobi. Gồm đồng hồ và ứng dụng quản lý; bảo trì 3 năm.',
      'Trois villages près de Nairobi. Compteurs et application de gestion inclus ; maintenance sur trois ans.',
      'Três vilarejos nos arredores de Nairóbi. Medidores e app de gestão inclusos; manutenção por três anos.',
      'Три деревни под Найроби. Счётчики и приложение управления включены; обслуживание три года.',
      'Tiga desa di luar Nairobi. Termasuk meter dan aplikasi pengelola; pemeliharaan tiga tahun.'
    ],
    mode: 'pi', pi: 320, dev: 92, escrow: true, posted: '2d'
  },

  /* ── 추가: 양방향 인력(내 기술·시간) · 구해요 · 무료 나눔 ────────── */
  {
    id: 'wk-tal-in-1', rail: 'WORK', country: 'IN', city: 'Bengaluru', tag: 'translate',
    title: [
      '힌디·영어 번역·검수 (벵갈루루, 원격)',
      'Hindi–English translator & proofreader (Bengaluru, remote)',
      '印地语—英语翻译与校对（班加罗尔，远程）',
      'ヒンディー語—英語の翻訳・校正（ベンガルール、リモート）',
      'Traductor y corrector hindi–inglés (Bangalore, remoto)',
      'Dịch và hiệu đính Hindi–Anh (Bengaluru, từ xa)',
      'Traducteur et relecteur hindi–anglais (Bangalore, à distance)',
      'Tradutor e revisor hindi–inglês (Bengaluru, remoto)',
      'Переводчик и редактор хинди–английский (Бенгалуру, удалённо)',
      'Penerjemah & penyunting Hindi–Inggris (Bengaluru, jarak jauh)'
    ],
    detail: [
      '하루 3,000단어. 법률·의료 문서 경험 5년. 1,000단어당 2–3 Pi.',
      '3,000 words a day. Five years of legal and medical documents. 2–3 Pi per 1,000 words.',
      '每天 3,000 词，5 年法律与医疗文件经验，每千词 2–3 Pi。',
      '1日3,000語。法律・医療文書の経験5年。1,000語あたり2〜3 Pi。',
      '3.000 palabras al día. Cinco años en documentos legales y médicos. 2–3 Pi por 1.000 palabras.',
      '3.000 từ mỗi ngày. Năm năm tài liệu pháp lý và y tế. 2–3 Pi mỗi 1.000 từ.',
      '3 000 mots par jour. Cinq ans de documents juridiques et médicaux. 2–3 Pi les 1 000 mots.',
      '3.000 palavras por dia. Cinco anos em documentos jurídicos e médicos. 2–3 Pi por 1.000 palavras.',
      '3000 слов в день. Пять лет юридических и медицинских текстов. 2–3 Pi за 1000 слов.',
      '3.000 kata per hari. Lima tahun dokumen hukum dan medis. 2–3 Pi per 1.000 kata.'
    ],
    mode: 'pi', piMin: 2, piMax: 3, dev: 0, posted: ''
  },
  {
    id: 'wk-tal-ng-1', rail: 'WORK', country: 'NG', city: 'Lagos', tag: 'repair',
    title: [
      '스마트폰 수리 기술자 (라고스, 출장)',
      'Phone repair technician (Lagos, on site)',
      '手机维修技师（拉各斯，上门）',
      'スマホ修理技術者（ラゴス、出張）',
      'Técnico de reparación de móviles (Lagos, a domicilio)',
      'Kỹ thuật viên sửa điện thoại (Lagos, tận nơi)',
      'Technicien de réparation de téléphones (Lagos, à domicile)',
      'Técnico de reparo de celulares (Lagos, em domicílio)',
      'Мастер по ремонту телефонов (Лагос, с выездом)',
      'Teknisi servis ponsel (Lagos, panggilan)'
    ],
    detail: [
      '액정·배터리·충전 단자. 부품 실비 + 공임 8 Pi. 당일 방문.',
      'Screens, batteries, charging ports. Parts at cost plus 8 Pi labour. Same-day visit.',
      '屏幕、电池、充电口。配件实价加工费 8 Pi，当日上门。',
      '画面・バッテリー・充電端子。部品実費＋工賃8 Pi。当日訪問。',
      'Pantallas, baterías y puertos de carga. Piezas a coste más 8 Pi de mano de obra. Visita el mismo día.',
      'Màn hình, pin, chân sạc. Linh kiện giá gốc cộng 8 Pi công. Đến trong ngày.',
      'Écrans, batteries, connecteurs. Pièces au prix coûtant + 8 Pi de main-d’œuvre. Visite le jour même.',
      'Telas, baterias e conectores. Peças pelo custo mais 8 Pi de mão de obra. Visita no mesmo dia.',
      'Экраны, АКБ, разъёмы. Детали по себестоимости + 8 Pi за работу. Выезд в тот же день.',
      'Layar, baterai, port pengisian. Part harga pokok plus 8 Pi jasa. Datang hari yang sama.'
    ],
    mode: 'pi', pi: 8, dev: 0, posted: ''
  },
  {
    id: 'lc-kr-2', rail: 'LOCAL', country: 'KR', city: '부산', tag: 'goods',
    title: [
      '구해요 — 9kg 세탁기 (부산 해운대)',
      'Wanted — 9 kg washing machine (Haeundae, Busan)',
      '求购 — 9 公斤洗衣机（釜山海云台）',
      '求む — 9kg洗濯機（釜山・海雲台）',
      'Busco — lavadora de 9 kg (Haeundae, Busan)',
      'Cần mua — máy giặt 9 kg (Haeundae, Busan)',
      'Recherche — lave-linge 9 kg (Haeundae, Busan)',
      'Procuro — máquina de lavar 9 kg (Haeundae, Busan)',
      'Куплю — стиральную машину 9 кг (Хаундэ, Пусан)',
      'Cari — mesin cuci 9 kg (Haeundae, Busan)'
    ],
    detail: [
      '이사 오면서 필요해졌습니다. 5년 이내 제품, 시운전 확인 후 15 Pi까지. 직접 가져갑니다.',
      'Needed after moving in. Up to 15 Pi for a unit under five years old, tested before payment. I collect.',
      '搬家后需要。五年以内机器、试机确认后最高 15 Pi，自取。',
      '引っ越しで必要になりました。5年以内の製品、試運転確認後に15 Piまで。こちらが引き取りに伺います。',
      'Me hace falta tras la mudanza. Hasta 15 Pi por una unidad de menos de cinco años, probada antes de pagar. Yo la recojo.',
      'Cần sau khi chuyển nhà. Tối đa 15 Pi cho máy dưới 5 năm, chạy thử trước khi trả. Tôi tự vận chuyển.',
      'Besoin après un déménagement. Jusqu’à 15 Pi pour un appareil de moins de cinq ans, testé avant paiement. Je viens le chercher.',
      'Preciso após a mudança. Até 15 Pi por um aparelho com menos de cinco anos, testado antes do pagamento. Eu retiro.',
      'Нужна после переезда. До 15 Pi за аппарат не старше пяти лет, с проверкой до оплаты. Заберу сам.',
      'Butuh setelah pindahan. Hingga 15 Pi untuk unit di bawah lima tahun, dites sebelum bayar. Saya ambil sendiri.'
    ],
    mode: 'pi', pi: 15, dev: 0, posted: ''
  },
  {
    id: 'lc-kr-3', rail: 'LOCAL', country: 'KR', city: '부산', tag: 'goods',
    title: [
      '무료 나눔 — 이삿짐 박스 20개 (부산 수영구)',
      'Free — 20 moving boxes (Suyeong, Busan)',
      '免费赠送 — 搬家纸箱 20 个（釜山水营区）',
      '無料で譲ります — 引っ越し用段ボール20個（釜山・水営区）',
      'Gratis — 20 cajas de mudanza (Suyeong, Busan)',
      'Tặng miễn phí — 20 thùng carton chuyển nhà (Suyeong, Busan)',
      'Don — 20 cartons de déménagement (Suyeong, Busan)',
      'Doação — 20 caixas de mudança (Suyeong, Busan)',
      'Отдам даром — 20 коробок для переезда (Суён, Пусан)',
      'Gratis — 20 kardus pindahan (Suyeong, Busan)'
    ],
    detail: [
      '한 번 쓴 튼튼한 박스입니다. 오늘 저녁까지 가져가실 분. 문 앞까지 내드립니다.',
      'Sturdy boxes, used once. Take them by tonight; I will carry them to the door.',
      '结实的纸箱，用过一次。今晚前自取，我送到门口。',
      '丈夫な段ボール、一度だけ使用。今夜までに取りに来られる方。玄関まで運びます。',
      'Cajas resistentes, usadas una vez. Antes de esta noche; las bajo a la puerta.',
      'Thùng chắc, dùng một lần. Nhận trước tối nay; tôi mang ra cửa.',
      'Cartons solides, utilisés une fois. À retirer avant ce soir ; je les descends à la porte.',
      'Caixas resistentes, usadas uma vez. Retirada até hoje à noite; levo até a porta.',
      'Прочные коробки, использовались один раз. Забрать до вечера; вынесу к двери.',
      'Kardus kokoh, dipakai sekali. Diambil sebelum malam ini; saya bawa sampai depan pintu.'
    ],
    mode: 'pi', dev: 0, posted: ''
  }
];


type SeedMeta = {
  side: SideKey;
  handoff: Handoff;
  tier: Tier;
  /** 몇 시간 전에 올라온 글인지 */
  hours: number;
  place?: string;
  mode?: DealMode;
  qty?: string;
  priceBreaks?: PriceBreak[];
  moq?: number;
  status?: ListingStatus;
};

const SEED_META: Record<string, SeedMeta> = {
  /* 👷 인력 — 일감 8 · 내 기술·시간 2 */
  'wk-in-1': { side: 'gig', handoff: 'remote', tier: 0, hours: 2, place: 'Bengaluru', qty: '500건' },
  'wk-ng-1': { side: 'gig', handoff: 'meet', tier: 0, hours: 5, place: 'Ikeja', qty: '1건' },
  'wk-ke-1': { side: 'gig', handoff: 'remote', tier: 0, hours: 24, place: 'Nairobi', qty: '2,000단어' },
  'wk-ph-1': { side: 'gig', handoff: 'remote', tier: 0, hours: 24, place: 'Manila', qty: '20시간/주' },
  'wk-kr-1': { side: 'gig', handoff: 'remote', tier: 1, hours: 3, place: '서울', qty: '10쪽' },
  'wk-vn-1': { side: 'gig', handoff: 'meet', tier: 0, hours: 6, place: 'Hanoi', qty: '1일' },
  'wk-eg-1': { side: 'gig', handoff: 'remote', tier: 0, hours: 9, place: 'Cairo', qty: '10분' },
  'wk-us-1': { side: 'gig', handoff: 'remote', tier: 2, hours: 24, place: 'Austin', qty: '3일' },
  'wk-tal-in-1': { side: 'skill', handoff: 'remote', tier: 0, hours: 6, place: 'Bengaluru', qty: '주 20시간' },
  'wk-tal-ng-1': { side: 'skill', handoff: 'meet', tier: 0, hours: 18, place: 'Lagos', qty: '1일' },

  /* 🥕 동네 — 직거래 6 · 구해요 1 · 나눔 1 */
  'lc-in-1': { side: 'sell', handoff: 'meet', tier: 0, hours: 4, place: 'Andheri' },
  'lc-ng-1': { side: 'sell', handoff: 'meet', tier: 0, hours: 7, place: 'Surulere' },
  'lc-ke-1': { side: 'sell', handoff: 'meet', tier: 0, hours: 24, place: 'Kasarani' },
  'lc-gh-1': { side: 'sell', handoff: 'meet', tier: 0, hours: 24, place: 'Madina', mode: 'barter' },
  'lc-za-1': { side: 'sell', handoff: 'meet', tier: 0, hours: 48, place: 'Soweto' },
  'lc-id-1': { side: 'sell', handoff: 'meet', tier: 0, hours: 48, place: 'Jakarta Selatan' },
  'lc-kr-1': { side: 'sell', handoff: 'meet', tier: 0, hours: 3, place: '해운대' },
  'lc-br-1': { side: 'sell', handoff: 'meet', tier: 0, hours: 24, place: 'Vila Madalena', mode: 'barter' },
  'lc-kr-2': { side: 'want', handoff: 'meet', tier: 0, hours: 9, place: '해운대' },
  'lc-kr-3': { side: 'free', handoff: 'meet', tier: 0, hours: 12, place: '수영구', mode: 'free' },

  /* 🛰️ B2B — 매물 7 · 견적요청(RFQ) 1 */
  'b2-in-1': {
    side: 'sell', handoff: 'freight', tier: 3, hours: 5, place: 'Bengaluru', mode: 'milestone',
    moq: 5,
    priceBreaks: [
      { label: '1–4', price: 900 },
      { label: '5–9', price: 870 },
      { label: '10+', price: 840 }
    ]
  },
  'b2-ng-1': { side: 'sell', handoff: 'delivery', tier: 3, hours: 24, place: 'Ikeja', mode: 'milestone' },
  'b2-za-1': { side: 'sell', handoff: 'delivery', tier: 2, hours: 24, place: 'Johannesburg', mode: 'milestone' },
  'b2-eg-1': { side: 'sell', handoff: 'freight', tier: 2, hours: 48, place: 'Cairo', mode: 'milestone' },
  'b2-kr-1': { side: 'rfq', handoff: 'freight', tier: 3, hours: 4, place: '남동공단', mode: 'offer' },
  'b2-vn-1': { side: 'sell', handoff: 'freight', tier: 3, hours: 48, place: 'Hai Phong', mode: 'milestone' },
  'b2-global-1': { side: 'sell', handoff: 'remote', tier: 3, hours: 72, place: 'Asia · Africa', mode: 'milestone' },
  'b2-ke-1': { side: 'sell', handoff: 'freight', tier: 3, hours: 48, place: 'Nairobi', mode: 'milestone' }
};

const HOUR = 3600_000;

/**
 * 시드 → 원장 행. dev·posted 같은 지어낸 값은 여기서 버린다.
 * 시드는 전부 demo: true 이고 발자국·실거래 인증이 0이다(측정된 적이 없으므로).
 */
export const SEED_LISTINGS: Listing[] = SEED_RAW.map(raw => {
  const fallback: SeedMeta = {
    side: raw.rail === 'WORK' ? 'gig' : 'sell',
    handoff: 'meet',
    tier: 0,
    hours: 24
  };
  const m = SEED_META[raw.id] ?? fallback;
  return {
    id: raw.id,
    rail: raw.rail,
    side: m.side,
    country: raw.country,
    city: raw.city,
    place: m.place,
    tag: raw.tag,
    title: raw.title,
    detail: raw.detail,
    mode: m.mode ?? (raw.mode === 'quote' ? 'offer' : raw.mode),
    handoff: m.handoff,
    pi: raw.pi,
    piMin: raw.piMin,
    piMax: raw.piMax,
    qty: m.qty,
    priceBreaks: m.priceBreaks,
    moq: m.moq,
    escrowSoon: raw.escrow === true,
    tier: m.tier,
    status: m.status ?? 'open',
    createdAt: new Date(Date.now() - m.hours * HOUR).toISOString(),
    demo: true,
    dealsDone: 0,
    dealsClosed: 0,
    reviews: 0,
    disputes: 0
  };
});

/* ------------------------------------------------------------------
 * 표시 도우미
 * ------------------------------------------------------------------ */

/** 올라온 지 얼마나 됐는지 — '2h' · '3d' (시드도 실제 시각에서 계산한다). */
export function ageLabel(iso: string | undefined): string {
  if (!iso) return '—';
  const diff = Date.now() - new Date(iso).getTime();
  if (!Number.isFinite(diff) || diff < 0) return 'now';
  const min = Math.floor(diff / 60000);
  if (min < 60) return `${Math.max(1, min)}m`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}

/** 예약 지속 시간 — 상대가 24시간 응답하지 않으면 자동으로 모집중으로 돌아간다. */
export const RESERVE_HOURS = 24;

/** 끌올은 open 상태에서만, 7일에 3회까지. */
export const BUMP_LIMIT = 3;
export const BUMP_WINDOW = 7 * 24 * HOUR;

/** 5단계 이행 타임라인 — 이행 방식마다 실제로 쓰는 칸이 다르다. */
export const DEAL_STAGES: Record<Handoff, UIKey[]> = {
  meet: ['statusReserved', 'handoffMeet', 'statusDone'],
  delivery: ['statusReserved', 'handoffDelivery', 'statusDone'],
  freight: ['statusReserved', 'handoffFreight', 'statusDone'],
  remote: ['statusReserved', 'handoffRemote', 'statusDone']
};
