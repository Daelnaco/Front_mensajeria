// ==========================================
// CONVERSATIONS HOOK
// ==========================================

import { useState, useEffect, useCallback } from 'react';
import { conversationService } from '../services/conversation.service';
import type { Conversation, Message, SendMessagePayload } from '../types';

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConversations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await conversationService.getConversations();
      
      if (response.success) {
        // Convert timestamp strings to Date objects
        const conversationsWithDates = response.data.map(conv => ({
          ...conv,
          timestamp: new Date(conv.timestamp),
          lastSeen: conv.lastSeen ? new Date(conv.lastSeen) : undefined,
        }));
        setConversations(conversationsWithDates);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar conversaciones');
      console.error('Error fetching conversations:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const markAsRead = useCallback(async (conversationId: string) => {
    try {
      await conversationService.markConversationAsRead(conversationId);
      
      // Update local state
      setConversations(prev => prev.map(conv =>
        conv.id === conversationId
          ? { ...conv, unreadCount: 0, timestamp: new Date() }
          : conv
      ));
    } catch (err) {
      console.error('Error marking conversation as read:', err);
    }
  }, []);

  const updateConversation = useCallback((conversationId: string, updates: Partial<Conversation>) => {
    setConversations(prev => prev.map(conv =>
      conv.id === conversationId
        ? { ...conv, ...updates }
        : conv
    ));
  }, []);

  return {
    conversations,
    loading,
    error,
    refetch: fetchConversations,
    markAsRead,
    updateConversation,
  };
}
