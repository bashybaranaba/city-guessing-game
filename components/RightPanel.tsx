import { useState, useEffect, useRef } from "react";
import {
  Trophy,
  MapPin,
  Lightbulb,
  Send,
  Lock,
  Globe,
  Navigation,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Info,
  Languages,
  Minus,
  User,
  MessageSquare,
  Volume2,
  VolumeX,
  MessageCircle,
  Eye,
  XCircle,
} from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Switch } from "./ui/switch";

interface ChatMessage {
  id: string;
  speaker: "player" | "driver" | "system";
  text: string;
  romanization?: string;
  translation?: string;
  color?: string;
  characterId?: string;
  translationRevealed?: boolean;
}

interface RightPanelProps {
  totalPoints: number;
  roundTimer: number;
  round: number;
  totalRounds: number;
  onGuess: (guess: string) => void;
  canGuess: boolean;
  hintsUsed: number;
  translationsUsed: number;
  conversationMessages: ChatMessage[];
  driverName: string;
  voiceEnabled: boolean;
  onToggleVoice: (enabled: boolean) => void;
  onTranslationReveal: (characterId: string) => void;
  onRequestHint: () => void;
  maxHints: number;
  reviewMode?: boolean;
  onBackToSummary?: () => void;
  onNextRide?: () => void;
}

