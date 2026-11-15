/* ------------------------------------------------------------------
 * Pi 실행 권한 게이트 — 10개국어 문구
 * KR · EN · CN · JP · ES · VN · FR · PT · RU · ID
 * Each string is a fixed 10-tuple, so a missing language fails the build
 * (same rule as app/hangang/lib/i18n.ts).
 * ------------------------------------------------------------------ */

export type GateLang = 'KR' | 'EN' | 'CN' | 'JP' | 'ES' | 'VN' | 'FR' | 'PT' | 'RU' | 'ID';

export type L10 = readonly [
  string, string, string, string, string,
  string, string, string, string, string
];

export const GATE_LANG_INDEX: Record<GateLang, number> = {
  KR: 0, EN: 1, CN: 2, JP: 3, ES: 4, VN: 5, FR: 6, PT: 7, RU: 8, ID: 9
};

/** Read one language out of a 10-tuple (falls back to English). */
export function gate(v: L10, lang: GateLang): string {
  return v[GATE_LANG_INDEX[lang]] ?? v[1];
}

export const GATE = {
  /** 읽기 전용 배지 */
  readOnly: [
    '읽기 전용',
    'Read-only',
    '只读',
    '閲覧のみ',
    'Solo lectura',
    'Chỉ đọc',
    'Lecture seule',
    'Somente leitura',
    'Только чтение',
    'Hanya baca'
  ] as L10,

  /** 안내 패널 제목 */
  title: [
    'Pi 지갑 인증이 필요합니다',
    'Pi wallet verification required',
    '需要 Pi 钱包认证',
    'Piウォレット認証が必要です',
    'Se requiere verificación de la billetera Pi',
    'Cần xác thực ví Pi',
    'Vérification du portefeuille Pi requise',
    'Verificação da carteira Pi necessária',
    'Требуется верификация кошелька Pi',
    'Verifikasi dompet Pi diperlukan'
  ] as L10,

  /** 눌린 액션 안내 — {a} 자리에 액션 이름이 들어간다 */
  action: [
    '‘{a}’은(는) Pi 지갑 인증 후에 실행됩니다.',
    '“{a}” runs only after Pi wallet verification.',
    '“{a}”需通过 Pi 钱包认证后才能执行。',
    '「{a}」は Pi ウォレット認証後に実行できます。',
    '«{a}» se ejecuta tras verificar la billetera Pi.',
    '“{a}” chỉ chạy sau khi xác thực ví Pi.',
    '« {a} » s’exécute après vérification du portefeuille Pi.',
    '“{a}” só é executado após verificar a carteira Pi.',
    '«{a}» выполняется после верификации кошелька Pi.',
    '“{a}” hanya berjalan setelah verifikasi dompet Pi.'
  ] as L10,

  /** 무엇이 열려 있고 무엇이 잠기는지 */
  body: [
    '둘러보기·통계·안건·원장·관광 정보는 지금도 자유롭게 열람할 수 있습니다. 투표, 안건 제안, 청원, 제보 등록, 결제·예약만 Pi KYC 인증이 있어야 원장에 기록됩니다.',
    'Browsing, statistics, agendas, ledgers and travel guides stay open to everyone. Voting, proposals, petitions, reports and payments are recorded only with a Pi KYC identity.',
    '浏览、统计、提案与账本始终开放；投票、提案、请愿、举报与支付需 Pi KYC 认证后才会记录。',
    '閲覧・統計・議案・台帳・観光情報は誰でも自由に。投票・提案・請願・報告・決済のみ Pi KYC 認証が必要です。',
    'La navegación, las estadísticas, las agendas y las guías siguen abiertas. Votar, proponer, firmar, reportar y pagar exigen identidad Pi KYC.',
    'Duyệt, thống kê, đề mục và sổ cái luôn mở. Bỏ phiếu, đề xuất, kiến nghị, tố cáo và thanh toán cần danh tính Pi KYC.',
    'La navigation, les statistiques et les registres restent ouverts. Voter, proposer, signer, signaler et payer exigent une identité Pi KYC.',
    'A navegação, estatísticas e registros seguem abertos. Votar, propor, assinar, denunciar e pagar exigem identidade Pi KYC.',
    'Просмотр, статистика и реестры открыты всем. Голосование, предложения, петиции, жалобы и платежи требуют Pi KYC.',
    'Penelusuran, statistik, agenda, dan buku besar tetap terbuka. Voting, usulan, petisi, laporan, dan pembayaran butuh identitas Pi KYC.'
  ] as L10,

  /** Pi Browser 안에서 인증이 아직 안 끝난 경우 */
  piBrowserHint: [
    'Pi Browser가 감지되었습니다. 한 번 인증하면 모든 실행 권한이 열립니다.',
    'Pi Browser detected. Authenticate once to unlock every action.',
    '已检测到 Pi Browser。认证一次即可解锁全部操作。',
    'Pi Browser を検出しました。一度認証すれば全ての操作が可能です。',
    'Pi Browser detectado. Autentícate una vez para desbloquear todo.',
    'Đã nhận diện Pi Browser. Xác thực một lần để mở mọi thao tác.',
    'Pi Browser détecté. Authentifiez-vous une fois pour tout débloquer.',
    'Pi Browser detectado. Autentique-se uma vez para liberar tudo.',
    'Pi Browser обнаружен. Пройдите верификацию один раз.',
    'Pi Browser terdeteksi. Verifikasi sekali untuk membuka semua aksi.'
  ] as L10,

  authBtn: [
    'Pi로 KYC 인증하기',
    'Authenticate with Pi',
    '用 Pi 认证',
    'Piで認証する',
    'Autenticar con Pi',
    'Xác thực bằng Pi',
    'S’authentifier avec Pi',
    'Autenticar com Pi',
    'Войти через Pi',
    'Verifikasi dengan Pi'
  ] as L10,

  connecting: [
    'Pi 인증 진행 중…',
    'Connecting…',
    '正在认证…',
    '認証中…',
    'Verificando…',
    'Đang xác thực…',
    'Vérification…',
    'Autenticando…',
    'Проверка…',
    'Memverifikasi…'
  ] as L10,

  step1: [
    '폰에서 Pi Browser 앱을 엽니다.',
    'Open the Pi Browser app on your phone.',
    '在手机上打开 Pi Browser。',
    'スマホで Pi Browser を開きます。',
    'Abre la app Pi Browser en tu teléfono.',
    'Mở ứng dụng Pi Browser trên điện thoại.',
    'Ouvrez l’app Pi Browser sur votre téléphone.',
    'Abra o app Pi Browser no celular.',
    'Откройте приложение Pi Browser на телефоне.',
    'Buka aplikasi Pi Browser di ponsel.'
  ] as L10,

  step2: [
    '아래 주소를 그대로 입력합니다.',
    'Enter the address below.',
    '输入下方地址。',
    '下のアドレスを入力します。',
    'Introduce la dirección de abajo.',
    'Nhập địa chỉ bên dưới.',
    'Saisissez l’adresse ci-dessous.',
    'Digite o endereço abaixo.',
    'Введите адрес ниже.',
    'Masukkan alamat di bawah.'
  ] as L10,

  step3: [
    'Pi 로그인 후 KYC 연결을 승인합니다.',
    'Sign in with Pi and approve the KYC link.',
    '用 Pi 登录并批准 KYC 连接。',
    'Pi でログインし KYC 連携を承認します。',
    'Inicia sesión con Pi y aprueba el vínculo KYC.',
    'Đăng nhập Pi và chấp thuận liên kết KYC.',
    'Connectez-vous avec Pi et approuvez la liaison KYC.',
    'Entre com Pi e aprove a conexão KYC.',
    'Войдите через Pi и подтвердите привязку KYC.',
    'Masuk dengan Pi lalu setujui tautan KYC.'
  ] as L10,

  copy: [
    '복사', 'copy', '复制', 'コピー', 'copiar', 'sao chép', 'copier', 'copiar', 'копировать', 'salin'
  ] as L10,

  copied: [
    '복사됨', 'copied', '已复制', 'コピー済み', 'copiado', 'đã chép', 'copié', 'copiado', 'скопировано', 'tersalin'
  ] as L10,

  guide: [
    '케데헌 루키 가이드 열기 (kedheon.com)',
    'Open the Kedheon rookie guide (kedheon.com)',
    '打开 Kedheon 新手指南 (kedheon.com)',
    'Kedheon ルーキーガイドを開く (kedheon.com)',
    'Abrir la guía para novatos de Kedheon (kedheon.com)',
    'Mở hướng dẫn tân binh Kedheon (kedheon.com)',
    'Ouvrir le guide débutant Kedheon (kedheon.com)',
    'Abrir o guia iniciante da Kedheon (kedheon.com)',
    'Открыть гид новичка Kedheon (kedheon.com)',
    'Buka panduan pemula Kedheon (kedheon.com)'
  ] as L10,

  close: [
    '닫기', 'Close', '关闭', '閉じる', 'Cerrar', 'Đóng', 'Fermer', 'Fechar', 'Закрыть', 'Tutup'
  ] as L10,

  /** 페이지 상단 읽기 전용 띠 */
  banner: [
    '읽기 전용 모드 — 둘러보기는 자유롭게, 투표·제안·결제·등록은 Pi 지갑 인증 후 가능합니다.',
    'Read-only mode — browse freely; voting, proposals, payments and submissions unlock after Pi wallet verification.',
    '只读模式 — 可自由浏览；投票、提案、支付与提交需 Pi 钱包认证。',
    '閲覧専用モード — 閲覧は自由、投票・提案・決済・登録は Pi ウォレット認証後です。',
    'Modo solo lectura: navega libremente; votar, proponer, pagar y registrar requiere verificación Pi.',
    'Chế độ chỉ đọc — tự do xem; bỏ phiếu, đề xuất, thanh toán và đăng ký cần xác thực ví Pi.',
    'Mode lecture seule — naviguez librement ; voter, proposer, payer et publier après vérification Pi.',
    'Modo somente leitura — navegue livremente; votar, propor, pagar e registrar exigem verificação Pi.',
    'Режим чтения — просмотр свободен; голосование, предложения, оплата и заявки после верификации Pi.',
    'Mode hanya baca — bebas menjelajah; voting, usulan, pembayaran, dan pendaftaran butuh verifikasi dompet Pi.'
  ] as L10,

  bannerBtn: [
    '인증 방법',
    'How to verify',
    '认证方法',
    '認証方法',
    'Cómo verificar',
    'Cách xác thực',
    'Comment vérifier',
    'Como verificar',
    'Как пройти',
    'Cara verifikasi'
  ] as L10,

  /** 인증 완료 상태 문구 (배지·안내 공용) */
  verified: [
    'Pi KYC 인증 연결됨',
    'Pi KYC identity connected',
    'Pi KYC 实名认证已连接',
    'Pi KYC 認証に接続済み',
    'Identidad Pi KYC conectada',
    'Danh tính Pi KYC đã kết nối',
    'Identité Pi KYC connectée',
    'Identidade Pi KYC conectada',
    'Личность Pi KYC подключена',
    'Identitas Pi KYC terhubung'
  ] as L10
};

/** {a} 자리에 액션 이름을 넣어 문장을 만든다. */
export function gateActionLine(lang: GateLang, action?: string | null): string {
  if (!action) return '';
  return gate(GATE.action, lang).replace('{a}', action);
}
