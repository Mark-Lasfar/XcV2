export interface User {
  _id: string;
  id?: string;
  username: string;
  email: string;
  nickname?: string;
  avatar?: string;
  jobTitle?: string;
  bio?: string;
  profile?: {
    nickname?: string;
    avatar?: string;
    jobTitle?: string;
    bio?: string;
  };
  isAdmin?: boolean;
  createdAt: string;
  updatedAt: string;
  isVerified?: boolean;
  isActive?: boolean;
  role?: 'user' | 'admin' | 'moderator';
}