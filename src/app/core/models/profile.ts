export interface Profile {
  id: string;
  name: string;
  status: string;
  descriptions?: string;
  amount?: number;
  partTimeAmount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
