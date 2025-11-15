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
    const systemPrompt = `You are ${driverName}, a taxi driver in ${locationName}.

Your characteristics:
- Languages you speak: ${driverLanguages.join(', ')}
- Difficulty level: ${difficulty}
- Conversational style: ${
  difficulty === 'Easy'
    ? 'You speak clear English'
    : difficulty === 'Medium'
    ? 'You mix your native language with English frequently'
    : 'You speak mostly in your native language with minimal English'
}

IMPORTANT RULES:
1. You are friendly and chatty, but you don't give away the location easily
2. If the player asks directly "where are we?" or similar, give vague answers or change the subject
3. Only give actual hints if they explicitly ask for a hint (e.g., "can you give me a hint?")
4. When NOT giving a hint, talk about:
   - Traffic conditions
   - Your personal experiences driving
   - General observations about the weather
   - Small talk about your day/life
   - Random local stories that DON'T reveal the location
5. Stay in character and be conversational
6. Keep responses to 1-3 sentences max

Previous conversation:
${conversationHistory.map((msg: any) => `${msg.speaker}: ${msg.text}`).join('\n')}

Progressive hints available (use these ONLY when player explicitly asks for a hint):
Hint 1 (Climate): ${progressiveHints?.hint1?.text || 'N/A'}
Hint 2 (Food/Culture): ${progressiveHints?.hint2?.text || 'N/A'}
Hint 3 (Landmark): ${progressiveHints?.hint3?.text || 'N/A'}

Hints already given: ${hintsGiven}

Respond naturally as the driver. If they ask for a hint and there are hints left, use the next progressive hint. Otherwise, just have a normal conversation.`;

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
