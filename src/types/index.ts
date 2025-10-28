// ==========================================
// TYPES & INTERFACES - MESSAGING & DISPUTES
// ==========================================

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'buyer' | 'seller' | 'support';
}

export interface Conversation {
  id: string;
  participantId: string;
  participant: string;
  avatar?: string;
  lastMessage: string;
  timestamp: Date;
  unreadCount: number;
  isOnline?: boolean;
  lastSeen?: Date;
  orderId?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  text: string;
  sender: string;
  senderId: string;
  timestamp: Date;
  isOwn: boolean;
  status?: 'sent' | 'delivered' | 'read';
  avatar?: string;
  attachments?: Attachment[];
}

export interface Attachment {
  id: string;
  type: 'image' | 'document' | 'video';
  url: string;
  filename: string;
  size: number;
}

export interface Dispute {
  id: string;
  orderId: string;
  orderNumber: string;
  product: string;
  seller: string;
  amount: string;
  status: DisputeStatus;
  reason: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  evidence: Evidence[];
  timeline: TimelineEvent[];
}

export type DisputeStatus = 
  | 'pending_verification'
  | 'in_review'
  | 'waiting_seller'
  | 'resolved'
  | 'rejected';

export interface Evidence {
  id: string;
  type: 'image' | 'document';
  url: string;
  filename: string;
  uploadedAt: Date;
}

export interface TimelineEvent {
  id: string;
  type: 'created' | 'status_change' | 'comment' | 'evidence_added' | 'resolved';
  description: string;
  timestamp: Date;
  actor: string;
  metadata?: Record<string, any>;
}

export interface CreateDisputePayload {
  orderId: string;
  reason: string;
  description: string;
  evidence: File[];
}

export interface SendMessagePayload {
  conversationId: string;
  text: string;
  attachments?: File[];
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface ApiError {
  success: false;
  error: string;
  code?: string;
  details?: Record<string, any>;
}
