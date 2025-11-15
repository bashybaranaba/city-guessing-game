import { NextResponse } from "next/server";
import { getVoiceIdFromLanguages, getVoiceIdForLanguage, DEFAULT_VOICE_ID } from "@/lib/elevenlabs-voices";

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

export async function POST(request: Request) {
  try {
    const requestBody = await request.json();
    const { input, languageCode, languageCodes } = requestBody;

    if (!input) {
      return new NextResponse("Missing 'input' parameter", { status: 400 });
    }

    if (!ELEVENLABS_API_KEY || ELEVENLABS_API_KEY === 'your_elevenlabs_api_key_here') {
      return new NextResponse("ElevenLabs API key not configured", { status: 500 });
    }

    // Determine the appropriate voice ID based on language
    let voiceId = DEFAULT_VOICE_ID;

    if (languageCodes && Array.isArray(languageCodes)) {
      // If multiple languages are provided, pick the first non-English one
      voiceId = getVoiceIdFromLanguages(languageCodes);
    } else if (languageCode) {
      // Single language code
      voiceId = getVoiceIdForLanguage(languageCode);
    }

    console.log(`Generating speech with voice ${voiceId} for languages:`, languageCodes || languageCode || 'default');

    // Call ElevenLabs TTS API
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text: input,
          model_id: 'eleven_multilingual_v2', // Use multilingual model for best results
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.0,
            use_speaker_boost: true
          }
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs API error:', errorText);
      throw new Error(`ElevenLabs API returned ${response.status}: ${errorText}`);
    }

    // Convert response to buffer
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Return audio
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Disposition": 'inline; filename="speech.mp3"',
      },
    });
  } catch (error: any) {
    console.error('TTS error:', error);
    return new NextResponse(error.message || 'Failed to generate speech', { status: 500 });
  }
}
