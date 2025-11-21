export interface Sale {
  id: number;
  seller_id: number;
  user_id: number;
  contract_id: number;
  buyer_name: string;
  product_name: string;
  amount_to_pay: number;
  is_paid: boolean;
  created_at: Date;
  updated_at: Date;
}
