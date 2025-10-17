import { 
  type User, 
  type InsertUser,
  type Product,
  type InsertProduct,
  type Category,
  type InsertCategory,
  type CartItem,
  type InsertCartItem,
  type Favorite,
  type InsertFavorite,
  type Order,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem,
  type ContactMessage,
  type InsertContactMessage
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getProducts(filters?: { categoryId?: string; search?: string; minPrice?: number; maxPrice?: number; brand?: string; inStock?: boolean; isOnSale?: boolean; isFeatured?: boolean; isNew?: boolean }): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  
  getCategories(): Promise<Category[]>;
  getCategory(id: string): Promise<Category | undefined>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  getCartItems(userId: string): Promise<CartItem[]>;
  addToCart(cartItem: InsertCartItem): Promise<CartItem>;
  updateCartItemQuantity(id: string, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: string): Promise<boolean>;
  clearCart(userId: string): Promise<boolean>;
  
  getFavorites(userId: string): Promise<Favorite[]>;
  addFavorite(favorite: InsertFavorite): Promise<Favorite>;
  removeFavorite(userId: string, productId: string): Promise<boolean>;
  isFavorite(userId: string, productId: string): Promise<boolean>;
  
  getOrders(userId: string): Promise<Order[]>;
  getOrder(id: string): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: string, status: string, trackingNumber?: string): Promise<Order | undefined>;
  
  getOrderItems(orderId: string): Promise<OrderItem[]>;
  createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
  
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private products: Map<string, Product>;
  private categories: Map<string, Category>;
  private cartItems: Map<string, CartItem>;
  private favorites: Map<string, Favorite>;
  private orders: Map<string, Order>;
  private orderItems: Map<string, OrderItem>;
  private contactMessages: Map<string, ContactMessage>;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.categories = new Map();
    this.cartItems = new Map();
    this.favorites = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.contactMessages = new Map();
    
    this.seedData();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser,
      firstName: insertUser.firstName ?? null,
      lastName: insertUser.lastName ?? null,
      id,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async getProducts(filters?: { 
    categoryId?: string; 
    search?: string; 
    minPrice?: number; 
    maxPrice?: number; 
    brand?: string; 
    inStock?: boolean;
    isOnSale?: boolean;
    isFeatured?: boolean;
    isNew?: boolean;
  }): Promise<Product[]> {
    let products = Array.from(this.products.values());
    
    if (filters?.categoryId) {
      products = products.filter(p => p.categoryId === filters.categoryId);
    }
    
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(searchLower) ||
        p.description?.toLowerCase().includes(searchLower) ||
        p.brand?.toLowerCase().includes(searchLower)
      );
    }
    
    if (filters?.minPrice !== undefined) {
      products = products.filter(p => parseFloat(p.price) >= filters.minPrice!);
    }
    
    if (filters?.maxPrice !== undefined) {
      products = products.filter(p => parseFloat(p.price) <= filters.maxPrice!);
    }
    
    if (filters?.brand) {
      products = products.filter(p => p.brand === filters.brand);
    }
    
    if (filters?.inStock !== undefined) {
      products = products.filter(p => p.inStock === filters.inStock);
    }
    
    if (filters?.isOnSale !== undefined) {
      products = products.filter(p => p.isOnSale === filters.isOnSale);
    }
    
    if (filters?.isFeatured !== undefined) {
      products = products.filter(p => p.isFeatured === filters.isFeatured);
    }
    
    if (filters?.isNew !== undefined) {
      products = products.filter(p => p.isNew === filters.isNew);
    }
    
    return products;
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    return Array.from(this.products.values()).find(p => p.slug === slug);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = { 
      ...insertProduct,
      description: insertProduct.description ?? null,
      longDescription: insertProduct.longDescription ?? null,
      brand: insertProduct.brand ?? null,
      model: insertProduct.model ?? null,
      originalPrice: insertProduct.originalPrice ?? null,
      images: insertProduct.images ?? null,
      inStock: insertProduct.inStock ?? true,
      stockQuantity: insertProduct.stockQuantity ?? 0,
      rating: insertProduct.rating ?? null,
      reviewCount: insertProduct.reviewCount ?? 0,
      specifications: insertProduct.specifications ?? null,
      features: insertProduct.features ?? null,
      isFeatured: insertProduct.isFeatured ?? false,
      isNew: insertProduct.isNew ?? false,
      isOnSale: insertProduct.isOnSale ?? false,
      id,
      createdAt: new Date()
    };
    this.products.set(id, product);
    return product;
  }

  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategory(id: string): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(c => c.slug === slug);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = randomUUID();
    const category: Category = { 
      ...insertCategory,
      description: insertCategory.description ?? null,
      image: insertCategory.image ?? null,
      parentId: insertCategory.parentId ?? null,
      id 
    };
    this.categories.set(id, category);
    return category;
  }

  async getCartItems(userId: string): Promise<CartItem[]> {
    return Array.from(this.cartItems.values()).filter(item => item.userId === userId);
  }

  async addToCart(insertCartItem: InsertCartItem): Promise<CartItem> {
    const existing = Array.from(this.cartItems.values()).find(
      item => item.userId === insertCartItem.userId && item.productId === insertCartItem.productId
    );
    
    if (existing) {
      existing.quantity += (insertCartItem.quantity ?? 1);
      this.cartItems.set(existing.id, existing);
      return existing;
    }
    
    const id = randomUUID();
    const cartItem: CartItem = { 
      ...insertCartItem,
      quantity: insertCartItem.quantity ?? 1,
      id,
      createdAt: new Date()
    };
    this.cartItems.set(id, cartItem);
    return cartItem;
  }

  async updateCartItemQuantity(id: string, quantity: number): Promise<CartItem | undefined> {
    const item = this.cartItems.get(id);
    if (item) {
      item.quantity = quantity;
      this.cartItems.set(id, item);
      return item;
    }
    return undefined;
  }

  async removeFromCart(id: string): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  async clearCart(userId: string): Promise<boolean> {
    const items = await this.getCartItems(userId);
    items.forEach(item => this.cartItems.delete(item.id));
    return true;
  }

  async getFavorites(userId: string): Promise<Favorite[]> {
    return Array.from(this.favorites.values()).filter(fav => fav.userId === userId);
  }

  async addFavorite(insertFavorite: InsertFavorite): Promise<Favorite> {
    const id = randomUUID();
    const favorite: Favorite = { 
      ...insertFavorite, 
      id,
      createdAt: new Date()
    };
    this.favorites.set(id, favorite);
    return favorite;
  }

  async removeFavorite(userId: string, productId: string): Promise<boolean> {
    const favorite = Array.from(this.favorites.values()).find(
      fav => fav.userId === userId && fav.productId === productId
    );
    if (favorite) {
      return this.favorites.delete(favorite.id);
    }
    return false;
  }

  async isFavorite(userId: string, productId: string): Promise<boolean> {
    return Array.from(this.favorites.values()).some(
      fav => fav.userId === userId && fav.productId === productId
    );
  }

  async getOrders(userId: string): Promise<Order[]> {
    return Array.from(this.orders.values())
      .filter(order => order.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getOrder(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const order: Order = { 
      ...insertOrder,
      status: insertOrder.status ?? "pending",
      shippingAddress: insertOrder.shippingAddress ?? null,
      paymentMethod: insertOrder.paymentMethod ?? null,
      trackingNumber: insertOrder.trackingNumber ?? null,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.orders.set(id, order);
    return order;
  }

  async updateOrderStatus(id: string, status: string, trackingNumber?: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (order) {
      order.status = status;
      order.updatedAt = new Date();
      if (trackingNumber) {
        order.trackingNumber = trackingNumber;
      }
      this.orders.set(id, order);
      return order;
    }
    return undefined;
  }

  async getOrderItems(orderId: string): Promise<OrderItem[]> {
    return Array.from(this.orderItems.values()).filter(item => item.orderId === orderId);
  }

  async createOrderItem(insertOrderItem: InsertOrderItem): Promise<OrderItem> {
    const id = randomUUID();
    const orderItem: OrderItem = { 
      ...insertOrderItem,
      productImage: insertOrderItem.productImage ?? null,
      id 
    };
    this.orderItems.set(id, orderItem);
    return orderItem;
  }

  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const id = randomUUID();
    const message: ContactMessage = { 
      ...insertMessage, 
      id,
      createdAt: new Date()
    };
    this.contactMessages.set(id, message);
    return message;
  }

  private seedData() {
    const mobilesCategoryId = randomUUID();
    const accessoriesCategoryId = randomUUID();
    const headphonesCategoryId = randomUUID();
    const chargersCategoryId = randomUUID();
    const casesCategoryId = randomUUID();

    const categories: Category[] = [
      {
        id: mobilesCategoryId,
        name: "Mobile Phones",
        slug: "mobile-phones",
        description: "Latest smartphones from top brands",
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop",
        parentId: null,
      },
      {
        id: accessoriesCategoryId,
        name: "Accessories",
        slug: "accessories",
        description: "Essential mobile accessories",
        image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&h=300&fit=crop",
        parentId: null,
      },
      {
        id: headphonesCategoryId,
        name: "Headphones & Earbuds",
        slug: "headphones-earbuds",
        description: "Premium audio accessories",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
        parentId: accessoriesCategoryId,
      },
      {
        id: chargersCategoryId,
        name: "Chargers & Cables",
        slug: "chargers-cables",
        description: "Fast charging solutions",
        image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400&h=300&fit=crop",
        parentId: accessoriesCategoryId,
      },
      {
        id: casesCategoryId,
        name: "Cases & Protection",
        slug: "cases-protection",
        description: "Protective cases and screen guards",
        image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&h=300&fit=crop",
        parentId: accessoriesCategoryId,
      },
    ];

    categories.forEach(cat => this.categories.set(cat.id, cat));

    const products: Product[] = [
      {
        id: randomUUID(),
        name: "iPhone 15 Pro Max 256GB",
        slug: "iphone-15-pro-max-256gb",
        description: "The ultimate iPhone with titanium design and A17 Pro chip",
        longDescription: "Experience the power of the iPhone 15 Pro Max featuring a stunning titanium design, the revolutionary A17 Pro chip, and advanced camera capabilities. With ProMotion display technology and all-day battery life.",
        categoryId: mobilesCategoryId,
        brand: "Apple",
        model: "iPhone 15 Pro Max",
        price: "1199.00",
        originalPrice: null,
        image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&h=600&fit=crop",
        images: [
          "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&h=600&fit=crop",
          "https://images.unsplash.com/photo-1695048133364-61e5e4ee0cd7?w=600&h=600&fit=crop",
          "https://images.unsplash.com/photo-1695048071524-9e9f75c56c0f?w=600&h=600&fit=crop"
        ],
        inStock: true,
        stockQuantity: 45,
        rating: "5.0",
        reviewCount: 234,
        specifications: {
          screen: "6.7-inch Super Retina XDR",
          processor: "A17 Pro chip",
          camera: "48MP Main + 12MP Ultra Wide + 12MP Telephoto",
          battery: "Up to 29 hours video playback",
          storage: "256GB",
          os: "iOS 17"
        },
        features: ["Titanium design", "Action button", "ProMotion display", "Ceramic Shield", "5G capable"],
        isFeatured: true,
        isNew: true,
        isOnSale: false,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        name: "Samsung Galaxy S24 Ultra",
        slug: "samsung-galaxy-s24-ultra",
        description: "Premium Android flagship with S Pen and AI features",
        longDescription: "The Samsung Galaxy S24 Ultra combines cutting-edge AI capabilities with a stunning display and S Pen functionality. Featuring the Snapdragon 8 Gen 3 processor and advanced camera system.",
        categoryId: mobilesCategoryId,
        brand: "Samsung",
        model: "Galaxy S24 Ultra",
        price: "1299.00",
        originalPrice: null,
        image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&h=600&fit=crop",
        images: [
          "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&h=600&fit=crop",
          "https://images.unsplash.com/photo-1615473812748-71cbe1bfa337?w=600&h=600&fit=crop"
        ],
        inStock: true,
        stockQuantity: 32,
        rating: "4.5",
        reviewCount: 189,
        specifications: {
          screen: "6.8-inch Dynamic AMOLED 2X",
          processor: "Snapdragon 8 Gen 3",
          camera: "200MP Main + 50MP Telephoto + 12MP Ultra Wide + 10MP Telephoto",
          battery: "5000mAh",
          storage: "512GB",
          os: "Android 14"
        },
        features: ["S Pen included", "Galaxy AI", "Gorilla Glass Victus 2", "5G capable", "IP68 water resistant"],
        isFeatured: true,
        isNew: true,
        isOnSale: false,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        name: "Google Pixel 8 Pro",
        slug: "google-pixel-8-pro",
        description: "Pure Android experience with Google AI magic",
        longDescription: "Experience the best of Google with the Pixel 8 Pro. Powered by Google Tensor G3 and featuring exceptional camera capabilities with AI-powered photo editing.",
        categoryId: mobilesCategoryId,
        brand: "Google",
        model: "Pixel 8 Pro",
        price: "899.00",
        originalPrice: "999.00",
        image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&h=600&fit=crop",
        images: [
          "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&h=600&fit=crop"
        ],
        inStock: true,
        stockQuantity: 28,
        rating: "4.5",
        reviewCount: 156,
        specifications: {
          screen: "6.7-inch LTPO OLED",
          processor: "Google Tensor G3",
          camera: "50MP Main + 48MP Ultra Wide + 48MP Telephoto",
          battery: "5050mAh",
          storage: "256GB",
          os: "Android 14"
        },
        features: ["Magic Eraser", "Best Take", "7 years of updates", "IP68 rated", "5G capable"],
        isFeatured: true,
        isNew: false,
        isOnSale: true,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        name: "AirPods Pro (2nd Gen)",
        slug: "airpods-pro-2nd-gen",
        description: "Active noise cancelling earbuds with spatial audio",
        longDescription: "The AirPods Pro feature adaptive audio, active noise cancellation, and personalized spatial audio for an immersive listening experience.",
        categoryId: headphonesCategoryId,
        brand: "Apple",
        model: "AirPods Pro 2",
        price: "249.00",
        originalPrice: null,
        image: "https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=600&h=600&fit=crop",
        images: [
          "https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=600&h=600&fit=crop"
        ],
        inStock: true,
        stockQuantity: 67,
        rating: "5.0",
        reviewCount: 412,
        specifications: {
          type: "In-ear wireless earbuds",
          connectivity: "Bluetooth 5.3",
          battery: "Up to 6 hours (ANC on)",
          features: "Active Noise Cancellation, Transparency mode",
          waterproof: "IPX4"
        },
        features: ["Adaptive Audio", "Personalized Spatial Audio", "MagSafe charging", "Find My support"],
        isFeatured: true,
        isNew: false,
        isOnSale: false,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        name: "Sony WH-1000XM5 Headphones",
        slug: "sony-wh-1000xm5-headphones",
        description: "Industry-leading noise cancelling over-ear headphones",
        longDescription: "Experience exceptional sound quality and industry-leading noise cancellation with Sony's flagship headphones. Featuring 30-hour battery life and multipoint connection.",
        categoryId: headphonesCategoryId,
        brand: "Sony",
        model: "WH-1000XM5",
        price: "349.00",
        originalPrice: "399.00",
        image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&h=600&fit=crop",
        images: [
          "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&h=600&fit=crop",
          "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&h=600&fit=crop"
        ],
        inStock: true,
        stockQuantity: 54,
        rating: "5.0",
        reviewCount: 567,
        specifications: {
          type: "Over-ear wireless headphones",
          connectivity: "Bluetooth 5.2",
          battery: "Up to 30 hours",
          drivers: "30mm",
          weight: "250g"
        },
        features: ["Industry-leading ANC", "Multipoint connection", "LDAC support", "Speak-to-chat"],
        isFeatured: true,
        isNew: false,
        isOnSale: true,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        name: "Samsung Galaxy Buds2 Pro",
        slug: "samsung-galaxy-buds2-pro",
        description: "Premium wireless earbuds with intelligent ANC",
        longDescription: "Enjoy premium sound quality with intelligent active noise cancellation and 360 audio. Perfect companion for your Galaxy devices.",
        categoryId: headphonesCategoryId,
        brand: "Samsung",
        model: "Galaxy Buds2 Pro",
        price: "199.00",
        originalPrice: "229.00",
        image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=600&fit=crop",
        images: [
          "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=600&fit=crop"
        ],
        inStock: true,
        stockQuantity: 89,
        rating: "4.5",
        reviewCount: 298,
        specifications: {
          type: "In-ear wireless earbuds",
          connectivity: "Bluetooth 5.3",
          battery: "Up to 5 hours (ANC on)",
          drivers: "10mm coaxial 2-way",
          waterproof: "IPX7"
        },
        features: ["Intelligent ANC", "360 Audio", "Hi-Fi sound", "Auto Switch"],
        isFeatured: false,
        isNew: false,
        isOnSale: true,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        name: "Anker 65W USB-C Charger",
        slug: "anker-65w-usb-c-charger",
        description: "Fast charging adapter with GaN technology",
        longDescription: "Compact and powerful 65W USB-C charger with GaN technology. Charge your phone, tablet, and laptop with a single adapter.",
        categoryId: chargersCategoryId,
        brand: "Anker",
        model: "PowerPort III",
        price: "49.99",
        originalPrice: null,
        image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&h=600&fit=crop",
        images: [
          "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&h=600&fit=crop"
        ],
        inStock: true,
        stockQuantity: 156,
        rating: "4.5",
        reviewCount: 445,
        specifications: {
          power: "65W",
          ports: "1x USB-C",
          technology: "GaN (Gallium Nitride)",
          compatibility: "iPhone, iPad, MacBook, Samsung, etc.",
          safety: "MultiProtect safety system"
        },
        features: ["GaN technology", "Compact design", "Universal compatibility", "Foldable plug"],
        isFeatured: false,
        isNew: false,
        isOnSale: false,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        name: "Belkin 3-in-1 Wireless Charger",
        slug: "belkin-3-in-1-wireless-charger",
        description: "Charge iPhone, Apple Watch, and AirPods simultaneously",
        longDescription: "Elegant wireless charging solution for your Apple devices. Charges iPhone, Apple Watch, and AirPods all at once with MagSafe compatibility.",
        categoryId: chargersCategoryId,
        brand: "Belkin",
        model: "BoostCharge Pro",
        price: "129.99",
        originalPrice: "149.99",
        image: "https://images.unsplash.com/photo-1591290619762-c588b0b2f9d6?w=600&h=600&fit=crop",
        images: [
          "https://images.unsplash.com/photo-1591290619762-c588b0b2f9d6?w=600&h=600&fit=crop"
        ],
        inStock: true,
        stockQuantity: 43,
        rating: "4.0",
        reviewCount: 178,
        specifications: {
          charging: "MagSafe 15W",
          devices: "iPhone + Apple Watch + AirPods",
          design: "Premium stainless steel",
          certification: "Qi-certified"
        },
        features: ["MagSafe compatible", "Charges 3 devices", "LED indicators", "Premium design"],
        isFeatured: false,
        isNew: false,
        isOnSale: true,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        name: "OtterBox Defender Series Case",
        slug: "otterbox-defender-series-case",
        description: "Rugged protection for your iPhone 15 Pro",
        longDescription: "Military-grade drop protection with multi-layer defense. Includes port covers to keep out dust and debris.",
        categoryId: casesCategoryId,
        brand: "OtterBox",
        model: "Defender Series",
        price: "59.99",
        originalPrice: null,
        image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&h=600&fit=crop",
        images: [
          "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&h=600&fit=crop"
        ],
        inStock: true,
        stockQuantity: 234,
        rating: "5.0",
        reviewCount: 892,
        specifications: {
          compatibility: "iPhone 15 Pro",
          protection: "Drop protection up to 3x military standard",
          material: "Polycarbonate shell + synthetic rubber slipcover",
          features: "Port covers"
        },
        features: ["Multi-layer defense", "Port covers", "Raised edges", "Wireless charging compatible"],
        isFeatured: false,
        isNew: false,
        isOnSale: false,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        name: "Spigen Liquid Air Case",
        slug: "spigen-liquid-air-case",
        description: "Slim and flexible case with modern design",
        longDescription: "Lightweight protection with a geometric pattern design. Provides excellent grip and shock absorption.",
        categoryId: casesCategoryId,
        brand: "Spigen",
        model: "Liquid Air",
        price: "19.99",
        originalPrice: "24.99",
        image: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=600&h=600&fit=crop",
        images: [
          "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=600&h=600&fit=crop"
        ],
        inStock: true,
        stockQuantity: 421,
        rating: "4.5",
        reviewCount: 1245,
        specifications: {
          compatibility: "iPhone 15 / 15 Pro / 15 Pro Max",
          material: "Flexible TPU",
          thickness: "Slim profile",
          texture: "Geometric pattern"
        },
        features: ["Slim design", "Air cushion technology", "Tactile buttons", "Wireless charging compatible"],
        isFeatured: false,
        isNew: false,
        isOnSale: true,
        createdAt: new Date(),
      },
    ];

    products.forEach(prod => this.products.set(prod.id, prod));
  }
}

export const storage = new MemStorage();
