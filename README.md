# Sandarbh — Nepal Education Platform

Sandarbh is a full-stack education platform for Nepal covering **Class 8 → Master** (SEE, +2 / NEB, CTEVT, TU / KU / PU / Pokhara University). It includes a public study portal (notes, books, question banks, past papers, mock tests, scholarships, results, notices, blog, and a community Q&A) plus an **admin panel** with **authentication** for managing all content.

Built as a monorepo with three apps:

| Folder | Description | Stack |
| --- | --- | --- |
| `client/` | Next.js web app (public site + admin panel) | Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, TanStack Query, Zustand, react-hook-form + Zod |
| `server/` | REST API | Express 5, Sequelize 6, PostgreSQL (Aiven), JWT auth, bcrypt |
| `rag/` | RAG microservice (Self Learning Center) | Python, FastAPI, SQLAlchemy, pgvector, OpenRouter (LLM + embeddings) |

---

## ✨ Features

### Self Learning Center (`rag/` + `server/` + `client/`)
- **Private documents** — logged-in users upload their own study material (PDF / DOCX / TXT); files are chunked, embedded and stored in PostgreSQL via **pgvector**, scoped per user
- **Grounded Q&A** — the AI answers *only* from the user's documents, with numbered citations (document + page) returned for verification
- **Quiz Builder** — generates 3–20 MCQs at easy / medium / hard difficulty, optionally focused on a topic or a single document, with instant scoring and explanations
- Streaming answers (SSE) proxied from the Python service through the Express API

### Public site (`client/`)
- **Study resources** — notes, books, question banks, past papers, mock tests per subject/level
- **Explorer** — levels, universities, faculties, subjects (with syllabus), scholarships, notices, results, blog
- **Community Q&A** — ask questions, add answers, view counts
- **Search** — unified search across subjects, notes, books, question banks, mock tests, scholarships, posts and community
- **Contact form** — sends email via Nodemailer (optional)
- Dashboard, profile, bookmarks and study-tracker (client-side state)

### Authentication (`server/` + `client/`)
- JWT-based auth: `register`, `login`, `me`
- Passwords hashed with **bcrypt**
- Roles: `user` and `admin`
- The navbar shows **Sign in / Sign up** when logged out, and the logged-in user's **initial** (first letter) with a profile dropdown and **Sign out**

### Admin panel (`client/admin/*` + `server/api/admin/*`)
- Login-protected, admin-only area (`/admin`)
- **Dashboard** — live record counts for every collection + recent contact messages and community questions
- **Content manager** — add, edit, search and delete records for all 18 content collections
- **Schema-driven forms** — inputs are generated from the actual Sequelize model metadata:
  - Enum fields render as dropdowns (e.g. University `type`, Book `language`, difficulty/format fields)
  - Booleans as switches, numbers as number inputs, dates as date pickers
  - Array fields (tags, programs, units…) as one-per-line textareas
  - JSON fields (syllabus…) as JSON editors
  - Required fields are marked `*` and validated, defaults are pre-filled
- **User management** — promote/demote admins, delete users (with self-protection)

---

## 🚀 Getting started

### Prerequisites
- **Node.js** ≥ 18
- **PostgreSQL** database (any host — local or managed like Aiven)

### 1. Backend

```bash
cd server
npm install
cp .env.example .env     # fill in your database + JWT settings
npm run seed             # creates tables, seeds all 18 collections + admin user
npm run dev              # starts API on http://localhost:5000
```

`.env` variables:

