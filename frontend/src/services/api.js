const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, options)
  if (!response.ok) throw new Error(`Backend request failed: ${response.status}`)
  return response.json()
}

export async function sendCommand(command) {
  return request('/command', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ command }),
  })
}

export async function getSystemStats() {
  return request('/system')
}

export async function getJarvisStatus() {
  const health = await request('/health')
  return { state: health.status === 'online' ? 'ONLINE' : 'OFFLINE', message: health.assistant }
}
