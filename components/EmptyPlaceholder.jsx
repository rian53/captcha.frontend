import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function EmptyPlaceholder({
  children,
  className,
  ...props
}) {
  return (
    <div
      className={cn(
        "flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50",
        className
      )}
      {...props}
    >
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        {children}
      </div>
    </div>
  );
}

EmptyPlaceholder.Icon = function EmptyPlaceholderIcon({
  children,
  className,
  ...props
}) {
  return (
    <div
      className={cn(
        "flex h-20 w-20 items-center justify-center rounded-full bg-muted",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

EmptyPlaceholder.Title = function EmptyPlaceholderTitle({
  children,
  className,
  ...props
}) {
  return (
    <h3
      className={cn("mt-6 text-xl font-semibold", className)}
      {...props}
    >
      {children}
    </h3>
  );
};

EmptyPlaceholder.Description = function EmptyPlaceholderDescription({
  children,
  className,
  ...props
}) {
  return (
    <p
      className={cn("mt-3 mb-8 text-center text-sm font-normal leading-6 text-muted-foreground", className)}
      {...props}
    >
      {children}
    </p>
  );
};

EmptyPlaceholder.Action = function EmptyPlaceholderAction({
  children,
  className,
  ...props
}) {
  return (
    <Button
      className={className}
      {...props}
    >
      {children}
    </Button>
  );
}; 