import { useDeals } from "@/hooks/use-restaurant";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export default function DealsSection() {
  const { data: deals, isLoading } = useDeals();
  const { toast } = useToast();

  const handleClaimDeal = (dealTitle: string) => {
    toast({
      title: "Deal claimed!",
      description: `${dealTitle} has been added to your account.`,
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-40 w-full" />
          ))}
        </div>
      </div>
    );
  }

  const getGradientClass = (backgroundColor: string) => {
    switch (backgroundColor) {
      case "from-primary to-orange-600":
        return "bg-gradient-to-r from-primary to-orange-600";
      case "from-success to-teal-600":
        return "bg-gradient-to-r from-success to-teal-600";
      case "from-secondary to-indigo-700":
        return "bg-gradient-to-r from-secondary to-indigo-700";
      default:
        return "bg-gradient-to-r from-primary to-orange-600";
    }
  };

  const getButtonColorClass = (backgroundColor: string) => {
    switch (backgroundColor) {
      case "from-success to-teal-600":
        return "text-success hover:bg-gray-100";
      case "from-secondary to-indigo-700":
        return "text-secondary hover:bg-gray-100";
      default:
        return "text-primary hover:bg-gray-100";
    }
  };

  return (
    <section className="fade-in space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Exclusive Deals & Promotions</h2>
        <p className="text-gray-600">Limited time offers from participating restaurants</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {deals?.map((deal) => (
          <Card 
            key={deal.id} 
            className={`${getGradientClass(deal.backgroundColor || '')} text-white relative overflow-hidden border-none`}
          >
            <CardContent className="p-6 relative z-10">
              <h3 className="text-xl font-bold mb-2">{deal.title}</h3>
              <p className="text-sm opacity-90 mb-4">{deal.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Valid until {deal.validUntil}</span>
                <Button 
                  variant="secondary"
                  size="sm"
                  className={`bg-white ${getButtonColorClass(deal.backgroundColor || '')} font-medium transition-colors`}
                  onClick={() => handleClaimDeal(deal.title)}
                >
                  {deal.discountType === 'percentage' ? 'Claim Now' :
                   deal.discountType === 'free_delivery' ? 'Use Code' :
                   'View Menu'}
                </Button>
              </div>
            </CardContent>
            {/* Decorative element */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-white opacity-10 rounded-full transform translate-x-8 -translate-y-8"></div>
          </Card>
        ))}
      </div>

      {deals?.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No deals available</h3>
          <p className="text-gray-600">Check back later for new promotions and offers.</p>
        </div>
      )}
    </section>
  );
}
