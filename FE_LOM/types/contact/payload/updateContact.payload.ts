import type { ContactStatus } from "../response/contact.response";

export type UpdateContactPayload = {
  status?: ContactStatus;
  adminNote?: string;
};
