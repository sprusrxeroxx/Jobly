// Helper function to add timeout to fetch calls :: FIX SOCKET HANGING ISSUE
export default async function fetchWithTimeout(url, options = {}, timeoutMs = process.env.FUNCTIONS_EMULATOR_TIMEOUT_SECONDS) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (err) {
    clearTimeout(id);
    // normalize AbortError message
    if (err.name === 'AbortError') {
      throw new Error(`Request timed out after ${timeoutMs}ms`);
    }
    throw err;
  }
}