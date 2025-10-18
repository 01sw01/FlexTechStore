import { Facebook, Twitter, Instagram, Youtube, ShoppingCart } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = () => {
    console.log("Newsletter subscription:", email);
    setEmail("");
  };

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2" data-testid="logo-footer">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary">
                <ShoppingCart className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-bold">
                <span className="text-foreground">FLEX</span>
                <span className="text-primary">TECH</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your one-stop shop for the latest mobile phones, accessories, and electronics.
            </p>
            <div className="flex gap-2">
              <Button size="icon" variant="ghost" data-testid="social-facebook">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" data-testid="social-twitter">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" data-testid="social-instagram">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" data-testid="social-youtube">
                <Youtube className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-display text-lg font-semibold">Quick Links</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/products">
                <button className="text-left text-sm text-muted-foreground transition-colors hover:text-foreground" data-testid="footer-link-products">
                  Products
                </button>
              </Link>
              <Link href="/contact">
                <button className="text-left text-sm text-muted-foreground transition-colors hover:text-foreground" data-testid="footer-link-contact">
                  Contact Us
                </button>
              </Link>
              <Link href="/orders">
                <button className="text-left text-sm text-muted-foreground transition-colors hover:text-foreground" data-testid="footer-link-track-order">
                  Track Order
                </button>
              </Link>
              <Link href="/deals">
                <button className="text-left text-sm text-muted-foreground transition-colors hover:text-foreground" data-testid="footer-link-deals">
                  Deals
                </button>
              </Link>
            </nav>
          </div>

          <div className="space-y-4">
            <h3 className="font-display text-lg font-semibold">Categories</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/category/mobile-phones">
                <button className="text-left text-sm text-muted-foreground transition-colors hover:text-foreground" data-testid="footer-link-mobile-phones">
                  Mobile Phones
                </button>
              </Link>
              <Link href="/category/accessories">
                <button className="text-left text-sm text-muted-foreground transition-colors hover:text-foreground" data-testid="footer-link-accessories">
                  Accessories
                </button>
              </Link>
              <Link href="/category/headphones-earbuds">
                <button className="text-left text-sm text-muted-foreground transition-colors hover:text-foreground" data-testid="footer-link-headphones">
                  Headphones & Earbuds
                </button>
              </Link>
              <Link href="/category/chargers-cables">
                <button className="text-left text-sm text-muted-foreground transition-colors hover:text-foreground" data-testid="footer-link-chargers">
                  Chargers & Cables
                </button>
              </Link>
            </nav>
          </div>

          <div className="space-y-4">
            <h3 className="font-display text-lg font-semibold">Newsletter</h3>
            <p className="text-sm text-muted-foreground">
              Subscribe to get special offers and updates
            </p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
                data-testid="input-newsletter"
              />
              <Button onClick={handleSubscribe} data-testid="button-subscribe">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 FlexTech. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
