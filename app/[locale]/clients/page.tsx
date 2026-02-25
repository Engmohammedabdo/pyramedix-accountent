"use client";

import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { Plus, Search, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";

const clients = [
  {
    id: 1,
    name: "Injazat Real Estate",
    company: "Injazat Properties LLC",
    totalBilled: 180000,
    totalPaid: 155000,
    outstanding: 25000,
    status: "active",
  },
  {
    id: 2,
    name: "Elite Life Clinic",
    company: "Elite Life Medical Center",
    totalBilled: 96000,
    totalPaid: 96000,
    outstanding: 0,
    status: "active",
  },
  {
    id: 3,
    name: "Dubai Marina Restaurant",
    company: "Marina Dining Group",
    totalBilled: 45000,
    totalPaid: 33000,
    outstanding: 12000,
    status: "active",
  },
  {
    id: 4,
    name: "Al Noor Contracting",
    company: "Al Noor Construction LLC",
    totalBilled: 72000,
    totalPaid: 50000,
    outstanding: 22000,
    status: "active",
  },
  {
    id: 5,
    name: "Gulf Media Group",
    company: "Gulf Digital Media FZ-LLC",
    totalBilled: 38000,
    totalPaid: 30500,
    outstanding: 7500,
    status: "inactive",
  },
];

export default function ClientsPage() {
  const t = useTranslations("clients");
  const tc = useTranslations("common");
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
          {t("addClient")}
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder={`${tc("search")}...`}
            className="ps-9"
          />
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("clientName")}</TableHead>
                <TableHead>{t("company")}</TableHead>
                <TableHead className="text-end">{t("totalInvoiced")}</TableHead>
                <TableHead className="text-end">{t("totalPaid")}</TableHead>
                <TableHead className="text-end">{t("balance")}</TableHead>
                <TableHead>{tc("status")}</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell className="text-slate-500">{client.company}</TableCell>
                  <TableCell className="text-end">
                    {formatCurrency(client.totalBilled, "AED", currLocale)}
                  </TableCell>
                  <TableCell className="text-end">
                    {formatCurrency(client.totalPaid, "AED", currLocale)}
                  </TableCell>
                  <TableCell className="text-end">
                    <span
                      className={
                        client.outstanding > 0
                          ? "font-semibold text-red-600"
                          : "text-green-600"
                      }
                    >
                      {formatCurrency(client.outstanding, "AED", currLocale)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={client.status === "active" ? "default" : "secondary"}
                    >
                      {tc(client.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <button className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
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
