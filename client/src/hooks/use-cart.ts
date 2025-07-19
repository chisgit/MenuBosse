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
    fallbackSessionId = "default-session";
    localStorage.setItem('fallback-session-id', fallbackSessionId);
  }

  return fallbackSessionId;
}

export function useCart(menuItems: any[], menuAddons: Record<number, any[]> = {}) {
  const sessionId = getSessionId();
  console.log("useCart sessionId:", sessionId);
  return useQuery({
    queryKey: ["localCart", sessionId],
    queryFn: () => {
      const cartRaw = localStorage.getItem(`cart-${sessionId}`);
      let cart: any[] = [];
      try {
        cart = cartRaw ? JSON.parse(cartRaw) : [];
      } catch (e) {
        cart = [];
      }
      // Attach menuItem and real addon objects to each cart item
      const mappedCart = cart.map((item: any) => {
        const menuItem = menuItems?.find((mi: any) => mi.id === item.menuItemId);
        const availableAddons = menuAddons[item.menuItemId] || [];
        // item.addons is array of {addonId, quantity} or just addonId
        const mappedAddons = (item.addons || []).map((addonObj: any) => {
          const addonId = typeof addonObj === 'object' ? addonObj.addonId : addonObj;
          const quantity = typeof addonObj === 'object' ? addonObj.quantity ?? 1 : 1;
          const addon = availableAddons.find((a: any) => a.id === addonId) || {};
          return { addon, quantity };
        });
        return {
          ...item,
          menuItem: menuItem || undefined,
          addons: mappedAddons,
        };
      });
      console.log("[DEBUG] Loaded cart from localStorage with menuItem and addons:", mappedCart);
      return mappedCart;
    },
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
      const cartRaw = localStorage.getItem(`cart-${sessionId}`);
      let cart: any[] = [];
      try {
        cart = cartRaw ? JSON.parse(cartRaw) : [];
      } catch (e) {
        cart = [];
      }
      const newItem = {
        id: Date.now(),
        menuItemId,
        quantity,
        specialInstructions: specialInstructions || null,
        addons: addons || [],
        status: "cart",
        addedAt: new Date().toISOString(),
      };
      cart.push(newItem);
      localStorage.setItem(`cart-${sessionId}`, JSON.stringify(cart));
      console.log("[DEBUG] Added item to localStorage cart:", newItem);
      return newItem;
    },
    onSuccess: () => {
      const sessionId = getSessionId();
      queryClient.invalidateQueries({ queryKey: ["localCart", sessionId] });
    },
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, quantity, specialInstructions, addons }: {
      id: number;
      quantity: number;
      specialInstructions?: string;
      addons?: number[];
    }) => {
      const sessionId = getSessionId();
      const cartRaw = localStorage.getItem(`cart-${sessionId}`);
      let cart: any[] = [];
      try {
        cart = cartRaw ? JSON.parse(cartRaw) : [];
      } catch (e) {
        cart = [];
      }
      const idx = cart.findIndex(item => item.id === id);
      if (idx !== -1) {
        cart[idx].quantity = quantity;
        cart[idx].specialInstructions = specialInstructions || null;
        cart[idx].addons = addons || cart[idx].addons;
        localStorage.setItem(`cart-${sessionId}`, JSON.stringify(cart));
        console.log("[DEBUG] Updated cart item in localStorage:", cart[idx]);
        return cart[idx];
      }
      return null;
    },
    onSuccess: () => {
      const sessionId = getSessionId();
      queryClient.invalidateQueries({ queryKey: ["localCart", sessionId] });
    },
  });
}

export function useRemoveFromCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const sessionId = getSessionId();
      const cartRaw = localStorage.getItem(`cart-${sessionId}`);
      let cart: any[] = [];
      try {
        cart = cartRaw ? JSON.parse(cartRaw) : [];
      } catch (e) {
        cart = [];
      }
      const newCart = cart.filter(item => item.id !== id);
      localStorage.setItem(`cart-${sessionId}`, JSON.stringify(newCart));
      console.log("[DEBUG] Removed cart item from localStorage:", id);
      return true;
    },
    onSuccess: () => {
      const sessionId = getSessionId();
      queryClient.invalidateQueries({ queryKey: ["localCart", sessionId] });
    },
  });
}

export function useClearCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const sessionId = getSessionId();
      localStorage.setItem(`cart-${sessionId}`, JSON.stringify([]));
      console.log("[DEBUG] Cleared cart in localStorage for session:", sessionId);
      return true;
    },
    onSuccess: () => {
      const sessionId = getSessionId();
      queryClient.invalidateQueries({ queryKey: ["localCart", sessionId] });
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
      queryClient.invalidateQueries({ queryKey: [`/api/cart/${sessionId}.json`] });
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
