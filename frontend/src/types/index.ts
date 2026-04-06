export interface Post {
  id: bigint;
  creator: string;
  imageUrl: string;
  caption: string;
  likes: bigint;
  totalEarned: bigint;
  timestamp: bigint;
}

export interface TransactionState {
  status: "idle" | "pending" | "success" | "error";
  message: string;
  hash?: string;
}
