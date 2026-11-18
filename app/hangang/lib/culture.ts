/* ------------------------------------------------------------------
 * Hangang — 콘서트·예매 · 장인 굿즈 · 체험 창구 (1단계)
 * 10-tuple order: KR EN CN JP ES VN FR PT RU ID
 * 설계서 §2-E·§2-G의 실측 URL만 사용한다.
 * ------------------------------------------------------------------ */

import type { L10 } from './i18n';
import type { BadgeKind } from './badges';
import type { Card } from './journey';

/* ── 예매 창구 5곳 ──────────────────────────────────────────────── */
export interface Channel {
  id: string;
  name: string;
  url: string;
  langs: string;
  badge: BadgeKind;
  desc: L10;
  pay: L10;
}

export const CHANNELS: Channel[] = [
  {
    id: 'nol', name: 'NOL World', url: 'https://world.nol.com/en/ticket', langs: 'EN · JA · ZH', badge: 'passport',
    desc: [
      '구 인터파크 글로벌(2025-12 리브랜딩). HYBE 계열 콘서트·뮤지컬이 가장 많습니다. 공연별 “Verified Member Only”는 여권 인증이고, 이 인증에는 나이 제한이 없습니다.',
      'Formerly Interpark Global (rebranded Dec 2025). The widest HYBE-affiliated concert and musical catalogue. “Verified Member Only” shows need passport verification, and that verification has no age limit.',
      '原 Interpark Global（2025-12 更名）。HYBE 系演唱会与音乐剧最多。标注“Verified Member Only”的演出需护照认证，该认证无年龄限制。',
      '旧 Interpark Global（2025-12 リブランド）。HYBE 系のコンサート・ミュージカルが最多。公演ごとの「Verified Member Only」はパスポート認証で、年齢制限はありません。',
      'Antiguo Interpark Global (rebranding dic-2025). El catálogo HYBE de conciertos y musicales más amplio. Los shows “Verified Member Only” piden verificación de pasaporte, sin límite de edad.',
      'Trước là Interpark Global (đổi tên 12-2025). Nhiều concert và nhạc kịch của HYBE nhất. Show “Verified Member Only” cần xác minh hộ chiếu, không giới hạn tuổi.',
      'Ancien Interpark Global (renommé déc. 2025). Le plus large catalogue HYBE de concerts et comédies musicales. Les spectacles « Verified Member Only » exigent une vérification au passeport, sans limite d’âge.',
      'Antigo Interpark Global (rebranding dez/2025). O maior catálogo HYBE de shows e musicais. Espetáculos “Verified Member Only” pedem verificação por passaporte, sem limite de idade.',
      'Бывший Interpark Global (ребрендинг в дек. 2025). Самый большой каталог концертов и мюзиклов HYBE. Для шоу «Verified Member Only» нужна проверка паспорта, без возрастных ограничений.',
      'Dahulu Interpark Global (rebranding Des 2025). Katalog konser dan musikal HYBE terbanyak. Acara “Verified Member Only” perlu verifikasi paspor, tanpa batas usia.'
    ],
    pay: [
      '해외 발행 VISA·MC·AMEX·JCB·UnionPay만 결제됩니다. 한국 발급 카드는 막힙니다. 수수료 8,000원 → 9,000원(2026-11-16부터), 당일 자정까지 무료 취소.',
      'Only foreign-issued VISA, MC, AMEX, JCB and UnionPay work — Korean-issued cards are refused. Fee ₩8,000 → ₩9,000 from 2026-11-16; free cancellation until midnight the same day.',
      '仅支持海外发行的 VISA·MC·AMEX·JCB·UnionPay，韩国发行卡无法支付。手续费 8,000→9,000 韩元（2026-11-16 起），当日午夜前可免费取消。',
      '海外発行の VISA・MC・AMEX・JCB・UnionPay のみ。韓国発行カードは不可。手数料 8,000→9,000ウォン（2026-11-16〜）、当日24時までは無料キャンセル。',
      'Solo VISA, MC, AMEX, JCB y UnionPay emitidas en el extranjero; las coreanas se rechazan. Comisión ₩8.000 → ₩9.000 desde el 2026-11-16; cancelación gratis hasta medianoche.',
      'Chỉ nhận VISA·MC·AMEX·JCB·UnionPay phát hành nước ngoài; thẻ Hàn bị từ chối. Phí 8.000 → 9.000 KRW từ 16-11-2026; hủy miễn phí đến nửa đêm cùng ngày.',
      'Seules les VISA, MC, AMEX, JCB et UnionPay étrangères passent ; les cartes coréennes sont refusées. Frais 8 000 → 9 000 ₩ dès le 16-11-2026 ; annulation gratuite jusqu’à minuit.',
      'Só VISA, MC, AMEX, JCB e UnionPay emitidos no exterior; cartões coreanos são recusados. Taxa ₩8.000 → ₩9.000 desde 16-11-2026; cancelamento grátis até a meia-noite.',
      'Принимаются только зарубежные VISA, MC, AMEX, JCB и UnionPay; корейские карты не проходят. Сбор 8 000 → 9 000 вон с 16.11.2026; отмена бесплатна до полуночи.',
      'Hanya VISA, MC, AMEX, JCB, UnionPay terbitan luar; kartu Korea ditolak. Biaya ₩8.000 → ₩9.000 sejak 16-11-2026; batal gratis sampai tengah malam.'
    ]
  },
  {
    id: 'melon', name: 'Melon Ticket Global', url: 'https://tkglobal.melon.com/main/index.htm', langs: 'EN · ZH · JA', badge: 'passport',
    desc: [
      'SM 계열 공연이 많고, 목록에 관람연령(7·8·12·15·19세)이 바로 표시됩니다. 이메일로만 가입합니다.',
      'Strong on SM-affiliated shows; age ratings (7/8/12/15/19+) appear right in the list. Sign up with an email only.',
      'SM 系演出较多，列表直接标注观演年龄（7·8·12·15·19 岁）。仅用邮箱注册。',
      'SM 系の公演が多く、一覧に観覧年齢（7・8・12・15・19歳）が表示されます。メールのみで登録。',
      'Muchos shows de SM; la edad (7/8/12/15/19+) aparece en la lista. Registro solo con email.',
      'Nhiều show của SM; độ tuổi (7/8/12/15/19+) hiện ngay trong danh sách. Đăng ký chỉ bằng email.',
      'Beaucoup de spectacles SM ; l’âge (7/8/12/15/19+) s’affiche dans la liste. Inscription par e-mail uniquement.',
      'Muitos shows da SM; a idade (7/8/12/15/19+) aparece na lista. Cadastro só com e-mail.',
      'Много шоу SM; возраст (7/8/12/15/19+) виден прямо в списке. Регистрация только по e-mail.',
      'Banyak acara SM; batas usia (7/8/12/15/19+) tampil di daftar. Daftar cukup dengan email.'
    ],
    pay: [
      '해외 카드로 결제합니다(브랜드별 상이). 19세 이상 공연은 미성년 예매가 처음부터 막히니, 목록의 연령 표기를 먼저 확인하세요.',
      'Pay with a foreign card (brands vary). 19+ shows block minors from booking at all — check the age label in the list first.',
      '用海外卡支付（各品牌不同）。19 岁以上演出对未成年人是直接无法预订，请先看列表年龄标注。',
      '海外カードで決済（ブランドにより異なる）。19歳以上の公演は未成年の予約が最初から不可。一覧の年齢表記を先に確認。',
      'Pago con tarjeta extranjera (varía por marca). Los shows 19+ bloquean a menores desde el inicio: mira la edad en la lista.',
      'Thanh toán bằng thẻ nước ngoài (tùy thương hiệu). Show 19+ chặn người chưa thành niên ngay từ đầu — xem nhãn tuổi trong danh sách trước.',
      'Paiement par carte étrangère (selon la marque). Les spectacles 19+ bloquent d’emblée les mineurs : vérifiez l’âge dans la liste.',
      'Pagamento com cartão estrangeiro (varia por bandeira). Shows 19+ bloqueiam menores desde o início: veja a idade na lista.',
      'Оплата зарубежной картой (зависит от бренда). Шоу 19+ сразу блокируют несовершеннолетних — смотрите возраст в списке.',
      'Bayar dengan kartu asing (tergantung merek). Acara 19+ langsung memblokir anak di bawah umur — cek label usia di daftar.'
    ]
  },
  {
    id: 'yes24', name: 'YES24 English', url: 'https://ticket.yes24.com/Pages/English/Perf/FnPerfList.aspx', langs: 'EN', badge: 'passport',
    desc: [
      '소극장·페스티벌·전시에 강합니다. 영어 전용 페이지라 국내 YES24와 계정이 다르고, 한국 휴대폰 인증이 필요 없습니다.',
      'Best for small theatres, festivals and exhibitions. The English site is separate from Korean YES24 and needs no Korean phone verification.',
      '小型剧场、庆典、展览较强。英文站与韩国 YES24 账户不通用，也不需要韩国手机认证。',
      '小劇場・フェス・展示に強い。英語専用ページで韓国 YES24 とはアカウントが別、韓国携帯の認証も不要です。',
      'Ideal para salas pequeñas, festivales y exposiciones. El sitio inglés es independiente del YES24 coreano y no pide verificación coreana.',
      'Mạnh về sân khấu nhỏ, lễ hội và triển lãm. Trang tiếng Anh tách khỏi YES24 Hàn và không cần xác minh số Hàn.',
      'Fort pour les petites salles, festivals et expositions. Le site anglais est distinct du YES24 coréen et sans vérification coréenne.',
      'Forte em salas pequenas, festivais e exposições. O site inglês é separado do YES24 coreano e não pede verificação coreana.',
      'Силён в малых залах, фестивалях и выставках. Английский сайт отделён от корейского YES24 и не требует корейской проверки.',
      'Kuat untuk teater kecil, festival, dan pameran. Situs Inggris terpisah dari YES24 Korea dan tanpa verifikasi nomor Korea.'
    ],
    pay: [
      '해외 카드로 결제하고 이메일로 가입합니다. 공연장이 작아 표가 빨리 나가니, 관람연령과 회차를 먼저 정해 두세요.',
      'Foreign card, email sign-up. Small venues sell out fast — decide the age rating and the date first.',
      '海外卡支付、邮箱注册。场地小、票出得快，先定好年龄与场次。',
      '海外カード決済・メール登録。小さい会場は売り切れが早いので、年齢と回を先に決めて。',
      'Tarjeta extranjera y registro por email. Las salas pequeñas se agotan rápido: fija edad y función primero.',
      'Thẻ nước ngoài, đăng ký email. Sân nhỏ hết vé nhanh — chọn độ tuổi và suất trước.',
      'Carte étrangère, inscription par e-mail. Les petites salles partent vite : fixez l’âge et la séance d’abord.',
      'Cartão estrangeiro e cadastro por e-mail. Salas pequenas esgotam rápido: defina idade e sessão antes.',
      'Зарубежная карта, регистрация по e-mail. Малые залы распродаются быстро — сначала выберите возраст и сеанс.',
      'Kartu asing, daftar email. Venue kecil cepat habis — tentukan usia dan jadwal dulu.'
    ]
  },
  {
    id: 'ticketlink', name: 'Ticketlink Global', url: 'https://www.ticketlink.co.kr/global/en/home', langs: 'EN', badge: 'passport',
    desc: [
      'NHN 계열 예매처. 공연·전시를 영어로 안내하고, 공연별 수령 방식(모바일·현장)이 결제 전에 표시됩니다.',
      'An NHN ticketing service. English listings for concerts and exhibitions, with the delivery method (mobile or on-site) shown before payment.',
      'NHN 旗下票务。以英文介绍演出与展览，付款前显示取票方式（手机票或现场）。',
      'NHN 系のチケットサイト。公演・展示を英語で案内し、受取方法（モバイル・当日）が決済前に表示されます。',
      'Servicio de NHN. Listados en inglés y método de entrega (móvil o en taquilla) antes de pagar.',
      'Dịch vụ của NHN. Niêm yết tiếng Anh, cách nhận vé (app hoặc tại chỗ) hiện trước khi thanh toán.',
      'Service NHN. Annonces en anglais et mode de retrait (mobile ou sur place) affiché avant paiement.',
      'Serviço da NHN. Listagens em inglês e forma de retirada (app ou local) antes do pagamento.',
      'Сервис NHN. Английские афиши, способ получения (мобильный или на месте) указан до оплаты.',
      'Layanan NHN. Daftar bahasa Inggris, cara ambil tiket (aplikasi atau di lokasi) tampil sebelum bayar.'
    ],
    pay: [
      '해외 카드로 결제합니다. 공연에 따라 현장 수령만 가능하니, 결제 전에 수령 방법을 꼭 확인하세요.',
      'Foreign card payment. Some shows are on-site pickup only — check the delivery method before paying.',
      '用海外卡支付。部分演出只能现场取票，付款前务必确认取票方式。',
      '海外カード決済。公演によっては当日受取のみなので、決済前に受取方法を必ず確認。',
      'Pago con tarjeta extranjera. Algunos shows son solo recogida en taquilla: confirma antes de pagar.',
      'Thanh toán thẻ nước ngoài. Có show chỉ nhận tại chỗ — kiểm tra cách nhận trước khi trả tiền.',
      'Paiement par carte étrangère. Certains spectacles sont en retrait sur place uniquement : vérifiez avant de payer.',
      'Pagamento com cartão estrangeiro. Alguns shows são só retirada no local: confirme antes de pagar.',
      'Оплата зарубежной картой. Некоторые шоу — только получение на месте; проверьте до оплаты.',
      'Bayar dengan kartu asing. Sebagian acara hanya ambil di lokasi — cek caranya sebelum bayar.'
    ]
  },
  {
    id: 'kopis', name: 'KOPIS', url: 'https://www.kopis.or.kr', langs: 'KO · EN', badge: 'none',
    desc: [
      '예매 창구가 아니라 “무엇을 볼지 찾는 곳”입니다. 전체 공연 DB에서 관람연령·가격·포스터를 무료로 볼 수 있습니다.',
      'Not a booking window but a “what to see” database: age rating, price and poster for every listed show, free.',
      '不是购票窗口，而是“看什么”的数据库。可免费查看全部演出的观演年龄、票价与海报。',
      '予約窓口ではなく「何を見るか」を探す DB。全公演の観覧年齢・料金・ポスターを無料で確認できます。',
      'No es una ventanilla sino la base para decidir “qué ver”: edad, precio y cartel de cada show, gratis.',
      'Không phải nơi mua vé mà là nơi “xem gì”: độ tuổi, giá, poster của mọi show, miễn phí.',
      'Pas un guichet mais la base « que voir » : âge, prix et affiche de chaque spectacle, gratuitement.',
      'Não é bilheteria, e sim a base “o que ver”: idade, preço e cartaz de cada show, grátis.',
      'Не касса, а база «что смотреть»: возраст, цена и афиша каждого шоу, бесплатно.',
      'Bukan loket, tapi basis “mau nonton apa”: usia, harga, dan poster tiap acara, gratis.'
    ],
    pay: [
      '가입·결제가 없습니다. 여기서 공연을 정한 뒤, 위의 글로벌 창구에서 예매하세요.',
      'No sign-up, no payment. Pick the show here, then book at one of the global windows above.',
      '无需注册与支付。在这里选好演出，再到上面的全球窗口预订。',
      '登録・決済なし。ここで公演を選び、上の海外窓口で予約してください。',
      'Sin registro ni pago. Elige el show aquí y reserva en las ventanillas globales de arriba.',
      'Không đăng ký, không thanh toán. Chọn show ở đây rồi đặt vé ở cửa quốc tế bên trên.',
      'Sans inscription ni paiement. Choisissez ici, puis réservez auprès des guichets internationaux ci-dessus.',
      'Sem cadastro nem pagamento. Escolha aqui e reserve nas janelas globais acima.',
      'Без регистрации и оплаты. Выберите шоу здесь, а бронируйте в глобальных окнах выше.',
      'Tanpa daftar dan bayar. Pilih acara di sini, lalu pesan di kanal global di atas.'
    ]
  }
];

