import { useQueries } from "@tanstack/react-query";

async function fetchMenuItemAddons(itemId: number) {
    const res = await fetch(`/api/menu-items/${itemId}/addons`);
    if (!res.ok) throw new Error("Failed to fetch addons");
    return await res.json();
}

export function useAllMenuItemAddons(menuItems: any[]) {
    const queries = useQueries({
        queries: menuItems.map(item => ({
            queryKey: [`/api/menu-items/${item.id}/addons`],
            enabled: !!item.id,
            queryFn: () => fetchMenuItemAddons(item.id),
        }))
    });

    const isLoading = queries.some(query => query.isLoading);

    const data: Record<number, any[]> = {};
    menuItems.forEach((item, idx) => {
        data[item.id] = queries[idx].data || [];
    });

    return { data, isLoading };
}
