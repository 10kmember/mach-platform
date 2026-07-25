# MACH Platform

The MACH agent-hosting platform — approval-gated agent hosting as a business.

- **api/** — FastAPI + SQLAlchemy + PostgreSQL backend (auth, agents,
  approval flow, payments ledger, Mach Listener Telegram notifications)
- **frontend/** — React 18 + TypeScript + Vite + Tailwind console
  (marketing site + client dashboard + operator console)

Live: https://mach-platform.vercel.app

Secrets live in environment / server env files only — never in this repo.
