/* ------------------------------------------------------------------
 * Hangang — 1~100 여정 데이터 (1단계)
 * 입국·공항 → 교통·결제 → 숙소·짐 → 콘서트·예매 → 맛집·체험 → 굿즈·응급
 * 10-tuple order: KR EN CN JP ES VN FR PT RU ID
 * 모든 링크는 설계서(docs/hangang-1to100-plan.md)에서 200으로 실측된 주소만 넣는다.
 * ------------------------------------------------------------------ */

import type { L10 } from './i18n';
import type { BadgeKind } from './badges';

export interface Card {
  id: string;
  icon: string;
  title: L10;
  body: L10;
  badge: BadgeKind;
  url?: string;
  urlName?: string;
  /** 사실 확인 시점 표기용 */
  verified?: boolean;
}

/* ── 여정 스텝 레일 6칸 ─────────────────────────────────────────── */
export const STEP_RAIL: { id: string; no: string; icon: string; label: L10 }[] = [
  {
    id: 'journey-arrival', no: '01', icon: '✈️',
    label: ['입국·공항', 'Arrival', '入境·机场', '入国·空港', 'Llegada', 'Nhập cảnh', 'Arrivée', 'Chegada', 'Прилёт', 'Kedatangan']
  },
  {
    id: 'journey-transit', no: '02', icon: '🚇',
    label: ['교통·결제', 'Transit', '交通·支付', '交通·決済', 'Transporte', 'Di chuyển', 'Transport', 'Transporte', 'Транспорт', 'Transportasi']
  },
  {
    id: 'journey-stay', no: '03', icon: '🏨',
    label: ['숙소·짐', 'Stay', '住宿·行李', '宿泊·荷物', 'Alojamiento', 'Lưu trú', 'Logement', 'Hospedagem', 'Жильё', 'Penginapan']
  },
  {
    id: 'journey-tickets', no: '04', icon: '🎫',
    label: ['콘서트·예매', 'Tickets', '演唱会·购票', 'コンサート', 'Entradas', 'Vé', 'Billets', 'Ingressos', 'Билеты', 'Tiket']
  },
  {
    id: 'journey-eat', no: '05', icon: '🍜',
    label: ['맛집·체험', 'Food', '美食·体验', 'グルメ·体験', 'Comida', 'Ăn uống', 'Restos', 'Comida', 'Еда', 'Kuliner']
  },
  {
    id: 'journey-goods', no: '06', icon: '🏺',
    label: ['굿즈·응급', 'Goods', '周边·安全', 'グッズ·安心', 'Souvenirs', 'Quà tặng', 'Souvenirs', 'Souvenirs', 'Сувениры', 'Suvenir']
  }
];

/* ── 섹션 머리글 ────────────────────────────────────────────────── */
export const SEC: Record<'arrival' | 'transit' | 'stay' | 'tickets' | 'food' | 'goods', { title: L10; desc: L10 }> = {
  arrival: {
    title: ['입국·공항 — 첫 3시간에 끝내는 것', 'Arrival & airport — the first three hours', '入境·机场——落地 3 小时内搞定', '入国・空港 — 最初の3時間で終えること', 'Llegada y aeropuerto: las primeras tres horas', 'Nhập cảnh & sân bay — xong trong 3 giờ đầu', 'Arrivée et aéroport : les trois premières heures', 'Chegada e aeroporto: as três primeiras horas', 'Прилёт и аэропорт — что успеть за первые три часа', 'Kedatangan & bandara — beres dalam tiga jam pertama'],
    desc: ['비자·K-ETA 확인부터 유심·교통카드까지. 여권만 있으면 되는 것과 보호자가 필요한 것을 나눠 적었습니다.', 'From K-ETA to a SIM and transit card — split into what needs only a passport and what needs a guardian.', '从 K-ETA 到手机卡、交通卡。把“只要护照”和“需要监护人”的分开写清。', 'ビザ・K-ETA から SIM・交通カードまで。パスポートだけで済むものと保護者が必要なものを分けました。', 'De la K-ETA a la SIM y la tarjeta de transporte: separado en lo que basta el pasaporte y lo que exige tutor.', 'Từ K-ETA đến SIM và thẻ giao thông — tách rõ việc chỉ cần hộ chiếu và việc cần người giám hộ.', 'Du K-ETA à la SIM et à la carte de transport : d’un côté le passeport seul, de l’autre le tuteur.', 'Do K-ETA ao chip e ao cartão de transporte: separado entre só passaporte e o que exige responsável.', 'От K-ETA до SIM и транспортной карты: отдельно то, что требует только паспорта, и то, что требует опекуна.', 'Dari K-ETA sampai SIM dan kartu transportasi — dipisah antara cukup paspor dan perlu wali.']
  },
  transit: {
    title: ['교통·결제 — 카드 없이도 움직이는 법', 'Transit & payment — moving without a card', '交通·支付——没有卡也能走', '交通·決済 — カードなしで動く方法', 'Transporte y pago: moverse sin tarjeta', 'Di chuyển & thanh toán — đi lại khi không có thẻ', 'Transport et paiement : se déplacer sans carte', 'Transporte e pagamento: andar sem cartão', 'Транспорт и оплата — как ездить без карты', 'Transportasi & pembayaran — bergerak tanpa kartu'],
    desc: ['기후동행카드 단기권·티머니·택시·KTX·따릉이. 요금과 제외 구간까지 앱 안에서 확인하세요.', 'Climate Card short pass, T-money, taxis, KTX, bikes — fares and exclusions in one place.', '气候同行卡短期券、T-money、出租车、KTX、共享单车。票价与不适用区间都在应用内。', '気候同行カード短期券・T-money・タクシー・KTX・タルンイ。運賃と除外区間までアプリ内で。', 'Pase corto Climate Card, T-money, taxis, KTX y bicis: tarifas y exclusiones dentro de la app.', 'Vé ngắn Climate Card, T-money, taxi, KTX, xe đạp — giá và phạm vi loại trừ ngay trong app.', 'Pass court Climate Card, T-money, taxis, KTX, vélos : tarifs et exclusions dans l’app.', 'Passe curto Climate Card, T-money, táxi, KTX e bikes: tarifas e exclusões no app.', 'Короткий проездной Climate Card, T-money, такси, KTX, велосипеды — тарифы и исключения в приложении.', 'Pass pendek Climate Card, T-money, taksi, KTX, sepeda — tarif dan pengecualian di aplikasi.']
  },
  stay: {
    title: ['숙소·짐 — 미성년이 막히는 지점', 'Stay & luggage — where minors get stopped', '住宿·行李——未成年人受阻之处', '宿泊・荷物 — 未成年が止まる所', 'Alojamiento y equipaje: donde se bloquean los menores', 'Lưu trú & hành lý — chỗ người chưa thành niên bị chặn', 'Logement et bagages : là où les mineurs bloquent', 'Hospedagem e bagagem: onde menores travam', 'Жильё и багаж — где останавливают несовершеннолетних', 'Penginapan & bagasi — titik anak di bawah umur terhambat'],
    desc: ['보호자 동의서 서류, 유스호스텔, 짐 배송 시간표, 심야 출입 제한까지.', 'Guardian documents, youth hostels, luggage delivery timetables and late-night entry rules.', '监护人同意文件、青年旅舍、行李配送时间表、深夜出入限制。', '保護者の同意書類、ユースホステル、荷物配送の時刻表、深夜入場制限まで。', 'Documentos del tutor, albergues juveniles, horarios de equipaje y reglas nocturnas.', 'Giấy tờ người giám hộ, nhà nghỉ thanh niên, lịch gửi hành lý và quy định đêm.', 'Documents du tuteur, auberges, horaires de bagages et règles nocturnes.', 'Documentos do responsável, albergues, horários de bagagem e regras noturnas.', 'Документы опекуна, хостелы, расписание доставки багажа и ночные ограничения.', 'Dokumen wali, hostel remaja, jadwal kirim bagasi, dan aturan malam.']
  },
  tickets: {
    title: ['콘서트·공연 예매 — 글로벌 창구부터', 'Concert tickets — start with the global windows', '演唱会·演出购票——先从全球窗口开始', 'コンサート・公演予約 — 海外窓口から', 'Entradas de conciertos: empieza por las ventanillas globales', 'Vé concert — bắt đầu từ cửa quốc tế', 'Billets de concert : commencez par les guichets internationaux', 'Ingressos de shows: comece pelas janelas globais', 'Билеты на концерты — начните с глобальных окон', 'Tiket konser — mulai dari kanal global'],
    desc: ['NOL World·멜론글로벌·YES24 English·Ticketlink Global·KOPIS. 여권 인증·현장 수령·관람연령 규정까지 10단계로.', 'NOL World, Melon Global, YES24 English, Ticketlink Global and KOPIS — with passport verification, on-site pickup and age rules in 10 steps.', 'NOL World、Melon 全球、YES24 English、Ticketlink Global、KOPIS。护照认证、现场取票、观演年龄，10 步读完。', 'NOL World・Melonグローバル・YES24 English・Ticketlink Global・KOPIS。パスポート認証・当日受取・年齢規定まで10ステップ。', 'NOL World, Melon Global, YES24 English, Ticketlink Global y KOPIS, con verificación, recogida y edades en 10 pasos.', 'NOL World, Melon Global, YES24 English, Ticketlink Global và KOPIS — xác minh hộ chiếu, nhận vé, độ tuổi trong 10 bước.', 'NOL World, Melon Global, YES24 English, Ticketlink Global et KOPIS : vérification, retrait sur place et âges en 10 étapes.', 'NOL World, Melon Global, YES24 English, Ticketlink Global e KOPIS — verificação, retirada e idades em 10 passos.', 'NOL World, Melon Global, YES24 English, Ticketlink Global и KOPIS — проверка, получение и возраст за 10 шагов.', 'NOL World, Melon Global, YES24 English, Ticketlink Global, dan KOPIS — verifikasi, ambil tiket, usia dalam 10 langkah.']
  },
  food: {
    title: ['순수 관광객 맛집 지도', 'Traveller-only food map', '纯游客美食地图', '純観光客のグルメ地図', 'Mapa gastronómico solo de viajeros', 'Bản đồ ăn uống thuần du khách', 'Carte gourmande des voyageurs', 'Mapa gastronômico de viajantes', 'Гастрокарта только для путешественников', 'Peta kuliner khusus pelancong'],
    desc: ['광고도 인플루언서도 없습니다. 관광객이 남긴 별점과 실용 태그(혼밥·영어 메뉴·카드·맵기)만 담았습니다.', 'No ads, no influencers — only traveller ratings and practical tags (solo, English menu, card, spice).', '没有广告，也没有网红。只有游客留下的评分和实用标签（一人食、英文菜单、刷卡、辣度）。', '広告もインフルエンサーもなし。旅行者の評価と実用タグ（一人可・英語メニュー・カード・辛さ）だけ。', 'Sin anuncios ni influencers: solo valoraciones de viajeros y etiquetas prácticas (solo, menú inglés, tarjeta, picante).', 'Không quảng cáo, không influencer — chỉ đánh giá của du khách và thẻ thực dụng (ăn một mình, menu tiếng Anh, thẻ, độ cay).', 'Ni pub ni influenceurs : seulement notes de voyageurs et tags pratiques (solo, menu anglais, carte, piquant).', 'Sem anúncios nem influencers: só notas de viajantes e tags práticas (sozinho, menu em inglês, cartão, picância).', 'Без рекламы и инфлюенсеров: только оценки путешественников и практичные метки (один, меню на английском, карта, острота).', 'Tanpa iklan dan influencer: hanya penilaian pelancong dan tag praktis (makan sendiri, menu Inggris, kartu, pedas).']
  },
  goods: {
    title: ['한국 장인 굿즈 · 응급 안전망', 'Korean craft goods & safety net', '韩国匠人商品·安全网', '韓国職人グッズ・安心網', 'Artesanía coreana y red de seguridad', 'Quà thủ công Hàn Quốc & an toàn', 'Artisanat coréen et filet de sécurité', 'Artesanato coreano e rede de segurança', 'Корейские ремёсла и сеть безопасности', 'Kriya Korea & jaringan aman'],
    desc: ['공예정원·K-헤리티지 스토어·뮷즈 — 작가 이름이 붙은 실제 판로. 함께 112·119·1330·1345·E-Gen을 한 화면에.', 'Craft Garden, K-Heritage Store and Museum Shop — real channels with maker names, plus 112·119·1330·1345·E-Gen on one screen.', '工艺庭院、K-Heritage Store、博物馆店——有作者名字的真实渠道。并附 112·119·1330·1345·E-Gen。', '工芸庭園・K-ヘリテージストア・ミュージアムショップ — 作家名のある実際の販路。112・119・1330・1345・E-Gen も同じ画面に。', 'Craft Garden, K-Heritage Store y Museum Shop: canales reales con nombre de autor, más 112·119·1330·1345·E-Gen.', 'Craft Garden, K-Heritage Store và Museum Shop — kênh thật có tên tác giả, kèm 112·119·1330·1345·E-Gen.', 'Craft Garden, K-Heritage Store et Museum Shop : de vrais canaux avec le nom des artisans, plus 112·119·1330·1345·E-Gen.', 'Craft Garden, K-Heritage Store e Museum Shop: canais reais com nome do artesão, mais 112·119·1330·1345·E-Gen.', 'Craft Garden, K-Heritage Store и Museum Shop — реальные каналы с именами мастеров, плюс 112·119·1330·1345·E-Gen.', 'Craft Garden, K-Heritage Store, dan Museum Shop — kanal nyata dengan nama perajin, plus 112·119·1330·1345·E-Gen.']
  }
};

