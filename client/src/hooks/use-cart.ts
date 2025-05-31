import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { CartItem, MenuItem } from "@shared/schema";

const SESSION_ID = "user-session-" + Math.random().toString(36).substr(2, 9);

export function useCart() {
  return useQuery<(CartItem & { menuItem: MenuItem })[]>({
    queryKey: [`/api/cart/${SESSION_ID}`],
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
      const response = await apiRequest("POST", "/api/cart", {
        sessionId: SESSION_ID,
        menuItemId,
        quantity,
        specialInstructions,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart", SESSION_ID] });
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
      queryClient.invalidateQueries({ queryKey: ["/api/cart", SESSION_ID] });
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
      queryClient.invalidateQueries({ queryKey: ["/api/cart", SESSION_ID] });
    },
  });
}

export function useClearCart() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/cart/session/${SESSION_ID}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart", SESSION_ID] });
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
