import { StreetViewWindow } from './StreetViewWindow';

interface TaxiInteriorProps {
  streetViewImage: string;
  showDevHelpers?: boolean; // Set to false to hide development helper overlays
  location?: string; // Optional location name for Street View overlay
  heading?: number; // Optional compass heading (0-360 degrees)
  showStreetViewOverlay?: boolean; // Toggle Street View UI overlays
}

/**
 * TaxiInterior Component
 * 
 * This component renders a taxi interior view with a dedicated StreetViewWindow component
 * for displaying Street View or map imagery through the windshield and side windows.
 * 
 * === COMPONENT STRUCTURE ===
 * - StreetViewWindow: Reusable component for Street View imagery with UI overlays
 * - Taxi Interior SVG: Overlay with dashboard, steering wheel, seats, mirrors, etc.
 * - Development Helpers: Optional boundary indicators for window areas
 * 
 * === PROPS ===
 * @param streetViewImage - URL for background image (Street View, map, or location photo)
 * @param location - Optional location name displayed in Street View overlay
 * @param heading - Optional compass heading (0-360°) for navigation indicator
 * @param showStreetViewOverlay - Toggle Street View UI elements (compass, labels, etc.)
 * @param showDevHelpers - Toggle development helper boundaries (blue dashed lines)
 * 
 * === GOOGLE STREET VIEW INTEGRATION ===
 * 
 * METHOD 1: Static Street View Image (Simple)
 * - Pass Google Street View Static API URL to `streetViewImage` prop
 * - Example URL:
 *   https://maps.googleapis.com/maps/api/streetview?size=1200x800&location=48.8584,2.2945&heading=0&pitch=0&key=YOUR_API_KEY
 * 
 * METHOD 2: Interactive Street View (Advanced)
 * - Modify StreetViewWindow component to use Google Maps JavaScript API
 * - Replace background div with Street View panorama container
 * - See StreetViewWindow.tsx for implementation details
 * 
 * === WINDOW VISIBILITY AREAS ===
 * Street View is visible through:
 * • Main windshield: Top 50% of view, center 80% width
 * • Left side window: Left 8% width, 25-65% height
 * • Right side window: Right 8% width, 25-65% height
 * 
 * All other areas are covered by the taxi interior SVG overlay.
 */
