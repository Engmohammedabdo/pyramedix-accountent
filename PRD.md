# PyramediaX Accountant — Product Requirements Document (PRD)

**المشروع:** Financial Management Dashboard
**الشركة:** PyramediaX
**التاريخ:** 25 فبراير 2026
**المطوّر:** بايرا 🦊 (PyraAI) — Gemini 3.1 Pro
**الريبو:** https://github.com/Engmohammedabdo/pyramedix-accountent
**Deploy:** Coolify (manual by Mohammed)

---

## 1. الهدف

بناء لوحة إدارة مالية شاملة ثنائية اللغة (عربي RTL / إنجليزي LTR) لشركة Pyramedia — تسويق وحلول ذكاء اصطناعي في دبي.

---

## 2. Tech Stack

| Component | Technology |
|-----------|-----------|
| **Frontend** | Next.js 14 (App Router) + Tailwind CSS + Shadcn UI |
| **Backend & DB** | Supabase (`pyraworkspacedb.pyramedia.cloud`) |
| **AI Coding** | Gemini 3.1 Pro (all code generation) |
| **Automation** | n8n (`n8n.pyramedia.info`) |
| **OCR** | Gemini 3.1 Pro Vision |
| **Bot** | Telegram Bot API (new bot) |
| **Hosting** | Coolify (`72.61.148.81`) |

---

## 3. المستخدمون

- **Mohammed فقط** — لا حاجة لـ roles/permissions معقدة
- Auth بسيط عبر Supabase Auth

---

## 4. Database Strategy

### 4.1 الجداول الموجودة (نستخدمها — لا نعدلها)

| الجدول | الوصف | البيانات |
|--------|-------|----------|
| `pyra_clients` | العملاء | 3 عملاء (Injazat...) |
| `pyra_projects` | المشاريع | 5 مشاريع |
| `pyra_invoices` | الفواتير | فاضي — جاهز للاستخدام |
| `pyra_invoice_items` | بنود الفواتير | فاضي |
| `pyra_payments` | المدفوعات | فاضي |
| `pyra_quotes` | عروض الأسعار | 1 quote |
| `pyra_quote_items` | بنود العروض | 1 item |

### 4.2 Views موجودة نستخدمها

- `v_client_overview` — ملخص العملاء
- `v_project_summary` — ملخص المشاريع
- `v_dashboard_stats` — إحصائيات عامة
- `v_project_activity` — نشاط المشاريع

### 4.3 جداول جديدة (لازم نبنيها)

| الجدول | الوصف |
|--------|-------|
| `pyra_expenses` | المصاريف (Rent, Salaries, Ads, etc.) |
| `pyra_expense_categories` | تصنيفات ديناميكية للمصاريف |
| `pyra_subscriptions` | اشتراكات البرامج (Claude, ChatGPT, Servers...) |
| `pyra_cards` | بطاقات البنك المربوطة بالاشتراكات |
| `pyra_contracts` | عقود مع billing structures مختلفة |

### 4.4 قواعد مهمة
- ⚠️ **لا نعدل أي جدول موجود من pyra-workspace3**
- ✅ نضيف جداول جديدة فقط
- ✅ نضيف views جديدة للداشبورد المالي
- ✅ نضيف RPC functions للتقارير
- 💱 العملة: multi-currency (default AED)
- 🧾 VAT: field بنسبة (default 0%) — future-proof

---

## 5. Core Features

### 5.1 Dashboard Home
- Total Revenue (MTD / YTD)
- Upcoming Subscriptions (next 7 days)
- Overdue Client Payments
- Total Outstanding Debts
- Expense breakdown by category
- Charts & graphs

### 5.2 Clients Management
- Linked to `pyra_clients` (existing)
- Total billed, total paid, outstanding balance (from invoices/payments)

### 5.3 Contracts/Projects
- Flexible billing: Retainer, Milestone-based, Upfront + Delivery %
- Track due dates and remaining amounts
- Linked to `pyra_projects` (existing)

### 5.4 Transactions (Income & Expenses)
- **Income:** Payments against contracts/clients (from `pyra_payments`)
- **Expenses:** Dynamic categories (Rent, Salaries, Software, Ads, Misc + custom)
- VAT field (currently 0%, future-proof)

### 5.5 Subscriptions
- Tool Name, Cost, Renewal Date, Payment Card
- Examples: Claude Code, ChatGPT, servers, etc.
- Alert 48h before renewal

### 5.6 Cards Management
- Track bank cards linked to subscriptions
- Card name, last 4 digits, bank, expiry

### 5.7 Invoice Upload + OCR
- Drag & drop upload widget
- Triggers n8n webhook
- Gemini 3.1 Pro Vision extracts: Date, Amount, Vendor/Client, Category
- Auto-fills database

### 5.8 Telegram Bot
- New bot — receive invoice/receipt photos
- Same OCR pipeline as dashboard upload
- Send to n8n → Gemini → Supabase

### 5.9 Notifications (via n8n)
- Daily checks:
  - Client payment due dates
  - Subscription renewals (48h before)
- Alert via Telegram / WhatsApp

### 5.10 Bilingual UI
- Full Arabic (RTL) ↔ English (LTR) toggle
- All labels, navigation, messages translated

---

## 6. Existing Database Schema Reference

### pyra_clients
```
id (varchar PK), name, email, password_hash, company, phone,
avatar_url, role, status, language, last_login_at, created_by,
created_at, updated_at, auth_user_id, is_active
```

### pyra_projects
```
id (varchar PK), name, description, client_company, status,
start_date, deadline, storage_path, cover_image, created_by,
created_at, updated_at, client_id (FK→pyra_clients), team_id
```

### pyra_invoices
```
id (varchar PK), invoice_number, quote_id, client_id, project_name,
status (default 'draft'), issue_date, due_date, currency (default 'AED'),
subtotal, tax_rate (default 5), tax_amount, total, amount_paid,
amount_due, notes, terms_conditions (jsonb), bank_details (jsonb),
company_name, company_logo, client_name, client_email, client_company,
client_phone, client_address, milestone_type, parent_invoice_id,
created_by, created_at, updated_at
```

### pyra_invoice_items
```
id (varchar PK), invoice_id (FK→pyra_invoices), sort_order,
description, quantity, rate, amount, created_at
```

### pyra_payments
```
id (varchar PK), invoice_id (FK→pyra_invoices), amount,
payment_date, method (default 'bank_transfer'), reference,
notes, recorded_by, created_at
```

### pyra_quotes
```
id (varchar PK), quote_number, client_id, project_name, status,
estimate_date, expiry_date, currency, subtotal, tax_rate, tax_amount,
total, notes, terms_conditions, bank_details, company_name, company_logo,
client_name, client_email, client_company, client_phone, client_address,
signature_data, signed_by, signed_at, signed_ip, sent_at, viewed_at,
created_by, created_at, updated_at
```

---

## 7. Source Repos

- **This project:** https://github.com/Engmohammedabdo/pyramedix-accountent
- **Existing workspace (DB source):** https://github.com/Engmohammedabdo/pyra-workspace3

---

*Last updated: 25 Feb 2026*
