# Where Are We? - Next.js Game

A geography guessing game built with Next.js, TypeScript, and OpenAI APIs.

## Features

- **Text-to-Speech (TTS)**: Convert text to speech using OpenAI's TTS API
- **Speech Transcription**: Transcribe audio to text using OpenAI's Whisper API
- **Interactive Game**: Guess locations based on hints from local characters
- **Multiple Locations**: Paris, Tokyo, Cairo, New York, Sydney, and more

## Getting Started

### Prerequisites

- Node.js 18+ installed
- OpenAI API key

### Installation

1. Clone or extract the project

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Edit `.env.local` and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_actual_openai_api_key_here
   ```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## API Routes

### POST /api/tts
Converts text to speech using OpenAI's TTS model.

**Request Body:**
```json
{
  "input": "Hello, world!"
}
```

**Response:**
Returns an audio/mpeg file (MP3 format)

**Example Usage:**
```typescript
const response = await fetch('/api/tts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ input: 'Hello, world!' })
});
const audioBlob = await response.blob();
const audioUrl = URL.createObjectURL(audioBlob);
```

### POST /api/transcribe
Transcribes audio to text using OpenAI's Whisper model.

**Request Body:**
```json
{
  "base64Audio": "base64_encoded_audio_data"
}
```

**Response:**
```json
{
  "transcription": "transcribed text here"
}
```

**Example Usage:**
```typescript
const response = await fetch('/api/transcribe', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ base64Audio: base64AudioString })
});
const { transcription } = await response.json();
```

## Project Structure

```
wherearwe-nextjs/
├── app/
│   ├── api/
│   │   ├── tts/
│   │   │   └── route.ts          # Text-to-speech API endpoint
│   │   └── transcribe/
│   │       └── route.ts          # Transcription API endpoint
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── components/
│   ├── Game.tsx                  # Main game component
│   ├── GameScene.tsx             # Game scene with characters
│   ├── RightPanel.tsx            # Right panel UI
│   ├── ChatPanel.tsx             # Chat interface
│   └── ui/                       # UI components (buttons, dialogs, etc.)
├── .env.local                    # Environment variables
└── package.json
```

## Technologies Used

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **OpenAI API** - TTS and Whisper transcription
- **Radix UI** - Accessible UI components
- **Lucide React** - Icon library
- **Sonner** - Toast notifications

## Development

To build for production:
```bash
npm run build
```

To start the production server:
```bash
npm start
```

## Notes

- Make sure to add your OpenAI API key to `.env.local` before running
- The API routes are server-side only and keep your API key secure
- Audio files are processed in-memory and not stored on disk
- The game includes multiple difficulty levels based on language complexity
