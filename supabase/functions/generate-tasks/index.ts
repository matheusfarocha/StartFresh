import "@supabase/functions-js/edge-runtime.d.ts"

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY")!
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent?key=${GEMINI_API_KEY}`

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
}

async function callGemini(prompt: string): Promise<string> {
  const res = await fetch(GEMINI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
    }),
  })
  if (!res.ok) throw new Error(await res.text())
  const data = await res.json()
  return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? ""
}

function extractJson(raw: string): string {
  return raw.replace(/```json?\n?/g, "").replace(/```/g, "").trim()
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const { action, answers, followUpAnswers } = await req.json() as {
      action: "questions" | "tasks"
      answers: Record<string, string | string[]>
      followUpAnswers?: Record<string, string>
    }

    const answersText = Object.entries(answers)
      .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`)
      .join("\n")

    // ── Generate 3 follow-up questions ───────────────────────────
    if (action === "questions") {
      const prompt = `You are an intake specialist for a NYC reentry program. Your job is to ask 3 questions that will directly help generate better actionable tasks for this person's roadmap.

Their onboarding answers:
${answersText}

Rules for your 3 questions:
1. Every question must UNLOCK a specific type of task. Before writing the question, think: "What task would I add to their roadmap based on each possible answer?" If you can't name a concrete task for each answer option, the question is useless — don't ask it.
2. Focus on high-impact gaps: health insurance status, work experience/skills, education level, transportation access, phone/internet access, immediate safety concerns. These directly determine which NYC programs they qualify for.
3. Do NOT ask about feelings, preferences, or anything subjective. Only ask about facts that determine program eligibility or resource matching.
4. Do NOT repeat anything already covered in their answers above.

Bad example: "How often do you report to your PO?" — this doesn't unlock any task.
Good example: "Do you have health insurance right now?" — this unlocks Medicaid enrollment, NYC Care, or free clinic referrals.

Each question: 2-3 answer options. Keep questions short.

Respond ONLY with valid JSON array, no markdown:
[{"id":"followup1","question":"question text","options":[{"value":"key","label":"Label"}]}]`

      const raw = await callGemini(prompt)
      const questions = JSON.parse(extractJson(raw))
      return new Response(JSON.stringify({ questions }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    // ── Generate additional tasks ────────────────────────────────
    if (action === "tasks") {
      const allAnswers = { ...answers, ...followUpAnswers }
      const allText = Object.entries(allAnswers)
        .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`)
        .join("\n")

      // Calculate how many base steps the engine will generate (rough estimate)
      const baseStepCount = (allAnswers.needs as string[] ?? []).length * 2 + 3
      const maxAiTasks = Math.max(1, Math.min(5, 10 - baseStepCount))

      const prompt = `You are an expert on NYC reentry resources for people recently released from jail or prison.

Everything we know about this person:
${allText}

Generate exactly ${maxAiTasks} additional actionable tasks that are SPECIFIC to what this person told us. Each task must directly connect to their answers — not generic advice.

Each task needs ALL fields:
- title: Max 8 words
- what: One sentence, what this is and why it matters to THEM specifically. Max 25 words.
- detail: Specific instructions — NYC addresses, phone numbers, what to bring. Max 50 words.
- time: How long (e.g. "Same day", "1-2 weeks")
- icon: Pick one: badge, house, restaurant, work, psychology, family_restroom, school, groups, gavel, local_hospital, account_balance, directions_bus, health_and_safety, volunteer_activism

Do NOT duplicate ID, housing, food/SNAP, or basic employment steps. Focus on gaps specific to THIS person.

Respond ONLY with valid JSON array, no markdown:
[{"title":"...","what":"...","detail":"...","time":"...","icon":"..."}]`

      const raw = await callGemini(prompt)
      const tasks = JSON.parse(extractJson(raw))
      return new Response(JSON.stringify({ tasks }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }
})
