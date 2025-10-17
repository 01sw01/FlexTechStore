# Mobile & Accessories Ecommerce Store

## Overview

This is a full-stack e-commerce web application for selling mobile phones, electronics, and accessories. Built with a modern tech stack, it features product browsing, shopping cart functionality, favorites/wishlist, order tracking, and contact capabilities. The application uses Redux Toolkit for state management and includes comprehensive e-commerce features like product filtering, comparison tools, and checkout flows.

## Recent Updates (October 2024)

- **Redux State Management**: Migrated from TanStack Query to Redux Toolkit for global state management
- **Complete Page Suite**: Built all core e-commerce pages including Products, Product Details (Best Buy-style), Category Pages with Comparison, Deals, Favorites, Contact, and Order Tracking
- **Enhanced Shopping Cart**: Integrated Redux-powered shopping cart with real-time updates and checkout flow
- **Search Functionality**: Added header search with Redux integration for product filtering
- **Product Comparison**: Implemented side-by-side product comparison feature on category pages

## User Preferences

Preferred communication style: Simple, everyday language.

## Application Pages

### Public Pages
1. **Home** (`/`) - Hero carousel, category navigation, featured products, new arrivals, and special offers
2. **Products** (`/products`) - Advanced filtering (price, brand, rating, stock), search functionality, grid/list views
3. **Product Details** (`/products/:slug`) - Best Buy-inspired layout with image gallery, specifications, reviews, add to cart
4. **Category Pages** (`/category/:slug`) - Product listings with comparison tool (up to 4 products side-by-side)
5. **Deals** (`/deals`) - Special promotions and discounted products with savings calculations
6. **Favorites** (`/favorites`) - User's saved products with quick access to product details
7. **Contact** (`/contact`) - Contact form with validation and support information
8. **Order Tracking** (`/orders`) - Track orders by number, view order history and status

### Key Features
- **Shopping Cart Sheet**: Side panel with cart management, quantity updates, pricing breakdown
- **Header Navigation**: Sticky header with search, cart badge, favorites badge, and main navigation
- **Footer**: Links to important pages and information
- **Product Comparison**: Select up to 4 products to compare specifications and prices
- **Real-time Updates**: Redux-powered state ensures instant UI updates across the application

## System Architecture

### Frontend Architecture

**Framework & Build Tool**
- **React 18** with TypeScript for type-safe component development
- **Vite** as the build tool and development server for fast hot module replacement
- **Wouter** for lightweight client-side routing

**State Management**
- **Redux Toolkit** for global application state (products, cart, favorites, categories, user)
- Centralized store with separate slices:
  - `productsSlice`: Product catalog, filters, search
  - `cartSlice`: Shopping cart items and operations
  - `favoritesSlice`: Wishlist management
  - `categoriesSlice`: Product categories
  - `userSlice`: User information and session

**UI Component System**
- **shadcn/ui** component library with Radix UI primitives for accessible, customizable components
- **Tailwind CSS** for utility-first styling with custom design tokens
- Custom theming system supporting both light and dark modes with CSS variables
- Typography: Inter for UI/body text, Poppins for headings and promotional content

**Design System**
- Modern, clean design with cyan accent colors for CTAs
- Semantic color system for success (green), alerts (red), and info (blue)
- Consistent spacing, border radius, and elevation patterns through hover/active states
- Mobile-first responsive design approach

### Backend Architecture

**Server Framework**
- **Express.js** with TypeScript for RESTful API endpoints
- Custom middleware for request logging and error handling
- Development/production environment separation with conditional Vite integration

**API Design Pattern**
- RESTful endpoints organized by resource (products, cart, favorites, orders, categories, contact)
- Query parameter filtering for products:
  - `categoryId`: Filter by category
  - `minPrice`/`maxPrice`: Price range filtering
  - `brand`: Filter by brand
  - `inStock`: Stock availability
  - `isOnSale`: Sale items only
  - `search`: Text search across product names and descriptions
- Standardized error responses with proper HTTP status codes
- Request/response logging with performance metrics

### Data Storage

**Database**
- **PostgreSQL** as the primary relational database (via Neon serverless)
- **Drizzle ORM** for type-safe database queries and schema management
- Database schema includes: users, products, categories, cart_items, favorites, orders, order_items, contact_messages

**Schema Design**
- UUID primary keys for all entities
- Foreign key relationships (products->categories, cart_items->products, etc.)
- Support for product variants through JSONB fields (colors, storage options, specifications)
- Decimal precision for pricing to avoid floating-point issues
- Timestamp tracking for created/updated records

**Data Access Layer**
- Abstract storage interface pattern for potential database swapping
- Centralized storage module with methods for CRUD operations
- Zod schemas for runtime validation using drizzle-zod integration

### Redux Store Structure

```typescript
{
  products: {
    items: Product[],
    loading: boolean,
    error: string | null,
    filters: FilterState
  },
  cart: {
    items: CartItem[],
    loading: boolean,
    error: string | null
  },
  favorites: {
    items: Favorite[],
    loading: boolean,
    error: string | null
  },
  categories: {
    items: Category[],
    selectedCategory: Category | null,
    loading: boolean,
    error: string | null
  },
  user: {
    id: string,
    username: string | null,
    email: string | null
  }
}
```

### Authentication & Authorization

**Current Implementation**
- User schema with username/email/password fields
- Session-based authentication preparation (connect-pg-simple for PostgreSQL session store)
- User ID tracked in Redux for cart and favorites operations

**Security Considerations**
- Password field present in user schema (requires hashing implementation)
- Session store configured but authentication middleware not yet implemented

### External Dependencies

**Third-Party Services**
- **Neon Database**: Serverless PostgreSQL hosting
- **Google Fonts**: Inter and Poppins typography
- **Unsplash**: Product image CDN for placeholder images

**Development Tools**
- **Replit Plugins**: Cartographer (code navigation), dev banner, runtime error modal
- **ESBuild**: Server-side bundling for production builds
- **Drizzle Kit**: Database migration management

**UI Libraries**
- **Radix UI**: 20+ primitive components for accessibility
- **Lucide React**: Icon system
- **React Hook Form**: Form state management with Zod validation
- **date-fns**: Date formatting and manipulation

### Build & Deployment

**Development Mode**
- Vite dev server with HMR for frontend
- TSX for running TypeScript server code directly
- Dynamic imports for development-only plugins

**Production Build**
- Vite builds frontend to `dist/public`
- ESBuild bundles server code to `dist/index.js`
- Static file serving from built assets
- Environment variable configuration for database URL

**Code Organization**
- Monorepo structure with `client/`, `server/`, and `shared/` directories
- Path aliases: `@/` for client code, `@shared/` for shared types/schemas
- TypeScript with strict mode for type safety across the stack

## Component Structure

### Key Components
- **Header**: Sticky navigation with search, cart, favorites, and user actions
- **Footer**: Site-wide footer with links and information
- **HeroCarousel**: Promotional carousel on homepage
- **CategoryNav**: Quick category navigation
- **ProductCard**: Reusable product display card
- **ProductSection**: Section component for product grids
- **ShoppingCartSheet**: Sliding cart panel with full cart management
- **SpecialOffers**: Promotional banner for deals

### Page Components
All pages follow consistent patterns:
- Redux state integration via hooks (`useAppDispatch`, `useAppSelector`)
- Loading states with skeleton loaders
- Error handling with user-friendly messages
- Responsive design for mobile and desktop
- Accessibility with proper ARIA labels and keyboard navigation
