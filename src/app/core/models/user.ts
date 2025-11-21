export interface User {
  id: number;
  name: string;
  last_name: string;
  email: string;
  identification: string;
  birthdate: string;
  date: Date;
  role: string;
  code_dealer: number;
  city: string;
  street: string;
  postal_code: string;
  phone: string;
  receiver: string;
  totalexpense: number;
  quotastotal: number;
  quotascomplete: number;
  paystime: number;
  paystotal: number;
  contributions: number;
  rating: number;
  dni_img: string | null;
}
