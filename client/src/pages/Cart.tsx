import { useEffect } from "react";
import { Link } from "wouter";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCart, removeFromCart, updateCartQuantity } from "@/store/slices/cartSlice";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";

export default function Cart() {
  const dispatch = useAppDispatch();
  const { items: cartItems, loading } = useAppSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchCart('guest'));
  }, [dispatch]);

  const handleUpdateQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    dispatch(updateCartQuantity({ id: cartItemId, quantity: newQuantity }));
  };

  const handleRemove = (cartItemId: string) => {
    dispatch(removeFromCart(cartItemId));
  };

  const subtotal = cartItems.reduce((sum, item) => {
    if (!item.product) return sum;
    const price = parseFloat(item.product.price);
    return sum + price * item.quantity;
  }, 0);

  const tax = subtotal * 0.13; // 13% tax
  const shipping = subtotal > 50 ? 0 : 9.99;
  const total = subtotal + tax + shipping;

  if (loading) {
    return (
      <>
        <Header cartItemCount={0} />
        <div className="min-h-screen bg-background">
          <div className="mx-auto max-w-7xl px-4 py-8">
            <Skeleton className="h-8 w-48 mb-8" />
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-32" />
                ))}
              </div>
              <Skeleton className="h-96" />
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header cartItemCount={cartItems.length} />
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-4 py-8">
          {/* Back Button */}
          <Link href="/products">
            <Button variant="ghost" className="mb-6" data-testid="button-back-shopping">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>

          <h1 className="text-3xl font-bold mb-8" data-testid="heading-cart">
            Shopping Cart
          </h1>

          {cartItems.length === 0 ? (
            <Card className="p-12 text-center">
              <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6">
                Add some products to your cart to get started
              </p>
              <Link href="/products">
                <Button data-testid="button-shop-now">
                  Shop Now
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => {
                  if (!item.product) return null;
                  
                  const price = parseFloat(item.product.price);
                  const originalPrice = item.product.originalPrice
                    ? parseFloat(item.product.originalPrice)
                    : null;

                  return (
                    <Card key={item.id} className="p-4" data-testid={`cart-item-${item.product.id}`}>
                      <div className="flex gap-4">
                        {/* Product Image */}
                        <Link href={`/products/${item.product.slug}`}>
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="h-24 w-24 rounded-md object-cover cursor-pointer hover-elevate"
                            data-testid={`img-cart-product-${item.product.id}`}
                          />
                        </Link>

                        {/* Product Details */}
                        <div className="flex-1 space-y-2">
                          <Link href={`/products/${item.product.slug}`}>
                            <h3 className="font-semibold hover:text-primary cursor-pointer" data-testid={`text-cart-product-name-${item.product.id}`}>
                              {item.product.name}
                            </h3>
                          </Link>
                          {item.product.brand && (
                            <p className="text-sm text-muted-foreground">
                              Brand: {item.product.brand}
                            </p>
                          )}

                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold" data-testid={`text-cart-price-${item.product.id}`}>
                              ${price.toFixed(2)}
                            </span>
                            {originalPrice && (
                              <span className="text-sm text-muted-foreground line-through">
                                ${originalPrice.toFixed(2)}
                              </span>
                            )}
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2">
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              data-testid={`button-decrease-${item.product.id}`}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-12 text-center font-medium" data-testid={`text-quantity-${item.product.id}`}>
                              {item.quantity}
                            </span>
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              data-testid={`button-increase-${item.product.id}`}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Remove Button & Subtotal */}
                        <div className="flex flex-col items-end justify-between">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleRemove(item.id)}
                            data-testid={`button-remove-${item.product.id}`}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Subtotal</p>
                            <p className="text-lg font-bold" data-testid={`text-subtotal-${item.product.id}`}>
                              ${(price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="p-6 sticky top-24">
                  <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal ({cartItems.length} items)</span>
                      <span data-testid="text-summary-subtotal">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span data-testid="text-summary-shipping">
                        {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax (13%)</span>
                      <span data-testid="text-summary-tax">${tax.toFixed(2)}</span>
                    </div>

                    <Separator />

                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span data-testid="text-summary-total">${total.toFixed(2)}</span>
                    </div>

                    {subtotal < 50 && (
                      <p className="text-xs text-muted-foreground">
                        Add ${(50 - subtotal).toFixed(2)} more to get free shipping!
                      </p>
                    )}
                  </div>

                  <Button className="w-full mt-6" size="lg" data-testid="button-checkout">
                    Proceed to Checkout
                  </Button>

                  <Link href="/orders">
                    <Button variant="outline" className="w-full mt-3" data-testid="button-track-order">
                      Track Your Order
                    </Button>
                  </Link>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
