export interface Contract {
  id: number;
  id_user: number;
  id_product: number;
  number_of_quotas: number;
  num_quota_payed: number;
  quota_value: number;
  total_value: number;
  signing: string;
  created_date: Date;
  code_dealer: number;
  user_name?: string;
  user_last_name?: string;
  user_email?: string;
  product_name?: string;
  prox_page_date?: Date;
  payed_percent?: number;
  rating?: number;
}
