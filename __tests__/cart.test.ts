const { storage } = require("../server/storage");

describe("Cart functionality", () => {
  it("should add items to the cart and retrieve them correctly", async () => {
    const sessionId = "test-session";
    const menuItemId = 6;
    const quantity = 2;

    // Add item to cart
    await storage.addToCart({ sessionId, menuItemId, quantity });

    // Retrieve cart items
    const cartItems = await storage.getCartItems(sessionId);

    // Assertions
    expect(cartItems).toHaveLength(1);
    expect(cartItems[0].menuItemId).toBe(menuItemId);
    expect(cartItems[0].quantity).toBe(quantity);
  });
});
