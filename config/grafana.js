// config/grafana.js
// Grafana Cloud k6 integration settings

export const GRAFANA_CONFIG = {
  // Set via environment variables — never hardcode credentials
  token:   __ENV.K6_CLOUD_TOKEN   || '',
  stackId: __ENV.K6_CLOUD_STACK_ID || '',
  host:    __ENV.K6_CLOUD_HOST    || 'ingest.k6.io',
};

// Output string for k6 --out flag
// Usage: k6 run --out xk6-dashboard=... script.js
export function getCloudOutput() {
  if (!GRAFANA_CONFIG.token) {
    console.warn('GRAFANA: K6_CLOUD_TOKEN not set — running without cloud output');
    return null;
  }
  return `cloud=https://${GRAFANA_CONFIG.host}`;
}
