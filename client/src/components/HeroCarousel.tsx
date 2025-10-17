import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  ctaText: string;
  bgColor: string;
}

const slides: Slide[] = [
  {
    id: 1,
    title: "PlayStation VR",
    subtitle: "Bundle includes PS VR Headset, PS Camera",
    ctaText: "LEARN MORE",
    bgColor: "from-blue-600 to-blue-400",
  },
  {
    id: 2,
    title: "Galaxy S24 Ultra",
    subtitle: "The most powerful Galaxy smartphone yet",
    ctaText: "SHOP NOW",
    bgColor: "from-purple-600 to-purple-400",
  },
  {
    id: 3,
    title: "AirPods Pro",
    subtitle: "Active Noise Cancellation for immersive sound",
    ctaText: "BUY NOW",
    bgColor: "from-slate-700 to-slate-500",
  },
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative h-[50vh] w-full overflow-hidden md:h-[60vh]">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-500 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className={`h-full w-full bg-gradient-to-r ${slide.bgColor}`}>
            <div className="mx-auto flex h-full max-w-7xl items-center px-4">
              <div className="max-w-xl space-y-4 text-white md:space-y-6">
                <h1 className="font-display text-4xl font-bold md:text-5xl lg:text-6xl">
                  {slide.title}
                </h1>
                <p className="text-lg md:text-xl">{slide.subtitle}</p>
                <Button
                  size="lg"
                  data-testid={`button-cta-${index}`}
                  onClick={() => console.log(`CTA clicked: ${slide.ctaText}`)}
                >
                  {slide.ctaText}
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}

      <Button
        size="icon"
        variant="ghost"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/20 text-white backdrop-blur-sm hover:bg-black/40"
        onClick={prevSlide}
        data-testid="button-prev-slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>

      <Button
        size="icon"
        variant="ghost"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/20 text-white backdrop-blur-sm hover:bg-black/40"
        onClick={nextSlide}
        data-testid="button-next-slide"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentSlide ? "w-8 bg-primary" : "w-2 bg-white/50"
            }`}
            data-testid={`button-dot-${index}`}
          />
        ))}
      </div>
    </div>
  );
}
