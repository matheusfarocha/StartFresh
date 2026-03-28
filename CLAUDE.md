# FreshStart — Project Tracker

## Overview
FreshStart is a compassionate digital guide for returning jailed citizens in NYC. It provides a personalized, step-by-step action plan for the critical first 72 hours after release.

## Tech Stack
- **Framework:** React 19 + TypeScript
- **Build:** Vite 8
- **Styling:** Tailwind CSS v4 (`@tailwindcss/vite`)
- **Routing:** React Router DOM v7
- **Fonts:** Plus Jakarta Sans (headlines/labels), Be Vietnam Pro (body)
- **Icons:** Material Symbols Outlined (Google Fonts CDN)

## Design System
Based on the "Tactile Joy Protocol" / Solaris Play spec:
- Primary: `#9d4f00` (warm orange)
- Secondary: `#007164` (calming teal)
- Tertiary: `#fdc003` (gold accent)
- No 1px borders — use background shifts
- Block shadows (2-6px solid offset) instead of drop shadows
- `rounded-lg` (2rem) on cards, `rounded-full` on pills
- Large touch targets, generous whitespace
- Plus Jakarta Sans exclusively for the Solaris Play roadmap view

## App Structure
```
app/
├── public/images/         # Local mascot/avatar assets
├── src/
│   ├── components/
│   │   ├── Layout.tsx     # Shared shell (Header + conditional Footer)
│   │   ├── Header.tsx     # Sticky nav, disabled state for loading screen
│   │   ├── Footer.tsx     # Shared footer (hidden on roadmap)
│   │   └── Icon.tsx       # Material Symbols helper
│   ├── pages/
│   │   ├── Welcome.tsx    # Landing page → /login
│   │   ├── Login.tsx      # Placeholder login → /home
│   │   ├── Home.tsx       # Feature hub → /question/borough
│   │   ├── QuestionBorough.tsx    # Step 1/3
│   │   ├── QuestionTimeAway.tsx   # Step 2/3
│   │   ├── QuestionUrgentNeed.tsx # Step 3/3
│   │   ├── GeneratingRoadmap.tsx  # Loading, 3s auto-advance
│   │   └── Roadmap.tsx    # Solaris Play journey path view
│   ├── data/
│   │   └── roadmapSteps.ts  # 8 static steps with details
│   ├── App.tsx            # Route definitions
│   ├── main.tsx           # Entry point + BrowserRouter
│   └── index.css          # Tailwind theme + custom animations
```

## User Flow
```
/ (Welcome) → /login → /home → /question/borough → /question/time-away
→ /question/urgent-need → /generating (3s) → /roadmap
```

## Roadmap Page (Solaris Play)
- Winding SVG path with offset step nodes
- Completed (teal + checkmark), Current (orange + glow), Upcoming (faded), Locked (lock)
- Mascot encouragement bubble
- Fixed FAB "Continue Step N"
- Fixed bottom nav bar (Journey, Resources, Mascot, Profile)
- Canvas felt texture overlay

## Performance Notes
- All mascot images stored locally in `/public/images/` (not fetched from Google CDN)
- Decorative blur elements use `will-change: transform`, `contain: strict`, `pointer-events: none`
- Removed `backdrop-filter: blur()` where possible (expensive repaint)
- `loading-pulse` animation uses CSS only (no JS timers)

## Known Issues / TODO
- Login is a non-functional placeholder (no auth)
- Resources, Support, Community, Mascot nav items are placeholder links
- Bottom nav on roadmap is static (no route switching)
- Quick Access cards on Home are placeholder
- No mobile hamburger menu for header nav
- No dark mode implementation yet
- Felt texture overlay loaded from external URL (transparenttextures.com)
