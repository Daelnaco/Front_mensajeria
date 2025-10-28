import { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '../../components/ui/avatar';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Card } from '../../components/ui/card';
import { ScrollArea } from '../../components/ui/scroll-area';
import { Skeleton } from '../../components/ui/skeleton';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';
import { MoreVertical, Phone, Video } from 'lucide-react';
import { motion } from 'motion/react';
import { useTyping } from '../../hooks/useTyping';

interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: Date;
  isOwn: boolean;
  status?: 'sent' | 'delivered' | 'read';
  avatar?: string;
}

interface ChatWindowProps {
  conversation: {
    id: string;
    participant: string;
    avatar?: string;
    isOnline?: boolean;
    lastSeen?: Date;
  } | null;
  messages: Message[];
  onSendMessage: (message: string) => void;
  loading?: boolean;
  sending?: boolean;
}

export function ChatWindow({ conversation, messages, onSendMessage, loading = false, sending = false }: ChatWindowProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { isTyping, startTyping } = useTyping();

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages]);

  const handleSendMessage = (message: string) => {
    onSendMessage(message);
    startTyping();
  };

  if (!conversation) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 flex items-center justify-center bg-muted/20"
      >
        <div className="text-center text-muted-foreground">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            💬
          </div>
          <h3>Selecciona una conversación</h3>
          <p className="text-sm">Elige una conversación para comenzar a chatear</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex-1 flex flex-col bg-background"
    >
      {/* Header */}
      <Card className="m-0 rounded-none border-x-0 border-t-0">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="h-10 w-10 border-2 border-green-200">
                <AvatarImage src={conversation.avatar} />
                <AvatarFallback className="bg-green-100 text-green-700">
                  {conversation.participant.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {conversation.isOnline && (
                <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></div>
              )}
            </div>
            
            <div>
              <h3>{conversation.participant}</h3>
              <div className="flex items-center gap-2">
                {conversation.isOnline ? (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs h-5">
                    En línea
                  </Badge>
                ) : conversation.lastSeen ? (
                  <span className="text-xs text-muted-foreground">
                    Última vez hace {Math.floor((Date.now() - conversation.lastSeen.getTime()) / (1000 * 60))} min
                  </span>
                ) : null}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Video className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Messages */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-1">
          {loading ? (
            // Loading skeletons
            Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className={`flex ${index % 2 === 0 ? 'justify-end' : 'justify-start'} mb-3`}>
                <div className={`flex gap-2 ${index % 2 === 0 ? 'flex-row-reverse' : ''} max-w-[70%]`}>
                  {index % 2 !== 0 && <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />}
                  <Skeleton className="h-12 w-48 rounded-2xl" />
                </div>
              </div>
            ))
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <div className="text-center">
                <p>No hay mensajes</p>
                <p className="text-sm mt-2">Inicia la conversación enviando un mensaje</p>
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <MessageBubble
                key={message.id}
                message={message}
                showAvatar={
                  index === 0 ||
                  messages[index - 1].sender !== message.sender ||
                  message.timestamp.getTime() - messages[index - 1].timestamp.getTime() > 300000
                }
              />
            ))
          )}
          
          {isTyping && conversation && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-muted-foreground text-sm px-1"
            >
              <Avatar className="h-6 w-6 border border-green-200">
                <AvatarImage src={conversation.avatar} />
                <AvatarFallback className="bg-green-100 text-green-700 text-xs">
                  {conversation.participant.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex items-center gap-1">
                <span>{conversation.participant} está escribiendo</span>
                <div className="flex gap-1">
                  <div className="w-1 h-1 bg-current rounded-full animate-pulse"></div>
                  <div className="w-1 h-1 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-1 h-1 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <MessageInput onSendMessage={handleSendMessage} disabled={sending} />
    </motion.div>
  );
}