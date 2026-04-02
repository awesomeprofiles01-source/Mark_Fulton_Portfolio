const CV_CONTEXT = `
Mark Fulton - Field Operations & Logistics Leader

SUMMARY:
Experienced field operations and logistics professional with 12+ years managing mission-critical functions in high-risk humanitarian environments across Africa. Open to international roles. Founder of OpsTrainer.

CONTACT:
Phone: +27 79 233 1358
Email: mwfulton@gmail.com

LANGUAGES:
English (Fluent), Afrikaans (Conversational), Shona & SiSwati (Colloquial)

EXPERIENCE:

1. Developer & Founder - OpsTrainer (June 2021 - Present, Pretoria)
- Designed and built AI-powered humanitarian training platform from scratch
- Secured content partnership with the British Red Cross
- Developed 25+ courses across 12 languages with QR-verified certifications and ReliefWeb job matching

2. Logistics, Finance & Administration - TDI | MINUSMA Mission, Mali (December 2016 - April 2021)
Kidal (September 2019 - April 2021):
- Led logistics for EODD, IEDD, Medical, EDD, and Recovery teams - 50 local and international staff
- Reduced budget waste by 20%, reduced team response times by 25%
- Zero incidents in complex security environment

Timbuktu (2017 - September 2019):
- Designed and built two high-capacity bunkers
- Coordinated logistics for four major projects
- All projects on schedule, within budget, no safety incidents

Bamako, Kidal, Gao, Timbuktu (December 2016 - 2017):
- Oversaw logistics across multiple locations with team of 35

3. Logistics Manager - TDI | UNISFA Mission, South Sudan (November 2012 - May 2016, Abyei)
- Directed logistics and life support for over 170 personnel in high-risk environment

4. Fleet Manager - WH & Sons Plant Hire Division (July 2009 - October 2012)
- Managed team of 15 personnel and all plant hire machines and equipment

5. Earlier Roles (2004-2009):
- Logistics Manager, Administrator & Site Coordinator - WVH Plant Hire (2008-2009)
- Building Maintenance Specialist - WH & Sons (PTY) Ltd. (2005-2008)
- General Manager - Thornwhite Printing & Brokerage (2004-2005)

CORE SKILLS:
Camp & Bunker Construction, Supply Chain & Logistics, Risk & Security Management,
Fleet & Asset Management, Team Leadership & Training, Finance & Budget Oversight,
Procurement & Contracts, Microsoft Excel & MS Access Systems

CERTIFICATIONS:
- Project Management Diploma - Alison (2017)
- Operations Management Diploma - Alison (2017)
- Conflict Management & Resolution Diploma - Alison (2017)
- Psychology Diploma - Alison (2017)
- Gender & Diversity Certification - UNDSS (2020)
- Advanced Security in the Field BSAFE 1 & 2 - UNDSS (2025)
- PSEA - KAYA (2023)
- Active Shooter - UNDSS (2025)
- Safeguarding Essentials - KAYA (2023)

OPSTRAINER:
- First AI-powered training and certification platform for humanitarian professionals
- 25+ courses, 12 languages, QR-verified certificates
- British Red Cross content partnership
- ReliefWeb job matching integration
- Website: opstrainer.co.za
`;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    // AI chat endpoint
    if (request.method === "POST" && url.pathname === "/chat") {
      try {
        const { message } = await request.json();

        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": env.ANTHROPIC_API_KEY,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify({
            model: "claude-haiku-4-5-20251001",
            max_tokens: 500,
            system: `You are a professional assistant representing Mark Fulton. Answer questions exclusively based on his CV and background provided below. Be concise and professional. If asked something not in the CV, say you can only answer questions about Mark's professional background.\n\n${CV_CONTEXT}`,
            messages: [{ role: "user", content: message }],
          }),
        });

        const data = await response.json();
        const reply = data.content?.[0]?.text || "Sorry, I could not generate a response.";

        return new Response(JSON.stringify({ reply }), {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        });

      } catch (err) {
        return new Response(JSON.stringify({ reply: "Something went wrong. Please try again." }), {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        });
      }
    }

    // For root path, explicitly request index.html
    if (url.pathname === "/" || url.pathname === "") {
      const indexRequest = new Request(new URL("/index.html", url.origin), request);
      return env.ASSETS.fetch(indexRequest);
    }

    // Serve all other static assets
    return env.ASSETS.fetch(request);
  },
};
