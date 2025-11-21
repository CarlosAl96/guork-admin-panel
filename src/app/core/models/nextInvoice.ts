export interface NextInvoice {
  id: number;
  number_of_quotas: number;
  quota_value: number;
  prox_page_date: Date;
  num_quota_payed: number;
  user_name: string;
  user_last_name: string;
  user_email: string;
  product_name: string;
  payed_percent?: number;
}
