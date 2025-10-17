import { useEffect, useState } from "react";
import { useRoute, Link } from "wouter";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCategoryBySlug } from "@/store/slices/categoriesSlice";
import { fetchProducts } from "@/store/slices/productsSlice";
import { addToCart } from "@/store/slices/cartSlice";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, X, ShoppingCart, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ShoppingCartSheet from "@/components/ShoppingCartSheet";
import type { Product } from "@shared/schema";

export default function CategoryPage() {
  const [, params] = useRoute("/category/:slug");
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  
  const { selectedCategory, loading: categoryLoading } = useAppSelector((state) => state.categories);
  const { items: products, loading: productsLoading } = useAppSelector((state) => state.products);
  const { items: cartItems } = useAppSelector((state) => state.cart);
  const { id: userId } = useAppSelector((state) => state.user);

  const [compareProducts, setCompareProducts] = useState<Product[]>([]);
  const [compareDialogOpen, setCompareDialogOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

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
      } else {
        toast({
          title: "Maximum reached",
          description: "You can compare up to 4 products at a time.",
          variant: "destructive",
        });
      }
    }
  };

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart({
      productId: product.id,
      quantity: 1,
      userId,
    }));
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
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
        <Header cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)} onCartClick={() => setCartOpen(true)} />
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
        onCartClick={() => setCartOpen(true)}
      />

      {/* Hero Banner */}
      <div className="relative h-64 md:h-80 bg-gradient-to-br from-primary via-primary to-primary/80 overflow-hidden">
        {selectedCategory.image && (
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{ backgroundImage: `url(${selectedCategory.image})` }}
          />
        )}
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center">
          <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-4" data-testid="text-category-name">
            {selectedCategory.name}
          </h1>
          {selectedCategory.description && (
            <p className="text-lg md:text-xl text-primary-foreground/90 max-w-3xl" data-testid="text-category-description">
              {selectedCategory.description}
            </p>
          )}
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-8">
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products in this category</p>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {products.length} {products.length === 1 ? 'product' : 'products'} available
              </p>
              {compareProducts.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  {compareProducts.length} selected for comparison
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="group relative overflow-hidden hover-elevate transition-all" data-testid={`card-product-${product.id}`}>
                  {/* Comparison Checkbox */}
                  <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
                    <div className="flex items-center gap-2 bg-background/95 backdrop-blur-sm rounded-md p-2 shadow-sm">
                      <Checkbox
                        checked={isComparing(product.id)}
                        onCheckedChange={() => handleCompareToggle(product)}
                        disabled={!isComparing(product.id) && compareProducts.length >= 4}
                        data-testid={`checkbox-compare-${product.id}`}
                      />
                      <span className="text-xs font-medium">Compare</span>
                    </div>
                  </div>

                  {/* Sale Badge */}
                  {product.isOnSale && product.originalPrice && (
                    <Badge className="absolute top-3 right-3 z-10" variant="destructive">
                      SALE
                    </Badge>
                  )}

                  {/* Product Image */}
                  <Link href={`/products/${product.slug}`}>
                    <div className="aspect-square overflow-hidden bg-muted cursor-pointer">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </Link>

                  {/* Product Info */}
                  <div className="p-4 space-y-3">
                    <Link href={`/products/${product.slug}`}>
                      <h3 className="font-semibold line-clamp-2 hover:text-primary cursor-pointer" data-testid={`text-product-name-${product.id}`}>
                        {product.name}
                      </h3>
                    </Link>
                    
                    {/* Rating */}
                    {product.rating && (
                      <div className="flex items-center gap-2">
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
                          ({product.reviewCount || 0})
                        </span>
                      </div>
                    )}
                    
                    {/* Price */}
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

                    {/* Stock Status */}
                    {product.inStock ? (
                      <div className="flex items-center gap-1 text-sm text-green-600">
                        <Check className="h-4 w-4" />
                        <span>In Stock</span>
                      </div>
                    ) : (
                      <p className="text-sm text-destructive">Out of Stock</p>
                    )}

                    {/* Add to Cart Button */}
                    <Button 
                      className="w-full" 
                      onClick={() => handleAddToCart(product)}
                      disabled={!product.inStock}
                      data-testid={`button-add-cart-${product.id}`}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Floating Compare Bar */}
      {compareProducts.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-lg z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1 overflow-x-auto">
                <p className="font-semibold whitespace-nowrap">
                  Compare ({compareProducts.length}/4)
                </p>
                <div className="flex gap-2">
                  {compareProducts.map((product) => (
                    <div key={product.id} className="relative">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-16 w-16 object-cover rounded border"
                      />
                      <Button
                        size="icon"
                        variant="destructive"
                        className="absolute -top-2 -right-2 h-5 w-5 rounded-full"
                        onClick={() => handleCompareToggle(product)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCompareProducts([])}
                >
                  Clear All
                </Button>
                <Button
                  onClick={() => setCompareDialogOpen(true)}
                  disabled={compareProducts.length < 2}
                  data-testid="button-compare-now"
                >
                  Compare Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comparison Dialog */}
      <Dialog open={compareDialogOpen} onOpenChange={setCompareDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-2xl">Product Comparison</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[70vh]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-48 sticky left-0 bg-background z-10">Specification</TableHead>
                  {compareProducts.map((product) => (
                    <TableHead key={product.id} className="min-w-64" data-testid={`table-header-${product.id}`}>
                      <div className="space-y-2">
                        <img src={product.image} alt={product.name} className="w-full h-32 object-cover rounded" />
                        <p className="font-semibold">{product.name}</p>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleCompareToggle(product)}
                          data-testid={`button-remove-compare-${product.id}`}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="bg-muted/50">
                  <TableCell className="font-medium sticky left-0 bg-muted/50 z-10">Price</TableCell>
                  {compareProducts.map((product) => (
                    <TableCell key={product.id} data-testid={`table-price-${product.id}`}>
                      <div className="space-y-1">
                        <p className="text-2xl font-bold">${product.price}</p>
                        {product.originalPrice && (
                          <p className="text-sm text-muted-foreground line-through">
                            ${product.originalPrice}
                          </p>
                        )}
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium sticky left-0 bg-background z-10">Rating</TableCell>
                  {compareProducts.map((product) => (
                    <TableCell key={product.id}>
                      {product.rating && (
                        <div className="flex items-center gap-2">
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
                          <span className="text-sm">({product.reviewCount})</span>
                        </div>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow className="bg-muted/50">
                  <TableCell className="font-medium sticky left-0 bg-muted/50 z-10">Availability</TableCell>
                  {compareProducts.map((product) => (
                    <TableCell key={product.id}>
                      {product.inStock ? (
                        <Badge variant="default" className="bg-green-600">In Stock</Badge>
                      ) : (
                        <Badge variant="destructive">Out of Stock</Badge>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
                {allSpecKeys.map((key, index) => (
                  <TableRow key={key} className={index % 2 === 0 ? "" : "bg-muted/50"}>
                    <TableCell className={`font-medium capitalize sticky left-0 z-10 ${index % 2 === 0 ? "bg-background" : "bg-muted/50"}`}>
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

      <Footer />
      
      <ShoppingCartSheet
        open={cartOpen}
        onOpenChange={setCartOpen}
      />
    </div>
  );
}
