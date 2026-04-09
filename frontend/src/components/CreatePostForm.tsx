import { useState } from "react";

interface CreatePostFormProps {
  onSubmit: (imageUrl: string, caption: string) => Promise<void>;
  isPending: boolean;
}

export function CreatePostForm({ onSubmit, isPending }: CreatePostFormProps) {
  const [imageUrl, setImageUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [previewError, setPreviewError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl.trim() || !caption.trim()) return;
    await onSubmit(imageUrl.trim(), caption.trim());
    setImageUrl("");
    setCaption("");
    setPreviewError(false);
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value);
    setPreviewError(false);
  };

  const showPreview = imageUrl.trim().length > 0 && !previewError;

  return (
    <form className="create-post-form" onSubmit={handleSubmit}>
      <h2>Create a Post</h2>
      <input
        type="text"
        placeholder="Image URL (e.g. https://picsum.photos/600/400)"
        value={imageUrl}
        onChange={handleImageUrlChange}
        disabled={isPending}
      />
      {showPreview && (
        <div className="image-preview">
          <img
            src={imageUrl.trim()}
            alt="Preview"
            onError={() => setPreviewError(true)}
          />
        </div>
      )}
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
