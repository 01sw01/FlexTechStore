import { Facebook, Twitter, Instagram, Youtube, Mail } from "lucide-react";
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
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary">
                <Mail className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-bold">
                <span className="text-secondary">FLEX</span>
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
              <button className="text-left text-sm text-muted-foreground transition-colors hover:text-foreground">
                About Us
              </button>
              <button className="text-left text-sm text-muted-foreground transition-colors hover:text-foreground">
                Contact Us
              </button>
              <button className="text-left text-sm text-muted-foreground transition-colors hover:text-foreground">
                Track Order
              </button>
              <button className="text-left text-sm text-muted-foreground transition-colors hover:text-foreground">
                Returns
              </button>
            </nav>
          </div>

          <div className="space-y-4">
            <h3 className="font-display text-lg font-semibold">Categories</h3>
            <nav className="flex flex-col gap-2">
              <button className="text-left text-sm text-muted-foreground transition-colors hover:text-foreground">
                Smartphones
              </button>
              <button className="text-left text-sm text-muted-foreground transition-colors hover:text-foreground">
                Laptops
              </button>
              <button className="text-left text-sm text-muted-foreground transition-colors hover:text-foreground">
                Headphones
              </button>
              <button className="text-left text-sm text-muted-foreground transition-colors hover:text-foreground">
                Smartwatches
              </button>
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
          <p>&copy; 2025 Market. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
