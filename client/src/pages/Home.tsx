import { useState } from "react";
import Header from "@/components/Header";
import HeroCarousel from "@/components/HeroCarousel";
import CategoryNav from "@/components/CategoryNav";
import SpecialOffers from "@/components/SpecialOffers";
import ProductSection from "@/components/ProductSection";
import Footer from "@/components/Footer";
import ShoppingCartSheet from "@/components/ShoppingCartSheet";

export default function Home() {
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "iPhone 15 Pro Max 256GB",
      image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=100&h=100&fit=crop",
      price: 1199,
      quantity: 1,
    },
    {
      id: 2,
      name: "Sony WH-1000XM5 Headphones",
      image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=100&h=100&fit=crop",
      price: 399,
      quantity: 2,
    },
  ]);

  const handleUpdateQuantity = (id: number, quantity: number) => {
    setCartItems(cartItems.map((item) => (item.id === id ? { ...item, quantity } : item)));
  };

  const handleRemoveItem = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const newArrivals = [
    {
      id: 1,
      name: "Sony A7 III Digital Camera",
      image: "https://images.unsplash.com/photo-1606980707085-1e876f190883?w=400&h=400&fit=crop",
      price: 1999,
      originalPrice: 2399,
      rating: 4.5,
      reviews: 89,
      inStock: true,
      badge: "SALE",
      badgeVariant: "destructive" as const,
    },
    {
      id: 2,
      name: "iPhone 15 Pro Max 256GB",
      image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop",
      price: 1199,
      rating: 5,
      reviews: 234,
      inStock: true,
      badge: "NEW",
    },
    {
      id: 3,
      name: "Samsung Galaxy Watch 6",
      image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400&h=400&fit=crop",
      price: 349,
      originalPrice: 449,
      rating: 4,
      reviews: 67,
      inStock: true,
    },
    {
      id: 4,
      name: "Sony WH-1000XM5 Headphones",
      image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&h=400&fit=crop",
      price: 399,
      rating: 5,
      reviews: 412,
      inStock: true,
    },
    {
      id: 5,
      name: "MacBook Pro M3 14-inch",
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop",
      price: 1999,
      rating: 5,
      reviews: 156,
      inStock: true,
    },
  ];

  const featuredProducts = [
    {
      id: 11,
      name: "iPad Pro 12.9-inch M2",
      image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop",
      price: 1099,
      rating: 5,
      reviews: 189,
      inStock: true,
    },
    {
      id: 12,
      name: "Samsung Galaxy S24 Ultra",
      image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop",
      price: 1299,
      rating: 4.5,
      reviews: 245,
      inStock: true,
      badge: "NEW",
    },
    {
      id: 13,
      name: "Apple Watch Series 9",
      image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&h=400&fit=crop",
      price: 429,
      rating: 4.5,
      reviews: 321,
      inStock: true,
    },
    {
      id: 14,
      name: "Bose QuietComfort Ultra",
      image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&h=400&fit=crop",
      price: 429,
      originalPrice: 499,
      rating: 4.5,
      reviews: 178,
      inStock: true,
      badge: "SALE",
      badgeVariant: "destructive" as const,
    },
    {
      id: 15,
      name: "Dell XPS 15",
      image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=400&fit=crop",
      price: 1799,
      rating: 4,
      reviews: 92,
      inStock: true,
    },
  ];

  const bestSelling = [
    {
      id: 21,
      name: "AirPods Pro (2nd Gen)",
      image: "https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=400&h=400&fit=crop",
      price: 249,
      rating: 5,
      reviews: 567,
      inStock: true,
    },
    {
      id: 22,
      name: "Google Pixel 8 Pro",
      image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop",
      price: 999,
      rating: 4.5,
      reviews: 203,
      inStock: true,
    },
    {
      id: 23,
      name: "Garmin Forerunner 965",
      image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400&h=400&fit=crop",
      price: 599,
      rating: 5,
      reviews: 134,
      inStock: true,
    },
    {
      id: 24,
      name: "JBL Flip 6",
      image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop",
      price: 129,
      originalPrice: 149,
      rating: 4.5,
      reviews: 789,
      inStock: true,
      badge: "SALE",
      badgeVariant: "destructive" as const,
    },
    {
      id: 25,
      name: "Microsoft Surface Pro 9",
      image: "https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=400&h=400&fit=crop",
      price: 1299,
      rating: 4,
      reviews: 145,
      inStock: true,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header
        cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onCartClick={() => setCartOpen(true)}
      />

      <main>
        <HeroCarousel />
        <CategoryNav />
        <SpecialOffers />
        <ProductSection
          title="New Arrivals"
          products={newArrivals}
          onViewAll={() => console.log("View all new arrivals")}
        />
        <ProductSection
          title="Featured Products"
          products={featuredProducts}
          onViewAll={() => console.log("View all featured products")}
        />
        <ProductSection
          title="Best Selling Products"
          products={bestSelling}
          onViewAll={() => console.log("View all best selling products")}
        />
      </main>

      <Footer />

      <ShoppingCartSheet
        open={cartOpen}
        onOpenChange={setCartOpen}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />
    </div>
  );
}
