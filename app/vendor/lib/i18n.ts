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
    '에스크로 정산', 'Escrow settlement', '托管结算', 'エスクロー精算', 'Pago en escrow',
    'Thanh toán ký quỹ', 'Règlement sous séquestre', 'Liquidação em escrow', 'Расчёт через эскроу', 'Penyelesaian escrow'
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
    '설비·장비·통신·위성 등 견적·에스크로',
    'Equipment, machinery, telecom, satellite — quote & escrow',
    '设备、机械、通信、卫星 报价与托管',
    '設備・機械・通信・衛星 見積・エスクロー',
    'Equipos, maquinaria, telecom, satélite — cotización y escrow',
    'Thiết bị, máy móc, viễn thông, vệ tinh — báo giá & ký quỹ',
    'Équipements, machines, télécom, satellite — devis et séquestre',
    'Equipamentos, máquinas, telecom, satélite — cotação e escrow',
    'Оборудование, техника, связь, спутники — расчёт и эскроу',
    'Peralatan, mesin, telekomunikasi, satelit — penawaran & escrow'
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
    '에스크로 정산 가능 · 인도 확인 후 지급', 'Escrow available — released after delivery is confirmed',
    '可托管结算 · 确认交付后付款', 'エスクロー可 · 受け渡し確認後に支払',
    'Escrow disponible: se paga al confirmar la entrega', 'Có ký quỹ: thanh toán sau khi xác nhận giao hàng',
    'Séquestre possible : paiement après livraison confirmée', 'Escrow disponível: pagamento após confirmar a entrega',
    'Доступен эскроу — оплата после подтверждения поставки', 'Escrow tersedia — dibayar setelah pengiriman dikonfirmasi'
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
    '등록한 거래는 이 기기(localStorage)에 저장됩니다.',
    'Listings you post are stored on this device (localStorage).',
    '发布的交易保存在本设备（localStorage）。',
    '投稿した取引はこの端末に保存されます（localStorage）。',
    'Los avisos que publicas se guardan en este dispositivo (localStorage).',
    'Tin bạn đăng được lưu trên thiết bị này (localStorage).',
    'Vos annonces sont enregistrées sur cet appareil (localStorage).',
    'Os anúncios que você publica ficam neste dispositivo (localStorage).',
    'Ваши объявления хранятся на этом устройстве (localStorage).',
    'Iklan Anda disimpan di perangkat ini (localStorage).'
  ],
  mineBadge: ['내 등록', 'Mine', '我发布', '自分の投稿', 'Mío', 'Của tôi', 'À moi', 'Meu', 'Моё', 'Milik saya'],
  mineDelete: ['삭제', 'Delete', '删除', '削除', 'Borrar', 'Xóa', 'Supprimer', 'Excluir', 'Удалить', 'Hapus'],

  safetyToggle: ['안전 거래 3원칙', 'Three rules of safe trade', '安全交易三原则', '安全取引の3原則', 'Tres reglas del trato seguro', 'Ba nguyên tắc giao dịch an toàn', 'Trois règles d’un échange sûr', 'Três regras do negócio seguro', 'Три правила безопасной сделки', 'Tiga aturan transaksi aman'],
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
    '대형 실물·B2B는 에스크로로 묶고, 인도 확인 후에 정산합니다.',
    'Heavy goods and B2B go through escrow and settle after delivery is confirmed.',
    '大型实物与 B2B 走托管，确认交付后结算。',
    '大型実物・B2Bはエスクローで拘束し、受け渡し確認後に精算します。',
    'Los bienes pesados y el B2B van por escrow y se liquidan tras confirmar la entrega.',
    'Hàng lớn và B2B dùng ký quỹ, thanh toán sau khi xác nhận giao hàng.',
    'Les biens lourds et le B2B passent par le séquestre, réglé après livraison confirmée.',
    'Bens grandes e B2B passam por escrow, liquidado após confirmar a entrega.',
    'Крупные товары и B2B — через эскроу, расчёт после подтверждения поставки.',
    'Barang besar dan B2B lewat escrow, dicairkan setelah pengiriman dikonfirmasi.'
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
