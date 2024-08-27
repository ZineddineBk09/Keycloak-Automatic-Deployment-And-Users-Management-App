export interface User {
  id: string;
  username: string;
}

export interface History {
  id: string;
  user: User;
  error?: {
    code: string;
    message: string;
  };
}

export interface Batch {
  id: string;
  batchName: string;
  histories: History[];
  timestamp: Date;
}
