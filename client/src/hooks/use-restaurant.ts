import { useQuery } from "@tanstack/react-query";
import type { Restaurant, Deal } from "@shared/schema";

export function useRestaurants() {
  return useQuery<Restaurant[]>({
    queryKey: ["/api/restaurants"],
  });
}

export function useRestaurant(id: number) {
  return useQuery<Restaurant>({
    queryKey: ["/api/restaurants", id],
  });
}

export function useDeals() {
  return useQuery<Deal[]>({
    queryKey: ["/api/deals"],
  });
}

export function useRestaurantDeals(restaurantId: number) {
  return useQuery<Deal[]>({
    queryKey: ["/api/restaurants", restaurantId, "deals"],
  });
}
