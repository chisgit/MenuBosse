import { db } from './db';
import {
  restaurants,
  menuCategories,
  menuItems,
  menuItemAddons,
  cartItemAddons,
  deals,
  cartItems,
  serverCalls,
  tableSessions,
  orders,
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
  type InsertOrder,
} from '@shared/schema';
import type { IStorage } from './storage';
import { eq, and } from 'drizzle-orm';

export class DbStorage implements IStorage {
  async getRestaurants(): Promise<Restaurant[]> {
    return db.select().from(restaurants);
  }

  async getRestaurant(id: number): Promise<Restaurant | undefined> {
    const result = await db.select().from(restaurants).where(eq(restaurants.id, id));
    return result[0];
  }

  async createRestaurant(restaurant: InsertRestaurant): Promise<Restaurant> {
    const result = await db.insert(restaurants).values(restaurant).returning();
    return result[0];
  }

  async getMenuCategories(restaurantId: number): Promise<MenuCategory[]> {
    return db.select().from(menuCategories).where(eq(menuCategories.restaurantId, restaurantId));
  }

  async createMenuCategory(category: InsertMenuCategory): Promise<MenuCategory> {
    const result = await db.insert(menuCategories).values(category).returning();
    return result[0];
  }

  async getMenuItems(restaurantId: number): Promise<MenuItem[]> {
    return db.select().from(menuItems).where(eq(menuItems.restaurantId, restaurantId));
  }

  async getMenuItemsByCategory(categoryId: number): Promise<MenuItem[]> {
    return db.select().from(menuItems).where(eq(menuItems.categoryId, categoryId));
  }

  async getMenuItem(id: number): Promise<MenuItem | undefined> {
    const result = await db.select().from(menuItems).where(eq(menuItems.id, id));
    return result[0];
  }

  async createMenuItem(item: InsertMenuItem): Promise<MenuItem> {
    const result = await db.insert(menuItems).values(item).returning();
    return result[0];
  }

  async updateMenuItemVotes(id: number, upvotes: number, downvotes: number): Promise<MenuItem | undefined> {
    const result = await db.update(menuItems).set({ upvotes, downvotes }).where(eq(menuItems.id, id)).returning();
    return result[0];
  }

  async getDeals(): Promise<Deal[]> {
    return db.select().from(deals);
  }

  async getRestaurantDeals(restaurantId: number): Promise<Deal[]> {
    return db.select().from(deals).where(eq(deals.restaurantId, restaurantId));
  }

  async createDeal(deal: InsertDeal): Promise<Deal> {
    const result = await db.insert(deals).values(deal).returning();
    return result[0];
  }

  async getCartItems(sessionId: string): Promise<(CartItem & { menuItem: MenuItem; addons: (CartItemAddon & { addon: MenuItemAddon })[] })[]> {
    const items = await db.select().from(cartItems).where(eq(cartItems.sessionId, sessionId));
    const result: (CartItem & { menuItem: MenuItem; addons: (CartItemAddon & { addon: MenuItemAddon })[] })[] = [];
    for (const item of items) {
      const menuItemResult = await db.select().from(menuItems).where(eq(menuItems.id, item.menuItemId));
      if (menuItemResult[0]) {
        const itemAddons = await this.getCartItemAddons(item.id);
        result.push({ ...item, menuItem: menuItemResult[0], addons: itemAddons });
      }
    }
    return result;
  }

  async addToCart(item: InsertCartItem, addons: number[] = []): Promise<CartItem> {
    const result = await db.insert(cartItems).values(item).returning();
    const cartItem = result[0];
    for (const addonId of addons) {
      await this.addCartItemAddon({ cartItemId: cartItem.id, addonId });
    }
    return cartItem;
  }

  async updateCartItem(id: number, quantity: number, specialInstructions?: string): Promise<CartItem | undefined> {
    const result = await db.update(cartItems).set({ quantity, specialInstructions }).where(eq(cartItems.id, id)).returning();
    return result[0];
  }

  async removeFromCart(id: number): Promise<boolean> {
    const result = await db.delete(cartItems).where(eq(cartItems.id, id)).returning();
    return result.length > 0;
  }

