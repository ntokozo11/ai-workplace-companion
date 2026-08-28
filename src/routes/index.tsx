import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  CalendarClock,
  Flame,
  ListChecks,
  MessagesSquare,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ai-ui";
import { useSessionStats } from "@/lib/session-stats";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard | AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Plan your day, research topics and get practical workplace answers with an AI productivity assistant.",
      },
      { property: "og:title", content: "AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content: "Work smarter. Plan better. Research faster — with AI built for the workplace.",
      },
    ],
  }),
  component: Dashboard,
});

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function Dashboard() {
  const stats = useSessionStats();

  const cards = [
    { label: "Tasks Planned", value: stats.tasksPlanned, icon: ListChecks },
    { label: "High Priority Tasks", value: stats.highPriority, icon: Flame },
    { label: "Research Requests", value: stats.researchRequests, icon: Search },
    { label: "AI Conversations", value: stats.conversations, icon: MessagesSquare },
  ];

  const quick = [
    {
      title: "Plan My Day",
      body: "Create an organised schedule based on your tasks and priorities.",
      cta: "Start Planning",
      to: "/planner" as const,
      icon: CalendarClock,
    },
    {
      title: "Research a Topic",
      body: "Summarise information and generate useful workplace insights.",
      cta: "Start Research",
      to: "/research" as const,
      icon: Search,
    },
    {
      title: "Ask the AI Assistant",
      body: "Get practical answers to workplace questions.",
      cta: "Open Chat",
      to: "/chat" as const,
      icon: MessagesSquare,
    },
  ];

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-border bg-primary-softer p-6 shadow-soft sm:p-8">
        <p className="text-sm font-semibold text-primary">{greeting()}! 👋</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          Your AI Workplace Productivity Assistant
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Use AI to plan your work, research information, and get practical workplace assistance.
        </p>
      </section>

      <section aria-label="Productivity overview">
        <h2 className="mb-3 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
          Productivity overview
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="rounded-2xl border border-border bg-card p-5 shadow-card"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">{label}</span>
                <Icon className="size-4 text-primary" aria-hidden="true" />
              </div>
              <p className="mt-3 text-3xl font-bold tracking-tight">{value}</p>
              <p className="mt-1 text-xs text-muted-foreground">This session</p>
            </div>
          ))}
        </div>
      </section>

      <section aria-label="Quick actions">
        <h2 className="mb-3 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
          Quick actions
        </h2>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {quick.map(({ title, body, cta, to, icon: Icon }) => (
            <div
              key={title}
              className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-card transition-shadow hover:shadow-lg"
            >
              <span className="flex size-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-lg font-semibold">{title}</h3>
              <p className="mt-1 flex-1 text-sm text-muted-foreground">{body}</p>
              <Button asChild className="mt-5 w-full sm:w-auto">
                <Link to={to}>{cta}</Link>
              </Button>
            </div>
          ))}
        </div>
      </section>

      <section aria-label="Recent activity">
        <h2 className="mb-3 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
          Recent activity
        </h2>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-card sm:p-6">
          {stats.activity.length === 0 ? (
            <EmptyState
              title="No activity yet in this session"
              description="Generate a schedule, run a research request or chat with the assistant and your recent activity will appear here."
            />
          ) : (
            <ul className="divide-y divide-border">
              {stats.activity.map((a) => (
                <li key={a.id} className="flex items-start gap-3 py-3">
                  <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
                    <Activity className="size-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{a.label}</p>
                    <p className="truncate text-xs text-muted-foreground">{a.detail}</p>
                  </div>
                  <span className="ml-auto shrink-0 text-xs text-muted-foreground">
                    {new Date(a.at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
