import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { CalendarClock, RotateCw, Sparkles, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  CopyButton,
  EmptyState,
  ErrorState,
  LoadingState,
  PageHeader,
  Panel,
  PriorityBadge,
} from "@/components/ai-ui";
import { generatePlan, type PlanItem, type PlanResult } from "@/lib/ai.functions";
import { recordPlan } from "@/lib/session-stats";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner | AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Turn a list of workplace tasks into a realistic, prioritised daily schedule with AI-generated reasoning.",
      },
      { property: "og:title", content: "AI Task Planner" },
      {
        property: "og:description",
        content: "Generate a prioritised, realistic daily work schedule with AI.",
      },
    ],
  }),
  component: Planner,
});

const SAMPLE = `Complete monthly report
Respond to client emails
Prepare presentation
Attend team meeting
Review project progress`;

const PRIORITIES = ["High", "Medium", "Low"] as const;

function Planner() {
  const run = useServerFn(generatePlan);

  const [tasks, setTasks] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [breakMinutes, setBreakMinutes] = useState(30);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [priority, setPriority] = useState<(typeof PRIORITIES)[number]>("High");

  const [result, setResult] = useState<PlanResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);

  async function generate() {
    if (tasks.trim().length < 3) {
      setError("Please enter at least one task before generating a schedule.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await run({
        data: { tasks, startTime, endTime, breakMinutes, date, priority },
      });
      setResult(data);
      setEditing(false);
      recordPlan(
        data.schedule.length,
        data.schedule.filter((i) => i.priority?.toLowerCase() === "high").length,
        `${data.schedule.length} tasks scheduled for ${date}`,
      );
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "We couldn't generate a response right now. Please check your connection and try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  function updateItem(index: number, patch: Partial<PlanItem>) {
    setResult((prev) =>
      prev
        ? {
            ...prev,
            schedule: prev.schedule.map((item, i) => (i === index ? { ...item, ...patch } : item)),
          }
        : prev,
    );
  }

  const asText = () =>
    result
      ? [
          `Schedule for ${date} (${startTime}–${endTime})`,
          "",
          ...result.schedule.map(
            (i) =>
              `${i.suggestedTime} — ${i.task} [${i.priority}, ${i.duration}]\n  Why: ${i.reason}`,
          ),
          "",
          "AI Planning Notes:",
          result.notes,
        ].join("\n")
      : "";

  return (
    <div className="space-y-6">
      <PageHeader
        icon={<CalendarClock className="size-5" aria-hidden="true" />}
        title="AI Task Planner"
        description="Enter your workplace tasks and let AI build a realistic, prioritised schedule."
      />

      <Panel
        label="Your input"
        title="Tasks & preferences"
        actions={
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setTasks(SAMPLE)}
          >
            Use sample tasks
          </Button>
        }
      >
        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="tasks">Task description</Label>
            <Textarea
              id="tasks"
              value={tasks}
              onChange={(e) => setTasks(e.target.value)}
              rows={7}
              placeholder="Finish the monthly report, respond to client emails, prepare for tomorrow's meeting, update the project spreadsheet and review the team's progress."
            />
            <p className="text-xs text-muted-foreground">
              List one task per line or write them as a sentence — the AI will separate them.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="start">Work start time</Label>
              <Input
                id="start"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end">Work end time</Label>
              <Input
                id="end"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="break">Break duration (minutes)</Label>
              <Input
                id="break"
                type="number"
                min={0}
                max={180}
                value={breakMinutes}
                onChange={(e) => setBreakMinutes(Number(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Planning date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <span id="priority-label" className="text-sm font-medium">
                Priority preference
              </span>
              <div
                role="radiogroup"
                aria-labelledby="priority-label"
                className="flex flex-wrap gap-2"
              >
                {PRIORITIES.map((p) => (
                  <button
                    key={p}
                    type="button"
                    role="radio"
                    aria-checked={priority === p}
                    onClick={() => setPriority(p)}
                    className={`rounded-xl border px-4 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none ${
                      priority === p
                        ? "border-primary bg-primary-soft text-primary"
                        : "border-border bg-background text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={generate} disabled={loading} className="w-full sm:w-auto">
              <Sparkles className="size-4" aria-hidden="true" />
              {loading ? "Generating…" : "Generate My Schedule"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setTasks("");
                setResult(null);
                setError(null);
              }}
            >
              Clear input
            </Button>
          </div>
        </div>
      </Panel>

      <Panel
        label="AI output"
        title="Your generated schedule"
        actions={
          result && (
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={() => setEditing((v) => !v)}>
                {editing ? "Done editing" : "Edit"}
              </Button>
              <Button size="sm" variant="outline" onClick={generate} disabled={loading}>
                <RotateCw className="size-4" aria-hidden="true" />
                Regenerate
              </Button>
              <CopyButton getText={asText} label="Copy Schedule" />
              <Button size="sm" variant="outline" onClick={() => setResult(null)}>
                <Trash2 className="size-4" aria-hidden="true" />
                Clear
              </Button>
            </div>
          )
        }
      >
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} onRetry={generate} />
        ) : !result ? (
          <EmptyState
            title="No schedule created yet"
            description="Add your tasks above to generate an AI-powered plan."
          />
        ) : (
          <div className="space-y-5">
            <div className="hidden overflow-hidden rounded-xl border border-border md:block">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/60 text-xs tracking-wide text-muted-foreground uppercase">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-semibold">Time</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Task</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Priority</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Duration</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Reason</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {result.schedule.map((item, i) => (
                    <tr key={i} className="align-top">
                      <td className="px-4 py-3 font-medium whitespace-nowrap">
                        {editing ? (
                          <Input
                            aria-label={`Suggested time for task ${i + 1}`}
                            value={item.suggestedTime}
                            onChange={(e) => updateItem(i, { suggestedTime: e.target.value })}
                          />
                        ) : (
                          item.suggestedTime
                        )}
                      </td>
                      <td className="px-4 py-3 font-medium">
                        {editing ? (
                          <Input
                            aria-label={`Task name ${i + 1}`}
                            value={item.task}
                            onChange={(e) => updateItem(i, { task: e.target.value })}
                          />
                        ) : (
                          item.task
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {editing ? (
                          <select
                            aria-label={`Priority for task ${i + 1}`}
                            value={item.priority}
                            onChange={(e) =>
                              updateItem(i, { priority: e.target.value as PlanItem["priority"] })
                            }
                            className="rounded-lg border border-input bg-background px-2 py-2 text-sm"
                          >
                            {PRIORITIES.map((p) => (
                              <option key={p} value={p}>
                                {p}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <PriorityBadge priority={item.priority} />
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                        {editing ? (
                          <Input
                            aria-label={`Duration for task ${i + 1}`}
                            value={item.duration}
                            onChange={(e) => updateItem(i, { duration: e.target.value })}
                          />
                        ) : (
                          item.duration
                        )}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {editing ? (
                          <Textarea
                            aria-label={`Reason for task ${i + 1}`}
                            rows={2}
                            value={item.reason}
                            onChange={(e) => updateItem(i, { reason: e.target.value })}
                          />
                        ) : (
                          item.reason
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <ul className="space-y-3 md:hidden">
              {result.schedule.map((item, i) => (
                <li key={i} className="rounded-xl border border-border bg-background p-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold">{item.suggestedTime}</span>
                    <PriorityBadge priority={item.priority} />
                  </div>
                  {editing ? (
                    <div className="mt-3 space-y-2">
                      <Input
                        aria-label={`Task name ${i + 1}`}
                        value={item.task}
                        onChange={(e) => updateItem(i, { task: e.target.value })}
                      />
                      <Input
                        aria-label={`Suggested time for task ${i + 1}`}
                        value={item.suggestedTime}
                        onChange={(e) => updateItem(i, { suggestedTime: e.target.value })}
                      />
                      <Input
                        aria-label={`Duration for task ${i + 1}`}
                        value={item.duration}
                        onChange={(e) => updateItem(i, { duration: e.target.value })}
                      />
                      <Textarea
                        aria-label={`Reason for task ${i + 1}`}
                        rows={2}
                        value={item.reason}
                        onChange={(e) => updateItem(i, { reason: e.target.value })}
                      />
                    </div>
                  ) : (
                    <>
                      <p className="mt-2 font-medium">{item.task}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Estimated duration: {item.duration}
                      </p>
                      <p className="mt-2 text-sm text-muted-foreground">{item.reason}</p>
                    </>
                  )}
                </li>
              ))}
            </ul>

            <div className="rounded-xl border border-primary/25 bg-primary-softer p-5">
              <h3 className="text-sm font-semibold">AI Planning Notes</h3>
              {editing ? (
                <Textarea
                  aria-label="AI planning notes"
                  className="mt-2"
                  rows={5}
                  value={result.notes}
                  onChange={(e) =>
                    setResult((prev) => (prev ? { ...prev, notes: e.target.value } : prev))
                  }
                />
              ) : (
                <p className="mt-2 text-sm whitespace-pre-wrap text-muted-foreground">
                  {result.notes}
                </p>
              )}
            </div>
          </div>
        )}
      </Panel>
    </div>
  );
}
