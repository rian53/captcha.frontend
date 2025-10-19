import React from "react";
import { cn } from "@/lib/utils";

export function EmptyPlaceholder({
  icon,
  title,
  description,
  children,
  className,
}) {
  return (
    <div className={cn(
      "flex min-h-[400px] flex-col items-center justify-center rounded-md p-8 text-center animate-in fade-in-50",
      className
    )}>
      {icon && <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-4">
        {icon}
      </div>}
      {title && <h3 className="mt-2 text-lg font-semibold">{title}</h3>}
      {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      {children && <div className="mt-6 flex gap-2">{children}</div>}
    </div>
  );
} 