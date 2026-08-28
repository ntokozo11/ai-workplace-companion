import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, EyeOff, Scale, ShieldCheck, UserCheck } from "lucide-react";
import { PageHeader } from "@/components/ai-ui";

export const Route = createFileRoute("/responsible-ai")({
  head: () => ({
    meta: [
      { title: "Responsible AI | AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "How to use AI responsibly at work: verify outputs, protect confidential data and keep humans in the decision loop.",
      },
      { property: "og:title", content: "Responsible AI Guidance" },
      {
        property: "og:description",
        content: "Guidance for using AI-generated workplace content safely and responsibly.",
      },
    ],
  }),
  component: ResponsibleAI,
});

const POINTS = [
  {
    icon: AlertTriangle,
    title: "AI can be wrong",
    body: "AI-generated content may contain mistakes, outdated details or confident-sounding errors. Treat every output as a draft, not a fact.",
  },
  {
    icon: UserCheck,
    title: "Verify before you rely",
    body: "Check important information against trusted internal documents, colleagues or authoritative sources before acting on it.",
  },
  {
    icon: ShieldCheck,
    title: "Support, don't replace, human judgement",
    body: "AI should speed up thinking and drafting. The final decision, and accountability for it, stays with you.",
  },
  {
    icon: EyeOff,
    title: "Keep sensitive data out",
    body: "Do not enter confidential company information, client data, credentials or personal details about yourself or others.",
  },
  {
    icon: Scale,
    title: "Not professional advice",
    body: "This assistant is not a substitute for qualified legal, medical, financial, HR or other professional advice. Consult a qualified professional for high-stakes matters.",
  },
];

function ResponsibleAI() {
  return (
    <div className="space-y-6">
      <PageHeader
        icon={<ShieldCheck className="size-5" aria-hidden="true" />}
        title="About & Responsible AI"
        description="How this assistant works and how to use it safely in a professional environment."
      />

      <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
        <h2 className="text-lg font-semibold">About this application</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The AI Workplace Productivity Assistant helps professionals plan their day, research
          topics and get practical workplace guidance. It runs entirely in your browser session —
          there is no account, no login and no database. Nothing you type is stored permanently, and
          your session data disappears when you refresh or close the tab. AI requests are sent
          securely from the server so that no API key is ever exposed in the browser.
        </p>
      </section>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {POINTS.map(({ icon: Icon, title, body }) => (
          <section key={title} className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <h3 className="mt-4 font-semibold">{title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{body}</p>
          </section>
        ))}
      </div>

      <section className="rounded-2xl border border-primary/25 bg-primary-softer p-6">
        <h2 className="text-base font-semibold">Review before professional use</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Always read AI responses in full and edit them before sending them to colleagues, clients
          or leadership. AI-generated content may contain errors. Review and verify important
          information before using it for workplace decisions.
        </p>
      </section>
    </div>
  );
}
