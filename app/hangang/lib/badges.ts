/* ------------------------------------------------------------------
 * Hangang — 인증 뱃지 4종
 * 인증을 못 하는 나이대(미성년·무카드)가 화면에서 먼저 판단할 수 있게,
 * 모든 카드·링크에 뱃지 1개를 붙인다. 10-tuple order: KR EN CN JP ES VN FR PT RU ID
 * ------------------------------------------------------------------ */

import type { L10 } from './i18n';

export type BadgeKind = 'none' | 'passport' | 'guardian' | 'pi';

export const BADGE_LABEL: Record<BadgeKind, L10> = {
  none: [
    '인증 불필요', 'No ID needed', '无需认证', '認証不要', 'Sin identificación',
    'Không cần xác minh', 'Sans pièce d’identité', 'Sem identificação',
    'Без документов', 'Tanpa verifikasi'
  ],
  passport: [
    '여권·글로벌 계정', 'Passport / global account', '护照·全球账号', 'パスポート・海外アカウント',
    'Pasaporte o cuenta global', 'Hộ chiếu / tài khoản quốc tế', 'Passeport ou compte international',
    'Passaporte ou conta global', 'Паспорт или зарубежный аккаунт', 'Paspor / akun global'
  ],
  guardian: [
    '보호자 동의 필요', 'Guardian consent', '需监护人同意', '保護者の同意', 'Consentimiento del tutor',
    'Cần người giám hộ đồng ý', 'Accord du tuteur', 'Consentimento do responsável',
    'Согласие опекуна', 'Izin wali'
  ],
  pi: [
    'Pi 지갑 필요 · 18+ KYC', 'Pi wallet · 18+ KYC', '需 Pi 钱包 · 18+ KYC', 'Piウォレット · 18+ KYC',
    'Cartera Pi · KYC 18+', 'Ví Pi · KYC 18+', 'Portefeuille Pi · KYC 18+',
    'Carteira Pi · KYC 18+', 'Кошелёк Pi · KYC 18+', 'Dompet Pi · KYC 18+'
  ]
};

export const BADGE_STYLE: Record<BadgeKind, string> = {
  none: 'bg-neutral-100 text-neutral-600 border border-neutral-200',
  passport: 'bg-black text-white border border-black',
  guardian: 'bg-white text-[#dc2626] border border-[#dc2626]',
  pi: 'bg-neutral-100 text-neutral-800 border border-neutral-400'
};

/** 인증이 막히는 순서 — 뱃지 범례를 이 순서로 보여 준다. */
export const BADGE_ORDER: BadgeKind[] = ['none', 'passport', 'guardian', 'pi'];

/** 뱃지 아래 한 줄 설명(무엇이 필요한지) */
export const BADGE_DESC: Record<BadgeKind, L10> = {
  none: [
    '가입·결제 없이 지금 바로 읽고 쓸 수 있습니다.',
    'Read and use it right now — no sign-up, no payment.',
    '无需注册和支付，现在就能阅读使用。',
    '登録も支払いも不要で、今すぐ読めます。',
    'Se lee y se usa ahora mismo, sin registro ni pago.',
    'Đọc và dùng ngay, không cần đăng ký hay thanh toán.',
    'À lire et à utiliser tout de suite, sans inscription ni paiement.',
    'Dá para ler e usar agora, sem cadastro nem pagamento.',
    'Можно читать и пользоваться сразу, без регистрации и оплаты.',
    'Bisa langsung dibaca dan dipakai, tanpa daftar atau bayar.'
  ],
  passport: [
    '여권(또는 해외 계정)만 있으면 됩니다. 한국 전화번호는 필요 없습니다.',
    'Your passport (or a global account) is enough. No Korean phone number needed.',
    '只需护照（或海外账号），不需要韩国手机号。',
    'パスポート（または海外アカウント）だけで可能。韓国の電話番号は不要です。',
    'Basta el pasaporte (o una cuenta global). No hace falta número coreano.',
    'Chỉ cần hộ chiếu (hoặc tài khoản quốc tế). Không cần số điện thoại Hàn Quốc.',
    'Le passeport (ou un compte international) suffit. Aucun numéro coréen requis.',
    'Basta o passaporte (ou conta global). Não precisa de número coreano.',
    'Достаточно паспорта (или зарубежного аккаунта). Корейский номер не нужен.',
    'Cukup paspor (atau akun global). Tidak perlu nomor telepon Korea.'
  ],
  guardian: [
    '미성년은 법정대리인 동의·서류가 필요합니다. 없으면 실행이 막힙니다.',
    'Minors need a legal guardian’s consent and documents, or this step is blocked.',
    '未成年人需法定代理人同意与文件，否则无法办理。',
    '未成年は法定代理人の同意・書類が必要です。ないと実行できません。',
    'Los menores necesitan consentimiento y documentos del tutor; sin ellos no se puede.',
    'Người chưa thành niên cần sự đồng ý và giấy tờ của người giám hộ, nếu không sẽ bị chặn.',
    'Les mineurs ont besoin de l’accord et des documents du tuteur, sinon l’étape est bloquée.',
    'Menores precisam do consentimento e documentos do responsável, senão não avança.',
    'Несовершеннолетним нужно согласие и документы опекуна, иначе шаг недоступен.',
    'Anak di bawah umur perlu izin dan dokumen wali; tanpa itu langkah ini terblokir.'
  ],
  pi: [
    'Pi KYC는 만 18세 이상만 가능합니다. 그 전에는 이 앱의 정보만 무료로 읽힙니다.',
    'Pi KYC is 18+. Until then, everything read-only in this app stays free.',
    'Pi KYC 仅限 18 岁以上。此前本应用的阅读信息全部免费。',
    'Pi KYC は18歳以上のみ。それまでは本アプリの情報は無料で読めます。',
    'El KYC de Pi es para mayores de 18. Mientras tanto, toda la información de la app es gratis.',
    'Pi KYC chỉ từ 18 tuổi. Trước đó, mọi thông tin trong ứng dụng vẫn miễn phí.',
    'Le KYC Pi est réservé aux 18 ans et plus. D’ici là, les informations restent gratuites.',
    'O KYC do Pi é para 18+. Até lá, toda a informação do app continua grátis.',
    'Pi KYC — только с 18 лет. До этого вся информация в приложении бесплатна.',
    'Pi KYC hanya 18+. Sebelum itu, semua informasi di aplikasi ini tetap gratis.'
  ]
};
