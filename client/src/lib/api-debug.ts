// Debug wrapper for fetch API requests
const BASE_URL = 'http://localhost:5000';

export async function debugFetch(input: RequestInfo, init?: RequestInit) {
    const url = typeof input === 'string' ? `${BASE_URL}${input}` : input;
    console.debug('[DEBUG] Fetching:', url, init);
    try {
        const response = await fetch(url, init);
        console.debug('[DEBUG] Response:', response.status, response.statusText);
        return response;
    } catch (error) {
        console.error('[DEBUG] Fetch error:', error);
        throw error;
    }
}
