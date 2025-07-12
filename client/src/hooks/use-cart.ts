import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { getCurrentSession, isSessionActive, clearClosedSession } from "@/lib/session";
import type { CartItem, MenuItem } from "@shared/schema";

function getSessionId(): string | null {
  const session = getCurrentSession();
  
  if (session && isSessionActive(session)) {
    return session.sessionId;
  }
  
  if (session && (session.status === 'paid' || session.status === 'closed')) {
    // Session has ended - don't create random session
    return null;
  }
  
  // Fallback to a consistent session for development/testing
  // Check if we have a stored fallback session
  let fallbackSessionId = localStorage.getItem('fallback-session-id');
  if (!fallbackSessionId) {
    fallbackSessionId = "default-session-" + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('fallback-session-id', fallbackSessionId);
  }
  
  return fallbackSessionId;
}

export function useCart() {
  const sessionId = getSessionId();
  return useQuery<(CartItem & { menuItem: MenuItem })[]>({
    queryKey: [`/api/cart/${sessionId}`],
    enabled: !!sessionId,
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ menuItemId, quantity = 1, specialInstructions }: {
      menuItemId: number;
      quantity?: number;
      specialInstructions?: string;
    }) => {
      const sessionId = getSessionId();
      const response = await apiRequest("POST", "/api/cart", {
        sessionId,
        menuItemId,
        quantity,
        specialInstructions,
      });
      return response.json();
    },
    onSuccess: () => {
      const sessionId = getSessionId();
      queryClient.invalidateQueries({ queryKey: [`/api/cart/${sessionId}`] });
    },
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, quantity, specialInstructions }: {
      id: number;
      quantity: number;
      specialInstructions?: string;
    }) => {
      const response = await apiRequest("PUT", `/api/cart/${id}`, {
        quantity,
        specialInstructions,
      });
      return response.json();
    },
    onSuccess: () => {
      const sessionId = getSessionId();
      queryClient.invalidateQueries({ queryKey: [`/api/cart/${sessionId}`] });
    },
  });
}

export function useRemoveFromCart() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/cart/${id}`);
    },
    onSuccess: () => {
      const sessionId = getSessionId();
      queryClient.invalidateQueries({ queryKey: [`/api/cart/${sessionId}`] });
    },
  });
}

export function useClearCart() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const sessionId = getSessionId();
      await apiRequest("DELETE", `/api/cart/session/${sessionId}`);
    },
    onSuccess: () => {
      const sessionId = getSessionId();
      queryClient.invalidateQueries({ queryKey: [`/api/cart/${sessionId}`] });
    },
  });
}

export function useServerCall() {
  return useMutation({
    mutationFn: async ({ restaurantId, tableNumber }: {
      restaurantId: number;
      tableNumber: string;
    }) => {
      const response = await apiRequest("POST", "/api/server-calls", {
        restaurantId,
        tableNumber,
        status: "pending",
      });
      return response.json();
    },
  });
}
