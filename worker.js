const CV_CONTEXT = `Mark Fulton - Field Operations and Logistics Leader.
SUMMARY: Experienced field operations and logistics professional with 12+ years in high-risk humanitarian environments. Open to international roles. Founder of OpsTrainer.
CONTACT: Phone +27 79 233 1358, Email mwfulton@gmail.com.
LANGUAGES: English Fluent, Afrikaans Conversational, Shona and SiSwati Colloquial.
EXPERIENCE: 1. Developer and Founder OpsTrainer June 2021 to Present Pretoria. Built AI-powered humanitarian training platform. British Red Cross content partnership. 25+ courses across 12 languages with QR-verified certifications.
2. Logistics Finance and Administration TDI MINUSMA Mali 2016 to 2021. Kidal 2019 to 2021: Led logistics for 50 staff, reduced budget waste 20%, reduced response times 25%, zero incidents. Timbuktu 2017 to 2019: Built two high-capacity bunkers, coordinated four major projects, all on schedule within budget. Bamako Kidal Gao Timbuktu 2016 to 2017: Oversaw logistics across multiple locations with team of 35.
3. Logistics Manager TDI UNISFA South Sudan November 2012 to May 2016 Abyei. Directed logistics and life support for over 170 personnel in high-risk environment.
4. Fleet Manager WH and Sons Plant Hire Division July 2009 to October 2012. Managed team of 15 personnel and all plant hire machines and equipment.
5. Earlier Roles 2004 to 2009: Logistics Manager Administrator and Site Coordinator WVH Plant Hire 2008 to 2009. Building Maintenance Specialist WH and Sons PTY Ltd 2005 to 2008. General Manager Thornwhite Printing and Brokerage 2004 to 2005.
CORE SKILLS: Camp and Bunker Construction, Supply Chain and Logistics, Risk and Security Management, Fleet and Asset Management, Team Leadership and Training, Finance and Budget Oversight, Procurement and Contracts, Microsoft Excel and MS Access Systems.
CERTIFICATIONS: Project Management Diploma Alison 2017. Operations Management Diploma Alison 2017. Conflict Management and Resolution Alison 2017. Psychology Diploma Alison 2017. Gender and Diversity UNDSS 2020. Advanced Security in the Field BSAFE 1 and 2 UNDSS 2025. PSEA KAYA 2023. Active Shooter UNDSS 2025. Safeguarding Essentials KAYA 2023.
OPSTRAINER: First AI-powered training and certification platform for humanitarian professionals. 25+ courses, 12 languages, QR-verified certificates. British Red Cross content partnership. ReliefWeb job matching. Website opstrainer.co.za.`;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

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
            model: "claude-3-5-haiku-20241022",
            max_tokens: 500,
            system: "You are a professional assistant representing Mark Fulton. Answer questions exclusively based on his CV and background provided below. Be concise and professional. If asked something not in the CV, say you can only answer questions about Mark's professional background.\n\n" + CV_CONTEXT,
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

    if (url.pathname === "/") {
      const indexRequest = new Request(new URL("/index.html", url.origin), request);
      return env.ASSETS.fetch(indexRequest);
    }

    return env.ASSETS.fetch(request);
  },
};
