import { 
  restaurants, 
  menuCategories, 
  menuItems, 
  deals, 
  cartItems, 
  serverCalls,
  type Restaurant, 
  type InsertRestaurant,
  type MenuCategory,
  type InsertMenuCategory,
  type MenuItem,
  type InsertMenuItem,
  type Deal,
  type InsertDeal,
  type CartItem,
  type InsertCartItem,
  type ServerCall,
  type InsertServerCall
} from "@shared/schema";

export interface IStorage {
  // Restaurants
  getRestaurants(): Promise<Restaurant[]>;
  getRestaurant(id: number): Promise<Restaurant | undefined>;
  createRestaurant(restaurant: InsertRestaurant): Promise<Restaurant>;
  
  // Menu Categories
  getMenuCategories(restaurantId: number): Promise<MenuCategory[]>;
  createMenuCategory(category: InsertMenuCategory): Promise<MenuCategory>;
  
  // Menu Items
  getMenuItems(restaurantId: number): Promise<MenuItem[]>;
  getMenuItemsByCategory(categoryId: number): Promise<MenuItem[]>;
  getMenuItem(id: number): Promise<MenuItem | undefined>;
  createMenuItem(item: InsertMenuItem): Promise<MenuItem>;
  updateMenuItemVotes(id: number, upvotes: number, downvotes: number): Promise<MenuItem | undefined>;
  
  // Deals
  getDeals(): Promise<Deal[]>;
  getRestaurantDeals(restaurantId: number): Promise<Deal[]>;
  createDeal(deal: InsertDeal): Promise<Deal>;
  
  // Cart
  getCartItems(sessionId: string): Promise<(CartItem & { menuItem: MenuItem })[]>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: number, quantity: number, specialInstructions?: string): Promise<CartItem | undefined>;
  removeFromCart(id: number): Promise<boolean>;
  clearCart(sessionId: string): Promise<boolean>;
  
  // Server Calls
  createServerCall(call: InsertServerCall): Promise<ServerCall>;
  getServerCalls(restaurantId: number): Promise<ServerCall[]>;
  updateServerCallStatus(id: number, status: string): Promise<ServerCall | undefined>;
}

export class MemStorage implements IStorage {
  private restaurants: Map<number, Restaurant>;
  private menuCategories: Map<number, MenuCategory>;
  private menuItems: Map<number, MenuItem>;
  private deals: Map<number, Deal>;
  private cartItems: Map<number, CartItem>;
  private serverCalls: Map<number, ServerCall>;
  private currentId: number;

  constructor() {
    this.restaurants = new Map();
    this.menuCategories = new Map();
    this.menuItems = new Map();
    this.deals = new Map();
    this.cartItems = new Map();
    this.serverCalls = new Map();
    this.currentId = 1;
    
    // Initialize with sample data
    this.initializeData();
  }

