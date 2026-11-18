/* ------------------------------------------------------------------
 * Hangang — 순수 관광객 맛집 지도 (No Ads · No Influencer)
 * 국내 인플루언서·광고성 리뷰가 아니라, 관광객 눈높이의 평가만 담는다.
 * 관광객이 직접 등록한 항목은 localStorage에만 남는다(서버 전송 없음).
 * 10-tuple order: KR EN CN JP ES VN FR PT RU ID
 * ------------------------------------------------------------------ */

import type { L10 } from './i18n';

export interface FoodArea {
  key: string;
  /** 지도 검색에 쓰는 한국어 지명 */
  ko: string;
  label: L10;
}

export const FOOD_AREAS: FoodArea[] = [
  { key: 'MYEONGDONG', ko: '명동', label: ['명동', 'Myeongdong', '明洞', '明洞', 'Myeongdong', 'Myeongdong', 'Myeongdong', 'Myeongdong', 'Мёндон', 'Myeongdong'] },
  { key: 'HONGDAE', ko: '홍대 연남', label: ['홍대·연남', 'Hongdae · Yeonnam', '弘大·延南', '弘大・延南', 'Hongdae y Yeonnam', 'Hongdae · Yeonnam', 'Hongdae et Yeonnam', 'Hongdae e Yeonnam', 'Хондэ и Ённам', 'Hongdae · Yeonnam'] },
  { key: 'SEONGSU', ko: '성수', label: ['성수', 'Seongsu', '圣水', '聖水', 'Seongsu', 'Seongsu', 'Seongsu', 'Seongsu', 'Сонсу', 'Seongsu'] },
  { key: 'JONGNO', ko: '종로 을지로', label: ['종로·을지로', 'Jongno · Euljiro', '钟路·乙支路', '鍾路・乙支路', 'Jongno y Euljiro', 'Jongno · Euljiro', 'Jongno et Euljiro', 'Jongno e Euljiro', 'Чонно и Ыльчиро', 'Jongno · Euljiro'] },
  { key: 'GANGNAM', ko: '강남', label: ['강남', 'Gangnam', '江南', '江南', 'Gangnam', 'Gangnam', 'Gangnam', 'Gangnam', 'Каннам', 'Gangnam'] },
  { key: 'HANGANG', ko: '여의도 한강공원', label: ['한강·여의도', 'Hangang · Yeouido', '汉江·汝矣岛', '漢江・汝矣島', 'Hangang y Yeouido', 'Hangang · Yeouido', 'Hangang et Yeouido', 'Hangang e Yeouido', 'Ханган и Ёидо', 'Hangang · Yeouido'] },
  { key: 'BUSAN', ko: '부산', label: ['부산', 'Busan', '釜山', '釜山', 'Busan', 'Busan', 'Busan', 'Busan', 'Пусан', 'Busan'] }
];

/* ── 관광객 실용 태그 ──────────────────────────────────────────── */
export type FoodTag = 'solo' | 'english' | 'card' | 'cash' | 'spicy' | 'queue' | 'open24' | 'veg';

