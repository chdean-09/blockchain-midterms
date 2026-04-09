export function parseContractError(error: unknown): string {
  const err = error as {
    code?: string;
    reason?: string;
    message?: string;
    info?: { error?: { message?: string } };
  };

  if (err.code === "ACTION_REJECTED") {
    return "Transaction rejected by user.";
  }

  if (err.code === "INSUFFICIENT_FUNDS") {
    return "Insufficient funds for this transaction.";
  }

  if (err.code === "CALL_EXCEPTION") {
    const reason = err.reason || err.info?.error?.message;
    if (reason?.includes("Already liked")) return "You already liked this post.";
    if (reason?.includes("Cannot like your own")) return "You cannot like your own post.";
    if (reason?.includes("Post does not exist")) return "This post no longer exists.";
    if (reason?.includes("Must send exactly")) return "Incorrect tip amount.";
    return reason || "Transaction failed on-chain.";
  }

  if (err.code === "NETWORK_ERROR" || err.code === "SERVER_ERROR") {
    return "Network error. Please check your connection.";
  }

  if (err.code === "TIMEOUT") {
    return "Request timed out. Please try again.";
  }

  if (err.code === "UNPREDICTABLE_GAS_LIMIT") {
    return "Transaction would fail. Check your inputs and balance.";
  }

  if (err.reason) {
    return err.reason;
  }

  return err.message || "An unknown error occurred.";
}
