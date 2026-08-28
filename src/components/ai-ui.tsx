import { AlertTriangle, Check, Copy, Loader2 } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon?: ReactNode;
}) {
  return (
    <div className="mb-6 flex items-start gap-3">
      {icon && (
        <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
          {icon}
        </span>
      )}
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

export function Panel({
  label,
  title,
  children,
  className,
  actions,
}: {
  label: string;
  title: string;
  children: ReactNode;
  className?: string;
  actions?: ReactNode;
}) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-border bg-card p-5 shadow-card sm:p-6",
        className,
      )}
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[0.68rem] font-semibold tracking-[0.14em] text-primary uppercase">
            {label}
          </p>
          <h2 className="mt-1 text-lg font-semibold">{title}</h2>
        </div>
        {actions}
      </div>
      {children}
    </section>
  );
}

export function LoadingState({ message = "AI is analysing your request…" }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-primary/35 bg-primary-softer px-6 py-12 text-center">
      <Loader2 className="size-6 animate-spin text-primary" aria-hidden="true" />
      <p className="text-sm font-medium text-foreground" role="status" aria-live="polite">
        {message}
      </p>
      <p className="text-xs text-muted-foreground">This usually takes a few seconds.</p>
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div
      role="alert"
      className="rounded-xl border border-destructive/30 bg-destructive/5 px-5 py-6 text-center"
    >
      <AlertTriangle className="mx-auto size-5 text-destructive" aria-hidden="true" />
      <p className="mt-2 text-sm font-medium text-foreground">{message}</p>
      <Button onClick={onRetry} variant="outline" className="mt-4">
        Try Again
      </Button>
    </div>
  );
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-muted/40 px-6 py-12 text-center">
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

export function CopyButton({ getText, label = "Copy" }: { getText: () => string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(getText());
          setCopied(true);
          setTimeout(() => setCopied(false), 1800);
        } catch {
          setCopied(false);
        }
      }}
    >
      {copied ? (
        <Check className="size-4" aria-hidden="true" />
      ) : (
        <Copy className="size-4" aria-hidden="true" />
      )}
      {copied ? "Copied" : label}
    </Button>
  );
}

export function PriorityBadge({ priority }: { priority: string }) {
  const p = priority?.toLowerCase();
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        p === "high" && "bg-destructive/10 text-destructive",
        p === "medium" && "bg-warning/15 text-foreground",
        p !== "high" && p !== "medium" && "bg-primary-soft text-primary",
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          p === "high" && "bg-destructive",
          p === "medium" && "bg-warning",
          p !== "high" && p !== "medium" && "bg-primary",
        )}
        aria-hidden="true"
      />
      {priority}
    </span>
  );
}