export const FOOD_TAGS: Record<FoodTag, L10> = {
  solo: [
    '혼밥 가능', 'Solo-friendly', '可一人用餐', '一人OK', 'Apto para ir solo',
    'Ăn một mình được', 'Adapté au solo', 'Bom para ir sozinho', 'Можно одному', 'Cocok makan sendiri'
  ],
  english: [
    '영어 메뉴', 'English menu', '英文菜单', '英語メニュー', 'Menú en inglés',
    'Menu tiếng Anh', 'Menu en anglais', 'Menu em inglês', 'Меню на английском', 'Menu bahasa Inggris'
  ],
  card: [
    '카드결제', 'Card OK', '可刷卡', 'カード可', 'Tarjeta',
    'Thẻ', 'Carte bancaire', 'Cartão', 'Карта', 'Kartu'
  ],
  cash: [
    '현금만', 'Cash only', '仅现金', '現金のみ', 'Solo efectivo',
    'Chỉ tiền mặt', 'Espèces seulement', 'Só dinheiro', 'Только наличные', 'Hanya tunai'
  ],
  spicy: [
    '맵기 조절', 'Spice adjustable', '可调辣度', '辛さ調整可', 'Picante ajustable',
    'Điều chỉnh độ cay', 'Piquant ajustable', 'Picância ajustável', 'Остроту можно выбрать', 'Level pedas bisa diatur'
  ],
  queue: [
    '줄 서는 곳', 'Expect a queue', '需排队', '行列必至', 'Habrá cola',
    'Sẽ phải xếp hàng', 'File d’attente', 'Vai ter fila', 'Очередь', 'Antre'
  ],
  open24: [
    '24시간', '24 hours', '24 小时', '24時間', '24 horas',
    '24 giờ', '24 h', '24 h', '24 часа', '24 jam'
  ],
  veg: [
    '채식 가능', 'Vegetarian OK', '可素食', 'ベジ可', 'Vegetariano',
    'Món chay', 'Végétarien', 'Vegetariano', 'Вегетарианское', 'Vegetarian'
  ]
};

/* ── 대표 메뉴(요리) 사전 ──────────────────────────────────────── */
export const DISH: Record<string, L10> = {
  kalguksu: ['칼국수·만두', 'Hand-cut noodles & dumplings', '刀削面·饺子', 'カルグクス・マンドゥ', 'Fideos cortados y dumplings', 'Mì cắt tay & bánh bao', 'Nouilles coupées et raviolis', 'Macarrão cortado e pastéis', 'Лапша кальгуксу и манду', 'Mi potong tangan & pangsit'],
  gomtang: ['곰탕', 'Beef bone soup', '牛骨汤', 'コムタン', 'Sopa de hueso de res', 'Súp xương bò', 'Bouillon d’os de bœuf', 'Sopa de os de boi', 'Суп на говяжьих костях', 'Sup tulang sapi'],
  donkatsu: ['돈가스', 'Pork cutlet', '炸猪排', 'とんかつ', 'Escalope de cerdo', 'Thịt heo chiên xù', 'Porc pané', 'Bife à milanesa', 'Свиная котлета', 'Pork katsu'],
  gamjatang: ['감자탕', 'Pork-bone stew', '土豆排骨汤', 'カムジャタン', 'Estofado de hueso de cerdo', 'Canh sườn heo khoai tây', 'Ragoût de travers de porc', 'Ensopado de os de porco', 'Рагу из свиных рёбер', 'Sup tulang babi'],
  bindaetteok: ['빈대떡', 'Mung-bean pancake', '绿豆煎饼', 'ピンデトック', 'Tortita de judía', 'Bánh đậu xanh', 'Galette de haricot mungo', 'Panqueca de feijão', 'Лепёшка из маша', 'Pancake kacang hijau'],
  gimbap: ['마약김밥', 'Mini gimbap', '麻药紫菜包饭', '麻薬キンパ', 'Mini gimbap', 'Kimbap mini', 'Mini gimbap', 'Mini gimbap', 'Мини-кимпаб', 'Gimbap mini'],
  seolleongtang: ['설렁탕', 'Beef soup with rice', '牛肉汤饭', 'ソルロンタン', 'Sopa de res con arroz', 'Súp bò với cơm', 'Bouillon de bœuf au riz', 'Sopa de boi com arroz', 'Суп сольлонтхан с рисом', 'Sup daging sapi dengan nasi'],
  kongguksu: ['콩국수·수육', 'Cold soy noodles & boiled pork', '豆浆冷面·白切肉', 'コングクス・スユク', 'Fideos fríos de soja y cerdo', 'Mì lạnh đậu nành & thịt luộc', 'Nouilles froides au soja et porc', 'Macarrão frio de soja e porco', 'Холодная лапша в сое и отварная свинина', 'Mi dingin kedelai & daging rebus'],
  pyeongyangnaengmyeon: ['평양냉면', 'Pyongyang cold noodles', '平壤冷面', '平壌冷麺', 'Fideos fríos de Pionyang', 'Mì lạnh Bình Nhưỡng', 'Nouilles froides de Pyongyang', 'Macarrão frio de Pyongyang', 'Пхеньянская холодная лапша', 'Mi dingin Pyongyang'],
  bulgogi: ['불고기·갈비', 'Bulgogi & ribs', '烤肉·排骨', 'プルコギ・カルビ', 'Bulgogi y costillas', 'Bulgogi & sườn', 'Bulgogi et travers', 'Bulgogi e costela', 'Пулькоги и рёбрышки', 'Bulgogi & iga'],
  dwaejigukbap: ['돼지국밥', 'Pork soup with rice', '猪肉汤饭', 'テジクッパ', 'Sopa de cerdo con arroz', 'Cơm canh thịt heo', 'Soupe de porc au riz', 'Sopa de porco com arroz', 'Суп с рисом и свининой', 'Sup babi dengan nasi'],
  milmyeon: ['밀면', 'Cold wheat noodles', '小麦冷面', 'ミルミョン', 'Fideos de trigo fríos', 'Mì lạnh lúa mì', 'Nouilles de blé froides', 'Macarrão de trigo frio', 'Пшеничная холодная лапша', 'Mi dingin gandum'],
  hotteok: ['씨앗호떡', 'Seed-filled hotteok', '种子糖饼', '種ホットク', 'Hotteok de semillas', 'Bánh hotteok hạt', 'Hotteok aux graines', 'Hotteok de sementes', 'Хотток с семечками', 'Hotteok biji'],
  brunch: ['브런치·커피', 'Brunch & coffee', '早午餐·咖啡', 'ブランチ・コーヒー', 'Brunch y café', 'Brunch & cà phê', 'Brunch et café', 'Brunch e café', 'Бранч и кофе', 'Brunch & kopi'],
  dakgalbi: ['닭갈비', 'Spicy chicken stir-fry', '辣炒鸡排', 'タッカルビ', 'Pollo picante a la plancha', 'Gà xào cay', 'Poulet épicé sauté', 'Frango apimentado', 'Острая курица', 'Ayam tumis pedas'],
  chimaek: ['치킨·맥주', 'Fried chicken & beer', '炸鸡·啤酒', 'チキン・ビール', 'Pollo frito y cerveza', 'Gà rán & bia', 'Poulet frit et bière', 'Frango frito e cerveja', 'Курица и пиво', 'Ayam goreng & bir'],
  samgyeopsal: ['삼겹살', 'Pork belly BBQ', '五花肉烤肉', 'サムギョプサル', 'Panceta a la parrilla', 'Ba chỉ nướng', 'Poitrine de porc grillée', 'Barriga de porco na brasa', 'Свиная грудинка на гриле', 'Samgyeopsal']
};

