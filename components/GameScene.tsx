import { CharacterRole } from './CharacterInfoCard';
import { TaxiInterior } from './TaxiInterior';
import { TaxiDriverCard } from './TaxiDriverCard';

interface CharacterData {
  id: string;
  name: string;
  hint: string;
  translation?: string;
  color: string;
  mood?: 'happy' | 'neutral' | 'mysterious' | 'excited' | 'tired';
  description?: string;
  role?: CharacterRole;
}

interface GameSceneProps {
  backgroundImage: string;
  characters: CharacterData[];
  revealedCharacters: Set<string>;
  onCharacterClick: (characterId: string) => void;
  languageDifficulty: {
    level: 'Easy' | 'Medium' | 'Hard';
    description: string;
  };
  showDevHelpers?: boolean; // Toggle Street View window indicators
  currentLocation?: string; // Location name for Street View overlay
  compassHeading?: number; // Compass heading (0-360°) for navigation
  showStreetViewOverlay?: boolean; // Toggle Street View UI overlays
  driverName?: string; // Taxi driver's name
  driverLanguages?: string[]; // Languages the driver speaks
  voiceEnabled?: boolean; // Whether voice is enabled
  driverState?: 'idle' | 'talking' | 'listening' | 'processing'; // Current driver interaction state
  onVoiceStart?: () => void; // Voice recording start callback
  onVoiceStop?: () => void; // Voice recording stop callback
  onTextSubmit?: (message: string) => void; // Callback when user submits text message
  isVoiceActive?: boolean; // Whether voice recording is active
  driverVoiceEnabled?: boolean; // Whether driver voice output is enabled
  onToggleDriverVoice?: (enabled: boolean) => void; // Callback to toggle driver voice
  onReplayAudio?: () => void; // Replay driver's last line
  canReplay?: boolean; // Whether there's audio to replay
}

export function GameScene({
  backgroundImage,
  characters,
  revealedCharacters,
  onCharacterClick,
  languageDifficulty,
  showDevHelpers = true,
  currentLocation,
  compassHeading = 0,
  showStreetViewOverlay = true,
  driverName = 'Carlos',
  driverLanguages = ['EN'],
  voiceEnabled = true,
  driverState = 'idle',
  onVoiceStart,
  onVoiceStop,
  onTextSubmit,
  isVoiceActive = false,
  driverVoiceEnabled = true,
  onToggleDriverVoice,
  onReplayAudio,
  canReplay = false,
}: GameSceneProps) {
  // Use the first character as the driver to talk to
  const driver = characters[0];
  return (
    <div className="relative w-full h-full flex flex-col">
      {/* Taxi Interior Scene - Takes up most of the space */}
      <div className="flex-1 relative rounded-t-2xl overflow-hidden bg-slate-800">
        {/* Taxi Interior with Street View Window */}
        <TaxiInterior 
          streetViewImage={backgroundImage} 
          showDevHelpers={showDevHelpers}
          location={currentLocation}
          heading={compassHeading}
          showStreetViewOverlay={showStreetViewOverlay}
        />

        {/* Taxi Driver Card - Bottom corner */}
        <TaxiDriverCard
          driverName={driverName}
          languages={driverLanguages}
          voiceEnabled={voiceEnabled}
          onClick={() => driver && onCharacterClick(driver.id)}
          position="bottom-left"
          avatarColor={driver?.color || '#10b981'}
          disabled={!driver}
          state={driverState}
          onVoiceStart={onVoiceStart}
          onVoiceStop={onVoiceStop}
          onTextSubmit={onTextSubmit}
          isVoiceActive={isVoiceActive}
          driverVoiceEnabled={driverVoiceEnabled}
          onToggleDriverVoice={onToggleDriverVoice}
          onReplayAudio={onReplayAudio}
          canReplay={canReplay}
        />
      </div>
    </div>
  );
}
