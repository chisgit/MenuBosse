// server/index.ts
import express2 from "express";
import cors from "cors";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
var MemStorage = class {
  restaurants;
  menuCategories;
  menuItems;
  menuItemAddons;
  cartItemAddons;
  deals;
  cartItems;
  serverCalls;
  tableSessions;
  orders;
  currentId;
  constructor() {
    this.restaurants = /* @__PURE__ */ new Map();
    this.menuCategories = /* @__PURE__ */ new Map();
    this.menuItems = /* @__PURE__ */ new Map();
    this.menuItemAddons = /* @__PURE__ */ new Map();
    this.cartItemAddons = /* @__PURE__ */ new Map();
    this.deals = /* @__PURE__ */ new Map();
    this.cartItems = /* @__PURE__ */ new Map();
    this.serverCalls = /* @__PURE__ */ new Map();
    this.tableSessions = /* @__PURE__ */ new Map();
    this.orders = /* @__PURE__ */ new Map();
    this.currentId = 1;
    this.initializeData();
  }
  initializeData() {
    const restaurant = {
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
      isLocalFavorite: true
    };
    this.restaurants.set(1, restaurant);
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
        isLocalFavorite: false
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
        isLocalFavorite: false
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
        isLocalFavorite: true
      }
    ];
    discoveryRestaurants.forEach((rest) => this.restaurants.set(rest.id, rest));
    const categories = [
      { id: 1, restaurantId: 1, name: "Appetizers", order: 1 },
      { id: 2, restaurantId: 1, name: "Main Dishes", order: 2 },
      { id: 3, restaurantId: 1, name: "Desserts", order: 3 }
    ];
    categories.forEach((cat) => this.menuCategories.set(cat.id, cat));
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
        downvotes: 9
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
        downvotes: 8
      },
      {
        id: 6,
        restaurantId: 1,
        categoryId: 1,
        name: "Pan-Seared Scallops",
        description: "Perfectly seared diver scallops with cauliflower pur\xE9e, pancetta crisps, and microgreens.",
        fullDescription: "Three jumbo diver scallops seared to golden perfection, served atop silky cauliflower pur\xE9e with crispy pancetta, drizzled with brown butter sauce and garnished with fresh microgreens.",
        price: 16.99,
        imageUrl: "/assets/images/food/pan-seared-scallops.png",
        rating: 4.9,
        votes: 127,
        upvotes: 119,
        downvotes: 8
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
        downvotes: 10
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
        downvotes: 10
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
        downvotes: 15
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
        downvotes: 8
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
        downvotes: 7
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
        downvotes: 16
      }
    ];
    items.forEach((item) => this.menuItems.set(item.id, item));
    const addons = [
      // Calamari add-ons
      { id: 1, menuItemId: 1, name: "Extra Marinara", description: "Additional marinara sauce", price: 1.5, category: "sauce", isRequired: false, maxSelections: 3 },
      { id: 2, menuItemId: 1, name: "Spicy Aioli", description: "House-made spicy aioli", price: 2, category: "sauce", isRequired: false, maxSelections: 1 },
      { id: 3, menuItemId: 1, name: "Lemon Wedges", description: "Fresh lemon wedges", price: 0.5, category: "side", isRequired: false, maxSelections: 2 },
      // Bruschetta add-ons
      { id: 4, menuItemId: 2, name: "Extra Cheese", description: "Additional ricotta cheese", price: 2.5, category: "cheese", isRequired: false, maxSelections: 1 },
      { id: 5, menuItemId: 2, name: "Balsamic Glaze", description: "Aged balsamic reduction", price: 1.75, category: "sauce", isRequired: false, maxSelections: 1 },
      // Salmon add-ons
      { id: 6, menuItemId: 3, name: "Extra Vegetables", description: "Double portion of seasonal vegetables", price: 4, category: "side", isRequired: false, maxSelections: 1 },
      { id: 7, menuItemId: 3, name: "Garlic Butter", description: "Extra garlic herb butter", price: 2.5, category: "sauce", isRequired: false, maxSelections: 2 },
      { id: 8, menuItemId: 3, name: "Lemon Pepper Seasoning", description: "Additional lemon pepper", price: 1, category: "spice", isRequired: false, maxSelections: 1 },
      // Risotto add-ons
      { id: 9, menuItemId: 4, name: "Extra Truffle Oil", description: "Additional truffle oil drizzle", price: 3.5, category: "sauce", isRequired: false, maxSelections: 2 },
      { id: 10, menuItemId: 4, name: "Parmesan Cheese", description: "Extra aged parmesan", price: 2.75, category: "cheese", isRequired: false, maxSelections: 1 },
      { id: 11, menuItemId: 4, name: "Wild Mushrooms", description: "Extra mixed wild mushrooms", price: 4.5, category: "topping", isRequired: false, maxSelections: 1 },
      // Burger add-ons
      { id: 12, menuItemId: 5, name: "Bacon", description: "Crispy applewood smoked bacon", price: 3, category: "meat", isRequired: false, maxSelections: 2 },
      { id: 13, menuItemId: 5, name: "Extra Cheese", description: "Additional aged cheddar slice", price: 2, category: "cheese", isRequired: false, maxSelections: 3 },
      { id: 14, menuItemId: 5, name: "Avocado", description: "Fresh sliced avocado", price: 2.5, category: "topping", isRequired: false, maxSelections: 1 },
      { id: 15, menuItemId: 5, name: "Jalape\xF1os", description: "Fresh or pickled jalape\xF1os", price: 1.5, category: "topping", isRequired: false, maxSelections: 1 },
      { id: 16, menuItemId: 5, name: "Onion Rings", description: "Replace fries with onion rings", price: 3.5, category: "side", isRequired: false, maxSelections: 1 },
      { id: 17, menuItemId: 5, name: "Sweet Potato Fries", description: "Replace fries with sweet potato fries", price: 2.5, category: "side", isRequired: false, maxSelections: 1 },
      { id: 18, menuItemId: 5, name: "Spice Level", description: "How spicy would you like it?", price: 0, category: "spice", isRequired: true, maxSelections: 1 },
      // Pan-Seared Scallops add-ons
      { id: 19, menuItemId: 6, name: "Extra Scallop", description: "Add a fourth jumbo scallop", price: 8, category: "protein", isRequired: false, maxSelections: 2 },
      { id: 20, menuItemId: 6, name: "Truffle Shavings", description: "Fresh black truffle shavings", price: 12, category: "topping", isRequired: false, maxSelections: 1 },
      { id: 21, menuItemId: 6, name: "Crispy Pancetta", description: "Extra crispy pancetta crisps", price: 4.5, category: "meat", isRequired: false, maxSelections: 1 },
      { id: 22, menuItemId: 6, name: "Cauliflower Pur\xE9e", description: "Extra portion of silky cauliflower pur\xE9e", price: 3.5, category: "side", isRequired: false, maxSelections: 1 },
      { id: 23, menuItemId: 6, name: "Brown Butter Sauce", description: "Additional brown butter sauce", price: 2.75, category: "sauce", isRequired: false, maxSelections: 2 },
      { id: 24, menuItemId: 6, name: "Microgreens", description: "Premium microgreens medley", price: 3, category: "topping", isRequired: false, maxSelections: 1 },
      // Tiramisu add-ons
      { id: 25, menuItemId: 7, name: "Extra Coffee Shot", description: "Additional espresso shot drizzle", price: 2, category: "sauce", isRequired: false, maxSelections: 2 },
      { id: 26, menuItemId: 7, name: "Amaretto", description: "Amaretto liqueur enhancement", price: 3.5, category: "sauce", isRequired: false, maxSelections: 1 },
      { id: 27, menuItemId: 7, name: "Dark Chocolate Shavings", description: "Premium dark chocolate shavings", price: 2.5, category: "topping", isRequired: false, maxSelections: 1 },
      // Panna Cotta add-ons
      { id: 28, menuItemId: 8, name: "Extra Berry Compote", description: "Additional seasonal berry compote", price: 2.75, category: "sauce", isRequired: false, maxSelections: 1 },
      { id: 29, menuItemId: 8, name: "Honey Drizzle", description: "Local wildflower honey drizzle", price: 1.5, category: "sauce", isRequired: false, maxSelections: 1 },
      { id: 30, menuItemId: 8, name: "Candied Nuts", description: "Toasted candied almonds", price: 3, category: "topping", isRequired: false, maxSelections: 1 },
      // Chocolate Lava Cake add-ons
      { id: 31, menuItemId: 9, name: "Extra Gelato", description: "Additional scoop of vanilla gelato", price: 3.5, category: "side", isRequired: false, maxSelections: 2 },
      { id: 32, menuItemId: 9, name: "Salted Caramel Sauce", description: "House-made salted caramel sauce", price: 2.25, category: "sauce", isRequired: false, maxSelections: 1 },
      { id: 33, menuItemId: 9, name: "Fresh Strawberries", description: "Fresh sliced strawberries", price: 2.5, category: "topping", isRequired: false, maxSelections: 1 },
      { id: 34, menuItemId: 9, name: "Whipped Cream", description: "Fresh whipped cream", price: 1.75, category: "topping", isRequired: false, maxSelections: 1 }
    ];
    addons.forEach((addon) => this.menuItemAddons.set(addon.id, addon));
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
        isGlobal: true
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
        isGlobal: true
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
        isGlobal: false
      }
    ];
    dealsData.forEach((deal) => this.deals.set(deal.id, deal));
    this.currentId = 35;
  }
  // Menu Item Add-ons methods
  async getMenuItemAddons(menuItemId) {
    return Array.from(this.menuItemAddons.values()).filter((addon) => addon.menuItemId === menuItemId);
  }
  async createMenuItemAddon(addon) {
    const id = this.currentId++;
    const newAddon = {
      ...addon,
      id,
      description: addon.description ?? null,
      isRequired: addon.isRequired ?? null,
      maxSelections: addon.maxSelections ?? null
    };
    this.menuItemAddons.set(id, newAddon);
    return newAddon;
  }
  // Cart Item Add-ons methods
  async getCartItemAddons(cartItemId) {
    const cartAddons = Array.from(this.cartItemAddons.values()).filter((cartAddon) => cartAddon.cartItemId === cartItemId);
    const addonsWithDetails = [];
    for (const cartAddon of cartAddons) {
      const addon = this.menuItemAddons.get(cartAddon.addonId);
      if (addon) {
        addonsWithDetails.push({ ...cartAddon, addon });
      }
    }
    return addonsWithDetails;
  }
  async addCartItemAddon(addon) {
    const id = this.currentId++;
    const newCartAddon = {
      ...addon,
      id,
      quantity: addon.quantity ?? null
    };
    this.cartItemAddons.set(id, newCartAddon);
    return newCartAddon;
  }
  async removeCartItemAddon(id) {
    return this.cartItemAddons.delete(id);
  }
  async getRestaurants() {
    return Array.from(this.restaurants.values());
  }
  async getRestaurant(id) {
    return this.restaurants.get(id);
  }
  async createRestaurant(restaurant) {
    const id = this.currentId++;
    const newRestaurant = {
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
      votePercentage: null
    };
    this.restaurants.set(id, newRestaurant);
    return newRestaurant;
  }
  async getMenuCategories(restaurantId) {
    return Array.from(this.menuCategories.values()).filter((cat) => cat.restaurantId === restaurantId).sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity));
  }
  async createMenuCategory(category) {
    const id = this.currentId++;
    const newCategory = {
      ...category,
      id,
      order: category.order ?? null
    };
    this.menuCategories.set(id, newCategory);
    return newCategory;
  }
  async getMenuItems(restaurantId) {
    return Array.from(this.menuItems.values()).filter((item) => item.restaurantId === restaurantId);
  }
  async getMenuItemsByCategory(categoryId) {
    return Array.from(this.menuItems.values()).filter((item) => item.categoryId === categoryId);
  }
  async getMenuItem(id) {
    return this.menuItems.get(id);
  }
  async createMenuItem(item) {
    const id = this.currentId++;
    const newItem = {
      ...item,
      id,
      description: item.description ?? null,
      imageUrl: item.imageUrl ?? null,
      fullDescription: item.fullDescription ?? null,
      rating: 0,
      votes: 0,
      upvotes: 0,
      downvotes: 0
    };
    this.menuItems.set(id, newItem);
    return newItem;
  }
  async updateMenuItemVotes(id, upvotes, downvotes) {
    const item = this.menuItems.get(id);
    if (!item) return void 0;
    const votes = upvotes + downvotes;
    const rating = votes > 0 ? upvotes / votes * 5 : 0;
    const updatedItem = { ...item, upvotes, downvotes, votes, rating };
    this.menuItems.set(id, updatedItem);
    return updatedItem;
  }
  async getDeals() {
    return Array.from(this.deals.values());
  }
  async getRestaurantDeals(restaurantId) {
    return Array.from(this.deals.values()).filter((deal) => deal.restaurantId === restaurantId || deal.isGlobal);
  }
  async createDeal(deal) {
    const id = this.currentId++;
    const newDeal = {
      ...deal,
      id,
      restaurantId: deal.restaurantId ?? null,
      discountType: deal.discountType ?? null,
      discountValue: deal.discountValue ?? null,
      validUntil: deal.validUntil ?? null,
      backgroundColor: deal.backgroundColor ?? null,
      isGlobal: deal.isGlobal ?? null
    };
    this.deals.set(id, newDeal);
    return newDeal;
  }
  async getCartItems(sessionId) {
    console.log(`[DEBUG] getCartItems called for sessionId: ${sessionId}`);
    const items = Array.from(this.cartItems.values()).filter((item) => item.sessionId === sessionId);
    console.log(`[DEBUG] Found cart items:`, items);
    const itemsWithMenuData = [];
    for (const item of items) {
      const menuItem = this.menuItems.get(item.menuItemId);
      if (menuItem) {
        const addons = await this.getCartItemAddons(item.id);
        itemsWithMenuData.push({ ...item, menuItem, addons });
      }
    }
    console.log(`[DEBUG] Returning cart items with menu data:`, itemsWithMenuData);
    return itemsWithMenuData;
  }
  async addToCart(item, addons = []) {
    console.log(`[DEBUG] addToCart called with item:`, item, `addons:`, addons);
    const id = this.currentId++;
    const newItem = {
      ...item,
      id,
      quantity: item.quantity ?? null,
      specialInstructions: item.specialInstructions ?? null,
      status: "cart",
      orderId: null,
      addedAt: /* @__PURE__ */ new Date(),
      orderedAt: null
    };
    this.cartItems.set(id, newItem);
    console.log(`[DEBUG] New cart item added:`, newItem);
    for (const addonId of addons) {
      await this.addCartItemAddon({
        cartItemId: id,
        addonId,
        quantity: 1
      });
      console.log(`[DEBUG] Added addon to cart item:`, addonId);
    }
    return newItem;
  }
  async updateCartItem(id, quantity, specialInstructions) {
    console.log(`[DEBUG] updateCartItem called for id: ${id}, quantity: ${quantity}, specialInstructions: ${specialInstructions}`);
    const item = this.cartItems.get(id);
    if (!item) {
      console.log(`[DEBUG] updateCartItem: item not found for id: ${id}`);
      return void 0;
    }
    const updatedItem = {
      // Ensure updatedItem conforms to CartItem
      ...item,
      quantity,
      specialInstructions: specialInstructions ?? null
    };
    this.cartItems.set(id, updatedItem);
    console.log(`[DEBUG] Cart item updated:`, updatedItem);
    return updatedItem;
  }
  async removeFromCart(id) {
    console.log(`[DEBUG] removeFromCart called for id: ${id}`);
    const result = this.cartItems.delete(id);
    console.log(`[DEBUG] removeFromCart result for id ${id}:`, result);
    return result;
  }
  async clearCart(sessionId) {
    console.log(`[DEBUG] clearCart called for sessionId: ${sessionId}`);
    const items = Array.from(this.cartItems.entries()).filter(([_, item]) => item.sessionId === sessionId);
    console.log(`[DEBUG] Items to clear:`, items);
    items.forEach(([id]) => {
      this.cartItems.delete(id);
      console.log(`[DEBUG] Cleared cart item: ${id}`);
    });
    return true;
  }
  async createServerCall(call) {
    const id = this.currentId++;
    const newCall = {
      ...call,
      id,
      status: call.status ?? null,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.serverCalls.set(id, newCall);
    return newCall;
  }
  async getServerCalls(restaurantId) {
    return Array.from(this.serverCalls.values()).filter((call) => call.restaurantId === restaurantId);
  }
  async updateServerCallStatus(id, status) {
    const call = this.serverCalls.get(id);
    if (!call) return void 0;
    const updatedCall = { ...call, status };
    this.serverCalls.set(id, updatedCall);
    return updatedCall;
  }
  async createTableSession(session) {
    const id = this.currentId++;
    const newSession = {
      ...session,
      id,
      status: session.status ?? "active",
      createdAt: /* @__PURE__ */ new Date(),
      closedAt: null,
      totalAmount: session.totalAmount ?? null,
      paymentMethod: session.paymentMethod ?? null
    };
    this.tableSessions.set(id, newSession);
    return newSession;
  }
  async getTableSession(sessionId) {
    return Array.from(this.tableSessions.values()).find((session) => session.sessionId === sessionId);
  }
  async updateTableSessionStatus(sessionId, status, paymentMethod) {
    const session = Array.from(this.tableSessions.values()).find((session2) => session2.sessionId === sessionId);
    if (!session) return void 0;
    const updatedSession = {
      ...session,
      status,
      paymentMethod: paymentMethod ?? null,
      closedAt: status === "paid" || status === "closed" ? /* @__PURE__ */ new Date() : session.closedAt
    };
    this.tableSessions.set(updatedSession.id, updatedSession);
    return updatedSession;
  }
  async getOrdersBySession(sessionId) {
    return Array.from(this.orders.values()).filter((order) => order.sessionId === sessionId);
  }
  async updateOrderStatus(id, status) {
    const order = this.orders.get(id);
    if (!order) return void 0;
    const updatedOrder = { ...order, status };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }
  async createOrder(order) {
    const id = this.currentId++;
    const newOrder = {
      ...order,
      id,
      status: order.status ?? "pending",
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.orders.set(id, newOrder);
    return newOrder;
  }
  async convertCartToOrder(sessionId) {
    const cartItems2 = await this.getCartItems(sessionId);
    const totalAmount = cartItems2.reduce((sum, item) => {
      const addonsPrice = item.addons.reduce((addonSum, addon) => addonSum + addon.addon.price * (addon.quantity ?? 1), 0);
      return sum + item.menuItem.price * (item.quantity || 1) + addonsPrice;
    }, 0);
    const order = {
      sessionId,
      status: "pending",
      totalAmount
    };
    const newOrder = await this.createOrder(order);
    for (const cartItem of cartItems2) {
      await this.updateCartItem(cartItem.id, cartItem.quantity || 1, cartItem.specialInstructions || void 0);
      const existing = this.cartItems.get(cartItem.id);
      if (existing) {
        const updated = {
          ...existing,
          status: "ordered",
          orderId: newOrder.id,
          orderedAt: /* @__PURE__ */ new Date()
        };
        this.cartItems.set(cartItem.id, updated);
      }
    }
    return newOrder;
  }
};
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
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./client/src/components/__test__/setupTests.ts"]
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
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
        process.exit(1);
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
        import.meta.dirname,
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
  const distPath = path2.resolve(import.meta.dirname, "..", "dist", "public");
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
import { fileURLToPath } from "url";
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
      console.error(`[CORS] Blocked origin: ${origin}`);
      callback(null, false);
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
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  startServer();
}
export {
  app
};
