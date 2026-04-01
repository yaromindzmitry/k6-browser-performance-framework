// scripts/scenarios/listing_page.js
// Browser Mode scenario — Individual listing/detail page

import { browser } from 'k6/browser';
import { check }   from 'k6';
import { OPTIONS }  from '../../config/config.js';
import { resolveLocale }  from '../helpers/locales.js';
import { reportSlowPage } from '../helpers/reporter.js';

export const options = OPTIONS;

export default async function () {
  const locale = resolveLocale();

  const page = await browser.newPage();

  try {
    // Step 1: Load search page and grab first listing URL
    await page.goto(`${locale.baseUrl}/search?kw=truck`, { waitUntil: 'networkidle' });

    const listingHref = await page.evaluate(() => {
      const link = document.querySelector('a[href*="/listing/"], a[href*="/ad/"], .listing-card a');
      return link ? link.href : null;
    });

    if (!listingHref) {
      console.warn(`[${locale.id}] No listing link found on search page`);
      return;
    }

    // Step 2: Load the listing detail page
    const t0 = Date.now();
    await page.goto(listingHref, { waitUntil: 'networkidle' });
    const loadTime = Date.now() - t0;

    const ttfb = await page.evaluate(() => {
      const nav = performance.getEntriesByType('navigation')[0];
      return nav ? nav.responseStart - nav.requestStart : 0;
    });

    check(page, {
      'listing title visible':   p => p.locator('h1').isVisible(),
      'price element present':   p => p.locator('[class*="price"], [data-price]').isVisible(),
      'contact button present':  p => p.locator('button, a').filter({ hasText: /contact|call|phone|tel/i }).isVisible(),
      'no error page':           p => !p.title().match(/404|500|error/i),
    });

    reportSlowPage(locale.id, 'listing', listingHref, ttfb, loadTime);

  } finally {
    await page.close();
  }
}
