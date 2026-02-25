# PyramediaX Accountant — Execution Plan 🎼

**نظام الأوركسترا — كل phase بموافقة محمد**

---

## Phase 1: 🗄️ Database Schema Extension
**Status:** ✅ COMPLETED (25 Feb 2026)
**Agent:** Database Architect (Gemini 3.1 Pro)

### المهام:
- [x] كتابة SQL للجداول الجديدة:
  - [x] `pyra_expense_categories` — تصنيفات ديناميكية (5 default categories)
  - [x] `pyra_expenses` — المصاريف
  - [x] `pyra_cards` — بطاقات البنك
  - [x] `pyra_subscriptions` — الاشتراكات
  - [x] `pyra_contracts` — العقود (with GENERATED remaining_amount)
- [x] بناء Views جديدة للداشبورد المالي:
  - [x] `v_financial_overview` — ملخص مالي شامل (MTD/YTD)
  - [x] `v_monthly_revenue` — الإيرادات الشهرية
  - [x] `v_expense_breakdown` — تفصيل المصاريف
  - [x] `v_upcoming_subscriptions` — اشتراكات قادمة (7 days)
  - [x] `v_overdue_payments` — مدفوعات متأخرة
  - [x] `v_client_financial_summary` — ملخص مالي لكل عميل
- [x] بناء RPC functions: `get_revenue_by_period`, `get_expense_by_period`
- [x] ⚠️ **ما مسينا أي جدول موجود** ✅
- [x] 17 indexes, RLS policies, auto-updated_at triggers
- [x] **Output:** `database/financial-schema.sql`
- [x] **✅ Executed on Supabase — all verified**

---

## Phase 2: 🏗️ Next.js Project Setup
**Status:** ✅ COMPLETED (25 Feb 2026)
**Agent:** Frontend Architect (Gemini 3.1 Pro)

### المهام:
- [ ] Initialize Next.js 14 (App Router)
- [ ] Install: Tailwind CSS, Shadcn UI, Lucide Icons
- [ ] Project structure:
  ```
  /app
    /[locale]
      /layout.tsx
      /page.tsx (dashboard home)
      /clients/page.tsx
      /contracts/page.tsx
      /transactions/page.tsx
      /subscriptions/page.tsx
      /cards/page.tsx
      /upload/page.tsx
  /components
    /ui (shadcn)
    /dashboard
    /layout
  /lib
    /supabase.ts
    /i18n.ts
    /utils.ts
  /types
    /database.ts
  /messages
    /ar.json
    /en.json
  ```
- [ ] Supabase client (`pyraworkspacedb.pyramedia.cloud`)
- [ ] i18n setup (next-intl): Arabic RTL / English LTR
- [ ] Simple Auth (Mohammed only)
- [ ] **Output:** Project skeleton pushed to repo
- [ ] **✅ Mohammed approval**

---

## Phase 3: 🎨 Main Dashboard Layout + Home
**Status:** ✅ COMPLETED (25 Feb 2026)
**Agent:** UI Developer (Gemini 3.1 Pro)

### المهام:
- [ ] Sidebar navigation (collapsible, AR/EN)
- [ ] Top bar (language toggle, user menu)
- [ ] Home dashboard widgets:
  - [ ] Total Revenue card (MTD / YTD)
  - [ ] Upcoming Subscriptions (next 7 days)
  - [ ] Overdue Payments alert
  - [ ] Outstanding Debts total
  - [ ] Expense breakdown by category (pie/bar chart)
  - [ ] Recent transactions list
- [ ] Charts (recharts)
- [ ] Dark/Light mode
- [ ] Responsive (mobile-friendly)
- [ ] **Output:** Working dashboard home
- [ ] **✅ Mohammed approval**

---

## Phase 4: 📊 CRUD Pages
**Status:** ⬜ PENDING
**Agents:** 2-3 parallel sub-agents (Gemini 3.1 Pro)

