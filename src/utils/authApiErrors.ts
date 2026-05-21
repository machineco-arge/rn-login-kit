export interface AuthApiErrorPayload {
  code?: string;
  message?: string;
}

type TranslateFn = (key: string, options?: Record<string, string | number>) => string;

const CODE_TO_KEY: Record<string, string> = {
  invalid_email: 'authError_invalid_email',
  email_already_registered: 'authError_email_already_registered',
  resend_cooldown: 'authError_resend_cooldown',
  resend_too_soon: 'authError_resend_cooldown',
  email_send_failed: 'authError_email_send_failed',
  missing_verification_code: 'authError_missing_verification_code',
  verification_code_required: 'authError_missing_verification_code',
  invalid_code: 'authError_invalid_code',
  no_pending_code: 'authError_no_pending_code',
  code_expired: 'authError_code_expired',
  too_many_attempts: 'authError_too_many_attempts',
  invalid_password: 'authError_invalid_password',
  email_not_found: 'authError_email_not_found',
  user_not_found: 'authError_email_not_found',
  account_no_password: 'authError_account_no_password',
  social_account: 'authError_account_no_password',
  invalid_token: 'authError_invalid_token',
  token_expired: 'authError_invalid_token',
  token_required: 'authError_invalid_token',
  token_already_used: 'authError_token_already_used',
  passwords_not_match: 'authError_passwords_not_match',
  password_mismatch: 'authError_passwords_not_match',
  weak_password: 'authError_weak_password',
  password_same_as_old: 'authError_password_same_as_old',
  upstream_register_failed: 'authError_upstream_failed',
};

/** Server TR messages when `code` is missing (production / proxy). */
const MESSAGE_TO_KEY: Record<string, string> = {
  'Geçerli bir e-posta adresi girin.': 'authError_invalid_email',
  'Geçersiz e-posta adresi.': 'authError_invalid_email',
  'Bu e-posta ile kayıtlı başka bir kullanıcı mevcut': 'authError_email_already_registered',
  'Bu e-posta ile kayıtlı başka bir kullanıcı mevcut.': 'authError_email_already_registered',
  'E-posta gönderilemedi.': 'authError_email_send_failed',
  'Doğrulama kodu gerekli.': 'authError_missing_verification_code',
  'Doğrulama kodu hatalı.': 'authError_invalid_code',
  'Doğrulama kodu hatalı': 'authError_invalid_code',
  'Önce doğrulama kodu isteyin.': 'authError_no_pending_code',
  'Doğrulama kodunun süresi doldu.': 'authError_code_expired',
  'Doğrulama kodunun süresi doldu. Yeni kod isteyin.': 'authError_code_expired',
  'Çok fazla deneme. Yeni kod isteyin.': 'authError_too_many_attempts',
  'Bu e-posta ile kayıtlı hesap bulunamadı.': 'authError_email_not_found',
  'Kullanıcı bulunamadı': 'authError_email_not_found',
  'Bu hesap için şifre sıfırlama kullanılamaz.': 'authError_account_no_password',
  'Geçersiz veya süresi dolmuş jeton.': 'authError_invalid_token',
  'Bu jeton zaten kullanıldı.': 'authError_token_already_used',
  'Şifreler eşleşmiyor.': 'authError_passwords_not_match',
  'Şifre en az 6 karakter olmalıdır.': 'authError_weak_password',
  'Yeni şifre eskisiyle aynı olamaz.': 'authError_password_same_as_old',
  'Kayıt sunucusuna ulaşılamadı.': 'authError_upstream_failed',
};

function extractResendSeconds(message?: string): string | undefined {
  if (!message) return undefined;
  const match = message.match(/(\d+)\s*saniye/i);
  return match?.[1];
}

function isResendCooldown(code?: string, message?: string): boolean {
  if (code === 'resend_cooldown' || code === 'resend_too_soon') return true;
  return !!message && /saniye\s+sonra\s+tekrar/i.test(message);
}

export function extractAuthApiError(error: unknown): AuthApiErrorPayload {
  if (error && typeof error === 'object' && 'response' in error) {
    const data = (error as { response?: { data?: AuthApiErrorPayload } }).response?.data;
    return { code: data?.code, message: data?.message };
  }
  if (error instanceof Error) {
    return { message: error.message };
  }
  return {};
}

export function resolveAuthErrorMessage(
  t: TranslateFn,
  params: {
    code?: string;
    message?: string;
    fallbackKey?: string;
  },
): string {
  const { code, message, fallbackKey = 'userSignInErrorAlertMessage' } = params;

  if (isResendCooldown(code, message)) {
    const seconds = extractResendSeconds(message) ?? '60';
    return t('authError_resend_cooldown', { seconds });
  }

  if (code && CODE_TO_KEY[code]) {
    return t(CODE_TO_KEY[code]);
  }

  const trimmed = message?.trim();
  if (trimmed && MESSAGE_TO_KEY[trimmed]) {
    return t(MESSAGE_TO_KEY[trimmed]);
  }

  return t(fallbackKey);
}
