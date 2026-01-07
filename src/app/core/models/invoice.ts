import { Assignment } from "./assignment";

export interface Invoice {
  id: string;
  purchaseOrder?: number;
  amount: string;
  urlInvoice: string;
  assignmentId: string;
  assignment: Assignment;
  createdAt: Date;
  dueDate?: Date;
  updatedAt: Date;
}