/* ── 공통 라벨 ──────────────────────────────────────────────────── */
export const JLABEL: Record<'railHint' | 'badgeLegend' | 'verified' | 'bypassTitle' | 'openLink' | 'priceNote', L10> = {
  railHint: [
    '여정 순서대로 — 칸을 누르면 그 구간으로 이동합니다',
    'In journey order — tap a step to jump there',
    '按行程顺序——点一格即跳转',
    '旅の順番 — タップでその区間へ',
    'En orden de viaje: toca un paso para ir allí',
    'Theo thứ tự hành trình — chạm để đến mục đó',
    'Dans l’ordre du voyage : touchez une étape',
    'Na ordem da viagem: toque para ir até lá',
    'В порядке поездки — нажмите, чтобы перейти',
    'Sesuai urutan perjalanan — ketuk untuk menuju'
  ],
  badgeLegend: [
    '인증 뱃지 — 실행 전에 확인하세요',
    'Auth badges — check before you act',
    '认证标签——先看再做',
    '認証バッジ — 実行前に確認',
    'Etiquetas de identificación: mira antes de actuar',
    'Nhãn xác minh — xem trước khi làm',
    'Badges d’identité : à vérifier avant d’agir',
    'Selos de identificação: veja antes de agir',
    'Метки доступа — проверьте до действия',
    'Label verifikasi — cek sebelum bertindak'
  ],
  verified: [
    '2026-11 확인', 'verified 2026-11', '2026-11 核实', '2026-11 確認', 'verificado 2026-11',
    'xác minh 2026-11', 'vérifié 2026-11', 'verificado 2026-11', 'проверено 2026-11', 'terverifikasi 2026-11'
  ],
  bypassTitle: [
    '막히면 이렇게', 'If you get blocked', '卡住时这样做', '詰まったときは', 'Si te bloquean',
    'Nếu bị chặn', 'Si vous êtes bloqué', 'Se travar', 'Если не пускают', 'Kalau terhambat'
  ],
  openLink: [
    '열기', 'Open', '打开', '開く', 'Abrir', 'Mở', 'Ouvrir', 'Abrir', 'Открыть', 'Buka'
  ],
  priceNote: [
    '가격·영업시간은 바뀔 수 있습니다. 방문 전 지도에서 확인하세요.',
    'Prices and hours change — check the map before you go.',
    '价格与营业时间可能变动，出发前请在地图确认。',
    '価格・営業時間は変わります。訪問前に地図で確認を。',
    'Los precios y horarios cambian: confirma en el mapa antes de ir.',
    'Giá và giờ mở cửa có thể đổi — kiểm tra bản đồ trước khi đến.',
    'Prix et horaires changent : vérifiez sur la carte avant d’y aller.',
    'Preços e horários mudam: confirme no mapa antes de ir.',
    'Цены и часы меняются — проверьте на карте перед визитом.',
    'Harga dan jam bisa berubah — cek peta sebelum datang.'
  ]
};

