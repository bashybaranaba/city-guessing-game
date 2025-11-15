import { ShoppingBag, MapPin, User, Coffee, Briefcase, BookOpen } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';

export type CharacterRole = 'vendor' | 'guide' | 'local' | 'worker' | 'artist' | 'chef';

interface CharacterInfoCardProps {
  name: string;
  description: string;
  role: CharacterRole;
  color: string;
  revealed: boolean;
}

const roleIcons: Record<CharacterRole, typeof ShoppingBag> = {
  vendor: ShoppingBag,
  guide: MapPin,
  local: User,
  worker: Briefcase,
  artist: BookOpen,
  chef: Coffee,
};

const roleLabels: Record<CharacterRole, string> = {
  vendor: 'Vendor',
  guide: 'Tour Guide',
  local: 'Local Resident',
  worker: 'Worker',
  artist: 'Artist',
  chef: 'Chef',
};

export function CharacterInfoCard({ 
  name, 
  description, 
  role, 
  color,
  revealed 
}: CharacterInfoCardProps) {
  const RoleIcon = roleIcons[role];
  const roleLabel = roleLabels[role];

  return (
    <Card className="border-2 bg-gradient-to-br from-white to-slate-50 shadow-xl overflow-hidden">
      {/* Header with color accent */}
      <div 
        className="h-2 w-full"
        style={{ backgroundColor: color }}
      />

      <div className="p-4 space-y-3">
        {/* Character Name */}
        <div className="flex items-center justify-between">
          <h3 
            className="text-lg"
            style={{ color: color }}
          >
            {name}
          </h3>
          {revealed && (
            <Badge 
              variant="outline" 
              className="bg-green-50 border-green-300 text-green-700 text-xs"
            >
              Talked
            </Badge>
          )}
        </div>

        <Separator />

        {/* Role Badge */}
        <div className="flex items-center gap-2">
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${color}20` }}
          >
            <RoleIcon 
              className="w-4 h-4"
              style={{ color: color }}
            />
          </div>
          <div>
            <p className="text-xs text-slate-500">Role</p>
            <p className="text-sm text-slate-700">{roleLabel}</p>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1">
          <p className="text-xs text-slate-500">About</p>
          <p className="text-sm text-slate-700 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Hint Status */}
        <div 
          className="rounded-lg p-3 border-2"
          style={{ 
            backgroundColor: revealed ? `${color}10` : '#f1f5f9',
            borderColor: revealed ? `${color}40` : '#cbd5e1'
          }}
        >
          <p className="text-xs text-center" style={{ 
            color: revealed ? color : '#64748b'
          }}>
            {revealed 
              ? '✓ You have talked to this character' 
              : 'Click portrait to talk and get a hint'}
          </p>
        </div>
      </div>
    </Card>
  );
}
