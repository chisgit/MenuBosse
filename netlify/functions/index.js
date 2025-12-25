// server/index.ts
import express2 from "express";
import cors from "cors";

// server/routes.ts
import { createServer } from "http";

// server/mem-storage.ts
var MemStorage = class {
  restaurants = [];
  menuCategories = [];
  menuItems = [];
  menuItemAddons = [];
  deals = [];
  cartItems = [];
  cartItemAddons = [];
  serverCalls = [];
  tableSessions = [];
  orders = [];
  nextRestaurantId = 1;
  nextMenuCategoryId = 1;
  nextMenuItemId = 1;
  nextMenuItemAddonId = 1;
  nextDealId = 1;
  nextCartItemId = 1;
  nextCartItemAddonId = 1;
  nextServerCallId = 1;
  nextTableSessionId = 1;
  nextOrderId = 1;
  constructor() {
    this.seed();
  }
  seed() {
    this.createRestaurant({ name: "The Gilded Spoon", cuisine: "Modern American" });
    this.createMenuCategory({ restaurantId: 1, name: "Appetizers", order: 1 });
    this.createMenuCategory({ restaurantId: 1, name: "Main Courses", order: 2 });
    this.createMenuCategory({ restaurantId: 1, name: "Desserts", order: 3 });
    this.createMenuItem({ restaurantId: 1, categoryId: 1, name: "Tuna Tartare", description: "Fresh Ahi tuna with avocado and soy-lime dressing.", price: 18 });
    this.createMenuItem({ restaurantId: 1, categoryId: 2, name: "Pan-Seared Scallops", description: "With saffron risotto and asparagus.", price: 34, imageUrl: "/assets/images/food/pan-seared-scallops.png" });
    this.createMenuItem({ restaurantId: 1, categoryId: 3, name: "Chocolate Lava Cake", description: "Warm chocolate cake with a molten center.", price: 12 });
  }
  // Restaurants
  async getRestaurants() {
    return this.restaurants;
  }
  async getRestaurant(id) {
    return this.restaurants.find((r) => r.id === id);
  }
  async createRestaurant(restaurant) {
    const newRestaurant = {
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
      imageUrl: restaurant.imageUrl || null
    };
    this.restaurants.push(newRestaurant);
    return newRestaurant;
  }
  // Menu Categories
  async getMenuCategories(restaurantId) {
    return this.menuCategories.filter((mc) => mc.restaurantId === restaurantId);
  }
  async createMenuCategory(category) {
    const newCategory = {
      id: this.nextMenuCategoryId++,
      ...category,
      order: category.order || 0
    };
    this.menuCategories.push(newCategory);
    return newCategory;
  }
  // Menu Items
  async getMenuItems(restaurantId) {
    return this.menuItems.filter((mi) => mi.restaurantId === restaurantId);
  }
  async getMenuItemsByCategory(categoryId) {
    return this.menuItems.filter((mi) => mi.categoryId === categoryId);
  }
  async getMenuItem(id) {
    return this.menuItems.find((mi) => mi.id === id);
  }
  async createMenuItem(item) {
    const newItem = {
      id: this.nextMenuItemId++,
      ...item,
      description: item.description || null,
      fullDescription: item.fullDescription || null,
      imageUrl: item.imageUrl || null,
      rating: 0,
      votes: 0,
      upvotes: 0,
      downvotes: 0
    };
    this.menuItems.push(newItem);
    return newItem;
  }
  async updateMenuItemVotes(id, upvotes, downvotes) {
    const item = this.menuItems.find((mi) => mi.id === id);
    if (item) {
      item.upvotes = upvotes;
      item.downvotes = downvotes;
    }
    return item;
  }
  // Deals
  async getDeals() {
    return this.deals;
  }
  async getRestaurantDeals(restaurantId) {
    return this.deals.filter((d) => d.restaurantId === restaurantId);
  }
  async createDeal(deal) {
    const newDeal = {
      id: this.nextDealId++,
      ...deal,
      restaurantId: deal.restaurantId || null,
      discountType: deal.discountType || null,
      discountValue: deal.discountValue || null,
      validUntil: deal.validUntil || null,
      backgroundColor: deal.backgroundColor || null,
      isGlobal: deal.isGlobal || false
    };
    this.deals.push(newDeal);
    return newDeal;
  }
  // Cart
  async getCartItems(sessionId) {
    const items = this.cartItems.filter((ci) => ci.sessionId === sessionId);
    const result = [];
    for (const item of items) {
      const menuItem = await this.getMenuItem(item.menuItemId);
      if (menuItem) {
        const addons = await this.getCartItemAddons(item.id);
        result.push({ ...item, menuItem, addons });
      }
    }
    return result;
  }
  async addToCart(item, addons = []) {
    const newCartItem = {
      id: this.nextCartItemId++,
      ...item,
      quantity: item.quantity || 1,
      specialInstructions: item.specialInstructions || null,
      status: "cart",
      orderId: null,
      addedAt: /* @__PURE__ */ new Date(),
      orderedAt: null
    };
    this.cartItems.push(newCartItem);
    for (const addonId of addons) {
      await this.addCartItemAddon({ cartItemId: newCartItem.id, addonId, quantity: 1 });
    }
    return newCartItem;
  }
  async updateCartItem(id, quantity, specialInstructions) {
    const item = this.cartItems.find((ci) => ci.id === id);
    if (item) {
      item.quantity = quantity;
      if (specialInstructions) {
        item.specialInstructions = specialInstructions;
      }
    }
    return item;
  }
  async removeFromCart(id) {
    const index = this.cartItems.findIndex((ci) => ci.id === id);
    if (index > -1) {
      this.cartItems.splice(index, 1);
      return true;
    }
    return false;
  }
  async clearCart(sessionId) {
    const initialLength = this.cartItems.length;
    this.cartItems = this.cartItems.filter((ci) => ci.sessionId !== sessionId);
    return this.cartItems.length < initialLength;
  }
  // Menu Item Add-ons
  async getMenuItemAddons(menuItemId) {
    return this.menuItemAddons.filter((mia) => mia.menuItemId === menuItemId);
  }
  async createMenuItemAddon(addon) {
    const newAddon = {
      id: this.nextMenuItemAddonId++,
      ...addon,
      description: addon.description || null,
      isRequired: addon.isRequired || false,
      maxSelections: addon.maxSelections || 1
    };
    this.menuItemAddons.push(newAddon);
    return newAddon;
  }
  // Cart Item Add-ons
  async getCartItemAddons(cartItemId) {
    const items = this.cartItemAddons.filter((cia) => cia.cartItemId === cartItemId);
    const result = [];
    for (const item of items) {
      const addon = this.menuItemAddons.find((mia) => mia.id === item.addonId);
      if (addon) {
        result.push({ ...item, addon });
      }
    }
    return result;
  }
  async addCartItemAddon(addon) {
    const newAddon = {
      id: this.nextCartItemAddonId++,
      ...addon,
      quantity: addon.quantity || 1
    };
    this.cartItemAddons.push(newAddon);
    return newAddon;
  }
  async removeCartItemAddon(id) {
    const index = this.cartItemAddons.findIndex((cia) => cia.id === id);
    if (index > -1) {
      this.cartItemAddons.splice(index, 1);
      return true;
    }
    return false;
  }
  // Server Calls
  async createServerCall(call) {
    const newCall = {
      id: this.nextServerCallId++,
      ...call,
      status: "pending",
      createdAt: /* @__PURE__ */ new Date()
    };
    this.serverCalls.push(newCall);
    return newCall;
  }
  async getServerCalls(restaurantId) {
    return this.serverCalls.filter((sc) => sc.restaurantId === restaurantId);
  }
  async updateServerCallStatus(id, status) {
    const call = this.serverCalls.find((sc) => sc.id === id);
    if (call) {
      call.status = status;
    }
    return call;
  }
  // Table Sessions
  async createTableSession(session) {
    const newSession = {
      id: this.nextTableSessionId++,
      ...session,
      status: "active",
      createdAt: /* @__PURE__ */ new Date(),
      closedAt: null,
      totalAmount: null,
      paymentMethod: null
    };
    this.tableSessions.push(newSession);
    return newSession;
  }
  async getTableSession(sessionId) {
    return this.tableSessions.find((ts) => ts.sessionId === sessionId);
  }
  async updateTableSessionStatus(sessionId, status, paymentMethod) {
    const session = this.tableSessions.find((ts) => ts.sessionId === sessionId);
    if (session) {
      session.status = status;
      if (paymentMethod) {
        session.paymentMethod = paymentMethod;
      }
      if (status === "closed" || status === "paid") {
        session.closedAt = /* @__PURE__ */ new Date();
      }
    }
    return session;
  }
  // Orders
  async createOrder(order) {
    const newOrder = {
      id: this.nextOrderId++,
      ...order,
      status: "pending",
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.orders.push(newOrder);
    return newOrder;
  }
  async getOrdersBySession(sessionId) {
    return this.orders.filter((o) => o.sessionId === sessionId);
  }
  async updateOrderStatus(id, status) {
    const order = this.orders.find((o) => o.id === id);
    if (order) {
      order.status = status;
      order.updatedAt = /* @__PURE__ */ new Date();
    }
    return order;
  }
  async convertCartToOrder(sessionId) {
    const itemsInCart = await this.getCartItems(sessionId);
    if (itemsInCart.length === 0) {
      throw new Error("Cart is empty");
    }
    const totalAmount = itemsInCart.reduce((sum, item) => {
      const addonsPrice = item.addons.reduce((addonSum, addon) => addonSum + addon.addon.price * (addon.quantity ?? 1), 0);
      return sum + item.menuItem.price * (item.quantity || 1) + addonsPrice;
    }, 0);
    const order = await this.createOrder({
      sessionId,
      totalAmount,
      status: "pending"
    });
    for (const item of itemsInCart) {
      item.orderId = order.id;
      item.status = "ordered";
      item.orderedAt = /* @__PURE__ */ new Date();
    }
    return order;
  }
};

// server/storage.ts
var storage = new MemStorage();

// shared/schema.ts
import { pgTable, text, serial, integer, boolean, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var restaurants = pgTable("restaurants", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  cuisine: text("cuisine").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  rating: real("rating").default(0),
  votePercentage: integer("vote_percentage").default(0),
  priceRange: text("price_range"),
  // $, $$, $$$
  distance: real("distance"),
  // in miles
  isHiddenGem: boolean("is_hidden_gem").default(false),
  isTrending: boolean("is_trending").default(false),
  isLocalFavorite: boolean("is_local_favorite").default(false)
});
var menuCategories = pgTable("menu_categories", {
  id: serial("id").primaryKey(),
  restaurantId: integer("restaurant_id").notNull(),
  name: text("name").notNull(),
  order: integer("order").default(0)
});
var menuItems = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  restaurantId: integer("restaurant_id").notNull(),
  categoryId: integer("category_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  fullDescription: text("full_description"),
  price: real("price").notNull(),
  imageUrl: text("image_url"),
  rating: real("rating").default(0),
  votes: integer("votes").default(0),
  upvotes: integer("upvotes").default(0),
  downvotes: integer("downvotes").default(0)
});
var deals = pgTable("deals", {
  id: serial("id").primaryKey(),
  restaurantId: integer("restaurant_id"),
  title: text("title").notNull(),
  description: text("description").notNull(),
  discountType: text("discount_type"),
  // percentage, amount, bogo, etc
  discountValue: text("discount_value"),
  validUntil: text("valid_until"),
  backgroundColor: text("background_color"),
  isGlobal: boolean("is_global").default(false)
});
var cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  menuItemId: integer("menu_item_id").notNull(),
  quantity: integer("quantity").default(1),
  specialInstructions: text("special_instructions"),
  status: text("status").default("cart"),
  // cart, ordered, preparing, ready, served
  orderId: integer("order_id"),
  // Reference to order when status changes from cart
  addedAt: timestamp("added_at").defaultNow(),
  orderedAt: timestamp("ordered_at")
});
var menuItemAddons = pgTable("menu_item_addons", {
  id: serial("id").primaryKey(),
  menuItemId: integer("menu_item_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  price: real("price").notNull(),
  category: text("category").notNull(),
  // cheese, meat, sauce, spice, side, etc
  isRequired: boolean("is_required").default(false),
  maxSelections: integer("max_selections").default(1)
});
var cartItemAddons = pgTable("cart_item_addons", {
  id: serial("id").primaryKey(),
  cartItemId: integer("cart_item_id").notNull(),
  addonId: integer("addon_id").notNull(),
  quantity: integer("quantity").default(1)
});
var serverCalls = pgTable("server_calls", {
  id: serial("id").primaryKey(),
  restaurantId: integer("restaurant_id").notNull(),
  tableNumber: text("table_number").notNull(),
  status: text("status").default("pending"),
  // pending, acknowledged, completed
  createdAt: timestamp("created_at").defaultNow()
});
var tableSessions = pgTable("table_sessions", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull().unique(),
  restaurantId: integer("restaurant_id").notNull(),
  tableNumber: text("table_number").notNull(),
  status: text("status").default("active"),
  // active, ordered, paid, closed
  createdAt: timestamp("created_at").defaultNow(),
  closedAt: timestamp("closed_at"),
  totalAmount: real("total_amount"),
  paymentMethod: text("payment_method")
  // app, cash, card
});
var orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  status: text("status").default("pending"),
  // pending, confirmed, preparing, ready, served
  totalAmount: real("total_amount").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var insertRestaurantSchema = createInsertSchema(restaurants).omit({
  id: true,
  rating: true,
  votePercentage: true
});
var insertMenuCategorySchema = createInsertSchema(menuCategories).omit({
  id: true
});
var insertMenuItemSchema = createInsertSchema(menuItems).omit({
  id: true,
  rating: true,
  votes: true,
  upvotes: true,
  downvotes: true
});
var insertDealSchema = createInsertSchema(deals).omit({
  id: true
});
var insertCartItemSchema = createInsertSchema(cartItems).extend({
  addons: z.array(z.number()).optional()
}).omit({
  id: true,
  addedAt: true
});
var insertMenuItemAddonSchema = createInsertSchema(menuItemAddons).omit({
  id: true
});
var insertCartItemAddonSchema = createInsertSchema(cartItemAddons).omit({
  id: true
});
var insertServerCallSchema = createInsertSchema(serverCalls).omit({
  id: true,
  createdAt: true
});
var insertTableSessionSchema = createInsertSchema(tableSessions).omit({
  id: true,
  createdAt: true,
  closedAt: true
});
var insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

