import { Profile } from "./profile";
import { User } from "./user";

export interface Request {
  id: string;
  employmentType: string;
  amount: number;
  requesterId: string;
  status: string;
  urlAgent: string;
  profileId: string;
  requester: User;
  profile: Profile;
  createdAt: Date;
  updatedAt: Date;
}