/* ── 예매 10단계 ────────────────────────────────────────────────── */
export const BOOK_STEPS: L10[] = [
  ['공연 찾기 — KOPIS와 멜론글로벌 목록에서 먼저 고릅니다.',
   'Find the show — start from KOPIS and the Melon Global list.',
   '找演出——先在 KOPIS 与 Melon 全球列表中挑选。',
   '公演を探す — KOPIS と Melonグローバルの一覧から。',
   'Busca el show: empieza por KOPIS y la lista de Melon Global.',
   'Tìm show — bắt đầu từ KOPIS và danh sách Melon Global.',
   'Trouvez le spectacle : commencez par KOPIS et la liste Melon Global.',
   'Ache o show: comece pelo KOPIS e pela lista da Melon Global.',
   'Найдите шоу — начните с KOPIS и списка Melon Global.',
   'Cari acara — mulai dari KOPIS dan daftar Melon Global.'],
  ['관람연령 확인 — 12·15·19세 제한이 흔합니다. 19세 공연은 미성년 예매가 불가합니다.',
   'Check the age rating — 12/15/19+ limits are common, and 19+ blocks minors outright.',
   '确认观演年龄——常见 12·15·19 岁限制，19 岁演出未成年人无法预订。',
   '観覧年齢を確認 — 12・15・19歳制限が一般的。19歳公演は未成年の予約不可。',
   'Mira la edad: los límites 12/15/19+ son habituales y 19+ bloquea a menores.',
   'Xem độ tuổi — giới hạn 12/15/19+ rất phổ biến, show 19+ chặn người chưa thành niên.',
   'Vérifiez l’âge : les limites 12/15/19+ sont courantes, 19+ bloque les mineurs.',
   'Veja a idade: limites 12/15/19+ são comuns e 19+ bloqueia menores.',
   'Проверьте возраст: ограничения 12/15/19+ обычны, 19+ закрыт для несовершеннолетних.',
   'Cek batas usia — 12/15/19+ lazim, dan 19+ memblokir anak di bawah umur.'],
  ['창구 선택 — 주최사 공지(Weverse·X)에서 글로벌 판매처를 확인합니다. HYBE는 NOL World, SM은 멜론글로벌이 일반적이지만 공연마다 다릅니다.',
   'Pick the window — check the promoter’s notice (Weverse/X) for the global seller. HYBE usually goes to NOL World and SM to Melon Global, but it varies by show.',
   '选择窗口——在主办方公告（Weverse·X）确认全球售票处。HYBE 多为 NOL World、SM 多为 Melon 全球，但每场不同。',
   '窓口を選ぶ — 主催者告知（Weverse・X）で海外販売元を確認。HYBE は NOL World、SM は Melonグローバルが多いですが公演ごとに異なります。',
   'Elige la ventanilla: mira el aviso del promotor (Weverse/X). HYBE suele ir a NOL World y SM a Melon Global, pero cambia por show.',
   'Chọn cửa — xem thông báo của nhà tổ chức (Weverse/X). HYBE thường NOL World, SM thường Melon Global, nhưng tùy show.',
   'Choisissez le guichet : lisez l’annonce du promoteur (Weverse/X). HYBE va souvent à NOL World, SM à Melon Global, mais cela varie.',
   'Escolha a janela: veja o aviso do produtor (Weverse/X). HYBE costuma ir para NOL World e SM para Melon Global, mas varia.',
   'Выберите окно: смотрите объявление организатора (Weverse/X). HYBE обычно NOL World, SM — Melon Global, но бывает по-разному.',
   'Pilih kanal — cek pengumuman promotor (Weverse/X). HYBE biasanya NOL World, SM biasanya Melon Global, tapi berbeda tiap acara.'],
  ['계정 만들기 — 이메일이나 소셜 계정으로 가입합니다. 글로벌 창구는 한국 전화번호가 필요 없습니다.',
   'Create an account — email or social sign-in. Global windows need no Korean phone number.',
   '注册账户——邮箱或社交账号登录。全球窗口不需要韩国手机号。',
   'アカウント作成 — メールまたは SNS で登録。海外窓口は韓国の電話番号が不要です。',
   'Crea la cuenta: email o red social. Las ventanillas globales no piden número coreano.',
   'Tạo tài khoản — email hoặc mạng xã hội. Cửa quốc tế không cần số điện thoại Hàn.',
   'Créez un compte : e-mail ou réseau social. Les guichets internationaux n’exigent pas de numéro coréen.',
   'Crie a conta: e-mail ou rede social. As janelas globais não pedem número coreano.',
   'Создайте аккаунт — e-mail или соцсеть. Глобальным окнам корейский номер не нужен.',
   'Buat akun — email atau media sosial. Kanal global tidak perlu nomor Korea.'],
  ['여권 인증(필요한 공연만) — “Verified Member Only”는 여권 인증 후 예매됩니다. 나이 제한은 없지만 1~2일 걸리니 오픈 하루 전까지 끝내세요.',
   'Passport verification (only where required) — “Verified Member Only” shows need it before booking. No age limit, but it takes 1–2 days: finish it the day before the sale opens.',
   '护照认证（仅部分演出）——“Verified Member Only”需认证后才能预订。无年龄限制，但需 1~2 天，请在开售前一天完成。',
   'パスポート認証（必要な公演のみ）—「Verified Member Only」は認証後に予約可。年齢制限はありませんが1〜2日かかるので、販売前日までに完了を。',
   'Verificación de pasaporte (solo si hace falta): los shows “Verified Member Only” la exigen. Sin límite de edad, pero tarda 1–2 días: termínala el día antes.',
   'Xác minh hộ chiếu (chỉ show cần) — “Verified Member Only” phải xác minh xong mới đặt được. Không giới hạn tuổi nhưng mất 1–2 ngày, hãy làm trước ngày mở bán.',
   'Vérification du passeport (si requis) : les spectacles « Verified Member Only » l’exigent. Sans limite d’âge, mais 1–2 jours : terminez la veille.',
   'Verificação de passaporte (só quando exigida): shows “Verified Member Only” precisam. Sem limite de idade, mas leva 1–2 dias: conclua um dia antes.',
   'Проверка паспорта (только где нужна): шоу «Verified Member Only» требуют её до покупки. Возрастных ограничений нет, но занимает 1–2 дня — закончите за день до старта продаж.',
   'Verifikasi paspor (hanya bila perlu) — acara “Verified Member Only” wajib. Tanpa batas usia, tapi butuh 1–2 hari: selesaikan sehari sebelum penjualan.'],
  ['카드 등록 — 해외 발행 VISA·MC·AMEX·JCB·UnionPay. 한국 발급 카드는 글로벌 창구에서 결제되지 않습니다.',
   'Add a card — foreign-issued VISA, MC, AMEX, JCB or UnionPay. Korean-issued cards do not work on global windows.',
   '绑定卡——海外发行 VISA·MC·AMEX·JCB·UnionPay。韩国发行卡在全球窗口无法支付。',
   'カード登録 — 海外発行の VISA・MC・AMEX・JCB・UnionPay。韓国発行カードは海外窓口では決済できません。',
   'Añade tarjeta: VISA, MC, AMEX, JCB o UnionPay extranjeras. Las coreanas no funcionan en ventanillas globales.',
   'Thêm thẻ — VISA·MC·AMEX·JCB·UnionPay phát hành nước ngoài. Thẻ Hàn không thanh toán được ở cửa quốc tế.',
   'Ajoutez une carte : VISA, MC, AMEX, JCB ou UnionPay étrangères. Les cartes coréennes ne passent pas.',
   'Adicione cartão: VISA, MC, AMEX, JCB ou UnionPay estrangeiros. Cartões coreanos não funcionam.',
   'Добавьте карту — зарубежные VISA, MC, AMEX, JCB, UnionPay. Корейские карты не проходят.',
   'Tambah kartu — VISA, MC, AMEX, JCB, UnionPay terbitan luar. Kartu Korea tidak bisa.'],
  ['오픈 시간(KST) 대기 — 계정당 1순번입니다. 새로고침·기기 변경·VPN을 쓰면 순번이 사라집니다.',
   'Wait for the opening time (KST) — one queue spot per account. Refreshing, switching devices or using a VPN loses your place.',
   '等待开售时间（KST）——每账号一个排队号。刷新、换设备、用 VPN 都会失去顺位。',
   '販売開始（KST）を待つ — 1アカウント1順番。更新・機種変更・VPN で順番が消えます。',
   'Espera la hora de apertura (KST): una posición por cuenta. Refrescar, cambiar de dispositivo o usar VPN la pierde.',
   'Chờ giờ mở bán (KST) — mỗi tài khoản một số thứ tự. Tải lại, đổi thiết bị hay VPN sẽ mất lượt.',
   'Attendez l’ouverture (KST) : une position par compte. Actualiser, changer d’appareil ou utiliser un VPN la fait perdre.',
   'Aguarde a abertura (KST): uma posição por conta. Atualizar, trocar de aparelho ou usar VPN perde o lugar.',
   'Ждите начала продаж (KST) — одна позиция на аккаунт. Перезагрузка, смена устройства или VPN её сбрасывают.',
   'Tunggu waktu buka (KST) — satu posisi per akun. Refresh, ganti perangkat, atau VPN menghilangkan posisi.'],
  ['좌석 선택 10분·결제 7분 — 시간이 짧습니다. 카드를 미리 저장해 두고, 좌석 등급과 가격을 미리 정해 두세요.',
   'Seat selection lasts 10 minutes, payment 7 — short. Save the card in advance and decide the section and price first.',
   '选座 10 分钟、付款 7 分钟——时间很短。提前存好卡片，并先想好座位区域与价格。',
   '座席選択10分・決済7分 — 短時間です。カードを事前保存し、席種と価格を決めておいてください。',
   'Elegir asiento dura 10 min y pagar 7: es poco. Guarda la tarjeta y decide zona y precio antes.',
   'Chọn ghế 10 phút, thanh toán 7 phút — rất ngắn. Lưu thẻ trước và chọn sẵn hạng ghế, giá.',
   'Choix du siège 10 min, paiement 7 min : c’est court. Enregistrez la carte et décidez zone et prix avant.',
   'Escolher assento dura 10 min e pagar 7: é pouco. Salve o cartão e defina setor e preço antes.',
   'Выбор места — 10 минут, оплата — 7. Это мало: сохраните карту и заранее выберите зону и цену.',
   'Pilih kursi 10 menit, bayar 7 menit — singkat. Simpan kartu dan tentukan sektor serta harga lebih dulu.'],
  ['수령 방법 — 모바일 티켓 또는 현장 수령(공연 1시간 전부터 매표소, 확인번호+여권, 본인만). 대리 수령은 원칙적으로 안 됩니다.',
   'Collection — mobile ticket, or on-site pickup from one hour before the show at the box office with the booking number and your passport, in person only. Third-party pickup is not allowed.',
   '取票方式——手机票，或现场取票（演出前 1 小时起，售票处，确认号＋护照，仅本人）。原则上不可代领。',
   '受取方法 — モバイルチケット、または当日受取（公演1時間前から窓口、確認番号＋パスポート、本人のみ）。代理受取は原則不可。',
   'Recogida: entrada móvil o en taquilla desde una hora antes con número de reserva y pasaporte, solo el titular. No se permite que otro la recoja.',
   'Nhận vé — vé app hoặc tại quầy từ 1 giờ trước show với mã xác nhận + hộ chiếu, chỉ chính chủ. Không cho người khác nhận thay.',
   'Retrait : billet mobile ou au guichet dès une heure avant, avec numéro de réservation et passeport, en personne. Le retrait par un tiers est exclu.',
   'Retirada: ingresso no app ou na bilheteria desde uma hora antes, com número e passaporte, só o titular. Terceiros não retiram.',
   'Получение: мобильный билет или касса за час до шоу по номеру брони и паспорту, только лично. Через третьих лиц нельзя.',
   'Ambil tiket — tiket aplikasi atau di loket mulai 1 jam sebelum acara dengan nomor konfirmasi + paspor, hanya pemilik. Tidak bisa diwakilkan.'],
  ['입장 — 예매자 이름과 신분증이 일치해야 합니다. 재판매·대리예매·매크로는 금지이며, 적발되면 예매가 제한됩니다.',
   'Entry — the booking name must match your ID. Resale, proxy booking and macros are banned and lead to booking restrictions.',
   '入场——预订人姓名须与证件一致。禁止转售、代订、抢票脚本，查实将被限制购票。',
   '入場 — 予約者名と身分証が一致すること。転売・代理予約・マクロは禁止で、発覚すると予約制限されます。',
   'Entrada: el nombre debe coincidir con el documento. Reventa, reserva por terceros y macros están prohibidas y restringen tu cuenta.',
   'Vào cửa — tên đặt vé phải khớp giấy tờ. Bán lại, đặt hộ, macro đều bị cấm và sẽ bị hạn chế đặt vé.',
   'Entrée : le nom doit correspondre à la pièce d’identité. Revente, réservation par tiers et macros sont interdites et entraînent des restrictions.',
   'Entrada: o nome precisa bater com o documento. Revenda, reserva por terceiros e macros são proibidas e restringem a conta.',
   'Вход: имя в брони должно совпадать с документом. Перепродажа, бронь через третьих лиц и макросы запрещены — грозит ограничение.',
   'Masuk — nama pemesan harus sama dengan identitas. Jual beli tiket, pesan lewat orang lain, dan makro dilarang dan berakibat pembatasan.']
];

