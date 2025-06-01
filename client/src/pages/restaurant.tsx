import { useState } from "react";
import { useRestaurant } from "@/hooks/use-restaurant";
import { useCart } from "@/hooks/use-cart";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingCart, MicOff } from "lucide-react";
import MenuSection from "@/components/MenuSection";
import DiscoverySection from "@/components/DiscoverySection";
import DealsSection from "@/components/DealsSection";
import ItemDetailModal from "@/components/ItemDetailModal";
import FloatingButtons from "@/components/FloatingButtons";
import ServerCallToast from "@/components/ServerCallToast";

interface RestaurantPageProps {
  restaurantId: number;
}

export default function RestaurantPage({ restaurantId }: RestaurantPageProps) {
  const [activeTab, setActiveTab] = useState<'menu' | 'discovery' | 'deals' | 'reviews'>('menu');
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [showServerToast, setShowServerToast] = useState(false);

  const { data: restaurant, isLoading: restaurantLoading } = useRestaurant(restaurantId);
  const { data: cartItems } = useCart();

  const cartItemCount = cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  if (restaurantLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-4 w-96 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Restaurant Not Found</h1>
          <p className="text-gray-600">The restaurant you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { key: 'menu' as const, label: 'Menu' },
    { key: 'discovery' as const, label: 'Discover' },
    { key: 'deals' as const, label: 'Deals' },
    { key: 'reviews' as const, label: 'Reviews' },
  ];
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="relative bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20 sticky top-0 z-50">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-6">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                MenuBosse
              </h1>
              <div className="text-sm text-gray-700 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30">
                <span className="font-semibold text-gray-900">{restaurant.name}</span>
                <span className="mx-2 text-primary">•</span>
                <span className="text-gray-600">Table 12</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-3 text-gray-500 hover:text-primary transition-all duration-300 hover:bg-white/50 rounded-full">
                <MicOff className="h-5 w-5" />
              </button>
              <button className="relative p-3 text-gray-500 hover:text-primary transition-all duration-300 hover:bg-white/50 rounded-full group">
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-primary to-accent text-white text-xs rounded-full h-6 w-6 flex items-center justify-center text-[10px] font-bold shadow-lg pulse-glow">
                    {cartItemCount}
                  </span>
                )}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="relative bg-white/90 backdrop-blur-md border-b border-white/20 sticky top-20 z-40">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/3 to-accent/3"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${activeTab === tab.key
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'menu' && (
          <MenuSection
            restaurantId={restaurantId}
            onItemClick={setSelectedItemId}
          />
        )}
        {activeTab === 'discovery' && <DiscoverySection />}
        {activeTab === 'deals' && <DealsSection />}
        {activeTab === 'reviews' && (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Reviews Coming Soon</h2>
            <p className="text-gray-600">Customer reviews and ratings will be available here.</p>
          </div>
        )}
      </main>

      {/* Floating Action Buttons */}
      <FloatingButtons
        restaurantId={restaurantId}
        onServerCall={() => setShowServerToast(true)}
      />

      {/* Item Detail Modal */}
      {selectedItemId && (
        <ItemDetailModal
          itemId={selectedItemId}
          onClose={() => setSelectedItemId(null)}
        />
      )}

      {/* Server Call Toast */}
      <ServerCallToast
        show={showServerToast}
        onHide={() => setShowServerToast(false)}
      />
    </div>
  );
}
