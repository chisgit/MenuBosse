import { useState } from "react";
import { Star, ThumbsUp, MapPin, Crown, Gem, TrendingUp, Heart, Utensils } from "lucide-react";
import { useRestaurants } from "@/hooks/use-restaurant";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function DiscoverySection() {
  const [activeFilter, setActiveFilter] = useState("all");
  const { data: restaurants, isLoading } = useRestaurants();
  const filters = [
    { key: "all", label: "All Restaurants", icon: Utensils },
    { key: "italian", label: "Italian", icon: Heart },
    { key: "japanese", label: "Asian", icon: Star },
    { key: "mexican", label: "Mexican", icon: TrendingUp },
    { key: "near", label: "Near Me", icon: MapPin },
    { key: "hidden", label: "Hidden Gems", icon: Gem },
  ];

  const filteredRestaurants = restaurants?.filter(restaurant => {
    if (activeFilter === "all") return true;
    if (activeFilter === "hidden") return restaurant.isHiddenGem;
    if (activeFilter === "near") return restaurant.distance && restaurant.distance < 1;
    return restaurant.cuisine.toLowerCase().includes(activeFilter);
  });
  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <Skeleton className="h-12 w-80 mb-4 rounded-xl" />
          <Skeleton className="h-6 w-96 rounded-lg" />
        </div>
        <div className="flex flex-wrap gap-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-32 rounded-full" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-80 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }
  return (
    <section className="fade-in space-y-8">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="luxury-icon-container p-3 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl">
            <Gem className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h2 className="luxury-heading text-4xl font-bold bg-gradient-to-r from-gray-900 via-primary to-accent bg-clip-text text-transparent">
              Discover Culinary Treasures
            </h2>
            <div className="h-1 w-36 bg-gradient-to-r from-primary to-accent rounded-full mt-2"></div>
          </div>
        </div>
        <p className="text-lg text-gray-600 leading-relaxed">
          Uncover the finest restaurants and dishes curated by our community of food connoisseurs
        </p>
      </div>

      {/* Luxury Filter Pills */}
      <div className="flex flex-wrap gap-4 mb-8">
        {filters.map((filter) => {
          const IconComponent = filter.icon;
          return (
            <Button
              key={filter.key}
              variant={activeFilter === filter.key ? "default" : "outline"}
              size="lg"
              onClick={() => setActiveFilter(filter.key)}
              className={`luxury-filter-pill rounded-full font-semibold transition-all duration-300 ${activeFilter === filter.key
                  ? "bg-gradient-to-r from-primary to-accent text-white shadow-luxury-glow border-0 hover:shadow-luxury-glow"
                  : "bg-white/80 hover:bg-white border-white/60 text-gray-700 hover:text-primary backdrop-blur-sm"
                }`}
            >
              <IconComponent className="h-4 w-4 mr-2" />
              {filter.label}
            </Button>
          );
        })}
      </div>

      {/* Premium Restaurant Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredRestaurants?.map((restaurant) => (
          <Card key={restaurant.id} className="luxury-restaurant-card group overflow-hidden cursor-pointer transform transition-all duration-500 hover:scale-105 hover:shadow-luxury-glow bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-sm border-0 rounded-2xl">
            <div className="aspect-[5/3] overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <img
                src={restaurant.imageUrl || '/placeholder-restaurant.jpg'}
                alt={restaurant.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              <div className="absolute top-4 right-4 z-20">
                <Badge
                  className={`luxury-restaurant-badge backdrop-blur-sm font-bold text-sm px-3 py-1 rounded-full border-0 ${restaurant.isHiddenGem
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg'
                      : restaurant.isTrending
                        ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg'
                        : restaurant.isLocalFavorite
                          ? 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white shadow-lg'
                          : 'bg-white/90 text-gray-800'
                    }`}
                >
                  {restaurant.isHiddenGem ? (
                    <>
                      <Crown className="h-3 w-3 mr-1" />
                      Hidden Gem
                    </>
                  ) : restaurant.isTrending ? (
                    <>
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Trending
                    </>
                  ) : restaurant.isLocalFavorite ? (
                    <>
                      <Heart className="h-3 w-3 mr-1" />
                      Local Favorite
                    </>
                  ) : (
                    'Restaurant'
                  )}
                </Badge>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors duration-300">{restaurant.name}</h3>
              </div>
              <p className="text-gray-600 text-base mb-4 leading-relaxed flex items-center">
                {restaurant.description}
                <span className="mx-2">•</span>
                <span className="flex items-center text-primary font-medium">
                  <MapPin className="h-4 w-4 mr-1" />
                  {restaurant.distance?.toFixed(1)} mi
                </span>
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="luxury-rating-container flex items-center bg-gray-50 rounded-full px-3 py-2">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-base font-bold text-gray-800 ml-1">
                      {restaurant.rating?.toFixed(1)}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">
                      ({Math.floor(Math.random() * 500) + 50})
                    </span>
                  </div>
                  <div className="luxury-vote-container flex items-center bg-green-50 rounded-full px-3 py-2">
                    <ThumbsUp className="h-4 w-4 text-green-500" />
                    <span className="text-base font-bold text-gray-800 ml-1">
                      {restaurant.votePercentage}%
                    </span>
                  </div>
                </div>
                <span className="luxury-price-range text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{restaurant.priceRange}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRestaurants?.length === 0 && (
        <div className="text-center py-16 luxury-empty-state">
          <div className="glass-card p-8 rounded-2xl bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-xl border border-white/20 max-w-md mx-auto">
            <Gem className="h-16 w-16 text-primary/60 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No culinary gems found</h3>
            <p className="text-gray-600 leading-relaxed">Try adjusting your filters to discover amazing restaurants in your area.</p>
          </div>
        </div>
      )}
    </section>
  );
}
