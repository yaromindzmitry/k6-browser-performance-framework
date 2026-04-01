// scripts/scenarios/search_page.js
// Browser Mode scenario — Search results page

import { browser } from 'k6/browser';
import { check }   from 'k6';
import { OPTIONS }  from '../../config/config.js';
import { resolveLocale }  from '../helpers/locales.js';
import { reportSlowPage } from '../helpers/reporter.js';

export const options = OPTIONS;

const SEARCH_KEYWORDS = ['truck', 'van', 'trailer', 'semi', 'cargo'];

export default async function () {
  const locale  = resolveLocale();
  const keyword = SEARCH_KEYWORDS[Math.floor(Math.random() * SEARCH_KEYWORDS.length)];
  const url     = `${locale.baseUrl}/search?kw=${keyword}`;

  const page = await browser.newPage();

  try {
    const t0 = Date.now();
    await page.goto(url, { waitUntil: 'networkidle' });
    const loadTime = Date.now() - t0;

    const ttfb = await page.evaluate(() => {
      const nav = performance.getEntriesByType('navigation')[0];
      return nav ? nav.responseStart - nav.requestStart : 0;
    });

    check(page, {
      'results container visible': p => p.locator('.listing, .results, [class*="listing"]').isVisible(),
      'no error page':             p => !p.title().match(/404|500|error/i),
      'keyword in title or h1':    p => {
        const title = p.title().toLowerCase();
        return title.includes(keyword) || title.length > 0;
      },
    });

    reportSlowPage(locale.id, 'search', url, ttfb, loadTime);

  } finally {
    await page.close();
  }
}
