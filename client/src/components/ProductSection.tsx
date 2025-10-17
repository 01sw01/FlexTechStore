import ProductCard from "./ProductCard";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Product {
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

interface ProductSectionProps {
  title: string;
  products: Product[];
  onViewAll?: () => void;
}

export default function ProductSection({ title, products, onViewAll }: ProductSectionProps) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold md:text-3xl">{title}</h2>
        {onViewAll && (
          <Button
            variant="ghost"
            onClick={onViewAll}
            className="gap-1"
            data-testid="button-view-all"
          >
            View All
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </div>
  );
}
