import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProducts } from "@/store/slices/productsSlice";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, Heart } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Deals() {
  const dispatch = useAppDispatch();
  const { items: products, loading } = useAppSelector((state) => state.products);
  const { items: cartItems } = useAppSelector((state) => state.cart);
  const { items: favorites } = useAppSelector((state) => state.favorites);

  useEffect(() => {
    dispatch(fetchProducts({ isOnSale: true }));
  }, [dispatch]);

  const dealProducts = products.filter(p => p.isOnSale && p.originalPrice);

  return (
    <div className="min-h-screen bg-background">
      <Header 
        cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onCartClick={() => {}}
      />

      <div className="bg-gradient-to-r from-destructive/20 to-destructive/10 py-12 mb-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4" data-testid="text-page-title">Special Deals & Offers</h1>
          <p className="text-lg text-muted-foreground">Save big on your favorite products</p>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-12">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-96" />
            ))}
          </div>
        ) : dealProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No deals available at the moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {dealProducts.map((product) => {
              const isFavorite = favorites.some(fav => fav.productId === product.id);
              const savings = product.originalPrice 
                ? (parseFloat(product.originalPrice) - parseFloat(product.price)).toFixed(2)
                : '0';
              const savingsPercent = product.originalPrice
                ? Math.round(((parseFloat(product.originalPrice) - parseFloat(product.price)) / parseFloat(product.originalPrice)) * 100)
                : 0;

              return (
                <Card key={product.id} className="group overflow-hidden hover-elevate" data-testid={`card-deal-${product.id}`}>
                  <Link href={`/products/${product.slug}`}>
                    <div className="relative aspect-square overflow-hidden bg-muted">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                      />
                      <Badge className="absolute top-2 left-2" variant="destructive" data-testid={`badge-discount-${product.id}`}>
                        {savingsPercent}% OFF
                      </Badge>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold line-clamp-2 mb-2" data-testid={`text-product-name-${product.id}`}>
                        {product.name}
                      </h3>
                      
                      {product.rating && (
                        <div className="flex items-center gap-1 mb-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < Math.floor(parseFloat(product.rating!))
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-muted"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            ({product.reviewCount})
                          </span>
                        </div>
                      )}
                      
                      <div className="mb-2">
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold" data-testid={`text-price-${product.id}`}>
                            ${product.price}
                          </span>
                          <span className="text-sm text-muted-foreground line-through" data-testid={`text-original-price-${product.id}`}>
                            ${product.originalPrice}
                          </span>
                        </div>
                        <p className="text-sm text-destructive font-medium" data-testid={`text-savings-${product.id}`}>
                          Save ${savings}
                        </p>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button className="flex-1" data-testid={`button-view-${product.id}`}>
                          View Deal
                        </Button>
                        <Button
                          size="icon"
                          variant={isFavorite ? "default" : "outline"}
                          data-testid={`button-favorite-${product.id}`}
                        >
                          <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
                        </Button>
                      </div>
                    </div>
                  </Link>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
