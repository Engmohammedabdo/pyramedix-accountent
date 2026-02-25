// ──────────────────────────────────────────────
// PyramediaX Accountant — Database Types
// ──────────────────────────────────────────────

export interface Database {
  public: {
    Tables: {
      clients: { Row: Client; Insert: Omit<Client, "id" | "created_at" | "updated_at">; Update: Partial<Client> };
      projects: { Row: Project; Insert: Omit<Project, "id" | "created_at" | "updated_at">; Update: Partial<Project> };
      invoices: { Row: Invoice; Insert: Omit<Invoice, "id" | "created_at" | "updated_at">; Update: Partial<Invoice> };
      invoice_items: { Row: InvoiceItem; Insert: Omit<InvoiceItem, "id">; Update: Partial<InvoiceItem> };
      payments: { Row: Payment; Insert: Omit<Payment, "id" | "created_at">; Update: Partial<Payment> };
      quotes: { Row: Quote; Insert: Omit<Quote, "id" | "created_at" | "updated_at">; Update: Partial<Quote> };
      quote_items: { Row: QuoteItem; Insert: Omit<QuoteItem, "id">; Update: Partial<QuoteItem> };
      cards: { Row: Card; Insert: Omit<Card, "id" | "created_at" | "updated_at">; Update: Partial<Card> };
      expense_categories: { Row: ExpenseCategory; Insert: Omit<ExpenseCategory, "id">; Update: Partial<ExpenseCategory> };
      expenses: { Row: Expense; Insert: Omit<Expense, "id" | "created_at">; Update: Partial<Expense> };
      subscriptions: { Row: Subscription; Insert: Omit<Subscription, "id" | "created_at" | "updated_at">; Update: Partial<Subscription> };
      contracts: { Row: Contract; Insert: Omit<Contract, "id" | "created_at" | "updated_at">; Update: Partial<Contract> };
    };
    Views: {
      financial_overview: { Row: FinancialOverview };
      monthly_revenue: { Row: MonthlyRevenue };
      expense_breakdown: { Row: ExpenseBreakdown };
      upcoming_subscriptions: { Row: UpcomingSubscription };
      overdue_payments: { Row: OverduePayment };
      client_financial_summary: { Row: ClientFinancialSummary };
    };
  };
}

// ── Core Entities ───────────────────────────────

export interface Client {
  id: string;
  name: string;
  name_ar?: string;
  email?: string;
  phone?: string;
  company?: string;
  company_ar?: string;
  address?: string;
  tax_number?: string;
  notes?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  client_id: string;
  name: string;
  name_ar?: string;
  description?: string;
  status: "draft" | "active" | "completed" | "cancelled";
  start_date?: string;
  end_date?: string;
  budget?: number;
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  client_id: string;
  project_id?: string;
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
  issue_date: string;
  due_date: string;
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total: number;
  currency: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  description: string;
  description_ar?: string;
  quantity: number;
  unit_price: number;
  total: number;
  sort_order: number;
}

export interface Payment {
  id: string;
  invoice_id: string;
  amount: number;
  payment_date: string;
  payment_method: "bank_transfer" | "cash" | "cheque" | "card" | "online";
  reference_number?: string;
  notes?: string;
  created_at: string;
}

export interface Quote {
  id: string;
  quote_number: string;
  client_id: string;
  project_id?: string;
  status: "draft" | "sent" | "accepted" | "rejected" | "expired";
  issue_date: string;
  expiry_date: string;
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total: number;
  currency: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface QuoteItem {
  id: string;
  quote_id: string;
  description: string;
  description_ar?: string;
  quantity: number;
  unit_price: number;
  total: number;
  sort_order: number;
}

// ── New Entities ────────────────────────────────

export interface Card {
  id: string;
  card_name: string;
  card_type: "credit" | "debit" | "prepaid";
  last_four: string;
  bank_name?: string;
  cardholder_name: string;
  expiry_date: string;
  credit_limit?: number;
  current_balance: number;
  currency: string;
  is_active: boolean;
  color?: string;
  created_at: string;
  updated_at: string;
}

export interface ExpenseCategory {
  id: string;
  name: string;
  name_ar?: string;
  icon?: string;
  color?: string;
  parent_id?: string;
}

export interface Expense {
  id: string;
  category_id: string;
  card_id?: string;
  amount: number;
  currency: string;
  description: string;
  description_ar?: string;
  expense_date: string;
  vendor?: string;
  receipt_url?: string;
  is_recurring: boolean;
  tags?: string[];
  created_at: string;
}

export interface Subscription {
  id: string;
  name: string;
  name_ar?: string;
  provider: string;
  amount: number;
  currency: string;
  billing_cycle: "monthly" | "quarterly" | "yearly";
  next_billing_date: string;
  card_id?: string;
  category_id?: string;
  status: "active" | "paused" | "cancelled";
  auto_renew: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Contract {
  id: string;
  client_id: string;
  project_id?: string;
  contract_number: string;
  title: string;
  title_ar?: string;
  description?: string;
  status: "draft" | "active" | "completed" | "terminated";
  start_date: string;
  end_date?: string;
  total_value: number;
  currency: string;
  payment_terms?: string;
  document_url?: string;
  created_at: string;
  updated_at: string;
}

// ── View Types ──────────────────────────────────

export interface FinancialOverview {
  total_revenue: number;
  total_expenses: number;
  net_profit: number;
  outstanding_amount: number;
  overdue_amount: number;
  total_clients: number;
  active_contracts: number;
  active_subscriptions: number;
}

export interface MonthlyRevenue {
  month: string;
  year: number;
  revenue: number;
  expenses: number;
  profit: number;
  invoice_count: number;
}

export interface ExpenseBreakdown {
  category_id: string;
  category_name: string;
  category_name_ar?: string;
  total_amount: number;
  percentage: number;
  transaction_count: number;
}

export interface UpcomingSubscription {
  id: string;
  name: string;
  name_ar?: string;
  provider: string;
  amount: number;
  currency: string;
  next_billing_date: string;
  days_until_billing: number;
}

export interface OverduePayment {
  invoice_id: string;
  invoice_number: string;
  client_name: string;
  total: number;
  amount_paid: number;
  amount_due: number;
  due_date: string;
  days_overdue: number;
}

export interface ClientFinancialSummary {
  client_id: string;
  client_name: string;
  total_invoiced: number;
  total_paid: number;
  total_outstanding: number;
  invoice_count: number;
  last_payment_date?: string;
}