/* ── 예매 주의 박스 ─────────────────────────────────────────────── */
export const TICKET_NOTES: Card[] = [
  {
    id: 'age19', icon: '🔞', badge: 'guardian', verified: true,
    title: ['19세 공연은 예매 자체가 막힙니다', '19+ shows block booking outright', '19 岁演出直接无法预订', '19歳公演は予約自体が不可', 'Los shows 19+ bloquean la reserva', 'Show 19+ chặn đặt vé ngay', 'Les spectacles 19+ bloquent la réservation', 'Shows 19+ bloqueiam a reserva', 'Шоу 19+ блокируют бронь', 'Acara 19+ memblokir pemesanan'],
    body: ['관람연령 19세 공연은 미성년이 예매도 입장도 할 수 없습니다. 12·15세 공연도 보호자 동반이나 신분증 확인이 붙습니다. 목록의 연령 표기를 예매 전에 먼저 보세요.', 'A 19+ rating means a minor can neither book nor enter. Even 12/15 shows may require a guardian or ID check — read the age label before booking.', '观演年龄 19 岁的演出，未成年人既不能预订也不能入场。12·15 岁演出也需监护人陪同或查验证件。预订前先看年龄标注。', '観覧年齢19歳の公演は未成年の予約も入場も不可。12・15歳公演も保護者同伴や身分証確認があります。予約前に年齢表記を。', 'Con 19+ un menor no puede reservar ni entrar. Los 12/15 también pueden pedir tutor o documento: lee la etiqueta antes de reservar.', 'Show 19+ thì người chưa thành niên không đặt vé và không vào được. Show 12/15 cũng có thể cần người giám hộ hoặc giấy tờ — xem nhãn tuổi trước.', 'Un 19+ interdit réservation et entrée aux mineurs. Les 12/15 peuvent exiger tuteur ou pièce d’identité : lisez le label avant.', 'Com 19+, menor não reserva nem entra. Os 12/15 também podem exigir responsável ou documento: veja o rótulo antes.', 'С рейтингом 19+ подросток не купит билет и не войдёт. На 12/15 тоже могут требовать опекуна или документ — смотрите метку.', 'Rating 19+ membuat anak di bawah umur tidak bisa memesan atau masuk. Acara 12/15 pun bisa minta wali atau identitas — baca labelnya dulu.']
  },
  {
    id: 'verify', icon: '🛂', badge: 'passport', verified: true,
    title: ['여권 인증은 나이 제한이 없습니다', 'Passport verification has no age limit', '护照认证无年龄限制', 'パスポート認証に年齢制限なし', 'La verificación de pasaporte no tiene edad', 'Xác minh hộ chiếu không giới hạn tuổi', 'La vérification au passeport est sans âge', 'A verificação por passaporte não tem idade', 'Проверка паспорта без возрастных ограничений', 'Verifikasi paspor tanpa batas usia'],
    body: ['NOL World의 본인 인증은 여권으로 하고, 나이 제한이 없습니다. 다만 승인에 1~2일 걸릴 수 있어 오픈 하루 전까지 끝내야 합니다. 거절되면 “Request to Initialize Submission”으로 다시 제출합니다.', 'NOL World verifies identity by passport with no age limit. Approval can take 1–2 days, so finish it the day before the sale; if declined, resubmit via “Request to Initialize Submission”.', 'NOL World 用护照做身份认证，无年龄限制。审批可能需 1~2 天，请在开售前一天完成；被拒时用“Request to Initialize Submission”重新提交。', 'NOL World の本人認証はパスポートで、年齢制限はありません。承認に1〜2日かかるので販売前日までに完了を。否認時は「Request to Initialize Submission」で再提出します。', 'NOL World verifica con pasaporte y sin límite de edad. La aprobación puede tardar 1–2 días: termínala el día antes; si la rechazan, reenvía con “Request to Initialize Submission”.', 'NOL World xác minh bằng hộ chiếu, không giới hạn tuổi. Duyệt có thể mất 1–2 ngày nên hãy làm trước ngày mở bán; nếu bị từ chối, gửi lại bằng “Request to Initialize Submission”.', 'NOL World vérifie au passeport, sans limite d’âge. L’approbation peut prendre 1–2 jours : terminez la veille ; en cas de refus, renvoyez via « Request to Initialize Submission ».', 'O NOL World verifica por passaporte, sem limite de idade. A aprovação pode levar 1–2 dias: conclua um dia antes; se recusada, reenvie com “Request to Initialize Submission”.', 'NOL World проверяет по паспорту без возрастных ограничений. Одобрение занимает 1–2 дня — закончите за день; при отказе отправьте заново через «Request to Initialize Submission».', 'NOL World memverifikasi dengan paspor, tanpa batas usia. Persetujuan bisa 1–2 hari, jadi selesaikan sehari sebelum; bila ditolak, kirim ulang lewat “Request to Initialize Submission”.'],
    url: 'https://world.nol.com/en/ticket', urlName: 'world.nol.com'
  },
  {
    id: 'pickup', icon: '🎟️', badge: 'passport', verified: true,
    title: ['현장 수령 — 여권과 본인만', 'On-site pickup — passport, in person', '现场取票——护照与本人', '当日受取 — パスポートと本人のみ', 'Recogida en taquilla: pasaporte y en persona', 'Nhận tại chỗ — hộ chiếu và chính chủ', 'Retrait sur place : passeport, en personne', 'Retirada no local: passaporte e em pessoa', 'Получение на месте — паспорт и лично', 'Ambil di lokasi — paspor dan diri sendiri'],
    body: ['공연 1시간 전부터 매표소에서 확인번호와 여권을 보여 주면 받을 수 있습니다. 대리 수령은 원칙적으로 안 되니, 동행이 있어도 본인이 줄을 서세요.', 'From one hour before the show, show the booking number and your passport at the box office. Third-party pickup is not allowed, so queue in person even if you come with someone.', '演出前 1 小时起，在售票处出示确认号与护照即可领取。原则上不可代领，即使有人同行也请本人排队。', '公演1時間前から窓口で確認番号とパスポートを見せて受取。代理受取は原則不可なので、同行者がいても本人が並んでください。', 'Desde una hora antes, muestra el número de reserva y el pasaporte en taquilla. No se permite que otro lo recoja: haz la cola tú, aunque vengas acompañado.', 'Từ 1 giờ trước show, đưa mã xác nhận và hộ chiếu tại quầy. Không cho nhận thay, nên dù đi cùng ai bạn vẫn phải tự xếp hàng.', 'Dès une heure avant, présentez le numéro et le passeport au guichet. Le retrait par un tiers est exclu : faites la queue vous-même, même accompagné.', 'Desde uma hora antes, mostre o número e o passaporte na bilheteria. Terceiros não retiram: enfrente a fila você mesmo, mesmo acompanhado.', 'За час до шоу покажите номер брони и паспорт в кассе. Через третьих лиц не выдают — стойте в очереди сами, даже с кем-то.', 'Mulai 1 jam sebelum acara, tunjukkan nomor konfirmasi dan paspor di loket. Tidak bisa diwakilkan, jadi antre sendiri meski ditemani.']
  },
  {
    id: 'resale', icon: '🚫', badge: 'none', verified: true,
    title: ['재판매·대리예매·매크로 금지', 'No resale, proxy booking or macros', '禁止转售·代订·抢票脚本', '転売・代理予約・マクロ禁止', 'Prohibida la reventa y los macros', 'Cấm bán lại, đặt hộ, macro', 'Revente et macros interdites', 'Revenda e macros proibidos', 'Перепродажа и макросы запрещены', 'Dilarang jual beli dan makro'],
    body: ['Hangang은 예매를 대신하지 않습니다. 창구로 연결하고 정보를 줄 뿐입니다. 재판매·대리예매·매크로는 약관 위반으로 예매 제한 대상입니다.', 'Hangang does not book for you: it links to the windows and gives you the information. Resale, proxy booking and macros violate the terms and lead to booking bans.', 'Hangang 不代订，只连接窗口并提供信息。转售、代订、抢票脚本违反条款，会被限制购票。', 'Hangang は代理予約をしません。窓口へつなぎ情報を提供するだけです。転売・代理予約・マクロは規約違反で予約制限の対象です。', 'Hangang no reserva por ti: enlaza a las ventanillas y da información. Reventa, reservas por terceros y macros violan los términos.', 'Hangang không đặt vé hộ — chỉ dẫn tới cửa và cung cấp thông tin. Bán lại, đặt hộ, macro vi phạm điều khoản.', 'Hangang ne réserve pas à votre place : elle oriente et informe. Revente, réservations par tiers et macros violent les conditions.', 'O Hangang não reserva por você: indica as janelas e informa. Revenda, reserva por terceiros e macros violam os termos.', 'Hangang не бронирует за вас — только ведёт к окнам и даёт информацию. Перепродажа, бронь через третьих лиц и макросы нарушают правила.', 'Hangang tidak memesan untuk Anda — hanya mengarahkan dan memberi info. Jual beli, pesan lewat orang lain, dan makro melanggar ketentuan.']
  }
];

