import { Compass, MapPin, Navigation } from 'lucide-react';

// Helper function to get cardinal direction from heading
function getCardinalDirection(heading: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(((heading % 360) / 45)) % 8;
  return directions[index];
}

interface StreetViewWindowProps {
  imageUrl: string;
  showOverlay?: boolean;
  location?: string;
  heading?: number; // Compass heading in degrees (0-360)
  className?: string;
  showLocationLabel?: boolean; // Whether to display the location name (default: false to avoid spoiling the game)
}

/**
 * StreetViewWindow Component
 * 
 * A reusable windshield-style window frame for displaying Street View or map imagery.
 * Features a slightly curved top edge and optional corner UI overlays.
 * 
 * Props:
 * - imageUrl: The background image URL (Street View, map, or any location image)
 * - showOverlay: Toggle corner UI elements (compass, location label, etc.)
 * - location: Optional location name to display in bottom-left corner
 * - heading: Optional compass heading (0-360 degrees) for the compass indicator
 * - className: Additional CSS classes for custom styling
 */
export function StreetViewWindow({
  imageUrl,
  showOverlay = true,
  location,
  heading = 0,
  className = '',
  showLocationLabel = false,
}: StreetViewWindowProps) {
  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {/* Background Image Layer */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700"
        style={{ backgroundImage: `url(${imageUrl})` }}
      >
        {/* Subtle atmospheric gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-100/5 via-transparent to-transparent" />
        
        {/* Vignette effect for depth */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/10" />
      </div>

      {/* Windshield Frame Shape (SVG Mask) */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Windshield curved top edge gradient */}
          <linearGradient id="windshieldEdge" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(0,0,0,0.4)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </linearGradient>
          
          {/* Glass reflection gradient */}
          <linearGradient id="glassShine" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.08)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.03)" />
          </linearGradient>
        </defs>

        {/* Curved top edge shadow (dashboard reflection) */}
        <path
          d="M 0 0 L 0 60 Q 300 30, 600 20 Q 900 30, 1200 60 L 1200 0 Z"
          fill="url(#windshieldEdge)"
          opacity="0.6"
        />

        {/* Subtle glass reflection streaks */}
        <path
          d="M 200 50 Q 400 40, 600 50 L 600 150 Q 400 140, 200 150 Z"
          fill="url(#glassShine)"
        />
        <path
          d="M 700 80 Q 900 70, 1000 80 L 1000 180 Q 900 170, 700 180 Z"
          fill="url(#glassShine)"
        />
      </svg>

      {/* Optional UI Overlays */}
      {showOverlay && (
        <>
          {/* Top-right: Compass indicator */}
          <div className="absolute top-3 right-3 pointer-events-none">
            <div className="relative bg-black/30 backdrop-blur-sm rounded-full p-2.5 border border-white/20 shadow-lg">
              <Compass
                className="w-5 h-5 text-white/90"
                style={{
                  transform: `rotate(${heading}deg)`,
                  transition: 'transform 0.5s ease-out',
                }}
              />
              {/* North indicator */}
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-red-500 rounded-full" />
            </div>
            {/* Compass label */}
            <div className="mt-1 text-center">
              <span className="text-xs px-1.5 py-0.5 bg-black/30 backdrop-blur-sm rounded text-white/80">
                {getCardinalDirection(heading)} {Math.round(heading)}°
              </span>
            </div>
          </div>

          {/* Top-left: Navigation hint */}
          <div className="absolute top-3 left-3 pointer-events-none">
            <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-sm rounded-lg px-2.5 py-1.5 border border-white/20 shadow-lg">
              <Navigation className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-white/90">Street View</span>
            </div>
          </div>

          {/* Bottom-left: Location label (if provided and enabled) */}
          {/* Note: showLocationLabel is false by default to avoid spoiling the guessing game */}
          {showLocationLabel && location && (
            <div className="absolute bottom-3 left-3 pointer-events-none">
              <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md rounded-lg px-3 py-2 border border-white/20 shadow-lg">
                <MapPin className="w-4 h-4 text-red-400 fill-red-400/20" />
                <div className="flex flex-col">
                  <span className="text-xs text-white/90">{location}</span>
                  <span className="text-xs text-white/60">Current Location</span>
                </div>
              </div>
            </div>
          )}

          {/* Bottom-right: Map hint icon */}
          <div className="absolute bottom-3 right-3 pointer-events-none">
            <div className="bg-black/30 backdrop-blur-sm rounded-full p-2 border border-white/20 shadow-lg">
              <svg
                className="w-5 h-5 text-white/80"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
            </div>
          </div>

          {/* Subtle pulsing indicator (active/live feed) */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 pointer-events-none">
            <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-sm rounded-full px-2.5 py-1 border border-white/20 shadow-lg">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              <span className="text-xs text-white/80">Live</span>
            </div>
          </div>
        </>
      )}

      {/* Development helper label */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-12 right-3 bg-purple-600/80 backdrop-blur-sm px-2 py-1 rounded text-xs text-white pointer-events-none opacity-50 hover:opacity-100 transition-opacity">
          Street View Window
        </div>
      )}
    </div>
  );
}
