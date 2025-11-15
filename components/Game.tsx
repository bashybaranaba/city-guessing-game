'use client';

import { useState, useCallback, useEffect } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import { GameScene } from './GameScene';
import { RightPanel } from './RightPanel';
import { ResultDialog } from './ResultDialog';
import { RideSummary } from './RideSummary';
import { MainMenu } from './MainMenu';
import { HowToPlay } from './HowToPlay';
import { Settings } from './Settings';
import { RoundIntro } from './RoundIntro';
import { CharacterRole } from './CharacterInfoCard';
import { ChatPanel, ChatMessage } from './ChatPanel';
import { Button } from './ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { useVoiceRecording } from '../hooks/useVoiceRecording';

interface CharacterData {
  id: string;
  name: string;
  hint: string;
  romanization?: string;
  translation?: string;
  position: { x: number; y: number };
  color: string;
  mood?: 'happy' | 'neutral' | 'mysterious' | 'excited' | 'tired';
  description?: string;
  role?: CharacterRole;
}

interface Location {
  name: string;
  city: string;
  country: string;
  image: string;
  characters: CharacterData[];
  acceptableAnswers: string[];
  languageDifficulty: {
    level: 'Easy' | 'Medium' | 'Hard';
    description: string;
  };
  driverName: string;
  driverLanguages: string[];
  openingLine: string;
  openingLineTranslation?: string;
  progressiveHints: {
    hint1: { text: string; translation?: string; romanization?: string };
    hint2: { text: string; translation?: string; romanization?: string };
    hint3: { text: string; translation?: string; romanization?: string };
  };
  famousLandmark?: string; // Used for image generation
}

