export type NotificationDto = {
  id: string;
  packageId: string;
  title: string;
  content: string;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
};
