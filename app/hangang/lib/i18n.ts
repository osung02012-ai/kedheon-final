/* ------------------------------------------------------------------
 * Hangang — 10-language layer
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
    '한국 번호도, 한국 카드도 없이 — 서울에서 제주까지 대한민국 올인원 파이 패스',
    'No Korean number. No Korean card. — One Pi pass from Seoul to Jeju',
    '不需要韩国手机号、也不需要韩国银行卡 — 首尔到济州，一张 Pi 通行证走遍韩国',
    '韓国の番号もカードもいらない — ソウルから済州まで、Pi ひとつで韓国一周',
    'Sin número ni tarjeta coreana — un solo pase Pi de Seúl a Jeju',
    'Không cần số điện thoại hay thẻ Hàn Quốc — một tấm vé Pi từ Seoul đến Jeju',
    'Sans numéro ni carte coréenne — un seul pass Pi de Séoul à Jeju',
    'Sem número nem cartão coreano — um único passe Pi de Seul a Jeju',
    'Без корейского номера и карты — один пропуск Pi от Сеула до Чеджу',
    'Tanpa nomor atau kartu Korea — satu pass Pi dari Seoul sampai Jeju'
  ],
  heroDesc: [
    'Pi KYC 실명 안전망으로 콘서트·숙박·한복·미식·교통까지 전국 7개 권역에서 한 번에. 수수료 0% 직거래, 예약은 실명 1인 1건.',
    'Pi KYC links concerts, stays, hanbok, food and transit across 7 regions of Korea. 0% direct-deal fee, one verified human per booking.',
    'Pi KYC 实名保障，把演唱会、住宿、韩服、美食与交通串成全国 7 大圈的一站式行程。0% 直连手续费，实名一人一单。',
    'Pi KYC の実名認証で、コンサート・宿泊・韓服・グルメ・交通を韓国 7 エリアでひとつに。手数料 0%、実名でお一人様 1 予約。',
    'Pi KYC conecta conciertos, alojamiento, hanbok, comida y transporte en 7 regiones de Corea. Comisión 0%, una reserva por persona verificada.',
    'Pi KYC kết nối concert, lưu trú, hanbok, ẩm thực và di chuyển tại 7 vùng của Hàn Quốc. Phí 0%, mỗi người thật một đơn.',
    'Pi KYC relie concerts, hébergement, hanbok, gastronomie et transports dans 7 régions de Corée. 0 % de commission, une réservation par personne vérifiée.',
    'O Pi KYC liga shows, hospedagem, hanbok, gastronomia e transporte em 7 regiões da Coreia. Taxa 0%, uma reserva por pessoa verificada.',
    'Pi KYC связывает концерты, жильё, ханбок, еду и транспорт в 7 регионах Кореи. Комиссия 0%, одна бронь на одного подтверждённого человека.',
    'Pi KYC menghubungkan konser, penginapan, hanbok, kuliner, dan transportasi di 7 wilayah Korea. Biaya 0%, satu pemesanan per orang terverifikasi.'
  ],
  heroTag1: [
    '7개 권역 · 서울~제주',
    '7 regions · Seoul to Jeju',
    '7 大圈 · 首尔到济州',
    '7エリア · ソウル〜済州',
    '7 regiones · Seúl a Jeju',
    '7 vùng · Seoul đến Jeju',
    '7 régions · Séoul à Jeju',
    '7 regiões · Seul a Jeju',
    '7 регионов · Сеул–Чеджу',
    '7 wilayah · Seoul–Jeju'
  ],
  heroTag2: [
    'Pi KYC 1인 1실명',
    'Pi KYC verified human',
    'Pi KYC 实名一人',
    'Pi KYC 実名1名',
    'Pi KYC verificado',
    'Pi KYC xác thực',
    'Pi KYC vérifié',
    'Pi KYC verificado',
    'Pi KYC подтверждён',
    'Pi KYC terverifikasi'
  ],
  statFee: [
    '직거래 수수료 0%', '0% direct-deal fee', '直连手续费 0%', '手数料 0%',
    'comisión 0%', 'phí 0%', 'commission 0 %', 'taxa 0%', 'комиссия 0%', 'biaya 0%'
  ],
  statZones: [
    '전국 7개 권역', '7 regions', '全国 7 大圈', '全国7エリア',
    '7 regiones', '7 vùng', '7 régions', '7 regiões', '7 регионов', '7 wilayah'
  ],
  statHotline: [
    '1330 관광 통역 24h', '1330 hotline 24h', '1330 旅游翻译 24h', '1330 観光通訳 24h',
    '1330 · 24 h', '1330 trợ giúp 24h', '1330 · 24 h', '1330 · 24 h', '1330 · 24 ч', '1330 · 24 jam'
  ],
  statBeom: [
    'BEOM 리워드', 'BEOM rewards', 'BEOM 奖励', 'BEOM リワード',
    'recompensas BEOM', 'thưởng BEOM', 'récompenses BEOM', 'recompensas BEOM', 'награды BEOM', 'reward BEOM'
  ],
  sec1Title: [
    '전국 7대 권역 올인원 빌더', '7-region all-in-one builder', '全国 7 大圈一站式行程', '全国7エリア オールインワン',
    'Constructor todo en uno · 7 regiones', 'Combo trọn gói 7 vùng', 'Forfait tout-en-un · 7 régions',
    'Combo completo · 7 regiões', 'Конструктор «всё включено» · 7 регионов', 'Paket lengkap 7 wilayah'
  ],
  sec1Desc: [
    '권역을 고르고 숙박·문화·음식·교통을 조합하세요. 합계는 Pi, 결제는 KYC 실명 지갑으로.',
    'Pick a region, then combine stay, culture, food and transit. Priced in Pi, paid from your KYC wallet.',
    '选择圈区，组合住宿、文化、美食与交通。以 Pi 计价，用 KYC 实名钱包支付。',
    'エリアを選び、宿泊・文化・グルメ・交通を組み合わせ。料金は Pi、KYC 実名ウォレットで決済。',
    'Elige una región y combina alojamiento, cultura, comida y transporte. Precio en Pi, pago con tu cartera KYC.',
    'Chọn vùng rồi ghép lưu trú, văn hoá, ẩm thực và di chuyển. Giá bằng Pi, thanh toán bằng ví KYC.',
    'Choisissez une région et combinez hébergement, culture, gastronomie et transports. Prix en Pi, paiement par portefeuille KYC.',
    'Escolha a região e combine hospedagem, cultura, gastronomia e transporte. Preço em Pi, pagamento com carteira KYC.',
    'Выберите регион и соберите жильё, культуру, еду и транспорт. Цена в Pi, оплата из KYC-кошелька.',
    'Pilih wilayah, lalu susun penginapan, budaya, kuliner, dan transportasi. Harga dalam Pi, dibayar dari dompet KYC.'
  ],
  pickStay: ['숙박', 'STAY', '住宿', '宿泊', 'Alojamiento', 'Lưu trú', 'Hébergement', 'Hospedagem', 'Жильё', 'Penginapan'],
  pickCulture: ['문화·관광', 'CULTURE', '文化·观光', '文化・観光', 'Cultura', 'Văn hoá', 'Culture', 'Cultura', 'Культура', 'Budaya'],
  pickFood: ['음식', 'FOOD', '美食', 'グルメ', 'Comida', 'Ẩm thực', 'Gastronomie', 'Gastronomia', 'Еда', 'Kuliner'],
  pickTransit: ['교통', 'TRANSIT', '交通', '交通', 'Transporte', 'Di chuyển', 'Transport', 'Transporte', 'Транспорт', 'Transportasi'],
  zoneOptionsDesc: [
    '이 권역의 숙박·문화·음식·교통 12개 옵션',
    '12 options for this region',
    '本圈区 12 个选项',
    'このエリアの12オプション',
    '12 opciones de esta región',
    '12 lựa chọn của vùng này',
    '12 options dans cette région',
    '12 opções desta região',
    '12 вариантов в этом регионе',
    '12 pilihan di wilayah ini'
  ],
  tipsLabel: [
    '실속 이동·로컬 팁', 'Practical transit & local tips', '实用交通·本地贴士', '実用アクセス・ローカル情報',
    'Transporte y consejos prácticos', 'Di chuyển & mẹo thực tế', 'Transport et conseils pratiques',
    'Transporte e dicas práticas', 'Транспорт и местные советы', 'Transportasi & tips praktis'
  ],
  kycBadge: [
    'KYC 1인 1예약', 'KYC 1 person / 1 booking', 'KYC 实名一人一单', 'KYC 実名1名1予約',
    'KYC 1 reserva por persona', 'KYC 1 người 1 đơn', 'KYC 1 réservation par personne',
    'KYC 1 reserva por pessoa', 'KYC 1 бронь на человека', 'KYC 1 orang 1 pesanan'
  ],
  totalLabel: [
    '패키지 합계 · 부가 수수료 0%', 'Package total · 0% added fee', '套餐合计 · 附加费 0%', '合計 · 追加手数料 0%',
    'Total del paquete · 0% de recargo', 'Tổng gói · phụ phí 0%', 'Total du forfait · 0 % de frais',
    'Total do pacote · 0% de taxa', 'Итого · доп. комиссия 0%', 'Total paket · biaya tambahan 0%'
  ],
  bookBtn: [
    '예약·문의 (보안 QR)', 'Book / inquire (secure QR)', '预订·咨询（安全 QR）', '予約・問い合わせ（セキュアQR）',
    'Reservar / consultar (QR seguro)', 'Đặt / hỏi (QR bảo mật)', 'Réserver / demander (QR sécurisé)',
    'Reservar / consultar (QR seguro)', 'Бронь / вопрос (защищённый QR)', 'Pesan / tanya (QR aman)'
  ],
  bookNote: [
    '결제 전 호스트 KYC 실명과 FactFilter 안전 등급을 확인합니다. 예약 확정 시 +5 BEOM 적립.',
    'Host KYC identity and FactFilter safety grade are shown before payment. +5 BEOM on confirmation.',
    '付款前显示房东 KYC 实名与 FactFilter 安全等级。确认预订即获 +5 BEOM。',
    '支払い前にホストの KYC 実名と FactFilter 安全等級を表示。予約確定で +5 BEOM。',
    'Antes de pagar verás la identidad KYC del anfitrión y su nivel FactFilter. +5 BEOM al confirmar.',
    'Trước khi thanh toán, xem danh tính KYC và mức an toàn FactFilter của chủ nhà. +5 BEOM khi xác nhận.',
    'L’identité KYC de l’hôte et sa note FactFilter s’affichent avant le paiement. +5 BEOM à la confirmation.',
    'Antes do pagamento você vê a identidade KYC do anfitrião e a nota FactFilter. +5 BEOM na confirmação.',
    'Перед оплатой видны KYC-личность хозяина и класс безопасности FactFilter. +5 BEOM при подтверждении.',
    'Identitas KYC tuan rumah dan nilai FactFilter tampil sebelum bayar. +5 BEOM saat konfirmasi.'
  ],
  reservedLabel: [
    '예약 접수', 'reservation received', '已受理预订', '予約受付',
    'reserva recibida', 'đã nhận đặt chỗ', 'réservation reçue', 'reserva recebida', 'заявка принята', 'pesanan diterima'
  ],
  sec2Title: [
    'K-굿즈 · 한복 · 짐보관 대행 보드', 'K-goods · hanbok · luggage board', 'K-周边 · 韩服 · 寄存代办', 'Kグッズ・韓服・手荷物預かり',
    'Souvenirs, hanbok y consigna', 'Quà K, hanbok, giữ hành lý', 'Souvenirs, hanbok, consigne',
    'Souvenirs, hanbok, bagagem', 'Сувениры, ханбок, камера хранения', 'Suvenir, hanbok, penitipan'
  ],
  sec2Desc: [
    '국립박물관 뮷즈부터 경주·부산·제주 특산품, 한복 대여, 짐보관까지 KYC 호스트가 대신합니다. 요청 시 +2 BEOM.',
    'Museum goods, Gyeongju and Busan specialties, Jeju treats, hanbok rental and luggage storage — handled by KYC hosts. +2 BEOM per request.',
    '从国立博物馆周边到庆州、釜山、济州特产，韩服租借与行李寄存，均由 KYC 房东代办。每次请求 +2 BEOM。',
    '国立博物館グッズから慶州・釜山・済州の名産、韓服レンタル、手荷物預かりまで KYC ホストが代行。依頼ごとに +2 BEOM。',
    'Souvenirs del museo, especialidades de Gyeongju, Busan y Jeju, alquiler de hanbok y consigna, gestionados por anfitriones KYC. +2 BEOM por solicitud.',
    'Quà bảo tàng, đặc sản Gyeongju–Busan–Jeju, thuê hanbok và giữ hành lý do chủ nhà KYC làm thay. +2 BEOM mỗi yêu cầu.',
    'Souvenirs de musée, spécialités de Gyeongju, Busan et Jeju, location de hanbok et consigne, gérés par des hôtes KYC. +2 BEOM par demande.',
    'Souvenirs de museu, especialidades de Gyeongju, Busan e Jeju, aluguel de hanbok e consigna, feitos por anfitriões KYC. +2 BEOM por pedido.',
    'Сувениры музея, specialties Кёнджу, Пусана и Чеджу, прокат ханбока и камера хранения — через KYC-хозяев. +2 BEOM за запрос.',
    'Suvenir museum, khas Gyeongju–Busan–Jeju, sewa hanbok, dan penitipan barang diurus host KYC. +2 BEOM per permintaan.'
  ],
  sec3Title: [
    '한국 여행 실속 팩', 'Korea travel utility pack', '韩国旅行实用包', '韓国旅行 実用パック',
    'Pack práctico de viaje', 'Bộ tiện ích du lịch', 'Pack pratique de voyage', 'Kit prático de viagem',
    'Практичный набор туриста', 'Paket praktis wisata'
  ],
  sec3Desc: [
    '교통카드·전압·택스리펀·휴관일 — 도착 전에 알아야 할 것만 모았습니다.',
    'Transit card, voltage, tax refund, closing days — only what you need before landing.',
    '交通卡、电压、退税、闭馆日——只留出发前真正要用的。',
    '交通カード・電圧・免税還付・休館日 — 到着前に必要な情報だけ。',
    'Tarjeta de transporte, voltaje, devolución de impuestos y días de cierre: solo lo esencial.',
    'Thẻ giao thông, điện áp, hoàn thuế, ngày đóng cửa — chỉ những gì cần trước khi đến.',
    'Carte de transport, tension, détaxe, jours de fermeture : l’essentiel avant d’arriver.',
    'Cartão de transporte, voltagem, restituição de imposto e dias de fechamento: só o essencial.',
    'Транспортная карта, напряжение, tax free, выходные дни — только нужное до прилёта.',
    'Kartu transportasi, tegangan, pengembalian pajak, hari tutup — hanya yang perlu sebelum tiba.'
  ],
  util1Title: ['교통카드', 'Transit card', '交通卡', '交通カード', 'Tarjeta de transporte', 'Thẻ giao thông', 'Carte de transport', 'Cartão de transporte', 'Транспортная карта', 'Kartu transportasi'],
  util1Body: [
    '티머니 2,500~4,000원(편의점) 충전식. 서울만 다니면 기후동행카드 단기권 1일 5,000·3일 10,000·5일 15,000·7일 20,000원(카드값 3,000원, 1~8호선 발매기에서 해외카드 결제, 서울 밖·신분당선·GTX 불가).',
    'T-money costs ₩2,500–4,000 at convenience stores and is rechargeable. Staying in Seoul? The Climate Card short pass is ₩5,000/1 day, ₩10,000/3 days, ₩15,000/5 days, ₩20,000/7 days (card ₩3,000; buy at Line 1–8 vending machines with a foreign card; Seoul only, no Shinbundang Line or GTX).',
    'T-money 卡 2,500~4,000 韩元（便利店购买）可充值。只在首尔活动就买气候同行卡短期券：1 日 5,000、3 日 10,000、5 日 15,000、7 日 20,000 韩元（卡费 3,000 韩元，1~8 号线售票机可用海外卡支付，首尔以外及新盆唐线、GTX 不可用）。',
    'T-money は 2,500〜4,000ウォン（コンビニ）で購入しチャージ式。ソウル中心なら気候同行カード短期券が1日5,000・3日10,000・5日15,000・7日20,000ウォン（カード3,000ウォン、1〜8号線の券売機で海外カード決済可、ソウル外・新盆唐線・GTXは不可）。',
    'La T-money cuesta ₩2,500–4,000 en tiendas y se recarga. Si te quedas en Seúl, el pase corto Climate Card cuesta ₩5,000/1 día, ₩10,000/3 días, ₩15,000/5 días y ₩20,000/7 días (tarjeta ₩3,000; se compra en máquinas de líneas 1–8 con tarjeta extranjera; solo Seúl, sin Shinbundang ni GTX).',
    'Thẻ T-money giá 2.500–4.000 KRW (mua ở cửa hàng tiện lợi), nạp tiền. Nếu chỉ ở Seoul, vé ngắn hạn Climate Card: 1 ngày 5.000, 3 ngày 10.000, 5 ngày 15.000, 7 ngày 20.000 KRW (thẻ 3.000 KRW, mua ở máy bán vé tuyến 1–8 bằng thẻ nước ngoài; chỉ trong Seoul, không dùng tuyến Shinbundang hay GTX).',
    'La T-money coûte 2 500–4 000 ₩ en supérette et se recharge. Si vous restez à Séoul, le pass court Climate Card est à 5 000 ₩/1 j, 10 000 ₩/3 j, 15 000 ₩/5 j, 20 000 ₩/7 j (carte 3 000 ₩, achat aux distributeurs des lignes 1–8 par carte étrangère ; Séoul uniquement, hors Shinbundang et GTX).',
    'O T-money custa ₩2.500–4.000 em lojas e é recarregável. Ficando em Seul, o passe curto Climate Card custa ₩5.000/1 dia, ₩10.000/3 dias, ₩15.000/5 dias e ₩20.000/7 dias (cartão ₩3.000; compra nas máquinas das linhas 1–8 com cartão estrangeiro; só Seul, sem Shinbundang nem GTX).',
    'T-money стоит 2 500–4 000 вон в магазинах, пополняется. Если вы только в Сеуле — короткий проездной Climate Card: 5 000 вон/1 день, 10 000/3 дня, 15 000/5 дней, 20 000/7 дней (карта 3 000 вон, покупка в автоматах линий 1–8 иностранной картой; только Сеул, без Shinbundang и GTX).',
    'T-money ₩2.500–4.000 di toko dan bisa diisi ulang. Kalau hanya di Seoul, pass pendek Climate Card: ₩5.000/1 hari, ₩10.000/3 hari, ₩15.000/5 hari, ₩20.000/7 hari (kartu ₩3.000, beli di mesin jalur 1–8 dengan kartu asing; hanya Seoul, tanpa Shinbundang dan GTX).'
  ],
  util2Title: ['전압·콘센트', 'Power & plugs', '电压·插座', '電圧・コンセント', 'Voltaje y enchufes', 'Điện áp & ổ cắm', 'Tension et prises', 'Voltagem e tomadas', 'Напряжение и розетки', 'Tegangan & colokan'],
  util2Body: [
    '220V·60Hz, 둥근 2핀(C/F). 110V 기기가 아니면 변압기 없이 그대로 사용. 멀티탭 하나면 충분합니다.',
    '220 V / 60 Hz, round two-pin (type C/F). Anything not 110 V plugs straight in — one multi-socket is enough.',
    '220V·60Hz，圆形两脚（C/F）。非 110V 电器可直接使用，无需变压器，一个多功能插排就够。',
    '220V・60Hz、丸型2ピン（C/F）。110V 機器でなければ変圧器なしでそのまま使えます。電源タップ1つで十分。',
    '220 V / 60 Hz, dos clavijas redondas (tipo C/F). Todo lo que no sea 110 V se enchufa directo; con una regleta basta.',
    '220 V / 60 Hz, phích tròn 2 chấu (C/F). Thiết bị không phải 110 V cắm trực tiếp, không cần biến áp; một ổ chia là đủ.',
    '220 V / 60 Hz, fiche ronde à deux broches (C/F). Tout appareil non 110 V se branche directement ; une multiprise suffit.',
    '220 V / 60 Hz, dois pinos redondos (tipo C/F). Aparelhos que não sejam 110 V ligam direto; uma régua basta.',
    '220 В / 60 Гц, круглая вилка (тип C/F). Всё, кроме 110 В, включается напрямую — хватит одного удлинителя.',
    '220 V / 60 Hz, colokan bulat dua pin (C/F). Perangkat non-110 V bisa langsung dipakai; satu terminal cukup.'
  ],
  util3Title: ['택스리펀', 'Tax refund', '退税', '免税還付', 'Devolución de IVA', 'Hoàn thuế', 'Détaxe', 'Restituição de imposto', 'Tax free', 'Pengembalian pajak'],
  util3Body: [
    '영수증 1건 15,000원 이상 + 여권 필수. 즉시환급은 1회 100만원 미만·총 500만원 이하, 실제 환급액은 구매액의 5~8%.',
    '₩15,000+ per receipt and your passport. Instant refund up to ₩1,000,000 per purchase and ₩5,000,000 in total; you get back about 5–8%.',
    '单张发票满 15,000 韩元并出示护照。即时退税单次 100 万韩元以下、累计 500 万韩元以下，实际退税额约为消费额的 5~8%。',
    '1レシート15,000ウォン以上＋パスポート必須。即時還付は1回100万ウォン未満・合計500万ウォン以下、実際の還付は購入額の5〜8%程度。',
    'Desde ₩15.000 por recibo y con pasaporte. La devolución inmediata admite hasta ₩1.000.000 por compra y ₩5.000.000 en total; recuperas un 5–8 %.',
    'Từ 15.000 KRW/hóa đơn và cần hộ chiếu. Hoàn thuế ngay tối đa 1.000.000 KRW/lần và 5.000.000 KRW tổng; thực nhận khoảng 5–8%.',
    'À partir de 15 000 ₩ par ticket, passeport obligatoire. Détaxe immédiate jusqu’à 1 000 000 ₩ par achat et 5 000 000 ₩ au total ; vous récupérez 5–8 %.',
    'A partir de ₩15.000 por recibo e com passaporte. A restituição imediata vai até ₩1.000.000 por compra e ₩5.000.000 no total; você recebe 5–8%.',
    'От 15 000 вон в чеке и паспорт. Мгновенный возврат — до 1 000 000 вон за покупку и 5 000 000 вон всего; реально возвращают 5–8%.',
    'Minimal ₩15.000 per struk dan wajib paspor. Pengembalian langsung maksimal ₩1.000.000 per pembelian dan ₩5.000.000 total; yang kembali sekitar 5–8%.'
  ],
  util4Title: ['휴관일', 'Closing days', '闭馆日', '休館日', 'Días de cierre', 'Ngày đóng cửa', 'Jours de fermeture', 'Dias de fechamento', 'Выходные дни', 'Hari tutup'],
  util4Body: [
    '경복궁·종묘 화요일, 창덕궁·덕수궁·창경궁 월요일 휴관. 국립중앙박물관은 1월 1일·설·추석만 휴관(수·토 21시까지).',
    'Gyeongbokgung and Jongmyo close Tuesdays; Changdeokgung, Deoksugung and Changgyeonggung close Mondays. The National Museum closes only Jan 1, Seollal and Chuseok (open to 21:00 on Wed/Sat).',
    '景福宫、宗庙周二闭馆；昌德宫、德寿宫、昌庆宫周一闭馆。国立中央博物馆仅 1 月 1 日、春节、中秋闭馆（周三·周六开放至 21 时）。',
    '景福宮・宗廟は火曜、昌徳宮・徳寿宮・昌慶宮は月曜休館。国立中央博物館は1月1日・旧正月・秋夕のみ休館（水・土は21時まで）。',
    'Gyeongbokgung y Jongmyo cierran los martes; Changdeokgung, Deoksugung y Changgyeonggung, los lunes. El Museo Nacional solo cierra el 1 de enero, Seollal y Chuseok (mié/sáb hasta las 21:00).',
    'Gyeongbokgung và Jongmyo đóng cửa thứ Ba; Changdeokgung, Deoksugung, Changgyeonggung đóng thứ Hai. Bảo tàng Quốc gia chỉ đóng 1/1, Tết Âm lịch và Trung thu (thứ Tư/thứ Bảy mở đến 21:00).',
    'Gyeongbokgung et Jongmyo ferment le mardi ; Changdeokgung, Deoksugung et Changgyeonggung le lundi. Le Musée national ne ferme que le 1er janvier, Seollal et Chuseok (mer/sam jusqu’à 21 h).',
    'Gyeongbokgung e Jongmyo fecham às terças; Changdeokgung, Deoksugung e Changgyeonggung às segundas. O Museu Nacional só fecha em 1º de janeiro, Seollal e Chuseok (qua/sáb até 21h).',
    'Кёнбоккун и Чонмё закрыты по вторникам; Чхандоккун, Токсугун и Чхангёнгун — по понедельникам. Национальный музей закрыт только 1 января, в Соллаль и Чхусок (ср/сб до 21:00).',
    'Gyeongbokgung dan Jongmyo tutup Selasa; Changdeokgung, Deoksugung, Changgyeonggung tutup Senin. Museum Nasional hanya tutup 1 Januari, Seollal, dan Chuseok (Rabu/Sabtu sampai 21.00).'
  ],
  sec4Title: [
    '전국 세이프티 실드', 'Nationwide safety shield', '全国安全盾', '全国セーフティシールド',
    'Escudo de seguridad nacional', 'Khiên an toàn toàn quốc', 'Bouclier sécurité national',
    'Escudo de segurança nacional', 'Щит безопасности по всей стране', 'Perisai keselamatan nasional'
  ],
  sec4Desc: [
    '여행 중 혼자 남지 않도록 — 24시간 긴급·통역 핫라인과 공식 안전망을 한 화면에 모았습니다.',
    'So no one is left alone on the road: 24-hour emergency and interpretation hotlines with official safety networks in one screen.',
    '旅途中不让你独自应对——24 小时紧急与翻译热线、官方安全网络集中在一屏。',
    '旅先で一人にならないように — 24時間の緊急・通訳ホットラインと公式安全網を1画面に。',
    'Para que nadie quede solo en el viaje: líneas de emergencia e interpretación 24 h y redes oficiales en una pantalla.',
    'Để bạn không bao giờ phải xử lý một mình: đường dây khẩn cấp và phiên dịch 24h cùng mạng an toàn chính thức trên một màn hình.',
    'Pour ne jamais rester seul en route : lignes d’urgence et d’interprétation 24 h et réseaux officiels sur un seul écran.',
    'Para ninguém ficar sozinho na viagem: linhas de emergência e interpretação 24 h e redes oficiais em uma tela.',
    'Чтобы вы не остались одни в поездке: круглосуточные экстренные и переводческие линии и официальные службы на одном экране.',
    'Agar tidak sendirian di perjalanan: hotline darurat dan penerjemah 24 jam serta jaringan resmi dalam satu layar.'
  ],
  hotlinePolice: ['경찰 신고', 'Police', '报警', '警察', 'Policía', 'Cảnh sát', 'Police', 'Polícia', 'Полиция', 'Polisi'],
  hotlineAmbulance: ['응급·구조', 'Ambulance', '急救', '救急', 'Ambulancia', 'Cấp cứu', 'Urgences', 'Ambulância', 'Скорая', 'Ambulans'],
  hotlineTour: ['관광 통역·관광경찰', 'Travel hotline', '旅游翻译', '観光通訳', 'Turismo', 'Du lịch', 'Tourisme', 'Turismo', 'Туризм', 'Wisata'],
  hotlineSeoul: ['서울 다산콜', 'Seoul 120', '首尔 120', 'ソウル120', 'Seúl 120', 'Seoul 120', 'Séoul 120', 'Seul 120', 'Сеул 120', 'Seoul 120'],
  hotlinePoliceSub: ['24시간', '24h', '24 小时', '24時間', '24 h', '24h', '24 h', '24 h', '24 ч', '24 jam'],
  hotlineAmbulanceSub: ['24시간', '24h', '24 小时', '24時間', '24 h', '24h', '24 h', '24 h', '24 ч', '24 jam'],
  hotlineTourSub: ['24시간 다국어', '24h, 13 languages', '24 小时·多语', '24時間・多言語', '24 h, 13 idiomas', '24h, 13 ngôn ngữ', '24 h, 13 langues', '24 h, 13 idiomas', '24 ч, 13 языков', '24 jam, 13 bahasa'],
  hotlineSeoulSub: ['야간·공휴일', 'nights & holidays', '夜间·公休日', '夜間・祝日', 'noches y festivos', 'đêm & ngày lễ', 'nuits et jours fériés', 'noites e feriados', 'ночью и в праздники', 'malam & libur'],
  safetyNote: [
    '응급은 112·119, 언어가 막히면 1330(24시간 13개 언어). 서울에서는 120으로 심야 안심귀가 동행(평일 22시~01시)을 요청할 수 있습니다. DMZ·판문점은 여권과 사전 예약이 필수입니다.',
    'Emergency: 112 / 119. Language help: 1330 (24 h, 13 languages). In Seoul, call 120 for a late-night safe-return escort (weekdays 22:00–01:00). The DMZ and Panmunjom require your passport and advance booking.',
    '紧急拨打 112·119，语言不通拨 1330（24 小时·13 种语言）。首尔可拨 120 申请深夜安心回家陪伴（平日 22 时~01 时）。DMZ·板门店必须携带护照并提前预约。',
    '緊急は112・119、言葉に困ったら1330（24時間・13言語）。ソウルでは120で深夜の安心帰宅同行（平日22時〜01時）を依頼できます。DMZ・板門店はパスポートと事前予約が必須です。',
    'Emergencias: 112 / 119. Ayuda idiomática: 1330 (24 h, 13 idiomas). En Seúl, llama al 120 para un acompañamiento nocturno de regreso (laborables 22:00–01:00). La DMZ y Panmunjom exigen pasaporte y reserva previa.',
    'Khẩn cấp: 112 / 119. Trợ giúp ngôn ngữ: 1330 (24h, 13 ngôn ngữ). Tại Seoul, gọi 120 để được hộ tống về đêm (ngày thường 22:00–01:00). DMZ và Bàn Môn Điếm bắt buộc hộ chiếu và đặt trước.',
    'Urgences : 112 / 119. Aide linguistique : 1330 (24 h, 13 langues). À Séoul, appelez le 120 pour un accompagnement nocturne (en semaine 22 h–1 h). DMZ et Panmunjom exigent passeport et réservation.',
    'Emergências: 112 / 119. Ajuda em idiomas: 1330 (24 h, 13 idiomas). Em Seul, ligue 120 para acompanhamento noturno de volta (dias úteis 22h–1h). DMZ e Panmunjom exigem passaporte e reserva antecipada.',
    'Экстренно: 112 / 119. Языковая помощь: 1330 (24 ч, 13 языков). В Сеуле звоните 120 для ночного сопровождения (будни 22:00–01:00). Для DMZ и Пханмунджома нужны паспорт и бронь заранее.',
    'Darurat: 112 / 119. Bantuan bahasa: 1330 (24 jam, 13 bahasa). Di Seoul, hubungi 120 untuk pengantaran pulang malam (hari kerja 22.00–01.00). DMZ dan Panmunjom wajib paspor dan reservasi.'
  ],
  requestLabel: [
    '직접 요청 등록 · KYC 호스트 매칭', 'Register a request · KYC host matching', '直接登记需求 · KYC 房东匹配', '直接リクエスト · KYC ホスト照合',
    'Registrar solicitud · anfitrión KYC', 'Gửi yêu cầu · ghép chủ nhà KYC', 'Déposer une demande · hôte KYC',
    'Registrar pedido · anfitrião KYC', 'Свой запрос · подбор KYC-хозяина', 'Ajukan permintaan · host KYC'
  ],
  reqPlaceholder: [
    '예: 11월 18일 경주 불국사, 한복 2시간 + 황남빵 3개',
    'e.g. Nov 18 Bulguksa in Gyeongju, 2h hanbok + 3 Hwangnam breads',
    '例：11 月 18 日庆州佛国寺，韩服 2 小时 + 皇南饼 3 个',
    '例：11月18日 慶州・仏国寺、韓服2時間＋皇南パン3個',
    'Ej.: 18 nov. Bulguksa (Gyeongju), hanbok 2 h + 3 panes Hwangnam',
    'VD: 18/11 Bulguksa Gyeongju, hanbok 2 giờ + 3 bánh Hwangnam',
    'Ex. : 18 nov. Bulguksa (Gyeongju), hanbok 2 h + 3 pains Hwangnam',
    'Ex.: 18 nov. Bulguksa (Gyeongju), hanbok 2 h + 3 pães Hwangnam',
    'Напр.: 18 ноября Пульгукса (Кёнджу), ханбок на 2 ч + 3 хлеба Хваннам',
    'Contoh: 18 Nov Bulguksa Gyeongju, hanbok 2 jam + 3 roti Hwangnam'
  ],
  reqNote: [
    '요청 즉시 실명 KYC 호스트에게만 공개되고, FactFilter 안전 등급 A 호스트가 우선 매칭됩니다.',
    'Visible only to KYC-verified hosts; FactFilter grade A hosts are matched first.',
    '需求仅向 KYC 实名房东公开，优先匹配 FactFilter 安全等级 A 的房东。',
    '依頼は KYC 実名ホストのみに公開され、FactFilter 安全等級 A のホストが優先されます。',
    'Solo lo ven anfitriones con KYC; se asignan primero los de grado A en FactFilter.',
    'Chỉ chủ nhà đã KYC thấy; ưu tiên chủ nhà hạng A của FactFilter.',
    'Visible seulement par les hôtes vérifiés KYC ; les hôtes FactFilter A sont servis en premier.',
    'Visível só para anfitriões com KYC; os de grau A no FactFilter são atendidos primeiro.',
    'Видно только KYC-хозяевам; первыми подбираются хозяева класса A FactFilter.',
    'Hanya terlihat oleh host ter-KYC; host kelas A FactFilter didahulukan.'
  ],
  submitBtn: [
    '요청 등록 (+2 BEOM)', 'Submit (+2 BEOM)', '提交需求（+2 BEOM）', '依頼する（+2 BEOM）',
    'Enviar (+2 BEOM)', 'Gửi (+2 BEOM)', 'Envoyer (+2 BEOM)', 'Enviar (+2 BEOM)', 'Отправить (+2 BEOM)', 'Kirim (+2 BEOM)'
  ],
  matchingHost: [
    '호스트 매칭 중', 'matching host', '匹配房东中', 'ホスト照合中',
    'buscando anfitrión', 'đang ghép chủ nhà', 'recherche d’hôte', 'buscando anfitrião', 'подбор хозяина', 'mencari host'
  ],
  modalTitle: [
    '예약·문의 확인', 'Confirm booking', '确认预订', '予約・問い合わせ確認',
    'Confirmar reserva', 'Xác nhận đặt chỗ', 'Confirmer la réservation', 'Confirmar reserva', 'Подтверждение брони', 'Konfirmasi pesanan'
  ],
  modalQR: ['케데헌 보안 QR', 'Kedheon secure QR', 'Kedheon 安全 QR', 'Kedheon セキュアQR', 'QR seguro de Kedheon', 'QR bảo mật Kedheon', 'QR sécurisé Kedheon', 'QR seguro Kedheon', 'Защищённый QR Kedheon', 'QR aman Kedheon'],
  modalQRDesc: [
    'Pi Browser에서 스캔하면 KYC 실명 지갑으로 결제·확인이 이어집니다.',
    'Scan in Pi Browser to pay and confirm with your KYC wallet.',
    '在 Pi Browser 扫码，即用 KYC 实名钱包付款确认。',
    'Pi Browser でスキャンすると KYC 実名ウォレットで決済・確認できます。',
    'Escanea en Pi Browser para pagar y confirmar con tu cartera KYC.',
    'Quét trong Pi Browser để thanh toán và xác nhận bằng ví KYC.',
    'Scannez dans Pi Browser pour payer et confirmer avec votre portefeuille KYC.',
    'Escaneie no Pi Browser para pagar e confirmar com sua carteira KYC.',
    'Отсканируйте в Pi Browser, чтобы оплатить и подтвердить из KYC-кошелька.',
    'Pindai di Pi Browser untuk membayar dan konfirmasi dengan dompet KYC.'
  ],
  modalConfirm: [
    '예약 접수 · +5 BEOM 적립', 'Confirm · earn +5 BEOM', '确认预订 · +5 BEOM', '予約確定 · +5 BEOM',
    'Confirmar · +5 BEOM', 'Xác nhận · +5 BEOM', 'Confirmer · +5 BEOM', 'Confirmar · +5 BEOM', 'Подтвердить · +5 BEOM', 'Konfirmasi · +5 BEOM'
  ],
  modalDemo: [
    '이 화면은 데모입니다. 실제 결제·정산은 KYC 호스트 확인 후 Pi로 진행됩니다.',
    'This screen is a demo. Real payment settles in Pi after host KYC verification.',
    '本页面为演示。实际支付在房东 KYC 确认后以 Pi 结算。',
    'この画面はデモです。実際の決済はホストの KYC 確認後に Pi で行われます。',
    'Esta pantalla es una demo. El pago real se liquida en Pi tras verificar el KYC del anfitrión.',
    'Màn hình này là bản demo. Thanh toán thật được quyết toán bằng Pi sau khi xác minh KYC chủ nhà.',
    'Cet écran est une démo. Le paiement réel se règle en Pi après vérification KYC de l’hôte.',
    'Esta tela é uma demo. O pagamento real é liquidado em Pi após a verificação KYC do anfitrião.',
    'Это демо. Реальная оплата проходит в Pi после KYC-проверки хозяина.',
    'Layar ini demo. Pembayaran nyata diselesaikan dalam Pi setelah verifikasi KYC host.'
  ],
  alertNote: [
    '요청 내용을 적어 주세요.', 'Please describe your request.', '请填写需求内容。', 'リクエスト内容を入力してください。',
    'Describe tu solicitud.', 'Vui lòng mô tả yêu cầu.', 'Décrivez votre demande.', 'Descreva seu pedido.', 'Опишите запрос.', 'Tulis permintaan Anda.'
  ],
  alertSoon: [
    ' 서비스 준비 중입니다.', ' service is coming soon.', ' 服务正在准备中。', ' サービスは準備中です。',
    ' en preparación.', ' đang được chuẩn bị.', ' bientôt disponible.', ' em preparação.', ' скоро появится.', ' segera hadir.'
  ],
  footerTag: [
    '케데헌 생태계 실물 경제 레이어', 'real-world economy layer of the Kedheon ecosystem',
    'Kedheon 生态的现实经济层', 'Kedheon エコシステムの実経済レイヤー',
    'capa de economía real del ecosistema Kedheon', 'tầng kinh tế thực của hệ sinh thái Kedheon',
    'couche d’économie réelle de l’écosystème Kedheon', 'camada de economia real do ecossistema Kedheon',
    'слой реальной экономики экосистемы Kedheon', 'lapisan ekonomi nyata ekosistem Kedheon'
  ],
  imgAlt: [
    '한강 수호신 까치호랑이 — 갓과 붉은 한복을 입은 범, 소나무 가지의 까치와 달밤 한강 물결, 하단 hangang.pi 명패',
    'Hangang tiger guardian — a classic Korean minhwa painting of a tiger in a gat and red hanbok with a magpie on a pine branch over the Han River, with a hangang.pi nameplate',
    '汉江守护神鹊虎图 — 戴笠着红袍的老虎、松枝喜鹊与月夜汉江，底部 hangang.pi 铭牌',
    '漢江の守り神・鵲虎図 — 笠と赤い韓服の虎、松の枝の鵲、月夜の漢江、下部に hangang.pi の銘板',
    'Tigre guardián del Hangang: minhwa clásica con tigre de gat y hanbok rojo, urraca en el pino y el río de noche, con placa hangang.pi',
    'Hổ thần Hangang — tranh minhwa cổ điển: hổ đội gat, áo hanbok đỏ, chim khách trên cành thông, sông Hangang đêm, có bảng tên hangang.pi',
    'Tigre gardien du Hangang — minhwa classique : tigre au gat et hanbok rouge, pie sur une branche de pin, fleuve de nuit, plaque hangang.pi',
    'Tigre guardião do Hangang — minhwa clássica: tigre de gat e hanbok vermelho, pega no pinheiro, rio à noite, com placa hangang.pi',
    'Тигр-хранитель Хангана — классическая минхва: тигр в кат и красном ханбоке, сорока на сосне, ночная река, табличка hangang.pi',
    'Macan penjaga Hangang — minhwa klasik: macan bergat dan hanbok merah, burung murai di dahan pinus, sungai malam, dengan papan nama hangang.pi'
  ],
  imgCaption: [
    '까치호랑이 · Hangang Guardian',
    'Magpie & Tiger · Hangang Guardian',
    '鹊虎图 · Hangang Guardian',
    '鵲虎図 · Hangang Guardian',
    'Urraca y tigre · Hangang Guardian',
    'Khách và hổ · Hangang Guardian',
    'Pie et tigre · Hangang Guardian',
    'Pega e tigre · Hangang Guardian',
    'Сорока и тигр · Hangang Guardian',
    'Murai dan macan · Hangang Guardian'
  ]
} satisfies Record<string, L10>;

export type UIKey = keyof typeof UI;

export function ui(key: UIKey, lang: Lang): string {
  return tr(UI[key], lang);
}
