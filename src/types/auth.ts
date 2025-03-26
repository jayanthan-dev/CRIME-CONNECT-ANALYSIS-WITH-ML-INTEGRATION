export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
  name: string;
  badge_number?: string;
  department?: string;
  created_at: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export const MOCK_USERS = [
  {
    id: '1',
    email: 'admin@gmail.com',
    password: '12345',
    role: 'admin',
    name: 'Admin User',
    badge_number: 'ADM001',
    department: 'Administration',
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    email: 'user@gmail.com',
    password: '12345',
    role: 'user',
    name: 'Regular User',
    badge_number: 'OFF001',
    department: 'Operations',
    created_at: new Date().toISOString()
  }
];