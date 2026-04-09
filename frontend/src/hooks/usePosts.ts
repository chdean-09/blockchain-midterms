import { useState, useEffect, useCallback, useRef } from "react";
import { Contract } from "ethers";
import type { Post } from "../types";

export function usePosts(
  readContract: Contract | null,
  userAddress: string | null
) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [userEarnings, setUserEarnings] = useState<bigint>(0n);
  const [likedPostIds, setLikedPostIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const listenersAttached = useRef(false);

  const fetchPosts = useCallback(async () => {
    if (!readContract) return;
    try {
      const rawPosts = await readContract.getAllPosts();
      const mapped: Post[] = rawPosts.map(
        (p: [bigint, string, string, string, bigint, bigint, bigint]) => ({
          id: p[0],
          creator: p[1],
          imageUrl: p[2],
          caption: p[3],
          likes: p[4],
          totalEarned: p[5],
          timestamp: p[6],
        })
      );
      mapped.sort((a, b) => Number(b.timestamp - a.timestamp));
      setPosts(mapped);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    } finally {
      setIsLoading(false);
    }
  }, [readContract]);

  const fetchUserEarnings = useCallback(async () => {
    if (!readContract || !userAddress) return;
    try {
      const earned = await readContract.totalEarnedByUser(userAddress);
      setUserEarnings(earned);
    } catch (err) {
      console.error("Failed to fetch earnings:", err);
    }
  }, [readContract, userAddress]);

  const fetchLikedStatus = useCallback(async () => {
    if (!readContract || !userAddress || posts.length === 0) return;
    try {
      const results = await Promise.all(
        posts.map((post) => readContract.checkLiked(post.id, userAddress))
      );
      const liked = new Set<string>();
      posts.forEach((post, i) => {
        if (results[i]) liked.add(post.id.toString());
      });
      setLikedPostIds(liked);
    } catch (err) {
      console.error("Failed to fetch liked status:", err);
    }
  }, [readContract, userAddress, posts]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    fetchUserEarnings();
  }, [fetchUserEarnings]);

  useEffect(() => {
    fetchLikedStatus();
  }, [fetchLikedStatus]);

  // Listen to contract events for real-time feed updates
  useEffect(() => {
    if (!readContract || listenersAttached.current) return;
    listenersAttached.current = true;

    const handlePostCreated = () => {
      fetchPosts();
    };

    const handlePostLiked = () => {
      fetchPosts();
      fetchUserEarnings();
    };

    readContract.on("PostCreated", handlePostCreated);
    readContract.on("PostLiked", handlePostLiked);

    return () => {
      readContract.off("PostCreated", handlePostCreated);
      readContract.off("PostLiked", handlePostLiked);
      listenersAttached.current = false;
    };
  }, [readContract, fetchPosts, fetchUserEarnings]);

  const refreshAll = useCallback(async () => {
    await fetchPosts();
    await fetchUserEarnings();
  }, [fetchPosts, fetchUserEarnings]);

  return { posts, userEarnings, likedPostIds, isLoading, refreshAll };
}
