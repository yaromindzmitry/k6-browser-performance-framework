// config/config.js
// NDA: real domain names replaced with placeholders

export const LOCALES = [
  { id: 'eu',   baseUrl: 'https://example.eu' },
  { id: 'ro',   baseUrl: 'https://example.ro' },
  { id: 'cz',   baseUrl: 'https://example.cz' },
  { id: 'ch',   baseUrl: 'https://example.ch' },
  { id: 'at',   baseUrl: 'https://example.at' },
  { id: 'lu',   baseUrl: 'https://example.lu' },
  { id: 'ie',   baseUrl: 'https://example.ie' },
  { id: 'fi',   baseUrl: 'https://example.fi' },
  { id: 'me',   baseUrl: 'https://example.me' },
  { id: 'hu',   baseUrl: 'https://example.hu' },
  { id: 'md',   baseUrl: 'https://example-md.ro' },
  { id: 'ua',   baseUrl: 'https://example.com.ua' },
  { id: 'de',   baseUrl: 'https://example.de' },
  { id: 'fr',   baseUrl: 'https://example.fr' },
  { id: 'pl',   baseUrl: 'https://example.pl' },
];

export const THRESHOLDS = {
  browser_web_vital_ttfb:      [{ threshold: 'p(95)<700',  abortOnFail: false }],
  browser_web_vital_lcp:       [{ threshold: 'p(95)<2500', abortOnFail: false }],
  browser_web_vital_fid:       [{ threshold: 'p(95)<100',  abortOnFail: false }],
  browser_web_vital_cls:       [{ threshold: 'p(95)<0.1',  abortOnFail: false }],
  'browser_http_req_duration': [{ threshold: 'p(95)<8000', abortOnFail: false }],
  checks:                      [{ threshold: 'rate>0.9',   abortOnFail: false }],
};

export const OPTIONS = {
  scenarios: {
    browser_test: {
      executor:         'shared-iterations',
      vus:              5,
      iterations:       __ENV.ITERATIONS ? parseInt(__ENV.ITERATIONS) : 15,
      maxDuration:      '10m',
    },
  },
  thresholds: THRESHOLDS,
};
