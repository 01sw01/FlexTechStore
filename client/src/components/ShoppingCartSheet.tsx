import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCart, updateCartQuantity, removeFromCart, clearCart } from "@/store/slices/cartSlice";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

interface ShoppingCartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ShoppingCartSheet({ open, onOpenChange }: ShoppingCartSheetProps) {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const { items: cartItems } = useAppSelector((state) => state.cart);
  const { id: userId } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (open) {
      dispatch(fetchCart(userId));
    }
  }, [open, dispatch, userId]);

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    dispatch(updateCartQuantity({ id, quantity }));
  };

  const handleRemove = (id: string, productName: string) => {
    dispatch(removeFromCart(id));
    toast({
      title: "Removed from cart",
      description: `${productName} has been removed from your cart.`,
    });
  };

  const handleClearCart = () => {
    dispatch(clearCart(userId));
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart.",
    });
  };

  const subtotal = cartItems.reduce((sum, item) => {
    if (item.product) {
      return sum + parseFloat(item.product.price) * item.quantity;
    }
    return sum;
  }, 0);

  const shipping = subtotal > 50 ? 0 : 9.99;
  const total = subtotal + shipping;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Shopping Cart ({cartItems.length})
          </SheetTitle>
        </SheetHeader>

        {cartItems.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground" data-testid="text-empty-cart">Your cart is empty</p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-auto py-4">
              <div className="space-y-4">
                {cartItems.map((item) => {
                  if (!item.product) return null;
                  
                  return (
                    <div key={item.id} className="flex gap-4" data-testid={`cart-item-${item.id}`}>
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold line-clamp-2 mb-1" data-testid={`text-cart-product-${item.id}`}>
                          {item.product.name}
                        </h4>
                        <p className="text-sm font-bold mb-2" data-testid={`text-cart-price-${item.id}`}>
                          ${item.product.price}
                        </p>
                        <div className="flex items-center gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            data-testid={`button-decrease-${item.id}`}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center" data-testid={`text-quantity-${item.id}`}>
                            {item.quantity}
                          </span>
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            data-testid={`button-increase-${item.id}`}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 ml-auto"
                            onClick={() => handleRemove(item.id, item.product!.name)}
                            data-testid={`button-remove-${item.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="border-t pt-4 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span data-testid="text-subtotal">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span data-testid="text-shipping">
                    {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                {subtotal < 50 && subtotal > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Add ${(50 - subtotal).toFixed(2)} more for free shipping
                  </p>
                )}
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span data-testid="text-total">${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Button className="w-full" size="lg" data-testid="button-checkout">
                  Checkout
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleClearCart}
                  data-testid="button-clear-cart"
                >
                  Clear Cart
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
