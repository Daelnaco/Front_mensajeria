import { motion } from 'motion/react';
import { Avatar, AvatarImage, AvatarFallback } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import { formatMessageTime } from '../../utils/dateUtils';

interface MessageBubbleProps {
  message: {
    id: string;
    text: string;
    sender: string;
    timestamp: Date;
    isOwn: boolean;
    status?: 'sent' | 'delivered' | 'read';
    avatar?: string;
  };
  showAvatar?: boolean;
}

export function MessageBubble({ message, showAvatar = true }: MessageBubbleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-end gap-2 mb-3 ${
        message.isOwn ? 'flex-row-reverse' : 'flex-row'
      }`}
    >
      {showAvatar && !message.isOwn && (
        <Avatar className="h-8 w-8 border-2 border-green-200">
          <AvatarImage src={message.avatar} />
          <AvatarFallback className="bg-green-100 text-green-700">
            {message.sender.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className={`flex flex-col ${message.isOwn ? 'items-end' : 'items-start'} max-w-[70%]`}>
        {!message.isOwn && showAvatar && (
          <span className="text-xs text-muted-foreground mb-1 px-1">
            {message.sender}
          </span>
        )}
        
        <div
          className={`rounded-2xl px-4 py-2 shadow-sm ${
            message.isOwn
              ? 'bg-primary text-primary-foreground rounded-br-md'
              : 'bg-card text-card-foreground border border-border rounded-bl-md'
          }`}
        >
          <p className="break-words">{message.text}</p>
        </div>
        
        <div className={`flex items-center gap-1 mt-1 px-1 ${message.isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
          <span className="text-xs text-muted-foreground">
            {formatMessageTime(message.timestamp)}
          </span>
          
          {message.isOwn && message.status && (
            <Badge 
              variant="outline" 
              className={`text-xs h-4 ${
                message.status === 'read' 
                  ? 'bg-green-50 text-green-700 border-green-200' 
                  : message.status === 'delivered'
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'bg-gray-50 text-gray-700 border-gray-200'
              }`}
            >
              {message.status === 'read' ? 'Leído' : 
               message.status === 'delivered' ? 'Entregado' : 'Enviado'}
            </Badge>
          )}
        </div>
      </div>
    </motion.div>
  );
}