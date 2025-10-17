import { useState } from "react";
import ShoppingCartSheet from "../ShoppingCartSheet";
import { Button } from "@/components/ui/button";

export default function ShoppingCartSheetExample() {
  const [open, setOpen] = useState(true);
  const [items, setItems] = useState([
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
    setItems(items.map((item) => (item.id === id ? { ...item, quantity } : item)));
  };

  const handleRemoveItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <div>
      <Button onClick={() => setOpen(true)}>Open Cart</Button>
      <ShoppingCartSheet
        open={open}
        onOpenChange={setOpen}
        items={items}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />
    </div>
  );
}
