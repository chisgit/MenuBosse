# MenuBosse
An amazing menu app, leaving the other QR scanned menus in the dust

## Development Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- PowerShell (Windows - Primary Platform)

### Getting Started

1. Clone the repository:
```powershell
git clone https://github.com/chisgit/MenuBosse.git
cd c:\Users\User\MenuBosse
```

2. Install dependencies:
```powershell
npm install
```

3. Start the development server:
```powershell
npm run dev
```

### Windows PowerShell Compatibility
The npm scripts are designed to work with PowerShell on Windows. The environment variables are set using PowerShell syntax:
- `$env:NODE_ENV='development'` for development mode
- `$env:NODE_ENV='production'` for production mode

**IMPORTANT: Command Chaining Syntax**
- ✅ CORRECT: Use semicolon (`;`) for chaining commands
- ❌ WRONG: Never use `&&` (bash syntax)

**Examples:**
```powershell
# Correct PowerShell syntax
cd c:\Users\User\MenuBosse; npm run dev

# WRONG - bash syntax (will fail)
cd c:\Users\User\MenuBosse && npm run dev
```

### Available Scripts
- `npm run dev` - Start development server with hot reloading
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run check` - Run TypeScript type checking
- `npm run db:push` - Push database schema changes

### Project Structure
- `client/` - React frontend application
- `server/` - Express.js backend server
- `shared/` - Shared types and schemas
- `components.json` - Shadcn/ui configuration
- `drizzle.config.ts` - Database configuration
