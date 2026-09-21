const API_GATEWAY_URL =
  import.meta.env.VITE_API_GATEWAY_URL ?? 'http://localhost:8080';

const AUTH_ENDPOINT =
  import.meta.env.VITE_AUTH_ENDPOINT ?? '/api/auth/login';

export async function signIn(credentials) {
  return fetch(`${API_GATEWAY_URL}${AUTH_ENDPOINT}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
}



export async function gatewayRequest(path, options = {}) {
  const token = sessionStorage.getItem('agritech_access_token');

  const headers = new Headers(options.headers);

  headers.set('Content-Type', 'application/json');

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  return fetch(`${API_GATEWAY_URL}${path}`, {
    ...options,
    headers,
  });
}


// Get all registered sensors
export async function getSensors() {
  return gatewayRequest('/api/sensors');
}


// Get the latest 20 telemetry readings from the farm
export async function getLatestFarmTelemetry() {
  return gatewayRequest('/api/sensors/telemetry/latest');
}


// Get the latest telemetry reading for a specific zone
export async function getZoneTelemetry(zoneId) {
  return gatewayRequest(
    `/api/sensors/zone/${encodeURIComponent(zoneId)}/latest`
  );
}


// Get telemetry history for a specific device
export async function getDeviceHistory(deviceCode) {
  return gatewayRequest(
    `/api/sensors/device/${encodeURIComponent(deviceCode)}/history`
  );
}
export async function getCropHealthSummary() {
  return gatewayRequest('/api/crop-monitoring/health-summary');
}
export async function getWaterSummary() {
  return gatewayRequest('/api/irrigation/water-summary');
}
export async function getWaterLogs() {
  return gatewayRequest('/api/irrigation/logs');
}
export async function getCrops() {
  return gatewayRequest('/api/crops');
}