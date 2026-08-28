import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-3.7-flash";

type ChatMsg = { role: "system" | "user" | "assistant"; content: string };

async function callGateway(messages: ChatMsg[], jsonMode = false): Promise<string> {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("AI is not configured.");

  const res = await fetch(GATEWAY, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": key,
      "X-Lovable-AIG-SDK": "fetch",
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      ...(jsonMode ? { response_format: { type: "json_object" } } : {}),
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    if (res.status === 429) throw new Error("The AI service is busy right now. Please try again in a moment.");
    if (res.status === 402) throw new Error("AI credits have run out for this workspace. Please add credits to continue.");
    throw new Error(`We couldn't generate a response right now. (${res.status}) ${text.slice(0, 180)}`);
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = data.choices?.[0]?.message?.content?.trim();
  if (!content) throw new Error("The AI returned an empty response. Please try again.");
  return content;
}

function parseJson<T>(raw: string): T {
  const cleaned = raw
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/, "")
    .trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  const slice = start >= 0 && end > start ? cleaned.slice(start, end + 1) : cleaned;
  return JSON.parse(slice) as T;
}

/* ---------------- Task Planner ---------------- */

const PlanInput = z.object({
  tasks: z.string().min(3),
  startTime: z.string(),
  endTime: z.string(),
  breakMinutes: z.number(),
  date: z.string(),
  priority: z.enum(["High", "Medium", "Low"]),
});

export type PlanItem = {
  task: string;
  priority: "High" | "Medium" | "Low";
  suggestedTime: string;
  duration: string;
  reason: string;
};
export type PlanResult = { schedule: PlanItem[]; notes: string };

const PLANNER_SYSTEM = `You are a professional workplace planning assistant used inside a productivity SaaS tool.

ROLE: Expert time-management and scheduling planner for knowledge workers.
OBJECTIVE: Turn a free-form list of workplace tasks into a realistic, prioritised daily schedule.

REQUIREMENTS:
1. Identify every distinct task from the user's text.
2. Assign each task a priority of High, Medium or Low.
3. Estimate a realistic completion time for each task.
4. Order tasks logically, front-loading High priority and deadline-driven work.
5. Respect the user's working hours; never schedule outside them and never overlap tasks.
6. Insert reasonable breaks using the requested break duration.
7. Do not create unrealistic or over-packed schedules; if there is not enough time, say so in the notes and defer the lowest-value tasks.
8. In "notes", explain in 3-6 short sentences why high-priority tasks were placed first and any assumptions or trade-offs.

TONE: Clear, concise, professional. No filler.
ACCURACY: Do not invent tasks, deadlines or facts the user did not supply. State assumptions explicitly in the notes.
SAFETY: Do not give legal, medical, financial or HR determinations; recommend professional verification if a task touches those areas.

OUTPUT: Return ONLY valid JSON with this exact shape:
{"schedule":[{"task":string,"priority":"High"|"Medium"|"Low","suggestedTime":string,"duration":string,"reason":string}],"notes":string}
"suggestedTime" must be a time range like "09:00 - 10:30". Breaks may appear as schedule items with priority "Low".`;

export const generatePlan = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => PlanInput.parse(d))
  .handler(async ({ data }): Promise<PlanResult> => {
    const user = `Planning date: ${data.date}
Working hours: ${data.startTime} to ${data.endTime}
Break duration: ${data.breakMinutes} minutes
Priority preference (bias toward this level when ambiguous): ${data.priority}

Tasks provided by the user:
"""
${data.tasks}
"""`;

    const raw = await callGateway(
      [
        { role: "system", content: PLANNER_SYSTEM },
        { role: "user", content: user },
      ],
      true,
    );

    try {
      const parsed = parseJson<PlanResult>(raw);
      if (!Array.isArray(parsed.schedule)) throw new Error("bad shape");
      return { schedule: parsed.schedule, notes: parsed.notes ?? "" };
    } catch {
      throw new Error("The AI response could not be read as a schedule. Please try again.");
    }
  });

/* ---------------- Research Assistant ---------------- */

const ResearchInput = z.object({
  topic: z.string().min(3),
  depth: z.enum(["Quick Overview", "Standard", "Detailed"]),
});

export type ResearchResult = {
  summary: string;
  keyFindings: string[];
  workplaceInsights: string;
  recommendations: string[];
  risks: string[];
  verification: string;
};

const RESEARCH_SYSTEM = `You are a professional workplace research assistant inside a productivity SaaS tool.

ROLE: Analyst who explains topics clearly for busy professionals.
OBJECTIVE: Produce a structured, decision-useful briefing on the user's topic, question or pasted article text.

REQUIREMENTS:
- Base the answer strictly on the user's actual input.
- Separate fact from interpretation, and flag uncertainty plainly.
- You have NO web access and NO source retrieval. Never invent citations, URLs, statistics with false precision, or named studies.
- In "verification" always return exactly: "AI-generated information should be independently verified before being used for important decisions."

DEPTH: "Quick Overview" = brief and punchy; "Standard" = balanced; "Detailed" = thorough with nuance.
TONE: Professional, neutral, practical.
SAFETY: No legal, medical, financial or HR advice; recommend qualified professional review where relevant.

OUTPUT: Return ONLY valid JSON:
{"summary":string,"keyFindings":string[],"workplaceInsights":string,"recommendations":string[],"risks":string[],"verification":string}`;

export const generateResearch = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => ResearchInput.parse(d))
  .handler(async ({ data }): Promise<ResearchResult> => {
    const raw = await callGateway(
      [
        { role: "system", content: RESEARCH_SYSTEM },
        {
          role: "user",
          content: `Research depth: ${data.depth}\n\nTopic / question / text:\n"""\n${data.topic}\n"""`,
        },
      ],
      true,
    );
    try {
      const p = parseJson<ResearchResult>(raw);
      return {
        summary: p.summary ?? "",
        keyFindings: p.keyFindings ?? [],
        workplaceInsights: p.workplaceInsights ?? "",
        recommendations: p.recommendations ?? [],
        risks: p.risks ?? [],
        verification:
          "AI-generated information should be independently verified before being used for important decisions.",
      };
    } catch {
      throw new Error("The AI response could not be read. Please try again.");
    }
  });

/* ---------------- Chatbot ---------------- */

const ChatInput = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      }),
    )
    .min(1),
});

const CHAT_SYSTEM = `You are the AI Workplace Productivity Assistant, a professional assistant for workplace planning, communication and problem solving.

ROLE: Practical, senior colleague who helps people get work done.
OBJECTIVE: Answer the user's actual message with specific, actionable help.

BEHAVIOUR:
- Give clear, useful answers; use short paragraphs, numbered steps or bullets where they help.
- Ask a clarifying question when the request is genuinely ambiguous.
- Help with prioritisation, planning, drafting professional communication, organising ideas and analysing workplace problems.
- Keep the full conversation context in mind so follow-up questions make sense.
- Never pretend to know facts you do not know; say what is uncertain.
- Do not make legal, financial, medical or HR decisions for the user; outline options and recommend qualified professional verification for high-stakes matters.
- Never ask for confidential company data or personal identifying information.

TONE: Professional, warm, concise. Format with light markdown-free plain text (use "-" for bullets and "1." for steps).`;

export const chatWithAssistant = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => ChatInput.parse(d))
  .handler(async ({ data }): Promise<{ reply: string }> => {
    const reply = await callGateway([
      { role: "system", content: CHAT_SYSTEM },
      ...data.messages.slice(-20),
    ]);
    return { reply };
  });
