# Quick Start Guide

## 🚀 Get Started in 3 Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Edit the `.env.local` file and add your OpenAI API key:

```env
OPENAI_API_KEY=sk-your-actual-openai-api-key-here
```

> **Important:** Replace `your_openai_api_key_here` with your actual OpenAI API key from https://platform.openai.com/api-keys

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the game!

---

## 📁 Project Structure

```
wherearwe-nextjs/
├── app/
│   ├── api/
│   │   ├── tts/route.ts          ← Text-to-Speech API
│   │   └── transcribe/route.ts   ← Transcription API
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── Game.tsx                  ← Main game component
│   ├── ui/                       ← UI components
│   └── ...                       ← Other game components
├── .env.local                    ← Environment variables (ADD YOUR API KEY HERE!)
├── API_USAGE_EXAMPLES.md         ← Detailed API usage examples
└── README.md                     ← Full documentation
```

---

## 🎯 What's Included

### ✅ Two API Routes Ready to Use

1. **POST /api/tts** - Convert text to speech
   - Input: `{ "input": "text to speak" }`
   - Output: MP3 audio file

2. **POST /api/transcribe** - Convert speech to text
   - Input: `{ "base64Audio": "base64_encoded_audio" }`
   - Output: `{ "transcription": "transcribed text" }`

### ✅ Complete Game Application

- Interactive geography guessing game
- Multiple locations (Paris, Tokyo, Cairo, New York, Sydney)
- Character interactions with hints
- Voice features (when you integrate the APIs)

---

## 🔧 Common Commands

```bash
# Development
npm run dev          # Start dev server

# Production
npm run build        # Build for production
npm start            # Start production server

# Code Quality
npm run lint         # Run ESLint
```

---

## 📖 Next Steps

1. **Test the API routes** - Check out `API_USAGE_EXAMPLES.md` for code examples
2. **Integrate voice features** - Use the TTS and transcription APIs in your game
3. **Customize the game** - Modify locations, characters, and gameplay in `components/Game.tsx`
4. **Deploy** - Deploy to Vercel, Netlify, or any Node.js hosting platform

---

## 🆘 Troubleshooting

### Build Errors
- Make sure all dependencies are installed: `npm install`
- Clear Next.js cache: `rm -rf .next`

### API Not Working
- Check that `.env.local` has your OpenAI API key
- Verify the API key is valid at https://platform.openai.com/api-keys
- Check browser console for error messages

### Port Already in Use
- Change the port: `PORT=3001 npm run dev`

---

## 📚 Documentation

- **Full README**: See `README.md` for complete documentation
- **API Examples**: See `API_USAGE_EXAMPLES.md` for detailed code examples
- **Next.js Docs**: https://nextjs.org/docs
- **OpenAI API Docs**: https://platform.openai.com/docs

---

## 🎮 Play the Game

Once the server is running:
1. Open http://localhost:3000
2. Click "Start Game"
3. Talk to characters and guess the location
4. Use hints if you get stuck
5. Try to guess all locations!

---

**Enjoy building with Next.js and OpenAI! 🎉**