// This will be replaced by LLM-generated scenarios
const DUMMY_LOCATIONS: Location[] = [
  {
    name: 'Paris, France',
    city: 'Paris',
    country: 'France',
    image: 'https://images.unsplash.com/photo-1760538569237-a17d05477bef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJpcyUyMGVpZmZlbCUyMHRvd2VyJTIwc2NlbmV8ZW58MXx8fHwxNzYzMTk5OTk0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    characters: [
      {
        id: '1',
        name: 'Marie',
        hint: "Bonjour! Je suis pâtissière. Nos croissants sont célèbres dans le monde entier!",
        translation: "Hello! I'm a pastry chef. Our croissants are world-famous here!",
        position: { x: 20, y: 60 },
        color: '#e74c3c',
        mood: 'happy',
        description: 'A passionate pastry chef who runs a small bakery. She loves sharing stories about French culinary traditions.',
        role: 'chef'
      },
      {
        id: '2',
        name: 'Pierre',
        hint: 'Cette tour de fer là-bas? Construite en 1889, elle fait 330 mètres de haut!',
        translation: 'That iron tower over there? Built in 1889, stands 330 meters tall!',
        position: { x: 50, y: 55 },
        color: '#3498db',
        mood: 'neutral',
        description: 'A knowledgeable tour guide with decades of experience. He knows every historical detail of the city.',
        role: 'guide'
      },
      {
        id: '3',
        name: 'Sophie',
        hint: 'Bienvenue dans la Ville Lumière! La capitale mondiale de la mode!',
        translation: 'Welcome to the City of Light! Fashion capital of the world!',
        position: { x: 75, y: 62 },
        color: '#9b59b6',
        mood: 'excited',
        description: 'A fashion designer who has lived in Paris all her life. She loves welcoming visitors to her beloved city.',
        role: 'artist'
      }
    ],
    acceptableAnswers: ['paris', 'france', 'paris france', 'paris, france'],
    languageDifficulty: {
      level: 'Medium',
      description: 'Driver mixes French and English'
    },
    driverName: 'Pierre',
    driverLanguages: ['FR', 'EN'],
    openingLine: "Bonjour! Quelle belle matinée, non? The traffic is light today—lucky for you, mon ami!",
    openingLineTranslation: "Hello! What a beautiful morning, right? The traffic is light today—lucky for you, my friend!",
    progressiveHints: {
      hint1: {
        text: "Ah, le climat ici? It's temperate... mild winters, warm summers. Very comfortable, non?",
        translation: "Ah, the climate here? It's temperate... mild winters, warm summers. Very comfortable, right?"
      },
      hint2: {
        text: "Les croissants, mon ami! Everyone here starts their day with croissants et café. C'est magnifique!",
        translation: "The croissants, my friend! Everyone here starts their day with croissants and coffee. It's magnificent!"
      },
      hint3: {
        text: "You see that tower there? La Tour Eiffel! Built in 1889, the most famous landmark in all of France!",
        translation: "You see that tower there? The Eiffel Tower! Built in 1889, the most famous landmark in all of France!"
      }
    }
  },
  {
    name: 'Tokyo, Japan',
    city: 'Tokyo',
    country: 'Japan',
    image: 'https://images.unsplash.com/photo-1621139151681-5ac8d73128ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b2t5byUyMGphcGFuJTIwc3RyZWV0fGVufDF8fHx8MTc2MzEyMDkzM3ww&ixlib=rb-4.1.0&q=80&w=1080',
    characters: [
      {
        id: '1',
        name: 'Yuki',
        hint: 'ここの新鮮な寿司を試しましたか？世界一ですよ!',
        romanization: 'Koko no shinsen na sushi wo tameshimashita ka? Sekai-ichi desu yo!',
        translation: 'Have you tried the fresh sushi here? Best in the world!',
        position: { x: 25, y: 58 },
        color: '#e91e63',
        mood: 'excited',
        description: 'An enthusiastic sushi chef who takes pride in the local seafood. She works at a traditional restaurant.',
        role: 'chef'
      },
      {
        id: '2',
        name: 'Kenji',
        hint: '毎年春には、私たちの首都で桜が美しく咲きます。',
        romanization: 'Maitoshi haru ni wa, watashitachi no shuto de sakura ga utsukushiku sakimasu.',
        translation: 'The cherry blossoms bloom beautifully in our capital every spring.',
        position: { x: 55, y: 62 },
        color: '#00bcd4',
        mood: 'happy',
        description: 'A friendly local who enjoys sharing the beauty of his hometown with visitors, especially during sakura season.',
        role: 'local'
      },
      {
        id: '3',
        name: 'Sakura',
        hint: 'ネオンサインと新幹線が、ここを世界最先端の都市にしています!',
        romanization: 'Neon sain to shinkansen ga, koko wo sekai saisentan no toshi ni shite imasu!',
        translation: 'Our neon signs and bullet trains make this the most high-tech city!',
        position: { x: 70, y: 55 },
        color: '#ff5722',
        mood: 'neutral',
        description: 'A tech-savvy train station worker who witnesses the city\'s amazing infrastructure every day.',
        role: 'worker'
      }
    ],
    acceptableAnswers: ['tokyo', 'japan', 'tokyo japan', 'tokyo, japan'],
    languageDifficulty: {
      level: 'Hard',
      description: 'Driver speaks mostly Japanese, minimal English'
    },
    driverName: 'Kenji',
    driverLanguages: ['JA', 'EN'],
    openingLine: "おはようございます！Ohayo gozaimasu! You look... tired, friend. Long night?",
    openingLineTranslation: "Good morning! You look... tired, friend. Long night?",
    progressiveHints: {
      hint1: {
        text: "気候は... humid in summer, cool in winter. Four seasons, very clear. 日本の典型的な気候です。",
        romanization: "Kikō wa... humid in summer, cool in winter. Four seasons, very clear. Nihon no tenkeiteki na kikō desu.",
        translation: "The climate is... humid in summer, cool in winter. Four seasons, very clear. It's typical Japanese climate."
      },
      hint2: {
        text: "新鮮な寿司！Shinsen na sushi! Everyone here loves raw fish... it's the best in the world, trust me!",
        romanization: "Shinsen na sushi! Everyone here loves raw fish... it's the best in the world, trust me!",
        translation: "Fresh sushi! Everyone here loves raw fish... it's the best in the world, trust me!"
      },
      hint3: {
        text: "渋谷交差点... Shibuya crossing! And 東京タワー—Tokyo Tower! The capital has everything, ne?",
        romanization: "Shibuya kōsaten... Shibuya crossing! And Tōkyō Tawā—Tokyo Tower! The capital has everything, ne?",
        translation: "Shibuya crossing... Shibuya crossing! And Tokyo Tower! The capital has everything, right?"
      }
    }
  },
  {
    name: 'Cairo, Egypt',
    city: 'Cairo',
    country: 'Egypt',
    image: 'https://images.unsplash.com/photo-1692986172150-ec32dccfa5f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWlybyUyMHB5cmFtaWRzJTIwZWd5cHR8ZW58MXx8fHwxNzYzMTM4MzkwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    characters: [
      {
        id: '1',
        name: 'Ahmed',
        hint: 'هذه الهياكل القديمة؟ بُنيت منذ أكثر من 4500 سنة من قبل الفراعنة!',
        romanization: 'Hadhihi al-hayakil al-qadeemah? Buniyat mundhu akthar min 4500 sanah min qibal al-faraenah!',
        translation: 'Those ancient structures? Built over 4,500 years ago by pharaohs!',
        position: { x: 30, y: 65 },
        color: '#ff9800',
        mood: 'mysterious',
        description: 'An experienced tour guide specializing in ancient Egyptian history. He has studied the pyramids for over 20 years.',
        role: 'guide'
      },
      {
        id: '2',
        name: 'Fatima',
        hint: 'نهر النيل يمر عبر مدينتنا، أطول نهر في أ��ريقيا!',
        romanization: 'Nahr al-Neel yamurr abra madeenatina, atwal nahr fee Ifriqiya!',
        translation: 'The Nile River flows through our city, the longest river in Africa!',
        position: { x: 60, y: 58 },
        color: '#795548',
        mood: 'happy',
        description: 'A local shopkeeper who grew up along the Nile. She loves sharing stories about her city with travelers.',
        role: 'vendor'
      },
      {
        id: '3',
        name: 'Omar',
        hint: 'أبو الهول العظيم يحرس هذه الأراضي. مرحباً بك في عجائب العالم القديم!',
        romanization: 'Abu al-Hawl al-Atheem yahrus hadhihi al-aradi. Marhaban bika fee ajaeb al-aalam al-qadeem!',
        translation: 'The Great Sphinx guards these lands. Welcome to ancient wonders!',
        position: { x: 75, y: 60 },
        color: '#607d8b',
        mood: 'neutral',
        description: 'A local resident who lives near the ancient monuments. He appreciates the rich cultural heritage of his homeland.',
        role: 'local'
      }
    ],
    acceptableAnswers: ['cairo', 'egypt', 'cairo egypt', 'cairo, egypt'],
    languageDifficulty: {
      level: 'Hard',
      description: 'Driver speaks mostly Arabic, minimal English'
    },
    driverName: 'Ahmed',
    driverLanguages: ['AR', 'EN'],
    openingLine: "مرحباً! Marhaba! Welcome, welcome! First time here? The morning sun is already hot today!",
    openingLineTranslation: "Hello! Welcome, welcome! First time here? The morning sun is already hot today!",
    progressiveHints: {
      hint1: {
        text: "الطقس هنا؟ Al-taqs? Very hot... desert climate. Dry, sunny, sometimes sandstorms. Very ancient land!",
        romanization: "Al-taqs huna? Very hot... desert climate. Dry, sunny, sometimes sandstorms. Very ancient land!",
        translation: "The weather here? Very hot... desert climate. Dry, sunny, sometimes sandstorms. Very ancient land!"
      },
      hint2: {
        text: "كشري! Kushari! Our national dish... rice, lentils, pasta, yummy! And فول—fool, fava beans for breakfast!",
        romanization: "Kushari! Our national dish... rice, lentils, pasta, yummy! And fool, fava beans for breakfast!",
        translation: "Kushari! Our national dish... rice, lentils, pasta, yummy! And fool, fava beans for breakfast!"
      },
      hint3: {
        text: "الأهرامات! Al-Ahramat! The Pyramids of Giza... 4,500 years old! One of Seven Wonders, yes?",
        romanization: "Al-Ahramat! The Pyramids of Giza... 4,500 years old! One of Seven Wonders, yes?",
        translation: "The Pyramids! The Pyramids of Giza... 4,500 years old! One of Seven Wonders, yes?"
      }
    }
  },
  {
    name: 'New York, USA',
    city: 'New York',
    country: 'USA',
    image: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXclMjB5b3JrJTIwY2l0eSUyMHNreWxpbmV8ZW58MXx8fHwxNzYzMTExOTU4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    characters: [
      {
        id: '1',
        name: 'Jake',
        hint: "Best pizza slices in the Big Apple! And don't miss Broadway!",
        position: { x: 22, y: 60 },
        color: '#f44336',
        mood: 'excited',
        description: 'A passionate pizza shop owner who loves everything about NYC. He grew up in Brooklyn and knows all the best spots.',
        role: 'vendor'
      },
      {
        id: '2',
        name: 'Emma',
        hint: 'The Statue of Liberty welcomes everyone to our harbor!',
        position: { x: 52, y: 58 },
        color: '#2196f3',
        mood: 'happy',
        description: 'A tour guide who specializes in American history and landmarks. She takes pride in showing visitors around the city.',
        role: 'guide'
      },
      {
        id: '3',
        name: 'Marcus',
        hint: 'Times Square lights up the city that never sleeps!',
        position: { x: 78, y: 62 },
        color: '#4caf50',
        mood: 'neutral',
        description: 'A local photographer who captures the energy of the city. He knows the best views and hidden spots.',
        role: 'artist'
      }
    ],
    acceptableAnswers: ['new york', 'nyc', 'new york city', 'new york usa', 'usa', 'america'],
    languageDifficulty: {
      level: 'Easy',
      description: 'Driver speaks clear English'
    },
    driverName: 'Jake',
    driverLanguages: ['EN'],
    openingLine: "Hey there! Rough night, huh? Don't worry, happens to the best of us. Let's get you sorted.",
    progressiveHints: {
      hint1: {
        text: "Climate here? Cold winters with snow, hot humid summers. Four seasons, you know? Pretty typical for the East Coast.",
        translation: "Climate here? Cold winters with snow, hot humid summers. Four seasons, you know? Pretty typical for the East Coast."
      },
      hint2: {
        text: "Pizza! Best pizza slices in the world, my friend. And hot dogs from the street carts—that's the real deal here!",
        translation: "Pizza! Best pizza slices in the world, my friend. And hot dogs from the street carts—that's the real deal here!"
      },
      hint3: {
        text: "The Statue of Liberty! And Times Square—the city that never sleeps! Broadway shows, Empire State Building... this is the Big Apple!",
        translation: "The Statue of Liberty! And Times Square—the city that never sleeps! Broadway shows, Empire State Building... this is the Big Apple!"
      }
    }
  },
  {
    name: 'Sydney, Australia',
    city: 'Sydney',
    country: 'Australia',
    image: 'https://images.unsplash.com/photo-1523059623039-a9ed027e7fad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzeWRuZXklMjBvcGVyYSUyMGhvdXNlfGVufDF8fHx8MTc2MzE2MzY4N3ww&ixlib=rb-4.1.0&q=80&w=1080',
    characters: [
      {
        id: '1',
        name: 'Jack',
        hint: 'G\'day mate! That Opera House is iconic, built right on the harbor!',
        position: { x: 28, y: 58 },
        color: '#ffeb3b',
        mood: 'happy',
        description: 'A cheerful local who loves welcoming visitors to Sydney. He enjoys surfing and knows all about the famous landmarks.',
        role: 'local'
      },
      {
        id: '2',
        name: 'Olivia',
        hint: 'Beautiful beaches everywhere! And you might see a kangaroo or two!',
        position: { x: 55, y: 60 },
        color: '#009688',
        mood: 'excited',
        description: 'A wildlife enthusiast and tour guide who specializes in Australian nature. She loves introducing visitors to the unique fauna.',
        role: 'guide'
      },
      {
        id: '3',
        name: 'Liam',
        hint: 'Southern hemisphere beauty! Harbor Bridge connects us all!',
        position: { x: 72, y: 55 },
        color: '#673ab7',
        mood: 'neutral',
        description: 'An engineer who worked on Harbor Bridge maintenance. He appreciates the architectural beauty of the city.',
        role: 'worker'
      }
    ],
    acceptableAnswers: ['sydney', 'australia', 'sydney australia', 'sydney, australia'],
    languageDifficulty: {
      level: 'Easy',
      description: 'Driver speaks clear English'
    },
    driverName: 'Jack',
    driverLanguages: ['EN'],
    openingLine: "G'day mate! You look like you had quite the night! No worries, we'll get you where you need to go.",
    progressiveHints: {
      hint1: {
        text: "G'day! The weather here? Warm and sunny most of the year, mate. Southern hemisphere, so seasons are flipped from up north!",
        translation: "G'day! The weather here? Warm and sunny most of the year, mate. Southern hemisphere, so seasons are flipped from up north!"
      },
      hint2: {
        text: "Vegemite on toast for brekkie! And meat pies, mate—we love our meat pies. Throw another shrimp on the barbie, as they say!",
        translation: "Vegemite on toast for breakfast! And meat pies, mate—we love our meat pies. Throw another shrimp on the barbie, as they say!"
      },
      hint3: {
        text: "The Opera House, mate! Right there on the harbor, looks like white sails. And the Harbor Bridge—we call it the Coathanger!",
        translation: "The Opera House, mate! Right there on the harbor, looks like white sails. And the Harbor Bridge—we call it the Coathanger!"
      }
    }
  },
  {
    name: 'Rio de Janeiro, Brazil',
    city: 'Rio de Janeiro',
    country: 'Brazil',
    image: 'https://images.unsplash.com/photo-1678044865436-29d7fcca4ffe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyaW8lMjBicmF6aWwlMjBiZWFjaHxlbnwxfHx8fDE3NjMxOTk5OTZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    characters: [
      {
        id: '1',
        name: 'Carlos',
        hint: 'É Carnaval! Samba, praias e sol o ano todo!',
        translation: 'Carnival time! Samba, beaches, and sunshine all year round!',
        position: { x: 25, y: 62 },
        color: '#ffc107',
        mood: 'excited',
        description: 'A samba dancer and carnival enthusiast who loves celebrating Brazilian culture. He performs in parades every year.',
        role: 'artist'
      },
      {
        id: '2',
        name: 'Isabella',
        hint: 'O Cristo Redentor vigia nossa linda cidade do alto da montanha!',
        translation: 'Christ the Redeemer watches over our beautiful city from the mountain!',
        position: { x: 58, y: 57 },
        color: '#8bc34a',
        mood: 'happy',
        description: 'A friendly tour guide who loves showing visitors the iconic landmarks of Rio. She grew up in the shadow of Christ the Redeemer.',
        role: 'guide'
      },
      {
        id: '3',
        name: 'Lucas',
        hint: 'A praia de Copacabana está lotada! Bem-vindo à Cidade Maravilhosa!',
        translation: 'Copacabana Beach is packed! Welcome to the Marvelous City!',
        position: { x: 75, y: 60 },
        color: '#03a9f4',
        mood: 'neutral',
        description: 'A beach vendor who sells refreshments at Copacabana. He knows everyone and everything happening in the area.',
        role: 'vendor'
      }
    ],
    acceptableAnswers: ['rio', 'rio de janeiro', 'brazil', 'rio brazil', 'rio, brazil'],
    languageDifficulty: {
      level: 'Medium',
      description: 'Driver mixes Portuguese and English'
    },
    driverName: 'Carlos',
    driverLanguages: ['PT', 'EN'],
    openingLine: "Oi! Bom dia! Good morning, my friend! You enjoying your visit? The beaches are beautiful today!",
    openingLineTranslation: "Hi! Good morning! You enjoying your visit? The beaches are beautiful today!",
    progressiveHints: {
      hint1: {
        text: "O clima aqui? Tropical, meu amigo! Warm all year, lots of sun. Perfect for the beach, sim?",
        translation: "The climate here? Tropical, my friend! Warm all year, lots of sun. Perfect for the beach, yes?"
      },
      hint2: {
        text: "Feijoada! Black bean stew with meat—delicioso! And caipirinha to drink. Every day is celebration here!",
        translation: "Feijoada! Black bean stew with meat—delicious! And caipirinha to drink. Every day is celebration here!"
      },
      hint3: {
        text: "Cristo Redentor! Christ the Redeemer stands on top of Corcovado Mountain. And Copacabana Beach—most famous in the world!",
        translation: "Christ the Redeemer! Christ the Redeemer stands on top of Corcovado Mountain. And Copacabana Beach—most famous in the world!"
      }
    }
  }
];

