import { Avatar, AvatarImage, AvatarFallback } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import { Card } from '../../components/ui/card';
import { Skeleton } from '../../components/ui/skeleton';
import { motion } from 'motion/react';
import { formatMessageTime } from '../../utils/dateUtils';

interface Conversation {
  id: string;
  participant: string;
  avatar?: string;
  lastMessage: string;
  timestamp: Date;
  unreadCount: number;
  isOnline?: boolean;
}

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversationId: string | null;
  onSelectConversation: (id: string) => void;
  loading?: boolean;
}

export function ConversationList({ 
  conversations, 
  selectedConversationId, 
  onSelectConversation,
  loading = false
}: ConversationListProps) {
  // Sort conversations by timestamp (most recent first)
  const sortedConversations = [...conversations].sort((a, b) => 
    b.timestamp.getTime() - a.timestamp.getTime()
  );

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <h2>Conversaciones</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          // Loading skeletons
          Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="m-2 p-3">
              <div className="flex items-center gap-3">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            </div>
          ))
        ) : conversations.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground p-4 text-center">
            <div>
              <p>No hay conversaciones</p>
              <p className="text-sm mt-2">Tus mensajes aparecerán aquí</p>
            </div>
          </div>
        ) : (
          sortedConversations.map((conversation, index) => (
          <motion.div
            key={conversation.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card
              className={`m-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedConversationId === conversation.id
                  ? 'ring-2 ring-primary bg-accent/50'
                  : 'hover:bg-muted/50'
              }`}
              onClick={() => onSelectConversation(conversation.id)}
            >
              <div className="p-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-12 w-12 border-2 border-green-200">
                      <AvatarImage src={conversation.avatar} />
                      <AvatarFallback className="bg-green-100 text-green-700">
                        {conversation.participant.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {conversation.isOnline && (
                      <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="truncate">{conversation.participant}</h3>
                      <span className="text-xs text-muted-foreground">
                        {formatMessageTime(conversation.timestamp)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground truncate">
                        {conversation.lastMessage}
                      </p>
                      
                      {conversation.unreadCount > 0 && (
                        <Badge className="ml-2 bg-primary text-primary-foreground min-w-[20px] h-5 text-xs">
                          {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
          ))
        )}
      </div>
    </div>
  );
}