export interface Invoice {
  id: number;
  id_contract: number;
  user_name: string;
  user_email: string;
  product_name: string;
  amount: number;
  payment_ref: string;
  payment_method: string;
  payment_date: string;
  payment_prox_date: string;
  num_reference?: string;
  img?: string;
  verified_payment: boolean;
  email_send?: string;
  name_send?: string;
  pendient_amount: boolean;
  code_dealer: number;

  phone?: string;
  dni?: string;
}
