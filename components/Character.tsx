import { User } from 'lucide-react';
import { Button } from './ui/button';

interface CharacterProps {
  name: string;
  hint: string;
  position: { x: number; y: number };
  revealed: boolean;
  onClick: () => void;
  color: string;
}

export function Character({ name, hint, position, revealed, onClick, color }: CharacterProps) {
  return (
    <div
      className="absolute flex flex-col items-center gap-2 transition-transform hover:scale-110 cursor-pointer"
      style={{ left: `${position.x}%`, top: `${position.y}%` }}
    >
      <div className="relative">
        <Button
          onClick={onClick}
          size="lg"
          className="rounded-full w-16 h-16 p-0 shadow-lg relative"
          style={{ backgroundColor: color }}
        >
          <User className="w-8 h-8 text-white" />
        </Button>
        {revealed && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
        )}
      </div>
      <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1 shadow-md">
        <span className="text-sm">{name}</span>
      </div>
    </div>
  );
}
