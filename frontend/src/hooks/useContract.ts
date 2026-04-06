import { useState, useMemo, useCallback } from "react";
import { Contract, BrowserProvider, parseEther } from "ethers";
import TipPostABI from "../abi/TipPost.json";
import { CONTRACT_ADDRESS, LIKE_COST_ETH } from "../config";
import type { TransactionState } from "../types";
import { parseContractError } from "../utils/errors";

export function useContract(provider: BrowserProvider | null) {
  const [txState, setTxState] = useState<TransactionState>({
    status: "idle",
    message: "",
  });

  const readContract = useMemo(() => {
    if (!provider || !CONTRACT_ADDRESS) return null;
    return new Contract(CONTRACT_ADDRESS, TipPostABI, provider);
  }, [provider]);

  const getWriteContract = useCallback(async () => {
    if (!provider) throw new Error("Wallet not connected");
    const signer = await provider.getSigner();
    return new Contract(CONTRACT_ADDRESS, TipPostABI, signer);
  }, [provider]);

  const createPost = useCallback(
    async (imageUrl: string, caption: string) => {
      setTxState({ status: "pending", message: "Creating post..." });
      try {
        const contract = await getWriteContract();
        const tx = await contract.createPost(imageUrl, caption);
        await tx.wait();
        setTxState({
          status: "success",
          message: "Post created successfully!",
          hash: tx.hash,
        });
      } catch (err) {
        setTxState({
          status: "error",
          message: parseContractError(err),
        });
      }
    },
    [getWriteContract]
  );

  const likePost = useCallback(
    async (postId: bigint) => {
      setTxState({ status: "pending", message: "Sending tip..." });
      try {
        const contract = await getWriteContract();
        const tx = await contract.likePost(postId, {
          value: parseEther(LIKE_COST_ETH),
        });
        await tx.wait();
        setTxState({
          status: "success",
          message: "Tip sent successfully!",
          hash: tx.hash,
        });
      } catch (err) {
        setTxState({
          status: "error",
          message: parseContractError(err),
        });
      }
    },
    [getWriteContract]
  );

  const clearTxState = useCallback(() => {
    setTxState({ status: "idle", message: "" });
  }, []);

  return { readContract, createPost, likePost, txState, clearTxState };
}
