/* ------------------------------------------------------------------
 * Hangang — proxy goods board + official safety links
 * 10-tuple order: KR EN CN JP ES VN FR PT RU ID
 * ------------------------------------------------------------------ */

import type { L10 } from './i18n';

export interface GoodsItem {
  id: string;
  t: L10;
  pi: number;
  icon: string;
  grade: string;
}

export const GOODS: GoodsItem[] = [
  {
    id: 'pensive',
    t: ['국립중앙박물관 뮷즈 · 반가사유상 미니어처', 'National Museum goods · Pensive Bodhisattva miniature', '国立中央博物馆周边 · 半跏思惟像迷你', '国立中央博物館グッズ · 半跏思惟像ミニチュア', 'Museo Nacional · miniatura del Bodhisattva', 'Bảo tàng Quốc gia · tượng Bán Già Tư Duy mini', 'Musée national · miniature du Bodhisattva', 'Museu Nacional · miniatura do Bodhisattva', 'Нацмузей · миниатюра Бодхисаттвы', 'Museum Nasional · miniatur Bodhisattva'],
    pi: 4,
    icon: '🏛️',
    grade: 'A'
  },
  {
    id: 'magpie',
    t: ['까치호랑이 배지 · 엽서 세트', 'Magpie-and-tiger badge · postcard set', '鹊虎徽章 · 明信片套装', '鵲虎バッジ・ポストカードセット', 'Insignia urraca-tigre · postales', 'Huy hiệu khách–hổ · bộ bưu thiếp', 'Badge pie-tigre · cartes postales', 'Broche pega-tigre · cartões-postais', 'Значок сорока-тигр · открытки', 'Pin murai-macan · set kartu pos'],
    pi: 2,
    icon: '🐯',
    grade: 'A'
  },
  {
    id: 'hanbok',
    t: ['경주·전주 한복 대여 예약 대행', 'Gyeongju / Jeonju hanbok rental booking', '庆州·全州韩服租借代订', '慶州・全州の韓服レンタル予約代行', 'Reserva de hanbok en Gyeongju / Jeonju', 'Đặt thuê hanbok Gyeongju / Jeonju', 'Réservation de hanbok à Gyeongju / Jeonju', 'Reserva de hanbok em Gyeongju / Jeonju', 'Бронь ханбока в Кёнджу / Чонджу', 'Pesan sewa hanbok Gyeongju / Jeonju'],
    pi: 6,
    // 한복은 이모지 집합에 없다(👘는 기모노). 카드에서 HanbokIcon(SVG)으로 그린다.
    icon: '',
    grade: 'A'
  },
  {
    id: 'locker',
    t: ['공연장·역사 짐보관 3시간', 'Luggage storage 3 h at venue or station', '演出场·车站行李寄存 3 小时', '会場・駅の手荷物預かり3時間', 'Consigna 3 h en recinto o estación', 'Giữ hành lý 3 giờ tại sân hoặc ga', 'Consigne 3 h (salle ou gare)', 'Consigna 3 h no local ou estação', 'Камера хранения 3 ч (зал или вокзал)', 'Titip barang 3 jam (venue/stasiun)'],
    pi: 2,
    icon: '🧳',
    grade: 'A'
  },
  {
    id: 'chimaek',
    t: ['한강 치맥 배달 대리 주문', 'Hangang chimaek delivery order', '汉江炸鸡啤酒代叫', '漢江チメクの出前代行', 'Pedido de chimaek del Hangang', 'Đặt gà–bia Hangang', 'Commande chimaek du Hangang', 'Pedido de chimaek do Hangang', 'Заказ чимек у Хангана', 'Pesan chimaek Hangang'],
    pi: 3,
    icon: '🍺',
    grade: 'A'
  },
  {
    id: 'busan',
    t: ['부산 어묵·김 세트 택배 대행', 'Busan fish cake & seaweed set shipped', '釜山鱼饼·海苔套装代寄', '釜山の練り物・海苔セット発送', 'Set de pastel de pescado y alga de Busan', 'Set chả cá & rong biển Busan gửi đi', 'Kit chikuwa et algues de Busan expédié', 'Kit de bolinho de peixe e alga de Busan', 'Набор рыбных лепёшек и нори из Пусана', 'Paket odeng & rumput laut Busan dikirim'],
    pi: 4,
    icon: '🐟',
    grade: 'B'
  },
  {
    id: 'gyeongju',
    t: ['경주빵·황남빵 세트', 'Gyeongju bread & Hwangnam bread set', '庆州面包·皇南饼套装', '慶州パン・皇南パンセット', 'Set de pan de Gyeongju y Hwangnam', 'Set bánh Gyeongju & Hwangnam', 'Assortiment pains de Gyeongju et Hwangnam', 'Kit pães de Gyeongju e Hwangnam', 'Набор хлеба Кёнджу и Хваннам', 'Paket roti Gyeongju & Hwangnam'],
    pi: 3,
    icon: '🥐',
    grade: 'B'
  },
  {
    id: 'jeju',
    t: ['제주 감귤·녹차 초콜릿 세트', 'Jeju tangerine & green-tea chocolate set', '济州柑橘·绿茶巧克力套装', '済州みかん・緑茶チョコセット', 'Set de chocolate de mandarina y té verde de Jeju', 'Set sô-cô-la quýt & trà xanh Jeju', 'Coffret chocolat mandarine et thé vert de Jeju', 'Kit chocolate de tangerina e chá verde de Jeju', 'Набор шоколада с мандарином и зелёным чаем', 'Set cokelat jeruk & teh hijau Jeju'],
    pi: 5,
    icon: '🍫',
    grade: 'A'
  }
];