/* ── 01 입국·공항 ───────────────────────────────────────────────── */
export const ARRIVAL: Card[] = [
  {
    id: 'keta', icon: '🛂', badge: 'passport', verified: true,
    title: ['K-ETA (전자여행허가)', 'K-ETA (electronic travel permit)', 'K-ETA（电子旅行许可）', 'K-ETA（電子渡航許可）', 'K-ETA (permiso electrónico)', 'K-ETA (giấy phép điện tử)', 'K-ETA (autorisation électronique)', 'K-ETA (autorização eletrônica)', 'K-ETA (электронное разрешение)', 'K-ETA (izin perjalanan elektronik)'],
    body: ['17세 이하와 65세 이상은 신청 대상에서 제외됩니다(여권만 있으면 됩니다). 수수료 1만 원·유효 3년·심사 최대 72시간. 수수료를 더 받는 유사 대행 사이트를 조심하세요.', 'Under 17 and over 65 do not apply at all — a passport is enough. Fee ₩10,000, valid 3 years, up to 72 hours to process. Avoid look-alike agencies charging extra.', '17 岁以下与 65 岁以上无需申请（有护照即可）。费用 1 万韩元、有效期 3 年、审核最长 72 小时。小心加收费用的仿冒代办网站。', '17歳以下・65歳以上は申請不要（パスポートのみ）。手数料1万ウォン・有効3年・審査最大72時間。追加手数料を取る類似サイトに注意。', 'Menores de 17 y mayores de 65 no lo necesitan: basta el pasaporte. Tasa ₩10.000, válido 3 años, hasta 72 h. Cuidado con agencias falsas que cobran de más.', 'Dưới 17 và trên 65 tuổi không cần nộp (chỉ cần hộ chiếu). Phí 10.000 KRW, hiệu lực 3 năm, xét tối đa 72 giờ. Cẩn thận trang giả thu thêm phí.', 'Moins de 17 ans et plus de 65 ans : inutile, le passeport suffit. Frais 10 000 ₩, valable 3 ans, jusqu’à 72 h. Méfiez-vous des faux sites qui majorent.', 'Menores de 17 e maiores de 65 não precisam: basta o passaporte. Taxa ₩10.000, válido 3 anos, até 72 h. Cuidado com sites falsos que cobram a mais.', 'До 17 и после 65 лет не нужно — достаточно паспорта. Сбор 10 000 вон, срок 3 года, до 72 часов. Остерегайтесь двойников-посредников.', 'Di bawah 17 dan di atas 65 tahun tidak perlu — cukup paspor. Biaya ₩10.000, berlaku 3 tahun, proses hingga 72 jam. Waspadai situs tiruan.'],
    url: 'https://www.k-eta.go.kr', urlName: 'k-eta.go.kr'
  },
  {
    id: 'earrival', icon: '📝', badge: 'none', verified: true,
    title: ['전자입국신고서', 'e-Arrival Card', '电子入境申报', '電子入国申告書', 'Declaración de llegada electrónica', 'Khai báo nhập cảnh điện tử', 'Carte d’arrivée électronique', 'Declaração de chegada eletrônica', 'Электронная карта прибытия', 'Kartu kedatangan elektronik'],
    body: ['도착 3일 전부터 무료로 온라인 작성. 항공권을 예약할 때 함께 신청되는 경우가 많으니, 이미 냈다면 중복 작성하지 마세요.', 'Free online from three days before arrival. Airlines often file it with your ticket — do not submit twice.', '抵达前 3 天起可免费在线填写。订机票时常一并申请，已办过就无需重复。', '到着3日前から無料でオンライン記入。航空券予約時に同時申請されることが多いので、済んでいれば重複提出は不要。', 'Gratis en línea desde 3 días antes. Las aerolíneas suelen tramitarla con el billete: no la dupliques.', 'Miễn phí trực tuyến từ 3 ngày trước khi đến. Hãng bay thường làm cùng vé — đừng khai hai lần.', 'Gratuit en ligne dès 3 jours avant. Les compagnies le font souvent avec le billet : ne doublez pas.', 'Grátis online a partir de 3 dias antes. As companhias costumam fazer junto com a passagem — não duplique.', 'Бесплатно онлайн за 3 дня. Авиакомпании часто оформляют вместе с билетом — не подавайте дважды.', 'Gratis online mulai 3 hari sebelum tiba. Maskapai sering mengurusnya bersama tiket — jangan ganda.'],
    url: 'https://www.e-arrivalcard.go.kr', urlName: 'e-arrivalcard.go.kr'
  },
  {
    id: 'smartpass', icon: '🙂', badge: 'guardian', verified: true,
    title: ['스마트패스 (얼굴로 출국)', 'Smart Pass (face-based departure)', '智能通行（刷脸出境）', 'スマートパス（顔で出国）', 'Smart Pass (salida con rostro)', 'Smart Pass (xuất cảnh bằng khuôn mặt)', 'Smart Pass (départ par visage)', 'Smart Pass (saída por rosto)', 'Smart Pass (выход по лицу)', 'Smart Pass (keberangkatan via wajah)'],
    body: ['만 7세 이상 등록할 수 있고, 14세 미만은 법정대리인 동의가 필요합니다. 한 번 등록하면 5년간 쓸 수 있습니다.', 'Available from age 7; under 14 needs a legal guardian’s consent. One registration lasts five years.', '7 岁以上可登记，14 岁以下需法定代理人同意。登记一次可用 5 年。', '7歳以上で登録可、14歳未満は法定代理人の同意が必要。一度の登録で5年使えます。', 'Desde los 7 años; menores de 14 necesitan consentimiento del tutor. Un registro dura cinco años.', 'Từ 7 tuổi; dưới 14 cần người giám hộ đồng ý. Đăng ký một lần dùng 5 năm.', 'Dès 7 ans ; moins de 14 ans : accord du tuteur. Un enregistrement vaut cinq ans.', 'A partir dos 7 anos; menores de 14 precisam do responsável. Um cadastro vale cinco anos.', 'С 7 лет; до 14 — согласие опекуна. Одна регистрация на пять лет.', 'Dari usia 7; di bawah 14 perlu izin wali. Satu pendaftaran berlaku lima tahun.'],
    url: 'https://airport.kr/ap_ko/889/subview.do', urlName: 'airport.kr'
  },
  {
    id: 'sim', icon: '📶', badge: 'passport', verified: true,
    title: ['유심·eSIM', 'SIM & eSIM', '手机卡·eSIM', 'SIM・eSIM', 'SIM y eSIM', 'SIM & eSIM', 'SIM et eSIM', 'SIM e eSIM', 'SIM и eSIM', 'SIM & eSIM'],
    body: ['여권만으로 개통하는 선불 eSIM·유심과, 휴대폰 본인인증이 필요한 정액 요금제를 구분하세요. 무인 키오스크는 여권만 있으면 바로 됩니다.', 'Prepaid eSIM/SIM activates with a passport; monthly plans need Korean phone verification. Unmanned kiosks only ask for your passport.', '预付费 eSIM/SIM 凭护照即可开通；包月套餐需手机本人认证。无人柜台只需护照。', 'プリペイド eSIM・SIM はパスポートで開通、定額プランは本人認証が必要。無人キオスクはパスポートのみ。', 'La eSIM/SIM prepago se activa con pasaporte; los planes mensuales piden verificación coreana. Los kioscos solo piden pasaporte.', 'eSIM/SIM trả trước kích hoạt bằng hộ chiếu; gói tháng cần xác minh số Hàn. Ki-ốt tự động chỉ cần hộ chiếu.', 'L’eSIM/SIM prépayée s’active au passeport ; les forfaits exigent une vérification coréenne. Les bornes ne demandent que le passeport.', 'eSIM/SIM pré-pago ativa com passaporte; planos mensais exigem verificação coreana. Quiosques pedem só o passaporte.', 'Предоплатные eSIM/SIM подключают по паспорту; тарифы требуют корейской проверки. Автоматы просят только паспорт.', 'eSIM/SIM prabayar aktif dengan paspor; paket bulanan perlu verifikasi Korea. Kios mandiri cukup paspor.'],
    url: 'https://roaming.kt.com', urlName: 'roaming.kt.com'
  },
  {
    id: 'wowpass', icon: '💳', badge: 'passport', verified: true,
    title: ['WOWPASS — 나이 제한 없음', 'WOWPASS — no age limit', 'WOWPASS——无年龄限制', 'WOWPASS — 年齢制限なし', 'WOWPASS: sin límite de edad', 'WOWPASS — không giới hạn tuổi', 'WOWPASS : sans limite d’âge', 'WOWPASS: sem limite de idade', 'WOWPASS — без возрастных ограничений', 'WOWPASS — tanpa batas usia'],
    body: ['여권만으로 5,000원에 발급하고, 전국 키오스크 446대에서 외화를 원화로 충전합니다. 티머니 학생·어린이 요금이 적용되고, 남은 잔액은 환불됩니다. 무카드 미성년의 첫 결제수단으로 가장 현실적입니다.', 'Issued for ₩5,000 with a passport; 446 kiosks nationwide load foreign cash into won. Student and child T-money fares apply and the balance is refundable — the most practical first card for a minor without one.', '凭护照 5,000 韩元即可办理，全国 446 台机器把外币充成韩元。适用 T-money 学生·儿童票价，余额可退。是无卡未成年人最现实的第一张卡。', 'パスポートだけで5,000ウォンで発行、全国446台のキオスクで外貨をウォンにチャージ。T-money の学生・こども運賃が適用され、残高は返金可。カードのない未成年の最初の一枚に最適。', 'Se emite por ₩5.000 con pasaporte y 446 kioscos cargan efectivo extranjero en wones. Aplica tarifas T-money de estudiante e infantil y el saldo se devuelve: la primera tarjeta más realista para un menor sin tarjeta.', 'Phát hành 5.000 KRW với hộ chiếu; 446 ki-ốt toàn quốc nạp ngoại tệ thành won. Áp dụng giá T-money học sinh, trẻ em và hoàn số dư — tấm thẻ đầu tiên thực tế nhất cho người chưa thành niên không có thẻ.', 'Émise pour 5 000 ₩ au passeport ; 446 bornes chargent les devises en wons. Tarifs T-money étudiant et enfant appliqués, solde remboursable : la première carte la plus réaliste pour un mineur sans carte.', 'Emitido por ₩5.000 com passaporte; 446 quiosques carregam moeda estrangeira em wons. Aplica tarifas T-money de estudante e infantil, saldo reembolsável — o primeiro cartão mais realista para menor sem cartão.', 'Выпуск за 5 000 вон по паспорту; 446 автоматов по стране зачисляют валюту в воны. Действуют детские и студенческие тарифы T-money, остаток возвращается — самый реальный первый вариант для подростка без карты.', 'Terbit ₩5.000 dengan paspor; 446 kios di seluruh negeri mengisi valuta asing jadi won. Tarif T-money pelajar dan anak berlaku, saldo bisa ditarik — kartu pertama paling masuk akal bagi remaja tanpa kartu.'],
    url: 'https://wowpass.io/en', urlName: 'wowpass.io'
  },
  {
    id: 'namane', icon: '🪪', badge: 'passport', verified: true,
    title: ['NAMANE 선불카드', 'NAMANE prepaid card', 'NAMANE 预付卡', 'NAMANE プリペイドカード', 'Tarjeta NAMANE', 'Thẻ trả trước NAMANE', 'Carte prépayée NAMANE', 'Cartão pré-pago NAMANE', 'Карта NAMANE', 'Kartu prabayar NAMANE'],
    body: ['여권을 등록해 쓰는 관광객용 선불카드. 공항·명동 키오스크에서 바로 발급하고, 교통과 매장 결제에 함께 쓸 수 있습니다.', 'A visitor prepaid card registered with your passport. Issued at airport and Myeongdong kiosks and usable for transit and shops.', '以护照登记的游客预付卡，可在机场·明洞机器即时办理，交通与门店都能用。', 'パスポート登録の旅行者向けプリペイドカード。空港・明洞のキオスクで発行、交通と店舗決済に使えます。', 'Tarjeta de visitante registrada con pasaporte. Se emite en kioscos del aeropuerto y Myeongdong y sirve para transporte y tiendas.', 'Thẻ trả trước cho du khách đăng ký bằng hộ chiếu. Phát hành tại ki-ốt sân bay và Myeongdong, dùng cho giao thông và cửa hàng.', 'Carte visiteur enregistrée au passeport, délivrée aux bornes de l’aéroport et de Myeongdong, utilisable dans les transports et les commerces.', 'Cartão de visitante registrado com passaporte. Emitido em quiosques do aeroporto e Myeongdong, serve para transporte e lojas.', 'Гостевая карта с регистрацией по паспорту. Выдаётся в автоматах аэропорта и Мёндона, годится для транспорта и магазинов.', 'Kartu prabayar wisatawan dengan pendaftaran paspor. Terbit di kios bandara dan Myeongdong, bisa untuk transportasi dan toko.'],
    url: 'https://namanecard.com/en', urlName: 'namanecard.com'
  },
  {
    id: 'arex', icon: '🚄', badge: 'none', verified: true,
    title: ['공항철도·리무진', 'Airport Railroad & limousine', '机场铁路·大巴', '空港鉄道・リムジン', 'Tren y limusina del aeropuerto', 'Tàu & xe limousine sân bay', 'Train et navette de l’aéroport', 'Trem e limusine do aeroporto', 'Аэропоезд и лимузин', 'Kereta & limusin bandara'],
    body: ['AREX 직통은 인천공항→서울역 약 43분, 일반열차는 더 저렴합니다. 리무진 6006번은 잠실까지 약 80분. 자정 이후에는 올빼미버스 N13·N32를 이용하세요.', 'AREX non-stop takes about 43 min to Seoul Station; the all-stop train is cheaper. Limousine 6006 reaches Jamsil in about 80 min. After midnight take Night Owl N13/N32.', 'AREX 直达约 43 分钟到首尔站，普通列车更便宜。6006 大巴到蚕室约 80 分钟。午夜后乘 N13·N32 夜巴。', 'AREX 直通は仁川空港→ソウル駅 約43分、一般列車はより安価。リムジン6006番は蚕室まで約80分。深夜は N13・N32。', 'El AREX directo tarda unos 43 min a Seúl; el tren con paradas es más barato. La limusina 6006 llega a Jamsil en unos 80 min. Tras medianoche, N13/N32.', 'AREX thẳng khoảng 43 phút đến ga Seoul; tàu thường rẻ hơn. Limousine 6006 đến Jamsil khoảng 80 phút. Sau nửa đêm đi N13/N32.', 'L’AREX direct met environ 43 min jusqu’à Séoul ; le train omnibus coûte moins. La navette 6006 rejoint Jamsil en 80 min. Après minuit : N13/N32.', 'O AREX direto leva uns 43 min até Seul; o trem parador é mais barato. A limusine 6006 chega a Jamsil em ~80 min. Após a meia-noite, N13/N32.', 'AREX без остановок — около 43 минут до Сеула, обычный поезд дешевле. Лимузин 6006 до Чамсиля ~80 минут. После полуночи — N13/N32.', 'AREX langsung sekitar 43 menit ke Seoul Station; kereta biasa lebih murah. Limusin 6006 ke Jamsil sekitar 80 menit. Lewat tengah malam pakai N13/N32.'],
    url: 'https://www.airportrailroad.com', urlName: 'airportrailroad.com'
  }
];

