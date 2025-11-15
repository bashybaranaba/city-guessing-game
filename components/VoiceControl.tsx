import { useState } from 'react';
import { Mic, MicOff, Radio } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

type VoiceStatus = 'idle' | 'listening' | 'processing';

interface VoiceControlProps {
  onStartRecording?: () => void;
  onStopRecording?: () => void;
  disabled?: boolean;
}

export function VoiceControl({
  onStartRecording,
  onStopRecording,
  disabled = false
}: VoiceControlProps) {
  const [status, setStatus] = useState<VoiceStatus>('idle');
  const [isRecording, setIsRecording] = useState(false);

  const handleMicrophoneClick = () => {
    if (disabled) return;

    if (!isRecording) {
      // Start recording
      setIsRecording(true);
      setStatus('listening');
      onStartRecording?.();
      
      // Simulate processing after 2 seconds
      setTimeout(() => {
        setStatus('processing');
        setTimeout(() => {
          setIsRecording(false);
          setStatus('idle');
          onStopRecording?.();
        }, 1500);
      }, 2000);
    } else {
      // Stop recording
      setIsRecording(false);
      setStatus('processing');
      onStopRecording?.();
      
      setTimeout(() => {
        setStatus('idle');
      }, 1000);
    }
  };

  const getStatusConfig = () => {
    switch (status) {
      case 'listening':
        return {
          text: 'Listening…',
          color: 'text-red-600',
          badgeColor: 'bg-red-100 border-red-300 text-red-700',
          icon: <Radio className="w-3 h-3 animate-pulse" />
        };
      case 'processing':
        return {
          text: 'Processing…',
          color: 'text-blue-600',
          badgeColor: 'bg-blue-100 border-blue-300 text-blue-700',
          icon: <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        };
      default:
        return {
          text: 'Tap to speak',
          color: 'text-slate-500',
          badgeColor: 'bg-slate-100 border-slate-300 text-slate-600',
          icon: null
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <div className="absolute bottom-[240px] left-6 right-[340px] md:right-[420px] z-20">
      <Card className="bg-white/95 backdrop-blur-md border-2 border-slate-300/50 shadow-lg">
        <div className="flex items-center px-4 py-3 gap-4">
          {/* Microphone Button & Status */}
          <div className="flex items-center gap-3">
            {/* Microphone Button */}
            <Button
              onClick={handleMicrophoneClick}
              disabled={disabled}
              size="default"
              className={`
                relative w-12 h-12 rounded-full p-0 shadow-lg transition-all duration-300
                ${isRecording 
                  ? 'bg-red-600 hover:bg-red-700 animate-pulse' 
                  : 'bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {isRecording ? (
                <MicOff className="w-5 h-5 text-white" />
              ) : (
                <Mic className="w-5 h-5 text-white" />
              )}
              
              {/* Pulse effect when listening */}
              {isRecording && (
                <>
                  <span className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-75" />
                  <span className="absolute inset-0 rounded-full bg-red-500 animate-pulse opacity-50" />
                </>
              )}
            </Button>

            {/* Status Badge */}
            <div className="flex flex-col gap-1">
              <Badge 
                variant="outline"
                className={`px-3 py-1 text-xs flex items-center gap-1.5 ${statusConfig.badgeColor}`}
              >
                {statusConfig.icon}
                {statusConfig.text}
              </Badge>
              
              {disabled && (
                <span className="text-xs text-slate-400 italic">
                  Say hi to your driver
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Visual indicator bar at bottom */}
        <div className="h-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent">
          {status === 'listening' && (
            <div className="h-full bg-gradient-to-r from-red-500 via-red-400 to-red-500 animate-pulse" />
          )}
          {status === 'processing' && (
            <div className="h-full bg-gradient-to-r from-blue-500 via-blue-400 to-blue-500 animate-pulse" />
          )}
        </div>
      </Card>
    </div>
  );
}
