// scripts/helpers/reporter.js
// Structured SLOW_REPORT log parsing helper
// grep SLOW_REPORT k6-output.log | jq '.'

import { LOCALES } from '../../config/config.js';

const SLOW_TTFB_MS  = 700;
const SLOW_LOAD_MS  = 8000;

/**
 * Log a slow page report in structured format.
 * Parseable with: grep SLOW_REPORT output.log
 *
 * @param {string} locale   - Locale ID (e.g. 'eu', 'ro')
 * @param {string} page     - Page name (e.g. 'home', 'search')
 * @param {string} url      - Full URL tested
 * @param {number} ttfb     - Time to First Byte in ms
 * @param {number} loadTime - Full page load time in ms
 */
export function reportSlowPage(locale, page, url, ttfb, loadTime) {
  const isTtfbSlow  = ttfb     > SLOW_TTFB_MS;
  const isLoadSlow  = loadTime > SLOW_LOAD_MS;

  if (isTtfbSlow || isLoadSlow) {
    const report = {
      type:     'SLOW_REPORT',
      locale,
      page,
      url,
      ttfb_ms:      Math.round(ttfb),
      load_ms:      Math.round(loadTime),
      ttfb_slow:    isTtfbSlow,
      load_slow:    isLoadSlow,
      threshold_ttfb:  SLOW_TTFB_MS,
      threshold_load:  SLOW_LOAD_MS,
      timestamp: new Date().toISOString(),
    };
    console.log(JSON.stringify(report));
  }
}

/**
 * Summarize results per locale.
 * Call at end of test with collected metrics.
 *
 * @param {Object} results - { localeId: { ttfb: [], load: [] } }
 */
export function summarizeLocales(results) {
  const summary = [];

  for (const [localeId, data] of Object.entries(results)) {
    const avgTtfb = avg(data.ttfb);
    const avgLoad = avg(data.load);
    summary.push({
      locale:       localeId,
      avg_ttfb_ms:  Math.round(avgTtfb),
      avg_load_ms:  Math.round(avgLoad),
      ttfb_ok:      avgTtfb < SLOW_TTFB_MS,
      load_ok:      avgLoad < SLOW_LOAD_MS,
      samples:      data.ttfb.length,
    });
  }

  // Sort slowest first
  summary.sort((a, b) => b.avg_load_ms - a.avg_load_ms);
  console.log('LOCALE_SUMMARY ' + JSON.stringify(summary));
  return summary;
}

function avg(arr) {
  if (!arr.length) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}
