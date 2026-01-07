/**
 * Cookie consent management utilities
 * Handles GDPR/CCPA compliant cookie consent storage and retrieval
 */

// Cookie consent keys
const COOKIE_CONSENT_KEY = 'cookie_consent';

// Cookie consent expiration times (in milliseconds)
const ACCEPT_EXPIRATION = 365 * 24 * 60 * 60 * 1000; // 1 year
const DECLINE_EXPIRATION = 30 * 24 * 60 * 60 * 1000; // 1 month

export type CookieConsentStatus = 'accepted' | 'declined' | null;

/**
 * Set cookie consent status
 * @param accepted - true for accepted, false for declined
 */
export const setCookieConsent = (accepted: boolean): void => {
  const status: CookieConsentStatus = accepted ? 'accepted' : 'declined';
  const expiration = accepted ? ACCEPT_EXPIRATION : DECLINE_EXPIRATION;

  try {
    const consentData = {
      status,
      timestamp: Date.now(),
      expiresAt: Date.now() + expiration,
    };

    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consentData));
  } catch (error) {
    console.warn('Failed to save cookie consent:', error);
  }
};

/**
 * Get cookie consent status
 * @returns 'accepted', 'declined', or null if not set or expired
 */
export const getCookieConsent = (): CookieConsentStatus => {
  try {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!stored) return null;

    const consentData = JSON.parse(stored);

    // Check if consent has expired
    if (consentData.expiresAt && Date.now() > consentData.expiresAt) {
      localStorage.removeItem(COOKIE_CONSENT_KEY);
      return null;
    }

    return consentData.status;
  } catch (error) {
    console.warn('Failed to retrieve cookie consent:', error);
    return null;
  }
};

/**
 * Check if user has given cookie consent
 * @returns true if cookies are accepted
 */
export const hasCookieConsent = (): boolean => {
  return getCookieConsent() === 'accepted';
};

/**
 * Clear cookie consent (for testing or reset purposes)
 */
export const clearCookieConsent = (): void => {
  try {
    localStorage.removeItem(COOKIE_CONSENT_KEY);
  } catch (error) {
    console.warn('Failed to clear cookie consent:', error);
  }
};

/**
 * Get remaining days until consent expires
 * @returns number of days, or null if no consent
 */
export const getConsentDaysRemaining = (): number | null => {
  try {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!stored) return null;

    const consentData = JSON.parse(stored);
    if (!consentData.expiresAt) return null;

    const remainingMs = consentData.expiresAt - Date.now();
    return Math.max(0, Math.ceil(remainingMs / (24 * 60 * 60 * 1000)));
  } catch (error) {
    return null;
  }
};
