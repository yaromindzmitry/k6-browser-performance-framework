// scripts/helpers/locales.js

import { LOCALES } from '../../config/config.js';

/**
 * Get locale config by ID.
 * @param {string} id - e.g. 'eu', 'ro'
 */
export function getLocale(id) {
  return LOCALES.find(l => l.id === id) || LOCALES[0];
}

/**
 * Pick locale for current VU.
 * Distributes VUs across all locales in round-robin.
 */
export function pickLocaleForVU() {
  const idx = (__VU - 1) % LOCALES.length;
  return LOCALES[idx];
}

/**
 * Get locale from env or pick round-robin.
 */
export function resolveLocale() {
  if (__ENV.LOCALE) {
    return getLocale(__ENV.LOCALE);
  }
  return pickLocaleForVU();
}
