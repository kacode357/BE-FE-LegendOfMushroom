export type RegisteredAccessUser = {
  uid: string;
  name: string;
  server: string;
  avatarUrl: string;
};

export type RegisteredAccessPackage = {
  id: string | null;
  name: string | null;
};

export type RegisteredAccessItem = {
  code: string;
  usedAt: string;
  lastAccessAt: string | null;
  createdAt: string;
  user: RegisteredAccessUser;
  package: RegisteredAccessPackage;
};

export type ListRegisteredUsersResponse = {
  items: RegisteredAccessItem[];
};
