import { useState } from "react";

interface CreatePostFormProps {
  onSubmit: (imageUrl: string, caption: string) => Promise<void>;
  isPending: boolean;
}

export function CreatePostForm({ onSubmit, isPending }: CreatePostFormProps) {
  const [imageUrl, setImageUrl] = useState("");
  const [caption, setCaption] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl.trim() || !caption.trim()) return;
    await onSubmit(imageUrl.trim(), caption.trim());
    setImageUrl("");
    setCaption("");
  };

  return (
    <form className="create-post-form" onSubmit={handleSubmit}>
      <h2>Create a Post</h2>
      <input
        type="text"
        placeholder="Image URL (e.g. https://picsum.photos/600/400)"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        disabled={isPending}
      />
      <input
        type="text"
        placeholder="Caption"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        disabled={isPending}
      />
      <button
        type="submit"
        disabled={isPending || !imageUrl.trim() || !caption.trim()}
      >
        {isPending ? "Creating..." : "Create Post"}
      </button>
    </form>
  );
}
