import { Languages, Book } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

export function LanguageExamplesFrame() {
  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-slate-600 shadow-2xl">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center">
              <Book className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-white text-2xl">Multilingual Experience</h2>
              <p className="text-slate-400 text-sm">Examples of dialogue you might encounter</p>
            </div>
          </div>

          {/* Examples Grid */}
          <div className="space-y-6">
            {/* Easy Mode */}
            <div className="bg-slate-800/60 rounded-lg p-5 border-2 border-green-500/30">
              <div className="flex items-center justify-between mb-4">
                <Badge className="bg-green-500/90 hover:bg-green-500/90 border-2 border-green-400 text-white px-3 py-1">
                  <Languages className="w-3 h-3 mr-1.5" />
                  Easy
                </Badge>
                <span className="text-xs text-slate-400">English only</span>
              </div>
              
              <div className="space-y-3">
                <div className="bg-slate-900/60 rounded-lg p-4 border border-slate-700">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">
                      🚕
                    </div>
                    <span className="text-slate-300 text-sm">Taxi Driver</span>
                  </div>
                  <p className="text-slate-100">
                    "Been driving for 20 years. You see that bridge over there? They built it way back in the 80s. Still holds up great!"
                  </p>
                </div>
                <p className="text-xs text-slate-400 italic px-2">
                  All dialogue is in English, making it easy to understand and play.
                </p>
              </div>
            </div>

            {/* Medium Mode */}
            <div className="bg-slate-800/60 rounded-lg p-5 border-2 border-yellow-500/30">
              <div className="flex items-center justify-between mb-4">
                <Badge className="bg-yellow-500/90 hover:bg-yellow-500/90 border-2 border-yellow-400 text-white px-3 py-1">
                  <Languages className="w-3 h-3 mr-1.5" />
                  Medium
                </Badge>
                <span className="text-xs text-slate-400">Mixed languages</span>
              </div>
              
              <div className="space-y-3">
                <div className="bg-slate-900/60 rounded-lg p-4 border border-slate-700">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs">
                      🚕
                    </div>
                    <span className="text-slate-300 text-sm">Taxi Driver</span>
                  </div>
                  <div className="space-y-2">
                    <p className="text-slate-100">
                      "Ah, el tráfico today is terrible! Everyone's going to the mercado. You want café? Best espresso is two blocks that way."
                    </p>
                    <div className="pt-2 border-t border-slate-600">
                      <div className="flex items-center gap-2 mb-1">
                        <Languages className="w-3 h-3 text-slate-400" />
                        <span className="text-xs text-slate-400">Translation available</span>
                      </div>
                      <p className="text-slate-300 text-sm italic">
                        "Ah, the traffic today is terrible! Everyone's going to the market. You want coffee? Best espresso is two blocks that way."
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-slate-400 italic px-2">
                  Mix of local language with English words. Translations help bridge understanding.
                </p>
              </div>
            </div>

            {/* Hard Mode */}
            <div className="bg-slate-800/60 rounded-lg p-5 border-2 border-red-500/30">
              <div className="flex items-center justify-between mb-4">
                <Badge className="bg-red-500/90 hover:bg-red-500/90 border-2 border-red-400 text-white px-3 py-1">
                  <Languages className="w-3 h-3 mr-1.5" />
                  Hard
                </Badge>
                <span className="text-xs text-slate-400">Mostly local language</span>
              </div>
              
              <div className="space-y-3">
                <div className="bg-slate-900/60 rounded-lg p-4 border border-slate-700">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white text-xs">
                      🚕
                    </div>
                    <span className="text-slate-300 text-sm">Taxi Driver</span>
                  </div>
                  <div className="space-y-2">
                    <p className="text-slate-100">
                      "今天天气真热啊！My daughter works at that restaurant. 她说他们的饺子最好吃。Traffic jam again... 每天都这样！"
                    </p>
                    <div className="pt-2 border-t border-slate-600">
                      <div className="flex items-center gap-2 mb-1">
                        <Languages className="w-3 h-3 text-slate-400" />
                        <span className="text-xs text-slate-400">Translation available</span>
                      </div>
                      <p className="text-slate-300 text-sm italic">
                        "The weather is really hot today! My daughter works at that restaurant. She says their dumplings are the best. Traffic jam again... like this every day!"
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-slate-400 italic px-2">
                  Heavy use of local language with some English mixed in. Translations reveal the full conversation!
                </p>
              </div>
            </div>
          </div>

          {/* Footer Tip */}
          <div className="mt-6 bg-indigo-900/30 rounded-lg p-4 border border-indigo-500/30">
            <div className="flex items-start gap-3">
              <Languages className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-indigo-200 text-sm mb-1">Pro Tip</p>
                <p className="text-slate-300 text-sm">
                  Click the "Show translation" button in any dialogue to reveal the English translation. 
                  Translations are always available for non-English dialogue!
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