  async clearCart(sessionId: string): Promise<boolean> {
    const result = await db.delete(cartItems).where(eq(cartItems.sessionId, sessionId)).returning();
    return result.length > 0;
  }

  async getMenuItemAddons(menuItemId: number): Promise<MenuItemAddon[]> {
    return db.select().from(menuItemAddons).where(eq(menuItemAddons.menuItemId, menuItemId));
  }

  async createMenuItemAddon(addon: InsertMenuItemAddon): Promise<MenuItemAddon> {
    const result = await db.insert(menuItemAddons).values(addon).returning();
    return result[0];
  }

  async getCartItemAddons(cartItemId: number): Promise<(CartItemAddon & { addon: MenuItemAddon; })[]> {
    const cAddons = await db.select().from(cartItemAddons).where(eq(cartItemAddons.cartItemId, cartItemId));
    const result: (CartItemAddon & { addon: MenuItemAddon })[] = [];
    for (const ca of cAddons) {
        const addonResult = await db.select().from(menuItemAddons).where(eq(menuItemAddons.id, ca.addonId));
        if (addonResult[0]) {
            result.push({ ...ca, addon: addonResult[0] });
        }
    }
    return result;
  }

  async addCartItemAddon(addon: InsertCartItemAddon): Promise<CartItemAddon> {
    const result = await db.insert(cartItemAddons).values(addon).returning();
    return result[0];
  }

  async removeCartItemAddon(id: number): Promise<boolean> {
    const result = await db.delete(cartItemAddons).where(eq(cartItemAddons.id, id)).returning();
    return result.length > 0;
  }

  async createServerCall(call: InsertServerCall): Promise<ServerCall> {
    const result = await db.insert(serverCalls).values(call).returning();
    return result[0];
  }

  async getServerCalls(restaurantId: number): Promise<ServerCall[]> {
    return db.select().from(serverCalls).where(eq(serverCalls.restaurantId, restaurantId));
  }

  async updateServerCallStatus(id: number, status: string): Promise<ServerCall | undefined> {
    const result = await db.update(serverCalls).set({ status }).where(eq(serverCalls.id, id)).returning();
    return result[0];
  }

  async createTableSession(session: InsertTableSession): Promise<TableSession> {
    const result = await db.insert(tableSessions).values(session).returning();
    return result[0];
  }

  async getTableSession(sessionId: string): Promise<TableSession | undefined> {
    const result = await db.select().from(tableSessions).where(eq(tableSessions.sessionId, sessionId));
    return result[0];
  }

  async updateTableSessionStatus(sessionId: string, status: string, paymentMethod?: string): Promise<TableSession | undefined> {
    const result = await db.update(tableSessions).set({ status, paymentMethod }).where(eq(tableSessions.sessionId, sessionId)).returning();
    return result[0];
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const result = await db.insert(orders).values(order).returning();
    return result[0];
  }

  async getOrdersBySession(sessionId: string): Promise<Order[]> {
    return db.select().from(orders).where(eq(orders.sessionId, sessionId));
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const result = await db.update(orders).set({ status }).where(eq(orders.id, id)).returning();
    return result[0];
  }

  async convertCartToOrder(sessionId: string): Promise<Order> {
    const cartItems = await this.getCartItems(sessionId);
    const totalAmount = cartItems.reduce((sum, item) => {
      const addonsPrice = item.addons.reduce((addonSum, addon) => addonSum + addon.addon.price * (addon.quantity ?? 1), 0);
      return sum + (item.menuItem.price * (item.quantity || 1)) + addonsPrice;
    }, 0);

    const order: InsertOrder = {
      sessionId,
      status: "pending",
      totalAmount,
    };

    const newOrder = await this.createOrder(order);

    // Update cart items to reference the order and change status
    for (const cartItem of cartItems) {
        await this.updateCartItem(cartItem.id, cartItem.quantity || 1, cartItem.specialInstructions || undefined);
        const result = await db.update(cartItems).set({ status: 'ordered', orderId: newOrder.id, orderedAt: new Date() }).where(eq(cartItems.id, cartItem.id)).returning();
    }

    return newOrder;
  }
}
