"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "primary" | "success" | "danger" | "warning";
}

const variantStyles = {
  default: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
  primary:
    "bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-400",
  success:
    "bg-success-100 text-success-600 dark:bg-success-900 dark:text-success-400",
  danger:
    "bg-danger-100 text-danger-600 dark:bg-danger-900 dark:text-danger-400",
  warning:
    "bg-accent-100 text-accent-600 dark:bg-accent-900 dark:text-accent-400",
};

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = "default",
}: StatCardProps) {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              {title}
            </p>
            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
              {value}
            </p>
            {subtitle && (
              <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                {subtitle}
              </p>
            )}
            {trend && (
              <div className="mt-2 flex items-center gap-1">
                <span
                  className={cn(
                    "text-xs font-medium",
                    trend.isPositive ? "text-success-600" : "text-danger-600"
                  )}
                >
                  {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
                </span>
              </div>
            )}
          </div>
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-xl",
              variantStyles[variant]
            )}
          >
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
