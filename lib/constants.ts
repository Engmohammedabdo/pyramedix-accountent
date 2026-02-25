export const APP_NAME = "PyramediaX Accountant";
export const APP_NAME_AR = "محاسب بيراميديا";

export const LOCALES = ["ar", "en"] as const;
export const DEFAULT_LOCALE = "ar" as const;

export type Locale = (typeof LOCALES)[number];

export const RTL_LOCALES: Locale[] = ["ar"];

export function isRTL(locale: string): boolean {
  return RTL_LOCALES.includes(locale as Locale);
}

export const CURRENCY = "AED";
export const TIMEZONE = "Asia/Dubai";

export const NAV_ITEMS = [
  { key: "dashboard", href: "/", icon: "LayoutDashboard" },
  { key: "clients", href: "/clients", icon: "Users" },
  { key: "contracts", href: "/contracts", icon: "FileText" },
  { key: "transactions", href: "/transactions", icon: "Banknote" },
  { key: "subscriptions", href: "/subscriptions", icon: "RefreshCw" },
  { key: "cards", href: "/cards", icon: "CreditCard" },
  { key: "upload", href: "/upload", icon: "Upload" },
  { key: "settings", href: "/settings", icon: "Settings" },
] as const;

export const PAGE_SIZE = 20;
