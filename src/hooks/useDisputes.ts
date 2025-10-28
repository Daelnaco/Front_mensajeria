// ==========================================
// DISPUTES HOOK
// ==========================================

import { useState, useEffect, useCallback } from 'react';
import { disputeService } from '../services/dispute.service';
import type { Dispute, CreateDisputePayload, DisputeStatus } from '../types';

export function useDisputes(status?: DisputeStatus) {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDisputes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await disputeService.getDisputes(status);
      
      if (response.success) {
        // Convert timestamp strings to Date objects
        const disputesWithDates = response.data.map(dispute => ({
          ...dispute,
          createdAt: new Date(dispute.createdAt),
          updatedAt: new Date(dispute.updatedAt),
          evidence: dispute.evidence.map(ev => ({
            ...ev,
            uploadedAt: new Date(ev.uploadedAt),
          })),
          timeline: dispute.timeline.map(event => ({
            ...event,
            timestamp: new Date(event.timestamp),
          })),
        }));
        setDisputes(disputesWithDates);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar disputas');
      console.error('Error fetching disputes:', err);
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    fetchDisputes();
  }, [fetchDisputes]);

  const createDispute = useCallback(async (payload: CreateDisputePayload) => {
    try {
      setError(null);
      const response = await disputeService.createDispute(payload);
      
      if (response.success) {
        const newDispute = {
          ...response.data,
          createdAt: new Date(response.data.createdAt),
          updatedAt: new Date(response.data.updatedAt),
          evidence: response.data.evidence.map(ev => ({
            ...ev,
            uploadedAt: new Date(ev.uploadedAt),
          })),
          timeline: response.data.timeline.map(event => ({
            ...event,
            timestamp: new Date(event.timestamp),
          })),
        };
        setDisputes(prev => [newDispute, ...prev]);
        return newDispute;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear disputa');
      console.error('Error creating dispute:', err);
      throw err;
    }
  }, []);

  const addEvidence = useCallback(async (disputeId: string, files: File[]) => {
    try {
      setError(null);
      const response = await disputeService.addEvidence(disputeId, files);
      
      if (response.success) {
        // Update the dispute in local state
        setDisputes(prev => prev.map(dispute =>
          dispute.id === disputeId
            ? {
                ...response.data,
                createdAt: new Date(response.data.createdAt),
                updatedAt: new Date(response.data.updatedAt),
                evidence: response.data.evidence.map(ev => ({
                  ...ev,
                  uploadedAt: new Date(ev.uploadedAt),
                })),
                timeline: response.data.timeline.map(event => ({
                  ...event,
                  timestamp: new Date(event.timestamp),
                })),
              }
            : dispute
        ));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al agregar evidencia');
      console.error('Error adding evidence:', err);
      throw err;
    }
  }, []);

  return {
    disputes,
    loading,
    error,
    createDispute,
    addEvidence,
    refetch: fetchDisputes,
  };
}
