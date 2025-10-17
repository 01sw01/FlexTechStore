import ProductCard from "../ProductCard";

export default function ProductCardExample() {
  return (
    <div className="grid grid-cols-2 gap-4 p-4 md:grid-cols-3 lg:grid-cols-4">
      <ProductCard
        id={1}
        name="Sony A7 III Digital Camera"
        image="https://images.unsplash.com/photo-1606980707085-1e876f190883?w=400&h=400&fit=crop"
        price={1999}
        originalPrice={2399}
        rating={4.5}
        reviews={89}
        inStock={true}
        badge="SALE"
        badgeVariant="destructive"
      />
      <ProductCard
        id={2}
        name="iPhone 15 Pro Max 256GB"
        image="https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop"
        price={1199}
        rating={5}
        reviews={234}
        inStock={true}
        badge="NEW"
      />
      <ProductCard
        id={3}
        name="Samsung Galaxy Watch 6"
        image="https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400&h=400&fit=crop"
        price={349}
        originalPrice={449}
        rating={4}
        reviews={67}
        inStock={true}
      />
      <ProductCard
        id={4}
        name="Sony WH-1000XM5 Headphones"
        image="https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&h=400&fit=crop"
        price={399}
        rating={5}
        reviews={412}
        inStock={false}
      />
    </div>
  );
}
