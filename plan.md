# MenuBosse - Digital Restaurant Menu Platform

## 🚨 CRITICAL DEVELOPMENT RULES - MUST FOLLOW

### 1. POWERSHELL SYNTAX ONLY (PRIMARY RULE)
**⚠️ CRITICAL: This project ONLY uses PowerShell syntax - NEVER bash/Unix syntax**

- **ALWAYS use PowerShell syntax** - This project is Windows PowerShell optimized
- **NO BASH SYNTAX EVER** - Never use bash/Unix commands in documentation or scripts
- **NO `&&` OPERATOR** - Use semicolon (`;`) for command chaining instead
- **Environment Variables**: Use `$env:VARIABLE_NAME='value'` syntax ONLY
- **Commands**: All terminal commands must be PowerShell compatible
- **Documentation**: All code examples must use PowerShell syntax

### ✅ CORRECT PowerShell Syntax Examples:
```powershell
# Navigate to project
cd c:\Users\User\MenuBosse

# Install dependencies
npm install

# Development server
npm run dev

# Environment variable setting
$env:NODE_ENV='development'

# Command chaining (USE SEMICOLON)
npm install; npm run dev
npm run build; npm run start

# Multiple operations
$env:NODE_ENV='development'; tsx server/index.ts
cd c:\Users\User\MenuBosse; npm run dev
```

### ❌ FORBIDDEN Bash/Unix Syntax (NEVER USE):
```bash
# NEVER USE THESE - THEY ARE BASH SYNTAX
cd ~/MenuBosse                          # ❌ Wrong
export NODE_ENV=development             # ❌ Wrong  
npm install && npm run dev              # ❌ Wrong - NO && operator
NODE_ENV=development tsx server/index.ts # ❌ Wrong
cd ~/MenuBosse && npm run dev           # ❌ Wrong
```

### 2. Code Quality
- Follow TypeScript strict mode
- Use proper error handling

## Project Overview
MenuBosse is a modern, dark-themed digital restaurant menu platform that provides an elegant dining experience through technology.

## Current Development Focus
### UI/UX Improvements - Menu Cards Enhancement

**Priority Items:**
1. **Image Prominence** - Food images should be larger and more enticing (primary selling point)
2. **Price Visibility** - Enhanced price badges with better contrast and prominence
3. **Voting System Contrast** - Improved like/dislike buttons with better visual separation from cards
4. **Bottom Panel Transparency** - More transparent bottom sections to showcase food images
5. **Visual Hierarchy** - Clear distinction between interactive elements

### Development Environment
- **Platform Compatibility**: Windows PowerShell optimized
- **Environment Variables**: PowerShell syntax (`$env:NODE_ENV='development'`)
- **Shell Commands**: All npm scripts use PowerShell-compatible syntax
- **Development Server**: Uses tsx for TypeScript execution with hot reloading

### PowerShell Syntax Rules
**CRITICAL: Always use PowerShell syntax, never bash/Unix syntax**

**Command Chaining:**
- ✅ CORRECT: Use semicolon (`;`) to chain commands
- ❌ WRONG: Never use `&&` (bash syntax)

**Environment Variables:**
- ✅ CORRECT: `$env:VARIABLE_NAME='value'`
- ❌ WRONG: `VARIABLE_NAME=value` (bash syntax)

**Examples:**
```powershell
# Correct PowerShell syntax
npm run build; npm run start
$env:NODE_ENV='development'; tsx server/index.ts
cd c:\Users\User\MenuBosse; npm run dev

# NEVER use these (bash syntax)
npm run build && npm run start  # ❌
NODE_ENV=development tsx server/index.ts  # ❌
cd c:\Users\User\MenuBosse && npm run dev  # ❌
```

### Quick Start Commands (PowerShell)
```powershell
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Type checking
npm run check

# Database operations
npm run db:push
```

### Technical Architecture
- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS + Custom Dark Theme
- **State Management**: React Query for server state
- **UI Components**: Shadcn/ui component library
- **Backend**: Express.js with TypeScript
- **Database**: (To be determined based on drizzle.config.ts)

### Design System
- **Theme**: Elegant dark restaurant aesthetic
- **Primary Color**: Orange (#FF6B35) for CTAs and highlights
- **Typography**: Inter for body, Playfair Display for headings
- **Layout**: Card-based grid system for menu items

### Current Task: Menu Card Visual Enhancements
1. Increase food image height from 64 (h-64) to 80 (h-80) for better visual impact
2. Enhance price badge visibility with larger size and better shadows
3. Improve voting container contrast with darker background and orange borders
4. Reduce bottom panel opacity from 95% to 60% for better image visibility
5. Add enhanced CSS classes for all new styling

### Code Quality Standards
- Follow TypeScript strict mode
- Use Tailwind utility classes with custom CSS for complex styling
- Maintain component modularity and reusability
- Ensure responsive design across all viewports
- Follow React best practices for hooks and state management

### File Structure Guidelines
- Components in `/client/src/components/`
- Custom styles in `/client/src/global.css`
- Hooks in `/client/src/hooks/`
- Shared types in `/shared/schema.ts`
- Server logic in `/server/`