export interface Restaurant {
  id: string;
  /** 상호(또는 골목·거리 이름). 브랜드명은 번역하지 않는다. */
  name: string;
  area: string;
  dish: string;
  /** 대표 메뉴 가격대(원 표기는 화면에서 언어별로 붙인다) */
  price: string;
  /** 1인 기준 / 2인 기준 */
  per?: 'person' | 'two';
  /** 1~5, Hangang 큐레이션 별점 */
  rating: number;
  tags: FoodTag[];
  /** 지도 검색에 덧붙이는 한국어 위치 힌트 */
  where: string;
}

export const RESTAURANTS: Restaurant[] = [
  { id: 'mdg', name: '명동교자 본점', area: 'MYEONGDONG', dish: 'kalguksu', price: '10,000~12,000', rating: 4.5, tags: ['solo', 'english', 'card', 'queue'], where: '명동 명동8길' },
  { id: 'hadongkwan', name: '하동관', area: 'MYEONGDONG', dish: 'gomtang', price: '15,000~16,000', rating: 4.4, tags: ['solo', 'queue'], where: '명동 명동9길' },
  { id: 'mdonkas', name: '명동돈가스', area: 'MYEONGDONG', dish: 'donkatsu', price: '12,000~14,000', rating: 4.2, tags: ['solo', 'card'], where: '명동 명동8나길' },
  { id: 'yeonnam', name: '연남동 경의선숲길 카페거리', area: 'HONGDAE', dish: 'brunch', price: '10,000~18,000', rating: 4.3, tags: ['card', 'english', 'solo'], where: '홍대 연남동 경의선숲길' },
  { id: 'hotdak', name: '홍대 걷고싶은거리 닭갈비 골목', area: 'HONGDAE', dish: 'dakgalbi', price: '13,000~15,000', per: 'person', rating: 4.1, tags: ['card', 'spicy'], where: '홍대 걷고싶은거리' },
  { id: 'gamjatang', name: '소문난성수감자탕', area: 'SEONGSU', dish: 'gamjatang', price: '11,000~13,000', per: 'person', rating: 4.4, tags: ['card', 'queue', 'spicy'], where: '성수동1가' },
  { id: 'yeonmujang', name: '성수동 연무장길 카페거리', area: 'SEONGSU', dish: 'brunch', price: '8,000~15,000', rating: 4.4, tags: ['card', 'english', 'solo'], where: '성수동2가 연무장길' },
  { id: 'sunhee', name: '광장시장 순희네빈대떡', area: 'JONGNO', dish: 'bindaetteok', price: '6,000~8,000', rating: 4.6, tags: ['cash', 'queue', 'veg'], where: '종로 광장시장' },
  { id: 'majakkimbap', name: '광장시장 마약김밥', area: 'JONGNO', dish: 'gimbap', price: '3,500~5,000', rating: 4.3, tags: ['cash', 'solo'], where: '종로 광장시장' },
  { id: 'imun', name: '이문설렁탕', area: 'JONGNO', dish: 'seolleongtang', price: '14,000~16,000', rating: 4.4, tags: ['solo', 'card'], where: '종로 서린동' },
  { id: 'jinjujip', name: '진주집', area: 'JONGNO', dish: 'kongguksu', price: '12,000~14,000', rating: 4.3, tags: ['solo', 'queue'], where: '을지로 진주집' },
  { id: 'jinmi', name: '진미평양냉면', area: 'GANGNAM', dish: 'pyeongyangnaengmyeon', price: '16,000~18,000', rating: 4.4, tags: ['solo', 'card', 'queue'], where: '강남 논현로' },
  { id: 'bongpiyang', name: '봉피양 강남점', area: 'GANGNAM', dish: 'bulgogi', price: '25,000~35,000', rating: 4.2, tags: ['card', 'english'], where: '강남 봉피양' },
  { id: 'hangangchimaek', name: '여의도 한강공원 치맥 (배달)', area: 'HANGANG', dish: 'chimaek', price: '18,000~25,000', per: 'two', rating: 4.2, tags: ['card', 'english'], where: '여의도 한강공원' },
  { id: 'subyeon', name: '수변최고돼지국밥', area: 'BUSAN', dish: 'dwaejigukbap', price: '9,000~11,000', rating: 4.6, tags: ['solo', 'cash', 'queue'], where: '부산 수영구 수변공원' },
  { id: 'hotteok', name: '남포동 국제시장 씨앗호떡', area: 'BUSAN', dish: 'hotteok', price: '2,500~3,500', rating: 4.5, tags: ['cash', 'solo', 'veg'], where: '부산 남포동 국제시장' },
  { id: 'milmyeon', name: '해운대 밀면 골목', area: 'BUSAN', dish: 'milmyeon', price: '8,000~10,000', rating: 4.2, tags: ['solo', 'card'], where: '부산 해운대 밀면' }
];

