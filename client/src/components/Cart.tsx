import { useState } from "react";
import { ShoppingCart, Plus, Minus, X, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCart, useUpdateCartItem, useRemoveFromCart, useClearCart } from "@/hooks/use-cart";
import { getCurrentSession } from "@/lib/session";
import ItemDetailModal from "./ItemDetailModal";

export default function Cart() {
  const { data: cartItems = [], isLoading } = useCart();
  const updateCartItem = useUpdateCartItem();
  const removeFromCart = useRemoveFromCart();
  const clearCart = useClearCart();
  const [selectedImageItem, setSelectedImageItem] = useState<number | null>(null);
  const [selectedDetailItem, setSelectedDetailItem] = useState<number | null>(null);
  const session = getCurrentSession();

  const totalItems = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.menuItem.price * (item.quantity || 1)), 0);

  const handleQuantityChange = (id: number, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart.mutate(id);
    } else {
      updateCartItem.mutate({ 
        id, 
        quantity: newQuantity, 
        specialInstructions: cartItems.find(item => item.id === id)?.specialInstructions || undefined 
      });
    }
  };

  const handleRemoveItem = (id: number) => {
    removeFromCart.mutate(id);
  };

  const handleClearCart = () => {
    clearCart.mutate();
  };

  const ImageModal = () => {
    const item = cartItems.find(item => item.id === selectedImageItem);
    if (!item) return null;

    return (
      <Dialog open={!!selectedImageItem} onOpenChange={() => setSelectedImageItem(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{item.menuItem.name}</DialogTitle>
          </DialogHeader>
          <div className="aspect-video w-full overflow-hidden rounded-lg">
            <img
              src={item.menuItem.imageUrl || "/placeholder-food.jpg"}
              alt={item.menuItem.name}
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-sm text-muted-foreground">{item.menuItem.fullDescription || item.menuItem.description}</p>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="relative">
            <ShoppingCart className="h-4 w-4" />
            {totalItems > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {totalItems}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent className="w-full sm:max-w-lg flex flex-col">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Your Cart
              {session && (
                <Badge variant="secondary" className="text-xs">
                  Table {session.tableNumber}
                </Badge>
              )}
            </SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-auto space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <p className="text-muted-foreground">Loading cart...</p>
              </div>
            ) : cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-center">
                <ShoppingCart className="h-12 w-12 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">Your cart is empty</p>
                <p className="text-sm text-muted-foreground">Add some delicious items to get started!</p>
              </div>
            ) : (
              <>
                {cartItems.map((item) => (
                  <Card key={item.id} className="relative">
                    <CardContent className="p-4">
                      <div className="flex gap-3">
                        {/* Item Image */}
                        <div 
                          className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer hover:opacity-75 transition-opacity"
                          onClick={() => setSelectedImageItem(item.id)}
                        >
                          <img
                            src={item.menuItem.imageUrl || "/placeholder-food.jpg"}
                            alt={item.menuItem.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/20 rounded-lg">
                            <Eye className="h-4 w-4 text-white" />
                          </div>
                        </div>

                        {/* Item Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-sm leading-tight">{item.menuItem.name}</h4>
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                {item.menuItem.description}
                              </p>
                              {item.specialInstructions && (
                                <p className="text-xs text-orange-600 mt-1">
                                  Note: {item.specialInstructions}
                                </p>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-muted-foreground hover:text-destructive"
                              onClick={() => handleRemoveItem(item.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>

                          {/* Quantity and Price */}
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => handleQuantityChange(item.id, (item.quantity || 1) - 1)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="text-sm font-medium w-8 text-center">
                                {item.quantity || 1}
                              </span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => handleQuantityChange(item.id, (item.quantity || 1) + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">
                                ${(item.menuItem.price * (item.quantity || 1)).toFixed(2)}
                              </p>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-auto p-0 text-xs text-muted-foreground hover:text-primary"
                                onClick={() => setSelectedDetailItem(item.menuItem.id)}
                              >
                                Modify
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <Separator />

                {/* Cart Summary */}
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Items ({totalItems})</span>
                        <span>${totalPrice.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Tax</span>
                        <span>${(totalPrice * 0.1).toFixed(2)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-medium">
                        <span>Total</span>
                        <span>${(totalPrice * 1.1).toFixed(2)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Button className="w-full" size="lg">
                    Place Order
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={handleClearCart}
                    disabled={cartItems.length === 0}
                  >
                    Clear Cart
                  </Button>
                </div>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <ImageModal />
      
      {selectedDetailItem && (
        <ItemDetailModal
          itemId={selectedDetailItem}
          onClose={() => setSelectedDetailItem(null)}
        />
      )}
    </>
  );
}
