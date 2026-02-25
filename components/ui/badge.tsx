import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300",
        secondary:
          "border-transparent bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300",
        destructive:
          "border-transparent bg-danger-100 text-danger-800 dark:bg-danger-900 dark:text-danger-300",
        success:
          "border-transparent bg-success-100 text-success-700 dark:bg-success-900 dark:text-success-300",
        warning:
          "border-transparent bg-accent-100 text-accent-800 dark:bg-accent-900 dark:text-accent-300",
        outline:
          "border-slate-300 text-slate-700 dark:border-slate-600 dark:text-slate-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
