import { DollarSign, MapPin, Lightbulb, Globe } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface GameHUDProps {
  fare: number;
  round: number;
  totalRounds: number;
  hintsRevealed: number;
  totalHints: number;
  onGuess: () => void;
  canGuess: boolean;
}

export function GameHUD({
  fare,
  round,
  totalRounds,
  hintsRevealed,
  totalHints,
  onGuess,
  canGuess,
}: GameHUDProps) {
  return (
    <div className="absolute top-0 left-0 right-0 z-10">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left: Game Title */}
            <div className="flex items-center gap-3">
              <Globe className="w-7 h-7 text-white" />
              <div>
                <h1 className="text-white text-xl">Lost in Transportation</h1>
                <div className="text-white/80 text-sm flex items-center gap-2">
                  <MapPin className="w-3 h-3" />
                  Round {round} of {totalRounds}
                </div>
              </div>
            </div>

            {/* Center: Stats */}
            <div className="hidden md:flex items-center gap-3">
              {/* Fare Meter */}
              <TooltipProvider>
                <Tooltip delayDuration={300}>
                  <TooltipTrigger asChild>
                    <Badge
                      variant="secondary"
                      className="px-4 py-2 bg-[#FFC832] border-2 border-[#E6B42E] cursor-help hover:scale-105 transition-transform"
                    >
                      <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center w-6 h-6 bg-slate-900 rounded">
                          <DollarSign className="w-4 h-4 text-[#FFC832]" />
                        </div>
                        <div className="text-left">
                          <div className="text-[10px] text-slate-900/70 leading-none mb-0.5">
                            FARE
                          </div>
                          <div className="text-slate-900 tabular-nums leading-none">
                            ${fare}
                          </div>
                        </div>
                      </div>
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    className="max-w-[250px] bg-slate-900 border-[#FFC832]/30"
                  >
                    <p className="text-sm text-white">
                      Each wrong guess adds to your fare. Hints and translations
                      also increase your fare.{" "}
                      <strong>Aim for the lowest fare possible.</strong>
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Badge variant="secondary" className="px-4 py-2 bg-white/95">
                <Lightbulb className="w-4 h-4 mr-2 inline text-yellow-500" />
                <span>
                  Hints: {hintsRevealed}/{totalHints}
                </span>
              </Badge>
            </div>

            {/* Right: Guess Button */}
            <Button
              onClick={onGuess}
              disabled={!canGuess}
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white shadow-lg"
            >
              Make a Guess!
            </Button>
          </div>

          {/* Mobile Stats */}
          <div className="md:hidden flex items-center gap-2 mt-2">
            {/* Fare Meter - Mobile */}
            <TooltipProvider>
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <Badge
                    variant="secondary"
                    className="px-3 py-1 bg-[#FFC832] border border-[#E6B42E] text-sm cursor-help"
                  >
                    <DollarSign className="w-3 h-3 mr-1 inline text-slate-900" />
                    <span className="text-slate-900">${fare}</span>
                  </Badge>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  className="max-w-[200px] bg-slate-900 border-[#FFC832]/30"
                >
                  <p className="text-xs text-white">
                    Wrong guesses, hints, and translations increase your fare.
                    Aim for the lowest fare!
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Badge
              variant="secondary"
              className="px-3 py-1 bg-white/95 text-sm"
            >
              <Lightbulb className="w-3 h-3 mr-1 inline text-yellow-500" />
              {hintsRevealed}/{totalHints}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
