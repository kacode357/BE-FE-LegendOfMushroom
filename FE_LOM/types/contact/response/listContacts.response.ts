import type { ContactDto } from "./contact.response";

export type ListContactsResponse = {
  items: ContactDto[];
  total: number;
};
