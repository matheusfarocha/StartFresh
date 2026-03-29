<div align="center">

<img src="app/public/images/logo.png" alt="FreshStart Logo" width="600" />

**All-in-one platform helping people leaving NYC jails rebuild their lives, AI-powered, personalized.**

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vite.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-Auth_+_DB-3FCF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com)
[![Google Gemini](https://img.shields.io/badge/Gemini-AI_Powered-4285F4?style=flat-square&logo=google&logoColor=white)](https://ai.google.dev)

</div>

---

## The Problem

Every year, thousands of people walk out of NYC jails and prisons with no plan, no phone, and no idea where to go. Within 72 hours, they need food, shelter, ID, and a path forward, but the system gives them a bus ticket and a list of phone numbers.

## The Solution

FreshStart asks a few simple questions and builds a **personalized, step-by-step action plan** with real NYC resources -- specific addresses, phone numbers, and what to bring. An AI assistant named **Sage** is available 24/7 to answer questions and provide support.

---

## Features

| Feature | Description |
|---------|-------------|
| **Adaptive Onboarding** | Branching questions that adjust based on answers -- no two users get the same flow |
| **Survival-First Algorithm** | Food and shelter prioritized above everything when someone is in crisis |
| **AI Follow-Up Questions** | Gemini generates personalized questions to fill knowledge gaps |
| **AI Task Generation** | Additional tasks created based on the user's specific situation |
| **Sage Chatbot** | AI assistant with full context of user answers and roadmap progress |
| **Borough-Specific Resources** | Real addresses for DMVs, shelters, HRA offices across NYC |
| **45+ Verified Resources** | Curated directory with working links, descriptions, and contact info |
| **Federal Employee Mode** | Staff can build custom roadmaps for individuals in their care |
| **Community Forum** | Space for returning citizens to connect and support each other |
| **Progress Tracking** | Check off steps, track progress, confetti on completion |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, TypeScript, Vite 8, Tailwind CSS v4 |
| **Backend** | Supabase (Auth, PostgreSQL, Edge Functions) |
| **AI** | Google Gemini 3.1 Flash Lite (via Supabase Edge Functions) |
| **Design** | Custom "Tactile Joy" design system -- warm colors, block shadows, large touch targets |

---

## Architecture

```
User --> Login (Supabase Auth)
  |
  v
Adaptive Onboarding (branching question bank)
  |
  v
Roadmap Engine (priority scoring + borough-specific steps)
  |
  v
Gemini Follow-Up Questions (3 AI questions via Edge Function)
  |
  v
Gemini Task Generation (personalized tasks via Edge Function)
  |
  v
Combined Roadmap --> Progress Tracking --> Supabase (persisted)

  Throughout: Sage Chatbot (Edge Function, full user context)
  Throughout: Resource Directory (45+ verified orgs)
  Throughout: Community Forum (Supabase posts/replies)
```

All AI calls go through **Supabase Edge Functions** — the Gemini API key never touches the frontend.

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- Supabase account

### Setup

```bash
# Clone
git clone https://github.com/matheusfarocha/StartFresh.git
cd StartFresh/app

# Install
npm install

# Environment
cp .env.example .env
# Fill in your Supabase URL, anon key, and service role key

# Run
npm run dev
```

### Supabase Setup

1. Create a new Supabase project
2. Run the SQL in `supabase/` to create tables (`profiles`, `user_sessions`, `posts`, `replies`, `post_votes`)
3. Deploy Edge Functions:
   ```bash
   npx supabase link --project-ref YOUR_PROJECT_REF
   npx supabase secrets set GEMINI_API_KEY=YOUR_KEY
   npx supabase functions deploy chat --no-verify-jwt
   npx supabase functions deploy generate-tasks --no-verify-jwt
   ```

---

## Project Structure

```
app/
├── public/images/           # Mascot & avatar assets
├── src/
│   ├── components/          # Layout, Header, Footer, ChatWidget, Icon
│   ├── context/             # AuthContext (Supabase), AppContext (state + persistence)
│   ├── data/                # questions.js, roadmapEngine.ts, resources.ts
│   ├── lib/                 # supabase.ts, resourcesAPI.ts
│   └── pages/               # All route pages
supabase/
├── functions/
│   ├── chat/                # Sage chatbot Edge Function
│   └── generate-tasks/      # AI follow-up questions + task generation
```

---

## Roadmap Engine

The engine uses a **priority-based scoring algorithm** that weighs every onboarding answer:

- `foodSituation: "none"` --> Food steps score **10,000** (absolute top)
- `housingStatus: "nowhere"` --> Emergency shelter at **9,999**
- `hasPhone: "no"` --> Phone access at **997**
- `hasID: "no"` --> ID recovery at **996**
- `paroleProbation: "parole"` --> Auto-adds legal section
- `timeAway: "15+ years"` --> Auto-adds mental health + community

Someone starving and homeless gets a completely different roadmap than someone with stable housing looking for work.

---

## What's Next

- **NYC Open Data integration** -- live resource data (shelter capacity, food pantry hours)
- **Gemini step personalization** -- rewrite instructions for the specific user
- **Conversational onboarding** -- natural chat instead of multiple choice
- **Real-time resource matching** -- "This shelter has availability right now"
- **Outcome tracking** -- learn which resources actually help

---

<div align="center">

Built with care for the people who need it most.

</div>
