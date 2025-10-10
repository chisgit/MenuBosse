export interface TableSession {
  sessionId: string;
  restaurantId: number;
  tableNumber: string;
  status: 'active' | 'ordered' | 'paid' | 'closed';
  timestamp: number;
}

// Simple hash function for browser compatibility
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16);
}

// Generate a secure session token
export function generateSessionToken(restaurantId: number, tableNumber: string): string {
  const timestamp = Date.now();
  const salt = "menubosse-secure-salt"; // In production, this should be from env
  const data = `${restaurantId}-${tableNumber}-${salt}-${timestamp}`;
  const hash = simpleHash(data).substring(0, 16);
  return `session-${hash}`;
}

// Extract session info from URL parameters
export function getSessionFromUrl(): TableSession | null {
  if (typeof window === 'undefined') return null;
  
  const urlParams = new URLSearchParams(window.location.search);
  const sessionId = urlParams.get('session');
  const tableNumber = urlParams.get('table');
  const restaurantIdParam = urlParams.get('restaurant') || getRestaurantIdFromPath();

  if (!sessionId || !tableNumber || !restaurantIdParam) {
    return null;
  }

  return {
    sessionId,
    restaurantId: parseInt(restaurantIdParam),
    tableNumber,
    status: 'active' as const,
    timestamp: Date.now()
  };
}

// Get restaurant ID from current path
function getRestaurantIdFromPath(): string | null {
  if (typeof window === 'undefined') return '1';
  const path = window.location.pathname;
  const match = path.match(/\/restaurant\/(\d+)/);
  return match ? match[1] : '1'; // Default to restaurant 1
}

// Store session in localStorage for persistence
export function storeSession(session: TableSession): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('table-session', JSON.stringify(session));
}

// Retrieve session from localStorage
export function getStoredSession(): TableSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem('table-session');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

// Get current session (URL params take priority over localStorage)
export function getCurrentSession(): TableSession | null {
  const urlSession = getSessionFromUrl();
  if (urlSession) {
    storeSession(urlSession);
    return urlSession;
  }

  return getStoredSession();
}

// Check if session is valid (not expired)
export function isSessionValid(session: TableSession): boolean {
  const now = Date.now();
  const sessionAge = now - session.timestamp;
  const maxAge = 24 * 60 * 60 * 1000; // 24 hours

  return sessionAge < maxAge;
}

// Check if session is active for cart operations
export function isSessionActive(session: TableSession): boolean {
  return session.status === 'active' || session.status === 'ordered';
}

// Close session after payment
export function closeSession(sessionId: string, paymentMethod: 'app' | 'cash' | 'card'): void {
  const session = getStoredSession();
  if (session && session.sessionId === sessionId) {
    const closedSession = {
      ...session,
      status: 'paid' as const,
      timestamp: Date.now()
    };
    storeSession(closedSession);
  }
}

// Clear closed session from localStorage
export function clearClosedSession(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('table-session');
}

// Generate QR code URL with session parameters
export function generateQRCodeUrl(restaurantId: number, tableNumber: string): string {
  const sessionToken = generateSessionToken(restaurantId, tableNumber);
  const baseUrl = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' ? window.location.origin : '');
  return `${baseUrl}/restaurant/${restaurantId}?table=${tableNumber}&session=${sessionToken}`;
}
