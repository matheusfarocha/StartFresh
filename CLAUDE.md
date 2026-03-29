# FreshStart — Project Tracker

## Overview
FreshStart is a compassionate digital guide for returning jailed citizens in NYC. It provides a personalized, step-by-step action plan for the critical first 72 hours after release. Federal employees can also use the app to build custom roadmaps for individuals in their care.

## Tech Stack
- **Framework:** React 19 + TypeScript
- **Build:** Vite 8
- **Styling:** Tailwind CSS v4 (`@tailwindcss/vite`)
- **Routing:** React Router DOM v7
- **Auth & DB:** Supabase (Auth + PostgreSQL)
- **Fonts:** Plus Jakarta Sans (headlines/labels), Be Vietnam Pro (body)
- **Icons:** Material Symbols Outlined (Google Fonts CDN)
- **Extras:** canvas-confetti (completion celebration)

## Design System
Based on the "Tactile Joy Protocol" / Solaris Play spec:
- Primary: `#9d4f00` (warm orange)
- Secondary: `#007164` (calming teal)
- Tertiary: `#fdc003` (gold accent)
- No 1px borders — use background shifts
- Block shadows (2-6px solid offset) instead of drop shadows
- `rounded-lg` (2rem) on cards, `rounded-full` on pills
- Large touch targets, generous whitespace

## App Structure
```
app/
├── public/images/           # Local mascot/avatar assets
├── src/
│   ├── components/
│   │   ├── Layout.tsx       # Shared shell (Header + conditional Footer)
│   │   ├── Header.tsx       # Sticky nav — logo routes to /home or /login based on auth
│   │   ├── Footer.tsx       # Shared footer (hidden on roadmap)
│   │   └── Icon.tsx         # Material Symbols helper
│   ├── context/
│   │   ├── AuthContext.tsx   # Supabase auth (sign up/in/out, display name, session)
│   │   └── AppContext.tsx    # App state (answers, roadmap, currentStep) — persisted to Supabase
│   ├── lib/
│   │   └── supabase.ts      # Supabase client init
│   ├── pages/
│   │   ├── Welcome.tsx      # Landing page → /login
│   │   ├── Login.tsx        # Auth (login + create account with display name)
│   │   ├── Home.tsx         # Feature hub — Roadmap card routes to onboarding or /roadmap
│   │   ├── QuestionPage.tsx # Dynamic question renderer (driven by questions.js)
│   │   ├── GeneratingRoadmap.tsx  # Loading, 3s auto-advance
│   │   ├── Roadmap.tsx      # Journey path view with guide panel + confetti on completion
│   │   ├── CustomRoadmap.tsx # Federal employee roadmap builder
│   │   ├── Resources.tsx    # Placeholder
│   │   ├── Community.tsx    # Placeholder
│   │   └── Profile.tsx      # Shows display name, email, member since, sign out
│   ├── data/
│   │   ├── questions.js     # Adaptive question bank with branching logic
│   │   ├── roadmapEngine.ts # Priority-based roadmap generator (borough-specific steps)
│   │   └── roadmapSteps.ts  # Legacy static steps (may be unused now)
│   ├── App.tsx              # Route definitions
│   ├── main.tsx             # Entry — BrowserRouter + AuthProvider + AppProvider
│   └── index.css            # Tailwind theme + custom animations
```

## Supabase Schema

### `profiles` table
- `id` (uuid, PK, FK → auth.users)
- `display_name` (text)
- `created_at` (timestamptz)
- RLS: users can read/insert/update own row

### `user_sessions` table
- `user_id` (uuid, PK, FK → auth.users) — one session per user
- `responses` (jsonb) — all onboarding answers
- `roadmap` (jsonb) — generated roadmap + currentStep
- `created_at` / `updated_at` (timestamptz)
- RLS: users can read/insert/update own row

## User Flows

### Returning Citizen
```
/ (Welcome) → /login → /home → /question/userType ("returning citizen")
→ /question/timeAway → /question/borough → ... (adaptive branching)
→ /question/needs → /generating (3s) → /roadmap
```

### Federal Employee
```
/ (Welcome) → /login → /home → /question/userType ("federal employee")
→ /customroadmap (build steps, confirm) → saved to user's roadmap in Supabase
```

## Onboarding Questions (questions.js)
Adaptive flow — answers determine next question:
1. **userType** — citizen vs federal employee (employee → /customroadmap)
2. **timeAway** — duration away
3. **borough** — NYC borough
4. **hasID** → if no/expired → **hasBirthCert**
5. **housingStatus** → if nowhere → **hasChildren**
6. **paroleProbation**
7. **needs** (multi-select) → generates roadmap

## Roadmap Features
- Winding SVG path with offset step nodes
- Completed (teal), Current (orange + glow pulse), Upcoming (faded), Locked (faded more)
- Click card → side panel (desktop) / bottom sheet (mobile) with guide details
- Fullscreen toggle on guide panel
- Mark as Complete / Mark as Incomplete buttons
- Undo badge on completed steps
- Last step completable → confetti celebration with personalized message
- All progress persisted to Supabase in real-time
- "My Roadmap" card on Home routes to /roadmap if onboarding done, /question/userType if not

## Custom Roadmap (Federal Employee)
- Same winding path UI but editable
- Click + node or inline nodes to add steps
- Edit panel: category icon picker, title, instructions
- Delete steps from edit panel
- Confirm button → warning dialog ("can't go back") → saves to Supabase → routes to /roadmap

## Auth
- Supabase Auth (email + password)
- Login / Create Account toggle on same page
- Display name stored in `profiles` table
- Session auto-restores on page reload via `onAuthStateChange`
- Sign out from Profile page
- Header logo: /home if logged in, /login if not
- Service role key used for profile reads (bypasses RLS) — **must move to server-side before production**

## Environment Variables (app/.env — gitignored)
```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_SUPABASE_SERVICE_ROLE_KEY=
```

## Known Issues / TODO
- [ ] Service role key exposed in frontend via VITE_ prefix — move to Edge Function before production
- [ ] Onboarding answers (hasID, housingStatus, hasChildren, etc.) not fully wired into roadmap engine scoring
- [ ] Resources, Community pages are placeholders
- [ ] Quick Access cards on Home are placeholders (Hotlines, Nearby, Documents)
- [ ] No mobile hamburger menu for header nav
- [ ] No dark mode
- [ ] Felt texture overlay loaded from external URL (transparenttextures.com)
- [ ] Custom roadmap steps not yet persisted to Supabase (in-memory only)
- [ ] No email confirmation flow (disabled for dev)
- [ ] roadmapSteps.ts may be dead code now that roadmapEngine.ts handles generation
- [ ] Gemini integration for AI-driven roadmap generation (planned — currently uses static engine)
