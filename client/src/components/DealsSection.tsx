import { useDeals } from "@/hooks/use-restaurant";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Crown, Gift, Sparkles, Timer, Star, Zap } from "lucide-react";

export default function DealsSection() {
  const { data: deals, isLoading } = useDeals();
  const { toast } = useToast();
  const handleClaimDeal = (dealTitle: string) => {
    toast({
      title: "🎉 Exclusive Deal Claimed!",
      description: `${dealTitle} has been added to your VIP benefits. Enjoy your savings!`,
    });
  };
  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <Skeleton className="h-12 w-80 mb-4 rounded-xl" />
          <Skeleton className="h-6 w-96 rounded-lg" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-56 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }
  const getGradientClass = (backgroundColor: string) => {
    switch (backgroundColor) {
      case "from-primary to-orange-600":
        return "bg-gradient-to-br from-primary via-orange-500 to-orange-600";
      case "from-success to-teal-600":
        return "bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600";
      case "from-secondary to-indigo-700":
        return "bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-700";
      default:
        return "bg-gradient-to-br from-primary via-orange-500 to-orange-600";
    }
  };

  const getButtonColorClass = (backgroundColor: string) => {
    switch (backgroundColor) {
      case "from-success to-teal-600":
        return "text-emerald-600 hover:bg-white/90 hover:text-emerald-700";
      case "from-secondary to-indigo-700":
        return "text-indigo-600 hover:bg-white/90 hover:text-indigo-700";
      default:
        return "text-orange-600 hover:bg-white/90 hover:text-orange-700";
    }
  };

  const getDealIcon = (discountType: string) => {
    switch (discountType) {
      case 'percentage':
        return Crown;
      case 'free_delivery':
        return Zap;
      default:
        return Gift;
    }
  };
  return (
    <section className="fade-in space-y-8">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="luxury-icon-container p-3 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h2 className="luxury-heading text-4xl font-bold bg-gradient-to-r from-gray-900 via-primary to-accent bg-clip-text text-transparent">
              Exclusive VIP Offers
            </h2>
            <div className="h-1 w-32 bg-gradient-to-r from-primary to-accent rounded-full mt-2"></div>
          </div>
        </div>
        <p className="text-lg text-gray-600 leading-relaxed">
          Limited-time premium deals from our curated collection of fine dining partners
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">        {deals?.map((deal) => {
        const IconComponent = getDealIcon(deal.discountType || 'default');
        return (
          <Card
            key={deal.id}
            className={`luxury-deal-card group ${getGradientClass(deal.backgroundColor || '')} text-white relative overflow-hidden border-0 rounded-2xl shadow-luxury transform transition-all duration-500 hover:scale-105 hover:shadow-luxury-glow cursor-pointer`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20 pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full transform translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-700"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full transform -translate-x-12 translate-y-12 group-hover:scale-150 transition-transform duration-700"></div>

            <CardContent className="p-8 relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="luxury-deal-icon p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <IconComponent className="h-6 w-6 text-white" />
                </div>
                <div className="luxury-deal-badge bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                  <Timer className="h-4 w-4" />
                  <span className="text-sm font-medium">Limited</span>
                </div>
              </div>

              <h3 className="text-2xl font-bold mb-3 drop-shadow-sm">{deal.title}</h3>
              <p className="text-white/90 mb-6 leading-relaxed text-base">{deal.description}</p>

              <div className="flex items-center justify-between">
                <div className="luxury-validity bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                  <span className="text-sm font-medium flex items-center gap-1">
                    <Star className="h-4 w-4" />
                    Valid until {deal.validUntil}
                  </span>
                </div>
                <Button
                  variant="secondary"
                  size="lg"
                  className={`luxury-deal-btn bg-white/95 backdrop-blur-sm ${getButtonColorClass(deal.backgroundColor || '')} font-bold transition-all duration-300 hover:scale-105 hover:shadow-lg rounded-xl px-6 py-3 border-0`}
                  onClick={() => handleClaimDeal(deal.title)}
                >
                  {deal.discountType === 'percentage' ? (
                    <>
                      <Crown className="h-4 w-4 mr-2" />
                      Claim VIP Deal
                    </>
                  ) : deal.discountType === 'free_delivery' ? (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Get Code
                    </>
                  ) : (
                    <>
                      <Gift className="h-4 w-4 mr-2" />
                      Explore Menu
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
      </div>

      {deals?.length === 0 && (
        <div className="text-center py-16 luxury-empty-state">
          <div className="glass-card p-8 rounded-2xl bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-xl border border-white/20 max-w-md mx-auto">
            <Gift className="h-16 w-16 text-primary/60 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No VIP offers available</h3>
            <p className="text-gray-600 leading-relaxed">Check back soon for exclusive promotions and premium dining deals.</p>
          </div>
        </div>
      )}
    </section>
  );
}
