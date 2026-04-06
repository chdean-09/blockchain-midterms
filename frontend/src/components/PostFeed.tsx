import type { Post } from "../types";
import { PostCard } from "./PostCard";

interface PostFeedProps {
  posts: Post[];
  userAddress: string | null;
  likedPostIds: Set<string>;
  onLike: (postId: bigint) => Promise<void>;
  likingPostId: string | null;
  isLoading: boolean;
}

export function PostFeed({
  posts,
  userAddress,
  likedPostIds,
  onLike,
  likingPostId,
  isLoading,
}: PostFeedProps) {
  if (isLoading) {
    return (
      <div className="post-feed-loading">
        <div className="skeleton-card" />
        <div className="skeleton-card" />
        <div className="skeleton-card" />
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="post-feed-empty">
        <p>No posts yet. Be the first to post!</p>
      </div>
    );
  }

  return (
    <div className="post-feed">
      {posts.map((post) => (
        <PostCard
          key={post.id.toString()}
          post={post}
          isOwner={userAddress?.toLowerCase() === post.creator.toLowerCase()}
          hasLiked={likedPostIds.has(post.id.toString())}
          onLike={onLike}
          isLiking={likingPostId === post.id.toString()}
        />
      ))}
    </div>
  );
}
