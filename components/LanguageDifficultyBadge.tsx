import { MessageSquare } from 'lucide-react';
import { Badge } from './ui/badge';

interface LanguageDifficultyBadgeProps {
  level: 'Easy' | 'Medium' | 'Hard';
  description?: string; // Optional, we'll use defaults
  compact?: boolean; // For top bar display
}

export function LanguageDifficultyBadge({ level, description, compact = false }: LanguageDifficultyBadgeProps) {
  const colorMap = {
    Easy: 'bg-green-500/90 hover:bg-green-500/90 border-green-400',
    Medium: 'bg-yellow-500/90 hover:bg-yellow-500/90 border-yellow-400',
    Hard: 'bg-red-500/90 hover:bg-red-500/90 border-red-400'
  };

  // Driver-specific language descriptions
  const defaultDescriptions = {
    Easy: 'Driver speaks mostly English with clear hints.',
    Medium: 'Driver mixes local language and English.',
    Hard: 'Driver speaks mostly local language, few English words.'
  };

  const finalDescription = description || defaultDescriptions[level];

  if (compact) {
    return (
      <Badge 
        className={`${colorMap[level]} text-white border-2 px-3 py-1.5 shadow-lg backdrop-blur-sm`}
      >
        <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
        <span>{level}</span>
      </Badge>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 bg-slate-800/90 backdrop-blur-sm rounded-lg px-3 py-2 border border-slate-700">
      <Badge 
        className={`${colorMap[level]} text-white border-2 px-2.5 py-0.5 shadow-lg`}
      >
        <MessageSquare className="w-3 h-3 mr-1" />
        <span>{level}</span>
      </Badge>
      <span className="text-xs text-slate-300">{finalDescription}</span>
    </div>
  );
}
