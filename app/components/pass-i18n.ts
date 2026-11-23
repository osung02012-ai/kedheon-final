/* ------------------------------------------------------------------
 * Kedheon.pi Pass — 10개국어 문구
 * KR · EN · CN · JP · ES · VN · FR · PT · RU · ID
 * 각 문자열은 고정 10-tuple이라 언어가 빠지면 빌드가 실패한다
 * (pi-gate-i18n.ts · hangang/lib/i18n.ts 와 같은 규칙).
 * FactFilter만 KO/EN 두 칸을 쓴다.
 * ------------------------------------------------------------------ */

import type { GateLang } from './pi-gate-i18n';

export type PassLang = GateLang;
export type L10 = readonly [string, string, string, string, string, string, string, string, string, string];

export const PASS_LANG_INDEX: Record<PassLang, number> = {
  KR: 0, EN: 1, CN: 2, JP: 3, ES: 4, VN: 5, FR: 6, PT: 7, RU: 8, ID: 9
};

export const PASS_TEXT = {
  /** 헤더 배지 — 미로그인·로그인 전 */
  badgeIdle: ['π PASS', 'π PASS', 'π PASS', 'π PASS', 'π PASS', 'π PASS', 'π PASS', 'π PASS', 'π PASS', 'π PASS'],
  /** 헤더 배지 — 없음 */
  badgeStart: [
    '패스 시작', 'Get Pass', '开通通行证', 'パス開始', 'Obtener pase', 'Mở Pass', 'Obtenir le Pass', 'Obter Pass', 'Получить Pass', 'Dapatkan Pass'
  ],
  /** 시트 제목 */
  title: [
    'Kedheon.pi Pass · 30일',
    'Kedheon.pi Pass · 30 days',
    'Kedheon.pi Pass · 30 天',
    'Kedheon.pi Pass · 30日',
    'Kedheon.pi Pass · 30 días',
    'Kedheon.pi Pass · 30 ngày',
    'Kedheon.pi Pass · 30 jours',
    'Kedheon.pi Pass · 30 dias',
    'Kedheon.pi Pass · 30 дней',
    'Kedheon.pi Pass · 30 hari'
  ],
  /** 한 줄 범위 */
  subtitle: [
    '한 번 결제로 Kedheon · FactFilter · Hangang',
    'One payment covers Kedheon · FactFilter · Hangang',
    '一次付费通行 Kedheon · FactFilter · Hangang',
    '1回の支払いで Kedheon · FactFilter · Hangang',
    'Un solo pago para Kedheon · FactFilter · Hangang',
    'Một lần thanh toán cho Kedheon · FactFilter · Hangang',
    'Un seul paiement pour Kedheon · FactFilter · Hangang',
    'Um pagamento para Kedheon · FactFilter · Hangang',
    'Одна оплата — Kedheon · FactFilter · Hangang',
    'Sekali bayar untuk Kedheon · FactFilter · Hangang'
  ],
  statusActive: [
    '{date}까지 · D-{d}',
    'Active until {date} · D-{d}',
    '有效至 {date} · D-{d}',
    '{date} まで有効 · D-{d}',
    'Vigente hasta {date} · D-{d}',
    'Hiệu lực đến {date} · D-{d}',
    'Actif jusqu’au {date} · J-{d}',
    'Ativo até {date} · D-{d}',
    'Действует до {date} · D-{d}',
    'Aktif sampai {date} · D-{d}'
  ],
  statusExpired: [
    '{date}에 만료되었습니다',
    'Expired on {date}',
    '已于 {date} 到期',
    '{date} に期限切れ',
    'Caducó el {date}',
    'Đã hết hạn ngày {date}',
    'Expiré le {date}',
    'Expirou em {date}',
    'Истёк {date}',
    'Kedaluwarsa {date}'
  ],
  statusNone: [
    '아직 패스가 없습니다',
    'No pass yet',
    '还没有通行证',
    'まだパスがありません',
    'Aún no tienes pase',
    'Chưa có Pass',
    'Pas encore de Pass',
    'Ainda sem Pass',
    'Pass пока нет',
    'Belum punya Pass'
  ],
  statusPending: [
    '회원번호 발급 대기',
    'Member number pending',
    '会员号发放中',
    '会員番号発行待ち',
    'Número de miembro pendiente',
    'Đang cấp số thành viên',
    'Numéro de membre en attente',
    'Número de membro pendente',
    'Номер участника ожидается',
    'Nomor anggota tertunda'
  ],
  humanVerified: [
    'Human-Verified · Pi KYC',
    'Human-Verified · Pi KYC',
    '真人已验证 · Pi KYC',
    '本人確認済み · Pi KYC',
    'Verificado · Pi KYC',
    'Đã xác thực · Pi KYC',
    'Vérifié · Pi KYC',
    'Verificado · Pi KYC',
    'Подтверждён · Pi KYC',
    'Terverifikasi · Pi KYC'
  ],
  benefitKedheon: [
    'Kedheon — BEOM 적립 ×1.5 · 통합 패스 관리',
    'Kedheon — BEOM rewards ×1.5 · unified pass control',
    'Kedheon — BEOM 累积 ×1.5 · 统一通行证管理',
    'Kedheon — BEOM 獲得 ×1.5 · 統合パス管理',
    'Kedheon — BEOM ×1.5 · control unificado del pase',
    'Kedheon — BEOM ×1,5 · quản lý pass hợp nhất',
    'Kedheon — BEOM ×1,5 · gestion unifiée du Pass',
    'Kedheon — BEOM ×1,5 · gestão unificada do Pass',
    'Kedheon — BEOM ×1,5 · единое управление Pass',
    'Kedheon — BEOM ×1,5 · kelola Pass terpadu'
  ],
  benefitFact: [
    'FactFilter — 우선 검증 요청 · 원장 필터·CSV',
    'FactFilter — priority verification · ledger filters & CSV',
    'FactFilter — 优先核实请求 · 原账筛选·CSV',
    'FactFilter — 優先検証リクエスト · 台帳フィルタ・CSV',
    'FactFilter — verificación prioritaria · filtros y CSV',
    'FactFilter — yêu cầu ưu tiên · lọc sổ & CSV',
    'FactFilter — vérification prioritaire · filtres et CSV',
    'FactFilter — verificação prioritária · filtros e CSV',
    'FactFilter — приоритетная проверка · фильтры и CSV',
    'FactFilter — verifikasi prioritas · filter & CSV'
  ],
  benefitHangang: [
    'Hangang — 저장 무제한 · 프리미엄 3일 코스',
    'Hangang — unlimited saves · premium 3-day course',
    'Hangang — 无限收藏 · 高级 3 日路线',
    'Hangang — 保存無制限 · プレミアム3日コース',
    'Hangang — guardados ilimitados · ruta premium de 3 días',
    'Hangang — lưu không giới hạn · lịch trình 3 ngày',
    'Hangang — favoris illimités · parcours 3 jours',
    'Hangang — salvos ilimitados · roteiro de 3 dias',
    'Hangang — без лимита сохранений · курс на 3 дня',
    'Hangang — simpan tanpa batas · kursus 3 hari'
  ],
  counter: [
    '창립 자리 {r} / {l}',
    'Founding seats left {r} / {l}',
    '创始席位 {r} / {l}',
    '創設枠 {r} / {l}',
    'Plazas fundadoras {r} / {l}',
    'Suất sáng lập {r} / {l}',
    'Places fondatrices {r} / {l}',
    'Vagas fundadoras {r} / {l}',
    'Мест основателей {r} / {l}',
    'Kursi pendiri {r} / {l}'
  ],
  counterClosed: [
    '창립 마감 · Early Wave {e}자리',
    'Founding closed · {e} Early Wave seats',
    '创始已满 · Early Wave {e} 席',
    '創設終了 · Early Wave {e}枠',
    'Fundador cerrado · {e} plazas Early Wave',
    'Đã hết suất sáng lập · {e} suất Early Wave',
    'Fondateur clos · {e} places Early Wave',
    'Fundador encerrado · {e} vagas Early Wave',
    'Набор основателей закрыт · {e} мест Early Wave',
    'Pendiri ditutup · {e} kursi Early Wave'
  ],
  price: [
    '{p} Pi / 30일',
    '{p} Pi / 30 days',
    '{p} Pi / 30 天',
    '{p} Pi / 30日',
    '{p} Pi / 30 días',
    '{p} Pi / 30 ngày',
    '{p} Pi / 30 jours',
    '{p} Pi / 30 dias',
    '{p} Pi / 30 дней',
    '{p} Pi / 30 hari'
  ],
  priceFree: [
    'Genesis 첫 30일 무료',
    'First 30 days free for Genesis',
    'Genesis 前 30 天免费',
    'Genesis 最初の30日は無料',
    '30 días gratis para Genesis',
    '30 ngày đầu miễn phí cho Genesis',
    '30 premiers jours offerts aux Genesis',
    '30 dias grátis para Genesis',
    'Первые 30 дней бесплатно для Genesis',
    '30 hari pertama gratis untuk Genesis'
  ],
  tierGenesis: [
    'Genesis 1~3,141 · 첫 달 0 Pi, 이후 0.5 Pi',
    'Genesis 1–3,141 · first month free, then 0.5 Pi',
    'Genesis 1~3,141 · 首月免费，之后 0.5 Pi',
    'Genesis 1〜3,141 · 初月無料、以降0.5 Pi',
    'Genesis 1–3.141 · primer mes gratis, luego 0,5 Pi',
    'Genesis 1–3.141 · tháng đầu miễn phí, sau 0,5 Pi',
    'Genesis 1–3 141 · premier mois offert, puis 0,5 Pi',
    'Genesis 1–3.141 · 1º mês grátis, depois 0,5 Pi',
    'Genesis 1–3 141 · первый месяц бесплатно, затем 0,5 Pi',
    'Genesis 1–3.141 · bulan pertama gratis, lalu 0,5 Pi'
  ],
  tierEarly: [
    'Early 3,142~31,415 · 0.7 Pi / 30일',
    'Early 3,142–31,415 · 0.7 Pi / 30 days',
    'Early 3,142~31,415 · 0.7 Pi / 30 天',
    'Early 3,142〜31,415 · 0.7 Pi / 30日',
    'Early 3.142–31.415 · 0,7 Pi / 30 días',
    'Early 3.142–31.415 · 0,7 Pi / 30 ngày',
    'Early 3 142–31 415 · 0,7 Pi / 30 jours',
    'Early 3.142–31.415 · 0,7 Pi / 30 dias',
    'Early 3 142–31 415 · 0,7 Pi / 30 дней',
    'Early 3.142–31.415 · 0,7 Pi / 30 hari'
  ],
  tierMember: [
    'Member 31,416+ · 1 Pi / 30일',
    'Member 31,416+ · 1 Pi / 30 days',
    'Member 31,416+ · 1 Pi / 30 天',
    'Member 31,416+ · 1 Pi / 30日',
    'Member 31.416+ · 1 Pi / 30 días',
    'Member 31.416+ · 1 Pi / 30 ngày',
    'Member 31 416+ · 1 Pi / 30 jours',
    'Member 31.416+ · 1 Pi / 30 dias',
    'Member 31 416+ · 1 Pi / 30 дней',
    'Member 31.416+ · 1 Pi / 30 hari'
  ],
  ctaStart: [
    'Pi로 시작하기',
    'Start with Pi',
    '用 Pi 开始',
    'Pi ではじめる',
    'Empezar con Pi',
    'Bắt đầu với Pi',
    'Commencer avec Pi',
    'Começar com Pi',
    'Начать с Pi',
    'Mulai dengan Pi'
  ],
  ctaBuy: [
    '{p} Pi로 30일 연장',
    'Add 30 days for {p} Pi',
    '支付 {p} Pi 延长 30 天',
    '{p} Pi で30日延長',
    'Añadir 30 días por {p} Pi',
    'Gia hạn 30 ngày với {p} Pi',
    'Ajouter 30 jours pour {p} Pi',
    'Adicionar 30 dias por {p} Pi',
    'Продлить на 30 дней за {p} Pi',
    'Tambah 30 hari dengan {p} Pi'
  ],
  ctaWait: [
    '결제 준비 중',
    'Payment not opened yet',
    '支付准备中',
    '決済準備中',
    'Pago en preparación',
    'Thanh toán chưa mở',
    'Paiement en préparation',
    'Pagamento em preparação',
    'Платёж готовится',
    'Pembayaran belum dibuka'
  ],
  note: [
    'Pi Browser 안에서만 결제됩니다 · 자동결제가 아니며 30일 후 직접 갱신합니다',
    'Payments run only inside Pi Browser · no auto-renewal, you renew after 30 days',
    '仅可在 Pi 浏览器内支付 · 不自动续费，30 天后需手动续期',
    'Pi ブラウザ内のみで決済 · 自動更新なし、30日後に手動更新',
    'Solo se paga dentro de Pi Browser · sin renovación automática, renuevas a los 30 días',
    'Chỉ thanh toán trong Pi Browser · không tự động gia hạn, bạn tự gia hạn sau 30 ngày',
    'Paiement uniquement dans Pi Browser · sans reconduction, vous renouvelez après 30 jours',
    'Pagamento só no Pi Browser · sem renovação automática, você renova após 30 dias',
    'Оплата только в Pi Browser · без автопродления, продлеваете сами через 30 дней',
    'Hanya bayar di Pi Browser · tanpa perpanjangan otomatis, Anda perpanjang setelah 30 hari'
  ],
  notReady: [
    '이 앱의 Pi 서버 키가 아직 설정되지 않아 유료 결제가 열리지 않았습니다. 창립 무료 이용권은 그대로 쓸 수 있습니다.',
    'This app’s Pi server key is not configured yet, so paid checkout is closed. Founding free access still works.',
    '本应用的 Pi 服务器密钥尚未配置，付费结账暂未开放。创始免费权益照常可用。',
    'このアプリの Pi サーバーキーが未設定のため、有料決済はまだ開いていません。創設無料枠はそのまま使えます。',
    'La clave de servidor Pi de esta app aún no está configurada, así que el pago está cerrado. El acceso fundador gratuito sigue disponible.',
    'Khóa máy chủ Pi của ứng dụng chưa được cấu hình nên thanh toán đang đóng. Quyền lợi sáng lập miễn phí vẫn dùng được.',
    'La clé serveur Pi de cette app n’est pas configurée : le paiement est fermé. L’accès fondateur gratuit reste actif.',
    'A chave de servidor Pi deste app ainda não está configurada, então o pagamento está fechado. O acesso fundador grátis continua.',
    'Серверный ключ Pi для этого приложения ещё не настроен — оплата закрыта. Бесплатный доступ основателя работает.',
    'Kunci server Pi aplikasi ini belum diatur, jadi pembayaran belum dibuka. Akses pendiri gratis tetap berlaku.'
  ],
  loginHint: [
    'Pi Browser에서 로그인하면 회원번호와 30일 이용권이 함께 발급됩니다.',
    'Sign in inside Pi Browser to receive your member number and 30-day pass.',
    '在 Pi 浏览器登录即可获得会员号和 30 天通行证。',
    'Pi ブラウザでログインすると会員番号と30日パスが発行されます。',
    'Inicia sesión en Pi Browser para recibir tu número y el pase de 30 días.',
    'Đăng nhập trong Pi Browser để nhận số thành viên và Pass 30 ngày.',
    'Connectez-vous dans Pi Browser pour recevoir votre numéro et le Pass de 30 jours.',
    'Entre no Pi Browser para receber seu número e o Pass de 30 dias.',
    'Войдите в Pi Browser, чтобы получить номер участника и Pass на 30 дней.',
    'Masuk di Pi Browser untuk menerima nomor anggota dan Pass 30 hari.'
  ],
  exportBtn: [
    '내 기록 CSV 내보내기',
    'Export my records (CSV)',
    '导出我的记录 CSV',
    '記録をCSVで書き出す',
    'Exportar mis registros (CSV)',
    'Xuất dữ liệu của tôi (CSV)',
    'Exporter mes données (CSV)',
    'Exportar meus registros (CSV)',
    'Экспорт моих записей (CSV)',
    'Ekspor catatan saya (CSV)'
  ],
  exportDenied: [
    '패스 사용 중에만 내보낼 수 있습니다.',
    'Export is available while your pass is active.',
    '仅在通行证有效期内可导出。',
    'パス有効中のみ書き出せます。',
    'Solo puedes exportar mientras el pase esté activo.',
    'Chỉ xuất được khi Pass còn hiệu lực.',
    'Export possible pendant la validité du Pass.',
    'Exporte apenas com o Pass ativo.',
    'Экспорт доступен при активном Pass.',
    'Ekspor hanya saat Pass aktif.'
  ],
  buyOk: [
    '30일이 추가되었습니다.',
    '30 days added.',
    '已增加 30 天。',
    '30日を追加しました。',
    'Se añadieron 30 días.',
    'Đã cộng 30 ngày.',
    '30 jours ajoutés.',
    '30 dias adicionados.',
    'Добавлено 30 дней.',
    '30 hari ditambahkan.'
  ],
  buyFail: [
    '결제가 완료되지 않았습니다',
    'Payment was not completed',
    '支付未完成',
    '決済が完了しませんでした',
    'El pago no se completó',
    'Thanh toán chưa hoàn tất',
    'Le paiement n’a pas abouti',
    'O pagamento não foi concluído',
    'Платёж не завершён',
    'Pembayaran tidak selesai'
  ],
  close: ['닫기', 'Close', '关闭', '閉じる', 'Cerrar', 'Đóng', 'Fermer', 'Fechar', 'Закрыть', 'Tutup'],
  more: ['자세히', 'Details', '详情', '詳細', 'Detalles', 'Chi tiết', 'Détails', 'Detalhes', 'Подробнее', 'Detail'],
  /** 앱 상단 한 줄 스트립 */
  stripFact: [
    '패스 · 우선 검증 요청 + 원장 필터/CSV',
    'Pass · priority verification + ledger filters/CSV',
    '通行证 · 优先核实 + 原账筛选/CSV',
    'パス · 優先検証＋台帳フィルタ/CSV',
    'Pase · verificación prioritaria + filtros/CSV',
    'Pass · ưu tiên xác minh + lọc/CSV',
    'Pass · vérification prioritaire + filtres/CSV',
    'Pass · verificação prioritária + filtros/CSV',
    'Pass · приоритетная проверка + фильтры/CSV',
    'Pass · verifikasi prioritas + filter/CSV'
  ],
  stripHangang: [
    '패스 · 저장 무제한 + 프리미엄 3일 코스',
    'Pass · unlimited saves + premium 3-day course',
    '通行证 · 无限收藏 + 高级 3 日路线',
    'パス · 保存無制限＋プレミアム3日コース',
    'Pase · guardados ilimitados + ruta de 3 días',
    'Pass · lưu không giới hạn + lịch 3 ngày',
    'Pass · favoris illimités + parcours 3 jours',
    'Pass · salvos ilimitados + roteiro de 3 dias',
    'Pass · без лимита сохранений + курс на 3 дня',
    'Pass · simpan tanpa batas + kursus 3 hari'
  ],
  /** FactFilter 우선 검증 토글 */
  priorityLabel: [
    '우선 검증 요청',
    'Priority verification',
    '优先核实请求',
    '優先検証リクエスト',
    'Verificación prioritaria',
    'Yêu cầu ưu tiên',
    'Vérification prioritaire',
    'Verificação prioritária',
    'Приоритетная проверка',
    'Verifikasi prioritas'
  ],
  priorityHintPass: [
    '패스 사용자 — 접수 즉시 우선 큐 상단에 올립니다',
    'Pass holder — queued at the top for review',
    '通行证用户 — 提交后进入优先队列顶部',
    'パス会員 — 受付後すぐに優先キューの先頭へ',
    'Usuario con pase — se coloca en la cola prioritaria',
    'Người có Pass — vào đầu hàng đợi ưu tiên',
    'Titulaire du Pass — placé en tête de file',
    'Com Pass — entra no topo da fila prioritária',
    'С Pass — заявка идёт в начало приоритетной очереди',
    'Pemegang Pass — masuk antrean prioritas teratas'
  ],
  priorityHintFree: [
    '접수는 무료입니다 · 패스는 순번을 앞당깁니다',
    'Submitting is free · a pass moves you up the queue',
    '提交免费 · 通行证可提前排队',
    '受付は無料 · パスで順番が前になります',
    'Enviar es gratis · el pase adelanta tu turno',
    'Gửi miễn phí · Pass giúp bạn lên trước',
    'Envoi gratuit · le Pass vous fait passer devant',
    'Enviar é grátis · o Pass adianta sua vez',
    'Отправка бесплатна · Pass двигает очередь',
    'Kirim gratis · Pass memajukan antrean Anda'
  ],
  priorityDone: [
    '우선 큐에 접수되었습니다 ({q}번째)',
    'Added to the queue (#{q})',
    '已进入队列（第 {q} 位）',
    'キューに受付しました（{q}番目）',
    'Añadido a la cola (#{q})',
    'Đã vào hàng đợi (#{q})',
    'Ajouté à la file (#{q})',
    'Adicionado à fila (#{q})',
    'Принято в очередь (#{q})',
    'Masuk antrean (#{q})'
  ],
  /** FactFilter 원장 필터 */
  ledgerFilter: ['원장 필터', 'Ledger filters', '原账筛选', '台帳フィルタ', 'Filtros del registro', 'Bộ lọc sổ', 'Filtres du registre', 'Filtros do registro', 'Фильтры реестра', 'Filter catatan'],
  filterAll: ['전체', 'All', '全部', 'すべて', 'Todo', 'Tất cả', 'Tout', 'Tudo', 'Все', 'Semua'],
  filterVerified: ['검증 완료', 'Verified', '已验证', '検証済み', 'Verificado', 'Đã xác minh', 'Vérifié', 'Verificado', 'Проверено', 'Terverifikasi'],
  filterPending: ['조사 중', 'Under review', '调查中', '調査中', 'En revisión', 'Đang xem xét', 'En cours', 'Em análise', 'В проверке', 'Ditinjau'],
  csvBtn: ['CSV', 'CSV', 'CSV', 'CSV', 'CSV', 'CSV', 'CSV', 'CSV', 'CSV', 'CSV'],
  passOnly: ['패스', 'Pass', '通行证', 'パス', 'Pase', 'Pass', 'Pass', 'Pass', 'Pass', 'Pass'],
  /** Hangang 저장 상한 */
  saveLimit: [
    '무료 3곳 / 패스 무제한',
    'Free 3 saves / unlimited with Pass',
    '免费 3 处 / 通行证无限',
    '無料3件 / パス無制限',
    'Gratis 3 / ilimitado con pase',
    'Miễn phí 3 / không giới hạn với Pass',
    'Gratuit 3 / illimité avec le Pass',
    'Grátis 3 / ilimitado com Pass',
    'Бесплатно 3 / без лимита с Pass',
    'Gratis 3 / tanpa batas dengan Pass'
  ],
  saveLimitHit: [
    '무료 저장은 3곳까지입니다. 패스로 무제한 저장하세요.',
    'Free saves are limited to 3. Get the Pass for unlimited saves.',
    '免费收藏最多 3 处。开通通行证可无限收藏。',
    '無料保存は3件まで。パスで無制限に保存できます。',
    'El plan gratis permite 3 guardados. Con el pase, ilimitado.',
    'Miễn phí lưu 3 nơi. Dùng Pass để lưu không giới hạn.',
    '3 favoris en gratuit. Le Pass permet l’illimité.',
    'Grátis salva 3. Com o Pass, ilimitado.',
    'Бесплатно — 3 сохранения. С Pass — без лимита.',
    'Gratis simpan 3. Dengan Pass tanpa batas.'
  ],
  /** Hangang 프리미엄 3일 코스 */
  premiumTitle: ['프리미엄 3일 코스', 'Premium 3-day course', '高级 3 日路线', 'プレミアム3日コース', 'Ruta premium de 3 días', 'Lịch trình 3 ngày', 'Parcours premium 3 jours', 'Roteiro premium de 3 dias', 'Премиум-курс на 3 дня', 'Kursus premium 3 hari'],
  premiumDesc: [
    '권역별 3일 동선과 예산 — 패스 전용',
    'Three-day route and budget per region — Pass only',
    '各区域 3 日动线与预算 — 通行证专享',
    '地域別3日動線と予算 — パス限定',
    'Ruta de 3 días y presupuesto por región — solo con pase',
    'Lịch trình 3 ngày và ngân sách theo vùng — chỉ với Pass',
    'Itinéraire 3 jours et budget par région — réservé au Pass',
    'Roteiro de 3 dias e orçamento por região — só com Pass',
    'Маршрут на 3 дня и бюджет по региону — только с Pass',
    'Rute 3 hari dan anggaran per wilayah — hanya Pass'
  ],
  day: ['{n}일차', 'Day {n}', '第 {n} 天', '{n}日目', 'Día {n}', 'Ngày {n}', 'Jour {n}', 'Dia {n}', 'День {n}', 'Hari {n}'],
  budget: ['예산', 'Budget', '预算', '予算', 'Presupuesto', 'Ngân sách', 'Budget', 'Orçamento', 'Бюджет', 'Anggaran'],
  icsBtn: ['캘린더(.ics)로 저장', 'Save to calendar (.ics)', '保存到日历 (.ics)', 'カレンダー(.ics)に保存', 'Guardar en calendario (.ics)', 'Lưu vào lịch (.ics)', 'Enregistrer au calendrier (.ics)', 'Salvar no calendário (.ics)', 'Сохранить в календарь (.ics)', 'Simpan ke kalender (.ics)'],
  icsDone: ['캘린더 파일을 만들었습니다', 'Calendar file created', '已生成日历文件', 'カレンダーファイルを作成しました', 'Archivo de calendario creado', 'Đã tạo tệp lịch', 'Fichier calendrier créé', 'Arquivo de calendário criado', 'Файл календаря создан', 'Berkas kalender dibuat'],
  loginFirst: [
    '먼저 Pi로 로그인해 주세요',
    'Sign in with Pi first',
    '请先用 Pi 登录',
    '先に Pi でログインしてください',
    'Primero inicia sesión con Pi',
    'Hãy đăng nhập bằng Pi trước',
    'Connectez-vous d’abord avec Pi',
    'Entre primeiro com Pi',
    'Сначала войдите через Pi',
    'Masuk dengan Pi dulu'
  ]
} as const;

export type PassTextKey = keyof typeof PASS_TEXT;

/** 언어 선택 + 변수 치환. 언어가 없으면 영어로 떨어진다. */
export function passT(lang: PassLang, key: PassTextKey, vars?: Record<string, string | number>): string {
  const tuple = PASS_TEXT[key] as L10;
  let text = tuple[PASS_LANG_INDEX[lang]] ?? tuple[1];
  if (vars) {
    for (const [name, value] of Object.entries(vars)) {
      text = text.split(`{${name}}`).join(String(value));
    }
  }
  return text;
}

/** FactFilter(KO/EN)처럼 두 언어만 쓰는 화면용 */
export function passLangOf(ko: boolean): PassLang {
  return ko ? 'KR' : 'EN';
}
