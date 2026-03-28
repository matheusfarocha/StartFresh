# Revia — Your Fresh Start Guide

A personalized NYC reentry companion app for returning citizens.

## Setup

```bash
cd revia
npm install
npm start
```

Opens at http://localhost:3000

## User Flow

```
Login → Learn More → Onboarding (3 Qs) → Roadmap → Dashboard
```

## Project Structure

```
src/
├── pages/
│   ├── Login.js          # Entry point, phone-based auth
│   ├── LearnMore.js      # Trust building, stats, NYC alumni stories
│   ├── Onboarding.js     # 3-question flow: time away, borough, needs
│   ├── Roadmap.js        # Generated step-by-step plan with check-offs
│   └── Dashboard.js      # Home hub: progress, next step, quick access
├── components/
│   ├── Button.js         # Reusable button with variants
│   ├── Mascot.js         # Animated Revia companion face
│   └── Chatbot.js        # Floating chat assistant
├── context/
│   └── AppContext.js     # Global state: user, profile, roadmap, progress
├── data/
│   └── roadmapEngine.js  # AI scoring + resource lookup by borough/need
└── index.css             # Design tokens (CSS variables)
```

## Design Tokens (index.css)

- `--green-deep` / `--green-mid` / `--green-light` / `--green-pale`
- `--cream` / `--cream-dark`
- `--ink` / `--ink-mid` / `--ink-soft` / `--ink-muted`
- `--font-display: 'Fraunces'` (serif, editorial)
- `--font-body: 'DM Sans'` (clean, legible)

## Roadmap Engine (roadmapEngine.js)

The engine takes `{ timeAway, borough, needs }` and:
1. Always adds `id` as priority #1 (everything depends on it)
2. Auto-adds `mentalHealth` for 5+ years away
3. Auto-adds `community` for 15+ years away
4. Scores each need, sorts by urgency
5. Returns borough-specific steps (real addresses/phones)

## Next Steps (Phase 2)

- [ ] Real AI integration via Claude API for dynamic resource lookup
- [ ] NYC Open Data API for live program information
- [ ] Push notifications for step reminders
- [ ] Community/mentor matching
- [ ] Caseworker dashboard view
- [ ] Mobile-responsive polish + PWA
