import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchFavorites, removeFavorite } from "@/store/slices/favoritesSlice";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, X } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";

export default function Favorites() {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const { items: favorites, loading } = useAppSelector((state) => state.favorites);
  const { items: cartItems } = useAppSelector((state) => state.cart);
  const { id: userId } = useAppSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchFavorites(userId));
  }, [dispatch, userId]);

  const handleRemove = (productId: string, productName: string) => {
    dispatch(removeFavorite({ productId, userId }));
    toast({
      title: "Removed from favorites",
      description: `${productName} has been removed from your favorites.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onCartClick={() => {}}
      />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8" data-testid="text-page-title">My Favorites</h1>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-96" />
            ))}
          </div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4" data-testid="text-no-favorites">You haven't added any favorites yet</p>
            <Link href="/products">
              <Button data-testid="button-browse">Browse Products</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {favorites.map((fav) => {
              const product = fav.product;
              if (!product) return null;

              return (
                <Card key={fav.id} className="group overflow-hidden hover-elevate" data-testid={`card-favorite-${product.id}`}>
                  <div className="relative">
                    <Link href={`/products/${product.slug}`}>
                      <div className="aspect-square overflow-hidden bg-muted">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </Link>
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute top-2 right-2"
                      onClick={() => handleRemove(product.id, product.name)}
                      data-testid={`button-remove-${product.id}`}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="p-4">
                    <Link href={`/products/${product.slug}`}>
                      <h3 className="font-semibold line-clamp-2 mb-2 hover:text-primary" data-testid={`text-product-name-${product.id}`}>
                        {product.name}
                      </h3>
                    </Link>
                    
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
                    
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold" data-testid={`text-price-${product.id}`}>
                        ${product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          ${product.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>
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
