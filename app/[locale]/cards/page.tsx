"use client";

import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { Plus, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

const bankCards = [
  {
    id: 1,
    name: "ADCB Business Card",
    type: "credit",
    bank: "Abu Dhabi Commercial Bank",
    lastFour: "4521",
    creditLimit: 50000,
    currentBalance: 12450,
    expiryDate: "09/28",
    color: "from-slate-800 to-slate-900",
  },
  {
    id: 2,
    name: "Emirates NBD Debit",
    type: "debit",
    bank: "Emirates NBD",
    lastFour: "8734",
    creditLimit: 0,
    currentBalance: 34200,
    expiryDate: "03/27",
    color: "from-blue-600 to-blue-800",
  },
  {
    id: 3,
    name: "FAB Prepaid",
    type: "prepaid",
    bank: "First Abu Dhabi Bank",
    lastFour: "2190",
    creditLimit: 10000,
    currentBalance: 3750,
    expiryDate: "11/26",
    color: "from-emerald-600 to-emerald-800",
  },
  {
    id: 4,
    name: "ADCB Savings",
    type: "debit",
    bank: "Abu Dhabi Commercial Bank",
    lastFour: "6103",
    creditLimit: 0,
    currentBalance: 128500,
    expiryDate: "07/28",
    color: "from-purple-600 to-purple-800",
  },
];

export default function CardsPage() {
  const t = useTranslations("cards");
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
          {t("addCard")}
        </Button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {bankCards.map((card) => (
          <div key={card.id} className="space-y-3">
            {/* Visual Card */}
            <div
              className={cn(
                "relative aspect-[1.586/1] max-w-[400px] overflow-hidden rounded-2xl bg-gradient-to-br p-6 text-white shadow-lg",
                card.color
              )}
            >
              {/* Decorative circles */}
              <div className="absolute -end-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
              <div className="absolute -bottom-4 -start-4 h-24 w-24 rounded-full bg-white/5" />

              <div className="relative flex h-full flex-col justify-between">
                {/* Top: Bank & Type */}
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-white/70">{card.bank}</p>
                    <p className="mt-0.5 text-sm font-semibold">{card.name}</p>
                  </div>
                  <Wifi className="h-6 w-6 rotate-90 text-white/60" />
                </div>

                {/* Middle: Card Number */}
                <div className="flex items-center gap-3 text-lg tracking-[0.2em]">
                  <span className="text-white/40">••••</span>
                  <span className="text-white/40">••••</span>
                  <span className="text-white/40">••••</span>
                  <span className="font-semibold">{card.lastFour}</span>
                </div>

                {/* Bottom: Expiry & Type */}
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-white/50">
                      {locale === "ar" ? "صالحة حتى" : "Valid Thru"}
                    </p>
                    <p className="text-sm font-medium">{card.expiryDate}</p>
                  </div>
                  <Badge className="border-white/20 bg-white/10 text-white">
                    {t(card.type)}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Card Details */}
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-slate-500 dark:text-slate-400">
                      {t("currentBalance")}
                    </p>
                    <p className="mt-1 text-lg font-bold text-slate-900 dark:text-slate-100">
                      {formatCurrency(card.currentBalance, "AED", currLocale)}
                    </p>
                  </div>
                  {card.type === "credit" && (
                    <div>
                      <p className="text-slate-500 dark:text-slate-400">
                        {t("creditLimit")}
                      </p>
                      <p className="mt-1 text-lg font-bold text-slate-900 dark:text-slate-100">
                        {formatCurrency(card.creditLimit, "AED", currLocale)}
                      </p>
                    </div>
                  )}
                </div>
                {card.type === "credit" && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>{locale === "ar" ? "المستخدم" : "Used"}</span>
                      <span>
                        {Math.round((card.currentBalance / card.creditLimit) * 100)}%
                      </span>
                    </div>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                      <div
                        className="h-full rounded-full bg-blue-500"
                        style={{
                          width: `${(card.currentBalance / card.creditLimit) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
