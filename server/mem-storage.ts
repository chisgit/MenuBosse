import {
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
  type InsertServerCall,
  type TableSession,
  type InsertTableSession,
  type Order,
  type InsertOrder
} from "@shared/schema";
import type { IStorage } from './storage';

// In-memory data store
export class MemStorage implements IStorage {
  private restaurants: Restaurant[] = [];
  private menuCategories: MenuCategory[] = [];
  private menuItems: MenuItem[] = [];
  private menuItemAddons: MenuItemAddon[] = [];
  private deals: Deal[] = [];
  private cartItems: CartItem[] = [];
  private cartItemAddons: CartItemAddon[] = [];
  private serverCalls: ServerCall[] = [];
  private tableSessions: TableSession[] = [];
  private orders: Order[] = [];

  private nextRestaurantId = 1;
  private nextMenuCategoryId = 1;
  private nextMenuItemId = 1;
  private nextMenuItemAddonId = 1;
  private nextDealId = 1;
  private nextCartItemId = 1;
  private nextCartItemAddonId = 1;
  private nextServerCallId = 1;
  private nextTableSessionId = 1;
  private nextOrderId = 1;

  constructor() {
    this.seed();
  }

  private seed() {
    // Seed with some initial data
    this.createRestaurant({ name: "The Gilded Spoon", cuisine: "Modern American" });
    this.createMenuCategory({ restaurantId: 1, name: 'Appetizers', order: 1 });
    this.createMenuCategory({ restaurantId: 1, name: 'Main Courses', order: 2 });
    this.createMenuCategory({ restaurantId: 1, name: 'Desserts', order: 3 });

    this.createMenuItem({ restaurantId: 1, categoryId: 1, name: 'Tuna Tartare', description: 'Fresh Ahi tuna with avocado and soy-lime dressing.', price: 18 });
    this.createMenuItem({ restaurantId: 1, categoryId: 2, name: 'Pan-Seared Scallops', description: 'With saffron risotto and asparagus.', price: 34, imageUrl: '/assets/images/food/pan-seared-scallops.png' });
    this.createMenuItem({ restaurantId: 1, categoryId: 3, name: 'Chocolate Lava Cake', description: 'Warm chocolate cake with a molten center.', price: 12 });
  }

  // Restaurants
  async getRestaurants(): Promise<Restaurant[]> {
    return this.restaurants;
  }

  async getRestaurant(id: number): Promise<Restaurant | undefined> {
    return this.restaurants.find(r => r.id === id);
  }

  async createRestaurant(restaurant: InsertRestaurant): Promise<Restaurant> {
    const newRestaurant: Restaurant = {
      id: this.nextRestaurantId++,
      ...restaurant,
      rating: 0,
      votePercentage: 0,
      priceRange: null,
      distance: null,
      isHiddenGem: false,
      isTrending: false,
      isLocalFavorite: false,
      description: restaurant.description || null,
      imageUrl: restaurant.imageUrl || null,
    };
    this.restaurants.push(newRestaurant);
    return newRestaurant;
  }

  // Menu Categories
  async getMenuCategories(restaurantId: number): Promise<MenuCategory[]> {
    return this.menuCategories.filter(mc => mc.restaurantId === restaurantId);
  }

  async createMenuCategory(category: InsertMenuCategory): Promise<MenuCategory> {
    const newCategory: MenuCategory = {
      id: this.nextMenuCategoryId++,
      ...category,
      order: category.order || 0,
    };
    this.menuCategories.push(newCategory);
    return newCategory;
  }

  // Menu Items
  async getMenuItems(restaurantId: number): Promise<MenuItem[]> {
    return this.menuItems.filter(mi => mi.restaurantId === restaurantId);
  }

  async getMenuItemsByCategory(categoryId: number): Promise<MenuItem[]> {
    return this.menuItems.filter(mi => mi.categoryId === categoryId);
  }

  async getMenuItem(id: number): Promise<MenuItem | undefined> {
    return this.menuItems.find(mi => mi.id === id);
  }

