import { Card } from './ui/card';
import { Smile, Meh, Frown, Sparkles, Coffee, Globe, Info } from 'lucide-react';
import { Badge } from './ui/badge';
import { Popover, PopoverTrigger, PopoverContent } from './ui/popover';
import { CharacterInfoCard, CharacterRole } from './CharacterInfoCard';

interface CharacterPortraitProps {
  name: string;
  color: string;
  mood?: 'happy' | 'neutral' | 'mysterious' | 'excited' | 'tired';
  revealed: boolean;
  onClick: () => void;
  description?: string;
  role?: CharacterRole;
}

const moodIcons = {
  happy: Smile,
  neutral: Meh,
  mysterious: Frown,
  excited: Sparkles,
  tired: Coffee,
};

export function CharacterPortrait({ 
  name, 
  color, 
  mood = 'neutral',
  revealed, 
  onClick,
  description = 'A friendly character who can help you.',
  role = 'local'
}: CharacterPortraitProps) {
  const MoodIcon = moodIcons[mood] || Globe;

  return (
    <Popover>
      <div className="relative group">
        {/* Info Button - Shows on hover */}
        <PopoverTrigger asChild>
          <button
            className="absolute top-2 left-2 z-20 w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full 
                     flex items-center justify-center shadow-md border border-slate-200
                     opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
            onClick={(e) => e.stopPropagation()}
          >
            <Info className="w-4 h-4 text-slate-600" />
          </button>
        </PopoverTrigger>

        <Card
      onClick={onClick}
      className={`
        relative overflow-hidden cursor-pointer transition-all duration-300 
        ${revealed 
          ? 'bg-white border-2 shadow-lg scale-105' 
          : 'bg-white/80 border-2 border-slate-200 hover:border-slate-300 hover:shadow-md'
        }
      `}
      style={{ 
        borderColor: revealed ? color : undefined,
        boxShadow: revealed ? `0 10px 40px -10px ${color}40` : undefined
      }}
    >
      {/* Status Badge */}
      {revealed && (
        <div className="absolute top-2 right-2 z-10">
          <Badge variant="secondary" className="text-xs bg-green-500 text-white border-none">
            Talked
          </Badge>
        </div>
      )}

      {/* Character Avatar Circle */}
      <div className="flex flex-col items-center p-4 gap-3">
        <div 
          className="relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300"
          style={{ 
            backgroundColor: color,
            boxShadow: revealed ? `0 8px 24px -8px ${color}` : 'none'
          }}
        >
          {/* Avatar Icon */}
          <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm">
            <div className="text-3xl">👤</div>
          </div>
          
          {/* Mood Indicator */}
          <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md border-2"
               style={{ borderColor: color }}>
            <MoodIcon className="w-4 h-4" style={{ color }} />
          </div>
        </div>

        {/* Character Name */}
        <div className="text-center">
          <div className="text-sm px-2 py-1 rounded-md" style={{ 
            color: revealed ? color : '#64748b',
            transition: 'color 0.3s'
          }}>
            {name}
          </div>
        </div>
      </div>

      {/* Interaction Hint */}
      {!revealed && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/5 transition-colors">
          <div className="opacity-0 hover:opacity-100 transition-opacity">
            <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs text-slate-700 shadow-lg">
              Click to talk
            </div>
          </div>
        </div>
      )}
    </Card>
      </div>

      {/* Popover Content */}
      <PopoverContent 
        align="start" 
        side="top"
        className="p-0 w-72 border-0 shadow-2xl"
      >
        <CharacterInfoCard
          name={name}
          description={description}
          role={role}
          color={color}
          revealed={revealed}
        />
      </PopoverContent>
    </Popover>
  );
}
