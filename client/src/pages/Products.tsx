import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProducts, setFilters, clearFilters } from "@/store/slices/productsSlice";
import { fetchCategories } from "@/store/slices/categoriesSlice";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Star, Heart, SlidersHorizontal } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Products() {
  const dispatch = useAppDispatch();
  const { items: products, loading, filters } = useAppSelector((state) => state.products);
  const { items: categories } = useAppSelector((state) => state.categories);
  const { items: favorites } = useAppSelector((state) => state.favorites);
  const { items: cartItems } = useAppSelector((state) => state.cart);

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        dispatch(setFilters({ ...filters, search: searchQuery }));
        dispatch(fetchProducts({ ...filters, search: searchQuery }));
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleCategoryChange = (categoryId: string) => {
    const newFilters = { ...filters, categoryId: categoryId === "all" ? undefined : categoryId };
    dispatch(setFilters(newFilters));
    dispatch(fetchProducts(newFilters));
  };

  const handlePriceChange = (value: number[]) => {
    setPriceRange([value[0], value[1]]);
    const newFilters = { ...filters, minPrice: value[0], maxPrice: value[1] };
    dispatch(setFilters(newFilters));
    dispatch(fetchProducts(newFilters));
  };

  const handleBrandToggle = (brand: string) => {
    const newBrands = selectedBrands.includes(brand)
      ? selectedBrands.filter(b => b !== brand)
      : [...selectedBrands, brand];
    setSelectedBrands(newBrands);
    
    if (newBrands.length > 0) {
      newBrands.forEach(b => {
        const newFilters = { ...filters, brand: b };
        dispatch(setFilters(newFilters));
        dispatch(fetchProducts(newFilters));
      });
    } else {
      const newFilters = { ...filters, brand: undefined };
      dispatch(setFilters(newFilters));
      dispatch(fetchProducts(newFilters));
    }
  };

  const handleFilterToggle = (key: 'inStock' | 'isOnSale' | 'isNew', value: boolean) => {
    const newFilters = { ...filters, [key]: value };
    dispatch(setFilters(newFilters));
    dispatch(fetchProducts(newFilters));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    dispatch(fetchProducts());
    setPriceRange([0, 2000]);
    setSelectedBrands([]);
    setSearchQuery("");
  };

  const allBrands = Array.from(new Set(products.map(p => p.brand).filter(Boolean))) as string[];

  const FilterContent = () => (
    <div className="space-y-6">
      <div>
        <Label className="text-sm font-medium">Category</Label>
        <Select onValueChange={handleCategoryChange} defaultValue="all">
          <SelectTrigger data-testid="select-category" className="mt-2">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-sm font-medium">Price Range</Label>
        <div className="mt-2 space-y-3">
          <Slider
            min={0}
            max={2000}
            step={50}
            value={priceRange}
            onValueChange={handlePriceChange}
            data-testid="slider-price-range"
          />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span data-testid="text-min-price">${priceRange[0]}</span>
            <span data-testid="text-max-price">${priceRange[1]}</span>
          </div>
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium">Brand</Label>
        <div className="mt-2 space-y-2">
          {allBrands.map((brand) => (
            <div key={brand} className="flex items-center space-x-2">
              <Checkbox
                id={`brand-${brand}`}
                checked={selectedBrands.includes(brand)}
                onCheckedChange={() => handleBrandToggle(brand)}
                data-testid={`checkbox-brand-${brand.toLowerCase()}`}
              />
              <label
                htmlFor={`brand-${brand}`}
                className="text-sm font-normal cursor-pointer"
              >
                {brand}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="in-stock"
            checked={filters.inStock}
            onCheckedChange={(checked) => handleFilterToggle('inStock', checked as boolean)}
            data-testid="checkbox-in-stock"
          />
          <label htmlFor="in-stock" className="text-sm font-normal cursor-pointer">
            In Stock Only
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="on-sale"
            checked={filters.isOnSale}
            onCheckedChange={(checked) => handleFilterToggle('isOnSale', checked as boolean)}
            data-testid="checkbox-on-sale"
          />
          <label htmlFor="on-sale" className="text-sm font-normal cursor-pointer">
            On Sale
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="new-arrivals"
            checked={filters.isNew}
            onCheckedChange={(checked) => handleFilterToggle('isNew', checked as boolean)}
            data-testid="checkbox-new"
          />
          <label htmlFor="new-arrivals" className="text-sm font-normal cursor-pointer">
            New Arrivals
          </label>
        </div>
      </div>

      <Button 
        onClick={handleClearFilters} 
        variant="outline" 
        className="w-full"
        data-testid="button-clear-filters"
      >
        Clear All Filters
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header 
        cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onCartClick={() => {}}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-4" data-testid="text-page-title">Products</h1>
          <div className="flex gap-4">
            <Input
              type="search"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
              data-testid="input-search"
            />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden" data-testid="button-filter-mobile">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FilterContent />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="hidden lg:block">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Filters</h2>
              <FilterContent />
            </Card>
          </div>

          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <Skeleton className="h-48 w-full" />
                    <div className="p-4 space-y-3">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-8 w-full" />
                    </div>
                  </Card>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground" data-testid="text-no-products">No products found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => {
                  const isFavorite = favorites.some(fav => fav.productId === product.id);
                  
                  return (
                    <Card key={product.id} className="group overflow-hidden hover-elevate" data-testid={`card-product-${product.id}`}>
                      <Link href={`/products/${product.slug}`}>
                        <div className="relative aspect-square overflow-hidden bg-muted">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                            data-testid={`img-product-${product.id}`}
                          />
                          {product.isOnSale && product.originalPrice && (
                            <Badge className="absolute top-2 left-2" variant="destructive" data-testid={`badge-sale-${product.id}`}>
                              SALE
                            </Badge>
                          )}
                          {product.isNew && (
                            <Badge className="absolute top-2 left-2" data-testid={`badge-new-${product.id}`}>
                              NEW
                            </Badge>
                          )}
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
                              <span className="text-sm text-muted-foreground" data-testid={`text-reviews-${product.id}`}>
                                ({product.reviewCount})
                              </span>
                            </div>
                          )}
                          
                          <div className="flex items-baseline gap-2 mb-3">
                            <span className="text-2xl font-bold" data-testid={`text-price-${product.id}`}>
                              ${product.price}
                            </span>
                            {product.originalPrice && (
                              <span className="text-sm text-muted-foreground line-through" data-testid={`text-original-price-${product.id}`}>
                                ${product.originalPrice}
                              </span>
                            )}
                          </div>
                          
                          <div className="flex gap-2">
                            <Button 
                              className="flex-1"
                              data-testid={`button-view-details-${product.id}`}
                            >
                              View Details
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
        </div>
      </div>

      <Footer />
    </div>
  );
}
