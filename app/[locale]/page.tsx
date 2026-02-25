"use client";

import { useTranslations, useLocale } from "next-intl";
import {
  DollarSign,
  TrendingDown,
  TrendingUp,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { ChartWrapper } from "@/components/dashboard/chart-wrapper";
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { useDashboardData } from "@/lib/hooks/use-dashboard-data";
import { useMonthlyRevenue } from "@/lib/hooks/use-monthly-revenue";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const EXPENSE_COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#14B8A6"];

const MONTH_NAMES_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTH_NAMES_AR = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];

export default function DashboardPage() {
  const t = useTranslations("dashboard");
  const locale = useLocale();
  const { loading, overview, expenseBreakdown, upcomingSubscriptions, overduePayments } = useDashboardData();
  const { loading: revenueLoading, data: monthlyRevenue } = useMonthlyRevenue();

  const localeStr = locale === "ar" ? "ar-AE" : "en-AE";
  const monthNames = locale === "ar" ? MONTH_NAMES_AR : MONTH_NAMES_EN;

  if (loading) return <DashboardSkeleton />;

  // Format revenue data for chart
  const revenueChartData = monthlyRevenue.length > 0
    ? monthlyRevenue.map((m) => ({
        month: monthNames[(Number(m.month) || 1) - 1],
        revenue: Number(m.total_paid) || 0,
        invoiced: Number(m.total_invoiced) || 0,
      }))
    : MONTH_NAMES_EN.slice(0, 6).map((m) => ({ month: m, revenue: 0, invoiced: 0 }));

  // Format expense data for pie chart
  const expenseChartData = expenseBreakdown.length > 0
    ? expenseBreakdown
        .filter((e) => Number(e.total_amount) > 0)
        .map((e, i) => ({
          name: locale === "ar" ? e.category_name_ar : e.category_name,
          value: Number(e.total_amount),
          color: EXPENSE_COLORS[i % EXPENSE_COLORS.length],
        }))
    : [
        { name: locale === "ar" ? "لا توجد بيانات" : "No data", value: 1, color: "#e2e8f0" },
      ];

  const rev = overview || {
    total_revenue_mtd: 0,
    total_revenue_ytd: 0,
    total_expenses_mtd: 0,
    total_expenses_ytd: 0,
    net_profit_mtd: 0,
    net_profit_ytd: 0,
    total_outstanding: 0,
    total_overdue: 0,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          {t("title")}
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {t("subtitle")}
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={t("totalRevenue")}
          value={formatCurrency(Number(rev.total_revenue_mtd), "AED", localeStr)}
          icon={DollarSign}
          variant="success"
        />
        <StatCard
          title={t("totalExpenses")}
          value={formatCurrency(Number(rev.total_expenses_mtd), "AED", localeStr)}
          icon={TrendingDown}
          variant="danger"
        />
        <StatCard
          title={t("netProfit")}
          value={formatCurrency(Number(rev.net_profit_mtd), "AED", localeStr)}
          icon={TrendingUp}
          variant="primary"
        />
        <StatCard
          title={t("outstanding")}
          value={formatCurrency(Number(rev.total_outstanding), "AED", localeStr)}
          icon={Clock}
          variant="warning"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Revenue Chart */}
        <ChartWrapper title={t("revenueChart")} className="lg:col-span-2">
          <div className="h-[300px]">
            {revenueChartData.some((d) => d.revenue > 0 || d.invoiced > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueChartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Bar dataKey="invoiced" fill="#93C5FD" radius={[4, 4, 0, 0]} name={locale === "ar" ? "الفواتير" : "Invoiced"} />
                  <Bar dataKey="revenue" fill="#3B82F6" radius={[4, 4, 0, 0]} name={locale === "ar" ? "المحصّل" : "Collected"} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-slate-400">
                <div className="text-center">
                  <BarChart className="mx-auto h-12 w-12 mb-2 opacity-30" />
                  <p className="text-sm">{locale === "ar" ? "لا توجد بيانات إيرادات بعد" : "No revenue data yet"}</p>
                </div>
              </div>
            )}
          </div>
        </ChartWrapper>

        {/* Expense Breakdown */}
        <ChartWrapper title={t("expenseBreakdown")}>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {expenseChartData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 flex flex-wrap justify-center gap-3">
              {expenseChartData.map((item) => (
                <div key={item.name} className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name}
                </div>
              ))}
            </div>
          </div>
        </ChartWrapper>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Upcoming Subscriptions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <RefreshCw className="h-4 w-4" />
              {t("activeSubscriptions")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingSubscriptions.length > 0 ? (
              <div className="space-y-3">
                {upcomingSubscriptions.map((sub, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg border border-slate-100 p-3 dark:border-slate-800">
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{sub.tool_name}</p>
                      <p className="text-xs text-slate-500">
                        {locale === "ar" ? "التجديد:" : "Renews:"} {sub.renewal_date}
                        {sub.days_until_renewal != null && (
                          <span className="ms-2 text-amber-500">
                            ({sub.days_until_renewal} {locale === "ar" ? "يوم" : "days"})
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="text-end">
                      <p className="text-sm font-semibold">{formatCurrency(Number(sub.cost), sub.currency || "AED", localeStr)}</p>
                      {sub.card_name && <p className="text-xs text-slate-400">{sub.card_name}</p>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-slate-400">
                <RefreshCw className="mx-auto h-8 w-8 mb-2 opacity-30" />
                <p className="text-sm">{locale === "ar" ? "لا توجد اشتراكات قادمة" : "No upcoming subscriptions"}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Overdue Payments */}
        <Card className={overduePayments.length > 0 ? "border-red-200 dark:border-red-900/50" : ""}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 text-base ${overduePayments.length > 0 ? "text-red-600 dark:text-red-400" : ""}`}>
              <AlertTriangle className="h-4 w-4" />
              {t("overdue")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {overduePayments.length > 0 ? (
              <div className="space-y-3">
                {overduePayments.map((payment, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-slate-100">{payment.client_name || payment.client_company}</p>
                      <p className="text-xs text-red-500">
                        {payment.days_overdue} {locale === "ar" ? "يوم تأخير" : "days overdue"}
                      </p>
                    </div>
                    <span className="font-semibold text-red-600">
                      {formatCurrency(Number(payment.amount_due), "AED", localeStr)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-emerald-500">
                <p className="text-sm">✅ {locale === "ar" ? "لا توجد مدفوعات متأخرة" : "No overdue payments"}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
