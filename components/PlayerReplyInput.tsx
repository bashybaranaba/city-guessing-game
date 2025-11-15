import { useState } from 'react';
import { Send, MessageCircle } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';

interface PlayerReplyInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

const quickReplies = [
  { id: 'food', label: 'Ask about food', icon: '🍽️' },
  { id: 'weather', label: 'Ask about weather', icon: '🌤️' },
  { id: 'history', label: 'Ask about history', icon: '🏛️' },
  { id: 'location', label: 'Where am I?', icon: '📍' },
  { id: 'culture', label: 'Ask about culture', icon: '🎭' }
];

export function PlayerReplyInput({ onSendMessage, disabled = false }: PlayerReplyInputProps) {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleQuickReply = (label: string) => {
    if (!disabled) {
      onSendMessage(label);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return null;
}
