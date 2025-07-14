// Debug wrapper for fetch API requests
export async function debugFetch(input: RequestInfo, init?: RequestInit) {
    console.debug('[DEBUG] Fetching:', input, init);
    try {
        const response = await fetch(input, init);
        console.debug('[DEBUG] Response:', response.status, response.statusText);
        return response;
    } catch (error) {
        console.error('[DEBUG] Fetch error:', error);
        throw error;
    }
}
