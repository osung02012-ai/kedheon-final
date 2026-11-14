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
    icon: '🗿',
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
    icon: '👘',
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
    icon: '🍢',
    grade: 'B'
  },
  {
    id: 'gyeongju',
    t: ['경주빵·황남빵 세트', 'Gyeongju bread & Hwangnam bread set', '庆州面包·皇南饼套装', '慶州パン・皇南パンセット', 'Set de pan de Gyeongju y Hwangnam', 'Set bánh Gyeongju & Hwangnam', 'Assortiment pains de Gyeongju et Hwangnam', 'Kit pães de Gyeongju e Hwangnam', 'Набор хлеба Кёнджу и Хваннам', 'Paket roti Gyeongju & Hwangnam'],
    pi: 3,
    icon: '🥮',
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
    t: ['1330 관광통역안내 · 24시간', 'Visit Korea 1330 · 24 h', '1330 旅游翻译咨询 · 24 小时', '1330 観光通訳案内 · 24時間', 'Visit Korea 1330 · 24 h', 'Visit Korea 1330 · 24h', 'Visit Korea 1330 · 24 h', 'Visit Korea 1330 · 24 h', 'Visit Korea 1330 · 24 ч', 'Visit Korea 1330 · 24 jam'],
    d: ['관광지·교통·쇼핑 상담을 13개 언어로. 전국 어디서나 국번 없이 1330.', 'Travel, transit and shopping help in 13 languages. Dial 1330 anywhere in Korea.', '景点、交通、购物咨询，13 种语言。全韩任何地方直拨 1330。', '観光地・交通・買い物の相談を13言語で。全国どこからでも1330。', 'Ayuda turística, de transporte y compras en 13 idiomas. Marca 1330 en toda Corea.', 'Tư vấn du lịch, giao thông, mua sắm bằng 13 ngôn ngữ. Gọi 1330 ở bất kỳ đâu.', 'Aide tourisme, transport et shopping en 13 langues. Composez le 1330 partout.', 'Ajuda de turismo, transporte e compras em 13 idiomas. Disque 1330 em qualquer lugar.', 'Туризм, транспорт и покупки на 13 языках. Звоните 1330 по всей Корее.', 'Bantuan wisata, transportasi, belanja dalam 13 bahasa. Hubungi 1330 di mana saja.'],
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
];
