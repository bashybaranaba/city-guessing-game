import { useState } from 'react';
import { Mic, Volume2, MessageCircle, Send } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';

type VoiceStatus = 'idle' | 'listening' | 'processing' | 'speaking';

interface DriverVoiceBarProps {
  onMicPress?: () => void;
  onMicRelease?: () => void;
  onReplay?: () => void;
  onTextSubmit?: (message: string) => void;
  status?: VoiceStatus;
  isRecording?: boolean;
  canReplay?: boolean;
  disabled?: boolean;
}

/**
 * DriverVoiceBar Component
 * 
 * Voice and text control bar attached to the driver card.
 * Contains two clear input options:
 * 1. Microphone button - Hold to record voice, release to send
 * 2. Chat bubble button - Toggle text input field
 */
export function DriverVoiceBar({
  onMicPress,
  onMicRelease,
  onReplay,
  onTextSubmit,
  status = 'idle',
  isRecording = false,
  canReplay = false,
  disabled = false,
}: DriverVoiceBarProps) {
  const [showTextInput, setShowTextInput] = useState(false);
  const [textMessage, setTextMessage] = useState('');

  const getStatusConfig = () => {
    switch (status) {
      case 'listening':
        return {
          text: 'Listening…',
          color: 'text-blue-300',
          badgeColor: 'bg-blue-500/20 border-blue-500',
        };
      case 'processing':
        return {
          text: 'Processing…',
          color: 'text-yellow-300',
          badgeColor: 'bg-yellow-500/20 border-yellow-500',
        };
      case 'speaking':
        return {
          text: 'Driver speaking…',
          color: 'text-emerald-300',
          badgeColor: 'bg-emerald-500/20 border-emerald-500',
        };
      default:
        return {
          text: 'Ready to talk',
          color: 'text-slate-400',
          badgeColor: 'bg-slate-700/30 border-slate-600',
        };
    }
  };

  const statusConfig = getStatusConfig();

  // Handle mouse down (press)
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!disabled && status === 'idle' && !showTextInput) {
      onMicPress?.();
    }
  };

  // Handle mouse up (release)
  const handleMouseUp = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!disabled && isRecording) {
      onMicRelease?.();
    }
  };

  // Handle touch start (press)
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    if (!disabled && status === 'idle' && !showTextInput) {
      onMicPress?.();
    }
  };

  // Handle touch end (release)
  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    if (!disabled && isRecording) {
      onMicRelease?.();
    }
  };

  // Handle text message submit
  const handleTextSubmit = () => {
    if (textMessage.trim() && onTextSubmit) {
      onTextSubmit(textMessage.trim());
      setTextMessage('');
      setShowTextInput(false);
    }
  };

  // Handle Enter key in text input
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleTextSubmit();
    }
  };

  return (
    <TooltipProvider>
      <div className="w-full border-t border-slate-700/50 pt-3 mt-3 space-y-3">
        {/* Status Label */}
        <div className="flex items-center justify-center">
          <Badge 
            variant="outline"
            className={`
              text-xs py-1 px-3 transition-all duration-300
              ${statusConfig.badgeColor} ${statusConfig.color}
              ${status !== 'idle' ? 'animate-pulse' : ''}
            `}
          >
            {statusConfig.text}
          </Badge>
        </div>

        {/* Input Options - Two clear buttons */}
        <div className="grid grid-cols-2 gap-2">
          {/* Hold to Speak Button */}
          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              <button
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                disabled={disabled || showTextInput || (status !== 'idle' && status !== 'listening')}
                className={`
                  relative flex flex-col items-center justify-center gap-2 p-3 rounded-lg 
                  transition-all duration-300 shadow-md border-2
                  ${isRecording || status === 'listening'
                    ? 'bg-red-600 hover:bg-red-700 border-red-500 scale-105'
                    : 'bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 border-blue-500/50 hover:scale-105'
                  }
                  ${disabled || showTextInput ? 'opacity-50 cursor-not-allowed' : ''}
                  ${status === 'processing' ? 'opacity-70 cursor-wait' : ''}
                  ${status === 'speaking' ? 'opacity-70 cursor-not-allowed' : ''}
                  disabled:hover:scale-100
                `}
              >
                <Mic className={`w-6 h-6 text-white ${isRecording ? 'animate-pulse' : ''}`} />
                <span className="text-white text-xs text-center">
                  {isRecording || status === 'listening' ? 'Recording...' : 'Hold to speak'}
                </span>

                {/* Pulse effect when recording */}
                {isRecording && (
                  <>
                    <span className="absolute inset-0 rounded-lg bg-red-400 animate-ping opacity-75" />
                    <span className="absolute inset-0 rounded-lg bg-red-500 animate-pulse opacity-50" />
                  </>
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-slate-900 border-blue-500/30 text-white">
              <p className="text-xs max-w-[200px] text-center">
                {isRecording 
                  ? 'Release to send your message' 
                  : 'Hold to record, release to send'
                }
              </p>
            </TooltipContent>
          </Tooltip>

          {/* Type a Message Button */}
          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              <button
                onClick={() => setShowTextInput(!showTextInput)}
                disabled={disabled || status !== 'idle'}
                className={`
                  flex flex-col items-center justify-center gap-2 p-3 rounded-lg 
                  transition-all duration-300 shadow-md border-2
                  ${showTextInput
                    ? 'bg-blue-500/20 border-blue-500 text-blue-400 scale-105'
                    : 'bg-slate-800/50 border-slate-600/50 text-slate-400 hover:border-blue-500/50 hover:text-blue-400 hover:bg-slate-700/50 hover:scale-105'
                  }
                  ${disabled || status !== 'idle' ? 'opacity-50 cursor-not-allowed' : ''}
                  disabled:hover:scale-100
                `}
              >
                <MessageCircle className="w-6 h-6" />
                <span className="text-xs text-center">
                  Type a message
                </span>
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-slate-900 border-blue-500/30 text-white">
              <p className="text-xs max-w-[200px] text-center">
                {showTextInput ? 'Close text input' : 'Click to type a message'}
              </p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Text Input Field - Appears below buttons when toggled */}
        {showTextInput && (
          <div className="flex gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <Input
              type="text"
              value={textMessage}
              onChange={(e) => setTextMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask your driver a question…"
              className="flex-1 bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500"
              autoFocus
              disabled={disabled || status !== 'idle'}
            />
            <Tooltip delayDuration={300}>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleTextSubmit}
                  disabled={!textMessage.trim() || disabled || status !== 'idle'}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-slate-900 border-blue-500/30 text-white">
                <p className="text-xs">Send message</p>
              </TooltipContent>
            </Tooltip>
          </div>
        )}

        {/* Replay Button - Separate row below */}
        {canReplay && (
          <div className="pt-2 border-t border-slate-700/30">
            <Tooltip delayDuration={300}>
              <TooltipTrigger asChild>
                <Button
                  onClick={onReplay}
                  disabled={!canReplay || disabled}
                  variant="outline"
                  className={`
                    w-full h-9 transition-all duration-300
                    border-2 bg-slate-800/50 hover:bg-slate-700/50
                    ${canReplay 
                      ? 'border-emerald-500/50 text-emerald-400 hover:border-emerald-400 hover:text-emerald-300' 
                      : 'border-slate-600/30 text-slate-600 cursor-not-allowed opacity-50'
                    }
                  `}
                >
                  <Volume2 className="w-4 h-4 mr-2" />
                  <span className="text-xs">Replay last message</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-slate-900 border-emerald-500/30 text-white">
                <p className="text-xs">
                  {canReplay ? "Replay driver's last line" : 'No message to replay'}
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
