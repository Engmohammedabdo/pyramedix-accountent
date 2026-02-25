import type { Metadata } from "next";
import { Inter, Tajawal } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "700", "800"],
  variable: "--font-tajawal",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PyramediaX Accountant",
  description: "Integrated financial dashboard for PyramediaX",
};

const locales = ["ar", "en"] as const;

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!locales.includes(locale as any)) notFound();

  let messages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch {
    notFound();
  }

  const isRTL = locale === "ar";

  return (
    <html
      lang={locale}
      dir={isRTL ? "rtl" : "ltr"}
      className={`${inter.variable} ${tajawal.variable}`}
      suppressHydrationWarning
    >
      <body
        className={`min-h-screen bg-slate-50 antialiased dark:bg-slate-900 ${
          isRTL ? "font-tajawal" : "font-inter"
        }`}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <div className="flex min-h-screen">
            {/* Sidebar */}
            <Sidebar locale={locale} />

            {/* Main Content */}
            <div className="flex flex-1 flex-col ps-64">
              <Topbar locale={locale} />
              <main className="flex-1 p-6">{children}</main>
            </div>
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
