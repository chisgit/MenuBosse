import { useState } from "react";
import { Search, Star, ThumbsUp, ThumbsDown, Sparkles, Heart, Clock } from "lucide-react";
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
    { key: "all", label: "All", icon: Sparkles },
    { key: "appetizers", label: "Appetizers", icon: Heart },
    { key: "mains", label: "Mains", icon: Star },
    { key: "desserts", label: "Desserts", icon: Clock },
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
      <div className="luxury-search-container glass-card p-6 rounded-2xl border border-white/20 backdrop-blur-xl bg-gradient-to-r from-white/10 to-white/5 shadow-luxury">
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary/60 h-5 w-5 transition-colors group-hover:text-primary" />
            <Input
              type="text"
              placeholder="Search culinary delights..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-14 text-lg bg-white/20 border-white/30 rounded-xl hover:bg-white/30 focus:bg-white/40 transition-all duration-300 placeholder:text-gray-500/70 text-gray-800 font-medium"
            />
          </div>
          <div className="flex gap-3">
            {filters.map((filter) => {
              const IconComponent = filter.icon;
              return (
                <Button
                  key={filter.key}
                  variant={activeFilter === filter.key ? "default" : "outline"}
                  onClick={() => setActiveFilter(filter.key)}
                  className={`luxury-filter-btn h-14 px-6 rounded-xl font-medium transition-all duration-300 ${activeFilter === filter.key
                      ? "bg-gradient-to-r from-primary to-accent text-white shadow-luxury-glow border-0"
                      : "bg-white/20 hover:bg-white/30 border-white/30 text-gray-700 hover:text-primary"
                    }`}
                >
                  <IconComponent className="h-4 w-4 mr-2" />
                  {filter.label}
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Menu Categories */}
      <div className="space-y-12">
        {Object.entries(groupedItems).map(([categoryName, items]) => (
          <div key={categoryName} className="menu-category">
            <div className="mb-8">
              <h2 className="luxury-heading text-4xl font-bold bg-gradient-to-r from-gray-900 via-primary to-accent bg-clip-text text-transparent mb-3">
                {categoryName}
              </h2>
              <div className="h-1 w-24 bg-gradient-to-r from-primary to-accent rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {items.map((item) => (
                <Card
                  key={item.id}
                  className="luxury-food-card group overflow-hidden cursor-pointer transform transition-all duration-500 hover:scale-105 hover:shadow-luxury-glow bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-sm border-0 rounded-2xl"
                  onClick={() => onItemClick(item.id)}
                >
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <img
                      src={item.imageUrl || '/placeholder-food.jpg'}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute top-4 right-4 z-20">
                      <div className="luxury-rating-badge bg-black/20 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-white font-medium text-sm">
                          {item.rating?.toFixed(1) || '0.0'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-gray-900 line-clamp-1 group-hover:text-primary transition-colors duration-300">
                        {item.name}
                      </h3>
                      <span className="luxury-price text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent whitespace-nowrap">
                        ${item.price.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="luxury-vote-container flex items-center bg-gray-50 rounded-full px-3 py-1">
                          <button
                            className="vote-animation p-1 text-gray-400 hover:text-green-500 transition-colors duration-300"
                            onClick={(e) => handleVote(item.id, 'up', e)}
                            disabled={voteMenuItem.isPending}
                          >
                            <ThumbsUp className="h-4 w-4" />
                          </button>
                          <span className="text-sm font-bold text-gray-700 mx-2">
                            {item.votes}
                          </span>
                          <button
                            className="vote-animation p-1 text-gray-400 hover:text-red-500 transition-colors duration-300"
                            onClick={(e) => handleVote(item.id, 'down', e)}
                            disabled={voteMenuItem.isPending}
                          >
                            <ThumbsDown className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={(e) => handleAddToCart(item, e)}
                        disabled={addToCart.isPending}
                        className="luxury-add-btn bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold px-6 py-2 rounded-full transition-all duration-300 hover:shadow-luxury-glow border-0"
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
        <div className="text-center py-16 luxury-empty-state">
          <div className="glass-card p-8 rounded-2xl bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-xl border border-white/20 max-w-md mx-auto">
            <Sparkles className="h-16 w-16 text-primary/60 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No culinary treasures found</h3>
            <p className="text-gray-600 leading-relaxed">Try adjusting your search or explore different categories to discover amazing dishes.</p>
          </div>
        </div>
      )}
    </section>
  );
}