/* ── 02 교통·결제 ───────────────────────────────────────────────── */
export const TRANSIT: Card[] = [
  {
    id: 'climate', icon: '🌿', badge: 'passport', verified: true,
    title: ['기후동행카드 단기권', 'Climate Card short pass', '气候同行卡短期券', '気候同行カード短期券', 'Pase corto Climate Card', 'Vé ngắn Climate Card', 'Pass court Climate Card', 'Passe curto Climate Card', 'Короткий Climate Card', 'Pass pendek Climate Card'],
    body: ['1일 5,000 / 2일 8,000 / 3일 10,000 / 5일 15,000 / 7일 20,000원. 2026-03-17부터 해외 발행 카드로 구매·충전됩니다. 서울 지하철과 인천공항 하차, 서울 면허 버스(심야 포함)까지. 신분당선·GTX·광역버스, 따릉이·한강버스는 제외입니다.', '₩5,000/1 day, ₩8,000/2, ₩10,000/3, ₩15,000/5, ₩20,000/7. From 2026-03-17 foreign-issued cards can buy and top it up. Covers Seoul metro, Incheon Airport exit and Seoul-licensed buses (including late night). Excludes Shinbundang, GTX, intercity buses, Ttareungi and the Hangang Bus.', '1 日 5,000／2 日 8,000／3 日 10,000／5 日 15,000／7 日 20,000 韩元。2026-03-17 起可用海外发行卡购买·充值。含首尔地铁、仁川机场下车、首尔牌照巴士（含深夜）。新盆唐线、GTX、广域巴士、共享单车、汉江巴士不适用。', '1日5,000／2日8,000／3日10,000／5日15,000／7日20,000ウォン。2026-03-17から海外発行カードで購入・チャージ可。ソウル地下鉄・仁川空港降車・ソウル免許バス（深夜含む）まで。新盆唐線・GTX・広域バス・タルンイ・漢江バスは対象外。', '₩5.000/1 día, ₩8.000/2, ₩10.000/3, ₩15.000/5, ₩20.000/7. Desde el 2026-03-17 se compra y recarga con tarjetas extranjeras. Cubre metro de Seúl, salida de Incheon y buses con licencia de Seúl (de noche también). Excluye Shinbundang, GTX, buses interurbanos, Ttareungi y Hangang Bus.', '5.000/1 ngày, 8.000/2, 10.000/3, 15.000/5, 20.000/7 KRW. Từ 17-03-2026 mua và nạp được bằng thẻ nước ngoài. Gồm tàu điện Seoul, ga sân bay Incheon và buýt cấp phép Seoul (kể cả đêm). Loại trừ Shinbundang, GTX, buýt liên tỉnh, Ttareungi và buýt Hangang.', '5 000 ₩/1 j, 8 000/2, 10 000/3, 15 000/5, 20 000/7. Depuis le 17-03-2026, achat et recharge par carte étrangère. Couvre le métro de Séoul, la sortie d’Incheon et les bus sous licence de Séoul (nuit incluse). Exclut Shinbundang, GTX, bus interurbains, Ttareungi et Hangang Bus.', '₩5.000/1 dia, ₩8.000/2, ₩10.000/3, ₩15.000/5, ₩20.000/7. Desde 17-03-2026 compra e recarga com cartão estrangeiro. Vale para metrô de Seul, saída de Incheon e ônibus licenciados de Seul (inclusive à noite). Fora: Shinbundang, GTX, ônibus intermunicipais, Ttareungi e Hangang Bus.', '5 000 вон/1 день, 8 000/2, 10 000/3, 15 000/5, 20 000/7. С 17.03.2026 покупка и пополнение зарубежной картой. Действует в метро Сеула, при выходе в Инчхоне и в сеульских автобусах (включая ночные). Не действует: Shinbundang, GTX, междугородние, Ttareungi и Hangang Bus.', '₩5.000/1 hari, ₩8.000/2, ₩10.000/3, ₩15.000/5, ₩20.000/7. Mulai 17-03-2026 bisa dibeli dan diisi dengan kartu asing. Berlaku di MRT Seoul, keluar di Bandara Incheon, dan bus berlisensi Seoul (termasuk malam). Tidak berlaku: Shinbundang, GTX, bus antarkota, Ttareungi, Hangang Bus.'],
    url: 'https://news.seoul.go.kr/traffic/archives/510651', urlName: 'seoul.go.kr'
  },
  {
    id: 'tmoney', icon: '🚌', badge: 'none', verified: true,
    title: ['티머니 실물카드', 'T-money card', 'T-money 实体卡', 'T-money カード', 'Tarjeta T-money', 'Thẻ T-money', 'Carte T-money', 'Cartão T-money', 'Карта T-money', 'Kartu T-money'],
    body: ['편의점·발매기에서 2,500~4,000원에 사서 충전합니다. 서울 밖 부산·경주·제주로 갈 때는 기후동행카드보다 티머니가 낫습니다.', 'Buy for ₩2,500–4,000 at convenience stores or vending machines, then top up. Outside Seoul — Busan, Gyeongju, Jeju — T-money beats the Climate Card.', '在便利店·售票机以 2,500~4,000 韩元购买并充值。去首尔以外的釜山、庆州、济州时，T-money 比气候同行卡更合适。', 'コンビニ・券売機で2,500〜4,000ウォンで購入しチャージ。ソウル外の釜山・慶州・済州へは気候同行カードより T-money が便利。', 'Cómprala por ₩2.500–4.000 en tiendas o máquinas y recarga. Fuera de Seúl (Busan, Gyeongju, Jeju), T-money es mejor que Climate Card.', 'Mua 2.500–4.000 KRW ở cửa hàng hoặc máy bán vé rồi nạp. Ra ngoài Seoul (Busan, Gyeongju, Jeju), T-money tốt hơn Climate Card.', 'Achetez 2 500–4 000 ₩ en supérette ou borne, puis rechargez. Hors de Séoul (Busan, Gyeongju, Jeju), T-money vaut mieux que Climate Card.', 'Compre por ₩2.500–4.000 em lojas ou máquinas e recarregue. Fora de Seul (Busan, Gyeongju, Jeju), o T-money é melhor que o Climate Card.', 'Покупайте за 2 500–4 000 вон в магазинах или автоматах и пополняйте. Вне Сеула (Пусан, Кёнджу, Чеджу) T-money удобнее Climate Card.', 'Beli ₩2.500–4.000 di toko atau mesin, lalu isi ulang. Di luar Seoul (Busan, Gyeongju, Jeju), T-money lebih baik daripada Climate Card.'],
    url: 'https://www.tmoney.co.kr', urlName: 'tmoney.co.kr'
  },
  {
    id: 'kakaot', icon: '🚕', badge: 'guardian', verified: true,
    title: ['카카오T 택시', 'Kakao T taxi', 'Kakao T 出租车', 'Kakao T タクシー', 'Taxi Kakao T', 'Taxi Kakao T', 'Taxi Kakao T', 'Táxi Kakao T', 'Такси Kakao T', 'Taksi Kakao T'],
    body: ['웹에서는 호출되지 않고 앱 전용입니다. 해외 발행 카드를 등록할 수 있지만, 미성년은 단독 호출이 제한됩니다 — 역무원에게 말하거나 택시 승차장을 이용하세요.', 'App only — no web booking. Foreign cards can be registered, but minors cannot call one alone: ask station staff or use a taxi stand.', '只能通过应用叫车，网页不行。可绑定海外卡，但未成年人单独叫车受限——请找站务员或到出租车乘车点。', 'ウェブからは呼べずアプリ専用。海外カード登録は可能ですが、未成年の単独配車は制限されます — 駅員に伝えるかタクシー乗り場へ。', 'Solo app, sin web. Se pueden registrar tarjetas extranjeras, pero un menor no puede pedir uno solo: habla con el personal o usa la parada.', 'Chỉ app, không đặt qua web. Gắn được thẻ nước ngoài, nhưng người chưa thành niên không tự gọi được — nhờ nhân viên ga hoặc ra bến taxi.', 'App uniquement, pas de réservation web. Les cartes étrangères sont acceptées, mais un mineur ne peut pas commander seul : demandez au personnel ou prenez une station.', 'Só app, sem web. Dá para cadastrar cartão estrangeiro, mas menor não pode chamar sozinho: fale com a equipe da estação ou use o ponto de táxi.', 'Только приложение, без веба. Зарубежную карту можно привязать, но подросток не может вызвать такси один: обратитесь к сотруднику станции или на стоянку.', 'Hanya aplikasi, tanpa web. Kartu asing bisa didaftarkan, tapi anak di bawah umur tidak bisa memesan sendiri — minta petugas atau pakai pangkalan taksi.'],
    url: 'https://t.kakao.com', urlName: 'kakao T'
  },
  {
    id: 'uber', icon: '🚙', badge: 'passport', verified: true,
    title: ['우버', 'Uber', 'Uber', 'Uber', 'Uber', 'Uber', 'Uber', 'Uber', 'Uber', 'Uber'],
    body: ['외국 카드로 바로 호출됩니다. 인천공항에는 픽업 존이 따로 있고, 요금은 앱에 표시된 금액으로 끝납니다.', 'Call one with your foreign card. Incheon Airport has a dedicated pickup zone and the app price is the final price.', '可直接用海外卡叫车。仁川机场有专用上车点，价格按应用显示结算。', '海外カードですぐ配車。仁川空港には専用ピックアップゾーンがあり、料金はアプリ表示額で確定します。', 'Se pide con tarjeta extranjera. Incheon tiene zona de recogida propia y el precio del app es el final.', 'Gọi ngay bằng thẻ nước ngoài. Sân bay Incheon có khu đón riêng, giá trên app là giá cuối.', 'Commande avec une carte étrangère. Incheon a une zone de prise en charge dédiée et le prix de l’app est définitif.', 'Chame com cartão estrangeiro. Incheon tem área de embarque própria e o preço do app é o final.', 'Вызов по зарубежной карте. В Инчхоне отдельная зона посадки, цена в приложении окончательная.', 'Pesan dengan kartu asing. Bandara Incheon punya zona jemput khusus dan harga di aplikasi sudah final.'],
    url: 'https://www.uber.com/kr/en/', urlName: 'uber.com'
  },
  {
    id: 'korail', icon: '🚅', badge: 'passport', verified: true,
    title: ['KTX·SRT·KR Pass', 'KTX, SRT & KR Pass', 'KTX·SRT·KR Pass', 'KTX・SRT・KR Pass', 'KTX, SRT y KR Pass', 'KTX, SRT & KR Pass', 'KTX, SRT et KR Pass', 'KTX, SRT e KR Pass', 'KTX, SRT и KR Pass', 'KTX, SRT & KR Pass'],
    body: ['외국인은 코레일 영문 사이트에서 KR Pass(통권)를 살 수 있습니다. 부산·경주·전주는 KTX로 2~3시간대라 당일치기도 가능합니다.', 'Foreigners can buy a KR Pass on Korail’s English site. Busan, Gyeongju and Jeonju are 2–3 hours by KTX, so day trips work.', '外国人可在 Korail 英文站购买 KR Pass。釜山、庆州、全州乘 KTX 约 2~3 小时，当天往返也可行。', '外国人はコレイル英文サイトで KR Pass を購入できます。釜山・慶州・全州は KTX で2〜3時間台、日帰りも可能。', 'Los extranjeros pueden comprar el KR Pass en la web inglesa de Korail. Busan, Gyeongju y Jeonju quedan a 2–3 h en KTX: sirve para ir y volver el mismo día.', 'Người nước ngoài mua KR Pass trên trang tiếng Anh của Korail. Busan, Gyeongju, Jeonju cách 2–3 giờ bằng KTX, đi về trong ngày được.', 'Les étrangers achètent le KR Pass sur le site anglais de Korail. Busan, Gyeongju et Jeonju sont à 2–3 h en KTX : aller-retour possible dans la journée.', 'Estrangeiros compram o KR Pass no site em inglês da Korail. Busan, Gyeongju e Jeonju ficam a 2–3 h de KTX: dá para ir e voltar no dia.', 'Иностранцы покупают KR Pass на английском сайте Korail. Пусан, Кёнджу, Чонджу — 2–3 часа на KTX, можно съездить на день.', 'Warga asing bisa membeli KR Pass di situs Inggris Korail. Busan, Gyeongju, Jeonju 2–3 jam dengan KTX, bisa pulang-pergi sehari.'],
    url: 'https://www.korail.com/global/eng', urlName: 'korail.com'
  },
  {
    id: 'bike', icon: '🚲', badge: 'passport', verified: true,
    title: ['따릉이·한강버스', 'Ttareungi & the Hangang Bus', '共享单车·汉江巴士', 'タルンイ・漢江バス', 'Ttareungi y Hangang Bus', 'Ttareungi & buýt Hangang', 'Ttareungi et Hangang Bus', 'Ttareungi e Hangang Bus', 'Ttareungi и Hangang Bus', 'Ttareungi & Hangang Bus'],
    body: ['따릉이는 만 16세 이상, 앱에서 해외 카드로 결제합니다. 한강버스는 기후동행카드 단기권에 포함되지 않아 별도 요금입니다.', 'Ttareungi is 16+, paid in the app with a foreign card. The Hangang Bus is not covered by the Climate Card and charges separately.', '共享单车限 16 岁以上，应用内用海外卡支付。汉江巴士不含在气候同行卡内，需另付。', 'タルンイは16歳以上、アプリで海外カード決済。漢江バスは気候同行カード対象外で別料金です。', 'Ttareungi es desde 16 años y se paga en la app con tarjeta extranjera. El Hangang Bus no entra en el Climate Card: tarifa aparte.', 'Ttareungi từ 16 tuổi, trả bằng thẻ nước ngoài trong app. Buýt Hangang không thuộc Climate Card, phải trả riêng.', 'Ttareungi dès 16 ans, payé dans l’app par carte étrangère. Le Hangang Bus n’est pas couvert par Climate Card : tarif à part.', 'Ttareungi a partir de 16 anos, pago no app com cartão estrangeiro. O Hangang Bus não entra no Climate Card: tarifa separada.', 'Ttareungi с 16 лет, оплата в приложении зарубежной картой. Hangang Bus не входит в Climate Card — отдельный тариф.', 'Ttareungi dari 16 tahun, dibayar di aplikasi dengan kartu asing. Hangang Bus tidak termasuk Climate Card, tarif terpisah.'],
    url: 'https://bikeseoul.com', urlName: 'bikeseoul.com'
  },
  {
    id: 'night', icon: '🌙', badge: 'none', verified: true,
    title: ['심야 이동 — 올빼미버스', 'Late night — Night Owl buses', '深夜出行——猫头鹰巴士', '深夜移動 — 深夜バス', 'Noche: buses Night Owl', 'Đêm khuya — buýt Night Owl', 'Nuit : bus Night Owl', 'Madrugada: ônibus Night Owl', 'Ночь — автобусы Night Owl', 'Malam — bus Night Owl'],
    body: ['N13~N75가 23:00~06:00에 다닙니다. 공연이 끝나 택시 대기줄이 길면, 먼저 지하철 막차 시간과 첫차 시간을 확인하세요.', 'N13–N75 run 23:00–06:00. If the taxi queue is long after a show, check the last and first subway times first.', 'N13~N75 于 23:00~06:00 运行。演出散场后打车排队长，先查地铁末班车与首班车时间。', 'N13〜N75 が 23:00〜06:00 に運行。公演後タクシー待ちが長いときは、まず地下鉄の終電・始発を確認。', 'N13–N75 circulan de 23:00 a 06:00. Si la cola de taxis es larga tras el show, mira primero el último y el primer metro.', 'N13–N75 chạy 23:00–06:00. Nếu hàng taxi dài sau show, xem giờ tàu điện chuyến cuối và chuyến đầu trước.', 'N13–N75 circulent de 23 h à 6 h. Si la file de taxis est longue après un spectacle, vérifiez d’abord le dernier et le premier métro.', 'N13–N75 circulam das 23h às 6h. Se a fila de táxi estiver longa após o show, veja antes o último e o primeiro metrô.', 'N13–N75 ходят с 23:00 до 06:00. Если очередь на такси длинная, сначала проверьте последний и первый поезд метро.', 'N13–N75 beroperasi 23.00–06.00. Kalau antrean taksi panjang setelah konser, cek dulu MRT terakhir dan pertama.'],
    url: 'https://topis.seoul.go.kr', urlName: 'topis.seoul.go.kr'
  }
];

