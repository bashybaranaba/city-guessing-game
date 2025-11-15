import { ArrowRight, ArrowDown, RotateCcw, Play, MessageCircle, Search, Trophy, CheckCircle, XCircle } from 'lucide-react';
import { Card } from './ui/card';

export function UserFlowDiagram() {
  return (
    <div className="w-full max-w-6xl mx-auto p-8">
      <Card className="bg-gradient-to-br from-slate-50 to-slate-100 p-8">
        <div className="mb-6">
          <h2 className="text-3xl text-slate-900 mb-2">Game Flow Diagram</h2>
          <p className="text-slate-600">Complete journey through "Where in the World Am I?"</p>
        </div>

        {/* Flow Diagram */}
        <div className="space-y-8">
          {/* Main Menu */}
          <div className="flex flex-col items-center">
            <FlowNode
              icon={<Play className="w-6 h-6" />}
              title="Main Menu"
              description="Choose Play, How to Play, or Settings"
              color="blue"
            />
            <ArrowLabel label="Click 'Play Game'" />
          </div>

          {/* Game Scene (Round Start) */}
          <div className="flex flex-col items-center">
            <FlowNode
              icon={<MessageCircle className="w-6 h-6" />}
              title="Game Scene"
              description="Round 1-6: Click characters to collect hints"
              color="purple"
            />
            <ArrowLabel label="Collect hints by clicking NPCs" />
          </div>

          {/* Dialogue Scene */}
          <div className="flex flex-col items-center">
            <FlowNode
              icon={<MessageCircle className="w-6 h-6" />}
              title="Dialogue Panel"
              description="View character hint (with optional translation)"
              color="indigo"
            />
            <ArrowLabel label="Close dialogue, continue exploring" />
          </div>

          {/* Guess Input */}
          <div className="flex flex-col items-center">
            <FlowNode
              icon={<Search className="w-6 h-6" />}
              title="Make a Guess"
              description="Type location name in the guess box"
              color="green"
            />
            <div className="my-4">
              <ArrowDown className="w-8 h-8 text-slate-400 mx-auto" />
            </div>
          </div>

          {/* Result - Branching */}
          <div className="flex flex-col items-center">
            <FlowNode
              icon={<Trophy className="w-6 h-6" />}
              title="Round Result"
              description="See if guess was correct and points earned"
              color="yellow"
            />
            
            {/* Branching paths */}
            <div className="grid grid-cols-2 gap-8 mt-8 w-full max-w-4xl">
              {/* Left Path - More Rounds */}
              <div className="flex flex-col items-center">
                <div className="bg-green-100 border-2 border-green-400 rounded-lg p-3 mb-4">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm">More rounds remaining</span>
                  </div>
                </div>
                <ArrowDown className="w-6 h-6 text-green-500 mb-4" />
                <FlowNode
                  icon={<RotateCcw className="w-6 h-6" />}
                  title="Next Round"
                  description="New location, new characters"
                  color="purple"
                  size="small"
                />
                <div className="mt-4 text-sm text-slate-500 text-center">
                  Loops back to Game Scene
                </div>
              </div>

              {/* Right Path - Game Over */}
              <div className="flex flex-col items-center">
                <div className="bg-blue-100 border-2 border-blue-400 rounded-lg p-3 mb-4">
                  <div className="flex items-center gap-2 text-blue-700">
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm">All 6 rounds completed</span>
                  </div>
                </div>
                <ArrowDown className="w-6 h-6 text-blue-500 mb-4" />
                <FlowNode
                  icon={<Trophy className="w-6 h-6" />}
                  title="Game Over"
                  description="Final score & return to menu"
                  color="amber"
                  size="small"
                />
                <div className="mt-4 text-sm text-slate-500 text-center">
                  Returns to Main Menu
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-12 pt-6 border-t border-slate-300">
          <h3 className="text-lg text-slate-900 mb-4">Flow Legend</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
              <div>
                <div className="text-slate-900">Single Path</div>
                <div className="text-slate-600">Direct progression to next step</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
              <div>
                <div className="text-slate-900">Continue Loop</div>
                <div className="text-slate-600">Return to game for next round</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
              <div>
                <div className="text-slate-900">End State</div>
                <div className="text-slate-600">Game completion, return to menu</div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

// Flow Node Component
interface FlowNodeProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: 'blue' | 'purple' | 'indigo' | 'green' | 'yellow' | 'amber';
  size?: 'normal' | 'small';
}

function FlowNode({ icon, title, description, color, size = 'normal' }: FlowNodeProps) {
  const colorClasses = {
    blue: 'bg-blue-500 border-blue-600',
    purple: 'bg-purple-500 border-purple-600',
    indigo: 'bg-indigo-500 border-indigo-600',
    green: 'bg-green-500 border-green-600',
    yellow: 'bg-yellow-500 border-yellow-600',
    amber: 'bg-amber-500 border-amber-600',
  };

  const sizeClasses = size === 'small' ? 'max-w-xs' : 'max-w-md';

  return (
    <div className={`w-full ${sizeClasses} mx-auto`}>
      <div className={`${colorClasses[color]} border-4 rounded-xl p-6 shadow-lg`}>
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-white/20 p-2 rounded-lg text-white">
            {icon}
          </div>
          <h3 className="text-xl text-white">{title}</h3>
        </div>
        <p className="text-white/90 text-sm">{description}</p>
      </div>
    </div>
  );
}

// Arrow with Label
interface ArrowLabelProps {
  label: string;
}

function ArrowLabel({ label }: ArrowLabelProps) {
  return (
    <div className="flex flex-col items-center my-4">
      <ArrowDown className="w-8 h-8 text-slate-400" />
      <div className="bg-slate-200 px-4 py-2 rounded-full mt-2">
        <span className="text-sm text-slate-700">{label}</span>
      </div>
    </div>
  );
}