// server/routes.ts
async function registerRoutes(app2) {
  app2.get("/api/restaurants", async (req, res) => {
    try {
      const restaurants2 = await storage.getRestaurants();
      res.json(restaurants2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch restaurants" });
    }
  });
  app2.get("/api/restaurants/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const restaurant = await storage.getRestaurant(id);
      if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }
      res.json(restaurant);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch restaurant" });
    }
  });
  app2.get("/api/restaurants/:id/categories", async (req, res) => {
    try {
      const restaurantId = parseInt(req.params.id);
      const categories = await storage.getMenuCategories(restaurantId);
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch menu categories" });
    }
  });
  app2.get("/api/restaurants/:id/menu", async (req, res) => {
    try {
      const restaurantId = parseInt(req.params.id);
      const items = await storage.getMenuItems(restaurantId);
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch menu items" });
    }
  });
  app2.get("/api/menu-items/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const item = await storage.getMenuItem(id);
      if (!item) {
        return res.status(404).json({ message: "Menu item not found" });
      }
      res.json(item);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch menu item" });
    }
  });
  app2.post("/api/menu-items/:id/vote", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { type } = req.body;
      const item = await storage.getMenuItem(id);
      if (!item) {
        return res.status(404).json({ message: "Menu item not found" });
      }
      const upvotes = type === "up" ? (item.upvotes ?? 0) + 1 : item.upvotes ?? 0;
      const downvotes = type === "down" ? (item.downvotes ?? 0) + 1 : item.downvotes ?? 0;
      const updatedItem = await storage.updateMenuItemVotes(id, upvotes, downvotes);
      res.json(updatedItem);
    } catch (error) {
      res.status(500).json({ message: "Failed to update vote" });
    }
  });
  app2.get("/api/menu-items/:id/addons", async (req, res) => {
    try {
      const menuItemId = parseInt(req.params.id);
      const addons = await storage.getMenuItemAddons(menuItemId);
      res.json(addons);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch menu item add-ons" });
    }
  });
  app2.get("/api/deals", async (req, res) => {
    try {
      const deals2 = await storage.getDeals();
      res.json(deals2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch deals" });
    }
  });
  app2.get("/api/restaurants/:id/deals", async (req, res) => {
    try {
      const restaurantId = parseInt(req.params.id);
      const deals2 = await storage.getRestaurantDeals(restaurantId);
      res.json(deals2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch restaurant deals" });
    }
  });
  app2.get("/api/cart/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      console.log(`[DEBUG] GET /api/cart/:sessionId called with sessionId: ${sessionId}`);
      const items = await storage.getCartItems(sessionId);
      console.log(`[DEBUG] GET /api/cart/:sessionId returning items:`, items);
      res.json(items);
    } catch (error) {
      console.log(`[DEBUG] GET /api/cart/:sessionId error:`, error);
      res.status(500).json({ message: "Failed to fetch cart items" });
    }
  });
  app2.post("/api/cart", async (req, res) => {
    try {
      console.log(`[DEBUG] POST /api/cart called with body:`, req.body);
      const { addons, ...cartData } = insertCartItemSchema.parse(req.body);
      console.log(`[DEBUG] POST /api/cart parsed cartData:`, cartData, `addons:`, addons);
      const cartItem = await storage.addToCart(cartData, addons);
      console.log(`[DEBUG] POST /api/cart added cartItem:`, cartItem);
      res.status(201).json(cartItem);
    } catch (error) {
      console.log(`[DEBUG] POST /api/cart error:`, error);
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to add item to cart" });
      }
    }
  });
  app2.put("/api/cart/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { quantity, specialInstructions } = req.body;
      console.log(`[DEBUG] PUT /api/cart/:id called for id: ${id}, quantity: ${quantity}, specialInstructions: ${specialInstructions}`);
      const updatedItem = await storage.updateCartItem(id, quantity, specialInstructions);
      if (!updatedItem) {
        console.log(`[DEBUG] PUT /api/cart/:id: Cart item not found for id: ${id}`);
        return res.status(404).json({ message: "Cart item not found" });
      }
      console.log(`[DEBUG] PUT /api/cart/:id updatedItem:`, updatedItem);
      res.json(updatedItem);
    } catch (error) {
      console.log(`[DEBUG] PUT /api/cart/:id error:`, error);
      res.status(500).json({ message: "Failed to update cart item" });
    }
  });
  app2.delete("/api/cart/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      console.log(`[DEBUG] DELETE /api/cart/:id called for id: ${id}`);
      const deleted = await storage.removeFromCart(id);
      if (!deleted) {
        console.log(`[DEBUG] DELETE /api/cart/:id: Cart item not found for id: ${id}`);
        return res.status(404).json({ message: "Cart item not found" });
      }
      console.log(`[DEBUG] DELETE /api/cart/:id deleted:`, deleted);
      res.status(204).send();
    } catch (error) {
      console.log(`[DEBUG] DELETE /api/cart/:id error:`, error);
      res.status(500).json({ message: "Failed to remove cart item" });
    }
  });
  app2.delete("/api/cart/session/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      console.log(`[DEBUG] DELETE /api/cart/session/:sessionId called for sessionId: ${sessionId}`);
      await storage.clearCart(sessionId);
      console.log(`[DEBUG] DELETE /api/cart/session/:sessionId cleared cart for sessionId: ${sessionId}`);
      res.status(204).send();
    } catch (error) {
      console.log(`[DEBUG] DELETE /api/cart/session/:sessionId error:`, error);
      res.status(500).json({ message: "Failed to clear cart" });
    }
  });
  app2.post("/api/server-calls", async (req, res) => {
    try {
      const validatedData = insertServerCallSchema.parse(req.body);
      const serverCall = await storage.createServerCall(validatedData);
      res.status(201).json(serverCall);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to create server call" });
      }
    }
  });
  app2.get("/api/restaurants/:id/server-calls", async (req, res) => {
    try {
      const restaurantId = parseInt(req.params.id);
      const calls = await storage.getServerCalls(restaurantId);
      res.json(calls);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch server calls" });
    }
  });
  app2.post("/api/orders", async (req, res) => {
    try {
      const { sessionId } = req.body;
      const order = await storage.convertCartToOrder(sessionId);
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to place order" });
    }
  });
  app2.get("/api/orders/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const orders2 = await storage.getOrdersBySession(sessionId);
      res.json(orders2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });
  app2.put("/api/orders/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      const order = await storage.updateOrderStatus(id, status);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to update order status" });
    }
  });
  app2.post("/api/sessions", async (req, res) => {
    try {
      const session = await storage.createTableSession(req.body);
      res.json(session);
    } catch (error) {
      res.status(500).json({ message: "Failed to create session" });
    }
  });
  app2.get("/api/sessions/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const session = await storage.getTableSession(sessionId);
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      res.json(session);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch session" });
    }
  });
  app2.post("/api/sessions/:sessionId/close", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const { paymentMethod } = req.body;
      const session = await storage.updateTableSessionStatus(sessionId, "paid", paymentMethod);
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      res.json({ success: true, session });
    } catch (error) {
      res.status(500).json({ message: "Failed to close session" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var vite_config_default = defineConfig(async () => {
  const plugins = [react(), runtimeErrorOverlay()];
  if (process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0) {
    try {
      const cartographer = await import("@replit/vite-plugin-cartographer");
      plugins.push(cartographer.cartographer());
    } catch (error) {
      console.warn("Failed to load cartographer plugin:", error);
    }
  }
  return {
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "client", "src"),
        "@shared": path.resolve(__dirname, "shared"),
        "@assets": path.resolve(__dirname, "attached_assets")
      }
    },
    root: path.resolve(__dirname, "client"),
    build: {
      outDir: path.resolve(__dirname, "dist/public"),
      emptyOutDir: true
    },
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: ["./client/src/components/__test__/setupTests.ts"]
    }
  };
});

