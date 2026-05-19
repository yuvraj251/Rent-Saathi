"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function Sheet({ children }: SheetProps) {
  return <>{children}</>;
}

export function SheetTrigger({
  children,
  onClick,
  className,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  );
}

export function SheetContent({
  children,
  open,
  onClose,
  className,
  side = "right",
}: {
  children: React.ReactNode;
  open: boolean;
  onClose: () => void;
  className?: string;
  side?: "left" | "right";
}) {
  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/50"
        onClick={onClose}
      />
      <div
        className={cn(
          "fixed inset-y-0 z-50 w-3/4 max-w-sm bg-background p-6 shadow-lg transition-transform",
          side === "right" ? "right-0" : "left-0",
          className
        )}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100"
        >
          <X className="h-4 w-4" />
        </button>
        {children}
      </div>
    </>
  );
}
