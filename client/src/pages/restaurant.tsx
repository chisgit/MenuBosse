import { useState } from "react";
import { useRestaurant } from "@/hooks/use-restaurant";
import { Skeleton } from "@/components/ui/skeleton";
import { MicOff } from "lucide-react";
import MenuSection from "@/components/MenuSection";
import DiscoverySection from "@/components/DiscoverySection";
import DealsSection from "@/components/DealsSection";
import ItemDetailModal from "@/components/ItemDetailModal";
import FloatingButtons from "@/components/FloatingButtons";
import ServerCallToast from "@/components/ServerCallToast";
import Cart from "@/components/Cart";
import { getCurrentSession } from "@/lib/session";

interface RestaurantPageProps {
  restaurantId: number;
}

export default function RestaurantPage({ restaurantId }: RestaurantPageProps) {
  const [activeTab, setActiveTab] = useState<'menu' | 'discovery' | 'deals' | 'reviews'>('menu');
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [showServerToast, setShowServerToast] = useState(false);

  const { data: restaurant, isLoading: restaurantLoading, error } = useRestaurant(restaurantId);
  const session = getCurrentSession();

  console.log('[RestaurantPage] restaurantId:', restaurantId);
  console.log('[RestaurantPage] restaurantLoading:', restaurantLoading);
  console.log('[RestaurantPage] restaurant:', restaurant);
  if (error) {
    console.error('[RestaurantPage] Error loading restaurant:', error);
  }

  if (restaurantLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-6 w-96 mb-8" />
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
    console.warn('[RestaurantPage] No restaurant found for id:', restaurantId);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-800">
      {/* Enhanced Header with Integrated Navigation */}
      <header className="relative bg-black/80 backdrop-blur-md shadow-lg border-b border-white/10 sticky top-0 z-50">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-transparent to-orange-500/5"></div>
        <div className="relative max-w-7xl mx-auto container-spacing">
          <div className="flex justify-between items-start py-4 min-h-[100px] md:min-h-[110px]">
            <div className="flex flex-col items-start space-y-2">
              <div className="flex items-center space-x-8">
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                  MenuBosse
                </h1>
                <div className="text-sm md:text-base text-gray-300 bg-black/60 backdrop-blur-sm rounded-full px-6 py-3 border border-white/10">
                  <span className="font-semibold text-white">{restaurant.name}</span>
                  <span className="mx-2 text-orange-400">•</span>
                  <span className="text-gray-400">
                    {session ? `Table ${session.tableNumber}` : 'Table 12'}
                  </span>
                </div>
              </div>
              {/* Navigation Tabs Under Logo */}
              <div className="flex space-x-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`py-1 px-4 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${activeTab === tab.key
                        ? 'border-orange-500 text-orange-400'
                        : 'border-transparent text-gray-400 hover:text-gray-300'
                      }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-start pt-2 space-x-6">
              <button className="p-4 text-gray-400 hover:text-orange-400 transition-all duration-300 hover:bg-white/5 rounded-full">
                <MicOff className="h-5 w-5" />
              </button>
              <Cart />
            </div>
          </div>
        </div>
      </header>

      {/* Enhanced Main Content */}
      <main className="max-w-7xl mx-auto container-spacing padding-section">
        {activeTab === 'menu' && (
          <MenuSection
            restaurantId={restaurantId}
            onItemClick={setSelectedItemId}
            restaurantName={restaurant?.name}
            tableNumber="Table 12"
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
