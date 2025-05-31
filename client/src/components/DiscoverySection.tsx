import { useState } from "react";
import { Star, ThumbsUp } from "lucide-react";
import { useRestaurants } from "@/hooks/use-restaurant";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function DiscoverySection() {
  const [activeFilter, setActiveFilter] = useState("all");
  const { data: restaurants, isLoading } = useRestaurants();

  const filters = [
    { key: "all", label: "All" },
    { key: "italian", label: "Italian" },
    { key: "japanese", label: "Asian" },
    { key: "mexican", label: "Mexican" },
    { key: "near", label: "Near Me" },
    { key: "hidden", label: "Hidden Gems" },
  ];

  const filteredRestaurants = restaurants?.filter(restaurant => {
    if (activeFilter === "all") return true;
    if (activeFilter === "hidden") return restaurant.isHiddenGem;
    if (activeFilter === "near") return restaurant.distance && restaurant.distance < 1;
    return restaurant.cuisine.toLowerCase().includes(activeFilter);
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="flex flex-wrap gap-2">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-8 w-20" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="fade-in space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Discover Hidden Gems</h2>
        <p className="text-gray-600">Find the best restaurants and dishes rated by our community</p>
      </div>

      {/* Filter Pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filters.map((filter) => (
          <Button
            key={filter.key}
            variant={activeFilter === filter.key ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFilter(filter.key)}
            className="rounded-full"
          >
            {filter.label}
          </Button>
        ))}
      </div>

      {/* Restaurant Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRestaurants?.map((restaurant) => (
          <Card key={restaurant.id} className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
            <div className="aspect-[5/3] overflow-hidden">
              <img 
                src={restaurant.imageUrl || '/placeholder-restaurant.jpg'} 
                alt={restaurant.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{restaurant.name}</h3>
                <Badge 
                  variant="secondary" 
                  className={`text-xs font-medium ${
                    restaurant.isHiddenGem 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : restaurant.isTrending 
                        ? 'bg-green-100 text-green-800'
                        : restaurant.isLocalFavorite
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {restaurant.isHiddenGem 
                    ? 'Hidden Gem' 
                    : restaurant.isTrending 
                      ? 'Trending'
                      : restaurant.isLocalFavorite
                        ? 'Local Favorite'
                        : 'Restaurant'
                  }
                </Badge>
              </div>
              <p className="text-gray-600 text-sm mb-3">
                {restaurant.description} • {restaurant.distance?.toFixed(1)} miles away
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-gray-600 ml-1">
                      {restaurant.rating?.toFixed(1)}
                    </span>
                    <span className="text-sm text-gray-400 ml-1">
                      ({Math.floor(Math.random() * 500) + 50})
                    </span>
                  </div>
                  <div className="flex items-center">
                    <ThumbsUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-600 ml-1">
                      {restaurant.votePercentage}%
                    </span>
                  </div>
                </div>
                <span className="text-sm text-gray-500">{restaurant.priceRange}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRestaurants?.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No restaurants found</h3>
          <p className="text-gray-600">Try adjusting your filter criteria.</p>
        </div>
      )}
    </section>
  );
}
