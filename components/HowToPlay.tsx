import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { MessageCircle, Lightbulb, Target, Trophy, ArrowRight, ChevronLeft, Languages, GitBranch, Home, Repeat } from 'lucide-react';
import { LanguageExamplesFrame } from './LanguageExamplesFrame';
import { UserFlowDiagram } from './UserFlowDiagram';

interface HowToPlayProps {
  onBack: () => void;
  onStartGame?: () => void;
}

export function HowToPlay({ onBack, onStartGame }: HowToPlayProps) {
  const [showLanguageGuide, setShowLanguageGuide] = useState(false);
  const [showFlowDiagram, setShowFlowDiagram] = useState(false);

  if (showLanguageGuide) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#111318] via-[#1E2329] to-[#111318] flex items-center justify-center p-4">
        <div className="max-w-4xl w-full space-y-4">
          <Button
            onClick={() => setShowLanguageGuide(false)}
            variant="secondary"
            className="mb-2"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to How to Play
          </Button>
          <LanguageExamplesFrame />
        </div>
      </div>
    );
  }

  if (showFlowDiagram) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#111318] via-[#1E2329] to-[#111318] flex items-center justify-center p-4">
        <div className="max-w-6xl w-full space-y-4">
          <Button
            onClick={() => setShowFlowDiagram(false)}
            variant="secondary"
            className="mb-2"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to How to Play
          </Button>
          <UserFlowDiagram />
        </div>
      </div>
    );
  }

  const steps = [
    {
      number: 1,
      title: 'Talk to Your Driver',
      description: 'Use voice or text to ask your taxi driver questions and start a conversation',
      icon: MessageCircle,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      iconBg: 'bg-purple-500'
    },
    {
      number: 2,
      title: 'Collect Hints',
      description: 'Your taxi driver provides unique clues about your location. Gather as many or as few as you need!',
      icon: Lightbulb,
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      iconBg: 'bg-yellow-500'
    },
    {
      number: 3,
      title: 'Make Your Guess',
      description: 'Type your answer in the right panel and submit when you think you know where you are',
      icon: Target,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      iconBg: 'bg-green-500'
    },
    {
      number: 4,
      title: 'Earn Points',
      description: 'Use fewer hints for more points! Then continue to the next round and repeat',
      icon: Trophy,
      color: 'from-amber-500 to-orange-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      iconBg: 'bg-amber-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#111318] via-[#1E2329] to-[#111318] flex items-center justify-center p-4 overflow-y-auto">
      <div className="max-w-6xl w-full py-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl md:text-6xl text-[#F5F5F5] mb-4 drop-shadow-2xl">
            How to Play
          </h1>
          <p className="text-xl text-[#FFC832] drop-shadow-lg">
            You were drunk and flew overnight; now you're in a taxi with a pounding head—figure out the city before the fare skyrockets!
          </p>
        </div>

        {/* Game Loop Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isLastStep = index === steps.length - 1;
            
            return (
              <div key={step.number} className="relative animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <Card className={`${step.bgColor} ${step.borderColor} border-2 shadow-lg hover:shadow-xl transition-shadow`}>
                  <CardContent className="p-6">
                    {/* Step Number & Icon */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`${step.iconBg} w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-slate-500 mb-1">Step {step.number}</div>
                        <h3 className="text-2xl text-slate-900">{step.title}</h3>
                      </div>
                    </div>
                    
                    {/* Description */}
                    <p className="text-slate-700 leading-relaxed">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>

                {/* Arrow connector for desktop */}
                {!isLastStep && index % 2 === 0 && (
                  <div className="hidden md:block absolute -right-8 top-1/2 -translate-y-1/2 z-10">
                    <ArrowRight className="w-6 h-6 text-white/60" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Cycle Indicator */}
        <div className="flex items-center justify-center gap-3 mb-8 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <div className="bg-white/20 backdrop-blur-md rounded-full px-6 py-3 border-2 border-white/30">
            <div className="flex items-center gap-3 text-white">
              <Repeat className="w-5 h-5" />
              <span className="text-sm">Repeat for 6 exciting rounds!</span>
            </div>
          </div>
        </div>

        {/* Scoring Info */}
        <Card className="mb-8 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 shadow-lg animate-scale-in" style={{ animationDelay: '0.6s' }}>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="bg-amber-500 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl text-amber-900 mb-3">Scoring System</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-white/60 rounded-lg p-3 text-center">
                    <div className="text-2xl text-amber-600 mb-1">100</div>
                    <div className="text-sm text-amber-800">1 Hint Used</div>
                  </div>
                  <div className="bg-white/60 rounded-lg p-3 text-center">
                    <div className="text-2xl text-amber-600 mb-1">75</div>
                    <div className="text-sm text-amber-800">2 Hints Used</div>
                  </div>
                  <div className="bg-white/60 rounded-lg p-3 text-center">
                    <div className="text-2xl text-amber-600 mb-1">50</div>
                    <div className="text-sm text-amber-800">3+ Hints Used</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Resources */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* Language Guide */}
          <Card className="bg-white/95 backdrop-blur-sm border-2 border-indigo-200 shadow-lg animate-scale-in" style={{ animationDelay: '0.7s' }}>
            <CardContent className="p-5">
              <div className="flex items-start gap-3 mb-3">
                <Languages className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-lg text-slate-900 mb-1">Multilingual Experience</h4>
                  <p className="text-sm text-slate-600 mb-3">
                    Your taxi driver speaks in their native language with optional translations
                  </p>
                </div>
              </div>
              <Button
                onClick={() => setShowLanguageGuide(true)}
                variant="outline"
                size="sm"
                className="w-full border-indigo-300 text-indigo-700 hover:bg-indigo-50"
              >
                View Language Guide
              </Button>
            </CardContent>
          </Card>

          {/* Flow Diagram */}
          <Card className="bg-white/95 backdrop-blur-sm border-2 border-slate-200 shadow-lg animate-scale-in" style={{ animationDelay: '0.8s' }}>
            <CardContent className="p-5">
              <div className="flex items-start gap-3 mb-3">
                <GitBranch className="w-6 h-6 text-slate-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-lg text-slate-900 mb-1">Visual Game Flow</h4>
                  <p className="text-sm text-slate-600 mb-3">
                    See the complete journey from menu to game completion
                  </p>
                </div>
              </div>
              <Button
                onClick={() => setShowFlowDiagram(true)}
                variant="outline"
                size="sm"
                className="w-full border-slate-300 text-slate-700 hover:bg-slate-100"
              >
                View Flow Diagram
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.9s' }}>
          <Button
            onClick={onBack}
            size="lg"
            variant="secondary"
            className="px-8 bg-white/90 hover:bg-white text-slate-900"
          >
            <Home className="w-5 h-5 mr-2" />
            Back to Menu
          </Button>
          {onStartGame && (
            <Button
              onClick={onStartGame}
              size="lg"
              className="px-8 bg-[#27C46A] hover:bg-[#22A85A] text-white shadow-xl"
            >
              Start Playing
            </Button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .animate-scale-in {
          animation: scale-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}
