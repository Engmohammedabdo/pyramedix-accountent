"use client";

import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import {
  DollarSign,
  TrendingDown,
  TrendingUp,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { ChartWrapper } from "@/components/dashboard/chart-wrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
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

const revenueData = [
  { month: "Jan", revenue: 42000, expenses: 28000 },
  { month: "Feb", revenue: 55000, expenses: 31000 },
  { month: "Mar", revenue: 48000, expenses: 26000 },
  { month: "Apr", revenue: 61000, expenses: 33000 },
  { month: "May", revenue: 52000, expenses: 29000 },
  { month: "Jun", revenue: 67000, expenses: 35000 },
];

const expenseBreakdown = [
  { name: "Subscriptions", value: 8500, color: "#3B82F6" },
  { name: "Salaries", value: 15000, color: "#10B981" },
  { name: "Marketing", value: 6200, color: "#F59E0B" },
  { name: "Office", value: 3800, color: "#EF4444" },
  { name: "Tools", value: 2500, color: "#8B5CF6" },
];

const recentTransactions = [
  { id: 1, client: "Injazat Real Estate", amount: 15000, type: "income", date: "2026-02-20", status: "paid" },
  { id: 2, client: "Adobe Creative Cloud", amount: -1200, type: "expense", date: "2026-02-18", status: "paid" },
  { id: 3, client: "Elite Life Clinic", amount: 8500, type: "income", date: "2026-02-15", status: "paid" },
  { id: 4, client: "AWS Hosting", amount: -450, type: "expense", date: "2026-02-14", status: "paid" },
  { id: 5, client: "Dubai Marina Restaurant", amount: 12000, type: "income", date: "2026-02-12", status: "pending" },
];

const upcomingPayments = [
  { name: "Figma Pro", amount: 450, dueDate: "2026-03-01", type: "subscription" },
  { name: "OpenAI API", amount: 320, dueDate: "2026-03-01", type: "subscription" },
  { name: "Office Rent", amount: 8000, dueDate: "2026-03-05", type: "expense" },
  { name: "Coolify Server", amount: 180, dueDate: "2026-03-10", type: "subscription" },
];

const overduePayments = [
  { client: "Al Noor Contracting", amount: 22000, dueDate: "2026-02-10", daysOverdue: 15 },
  { client: "Gulf Media Group", amount: 7500, dueDate: "2026-02-15", daysOverdue: 10 },
];

export default function DashboardPage() {
  const t = useTranslations("dashboard");
  const locale = useLocale();

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
          value={formatCurrency(67000, "AED", locale === "ar" ? "ar-AE" : "en-AE")}
          icon={DollarSign}
          trend={{ value: 12.5, isPositive: true }}
          variant="success"
        />
        <StatCard
          title={t("totalExpenses")}
          value={formatCurrency(35000, "AED", locale === "ar" ? "ar-AE" : "en-AE")}
          icon={TrendingDown}
          trend={{ value: 3.2, isPositive: false }}
          variant="danger"
        />
        <StatCard
          title={t("netProfit")}
          value={formatCurrency(32000, "AED", locale === "ar" ? "ar-AE" : "en-AE")}
          icon={TrendingUp}
          trend={{ value: 8.1, isPositive: true }}
          variant="primary"
        />
        <StatCard
          title={t("outstanding")}
          value={formatCurrency(29500, "AED", locale === "ar" ? "ar-AE" : "en-AE")}
          icon={Clock}
          trend={{ value: 5, isPositive: false }}
          variant="warning"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Revenue Chart */}
        <ChartWrapper title={t("revenueChart")} className="lg:col-span-2">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
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
                <Bar dataKey="revenue" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Revenue" />
                <Bar dataKey="expenses" fill="#EF4444" radius={[4, 4, 0, 0]} name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartWrapper>

        {/* Expense Breakdown */}
        <ChartWrapper title={t("expenseBreakdown")}>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {expenseBreakdown.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 flex flex-wrap justify-center gap-3">
              {expenseBreakdown.map((item) => (
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
        {/* Recent Transactions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">{t("recentTransactions")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between rounded-lg border border-slate-100 p-3 dark:border-slate-800"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                        tx.type === "income"
                          ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                      }`}
                    >
                      {tx.type === "income" ? (
                        <ArrowUpRight className="h-4 w-4" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        {tx.client}
                      </p>
                      <p className="text-xs text-slate-500">{tx.date}</p>
                    </div>
                  </div>
                  <div className="text-end">
                    <p
                      className={`text-sm font-semibold ${
                        tx.type === "income" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {tx.type === "income" ? "+" : ""}
                      {formatCurrency(tx.amount, "AED", locale === "ar" ? "ar-AE" : "en-AE")}
                    </p>
                    <Badge
                      variant={tx.status === "paid" ? "default" : "secondary"}
                      className="text-[10px]"
                    >
                      {tx.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming & Overdue */}
        <div className="space-y-6">
          {/* Upcoming Payments */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("upcomingPayments")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingPayments.map((payment, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-sm"
                  >
                    <div>
                      <p className="font-medium text-slate-900 dark:text-slate-100">
                        {payment.name}
                      </p>
                      <p className="text-xs text-slate-500">{payment.dueDate}</p>
                    </div>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {formatCurrency(payment.amount, "AED", locale === "ar" ? "ar-AE" : "en-AE")}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Overdue */}
          <Card className="border-red-200 dark:border-red-900/50">
            <CardHeader>
              <CardTitle className="text-base text-red-600 dark:text-red-400">
                {t("overdue")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {overduePayments.map((payment, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-sm"
                  >
                    <div>
                      <p className="font-medium text-slate-900 dark:text-slate-100">
                        {payment.client}
                      </p>
                      <p className="text-xs text-red-500">
                        {payment.daysOverdue} days overdue
                      </p>
                    </div>
                    <span className="font-semibold text-red-600">
                      {formatCurrency(payment.amount, "AED", locale === "ar" ? "ar-AE" : "en-AE")}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
