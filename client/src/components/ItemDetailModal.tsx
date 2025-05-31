import { useState } from "react";
import { X, Star, Plus, Minus } from "lucide-react";
import { useMenuItem } from "@/hooks/use-menu";
import { useMenuItemAddons } from "@/hooks/use-addons";
import { useAddToCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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

  const totalPrice = calculateTotalPrice();

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-screen overflow-y-auto p-0">
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
          <>
            <div className="relative">
              <img 
                src={item.imageUrl || '/placeholder-food.jpg'} 
                alt={item.name}
                className="w-full h-64 object-cover"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 bg-white/80 hover:bg-white"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">{item.name}</h2>
                </div>
                
                <div className="flex items-center space-x-4 mb-4">
                  <span className="text-2xl font-bold text-primary">
                    ${item.price.toFixed(2)}
                  </span>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="ml-1 font-medium">{item.rating?.toFixed(1) || '0.0'}</span>
                    <span className="text-gray-400 ml-1">• {item.votes} votes</span>
                  </div>
                </div>
                
                <p className="text-gray-600 leading-relaxed">
                  {item.fullDescription || item.description}
                </p>
              </div>

              {/* Add-ons Customization */}
              {addons && addons.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Customize Your Order</h3>
                  {Object.entries(groupAddonsByCategory(addons)).map(([category, categoryAddons]) => (
                    <div key={category} className="space-y-3">
                      <h4 className="text-md font-medium text-gray-800 capitalize">
                        {category === 'spice' ? 'Spice Level' : 
                         category === 'cheese' ? 'Extra Cheese' :
                         category === 'meat' ? 'Meat Options' :
                         category === 'sauce' ? 'Sauces' :
                         category === 'side' ? 'Sides & Substitutions' :
                         category === 'topping' ? 'Toppings' : category}
                      </h4>
                      {category === 'spice' ? (
                        <RadioGroup value={spiceLevel} onValueChange={setSpiceLevel}>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="mild" id="mild" />
                            <Label htmlFor="mild">Mild</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="medium" id="medium" />
                            <Label htmlFor="medium">Medium</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="hot" id="hot" />
                            <Label htmlFor="hot">Hot</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="extra-hot" id="extra-hot" />
                            <Label htmlFor="extra-hot">Extra Hot</Label>
                          </div>
                        </RadioGroup>
                      ) : (
                        <div className="grid grid-cols-1 gap-2">
                          {categoryAddons.map((addon) => (
                            <div key={addon.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                              <div className="flex items-center space-x-3">
                                <Checkbox
                                  id={`addon-${addon.id}`}
                                  checked={selectedAddons[addon.id] > 0}
                                  onCheckedChange={(checked) => handleAddonToggle(addon.id, checked as boolean)}
                                />
                                <div>
                                  <Label htmlFor={`addon-${addon.id}`} className="font-medium text-gray-900">
                                    {addon.name}
                                  </Label>
                                  {addon.description && (
                                    <p className="text-sm text-gray-600">{addon.description}</p>
                                  )}
                                </div>
                              </div>
                              <span className="font-medium text-primary">
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
                  rows={3}
                />
              </div>

              {/* Quantity and Add to Cart */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-700">Quantity:</span>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1}
                      className="h-10 w-10"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="px-4 py-2 border-l border-r border-gray-300 min-w-[3rem] text-center">
                      {quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={increaseQuantity}
                      className="h-10 w-10"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <Button 
                  onClick={handleAddToCart}
                  disabled={addToCart.isPending}
                  className="font-medium px-6 py-3"
                >
                  {addToCart.isPending ? 'Adding...' : `Add to Cart - $${totalPrice}`}
                </Button>
              </div>
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
