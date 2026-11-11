import { CATALOG_VERIFICATION_MAX_AGE_HOURS } from '@closetiq/shared-types';

export const CATALOG_VERIFICATION_MAX_AGE_MS = CATALOG_VERIFICATION_MAX_AGE_HOURS * 60 * 60 * 1000;

export function catalogVerificationCutoff(now = Date.now()): Date {
  return new Date(now - CATALOG_VERIFICATION_MAX_AGE_MS);
}

export function isCatalogVerificationCurrent(verifiedAt: Date | null, now = Date.now()): boolean {
  return Boolean(verifiedAt && verifiedAt.getTime() >= now - CATALOG_VERIFICATION_MAX_AGE_MS);
}
