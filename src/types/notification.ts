export interface Notification {
  _id: string;
  type: 'follow' | 'like' | 'comment' | 'share' | 'message' | 'system';
  message: string;
  read: boolean;
  link?: string;
  actorId?: {
    _id: string;
    profile?: {
      nickname: string;
      avatar: string;
    };
    username: string;
  };
  createdAt: string;
  updatedAt: string;
}