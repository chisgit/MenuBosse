import { useQuery } from "@tanstack/react-query";
import type { MenuItemAddon } from "@shared/schema";

export function useMenuItemAddons(menuItemId: number) {
  return useQuery<MenuItemAddon[]>({
    queryKey: [`/api/menu-items/${menuItemId}/addons`],
    enabled: !!menuItemId,
  });
}
