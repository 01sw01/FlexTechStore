import { Smartphone, Headphones, Watch, Battery, Cable, Camera, Laptop, Speaker } from "lucide-react";
import { Card } from "@/components/ui/card";

const categories = [
  { id: 1, name: "Smartphones", icon: Smartphone },
  { id: 2, name: "Laptops", icon: Laptop },
  { id: 3, name: "Headphones", icon: Headphones },
  { id: 4, name: "Smartwatches", icon: Watch },
  { id: 5, name: "Cameras", icon: Camera },
  { id: 6, name: "Speakers", icon: Speaker },
  { id: 7, name: "Chargers", icon: Battery },
  { id: 8, name: "Cables", icon: Cable },
];

export default function CategoryNav() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="grid grid-cols-3 gap-4 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
        {categories.map((category) => (
          <Card
            key={category.id}
            className="group cursor-pointer p-4 transition-all hover-elevate active-elevate-2"
            onClick={() => console.log(`Category clicked: ${category.name}`)}
            data-testid={`category-${category.id}`}
          >
            <div className="flex flex-col items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 md:h-16 md:w-16">
                <category.icon className="h-6 w-6 text-primary md:h-8 md:w-8" />
              </div>
              <span className="text-center text-xs font-medium md:text-sm">{category.name}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
