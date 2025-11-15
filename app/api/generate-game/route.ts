import OpenAI from "openai";
import { NextResponse } from "next/server";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";

const API_KEY = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
  apiKey: API_KEY,
});

export const revalidate = 0;
export const maxDuration = 45;

// Define the Zod schema for a game scenario
// Note: OpenAI requires .nullable() for optional fields
const CharacterSchema = z.object({
  id: z.string(),
  name: z.string(),
  hint: z.string(),
  romanization: z.string().nullable(),
  translation: z.string().nullable(),
  position: z.object({
    x: z.number(),
    y: z.number(),
  }),
  color: z.string(),
  mood: z.enum(["happy", "neutral", "mysterious", "excited", "tired"]),
  description: z.string(),
  role: z.enum(["chef", "guide", "artist", "local", "vendor", "worker"]),
});

const HintSchema = z.object({
  text: z.string(),
  translation: z.string().nullable(),
  romanization: z.string().nullable(),
});

const LocationSchema = z.object({
  name: z.string(),
  city: z.string(),
  country: z.string(),
  characters: z.array(CharacterSchema),
  acceptableAnswers: z.array(z.string()),
  languageDifficulty: z.object({
    level: z.enum(["Easy", "Medium", "Hard"]),
    description: z.string(),
  }),
  driverName: z.string(),
  driverLanguages: z.array(z.string()),
  openingLine: z.string(),
  openingLineTranslation: z.string().nullable(),
  progressiveHints: z.object({
    hint1: HintSchema,
    hint2: HintSchema,
    hint3: HintSchema,
  }),
  famousLandmark: z.string(), // Added to help with image generation
});

export async function POST(request: Request) {
  try {
    const requestBody = await request.json();
    const { usedLocations = [], difficulty = "Medium" } = requestBody;

    // Build the prompt for generating a game scenario
    const systemPrompt = `You are a creative game scenario generator for "Where Are We?" - a language learning travel game.

Generate a unique and culturally rich taxi ride scenario in a world city. The player must figure out where they are through language clues and cultural hints.

CRITICAL REQUIREMENTS:

1. Choose a unique city (avoid these if provided: ${usedLocations.join(", ")})

2. Difficulty level: ${difficulty}
   - Easy: 30% local language, 70% English in all dialogue
   - Medium: 60% local language, 40% English in all dialogue
   - Hard: 85% local language, 15% English in all dialogue

3. Create 3 diverse NPCs visible through the window, each with:
   - A name fitting the local culture
   - A hint ENTIRELY in the local language (MUST be authentic local language)
   - Full translation in English
   - Romanization if non-Latin script (e.g., Japanese, Korean, Arabic, Hindi, Chinese)
   - Different positions, colors, moods, and roles
   - The hint should describe local culture, landmarks, or characteristics WITHOUT mentioning the city/country name

4. Driver characteristics:
   - Opening line MUST be in mixed language (use actual local phrases)
   - Opening line should mention generic things like "morning", "traffic", "where to?" without revealing location
   - Provide full English translation of the opening line

5. Progressive hints (IMPORTANT - these will be revealed one by one when player asks):
   - Hint 1 (Climate/Weather): Describe weather in mixed language WITHOUT naming the city
     * Example: "Here it's always humid... 暑い! We get monsoons every summer" (for an Asian city)
   - Hint 2 (Food/Culture): Describe local food/culture in mixed language WITHOUT naming the city
     * Example: "Everyone loves our タコス... street food everywhere, muy delicioso!"
   - Hint 3 (Famous Landmark): Describe a landmark in mixed language WITHOUT directly naming the city
     * Example: "That big tower... la tour... you can see the whole city from up there!"
   - All hints MUST have romanization (if non-Latin) and translation

6. Language mixing rules:
   - Use REAL phrases from the local language (not just random words)
   - Mix languages naturally within sentences
   - Include common local expressions, greetings, exclamations
   - For non-Latin scripts, ALWAYS provide romanization

7. Acceptable answers:
   - Include: city name, country name, city+country, common nicknames
   - Example for Paris: ["paris", "france", "paris france", "paris, france"]

8. Famous landmark:
   - Provide the most iconic landmark (e.g., "Eiffel Tower" for Paris, "Burj Khalifa" for Dubai)
   - This is for image generation only, NOT for dialogue

REMEMBER: The challenge is language-based. Use MORE local language to make it engaging and educational!`;

    const userPrompt = `Generate a ${difficulty} difficulty taxi ride scenario for a unique world city. Make it culturally rich and educational.`;

    // Call OpenAI with structured output
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.8, // Higher temperature for more creative scenarios
      max_tokens: 4096,
      response_format: zodResponseFormat(LocationSchema, "location"),
    });

    // Parse the response
    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content received from OpenAI");
    }

    const locationData = JSON.parse(content);

    // Generate image using DALL-E
    console.log(
      `Generating image for ${locationData.city}, ${locationData.country}...`
    );

    const imagePrompt = `A high-quality, photorealistic street view from inside a taxi in ${locationData.city}, ${locationData.country}.
The scene shows the iconic ${locationData.famousLandmark} visible in the distance through the taxi window.
The image captures the authentic atmosphere of ${locationData.city} with local architecture, street life, and cultural elements.
Daytime scene with good lighting. Professional photography style, vibrant colors, clear details.`;

    const imageResponse = await openai.images.generate({
      model: "dall-e-3",
      prompt: imagePrompt,
      n: 1,
      size: "1792x1024", // Wide format for taxi view
      quality: "standard", // Use "hd" for higher quality but slower/more expensive
    });

    // Ensure the response contains data and a valid URL before using it
    if (
      !imageResponse ||
      !imageResponse.data ||
      imageResponse.data.length === 0 ||
      !imageResponse.data[0]?.url
    ) {
      console.error("Invalid image response:", imageResponse);
      throw new Error("Failed to generate image");
    }

    const imageUrl = imageResponse.data[0].url;

    // Add the generated image URL to the location data
    const location = {
      ...locationData,
      image: imageUrl,
    };

    console.log(
      `Successfully generated scenario for ${location.city} with image`
    );

    return new NextResponse(JSON.stringify(location), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error: any) {
    console.error("Error generating game scenario:", error);
    return new NextResponse(
      JSON.stringify({ error: error.message || "Failed to generate scenario" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
