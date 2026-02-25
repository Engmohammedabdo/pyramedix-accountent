# PyramediaX Accountant 💰

**Financial Management Dashboard for PyramediaX**

A comprehensive, bilingual (Arabic RTL / English LTR) financial dashboard for managing clients, contracts, invoices, expenses, subscriptions, and more.

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Frontend | Next.js 14 (App Router) + Tailwind CSS + Shadcn UI |
| Database | Supabase (PostgreSQL) |
| Automation | n8n + Gemini 3.1 Pro (OCR) |
| Bot | Telegram Bot API |
| Hosting | Coolify |

## Features

- 📊 **Dashboard** — Revenue MTD/YTD, expenses, outstanding debts, overdue payments
- 👥 **Clients** — Linked to existing client database with financial summaries
- 📄 **Contracts** — Retainer, Milestone, Upfront+Delivery billing
- 💳 **Transactions** — Income & expenses with dynamic categories
- 🔄 **Subscriptions** — Track software tools with renewal alerts
- 💳 **Cards** — Bank card management linked to subscriptions
- 📤 **Invoice Upload** — OCR via Gemini 3.1 Pro (auto-extract data)
- 🤖 **Telegram Bot** — Upload receipts via chat
- 🔔 **Notifications** — Payment due dates & subscription renewal alerts
- 🌐 **Bilingual** — Full Arabic (RTL) ↔ English (LTR) support

## Database

Uses existing `pyraworkspacedb.pyramedia.cloud` Supabase instance.

**Existing tables used (read/write):**
- `pyra_clients`, `pyra_projects`, `pyra_invoices`, `pyra_invoice_items`, `pyra_payments`, `pyra_quotes`

**New tables added:**
- `pyra_expense_categories` — Dynamic expense categories
- `pyra_expenses` — Company expenses
- `pyra_cards` — Bank cards
- `pyra_subscriptions` — Software subscriptions
- `pyra_contracts` — Client contracts

**New views:**
- `v_financial_overview` — MTD/YTD financial summary
- `v_monthly_revenue` — Monthly revenue breakdown
- `v_expense_breakdown` — Expense breakdown by category
- `v_upcoming_subscriptions` — Renewals in next 7 days
- `v_overdue_payments` — Past-due invoices
- `v_client_financial_summary` — Per-client financial summary

Schema: [`database/financial-schema.sql`](database/financial-schema.sql)

## Project Docs

- [PRD.md](PRD.md) — Product Requirements Document
- [EXECUTION-PLAN.md](EXECUTION-PLAN.md) — Phase-by-phase execution plan

## Progress

- [x] Phase 1: Database Schema ✅
- [x] Phase 2: Next.js Project Setup ✅
- [ ] Phase 3: Dashboard Layout + Home
- [ ] Phase 4: CRUD Pages
- [ ] Phase 5: Invoice Upload + OCR
- [ ] Phase 6: Telegram Bot + Notifications
- [ ] Phase 7: Bilingual Polish + Deploy

## Development

```bash
pnpm install
pnpm dev
```

## Deploy

Deployed on Coolify (`72.61.148.81`) — manual deploy by Mohammed.

---

*Built by PyraAI 🦊 for PyramediaX*