export function TaxiInterior({ 
  streetViewImage, 
  showDevHelpers = true,
  location,
  heading = 0,
  showStreetViewOverlay = true,
}: TaxiInteriorProps) {
  return (
    <div className="relative w-full h-full overflow-hidden bg-slate-900">
      {/* 
        STREET VIEW WINDOW COMPONENT
        This dedicated component handles the Street View imagery display
        with optional UI overlays (compass, location label, etc.)
      */}
      <StreetViewWindow
        imageUrl={streetViewImage}
        showOverlay={showStreetViewOverlay}
        location={location}
        heading={heading}
        className="absolute inset-0"
      />

      {/* Taxi Interior Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <svg
          viewBox="0 0 1200 800"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            {/* Gradients for realistic shading */}
            <linearGradient id="dashGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1a1a1a" />
              <stop offset="50%" stopColor="#2d2d2d" />
              <stop offset="100%" stopColor="#1a1a1a" />
            </linearGradient>
            
            <linearGradient id="seatGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3a3a3a" />
              <stop offset="100%" stopColor="#1a1a1a" />
            </linearGradient>

            <linearGradient id="steeringGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2a2a2a" />
              <stop offset="50%" stopColor="#1a1a1a" />
              <stop offset="100%" stopColor="#2a2a2a" />
            </linearGradient>

            {/* Mirror gradient */}
            <linearGradient id="mirrorGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0a0a0a" />
              <stop offset="100%" stopColor="#1a1a1a" />
            </linearGradient>

            {/* Glass reflection effect */}
            <linearGradient id="glassReflection" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.1)" />
              <stop offset="50%" stopColor="rgba(255,255,255,0)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.05)" />
            </linearGradient>
          </defs>

          {/* WINDSHIELD FRAME (Top Window) */}
          {/* Top dashboard edge */}
          <path
            d="M 0 520 L 0 500 Q 200 440, 600 420 Q 1000 440, 1200 500 L 1200 520 Z"
            fill="url(#dashGradient)"
          />

          {/* Windshield center post (A-pillar on left) */}
          <path
            d="M 0 0 L 0 520 L 80 520 L 120 0 Z"
            fill="#1a1a1a"
            opacity="0.95"
          />
          {/* A-pillar shadow (left) */}
          <path
            d="M 80 0 L 80 520 L 120 520 L 120 0 Z"
            fill="rgba(0,0,0,0.3)"
          />

          {/* Windshield center post (A-pillar on right) */}
          <path
            d="M 1200 0 L 1200 520 L 1120 520 L 1080 0 Z"
            fill="#1a1a1a"
            opacity="0.95"
          />
          {/* A-pillar shadow (right) */}
          <path
            d="M 1120 0 L 1120 520 L 1080 520 L 1080 0 Z"
            fill="rgba(0,0,0,0.3)"
          />

          {/* SIDE WINDOWS */}
          {/* Left side window frame */}
          <path
            d="M 0 200 L 0 600 L 60 650 L 60 250 Z"
            fill="#1a1a1a"
            opacity="0.95"
          />

          {/* Right side window frame */}
          <path
            d="M 1200 200 L 1200 600 L 1140 650 L 1140 250 Z"
            fill="#1a1a1a"
            opacity="0.95"
          />

          {/* DASHBOARD */}
          {/* Main dashboard */}
          <rect
            x="0"
            y="520"
            width="1200"
            height="280"
            fill="url(#dashGradient)"
          />

          {/* Dashboard shadow (adds depth) */}
          <rect
            x="0"
            y="510"
            width="1200"
            height="20"
            fill="rgba(0,0,0,0.4)"
          />

          {/* Dashboard top highlight */}
          <ellipse
            cx="600"
            cy="520"
            rx="500"
            ry="15"
            fill="rgba(255,255,255,0.05)"
          />

          {/* STEERING WHEEL */}
          {/* Steering wheel outer ring */}
          <circle
            cx="250"
            cy="520"
            r="85"
            fill="none"
            stroke="url(#steeringGradient)"
            strokeWidth="24"
          />

          {/* Steering wheel spokes */}
          <line
            x1="250"
            y1="435"
            x2="250"
            y2="520"
            stroke="#1a1a1a"
            strokeWidth="20"
          />
          <line
            x1="190"
            y1="490"
            x2="250"
            y2="520"
            stroke="#1a1a1a"
            strokeWidth="16"
          />
          <line
            x1="310"
            y1="490"
            x2="250"
            y2="520"
            stroke="#1a1a1a"
            strokeWidth="16"
          />

          {/* Steering wheel center hub */}
          <circle
            cx="250"
            cy="520"
            r="30"
            fill="#2a2a2a"
            stroke="#1a1a1a"
            strokeWidth="2"
          />

          {/* Horn button */}
          <circle
            cx="250"
            cy="520"
            r="18"
            fill="#3a3a3a"
          />

          {/* REAR-VIEW MIRROR */}
          {/* Mirror mount */}
          <rect
            x="580"
            y="180"
            width="40"
            height="60"
            rx="5"
            fill="#0a0a0a"
          />

          {/* Mirror glass */}
          <rect
            x="520"
            y="200"
            width="160"
            height="80"
            rx="8"
            fill="url(#mirrorGradient)"
            stroke="#0a0a0a"
            strokeWidth="3"
          />

          {/* Mirror inner frame */}
          <rect
            x="528"
            y="208"
            width="144"
            height="64"
            rx="6"
            fill="rgba(50,50,80,0.4)"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1"
          />

          {/* Mirror reflection highlight */}
          <rect
            x="540"
            y="220"
            width="40"
            height="40"
            rx="4"
            fill="url(#glassReflection)"
          />
          
          {/* Mirror reflection detail */}
          <rect
            x="590"
            y="225"
            width="30"
            height="30"
            rx="3"
            fill="rgba(200,220,255,0.05)"
          />

          {/* FRONT SEATS */}
          {/* Driver seat (left) */}
          <path
            d="M 100 600 L 80 800 L 200 800 L 240 750 L 280 800 L 380 800 L 340 600 Z"
            fill="url(#seatGradient)"
            stroke="#0a0a0a"
            strokeWidth="2"
          />
          {/* Driver seat shadow */}
          <ellipse
            cx="240"
            cy="750"
            rx="80"
            ry="20"
            fill="rgba(0,0,0,0.3)"
          />

          {/* Driver seat headrest */}
          <rect
            x="180"
            y="580"
            width="80"
            height="40"
            rx="8"
            fill="#2a2a2a"
            stroke="#0a0a0a"
            strokeWidth="2"
          />
          {/* Headrest highlight */}
          <rect
            x="185"
            y="585"
            width="30"
            height="30"
            rx="6"
            fill="rgba(255,255,255,0.03)"
          />

          {/* Passenger seat (right) */}
          <path
            d="M 1100 600 L 1120 800 L 1000 800 L 960 750 L 920 800 L 820 800 L 860 600 Z"
            fill="url(#seatGradient)"
            stroke="#0a0a0a"
            strokeWidth="2"
          />
          {/* Passenger seat shadow */}
          <ellipse
            cx="960"
            cy="750"
            rx="80"
            ry="20"
            fill="rgba(0,0,0,0.3)"
          />

          {/* Passenger seat headrest */}
          <rect
            x="940"
            y="580"
            width="80"
            height="40"
            rx="8"
            fill="#2a2a2a"
            stroke="#0a0a0a"
            strokeWidth="2"
          />
          {/* Headrest highlight */}
          <rect
            x="985"
            y="585"
            width="30"
            height="30"
            rx="6"
            fill="rgba(255,255,255,0.03)"
          />

          {/* DASHBOARD DETAILS */}
          {/* Center console */}
          <rect
            x="450"
            y="620"
            width="300"
            height="100"
            rx="10"
            fill="#1a1a1a"
            stroke="#0a0a0a"
            strokeWidth="2"
          />

          {/* Infotainment screen placeholder */}
          <rect
            x="480"
            y="640"
            width="240"
            height="60"
            rx="5"
            fill="#0a0a0a"
            stroke="#2a2a2a"
            strokeWidth="1"
          />

          {/* Screen subtle glow */}
          <rect
            x="485"
            y="645"
            width="230"
            height="50"
            rx="4"
            fill="rgba(100,150,255,0.05)"
          />

          {/* Dashboard vents (left side) */}
          <g>
            <rect x="350" y="580" width="60" height="30" rx="4" fill="#0a0a0a" />
            <line x1="360" y1="585" x2="360" y2="605" stroke="#1a1a1a" strokeWidth="2" />
            <line x1="375" y1="585" x2="375" y2="605" stroke="#1a1a1a" strokeWidth="2" />
            <line x1="390" y1="585" x2="390" y2="605" stroke="#1a1a1a" strokeWidth="2" />
          </g>

          {/* Dashboard vents (right side) */}
          <g>
            <rect x="790" y="580" width="60" height="30" rx="4" fill="#0a0a0a" />
            <line x1="800" y1="585" x2="800" y2="605" stroke="#1a1a1a" strokeWidth="2" />
            <line x1="815" y1="585" x2="815" y2="605" stroke="#1a1a1a" strokeWidth="2" />
            <line x1="830" y1="585" x2="830" y2="605" stroke="#1a1a1a" strokeWidth="2" />
          </g>

          {/* SUBTLE WINDOW REFLECTIONS */}
          {/* Windshield reflection */}
          <path
            d="M 150 100 Q 400 80, 600 100 Q 800 80, 1050 100 L 1050 120 Q 800 100, 600 120 Q 400 100, 150 120 Z"
            fill="rgba(255,255,255,0.02)"
          />

          {/* Side window reflections */}
          <ellipse
            cx="100"
            cy="350"
            rx="30"
            ry="80"
            fill="rgba(255,255,255,0.02)"
            transform="rotate(-10 100 350)"
          />
          <ellipse
            cx="1100"
            cy="350"
            rx="30"
            ry="80"
            fill="rgba(255,255,255,0.02)"
            transform="rotate(10 1100 350)"
          />

          {/* WINDOW FRAME LABELS (for development - can be removed later) */}
          {/* These indicate where the Street View imagery will be visible */}
        </svg>

        {/* Development Helpers - Toggle with showDevHelpers prop */}
        {showDevHelpers && (
          <>
            {/* Helpful overlay label */}
            <div className="absolute top-4 right-4 bg-blue-600/80 backdrop-blur-sm px-3 py-2 rounded-lg border border-blue-400/50 shadow-lg pointer-events-auto">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-300 rounded-full animate-pulse" />
                <p className="text-xs text-white">Street View Window</p>
              </div>
              <p className="text-xs text-blue-100 mt-1">View visible through taxi windows</p>
            </div>

            {/* Visual boundary indicators */}
            {/* These show the clear "window frame" areas for Street View integration */}
            <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
              {/* Windshield boundary indicator */}
              <div className="absolute top-0 left-[10%] right-[10%] h-[65%] border-2 border-dashed border-blue-400/30 rounded-t-lg">
                <div className="absolute top-2 left-2 bg-blue-500/80 px-2 py-1 rounded text-xs text-white">
                  Main Windshield View
                </div>
              </div>
              
              {/* Left side window boundary */}
              <div className="absolute top-[25%] left-0 w-[8%] h-[40%] border-2 border-dashed border-blue-400/30">
                <div className="absolute top-2 left-2 bg-blue-500/80 px-1.5 py-0.5 rounded text-xs text-white">L</div>
              </div>
              
              {/* Right side window boundary */}
              <div className="absolute top-[25%] right-0 w-[8%] h-[40%] border-2 border-dashed border-blue-400/30">
                <div className="absolute top-2 right-2 bg-blue-500/80 px-1.5 py-0.5 rounded text-xs text-white">R</div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
