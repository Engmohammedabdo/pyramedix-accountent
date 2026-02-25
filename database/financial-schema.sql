-- ============================================================================
-- Pyramedia Financial Schema — New Tables, Views, Functions & RLS
-- Database: pyraworkspacedb.pyramedia.cloud (Supabase)
-- Author: PyraAI 🦊 — Database Architect
-- Date: 2026-02-25
--
-- IMPORTANT: This script only CREATES new objects.
--            It does NOT alter any existing tables.
-- ============================================================================

-- ============================================================================
-- 1. TABLES
-- ============================================================================

-- --------------------------------------------------------------------------
-- 1a. pyra_cards — Bank cards for tracking subscriptions & expenses
--     (Created first because pyra_expenses and pyra_subscriptions reference it)
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS pyra_cards (
    id              varchar PRIMARY KEY,
    card_name       varchar NOT NULL,
    bank_name       varchar,
    last_four_digits varchar(4),
    card_type       varchar NOT NULL DEFAULT 'credit'
                        CHECK (card_type IN ('credit', 'debit')),
    expiry_month    smallint CHECK (expiry_month BETWEEN 1 AND 12),
    expiry_year     smallint CHECK (expiry_year >= 2020),
    is_active       boolean NOT NULL DEFAULT true,
    notes           text,
    created_at      timestamptz NOT NULL DEFAULT now(),
    updated_at      timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE pyra_cards IS 'Bank/credit cards used for subscriptions and expense tracking';

-- --------------------------------------------------------------------------
-- 1b. pyra_expense_categories — Dynamic expense categories
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS pyra_expense_categories (
    id              varchar PRIMARY KEY,
    name            varchar NOT NULL UNIQUE,
    name_ar         varchar,
    icon            varchar,
    color           varchar,
    is_active       boolean NOT NULL DEFAULT true,
    sort_order      integer NOT NULL DEFAULT 0,
    created_at      timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE pyra_expense_categories IS 'Dynamic expense categories (Rent, Salaries, Software, etc.)';

-- --------------------------------------------------------------------------
-- 1c. pyra_expenses — All company expenses
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS pyra_expenses (
    id              varchar PRIMARY KEY,
    category_id     varchar NOT NULL
                        REFERENCES pyra_expense_categories(id) ON DELETE RESTRICT,
    amount          numeric(12, 2) NOT NULL CHECK (amount >= 0),
    currency        varchar NOT NULL DEFAULT 'AED',
    description     text,
    description_ar  text,
    vendor          varchar,
    expense_date    date NOT NULL DEFAULT CURRENT_DATE,
    receipt_url     text,                       -- Supabase Storage path
    payment_method  varchar DEFAULT 'bank_transfer',
    card_id         varchar
                        REFERENCES pyra_cards(id) ON DELETE SET NULL,
    vat_rate        numeric(5, 2) NOT NULL DEFAULT 0,
    vat_amount      numeric(12, 2) NOT NULL DEFAULT 0,
    is_recurring    boolean NOT NULL DEFAULT false,
    notes           text,
    created_by      varchar,
    created_at      timestamptz NOT NULL DEFAULT now(),
    updated_at      timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE pyra_expenses IS 'All company expenses, linked to category and optionally to a card';

-- --------------------------------------------------------------------------
-- 1d. pyra_subscriptions — Recurring software subscriptions
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS pyra_subscriptions (
    id              varchar PRIMARY KEY,
    tool_name       varchar NOT NULL,
    description     text,
    cost            numeric(12, 2) NOT NULL CHECK (cost >= 0),
    currency        varchar NOT NULL DEFAULT 'AED',
    billing_cycle   varchar NOT NULL DEFAULT 'monthly'
                        CHECK (billing_cycle IN ('monthly', 'yearly', 'quarterly')),
    renewal_date    date,
    card_id         varchar
                        REFERENCES pyra_cards(id) ON DELETE SET NULL,
    category_id     varchar
                        REFERENCES pyra_expense_categories(id) ON DELETE SET NULL,
    is_active       boolean NOT NULL DEFAULT true,
    auto_renew      boolean NOT NULL DEFAULT true,
    website_url     text,
    notes           text,
    created_at      timestamptz NOT NULL DEFAULT now(),
    updated_at      timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE pyra_subscriptions IS 'Recurring software/service subscriptions with renewal tracking';

-- --------------------------------------------------------------------------
-- 1e. pyra_contracts — Client contracts with flexible billing
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS pyra_contracts (
    id              varchar PRIMARY KEY,
    client_id       varchar NOT NULL
                        REFERENCES pyra_clients(id) ON DELETE RESTRICT,
    project_id      varchar
                        REFERENCES pyra_projects(id) ON DELETE SET NULL,
    contract_name   varchar NOT NULL,
    contract_type   varchar NOT NULL DEFAULT 'upfront_delivery'
                        CHECK (contract_type IN ('retainer', 'milestone', 'upfront_delivery')),
    total_value     numeric(12, 2) NOT NULL CHECK (total_value >= 0),
    currency        varchar NOT NULL DEFAULT 'AED',
    paid_amount     numeric(12, 2) NOT NULL DEFAULT 0,
    remaining_amount numeric(12, 2) GENERATED ALWAYS AS (total_value - paid_amount) STORED,
    vat_rate        numeric(5, 2) NOT NULL DEFAULT 0,
    start_date      date,
    end_date        date,
    billing_details jsonb DEFAULT '{}'::jsonb,   -- milestones / percentages / schedule
    status          varchar NOT NULL DEFAULT 'draft'
                        CHECK (status IN ('draft', 'active', 'completed', 'cancelled')),
    notes           text,
    created_at      timestamptz NOT NULL DEFAULT now(),
    updated_at      timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE pyra_contracts IS 'Client contracts — retainer, milestone, or upfront delivery billing';


-- ============================================================================
-- 2. INDEXES
-- ============================================================================

-- pyra_expenses
CREATE INDEX IF NOT EXISTS idx_expenses_category      ON pyra_expenses(category_id);
CREATE INDEX IF NOT EXISTS idx_expenses_card           ON pyra_expenses(card_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date           ON pyra_expenses(expense_date DESC);
CREATE INDEX IF NOT EXISTS idx_expenses_vendor         ON pyra_expenses(vendor);
CREATE INDEX IF NOT EXISTS idx_expenses_recurring      ON pyra_expenses(is_recurring) WHERE is_recurring = true;

-- pyra_subscriptions
CREATE INDEX IF NOT EXISTS idx_subscriptions_card      ON pyra_subscriptions(card_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_category  ON pyra_subscriptions(category_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_renewal   ON pyra_subscriptions(renewal_date);
CREATE INDEX IF NOT EXISTS idx_subscriptions_active    ON pyra_subscriptions(is_active) WHERE is_active = true;

-- pyra_contracts
CREATE INDEX IF NOT EXISTS idx_contracts_client        ON pyra_contracts(client_id);
CREATE INDEX IF NOT EXISTS idx_contracts_project       ON pyra_contracts(project_id);
CREATE INDEX IF NOT EXISTS idx_contracts_status        ON pyra_contracts(status);
CREATE INDEX IF NOT EXISTS idx_contracts_dates         ON pyra_contracts(start_date, end_date);

-- pyra_cards
CREATE INDEX IF NOT EXISTS idx_cards_active            ON pyra_cards(is_active) WHERE is_active = true;

-- pyra_expense_categories
CREATE INDEX IF NOT EXISTS idx_expense_cat_active      ON pyra_expense_categories(is_active, sort_order);


-- ============================================================================
-- 3. SEED DATA — Default expense categories
-- ============================================================================

INSERT INTO pyra_expense_categories (id, name, name_ar, icon, color, is_active, sort_order)
VALUES
    ('cat_rent',        'Rent',             'إيجار',           '🏢', '#6366f1', true, 1),
    ('cat_salaries',    'Salaries',         'رواتب',           '💰', '#10b981', true, 2),
    ('cat_software',    'Software Tools',   'أدوات برمجية',     '💻', '#3b82f6', true, 3),
    ('cat_ads',         'Ads Spend',        'إنفاق إعلاني',    '📣', '#f59e0b', true, 4),
    ('cat_misc',        'Miscellaneous',    'متنوع',           '📦', '#8b5cf6', true, 5)
ON CONFLICT (id) DO NOTHING;


-- ============================================================================
-- 4. VIEWS
-- ============================================================================

-- --------------------------------------------------------------------------
-- 4a. v_financial_overview — High-level MTD / YTD summary
-- --------------------------------------------------------------------------
DROP VIEW IF EXISTS v_financial_overview CASCADE;

CREATE OR REPLACE VIEW v_financial_overview AS
WITH
    date_bounds AS (
        SELECT
            date_trunc('month', CURRENT_DATE)::date  AS month_start,
            date_trunc('year',  CURRENT_DATE)::date  AS year_start,
            CURRENT_DATE                              AS today
    ),
    revenue_mtd AS (
        SELECT COALESCE(SUM(amount_paid), 0) AS val
        FROM pyra_invoices, date_bounds
        WHERE issue_date >= date_bounds.month_start
    ),
    revenue_ytd AS (
        SELECT COALESCE(SUM(amount_paid), 0) AS val
        FROM pyra_invoices, date_bounds
        WHERE issue_date >= date_bounds.year_start
    ),
    expenses_mtd AS (
        SELECT COALESCE(SUM(amount + vat_amount), 0) AS val
        FROM pyra_expenses, date_bounds
        WHERE expense_date >= date_bounds.month_start
    ),
    expenses_ytd AS (
        SELECT COALESCE(SUM(amount + vat_amount), 0) AS val
        FROM pyra_expenses, date_bounds
        WHERE expense_date >= date_bounds.year_start
    ),
    outstanding AS (
        SELECT COALESCE(SUM(amount_due), 0) AS val
        FROM pyra_invoices
        WHERE amount_due > 0
    ),
    overdue AS (
        SELECT COALESCE(SUM(amount_due), 0) AS val
        FROM pyra_invoices
        WHERE amount_due > 0
          AND due_date < CURRENT_DATE
    )
SELECT
    revenue_mtd.val   AS total_revenue_mtd,
    revenue_ytd.val   AS total_revenue_ytd,
    expenses_mtd.val  AS total_expenses_mtd,
    expenses_ytd.val  AS total_expenses_ytd,
    (revenue_mtd.val - expenses_mtd.val) AS net_profit_mtd,
    (revenue_ytd.val - expenses_ytd.val) AS net_profit_ytd,
    outstanding.val   AS total_outstanding,
    overdue.val       AS total_overdue
FROM revenue_mtd, revenue_ytd, expenses_mtd, expenses_ytd, outstanding, overdue;

COMMENT ON VIEW v_financial_overview IS 'High-level financial dashboard: MTD/YTD revenue, expenses, profit, outstanding & overdue';

-- --------------------------------------------------------------------------
-- 4b. v_monthly_revenue — Monthly revenue breakdown
-- --------------------------------------------------------------------------
DROP VIEW IF EXISTS v_monthly_revenue CASCADE;

CREATE OR REPLACE VIEW v_monthly_revenue AS
SELECT
    EXTRACT(MONTH FROM issue_date)::int AS month,
    EXTRACT(YEAR  FROM issue_date)::int AS year,
    COALESCE(SUM(total), 0)             AS total_invoiced,
    COALESCE(SUM(amount_paid), 0)       AS total_paid,
    COALESCE(SUM(amount_due), 0)        AS total_outstanding
FROM pyra_invoices
WHERE issue_date IS NOT NULL
GROUP BY year, month
ORDER BY year DESC, month DESC;

COMMENT ON VIEW v_monthly_revenue IS 'Monthly breakdown of invoiced, paid, and outstanding amounts';

-- --------------------------------------------------------------------------
-- 4c. v_expense_breakdown — Current-month expenses by category
-- --------------------------------------------------------------------------
DROP VIEW IF EXISTS v_expense_breakdown CASCADE;

CREATE OR REPLACE VIEW v_expense_breakdown AS
WITH current_month AS (
    SELECT
        ec.name            AS category_name,
        ec.name_ar         AS category_name_ar,
        COALESCE(SUM(e.amount + e.vat_amount), 0) AS total_amount,
        COUNT(e.id)        AS transaction_count
    FROM pyra_expense_categories ec
    LEFT JOIN pyra_expenses e
        ON e.category_id = ec.id
        AND e.expense_date >= date_trunc('month', CURRENT_DATE)::date
    WHERE ec.is_active = true
    GROUP BY ec.name, ec.name_ar
),
grand_total AS (
    SELECT NULLIF(SUM(total_amount), 0) AS gt FROM current_month
)
SELECT
    cm.category_name,
    cm.category_name_ar,
    cm.total_amount,
    ROUND(cm.total_amount / COALESCE(grand_total.gt, 1) * 100, 2) AS percentage,
    cm.transaction_count
FROM current_month cm, grand_total
ORDER BY cm.total_amount DESC;

COMMENT ON VIEW v_expense_breakdown IS 'Current-month expense breakdown by category with percentages';

-- --------------------------------------------------------------------------
-- 4d. v_upcoming_subscriptions — Renewals within the next 7 days
-- --------------------------------------------------------------------------
DROP VIEW IF EXISTS v_upcoming_subscriptions CASCADE;

CREATE OR REPLACE VIEW v_upcoming_subscriptions AS
SELECT
    s.tool_name,
    s.cost,
    s.currency,
    s.renewal_date,
    (s.renewal_date - CURRENT_DATE) AS days_until_renewal,
    c.card_name
FROM pyra_subscriptions s
LEFT JOIN pyra_cards c ON s.card_id = c.id
WHERE s.is_active = true
  AND s.renewal_date IS NOT NULL
  AND s.renewal_date BETWEEN CURRENT_DATE AND (CURRENT_DATE + 7)
ORDER BY s.renewal_date ASC;

COMMENT ON VIEW v_upcoming_subscriptions IS 'Active subscriptions renewing in the next 7 days';

-- --------------------------------------------------------------------------
-- 4e. v_overdue_payments — Invoices past due with outstanding balance
-- --------------------------------------------------------------------------
DROP VIEW IF EXISTS v_overdue_payments CASCADE;

CREATE OR REPLACE VIEW v_overdue_payments AS
SELECT
    i.invoice_number,
    cl.name      AS client_name,
    cl.company   AS client_company,
    i.due_date,
    (CURRENT_DATE - i.due_date) AS days_overdue,
    i.amount_due
FROM pyra_invoices i
LEFT JOIN pyra_clients cl ON i.client_id = cl.id
WHERE i.amount_due > 0
  AND i.due_date < CURRENT_DATE
ORDER BY days_overdue DESC;

COMMENT ON VIEW v_overdue_payments IS 'Invoices past their due date with outstanding balance';

-- --------------------------------------------------------------------------
-- 4f. v_client_financial_summary — Per-client financial summary
-- --------------------------------------------------------------------------
DROP VIEW IF EXISTS v_client_financial_summary CASCADE;

CREATE OR REPLACE VIEW v_client_financial_summary AS
SELECT
    cl.id           AS client_id,
    cl.name         AS client_name,
    cl.company,
    COALESCE(con.total_contracts, 0)    AS total_contracts,
    COALESCE(inv.total_billed, 0)       AS total_billed,
    COALESCE(inv.total_paid, 0)         AS total_paid,
    COALESCE(inv.outstanding_balance, 0) AS outstanding_balance
FROM pyra_clients cl
LEFT JOIN (
    SELECT
        client_id,
        COUNT(*)           AS total_contracts
    FROM pyra_contracts
    WHERE status != 'cancelled'
    GROUP BY client_id
) con ON con.client_id = cl.id
LEFT JOIN (
    SELECT
        client_id,
        COALESCE(SUM(total), 0)       AS total_billed,
        COALESCE(SUM(amount_paid), 0) AS total_paid,
        COALESCE(SUM(amount_due), 0)  AS outstanding_balance
    FROM pyra_invoices
    GROUP BY client_id
) inv ON inv.client_id = cl.id
ORDER BY outstanding_balance DESC;

COMMENT ON VIEW v_client_financial_summary IS 'Per-client summary: contracts, billed, paid, outstanding';


-- ============================================================================
-- 5. RPC FUNCTIONS
-- ============================================================================

-- --------------------------------------------------------------------------
-- 5a. get_revenue_by_period — Total revenue for a date range
-- --------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION get_revenue_by_period(
    p_start_date date,
    p_end_date   date
)
RETURNS TABLE (
    total_invoiced  numeric,
    total_paid      numeric,
    total_outstanding numeric,
    invoice_count   bigint
)
LANGUAGE sql STABLE
AS $$
    SELECT
        COALESCE(SUM(total), 0)       AS total_invoiced,
        COALESCE(SUM(amount_paid), 0) AS total_paid,
        COALESCE(SUM(amount_due), 0)  AS total_outstanding,
        COUNT(*)                      AS invoice_count
    FROM pyra_invoices
    WHERE issue_date >= p_start_date
      AND issue_date <= p_end_date;
$$;

COMMENT ON FUNCTION get_revenue_by_period IS 'Returns total revenue metrics for a given date range';

-- --------------------------------------------------------------------------
-- 5b. get_expense_by_period — Expenses grouped by category for a date range
-- --------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION get_expense_by_period(
    p_start_date date,
    p_end_date   date
)
RETURNS TABLE (
    category_id     varchar,
    category_name   varchar,
    category_name_ar varchar,
    total_amount    numeric,
    transaction_count bigint
)
LANGUAGE sql STABLE
AS $$
    SELECT
        ec.id                              AS category_id,
        ec.name                            AS category_name,
        ec.name_ar                         AS category_name_ar,
        COALESCE(SUM(e.amount + e.vat_amount), 0) AS total_amount,
        COUNT(e.id)                        AS transaction_count
    FROM pyra_expense_categories ec
    LEFT JOIN pyra_expenses e
        ON e.category_id = ec.id
        AND e.expense_date >= p_start_date
        AND e.expense_date <= p_end_date
    WHERE ec.is_active = true
    GROUP BY ec.id, ec.name, ec.name_ar
    ORDER BY total_amount DESC;
$$;

COMMENT ON FUNCTION get_expense_by_period IS 'Returns expenses grouped by category for a given date range';


-- ============================================================================
-- 6. ROW LEVEL SECURITY
-- ============================================================================

-- Enable RLS on all new tables
ALTER TABLE pyra_cards              ENABLE ROW LEVEL SECURITY;
ALTER TABLE pyra_expense_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE pyra_expenses           ENABLE ROW LEVEL SECURITY;
ALTER TABLE pyra_subscriptions      ENABLE ROW LEVEL SECURITY;
ALTER TABLE pyra_contracts          ENABLE ROW LEVEL SECURITY;

-- Basic policies: allow all operations for authenticated users
-- (Single-user system — only Mohammed uses it)

-- pyra_cards
CREATE POLICY IF NOT EXISTS "cards_select_authenticated"
    ON pyra_cards FOR SELECT TO authenticated USING (true);
CREATE POLICY IF NOT EXISTS "cards_insert_authenticated"
    ON pyra_cards FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "cards_update_authenticated"
    ON pyra_cards FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "cards_delete_authenticated"
    ON pyra_cards FOR DELETE TO authenticated USING (true);

-- pyra_expense_categories
CREATE POLICY IF NOT EXISTS "expense_cat_select_authenticated"
    ON pyra_expense_categories FOR SELECT TO authenticated USING (true);
CREATE POLICY IF NOT EXISTS "expense_cat_insert_authenticated"
    ON pyra_expense_categories FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "expense_cat_update_authenticated"
    ON pyra_expense_categories FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "expense_cat_delete_authenticated"
    ON pyra_expense_categories FOR DELETE TO authenticated USING (true);

-- pyra_expenses
CREATE POLICY IF NOT EXISTS "expenses_select_authenticated"
    ON pyra_expenses FOR SELECT TO authenticated USING (true);
CREATE POLICY IF NOT EXISTS "expenses_insert_authenticated"
    ON pyra_expenses FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "expenses_update_authenticated"
    ON pyra_expenses FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "expenses_delete_authenticated"
    ON pyra_expenses FOR DELETE TO authenticated USING (true);

-- pyra_subscriptions
CREATE POLICY IF NOT EXISTS "subscriptions_select_authenticated"
    ON pyra_subscriptions FOR SELECT TO authenticated USING (true);
CREATE POLICY IF NOT EXISTS "subscriptions_insert_authenticated"
    ON pyra_subscriptions FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "subscriptions_update_authenticated"
    ON pyra_subscriptions FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "subscriptions_delete_authenticated"
    ON pyra_subscriptions FOR DELETE TO authenticated USING (true);

-- pyra_contracts
CREATE POLICY IF NOT EXISTS "contracts_select_authenticated"
    ON pyra_contracts FOR SELECT TO authenticated USING (true);
CREATE POLICY IF NOT EXISTS "contracts_insert_authenticated"
    ON pyra_contracts FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "contracts_update_authenticated"
    ON pyra_contracts FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "contracts_delete_authenticated"
    ON pyra_contracts FOR DELETE TO authenticated USING (true);

-- Also allow anon/service_role full access (for n8n webhooks & server-side calls)
CREATE POLICY IF NOT EXISTS "cards_select_anon"
    ON pyra_cards FOR SELECT TO anon USING (true);
CREATE POLICY IF NOT EXISTS "cards_all_service"
    ON pyra_cards FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "expense_cat_select_anon"
    ON pyra_expense_categories FOR SELECT TO anon USING (true);
CREATE POLICY IF NOT EXISTS "expense_cat_all_service"
    ON pyra_expense_categories FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "expenses_select_anon"
    ON pyra_expenses FOR SELECT TO anon USING (true);
CREATE POLICY IF NOT EXISTS "expenses_all_service"
    ON pyra_expenses FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "subscriptions_select_anon"
    ON pyra_subscriptions FOR SELECT TO anon USING (true);
CREATE POLICY IF NOT EXISTS "subscriptions_all_service"
    ON pyra_subscriptions FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "contracts_select_anon"
    ON pyra_contracts FOR SELECT TO anon USING (true);
CREATE POLICY IF NOT EXISTS "contracts_all_service"
    ON pyra_contracts FOR ALL TO service_role USING (true) WITH CHECK (true);


-- ============================================================================
-- 7. UPDATED_AT TRIGGER (auto-update timestamps)
-- ============================================================================

-- Create a reusable trigger function (if not already present)
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

-- Attach to tables with updated_at
DROP TRIGGER IF EXISTS set_updated_at ON pyra_cards;
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON pyra_cards
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON pyra_expenses;
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON pyra_expenses
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON pyra_subscriptions;
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON pyra_subscriptions
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON pyra_contracts;
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON pyra_contracts
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();


-- ============================================================================
-- Done! 🦊
-- ============================================================================
