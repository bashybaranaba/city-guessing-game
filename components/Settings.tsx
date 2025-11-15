import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { ChevronLeft, Volume2, Music, Languages, Globe } from 'lucide-react';
import { Separator } from './ui/separator';

interface SettingsProps {
  onBack: () => void;
}

export function Settings({ onBack }: SettingsProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <Button
              onClick={onBack}
              variant="ghost"
              size="sm"
              className="pl-0"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <Globe className="w-10 h-10 text-blue-600" />
            <div>
              <CardTitle className="text-3xl">Settings</CardTitle>
              <CardDescription>
                Customize your gaming experience
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Audio Settings */}
          <div>
            <h3 className="text-lg mb-4">Audio</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Volume2 className="w-5 h-5 text-slate-600" />
                  <div>
                    <Label htmlFor="sound-effects">Sound Effects</Label>
                    <p className="text-sm text-slate-500">Character interactions and UI sounds</p>
                  </div>
                </div>
                <Switch id="sound-effects" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Music className="w-5 h-5 text-slate-600" />
                  <div>
                    <Label htmlFor="music">Background Music</Label>
                    <p className="text-sm text-slate-500">Ambient music during gameplay</p>
                  </div>
                </div>
                <Switch id="music" defaultChecked />
              </div>
            </div>
          </div>

          <Separator />

          {/* Language Settings */}
          <div>
            <h3 className="text-lg mb-4">Language</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Languages className="w-5 h-5 text-slate-600" />
                  <div>
                    <Label htmlFor="auto-translate">Auto-show Translations</Label>
                    <p className="text-sm text-slate-500">Automatically display English translations</p>
                  </div>
                </div>
                <Switch id="auto-translate" />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-slate-600" />
                  <div>
                    <Label htmlFor="difficulty-badge">Show Language Difficulty</Label>
                    <p className="text-sm text-slate-500">Display language difficulty indicator</p>
                  </div>
                </div>
                <Switch id="difficulty-badge" defaultChecked />
              </div>
            </div>
          </div>

          <Separator />

          {/* Gameplay Settings */}
          <div>
            <h3 className="text-lg mb-4">Gameplay</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="hints-display">Keep Hints Visible</Label>
                  <p className="text-sm text-slate-500">Show all collected hints on screen</p>
                </div>
                <Switch id="hints-display" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="character-names">Show Character Names</Label>
                  <p className="text-sm text-slate-500">Display names above characters</p>
                </div>
                <Switch id="character-names" defaultChecked />
              </div>
            </div>
          </div>

          <Separator />

          {/* Info Section */}
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-slate-700">
              <strong>Note:</strong> Settings are currently for demonstration purposes. 
              Full functionality will be available in future updates.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
