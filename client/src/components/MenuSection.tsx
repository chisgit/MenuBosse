import { useState } from "react";
import { Search, Star, ThumbsUp, ThumbsDown } from "lucide-react";
import { useMenuItems, useMenuCategories, useVoteMenuItem } from "@/hooks/use-menu";
import { useAddToCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import type { MenuItem } from "@shared/schema";

interface MenuSectionProps {
  restaurantId: number;
  onItemClick: (itemId: number) => void;
}

export default function MenuSection({ restaurantId, onItemClick }: MenuSectionProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  
  const { data: menuItems, isLoading: itemsLoading } = useMenuItems(restaurantId);
  const { data: categories, isLoading: categoriesLoading } = useMenuCategories(restaurantId);
  const addToCart = useAddToCart();
  const voteMenuItem = useVoteMenuItem();
  const { toast } = useToast();

  const filters = [
    { key: "all", label: "All" },
    { key: "appetizers", label: "Appetizers" },
    { key: "mains", label: "Mains" },
    { key: "desserts", label: "Desserts" },
  ];

  const filteredItems = menuItems?.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeFilter === "all") return matchesSearch;
    
    const category = categories?.find(cat => cat.id === item.categoryId);
    const matchesFilter = category?.name.toLowerCase().includes(activeFilter);
    
    return matchesSearch && matchesFilter;
  });

  const handleAddToCart = async (item: MenuItem, e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      await addToCart.mutateAsync({ menuItemId: item.id });
      toast({
        title: "Added to cart",
        description: `${item.name} has been added to your cart.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleVote = async (itemId: number, type: 'up' | 'down', e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      await voteMenuItem.mutateAsync({ id: itemId, type });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit vote. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (itemsLoading || categoriesLoading) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <Skeleton className="flex-1 h-12" />
          <div className="flex gap-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-20" />
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-80 w-full" />
          ))}
        </div>
      </div>
    );
  }

  const groupedItems = categories?.reduce((acc, category) => {
    const categoryItems = filteredItems?.filter(item => item.categoryId === category.id) || [];
    if (categoryItems.length > 0) {
      acc[category.name] = categoryItems;
    }
    return acc;
  }, {} as Record<string, MenuItem[]>) || {};

  return (
    <section className="fade-in space-y-8">
      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search menu items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          {filters.map((filter) => (
            <Button
              key={filter.key}
              variant={activeFilter === filter.key ? "default" : "outline"}
              onClick={() => setActiveFilter(filter.key)}
              className="whitespace-nowrap"
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Menu Categories */}
      <div className="space-y-8">
        {Object.entries(groupedItems).map(([categoryName, items]) => (
          <div key={categoryName} className="menu-category">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{categoryName}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <Card 
                  key={item.id}
                  className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                  onClick={() => onItemClick(item.id)}
                >
                  <div className="aspect-[3/2] overflow-hidden">
                    <img 
                      src={item.imageUrl || '/placeholder-food.jpg'} 
                      alt={item.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                        {item.name}
                      </h3>
                      <span className="text-lg font-bold text-primary whitespace-nowrap">
                        ${item.price.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          <button 
                            className="vote-animation p-1 text-gray-400 hover:text-green-500 transition-colors"
                            onClick={(e) => handleVote(item.id, 'up', e)}
                            disabled={voteMenuItem.isPending}
                          >
                            <ThumbsUp className="h-4 w-4" />
                          </button>
                          <span className="text-sm font-medium text-gray-600 mx-1">
                            {item.votes}
                          </span>
                          <button 
                            className="vote-animation p-1 text-gray-400 hover:text-red-500 transition-colors"
                            onClick={(e) => handleVote(item.id, 'down', e)}
                            disabled={voteMenuItem.isPending}
                          >
                            <ThumbsDown className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600 ml-1">
                            {item.rating?.toFixed(1) || '0.0'}
                          </span>
                        </div>
                      </div>
                      <Button 
                        size="sm"
                        onClick={(e) => handleAddToCart(item, e)}
                        disabled={addToCart.isPending}
                        className="text-sm font-medium"
                      >
                        {addToCart.isPending ? 'Adding...' : 'Add to Cart'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {filteredItems?.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No items found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </section>
  );
}