// server/vite.ts
import { nanoid } from "nanoid";
import { fileURLToPath as fileURLToPath2 } from "url";
var __filename2 = fileURLToPath2(import.meta.url);
var __dirname2 = path2.dirname(__filename2);
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: void 0
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        __dirname2,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(__dirname2, "..", "dist", "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
import { fileURLToPath as fileURLToPath3 } from "url";
var app = express2();
app.use((req, res, next) => {
  console.log(`[DEBUG] Incoming: ${req.method} ${req.originalUrl}`);
  next();
});
var whitelist = [
  "https://menubosse.netlify.app",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5000"
];
var corsOptions = {
  origin: function(origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn(`[CORS] Non-whitelisted origin: ${origin} - allowing anyway for serverless compatibility`);
      callback(null, true);
    }
  },
  credentials: true
};
app.use(cors(corsOptions));
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
var serverPromise = registerRoutes(app);
async function startServer() {
  const server = await serverPromise;
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    console.error(err);
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  app.use((req, res) => {
    console.error(`[DEBUG] 404 Not Found: ${req.method} ${req.originalUrl}`);
    res.status(404).json({ error: "Not Found", path: req.originalUrl });
  });
  const port = Number(process.env.PORT) || 5e3;
  server.listen(port, "0.0.0.0", () => {
    log(`serving on port ${port}`);
  });
  server.keepAliveTimeout = 12e4;
  server.headersTimeout = 12e4;
}
if (process.argv[1] === fileURLToPath3(import.meta.url)) {
  startServer();
}
export {
  app
};
