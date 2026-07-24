
export const endpoints = {
  users: '/api/users',
  userById: (id: string) => `/api/users/${id}`,
  register: 'api/auth/register',
  login: 'api/auth/login',

};