  private initializeData() {
    // Create sample restaurant
    const restaurant: Restaurant = {
      id: 1,
      name: "Bella Vista Italian",
      cuisine: "Italian",
      description: "Authentic Italian family recipes",
      imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=200",
      rating: 4.8,
      votePercentage: 89,
      priceRange: "$$",
      distance: 0.3,
      isHiddenGem: false,
      isTrending: false,
      isLocalFavorite: true,
    };
    this.restaurants.set(1, restaurant);

    // Create discovery restaurants
    const discoveryRestaurants = [
      {
        id: 2,
        name: "Marco's Hidden Kitchen",
        cuisine: "Italian",
        description: "Authentic Italian family recipes",
        imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=200",
        rating: 4.9,
        votePercentage: 89,
        priceRange: "$$",
        distance: 0.3,
        isHiddenGem: true,
        isTrending: false,
        isLocalFavorite: false,
      },
      {
        id: 3,
        name: "Zen Sushi Bar",
        cuisine: "Japanese",
        description: "Fresh sushi & creative rolls",
        imageUrl: "https://images.unsplash.com/photo-1579027989536-b7b1f875659b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=200",
        rating: 4.7,
        votePercentage: 92,
        priceRange: "$$$",
        distance: 0.8,
        isHiddenGem: false,
        isTrending: true,
        isLocalFavorite: false,
      },
      {
        id: 4,
        name: "Casa Bonita Tacos",
        cuisine: "Mexican",
        description: "Authentic street tacos",
        imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=200",
        rating: 4.6,
        votePercentage: 87,
        priceRange: "$",
        distance: 1.2,
        isHiddenGem: false,
        isTrending: false,
        isLocalFavorite: true,
      },
    ];

    discoveryRestaurants.forEach(rest => this.restaurants.set(rest.id, rest));

    // Create menu categories
    const categories = [
      { id: 1, restaurantId: 1, name: "Appetizers", order: 1 },
      { id: 2, restaurantId: 1, name: "Main Dishes", order: 2 },
      { id: 3, restaurantId: 1, name: "Desserts", order: 3 },
    ];
    categories.forEach(cat => this.menuCategories.set(cat.id, cat));

    // Create menu items
    const items = [
      {
        id: 1,
        restaurantId: 1,
        categoryId: 1,
        name: "Crispy Calamari",
        description: "Fresh squid rings, lightly breaded and fried to perfection. Served with marinara sauce.",
        fullDescription: "Fresh squid rings, lightly breaded and fried to perfection. Served with marinara sauce and lemon wedges.",
        price: 12.99,
        imageUrl: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
        rating: 4.8,
        votes: 89,
        upvotes: 80,
        downvotes: 9,
      },
      {
        id: 2,
        restaurantId: 1,
        categoryId: 1,
        name: "Bruschetta Trio",
        description: "Three varieties: classic tomato & basil, mushroom & truffle, and ricotta & honey.",
        fullDescription: "Three varieties of artisanal bruschetta: classic tomato & basil, wild mushroom & truffle, and fresh ricotta & honey on toasted sourdough.",
        price: 9.99,
        imageUrl: "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
        rating: 4.6,
        votes: 76,
        upvotes: 68,
        downvotes: 8,
      },
      {
        id: 3,
        restaurantId: 1,
        categoryId: 2,
        name: "Grilled Atlantic Salmon",
        description: "Fresh Atlantic salmon with lemon herb butter, served with seasonal vegetables and wild rice.",
        fullDescription: "Fresh Atlantic salmon grilled to perfection with our signature lemon herb butter, accompanied by seasonal roasted vegetables and aromatic wild rice pilaf.",
        price: 28.99,
        imageUrl: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
        rating: 4.9,
        votes: 142,
        upvotes: 132,
        downvotes: 10,
      },
      {
        id: 4,
        restaurantId: 1,
        categoryId: 2,
        name: "Wild Mushroom Risotto",
        description: "Creamy arborio rice with wild mushrooms, truffle oil, and aged parmesan cheese.",
        fullDescription: "Creamy arborio rice slow-cooked with a medley of wild mushrooms, finished with truffle oil and aged parmesan cheese. A vegetarian delight.",
        price: 24.99,
        imageUrl: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
        rating: 4.7,
        votes: 98,
        upvotes: 88,
        downvotes: 10,
      },
      {
        id: 5,
        restaurantId: 1,
        categoryId: 2,
        name: "Bella Vista Burger",
        description: "Wagyu beef patty, aged cheddar, arugula, tomato, and truffle aioli on brioche bun.",
        fullDescription: "Premium Wagyu beef patty grilled to your preference, topped with aged cheddar, fresh arugula, vine-ripened tomato, and house-made truffle aioli on a toasted brioche bun. Served with hand-cut fries.",
        price: 18.99,
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
        rating: 4.8,
        votes: 203,
        upvotes: 188,
        downvotes: 15,
      },
    ];
    items.forEach(item => this.menuItems.set(item.id, item));

    // Create deals
    const dealsData = [
      {
        id: 1,
        restaurantId: null,
        title: "30% OFF",
        description: "Your first order at any participating restaurant",
        discountType: "percentage",
        discountValue: "30",
        validUntil: "Dec 31",
        backgroundColor: "from-primary to-orange-600",
        isGlobal: true,
      },
      {
        id: 2,
        restaurantId: null,
        title: "Free Delivery",
        description: "On orders over $25 from local partners",
        discountType: "free_delivery",
        discountValue: "25",
        validUntil: "Today only",
        backgroundColor: "from-success to-teal-600",
        isGlobal: true,
      },
      {
        id: 3,
        restaurantId: 1,
        title: "Happy Hour",
        description: "Buy one get one free appetizers 3-6 PM",
        discountType: "bogo",
        discountValue: "appetizers",
        validUntil: "Daily special",
        backgroundColor: "from-secondary to-indigo-700",
        isGlobal: false,
      },
    ];
    dealsData.forEach(deal => this.deals.set(deal.id, deal));

    this.currentId = 6;
  }

  async getRestaurants(): Promise<Restaurant[]> {
    return Array.from(this.restaurants.values());
  }

  async getRestaurant(id: number): Promise<Restaurant | undefined> {
    return this.restaurants.get(id);
  }

