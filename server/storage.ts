import {
  restaurants,
  menuCategories,
  menuItems,
  menuItemAddons,
  cartItemAddons,
  deals,
  cartItems,
  serverCalls,
  type Restaurant,
  type InsertRestaurant,
  type MenuCategory,
  type InsertMenuCategory,
  type MenuItem,
  type InsertMenuItem,
  type MenuItemAddon,
  type InsertMenuItemAddon,
  type CartItemAddon,
  type InsertCartItemAddon,
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

  // Menu Item Add-ons
  getMenuItemAddons(menuItemId: number): Promise<MenuItemAddon[]>;
  createMenuItemAddon(addon: InsertMenuItemAddon): Promise<MenuItemAddon>;

  // Cart Item Add-ons
  getCartItemAddons(cartItemId: number): Promise<(CartItemAddon & { addon: MenuItemAddon })[]>;
  addCartItemAddon(addon: InsertCartItemAddon): Promise<CartItemAddon>;
  removeCartItemAddon(id: number): Promise<boolean>;

  // Server Calls
  createServerCall(call: InsertServerCall): Promise<ServerCall>;
  getServerCalls(restaurantId: number): Promise<ServerCall[]>;
  updateServerCallStatus(id: number, status: string): Promise<ServerCall | undefined>;
}

export class MemStorage implements IStorage {
  private restaurants: Map<number, Restaurant>;
  private menuCategories: Map<number, MenuCategory>;
  private menuItems: Map<number, MenuItem>;
  private menuItemAddons: Map<number, MenuItemAddon>;
  private cartItemAddons: Map<number, CartItemAddon>;
  private deals: Map<number, Deal>;
  private cartItems: Map<number, CartItem>;
  private serverCalls: Map<number, ServerCall>;
  private currentId: number;

