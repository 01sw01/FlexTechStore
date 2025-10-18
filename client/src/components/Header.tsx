import { ShoppingCart, Search, User, Heart, ChevronDown } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProducts, setFilters } from "@/store/slices/productsSlice";
import { fetchCategories } from "@/store/slices/categoriesSlice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  cartItemCount?: number;
  onCartClick?: () => void;
}

export default function Header({ cartItemCount = 0, onCartClick }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [, setLocation] = useLocation();
  const dispatch = useAppDispatch();
  const { items: favorites } = useAppSelector((state) => state.favorites);
  const { items: categories } = useAppSelector((state) => state.categories);

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      dispatch(setFilters({ search: searchQuery }));
      dispatch(fetchProducts({ search: searchQuery }));
      setLocation("/products");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Get top-level categories (no parent)
  const topCategories = categories.filter(cat => !cat.parentId);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="bg-primary px-4 py-2 text-center text-sm">
        <span className="text-primary-foreground">Welcome to FlexTech Store!</span>
        <span className="ml-4 text-primary-foreground/90">Free shipping on orders over $50</span>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer" data-testid="logo-header">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary">
                <ShoppingCart className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-bold md:text-2xl">
                <span className="text-foreground">FLEX</span>
                <span className="text-primary">TECH</span>
              </span>
            </div>
          </Link>

          <div className="hidden flex-1 md:flex md:max-w-2xl md:items-center md:gap-2">
            <div className="relative flex-1">
              <Input
                type="search"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyPress}
                className="pr-10"
                data-testid="input-search"
              />
              <Button
                size="icon"
                className="absolute right-0 top-0"
                onClick={handleSearch}
                data-testid="button-search"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/favorites">
              <Button
                size="icon"
                variant="ghost"
                className="hidden md:flex relative"
                data-testid="button-wishlist"
              >
                <Heart className="h-5 w-5" />
                {favorites.length > 0 && (
                  <Badge
                    className="absolute -right-1 -top-1 h-5 min-w-5 justify-center px-1 text-xs"
                    data-testid="badge-favorites-count"
                  >
                    {favorites.length}
                  </Badge>
                )}
              </Button>
            </Link>
            <Button
              size="icon"
              variant="ghost"
              className="hidden md:flex"
              data-testid="button-account"
            >
              <User className="h-5 w-5" />
            </Button>
            <Link href="/cart">
              <Button
                size="icon"
                variant="ghost"
                className="relative"
                data-testid="button-cart"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <Badge
                    className="absolute -right-1 -top-1 h-5 min-w-5 justify-center px-1 text-xs"
                    data-testid="badge-cart-count"
                  >
                    {cartItemCount}
                  </Badge>
                )}
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-3 flex md:hidden">
          <div className="relative flex-1">
            <Input
              type="search"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyPress}
              className="pr-10"
              data-testid="input-search-mobile"
            />
            <Button
              size="icon"
              className="absolute right-0 top-0"
              onClick={handleSearch}
              data-testid="button-search-mobile"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <nav className="hidden border-t border-border bg-muted/30 md:block">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-center gap-6 py-3">
            <Link href="/">
              <Button variant="ghost" size="sm" data-testid="nav-home">
                HOME
              </Button>
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" data-testid="nav-categories">
                  CATEGORIES
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-56">
                {topCategories.map((category) => (
                  <DropdownMenuItem key={category.id} asChild>
                    <Link href={`/category/${category.slug}`}>
                      <button className="w-full text-left" data-testid={`nav-category-${category.slug}`}>
                        {category.name}
                      </button>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/products">
              <Button variant="ghost" size="sm" data-testid="nav-products">
                PRODUCTS
              </Button>
            </Link>
            <Link href="/deals">
              <Button variant="ghost" size="sm" data-testid="nav-deals">
                DEALS
              </Button>
            </Link>
            <Link href="/favorites">
              <Button variant="ghost" size="sm" data-testid="nav-favorites">
                FAVORITES
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="ghost" size="sm" data-testid="nav-contact">
                CONTACT US
              </Button>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
