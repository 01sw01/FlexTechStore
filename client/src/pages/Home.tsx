import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProducts } from "@/store/slices/productsSlice";
import { fetchCategories } from "@/store/slices/categoriesSlice";
import { fetchCart } from "@/store/slices/cartSlice";
import { fetchFavorites } from "@/store/slices/favoritesSlice";
import Header from "@/components/Header";
import HeroCarousel from "@/components/HeroCarousel";
import CategoryNav from "@/components/CategoryNav";
import SpecialOffers from "@/components/SpecialOffers";
import ProductSection from "@/components/ProductSection";
import Footer from "@/components/Footer";
import ShoppingCartSheet from "@/components/ShoppingCartSheet";

export default function Home() {
  const dispatch = useAppDispatch();
  const [cartOpen, setCartOpen] = useState(false);
  
  const { items: products } = useAppSelector((state) => state.products);
  const { items: cartItems } = useAppSelector((state) => state.cart);
  const { id: userId } = useAppSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
    dispatch(fetchCart(userId));
    dispatch(fetchFavorites(userId));
  }, [dispatch, userId]);

  const newArrivals = products.filter(p => p.isNew).slice(0, 5);
  const featuredProducts = products.filter(p => p.isFeatured).slice(0, 5);
  const bestSelling = products.filter(p => p.reviewCount && p.reviewCount > 100).slice(0, 5);

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
        {newArrivals.length > 0 && (
          <ProductSection
            title="New Arrivals"
            products={newArrivals}
            onViewAll={() => window.location.href = "/products?isNew=true"}
          />
        )}
        {featuredProducts.length > 0 && (
          <ProductSection
            title="Featured Products"
            products={featuredProducts}
            onViewAll={() => window.location.href = "/products?isFeatured=true"}
          />
        )}
        {bestSelling.length > 0 && (
          <ProductSection
            title="Best Selling Products"
            products={bestSelling}
            onViewAll={() => window.location.href = "/products"}
          />
        )}
      </main>

      <Footer />

      <ShoppingCartSheet
        open={cartOpen}
        onOpenChange={setCartOpen}
      />
    </div>
  );
}
