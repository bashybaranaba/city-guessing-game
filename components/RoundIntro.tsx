import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { MapPin, Compass, Play } from 'lucide-react';
import { Badge } from './ui/badge';

interface RoundIntroProps {
  roundNumber: number;
  totalRounds: number;
  locationName: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  onStart: () => void;
}

export function RoundIntro({ 
  roundNumber, 
  totalRounds, 
  locationName,
  difficulty, 
  onStart 
}: RoundIntroProps) {

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background with Overlay */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#111318]/98 via-[#1E2329]/95 to-[#111318]/98" />
        
        {/* Taxi Yellow Glow Accents */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFC832]/5 via-transparent to-[#FFC832]/10" />
        
        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 opacity-10">
          <Compass className="w-32 h-32 text-[#4BA3FF] animate-spin-slow" style={{ animationDuration: '20s' }} />
        </div>
        <div className="absolute bottom-10 right-10 opacity-10">
          <MapPin className="w-40 h-40 text-[#FFC832]" />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12">
        {/* Round Counter */}
        <div className="mb-8 animate-fade-in">
          <Badge variant="secondary" className="text-lg px-6 py-2 bg-[#FFC832] text-[#111318] border-2 border-[#E6B42E]">
            Round {roundNumber} of {totalRounds}
          </Badge>
        </div>

        {/* Title Section */}
        <div className="text-center mb-12 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <h1 className="text-6xl md:text-7xl text-[#F5F5F5] mb-4 drop-shadow-2xl">
            New Round
          </h1>
          <p className="text-2xl text-[#FFC832] drop-shadow-lg">
            Your head hurts... figure out where you are before the fare skyrockets!
          </p>
        </div>

        {/* Difficulty Card */}
        <Card className="max-w-md w-full mb-8 animate-scale-in" style={{ animationDelay: '0.4s' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <MapPin className="w-6 h-6 text-slate-600" />
                <h3 className="text-xl text-slate-900">Mystery Location</h3>
              </div>
            </div>

            {/* Hangover Flavor Text */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-amber-900 italic text-center">
                💫 Your head is pounding and you can't remember how you got here... but your wallet might hurt more if you guess late!
              </p>
            </div>

            {/* Tips */}
            <div className="bg-[#FFC832]/10 border border-[#FFC832]/30 rounded-lg p-4">
              <h4 className="text-sm text-[#E6B42E] mb-3">🎯 Your Mission:</h4>
              <ul className="text-sm text-[#333333] space-y-1.5">
                <li>• Chat freely with your taxi driver (conversations are free!)</li>
                <li>• Click "Get Hint" for specific clues (costs points)</li>
                <li>• Use fewer hints for higher scores</li>
                <li>• Translations cost points - challenge yourself!</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Start Button */}
        <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <Button
            onClick={onStart}
            size="lg"
            className="h-16 px-12 text-xl bg-[#27C46A] hover:bg-[#22A85A] text-white shadow-2xl transform transition-all hover:scale-105"
          >
            <Play className="w-6 h-6 mr-3 fill-white" />
            Start Ride
          </Button>
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
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        
        .animate-scale-in {
          animation: scale-in 0.8s ease-out;
        }
        
        .animate-spin-slow {
          animation: spin 20s linear infinite;
        }
        
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
