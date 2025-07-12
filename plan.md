# Cart Functionality Enhancement Plan

## Current State Analysis

### Issues Identified:
1. **Random Session ID**: Cart uses `Math.random()` for session generation, meaning each refresh creates a new cart
2. **No Table-Based Sharing**: No concept of table sessions for multiple people at same table
3. **No Order Tracking**: No distinction between items in cart vs items ordered/served
4. **Limited Cart UI**: Cart functionality exists but may not be fully integrated in UI

### Current Implementation:
- Cart items stored with session ID
- Basic CRUD operations (add, update, remove, clear)
- Memory-based storage (resets on server restart)
- Cart items include menu item details

## Implementation Plan

### Phase 1: Table-Based Session Management
1. **URL-based Table Sessions**
   - Extract table/session info from URL parameters (e.g., `/restaurant/1?table=5&session=abc123`)
   - Generate stable session IDs based on table number
   - Allow multiple devices to share same table session

2. **Session ID Strategy**
   - Replace random session with secure hashed session ID
   - Generate unique session tokens that obfuscate table information
   - Use format: `session-{hashedToken}` where token = hash(restaurantId + tableNumber + salt + timestamp)
   - Persist session in localStorage for device continuity
   - Allow manual session override via QR code parameters

3. **Security Measures**
   - Hash table numbers with restaurant-specific salt
   - Include timestamp in hash to enable session expiration
   - Store mapping between session tokens and actual table info on server
   - Prevent guessing/enumeration of other table sessions

### Phase 2: Order Status Management
1. **Cart vs Order States**
   - Add `status` field to cart items: `cart`, `ordered`, `preparing`, `served`
   - Separate cart (pending items) from order history
   - Add timestamps for order progression

2. **Database Schema Updates**
   - Extend CartItem with status and timestamps
   - Add table information to cart items
   - Create order tracking endpoints

### Phase 3: Enhanced Cart UI
1. **Cart Component**
   - Create dedicated cart sidebar/drawer
   - Show current cart items with quantities
   - Display order history with statuses
   - Add checkout/order placement functionality

2. **Cart Integration**
   - Add cart icon with item count in header
   - Integrate with ItemDetailModal for seamless adding
   - Show cart total and order summary

### Phase 4: Multi-Device Synchronization
1. **Real-time Updates**
   - Implement polling or WebSocket for cart sync
   - Show when other people at table add items
   - Display who ordered what items

2. **User Identification**
   - Add optional user names for table members
   - Show who added each item to cart
   - Allow individual vs shared ordering

### Phase 5: Testing & QR Integration
1. **QR Code Generation**
   - Create QR codes with table and session parameters
   - Test multi-device access to same table
   - Verify cart sharing between devices

2. **End-to-End Testing**
   - Test cart operations (add, remove, update)
   - Verify order status progression
   - Test table session sharing

## Technical Implementation Steps

### Step 1: Update Session Management
- Create secure session token generation utility
- Implement server-side session mapping (token → table info)
- Modify `use-cart.ts` to use hashed session tokens
- Add session validation and expiration logic
- Update all cart hooks to use secure session strategy

### Step 2: Add Order Status
- Update schema.ts with status fields
- Modify storage.ts cart methods
- Add new API endpoints for order status

### Step 3: Build Cart UI
- Create Cart component with sidebar
- Add floating cart button to restaurant page
- Integrate cart count display

### Step 4: Test Table Sharing & Security
- Test with multiple browser tabs/devices
- Verify cart synchronization
- Test QR code parameter passing
- Verify session tokens can't be guessed or enumerated
- Test session expiration and token validation

### Step 5: Order Workflow
- Add "Place Order" functionality
- Implement status updates (ordered → preparing → served)
- Add order history view

## Success Criteria
- ✅ Multiple devices can access same table cart via QR code
- ✅ Cart items persist across browser refreshes
- ✅ Users can add/remove items from shared cart
- ✅ Order status tracking works (cart → ordered → served)
- ✅ Cart UI shows current items and order history
- ✅ Table members can see what others have ordered

## Next Steps
1. Start with Phase 1 (Table-based sessions)
2. Test basic cart sharing between devices
3. Add order status management
4. Build comprehensive cart UI
5. Implement real-time synchronization
