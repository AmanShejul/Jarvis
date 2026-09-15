// These functions are the seam for the future Python/FastAPI integration.
// They intentionally return local mock data until a backend is available.
export async function sendCommand(command) {
  return {
    ok: true,
    command,
    response: 'Command received. Backend connection required to execute this action.',
  }
}

export async function getSystemStats() {
  return { cpu: 12, gpu: 8, ram: 46, storage: 31 }
}

export async function getJarvisStatus() {
  return { state: 'ONLINE', message: 'All systems operational' }
}
