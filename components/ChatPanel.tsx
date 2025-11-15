import { useState, useEffect, useRef } from 'react';
import { User, Languages, DollarSign, Lightbulb, Mic, Send, X, Volume2, VolumeX } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { SpeakingIndicator } from './SpeakingWaveform';
import { Switch } from './ui/switch';
import { AIDriverBehaviorNotes } from './AIDriverBehaviorNotes';

export interface ChatMessage {
  id: string;
  speaker: 'player' | 'driver' | 'system';
  text: string;
  romanization?: string;
  translation?: string;
  color?: string;
  characterId?: string;
  translationRevealed?: boolean;
}

interface ChatPanelProps {
  messages: ChatMessage[];
  driverName: string;
  isActive: boolean;
  isListening: boolean;
  isProcessing: boolean;
  isSpeaking: boolean;
  voiceEnabled: boolean;
  onSendMessage: (message: string) => void;
  onTranslationReveal: (characterId: string) => void;
  onClose: () => void;
  onToggleVoice?: (enabled: boolean) => void;
}

export function ChatPanel({
  messages,
  driverName,
  isActive,
  isListening,
  isProcessing,
  isSpeaking,
  voiceEnabled,
  onSendMessage,
  onTranslationReveal,
  onClose,
  onToggleVoice
}: ChatPanelProps) {
  const [textInput, setTextInput] = useState('');
  const [expandedTranslations, setExpandedTranslations] = useState<Set<string>>(new Set());
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendText = () => {
    if (textInput.trim()) {
      onSendMessage(textInput.trim());
      setTextInput('');
    }
  };

  const handleToggleTranslation = (messageId: string, characterId?: string) => {
    const isExpanding = !expandedTranslations.has(messageId);
    
    if (isExpanding) {
      // Track translation reveal for scoring
      if (characterId) {
        onTranslationReveal(characterId);
      }
      setExpandedTranslations(prev => new Set([...prev, messageId]));
    } else {
      // Collapsing translation (no effect on score)
      setExpandedTranslations(prev => {
        const newSet = new Set(prev);
        newSet.delete(messageId);
        return newSet;
      });
    }
  };

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!isActive) {
    return null;
  }

  const TRANSLATION_COST = 2; // $2 per translation

  return (
    <div className="absolute bottom-24 left-6 w-[500px] max-w-[calc(100vw-32rem)] z-30 animate-in slide-in-from-bottom-4">
      {/* DEV ONLY: AI Driver Behavior Notes - Remove before production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-4">
          <AIDriverBehaviorNotes />
        </div>
      )}
      
      <Card className="bg-slate-900/98 backdrop-blur-md border-2 border-emerald-500/50 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700/50 bg-gradient-to-r from-emerald-600/20 to-blue-600/20">
          <div className="flex items-center gap-3 flex-1">
            <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
              isSpeaking ? 'bg-emerald-400 animate-pulse scale-125' 
              : isProcessing ? 'bg-yellow-400 animate-pulse'
              : isListening ? 'bg-blue-400 animate-pulse'
              : 'bg-emerald-400 animate-pulse'
            }`} />
            <span className="text-white">Conversation with {driverName}</span>
            <Badge 
              variant="outline" 
              className={`text-xs transition-all duration-300 ${
                isSpeaking ? 'bg-emerald-900/30 border-emerald-600/50 text-emerald-300 animate-pulse'
                : isProcessing ? 'bg-yellow-900/30 border-yellow-600/50 text-yellow-300'
                : isListening ? 'bg-blue-900/30 border-blue-600/50 text-blue-300'
                : 'bg-emerald-900/30 border-emerald-600/50 text-emerald-300'
              }`}
            >
              {isSpeaking ? 'Speaking...' 
               : isProcessing ? 'Thinking...' 
               : isListening ? 'Listening...' 
               : 'Active'}
            </Badge>
          </div>

          {/* Voice Toggle */}
          {onToggleVoice && (
            <div className="flex items-center gap-2 mr-2 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50">
              {voiceEnabled ? (
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-slate-400" />
              )}
              <span className="text-xs text-slate-300">Voice</span>
              <Switch
                checked={voiceEnabled}
                onCheckedChange={onToggleVoice}
                className="data-[state=checked]:bg-emerald-600 scale-75"
              />
            </div>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 hover:bg-slate-700/50"
          >
            <X className="w-4 h-4 text-slate-400" />
          </Button>
        </div>

        {/* Messages Area */}
        <ScrollArea className="h-[400px]" ref={scrollAreaRef}>
          <div className="p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <Mic className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400 text-sm">
                  Start the conversation by speaking or typing below
                </p>
              </div>
            ) : (
              messages.map((message, index) => {
                const isDriver = message.speaker === 'driver';
                const isSystem = message.speaker === 'system';
                const isPlayer = message.speaker === 'player';
                const hasTranslation = message.translation && message.translation !== message.text;
                const hasRomanization = message.romanization && message.romanization !== message.text;
                const showTranslation = expandedTranslations.has(message.id);
                const isLastMessage = index === messages.length - 1;
                const showSpeakingIndicator = isDriver && isLastMessage && isSpeaking && voiceEnabled;

                // Render system messages with distinct styling
                if (isSystem) {
                  return (
                    <div key={message.id} className="mb-4">
                      <div className="bg-amber-500/10 border border-amber-500/40 rounded-lg px-4 py-3 shadow-md">
                        <div className="flex items-start gap-2">
                          <Lightbulb className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                          <p className="text-amber-200 text-sm italic leading-relaxed flex-1">
                            {message.text}
                          </p>
                        </div>
                        {/* Translation toggle for system messages */}
                        {hasTranslation && (
                          <div className="mt-3 pt-2 border-t border-amber-500/20">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleTranslation(message.id, message.characterId)}
                              className="h-7 px-3 -ml-2 text-xs hover:bg-amber-500/10 text-amber-300 hover:text-amber-200"
                            >
                              <Languages className="w-3 h-3 mr-1.5" />
                              {showTranslation ? 'Hide translation' : 'Show translation'}
                              {!showTranslation && !message.translationRevealed && (
                                <Badge
                                  variant="outline"
                                  className="ml-2 bg-emerald-900/30 border-emerald-600/50 text-emerald-300 text-xs px-1.5 py-0"
                                >
                                  +${TRANSLATION_COST}
                                </Badge>
                              )}
                            </Button>
                            {showTranslation && (
                              <div className="mt-2 pl-3 border-l-2 border-amber-500/40 animate-in fade-in slide-in-from-top-2 duration-200">
                                <p className="text-slate-300 text-xs leading-relaxed italic">
                                  {message.translation}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }

                // Render player and driver messages as alternating bubbles
                return (
                  <div
                    key={message.id}
                    className={`flex items-start gap-3 ${isPlayer ? 'flex-row-reverse' : ''}`}
                  >
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <Avatar className={`w-10 h-10 border-2 shadow-lg ${
                        isDriver ? 'border-emerald-400/50' : 'border-blue-400/50'
                      }`}>
                        <AvatarFallback
                          className="text-white text-sm"
                          style={{
                            backgroundColor: isDriver ? (message.color || '#10b981') : '#3b82f6'
                          }}
                        >
                          {isDriver ? getInitials(driverName) : <User className="w-5 h-5" />}
                        </AvatarFallback>
                      </Avatar>
                    </div>

                    {/* Message Bubble */}
                    <div className={`flex-1 min-w-0 max-w-[85%] ${isPlayer ? 'flex flex-col items-end' : ''}`}>
                      {/* Name label */}
                      <div className={`mb-1 flex items-center gap-2 ${isPlayer ? 'flex-row-reverse' : ''}`}>
                        <span className="text-xs text-slate-400">
                          {isDriver ? driverName : 'You'}
                        </span>
                      </div>

                      {/* Message Content */}
                      <div
                        className={`rounded-2xl px-4 py-3 shadow-md border-2 relative ${
                          isPlayer ? 'rounded-tr-sm' : 'rounded-tl-sm'
                        }`}
                        style={
                          isDriver
                            ? {
                                backgroundColor: (message.color || '#10b981') + '15',
                                borderColor: (message.color || '#10b981') + '50',
                              }
                            : {
                                backgroundColor: '#3b82f6',
                                borderColor: '#2563eb'
                              }
                        }
                      >
                        {/* Voice Active Indicator for driver */}
                        {isDriver && voiceEnabled && (
                          <div className="absolute -top-2 -right-2 w-5 h-5 bg-emerald-500 rounded-full border-2 border-slate-900 flex items-center justify-center shadow-lg">
                            <Volume2 className="w-3 h-3 text-white" />
                          </div>
                        )}
                        
                        {/* Message Text */}
                        <p className={`text-white leading-relaxed text-sm ${isPlayer ? 'text-right' : ''}`}>
                          {message.text}
                        </p>

                        {/* Romanization (Driver messages only) */}
                        {isDriver && hasRomanization && (
                          <div className="mt-2 pt-2 border-t border-slate-400/20">
                            <p className="text-blue-300 text-xs leading-relaxed font-mono">
                              {message.romanization}
                            </p>
                          </div>
                        )}

                        {/* Translation Section (Driver messages only) */}
                        {isDriver && hasTranslation && (
                          <div className="mt-3 pt-3 border-t border-slate-400/20 space-y-2">
                            {/* Translation Toggle Button with Cost */}
                            <div className="flex items-center justify-between">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleToggleTranslation(message.id, message.characterId)}
                                className="h-7 px-3 -ml-2 text-xs hover:bg-slate-700/50 text-slate-300 hover:text-white"
                              >
                                <Languages className="w-3 h-3 mr-1.5" />
                                {showTranslation ? 'Hide translation' : 'Show translation'}
                              </Button>

                              {/* Cost Indicator - Only show if not yet revealed */}
                              {!message.translationRevealed && !showTranslation && (
                                <Badge
                                  variant="outline"
                                  className="bg-emerald-900/40 border-emerald-600/60 text-emerald-300 text-xs px-2 py-0.5"
                                >
                                  <DollarSign className="w-3 h-3 mr-0.5" />
                                  +{TRANSLATION_COST}
                                </Badge>
                              )}

                              {/* Already Revealed Badge */}
                              {message.translationRevealed && (
                                <Badge
                                  variant="outline"
                                  className="bg-yellow-900/30 border-yellow-600/50 text-yellow-300 text-xs px-2 py-0.5"
                                >
                                  <Lightbulb className="w-3 h-3 mr-1" />
                                  -10 pts
                                </Badge>
                              )}
                            </div>

                            {/* Translation Text - Shown when expanded */}
                            {showTranslation && (
                              <div className="pl-3 border-l-2 border-emerald-500/50 animate-in fade-in slide-in-from-top-2 duration-200">
                                <p className="text-slate-300 text-xs leading-relaxed italic">
                                  {message.translation}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Speaking Indicator - Show next to latest driver message when speaking */}
                      {showSpeakingIndicator && (
                        <div className="mt-2 animate-in fade-in slide-in-from-bottom-2">
                          <SpeakingIndicator color={message.color || '#10b981'} />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 border-t border-slate-700/50 bg-slate-900/50">
          {isListening ? (
            // Listening Indicator
            <div className="flex items-center justify-center gap-3 py-4">
              <div className="relative">
                <Mic className="w-6 h-6 text-red-500 animate-pulse" />
                <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping" />
              </div>
              <span className="text-white animate-pulse">Listening...</span>
              <div className="flex gap-1">
                <div className="w-1 h-4 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1 h-4 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1 h-4 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          ) : isProcessing ? (
            // Processing Indicator
            <div className="flex items-center justify-center gap-3 py-4">
              <div className="w-6 h-6 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-white">Processing...</span>
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          ) : isSpeaking ? (
            // Responding Indicator
            <div className="flex items-center justify-center gap-3 py-4">
              <SpeakingIndicator showText={false} />
              <span className="text-emerald-300">Responding...</span>
            </div>
          ) : (
            // Text Input
            <div className="flex items-center gap-2">
              <Input
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendText()}
                placeholder="Type your message..."
                className="flex-1 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20"
              />
              <Button
                onClick={handleSendText}
                disabled={!textInput.trim()}
                size="icon"
                className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Helper Text */}
        {!isListening && !isProcessing && messages.length === 0 && (
          <div className="px-4 pb-3 text-center">
            <p className="text-xs text-slate-500">
              Hold the microphone button to speak, or type your message above
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
