import { Volume2 } from 'lucide-react';

interface SpeakingWaveformProps {
  color?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * SpeakingWaveform Component
 * 
 * Displays an animated waveform to indicate that the driver is currently speaking.
 * Shows bouncing bars that simulate sound waves.
 */
export function SpeakingWaveform({ color = '#10b981', size = 'md' }: SpeakingWaveformProps) {
  const sizeConfig = {
    sm: { container: 'gap-0.5', bar: 'w-0.5', heights: ['h-2', 'h-3', 'h-4', 'h-3', 'h-2'] },
    md: { container: 'gap-1', bar: 'w-1', heights: ['h-3', 'h-5', 'h-6', 'h-5', 'h-3'] },
    lg: { container: 'gap-1.5', bar: 'w-1.5', heights: ['h-4', 'h-6', 'h-8', 'h-6', 'h-4'] },
  };

  const config = sizeConfig[size];

  return (
    <div className={`flex items-center ${config.container}`}>
      {config.heights.map((height, index) => (
        <div
          key={index}
          className={`${config.bar} ${height} rounded-full animate-wave`}
          style={{
            backgroundColor: color,
            animationDelay: `${index * 0.1}s`,
            animationDuration: '0.8s',
          }}
        />
      ))}
    </div>
  );
}

interface SpeakingIndicatorProps {
  color?: string;
  showText?: boolean;
}

/**
 * SpeakingIndicator Component
 * 
 * A compact indicator showing a volume icon with animated waveform
 * to indicate the driver is speaking.
 */
export function SpeakingIndicator({ color = '#10b981', showText = true }: SpeakingIndicatorProps) {
  return (
    <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-emerald-900/30 border border-emerald-500/30 backdrop-blur-sm">
      <Volume2 className="w-3 h-3 text-emerald-400 animate-pulse" />
      <SpeakingWaveform color={color} size="sm" />
      {showText && (
        <span className="text-xs text-emerald-300">Speaking...</span>
      )}
    </div>
  );
}
