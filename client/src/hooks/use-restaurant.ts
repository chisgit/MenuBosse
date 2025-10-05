import { useQuery } from "@tanstack/react-query";
import type { Restaurant, Deal } from "@shared/schema";

export function useRestaurants() {
  console.debug("[DEBUG] useRestaurants: fetching /api/restaurants");
  return useQuery<Restaurant[]>({
    queryKey: ["/api/restaurants"],
  });
}

export function useRestaurant(id: number) {
  console.debug(`[DEBUG] useRestaurant: fetching /api/restaurants/${id}`);
  return useQuery<Restaurant>({
    queryKey: [`/api/restaurants/${id}`],
  });
}

export function useDeals() {
  return useQuery<Deal[]>({
    queryKey: ["/api/deals"],
  });
}

export function useRestaurantDeals(restaurantId: number) {
  return useQuery<Deal[]>({
    queryKey: [`/api/restaurants/${restaurantId}/deals`],
  });
}
