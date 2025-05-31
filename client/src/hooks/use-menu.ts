import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { MenuItem, MenuCategory } from "@shared/schema";

export function useMenuItems(restaurantId: number) {
  return useQuery<MenuItem[]>({
    queryKey: ["/api/restaurants", restaurantId, "menu"],
  });
}

export function useMenuCategories(restaurantId: number) {
  return useQuery<MenuCategory[]>({
    queryKey: ["/api/restaurants", restaurantId, "categories"],
  });
}

export function useMenuItem(id: number) {
  return useQuery<MenuItem>({
    queryKey: ["/api/menu-items", id],
  });
}

export function useVoteMenuItem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, type }: { id: number; type: 'up' | 'down' }) => {
      const response = await apiRequest("POST", `/api/menu-items/${id}/vote`, { type });
      return response.json();
    },
    onSuccess: (updatedItem: MenuItem) => {
      // Update the specific menu item in cache
      queryClient.setQueryData(["/api/menu-items", updatedItem.id], updatedItem);
      
      // Update the menu items list cache
      queryClient.setQueryData(
        ["/api/restaurants", updatedItem.restaurantId, "menu"],
        (oldData: MenuItem[] | undefined) => {
          if (!oldData) return oldData;
          return oldData.map(item => item.id === updatedItem.id ? updatedItem : item);
        }
      );
    },
  });
}
