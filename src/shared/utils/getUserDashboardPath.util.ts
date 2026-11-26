const userDashboardPath: Record<string, string> = {
  pemohon: "/dashboard/pemohon",
  admin: "/dashboard/admin",
};

export function getUserDashboardPath(userType: string) {
  return userDashboardPath[userType];
}
