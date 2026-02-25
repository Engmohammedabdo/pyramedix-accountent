"use client";

import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { Plus, FileText, Calendar, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

const contracts = [
  {
    id: 1,
    title: "Website Redesign & SEO",
    client: "Injazat Real Estate",
    type: "milestone",
    totalValue: 85000,
    startDate: "2026-01-15",
    endDate: "2026-06-15",
    status: "active",
    milestones: [
      { name: "Design Phase", amount: 25000, completed: true },
      { name: "Development", amount: 35000, completed: false },
      { name: "Launch & SEO", amount: 25000, completed: false },
    ],
  },
  {
    id: 2,
    title: "Monthly Social Media Management",
    client: "Elite Life Clinic",
    type: "retainer",
    totalValue: 8000,
    startDate: "2025-06-01",
    endDate: "2026-05-31",
    status: "active",
    monthlyAmount: 8000,
  },
  {
    id: 3,
    title: "Brand Identity Package",
    client: "Dubai Marina Restaurant",
    type: "upfront",
    totalValue: 45000,
    startDate: "2026-02-01",
    endDate: "2026-04-01",
    status: "active",
    upfrontPercent: 50,
  },
  {
    id: 4,
    title: "AI Chatbot Integration",
    client: "Al Noor Contracting",
    type: "milestone",
    totalValue: 32000,
    startDate: "2025-11-01",
    endDate: "2026-02-28",
    status: "completed",
    milestones: [
      { name: "Setup & Training", amount: 12000, completed: true },
      { name: "Integration", amount: 12000, completed: true },
      { name: "Go-Live Support", amount: 8000, completed: true },
    ],
  },
];

const typeColors: Record<string, string> = {
  retainer: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  milestone: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  upfront: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
};

const typeLabels: Record<string, string> = {
  retainer: "Retainer",
  milestone: "Milestone",
  upfront: "Upfront + Delivery",
};

export default function ContractsPage() {
  const t = useTranslations("contracts");
  const ts = useTranslations("status");
  const locale = useLocale();
  const currLocale = locale === "ar" ? "ar-AE" : "en-AE";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {t("title")}
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {t("subtitle")}
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          {t("addContract")}
        </Button>
      </div>

      {/* Contract Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {contracts.map((contract) => (
          <Card
            key={contract.id}
            className="transition-shadow hover:shadow-md"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{contract.title}</CardTitle>
                  <CardDescription className="mt-1">
                    {contract.client}
                  </CardDescription>
                </div>
                <Badge
                  variant={contract.status === "active" ? "default" : "secondary"}
                >
                  {ts(contract.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Type Badge */}
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    typeColors[contract.type]
                  }`}
                >
                  {typeLabels[contract.type]}
                </span>
              </div>

              {/* Info Row */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <DollarSign className="h-4 w-4" />
                  <span>{formatCurrency(contract.totalValue, "AED", currLocale)}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {contract.startDate} → {contract.endDate}
                  </span>
                </div>
              </div>

              {/* Milestones Progress (if milestone type) */}
              {contract.type === "milestone" && contract.milestones && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Milestones
                  </p>
                  {contract.milestones.map((ms, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-2 w-2 rounded-full ${
                            ms.completed
                              ? "bg-green-500"
                              : "bg-slate-300 dark:bg-slate-600"
                          }`}
                        />
                        <span
                          className={
                            ms.completed
                              ? "text-slate-500 line-through"
                              : "text-slate-700 dark:text-slate-300"
                          }
                        >
                          {ms.name}
                        </span>
                      </div>
                      <span className="text-slate-500">
                        {formatCurrency(ms.amount, "AED", currLocale)}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Retainer info */}
              {contract.type === "retainer" && (
                <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-950/30">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Monthly: {formatCurrency(contract.monthlyAmount!, "AED", currLocale)}
                  </p>
                </div>
              )}

              {/* Upfront info */}
              {contract.type === "upfront" && (
                <div className="rounded-lg bg-amber-50 p-3 dark:bg-amber-950/30">
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    {contract.upfrontPercent}% upfront ={" "}
                    {formatCurrency(
                      contract.totalValue * (contract.upfrontPercent! / 100),
                      "AED",
                      currLocale
                    )}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
