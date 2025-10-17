import { useEffect, useState } from "react";
import { useRoute, Link } from "wouter";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCategoryBySlug } from "@/store/slices/categoriesSlice";
import { fetchProducts } from "@/store/slices/productsSlice";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, X } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Product } from "@shared/schema";

export default function CategoryPage() {
  const [, params] = useRoute("/category/:slug");
  const dispatch = useAppDispatch();
  
  const { selectedCategory, loading: categoryLoading } = useAppSelector((state) => state.categories);
  const { items: products, loading: productsLoading } = useAppSelector((state) => state.products);
  const { items: cartItems } = useAppSelector((state) => state.cart);

  const [compareProducts, setCompareProducts] = useState<Product[]>([]);
  const [compareDialogOpen, setCompareDialogOpen] = useState(false);

  useEffect(() => {
    if (params?.slug) {
      dispatch(fetchCategoryBySlug(params.slug));
    }
  }, [params?.slug, dispatch]);

  useEffect(() => {
    if (selectedCategory) {
      dispatch(fetchProducts({ categoryId: selectedCategory.id }));
    }
  }, [selectedCategory, dispatch]);

  const handleCompareToggle = (product: Product) => {
    if (compareProducts.find(p => p.id === product.id)) {
      setCompareProducts(compareProducts.filter(p => p.id !== product.id));
    } else {
      if (compareProducts.length < 4) {
        setCompareProducts([...compareProducts, product]);
      }
    }
  };

  const isComparing = (productId: string) => compareProducts.some(p => p.id === productId);

  const getSpecValue = (product: Product, key: string) => {
    if (product.specifications && typeof product.specifications === 'object') {
      return (product.specifications as Record<string, string>)[key] || '-';
    }
    return '-';
  };

  const allSpecKeys = Array.from(
    new Set(
      compareProducts.flatMap(p => 
        p.specifications && typeof p.specifications === 'object' 
          ? Object.keys(p.specifications as Record<string, string>)
          : []
      )
    )
  );

  const loading = categoryLoading || productsLoading;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header cartItemCount={0} onCartClick={() => {}} />
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-64 w-full mb-8" />
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-96" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!selectedCategory) {
    return (
      <div className="min-h-screen bg-background">
        <Header cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)} onCartClick={() => {}} />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">Category not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onCartClick={() => {}}
      />

      {selectedCategory.image && (
        <div className="relative h-64 md:h-96 bg-gradient-to-r from-primary/90 to-primary overflow-hidden">
          <img 
            src={selectedCategory.image} 
            alt={selectedCategory.name}
            className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30"
          />
          <div className="relative container mx-auto px-4 h-full flex flex-col justify-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4" data-testid="text-category-name">
              {selectedCategory.name}
            </h1>
            {selectedCategory.description && (
              <p className="text-lg text-white/90 max-w-2xl" data-testid="text-category-description">
                {selectedCategory.description}
              </p>
            )}
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold" data-testid="text-products-title">
            Products in {selectedCategory.name}
          </h2>
          {compareProducts.length > 0 && (
            <Dialog open={compareDialogOpen} onOpenChange={setCompareDialogOpen}>
              <DialogTrigger asChild>
                <Button data-testid="button-compare">
                  Compare ({compareProducts.length})
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-6xl max-h-[90vh]">
                <DialogHeader>
                  <DialogTitle>Product Comparison</DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-[70vh]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-48">Specification</TableHead>
                        {compareProducts.map((product) => (
                          <TableHead key={product.id} data-testid={`table-header-${product.id}`}>
                            <div className="flex items-start justify-between gap-2">
                              <span className="font-semibold">{product.name}</span>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleCompareToggle(product)}
                                data-testid={`button-remove-compare-${product.id}`}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Image</TableCell>
                        {compareProducts.map((product) => (
                          <TableCell key={product.id}>
                            <img src={product.image} alt={product.name} className="w-32 h-32 object-cover rounded" />
                          </TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Price</TableCell>
                        {compareProducts.map((product) => (
                          <TableCell key={product.id} data-testid={`table-price-${product.id}`}>
                            <div className="flex flex-col">
                              <span className="text-xl font-bold">${product.price}</span>
                              {product.originalPrice && (
                                <span className="text-sm text-muted-foreground line-through">
                                  ${product.originalPrice}
                                </span>
                              )}
                            </div>
                          </TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Rating</TableCell>
                        {compareProducts.map((product) => (
                          <TableCell key={product.id}>
                            {product.rating && (
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span>{product.rating}</span>
                              </div>
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                      {allSpecKeys.map((key) => (
                        <TableRow key={key}>
                          <TableCell className="font-medium capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </TableCell>
                          {compareProducts.map((product) => (
                            <TableCell key={product.id} data-testid={`table-spec-${key}-${product.id}`}>
                              {getSpecValue(product, key)}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products in this category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="group overflow-hidden hover-elevate" data-testid={`card-product-${product.id}`}>
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
                  <div className="absolute top-2 right-2">
                    <Checkbox
                      checked={isComparing(product.id)}
                      onCheckedChange={() => handleCompareToggle(product)}
                      disabled={!isComparing(product.id) && compareProducts.length >= 4}
                      className="bg-background"
                      data-testid={`checkbox-compare-${product.id}`}
                    />
                  </div>
                  {product.isOnSale && product.originalPrice && (
                    <Badge className="absolute top-2 left-2" variant="destructive">
                      SALE
                    </Badge>
                  )}
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
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
