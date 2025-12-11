
export interface Item {
  id: number;
  title: string;
  description: string;
  price: number | null;
  images: string[];
  created_at: string;
  updated_at: string;
  is_archived?: boolean;

  owner_id: string;
  category: string;
  size: string;
  condition: string;

  // Expanded Joins
  owner?: any;
}
