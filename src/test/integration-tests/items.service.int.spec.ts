import { ItemService } from '../../app/services/items.service';

jest.mock('../supabase/superbase-client', () => {
  const chain = (rows: any[]) => ({
    select: () => ({
      neq: () => ({
        or: () => ({
          order: () => ({ data: rows, error: null }),
        }),
      }),
      eq: () => ({
        or: () => ({
          order: () => ({ data: rows, error: null }),
        }),
      }),
    }),
  });
  return {
    supabase: {
      from: jest.fn().mockImplementation((table: string) => {
        if (table === 'items') {
          const rows = [
            { item_id: 1, owner_id: 'x', title: 'A' },
            { item_id: 2, owner_id: 'y', title: 'B' },
          ];
          return chain(rows);
        }
        return chain([]);
      }),
    },
  };
});


describe('ItemService (integration)', () => {
  let service: ItemService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ItemService();
  });

  it('loadAllItems maps item_id to id', async () => {
    const result = await service.loadAllItems('u1');
    expect(result.map(r => r.id)).toEqual([1, 2]);
  });

  it('loadAllItemsOfUser maps item_id to id', async () => {
    const result = await service.loadAllItemsOfUser('u1');
    expect(result.map(r => r.id)).toEqual([1, 2]);
  });
});