  constructor() {
    this.restaurants = new Map();
    this.menuCategories = new Map();
    this.menuItems = new Map();
    this.menuItemAddons = new Map();
    this.cartItemAddons = new Map();
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
      }, {
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
        id: 6,
        restaurantId: 1,
        categoryId: 1,
        name: "Pan-Seared Scallops",
        description: "Perfectly seared diver scallops with cauliflower purée, pancetta crisps, and microgreens.",
        fullDescription: "Three jumbo diver scallops seared to golden perfection, served atop silky cauliflower purée with crispy pancetta, drizzled with brown butter sauce and garnished with fresh microgreens.", price: 16.99,
        imageUrl: "/assets/images/food/pan-seared-scallops.png",
        rating: 4.9,
        votes: 127,
        upvotes: 119,
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
        votes: 203, upvotes: 188,
        downvotes: 15,
      },
      // Desserts
      {
        id: 7,
        restaurantId: 1,
        categoryId: 3,
        name: "Tiramisu",
        description: "Classic Italian dessert with coffee-soaked ladyfingers, mascarpone cream, and cocoa powder.",
        fullDescription: "Traditional tiramisu made with espresso-soaked ladyfingers, rich mascarpone cream, and dusted with premium Belgian cocoa powder. A perfect end to your Italian dining experience.",
        price: 8.99,
        imageUrl: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
        rating: 4.9,
        votes: 156,
        upvotes: 148,
        downvotes: 8,
      },
      {
        id: 8,
        restaurantId: 1,
        categoryId: 3,
        name: "Panna Cotta",
        description: "Silky vanilla panna cotta with fresh berry compote and candied orange zest.",
        fullDescription: "Delicate vanilla bean panna cotta served with seasonal berry compote and garnished with candied orange zest and fresh mint. Light and refreshing.",
        price: 7.99,
        imageUrl: "https://images.unsplash.com/photo-1488477181946-6428a0291777?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
        rating: 4.7,
        votes: 89,
        upvotes: 82,
        downvotes: 7,
      },
      {
        id: 9,
        restaurantId: 1,
        categoryId: 3,
        name: "Chocolate Lava Cake",
        description: "Warm chocolate cake with molten center, served with vanilla gelato and raspberry coulis.",
        fullDescription: "Decadent chocolate lava cake with a molten chocolate center, served warm with house-made vanilla gelato and fresh raspberry coulis. A chocolate lover's dream.",
        price: 9.99,
        imageUrl: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
        rating: 4.8,
        votes: 234,
        upvotes: 218,
        downvotes: 16,
      },
    ];
    items.forEach(item => this.menuItems.set(item.id, item));

    // Create menu item add-ons
    const addons = [
      // Calamari add-ons
      { id: 1, menuItemId: 1, name: "Extra Marinara", description: "Additional marinara sauce", price: 1.50, category: "sauce", isRequired: false, maxSelections: 3 },
      { id: 2, menuItemId: 1, name: "Spicy Aioli", description: "House-made spicy aioli", price: 2.00, category: "sauce", isRequired: false, maxSelections: 1 },
      { id: 3, menuItemId: 1, name: "Lemon Wedges", description: "Fresh lemon wedges", price: 0.50, category: "side", isRequired: false, maxSelections: 2 },

      // Bruschetta add-ons
      { id: 4, menuItemId: 2, name: "Extra Cheese", description: "Additional ricotta cheese", price: 2.50, category: "cheese", isRequired: false, maxSelections: 1 },
      { id: 5, menuItemId: 2, name: "Balsamic Glaze", description: "Aged balsamic reduction", price: 1.75, category: "sauce", isRequired: false, maxSelections: 1 },

      // Salmon add-ons
      { id: 6, menuItemId: 3, name: "Extra Vegetables", description: "Double portion of seasonal vegetables", price: 4.00, category: "side", isRequired: false, maxSelections: 1 },
      { id: 7, menuItemId: 3, name: "Garlic Butter", description: "Extra garlic herb butter", price: 2.50, category: "sauce", isRequired: false, maxSelections: 2 },
      { id: 8, menuItemId: 3, name: "Lemon Pepper Seasoning", description: "Additional lemon pepper", price: 1.00, category: "spice", isRequired: false, maxSelections: 1 },

      // Risotto add-ons
      { id: 9, menuItemId: 4, name: "Extra Truffle Oil", description: "Additional truffle oil drizzle", price: 3.50, category: "sauce", isRequired: false, maxSelections: 2 },
      { id: 10, menuItemId: 4, name: "Parmesan Cheese", description: "Extra aged parmesan", price: 2.75, category: "cheese", isRequired: false, maxSelections: 1 },
      { id: 11, menuItemId: 4, name: "Wild Mushrooms", description: "Extra mixed wild mushrooms", price: 4.50, category: "topping", isRequired: false, maxSelections: 1 },
      // Burger add-ons
      { id: 12, menuItemId: 5, name: "Bacon", description: "Crispy applewood smoked bacon", price: 3.00, category: "meat", isRequired: false, maxSelections: 2 },
      { id: 13, menuItemId: 5, name: "Extra Cheese", description: "Additional aged cheddar slice", price: 2.00, category: "cheese", isRequired: false, maxSelections: 3 },
      { id: 14, menuItemId: 5, name: "Avocado", description: "Fresh sliced avocado", price: 2.50, category: "topping", isRequired: false, maxSelections: 1 },
      { id: 15, menuItemId: 5, name: "Jalapeños", description: "Fresh or pickled jalapeños", price: 1.50, category: "topping", isRequired: false, maxSelections: 1 },
      { id: 16, menuItemId: 5, name: "Onion Rings", description: "Replace fries with onion rings", price: 3.50, category: "side", isRequired: false, maxSelections: 1 },
      { id: 17, menuItemId: 5, name: "Sweet Potato Fries", description: "Replace fries with sweet potato fries", price: 2.50, category: "side", isRequired: false, maxSelections: 1 },
      { id: 18, menuItemId: 5, name: "Spice Level", description: "How spicy would you like it?", price: 0.00, category: "spice", isRequired: true, maxSelections: 1 },

      // Pan-Seared Scallops add-ons
      { id: 19, menuItemId: 6, name: "Extra Scallop", description: "Add a fourth jumbo scallop", price: 8.00, category: "protein", isRequired: false, maxSelections: 2 },
      { id: 20, menuItemId: 6, name: "Truffle Shavings", description: "Fresh black truffle shavings", price: 12.00, category: "topping", isRequired: false, maxSelections: 1 },
      { id: 21, menuItemId: 6, name: "Crispy Pancetta", description: "Extra crispy pancetta crisps", price: 4.50, category: "meat", isRequired: false, maxSelections: 1 },
      { id: 22, menuItemId: 6, name: "Cauliflower Purée", description: "Extra portion of silky cauliflower purée", price: 3.50, category: "side", isRequired: false, maxSelections: 1 },
      { id: 23, menuItemId: 6, name: "Brown Butter Sauce", description: "Additional brown butter sauce", price: 2.75, category: "sauce", isRequired: false, maxSelections: 2 },
      { id: 24, menuItemId: 6, name: "Microgreens", description: "Premium microgreens medley", price: 3.00, category: "topping", isRequired: false, maxSelections: 1 },

      // Tiramisu add-ons
      { id: 25, menuItemId: 7, name: "Extra Coffee Shot", description: "Additional espresso shot drizzle", price: 2.00, category: "sauce", isRequired: false, maxSelections: 2 },
      { id: 26, menuItemId: 7, name: "Amaretto", description: "Amaretto liqueur enhancement", price: 3.50, category: "sauce", isRequired: false, maxSelections: 1 },
      { id: 27, menuItemId: 7, name: "Dark Chocolate Shavings", description: "Premium dark chocolate shavings", price: 2.50, category: "topping", isRequired: false, maxSelections: 1 },

      // Panna Cotta add-ons
      { id: 28, menuItemId: 8, name: "Extra Berry Compote", description: "Additional seasonal berry compote", price: 2.75, category: "sauce", isRequired: false, maxSelections: 1 },
      { id: 29, menuItemId: 8, name: "Honey Drizzle", description: "Local wildflower honey drizzle", price: 1.50, category: "sauce", isRequired: false, maxSelections: 1 },
      { id: 30, menuItemId: 8, name: "Candied Nuts", description: "Toasted candied almonds", price: 3.00, category: "topping", isRequired: false, maxSelections: 1 },

      // Chocolate Lava Cake add-ons
      { id: 31, menuItemId: 9, name: "Extra Gelato", description: "Additional scoop of vanilla gelato", price: 3.50, category: "side", isRequired: false, maxSelections: 2 },
      { id: 32, menuItemId: 9, name: "Salted Caramel Sauce", description: "House-made salted caramel sauce", price: 2.25, category: "sauce", isRequired: false, maxSelections: 1 },
      { id: 33, menuItemId: 9, name: "Fresh Strawberries", description: "Fresh sliced strawberries", price: 2.50, category: "topping", isRequired: false, maxSelections: 1 },
      { id: 34, menuItemId: 9, name: "Whipped Cream", description: "Fresh whipped cream", price: 1.75, category: "topping", isRequired: false, maxSelections: 1 },
    ];
    addons.forEach(addon => this.menuItemAddons.set(addon.id, addon));

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

    this.currentId = 35;
  }

  // Menu Item Add-ons methods
  async getMenuItemAddons(menuItemId: number): Promise<MenuItemAddon[]> {
    return Array.from(this.menuItemAddons.values())
      .filter(addon => addon.menuItemId === menuItemId);
  }

  async createMenuItemAddon(addon: InsertMenuItemAddon): Promise<MenuItemAddon> {
    const id = this.currentId++;
    const newAddon: MenuItemAddon = {
      ...addon,
      id,
      description: addon.description ?? null,
      isRequired: addon.isRequired ?? null,
      maxSelections: addon.maxSelections ?? null,
    };
    this.menuItemAddons.set(id, newAddon);
    return newAddon;
  }

  // Cart Item Add-ons methods
  async getCartItemAddons(cartItemId: number): Promise<(CartItemAddon & { addon: MenuItemAddon })[]> {
    const cartAddons = Array.from(this.cartItemAddons.values())
      .filter(cartAddon => cartAddon.cartItemId === cartItemId);

    const addonsWithDetails = [];
    for (const cartAddon of cartAddons) {
      const addon = this.menuItemAddons.get(cartAddon.addonId);
      if (addon) {
        addonsWithDetails.push({ ...cartAddon, addon });
      }
    }

    return addonsWithDetails;
  }

  async addCartItemAddon(addon: InsertCartItemAddon): Promise<CartItemAddon> {
    const id = this.currentId++;
    const newCartAddon: CartItemAddon = {
      ...addon,
      id,
      quantity: addon.quantity ?? null,
    };
    this.cartItemAddons.set(id, newCartAddon);
    return newCartAddon;
  }

  async removeCartItemAddon(id: number): Promise<boolean> {
    return this.cartItemAddons.delete(id);
  }

  async getRestaurants(): Promise<Restaurant[]> {
    return Array.from(this.restaurants.values());
  }

  async getRestaurant(id: number): Promise<Restaurant | undefined> {
    return this.restaurants.get(id);
  }

  async createRestaurant(restaurant: InsertRestaurant): Promise<Restaurant> {
    const id = this.currentId++;
    const newRestaurant: Restaurant = {
      ...restaurant,
      id,
      description: restaurant.description ?? null,
      imageUrl: restaurant.imageUrl ?? null,
      priceRange: restaurant.priceRange ?? null,
      distance: restaurant.distance ?? null,
      isHiddenGem: restaurant.isHiddenGem ?? null,
      isTrending: restaurant.isTrending ?? null,
      isLocalFavorite: restaurant.isLocalFavorite ?? null,
      rating: null,
      votePercentage: null,
    };
    this.restaurants.set(id, newRestaurant);
    return newRestaurant;
  }

  async getMenuCategories(restaurantId: number): Promise<MenuCategory[]> {
    return Array.from(this.menuCategories.values())
      .filter(cat => cat.restaurantId === restaurantId)
      .sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity));
  }

  async createMenuCategory(category: InsertMenuCategory): Promise<MenuCategory> {
    const id = this.currentId++;
    const newCategory: MenuCategory = {
      ...category,
      id,
      order: category.order ?? null,
    };
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
    const newItem: MenuItem = {
      ...item,
      id,
      description: item.description ?? null,
      imageUrl: item.imageUrl ?? null,
      fullDescription: item.fullDescription ?? null,
      rating: 0,
      votes: 0,
      upvotes: 0,
      downvotes: 0,
    };
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
    const newDeal: Deal = {
      ...deal,
      id,
      restaurantId: deal.restaurantId ?? null,
      discountType: deal.discountType ?? null,
      discountValue: deal.discountValue ?? null,
      validUntil: deal.validUntil ?? null,
      backgroundColor: deal.backgroundColor ?? null,
      isGlobal: deal.isGlobal ?? null,
    };
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
      quantity: item.quantity ?? null,
      specialInstructions: item.specialInstructions ?? null,
      addedAt: new Date()
    };
    this.cartItems.set(id, newItem);
    return newItem;
  }

  async updateCartItem(id: number, quantity: number, specialInstructions?: string): Promise<CartItem | undefined> {
    const item = this.cartItems.get(id);
    if (!item) return undefined;

    const updatedItem: CartItem = { // Ensure updatedItem conforms to CartItem
      ...item,
      quantity,
      specialInstructions: specialInstructions ?? null
    };
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
      status: call.status ?? null,
      createdAt: new Date()
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
