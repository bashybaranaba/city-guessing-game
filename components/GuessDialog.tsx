import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface GuessDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (guess: string) => void;
}

export function GuessDialog({ open, onClose, onSubmit }: GuessDialogProps) {
  const [guess, setGuess] = useState('');

  const handleSubmit = () => {
    if (guess.trim()) {
      onSubmit(guess.trim());
      setGuess('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Where in the World Are You?</DialogTitle>
          <DialogDescription>
            Based on the hints you've gathered, guess the location!
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="guess">Your Guess</Label>
            <Input
              id="guess"
              placeholder="e.g., Paris, France"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSubmit} className="flex-1">
              Submit Guess
            </Button>
            <Button onClick={onClose} variant="outline">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
