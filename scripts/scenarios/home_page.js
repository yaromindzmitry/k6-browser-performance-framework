// scripts/scenarios/home_page.js
// Browser Mode scenario — Home page load test

import { browser } from 'k6/browser';
import { check }   from 'k6';
import { OPTIONS }  from '../../config/config.js';
import { resolveLocale }  from '../helpers/locales.js';
import { reportSlowPage } from '../helpers/reporter.js';

export const options = OPTIONS;

export default async function () {
  const locale = resolveLocale();
  const url    = `${locale.baseUrl}/`;

  const page = await browser.newPage();

  try {
    const t0 = Date.now();
    await page.goto(url, { waitUntil: 'networkidle' });
    const loadTime = Date.now() - t0;

    // Collect TTFB from navigation timing
    const ttfb = await page.evaluate(() => {
      const nav = performance.getEntriesByType('navigation')[0];
      return nav ? nav.responseStart - nav.requestStart : 0;
    });

    // Core checks
    check(page, {
      'page title present':    p => p.title().length > 0,
      'no 4xx/5xx in title':   p => !p.title().match(/404|500|error/i),
      'search form visible':   p => p.locator('input[type="search"], input[name="kw"]').isVisible(),
    });

    reportSlowPage(locale.id, 'home', url, ttfb, loadTime);

  } finally {
    await page.close();
  }
}
