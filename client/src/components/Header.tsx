import { ShoppingCart, Search, User, Heart, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface HeaderProps {
  cartItemCount?: number;
  onCartClick?: () => void;
  onMenuClick?: () => void;
}

export default function Header({ cartItemCount = 0, onCartClick, onMenuClick }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");

  const handleSearch = () => {
    console.log("Search triggered:", { query: searchQuery, category });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="bg-muted px-4 py-2 text-center text-sm">
        <span className="text-muted-foreground">Welcome to Market Store!</span>
        <span className="ml-4 text-foreground">Free shipping on orders over $50</span>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <Button
            size="icon"
            variant="ghost"
            className="md:hidden"
            onClick={onMenuClick}
            data-testid="button-menu"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary">
              <ShoppingCart className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold md:text-2xl">
              <span className="text-secondary">FLEX</span>
              <span className="text-primary">TECH</span>
            </span>
          </div>

          <div className="hidden flex-1 md:flex md:max-w-2xl md:items-center md:gap-2">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-[140px]" data-testid="select-category">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="phones">Phones</SelectItem>
                <SelectItem value="laptops">Laptops</SelectItem>
                <SelectItem value="headphones">Headphones</SelectItem>
                <SelectItem value="smartwatches">Smartwatches</SelectItem>
                <SelectItem value="cameras">Cameras</SelectItem>
              </SelectContent>
            </Select>

            <div className="relative flex-1">
              <Input
                type="search"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
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
            <Button
              size="icon"
              variant="ghost"
              className="hidden md:flex"
              data-testid="button-wishlist"
            >
              <Heart className="h-5 w-5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="hidden md:flex"
              data-testid="button-account"
            >
              <User className="h-5 w-5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="relative"
              onClick={onCartClick}
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
          </div>
        </div>

        <div className="mt-3 flex md:hidden">
          <div className="relative flex-1">
            <Input
              type="search"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
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
            <Button variant="ghost" size="sm" data-testid="nav-home">
              HOME
            </Button>
            <Button variant="ghost" size="sm" data-testid="nav-shop">
              SHOP
            </Button>
            <Button variant="ghost" size="sm" data-testid="nav-features">
              FEATURES
            </Button>
            <Button variant="ghost" size="sm" data-testid="nav-about">
              ABOUT US
            </Button>
            <Button variant="ghost" size="sm" data-testid="nav-contact">
              CONTACT US
            </Button>
            <Button variant="ghost" size="sm" data-testid="nav-blog">
              BLOG
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
}
