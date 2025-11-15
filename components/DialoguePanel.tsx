import { useState } from 'react';
import { User, Languages, ChevronDown, ChevronUp, MessageCircle, Lightbulb } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';

interface DialoguePanelProps {
  characterName: string | null;
  characterColor: string;
  dialogue: string | null;
  romanization?: string | null;
  translation?: string | null;
  isVisible: boolean;
  // New props for player/driver conversation
  driverName?: string;
  playerMessage?: string | null;
  isPlayerSpeaking?: boolean;
  // Translation tracking
  characterId?: string | null;
  onTranslationReveal?: (characterId: string) => void;
  translationRevealed?: boolean;
}

/**
 * DialoguePanel Component
 * 
 * Displays a chat-like conversation between the player and taxi driver.
 * Shows driver messages on the left with avatar, player messages on the right.
 * Supports dual subtitles (original language + optional translation).
 */
export function DialoguePanel({ 
  characterName, 
  characterColor, 
  dialogue, 
  romanization, 
  translation, 
  isVisible,
  driverName,
  playerMessage,
  isPlayerSpeaking = false,
  characterId = null,
  onTranslationReveal,
  translationRevealed = false,
}: DialoguePanelProps) {
  const [showTranslation, setShowTranslation] = useState(translationRevealed);
  const hasTranslation = translation && translation !== dialogue;
  const hasRomanization = romanization && romanization !== dialogue;

  // Handle translation toggle
  const handleToggleTranslation = () => {
    const newState = !showTranslation;
    setShowTranslation(newState);
    
    // If revealing for the first time, track it
    if (newState && !translationRevealed && characterId && onTranslationReveal) {
      onTranslationReveal(characterId);
    }
  };

  if (!isVisible || (!dialogue && !playerMessage)) {
    return null;
  }

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const displayName = driverName || characterName || 'Driver';

  return (
    <div className="absolute bottom-6 left-6 right-[340px] md:right-[420px] z-20">
      <Card className="bg-slate-900/95 backdrop-blur-md border-2 border-slate-700 shadow-2xl">
        <div className="p-5 space-y-4">
          {/* Header - Conversation Indicator */}
          <div className="flex items-center gap-2 pb-3 border-b border-slate-700/50">
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-slate-300">Conversation with {displayName}</span>
          </div>

          {/* Messages Container */}
          <div className="space-y-4 max-h-[200px] overflow-y-auto">
            {/* Driver Message */}
            {dialogue && !isPlayerSpeaking && (
              <div className="flex items-start gap-3">
                {/* Driver Avatar */}
                <div className="flex-shrink-0">
                  <Avatar className="w-10 h-10 border-2 border-emerald-400/50 shadow-lg">
                    <AvatarFallback 
                      className="text-white text-sm"
                      style={{ backgroundColor: characterColor }}
                    >
                      {getInitials(displayName)}
                    </AvatarFallback>
                  </Avatar>
                </div>

                {/* Driver Message Bubble */}
                <div className="flex-1 min-w-0">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="text-sm text-slate-300">{displayName}</span>
                    <span className="text-xs text-slate-500">Driver</span>
                  </div>
                  
                  {/* Message Bubble */}
                  <div 
                    className="rounded-2xl rounded-tl-sm px-4 py-3 shadow-md border"
                    style={{ 
                      backgroundColor: characterColor + '20',
                      borderColor: characterColor + '40'
                    }}
                  >
                    {/* Original Dialogue */}
                    <div>
                      <p className="text-white leading-relaxed">
                        {dialogue}
                      </p>
                      {showTranslation && hasTranslation && (
                        <p className="text-slate-300 text-sm leading-relaxed italic mt-2">
                          {translation}
                        </p>
                      )}
                    </div>

                    {/* Romanization */}
                    {hasRomanization && (
                      <div className="mt-2 pt-2 border-t border-slate-400/30">
                        <p className="text-blue-400 text-sm leading-relaxed font-mono">
                          {romanization}
                        </p>
                      </div>
                    )}

                    {/* Translation Toggle */}
                    {hasTranslation && (
                      <div className="mt-3 flex items-center justify-between">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleToggleTranslation}
                          className="h-7 px-3 -ml-2 text-xs hover:bg-slate-700/50 text-slate-300 hover:text-white"
                        >
                          <Languages className="w-3 h-3 mr-1.5" />
                          {showTranslation ? (
                            <>
                              Hide translation
                              <ChevronUp className="w-3 h-3 ml-1.5" />
                            </>
                          ) : (
                            <>
                              Show translation
                              <ChevronDown className="w-3 h-3 ml-1.5" />
                            </>
                          )}
                        </Button>
                        
                        {/* Translation Used Badge */}
                        {translationRevealed && (
                          <Badge 
                            variant="outline" 
                            className="bg-yellow-900/30 border-yellow-600/50 text-yellow-300 text-xs"
                          >
                            <Lightbulb className="w-3 h-3 mr-1" />
                            Translation used
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Language Indicators */}
                    {!hasTranslation && hasRomanization && (
                      <div className="flex items-center gap-3 mt-2 pt-2 border-t border-slate-400/20">
                        <div className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                          <span className="text-xs text-blue-400">Latin script</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Player Message */}
            {playerMessage && isPlayerSpeaking && (
              <div className="flex items-start gap-3 flex-row-reverse">
                {/* Player Avatar */}
                <div className="flex-shrink-0">
                  <Avatar className="w-10 h-10 border-2 border-blue-400/50 shadow-lg">
                    <AvatarFallback className="bg-blue-600 text-white text-sm">
                      <User className="w-5 h-5" />
                    </AvatarFallback>
                  </Avatar>
                </div>

                {/* Player Message Bubble */}
                <div className="flex-1 min-w-0 flex flex-col items-end">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="text-xs text-slate-500">You</span>
                    <span className="text-sm text-slate-300">Player</span>
                  </div>
                  
                  {/* Message Bubble */}
                  <div className="rounded-2xl rounded-tr-sm px-4 py-3 shadow-md bg-blue-600/90 border border-blue-500/50 max-w-[80%]">
                    <p className="text-white leading-relaxed text-right">
                      {playerMessage}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