| Variable | Description |
| --- | --- |
| `DB_NAME`, `DB_USERNAME`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT` | PostgreSQL connection |
| `JWT_SECRET` | Secret used to sign auth tokens |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Admin account created/updated by the seed |
| `SMTP_USER`, `SMTP_PASSWORD` | Optional — used by `/api/contact` to send email |
| `RAG_SERVICE_URL` / `RAG_SERVICE_SECRET` | RAG microservice base URL and shared secret (used by `/api/rag/*`) |

> **Health check:** `http://localhost:5000/api/health`

### 2. Frontend

```bash
cd client
npm install
cp .env.example .env.local   # optional — NEXT_PUBLIC_API_URL defaults to the local API
npm run dev                  # starts app on http://localhost:3000
```

`.env.local` variables:

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | Base URL of the backend API (default `http://localhost:5000/api`) |

### 3. RAG microservice (Self Learning Center)

```bash
cd rag
python -m venv .venv
.venv\Scripts\activate          # Windows · source .venv/bin/activate on Linux/macOS
pip install -r requirements.txt
cp .env.example .env            # fill in RAG_DB_URL, OPENROUTER_API_KEY, RAG_SERVICE_SECRET
uvicorn app.main:app --reload --port 8000
```

- Uses the **same PostgreSQL** as the server (`RAG_DB_URL`) — it enables the `vector`
  extension and creates its tables (`rag_documents`, `rag_chunks`, `rag_messages`, `rag_quizzes`)
  automatically on startup.
- Requires an **OpenRouter API key** for both chat and embeddings.
- `RAG_SERVICE_SECRET` must match `RAG_SERVICE_SECRET` in `server/.env`.

### 4. Log in to the admin panel

1. Open `http://localhost:3000/login`
2. Use the seeded admin credentials (or your `ADMIN_EMAIL` / `ADMIN_PASSWORD`):

   ```
   Email:    admin@sandarbh.com
   Password: admin123
   ```

3. You'll land on the **admin dashboard** — the navbar also shows **Admin panel** when an admin is signed in.

> ⚠️ Change `ADMIN_PASSWORD` (and `JWT_SECRET`) before deploying.

---

## 📡 API overview

All endpoints return the envelope: `{ success, message, data, errors }`.

### Public read endpoints (`GET`)

| Endpoint | Description |
| --- | --- |
| `/api/levels` | Study levels (SEE, +2, Bachelor…) |
| `/api/universities` | Universities |
| `/api/faculties` | Faculties |
| `/api/subjects` · `/api/subjects/:slug` · `/api/subjects/level/:levelSlug` · `/api/subjects/trending` | Subjects |
| `/api/notes` · `/api/books` · `/api/question-banks` · `/api/past-papers` · `/api/mock-tests` | Study resources (optional `?limit=` / `?subjectSlug=` filters) |
| `/api/scholarships` · `/api/notices` · `/api/results` | Opportunities & results |
| `/api/testimonials` · `/api/faqs` | Site content |
| `/api/posts` · `/api/posts/:slug` | Blog |
| `/api/community` | Community Q&A |
| `/api/communities` | Study communities (chat groups + channels) |
| `/api/communities/:id/messages?channel=` | Messages in a community channel |
| `/api/leaderboard` | Leaderboard |
| `/api/search?q=` | Unified search |
| `/api/contact` | Contact submissions |

### Public write endpoints

| Endpoint | Description |
| --- | --- |
| `POST /api/community` | Ask a community question |
| `POST /api/community/:id/answers` | Add an answer |
| `POST /api/community/:id/view` | Increment views |
| `POST /api/communities/:id/messages` | Send a chat message to a channel |
| `POST /api/communities/messages/:messageId/reactions` | React to a chat message |
| `POST /api/contact` | Submit the contact form |

### Auth

| Endpoint | Description |
| --- | --- |
| `POST /api/auth/register` | Create an account → returns `{ token, user }` |
| `POST /api/auth/login` | Sign in → returns `{ token, user }` |
| `GET /api/auth/me` | Current user (requires `Authorization: Bearer <token>`) |

### Admin (all require `Authorization: Bearer <admin-token>`)

| Endpoint | Description |
| --- | --- |
| `GET /api/admin/stats` | Counts for every collection + recent contacts/questions |
| `GET /api/admin/meta/:resource` | Model schema for the admin form builder (types, enums, required fields) |
| `GET /api/admin/:resource` · `GET /api/admin/:resource/:id` | List / get one record |
| `POST /api/admin/:resource` | Create a record |
| `PUT /api/admin/:resource/:id` | Update a record |
| `DELETE /api/admin/:resource/:id` | Delete a record |
| `GET /api/admin/users` · `PUT /api/admin/users/:id` · `DELETE /api/admin/users/:id` | Manage users |

`resource` is one of: `levels`, `universities`, `faculties`, `subjects`, `notes`, `books`, `question-banks`, `past-papers`, `mock-tests`, `scholarships`, `notices`, `results`, `testimonials`, `faqs`, `posts`, `community`, `communities`, `leaderboard`, `contacts`.

### Self Learning Center (all require `Authorization: Bearer <token>`)

The Express server validates the JWT and proxies to the Python service (`RAG_SERVICE_URL`),
forwarding the user id + `RAG_SERVICE_SECRET`.

| Endpoint | Description |
| --- | --- |
| `POST /api/rag/documents` | Upload + index a PDF / DOCX / TXT file (multipart `file`) |
| `GET /api/rag/documents` · `DELETE /api/rag/documents/:id` | List / delete the user's documents |
| `POST /api/rag/chat` | Grounded answer `{ question, document_ids?, history? }` → `{ answer, sources }` |
| `POST /api/rag/chat/stream` | Same, streamed as SSE events (`meta`, `delta`*, `sources`, `done`) |
| `GET /api/rag/chat/history?limit=` | Previous chat messages |
| `POST /api/rag/mcq/generate` | `{ count, difficulty, topics?, document_ids?, notes? }` → sanitized quiz |
| `GET /api/rag/mcq/:id` | Fetch a quiz (answers hidden) |
| `POST /api/rag/mcq/:id/submit` | `{ answers: [indices] }` → score + explanations |

> See [`rag/README.md`](rag/README.md) for the full RAG pipeline documentation.

> Public content endpoints are **read-only** — all writes go through the protected `/api/admin/*` routes.

---

## 🗂️ Project structure

```
question_bank/
├── client/                        # Next.js frontend
│   ├── app/                       # App Router pages (/login, /register, /admin/*, …)
│   ├── components/                # UI primitives + shared + layout (navbar, admin nav)
│   ├── features/                  # Feature components (auth, admin, home, community, …)
│   ├── services/                  # http wrapper, API client, react-query hooks
│   ├── store/                     # Zustand stores (auth, user, study, ui)
│   ├── types/                     # Shared TypeScript types
│   ├── data/                      # Seeded JSON source files
│   └── .env.example
└── server/                        # Express API
    ├── index.js                   # Entry point (env → connect DB → listen)
    ├── src/
    │   ├── app.js                 # Express app (CORS, routes, error handling)
    │   ├── config/                # dotenv + Postgres (Sequelize) config
    │   ├── models/                # 19 Sequelize models (incl. User)
    │   ├── controllers/           # base CRUD factory + auth/admin/community/etc.
    │   ├── routes/                # public, auth, admin and rag routers
    │   ├── rag/                   # proxy to the Python RAG service
    │   ├── middleware/            # auth (JWT), adminOnly, notFound, errorHandler
    │   ├── seed/seed.js           # Seeds all collections + admin user from client/data
    │   └── utils/                 # asyncHandler, ApiError, sendSuccess, slugify
    └── .env.example
└── rag/                           # Python RAG microservice (Self Learning Center)
    ├── requirements.txt
    └── app/
        ├── main.py                # FastAPI app + route mounting + DB bootstrap
        ├── config.py · database.py · models.py · schemas.py
        ├── api/                   # documents, chat (SSE), mcq routers + auth deps
        └── services/              # ingestion, embeddings, llm, retriever, rag, mcq
```

---

## 🛠️ Common scripts

| App | Command | What it does |
| --- | --- | --- |
| `server` | `npm run dev` | Run API with nodemon on `:5000` |
| `server` | `npm start` | Run API (production) |
| `server` | `npm run seed` | Sync tables + seed content and admin user (idempotent) |
| `client` | `npm run dev` | Run Next.js dev server on `:3000` |
| `client` | `npm run build` / `npm start` | Production build / start |
| `client` | `npm run lint` | ESLint |
| `client` | `npm run typecheck` | TypeScript type-check |

---

## 📝 Notes

- **Client-server components** (`app/subjects/[slug]`, `app/universities/[slug]`, `app/classes/[slug]`, `app/blog`, `app/blog/[slug]`) use `client/data/*.json` at build time for `generateStaticParams` + metadata only, so `next build` works without the backend. All page *content* is fetched from the API at runtime.
- Seeding is **idempotent** — re-running `npm run seed` upserts existing rows and refreshes the admin password.
- The seeded JSON lives in `client/data/` and is the source of truth for `npm run seed`.

---

## 🔒 Security notes

- Passwords are hashed with bcrypt; the `password` field is excluded from API responses.
- Admin routes verify both a valid JWT **and** the `admin` role.
- Users cannot delete or demote their own account.
- Set a strong `JWT_SECRET` and change the default admin credentials before going live.
