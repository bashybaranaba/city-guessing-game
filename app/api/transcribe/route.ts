import OpenAI from "openai";
import { NextResponse } from "next/server";

const API_KEY = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
  apiKey: API_KEY,
});

export async function POST(request: Request) {
  try {
    const requestBody = await request.json();
    const { base64Audio } = requestBody;

    // Decode the Base64 audio string into a buffer
    const buffer = Buffer.from(base64Audio, "base64");

    // Create a File object from the buffer
    const file = new File([buffer], "audio.wav", { type: "audio/wav" });

    // Transcribe the audio using OpenAI Whisper API
    const transcription = await openai.audio.transcriptions.create({
      file: file, // File object as input
      model: "whisper-1", // Whisper model
    });

    // Return the transcription result
    return new NextResponse(
      JSON.stringify({ transcription: transcription.text }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error: any) {
    return new NextResponse(error.message, {
      status: 500,
    });
  }
}