/* ── 한국 장인 굿즈 3대 공식 판로 ───────────────────────────────── */
export interface GoodsChannel {
  id: string;
  name: string;
  url: string;
  urlName: string;
  badge: BadgeKind;
  desc: L10;
  items: L10;
}

export const GOODS_CHANNELS: GoodsChannel[] = [
  {
    id: 'kcdf', name: '공예정원', url: 'https://kcdfshop.kr', urlName: 'kcdfshop.kr', badge: 'passport',
    desc: [
      '한국공예·디자인문화진흥원이 운영하는 온라인숍. 작가 이름이 붙은 실제 공예품을 판매합니다. 인사동 갤러리숍은 월요일 휴무입니다.',
      'The online shop of the Korea Craft & Design Foundation, selling real craft with the maker’s name attached. The Insadong gallery shop closes on Mondays.',
      '韩国工艺·设计文化振兴院运营的线上商店，销售带作者姓名的真实工艺品。仁寺洞画廊店周一休市。',
      '韓国工芸・デザイン文化振興院のオンラインショップ。作家名のついた実際の工芸品を販売。仁寺洞ギャラリーショップは月曜休み。',
      'La tienda online de la Fundación Coreana de Artesanía y Diseño, con piezas reales y nombre de autor. La tienda de Insadong cierra los lunes.',
      'Cửa hàng online của Quỹ Thủ công & Thiết kế Hàn Quốc, bán đồ thủ công thật có tên tác giả. Cửa hàng Insadong nghỉ thứ Hai.',
      'La boutique en ligne de la Fondation coréenne des métiers d’art, avec de vraies pièces signées. La boutique d’Insadong ferme le lundi.',
      'A loja online da Fundação Coreana de Artesanato e Design, com peças reais e nome do autor. A loja de Insadong fecha às segundas.',
      'Онлайн-магазин Корейского фонда ремёсел и дизайна: настоящие изделия с именем мастера. Галерея в Инсадоне закрыта по понедельникам.',
      'Toko online Yayasan Kriya & Desain Korea, menjual kriya asli dengan nama perajin. Toko galeri Insadong tutup Senin.'
    ],
    items: [
      '예: 매듭 커트러리 48,000원 · 청자 동백 커피잔 65,000원 · 자개 텀블러 65,000원',
      'e.g. knot cutlery ₩48,000 · celadon camellia cup ₩65,000 · mother-of-pearl tumbler ₩65,000',
      '例：结艺餐具 48,000 韩元 · 青瓷山茶咖啡杯 65,000 韩元 · 螺钿保温杯 65,000 韩元',
      '例：結びのカトラリー48,000ウォン・青磁椿のカップ65,000ウォン・螺鈿タンブラー65,000ウォン',
      'Ej.: cubiertos de nudo ₩48.000 · taza de celadón ₩65.000 · vaso de nácar ₩65.000',
      'VD: bộ dao nĩa thắt nút 48.000 · tách men ngọc 65.000 · ly khảm xà cừ 65.000 KRW',
      'Ex. : couverts en nœud 48 000 ₩ · tasse céladon 65 000 ₩ · gobelet nacré 65 000 ₩',
      'Ex.: cutelaria de nó ₩48.000 · xícara de celadon ₩65.000 · copo de madrepérola ₩65.000',
      'Напр.: столовые приборы с узлом 48 000 вон · чашка селадон 65 000 вон · стакан с перламутром 65 000 вон',
      'Contoh: sendok-garpu simpul ₩48.000 · cangkir seladon ₩65.000 · tumbler kerang ₩65.000'
    ]
  },
  {
    id: 'kheritage', name: 'K-헤리티지 스토어', url: 'https://www.kh.or.kr', urlName: 'kh.or.kr', badge: 'passport',
    desc: [
      '국가유산진흥원이 운영하는 전통문화 전문 쇼핑몰. 경복궁·덕수궁·창덕궁 매장과 인천공항 한국전통문화센터 상품을 온라인에서도 팝니다.',
      'The National Heritage Promotion Agency’s traditional-culture shop. It also sells online the goods from the Gyeongbokgung, Deoksugung and Changdeokgung stores and the Incheon Airport heritage centre.',
      '国家遗产振兴院运营的传统文化产业商城。景福宫、德寿宫、昌德宫门店与仁川机场韩国传统文化中心商品均可在线上购买。',
      '国家遺産振興院の伝統文化専門モール。景福宮・徳寿宮・昌徳宮の店舗と仁川空港韓国伝統文化センターの商品をオンラインでも販売。',
      'La tienda de cultura tradicional del Organismo de Patrimonio Nacional: también vende en línea lo de sus tiendas de Gyeongbokgung, Deoksugung, Changdeokgung y del centro de Incheon.',
      'Cửa hàng văn hoá truyền thống của Cơ quan Di sản Quốc gia, bán online cả hàng từ cửa hàng Gyeongbokgung, Deoksugung, Changdeokgung và trung tâm văn hoá truyền thống sân bay Incheon.',
      'La boutique de culture traditionnelle de l’Agence du patrimoine national : elle vend aussi en ligne les produits de ses boutiques de Gyeongbokgung, Deoksugung, Changdeokgung et du centre d’Incheon.',
      'A loja de cultura tradicional da Agência do Patrimônio Nacional, que também vende online os itens das lojas de Gyeongbokgung, Deoksugung, Changdeokgung e do centro de Incheon.',
      'Магазин традиционной культуры Агентства национального наследия: продаёт онлайн и товары из лавок Кёнбоккуна, Токсугуна, Чхандоккуна и центра в Инчхоне.',
      'Toko budaya tradisional Badan Warisan Nasional; menjual online juga barang dari toko Gyeongbokgung, Deoksugung, Changdeokgung, dan pusat Incheon.'
    ],
    items: [
      '예: 궁궐 문양 자수 파우치 · 전통 문양 스카프 · 공항 센터 한정 기념품',
      'e.g. palace-pattern embroidered pouch · traditional-pattern scarf · airport-centre exclusives',
      '例：宫阙纹样刺绣小包 · 传统纹样围巾 · 机场中心限定纪念品',
      '例：宮殿文様の刺繍ポーチ・伝統文様スカーフ・空港センター限定品',
      'Ej.: neceser bordado con motivos de palacio · pañuelo tradicional · exclusivas del aeropuerto',
      'VD: túi thêu hoa văn cung điện · khăn hoa văn truyền thống · quà riêng ở sân bay',
      'Ex. : pochette brodée aux motifs de palais · écharpe traditionnelle · exclusivités aéroport',
      'Ex.: nécessaire bordado de palácio · lenço tradicional · exclusivos do aeroporto',
      'Напр.: вышитая сумочка с дворцовым узором · платок с традиционным узором · эксклюзивы аэропорта',
      'Contoh: pouch bordir motif istana · syal motif tradisional · eksklusif bandara'
    ]
  },
  {
    id: 'muds', name: '뮷즈 (MUDS)', url: 'https://www.muds.or.kr', urlName: 'muds.or.kr', badge: 'passport',
    desc: [
      '국립박물관문화재단의 문화상품 브랜드. 반가사유상 미니어처처럼 유물을 그대로 옮긴 상품이 중심입니다. 국립중앙박물관 매장과 같은 상품입니다.',
      'The National Museum Foundation’s cultural-goods brand, centred on faithful replicas such as the Pensive Bodhisattva miniature — the same items as the National Museum store.',
      '国立博物馆文化财团的文化商品品牌，以半跏思惟像迷你版等忠实复刻文物为主，与国家中央博物馆门店同款。',
      '国立博物館文化財団の文化商品ブランド。半跏思惟像ミニチュアなど遺物を忠実に再現した商品が中心で、国立中央博物館の店舗と同品です。',
      'La marca de productos culturales de la Fundación del Museo Nacional, centrada en réplicas fieles como la miniatura del Bodhisattva, las mismas piezas que la tienda del museo.',
      'Thương hiệu quà văn hoá của Quỹ Bảo tàng Quốc gia, chủ yếu là bản sao trung thực như tượng Bán Già Tư Duy mini — cùng hàng với cửa hàng Bảo tàng Quốc gia.',
      'La marque de produits culturels de la Fondation du Musée national, centrée sur des répliques fidèles comme la miniature du Bodhisattva, les mêmes que la boutique du musée.',
      'A marca de produtos culturais da Fundação do Museu Nacional, focada em réplicas fiéis como a miniatura do Bodhisattva — os mesmos itens da loja do museu.',
      'Бренд культурных товаров Фонда Национального музея: точные копии, например миниатюра Бодхисаттвы — те же товары, что в музейном магазине.',
      'Merek suvenir budaya Yayasan Museum Nasional, berfokus pada replika setia seperti miniatur Bodhisattva — sama dengan toko museum.'
    ],
    items: [
      '예: 반가사유상 미니어처 · 고려청자 컵 · 박물관 도록',
      'e.g. Pensive Bodhisattva miniature · Goryeo celadon cup · museum catalogue',
      '例：半跏思惟像迷你版 · 高丽青瓷杯 · 博物馆图录',
      '例：半跏思惟像ミニチュア・高麗青磁カップ・図録',
      'Ej.: miniatura del Bodhisattva · taza de celadón Goryeo · catálogo del museo',
      'VD: tượng Bán Già Tư Duy mini · tách men ngọc Goryeo · sách danh mục bảo tàng',
      'Ex. : miniature du Bodhisattva · tasse céladon Goryeo · catalogue du musée',
      'Ex.: miniatura do Bodhisattva · xícara de celadon Goryeo · catálogo do museu',
      'Напр.: миниатюра Бодхисаттвы · чашка селадон Корё · каталог музея',
      'Contoh: miniatur Bodhisattva · cangkir seladon Goryeo · katalog museum'
    ]
  }
];

