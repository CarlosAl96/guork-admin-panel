export interface PushNotification {
  id: number;
  title: string;
  content: string;
  userIds: string[];
  createdAt: Date;
  updatedAt: Date;
}
