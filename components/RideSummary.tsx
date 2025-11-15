import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  DollarSign, 
  MapPin, 
  Lightbulb, 
  Languages, 
  Target, 
  TrendingUp, 
  ArrowRight, 
  Home,
  CheckCircle,
  XCircle,
  Map
} from 'lucide-react';
import { motion } from 'motion/react';

interface RideSummaryProps {
  open: boolean;
  wasCorrect: boolean;
  locationName: string;
  pointsEarned: number;
  hintsUsed: number;
  translationsUsed: number;
  wrongGuessCount: number;
  visitedLocations: string[]; // List of locations visited so far
  currentRound: number;
  totalRounds: number;
  totalPoints: number;
  onContinue: () => void;
  onMainMenu: () => void;
}

export function RideSummary({
  open,
  wasCorrect,
  locationName,
  pointsEarned,
  hintsUsed,
  translationsUsed,
  wrongGuessCount,
  visitedLocations,
  currentRound,
  totalRounds,
  totalPoints,
  onContinue,
  onMainMenu,
}: RideSummaryProps) {
  if (!open) return null;

  // Calculate breakdown (for display purposes)
  const hintPenalty = hintsUsed * 100;
  const translationPenalty = translationsUsed * 50;
  const wrongGuessPenalty = wrongGuessCount * 75;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/95 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-3xl my-auto"
      >
        <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-yellow-500/30 shadow-2xl">
          <CardContent className="p-4 sm:p-6">
            {/* Header - Compact */}
            <div className="text-center mb-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full mb-2 shadow-lg"
              >
                <DollarSign className="w-7 h-7 text-white" />
              </motion.div>
              <h2 className="text-white text-2xl mb-1">Ride Summary</h2>
              <p className="text-slate-400 text-sm">
                Round {currentRound} of {totalRounds} Complete
              </p>
            </div>

            {/* Points Breakdown - Compact */}
            <div className="bg-slate-800/50 rounded-lg p-4 mb-4 border border-slate-700">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-yellow-400" />
                <h3 className="text-white">Points Breakdown</h3>
              </div>

              <div className="space-y-2">
                {/* Guess Result */}
                <div className="flex items-center justify-between py-1.5 px-2 rounded bg-slate-900/50 border border-slate-700/50">
                  <div className="flex items-center gap-2">
                    {wasCorrect ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-400" />
                    )}
                    <span className="text-slate-300 text-sm">Wrong Guesses</span>
                    <Badge variant="outline" className="bg-slate-800 border-slate-600 text-slate-400 text-xs px-1.5 py-0">
                      {wrongGuessCount}
                    </Badge>
                  </div>
                  <span className={`text-sm ${wrongGuessCount > 0 ? 'text-red-400' : 'text-green-400'}`}>
                    {wrongGuessCount > 0 ? `-${wrongGuessPenalty}` : '0'}
                  </span>
                </div>

                {/* Hints Used */}
                <div className="flex items-center justify-between py-1.5 px-2 rounded bg-slate-900/50 border border-slate-700/50">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-blue-400" />
                    <span className="text-slate-300 text-sm">Hints Used</span>
                    <Badge variant="outline" className="bg-slate-800 border-slate-600 text-slate-400 text-xs px-1.5 py-0">
                      {hintsUsed}
                    </Badge>
                  </div>
                  <span className={`text-sm ${hintsUsed > 0 ? 'text-red-400' : 'text-green-400'}`}>
                    {hintsUsed > 0 ? `-${hintPenalty}` : '0'}
                  </span>
                </div>

                {/* Translations Used */}
                <div className="flex items-center justify-between py-1.5 px-2 rounded bg-slate-900/50 border border-slate-700/50">
                  <div className="flex items-center gap-2">
                    <Languages className="w-4 h-4 text-purple-400" />
                    <span className="text-slate-300 text-sm">Translations Used</span>
                    <Badge variant="outline" className="bg-slate-800 border-slate-600 text-slate-400 text-xs px-1.5 py-0">
                      {translationsUsed}
                    </Badge>
                  </div>
                  <span className={`text-sm ${translationsUsed > 0 ? 'text-red-400' : 'text-green-400'}`}>
                    {translationsUsed > 0 ? `-${translationPenalty}` : '0'}
                  </span>
                </div>

                <Separator className="bg-slate-700 my-2" />

                {/* Total Points This Ride */}
                <div className="flex items-center justify-between py-2 px-2 rounded bg-gradient-to-r from-yellow-900/30 to-yellow-800/20 border-2 border-yellow-600/50">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-yellow-400" />
                    <span className="text-white text-sm">This Round Points</span>
                  </div>
                  <span className="text-lg text-yellow-400">
                    {pointsEarned}
                  </span>
                </div>

                {/* Running Total */}
                <div className="flex items-center justify-between px-2 py-1">
                  <span className="text-slate-400 text-sm">Journey Total Points</span>
                  <span className="text-slate-200 text-sm">
                    {totalPoints.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Visited Locations - Compact */}
            <div className="bg-slate-800/50 rounded-lg p-4 mb-4 border border-slate-700">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Map className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-white">Your Journey</h3>
                </div>
                <p className="text-slate-400 text-xs">
                  {visitedLocations.length} of {totalRounds}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {visitedLocations.map((location, index) => (
                  <motion.div
                    key={location}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * index }}
                    className="flex items-center gap-1.5 bg-slate-900/50 rounded px-2 py-1.5 border border-slate-700/50"
                  >
                    <MapPin className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                    <span className="text-slate-300 text-xs truncate">{location}</span>
                  </motion.div>
                ))}
                {/* Placeholder for future locations */}
                {Array.from({ length: totalRounds - visitedLocations.length }).map((_, index) => (
                  <div
                    key={`placeholder-${index}`}
                    className="flex items-center gap-1.5 bg-slate-900/30 rounded px-2 py-1.5 border border-dashed border-slate-700/50"
                  >
                    <MapPin className="w-3 h-3 text-slate-600 flex-shrink-0" />
                    <span className="text-slate-600 text-xs">???</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                onClick={onMainMenu}
                variant="outline"
                className="flex-1 h-10 border-2 border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                <Home className="w-4 h-4 mr-2" />
                Return to Menu
              </Button>
              <Button
                onClick={onContinue}
                className="flex-1 h-10 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-700 hover:to-yellow-600 text-white shadow-lg border-2 border-yellow-400/50"
              >
                {currentRound < totalRounds ? 'Continue Journey' : 'View Final Results'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
