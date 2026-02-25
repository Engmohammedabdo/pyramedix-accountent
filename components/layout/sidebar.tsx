"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  LayoutDashboard,
  Users,
  FileText,
  Banknote,
  RefreshCw,
  CreditCard,
  Upload,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { isRTL } from "@/lib/constants";

const iconMap = {
  LayoutDashboard,
  Users,
  FileText,
  Banknote,
  RefreshCw,
  CreditCard,
  Upload,
  Settings,
} as const;

interface NavItem {
  key: string;
  href: string;
  icon: keyof typeof iconMap;
}

const navItems: NavItem[] = [
  { key: "dashboard", href: "", icon: "LayoutDashboard" },
  { key: "clients", href: "/clients", icon: "Users" },
  { key: "contracts", href: "/contracts", icon: "FileText" },
  { key: "transactions", href: "/transactions", icon: "Banknote" },
  { key: "subscriptions", href: "/subscriptions", icon: "RefreshCw" },
  { key: "cards", href: "/cards", icon: "CreditCard" },
  { key: "upload", href: "/upload", icon: "Upload" },
  { key: "settings", href: "/settings", icon: "Settings" },
];

interface SidebarProps {
  locale: string;
}

export function Sidebar({ locale }: SidebarProps) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const rtl = isRTL(locale);

  const CollapseIcon = rtl
    ? collapsed
      ? ChevronLeft
      : ChevronRight
    : collapsed
    ? ChevronRight
    : ChevronLeft;

  return (
    <aside
      className={cn(
        "fixed top-0 start-0 z-40 flex h-screen flex-col border-e border-slate-200 bg-white transition-all duration-300 dark:border-slate-800 dark:bg-slate-950",
        collapsed ? "w-[68px]" : "w-64"
      )}
    >
      {/* Logo / Brand */}
      <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4 dark:border-slate-800">
        {!collapsed && (
          <Link
            href={`/${locale}`}
            className="flex items-center gap-2 font-bold text-primary-600"
          >
            <span className="text-2xl">📊</span>
            <span className="text-sm">
              {rtl ? "محاسب بيراميديا" : "PyramediaX"}
            </span>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300",
            collapsed && "mx-auto"
          )}
        >
          <CollapseIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navItems.map((item) => {
          const Icon = iconMap[item.icon];
          const href = `/${locale}${item.href}`;
          const isActive =
            item.href === ""
              ? pathname === `/${locale}` || pathname === `/${locale}/`
              : pathname.startsWith(href);

          return (
            <Link
              key={item.key}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200",
                collapsed && "justify-center px-2"
              )}
              title={collapsed ? t(item.key) : undefined}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{t(item.key)}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-200 p-4 dark:border-slate-800">
        {!collapsed && (
          <p className="text-center text-xs text-slate-400">
            © 2026 Pyramedia
          </p>
        )}
      </div>
    </aside>
  );
}
