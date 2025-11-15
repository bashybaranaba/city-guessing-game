import OpenAI from "openai";
import { NextResponse } from "next/server";

const API_KEY = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
  apiKey: API_KEY,
});

export async function POST(request: Request) {
  try {
    const requestBody = await request.json();
    const { input } = requestBody;

    // Step 1: Generate audio using OpenAI TTS model
    const audioResponse = await openai.audio.speech.create({
      model: "tts-1", // or "tts-1-hd" for higher quality
      voice: "alloy", // or choose from "echo", "fable", "onyx", "nova", "shimmer"
      input, // Text input to convert to speech
    });

    // Step 2: Convert audio response into a Blob (Buffer)
    const buffer = Buffer.from(await audioResponse.arrayBuffer());

    // Step 3: Respond with the audio Blob
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg", // Specify the MIME type
        "Content-Disposition": 'inline; filename="speech.mp3"', // Optional: set filename for download
      },
    });
  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 });
  }
}
