export type DashboardStats = {
  packages: {
    total: number;
  };
  accessCodes: {
    total: number;
    active: number;
    used: number;
    expired: number;
  };
  members: {
    total: number;
    verified: number;
    unverified: number;
  };
  contacts: {
    total: number;
    pending: number;
    processing: number;
    resolved: number;
  };
  admins: {
    total: number;
  };
  notifications: {
    total: number;
  };
};

export type RecentContact = {
  id: string;
  name: string;
  subject: string;
  status: string;
  createdAt: string;
};

export type RecentMember = {
  id: string;
  email: string;
  isVerified: boolean;
  createdAt: string;
};

export type RecentAccessCode = {
  id: string;
  code: string;
  status: string;
  createdAt: string;
};

export type RecentActivity = {
  recentContacts: RecentContact[];
  recentMembers: RecentMember[];
  recentAccessCodes: RecentAccessCode[];
};