export default function App() {
  const [screen, setScreen] = useState<'menu' | 'howToPlay' | 'settings' | 'game'>('menu');
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'result' | 'summary'>('intro');
  const [visitedLocations, setVisitedLocations] = useState<string[]>([]); // Track visited locations
  const [currentRound, setCurrentRound] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [roundTimer, setRoundTimer] = useState(300); // 5 minutes in seconds
  const [roundStartTime, setRoundStartTime] = useState<number | null>(null);
  const [wrongGuessCount, setWrongGuessCount] = useState(0);
  const [revealedHints, setRevealedHints] = useState<Set<string>>(new Set());
  const [revealedTranslations, setRevealedTranslations] = useState<Set<string>>(new Set());
  const [lastResult, setLastResult] = useState<{
    correct: boolean;
    pointsEarned: number;
    timeRemaining: number;
    playerGuess?: string;
  } | null>(null);
  const [activeDialogue, setActiveDialogue] = useState<{
    characterId: string;
    name: string;
    hint: string;
    romanization?: string;
    translation?: string;
    color: string;
  } | null>(null);
  const [npcVoiceEnabled, setNpcVoiceEnabled] = useState(true);
  const [compassHeading, setCompassHeading] = useState(0);
  const [voiceStatus, setVoiceStatus] = useState<'idle' | 'listening' | 'processing' | 'replying'>('idle');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<ChatMessage[]>([]);
  const [isChatPanelOpen, setIsChatPanelOpen] = useState(false);
  const [showQuitDialog, setShowQuitDialog] = useState(false);
  const [conversationCount, setConversationCount] = useState(0); // Track conversations (not hints)
  const [reviewMode, setReviewMode] = useState(false); // Track if we're in review mode

  // NEW: State for LLM-generated scenarios
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoadingScenario, setIsLoadingScenario] = useState(false);
  const [scenarioError, setScenarioError] = useState<string | null>(null);

  const totalRounds = 6;
  const currentLocation = locations[currentRound];

  // Timer countdown effect
  useEffect(() => {
    if (gameState === 'playing' && !reviewMode && roundTimer > 0) {
      const interval = setInterval(() => {
        setRoundTimer(prev => {
          if (prev <= 1) {
            // Time's up!
            toast.error('Time\'s up!', {
              description: 'Moving to next round...',
              duration: 3000,
            });
            // Auto-submit with no guess
            setTimeout(() => {
              const pointsEarned = calculatePoints(0, revealedHints.size, revealedTranslations.size, wrongGuessCount);
              setTotalPoints(prevPoints => prevPoints + pointsEarned);
              setLastResult({
                correct: false,
                pointsEarned,
                timeRemaining: 0,
                playerGuess: undefined
              });
              setGameState('result');
            }, 1000);
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [gameState, reviewMode, roundTimer, revealedHints.size, revealedTranslations.size, wrongGuessCount]);

  // Function to generate a new scenario from the API
  const generateNewScenario = async (difficulty: 'Easy' | 'Medium' | 'Hard' = 'Medium') => {
    setIsLoadingScenario(true);
    setScenarioError(null);

    try {
      const response = await fetch('/api/generate-game', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usedLocations: locations.map(loc => loc.name),
          difficulty,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate scenario');
      }

      const newLocation: Location = await response.json();
      setLocations(prev => [...prev, newLocation]);
      setIsLoadingScenario(false);
      return newLocation;
    } catch (error) {
      console.error('Error generating scenario:', error);
      setScenarioError('Failed to generate scenario. Please try again.');
      setIsLoadingScenario(false);

      // Fallback to dummy data if API fails
      const fallbackLocation = DUMMY_LOCATIONS[locations.length % DUMMY_LOCATIONS.length];
      setLocations(prev => [...prev, fallbackLocation]);
      toast.error('Using fallback scenario due to generation error');
      return fallbackLocation;
    }
  };

  // Get collected hints for the right panel
  const collectedHints = currentLocation?.characters
    .filter(c => revealedHints.has(c.id))
    .map(c => ({
      id: c.id,
      characterName: c.name,
      hint: c.hint,
      translation: c.translation,
      color: c.color,
      translationRevealed: revealedTranslations.has(c.id)
    }));

  const handleStartGame = async () => {
    setScreen('game');
    setGameState('intro');
    setCurrentRound(0);
    setTotalPoints(0);
    setRoundTimer(300); // Reset to 5 minutes
    setWrongGuessCount(0);
    setRevealedHints(new Set());
    setRevealedTranslations(new Set());
    setActiveDialogue(null);
    setVisitedLocations([]);
    setReviewMode(false);
    setLocations([]); // Clear previous game locations

    // Generate the first scenario
    await generateNewScenario('Easy'); // Start with easy difficulty
  };

  const handleStartRound = () => {
    setGameState('playing');
    setReviewMode(false); // Ensure we're not in review mode when starting a round
    // Set a random compass heading for this location
    setCompassHeading(Math.floor(Math.random() * 360));
    // Reset conversation count and wrong guess counter for new round
    setConversationCount(0);
    setWrongGuessCount(0);
    setRoundTimer(300); // Reset timer to 5 minutes
    setRoundStartTime(Date.now()); // Start timing

    // Create initial driver message with opening line
    const openingMessage: ChatMessage = {
      id: Date.now().toString(),
      speaker: 'driver',
      text: `Your driver glances at you in the rear-view mirror and starts chatting: "${currentLocation.openingLine}"`,
      translation: currentLocation.openingLineTranslation,
      color: currentLocation.characters[0]?.color || '#10b981'
    };
    setConversationHistory([openingMessage]);
  };

  const handleCharacterClick = (characterId: string) => {
    const isNewHint = !revealedHints.has(characterId);
    setRevealedHints(prev => new Set([...prev, characterId]));

    // Notify about hint usage (affects points at the end)
    if (isNewHint) {
      toast.info(`Hint revealed`, {
        description: `Using hints will reduce your final points`,
        duration: 3000,
        position: 'top-center',
      });
    }

    // Set the active dialogue
    const character = currentLocation.characters.find(c => c.id === characterId);
    if (character) {
      setActiveDialogue({
        characterId: character.id,
        name: character.name,
        hint: character.hint,
        romanization: character.romanization,
        translation: character.translation,
        color: character.color
      });

      // Play hint audio if voice is enabled
      if (npcVoiceEnabled && character.hint) {
        playHintAudio(character.hint);
      }
    }
  };

  const playHintAudio = async (text: string) => {
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input: text }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate speech');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      setIsPlayingAudio(true);
      audio.onended = () => {
        setIsPlayingAudio(false);
        URL.revokeObjectURL(audioUrl);
      };

      await audio.play();
    } catch (error) {
      console.error('Error playing hint audio:', error);
      setIsPlayingAudio(false);
    }
  };

  const handleTranslationReveal = (characterId: string) => {
    const isNewTranslation = !revealedTranslations.has(characterId);
    setRevealedTranslations(prev => new Set([...prev, characterId]));

    // Notify about translation usage
    if (isNewTranslation) {
      toast.info(`Translation revealed`, {
        description: `Using translations will reduce your final points`,
        duration: 3000,
        position: 'top-center',
      });
    }

    // Update the conversation history to mark translation as revealed
    setConversationHistory(prev => prev.map(msg =>
      msg.characterId === characterId
        ? { ...msg, translationRevealed: true }
        : msg
    ));
  };

  // Point calculation function
  const calculatePoints = (timeRemaining: number, hintsUsed: number, translationsUsed: number, wrongGuesses: number) => {
    // Base points: 1000
    let points = 1000;

    // Time bonus: up to 500 points based on time remaining (300 seconds max)
    const timeBonus = Math.floor((timeRemaining / 300) * 500);
    points += timeBonus;

    // Hint penalty: -100 points per hint
    points -= hintsUsed * 100;

    // Translation penalty: -50 points per translation
    points -= translationsUsed * 50;

    // Wrong guess penalty: -75 points per wrong guess
    points -= wrongGuesses * 75;

    // Minimum 0 points
    return Math.max(0, points);
  };

  const handleGuess = (guess: string) => {
    const normalizedGuess = guess.toLowerCase().trim();
    const correct = currentLocation.acceptableAnswers.some(answer => {
      const normalizedAnswer = answer.toLowerCase().trim();
      // Check for exact match or partial match in either direction
      return normalizedGuess === normalizedAnswer ||
             normalizedGuess.includes(normalizedAnswer) ||
             normalizedAnswer.includes(normalizedGuess);
    });

    if (correct) {
      // Correct guess - calculate points for this round
      const hintsUsed = revealedHints.size;
      const translationsUsed = revealedTranslations.size;
      const wrongGuesses = wrongGuessCount;

      const pointsEarned = calculatePoints(roundTimer, hintsUsed, translationsUsed, wrongGuesses);
      setTotalPoints(prev => prev + pointsEarned);

      setLastResult({
        correct,
        pointsEarned,
        timeRemaining: roundTimer,
        playerGuess: guess
      });
      setGameState('result');
    } else {
      // Wrong guess - allow another attempt
      setWrongGuessCount(prev => prev + 1);

      // Show toast notification
      toast.error(`Wrong guess!`, {
        description: `Try again! (-75 points penalty)`,
        duration: 3000,
        position: 'top-center',
      });
    }
  };

  // Voice Control Handlers with real audio recording
  const handleTranscriptionComplete = useCallback(async (transcribedText: string) => {
    // Add player message to conversation
    const playerMessage: ChatMessage = {
      id: `player-${Date.now()}`,
      speaker: 'player',
      text: transcribedText
    };
    setConversationHistory(prev => [...prev, playerMessage]);

    // Set driver to processing state
    setVoiceStatus('processing');

    try {
      // Get driver response from LLM
      const response = await fetch('/api/driver-response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          playerQuestion: transcribedText,
          locationName: currentLocation?.name,
          driverName: currentLocation?.driverName,
          driverLanguages: currentLocation?.driverLanguages,
          difficulty: currentLocation?.languageDifficulty.level,
          conversationHistory,
          hintsGiven: revealedHints.size,
          progressiveHints: currentLocation?.progressiveHints,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get driver response');
      }

      const data = await response.json();

      // If it's a hint, track it
      if (data.isHint && data.hintLevel) {
        const hintId = `hint-${data.hintLevel}`;
        setRevealedHints(prev => new Set([...prev, hintId]));
        toast('Hint given (-100 points)', {
          icon: '💡',
          duration: 3000,
        });
      }

      // Add driver response to conversation
      const driverMessage: ChatMessage = {
        id: `driver-chat-${Date.now()}`,
        speaker: 'driver',
        text: data.response,
        color: currentLocation?.characters[0]?.color || '#10b981'
      };
      setConversationHistory(prev => [...prev, driverMessage]);
      setConversationCount(prev => prev + 1);

      // If voice is enabled, generate TTS audio
      if (npcVoiceEnabled) {
        setVoiceStatus('replying');
        await playDriverVoice(data.response);
      }

      setVoiceStatus('idle');
    } catch (error) {
      console.error('Error getting driver response:', error);
      toast.error('Failed to get driver response');
      setVoiceStatus('idle');
    }
  }, [currentLocation, conversationHistory, revealedHints, npcVoiceEnabled]);

  const playDriverVoice = async (text: string) => {
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input: text }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate speech');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      setIsPlayingAudio(true);
      audio.onended = () => {
        setIsPlayingAudio(false);
        URL.revokeObjectURL(audioUrl);
      };

      await audio.play();
    } catch (error) {
      console.error('Error playing driver voice:', error);
      setIsPlayingAudio(false);
    }
  };

  const { isRecording: isVoiceRecording, isProcessing, startRecording, stopRecording } = useVoiceRecording({
    onTranscriptionComplete: handleTranscriptionComplete,
    onError: (error) => {
      toast.error(error);
      setVoiceStatus('idle');
    }
  });

  const handleVoiceStart = () => {
    setVoiceStatus('listening');
    setIsChatPanelOpen(true);
    startRecording();
  };

  const handleVoiceStop = () => {
    stopRecording();
    setVoiceStatus('processing');
  };

  const handleSendTextMessage = async (message: string) => {
    // Reuse the same logic as voice transcription
    await handleTranscriptionComplete(message);
  };

  const handleChatClose = () => {
    setIsChatPanelOpen(false);
  };

  const handleReplayAudio = () => {
    if (!activeDialogue) return;
    
    setIsPlayingAudio(true);
    console.log('Replaying driver audio...');
    
    // Simulate audio playback
    setTimeout(() => {
      setIsPlayingAudio(false);
    }, 3000);
  };

  // NEW: Explicit hint request handler with progressive hints
  const handleRequestHint = () => {
    const nextHintNumber = revealedHints.size + 1;
    
    if (nextHintNumber > 3) {
      // No more hints available (max 3 hints)
      return;
    }

    // Get the progressive hint based on hint number
    let hintData;
    if (nextHintNumber === 1) {
      hintData = currentLocation.progressiveHints.hint1;
    } else if (nextHintNumber === 2) {
      hintData = currentLocation.progressiveHints.hint2;
    } else {
      hintData = currentLocation.progressiveHints.hint3;
    }
    
    // Add hint request message from player
    const playerMessage: ChatMessage = {
      id: `player-hint-${Date.now()}`,
      speaker: 'player',
      text: "Can you give me a hint?"
    };
    
    // Add driver response with progressive hint
    const driverMessage: ChatMessage = {
      id: `hint-${nextHintNumber}`,
      speaker: 'driver',
      text: hintData.text,
      romanization: hintData.romanization,
      translation: hintData.translation,
      color: currentLocation.characters[0]?.color || '#10b981',
      characterId: `hint-${nextHintNumber}`,
      translationRevealed: false
    };
    
    setConversationHistory(prev => [...prev, playerMessage, driverMessage]);
    
    // Track hint usage
    setRevealedHints(prev => new Set([...prev, `hint-${nextHintNumber}`]));

    // Show toast
    toast(`Hint requested (-100 points)`, {
      icon: '💡',
      duration: 3000,
    });
    
    setIsChatPanelOpen(true);
  };

  const handleNext = () => {
    // Transition from result overlay to summary screen
    setVisitedLocations(prev => [...prev, currentLocation.name]);
    setGameState('summary');
    setReviewMode(false); // Exit review mode when going to summary
  };

  const handleReviewRound = () => {
    // Enter review mode - switch to playing state but disable guessing
    setGameState('playing');
    setReviewMode(true);
  };

  const handleBackToSummary = () => {
    // Return from review mode to summary
    setGameState('summary');
    setReviewMode(false);
  };

  const handleNextRideFromReview = () => {
    // Go directly to next round from review mode
    setReviewMode(false);
    handleContinueFromSummary();
  };

  const handleContinueFromSummary = async () => {
    if (currentRound < totalRounds - 1) {
      // Determine difficulty based on round progression
      let difficulty: 'Easy' | 'Medium' | 'Hard' = 'Medium';
      if (currentRound < 2) difficulty = 'Easy';
      else if (currentRound >= 4) difficulty = 'Hard';

      // Generate next scenario before advancing
      await generateNewScenario(difficulty);

      setCurrentRound(prev => prev + 1);
      setRevealedHints(new Set());
      setRevealedTranslations(new Set());
      setActiveDialogue(null);
      setLastResult(null);
      setIsChatPanelOpen(false);
      setReviewMode(false);

      // Skip intro and go directly to playing with setup
      setGameState('playing');
      setCompassHeading(Math.floor(Math.random() * 360));
      setConversationCount(0);
      setWrongGuessCount(0);

      // Need to get the next location's opening line
      // This will be set after state update, so we use setTimeout
      setTimeout(() => {
        const nextLocation = locations[(currentRound + 1) % locations.length];
        if (nextLocation) {
          const openingMessage: ChatMessage = {
            id: Date.now().toString(),
            speaker: 'driver',
            text: nextLocation.openingLine,
            translation: nextLocation.openingLineTranslation,
            color: nextLocation.characters[0]?.color || '#10b981'
          };
          setConversationHistory([openingMessage]);
        }
      }, 0);
    } else {
      // Game over, return to menu
      setScreen('menu');
      setCurrentRound(0);
      setTotalPoints(0);
      setRevealedHints(new Set());
      setRevealedTranslations(new Set());
      setActiveDialogue(null);
      setLastResult(null);
      setVisitedLocations([]);
      setGameState('intro');
      setConversationHistory([]);
      setIsChatPanelOpen(false);
      setConversationCount(0);
      setReviewMode(false);
      setLocations([]);
    }
  };

  const handleQuitClick = () => {
    setShowQuitDialog(true);
  };

  const handleConfirmQuit = () => {
    setShowQuitDialog(false);
    handleReturnToMenu();
  };

  const handleReturnToMenu = () => {
    setScreen('menu');
    setCurrentRound(0);
    setTotalPoints(0);
    setRevealedHints(new Set());
    setRevealedTranslations(new Set());
    setActiveDialogue(null);
    setLastResult(null);
    setVisitedLocations([]);
    setGameState('intro');
    setConversationHistory([]);
    setIsChatPanelOpen(false);
    setReviewMode(false);
  };

  // Menu Navigation
  if (screen === 'menu') {
    return (
      <MainMenu
        onPlay={handleStartGame}
        onHowToPlay={() => setScreen('howToPlay')}
        onSettings={() => setScreen('settings')}
      />
    );
  }

  if (screen === 'howToPlay') {
    return (
      <HowToPlay
        onBack={() => setScreen('menu')}
        onStartGame={handleStartGame}
      />
    );
  }

  if (screen === 'settings') {
    return <Settings onBack={() => setScreen('menu')} />;
  }

  // Game Screen
  if (screen === 'game') {
    // Show loading screen while generating scenario
    if (isLoadingScenario || !currentLocation) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-800 to-slate-900">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-yellow-400 mx-auto"></div>
            <h2 className="text-2xl font-bold text-white">Generating Your Next Adventure...</h2>
            <p className="text-slate-300">Our AI is creating a unique scenario just for you</p>
          </div>
        </div>
      );
    }

    // Show Round Intro before playing
    if (gameState === 'intro') {
      return (
        <RoundIntro
          roundNumber={currentRound + 1}
          totalRounds={totalRounds}
          locationName={currentLocation.name}
          difficulty={currentLocation.languageDifficulty.level}
          onStart={handleStartRound}
        />
      );
    }

    return (
      <>
        <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900">
          {/* Right Panel */}
          <RightPanel
            totalPoints={totalPoints}
            roundTimer={roundTimer}
            round={currentRound + 1}
            totalRounds={totalRounds}
            onGuess={handleGuess}
            canGuess={!reviewMode}
            hintsUsed={revealedHints.size}
            translationsUsed={revealedTranslations.size}
            conversationMessages={conversationHistory}
            driverName={currentLocation.driverName}
            voiceEnabled={npcVoiceEnabled}
            onToggleVoice={setNpcVoiceEnabled}
            onTranslationReveal={handleTranslationReveal}
            onRequestHint={handleRequestHint}
            maxHints={3}
            reviewMode={reviewMode}
            onBackToSummary={handleBackToSummary}
            onNextRide={handleNextRideFromReview}
          />

          {/* Main Scene Area with Character Portraits */}
          <div className="absolute inset-y-4 left-4 right-[340px] md:right-[420px] flex items-center justify-center">
            <div className="relative w-full h-full">
              {/* Scene Frame */}
              <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20">
                <GameScene
                  backgroundImage={currentLocation.image}
                  characters={currentLocation.characters}
                  revealedCharacters={revealedHints}
                  onCharacterClick={handleCharacterClick}
                  languageDifficulty={currentLocation.languageDifficulty}
                  currentLocation={currentLocation.name}
                  compassHeading={compassHeading}
                  showDevHelpers={false}
                  showStreetViewOverlay={false}
                  driverName={currentLocation.driverName}
                  driverLanguages={currentLocation.driverLanguages}
                  voiceEnabled={npcVoiceEnabled}
                  driverState={
                    voiceStatus === 'replying' ? 'talking' 
                    : voiceStatus === 'processing' ? 'processing'
                    : voiceStatus === 'listening' ? 'listening'
                    : 'idle'
                  }
                  onVoiceStart={handleVoiceStart}
                  onVoiceStop={handleVoiceStop}
                  onTextSubmit={handleSendTextMessage}
                  isVoiceActive={isVoiceRecording}
                  driverVoiceEnabled={npcVoiceEnabled}
                  onToggleDriverVoice={setNpcVoiceEnabled}
                  onReplayAudio={handleReplayAudio}
                  canReplay={!!activeDialogue && npcVoiceEnabled}
                />
              </div>

              {/* Corner Decorations */}
              <div className="absolute -top-2 -left-2 w-8 h-8 border-t-4 border-l-4 border-yellow-400 rounded-tl-lg" />
              <div className="absolute -top-2 -right-2 w-8 h-8 border-t-4 border-r-4 border-yellow-400 rounded-tr-lg" />
              <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-4 border-l-4 border-yellow-400 rounded-bl-lg" />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-4 border-r-4 border-yellow-400 rounded-br-lg" />

              {/* Quit/Exit Button - Top Left Corner */}
              <div className="absolute -top-3 -left-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleQuitClick}
                  className="h-10 px-3 bg-slate-900/95 hover:bg-red-900/95 border-2 border-slate-700 hover:border-red-600 text-slate-300 hover:text-white shadow-lg backdrop-blur-sm transition-all duration-300"
                >
                  <X className="w-4 h-4 mr-2" />
                  <span className="text-sm">Quit</span>
                </Button>
              </div>
            </div>
          </div>

        </div>

        {lastResult && (
          <>
            <ResultDialog
              open={gameState === 'result'}
              correct={lastResult.correct}
              correctAnswer={currentLocation.name}
              pointsEarned={lastResult.pointsEarned}
              timeRemaining={lastResult.timeRemaining}
              hintsUsed={revealedHints.size}
              onNext={handleNext}
              onReview={lastResult.correct ? handleReviewRound : undefined}
              isLastRound={currentRound === totalRounds - 1}
              totalPoints={totalPoints}
              locationImage={currentLocation.image}
              playerGuess={lastResult.playerGuess}
              translationsUsed={revealedTranslations.size}
              wrongGuessCount={wrongGuessCount}
            />
            
            <RideSummary
              open={gameState === 'summary'}
              wasCorrect={lastResult.correct}
              locationName={currentLocation.name}
              pointsEarned={lastResult.pointsEarned}
              hintsUsed={revealedHints.size}
              translationsUsed={revealedTranslations.size}
              wrongGuessCount={wrongGuessCount}
              visitedLocations={visitedLocations}
              currentRound={currentRound + 1}
              totalRounds={totalRounds}
              totalPoints={totalPoints}
              onContinue={handleContinueFromSummary}
              onMainMenu={handleReturnToMenu}
            />
          </>
        )}

        {/* Quit Confirmation Dialog */}
        <AlertDialog open={showQuitDialog} onOpenChange={setShowQuitDialog}>
          <AlertDialogContent className="bg-slate-900 border-slate-700">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 text-white">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                Quit Current Game?
              </AlertDialogTitle>
              <AlertDialogDescription asChild>
                <div className="text-slate-300">
                  <p>Are you sure you want to quit? Your current progress will be lost, including:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-slate-400">
                    <li>Current points: {totalPoints}</li>
                    <li>Round progress: {currentRound + 1} of {totalRounds}</li>
                    <li>Conversation history</li>
                  </ul>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700">
                Continue Playing
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmQuit}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Quit to Menu
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        
        {/* Toast notifications */}
        <Toaster richColors closeButton />
      </>
    );
  }

  return null;
}