  async createMenuItem(item: InsertMenuItem): Promise<MenuItem> {
    const newItem: MenuItem = {
      id: this.nextMenuItemId++,
      ...item,
      description: item.description || null,
      fullDescription: item.fullDescription || null,
      imageUrl: item.imageUrl || null,
      rating: 0,
      votes: 0,
      upvotes: 0,
      downvotes: 0,
    };
    this.menuItems.push(newItem);
    return newItem;
  }

  async updateMenuItemVotes(id: number, upvotes: number, downvotes: number): Promise<MenuItem | undefined> {
    const item = this.menuItems.find(mi => mi.id === id);
    if (item) {
      item.upvotes = upvotes;
      item.downvotes = downvotes;
    }
    return item;
  }

  // Deals
  async getDeals(): Promise<Deal[]> {
    return this.deals;
  }

  async getRestaurantDeals(restaurantId: number): Promise<Deal[]> {
    return this.deals.filter(d => d.restaurantId === restaurantId);
  }

  async createDeal(deal: InsertDeal): Promise<Deal> {
    const newDeal: Deal = {
      id: this.nextDealId++,
      ...deal,
      restaurantId: deal.restaurantId || null,
      discountType: deal.discountType || null,
      discountValue: deal.discountValue || null,
      validUntil: deal.validUntil || null,
      backgroundColor: deal.backgroundColor || null,
      isGlobal: deal.isGlobal || false,
    };
    this.deals.push(newDeal);
    return newDeal;
  }

  // Cart
  async getCartItems(sessionId: string): Promise<(CartItem & { menuItem: MenuItem; addons: (CartItemAddon & { addon: MenuItemAddon })[] })[]> {
    const items = this.cartItems.filter(ci => ci.sessionId === sessionId);
    const result: (CartItem & { menuItem: MenuItem; addons: (CartItemAddon & { addon: MenuItemAddon })[] })[] = [];
    for (const item of items) {
      const menuItem = await this.getMenuItem(item.menuItemId);
      if (menuItem) {
        const addons = await this.getCartItemAddons(item.id);
        result.push({ ...item, menuItem, addons });
      }
    }
    return result;
  }

  async addToCart(item: InsertCartItem, addons: number[] = []): Promise<CartItem> {
    const newCartItem: CartItem = {
      id: this.nextCartItemId++,
      ...item,
      quantity: item.quantity || 1,
      specialInstructions: item.specialInstructions || null,
      status: 'cart',
      orderId: null,
      addedAt: new Date(),
      orderedAt: null,
    };
    this.cartItems.push(newCartItem);
    for (const addonId of addons) {
      await this.addCartItemAddon({ cartItemId: newCartItem.id, addonId, quantity: 1 });
    }
    return newCartItem;
  }

  async updateCartItem(id: number, quantity: number, specialInstructions?: string): Promise<CartItem | undefined> {
    const item = this.cartItems.find(ci => ci.id === id);
    if (item) {
      item.quantity = quantity;
      if (specialInstructions) {
        item.specialInstructions = specialInstructions;
      }
    }
    return item;
  }

  async removeFromCart(id: number): Promise<boolean> {
    const index = this.cartItems.findIndex(ci => ci.id === id);
    if (index > -1) {
      this.cartItems.splice(index, 1);
      return true;
    }
    return false;
  }

  async clearCart(sessionId: string): Promise<boolean> {
    const initialLength = this.cartItems.length;
    this.cartItems = this.cartItems.filter(ci => ci.sessionId !== sessionId);
    return this.cartItems.length < initialLength;
  }

  // Menu Item Add-ons
  async getMenuItemAddons(menuItemId: number): Promise<MenuItemAddon[]> {
    return this.menuItemAddons.filter(mia => mia.menuItemId === menuItemId);
  }

  async createMenuItemAddon(addon: InsertMenuItemAddon): Promise<MenuItemAddon> {
    const newAddon: MenuItemAddon = {
      id: this.nextMenuItemAddonId++,
      ...addon,
      description: addon.description || null,
      isRequired: addon.isRequired || false,
      maxSelections: addon.maxSelections || 1,
    };
    this.menuItemAddons.push(newAddon);
    return newAddon;
  }

