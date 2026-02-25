"use client";

import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";

const subscriptions = [
  {
    id: 1,
    name: "Adobe Creative Cloud",
    cost: 1200,
    cycle: "monthly",
    nextBilling: "2026-03-18",
    card: "ADCB •••• 4521",
    status: "active",
    autoRenew: true,
  },
  {
    id: 2,
    name: "Figma Professional",
    cost: 450,
    cycle: "monthly",
    nextBilling: "2026-03-01",
    card: "ENBD •••• 8734",
    status: "active",
    autoRenew: true,
  },
  {
    id: 3,
    name: "OpenAI API",
    cost: 320,
    cycle: "monthly",
    nextBilling: "2026-03-01",
    card: "ADCB •••• 4521",
    status: "active",
    autoRenew: true,
  },
  {
    id: 4,
    name: "AWS (EC2 + S3)",
    cost: 450,
    cycle: "monthly",
    nextBilling: "2026-03-01",
    card: "ENBD •••• 8734",
    status: "active",
    autoRenew: true,
  },
  {
    id: 5,
    name: "Coolify Pro",
    cost: 180,
    cycle: "monthly",
    nextBilling: "2026-03-10",
    card: "ADCB •••• 4521",
    status: "active",
    autoRenew: true,
  },
  {
    id: 6,
    name: "Notion Team",
    cost: 96,
    cycle: "monthly",
    nextBilling: "2026-03-15",
    card: "ENBD •••• 8734",
    status: "active",
    autoRenew: true,
  },
  {
    id: 7,
    name: "Slack Pro",
    cost: 280,
    cycle: "monthly",
    nextBilling: "2026-03-20",
    card: "ADCB •••• 4521",
    status: "paused",
    autoRenew: false,
  },
  {
    id: 8,
    name: "Google Workspace",
    cost: 540,
    cycle: "yearly",
    nextBilling: "2026-12-01",
    card: "ENBD •••• 8734",
    status: "active",
    autoRenew: true,
  },
];

export default function SubscriptionsPage() {
  const t = useTranslations("subscriptions");
  const tc = useTranslations("common");
  const ts = useTranslations("status");
  const locale = useLocale();
  const currLocale = locale === "ar" ? "ar-AE" : "en-AE";

  const totalMonthly = subscriptions
    .filter((s) => s.status === "active" && s.cycle === "monthly")
    .reduce((sum, s) => sum + s.cost, 0);

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
          {t("addSubscription")}
        </Button>
      </div>

      {/* Summary */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/30">
        <p className="text-sm text-blue-600 dark:text-blue-400">
          {locale === "ar" ? "إجمالي الاشتراكات الشهرية" : "Total Monthly Subscriptions"}
        </p>
        <p className="mt-1 text-2xl font-bold text-blue-700 dark:text-blue-300">
          {formatCurrency(totalMonthly, "AED", currLocale)}
        </p>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input placeholder={`${tc("search")}...`} className="ps-9" />
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("provider")}</TableHead>
                <TableHead className="text-end">{tc("amount")}</TableHead>
                <TableHead>{t("billingCycle")}</TableHead>
                <TableHead>{t("nextBilling")}</TableHead>
                <TableHead>{locale === "ar" ? "البطاقة" : "Card"}</TableHead>
                <TableHead>{t("autoRenew")}</TableHead>
                <TableHead>{tc("status")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptions.map((sub) => (
                <TableRow key={sub.id}>
                  <TableCell className="font-medium">{sub.name}</TableCell>
                  <TableCell className="text-end">
                    {formatCurrency(sub.cost, "AED", currLocale)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{t(sub.cycle)}</Badge>
                  </TableCell>
                  <TableCell className="text-slate-500">{sub.nextBilling}</TableCell>
                  <TableCell className="font-mono text-xs text-slate-500">
                    {sub.card}
                  </TableCell>
                  <TableCell>
                    {sub.autoRenew ? (
                      <span className="text-green-600">✓</span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={sub.status === "active" ? "default" : "secondary"}
                    >
                      {ts(sub.status)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
