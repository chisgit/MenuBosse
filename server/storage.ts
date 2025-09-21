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
  type InsertOrder
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
  getCartItems(sessionId: string): Promise<(CartItem & { menuItem: MenuItem; addons: (CartItemAddon & { addon: MenuItemAddon })[] })[]>;
  addToCart(item: InsertCartItem, addons?: number[]): Promise<CartItem>;
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

  // Table Sessions
  createTableSession(session: InsertTableSession): Promise<TableSession>;
  getTableSession(sessionId: string): Promise<TableSession | undefined>;
  updateTableSessionStatus(sessionId: string, status: string, paymentMethod?: string): Promise<TableSession | undefined>;

  // Orders
  createOrder(order: InsertOrder): Promise<Order>;
  getOrdersBySession(sessionId: string): Promise<Order[]>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;
  convertCartToOrder(sessionId: string): Promise<Order>;
}

import { DbStorage } from "./db-storage";

export const storage = new DbStorage();
