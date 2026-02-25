"use client";

import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { Plus, Search, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/lib/utils";

const incomeData = [
  { id: "INV-2026-001", client: "Injazat Real Estate", amount: 25000, date: "2026-02-20", method: "Bank Transfer", status: "paid" },
  { id: "INV-2026-002", client: "Elite Life Clinic", amount: 8000, date: "2026-02-15", method: "Bank Transfer", status: "paid" },
  { id: "INV-2026-003", client: "Dubai Marina Restaurant", amount: 12000, date: "2026-02-12", method: "Cheque", status: "pending" },
  { id: "INV-2026-004", client: "Al Noor Contracting", amount: 15000, date: "2026-02-10", method: "Bank Transfer", status: "overdue" },
  { id: "INV-2026-005", client: "Gulf Media Group", amount: 7500, date: "2026-02-08", method: "Bank Transfer", status: "paid" },
];

const expenseData = [
  { id: "EXP-2026-001", vendor: "Adobe Creative Cloud", amount: 1200, date: "2026-02-18", category: "Subscriptions", method: "Credit Card" },
  { id: "EXP-2026-002", vendor: "AWS Hosting", amount: 450, date: "2026-02-14", category: "Infrastructure", method: "Credit Card" },
  { id: "EXP-2026-003", vendor: "Office Rent — JLT", amount: 8000, date: "2026-02-05", category: "Office", method: "Bank Transfer" },
  { id: "EXP-2026-004", vendor: "Meta Ads", amount: 3500, date: "2026-02-03", category: "Marketing", method: "Credit Card" },
  { id: "EXP-2026-005", vendor: "Freezone License Renewal", amount: 5800, date: "2026-02-01", category: "License", method: "Bank Transfer" },
];

const statusColors: Record<string, string> = {
  paid: "default",
  pending: "secondary",
  overdue: "destructive",
};

export default function TransactionsPage() {
  const t = useTranslations("transactions");
  const tc = useTranslations("common");
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
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            {tc("export")}
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            {t("addTransaction")}
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input placeholder={`${tc("search")}...`} className="ps-9" />
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="income">
        <TabsList>
          <TabsTrigger value="income">
            {locale === "ar" ? "الدخل" : "Income"}
          </TabsTrigger>
          <TabsTrigger value="expenses">
            {locale === "ar" ? "المصروفات" : "Expenses"}
          </TabsTrigger>
        </TabsList>

        {/* Income Tab */}
        <TabsContent value="income">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("invoiceNumber")}</TableHead>
                    <TableHead>{locale === "ar" ? "العميل" : "Client"}</TableHead>
                    <TableHead className="text-end">{tc("amount")}</TableHead>
                    <TableHead>{tc("date")}</TableHead>
                    <TableHead>{t("paymentMethod")}</TableHead>
                    <TableHead>{tc("status")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {incomeData.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell className="font-mono text-sm">{tx.id}</TableCell>
                      <TableCell className="font-medium">{tx.client}</TableCell>
                      <TableCell className="text-end font-semibold text-green-600">
                        +{formatCurrency(tx.amount, "AED", currLocale)}
                      </TableCell>
                      <TableCell className="text-slate-500">{tx.date}</TableCell>
                      <TableCell className="text-slate-500">{tx.method}</TableCell>
                      <TableCell>
                        <Badge variant={statusColors[tx.status] as any}>
                          {ts(tx.status)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Expenses Tab */}
        <TabsContent value="expenses">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{locale === "ar" ? "الرقم" : "Ref"}</TableHead>
                    <TableHead>{locale === "ar" ? "المورد" : "Vendor"}</TableHead>
                    <TableHead className="text-end">{tc("amount")}</TableHead>
                    <TableHead>{tc("date")}</TableHead>
                    <TableHead>{locale === "ar" ? "التصنيف" : "Category"}</TableHead>
                    <TableHead>{t("paymentMethod")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenseData.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell className="font-mono text-sm">{tx.id}</TableCell>
                      <TableCell className="font-medium">{tx.vendor}</TableCell>
                      <TableCell className="text-end font-semibold text-red-600">
                        -{formatCurrency(tx.amount, "AED", currLocale)}
                      </TableCell>
                      <TableCell className="text-slate-500">{tx.date}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{tx.category}</Badge>
                      </TableCell>
                      <TableCell className="text-slate-500">{tx.method}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
