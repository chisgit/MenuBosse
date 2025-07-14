import '@testing-library/jest-dom';
// Cart.test.tsx
import { render, screen } from "@testing-library/react";
import React from "react";
import Cart from "./Cart";

jest.mock("@/hooks/use-cart", () => ({
  useCart: () => ({
    data: [
      {
        id: 1,
        quantity: 2,
        menuItem: {
          id: 101,
          name: "Burger",
          description: "Tasty burger",
          price: 5,
          imageUrl: "",
        },
        addons: [
          {
            addon: { id: 201, name: "Cheese", price: 1 },
            quantity: 1,
          },
        ],
        specialInstructions: "No onions",
        status: "cart",
      },
    ],
    isLoading: false,
  }),
  useUpdateCartItem: () => ({ mutate: jest.fn() }),
  useRemoveFromCart: () => ({ mutate: jest.fn() }),
  useClearCart: () => ({ mutate: jest.fn() }),
  usePlaceOrder: () => ({ mutate: jest.fn(), isPending: false }),
  useCompletePayment: () => ({ mutate: jest.fn(), isPending: false }),
  useSessionStatus: () => ({
    session: { tableNumber: 5 },
    isActive: true,
    isPaid: false,
  }),
}));

describe("Cart", () => {
  it("renders cart item with add-ons as bullets and special notes section", () => {
    render(<Cart />);
    expect(screen.getByText("Burger")).toBeInTheDocument();
    expect(screen.getByText("Cheese")).toBeInTheDocument();
    expect(screen.getByText("Special Notes:")).toBeInTheDocument();
    expect(screen.getByText("No onions")).toBeInTheDocument();
  });
});