export function RightPanel({
  totalPoints,
  roundTimer,
  round,
  totalRounds,
  onGuess,
  canGuess,
  hintsUsed,
  translationsUsed,
  conversationMessages,
  driverName,
  voiceEnabled,
  onToggleVoice,
  onTranslationReveal,
  onRequestHint,
  maxHints,
  reviewMode = false,
  onBackToSummary,
  onNextRide,
}: RightPanelProps) {
  const [guess, setGuess] = useState("");
  const [showConversation, setShowConversation] = useState(true);
  const [showUnlockNotification, setShowUnlockNotification] = useState(false);
  const [prevCanGuess, setPrevCanGuess] = useState(false);
  const [expandedTranslations, setExpandedTranslations] = useState<Set<string>>(
    new Set()
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Show notification when guessing becomes available
  useEffect(() => {
    if (canGuess && !prevCanGuess) {
      setShowUnlockNotification(true);
      // Hide notification after 4 seconds
      const timer = setTimeout(() => {
        setShowUnlockNotification(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
    setPrevCanGuess(canGuess);
  }, [canGuess, prevCanGuess]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversationMessages]);

  const handleSubmit = () => {
    if (guess.trim() && canGuess) {
      onGuess(guess.trim());
      // Keep the guess in the field for wrong guesses - user can modify and try again
      // The field will be cleared on successful guess when result dialog opens
    }
  };

  const handleToggleTranslation = (messageId: string, characterId?: string) => {
    const newExpanded = new Set(expandedTranslations);
    const isExpanding = !expandedTranslations.has(messageId);

    if (isExpanding) {
      newExpanded.add(messageId);
      // Track translation reveal for scoring
      if (characterId) {
        onTranslationReveal(characterId);
      }
    } else {
      newExpanded.delete(messageId);
    }

    setExpandedTranslations(newExpanded);
  };

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="absolute top-0 right-0 bottom-0 w-80 md:w-96 z-10 flex flex-col">
      <div className="p-2 rounded-none border-l-4 border-[#FFC832] bg-gradient-to-b from-slate-900/98 to-slate-800/98 backdrop-blur-sm shadow-2xl flex flex-col flex-1 min-h-0">
        {/* Header */}
        <div className="mt-2 p-4 bg-gradient-to-br from-slate-800 to-slate-900 border-b-2 border-[#FFC832]/30">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="text-white/80 text-xs flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                Round {round} of {totalRounds}
              </div>
            </div>
          </div>

          {/* Timer and Points Display */}
          <div className="space-y-2">
            {/* Timer */}
            <div
              className={`rounded-lg p-3 flex items-center justify-between border-2 ${
                roundTimer <= 30
                  ? "bg-red-500 border-red-600 animate-pulse"
                  : roundTimer <= 60
                  ? "bg-orange-500 border-orange-600"
                  : "bg-blue-500 border-blue-600"
              }`}
            >
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-6 h-6 bg-white/20 rounded">
                  <Navigation className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm text-white font-medium">
                  Time Remaining
                </span>
              </div>
              <span className="text-2xl text-white tabular-nums font-bold">
                {Math.floor(roundTimer / 60)}:
                {String(roundTimer % 60).padStart(2, "0")}
              </span>
            </div>

            {/* Points */}
            <div className="bg-[#FFC832] rounded-lg p-3 flex items-center justify-between border-2 border-[#E6B42E]">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-6 h-6 bg-slate-900 rounded">
                  <Trophy className="w-4 h-4 text-[#FFC832]" />
                </div>
                <span className="text-sm text-slate-900 font-medium">
                  Total Points
                </span>

                {/* Points Info Popover */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 hover:bg-[#E6B42E] rounded-full"
                    >
                      <Info className="w-4 h-4 text-slate-900" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-80 bg-slate-900 border-slate-700"
                    align="start"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 pb-2 border-b border-slate-700">
                        <Trophy className="w-5 h-5 text-[#FFC832]" />
                        <h3 className="text-white">How Points Work</h3>
                      </div>

                      <div className="space-y-3 text-sm">
                        {/* Base Points */}
                        <div className="flex items-start gap-2">
                          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-emerald-900/30 flex items-center justify-center border border-emerald-700/50">
                            <Trophy className="w-4 h-4 text-emerald-400" />
                          </div>
                          <div>
                            <p className="text-slate-200">Base Points</p>
                            <p className="text-emerald-400 text-xs">
                              1000 points per round
                            </p>
                          </div>
                        </div>

                        {/* Time Bonus */}
                        <div className="flex items-start gap-2">
                          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-900/30 flex items-center justify-center border border-blue-700/50">
                            <Navigation className="w-4 h-4 text-blue-400" />
                          </div>
                          <div>
                            <p className="text-slate-200">Time Bonus</p>
                            <p className="text-blue-400 text-xs">
                              Up to +500 points (faster = more points)
                            </p>
                          </div>
                        </div>

                        {/* Penalties */}
                        <div className="pt-2 border-t border-slate-700 space-y-2">
                          <p className="text-slate-300 text-xs font-semibold">
                            Penalties:
                          </p>
                          <div className="space-y-1.5 pl-2">
                            <p className="text-red-400 text-xs">
                              • Wrong Guess: -75 points
                            </p>
                            <p className="text-red-400 text-xs">
                              • Each Hint: -100 points
                            </p>
                            <p className="text-red-400 text-xs">
                              • Each Translation: -50 points
                            </p>
                          </div>
                        </div>

                        {/* Best Strategy */}
                        <div className="pt-2 border-t border-slate-700">
                          <p className="text-[#FFC832] text-xs flex items-center gap-1">
                            <Lightbulb className="w-3 h-3" />
                            <span>
                              Tip: Answer quickly without hints for maximum
                              points!
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <span className="text-2xl text-slate-900 tabular-nums font-bold">
                {totalPoints.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Hints Section - Moved here so it's always visible */}
        <div className="px-4">
          <div className="mt-2 p-3 bg-slate-800/50 rounded-lg border-2 border-[#FFC832]/40 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-[#FFC832]" />
                <span className="text-white text-sm">Hints Available</span>
                <Badge
                  variant="outline"
                  className="bg-slate-900 border-[#FFC832]/60 text-[#FFC832] text-xs"
                >
                  {hintsUsed}/{maxHints}
                </Badge>
              </div>
            </div>
            <p className="text-xs text-slate-400 mb-2">
              Request a hint (-100 points penalty)
            </p>
            <Button
              onClick={onRequestHint}
              disabled={hintsUsed >= maxHints}
              size="sm"
              className="w-full bg-[#FFC832] hover:bg-[#E6B42E] text-[#111318] disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              <Lightbulb className="w-4 h-4 mr-2" />
              {hintsUsed >= maxHints ? "All Hints Used" : "Get Hint (-100pts)"}
            </Button>
          </div>
        </div>

        {/* Conversation Section */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="p-3 flex-shrink-0">
            {/* Conversation Header - Toggleable */}
            <Collapsible
              open={showConversation}
              onOpenChange={setShowConversation}
            >
              <div className="flex items-center gap-2">
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex-1 flex items-center justify-between p-3 hover:bg-slate-800/50 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-emerald-500" />
                      <h3 className="text-white">Conversation</h3>
                      <Badge
                        variant="secondary"
                        className={`
                          border-2 transition-all duration-300
                          ${
                            conversationMessages.length === 0
                              ? "bg-slate-700 text-slate-300 border-slate-600"
                              : "bg-emerald-900/50 text-emerald-300 border-emerald-600"
                          }
                        `}
                      >
                        {conversationMessages.length}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      {showConversation ? (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </Button>
                </CollapsibleTrigger>

                {/* Voice Toggle - Outside button */}
                <div className="flex items-center gap-1.5 px-2 py-1.5 rounded bg-slate-800/50 border border-slate-700/50">
                  {voiceEnabled ? (
                    <Volume2 className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <VolumeX className="w-3 h-3 text-slate-400" />
                  )}
                  <Switch
                    checked={voiceEnabled}
                    onCheckedChange={onToggleVoice}
                    className="data-[state=checked]:bg-emerald-600 scale-75"
                  />
                </div>
              </div>

              <ScrollArea className="h-40">
                <div className="px-2 pt-4">
                  {conversationMessages.length === 0 ? (
                    <div className="text-center py-8">
                      <MessageSquare className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                      <p className="text-slate-400 text-sm">
                        Press and hold the microphone to start talking
                      </p>
                    </div>
                  ) : (
                    conversationMessages.map((message) => {
                      const isDriver = message.speaker === "driver";
                      const hasTranslation =
                        message.translation &&
                        message.translation !== message.text;
                      const hasRomanization =
                        message.romanization &&
                        message.romanization !== message.text;
                      const showTranslation = expandedTranslations.has(
                        message.id
                      );

                      return (
                        <div
                          key={message.id}
                          className={`flex items-start gap-2 ${
                            !isDriver ? "flex-row-reverse" : ""
                          }`}
                        >
                          {/* Avatar */}
                          <div className="flex-shrink-0">
                            <Avatar
                              className={`w-8 h-8 border-2 shadow-lg ${
                                isDriver
                                  ? "border-emerald-400/50"
                                  : "border-blue-400/50"
                              }`}
                            >
                              <AvatarFallback
                                className="text-white text-xs"
                                style={{
                                  backgroundColor: isDriver
                                    ? message.color || "#10b981"
                                    : "#3b82f6",
                                }}
                              >
                                {isDriver ? (
                                  getInitials(driverName)
                                ) : (
                                  <User className="w-4 h-4" />
                                )}
                              </AvatarFallback>
                            </Avatar>
                          </div>

                          {/* Message Bubble */}
                          <div
                            className={`flex-1 min-w-0 ${
                              !isDriver ? "flex flex-col items-end" : ""
                            }`}
                          >
                            <div
                              className={`mb-1 flex items-center gap-1.5 ${
                                !isDriver ? "flex-row-reverse" : ""
                              }`}
                            >
                              <span className="text-xs text-slate-300">
                                {isDriver ? driverName : "You"}
                              </span>
                            </div>

                            {/* Message Content */}
                            <div
                              className={`rounded-xl px-3 py-2 shadow-md border relative text-sm ${
                                !isDriver ? "rounded-tr-sm" : "rounded-tl-sm"
                              } ${!isDriver ? "max-w-[85%]" : ""} ${
                                isDriver && voiceEnabled ? "border-l-4" : ""
                              }`}
                              style={
                                isDriver
                                  ? {
                                      backgroundColor:
                                        (message.color || "#10b981") + "20",
                                      borderColor:
                                        (message.color || "#10b981") + "40",
                                      borderLeftColor: voiceEnabled
                                        ? "#10b981"
                                        : undefined,
                                    }
                                  : {
                                      backgroundColor: "#3b82f6",
                                      borderColor: "#2563eb",
                                    }
                              }
                            >
                              {/* Voice Active Indicator */}
                              {isDriver && voiceEnabled && (
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-900 flex items-center justify-center shadow-lg">
                                  <Volume2 className="w-2.5 h-2.5 text-white" />
                                </div>
                              )}
                              {/* Original Text */}
                              <div>
                                <p
                                  className={`text-white leading-relaxed text-xs ${
                                    !isDriver ? "text-right" : ""
                                  }`}
                                >
                                  {message.text}
                                </p>
                                {showTranslation && hasTranslation && (
                                  <p
                                    className={`text-slate-300 text-xs leading-relaxed italic mt-1.5 ${
                                      !isDriver ? "text-right" : ""
                                    }`}
                                  >
                                    {message.translation}
                                  </p>
                                )}
                              </div>

                              {/* Romanization */}
                              {isDriver && hasRomanization && (
                                <div className="mt-1.5 pt-1.5 border-t border-slate-400/30">
                                  <p className="text-blue-400 text-xs leading-relaxed font-mono">
                                    {message.romanization}
                                  </p>
                                </div>
                              )}

                              {/* Translation Toggle (Driver messages only) */}
                              {isDriver && hasTranslation && (
                                <div className="mt-2 flex items-center justify-between">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      handleToggleTranslation(
                                        message.id,
                                        message.characterId
                                      )
                                    }
                                    className="h-6 px-2 -ml-1 text-xs hover:bg-slate-700/50 text-slate-300 hover:text-white"
                                  >
                                    <Languages className="w-3 h-3 mr-1" />
                                    {showTranslation ? "Hide" : "Show"}
                                    {showTranslation ? (
                                      <ChevronUp className="w-3 h-3 ml-1" />
                                    ) : (
                                      <ChevronDown className="w-3 h-3 ml-1" />
                                    )}
                                  </Button>

                                  {/* Translation Used Badge */}
                                  {message.translationRevealed && (
                                    <Badge
                                      variant="outline"
                                      className="bg-yellow-900/30 border-yellow-600/50 text-yellow-300 text-xs"
                                    >
                                      <Lightbulb className="w-2.5 h-2.5 mr-1" />
                                      -10
                                    </Badge>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </Collapsible>
          </div>
        </div>

        <Separator className="flex-shrink-0" />

        {/* Guess Section or Review Mode Actions */}
        {reviewMode ? (
          // Review Mode - Read-only with navigation buttons
          <div className="p-4 bg-gradient-to-b from-slate-900/50 to-slate-900/80 flex-shrink-0">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <h3 className="text-white">Round Completed</h3>
            </div>

            {/* Info Text */}
            <p className="text-xs text-slate-400 mb-3">
              You've completed this ride. Review the conversation or continue
              your journey.
            </p>

            <div className="space-y-2">
              {/* Disabled Input - Shows completion */}
              <div className="relative">
                <Input
                  placeholder="Round completed"
                  value=""
                  disabled={true}
                  className="bg-slate-800/60 border-2 border-green-600/40 text-slate-500 cursor-not-allowed"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex gap-2">
                <Button
                  onClick={onBackToSummary}
                  variant="outline"
                  className="flex-1 border-2 border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white"
                  size="lg"
                >
                  Back to Summary
                </Button>
                <Button
                  onClick={onNextRide}
                  className="flex-1 bg-[#27C46A] hover:bg-[#22A85A] text-white shadow-lg"
                  size="lg"
                >
                  Next Ride
                </Button>
              </div>
            </div>
          </div>
        ) : (
          // Normal Guess Section
          <div className="p-4 bg-gradient-to-b from-slate-900/50 to-slate-900/80 flex-shrink-0">
            <div className="flex items-center gap-2 mb-3">
              <Navigation className="w-5 h-5 text-yellow-400" />
              <h3 className="text-white">Make Your Guess</h3>
            </div>

            {/* Condensed Helper Text with Popover */}
            <div className="mb-3 flex items-center gap-1.5 justify-center">
              <p className="text-xs text-slate-400">
                Answer fast for maximum points!
              </p>
              <Popover>
                <PopoverTrigger asChild>
                  <button className="text-slate-400 hover:text-slate-200 transition-colors">
                    <Info className="w-3.5 h-3.5" />
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-72 p-0 bg-slate-900 border-slate-700"
                  align="end"
                  side="top"
                  sideOffset={8}
                >
                  <div className="p-4">
                    <h4 className="text-white text-sm mb-3 flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-[#FFC832]" />
                      Points Breakdown
                    </h4>

                    <div className="space-y-3 text-xs">
                      <div className="bg-[#FFC832]/10 p-3 rounded border border-[#FFC832]/30">
                        <p className="text-slate-300 mb-1.5">
                          <span className="text-[#FFC832]">
                            🎯 Perfect Score:
                          </span>
                        </p>
                        <p className="text-slate-400">
                          Answer quickly with no hints = 1500 points!
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <XCircle className="w-3.5 h-3.5 text-red-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-slate-300">
                              <strong>Wrong Guess:</strong> -75 points
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2">
                          <Lightbulb className="w-3.5 h-3.5 text-[#FFC832] mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-slate-300">
                              <strong>Hints:</strong> -100 points each
                            </p>
                            <p className="text-slate-400 mt-0.5">
                              {hintsUsed}/{maxHints} used
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2">
                          <Languages className="w-3.5 h-3.5 text-purple-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-slate-300">
                              <strong>Translations:</strong> -50 points each
                            </p>
                            <p className="text-slate-400 mt-0.5">
                              {translationsUsed} revealed
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-emerald-900/20 p-2.5 rounded border border-emerald-700/30">
                        <p className="text-emerald-200 text-xs">
                          <strong>💬 Conversations are free!</strong> Chat with
                          your driver as much as you want.
                        </p>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-3">
              {/* City/Country Input */}
              <div className="relative">
                <Input
                  placeholder="Enter city or country..."
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  disabled={!canGuess}
                  className="bg-black/60 border-2 border-yellow-600/40 text-white placeholder:text-slate-500 focus:border-yellow-500 focus:ring-yellow-500/20"
                />
              </div>

              {/* Submit Button - Clear space around it */}
              <Button
                onClick={handleSubmit}
                disabled={!canGuess || !guess.trim()}
                className="w-full bg-[#FFC832] hover:bg-[#E6B42E] text-[#111318] shadow-lg"
                size="lg"
              >
                <Send className="w-4 h-4 mr-2" />
                Submit Destination
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
