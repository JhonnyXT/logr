"use client";

import { cn } from "@/lib/utils/cn";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  subtitle,
  description,
  action,
  className,
}: PageHeaderProps) {
  const detail = subtitle ?? description;

  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6",
        className
      )}
    >
      <div className="min-w-0 space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h1>
        {detail ? (
          <p className="max-w-2xl text-sm text-muted sm:text-base">{detail}</p>
        ) : null}
      </div>
      {action ? (
        <div className="flex shrink-0 items-center gap-2 sm:pt-1">{action}</div>
      ) : null}
    </div>
  );
}
