import { useState } from "react";
import { formatEther } from "ethers";
import type { Post } from "../types";
import { LikeButton } from "./LikeButton";

interface PostCardProps {
  post: Post;
  isOwner: boolean;
  hasLiked: boolean;
  onLike: (postId: bigint) => Promise<void>;
  isLiking: boolean;
}

function timeAgo(timestamp: bigint): string {
  const seconds = Math.floor(Date.now() / 1000) - Number(timestamp);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export function PostCard({ post, isOwner, hasLiked, onLike, isLiking }: PostCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="post-card">
      <div className="post-image-container">
        {imgError ? (
          <div className="post-image-placeholder">Image failed to load</div>
        ) : (
          <img
            src={post.imageUrl}
            alt={post.caption}
            className="post-image"
            onError={() => setImgError(true)}
          />
        )}
      </div>
      <div className="post-body">
        <p className="post-caption">{post.caption}</p>
        <div className="post-meta">
          <span className="post-creator" title={post.creator}>
            {post.creator.slice(0, 6)}...{post.creator.slice(-4)}
          </span>
          <span className="post-time">{timeAgo(post.timestamp)}</span>
        </div>
        <div className="post-actions">
          <LikeButton
            hasLiked={hasLiked}
            isOwner={isOwner}
            likeCount={post.likes}
            onLike={() => onLike(post.id)}
            isLiking={isLiking}
          />
          <span className="post-earned">
            {formatEther(post.totalEarned)} ETH earned
          </span>
        </div>
      </div>
    </div>
  );
}
