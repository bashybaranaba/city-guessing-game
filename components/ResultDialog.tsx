import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Separator } from './ui/separator';
import { CheckCircle, XCircle, DollarSign, MapPin, Lightbulb, ArrowRight, RotateCcw, AlertCircle, History, Languages, Target, TrendingUp } from 'lucide-react';
import { motion, useAnimationControls } from 'motion/react';
import { StreetViewWindow } from './StreetViewWindow';

interface ResultDialogProps {
  open: boolean;
  correct: boolean;
  correctAnswer: string;
  pointsEarned: number;
  timeRemaining: number;
  hintsUsed: number;
  onNext: () => void;
  onReview?: () => void;
  isLastRound: boolean;
  totalPoints: number;
  locationImage?: string;
  playerGuess?: string;
  translationsUsed?: number;
  wrongGuessCount?: number;
}

export function ResultDialog({
  open,
  correct,
  correctAnswer,
  pointsEarned,
  timeRemaining,
  hintsUsed,
  onNext,
  onReview,
  isLastRound,
  totalPoints,
  locationImage = '',
  playerGuess = '',
  translationsUsed = 0,
  wrongGuessCount = 0
}: ResultDialogProps) {
  const [allowInteraction, setAllowInteraction] = React.useState(false);
  const [animatedPoints, setAnimatedPoints] = React.useState(0);
  const meterControls = useAnimationControls();

  // Reset interaction lock and animate points when dialog opens
  React.useEffect(() => {
    if (open) {
      setAllowInteraction(false);
      setAnimatedPoints(0);

      // Start meter animation
      meterControls.start({
        rotate: [0, 10, -5, 0],
        transition: { duration: 0.5 }
      });

      // Animate points counter
      const duration = 1500;
      const steps = 30;
      const increment = pointsEarned / steps;
      let currentStep = 0;

      const timer = setInterval(() => {
        currentStep++;
        if (currentStep >= steps) {
          setAnimatedPoints(pointsEarned);
          clearInterval(timer);
        } else {
          setAnimatedPoints(Math.floor(increment * currentStep));
        }
      }, duration / steps);

      // Allow interaction after animation
      const interactionTimer = setTimeout(() => {
        setAllowInteraction(true);
      }, 1800);

      return () => {
        clearInterval(timer);
        clearTimeout(interactionTimer);
      };
    }
  }, [open, pointsEarned, meterControls]);

  // Prevent Enter key from immediately closing dialog when it opens
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !allowInteraction) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const handleNext = () => {
    if (allowInteraction) {
      onNext();
    }
  };

  const handleReview = () => {
    if (allowInteraction && onReview) {
      onReview();
    }
  };

  // Calculate point penalties
  const WRONG_GUESS_PENALTY = 75;
  const HINT_PENALTY = 100;
  const TRANSLATION_PENALTY = 50;

  const wrongGuessPenalty = wrongGuessCount * WRONG_GUESS_PENALTY;
  const hintsPenalty = hintsUsed * HINT_PENALTY;
  const translationsPenalty = translationsUsed * TRANSLATION_PENALTY;

  // Calculate time bonus (up to 500 points for full time remaining)
  const timeBonus = Math.floor((timeRemaining / 300) * 500);

  return (
    <Dialog open={open}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto p-0 gap-0" onKeyDown={handleKeyDown}>
        <DialogTitle className="sr-only">
          {correct ? 'Ride Complete - Points Earned' : 'Missed Destination - Incorrect Guess'}
        </DialogTitle>
        <DialogDescription className="sr-only">
          {correct
            ? `You correctly guessed ${correctAnswer}. Points earned this round: ${pointsEarned}.`
            : `The correct answer was ${correctAnswer}. You guessed ${playerGuess}. Try the next ride!`
          }
        </DialogDescription>
        {correct ? (
          // =================== CORRECT RIDE OVERLAY ===================
          <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Header with Taxi Yellow Accent */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 border-b-4 border-[#FFC832]">
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="w-16 h-16 bg-[#27C46A] rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg"
                >
                  <CheckCircle className="w-10 h-10 text-white" />
                </motion.div>
                <h2 className="text-2xl text-white mb-1">Ride Complete – Points Earned</h2>
                <p className="text-slate-400 text-sm">You reached your destination: {correctAnswer}</p>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* Fare Meter Display */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="bg-[#FFC832] border-4 border-[#E6B42E] shadow-2xl overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <motion.div
                          animate={meterControls}
                          className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center"
                        >
                          <Target className="w-8 h-8 text-[#FFC832]" />
                        </motion.div>
                        <div>
                          <div className="text-xs text-slate-900/70 uppercase tracking-wide">Points Earned</div>
                          <div className="text-sm text-slate-900">This round</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-slate-900/70 uppercase tracking-wide mb-1">Total</div>
                        <motion.div
                          className="text-5xl tabular-nums text-slate-900"
                          key={animatedPoints}
                        >
                          {animatedPoints}
                        </motion.div>
                      </div>
                    </div>

                    {/* Meter Progress Bar */}
                    <div className="h-2 bg-slate-900/20 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: `${Math.min((animatedPoints / Math.max(pointsEarned, 1)) * 100, 100)}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full bg-slate-900 rounded-full"
                      />
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Points Breakdown Table */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="border-2 border-slate-300 shadow-lg">
                  <div className="p-4">
                    <h3 className="text-sm text-slate-700 mb-3 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Points Breakdown
                    </h3>

                    <div className="space-y-2">
                      {/* Base Points */}
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                            <Target className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="text-sm text-slate-700">Base Points</div>
                            <div className="text-xs text-slate-500">Correct guess</div>
                          </div>
                        </div>
                        <div className="text-lg tabular-nums text-green-600">
                          +1000
                        </div>
                      </div>

                      {/* Time Bonus */}
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                            <History className="w-4 h-4 text-green-600" />
                          </div>
                          <div>
                            <div className="text-sm text-slate-700">Time Bonus</div>
                            <div className="text-xs text-slate-500">{timeRemaining}s remaining</div>
                          </div>
                        </div>
                        <div className="text-lg tabular-nums text-green-600">
                          +{timeBonus}
                        </div>
                      </div>

                      {/* Wrong Guesses */}
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                            <XCircle className="w-4 h-4 text-red-600" />
                          </div>
                          <div>
                            <div className="text-sm text-slate-700">Wrong Guesses</div>
                            <div className="text-xs text-slate-500">{wrongGuessCount} × {WRONG_GUESS_PENALTY}</div>
                          </div>
                        </div>
                        <div className="text-lg tabular-nums text-red-600">
                          {wrongGuessCount > 0 ? `-${wrongGuessPenalty}` : '0'}
                        </div>
                      </div>

                      {/* Hints */}
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center">
                            <Lightbulb className="w-4 h-4 text-yellow-600" />
                          </div>
                          <div>
                            <div className="text-sm text-slate-700">Hints Requested</div>
                            <div className="text-xs text-slate-500">{hintsUsed} × {HINT_PENALTY}</div>
                          </div>
                        </div>
                        <div className="text-lg tabular-nums text-red-600">
                          {hintsUsed > 0 ? `-${hintsPenalty}` : '0'}
                        </div>
                      </div>

                      {/* Translations */}
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                            <Languages className="w-4 h-4 text-purple-600" />
                          </div>
                          <div>
                            <div className="text-sm text-slate-700">Translations</div>
                            <div className="text-xs text-slate-500">{translationsUsed} × {TRANSLATION_PENALTY}</div>
                          </div>
                        </div>
                        <div className="text-lg tabular-nums text-red-600">
                          {translationsUsed > 0 ? `-${translationsPenalty}` : '0'}
                        </div>
                      </div>

                      <Separator />

                      {/* Total */}
                      <div className="flex items-center justify-between p-3 bg-[#FFC832]/20 rounded-lg border-2 border-[#FFC832]">
                        <div className="text-sm text-slate-900">Round Points</div>
                        <div className="text-2xl tabular-nums text-slate-900">
                          {pointsEarned}
                        </div>
                      </div>
                    </div>

                    {/* Performance Badge */}
                    {pointsEarned >= 1400 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.8, type: "spring" }}
                        className="mt-4 text-center"
                      >
                        <Badge className="bg-[#27C46A] text-white text-sm px-4 py-2">
                          🎯 Excellent! High Score!
                        </Badge>
                      </motion.div>
                    )}
                  </div>
                </Card>
              </motion.div>

              {/* Location Preview */}
              {locationImage && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Card className="overflow-hidden border-2 border-slate-300 shadow-lg">
                    <div className="relative h-40 bg-slate-200">
                      <StreetViewWindow
                        imageUrl={locationImage}
                        showOverlay={true}
                        location={correctAnswer}
                        showLocationLabel={true}
                        heading={Math.floor(Math.random() * 360)}
                      />
                      
                      {/* Location Pin */}
                      <motion.div
                        initial={{ scale: 0, y: -30 }}
                        animate={{ scale: 1, y: 0 }}
                        transition={{ 
                          type: "spring",
                          stiffness: 200,
                          damping: 10,
                          delay: 0.8
                        }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
                      >
                        <MapPin className="w-12 h-12 text-[#27C46A] fill-[#27C46A] drop-shadow-2xl" />
                      </motion.div>
                    </div>
                  </Card>
                </motion.div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                {onReview && (
                  <Button
                    onClick={handleReview}
                    variant="outline"
                    className="flex-1 border-2 border-slate-400 text-slate-700 hover:bg-slate-100 hover:border-slate-500 h-11"
                    disabled={!allowInteraction}
                  >
                    <History className="w-4 h-4 mr-2" />
                    Review Ride
                  </Button>
                )}
                <Button
                  onClick={handleNext}
                  className="flex-1 bg-[#27C46A] hover:bg-[#22A85A] text-white shadow-lg h-11"
                  disabled={!allowInteraction}
                >
                  {isLastRound ? (
                    <>
                      View Summary
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  ) : (
                    <>
                      Next Ride
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          // =================== MISSED RIDE OVERLAY ===================
          <div className="relative overflow-hidden bg-white">
            {/* Softer Amber Banner for Wrong Guess */}
            <div className="bg-gradient-to-r from-amber-500 to-orange-400 p-4 border-b-4 border-amber-600 shadow-lg">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <motion.div
                    initial={{ scale: 0, rotate: 0 }}
                    animate={{ scale: 1, rotate: [0, -10, 10, -10, 0] }}
                    transition={{ 
                      scale: { type: "spring", stiffness: 200, damping: 15 },
                      rotate: { duration: 0.5, delay: 0.2 }
                    }}
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg"
                  >
                    <AlertCircle className="w-6 h-6 text-amber-600" />
                  </motion.div>
                  <div>
                    <h2 className="text-white">Close, but this ride was in...</h2>
                    <p className="text-white/80 text-xs">Keep exploring!</p>
                  </div>
                </div>
                <div className="bg-[#111318] rounded-lg px-4 py-2 border-2 border-[#111318] shadow-lg">
                  <div className="text-xs text-amber-400 text-center">POINTS EARNED</div>
                  <div className="text-2xl text-[#F5F5F5] tabular-nums text-center">{pointsEarned}</div>
                  <div className="text-xs text-amber-400 text-center">this round</div>
                </div>
              </div>
            </div>

            <div className="p-4 space-y-3">
              {/* Correct Location Reveal */}
              {locationImage && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card className="overflow-hidden border-2 border-slate-300 shadow-xl">
                    <div className="relative h-48 bg-slate-200">
                      <StreetViewWindow
                        imageUrl={locationImage}
                        showOverlay={true}
                        location={correctAnswer}
                        showLocationLabel={true}
                        heading={Math.floor(Math.random() * 360)}
                      />
                      
                      {/* Correct Location Pin */}
                      <motion.div
                        initial={{ scale: 0, y: -50 }}
                        animate={{ scale: 1, y: 0 }}
                        transition={{ 
                          type: "spring",
                          stiffness: 200,
                          damping: 10,
                          delay: 0.4
                        }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
                      >
                        <div className="relative">
                          <MapPin className="w-16 h-16 text-blue-500 fill-blue-500 drop-shadow-2xl" />
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-500 rounded-full border-2 border-white flex items-center justify-center shadow-lg">
                            <XCircle className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      </motion.div>

                      {/* Actual Location Label */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-blue-600/95 backdrop-blur-md px-4 py-2 rounded-full border-2 border-blue-400 shadow-lg"
                      >
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-white" />
                          <span className="text-white font-semibold">Actually: {correctAnswer}</span>
                        </div>
                      </motion.div>
                    </div>
                  </Card>
                </motion.div>
              )}

              {/* Why Wrong Explanation */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-200 shadow-md">
                  <div className="p-3">
                    <div className="flex items-start gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                        <TrendingUp className="w-4 h-4 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-slate-800 mb-2 text-sm">What Happened?</h3>
                        {playerGuess && (
                          <div className="mb-2 p-2 bg-white rounded-lg border border-orange-200">
                            <p className="text-xs text-slate-600">Your guess:</p>
                            <p className="text-sm text-slate-800">{playerGuess}</p>
                          </div>
                        )}
                        <div className="p-2 bg-blue-100 rounded-lg border border-blue-200">
                          <p className="text-xs text-blue-700">Correct answer:</p>
                          <p className="text-sm text-blue-800">{correctAnswer}</p>
                        </div>
                      </div>
                    </div>

                    <Separator className="my-2 bg-orange-200" />

                    <div className="space-y-1">
                      <div className="flex items-start gap-2 text-xs text-slate-700">
                        <Lightbulb className="w-3 h-3 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <span>You used <strong>{hintsUsed}</strong> hints and <strong>{translationsUsed}</strong> translations</span>
                      </div>
                      {hintsUsed < 3 && (
                        <div className="flex items-start gap-2 text-xs text-slate-700">
                          <Target className="w-3 h-3 text-blue-600 flex-shrink-0 mt-0.5" />
                          <span>Try using all hints next time!</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Action Button */}
              <Button
                onClick={handleNext}
                className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white shadow-lg h-10"
                disabled={!allowInteraction}
              >
                {isLastRound ? (
                  <>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Try New Game
                  </>
                ) : (
                  <>
                    Try Another Ride
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
