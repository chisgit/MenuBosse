# MenuBosse - Digital Restaurant Menu Platform

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