/* ── 03 숙소·짐 ─────────────────────────────────────────────────── */
export const STAY: Card[] = [
  {
    id: 'minorstay', icon: '🧾', badge: 'guardian', verified: true,
    title: ['미성년 숙박 서류', 'Accommodation documents for minors', '未成年人住宿文件', '未成年の宿泊書類', 'Documentos para menores', 'Giấy tờ lưu trú cho người chưa thành niên', 'Documents pour mineurs', 'Documentos para menores', 'Документы для несовершеннолетних', 'Dokumen menginap untuk anak di bawah umur'],
    body: ['보호자 동의서 + 보호자 신분증 사본 + 가족관계증명서가 필요합니다. 호텔마다 추가 제한이 있고(15세 이하 보호자 동반 필수 등), 이성 혼숙은 안 됩니다. 예약 전에 숙소에 직접 물어보세요.', 'Bring a guardian consent form, a copy of the guardian’s ID and a family relation certificate. Hotels add their own rules (some require a guardian under 15) and mixed-gender sharing is refused. Ask the property before booking.', '需要监护人同意书＋监护人身份证复印件＋家族关系证明。各家酒店另有规定（如 15 岁以下必须由监护人陪同），异性同住不被允许。预订前先问住宿方。', '保護者の同意書＋身分証コピー＋家族関係証明書が必要。ホテルごとに追加条件があり（15歳以下は保護者同伴必須など）、異性同室は不可。予約前に宿へ直接確認を。', 'Necesitas consentimiento del tutor, copia de su documento y certificado de relación familiar. Cada hotel añade reglas (algunos exigen tutor si tienes menos de 15) y no se permite compartir entre sexos. Pregunta antes de reservar.', 'Cần giấy đồng ý của người giám hộ + bản sao giấy tờ + giấy chứng nhận quan hệ gia đình. Mỗi khách sạn thêm quy định (một số bắt buộc có người giám hộ nếu dưới 15 tuổi) và không cho ở chung khác giới. Hỏi trước khi đặt.', 'Fournissez une autorisation du tuteur, une copie de sa pièce d’identité et un certificat de lien familial. Chaque hôtel ajoute ses règles (tuteur obligatoire avant 15 ans) et le partage mixte est refusé. Demandez avant de réserver.', 'Leve autorização do responsável, cópia do documento e certidão de relação familiar. Cada hotel acrescenta regras (alguns exigem responsável abaixo de 15 anos) e divisão entre sexos não é aceita. Pergunte antes de reservar.', 'Нужны согласие опекуна, копия его документа и справка о родстве. У отелей свои правила (до 15 лет — только с опекуном), совместное проживание разного пола запрещено. Спросите до брони.', 'Bawa surat izin wali, salinan identitas wali, dan surat keterangan hubungan keluarga. Tiap hotel punya aturan tambahan (di bawah 15 wajib didampingi wali) dan kamar campur lawan jenis tidak diizinkan. Tanya dulu sebelum memesan.'],
  },
  {
    id: 'bookingroute', icon: '🔎', badge: 'passport', verified: true,
    title: ['예약 경로 비교', 'Where to book', '预订渠道比较', '予約経路の比較', 'Dónde reservar', 'Đặt ở đâu', 'Où réserver', 'Onde reservar', 'Где бронировать', 'Di mana memesan'],
    body: ['해외 앱(Booking·Agoda)은 해외 카드로 예약됩니다. 국내 앱(야놀자·여기어때)은 국내 결제·본인인증이 필요합니다. 무카드 미성년은 해외 앱 + 보호자 카드 조합이 현실적입니다.', 'Booking and Agoda take foreign cards. Korean apps (Yanolja, Yeogi Eottae) need Korean payment and ID verification. For a minor with no card, a global app plus a guardian’s card is the practical route.', '海外应用（Booking·Agoda）可用海外卡预订。韩国应用（Yanolja、Yeogi Eottae）需韩国支付与本人认证。无卡未成年人用海外应用＋监护人卡最现实。', '海外アプリ（Booking・Agoda）は海外カードで予約可。韓国アプリ（ヤノルジャ・ヨギオッテ）は韓国決済・本人認証が必要。カードのない未成年は海外アプリ＋保護者カードが現実的。', 'Booking y Agoda aceptan tarjetas extranjeras. Las apps coreanas (Yanolja, Yeogi Eottae) piden pago y verificación coreana. Para un menor sin tarjeta: app global + tarjeta del tutor.', 'Booking và Agoda nhận thẻ nước ngoài. Ứng dụng Hàn (Yanolja, Yeogi Eottae) cần thanh toán và xác minh Hàn. Người chưa thành niên không có thẻ: app quốc tế + thẻ người giám hộ.', 'Booking et Agoda acceptent les cartes étrangères. Les apps coréennes (Yanolja, Yeogi Eottae) exigent paiement et vérification coréens. Pour un mineur sans carte : app internationale + carte du tuteur.', 'Booking e Agoda aceitam cartão estrangeiro. Apps coreanos (Yanolja, Yeogi Eottae) exigem pagamento e verificação coreanos. Para menor sem cartão: app global + cartão do responsável.', 'Booking и Agoda принимают зарубежные карты. Корейские приложения (Yanolja, Yeogi Eottae) требуют корейской оплаты и проверки. Подростку без карты — зарубежное приложение и карта опекуна.', 'Booking dan Agoda menerima kartu asing. Aplikasi Korea (Yanolja, Yeogi Eottae) perlu pembayaran dan verifikasi Korea. Untuk remaja tanpa kartu: aplikasi global + kartu wali.']
  },
  {
    id: 'hostel', icon: '🛏️', badge: 'guardian', verified: true,
    title: ['청소년 유스호스텔', 'Youth hostels', '青少年青年旅舍', '青少年ユースホステル', 'Albergues juveniles', 'Nhà nghỉ thanh niên', 'Auberges de jeunesse', 'Albergues juvenis', 'Молодёжные хостелы', 'Hostel remaja'],
    body: ['청소년활동진흥법에 근거한 시설로 지도사가 상주합니다. 보호자 동의서만 갖추면 1인 숙박이 되는 곳이 많아, 혼자 온 미성년에게 가장 안전한 선택입니다.', 'Facilities under the Youth Activity Promotion Act with resident instructors. Many accept a solo minor with just a guardian consent form — the safest option for someone travelling alone.', '依《青少年活动振兴法》设立、有指导员常驻。很多地方只需监护人同意书就能单人入住，是独自出行未成年人最安全的选择。', '青少年活動振興法に基づく施設で指導員が常駐。保護者の同意書だけで1人泊できる所が多く、一人旅の未成年に最も安全です。', 'Instalaciones de la Ley de Actividades Juveniles con monitores residentes. Muchos admiten a un menor solo con consentimiento del tutor: la opción más segura si viaja sin compañía.', 'Cơ sở theo Luật Phát triển Hoạt động Thanh niên, có hướng dẫn viên thường trú. Nhiều nơi chỉ cần giấy đồng ý của người giám hộ là nhận người chưa thành niên ở một mình — lựa chọn an toàn nhất.', 'Établissements issus de la loi sur les activités de jeunesse, avec animateurs sur place. Beaucoup acceptent un mineur seul avec l’autorisation du tuteur : l’option la plus sûre.', 'Estruturas da Lei de Atividades Juvenis com monitores residentes. Muitos aceitam menor sozinho só com autorização do responsável: a opção mais segura.', 'Учреждения по Закону о молодёжной деятельности с постоянными инструкторами. Многие принимают подростка одного только с согласием опекуна — самый безопасный вариант.', 'Fasilitas menurut UU Aktivitas Remaja dengan pembina tetap. Banyak menerima remaja sendirian hanya dengan surat izin wali — pilihan paling aman.']
  },
  {
    id: 'tluggage', icon: '🧳', badge: 'none', verified: true,
    title: ['짐 배송 T-Luggage', 'T-Luggage delivery', '行李配送 T-Luggage', '手荷物配送 T-Luggage', 'Envío de equipaje T-Luggage', 'Gửi hành lý T-Luggage', 'Livraison de bagages T-Luggage', 'Entrega de bagagem T-Luggage', 'Доставка багажа T-Luggage', 'Kirim bagasi T-Luggage'],
    body: ['서울역·홍대·명동·김포에서 09:00~12:00에 맡기면 공항에서 15:30~21:00에 찾습니다(T2는 16:30~21:00). 마지막 날 짐을 끌고 다니지 않아도 됩니다.', 'Drop at Seoul Station, Hongdae, Myeongdong or Gimpo between 09:00 and 12:00 and collect at the airport 15:30–21:00 (T2 16:30–21:00). No dragging bags on your last day.', '在首尔站、弘大、明洞、金浦 09:00~12:00 寄存，机场 15:30~21:00 领取（T2 为 16:30~21:00）。最后一天不必拖着行李。', 'ソウル駅・弘大・明洞・金浦で09:00〜12:00に預け、空港で15:30〜21:00に受取（T2は16:30〜21:00）。最終日に荷物を引きずらずに済みます。', 'Deja en Seúl, Hongdae, Myeongdong o Gimpo entre 09:00 y 12:00 y recoge en el aeropuerto 15:30–21:00 (T2 16:30–21:00). Sin arrastrar maletas el último día.', 'Gửi ở ga Seoul, Hongdae, Myeongdong, Gimpo 09:00–12:00 và nhận tại sân bay 15:30–21:00 (T2 16:30–21:00). Ngày cuối không phải kéo hành lý.', 'Déposez à Séoul, Hongdae, Myeongdong ou Gimpo entre 9 h et 12 h, retirez à l’aéroport de 15 h 30 à 21 h (T2 16 h 30–21 h). Plus de valises à traîner le dernier jour.', 'Deixe em Seul, Hongdae, Myeongdong ou Gimpo entre 09h e 12h e retire no aeroporto 15h30–21h (T2 16h30–21h). Sem arrastar malas no último dia.', 'Сдайте в Сеуле, Хондэ, Мёндоне или Кимпо с 09:00 до 12:00, получите в аэропорту 15:30–21:00 (T2 16:30–21:00). В последний день чемоданы не мешают.', 'Titipkan di Seoul Station, Hongdae, Myeongdong, atau Gimpo pukul 09.00–12.00 dan ambil di bandara 15.30–21.00 (T2 16.30–21.00). Hari terakhir tanpa menyeret koper.'],
    url: 'https://www.tluggage.co.kr', urlName: 'tluggage.co.kr'
  },
  {
    id: 'tlocker', icon: '🔐', badge: 'none', verified: true,
    title: ['T-Locker 물품보관함', 'T-Locker storage', 'T-Locker 储物柜', 'T-Locker ロッカー', 'Taquillas T-Locker', 'Tủ gửi đồ T-Locker', 'Consignes T-Locker', 'Armários T-Locker', 'Камеры хранения T-Locker', 'Loker T-Locker'],
    body: ['지하철 332개소에 5,511개 함이 있습니다. 소형은 2~4시간 기준 2,000~3,000원대이고, 앱에서 빈 함을 미리 찾을 수 있습니다.', '5,511 lockers at 332 subway stations. Small boxes run ₩2,000–3,000 for 2–4 hours, and the app shows which are free.', '地铁 332 处共 5,511 个柜子。小柜 2~4 小时约 2,000~3,000 韩元，应用可查空柜。', '地下鉄332か所に5,511個。小型は2〜4時間で2,000〜3,000ウォン台、アプリで空きを確認できます。', '5.511 taquillas en 332 estaciones. Las pequeñas cuestan ₩2.000–3.000 por 2–4 h y la app muestra las libres.', '5.511 tủ tại 332 ga tàu điện. Tủ nhỏ 2.000–3.000 KRW cho 2–4 giờ, app hiện tủ trống.', '5 511 casiers dans 332 stations. Les petits coûtent 2 000–3 000 ₩ pour 2–4 h et l’app indique les libres.', '5.511 armários em 332 estações. Os pequenos custam ₩2.000–3.000 por 2–4 h e o app mostra os livres.', '5 511 ячеек на 332 станциях метро. Малые — 2 000–3 000 вон за 2–4 часа, свободные видны в приложении.', '5.511 loker di 332 stasiun MRT. Yang kecil ₩2.000–3.000 untuk 2–4 jam dan aplikasi menunjukkan yang kosong.']
  },
  {
    id: 'nightrule', icon: '⏰', badge: 'guardian', verified: true,
    title: ['22:00~05:00 청소년 출입 제한', 'Minors barred 22:00–05:00', '22:00~05:00 限制未成年人进入', '22:00〜05:00 未成年入場制限', 'Menores: cierre 22:00–05:00', 'Hạn chế người chưa thành niên 22:00–05:00', 'Mineurs interdits de 22 h à 5 h', 'Menores barrados 22h–05h', 'Несовершеннолетним нельзя с 22:00 до 05:00', 'Anak di bawah umur dilarang 22.00–05.00'],
    body: ['찜질방·PC방·노래방은 22:00~05:00 청소년 출입이 제한됩니다(보호자 동반·동의서 예외). 콘서트가 22시 이후에 끝난다면 24시간 라운지나 유스호스텔을 미리 잡아 두세요.', 'Jjimjilbang, PC rooms and karaoke bars admit minors only until 22:00 and from 05:00 (with a guardian or a consent form as exceptions). If a show ends after 22:00, book a 24-hour lounge or youth hostel in advance.', '汗蒸房、PC 房、练歌房 22:00~05:00 限制未成年人进入（监护人陪同或同意书为例外）。演出 22 点后结束，请提前订 24 小时休息室或青年旅舍。', 'チムジルバン・PC房・カラオケは22:00〜05:00 未成年の入場が制限されます（保護者同伴・同意書は例外）。22時以降に終わる公演なら、24時間ラウンジやユースホステルを先に確保を。', 'Jjimjilbang, salas PC y karaoke solo admiten menores hasta las 22:00 y desde las 05:00 (con tutor o consentimiento). Si el show acaba después, reserva un lounge 24 h o albergue.', 'Jjimjilbang, phòng PC, karaoke chỉ nhận người chưa thành niên đến 22:00 và từ 05:00 (trừ khi có người giám hộ hoặc giấy đồng ý). Show kết thúc sau 22h thì đặt trước lounge 24h hoặc nhà nghỉ thanh niên.', 'Jjimjilbang, salles PC et karaoké n’admettent les mineurs que jusqu’à 22 h et à partir de 5 h (sauf tuteur ou autorisation). Si le spectacle finit après 22 h, réservez un lounge 24 h ou une auberge.', 'Jjimjilbang, lan houses e karaokê só aceitam menores até 22h e a partir das 5h (com responsável ou autorização). Se o show acabar depois, reserve um lounge 24h ou albergue.', 'Чимчильбан, компьютерные клубы и караоке пускают несовершеннолетних только до 22:00 и с 05:00 (кроме случая с опекуном или согласием). Если концерт заканчивается позже, заранее бронируйте круглосуточный лаунж или хостел.', 'Jjimjilbang, ruang PC, dan karaoke hanya menerima anak di bawah umur sampai 22.00 dan mulai 05.00 (kecuali dengan wali atau surat izin). Kalau konser selesai lewat 22.00, pesan lounge 24 jam atau hostel remaja.']
  }
];

