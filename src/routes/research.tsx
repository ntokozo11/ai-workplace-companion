import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { RotateCw, Search, Sparkles, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  CopyButton,
  EmptyState,
  ErrorState,
  LoadingState,
  PageHeader,
  Panel,
} from "@/components/ai-ui";
import { generateResearch, type ResearchResult } from "@/lib/ai.functions";
import { recordResearch } from "@/lib/session-stats";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant | AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Summarise topics, extract key findings and get practical workplace recommendations with AI research briefings.",
      },
      { property: "og:title", content: "AI Research Assistant" },
      {
        property: "og:description",
        content: "Structured AI research briefings for busy professionals.",
      },
    ],
  }),
  component: Research;
});

const DEPTHS = ["Quick Overview", "Standard", "Detailed"] as const;
const SAMPLES = [
  "How can AI improve productivity in modern workplaces?",
  "Explain how hybrid work affects team collaboration.",
  "What are effective strategies for managing competing deadlines?",
];

function Research() {
  const run = useServerFn(generateResearch);
  const [topic, setTopic] = useState("");
  const [depth, setDepth] = useState<(typeof DEPTHS)[number]>("Standard");
  const [result, setResult] = useState<ResearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);

  async function generate() {
    if (topic.trim().length < 3) {
      setError("Please enter a topic or question to research.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await run({ data: { topic, depth } });
      setResult(data);
      setEditing(false);
      recordResearch(topic.trim().slice(0, 80));
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

  const asText = () =>
    result
      ? [
          `Research: ${topic}`,
          "",
          `Summary\n${result.summary}`,
          "",
          `Key Findings\n${result.keyFindings.map((k) => `- ${k}`).join("\n")}`,
          "",
          `Workplace Insights\n${result.workplaceInsights}`,
          "",
          `Recommendations\n${result.recommendations.map((k) => `- ${k}`).join("\n")}`,
          "",
          `Potential Risks / Limitations\n${result.risks.map((k) => `- ${k}`).join("\n")}`,
          "",
          `Sources / Verification\n${result.verification}`,
        ].join("\n")
      : "";

  const listField = (key: "keyFindings" | "recommendations" | "risks") => (value: string) =>
    setResult((prev) =>
      prev ? { ...prev, [key]: value.split("\n").filter((l) => l.trim().length > 0) } : prev,
    );

  return (
    <div className="space-y-6">
      <PageHeader
        icon={<Search className="size-5" aria-hidden="true" />}
        title="AI Research Assistant"
        description="Research a topic, question or pasted article and get a structured workplace briefing."
      />

      <Panel label="Your input" title="Research topic">
        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="topic">Topic, question or article text</Label>
            <Textarea
              id="topic"
              rows={7}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Explain how artificial intelligence is changing workplace productivity."
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {SAMPLES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setTopic(s)}
                className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-primary-soft hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                {s}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <span id="depth-label" className="text-sm font-medium">
              Research depth
            </span>
            <div role="radiogroup" aria-labelledby="depth-label" className="flex flex-wrap gap-2">
              {DEPTHS.map((d) => (
                <button
                  key={d}
                  type="button"
                  role="radio"
                  aria-checked={depth === d}
                  onClick={() => setDepth(d)}
                  className={`rounded-xl border px-4 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none ${
                    depth === d
                      ? "border-primary bg-primary-soft text-primary"
                      : "border-border bg-background text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <Button onClick={generate} disabled={loading} className="w-full sm:w-auto">
            <Sparkles className="size-4" aria-hidden="true" />
            {loading ? "Researching…" : "Research with AI"}
          </Button>
        </div>
      </Panel>

      <Panel
        label="AI output"
        title="Research briefing"
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
              <CopyButton getText={asText} />
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
            title="No research yet"
            description="Enter a topic or question to begin your research."
          />
        ) : (
          <div className="space-y-6">
            <Section title="Summary">
              {editing ? (
                <Textarea
                  aria-label="Summary"
                  rows={4}
                  value={result.summary}
                  onChange={(e) =>
                    setResult((p) => (p ? { ...p, summary: e.target.value } : p))
                  }
                />
              ) : (
                <p className="text-sm whitespace-pre-wrap text-muted-foreground">
                  {result.summary}
                </p>
              )}
            </Section>

            <Section title="Key Findings">
              {editing ? (
                <Textarea
                  aria-label="Key findings, one per line"
                  rows={5}
                  value={result.keyFindings.join("\n")}
                  onChange={(e) => listField("keyFindings")(e.target.value)}
                />
              ) : (
                <Bullets items={result.keyFindings} />
              )}
            </Section>

            <Section title="Workplace Insights">
              {editing ? (
                <Textarea
                  aria-label="Workplace insights"
                  rows={4}
                  value={result.workplaceInsights}
                  onChange={(e) =>
                    setResult((p) => (p ? { ...p, workplaceInsights: e.target.value } : p))
                  }
                />
              ) : (
                <p className="text-sm whitespace-pre-wrap text-muted-foreground">
                  {result.workplaceInsights}
                </p>
              )}
            </Section>

            <Section title="Recommendations">
              {editing ? (
                <Textarea
                  aria-label="Recommendations, one per line"
                  rows={5}
                  value={result.recommendations.join("\n")}
                  onChange={(e) => listField("recommendations")(e.target.value)}
                />
              ) : (
                <Bullets items={result.recommendations} />
              )}
            </Section>

            <Section title="Potential Risks / Limitations">
              {editing ? (
                <Textarea
                  aria-label="Risks and limitations, one per line"
                  rows={4}
                  value={result.risks.join("\n")}
                  onChange={(e) => listField("risks")(e.target.value)}
                />
              ) : (
                <Bullets items={result.risks} />
              )}
            </Section>

            <div className="rounded-xl border border-primary/25 bg-primary-softer p-5">
              <h3 className="text-sm font-semibold">Sources / Verification</h3>
              <p className="mt-2 text-sm text-muted-foreground">{result.verification}</p>
            </div>
          </div>
        )}
      </Panel>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold">{title}</h3>
      {children}
    </div>
  );
}

function Bullets({ items }: { items: string[] }) {
  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">No items provided.</p>;
  }
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2 text-sm text-muted-foreground">
          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
