// ==========================================
// MESSAGES HOOK
// ==========================================

import { useState, useEffect, useCallback } from 'react';
import { conversationService } from '../services/conversation.service';
import type { Message, SendMessagePayload } from '../types';

export function useMessages(conversationId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const fetchMessages = useCallback(async () => {
    if (!conversationId) {
      setMessages([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await conversationService.getMessages(conversationId);
      
      if (response.success) {
        // Convert timestamp strings to Date objects
        const messagesWithDates = response.data.data.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
        setMessages(messagesWithDates);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar mensajes');
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  }, [conversationId]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const sendMessage = useCallback(async (text: string, attachments?: File[]) => {
    if (!conversationId || !text.trim()) return;

    try {
      setSending(true);
      setError(null);

      const payload: SendMessagePayload = {
        conversationId,
        text,
        attachments,
      };

      const response = await conversationService.sendMessage(payload);

      if (response.success) {
        const newMessage = {
          ...response.data,
          timestamp: new Date(response.data.timestamp),
        };
        setMessages(prev => [...prev, newMessage]);
        return newMessage;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al enviar mensaje');
      console.error('Error sending message:', err);
      throw err;
    } finally {
      setSending(false);
    }
  }, [conversationId]);

  const addMessage = useCallback((message: Message) => {
    setMessages(prev => [...prev, message]);
  }, []);

  return {
    messages,
    loading,
    error,
    sending,
    sendMessage,
    addMessage,
    refetch: fetchMessages,
  };
}
