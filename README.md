# MenuBosse
An amazing menu app, leaving the other QR scanned menus in the dust

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher) - [Download here](https://nodejs.org/)
- npm (comes with Node.js) or yarn
- Git - [Download here](https://git-scm.com/)

### Installation & Setup

1. **Clone the repository:**
```bash
git clone https://github.com/chisgit/MenuBosse.git
cd MenuBosse
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start the development server:**
```bash
npm run dev
```

4. **Open your browser:**
   - Navigate to `http://localhost:5000` (Server API)
   - The application will automatically open in your default browser

## 🖥️ Platform-Specific Instructions

### Windows (PowerShell/Command Prompt)
```powershell
git clone https://github.com/chisgit/MenuBosse.git
cd MenuBosse
npm install
npm run dev
```

### macOS/Linux (Terminal)
```bash
git clone https://github.com/chisgit/MenuBosse.git
cd MenuBosse
npm install
npm run dev
```

### Alternative Package Managers

**Using Yarn:**
```bash
yarn install
yarn dev
```

**Using pnpm:**
```bash
pnpm install
pnpm dev
```

## 📁 Project Structure

```
MenuBosse/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility libraries
│   │   └── styles/         # Global styles
│   ├── public/             # Static assets (including mock API data)
│   └── index.html          # Entry HTML file
├── server/                 # Express.js backend server
│   ├── index.ts            # Server entry point
│   ├── routes.ts           # API routes
│   ├── storage.ts          # Data storage logic (in-memory for mock data)
│   └── vite.ts             # Vite integration
├── shared/                 # Shared types and schemas
│   └── schema.ts           # Database schemas
├── package.json            # Root dependencies and scripts
├── vite.config.ts          # Vite configuration
├── tailwind.config.ts      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

## 📊 Data Structure and Flow

The application uses a mock API served by the Express.js backend, with data managed in `server/storage.ts` and static JSON files in `client/public/api/`.

### **Restaurant Data (`client/public/api/restaurants/:id.json`)**
- Restaurant details are primarily stored in `server/storage.ts` in the `MemStorage` class.
- For mock API purposes, a `restaurantId.json` file (e.g., `client/public/api/restaurants/1.json`) contains basic restaurant information.
- The `id` in the JSON file corresponds to the `restaurantId` used throughout the application.

### **Menu Structure (`client/public/api/restaurants/:id/menu.json` and `categories.json`)**
- **Categories**: `client/public/api/restaurants/:id/categories.json` defines the menu categories (e.g., Appetizers, Main Dishes, Desserts). Each category has an `id` and `name`.
- **Menu Items**: `client/public/api/restaurants/:id/menu.json` lists all menu items for a specific restaurant.
  - Each `menuItem` object includes:
    - `id`: Unique identifier for the menu item.
    - `restaurantId`: Links the item to a specific restaurant.
    - `categoryId`: Links the item to a specific menu category (e.g., `categoryId: 3` for Desserts).
    - `name`, `description`, `fullDescription`, `price`, `imageUrl`, `rating`, `votes`, `upvotes`, `downvotes`.
  - The `imageUrl` field specifies the path to the item's image. For local assets, these are typically found under `client/public/assets/images/food/`.

### **Linking Menu Items to Item Details and Cart**
1. **Menu Item to Item Details Card**:
   - When a user clicks on a menu item in the main menu, the `ItemDetailModal.tsx` component is used to display detailed information.
   - The `menuItemId` is passed to this modal, which then fetches the full `menuItem` object using the `/api/menu-items/:id` endpoint (handled by `server/routes.ts` and `server/storage.ts`).
   - The `fullDescription` and `imageUrl` from the `menuItem` object are used to populate the modal.
   - Add-ons for a specific menu item are fetched via `/api/menu-items/:id/addons`.

2. **Item Details to Shopping Cart**:
   - When a user adds an item to the cart from the `ItemDetailModal`, the `addToCart` function (in `server/storage.ts`) is called via the `/api/cart` endpoint.
   - This function creates a `CartItem` entry, linking it to the `menuItemId` and any selected `addons`.
   - The `Cart.tsx` component then fetches cart items using `/api/cart/:sessionId`, which retrieves the `CartItem` along with its associated `MenuItem` details and `MenuItemAddon` details.

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reloading |
| `npm run build` | Build the application for production |
| `npm run start` | Start the production server |
| `npm run check` | Run TypeScript type checking |
| `npm run db:push` | Push database schema changes |

## 🔧 Development Features

- **Hot Reloading**: Changes automatically refresh in the browser
- **TypeScript**: Full type safety across the application
- **Tailwind CSS**: Utility-first CSS framework
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark/Light Mode**: Toggle between themes
- **Component Library**: Built with shadcn/ui components

## 🍕 Application Features

- **Interactive Menu**: Browse restaurant menus with beautiful UI
- **Item Details**: View detailed information about menu items
- **Cart Functionality**: Add items to cart with quantity controls
- **Customization**: Add-ons and modifications for menu items
- **Responsive Design**: Works perfectly on all devices
- **Theme Support**: Light and dark mode toggle

## 🌐 Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

## 🛠️ Tech Stack

**Frontend:**
- React 18
- TypeScript
- Tailwind CSS
- Vite
- shadcn/ui components

**Backend:**
- Node.js
- Express.js
- TypeScript

**Development Tools:**
- Vite (build tool)
- ESLint (linting)
- Prettier (code formatting)

## 🐛 Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Kill process on port 5173
npx kill-port 5173
# Or use a different port
npm run dev -- --port 3000
```

**Module not found errors:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**TypeScript errors:**
```bash
# Run type checking
npm run check
```

### Getting Help

If you encounter any issues:
1. Check the console for error messages
2. Ensure all prerequisites are installed
3. Try clearing cache and reinstalling dependencies
4. Open an issue on GitHub with error details

## 📝 Environment Setup

The application works out of the box with no additional configuration required. All necessary environment variables are handled internally.

## 🚀 Deployment

To build for production:
```bash
npm run build
```

The built files will be in the `dist` folder, ready for deployment to any static hosting service.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and type checking
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
