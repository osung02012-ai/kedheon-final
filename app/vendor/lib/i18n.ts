/* ------------------------------------------------------------------
 * Vendor — 10-language layer (KR · EN · CN · JP · ES · VN · FR · PT · RU · ID)
 *
 * 표시 언어는 10개국어다. 인도·아프리카처럼 목록에 없는 언어권은 공용어
 * (EN·FR)로 읽는다. 반면 **거래 국가 선택은 238개국 전체**이며, 선택한 국가의
 * 인력·당근·B2B 원장으로 들어간다(countries.ts).
 * 모든 문구는 10-tuple 고정이라 언어가 하나 빠지면 빌드가 깨진다.
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
 * UI 사전 — 한 줄에 10개국어.
 * {c} = 국가명, {n} = 숫자 자리표시자.
 * ------------------------------------------------------------------ */
export const UI = {
  slogan: [
    '바늘부터 인공위성까지 — Pi KYC 1계정 인력·당근·실물 거래소',
    'From a needle to a satellite — work, barter and real goods on one Pi KYC account',
    '从一根针到一颗卫星——一个 Pi KYC 账户做人力、置换与实物交易',
    '針から人工衛星まで — Pi KYC 1アカウントで人力・物々交換・実物取引',
    'De una aguja a un satélite: trabajo, trueque y bienes reales con una cuenta Pi KYC',
    'Từ cây kim đến vệ tinh — nhân lực, trao đổi và hàng thật trên một tài khoản Pi KYC',
    'De l’aiguille au satellite — travail, troc et biens réels avec un seul compte Pi KYC',
    'Da agulha ao satélite — trabalho, troca e bens reais com uma conta Pi KYC',
    'От иголки до спутника — работа, обмен и реальные товары на одном аккаунте Pi KYC',
    'Dari jarum sampai satelit — tenaga kerja, barter, dan barang nyata dengan satu akun Pi KYC'
  ],
  imgAlt: [
    '바늘과 인공위성을 든 상인 고양이 — Vendor 실물 거래소',
    'Merchant cat holding a needle and a satellite — Vendor real-economy exchange',
    '拿着针与卫星的商人猫 — Vendor 实物交易所',
    '針と人工衛星を持つ商人の猫 — Vendor 実物取引所',
    'Gato comerciante con aguja y satélite — bolsa de bienes reales Vendor',
    'Mèo thương nhân cầm kim và vệ tinh — sàn hàng thật Vendor',
    'Chat marchand tenant une aiguille et un satellite — bourse de biens réels Vendor',
    'Gato comerciante com agulha e satélite — bolsa de bens reais Vendor',
    'Кот-торговец с иголкой и спутником — биржа реальных товаров Vendor',
    'Kucing pedagang membawa jarum dan satelit — bursa barang nyata Vendor'
  ],
  imgCaption: [
    '시장 골목에서 인공위성까지 — 한 계정으로 거래',
    'From a market alley to a satellite — trade on one account',
    '从市场小巷到卫星 — 一个账户完成交易',
    '市場の路地から人工衛星まで — 1アカウントで取引',
    'Del callejón del mercado al satélite: negocia con una cuenta',
    'Từ chợ nhỏ đến vệ tinh — giao dịch bằng một tài khoản',
    'De la ruelle du marché au satellite — échangez avec un compte',
    'Da viela do mercado ao satélite — negocie com uma conta',
    'От рыночного переулка до спутника — сделки с одного аккаунта',
    'Dari gang pasar sampai satelit — bertransaksi dengan satu akun'
  ],
  heroDesc: [
    '전 세계 238개국에서 인력·당근·대형 설비를 Pi로 직거래. 조건은 1줄로 확인하고, 신뢰는 Pi KYC 1계정과 발자국 이력으로 검증합니다.',
    'Work, neighbourhood goods and heavy equipment traded directly in Pi across 238 countries. Terms in one line; trust from one Pi KYC account and footprint history.',
    '在 238 个国家用 Pi 直接交易人力、邻里好物与大型设备。条件一行看完，信任来自 Pi KYC 单账户与足迹履历。',
    '世界238か国で人力・ご近所品・大型設備をPiで直接取引。条件は1行で確認、信頼はPi KYC 1アカウントと足あとの履歴で。',
    'Trabajo, bienes de barrio y equipo pesado en Pi por 238 países. Condiciones en una línea; confianza con una cuenta Pi KYC y el historial de huellas.',
    'Việc làm, đồ xóm giềng và thiết bị lớn giao dịch trực tiếp bằng Pi tại 238 quốc gia. Điều kiện gói trong một dòng; niềm tin từ một tài khoản Pi KYC và lịch sử dấu chân.',
    "Missions, objets de quartier et équipements lourds échangés en Pi dans 238 pays. Conditions en une ligne ; confiance via un compte Pi KYC et l'historique des traces.",
    'Trabalhos, itens de bairro e equipamentos pesados negociados em Pi em 238 países. Condições em uma linha; confiança com uma conta Pi KYC e histórico de pegadas.',
    'Работа, соседские товары и тяжёлая техника за Pi в 238 странах. Условия — одной строкой, доверие — по одному аккаунту Pi KYC и истории следов.',
    'Pekerjaan, barang tetangga, dan peralatan besar ditukar langsung dengan Pi di 238 negara. Syarat dalam satu baris; kepercayaan dari satu akun Pi KYC dan riwayat jejak.'
  ],
  tagKyc: [
    'Pi KYC 1계정', 'Pi KYC 1 account', 'Pi KYC 单账户', 'Pi KYC 1アカウント', '1 cuenta Pi KYC',
    '1 tài khoản Pi KYC', '1 compte Pi KYC', '1 conta Pi KYC', '1 аккаунт Pi KYC', '1 akun Pi KYC'
  ],
  tagNoFee: [
    '직거래 수수료 0%', '0% direct-deal fee', '直连手续费 0%', '直接取引手数料0%', '0% de comisión directa',
    'phí giao dịch trực tiếp 0%', '0 % de commission directe', '0% de taxa direta', '0% комиссии при прямой сделке', 'biaya transaksi langsung 0%'
  ],
  tagEscrow: [
    'Pi 에스크로 · 준비 중', 'Pi escrow · not live yet', 'Pi 托管 · 准备中', 'Piエスクロー・準備中', 'Escrow Pi · aún no activo',
    'Ký quỹ Pi · chưa mở', 'Séquestre Pi · pas encore actif', 'Escrow Pi · ainda não ativo', 'Эскроу Pi · пока не работает', 'Escrow Pi · belum aktif'
  ],
  statCountries: ['거래 국가', 'Countries', '交易国家', '取引国', 'Países', 'Quốc gia', 'Pays', 'Países', 'Стран', 'Negara'],
  statCountriesS: ['국가', 'Countries', '国家', '国', 'Países', 'Nước', 'Pays', 'Países', 'Страны', 'Negara'],
  statFee: ['0%', '0%', '0%', '0%', '0%', '0%', '0 %', '0%', '0%', '0%'],
  statFeeLabel: ['직거래 수수료', 'Direct fee', '直连手续费', '直接手数料', 'Comisión directa', 'Phí trực tiếp', 'Commission directe', 'Taxa direta', 'Прямая комиссия', 'Biaya langsung'],
  statFeeS: ['수수료', 'Fee', '手续费', '手数料', 'Comisión', 'Phí', 'Frais', 'Taxa', 'Комиссия', 'Biaya'],
  statKyc: ['KYC 1계정', 'KYC 1 account', 'KYC 单账户', 'KYC 1アカウント', 'KYC 1 cuenta', 'KYC 1 tài khoản', 'KYC 1 compte', 'KYC 1 conta', 'KYC 1 аккаунт', 'KYC 1 akun'],
  statKycS: ['KYC', 'KYC', 'KYC', 'KYC', 'KYC', 'KYC', 'KYC', 'KYC', 'KYC', 'KYC'],
  statBeom: ['발자국', 'Footprints', '足迹', '足あと', 'Huellas', 'Dấu chân', 'Traces', 'Pegadas', 'Следы', 'Jejak'],
  statBeomS: ['발자국', 'Prints', '足迹', '足あと', 'Huellas', 'Dấu chân', 'Traces', 'Pegadas', 'Следы', 'Jejak'],

  countryLabel: [
    '거래 국가', 'Trading country', '交易国家', '取引国', 'País de operación', 'Quốc gia giao dịch',
    'Pays de l’échange', 'País da negociação', 'Страна сделки', 'Negara transaksi'
  ],
  countrySelect: [
    '국가 선택', 'Select country', '选择国家', '国を選ぶ', 'Elegir país', 'Chọn quốc gia',
    'Choisir un pays', 'Escolher país', 'Выбрать страну', 'Pilih negara'
  ],
  countryPickTitle: [
    '국가를 선택하세요', 'Choose a country', '请选择国家', '国を選択してください', 'Elige un país',
    'Chọn một quốc gia', 'Choisissez un pays', 'Escolha um país', 'Выберите страну', 'Pilih negara'
  ],
  countryPickDesc: [
    '고른 국가의 인력·당근·B2B 원장으로 들어갑니다. 전체 보기는 글로벌입니다.',
    'You enter that country’s work, neighbourhood and B2B ledger. Global shows everything.',
    '进入所选国家的人力、邻里与 B2B 账簿。选择全球可查看全部。',
    '選んだ国の人力・ご近所・B2B台帳に入ります。全体表示はグローバルです。',
    'Entras al libro de trabajo, barrio y B2B de ese país. Global muestra todo.',
    'Bạn vào sổ việc làm, đồ xóm và B2B của quốc gia đó. Toàn cầu hiển thị tất cả.',
    'Vous entrez dans le registre travail, quartier et B2B de ce pays. Global affiche tout.',
    'Você entra no livro de trabalho, bairro e B2B daquele país. Global mostra tudo.',
    'Вы входите в реестр работы, соседских товаров и B2B этой страны. «Глобально» показывает всё.',
    'Anda masuk ke buku kerja, barang tetangga, dan B2B negara itu. Global menampilkan semua.'
  ],
  countrySearch: [
    '국가명 또는 ISO 코드 검색 (예: 인도, India, IN)',
    'Search country or ISO code (e.g. India, IN)',
    '搜索国家名或 ISO 代码（例：印度, India, IN）',
    '国名またはISOコードで検索（例：インド, India, IN）',
    'Busca país o código ISO (p. ej. India, IN)',
    'Tìm quốc gia hoặc mã ISO (vd: Ấn Độ, IN)',
    'Rechercher un pays ou un code ISO (ex. Inde, IN)',
    'Buscar país ou código ISO (ex.: Índia, IN)',
    'Поиск страны или кода ISO (напр. Индия, IN)',
    'Cari negara atau kode ISO (mis. India, IN)'
  ],
  countryGlobal: [
    '글로벌 (전체 보기)', 'Global (all listings)', '全球（查看全部）', 'グローバル（全件表示）',
    'Global (todo)', 'Toàn cầu (tất cả)', 'Global (tout)', 'Global (tudo)', 'Глобально (все)', 'Global (semua)'
  ],
  countryCount: [
    'ISO 3166-1 기준 238개국', '238 countries · ISO 3166-1', 'ISO 3166-1 共 238 个国家',
    'ISO 3166-1 基準 238か国', '238 países · ISO 3166-1', '238 quốc gia · ISO 3166-1',
    '238 pays · ISO 3166-1', '238 países · ISO 3166-1', '238 стран · ISO 3166-1', '238 negara · ISO 3166-1'
  ],
  countryCountShort: [
    '238개국', '238 countries', '238 国', '238か国', '238 países',
    '238 quốc gia', '238 pays', '238 países', '238 стран', '238 negara'
  ],
  noCountry: ['검색 결과가 없습니다.', 'No country found.', '没有找到国家。', '該当する国がありません。', 'No se encontró el país.', 'Không tìm thấy quốc gia.', 'Aucun pays trouvé.', 'Nenhum país encontrado.', 'Страна не найдена.', 'Negara tidak ditemukan.'],

  rail1: ['인력·소액 일감', 'Work & small jobs', '人力·小额活', '人手・小口案件', 'Trabajo y encargos', 'Việc làm nhỏ', 'Travail et petites missions', 'Trabalho e tarefas', 'Работа и мелкие задачи', 'Kerja & tugas kecil'],
  rail1S: ['인력', 'Work', '人力', '人手', 'Trabajo', 'Việc', 'Travail', 'Trabalho', 'Работа', 'Kerja'],
  rail1D: [
    '번역·데이터·수리·개발 등 0.5~50 Pi',
    'Translation, data, repair, dev — 0.5–50 Pi',
    '翻译、数据、维修、开发 0.5~50 Pi',
    '翻訳・データ・修理・開発 0.5〜50 Pi',
    'Traducción, datos, reparación, desarrollo — 0,5–50 Pi',
    'Dịch, dữ liệu, sửa chữa, phát triển — 0,5–50 Pi',
    'Traduction, données, réparation, dev — 0,5–50 Pi',
    'Tradução, dados, reparo, dev — 0,5–50 Pi',
    'Перевод, данные, ремонт, разработка — 0,5–50 Pi',
    'Terjemahan, data, servis, dev — 0,5–50 Pi'
  ],
  rail2: ['동네 당근·바터', 'Neighbourhood & barter', '邻里好物·置换', 'ご近所・物々交換', 'Barrio y trueque', 'Đồ xóm & trao đổi', 'Quartier et troc', 'Bairro e troca', 'Соседское и обмен', 'Tetangga & barter'],
  rail2S: ['당근', 'Local', '邻里', 'ご近所', 'Barrio', 'Xóm', 'Quartier', 'Bairro', 'Соседи', 'Lokal'],
  rail2D: [
    '생필품·중고폰·생활용품 물물교환·Pi 직거래',
    'Daily goods, used phones, household — barter or Pi',
    '日用品、二手手机、家居用品 物物交换或 Pi 直购',
    '日用品・中古スマホ・生活用品 物々交換・Pi直接取引',
    'Básicos, móviles usados, hogar — trueque o Pi',
    'Đồ dùng, điện thoại cũ, gia dụng — trao đổi hoặc Pi',
    'Quotidien, téléphones d’occasion, maison — troc ou Pi',
    'Itens do dia a dia, celulares usados, casa — troca ou Pi',
    'Товары, б/у телефоны, быт — обмен или Pi',
    'Kebutuhan harian, ponsel bekas, rumah — barter atau Pi'
  ],
  rail3: ['B2B·대형 실물', 'B2B & heavy goods', 'B2B·大型实物', 'B2B・大型実物', 'B2B y bienes pesados', 'B2B & hàng lớn', 'B2B et biens lourds', 'B2B e bens grandes', 'B2B и крупные товары', 'B2B & barang besar'],
  rail3S: ['B2B', 'B2B', 'B2B', 'B2B', 'B2B', 'B2B', 'B2B', 'B2B', 'B2B', 'B2B'],
  rail3D: [
    '설비·장비·통신·위성 등 견적·분할 지급',
    'Equipment, machinery, telecom, satellite — quote & staged payment',
    '设备、机械、通信、卫星 报价与分期',
    '設備・機械・通信・衛星 見積・分割払い',
    'Equipos, maquinaria, telecom, satélite — cotización y pago por etapas',
    'Thiết bị, máy móc, viễn thông, vệ tinh — báo giá & trả theo đợt',
    'Équipements, machines, télécom, satellite — devis et paiement échelonné',
    'Equipamentos, máquinas, telecom, satélite — cotação e pagamento por etapas',
    'Оборудование, техника, связь, спутники — расчёт и оплата частями',
    'Peralatan, mesin, telekomunikasi, satelit — penawaran & bayar bertahap'
  ],

  listHint: [
    '1줄 행을 누르면 조건과 신뢰 이력이 펼쳐집니다.',
    'Tap a one-line row to open its terms and trust history.',
    '点击单行条目即可展开条件与信任履历。',
    '1行の行を押すと条件と信頼履歴が開きます。',
    'Toca una fila para ver condiciones e historial de confianza.',
    'Chạm vào một dòng để xem điều kiện và lịch sử tín nhiệm.',
    'Touchez une ligne pour voir les conditions et l’historique.',
    'Toque em uma linha para ver condições e histórico de confiança.',
    'Нажмите на строку, чтобы раскрыть условия и историю.',
    'Ketuk baris untuk melihat syarat dan riwayat kepercayaan.'
  ],
  listCount: ['{n}건', '{n} listings', '{n} 条', '{n}件', '{n} avisos', '{n} tin', '{n} annonces', '{n} anúncios', '{n} объявл.', '{n} iklan'],
  listEmptyTitle: ['아직 등록된 거래가 없습니다.', 'No listings here yet.', '这里还没有交易。', 'まだ登録がありません。', 'Aún no hay avisos.', 'Chưa có tin nào.', 'Aucune annonce pour l’instant.', 'Ainda não há anúncios.', 'Пока нет объявлений.', 'Belum ada iklan.'],
  listEmptyBody: [
    '{c}의 첫 거래를 올려 주세요. 등록하면 이 목록에 바로 반영됩니다.',
    'Post the first listing in {c}. It appears here the moment you register it.',
    '发布 {c} 的第一条交易，注册后立即显示在此。',
    '{c} の最初の取引を投稿してください。登録するとこの一覧にすぐ反映されます。',
    'Publica el primer aviso en {c}. Aparece aquí al registrarlo.',
    'Đăng tin đầu tiên tại {c}. Tin hiện ngay sau khi đăng.',
    'Publiez la première annonce en {c}. Elle apparaît ici dès l’enregistrement.',
    'Publique o primeiro anúncio em {c}. Ele aparece aqui assim que registrado.',
    'Разместите первое объявление в {c} — оно сразу появится здесь.',
    'Pasang iklan pertama di {c}. Langsung tampil setelah didaftarkan.'
  ],

  priceBarter: ['물물교환', 'Barter', '物物交换', '物々交換', 'Trueque', 'Trao đổi', 'Troc', 'Troca', 'Обмен', 'Barter'],
  priceQuote: ['견적', 'Quote', '报价', '見積', 'Cotización', 'Báo giá', 'Devis', 'Cotação', 'Расчёт', 'Penawaran'],

  kycLine: [
    'Pi KYC 1계정 인증 완료', 'Pi KYC 1 account verified', 'Pi KYC 单账户已认证', 'Pi KYC 1アカウント認証済み',
    '1 cuenta Pi KYC verificada', 'Đã xác thực 1 tài khoản Pi KYC', '1 compte Pi KYC vérifié', '1 conta Pi KYC verificada',
    '1 аккаунт Pi KYC подтверждён', '1 akun Pi KYC terverifikasi'
  ],
  devLine: [
    '발자국 완료율 {n}%', 'Footprint completion {n}%', '足迹完成率 {n}%', '足あと完了率 {n}%',
    'Huellas completadas {n}%', 'Dấu chân hoàn thành {n}%', 'Traces complétées {n} %', 'Pegadas concluídas {n}%',
    'Следы выполнены на {n}%', 'Jejak selesai {n}%'
  ],
  escrowLine: [
    'Pi 에스크로(수령 후 정산)는 준비 중 · 지금은 30/70 분할 지급',
    'Pi escrow (paid on receipt) is not live yet — for now it is a 30/70 split',
    'Pi 托管（收货后结算）准备中 · 现在为 30/70 分期',
    'Piエスクロー（受取後精算）は準備中・現在は30/70分割払い',
    'El escrow Pi (pago al recibir) aún no está activo: por ahora es un pago 30/70',
    'Ký quỹ Pi (trả sau khi nhận) chưa mở — hiện chia 30/70',
    'Le séquestre Pi (paiement à réception) n’est pas encore actif : pour l’instant 30/70',
    'O escrow Pi (pago no recebimento) ainda não está ativo: por ora é 30/70',
    'Эскроу Pi (оплата после получения) пока не работает — сейчас оплата 30/70',
    'Escrow Pi (bayar saat terima) belum aktif — sekarang dibagi 30/70'
  ],
  directLine: [
    'Pi 직거래 · 수수료 0%', 'Direct Pi deal · 0% fee', 'Pi 直连交易 · 0% 手续费', 'Pi直接取引 · 手数料0%',
    'Trato directo en Pi · 0% comisión', 'Giao dịch Pi trực tiếp · phí 0%', 'Échange direct en Pi · 0 % de frais',
    'Negócio direto em Pi · 0% de taxa', 'Прямая сделка в Pi · 0% комиссии', 'Transaksi langsung Pi · biaya 0%'
  ],
  reqBtn: [
    '거래·일감 신청', 'Request this deal', '申请交易', '取引を申し込む', 'Solicitar el trato', 'Gửi yêu cầu giao dịch',
    'Demander cet échange', 'Solicitar esta negociação', 'Запросить сделку', 'Ajukan permintaan'
  ],
  reqDone: [
    '신청 접수됨 · 조율 중', 'Request received · coordinating', '申请已受理 · 协调中', '申込受付 · 調整中',
    'Solicitud recibida · en curso', 'Đã nhận yêu cầu · đang kết nối', 'Demande reçue · en cours',
    'Solicitação recebida · em andamento', 'Заявка принята · согласование', 'Permintaan diterima · dikoordinasikan'
  ],
  reqAuth: [
    '거래 신청', 'Request a deal', '申请交易', '取引の申込', 'Solicitar trato', 'Yêu cầu giao dịch', 'Demander un échange',
    'Solicitar negociação', 'Запрос сделки', 'Ajukan transaksi'
  ],

  postToggle: ['거래·일감 직접 올리기', 'Post your own listing', '自己发布交易', '自分で取引を投稿', 'Publicar tu aviso', 'Đăng tin của bạn', 'Publier votre annonce', 'Publicar seu anúncio', 'Разместить объявление', 'Pasang iklan sendiri'],
  postRail: ['분류', 'Category', '分类', '分類', 'Categoría', 'Phân loại', 'Catégorie', 'Categoria', 'Категория', 'Kategori'],
  postCountry: ['국가', 'Country', '国家', '国', 'País', 'Quốc gia', 'Pays', 'País', 'Страна', 'Negara'],
  postCity: ['도시', 'City', '城市', '都市', 'Ciudad', 'Thành phố', 'Ville', 'Cidade', 'Город', 'Kota'],
  postCityPh: ['도시·지역 (예: Lagos, Nairobi)', 'City or area (e.g. Lagos, Nairobi)', '城市·地区（例：Lagos）', '都市・地域（例：Lagos）', 'Ciudad o zona (p. ej. Lagos)', 'Thành phố hoặc khu vực (vd: Lagos)', 'Ville ou zone (ex. Lagos)', 'Cidade ou região (ex.: Lagos)', 'Город или район (напр. Лагос)', 'Kota atau wilayah (mis. Lagos)'],
  postTitle: ['품목·일감', 'Item or job', '物品·活', '品目・案件', 'Artículo o encargo', 'Món đồ hoặc việc', 'Objet ou mission', 'Item ou tarefa', 'Товар или работа', 'Barang atau pekerjaan'],
  postTitlePh: ['무엇을 거래하거나 맡기시나요?', 'What are you trading or hiring for?', '要交易或委托什么？', '何を取引・依頼しますか？', '¿Qué vendes o encargas?', 'Bạn giao dịch hay thuê gì?', 'Que vendez-vous ou faites-vous faire ?', 'O que você negocia ou contrata?', 'Что вы продаёте или кому ищете работу?', 'Apa yang Anda jual atau butuhkan?'],
  postPrice: ['조건 (Pi)', 'Terms (Pi)', '条件（Pi）', '条件（Pi）', 'Condiciones (Pi)', 'Điều kiện (Pi)', 'Conditions (Pi)', 'Condições (Pi)', 'Условия (Pi)', 'Syarat (Pi)'],
  postMode: ['거래 방식', 'Deal type', '交易方式', '取引方法', 'Tipo de trato', 'Hình thức', 'Type d’échange', 'Tipo de negócio', 'Тип сделки', 'Jenis transaksi'],
  modePi: ['Pi 직거래', 'Direct in Pi', 'Pi 直连', 'Pi直接取引', 'Directo en Pi', 'Trực tiếp bằng Pi', 'Direct en Pi', 'Direto em Pi', 'Прямая в Pi', 'Langsung dengan Pi'],
  modeBarter: ['물물교환', 'Barter', '物物交换', '物々交換', 'Trueque', 'Trao đổi', 'Troc', 'Troca', 'Обмен', 'Barter'],
  modeQuote: ['견적 협의', 'Quote on request', '报价协商', '見積協議', 'Cotización', 'Báo giá', 'Devis', 'Cotação', 'Расчёт по запросу', 'Penawaran'],
  postDetail: ['설명', 'Details', '说明', '説明', 'Detalles', 'Mô tả', 'Détails', 'Detalhes', 'Описание', 'Detail'],
  postDetailPh: [
    '수량·상태·일정 등 상대가 알아야 할 조건',
    'Quantity, condition, timing — what the other side needs to know',
    '数量、状态、时间等对方需要知道的条件',
    '数量・状態・日程など相手が知るべき条件',
    'Cantidad, estado y plazos que la otra parte debe saber',
    'Số lượng, tình trạng, thời gian — điều đối phương cần biết',
    'Quantité, état, délais — ce que l’autre doit savoir',
    'Quantidade, estado e prazo que a outra parte precisa saber',
    'Количество, состояние, сроки — что нужно знать второй стороне',
    'Jumlah, kondisi, jadwal — yang perlu diketahui pihak lain'
  ],
  postSubmit: ['등록', 'Publish', '发布', '登録', 'Publicar', 'Đăng', 'Publier', 'Publicar', 'Опубликовать', 'Pasang'],
  postCancel: ['닫기', 'Close', '关闭', '閉じる', 'Cerrar', 'Đóng', 'Fermer', 'Fechar', 'Закрыть', 'Tutup'],
  postSaved: [
    '등록 완료 · 이 기기에 저장되었습니다.', 'Published · saved on this device.', '发布完成 · 已保存在本设备。', '登録完了 · この端末に保存しました。',
    'Publicado · guardado en este dispositivo.', 'Đã đăng · lưu trên thiết bị này.', 'Publié · enregistré sur cet appareil.',
    'Publicado · salvo neste dispositivo.', 'Опубликовано · сохранено на этом устройстве.', 'Terpasang · tersimpan di perangkat ini.'
  ],
  postErrTitle: ['품목·일감을 입력해 주세요.', 'Please enter the item or job.', '请填写物品或活。', '品目・案件を入力してください。', 'Escribe el artículo o encargo.', 'Vui lòng nhập món đồ hoặc việc.', 'Indiquez l’objet ou la mission.', 'Informe o item ou a tarefa.', 'Укажите товар или работу.', 'Isi barang atau pekerjaan.'],
  postErrCity: ['도시·지역을 입력해 주세요.', 'Please enter the city or area.', '请填写城市或地区。', '都市・地域を入力してください。', 'Escribe la ciudad o zona.', 'Vui lòng nhập thành phố hoặc khu vực.', 'Indiquez la ville ou la zone.', 'Informe a cidade ou região.', 'Укажите город или район.', 'Isi kota atau wilayah.'],
  postNote: [
    '0단계 · 올린 글은 이 기기에만 저장됩니다. 다른 기기와의 거래 연결(서버 원장)은 다음 단계입니다.',
    'Stage 0 · posts are stored on this device only. Trading with another device (server ledger) comes next.',
    '第 0 阶段 · 发布内容仅存于本设备，与其他设备的交易（服务器账簿）是下一步。',
    '第0段階 · 投稿はこの端末にのみ保存されます。他端末との取引（サーバー台帳）は次の段階です。',
    'Etapa 0 · los avisos se guardan solo en este dispositivo. Negociar con otro dispositivo (libro en servidor) es el paso siguiente.',
    'Giai đoạn 0 · tin chỉ lưu trên thiết bị này. Giao dịch với thiết bị khác (sổ cái máy chủ) là bước tiếp theo.',
    'Étape 0 · les annonces restent sur cet appareil. Échanger avec un autre appareil (registre serveur) viendra ensuite.',
    'Etapa 0 · os anúncios ficam só neste dispositivo. Negociar com outro dispositivo (livro no servidor) vem depois.',
    'Этап 0 · объявления хранятся только на этом устройстве. Сделки с другим устройством (серверный реестр) — следующий шаг.',
    'Tahap 0 · iklan hanya tersimpan di perangkat ini. Bertransaksi dengan perangkat lain (buku server) menyusul.'
  ],
  mineBadge: ['내 등록', 'Mine', '我发布', '自分の投稿', 'Mío', 'Của tôi', 'À moi', 'Meu', 'Моё', 'Milik saya'],
  mineDelete: ['삭제', 'Delete', '删除', '削除', 'Borrar', 'Xóa', 'Supprimer', 'Excluir', 'Удалить', 'Hapus'],

  safetyToggle: ['안전 거래 4원칙', 'Four rules of safe trade', '安全交易四原则', '安全取引の4原則', 'Cuatro reglas del trato seguro', 'Bốn nguyên tắc giao dịch an toàn', 'Quatre règles d’un échange sûr', 'Quatro regras do negócio seguro', 'Четыре правила безопасной сделки', 'Empat aturan transaksi aman'],
  safety1: [
    '등록·신청은 Pi KYC 1계정으로만 합니다. 1인 1계정, 실명 확인.',
    'Listing and requesting use one Pi KYC account. One person, one account, real name checked.',
    '发布与申请只用 Pi KYC 单账户，一人一账户，实名核验。',
    '登録・申込はPi KYC 1アカウントのみ。1人1アカウント、実名確認。',
    'Publicar y solicitar con una sola cuenta Pi KYC. Una persona, una cuenta, nombre verificado.',
    'Đăng và yêu cầu chỉ bằng một tài khoản Pi KYC. Một người một tài khoản, xác thực tên thật.',
    'Annonce et demande avec un seul compte Pi KYC. Une personne, un compte, nom vérifié.',
    'Anúncio e solicitação com uma única conta Pi KYC. Uma pessoa, uma conta, nome verificado.',
    'Объявление и заявка — только с одного аккаунта Pi KYC. Один человек, один аккаунт, имя проверено.',
    'Pasang dan ajukan hanya dengan satu akun Pi KYC. Satu orang satu akun, nama terverifikasi.'
  ],
  safety2: [
    '조건(Pi·수량·일정)은 1줄 행 안에서 먼저 합의하고, 합의 전에는 송금하지 않습니다.',
    'Agree price, quantity and timing inside the row first; never send Pi before agreement.',
    '先在条目内谈定 Pi、数量与时间，达成一致前不汇款。',
    '条件（Pi・数量・日程）は行の中で先に合意し、合意前に送金しません。',
    'Acuerda precio, cantidad y plazos dentro de la fila; no envíes Pi antes de acordar.',
    'Thống nhất giá, số lượng, thời gian trong dòng trước; chưa thỏa thuận thì chưa chuyển Pi.',
    'Convenez du prix, de la quantité et du délai dans la ligne ; n’envoyez pas de Pi avant accord.',
    'Combine preço, quantidade e prazo na própria linha; não envie Pi antes do acordo.',
    'Сначала согласуйте цену, количество и сроки в строке; до согласия Pi не переводите.',
    'Sepakati harga, jumlah, dan waktu di baris itu dulu; jangan kirim Pi sebelum sepakat.'
  ],
  safety3: [
    '선입금·계좌 이체·외부 메신저 링크를 요구하는 상대와는 거래하지 않습니다. 결제는 Pi로만 합니다.',
    'Never trade with someone who asks for a deposit, a bank transfer or an outside messenger link. Pay in Pi only.',
    '对方要求预付、银行转账或外部聊天链接时不交易，付款只用 Pi。',
    '前払い・銀行振込・外部メッセンジャーのリンクを求める相手とは取引しません。支払いはPiのみ。',
    'No trates con quien pida un anticipo, una transferencia o un enlace a otro mensajero. Paga solo en Pi.',
    'Không giao dịch với người đòi tiền trước, chuyển khoản hay link ứng dụng khác. Chỉ trả bằng Pi.',
    'Ne traitez pas avec qui demande un acompte, un virement ou un lien vers une messagerie externe. Payez en Pi uniquement.',
    'Não negocie com quem pede sinal, transferência ou link de outro mensageiro. Pague só em Pi.',
    'Не работайте с теми, кто просит предоплату, перевод или ссылку на другой мессенджер. Оплата только в Pi.',
    'Jangan bertransaksi dengan yang meminta uang muka, transfer bank, atau tautan aplikasi lain. Bayar hanya dengan Pi.'
  ],
  safety4: [
    '만남은 공공장소에서. 대형 실물·B2B는 30/70 분할로 하고 잔금은 인도·검수 후에. 보관형 에스크로는 아직 준비 중입니다.',
    'Meet in a public place. Heavy goods and B2B use a 30/70 split, balance after delivery and inspection. Held-in-escrow payment is not live yet.',
    '当面交易选公共场所。大型实物与 B2B 用 30/70 分期，尾款在交付验收后。托管支付尚未上线。',
    '待ち合わせは公共の場所で。大型実物・B2Bは30/70分割、残金は受け渡し・検収後。エスクロー保管はまだ準備中です。',
    'Quedad en un lugar público. Bienes pesados y B2B: pago 30/70, el resto tras la entrega y la inspección. El escrow aún no está activo.',
    'Gặp ở nơi công cộng. Hàng lớn và B2B chia 30/70, phần còn lại sau khi giao và kiểm. Ký quỹ chưa hoạt động.',
    'Rendez-vous dans un lieu public. Biens lourds et B2B : 30/70, le solde après livraison et contrôle. Le séquestre n’est pas encore actif.',
    'Encontro em local público. Bens grandes e B2B: 30/70, o restante após entrega e inspeção. O escrow ainda não está ativo.',
    'Встречайтесь в публичном месте. Крупные товары и B2B — 30/70, остаток после поставки и проверки. Эскроу пока не работает.',
    'Bertemu di tempat umum. Barang besar dan B2B pakai 30/70, sisanya setelah serah dan pemeriksaan. Escrow belum aktif.'
  ],
  /* ── 0단계 신규: 생활권 · 서브칩 · 상태 · 이행/정산 · 필터 · 내 거래함 ── */
  areaLabel: ['생활권', 'My area', '我的生活圈', '生活圏', 'Mi zona', 'Khu vực của tôi', 'Ma zone', 'Minha área', 'Мой район', 'Area saya'],
  areaSet: ['생활권 설정', 'Set my area', '设置生活圈', '生活圏を設定', 'Configurar zona', 'Đặt khu vực', 'Régler ma zone', 'Definir área', 'Настроить район', 'Atur area'],
  radius: ['반경', 'Radius', '范围', '範囲', 'Radio', 'Bán kính', 'Rayon', 'Raio', 'Радиус', 'Radius'],
  radiusHood: ['동네', 'Neighbourhood', '街区', 'ご近所', 'Barrio', 'Xóm', 'Quartier', 'Bairro', 'Район', 'Lingkungan'],
  radiusCity: ['도시', 'City', '城市', '都市', 'Ciudad', 'Thành phố', 'Ville', 'Cidade', 'Город', 'Kota'],
  radiusCountry: ['국가', 'Country', '国家', '国', 'País', 'Quốc gia', 'Pays', 'País', 'Страна', 'Negara'],
  radiusGlobal: ['전체', 'All', '全部', 'すべて', 'Todo', 'Tất cả', 'Tout', 'Tudo', 'Всё', 'Semua'],
  areaNoGps: [
    '위치를 추적하지 않습니다 — 생활권은 직접 고릅니다.',
    'We never track your location — you pick your area.',
    '不追踪位置 — 生活圈由你自己选择。',
    '位置は追跡しません — 生活圏は自分で選びます。',
    'No seguimos tu ubicación: tú eliges tu zona.',
    'Chúng tôi không theo dõi vị trí — bạn tự chọn khu vực.',
    'Nous ne suivons pas votre position — vous choisissez votre zone.',
    'Não rastreamos sua localização — você escolhe a área.',
    'Мы не отслеживаем геопозицию — район выбираете вы.',
    'Kami tidak melacak lokasi — Anda memilih area.'
  ],
  areaWideHint: [
    '이 반경에는 거래가 적습니다 — 한 단계 넓혀 보세요.',
    'Few listings at this radius — widen one step.',
    '此范围交易较少 — 请扩大一级。',
    'この範囲は取引が少なめです — 一段広げてみてください。',
    'Pocos avisos en este radio: amplía un nivel.',
    'Ít tin trong bán kính này — mở rộng một bậc.',
    'Peu d’annonces dans ce rayon — élargissez d’un cran.',
    'Poucos anúncios neste raio — amplie um nível.',
    'Мало объявлений в этом радиусе — расширьте на шаг.',
    'Sedikit iklan di radius ini — perluas satu tingkat.'
  ],
  neighborBadge: ['이웃', 'Neighbour', '邻居', 'ご近所', 'Vecino', 'Hàng xóm', 'Voisin', 'Vizinho', 'Сосед', 'Tetangga'],

  sideWork: ['일감 올리기', 'Post a job', '发布工作', '仕事を出す', 'Publicar trabajo', 'Đăng việc', 'Publier une mission', 'Publicar tarefa', 'Разместить работу', 'Pasang pekerjaan'],
  sideSkill: ['내 기술·시간', 'My skills & time', '我的技能与时间', '自分の技術・時間', 'Mis habilidades y tiempo', 'Kỹ năng & thời gian', 'Mes compétences et mon temps', 'Minhas habilidades e tempo', 'Мои навыки и время', 'Keahlian & waktu saya'],
  sideSell: ['직거래', 'Sell', '直卖', '直接取引', 'Vender', 'Bán', 'Vendre', 'Vender', 'Продать', 'Jual'],
  sideWant: ['구해요', 'Wanted', '求购', '求む', 'Busco', 'Cần mua', 'Recherche', 'Procuro', 'Куплю', 'Cari'],
  sideFree: ['무료 나눔', 'Free', '免费赠送', '無料で譲る', 'Gratis', 'Tặng miễn phí', 'Don', 'Doação', 'Отдам даром', 'Gratis'],
  sideRfq: ['견적 요청', 'Request quote', '询价', '見積依頼', 'Pedir cotización', 'Yêu cầu báo giá', 'Demander un devis', 'Pedir cotação', 'Запросить расчёт', 'Minta penawaran'],

  statusOpen: ['모집중', 'Open', '招募中', '募集中', 'Abierto', 'Đang mở', 'Ouvert', 'Aberto', 'Набор', 'Terbuka'],
  statusReserved: ['예약중', 'Reserved', '预订中', '予約中', 'Reservado', 'Đã đặt', 'Réservé', 'Reservado', 'Забронировано', 'Dipesan'],
  statusDone: ['완료', 'Done', '已完成', '完了', 'Hecho', 'Xong', 'Terminé', 'Concluído', 'Завершено', 'Selesai'],

  handoffLabel: ['이행 방식', 'Handoff', '交付方式', '受け渡し方法', 'Entrega', 'Cách giao', 'Remise', 'Entrega', 'Способ передачи', 'Cara serah'],
  handoffMeet: ['만나서 직거래', 'Meet in person', '当面交易', '対面で受け渡し', 'En mano', 'Gặp trực tiếp', 'Remise en main propre', 'Em mãos', 'Личная передача', 'Ketemu langsung'],
  handoffDelivery: ['택배', 'Courier', '快递', '宅配', 'Mensajería', 'Chuyển phát', 'Livraison', 'Entrega', 'Доставка', 'Kurir'],
  handoffFreight: ['컨테이너·설치', 'Container & install', '集装箱·安装', 'コンテナ・設置', 'Contenedor e instalación', 'Container & lắp đặt', 'Conteneur et pose', 'Contêiner e instalação', 'Контейнер и монтаж', 'Kontainer & pemasangan'],
  handoffRemote: ['원격', 'Remote', '远程', 'リモート', 'Remoto', 'Từ xa', 'À distance', 'Remoto', 'Удалённо', 'Jarak jauh'],

  settleDirect: ['Pi 즉시', 'Pi at once', 'Pi 即时', 'Pi 即時', 'Pi al instante', 'Pi ngay', 'Pi immédiat', 'Pi na hora', 'Pi сразу', 'Pi langsung'],
  settleMilestone: ['분할 지급 30/70', 'Split payment 30/70', '分期付款 30/70', '分割払い 30/70', 'Pago 30/70', 'Chia đợt 30/70', 'Paiement 30/70', 'Pagamento 30/70', 'Оплата 30/70', 'Bayar bertahap 30/70'],
  settleEscrowSoon: [
    'Pi 결제(수령 후 정산) · 준비 중',
    'Pi held until receipt · not live yet',
    'Pi 付款（收货后结算）· 准备中',
    'Pi決済（受取後精算）・準備中',
    'Pago Pi (al recibir) · aún no activo',
    'Thanh toán Pi (sau khi nhận) · chưa mở',
    'Paiement Pi (après réception) · pas encore actif',
    'Pagamento Pi (após receber) · ainda não ativo',
    'Оплата Pi (после получения) · пока не работает',
    'Bayar Pi (setelah terima) · belum aktif'
  ],

  verifiedDeal: ['실거래 인증', 'Verified trade', '实交易认证', '実取引認証', 'Trato verificado', 'Giao dịch xác thực', 'Échange vérifié', 'Negócio verificado', 'Подтверждённая сделка', 'Transaksi terverifikasi'],
  demoBadge: ['예시', 'Sample', '示例', '見本', 'Ejemplo', 'Mẫu', 'Exemple', 'Exemplo', 'Пример', 'Contoh'],
  reviewLocked: [
    '실거래 인증 리뷰는 거래가 정산된 뒤에만 열립니다.',
    'Verified reviews open only after a deal settles.',
    '实交易认证评价仅在结算完成后开放。',
    '実取引認証レビューは精算後にのみ開きます。',
    'Las reseñas verificadas se abren al liquidarse el trato.',
    'Đánh giá xác thực chỉ mở sau khi tất toán.',
    'Les avis vérifiés s’ouvrent après règlement.',
    'Avaliações verificadas abrem após a liquidação.',
    'Отзывы открываются только после расчёта.',
    'Ulasan terverifikasi terbuka setelah transaksi tuntas.'
  ],
  footprintRule: [
    '발자국 1개 = 정산까지 끝난 거래 1건. 완료율은 분모(전체 거래)와 함께 보여 줍니다.',
    'One footprint = one settled deal. Completion is always shown with its denominator.',
    '一个足迹＝一笔结算完成的交易，完成率同时给出分母。',
    '足あと1つ＝精算まで終わった取引1件。完了率は分母も併記します。',
    'Una huella = un trato liquidado. La tasa siempre muestra su denominador.',
    'Một dấu chân = một giao dịch đã tất toán. Tỷ lệ luôn kèm mẫu số.',
    'Une trace = un échange réglé. Le taux affiche toujours son dénominateur.',
    'Uma pegada = um negócio liquidado. A taxa sempre mostra o denominador.',
    'Один след = одна завершённая сделка. Доля показывается со знаменателем.',
    'Satu jejak = satu transaksi tuntas. Rasio selalu dengan penyebut.'
  ],
  disputeSeal: [
    '분쟁은 플랫폼이 판정하지 않고, 증거 해시만 FactFilter에 봉인합니다.',
    'We never judge a dispute — evidence hashes are sealed to FactFilter.',
    '平台不裁决争议，只把证据哈希封存到 FactFilter。',
    '紛争は判定せず、証拠ハッシュだけをFactFilterに封印します。',
    'No juzgamos: sellamos los hashes de las pruebas en FactFilter.',
    'Không phán xử — chỉ niêm phong mã băm bằng chứng vào FactFilter.',
    'Nous ne jugeons pas : les empreintes des preuves sont scellées dans FactFilter.',
    'Não julgamos: selamos os hashes das provas no FactFilter.',
    'Мы не судим: хеши доказательств запечатываются в FactFilter.',
    'Kami tidak mengadili — hash bukti disegel ke FactFilter.'
  ],

  filterLabel: ['조건 · 정렬', 'Terms · sort', '条件·排序', '条件・並び順', 'Condiciones y orden', 'Điều kiện & sắp xếp', 'Conditions et tri', 'Condições e ordem', 'Условия и сортировка', 'Syarat & urutan'],
  stateLabel: ['상태', 'Status', '状态', '状態', 'Estado', 'Trạng thái', 'État', 'Status', 'Статус', 'Status'],
  sortNew: ['최신', 'Newest', '最新', '新着', 'Recientes', 'Mới nhất', 'Récents', 'Recentes', 'Новые', 'Terbaru'],
  sortNear: ['가까운', 'Nearest', '最近', '近い順', 'Más cerca', 'Gần nhất', 'Plus proche', 'Mais perto', 'Ближайшие', 'Terdekat'],
  sortCheap: ['낮은 가격', 'Lowest price', '价格低', '安い順', 'Menor precio', 'Giá thấp', 'Prix croissant', 'Menor preço', 'Дешевле', 'Termurah'],
  sortTrust: ['신뢰', 'Trust', '信任', '信頼', 'Confianza', 'Uy tín', 'Confiance', 'Confiança', 'Доверие', 'Kepercayaan'],

  myDeals: ['내 거래함', 'My deals', '我的交易', 'マイ取引', 'Mis tratos', 'Giao dịch của tôi', 'Mes échanges', 'Meus negócios', 'Мои сделки', 'Transaksi saya'],
  myPosts: ['내 글', 'My posts', '我的发布', '自分の投稿', 'Mis avisos', 'Tin của tôi', 'Mes annonces', 'Meus anúncios', 'Мои объявления', 'Iklan saya'],
  myReserved: ['예약', 'Reserved', '预订', '予約', 'Reservas', 'Đặt trước', 'Réservations', 'Reservas', 'Брони', 'Dipesan'],
  myDone: ['완료', 'Done', '已完成', '完了', 'Hechos', 'Đã xong', 'Terminés', 'Concluídos', 'Завершено', 'Selesai'],
  mySaved: ['찜', 'Saved', '收藏', 'お気に入り', 'Guardados', 'Đã lưu', 'Enregistrés', 'Salvos', 'Избранное', 'Disimpan'],
  bump: ['끌올', 'Bump', '顶帖', '上げ直す', 'Subir', 'Đẩy tin', 'Remonter', 'Subir', 'Поднять', 'Naikkan'],

  modeOffer: ['가격 제안', 'Make an offer', '出价', '価格提案', 'Proponer precio', 'Đề xuất giá', 'Proposer un prix', 'Propor preço', 'Предложить цену', 'Ajukan harga'],
  postTermsDelivery: [
    '배송비·출고 소요일·반품 기간 (예: 3 Pi · 2일 · 7일)',
    'Shipping cost · dispatch days · return window (e.g. 3 Pi · 2 days · 7 days)',
    '运费·出货天数·退货期（例：3 Pi·2 天·7 天）',
    '送料・出荷日数・返品期限（例：3 Pi・2日・7日）',
    'Envío · días de salida · plazo de devolución (ej. 3 Pi · 2 días · 7 días)',
    'Phí ship · ngày xuất · hạn trả (vd 3 Pi · 2 ngày · 7 ngày)',
    'Frais d’envoi · jours d’expédition · retour (ex. 3 Pi · 2 j · 7 j)',
    'Frete · dias de envio · prazo de devolução (ex. 3 Pi · 2 dias · 7 dias)',
    'Доставка · дни отправки · возврат (напр. 3 Pi · 2 дня · 7 дней)',
    'Ongkir · hari kirim · batas retur (mis. 3 Pi · 2 hari · 7 hari)'
  ],
  postTermsFreight: [
    'MOQ·선적항·검수 조건 (예: 5대 · FOB Chennai · 90일 보증)',
    'MOQ · port · inspection (e.g. 5 units · FOB Chennai · 90-day warranty)',
    'MOQ·装运港·验收（例：5 台·FOB Chennai·90 天保修）',
    'MOQ・積出港・検収（例：5台・FOB Chennai・90日保証）',
    'MOQ · puerto · inspección (ej. 5 uds · FOB Chennai · garantía 90 días)',
    'MOQ · cảng · kiểm định (vd 5 chiếc · FOB Chennai · bảo hành 90 ngày)',
    'MOQ · port · contrôle (ex. 5 unités · FOB Chennai · garantie 90 j)',
    'MOQ · porto · inspeção (ex. 5 un · FOB Chennai · garantia 90 dias)',
    'MOQ · порт · приёмка (напр. 5 шт · FOB Chennai · гарантия 90 дней)',
    'MOQ · pelabuhan · inspeksi (mis. 5 unit · FOB Chennai · garansi 90 hari)'
  ],
  postTermsRemote: [
    '납품물·마일스톤 (예: 1차 3일 · 검수 후 잔금)',
    'Deliverables · milestones (e.g. first draft in 3 days · balance after review)',
    '交付物·里程碑（例：首稿 3 天·验收后尾款）',
    '納品物・マイルストーン（例：初稿3日・検収後残金）',
    'Entregables · hitos (ej. primer borrador en 3 días · resto tras revisión)',
    'Sản phẩm · mốc (vd bản đầu 3 ngày · còn lại sau kiểm)',
    'Livrables · jalons (ex. première version 3 j · solde après contrôle)',
    'Entregas · marcos (ex. primeira versão 3 dias · restante após revisão)',
    'Результаты · этапы (напр. черновик 3 дня · остаток после проверки)',
    'Hasil · tahapan (mis. draf awal 3 hari · sisanya setelah telaah)'
  ],
  postErrTerms: [
    '이행 방식을 고르면 그 조건을 적어 주세요.',
    'Add the terms that match the handoff you chose.',
    '请填写所选交付方式的条件。',
    '選んだ受け渡し方法の条件を記入してください。',
    'Escribe las condiciones de la entrega elegida.',
    'Hãy ghi điều kiện của cách giao đã chọn.',
    'Indiquez les conditions de la remise choisie.',
    'Informe as condições da entrega escolhida.',
    'Укажите условия выбранного способа передачи.',
    'Isi syarat untuk cara serah yang dipilih.'
  ],

  footerTag: ['실물 경제 거래소', 'Real-economy exchange', '实体经济交易所', '実物経済取引所', 'Bolsa de economía real', 'Sàn kinh tế thực', 'Bourse de l’économie réelle', 'Bolsa da economia real', 'Биржа реальной экономики', 'Bursa ekonomi nyata'],
  alertSoon: [
    ' 서비스 준비 중입니다.', ' is coming soon.', ' 服务准备中。', ' は準備中です。', ' estará disponible pronto.', ' sắp ra mắt.', ' arrive bientôt.', ' chega em breve.', ' скоро появится.', ' segera hadir.'
  ]
} as const satisfies Record<string, L10>;

export type UIKey = keyof typeof UI;

/** Read one UI label in the chosen language. */
export function ui(k: UIKey, lang: Lang): string {
  return tr(UI[k], lang);
}