export interface SafetyLink {
  t: L10;
  d: L10;
  url: string;
  tag: string;
}

export const LINKS: SafetyLink[] = [
  {
    t: ['1330 관광통역안내 · 07:00~24:00', 'Visit Korea 1330 · 07:00–24:00', '1330 旅游翻译咨询 · 07:00~24:00', '1330 観光通訳案内 · 07:00〜24:00', 'Visit Korea 1330 · 07:00–24:00', 'Visit Korea 1330 · 07:00–24:00', 'Visit Korea 1330 · 07:00–24:00', 'Visit Korea 1330 · 07:00–24:00', 'Visit Korea 1330 · 07:00–24:00', 'Visit Korea 1330 · 07.00–24.00'],
    d: ['관광지·교통·쇼핑 상담을 8개 언어(한·영·일·중·러·태·베·인도)로. 07:00~24:00, 전국 어디서나 국번 없이 1330.', 'Travel, transit and shopping help in 8 languages (Korean, English, Japanese, Chinese, Russian, Thai, Vietnamese, Indonesian). 07:00–24:00, dial 1330 anywhere in Korea.', '景点、交通、购物咨询，8 种语言（韩英日中俄泰越印尼）。07:00~24:00，全韩直拨 1330。', '観光地・交通・買い物の相談を8言語（韓英日中露タイベトナム・インドネシア）で。07:00〜24:00、全国どこからでも1330。', 'Ayuda turística, de transporte y compras en 8 idiomas (coreano, inglés, japonés, chino, ruso, tailandés, vietnamita, indonesio). 07:00–24:00, marca 1330.', 'Tư vấn du lịch, giao thông, mua sắm bằng 8 ngôn ngữ (Hàn, Anh, Nhật, Trung, Nga, Thái, Việt, Indonesia). 07:00–24:00, gọi 1330.', 'Aide tourisme, transport et shopping en 8 langues (coréen, anglais, japonais, chinois, russe, thaï, vietnamien, indonésien). 07:00–24:00, composez le 1330.', 'Ajuda de turismo, transporte e compras em 8 idiomas (coreano, inglês, japonês, chinês, russo, tailandês, vietnamita, indonésio). 07:00–24:00, disque 1330.', 'Туризм, транспорт и покупки на 8 языках (корейский, английский, японский, китайский, русский, тайский, вьетнамский, индонезийский). 07:00–24:00, звоните 1330.', 'Bantuan wisata, transportasi, belanja dalam 8 bahasa (Korea, Inggris, Jepang, Mandarin, Rusia, Thai, Vietnam, Indonesia). 07.00–24.00, hubungi 1330.'],
    url: 'https://www.visitkorea.or.kr',
    tag: '1330'
  },
  {
    t: ['서울시 안심이 앱 · 안심귀가', 'Seoul Ansimi app · safe return', '首尔安心 App · 安心回家', 'ソウル安心アプリ · 安心帰宅', 'App Ansimi de Seúl · regreso seguro', 'App Ansimi Seoul · về nhà an toàn', 'App Ansimi de Séoul · retour serein', 'App Ansimi de Seul · volta segura', 'Приложение Ansimi Сеула · безопасный путь домой', 'Aplikasi Ansimi Seoul · pulang aman'],
    d: ['CCTV 관제·긴급신고·안심귀가 스카우트. 영어·중국어·일본어 지원.', 'CCTV monitoring, SOS reporting and a safe-return escort. English, Chinese and Japanese supported.', 'CCTV 监控、紧急报警、安心回家陪伴。支持英日中。', 'CCTV 監視・緊急通報・安心帰宅スカウト。英語・中国語・日本語対応。', 'Videovigilancia, SOS y acompañamiento de regreso. En inglés, chino y japonés.', 'Giám sát CCTV, báo SOS, hộ tống về nhà. Hỗ trợ Anh–Trung–Nhật.', 'Vidéosurveillance, SOS et accompagnement. Anglais, chinois, japonais.', 'Monitoramento por CCTV, SOS e acompanhamento. Inglês, chinês e japonês.', 'CCTV, SOS и сопровождение домой. Английский, китайский, японский.', 'Pantau CCTV, SOS, antar pulang. Mendukung Inggris, Mandarin, Jepang.'],
    url: 'https://news.seoul.go.kr/welfare/archives/517373',
    tag: 'SEOUL'
  },
  {
    t: ['경찰청 안전Dream', 'Korean National Police Safety Dream', '韩国警察厅 Safety Dream', '韓国警察庁 安全Dream', 'Policía de Corea · Safety Dream', 'Cảnh sát Hàn Quốc · Safety Dream', 'Police coréenne · Safety Dream', 'Polícia da Coreia · Safety Dream', 'Полиция Кореи · Safety Dream', 'Polisi Korea · Safety Dream'],
    d: ['실종아동·가출인 신고와 보호 시설 안내.', 'Reporting missing children and runaways, plus shelter guidance.', '失踪儿童·离家出走申报与保护设施指南。', '失踪児童・家出人の通報と保護施設案内。', 'Denuncia de menores desaparecidos y guía de centros de protección.', 'Báo trẻ mất tích, người bỏ nhà và hướng dẫn nơi tạm trú.', 'Signalement d’enfants disparus et orientation vers les centres.', 'Registro de crianças desaparecidas e orientação de abrigos.', 'Розыск пропавших детей и подсказки по приютам.', 'Lapor anak hilang dan panduan tempat perlindungan.'],
    url: 'https://www.safe182.go.kr',
    tag: 'POLICE'
  },
  {
    t: ['서울 교통정보 TOPIS · 심야버스', 'Seoul TOPIS · night buses', '首尔交通信息 TOPIS · 深夜巴士', 'ソウル交通情報 TOPIS · 深夜バス', 'TOPIS de Seúl · buses nocturnos', 'TOPIS Seoul · buýt đêm', 'TOPIS de Séoul · bus de nuit', 'TOPIS de Seul · ônibus noturnos', 'TOPIS Сеула · ночные автобусы', 'TOPIS Seoul · bus malam'],
    d: ['올빼미버스 N13~N75 실시간 운행 정보. 23:00~06:00 운행.', 'Live Night Owl routes N13–N75. Runs 23:00–06:00.', '猫头鹰巴士 N13~N75 实时运行信息。23:00~06:00 运行。', '深夜バス N13〜N75 の運行情報。23:00〜06:00 運行。', 'Información en vivo de las rutas N13–N75, de 23:00 a 06:00.', 'Thông tin trực tiếp tuyến N13–N75, chạy 23:00–06:00.', 'Infos en direct des lignes N13–N75, de 23 h à 6 h.', 'Informação ao vivo das linhas N13–N75, das 23h às 6h.', 'Онлайн-информация по маршрутам N13–N75, 23:00–06:00.', 'Info langsung rute N13–N75, 23.00–06.00.'],
    url: 'https://topis.seoul.go.kr',
    tag: 'TRANSIT'
  }
  ,{
    t: ['1345 외국인종합안내센터', '1345 Immigration Contact Centre', '1345 外国人综合咨询中心', '1345 外国人総合案内センター', 'Centro de información 1345', 'Trung tâm hỗ trợ 1345', 'Centre d’information 1345', 'Central de informações 1345', 'Информцентр 1345', 'Pusat informasi 1345'],
    d: ['비자·체류·출입국·생활 상담을 외국어로. 전화 1345(국번 없이).', 'Visa, stay, immigration and daily-life help in foreign languages. Dial 1345.', '签证、居留、出入境与生活咨询，提供外语服务。直拨 1345。', 'ビザ・滞在・出入国・生活の相談を外国語で。1345（局番なし）。', 'Visados, estancia, inmigración y vida diaria en idiomas extranjeros. Marca 1345.', 'Tư vấn visa, lưu trú, xuất nhập cảnh và đời sống bằng ngoại ngữ. Gọi 1345.', 'Visas, séjour, immigration et vie quotidienne en langues étrangères. Composez le 1345.', 'Visto, permanência, imigração e vida diária em idiomas estrangeiros. Disque 1345.', 'Визы, пребывание, иммиграция и быт на иностранных языках. Звоните 1345.', 'Visa, izin tinggal, imigrasi, dan kehidupan sehari-hari dalam bahasa asing. Hubungi 1345.'],
    url: 'tel:1345',
    tag: '1345'
  },
  {
    t: ['관광불편신고센터', 'Tourist complaint centre', '旅游不便举报中心', '観光不便申告センター', 'Centro de reclamaciones turísticas', 'Trung tâm phản ánh du lịch', 'Centre de réclamations touristiques', 'Central de reclamações turísticas', 'Центр жалоб туристов', 'Pusat pengaduan wisata'],
    d: ['바가지요금·부당요금·불친절을 온라인으로 신고합니다. 영문 접수 가능.', 'Report overcharging, unfair fees or rudeness online. English accepted.', '可在线举报宰客、乱收费与不友好行为，支持英文提交。', 'ぼったくり・不当料金・不親切をオンラインで申告。英語受付可。', 'Denuncia en línea cobros abusivos o mal trato. Se acepta inglés.', 'Báo giá chặt chém, phí vô lý hoặc thái độ qua mạng. Nhận tiếng Anh.', 'Signalez en ligne les prix abusifs ou l’impolitesse. Anglais accepté.', 'Denuncie cobranças abusivas ou mau atendimento online. Aceita inglês.', 'Сообщайте о завышенных ценах и грубости онлайн. Принимают по-английски.', 'Laporkan harga berlebihan atau layanan kasar secara online. Bisa bahasa Inggris.'],
    url: 'https://www.touristcomplaint.or.kr',
    tag: 'CLAIM'
  },
  {
    t: ['응급의료정보 E-Gen', 'E-Gen emergency medical info', '急救医疗信息 E-Gen', '救急医療情報 E-Gen', 'Información médica E-Gen', 'Thông tin y tế khẩn cấp E-Gen', 'Infos médicales E-Gen', 'Informação médica E-Gen', 'Экстренная медицина E-Gen', 'Info medis darurat E-Gen'],
    d: ['외국인 진료가 가능한 병원·약국을 언어별로 찾고, 응급 시 통역 지원을 받습니다.', 'Find hospitals and pharmacies that treat foreigners, by language, with interpretation support in emergencies.', '可按语言查找可接待外国人的医院与药局，紧急时提供翻译支援。', '外国人診療可能な病院・薬局を言語別に検索。緊急時は通訳支援があります。', 'Encuentra hospitales y farmacias que atienden extranjeros por idioma, con interpretación en emergencias.', 'Tìm bệnh viện, nhà thuốc nhận người nước ngoài theo ngôn ngữ, có hỗ trợ phiên dịch khi khẩn cấp.', 'Trouvez hôpitaux et pharmacies accueillant les étrangers par langue, avec interprétation en urgence.', 'Encontre hospitais e farmácias que atendem estrangeiros por idioma, com interpretação em emergências.', 'Ищите больницы и аптеки для иностранцев по языкам; в экстренном случае — перевод.', 'Cari rumah sakit dan apotek yang melayani asing per bahasa, dengan bantuan penerjemah saat darurat.'],
    url: 'https://www.e-gen.or.kr',
    tag: 'MEDICAL'
  },
  {
    t: ['Medical Korea · 외국인 진료 안내', 'Medical Korea · care for visitors', 'Medical Korea · 外国人就医指南', 'Medical Korea · 外国人診療案内', 'Medical Korea · atención a extranjeros', 'Medical Korea · khám cho người nước ngoài', 'Medical Korea · soins pour étrangers', 'Medical Korea · atendimento a estrangeiros', 'Medical Korea · помощь иностранцам', 'Medical Korea · layanan medis asing'],
    d: ['외국인 환자를 받는 병원·전문의 정보를 영문으로 확인합니다. 예약 전에 진료과와 통역 여부를 보세요.', 'English information on hospitals and specialists that take foreign patients — check department and interpretation before booking.', '以英文查看可接待外国患者的医院与专科医生，预约前确认科室与翻译服务。', '外国人患者を受け入れる病院・専門医を英語で確認。予約前に診療科と通訳の有無を。', 'Información en inglés sobre hospitales y especialistas que atienden extranjeros: mira especialidad e interpretación antes de reservar.', 'Thông tin tiếng Anh về bệnh viện và bác sĩ nhận bệnh nhân nước ngoài — xem khoa và phiên dịch trước khi đặt.', 'Informations en anglais sur les hôpitaux et spécialistes recevant des étrangers : vérifiez service et interprétation avant de réserver.', 'Informações em inglês sobre hospitais e especialistas que atendem estrangeiros: veja especialidade e interpretação antes.', 'Английская информация о больницах и врачах для иностранцев — проверьте отделение и перевод до записи.', 'Info bahasa Inggris soal rumah sakit dan dokter untuk pasien asing — cek poliklinik dan penerjemah sebelum memesan.'],
    url: 'https://www.medicalkorea.or.kr/en/index',
    tag: 'MEDICAL'
  },
  {
    t: ['외교부 해외안전여행 0404', 'MOFA travel safety 0404', '外交部海外安全旅行 0404', '外交部 海外安全旅行 0404', 'Seguridad en el exterior 0404', 'An toàn du lịch 0404', 'Sécurité à l’étranger 0404', 'Segurança no exterior 0404', 'Безопасность за рубежом 0404', 'Keamanan luar negeri 0404'],
    d: ['국가별 여행경보와 재외공관 연락처를 확인합니다. 사건·사고 시 영사 도움을 받는 첫 창구입니다.', 'Country-by-country travel alerts and embassy contacts — the first place to turn for consular help.', '查看各国旅行警报与驻外使领馆联系方式，事故时可获得领事协助。', '国別の渡航警報と在外公館の連絡先を確認。事件・事故の際の領事支援の窓口です。', 'Alertas por país y contactos de embajadas: la primera vía para ayuda consular.', 'Cảnh báo theo quốc gia và liên hệ đại sứ quán — nơi đầu tiên cần đến khi có sự cố.', 'Alertes par pays et contacts des ambassades : le premier recours consulaire.', 'Alertas por país e contatos de embaixadas: o primeiro caminho para ajuda consular.', 'Оповещения по странам и контакты посольств — первая точка консульской помощи.', 'Peringatan per negara dan kontak kedutaan — jalur pertama bantuan konsuler.'],
    url: 'https://www.0404.go.kr',
    tag: '0404'
  }
];