  // Cart Item Add-ons
  async getCartItemAddons(cartItemId: number): Promise<(CartItemAddon & { addon: MenuItemAddon })[]> {
    const items = this.cartItemAddons.filter(cia => cia.cartItemId === cartItemId);
    const result: (CartItemAddon & { addon: MenuItemAddon })[] = [];
    for (const item of items) {
      const addon = this.menuItemAddons.find(mia => mia.id === item.addonId);
      if (addon) {
        result.push({ ...item, addon });
      }
    }
    return result;
  }

  async addCartItemAddon(addon: InsertCartItemAddon): Promise<CartItemAddon> {
    const newAddon: CartItemAddon = {
      id: this.nextCartItemAddonId++,
      ...addon,
      quantity: addon.quantity || 1
    };
    this.cartItemAddons.push(newAddon);
    return newAddon;
  }

  async removeCartItemAddon(id: number): Promise<boolean> {
    const index = this.cartItemAddons.findIndex(cia => cia.id === id);
    if (index > -1) {
      this.cartItemAddons.splice(index, 1);
      return true;
    }
    return false;
  }

  // Server Calls
  async createServerCall(call: InsertServerCall): Promise<ServerCall> {
    const newCall: ServerCall = {
      id: this.nextServerCallId++,
      ...call,
      status: 'pending',
      createdAt: new Date(),
    };
    this.serverCalls.push(newCall);
    return newCall;
  }

  async getServerCalls(restaurantId: number): Promise<ServerCall[]> {
    return this.serverCalls.filter(sc => sc.restaurantId === restaurantId);
  }

  async updateServerCallStatus(id: number, status: string): Promise<ServerCall | undefined> {
    const call = this.serverCalls.find(sc => sc.id === id);
    if (call) {
      call.status = status;
    }
    return call;
  }

  // Table Sessions
  async createTableSession(session: InsertTableSession): Promise<TableSession> {
    const newSession: TableSession = {
      id: this.nextTableSessionId++,
      ...session,
      status: 'active',
      createdAt: new Date(),
      closedAt: null,
      totalAmount: null,
      paymentMethod: null,
    };
    this.tableSessions.push(newSession);
    return newSession;
  }

  async getTableSession(sessionId: string): Promise<TableSession | undefined> {
    return this.tableSessions.find(ts => ts.sessionId === sessionId);
  }

  async updateTableSessionStatus(sessionId: string, status: string, paymentMethod?: string): Promise<TableSession | undefined> {
    const session = this.tableSessions.find(ts => ts.sessionId === sessionId);
    if (session) {
      session.status = status;
      if (paymentMethod) {
        session.paymentMethod = paymentMethod;
      }
      if (status === 'closed' || status === 'paid') {
        session.closedAt = new Date();
      }
    }
    return session;
  }

  // Orders
  async createOrder(order: InsertOrder): Promise<Order> {
    const newOrder: Order = {
      id: this.nextOrderId++,
      ...order,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.orders.push(newOrder);
    return newOrder;
  }

  async getOrdersBySession(sessionId: string): Promise<Order[]> {
    return this.orders.filter(o => o.sessionId === sessionId);
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const order = this.orders.find(o => o.id === id);
    if (order) {
      order.status = status;
      order.updatedAt = new Date();
    }
    return order;
  }

  async convertCartToOrder(sessionId: string): Promise<Order> {
    const itemsInCart = await this.getCartItems(sessionId);
    if (itemsInCart.length === 0) {
      throw new Error("Cart is empty");
    }

    const totalAmount = itemsInCart.reduce((sum, item) => {
      const addonsPrice = item.addons.reduce((addonSum, addon) => addonSum + addon.addon.price * (addon.quantity ?? 1), 0);
      return sum + (item.menuItem.price * (item.quantity || 1)) + addonsPrice;
    }, 0);

    const order = await this.createOrder({
      sessionId,
      totalAmount,
      status: "pending",
    });

    for (const item of itemsInCart) {
      item.orderId = order.id;
      item.status = 'ordered';
      item.orderedAt = new Date();
    }

    return order;
  }
}