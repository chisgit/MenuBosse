# MenuBosse Development Plan

## **Updated Goal:** Refine the in-restaurant dining experience by improving order status tracking and ensuring a consistent, polished user interface.

### **Phase 1: Enhance Order Status Management (Complete)**

1.  **Objective**: Provide real-time visibility into the status of each item a user has selected.
2.  **Implementation Steps**:
    *   **Modify Cart UI**: Update the `Cart.tsx` component to visually differentiate items based on their status (`In Cart`, `Ordered`, `Preparing`, `Served`). - **Done**
    *   **Real-time Updates**: Implement polling or a WebSocket connection to fetch the latest cart/order status from the server automatically, ensuring the display is always up-to-date without requiring a manual refresh. - **Done**

---

**Technical Debt:**  
Current cart synchronization uses 5-second polling, which will not scale for thousands of sessions. Consider switching to event-driven updates (WebSockets) or increasing polling interval in future.

3.  **Testing**:
    *   **Unit Tests**: Write tests for the logic that handles status updates in the `use-cart.ts` hook.
    *   **UI Tests**: Create tests for the `Cart.tsx` component to verify that items are correctly displayed under different statuses.

### **Phase 2: Unify UI and Styling**

1.  **Objective**: Create a seamless and visually consistent experience across the entire application, with a special focus on the cart and ordering flow.
2.  **Implementation Steps**:
    *   **Style Audit**: Review all cart-related components (`Cart.tsx`, `ItemDetailModal.tsx`, `FloatingButtons.tsx`) and compare them against the main restaurant page.
    *   **Theme Consolidation**: Update the Tailwind CSS configuration (`tailwind.config.ts`) and global stylesheets (`global.css`) to enforce a consistent color palette, button style, and typography.
    *   **Component Refactoring**: Apply the unified styles to all components to ensure they match.
3.  **Testing**:
    *   **Visual Regression Tests**: (If possible) Set up visual tests to catch unintended styling changes.
    *   **UI Tests**: Verify that components render with the correct, consistent styles.

---

### **Phase 3: Checkout Rating & Discount**

- Integrate rating and comment prompt into the checkout flow, offered to each customer.
- Customers can opt out if in a rush or do not want to provide a rating.
- On checkout, prompt each customer to provide a star rating for each dish for a 5% discount.
- If the customer leaves more than 1 comment, apply a 10% discount.
- Allow customers to post their rating on other platforms (Google, Yelp, etc.) via SSO in the app.

---

## **Build & Deployment Status**


---

## **Agent & Instruction System**

- The GitHub Copilot agent now references `.github/copilot-instructions.md` for all coding standards and rules.
- `.clinerules` is checked for additional agent instructions and must be re-read if updated.
- All documentation and plan updates performed by this agent are tagged with `github copilot` for traceability.

**Update by: github copilot (2025-07-18)**
---

## **Tooling**

- Netlify CLI Path: `c:/Users/User/MenuBosse/client/node_modules/.bin/netlify.cmd`
