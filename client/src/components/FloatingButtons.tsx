import React from "react";
import { Bell, HelpCircle, Sparkles, Zap } from "lucide-react";
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
      title: "🤖 AI Culinary Assistant",
      description: "Ask questions about any dish using voice or text. Our AI sommelier and chef are ready to assist!",
    });
  };
  return (
    <div className="fixed bottom-8 right-8 flex flex-col space-y-4 z-50">
      {/* Luxury Server Call Button */}
      <div className="luxury-floating-container group">
        <Button
          size="icon"
          className="luxury-floating-btn w-18 h-18 rounded-full shadow-luxury hover:shadow-luxury-glow transition-all duration-500 bg-gradient-to-br from-primary via-primary to-accent hover:from-primary/90 hover:via-primary/90 hover:to-accent/90 border-0 transform hover:scale-110"
          onClick={handleServerCall}
          disabled={serverCall.isPending}
          title="Call Our Premium Service"
        >
          {serverCall.isPending ? (
            <Sparkles className="h-7 w-7 text-white animate-spin" />
          ) : (
            <Bell className="h-7 w-7 text-white group-hover:animate-pulse" />
          )}
        </Button>
        <div className="luxury-tooltip absolute right-20 top-1/2 transform -translate-y-1/2 bg-black/90 text-white px-3 py-2 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap backdrop-blur-sm">
          Call Premium Service
        </div>
      </div>

      {/* Luxury AI Assistant Button */}
      <div className="luxury-floating-container group">
        <Button
          size="icon"
          className="luxury-floating-btn w-18 h-18 rounded-full shadow-luxury hover:shadow-luxury-glow transition-all duration-500 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-700 border-0 transform hover:scale-110"
          onClick={handleQAClick}
          title="AI Culinary Assistant"
        >
          <HelpCircle className="h-7 w-7 text-white group-hover:animate-pulse" />
        </Button>
        <div className="luxury-tooltip absolute right-20 top-1/2 transform -translate-y-1/2 bg-black/90 text-white px-3 py-2 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap backdrop-blur-sm">
          Ask AI Assistant
        </div>
      </div>

      {/* Decorative animated background elements */}
      <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
    </div>
  );
}
