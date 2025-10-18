export interface DashboardStats {
  totalUsers: number;
  verifiedUsers: number;
  unverifiedUsers: number;
  newUsersToday: number;
  newUsersWeek: number;
  newUsersMonth: number;
  verificationRate: number;
}

export interface RecentUser {
  id: string;
  email: string;
  name: string | null;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RecentUsersResponse {
  users: RecentUser[];
  total: number;
  limit: number;
  offset: number;
}

export interface UserGrowthData {
  date: string;
  count: number;
}

export interface UserActivity {
  activeLastDay: number;
  activeLastWeek: number;
}
