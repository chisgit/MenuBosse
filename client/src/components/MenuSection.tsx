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
  restaurantName?: string;
  tableNumber?: string;
}

export default function MenuSection({ restaurantId, onItemClick, restaurantName, tableNumber }: MenuSectionProps) {
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
  return (<section className="fade-in space-y-8">    {/* Header with restaurant name and table */}
    <div className="text-center mb-12">
      <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent mb-2 tracking-wide drop-shadow-lg">
        {restaurantName || 'RESTAURANT MENU'}
      </h1>
      <div className="flex items-center justify-center text-lg text-gray-400 font-medium">
        <span className="bg-black/40 backdrop-blur-sm rounded-full px-4 py-2 border border-orange-500/20">
          {tableNumber || 'Table Service'}
        </span>
      </div>
      <div className="decorative-leaf" style={{ top: '-10px', right: '20%' }}></div>
      <div className="decorative-leaf" style={{ top: '10px', left: '15%' }}></div>
    </div>

    {/* Search and Filter Bar */}
    <div className="luxury-search-container glass-card p-6 rounded-2xl border border-white/10 backdrop-blur-xl bg-gradient-to-r from-black/20 to-black/10 shadow-luxury">
      <div className="flex flex-col sm:flex-row gap-6">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-400/60 h-5 w-5 transition-colors group-hover:text-orange-400" />
          <Input
            type="text"
            placeholder="Search culinary delights..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-14 text-lg bg-black/30 border-white/20 rounded-xl hover:bg-black/40 focus:bg-black/40 transition-all duration-300 placeholder:text-gray-400 text-white font-medium"
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
                  ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-luxury-glow border-0"
                  : "bg-black/20 hover:bg-black/30 border-white/20 text-gray-300 hover:text-orange-400"
                  }`}
              >
                <IconComponent className="h-4 w-4 mr-2" />
                {filter.label}
              </Button>
            );
          })}
        </div>
      </div>
    </div>      {/* Menu Categories */}
    <div className="space-y-12">
      {Object.entries(groupedItems).map(([categoryName, items]) => (
        <div key={categoryName} className="menu-category food-menu-section">
          <div className="mb-8">
            <h2 className="luxury-heading text-4xl font-bold bg-gradient-to-r from-white via-orange-400 to-orange-500 bg-clip-text text-transparent mb-3">
              {categoryName}
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item) => (<Card
              key={item.id}
              className="menu-item-card group overflow-hidden cursor-pointer transform transition-all duration-500 hover:scale-105"
              onClick={() => onItemClick(item.id)}
            >
              <div className="relative">
                {/* Food Image - Larger, more prominent background */}
                <div className="relative h-64 w-full overflow-hidden">
                  <img
                    src={item.imageUrl || '/placeholder-food.jpg'}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Dark overlay for better text contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                  {/* Price Badge - Prominent circular positioning */}
                  <div className="absolute top-4 right-4">
                    <div className="price-badge text-lg font-bold">
                      ${item.price.toFixed(0)}
                    </div>
                  </div>

                  {/* Voting controls - Better positioned and visible */}
                  <div className="absolute bottom-4 left-4 luxury-vote-container flex items-center bg-black/60 backdrop-blur-md rounded-full px-4 py-2 border border-white/20 shadow-lg">
                    <button
                      className="vote-animation p-1 text-gray-300 hover:text-green-400 transition-colors duration-300"
                      onClick={(e) => handleVote(item.id, 'up', e)}
                      disabled={voteMenuItem.isPending}
                    >
                      <ThumbsUp className="h-4 w-4" />
                    </button>
                    <span className="text-sm font-bold text-white mx-3 drop-shadow">
                      {item.votes}
                    </span>
                    <button
                      className="vote-animation p-1 text-gray-300 hover:text-red-400 transition-colors duration-300"
                      onClick={(e) => handleVote(item.id, 'down', e)}
                      disabled={voteMenuItem.isPending}
                    >
                      <ThumbsDown className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Rating badge - Better positioned */}
                  {item.rating && (
                    <div className="absolute bottom-4 right-4 luxury-rating-badge bg-black/60 backdrop-blur-md rounded-full px-3 py-2 flex items-center space-x-1 border border-yellow-400/30 shadow-lg">
                      <Star className="h-4 w-4 text-yellow-400 fill-current drop-shadow-sm" />
                      <span className="text-white font-medium text-sm drop-shadow-sm">
                        {item.rating.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Item Details - Clean text area */}
                <div className="p-6 bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-sm">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors duration-300 drop-shadow-sm">
                    {item.name}
                  </h3>
                  <p className="text-gray-300 text-sm mb-4 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                  <div className="flex justify-center">
                    <Button
                      size="sm"
                      onClick={(e) => handleAddToCart(item, e)}
                      disabled={addToCart.isPending}
                      className="luxury-add-btn bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold px-6 py-2 rounded-full transition-all duration-300 border-0 shadow-lg hover:shadow-orange-500/25"
                    >
                      {addToCart.isPending ? 'Adding...' : 'Add to Cart'}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
            ))}
          </div>
        </div>
      ))}
    </div>      {filteredItems?.length === 0 && (
      <div className="text-center py-16 luxury-empty-state">
        <div className="glass-card p-8 rounded-2xl bg-gradient-to-br from-black/20 to-black/10 backdrop-blur-xl border border-white/10 max-w-md mx-auto">
          <Sparkles className="h-16 w-16 text-orange-400/60 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-3">No culinary treasures found</h3>
          <p className="text-gray-400 leading-relaxed">Try adjusting your search or explore different categories to discover amazing dishes.</p>
        </div>
      </div>
    )}
  </section>
  );
}
