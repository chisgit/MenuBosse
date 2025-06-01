import { useState } from "react";
import { X, Star, Plus, Minus, MessageCircle, ChefHat } from "lucide-react";
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
      <DialogContent className="max-w-4xl h-[90vh] p-0 flex flex-col">
        <VisuallyHidden>
          <DialogTitle>Menu Item Details</DialogTitle>
        </VisuallyHidden>
        {isLoading || addonsLoading ? (
          <div className="space-y-4 p-6">
            <Skeleton className="w-full h-64" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        ) : item ? (
          <>            {/* Header with Image */}
            <div className="relative h-48 flex-shrink-0">
              <img
                src={item.imageUrl || '/placeholder-food.jpg'}
                alt={item.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                <h2 className="text-2xl font-bold text-white">{item.name}</h2>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="text-xl font-bold text-white">
                    ${item.price.toFixed(2)}
                  </span>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="ml-1 font-medium text-white">{item.rating?.toFixed(1) || '0.0'}</span>
                    <span className="text-white/80 ml-1">• {item.votes} votes</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content with Tabs */}
            <div className="flex-1 overflow-hidden">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                <TabsList className="grid w-full grid-cols-2 mx-4 mt-4">
                  <TabsTrigger value="customize" className="flex items-center gap-2">
                    <ChefHat className="h-4 w-4" />
                    Customize
                  </TabsTrigger>
                  <TabsTrigger value="questions" className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    Ask Questions
                  </TabsTrigger>
                </TabsList>

                <div className="flex-1 overflow-y-auto px-4 pb-4">
                  <TabsContent value="customize" className="space-y-4 mt-4">
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {item.fullDescription || item.description}
                    </p>

                    {/* Compact Add-ons */}
                    {addons && addons.length > 0 && (
                      <div className="space-y-3">
                        {Object.entries(groupAddonsByCategory(addons)).map(([category, categoryAddons]) => (
                          <div key={category} className="border border-gray-200 rounded-lg p-3">
                            <h4 className="text-sm font-semibold text-gray-800 mb-2 capitalize">
                              {category === 'spice' ? 'Spice Level' :
                                category === 'cheese' ? 'Extra Cheese' :
                                  category === 'meat' ? 'Meat Options' :
                                    category === 'sauce' ? 'Sauces' :
                                      category === 'side' ? 'Sides & Substitutions' :
                                        category === 'topping' ? 'Toppings' : category}
                            </h4>
                            {category === 'spice' ? (
                              <RadioGroup value={spiceLevel} onValueChange={setSpiceLevel} className="flex flex-wrap gap-4">
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="mild" id="mild" />
                                  <Label htmlFor="mild" className="text-sm">Mild</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="medium" id="medium" />
                                  <Label htmlFor="medium" className="text-sm">Medium</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="hot" id="hot" />
                                  <Label htmlFor="hot" className="text-sm">Hot</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="extra-hot" id="extra-hot" />
                                  <Label htmlFor="extra-hot" className="text-sm">Extra Hot</Label>
                                </div>
                              </RadioGroup>
                            ) : (
                              <div className="grid grid-cols-2 gap-2">
                                {categoryAddons.map((addon) => (
                                  <div key={addon.id} className="flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100">
                                    <div className="flex items-center space-x-2">
                                      <Checkbox
                                        id={`addon-${addon.id}`}
                                        checked={selectedAddons[addon.id] > 0}
                                        onCheckedChange={(checked) => handleAddonToggle(addon.id, checked as boolean)}
                                      />
                                      <Label htmlFor={`addon-${addon.id}`} className="text-xs font-medium text-gray-900">
                                        {addon.name}
                                      </Label>
                                    </div>
                                    <span className="text-xs font-medium text-primary">
                                      {addon.price > 0 ? `+$${addon.price.toFixed(2)}` : 'Free'}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Special Instructions */}
                    <div className="space-y-2">
                      <Label htmlFor="instructions" className="text-sm font-medium text-gray-700">
                        Special Instructions
                      </Label>
                      <Textarea
                        id="instructions"
                        placeholder="Any dietary restrictions or preferences..."
                        value={specialInstructions}
                        onChange={(e) => setSpecialInstructions(e.target.value)}
                        rows={2}
                        className="text-sm"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="questions" className="space-y-4 mt-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h3 className="text-sm font-semibold text-blue-900 mb-2">Ask Our Chef</h3>
                      <p className="text-sm text-blue-800 mb-3">
                        Have questions about ingredients, preparation, or dietary accommodations? Our chef is here to help!
                      </p>
                      <div className="space-y-3">
                        <Textarea
                          placeholder="Ask about ingredients, allergens, preparation method, or anything else about this dish..."
                          value={question}
                          onChange={(e) => setQuestion(e.target.value)}
                          rows={3}
                          className="text-sm"
                        />
                        <Button
                          onClick={handleAskQuestion}
                          disabled={!question.trim()}
                          size="sm"
                          className="w-full"
                        >
                          Ask Chef
                        </Button>
                      </div>
                    </div>

                    {/* Sample Q&A */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-gray-800">Common Questions</h4>
                      <div className="space-y-2">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-sm font-medium text-gray-900">Is this dish gluten-free?</p>
                          <p className="text-xs text-gray-600 mt-1">We can prepare this without the bun and substitute gluten-free fries.</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-sm font-medium text-gray-900">How spicy is the medium level?</p>
                          <p className="text-xs text-gray-600 mt-1">Medium has a gentle heat that most people enjoy - similar to mild jalapeño.</p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </div>

            {/* Fixed Bottom Bar */}
            <div className="border-t border-gray-200 p-4 bg-white flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-700">Qty:</span>
                <div className="flex items-center border border-gray-300 rounded">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                    className="h-8 w-8"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="px-3 py-1 text-sm font-medium min-w-[2rem] text-center">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={increaseQuantity}
                    className="h-8 w-8"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <Button
                onClick={handleAddToCart}
                disabled={addToCart.isPending}
                className="font-medium px-6"
              >
                {addToCart.isPending ? 'Adding...' : `Add to Cart - $${totalPrice}`}
              </Button>
            </div>
          </>
        ) : (
          <div className="p-6 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Item Not Found</h2>
            <p className="text-gray-600 mb-4">The menu item you're looking for doesn't exist.</p>
            <Button onClick={onClose}>Close</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