  async createRestaurant(restaurant: InsertRestaurant): Promise<Restaurant> {
    const id = this.currentId++;
    const newRestaurant: Restaurant = { ...restaurant, id };
    this.restaurants.set(id, newRestaurant);
    return newRestaurant;
  }

  async getMenuCategories(restaurantId: number): Promise<MenuCategory[]> {
    return Array.from(this.menuCategories.values())
      .filter(cat => cat.restaurantId === restaurantId)
      .sort((a, b) => a.order - b.order);
  }

  async createMenuCategory(category: InsertMenuCategory): Promise<MenuCategory> {
    const id = this.currentId++;
    const newCategory: MenuCategory = { ...category, id };
    this.menuCategories.set(id, newCategory);
    return newCategory;
  }

  async getMenuItems(restaurantId: number): Promise<MenuItem[]> {
    return Array.from(this.menuItems.values())
      .filter(item => item.restaurantId === restaurantId);
  }

  async getMenuItemsByCategory(categoryId: number): Promise<MenuItem[]> {
    return Array.from(this.menuItems.values())
      .filter(item => item.categoryId === categoryId);
  }

  async getMenuItem(id: number): Promise<MenuItem | undefined> {
    return this.menuItems.get(id);
  }

  async createMenuItem(item: InsertMenuItem): Promise<MenuItem> {
    const id = this.currentId++;
    const newItem: MenuItem = { ...item, id, rating: 0, votes: 0, upvotes: 0, downvotes: 0 };
    this.menuItems.set(id, newItem);
    return newItem;
  }

  async updateMenuItemVotes(id: number, upvotes: number, downvotes: number): Promise<MenuItem | undefined> {
    const item = this.menuItems.get(id);
    if (!item) return undefined;
    
    const votes = upvotes + downvotes;
    const rating = votes > 0 ? (upvotes / votes) * 5 : 0;
    
    const updatedItem = { ...item, upvotes, downvotes, votes, rating };
    this.menuItems.set(id, updatedItem);
    return updatedItem;
  }

  async getDeals(): Promise<Deal[]> {
    return Array.from(this.deals.values());
  }

  async getRestaurantDeals(restaurantId: number): Promise<Deal[]> {
    return Array.from(this.deals.values())
      .filter(deal => deal.restaurantId === restaurantId || deal.isGlobal);
  }

  async createDeal(deal: InsertDeal): Promise<Deal> {
    const id = this.currentId++;
    const newDeal: Deal = { ...deal, id };
    this.deals.set(id, newDeal);
    return newDeal;
  }

  async getCartItems(sessionId: string): Promise<(CartItem & { menuItem: MenuItem })[]> {
    const items = Array.from(this.cartItems.values())
      .filter(item => item.sessionId === sessionId);
    
    const itemsWithMenuData = [];
    for (const item of items) {
      const menuItem = this.menuItems.get(item.menuItemId);
      if (menuItem) {
        itemsWithMenuData.push({ ...item, menuItem });
      }
    }
    
    return itemsWithMenuData;
  }

  async addToCart(item: InsertCartItem): Promise<CartItem> {
    const id = this.currentId++;
    const newItem: CartItem = { 
      ...item, 
      id, 
      addedAt: new Date().toISOString() as any 
    };
    this.cartItems.set(id, newItem);
    return newItem;
  }

  async updateCartItem(id: number, quantity: number, specialInstructions?: string): Promise<CartItem | undefined> {
    const item = this.cartItems.get(id);
    if (!item) return undefined;
    
    const updatedItem = { ...item, quantity, specialInstructions };
    this.cartItems.set(id, updatedItem);
    return updatedItem;
  }

  async removeFromCart(id: number): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  async clearCart(sessionId: string): Promise<boolean> {
    const items = Array.from(this.cartItems.entries())
      .filter(([_, item]) => item.sessionId === sessionId);
    
    items.forEach(([id]) => this.cartItems.delete(id));
    return true;
  }

  async createServerCall(call: InsertServerCall): Promise<ServerCall> {
    const id = this.currentId++;
    const newCall: ServerCall = { 
      ...call, 
      id, 
      createdAt: new Date().toISOString() as any 
    };
    this.serverCalls.set(id, newCall);
    return newCall;
  }

  async getServerCalls(restaurantId: number): Promise<ServerCall[]> {
    return Array.from(this.serverCalls.values())
      .filter(call => call.restaurantId === restaurantId);
  }

  async updateServerCallStatus(id: number, status: string): Promise<ServerCall | undefined> {
    const call = this.serverCalls.get(id);
    if (!call) return undefined;
    
    const updatedCall = { ...call, status };
    this.serverCalls.set(id, updatedCall);
    return updatedCall;
  }
}

export const storage = new MemStorage();
