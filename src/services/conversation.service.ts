// ==========================================
// CONVERSATION SERVICE
// ==========================================

import { apiService } from './api.service';
import { API_ENDPOINTS } from '../config/api';
import type { Conversation, Message, SendMessagePayload, PaginatedResponse } from '../types';

export class ConversationService {
  /**
   * Get all conversations for the current user
   */
  async getConversations() {
    return apiService.get<Conversation[]>(API_ENDPOINTS.conversations.list);
  }

  /**
   * Get a single conversation by ID
   */
  async getConversation(conversationId: string) {
    return apiService.get<Conversation>(API_ENDPOINTS.conversations.get(conversationId));
  }

  /**
   * Get messages for a conversation
   */
  async getMessages(conversationId: string, page = 1, limit = 50) {
    const endpoint = `${API_ENDPOINTS.messages.list(conversationId)}?page=${page}&limit=${limit}`;
    return apiService.get<PaginatedResponse<Message>>(endpoint);
  }

  /**
   * Send a message in a conversation
   */
  async sendMessage(payload: SendMessagePayload) {
    const { conversationId, text, attachments } = payload;

    // If there are attachments, use FormData
    if (attachments && attachments.length > 0) {
      const formData = new FormData();
      formData.append('text', text);
      attachments.forEach((file) => {
        formData.append('attachments', file);
      });

      return apiService.upload<Message>(
        API_ENDPOINTS.messages.send(conversationId),
        formData
      );
    }

    // Otherwise, send JSON
    return apiService.post<Message>(
      API_ENDPOINTS.messages.send(conversationId),
      { text }
    );
  }

  /**
   * Mark conversation as read
   */
  async markConversationAsRead(conversationId: string) {
    return apiService.post<void>(API_ENDPOINTS.conversations.markRead(conversationId));
  }

  /**
   * Create a new conversation
   */
  async createConversation(participantId: string, initialMessage?: string) {
    return apiService.post<Conversation>(API_ENDPOINTS.conversations.create, {
      participantId,
      initialMessage,
    });
  }
}

export const conversationService = new ConversationService();