/* ── 예매 섹션 라벨 ────────────────────────────────────────────── */
export const TICKET_LABEL: Record<'windows' | 'steps' | 'notes', L10> = {
  windows: [
    '글로벌 예매 창구 5곳', 'Five global booking windows', '五个全球购票窗口', '海外予約窓口5つ',
    'Cinco ventanillas globales', 'Năm cửa vé quốc tế', 'Cinq guichets internationaux',
    'Cinco janelas globais', 'Пять глобальных окон', 'Lima kanal tiket global'
  ],
  steps: [
    '예매 10단계 — 처음부터 끝까지', 'Booking in 10 steps, start to finish', '购票 10 步——从头到尾', '予約10ステップ — 最初から最後まで',
    'Reservar en 10 pasos, de principio a fin', 'Đặt vé 10 bước, từ đầu đến cuối', 'Réserver en 10 étapes, de bout en bout',
    'Reservar em 10 passos, do início ao fim', 'Бронь за 10 шагов, от начала до конца', 'Memesan dalam 10 langkah, dari awal sampai akhir'
  ],
  notes: [
    '예매 전에 확인할 것', 'Check before you book', '购票前必看', '予約前に確認すること',
    'Antes de reservar', 'Trước khi đặt vé', 'Avant de réserver',
    'Antes de reservar', 'Перед бронированием', 'Sebelum memesan'
  ]
};