/* ── 화면 라벨 ─────────────────────────────────────────────────── */
export const FOOD_LABEL = {
  noAds: [
    'No Ads · No Influencer', 'No Ads · No Influencer', '无广告 · 无网红', '広告なし・インフルエンサーなし',
    'Sin anuncios ni influencers', 'Không quảng cáo, không influencer', 'Sans pub ni influenceurs',
    'Sem anúncios nem influencers', 'Без рекламы и инфлюенсеров', 'Tanpa iklan & influencer'
  ],
  all: [
    '전체', 'All', '全部', 'すべて', 'Todas', 'Tất cả', 'Toutes', 'Todas', 'Все', 'Semua'
  ],
  sortByArea: [
    '지역으로 보기', 'Filter by area', '按地区筛选', 'エリアで絞る', 'Filtrar por zona',
    'Lọc theo khu', 'Filtrer par quartier', 'Filtrar por área', 'Фильтр по району', 'Filter per area'
  ],
  count: [
    '곳', 'places', '家', '件', 'lugares', 'quán', 'adresses', 'lugares', 'мест', 'tempat'
  ],
  curation: [
    'Hangang 큐레이션 별점', 'Hangang curation score', 'Hangang 梳理评分', 'Hangang キュレーション評価',
    'Puntuación de Hangang', 'Điểm do Hangang tổng hợp', 'Note de curation Hangang', 'Nota de curadoria Hangang',
    'Оценка Hangang', 'Nilai kurasi Hangang'
  ],
  formTitle: [
    '관광객 직접 등록', 'Add your own find', '游客自行登记', '旅行者が直接登録', 'Añade tu hallazgo',
    'Du khách tự đăng', 'Ajoutez votre adresse', 'Adicione seu achado', 'Добавьте своё место', 'Tambahkan temuan Anda'
  ],
  formDesc: [
    '직접 다녀온 곳만 적어 주세요. 광고·협찬은 받지 않습니다.',
    'Only places you actually visited. No ads, no sponsorship.',
    '只写你亲自去过的地方。不接受广告与赞助。',
    '実際に行った店だけ。広告・協賛は受けません。',
    'Solo sitios que hayas visitado. Sin publicidad ni patrocinio.',
    'Chỉ nơi bạn đã đến. Không quảng cáo, không tài trợ.',
    'Seulement des lieux que vous avez visités. Ni pub ni sponsoring.',
    'Só lugares que você visitou. Sem anúncio nem patrocínio.',
    'Только места, где вы были. Без рекламы и спонсорства.',
    'Hanya tempat yang benar-benar Anda kunjungi. Tanpa iklan dan sponsor.'
  ],
  name: ['가게명', 'Place name', '店名', '店名', 'Nombre', 'Tên quán', 'Nom', 'Nome', 'Название', 'Nama tempat'],
  area: ['지역', 'Area', '地区', 'エリア', 'Zona', 'Khu', 'Quartier', 'Área', 'Район', 'Area'],
  where: ['위치·역', 'Location / station', '位置·车站', '場所・駅', 'Ubicación o estación', 'Vị trí / ga', 'Lieu ou station', 'Local ou estação', 'Место или станция', 'Lokasi / stasiun'],
  menu: ['대표 메뉴', 'Signature dish', '招牌菜', '代表メニュー', 'Plato estrella', 'Món chính', 'Plat phare', 'Prato principal', 'Главное блюдо', 'Menu andalan'],
  rating: ['별점', 'Rating', '评分', '評価', 'Puntuación', 'Đánh giá', 'Note', 'Nota', 'Оценка', 'Nilai'],
  note: ['한 줄 평', 'One-line note', '一句话点评', 'ひとこと', 'Una línea', 'Một dòng', 'Une ligne', 'Uma linha', 'Одна строка', 'Satu baris'],
  notePh: [
    '예: 2층 창가 자리에서 혼자 먹기 좋았어요',
    'e.g. Great solo seat by the 2nd-floor window',
    '例：二楼窗边一个人吃很舒服',
    '例：2階の窓際で一人でも快適でした',
    'Ej.: buen sitio junto a la ventana para ir solo',
    'VD: chỗ cửa sổ tầng 2 ăn một mình rất thoải mái',
    'Ex. : bonne place près de la fenêtre à l’étage pour manger seul',
    'Ex.: bom lugar na janela do 2º andar para ir sozinho',
    'Напр.: удобно одному у окна на втором этаже',
    'Contoh: enak makan sendiri di jendela lantai 2'
  ],
  submit: ['지도에 등록', 'Add to the map', '登记到地图', '地図に登録', 'Añadir al mapa', 'Thêm vào bản đồ', 'Ajouter à la carte', 'Adicionar ao mapa', 'Добавить на карту', 'Tambah ke peta'],
  visitor: ['방문객 등록', 'Visitor entry', '游客登记', '旅行者の登録', 'Aportado por viajero', 'Du khách đăng', 'Ajout d’un voyageur', 'Enviado por viajante', 'От путешественника', 'Dari pelancong'],
  delete: ['삭제', 'Delete', '删除', '削除', 'Eliminar', 'Xóa', 'Supprimer', 'Excluir', 'Удалить', 'Hapus'],
  saved: [
    '이 브라우저에만 저장됩니다(로그인·서버 전송 없음).',
    'Saved in this browser only — no sign-in, nothing sent to a server.',
    '仅保存在本浏览器（无需登录，不上传服务器）。',
    'このブラウザにのみ保存（ログイン・送信なし）。',
    'Solo se guarda en este navegador (sin cuenta ni envío).',
    'Chỉ lưu trong trình duyệt này (không đăng nhập, không gửi đi).',
    'Enregistré dans ce navigateur uniquement (sans compte ni envoi).',
    'Salvo só neste navegador (sem login nem envio).',
    'Сохраняется только в этом браузере (без входа и отправки).',
    'Hanya tersimpan di peramban ini (tanpa login, tanpa kirim).'
  ],
  empty: [
    '아직 이 지역에 등록된 곳이 없습니다. 첫 한 곳을 남겨 주세요.',
    'Nothing here yet — be the first to add a place.',
    '这个地区还没有登记，来做第一个吧。',
    'このエリアの登録はまだありません。最初の一件を。',
    'Aún no hay nada en esta zona: sé el primero.',
    'Khu này chưa có gì — hãy là người đầu tiên.',
    'Rien encore ici : soyez le premier.',
    'Nada aqui ainda: seja o primeiro.',
    'Здесь пока пусто — добавьте первое место.',
    'Belum ada di area ini — jadilah yang pertama.'
  ],
  perPerson: [
    '/1인', 'per person', '/1 人', '/1人', 'por persona',
    '/người', '/pers.', '/pessoa', '/чел.', '/orang'
  ],
  perTwo: [
    '/2인', 'for two', '/2 人', '/2人', 'para dos',
    'cho 2 người', 'pour deux', 'para dois', 'на двоих', 'untuk 2 orang'
  ],
  mapLink: ['지도', 'Map', '地图', '地図', 'Mapa', 'Bản đồ', 'Carte', 'Mapa', 'Карта', 'Peta'],
  experience: [
    '체험·예약 창구', 'Experiences & booking', '体验·预约窗口', '体験・予約窓口',
    'Experiencias y reservas', 'Trải nghiệm & đặt chỗ', 'Expériences et réservations',
    'Experiências e reservas', 'Впечатления и бронь', 'Pengalaman & reservasi'
  ],
  needed: [
    '가게명과 한 줄 평을 적어 주세요.', 'Please add a place name and a short note.',
    '请填写店名和一句话点评。', '店名とひとことを入力してください。',
    'Escribe el nombre y una nota breve.', 'Vui lòng nhập tên quán và một dòng nhận xét.',
    'Indiquez un nom et une note courte.', 'Informe o nome e uma nota curta.',
    'Укажите название и короткий отзыв.', 'Isi nama tempat dan satu baris catatan.'
  ]
} satisfies Record<string, L10>;

/** 지도 검색 링크 — 네이버 지도(국내 정확)와 구글 지도(해외 사용자) 병기 */
export function mapLinks(name: string, where: string) {
  const q = `${name} ${where}`.trim();
  return {
    naver: `https://map.naver.com/p/search/${encodeURIComponent(q)}`,
    google: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`
  };
}
