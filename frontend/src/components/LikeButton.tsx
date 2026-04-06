interface LikeButtonProps {
  hasLiked: boolean;
  isOwner: boolean;
  likeCount: bigint;
  onLike: () => void;
  isLiking: boolean;
}

export function LikeButton({
  hasLiked,
  isOwner,
  likeCount,
  onLike,
  isLiking,
}: LikeButtonProps) {
  const disabled = hasLiked || isOwner || isLiking;

  let title = "Like this post (0.0001 ETH)";
  if (hasLiked) title = "You already liked this post";
  if (isOwner) title = "You can't like your own post";

  return (
    <button
      className={`like-btn ${hasLiked ? "liked" : ""} ${isOwner ? "own-post" : ""}`}
      onClick={onLike}
      disabled={disabled}
      title={title}
    >
      <span className="heart">{hasLiked ? "\u2764\uFE0F" : "\uD83E\uDD0D"}</span>
      <span className="like-count">{likeCount.toString()}</span>
      {isLiking && <span className="like-spinner" />}
    </button>
  );
}
