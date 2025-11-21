import { Sale } from './sale';

export interface Seller {
  id: number;
  identification: string;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  phone: string;
  address: string;
  sales: Sale[];
  total_to_pay?: number;
  created_at: Date;
  updated_at: Date;
}
