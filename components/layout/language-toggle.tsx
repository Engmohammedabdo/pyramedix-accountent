"use client";

import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface LanguageToggleProps {
  locale: string;
}

export function LanguageToggle({ locale }: LanguageToggleProps) {
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    // Replace the locale segment in the current path
    const segments = pathname.split("/");
    segments[1] = newLocale;
    const newPath = segments.join("/");
    router.push(newPath);
  };

  return (
    <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-700">
      <button
        onClick={() => switchLocale("ar")}
        className={cn(
          "rounded-s-lg px-3 py-1.5 text-xs font-medium transition-colors",
          locale === "ar"
            ? "bg-primary-600 text-white"
            : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
        )}
      >
        عربي
      </button>
      <button
        onClick={() => switchLocale("en")}
        className={cn(
          "rounded-e-lg px-3 py-1.5 text-xs font-medium transition-colors",
          locale === "en"
            ? "bg-primary-600 text-white"
            : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
        )}
      >
        EN
      </button>
    </div>
  );
}
