/* ------------------------------------------------------------------
 * Hangang — 7 nationwide travel regions
 * Each region: 4 categories × 3 real options + 3 practical travel tips.
 * Order of every 10-tuple: KR EN CN JP ES VN FR PT RU ID
 * ------------------------------------------------------------------ */

import type { L10 } from './i18n';

export type PickKey = 'stay' | 'culture' | 'food' | 'transit';

export interface Option {
  t: L10;
  pi: number;
}

export interface Zone {
  key: string;
  code: string;
  sub: L10;
  venues: L10;
  tips: L10[];
  picks: Record<PickKey, Option[]>;
}

export const PICK_ORDER: PickKey[] = ['stay', 'culture', 'food', 'transit'];

export const ZONES: Zone[] = [
  /* ── 1. SEOUL ─────────────────────────────────────────────── */
  {
    key: 'SEOUL',
    code: 'SEOUL',
    sub: ['K-팝 콘서트 & 도심', 'K-pop concerts & city', 'K-pop 演唱会·市区', 'K-POP コンサート＆都心', 'K-pop y ciudad', 'Concert K-pop & nội đô', 'K-pop et centre-ville', 'K-pop e centro', 'K-pop и центр', 'K-pop & pusat kota'],
    venues: ['잠실 · 상암 · 고척 · 용산', 'Jamsil · Sangam · Gocheok · Yongsan', '蚕室 · 上岩 · 高尺 · 龙山', '蚕室・上岩・高尺・龍山', 'Jamsil · Sangam · Gocheok · Yongsan', 'Jamsil · Sangam · Gocheok · Yongsan', 'Jamsil · Sangam · Gocheok · Yongsan', 'Jamsil · Sangam · Gocheok · Yongsan', 'Чамсиль · Сангам · Кочхок · Йонсан', 'Jamsil · Sangam · Gocheok · Yongsan'],
    tips: [
      ['인천공항→잠실: 리무진 6006번 약 80분, 공항철도+2호선 약 65분. 심야엔 올빼미버스 N13·N32(23시~06시).',
        'Incheon Airport to Jamsil: limousine 6006 ≈80 min, or Airport Railroad + Line 2 ≈65 min. After midnight use Night Owl buses N13/N32 (23:00–06:00).',
        '仁川机场→蚕室：大巴 6006 约 80 分钟，机场铁路+2 号线约 65 分钟。深夜乘 N13·N32 猫头鹰巴士（23 时~06 时）。',
        '仁川空港→蚕室：リムジン6006番 約80分、空港鉄道＋2号線 約65分。深夜は深夜バス N13・N32（23時〜06時）。',
        'Incheon→Jamsil: limusina 6006 ≈80 min o tren + línea 2 ≈65 min. De madrugada, buses N13/N32 (23:00–06:00).',
        'Incheon→Jamsil: xe limousine 6006 ~80 phút hoặc tàu sân bay + tuyến 2 ~65 phút. Đêm đi buýt N13/N32 (23:00–06:00).',
        'Incheon→Jamsil : navette 6006 ≈80 min ou train + ligne 2 ≈65 min. La nuit, bus N13/N32 (23 h–6 h).',
        'Incheon→Jamsil: limusine 6006 ≈80 min ou trem + linha 2 ≈65 min. De madrugada, ônibus N13/N32 (23h–6h).',
        'Инчхон→Чамсиль: лимузин 6006 ≈80 мин или аэропоезд + линия 2 ≈65 мин. Ночью — N13/N32 (23:00–06:00).',
        'Incheon→Jamsil: limusin 6006 ≈80 menit atau kereta + jalur 2 ≈65 menit. Malam pakai bus N13/N32 (23.00–06.00).'],
      ['국립중앙박물관 상설전은 무료, 수·토는 21시까지 야간개장. 1월 1일·설·추석만 휴관(4·11월 첫째 월요일은 상설관 휴실).',
        'The National Museum is free, open to 21:00 on Wed/Sat. It closes only Jan 1, Seollal and Chuseok (permanent galleries also close the first Monday of April and November).',
        '国立中央博物馆常设展免费，周三·周六开放至 21 时。仅 1 月 1 日、春节、中秋闭馆（4 月、11 月第一个周一常设馆休馆）。',
        '国立中央博物館の常設展は無料、水・土は21時まで夜間開館。休館は1月1日・旧正月・秋夕のみ（4月・11月の第1月曜は常設館休室）。',
        'El Museo Nacional es gratis y abre hasta las 21:00 mié/sáb. Solo cierra el 1 de enero, Seollal y Chuseok (las salas permanentes cierran el primer lunes de abril y noviembre).',
        'Bảo tàng Quốc gia miễn phí, mở đến 21:00 thứ Tư/thứ Bảy. Chỉ đóng 1/1, Tết Âm lịch, Trung thu (thứ Hai đầu tháng 4 và 11 phòng trưng bày thường xuyên đóng).',
        'Le Musée national est gratuit, ouvert jusqu’à 21 h mer/sam. Fermé seulement le 1er janvier, Seollal et Chuseok (galeries permanentes fermées le 1er lundi d’avril et de novembre).',
        'O Museu Nacional é grátis e abre até 21h qua/sáb. Só fecha em 1º de janeiro, Seollal e Chuseok (galerias permanentes fecham na 1ª segunda de abril e novembro).',
        'Национальный музей бесплатен, по ср/сб до 21:00. Закрыт только 1 января, в Соллаль и Чхусок (постоянные залы — первый понедельник апреля и ноября).',
        'Museum Nasional gratis, buka sampai 21.00 Rabu/Sabtu. Hanya tutup 1 Januari, Seollal, Chuseok (galeri permanen tutup Senin pertama April dan November).'],
      ['궁궐 휴관일이 서로 다릅니다 — 경복궁·종묘 화요일, 창덕궁·덕수궁·창경궁 월요일. 공연 전 낮 일정은 열린 궁으로 잡으세요.',
        'Palaces close on different days: Gyeongbokgung and Jongmyo on Tuesdays, Changdeokgung, Deoksugung and Changgyeonggung on Mondays. Plan the daytime visit around the one that is open.',
        '各宫殿闭馆日不同：景福宫·宗庙周二，昌德宫·德寿宫·昌庆宫周一。白天行程请安排在开放的那一座。',
        '宮殿ごとに休館日が違います — 景福宮・宗廟は火曜、昌徳宮・徳寿宮・昌慶宮は月曜。昼の予定は開いている宮に。',
        'Los palacios cierran en días distintos: Gyeongbokgung y Jongmyo los martes; Changdeokgung, Deoksugung y Changgyeonggung los lunes. Organiza la visita según cuál esté abierto.',
        'Mỗi cung điện đóng cửa khác ngày: Gyeongbokgung, Jongmyo thứ Ba; Changdeokgung, Deoksugung, Changgyeonggung thứ Hai. Chọn cung đang mở cho lịch ban ngày.',
        'Les palais ferment des jours différents : Gyeongbokgung et Jongmyo le mardi ; Changdeokgung, Deoksugung et Changgyeonggung le lundi. Organisez la visite selon celui qui ouvre.',
        'Os palácios fecham em dias diferentes: Gyeongbokgung e Jongmyo às terças; Changdeokgung, Deoksugung e Changgyeonggung às segundas. Monte o passeio pelo que estiver aberto.',
        'Дворцы закрыты в разные дни: Кёнбоккун и Чонмё — вторник, Чхандоккун, Токсугун и Чхангёнгун — понедельник. Планируйте день по открытому дворцу.',
        'Istana tutup di hari berbeda: Gyeongbokgung dan Jongmyo Selasa; Changdeokgung, Deoksugung, Changgyeonggung Senin. Susun agenda siang sesuai yang buka.']
    ],
    picks: {
      stay: [
        { t: ['잠실역 도보 5분 호텔 · 공연 후 도보 귀가', 'Hotel 5 min from Jamsil Stn · walk home after the show', '蚕室站步行 5 分钟酒店 · 演出后步行回房', '蚕室駅徒歩5分ホテル · 公演後は徒歩で帰宿', 'Hotel a 5 min de Jamsil · vuelta a pie tras el show', 'Khách sạn cách ga Jamsil 5 phút · về phòng sau show', 'Hôtel à 5 min de Jamsil · retour à pied après le show', 'Hotel a 5 min de Jamsil · volta a pé após o show', 'Отель в 5 мин от Чамсиля · пешком после концерта', 'Hotel 5 menit dari Stasiun Jamsil · jalan kaki setelah konser'], pi: 18 },
        { t: ['석촌·방이 게스트하우스 · KYC 실명 호스트', 'Seokchon / Bangi guesthouse · KYC-verified host', '石村·芳荑民宿 · KYC 实名房东', '石村・芳荑ゲストハウス · KYC 実名ホスト', 'Casa de huéspedes Seokchon/Bangi · anfitrión KYC', 'Nhà nghỉ Seokchon/Bangi · chủ nhà KYC', 'Maison d’hôtes Seokchon/Bangi · hôte KYC', 'Guesthouse Seokchon/Bangi · anfitrião KYC', 'Гостевой дом Сокчон/Панъи · хозяин с KYC', 'Guesthouse Seokchon/Bangi · host KYC'], pi: 9 },
        { t: ['강남 4성 호텔 · 택시 15분', 'Gangnam 4-star hotel · 15 min by taxi', '江南四星酒店 · 打车 15 分钟', '江南4つ星ホテル · タクシー15分', 'Hotel 4★ en Gangnam · 15 min en taxi', 'Khách sạn 4 sao Gangnam · taxi 15 phút', 'Hôtel 4★ à Gangnam · 15 min en taxi', 'Hotel 4★ em Gangnam · 15 min de táxi', 'Отель 4* в Каннаме · 15 мин на такси', 'Hotel bintang 4 Gangnam · 15 menit taksi'], pi: 24 }
      ],
      culture: [
        { t: ['KSPO DOME·고척돔 콘서트 입장권 매칭 · 1인 1매 실명', 'KSPO DOME / Gocheok Dome ticket match · one seat per verified person', 'KSPO DOME·高尺巨蛋门票匹配 · 实名一人一票', 'KSPO DOME・高尺ドームのチケット照合 · 実名1人1枚', 'Entradas KSPO DOME / Gocheok · una por persona verificada', 'Vé KSPO DOME / Gocheok · một vé mỗi người', 'Billets KSPO DOME / Gocheok · un siège par personne vérifiée', 'Ingressos KSPO DOME / Gocheok · um por pessoa verificada', 'Билеты KSPO DOME / Кочхок · один на человека', 'Tiket KSPO DOME / Gocheok · satu per orang terverifikasi'], pi: 40 },
        { t: ['국립중앙박물관 뮷즈 대행 · 반가사유상 미니어처', 'National Museum goods · Pensive Bodhisattva miniature', '国立中央博物馆周边 · 半跏思惟像迷你版', '国立中央博物館グッズ · 半跏思惟像ミニチュア', 'Souvenir del Museo Nacional · miniatura del Bodhisattva', 'Quà Bảo tàng Quốc gia · tượng Bán Già Tư Duy mini', 'Souvenir du Musée national · miniature du Bodhisattva', 'Souvenir do Museu Nacional · miniatura do Bodhisattva', 'Сувенир Нацмузея · миниатюра Бодхисаттвы', 'Suvenir Museum Nasional · miniatur Bodhisattva'], pi: 5 },
        { t: ['경복궁·창덕궁 야간개장 예약 대행 + 해설', 'Gyeongbokgung / Changdeokgung night opening, booked for you + guide', '景福宫·昌德宫夜间开放代订 + 讲解', '景福宮・昌徳宮の夜間特別観覧を代行予約＋解説', 'Apertura nocturna de palacios reservada + guía', 'Đặt mở cửa đêm cung điện + hướng dẫn', 'Ouverture nocturne de palais réservée + guide', 'Abertura noturna de palácio reservada + guia', 'Ночное открытие дворца с бронью и гидом', 'Buka malam istana dipesan + pemandu'], pi: 6 }
      ],
      food: [
        { t: ['한강 치맥 세트(여의도·뚝섬) 배달 대행', 'Hangang chimaek set (Yeouido / Ttukseom) delivered', '汉江炸鸡啤酒套餐（汝矣岛·纛岛）代叫外卖', '漢江チメクセット（汝矣島・トゥクソム）出前代行', 'Set chimaek del Hangang (Yeouido / Ttukseom) a domicilio', 'Set gà rán–bia Hangang (Yeouido/Ttukseom) giao tận nơi', 'Plateau chimaek du Hangang (Yeouido / Ttukseom) livré', 'Combo chimaek do Hangang (Yeouido / Ttukseom) entregue', 'Набор чимек у Хангана (Йоидо/Ттуксом) с доставкой', 'Paket chimaek Hangang (Yeouido/Ttukseom) diantar'], pi: 3 },
        { t: ['광장시장 먹거리 투어 · 마약김밥·빈대떡', 'Gwangjang Market food tour · mini gimbap & mung-bean pancake', '广藏市场美食游 · 麻药紫菜包饭·绿豆煎饼', '広蔵市場グルメツアー · 麻薬キンパ・ピンデトック', 'Tour gastronómico de Gwangjang · gimbap y tortita de judía', 'Tour ẩm thực chợ Gwangjang · kimbap & bánh đậu', 'Tour gourmand de Gwangjang · gimbap et galette de haricot', 'Tour gastronômico do Gwangjang · gimbap e panqueca de feijão', 'Гастротур по рынку Кванджан · кимпаб и лепёшки из маша', 'Tur kuliner Pasar Gwangjang · gimbap & pancake kacang hijau'], pi: 5 },
        { t: ['성수동 카페·베이커리 투어', 'Seongsu-dong cafe & bakery tour', '圣水洞咖啡·烘焙巡游', '聖水洞カフェ＆ベーカリーツアー', 'Ruta de cafés y panaderías en Seongsu', 'Tour cà phê & tiệm bánh Seongsu', 'Tour cafés et boulangeries à Seongsu', 'Tour de cafés e padarias em Seongsu', 'Кафе и пекарни Сонсу-дона', 'Tur kafe & toko roti Seongsu'], pi: 6 }
      ],
      transit: [
        { t: ['공항철도·지하철 환승 가이드 + T-money 세팅', 'Airport rail / subway transfer guide + T-money setup', '机场铁路·地铁换乘指南 + T-money 设置', '空港鉄道・地下鉄乗換ガイド＋T-money 設定', 'Guía de trasbordo + configuración de T-money', 'Hướng dẫn chuyển tuyến + cài T-money', 'Guide de correspondance + installation T-money', 'Guia de baldeação + ajuste do T-money', 'Гид по пересадкам + настройка T-money', 'Panduan transit + setel T-money'], pi: 2 },
        { t: ['심야 올빼미버스 N13·N32 안내', 'Night Owl bus N13 / N32 guide', '深夜猫头鹰巴士 N13·N32 指南', '深夜バス N13・N32 案内', 'Guía de buses nocturnos N13 / N32', 'Hướng dẫn buýt đêm N13 / N32', 'Guide des bus de nuit N13 / N32', 'Guia dos ônibus noturnos N13 / N32', 'Гид по ночным автобусам N13/N32', 'Panduan bus malam N13 / N32'], pi: 1 },
        { t: ['공항 리무진 6006번 좌석 예약 대행', 'Airport limousine 6006 seat booking', '机场大巴 6006 座位代订', '空港リムジン6006番 座席予約代行', 'Reserva de asiento en limusina 6006', 'Đặt ghế xe limousine 6006', 'Réservation de siège navette 6006', 'Reserva de assento na limusine 6006', 'Бронь места в лимузине 6006', 'Pesan kursi limusin 6006'], pi: 4 }
      ]
    }
  },

  /* ── 2. YONGIN · SUWON ────────────────────────────────────── */
  {
    key: 'YONGIN',
    code: 'YONGIN',
    sub: ['한국민속촌 & 에버랜드', 'Folk Village & Everland', '民俗村·爱宝乐园', '韓国民俗村＆エバーランド', 'Aldea folclórica y Everland', 'Làng dân gian & Everland', 'Village folklorique et Everland', 'Aldeia folclórica e Everland', 'Фольклорная деревня и Эверленд', 'Desa Rakyat & Everland'],
    venues: ['한국민속촌 · 에버랜드 · 수원화성', 'Korean Folk Village · Everland · Suwon Hwaseong', '韩国民俗村 · 爱宝乐园 · 水原华城', '韓国民俗村・エバーランド・水原華城', 'Aldea folclórica · Everland · fortaleza de Suwon', 'Làng dân gian · Everland · pháo đài Suwon', 'Village folklorique · Everland · forteresse de Suwon', 'Aldeia folclórica · Everland · fortaleza de Suwon', 'Фольклорная деревня · Эверленд · крепость Сувона', 'Desa Rakyat · Everland · Benteng Suwon'],
    tips: [
      ['한국민속촌은 강남역 1560번·신논현 5001-1번·서울역 4101번 직행버스로 환승 없이 약 50분. 여권 제시 시 외국인 22,000원.',
        'Korean Folk Village: direct buses 1560 (Gangnam Stn), 5001-1 (Sinnonhyeon) and 4101 (Seoul Stn) take ≈50 min with no transfer. With a passport, the foreign-visitor ticket is ₩22,000.',
        '韩国民俗村：江南站 1560 路、新论岘 5001-1 路、首尔站 4101 路直达约 50 分钟。出示护照外国人票 22,000 韩元。',
        '韓国民俗村：江南駅1560番・新論峴5001-1番・ソウル駅4101番の直行バスで乗換なし約50分。パスポート提示で外国人22,000ウォン。',
        'Aldea folclórica: buses directos 1560 (Gangnam), 5001-1 (Sinnonhyeon) y 4101 (Seúl) ≈50 min sin transbordo. Con pasaporte, entrada de extranjero ₩22.000.',
        'Làng dân gian: buýt thẳng 1560 (Gangnam), 5001-1 (Sinnonhyeon), 4101 (Seoul) ~50 phút không đổi tuyến. Đưa hộ chiếu, vé người nước ngoài 22.000 KRW.',
        'Village folklorique : bus directs 1560 (Gangnam), 5001-1 (Sinnonhyeon) et 4101 (Séoul) ≈50 min sans correspondance. Avec passeport, tarif étranger 22 000 ₩.',
        'Aldeia folclórica: ônibus diretos 1560 (Gangnam), 5001-1 (Sinnonhyeon) e 4101 (Seul) ≈50 min sem baldeação. Com passaporte, ingresso de estrangeiro ₩22.000.',
        'Фольклорная деревня: прямые автобусы 1560 (Каннам), 5001-1 (Синнонхён), 4101 (Сеул) ≈50 мин без пересадок. С паспортом билет для иностранца 22 000 вон.',
        'Desa Rakyat: bus langsung 1560 (Gangnam), 5001-1 (Sinnonhyeon), 4101 (Seoul) ≈50 menit tanpa transit. Tunjukkan paspor, tiket asing ₩22.000.'],
      ['에버랜드는 강남 5002번·서울역 4105번으로 약 40~70분, 기흥역 에버라인 28분+무료 셔틀. 11월은 일~목 10:00~20:00, 금·토 21:00.',
        'Everland: bus 5002 from Gangnam or 4105 from Seoul Station ≈40–70 min, or EverLine from Giheung Stn (28 min) + free shuttle. In November, Sun–Thu 10:00–20:00, Fri–Sat until 21:00.',
        '爱宝乐园：江南 5002 路、首尔站 4105 路约 40~70 分钟，或器兴站爱宝线 28 分钟+免费接驳。11 月周日~周四 10:00~20:00，周五·周六至 21:00。',
        'エバーランド：江南5002番・ソウル駅4105番で約40〜70分、器興駅エバーライン28分＋無料シャトル。11月は日〜木10:00〜20:00、金・土21:00。',
        'Everland: bus 5002 desde Gangnam o 4105 desde Seúl ≈40–70 min, o EverLine desde Giheung (28 min) + lanzadera gratuita. En noviembre, dom–jue 10:00–20:00, vie–sáb hasta 21:00.',
        'Everland: buýt 5002 từ Gangnam hoặc 4105 từ Seoul ~40–70 phút, hoặc EverLine từ Ga Giheung 28 phút + shuttle miễn phí. Tháng 11: CN–T5 10:00–20:00, T6–T7 đến 21:00.',
        'Everland : bus 5002 depuis Gangnam ou 4105 depuis Séoul ≈40–70 min, ou EverLine depuis Giheung (28 min) + navette gratuite. En novembre, dim–jeu 10 h–20 h, ven–sam jusqu’à 21 h.',
        'Everland: ônibus 5002 de Gangnam ou 4105 de Seul ≈40–70 min, ou EverLine de Giheung (28 min) + shuttle grátis. Em novembro, dom–qui 10h–20h, sex–sáb até 21h.',
        'Эверленд: автобус 5002 из Каннама или 4105 от Сеула ≈40–70 мин, либо EverLine от Кихына (28 мин) + бесплатный шаттл. В ноябре вс–чт 10:00–20:00, пт–сб до 21:00.',
        'Everland: bus 5002 dari Gangnam atau 4105 dari Seoul ≈40–70 menit, atau EverLine dari Giheung 28 menit + shuttle gratis. November: Min–Kam 10.00–20.00, Jum–Sab sampai 21.00.'],
      ['수원화성 행궁은 월요일 휴관, 성곽 산책로는 상시 개방. 수원역에서 버스 10분, 야간 조명은 18시 이후 켜집니다.',
        'Hwaseong Haenggung palace closes Mondays; the fortress walk is always open. Ten minutes by bus from Suwon Station, and the walls are lit after 18:00.',
        '华城行宫周一闭馆，城墙步道常年开放。水原站乘巴士 10 分钟，18 时后城墙亮灯。',
        '水原華城の行宮は月曜休館、城郭の散策路は常時開放。水原駅からバス10分、18時以降はライトアップ。',
        'El palacio Hwaseong Haenggung cierra los lunes; la muralla siempre está abierta. A 10 min en bus desde Suwon y se ilumina tras las 18:00.',
        'Cung Hwaseong Haenggung đóng thứ Hai; tường thành mở cả ngày. Cách ga Suwon 10 phút xe buýt, đèn sáng sau 18:00.',
        'Le palais Hwaseong Haenggung ferme le lundi ; les remparts restent ouverts. À 10 min en bus de Suwon, éclairés après 18 h.',
        'O palácio Hwaseong Haenggung fecha às segundas; a muralha fica sempre aberta. A 10 min de ônibus de Suwon, iluminada após as 18h.',
        'Дворец Хвасон Хэнггун закрыт по понедельникам, стены открыты всегда. 10 мин на автобусе от Сувона, подсветка после 18:00.',
        'Istana Hwaseong Haenggung tutup Senin; jalur benteng selalu buka. 10 menit bus dari Stasiun Suwon, lampu menyala setelah 18.00.']
    ],
    picks: {
      stay: [
        { t: ['민속촌 인근 한옥 스테이 · 전통 온돌방', 'Hanok stay near the Folk Village · ondol room', '民俗村旁韩屋民宿 · 传统温突房', '民俗村近くの韓屋ステイ · 伝統オンドル部屋', 'Estancia hanok junto a la aldea · suelo ondol', 'Nhà hanok gần làng · phòng sưởi ondol', 'Séjour hanok près du village · chambre ondol', 'Estadia hanok perto da aldeia · quarto ondol', 'Ханок у деревни · комната с ондолем', 'Menginap hanok dekat desa · kamar ondol'], pi: 15 },
        { t: ['수원역 비즈니스 호텔 · 화성행궁 도보 10분', 'Suwon Station business hotel · 10 min walk to Hwaseong Haenggung', '水原站商务酒店 · 步行 10 分钟到华城行宫', '水原駅ビジネスホテル · 華城行宮まで徒歩10分', 'Hotel de negocios en Suwon · 10 min a pie del palacio', 'Khách sạn Suwon · 10 phút đi bộ tới cung', 'Hôtel d’affaires à Suwon · 10 min à pied du palais', 'Hotel em Suwon · 10 min a pé do palácio', 'Бизнес-отель у вокзала Сувона · 10 мин до дворца', 'Hotel bisnis Stasiun Suwon · 10 menit ke istana'], pi: 12 },
        { t: ['에버랜드 리조트 · 셔틀 5분', 'Everland resort · 5 min shuttle', '爱宝乐园度假村 · 接驳 5 分钟', 'エバーランドリゾート · シャトル5分', 'Resort Everland · lanzadera 5 min', 'Resort Everland · shuttle 5 phút', 'Resort Everland · navette 5 min', 'Resort Everland · shuttle 5 min', 'Курорт Эверленд · шаттл 5 мин', 'Resort Everland · shuttle 5 menit'], pi: 22 }
      ],      culture: [
        { t: ['한국민속촌 입장 + 전통공연·줄타기 관람', 'Folk Village entry + traditional performance and tightrope show', '民俗村门票 + 传统演出·走绳表演', '民俗村入場＋伝統公演・綱渡り観覧', 'Entrada a la aldea + espectáculo tradicional y funambulismo', 'Vé làng + biểu diễn truyền thống & đi dây', 'Entrée du village + spectacle traditionnel et funambule', 'Ingresso na aldeia + show tradicional e equilibrista', 'Вход в деревню + традиционные шоу и канатоходец', 'Tiket desa + pertunjukan tradisional & tali'], pi: 9 },
        { t: ['에버랜드 종일권 + 스마트예약 대행', 'Everland full-day ticket + smart reservation', '爱宝乐园全日票 + 智能预约代订', 'エバーランド1日券＋スマート予約代行', 'Entrada de día completo a Everland + reserva', 'Vé cả ngày Everland + đặt chỗ', 'Billet journée Everland + réservation', 'Ingresso dia inteiro Everland + reserva', 'Эверленд на весь день + бронь', 'Tiket sehari Everland + reservasi'], pi: 16 },
        { t: ['수원화성 성곽 자전거 + 화성행궁 해설', 'Hwaseong fortress bike ride + palace guide', '华城城墙骑行 + 行宫讲解', '水原華城の城郭サイクリング＋行宮解説', 'Bici por la muralla + guía del palacio', 'Đạp xe quanh thành + hướng dẫn cung', 'Vélo sur les remparts + guide du palais', 'Bike na muralha + guia do palácio', 'Велосипед по стенам + гид по дворцу', 'Sepeda keliling benteng + pemandu istana'], pi: 7 }
      ],
      food: [
        { t: ['민속촌 장터 국수·전통주 시식', 'Folk market noodles & traditional rice wine tasting', '民俗村集市面条·传统酒品尝', '民俗村の市場で麺類・伝統酒試飲', 'Fideos del mercado y cata de vino tradicional', 'Mì chợ làng & nếm rượu truyền thống', 'Nouilles du marché et dégustation de vin de riz', 'Macarrão do mercado e degustação de vinho de arroz', 'Лапша на рынке и дегустация традиционного вина', 'Mi pasar desa & cicip arak tradisional'], pi: 4 },
        { t: ['수원 왕갈비 · 통닭거리', 'Suwon king galbi · fried-chicken street', '水原王排骨 · 炸鸡街', '水原キングカルビ・タッカンジョン通り', 'Galbi rey de Suwon · calle del pollo frito', 'Sườn vua Suwon · phố gà rán', 'Galbi royal de Suwon · rue du poulet frit', 'Galbi rei de Suwon · rua do frango frito', 'Королевский кальби Сувона · улица жареной курицы', 'Galbi raja Suwon · jalan ayam goreng'], pi: 6 },
        { t: ['에버랜드 도시락·간식 패키지', 'Everland lunch box & snack pack', '爱宝乐园便当·零食包', 'エバーランド弁当＆おやつパック', 'Fiambrera y snacks para Everland', 'Cơm hộp & đồ ăn vặt Everland', 'Panier repas et snacks pour Everland', 'Marmita e lanches para Everland', 'Ланч-бокс и снеки в Эверленд', 'Bekal & camilan Everland'], pi: 3 }
      ],
      transit: [
        { t: ['강남역 1560번 직행버스 안내 · 약 50분', 'Gangnam Stn bus 1560 direct · ≈50 min', '江南站 1560 路直达 · 约 50 分钟', '江南駅1560番直行 · 約50分', 'Bus 1560 desde Gangnam · ≈50 min', 'Buýt 1560 từ Gangnam · ~50 phút', 'Bus 1560 depuis Gangnam · ≈50 min', 'Ônibus 1560 de Gangnam · ≈50 min', 'Автобус 1560 от Каннама · ≈50 мин', 'Bus 1560 dari Gangnam · ≈50 menit'], pi: 2 },
        { t: ['서울역 4105번 · 명동 경유 에버랜드 직행', 'Seoul Stn bus 4105 · direct to Everland via Myeongdong', '首尔站 4105 路 · 明洞经停直达爱宝乐园', 'ソウル駅4105番 · 明洞経由エバーランド直行', 'Bus 4105 desde Seúl · directo vía Myeongdong', 'Buýt 4105 từ Seoul · thẳng qua Myeongdong', 'Bus 4105 depuis Séoul · direct via Myeongdong', 'Ônibus 4105 de Seul · direto via Myeongdong', 'Автобус 4105 от Сеула · прямой через Мёндон', 'Bus 4105 dari Seoul · langsung via Myeongdong'], pi: 2 },
        { t: ['기흥역 에버라인 + 무료 셔틀 가이드', 'Giheung Stn EverLine + free shuttle guide', '器兴站爱宝线 + 免费接驳指南', '器興駅エバーライン＋無料シャトル案内', 'EverLine desde Giheung + lanzadera gratis', 'EverLine từ Giheung + shuttle miễn phí', 'EverLine depuis Giheung + navette gratuite', 'EverLine de Giheung + shuttle grátis', 'EverLine от Кихына + бесплатный шаттл', 'EverLine dari Giheung + shuttle gratis'], pi: 1 }
      ]
    }
  },

  /* ── 3. BUSAN ─────────────────────────────────────────────── */
  {
    key: 'BUSAN',
    code: 'BUSAN',
    sub: ['해변 & 야경', 'beaches & night views', '海滩·夜景', 'ビーチ＆夜景', 'playas y noches', 'biển & đêm', 'plages et nuit', 'praias e noite', 'пляжи и ночь', 'pantai & malam'],
    venues: ['해운대 · 광안리 · 감천 · 자갈치', 'Haeundae · Gwangalli · Gamcheon · Jagalchi', '海云台 · 广安里 · 甘川 · 札嘎其', '海雲台・広安里・甘川・チャガルチ', 'Haeundae · Gwangalli · Gamcheon · Jagalchi', 'Haeundae · Gwangalli · Gamcheon · Jagalchi', 'Haeundae · Gwangalli · Gamcheon · Jagalchi', 'Haeundae · Gwangalli · Gamcheon · Jagalchi', 'Хэундэ · Кванъан · Камчхон · Чакальчи', 'Haeundae · Gwangalli · Gamcheon · Jagalchi'],
    tips: [
      ['서울역→부산역 KTX 약 2시간 30분, 부산역→해운대 2호선 40분. 김해공항→해운대 리무진 약 50분.',
        'Seoul to Busan by KTX ≈2 h 30 min; Busan Station to Haeundae is 40 min on Line 2. Gimhae Airport to Haeundae limousine ≈50 min.',
        '首尔站→釜山站 KTX 约 2 小时 30 分，釜山站→海云台 2 号线 40 分钟。金海机场→海云台大巴约 50 分钟。',
        'ソウル駅→釜山駅 KTX 約2時間30分、釜山駅→海雲台は2号線40分。金海空港→海雲台リムジン約50分。',
        'Seúl→Busan en KTX ≈2 h 30 min; Busan→Haeundae 40 min en línea 2. Aeropuerto de Gimhae→Haeundae ≈50 min.',
        'Seoul→Busan bằng KTX ~2 giờ 30 phút; Busan→Haeundae 40 phút tuyến 2. Sân bay Gimhae→Haeundae ~50 phút.',
        'Séoul→Busan en KTX ≈2 h 30 ; Busan→Haeundae 40 min ligne 2. Aéroport de Gimhae→Haeundae ≈50 min.',
        'Seul→Busan de KTX ≈2h30; Busan→Haeundae 40 min na linha 2. Aeroporto de Gimhae→Haeundae ≈50 min.',
        'Сеул→Пусан на KTX ≈2 ч 30 мин; Пусан→Хэундэ 40 мин по линии 2. Аэропорт Кимпхэ→Хэундэ ≈50 мин.',
        'Seoul→Busan naik KTX ≈2 jam 30 menit; Busan→Haeundae 40 menit jalur 2. Bandara Gimhae→Haeundae ≈50 menit.'],
      ['감천문화마을: 1호선 토성역 6번 출구 → 마을버스 2-2로 약 10분. 주민이 사는 곳이라 21시 이후에는 조용히.',
        'Gamcheon Culture Village: Line 1 Toseong Stn exit 6 → village bus 2-2, ≈10 min. People live here, so keep quiet after 21:00.',
        '甘川文化村：1 号线土城站 6 号出口 → 村巴士 2-2 约 10 分钟。居民区，21 时后请安静。',
        '甘川文化村：1号線土城駅6番出口→マウルバス2-2で約10分。住民の生活区域なので21時以降は静かに。',
        'Barrio cultural de Gamcheon: línea 1, Toseong salida 6 → bus 2-2, ≈10 min. Es zona residencial: silencio después de las 21:00.',
        'Làng văn hoá Gamcheon: tuyến 1, ga Toseong cửa 6 → buýt làng 2-2 ~10 phút. Khu dân cư, giữ yên tĩnh sau 21:00.',
        'Village culturel de Gamcheon : ligne 1, Toseong sortie 6 → bus 2-2, ≈10 min. Zone habitée : silence après 21 h.',
        'Vila cultural de Gamcheon: linha 1, Toseong saída 6 → ônibus 2-2, ≈10 min. Área residencial: silêncio após 21h.',
        'Культурная деревня Камчхон: линия 1, Тосон, выход 6 → автобус 2-2 ≈10 мин. Здесь живут люди — тишина после 21:00.',
        'Desa Budaya Gamcheon: jalur 1, Toseong pintu 6 → bus desa 2-2 ≈10 menit. Kawasan hunian, tenang setelah 21.00.'],
      ['블루라인파크 해변열차·스카이캡슐은 주말이면 일찍 매진 — 최소 1주 전 예약. 자갈치시장은 09:00~22:00.',
        'The Blueline Park beach train and Sky Capsule sell out early at weekends — book at least a week ahead. Jagalchi Market runs 09:00–22:00.',
        '蓝线公园海边列车·天空胶囊周末常售罄——至少提前 1 周预订。札嘎其市场 09:00~22:00。',
        'ブルーラインパークの海岸列車・スカイカプセルは週末早々に完売 — 1週間前までの予約を。チャガルチ市場は09:00〜22:00。',
        'El tren de playa y el Sky Capsule de Blueline Park se agotan pronto los fines de semana: reserva con una semana. Jagalchi abre 09:00–22:00.',
        'Tàu biển và Sky Capsule Blueline Park cháy vé cuối tuần — đặt trước ít nhất 1 tuần. Chợ Jagalchi 09:00–22:00.',
        'Le train de plage et le Sky Capsule de Blueline Park partent vite le week-end : réservez une semaine avant. Jagalchi ouvre 9 h–22 h.',
        'O trem da praia e o Sky Capsule do Blueline Park esgotam nos fins de semana: reserve com uma semana. Jagalchi abre 09h–22h.',
        'Пляжный поезд и Sky Capsule в Blueline Park разбирают на выходные — бронируйте за неделю. Рынок Чакальчи 09:00–22:00.',
        'Kereta pantai dan Sky Capsule Blueline Park cepat habis akhir pekan — pesan minimal seminggu sebelumnya. Pasar Jagalchi 09.00–22.00.']
    ],
    picks: {
      stay: [
        { t: ['해운대 오션뷰 호텔 · 해변 도보 3분', 'Haeundae ocean-view hotel · 3 min to the beach', '海云台海景酒店 · 步行 3 分钟到海滩', '海雲台オーシャンビューホテル · ビーチ徒歩3分', 'Hotel con vistas al mar en Haeundae · 3 min de la playa', 'Khách sạn view biển Haeundae · 3 phút ra bãi', 'Hôtel vue mer à Haeundae · 3 min de la plage', 'Hotel vista mar em Haeundae · 3 min da praia', 'Отель с видом на море в Хэундэ · 3 мин до пляжа', 'Hotel view laut Haeundae · 3 menit ke pantai'], pi: 19 },
        { t: ['광안리 루프탑 스테이 · 야경 정면', 'Gwangalli rooftop stay · night view in front', '广安里屋顶民宿 · 正对夜景', '広安里ルーフトップステイ · 夜景の正面', 'Estancia con azotea en Gwangalli · vistas nocturnas', 'Nhà sân thượng Gwangalli · thẳng cảnh đêm', 'Séjour avec toit-terrasse à Gwangalli · vue nuit', 'Estadia com terraço em Gwangalli · vista noturna', 'Жильё с террасой в Кванъане · вид на ночь', 'Penginapan rooftop Gwangalli · view malam'], pi: 17 },
        { t: ['서면 게스트하우스 · KTX역 15분', 'Seomyeon guesthouse · 15 min to KTX station', '西面民宿 · 距 KTX 站 15 分钟', '西面ゲストハウス · KTX駅15分', 'Casa de huéspedes en Seomyeon · 15 min de la estación KTX', 'Nhà nghỉ Seomyeon · 15 phút tới ga KTX', 'Maison d’hôtes à Seomyeon · 15 min de la gare KTX', 'Guesthouse em Seomyeon · 15 min da estação KTX', 'Гостевой дом Сомён · 15 мин до вокзала KTX', 'Guesthouse Seomyeon · 15 menit ke stasiun KTX'], pi: 8 }
      ],
      culture: [
        { t: ['해운대 블루라인파크 해변열차 예약 대행', 'Blueline Park beach train, booked for you', '蓝线公园海边列车代订', 'ブルーラインパーク海岸列車の予約代行', 'Tren de playa Blueline Park reservado', 'Đặt tàu biển Blueline Park', 'Train de plage Blueline Park réservé', 'Trem da praia Blueline Park reservado', 'Пляжный поезд Blueline Park с бронью', 'Kereta pantai Blueline Park dipesan'], pi: 7 },
        { t: ['감천문화마을 도보 투어 + 사진 스팟', 'Gamcheon village walking tour + photo spots', '甘川文化村徒步游 + 拍照点', '甘川文化村の徒歩ツアー＋撮影スポット', 'Tour a pie por Gamcheon + puntos fotográficos', 'Tour đi bộ Gamcheon + điểm chụp ảnh', 'Visite à pied de Gamcheon + spots photo', 'Tour a pé por Gamcheon + pontos de foto', 'Пешая экскурсия по Камчхону + фотоместа', 'Tur jalan kaki Gamcheon + spot foto'], pi: 4 },
        { t: ['부산시티투어 순환버스 1일권', 'Busan city tour loop bus day pass', '釜山城市游循环巴士一日券', '釜山シティツアー循環バス1日券', 'Bono de un día del bus turístico de Busan', 'Vé 1 ngày buýt vòng quanh Busan', 'Pass journée du bus touristique de Busan', 'Passe de um dia do ônibus turístico de Busan', 'Дневной билет на круговой тур-автобус Пусана', 'Tiket sehari bus wisata Busan'], pi: 5 }
      ],
      food: [
        { t: ['자갈치시장 해산물 시식 · 점심 세트', 'Jagalchi Market seafood tasting · lunch set', '札嘎其市场海鲜品尝 · 午餐套餐', 'チャガルチ市場の海鮮試食 · ランチセット', 'Degustación de marisco en Jagalchi · menú', 'Thử hải sản chợ Jagalchi · set trưa', 'Dégustation de fruits de mer à Jagalchi · déjeuner', 'Degustação de frutos do mar em Jagalchi · almoço', 'Дегустация морепродуктов на Чакальчи · обед', 'Cicip seafood Pasar Jagalchi · paket makan siang'], pi: 8 },
        { t: ['광안리 밀락더마켓 야식', 'Gwangalli Millak the Market late-night eats', '广安里 Millak the Market 夜宵', '広安里ミラク・ザ・マーケットの夜食', 'Cena tardía en Millak the Market (Gwangalli)', 'Ăn đêm Millak the Market (Gwangalli)', 'Repas tardif à Millak the Market (Gwangalli)', 'Comida noturna no Millak the Market (Gwangalli)', 'Поздний ужин в Millak the Market (Кванъан)', 'Makan malam Millak the Market (Gwangalli)'], pi: 6 },
        { t: ['부산 어묵·돼지국밥 로컬 투어', 'Busan fish cake & pork soup local tour', '釜山鱼饼·猪肉汤饭本地游', '釜山の練り物・テジクッパ地元ツアー', 'Tour local de pastel de pescado y sopa de cerdo', 'Tour địa phương chả cá & canh thịt heo', 'Tour local chikuwa et soupe de porc', 'Tour local de bolinho de peixe e sopa de porco', 'Местный тур: рыбные лепёшки и суп со свининой', 'Tur lokal odeng & sup babi'], pi: 5 }
      ],
      transit: [
        { t: ['KTX 서울→부산 2시간 30분 · 좌석 예약 대행', 'KTX Seoul→Busan 2 h 30 min · seat booking', 'KTX 首尔→釜山 2 小时 30 分 · 代订座位', 'KTX ソウル→釜山 2時間30分 · 座席予約代行', 'KTX Seúl→Busan 2 h 30 · reserva de asiento', 'KTX Seoul→Busan 2 giờ 30 · đặt ghế', 'KTX Séoul→Busan 2 h 30 · réservation de siège', 'KTX Seul→Busan 2h30 · reserva de assento', 'KTX Сеул→Пусан 2 ч 30 · бронь места', 'KTX Seoul→Busan 2 jam 30 · pesan kursi'], pi: 5 },
        { t: ['김해공항→해운대 리무진 안내', 'Gimhae Airport→Haeundae limousine guide', '金海机场→海云台大巴指南', '金海空港→海雲台リムジン案内', 'Guía de limusina Gimhae→Haeundae', 'Hướng dẫn limousine Gimhae→Haeundae', 'Guide navette Gimhae→Haeundae', 'Guia da limusine Gimhae→Haeundae', 'Гид по лимузину Кимпхэ→Хэундэ', 'Panduan limusin Gimhae→Haeundae'], pi: 2 },
        { t: ['지하철 1·2호선 + 버스 환승 가이드', 'Line 1 / 2 + bus transfer guide', '地铁 1·2 号线 + 公交换乘指南', '地下鉄1・2号線＋バス乗換ガイド', 'Guía de líneas 1/2 y transbordo a bus', 'Hướng dẫn tuyến 1/2 + chuyển buýt', 'Guide lignes 1/2 + correspondance bus', 'Guia linhas 1/2 + baldeação de ônibus', 'Гид по линиям 1/2 и пересадкам на автобус', 'Panduan jalur 1/2 + transit bus'], pi: 1 }
      ]
    }
  },

  /* ── 4. GYEONGJU ──────────────────────────────────────────── */
  {
    key: 'GYEONGJU',
    code: 'GYEONGJU',
    sub: ['천년 고도', 'thousand-year capital', '千年古都', '千年古都', 'capital milenaria', 'cố đô ngàn năm', 'capitale millénaire', 'capital milenar', 'столица тысячелетия', 'ibu kota seribu tahun'],
    venues: ['불국사 · 석굴암 · 첨성대 · 황리단길', 'Bulguksa · Seokguram · Cheomseongdae · Hwangnidan-gil', '佛国寺 · 石窟庵 · 瞻星台 · 皇理团街', '仏国寺・石窟庵・瞻星台・ファンリダンギル', 'Bulguksa · Seokguram · Cheomseongdae · Hwangnidan-gil', 'Bulguksa · Seokguram · Cheomseongdae · Hwangnidan-gil', 'Bulguksa · Seokguram · Cheomseongdae · Hwangnidan-gil', 'Bulguksa · Seokguram · Cheomseongdae · Hwangnidan-gil', 'Пульгукса · Соккурам · Чхомсондэ · Хваннидан-гиль', 'Bulguksa · Seokguram · Cheomseongdae · Hwangnidan-gil'],
    tips: [
      ['서울역→신경주역 KTX 약 2시간 10분, 신경주역→불국사 700번 버스 약 40분.',
        'Seoul Station to Singyeongju by KTX ≈2 h 10 min; Singyeongju to Bulguksa is bus 700, ≈40 min.',
        '首尔站→新庆州站 KTX 约 2 小时 10 分，新庆州站→佛国寺 700 路约 40 分钟。',
        'ソウル駅→新慶州駅 KTX 約2時間10分、新慶州駅→仏国寺は700番バスで約40分。',
        'Seúl→Singyeongju en KTX ≈2 h 10; de allí a Bulguksa, bus 700 ≈40 min.',
        'Seoul→Singyeongju bằng KTX ~2 giờ 10; từ ga tới Bulguksa, buýt 700 ~40 phút.',
        'Séoul→Singyeongju en KTX ≈2 h 10 ; puis bus 700 jusqu’à Bulguksa, ≈40 min.',
        'Seul→Singyeongju de KTX ≈2h10; de lá a Bulguksa, ônibus 700 ≈40 min.',
        'Сеул→Синкёнджу на KTX ≈2 ч 10 мин; далее автобус 700 до Пульгуксы ≈40 мин.',
        'Seoul→Singyeongju naik KTX ≈2 jam 10; lanjut bus 700 ke Bulguksa ≈40 menit.'],
      ['불국사 09:00~18:00(입장 마감 17:30), 석굴암은 셔틀버스로 12분. 석굴암 내부는 촬영 금지입니다.',
        'Bulguksa is open 09:00–18:00 (last entry 17:30); Seokguram is 12 min by shuttle. No photos inside Seokguram.',
        '佛国寺 09:00~18:00（17:30 停止入场），石窟庵乘接驳车 12 分钟。石窟庵内部禁止拍照。',
        '仏国寺は09:00〜18:00（入場締切17:30）、石窟庵へはシャトルで12分。石窟庵内部は撮影禁止。',
        'Bulguksa abre 09:00–18:00 (última entrada 17:30); Seokguram está a 12 min en lanzadera. No se puede fotografiar dentro.',
        'Bulguksa mở 09:00–18:00 (ngừng vào 17:30); Seokguram cách 12 phút bằng shuttle. Không chụp ảnh bên trong.',
        'Bulguksa ouvre 9 h–18 h (dernière entrée 17 h 30) ; Seokguram à 12 min en navette. Photos interdites à l’intérieur.',
        'Bulguksa abre 09h–18h (última entrada 17h30); Seokguram fica a 12 min de shuttle. Sem fotos no interior.',
        'Пульгукса 09:00–18:00 (вход до 17:30), до Соккурама 12 мин на шаттле. Внутри съёмка запрещена.',
        'Bulguksa buka 09.00–18.00 (masuk terakhir 17.30); Seokguram 12 menit naik shuttle. Dilarang memotret di dalam.'],
      ['황리단길 한옥 스테이는 주말 2~3주 전 마감. 동궁과월지 야경은 21:30까지(입장 마감 21:00).',
        'Hwangnidan-gil hanok stays sell out 2–3 weeks ahead for weekends. Donggung Palace night viewing runs to 21:30 (last entry 21:00).',
        '皇理团街韩屋民宿周末需提前 2~3 周。东宫与月池夜景开放至 21:30（21:00 停止入场）。',
        'ファンリダンギルの韓屋ステイは週末2〜3週間前に埋まります。東宮と月池の夜景は21:30まで（入場締切21:00）。',
        'Las estancias hanok de Hwangnidan-gil se agotan 2–3 semanas antes los fines de semana. El palacio Donggung abre de noche hasta 21:30 (entrada 21:00).',
        'Nhà hanok Hwangnidan-gil kín chỗ trước 2–3 tuần vào cuối tuần. Cung Donggung mở đêm đến 21:30 (vào trước 21:00).',
        'Les séjours hanok de Hwangnidan-gil partent 2–3 semaines avant le week-end. Le palais Donggung ouvre jusqu’à 21 h 30 (entrée 21 h).',
        'As estadas hanok de Hwangnidan-gil esgotam 2–3 semanas antes nos fins de semana. O palácio Donggung abre até 21h30 (entrada 21h).',
        'Ханоки на Хваннидан-гиль разбирают за 2–3 недели до выходных. Дворец Тонгун открыт до 21:30 (вход до 21:00).',
        'Penginapan hanok Hwangnidan-gil penuh 2–3 minggu sebelumnya di akhir pekan. Istana Donggung buka sampai 21.30 (masuk 21.00).']
    ],
    picks: {
      stay: [
        { t: ['황리단길 한옥 스테이 · 마당 있는 독채', 'Hwangnidan-gil hanok stay · private house with courtyard', '皇理团街韩屋 · 带庭院的独栋', 'ファンリダンギルの韓屋 · 中庭付き一棟', 'Casa hanok en Hwangnidan-gil · patio privado', 'Nhà hanok Hwangnidan-gil · sân riêng', 'Maison hanok à Hwangnidan-gil · cour privée', 'Casa hanok em Hwangnidan-gil · quintal privado', 'Ханок на Хваннидан-гиль · дом с двором', 'Hanok Hwangnidan-gil · rumah dengan halaman'], pi: 20 },
        { t: ['보문호 리조트 · 자전거 무료', 'Bomun Lake resort · free bikes', '普门湖度假村 · 免费自行车', '普門湖リゾート · 自転車無料', 'Resort del lago Bomun · bicis gratis', 'Resort hồ Bomun · xe đạp miễn phí', 'Resort du lac Bomun · vélos gratuits', 'Resort do lago Bomun · bikes grátis', 'Курорт у озера Помун · велосипеды бесплатно', 'Resort Danau Bomun · sepeda gratis'], pi: 17 },
        { t: ['경주역 비즈니스 호텔 · KTX 도보 5분', 'Gyeongju Station hotel · 5 min walk to KTX', '庆州站商务酒店 · 步行 5 分钟到 KTX', '慶州駅ビジネスホテル · KTXまで徒歩5分', 'Hotel en la estación de Gyeongju · 5 min del KTX', 'Khách sạn ga Gyeongju · 5 phút tới KTX', 'Hôtel à la gare de Gyeongju · 5 min du KTX', 'Hotel na estação de Gyeongju · 5 min do KTX', 'Отель у вокзала Кёнджу · 5 мин до KTX', 'Hotel Stasiun Gyeongju · 5 menit ke KTX'], pi: 11 }
      ],
      culture: [
        { t: ['불국사·석굴암 입장 + 셔틀 예약', 'Bulguksa & Seokguram entry + shuttle booking', '佛国寺·石窟庵门票 + 接驳预约', '仏国寺・石窟庵の入場＋シャトル予約', 'Entrada a Bulguksa y Seokguram + lanzadera', 'Vé Bulguksa & Seokguram + shuttle', 'Entrée Bulguksa et Seokguram + navette', 'Ingresso Bulguksa e Seokguram + shuttle', 'Вход в Пульгуксу и Соккурам + шаттл', 'Tiket Bulguksa & Seokguram + shuttle'], pi: 6 },
        { t: ['첨성대·동궁과월지 야경 투어', 'Cheomseongdae & Donggung night-view tour', '瞻星台·东宫月池夜景游', '瞻星台・東宮と月池の夜景ツアー', 'Tour nocturno por Cheomseongdae y Donggung', 'Tour đêm Cheomseongdae & Donggung', 'Tour nocturne Cheomseongdae et Donggung', 'Tour noturno por Cheomseongdae e Donggung', 'Ночной тур: Чхомсондэ и Тонгун', 'Tur malam Cheomseongdae & Donggung'], pi: 5 },
        { t: ['교촌마을 한복 대여 + 사진 촬영', 'Gyochon hanok village hanbok rental + photos', '校村韩屋村韩服租借 + 拍照', '校村の韓服レンタル＋撮影', 'Alquiler de hanbok en Gyochon + fotos', 'Thuê hanbok Gyochon + chụp ảnh', 'Location de hanbok à Gyochon + photos', 'Aluguel de hanbok em Gyochon + fotos', 'Прокат ханбока в Кёчхоне + фото', 'Sewa hanbok Gyochon + foto'], pi: 8 }
      ],
      food: [
        { t: ['경주빵·황남빵 디저트 세트', 'Gyeongju bread & Hwangnam bread dessert set', '庆州面包·皇南饼甜点套餐', '慶州パン・皇南パンのデザートセット', 'Set de dulces: pan de Gyeongju y Hwangnam', 'Set bánh ngọt Gyeongju & Hwangnam', 'Assortiment de pâtisseries Gyeongju et Hwangnam', 'Kit de doces: pão de Gyeongju e Hwangnam', 'Набор сладостей: хлеб Кёнджу и Хваннам', 'Paket kue Gyeongju & Hwangnam'], pi: 3 },
        { t: ['황리단길 한정식 · 비빔밥', 'Hwangnidan-gil hanjeongsik · bibimbap', '皇理团街韩定食 · 拌饭', 'ファンリダンギルの韓定食 · ビビンバ', 'Hanjeongsik en Hwangnidan-gil · bibimbap', 'Hanjeongsik Hwangnidan-gil · bibimbap', 'Hanjeongsik à Hwangnidan-gil · bibimbap', 'Hanjeongsik em Hwangnidan-gil · bibimbap', 'Ханджонсик на Хваннидан-гиль · пибимпап', 'Hanjeongsik Hwangnidan-gil · bibimbap'], pi: 7 },
        { t: ['보문호 카페 & 전통차', 'Bomun Lake cafe & traditional tea', '普门湖咖啡 & 传统茶', '普門湖カフェ＆伝統茶', 'Café del lago Bomun y té tradicional', 'Cà phê hồ Bomun & trà truyền thống', 'Café du lac Bomun et thé traditionnel', 'Café do lago Bomun e chá tradicional', 'Кафе у озера Помун и традиционный чай', 'Kafe Danau Bomun & teh tradisional'], pi: 4 }
      ],
      transit: [
        { t: ['KTX 서울→신경주 2시간 10분 예약 대행', 'KTX Seoul→Singyeongju 2 h 10 · booking', 'KTX 首尔→新庆州 2 小时 10 分 · 代订', 'KTX ソウル→新慶州 2時間10分 · 予約代行', 'KTX Seúl→Singyeongju 2 h 10 · reserva', 'KTX Seoul→Singyeongju 2 giờ 10 · đặt vé', 'KTX Séoul→Singyeongju 2 h 10 · réservation', 'KTX Seul→Singyeongju 2h10 · reserva', 'KTX Сеул→Синкёнджу 2 ч 10 · бронь', 'KTX Seoul→Singyeongju 2 jam 10 · pesan'], pi: 5 },
        { t: ['신경주역→불국사 700번 버스 안내', 'Singyeongju→Bulguksa bus 700 guide', '新庆州站→佛国寺 700 路指南', '新慶州駅→仏国寺 700番案内', 'Guía del bus 700 a Bulguksa', 'Hướng dẫn buýt 700 tới Bulguksa', 'Guide du bus 700 vers Bulguksa', 'Guia do ônibus 700 para Bulguksa', 'Гид по автобусу 700 до Пульгуксы', 'Panduan bus 700 ke Bulguksa'], pi: 1 },
        { t: ['경주시티투어 순환버스 1일권', 'Gyeongju city tour loop bus day pass', '庆州城市游循环巴士一日券', '慶州シティツアー循環バス1日券', 'Bono de un día del bus turístico de Gyeongju', 'Vé 1 ngày buýt vòng quanh Gyeongju', 'Pass journée du bus touristique de Gyeongju', 'Passe de um dia do ônibus turístico de Gyeongju', 'Дневной билет на тур-автобус Кёнджу', 'Tiket sehari bus wisata Gyeongju'], pi: 4 }
      ]
    }
  },

  /* ── 5. JEJU ──────────────────────────────────────────────── */
  {
    key: 'JEJU',
    code: 'JEJU',
    sub: ['섬 & 자연', 'island & nature', '海岛·自然', '島＆自然', 'isla y naturaleza', 'đảo & thiên nhiên', 'île et nature', 'ilha e natureza', 'остров и природа', 'pulau & alam'],
    venues: ['성산일출봉 · 한라산 · 올레길', 'Seongsan Ilchulbong · Hallasan · Olle Trail', '城山日出峰 · 汉拏山 · 偶来小路', '城山日出峰・漢拏山・オルレ道', 'Seongsan Ilchulbong · Hallasan · ruta Olle', 'Seongsan Ilchulbong · Hallasan · đường Olle', 'Seongsan Ilchulbong · Hallasan · sentier Olle', 'Seongsan Ilchulbong · Hallasan · trilha Olle', 'Сонсан Ильчхульбон · Халласан · тропа Олле', 'Seongsan Ilchulbong · Hallasan · jalur Olle'],
    tips: [
      ['김포→제주 1시간 10분, 인천→제주 1시간 20분. 공항 렌트카 셔틀 5분 — 운전하려면 국제운전면허증이 필수.',
        'Gimpo to Jeju is 1 h 10 min, Incheon to Jeju 1 h 20 min. Rental shuttles leave the airport in 5 min — an International Driving Permit is required to drive.',
        '金浦→济州 1 小时 10 分，仁川→济州 1 小时 20 分。机场租车接驳 5 分钟——自驾必须携带国际驾照。',
        '金浦→済州1時間10分、仁川→済州1時間20分。空港のレンタカーシャトルは5分 — 運転には国際運転免許証が必須。',
        'Gimpo→Jeju 1 h 10, Incheon→Jeju 1 h 20. La lanzadera de alquiler sale del aeropuerto en 5 min; para conducir hace falta el permiso internacional.',
        'Gimpo→Jeju 1 giờ 10, Incheon→Jeju 1 giờ 20. Shuttle thuê xe từ sân bay 5 phút — lái xe phải có bằng lái quốc tế.',
        'Gimpo→Jeju 1 h 10, Incheon→Jeju 1 h 20. Navette de location à 5 min de l’aéroport ; permis international obligatoire pour conduire.',
        'Gimpo→Jeju 1h10, Incheon→Jeju 1h20. Shuttle de locadora a 5 min do aeroporto; para dirigir é preciso licença internacional.',
        'Кимпхо→Чеджу 1 ч 10 мин, Инчхон→Чеджу 1 ч 20 мин. Шаттл проката в 5 мин от аэропорта; для вождения нужны международные права.',
        'Gimpo→Jeju 1 jam 10, Incheon→Jeju 1 jam 20. Shuttle rental 5 menit dari bandara — menyetir wajib SIM internasional.'],
      ['성산일출봉 07:30~19:00(계절 변동, 입장 마감 1시간 전). 한라산은 코스별 입산 통제 시간을 꼭 확인하세요.',
        'Seongsan Ilchulbong opens 07:30–19:00 (seasonal, last entry one hour before). Check the trail-specific cut-off times for Hallasan.',
        '城山日出峰 07:30~19:00（随季节变动，提前 1 小时停止入场）。汉拏山请确认各路线入山管制时间。',
        '城山日出峰は07:30〜19:00（季節変動、入場は1時間前まで）。漢拏山はコース別の入山規制時刻を確認。',
        'Seongsan Ilchulbong abre 07:30–19:00 (según temporada, última entrada 1 h antes). Consulta el horario de cierre de cada ruta del Hallasan.',
        'Seongsan Ilchulbong mở 07:30–19:00 (theo mùa, ngừng vào trước 1 giờ). Kiểm tra giờ chặn vào rừng của từng tuyến Hallasan.',
        'Seongsan Ilchulbong ouvre 7 h 30–19 h (selon saison, dernière entrée 1 h avant). Vérifiez l’heure limite de chaque sentier du Hallasan.',
        'Seongsan Ilchulbong abre 07h30–19h (sazonal, última entrada 1h antes). Confira o horário limite de cada trilha do Hallasan.',
        'Сонсан Ильчхульбон 07:30–19:00 (по сезону, вход за час). Уточняйте время закрытия входов на маршруты Халласана.',
        'Seongsan Ilchulbong buka 07.30–19.00 (musiman, masuk terakhir 1 jam sebelum). Cek jam penutupan tiap jalur Hallasan.'],
      ['제주 급행버스 101·111번이 주요 거점을 잇습니다. 흑돼지·해녀 식당은 주말이면 예약을 권장.',
        'Jeju express buses 101 and 111 link the main hubs. Book black-pork and haenyeo restaurants ahead at weekends.',
        '济州急行巴士 101·111 路连接主要据点。黑猪肉·海女餐厅周末建议预约。',
        '済州急行バス101・111番が主要拠点を結びます。黒豚・海女食堂は週末なら予約を。',
        'Los buses exprés 101 y 111 unen los puntos principales. Los fines de semana, reserva en restaurantes de cerdo negro y haenyeo.',
        'Buýt nhanh 101 và 111 nối các điểm chính. Cuối tuần nên đặt bàn thịt heo đen và quán haenyeo.',
        'Les bus express 101 et 111 relient les pôles principaux. Le week-end, réservez les restaurants de porc noir et haenyeo.',
        'Os ônibus expressos 101 e 111 ligam os principais pontos. Nos fins de semana, reserve nos restaurantes de porco preto e haenyeo.',
        'Экспресс-автобусы 101 и 111 связывают основные точки. На выходных бронируйте рестораны чёрной свинины и хэнё.',
        'Bus ekspres 101 dan 111 menghubungkan titik utama. Akhir pekan sebaiknya reservasi restoran babi hitam dan haenyeo.'],
    ],
    picks: {
      stay: [
        { t: ['성산 오션뷰 스테이 · 일출봉 도보 10분', 'Seongsan ocean-view stay · 10 min walk to the peak', '城山醉美海景民宿 · 步行 10 分到日出峰', '城山オーシャンビューステイ · 日出峰徒歩10分', 'Estancia con vistas al mar en Seongsan · 10 min del pico', 'Nhà view biển Seongsan · 10 phút tới đỉnh', 'Séjour vue mer à Seongsan · 10 min du pic', 'Estadia vista mar em Seongsan · 10 min do pico', 'Жильё с видом на море в Сонсане · 10 мин до пика', 'Penginapan view laut Seongsan · 10 menit ke puncak'], pi: 21 },
        { t: ['한라산 근교 독채 펜션 · 조용한 숲', 'Private pension near Hallasan · quiet forest', '汉拏山旁独栋民宿 · 安静林间', '漢拏山近くの一棟ペンション · 静かな森', 'Pensión privada junto al Hallasan · bosque tranquilo', 'Pension riêng gần Hallasan · rừng yên tĩnh', 'Pension privée près du Hallasan · forêt calme', 'Pousada privada perto do Hallasan · floresta tranquila', 'Отдельный пансион у Халласана · тихий лес', 'Pension privat dekat Hallasan · hutan tenang'], pi: 18 },
        { t: ['제주시 게스트하우스 · 공항 15분', 'Jeju City guesthouse · 15 min from airport', '济州市民宿 · 距机场 15 分钟', '済州市ゲストハウス · 空港15分', 'Casa de huéspedes en Jeju · 15 min del aeropuerto', 'Nhà nghỉ Jeju · 15 phút từ sân bay', 'Maison d’hôtes à Jeju · 15 min de l’aéroport', 'Guesthouse em Jeju · 15 min do aeroporto', 'Гостевой дом в Чеджу · 15 мин от аэропорта', 'Guesthouse Jeju · 15 menit dari bandara'], pi: 9 }
      ],
      culture: [
        { t: ['성산일출봉 입장 + 일출 가이드', 'Seongsan Ilchulbong entry + sunrise guide', '城山日出峰门票 + 日出向导', '城山日出峰の入場＋日の出ガイド', 'Entrada al pico + guía del amanecer', 'Vé đỉnh + hướng dẫn ngắm bình minh', 'Entrée du pic + guide du lever de soleil', 'Ingresso ao pico + guia do nascer do sol', 'Вход на пик + гид по рассвету', 'Tiket puncak + panduan matahari terbit'], pi: 5 },
        { t: ['한라산 어리목·영실 코스 가이드', 'Hallasan Eorimok / Yeongsil trail guide', '汉拏山御里牧·灵室路线向导', '漢拏山オルモク・ヨンシルコースガイド', 'Guía de rutas Eorimok / Yeongsil del Hallasan', 'Hướng dẫn tuyến Eorimok / Yeongsil', 'Guide des sentiers Eorimok / Yeongsil', 'Guia das trilhas Eorimok / Yeongsil', 'Гид по маршрутам Оримок / Йонсиль', 'Panduan jalur Eorimok / Yeongsil'], pi: 6 },
        { t: ['올레 7코스 반나절 트레킹', 'Olle Trail route 7 half-day hike', '偶来小路 7 号半日徒步', 'オルレ7コース半日ハイキング', 'Ruta 7 del Olle, media jornada', 'Đường Olle số 7, nửa ngày', 'Sentier Olle 7, demi-journée', 'Trilha Olle 7, meio dia', 'Тропа Олле №7, полдня', 'Jalur Olle 7, setengah hari'], pi: 7 }
      ],
      food: [
        { t: ['흑돼지 구이 · 제주시 명가 예약', 'Black pork BBQ · reserved at a Jeju City favourite', '烤黑猪肉 · 预订济州市名店', '黒豚焼肉 · 済州市の名店を予約', 'Cerdo negro a la parrilla · reserva en un clásico', 'Thịt heo đen nướng · đặt quán nổi tiếng', 'Porc noir grillé · réservation dans une adresse connue', 'Porco preto na brasa · reserva em casa famosa', 'Чёрная свинина на гриле · бронь в известном месте', 'Babi hitam bakar · reservasi tempat terkenal'], pi: 9 },
        { t: ['해녀 다이닝 · 해산물 코스', 'Haenyeo dining · seafood course', '海女餐厅 · 海鲜套餐', '海女ダイニング · 海鮮コース', 'Cena haenyeo · menú de marisco', 'Nhà hàng haenyeo · set hải sản', 'Table haenyeo · menu fruits de mer', 'Jantar haenyeo · menu de frutos do mar', 'Ужин у хэнё · сет морепродуктов', 'Makan haenyeo · menu seafood'], pi: 12 },
        { t: ['감귤 농장 체험 + 디저트', 'Tangerine farm visit + dessert', '柑橘农场体验 + 甜点', 'みかん農園体験＋デザート', 'Visita a un huerto de mandarinas + postre', 'Tham quan vườn quýt + tráng miệng', 'Visite d’une ferme de mandarines + dessert', 'Visita a um pomar de tangerinas + sobremesa', 'Ферма мандаринов + десерт', 'Kunjungan kebun jeruk + hidangan penutup'], pi: 5 }
      ],
      transit: [
        { t: ['공항 렌트카 픽업 · 국제면허 안내', 'Airport rental pickup · licence check', '机场租车接车 · 国际驾照确认', '空港レンタカー送迎 · 国際免許確認', 'Recogida de coche en el aeropuerto · permiso', 'Nhận xe sân bay · kiểm tra bằng lái', 'Prise en charge à l’aéroport · permis', 'Retirada do carro no aeroporto · licença', 'Получение авто в аэропорту · права', 'Ambil mobil bandara · cek SIM'], pi: 6 },
        { t: ['101·111번 급행버스 노선 가이드', 'Express bus 101 / 111 route guide', '101·111 路急行巴士线路指南', '101・111番急行バス路線ガイド', 'Guía de líneas 101 / 111', 'Hướng dẫn tuyến 101 / 111', 'Guide des lignes 101 / 111', 'Guia das linhas 101 / 111', 'Гид по маршрутам 101/111', 'Panduan rute 101 / 111'], pi: 1 },
        { t: ['공항→숙소 픽업 (KYC 드라이버)', 'Airport→stay pickup (KYC driver)', '机场→住宿接送（KYC 司机）', '空港→宿の送迎（KYC ドライバー）', 'Recogida aeropuerto→alojamiento (conductor KYC)', 'Đón sân bay→chỗ ở (tài xế KYC)', 'Transfert aéroport→logement (chauffeur KYC)', 'Transfer aeroporto→hospedagem (motorista KYC)', 'Трансфер аэропорт→жильё (водитель с KYC)', 'Jemput bandara→penginapan (driver KYC)'], pi: 4 }
      ]
    }
  },

  /* ── 6. JEONJU · GANGNEUNG ────────────────────────────────── */
  {
    key: 'JEONJU',
    code: 'JEONJU',
    sub: ['한옥 & 커피 & 바다', 'hanok, coffee & sea', '韩屋·咖啡·海', '韓屋＆珈琲＆海', 'hanok, café y mar', 'hanok, cà phê & biển', 'hanok, café et mer', 'hanok, café e mar', 'ханок, кофе и море', 'hanok, kopi & laut'],
    venues: ['전주 한옥마을 · 강릉 경포대 · 안목해변', 'Jeonju Hanok Village · Gangneung Gyeongpo · Anmok beach', '全州韩屋村 · 江陵镜浦台 · 安木海边', '全州韓屋村・江陵鏡浦台・安木海辺', 'Aldea hanok de Jeonju · Gyeongpo (Gangneung) · playa Anmok', 'Làng hanok Jeonju · Gyeongpo · bãi Anmok', 'Village hanok de Jeonju · Gyeongpo · plage d’Anmok', 'Vila hanok de Jeonju · Gyeongpo · praia de Anmok', 'Ханок-деревня Чонджу · Кёнпхо · пляж Анмок', 'Desa hanok Jeonju · Gyeongpo · pantai Anmok'],
    tips: [
      ['용산역→전주 KTX 약 1시간 40분, 전주역→한옥마을 버스 10분. 한복 대여 2시간 약 15,000원.',
        'Yongsan to Jeonju by KTX ≈1 h 40 min; Jeonju Station to the hanok village is 10 min by bus. Hanbok rental is about ₩15,000 for two hours.',
        '龙山站→全州 KTX 约 1 小时 40 分，全州站→韩屋村巴士 10 分钟。韩服租借 2 小时约 15,000 韩元。',
        '龍山駅→全州 KTX 約1時間40分、全州駅→韓屋村はバス10分。韓服レンタル2時間で約15,000ウォン。',
        'Yongsan→Jeonju en KTX ≈1 h 40; de la estación al pueblo hanok, 10 min en bus. Alquiler de hanbok ≈₩15.000 por 2 h.',
        'Yongsan→Jeonju bằng KTX ~1 giờ 40; ga Jeonju→làng hanok 10 phút xe buýt. Thuê hanbok 2 giờ khoảng 15.000 KRW.',
        'Yongsan→Jeonju en KTX ≈1 h 40 ; gare de Jeonju→village hanok 10 min en bus. Location de hanbok ≈15 000 ₩ pour 2 h.',
        'Yongsan→Jeonju de KTX ≈1h40; estação de Jeonju→vila hanok 10 min de ônibus. Aluguel de hanbok ≈₩15.000 por 2h.',
        'Йонсан→Чонджу на KTX ≈1 ч 40 мин; вокзал→ханок-деревня 10 мин на автобусе. Прокат ханбока ≈15 000 вон за 2 ч.',
        'Yongsan→Jeonju naik KTX ≈1 jam 40; stasiun→desa hanok 10 menit bus. Sewa hanbok ≈₩15.000 untuk 2 jam.'],
      ['청량리→강릉 KTX-이음 약 1시간 50분, 강릉역→경포대 버스 20분. 안목해변은 해돋이 명소입니다.',
        'Cheongnyangni to Gangneung by KTX-Eum ≈1 h 50 min; Gangneung Station to Gyeongpo is 20 min by bus. Anmok beach is a sunrise spot.',
        '清凉里→江陵 KTX-Eum 约 1 小时 50 分，江陵站→镜浦台巴士 20 分钟。安木海边是日出名所。',
        '清涼里→江陵 KTX-Eum 約1時間50分、江陵駅→鏡浦台はバス20分。安木海辺は日の出名所。',
        'Cheongnyangni→Gangneung en KTX-Eum ≈1 h 50; estación→Gyeongpo 20 min en bus. Anmok es un mirador de amaneceres.',
        'Cheongnyangni→Gangneung bằng KTX-Eum ~1 giờ 50; ga→Gyeongpo 20 phút xe buýt. Anmok là điểm ngắm bình minh.',
        'Cheongnyangni→Gangneung en KTX-Eum ≈1 h 50 ; gare→Gyeongpo 20 min en bus. Anmok est un spot de lever de soleil.',
        'Cheongnyangni→Gangneung de KTX-Eum ≈1h50; estação→Gyeongpo 20 min de ônibus. Anmok é ponto de nascer do sol.',
        'Чхоннянни→Каннын на KTX-Eum ≈1 ч 50 мин; вокзал→Кёнпхо 20 мин на автобусе. Анмок — место рассветов.',
        'Cheongnyangni→Gangneung naik KTX-Eum ≈1 jam 50; stasiun→Gyeongpo 20 menit bus. Anmok spot matahari terbit.'],
      ['한옥마을은 주말 저녁이 가장 붐빕니다. 비빔밥·콩나물국밥은 11시 전에 들어가면 대기가 짧습니다.',
        'The hanok village is busiest on weekend evenings. For bibimbap or bean-sprout soup, go before 11:00 to avoid the queue.',
        '韩屋村周末傍晚最拥挤。拌饭·豆芽汤饭 11 时前入店几乎不用排队。',
        '韓屋村は週末夕方が最も混みます。ビビンバ・豆もやしスープは11時前なら待ちが短いです。',
        'El pueblo hanok se llena las tardes de fin de semana. Para bibimbap o sopa de brotes, entra antes de las 11:00.',
        'Làng hanok đông nhất chiều cuối tuần. Với bibimbap hay canh giá đỗ, vào trước 11:00 để khỏi chờ.',
        'Le village hanok est bondé le week-end en fin de journée. Pour un bibimbap ou une soupe de pousses, venez avant 11 h.',
        'A vila hanok fica cheia nas tardes de fim de semana. Para bibimbap ou sopa de broto, entre antes das 11h.',
        'В ханок-деревне людно по вечерам выходных. За пибимпапом или супом из ростков приходите до 11:00.',
        'Desa hanok paling ramai sore akhir pekan. Untuk bibimbap atau sup tauge, masuk sebelum 11.00.'],
    ],
    picks: {
      stay: [
        { t: ['전주 한옥마을 한옥 스테이 · 대청마루', 'Jeonju hanok stay · wooden veranda room', '全州韩屋村韩屋 · 大厅廊台', '全州韓屋村の韓屋ステイ · 大庁マル', 'Estancia hanok en Jeonju · porche de madera', 'Nhà hanok Jeonju · hiên gỗ', 'Séjour hanok à Jeonju · véranda en bois', 'Estadia hanok em Jeonju · varanda de madeira', 'Ханок в Чонджу · деревянная веранда', 'Hanok Jeonju · beranda kayu'], pi: 16 },
        { t: ['강릉 경포 호수뷰 호텔', 'Gangneung Gyeongpo lake-view hotel', '江陵镜浦湖景酒店', '江陵鏡浦の湖ビューホテル', 'Hotel con vistas al lago en Gyeongpo', 'Khách sạn view hồ Gyeongpo', 'Hôtel vue lac à Gyeongpo', 'Hotel vista lago em Gyeongpo', 'Отель с видом на озеро в Кёнпхо', 'Hotel view danau Gyeongpo'], pi: 15 },
        { t: ['안목해변 오션뷰 게스트하우스', 'Anmok beach ocean-view guesthouse', '安木海边海景民宿', '安木海辺のオーシャンビューゲストハウス', 'Casa de huéspedes con vistas al mar en Anmok', 'Nhà nghỉ view biển Anmok', 'Maison d’hôtes vue mer à Anmok', 'Guesthouse vista mar em Anmok', 'Гостевой дом с видом на море в Анмоке', 'Guesthouse view laut Anmok'], pi: 10 }
      ],
      culture: [
        { t: ['전주 한복 대여 + 경기전·전동성당', 'Jeonju hanbok rental + Gyeonggijeon and Jeondong Cathedral', '全州韩服租借 + 庆基殿·殿洞圣堂', '全州の韓服レンタル＋慶基殿・殿洞聖堂', 'Alquiler de hanbok + Gyeonggijeon y catedral de Jeondong', 'Thuê hanbok + Gyeonggijeon & nhà thờ Jeondong', 'Location de hanbok + Gyeonggijeon et cathédrale Jeondong', 'Aluguel de hanbok + Gyeonggijeon e catedral de Jeondong', 'Прокат ханбока + Кёнгиджон и собор Чондон', 'Sewa hanbok + Gyeonggijeon & Katedral Jeondong'], pi: 5 },
        { t: ['강릉 오죽헌·선교장 해설 투어', 'Gangneung Ojukheon & Seongyojang guided tour', '江陵乌竹轩·船桥庄讲解游', '江陵の烏竹軒・船橋荘ガイドツアー', 'Visita guiada a Ojukheon y Seongyojang', 'Tour có hướng dẫn Ojukheon & Seongyojang', 'Visite guidée d’Ojukheon et Seongyojang', 'Tour guiado por Ojukheon e Seongyojang', 'Экскурсия по Очжухону и Сонгёджану', 'Tur berpemandu Ojukheon & Seongyojang'], pi: 6 },
        { t: ['안목 커피거리 바리스타 클래스', 'Anmok coffee street barista class', '安木咖啡街咖啡师体验课', '安木コーヒー通りのバリスタクラス', 'Clase de barista en la calle del café de Anmok', 'Lớp barista phố cà phê Anmok', 'Cours de barista à Anmok', 'Aula de barista na rua do café de Anmok', 'Урок бариста на кофейной улице Анмока', 'Kelas barista di jalan kopi Anmok'], pi: 7 }
      ],
      food: [
        { t: ['전주 비빔밥 · 콩나물국밥 로컬 투어', 'Jeonju bibimbap & bean-sprout soup tour', '全州拌饭·豆芽汤饭本地游', '全州ビビンバ・豆もやしスープの地元ツアー', 'Tour de bibimbap y sopa de brotes en Jeonju', 'Tour bibimbap & canh giá đỗ Jeonju', 'Tour bibimbap et soupe de pousses à Jeonju', 'Tour de bibimbap e sopa de broto em Jeonju', 'Тур: пибимпап и суп из ростков в Чонджу', 'Tur bibimbap & sup tauge Jeonju'], pi: 6 },
        { t: ['강릉 초당순두부 · 짬뽕', 'Gangneung Chodang soft tofu · jjamppong', '江陵草堂嫩豆腐 · 炒码面', '江陵草堂スンドゥブ・チャンポン', 'Tofu suave de Chodang · jjamppong', 'Đậu hũ non Chodang · jjamppong', 'Tofu soyeux de Chodang · jjamppong', 'Tofu macio de Chodang · jjamppong', 'Мягкий тофу Чодан · чампон', 'Tahu lembut Chodang · jjamppong'], pi: 5 },
        { t: ['전주 남부시장 야시장', 'Jeonju Nambu Market night market', '全州南部市场夜市', '全州南部市場の夜市場', 'Mercado nocturno de Nambu', 'Chợ đêm Nambu Jeonju', 'Marché de nuit de Nambu', 'Feira noturna de Nambu', 'Ночной рынок Намбу', 'Pasar malam Nambu'], pi: 4 }
      ],
      transit: [
        { t: ['KTX 용산→전주 1시간 40분 예약 대행', 'KTX Yongsan→Jeonju 1 h 40 · booking', 'KTX 龙山→全州 1 小时 40 分 · 代订', 'KTX 龍山→全州 1時間40分 · 予約代行', 'KTX Yongsan→Jeonju 1 h 40 · reserva', 'KTX Yongsan→Jeonju 1 giờ 40 · đặt vé', 'KTX Yongsan→Jeonju 1 h 40 · réservation', 'KTX Yongsan→Jeonju 1h40 · reserva', 'KTX Йонсан→Чонджу 1 ч 40 · бронь', 'KTX Yongsan→Jeonju 1 jam 40 · pesan'], pi: 4 },
        { t: ['KTX 청량리→강릉 1시간 50분 예약 대행', 'KTX Cheongnyangni→Gangneung 1 h 50 · booking', 'KTX 清凉里→江陵 1 小时 50 分 · 代订', 'KTX 清涼里→江陵 1時間50分 · 予約代行', 'KTX Cheongnyangni→Gangneung 1 h 50 · reserva', 'KTX Cheongnyangni→Gangneung 1 giờ 50 · đặt vé', 'KTX Cheongnyangni→Gangneung 1 h 50 · réservation', 'KTX Cheongnyangni→Gangneung 1h50 · reserva', 'KTX Чхоннянни→Каннын 1 ч 50 · бронь', 'KTX Cheongnyangni→Gangneung 1 jam 50 · pesan'], pi: 4 },
        { t: ['시내버스·택시 환승 가이드', 'City bus & taxi transfer guide', '市内巴士·出租车换乘指南', '市内バス・タクシー乗換ガイド', 'Guía de buses urbanos y taxis', 'Hướng dẫn buýt nội thành & taxi', 'Guide bus urbains et taxis', 'Guia de ônibus urbano e táxi', 'Гид по городским автобусам и такси', 'Panduan bus kota & taksi'], pi: 1 }
      ]
    }
  },

  /* ── 7. DMZ · PAJU ────────────────────────────────────────── */
  {
    key: 'DMZ',
    code: 'DMZ',
    sub: ['분단의 현장', 'the divided frontier', '分裂的现场', '分断の現場', 'la frontera dividida', 'vùng biên giới chia cắt', 'la frontière divisée', 'a fronteira dividida', 'разделённая граница', 'perbatasan terbelah'],
    venues: ['임진각 · DMZ · 헤이리 · 프로방스', 'Imjingak · DMZ · Heyri · Provence', '临津阁 · DMZ · 嘿里 · 普罗旺斯', '臨津閣・DMZ・ヘイリ・プロバンス', 'Imjingak · DMZ · Heyri · Provence', 'Imjingak · DMZ · Heyri · Provence', 'Imjingak · DMZ · Heyri · Provence', 'Imjingak · DMZ · Heyri · Provence', 'Имджингак · DMZ · Хэйри · Прованс', 'Imjingak · DMZ · Heyri · Provence'],
    tips: [
      ['DMZ 투어는 여권 지참·사전 예약이 필수입니다. 판문점(JSA)은 유엔사 주관 별도 투어로 더 일찍 마감됩니다.',
        'DMZ tours require your passport and advance booking. Panmunjom (JSA) is a separate UN Command tour and closes earlier.',
        'DMZ 行程必须携带护照并提前预约。板门店（JSA）由联合国军司令部单独运营，报名更早截止。',
        'DMZ ツアーはパスポートと事前予約が必須。板門店（JSA）は国連軍司令部主催の別ツアーで、締切が早まります。',
        'Los tours a la DMZ exigen pasaporte y reserva previa. Panmunjom (JSA) es un tour aparte del Mando de la ONU y cierra antes.',
        'Tour DMZ bắt buộc hộ chiếu và đặt trước. Bàn Môn Điếm (JSA) là tour riêng của Bộ Tư lệnh LHQ, đóng sớm hơn.',
        'Les visites de la DMZ exigent passeport et réservation. Panmunjom (JSA) est un tour distinct du Commandement de l’ONU, clos plus tôt.',
        'Os tours à DMZ exigem passaporte e reserva. Panmunjom (JSA) é um tour separado do Comando da ONU e fecha mais cedo.',
        'Для DMZ нужны паспорт и предварительная бронь. Пханмунджом (JSA) — отдельный тур командования ООН, закрывается раньше.',
        'Tur DMZ wajib paspor dan reservasi. Panmunjom (JSA) adalah tur terpisah Komando PBB dan lebih cepat penuh.'],
      ['서울역·광화문에서 7300번 버스로 임진각까지 약 1시간 20분. DMZ 평화관광 셔틀은 예약제입니다.',
        'Bus 7300 from Seoul Station or Gwanghwamun reaches Imjingak in ≈1 h 20 min. The DMZ peace-tour shuttle runs by reservation.',
        '从首尔站·光化门乘 7300 路到临津阁约 1 小时 20 分。DMZ 和平观光接驳为预约制。',
        'ソウル駅・光化門から7300番バスで臨津閣まで約1時間20分。DMZ 平和観光シャトルは予約制です。',
        'El bus 7300 desde Seúl o Gwanghwamun llega a Imjingak en ≈1 h 20. La lanzadera de la DMZ funciona con reserva.',
        'Buýt 7300 từ Seoul hoặc Gwanghwamun tới Imjingak ~1 giờ 20. Shuttle DMZ hoạt động theo đặt trước.',
        'Le bus 7300 depuis Séoul ou Gwanghwamun rejoint Imjingak en ≈1 h 20. La navette DMZ fonctionne sur réservation.',
        'O ônibus 7300 de Seul ou Gwanghwamun chega a Imjingak em ≈1h20. O shuttle da DMZ é por reserva.',
        'Автобус 7300 от Сеула или Кванхвамуна до Имджингака ≈1 ч 20 мин. Шаттл DMZ — по брони.',
        'Bus 7300 dari Seoul atau Gwanghwamun ke Imjingak ≈1 jam 20 menit. Shuttle DMZ dengan reservasi.'],
      ['헤이리·프로방스·파주출판도시는 임진각에서 차로 20분 — 오전 DMZ, 오후 예술마을 동선이 효율적입니다.',
        'Heyri, Provence and the Paju Book City are 20 min by car from Imjingak — DMZ in the morning, art village in the afternoon.',
        '嘿里·普罗旺斯·坡州出版城距临津阁车程 20 分钟——上午 DMZ、下午艺术村最顺。',
        'ヘイリ・プロバンス・坡州出版都市は臨津閣から車で20分 — 午前DMZ、午後アート村が効率的。',
        'Heyri, Provence y Paju Book City están a 20 min en coche: DMZ por la mañana y pueblo artístico por la tarde.',
        'Heyri, Provence và Paju Book City cách Imjingak 20 phút xe: DMZ buổi sáng, làng nghệ thuật buổi chiều.',
        'Heyri, Provence et Paju Book City sont à 20 min en voiture : DMZ le matin, village d’art l’après-midi.',
        'Heyri, Provence e Paju Book City ficam a 20 min de carro: DMZ de manhã e vila de arte à tarde.',
        'Хэйри, Прованс и книжный город Пхаджу в 20 мин на машине: DMZ утром, арт-деревня днём.',
        'Heyri, Provence, dan Paju Book City 20 menit berkendara: DMZ pagi, desa seni sore.'],
    ],
    picks: {
      stay: [
        { t: ['파주 헤이리 인근 독채 펜션', 'Private pension near Heyri, Paju', '坡州嘿里旁独栋民宿', '坡州ヘイリ近くの一棟ペンション', 'Pensión privada junto a Heyri', 'Pension riêng gần Heyri', 'Pension privée près de Heyri', 'Pousada privada perto de Heyri', 'Отдельный пансион у Хэйри', 'Pension privat dekat Heyri'], pi: 14 },
        { t: ['일산 호텔 · 임진각 30분', 'Ilsan hotel · 30 min to Imjingak', '一山酒店 · 距临津阁 30 分钟', '一山ホテル · 臨津閣30分', 'Hotel en Ilsan · 30 min de Imjingak', 'Khách sạn Ilsan · 30 phút tới Imjingak', 'Hôtel à Ilsan · 30 min d’Imjingak', 'Hotel em Ilsan · 30 min de Imjingak', 'Отель в Ильсане · 30 мин до Имджингака', 'Hotel Ilsan · 30 menit ke Imjingak'], pi: 12 },
        { t: ['파주출판도시 부티크 스테이', 'Paju Book City boutique stay', '坡州出版城精品民宿', '坡州出版都市のブティックステイ', 'Estancia boutique en Paju Book City', 'Nhà boutique Paju Book City', 'Séjour boutique à Paju Book City', 'Estadia boutique em Paju Book City', 'Бутик-отель в книжном городе Пхаджу', 'Penginapan butik Paju Book City'], pi: 13 }
      ],
      culture: [
        { t: ['DMZ 투어(제3땅굴·도라전망대) 예약 대행', 'DMZ tour (3rd Tunnel · Dora Observatory) booking', 'DMZ 行程（第三隧道·都罗展望台）代订', 'DMZツアー（第3トンネル・都羅展望台）予約代行', 'Tour DMZ (3.er túnel y mirador Dora) reservado', 'Tour DMZ (hầm số 3, đài Dora) đặt trước', 'Tour DMZ (3e tunnel, observatoire de Dora) réservé', 'Tour DMZ (3º túnel e mirante Dora) reservado', 'Тур DMZ (3-й туннель, смотровая Тора) с бронью', 'Tur DMZ (Terowongan 3 & observatorium Dora) dipesan'], pi: 9 },
        { t: ['판문점 JSA 투어 예약 지원', 'Panmunjom JSA tour booking support', '板门店 JSA 行程预订支持', '板門店 JSA ツアー予約サポート', 'Apoyo para reservar el tour JSA de Panmunjom', 'Hỗ trợ đặt tour JSA Bàn Môn Điếm', 'Aide à la réservation du tour JSA de Panmunjom', 'Apoio para reservar o tour JSA de Panmunjom', 'Помощь с бронью тура JSA в Пханмунджом', 'Bantuan pesan tur JSA Panmunjom'], pi: 12 },
        { t: ['헤이리 예술마을·프로방스 입장', 'Heyri art village & Provence entry', '嘿里艺术村·普罗旺斯门票', 'ヘイリ芸術村・プロバンス入場', 'Entrada a Heyri y Provence', 'Vé Heyri & Provence', 'Entrée Heyri et Provence', 'Ingresso Heyri e Provence', 'Вход в Хэйри и Прованс', 'Tiket Heyri & Provence'], pi: 5 }
      ],
      food: [
        { t: ['파주 장단콩 두부 · 순두부', 'Paju Jangdan soybean tofu · soft tofu', '坡州长湍豆豆腐 · 嫩豆腐', '坡州長湍豆の豆腐・スンドゥブ', 'Tofu de soja Jangdan · tofu suave', 'Đậu phụ đậu nành Jangdan · đậu hũ non', 'Tofu de soja Jangdan · tofu soyeux', 'Tofu de soja Jangdan · tofu macio', 'Тофу из сои Чандан · мягкий тофу', 'Tahu kedelai Jangdan · tahu lembut'], pi: 5 },
        { t: ['헤이리 카페 & 베이커리', 'Heyri cafe & bakery', '嘿里咖啡 & 烘焙', 'ヘイリのカフェ＆ベーカリー', 'Café y panadería en Heyri', 'Cà phê & tiệm bánh Heyri', 'Café et boulangerie à Heyri', 'Café e padaria em Heyri', 'Кафе и пекарня в Хэйри', 'Kafe & toko roti Heyri'], pi: 4 },
        { t: ['임진강 붕어찜 · 매운탕', 'Imjin River braised carp · spicy fish stew', '临津江炖鲫鱼 · 辣鱼汤', '臨津江の鯽煮込み・メウンタン', 'Carpa estofada del Imjin · guiso picante de pescado', 'Cá chép kho sông Imjin · canh cá cay', 'Carpe braisée de l’Imjin · ragoût de poisson épicé', 'Carpa ensopada do Imjin · ensopado picante de peixe', 'Тушёный карп из Имджина · острый рыбный суп', 'Ikan mas bumbu Imjin · sup ikan pedas'], pi: 7 }
      ],
      transit: [
        { t: ['7300번 버스 서울역→임진각 안내', 'Bus 7300 Seoul Station→Imjingak guide', '7300 路首尔站→临津阁指南', '7300番バス ソウル駅→臨津閣案内', 'Guía del bus 7300 Seúl→Imjingak', 'Hướng dẫn buýt 7300 Seoul→Imjingak', 'Guide du bus 7300 Séoul→Imjingak', 'Guia do ônibus 7300 Seul→Imjingak', 'Гид по автобусу 7300 Сеул→Имджингак', 'Panduan bus 7300 Seoul→Imjingak'], pi: 2 },
        { t: ['DMZ 셔틀 예약 + 여권 체크', 'DMZ shuttle booking + passport check', 'DMZ 接驳预约 + 护照确认', 'DMZシャトル予約＋パスポート確認', 'Reserva de lanzadera + control de pasaporte', 'Đặt shuttle DMZ + kiểm tra hộ chiếu', 'Réservation navette DMZ + contrôle passeport', 'Reserva do shuttle DMZ + conferência de passaporte', 'Бронь шаттла DMZ + проверка паспорта', 'Reservasi shuttle DMZ + cek paspor'], pi: 3 },
        { t: ['기사 포함 파주 일일 투어', 'Paju day tour with driver', '含司机坡州一日游', 'ドライバー付き坡州1日ツアー', 'Tour de un día por Paju con conductor', 'Tour Paju 1 ngày có tài xế', 'Tour d’une journée à Paju avec chauffeur', 'Tour de um dia por Paju com motorista', 'Однодневный тур по Пхаджу с водителем', 'Tur sehari Paju dengan driver'], pi: 8 }
      ]
    }
  }
];