/* ── 05 체험·예약 창구 ──────────────────────────────────────────── */
export const EXPERIENCE: Card[] = [
  {
    id: 'catchtable', icon: '🍽️', badge: 'passport', verified: true,
    title: ['캐치테이블 예약', 'CatchTable booking', 'CatchTable 预约', 'CatchTable 予約', 'Reserva en CatchTable', 'Đặt bàn CatchTable', 'Réservation CatchTable', 'Reserva no CatchTable', 'Бронь через CatchTable', 'Reservasi CatchTable'],
    body: ['영어·일본어·중국어를 지원하는 레스토랑 예약 앱입니다. 인기 식당은 예약이 먼저 차고, 당일에는 대기열 등록으로 들어갑니다.', 'A restaurant booking app in English, Japanese and Chinese. Popular tables go first; on the day you can join the waitlist.', '支持英日中的餐厅预约应用。热门餐厅先被订满，当天可登记排队。', '英語・日本語・中国語対応のレストラン予約アプリ。人気店は早く埋まり、当日はウェイティング登録で入れます。', 'App de reservas en inglés, japonés y chino. Los sitios populares se llenan; el mismo día puedes apuntarte a la lista.', 'Ứng dụng đặt bàn tiếng Anh, Nhật, Trung. Quán hot kín sớm; trong ngày có thể vào danh sách chờ.', 'App de réservation en anglais, japonais et chinois. Les tables populaires partent vite ; le jour même, liste d’attente.', 'App de reservas em inglês, japonês e chinês. Casas badaladas lotam; no dia, entre na lista de espera.', 'Приложение брони на английском, японском и китайском. Популярные столы уходят: в день визита — лист ожидания.', 'Aplikasi reservasi bahasa Inggris, Jepang, Mandarin. Tempat populer cepat penuh; pada hari-H bisa ikut daftar tunggu.'],
    url: 'https://www.catchtable.net', urlName: 'catchtable.net'
  },
  {
    id: 'shuttle', icon: '🛵', badge: 'passport', verified: true,
    title: ['Shuttle Delivery', 'Shuttle Delivery', 'Shuttle Delivery', 'Shuttle Delivery', 'Shuttle Delivery', 'Shuttle Delivery', 'Shuttle Delivery', 'Shuttle Delivery', 'Shuttle Delivery', 'Shuttle Delivery'],
    body: ['외국인 전용 배달 서비스로 웹에서 주문됩니다. 배민·쿠팡이츠가 한국 카드로 막힐 때 대안입니다.', 'A delivery service for visitors, ordered on the web — the fallback when Baemin or Coupang Eats need a Korean card.', '面向外国人的外卖服务，可网页下单。Baemin、Coupang Eats 需要韩国卡时可用它。', '外国人向けのデリバリーでウェブ注文可。ペミン・クーパンイーツが韓国カードで止まるときの代替です。', 'Servicio de entrega para visitantes, por web: la alternativa cuando Baemin o Coupang Eats piden tarjeta coreana.', 'Dịch vụ giao hàng cho du khách, đặt trên web — thay thế khi Baemin, Coupang Eats cần thẻ Hàn.', 'Service de livraison pour visiteurs, commandé sur le web : l’alternative quand Baemin ou Coupang Eats exigent une carte coréenne.', 'Serviço de entrega para visitantes, pedido na web: alternativa quando Baemin ou Coupang Eats pedem cartão coreano.', 'Доставка для гостей, заказ на сайте — замена, когда Baemin или Coupang Eats требуют корейскую карту.', 'Layanan antar untuk wisatawan, pesan lewat web — alternatif saat Baemin atau Coupang Eats minta kartu Korea.'],
    url: 'https://www.shuttledelivery.co.kr/en', urlName: 'shuttledelivery.co.kr'
  },
  {
    id: 'templestay', icon: '🛕', badge: 'passport', verified: true,
    title: ['템플스테이', 'Templestay', '寺院寄宿', 'テンプルステイ', 'Templestay', 'Templestay', 'Templestay', 'Templestay', 'Тэмплстей', 'Templestay'],
    body: ['사찰에서 하룻밤 자는 체험입니다. 숙박형과 당일 체험형이 나뉘고, 영문으로 예약할 수 있습니다. 미성년은 보호자 동의가 필요합니다.', 'An overnight stay at a temple, with stay-type and day-visit programmes and English booking. Minors need a guardian’s consent.', '在寺院住一晚的体验，分住宿型与当日体验型，可用英文预约。未成年人需监护人同意。', '寺院に泊まる体験。宿泊型と当日体験型があり、英語で予約できます。未成年は保護者の同意が必要です。', 'Una noche en un templo, con programas de estancia o de un día y reserva en inglés. Los menores necesitan consentimiento del tutor.', 'Một đêm ở chùa, có gói lưu trú và gói trong ngày, đặt bằng tiếng Anh. Người chưa thành niên cần người giám hộ đồng ý.', 'Une nuit dans un temple, en séjour ou à la journée, réservable en anglais. Les mineurs ont besoin de l’accord du tuteur.', 'Uma noite em um templo, com programa de estadia ou de um dia, reserva em inglês. Menores precisam do responsável.', 'Ночь в храме: варианты с проживанием и на день, бронь на английском. Несовершеннолетним нужно согласие опекуна.', 'Menginap semalam di kuil, ada paket menginap dan kunjungan sehari, bisa dipesan dalam bahasa Inggris. Anak di bawah umur perlu izin wali.'],
    url: 'https://www.templestay.com', urlName: 'templestay.com'
  },
  {
    id: 'market', icon: '🏮', badge: 'none', verified: true,
    title: ['전통시장 — 광장시장', 'Traditional markets — Gwangjang', '传统市场——广藏市场', '伝統市場 — 広蔵市場', 'Mercados: Gwangjang', 'Chợ truyền thống — Gwangjang', 'Marchés : Gwangjang', 'Mercados: Gwangjang', 'Рынки — Кванджан', 'Pasar tradisional — Gwangjang'],
    body: ['빈대떡·마약김밥·육회가 한 골목에 있습니다. 좌판은 현금이 편하고, 오후보다 저녁이 붐빕니다. 위생이 걱정되면 사람이 많은 집을 고르세요.', 'Mung-bean pancakes, mini gimbap and raw beef sit in one alley. Stalls prefer cash and evenings are busier than afternoons — pick the busiest stall if hygiene worries you.', '绿豆煎饼、麻药紫菜包饭、生拌牛肉都在一条巷子里。摊位用现金更方便，晚上比下午更挤。担心卫生就选人多的摊。', 'ピンデトック・麻薬キンパ・ユッケが一筋に。屋台は現金が楽で、午後より夜が混みます。衛生が気になるなら人が多い店を。', 'Tortitas de judía, mini gimbap y ternera cruda en un mismo callejón. Los puestos prefieren efectivo y hay más gente por la noche: elige el más lleno si te preocupa la higiene.', 'Bánh đậu, kimbap mini và thịt bò sống nằm chung một con hẻm. Quầy thích tiền mặt, tối đông hơn chiều — chọn quán đông nhất nếu lo vệ sinh.', 'Galettes de haricot, mini gimbap et bœuf cru dans une même ruelle. Les étals préfèrent les espèces et le soir est plus fréquenté : choisissez le plus bondé si l’hygiène vous inquiète.', 'Panquecas de feijão, mini gimbap e carne crua na mesma viela. As barracas preferem dinheiro e a noite enche mais: escolha a mais cheia se a higiene preocupa.', 'Лепёшки из маша, мини-кимпаб и сырая говядина в одном переулке. На лотках удобнее наличные, вечером людно — выбирайте самую людную точку, если важна гигиена.', 'Pancake kacang hijau, gimbap mini, dan daging sapi mentah di satu gang. Lapak lebih suka tunai dan malam lebih ramai — pilih yang paling ramai bila soal kebersihan.']
  }
];
