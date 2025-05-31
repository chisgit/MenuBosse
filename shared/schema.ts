import { pgTable, text, serial, integer, boolean, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const restaurants = pgTable("restaurants", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  cuisine: text("cuisine").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  rating: real("rating").default(0),
  votePercentage: integer("vote_percentage").default(0),
  priceRange: text("price_range"), // $, $$, $$$
  distance: real("distance"), // in miles
  isHiddenGem: boolean("is_hidden_gem").default(false),
  isTrending: boolean("is_trending").default(false),
  isLocalFavorite: boolean("is_local_favorite").default(false),
});

export const menuCategories = pgTable("menu_categories", {
  id: serial("id").primaryKey(),
  restaurantId: integer("restaurant_id").notNull(),
  name: text("name").notNull(),
  order: integer("order").default(0),
});

export const menuItems = pgTable("menu_items", {
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
  downvotes: integer("downvotes").default(0),
});

export const deals = pgTable("deals", {
  id: serial("id").primaryKey(),
  restaurantId: integer("restaurant_id"),
  title: text("title").notNull(),
  description: text("description").notNull(),
  discountType: text("discount_type"), // percentage, amount, bogo, etc
  discountValue: text("discount_value"),
  validUntil: text("valid_until"),
  backgroundColor: text("background_color"),
  isGlobal: boolean("is_global").default(false),
});

export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  menuItemId: integer("menu_item_id").notNull(),
  quantity: integer("quantity").default(1),
  specialInstructions: text("special_instructions"),
  addedAt: timestamp("added_at").defaultNow(),
});

export const menuItemAddons = pgTable("menu_item_addons", {
  id: serial("id").primaryKey(),
  menuItemId: integer("menu_item_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  price: real("price").notNull(),
  category: text("category").notNull(), // cheese, meat, sauce, spice, side, etc
  isRequired: boolean("is_required").default(false),
  maxSelections: integer("max_selections").default(1),
});

export const cartItemAddons = pgTable("cart_item_addons", {
  id: serial("id").primaryKey(),
  cartItemId: integer("cart_item_id").notNull(),
  addonId: integer("addon_id").notNull(),
  quantity: integer("quantity").default(1),
});

export const serverCalls = pgTable("server_calls", {
  id: serial("id").primaryKey(),
  restaurantId: integer("restaurant_id").notNull(),
  tableNumber: text("table_number").notNull(),
  status: text("status").default("pending"), // pending, acknowledged, completed
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertRestaurantSchema = createInsertSchema(restaurants).omit({
  id: true,
  rating: true,
  votePercentage: true,
});

export const insertMenuCategorySchema = createInsertSchema(menuCategories).omit({
  id: true,
});

export const insertMenuItemSchema = createInsertSchema(menuItems).omit({
  id: true,
  rating: true,
  votes: true,
  upvotes: true,
  downvotes: true,
});

export const insertDealSchema = createInsertSchema(deals).omit({
  id: true,
});

export const insertCartItemSchema = createInsertSchema(cartItems).omit({
  id: true,
  addedAt: true,
});

export const insertMenuItemAddonSchema = createInsertSchema(menuItemAddons).omit({
  id: true,
});

export const insertCartItemAddonSchema = createInsertSchema(cartItemAddons).omit({
  id: true,
});

export const insertServerCallSchema = createInsertSchema(serverCalls).omit({
  id: true,
  createdAt: true,
});

export type Restaurant = typeof restaurants.$inferSelect;
export type InsertRestaurant = z.infer<typeof insertRestaurantSchema>;

export type MenuCategory = typeof menuCategories.$inferSelect;
export type InsertMenuCategory = z.infer<typeof insertMenuCategorySchema>;

export type MenuItem = typeof menuItems.$inferSelect;
export type InsertMenuItem = z.infer<typeof insertMenuItemSchema>;

export type MenuItemAddon = typeof menuItemAddons.$inferSelect;
export type InsertMenuItemAddon = z.infer<typeof insertMenuItemAddonSchema>;

export type CartItemAddon = typeof cartItemAddons.$inferSelect;
export type InsertCartItemAddon = z.infer<typeof insertCartItemAddonSchema>;

export type Deal = typeof deals.$inferSelect;
export type InsertDeal = z.infer<typeof insertDealSchema>;

export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;

export type ServerCall = typeof serverCalls.$inferSelect;
export type InsertServerCall = z.infer<typeof insertServerCallSchema>;
