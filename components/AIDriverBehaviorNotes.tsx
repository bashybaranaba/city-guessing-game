import { FileText, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';

/**
 * AIDriverBehaviorNotes Component
 * 
 * DESIGN/DEVELOPMENT REFERENCE ONLY - NOT FOR PRODUCTION UI
 * 
 * This component documents the expected behavior patterns for the AI taxi driver
 * in conversations. It serves as a handoff guide for developers implementing
 * the actual AI conversation system.
 */
export function AIDriverBehaviorNotes() {
  return (
    <Card className="border-4 border-orange-500 bg-orange-50 shadow-lg">
      <CardHeader className="bg-orange-100 border-b-2 border-orange-300">
        <div className="flex items-center gap-3">
          <div className="bg-orange-500 p-2 rounded-lg">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-orange-900 flex items-center gap-2">
              AI Driver Behavior Notes
              <span className="text-xs bg-orange-500 text-white px-2 py-0.5 rounded">
                DEV ONLY
              </span>
            </CardTitle>
            <p className="text-xs text-orange-700 mt-1">
              Design handoff documentation - Remove before production
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-5">
        <Alert className="mb-4 border-orange-300 bg-orange-100">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-900 text-sm">
            This component is for designer/developer handoff only. It should NOT be visible in the final UI.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div>
            <h4 className="text-sm text-orange-900 mb-3 uppercase tracking-wide">
              Expected AI Conversation Patterns:
            </h4>
            
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-slate-800 bg-white p-3 rounded-lg border border-orange-200">
                <span className="text-orange-600 flex-shrink-0 mt-0.5">•</span>
                <span>
                  <strong className="text-orange-900">Language Mixing:</strong> Driver uses local language + English mix, especially for place names, idioms, and casual phrases. Example: "El tráfico today is terrible! Everyone's going to the mercado."
                </span>
              </li>
              
              <li className="flex items-start gap-3 text-sm text-slate-800 bg-white p-3 rounded-lg border border-orange-200">
                <span className="text-orange-600 flex-shrink-0 mt-0.5">•</span>
                <span>
                  <strong className="text-orange-900">Location Secrecy:</strong> Driver avoids directly giving the city/country name unless the player has used a high-cost hint. Conversations should be natural but not give away the answer.
                </span>
              </li>
              
              <li className="flex items-start gap-3 text-sm text-slate-800 bg-white p-3 rounded-lg border border-orange-200">
                <span className="text-orange-600 flex-shrink-0 mt-0.5">•</span>
                <span>
                  <strong className="text-orange-900">Authentic Personality:</strong> Driver talks like a real person (small talk, jokes, personal anecdotes about family, traffic, weather, local food), not just hint-bot about the location. Make it feel like a genuine taxi conversation.
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
            <h5 className="text-xs text-blue-900 mb-2 uppercase tracking-wide">
              Implementation Notes:
            </h5>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• Free conversations should feel natural and not give scoring penalties</li>
              <li>• Explicit "Get Hint" button clicks should provide location-specific clues</li>
              <li>• Translation reveals should maintain the authentic language mixing pattern</li>
              <li>• Driver personality should match the location's cultural context</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
