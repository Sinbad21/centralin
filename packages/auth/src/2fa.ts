import { authenticator } from 'otplib';

/**
 * Generate 2FA secret
 */
export function generate2FASecret(): string {
  return authenticator.generateSecret();
}

/**
 * Generate QR code URL for 2FA setup
 */
export function generate2FAQRCodeURL(
  email: string,
  secret: string,
  issuer: string = 'Chatbot Platform'
): string {
  return authenticator.keyuri(email, issuer, secret);
}

/**
 * Verify 2FA token
 */
export function verify2FAToken(token: string, secret: string): boolean {
  try {
    return authenticator.verify({ token, secret });
  } catch {
    return false;
  }
}

/**
 * Generate backup codes (for 2FA recovery)
 */
export function generateBackupCodes(count: number = 10): string[] {
  const codes: string[] = [];

  for (let i = 0; i < count; i++) {
    // Generate 8-character alphanumeric code
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    codes.push(code);
  }

  return codes;
}
