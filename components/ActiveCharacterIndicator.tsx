import { User, MessageCircle } from 'lucide-react';
import { Badge } from './ui/badge';

interface Character {
  id: string;
  name: string;
  color: string;
}

interface ActiveCharacterIndicatorProps {
  characters: Character[];
  activeCharacterId: string | null;
  revealedCharacterIds: Set<string>;
}

export function ActiveCharacterIndicator({ 
  characters, 
  activeCharacterId,
  revealedCharacterIds 
}: ActiveCharacterIndicatorProps) {
  return (
    <div className="absolute bottom-[280px] left-1/2 -translate-x-1/2 z-30 w-auto max-w-2xl">
      <div className="bg-slate-900/95 backdrop-blur-md rounded-full border-2 border-white/10 shadow-2xl px-4 py-2">
        <div className="flex items-center gap-2">
          {/* Icon */}
          <div className="flex items-center gap-2 pr-3 border-r border-white/20">
            <MessageCircle className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-slate-400">Characters</span>
          </div>

          {/* Character Pills */}
          <div className="flex items-center gap-2">
            {characters.map((character) => {
              const isActive = character.id === activeCharacterId;
              const isRevealed = revealedCharacterIds.has(character.id);
              
              return (
                <div
                  key={character.id}
                  className={`
                    relative transition-all duration-300 ease-out
                    ${isActive ? 'scale-110' : 'scale-100'}
                  `}
                >
                  {/* Active indicator pulse */}
                  {isActive && (
                    <div 
                      className="absolute inset-0 rounded-full animate-ping opacity-30"
                      style={{ backgroundColor: character.color }}
                    />
                  )}
                  
                  {/* Character Pill */}
                  <div
                    className={`
                      relative px-4 py-2 rounded-full border-2 transition-all duration-300
                      flex items-center gap-2 min-w-[100px] justify-center
                      ${isActive
                        ? 'shadow-lg'
                        : isRevealed
                        ? 'bg-slate-800/60 border-slate-600'
                        : 'bg-slate-800/30 border-slate-700/50'
                      }
                    `}
                    style={{
                      backgroundColor: isActive ? character.color : undefined,
                      borderColor: isActive ? character.color : undefined,
                      boxShadow: isActive ? `0 0 20px ${character.color}40` : undefined,
                    }}
                  >
                    {/* Character Icon */}
                    <div
                      className={`
                        w-5 h-5 rounded-full flex items-center justify-center
                        transition-all duration-300
                        ${isActive 
                          ? 'bg-white/20' 
                          : isRevealed
                          ? 'bg-slate-700'
                          : 'bg-slate-700/50'
                        }
                      `}
                    >
                      <User 
                        className={`w-3 h-3 ${
                          isActive 
                            ? 'text-white' 
                            : isRevealed
                            ? 'text-slate-400'
                            : 'text-slate-600'
                        }`} 
                      />
                    </div>

                    {/* Character Name */}
                    <span
                      className={`
                        text-sm transition-all duration-300
                        ${isActive 
                          ? 'text-white' 
                          : isRevealed
                          ? 'text-slate-300'
                          : 'text-slate-500'
                        }
                      `}
                    >
                      {character.name}
                    </span>

                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2">
                        <div 
                          className="w-1.5 h-1.5 rounded-full bg-white shadow-lg"
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Status Badge */}
          {activeCharacterId && (
            <div className="pl-3 border-l border-white/20">
              <Badge 
                variant="outline"
                className="bg-green-900/50 border-green-600 text-green-300 text-xs"
              >
                Speaking
              </Badge>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
