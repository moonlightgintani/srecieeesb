# IEEE Student Branch SREC - Website

A modern, responsive website for the IEEE Student Branch at Sri Ramakrishna Engineering College, Coimbatore.

## 🛠️ Tech Stack

- **Frontend:** React 18, TypeScript, Vite 5
- **Styling:** Tailwind CSS v3, shadcn/ui components
- **State:** TanStack React Query
- **Routing:** React Router DOM v6
- **Database:** Supabase (PostgreSQL)

## 📋 Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x (or use bun/pnpm)
- A **Supabase** project (for database features)

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd ieee-sb-srec
```

### 2. Install dependencies

```bash
npm install
```

> This is a Node.js project – `package.json` serves as the requirements file (like `requirements.txt` in Python).

### 3. Set up Supabase Database

1. Create a new project at [supabase.com](https://supabase.com)
2. Run `database/schema.sql` in the Supabase SQL Editor to create tables
3. Run `database/seed.sql` in the Supabase SQL Editor to insert all data
4. Copy your Supabase URL and anon key

### 4. Environment Variables

Set in your hosting platform or `.env`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 5. Run development server

```bash
npm run dev
```

App runs at `http://localhost:5173`

### 6. Build for production

```bash
npm run build
```

Output in `dist/` – deploy to Vercel, Netlify, etc.

## 📁 Project Structure

```
src/
├── assets/          # Images
├── components/      # React components (Navbar, Hero, Activities, etc.)
├── data/            # Static data files
├── pages/           # Page components
├── index.css        # Design system
└── main.tsx         # Entry point

database/
├── schema.sql       # Table creation SQL
└── seed.sql         # Data insertion SQL (all 46 activities + office bearers)
```

## 🗄️ Database Tables

| Table | Rows | Description |
|-------|------|-------------|
| activities | 46 | Events from 2020–2025 |
| office_bearers | 9 | Current office bearer roles |
| executive_members | 9 | Executive committee |
| advisors | 3 | Faculty advisors |
| societies | 4 | IEEE society chapters |

## 📦 Key Dependencies

See `package.json` for the full list. Major packages:
- react, react-dom, react-router-dom
- @tanstack/react-query
- tailwindcss, lucide-react
- vite, typescript

## 📄 License

© IEEE Student Branch SREC. All rights reserved.
