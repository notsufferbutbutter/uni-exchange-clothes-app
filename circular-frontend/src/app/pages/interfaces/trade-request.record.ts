export interface TradeRequest {
  id: number;
  requesterId: string;
  receiverId: string;
  requestedArticleId: number;
  offeredArticleIds: number[];
  message: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
}

export interface CreateTradeRequestRequest {
  requesterId: string;
  receiverId: string;
  requestedArticleId: number;
  offeredArticleIds: number[];
  message: string;
}
