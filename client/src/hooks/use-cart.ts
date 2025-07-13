import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { getCurrentSession, isSessionActive, clearClosedSession } from "@/lib/session";
import type { CartItem, MenuItem, CartItemAddon, MenuItemAddon } from "@shared/schema";

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
  return useQuery<(CartItem & { menuItem: MenuItem; addons: (CartItemAddon & { addon: MenuItemAddon })[] })[]>({
    queryKey: [`/api/cart/${sessionId}`],
    enabled: !!sessionId,
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ menuItemId, quantity = 1, specialInstructions, addons }: {
      menuItemId: number;
      quantity?: number;
      specialInstructions?: string;
      addons?: number[];
    }) => {
      const sessionId = getSessionId();
      const response = await apiRequest("POST", "/api/cart", {
        sessionId,
        menuItemId,
        quantity,
        specialInstructions,
        addons,
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

// New hooks for order management and payment-based session lifecycle
export function usePlaceOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const sessionId = getSessionId();
      if (!sessionId) {
        throw new Error("No active session");
      }
      const response = await apiRequest("POST", "/api/orders", {
        sessionId,
      });
      return response.json();
    },
    onSuccess: () => {
      const sessionId = getSessionId();
      queryClient.invalidateQueries({ queryKey: [`/api/cart/${sessionId}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/orders/${sessionId}`] });
    },
  });
}

export function useCompletePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ paymentMethod }: {
      paymentMethod: 'app' | 'cash' | 'card';
    }) => {
      const sessionId = getSessionId();
      if (!sessionId) {
        throw new Error("No active session");
      }
      const response = await apiRequest("POST", `/api/sessions/${sessionId}/close`, {
        paymentMethod,
      });

      // Clear session from localStorage
      clearClosedSession();

      return response.json();
    },
    onSuccess: () => {
      // Invalidate all queries since session is ended
      queryClient.clear();
    },
  });
}

export function useSessionStatus() {
  const session = getCurrentSession();
  return {
    session,
    isActive: session ? isSessionActive(session) : false,
    isPaid: session?.status === 'paid',
    isClosed: session?.status === 'closed',
  };
}
