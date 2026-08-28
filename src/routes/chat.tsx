import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Bot, MessagesSquare, Send, Trash2, User } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState, ErrorState, PageHeader } from "@/components/ai-ui";
import { chatWithAssistant } from "@/lib/ai.functions";
import { recordChat } from "@/lib/session-stats";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Workplace Chatbot | AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Ask practical workplace questions and get contextual, step-by-step AI guidance during your session.",
      },
      { property: "og:title", content: "AI Workplace Chatbot" },
      {
        property: "og:description",
        content: "A professional AI assistant for workplace planning, drafting and problem solving.",
      },
    ],
  }),
  component: Chat,
});

type Msg = { role: "user" | "assistant"; content: string; at: number };

const SUGGESTIONS = [
  "Help me prioritise my workload.",
  "Help me prepare for a team meeting.",
  "Draft a professional email requesting an extension.",
  "Give me strategies for managing deadlines.",
];

function Chat() {
  const run = useServerFn(chatWithAssistant);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: trimmed, at: Date.now() }];
    setMessages(next);
    setInput("");
    setError(null);
    setLoading(true);
    try {
      const { reply } = await run({
        data: { messages: next.map(({ role, content }) => ({ role, content })) },
      });
      setMessages((prev) => [...prev, { role: "assistant", content: reply, at: Date.now() }]);
      recordChat(trimmed.slice(0, 80));
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

  function retry() {
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    setError(null);
    if (lastUser) {
      setMessages((prev) => prev.filter((m) => m !== lastUser));
      void send(lastUser.content);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void send(input);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        icon={<MessagesSquare className="size-5" aria-hidden="true" />}
        title="AI Workplace Chatbot"
        description="Ask workplace questions and get practical, contextual guidance. Conversation lasts for this session only."
      />

      <section className="flex h-[70vh] min-h-[520px] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card">
        <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-5">
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary-soft text-primary">
              <Bot className="size-4" aria-hidden="true" />
            </span>
            <span className="text-sm font-semibold">Workplace Assistant</span>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setMessages([]);
              setError(null);
            }}
            disabled={messages.length === 0}
          >
            <Trash2 className="size-4" aria-hidden="true" />
            Clear conversation
          </Button>
        </header>

        <div
          className="flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-5"
          role="log"
          aria-live="polite"
          aria-label="Conversation"
        >
          {messages.length === 0 && !loading && (
            <div className="space-y-4">
              <EmptyState
                title="Start a conversation with your AI Workplace Assistant"
                description="Ask about prioritising work, preparing for meetings, drafting professional emails or solving workplace problems."
              />
              <div className="flex flex-wrap justify-center gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => void send(s)}
                    className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-primary-soft hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {m.role === "assistant" && (
                <span className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
                  <Bot className="size-4" aria-hidden="true" />
                </span>
              )}
              <div className={`max-w-[85%] sm:max-w-[75%] ${m.role === "user" ? "text-right" : ""}`}>
                <div
                  className={`rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "border border-border bg-background text-foreground"
                  }`}
                >
                  {m.content}
                </div>
                <p className="mt-1 px-1 text-[0.7rem] text-muted-foreground">
                  {new Date(m.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
              {m.role === "user" && (
                <span className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <User className="size-4" aria-hidden="true" />
                </span>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
                <Bot className="size-4" aria-hidden="true" />
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-2xl border border-border bg-background px-4 py-3">
                AI is analysing your request…
                <span className="ml-1 flex gap-1" aria-hidden="true">
                  <span className="size-1.5 animate-pulse rounded-full bg-primary" />
                  <span className="size-1.5 animate-pulse rounded-full bg-primary [animation-delay:150ms]" />
                  <span className="size-1.5 animate-pulse rounded-full bg-primary [animation-delay:300ms]" />
                </span>
              </span>
            </div>
          )}

          {error && (
            <ErrorState message={error} onRetry={retry} />
          )}

          <div ref={endRef} />
        </div>

        <form onSubmit={onSubmit} className="border-t border-border p-3 sm:p-4">
          <Label htmlFor="chat-input" className="sr-only">
            Your message
          </Label>
          <div className="flex items-end gap-2">
            <Textarea
              id="chat-input"
              rows={2}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void send(input);
                }
              }}
              placeholder="Ask a workplace question…"
              className="min-h-11 flex-1 resize-none"
            />
            <Button type="submit" disabled={loading || !input.trim()} aria-label="Send message">
              <Send className="size-4" aria-hidden="true" />
              <span className="hidden sm:inline">Send</span>
            </Button>
          </div>
          <p className="mt-2 text-[0.7rem] text-muted-foreground">
            Don't share confidential or personal information. Verify important answers.
          </p>
        </form>
      </section>
    </div>
  );
}
