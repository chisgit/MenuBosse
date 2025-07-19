import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertMenuItemSchema,
  insertCartItemSchema,
  insertServerCallSchema,
  insertCartItemAddonSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {

  // Restaurant routes
  app.get("/api/restaurants", async (req, res) => {
    try {
      const restaurants = await storage.getRestaurants();
      res.json(restaurants);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch restaurants" });
    }
  });

  app.get("/api/restaurants/:id", async (req, res) => {
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

  // Menu routes
  app.get("/api/restaurants/:id/categories", async (req, res) => {
    try {
      const restaurantId = parseInt(req.params.id);
      const categories = await storage.getMenuCategories(restaurantId);
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch menu categories" });
    }
  });

  app.get("/api/restaurants/:id/menu", async (req, res) => {
    try {
      const restaurantId = parseInt(req.params.id);
      const items = await storage.getMenuItems(restaurantId);
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch menu items" });
    }
  });

  app.get("/api/menu-items/:id", async (req, res) => {
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

  // Voting routes
  app.post("/api/menu-items/:id/vote", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { type } = req.body; // 'up' or 'down'

      const item = await storage.getMenuItem(id);
      if (!item) {
        return res.status(404).json({ message: "Menu item not found" });
      }

      const upvotes = type === 'up' ? (item.upvotes ?? 0) + 1 : (item.upvotes ?? 0);
      const downvotes = type === 'down' ? (item.downvotes ?? 0) + 1 : (item.downvotes ?? 0);

      const updatedItem = await storage.updateMenuItemVotes(id, upvotes, downvotes);
      res.json(updatedItem);
    } catch (error) {
      res.status(500).json({ message: "Failed to update vote" });
    }
  });

  // Menu item add-ons routes
  app.get("/api/menu-items/:id/addons", async (req, res) => {
    try {
      const menuItemId = parseInt(req.params.id);
      const addons = await storage.getMenuItemAddons(menuItemId);
      res.json(addons);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch menu item add-ons" });
    }
  });

  // Deals routes
  app.get("/api/deals", async (req, res) => {
    try {
      const deals = await storage.getDeals();
      res.json(deals);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch deals" });
    }
  });

  app.get("/api/restaurants/:id/deals", async (req, res) => {
    try {
      const restaurantId = parseInt(req.params.id);
      const deals = await storage.getRestaurantDeals(restaurantId);
      res.json(deals);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch restaurant deals" });
    }
  });

  // Cart routes
  app.get("/api/cart/:sessionId", async (req, res) => {
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

  app.post("/api/cart", async (req, res) => {
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

  app.put("/api/cart/:id", async (req, res) => {
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

  app.delete("/api/cart/:id", async (req, res) => {
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

  app.delete("/api/cart/session/:sessionId", async (req, res) => {
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

  // Server call routes
  app.post("/api/server-calls", async (req, res) => {
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

  app.get("/api/restaurants/:id/server-calls", async (req, res) => {
    try {
      const restaurantId = parseInt(req.params.id);
      const calls = await storage.getServerCalls(restaurantId);
      res.json(calls);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch server calls" });
    }
  });

  // Order management routes
  app.post("/api/orders", async (req, res) => {
    try {
      const { sessionId } = req.body;
      const order = await storage.convertCartToOrder(sessionId);
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to place order" });
    }
  });

  app.get("/api/orders/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const orders = await storage.getOrdersBySession(sessionId);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.put("/api/orders/:id/status", async (req, res) => {
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

  // Table session management routes
  app.post("/api/sessions", async (req, res) => {
    try {
      const session = await storage.createTableSession(req.body);
      res.json(session);
    } catch (error) {
      res.status(500).json({ message: "Failed to create session" });
    }
  });

  app.get("/api/sessions/:sessionId", async (req, res) => {
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

  app.post("/api/sessions/:sessionId/close", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const { paymentMethod } = req.body;
      const session = await storage.updateTableSessionStatus(sessionId, 'paid', paymentMethod);
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      res.json({ success: true, session });
    } catch (error) {
      res.status(500).json({ message: "Failed to close session" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
