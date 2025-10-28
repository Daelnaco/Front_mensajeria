import { useState } from "react";
import { ConversationList } from "../components/mui/ConversationList";
import { ChatWindow } from "../components/mui/ChatWindow";
import { motion } from "motion/react";
import { useConversations } from "../hooks/useConversations";
import { useMessages } from "../hooks/useMessages";
import { Alert, AlertDescription } from "../components/ui/alert";
import { AlertCircle } from "lucide-react";

export function MessagingAndDisputes() {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  
  // Fetch conversations from API
  const { 
    conversations, 
    loading: loadingConversations,
    error: conversationsError,
    markAsRead,
    updateConversation 
  } = useConversations();
  
  // Fetch messages for selected conversation
  const { 
    messages, 
    loading: loadingMessages,
    error: messagesError,
    sending,
    sendMessage 
  } = useMessages(selectedConversationId);

  const selectedConversation = conversations.find(
    (c) => c.id === selectedConversationId,
  );

  const handleSendMessage = async (messageText: string) => {
    if (!selectedConversationId || !messageText.trim() || sending) return;

    try {
      // Send message via API
      await sendMessage(messageText);

      // Update conversation's last message in local state
      if (selectedConversation) {
        updateConversation(selectedConversationId, {
          lastMessage: messageText,
          timestamp: new Date(),
          unreadCount: 0,
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Error is already handled in useMessages hook
    }
  };

  const handleSelectConversation = async (conversationId: string) => {
    setSelectedConversationId(conversationId);
    
    // Mark as read via API
    await markAsRead(conversationId);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-full bg-background rounded-lg border border-border overflow-hidden shadow-sm"
    >
      {/* Error Messages */}
      {(conversationsError || messagesError) && (
        <Alert variant="destructive" className="m-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {conversationsError || messagesError}
          </AlertDescription>
        </Alert>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Conversations Sidebar */}
        <div className="w-80 border-r border-border bg-card">
          <ConversationList
            conversations={conversations}
            selectedConversationId={selectedConversationId}
            onSelectConversation={handleSelectConversation}
            loading={loadingConversations}
          />
        </div>

        {/* Chat Window */}
        <ChatWindow
          conversation={selectedConversation || null}
          messages={messages}
          onSendMessage={handleSendMessage}
          loading={loadingMessages}
          sending={sending}
        />
      </div>
    </motion.div>
  );
}