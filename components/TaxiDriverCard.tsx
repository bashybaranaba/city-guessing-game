import { Volume2, VolumeX, Languages, User } from 'lucide-react';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import { useState } from 'react';
import { DriverVoiceBar } from './DriverVoiceBar';

interface TaxiDriverCardProps {
  driverName: string;
  languages: string[]; // Array of language codes like ['ES', 'EN']
  voiceEnabled?: boolean;
  onClick?: () => void;
  position?: 'bottom-left' | 'bottom-right';
  avatarColor?: string;
  disabled?: boolean;
  state?: 'idle' | 'talking' | 'listening' | 'processing'; // Driver interaction state
  onVoiceStart?: () => void; // Callback when user starts voice input
  onVoiceStop?: () => void; // Callback when user stops voice input
  onTextSubmit?: (message: string) => void; // Callback when user submits text message
  isVoiceActive?: boolean; // Whether voice recording is active
  driverVoiceEnabled?: boolean; // Whether driver voice output is enabled
  onToggleDriverVoice?: (enabled: boolean) => void; // Callback to toggle driver voice
  onReplayAudio?: () => void; // Replay driver's last line
  canReplay?: boolean; // Whether there's audio to replay
}

/**
 * TaxiDriverCard Component
 * 
 * A reusable card component displaying taxi driver information with a large "Talk" button.
 * The primary interaction is through the Talk button which initiates conversation.
 * 
 * Props:
 * - driverName: The taxi driver's name
 * - languages: Array of language codes (e.g., ['ES', 'EN'])
 * - voiceEnabled: Whether voice/audio is available for this driver
 * - onClick: Callback when the card is clicked (deprecated in favor of Talk button)
 * - position: Where to position the card ('bottom-left' | 'bottom-right')
 * - avatarColor: Custom color for the driver avatar
 * - disabled: Whether the card is disabled/locked
 */
export function TaxiDriverCard({
  driverName,
  languages,
  voiceEnabled = true,
  onClick,
  position = 'bottom-left',
  avatarColor = '#10b981',
  disabled = false,
  state = 'idle',
  onVoiceStart,
  onVoiceStop,
  onTextSubmit,
  isVoiceActive = false,
  driverVoiceEnabled = true,
  onToggleDriverVoice,
  onReplayAudio,
  canReplay = false,
}: TaxiDriverCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const positionClasses = {
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
  };

  // Get initials from driver name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Get state-specific styling
  const isActive = state === 'talking' || state === 'listening' || state === 'processing';
  const stateLabel = state === 'talking' 
    ? 'Driver is speaking' 
    : state === 'listening' 
    ? 'Listening to you...' 
    : state === 'processing'
    ? 'Thinking...'
    : 'Available';
  
  const stateLabelColor = isActive 
    ? 'text-emerald-300' 
    : 'text-slate-400';

  // Map state to voice status
  const getVoiceStatus = (): 'idle' | 'listening' | 'processing' | 'speaking' => {
    if (state === 'listening' || isVoiceActive) return 'listening';
    if (state === 'processing') return 'processing';
    if (state === 'talking') return 'speaking';
    return 'idle';
  };

  return (
    <TooltipProvider>
      <div
        className={`absolute ${positionClasses[position]} z-20 transition-all duration-300 ${
          isHovered ? 'scale-105' : 'scale-100'
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className={`
            relative bg-gradient-to-br from-slate-800/95 to-slate-900/95 
            backdrop-blur-md rounded-2xl border-2 shadow-2xl
            transition-all duration-300
            ${disabled 
              ? 'border-slate-700/50 opacity-60' 
              : isActive
              ? 'border-emerald-400 shadow-emerald-400/40 shadow-2xl'
              : 'border-emerald-500/30 hover:border-emerald-400/50 hover:shadow-emerald-500/20'
            }
            ${isHovered && !disabled && !isActive ? 'shadow-emerald-500/30' : ''}
          `}
        >
          {/* State Badge */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
            <Badge 
              variant="outline" 
              className={`
                text-white text-xs px-2 py-0.5 shadow-lg transition-all duration-300
                ${isActive 
                  ? 'bg-emerald-400 border-emerald-300 animate-pulse' 
                  : 'bg-emerald-500 border-emerald-400'
                }
              `}
            >
              <User className="w-3 h-3 mr-1" />
              Your Driver
            </Badge>
          </div>

          {/* Card Content */}
          <div className="flex flex-col gap-3 p-4">
            {/* Top Section: Driver Info */}
            <div className="flex items-center gap-3">
              {/* Driver Avatar */}
              <div className="relative">
                <Avatar className="w-16 h-16 border-2 border-emerald-400/50 shadow-lg">
                  <AvatarFallback 
                    className="text-white text-lg"
                    style={{ backgroundColor: avatarColor }}
                  >
                    {getInitials(driverName)}
                  </AvatarFallback>
                </Avatar>
                
                {/* Status Indicator - Overlays on avatar */}
                <div className="absolute -bottom-1 -right-1">
                  <div className={`
                    rounded-full p-1.5 border-2 border-slate-900 shadow-md transition-all duration-300
                    ${isActive 
                      ? 'bg-emerald-400 scale-110' 
                      : 'bg-slate-600'
                    }
                  `}>
                    <div className={`
                      w-2 h-2 rounded-full
                      ${isActive ? 'bg-white animate-pulse' : 'bg-slate-400'}
                    `} />
                  </div>
                </div>
              </div>

              {/* Driver Info */}
              <div className="flex flex-col gap-1 min-w-0 flex-1">
                {/* Driver Name */}
                <div className="flex items-center gap-2">
                  <span className="text-white truncate">{driverName}</span>
                  {disabled && (
                    <Badge variant="outline" className="bg-slate-700/50 border-slate-600 text-slate-400 text-xs px-1.5 py-0">
                      Locked
                    </Badge>
                  )}
                </div>

                {/* State Label */}
                <div className="flex items-center gap-1.5">
                  <div className={`
                    w-1.5 h-1.5 rounded-full transition-all duration-300
                    ${isActive ? 'bg-emerald-400 animate-pulse scale-125' : 'bg-slate-500'}
                  `} />
                  <span className={`text-xs transition-colors duration-300 ${stateLabelColor}`}>
                    {stateLabel}
                  </span>
                </div>
              </div>
            </div>

            {/* Voice Control Bar */}
            {!disabled && (
              <DriverVoiceBar
                onMicPress={onVoiceStart}
                onMicRelease={onVoiceStop}
                onTextSubmit={onTextSubmit}
                onReplay={onReplayAudio}
                status={getVoiceStatus()}
                isRecording={isVoiceActive}
                canReplay={canReplay}
                disabled={disabled}
              />
            )}
          </div>

          {/* Active state glow overlay */}
          {isActive && (
            <div className="absolute inset-0 rounded-2xl bg-emerald-400/10 animate-pulse pointer-events-none" />
          )}
        </div>

        {/* Pulse ring effect - active state has continuous pulse, hover has single pulse */}
        {isActive && !disabled && (
          <div className="absolute inset-0 rounded-2xl border-2 border-emerald-400/50 animate-ping pointer-events-none" />
        )}
        {isHovered && !disabled && !isActive && (
          <div className="absolute inset-0 rounded-2xl border-2 border-emerald-400/30 animate-ping pointer-events-none" />
        )}
      </div>
    </TooltipProvider>
  );
}
