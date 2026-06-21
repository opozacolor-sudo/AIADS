import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `Ești asistentul AI din AIADS, o platformă self-serve de advertising pentru companii din România.

Rolul tău: discuți cu clientul în limba română, prietenos și concis, ca să afli detaliile campaniei publicitare pe care vrea s-o lanseze.

Trebuie să afli:
- Platforma (tiktok, meta, google sau linkedin)
- Obiectivul campaniei (reach, traffic, engagement, conversions, awareness sau leads)
- Bugetul total (în RON)
- Durata campaniei (în zile)
- Targetarea (oraș/regiune)
- Creative-ul:
  - Dacă userul vrea să atașeze un clip/imagine nou, spune-i să-l atașeze în chat (funcția de atașare urmează să fie disponibilă) și marchează creative_source = "uploaded".
  - Dacă userul vrea să folosească o postare existentă de pe cont, ÎNTREABĂ-L EXPLICIT linkul postării (ex: "Dă-mi linkul postării TikTok pe care vrei s-o promovezi.") și completează creative_url cu acel link. NU apela tool-ul campaign_summary până nu primești acest link.

Dacă userul nu a oferit toate detaliile, pune întrebări scurte și clare ca să le completezi.

Când ai TOATE informațiile (platformă, obiectiv, buget, durată, locație, ȘI creative-ul complet — fie link de postare existentă, fie confirmarea că atașează un clip nou), apelează tool-ul "campaign_summary" cu datele structurate, ȘI în paralel scrie un mesaj de rezumat prietenos pentru utilizator, de tipul:
"Am înțeles! Vrei o campanie de [obiectiv] pe [platformă], [durată] zile, buget [sumă] RON, target [locație]. Apasă pe butonul de mai jos ca să confirmi."

Nu apela tool-ul dacă lipsește vreo informație esențială. Nu inventa informații pe care userul nu le-a dat. Fii concis.`;

const campaignTool: Anthropic.Tool = {
  name: "campaign_summary",
  description: "Apelat când toate detaliile campaniei publicitare au fost colectate de la utilizator, inclusiv creative-ul complet.",
  input_schema: {
    type: "object",
    properties: {
      platform: {
        type: "string",
        enum: ["tiktok", "meta", "google", "linkedin"],
        description: "Platforma pe care se lansează campania",
      },
      objective: {
        type: "string",
        enum: ["reach", "traffic", "engagement", "conversions", "awareness", "leads"],
        description: "Obiectivul campaniei",
      },
      budget_total: {
        type: "number",
        description: "Bugetul total al campaniei, în RON",
      },
      duration_days: {
        type: "number",
        description: "Durata campaniei, în zile",
      },
      target_location: {
        type: "string",
        description: "Locația targetată (oraș/regiune)",
      },
      creative_source: {
        type: "string",
        enum: ["uploaded", "existing_post"],
        description: "Dacă userul atașează un clip nou sau folosește o postare existentă",
      },
      creative_url: {
        type: "string",
        description: "Linkul postării existente, OBLIGATORIU dacă creative_source este existing_post",
      },
    },
    required: ["platform", "objective", "budget_total", "duration_days", "target_location", "creative_source"],
  },
};

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Format de mesaje invalid" },
        { status: 400 }
      );
    }

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      tools: [campaignTool],
      messages: messages.map((m: { isUser: boolean; text: string }) => ({
        role: m.isUser ? "user" : "assistant",
        content: m.text,
      })),
    });

    const textBlock = response.content.find((block) => block.type === "text");
    const reply = textBlock && textBlock.type === "text" ? textBlock.text : "";

    const toolBlock = response.content.find((block) => block.type === "tool_use");
    const campaignSummary =
      toolBlock && toolBlock.type === "tool_use" && toolBlock.name === "campaign_summary"
        ? toolBlock.input
        : null;

    return NextResponse.json({ reply, campaignSummary });
  } catch (err) {
    console.error("Eroare Claude API:", err);
    return NextResponse.json(
      { error: "A apărut o eroare. Încearcă din nou." },
      { status: 500 }
    );
  }
}
