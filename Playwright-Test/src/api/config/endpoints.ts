
export const endpoints = {
  users: '/api/users',
  exportUsers: '/api/users/export',
  userById: (id: string) => `/api/users/${id}`,
  userAvatar: (id: string) => `/api/users/${id}/avatar`,
  userCsv: (id: string) => `/api/users/${id}/csv`,
  register: '/api/auth/register',
  login: '/api/auth/login',
  health: '/api/health',
};