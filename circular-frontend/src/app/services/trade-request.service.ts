import { Injectable } from '@angular/core';
import { supabase } from '../supabase/superbase-client';
import { TradeRequest, CreateTradeRequestRequest } from '../pages/interfaces/trade-request.record';

@Injectable({
  providedIn: 'root'
})
export class TradeRequestService {
  
  async createTradeRequest(request: CreateTradeRequestRequest): Promise<TradeRequest | null> {
    const { data, error } = await supabase
      .from('trade_requests')
      .insert({
        requester_id: request.requesterId,
        receiver_id: request.receiverId,
        requested_article_id: request.requestedArticleId,
        offered_article_ids: request.offeredArticleIds,
        message: request.message,
        status: 'PENDING',
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Failed to create trade request:', error);
      return null;
    }

    return this.mapToTradeRequest(data);
  }

  async getReceivedRequests(userId: string): Promise<TradeRequest[]> {
    const { data, error } = await supabase
      .from('trade_requests')
      .select('*')
      .eq('receiver_id', userId)
      .order('created_at', { ascending: false });

    if (error || !data) {
      console.error('Failed to load received trade requests:', error);
      return [];
    }

    return data.map(this.mapToTradeRequest);
  }

  async getSentRequests(userId: string): Promise<TradeRequest[]> {
    const { data, error } = await supabase
      .from('trade_requests')
      .select('*')
      .eq('requester_id', userId)
      .order('created_at', { ascending: false });

    if (error || !data) {
      console.error('Failed to load sent trade requests:', error);
      return [];
    }

    return data.map(this.mapToTradeRequest);
  }

  async updateStatus(id: number, status: 'ACCEPTED' | 'REJECTED'): Promise<boolean> {
    const { error } = await supabase
      .from('trade_requests')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      console.error('Failed to update trade request status:', error);
      return false;
    }

    return true;
  }

  async getPendingRequestsByItemIds(itemIds: number[]): Promise<TradeRequest[]> {
    const { data, error } = await supabase
      .from('trade_requests')
      .select('*')
      .eq('status', 'PENDING')
      .or(`requested_article_id.in.(${itemIds.join(',')}),offered_article_ids.cs.{${itemIds.join(',')}}`);

    if (error || !data) {
      console.error('Failed to load trade requests by item IDs:', error);
      return [];
    }

    return data.map(this.mapToTradeRequest);
  }

  async rejectMultipleRequests(requestIds: number[]): Promise<boolean> {
    const { error } = await supabase
      .from('trade_requests')
      .update({ 
        status: 'REJECTED',
        updated_at: new Date().toISOString()
      })
      .in('id', requestIds);

    if (error) {
      console.error('Failed to reject multiple trade requests:', error);
      return false;
    }

    return true;
  }

  private mapToTradeRequest(data: any): TradeRequest {
    return {
      id: data.id,
      requesterId: data.requester_id,
      receiverId: data.receiver_id,
      requestedArticleId: data.requested_article_id,
      offeredArticleIds: data.offered_article_ids || [],
      message: data.message || '',
      status: data.status,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  }
}
