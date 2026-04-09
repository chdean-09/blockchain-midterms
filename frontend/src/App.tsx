import { useState, useCallback } from "react";
import { formatEther } from "ethers";
import { useWallet } from "./hooks/useWallet";
import { useContract } from "./hooks/useContract";
import { usePosts } from "./hooks/usePosts";
import { ConnectWallet } from "./components/ConnectWallet";
import { NetworkGuard } from "./components/NetworkGuard";
import { CreatePostForm } from "./components/CreatePostForm";
import { PostFeed } from "./components/PostFeed";
import { TransactionStatus } from "./components/TransactionStatus";

function App() {
  const { address, provider, isCorrectNetwork, isConnecting, connect, switchNetwork } =
    useWallet();
  const { readContract, createPost, likePost, txState, clearTxState } =
    useContract(provider);
  const { posts, userEarnings, likedPostIds, isLoading, refreshAll } =
    usePosts(readContract, address);

  const [likingPostId, setLikingPostId] = useState<string | null>(null);

  const handleCreatePost = useCallback(
    async (imageUrl: string, caption: string) => {
      await createPost(imageUrl, caption);
      await refreshAll();
    },
    [createPost, refreshAll]
  );

  const handleLikePost = useCallback(
    async (postId: bigint) => {
      setLikingPostId(postId.toString());
      await likePost(postId);
      await refreshAll();
      setLikingPostId(null);
    },
    [likePost, refreshAll]
  );

  return (
    <div className="app">
      <header className="header">
        <h1 className="logo">TipPost</h1>
        <div className="header-right">
          {address && (
            <span className="earnings">
              Earned: {formatEther(userEarnings)} ETH
            </span>
          )}
          <ConnectWallet
            address={address}
            isConnecting={isConnecting}
            onConnect={connect}
          />
        </div>
      </header>

      <NetworkGuard
        isConnected={!!address}
        isCorrectNetwork={isCorrectNetwork}
        onSwitch={switchNetwork}
      >
        <main className="main">
          {address && (
            <CreatePostForm
              onSubmit={handleCreatePost}
              isPending={txState.status === "pending"}
            />
          )}
          {!address && (
            <div className="connect-prompt">
              <p>Connect your wallet to create posts and start tipping.</p>
            </div>
          )}
          <PostFeed
            posts={posts}
            userAddress={address}
            likedPostIds={likedPostIds}
            onLike={handleLikePost}
            likingPostId={likingPostId}
            isLoading={isLoading}
          />
        </main>
      </NetworkGuard>

      <TransactionStatus txState={txState} onDismiss={clearTxState} />

      <footer className="footer">
        <p>Each like tips the creator 0.0001 ETH</p>
      </footer>
    </div>
  );
}

export default App;
