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
  mood: z.enum(['happy', 'neutral', 'mysterious', 'excited', 'tired']),
  description: z.string(),
  role: z.enum(['chef', 'guide', 'artist', 'local', 'vendor', 'worker']),
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
    level: z.enum(['Easy', 'Medium', 'Hard']),
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
    const { usedLocations = [], difficulty = 'Medium' } = requestBody;

    // Build the prompt for generating a game scenario
    const systemPrompt = `You are a creative game scenario generator for "Where Are We?" - a language learning travel game.

Generate a unique and culturally rich taxi ride scenario in a world city. The player wakes up in a taxi and must figure out where they are by talking to the driver and NPCs they see.

Requirements:
1. Choose a unique city (avoid these if provided: ${usedLocations.join(', ')})
2. Select an appropriate difficulty level: ${difficulty}
   - Easy: Driver speaks clear English
   - Medium: Driver mixes local language with English
   - Hard: Driver speaks mostly local language with minimal English
3. Create 3 diverse NPCs the player can see through the window, each with:
   - A unique name fitting the culture
   - A hint in the local language (with translation and romanization if non-Latin script)
   - Different positions, colors, moods, and roles
   - Interesting backstories
4. The driver should have:
   - An opening line that sets the scene (mixed language for Medium/Hard)
   - 3 progressive hints that gradually reveal the location through:
     * Hint 1: Climate/weather
     * Hint 2: Local food/culture
     * Hint 3: Famous landmark
5. Specify the most famous landmark in the city (e.g., "Eiffel Tower" for Paris, "Burj Khalifa" for Dubai)
   - This will be used to generate a realistic image of the city

Make the scenario engaging, educational, and culturally authentic!`;

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
    console.log(`Generating image for ${locationData.city}, ${locationData.country}...`);

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

    const imageUrl = imageResponse.data[0].url;

    if (!imageUrl) {
      throw new Error("Failed to generate image");
    }

    // Add the generated image URL to the location data
    const location = {
      ...locationData,
      image: imageUrl,
    };

    console.log(`Successfully generated scenario for ${location.city} with image`);

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
