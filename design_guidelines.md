# Design Guidelines: Mobile & Accessories Ecommerce Store

## Design Approach

**Selected Approach:** Reference-Based (E-commerce Leaders)
Drawing inspiration from Shopify's product presentation, Amazon's information density, and the reference image's vibrant yellow/dark aesthetic. This approach suits the visual-rich, experience-focused nature of electronics retail where product appeal and trust drive conversions.

**Key Design Principles:**
- High-contrast visual hierarchy to guide purchasing decisions
- Product-first layouts with clear pricing and availability
- Trust signals through ratings, reviews, and promotional badges
- Vibrant accent colors to create urgency and highlight deals

## Core Design Elements

### A. Color Palette

**Dark Mode Primary:**
- Background Primary: 20 8% 12% (deep charcoal)
- Background Secondary: 25 10% 18% (elevated surfaces, cards)
- Background Tertiary: 30 12% 22% (hover states, subtle divisions)

**Yellow Accent System:**
- Primary Yellow: 45 95% 55% (CTAs, promotional banners, "Add to Cart" buttons)
- Yellow Hover: 45 95% 48% (interactive states)
- Yellow Muted: 45 80% 65% (badges, labels, countdown timers)

**Semantic Colors:**
- Success Green: 142 70% 45% (in stock, success messages)
- Alert Red: 0 85% 60% (sale badges, low stock warnings)
- Info Blue: 210 90% 55% (new arrival badges)

**Text Hierarchy:**
- Primary Text: 0 0% 95% (headings, product names)
- Secondary Text: 0 0% 70% (descriptions, metadata)
- Muted Text: 0 0% 50% (helper text, labels)

### B. Typography

**Font Families:**
- Primary: 'Inter' (Google Fonts) - UI elements, product info, navigation
- Display: 'Poppins' (Google Fonts) - Headings, promotional text, category titles

**Type Scale:**
- Hero Headings: text-5xl md:text-6xl, font-bold, Poppins
- Section Headings: text-3xl md:text-4xl, font-semibold, Poppins
- Product Names: text-lg md:text-xl, font-medium, Inter
- Body Text: text-base, font-normal, Inter
- Price (Large): text-2xl md:text-3xl, font-bold, Inter
- Price (Regular): text-lg, font-semibold, Inter
- Metadata: text-sm, font-normal, Inter

### C. Layout System

**Spacing Primitives:** Use Tailwind units of 4, 6, 8, 12, 16, 20 for consistent rhythm
- Component padding: p-4 (mobile), p-6 or p-8 (desktop)
- Section spacing: py-12 md:py-16 lg:py-20
- Card spacing: p-4 md:p-6
- Grid gaps: gap-4 md:gap-6 lg:gap-8

**Container Widths:**
- Full-width sections: w-full with max-w-7xl mx-auto px-4
- Product grids: max-w-7xl
- Content blocks: max-w-6xl

**Grid Systems:**
- Product Grid: grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5
- Category Grid: grid-cols-3 md:grid-cols-4 lg:grid-cols-6
- Featured Products: grid-cols-1 md:grid-cols-2 lg:grid-cols-3

### D. Component Library

**Navigation Header:**
- Sticky dark header (bg: 20 8% 12%)
- Logo left, search bar center, cart/wishlist/account icons right
- Category mega-menu dropdown with icon-based navigation
- Cart icon with yellow badge showing item count
- Search bar with category filter dropdown and yellow search button

**Hero Carousel:**
- Full-width promotional banner with auto-rotation
- Dark overlay (40% opacity) on images for text readability
- Yellow CTA buttons with backdrop-blur background when over images
- Pagination dots (yellow active state)
- 60-70vh height on desktop, 50vh on mobile

**Product Cards:**
- White/light background on dark theme (25 10% 18%)
- Product image (square aspect ratio, object-cover)
- Quick action icons (wishlist, compare, quick view) on hover overlay
- Product name (truncate after 2 lines)
- Star rating display (5-star system with yellow stars)
- Price row: Original price (strikethrough if discounted) + Sale price (yellow, larger)
- Availability badge (green: in stock, red: low stock)
- Yellow "Add to Cart" button (full width, rounded corners)
- Subtle shadow on hover with transform scale(1.02)

**Category Cards:**
- Icon-based navigation (use Heroicons for product categories)
- Icon size: w-12 h-12 md:w-16 md:h-16
- Yellow icon color or yellow background circle
- Category name below icon
- Hover: subtle lift effect with shadow

**Special Offers Section:**
- Promotional banner with countdown timer
- Timer display: Days, Hours, Minutes, Seconds in yellow boxes
- "Shop Now" CTA with yellow background
- Sale percentage badge (red circular badge with white text)

**Shopping Cart (Header):**
- Cart icon with yellow circular badge showing count
- Slide-out cart panel from right (350px width)
- Cart items with thumbnail, name, quantity controls, price
- Subtotal calculation
- Yellow "Checkout" button at bottom

**Footer:**
- Multi-column layout (Newsletter signup, Quick links, Categories, Contact)
- Newsletter input with yellow subscribe button
- Social media icons with yellow hover states
- Copyright and payment method icons at bottom

### E. Animations

**Minimal Motion Strategy:**
- Product card hover: transform scale(1.02) + shadow transition (200ms)
- Button hover: slight brightness increase (150ms)
- Cart panel: slide-in/out animation (300ms ease-out)
- Carousel: fade transition between slides (400ms)
- NO scroll-triggered animations
- NO complex page transitions

## Images

**Hero Carousel Images (3-5 slides):**
- Flagship smartphone launches with lifestyle photography
- Headphone deals with product on dark background
- Smartwatch promotions with wrist-worn product shots
- Accessory bundles with flat-lay compositions
- Resolution: 1920x800px minimum, optimized for web

**Product Images:**
- Clean product photography on white/transparent backgrounds
- Square format (1:1 ratio), minimum 800x800px
- Consistent lighting and angles across product categories
- Hover: alternate product view or lifestyle shot

**Category Icons:**
- Use Heroicons library for: device-mobile, headphones, clock (smartwatch), battery-charging, cable, camera
- Yellow color: 45 95% 55%
- Displayed on circular background or standalone

**Trust Signals:**
- Payment method icons in footer (Visa, Mastercard, PayPal, etc.)
- Security badges near checkout
- Brand logos for featured manufacturers (if applicable)

## Interaction Patterns

- Product quick view: Modal overlay with larger images and details
- Add to cart: Yellow button with success feedback (checkmark animation)
- Quantity controls: Plus/minus buttons in cart with input field
- Search: Instant suggestions dropdown with category filtering
- Wishlist: Heart icon toggle (outline to solid yellow)
- Star ratings: Display only (no interaction on listing pages)