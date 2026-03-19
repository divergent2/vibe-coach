# 🎯 Vibe Coach

**Vibe Coach** is an AI-ready coaching web app that helps you prepare for job interviews and polish your portfolio pitch. Practice with targeted questions, submit answers, and receive instant feedback.

> 🚧 **MVP Status:** Currently uses mock AI content generation. Real AI integration (OpenAI / Anthropic) is ready to plug in via the generation layer at `src/lib/generation/`.

## ✨ Features

- 🎤 **Interview Coach** — Practice behavioral & technical interview questions
- 💼 **Pitch / Portfolio Coach** — Sharpen how you present your projects and personal brand
- 📊 **Scoring & Feedback** — Instant rubric-based scoring with strengths and improvement suggestions
- 💾 **Session History** — All sessions saved to a local SQLite database via Prisma
- 📱 **Mobile-friendly** — Responsive design built with Tailwind CSS
- 🔌 **AI-Ready** — Clean generation interface to swap in OpenAI / Anthropic later

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | SQLite (local) |
| ORM | [Prisma 7](https://www.prisma.io/) |
| Linting | ESLint |

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher ([download](https://nodejs.org/))
- **npm** v9 or higher (comes with Node.js)

### 1. Clone the repo

```bash
git clone https://github.com/divergent2/vibe-coach.git
cd vibe-coach
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env
```

You can edit `.env` if needed (the defaults work out of the box for local development).

### 4. Set up the database

```bash
npx prisma migrate dev --name init
```

This creates a local `dev.db` SQLite file with the required schema.

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. 🎉

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx                     # Landing page
│   ├── layout.tsx                   # Root layout + nav
│   ├── globals.css
│   ├── app/
│   │   ├── page.tsx                 # Mode picker
│   │   ├── new/page.tsx             # New session form
│   │   └── sessions/
│   │       ├── page.tsx             # Sessions list
│   │       └── [id]/page.tsx        # Session detail + feedback
│   └── api/
│       └── sessions/
│           ├── route.ts             # GET all, POST create
│           └── [id]/
│               ├── route.ts         # GET one, PATCH update
│               └── feedback/
│                   └── route.ts     # POST generate feedback
└── lib/
    ├── prisma.ts                    # Prisma client singleton
    └── generation/
        ├── types.ts                 # Shared types (AI-ready interface)
        └── mock.ts                  # Mock content generation
```

## 🗄 Database Schema

The app uses a single `Session` model:

| Field | Type | Description |
|-------|------|-------------|
| `id` | String | Unique ID (cuid) |
| `mode` | String | `"interview"` or `"pitch"` |
| `title` | String | Role or goal |
| `level` | String | Experience level |
| `focus` | String | Focus areas (optional) |
| `prompts` | String | JSON array of questions |
| `answers` | String | JSON map of answers by index |
| `feedback` | String | JSON map of feedback by index |
| `createdAt` | DateTime | Creation timestamp |
| `updatedAt` | DateTime | Last updated timestamp |

## 🧩 Adding Real AI

The generation logic lives in `src/lib/generation/`. To swap in a real AI provider:

1. Create `src/lib/generation/openai.ts` (or `anthropic.ts`)
2. Implement the same function signatures as `mock.ts`
3. Update the imports in `src/app/api/sessions/route.ts` and `src/app/api/sessions/[id]/feedback/route.ts`

## �� Deployment (Vercel)

This app is ready to deploy on [Vercel](https://vercel.com):

1. Push to GitHub
2. Import the repo on Vercel
3. Set the `DATABASE_URL` environment variable:
   - For production, use a hosted database like [Turso](https://turso.tech/) (LibSQL/SQLite-compatible) or migrate to PostgreSQL
4. Run `npx prisma generate` as part of the build command

> **Note:** SQLite (`file:./dev.db`) is only suitable for local development. For production, switch to a hosted database and update `prisma/schema.prisma` accordingly.

## 🔮 What's Next

- [ ] Real AI integration (OpenAI / Anthropic)
- [ ] User authentication (NextAuth.js)
- [ ] Voice answer recording + transcription
- [ ] Shareable session links
- [ ] Export session to PDF
- [ ] Timed mock interview mode

## 📄 License

MIT
