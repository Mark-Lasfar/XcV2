export interface Post {
  _id: string;
  content: string;
  images?: { url: string }[];
  likes: string[];
  comments: Comment[];
  shares: string[];
  userId: {
    _id: string;
    profile?: {
      nickname: string;
      avatar: string;
    };
    username: string;
  };
  sharedFrom?: {
    originalPostId: string;
    originalAuthorId: string;
    originalAuthorName: string;
    sharedAt: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  text: string;
  userId: {
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