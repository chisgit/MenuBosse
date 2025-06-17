import { useState } from "react";
import { Bell, ChefHat, Sparkles, Star, Award, Heart, MessageCircle, Plus, Minus, X } from "lucide-react";
import { useMenuItem } from "@/hooks/use-menu";
import { useMenuItemAddons } from "@/hooks/use-addons";
import { useAddToCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import type { MenuItemAddon } from "@shared/schema";

interface ItemDetailModalProps {
  itemId: number;
  onClose: () => void;
}

export default function ItemDetailModal({ itemId, onClose }: ItemDetailModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [selectedAddons, setSelectedAddons] = useState<Record<number, number>>({});
  const [spiceLevel, setSpiceLevel] = useState("");
  const [activeTab, setActiveTab] = useState("customize");
  const [question, setQuestion] = useState("");

  const { data: item, isLoading } = useMenuItem(itemId);
  const { data: addons, isLoading: addonsLoading } = useMenuItemAddons(itemId);
  const addToCart = useAddToCart();
  const { toast } = useToast();

  const handleAddToCart = async () => {
    if (!item) return;

    try {
      await addToCart.mutateAsync({
        menuItemId: item.id,
        quantity,
        specialInstructions: specialInstructions || undefined,
      });

      toast({
        title: "Added to cart",
        description: `${quantity} x ${item.name} has been added to your cart.`,
      });

      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleAddonToggle = (addonId: number, checked: boolean) => {
    if (checked) {
      setSelectedAddons(prev => ({ ...prev, [addonId]: 1 }));
    } else {
      setSelectedAddons(prev => {
        const updated = { ...prev };
        delete updated[addonId];
        return updated;
      });
    }
  };

  const calculateTotalPrice = () => {
    if (!item) return "0.00";

    let basePrice = item.price * quantity;
    let addonPrice = 0;

    if (addons) {
      for (const [addonId, addonQuantity] of Object.entries(selectedAddons)) {
        const addon = addons.find(a => a.id === parseInt(addonId));
        if (addon) {
          addonPrice += addon.price * addonQuantity;
        }
      }
    }

    return (basePrice + addonPrice).toFixed(2);
  };

  const groupAddonsByCategory = (addons: MenuItemAddon[]) => {
    return addons.reduce((acc, addon) => {
      if (!acc[addon.category]) {
        acc[addon.category] = [];
      }
      acc[addon.category].push(addon);
      return acc;
    }, {} as Record<string, MenuItemAddon[]>);
  };

  const handleAskQuestion = () => {
    if (!question.trim()) return;

    toast({
      title: "Question submitted",
      description: "Our chef will answer your question about this dish shortly.",
    });
    setQuestion("");
  };

  const totalPrice = calculateTotalPrice();
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl h-[95vh] p-0 flex flex-col bg-gradient-to-br from-gray-900 via-gray-800/98 to-gray-900/95 backdrop-blur-xl border border-orange-500/20 rounded-3xl shadow-luxury-xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 bg-black/60 backdrop-blur-md rounded-full text-gray-300 hover:text-white hover:bg-black/80 transition-all duration-300 border border-white/20"
        >
          <X className="h-5 w-5" />
        </button>

        <VisuallyHidden>
          <DialogTitle>Menu Item Details</DialogTitle>
        </VisuallyHidden>
        {isLoading || addonsLoading ? (
          <div className="space-y-6 p-8">
            <Skeleton className="w-full h-80 rounded-2xl" />
            <div className="space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-32 w-full rounded-xl" />
            </div>
          </div>
        ) : item ? (
          <>
            {/* Luxurious Header with Image */}
            <div className="relative h-80 flex-shrink-0 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/40 z-10"></div>
              <img
                src={item.imageUrl || '/placeholder-food.jpg'}
                alt={item.name}
                className="w-full h-full object-cover scale-105 hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-8 z-20">
                <div className="flex items-end justify-between">
                  {/* Title, Price/Rating Block */}
                  <div>
                    <h2 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">{item.name}</h2>
                    <div className="flex items-center space-x-6">
                      <span className="text-3xl font-bold text-white drop-shadow-lg">
                        ${item.price.toFixed(2)}
                      </span>
                      <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                        <Star className="h-5 w-5 text-yellow-400 fill-current" />
                        <span className="ml-2 font-bold text-white">{item.rating?.toFixed(1) || '0.0'}</span>
                        <span className="text-white/80 ml-1">• {item.votes} votes</span>
                      </div>
                    </div>
                  </div>

                  {/* Badges Block */}
                  <div className="flex space-x-2">
                    <div className="luxury-badge bg-gradient-to-r from-accent/20 to-primary/20 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30">
                      <Award className="h-5 w-5 text-white" />
                    </div>
                    <div className="luxury-badge bg-gradient-to-r from-red-500/20 to-pink-500/20 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30">
                      <Heart className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Item Description - MOVED BACK HERE, BELOW HEADER, ABOVE TABS */}
            <div className="px-6 pt-2 pb-2"> {/* Added pb-2 for minimal bottom padding */}
              <div className="glass-card bg-gradient-to-br from-gray-800/40 to-gray-900/20 backdrop-blur-sm px-6 py-3 rounded-2xl border border-gray-700/30">
                <p className="text-gray-300 text-lg leading-relaxed font-medium">
                  {item.fullDescription || item.description}
                </p>
              </div>
            </div>

            {/* Premium Content with Tabs */}
            <div className="flex-1 overflow-hidden px-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                <TabsList className="grid w-full grid-cols-2 mt-2 bg-gray-800/50 backdrop-blur-sm rounded-xl p-2 gap-2"> {/* Reduced top margin from mt-6 to mt-2 */}
                  <TabsTrigger
                    value="customize"
                    className="flex items-center gap-2 rounded-lg border-0 data-[state=active]:bg-gray-700 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 text-gray-300"
                  >
                    <ChefHat className="h-4 w-4" />
                    Customize Your Dish
                  </TabsTrigger>
                  <TabsTrigger
                    value="questions"
                    className="flex items-center gap-2 rounded-lg border-0 data-[state=active]:bg-gray-700 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 text-gray-300"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Ask Our Chef
                  </TabsTrigger>
                </TabsList>
                <div className="flex-1 overflow-y-auto pb-12">
                  <TabsContent value="customize" className="space-y-8 mt-6">
                    {/* Premium Add-ons */}
                    {addons && addons.length > 0 && (
                      <div className="space-y-6">
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-300 to-orange-400 bg-clip-text text-transparent flex items-center gap-3">
                          <Sparkles className="h-6 w-6 text-primary" />
                          Enhance Your Experience
                        </h3>
                        {Object.entries(groupAddonsByCategory(addons)).map(([category, categoryAddons]) => (
                          <div key={category} className="glass-card bg-gradient-to-br from-gray-800/60 to-gray-900/40 backdrop-blur-sm border border-gray-700/40 rounded-2xl p-6 shadow-lg">
                            <h4 className="text-xl font-bold text-gray-200 mb-5 capitalize flex items-center gap-3">
                              <div className="w-2 h-2 bg-gradient-to-r from-primary to-accent rounded-full"></div>
                              {category === 'spice' ? 'Spice Level' :
                                category === 'cheese' ? 'Premium Cheese' :
                                  category === 'meat' ? 'Protein Selection' :
                                    category === 'sauce' ? 'Signature Sauces' :
                                      category === 'side' ? 'Gourmet Sides' :
                                        category === 'topping' ? 'Artisan Toppings' : category}
                            </h4>
                            {category === 'spice' ? (
                              <RadioGroup value={spiceLevel} onValueChange={setSpiceLevel} className="grid grid-cols-2 gap-4">
                                <div className="luxury-radio-item bg-gray-800/50 p-4 rounded-xl border border-gray-700/60 hover:bg-gray-700/70 transition-all duration-300 cursor-pointer">
                                  <div className="flex items-center space-x-3">
                                    <RadioGroupItem value="mild" id="mild" className="border-primary" />
                                    <Label htmlFor="mild" className="text-base font-medium text-gray-200 cursor-pointer">🌿 Mild & Gentle</Label>
                                  </div>
                                </div>
                                <div className="luxury-radio-item bg-gray-800/50 p-4 rounded-xl border border-gray-700/60 hover:bg-gray-700/70 transition-all duration-300 cursor-pointer">
                                  <div className="flex items-center space-x-3">
                                    <RadioGroupItem value="medium" id="medium" className="border-primary" />
                                    <Label htmlFor="medium" className="text-base font-medium text-gray-200 cursor-pointer">🌶️ Medium Heat</Label>
                                  </div>
                                </div>
                                <div className="luxury-radio-item bg-gray-800/50 p-4 rounded-xl border border-gray-700/60 hover:bg-gray-700/70 transition-all duration-300 cursor-pointer">
                                  <div className="flex items-center space-x-3">
                                    <RadioGroupItem value="hot" id="hot" className="border-primary" />
                                    <Label htmlFor="hot" className="text-base font-medium text-gray-200 cursor-pointer">🔥 Fiery Hot</Label>
                                  </div>
                                </div>
                                <div className="luxury-radio-item bg-gray-800/50 p-4 rounded-xl border border-gray-700/60 hover:bg-gray-700/70 transition-all duration-300 cursor-pointer">
                                  <div className="flex items-center space-x-3">
                                    <RadioGroupItem value="extra-hot" id="extra-hot" className="border-primary" />
                                    <Label htmlFor="extra-hot" className="text-base font-medium text-gray-200 cursor-pointer">🌋 Volcanic</Label>
                                  </div>
                                </div>
                              </RadioGroup>
                            ) : (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {categoryAddons.map((addon) => (
                                  <div key={addon.id} className="luxury-addon-item bg-gray-800/60 p-4 rounded-xl border border-gray-700/60 hover:bg-gray-700/80 transition-all duration-300 hover:shadow-lg">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center space-x-3">
                                        <Checkbox
                                          id={`addon-${addon.id}`}
                                          checked={selectedAddons[addon.id] > 0}
                                          onCheckedChange={(checked) => handleAddonToggle(addon.id, checked as boolean)}
                                          className="border-primary data-[state=checked]:bg-primary"
                                        />
                                        <Label htmlFor={`addon-${addon.id}`} className="text-base font-medium text-gray-200 cursor-pointer">
                                          {addon.name}
                                        </Label>
                                      </div>
                                      <span className="text-base font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                                        {addon.price > 0 ? `+$${addon.price.toFixed(2)}` : 'Complimentary'}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Special Instructions */}
                    <div className="glass-card bg-gradient-to-br from-gray-800/60 to-gray-900/40 backdrop-blur-sm border border-gray-700/40 rounded-2xl p-6 shadow-lg space-y-4">
                      <Label htmlFor="instructions" className="text-lg font-bold text-gray-200 flex items-center gap-2">
                        <MessageCircle className="h-5 w-5 text-primary" />
                        Special Requests
                      </Label>
                      <Textarea
                        id="instructions"
                        placeholder="Share any dietary preferences, allergies, or special requests with our chef..."
                        value={specialInstructions}
                        onChange={(e) => setSpecialInstructions(e.target.value)}
                        rows={3}
                        className="text-base bg-gray-800/50 border-gray-700/60 text-gray-200 rounded-xl resize-none focus:bg-gray-700/70 transition-all duration-300 placeholder:text-gray-400"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="questions" className="space-y-6 mt-6">
                    <div className="glass-card bg-gradient-to-br from-gray-800/80 to-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 shadow-lg">
                      <h3 className="text-xl font-bold text-orange-400 mb-3 flex items-center gap-2">
                        <ChefHat className="h-6 w-6" />
                        Chat with Our Executive Chef
                      </h3>
                      <p className="text-gray-300 mb-4 leading-relaxed">
                        Have questions about ingredients, preparation methods, dietary accommodations, or wine pairings? Our award-winning chef is here to help create your perfect dining experience!
                      </p>
                      <div className="space-y-4">
                        <Textarea
                          placeholder="Ask about ingredients, allergens, preparation methods, wine pairings, or anything else about this exquisite dish..."
                          value={question}
                          onChange={(e) => setQuestion(e.target.value)}
                          rows={4}
                          className="text-base bg-gray-800/70 border-gray-700/60 text-gray-200 rounded-xl resize-none"
                        />                        <Button
                          onClick={handleAskQuestion}
                          disabled={!question.trim()}
                          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 hover:shadow-lg mb-8"
                        >
                          <MessageCircle className="h-5 w-5 mr-2" />
                          Ask Our Chef
                        </Button>
                      </div>
                    </div>

                    {/* Sample Q&A */}
                    <div className="space-y-6">
                      <h4 className="text-xl font-bold text-gray-200 flex items-center gap-3">
                        <Sparkles className="h-5 w-5 text-primary" />
                        Frequently Asked Questions
                      </h4>
                      <div className="space-y-4">
                        <div className="glass-card bg-gradient-to-br from-gray-800/60 to-gray-900/40 backdrop-blur-sm rounded-xl p-5 border border-gray-700/40">
                          <p className="text-base font-semibold text-gray-200 mb-3">🌱 Is this dish gluten-free?</p>
                          <p className="text-sm text-gray-300 leading-relaxed">Absolutely! We can prepare this dish completely gluten-free with our artisanal gluten-free accompaniments.</p>
                        </div>
                        <div className="glass-card bg-gradient-to-br from-gray-800/60 to-gray-900/40 backdrop-blur-sm rounded-xl p-5 border border-gray-700/40">
                          <p className="text-base font-semibold text-gray-200 mb-3">🌶️ How spicy is the medium level?</p>
                          <p className="text-sm text-gray-300 leading-relaxed">Our medium spice level offers a perfect balance - warming and flavorful without overwhelming the palate, similar to a gentle jalapeño heat.</p>
                        </div>
                        <div className="glass-card bg-gradient-to-br from-gray-800/60 to-gray-900/40 backdrop-blur-sm rounded-xl p-5 border border-gray-700/40">
                          <p className="text-base font-semibold text-gray-200 mb-3">🍷 What wine pairs best with this?</p>
                          <p className="text-sm text-gray-300 leading-relaxed">Our sommelier recommends a crisp Sauvignon Blanc or a light Pinot Grigio to complement the delicate flavors perfectly.</p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </div >

            {/* Premium Footer with Actions */}
            < div className="border-t border-gray-700/50 bg-gradient-to-r from-gray-900/90 to-gray-800/90 backdrop-blur-sm p-6" >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-6">
                  <span className="text-lg font-bold text-gray-200">Quantity:</span>
                  <div className="luxury-quantity-selector flex items-center bg-gray-800/60 border border-gray-700/60 rounded-xl overflow-hidden shadow-sm">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1}
                      className="h-12 w-12 hover:bg-gray-700/80 rounded-none text-gray-200"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="px-6 py-3 text-lg font-bold min-w-[3rem] text-center bg-gray-800/40 text-gray-200">
                      {quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={increaseQuantity}
                      className="h-12 w-12 hover:bg-gray-700/80 rounded-none text-gray-200"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleAddToCart}
                disabled={addToCart.isPending}
                className="w-full luxury-add-to-cart bg-gradient-to-r from-primary via-primary to-accent hover:from-primary/90 hover:via-primary/90 hover:to-accent/90 text-white font-bold px-10 py-4 rounded-2xl text-lg transition-all duration-300 hover:shadow-luxury-glow border-0"
              >
                {addToCart.isPending ? (
                  <>
                    <Sparkles className="h-5 w-5 mr-2 animate-spin" />
                    Adding to Cart...
                  </>
                ) : (
                  <>
                    <Heart className="h-5 w-5 mr-2" />
                    Add to Cart - ${totalPrice}
                  </>
                )}
              </Button>
            </div >
          </>
        ) : (
          <div className="p-8 text-center glass-card bg-gradient-to-br from-gray-800/60 to-gray-900/40 backdrop-blur-sm rounded-2xl m-6 border border-gray-700/40">
            <Sparkles className="h-16 w-16 text-primary/60 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-200 mb-3">Dish Not Available</h2>
            <p className="text-gray-400 mb-6 leading-relaxed">We apologize, but this culinary creation is currently unavailable.</p>
            <Button onClick={onClose} className="bg-gradient-to-r from-primary to-accent text-white px-8 py-3 rounded-xl">
              Explore Other Dishes
            </Button>
          </div>
        )
        }
      </DialogContent >
    </Dialog >
  );
}
