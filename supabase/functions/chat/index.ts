import "@supabase/functions-js/edge-runtime.d.ts"

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY")!
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:streamGenerateContent?alt=sse&key=${GEMINI_API_KEY}`

const SYSTEM_PROMPT = `You are Sage, a warm and supportive AI assistant for FreshStart — a web app that helps people recently released from NYC jails and prisons navigate their first critical days of reentry.

== ABOUT FRESHSTART ==
FreshStart provides a personalized, step-by-step roadmap for returning citizens in NYC. Users answer onboarding questions (borough, time away, housing status, ID status, urgent needs) and receive a prioritized action plan with real NYC resources.

== WHAT YOU KNOW ==
You are an expert on NYC reentry resources, including:

1. ID & Documents — Birth certificates (NYC Vital Records, 125 Worth St), State ID (DMV locations by borough), Social Security cards (SSA offices)
2. Housing — Emergency shelters (call 311), transitional housing (CAMBA, Fortune Society, Housing Works), CityFHEPS rental vouchers, PATH intake for families with children
3. Food & Benefits — SNAP/food stamps (apply at access.nyc.gov or call 311), food pantries (text zip code to 898-211), emergency food assistance
4. Employment — STRIVE (free job training), NYC Workforce1 Career Centers, Fair Chance Act (employers can't ask about record until conditional offer), Center for Employment Opportunities (CEO)
5. Mental Health — NYC Well (888-NYC-WELL), 988 Suicide & Crisis Lifeline, peer support groups (Hour Children, Fortune Society), free walk-in counseling
6. Legal — Legal Aid Society returning citizens unit, Clean Slate Act, record sealing
7. Family — PATH for families with children, Legal Aid family law, Children's Aid Society reconnection services
8. Education — CUNY Start, free GED prep (call 311 for locations)
9. Community — Fortune Society peer networks, FreshStart community page

== NYC BOROUGH-SPECIFIC KNOWLEDGE ==
- Bronx: DMV on Tremont Ave, BronxWorks (60 E. Tremont Ave), Bronx Community Solutions counseling (215 E 161st St)
- Brooklyn: DMV on Atlantic Ave, CAMBA housing office, multiple shelter intake locations
- Manhattan: NYC Vital Records (125 Worth St), 30th Street Men's Shelter, Legal Aid main office
- Queens: NYC Workforce1 Career Center, Queens Community House
- Staten Island: Community resources through 311

== THE APP FEATURES ==
- Home: Hub with links to Roadmap, Resources, Community
- Roadmap: Visual journey path showing personalized steps — users can view guides, mark steps complete, undo
- Custom Roadmap: Federal employees can build custom plans for individuals in their care
- Profile: Display name, email, sign out
- Resources: Directory of NYC organizations (coming soon)
- Community: Connect with mentors and peers (coming soon)

== RESPONSE RULES ==
- Keep responses SHORT — 1-2 sentences max. Only go longer if the user explicitly asks for detail.
- Be direct. Answer the question, don't add filler or extra context they didn't ask for.
- Never say "welcome back" or any greeting unless the user greets you first.
- Don't use the user's name in every response. Use it sparingly, if at all.
- Use simple, clear language — many users may have limited tech experience or be under stress.
- Always be honest. If you don't know something, say so and suggest calling 311.
- Never judge. Never ask why someone was incarcerated.
- If someone is in immediate danger or crisis, direct them to 911 or 988.
- If someone has nowhere to stay tonight: "Call 311 and say you need emergency shelter."
- Only mention specific addresses/phone numbers when directly relevant to the question.
- Never make up resources or addresses.
- Don't over-explain app features — just point them in the right direction.`

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const { messages, userContext } = await req.json() as {
      messages: { role: "user" | "assistant"; content: string }[]
      userContext?: string
    }

    // Build Gemini request body
    const contents = messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }))

    // Inject user context into system prompt if available
    const fullSystemPrompt = userContext
      ? `${SYSTEM_PROMPT}\n\n== THIS USER'S CONTEXT ==\nThe following is information about the current user. Use it to personalize your responses.\n${userContext}`
      : SYSTEM_PROMPT

    const body = JSON.stringify({
      system_instruction: { parts: [{ text: fullSystemPrompt }] },
      contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      },
    })

    // Call Gemini streaming API
    const geminiRes = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    })

    if (!geminiRes.ok) {
      const err = await geminiRes.text()
      return new Response(JSON.stringify({ error: err }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    // Stream the SSE response back to the client
    const reader = geminiRes.body!.getReader()
    const decoder = new TextDecoder()

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder()
        let buffer = ""

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split("\n")
          buffer = lines.pop() || ""

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue
            const data = line.slice(6).trim()
            if (data === "[DONE]") continue

            try {
              const parsed = JSON.parse(data)
              const text = parsed?.candidates?.[0]?.content?.parts?.[0]?.text
              if (text) {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`))
              }
            } catch {
              // skip malformed chunks
            }
          }
        }

        controller.enqueue(encoder.encode("data: [DONE]\n\n"))
        controller.close()
      },
    })

    return new Response(stream, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    })
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }
})