/* ── "막히면 이렇게" 우회 노트 ──────────────────────────────────── */
export const BYPASS: L10[] = [
  ['국내 예매처는 한국 휴대폰 본인인증이 필요합니다. 글로벌 창구(NOL World·멜론글로벌)에서 먼저 확인하고, 그래도 안 되면 공연 당일 매표소에서 여권으로 현장 수령 재고를 물어보세요.',
   'Korean booking sites require Korean phone verification. Check the global windows first (NOL World, Melon Global); if that fails, ask the box office on the day whether on-site pickup seats remain, with your passport.',
   '韩国购票平台需要韩国手机本人认证。先在海外窗口（NOL World、Melon 全球）确认；仍不行，就在演出当天到售票处凭护照询问现场取票余量。',
   '韓国の予約サイトは韓国携帯の本人認証が必要です。まず海外窓口（NOL World・Melonグローバル）で確認し、それでもだめなら当日に窓口でパスポートを見せて当日受取の残席を聞いてください。',
   'Las webs coreanas exigen verificación con móvil coreano. Prueba primero las ventanillas globales (NOL World, Melon Global); si falla, pregunta el día del show en taquilla por localidades de recogida con pasaporte.',
   'Trang vé Hàn Quốc cần xác minh số điện thoại Hàn. Hãy thử cửa quốc tế trước (NOL World, Melon Global); nếu không được, hỏi quầy vé ngay hôm diễn về vé nhận tại chỗ bằng hộ chiếu.',
   'Les sites coréens exigent une vérification par téléphone coréen. Essayez d’abord les guichets internationaux (NOL World, Melon Global) ; sinon, demandez le jour même au guichet s’il reste des places à retirer sur place avec passeport.',
   'Os sites coreanos exigem verificação por celular coreano. Tente primeiro as janelas globais (NOL World, Melon Global); se não der, pergunte na bilheteria no dia sobre ingressos para retirada com passaporte.',
   'Корейские сайты требуют корейской проверки по телефону. Сначала попробуйте глобальные окна (NOL World, Melon Global); если не выйдет — спросите в кассе в день концерта про места с получением по паспорту.',
   'Situs tiket Korea perlu verifikasi nomor Korea. Coba kanal global dulu (NOL World, Melon Global); kalau gagal, tanya loket pada hari acara soal tiket ambil di tempat dengan paspor.'],
  ['카드가 없다면 WOWPASS를 먼저 만드세요. 여권만으로 발급되고 나이 제한이 없어 교통·편의점·대부분의 매장이 해결됩니다.',
   'No card? Make a WOWPASS first. Issued with just a passport and no age limit — it covers transit, convenience stores and most shops.',
   '没有卡就先办 WOWPASS。只需护照、无年龄限制，交通、便利店和大多数门店都能解决。',
   'カードがなければ WOWPASS を先に。パスポートだけで発行でき年齢制限もなく、交通・コンビニ・ほとんどの店で使えます。',
   '¿Sin tarjeta? Haz primero una WOWPASS: se emite con pasaporte y sin límite de edad, y cubre transporte, tiendas y casi todo.',
   'Không có thẻ? Hãy làm WOWPASS trước. Chỉ cần hộ chiếu, không giới hạn tuổi, dùng được cho giao thông, cửa hàng tiện lợi và hầu hết cửa hiệu.',
   'Pas de carte ? Faites d’abord une WOWPASS : délivrée au passeport, sans limite d’âge, elle couvre transports, supérettes et la plupart des commerces.',
   'Sem cartão? Faça primeiro um WOWPASS: emitido com passaporte, sem limite de idade, cobre transporte, lojas de conveniência e quase tudo.',
   'Нет карты? Сначала сделайте WOWPASS: выпускают по паспорту без возрастных ограничений, работает в транспорте, магазинах и почти везде.',
   'Tanpa kartu? Buat WOWPASS dulu. Terbit hanya dengan paspor dan tanpa batas usia — berlaku untuk transportasi, minimarket, dan hampir semua toko.'],
  ['22:00~05:00은 찜질방·PC방 출입이 제한됩니다. 보호자 동의서가 없다면 24시간 라운지나 청소년 유스호스텔을 찾으세요.',
   'Jjimjilbang and PC rooms are closed to minors from 22:00 to 05:00. Without a guardian consent form, look for a 24-hour lounge or a youth hostel.',
   '22:00~05:00 汗蒸房、PC 房限制未成年人进入。没有监护人同意书，就找 24 小时休息室或青少年青年旅舍。',
   '22:00〜05:00 はチムジルバン・PC房の入場が制限されます。保護者の同意書がないなら、24時間ラウンジか青少年ユースホステルを。',
   'De 22:00 a 05:00 los jjimjilbang y salas PC cierran a menores. Sin consentimiento del tutor, busca un lounge 24 h o un albergue juvenil.',
   '22:00–05:00 jjimjilbang và phòng PC không nhận người chưa thành niên. Không có giấy đồng ý của người giám hộ thì tìm lounge 24h hoặc nhà nghỉ thanh niên.',
   'De 22 h à 5 h, les jjimjilbang et salles PC refusent les mineurs. Sans autorisation du tuteur, cherchez un lounge 24 h ou une auberge de jeunesse.',
   'Das 22h às 5h, jjimjilbang e lan houses barram menores. Sem autorização do responsável, procure um lounge 24h ou albergue juvenil.',
   'С 22:00 до 05:00 чимчильбаны и компьютерные клубы не пускают несовершеннолетних. Без согласия опекуна ищите круглосуточный лаунж или молодёжный хостел.',
   'Pukul 22.00–05.00, jjimjilbang dan ruang PC menolak anak di bawah umur. Tanpa surat izin wali, cari lounge 24 jam atau hostel remaja.'],
  ['배달 앱(배민·쿠팡이츠)은 한국 카드가 필요할 수 있습니다. Shuttle Delivery는 웹에서 외국 카드로 주문됩니다.',
   'Korean delivery apps (Baemin, Coupang Eats) may require a Korean card. Shuttle Delivery takes foreign cards on the web.',
   '韩国外卖应用（Baemin、Coupang Eats）可能需要韩国卡。Shuttle Delivery 支持网页用海外卡下单。',
   '韓国の配達アプリ（ペミン・クーパンイーツ）は韓国カードが必要な場合があります。Shuttle Delivery はウェブで海外カード注文が可能です。',
   'Las apps coreanas (Baemin, Coupang Eats) pueden pedir tarjeta coreana. Shuttle Delivery acepta tarjetas extranjeras en la web.',
   'Ứng dụng giao đồ Hàn (Baemin, Coupang Eats) có thể cần thẻ Hàn. Shuttle Delivery nhận thẻ nước ngoài trên web.',
   'Les apps coréennes (Baemin, Coupang Eats) exigent parfois une carte coréenne. Shuttle Delivery accepte les cartes étrangères sur le web.',
   'Apps coreanos (Baemin, Coupang Eats) podem exigir cartão coreano. O Shuttle Delivery aceita cartão estrangeiro na web.',
   'Корейские приложения доставки (Baemin, Coupang Eats) могут требовать корейскую карту. Shuttle Delivery принимает зарубежные карты на сайте.',
   'Aplikasi antar Korea (Baemin, Coupang Eats) mungkin perlu kartu Korea. Shuttle Delivery menerima kartu asing lewat web.'],
  ['Pi 결제는 만 18세 이상 KYC 이후에만 가능합니다. 그 전에도 이 앱의 정보는 전부 무료로 읽힙니다.',
   'Pi payments need a KYC-verified account aged 18+. Until then, every piece of information in this app is free to read.',
   'Pi 支付需年满 18 岁并通过 KYC。在此之前，本应用的所有信息都可免费阅读。',
   'Pi 決済は18歳以上で KYC 済みのアカウントのみ。それまでも本アプリの情報はすべて無料で読めます。',
   'Los pagos con Pi exigen KYC y 18 años. Mientras tanto, toda la información de la app es gratis.',
   'Thanh toán Pi cần KYC và từ 18 tuổi. Trước đó, mọi thông tin trong ứng dụng đều miễn phí.',
   'Les paiements Pi exigent un KYC et 18 ans. D’ici là, toutes les informations de l’app restent gratuites.',
   'Pagamentos em Pi exigem KYC e 18 anos. Até lá, toda a informação do app é grátis.',
   'Оплата Pi — только после KYC с 18 лет. До этого вся информация в приложении бесплатна.',
   'Pembayaran Pi perlu KYC dan usia 18+. Sebelum itu, semua informasi di aplikasi ini gratis.']
];
