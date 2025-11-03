<!-- .github/copilot-instructions.md - Guidance for AI coding agents working on BIGSHOP e-commerce repo -->

This repository is a full-stack e-commerce app (React + Vite frontend, Node/Express backend, MySQL). The goal of these notes is to give an AI coding agent immediate, actionable context so changes are correct, safe, and idiomatic for this codebase.

Key facts (read before editing):
- Backend: `backend/` — ESM Node app (see `backend/package.json` "type": "module"). Entry: `backend/server.js`.
- Frontend: `frontend/` — React + Vite (dev: `npm run dev`), entry `frontend/src/main.jsx` / `App.jsx`.
- Database: MySQL. Schema and init script in `backend/scripts/initDB.js` and `backend/config/DatabaseSchema.sql`.

How the system fits together (big picture):
- Frontend calls REST API under `/api/*` (prefix routed by `server.js`). The client-side API wrapper lives at `frontend/src/services/api.js` and uses context providers (`frontend/src/context/AuthContext.jsx` and `CartContext.jsx`) for auth tokens and cart state.
- Backend is organized by feature: `routes/*` map URLs -> `controllers/*` which use `models/*` to perform DB operations; auth middleware lives in `middleware/authMiddleware.js` and JWT helpers in `utils/generateToken.js`.
- Production serving: `backend/` serves `public/` static files (see `app.use(express.static(...))` in `server.js`).

Developer workflows and important commands (use these exact commands):
- Setup backend: cd into `backend/` → `npm install` → copy `.env.example` to `.env` and set DB/JWT values.
- Initialize DB (will create demo data): from `backend/` run `npm run init-db` (script: `node scripts/initDB.js`).
- Start backend in dev: `npm run dev` (uses `nodemon`, port default 5000). Production: `npm start`.
- Start frontend dev: `cd frontend && npm install && npm run dev` (Vite, default on 3000). The frontend proxy is configured for `/api` to the backend during development; verify `frontend/vite.config.js` if changing ports.

Conventions & patterns to follow when editing code:
- Use ESM `import` / `export` syntax across backend and frontend — the backend `package.json` sets `type: "module"`.
- Route structure: `routes/<thing>Routes.js` should be thin and delegate to `controllers/<thing>Controller.js` for logic.
- Controllers: keep HTTP parsing & validation here (they use `express-validator`) and call model functions for DB access. Example: `controllers/productController.js`.
- Models: use `backend/config/db.js` (mysql2) for queries. Prefer parameterized queries / prepared statements (project already uses mysql2). Do not inline raw SQL strings without parameters.
- Auth: JWT tokens created by `utils/generateToken.js`. Attach token in frontend via `Authorization: Bearer <token>` — `frontend/src/services/api.js` shows how to include it.

Error handling & logging:
- Backend error middleware is centralized in `server.js`. Throw or pass errors to `next(error)` in controllers. In development, `error.message` is returned; in production the body is minimal.

Integration points & external dependencies:
- MySQL (v8+): credentials from `.env` (`DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`). Initialization script inserts demo admin/user accounts (admin@bigshop.com / password123).
- NPM packages of note: `express`, `mysql2`, `jsonwebtoken`, `bcryptjs`, `express-validator`. Frontend uses `axios`, `react-router-dom`, and Vite.

Small examples the agent can follow:
- Add a protected route: update `routes/` (e.g., `orderRoutes.js`) → use `middleware/authMiddleware.js` → controller `orderController.js` to read `req.user` (populated by middleware) and interact with `models/Order.js`.
- Call backend from frontend: use `frontend/src/services/api.js` and `AuthContext` to add `Authorization` header. Example: `api.get('/products')` maps to backend `GET /api/products`.

Safety notes & do-not-change shortcuts:
- Do not change `.env.example` values except to add new variables; do not commit actual secrets. When adding features that require new env vars, add them to `.env.example` and document in `README.md`.
- Avoid large DB migrations without asking — this project uses simple SQL init scripts; coordinate with the maintainer for schema changes.

If you modify server ports or API roots, update `frontend/vite.config.js` proxy and `README.md` dev instructions.

Files to inspect first for any server/feature change:
- `backend/server.js`, `backend/routes/*.js`, `backend/controllers/*.js`, `backend/models/*.js`, `backend/config/db.js`, `backend/scripts/initDB.js`, `backend/config/DatabaseSchema.sql`.
- Frontend: `frontend/src/services/api.js`, `frontend/src/context/AuthContext.jsx`, `frontend/src/pages/*` for UI patterns.

When you finish a change:
- Run `npm run dev` in backend and `npm run dev` in frontend locally and verify the API health endpoint (`/api/health`) and a quick frontend page (Home/Shop) load.
- Run the DB init locally only if you understand it will create sample data and users.

If anything in these notes is unclear or you want more specific examples (controller template, sample model query, or frontend API usage), ask and I will expand with in-repo snippets.
