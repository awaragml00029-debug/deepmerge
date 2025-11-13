// NewAPI integration utilities

const NEW_API_BASE_URL = 'https://off.092420.xyz';

interface NewAPITokenResponse {
  success: boolean;
  message?: string;
  data?: {
    name: string;
    status: number; // 1=enabled, 2=disabled
    expired_time: number; // -1=never expires
    remain_quota: number; // in 1/1000 dollar
    unlimited_quota: boolean;
    used_quota: number; // in 1/1000 dollar
  };
}

export interface ValidationResult {
  valid: boolean;
  balance?: number; // in dollars
  used?: number; // in dollars
  tokenName?: string;
  error?: string;
}

/**
 * Validate NewAPI token and get balance information
 */
export async function validateNewAPIToken(token: string): Promise<ValidationResult> {
  try {
    const response = await fetch(`${NEW_API_BASE_URL}/api/token?key=${token}`);

    if (!response.ok) {
      return {
        valid: false,
        error: `HTTP ${response.status}: ${response.statusText}`,
      };
    }

    const result: NewAPITokenResponse = await response.json();

    if (!result.success || !result.data) {
      return {
        valid: false,
        error: result.message || 'Token validation failed',
      };
    }

    // Check if token is enabled
    if (result.data.status !== 1) {
      return {
        valid: false,
        error: 'Token is disabled',
      };
    }

    // Return validation result with balance
    return {
      valid: true,
      balance: result.data.remain_quota / 1000, // Convert to dollars
      used: result.data.used_quota / 1000,
      tokenName: result.data.name,
    };
  } catch (error) {
    console.error('NewAPI validation error:', error);
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

/**
 * Get balance for an already validated token
 */
export async function getTokenBalance(token: string): Promise<number | null> {
  try {
    const response = await fetch(`${NEW_API_BASE_URL}/api/token?key=${token}`);

    if (!response.ok) {
      return null;
    }

    const result: NewAPITokenResponse = await response.json();

    if (result.success && result.data) {
      return result.data.remain_quota / 1000; // Convert to dollars
    }

    return null;
  } catch (error) {
    console.error('Balance fetch error:', error);
    return null;
  }
}

/**
 * Get NewAPI recharge URL
 */
export function getRechargeURL(): string {
  return `${NEW_API_BASE_URL}/topup`;
}
