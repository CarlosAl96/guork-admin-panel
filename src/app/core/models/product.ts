export interface Product {
  id: number;
  price: number;
  name: string;
  url_image: string;
  category: string;
  sub_category?: string;
  atributes: string;
  is_view: boolean;
  date: Date;
  outstanding: boolean;
  code_dealer: number;
  differential: number | null;
  earnings_percent: number | null;
  discount_usd: number | null;
}
