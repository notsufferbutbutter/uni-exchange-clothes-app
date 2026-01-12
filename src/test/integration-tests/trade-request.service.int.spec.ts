import { TradeRequestService } from '../../app/services/trade-request.service';

jest.mock('../supabase/superbase-client', () => {
  const chain = (rows: any[]) => ({
    select: () => ({
      eq: () => ({ order: () => ({ data: rows, error: null }) }),
      or: () => ({ data: rows, error: null }),
      in: () => ({ data: rows, error: null }),
    }),
    update: () => ({ eq: () => ({ error: null }) }),
  });
  return {
    supabase: {
      from: jest.fn().mockImplementation((table: string) => {
        if (table === 'trade_requests') {
          const rows = [
            { id: 1, requester_id: 'u2', receiver_id: 'u1', requested_item_id: 10, offered_item_ids: [20], message: 'hi', status: 'PENDING', created_at: 't', updated_at: 't' },
          ];
          return chain(rows);
        }
        return chain([]);
      }),
    },
  };
});


describe('TradeRequestService (integration)', () => {
  let service: TradeRequestService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new TradeRequestService();
  });

  it('getReceivedRequests maps fields correctly', async () => {
    const result = await service.getReceivedRequests('u1');
    expect(result[0]).toEqual({
      id: 1,
      requesterId: 'u2',
      receiverId: 'u1',
      requestedArticleId: 10,
      offeredArticleIds: [20],
      message: 'hi',
      status: 'PENDING',
      createdAt: 't',
      updatedAt: 't',
    });
  });

  it('updateStatus returns true on success', async () => {
    const ok = await service.updateStatus(1, 'ACCEPTED');
    expect(ok).toBe(true);
  });
});
