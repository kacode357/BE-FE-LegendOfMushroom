export type ContactStatus = "pending" | "processing" | "resolved" | "closed";

export type ContactDto = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  subject: string;
  message: string;
  status: ContactStatus;
  adminNote: string | null;
  adminReply: string | null;
  repliedAt: string | null;
  handledBy: string | null;
  handledAt: string | null;
  createdAt: string;
  updatedAt: string;
};
