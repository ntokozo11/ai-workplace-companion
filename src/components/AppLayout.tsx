import { Link, useRouterState } from "@tanstack/react-router";
import {
  BrainCircuit,
  CalendarClock,
  LayoutDashboard,
  Menu,
  MessagesSquare,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/planner", label: "AI Task Planner", icon: CalendarClock },
  { to: "/research", label: "AI Research Assistant", icon: Search },
  { to: "/chat", label: "AI Workplace Chatbot", icon: MessagesSquare },
  { to: "/responsible-ai", label: "About / Responsible AI", icon: ShieldCheck },
] as const;

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex h-full flex-col bg-sidebar">
      <div className="flex items-center gap-3 px-5 py-6">
        <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-soft">
          <BrainCircuit className="size-5" aria-hidden="true" />
        </span>
        <span className="text-[0.95rem] leading-tight font-bold text-sidebar-foreground">
          AI Workplace
          <span className="block text-xs font-medium text-muted-foreground">
            Productivity Assistant
          </span>
        </span>
      </div>

      <nav aria-label="Main navigation" className="flex-1 space-y-1 px-3">
        {NAV.map(({ to, label, icon: Icon }) => {
          const active = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none",
                active
                  ? "bg-sidebar-accent text-primary"
                  : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
              )}
            >
              <Icon className="size-[1.05rem] shrink-0" aria-hidden="true" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="m-3 rounded-xl bg-primary-soft p-4">
        <p className="text-sm font-semibold text-sidebar-foreground">
          AI Workplace Productivity Assistant
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Work smarter. Plan better. Research faster.
        </p>
      </div>
    </div>
  );
}

export function AppLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-sidebar-border lg:block">
        <SidebarContent />
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Close navigation menu"
            className="absolute inset-0 bg-foreground/40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[85%] border-r border-sidebar-border shadow-card">
            <button
              aria-label="Close navigation menu"
              onClick={() => setOpen(false)}
              className="absolute top-5 right-3 rounded-lg p-2 text-muted-foreground hover:bg-sidebar-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
            <SidebarContent onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/85 px-4 py-3 backdrop-blur lg:hidden">
          <button
            aria-label="Open navigation menu"
            aria-expanded={open}
            onClick={() => setOpen(true)}
            className="rounded-lg border border-border p-2 text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            <Menu className="size-4" aria-hidden="true" />
          </button>
          <span className="text-sm font-semibold">AI Workplace Productivity Assistant</span>
        </header>

        <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
          {children}
        </main>

        <footer className="border-t border-border bg-primary-softer px-4 py-5 sm:px-6 lg:px-10">
          <p className="mx-auto max-w-6xl text-center text-xs text-muted-foreground">
            AI-generated content may contain errors. Review and verify important information before
            using it for workplace decisions.
          </p>
        </footer>
      </div>
    </div>
  );
}
