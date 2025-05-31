import { Bell, HelpCircle } from "lucide-react";
import { useServerCall } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface FloatingButtonsProps {
  restaurantId: number;
  onServerCall: () => void;
}

export default function FloatingButtons({ restaurantId, onServerCall }: FloatingButtonsProps) {
  const serverCall = useServerCall();
  const { toast } = useToast();

  const handleServerCall = async () => {
    try {
      await serverCall.mutateAsync({
        restaurantId,
        tableNumber: "12", // This would come from context/props
      });
      
      onServerCall();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to call server. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleQAClick = () => {
    toast({
      title: "Menu Q&A",
      description: "Ask questions about menu items using voice or text. Feature coming soon!",
    });
  };

  return (
    <div className="fixed bottom-6 right-6 flex flex-col space-y-4 z-40">
      {/* Server Call Button */}
      <Button
        size="icon"
        className="floating-btn w-16 h-16 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-primary hover:bg-primary/90"
        onClick={handleServerCall}
        disabled={serverCall.isPending}
        title="Call Server"
      >
        <Bell className="h-6 w-6" />
      </Button>

      {/* Menu Q&A Button */}
      <Button
        size="icon"
        className="w-16 h-16 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
        style={{ backgroundColor: 'hsl(var(--success))' }}
        onClick={handleQAClick}
        title="Ask about Menu"
      >
        <HelpCircle className="h-6 w-6" />
      </Button>
    </div>
  );
}
