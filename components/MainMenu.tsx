import { Button } from "./ui/button";
import {
  CarTaxiFront,
  Play,
  BookOpen,
  Settings as SettingsIcon,
  Map,
  MapPin,
  Car,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface MainMenuProps {
  onPlay: () => void;
  onHowToPlay: () => void;
}

export function MainMenu({ onPlay, onHowToPlay }: MainMenuProps) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background with Overlay */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1514565131-fce0801e5785?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdodCUyMGNpdHklMjBzdHJlZXR8ZW58MHx8fHwxNzYzMjA2MDAwfDA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Night city background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#111318]/95 via-[#1E2329]/90 to-[#111318]/95" />

        {/* CarTaxiFront Yellow Glow Accents */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFC832]/10 via-transparent to-[#FFC832]/5" />

        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 opacity-10">
          <Map className="w-32 h-32 text-[#FFC832]" />
        </div>
        <div className="absolute bottom-10 right-10 opacity-10">
          <MapPin className="w-40 h-40 text-[#4BA3FF]" />
        </div>
        <div className="absolute top-1/3 right-1/4 opacity-5">
          <Car className="w-24 h-24 text-[#FFC832] transform -rotate-12" />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12">
        {/* Logo/Title Section */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="relative bg-[#FFC832] rounded-full p-6 shadow-2xl">
                <CarTaxiFront className="w-16 h-16 text-[#111318]" />
              </div>
              <div className="absolute inset-0 bg-[#FFC832]/40 rounded-full blur-3xl animate-pulse" />
            </div>
          </div>

          <h1 className="text-6xl md:text-7xl text-[#FFC832] mb-4 drop-shadow-2xl tracking-tight">
            Lost in Transportation
          </h1>

          <p className="text-xl text-[#F5F5F5]/90 drop-shadow-lg max-w-2xl mx-auto">
            Wake up, shake off the hangover, chat with your taxi driver and
            guess where you are.
          </p>
        </div>

        {/* Menu Buttons */}
        <div className="flex flex-col gap-4 w-full max-w-md">
          <Button
            onClick={onPlay}
            size="lg"
            className="h-16 text-xl bg-[#FFC832] hover:bg-[#E6B42E] text-[#111318] shadow-2xl transform transition-all hover:scale-105 border-2 border-[#FFC832]/50"
          >
            <Play className="w-6 h-6 mr-3 fill-[#111318]" />
            Start Your Ride
          </Button>

          <Button
            onClick={onHowToPlay}
            size="lg"
            variant="secondary"
            className="h-14 text-lg bg-[#1E2329] hover:bg-[#2A2F38] text-[#F5F5F5] border-2 border-[#4BA3FF]/30 shadow-xl transform transition-all hover:scale-105"
          >
            <BookOpen className="w-5 h-5 mr-3" />
            How to Play
          </Button>

          <Button
            size="lg"
            variant="secondary"
            className="h-14 text-lg bg-[#1E2329] hover:bg-[#2A2F38] text-[#F5F5F5] border-2 border-[#4BA3FF]/30 shadow-xl transform transition-all hover:scale-105"
          >
            <SettingsIcon className="w-5 h-5 mr-3" />
            Settings
          </Button>
        </div>

        {/* Version/Credits */}
        <div className="mt-12 text-center">
          <p className="text-sm text-[#F5F5F5]/60">A hangover geography game</p>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(10deg);
          }
        }
        
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
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
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
