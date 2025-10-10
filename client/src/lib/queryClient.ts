import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const url = queryKey[0] as string;
    // DEBUG: Show which endpoint is called in production
    if (typeof window !== "undefined") {
      console.debug("[DEBUG] Fetching:", url.startsWith("http") ? url : url);
    }
    
    try {
      const res = await fetch(
        url.startsWith("http") ? url : url,
        {
          credentials: "include",
        },
      );

      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        return null;
      }

      // For Netlify: gracefully handle failed function calls
      if (!res.ok) {
        console.warn(`[DEBUG] Fetch failed for ${url}: ${res.status} ${res.statusText}`);
        return null;
      }
      
      return await res.json();
    } catch (error) {
      console.error(`[DEBUG] Network error fetching ${url}:`, error);
      return null;
    }
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
