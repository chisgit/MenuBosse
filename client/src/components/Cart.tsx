import { useState } from "react";
import { ShoppingCart, Plus, Minus, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCart, useUpdateCartItem, useRemoveFromCart, useClearCart, usePlaceOrder, useCompletePayment, useSessionStatus } from "@/hooks/use-cart";
import { getCurrentSession } from "@/lib/session";
import ItemDetailModal from "./ItemDetailModal";

export default function Cart({ menuItems, menuAddons }: { menuItems: any[], menuAddons: Record<number, any[]> }) {
    const { data: cartItems = [], isLoading } = useCart(menuItems, menuAddons);
    console.log("[DEBUG] Cart Items loaded:", cartItems);
    console.log("[DEBUG] Cart loading state:", isLoading);
    const updateCartItem = useUpdateCartItem();
    const removeFromCart = useRemoveFromCart();
    const clearCart = useClearCart();
    const placeOrder = usePlaceOrder();
    const completePayment = useCompletePayment();
    const { session, isActive, isPaid } = useSessionStatus();
    const [selectedImageItem, setSelectedImageItem] = useState<number | null>(null);
    const [selectedDetailItem, setSelectedDetailItem] = useState<number | null>(null);
    const [checkoutState, setCheckoutState] = useState<'cart' | 'checkout' | 'payment'>('cart');

    const totalItems = cartItems.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
    const totalPrice = cartItems.reduce((sum: number, item: any) => {
        const addonsPrice = (item.addons || []).reduce((addonSum: number, addon: any) => addonSum + (addon.addon?.price ?? 0) * (addon.quantity ?? 1), 0);
        return sum + ((item.menuItem?.price ?? 0) * (item.quantity || 1)) + addonsPrice;
    }, 0);

    const handleQuantityChange = (id: number, newQuantity: number) => {
        console.log(`[DEBUG] handleQuantityChange called for id: ${id}, newQuantity: ${newQuantity}`);
        if (newQuantity < 1) {
            console.log(`[DEBUG] Removing item from cart: ${id}`);
            removeFromCart.mutate(id);
        } else {
            console.log(`[DEBUG] Updating cart item: ${id} to quantity: ${newQuantity}`);
            updateCartItem.mutate({
                id,
                quantity: newQuantity,
            });
        }
    };

    const handleRemoveItem = (id: number) => {
        console.log(`[DEBUG] handleRemoveItem called for id: ${id}`);
        removeFromCart.mutate(id);
    };

    const handleClearCart = () => {
        console.log("[DEBUG] handleClearCart called");
        clearCart.mutate();
    };

    const handlePlaceOrder = () => {
        console.log("[DEBUG] handlePlaceOrder called");
        placeOrder.mutate(undefined, {
            onSuccess: () => {
                console.log("[DEBUG] Order placed successfully");
                setCheckoutState('checkout');
            },
        });
    };

    const handleProceedToPayment = () => {
        console.log("[DEBUG] handleProceedToPayment called");
        setCheckoutState('payment');
    };

    const handlePayment = (paymentMethod: 'app' | 'cash' | 'card') => {
        completePayment.mutate({ paymentMethod }, {
            onSuccess: () => {
                setCheckoutState('cart');
                // Optionally show success message or redirect
            },
        });
    };

    const handleBackToCart = () => {
        setCheckoutState('cart');
    };

    // Don't show cart if session is paid/closed
    if (isPaid || !isActive) {
        return (
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon" disabled>
                        <ShoppingCart className="h-4 w-4" />
                    </Button>
                </SheetTrigger>
                <SheetContent className="w-full sm:max-w-lg flex flex-col">
                    <SheetHeader>
                        <SheetTitle>Session Ended</SheetTitle>
                    </SheetHeader>
                    <div className="flex flex-col items-center justify-center h-32 text-center">
                        <p className="text-muted-foreground">Your dining session has ended.</p>
                        <p className="text-sm text-muted-foreground">Please scan a new QR code to start a new session.</p>
                    </div>
                </SheetContent>
            </Sheet>
        );
    }

    const ImageModal = () => {
        const item = cartItems.find(item => item.id === selectedImageItem);
        if (!item) return null;

        return (
            <Dialog open={!!selectedImageItem} onOpenChange={() => setSelectedImageItem(null)}>
                <DialogContent className="max-w-2xl" aria-describedby="cart-dialog-description">
                    <DialogHeader>
                        <DialogTitle>{item.menuItem.name}</DialogTitle>
                    </DialogHeader>
                    <p id="cart-dialog-description" style={{ display: "none" }}>
                        This dialog shows the selected cart item details including image and description.
                    </p>
                    <div className="aspect-video w-full overflow-hidden rounded-lg">
                        <img
                            src={item.menuItem?.imageUrl || "/placeholder-food.jpg"}
                            alt={item.menuItem?.name || "Unknown Item"}
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
                    <button className="relative p-4 w-18 h-18 text-gray-400 hover:text-orange-400 transition-all duration-300 hover:bg-white/5 rounded-full">
                        <ShoppingCart className="h-5 w-5" />
                        {totalItems > 0 && (
                            <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center z-10 border-2 border-gray-900 shadow-lg">
                                {totalItems}
                            </span>
                        )}
                    </button>
                </SheetTrigger>
                <SheetContent className="w-full sm:max-w-lg flex flex-col">
                    <SheetHeader>
                        <SheetTitle className="flex items-center gap-2">
                            <ShoppingCart className="h-5 w-5" />
                            {checkoutState === 'cart' && 'Your Cart'}
                            {checkoutState === 'checkout' && '✅ Order Placed'}
                            {checkoutState === 'payment' && '💳 Checkout'}
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
                        ) : cartItems.length === 0 && checkoutState === 'cart' ? (
                            <div className="flex flex-col items-center justify-center h-32 text-center">
                                <ShoppingCart className="h-12 w-12 text-muted-foreground mb-2" />
                                <p className="text-muted-foreground">Your cart is empty</p>
                                <p className="text-sm text-muted-foreground">Add some delicious items to get started!</p>
                            </div>
                        ) : (
                            <>
                                {/* Show cart items only in 'cart' state */}
                                {checkoutState === 'cart' && cartItems.map((item) => (
                                    <Card key={item.id} className="relative">
                                        <CardContent className="p-4">
                                            <div className="flex gap-3">
                                                {/* Item Image */}
                                                <div
                                                    className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer hover:opacity-75 transition-opacity"
                                                    onClick={() => setSelectedImageItem(item.id)}
                                                >
                                                    <img
                                                        src={item.menuItem?.imageUrl || "/placeholder-food.jpg"}
                                                        alt={item.menuItem?.name || "Unknown Item"}
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
                                                            <h4 className="font-medium text-sm leading-tight">{item.menuItem?.name || "Unknown Item"}</h4>
                                                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                                                {item.menuItem?.description || "No description available."}
                                                            </p>
                                                            {item.addons && item.addons.length > 0 && (
                                                                <div className="mt-2">
                                                                    <div className="border-t border-dashed border-gray-700 my-2" />
                                                                    <div className="text-xs text-orange-500 font-medium">
                                                                        {/* No section title for add-ons/customizations */}
                                                                        <ul className="ml-2 list-disc">
                                                                            {item.addons.map((addonObj: any, idx: number) => (
                                                                                <li key={idx}>
                                                                                    {addonObj.addon?.name || "Unknown Addon"}
                                                                                    {addonObj.quantity > 1 ? ` x${addonObj.quantity}` : ""}
                                                                                    {addonObj.addon?.price ? ` ($${addonObj.addon.price.toFixed(2)})` : ""}
                                                                                </li>
                                                                            ))}
                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                            )}
                                                            {item.specialInstructions && (
                                                                <>
                                                                    <div className="border-t border-dashed border-gray-700 my-2" />
                                                                    <p className="text-xs text-orange-500 font-medium">
                                                                        {item.specialInstructions}
                                                                    </p>
                                                                </>
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
                                                                ${((item.menuItem?.price ?? 0) * (item.quantity || 1) + (item.addons || []).reduce((acc: number, addon: any) => acc + (addon.addon?.price ?? 0) * (addon.quantity ?? 1), 0)).toFixed(2)}
                                                            </p>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-auto p-0 text-xs text-muted-foreground hover:text-primary"
                                                                onClick={() => setSelectedDetailItem(item.id)}
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

                                {/* Show summary for checkout/payment states */}
                                {(checkoutState === 'checkout' || checkoutState === 'payment') && (
                                    <div className="space-y-4">
                                        <Card className="bg-gray-50">
                                            <CardContent className="p-4">
                                                <h3 className="font-medium mb-3">Order Summary</h3>
                                                <div className="space-y-2">
                                                    {cartItems.map((item) => (
                                                        <div key={item.id} className="flex justify-between text-sm">
                                                            <span>{item.quantity}x {item.menuItem?.name || 'Unknown Item'}</span>
                                                            <span>${((item.menuItem?.price ?? 0) * (item.quantity || 1) + (item.addons || []).reduce((acc: number, addon: any) => acc + (addon.addon?.price ?? 0) * (addon.quantity ?? 1), 0)).toFixed(2)}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                )}

                                {cartItems.length > 0 && <Separator />}

                                {/* Cart Summary - Show in all states */}
                                {cartItems.length > 0 && (
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
                                )}

                                {/* Action Buttons */}
                                <div className="space-y-2">
                                    {checkoutState === 'cart' && (
                                        <>
                                            <Button
                                                className="w-full"
                                                size="lg"
                                                onClick={handlePlaceOrder}
                                                disabled={cartItems.length === 0 || placeOrder.isPending}
                                            >
                                                {placeOrder.isPending ? "Placing Order..." : "Place Order"}
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="w-full"
                                                onClick={handleClearCart}
                                                disabled={cartItems.length === 0}
                                            >
                                                Clear Cart
                                            </Button>
                                        </>
                                    )}

                                    {checkoutState === 'checkout' && (
                                        <>
                                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                                                <h3 className="font-medium text-green-800 mb-2">✅ Order Placed Successfully!</h3>
                                                <p className="text-sm text-green-700">Your order has been sent to the kitchen. Proceed to checkout when you're ready to pay.</p>
                                            </div>
                                            <Button
                                                className="w-full"
                                                size="lg"
                                                onClick={handleProceedToPayment}
                                            >
                                                Proceed to Checkout
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="w-full"
                                                onClick={handleBackToCart}
                                            >
                                                Back to Menu
                                            </Button>
                                        </>
                                    )}

                                    {checkoutState === 'payment' && (
                                        <>
                                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                                                <h3 className="font-medium text-blue-800 mb-2">💳 Choose Payment Method</h3>
                                                <p className="text-sm text-blue-700">Select how you'd like to pay your bill:</p>
                                            </div>
                                            <Button
                                                className="w-full"
                                                size="lg"
                                                onClick={() => handlePayment('app')}
                                                disabled={completePayment.isPending}
                                            >
                                                💳 Pay in App
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="w-full"
                                                onClick={() => handlePayment('cash')}
                                                disabled={completePayment.isPending}
                                            >
                                                💵 Pay Cash (Tell Waiter)
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="w-full"
                                                onClick={() => handlePayment('card')}
                                                disabled={completePayment.isPending}
                                            >
                                                💳 Pay Card (Tell Waiter)
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                className="w-full text-sm"
                                                onClick={() => setCheckoutState('checkout')}
                                                disabled={completePayment.isPending}
                                            >
                                                ← Back to Checkout
                                            </Button>
                                        </>
                                    )}
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
