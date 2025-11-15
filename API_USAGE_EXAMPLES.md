# API Usage Examples

This document provides practical examples of how to use the TTS and Transcription API routes in your Next.js application.

## Text-to-Speech (TTS) API

### Endpoint
`POST /api/tts`

### Basic Usage

```typescript
// Example: Convert text to speech and play it
async function textToSpeech(text: string) {
  try {
    const response = await fetch('/api/tts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ input: text }),
    });

    if (!response.ok) {
      throw new Error('TTS request failed');
    }

    // Get the audio blob
    const audioBlob = await response.blob();
    
    // Create a URL for the audio blob
    const audioUrl = URL.createObjectURL(audioBlob);
    
    // Create and play audio element
    const audio = new Audio(audioUrl);
    await audio.play();
    
    // Clean up the URL when done
    audio.onended = () => {
      URL.revokeObjectURL(audioUrl);
    };
    
    return audio;
  } catch (error) {
    console.error('TTS Error:', error);
    throw error;
  }
}

// Usage
textToSpeech("Hello, welcome to our application!");
```

### React Component Example

```typescript
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function TTSExample() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const handleSpeak = async () => {
    if (isPlaying && audio) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    try {
      setIsPlaying(true);
      
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          input: 'This is a text-to-speech example!' 
        }),
      });

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const newAudio = new Audio(audioUrl);
      
      newAudio.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };
      
      await newAudio.play();
      setAudio(newAudio);
    } catch (error) {
      console.error('Error:', error);
      setIsPlaying(false);
    }
  };

  return (
    <Button onClick={handleSpeak}>
      {isPlaying ? 'Stop' : 'Speak'}
    </Button>
  );
}
```

### Advanced: Download Audio File

```typescript
async function downloadTTS(text: string, filename: string = 'speech.mp3') {
  try {
    const response = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input: text }),
    });

    const audioBlob = await response.blob();
    
    // Create download link
    const url = URL.createObjectURL(audioBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Download Error:', error);
  }
}

// Usage
downloadTTS("Save this as an audio file", "my-speech.mp3");
```

---

## Speech Transcription API

### Endpoint
`POST /api/transcribe`

### Basic Usage

```typescript
// Example: Transcribe audio from a file input
async function transcribeAudio(audioFile: File) {
  try {
    // Convert file to base64
    const base64Audio = await fileToBase64(audioFile);
    
    const response = await fetch('/api/transcribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ base64Audio }),
    });

    if (!response.ok) {
      throw new Error('Transcription request failed');
    }

    const data = await response.json();
    return data.transcription;
  } catch (error) {
    console.error('Transcription Error:', error);
    throw error;
  }
}

// Helper function to convert file to base64
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
}
```

### React Component Example with File Upload

```typescript
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function TranscriptionExample() {
  const [transcription, setTranscription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    
    try {
      // Convert to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = async () => {
        const base64Audio = (reader.result as string).split(',')[1];
        
        const response = await fetch('/api/transcribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ base64Audio }),
        });

        const data = await response.json();
        setTranscription(data.transcription);
        setIsLoading(false);
      };
    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Input 
        type="file" 
        accept="audio/*" 
        onChange={handleFileChange}
        disabled={isLoading}
      />
      {isLoading && <p>Transcribing...</p>}
      {transcription && (
        <div className="p-4 border rounded">
          <h3 className="font-bold">Transcription:</h3>
          <p>{transcription}</p>
        </div>
      )}
    </div>
  );
}
```

### Advanced: Record and Transcribe Audio

```typescript
'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';

export function AudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
        await transcribeBlob(audioBlob);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const transcribeBlob = async (blob: Blob) => {
    try {
      // Convert blob to base64
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      
      reader.onload = async () => {
        const base64Audio = (reader.result as string).split(',')[1];
        
        const response = await fetch('/api/transcribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ base64Audio }),
        });

        const data = await response.json();
        setTranscription(data.transcription);
      };
    } catch (error) {
      console.error('Transcription error:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button 
          onClick={startRecording} 
          disabled={isRecording}
        >
          Start Recording
        </Button>
        <Button 
          onClick={stopRecording} 
          disabled={!isRecording}
          variant="destructive"
        >
          Stop Recording
        </Button>
      </div>
      {isRecording && <p className="text-red-500">🔴 Recording...</p>}
      {transcription && (
        <div className="p-4 border rounded">
          <h3 className="font-bold">Transcription:</h3>
          <p>{transcription}</p>
        </div>
      )}
    </div>
  );
}
```

---

## Combined Example: Voice Chat

```typescript
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function VoiceChat() {
  const [messages, setMessages] = useState<Array<{role: 'user' | 'assistant', text: string}>>([]);
  const [isRecording, setIsRecording] = useState(false);

  const handleVoiceInput = async () => {
    // Record audio
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    const chunks: Blob[] = [];

    mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
    
    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(chunks, { type: 'audio/wav' });
      
      // Transcribe
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onload = async () => {
        const base64Audio = (reader.result as string).split(',')[1];
        
        const response = await fetch('/api/transcribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ base64Audio }),
        });

        const { transcription } = await response.json();
        
        // Add user message
        setMessages(prev => [...prev, { role: 'user', text: transcription }]);
        
        // Generate response (you would call your LLM API here)
        const assistantResponse = `You said: ${transcription}`;
        
        // Add assistant message
        setMessages(prev => [...prev, { role: 'assistant', text: assistantResponse }]);
        
        // Speak the response
        const ttsResponse = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ input: assistantResponse }),
        });
        
        const audioBlob = await ttsResponse.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.play();
      };
      
      stream.getTracks().forEach(track => track.stop());
    };

    mediaRecorder.start();
    setIsRecording(true);
    
    // Stop after 5 seconds
    setTimeout(() => {
      mediaRecorder.stop();
      setIsRecording(false);
    }, 5000);
  };

  return (
    <div className="space-y-4">
      <Button onClick={handleVoiceInput} disabled={isRecording}>
        {isRecording ? 'Recording...' : 'Start Voice Input'}
      </Button>
      
      <div className="space-y-2">
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`p-3 rounded ${
              msg.role === 'user' ? 'bg-blue-100' : 'bg-gray-100'
            }`}
          >
            <strong>{msg.role === 'user' ? 'You' : 'Assistant'}:</strong> {msg.text}
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## Error Handling

Always implement proper error handling:

```typescript
async function safeAPICall(endpoint: string, body: any) {
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Call Failed:', error);
    // Show user-friendly error message
    alert('An error occurred. Please try again.');
    throw error;
  }
}
```

## Notes

- **Audio Format**: The TTS API returns MP3 format audio
- **Transcription Input**: The transcription API accepts base64-encoded audio in WAV format
- **API Key Security**: The OpenAI API key is stored server-side in `.env.local` and never exposed to the client
- **Rate Limiting**: Consider implementing rate limiting for production use
- **File Size**: Be mindful of audio file sizes when transcribing - larger files take longer to process
