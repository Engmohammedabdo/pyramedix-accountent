"use client";

import { useTranslations } from "next-intl";
import { Bell, LogOut, User } from "lucide-react";
import { LanguageToggle } from "./language-toggle";
import { ThemeToggle } from "./theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TopbarProps {
  locale: string;
}

export function Topbar({ locale }: TopbarProps) {
  const t = useTranslations();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-6 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80">
      {/* Left side — Page context / breadcrumb area */}
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          {t("app.name")}
        </h2>
      </div>

      {/* Right side — Controls */}
      <div className="flex items-center gap-3">
        <LanguageToggle locale={locale} />
        <ThemeToggle />

        {/* Notifications */}
        <button className="relative rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200">
          <Bell className="h-5 w-5" />
          <span className="absolute end-1.5 top-1.5 h-2 w-2 rounded-full bg-danger-500" />
        </button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-lg p-1.5 text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300">
                <User className="h-4 w-4" />
              </div>
              <span className="hidden text-sm font-medium sm:inline-block">
                Mohammed
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Mohammed</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="me-2 h-4 w-4" />
              {t("settings.profile")}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-danger-600">
              <LogOut className="me-2 h-4 w-4" />
              {t("auth.logout")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
