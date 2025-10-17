import { Star, Heart, Eye, ShoppingCart } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface ProductCardProps {
  id: number;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  inStock: boolean;
  badge?: string;
  badgeVariant?: "default" | "destructive";
}

export default function ProductCard({
  id,
  name,
  image,
  price,
  originalPrice,
  rating,
  reviews,
  inStock,
  badge,
  badgeVariant = "default",
}: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);

  const handleAddToCart = () => {
    console.log(`Added to cart: ${name}`);
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    console.log(`Wishlist toggled for: ${name}`);
  };

  const handleQuickView = () => {
    console.log(`Quick view: ${name}`);
  };

  return (
    <Card
      className="group relative overflow-hidden transition-all hover-elevate"
      onMouseEnter={() => setShowQuickActions(true)}
      onMouseLeave={() => setShowQuickActions(false)}
      data-testid={`product-card-${id}`}
    >
      <div className="relative aspect-square overflow-hidden bg-card">
        {badge && (
          <Badge
            variant={badgeVariant}
            className="absolute left-2 top-2 z-10"
            data-testid={`badge-${id}`}
          >
            {badge}
          </Badge>
        )}

        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        <div
          className={`absolute right-2 top-2 flex flex-col gap-2 transition-opacity duration-200 ${
            showQuickActions ? "opacity-100" : "opacity-0"
          }`}
        >
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8"
            onClick={handleWishlist}
            data-testid={`button-wishlist-${id}`}
          >
            <Heart className={`h-4 w-4 ${isWishlisted ? "fill-destructive text-destructive" : ""}`} />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8"
            onClick={handleQuickView}
            data-testid={`button-quickview-${id}`}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <CardContent className="space-y-2 p-4">
        <h3 className="line-clamp-2 text-sm font-medium md:text-base" data-testid={`text-name-${id}`}>
          {name}
        </h3>

        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-3 w-3 ${
                i < Math.floor(rating) ? "fill-primary text-primary" : "fill-muted text-muted"
              }`}
            />
          ))}
          <span className="ml-1 text-xs text-muted-foreground">({reviews})</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-primary md:text-xl" data-testid={`text-price-${id}`}>
            ${price.toFixed(2)}
          </span>
          {originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ${originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        <div className="text-xs">
          {inStock ? (
            <span className="text-green-500" data-testid={`status-stock-${id}`}>
              In Stock
            </span>
          ) : (
            <span className="text-destructive">Out of Stock</span>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full"
          onClick={handleAddToCart}
          disabled={!inStock}
          data-testid={`button-add-cart-${id}`}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
