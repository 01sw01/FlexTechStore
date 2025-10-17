import { useEffect, useState } from "react";
import { useRoute, Link } from "wouter";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProductBySlug, clearSelectedProduct } from "@/store/slices/productsSlice";
import { addToCart } from "@/store/slices/cartSlice";
import { addFavorite, removeFavorite } from "@/store/slices/favoritesSlice";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Star, Heart, Truck, Shield, ChevronLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ProductDetails() {
  const [, params] = useRoute("/products/:slug");
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  
  const { selectedProduct: product, loading } = useAppSelector((state) => state.products);
  const { items: cartItems } = useAppSelector((state) => state.cart);
  const { items: favorites } = useAppSelector((state) => state.favorites);
  const { id: userId } = useAppSelector((state) => state.user);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (params?.slug) {
      dispatch(fetchProductBySlug(params.slug));
    }
    return () => {
      dispatch(clearSelectedProduct());
    };
  }, [params?.slug, dispatch]);

  useEffect(() => {
    if (product?.images && product.images.length > 0) {
      setSelectedImage(0);
    }
  }, [product]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header cartItemCount={0} onCartClick={() => {}} />
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-32 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <Skeleton className="aspect-square w-full mb-4" />
              <div className="flex gap-2">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="w-20 h-20" />
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)} onCartClick={() => {}} />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground" data-testid="text-not-found">Product not found</p>
        </div>
      </div>
    );
  }

  const isFavorite = favorites.some(fav => fav.productId === product.id);
  const images = product.images && product.images.length > 0 ? product.images : [product.image];

  const handleAddToCart = () => {
    dispatch(addToCart({ productId: product.id, quantity, userId }));
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleToggleFavorite = () => {
    if (isFavorite) {
      dispatch(removeFavorite({ productId: product.id, userId }));
      toast({
        title: "Removed from favorites",
        description: `${product.name} has been removed from your favorites.`,
      });
    } else {
      dispatch(addFavorite({ productId: product.id, userId }));
      toast({
        title: "Added to favorites",
        description: `${product.name} has been added to your favorites.`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onCartClick={() => {}}
      />

      <div className="container mx-auto px-4 py-8">
        <Link href="/products">
          <Button variant="ghost" className="mb-6" data-testid="button-back">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div>
            <div className="relative aspect-square mb-4 bg-muted rounded-md overflow-hidden">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="object-cover w-full h-full"
                data-testid="img-main-product"
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-colors ${
                      selectedImage === idx ? "border-primary" : "border-transparent"
                    }`}
                    data-testid={`button-thumbnail-${idx}`}
                  >
                    <img src={img} alt={`${product.name} ${idx + 1}`} className="object-cover w-full h-full" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="mb-4">
              {product.brand && (
                <Link href={`/products?brand=${product.brand}`}>
                  <span className="text-sm text-primary hover:underline" data-testid="text-brand">
                    {product.brand}
                  </span>
                </Link>
              )}
              {product.model && (
                <span className="text-sm text-muted-foreground ml-2" data-testid="text-model">
                  Model: {product.model}
                </span>
              )}
            </div>

            <h1 className="text-3xl font-bold mb-4" data-testid="text-product-name">
              {product.name}
            </h1>

            {product.rating && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(parseFloat(product.rating!))
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium" data-testid="text-rating">
                  {product.rating}
                </span>
                <span className="text-sm text-muted-foreground" data-testid="text-review-count">
                  ({product.reviewCount} Reviews)
                </span>
              </div>
            )}

            {product.inStock ? (
              <Badge variant="default" className="mb-4" data-testid="badge-availability">
                <Truck className="h-3 w-3 mr-1" />
                Available to ship
              </Badge>
            ) : (
              <Badge variant="destructive" className="mb-4" data-testid="badge-out-of-stock">
                Out of Stock
              </Badge>
            )}

            <Separator className="my-6" />

            <div className="mb-6">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-4xl font-bold" data-testid="text-price">
                  ${product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-muted-foreground line-through" data-testid="text-original-price">
                    ${product.originalPrice}
                  </span>
                )}
              </div>
              {product.originalPrice && (
                <p className="text-sm text-destructive font-medium" data-testid="text-savings">
                  Save ${(parseFloat(product.originalPrice) - parseFloat(product.price)).toFixed(2)}
                </p>
              )}
            </div>

            <Separator className="my-6" />

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Geek Squad Protection</p>
                  <p className="text-sm text-muted-foreground">See benefits</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mb-6">
              <div className="flex-1">
                <Button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="w-full"
                  size="lg"
                  data-testid="button-add-to-cart"
                >
                  Add to Cart
                </Button>
              </div>
              <Button
                onClick={handleToggleFavorite}
                size="lg"
                variant={isFavorite ? "default" : "outline"}
                data-testid="button-toggle-favorite"
              >
                <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
              </Button>
            </div>

            {product.description && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Overview</h3>
                <p className="text-muted-foreground" data-testid="text-description">
                  {product.description}
                </p>
              </div>
            )}
          </div>
        </div>

        <Tabs defaultValue="details" className="mb-12">
          <TabsList>
            <TabsTrigger value="details" data-testid="tab-details">Details</TabsTrigger>
            <TabsTrigger value="specs" data-testid="tab-specs">Specifications</TabsTrigger>
            {product.features && product.features.length > 0 && (
              <TabsTrigger value="features" data-testid="tab-features">Features</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="details" className="mt-6">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Product Details</h3>
              <p className="text-muted-foreground" data-testid="text-long-description">
                {product.longDescription || product.description}
              </p>
            </Card>
          </TabsContent>

          <TabsContent value="specs" className="mt-6">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Specifications</h3>
              {product.specifications ? (
                <div className="space-y-3">
                  {Object.entries(product.specifications as Record<string, string>).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b last:border-0">
                      <span className="font-medium capitalize" data-testid={`text-spec-label-${key}`}>
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span className="text-muted-foreground" data-testid={`text-spec-value-${key}`}>
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No specifications available</p>
              )}
            </Card>
          </TabsContent>

          {product.features && product.features.length > 0 && (
            <TabsContent value="features" className="mt-6">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Key Features</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2" data-testid={`text-feature-${idx}`}>
                      <span className="text-primary mt-1">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>

      <Footer />
    </div>
  );
}
