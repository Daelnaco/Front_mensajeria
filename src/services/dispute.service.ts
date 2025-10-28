// ==========================================
// DISPUTE SERVICE
// ==========================================

import { apiService } from './api.service';
import { API_ENDPOINTS } from '../config/api';
import type { Dispute, CreateDisputePayload, DisputeStatus } from '../types';

export class DisputeService {
  /**
   * Get all disputes for the current user
   */
  async getDisputes(status?: DisputeStatus) {
    const endpoint = status 
      ? `${API_ENDPOINTS.disputes.list}?status=${status}`
      : API_ENDPOINTS.disputes.list;
    
    return apiService.get<Dispute[]>(endpoint);
  }

  /**
   * Get a single dispute by ID
   */
  async getDispute(disputeId: string) {
    return apiService.get<Dispute>(API_ENDPOINTS.disputes.get(disputeId));
  }

  /**
   * Create a new dispute
   */
  async createDispute(payload: CreateDisputePayload) {
    const { orderId, reason, description, evidence } = payload;

    const formData = new FormData();
    formData.append('orderId', orderId);
    formData.append('reason', reason);
    formData.append('description', description);

    evidence.forEach((file) => {
      formData.append('evidence', file);
    });

    return apiService.upload<Dispute>(API_ENDPOINTS.disputes.create, formData);
  }

  /**
   * Update dispute status or details
   */
  async updateDispute(disputeId: string, data: Partial<Dispute>) {
    return apiService.patch<Dispute>(API_ENDPOINTS.disputes.update(disputeId), data);
  }

  /**
   * Add evidence to an existing dispute
   */
  async addEvidence(disputeId: string, files: File[]) {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('evidence', file);
    });

    return apiService.upload<Dispute>(
      API_ENDPOINTS.disputes.addEvidence(disputeId),
      formData
    );
  }

  /**
   * Add a comment to a dispute
   */
  async addComment(disputeId: string, comment: string) {
    return apiService.post<Dispute>(
      API_ENDPOINTS.disputes.addComment(disputeId),
      { comment }
    );
  }
}

export const disputeService = new DisputeService();
