import { User } from "./user";
import { Request } from "./request";

export interface Assignment {
  id: string;
  requestId: string;
  status: string;
  idSuscription: string;
  assignedId: string | null;
  createdAt: Date;
  updatedAt: Date;
  assigned: User | null;
  request: Request;
}
