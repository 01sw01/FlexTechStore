import { useEffect } from "react";
import { Link } from "wouter";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCategories } from "@/store/slices/categoriesSlice";
import { Smartphone, Headphones, Cable, ShieldCheck, Package } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const getCategoryIcon = (slug: string) => {
  switch (slug) {
    case "mobile-phones":
      return Smartphone;
    case "headphones-earbuds":
      return Headphones;
    case "chargers-cables":
      return Cable;
    case "cases-protection":
      return ShieldCheck;
    default:
      return Package;
  }
};

export default function CategoryNav() {
  const dispatch = useAppDispatch();
  const { items: categories, loading } = useAppSelector((state) => state.categories);

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-3 gap-4 md:grid-cols-4 lg:grid-cols-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      </div>
    );
  }

  // Only show top-level categories (those without a parent)
  const topCategories = categories.filter(cat => !cat.parentId);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {topCategories.map((category) => {
          const Icon = getCategoryIcon(category.slug);
          return (
            <Link key={category.id} href={`/category/${category.slug}`}>
              <Card
                className="group cursor-pointer overflow-hidden hover-elevate active-elevate-2 transition-all"
                data-testid={`category-${category.slug}`}
              >
                <div className="relative aspect-square">
                  <img
                    src={category.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop"}
                    alt={category.name}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex items-center gap-2 text-white">
                      <Icon className="h-5 w-5" />
                      <span className="font-semibold">{category.name}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
