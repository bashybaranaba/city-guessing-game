import OpenAI from "openai";
import { NextResponse } from "next/server";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";

const API_KEY = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
  apiKey: API_KEY,
});

export const revalidate = 0;
export const maxDuration = 30;

// Schema for driver response
const DriverResponseSchema = z.object({
  response: z.string(),
  isHint: z.boolean(),
  hintLevel: z.number().nullable(), // 1, 2, 3, or null if not a hint
});

export async function POST(request: Request) {
  try {
    const requestBody = await request.json();
    const {
      playerQuestion,
      locationName,
      driverName,
      driverLanguages,
      difficulty,
      conversationHistory = [],
      hintsGiven = 0,
      progressiveHints,
    } = requestBody;

    // Build the system prompt for the driver
    const systemPrompt = `You are ${driverName}, a local taxi driver. You MUST NEVER say the exact city name or country name directly.

Your characteristics:
- Languages you speak: ${driverLanguages.join(', ')}
- Difficulty level: ${difficulty}
- Conversational style: ${
  difficulty === 'Easy'
    ? 'You speak mostly English with occasional local words'
    : difficulty === 'Medium'
    ? 'You mix your native language with English (60% local language, 40% English)'
    : 'You speak mostly in your native language with minimal English (80% local language, 20% English)'
}

CRITICAL RULES - FOLLOW STRICTLY:
1. NEVER mention the city name or country name directly - this is the most important rule!
2. Use local language words naturally throughout your speech
3. If asked "where are we?" or "what city is this?", respond with vague descriptions like "my hometown", "this place", "our city", "here", etc.
4. Talk about local features WITHOUT naming them directly:
   - Instead of "Eiffel Tower", say "that famous tower"
   - Instead of "Tokyo", say "our capital" or "this city"
   - Instead of "Paris", say "the city of lights" or "my city"
5. Only give actual hints if they explicitly ask for a hint
6. When NOT giving a hint, talk about:
   - Traffic and streets (without street names)
   - Your personal driving experiences
   - Weather observations
   - Local food and culture (describe, don't name the city)
   - Random stories about "this place" or "here"
7. Keep responses to 1-3 sentences max
8. Use more local language phrases based on difficulty level

Previous conversation:
${conversationHistory.map((msg: any) => `${msg.speaker}: ${msg.text}`).join('\n')}

Progressive hints available (use these ONLY when player explicitly asks for a hint):
Hint 1 (Climate): ${progressiveHints?.hint1?.text || 'N/A'}
Hint 2 (Food/Culture): ${progressiveHints?.hint2?.text || 'N/A'}
Hint 3 (Landmark): ${progressiveHints?.hint3?.text || 'N/A'}

Hints already given: ${hintsGiven}

Respond naturally as the driver in mixed language. REMEMBER: Never say the city or country name!`;

    // Call OpenAI with structured output
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: playerQuestion },
      ],
      temperature: 0.7,
      max_tokens: 200,
      response_format: zodResponseFormat(DriverResponseSchema, "driver_response"),
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No response from driver");
    }

    const driverResponse = JSON.parse(content);

    return new NextResponse(JSON.stringify(driverResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error: any) {
    console.error("Error generating driver response:", error);
    return new NextResponse(
      JSON.stringify({ error: error.message || "Failed to generate response" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