### المهام:
- [ ] **Clients page** — list, view, financial summary (linked to pyra_clients)
- [ ] **Contracts page** — CRUD, billing type selection (Retainer/Milestone/Upfront+Delivery)
- [ ] **Transactions page:**
  - [ ] Income tab (from pyra_payments)
  - [ ] Expenses tab (from pyra_expenses)
  - [ ] Add/Edit/Delete
  - [ ] Filter by date, category, client
- [ ] **Subscriptions page** — list, add, edit, link to card, renewal alerts
- [ ] **Cards page** — manage bank cards
- [ ] **Output:** All CRUD pages functional
- [ ] **✅ Mohammed approval**

---

## Phase 5: 📤 Invoice Upload + OCR Pipeline
**Status:** ⬜ PENDING
**Agent:** Integration Developer (Gemini 3.1 Pro)

### المهام:
- [ ] Upload component (drag & drop → Supabase Storage)
- [ ] n8n webhook endpoint
- [ ] n8n workflow:
  - [ ] Receive file from dashboard upload
  - [ ] Send to Gemini 3.1 Pro Vision for OCR
  - [ ] Extract: Date, Amount, Vendor/Client, Category
  - [ ] Push extracted data to Supabase
  - [ ] Return result to dashboard (webhook callback)
- [ ] Dashboard: show OCR results, allow edit before save
- [ ] **Output:** Working upload → OCR → auto-fill pipeline
- [ ] **✅ Mohammed approval**

---

## Phase 6: 🤖 Telegram Bot + Notifications
**Status:** ⬜ PENDING
**Agent:** Bot Developer (Gemini 3.1 Pro)

### المهام:
- [ ] Create new Telegram Bot via @BotFather
- [ ] Bot functionality:
  - [ ] Receive invoice/receipt photos
  - [ ] Trigger same n8n OCR pipeline
  - [ ] Return extracted data for confirmation
  - [ ] Save to database on confirm
- [ ] n8n notification workflows:
  - [ ] Daily check: client payment due dates → Telegram alert
  - [ ] 48h check: subscription renewals → Telegram alert
- [ ] Database views/queries for notification triggers
- [ ] **Output:** Working bot + notification system
- [ ] **✅ Mohammed approval**

---

## Phase 7: 🌐 Bilingual Polish + Deploy
**Status:** ⬜ PENDING
**Agent:** Polish & QA (Gemini 3.1 Pro)

### المهام:
- [ ] Complete AR/EN translations (all labels, messages, errors)
- [ ] RTL/LTR testing on all pages
- [ ] Responsive testing (mobile/tablet/desktop)
- [ ] Error handling & loading states
- [ ] Final code cleanup
- [ ] Push to `pyramedix-accountent` repo
- [ ] Deploy instructions for Coolify
- [ ] **Output:** Production-ready app
- [ ] **✅ Mohammed final approval**

---

## ⏱️ Timeline Estimate

| Phase | Duration | Dependencies |
|-------|----------|-------------|
| Phase 1 (DB) | ~30 min | None |
| Phase 2 (Setup) | ~30 min | Phase 1 approved |
| Phase 3 (Dashboard) | ~1 hour | Phase 2 |
| Phase 4 (CRUD) | ~2 hours | Phase 3 |
| Phase 5 (Upload+OCR) | ~1 hour | Phase 4 |
| Phase 6 (Bot) | ~1 hour | Phase 5 |
| Phase 7 (Polish) | ~30 min | Phase 6 |
| **Total** | **~6-7 hours** | — |

---

## 🔑 Rules
1. **كل الكودنج بـ Gemini 3.1 Pro**
2. **ما نمس أي جدول موجود من pyra-workspace3**
3. **كل phase → موافقة محمد قبل التنفيذ**
4. **Sub-agents بمهمتين max لكل واحد**
5. **كل ملف يُكتب فور ما يخلص — مش يتجمع بالآخر**

---

*Last updated: 25 Feb 2026 — Phase 1 starting*
